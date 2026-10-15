import {readFile,writeFile,rename} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const decode = text => text.replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).replace(/&#x([\da-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16))).trim();
export function isSupportedEvent(event){
 const location = `${event.venue} ${event.name}`;
 // Source regional categories can include eastern venues; never trust the category alone.
 if(/花蓮|[台臺]東|彰化|南投|雲林|嘉義|[台臺]南|高雄|屏東|澎湖|金門|連江/.test(location)) return false;
 if(event.region==='north') return true;
 return event.region==='central' && /苗栗|[台臺]中/.test(location);
}
export function withinEventWindow(event,today){
 const [year,month,day]=today.split('-').map(Number);
 const limit=new Date(Date.UTC(year,month-1+4,1));
 const last=new Date(Date.UTC(limit.getUTCFullYear(),limit.getUTCMonth()+1,0)).getUTCDate();
 limit.setUTCDate(Math.min(day,last));
 return event.endDate>=today && event.startDate<limit.toISOString().slice(0,10);
}
export function parseEvents(html,region,today){
 const blocks=[...html.matchAll(/<article\s+class="event_smi_info"[\s\S]*?<\/article>/g)].map(match=>match[0]);
 if(!blocks.length)throw Error(`No event cards found for ${region}; keep existing data`);
 return blocks.map(block=>{
  const name=block.match(/<a\s+href="(\/events\/info\/\d+)"\s+itemprop="name">([\s\S]*?)<\/a>/);
  const startDate=block.match(/<time\s+datetime="(\d{4}-\d{2}-\d{2})"/); 
  const endDate=block.match(/<meta\s+itemprop="endDate"\s+content="(\d{4}-\d{2}-\d{2})"/);
  const venue=block.match(/itemprop="location"[\s\S]*?<span\s+itemprop="name">([\s\S]*?)<\/span>/);
  if(!name||!startDate||!venue)throw Error(`Incomplete event card for ${region}; keep existing data`);
  return {id:'doujin-'+name[1].split('/').pop(),name:decode(name[2]),region,venue:decode(venue[1]),startDate:startDate[1],endDate:endDate?.[1]||startDate[1],source:'https://www.doujin.com.tw'+name[1],booking:'open'};
 }).filter(event=>withinEventWindow(event,today));
}
export async function updateEvents(){
 const today=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Taipei'}).format(new Date());
 const sources=[['north','n'],['central','c']];
 const groups=await Promise.all(sources.map(async([region,path])=>{
  const url='https://www.doujin.com.tw/events/alist/all/'+path;
  const response=await fetch(url,{signal:AbortSignal.timeout(30000)});
  if(!response.ok)throw Error(`${region}: HTTP ${response.status}; keep existing data`);
  return parseEvents(await response.text(),region,today).filter(isSupportedEvent);
 }));
 let previous={events:[]};
 try{previous=JSON.parse(await readFile('events-data.json','utf8'))}catch(error){if(error.code!=='ENOENT')throw error}
 const previousOverrides=new Map(previous.events.filter(event=>event.booking!=='open').map(event=>[event.id,event.booking]));
 const merged=new Map();
 for(const event of groups.flat()){
  if(previousOverrides.has(event.id))event.booking=previousOverrides.get(event.id);
  if(!merged.has(event.id))merged.set(event.id,event);
 }
 const events=[...merged.values()].sort((a,b)=>a.startDate.localeCompare(b.startDate)||a.id.localeCompare(b.id));
 if(!events.length)throw Error('No future events found; keep existing data');
 const result={updated:today,source:'https://www.doujin.com.tw/events/alist/all',bookingPolicy:'Upcoming events are open to COz Cos booking inquiries; availability is confirmed on Instagram.',events};
 await writeFile('events-data.json.tmp',JSON.stringify(result,null,2)+'\n');
 await rename('events-data.json.tmp','events-data.json');
 console.log(`Updated ${events.length} events: ${groups.map((group,index)=>sources[index][0]+' '+group.length).join(', ')}`);
 return result;
}
if(process.argv[1]===fileURLToPath(import.meta.url))await updateEvents();
