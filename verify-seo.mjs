import {articles} from './editorial-data.mjs';
import {readFile,access} from 'node:fs/promises';
import {extname} from 'node:path';
import {cleanPagePath} from './site-urls.mjs';
const files=['index.html','en.html','zh.html','about.html','about-zh.html','faq.html','faq-zh.html','pricing.html','pricing-zh.html','characters.html','characters-zh.html','events.html','events-zh.html','news.html','news-zh.html','cosplay-experience.html','cosplay-experience-zh.html',...articles.flatMap(a=>[a.slug+'.html',a.slug+'-zh.html'])];
for(const file of files){
 const html=await readFile(file,'utf8');
 const canonical=html.match(/rel="canonical" href="([^"]+)"/)?.[1];
 if(!canonical?.startsWith('https://cozcos.com/'))throw Error(`${file}: invalid canonical`);
 const expectedCanonical='https://cozcos.com'+cleanPagePath('/'+file);
 if(canonical!==expectedCanonical)throw Error(`${file}: unexpected canonical ${canonical}`);
 if(file==='index.html'&&!html.includes('<html lang="zh-Hant">'))throw Error('Default homepage must be Traditional Chinese');
 if(!html.includes('hreflang="en"')||!html.includes('hreflang="zh-Hant"'))throw Error(`${file}: missing language alternatives`);
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
 const faq=schema['@graph'].find(node=>node['@type']==='FAQPage');
 if(faq)for(const question of faq.mainEntity){
  if(!html.includes(question.name)||!html.includes(question.acceptedAnswer.text))throw Error(`${file}: FAQ does not match visible content`);
 }
 for(const match of html.matchAll(/(?:href|src)="(\/[^"#]*)"/g)){
  const path=match[1].split(/[?#]/)[0];
  if(path.endsWith('.html'))throw Error(`${file}: legacy page URL ${path}`);
  await access(path==='/'?'index.html':'.'+path+(extname(path)?'':'.html'));
 }
 if(/周圍|周邊|點一下前往平台|Tap an icon to reveal/.test(html))throw Error(`${file}: outdated copy`);
 console.log(`${file}: canonical, languages, schema and local links OK`);
}
const sitemap=await readFile('sitemap.xml','utf8');
if((sitemap.match(/<loc>/g)||[]).length!==20)throw Error('Sitemap must contain twenty public pages');
// Announcements load from the CMS at runtime, so their pages stay out of the index for now.
for(const file of ['news.html','news-zh.html']){if(!(await readFile(file,'utf8')).includes('name="robots" content="noindex,follow"'))throw Error(file+': must be noindex');}
if(/\/news(-zh)?</.test(sitemap))throw Error('News pages must not be in the sitemap');
for(const file of ['index.html','en.html','zh.html']){const html=await readFile(file,'utf8');if(!/<a class="hero-cta" href="\/pricing(-zh)?">/.test(html))throw Error(file+': hero call to action must lead to all services');if(!/<p class="intro">[^]*?<a href="\/cosplay-experience(-zh)?">/.test(html))throw Error(file+': intro must keep the all-in-one guide link');}
for(const file of ['cosplay-experience.html','cosplay-experience-zh.html']){const html=await readFile(file,'utf8');if(!html.includes('id="inquiry-builder"')||!html.includes('src="/inquiry.js"')||!html.includes('class="inquiry-list"'))throw Error(file+': inquiry helper or plain checklist missing');}
await access('assets/social-card-v2.jpg');
console.log('Sitemap and share image OK');


const prices=JSON.parse(await readFile('service-data.json','utf8')).packages;
for(const file of ['pricing.html','pricing-zh.html']){const html=await readFile(file,'utf8');const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];const catalog=graph.find(n=>n['@type']==='OfferCatalog');if(!catalog||catalog.itemListElement.some((offer,i)=>offer.price!==prices[i].price||offer.priceCurrency!=='TWD'))throw Error('Price schema must match published package data');}
for(const file of ['cosplay-experience.html','cosplay-experience-zh.html']){const html=await readFile(file,'utf8');for(const p of prices)if(!html.includes('NT$'+p.price.toLocaleString('en-US')))throw Error('Guide price mismatch');if(!html.includes('2026-10-18')||!html.includes('cosplay-experience'))throw Error('Guide metadata missing');}
console.log('Beginner guides, visible package prices, structured data and discovery links OK');

const icon=await readFile('assets/coz-green-icon.png');if(icon.readUInt32BE(16)!==192||icon.readUInt32BE(20)!==192)throw Error('Search favicon must be square 192px');const ico=await readFile('favicon.ico');if(ico.readUInt16LE(2)!==1||ico.readUInt16LE(4)!==3)throw Error('ICO fallback missing');for(const file of files){const html=await readFile(file,'utf8');if(!html.includes('/assets/coz-green-icon.png'))throw Error(file+': green search icon missing');if(file.startsWith('about')&&(!html.includes('class="admin-signin-link"')||html.includes('class="admin-entry" href="/admin.html"')))throw Error('About sign-in must not share admin card styles');}
console.log('Green favicon assets and compact sign-in class separation OK');

// Search-facing service data must describe the visible offer, not invent availability.
for(const file of ['cosplay-experience.html','cosplay-experience-zh.html']){
 const html=await readFile(file,'utf8');
 const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
 const service=graph.find(node=>node['@type']==='Service');
 const article=graph.find(node=>node['@type']==='Article');
 if(!service||service.provider?.['@id']!=='https://cozcos.com/#organization')throw Error('Guide must identify the actual service provider');
 if(service.hasOfferCatalog?.itemListElement?.length!==prices.length)throw Error('Guide service packages missing');
 for(const [i,offer] of service.hasOfferCatalog.itemListElement.entries()){
  if(offer.price!==prices[i].price||offer.priceCurrency!=='TWD'||!html.includes(offer.description))throw Error('Service data must match visible package contents and prices');
  if('availability' in offer)throw Error('Do not invent date or stock availability');
 }
 if(article.datePublished!=='2026-10-18'||article.dateModified!=='2026-11-09')throw Error('Preserve publication date and record the actual revision date');
 if(article.about?.['@id']!==service['@id'])throw Error('Guide and service must be linked');
 if(file.endsWith('-zh.html')&&!/<h1>[^<]*Cosplay 一條龍體驗/.test(html))throw Error('Visible heading must describe the target service');
}
const locations=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match=>match[1]);
if(new Set(locations).size!==locations.length||locations.some(url=>/\/admin(?:\.|\/|$)|\/zh\.html/.test(url)))throw Error('Sitemap must list only unique canonical public pages');
console.log('Service SEO: visible offers, provider linkage, original publication date and canonical sitemap verified');

