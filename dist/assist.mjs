import {ATTRIBUTES} from './builder.mjs';
const pack=(name,data)=>({name,data});
export const PRESETS={
 style:[
 pack('徕卡暖调人像',{look:'leica',medium:'digital',genre:'romance',color:'warm',texture:['skin','soft']}),
 pack('手机日常记录',{look:'phone',medium:'digital',genre:'urban',color:'natural',texture:['skin']}),
 pack('手机自拍视频',{look:'selfie',medium:'digital',genre:'urban',color:'natural',texture:['clean']}),
 pack('35mm电影叙事',{look:'cinema',medium:'35mm',genre:'urban',color:'muted',texture:['grain','soft']}),
 pack('日系生活胶片',{look:'cinema',medium:'16mm',genre:'japanese',color:'natural',texture:['grain','halation']}),
 pack('韩系清透爱情',{look:'cinema',medium:'digital',genre:'korean',color:'warm',texture:['skin','soft']}),
 pack('复古港片夜色',{look:'cinema',medium:'35mm',genre:'hongkong',color:'tealorange',texture:['grain','halation']}),
 pack('冷蓝悬疑犯罪',{look:'cinema',medium:'digital',genre:'mystery',color:'cool',texture:['clean']}),
 pack('黑白纪实',{look:'documentary',medium:'35mm',genre:'urban',color:'bw',texture:['grain','skin']}),
 pack('VHS复古家庭',{look:'documentary',medium:'vhs',genre:'urban',color:'warm',texture:['diffusion']}),
 pack('DV街头记录',{look:'documentary',medium:'dv',genre:'urban',color:'natural',texture:['clean']}),
 pack('Super8回忆',{look:'cinema',medium:'super8',genre:'romance',color:'warm',texture:['grain','halation']}),
 pack('写实古装武侠',{look:'cinema',medium:'35mm',genre:'wuxia',color:'muted',texture:['grain','soft']}),
 pack('云雾东方仙侠',{look:'cinema',medium:'digital',genre:'fantasy',color:'cool',texture:['diffusion','halation']}),
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
 pack('固定双人对白',{framing:'medium',angle:'eye',composition:'thirds',move:'fixed',lens:'50',focus:'subject',stability:'tripod',rotation:'none',zoom:'none'}),
 pack('缓推情绪近景',{framing:'mediumClose',angle:'eye',composition:'thirds',move:'push',speed:'slow',lens:'85',focus:'eyes',stability:'gimbal'}),
 pack('侧跟行走',{framing:'mediumFull',angle:'eye',move:'track',speed:'even',lens:'35',focus:'subject',stability:'gimbal'}),
 pack('背后跟随',{framing:'full',angle:'eye',composition:'center',move:'follow',speed:'even',lens:'35',stability:'handheld'}),
 pack('拉远揭示空间',{framing:'medium',angle:'eye',move:'pull',speed:'slow',lens:'35',focus:'deep',stability:'dolly'}),
 pack('90°环绕人像',{framing:'medium',angle:'eye',move:'orbit',orbit:90,direction:'cw',subjectTurn:false,speed:'slow',lens:'50',stability:'gimbal'}),
 pack('180°逆时针环绕',{framing:'mediumFull',move:'orbit',orbit:180,direction:'ccw',subjectTurn:false,speed:'slow',lens:'35',stability:'gimbal'}),
 pack('360°完整展示',{framing:'full',move:'orbit',orbit:360,direction:'cw',subjectTurn:false,speed:'even',lens:'35',stability:'gimbal'}),
 pack('低机位人物登场',{framing:'mediumFull',angle:'low',composition:'center',move:'push',speed:'slow',lens:'35'}),
 pack('高机位环境观察',{framing:'wide',angle:'high',move:'fixed',lens:'24',focus:'deep',stability:'tripod'}),
 pack('顶视桌面细节',{framing:'detail',angle:'top',composition:'center',move:'fixed',lens:'50',focus:'subject',stability:'tripod'}),
 pack('过肩人物反应',{framing:'mediumClose',angle:'shoulder',composition:'thirds',move:'fixed',lens:'85',focus:'eyes'}),
 pack('手持纪录视角',{framing:'medium',angle:'eye',move:'follow',lens:'35',speed:'even',stability:'handheld'}),
 pack('商品微距推进',{framing:'detail',angle:'eye',move:'push',speed:'slow',lens:'macro',focus:'subject',stability:'dolly'}),
 pack('前景到人物拉焦',{framing:'medium',angle:'eye',move:'stationary',lens:'50',focus:'rack',focusFrom:'前景道具',focusTo:'背景人物眼睛',rotation:'none',zoom:'none'}),
 pack('升起展开空间',{framing:'wide',move:'rise',speed:'slow',lens:'24',focus:'deep',stability:'gimbal'})
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

const SUGGEST={
 title:['初次相见','回头回应','递出信件','看见真相','等待答案','商品细节','使用演示','结尾停留'],
 logline:['一次重逢，让未说出口的心意终于有了回应。','一个细小的道具，改变两人之间的关系。','从一个使用场景出发，展示商品的真实细节。'],
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
 start:['人物正前方','人物左侧面','人物右侧后方','道具上方','前景门框后方'],end:['人物正面近处','人物右侧面','更远的环境位置','商品标签前方'],
 focusFrom:['前景道具','桌面信纸','窗上雨滴','手部'],focusTo:['人物眼睛','背景门口','商品标签','对方的手'],
 custom:['自然肤色，柔和高光，保留真实材质细节','低饱和画面，背景克制，主体层次清楚','轻微胶片颗粒，高光边缘带少量光晕'],
 restrictions:['人物身份、所选造型和关键道具跨镜保持一致。','不添加未指定人物、对白或画面文字。','保持动作自然、道具接触明确，不跳过交接过程。'],
 screenText:['不要求生成可读文字','信封右下角写“亲启”','指定文字后期添加'],
 material:['亚麻','棉质','皮革','磨砂金属','不锈钢','透明玻璃','陶瓷','木材','哑光塑料'],color:['黑色','米白色','深蓝色','暖棕色','银色','自然原色'],
 audience:['日常通勤人群','运动户外人群','家庭用户','喜欢简约设计的人群','注重材质细节的人群'],
 sellingPoints:['材质特点：填写实际面料或表面材质。','结构特点：填写可直接看到的设计。','使用方式：填写真实操作步骤。'],evidence:['用近景展示实际材质纹理','展示开合、按压或装配的真实过程','以相同条件拍摄已经验证的对照'],
 copy:['不添加画内文案','品牌名称由用户提供，后期准确叠加','商品名称与一句已确认卖点'],
 voice:['自然温和，语速适中','清晰简洁，停顿自然','低沉稳重','亲切口语，不夸张承诺'],
 notes:['保留安静停顿，不额外增加动作。','这是有意的时间跳跃。','本镜仅展示局部，完整空间在上一镜交代。']
};
export function suggestionsFor(path,label=''){
 const key=path.split('.').at(-1);
 if(path.startsWith('characters.'))return ATTRIBUTES[key]|| (key==='name'?['林夏','周屿','顾宁','许川','苏禾','陈砚']:SUGGEST[key]||[]);
 if(path.startsWith('scenes.')&&key==='name')return PRESETS.scenes.map(x=>x.name);
 if(path.startsWith('props.')&&key==='name')return ['折叠信纸','黄铜钥匙','透明雨伞','手机','咖啡杯','行李箱','玉佩','商品包装盒'];
 if(path.startsWith('props.')&&key==='appearance')return ['米白色纸张，对折，边角轻微磨损','黄铜材质，系有绿色布环','透明伞面，黑色长柄','哑光外壳，形状与颜色保持一致'];
 if(path.startsWith('references.'))return ({name:['人物外貌参考','场景空间参考','道具细节参考','商品主图参考','音色参考'],controls:['仅人物外貌、发型和服装','仅场景空间与光线','仅道具形状、材质和颜色','仅摄影机运动路径','仅角色音色'],excludes:['不采用背景、其他人物或文字','不采用原人物身份与服装','不采用原素材中的台词与音乐']})[key]||[];
 if(path==='commerce.name')return ['亚麻衬衫','保温杯','护肤乳','无线耳机','手提包','陶瓷杯','台灯'];
 return SUGGEST[key]||[];
}
export function fieldSize(path,type='text',area=false){if(type==='number')return 'tiny';if(area)return 'wide';const k=path.split('.').at(-1);if(['name','age','gender','height','build','hairColor','language','dialogueLanguage','variant','propStart','propEnd','purpose','intensity','voiceType','emotion','orbit','direction','material','color','start','end','focusFrom','focusTo'].includes(k))return ['name','start','end'].includes(k)?'short':'tiny';if(['description','action','controls','excludes','sellingPoints','evidence','logline','lightNote','restrictions','outfit'].includes(k))return 'wide';return 'medium';}
export function relationFor(path){if(path.endsWith('.sceneId'))return {kind:'scenes',label:'场景',view:'scenes'};if(/\.(speakerId|ownerId|characterIds)$/.test(path))return {kind:'characters',label:'人物',view:'characters'};if(path.endsWith('.propId'))return {kind:'props',label:'道具',view:'characters'};if(path==='commerce.referenceId')return {kind:'references',label:'参考素材',view:'references'};return null;}
const appearance=['age','gender','height','build','appearance','skin','face','eyes','brows','nose','lips'];
export function lockForField(key){return appearance.includes(key)?'appearance':['hair','hairColor'].includes(key)?'hair':['outfit','accessories'].includes(key)?'outfit':['voice','language'].includes(key)?'voice':null;}
export function planPreset(target,data,{character=false,emptyOnly=false}={}){const changes=[],skipped=[];for(const [key,value] of Object.entries(data)){if(character&&target.locks?.[lockForField(key)]){skipped.push({key,reason:'已锁定'});continue;}if(emptyOnly&&target[key]!==undefined&&target[key]!==''&&(!Array.isArray(target[key])||target[key].length)){skipped.push({key,reason:'已有内容'});continue;}if(JSON.stringify(target[key])!==JSON.stringify(value))changes.push({key,value});}return {changes,skipped};}
