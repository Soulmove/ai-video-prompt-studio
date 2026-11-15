<div align="center">

# 镜序 · AI短剧提示词工作台 (Jingxu Director Workbench)

**本地优先、零外部依赖的 AI 短剧 / 视频分镜与提示词编排工作台**

[简体中文](README.md) · [English](README.en.md) · [全配置与使用手册 (中文)](docs/CONFIGURATION.zh-CN.md) · [Configuration Guide (EN)](docs/CONFIGURATION.en.md) · [API 接入说明](API_接入说明.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-green.svg)](#快速开始)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-blue.svg)](#技术特点)

<br>

<img src="dist/assets/creative-still.jpg" alt="镜序 · 创作首页电影氛围概念图" width="760" />

<sub>创作首页电影氛围概念图（原创 AI 生成概念静帧，详见 <a href="ASSETS.md">ASSETS.md</a>）</sub>

</div>

---

## 为什么做「镜序」？

做 AI 短剧、概念短片或电商带货视频时，只靠一句模糊的提示词，往往容易出现**人物长相漂移、服装突变、镜头节奏失控、声画对不上、多镜衔接断层**等问题。

**镜序**把影视工业的「角色档案 — 影像质感 — 场景布光 — 表演声画 — 分镜时间轴 — 摄影运镜 — 转场检查」拆解为结构化工作台：
- **零第三方依赖**：前端使用原生 ESM + CSS，后端仅用 `Node.js >= 20` 内置模块，克隆仓库即可运行，无需 `npm install`。
- **隐私本地优先**：项目数据保存在浏览器 `IndexedDB`，支持一键**导出 `.jingxu.json` 备份**与**点击 / 拖拽 / 粘贴 JSON 导入恢复**。
- **可选接入个人 Google Gemini API**：支持输入想法、目标片长与风格方向后，通过流式 SSE 自动生成角色、质感、场景、微表演、BGM 与分镜序列（密钥仅驻留页面内存）。
- **无限制多镜编排**：支持 AI 自动规划分镜数量与秒数，或自由指定任意整数分镜数与长片时长；内置实拍、90 年代港片、王家卫霓虹、纪实纪录片等 **`27` 项视觉预设**与 **`23` 项质感预设**。
- **即拿即用的多种输出格式**：一键切换完整提示词、单镜提示词、精简版、按秒时间轴、分镜表（CSV）、首尾帧、挂载清单与生成剪辑计划，并支持 **`中 / EN` 词库映射**与**手工微调版本**。

---

## 快速开始

> 需要 **Node.js `>= 20`**（无需安装任何 npm 依赖包）。

### 方式一：Windows 一键启动（最简单）

1. 下载或克隆本仓库：
   ```bash
   git clone https://github.com/Soulmove/jingxu-workbench.git
   cd jingxu-workbench
   ```
2. 直接双击根目录下的 **`启动镜序工作台.bat`**，脚本会自动启动本地服务并打开浏览器 `http://127.0.0.1:4173`。

### 方式二：macOS / Linux / Windows 命令行启动

```bash
node server.mjs
# 或
npm start
```

启动后在浏览器访问：**`http://127.0.0.1:4173`**

> ⚠ 请务必通过 HTTP 地址访问（不要直接双击打开 `dist/index.html`），否则浏览器将限制 ES Module 加载与 IndexedDB 本地存储。

---

## 如何使用（五步出片工作流）

### 第 1 步：选择创作起点
打开首页后，可直接选择四种创作起点之一：
- **AI 一句话生成**：输入剧情想法或纪录片/广告创意（或前往左侧 **「AI填写」** 定制风格与时长）。
- **灵感模板**：内置 **`12` 套故事与广告起步模板**，一键载入即可改写。
- **电商模式**：专注商品主图、场景图、分段带货脚本文案整理。
- **从零开始**：空白工程起点，不强加默认干扰文本。

### 第 2 步：（可选）接入自己的 Google Gemini API 自动编排分镜
1. 在左侧栏进入 **「创作资源 → 服务连接」**。
2. 填入你的 Google API Key（可在 [Google AI Studio](https://aistudio.google.com/docs/api-key) 获取）；默认模型为 `gemini-4-hydrogen`，可改为自己账号可用的模型（如 `gemini-2.5-pro` / `gemini-2.5-flash` 等）。
3. 点击 **「连接并开始填写」** -> 进入 **「AI填写」**：
   - 勾选想要的风格（如**现实实拍 / 香港风 90 年代复古 / 纪实纪录片 / 赛博朋克 / 二维动画**等）与影像质感。
   - 设置**分镜控制方式**（`AI 自动规划` 或 `自定义分镜数与时长`）、是否启用**尾帧接下一镜首帧**及**切点前后两帧检查**。
   - 点击生成后，AI 会以 SSE 流式生成并严格校验结构，自动填入**人物、质感、场景、表演、声音、运镜与分镜表**；也可关闭「生成后自动填入」，先逐项预览再选择应用或另存为新项目。

### 第 3 步：精细打磨人物、场景与分镜时间轴
- **人物角色**：建立多角色档案，使用快捷五官组合与外貌/发型/服装/声音锁定（防止 AI 填表或切换组合时冲掉关键设定）。
- **场景与光线**：设置时段、天气、主光方向，并在二维示意面板调整人物、机位与主光相对位置。
- **添加/编辑分镜**：
  - 使用顶部**分镜页签**快速跳转每一镜，或切换至「全部列表」总览，支持拖动/上下排序、拆镜/合镜。
  - 在每一镜中配置时长（`>= 0.5s`）、动作微表演、说话者与对白窗口、动作音效与全局/分镜 BGM。
  - 点击镜头衔接处可从 **`6` 大类 `110` 项场景转场**中选配剪辑转场。

### 第 4 步：检查、切换语言与复制导出提示词
右侧 **「你的提示词」** 实时同步生成：
- 下拉切换 **`10` 种输出格式**：完整提示词、当前单镜、精简版、按秒时间轴、按镜头顺序、分镜表、首帧图片、尾帧图片、挂载清单、生成与剪辑计划。
- 点击 **`中 / EN`**：内置专业摄影、光影、运镜与 **`25` 项负面提示词**可一键映射为英文表达（人物姓名、自定义剧情和台词原文保留）。
- 点击 **检查页签**：自动排查时长矛盾、互斥摄影参数、引用缺失、未声明持物状态与口型窗口溢出。
- 支持**一键复制**、**手工编辑版本**、导出 **TXT / 分镜表 CSV / 浏览器打印**。

### 第 5 步：导出备份与跨设备导入项目
- **导出项目**：点击右上角 **「导出项目」**，下载完整 `.jingxu.json` 工程备份（可携带有本地参考素材）。
- **导入项目**：点击右上角 **「导入项目」**（或「我的项目」弹窗底部的「导入项目」），支持**选择文件 / 拖拽 `.jingxu.json` / 直接粘贴 JSON 文本**三种方式恢复为独立新项目，不会误覆盖已有工程。

---

## 常用配置速查

详细说明与全部配置参数请阅读：**[`docs/CONFIGURATION.zh-CN.md`](docs/CONFIGURATION.zh-CN.md)**

| 配置场景 | 修改位置 / 命令 | 说明 |
|---|---|---|
| 更换本地端口 | `PORT=8080 node server.mjs` | 默认监听 `127.0.0.1:4173`（仅本机回环访问） |
| 个人 API 模型与通道 | 工作台 → 服务连接界面 | Key 仅驻留页面内存；模型与通道偏好存在 `localStorage` |
| 服务端备用 Key（可选） | 进程环境变量 `GEMINI_API_KEY` / `GEMINI_MODEL` | 访客未填个人 Key 时兜底使用；**`server.mjs` 不自动读取 `.env`** |
| Cloudflare Workers 打包 | `npm run build` | 将静态资源与 API 编译至单文件 `dist/server/index.js` |
| 运行全量测试与语法检查 | `npm test` / `npm run check` | 基于 `node:test`，运行全部 `93` 项自动化测试 |

---

## 工程结构

```text
jingxu-workbench/
├─ server.mjs                 # Node.js 20+ 本地静态与 API 预览服务器（默认 127.0.0.1:4173）
├─ 启动镜序工作台.bat          # Windows 一键启动脚本
├─ package.json               # 项目脚本（start / test / check / build，无第三方依赖）
├─ .env.example               # 可选服务端环境变量示例
├─ docs/
│  ├─ CONFIGURATION.zh-CN.md    # 中文使用与全配置详解
│  └─ CONFIGURATION.en.md       # 英文使用与全配置详解
├─ dist/
│  ├─ index.html              # 主页面入口与 SVG 图标定义
│  ├─ app.mjs                 # 工作台交互界面与三栏布局控制
│  ├─ experience.mjs          # 创作首页、流程引导与故事卡入口
│  ├─ ai-brief.mjs            # AI 填写预设（27 种视觉 / 23 种质感 / 选角与 BGM 规则）
│  ├─ ai-contract.mjs         # AI 请求规范化与严格 Schema 校验
│  ├─ ai-planner.mjs          # 方案预览与增量/新项目应用逻辑
│  ├─ google-provider.mjs     # Google Gemini SSE 流式请求、测试与错误脱敏
│  ├─ api-connection.mjs      # Key 输入规范化与前后端诊断边界
│  ├─ catalog.mjs             # 词库、12 套模板、110 项转场与 25 项负面提示词
│  ├─ model.mjs               # 时间轴、继承规则、冲突检查、提示词引擎与导入导出解析
│  ├─ storage.mjs             # IndexedDB (jingxu-studio) 与 localStorage 状态管理
│  ├─ video-core.mjs          # 视频创作区计划与链接校验
│  └─ server/index.js         # npm run build 生成的 Cloudflare Workers 单文件产物
├─ worker/                    # Cloudflare Workers API 入口、限流与静态构建占位
├─ scripts/build-worker.mjs   # 单文件 Worker ESM 构建脚本
└─ tests/                     # 10 组共 93 项 Node 原生单元测试
```

---

## 数据安全与能力边界

- **本地存储**：所有项目存放在浏览器 `IndexedDB (jingxu-studio)`，清理浏览器站点数据可能清除本地草稿，建议重要作品定期点击「导出项目」备份。
- **个人密钥保护**：前端直连模式下密钥直接发送至 Google 官方接口；服务端转发模式下仅在单次请求中通过 `x-jingxu-api-key` 请求头转发，不写入日志、项目文件或任何存储，且后端显式拒绝 3xx 重定向。
- **视频生成区定位**：「视频创作」页用于组织参数、保存本地「未提交」生成计划快照、挂载参考素材及预览外部 HTTPS 视频链接；尚未对接第三方实拍视频生图平台提交与扣费接口，不会私自产生付费任务。
- **画幅 / 分辨率说明**：8K、4K、帧率与长时长参数属于面向目标生成平台的交付设定，具体上限取决于所使用的视频模型平台。

---

## 来源与开源致谢

本项目中的创作字段组织方法、分镜与连续性设计参考了以下优秀开源社区仓库（核对日期：2026-11-12），界面交互、预设组合、检查规则与工程实现均为独立编写：

| 开源项目 | 参考方向 | 许可证 |
|---|---|---|
| [jnMetaCode/ai-shortfilm-prompts](https://github.com/jnMetaCode/ai-shortfilm-prompts) | 主题、主体、影像与时间轴组织 | MIT |
| [Krenlis/director-craft-framework](https://github.com/Krenlis/director-craft-framework) | 镜头职责、可见表演与光影动机 | MIT |
| [zenstory-ai/drama-skills](https://github.com/zenstory-ai/drama-skills) | 身份/造型、起止状态与连续性 | MIT |
| [shyman159/seedance-prompts-skill](https://github.com/shyman159/seedance-prompts-skill) | 声画时间安排与视听分类（保留 `mantoufan` 版权说明） | MIT |
| [jacobye2017-afk/jacob-ye-seedance-prompt](https://github.com/jacobye2017-afk/jacob-ye-seedance-prompt) | Jacob Ye 的素材职责、微表演与结束状态方法 | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| [UnderleveledBuilder/awesome-short-drama-skills](https://github.com/UnderleveledBuilder/awesome-short-drama-skills) | 资料目录和阶段分类 | CC0 1.0 |

电商分段方法参考：`fal-ai-community/skills` (`commercial`)、`xianyu110/ecommerce-video-skills` (`hook-3s-script`)、`vargHQ/ecommerce-ai-video-skills`。

---

## 开源许可

本项目代码依据 **[MIT License](LICENSE)** 开源。如果这个工作台对你的 AI 短剧、分镜导演创作或提示词工程有帮助，欢迎点亮右上角的 **Star ⭐** 支持！
