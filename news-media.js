(() => {
 const imageURL=id=>'/api/cms?action=image&id='+encodeURIComponent(id);
 const make=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e};
 const english=document.documentElement.lang==='en';
 function gallery(ids,title,zoom=true){
  const wrapper=make('section');wrapper.className='news-gallery';wrapper.setAttribute('aria-label',english?'Announcement images':'公告圖片');
  const track=make('div');track.className='news-image-track';track.tabIndex=0;track.setAttribute('aria-label',english?'Swipe to browse images':'左右滑動瀏覽圖片');
  ids.forEach((id,index)=>{const slide=make('div');slide.className='news-slide';const image=make('img');image.src=imageURL(id);image.alt=title+' '+(index+1);image.loading='lazy';image.decoding='async';
   if(zoom){const button=make('button');button.type='button';button.className='news-zoom';button.setAttribute('aria-label',(english?'Enlarge image ':'放大圖片 ')+(index+1));button.append(image);button.addEventListener('click',()=>enlarge(ids,title,index));slide.append(button)}else slide.append(image);track.append(slide)});
  wrapper.append(track);
  if(ids.length>1){const controls=make('div');controls.className='news-gallery-controls news-gallery-dots';controls.setAttribute('aria-label',english?'Choose an image':'選擇圖片');const count=make('span');count.className='sr-only';count.setAttribute('aria-live','polite');
   const index=()=>Math.round(track.scrollLeft/(track.clientWidth||1));
   const move=target=>track.scrollTo({left:Math.max(0,Math.min(ids.length-1,target))*track.clientWidth,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
   const dots=ids.map((id,i)=>{const dot=make('button');dot.type='button';dot.className='news-gallery-dot';dot.setAttribute('aria-label',english?'Image '+(i+1)+' of '+ids.length:'第 '+(i+1)+' 張，共 '+ids.length+' 張');dot.addEventListener('click',()=>move(i));controls.append(dot);return dot});
   const update=()=>{const current=index();count.textContent=(current+1)+' / '+ids.length;dots.forEach((dot,i)=>dot.setAttribute('aria-current',i===current?'true':'false'))};
   track.addEventListener('scroll',update,{passive:true});track.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();move(index()+(event.key==='ArrowLeft'?-1:1))}});controls.append(count);wrapper.append(controls);update();
  }
  return wrapper;
 }
 function enlarge(ids,title,index){
  const dialog=make('dialog');dialog.className='news-lightbox';dialog.setAttribute('aria-label',english?'Enlarged announcement images':'公告圖片放大檢視');const close=make('button',english?'Close':'關閉');close.type='button';close.className='news-lightbox-close';close.addEventListener('click',()=>dialog.close());const view=gallery(ids,title,false);dialog.append(close,view);document.body.append(dialog);dialog.addEventListener('close',()=>dialog.remove(),{once:true});dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});dialog.showModal();const track=view.querySelector('.news-image-track');track.scrollLeft=index*track.clientWidth;track.dispatchEvent(new Event('scroll'));close.focus();
 }
 function editor(form,existing=[]){
  const state={ids:[...existing],files:[]};form.newsMedia=state;
  const field=make('fieldset');field.className='news-upload';const legend=make('legend','公告圖片（選填，最多 8 張）');const input=make('input');input.type='file';input.accept='image/jpeg,image/png,image/webp';input.multiple=true;input.setAttribute('aria-label','選擇公告圖片');const note=make('p','可多選 JPG、PNG、WebP，圖片會自動縮小。顯示於內文下方，多張可左右滑動。');note.className='service-note';const list=make('div');list.className='news-upload-preview';const status=make('p');status.setAttribute('role','status');
  const render=()=>{list.replaceChildren();state.ids.forEach((id,i)=>{const tile=make('div');const img=make('img');img.src=imageURL(id);img.alt='已上傳圖片 '+(i+1);const remove=make('button','移除');remove.type='button';remove.addEventListener('click',()=>{state.ids.splice(i,1);render()});tile.append(img,remove);list.append(tile)});state.files.forEach((file,i)=>{const tile=make('div');const name=make('span',(i+1)+'. '+file.name);const remove=make('button','移除');remove.type='button';remove.addEventListener('click',()=>{state.files.splice(i,1);render()});tile.append(name,remove);list.append(tile)})};
  input.addEventListener('change',()=>{const files=[...input.files];input.value='';if(state.ids.length+state.files.length+files.length>8){status.textContent='每則公告最多 8 張圖片。';return}if(files.some(file=>!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>12582912)){status.textContent='請選擇每張 12MB 以內的 JPG、PNG 或 WebP 圖片。';return}state.files.push(...files);status.textContent='';render()});
  field.append(legend,input,note,list,status);form.insertBefore(field,form.querySelector('button[type="submit"]'));form.addEventListener('reset',()=>{state.ids=[];state.files=[];status.textContent='';render()});state.render=render;render();
 }
 async function compress(file){
  const url=URL.createObjectURL(file);const image=new Image();try{image.src=url;await image.decode();const scale=Math.min(1,1600/Math.max(image.naturalWidth,image.naturalHeight));const canvas=document.createElement('canvas');canvas.width=Math.round(image.naturalWidth*scale);canvas.height=Math.round(image.naturalHeight*scale);canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',.84));if(!blob||blob.size>2097152)throw Error('圖片壓縮後仍過大，請縮小後再上傳。');const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);reader.onerror=reject;reader.readAsDataURL(blob)});return {mime:blob.type,data}}finally{URL.revokeObjectURL(url)}
 }
 async function collect(form,api,csrf){
  const state=form.newsMedia;while(state.files.length){const result=await api('upload',await compress(state.files[0]),csrf);state.ids.push(result.id);state.files.shift();state.render()}
  return {title:form.elements.namedItem('title').value,body:form.elements.namedItem('body').value,titleEn:form.elements.namedItem('titleEn').value,bodyEn:form.elements.namedItem('bodyEn').value,images:state.ids};
 }
 window.COZ_NEWS_MEDIA={gallery,editor,collect};
})();
