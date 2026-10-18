import {writeFile} from 'node:fs/promises';
import {serviceMenu} from './service-pages.mjs';
import data from './service-data.json' with {type:'json'};

export async function buildBeginnerPages(head,footer,links){
 for(const lang of ['zh','en']){
  const zh=lang==='zh',file=zh?'cosplay-experience-zh.html':'cosplay-experience.html';
  const title=zh?'第一次 Cosplay 體驗｜素人角色妝容、服裝與攝影指南｜COz Cos':'Your First Cosplay Experience | Makeup, Costumes & Photos | COz Cos';
  const description=zh?'素人想體驗 Cosplay，不知道怎麼開始？了解 COz Cos 的角色妝容、假髮、服裝與攝影套餐，查看角色尺碼、準備事項與 IG 預約方式。':'New to cosplay? Explore COz Cos makeup, wig, costume and photography packages, character sizes and how to ask about your first experience.';
  const suffix=zh?'-zh':'';
  const sections=zh?[
   ['沒有經驗，也可以體驗 Cosplay 嗎？','可以。COz Cos 提供 Cosplay 一條龍體驗，將角色妝容、假髮、服裝與攝影整合為套餐。沒有出角經驗的素人也歡迎詢問；先提供喜歡的動漫、遊戲角色與日期，再一起確認可安排的內容。'],
   ['想體驗一個角色，要先準備什麼？','先準備角色名稱、作品名稱與參考圖片，並告訴我們預計日期、希望的地區，以及自己是否已有服裝或假髮。若需要拍攝姿勢引導或其他協助，請於詢問時提出，並確認是否能安排。'],
   ['不知道衣服尺寸、角色能不能選？',`先看<a href="/characters-zh.html">圓夢角色列表</a>，依作品查看角色名稱與服裝尺碼。列表僅供選擇參考，不代表特定日期有庫存；合身程度、服裝與假髮狀況及角色可安排性，請在 IG 確認。`],
   ['服務在哪裡？','服務據點位於新北・鶯歌車站附近 ／ 台中・南屯捷運附近。完整地址、當日服務地點與可預約時間，請在 IG 私訊確認。'],
   ['只有代妝、租衣或教學需求也可以嗎？',`除了完整體驗，COz Cos 也提供服裝租借與出售、Cos 妝實體教學及中北部代妝。單項內容可先看<a href="/pricing-zh.html">服務價目表</a>；服裝租借與分享資訊可前往<a href="${links.closet}">共享衣櫃</a>。`],
   ['如何詢問第一次 Cosplay 體驗？',`請私訊<a href="${links.instagram}">官方 Instagram @cozcos_cosplay</a>，提供下方資訊。服務內容、檔期與總費用經雙方確認後，再依確認的方式安排；官網不提供直接付款或完成預約。`]
  ]:[
   ['Can I try cosplay without any experience?','Yes. COz Cos offers cosplay packages combining character makeup, a wig, a costume and photography. First-time visitors are welcome to ask. Share your anime or game character and preferred date so we can confirm what can be arranged.'],
   ['What should I prepare before asking?','Prepare your character’s name, series and reference images, preferred date and region. Tell us if you already have a costume or wig. If you would like posing guidance or other assistance, ask and confirm availability before booking.'],
   ['How do I choose a character and costume size?',`Browse the <a href="/characters.html">character list</a> by series and costume size. The list is a reference, not a guarantee of stock on your preferred date. Confirm fit, costume and wig condition, and availability through Instagram.`],
   ['Where can I ask for an experience?','Our service locations are near Yingge Train Station in New Taipei and Nantun MRT Station in Taichung. Confirm the exact address, service location and available dates through Instagram.'],
   ['Can I ask for makeup, costume rental or lessons separately?',`We also offer costume rentals and sales, in-person cosplay makeup lessons, and makeup services in northern and central Taiwan. See the <a href="/pricing.html">service price list</a> and explore our <a href="${links.closet}">Shared Closet</a> for rental and sharing information.`],
   ['How do I ask about my first cosplay experience?',`Message <a href="${links.instagram}">our official Instagram @cozcos_cosplay</a> with the details below. Confirm service contents, availability and total fees together before making arrangements. This website does not take payment or complete bookings.`]
  ];
  const money=n=>'NT$'+n.toLocaleString('en-US');
  const packages=data.packages.map(p=>`<tr><th scope="row">${zh?p.zh:p.en}</th><td>${zh?p.detailsZh:p.detailsEn}</td><td>${money(p.price)}</td></tr>`).join('');
  const body=`<p class="info-lead">${zh?'想一圓 Cos 夢，從喜歡的角色開始。這裡整理第一次找 COz Cos 體驗時，最需要確認的服務、費用與準備資訊。':'Start with a character you love. Here is what to confirm about services, prices and preparation for your first experience with COz Cos.'}</p>${sections.slice(0,3).map(([h,p])=>`<section class="info-section"><h2>${h}</h2><p>${p}</p></section>`).join('')}<section class="info-section"><h2>${zh?'Cosplay 體驗套餐與費用':'Cosplay experience packages and prices'}</h2><div class="guide-table-wrap"><table class="guide-table"><caption>${zh?'COz Cos 公開套餐價目（新台幣）':'COz Cos published package prices (New Taiwan Dollars)'}</caption><thead><tr><th scope="col">${zh?'套餐':'Package'}</th><th scope="col">${zh?'包含內容':'Contents'}</th><th scope="col">${zh?'價格':'Price'}</th></tr></thead><tbody>${packages}</tbody></table></div><p class="service-note">${zh?'學生套餐資格、角色服裝、額外需求與總費用請先確認；套餐內容以服務價目表及雙方確認為準。':'Confirm student eligibility, costumes, extra requests and total fees before booking. Refer to the service price list and the details agreed with us.'} <a href="/pricing${suffix}.html">${zh?'查看完整服務價目表':'View the full service price list'}</a></p></section>${sections.slice(3).map(([h,p])=>`<section class="info-section"><h2>${h}</h2><p>${p}</p></section>`).join('')}<section class="info-section"><h2>${zh?'可以直接複製的詢問清單':'Details to include in your message'}</h2><ul><li>${zh?'作品／角色名稱、參考圖片':'Series, character and reference images'}</li><li>${zh?'預計日期與希望服務地區':'Preferred date and region'}</li><li>${zh?'服裝尺碼、是否已有服裝或假髮':'Costume size and whether you have a costume or wig'}</li><li>${zh?'想要完整體驗，或妝容、服裝、攝影其中幾項':'Full experience or the makeup, costume and photography help you need'}</li></ul><a class="service-cta" href="${links.instagram}">${zh?'IG 私訊詢問 Cosplay 體驗':'Ask about a cosplay experience on Instagram'}</a></section><p><a href="/faq${suffix}.html">${zh?'查看其他常見問題':'Read more frequently asked questions'}</a></p><p class="content-date">${zh?'內容整理：COz Cos｜更新日期：2026 年 10 月 18 日':'Prepared by COz Cos | Updated: October 18, 2026'}</p>`;
  await writeFile(file,`<!doctype html><html lang="${zh?'zh-Hant':'en'}">${head(lang,'/'+file,title,description)}<body class="info-page cosplay-guide"><header class="header info-header"><a class="info-home" href="${zh?'/':'/en.html'}"><img src="/assets/coz-logo.svg" alt=""><span>COz Cos</span></a><div class="header-actions">${serviceMenu(lang)}<a class="language-toggle" href="/${zh?'cosplay-experience':'cosplay-experience-zh'}.html">${zh?'English':'中文'}</a></div></header><main class="info-content"><h1>${zh?'第一次 Cosplay 體驗指南':'Your first cosplay experience'}</h1>${body}</main>${footer(lang)}</body></html>`);
 }
}
