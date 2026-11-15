import * as M from './model.mjs';
import {normalizePlan,PLAN_CHAR_KEYS,PLAN_SCENE_KEYS,PLAN_COMMERCE_KEYS} from './ai-contract.mjs';
export const DEFAULT_AI_SCOPES={story:true,style:true,characters:true,scenes:true,shots:true,commerce:true};
export function canAutoFill({enabled,sourceId,currentId,startRevision,currentRevision,view,surface}){return !!enabled&&sourceId===currentId&&startRevision===currentRevision&&view==='ai'&&surface==='studio';}
export function hasAuthoredAIProject(p){return !!(p.characters.length||p.scenes.length||p.shots.length||p.logline?.trim()||p.commerce?.name);}
const empty=x=>x==null||x===''||Array.isArray(x)&&x.length===0;
function characterLock(c,k){if(['hair','hairColor'].includes(k))return c.locks?.hair;if(['outfit','accessories'].includes(k))return c.locks?.outfit;if(['voice','language'].includes(k))return c.locks?.voice;if(['age','gender','height','build','appearance','skin','face','eyes','brows','nose','lips','makeup'].includes(k))return c.locks?.appearance;return false;}
export function contextForAI(p){return {title:p.title,logline:p.logline,format:M.aspect(p),style:M.clone(p.style),characters:p.characters.slice(0,6).map(c=>({...Object.fromEntries(PLAN_CHAR_KEYS.map(k=>[k,c[k]])),locks:c.locks})),scenes:p.scenes.slice(0,6).map(s=>Object.fromEntries(PLAN_SCENE_KEYS.map(k=>[k,s[k]]))),commerce:p.mode==='commerce'?Object.fromEntries(PLAN_COMMERCE_KEYS.map(k=>[k,p.commerce?.[k]||''])):undefined};}
export function applyAIPlan(project,raw,{scopes=DEFAULT_AI_SCOPES,asNew=false,origin='ai',reuseExistingAssets=true}={}){
 const plan=normalizePlan(raw),p=asNew?M.makeBlankProject():M.clone(project),report={charactersAdded:0,scenesAdded:0,shotsAdded:0,kept:0};
 if(asNew){for(const k of ['format','resolution','fps','customFormat','customWidth','customHeight','customFps','specsChosen','language','aiBrief'])if(project[k]!==undefined)p[k]=M.clone(project[k]);p.mode=project.mode;}
 const fill=(target,k,value)=>{if(!empty(value)&&empty(target[k]))target[k]=M.clone(value);else if(!empty(value)&&!empty(target[k])&&JSON.stringify(target[k])!==JSON.stringify(value))report.kept++;};
 if(scopes.story){if(asNew||p.title==='未命名项目'||p.title==='未命名商品项目'||!p.title)p.title=plan.title||p.title;fill(p,'logline',plan.logline);if(plan.chainLastFrame||(asNew&&project.aiBrief?.chainLastFrame))p.chainLastFrame=true;if(plan.cutFrameCheck||(asNew&&project.aiBrief?.cutFrameCheck))p.cutFrameCheck=true;}
 if(scopes.style){for(const k of Object.keys(plan.style))fill(p.style,k,plan.style[k]);p.negativePrompts=[...new Set([...(p.negativePrompts||[]),...plan.negativePrompts])];}
 if(scopes.story||scopes.style){
  p.bgm??=M.bgmDefaults();
  const hasBgmSignal=plan.bgm&&(plan.bgm.style||plan.bgm.mood||plan.bgm.instrumentation||plan.bgm.custom||(plan.bgm.vocals&&plan.bgm.vocals!=='instrumental'));
  if(hasBgmSignal){
   if(plan.bgm.style==='none'||asNew||(empty(p.bgm.style)&&empty(p.bgm.mood)&&empty(p.bgm.instrumentation)&&empty(p.bgm.custom))){
    p.bgm={...M.bgmDefaults(),...plan.bgm,vocals:plan.bgm.vocals||'instrumental'};
   }else{
    for(const k of ['style','mood','instrumentation','custom'])fill(p.bgm,k,plan.bgm[k]);
   }
  }
 }
 const actorMap=new Map(),sceneMap=new Map();
 for(const c of plan.characters){let actor=p.characters.find(x=>x.name===c.name);const previous=reuseExistingAssets?project.characters.find(x=>x.name===c.name):null;if(!actor&&scopes.characters){actor=asNew&&previous?M.clone(previous):M.blankCharacter(c.name);if(asNew&&previous){actor.id=M.uid();actor.identityId=actor.id;}p.characters.push(actor);report.charactersAdded++;}if(actor){actorMap.set(c.ref,actor.id);if(scopes.characters)for(const k of PLAN_CHAR_KEYS){if(characterLock(actor,k)){if(c[k]&&c[k]!==actor[k])report.kept++;continue;}fill(actor,k,c[k]);}}}
 for(const s of plan.scenes){let scene=p.scenes.find(x=>x.name===s.name);if(!scene&&scopes.scenes){scene=M.blankScene();scene.name=s.name;p.scenes.push(scene);report.scenesAdded++;}if(scene){sceneMap.set(s.ref,scene.id);if(scopes.scenes)for(const k of PLAN_SCENE_KEYS)fill(scene,k,s[k]);}}
 if(scopes.shots)for(const x of plan.shots){
  if(x.characterRefs.some(r=>!actorMap.has(r))||x.sceneRef&&!sceneMap.has(x.sceneRef))throw Error('分镜需要对应的人物和场景，请同时勾选人物、场景，或先建立同名资产。');
  const shot=M.makeShot(p),camera=Object.fromEntries(Object.entries(x.camera).filter(([k,v])=>k==='orbit'?v>0:!empty(v)));
  const sid=sceneMap.get(x.sceneRef)||'',prevShot=p.shots[p.shots.length-1];
  Object.assign(shot,{
   title:x.title,duration:x.duration,intent:x.intent||'',spatial:M.alignSpatialToAspect(p,x.spatial||''),action:x.action,
   startState:x.startState,endState:x.endState,transition:x.transition||(p.chainLastFrame&&(!prevShot||prevShot.sceneId===sid)?'continuous':'cut'),
   transitionSpec:x.transitionSpec?M.clone(x.transitionSpec):shot.transitionSpec,
   dialogue:x.dialogue,audio:x.audio,emotion:x.emotion,camera,
   characterIds:x.characterRefs.map(r=>actorMap.get(r)),sceneId:sid,
   inheritStart:!!(p.chainLastFrame&&prevShot&&prevShot.sceneId===sid),
   purpose:'',intensity:x.intensity,micro:x.micro,delivery:x.delivery,music:x.music,voiceType:x.voiceType,
   dialogueLanguage:x.dialogueLanguage||'普通话',dialogueStart:x.dialogueStart,propId:'',referenceIds:[],
   speakerId:x.dialogue?actorMap.get(x.speakerRef||x.characterRefs[0])||'':'',dialogueEnd:x.dialogueEnd,
   acting:x.acting?M.clone(x.acting):shot.acting,
   continuitySpec:x.continuitySpec?M.clone(x.continuitySpec):shot.continuitySpec,
   segments:(x.segments||[]).map(seg=>({id:M.uid(),transition:'',...seg})),
   soundCues:(x.soundCues||[]).map(q=>({...q})),
   negativeNotes:x.negativeNotes||'',
   generationDuration:x.duration+2,trimOut:x.duration+1,manualStart:M.totalDuration(p)
  });
  shot.aiOrigin=origin;p.shots.push(shot);report.shotsAdded++;
 }if(report.shotsAdded)p.targetDuration=M.totalDuration(p);
 if(scopes.commerce&&p.mode==='commerce'){p.commerce??={};for(const k of PLAN_COMMERCE_KEYS)fill(p.commerce,k,plan.commerce[k]);if(!p.commerce.beats?.length&&plan.commerce.beats.length)p.commerce.beats=plan.commerce.beats.map(b=>({...b}));}
 p.updatedAt=Date.now();return {project:M.validateImport(p),report};
}
export function exampleAIPlan(){return normalizePlan({
 title:'雨停之前',logline:'雨夜的咖啡馆里，她收到一封没有署名的信。',chainLastFrame:false,
 style:{look:'cinema',medium:'35mm',genre:'mystery',color:'warm',texture:['grain','skin'],custom:'暖色实景灯与窗外冷色雨夜形成层次'},
 characters:[{ref:'c1',name:'林夏',age:'28岁，成年人',gender:'女性',hair:'深棕色齐肩直发',outfit:'米白色棉麻衬衫，深色长裤',voice:'轻柔、克制'}],
 scenes:[{ref:'s1',name:'雨夜咖啡馆',description:'木桌靠着雨窗，室内一盏暖色台灯，左前方通往咖啡馆入口',time:'night',weather:'rain',lightSource:'lamp',lightDirection:'side',lightQuality:'soft',dynamics:'雨滴沿玻璃缓缓滑落',sound:'持续细雨声与咖啡馆低微环境底声'}],
 shots:[
  {
   title:'窗边等待',duration:5,characterRefs:['c1'],sceneRef:'s1',
   intent:'通过完全固定的中景建立人物独处时的静谧秩序与信纸焦点，为后续突然被画外声打破做铺垫。',
   spatial:'林夏坐在窗边木桌旁偏右三分线处，咖啡馆入口位于林夏左前方，台灯在其左前侧；林夏目光停在左侧雨窗玻璃，不直视摄影机。',
   action:'林夏坐在窗边，右手轻握折叠信纸，目光停留在玻璃上的雨滴保持沉思。',
   startState:'林夏静坐于靠窗木桌前，右手稳定轻握折叠信纸置于桌沿，目光望向雨窗。',
   endState:'保持静坐姿势与头部角度稳定，右手仍轻握信纸未展开，为下一镜衔接留出静帧。',
   transition:'cut',
   acting:{eyes:'目光平缓停驻在雨窗雨滴上，3秒左右轻微自然眨眼一次',brows:'眉眼保持平静放松',lips:'双唇自然闭合',breathing:'均匀缓慢的自然呼吸',head:'头部基本保持静止，不左顾右盼',posture:'双肩放松，右手手指稳握信纸边缘，不交换左右手'},
   continuitySpec:{character:'林夏保持28岁外貌、深棕色齐肩直发与米白色棉麻衬衫一致',prop:'米白色折叠信纸始终由右手持有，折痕完整不消失',space:'林夏始终位于靠窗木桌边，台灯、窗框与咖啡馆入口方位固定不变',lighting:'左前侧暖色台灯与窗外冷蓝色雨夜光线比例恒定',action:'末秒画面保持稳定静帧，明确硬切或承接至下一镜开头'},
   segments:[
    {start:0,end:1,action:'林夏保持静坐，目光稳定停留在右侧反光的雨窗上',performance:'呼吸均匀，肩膀放松',cameraBeat:'三脚架固定中景确立',audio:'持续细雨声与室内低微底声'},
    {start:1,end:3,action:'右手指尖轻触并稳握桌面边缘的折叠信纸，目光随窗上一道雨痕略微下移',performance:'自然眨眼一次，面部保持克制静气',cameraBeat:'焦点稳定锁定在人物与信纸',audio:'连续雨滴敲打窗玻璃声'},
    {start:3,end:5,action:'目光回到雨窗远处保持静止停顿，姿势微收，等待事件打破平静',performance:'唇部保持自然闭合，手指稳固不抖',cameraBeat:'画面完全稳定无位移无变焦',audio:'室内环境底声维持平静'}
   ],
   soundCues:[{start:0,end:5,kind:'ambience',cue:'持续雨声、窗玻璃水滴声与咖啡馆低微环境声'}],
   negativeNotes:'禁止手指畸形或手部数量错误、禁止折叠信纸突然消失变形或左右手互换、禁止擅自切镜及画面无故变焦',
   camera:{framing:'medium',move:'fixed',moveDistance:'none',stability:'tripod',lens:'50',zoom:'none',end:'画面维持固定中景构图直到硬切结束'}
  },
  {
   title:'听见呼唤',duration:5,characterRefs:['c1'],sceneRef:'s1',
   intent:'以缓慢物理推进与特写放大人物由平静转为警觉的微表演节奏，让观众清晰捕捉眼球先动、头再跟随的真人反应，营造未知压迫感。',
   spatial:'林夏仍在同一靠窗位置，咖啡馆入口位于林夏左前方；画外呼唤从左前方入口传来，林夏视线先向入口移动并最终落在入口方向，严禁直视摄影机。',
   action:'画外传来一声呼唤，她短暂停顿，先停止手部动作再抬眼看向左前方入口并压低声音开口。',
   startState:'延续上一镜坐在窗边持信姿态，右手轻握折叠信纸，目光停在雨窗。',
   endState:'身体仍坐在原位，头微偏朝向左前方入口，眼神警觉停在画外，信纸仍在右手。',
   transition:'end',
   audio:'画外左前方入口传来一声轻微呼唤',dialogue:'是谁？',speakerRef:'c1',dialogueLanguage:'普通话',dialogueStart:4,dialogueEnd:5,voiceType:'in',delivery:'压低声音，微带停顿与警觉',
   emotion:'hesitate',micro:['gaze','breath'],intensity:'克制渐紧',music:'低音悬疑弦乐缓缓轻入铺垫张力',
   acting:{eyes:'第1秒平静，2–3秒眼球先向左前方入口移动，第3–5秒从平静转为警觉定格',brows:'第2秒末眉毛极其轻微收紧',lips:'前3.8秒保持自然闭合，第4秒开口问“是谁？”时口型精准匹配',breathing:'第1秒听见声音瞬间呼吸短暂停顿',head:'眼睛先动后，第3–4秒头部仅发生极轻微向入口方向跟随转动',posture:'双肩保持放松稳住，严禁出现整个人身体大幅转向，右手紧握信纸不松开'},
   continuitySpec:{character:'林夏面貌、齐肩直发与米白色棉麻衬衫保持与第1镜完全一致',prop:'折叠信纸始终由右手稳握，不得消失或更换成左手',space:'靠窗木桌、左前侧暖色台灯与窗外冷色雨夜环境保持绝对连续',lighting:'暖色台灯侧光继续勾勒半侧脸轮廓',action:'以第1镜静坐看窗姿态起势，按时间轴逐秒展开听声警觉反应'},
   segments:[
    {start:0,end:1,action:'听见左前方入口传来画外声音瞬间，仍保持原有静坐看窗姿势',performance:'眼神定住，呼吸短暂停顿',cameraBeat:'Dolly In 轨道推进平稳起动，不变焦',audio:'0.8秒左前方传来轻微呼唤'},
    {start:1,end:2,action:'右手指尖停止桌沿微动，捏稳信纸边缘',performance:'眉毛轻微收紧，眼神从放空转为警觉',cameraBeat:'沿光轴匀速缓慢物理靠近人物',audio:'咖啡馆轻柔背景弦乐弱化让位'},
    {start:2,end:3,action:'眼球先向左前方入口声音来向移动',performance:'保持头部尚未大幅转动，体现眼睛先动的真实反应',cameraBeat:'持续轻微推进，保持眼部对焦',audio:'低音弦乐极轻缓缓切入'},
    {start:3,end:4,action:'缓慢抬起视线，头部极轻微地跟随眼神转向入口方向',performance:'双肩保持放松不扭转身体，嘴唇微启准备发声',cameraBeat:'接近中近景面部区域，无手持抖动',audio:'低音弦乐稳住氛围'},
    {start:4,end:5,action:'视线定格在左前方画外入口处，轻声开口问“是谁？”后短暂收口',performance:'口型与台词字音严格同步，右手仍稳握信纸',cameraBeat:'面部与肩部占画面主要区域并保持终点停留',audio:'4.0–4.8秒清晰人声对白，结尾保留雨声余韵'}
   ],
   soundCues:[
    {start:0,end:5,kind:'ambience',cue:'持续窗外细雨声与咖啡馆微弱底声'},
    {start:0.8,end:1.5,kind:'sfx',cue:'左前方画外入口传来轻微一声呼唤'},
    {start:1.8,end:2.4,kind:'music',cue:'室内环境背景音乐开始减弱退让'},
    {start:2.5,end:4,kind:'music',cue:'低音悬疑弦乐缓缓轻入铺垫张力'},
    {start:4,end:5,kind:'dialogue',cue:'林夏压低声音问“是谁？”（严格控制口型与字音同步）'}
   ],
   negativeNotes:'禁止未授权切镜或用光学变焦替代物理Dolly推进、禁止手臂与手指畸形及信纸左右手互换、禁止背部桌椅位移、禁止面部过度磨皮与口型错位、禁止自动生成字幕与水印',
   camera:{framing:'close',move:'push',moveDistance:'subtle',speed:'slow',stability:'dolly',lens:'85',zoom:'none',start:'从第1镜中景构图起幅',end:'沿光轴轻微物理推进至面部占画面主要区域，不改变透视构图关系，无突然变焦'}
  }
 ],
 negativePrompts:['identity','wardrobe','skin','hands','props','prop_hand_swap','prop_deform','flicker','shake','no_cut','no_cam_spin','no_bg_shift','sync','text','watermark'],
 commerce:{beats:[]}
});}
