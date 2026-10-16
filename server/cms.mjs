import {createHash,createHmac,randomBytes,scryptSync,timingSafeEqual} from 'node:crypto';
import serviceData from '../service-data.json' with {type:'json'};
const catalog=serviceData.roles.map(({work,character,size})=>({id:'catalog-'+createHash('sha256').update(JSON.stringify([work,character,size])).digest('hex').slice(0,24),work:work?.trim()||'未註明作品',character,size}));
const effectiveRoles=stored=>{
 const entries=new Map(catalog.map(role=>[role.id,role]));
 for(const role of stored||[]) {if(role.deleted)entries.delete(role.id);else entries.set(role.id,role)}
 return [...entries.values()];
};
const json=(body,status=200,headers={})=>Response.json(body,{status,headers:{'Cache-Control':'no-store',...headers}});
const equal=(a,b)=>{const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y)};
const dateKeys=()=>{const day=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Taipei'}).format(new Date());return {day,month:day.slice(0,7)}};
export function createCMS(store,secrets){
 async function change(key,update){for(let i=0;i<8;i++){const current=await store.getWithMetadata(key,{type:'json'});const next=update(current?.data);const result=await store.setJSON(key,next,current?.etag?{onlyIfMatch:current.etag}:{onlyIfNew:true});if(result.modified)return next}throw Error('Busy, please retry')}
 const sign=data=>createHmac('sha256',secrets.sessionKey).update(data).digest('base64url');
 const session=req=>{if(!secrets.sessionKey)return null;try{const cookie=req.headers.get('cookie')?.match(/(?:^|;\s*)coz_admin=([^;]+)/)?.[1];const [body,signature]=cookie.split('.');if(!equal(sign(body),signature))return null;const data=JSON.parse(Buffer.from(body,'base64url'));return data.exp>Date.now()?data:null}catch{return null}};
 return async(req)=>{
  const url=new URL(req.url),action=url.searchParams.get('action')||'content';
  try{
   if(req.method==='GET'&&action==='image'){
    const id=url.searchParams.get('id');if(!/^[a-f0-9]{32}$/.test(id||''))return json({error:'找不到圖片'},404);
    const image=await store.get('images/'+id,{type:'json'});if(!image)return json({error:'找不到圖片'},404);
    return new Response(Buffer.from(image.data,'base64'),{headers:{'Content-Type':image.mime,'Cache-Control':'public, max-age=86400, immutable','X-Content-Type-Options':'nosniff'}});
   }
   if(req.method==='GET'&&action==='content'){
    const [news,roles]=await Promise.all([store.get('news',{type:'json'}),store.get('roles',{type:'json'})]);
    return json({news:news||[],roles:effectiveRoles(roles),rolesVersion:2});
   }
   if(req.method==='POST'&&req.headers.get('origin')!==url.origin)return json({error:'來源驗證失敗'},403);
   if(req.method==='POST'&&action==='visit'){
    const data=await req.json();if(data.consent!==true||!/^\/[\w/.-]*$/.test(data.path||'')||!/^\/[\w/.-]*$/.test(data.path)||/admin/.test(data.path))return json({error:'Invalid visit'},400);
    const keys=dateKeys();const fingerprint=createHmac('sha256',secrets.sessionKey||'local').update(keys.day+'|'+(req.headers.get('x-nf-client-connection-ip')||'local')+'|'+(req.headers.get('user-agent')||'')).digest('hex');
    const slot=Math.floor(Date.now()/5000);const dedupe=await store.setJSON('dedupe/'+keys.day+'/'+fingerprint+'/'+slot,true,{onlyIfNew:true});
    if(dedupe.modified)await change('visits/'+keys.day,value=>({views:(value?.views||0)+1}));return json({ok:true});
   }
   if(action==='login'&&req.method==='POST'){
    if(!secrets.passwordHash||!secrets.salt||!secrets.sessionKey)return json({error:'管理員登入尚未完成伺服器設定'},503);
    const ip=createHmac('sha256',secrets.sessionKey).update(req.headers.get('x-nf-client-connection-ip')||'local').digest('hex');const key='attempts/'+Math.floor(Date.now()/900000)+'/'+ip;
    const attempts=await change(key,value=>({count:(value?.count||0)+1}));if(attempts.count>5)return json({error:'登入嘗試過多，請稍後再試'},429);
    const data=await req.json();if(typeof data.password!=='string'||data.password.length>128||!equal(scryptSync(data.password,secrets.salt,64).toString('hex'),secrets.passwordHash))return json({error:'密碼不正確'},401);
    const csrf=randomBytes(24).toString('hex');const body=Buffer.from(JSON.stringify({exp:Date.now()+3600000,csrf})).toString('base64url');const secure=url.protocol==='https:'?'; Secure':'';
    return json({ok:true,csrf},200,{'Set-Cookie':`coz_admin=${body}.${sign(body)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=3600${secure}`});
   }
   const auth=session(req);if(!auth)return json({error:'請先登入'},401);
   if(req.method==='POST'&&!equal(req.headers.get('x-csrf-token')||'',auth.csrf))return json({error:'請重新登入'},403);
   if(req.method==='POST'&&action==='upload'){
    if(Number(req.headers.get('content-length'))>3000000)return json({error:'圖片過大'},413);
    const image=await req.json();
    if(!['image/jpeg','image/png','image/webp'].includes(image.mime)||typeof image.data!=='string'||image.data.length>2800000||!(/^[A-Za-z0-9+/]+={0,2}$/.test(image.data)))return json({error:'請上傳 JPG、PNG 或 WebP 圖片（每張壓縮後 2MB 以內）'},400);
    const bytes=Buffer.from(image.data,'base64');
    const valid=bytes.length>=24&&bytes.length<=2097152&&(image.mime==='image/jpeg'?bytes[0]===255&&bytes[1]===216&&bytes[2]===255:image.mime==='image/png'?bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])):bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP');
    if(!valid)return json({error:'圖片格式不正確或超過 2MB'},400);
    const id=createHash('sha256').update(image.mime).update(bytes).digest('hex').slice(0,32);
    await store.setJSON('images/'+id,{mime:image.mime,data:bytes.toString('base64')},{onlyIfNew:true});return json({id},201);
   }
   if(action==='dashboard'&&req.method==='GET'){
    const {day,month}=dateKeys();
    const [visits,news,roles]=await Promise.all([Promise.all(Array.from({length:Number(day.slice(-2))},(_,index)=>store.get('visits/'+month+'-'+String(index+1).padStart(2,'0'),{type:'json'}))),store.get('news',{type:'json'}),store.get('roles',{type:'json'})]);
    const managedRoles=effectiveRoles(roles);
    const works=[...new Set([...catalog,...managedRoles].map(role=>role.work))].sort((a,b)=>a.localeCompare(b,'zh-Hant'));
    return json({csrf:auth.csrf,today:visits.at(-1)?.views||0,month:visits.reduce((sum,item)=>sum+(item?.views||0),0),day,news:news||[],roles:managedRoles,works,rolesVersion:2});
   }
   if(action==='logout'&&req.method==='POST')return json({ok:true},200,{'Set-Cookie':'coz_admin=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0'+(url.protocol==='https:'?'; Secure':'')});
   if(req.method==='POST'&&['news','roles'].includes(action)){
    const body=await req.json();const operation=body.operation||'create';
    if(!['create','update','delete'].includes(operation))return json({error:'不支援的操作'},400);
    const fields=action==='news'?['title','body']:['work','character','size'];
    if(operation!=='delete'&&fields.some(key=>typeof body[key]!=='string'||!body[key].trim()||body[key].length>(key==='body'?12000:200)))return json({error:'請完整填寫內容，或縮短過長文字'},400);
    const translations={};
    if(action==='news'&&operation!=='delete')for(const key of ['titleEn','bodyEn']){
     if(body[key]===undefined)continue;
     if(typeof body[key]!=='string'||body[key].length>(key==='bodyEn'?12000:200))return json({error:'英文內容格式不正確，或文字過長'},400);
     translations[key]=body[key].trim();
    }
    let images;
    if(action==='news'&&operation!=='delete'&&body.images!==undefined){
     if(!Array.isArray(body.images)||body.images.length>8||body.images.some(id=>typeof id!=='string'||!(/^[a-f0-9]{32}$/).test(id)))return json({error:'每則公告最多 8 張圖片'},400);
     images=[...new Set(body.images)];if((await Promise.all(images.map(id=>store.get('images/'+id,{type:'json'})))).some(image=>!image))return json({error:'圖片不存在，請重新上傳'},400);
    }
    if(operation!=='create'){
     if(typeof body.id!=='string'||!body.id)return json({error:'缺少資料編號'},400);
     try{await change(action,value=>{
      const list=value||[];const current=(action==='roles'?effectiveRoles(list):list).find(item=>item.id===body.id);
      if(!current)throw Object.assign(Error('Missing entry'),{missing:true});
      const remaining=list.filter(item=>item.id!==body.id);
      if(operation==='delete')return action==='roles'&&catalog.some(item=>item.id===body.id)?[...remaining,{id:body.id,deleted:true}]:remaining;
      const entry={...current,...translations,updatedAt:new Date().toISOString()};fields.forEach(key=>entry[key]=body[key].trim());if(images!==undefined)entry.images=images;return [entry,...remaining];
     })}catch(error){if(error.missing)return json({error:'資料已不存在，請重新整理'},404);throw error}
     return json({ok:true});
    }
    const entry={id:randomBytes(12).toString('hex'),createdAt:new Date().toISOString(),...translations};fields.forEach(key=>entry[key]=body[key].trim());if(action==='news')entry.images=images||[];
    await change(action,value=>[entry,...(value||[])]);return json({ok:true,entry},201);
   }
   return json({error:'找不到功能'},404);
  }catch{return json({error:'暫時無法完成，請稍後再試'},500)}
 };
}
