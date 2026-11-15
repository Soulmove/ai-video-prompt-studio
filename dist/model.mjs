import {validateVideoData} from './video-core.mjs';
import {validateSavedAIData} from './ai-contract.mjs';
import {sparsePrompt,commercePrompt,commerceDefaults} from './builder.mjs';
import {GROUPS,TEMPLATES,VERSION,TRANSITION_CATEGORIES} from './catalog.mjs';
export {TRANSITION_CATEGORIES};
export const uid=()=>globalThis.crypto?.randomUUID?.()||`id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
export const clone=x=>structuredClone(x);
export const n=x=>Number.isFinite(Number(x))?Number(x):0;
export const fmt=x=>Number(n(x).toFixed(2)).toString();
export const cameraDefaults=()=>({framing:'medium',angle:'eye',composition:'thirds',move:'push',moveDistance:'subtle',speed:'slow',stability:'gimbal',lens:'50',focus:'subject',direction:'cw',orbit:90,subjectTurn:false,start:'',end:'',focusFrom:'',focusTo:'',hold:0.5,lockFrame:false,rotation:'none',zoom:'none'});
export const transitionSpecDefaults=()=>({fromFrame:'',trigger:'',process:'',direction:'',duration:'',toFrame:'',motionContinuity:'',audioBridge:'',continuityLock:''});
export const bgmDefaults=()=>({style:'',mood:'',instrumentation:'',vocals:'instrumental',custom:''});
export function character(name='新角色') {const id=uid();return {id,identityId:id,name,age:'28岁，成年人',gender:'女性',height:'168cm',build:'自然匀称',occupation:'',appearance:'东亚外观',skin:'自然肤色，保留细腻皮肤纹理',face:'鹅蛋脸，轮廓自然',eyes:'深棕色虹膜',brows:'自然平眉',nose:'自然鼻梁',lips:'自然唇形',hair:'齐肩直发，少量碎发',hairColor:'深棕色',makeup:'自然淡妆',outfit:'米白色亚麻衬衫，深色长裤',accessories:'',habits:'右手惯用，姿态自然',voice:'中低音，语速自然，表达克制',language:'普通话',variant:'日常造型',locks:{appearance:true,hair:true,outfit:true,voice:false}};}
export function scene(name='新场景'){return {id:uid(),name,description:'木质步道沿湖延伸，栏杆有自然木纹',foreground:'少量栏杆形成前景',background:'安静湖面与远处树影',entrance:'步道从画面左侧延伸至右侧',dynamics:'微风轻动发丝，湖面泛起细小涟漪',sound:'轻微风声与水声',weather:'clear',time:'sunset',lightSource:'sunset',lightDirection:'back',lightQuality:'soft',lightNote:'高光柔和，面部保留细节',layout:{ax:38,ay:52,bx:67,by:48,cx:47,cy:82,lx:82,ly:20}};}
export function makeShot(p){return {id:uid(),title:`新镜头 ${p.shots.length+1}`,duration:4,manualStart:0,characterIds:p.characters[0]?[p.characters[0].id]:[],sceneId:p.scenes[0]?.id||'',intent:'',spatial:'',action:'',purpose:'承接反应',inheritStart:p.shots.length>0,startState:'',endState:'',transition:p.fromScratch?'':'cut',transitionSpec:transitionSpecDefaults(),continuity:'continuous',propId:p.props[0]?.id||'',handStart:'unknown',handEnd:'unknown',propStart:'',propEnd:'',camera:{},emotion:'restrained',micro:[],intensity:'自然',acting:{eyes:'',brows:'',lips:'',breathing:'',head:'',posture:''},dialogue:'',speakerId:p.characters[0]?.id||'',dialogueStart:0,dialogueEnd:4,dialogueLanguage:'普通话',speechRate:4,voiceType:'in',delivery:'',audio:'',music:'无背景音乐',soundCues:[],continuitySpec:{character:'',prop:'',space:'',lighting:'',action:''},negativeNotes:'',segments:[],referenceIds:[],notes:'',generationDuration:6,trimIn:1,trimOut:5};}
export function makeProject(templateId='lake'){
 const t=TEMPLATES.find(x=>x.id===templateId)||TEMPLATES[0],a=character('林夏'),b=character('周屿');
 b.gender='男性';b.age='30岁，成年人';b.hair='自然短发';b.outfit='深灰色棉质衬衫，黑色长裤';b.voice='低音，自然温和';
 if(['wuxia','fantasy'].includes(templateId)){a.outfit='浅色交领长衫，深色腰带，布鞋';a.hair='深色长发，半束发';a.variant='古装造型';}
 const s=scene(t.scene);s.weather=t.weather;s.time=t.time;
 if(t.theme==='coffee'){s.description='有生活痕迹的木质桌椅，靠窗空间，材质自然';s.foreground='木桌和杯沿';s.background='窗外街道柔和虚化';s.entrance='窗户在左侧，入口在后方';s.dynamics='杯中热气缓慢升起';s.sound='远处街声与轻微室内底声';s.lightSource='window';s.lightDirection='side';}
 if(t.theme==='night'){s.description='潮湿地面，空间向远处延伸，局部暖色实景灯';s.background='远处灯光与阴影';s.dynamics='细雨落下，灯光映在地面';s.sound='雨声与远处交通声';s.lightSource='neon';}
 const p={version:VERSION,id:uid(),title:t.id==='lake'?'未说出口的夏天':t.name,logline:t.desc||'一个人物，一次行动，一次关系的变化。',templateId:t.id,theme:t.theme,mode:'quick',targetDuration:15,timing:'ordered',platform:'通用自然语言',format:'9:16',resolution:'4K',customWidth:2160,customHeight:3840,fps:24,customFormat:'9:16',customFps:24,language:'zh',output:'full',timingOutput:'seconds',chainLastFrame:false,cutFrameCheck:false,subtitles:'none',screenText:'',negativePrompts:[],restrictions:'动作自然，人物身份、发型与所选造型保持一致；不添加未指定人物或对白。',style:{look:'cinema',medium:'35mm',genre:t.genre,color:t.theme==='night'?'cool':'warm',texture:['skin','grain','soft'],intensity:65,custom:''},bgm:bgmDefaults(),camera:cameraDefaults(),characters:[a,b],scenes:[s],props:[{id:uid(),name:['wuxia','fantasy'].includes(t.id)?'折叠密信':'折叠信纸',appearance:'米白色纸张，对折，边角略有磨损',ownerId:a.id}],shots:[],references:[],customOptions:{},createdAt:Date.now(),updatedAt:Date.now()};
 const propName=p.props[0].name;
 const intents=[
  '用平移构图建立人物所在空间与独处秩序，明确右手握持关键道具的状态，为后续打破平静做铺垫。',
  '以克制的轨道物理推进聚焦眼神变化，将外部声音触发的警觉从环境拉向内心反应。',
  '用锁定机位固定观察人物克制反应，让指尖微收与视线停顿传达未说出口的情绪张力。'
 ];
 const spatials=[
  `${a.name}位于${s.name}中景偏右位置，面向画面左侧远端，与摄影机保持自然观察角度，不直视摄影机。`,
  `人物居于画面中心偏左，画外声音来自人物右后方（远离机位光轴），人物仅向声源方向转动眼神与微偏头部，不看镜头。`,
  `人物保持三分构图停驻，视线稳定落在画外对象方向，前景与背景距离关系不变，避免无关穿帮移动。`
 ];
 const actings=[
  {eyes:'目光平静停留在前方空间，保持自然频率眨眼',brows:'眉眼舒展放松',lips:'嘴唇自然闭合，下颌放松',breathing:'保持平稳匀速呼吸',head:'随步伐轻微稳定前移，无突兀摆动',posture:'双肩松弛自然，右手稳定握持道具贴近身侧'},
  {eyes:'声音响起前保持原视线，0.8秒后眼球先向声源转动再缓缓抬眼',brows:'眉心极其轻微收紧呈警觉感',lips:'双唇轻抿后恢复自然闭合',breathing:'听见声响瞬间呼吸短暂停顿半秒',head:'仅发生小角度受控微转（不超过15度）跟随视线',posture:'躯干与双肩保持原位不大幅扭转，右手稳握不松脱'},
  {eyes:'视线短暂垂落后再克制抬向画外目标',brows:'保持克制平缓',lips:'轻微收抿忍住未出口的话，随后呼气放松',breathing:'一次缓慢深长呼气后恢复平稳',head:'头部微定，保持停驻',posture:'身体静止站稳，仅右手指尖轻收道具边缘'}
 ];
 t.actions.forEach((action,i)=>{
  const shot=makeShot(p),dur=t.durations[i];
  const baseLight=`${s.lightSource==='window'?'窗光':s.lightSource==='neon'?'霓虹环境光':'黄昏主光'}来自${s.lightDirection==='side'?'侧方':'侧逆方向'}，冷暖对比稳定`;
  const cueMid=Math.min(Math.max(0.5,Number((dur*0.25).toFixed(1))),dur-0.4);
  Object.assign(shot,{
   title:t.titles[i],duration:dur,manualStart:t.durations.slice(0,i).reduce((x,y)=>x+y,0),
   intent:intents[i],spatial:spatials[i],action,purpose:['交代空间','揭示信息','承接反应'][i],
   startState:i===0?'林夏站在步道旁，右手握着折叠信纸':'',
   endState:['人物停下，右手仍握着折叠信纸','人物已回头，视线停在画外，右手仍握着信纸','人物保持站立，右手握信纸，视线停在画外'][i],
   transition:i<t.actions.length-1?'cut':'end',
   handStart:'right',handEnd:'right',propStart:'折叠',propEnd:'折叠',
   camera:{framing:['mediumFull','mediumClose','medium'][i],move:['track','push','fixed'][i],moveDistance:['moderate','subtle','none'][i],zoom:'none',end:['画面稳定落于人物停步构图','缓慢物理推进至面部占画面主要区域，透视自然收敛','完全锁定机位并定格至镜尾'][i]},
   audio:i===1?'画外一声呼唤“林夏”，随后回到风声与水声':'',
   emotion:i===2?'hesitate':'restrained',
   acting:actings[i],
   soundCues:i===1?[{start:0,end:dur,kind:'ambience',cue:s.sound||'持续环境底声'},{start:cueMid,end:Number(Math.min(dur,cueMid+1.2).toFixed(1)),kind:'sfx',cue:'画外传来轻声呼唤“林夏”'},{start:Number(Math.min(dur,cueMid+1.4).toFixed(1)),end:dur,kind:'ambience',cue:'环境回落安静，仅留自然环境声'}]:[{start:0,end:dur,kind:'ambience',cue:s.sound||'持续轻柔自然环境底声'}],
   continuitySpec:{character:`${a.name}保持${a.age}面貌、${a.hair}及${a.outfit}完全一致`,prop:`${propName}始终由右手握持，对折形态不变`,space:`${s.name}空间布置、${s.entrance}方位保持一致`,lighting:baseLight,action:i===0?'停步后保持静立姿态以供下一镜硬切承接':i===1?'从第1镜停步状态开始转身反应，镜尾保持视线指向画外':'从第2镜回头静止姿态切入，全程稳住双肩与持物右手'},
   negativeNotes:i===1?`禁止未授权切镜、禁止用光学变焦替代物理推进、禁止${propName}在左右手间互换或消失、禁止背景物位移及面部过度磨皮`:`禁止人物身份五官漂移、禁止${propName}消失或变形、禁止额外无关路人与水印字幕`
  });
  shot.generationDuration=shot.duration+2;shot.trimOut=shot.duration+1;p.shots.push(shot);
 });
 const prop=p.props[0];p.shots[0].startState=`${a.name}位于${s.name}，右手握着${prop.name}。`;
 const ends={mystery:['人物停在门前，右手仍握着折叠信纸','人物低头看信纸封口，右手保持持物','信纸停在人物眼前，尚未展开，人物仍在门前'],wuxia:['人物站定在石桥中央，右手握密信','人物回头望向桥头画外，右手握密信','人物站稳，密信贴近身侧，仍在右手'],family:['人物站在门边，右手握信纸','门已打开，人物左手扶门，右手握信纸','人物停在门槛外回头，右手仍握信纸'],reversal:['人物站在宴会厅门口，邀请函在右手','邀请函在胸前展开，由右手持有','邀请函已收好，人物进入宴会厅'],chase:['人物到达巷道拐角，右手握信纸','人物贴墙停住，右手仍握信纸','人物看向巷口，信纸握在右手'],cyber:['人物站在天桥栏杆旁，右手握信纸','人物侧头看城市，信纸仍在右手','信纸贴近胸前，由右手持有，视线朝向远处'],document:['人物走到早餐铺前，右手握信纸','人物停下看蒸汽，右手仍握信纸','人物侧身让出通道，右手仍握信纸'],product:['信纸位于桌面中央，人物右手已经松开','信纸在桌面展开，右手指尖停在边缘','信纸平展于桌面，人物右手已移开'],reunion:['人物站在站台边，右手握信纸','人物回头寻找声音，右手仍握信纸','人物站在原地微笑，视线落在画外，信纸在右手'],fantasy:['人物站在石阶上，右手握密信','人物转身看向石阶下方，密信仍在右手','人物望向画外，右手稍放松但仍握密信']};
 if(ends[t.id])p.shots.forEach((shot,i)=>shot.endState=ends[t.id][i]);
 if(t.id==='product'){p.shots.forEach((shot,i)=>{shot.handEnd='table';shot.propEnd=i?'展开':'折叠';if(i)shot.propStart=i>1?'展开':'折叠';});}
 if(t.id==='reversal'){p.shots[1].propEnd='展开';p.shots[2].propStart='展开';}
 if(t.id==='coffee'){p.shots[0].endState='林夏右手已收回，信纸留在桌面中央';p.shots[0].handEnd='table';p.shots[1].characterIds=[b.id];p.shots[1].handEnd='table';p.shots[1].endState='周屿双手停在杯子旁，信纸在桌面中央';p.shots[2].handEnd='table';p.shots[2].endState='两人对视，信纸仍在桌面中央';}
 return p;
}
export function options(p,key){return [...(GROUPS[key]?.options||[]),...(p.customOptions?.[key]||[])];}
export function opt(p,key,id,lang='zh'){const x=options(p,key).find(o=>o.id===id);return x?.[lang]||x?.zh||id||'';}
export function label(p,key,id){return options(p,key).find(o=>o.id===id)?.label||id||'未指定';}
export function timeline(p){let cursor=0;return p.shots.map((s,i)=>{const start=p.timing==='free'?n(s.manualStart):cursor;const end=start+n(s.duration);cursor=end;return {id:s.id,index:i,start,end,duration:n(s.duration)};});}
export function totalDuration(p){const t=timeline(p);return t.length?Math.max(...t.map(x=>x.end)):0;}
export function camera(p,s){return {...p.camera,...(s.camera||{})};}
export function startState(p,i){const s=p.shots[i],prev=p.shots[i-1];return s.inheritStart&&prev&&s.continuity==='continuous'&&s.sceneId===prev.sceneId?prev.endState:s.startState;}
export function startHand(p,i){const s=p.shots[i],prev=p.shots[i-1];return s.inheritStart&&prev&&s.continuity==='continuous'&&s.propId===prev.propId&&s.sceneId===prev.sceneId?prev.handEnd:s.handStart;}
export function effectiveSegments(s){return s.segments?.length?[...s.segments].sort((a,b)=>n(a.start)-n(b.start)):[{id:'main',start:0,end:n(s.duration),action:s.action,dialogue:'',audio:''}];}
export function estimateDialogue(text,rate=4){const syllables=(text.match(/[\p{Script=Han}]/gu)||[]).length+(text.match(/[a-zA-Z]+/g)||[]).length*1.4;const pauses=(text.match(/[，。！？；,.!?;]/g)||[]).length*0.18;return syllables/Math.max(1,n(rate))+pauses;}
export const aspect=p=>p.format==='自定义'?(p.customFormat||'9:16'):p.format;
export const frameRate=p=>p.fps==='自定义'?n(p.customFps):n(p.fps);
export function resolution(p){const ratio=aspect(p).split(':').map(Number),portrait=ratio[0]<ratio[1],r=ratio.length===2&&ratio[1]>0?ratio[0]/ratio[1]:9/16;const short={ '720P':720,'1080P':1080,'2K':1440,'4K':2160,'DCI 4K':2160,'8K':4320};if(p.resolution==='自定义')return `${p.customWidth} × ${p.customHeight}`;if(p.resolution==='DCI 4K')return portrait?'2160 × 4096':'4096 × 2160';const h=short[p.resolution]||2160;return portrait?`${h} × ${Math.round(h/r)}`:`${Math.round(h*r)} × ${h}`;}
const HAND={right:'右手',left:'左手',both:'双手',table:'桌面 / 场景中',none:'未持有',unknown:'未知'};
const HAND_EN={right:'right hand',left:'left hand',both:'both hands',table:'on a surface in the scene',none:'not held',unknown:'unknown'};
export const handLabel=(id,lang='zh')=>(lang==='en'?HAND_EN:HAND)[id]||id;
export function cleanVal(v){
 const s=String(v??'').trim().replace(/[。，；;,.!！?？]+$/g,'').trim();
 if(!s||/^(未知|不详|无|暂无|无妆|无妆容|无明显妆容|无配饰|无明显配饰|none|unknown|n\/a|-|null)$/i.test(s))return '';
 return s;
}
export function alignSpatialToAspect(p,text){
 const s=String(text??'').trim();if(!s)return '';
 const ratio=aspect(p).split(':').map(Number),portrait=ratio.length===2&&ratio[0]<ratio[1],landscape=ratio.length===2&&ratio[0]>ratio[1];
 if(portrait)return s.replace(/横(幅|屏|向)(构图|全景|中全景|中景|近景|特写|画面)/g,'竖屏$2').replace(/横幅/g,'竖屏');
 if(landscape)return s.replace(/竖(幅|屏|向)(构图|全景|中全景|中景|近景|特写|画面)/g,'横幅$2');
 return s;
}
function labelFeature(val,re,prefix,en){
 const v=cleanVal(val);if(!v)return '';
 if(en||re.test(v))return v;
 return `${prefix}${v}`;
}
export function characterText(c,short=false,lang='zh'){
 const en=lang==='en';
 const hairStr=[cleanVal(c.hairColor),cleanVal(c.hair)].filter(Boolean).join(en?' ':'');
 const parts=short
  ?[cleanVal(c.name),cleanVal(c.age),labelFeature(c.face,/脸|面|廓|颌|颧/,'脸型',en),hairStr,cleanVal(c.outfit)]
  :[
   cleanVal(c.name),cleanVal(c.age),cleanVal(c.gender),cleanVal(c.height),cleanVal(c.build),cleanVal(c.occupation),
   cleanVal(c.appearance),cleanVal(c.skin),
   labelFeature(c.face,/脸|面|廓|颌|颧/,'脸型',en),
   labelFeature(c.eyes,/眼|眸|瞳|目|虹膜/,'眼部',en),
   labelFeature(c.brows,/眉/,'眉形',en),
   labelFeature(c.nose,/鼻/,'鼻型',en),
   labelFeature(c.lips,/唇|嘴/,'唇形',en),
   hairStr,cleanVal(c.makeup),cleanVal(c.outfit),
   labelFeature(c.accessories,/配饰|佩戴|戴|眼镜|耳|表|链|戒|饰|徽/,'配饰：',en),
   labelFeature(c.habits,/习惯|动作|姿态|惯用|说话|站姿|步态/,'动作特征：',en)
  ];
 return parts.filter(Boolean).join(en?', ':'，');
}
const ACTING_LABELS={eyes:'眼神',brows:'眉毛',lips:'嘴唇',breathing:'呼吸',head:'头部',posture:'肩背与肢体'};
const ACTING_LABELS_EN={eyes:'Eyes',brows:'Brows',lips:'Lips',breathing:'Breathing',head:'Head',posture:'Shoulders & posture'};
const SOUND_KIND_ZH={ambience:'环境',sfx:'音效',music:'配乐',dialogue:'对白',foley:'动作音'};
const SOUND_KIND_EN={ambience:'Ambience',sfx:'SFX',music:'Music',dialogue:'Dialogue',foley:'Foley'};

export function actingLines(p,s,lang='zh'){
 const en=lang==='en';
 const labels=en?ACTING_LABELS_EN:ACTING_LABELS;
 const parts=Object.keys(labels).map(k=>cleanVal(s.acting?.[k])?`${labels[k]}：${cleanVal(s.acting[k])}`:'').filter(Boolean);
 const microText=s.micro?.length&&parts.length<3?s.micro.map(x=>opt(p,'micro',x,lang)).join('；'):'';
 const base=s.emotion?`${en?'Performance':'表演'}：${opt(p,'emotion',s.emotion,lang)}${microText?'；'+microText:''}${s.intensity?`（${s.intensity}）`:''}`:'';
 const detail=parts.length?`${en?'Acting details':'表演细则'}：${parts.join(en?'; ':'；')}`:'';
 return [base,detail].filter(Boolean).join('\n');
}

export function bgmText(p,lang='zh'){
 const b=p.bgm;if(!b||typeof b!=='object')return '';
 const en=lang==='en';
 if(b.style==='none'){
  const extra=[cleanVal(b.mood),cleanVal(b.custom)].filter(Boolean).join(en?'; ':'；');
  return `${en?'Background music (BGM): ':'背景音乐（BGM）：'}${opt(p,'bgm','none',lang)}${extra?(en?'; ':'；')+extra:''}`;
 }
 const hasContent=Boolean(b.style||cleanVal(b.mood)||cleanVal(b.instrumentation)||cleanVal(b.custom));
 if(!hasContent)return '';
 const vocalText={
  instrumental:en?'Instrumental only; smooth ducking under dialogue':'纯器乐无人声；有对白时配乐自动压低退让（Ducking）',
  hum:en?'Gentle wordless humming pad, receding during speech':'允许轻柔人声吟唱铺底；对白期间自动压低音量',
  vocal:en?'Includes thematic vocal/lyrics, fading cleanly before dialogue':'含主题人声演唱；角色开口前平稳淡出让人声清晰'
 }[b.vocals]||'';
 const parts=[
  b.style?opt(p,'bgm',b.style,lang):'',
  cleanVal(b.mood)?`${en?'Mood & pacing':'情绪节奏'}：${cleanVal(b.mood)}`:'',
  cleanVal(b.instrumentation)?`${en?'Instrumentation':'主奏乐器'}：${cleanVal(b.instrumentation)}`:'',
  vocalText,
  cleanVal(b.custom)
 ].filter(Boolean);
 return parts.length?`${en?'Background music (BGM): ':'背景音乐（BGM）：'}${parts.join(en?'; ':'；')}`:'';
}

function effectiveMusicCue(p,s){
 const m=cleanVal(s.music);
 if(m==='本镜暂停配乐（静默）'||m==='无背景音乐（静默）')return '';
 if(m&&m!=='无背景音乐')return m;
 const b=p.bgm;if(!b||b.style==='none')return '';
 return [b.style?label(p,'bgm',b.style):'',cleanVal(b.mood),cleanVal(b.instrumentation),cleanVal(b.custom)].filter(Boolean).join(' · ');
}

export function soundTimelineLines(p,s,sc,lang='zh'){
 const en=lang==='en',kinds=en?SOUND_KIND_EN:SOUND_KIND_ZH,m=cleanVal(s.music),explicitSilence=m==='本镜暂停配乐（静默）'||m==='无背景音乐（静默）',effMusic=effectiveMusicCue(p,s);
 const silenceLine=explicitSilence?(en?'Pause background music in this shot (silence)':m):'';
 if(s.soundCues?.length){
  const cues=[...s.soundCues].sort((a,b)=>n(a.start)-n(b.start)).map(q=>{
   const span=n(q.end)>n(q.start)?`${fmt(q.start)}–${fmt(q.end)}${en?'s':'秒'}`:`${fmt(q.start)}${en?'s':'秒'}`;
   const tag=q.kind?`｜${kinds[q.kind]||q.kind}`:'';
   return `[${span}${tag}] ${cleanVal(q.cue)||''}`;
  });
  const combined=cues.join('\n');
  const hasMusicCue=s.soundCues.some(q=>q.kind==='music');
  const hasSfxCue=s.soundCues.some(q=>q.kind==='sfx'||q.kind==='foley');
  if(silenceLine&&!combined.includes(m))cues.push(`${en?'Music':'配乐'}：${silenceLine}`);
  else if(effMusic&&!combined.includes(effMusic)&&(!hasMusicCue||effMusic.length<=16))cues.push(`${en?'Music':'配乐'}：${effMusic}`);
  if(s.audio&&!combined.includes(s.audio)&&!hasSfxCue&&!/环境音与人声清晰平衡/.test(s.audio))cues.push(`${en?'Audio':'声效'}：${cleanVal(s.audio)}`);
  return [`${en?'SOUND TIMELINE':'【声音时间轴】'}`,...cues];
 }
 const fallback=[cleanVal(sc?.sound),cleanVal(s.audio),silenceLine||effMusic].filter(Boolean);
 if(!fallback.length&&!p.fromScratch)return [`${en?'Sound':'声音'}：${cleanVal(s.music)||'自然环境底声'}`];
 return fallback.length?[`${en?'Sound':'声音'}：${fallback.join('；')}`]:[];
}

export function continuityLockLines(p,s,i,lang='zh'){
 const en=lang==='en',sp=s.continuitySpec||{};
 const sc=p.scenes.find(x=>x.id===s.sceneId),chars=p.characters.filter(c=>s.characterIds.includes(c.id)),prop=p.props.find(x=>x.id===s.propId);
 const ch=sp.character||(!p.fromScratch&&chars.length?chars.map(c=>`${c.name}保持${c.hairColor}${c.hair}与${c.outfit}`).join('；'):'');
 const pr=sp.prop||(prop&&s.handEnd!=='unknown'?`${prop.name}（${prop.appearance}）由${handLabel(startHand(p,i),lang)} → ${handLabel(s.handEnd,lang)}${s.propEnd?'，状态：'+s.propEnd:''}`:'');
 const loc=sp.space||(!p.fromScratch&&sc?`${sc.name}位置固定${sc.entrance?'（'+sc.entrance+'）':''}`:'');
 const light=sp.lighting||(!p.fromScratch&&sc?lightText(p,sc,lang):'');
 const act=sp.action||(p.chainLastFrame&&i>0&&p.shots[i-1]?.endState?`${en?'Inherit end frame of previous shot: ':'以第'+i+'镜结尾最后一帧作为本镜开头首帧：'}${p.shots[i-1].endState}`:'');
 const rows=[
  ch?(en?'Character lock: ':'人物连续性：')+ch:'',
  pr?(en?'Prop lock: ':'道具连续性：')+pr:'',
  loc?(en?'Space lock: ':'空间连续性：')+loc:'',
  light?(en?'Lighting lock: ':'光影连续性：')+light:'',
  act?(en?'Action link: ':'动作衔接：')+act:''
 ].filter(Boolean);
 return rows.length?[`${en?'CONTINUITY LOCK':'【连续性约束】'}\n${rows.join('\n')}`]:[];
}

export function chainDirective(p,lang='zh'){
 if(!p.chainLastFrame&&!p.cutFrameCheck)return '';
 const en=lang==='en',blocks=[];
 if(p.chainLastFrame){
  blocks.push(en
   ?[
     'GENERATION-STAGE SPEC · LAST-FRAME-TO-FIRST-FRAME CHAIN (single-shot generation only; post-production cuts follow the Editing & Transition Table below unconditionally):',
     '1. Generate one shot at a time in strict sequential order; never generate multiple shots simultaneously. Generate Shot 1, inspect and verify it before generating Shot 2, and so on.',
     '2. When generating each shot, feed the final frame image of the previous shot as the input image; the next shot must continue directly from that image: same person, same face, same hairstyle, same outfit, same scene, same color grade — no face swap, outfit swap, hair change, or color shift.',
     '3. After generating each shot, inspect frames second by second: check whether face, hair, position, outfit, hands, props, or scene changed, whether later plot points appeared prematurely, or whether there are extra fingers, clipping, or jump cuts. Fix any issue before proceeding.',
     '4. If a shot prematurely acts out later plot events (e.g., a shark, character, or scene meant for a later shot appears early), do not use the full clip: trim it to the second before the issue occurs, and use that pre-issue frame as the opening input frame for the next shot.',
     '5. If any shot is regenerated, every subsequent shot must be re-chained using the new final frame; never mix old and new frames.'
    ].join('\n')
   :[
     '【生成阶段规范】首尾帧衔接要求：请让每个镜头生成视频结尾的最后一帧，直接作为下一个镜头开头的首帧（延续人物姿态、站位、服装发型、手持道具手别与光线方向），并严格执行以下生成规范（仅约束单镜生成与帧间承接；后期剪辑转场不在单镜视频内生成，合并时一律按文末【后期合并剪辑与转场执行表】无条件执行）：',
     '1. 一镜一镜按顺序生成，绝不同时生成多个镜头。先生成第1镜，检查没问题再生成第2镜，以此类推。',
     '2. 每一镜生成时，把上一镜的最后一帧图片作为输入图，下一镜必须从这张图直接继续：同一个人、同一张脸、同一个发型、同一件衣服、同一个场景、同一个色调，不许换脸、换装、换发型、换色调。',
     '3. 每一镜生成完，你自己先逐秒抽帧检查：脸、头发、人物位置、衣服、手、道具、场景有没有变，有没有提前演到后面镜头的剧情，有没有多余手指、穿模、跳切。查出问题先修好再往下做，不要把有问题的镜头直接发我。',
     '4. 如果某一镜提前演到了后面的剧情（比如第1镜里就出现了后面才该出现的鲨鱼/人物/场景），不要用它整段：把它截到出问题之前的那一秒，用出问题前那一帧当下一镜的开头图。',
     '5. 如果某一镜重做了，后面所有镜都必须用新版的最后一帧重新接一遍，不许新旧混用。'
    ].join('\n'));
 }
 if(p.cutFrameCheck){
  blocks.push(en
   ?'CUT-POINT TWO-FRAME CHECK (generation-stage self-check only): The last frame of the previous shot and the first frame of the next shot must be the exact same image — hair, arms, clothing, and position must not jump. If drift occurs, regenerate or trim-and-rechain during generation; never omit or override the scheduled transitions in the Editing & Transition Execution Table below.'
   :'切点前后两帧检查（仅生成阶段自检）：上一镜最后一帧和下一镜第一帧必须是一样的画面，头发、手臂、衣服、位置都不能跳；若出现漂移或位移偏差，须在生成阶段重做或截断重接，严禁跳过自检。此项只管单镜生成对齐，不得以此改写或省略文末【后期合并剪辑与转场执行表】规定的任何转场。');
 }
 return blocks.join('\n\n');
}

const ZERO_DUR_TRANSITIONS=new Set(['direct_cut','cut','continuous','jump_cut','end','match_action','eyeline_match','shot_reverse','parallel_edit','cross_cut','insert_cut','cutaway','reaction_shot','audio_hard_cut','beat_cut','smash_cut']);
const OVERLAP_TRANSITIONS=new Set(['dissolve','superimposition','wipe','wipe_h','wipe_v','slow_dissolve','morph_trans','liquid_morph','pixel_dissolve','particle_dissolve','particle_reform','ink_trans','ink_wipe','cloud_trans','smoke_trans','ripple_trans','water_flow_trans','light_leak_trans','lens_flare_trans','dream_trans','flashback','return_flashback']);
const AUDIO_BRIDGE_TRANSITIONS=new Set(['j_cut','l_cut','sound_bridge','ambient_lead','dialogue_lead','music_lead','music_carryover','sfx_bridge','audio_fade_in','audio_fade_out','audio_crossfade','silence_trans']);
const NO_CAMERA_PROCESS_IDS=new Set([...ZERO_DUR_TRANSITIONS,'fade_in','fade_out','fade','fade_from_black','cut_to_black','black_flash','dip_to_black','white_flash','fade_to_white','iris_out','iris_in','dissolve','superimposition','wipe','wipe_h','wipe_v','slow_dissolve']);

function formatCutStamp(endTime,en=false){
 const sec=Math.max(0,n(endTime));
 if(en)return `${fmt(sec)}s`;
 const m=Math.floor(sec/60),r=sec-m*60,whole=Math.floor(r),frac=Math.abs(r-whole)>=0.05?'.'+Math.round((r-whole)*10):'';
 return `${String(m).padStart(2,'0')}:${String(whole).padStart(2,'0')}${frac}`;
}

function resolveCutMeta(p,i,lang='zh'){
 const s=p.shots[i],next=p.shots[i+1],isLast=i>=p.shots.length-1,en=lang==='en';
 const scA=p.scenes.find(x=>x.id===s?.sceneId),scB=next?p.scenes.find(x=>x.id===next.sceneId):null;
 const isSceneChange=Boolean(scA&&scB&&scA.id!==scB.id);
 const sceneTag=isSceneChange?(en?` | Scene Switch: ${scA.name} -> ${scB.name}`:`｜跨场景：${scA.name} → ${scB.name}`):'';
 const t=isLast?(s?.transition||'end'):(s?.transition||(p.chainLastFrame&&!isSceneChange?'continuous':'cut'));
 const tOption=options(p,'transition').find(o=>o.id===t)||GROUPS.transition.options[isLast?20:1];
 const labelStr=tOption?.label||label(p,'transition',t);
 const shortName=labelStr.replace(/[（(][^）)]*[）)]/g,'').trim()||labelStr;
 const desc=cleanVal((en?tOption?.en:tOption?.zh||'').replace(/^[^：:]+[：:]/,''));
 const sp=s?.transitionSpec||{};
 const hasCustomText=Object.entries(sp).some(([k,v])=>k!=='duration'&&typeof v==='string'&&v.trim());
 const rawDur=sp.duration;
 const hasExplicitDur=rawDur!==''&&rawDur!==undefined&&rawDur!==null&&Number.isFinite(Number(rawDur))&&Number(rawDur)>=0&&(!ZERO_DUR_TRANSITIONS.has(t)||hasCustomText||Number(rawDur)!==0.4);
 const dur=hasExplicitDur?Number(rawDur):(tOption?.dur??0);
 const half=Number((dur/2).toFixed(2));
 const total=totalDuration(p)||n(p.targetDuration);
 let overlap=0,mergeRule='',glossaryRule='';
 const customProc=cleanVal(sp.process);
 const customNote=(dur>0||tOption?.cat==='camera')&&customProc&&customProc!==desc?customProc:'';
 const GLOSSARY_OVERRIDES={
  fade_out:'当前镜头末尾画面逐渐压暗至纯黑（单镜末尾渐黑收束，严禁与「叠化」混用）',
  fade:'当前镜头结尾逐渐变暗进入纯黑屏（单镜自身渐暗至黑，非叠化）',
  fade_in:'下一镜头开头画面从纯黑屏逐渐显现（非叠化）',
  fade_from_black:'从纯黑屏逐渐显现下一镜头画面（非叠化）',
  black_flash:'切点瞬间插入极短黑帧过渡（前半时长入黑、后半时长出黑，非前后画面半透明叠化）',
  dip_to_black:'切点短暂压暗至纯黑后显出下一镜头（黑场过渡，非两镜画面叠化）',
  dissolve:'前后两镜画面渐隐/渐显交叠混合；需消耗双端预留素材做重叠，保证成片总长不变',
  slow_dissolve:'前后两镜长时平滑交叠混合；需消耗双端预留素材做重叠，保证成片总长不变',
  cut:'前后两镜零时长直接硬切拼接，无渐隐、无黑场、无画面重叠',
  direct_cut:'前后两镜零时长直接切换，无过渡效果、无画面重叠',
  continuous:'零时长直接承接（前镜尾帧直连后镜首帧），不叠加叠化或转场特效'
 };
 glossaryRule=en?`${labelStr}: ${desc}`:`${labelStr}：${GLOSSARY_OVERRIDES[t]||desc}`;
 if(dur<=0||ZERO_DUR_TRANSITIONS.has(t)&&!hasExplicitDur){
  if(t==='continuous'){
   mergeRule=en?`Unconditional direct relay (0s, no dissolve): join Shot ${i+1} final frame directly to Shot ${i+2} first frame`:`无条件零时长直拼承接（0 秒，不叠化、不加滤镜，直接以第 ${i+1} 镜尾帧对接第 ${i+2} 镜首帧）`;
  }else if(isLast&&t==='end'){
   mergeRule=en?`Hold Shot ${i+1} final frame cleanly to end (0s)`:`第 ${i+1} 镜结尾稳定定格收尾（0 秒额外过渡）`;
  }else{
   mergeRule=en?`Unconditional hard cut (0s, no overlap or fade)`:`无条件零时长直接切换（0 秒，无重叠、无黑场、无叠化）`;
  }
 }else if(t==='fade_out'){
  mergeRule=en?`Fade last ${fmt(dur)}s of Shot ${i+1} to black (NOT a dissolve); keep runtime ${fmt(total)}s`:`第 ${i+1} 镜结尾最后 ${fmt(dur)} 秒画面渐暗至纯黑（非叠化；单镜尾端自行渐暗完成，成片总时长保持 ${fmt(total)} 秒不变）`;
 }else if(t==='fade'){
  mergeRule=en?`Fade last ${fmt(dur)}s of Shot ${i+1} to full black before Shot ${i+2} (NOT a dissolve)`:`第 ${i+1} 镜结尾最后 ${fmt(dur)} 秒渐暗至全黑屏后再切入第 ${i+2} 镜（非叠化）`;
 }else if(t==='fade_in'||t==='fade_from_black'){
  mergeRule=en?`Fade in Shot ${i+2} from black over its first ${fmt(dur)}s (NOT a dissolve)`:`第 ${i+2} 镜开头前 ${fmt(dur)} 秒从纯黑屏逐渐显现（非叠化）`;
 }else if(t==='cut_to_black'){
  mergeRule=en?`Insert ${fmt(dur)}s solid black frame at cut (NOT a dissolve)`:`切点处瞬切 ${fmt(dur)} 秒纯黑帧后切入第 ${i+2} 镜（非叠化）`;
 }else if(t==='black_flash'){
  mergeRule=en?`Black flash (${fmt(half)}s to black + ${fmt(half)}s from black = ${fmt(dur)}s, NOT a dissolve)`:`切点插播闪黑（${fmt(half)} 秒压暗至黑 + ${fmt(half)} 秒从黑显现，共 ${fmt(dur)} 秒，非两镜叠化）`;
 }else if(t==='dip_to_black'){
  mergeRule=en?`Dip to black (${fmt(half)}s fade out + ${fmt(half)}s fade in = ${fmt(dur)}s, NOT a dissolve)`:`切点压黑过渡（前镜尾 ${fmt(half)} 秒渐黑 + 后镜首 ${fmt(half)} 秒显现，共 ${fmt(dur)} 秒，非两镜叠化）`;
 }else if(t==='white_flash'||t==='fade_to_white'){
  mergeRule=en?`White flash/fade over ${fmt(dur)}s (NOT a cross-dissolve)`:`切点处${shortName} ${fmt(dur)} 秒（纯白光过渡，非两镜叠化）`;
 }else if(t==='iris_out'||t==='iris_in'){
  mergeRule=en?`Circular iris mask transition over ${fmt(dur)}s`:`切点处执行${shortName}圆形遮罩过渡 ${fmt(dur)} 秒`;
 }else if(AUDIO_BRIDGE_TRANSITIONS.has(t)||tOption?.cat==='audio'){
  mergeRule=en?`Picture cuts hard at timestamp; audio track leads/lags by ${fmt(dur)}s (${desc}) — total picture runtime unchanged`:`画面按切点时间对齐切换，音频轨错位淡入/延后交叠 ${fmt(dur)} 秒（${desc}），视频总时长保持不变`;
 }else if(t==='lightning_trans'){
  mergeRule=en?`Instant lightning flash over ${fmt(dur)}s at cut`:`切点处叠加 ${fmt(dur)} 秒闪电强光切换，成片总长保持不变`;
 }else{
  overlap=dur;
  if(OVERLAP_TRANSITIONS.has(t)||tOption?.cat==='vfx'){
   mergeRule=en
    ?`Overlap outgoing tail and incoming head by ${fmt(dur)}s (reserve ${fmt(half)}s tail on Shot ${i+1} + ${fmt(half)}s head on Shot ${i+2} so final duration stays ${fmt(total)}s)`
    :`前后两镜画面交叠 ${fmt(dur)} 秒：第 ${i+1} 镜尾多留 ${fmt(half)} 秒、第 ${i+2} 镜首多留 ${fmt(half)} 秒素材用于重叠混合（共预留 ${fmt(dur)} 秒重叠余量），成片总时长保持 ${fmt(total)} 秒不变`;
  }else{
   mergeRule=en
    ?`Apply ${fmt(dur)}s post-merge ${shortName} bridge (reserve ${fmt(half)}s tail/head buffer so final duration stays ${fmt(total)}s)`
    :`合并时在第 ${i+1} 镜尾与第 ${i+2} 镜首之间执行 ${fmt(dur)} 秒${shortName}动态桥接（两端各多留 ${fmt(half)} 秒冗余素材供速度/模糊对齐，成片总时长保持 ${fmt(total)} 秒不变）`;
  }
 }
 return {index:i,isLast,t,tOption,label:labelStr,shortName,cat:tOption?.cat||'basic',dur,half,overlap,mergeRule,glossaryRule,isSceneChange,scA,scB,sceneTag,customNote};
}

export function buildTransitionSpec(p,i){
 const s=p.shots[i],next=p.shots[i+1];if(!s||!next)return null;
 const meta=resolveCutMeta(p,i,'zh');
 const sp=s.transitionSpec||{},tOption=meta.tOption;
 const charsA=p.characters.filter(c=>s.characterIds?.includes(c.id)),charsB=p.characters.filter(c=>next.characterIds?.includes(c.id));
 const sharedChars=charsA.filter(c=>charsB.some(b=>b.id===c.id));
 const lastSeg=s.segments?.length?s.segments[s.segments.length-1]:null;
 const camA=camera(p,s),camB=camera(p,next);
 const desc=cleanVal(tOption.zh.replace(/^[^：:]+[：:]/,''));
 const zeroCut=meta.dur<=0||NO_CAMERA_PROCESS_IDS.has(meta.t);
 return {
  type:meta.label,
  fromFrame:cleanVal(sp.fromFrame)||`${meta.scA?`[${meta.scA.name}] `:''}${cleanVal(s.endState)||cleanVal(lastSeg?.action)||cleanVal(s.action)||'本镜末尾画面定格状态'}`,
  trigger:cleanVal(sp.trigger)||(lastSeg?.action?`第 ${fmt(lastSeg.start)}–${fmt(lastSeg.end)} 秒末尾动作完成瞬间到达切点`:`第 ${fmt(s.duration)} 秒本镜收尾到达切点`),
  process:cleanVal(sp.process)||(zeroCut?desc:`${desc}${meta.isSceneChange?`（后期合并时完成「${meta.scA.name}」→「${meta.scB.name}」切换）`:''}`),
  direction:cleanVal(sp.direction)||tOption.dir||'按后期剪辑切点执行',
  duration:meta.dur,
  toFrame:cleanVal(sp.toFrame)||`${meta.scB?`[${meta.scB.name}] `:''}${cleanVal(next.startState)||cleanVal(startState(p,i+1))||cleanVal(next.action)||'下一镜开场初始状态'}`,
  motionContinuity:cleanVal(sp.motionContinuity)||`前镜（${label(p,'move',camA.move)}，${label(p,'speed',camA.speed)}）与后镜（${label(p,'move',camB.move)}，${label(p,'speed',camB.speed)}）各按自身运镜生成，切点处由后期按转场表衔接`,
  audioBridge:cleanVal(sp.audioBridge)||(tOption.cat==='audio'?desc:meta.isSceneChange?`前镜「${meta.scA.name}」环境音平稳淡出，后镜「${meta.scB.name}」环境音${s.music&&s.music!=='无背景音乐'?'与连续配乐':''}交叉淡化切入`:`环境底声与${s.music&&s.music!=='无背景音乐'?`配乐（${cleanVal(s.music)}）`:'同期声效'}跨切点平滑延续`),
  continuityLock:cleanVal(sp.continuityLock)||[sharedChars.length?`${sharedChars.map(c=>c.name).join('、')}的面貌、发型、服装与配饰跨镜头严格锁定一致`:'出场人物身份、服装与道具状态保持一致',meta.isSceneChange?`场景空间由「${meta.scA.name}」切换至「${meta.scB.name}」，严禁旧场景背景残留`:`「${meta.scA?.name||'当前场景'}」空间陈设、方位与主光方向保持一致`].join('；')
 };
}

export function autoTransitionSpec(p,i,{pickTransition=false}={}){
 const s=p.shots[i],next=p.shots[i+1];if(!s||!next)return null;
 const scA=p.scenes.find(x=>x.id===s.sceneId),scB=p.scenes.find(x=>x.id===next.sceneId);
 const isSceneChange=Boolean(scA&&scB&&scA.id!==scB.id);
 const camA=camera(p,s);
 if(pickTransition&&(!s.transition||s.transition==='cut')){
  if(p.chainLastFrame&&!isSceneChange)s.transition='continuous';
  else if(isSceneChange){
   if(camA.move==='push')s.transition='push_in_trans';
   else if(camA.move==='pull')s.transition='pull_out_trans';
   else if(camA.move==='whip'||camA.move==='pan')s.transition='whip_pan';
   else if(camA.move==='orbit')s.transition='orbit_trans';
   else if(camA.move==='track'||camA.move==='follow')s.transition='occlusion_trans';
   else s.transition='dissolve';
  }else if(camA.move==='push')s.transition='match_action';
 }
 s.transitionSpec=transitionSpecDefaults();
 const built=buildTransitionSpec(p,i);
 if(built){
  const {type:_ignore,...rest}=built;
  s.transitionSpec=rest;
 }
 return s.transitionSpec;
}

export function transitionLine(p,i,endTime,lang='zh'){
 const s=p.shots[i];if(!s)return '';
 const en=lang==='en',isLast=i>=p.shots.length-1;
 if(p.fromScratch&&p.shots.length<=1&&!s.transition)return '';
 if(isLast&&p.fromScratch&&!s.transition)return '';
 const stamp=formatCutStamp(endTime,en);
 const meta=resolveCutMeta(p,i,lang);
 if(isLast){
  return en
   ?`-- END OF SHOT ${i+1} (${stamp}): Hold final frame steadily; execute closing edit "${meta.label} (${fmt(meta.dur)}s)" per the Editing Table below --`
   :`—— 全片收尾（${stamp}）：单镜末尾稳定收束；后期收尾执行「${meta.label}（${fmt(meta.dur)} 秒）」见文末执行表 ——`;
 }
 return p.chainLastFrame
  ?(en
   ?`-- CUT ${stamp} (Shot ${i+1} -> Shot ${i+2}${meta.sceneTag}): Export final frame cleanly as input for Shot ${i+2} (no in-shot transition); merge step unconditionally executes "${meta.label} (${fmt(meta.dur)}s)" per Editing Table --`
   :`—— 切点 ${stamp}（第 ${i+1} 镜 → 第 ${i+2} 镜${meta.sceneTag}）：单镜生成仅需稳定保留尾帧作第 ${i+2} 镜输入首帧，不在单镜内做转场；合并时无条件执行「${meta.label}（${fmt(meta.dur)} 秒）」见文末执行表 ——`)
  :(en
   ?`-- CUT ${stamp} (Shot ${i+1} -> Shot ${i+2}${meta.sceneTag}): Do not bake transitions into single-shot generation; merge step unconditionally executes "${meta.label} (${fmt(meta.dur)}s)" per Editing Table --`
   :`—— 切点 ${stamp}（第 ${i+1} 镜 → 第 ${i+2} 镜${meta.sceneTag}）：单镜内不生成转场；后期合并时无条件执行「${meta.label}（${fmt(meta.dur)} 秒）」见文末执行表 ——`);
}

export function singleShotEditingNote(p,i,lang='zh'){
 const s=p.shots[i];if(!s)return '';
 if(p.fromScratch&&p.shots.length<=1&&!s.transition)return '';
 const t=timeline(p)[i];if(!t)return '';
 const meta=resolveCutMeta(p,i,lang),stamp=formatCutStamp(t.end,lang==='en');
 if(lang==='en'){
  return [
   'POST-PRODUCTION MERGE MEMO (do NOT render transitions inside this single video clip):',
   `· Cut point ${stamp} (${meta.isLast?'End of Sequence':`Shot ${i+1} -> Shot ${i+2}`}${meta.sceneTag}): ${meta.label} (${fmt(meta.dur)}s) — ${meta.mergeRule}.`
  ].join('\n');
 }
 return [
  '【本镜后期剪辑备忘（转场仅在合并剪辑时执行，严禁直接生成在本镜视频画面内）】',
  `· ${stamp}｜${meta.isLast?`第 ${i+1} 镜 → 全片收尾`:`第 ${i+1} 镜 → 第 ${i+2} 镜${meta.sceneTag}`}｜剪辑转场：${meta.label}｜时长：${fmt(meta.dur)} 秒｜${meta.mergeRule}${meta.customNote?`｜备注：${meta.customNote}`:''}`
 ].join('\n');
}

export function editingTransitionTable(p,lang='zh'){
 if(!p.shots.length)return '';
 if(p.fromScratch&&p.shots.length<=1&&!p.shots[0]?.transition)return '';
 const en=lang==='en',times=timeline(p),total=totalDuration(p)||n(p.targetDuration);
 const rows=[],glossary=new Map();
 p.shots.forEach((s,i)=>{
  const meta=resolveCutMeta(p,i,lang);
  if(meta.isLast&&p.fromScratch&&!s.transition&&p.shots.length>1){
   // Keep closing row explicit even in fromScratch multi-shot sequences using default End Hold
  }
  const stamp=formatCutStamp(times[i]?.end??n(s.duration),en);
  if(!glossary.has(meta.t))glossary.set(meta.t,meta.glossaryRule);
  const scope=meta.isLast
   ?(en?`Shot ${i+1} -> End`:`第 ${i+1} 镜 → 全片收尾`)
   :(en?`Shot ${i+1} -> Shot ${i+2}${meta.sceneTag}`:`第 ${i+1} 镜 → 第 ${i+2} 镜${meta.sceneTag}`);
  const rowLine=en
   ?`${i+1}. ${stamp} | ${scope} | Transition: ${meta.label} | Duration: ${fmt(meta.dur)}s | Execution & Budget: ${meta.mergeRule}${meta.customNote?` | Note: ${meta.customNote}`:''}`
   :`${i+1}. ${stamp}｜${scope}｜转场：${meta.label}｜时长：${fmt(meta.dur)} 秒｜操作与时长账：${meta.mergeRule}${meta.customNote?`｜备注：${meta.customNote}`:''}`;
  rows.push({line:rowLine,meta});
 });
 if(!rows.length)return '';
 const overlapRows=rows.filter(r=>r.meta.overlap>0);
 const totalOverlap=overlapRows.reduce((sum,r)=>sum+r.meta.overlap,0);
 if(en){
  return [
   'EDITING & TRANSITION EXECUTION TABLE (Post-production merge actions only — NOT in-shot camera motion):',
   'MANDATORY RULE: Apply every cut point in the table below unconditionally when assembling the film, regardless of whether adjacent frames match. Never downgrade specified transitions to all hard cuts.',
   'TERM DEFINITIONS (matching UI labels verbatim):',
   ...[...glossary.values()].map(x=>`· ${x}`),
   'CUT-POINT SCHEDULE (execute unconditionally row by row):',
   ...rows.map(r=>r.line),
   overlapRows.length
    ?`FOOTAGE BUDGET: ${overlapRows.length} cut(s) require clip overlap totaling ${fmt(totalOverlap)}s; reserve tail/head handles (each clip's planned generationDuration already includes +2s trim margin) so final assembled runtime remains ${fmt(total)}s.`
    :`FOOTAGE BUDGET: Zero clip-overlap transitions in this edit; final assembled runtime stays exactly ${fmt(total)}s (still recommended to keep +1–2s generation tail margin for clean trimming).`
  ].join('\n');
 }
 return [
  '【后期合并剪辑与转场执行表】（以下均为合并成片时的后期剪辑动作，严禁视为单镜生成时的机位运镜）',
  '执行铁律：合并成片时，以下每个切点都必须无条件严格执行指定转场与时长；不论前后两帧画面是否一致，均不得擅自删改或全片退回硬切。',
  '术语定义（与工作台界面原词一一对应，严禁混译替换）：',
  ...[...glossary.values()].map(x=>`· ${x}`),
  '切点清单（无条件逐行执行）：',
  ...rows.map(r=>r.line),
  overlapRows.length
   ?`素材余量总账：本片共有 ${overlapRows.length} 处需交叠或桥接余量的切点（累计需重叠/桥接素材 ${fmt(totalOverlap)} 秒）；所涉镜头尾/首须按上述说明多留素材用于重叠（工作台默认每镜计划生成时长已多留 +2 秒余量），合并叠加后成片总时长严格保持 ${fmt(total)} 秒不变。`
   :`素材余量总账：本片所有切点均为零重叠直切、音轨错位切或单镜端内黑场渐隐/闪切，不消耗额外画面交叠长度，成片总时长严格保持 ${fmt(total)} 秒不变（单镜生成仍建议保留 +1–2 秒尾帧裁切余量）。`
 ].join('\n');
}

