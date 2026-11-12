import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as M from '../dist/model.mjs';
import {makeCameraTemplate,applyCameraTemplate,clearShotCamera} from '../dist/camera-library.mjs';
import * as DB from '../dist/storage.mjs';
const {isDeletedSnapshot}=DB;

test('video parameters lead every copied prompt and single shots use their own duration',()=>{
 const p=M.makeProject();
 for(const mode of ['full','short','timeline','sequence'])assert.equal(M.generate(p,0,mode).split('\n')[0],'画面规格：9:16 · 4K (2160 × 3840) · 24fps · 15s');
 assert.ok(M.generate(p,0,'shot').startsWith('画面规格：9:16 · 4K (2160 × 3840) · 24fps · 4s'));
 assert.ok(!M.generate(p).includes('交付目标 /'));
 assert.equal(M.generate(p,0,'first').split('\n')[0],'画面规格：9:16 · 4K (2160 × 3840)');
});
test('negative prompts work from scratch, de-duplicate and survive project roundtrip',()=>{
 const p=M.makeBlankProject();assert.equal(M.generate(p),'');p.negativePrompts=['hands','hands'];
 assert.ok(M.generate(p).startsWith('画面规格：'));assert.equal(M.generate(p).match(/多余或缺失手指/g).length,1);
 p.customOptions.negative=[{id:'own',label:'禁止额外雨滴',zh:'额外雨滴',en:'extra raindrops'}];p.negativePrompts.push('own');
 assert.ok(M.generate(p).includes('额外雨滴'));assert.deepEqual(M.validateImport(p),p);
 p.language='en';assert.ok(M.generate(p).includes('extra raindrops'));
});
test('commerce video uses authored runtime and images only include spatial parameters',()=>{
 const p=M.makeBlankProject();p.mode='commerce';p.commerce.name='衬衫';p.commerce.output='video';p.commerce.beats=[{end:8,action:'展示衣领'}];
 assert.ok(M.generate(p).split('\n')[0].endsWith('24fps · 8s'));p.commerce.output='image';assert.ok(!M.generate(p).split('\n')[0].includes('fps'));
});
test('saved camera presets capture custom vocabulary and independent shot snapshots',()=>{
 const p=M.makeBlankProject(),s=M.makeShot(p);p.customOptions.move=[{id:'my-move',label:'窗边横移',zh:'沿窗边匀速横移'}];
 const t=makeCameraTemplate(p,'窗边近景',{...p.camera,move:'my-move',framing:'close'});
 const q=M.makeBlankProject();applyCameraTemplate(q,s,t);t.camera.framing='wide';assert.equal(s.camera.framing,'close');
 assert.equal(q.customOptions.move[0].label,'窗边横移');clearShotCamera(s);assert.deepEqual(s.camera,{});assert.equal(s.cameraPresetId,undefined);
 assert.throws(()=>makeCameraTemplate(p,'',p.camera),/命名/);assert.throws(()=>makeCameraTemplate(p,'空',p.camera),/至少选择/);
});
test('deleted snapshots cannot resurrect projects while new project identities remain valid',()=>{
 assert.equal(isDeletedSnapshot({id:'a',createdAt:100},['a']),true);
 assert.equal(isDeletedSnapshot({id:'a',createdAt:100},[],200),true);
 assert.equal(isDeletedSnapshot({id:'b',createdAt:201},[],200),false);
});

test('project removal and clear reject delayed saves and allow a fresh project',async()=>{
 const rows=new Map(),prefs=new Map();
 globalThis.localStorage={getItem:k=>prefs.get(k)??null,setItem:(k,v)=>prefs.set(k,String(v)),removeItem:k=>prefs.delete(k)};
 globalThis.indexedDB={open(){const req={result:{transaction(){const tx={objectStore(){const request=fn=>{const r={};queueMicrotask(()=>{r.result=fn();r.onsuccess?.();tx.oncomplete?.();});return r;};return {put:p=>request(()=>rows.set(p.id,structuredClone(p))),get:id=>request(()=>rows.get(id)),getAll:()=>request(()=>[...rows.values()]),delete:id=>request(()=>rows.delete(id)),clear:()=>request(()=>rows.clear())};}};return tx;}}};queueMicrotask(()=>req.onsuccess());return req;}};
 const a={id:'a',createdAt:1},b={id:'b',createdAt:1};await DB.saveProject(a);await DB.saveProject(b);await DB.deleteProject('a');
 assert.equal((await DB.listProjects()).length,1);await assert.rejects(DB.saveProject(a),/已被删除/);
 await DB.clearProjects();assert.equal((await DB.listProjects()).length,0);await assert.rejects(DB.saveProject(b),/已被删除/);
 await DB.saveProject({id:'fresh',createdAt:Date.now()+1});assert.equal((await DB.listProjects()).length,1);
});
