import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalizePlanRequest,conformPlanToRequest,normalizePlan} from '../dist/ai-contract.mjs';
import {allocateShotDurations,normalizeCreativePreferences,briefTimingSummary,requestedVisualStyle,AI_VISUALS,AI_TEXTURES} from '../dist/ai-brief.mjs';
import {GROUPS} from '../dist/catalog.mjs';
import {suggestionsFor} from '../dist/assist.mjs';
import {applyAIPlan,exampleAIPlan} from '../dist/ai-planner.mjs';
import * as M from '../dist/model.mjs';
const request=x=>normalizePlanRequest({idea:'两位成年朋友在雨夜重逢，化解一场误会',duration:30,shotCount:2,...x});
test('count supports unrestricted integer shot counts and a maximum count without requiring padding',()=>{
 assert.equal(request({shotCount:17}).shotCount,17);assert.equal(request({shotCount:30}).shotCount,30);assert.equal(request({shotCount:50,duration:100}).shotCount,50);for(const shotCount of [0,-1,2.5])assert.throws(()=>request({shotCount}));
 const r=request({shotCount:12,shotCountMode:'max',timingMode:'within',maxMinutes:2});assert.equal(conformPlanToRequest(exampleAIPlan(),r).shots.length,2);assert.throws(()=>conformPlanToRequest(exampleAIPlan(),request({shotCount:3})),/数量/);
});
test('fixed timing derives the exact runtime and scales dialogue windows into the fixed shots',()=>{
 const r=request({timingMode:'fixed',fixedDuration:10,duration:99}),p=conformPlanToRequest(exampleAIPlan(),r);assert.equal(r.duration,20);assert.deepEqual(p.shots.map(s=>s.duration),[10,10]);assert.equal(p.shots[1].dialogueEnd,10);
 const q=conformPlanToRequest(exampleAIPlan(),request({timingMode:'fixed',fixedDuration:4,shotCountMode:'max',shotCount:10}));assert.equal(q.shots.reduce((n,s)=>n+s.duration,0),8);
});
test('minute limit is an upper bound, never stretches a shorter story and allows >10 minutes',()=>{
 const r=request({timingMode:'within',maxMinutes:2});assert.equal(r.duration,120);const p=conformPlanToRequest(exampleAIPlan(),r);assert.equal(p.shots.reduce((n,s)=>n+s.duration,0),10);
 const raw=exampleAIPlan();raw.shots.forEach(s=>{s.duration=60;s.dialogueEnd=60;});const q=conformPlanToRequest(raw,request({timingMode:'within',maxMinutes:1}));assert.equal(q.shots.reduce((n,s)=>n+s.duration,0),60);
 assert.equal(request({timingMode:'within',maxMinutes:15}).duration,900);assert.throws(()=>request({timingMode:'within',maxMinutes:0}));
});
test('runtime allocation preserves the budget under unequal weights with >=0.5s floor and no 60s ceiling',()=>{
 assert.deepEqual(allocateShotDurations([.5,60],80),[0.7,79.3]);
 assert.deepEqual(allocateShotDurations([.1,100],100),[0.5,99.5]);
 for(const n of [1,2,5,12,30])for(const total of [n*.5,n*6,n*90]){const values=allocateShotDurations(Array.from({length:n},(_,i)=>i%2?.5:90),total);assert.equal(Math.round(values.reduce((a,b)=>a+b,0)*10),Math.round(total*10));assert.ok(values.every(x=>x>=.5));}
});
test('visual presets, texture and custom descriptions become the resulting project style',()=>{
 const p=conformPlanToRequest(exampleAIPlan(),request({preferences:{visualPreset:'anime2d',texturePreset:'film',color:'cool',visualNotes:'统一蓝灰与暖金色'}}));assert.equal(p.style.look,'');assert.equal(p.style.medium,'35mm');assert.equal(p.style.color,'cool');assert.match(p.style.custom,/二维手绘/);assert.match(p.style.custom,/蓝灰/);const q=applyAIPlan(M.makeBlankProject(),p).project;assert.match(M.generate(q),/二维手绘/);
});
test('dialogue speaker, delivery, performance and sound map to the same editable shot fields',()=>{
 const p=exampleAIPlan();p.characters.push({...p.characters[0],ref:'c2',name:'周屿'});p.shots[1].speakerRef='c2';p.shots[1].characterRefs.push('c2');p.shots[1].dialogue='我回来了。';p.shots[1].delivery='轻声，停顿后开口';p.shots[1].micro=['gaze'];p.shots[1].intensity='克制';p.shots[1].music='轻柔钢琴';
 const q=applyAIPlan(M.makeBlankProject(),p).project,s=q.shots[1];assert.equal(s.speakerId,q.characters.find(c=>c.name==='周屿').id);assert.equal(s.delivery,p.shots[1].delivery);assert.deepEqual(s.micro,['gaze']);assert.equal(s.music,'轻柔钢琴');const prompt=M.generate(q);for(const text of ['我回来了','轻声','周屿','轻柔钢琴'])assert.ok(prompt.includes(text),text);assert.deepEqual(M.validateImport(q),q);
});
test('spoken modes reject a silently empty script while explicit silent mode clears dialogue',()=>{
 const p=exampleAIPlan();p.shots.forEach(s=>s.dialogue='');assert.throws(()=>conformPlanToRequest(p,request()),/遗漏.*对白/);
 const q=conformPlanToRequest(exampleAIPlan(),request({preferences:{dialogueMode:'silent'}}));assert.ok(q.shots.every(s=>!s.dialogue));
 const v=conformPlanToRequest(exampleAIPlan(),request({preferences:{dialogueMode:'narration',language:'粤语'}}));assert.equal(v.shots[1].voiceType,'vo');assert.equal(v.shots[1].dialogueLanguage,'粤语');
 const invalid=exampleAIPlan();invalid.shots[1].speakerRef='missing';assert.throws(()=>normalizePlan(invalid),/说话者/);
});
test('blank preferences remain optional, support expanded notes and summarize upper limits clearly',()=>{
 assert.equal(normalizeCreativePreferences().dialogueMode,'natural');assert.equal(normalizeCreativePreferences({conflict:'x'.repeat(1500)}).conflict.length,1500);assert.throws(()=>normalizeCreativePreferences({conflict:'x'.repeat(10001)}));assert.match(briefTimingSummary({shotCountMode:'max',shotCount:12,timingMode:'within',maxMinutes:2}),/最多 12 镜.*2 分钟.*不必填满/);
});

