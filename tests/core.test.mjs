import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as M from '../dist/model.mjs';
import {TEMPLATES} from '../dist/catalog.mjs';
test('default project is a continuous 15-second sequence without rule conflicts',()=>{const p=M.makeProject();assert.equal(M.totalDuration(p),15);assert.deepEqual(M.timeline(p).map(x=>[x.start,x.end]),[[0,4],[4,9],[9,15]]);assert.deepEqual(M.checkProject(p),[]);});
test('all templates can be generated and roundtrip through project import',()=>{for(const t of TEMPLATES){const p=M.makeProject(t.id);const q=M.validateImport(JSON.parse(JSON.stringify({project:p})));assert.deepEqual(q,p);assert.ok(M.generate(p).includes(p.title));assert.ok(M.generate(p,0,'shot').includes(p.characters[0].name));}});
test('frame output excludes the action process and uses the appropriate static state',()=>{const p=M.makeProject();const first=M.framePrompt(p,1),last=M.framePrompt(p,1,true);assert.ok(first.includes(p.shots[0].endState));assert.ok(!first.includes(p.shots[1].action));assert.ok(last.includes(p.shots[1].endState));assert.ok(!first.includes('画外传来一声'));});
test('state inheritance only crosses a continuous scene and same prop',()=>{const p=M.makeProject();p.shots[0].handEnd='left';assert.equal(M.startHand(p,1),'left');p.shots[1].inheritStart=false;p.shots[1].handStart='right';assert.ok(M.checkProject(p).some(x=>x.title==='道具起点与上一镜不一致'));p.shots[1].continuity='timejump';assert.ok(!M.checkProject(p).some(x=>x.title==='道具起点与上一镜不一致'));});
test('camera overrides preserve other inherited values and locked-frame conflicts are explicit',()=>{const p=M.makeProject();p.camera.lens='85';p.camera.lockFrame=true;assert.equal(M.camera(p,p.shots[0]).lens,'85');assert.ok(M.checkProject(p).some(x=>x.title==='完全锁定画面与位移冲突'));p.shots.forEach(s=>s.camera.move='fixed');assert.ok(!M.checkProject(p).some(x=>x.title==='完全锁定画面与位移冲突'));});
test('free timeline identifies gaps and overlaps while ordered mode remains continuous',()=>{const p=M.makeProject();p.timing='free';p.shots[1].manualStart=3;p.shots[2].manualStart=12;const issues=M.checkProject(p);assert.ok(issues.some(x=>x.title==='画面镜头存在重叠'));assert.ok(issues.some(x=>x.title==='项目画面时间轴有缺口'));p.timing='ordered';assert.ok(!M.checkProject(p).some(x=>/时间轴有缺口|镜头存在重叠/.test(x.title)));});
test('dialogue budget uses available window and rejects out-of-bounds timing',()=>{const p=M.makeProject();Object.assign(p.shots[0],{dialogue:'这是一句很长的台词，需要时间完整地说完。',dialogueStart:0,dialogueEnd:1});assert.ok(M.checkProject(p).some(x=>x.title==='对白可能来不及说完'));p.shots[0].dialogueEnd=7;assert.ok(M.checkProject(p).some(x=>x.title==='对白时间超出本镜'));});
test('split/merge preserves runtime and stable unrelated references',()=>{const p=M.makeProject(),id=p.shots[2].id;M.splitShot(p,0,2);assert.equal(p.shots.length,4);assert.equal(M.totalDuration(p),15);assert.equal(p.shots[3].id,id);M.mergeShots(p,0);assert.equal(p.shots.length,3);assert.equal(p.shots[0].segments.length,2);assert.equal(M.totalDuration(p),15);});
test('merge does not silently swallow authored dialogue or timed segments',()=>{const p=M.makeProject();p.shots[0].dialogue='等一下';assert.throws(()=>M.mergeShots(p,0),/对白/);assert.equal(p.shots.length,3);assert.throws(()=>M.splitShot(p,0,1),/对白/);});
test('reference plans remain plans; real input must have safe media type',()=>{const p=M.makeProject();const r={id:M.uid(),name:'角色图',type:'image',purpose:'角色外貌',controls:'林夏',excludes:'背景',data:''};p.references.push(r);p.shots[0].referenceIds.push(r.id);assert.ok(M.checkProject(p).some(x=>x.title==='参考素材仍为计划'));assert.ok(M.referenceList(p,p.shots[0]).includes('尚未上传'));r.data='javascript:alert(1)';assert.throws(()=>M.validateImport(p),/素材类型/);});
test('CSV quotes Chinese text, commas, quotes and newlines',()=>{const p=M.makeProject();p.shots[0].title='对话,"你好"\n第二行';const csv=M.csv(p);assert.ok(csv.startsWith('\uFEFF'));assert.ok(csv.includes('"对话,""你好""\n第二行"'));});
test('import rejects duplicates, unsupported versions and prototype properties',()=>{const p=M.makeProject();p.shots[1].id=p.shots[0].id;assert.throws(()=>M.validateImport(p),/重复/);p.version=99;assert.throws(()=>M.validateImport(p),/版本/);const q=JSON.parse(JSON.stringify(M.makeProject()).replace('"version":1','"version":1,"__proto__":{}'));assert.throws(()=>M.validateImport(q),/属性/);});
test('English mode translates curated phrases and flags free text honestly',()=>{const p=M.makeProject();p.language='en';const output=M.generate(p);assert.ok(output.includes('cinematic photography'));assert.ok(output.includes(p.shots[0].action));assert.ok(M.checkProject(p).some(x=>x.title==='自由文本保留原文'));});
test('generation plan is separate from runtime and checks clipping bounds',()=>{const p=M.makeProject();p.shots[0].generationDuration=3;assert.equal(M.totalDuration(p),15);assert.ok(M.checkProject(p).some(x=>x.title==='剪辑区间超出素材计划'));assert.ok(M.generate(p,0,'plan').includes('计划生成 3s'));});
test('custom specs and sequence output retain author intent',()=>{const p=M.makeProject();p.format='自定义';p.customFormat='2:1';p.fps='自定义';p.customFps=48;assert.equal(M.resolution(p),'4320 × 2160');assert.ok(M.generate(p).includes('48fps'));assert.ok(M.generate(p,0,'sequence').includes('镜头 1'));p.customFormat='bad';assert.ok(M.checkProject(p).some(x=>x.title==='画幅比例无效'));});
test('stationary position can pan independently; fully locked frame cannot',()=>{const p=M.makeProject();p.camera.rotation='right';p.shots.forEach(s=>s.camera.move='stationary');assert.ok(!M.checkProject(p).some(x=>x.title==='固定画面与旋转冲突'));p.shots[0].camera.move='fixed';assert.ok(M.checkProject(p).some(x=>x.title==='固定画面与旋转冲突'));});
test('fifty-shot project remains exportable with stable references',()=>{const p=M.makeProject(),base=M.clone(p.shots[0]);p.shots=Array.from({length:50},(_,i)=>({...M.clone(base),id:M.uid(),title:`镜头${i+1}`}));p.targetDuration=200;assert.equal(M.totalDuration(p),200);assert.ok(M.generate(p).includes('镜头50'));assert.equal(M.validateImport(JSON.parse(JSON.stringify(p))).shots.length,50);});

