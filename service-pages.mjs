import { readFile, writeFile } from 'node:fs/promises';
import vm from 'node:vm';
const data = JSON.parse(await readFile('service-data.json', 'utf8'));
const sandbox = {window:{}};
vm.runInNewContext(await readFile('content.js', 'utf8'), sandbox);
const ig = sandbox.window.COZ_CONTENT.links.instagram;
const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
export function serviceMenu(lang) {
  const zh = lang === 'zh';
  return `<nav class="service-menu" aria-label="${zh?'服務資訊':'Services'}"><button type="button" class="language-toggle service-menu-toggle" aria-expanded="false" aria-controls="service-menu-panel">${zh?'服務':'Services'} <span aria-hidden="true">⌄</span></button><div class="service-menu-panel" id="service-menu-panel" hidden><a href="/${zh?'pricing-zh':'pricing'}.html">${zh?'服務價目表':'Service prices'}</a><a href="/${zh?'characters-zh':'characters'}.html">${zh?'圓夢角色列表':'Character list'}</a></div></nav>`;
}
export async function buildServicePages(head, footer) {
  for (const lang of ['zh','en']) {
    const zh = lang === 'zh';
    for (const kind of ['pricing','characters']) {
      const file = kind + (zh?'-zh':'') + '.html';
      const alternate = '/' + kind + (zh?'':'-zh') + '.html';
      const name = kind === 'pricing' ? (zh?'服務價目表':'Service prices') : (zh?'圓夢角色列表':'Character list');
      const title = name + (zh?'｜COz Cos Cosplay 體驗':' | COz Cos Cosplay Experiences');
      const description = kind === 'pricing'
        ? (zh?'查看 COz Cos Cosplay 體驗套餐、角色妝容教學、攝影與單項服務價目。金額以新台幣計價，預約檔期與細節請私訊確認。':'Explore COz Cos cosplay packages, makeup lessons, photography and individual service prices in New Taiwan Dollars. Confirm bookings through Instagram.')
        : (zh?'探索 COz Cos 圓夢角色列表，依作品、角色名稱與尺碼尋找喜歡的服裝。包含主清單及合作衣櫃，實際安排請私訊確認。':'Explore characters and costume sizes from the COz Cos collection and partner closets. Search original character names and confirm arrangements through Instagram.');
      let body;
      if (kind === 'pricing') {
        const cards = data.packages.map((item,index) => `<article class="price-card service-reveal"><span class="card-number">0${index+1}</span><h2>${esc(zh?item.zh:item.en)}</h2><p class="price-value">NT$${item.price.toLocaleString('en-US')}</p><p>${esc(zh?item.detailsZh:item.detailsEn)}</p></article>`).join('');
        const items = data.items.map(item => `<div class="price-row"><span>${esc(zh?item.zh:item.en)}</span><span class="item-price">NT$${item.price.toLocaleString('en-US')}<small>${esc(zh?item.unitZh:item.unitEn)}</small></span></div>`).join('');
        body = `<p class="info-lead">${zh?'從第一次出角，到下一段角色故事。<br>選擇適合你的體驗與服務。':'From your first cosplay to your next character story.<br>Find the experience that fits you.'}</p><section aria-label="${zh?'套餐':'Packages'}" class="price-grid">${cards}</section><section class="info-section service-reveal"><h2>${zh?'單項服務':'Individual services'}</h2><div class="price-items">${items}</div></section><p class="service-note">${zh?'以上金額以新台幣計價。套餐內容依本頁列示；學生方案適用資格、角色服裝、檔期與其他安排，請於預約前私訊確認。':'All prices are in New Taiwan Dollars. Confirm student eligibility, character costumes, availability and any other arrangements before booking.'}</p>`;
      } else {
        const groups = ['main','partner'].map(group => {
          const rows = data.roles.filter(role => role.group === group).map(role => `<tr data-role><td>${esc(role.work || (zh?'未註明作品':'Work not specified'))}</td><td>${esc(role.character)}</td><td>${esc(role.size)}</td></tr>`).join('');
          return `<section class="role-group service-reveal"><h2>${group==='main'?(zh?'COz Cos 主清單':'COz Cos collection'):(zh?'合作衣櫃':'Partner closets')}</h2>${group==='partner'?`<p class="service-note">${zh?'合作衣櫃方案細節與實際安排，請私訊確認。':'Please message us to confirm partner-closet arrangements and details.'}</p>`:''}<div class="role-table-wrap"><table class="role-table"><caption class="sr-only">${group==='main'?(zh?'主清單角色與尺碼':'Collection characters and sizes'):(zh?'合作衣櫃角色與尺碼':'Partner characters and sizes')}</caption><thead><tr><th scope="col">${zh?'作品':'Work'}</th><th scope="col">${zh?'角色':'Character'}</th><th scope="col">${zh?'尺碼':'Size'}</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
        }).join('');
        body = `<p class="info-lead">${zh?'尋找你想成為的角色。<br>從作品、角色名稱或尺碼開始。':'Find the character you want to become.<br>Search original work names, characters or sizes.'}</p><div class="role-search"><label for="role-search">${zh?'搜尋角色':'Find a character'}</label><input id="role-search" type="search" placeholder="${zh?'例如：原神、八重神子、M':'e.g. 原神, 八重神子, M'}" autocomplete="off"><p id="role-count" role="status">${zh?'共 53 筆角色':'53 characters'}</p></div>${groups}<p id="role-empty" hidden>${zh?'沒有符合的角色，試試其他關鍵字。':'No matching characters. Try another keyword.'}</p><p class="service-note">${zh?'角色名稱與尺碼依清單整理，不代表即時庫存或已保留檔期。服裝尺寸與安排請於預約前私訊確認。':'Names and sizes are a snapshot of the list, not real-time availability or a reserved booking. Confirm sizes and arrangements before booking.'}</p>`;
      }
      const html = `<!doctype html><html lang="${zh?'zh-Hant':'en'}">${head(lang,'/'+file,title,description)}<body class="info-page service-page"><header class="header info-header"><a class="info-home" href="${zh?'/':'/en.html'}"><img src="/assets/closet.png" alt=""><span>COz Cos</span></a><div class="header-actions">${serviceMenu(lang)}<a class="language-toggle" href="${alternate}">${zh?'English':'中文'}</a></div></header><main class="info-content"><p class="service-eyebrow">COz Cos · ${kind==='pricing'?'PRICE LIST':'CHARACTER COLLECTION'}</p><h1>${name}</h1>${body}<a class="service-cta" href="${ig}" target="_blank" rel="noopener noreferrer">${zh?'IG 私訊詢問與預約':'Ask & book on Instagram'} <span aria-hidden="true">↗</span></a><p class="content-date">${zh?'資訊整理日期：':'List updated: '}${data.updated}</p></main>${footer(lang)}</body></html>`;
      await writeFile(file, html);
    }
  }
}
