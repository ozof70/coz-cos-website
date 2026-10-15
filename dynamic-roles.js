window.COZ_MERGE_ROLE_RESPONSE=(data,originals)=>{
 if(!Array.isArray(data.roles))throw Error('Invalid roles');
 for(const role of data.roles)if(!role||['work','character','size'].some(key=>typeof role[key]!=='string'))throw Error('Invalid role');
 if(data.rolesVersion===2)return data.roles;
 const merged=new Map(originals.map(role=>[JSON.stringify([role.work,role.character,role.size]),role]));
 for(const role of data.roles)merged.set(JSON.stringify([role.work,role.character,role.size]),role);
 return [...merged.values()];
};
window.COZ_ROLES_READY=(async()=>{
 if(!document.querySelector('#role-search'))return;
 const loading=document.createElement('div');loading.className='role-loading';loading.setAttribute('role','status');loading.setAttribute('aria-busy','true');
 const english=document.documentElement.lang==='en';
 loading.innerHTML='<span class="skeleton skeleton-line" aria-hidden="true"></span><span class="sr-only">'+(english?'Checking for new characters…':'正在更新角色資料…')+'</span>';
 document.querySelector('.role-search').append(loading);
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),10000);
 try{const response=await fetch('/api/cms?action=content',{signal:controller.signal});if(!response.ok)throw Error('Unavailable');const data=await response.json();
 if(!Array.isArray(data.roles))throw Error('Invalid roles');
 const previous=[...document.querySelectorAll('details.role-group')];
 // Older servers return only additions, sometimes an empty array. They must
 // never replace the original collection with that partial response.
 const originals=previous.flatMap(group=>[...group.querySelectorAll('[data-role]')].map(row=>{const cells=row.querySelectorAll('td');return {work:cells[0].textContent,character:cells[1].textContent,size:cells[2].textContent}}));
 const roles=window.COZ_MERGE_ROLE_RESPONSE(data,originals);
 const openWorks=new Set(previous.filter(group=>group.open).map(group=>group.querySelector('.work-name').textContent));
 const visibleWorks=new Set(previous.filter(group=>group.classList.contains('visible')).map(group=>group.querySelector('.work-name').textContent));
 const template=document.querySelector('.role-table');
 const fragment=document.createDocumentFragment(),groups=new Map();
 for(const role of roles){
 if(!role||['work','character','size'].some(key=>typeof role[key]!=='string'))throw Error('Invalid role');
 let group=groups.get(role.work);
 if(!group){group=document.createElement('details');group.className='role-group service-reveal role-reveal';group.style.setProperty('--reveal-x',groups.size%2?'24px':'-24px');if(visibleWorks.has(role.work))group.classList.add('visible');group.open=openWorks.has(role.work);group.innerHTML='<summary><span class="work-name"></span><span class="work-count"></span><span class="work-toggle" aria-hidden="true">+</span></summary><div class="role-table-wrap"></div>';group.querySelector('.work-name').textContent=role.work;const table=template.cloneNode(true);table.querySelector('tbody').replaceChildren();table.querySelector('caption').textContent=role.work;group.querySelector('.role-table-wrap').append(table);groups.set(role.work,group);fragment.append(group);
 group.addEventListener('keydown',event=>{if(event.key==='Escape'&&group.open){group.open=false;group.querySelector('summary').focus();event.preventDefault()}})}
 const row=document.createElement('tr');row.dataset.role='';row.className='service-reveal role-reveal';row.style.setProperty('--reveal-x',group.querySelectorAll('[data-role]').length%2?'24px':'-24px');for(const text of [role.work,role.character,role.size]){const cell=document.createElement('td');cell.textContent=text;row.append(cell)}group.querySelector('tbody').append(row)}
 for(const group of groups.values()){const count=group.querySelectorAll('[data-role]').length;group.querySelector('.work-count').textContent=english?`${count} characters`:`${count} 位角色`}
 previous.forEach(group=>group.remove());document.querySelector('#role-empty').before(fragment);
 window.COZ_OBSERVE_REVEALS?.();
 }catch{loading.textContent=english?'New characters could not be checked. The existing collection is available.':'暫時無法更新新增角色，仍可搜尋現有角色。';loading.classList.add('load-error');}
 finally{clearTimeout(timeout);loading.setAttribute('aria-busy','false');if(!loading.classList.contains('load-error'))loading.replaceChildren();}
})();