test('briefTimingSummary flags cleared or invalid counts and durations without restrictive small caps',()=>{
 assert.match(briefTimingSummary({shotCount:0,shotCountMode:'exact',timingMode:'auto',duration:20}),/大于等于 1/);
 assert.match(briefTimingSummary({shotCount:36,shotCountMode:'exact',timingMode:'auto',duration:180}),/共 36 镜.*180 秒/);
 assert.match(briefTimingSummary({shotCount:4,shotCountMode:'exact',timingMode:'fixed',fixedDuration:0}),/不少于 0\.5 秒/);
 assert.match(briefTimingSummary({shotCount:4,shotCountMode:'exact',timingMode:'within',maxMinutes:0}),/不小于 0\.1 分钟/);
 assert.match(briefTimingSummary({shotCount:8,shotCountMode:'exact',timingMode:'auto',duration:2}),/每镜至少 0\.5 秒/);
});
test('sparsePrompt includes dialogue voiceType and character voice on AI-generated blank projects',()=>{
 const p=exampleAIPlan();p.characters[0].voice='温润知性女声';p.shots[1].voiceType='vo';p.shots[1].dialogue='这一夜，谁也没有再提从前。';
 const offPlan=exampleAIPlan();offPlan.characters[0].voice='沉稳低沉男声';offPlan.shots[1].voiceType='off';offPlan.shots[1].dialogue='门外有人轻敲了两声。';
 const q1=applyAIPlan(M.makeBlankProject(),p,{asNew:true}).project,q2=applyAIPlan(M.makeBlankProject(),offPlan,{asNew:true}).project;
 const out1=M.generate(q1),out2=M.generate(q2);
 assert.match(out1,/旁白.*温润知性女声.*这一夜/);
 assert.match(out2,/画外.*沉稳低沉男声.*门外有人/);
});

