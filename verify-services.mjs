import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const data=JSON.parse(await readFile('service-data.json','utf8'));
assert.equal(data.roles.length,53);
assert.equal(data.roles.filter(role=>role.group==='main').length,53);
assert.equal(data.roles.filter(role=>role.group==='partner').length,0);
assert.deepEqual(data.packages.map(item=>item.price),[3499,4699,5699,3299]);
assert.deepEqual(data.items.map(item=>item.price),[900,300,300,500,1200,950,1800,600,250]);
assert.equal(data.items[0].unitZh,'／小時（2小時起約）');
assert.equal(data.items[5].unitZh,'起');
assert.equal(data.roles.find(role=>role.character==='大清初音').work,'初音');
assert.equal(data.roles.find(role=>role.character==='阿蕾奇諾').size,'L & XL');
for(const lang of ['zh','en']){
 const pricing=await readFile(lang==='zh'?'pricing-zh.html':'pricing.html','utf8');
 for(const amount of [3499,4699,5699,3299,900,300,500,1200,950,1800,600,250])assert.ok(pricing.includes('NT$'+amount.toLocaleString('en-US')));
 const roles=await readFile(lang==='zh'?'characters-zh.html':'characters.html','utf8');
 assert.equal((roles.match(/<tr data-role /g)||[]).length,53);
 assert.ok(!/合作衣櫃|Partner closets|partner-closet/.test(roles));
 assert.ok(!roles.includes('service-photo-track'));
 assert.ok(!pricing.includes('service-photo-track'));
 assert.ok(roles.includes('--reveal-x:-24px')&&roles.includes('--reveal-x:24px'));
 assert.ok(!/NT\$|體驗補差價|皆需加200|造型假髮|未拆襪/.test(roles));
 assert.ok(roles.includes('id="role-search"'));
 assert.ok(pricing.includes('aria-expanded="false"'));
 assert.ok(pricing.includes('service-ui.js'));
}
const events={};
const node=()=>({hidden:false,listeners:{},attrs:{},addEventListener(name,callback){this.listeners[name]=callback},setAttribute(name,value){this.attrs[name]=value},focus(){this.focused=true}});
const button=node(),panel=node(),search=node(),status=node(),empty=node();
panel.hidden=true;search.value='';
const rows=[{...node(),dataset:{},textContent:'原神 八重神子 M'},{...node(),dataset:{},textContent:'初音 大清初音 ML'}];
const group={...node(),querySelectorAll:()=>rows,querySelector:()=>null};
const menu={querySelector:selector=>selector==='button'?button:panel,contains:target=>[button,panel].includes(target),addEventListener:(name,cb)=>events['menu:'+name]=cb};
await vm.runInNewContext(await readFile('service-ui.js','utf8'),{
 window:{addEventListener(){},COZ_ROLES_READY:new Promise(()=>{})},document:{documentElement:{lang:'zh-Hant'},querySelector:selector=>selector==='.service-menu'?menu:null,querySelectorAll:selector=>selector==='[data-role]'?rows:selector==='.role-group'?[group]:[],getElementById:id=>({'role-search':search,'role-count':status,'role-empty':empty})[id],addEventListener:(name,cb)=>events[name]=cb},
 setTimeout,clearTimeout,matchMedia:()=>({matches:true})
});
button.listeners.click({detail:0});assert.equal(panel.hidden,false);assert.equal(button.attrs['aria-expanded'],'true');
events.keydown({key:'Escape'});assert.equal(panel.hidden,true);assert.equal(button.focused,true);
search.value=' 八重神子 ';search.listeners.input();assert.equal(rows[0].hidden,false);assert.equal(rows[1].hidden,true);assert.equal(status.textContent,'共 1 筆角色');
search.value='不存在的角色';search.listeners.input();assert.equal(empty.hidden,false);assert.equal(group.hidden,true);
search.value='';search.listeners.input();assert.equal(status.textContent,'共 2 筆角色');assert.equal(group.hidden,false);
button.listeners.click({detail:0});events.click({target:{}});assert.equal(panel.hidden,true);
console.log('Services: 13 prices, 53 roles, public-only fields, search and menu keyboard behavior OK');

// Role nodes arriving after the API response must join the same reveal observer.
const revealCard=()=>{const names=new Set();return {classList:{add:name=>names.add(name),contains:name=>names.has(name)}}};
const revealCards=[revealCard()];let revealObserver;
class RevealObserver {
 constructor(callback){this.callback=callback;this.observed=new Set();revealObserver=this}
 observe(card){this.observed.add(card)}
 unobserve(card){this.observed.delete(card)}
 disconnect(){this.observed.clear()}
}
const revealWindow={addEventListener(){},IntersectionObserver:RevealObserver};
await vm.runInNewContext(await readFile('service-ui.js','utf8'),{
 window:revealWindow,IntersectionObserver:RevealObserver,
 document:{querySelector:()=>null,getElementById:()=>null,querySelectorAll:selector=>selector==='.service-reveal'?revealCards:[],addEventListener(){}},
 matchMedia:()=>({matches:false,addEventListener(){}})
});
assert.ok(revealCards[0].classList.contains('pending'));
const arrivingCard=revealCard();revealCards.push(arrivingCard);revealWindow.COZ_OBSERVE_REVEALS();
assert.ok(revealObserver.observed.has(arrivingCard));
revealObserver.callback([{target:arrivingCard,isIntersecting:true}]);
assert.ok(arrivingCard.classList.contains('visible'));
assert.ok(!revealObserver.observed.has(arrivingCard));
console.log('Reveal animations: dynamically loaded roles register and become visible on intersection OK');