test('blank project starts with truly empty output in all prompt modes',()=>{const p=M.makeBlankProject();assert.equal(p.characters.length,0);for(const mode of ['full','shot','first','last','short'])assert.equal(M.generate(p,0,mode),'');p.style.look='leica';assert.ok(M.generate(p).includes('徕卡'));assert.ok(!M.generate(p).includes('林夏'));assert.ok(!M.generate(p).includes('35mm'));assert.deepEqual(M.validateImport(JSON.parse(JSON.stringify(p))),p);});
test('commerce is empty until chosen, preserves story, and exports authored stages',()=>{const p=M.makeBlankProject();p.mode='commerce';assert.equal(M.generate(p),'');p.commerce.name='亚麻衬衫';p.commerce.sellingPoints='亚麻面料';p.commerce.output='video';p.commerce.beats=[{title:'材质',start:0,end:4,action:'手指轻触衣料',voice:''}];assert.ok(M.generate(p).includes('手指轻触衣料'));assert.ok(!M.generate(p).includes('折扣'));p.mode='quick';assert.equal(M.generate(p),'');p.mode='commerce';assert.ok(M.generate(p).includes('亚麻衬衫'));});

test('v1.8 director modules, Dolly-vs-zoom check, soundCues bounds and smart helpers stay coherent',()=>{
 const p=M.makeProject();
 const out=M.generate(p);
 assert.ok(out.includes('【导演意图】'));
 assert.ok(out.includes('空间与视线：'));
 assert.ok(out.includes('表演细则：'));
 assert.ok(out.includes('【声音时间轴】'));
 assert.ok(out.includes('【连续性约束】'));
 assert.ok(out.includes('硬切 (Hard Cut)'));
 assert.ok(out.includes('焦距锁定不变'));
 assert.ok(out.includes('负面提示词 — 避免：'));

 const segs=M.autoSegmentsForShot(p.shots[0]);
 assert.ok(segs.length>=3);
 assert.equal(segs[0].start,0);
 assert.equal(segs.at(-1).end,p.shots[0].duration);
 p.shots[0].segments=segs;

 p.shots[1].dialogue='你回来了。';
 p.shots[1].dialogueStart=3;p.shots[1].dialogueEnd=4.8;
 const cues=M.autoSoundCuesForShot(p,p.shots[1]);
 assert.ok(cues.some(c=>c.kind==='dialogue'&&c.cue.includes('口型同步')));
 p.shots[1].soundCues=cues;

 const negShot=M.suggestShotNegatives(p,p.shots[0]);
 assert.ok(negShot.includes('折叠信纸'));
 const negIds=M.suggestProjectNegativeIds(p);
 assert.ok(negIds.includes('no_cut')&&negIds.includes('prop_hand_swap'));

 p.shots[1].camera.move='push';p.shots[1].camera.zoom='in';
 assert.ok(M.checkProject(p).some(x=>x.title==='物理位移与光学变焦混用'));
 p.shots[1].camera.zoom='none';
 p.shots[1].soundCues.push({start:4,end:99,kind:'sfx',cue:'越界测试'});
 assert.ok(M.checkProject(p).some(x=>x.title==='声音时间轴越界'));
});