test('chainLastFrame preference flows through request conformation, application and prompt output',()=>{
 const r=request({timingMode:'fixed',fixedDuration:6,preferences:{chainLastFrame:true}});
 assert.equal(r.preferences.chainLastFrame,true);
 const conformed=conformPlanToRequest(exampleAIPlan(),r);
 assert.equal(conformed.chainLastFrame,true);
 assert.equal(conformed.shots[0].transition,'continuous');
 assert.ok(conformed.shots[1].segments.every(seg=>seg.start>=0&&seg.end<=6&&seg.end>seg.start));
 assert.ok(conformed.shots[1].soundCues.every(q=>q.start>=0&&q.end<=6&&q.end>=q.start));
 const applied=applyAIPlan(M.makeBlankProject(),conformed,{asNew:true}).project;
 assert.equal(applied.chainLastFrame,true);
 assert.equal(applied.shots[1].inheritStart,true);
 const out=M.generate(applied);
 assert.ok(out.includes('每个镜头生成视频结尾的最后一帧，直接作为下一个镜头开头的首帧'));
 assert.ok(out.includes('【导演意图】'));
 assert.ok(out.includes('【镜内时间轴】'));
 assert.ok(out.includes('【声音时间轴】'));
 assert.ok(out.includes('【连续性约束】'));
 assert.ok(out.includes('严禁使用光学变焦替代'));
 assert.ok(out.includes('禁止未授权切镜'));
});


test('cutFrameCheck and transitionStyle flow through AI brief normalization, cross-scene conformation and application',()=>{
 const pref=normalizeCreativePreferences({cutFrameCheck:true,transitionStyle:'camera',chainLastFrame:true});
 assert.equal(pref.cutFrameCheck,true);
 assert.equal(pref.transitionStyle,'camera');
 const ex=exampleAIPlan();
 ex.scenes.push({...ex.scenes[0],ref:'s2',name:'雨夜长街'});
 ex.shots[1].sceneRef='s2';
 const req=normalizePlanRequest({idea:'雨夜旧友重逢后转场长街追逐',duration:12,shotCount:ex.shots.length,shotCountMode:'exact',timingMode:'auto',preferences:{chainLastFrame:true,cutFrameCheck:true,transitionStyle:'camera'}});
 const conformed=conformPlanToRequest(ex,req);
 assert.equal(conformed.cutFrameCheck,true);
 assert.equal(conformed.shots[0].transition,'whip_pan');
 const p=M.makeBlankProject();
 const applied=applyAIPlan(p,conformed,{scopes:{story:true,style:true,characters:true,scenes:true,shots:true},asNew:false,origin:'demo',reuseExistingAssets:false}).project;
 assert.equal(applied.cutFrameCheck,true);
 const prompt=M.generate(applied,0,'full');
 assert.ok(prompt.includes('1. 一镜一镜按顺序生成'));
 assert.ok(prompt.includes('切点前后两帧检查（仅生成阶段自检）：上一镜最后一帧和下一镜第一帧必须是一样的画面'));
 assert.ok(!prompt.includes('0.3秒叠化过渡'));
 assert.ok(prompt.includes('【后期合并剪辑与转场执行表】'));
 assert.ok(prompt.includes('快速摇镜转场（Whip Pan）'));
});

