import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {parseEvents} from './update-events.mjs';
const fixture='<article class="event_smi_info"><a href="/events/info/123" itemprop="name">Test &amp; event</a><time datetime="2026-10-17"></time><meta itemprop="endDate" content="2026-10-18"><span itemprop="location"><span itemprop="name">Venue</span></span></article>';
const event=parseEvents(fixture,'north','2026-10-13')[0];
assert.equal(event.name,'Test & event');assert.equal(event.endDate,'2026-10-18');assert.equal(event.booking,'open');
assert.equal(parseEvents(fixture,'north','2026-10-19').length,0);
assert.throws(()=>parseEvents('<html>blocked</html>','north','2026-10-13'));
assert.throws(()=>parseEvents(fixture.replace('itemprop="location"','itemprop="missing"'),'north','2026-10-13'));
const data=JSON.parse(await readFile('events-data.json','utf8'));
assert.ok(data.events.length>0);assert.equal(new Set(data.events.map(event=>event.id)).size,data.events.length);
for(const region of ['north','central','south'])assert.ok(data.events.some(event=>event.region===region));
for(const event of data.events){assert.ok(event.name&&event.venue);assert.match(event.source,/^https:\/\/www\.doujin\.com\.tw\/events\/info\/\d+$/);assert.ok(['open','closed','full'].includes(event.booking));assert.ok(event.startDate<=event.endDate)}
for(const file of ['events-zh.html','events.html']){
 const html=await readFile(file,'utf8');
 assert.equal((html.match(/data-event-id=/g)||[]).length,data.events.length);
 assert.ok(html.includes('950'));
 assert.ok(html.includes('https://www.instagram.com/cozcos_cosplay/'));
 assert.ok(html.includes('--reveal-x:-24px')&&html.includes('--reveal-x:24px'));
 assert.ok(html.includes('id="north"')&&html.includes('id="central"')&&html.includes('id="south"'));
}
console.log(`Events: ${data.events.length} records, three regions, IG booking, expired filtering and failed-source guards OK`);
