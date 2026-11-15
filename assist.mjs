import {ATTRIBUTES} from './builder.mjs';
import {AI_BGM_MOOD_EXAMPLES,AI_CAST_OCCUPATION_EXAMPLES} from './ai-brief.mjs';
const pack=(name,data)=>({name,data});
export const PRESETS={
 style:[
 pack('现实实拍写实',{look:'reality_raw',medium:'raw_4k',genre:'real_life',color:'natural',texture:['skin','natural_fabric']}),
 pack('复古港片夜色',{look:'hk_cinema',medium:'35mm',genre:'hk_retro_90s',color:'hk_emerald',texture:['grain','halation','wet_reflection']}),
 pack('王家卫霓虹抒情',{look:'hk_cinema',medium:'35mm',genre:'hk_neon_wong',color:'hk_emerald',texture:['grain','halation','motion_blur_shutter']}),
 pack('日系生活胶片',{look:'cinema',medium:'16mm',genre:'japanese',color:'fuji_fresh',texture:['grain','halation']}),
 pack('韩系清透爱情',{look:'cinema',medium:'digital',genre:'korean',color:'warm',texture:['mist_bloom','soft']}),
 pack('35mm电影叙事',{look:'cinema',medium:'35mm',genre:'urban',color:'muted',texture:['grain','soft']}),
 pack('徕卡暖调人像',{look:'leica',medium:'digital',genre:'romance',color:'warm',texture:['skin','soft']}),
 pack('手机日常记录',{look:'phone',medium:'digital',genre:'urban',color:'natural',texture:['skin']}),
 pack('手机自拍视频',{look:'selfie',medium:'digital',genre:'urban',color:'natural',texture:['clean']}),
 pack('观察式人文纪实',{look:'documentary',medium:'digital',genre:'real_life',color:'natural',texture:['skin','natural_fabric']}),
 pack('手摇纪实日常',{look:'handheld_cinema',medium:'digital',genre:'real_life',color:'muted',texture:['skin','grain']}),
 pack('香港警匪江湖',{look:'handheld_cinema',medium:'35mm',genre:'hk_crime',color:'noir_contrast',texture:['grain','clean']}),
 pack('千禧TVB都市剧',{look:'tv_drama',medium:'dv',genre:'hongkong',color:'natural',texture:['clean','soft']}),
 pack('竖屏微短剧商业级',{look:'short_drama',medium:'digital',genre:'urban',color:'high_saturation',texture:['clean','soft']}),
 pack('新中式东方雅韵',{look:'cinema',medium:'digital',genre:'chinese_modern',color:'warm_vintage',texture:['mist_bloom','soft']}),
 pack('民国年代怀旧',{look:'cinema',medium:'35mm',genre:'period_republic',color:'warm_vintage',texture:['grain','natural_fabric']}),
 pack('IMAX史诗大片',{look:'imax',medium:'imax_70mm',genre:'urban',color:'tealorange',texture:['clean','soft']}),
 pack('变形宽银幕炫光',{look:'anamorphic',medium:'35mm',genre:'mystery',color:'noir_contrast',texture:['anamorphic_flare','halation']}),
 pack('柯达2383电影感',{look:'cinema',medium:'kodak_film',genre:'romance',color:'warm',texture:['grain','soft','skin']}),
 pack('富士胶片空气感',{look:'leica',medium:'fuji_film',genre:'japanese',color:'fuji_fresh',texture:['grain','soft']}),
 pack('冷蓝悬疑犯罪',{look:'cinema',medium:'digital',genre:'mystery',color:'cool',texture:['clean']}),
 pack('美式黑色悬疑',{look:'noir',medium:'35mm',genre:'american_noir',color:'noir_contrast',texture:['grain','wet_reflection']}),
 pack('法式新浪潮胶片',{look:'handheld_cinema',medium:'16mm',genre:'french_new_wave',color:'muted',texture:['grain','skin']}),
 pack('黑白纪实',{look:'documentary',medium:'35mm',genre:'urban',color:'bw',texture:['grain','skin']}),
 pack('银盐高反差黑白',{look:'noir',medium:'35mm',genre:'hk_crime',color:'bw_silver',texture:['grain','clean']}),
 pack('复古CCD千禧生活',{look:'ccd',medium:'ccd_digital',genre:'real_life',color:'warm_vintage',texture:['diffusion','halation']}),
 pack('拍立得记忆质感',{look:'leica',medium:'polaroid',genre:'romance',color:'warm_vintage',texture:['diffusion','vignette_lens']}),
 pack('VHS复古家庭',{look:'documentary',medium:'vhs',genre:'urban',color:'warm',texture:['diffusion']}),
 pack('DV街头记录',{look:'documentary',medium:'dv',genre:'urban',color:'natural',texture:['clean']}),
 pack('Super8回忆',{look:'cinema',medium:'super8',genre:'romance',color:'warm',texture:['grain','halation']}),
 pack('写实古装武侠',{look:'cinema',medium:'35mm',genre:'wuxia',color:'muted',texture:['grain','soft']}),
 pack('云雾东方仙侠',{look:'cinema',medium:'digital',genre:'fantasy',color:'cool',texture:['diffusion','halation']}),
 pack('硬核近未来科幻',{look:'imax',medium:'raw_4k',genre:'scifi_real',color:'tealorange',texture:['clean','wet_reflection']}),
 pack('赛博霓虹',{look:'cinema',medium:'digital',genre:'cyber',color:'tealorange',texture:['halation','clean']}),
 pack('末日废土',{look:'documentary',medium:'16mm',genre:'apocalypse',color:'muted',texture:['grain']}),
 pack('商业商品摄影',{look:'commercial',medium:'digital',genre:'urban',color:'natural',texture:['clean','soft']}),
 pack('运动相机临场',{look:'actioncam',medium:'digital',genre:'urban',color:'natural',texture:['clean']})
 ],
 characters:[
 pack('自然都市女性',{gender:'女性',age:'26–35岁，成年人',build:'自然匀称',hair:'齐肩直发',hairColor:'深棕色',outfit:'米白色亚麻衬衫，深色长裤',voice:'自然温和，语速适中'}),
 pack('自然都市男性',{gender:'男性',age:'26–35岁，成年人',build:'自然匀称',hair:'自然短发',hairColor:'黑色',outfit:'深灰色棉质衬衫，黑色长裤',voice:'自然平稳，表达克制'}),
 pack('干练职场女性',{gender:'女性',age:'26–35岁，成年人',build:'高挑',hair:'低盘发',outfit:'深色合身西装，浅色衬衫',habits:'站姿挺拔，动作简洁',voice:'清晰坚定，语速适中'}),
 pack('成熟职场男性',{gender:'男性',age:'36–45岁',hair:'整齐短发',outfit:'深蓝色西装，素色领带',habits:'姿态稳定，动作克制',voice:'低沉稳重'}),
 pack('阳光运动女性',{gender:'女性',age:'18–25岁，成年人',build:'运动型',hair:'高马尾',outfit:'简洁运动套装，跑鞋',makeup:'无明显妆容',voice:'清亮自然'}),
 pack('阳光运动男性',{gender:'男性',age:'18–25岁，成年人',build:'健壮',hair:'利落短发',outfit:'运动T恤与训练长裤',makeup:'无明显妆容',voice:'自然有活力'}),
 pack('文艺生活人物',{age:'26–35岁，成年人',hair:'自然微卷短发',outfit:'宽松棉麻外套，素色长裤',accessories:'细框眼镜',habits:'步态轻缓，说话前略停顿'}),
 pack('银发温和女性',{gender:'女性',age:'60岁以上',hair:'自然银白短发',hairColor:'银白色',skin:'自然肤色，保留岁月细纹',outfit:'柔软针织衫，深色长裤',voice:'温和缓慢'}),
 pack('银发沉稳男性',{gender:'男性',age:'60岁以上',hair:'整齐银灰短发',hairColor:'银白色',skin:'自然肤色，保留细纹',outfit:'深色棉布外套',voice:'低沉缓慢'}),
 pack('古装温婉人物',{age:'26–35岁，成年人',hair:'长发半束',hairColor:'黑色',outfit:'浅色交领长衫，布鞋',makeup:'自然淡妆',habits:'动作从容，站姿自然'}),
 pack('古装侠客',{age:'26–35岁，成年人',build:'精干',hair:'长发束起',hairColor:'黑色',outfit:'深色交领长衫，皮质腰带，布靴',habits:'重心稳定，视线警觉'}),
 pack('雨夜通勤人物',{age:'26–35岁，成年人',hair:'略湿的自然短发',outfit:'深色防雨外套，肩部有雨滴',habits:'肩部略紧，呼吸稍快'}),
 pack('极简商品模特',{age:'26–35岁，成年人',build:'自然匀称',hair:'整洁自然发型',makeup:'清透妆',outfit:'素色无图案上衣',accessories:'无明显配饰',habits:'手部动作缓慢，避免遮挡商品'}),
 pack('生活方式讲解者',{age:'26–35岁，成年人',outfit:'舒适休闲装',habits:'自然看向镜头，手势简洁',voice:'亲切口语，语速适中',language:'普通话'})
 ],
 camera:[
 pack('固定双人对白',{framing:'medium',angle:'eye',composition:'thirds',move:'fixed',moveDistance:'none',lens:'50',focus:'subject',stability:'tripod',rotation:'none',zoom:'none'}),
 pack('缓推情绪近景',{framing:'mediumClose',angle:'eye',composition:'thirds',move:'push',moveDistance:'subtle',speed:'slow',lens:'85',focus:'eyes',stability:'dolly',zoom:'none'}),
 pack('侧跟行走',{framing:'mediumFull',angle:'eye',move:'track',moveDistance:'moderate',speed:'even',lens:'35',focus:'subject',stability:'gimbal',zoom:'none'}),
 pack('背后跟随',{framing:'full',angle:'eye',composition:'center',move:'follow',moveDistance:'moderate',speed:'even',lens:'35',stability:'handheld',zoom:'none'}),
 pack('拉远揭示空间',{framing:'medium',angle:'eye',move:'pull',moveDistance:'moderate',speed:'slow',lens:'35',focus:'deep',stability:'dolly',zoom:'none'}),
 pack('90°环绕人像',{framing:'medium',angle:'eye',move:'orbit',moveDistance:'moderate',orbit:90,direction:'cw',subjectTurn:false,speed:'slow',lens:'50',stability:'gimbal',zoom:'none'}),
 pack('180°逆时针环绕',{framing:'mediumFull',move:'orbit',moveDistance:'moderate',orbit:180,direction:'ccw',subjectTurn:false,speed:'slow',lens:'35',stability:'gimbal',zoom:'none'}),
 pack('360°完整展示',{framing:'full',move:'orbit',moveDistance:'moderate',orbit:360,direction:'cw',subjectTurn:false,speed:'even',lens:'35',stability:'gimbal',zoom:'none'}),
 pack('低机位人物登场',{framing:'mediumFull',angle:'low',composition:'center',move:'push',moveDistance:'subtle',speed:'slow',lens:'35',zoom:'none'}),
 pack('高机位环境观察',{framing:'wide',angle:'high',move:'fixed',moveDistance:'none',lens:'24',focus:'deep',stability:'tripod',zoom:'none'}),
 pack('顶视桌面细节',{framing:'detail',angle:'top',composition:'center',move:'fixed',moveDistance:'none',lens:'50',focus:'subject',stability:'tripod',zoom:'none'}),
 pack('过肩人物反应',{framing:'mediumClose',angle:'shoulder',composition:'thirds',move:'fixed',moveDistance:'none',lens:'85',focus:'eyes',zoom:'none'}),
 pack('手持纪录视角',{framing:'medium',angle:'eye',move:'follow',moveDistance:'moderate',lens:'35',speed:'even',stability:'handheld'}),
 pack('商品微距推进',{framing:'detail',angle:'eye',move:'push',moveDistance:'subtle',speed:'slow',lens:'macro',focus:'subject',stability:'dolly',zoom:'none'}),
 pack('前景到人物拉焦',{framing:'medium',angle:'eye',move:'stationary',moveDistance:'none',lens:'50',focus:'rack',focusFrom:'前景道具',focusTo:'背景人物眼睛',rotation:'none',zoom:'none'}),
 pack('升起展开空间',{framing:'wide',move:'rise',moveDistance:'moderate',speed:'slow',lens:'24',focus:'deep',stability:'gimbal',zoom:'none'})
 ],
 performance:[
 pack('自然平静',{emotion:'restrained',micro:['blink'],intensity:'克制',music:'无背景音乐'}),
 pack('浅笑回应',{emotion:'smile',micro:['gaze'],intensity:'自然'}),
 pack('迟疑后决定',{emotion:'hesitate',micro:['breath','hands'],intensity:'克制'}),
 pack('忍住眼泪',{emotion:'tears',micro:['lips','breath'],intensity:'克制',music:'无背景音乐'}),
 pack('轻微惊讶',{emotion:'surprise',micro:['breath'],intensity:'克制'}),
 pack('压住愤怒',{emotion:'anger',micro:['hands'],intensity:'克制'}),
 pack('疲惫放松',{emotion:'tired',micro:['shoulders','blink'],intensity:'自然'}),
 pack('安静等待',{emotion:'restrained',micro:['gaze','blink'],intensity:'克制',audio:'保留自然环境底声'}),
 pack('手部犹豫',{emotion:'hesitate',micro:['hands'],intensity:'克制',audio:'手指接触物件时有轻微材质声'}),
 pack('温暖释然',{emotion:'smile',micro:['shoulders'],intensity:'自然',music:'轻柔原声吉他，结尾淡出'}),
 pack('悬疑留白',{emotion:'restrained',micro:['breath'],intensity:'克制',audio:'画外一声短暂轻响，随后回到安静底声',music:'无背景音乐'}),
 pack('商品自然讲解',{emotion:'smile',micro:['blink'],intensity:'自然',dialogueLanguage:'普通话',music:'轻柔音乐保持低音量，不遮盖人声'})
 ],
 commerce:[
 pack('白底完整主图',{goal:'白底主图',scene:'纯白无缝背景',lighting:'大型柔光，控制反射',composition:'单品居中，完整展示',output:'image',preserve:true}),
 pack('生活方式场景图',{goal:'生活方式场景图',scene:'自然家庭空间',lighting:'自然窗光',composition:'使用中的真实比例',output:'image',preserve:true}),
 pack('材质微距细节',{goal:'材质细节图',scene:'简约摄影棚',lighting:'侧光，突出材质',composition:'微距材质特写',output:'image',preserve:true}),
 pack('桌面俯拍陈列',{goal:'商品组合展示',scene:'木质桌面',lighting:'大型柔光，控制反射',composition:'俯拍平铺',output:'image',preserve:true}),
 pack('极简高调广告',{goal:'商品揭示广告',scene:'简约摄影棚',lighting:'高调明亮',composition:'三分构图，留出文案空间',output:'image',preserve:true}),
 pack('手持比例展示',{goal:'UGC使用演示',scene:'城市生活场景',lighting:'自然窗光',composition:'手持展示，比例自然',camera:'跟随使用动作',output:'video',preserve:true}),
 pack('安静开箱视频',{goal:'开箱展示',scene:'木质桌面',lighting:'自然窗光',composition:'俯拍平铺',camera:'固定观察',hook:'开箱揭示',output:'video',preserve:true}),
 pack('商品环绕揭示',{goal:'商品揭示广告',scene:'简约摄影棚',lighting:'侧逆光，突出轮廓',composition:'单品居中，完整展示',camera:'围绕商品90°',output:'video',preserve:true}),
 pack('真实功能演示',{goal:'问题 → 解决方案',hook:'场景代入',camera:'跟随使用动作',cta:'了解适用场景',output:'video',preserve:true}),
 pack('穿搭细节视频',{category:'服装配饰',goal:'穿搭展示',lighting:'自然窗光',composition:'使用中的真实比例',camera:'缓慢推进细节',output:'video',preserve:true})
 ]};
