# Jingxu Workbench · Usage & Full Configuration Guide (English)

[简体中文版](CONFIGURATION.zh-CN.md) · [Back to Chinese README](../README.md) · [English README](../README.en.md)

This guide covers every runtime option, local server setting, Google Gemini API setup (direct browser mode vs. same-origin server relay), storyboard/director settings, JSON backup import/export, browser storage schema, and Cloudflare Workers single-bundle deployment in **Jingxu Workbench**.

---

## Contents

1. [Local Runtime Configuration (Node.js & Windows One-Click Launcher)](#1-local-runtime-configuration-nodejs--windows-one-click-launcher)
2. [AI Connection & Google Gemini API Configuration](#2-ai-connection--google-gemini-api-configuration)
3. [Server Environment Variables (Optional Fallback)](#3-server-environment-variables-optional-fallback)
4. [Workbench Creation, Storyboard & Prompt Settings](#4-workbench-creation-storyboard--prompt-settings)
5. [Browser Storage, Backup Export & Project Import](#5-browser-storage-backup-export--project-import)
6. [Cloudflare Workers Deployment Configuration](#6-cloudflare-workers-deployment-configuration)
7. [Development, Build & Test Commands](#7-development-build--test-commands)

---

## 1. Live Static Hosting (GitHub Pages) & Local Runtime

### Online Static Edition (GitHub Pages)
Live deployment URL: **https://soulmove.github.io/jingxu-workbench/** (served cleanly from the `gh-pages` branch root containing `dist/` static assets + `.nojekyll`).

- **Static-Host Adaptation**: When the app receives a non-JSON `404`/`405` from `./api/config`, it automatically enters `staticHost` mode. All authoring views, templates, continuity validation, `中/EN` prompt export, `IndexedDB` persistence, and `.jingxu.json` import/export run 100% in the browser. For AI Brief generation on GitHub Pages, enter your personal Google Gemini key under **Service Connection** using **Browser Direct** mode (same-origin server relay requires self-hosting with Node.js or Cloudflare Workers).

---

## 1.5 Local Runtime Configuration (Node.js & Windows One-Click Launcher)

Jingxu Workbench runs entirely on standard browser ES modules and Node.js built-in modules — **zero third-party runtime dependencies, no `npm install` needed**.

### Prerequisites
- **Node.js `>= 20`** (powers the local static/API server `server.mjs`, Worker bundler, and `node --test`)
- A modern desktop or mobile browser with JavaScript and IndexedDB enabled

### Starting Locally

- **Windows One-Click**: Double-click [`启动镜序工作台.bat`](../启动镜序工作台.bat). It locates `node.exe` automatically from `PATH` or standard install locations, starts `server.mjs` on port `4173` if not already listening, and opens `http://127.0.0.1:4173`.
- **Cross-Platform CLI (macOS / Linux / Windows)**:

```bash
node server.mjs
# or
npm start
```

> ⚠ Always access the app over HTTP (e.g. `http://127.0.0.1:4173`). Opening `dist/index.html` directly via `file://` blocks ES modules and IndexedDB persistence.

### Custom Port & Local Server Security Behavior

`server.mjs` intentionally binds exclusively to `127.0.0.1` (loopback):

```bash
# macOS / Linux
PORT=8080 node server.mjs
```

```powershell
# Windows PowerShell
$env:PORT = "8080"
node server.mjs
```

Built-in local server behavior (`server.mjs`):
- **Local Identity Bridge**: Injects `oai-authenticated-user-id: local-preview` for `/api/*` requests so same-origin API routes can be tested locally without an external auth gateway.
- **Directory Protection**: Blocks HTTP reads under `/server/` and `/.openai/`.
- **Payload Cap**: Rejects `/api/*` requests exceeding `2,000,000` bytes (~2 MB).

---

## 2. AI Connection & Google Gemini API Configuration

Open **创作资源 → 服务连接** (Service Connection) in the left sidebar to connect your personal Google Gemini API key.

### Connection Fields

| Setting | Default | Notes |
|---|---|---|
| Google API Key | Empty | Your personal key from [Google AI Studio](https://aistudio.google.com/docs/api-key). Surrounding whitespace, quotes, and accidental `x-goog-api-key:` / `Bearer ` prefixes are automatically trimmed. |
| Model ID | `gemini-4-hydrogen` | Change to any Gemini model enabled on your Google project (e.g. `gemini-2.5-pro`, `gemini-2.5-flash`). Optional `models/` prefix is normalized automatically. |
| Transport Channel | `browser` (Direct) | Choose **Browser Direct** or **Same-Origin Server Relay**. |

### Transport Modes Compared

1. **Browser Direct (Default)**
   - Calls `https://generativelanguage.googleapis.com/v1beta/models/...` straight from the browser.
   - Your personal API key never leaves your browser to touch any intermediate server.
2. **Same-Origin Server Relay**
   - Sends requests via same-origin `POST /api/ai/connection` or `POST /api/ai/plan` with `x-jingxu-api-key` in the request header (never in URLs or JSON bodies).
   - Validates matching `Origin`, enforces `redirect: 'manual'`, and explicitly refuses `3xx` redirects so keys are never leaked to redirect targets.

### Key Isolation & Streaming Details
- Your personal API key lives **only in JavaScript memory** for the current tab; refreshing, closing the tab, or clicking Disconnect wipes it immediately. It is **never** written to projects, `.jingxu.json` backups, `IndexedDB`, `localStorage`, or logs.
- Only your preferred model ID and transport choice (`browser` / `server`) are stored in `localStorage` (`jingxu-prefs`).
- Plan generation uses `streamGenerateContent?alt=sse` with `65536` `maxOutputTokens`, filters out thought chunks, and validates structure, catalog tokens, shot IDs, and timing before applying anything to your project.

---

## 3. Server Environment Variables (Optional Fallback)

To optionally provide a server-level fallback key when visitors have not entered a personal key, set environment variables in your host runtime or platform secrets (see [`.env.example`](../.env.example)):

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `4173` | Listening port used by local `server.mjs`. |
| `GEMINI_API_KEY` | Empty | Optional server-side fallback Gemini API key used only when no personal header key is sent. |
| `GEMINI_MODEL` | `gemini-4-hydrogen` | Default server-side Gemini model ID. |

> **Important**: `server.mjs` reads `process.env` directly and **does not auto-load `.env` files**. `.env` and `.env.*` (except `.env.example`) are ignored by `.gitignore`. Never commit real API keys into source files.

Example in macOS/Linux:

```bash
export GEMINI_API_KEY="your-key-here"
export GEMINI_MODEL="gemini-4-hydrogen"
node server.mjs
```

---

## 4. Workbench Creation, Storyboard & Prompt Settings

### 4.1 Studio Modes & Starting Points
- **Seamless Mode Switching**: Switch freely between **Quick Mode (快速制作)**, **Director Mode (导演模式)**, and **Commerce Mode (电商模式)** on the same underlying project data.
- **Creative Home**: Start from a single sentence idea, **`12` built-in starter templates**, commerce product/ad templates, or an untouched blank project.

### 4.2 AI Brief Settings (`dist/ai-brief.mjs`)
- **Shot Count & Duration Control (`shotControlMode`)**:
  - `auto`: Lets AI decide the number of shots and per-shot durations to match story pacing.
  - Manual: Specify any positive integer shot count and runtime budget (supports long multi-minute & high-shot-count plans without restrictive small caps; minimum per-shot duration is `0.5s`).
- **Expanded Visual & Texture Catalog**:
  - **`27` Visual Style Entries**: Auto, Custom, plus `25` curated styles including live-action realistic life, 90s retro HK cinema, Wong Kar-wai neon night, gritty HK crime, observational documentary, modern theatrical drama, vertical short drama, modern Chinese aesthetics, Republic era, Japanese film, Korean romance, American noir, French New Wave, realistic wuxia, hard sci-fi, cyberpunk, Y2K CCD/DV, 2D/3D anime, Chinese comic, ink wash, watercolor, claymation, pixel art, and game CG.
  - **`23` Film/Sensor Texture Entries**: Raw zero-filter reality, theatrical cinema, 90s HK halation film, IMAX 70mm, Kodak 5219, Fuji film, 35mm, 16mm, Super 8, Leica, anamorphic widescreen, black mist filter, VHS, Polaroid, etc.
- **Continuity & Cut Rules**:
  - **Chain Last Frame (`chainLastFrame`)**: Separates generation constraints from editing transition notes.
  - **Cut Frame Check (`cutFrameCheck`)**: Emphasizes boundary consistency between incoming and outgoing frames.
  - **Transitions (`transitionStyle`)**: Built-in catalog of **`110` transition options across `6` categories** (basic cuts, cinematic camera transitions, VFX, narrative editing, audio transitions, rhythmic cuts).
- **Cast & BGM Controls**: Configure unified or per-character ethnicity/nationality, facial tier, skin rendering, and BGM mode (`guided`, `exact`, or `none`).
- **Auto-Fill Toggle**: Turn off "Auto-fill workbench after generation" to inspect and selectively apply generated characters, style, scenes, or shots—or save them as a brand-new project without touching your current draft.

### 4.3 Prompt Output & Checks (Right Panel)
- **10 Output Formats**: Full prompt, current single shot, concise prompt, per-second timeline, shot sequence, shot table (CSV exportable), first-frame still prompt, last-frame still prompt, asset mount manifest, and generation/editing plan.
- **EN Mode Behavior**: Clicking `EN` translates curated cinematography, lighting, lens, movement, acting, and negative-prompt terminology into English while **preserving** user freeform character names, dialogue, and custom plot text verbatim.
- **Negative Prompts**: **`25` curated negative prompts** (identity drift, unmotivated wardrobe change, plastic skin, malformed hands, background warping, lip-sync mismatch, unauthorized internal cuts, etc.) plus custom additions with automatic deduplication.

---

## 5. Browser Storage, Backup Export & Project Import

### Where Data Lives
- **Projects**: Browser `IndexedDB` database `jingxu-studio` (`v1`, object store `projects`).
- **Preferences & Deletion Guards**: `localStorage` keys:
  - `jingxu-prefs` (vocabulary sort order, favorites `★`, personal AI model & transport preference)
  - `jingxu-last-project` (active project restoration across reloads)
  - `jingxu-deleted-projects` & `jingxu-cleared-at` (prevents stale debounced autosaves from resurrecting deleted projects)
- **Reference Assets**: Attached images, audio, and video previews stay local (recommended max **`8 MB`** per reference file). No asset bytes are sent during AI planning.

### Exporting & Importing Backups
- **Export**: Click **「导出项目」** in the top bar to download a `.jingxu.json` project backup.
- **Import**: Click **「导入项目」** in the top bar (or inside the **「我的项目」** modal) to open the import dialog with three input paths:
  1. File picker (`.jingxu.json` / `.json`, up to **`40 MB`**)
  2. Drag-and-drop onto `#import-dropzone`
  3. Direct JSON text paste (`#import-json-input`)
- `parseImportText()` strips any UTF-8 BOM, validates schemas/references cleanly, assigns a fresh unique project ID and timestamps, and opens an independent copy so existing projects are never overwritten.

---

## 6. Cloudflare Workers Deployment Configuration

Running `npm run build` (`node scripts/build-worker.mjs`) bundles all **`23` static assets** (HTML, CSS, JS, SVG, JPEG stills as base64) and Worker API handlers into a single self-contained ESM module: `dist/server/index.js`.

### Worker Endpoints & Rate Limiting (`worker/api.mjs`)
- `GET /api/health` -> `{"service":"jingxu","version":"1.5"}`
- `GET /api/config` -> Returns AI readiness and video service status without leaking env secrets.
- `POST /api/ai/connection`, `POST /api/ai/plan`:
  - Requires `oai-authenticated-user-id` request header (injected by your hosting gateway or local bridge), matching `Origin`, and `Content-Type: application/json`.
  - **Per-instance in-memory rate limits**: max `3` plan requests per user per 60s, max `1` concurrent plan per user, and max `4` active AI requests per Worker instance. For large public multi-tenant deployments, pair with persistent Cloudflare Rate Limiting or Durable Objects.
- `POST /api/video/generate` & `/api/video/status` -> Explicitly return HTTP `501` (`VIDEO_NOT_CONNECTED`) so no unverified remote video jobs or charges are initiated.

### Starter `wrangler.toml` Example

To deploy under your own Cloudflare Workers account:

```toml
name = "jingxu-workbench"
main = "dist/server/index.js"
compatibility_date = "2026-11-01"

[vars]
GEMINI_MODEL = "gemini-4-hydrogen"
```

Store `GEMINI_API_KEY` (if desired as a fallback) via `wrangler secret put GEMINI_API_KEY`. Note that if visitors only connect their own personal Gemini key in **Browser Direct** mode, static delivery alone works without calling `/api/ai/*`.

---

## 7. Development, Build & Test Commands

```bash
# Build Worker bundle + run all 93 automated unit tests
npm test

# Static syntax checks across client, worker, and bundle files
npm run check

# Build single-file Worker artifact (dist/server/index.js)
npm run build
```

All tests use Node.js's built-in `node:test` runner and cover timeline continuity, shot inheritance, AI contract validation, SSE chunk/UTF-8 truncation resilience, project JSON import/export, and Worker redirect security contracts.
