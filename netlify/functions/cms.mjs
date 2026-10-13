import {getStore} from '@netlify/blobs';
import {createCMS} from '../../server/cms.mjs';
export default async req=>createCMS(getStore({name:'coz-cms',consistency:'strong'}),{salt:process.env.COZ_ADMIN_SALT,passwordHash:process.env.COZ_ADMIN_PASSWORD_HASH,sessionKey:process.env.COZ_ADMIN_SESSION_KEY})(req);
export const config={path:'/api/cms'};
