import {readFile,access} from 'node:fs/promises';
const files=['index.html','en.html','zh.html','about.html','about-zh.html','faq.html','faq-zh.html','pricing.html','pricing-zh.html','characters.html','characters-zh.html','events.html','events-zh.html','news.html','news-zh.html'];
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
if((sitemap.match(/<loc>/g)||[]).length!==14)throw Error('Sitemap must contain fourteen public pages');
await access('assets/social-card-v2.jpg');
console.log('Sitemap and share image OK');

