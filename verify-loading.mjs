import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

class Element {
  constructor(tag) { this.tag=tag; this.children=[]; this.attributes={}; this.listeners={}; }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children=children.flatMap(child=>child.tag==='fragment'?child.children:[child]); }
  setAttribute(name,value) { this.attributes[name]=value; }
  addEventListener(name,handler) { this.listeners[name]=handler; }
}
const list=new Element('div');
let finishRequest;
const context={
  AbortController,setTimeout,clearTimeout,Intl,Date,
  document:{documentElement:{lang:'en'},querySelector:selector=>selector==='#news-list'?list:null,createElement:tag=>new Element(tag),createDocumentFragment:()=>new Element('fragment')},
  fetch:()=>new Promise((resolve,reject)=>{finishRequest={resolve,reject};})
};
vm.runInNewContext(await readFile('cms-ui.js','utf8'),context);
assert.equal(list.attributes['aria-busy'],'true');
assert.match(list.children[0].innerHTML,/skeleton/);
finishRequest.reject(Error('Offline'));
await new Promise(setImmediate);
assert.equal(list.attributes['aria-busy'],'false');
const retry=list.children.find(child=>child.tag==='button');
assert.ok(retry,'Offline news must provide a retry action');
const retrying=retry.listeners.click();
assert.equal(list.attributes['aria-busy'],'true');
finishRequest.resolve({ok:true,json:async()=>({news:[{createdAt:'2026-10-15T01:00:00Z',title:'Recovered',body:'Announcement body'}]})});
await retrying;
assert.equal(list.attributes['aria-busy'],'false');
assert.equal(list.children[0].tag,'details');
assert.equal(list.children[0].children[0].children[1].textContent,'Recovered');
console.log('Loading: pending skeleton, offline recovery, retry and accessible busy states OK');
