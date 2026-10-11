import {readFile,writeFile} from 'node:fs/promises';
import vm from 'node:vm';
const sandbox={window:{}};
vm.runInNewContext(await readFile('content.js','utf8'),sandbox);
const content=sandbox.window.COZ_CONTENT;
const origin='https://cozcos.com';
const esc=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const descriptions={
 en:'COz Cos offers cosplay makeup, costume rentals and sales, photography experiences, makeup lessons and purchasing assistance in Yingge, New Taipei and Nantun, Taichung. Contact us on Instagram.',
 zh:'想第一次體驗 Cosplay、圓一個出角夢？COz Cos 提供 Cosplay 一條龍體驗，整合角色妝容、服裝租借與攝影，也提供 Cos 妝教學、服裝租售與代購。歡迎素人與新手透過 IG 詢問角色、檔期及報價。'
};
const org={
 '@type':'Organization','@id':origin+'/#organization',name:'COz Cos',url:origin+'/',logo:origin+'/assets/closet.png',description:descriptions.zh,
 sameAs:[content.links.instagram,content.links.facebook,content.links.threads],
 areaServed:[{'@type':'City',name:'New Taipei City / 新北市'},{'@type':'City',name:'Taichung / 台中市'}],
 hasOfferCatalog:{'@type':'OfferCatalog',name:'COz Cos services',itemListElement:['Cosplay 妝容、服裝與攝影體驗','服裝租借與出售','Cos 妝實體教學','中北部代妝','閒魚／淘寶代購'].map(name=>({'@type':'Offer',itemOffered:{'@type':'Service',name,provider:{'@id':origin+'/#organization'}}}))}
};
const faq={
 zh:[
 ['沒有經驗的素人也可以詢問 Cosplay 體驗嗎？','可以。第一次想嘗試 Cosplay，也歡迎私訊 COz Cos，告訴我們喜歡的角色、預計日期，以及需要妝容、服裝或攝影中的哪些協助。我們會依你的需求確認可提供的服務與報價。'],
 ['想找化妝、服裝與拍照的一條龍 Cosplay 服務，要怎麼詢問？','COz Cos 提供 Cosplay 一條龍體驗，整合角色妝容、服裝與攝影。請在 IG 私訊提供角色參考圖、預計日期與需求，並確認服裝、妝容、攝影各項內容及費用，實際安排以預約時雙方確認為準。'],
 ['第一次出角，不知道角色服裝與拍照怎麼準備？','先整理喜歡的角色圖片，告訴我們是否已有服裝或假髮，以及希望拍攝的風格。服裝尺寸、租借選擇與需要的妝容可先私訊討論；若需要姿勢引導等拍攝協助，也請一併詢問並於預約前確認。'],
 ['COz Cos 在做什麼？','COz Cos 提供 Cosplay 一條龍體驗，涵蓋妝容、服裝與攝影，也提供服裝租借與出售、Cos 妝實體教學、中北部代妝、閒魚／淘寶代購與出角小物。'],
 ['COz Cos 的服務據點在哪裡？','服務據點位於新北・鶯歌車站附近 ／ 台中・南屯捷運附近。實際地點與當日服務安排，請透過官方 Instagram 私訊確認。'],
 ['如何預約妝容、攝影體驗或教學？','請私訊 Instagram @cozcos_cosplay，提供想體驗的服務、角色、預計日期與希望的地區，以便詢問檔期與報價。'],
 ['服務價格與檔期如何確認？','請透過官方 Instagram 私訊詢問。官網未公布固定價格；實際費用、服務內容與可預約時間，以雙方確認的資訊為準。'],
 ['共享衣櫃是什麼？','COz Cos 共享衣櫃是 Cosplay 服裝租借與分享平台。可前往 closet.cozcos.com 查看服裝與平台資訊，租期、尺寸及其他條件請依平台及衣主提供的資訊確認。'],
 ['在哪裡購買出角小物？','出角小物可前往 COz Cos 的賣貨便補給站查看。商品、庫存、運送與付款資訊，以該賣場顯示及確認的內容為準。'],
 ['官網可以直接付款或完成預約嗎？','目前官網主要提供品牌與服務介紹，以及五個官方平台入口。詢問與預約請透過 IG 私訊，購物與租借請前往對應平台。'],
 ['有哪些官方社群？','官方 Instagram 與 Threads 帳號皆為 @cozcos_cosplay，Facebook 專頁名稱為 COz Cos。請使用本官網提供的正式連結。']
 ],
 en:[
 ['Can a complete beginner ask about a cosplay experience?','Yes. If this is your first time trying cosplay, message COz Cos with your favorite character, preferred date and the makeup, costume or photography help you need. We will confirm the available services and a quote based on your request.'],
 ['How can I ask about an all-in-one cosplay service?','COz Cos offers cosplay experiences combining character makeup, costumes and photography. Send character references, your preferred date and requirements through Instagram. Confirm the contents and fees for each service before booking.'],
 ['How should I prepare for my first cosplay photo experience?','Collect reference images of your character and tell us whether you already have a costume or wig and what photographic style you like. Ask about sizing, rental options and makeup in advance. If you need posing guidance, ask about it and confirm the arrangements before booking.'],
 ['What does COz Cos do?','COz Cos offers complete cosplay experiences covering makeup, costumes and photography, as well as costume rentals and sales, in-person cosplay makeup lessons, makeup services in northern and central Taiwan, Xianyu and Taobao purchasing assistance, and cosplay essentials.'],
 ['Where are the service locations?','Our service locations are near Yingge Train Station in New Taipei and Nantun MRT Station in Taichung. Please message our official Instagram to confirm the exact location and service arrangements.'],
 ['How can I ask about a booking or lesson?','Message @cozcos_cosplay on Instagram with the service you want, your character, preferred date and region to ask about availability and a quote.'],
 ['How do I confirm prices and availability?','Please ask through our official Instagram. This website does not publish fixed prices; fees, service details and availability should be confirmed with us directly.'],
 ['What is the Shared Closet?','COz Cos Shared Closet is a cosplay costume rental and sharing platform at closet.cozcos.com. Check the platform and costume owner’s information for sizing, rental periods and other conditions.'],
 ['Where can I buy cosplay essentials?','Visit the COz Cos Myship shop. Products, stock, shipping and payment details are subject to the information shown and confirmed in that shop.'],
 ['Can I pay or complete a booking on this website?','This website introduces our brand and services and links to five official channels. Please message Instagram for inquiries and bookings, and use the relevant platform for shopping or rentals.'],
 ['Which social accounts are official?','Our Instagram and Threads handle is @cozcos_cosplay, and our Facebook page is named COz Cos. Use the official links provided on this website.']
 ]
};
function head(lang,path,title,description,extraType='WebPage',questions=null){
 const counterpart=path==='/'?'/en.html':path==='/en.html'?'/':lang==='en'?path.replace('.html','-zh.html'):path.replace('-zh.html','.html');
 const page={'@type':extraType,'@id':origin+path+'#page',url:origin+path,name:title,description,inLanguage:lang==='en'?'en':'zh-Hant',isPartOf:{'@id':origin+'/#website'},about:{'@id':origin+'/#organization'}};
 if(questions)page.mainEntity=questions.map(([question,answer])=>({'@type':'Question',name:question,acceptedAnswer:{'@type':'Answer',text:answer}}));
 const graph=[org,{'@type':'WebSite','@id':origin+'/#website',name:'COz Cos',url:origin+'/',inLanguage:['en','zh-Hant'],publisher:{'@id':origin+'/#organization'}},page];
 if(path!=='/'&&path!=='/en.html')graph.push({'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:lang==='en'?'Home':'首頁',item:origin+(lang==='en'?'/en.html':'/')},{'@type':'ListItem',position:2,name:title,item:origin+path}]});
 return `<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#0b0f12">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${origin+path}"><link rel="alternate" hreflang="${lang==='en'?'en':'zh-Hant'}" href="${origin+path}"><link rel="alternate" hreflang="${lang==='en'?'zh-Hant':'en'}" href="${origin+counterpart}"><link rel="alternate" hreflang="x-default" href="${origin+(lang==='zh'?path:counterpart)}">
<meta property="og:type" content="website"><meta property="og:site_name" content="COz Cos"><meta property="og:locale" content="${lang==='en'?'en_US':'zh_TW'}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${origin+path}"><meta property="og:image" content="${origin}/assets/social-card-v2.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="COz Cos — Bring Your Character to Life. Cosplay makeup, costumes and photography in Taiwan.">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${origin}/assets/social-card-v2.jpg">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/styles.css">
<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':graph}).replaceAll('<','\\u003c')}</script>
</head>`;
}
function footer(lang){const zh=lang==='zh';return `<footer><span>© 2026 COz Cos.</span><nav class="footer-links" aria-label="${zh?'網站資訊':'Site information'}"><a href="${zh?'/about-zh.html':'/about.html'}">${zh?'關於我們':'About Us'}</a><a href="${zh?'/faq-zh.html':'/faq.html'}">${zh?'常見問題':'FAQ'}</a></nav><span>${content.languages[lang].credit}</span></footer>`;}
const source=await readFile('index.html','utf8');
for(const lang of ['en','zh']){
 const copy=content.languages[lang];const path=lang==='en'?'/en.html':'/';
 let home=source.replace(/<html lang="[^"]+">/,`<html lang="${lang==='en'?'en':'zh-Hant'}">`).replace(/<head>[\s\S]*?<\/head>/,head(lang,path,copy.title,descriptions[lang]).replace('</head>','<script src="/content.js" defer></script><script src="/app.js" defer></script></head>'));
 home=home.replace(/<p class="intro">[\s\S]*?<\/p>/,`<p class="intro">${copy.intro}</p>`).replace(/<h2 id="about-title">[\s\S]*?<\/h2>/,`<h2 id="about-title">${copy.aboutTitle}</h2>`).replace(/(<section class="about reveal"[\s\S]*?<\/h2>)<p>[\s\S]*?<\/p>/,`$1<p>${copy.about}</p>`).replace(/<p class="locations">[\s\S]*?<\/p>/,`<p class="locations">${copy.locations}</p>`).replace(/<h2 id="contact-title">[\s\S]*?<\/h2>/,`<h2 id="contact-title">${copy.contact}</h2>`).replace(/<p class="contact-note">[\s\S]*?<\/p>/,`<p class="contact-note">${copy.note}</p>`).replace(/<footer>[\s\S]*?<\/footer>/,footer(lang).replace('2026','<span id="year">2026</span>')).replace(/(<button class="language-toggle"[^>]*aria-label=")[^"]*(">)[\s\S]*?<\/button>/,`$1${copy.toggleLabel}$2${copy.toggle}</button>`);
 await writeFile(lang==='en'?'en.html':'index.html',home);
 if(lang==='zh') await writeFile('zh.html',home);
 for(const kind of ['about','faq']){
  const zh=lang==='zh';const file=kind+(zh?'-zh':'')+'.html';const pagePath='/'+file;const title=kind==='about'?(zh?'關於 COz Cos｜Cosplay 妝容、服裝與攝影服務':'About COz Cos | Cosplay Services in Taiwan'):(zh?'COz Cos 常見問題｜預約、服務據點、共享衣櫃與賣場':'COz Cos FAQ | Bookings, Locations, Costumes & Shop');
  const desc=kind==='about'?descriptions[lang]:(zh?'了解 COz Cos 的預約方式、服務據點、價格詢問、共享衣櫃與賣貨便補給站。新北鶯歌車站附近與台中南屯捷運附近，請透過官方 IG 確認。':'Answers about COz Cos bookings, service locations, quotes, the Shared Closet and Myship shop. Contact our official Instagram to confirm service details.');
  const aboutSections=zh?[
   ['我們在做什麼','COz Cos 是以 Cosplay 角色體驗為核心的服務品牌。我們從服裝、妝容到攝影，陪你準備喜歡的角色，留下屬於自己的故事。'],
   ['第一次想體驗 Cosplay？','想一圓 Cos 夢，但不知道服裝、角色化妝與拍照怎麼準備？素人與 Cosplay 新手也歡迎詢問。我們提供 Cosplay 一條龍體驗，可先透過 IG 告訴我們喜歡的角色、是否已有服裝，以及需要的妝容與攝影協助，再確認適合的服務內容與報價。'],
   ['服務內容','我們提供 Cosplay 一條龍體驗、服裝租借與出售、Cos 妝實體教學、中北部代妝、閒魚／淘寶代購與出角小物。服務內容、檔期與報價請透過官方 Instagram 確認。'],
   ['服務據點','新北・鶯歌車站附近 ／ 台中・南屯捷運附近。歡迎先私訊詢問服務地區、地點及預計日期，完整地址與安排以預約時確認的資訊為準。'],
   ['共享衣櫃與補給站',`<a href="${content.links.closet}">共享衣櫃</a>提供 Cosplay 服裝租借與分享資訊；<a href="${content.links.shop}">賣貨便補給站</a>提供出角小物。商品、租借及交易條件請於對應平台確認。`],
   ['官方資訊與聯絡',`預約與服務詢問請私訊 <a href="${content.links.instagram}">Instagram @cozcos_cosplay</a>。品牌資訊也可透過 <a href="${content.links.facebook}">Facebook COz Cos</a> 與 <a href="${content.links.threads}">Threads @cozcos_cosplay</a> 查看。`]
  ]:[
   ['What we do','COz Cos is a service brand centered on cosplay character experiences. From costumes and makeup to photography, we help you prepare your favorite character and tell your own story.'],
   ['Trying cosplay for the first time?','Beginners are welcome to ask about a cosplay experience. Message us with your favorite character, whether you already have a costume, and the makeup and photography help you need. We will confirm service details and a quote with you.'],
   ['Our services','We offer complete cosplay experiences, costume rentals and sales, in-person cosplay makeup lessons, makeup services in northern and central Taiwan, Xianyu and Taobao purchasing assistance, and cosplay essentials. Confirm service details, availability and quotes through our official Instagram.'],
   ['Service locations','Near Yingge Train Station in New Taipei and Nantun MRT Station in Taichung. Message us about your preferred area and date; the exact address and arrangements are confirmed when discussing a booking.'],
   ['Shared Closet and shop',`The <a href="${content.links.closet}">Shared Closet</a> provides cosplay costume rental and sharing information. Our <a href="${content.links.shop}">Myship shop</a> offers cosplay essentials. Confirm product, rental and transaction details on the relevant platform.`],
   ['Official channels',`For bookings and inquiries, message <a href="${content.links.instagram}">Instagram @cozcos_cosplay</a>. Find brand updates on <a href="${content.links.facebook}">Facebook COz Cos</a> and <a href="${content.links.threads}">Threads @cozcos_cosplay</a>.`]
  ];
  const inner=kind==='about'?aboutSections.map(([h,p])=>`<section class="info-section"><h2>${h}</h2><p>${p}</p></section>`).join(''):faq[lang].map(([q,a])=>`<section class="faq-item"><h2>${q}</h2><p>${a}</p></section>`).join('');
  const alternate='/'+kind+(zh?'':'-zh')+'.html';
  const html=`<!doctype html><html lang="${zh?'zh-Hant':'en'}">${head(lang,pagePath,title,desc,kind==='faq'?'FAQPage':'AboutPage',kind==='faq'?faq[lang]:null)}<body class="info-page"><header class="header info-header"><a class="info-home" href="${zh?'/':'/en.html'}"><img src="/assets/closet.png" alt=""><span>COz Cos</span></a><a class="language-toggle" href="${alternate}" aria-label="${copy.toggleLabel}">${copy.toggle}</a></header><main class="info-content"><h1>${kind==='about'?(zh?'關於我們':'About Us'):(zh?'常見問題':'Frequently Asked Questions')}</h1><p class="info-lead">${kind==='about'?(zh?'從角色的想像，到屬於你的故事。':'From imagining a character to telling your story.'):(zh?'服務、預約與平台資訊，一次了解。':'Your guide to our services, bookings and official channels.')}</p>${inner}<p class="content-date">${zh?'資訊更新：2026 年 10 月 11 日':'Updated: October 11, 2026'}</p></main>${footer(lang)}</body></html>`;
  await writeFile(file,html);
 }
}
const urls=['/','/en.html','/about.html','/about-zh.html','/faq.html','/faq-zh.html'];
await writeFile('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(path=>`<url><loc>${origin+path}</loc><lastmod>2026-10-11</lastmod></url>`).join('')+'</urlset>\n');
await writeFile('robots.txt',`User-agent: *\nAllow: /\nDisallow: /share-preview.html\nSitemap: ${origin}/sitemap.xml\n`);
await writeFile('llms.txt',`# COz Cos\n\n> COz Cos is a cosplay service brand in Taiwan. Services include makeup, costumes and photography experiences, costume rentals and sales, in-person makeup lessons, makeup services in northern and central Taiwan, and Xianyu/Taobao purchasing assistance.\n\n## Official information\n- [English homepage](${origin}/en.html)\n- [繁體中文首頁](${origin}/)\n- [About COz Cos](${origin}/about.html)\n- [關於我們](${origin}/about-zh.html)\n- [Frequently asked questions](${origin}/faq.html)\n- [常見問題](${origin}/faq-zh.html)\n\n## Locations\n新北・鶯歌車站附近 ／ 台中・南屯捷運附近。Near Yingge Train Station, New Taipei and Nantun MRT Station, Taichung. Exact locations, availability and pricing must be confirmed through official Instagram. No fixed price or full street address is published here.\n\n## Official platforms\n${Object.entries(content.links).map(([key,url])=>`- [${key}](${url})`).join('\n')}\n\nLast updated: 2026-10-11.\n`);
// A code-native, dedicated share card; the raster export is generated in the browser.
const logo=(await readFile('assets/closet.png')).toString('base64');
const photos=await Promise.all([1,3,5,8].map(async n=>(await readFile(`assets/clients/client-${String(n).padStart(2,'0')}.jpg`)).toString('base64')));
const card=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="shade"><stop stop-color="#0b0f12"/><stop offset="1" stop-color="#0b0f12" stop-opacity=".35"/></linearGradient><clipPath id="corner"><rect x="750" y="40" width="410" height="550" rx="28"/></clipPath></defs><rect width="1200" height="630" fill="#0b0f12"/><g clip-path="url(#corner)">${photos.map((p,i)=>`<image href="data:image/jpeg;base64,${p}" x="${750+i%2*205}" y="${40+Math.floor(i/2)*275}" width="205" height="275" preserveAspectRatio="xMidYMid slice"/>`).join('')}<rect x="750" y="40" width="410" height="550" fill="#0b0f12" opacity=".38"/></g><rect width="1200" height="630" fill="url(#shade)"/><image href="data:image/png;base64,${logo}" x="64" y="72" width="80" height="90"/><text x="170" y="139" fill="#f4eee3" font-family="Arial,sans-serif" font-size="66" font-weight="700">COz Cos</text><text x="64" y="272" fill="#f4eee3" font-family="Arial,sans-serif" font-size="48" font-weight="700">Bring Your Character</text><text x="64" y="336" fill="#f4eee3" font-family="Arial,sans-serif" font-size="48" font-weight="700">to Life.</text><rect x="64" y="384" width="62" height="3" fill="#b8c3ab"/><text x="64" y="440" fill="#d0cabe" font-family="Arial,Microsoft JhengHei,sans-serif" font-size="24">Cosplay 妝容・服裝・攝影體驗</text><text x="64" y="490" fill="#b8c3ab" font-family="Arial,Microsoft JhengHei,sans-serif" font-size="20">新北鶯歌車站附近 / 台中南屯捷運附近</text><text x="64" y="566" fill="#d0cabe" font-family="Arial,sans-serif" font-size="22" letter-spacing="3">COZCOS.COM</text></svg>`;
await writeFile('assets/social-card.svg',card);
await writeFile('share-preview.html','<!doctype html><html><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>COz Cos — Social Preview</title><style>html,body{margin:0;background:#0b0f12;width:1200px;height:630px;overflow:hidden}img{display:block;width:1200px;height:630px}</style></head><body><img src="/assets/social-card.svg" alt="COz Cos social sharing preview" width="1200" height="630"></body></html>');
console.log('Generated six bilingual pages, metadata, schema, sitemap, llms.txt and share preview.');

