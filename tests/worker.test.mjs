import {test} from 'node:test';
import assert from 'node:assert/strict';
import worker from '../dist/server/index.js';
import {exampleAIPlan} from '../dist/ai-planner.mjs';
test('deployed Worker embeds the homepage, browser modules and original raster assets',async()=>{
 const get=path=>worker.fetch(new Request('https://studio.example'+path),{});let r=await get('/');assert.equal(r.status,200);assert.ok((await r.text()).includes('creation.css'));r=await get('/app.mjs');assert.match(r.headers.get('content-type'),/javascript/);assert.ok((await r.text()).includes('AI帮我填写'));r=await get('/assets/creative-still.jpg');const bytes=new Uint8Array(await r.arrayBuffer());assert.equal(bytes[0],255);assert.equal(bytes[1],216);assert.equal((await get('/.env')).status,404);assert.equal((await get('/server/index.js')).status,404);
});
test('deployed API maintains identity requirements independently from static delivery',async()=>{const r=await worker.fetch(new Request('https://studio.example/api/config'),{GEMINI_API_KEY:'SECRET'});assert.equal(r.status,401);assert.ok(!(await r.text()).includes('SECRET'));});

test('deployed connection and generation work with the Workers redirect contract and global fetch receiver',async t=>{
 const seen=[];t.mock.method(globalThis,'fetch',function(url,init){assert.equal(this,globalThis);if(!['manual','follow'].includes(init.redirect))throw new TypeError('Invalid redirect value, must be one of follow or manual');assert.equal(init.redirect,'manual');seen.push({url,method:init.method||'GET'});return Promise.resolve(url.endsWith(':streamGenerateContent?alt=sse')?new Response(JSON.stringify({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify(exampleAIPlan())}]}}]})):new Response('{"name":"models/gemini-4-hydrogen"}'));});
 const send=(path,body)=>worker.fetch(new Request('https://studio.example'+path,{method:'POST',headers:{'Origin':'https://studio.example','Content-Type':'application/json','oai-authenticated-user-id':'runtime-regression','x-jingxu-api-key':'SYNTHETIC.KEY+123='},body:JSON.stringify(body)}),{});
 let r=await send('/api/ai/connection',{connection:{model:'gemini-4-hydrogen'}});assert.equal(r.status,200);assert.equal((await r.json()).verified,true);
 r=await send('/api/ai/plan',{idea:'雨夜咖啡馆收到一封没有署名的信',duration:10,shotCount:2,mode:'story',context:{}});assert.equal(r.status,200);assert.equal((await r.json()).plan.shots.length,2);assert.deepEqual(seen.map(x=>x.method),['GET','POST']);
});
test('deployed connection refuses provider redirects without sending credentials to their destination',async t=>{
 let calls=0;t.mock.method(globalThis,'fetch',async(url,init)=>{calls++;assert.ok(url.startsWith('https://generativelanguage.googleapis.com/'));assert.equal(init.redirect,'manual');return new Response('',{status:302,headers:{Location:'https://different.example/collect'}});});
 const r=await worker.fetch(new Request('https://studio.example/api/ai/connection',{method:'POST',headers:{Origin:'https://studio.example','Content-Type':'application/json','oai-authenticated-user-id':'redirect-regression','x-jingxu-api-key':'SYNTHETIC.KEY+123='},body:'{"connection":{"model":"gemini-4-hydrogen"}}'}),{});assert.equal(r.status,502);assert.equal((await r.json()).error.code,'PROVIDER_REDIRECT');assert.equal(calls,1);
});
