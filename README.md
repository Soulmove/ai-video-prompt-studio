<div align="center">

# 镜序 · AI Video Prompt & Short-Film Studio（AI 视频与短剧提示词工作台）

**超前一代导演级 AI 视频提示词与多镜头分镜工作台（AI Video Prompt Studio · Storyboard Continuity · Local-First · Zero Dependencies）**

[🌐 在线静态体验 (GitHub Pages)](https://soulmove.github.io/ai-video-prompt-studio/) · [简体中文](README.md) · [English](README.en.md) · [全配置与使用手册](docs/CONFIGURATION.zh-CN.md) · [Configuration (EN)](docs/CONFIGURATION.en.md)

[![Live Demo](https://img.shields.io/badge/Demo-GitHub%20Pages-brightgreen?logo=githubpages)](https://soulmove.github.io/ai-video-prompt-studio/)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-green.svg)](#快速开始本地与在线部署)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-blue.svg)](#核心看点与工程亮点)

<br>

<img src="dist/assets/creative-still.jpg" alt="镜序 · 创作首页电影氛围概念图" width="760" />

<sub>创作首页电影氛围概念图（原创 AI 生成概念静帧，详见 <a href="ASSETS.md">ASSETS.md</a>）</sub>

</div>

---

## 🌐 立即在线体验

无需下载代码或安装任何环境，点击下方链接即可直接在浏览器里打开完整工作台：

👉 **GitHub Pages 在线体验地址**：https://soulmove.github.io/ai-video-prompt-studio/

> **在线体验版使用提示（纯静态托管模式）**：
> - **开箱即用**：12 套故事/广告模板、快速/导演/电商三模式切换、角色与光影轴线编排、分镜时间轴、6 大类 110 项转场表、10 种提示词视图与 `中/EN` 导出、`IndexedDB` 自动草稿保存、`.jingxu.json` 导出与导入恢复——全部在你的浏览器本地直接运行，无需注册账号。
> - **AI 自动填写用法**：进入左侧「服务连接」，填写你自己的 **Google Gemini API Key** 并保持默认的 **「浏览器直连」** 即可（密钥仅保存在当前页面内存中；请注意“服务器转发”模式需自建本地 `node server.mjs` 或 Cloudflare Workers 才能使用）。

---

## 🔮 为什么说「镜序」超前？—— 看点与未来 1–2 年行业预测

如果你用过市面上当前的 AI 视频工具，大概率遇到过同样的问题：**单镜头像开盲盒，多镜头一换镜就换脸、换衣服、光源方向乱跳、人物手里拿着的东西下个镜头凭空消失、台词长度和镜头秒数永远对不上。**

> **核心预测与看点：**  
> **目前这套工作台定义的分镜与导演控制粒度，实际上已经“超前”于今天绝大多数商业视频生成模型的原生理解能力。随着未来一两年内长上下文多镜头生成、原生首尾帧约束、音画联合生成与可控角色一致性模型的成熟，行业必将出现能够完整吃透这套结构化工作台规格的适配 AI。**

具体来说，**镜序** 提前替创作者和下一代 AI 视频工作流铺好了 5 块关键拼图：

1. **从「单句玄学咒语」提前进化到「跨镜连续性导演契约」**
   - 今天多数模型还在调教单条 5 秒片段；而镜序已经内建了**跨镜人物五官/发型/服装/声线锁定**、**场景持物起止状态自动继承**（A 镜末尾拿在手里的道具会在 B 镜延续状态）、**`尾帧接下一镜首帧`（`chainLastFrame`）**与 **`切点前后两帧检查`（`cutFrameCheck`）**。
   - 等未来一两年原生支持多镜头连续帧记忆的视频大模型普及，这些结构化约束就能从“防呆提醒”直接升级为模型的原生控制输入。

2. **精细到 `0.5s` 的镜内时间轴 + 微表演 + 口型声音窗口**
   - 一条复杂镜头往往包含多个表演转折。镜序允许在单镜内部切分逐秒动作时间轴、独立安排微表情与视线方向、记录按文本语速估算的对白起始窗口、叠加多层动作音效（`soundCues`）与全局/分镜 BGM 避让。
   - 当前很多生成平台还无法同时执行如此高密度的时空声画指令，但未来多模态原生音画同步视频 AI 一旦就位，镜序产出的时序段落就是现成的结构化时间轴脚本。

3. **二维空间轴线示意与专业摄影冲突检测（提前拦住 AI“穿帮”）**
   - 内置人物、摄影机与主光**二维空间位置示意图**，以及可自定义保存的摄影预设库。
   - 检查器会自动捕捉摄影机逻辑矛盾（例如：同一镜内同时出现 `Dolly` 推拉轨道与 `Zoom` 光学变焦冲突、固定锁死机位却强行叠加摇移、对白总字数超出镜头秒数预算），提前把导演废片拦在生成之前。

4. **「生成素材时长」与「成片剪辑入出点」解耦 + 110 项转场规范**
   - 传统剪辑思维里，“多生成几秒余量留给剪辑叠化”是刚需。镜序把**计划生成素材时长、成片剪辑入出点、以及 `6` 大类 `110` 项专业转场（含重叠时长预算与十项衔接细节）**分离记录。
   - 随着未来 AI 视频平台打通“自动生成 + 智能剪辑拼接”，「生成与剪辑计划」视图可以直接充当流水线编排清单。

5. **不绑定单一模型厂商的 65K 高思考 AI 导演引擎 + 开放接口预留位**
   - 接入个人 Gemini API（默认支持 `65,536` tokens SSE 流式高思考结构化规划），即可根据一句话创意自动排出**无镜数小上限、无 600 秒天花板限制**的全套结构化草案（支持 `AI 自动决定分镜数` 或 `自由整数手填`）。
   - 同时内置独立的 **「视频创作」区与标准接口预留位（`Muse / Video API`）**：今日先用于沉淀生成计划快照、挂载参考图、预览外部成片链接；明日任何新的原生视频模型开放 API 后，只需接入一个 Adapter 即可打通全流程自动化制片。

---

## 功能模块全景拆解

<details open>
<summary><strong>点击展开/收起全部核心功能详述（共 10 大创作模块）</strong></summary>

| 模块 | 核心能力与细节 |
|---|---|
| **1. 创作首页与四重起点** | 电影氛围概念首页、最近草稿一键续写、AI 一句话灵感起步、**`12` 套可编辑故事模板**、电商模式入口、以及真正纯净无预设干扰的「从零开始」。 |
| **2. 快速 / 导演 / 电商三模式** | 同一份底层工程数据可随时无损切换视图：快速模式适合迅速出提示词；导演模式开放全部参数与连续性锁；电商模式专精商品卖点、主图/场景图与广告分段脚本。 |
| **3. AI 填写导演台** | 内置 **`27` 种视觉风格**（涵盖现实实拍、90 年代复古港片、王家卫霓虹夜色、硬派警匪、纪实纪录片、院线电影、竖屏微短剧、新中式、民国怀旧、日系胶片、美式黑色、硬核科幻、赛博朋克、千禧 CCD、二维/三维动画、水墨国漫等）与 **`23` 种影像质感**；支持全片统一选角或「人物 1 / 人物 2 …」单独控制国籍面孔、颜值档位与肤质；支持自定任意镜头数/时长或 AI 自动排镜。 |
| **4. 人物角色档案与锁定** | 多角色建立与跨镜引用、**16 套五官快捷组合**、外貌/发型/服装/声音属性独立锁定（切换预设或应用 AI 方案时不覆盖锁定内容）、支持保存个人角色模板与造型版本。 |
| **5. 场景、光线与二维轴线** | 时段、天气、主光/辅光、光线方向与质地配置；支持拖控或调整**人物、摄影机与主光的二维平面占位示意**。 |
| **6. 摄影与运镜体系** | 景别、机位、构图、焦段观感、运镜类型、环绕方向与角度、画面旋转、变焦、对焦、稳定方式；支持将满意配置存为**个人摄影预选**跨项目复用。 |
| **7. 分镜页签与时间轴** | 像浏览器标签页一样横向秒切任意分镜，或一键切到「全部列表」总览；支持拖拽/上下调整镜序、基础拆镜与合镜（若存在对白/分段会强制预览确认防止静默丢失）；每镜最小粒度 `0.5s`。 |
| **8. 微表演、对白与声画时间轴** | 表演情绪预设、视线与动作细节、对白说话者/语言/语气与口型时长估算、多段动作音效、全局配乐与单镜 BGM 覆盖或静音控制。 |
| **9. 参考素材与视频创作计划** | 挂载本地图片/音视频参考预览（单文件建议 ≤ `8 MB`，不私自上传 AI 厂商），标明用途与排除范围；在「视频创作」区组织文生视频/参考图/首尾帧草稿、保存未提交快照、导入外部 `https://` 成片预览。 |
| **10. 10 种实时输出与导入导出** | 支持完整、单镜、精简、按秒时间轴、按镜头顺序、分镜表、首帧图片、尾帧图片、挂载清单、生成剪辑计划；支持 **`中 / EN`** 词库翻译、独立手工编辑版本、**`25` 项负面提示词**；导出 TXT/CSV/JSON 与支持点击/拖拽/粘贴恢复的**导入项目**弹窗。 |

</details>

---

## 快速开始（本地与在线部署）

> **本地运行仅需 Node.js `>= 20`，零第三方依赖，无需执行 `npm install`。**

### 方式一：直接使用 GitHub Pages 在线版
打开 **https://soulmove.github.io/ai-video-prompt-studio/** 即可在浏览器中使用。

### 方式二：Windows 本地一键启动
```bash
git clone https://github.com/Soulmove/ai-video-prompt-studio.git
cd ai-video-prompt-studio
```
然后直接双击根目录的 **`启动镜序工作台.bat`**，会自动在 `http://127.0.0.1:4173` 启动并打开浏览器。

### 方式三：macOS / Linux / Windows 命令行启动
```bash
git clone https://github.com/Soulmove/ai-video-prompt-studio.git
cd ai-video-prompt-studio
node server.mjs
# 或
npm start
```
访问 **`http://127.0.0.1:4173`** 即可（⚠ 必须通过 HTTP 访问，直接双击 `dist/index.html` 打开 `file://` 将无法加载 ES Module 和 IndexedDB）。

### 三种运行方式能力对比

| 特性 | GitHub Pages 静态托管版 | 本地 `node server.mjs` | Cloudflare Workers 部署 (`dist/server/index.js`) |
|---|---|---|---|
| **访问方式** | [直接打开网页](https://soulmove.github.io/ai-video-prompt-studio/) | `http://127.0.0.1:4173` | 你的 Workers 绑定域名 |
| **项目制作 / 模板 / 导出导入 / 本地存储** | ✅ 完整支持（浏览器 IndexedDB） | ✅ 完整支持 | ✅ 完整支持 |
| **个人 Google API 浏览器直连** | ✅ 支持（密钥仅存内存） | ✅ 支持 | ✅ 支持 |
| **同源 `/api/*` 服务器转发与站点公共 Key** | ❌ 静态托管无后端接口 | ✅ 支持（自带本地身份桥接） | ✅ 支持（带限流与重定向保护） |
| **适合场景** | 零配置立即体验、分享给团队试玩 | 日常创作、自定义本地开发与代理环境 | 团队自建公网服务与可控分发 |

---

## 全配置指南速查

完整配置项、环境变量、存储键值说明与 Workers `wrangler.toml` 示例请查阅详尽手册：
👉 **[`docs/CONFIGURATION.zh-CN.md`](docs/CONFIGURATION.zh-CN.md)** · **[`API_接入说明.md`](API_接入说明.md)**

| 配置项目 | 设置方法 / 变量 | 关键说明 |
|---|---|---|
| **自定义本地端口** | `PORT=8080 node server.mjs` | 默认仅监听 `127.0.0.1:4173` 回环地址 |
| **个人 Gemini 模型与通道** | 左侧「服务连接」面板 | 默认模型 `gemini-4-hydrogen`，可改有权限的模型；Key 仅存内存，模型 ID 存 `localStorage` |
| **服务端备用环境变量（可选）** | `GEMINI_API_KEY`、`GEMINI_MODEL` | 需通过进程环境变量注入，**`server.mjs` 不会自动读取 `.env` 文件** |
| **编译单文件 Worker** | `npm run build` | 将全部 23 项静态资产与 API 编译至 `dist/server/index.js` |
| **运行全部测试与校验** | `npm test` / `npm run check` | 使用 `node:test` 运行全量 `93` 项自动化测试 |

---

## 工程结构

```text
ai-video-prompt-studio/
├─ server.mjs                 # Node.js 20+ 本地静态预览与 /api/* 桥接服务器（默认 127.0.0.1:4173）
├─ 启动镜序工作台.bat          # Windows 一键启动脚本
├─ package.json               # 无外部依赖，提供 start / test / check / build 脚本
├─ .env.example               # 服务端可选环境变量示例
├─ docs/
│  ├─ CONFIGURATION.zh-CN.md    # 中文使用与全配置详解
│  └─ CONFIGURATION.en.md       # 英文使用与全配置详解
├─ dist/                      # 纯静态前端 + 内置核心（可直接部署到 GitHub Pages）
│  ├─ index.html              # 主页面入口与 SVG 图标集
│  ├─ app.mjs                 # 工作台交互主控、三栏布局、导入弹窗与静态托管自适应
│  ├─ experience.mjs          # 电影氛围首页、4 步流程引导与模板预览
│  ├─ ai-brief.mjs            # AI 填写预设（27 视觉风格 / 23 质感 / 选角与 BGM 规则）
│  ├─ ai-contract.mjs         # AI 请求规范化与结构 Schema 严格校验
│  ├─ ai-planner.mjs          # 方案预览与增量/新项目安全应用逻辑
│  ├─ google-provider.mjs     # Google Gemini SSE 流式请求、测试与密钥脱敏诊断
│  ├─ api-connection.mjs      # 密钥清洗规范与客户端诊断逻辑
│  ├─ catalog.mjs             # 中英双语影视词库、12 模板、110 转场、25 负面提示词
│  ├─ model.mjs               # 时间轴、继承规则、冲突检测、提示词引擎与 JSON 导入解析
│  ├─ storage.mjs             # IndexedDB (jingxu-studio) 与 localStorage 删除防护
│  ├─ video-core.mjs          # 视频生成计划与 HTTPS 链接安全校验
│  └─ server/index.js         # npm run build 生成的 Cloudflare Workers 单文件产物
├─ worker/                    # Cloudflare Workers 请求路由与单实例限流逻辑
├─ scripts/build-worker.mjs   # 单文件 Worker ESM 编译脚本
└─ tests/                     # 10 组共 93 项 Node 原生单元测试
```

---

## 来源与开源致谢

创作字段设计、镜头职责、连续性锁与电商脚本结构灵感参考自以下公开项目（核对日期：2026-11-12），工作台交互、预设、提示词组合与检查逻辑均为独立实现：

| 开源项目 | 参考方向 | 许可证 |
|---|---|---|
| [jnMetaCode/ai-shortfilm-prompts](https://github.com/jnMetaCode/ai-shortfilm-prompts) | 主题、主体、影像与时间轴组织 | MIT |
| [Krenlis/director-craft-framework](https://github.com/Krenlis/director-craft-framework) | 镜头职责、可见表演与光影动机 | MIT |
| [zenstory-ai/drama-skills](https://github.com/zenstory-ai/drama-skills) | 身份/造型、起止状态与连续性 | MIT |
| [shyman159/seedance-prompts-skill](https://github.com/shyman159/seedance-prompts-skill) | 声画时间安排与视听分类（保留 `mantoufan` 版权说明） | MIT |
| [jacobye2017-afk/jacob-ye-seedance-prompt](https://github.com/jacobye2017-afk/jacob-ye-seedance-prompt) | Jacob Ye 的素材职责、微表演与结束状态方法 | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| [UnderleveledBuilder/awesome-short-drama-skills](https://github.com/UnderleveledBuilder/awesome-short-drama-skills) | 资料目录和阶段分类 | CC0 1.0 |

电商模式参考：`fal-ai-community/skills` (`commercial`)、`xianyu110/ecommerce-video-skills` (`hook-3s-script`)、`vargHQ/ecommerce-ai-video-skills`。

---

## 开源许可与支持

本项目采用 **[MIT License](LICENSE)** 开源。

如果你也看好“**用严谨的导演工作流驾驭下一代 AI 视频模型**”，觉得这个提前 1–2 年把结构化分镜标准搭起来的开源项目有启发，欢迎点亮右上角 **Star ⭐** 收藏跟进后续适配演进！
