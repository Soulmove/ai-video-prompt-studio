import {test} from 'node:test';
import assert from 'node:assert/strict';
import worker from '../dist/server/index.js';
test('deployed Worker embeds the homepage, browser modules and original raster assets',async()=>{
 const get=path=>worker.fetch(new Request('https://studio.example'+path),{});let r=await get('/');assert.equal(r.status,200);assert.ok((await r.text()).includes('creation.css'));r=await get('/app.mjs');assert.match(r.headers.get('content-type'),/javascript/);assert.ok((await r.text()).includes('AI帮我填写'));r=await get('/assets/creative-still.jpg');const bytes=new Uint8Array(await r.arrayBuffer());assert.equal(bytes[0],255);assert.equal(bytes[1],216);assert.equal((await get('/.env')).status,404);assert.equal((await get('/server/index.js')).status,404);
});
test('deployed API maintains identity requirements independently from static delivery',async()=>{const r=await worker.fetch(new Request('https://studio.example/api/config'),{GEMINI_API_KEY:'SECRET'});assert.equal(r.status,401);assert.ok(!(await r.text()).includes('SECRET'));});
