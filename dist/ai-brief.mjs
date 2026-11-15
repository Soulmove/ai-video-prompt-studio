import {GROUPS} from './catalog.mjs';
const NON_LIVE_VISUAL_PRESETS=new Set(['anime2d','anime3d','comic','ink','watercolor','clay','pixel','game']);
export const AI_VISUALS=[
 ['auto','AI 自由设计',''],
 ['real','现实实拍（真实生活镜头）','纯正现实实拍风格，真实街景、日常室内与生活杂物细节，自然肤色与日常服饰，杜绝影楼摆拍或虚假CG感',{look:'reality_raw',medium:'raw_4k',genre:'real_life',color:'natural',texture:['skin','natural_fabric']}],
 ['hk_retro','香港风 · 90年代复古港片','90年代黄金港片电影质感，茶餐厅/骑楼老街霓虹灯牌、墨绿暗部与暖黄品红胶片混色、浓郁街头时代烟火气',{look:'hk_cinema',medium:'35mm',genre:'hk_retro_90s',color:'hk_emerald',texture:['grain','halation','wet_reflection']}],
 ['hk_neon','香港风 · 霓虹夜色抒情（王家卫风）','港风深夜都市抒情美学，暧昧霓虹倒影、楼梯走廊玻璃反光、缓慢抽帧轻微动态拖影与宿命感胶片情绪',{look:'hk_cinema',medium:'35mm',genre:'hk_neon_wong',color:'hk_emerald',texture:['grain','halation','motion_blur_shutter']}],
 ['hk_crime','香港风 · 硬派警匪江湖','经典香港警匪与江湖电影美学，冷风天台、幽暗深巷、凌厉明暗对比与紧迫手持跟拍现场感',{look:'handheld_cinema',medium:'35mm',genre:'hk_crime',color:'muted',texture:['grain','clean']}],
 ['documentary','纪实纪录片 / 街头写实','观察式人文纪录片实拍，纯正现场自然光、真实粗糙肌理与不被打扰的街头在场感',{look:'documentary',medium:'digital',genre:'real_life',color:'natural',texture:['skin','natural_fabric']}],
 ['cinema_drama','现代院线电影感（剧情片）','标准院线叙事电影质感，讲究空间纵深、有动机的光影明暗层次与沉稳克制的摄影构图',{look:'cinema',medium:'digital',genre:'urban',color:'muted',texture:['soft','skin']}],
 ['short_drama','竖屏微短剧（商业精品质感）','竖屏热门精品微短剧风格，高辨识度清爽打光、情绪饱满特写构图与明快现代质感',{look:'short_drama',medium:'digital',genre:'urban',color:'natural',texture:['clean','soft']}],
 ['chinese_modern','新中式 / 东方质感实拍','当代新中式实拍美学，东方建筑留白、青石竹木质感与含蓄温润的自然光影诗意',{look:'cinema',medium:'digital',genre:'chinese_modern',color:'warm_vintage',texture:['soft','mist_bloom']}],
 ['period_republic','民国 / 年代怀旧实拍','民国与年代历史剧实拍质感，青砖旧巷、真实棉麻旗袍长衫织物纹路与复古低饱和胶片影调',{look:'cinema',medium:'35mm',genre:'period_republic',color:'warm_vintage',texture:['grain','natural_fabric']}],
 ['japanese_film','日系生活电影（胶片空气感）','日系生活美学电影风格，柔和自然光线、清透高调空气感、克制留白与细腻情绪日常',{look:'leica',medium:'16mm',genre:'japanese',color:'fuji_fresh',texture:['grain','soft']}],
 ['korean_romance','韩系浪漫都市剧（清透柔光）','韩系影视剧摄影美学，柔和漫射光影、清透温润肤色与浪漫细腻的都市空间层次',{look:'cinema',medium:'digital',genre:'korean',color:'warm',texture:['soft','mist_bloom']}],
 ['american_noir','美式黑色犯罪 / 美剧硬调','美式犯罪悬疑影集风格，冷暖高反差、阴雨街道霓虹旅馆、深邃阴影与冷峻戏剧压迫感',{look:'noir',medium:'35mm',genre:'american_noir',color:'noir_contrast',texture:['grain','wet_reflection']}],
 ['french_art','法式文艺街拍 / 新浪潮','法式文艺电影美学，随性自然光街拍、街角咖啡馆窗光、手摇生活松弛感与16mm颗粒',{look:'handheld_cinema',medium:'16mm',genre:'french_new_wave',color:'muted',texture:['grain','skin']}],
 ['wuxia_real','写实古装武侠 / 江湖实景','硬派写实古装武侠实拍，做旧衣料、真实兵器金属冷光、烟尘山林与苍茫实景张力',{look:'cinema',medium:'35mm',genre:'wuxia',color:'muted',texture:['grain','natural_fabric']}],
 ['scifi_real','硬核近未来科幻实拍','去奇幻化的近未来硬核写实科幻，真实工业金属装置、实用冷光源与物理世界可信度',{look:'imax',medium:'raw_4k',genre:'scifi_real',color:'tealorange',texture:['clean','wet_reflection']}],
 ['cyberpunk','赛博朋克未来霓虹夜色','高对比赛博雨夜都市，潮湿柏油路霓虹反光、密集中文/英文发光招牌与冷暖未来感',{look:'anamorphic',medium:'digital',genre:'cyber',color:'tealorange',texture:['halation','wet_reflection']}],
 ['ccd_y2k','千禧复古 / 怀旧 CCD·DV 生活','2000年代便携CCD相机或家用DV录像视角，抓拍感直闪、怀旧溢色与真实生活聚会氛围',{look:'ccd',medium:'ccd_digital',genre:'real_life',color:'warm_vintage',texture:['diffusion','halation']}],
 ['anime2d','日系二维动画','二维手绘动画，清晰线稿、赛璐璐上色，人物与环境统一动画风格，不混入真人皮肤',{medium:'digital',genre:'japanese',color:'natural',texture:['clean']}],
 ['anime3d','三维动画','风格化三维动画，统一角色比例、立体材质与动画表演',{medium:'digital',genre:'urban',color:'natural',texture:['soft']}],
 ['comic','国漫 / 漫画','国漫风格，利落线条、明确色块与有张力的漫画式表演',{medium:'digital',genre:'fantasy',color:'high_saturation',texture:['clean']}],
 ['ink','水墨国风','水墨国风动画，墨色层次、宣纸肌理与克制留白',{medium:'digital',genre:'wuxia',color:'muted',texture:['soft']}],
 ['watercolor','水彩绘本','水彩绘本动画，手绘笔触与柔和纸张肌理',{medium:'digital',genre:'romance',color:'pastel_soft',texture:['diffusion']}],
 ['clay','黏土定格','黏土定格动画，可见手工材质和逐帧运动节奏',{medium:'16mm',genre:'comedy_warm',color:'warm',texture:['natural_fabric']}],
 ['pixel','像素动画','统一像素尺度的像素动画，简洁轮廓与像素材质',{medium:'digital',genre:'cyber',color:'high_saturation',texture:['clean']}],
 ['game','游戏 CG','高品质游戏CG，统一数字角色与场景的材质、光照',{medium:'digital',genre:'fantasy',color:'tealorange',texture:['clean','soft']}],
 ['custom','自定义风格','']
];
export const AI_TEXTURES=[
 ['auto','AI 搭配',{}],
 ['raw_reality','现实原片 · 零滤镜街头实拍',{look:'reality_raw',medium:'raw_4k',texture:['skin','natural_fabric']}],
 ['cinema','电影质感（标准院线）',{look:'cinema',medium:'digital',texture:['soft']}],
 ['hk_film','90年代港片胶片 · 潮湿霓虹光晕',{look:'hk_cinema',medium:'35mm',texture:['grain','halation','wet_reflection']}],
 ['imax_epic','IMAX 大画幅高清质感',{look:'imax',medium:'imax_70mm',texture:['clean','soft']}],
 ['kodak_cinema','柯达 5219 胶片 · 浓郁电影密度',{look:'cinema',medium:'kodak_film',texture:['grain','soft','skin']}],
 ['fuji_airy','富士胶片 · 日系清透空气感',{look:'leica',medium:'fuji_film',texture:['grain','soft']}],
 ['film','35mm 经典胶片 · 细腻颗粒光晕',{medium:'35mm',texture:['grain','halation']}],
 ['film16','16mm 独立电影 · 颗粒与镜头呼吸',{look:'handheld_cinema',medium:'16mm',texture:['grain','vignette_lens']}],
 ['super8_mem','Super 8 怀旧家庭胶片 · 温暖粗颗粒',{look:'handheld_cinema',medium:'super8',texture:['grain','halation','vignette_lens']}],
 ['leica','徕卡人像 · 温润肤色与德味层次',{look:'leica',texture:['soft','skin']}],
 ['anamorphic_wide','变形宽银幕 · 横向炫光与椭圆焦外',{look:'anamorphic',medium:'35mm',texture:['anamorphic_flare','soft']}],
 ['black_mist','黑柔镜电影光影 · 漫射柔光',{look:'cinema',medium:'digital',texture:['mist_bloom','soft']}],
 ['short_drama_sharp','竖屏微短剧 · 清透高锐度商拍',{look:'short_drama',medium:'digital',texture:['clean','soft']}],
 ['noir_shadow','高反差黑色电影 · 锐利硬调暗部',{look:'noir',medium:'35mm',texture:['grain','clean']}],
 ['phone','手机原相机 · 日常生活直出',{look:'phone',medium:'digital',texture:['clean','skin']}],
 ['selfie_vlog','手机前置自拍 · 近距离Vlog感',{look:'selfie',medium:'digital',texture:['skin','clean']}],
 ['documentary','自然纪录片 · 手持真实纪实',{look:'documentary',medium:'digital',texture:['clean','natural_fabric']}],
 ['commercial','商业广告 · 精致可控材质光效',{look:'commercial',medium:'digital',texture:['clean','soft']}],
 ['ccd_y2k','千禧 CCD 卡片机 · 复古直闪溢色',{look:'ccd',medium:'ccd_digital',texture:['diffusion','halation']}],
 ['polaroid_inst','拍立得 / 复古撕拉片 · 怀旧漫射',{look:'leica',medium:'polaroid',texture:['diffusion','vignette_lens']}],
 ['retro','复古 DV · 早期家用数码录像',{medium:'dv',texture:[]}],
 ['vhs_tape','VHS 模拟录像带 · 扫描线复古感',{look:'documentary',medium:'vhs',texture:['diffusion']}]
];
export const AI_DIALOGUES=[
 ['natural','自然对白 · 默认'],
 ['rich','对白推动剧情（台词密集交锋）'],
 ['sparse','少量关键台词（多用眼神与动作叙事）'],
 ['inner_monologue','内心独白 + 少量对话（港片/文艺风）'],
 ['banter','快节奏斗嘴群戏（高密度有来有回）'],
 ['docu_interview','纪实访谈 / 现场采访与画外声音交织'],
 ['narration','旁白叙事（全程或段落声音叙事）'],
 ['silent','无对白 · 纯画面与环境音默片']
];
export const AI_TRANSITION_STYLES=[
 ['auto','AI 智能调配（按同场/跨场景自动选择最佳转场）'],
 ['basic','一、基础剪辑转场（硬切 / 叠化 / 闪黑 / 淡入淡出）'],
 ['camera','二、电影感运镜转场（甩镜 / 推拉 / 环绕 / 遮挡 / 穿越）'],
 ['vfx','三、特效视觉转场（火焰 / 闪电 / 传送门 / 水墨 / 粒子）'],
 ['narrative','四、影视叙事转场（动作匹配 / 视线匹配 / 蒙太奇 / 回忆）'],
 ['audio','五、声音转场（J-Cut / L-Cut / 声音桥接 / 音效咬合）'],
 ['rhythmic','六、节奏与速度转场（速度渐变 / 定格放大 / 卡点快切）'],
 ['smooth_cut','七、日常写实剪辑（同场硬切 + 跨场柔和叠化 / J-Cut）'],
 ['hk_rhythmic','八、港片节奏剪辑（动作匹配 + 闪黑 / 甩镜情绪切点）'],
 ['emotional_fade','九、抒情氛围过渡（慢节奏叠化 + 渐黑淡入淡出留白）']
];
export const AI_CAST_MODES=[['all','全部人物统一设定'],['individual','单独控制每个人物']];
export const AI_CAST_NATIONALITIES=[
 ['','AI 按剧情自由搭配'],
 ['中国','中国人（东亚面孔）'],
 ['中国香港','中国香港人（港风东亚面孔）'],
 ['中国北方','中国北方质感面孔'],
 ['中国南方','中国南方清秀面孔'],
 ['日本','日本人（东亚面孔）'],
 ['韩国','韩国人（东亚面孔）'],
 ['东南亚华裔','新加坡 / 马来西亚华裔面孔'],
 ['美国/欧美','美国 / 欧美面孔'],
 ['英国/欧洲','英国 / 欧洲古典面孔'],
 ['法式南欧','法国 / 意大利 / 南欧面孔'],
 ['北欧','北欧冷峻高挑面孔'],
 ['非洲/非裔','非洲 / 非裔面孔'],
 ['拉美','拉丁 / 西班牙裔面孔'],
 ['中东','中东 / 阿拉伯面孔'],
 ['南亚','南亚 / 印度面孔'],
 ['东南亚','东南亚本土面孔'],
 ['中亚/东欧','中亚 / 俄罗斯东欧面孔'],
 ['混血','跨种族混血面孔']
];
export const AI_CAST_FACE_TIERS=[
 ['','AI 自由适配'],
 ['ordinary','普通人真实长相（接地气 · 生活自然感）'],
 ['ordinary_worker','市井街头普通人（真实烟火气 · 微带生活沧桑痕迹）'],
 ['star','明星级高颜值（骨相立体 · 电影主角脸）'],
 ['hk_retro_star','90年代港星电影脸（浓眉英气 / 明艳风情 · 强故事感）'],
 ['idol','偶像/网感精致脸（精致五官 · 高颜值）'],
 ['character_actor','实力派硬朗/故事脸（强辨识度 · 自然纹理）'],
 ['youth_campus','青春校园少年/少女脸（干净青涩 · 自然胶原感）'],
 ['fashion_model','清冷高级感/文艺超模脸（强骨骼轮廓 · 极简气质）'],
 ['silver_elder','沧桑长辈/老人面孔（真实白发皱纹 · 岁月厚重感）'],
 ['anime2d','动漫人物（日系/国漫二维线稿 · 非真人）'],
 ['cg3d','3D国漫 / 游戏CG人物（三维立体材质）']
];
export const AI_CAST_SKIN_RENDERS=[
 ['','AI 按画风自动匹配'],
 ['natural_pores','真实肤质 · 保留毛孔/细纹/零磨皮'],
 ['light_makeup','自然清透妆 · 保留皮肤自然肌理'],
 ['sweat_rain_grit','写实汗水雨水油光肌（保留毛孔汗珠 · 港片/动作真实感）'],
 ['sun_tanned','自然小麦/晒后生活肌理（户外/健康/力量感）'],
 ['aged_weathered','岁月风霜肌理（清晰皱纹/斑点/粗糙劳作皮肤细节）'],
 ['film_halation_skin','胶片柔光通透肤质（保留肌理与温润胶片高光）'],
 ['soft_beauty','影视柔光微匀肤 · 细腻保留细节'],
 ['polished_smooth','高磨皮洁净无瑕肌（偶像/广告级匀净）'],
 ['cel_shaded','二次元动漫平涂肤色（赛璐璐光影 · 无真人毛孔）'],
 ['cg_sss','三维CG光滑次表面散射材质皮肤']
];
export const AI_CAST_OCCUPATION_EXAMPLES=[
 '普通上班族','茶餐厅老板 / 街头伙计','香港便衣警察 / 重案组探员','九龙夜班的士司机','大排档厨师 / 市井摊主',
 '大学生 / 研究生','高中生 / 校服青年','急诊科医生 / 护士','律师 / 律政精英','霸道总裁 / 投行创始人',
 '精品咖啡师 / 甜品师','独立插画师 / 设计师','外卖员 / 快递员','便利店夜班店员','花店店主 / 园艺师',
 '乐队吉他手 / 街头歌手','深度调查记者 / 摄影师','古董修复师 / 旧书店老板','退役拳手 / 健身教练',
 '科技公司程序员 / 算法工程师','古风侠客 / 江湖刀客','修仙宗门剑修','民国报馆编辑 / 旗袍名伶','科学家 / 宇航员'
];
export const AI_BGM_MODES=[
 ['auto','AI 自己搭配（按剧情情绪与节奏自动设计配乐）'],
 ['guided','选个大概方向（让 AI 顺着下方曲风/氛围细化）'],
 ['exact','明确指定配乐（严格按所选曲风、乐器与要求）'],
 ['none','无背景音乐（仅保留真实环境音与对白）']
];
export const AI_BGM_MOOD_EXAMPLES=[
 '逐渐紧张悬疑，层层推进压迫感',
 '港风怀旧宿命感，萨克斯与街雨声淡淡交织',
 '街头烟火气实感，开头仅环境底声、结尾轻柔吉它淡入',
 '温柔治愈抒情，适合重逢与留白',
 '压抑克制后突然爆发，转折瞬间弦乐推向顶点',
 '燃向紧凑冲突，高潮瞬间强劲鼓点爆发',
 '轻松幽默轻快，富有喜剧跳跃节奏感',
 '悲伤缓慢克制，稀疏钢琴单音突出情绪余韵',
 '都市霓虹冷峻律动，适合深夜街巷或追逐戏',
 '先扬后抑的冷幽默反差，喜剧声效后瞬间静默',
 '王家卫式慵懒弦乐重复旋律，流动着时间感',
 '古风江湖肃杀气氛，风声与古琴单音对峙',
 '极简低频环境脉冲，完全退让不抢人物台词',
 '温暖日系木吉他扫弦，阳光窗光下的日常幸福感'
];
export const castProfileDefaults=()=>({name:'',nationality:'',faceTier:'',skinRender:'',occupation:'',notes:''});
export const AI_BRIEF_DEFAULTS={customShotTiming:false,shotCountMode:'exact',timingMode:'auto',fixedDuration:5,maxMinutes:1,chainLastFrame:false,cutFrameCheck:false,transitionStyle:'auto',visualPreset:'auto',visualNotes:'',texturePreset:'auto',color:'',genre:'',tone:'',characters:'',setting:'',conflict:'',ending:'',audience:'',keyLine:'',avoid:'',dialogueMode:'natural',language:'普通话',dialogueStyle:'',notes:'',castMode:'all',castDefaults:castProfileDefaults(),castProfiles:[castProfileDefaults(),castProfileDefaults()],bgmMode:'auto',bgmStyle:'',bgmMood:'',bgmNotes:''};
function normalizeCastProfile(raw={}){
 const src=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
 const cleanStr=(v,max=2000)=>{if(v==null)return '';if(typeof v!=='string'||v.length>max)throw Error('人物预选描述文字过长或格式不正确');return v.trim();};
 const out={name:cleanStr(src.name,500),nationality:cleanStr(src.nationality,500),faceTier:cleanStr(src.faceTier,200),skinRender:cleanStr(src.skinRender,200),occupation:cleanStr(src.occupation,1000),notes:cleanStr(src.notes,2000)};
 if(out.faceTier&&!AI_CAST_FACE_TIERS.some(x=>x[0]===out.faceTier))throw Error('请重新选择有效的人物颜值/角色类型');
 if(out.skinRender&&!AI_CAST_SKIN_RENDERS.some(x=>x[0]===out.skinRender))throw Error('请重新选择有效的皮肤质感/磨皮选项');
 return out;
}
export function describeCastProfile(prof){
 const p=normalizeCastProfile(prof);
 const nat=AI_CAST_NATIONALITIES.find(x=>x[0]===p.nationality)?.[1]||p.nationality;
 const tier=AI_CAST_FACE_TIERS.find(x=>x[0]===p.faceTier)?.[1]||'';
 const skin=AI_CAST_SKIN_RENDERS.find(x=>x[0]===p.skinRender)?.[1]||'';
 return {name:p.name,nationality:nat,faceTier:p.faceTier,faceTierText:tier,skinRender:p.skinRender,skinRenderText:skin,occupation:p.occupation,notes:p.notes};
}
export function describeCastDirectives(prefs={}){
 const mode=prefs.castMode==='individual'?'individual':'all';
 if(mode==='all'){
  const base=describeCastProfile(prefs.castDefaults);
  const active=Boolean(base.nationality||base.faceTierText||base.skinRenderText||base.occupation||base.notes);
  return {mode:'all',active,rule:active?'所有生成角色都必须统一遵循 castDefaults 的国籍/族裔面孔、颜值/动漫定位、职业与皮肤质感要求':'按剧情自动设计人物特征',castDefaults:base,castProfiles:[]};
 }
 const list=(Array.isArray(prefs.castProfiles)?prefs.castProfiles:[]).map(describeCastProfile).filter(x=>x.name||x.nationality||x.faceTierText||x.skinRenderText||x.occupation||x.notes);
 return {mode:'individual',active:list.length>0,rule:list.length?'按 castProfiles 逐个对应设定第1位、第2位、第3位…角色，不同角色可拥有完全不同的国籍（如中国人与美国人）、颜值等级、职业与皮肤质感':'按剧情单独差异化设计角色',castDefaults:describeCastProfile(prefs.castDefaults),castProfiles:list};
}
export function describeBgmDirectives(prefs={}){
 return {bgmMode:prefs.bgmMode||'auto',bgmStyle:prefs.bgmStyle||'',bgmMood:prefs.bgmMood||'',bgmNotes:prefs.bgmNotes||''};
}
export function normalizeCreativePreferences(raw={}){
 const skip=new Set(['customShotTiming','shotCountMode','timingMode','fixedDuration','maxMinutes','chainLastFrame','cutFrameCheck','castMode','castDefaults','castProfiles']);
 const p={};for(const key of Object.keys(AI_BRIEF_DEFAULTS).filter(k=>!skip.has(k))){const value=raw[key]??AI_BRIEF_DEFAULTS[key];if(typeof value!=='string'||value.length>10000)throw Error('创作偏好文字过长或格式不正确');p[key]=value.trim();}
 p.customShotTiming=!!raw.customShotTiming;
 p.chainLastFrame=!!raw.chainLastFrame;
 p.cutFrameCheck=!!raw.cutFrameCheck;
 if(!p.transitionStyle)p.transitionStyle='auto';
 if(!p.bgmMode)p.bgmMode='auto';
 p.castMode=raw.castMode==='individual'?'individual':'all';
 p.castDefaults=normalizeCastProfile(raw.castDefaults);
 p.castProfiles=Array.isArray(raw.castProfiles)?raw.castProfiles.slice(0,20).map(normalizeCastProfile):[];
 for(const [key,rows] of [['visualPreset',AI_VISUALS],['texturePreset',AI_TEXTURES],['dialogueMode',AI_DIALOGUES],['transitionStyle',AI_TRANSITION_STYLES],['bgmMode',AI_BGM_MODES]])if(!rows.some(x=>x[0]===p[key]))throw Error('请重新选择有效的创作偏好');
 if(p.color&&!GROUPS.color.options.some(o=>o.id===p.color))throw Error('请重新选择画面色彩');return p;
}
export function requestedVisualStyle(p){
 const visual=AI_VISUALS.find(x=>x[0]===p.visualPreset),quality=AI_TEXTURES.find(x=>x[0]===p.texturePreset),style={...(visual?.[3]||{}),...(quality?.[2]||{})};
 if(p.color)style.color=p.color;if(visual?.[2]||p.visualNotes)style.custom=[visual?.[2],p.visualNotes].filter(Boolean).join('；');if(NON_LIVE_VISUAL_PRESETS.has(p.visualPreset))style.look='';return style;
}
// Fit a complete sequence to the requested runtime while retaining relative pacing.
export function allocateShotDurations(weights,total){
 const n=weights.length,target=Math.round(total*10);if(!n||target<n*5)throw Error('目标总时长与镜头数量不匹配，每镜至少需0.5秒');
 let free=weights.map((_,i)=>i),remaining=total,values=Array(n).fill(0);
 while(free.length){const sum=free.reduce((s,i)=>s+weights[i],0),proposed=Object.fromEntries(free.map(i=>[i,remaining*weights[i]/sum])),clamped=free.filter(i=>proposed[i]<.5);if(!clamped.length){for(const i of free)values[i]=remaining*weights[i]/sum;break;}for(const i of clamped){values[i]=.5;remaining-=values[i];}free=free.filter(i=>!clamped.includes(i));}
 const ticks=values.map(x=>Math.max(5,Math.floor(x*10+1e-7)));let missing=target-ticks.reduce((a,b)=>a+b,0);const order=values.map((x,i)=>i).sort((a,b)=>(values[b]*10-ticks[b])-(values[a]*10-ticks[a]));
 while(missing>0)for(const i of order)if(missing){ticks[i]++;missing--;}
 return ticks.map(x=>x/10);
}

