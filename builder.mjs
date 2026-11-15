export const ATTRIBUTES={
 gender:['女性','男性','中性呈现'],age:['18–25岁，成年人','26–35岁，成年人','36–45岁','46–60岁','60岁以上'],height:['155cm','160cm','165cm','170cm','175cm','180cm','185cm'],build:['自然匀称','纤细','高挑','健壮','运动型','丰腴'],appearance:['东亚外观','东南亚外观','南亚外观','欧洲外观','非洲外观','混合外观特征'],skin:['自然肤色，保留毛孔','偏白肤色，纹理自然','小麦肤色','深棕肤色','少量雀斑','轻微细纹'],face:['鹅蛋脸，轮廓自然','圆脸，面颊饱满','方脸，下颌清晰','长脸，轮廓修长','清晰颧骨，柔和下颌'],eyes:['深棕色虹膜，杏眼','黑色虹膜，内双','细长眼型','圆眼，目光自然','蓝色虹膜','绿色虹膜'],brows:['自然平眉','略弯细眉','浓眉','剑眉','柔和弧形眉'],nose:['自然鼻梁','较高鼻梁，鼻头自然','圆润鼻头','小巧鼻型'],lips:['自然唇形','薄唇','饱满唇形','清晰唇峰'],hair:['自然短发','齐肩直发','长直发','长卷发','波波头','半束发','高马尾','低盘发','光头'],hairColor:['黑色','深棕色','浅棕色','金色','银白色','红棕色'],makeup:['自然淡妆','清透妆','无明显妆容','精致浓妆','疲惫妆','战损妆'],occupation:['上班族','学生（成年人）','医生','设计师','创业者','古代侠客'],outfit:['白色棉质衬衫，深色长裤','米白亚麻衬衫','休闲T恤与牛仔裤','深色西装','运动套装','古装交领长衫'],accessories:['无明显配饰','细框眼镜','银色耳饰','皮质腕表','简约项链'],habits:['姿态自然，右手惯用','左手惯用','站姿挺拔','步态轻缓'],voice:['自然温和，语速适中','低沉稳重','清亮轻柔','沙哑克制'],language:['普通话','粤语','英语','日语','韩语'],variant:['日常造型','通勤造型','正式造型','运动造型','古装造型']};
