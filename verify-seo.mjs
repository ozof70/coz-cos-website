import {readFile,access} from 'node:fs/promises';
const files=['index.html','en.html','zh.html','about.html','about-zh.html','faq.html','faq-zh.html','pricing.html','pricing-zh.html','characters.html','characters-zh.html','events.html','events-zh.html','news.html','news-zh.html','cosplay-experience.html','cosplay-experience-zh.html'];
for(const file of files){
 const html=await readFile(file,'utf8');
 const canonical=html.match(/rel="canonical" href="([^"]+)"/)?.[1];
 if(!canonical?.startsWith('https://cozcos.com/'))throw Error(`${file}: invalid canonical`);
 const expectedCanonical='https://cozcos.com/'+(['index.html','zh.html'].includes(file)?'':file);
 if(canonical!==expectedCanonical)throw Error(`${file}: unexpected canonical ${canonical}`);
 if(file==='index.html'&&!html.includes('<html lang="zh-Hant">'))throw Error('Default homepage must be Traditional Chinese');
 if(!html.includes('hreflang="en"')||!html.includes('hreflang="zh-Hant"'))throw Error(`${file}: missing language alternatives`);
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
 const faq=schema['@graph'].find(node=>node['@type']==='FAQPage');
 if(faq)for(const question of faq.mainEntity){
  if(!html.includes(question.name)||!html.includes(question.acceptedAnswer.text))throw Error(`${file}: FAQ does not match visible content`);
 }
 for(const match of html.matchAll(/(?:href|src)="(\/[^"#]*)"/g)){
  await access(match[1]==='/'?'index.html':'.'+match[1]);
 }
 if(/周圍|周邊|點一下前往平台|Tap an icon to reveal/.test(html))throw Error(`${file}: outdated copy`);
 console.log(`${file}: canonical, languages, schema and local links OK`);
}
const sitemap=await readFile('sitemap.xml','utf8');
if((sitemap.match(/<loc>/g)||[]).length!==16)throw Error('Sitemap must contain sixteen public pages');
await access('assets/social-card-v2.jpg');
console.log('Sitemap and share image OK');


const prices=JSON.parse(await readFile('service-data.json','utf8')).packages;
for(const file of ['pricing.html','pricing-zh.html']){const html=await readFile(file,'utf8');const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];const catalog=graph.find(n=>n['@type']==='OfferCatalog');if(!catalog||catalog.itemListElement.some((offer,i)=>offer.price!==prices[i].price||offer.priceCurrency!=='TWD'))throw Error('Price schema must match published package data');}
for(const file of ['cosplay-experience.html','cosplay-experience-zh.html']){const html=await readFile(file,'utf8');for(const p of prices)if(!html.includes('NT$'+p.price.toLocaleString('en-US')))throw Error('Guide price mismatch');if(!html.includes('2026-10-18')||!html.includes('cosplay-experience'))throw Error('Guide metadata missing');}
console.log('Beginner guides, visible package prices, structured data and discovery links OK');

const icon=await readFile('assets/coz-green-icon.png');if(icon.readUInt32BE(16)!==192||icon.readUInt32BE(20)!==192)throw Error('Search favicon must be square 192px');const ico=await readFile('favicon.ico');if(ico.readUInt16LE(2)!==1||ico.readUInt16LE(4)!==3)throw Error('ICO fallback missing');for(const file of files){const html=await readFile(file,'utf8');if(!html.includes('/assets/coz-green-icon.png'))throw Error(file+': green search icon missing');if(file.startsWith('about')&&(!html.includes('class="admin-signin-link"')||html.includes('class="admin-entry" href="/admin.html"')))throw Error('About sign-in must not share admin card styles');}
console.log('Green favicon assets and compact sign-in class separation OK');