test('AI cast pre-selection supports all-cast unified mode and individual per-character control across conformPlanToRequest and applyAIPlan',()=>{
 const base=exampleAIPlan();
 base.characters=[
  {...base.characters[0],ref:'c1',name:'陈默',occupation:'路人',appearance:'日韩混血青年，精致长相'},
  {...base.characters[0],ref:'c2',name:'汤姆',occupation:'未知',appearance:'金发碧眼欧美青年'}
 ];
 base.shots[0].characterRefs=['c1','c2'];
 const allReq=request({
  preferences:{
   castMode:'all',
   castDefaults:{nationality:'中国',faceTier:'star',skinRender:'natural_pores',occupation:'程序员',notes:'全员穿休闲通勤装'}
  }
 });
 const allConformed=conformPlanToRequest(base,allReq);
 for(const c of allConformed.characters){
  assert.ok(c.appearance.includes('中国'),c.appearance);
  assert.ok(!/欧美|日韩|金发碧眼/.test(c.appearance),c.appearance);
  assert.ok(c.face.includes('明星级高颜值'),c.face);
  assert.ok(c.skin.includes('真实肤质'),c.skin);
  assert.equal(c.occupation,'程序员');
  assert.ok(c.appearance.includes('休闲通勤装'),c.appearance);
 }
 assert.ok(allConformed.negativePrompts.includes('skin'));

 const indivReq=request({
  preferences:{
   castMode:'individual',
   castProfiles:[
    {name:'陈默',nationality:'中国',faceTier:'anime2d',skinRender:'cel_shaded',occupation:'插画师',notes:'戴圆框眼镜'},
    {name:'汤姆',nationality:'美国/欧美',faceTier:'ordinary',skinRender:'natural_pores',occupation:'外企工程师',notes:'微留胡茬'}
   ]
  }
 });
 const indivConformed=conformPlanToRequest(base,indivReq);
 assert.ok(indivConformed.characters[0].appearance.includes('中国')&&indivConformed.characters[0].face.includes('动漫')&&indivConformed.characters[0].skin.includes('赛璐璐')&&indivConformed.characters[0].occupation==='插画师');
 assert.ok(indivConformed.characters[1].appearance.includes('美国')&&indivConformed.characters[1].face.includes('普通人')&&indivConformed.characters[1].skin.includes('真实肤质')&&indivConformed.characters[1].occupation==='外企工程师');
 const applied=applyAIPlan(M.makeBlankProject(),indivConformed,{asNew:true}).project;
 const prompt=M.generate(applied);
 assert.ok(prompt.includes('插画师')&&prompt.includes('外企工程师'));
});

test('AI BGM modes (guided, exact, none) conform plan BGM and sync into performance global BGM',()=>{
 const guidedReq=request({preferences:{bgmMode:'guided',bgmStyle:'warm_piano',bgmMood:'温柔重逢',bgmNotes:'对白时轻声避让'}});
 const guidedPlan=conformPlanToRequest(exampleAIPlan(),guidedReq);
 assert.equal(guidedPlan.bgm.style,'warm_piano');
 assert.ok(guidedPlan.bgm.mood.includes('温柔重逢'));
 assert.ok(guidedPlan.bgm.custom.includes('对白时轻声避让'));
 const guidedProj=applyAIPlan(M.makeBlankProject(),guidedPlan,{asNew:true}).project;
 assert.equal(guidedProj.bgm.style,'warm_piano');
 assert.ok(M.generate(guidedProj).includes('轻柔克制的钢琴独奏'));

 const noneReq=request({preferences:{bgmMode:'none'}});
 const nonePlan=conformPlanToRequest(exampleAIPlan(),noneReq);
 assert.equal(nonePlan.bgm.style,'none');
 assert.ok(nonePlan.shots.every(s=>s.music==='无背景音乐（静默）'));
 const noneProj=applyAIPlan(M.makeBlankProject(),nonePlan,{asNew:true}).project;
 assert.equal(noneProj.bgm.style,'none');
 assert.ok(M.generate(noneProj).includes('无背景音乐'));
});