const sceneRows=[
 ['湖边栈道','木质步道沿湖延伸，栏杆带自然木纹','栏杆边缘','湖面与远处树影','步道左右相通','微风轻动发丝，湖面细小涟漪','风声与轻微水声','sunset','clear','sunset','back'],
 ['街角咖啡馆','木质桌椅，靠窗座位，磨砂杯具','杯沿和桌角','柔和虚化的街道','入口在后方，窗户在侧面','咖啡热气缓缓升起','室内底声与远处街声','dawn','clear','window','side'],
 ['雨夜街道','潮湿柏油路面，沿街招牌与路灯','雨伞边缘','霓虹与车辆灯光','人行道与路口相连','细雨落下，地面泛起反光','雨声和远处车流','night','rain','neon','back'],
 ['温暖客厅','浅色墙面，布艺沙发，木质茶几','沙发扶手','书架与落地灯','门在后方，窗在侧面','窗帘轻微摆动','轻微室内底声','sunset','clear','window','side'],
 ['清晨卧室','棉质床品，木质床头柜，简洁空间','床沿','半透窗帘','房门在床侧','窗帘轻动，晨光缓慢变化','远处鸟鸣','dawn','clear','window','side'],
 ['现代办公室','玻璃隔断，整洁办公桌，金属与木材','桌面文件','工位与玻璃窗','走廊入口在后方','远处同事低幅活动','键盘声与低声交谈','noon','clear','window','side'],
 ['城市车站','站台地面，清楚的边界与候车区域','栏杆与长椅边缘','轨道与远处列车','站台入口在侧面','列车驶过，衣角轻动','列车声与站台环境声','sunset','clear','sunset','back'],
 ['古镇石桥','风化石桥，青石路，木质建筑','桥栏石纹','古镇屋檐与河道','桥两端连接街巷','薄雾缓慢流动','水声与风声','dawn','fog','overcast','side'],
 ['竹林小径','竹林夹道，潮湿泥土与落叶','虚焦竹叶','层层竹影','小径向林间延伸','竹叶随微风摆动','竹叶摩擦与鸟鸣','dawn','fog','overcast','side'],
 ['海边沙滩','自然沙地，海浪与远处地平线','少量沙粒','海面与天空','海岸线左右延伸','浪花缓慢推进，发丝飘动','海浪与海风','sunset','clear','sunset','back'],
 ['山间石阶','风化石阶与山岩，远处云层','石阶边缘','层叠山影','石阶上下连接','薄雾流动，草叶轻动','风声与远处鸟鸣','dawn','fog','overcast','side'],
 ['宫殿长廊','木柱长廊，石质地面，古典门窗','木柱边缘','连续门廊与庭院','长廊两侧与庭院相通','衣摆轻动，斑驳光影变化','轻微脚步与风声','sunset','clear','sunset','side'],
 ['现代厨房','整洁台面，浅色瓷砖，不锈钢器具','台面边缘','橱柜与窗户','厨房门在侧面','蒸汽缓慢升起','水声与器具轻响','dawn','clear','window','side'],
 ['图书馆','木质书架，阅读桌，柔和自然光','书脊与桌角','层叠书架','通道连接阅读区','偶尔有人翻页','翻页声与轻微脚步','noon','clear','window','side'],
 ['公园长椅','树荫覆盖的步道与木质长椅','树叶边缘','草地与远处行人','步道两侧相通','树叶轻动，光斑变化','鸟鸣与微风','sunset','clear','sunset','side'],
 ['地下停车场','混凝土柱，划线车位，局部照明','柱体边缘','车辆轮廓与通道','车道通向出口','远处灯光轻微变化','空旷混响与远处车声','night','cloudy','lamp','top'],
 ['旧公寓走廊','老旧墙面与木门，狭长走廊','门框边缘','走廊尽头灯光','各户门分列两侧','局部灯光微弱闪动','远处脚步与室内底声','night','rain','lamp','side'],
 ['酒店大堂','石材地面，柔软座椅，明亮通高空间','座椅边缘','接待台与玻璃入口','大门与电梯厅相连','远处人员低幅活动','轻微人声与行李轮声','noon','clear','window','front'],
 ['电梯内部','拉丝金属墙面，简洁按钮面板','金属门框','电梯后壁','单侧电梯门','灯光稳定，衣料自然微动','电梯低频运行声','night','clear','lamp','top'],
 ['天台夜景','水泥天台与安全栏杆，开阔空间','栏杆与屋顶结构','城市灯光','楼梯间出口在后方','风吹衣摆与发丝','风声与远处城市声','night','clear','moon','back'],
 ['摄影棚白底','纯白无缝背景与平整台面','干净台面边缘','均匀白色背景','画外工作区','主体材质反光保持稳定','安静室内底声','noon','clear','window','front'],
 ['花园小径','花草与石板步道，空间自然舒展','虚焦花朵','树木与藤架','小径通向庭院','花枝与叶片轻轻摆动','鸟鸣与虫声','dawn','clear','sunset','back'],
 ['雪中街巷','薄雪覆盖路面与屋檐','细小雪花','远处街灯','街巷通向路口','雪花缓慢落下','轻微风声与踩雪声','night','snow','lamp','side'],
 ['雨天公交站','玻璃站棚，湿润路面，金属长椅','玻璃雨滴','远处车辆与街道','候车区域面向道路','雨滴滑落，车辆经过','雨声与驶过车辆','sunset','rain','overcast','side']
 ];
