import {readFile,writeFile,rename,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const directory='.local-data';await mkdir(directory,{recursive:true});let chain=Promise.resolve();
const path=key=>directory+'/'+createHash('sha256').update(key).digest('hex')+'.json';
const read=async key=>{try{return JSON.parse(await readFile(path(key),'utf8'))}catch(e){if(e.code==='ENOENT')return null;throw e}};
export const localStore={get:async key=>(await read(key))?.data||null,getWithMetadata:read,setJSON(key,data,condition={}){const operation=chain.then(async()=>{const current=await read(key);if(condition.onlyIfNew&&current||condition.onlyIfMatch&&current?.etag!==condition.onlyIfMatch)return {modified:false};const etag=createHash('sha256').update(JSON.stringify(data)).digest('hex');await writeFile(path(key)+'.tmp',JSON.stringify({data,etag}));await rename(path(key)+'.tmp',path(key));return {modified:true}});chain=operation.catch(()=>{});return operation}};