test('prompt engine cleans placeholders, aligns spatial to aspect ratio, labels features, and marks absent cast',()=>{
 const p=M.makeBlankProject();
 p.format='9:16';
 p.logline='餐厅偶遇时绿巨人破窗而入，男子眼中射出激光将其击倒。';
 const c1=M.blankCharacter('陈默');
 Object.assign(c1,{age:'28岁',gender:'男',height:'180cm',nose:'鼻梁挺直',lips:'薄厚适中',hairColor:'黑色',hair:'短碎发',makeup:'无妆感自然肤质',accessories:'黑色皮带机械表',habits:'思考时手指轻点桌面'});
 const c2=M.blankCharacter('绿巨人');
 Object.assign(c2,{age:'未知',gender:'男',height:'260cm',occupation:'未知',brows:'粗重紧锁',nose:'宽厚',lips:'厚实，常呈怒吼状',hairColor:'黑色',hair:'凌乱浓密黑发',makeup:'无',outfit:'破烂的深紫色弹性短裤',accessories:'无'});
 p.characters=[c1,c2];
 const sc=M.blankScene('暖调西餐厅靠窗区');
 sc.description='一家氛围温馨的现代都市西餐厅。';
 sc.foreground='深色木质餐桌。';
 sc.background='夜间街景。';
 p.scenes=[sc];
 const s1=M.makeShot(p,0);
 s1.title='餐厅偶遇与共餐';
 s1.duration=5;
 s1.characterIds=[c1.id];
 s1.sceneId=sc.id;
 s1.spatial='横幅构图：陈默坐在餐桌右侧，面向左侧。';
 s1.action='陈默握住水杯微笑交谈。';
 s1.camera={framing:'medium',move:'push',moveDistance:'subtle',zoom:'none'};
 s1.segments=[{id:'seg1',start:0,end:2,action:'陈默右手握杯',performance:'眼神温和',cameraBeat:'中景固定机位微幅推进',dialogue:'',audio:'轻柔爵士乐'}];
 s1.negativeNotes='禁止水杯无故消失。';
 p.shots=[s1];
 M.autoEnrichShot(p,0);
 const out=M.generate(p,0,'full');
 assert.ok(!out.includes('未知'),'should strip 未知 placeholders');
 assert.ok(!out.includes('，无，'),'should strip 无 placeholders');
 assert.ok(out.includes('黑色短碎发')&&!out.includes('黑色 短碎发'),'should join Chinese hair color and style without space');
 assert.ok(out.includes('唇形薄厚适中')&&out.includes('眉形粗重紧锁')&&out.includes('鼻型宽厚'),'should prefix raw facial adjectives with feature nouns');
 assert.ok(out.includes('竖屏构图')&&!out.includes('横幅构图'),'should align spatial composition to 9:16 vertical aspect ratio');
 assert.ok(!out.includes('。，')&&!out.includes('。；'),'should eliminate double punctuation');
 assert.ok(!out.includes('固定机位'),'should sanitize 固定机位 inside segment cameraBeat when shot move is push');
 assert.ok(out.includes('绿巨人')&&(out.includes('暂未出场')||out.includes('不出场')),'should explicitly note absent characters in shot');
});


