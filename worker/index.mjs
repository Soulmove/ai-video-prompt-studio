import {handleAPI} from './api.mjs';
import {serveAsset} from './assets.mjs';
export default {async fetch(request,env,ctx){const url=new URL(request.url);if(url.pathname.startsWith('/api/'))return handleAPI(request,env);if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});return serveAsset(request);}};