export function sparsePrompt(p,selected,mode,opt,cameraText,characterText,sceneText,startState,helpers={}){
 const clean=helpers.cleanVal||(v=>String(v??'').trim().replace(/[。，；;,.]+$/g,''));
 const alignSpatial=helpers.alignSpatialToAspect||((_,t)=>t);
 const style=['look','medium','genre','color'].map(k=>p.style[k]?opt(p,k,p.style[k],p.language):'').concat(p.style.texture.map(x=>opt(p,'texture',x,p.language)),clean(p.style.custom)).filter(Boolean).join('；');
 const chars=p.characters.map(c=>characterText(c,false,p.language)).filter(Boolean),scenes=p.scenes.map(s=>[sceneText(p,s,p.language),...['lightSource','lightDirection','lightQuality'].map(k=>s[k]?opt(p,k,s[k],p.language):''),clean(s.lightNote)].filter(Boolean).join('，')).filter(Boolean);
 const globalCamera=cameraText(p,{camera:{}},p.language);
 const times=helpers.timeline?helpers.timeline(p):null;
 const shot=(s,i)=>{
  const hasActing=s.acting&&Object.values(s.acting).some(v=>String(v||'').trim());
  const hasContinuity=s.continuitySpec&&Object.values(s.continuitySpec).some(v=>String(v||'').trim());
  const parts=[s.intent,s.spatial,s.action,...(s.segments||[]).map(x=>x.action),s.startState,s.endState,s.dialogue,s.audio,...(s.soundCues||[]).map(x=>x.cue)].filter(Boolean);
  if(!parts.length&&!Object.keys(s.camera||{}).length&&!s.emotion&&!s.micro?.length&&!s.music&&!hasActing&&!hasContinuity)return '';
  const frame=mode==='first'||mode==='last';
  if(frame){const state=mode==='last'?s.endState:startState(p,i);return [style,chars.join('；'),scenes.join('；'),['framing','angle','composition','lens','focus'].map(k=>{const value={...p.camera,...s.camera}[k];return value?opt(p,k,value,p.language):'';}).filter(Boolean).join('，'),state].filter(Boolean).join('\n');}
  const sp=p.characters.find(c=>c.id===s.speakerId),vt=s.voiceType==='off'?'画外':s.voiceType==='vo'?'旁白':'画内';
  const sc=p.scenes.find(x=>x.id===s.sceneId);
  const presentChars=p.characters.filter(c=>s.characterIds?.includes(c.id)).map(c=>c.name);
  const absentChars=p.characters.filter(c=>!s.characterIds?.includes(c.id)).map(c=>c.name);
  const castSceneLine=(presentChars.length||sc?.name)?[presentChars.length?`出场人物：${presentChars.join('、')}${absentChars.length?`（本镜仅以上角色入画，${absentChars.join('、')}暂未出场）`:''}`:'',sc?.name?`场景：${sc.name}`:''].filter(Boolean).join('｜'):'';
  const shotMove=(s.camera?.move||p.camera?.move||'');
  const labelFn=helpers.label||((proj,k,v)=>opt(proj,k,v,proj.language));
  const segs=s.segments||[];
  const segLines=segs.length?['【镜内时间轴】',...segs.map((x,segIdx)=>{const camBeat=x.cameraBeat&&shotMove&&shotMove!=='fixed'?x.cameraBeat.replace(/固定机位/g,'起幅稳住构图'):x.cameraBeat;const segTrans=x.transition&&segIdx<segs.length-1?`段尾转场（仅限镜内节拍）：${labelFn(p,'transition',x.transition)}`:'';const meta=[x.performance?'表演：'+x.performance:'',camBeat?'机位：'+camBeat:'',x.dialogue?'对白：'+x.dialogue:'',x.audio?'声画：'+x.audio:'',segTrans].filter(Boolean).join('｜');return `${x.start}–${x.end}秒：${x.action||''}${meta?'（'+meta+'）':''}`;})]:[s.action];
  const actingStr=helpers.actingLines?helpers.actingLines(p,s,p.language):[s.emotion?opt(p,'emotion',s.emotion,p.language):'',s.micro?.length?s.micro.map(x=>opt(p,'micro',x,p.language)).join('，'):'',s.intensity?'表演强度：'+s.intensity:''].filter(Boolean).join('；');
  const soundBlock=helpers.soundTimelineLines?helpers.soundTimelineLines(p,s,sc,p.language):[s.music?'配乐：'+s.music:'',s.audio].filter(Boolean);
  const contBlock=helpers.continuityLockLines?helpers.continuityLockLines(p,s,i,p.language):[];
  const endTime=times?.[i]?.end??(Number(s.duration)||0);
  const cutLine=helpers.transitionLine?helpers.transitionLine(p,i,endTime,p.language):'';
  const span=times?.[i]?`${times[i].start}–${times[i].end}秒 · `:'';
  return [
   `${span}${s.title}（${s.duration}秒）`,
   s.intent?'【导演意图】'+s.intent:'',
   castSceneLine,
   s.spatial?'空间与视线：'+alignSpatial(p,s.spatial):'',
   startState(p,i)?'起点：'+startState(p,i):'',
   Object.keys(s.camera||{}).length?'摄影参数：'+cameraText(p,s,p.language):'',
   ...segLines,
   actingStr,
   s.dialogue?'对白 · '+(sp?.name||'未指定说话者')+'（'+(s.dialogueLanguage||'普通话')+'，'+vt+(sp?.voice?'，'+sp.voice:'')+(s.delivery?'，'+s.delivery:'')+'）['+(s.dialogueStart??0)+'–'+(s.dialogueEnd??s.duration)+'秒]（要求口型与台词严格同步）：'+s.dialogue:'',
   ...soundBlock,
   s.endState?'终点：'+s.endState:'',
   ...contBlock,
   cutLine
  ].filter(Boolean).join('\n');
 };
 const chain=helpers.chainDirective?helpers.chainDirective(p,p.language):'';
 const bgm=helpers.bgmText?helpers.bgmText(p,p.language):'';
 const editTable=helpers.editingTransitionTable?helpers.editingTransitionTable(p,p.language):'';
 if(mode==='first'||mode==='last')return p.shots[selected]?shot(p.shots[selected],selected):'';
 if(mode==='shot'){const one=p.shots[selected]?shot(p.shots[selected],selected):'';const singleMemo=helpers.singleShotEditingNote?helpers.singleShotEditingNote(p,selected,p.language):'';return one?[chain,bgm,one,singleMemo].filter(Boolean).join('\n\n'):'';}
 return [p.logline,chain,style,bgm,chars.length?'人物：'+chars.join('；'):'',scenes.length?'场景：'+scenes.join('；'):'',globalCamera?'摄影：'+globalCamera:'',...p.shots.map(shot),editTable,p.screenText?'指定画内文字：'+p.screenText:'',p.restrictions].filter(Boolean).join('\n\n');
}
export const commerceDefaults=()=>({name:'',category:'',material:'',color:'',audience:'',sellingPoints:'',evidence:'',goal:'',platform:'',scene:'',lighting:'',composition:'',camera:'',hook:'',cta:'',copy:'',preserve:false,referenceId:'',output:'image',beats:[]});
export function commercePrompt(p){const c=p.commerce;if(!c)return '';const rows=[['商品',c.name],['品类',c.category],['材质',c.material],['颜色与外观',c.color],['目标人群',c.audience],['已确认卖点',c.sellingPoints],['可展示的依据',c.evidence],['素材任务',c.goal],['投放渠道',c.platform],['展示场景',c.scene],['灯光',c.lighting],['构图',c.composition],['商品运镜',c.camera],['开场设计',c.hook],['指定文案',c.copy],['行动引导',c.cta]].filter(([,v])=>v);if(!rows.length&&!c.beats.some(b=>b.action))return '';const out=rows.map(([k,v])=>`${k}：${v}`);const r=p.references.find(r=>r.id===c.referenceId);if(r)out.push(`商品参考：${r.name}（${r.data?'已上传，提交时自行挂载':'计划素材'}），只参考商品外观，不采用原背景。`);if(c.preserve)out.push('保持商品形状、颜色、包装和标识一致，不添加未确认的功能、数据或文案。');if(c.output!=='image')out.push(...c.beats.filter(b=>b.action).map(b=>`${b.start}–${b.end}秒 · ${b.title}：${b.action}${b.voice?'；口播：'+b.voice:''}`));return out.join('\n\n');}
export const COMMERCE_SOURCES=[['fal-ai-community/skills','商品形状、材质、包装与参考图职责','https://github.com/fal-ai-community/skills/blob/main/skills/commercial/SKILL.md','来源方法参考'],['xianyu110/ecommerce-video-skills','基于真实卖点的开场和画面安排','https://github.com/xianyu110/ecommerce-video-skills/blob/main/skills/hook-3s-script/SKILL.md','来源方法参考'],['vargHQ/ecommerce-ai-video-skills','开箱、使用演示与问题解决型广告结构','https://github.com/vargHQ/ecommerce-ai-video-skills','来源方法参考']];
