import {writePageFile as writeFile} from './site-urls.mjs';
import {articles,editorialDate,articleLinks} from './editorial-data.mjs';
import {serviceMenu} from './service-pages.mjs';
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
export async function buildEditorialPages(head,footer,links){
 for(const a of articles)for(const lang of ['zh','en']){
  const zh=lang==='zh',copy=a[lang],suffix=zh?'-zh':'',file=a.slug+suffix+'.html';
  const photo=a.image?`<figure class="editorial-photo"><img src="${a.image}" alt="${zh?'夜蘭 Cosplay 作品，深藍短髮與藍白服裝':'Yelan cosplay with dark blue hair and a blue-and-white costume'}" width="960" height="1279" decoding="async"><figcaption><a href="${a.source}">${zh?'作品出處：COz Cos 官方 Instagram；出鏡':'Photo: COz Cos official Instagram; cosplayer'} ${a.credit}</a></figcaption></figure>`:'';
  const sources=a.sources?`<section class="info-section"><h2>${zh?'保養參考':'Care reference'}</h2><p>${zh?'一般纖維保養原則參考下列原廠資料；實際操作以你持有的假髮說明及造型者指示為準。':'General fibre care is informed by the manufacturer below. Follow the instructions for your own wig and its stylist.'}</p><ul>${a.sources.map(([name,url])=>`<li><a href="${url}">${name}</a></li>`).join('')}</ul></section>`:'';
  const related=`<p><a href="/cosplay-experience${suffix}.html">${zh?'Cosplay 一條龍體驗與套餐指南':'All-in-one cosplay and package guide'}</a> · <a href="/pricing${suffix}.html">${zh?'服務價目表':'Service prices'}</a> · <a href="/characters${suffix}.html">${zh?'圓夢角色列表':'Character list'}</a></p>`;
  const cta=a.slug==='cosplay-wig-care'?links.wig:links.instagram;
  await writeFile(file,`<!doctype html><html lang="${zh?'zh-Hant':'en'}">${head(lang,'/'+file,copy.title+'｜COz Cos',copy.description)}<body class="info-page editorial-page"><header class="header info-header"><a class="info-home" href="${zh?'/':'/en.html'}"><img src="/assets/coz-logo.svg" alt=""><span>COz Cos</span></a><div class="header-actions">${serviceMenu(lang)}<a class="language-toggle" href="/${a.slug}${zh?'':'-zh'}.html">${zh?'English':'中文'}</a></div></header><main class="info-content"><article><h1>${esc(copy.title)}</h1><p class="content-date">${zh?'內容整理：COz Cos｜':'Prepared by COz Cos | '}<time datetime="${editorialDate}">${editorialDate}</time></p><p class="info-lead">${copy.lead}</p>${photo}${copy.sections.map(([h,p])=>`<section class="info-section"><h2>${h}</h2><p>${p}</p></section>`).join('')}${sources}${related}<a class="service-cta" href="${cta}">${zh?(a.slug==='cosplay-wig-care'?'詢問假髮研究室':'IG 詢問角色體驗'):(a.slug==='cosplay-wig-care'?'Ask our wig studio':'Ask about an experience')}</a></article>${articleLinks(lang)}</main>${footer(lang)}</body></html>`);
 }
}
