import {sparsePrompt,commercePrompt,commerceDefaults} from './builder.mjs';
import {GROUPS,TEMPLATES,VERSION} from './catalog.mjs';
export const uid=()=>globalThis.crypto?.randomUUID?.()||`id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
export const clone=x=>structuredClone(x);
export const n=x=>Number.isFinite(Number(x))?Number(x):0;
export const fmt=x=>Number(n(x).toFixed(2)).toString();
export const cameraDefaults=()=>({framing:'medium',angle:'eye',composition:'thirds',move:'push',speed:'slow',stability:'gimbal',lens:'50',focus:'subject',direction:'cw',orbit:90,subjectTurn:false,start:'',end:'',focusFrom:'',focusTo:'',hold:0.5,lockFrame:false,rotation:'none',zoom:'none'});
export function character(name='新角色') {const id=uid();return {id,identityId:id,name,age:'28岁，成年人',gender:'女性',height:'168cm',build:'自然匀称',occupation:'',appearance:'东亚外观',skin:'自然肤色，保留细腻皮肤纹理',face:'鹅蛋脸，轮廓自然',eyes:'深棕色虹膜',brows:'自然平眉',nose:'自然鼻梁',lips:'自然唇形',hair:'齐肩直发，少量碎发',hairColor:'深棕色',makeup:'自然淡妆',outfit:'米白色亚麻衬衫，深色长裤',accessories:'',habits:'右手惯用，姿态自然',voice:'中低音，语速自然，表达克制',language:'普通话',variant:'日常造型',locks:{appearance:true,hair:true,outfit:true,voice:false}};}
export function scene(name='新场景'){return {id:uid(),name,description:'木质步道沿湖延伸，栏杆有自然木纹',foreground:'少量栏杆形成前景',background:'安静湖面与远处树影',entrance:'步道从画面左侧延伸至右侧',dynamics:'微风轻动发丝，湖面泛起细小涟漪',sound:'轻微风声与水声',weather:'clear',time:'sunset',lightSource:'sunset',lightDirection:'back',lightQuality:'soft',lightNote:'高光柔和，面部保留细节',layout:{ax:38,ay:52,bx:67,by:48,cx:47,cy:82,lx:82,ly:20}};}
export function makeShot(p){return {id:uid(),title:`新镜头 ${p.shots.length+1}`,duration:4,manualStart:0,characterIds:p.characters[0]?[p.characters[0].id]:[],sceneId:p.scenes[0]?.id||'',action:'',purpose:'承接反应',inheritStart:p.shots.length>0,startState:'',endState:'',continuity:'continuous',propId:p.props[0]?.id||'',handStart:'unknown',handEnd:'unknown',propStart:'',propEnd:'',camera:{},emotion:'restrained',micro:[],intensity:'自然',dialogue:'',speakerId:p.characters[0]?.id||'',dialogueStart:0,dialogueEnd:4,dialogueLanguage:'普通话',speechRate:4,voiceType:'in',audio:'',music:'无背景音乐',segments:[],referenceIds:[],notes:'',generationDuration:6,trimIn:1,trimOut:5};}
export function makeProject(templateId='lake'){
 const t=TEMPLATES.find(x=>x.id===templateId)||TEMPLATES[0],a=character('林夏'),b=character('周屿');
 b.gender='男性';b.age='30岁，成年人';b.hair='自然短发';b.outfit='深灰色棉质衬衫，黑色长裤';b.voice='低音，自然温和';
 if(['wuxia','fantasy'].includes(templateId)){a.outfit='浅色交领长衫，深色腰带，布鞋';a.hair='深色长发，半束发';a.variant='古装造型';}
 const s=scene(t.scene);s.weather=t.weather;s.time=t.time;
 if(t.theme==='coffee'){s.description='有生活痕迹的木质桌椅，靠窗空间，材质自然';s.foreground='木桌和杯沿';s.background='窗外街道柔和虚化';s.entrance='窗户在左侧，入口在后方';s.dynamics='杯中热气缓慢升起';s.sound='远处街声与轻微室内底声';s.lightSource='window';s.lightDirection='side';}
 if(t.theme==='night'){s.description='潮湿地面，空间向远处延伸，局部暖色实景灯';s.background='远处灯光与阴影';s.dynamics='细雨落下，灯光映在地面';s.sound='雨声与远处交通声';s.lightSource='neon';}
 const p={version:VERSION,id:uid(),title:t.id==='lake'?'未说出口的夏天':t.name,logline:t.desc||'一个人物，一次行动，一次关系的变化。',templateId:t.id,theme:t.theme,mode:'quick',targetDuration:15,timing:'ordered',platform:'通用自然语言',format:'9:16',resolution:'4K',customWidth:2160,customHeight:3840,fps:24,customFormat:'9:16',customFps:24,language:'zh',output:'full',timingOutput:'seconds',subtitles:'none',screenText:'',restrictions:'动作自然，人物身份、发型与所选造型保持一致；不添加未指定人物或对白。',style:{look:'cinema',medium:'35mm',genre:t.genre,color:t.theme==='night'?'cool':'warm',texture:['skin','grain','soft'],intensity:65,custom:''},camera:cameraDefaults(),characters:[a,b],scenes:[s],props:[{id:uid(),name:['wuxia','fantasy'].includes(t.id)?'折叠密信':'折叠信纸',appearance:'米白色纸张，对折，边角略有磨损',ownerId:a.id}],shots:[],references:[],customOptions:{},createdAt:Date.now(),updatedAt:Date.now()};
 t.actions.forEach((action,i)=>{const shot=makeShot(p);Object.assign(shot,{title:t.titles[i],duration:t.durations[i],manualStart:t.durations.slice(0,i).reduce((a,b)=>a+b,0),action,purpose:['交代空间','揭示信息','承接反应'][i],startState:i===0?'林夏站在步道旁，右手握着折叠信纸':'',endState:['人物停下，右手仍握着折叠信纸','人物已回头，视线停在画外，右手仍握着信纸','人物保持站立，右手握信纸，视线停在画外'][i],handStart:'right',handEnd:'right',propStart:'折叠',propEnd:'折叠',camera:{framing:['mediumFull','mediumClose','medium'][i],move:['track','push','fixed'][i]},audio:i===1?'画外一声呼唤“林夏”，随后回到风声与水声':'',emotion:i===2?'hesitate':'restrained'});shot.generationDuration=shot.duration+2;shot.trimOut=shot.duration+1;p.shots.push(shot);});
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
export function characterText(c,short=false,lang='zh'){
 const parts=short?[c.name,c.age,c.face,c.hairColor+' '+c.hair,c.outfit]:[c.name,c.age,c.gender,c.height,c.build,c.occupation,c.appearance,c.skin,c.face,c.eyes,c.brows,c.nose,c.lips,c.hairColor+' '+c.hair,c.makeup,c.outfit,c.accessories,c.habits];
 return parts.filter(x=>String(x||'').trim()).join(lang==='en'?', ':'，');
}
export function cameraText(p,s,lang='zh'){
 const c=camera(p,s),sep=lang==='en'?', ':'，';let text=['framing','angle','composition','lens','move'].map(k=>opt(p,k,c[k],lang));
 if(c.move!=='fixed')text.push(opt(p,'speed',c.speed,lang),opt(p,'stability',c.stability,lang));
 if(c.move==='orbit')text.push(lang==='en'?`${c.direction==='cw'?'clockwise':'counterclockwise'} ${c.orbit} degrees viewed from above; subject ${c.subjectTurn?'turns with the camera':'does not turn with the camera'}`:`俯视图参照${c.direction==='cw'?'顺时针':'逆时针'}${c.orbit}°，人物${c.subjectTurn?'随镜头转身':'身体不随镜头转动'}`);
 if(c.rotation&&c.rotation!=='none')text.push(opt(p,'rotation',c.rotation,lang));if(c.zoom&&c.zoom!=='none')text.push(opt(p,'zoom',c.zoom,lang));text.push(opt(p,'focus',c.focus,lang));if(c.focus==='rack')text.push(`${c.focusFrom||'A'} → ${c.focusTo||'B'}`);
 if(c.start)text.push((lang==='en'?'Camera start: ':'起始位置：')+c.start);if(c.end)text.push((lang==='en'?'Camera end: ':'结束位置：')+c.end);if(n(c.hold)>0)text.push(lang==='en'?`hold endpoint for ${fmt(c.hold)}s`:`终点停留${fmt(c.hold)}秒`);
 return [...new Set(text.filter(Boolean))].join(sep);
}
export function sceneText(p,s,lang='zh'){if(!s)return '';return [s.name,s.description,opt(p,'time',s.time,lang),opt(p,'weather',s.weather,lang),s.foreground,s.background,s.dynamics].filter(Boolean).join(lang==='en'?', ':'，');}
export function lightText(p,s,lang='zh'){if(!s)return '';return [opt(p,'lightSource',s.lightSource,lang),opt(p,'lightDirection',s.lightDirection,lang),opt(p,'lightQuality',s.lightQuality,lang),s.lightNote].filter(Boolean).join(lang==='en'?', ':'，');}
export function styleText(p,lang='zh'){return ['look','medium','genre','color'].map(k=>opt(p,k,p.style[k],lang)).concat(p.style.texture.map(x=>opt(p,'texture',x,lang)),p.style.custom).filter(Boolean).join(lang==='en'?'; ':'；');}
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
 const s=p.shots[i];if(!s)return '';const sc=p.scenes.find(x=>x.id===s.sceneId),chars=p.characters.filter(c=>s.characterIds.includes(c.id)),t=timeline(p)[i],en=lang==='en';
 const head=timing?`${fmt(t.start)}–${fmt(t.end)}${en?'s':'秒'} · ${s.title}`:`${en?'Shot':'镜头'} ${i+1} · ${s.title}`;
 let lines=[head,`${en?'Subject':'出场主体'}：${chars.map(c=>characterText(c,true,lang)).join('；')||'无指定角色 / 空镜'}`,`${en?'Setting':'场景'}：${sceneText(p,sc,lang)}`,`${en?'Start state':'起始状态'}：${startState(p,i)||'未填写'}`];
 if(brief)lines.push(`${en?'Camera':'摄影'}：${opt(p,'framing',camera(p,s).framing,lang)}，${opt(p,'move',camera(p,s).move,lang)}`);
 if(!brief)lines.push(`${en?'Camera':'摄影'}：${cameraText(p,s,lang)}`,`${en?'Lighting':'光影'}：${lightText(p,sc,lang)}`);
 const segs=effectiveSegments(s);segs.forEach(seg=>{const time=s.segments.length?`[${fmt(seg.start)}–${fmt(seg.end)}${en?'s':'秒'}] `:'';lines.push(`${time}${seg.action||s.action||'请填写本段动作。'}`);if(seg.dialogue)lines.push(`${time}${en?'Dialogue':'对白'}：${seg.dialogue}`);if(seg.audio)lines.push(`${time}${en?'Sound':'声音'}：${seg.audio}`);});
 if(!brief)lines.push(`${en?'Performance':'表演'}：${opt(p,'emotion',s.emotion,lang)}${s.micro.length?'；'+s.micro.map(x=>opt(p,'micro',x,lang)).join('；'):''}（${s.intensity}）`);
 if(s.dialogue){const speaker=p.characters.find(c=>c.id===s.speakerId);lines.push(`[${fmt(s.dialogueStart)}–${fmt(s.dialogueEnd)}${en?'s':'秒'}] ${speaker?.name||'未指定说话者'}（${s.dialogueLanguage}，${s.voiceType==='off'?'画外':s.voiceType==='vo'?'旁白':'画内'}，${speaker?.voice||'自然声线'}）：“${s.dialogue}”`);}
 if(!brief)lines.push(`${en?'Sound':'声音'}：${[sc?.sound,s.audio,s.music].filter(Boolean).join('；')||'自然环境底声'}`);
 lines.push(`${en?'End state':'结束状态'}：${s.endState||'未填写'}`);
 const prop=p.props.find(x=>x.id===s.propId);if(prop&&s.handEnd!=='unknown')lines.push(`${en?'Prop continuity':'道具连续性'}：${prop.name}，${prop.appearance}；${handLabel(startHand(p,i),lang)} → ${handLabel(s.handEnd,lang)}${s.propEnd?'，'+s.propEnd:''}`);
 if(s.referenceIds.length&&!brief)lines.push(referenceList(p,s,lang));return lines.filter(Boolean).join('\n');
}
export function generate(p,selected=0,mode=p.output,lang=p.language){
 if(p.mode==='commerce')return commercePrompt(p);
 if(p.fromScratch)return sparsePrompt(p,selected,mode,opt,cameraText,characterText,sceneText,startState);
 const en=lang==='en',timing=p.timingOutput!=='shots';
 if(mode==='first'||mode==='last')return framePrompt(p,selected,mode==='last',lang);
 if(mode==='shot')return [styleText(p,lang),shotPrompt(p,selected,{lang,timing}),p.subtitles==='none'?(en?'No dialogue subtitles or title overlays.':'不叠加对白字幕与标题。'):'',p.screenText?`指定画内文字：${p.screenText}`:'',p.restrictions].filter(Boolean).join('\n\n');
 if(mode==='plan')return ['生成与剪辑计划（秒数为创作计划，需核对平台支持）',...p.shots.map((s,i)=>`${String(i+1).padStart(2,'0')} · ${s.title}｜成片 ${fmt(s.duration)}s｜计划生成 ${fmt(s.generationDuration??n(s.duration)+2)}s｜素材使用 ${fmt(s.trimIn??1)}–${fmt(s.trimOut??n(s.duration)+1)}s`)].join('\n');
 if(mode==='refs')return p.shots.map(s=>`${s.title}\n${referenceList(p,s,lang)}`).join('\n\n');
 if(mode==='table')return [en?'No. | Time | Shot | Purpose | Action | End state':'镜号 | 时间 | 镜头 | 职责 | 动作 | 结束状态',...timeline(p).map((t,i)=>{const s=p.shots[i];return `${String(i+1).padStart(2,'0')} | ${fmt(t.start)}–${fmt(t.end)}s | ${s.title} | ${s.purpose} | ${(s.action||'').replace(/\n/g,' ')} | ${s.endState}`;})].join('\n');
 if(mode==='sequence')return p.shots.map((s,i)=>shotPrompt(p,i,{lang,timing:false,brief:false})).join('\n\n');
 if(mode==='timeline')return timeline(p).map((t,i)=>shotPrompt(p,i,{lang,timing:true,brief:false})).join('\n\n');
 const sections=[`${p.title}\n${p.logline}`,`${en?'VISUAL DIRECTION':'全局影像风格'}\n${styleText(p,lang)}`];
 if(mode!=='short')sections.push(`${en?'CHARACTERS':'角色与造型'}\n${p.characters.filter(c=>p.shots.some(s=>s.characterIds.includes(c.id))).map(c=>`${characterText(c,false,lang)}。${c.variant}；${Object.entries(c.locks).filter(([k,v])=>v).map(([k])=>({appearance:'外貌',hair:'发型',outfit:'服装',voice:'声音'}[k])).join('、')}保持一致。`).join('\n')}`);
 sections.push(`${en?'SHOT SEQUENCE':'逐镜安排'}\n${p.shots.map((s,i)=>shotPrompt(p,i,{lang,brief:mode==='short',timing})).join('\n\n')}`);
 sections.push(`${en?'FRAME REQUIREMENTS':'画面要求'}\n${p.subtitles==='none'?(en?'No dialogue subtitles or title overlays.':'不叠加对白字幕与标题。'):p.subtitles==='post'?'对白字幕后期添加。':'按指定内容添加字幕。'}${p.screenText?'\n指定画内文字：'+p.screenText:''}\n${p.restrictions}`);
 sections.push(`${en?'DELIVERY TARGET / set on the generation platform when supported':'交付目标 / 支持时在生成平台设置'}\n${aspect(p)} · ${p.resolution} (${resolution(p)}) · ${frameRate(p)}fps · ${fmt(totalDuration(p))}s\n${en?'Actual native resolution and timing depend on the generation platform.':'原生画质、时长与精确秒数执行取决于目标平台。'}${p.platform!=='通用自然语言'?'\n'+p.platform+'：当前使用通用自然语言格式，平台能力与素材语法需在提交前核对。':''}`);
 return sections.join('\n\n');
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
  if(c.focus==='rack'&&(!c.focusFrom||!c.focusTo))add('warning','拉焦目标不完整','填写起点与终点焦点。',i,'camera.focus');
  if(['close','extremeClose'].includes(c.framing)&&/全身|从头到脚|脚部|鞋子|踢腿/.test(s.action))add('warning','景别可能容纳不了动作',`当前${label(p,'framing',c.framing)}，动作要求展示脚部或全身。若镜内改变景别，请在时间段说明。`,i,'camera.framing');
  const prev=p.shots[i-1];if(prev&&s.continuity==='continuous'&&prev.sceneId===s.sceneId&&prev.propId===s.propId&&s.propId&&!s.inheritStart&&prev.handEnd!=='unknown'&&s.handStart!=='unknown'&&prev.handEnd!==s.handStart)add('warning','道具起点与上一镜不一致',`上一镜结束：${handLabel(prev.handEnd)}；本镜起点：${handLabel(s.handStart)}。补充转移，或继承上一镜。`,i,'handStart','inheritStart');
  if(s.dialogue){const estimate=estimateDialogue(s.dialogue,s.speechRate),window=n(s.dialogueEnd)-n(s.dialogueStart);if(!p.characters.some(c=>c.id===s.speakerId))add('error','对白缺少说话者','选择对应角色。',i,'speakerId');if(window<=0||n(s.dialogueStart)<0||n(s.dialogueEnd)>n(s.duration))add('error','对白时间超出本镜','对白区间应在镜头内，结束晚于开始。',i,'dialogueEnd');else if(estimate>window)add('warning','对白可能来不及说完',`文本估计约 ${fmt(estimate)} 秒（${s.speechRate}字/音节每秒并计入标点停顿），当前窗口 ${fmt(window)} 秒；未录音实测。`,i,'dialogue');}
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
 const walk=(x,depth=0)=>{if(depth>20)throw Error('数据层级过深。');if(!x||typeof x!=='object')return;for(const k of Object.keys(x)){if(['__proto__','constructor','prototype'].includes(k))throw Error('项目包含不允许的属性。');walk(x[k],depth+1);}};walk(p);
 if(typeof p.title!=='string'||!p.style||!p.camera)throw Error('项目基础设置不完整。');
 for(const s of p.shots){if(typeof s.action!=='string'||typeof s.title!=='string'||!Array.isArray(s.characterIds)||!Array.isArray(s.segments)||!Array.isArray(s.referenceIds)||!Array.isArray(s.micro)||!Number.isFinite(Number(s.duration)))throw Error('镜头数据格式不完整。');}
 for(const c of p.characters){if(typeof c.name!=='string'||!c.locks)throw Error('角色格式不完整。');}
 for(const r of p.references){if(r.data&&!/^data:(image\/(png|jpeg|webp|gif)|audio\/[a-z0-9.+-]+|video\/[a-z0-9.+-]+);base64,/i.test(r.data))throw Error('参考素材类型不受支持。');}
 if(!Array.isArray(p.style.texture)||!p.scenes.every(s=>typeof s.name==='string')||!p.shots.every(s=>['startState','endState','dialogue','audio','music','propId','purpose'].every(k=>typeof s[k]==='string')))throw Error('项目字段类型不完整。');
 const q=clone(p);q.scenes.forEach(s=>s.layout??=scene().layout);q.customFormat??='9:16';q.customFps??=24;q.characters.forEach(c=>c.identityId??=c.id);q.shots.forEach(s=>{s.generationDuration??=n(s.duration)+2;s.trimIn??=1;s.trimOut??=n(s.duration)+1;});try{checkProject(q);generate(q);}catch{throw Error('项目设置结构不完整，请导入镜序导出的JSON。');}return q;
}
export function csv(p){const rows=[['镜号','开始秒','结束秒','镜头名','职责','动作','起点','终点','对白'],...timeline(p).map((t,i)=>{const s=p.shots[i];return [i+1,t.start,t.end,s.title,s.purpose,s.action,startState(p,i),s.endState,s.dialogue];})];return '\uFEFF'+rows.map(row=>row.map(x=>'"'+String(x??'').replaceAll('"','""')+'"').join(',')).join('\r\n');}
export function splitShot(p,index,at){const s=p.shots[index];if(!s||at<=0||at>=n(s.duration))throw Error('拆分点必须位于镜头内部。');if(s.dialogue||s.segments.length)throw Error('含对白或时间段的镜头，请先手动安排内容归属，再拆镜，避免误改时序。');const second=clone(s);second.id=uid();second.title=s.title+' · 后半';second.duration=n(s.duration)-at;second.manualStart=n(s.manualStart)+at;second.inheritStart=true;second.startState='';s.duration=at;s.endState='待补充拆分点状态';p.shots.splice(index+1,0,second);return second;}
export function mergeShots(p,index){const a=p.shots[index],b=p.shots[index+1];if(!a||!b)throw Error('需要相邻两个镜头。');if(a.sceneId!==b.sceneId)throw Error('不同场景不能直接合镜。');if(a.dialogue||b.dialogue||a.segments.length||b.segments.length)throw Error('含对白或时间段的镜头请先手动整理，避免合镜覆盖原始时序。');const d=n(a.duration);a.segments=[{id:uid(),start:0,end:d,action:a.action,dialogue:'',audio:a.audio},{id:uid(),start:d,end:d+n(b.duration),action:b.action,dialogue:'',audio:b.audio}];a.action=a.action+'\n'+b.action;a.duration=d+n(b.duration);a.endState=b.endState;a.handEnd=b.handEnd;a.propEnd=b.propEnd;a.characterIds=[...new Set([...a.characterIds,...b.characterIds])];a.referenceIds=[...new Set([...a.referenceIds,...b.referenceIds])];a.title+=' / '+b.title;p.shots.splice(index+1,1);}

export function blankCharacter(name='角色A'){const c=character(name);for(const k of Object.keys(c))if(typeof c[k]==='string'&&!['id','identityId','name'].includes(k))c[k]='';for(const k of Object.keys(c.locks))c.locks[k]=false;return c;}
export function blankScene(){const s=scene('新场景');for(const k of Object.keys(s))if(typeof s[k]==='string'&&!['id','name'].includes(k))s[k]='';return s;}
export function makeBlankProject(){const p=makeProject();p.title='未命名项目';p.templateId='';p.fromScratch=true;p.logline='';p.restrictions='';p.style={look:'',medium:'',genre:'',color:'',texture:[],custom:''};for(const k of ['framing','angle','composition','move','speed','stability','lens','focus','rotation','zoom'])p.camera[k]='';p.camera.hold=0;p.characters=[];p.scenes=[];p.props=[];p.shots=[];p.commerce=commerceDefaults();return p;}