export function autoSegmentsForShot(s){
 const dur=Math.max(1,n(s.duration)||4),steps=dur<=6&&Number.isInteger(dur)?dur:Math.min(6,Math.max(3,Math.round(dur/1.5)));
 const act=(s.action||'完成本镜规定动作').replace(/\n+/g,'；'),end=s.endState||'停稳定格并保持末尾视线与持物姿态';
 const out=[];
 for(let i=0;i<steps;i++){
  const st=Number(((dur*i)/steps).toFixed(1)),ed=i===steps-1?dur:Number(((dur*(i+1))/steps).toFixed(1));
  let a='',perf='',cam='保持机位稳定过渡';
  if(i===0){a='保持起始静止姿态与空间站位，进入触发前蓄势';perf='呼吸平稳，目光停留在起点目标';cam='起始构图确立';}
  else if(i===steps-1){a=`收束动作至结尾定格状态：${end}`;perf='完成情绪落点，稳住表情与持物手势不松脱';cam='到达终点构图后定格稳住';}
  else if(i===1){a=`主体动作启动：${act}`;perf='眼神与呼吸先于身体做出微反应';}
  else{a='动作持续推进，细化眼神转向与手部控制细节';perf='保持头部与肩背克制节奏，避免机械突然转向';}
  out.push({id:uid(),start:st,end:ed,action:a,performance:perf,cameraBeat:cam,audio:i===steps-1&&s.dialogue?'对白收尾留白':'',transition:''});
 }
 return out;
}

