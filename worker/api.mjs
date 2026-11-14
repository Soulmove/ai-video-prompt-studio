import {aiConfiguration,generatePlan,ServiceError,requestAIEnvironment,testGoogleConnection,googleFetch} from './gemini.mjs';
export function apiJSON(value,status=200){return new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Vary':'Origin'}});}
export async function readAPIJSON(request,limit=90000){if(!request.headers.get('content-type')?.toLowerCase().includes('application/json'))throw new ServiceError(415,'JSON_REQUIRED','请求需要使用 JSON 格式。');if(Number(request.headers.get('content-length')||0)>limit)throw new ServiceError(413,'REQUEST_TOO_LARGE','请求过大，请减少输入内容。');const reader=request.body?.getReader();if(!reader)throw new ServiceError(400,'BODY_REQUIRED','请求内容为空。');let size=0,parts=[];while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>limit){await reader.cancel();throw new ServiceError(413,'REQUEST_TOO_LARGE','请求过大，请减少输入内容。');}parts.push(value);}const bytes=new Uint8Array(size);let offset=0;for(const v of parts){bytes.set(v,offset);offset+=v.length;}try{return JSON.parse(new TextDecoder().decode(bytes));}catch{throw new ServiceError(400,'BAD_JSON','请求不是有效的 JSON。');}}
export function createAPI({fetcher=googleFetch,now=Date.now}={}){const requests=new Map(),active=new Set();return async function handle(request,env={}){const url=new URL(request.url),path=url.pathname;try{
 if(path==='/api/health'&&request.method==='GET')return apiJSON({service:'jingxu',version:'1.5'});
 const user=request.headers.get('oai-authenticated-user-id');if(!user)throw new ServiceError(401,'SIGN_IN_REQUIRED','请先登录网站，再使用创作服务。');
 if(path==='/api/config'&&request.method==='GET')return apiJSON({ai:aiConfiguration(env),video:{ready:false,name:'Muse / 视频生成服务',reason:'等待确认服务商、API权限与接口文档',modes:[],note:'可以先保存生成计划、管理参考图和导入已有视频链接。'}});
 if(request.method!=='POST')throw new ServiceError(405,'METHOD_NOT_ALLOWED','此操作不支持当前请求方式。');
 if(request.headers.get('origin')!==url.origin)throw new ServiceError(403,'ORIGIN_REJECTED','请从工作台内发起此操作。');
 const body=await readAPIJSON(request);
 const aiEnv=path.startsWith('/api/ai/')?requestAIEnvironment(request,body,env):env;
 if(path==='/api/ai/connection')return apiJSON(await testGoogleConnection(aiEnv,{fetcher,signal:AbortSignal.timeout(20000)}));
 if(path==='/api/ai/plan'){
  if(!aiConfiguration(aiEnv).ready)throw new ServiceError(503,'AI_NOT_CONFIGURED','请先连接自己的 Google API Key，再生成填写内容。');
  const time=now(),recent=(requests.get(user)||[]).filter(t=>time-t<60000);if(recent.length>=3||active.has(user)||active.size>=4)throw new ServiceError(429,'PLEASE_WAIT','当前正在处理请求，请稍后再试。');
  if(requests.size>1000)for(const [key,values] of requests)if(!values.some(t=>time-t<60000))requests.delete(key);
  requests.set(user,[...recent,time]);active.add(user);try{return apiJSON(await generatePlan(body,aiEnv,{fetcher,signal:request.signal}));}finally{active.delete(user);}
 }
 if(path==='/api/video/generate'||path==='/api/video/status')throw new ServiceError(501,'VIDEO_NOT_CONNECTED','视频服务尚未接入，没有提交任务，也不会产生视频生成费用。');
 throw new ServiceError(404,'NOT_FOUND','没有找到此创作服务。');
 }catch(e){return apiJSON({error:{code:e.code||'INVALID_REQUEST',message:e instanceof ServiceError?e.message:e.message?.startsWith('请')||e.message?.includes('应在')||e.message?.includes('数量')?e.message:'请求格式不正确或暂时无法处理，请检查后重试。'}},e.status||400);}};}
export const handleAPI=createAPI();
