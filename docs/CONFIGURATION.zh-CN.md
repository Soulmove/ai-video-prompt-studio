# 镜序工作台 · 使用与全配置指南（中文版）

[English Version](CONFIGURATION.en.md) · [返回中文主页](../README.md) · [English README](../README.en.md)

本文档详细介绍 **镜序（Jingxu Workbench）** 的运行环境配置、个人 Google Gemini API 接入与转发策略、创作/分镜/AI 填写参数设置、项目备份导入导出、本地存储机制，以及 Cloudflare Workers 单文件部署配置。

---

## 目录

1. [本地运行配置（Node.js / Windows 一键启动）](#1-本地运行配置nodejs--windows-一键启动)
2. [AI 服务连接与 API 配置](#2-ai-服务连接与-api-配置)
3. [环境变量清单（服务端可选配置）](#3-环境变量清单服务端可选配置)
4. [工作台创作与参数配置](#4-工作台创作与参数配置)
5. [本地存储与项目导入/导出备份](#5-本地存储与项目导入导出备份)
6. [Cloudflare Workers 单文件部署配置](#6-cloudflare-workers-单文件部署配置)
7. [开发、构建与自动化测试](#7-开发构建与自动化测试)

---

## 1. 本地运行配置（Node.js / Windows 一键启动）

本工作台完全基于浏览器原生 ESM 与 Node.js 标准库实现，**零第三方运行时依赖，无需 `npm install`**。

### 运行要求
- **Node.js `>= 20`**（用于本地 HTTP 预览服务 `server.mjs`、Workers 构建与 `node --test`）
- 现代桌面或移动端浏览器（需启用 JavaScript 与 IndexedDB）

### 启动方式

- **Windows 一键启动**：双击根目录 [`启动镜序工作台.bat`](../启动镜序工作台.bat)。脚本会自动查找 `PATH`、`%ProgramFiles%\nodejs` 或 `%LocalAppData%\Programs\node` 中的 `node.exe`；若 4173 端口未启动则启动服务，并自动打开 `http://127.0.0.1:4173`。
- **通用命令行启动（Windows / macOS / Linux）**：

```bash
# 默认端口 4173
node server.mjs
# 或
npm start
```

> ⚠ 必须通过 HTTP 服务（例如 `http://127.0.0.1:4173`）访问，直接双击 `dist/index.html` 打开 `file://` 将无法加载 ES Module 和 IndexedDB 存储。

### 自定义端口与本地服务边界

`server.mjs` 默认仅监听本地回环地址 `127.0.0.1`，不对外网暴露：

```powershell
# Windows PowerShell 更换端口示例
$env:PORT = "8080"
node server.mjs
```

```bash
# macOS / Linux 更换端口示例
PORT=8080 node server.mjs
```

本地服务内置以下安全与预览行为：
- **回环身份桥接**：本地访问 `/api/*` 时自动注入 `oai-authenticated-user-id: local-preview`，免登录即可调试服务端转发逻辑。
- **静态资源保护**：禁止通过 HTTP 直接读取 `/server/` 与 `/.openai/` 目录。
- **请求体上限**：`/api/*` 接口单次请求体最大限制为 `2,000,000` 字节（约 `2 MB`）。

---

## 2. AI 服务连接与 API 配置

进入工作台左侧导航 **「创作资源 → 服务连接」** 即可配置个人 AI 生成服务（当前支持 Google Gemini API）。

### 参数说明

| 配置项 | 默认值 | 说明 |
|---|---|---|
| Google API Key | 空（需自行填写） | 在 [Google AI Studio](https://aistudio.google.com/docs/api-key) 申请的个人 API 密钥。输入时自动去除首尾空白、外围引号以及误贴的 `x-goog-api-key:` / `Bearer ` 前缀。 |
| 模型 ID | `gemini-4-hydrogen` | 可自定义为当前账号有权限调用的任意 Google Gemini 模型（例如 `gemini-2.5-pro`、`gemini-2.5-flash` 等，支持自动去除 `models/` 前缀）。 |
| 连接通道 | `browser`（浏览器直连） | 可选 **浏览器直连 Google 官方接口** 或 **通过工作台同源服务端转发**。 |

### 两种连接通道对比

1. **浏览器直连（默认，适合本地使用与网络可直达 Google 的用户）**
   - 直接请求 `https://generativelanguage.googleapis.com/v1beta/models/...`。
   - 密钥不经过本地或远端 Worker 服务端。
2. **同源服务端转发（适合部署于代理可通 Google 的站点/Worker 环境）**
   - 浏览器通过 `POST /api/ai/connection` 或 `POST /api/ai/plan` 发送请求，个人密钥放在请求头 `x-jingxu-api-key` 中传给同源后端，不会进入 URL 或 JSON 载荷。
   - 后端校验同源 `Origin` 与 JSON 格式后，使用 `redirect: 'manual'` 向 Google 发起单次请求并明确拒绝 3xx 重定向，防止密钥泄露给跳转地址。

### 密钥持久化与隐私安全边界
- 个人 API Key **仅保存在当前标签页 JavaScript 内存中**，刷新页面、关闭网页或点击断开连接即立刻清空；**绝不会**写入 `localStorage`、`IndexedDB`、导出项目 JSON、错误提示或 URL 中。
- 仅模型 ID 与连接通道偏好保存在浏览器的 `localStorage`（`jingxu-prefs` 键下）。
- 流式生成默认启用 `streamGenerateContent?alt=sse` 与 `65536` `maxOutputTokens`，服务端自动忽略模型思考文本并校验结构与分镜引用完整性。

---

## 3. 环境变量清单（服务端可选配置）

如果希望为部署的站点提供“无需用户填写个人 Key 即可使用的服务端默认 API”，可在运行进程环境或平台 Secret 中设置以下变量（参考 [`.env.example`](../.env.example)）：

| 变量名 | 默认值 | 用途说明 |
|---|---|---|
| `PORT` | `4173` | 仅本地 `server.mjs` 使用的监听端口。 |
| `GEMINI_API_KEY` | 空 | 可选的服务端兜底 Google Gemini API Key；当用户未填写个人 Key 时启用。 |
| `GEMINI_MODEL` | `gemini-4-hydrogen` | 服务端默认使用的 Gemini 模型 ID。 |

> **重要提示**：`server.mjs` 只读取操作系统进程环境变量（`process.env`），**不会自动读取 `.env` 文件**；且 `.gitignore` 已忽略 `.env` 与 `.env.*`（仅保留 `!.env.example`），请勿将真实密钥写入仓库或任何源码文件。

PowerShell 启动时临时注入服务端备用 Key 示例：

```powershell
$env:GEMINI_API_KEY = "你的密钥"
$env:GEMINI_MODEL = "gemini-4-hydrogen"
node server.mjs
```

---

## 4. 工作台创作与参数配置

### 4.1 创作模式与项目起点
- **双模式同源切换**：可在 **快速制作**、**导演模式** 与 **电商模式** 之间无损切换，底层共用同一项目数据结构。
- **创作首页**：提供「想法一句话起步」、**`12` 套起步模板**、商品广告方向以及「从零开始」空项目起点。

### 4.2 AI 填写（`AI_BRIEF`）关键配置项
- **分镜控制方式（`shotControlMode`）**：
  - `auto`（推荐先探索）：由 AI 根据剧情节奏自主规划分镜数量与每镜时长。
  - 手动指定：自定义任意整数分镜数量与总时长目标（支持长时长与多镜片编排，无死板小上限），单镜最小时长下限为 `0.5s`。
- **影像风格与质感预设**：
  - 内置 **`27` 项视觉风格预设**（含 AI 自由设计、自定义、现实实拍、90 年代复古港片、王家卫霓虹夜色、硬派港产警匪、纪实纪录片、现代院线电影、竖屏微短剧、新中式、民国怀旧、日系胶片、韩系浪漫、美式黑色、法式新浪潮、写实武侠、硬核科幻、赛博朋克、千禧 CCD/DV、二维/三维动画、国漫、水墨、水彩、黏土定格、像素、游戏 CG）。
  - 内置 **`23` 项质感预设**（现实原片零滤镜、IMAX 70mm、柯达 5219、富士胶片、35mm/16mm/Super 8、徕卡人像、变形宽银幕、黑柔镜、VHS 磁带等）。
- **连贯性与剪辑规划**：
  - **尾帧接下一镜首帧（`chainLastFrame`）**：开启后分离独立生成约束与剪辑过渡表。
  - **切点前后两帧检查（`cutFrameCheck`）**：强化跨镜衔接帧一致与切点提示。
  - **转场策略（`transitionStyle`）**：工作台提供 **`6` 大类 `110` 项转场选择**（支持无转场/硬切、叠化、运镜、视效、叙事、声音、节奏转场）。
- **AI 角色统筹与全球/分镜 BGM**：支持统一选角或逐角色细化国籍、面部特征、肤质、年龄、体型、职业参考，以及引导式/指定/静音三种配乐模式。
- **自动应用 vs 先预览**：可关闭「生成后自动填入工作台」，对 AI 返回方案逐项挑选应用，或另存为全新项目，避免覆盖已有心血设定。

### 4.3 提示词实时输出与检查（右上输出面板）
- **10 种视图输出**：完整提示词、当前单镜、精简版、按秒时间轴、按镜头顺序、分镜表（支持 CSV 导出）、首帧图片、尾帧图片、挂载清单、生成与剪辑计划。
- **中 / EN 双语模式**：点击 `EN` 可将内置摄影、光线、景别、运镜、表演等专业词库映射为英文标准表达，同时**原样保留**你填写的人物姓名、具体剧情动作与中文台词（如需全英文提示词给海外视频模型，可直接在中文或 EN 模式下配合手工编辑版本微调）。
- **负面提示词**：内置 **`25` 项负面提示词**（身份漂移、突然换装、塑料肤质、手指畸形、背景扭曲、音画错位、擅自切镜等），可多选并自定义补充，自动去重。

---

## 5. 本地存储与项目导入/导出备份

### 浏览器存储位置
- **项目数据库**：`IndexedDB`，数据库名 `jingxu-studio`（版本 `1`，对象仓库 `projects`）。
- **用户偏好与状态**：`localStorage`，使用以下键名：
  - `jingxu-prefs`：最近使用的词条排序、收藏标星（`★`）、个人 AI 模型偏好等。
  - `jingxu-last-project`：上次打开的项目 ID（刷新后恢复上下文）。
  - `jingxu-deleted-projects` / `jingxu-cleared-at`：删除/清空记录，防止旧自动保存定时器复活已删草稿。
- **本地参考素材**：图片/音视频参考文件通过本地预览挂载，单文件建议不超过 **`8 MB`**（会随完整项目 JSON 导出打包携带，不自动上传云端）。

### 项目导出与导入方法
- **导出备份**：点击顶部 **「导出项目」**，下载 `.jingxu.json` 完整备份文件。
- **导入恢复**：点击顶部 **「导入项目」** 或「我的项目」弹窗底部的 **「导入项目」**，支持三种方式：
  1. 点击选择本地 `.jingxu.json` / `.json` 文件（上限 `40 MB`）；
  2. 直接将项目文件拖入导入虚线区（`#import-dropzone`）；
  3. 直接把 JSON 文本粘贴进文本框并点击「从粘贴 JSON 导入」。
- 导入器会自动去除 UTF-8 BOM、校验数据结构、赋予全新独立项目 ID 与时间戳，确保**不会覆盖**工作台中正在编辑的同源项目。

---

## 6. Cloudflare Workers 单文件部署配置

本项目支持编译为一个内嵌全部前端静态资源与服务端 API 的单文件 ESM Worker（位于 `dist/server/index.js`）。

### 编译打包
```bash
npm run build
# 等价于 node scripts/build-worker.mjs
```
构建脚本会扫描 `dist/` 下除 `server/` 和 `.openai/` 外的 **`23` 项静态资源**，编码为 Base64 内嵌进 `dist/server/index.js`，同时保留 `.openai/hosting.json` 配置说明。

### Worker API 接口与限流机制（`worker/api.mjs`）
- `GET /api/health`：健康检查（返回 `{"service":"jingxu","version":"1.5"}`）。
- `GET /api/config`：返回 AI 就绪状态与视频模块状态（不暴露环境变量真实密钥）。
- `POST /api/ai/connection` & `POST /api/ai/plan`：要求请求携带可信登录头 `oai-authenticated-user-id` 及匹配的同源 `Origin` 请求头，且 Content-Type 为 `application/json`。
- **单实例内存限流**：每个 Worker 实例限制单用户每 60 秒最多发起 `3` 次 `/api/ai/plan` 请求、单用户同时最多 `1` 个进行中请求、全实例同时最多 `4` 个活跃 AI 请求。面向公开多租户部署时，建议配合 Cloudflare Rate Limiting / Durable Objects 使用。
- `POST /api/video/generate` 与 `/api/video/status`：当前明确返回 HTTP `501`（`VIDEO_NOT_CONNECTED`），避免在未对接视频厂商接口前产生误扣费或虚假进度。

### 部署清单建议（`wrangler.toml` 示例）
如需自行部署到自己的 Cloudflare 账号，可在项目根目录创建 `wrangler.toml`（注意将 `GEMINI_API_KEY` 配置为 Secret，不要写入明文文件）：

```toml
name = "jingxu-workbench"
main = "dist/server/index.js"
compatibility_date = "2026-11-01"

[vars]
GEMINI_MODEL = "gemini-4-hydrogen"
```

> 若用于公开多人免登录预览站点，请在网关或代理层负责注入合适的用户身份标识头 `oai-authenticated-user-id`（或者继续让每位访客在浏览器端使用个人 API Key 直连模式，无需走服务端转发）。

---

## 7. 开发、构建与自动化测试

```bash
# 运行 Worker 重建 + 全量 93 项单元测试
npm test

# 仅执行语法静态检查
npm run check

# 仅构建单文件 Worker 产物
npm run build
```

所有测试均基于 Node.js 内置 `node:test` 运行，覆盖时间轴、镜头继承、AI 契约校验、SSE 流式截断保护、导入导出与 Worker 部署重定向安全测试。