test('chainLastFrame separates generation rules, removes conditional 0.3s dissolve, and moves transitions to unconditional editing table',()=>{
 const p=M.makeProject('rain_coffee');
 p.chainLastFrame=true;
 p.cutFrameCheck=true;
 const s2=M.scene('雨夜长街');
 p.scenes.push(s2);
 p.shots[1].sceneId=s2.id;
 p.shots[0].transition='whip_pan';
 M.autoTransitionSpec(p,0);
 p.shots[0].segments=M.autoSegmentsForShot(p.shots[0]);
 p.shots[0].segments[0].transition='j_cut';
 p.shots[0].segments[p.shots[0].segments.length-1].transition='fade_out';
 assert.equal(M.TRANSITION_CATEGORIES.length,6);
 assert.ok(M.options(p,'transition').length>=108);
 const out=M.generate(p,0,'full');
 assert.ok(out.includes('【生成阶段规范】'));
 assert.ok(out.includes('1. 一镜一镜按顺序生成，绝不同时生成多个镜头。'));
 assert.ok(out.includes('2. 每一镜生成时，把上一镜的最后一帧图片作为输入图'));
 assert.ok(out.includes('3. 每一镜生成完，你自己先逐秒抽帧检查'));
 assert.ok(out.includes('4. 如果某一镜提前演到了后面的剧情'));
 assert.ok(out.includes('5. 如果某一镜重做了，后面所有镜都必须用新版的最后一帧重新接一遍'));
 assert.ok(out.includes('切点前后两帧检查（仅生成阶段自检）：上一镜最后一帧和下一镜第一帧必须是一样的画面'));
 assert.ok(!out.includes('0.3秒叠化过渡'),'must not emit conditional 0.3s dissolve fallback');
 assert.ok(!out.includes('【AI短剧转场规范（'),'must not bury 10-field transition spec inside shot body');
 assert.ok(!out.includes('转场时长：'),'must not mix merge transition duration inside shot body');
 assert.ok(out.includes('【后期合并剪辑与转场执行表】'));
 assert.ok(out.includes('跨场景：'));
 assert.ok(out.includes('段尾转场（仅限镜内节拍）：'));
 assert.ok(out.includes('快速摇镜转场（Whip Pan）'));
 const tableSection=out.split('【后期合并剪辑与转场执行表】')[1]||'';
 assert.ok(!tableSection.includes('渐暗至纯黑'),'final segment transition cue must not override cut table');
 const rt=M.validateImport(JSON.parse(JSON.stringify(p)));
 assert.equal(rt.cutFrameCheck,true);
 assert.equal(rt.shots[0].segments[0].transition,'j_cut');
 assert.equal(rt.shots[0].transitionSpec.process,p.shots[0].transitionSpec.process);
});