export function autoSoundCuesForShot(p,s){
 const sc=p.scenes.find(x=>x.id===s.sceneId),dur=n(s.duration)||4,cues=[],effMusic=effectiveMusicCue(p,s);
 if(sc?.sound)cues.push({start:0,end:dur,kind:'ambience',cue:sc.sound});
 if(s.audio)cues.push({start:Number(Math.min(dur*0.25,Math.max(0.2,dur-0.5)).toFixed(1)),end:Number(Math.min(dur,dur*0.65).toFixed(1)),kind:'sfx',cue:s.audio});
 if(effMusic)cues.push({start:Number(Math.min(dur*0.35,dur).toFixed(1)),end:dur,kind:'music',cue:effMusic});
 if(s.dialogue){const sp=p.characters.find(c=>c.id===s.speakerId);cues.push({start:n(s.dialogueStart),end:n(s.dialogueEnd),kind:'dialogue',cue:`${sp?.name||'说话者'}对白“${s.dialogue}”（严格控制口型同步）`});}
 return cues.sort((a,b)=>a.start-b.start);
}

export function suggestProjectNegativeIds(p){
 const ids=new Set(['identity','wardrobe','skin','hands','limbs','flicker','warp','text','watermark','no_cut','no_cam_spin','no_bg_shift']);
 if(p.props?.length||p.shots?.some(s=>s.propId)){ids.add('props');ids.add('prop_hand_swap');ids.add('prop_deform');}
 if(p.shots?.some(s=>s.dialogue)){ids.add('sync');ids.add('dialogue');ids.add('music');}
 if(p.shots?.some(s=>camera(p,s).stability!=='handheld'))ids.add('shake');
 return [...ids];
}

