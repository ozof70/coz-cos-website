import {readFile,writeFile} from 'node:fs/promises';
import {serviceMenu} from './service-pages.mjs';
import {isSupportedEvent,withinEventWindow} from './update-events.mjs';
const escape = text=>String(text).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
export async function buildEventPages(head,footer){
 const data=JSON.parse(await readFile('events-data.json','utf8'));
 for(const lang of ['zh','en']){
  const zh=lang==='zh';const file=zh?'events-zh.html':'events.html';
  const title=zh?'場次資訊及預訂｜COz Cos 北部・台中 Cosplay 代妝':'Events & bookings | COz Cos Cosplay Makeup in Taiwan';
  const desc=zh?'查看台灣北部與中部同人場次、日期、地點與 COz Cos 代妝預訂資訊。漫展代妝 NT$950 起，預訂檔期透過官方 IG 確認。':'Explore upcoming doujin events in northern Taiwan and central Taiwan and ask about COz Cos makeup bookings. Convention makeup starts at NT$950; confirm availability through Instagram.';
  const today=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Taipei'}).format(new Date());
  let index=0;
  const groups=[['north','北部','Northern Taiwan'],['central','中部','Central Taiwan']];
  const sections=groups.map(([region,label,en])=>{
   const rows=data.events.filter(event=>event.region===region&&withinEventWindow(event,today)&&isSupportedEvent(event)).map(event=>{
    const open=event.booking==='open';
    const status=open?(zh?'開放預訂':'Bookings open'):event.booking==='full'?(zh?'已額滿':'Fully booked'):(zh?'暫不開放':'Not open');
    const date=event.startDate+(event.endDate!==event.startDate?' ～ '+event.endDate:'');
    return `<article class="event-row service-reveal role-reveal" style="--reveal-x:${index++%2?24:-24}px" data-event-id="${escape(event.id)}"><div class="event-date">${date}</div><div class="event-details"><h3>${escape(event.name)}</h3><p>${escape(event.venue)}</p><a class="event-source" href="${escape(event.source)}" target="_blank" rel="noopener noreferrer">${zh?'場次來源':'Event source'}</a></div><div class="event-booking"><span class="booking-status ${open?'booking-open':''}">${status}</span>${open?`<a class="event-book" href="https://www.instagram.com/cozcos_cosplay/" target="_blank" rel="noopener noreferrer" aria-label="${escape((zh?'IG 預訂：':'Ask on Instagram: ')+event.name)}">${zh?'IG 預訂':'Book on IG'}</a>`:''}</div></article>`;
   }).join('');
   return `<details class="event-region" id="${region}"><summary><h2>${zh?label:en}</h2></summary><div class="event-list">${rows||`<p>${zh?'目前沒有列出的場次，歡迎 IG 詢問。':'No listed events at the moment. Ask us on Instagram.'}</p>`}</div></details>`;
  }).join('');
  const pageHead=head(lang,'/'+file,title,desc).replace('<script src="/service-ui.js"','<script src="/content.js" defer></script><script src="/service-ui.js"');
  const html=`<!doctype html><html lang="${zh?'zh-Hant':'en'}">${pageHead}<body class="info-page service-page events-page"><header class="header info-header"><a class="info-home" href="${zh?'/':'/en.html'}"><img src="/assets/coz-logo.svg" alt=""><span>COz Cos</span></a><div class="header-actions">${serviceMenu(lang)}<a class="language-toggle" href="/${zh?'events':'events-zh'}.html">${zh?'English':'中文'}</a></div></header><main class="info-content"><p class="service-eyebrow">COz Cos · EVENT BOOKINGS</p><h1>${zh?'場次資訊及預訂':'Events & bookings'}</h1><p class="info-lead">${zh?'北部與中部的下一場出角，<br>讓我們一起準備。':'Get ready for your next cosplay event<br>in northern Taiwan and central Taiwan.'}</p><p class="service-note">${zh?'漫展代妝 NT$950 起。未結束場次先開放預訂詢問，實際可服務日期、地點與名額，請於 IG 私訊確認；這不是主辦單位的入場或攤位報名。':'Convention makeup starts at NT$950. Upcoming events are open to booking inquiries; confirm dates, service locations and availability through Instagram. These are COz Cos service bookings, not organizer admission or booth registration.'}</p><nav class="region-links" aria-label="${zh?'場次地區':'Event regions'}">${groups.map(([id,zhName,enName])=>`<a href="#${id}">${zh?zhName:enName}</a>`).join('')}</nav><p class="content-date">${zh?'未來四個月場次・整理日期：':'Next four months · Updated: '}${escape(data.updated)}</p>${sections}<p class="service-note">${zh?'場次資訊整理自':'Event information from'} <a href="https://www.doujin.com.tw/events/alist/all" target="_blank" rel="noopener noreferrer">${zh?'台灣同人誌中心':'Taiwan Doujin Center'}</a>。${zh?'活動異動請以主辦單位公告為準。':'Check organizer announcements for changes.'}</p></main>${footer(lang)}</body></html>`;
  await writeFile(file,html);
 }
}

