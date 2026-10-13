window.COZ_ROLES_READY=(async()=>{
 if(!document.querySelector('#role-search'))return;
 try{const response=await fetch('/api/cms?action=content');if(!response.ok)return;const data=await response.json();
 for(const role of data.roles||[]){let group=[...document.querySelectorAll('details.role-group')].find(g=>g.querySelector('.work-name').textContent===role.work);
 if(!group){group=document.createElement('details');group.className='role-group service-reveal role-reveal';group.style.setProperty('--reveal-x',document.querySelectorAll('.role-group').length%2?'24px':'-24px');group.innerHTML='<summary><span class="work-name"></span><span class="work-count"></span><span class="work-toggle" aria-hidden="true">+</span></summary><div class="role-table-wrap"></div>';group.querySelector('.work-name').textContent=role.work;const table=document.querySelector('.role-table').cloneNode(true);table.querySelector('tbody').replaceChildren();table.querySelector('caption').textContent=role.work;group.querySelector('.role-table-wrap').append(table);document.querySelector('#role-empty').before(group)}
 const row=document.createElement('tr');row.dataset.role='';row.className='service-reveal role-reveal';row.style.setProperty('--reveal-x',group.querySelectorAll('[data-role]').length%2?'24px':'-24px');for(const text of [role.work,role.character,role.size]){const cell=document.createElement('td');cell.textContent=text;row.append(cell)}group.querySelector('tbody').append(row)}
 }catch{/* The original static character collection remains available. */}
})();