test('editing transition table outputs exact UI verbs, unconditional rows, overlap budget, and no conditional override across full/fromScratch/shot modes',()=>{
 const p=M.makeBlankProject();
 const sc=M.blankScene();sc.name='海面甲板';p.scenes.push(sc);
 const c=M.blankCharacter('少女');p.characters.push(c);
 p.chainLastFrame=true;
 p.cutFrameCheck=true;
 p.targetDuration=25;
 const specs=[
  {title:'甲板望海',transition:'dissolve',dur:5,specDur:0.5},
  {title:'海面暗涌',transition:'fade_out',dur:5},
  {title:'面无表情迟疑',transition:'black_flash',dur:5},
  {title:'视线转向别处',transition:'cut',dur:5},
  {title:'甲板远景收尾',transition:'fade_out',dur:5}
 ];
 for(const item of specs){
  const s=M.makeShot(p);
  s.title=item.title;s.duration=item.dur;s.sceneId=sc.id;s.characterIds=[c.id];
  s.action=item.title+'动作';s.transition=item.transition;
  if(item.specDur!==undefined)s.transitionSpec.duration=item.specDur;
  p.shots.push(s);
 }
 // Simulate legacy unedited transitionSpec.duration=0.4 on fade_out/cut
 p.shots[3].transitionSpec.duration=0.4;
 const out=M.generate(p,0,'full');
 assert.ok(out.includes('【生成阶段规范】'));
 assert.ok(out.includes('【后期合并剪辑与转场执行表】'));
 assert.ok(!out.includes('如果某一切点首帧还是漂移'));
 assert.ok(!out.includes('0.3秒叠化过渡'));
 assert.ok(out.includes('00:05｜第 1 镜 → 第 2 镜｜转场：叠化转场（Cross Dissolve）｜时长：0.5 秒'));
 assert.ok(out.includes('00:10｜第 2 镜 → 第 3 镜｜转场：淡出（Fade Out）｜时长：0.8 秒'));
 assert.ok(out.includes('00:15｜第 3 镜 → 第 4 镜｜转场：闪黑（Black Flash）｜时长：0.2 秒'));
 assert.ok(out.includes('00:20｜第 4 镜 → 第 5 镜｜转场：硬切 (Hard Cut)｜时长：0 秒'));
 assert.ok(out.includes('00:25｜第 5 镜 → 全片收尾｜转场：淡出（Fade Out）｜时长：0.8 秒'));
 assert.ok(out.includes('尾多留 0.25 秒')&&out.includes('成片总时长保持 25 秒不变'));
 const shot2=M.generate(p,1,'shot');
 assert.ok(shot2.includes('【本镜后期剪辑备忘')&&shot2.includes('淡出（Fade Out）｜时长：0.8 秒'));
 p.language='en';
 const enOut=M.generate(p,0,'full');
 assert.ok(enOut.includes('EDITING & TRANSITION EXECUTION TABLE'));
 assert.ok(enOut.includes('Fade Out'));
});

test('global BGM, per-shot music override/silence, and untouched blank project invariant work cleanly',()=>{
 const blank=M.makeBlankProject();
 assert.equal(M.generate(blank),'');
 blank.bgm.style='warm_piano';
 const blankWithBgm=M.generate(blank);
 assert.ok(blankWithBgm.includes('背景音乐（BGM）')&&blankWithBgm.includes('轻柔克制的钢琴独奏'));

 const p=M.makeProject('rain_coffee');
 p.bgm={style:'suspense_strings',mood:'先抑后扬',instrumentation:'弦乐+大提琴',vocals:'instrumental',custom:'对白期间音量压低'};
 p.shots[0].music='无背景音乐';
 p.shots[1].music='本镜暂停配乐（静默）';
 const cues0=M.autoSoundCuesForShot(p,p.shots[0]);
 const cues1=M.autoSoundCuesForShot(p,p.shots[1]);
 assert.ok(cues0.some(q=>q.kind==='music'&&q.cue.includes('悬疑弦乐 / 低频脉冲')));
 assert.ok(!cues1.some(q=>q.kind==='music'));
 p.shots[0].soundCues=cues0;
 const fullOut=M.generate(p,0,'full');
 assert.ok(fullOut.includes('背景音乐（BGM）')&&fullOut.includes('紧张压迫的极简大提琴与低频脉冲铺底')&&fullOut.includes('对白期间音量压低'));
 assert.ok(fullOut.includes('本镜暂停配乐（静默）'));
 p.language='en';
 const enOut=M.generate(p,0,'full');
 assert.ok(enOut.includes('Background music (BGM):')&&enOut.includes('Tense minimal cello'));
 const rt=M.validateImport(JSON.parse(JSON.stringify(p)));
 assert.deepEqual(rt.bgm,p.bgm);
});