export function suggestShotNegatives(p,s){
 const risks=['禁止未授权的镜内切镜与画面跳变','禁止摄影机无故旋转或视角突跳','禁止人物面部过度磨皮失去皮肤纹理与眼神光'];
 const c=camera(p,s);
 if(c.zoom==='none'||['push','pull'].includes(c.move))risks.push('禁止用突然光学变焦替代物理机位运动');
 if(c.stability!=='handheld')risks.push('禁止无意的手持抖动与背景物体、桌椅门窗突然移位');
 if(s.characterIds?.length)risks.push('禁止人物五官身份漂移、未经交代换装、多余/缺失手指及肢体穿模');
 const prop=p.props.find(x=>x.id===s.propId);
 if(prop)risks.push(`禁止道具“${prop.name}”突然消失、融化变形或左右手互换`);
 if(s.dialogue)risks.push('禁止口型与对白节奏错位、音画断裂及自动生成多余字幕');
 return risks.join('；');
}

export function autoEnrichShot(p,i){
 const s=p.shots[i];if(!s)return s;
 const sc=p.scenes.find(x=>x.id===s.sceneId),chars=p.characters.filter(c=>s.characterIds.includes(c.id)),c=camera(p,s),prop=p.props.find(x=>x.id===s.propId);
 const names=chars.map(x=>x.name).join('与')||'主体人物',scName=sc?.name||'当前场景';
 const ratio=aspect(p).split(':').map(Number),portrait=ratio.length===2&&ratio[0]<ratio[1];
 const frameTag=portrait?'竖屏构图':'横幅构图';
 if(!cleanVal(s.intent)){
  const moveLabel=label(p,'move',c.move),framingLabel=label(p,'framing',c.framing);
  s.intent=`以${framingLabel}配合${moveLabel}聚焦${names}在${scName}中的核心动作与微表情反应，强化叙事节奏与情绪递进。`;
 }
 if(!cleanVal(s.spatial)){
  s.spatial=`${frameTag}：${names}位于${scName}${sc?.entrance?'（'+cleanVal(sc.entrance)+'）':''}，主体处于三分线视觉重心，视线朝向画内交互目标或画外触发方向，严格禁止直视摄影机。`;
 }else{
  s.spatial=alignSpatialToAspect(p,s.spatial);
 }
 if(i===0&&!cleanVal(s.startState)){
  s.startState=`${names}位于${scName}起始位置，姿态稳定${prop?`，持有${prop.name}`:''}。`;
 }
 if(!cleanVal(s.endState)){
  s.endState=`${names}完成本镜动作后保持末尾姿态与视线落点稳定，为下一镜衔接留出干净落幅。`;
 }
 if(!s.segments?.length)s.segments=autoSegmentsForShot(s);
 if(c.move&&c.move!=='fixed'){
  s.segments.forEach(seg=>{if(seg.cameraBeat)seg.cameraBeat=seg.cameraBeat.replace(/固定机位/g,'起幅稳住构图');});
 }
 s.acting??={eyes:'',brows:'',lips:'',breathing:'',head:'',posture:''};
 if(!Object.values(s.acting).some(v=>cleanVal(v))){
  s.acting={
   eyes:'目光聚焦于交互目标，随情境变化自然流转',
   brows:'眉眼随情绪微幅收放，避免僵硬',
   lips:s.dialogue?'说话期间唇形与字音节奏自然同步':'双唇自然闭合，下颌放松',
   breathing:'呼吸节奏贴合动作起伏',
   head:'头部仅作受控小幅联动，不突兀甩头',
   posture:'肩背自然舒展，肢体重心稳定'
  };
 }
 if(!s.soundCues?.length)s.soundCues=autoSoundCuesForShot(p,s);
 if(!cleanVal(s.negativeNotes))s.negativeNotes=suggestShotNegatives(p,s);
 if(!s.transition)s.transition=p.chainLastFrame&&i<p.shots.length-1?'continuous':i>=p.shots.length-1?'end':'cut';
 if(i<p.shots.length-1){
  const next=p.shots[i+1],isSceneChange=Boolean(s.sceneId&&next?.sceneId&&s.sceneId!==next.sceneId);
  if(isSceneChange||!['cut','direct_cut','continuous','end'].includes(s.transition)){
   autoTransitionSpec(p,i,{pickTransition:isSceneChange});
  }
 }
 return s;
}

