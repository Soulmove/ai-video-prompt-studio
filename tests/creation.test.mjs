import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as M from '../dist/model.mjs';
import {exampleAIPlan,applyAIPlan,contextForAI,DEFAULT_AI_SCOPES,canAutoFill,hasAuthoredAIProject} from '../dist/ai-planner.mjs';
import {normalizePlan,normalizePlanRequest,planSchema} from '../dist/ai-contract.mjs';
import {ensureVideoData,createVideoPlan,videoPromptText,importVideoResult,safeVideoURL} from '../dist/video-core.mjs';

test('AI plans apply as editable project assets with new IDs and valid shot references',()=>{
 const p=M.makeBlankProject(),before=M.clone(p),raw=exampleAIPlan(),{project:q,report}=applyAIPlan(p,raw);
 assert.deepEqual(p,before);assert.equal(report.shotsAdded,2);assert.equal(q.targetDuration,10);assert.equal(q.shots[0].characterIds[0],q.characters[0].id);assert.equal(q.shots[0].sceneId,q.scenes[0].id);assert.notEqual(q.characters[0].id,raw.characters[0].ref);assert.ok(M.generate(q).includes('窗边等待'));assert.deepEqual(M.validateImport(q),q);
});
test('filling preserves authored text, locked character attributes, references and earlier shots',()=>{
 const p=M.makeProject();p.logline='作者自己的剧情';p.characters[0].outfit='作者指定的深色外套';const first=p.shots[0].id;
 const q=applyAIPlan(p,exampleAIPlan()).project;assert.equal(q.logline,p.logline);assert.equal(q.characters.find(c=>c.name==='林夏').outfit,'作者指定的深色外套');assert.equal(q.shots[0].id,first);assert.equal(q.shots.length,5);assert.equal(q.targetDuration,25);
});
test('selective application rejects missing dependencies without partially mutating the project',()=>{
 const p=M.makeBlankProject(),before=M.clone(p);assert.throws(()=>applyAIPlan(p,exampleAIPlan(),{scopes:{...DEFAULT_AI_SCOPES,characters:false}}),/对应/);assert.deepEqual(p,before);
 const q=applyAIPlan(p,exampleAIPlan(),{scopes:{story:true,style:true}}).project;assert.equal(q.shots.length,0);assert.equal(q.characters.length,0);assert.equal(q.style.look,'cinema');
});
test('new-project application preserves the source and copies creative output targets',()=>{
 const p=M.makeProject(),before=M.clone(p);p.format='16:9';const q=applyAIPlan(p,exampleAIPlan(),{asNew:true}).project;assert.notEqual(q.id,p.id);assert.equal(q.format,'16:9');assert.equal(q.shots.length,2);assert.equal(p.shots.length,before.shots.length);
});
test('model output rejects malformed references, poison keys, unknown vocabulary and excess duration',()=>{
 let q=exampleAIPlan();q.shots[0].characterRefs=['missing'];assert.throws(()=>normalizePlan(q),/未知角色/);
 q=exampleAIPlan();q.style.look='made-up';assert.throws(()=>normalizePlan(q),/未知选项/);
 q=exampleAIPlan();q.shots[0].duration=90;assert.throws(()=>normalizePlan(q),/时长/);
 assert.throws(()=>normalizePlan(JSON.parse('{"__proto__":{"polluted":true}}')),/不允许/);assert.equal({}.polluted,undefined);assert.equal(planSchema().properties.shots.type,'array');
});
test('only bounded text context is sent to AI, without uploaded reference bytes or video results',()=>{
 const p=M.makeProject();p.references=[{id:'r',data:'data:image/png;base64,SECRET'}];p.videoResults=[{url:'https://private.example/signed?token=SECRET'}];const text=JSON.stringify(contextForAI(p));assert.ok(!text.includes('SECRET'));assert.throws(()=>normalizePlanRequest({idea:'x',duration:20,shotCount:3}),/4/);assert.throws(()=>normalizePlanRequest({idea:'拍一段短片',duration:300,shotCount:3}),/时长/);
});
test('local video plans freeze the prompt and never become submitted or claim real progress',()=>{
 const p=M.makeBlankProject(),d=ensureVideoData(p);d.prompt='画面规格：9:16 · 4K · 15s\n\n她缓缓回头';d.duration=20;const job=createVideoPlan(p,d);assert.equal(job.status,'draft');assert.equal(job.remoteTaskId,null);assert.equal(job.submittedAt,null);assert.ok(job.prompt.startsWith('画幅目标：'));assert.ok(!job.prompt.includes('15s'));d.prompt='改变后的内容';assert.ok(!job.prompt.includes('改变后的内容'));p.videoJobs.push(job);assert.deepEqual(M.validateImport(p),p);
});
test('reusing a video plan emits output parameters only once and checks reference modes',()=>{
 const p=M.makeBlankProject(),d=ensureVideoData(p);d.prompt='她缓缓回头';const first=videoPromptText(d);d.prompt=first;assert.equal(videoPromptText(d),first);d.mode='reference';assert.throws(()=>createVideoPlan(p,d),/参考图片/);d.mode='frames';assert.throws(()=>createVideoPlan(p,d),/两张/);
});
test('imported video links are labelled as imports and dangerous links are rejected',()=>{
 const p=M.makeBlankProject(),r=importVideoResult(p,{title:'第一版',url:'https://media.example/video.mp4'});assert.equal(r.status,'imported');assert.equal(r.origin,'imported');for(const url of ['javascript:alert(1)','data:video/mp4;base64,abc','https://user:pass@media.example/video.mp4','blob:https://example/abc','file:///tmp/a.mp4'])assert.equal(safeVideoURL(url),'');
 p.videoResults=[r];assert.deepEqual(M.validateImport(p),p);p.videoJobs=[{id:'bad',origin:'local-plan',status:'running',prompt:'x'}];assert.throws(()=>M.validateImport(p),/不能/);
});
test('an unfinished editable AI preview can be saved and corrected without losing the project',()=>{
 const p=M.makeBlankProject();p.aiSuggestion={plan:exampleAIPlan(),origin:'demo',projectId:p.id,applied:false};p.aiSuggestion.plan.shots[0].duration=0;assert.deepEqual(M.validateImport(p),p);assert.throws(()=>applyAIPlan(p,p.aiSuggestion.plan),/时长/);
});
test('automatic filling only proceeds in the untouched originating project and active AI view',()=>{
 const state={enabled:true,sourceId:'a',currentId:'a',startRevision:2,currentRevision:2,view:'ai',surface:'studio'};
 assert.equal(canAutoFill(state),true);for(const change of [{enabled:false},{currentId:'b'},{currentRevision:3},{view:'storyboard'},{surface:'home'}])assert.equal(canAutoFill({...state,...change}),false);
 const p=M.makeBlankProject();p.aiBrief={idea:'拍一段短片'};assert.equal(hasAuthoredAIProject(p),false);p.shots.push(M.makeShot(p));assert.equal(hasAuthoredAIProject(p),true);
});
test('a new automatic project may start with independent assets when reuse is disabled',()=>{
 const p=M.makeProject();p.aiBrief={idea:'另一个故事',duration:20,shotCount:3,autoFill:true};p.characters[0].outfit='旧项目服装';const q=applyAIPlan(p,exampleAIPlan(),{asNew:true,reuseExistingAssets:false}).project;
 assert.equal(q.characters[0].outfit,'米白色棉麻衬衫，深色长裤');assert.equal(q.characters[0].locks.outfit,false);assert.equal(q.aiBrief.idea,'另一个故事');assert.equal(p.characters[0].outfit,'旧项目服装');
});
