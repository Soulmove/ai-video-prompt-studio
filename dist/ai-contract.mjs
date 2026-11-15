import {normalizeCreativePreferences,requestedVisualStyle,allocateShotDurations,AI_CAST_NATIONALITIES} from './ai-brief.mjs';
import {GROUPS,CHARACTER_FIELDS,SCENE_FIELDS} from './catalog.mjs';
export const PLAN_LIMITS={characters:500,scenes:500,shots:500,idea:100000};
export const PLAN_CHAR_KEYS=CHARACTER_FIELDS.map(x=>x[0]);
export const PLAN_SCENE_KEYS=[...SCENE_FIELDS.map(x=>x[0]),'time','weather','lightSource','lightDirection','lightQuality','lightNote'];
export const PLAN_CAMERA_KEYS=['framing','angle','composition','move','moveDistance','speed','stability','lens','focus','zoom','direction','orbit','start','end'];
export const PLAN_COMMERCE_KEYS=['name','category','material','color','audience','sellingPoints','evidence','goal','platform','scene','lighting','composition','camera','hook','cta','copy'];
export function planCatalog(){return Object.fromEntries(['look','medium','genre','color','texture','bgm','framing','angle','composition','move','moveDistance','speed','stability','zoom','transition','lens','focus','time','weather','lightSource','lightDirection','lightQuality','emotion','micro','negative'].map(k=>[k,GROUPS[k].options.map(x=>({id:x.id,label:x.label}))]));}
const planString={type:'string'};
const planObject=properties=>({type:'object',properties,required:Object.keys(properties),additionalProperties:false});
const planStrings=keys=>Object.fromEntries(keys.map(k=>[k,planString]));
const planEnum=k=>({type:'string',enum:['',...GROUPS[k].options.map(x=>x.id)]});
export function planSchema(){
 const camera=planObject(Object.fromEntries(PLAN_CAMERA_KEYS.map(k=>[k,k==='orbit'?{type:'number'}:k==='direction'?{type:'string',enum:['','cw','ccw']}:GROUPS[k]?planEnum(k):planString])));
 const character=planObject({ref:planString,...planStrings(PLAN_CHAR_KEYS)});
 const scene=planObject({ref:planString,...Object.fromEntries(PLAN_SCENE_KEYS.map(k=>[k,GROUPS[k]?planEnum(k):planString]))});
 const acting=planObject(planStrings(['eyes','brows','lips','breathing','head','posture']));
 const continuitySpec=planObject(planStrings(['character','prop','space','lighting','action']));
 const transitionSpec=planObject({...planStrings(['fromFrame','trigger','process','direction','toFrame','motionContinuity','audioBridge','continuityLock']),duration:{type:'number'}});
 const segment=planObject({start:{type:'number'},end:{type:'number'},action:planString,performance:planString,cameraBeat:planString,audio:planString,transition:planEnum('transition')});
 const soundCue=planObject({start:{type:'number'},end:{type:'number'},kind:{type:'string',enum:['','ambience','sfx','music','dialogue','foley']},cue:planString});
 const shot=planObject({title:planString,duration:{type:'number'},characterRefs:{type:'array',items:planString},sceneRef:planString,intent:planString,spatial:planString,action:planString,startState:planString,endState:planString,transition:planEnum('transition'),transitionSpec,dialogue:planString,speakerRef:planString,dialogueLanguage:planString,voiceType:{type:'string',enum:['in','off','vo']},delivery:planString,micro:{type:'array',items:planEnum('micro')},intensity:planString,music:planString,dialogueStart:{type:'number'},dialogueEnd:{type:'number'},audio:planString,emotion:planEnum('emotion'),acting,continuitySpec,segments:{type:'array',items:segment},soundCues:{type:'array',items:soundCue},negativeNotes:planString,camera});
 const bgm=planObject({style:planEnum('bgm'),mood:planString,instrumentation:planString,vocals:{type:'string',enum:['','instrumental','hum','vocal']},custom:planString});
 return planObject({title:planString,logline:planString,chainLastFrame:{type:'boolean'},cutFrameCheck:{type:'boolean'},style:planObject({look:planEnum('look'),medium:planEnum('medium'),genre:planEnum('genre'),color:planEnum('color'),texture:{type:'array',items:planEnum('texture')},custom:planString}),bgm,negativePrompts:{type:'array',items:planEnum('negative')},characters:{type:'array',items:character},scenes:{type:'array',items:scene},shots:{type:'array',items:shot},commerce:planObject({...planStrings(PLAN_COMMERCE_KEYS),beats:{type:'array',items:planObject({title:planString,start:{type:'number'},end:{type:'number'},action:planString,voice:planString})}})});
}
export function normalizePlan(raw){
 const fail=msg=>{throw Error('填写方案无效：'+msg);};
 const walk=(x,depth=0)=>{if(depth>12)fail('层级过深');if(x&&typeof x==='object')for(const k of Object.keys(x)){if(['__proto__','prototype','constructor'].includes(k))fail('包含不允许的字段');walk(x[k],depth+1);}};walk(raw);
 if(!raw||typeof raw!=='object'||Array.isArray(raw))fail('需要结构化对象');
 const text=(x,max=5000)=>{if(x==null)return '';if(typeof x!=='string'||x.length>max)fail('文字类型或长度不正确');return x.trim();};
 const cleanField=(x,max=400)=>{const v=text(x,max);return /^(未知|不详|无|暂无|无妆|无妆容|无配饰|none|unknown|n\/a|-)$/i.test(v)?'':v;};
 const list=(x,max)=>{if(x==null)return [];if(!Array.isArray(x)||x.length>max)fail('列表超出限制');return x;};
 const choice=(key,x)=>{const value=text(x,80);if(value&&!GROUPS[key].options.some(v=>v.id===value))fail('未知选项 '+key);return value;};
 const pickObj=(src,keys,max=400)=>{const obj=src&&typeof src==='object'&&!Array.isArray(src)?src:{};return Object.fromEntries(keys.map(k=>[k,cleanField(obj[k],max)]));};
 const refs=new Set(),sceneRefs=new Set();
 const characters=list(raw.characters,PLAN_LIMITS.characters).map(c=>{if(!c||typeof c!=='object')fail('角色格式错误');const out={ref:text(c.ref,80),...Object.fromEntries(PLAN_CHAR_KEYS.map(k=>[k,k==='name'?text(c[k],400):cleanField(c[k],400)]))};if(!out.ref||!out.name||refs.has(out.ref))fail('角色标识或名称缺失/重复');refs.add(out.ref);return out;});
 const scenes=list(raw.scenes,PLAN_LIMITS.scenes).map(s=>{if(!s||typeof s!=='object')fail('场景格式错误');const out={ref:text(s.ref,80),...Object.fromEntries(PLAN_SCENE_KEYS.map(k=>[k,GROUPS[k]?choice(k,s[k]):cleanField(s[k],600).replace(/[。，；]+$/g,'')]))};if(!out.ref||!out.name||sceneRefs.has(out.ref))fail('场景标识或名称缺失/重复');sceneRefs.add(out.ref);return out;});
 const shots=list(raw.shots,PLAN_LIMITS.shots).map(s=>{
  if(!s||typeof s!=='object')fail('分镜格式错误');
  const duration=Number(s.duration);if(!Number.isFinite(duration)||duration<.5)fail('单镜时长应至少为0.5秒');
  const ids=list(s.characterRefs,PLAN_LIMITS.characters).map(x=>text(x,120));if(ids.some(x=>!refs.has(x)))fail('分镜引用了未知角色');
  const sceneRef=text(s.sceneRef,80);if(sceneRef&&!sceneRefs.has(sceneRef))fail('分镜引用了未知场景');
  const camera={};for(const k of PLAN_CAMERA_KEYS){const value=s.camera?.[k];if(k==='orbit'){if(value!==undefined&&(!Number.isFinite(Number(value))||Number(value)<0||Number(value)>360))fail('环绕角度无效');camera[k]=Number(value)||0;}else camera[k]=GROUPS[k]?choice(k,value):text(value,300);}
  if(camera.direction&&!['cw','ccw'].includes(camera.direction))fail('运镜方向无效');
  const action=text(s.action);if(!action)fail('分镜动作不能为空');
  const dialogue=text(s.dialogue),speakerRef=text(s.speakerRef,80)||(dialogue?ids[0]||'':'');if(speakerRef&&!refs.has(speakerRef))fail('对白引用了未知说话者');
  const dialogueStart=s.dialogueStart==null?0:Number(s.dialogueStart),dialogueEnd=s.dialogueEnd==null?duration:Number(s.dialogueEnd);
  if(dialogue&&(!Number.isFinite(dialogueStart)||!Number.isFinite(dialogueEnd)||dialogueStart<0||dialogueEnd<=dialogueStart||dialogueEnd>duration))fail('对白时间超出镜头');
  const voiceType=s.voiceType||'in';if(!['in','off','vo'].includes(voiceType))fail('声源类型无效');
  const segments=list(s.segments,240).map(seg=>{if(!seg||typeof seg!=='object')fail('镜内时间轴格式错误');const start=Number(seg.start),end=Number(seg.end);if(!Number.isFinite(start)||!Number.isFinite(end)||start<0||end<=start||end>duration+.05)fail('镜内时间轴超出镜头范围');let camBeat=text(seg.cameraBeat,500);if(camera.move&&camera.move!=='fixed'&&camBeat)camBeat=camBeat.replace(/固定机位/g,'起幅稳住构图');return {start:Math.round(start*10)/10,end:Math.min(duration,Math.round(end*10)/10),action:text(seg.action,1000),performance:text(seg.performance,600),cameraBeat:camBeat,audio:text(seg.audio,500),transition:choice('transition',seg.transition)};});
  const soundCues=list(s.soundCues,240).map(q=>{if(!q||typeof q!=='object')fail('声音时间轴格式错误');let start=Number(q.start),end=q.end==null||q.end===''?start:Number(q.end);const kind=text(q.kind,40);if(!Number.isFinite(start)||!Number.isFinite(end)||start<0||end<start||end>duration+.05)fail('声音时间轴秒数超出镜头范围');if(kind&&!['ambience','sfx','music','dialogue','foley'].includes(kind))fail('声音类型无效');if(kind==='dialogue'&&dialogue){start=dialogueStart;end=dialogueEnd;}return {start:Math.round(start*10)/10,end:Math.min(duration,Math.round(end*10)/10),kind,cue:text(q.cue,600)};});
  const rawTs=s.transitionSpec&&typeof s.transitionSpec==='object'&&!Array.isArray(s.transitionSpec)?s.transitionSpec:{};
  const transitionSpec={...pickObj(rawTs,['fromFrame','trigger','process','direction','toFrame','motionContinuity','audioBridge','continuityLock'],400),duration:rawTs.duration!==undefined&&rawTs.duration!==''&&Number.isFinite(Number(rawTs.duration))&&Number(rawTs.duration)>=0?Math.min(10,Math.round(Number(rawTs.duration)*10)/10):''};
  return {title:text(s.title,120)||'新镜头',duration,characterRefs:[...new Set(ids)],sceneRef,intent:text(s.intent,600),spatial:text(s.spatial,600),action,...Object.fromEntries(['startState','endState','dialogue','audio'].map(k=>[k,text(s[k])])),transition:choice('transition',s.transition),transitionSpec,speakerRef,dialogueLanguage:text(s.dialogueLanguage,80),voiceType,delivery:text(s.delivery,400),micro:[...new Set(list(s.micro,6).map(x=>choice('micro',x)).filter(Boolean))],intensity:text(s.intensity,100),music:text(s.music,400),dialogueStart,dialogueEnd,emotion:choice('emotion',s.emotion),acting:pickObj(s.acting,['eyes','brows','lips','breathing','head','posture'],300),continuitySpec:pickObj(s.continuitySpec,['character','prop','space','lighting','action'],400),segments,soundCues,negativeNotes:text(s.negativeNotes,600).replace(/[。；;]+$/g,''),camera};
 });
 const style=raw.style||{},commerce=raw.commerce||{},bgmRaw=raw.bgm&&typeof raw.bgm==='object'&&!Array.isArray(raw.bgm)?raw.bgm:{};
 const beats=list(commerce.beats,120).map(b=>{const start=Number(b.start),end=Number(b.end);if(!Number.isFinite(start)||!Number.isFinite(end)||start<0||end<=start)fail('广告时间段无效');return {title:text(b.title,200),start,end,action:text(b.action),voice:text(b.voice,2000)};});
 const total=shots.reduce((a,s)=>a+s.duration,0);if(!Number.isFinite(total)||total<=0)fail('总时长无效');
 const bgm={style:choice('bgm',bgmRaw.style),mood:text(bgmRaw.mood,200),instrumentation:text(bgmRaw.instrumentation,300),vocals:['','instrumental','hum','vocal'].includes(bgmRaw.vocals)?bgmRaw.vocals:'instrumental',custom:text(bgmRaw.custom,500)};
 return {title:text(raw.title,300),logline:text(raw.logline),chainLastFrame:!!raw.chainLastFrame,cutFrameCheck:!!raw.cutFrameCheck,style:{...Object.fromEntries(['look','medium','genre','color'].map(k=>[k,choice(k,style[k])])),texture:[...new Set(list(style.texture,50).map(x=>choice('texture',x)).filter(Boolean))],custom:text(style.custom)},bgm,negativePrompts:[...new Set(list(raw.negativePrompts,50).map(x=>choice('negative',x)).filter(Boolean))],characters,scenes,shots,commerce:{...Object.fromEntries(PLAN_COMMERCE_KEYS.map(k=>[k,text(commerce[k])])),beats}};
}
export function normalizePlanRequest(raw){if(!raw||typeof raw!=='object')throw Error('请求格式不正确');const idea=String(raw.idea||'').trim();if(idea.length<4||idea.length>PLAN_LIMITS.idea)throw Error(`请填写4—${PLAN_LIMITS.idea}字的创作想法`);const context=raw.context&&typeof raw.context==='object'?raw.context:{};if(JSON.stringify(context).length>500000)throw Error('当前项目设定过长，请缩减后重试');const shotControlMode=raw.shotControlMode==='auto'?'auto':'custom';if(shotControlMode==='auto')return {idea,shotControlMode:'auto',duration:0,shotCount:PLAN_LIMITS.shots,shotCountMode:'max',timingMode:'auto',maxMinutes:0,fixedDuration:0,preferences:normalizeCreativePreferences(raw.preferences),mode:raw.mode==='commerce'?'commerce':'story',context};const shotCount=Number(raw.shotCount);if(!Number.isInteger(shotCount)||shotCount<1||shotCount>PLAN_LIMITS.shots)throw Error(`分镜数量应为1—${PLAN_LIMITS.shots}的整数，可直接输入`);const shotCountMode=raw.shotCountMode==='max'?'max':'exact';const timingMode=['fixed','within'].includes(raw.timingMode)?raw.timingMode:'auto',fixedDuration=Number(raw.fixedDuration??5),maxMinutes=Number(raw.maxMinutes??1);if(timingMode==='within'&&(!Number.isFinite(maxMinutes)||maxMinutes<.1))throw Error('时长上限应至少为0.1分钟');if(timingMode==='fixed'&&(!Number.isFinite(fixedDuration)||fixedDuration<.5))throw Error('固定每镜时长应至少为0.5秒');const duration=Math.round((timingMode==='fixed'?shotCount*fixedDuration:timingMode==='within'?maxMinutes*60:Number(raw.duration))*10)/10;if(!Number.isFinite(duration)||duration<.5)throw Error('目标时长应至少为0.5秒');if(duration<shotCount*.5)throw Error('镜头数量与总时长不匹配，每镜至少需0.5秒');return {idea,shotControlMode:'custom',duration,shotCount,shotCountMode,timingMode,maxMinutes:timingMode==='within'?maxMinutes:0,fixedDuration:timingMode==='fixed'?fixedDuration:0,preferences:normalizeCreativePreferences(raw.preferences),mode:raw.mode==='commerce'?'commerce':'story',context};}
const CAST_FACE_DESC={ordinary:'普通人真实长相，路人自然质感与生活气息，避免网红过度精致感',ordinary_worker:'市井街头普通人长相，自然粗糙生活痕迹与浓郁人间烟火气，绝不精致摆拍',star:'明星级高颜值电影主角脸，立体骨相与强上镜质感',hk_retro_star:'90年代港星质感电影脸，浓眉英气或明艳风情，骨相深邃极具大银幕故事感',idol:'精致偶像剧高颜值五官，轮廓线条柔美清晰',character_actor:'强辨识度硬朗实力派质感脸，保留自然年龄与故事感',youth_campus:'青春校园感自然少男少女面庞，干净青涩不施浓妆',fashion_model:'清冷高级感文艺超模骨相，高颧骨与干净锐利下颌线',silver_elder:'自然沧桑长辈面孔，真实银白发丝与岁月皱纹阅历感',anime2d:'动漫二次元人物造型，清晰线稿与赛璐璐光影，非真人实拍',cg3d:'3D国漫/游戏CG立体人物造型，统一三维数字角色材质'};
const CAST_SKIN_DESC={natural_pores:'自然真实肤质，保留毛孔、细纹与皮肤纹理，严禁过度磨皮',light_makeup:'自然清透肤色，保留真实皮肤肌理与细节',sweat_rain_grit:'真实汗水、雨水微湿与油光皮肤肌理，保留毛孔汗珠颗粒感，极强街头动作实拍感',sun_tanned:'自然小麦晒后健康肤色，保留户外阳光晒痕与真实皮肤质感',aged_weathered:'岁月风霜真实肤质，清晰呈现法令纹、晒斑与手背劳作纹路，零美颜滤镜',film_halation_skin:'胶片柔光通透肤质，皮肤保留自然纹理并在强光边缘呈温润胶片高光过渡',soft_beauty:'影视级柔光微匀肤，细腻而不假面',polished_smooth:'高磨皮洁净无瑕匀净肤质，光滑细腻无明显瑕疵',cel_shaded:'二维动漫赛璐璐平涂上色肤色，无真人毛孔肌理',cg_sss:'三维CG光滑次表面散射角色皮肤材质'};
function enforceCharacterSpec(c,spec){
 if(!c||!spec)return;
 if(spec.name&&(!c.name||c.name==='新角色'||!/[a-zA-Z\u4e00-\u9fa5]/.test(c.name)))c.name=spec.name;
 else if(spec.name&&c.name!==spec.name&&spec.explicitName)c.name=spec.name;
 if(spec.nationality){
  const natLabel=AI_CAST_NATIONALITIES.find(x=>x[0]===spec.nationality)?.[1]||spec.nationality;
  let cleaned=(c.appearance||'').replace(/(?:日韩混血|中日混血|跨种族混血|欧亚混血|混血|日韩|中日|中欧|东亚|亚洲|日本|韩国|中国|美国|欧美|西方|英国|欧洲|非洲|非裔|拉美|西班牙裔|中东|阿拉伯|南亚|印度|东南亚|华裔|亚裔|美籍|英籍|日籍|韩籍|白人|黑人)(?:(?:\s*\/\s*|\s*)(?:欧美|非裔|白人|日本|韩国|西班牙裔|阿拉伯|印度))?(?:人|裔|籍|面孔|外貌|外观特征|外观|青年)?(?:\s*[（(][^）)]*[）)])?/g,'');
  if(/^(?:中国|日本|韩国|东南亚)/.test(spec.nationality))cleaned=cleaned.replace(/(?:金发碧眼|金发蓝眼|碧眼|蓝眼)[，、；,\s]*/g,'');
  cleaned=cleaned.replace(/^[，；、,\s]+/,'').replace(/[，；、,\s]+$/,'').trim();
  if(!c.appearance||!c.appearance.includes(spec.nationality))c.appearance=cleaned?`${natLabel}，${cleaned}`:natLabel;
 }
 if(spec.occupation)c.occupation=spec.occupation;
 if(spec.faceTier&&CAST_FACE_DESC[spec.faceTier]){
  const desc=CAST_FACE_DESC[spec.faceTier];
  if(!c.face?.includes(desc.slice(0,4)))c.face=c.face?`${desc}，${c.face}`:desc;
 }
 if(spec.skinRender&&CAST_SKIN_DESC[spec.skinRender]){
  const sDesc=CAST_SKIN_DESC[spec.skinRender];
  if(!c.skin?.includes(sDesc.slice(0,4)))c.skin=c.skin?`${sDesc}；${c.skin}`:sDesc;
 }
 if(spec.notes){
  if(!c.appearance?.includes(spec.notes))c.appearance=c.appearance?`${c.appearance}，${spec.notes}`:spec.notes;
  if(!c.variant?.includes(spec.notes))c.variant=c.variant&&c.variant!=='日常造型'?`${c.variant}；${spec.notes}`:spec.notes;
 }
}
export function conformPlanToRequest(plan,input){
 if(input.shotControlMode==='auto'){if(!plan.shots.length||plan.shots.length>PLAN_LIMITS.shots)throw Error(`模型返回的镜头数量超出 ${PLAN_LIMITS.shots} 镜限制，本次未应用，请重试`);}else if(!plan.shots.length||(input.shotCountMode==='max'?plan.shots.length>input.shotCount:plan.shots.length!==input.shotCount))throw Error('模型返回的镜头数量与设定不符，本次未应用，请重试');
 const rawDurations=plan.shots.map(s=>Math.max(.5,Math.round(Number(s.duration||5)*10)/10));
 const durations=input.shotControlMode==='auto'?rawDurations:(input.timingMode==='fixed'?plan.shots.map(()=>input.fixedDuration):input.timingMode==='within'&&plan.shots.reduce((a,s)=>a+s.duration,0)<=input.duration?plan.shots.map(s=>s.duration):allocateShotDurations(plan.shots.map(s=>s.duration),input.duration));
 plan.chainLastFrame=!!input.preferences.chainLastFrame;
 plan.cutFrameCheck=!!input.preferences.cutFrameCheck;
 const tStyle=input.preferences.transitionStyle||'auto';
 const styleDefaultMap={basic:'dissolve',camera:'whip_pan',vfx:'light_leak_trans',narrative:'match_action',audio:'j_cut',rhythmic:'speed_ramp',smooth_cut:'dissolve',hk_rhythmic:'whip_pan',emotional_fade:'slow_dissolve'};
 const bMode=input.preferences.bgmMode||'auto',bStyle=input.preferences.bgmStyle||'',bMood=input.preferences.bgmMood||'',bNotes=input.preferences.bgmNotes||'';
 plan.bgm=plan.bgm||{style:'',mood:'',instrumentation:'',vocals:'instrumental',custom:''};
 if(bMode==='none'){
  plan.bgm={style:'none',mood:'',instrumentation:'',vocals:'',custom:bNotes||'无背景音乐，纯环境音效与对白'};
 }else if(bMode==='guided'||bMode==='exact'){
  if(bStyle)plan.bgm.style=bStyle;
  if(bMood&&(!plan.bgm.mood||bMode==='exact'||!plan.bgm.mood.includes(bMood)))plan.bgm.mood=bMood;
  if(bNotes&&!plan.bgm.custom?.includes(bNotes))plan.bgm.custom=plan.bgm.custom?`${bNotes}；${plan.bgm.custom}`:bNotes;
 }
 const activeBgmLabel=[plan.bgm.style&&plan.bgm.style!=='none'?GROUPS.bgm.options.find(x=>x.id===plan.bgm.style)?.label:'',plan.bgm.mood].filter(Boolean).join(' · ');
 if(input.preferences.castMode==='individual'&&Array.isArray(input.preferences.castProfiles)&&input.preferences.castProfiles.length){
  const used=new Set();
  input.preferences.castProfiles.forEach((prof,idx)=>{
   if(!prof||!(prof.name||prof.nationality||prof.faceTier||prof.skinRender||prof.occupation||prof.notes))return;
   let chIndex=prof.name?plan.characters.findIndex((c,ci)=>!used.has(ci)&&c.name===prof.name):-1;
   if(chIndex<0)chIndex=plan.characters.findIndex((_,ci)=>!used.has(ci));
   if(chIndex>=0){used.add(chIndex);enforceCharacterSpec(plan.characters[chIndex],{...prof,explicitName:!!prof.name});}
  });
 }else if(input.preferences.castDefaults){
  const d=input.preferences.castDefaults;
  if(d.nationality||d.faceTier||d.skinRender||d.occupation||d.notes)plan.characters.forEach(c=>enforceCharacterSpec(c,d));
 }
 const allProfiles=input.preferences.castMode==='individual'?(input.preferences.castProfiles||[]):[input.preferences.castDefaults].filter(Boolean);
 if(allProfiles.some(x=>['natural_pores','sweat_rain_grit','aged_weathered'].includes(x?.skinRender)))plan.negativePrompts=[...new Set([...(plan.negativePrompts||[]),'skin'])];
 if(allProfiles.length&&allProfiles.every(x=>['polished_smooth','cel_shaded','cg_sss'].includes(x?.skinRender)||['anime2d','cg3d'].includes(x?.faceTier)))plan.negativePrompts=(plan.negativePrompts||[]).filter(x=>x!=='skin');
 plan.shots.forEach((s,i)=>{
  const scale=durations[i]/s.duration;
  s.dialogueStart=Math.round(s.dialogueStart*scale*10)/10;
  s.dialogueEnd=Math.min(durations[i],Math.round(s.dialogueEnd*scale*10)/10);
  if(Array.isArray(s.segments))s.segments=s.segments.map(seg=>{const st=Math.round(seg.start*scale*10)/10,ed=Math.min(durations[i],Math.max(st+.1,Math.round(seg.end*scale*10)/10));return {...seg,start:Math.min(st,durations[i]),end:Math.min(durations[i],ed)};}).filter(seg=>seg.end>seg.start);
  if(Array.isArray(s.soundCues))s.soundCues=s.soundCues.map(q=>{const st=Math.min(durations[i],Math.round(q.start*scale*10)/10),ed=Math.min(durations[i],Math.max(st,Math.round(q.end*scale*10)/10));return {...q,start:st,end:ed};});
  s.duration=durations[i];
  if(bMode==='none'){s.music='无背景音乐（静默）';if(Array.isArray(s.soundCues))s.soundCues=s.soundCues.filter(q=>q.kind!=='music');}
  else if((bMode==='guided'||bMode==='exact')&&activeBgmLabel&&(!s.music||s.music==='无背景音乐'||bMode==='exact'))s.music=activeBgmLabel;
  if(input.preferences.dialogueMode==='silent'){s.dialogue='';s.speakerRef='';}
  else if(s.dialogue){s.dialogueLanguage=input.preferences.language||s.dialogueLanguage||'普通话';if(input.preferences.dialogueMode==='narration')s.voiceType='vo';}
  const next=plan.shots[i+1];
  if(next){
   const isSceneChange=Boolean(s.sceneRef&&next.sceneRef&&s.sceneRef!==next.sceneRef);
   if((!s.transition||s.transition==='cut')&&(isSceneChange||tStyle!=='auto')){
    if(styleDefaultMap[tStyle]){s.transition=styleDefaultMap[tStyle];s.transitionSpec={...s.transitionSpec,process:'',duration:''};}
    else if(isSceneChange){s.transition=s.camera?.move==='push'?'push_in_trans':s.camera?.move==='pull'?'pull_out_trans':s.camera?.move==='whip'?'whip_pan':'dissolve';s.transitionSpec={...s.transitionSpec,process:'',duration:''};}
   }
  }
 });
 if(plan.chainLastFrame){
  plan.shots.forEach((s,i)=>{
   const prev=plan.shots[i-1],next=plan.shots[i+1];
   if(prev&&prev.sceneRef===s.sceneRef){
    if(!s.startState&&prev.endState)s.startState=prev.endState;
    if(!s.continuitySpec?.action&&prev.endState)s.continuitySpec={...(s.continuitySpec||{}),action:`以第${i}镜结尾最后一帧的姿态与光影作为本镜开头首帧：${prev.endState}`};
   }
   if(next&&next.sceneRef===s.sceneRef&&(!s.transition||s.transition==='cut')){s.transition='continuous';s.transitionSpec={...s.transitionSpec,process:'',duration:''};}
  });
 }
 if(input.preferences.dialogueMode!=='silent'&&!plan.shots.some(s=>s.dialogue.trim()))throw Error('模型遗漏了所需对白，本次未应用；可重新生成，或主动选择无对白模式');
 const chosen=requestedVisualStyle(input.preferences);for(const [k,v] of Object.entries(chosen))plan.style[k]=v;
 
 return normalizePlan(plan);
}
export function validateSavedAIData(p){if(p.aiBrief&&(typeof p.aiBrief!=='object'||typeof p.aiBrief.idea!=='string'||p.aiBrief.idea.length>PLAN_LIMITS.idea||!Number.isFinite(Number(p.aiBrief.duration))||!Number.isFinite(Number(p.aiBrief.shotCount))))throw Error('AI创作想法格式不正确。');if(!p.aiSuggestion)return;const s=p.aiSuggestion,q=s.plan;if(!q||typeof q!=='object'||!['ai','demo'].includes(s.origin)||typeof s.projectId!=='string'||typeof q.title!=='string'||typeof q.logline!=='string')throw Error('AI填写草稿格式不正确。');for(const [k,max] of [['characters',PLAN_LIMITS.characters],['scenes',PLAN_LIMITS.scenes],['shots',PLAN_LIMITS.shots]])if(!Array.isArray(q[k])||q[k].length>max||!q[k].every(x=>x&&typeof x==='object'))throw Error('AI填写列表格式不正确。');if(!q.characters.every(c=>typeof c.name==='string')||!q.scenes.every(c=>typeof c.name==='string')||!q.shots.every(x=>typeof x.title==='string'&&typeof x.action==='string'&&Number.isFinite(Number(x.duration))))throw Error('AI分镜草稿格式不正确。');}