export function cameraText(p,s,lang='zh'){
 const c=camera(p,s),sep=lang==='en'?', ':'，';let text=['framing','angle','composition','lens','move'].map(k=>opt(p,k,c[k],lang));
 if(c.move!=='fixed'&&c.move!=='stationary')text.push(opt(p,'moveDistance',c.moveDistance,lang),opt(p,'speed',c.speed,lang),opt(p,'stability',c.stability,lang));
 else if(c.move==='stationary')text.push(opt(p,'speed',c.speed,lang),opt(p,'stability',c.stability,lang));
 if(c.move==='orbit')text.push(lang==='en'?`${c.direction==='cw'?'clockwise':'counterclockwise'} ${c.orbit} degrees viewed from above; subject ${c.subjectTurn?'turns with the camera':'does not turn with the camera'}`:`俯视图参照${c.direction==='cw'?'顺时针':'逆时针'}${c.orbit}°，人物${c.subjectTurn?'随镜头转身':'身体不随镜头转动'}`);
 if(c.rotation&&c.rotation!=='none')text.push(opt(p,'rotation',c.rotation,lang));
 if(c.zoom&&(c.zoom!=='none'||['push','pull','track','follow'].includes(c.move)))text.push(opt(p,'zoom',c.zoom,lang));
 text.push(opt(p,'focus',c.focus,lang));if(c.focus==='rack')text.push(`${c.focusFrom||'A'} → ${c.focusTo||'B'}`);
 if(c.start)text.push((lang==='en'?'Camera start: ':'起始位置：')+alignSpatialToAspect(p,cleanVal(c.start)));if(c.end)text.push((lang==='en'?'Camera end: ':'结束状态：')+alignSpatialToAspect(p,cleanVal(c.end)));if(n(c.hold)>0)text.push(lang==='en'?`hold endpoint for ${fmt(c.hold)}s`:`终点停留${fmt(c.hold)}秒`);
 return [...new Set(text.filter(Boolean))].join(sep);
}
export function sceneText(p,s,lang='zh'){
 if(!s)return '';
 const en=lang==='en';
 const fg=cleanVal(s.foreground),bg=cleanVal(s.background),dyn=cleanVal(s.dynamics);
 return [
  cleanVal(s.name),
  cleanVal(s.description),
  opt(p,'time',s.time,lang),
  opt(p,'weather',s.weather,lang),
  fg?(en||/^前景/.test(fg)?fg:`前景：${fg}`):'',
  bg?(en||/^(背景|远景)/.test(bg)?bg:`背景：${bg}`):'',
  dyn?(en||/^(环境动态|动态)/.test(dyn)?dyn:`环境动态：${dyn}`):''
 ].filter(Boolean).join(en?', ':'，');
}
export function lightText(p,s,lang='zh'){if(!s)return '';return [opt(p,'lightSource',s.lightSource,lang),opt(p,'lightDirection',s.lightDirection,lang),opt(p,'lightQuality',s.lightQuality,lang),cleanVal(s.lightNote)].filter(Boolean).join(lang==='en'?', ':'，');}
export function styleText(p,lang='zh'){return ['look','medium','genre','color'].map(k=>opt(p,k,p.style[k],lang)).concat(p.style.texture.map(x=>opt(p,'texture',x,lang)),cleanVal(p.style.custom)).filter(Boolean).join(lang==='en'?'; ':'；');}
export function referenceList(p,s,lang='zh'){
 const refs=s?p.references.filter(r=>s.referenceIds.includes(r.id)):p.references;
 if(!refs.length)return lang==='en'?'No reference material selected.':'本段未绑定参考素材。';
 const counts={image:0,video:0,audio:0};return refs.map(r=>{const i=++counts[r.type||'image'];const type={image:'图片',video:'视频',audio:'音频'}[r.type]||'图片';return `@${type}${i} ${r.name}｜${lang==='en'?'Purpose':'用途'}：${r.purpose||'未指定'}｜${lang==='en'?'Controls':'控制'}：${r.controls||'未指定'}｜${lang==='en'?'Excludes':'不采用'}：${r.excludes||'未指定'}｜${r.data?'已上传，需在生成平台自行挂载':'计划素材，尚未上传'}`;}).join('\n');
}
export function framePrompt(p,i,end=false,lang='zh'){
 const s=p.shots[i];if(!s)return '';const sc=p.scenes.find(x=>x.id===s.sceneId),chars=p.characters.filter(c=>s.characterIds.includes(c.id)),state=end?s.endState:startState(p,i);
 const title=lang==='en'?`${end?'END':'START'} FRAME · ${s.title}`:`${end?'尾帧':'首帧'}图片 · ${s.title}`;
 return [title,styleText(p,lang),chars.map(c=>characterText(c,true,lang)).join('；'),sceneText(p,sc,lang),`${lang==='en'?'Visible state':'这一瞬间的可见状态'}：${state||'未填写，请补充静态起止状态。'}`,['framing','angle','composition','lens'].map(k=>opt(p,k,camera(p,s)[k],lang)).join('，'),lightText(p,sc,lang),`${lang==='en'?'Focus':'焦点'}：${opt(p,'focus',camera(p,s).focus,lang)}`,p.subtitles==='none'?(lang==='en'?'No dialogue subtitles or text overlays.':'画面不叠加对白字幕或标题。'):'',p.screenText?`指定画内文字：${p.screenText}`:''].filter(Boolean).join('\n');
}
export function shotPrompt(p,i,{lang=p.language,brief=false,timing=true}={}){
 const s=p.shots[i];if(!s)return '';const sc=p.scenes.find(x=>x.id===s.sceneId),chars=p.characters.filter(c=>s.characterIds.includes(c.id)),absent=p.characters.filter(c=>!s.characterIds.includes(c.id)),t=timeline(p)[i],en=lang==='en',c=camera(p,s);
 const head=timing?`${fmt(t.start)}–${fmt(t.end)}${en?'s':'秒'} · ${s.title}`:`${en?'Shot':'镜头'} ${i+1} · ${s.title}`;
 let lines=[head];
 if(!brief&&s.intent)lines.push(`${en?'DIRECTORIAL INTENT':'【导演意图】'}\n${s.intent}`);
 const absentNote=!en&&chars.length&&absent.length?`（本镜${absent.map(x=>x.name).join('、')}不出场）`:'';
 lines.push(`${en?'Subject':'出场主体'}：${(chars.map(c=>characterText(c,true,lang)).join('；')||'无指定角色 / 空镜')+absentNote}`,`${en?'Setting':'场景'}：${sceneText(p,sc,lang)}`);
 if(s.spatial)lines.push(`${en?'Spatial blocking':'空间与视线'}：${alignSpatialToAspect(p,s.spatial)}`);
 lines.push(`${en?'Start state':'起始状态'}：${startState(p,i)||'未填写'}`);
 if(brief)lines.push(`${en?'Camera':'摄影'}：${opt(p,'framing',c.framing,lang)}，${opt(p,'move',c.move,lang)}`);
 if(!brief)lines.push(`${en?'Camera':'摄影'}：${cameraText(p,s,lang)}`,`${en?'Lighting':'光影'}：${lightText(p,sc,lang)}`);
 const segs=effectiveSegments(s);
 if(!brief&&s.segments.length)lines.push(en?'IN-SHOT TIMELINE':'【镜内时间轴】');
 segs.forEach((seg,segIdx)=>{
  const time=s.segments.length?`[${fmt(seg.start)}–${fmt(seg.end)}${en?'s':'秒'}] `:'';
  const camBeat=seg.cameraBeat&&c.move&&c.move!=='fixed'?seg.cameraBeat.replace(/固定机位/g,'起幅稳住构图'):seg.cameraBeat;
  const segTrans=seg.transition&&segIdx<segs.length-1?`${en?'In-Shot Segment Cue: ':'段尾转场（仅限镜内节拍）：'}${label(p,'transition',seg.transition)}`:'';
  const meta=!brief?[seg.performance?(en?'Acting: ':'表演：')+seg.performance:'',camBeat?(en?'Cam: ':'机位：')+camBeat:'',segTrans].filter(Boolean).join('｜'):'';
  lines.push(`${time}${seg.action||s.action||'请填写本段动作。'}${meta?'（'+meta+'）':''}`);
  if(seg.dialogue)lines.push(`${time}${en?'Dialogue':'对白'}：${seg.dialogue}`);
  if(seg.audio)lines.push(`${time}${en?'Sound':'声音'}：${seg.audio}`);
 });
 if(!brief)lines.push(actingLines(p,s,lang));
 if(s.dialogue){const speaker=p.characters.find(c=>c.id===s.speakerId);lines.push(`[${fmt(s.dialogueStart)}–${fmt(s.dialogueEnd)}${en?'s':'秒'}] ${speaker?.name||'未指定说话者'}（${s.dialogueLanguage}，${s.voiceType==='off'?'画外':s.voiceType==='vo'?'旁白':'画内'}，${speaker?.voice||'自然声线'}${s.delivery?'，'+s.delivery:''}；严控口型与字音同步）：“${s.dialogue}”`);}
 if(!brief)lines.push(...soundTimelineLines(p,s,sc,lang));
 lines.push(`${en?'End state':'结束状态'}：${s.endState||'未填写'}`);
 if(!brief)lines.push(...continuityLockLines(p,s,i,lang));
 else{const prop=p.props.find(x=>x.id===s.propId);if(prop&&s.handEnd!=='unknown')lines.push(`${en?'Prop continuity':'道具连续性'}：${prop.name}，${prop.appearance}；${handLabel(startHand(p,i),lang)} → ${handLabel(s.handEnd,lang)}${s.propEnd?'，'+s.propEnd:''}`);}
 if(!brief||timing)lines.push(transitionLine(p,i,t.end,lang));
 if(s.referenceIds.length&&!brief)lines.push(referenceList(p,s,lang));
 return lines.filter(Boolean).join('\n');
}
function generateBody(p,selected=0,mode=p.output,lang=p.language){
 if(p.mode==='commerce')return commercePrompt(p);
 if(p.fromScratch)return sparsePrompt(p,selected,mode,opt,cameraText,characterText,sceneText,startState,{continuityLockLines,transitionLine,editingTransitionTable,singleShotEditingNote,label,timeline,actingLines,soundTimelineLines,chainDirective,alignSpatialToAspect,cleanVal,bgmText});
 const en=lang==='en',timing=p.timingOutput!=='shots',chain=chainDirective(p,lang),bgm=bgmText(p,lang),editTable=editingTransitionTable(p,lang);
 if(mode==='first'||mode==='last')return framePrompt(p,selected,mode==='last',lang);
 if(mode==='shot')return [chain,styleText(p,lang),bgm,shotPrompt(p,selected,{lang,timing}),singleShotEditingNote(p,selected,lang),p.subtitles==='none'?(en?'No dialogue subtitles or title overlays.':'不叠加对白字幕与标题。'):'',p.screenText?`指定画内文字：${p.screenText}`:'',p.restrictions].filter(Boolean).join('\n\n');
 if(mode==='plan')return ['生成与剪辑计划（秒数为创作计划，需核对平台支持）',...p.shots.map((s,i)=>`${String(i+1).padStart(2,'0')} · ${s.title}｜成片 ${fmt(s.duration)}s｜计划生成 ${fmt(s.generationDuration??n(s.duration)+2)}s｜素材使用 ${fmt(s.trimIn??1)}–${fmt(s.trimOut??n(s.duration)+1)}s`)].join('\n');
 if(mode==='refs')return p.shots.map(s=>`${s.title}\n${referenceList(p,s,lang)}`).join('\n\n');
 if(mode==='table')return [en?'No. | Time | Shot | Purpose | Action | End state | Cut':'镜号 | 时间 | 镜头 | 职责 | 动作 | 结束状态 | 剪辑指令',...timeline(p).map((t,i)=>{const s=p.shots[i],meta=resolveCutMeta(p,i,lang);return `${String(i+1).padStart(2,'0')} | ${fmt(t.start)}–${fmt(t.end)}s | ${s.title} | ${s.purpose} | ${(s.action||'').replace(/\n/g,' ')} | ${s.endState} | ${meta.label} (${fmt(meta.dur)}s)`;})].join('\n');
 if(mode==='sequence')return [chain,bgm,...p.shots.map((s,i)=>shotPrompt(p,i,{lang,timing:false,brief:false})),editTable].filter(Boolean).join('\n\n');
 if(mode==='timeline')return [chain,bgm,...timeline(p).map((t,i)=>shotPrompt(p,i,{lang,timing:true,brief:false})),editTable].filter(Boolean).join('\n\n');
 const sections=[`${p.title}\n${p.logline}`];
 if(chain)sections.push(chain);
 sections.push(`${en?'VISUAL DIRECTION':'全局影像风格'}\n${[styleText(p,lang),bgm].filter(Boolean).join('\n')}`);
 if(mode!=='short')sections.push(`${en?'CHARACTERS':'角色与造型'}\n${p.characters.filter(c=>p.shots.some(s=>s.characterIds.includes(c.id))).map(c=>`${characterText(c,false,lang)}。${c.variant}；${Object.entries(c.locks).filter(([k,v])=>v).map(([k])=>({appearance:'外貌',hair:'发型',outfit:'服装',voice:'声音'}[k])).join('、')}保持一致。`).join('\n')}`);
 sections.push(`${en?'SHOT SEQUENCE':'逐镜安排'}\n${p.shots.map((s,i)=>shotPrompt(p,i,{lang,brief:mode==='short',timing})).join('\n\n')}`);
 if(editTable)sections.push(editTable);
 sections.push(`${en?'FRAME REQUIREMENTS':'画面要求'}\n${p.subtitles==='none'?(en?'No dialogue subtitles or title overlays.':'不叠加对白字幕与标题。'):p.subtitles==='post'?'对白字幕后期添加。':'按指定内容添加字幕。'}${p.screenText?'\n指定画内文字：'+p.screenText:''}\n${p.restrictions}`);
 return sections.join('\n\n');
}
export function promptParameters(p,selected=0,mode=p.output,lang=p.language){
 const image=p.mode==='commerce'?p.commerce?.output==='image':['first','last'].includes(mode);
 const duration=p.mode==='commerce'?Math.max(0,...(p.commerce?.beats||[]).map(b=>n(b.end)))||n(p.targetDuration):mode==='shot'?n(p.shots[selected]?.duration):totalDuration(p)||n(p.targetDuration);
 const dimensions=`${aspect(p)} · ${p.resolution} (${resolution(p)})`;
 return (lang==='en'?'Output requirements: ':'画面规格：')+dimensions+(image?'':` · ${frameRate(p)}fps · ${fmt(duration)}s`);
}
export function generate(p,selected=0,mode=p.output,lang=p.language){
 const body=generateBody(p,selected,mode,lang);
 if(['table','refs','plan'].includes(mode)&&p.mode!=='commerce')return body;
 const negatives=(p.negativePrompts||[]).map(id=>cleanVal(opt(p,'negative',id,lang))).filter(Boolean);
 const shotNegs=p.mode==='commerce'||['first','last'].includes(mode)?[]:mode==='shot'?[cleanVal(p.shots[selected]?.negativeNotes)].filter(Boolean):(p.shots||[]).map((s,i)=>cleanVal(s.negativeNotes)?`镜头${i+1}(${s.title})：${cleanVal(s.negativeNotes)}`:'').filter(Boolean);
 const allNegatives=[...new Set([...negatives,...shotNegs])];
 if(!body.trim()&&!allNegatives.length&&!p.specsChosen)return '';
 return [promptParameters(p,selected,mode,lang),body,allNegatives.length?(lang==='en'?'NEGATIVE PROMPT — avoid: ':'负面提示词 — 避免：')+allNegatives.join('；'):''].filter(Boolean).join('\n\n');
}
export function checkProject(p){
 if(p.mode==='commerce'){const c=p.commerce||commerceDefaults();return c.beats.flatMap((b,i)=>Number(b.end)<=Number(b.start)?[{id:'commerce-'+i,severity:'error',title:'广告分段时间无效',detail:'结束秒数须大于开始秒数。',index:null,field:''}]:[]);}
 const out=[];const add=(severity,title,detail,index=null,field='',fix=null)=>out.push({id:`${index}-${field}-${title}`,severity,title,detail,index,field,fix});
 const t=timeline(p),total=totalDuration(p),diff=total-n(p.targetDuration);
 if(Math.abs(diff)>0.04)add('warning','成片时长与目标不同',`当前 ${fmt(total)} 秒，目标 ${fmt(p.targetDuration)} 秒，相差 ${fmt(Math.abs(diff))} 秒。`,null,'duration','matchTarget');
 if(!/^\d+(\.\d+)?:\d+(\.\d+)?$/.test(aspect(p))||aspect(p).split(':').some(x=>Number(x)<=0))add('error','画幅比例无效','请使用正数比例，例如9:16。');
 if(frameRate(p)<=0||frameRate(p)>240)add('error','帧率无效','请输入0到240之间的帧率。');
 if(!p.shots.length&&!p.fromScratch&&p.mode!=='commerce')add('error','还没有镜头','添加镜头后即可整理提示词。');
 const seen=new Set();p.shots.forEach((s,i)=>{
  if(seen.has(s.id))add('error','镜头标识重复','请重新导入有效项目。',i);seen.add(s.id);
  if(!Number.isFinite(Number(s.duration))||n(s.duration)<=0)add('error','镜头时长必须大于零','修改本镜时长。',i,'duration');
  if(p.timing==='free'&&n(s.manualStart)<0)add('error','起点不能小于零','修改本镜项目时间轴起点。',i,'manualStart');
  if(!s.action.trim()&&!s.segments.some(x=>x.action?.trim()))add('warning','尚未填写动作','说明本镜发生什么，或保留一个明确的观察状态。',i,'action');
  if(!p.scenes.some(x=>x.id===s.sceneId))add('error','场景引用失效','为本镜重新选择场景。',i,'sceneId');
  if(s.characterIds.some(id=>!p.characters.some(c=>c.id===id)))add('error','角色引用失效','为本镜重新选择出场角色。',i,'characterIds');
  if(!startState(p,i)?.trim())add('info','起始状态待补充','首帧需要明确的静态起点。',i,'startState');
  if(!s.endState?.trim())add('warning','结束状态待补充','补充最后位置、姿态或持物，为下一镜衔接。',i,'endState');
  if(s.generationDuration!==undefined&&(n(s.generationDuration)<=0||n(s.trimIn)<0||n(s.trimOut)>n(s.generationDuration)||n(s.trimOut)<=n(s.trimIn)))add('warning','剪辑区间超出素材计划','检查计划生成时长和素材入出点。',i,'generationDuration');
  if(s.trimIn!==undefined&&Math.abs(n(s.trimOut)-n(s.trimIn)-n(s.duration))>0.05)add('info','素材使用时长与成片镜长不同','这是剪辑规划差异，不会自动更改镜头时长。',i,'trimOut');
  const versions=s.characterIds.map(id=>p.characters.find(c=>c.id===id)).filter(Boolean);if(new Set(versions.map(c=>c.identityId||c.id)).size<versions.length)add('warning','同镜选择了同一身份的多个造型','确认是否为有意同框，或只保留本镜对应的造型。',i,'characterIds');
  const c=camera(p,s);
  if(c.lockFrame&&c.move!=='fixed')add('error','完全锁定画面与位移冲突',`本镜同时要求完全锁定画面和“${label(p,'move',c.move)}”。`,i,'camera.move','unlockFrame');
  if((c.lockFrame||c.move==='fixed')&&c.rotation&&c.rotation!=='none')add('error','固定画面与旋转冲突','改为机位不位移后可单独摇摄，或取消额外旋转。',i,'camera.rotation');
  if(['push','pull'].includes(c.move)&&c.zoom&&c.zoom!=='none')add('error','物理位移与光学变焦混用','轨道推进/后拉改变摄影机物理位置，与光学变焦透视不同；请将光学变焦设为“不变焦”，或改选“滑动变焦”。',i,'camera.zoom');
  if(c.focus==='rack'&&(!c.focusFrom||!c.focusTo))add('warning','拉焦目标不完整','填写起点与终点焦点。',i,'camera.focus');
  if(['close','extremeClose'].includes(c.framing)&&/全身|从头到脚|脚部|鞋子|踢腿/.test(s.action))add('warning','景别可能容纳不了动作',`当前${label(p,'framing',c.framing)}，动作要求展示脚部或全身。若镜内改变景别，请在时间段说明。`,i,'camera.framing');
  const prev=p.shots[i-1];if(prev&&s.continuity==='continuous'&&prev.sceneId===s.sceneId&&prev.propId===s.propId&&s.propId&&!s.inheritStart&&prev.handEnd!=='unknown'&&s.handStart!=='unknown'&&prev.handEnd!==s.handStart)add('warning','道具起点与上一镜不一致',`上一镜结束：${handLabel(prev.handEnd)}；本镜起点：${handLabel(s.handStart)}。补充转移，或继承上一镜。`,i,'handStart','inheritStart');
  if(s.dialogue){const estimate=estimateDialogue(s.dialogue,s.speechRate),window=n(s.dialogueEnd)-n(s.dialogueStart);if(!p.characters.some(c=>c.id===s.speakerId))add('error','对白缺少说话者','选择对应角色。',i,'speakerId');if(window<=0||n(s.dialogueStart)<0||n(s.dialogueEnd)>n(s.duration))add('error','对白时间超出本镜','对白区间应在镜头内，结束晚于开始。',i,'dialogueEnd');else if(estimate>window)add('warning','对白可能来不及说完',`文本估计约 ${fmt(estimate)} 秒（${s.speechRate}字/音节每秒并计入标点停顿），当前窗口 ${fmt(window)} 秒；未录音实测。`,i,'dialogue');}
  (s.soundCues||[]).forEach((q,j)=>{if(n(q.start)<0||n(q.end)>n(s.duration)||n(q.end)<n(q.start))add('error','声音时间轴越界',`第 ${j+1} 条声音线索超出 0–${s.duration} 秒范围。`,i,'soundCues');});
  const seg=[...s.segments].sort((a,b)=>n(a.start)-n(b.start));seg.forEach((x,j)=>{if(n(x.start)<0||n(x.end)>n(s.duration)||n(x.end)<=n(x.start))add('error','镜内时间段越界',`第 ${j+1} 段必须位于 0–${s.duration} 秒内。`,i,'segments');if(j&&n(x.start)<n(seg[j-1].end))add('warning','动作时间段存在重叠',`第 ${j} 与 ${j+1} 段重叠；若是同时动作可以保留。`,i,'segments');if(j&&n(x.start)>n(seg[j-1].end)+0.04)add('info','动作时间段之间有留白',`${fmt(seg[j-1].end)}–${fmt(x.start)} 秒未指定动作，可作为停留或补充内容。`,i,'segments');});
  if(n(s.duration)<3&&(seg.length>2||s.action.length>90))add('warning','短镜头内容较密','这是内容量建议，不是固定最短时长限制。可减少独立行动目标或增加生成余量。',i,'action');
  s.referenceIds.forEach(id=>{const r=p.references.find(x=>x.id===id);if(!r)add('error','参考素材引用失效','重新选择参考素材。',i,'referenceIds');else {if(!r.purpose||!r.controls)add('warning','参考素材未指定用途',`“${r.name}”需要填写用途与控制范围。`,i,'referenceIds');if(!r.data)add('info','参考素材仍为计划',`“${r.name}”尚未上传；提交前按挂载清单准备。`,i,'referenceIds');}});
 });
 if(p.timing==='free'){const sorted=[...t].sort((a,b)=>a.start-b.start);sorted.forEach((x,i)=>{if(i&&x.start<sorted[i-1].end-0.04)add('warning','画面镜头存在重叠',`镜头 ${sorted[i-1].index+1} 与 ${x.index+1} 重叠，确认是否为有意转场。`,x.index,'manualStart');if(i&&x.start>sorted[i-1].end+0.04)add('info','项目画面时间轴有缺口',`${fmt(sorted[i-1].end)}–${fmt(x.start)} 秒未安排画面。`,x.index,'manualStart');});}
 if(p.language==='en')add('info','自由文本保留原文','内置词条已使用英文；人物、剧情与对白等自由填写内容未自动翻译。');
 return out.sort((a,b)=>({error:0,warning:1,info:2}[a.severity]-{error:0,warning:1,info:2}[b.severity]));
}
export function validateImport(value){
 const p=value?.project||value;if(!p||typeof p!=='object'||Array.isArray(p))throw Error('不是有效项目对象。');
 if(p.version!==VERSION)throw Error(`暂不支持该项目版本（${p.version??'缺失'}）。`);
 const arrays=['shots','characters','scenes','props','references'];for(const k of arrays){if(!Array.isArray(p[k]))throw Error(`缺少 ${k} 列表。`);if(p[k].length>500)throw Error(`${k} 超过500项。`);const ids=new Set();for(const x of p[k]){if(!x||typeof x.id!=='string'||ids.has(x.id))throw Error(`${k} 中存在缺失或重复标识。`);ids.add(x.id);}}
 const walk=(x,depth=0)=>{if(depth>20)throw Error('数据层级过深。');if(!x||typeof x!=='object')return;for(const k of Object.keys(x)){if(['__proto__','constructor','prototype'].includes(k))throw Error('项目包含不允许的属性。');walk(x[k],depth+1);}};walk(p);validateVideoData(p);validateSavedAIData(p);
 if(typeof p.title!=='string'||!p.style||!p.camera)throw Error('项目基础设置不完整。');
 for(const s of p.shots){if(typeof s.action!=='string'||typeof s.title!=='string'||!Array.isArray(s.characterIds)||!Array.isArray(s.segments)||!Array.isArray(s.referenceIds)||!Array.isArray(s.micro)||!Number.isFinite(Number(s.duration)))throw Error('镜头数据格式不完整。');}
 for(const c of p.characters){if(typeof c.name!=='string'||!c.locks)throw Error('角色格式不完整。');}
 for(const r of p.references){if(r.data&&!/^data:(image\/(png|jpeg|webp|gif)|audio\/[a-z0-9.+-]+|video\/[a-z0-9.+-]+);base64,/i.test(r.data))throw Error('参考素材类型不受支持。');}
 if(!Array.isArray(p.style.texture)||!p.scenes.every(s=>typeof s.name==='string')||!p.shots.every(s=>['startState','endState','dialogue','audio','music','propId','purpose'].every(k=>typeof s[k]==='string')))throw Error('项目字段类型不完整。');
 const q=clone(p);q.negativePrompts??=[];if(!Array.isArray(q.negativePrompts)||!q.negativePrompts.every(x=>typeof x==='string'))throw Error('负面提示词必须为词条列表。');q.chainLastFrame??=false;q.cutFrameCheck??=false;q.bgm={...bgmDefaults(),...(q.bgm&&typeof q.bgm==='object'&&!Array.isArray(q.bgm)?q.bgm:{})};q.scenes.forEach(s=>s.layout??=scene().layout);q.customFormat??='9:16';q.customFps??=24;q.characters.forEach(c=>c.identityId??=c.id);q.shots.forEach(s=>{s.generationDuration??=n(s.duration)+2;s.trimIn??=1;s.trimOut??=n(s.duration)+1;s.soundCues??=[];s.acting??={eyes:'',brows:'',lips:'',breathing:'',head:'',posture:''};s.continuitySpec??={character:'',prop:'',space:'',lighting:'',action:''};s.transitionSpec??=transitionSpecDefaults();s.segments.forEach(seg=>{seg.transition??='';});s.intent??='';s.spatial??='';s.transition??='';s.negativeNotes??='';});try{checkProject(q);generate(q);}catch{throw Error('项目设置结构不完整，请导入镜序导出的JSON。');}return q;
}
export function parseImportText(rawText){
 const cleaned=String(rawText??'').replace(/^\uFEFF/,'').trim();
 if(!cleaned)throw Error('请先选择项目文件或粘贴 JSON 内容。');
 let parsed;
 try{parsed=JSON.parse(cleaned);}catch{throw Error('内容不是有效的 JSON 格式，请选择镜序导出的 .jingxu.json / .json 文件。');}
 const imported=validateImport(parsed);
 imported.id=uid();
 imported.createdAt=Date.now()+1;
 imported.updatedAt=Date.now();
 if(!imported.title.endsWith(' · 导入'))imported.title=(imported.title||'未命名项目')+' · 导入';
 if(imported.aiSuggestion)imported.aiSuggestion.projectId=imported.id;
 return imported;
}
export function csv(p){const rows=[['镜号','开始秒','结束秒','镜头名','职责','动作','起点','终点','对白'],...timeline(p).map((t,i)=>{const s=p.shots[i];return [i+1,t.start,t.end,s.title,s.purpose,s.action,startState(p,i),s.endState,s.dialogue];})];return '\uFEFF'+rows.map(row=>row.map(x=>'"'+String(x??'').replaceAll('"','""')+'"').join(',')).join('\r\n');}
export function splitShot(p,index,at){const s=p.shots[index];if(!s||at<=0||at>=n(s.duration))throw Error('拆分点必须位于镜头内部。');if(s.dialogue||s.segments.length)throw Error('含对白或时间段的镜头，请先手动安排内容归属，再拆镜，避免误改时序。');const second=clone(s);second.id=uid();second.title=s.title+' · 后半';second.duration=n(s.duration)-at;second.manualStart=n(s.manualStart)+at;second.inheritStart=true;second.startState='';s.duration=at;s.endState='待补充拆分点状态';p.shots.splice(index+1,0,second);return second;}
export function mergeShots(p,index){const a=p.shots[index],b=p.shots[index+1];if(!a||!b)throw Error('需要相邻两个镜头。');if(a.sceneId!==b.sceneId)throw Error('不同场景不能直接合镜。');if(a.dialogue||b.dialogue||a.segments.length||b.segments.length)throw Error('含对白或时间段的镜头请先手动整理，避免合镜覆盖原始时序。');const d=n(a.duration);a.segments=[{id:uid(),start:0,end:d,action:a.action,dialogue:'',audio:a.audio,transition:''},{id:uid(),start:d,end:d+n(b.duration),action:b.action,dialogue:'',audio:b.audio,transition:''}];a.action=a.action+'\n'+b.action;a.duration=d+n(b.duration);a.endState=b.endState;a.handEnd=b.handEnd;a.propEnd=b.propEnd;a.characterIds=[...new Set([...a.characterIds,...b.characterIds])];a.referenceIds=[...new Set([...a.referenceIds,...b.referenceIds])];a.title+=' / '+b.title;p.shots.splice(index+1,1);}

export function blankCharacter(name='角色A'){const c=character(name);for(const k of Object.keys(c))if(typeof c[k]==='string'&&!['id','identityId','name'].includes(k))c[k]='';for(const k of Object.keys(c.locks))c.locks[k]=false;return c;}
export function blankScene(){const s=scene('新场景');for(const k of Object.keys(s))if(typeof s[k]==='string'&&!['id','name'].includes(k))s[k]='';return s;}
export function makeBlankProject(){const p=makeProject();p.title='未命名项目';p.templateId='';p.fromScratch=true;p.logline='';p.restrictions='';p.chainLastFrame=false;p.cutFrameCheck=false;p.bgm=bgmDefaults();p.style={look:'',medium:'',genre:'',color:'',texture:[],custom:''};for(const k of ['framing','angle','composition','move','moveDistance','speed','stability','lens','focus','rotation','zoom'])p.camera[k]='';p.camera.hold=0;p.characters=[];p.scenes=[];p.props=[];p.shots=[];p.commerce=commerceDefaults();return p;}
