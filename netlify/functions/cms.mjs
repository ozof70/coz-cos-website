import {getStore} from '@netlify/blobs';
import {createCMS} from '../../server/cms.mjs';
export default async req=>{
 const hostname=new URL(req.url).hostname;
 // Private admin credentials are read only at runtime on the production domain.
 const production=['cozcos.com','www.cozcos.com'].includes(hostname);
 const secrets=production?await getStore({name:'coz-admin-private',consistency:'strong'}).get('configuration',{type:'json'}):{};
 return createCMS(getStore({name:'coz-cms',consistency:'strong'}),secrets||{})(req);
};
export const config={path:'/api/cms'};