PRESETS.scenes=sceneRows.map(([name,description,foreground,background,entrance,dynamics,sound,time,weather,lightSource,lightDirection])=>pack(name,{name,description,foreground,background,entrance,dynamics,sound,time,weather,lightSource,lightDirection,lightQuality:'soft',lightNote:'光线有明确来源，材质层次自然'}));
export const FACE_COMBOS=[
 ['温婉柔和','鹅蛋脸，轮廓柔和','杏眼，目光自然','柔和弧形眉','自然鼻梁','自然唇形','自然肤色，细小纹理可见'],
 ['阳光亲和','圆脸，面颊自然饱满','圆眼，深棕色虹膜','自然平眉','圆润鼻头','嘴角放松','自然肤色，保留细小瑕疵'],
 ['英气利落','清晰下颌，轮廓干净','细长眼型，视线稳定','略浓剑眉','直鼻梁','清晰唇峰','自然肤色，毛孔细节可见'],
 ['冷峻硬朗','方脸，颧骨与下颌清楚','深眼窝，目光平稳','自然浓眉','较直鼻梁','偏薄唇形','真实肤质，轻微细纹'],
 ['书卷清秀','修长脸型，轮廓自然','杏眼，深棕色虹膜','偏直细眉','小巧自然鼻型','自然唇形','自然均匀肤色'],
 ['成熟知性','长鹅蛋脸，骨相清楚','眼角有轻微细纹','自然弯眉','自然鼻梁','中等唇厚','保留细纹与真实毛孔'],
 ['雀斑生活脸','自然鹅蛋脸，保留左右差异','深棕色虹膜，内双','自然平眉','自然鼻型','自然厚度嘴唇','少量鼻颊雀斑，毛孔自然'],
 ['运动健康脸','轮廓清晰，面颊自然','目光明亮，眼型自然','自然浓眉','自然鼻梁','嘴角放松','小麦肤色，皮肤纹理真实'],
 ['古典端庄','鹅蛋脸，线条柔和','细长杏眼','柔和弧形细眉','自然直鼻','清晰唇峰','自然肤色，轻微皮肤纹理'],
 ['棱角辨识脸','高颧骨，明确下颌线','略深眼窝','偏直浓眉','鼻梁线条清楚','偏薄唇形','自然肤质，不额外磨皮'],
 ['圆润温暖','圆脸，自然饱满面颊','眼型柔和，眼角放松','自然弯眉','圆润鼻头','中等唇厚','真实毛孔，柔和肤色'],
 ['银发岁月脸','自然脸型，保留年龄感','眼角细纹，目光平稳','自然疏密眉形','自然鼻型','自然唇纹','保留细纹和年龄斑，不过度磨皮'],
 ['自然不对称脸','轻微左右差异，轮廓自然','双眼自然轻微差异','眉峰略有差异','自然鼻梁','自然嘴角','保留少量瑕疵与皮肤纹理']
].map(([name,face,eyes,brows,nose,lips,skin])=>({name,face,eyes,brows,nose,lips,skin}));