export function briefTimingSummary(b){if(b.shotControlMode==='auto'||b.customShotTiming===false)return '由 AI 自己调整：将按剧情起承转合、对白密度与镜头节奏自动决定最佳分镜数量与总时长（已解除镜数与秒数上限）。';if(!Number.isInteger(b.shotCount)||b.shotCount<1)return '请填写大于等于 1 的分镜数量（整数）';const count=b.shotCountMode==='max'?'最多 '+b.shotCount+' 镜':'共 '+b.shotCount+' 镜';if(b.timingMode==='fixed'){if(!Number.isFinite(b.fixedDuration)||b.fixedDuration<0.5)return count+'，请填写每镜不少于 0.5 秒的有效时长';return count+'，每镜 '+b.fixedDuration+' 秒，'+(b.shotCountMode==='max'?'总长不超过 ':'总长 ')+Math.round(b.shotCount*b.fixedDuration*10)/10+' 秒';}if(b.timingMode==='within'){if(!Number.isFinite(b.maxMinutes)||b.maxMinutes<0.1)return count+'，请填写不小于 0.1 分钟的目标上限';const note=b.maxMinutes*60<b.shotCount*0.5?'（提示：按每镜最少 0.5 秒计，建议延长时间）':'';return count+'，控制在 '+b.maxMinutes+' 分钟内，讲完即可，不必填满'+note;}if(!Number.isFinite(b.duration)||b.duration<0.5)return count+'，请填写不小于 0.5 秒的总时长';const note=b.duration<b.shotCount*0.5?'（提示：需满足每镜至少 0.5 秒，请延长总时长）':'';return count+'，AI 在 '+b.duration+' 秒内分配节奏'+note;}
