(() => {
 const api=async(action,body,csrf)=>{
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),12000);
  try{
   const response=await fetch('/api/cms?action='+action,{method:body?'POST':'GET',headers:body?{'Content-Type':'application/json',...(csrf?{'X-CSRF-Token':csrf}:{})}:{},body:body?JSON.stringify(body):undefined,signal:controller.signal});
   const result=await response.json();if(!response.ok)throw Error(result.error||'暫時無法連線');return result;
  }catch(error){if(error.name==='AbortError')throw Error(body?'連線逾時，請確認資料是否已儲存後再操作。':'連線逾時，請稍後重試。');throw error}
  finally{clearTimeout(timeout)}
 };
 const date=value=>new Intl.DateTimeFormat(document.documentElement.lang==='en'?'en-GB':'zh-TW',{timeZone:'Asia/Taipei',dateStyle:'medium',timeStyle:'short'}).format(new Date(value));
 const node=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e};
 const newsList=document.querySelector('#news-list');
 if(newsList){
  const english=document.documentElement.lang==='en';
  const load=async()=>{
   newsList.setAttribute('aria-busy','true');
   const skeleton=document.createElement('div');skeleton.setAttribute('aria-hidden','true');
   skeleton.innerHTML=Array.from({length:3},()=>'<div class="news-skeleton"><span class="skeleton skeleton-date"></span><span class="skeleton skeleton-title"></span></div>').join('');
   const label=node('span',english?'Loading announcements…':'正在載入公告…');label.className='sr-only';newsList.replaceChildren(skeleton,label);
   try{
    const data=await api('content');if(!Array.isArray(data.news))throw Error('Invalid announcements');
    const fragment=document.createDocumentFragment();
    if(!data.news.length)fragment.append(node('p',english?'No announcements yet.':'目前尚無公告。'));
    data.news.forEach(item=>{const title=english&&item.titleEn?.trim()?item.titleEn:item.title, text=english&&item.bodyEn?.trim()?item.bodyEn:item.body;const details=node('details');details.className='news-item';const summary=node('summary');const time=node('time',date(item.createdAt));time.dateTime=item.createdAt;const heading=node('span',title);heading.lang=english&&item.titleEn?.trim()?'en':'zh-Hant';summary.append(time,heading);const body=node('div',text);body.lang=english&&item.bodyEn?.trim()?'en':'zh-Hant';body.className='news-body';details.append(summary,body);if(item.images?.length)details.append(window.COZ_NEWS_MEDIA.gallery(item.images,title));fragment.append(details)});
    newsList.replaceChildren(fragment);
   }catch{
    const message=node('p',english?'Announcements could not be loaded. Please try again.':'最新消息暫時無法載入，請再試一次。');
    const retry=node('button',english?'Try again':'重新載入');retry.type='button';retry.className='load-retry';retry.addEventListener('click',load,{once:true});newsList.replaceChildren(message,retry);
   }finally{newsList.setAttribute('aria-busy','false')}
  };load();
 }
 const login=document.querySelector('#admin-login');if(!login)return;
 window.COZ_NEWS_MEDIA.editor(document.querySelector('#admin-news'));
 document.querySelectorAll('[data-create-form]').forEach(button=>button.addEventListener('click',()=>{
  const form=document.getElementById(button.dataset.createForm),dialog=form.closest('dialog');
  dialog.querySelector('.admin-create-status').textContent='';
  dialog.showModal();form.querySelector('select, input, textarea')?.focus();
 }));
 document.querySelectorAll('.admin-create-dialog').forEach(dialog=>{
  const message=node('p');message.className='admin-create-status';message.setAttribute('role','status');dialog.append(message);
  const busy=()=>dialog.querySelector('form').getAttribute('aria-busy')==='true';
  dialog.querySelector('[data-close-create]').addEventListener('click',()=>{if(!busy())dialog.close()});
  dialog.addEventListener('cancel',event=>{if(busy())event.preventDefault()});
 });
 const pending=form=>{
  const button=form.querySelector('button[type="submit"]');if(button.disabled)return null;
  const uploadField=form.querySelector('.news-upload');if(uploadField)uploadField.disabled=true;
  const label=button.textContent;button.disabled=true;button.textContent='處理中…';form.setAttribute('aria-busy','true');
  return ()=>{if(uploadField)uploadField.disabled=false;button.disabled=false;button.textContent=label;form.setAttribute('aria-busy','false')};
 };
 let csrf='';const status=document.querySelector('#admin-status'),dashboard=document.querySelector('#admin-dashboard');
 const showAdminView=(focus=false)=>{
  const view=['news','roles'].includes(location.hash.slice(1))?location.hash.slice(1):'home';
  for(const [name,id] of [['home','admin-home'],['news','admin-news-view'],['roles','admin-roles-view']])document.getElementById(id).hidden=name!==view;
  if(focus){
   status.textContent='';
   const active=document.getElementById(view==='home'?'admin-home':`admin-${view}-view`);
   active.querySelector('h2, button')?.focus({preventScroll:true});
   window.scrollTo({top:0,behavior:'instant'});
  }
 };
 document.querySelectorAll('[data-admin-view]').forEach(button=>button.addEventListener('click',()=>{location.hash=button.dataset.adminView}));
 window.addEventListener('hashchange',()=>{if(!dashboard.hidden)showAdminView(true)});
 let works=[];
 const workPicker=input=>{
  let select=input.parentElement.querySelector('.work-choice');
  if(!select){
   select=node('select');select.className='work-choice';select.setAttribute('aria-label','選擇現有作品或新增作品');input.before(select);
   select.addEventListener('change',()=>{input.value=select.value;input.hidden=!!select.value;if(!select.value)input.focus()});
   input.form.addEventListener('reset',()=>queueMicrotask(()=>{select.value='';input.hidden=false}));
  }
  const option=node('option','＋ 輸入新作品');option.value='';select.replaceChildren(option,...works.map(work=>{const option=node('option',work);option.value=work;return option}));
  select.value=works.includes(input.value)?input.value:'';input.hidden=!!select.value;input.placeholder='輸入新作品名稱';
 };
 const renderList=(target,items,action)=>{
  if(!items.length){target.replaceChildren(node('p','目前沒有資料。'));return}
  target.replaceChildren(...items.map(item=>{
   const card=node('article');card.className='admin-entry';
   card.append(node('h3',action==='news'?item.title:item.work+' · '+item.character));
   const detail=node('p',action==='news'?date(item.createdAt):'尺碼：'+item.size);card.append(detail);
   if(action==='news'){const body=node('p',item.body);body.className='admin-entry-body';card.append(body);card.append(node('p',item.titleEn?.trim()&&item.bodyEn?.trim()?'英文版已填寫':item.titleEn?.trim()||item.bodyEn?.trim()?'英文版部分填寫；缺少內容將顯示中文':'英文版未填寫，將顯示中文'));if(item.images?.length)card.append(node('p',item.images.length+' 張圖片'))}
   const controls=node('div');controls.className='admin-entry-actions';
   const edit=node('button','編輯'),remove=node('button','刪除');edit.type=remove.type='button';remove.className='delete-entry';controls.append(edit,remove);card.append(controls);
   const form=node('form');form.className='cms-form';form.hidden=true;
   const fields=action==='news'?[['title','中文標題'],['body','中文內文'],['titleEn','英文標題（選填）'],['bodyEn','英文內文（選填）']]:[['work','作品名稱'],['character','角色名稱'],['size','尺碼']];
   for(const [key,labelText] of fields){const label=node('label',labelText),input=node(key.startsWith('body')?'textarea':'input');input.name=key;input.required=!key.endsWith('En');input.maxLength=key.startsWith('body')?12000:200;input.value=item[key]||'';if(key.endsWith('En'))input.lang='en';if(key.startsWith('body'))input.rows=6;label.append(input);form.append(label)}
   const save=node('button','儲存修改');save.type='submit';const cancel=node('button','取消');cancel.type='button';form.append(save,cancel);card.append(form);
   if(action==='roles')workPicker(form.querySelector('[name="work"]'));
   else window.COZ_NEWS_MEDIA.editor(form,item.images||[]);
   edit.addEventListener('click',()=>{form.hidden=false;controls.hidden=true;form.querySelector('select, input, textarea').focus()});
   cancel.addEventListener('click',()=>{for(const [key] of fields)form.elements.namedItem(key).value=item[key]||'';if(action==='roles')workPicker(form.querySelector('[name="work"]'));if(form.newsMedia){form.newsMedia.ids=[...(item.images||[])];form.newsMedia.files=[];form.newsMedia.render()}form.hidden=true;controls.hidden=false;edit.focus()});
   form.addEventListener('submit',async event=>{
    event.preventDefault();const restore=pending(form);if(!restore)return;cancel.disabled=true;
    try{const values=action==='news'?await window.COZ_NEWS_MEDIA.collect(form,api,csrf):Object.fromEntries(new FormData(form));await api(action,{...values,operation:'update',id:item.id},csrf);status.textContent='修改已儲存';form.hidden=true;controls.hidden=false;try{await refresh()}catch{status.textContent+='；列表暫時無法更新，請重新整理，無須重複送出。'}}
    catch(error){status.textContent=error.message}finally{restore();cancel.disabled=false}
   });
   remove.addEventListener('click',async()=>{
    if(!confirm('確定刪除「'+(item.title||item.character)+'」？刪除後將不再顯示於前台。'))return;
    remove.disabled=edit.disabled=true;
    try{await api(action,{operation:'delete',id:item.id},csrf);status.textContent='資料已刪除';card.remove();try{await refresh()}catch{status.textContent+='；列表暫時無法更新，請重新整理。'}}
    catch(error){status.textContent=error.message}finally{remove.disabled=edit.disabled=false}
   });
   return card;
  }));
 };
 const renderRoleGroups=roles=>{
  const target=document.querySelector('#admin-role-list');
  const opened=new Set([...target.querySelectorAll('.admin-work-group[open]')].map(group=>group.dataset.work));
  target.replaceChildren(...works.map(work=>{
   const entries=roles.filter(role=>role.work===work);
   const group=node('details');group.className='admin-work-group';group.dataset.work=work;group.open=opened.has(work);
   const summary=node('summary');summary.append(node('span',work),node('small',`${entries.length} 位角色`));
   const contents=node('div');contents.className='admin-work-entries';
   renderList(contents,entries,'roles');group.append(summary,contents);return group;
  }));
 };
 const refresh=async()=>{
  const data=await api('dashboard');csrf=data.csrf;login.hidden=true;dashboard.hidden=false;document.querySelector('h1').textContent='COz Cos 管理後台';document.querySelector('#traffic-today').textContent=data.today;document.querySelector('#traffic-month').textContent=data.month;
  works=[...new Set([...(data.works||[]),...data.roles.map(role=>role.work)])].sort((a,b)=>a.localeCompare(b,'zh-Hant'));
  workPicker(document.querySelector('#admin-role [name="work"]'));
  renderList(document.querySelector('#admin-news-list'),data.news,'news');renderRoleGroups(data.roles);
  showAdminView();
 };
 login.addEventListener('submit',async event=>{event.preventDefault();const restore=pending(login);if(!restore)return;try{await api('login',Object.fromEntries(new FormData(login)));login.reset();await refresh();status.textContent='已登入'}catch(error){status.textContent=error.message}finally{restore()}});
 for(const [id,action] of [['admin-news','news'],['admin-role','roles']]){const form=document.getElementById(id);form.addEventListener('submit',async event=>{event.preventDefault();const restore=pending(form);if(!restore)return;try{const values=action==='news'?await window.COZ_NEWS_MEDIA.collect(form,api,csrf):Object.fromEntries(new FormData(form));await api(action,values,csrf);form.reset();form.closest('dialog')?.close();status.textContent=action==='news'?'公告已發布':'角色已新增';try{await refresh()}catch{status.textContent+='；列表暫時無法更新，請重新整理，無須重複送出。'}}catch(error){status.textContent=error.message;const message=form.closest('dialog')?.querySelector('.admin-create-status');if(message)message.textContent=error.message}finally{restore()}})}
 document.querySelector('#admin-logout').addEventListener('click',async event=>{const button=event.currentTarget;button.disabled=true;try{await api('logout',{},csrf);location.reload()}catch(error){status.textContent=error.message;button.disabled=false}});
 refresh().catch(()=>{});
})();
