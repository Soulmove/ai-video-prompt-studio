import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createAPI} from '../worker/api.mjs';
import {exampleAIPlan} from '../dist/ai-planner.mjs';
const host='https://studio.example';
const req=(path,{method='GET',user='u1',origin=host,body}={})=>new Request(host+path,{method,headers:{...(user?{'oai-authenticated-user-id':user}:{}),...(method==='POST'?{'Origin':origin,'Content-Type':'application/json'}:{})},body:body===undefined?undefined:JSON.stringify(body)});
const payload={idea:'雨夜咖啡馆里，她收到一封没有署名的信',duration:10,shotCount:2,mode:'story',context:{}};
const okResponse=()=>new Response(JSON.stringify({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify(exampleAIPlan())}]}}]}),{headers:{'Content-Type':'application/json'}});

test('creation APIs require visitor identity and reject cross-origin mutations',async()=>{
 const api=createAPI();assert.equal((await api(req('/api/config',{user:null}),{})).status,401);assert.equal((await api(req('/api/ai/plan',{method:'POST',origin:'https://other.example',body:payload}),{})).status,403);
});
test('service state exposes capabilities but never the server key and does not call the provider',async()=>{
 let calls=0;const api=createAPI({fetcher:()=>{calls++;}}),r=await api(req('/api/config'),{GEMINI_API_KEY:'NEVER_EXPOSE_THIS'}),text=await r.text();assert.equal(calls,0);assert.ok(!text.includes('NEVER_EXPOSE_THIS'));const d=JSON.parse(text);assert.equal(d.ai.ready,true);assert.equal(d.ai.model,'gemini-4-hydrogen');assert.equal(d.video.ready,false);
});
test('missing AI keys and unconnected video never start paid work',async()=>{
 let calls=0;const api=createAPI({fetcher:()=>{calls++;}});assert.equal((await api(req('/api/ai/plan',{method:'POST',body:payload}),{})).status,503);assert.equal((await api(req('/api/video/generate',{method:'POST',body:{prompt:'hello'}}),{})).status,501);assert.equal(calls,0);
});
test('official Google request uses server authentication and structured JSON, returning validated data',async()=>{
 let call;const api=createAPI({fetcher:async(url,options)=>{call={url,options};return okResponse();}});const r=await api(req('/api/ai/plan',{method:'POST',body:payload}),{GEMINI_API_KEY:'SERVER_ONLY'}),body=await r.json();assert.equal(r.status,200);assert.equal(call.url,'https://generativelanguage.googleapis.com/v1beta/models/gemini-4-hydrogen:generateContent');assert.equal(call.options.headers['x-goog-api-key'],'SERVER_ONLY');const upstream=JSON.parse(call.options.body);assert.equal(upstream.generationConfig.responseMimeType,'application/json');assert.ok(upstream.generationConfig.responseJsonSchema.properties.shots);assert.equal(body.plan.shots.length,2);assert.ok(!JSON.stringify(body).includes('SERVER_ONLY'));
});
test('upstream authentication failures are sanitized and incomplete responses cannot be applied',async()=>{
 let api=createAPI({fetcher:async()=>new Response('SECRET KEY in provider diagnostic',{status:403})});let r=await api(req('/api/ai/plan',{method:'POST',body:payload}),{GEMINI_API_KEY:'KEY'});assert.equal(r.status,502);assert.ok(!(await r.text()).includes('SECRET KEY'));
 api=createAPI({fetcher:async()=>new Response(JSON.stringify({candidates:[{finishReason:'MAX_TOKENS',content:{parts:[{text:'{}'}]}}]}))});r=await api(req('/api/ai/plan',{method:'POST',body:payload}),{GEMINI_API_KEY:'KEY'});assert.equal(r.status,502);assert.equal((await r.json()).error.code,'INCOMPLETE_PLAN');
});
test('concurrent calls for the same user are bounded and release after completion',async()=>{
 let resolve;const api=createAPI({fetcher:()=>new Promise(r=>resolve=r)}),env={GEMINI_API_KEY:'KEY'},first=api(req('/api/ai/plan',{method:'POST',body:payload}),env);await new Promise(r=>setTimeout(r,10));const second=await api(req('/api/ai/plan',{method:'POST',body:payload}),env);assert.equal(second.status,429);resolve(okResponse());assert.equal((await first).status,200);
});
test('oversized and malformed JSON are rejected before provider calls',async()=>{
 let calls=0;const api=createAPI({fetcher:async()=>{calls++;return okResponse();}}),headers={'oai-authenticated-user-id':'u','Origin':host,'Content-Type':'application/json'};let r=await api(new Request(host+'/api/ai/plan',{method:'POST',headers,body:'{bad'}),{GEMINI_API_KEY:'KEY'});assert.equal(r.status,400);r=await api(new Request(host+'/api/ai/plan',{method:'POST',headers,body:'x'.repeat(100000)}),{GEMINI_API_KEY:'KEY'});assert.equal(r.status,413);assert.equal(calls,0);
});
test('personal API keys work without a site key, stay per-request, and are never returned',async()=>{
 const seen=[],env={};const api=createAPI({fetcher:async(url,options)=>{seen.push(options.headers['x-goog-api-key']);return okResponse();}});
 for(const [user,key] of [['u1','PERSONAL_KEY_ALPHA_123'],['u2','PERSONAL_KEY_BETA_456']]){const request=req('/api/ai/plan',{method:'POST',user,body:{...payload,connection:{model:'gemini-4-hydrogen'}}});request.headers.set('x-jingxu-api-key',key);const r=await api(request,env);assert.equal(r.status,200);assert.ok(!(await r.text()).includes(key));}
 assert.deepEqual(seen,['PERSONAL_KEY_ALPHA_123','PERSONAL_KEY_BETA_456']);assert.deepEqual(env,{});assert.equal((await (await api(req('/api/config'),env)).json()).ai.ready,false);
});
test('personal connection checks request model metadata instead of generating content',async()=>{
 let called;const api=createAPI({fetcher:async(url,options)=>{called={url,options};return new Response(JSON.stringify({name:'models/gemini-4-hydrogen'}));}}),request=req('/api/ai/connection',{method:'POST',body:{connection:{model:'gemini-4-hydrogen'}}});request.headers.set('x-jingxu-api-key','PERSONAL_KEY_CHECK_789');const r=await api(request,{}),result=await r.json();assert.equal(r.status,200);assert.equal(result.verified,true);assert.ok(called.url.endsWith('/models/gemini-4-hydrogen'));assert.equal(called.options.body,undefined);assert.ok(!JSON.stringify(result).includes('PERSONAL_KEY_CHECK'));
});
test('invalid personal models or keys are rejected before forwarding requests',async()=>{
 let calls=0;const api=createAPI({fetcher:async()=>{calls++;return okResponse();}});let request=req('/api/ai/plan',{method:'POST',body:{...payload,connection:{model:'https://evil.example'}}});request.headers.set('x-jingxu-api-key','PERSONAL_KEY_123456');assert.equal((await api(request,{})).status,400);request=req('/api/ai/plan',{method:'POST',body:payload});request.headers.set('x-jingxu-api-key','short');assert.equal((await api(request,{})).status,400);assert.equal(calls,0);
});