// Every editorial article must be discoverable without JS and keep its factual attribution.
for(const a of articles)for(const lang of ['zh','en']){
 const path=a.slug+(lang==='zh'?'-zh':'')+'.html';
 const html=await readFile(path,'utf8');
 const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
 const article=graph.find(n=>n['@type']==='Article');
 if(!article||article.headline!==a[lang].title||!html.includes('<h1>'+article.headline+'</h1>'))throw Error('Article headline must match visible content');
 if(article.datePublished!=='2026-10-23'||article.author?.['@id']!=='https://cozcos.com/#organization')throw Error('Article date or authorship mismatch');
 if(!sitemap.includes('https://cozcos.com'+cleanPagePath('/'+path)))throw Error('Article missing from sitemap');
 for(const parent of ['faq','about','pricing','cosplay-experience']){
  const entry=await readFile(parent+(lang==='zh'?'-zh':'')+'.html','utf8');
  if(!entry.includes('href="'+cleanPagePath('/'+path)+'"'))throw Error('Article must have an existing public entry link');
 }
 if(a.image&&(!html.includes(a.credit)||!html.includes(a.source)||article.image!=='https://cozcos.com'+a.image))throw Error('Portrait attribution missing');
 for(const [,url] of a.sources||[])if(!html.includes(url)||!article.citation.includes(url))throw Error('Care source must be visible and linked');
}
console.log('Editorial articles: bilingual discovery, visible/schema parity, dates and source credits OK');
