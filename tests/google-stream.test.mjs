import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readGoogleGeneration,generatePlan} from '../worker/gemini.mjs';
import {exampleAIPlan} from '../dist/ai-planner.mjs';
function stream(events){const bytes=new TextEncoder().encode(events.map(x=>'data: '+JSON.stringify(x)+'\r\n\r\n').join(''));let offset=0;return new Response(new ReadableStream({pull(controller){if(offset===bytes.length)return controller.close();const end=Math.min(offset+7,bytes.length);controller.enqueue(bytes.slice(offset,end));offset=end;}}),{headers:{'Content-Type':'text/event-stream'}});}
test('Google SSE assembles split UTF8 and events, ignores thought text and requires a complete ending',async()=>{
 const r=await readGoogleGeneration(stream([{candidates:[{content:{parts:[{text:'hidden',thought:true},{text:'{"中文":'}]}}]},{candidates:[{content:{parts:[{text:'"完成"}'}]},finishReason:'STOP'}]}]));assert.equal(r.candidates[0].content.parts[0].text,'{"中文":"完成"}');
 await assert.rejects(readGoogleGeneration(stream([{candidates:[{content:{parts:[{text:'partial'}]}}]}])),e=>e.code==='INCOMPLETE_PLAN');
 await assert.rejects(readGoogleGeneration(stream([{error:{message:'PRIVATE'}}])),e=>e.code==='PROVIDER_STREAM_ERROR'&&!e.message.includes('PRIVATE'));
});
test('stream generation uses the reference endpoint with structured output and validates the assembled plan',async()=>{
 let request;const plan=JSON.stringify(exampleAIPlan()),result=await generatePlan({idea:'雨夜收到一封信的故事',duration:10,shotCount:2,mode:'story'},{GEMINI_API_KEY:'SYNTHETIC.KEY+123='},{fetcher:async(url,init)=>{request={url,init};return stream([{candidates:[{content:{parts:[{text:plan.slice(0,60)}]}}]},{candidates:[{content:{parts:[{text:plan.slice(60)}]},finishReason:'STOP'}]}]);}});assert.match(request.url,/:streamGenerateContent\?alt=sse$/);assert.ok(!request.url.includes('SYNTHETIC'));const body=JSON.parse(request.init.body);assert.equal(body.generationConfig.thinkingConfig.thinkingLevel,'low');assert.ok(body.generationConfig.responseJsonSchema);assert.equal(result.plan.shots.length,2);
});