export const ACTING_COMBOS=[
 pack('警觉微转',{eyes:'从平静转警觉，眼球先向声源方向转动后再抬眼',brows:'眉毛轻微收紧',lips:'保持自然闭合',breathing:'听见声音时短暂停顿屏息',head:'眼神先动后头部极轻微跟随转动',posture:'双肩保持放松，不出现明显大幅转身'}),
 pack('克制隐忍',{eyes:'目光短暂下垂后重新抬起定住',brows:'眉峰几乎不动，保持克制',lips:'唇角轻抿半秒后缓缓放松',breathing:'呼吸偏浅后缓慢深呼气',head:'头部微收保持稳定',posture:'站姿/坐姿平稳，手部轻微收紧道具'}),
 pack('惊喜微滞',{eyes:'眼神瞬间凝住并略微亮起',brows:'眉毛轻挑后回到自然弧度',lips:'嘴唇微松微启准备开口',breathing:'吸气短促停住',head:'下颌微抬面向对方方位',posture:'手部动作停在原处不急于改变位置'}),
 pack('平静独处',{eyes:'目光停留在前方环境细节上，自然眨眼',brows:'眉眼舒展放松',lips:'嘴唇保持放松闭合',breathing:'均匀平缓呼吸',head:'头部保持自然安稳',posture:'双肩放松下沉，肢体舒展无多余晃动'})
];
const SUGGEST={
 title:['初次相见','回头回应','递出信件','看见真相','等待答案','商品细节','使用演示','结尾停留'],
 logline:['一次重逢，让未说出口的心意终于有了回应。','一个细小的道具，改变两人之间的关系。','从一个使用场景出发，展示商品的真实细节。'],
 intent:['通过固定镜头建立人物独处时的静谧秩序，为突然出现的画外声打破平静做铺垫。','以缓慢Dolly轨道物理推进聚焦眼神转变，放大人物由平静变为警觉的情绪张力。','用锁定机位固定观察细节微动作，在留白中传递未说出口的犹豫。'],
 spatial:['人物坐在靠窗木桌偏右三分线处，入口位于左前方，视线落在窗外不直视摄影机。','画外声源来自人物左前方入口，眼球先转向声源再轻转头，视线最终落点在入口方向，严禁看镜头。','人物位于步道中央偏右，背景光源在侧后方，与摄影机保持侧前45度自然观察位。'],
 negativeNotes:['禁止未授权切镜或用光学变焦替代物理推进、禁止手指畸形、禁止道具左右手互换或消失、禁止面部过度磨皮失去眼神光、禁止口型错位及自动字幕水印'],
 description:PRESETS.scenes.map(x=>x.data.description),
 foreground:['不设置明显前景','虚焦树叶','门框边缘','栏杆与桌角','玻璃上的雨滴','衣袖或肩部','花朵与草叶','杯沿与书页'],
 background:PRESETS.scenes.map(x=>x.data.background),entrance:PRESETS.scenes.map(x=>x.data.entrance),dynamics:PRESETS.scenes.map(x=>x.data.dynamics),sound:PRESETS.scenes.map(x=>x.data.sound),
 lightNote:['柔和主光保留面部层次，背景稍暗','逆光勾勒发丝，面部有自然环境补光','窗光在衣料上形成细腻明暗','灯光在湿润地面形成反射','商品反射受控，标签与包装清楚'],
 action:['人物缓慢走两步，在目标位置停下。','听见画外呼唤后短暂停顿，缓缓回头。','伸出右手，把道具递给对方，松手后收回。','抬眼看向对方，保持短暂停顿。','低头看向手中道具，手指轻轻收紧。','摄影机缓慢靠近商品，展示表面材质。'],
 startState:['人物站在画面左侧，朝向画面右侧，双手自然垂落。','人物坐在桌边，右手握着道具。','道具放在桌面中央，人物尚未伸手。','商品完整位于画面中央，标签朝向摄影机。'],
 endState:['人物站定，视线停在画外，持物保持原手。','人物已回头，面向来声方向，身体保持稳定。','道具已交到对方右手，原持有者收回手。','人物右手已经松开，道具留在桌面。','商品保持完整，标签正对摄影机，镜头停留。'],
 propStart:['折叠','展开','闭合','打开','完整','湿润','干燥'],propEnd:['折叠','展开','闭合','打开','轻微磨损','湿润','干燥'],
 audio:['自然环境底声','画外一声轻微呼唤，随后恢复环境声','脚步声与衣料摩擦声','接触道具时有清晰而轻微的材质声','只保留呼吸与环境底声','雨声稍减弱，突出对白'],
 music:['无背景音乐','轻柔原声吉他，结尾淡出','稀疏钢琴，保持低音量','低频氛围音，避免遮盖对白','轻快节奏，动作处轻微卡点'],
 dialogue:['等一下。','你终于来了。','我想把这个交给你。','我再想一想。','我们走吧。'],
 dialogueLanguage:['普通话','粤语','英语','日语','韩语'],
 start:['人物正前方','人物左侧面','人物右侧后方','道具上方','前景门框后方','从上镜固定中景构图起幅'],end:['沿光轴轻微推进至面部占画面主要区域，不改变构图关系','人物正面近处','人物右侧面','更远的环境位置','商品标签前方'],
 focusFrom:['前景道具','桌面信纸','窗上雨滴','手部'],focusTo:['人物眼睛','背景门口','商品标签','对方的手'],
 custom:[
  '纯正现实实拍质感，保留真实街道杂物、人物皮肤毛孔汗渍与日常棉麻衣褶，不修饰不摆拍',
  '90年代香港电影胶片质感，潮湿路面霓虹漫射，暗部带墨绿偏色，钨丝灯高光泛暖黄光晕',
  '王家卫式港风慢快门轻微动态拖影，茶餐厅玻璃与铁栅栏遮挡前景，情绪疏离而浓郁',
  '自然肤色，柔和高光，保留真实材质细节与细腻眼神光',
  '黑柔镜1/4柔光滤镜效果，高光温柔弥散，暗部干净通透有空气感',
  '低饱和电影叙事色调，背景克制留白，前景与主体空间层次清楚',
  '柯达35mm电影胶片颗粒，暗部厚重有密度，灯光边缘带自然橙红光晕（Halation）',
  '日系清透空气感胶片，高明度柔和天光，阴影略带青蓝透明感',
  '韩系浪漫影视打光，面光均匀温柔，发丝逆光勾勒清透轮廓',
  '变形宽银幕电影镜头，横向椭圆形散景光斑与克制蓝色水平炫光',
  '手机原相机日常街头直出，略深景深、真实自然曝光与呼吸感微晃',
  '2000年代千禧CCD卡片机直闪感，略高反差怀旧色彩与细腻数字噪点',
  '硬派黑色电影硬调布光，百叶窗条纹阴影，雨水反光清晰锐利',
  '新中式东方美学实拍，青瓦灰砖与温润木石材质，克制留白光影',
  '二维手绘日系赛璐璐动画质感，统一清晰线稿与平整明暗色块，不混入真人皮肤质感'
 ],
 restrictions:['人物身份、所选造型和关键道具跨镜保持一致。','不添加未指定人物、对白或画面文字。','保持动作自然、道具接触明确，不跳过交接过程。'],
 screenText:['不要求生成可读文字','信封右下角写“亲启”','指定文字后期添加'],
 material:['亚麻','棉质','皮革','磨砂金属','不锈钢','透明玻璃','陶瓷','木材','哑光塑料'],color:['黑色','米白色','深蓝色','暖棕色','银色','自然原色'],
 audience:['日常通勤人群','运动户外人群','家庭用户','喜欢简约设计的人群','注重材质细节的人群'],
 sellingPoints:['材质特点：填写实际面料或表面材质。','结构特点：填写可直接看到的设计。','使用方式：填写真实操作步骤。'],evidence:['用近景展示实际材质纹理','展示开合、按压或装配的真实过程','以相同条件拍摄已经验证的对照'],
 copy:['不添加画内文案','品牌名称由用户提供，后期准确叠加','商品名称与一句已确认卖点'],
 voice:['自然温和，语速适中','清晰简洁，停顿自然','低沉稳重','亲切口语，不夸张承诺'],
 notes:['保留安静停顿，不额外增加动作。','这是有意的时间跳跃。','本镜仅展示局部，完整空间在上一镜交代。']
};
export const AI_SUGGEST={
 idea:[
  '深夜暴雨后的香港深水埗茶餐厅，一对十年前拆伙的搭档偶遇拼桌，谁也没先开口，只靠一只停走的旧机械表认出彼此。',
  '早高峰地铁口外卖员撞翻了一位职场女白领的咖啡，本以为会被投诉，她却塞给他一把伞和半张未送完的生日蛋糕卡片。',
  '老小区昏暗楼梯间里，独居老人每天凌晨五点出门捡纸箱，却在门口发现年轻租客悄悄留下的热豆浆与修好的灯泡。',
  '九龙旧唐楼天台上，卧底警员与黑帮大哥在暴雨来临前最后一次对峙，枪口垂下时两人才发现各自手机里藏着同一通未拨电话。',
  '失意摄影师用淘来的千禧CCD相机拍街头路人，却在回看样张时发现镜头里连续三天出现了同一个正在道别的女孩。',
  '午后街角咖啡馆重逢的两位旧友，表面寒暄近况，实则桌面下的折叠信纸正在决定两人明天是否彻底诀别。',
  '古镇石桥清晨薄雾中，退休木匠坚持按老手艺修好最后一扇雕花木窗，只为等待出国十年的女儿推窗看一眼家乡日光。',
  '深夜24小时便利店里，疲惫的夜班店员帮一位失恋哭泣的女生热了杯关东煮，两句克制闲聊后各自迎向凌晨微光。',
  '高三复读生在老旧自习室发现课桌抽屉里的旧传呼机号，顺着街角电话亭打过去，竟接通了一段跨越二十年的家庭秘密。',
  '近未来赛博雨夜，负责清理记忆碎片的底层维修工，在销毁清单最后一条里听见了自己已故母亲的声音。',
  '一对新婚夫妻在除夕夜因回谁家过年拌嘴冷战，结果外卖员误送来的两份家乡饺子意外打破了客厅里的沉默。',
  '新中式茶室里两位久别重逢的老同学试探彼此这些年的虚荣与体面，直到窗外一场突如其来的雷雨打湿了窗台。'
 ],
 visualNotes:[
  '纯正现实实拍感，保留街边杂物、真实水泥墙与自然皮肤毛孔，杜绝AI磨皮',
  '90年代复古港片质感：茶餐厅绿瓷砖、霓虹倒影、微湿刘海与35mm胶片颗粒',
  '王家卫式抽帧与慢快门微拖影，暖绿与暗红霓虹交织，氛围暧昧克制',
  '手机原相机日常直出，轻微手持呼吸感，真实自然日光无多余滤镜',
  '柯达2383电影级暖调影调，阴影扎实通透，灯光边缘带自然橙红光晕',
  '日系高调空气感胶片，阴影带微青绿色，人物清透留白、风吹发丝自然',
  '韩系电影级柔和面光与发丝逆光，肤色温润清透，背景大光圈柔美虚化',
  '美式黑色悬疑硬调光影，冷蓝夜色对比局部钨丝灯暖光，湿滑沥青路面反光',
  '竖屏精品微短剧打光，人物面部受光清晰立体，情绪特写干净锐利',
  '千禧2000s复古CCD卡片机直闪质感，微过曝高光与怀旧家用生活气息',
  '新中式东方美学实拍，青瓦木窗斜射光柱，烟火茶气缓缓流动',
  '黑柔镜（Black Pro-Mist）柔和漫射高光，灯光处泛起克制空气感光晕',
  '法式新浪潮16mm黑白/低饱和街拍，自然天光下人物随性灵动',
  '近未来硬核写实科幻，冷冽不锈钢工业金属反光，避免廉价赛博光污染',
  '日系二维手绘赛璐璐动画，清晰均匀线稿与柔和光影，绝不混入真人皮肤',
  '高对比银盐黑白纪实，深黑阴影与细腻银盐颗粒感，强化面部皱纹故事感'
 ],
 language:['普通话','粤语（纯正港片风味）','港普（港味普通话）','台湾腔普通话','四川话 / 重庆话','东北话','上海话 / 吴语','闽南语','陕北方言','英语','英式英语','日语','韩语','中粤双语 / 中英夹杂'],
 dialogueStyle:[
  '自然口语，简短克制有来有回',
  '港式地道对白：句短干脆、带真实市井烟火与弦外之音',
  '王家卫式文艺独白 + 极简试探对话，节奏留白',
  '幽默斗嘴，接话快、轻松有梗、生活气十足',
  '克制含蓄，话只说七分，靠眼神停顿传情',
  '针锋相对，短促逼问与反问交锋，冲突张力强',
  '温柔真诚，像现实生活中熟人深夜谈心',
  '微短剧高能爽感台词：立意直接、反转利落、情绪到位',
  '悬疑审讯/试探感：语气平静却字字紧逼，停顿制造压迫',
  '纪实生活感聊天：允许自然卡顿、低声叹气与环境交互词',
  '古风江湖简练台词：言简意赅、半文半白不堆砌辞藻',
  '情侣亲密斗气：表面嘴硬其实关心，口是心非'
 ],
 castName:['陈默（克制隐忍主角）','林夏（敏感细腻女主）','周Sir / 港片重案探员','阿强 / 街头大排档老板','张经理 / 高冷上司','老周 / 沉默父亲','苏苏 / 活力闺蜜','神秘来客','外卖员小李','便利店夜班店员','资深律师','画外旁白讲述者'],
 castNotes:[
  '纯现实生活穿搭：洗旧纯棉T恤、牛仔裤或宽松格子衬衫，零精致摆拍与滤镜感',
  '90年代港风复古穿搭：宽肩旧西装外套或花衬衫、微湿额前碎发，带街头汗意',
  '雨夜港片风：深色长风衣肩头微湿，领口略敞开，眼神疲惫却坚定',
  '干练都市职场穿搭：素色垂坠衬衫搭配西装长裤，低马尾/利落短发，少配饰',
  '青春校园自然感：宽松校服/白衬衫，素颜无明显妆容，发梢随风微乱',
  '市井劳作烟火气：深色工装夹克或围裙，袖口挽起，指关节与虎口带真实生活痕迹',
  '日系松弛日常感：米白亚麻宽松衬衫配卡其裤，帆布包，自然碎发',
  '韩系精致约会感：柔软针织开衫搭配风衣，低饱和清透淡妆，眼神温柔',
  '美式复古街头：做旧皮衣或连帽卫衣，神态冷峻克制，保留胡茬或雀斑',
  '新中式雅致感：亚麻立领盘扣衬衫，温润素雅，沉稳书卷气质',
  '银发苍老长辈：花白头发、清晰眼角皱纹与岁月老年斑，穿着旧毛衣',
  '古装侠客质感：做旧粗麻布长衫、皮质护腕与长剑，风尘仆仆非影楼新衣'
 ],
 bgmNotes:[
  '前5秒仅保留真实雨声/街道底声不加音乐；第6秒钢琴低音轻轻切入；对白期间配乐自动压低40%',
  '90年代港风怀旧萨克斯搭配远方霓虹车流声，情绪高潮后突然抽空配乐留静默',
  '全程以环境底声（海浪/咖啡馆杯碟/时钟滴答）为主，仅在最后5秒淡入温暖木吉他收尾',
  '极简大提琴低音脉冲随悬疑推进逐步增强，但说话期间严禁乐器抢人声频率',
  '王家卫式慵懒重复弦乐旋律，营造潮湿闷热的时间滞留感',
  '前段用轻微黑胶噪音与Lo-Fi电钢铺底，冲突反转瞬间急刹并切换到低频鼓点',
  '空灵古筝泛音配合远处风竹沙沙声，留白处仅保留竹笛长音回响',
  '明快弹拨弦乐配合动作节拍点精准落拍，营造轻松治愈喜剧感',
  '纯无配乐写实路线：全程仅依靠脚步声、衣料摩擦声、门锁金属声与人物呼吸支撑张力',
  '微短剧强节奏配乐：第1秒直接重拍抓耳，中段压低托住台词，结尾反转处强音定格'
 ],
 genre:['现实生活流（写实剧情）','90年代香港风爱情 / 怀旧','香港警匪 / 江湖卧底动作','都市现实情感剧','悬疑烧脑 / 情绪反转','家庭亲情 / 代际和解','都市职场暗战 / 反击','深夜市井治愈小品（菜市场/大排档）','青春校园 / 年代回忆','民国谍战 / 旧梦往事','新中式 / 东方生活美学','古装武侠 / 江湖恩怨','东方仙侠 / 奇幻冒险','硬核近未来写实科幻','赛博朋克 / 记忆迷局','美式黑色犯罪 / 公路逃亡','轻松都市喜剧 / 斗嘴日常','人文观察式微纪录片','温情品牌微电影','真实场景商品带货短剧'],
 tone:['贴地现实，烟火气足、细节克制','复古港片迷离宿命感，暧昧又苍凉','先抑后扬，前面平静克制、末尾强情绪爆发','轻松诙谐有梗，结尾意料之外反转','冷峻悬疑紧绷，层层剥开压迫感','温柔治愈留白，像生活里真实发生的一次停顿','紧凑高频反转，前3秒抛钩子、节奏极快','文艺慢节奏，依靠光影、微表情和声音留余韵','热血燃向冲突，动作与鼓点爽感拉满','黑色幽默荒诞感，一本正经的荒唐反转','悲伤隐忍，眼泪悬而不落，靠呼吸与手部微动作传情','明快日常喜剧，节奏轻快温暖不尴尬'],
 characters:['两位十年前分道扬镳的旧搭档/恋人，久别重逢互相试探','香港街市茶餐厅阿姐与沉默寡言的夜班出租车司机','表面客套其实暗暗较劲的职场上下级/前任','一对嘴硬心软的中国传统父女/母子，用小事化解多年隔阂','互为对手却被迫共处狭小空间的卧底与悍匪','疲惫却依然温柔的都市外卖员与凌晨下班的女程序员','性格截然相反的一对闺蜜/兄弟（一个社恐慢热，一个话痨热心）','怀揣秘密的古董店老板与意外闯入的年轻记者','古装师徒或江湖旧敌，在风雨客栈狭路相逢','独居老人与刚搬来隔壁的失意年轻人','同一屋檐下因为小事拌嘴的小夫妻','单人独角戏：一位在关键选择前迟疑的普通成年人'],
 setting:['90年代风格香港旺角霓虹夜市 / 铁皮大排档，刚下过阵雨地面反光','昏暗狭小的复古港式茶餐厅卡座，绿色瓷砖、吊扇慢转与窗外霓虹','清晨雾气未散的老小区菜市场 / 旧楼楼梯间，生活杂物真实','雨夜街角 24 小时便利店，室内冷白日光灯与窗外雨丝暖街灯对比','九龙旧唐楼风起天台，铁丝网栏杆与远处密集都市灯火','午后靠窗咖啡馆木桌，斜射窗光、蒸汽缓慢升起','夜晚加班后寂静的写字楼工位，唯一台灯与屏幕冷光','黄昏海边渡轮甲板 / 渔港长堤，海风吹乱发丝、浪拍堤岸','青石古镇石桥清晨薄雾，青瓦屋檐与潺潺流水','老家客厅饭桌前，暖色钨丝吊灯、一碗热汤与旧挂钟','暴雨夜老旧公寓狭窄走廊，声控灯忽明忽暗','未来雨夜高架桥天台与闪烁全息广告牌'],
 conflict:['一方表面平静说“没事”，实则隐瞒着即将彻底离开的真相','十年前的误会至今未解，一个旧物件突然出现揭开当年选择','两人各自背负不得不做的任务，在身份与感情间陷入两难','原本微小的日常摩擦（一杯咖啡/一把伞/一张票）意外撬动积压多年的委屈','重要人物意外闯入原本计划好的告别场面，打乱一切伪装','时间倒计时只剩最后几分钟，双方必须在沉默与坦白间做出决断','一方以为早已结束的羁绊，另一方其实偷偷守了多年','为了保护对方而故意说出伤人的假话，形成深刻戏剧反差','在高度防备的试探交谈中，不经意的一句方言或动作暴露真实身份','面对现实生活重压想放弃时，陌路人一个不经意善意带来的动摇'],
 ending:['无言对视后克制转身离开，留给观众绵长的开放式余韵','看似冷淡分手，但最后一个手部细节暴露了依然保留的温柔','出人意料的戏剧性反转：前面以为的局外人其实才是推动一切的人','双方没有煽情和解，只是一起默默吃完一碗面，回归现实继续往前走','表面平静达成交易，离开背影却彻底揭露彼此真实情绪的崩塌','一句轻描淡写的关键台词落地，配乐渐弱至城市底声中黑屏收尾','破涕为笑的温暖小结局，现实虽然依然忙碌但内心重新亮起灯','危险看似解除却在最后1秒留下更深一层悬念钩子','旧道具物归原主或安静留在桌面中央，作为两段关系的新起点','喜剧误会当场揭穿，两人面面相觑后尴尬笑场结束'],
 audience:['喜欢真实生活质感与电影级叙事短片的观众','港片迷、复古胶片与王家卫氛围美学爱好者','抖音 / 快手 / 红果等竖屏精品短剧观众（偏重前3秒抓人+反转）','B站 / 视频号质感剧情片与影视级AI导演创作人群','小红书精致生活美学、情绪治愈与日韩电影感观众','悬疑烧脑 / 硬核犯罪剧情片爱好者','国风 / 武侠 / 新中式美学文化受众','海外 TikTok / YouTube Shorts / Reels 跨语种短剧观众','品牌微电影与高质量生活方式商品广告观众'],
 keyLine:['你块表好耐没行了，同你一样。','等一下……事情不是你听到的那样。','好久不见，你瘦了一点。','这把伞你拿去，路还长着呢。','原来这么多年，你一直没换过密码。','别回头，走过去就行了。','下这么大雨，进屋坐下喝口热茶再走吧。','这一次，我不会再替你做决定了。','老板，加个蛋，不要葱。','你到底想我怎么选？'],
 avoid:['严禁出现AI塑料感光滑假脸、过度网红磨皮、霓虹炫彩乱闪等虚假质感','严禁出现自动字幕、平台水印、画面多余乱入路人与多余手指变形','严禁莫名其妙的大幅度镜头晃动、无意义航拍与廉价慢动作','严禁人物台词尴尬说教或强行煽情流泪，保持现实生活克制分寸','严禁道具突然消失、左右手无故互换或人物服装在镜头间穿帮变化','避免过于奢华不切实际的豪宅布景，保持贴地气真实环境纹理'],
 notes:['节奏与机位要极度克制，多用固定机位与微表情特写传达潜台词，不要过度炫技运镜。','全程按现实实拍逻辑设计：室内外光线遵循真实物理光源，服饰有自然褶皱与旧感。','第1镜前3秒必须直接甩出核心悬念或视觉钩子，让观众立刻明白人物处境。','严格遵守一镜接一镜连续性：上一镜结尾的人物站位、持物手别与视线方向严丝合缝承接到下一镜。','高潮转折前特意留出 1 秒完全静默呼吸停顿，再切出反打镜头制造冲击。','如果是港风场景，请突出潮湿街面、铁闸、旧招牌等细节元素与粤语/港味节奏。']
};
export function suggestionsFor(path,label=''){
 const key=path.split('.').at(-1);
 if(path.startsWith('aiBrief.')){
  if(path.endsWith('.occupation'))return AI_CAST_OCCUPATION_EXAMPLES;
  if(path.endsWith('.notes')&&path.includes('cast'))return AI_SUGGEST.castNotes;
  if(path.endsWith('.name')&&path.includes('castProfiles'))return AI_SUGGEST.castName;
  if(key==='bgmMood')return AI_BGM_MOOD_EXAMPLES;
  return AI_SUGGEST[key]||[];
 }
 if(path.startsWith('characters.'))return ATTRIBUTES[key]|| (key==='name'?['林夏','周屿','顾宁','许川','苏禾','陈砚']:SUGGEST[key]||[]);
 if(path.includes('.acting.'))return ({eyes:['从平静转为警觉，眼球先转向声源','目光微垂后再缓缓抬起','目光稳定停留在目标方向'],brows:['眉毛轻微收紧','眉心保持放松','眉毛微挑呈惊讶感'],lips:['保持自然闭合','短暂轻抿后微松','略微开启准备开口'],breathing:['听见声响时短暂停顿屏息','一次缓慢深呼气','保持匀速微弱呼吸'],head:['只发生极轻微向声源方向转动','保持静止不动','略微低头再稳住'],posture:['双肩保持放松，不出现明显身体转向','坐姿保持静止，仅手指细微收紧','重心稳住，持物手不切换左右']})[key]||[];
 if(path.includes('.continuitySpec.'))return ({character:['保持同一张脸、年龄质感、深棕色齐肩直发与米白色衬衫完全一致'],prop:['关键道具始终由原手持握，形态与折痕不变，严禁左右手互换'],space:['人物始终处于同一位置，桌椅、台灯与门窗相对方位固定不变'],lighting:['主光来源方位、冷暖反差与面部阴影比例保持一致'],action:['本镜动作无缝承接上一镜结束最后一帧的姿态与视线']})[key]||[];
 if(path.startsWith('scenes.')&&key==='name')return PRESETS.scenes.map(x=>x.name);
 if(path.startsWith('props.')&&key==='name')return ['折叠信纸','黄铜钥匙','透明雨伞','手机','咖啡杯','行李箱','玉佩','商品包装盒'];
 if(path.startsWith('props.')&&key==='appearance')return ['米白色纸张，对折，边角轻微磨损','黄铜材质，系有绿色布环','透明伞面，黑色长柄','哑光外壳，形状与颜色保持一致'];
 if(path.startsWith('references.'))return ({name:['人物外貌参考','场景空间参考','道具细节参考','商品主图参考','音色参考'],controls:['仅人物外貌、发型和服装','仅场景空间与光线','仅道具形状、材质和颜色','仅摄影机运动路径','仅角色音色'],excludes:['不采用背景、其他人物或文字','不采用原人物身份与服装','不采用原素材中的台词与音乐']})[key]||[];
 if(path==='commerce.name')return ['亚麻衬衫','保温杯','护肤乳','无线耳机','手提包','陶瓷杯','台灯'];
 return SUGGEST[key]||[];
}
export function fieldSize(path,type='text',area=false){if(type==='number')return 'tiny';if(area)return 'wide';const k=path.split('.').at(-1);if(['name','age','gender','height','build','hairColor','language','dialogueLanguage','variant','propStart','propEnd','purpose','intensity','voiceType','emotion','orbit','direction','material','color','start','end','focusFrom','focusTo'].includes(k))return ['name','start','end'].includes(k)?'short':'tiny';if(['description','action','intent','spatial','negativeNotes','controls','excludes','sellingPoints','evidence','logline','lightNote','restrictions','outfit'].includes(k))return 'wide';return 'medium';}
export function relationFor(path){if(path.endsWith('.sceneId'))return {kind:'scenes',label:'场景',view:'scenes'};if(/\.(speakerId|ownerId|characterIds)$/.test(path))return {kind:'characters',label:'人物',view:'characters'};if(path.endsWith('.propId'))return {kind:'props',label:'道具',view:'characters'};if(path==='commerce.referenceId')return {kind:'references',label:'参考素材',view:'references'};return null;}
const appearance=['age','gender','height','build','appearance','skin','face','eyes','brows','nose','lips'];
export function lockForField(key){return appearance.includes(key)?'appearance':['hair','hairColor'].includes(key)?'hair':['outfit','accessories'].includes(key)?'outfit':['voice','language'].includes(key)?'voice':null;}
export function planPreset(target,data,{character=false,emptyOnly=false}={}){const changes=[],skipped=[];for(const [key,value] of Object.entries(data)){if(character&&target.locks?.[lockForField(key)]){skipped.push({key,reason:'已锁定'});continue;}if(emptyOnly&&target[key]!==undefined&&target[key]!==''&&(!Array.isArray(target[key])||target[key].length)){skipped.push({key,reason:'已有内容'});continue;}if(JSON.stringify(target[key])!==JSON.stringify(value))changes.push({key,value});}return {changes,skipped};}
