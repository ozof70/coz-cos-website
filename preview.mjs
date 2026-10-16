import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {createCMS} from './server/cms.mjs';
import {localStore} from './server/local-store.mjs';
const localSecrets=JSON.parse(await readFile('.local-admin.json','utf8'));
const cms=createCMS(localStore,localSecrets);
const root=resolve('.');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.xml':'application/xml','.txt':'text/plain; charset=utf-8'};
createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://'+req.headers.host);
 if(url.pathname==='/api/cms'){
  let body='';for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>3000000){res.writeHead(413).end();return}}
  const response=await cms(new Request(url,{method:req.method,headers:req.headers,body:['GET','HEAD'].includes(req.method)?undefined:body}));
  res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));return;
 }
 const name=decodeURIComponent(url.pathname);
 if(name.split('/').some(p=>p.startsWith('.'))||/^\/(server|netlify|photo-originals|node_modules)(\/|$)/.test(name)){res.writeHead(403).end();return;}
 const file=resolve(root,'.'+(name==='/'?'/index.html':name));if(!file.startsWith(root+sep)){res.writeHead(403).end();return;}const body=await readFile(file);res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream'}).end(body);
 }catch{res.writeHead(404).end('Not found');}}).listen(4173,'127.0.0.1',()=>console.log('Local: http://localhost:4173'));

