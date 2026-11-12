# 镜序 · AI短剧提示词工作台

浏览器本地优先的中文创作工具：选择人物、影像质感、场景与摄影，填写分镜时间和动作，整理可复制提示词。

## 使用

线上版本以交付消息中的实际发布链接为准。新建站点保持仅本人可访问。

本地运行需要 Node.js 20 或以上，无需安装依赖：

```powershell
node server.mjs
```

打开 `http://127.0.0.1:4173`。必须通过HTTP运行，直接双击HTML文件不能可靠加载模块和使用本地存储。

```powershell
node --test tests/core.test.mjs
node --check dist/app.mjs
```

## 已实现

- 快速与导演模式，同一项目数据随时切换。
- 12套起步模板；多个本地项目、复制项目、JSON备份和恢复。
- 摄影观感、介质、类型、色彩、纹理；自定义词条、收藏及使用频次排序。
- 多角色档案、五官快捷组合、外貌/发型/服装/声音锁定、角色模板与造型版本。
- 场景、天气、时段、光源、光线方向和质地；人物、摄影机与主光二维位置示意。
- 景别、机位、构图、焦段观感、运镜、环绕方向与角度、旋转、变焦、对焦和稳定方式。
- 分镜新增、复制、删除、拖动/上下排序、基础拆合镜、稳定镜头ID、撤销和重做。
- 项目时间轴、镜内动作时间段、顺序与自由起点、总时长、起止状态和持物继承。
- 计划生成素材时长、剪辑入出点，与成片时长分别记录。
- 表演预设、微动作、对白及语言/说话者/时间窗、音效、配乐和文本语速估计。
- 本地图片/音频/视频预览；计划素材、用途、控制/排除范围与逐镜绑定。
- 完整、单镜、精简、按秒、按镜头、分镜表、首尾帧、挂载清单和生成剪辑计划输出。
- 内置词条中英对照；独立手工文本版本；TXT、CSV、JSON和浏览器打印导出。
- 基础时长、摄影互斥、引用、已声明持物状态、对白窗口、景别可见性和素材用途检查。
- 桌面三栏、手机分步导航与预览抽屉；明确输入标签、键盘焦点和减少动态效果支持。

## 数据与边界

项目保存在当前浏览器的 IndexedDB；偏好和角色模板保存在 localStorage。没有账号同步，也不会自动向生成平台上传素材。清理浏览器数据可能清除本地项目，应定期导出完整JSON。参考文件单个上限8MB；完整备份可以携带文件数据。

上传素材仅提供本地预览和人工用途标记，不执行图像或音频分析。二维示意和模板小图是构图示意，不是已生成的电影画面。对白时长属于文本估计，需通过实际录音核验。

目前目标平台使用通用自然语言输出，未针对各平台版本进行生成实测。8K、帧率、画幅和秒数是创作/交付目标，真实能力由对应平台入口决定。完整自由文本英文翻译、AI拆剧本和实际图片/视频生成尚未接入。英文模式保留人物、剧情和台词等用户自由文本原文。

拆合镜会预览处理方式；已有对白或细分时间段时，要求先手动安排内容归属，防止静默损失。跨镜检查只核对已结构化声明的事实，不能保证实际生成画面不穿帮。

## 工程结构

`dist/index.html` 为静态入口，`dist/style.css` 为界面样式，`dist/catalog.mjs` 为词库、模板和来源，`dist/model.mjs` 为时间、继承、检查和输出，`dist/storage.mjs` 为本地存储，`dist/app.mjs` 为交互界面。无外部CDN、字体或运行时依赖。

`.openai/hosting.json` 保存站点身份与静态托管目录，不包含凭据。源代码包不包含发布凭据、个人项目或浏览器存储。

## 来源与改编说明

创作方法参考以下公开项目，词库与编辑器以统一字段独立组织。核对日期：2026-11-12。

| 项目 | 参考部分 | 仓库标示许可证 |
|---|---|---|
| [jnMetaCode/ai-shortfilm-prompts](https://github.com/jnMetaCode/ai-shortfilm-prompts) | 主题、主体、影像与时间轴组织 | MIT |
| [Krenlis/director-craft-framework](https://github.com/Krenlis/director-craft-framework) | 镜头职责、可见表演与光影动机 | MIT |
| [zenstory-ai/drama-skills](https://github.com/zenstory-ai/drama-skills) | 身份/造型、起止状态与连续性 | MIT |
| [shyman159/seedance-prompts-skill](https://github.com/shyman159/seedance-prompts-skill) | 声画时间安排与视听分类；仓库保留mantoufan版权说明 | MIT |
| [jacobye2017-afk/jacob-ye-seedance-prompt](https://github.com/jacobye2017-afk/jacob-ye-seedance-prompt) | Jacob Ye的素材职责、微表演与结束状态方法 | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| [UnderleveledBuilder/awesome-short-drama-skills](https://github.com/UnderleveledBuilder/awesome-short-drama-skills) | 资料目录和阶段分类 | CC0 1.0 |

改编内容为网站中的字段组织、简化示例、原创预设、提示词组合方式及检查逻辑。没有将第三方仓库的“铁律”当作所有模型的保证，也没有复制仓库中的成品影片、图片或完整示例提示词。

## V1.1 更新
新增从零开始（首次使用为空项目）、紧凑单选下拉框、分组人物属性选择（支持自定义）、窄秒数输入和固定分镜工具栏。新增电商模式，提供商品主图、场景图、广告视频与分段脚本的规则整理。来源参考 fal-ai-community/skills 的 commercial、xianyu110/ecommerce-video-skills 的 hook-3s-script、vargHQ/ecommerce-ai-video-skills；只借鉴字段和创作方法，界面与组合逻辑独立实现，不复制成品提示词。