test('shotControlMode auto lets AI decide shot count and durations while custom switch enforces explicit settings',()=>{
 assert.match(briefTimingSummary({customShotTiming:false,shotCount:3,duration:15}),/由 AI 自己调整/);
 assert.match(briefTimingSummary({customShotTiming:true,shotCount:3,shotCountMode:'exact',timingMode:'auto',duration:15}),/共 3 镜.*15 秒/);
 assert.equal(normalizeCreativePreferences({customShotTiming:false}).customShotTiming,false);
 assert.equal(normalizeCreativePreferences({customShotTiming:true}).customShotTiming,true);

 const autoReq=normalizePlanRequest({idea:'雨夜旧友在咖啡馆重逢，两句克制试探后决定同行',shotControlMode:'auto',preferences:{customShotTiming:false}});
 assert.equal(autoReq.shotControlMode,'auto');
 const ex=exampleAIPlan();
 ex.shots[0].duration=4.5;
 ex.shots[1].duration=6.5;
 const conformed=conformPlanToRequest(ex,autoReq);
 assert.equal(conformed.shots.length,2);
 assert.deepEqual(conformed.shots.map(s=>s.duration),[4.5,6.5]);

 const customReq=normalizePlanRequest({idea:'两位朋友重逢',shotControlMode:'custom',shotCount:2,shotCountMode:'exact',timingMode:'fixed',fixedDuration:7,preferences:{customShotTiming:true}});
 assert.equal(customReq.shotControlMode,'custom');
 assert.deepEqual(conformPlanToRequest(exampleAIPlan(),customReq).shots.map(s=>s.duration),[7,7]);
});

test('expanded live-action, Hong Kong cinema, color palettes and AI brief suggestions normalize and map cleanly',()=>{
 assert.ok(AI_VISUALS.length>=25);
 assert.ok(AI_TEXTURES.length>=20);
 assert.ok(GROUPS.look.options.length>=15);
 assert.ok(GROUPS.medium.options.length>=12);
 assert.ok(GROUPS.genre.options.length>=20);
 assert.ok(GROUPS.color.options.length>=12);
 assert.ok(GROUPS.texture.options.length>=12);

 const hkPref=normalizeCreativePreferences({visualPreset:'hk_retro',texturePreset:'auto',color:'hk_emerald',transitionStyle:'hk_rhythmic',dialogueMode:'inner_monologue'});
 assert.equal(hkPref.color,'hk_emerald');
 const hkStyle=requestedVisualStyle(hkPref);
 assert.equal(hkStyle.look,'hk_cinema');
 assert.equal(hkStyle.medium,'35mm');
 assert.equal(hkStyle.genre,'hk_retro_90s');
 assert.equal(hkStyle.color,'hk_emerald');
 assert.match(hkStyle.custom,/90年代黄金港片/);

 const realPref=normalizeCreativePreferences({visualPreset:'real',texturePreset:'raw_reality',color:'natural'});
 const realStyle=requestedVisualStyle(realPref);
 assert.equal(realStyle.look,'reality_raw');
 assert.equal(realStyle.medium,'raw_4k');
 assert.equal(realStyle.genre,'real_life');

 for(const path of ['style.custom','aiBrief.idea','aiBrief.visualNotes','aiBrief.language','aiBrief.dialogueStyle','aiBrief.bgmMood','aiBrief.bgmNotes','aiBrief.castDefaults.occupation','aiBrief.castDefaults.notes','aiBrief.castProfiles.0.name','aiBrief.castProfiles.0.notes','aiBrief.genre','aiBrief.tone','aiBrief.characters','aiBrief.setting','aiBrief.conflict','aiBrief.ending','aiBrief.audience','aiBrief.keyLine','aiBrief.avoid','aiBrief.notes']){
  assert.ok(suggestionsFor(path).length>=6,`expected >=6 suggestions for ${path}`);
 }
});
