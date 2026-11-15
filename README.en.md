<div align="center">

# Jingxu Workbench · AI Short-Film & Video Prompt Studio

**A local-first, zero-dependency storyboard, continuity, and AI video prompt workbench (for Seedance, Kling, Runway, Sora, Veo, and commercial short-drama workflows)**

[简体中文](README.md) · [English](README.en.md) · [Configuration Guide (EN)](docs/CONFIGURATION.en.md) · [全配置与使用手册 (中文)](docs/CONFIGURATION.zh-CN.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-green.svg)](#quick-start)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-blue.svg)](#key-highlights)

<br>

<img src="dist/assets/creative-still.jpg" alt="Jingxu Studio Cinematic Concept Still" width="760" />

<sub>Original AI-generated mood concept image for the creative home page (see <a href="ASSETS.md">ASSETS.md</a>)</sub>

</div>

---

## Overview

When generating AI short dramas or multi-shot videos with vague one-line prompts, models frequently suffer from **character identity drift, sudden wardrobe swaps, broken shot continuity, mismatched dialogue timing, and uncontrollable camera pacing**.

**Jingxu Workbench (镜序)** turns director craft into a structured, local-first studio covering **Characters → Visual Style & Texture → Scene & Motivated Lighting → Acting & Audio Timing → Multi-Shot Timeline → Camera Movement & Transitions → Continuity Validation**:

- **Zero External Runtime Dependencies**: Built entirely with native browser ES Modules, standard CSS, and Node.js `>= 20` core APIs — clone and run immediately without `npm install`.
- **Local-First & Portable Backups**: Projects persist in browser `IndexedDB` (`jingxu-studio`) and can be exported as `.jingxu.json` files or restored via **file picker, drag-and-drop, or raw JSON paste**.
- **Optional BYOK AI Planning (Google Gemini API)**: Connect your own Gemini API key to stream structured storyboards, cast rosters, scenes, micro-acting, BGM cues, and camera choreography via SSE (`streamGenerateContent`). Keys stay strictly in page memory.
- **Unrestricted Multi-Shot Pacing**: Choose AI-determined shot counts & durations or set explicit integer shot counts and multi-minute runtimes without arbitrary small caps, backed by **`27` visual style presets** (live-action reality, 90s retro HK cinema, Wong Kar-wai neon night, documentary, drama, anime, ink wash, etc.) and **`23` film/sensor textures**.
- **Multi-View Prompt Engine & Continuity Checks**: Live-sync across **`10` output views** (full script, current shot, concise, per-second timeline, shot sequence, CSV shot table, first/last frames, asset mounts, generation/editing plan), bilingual curated term output (`中 / EN`), **`25` negative prompts**, **`110` transition options across `6` categories**, and automated consistency checks.

> **UI Language Note**: The workbench UI is currently authored in Simplified Chinese (designed initially for Chinese short-drama & director workflows), while the prompt output panel includes a built-in **`EN`** toggle that translates curated cinematography, lighting, lens, movement, acting, and negative-prompt vocabulary into English while preserving user freeform names and dialogue.

---

## Quick Start

> **Prerequisite**: **Node.js `>= 20`** (`npm install` is **not** required).

### Option 1: Cross-Platform CLI (macOS / Linux / Windows)

```bash
git clone https://github.com/Soulmove/jingxu-workbench.git
cd jingxu-workbench
node server.mjs
# or: npm start
```

Open **`http://127.0.0.1:4173`** in your browser.

### Option 2: Windows One-Click Launcher

Double-click **`启动镜序工作台.bat`** in the repository root to automatically locate Node.js, launch the local preview server on port `4173`, and open the workbench in your browser.

> ⚠ Always open via `http://127.0.0.1:4173` (HTTP). Opening `dist/index.html` directly over `file://` prevents ES Module loading and IndexedDB persistence.

---

## How to Use (5-Step Workflow)

### 1. Pick a Starting Point
From the creative home page, start with:
- **AI Brief**: Enter a story idea or documentary concept (or open **AI填写** in the left sidebar for granular controls).
- **Templates**: Load one of **`12` built-in narrative & commercial templates** and customize freely.
- **Commerce Mode**: Structured workflow for hero product stills, lifestyle scenes, and hook-driven short video ads.
- **Start from Scratch**: Clean blank project with zero injected boilerplate.

### 2. (Optional) Connect Your Personal Google Gemini API Key
1. Navigate to **创作资源 → 服务连接** (Service Connection) in the left sidebar.
2. Paste your personal API key from [Google AI Studio](https://aistudio.google.com/docs/api-key). Default model ID is `gemini-4-hydrogen`, and can be changed to any Gemini model enabled on your project (e.g., `gemini-2.5-pro`, `gemini-2.5-flash`).
3. Click **连接并开始填写** (Connect & Open AI Brief) to test access (`models/...`) without incurring generation usage yet.
4. In **AI填写**, select visual style, film texture, shot count mode (`auto` or manual), frame-chaining (`chainLastFrame`), cut-frame inspection (`cutFrameCheck`), and cast/BGM preferences, then click generate:
   - Plans stream over SSE (`maxOutputTokens: 65536`), strip internal thoughts, and pass strict schema/reference validation before touching your project.
   - Disable auto-fill if you prefer to inspect diffs and selectively apply parts or save to a new project.

### 3. Author Cast, Lighting & Storyboard Shots
- **Characters**: Lock identity traits (face presets, hair, wardrobe, voice) so preset fills or AI updates preserve locked attributes.
- **Scenes & Lighting**: Define location, weather, time of day, key-light direction, and adjust top-down character/camera/key-light spatial placement.
- **Storyboard Tabs & Timeline**:
  - Switch shots via browser-like tabs or inspect all shots in list mode; reorder, split, or merge safely (protecting authored dialogue windows).
  - Configure shot duration (`>= 0.5s`), visible action beats, speaker/dialogue windows, sound effects, and BGM.
  - Pick editing transitions between shots from **`6` categories / `110` transition options**.

### 4. Inspect, Toggle `中 / EN`, and Export Prompts
Use the right-hand **Prompt Output** panel to:
- Switch across **`10` output views**: Full Prompt, Single Shot, Concise, Per-Second Timeline, Shot Sequence, Shot Table (`CSV`), First Frame Still, Last Frame Still, Asset Mount List, and Generation & Edit Plan.
- Toggle **`EN`** to convert curated cinematography & negative vocabulary into English for international video generators, or open the **Manual Edit** view for final prompt polishing.
- Review the **Checks** badge to catch timing overlaps, contradictory camera moves (e.g. dolly vs. zoom conflicts, locked-frame pans), missing scene/cast references, or out-of-window dialogue.

### 5. Backup & Restore Projects (`.jingxu.json`)
- **Export Project**: Click **导出项目** in the top bar to save a portable `.jingxu.json` project file (including attached local reference metadata/previews).
- **Import Project**: Click **导入项目** in the top bar (or inside **我的项目**) to import via **file picker, drag-and-drop, or pasting JSON text**. Imports validate strictly and open with fresh unique IDs so your existing projects are never overwritten.

---

## Configuration Summary

See **[`docs/CONFIGURATION.en.md`](docs/CONFIGURATION.en.md)** for full configuration options, security boundaries, and Cloudflare Workers setup.

| Area | How to Configure | Notes |
|---|---|---|
| Local Port | `PORT=8080 node server.mjs` | Binds only to `127.0.0.1` (default port `4173`) |
| Personal Gemini Model & Channel | Workbench → Service Connection UI | API key stays in tab memory only; model & transport (`browser` direct vs `server` relay) save to `localStorage` |
| Optional Server Fallback Key | Env vars `GEMINI_API_KEY`, `GEMINI_MODEL` | Read from `process.env` when no personal key is sent (**`server.mjs` does not auto-load `.env`**) |
| Single-File Worker Build | `npm run build` | Bundles `23` static assets + API into `dist/server/index.js` |
| Tests & Syntax Checks | `npm test` / `npm run check` | Runs `node --test` across `93` automated unit tests |

---

## Repository Structure

```text
jingxu-workbench/
├─ server.mjs                 # Zero-dependency Node.js 20+ preview & local API bridge (127.0.0.1:4173)
├─ 启动镜序工作台.bat          # Windows one-click launch script
├─ package.json               # Scripts (start / test / check / build), zero third-party deps
├─ .env.example               # Optional environment variable reference
├─ docs/
│  ├─ CONFIGURATION.en.md       # Full English configuration & deployment guide
│  └─ CONFIGURATION.zh-CN.md    # Full Chinese configuration & deployment guide
├─ dist/
│  ├─ index.html              # App entry shell & inline SVG icon symbols
│  ├─ app.mjs                 # Workbench UI, 3-column layout, modals & interaction handlers
│  ├─ experience.mjs          # Creative home page, step rail & idea templates
│  ├─ ai-brief.mjs            # AI brief presets (27 visual styles, 23 textures, cast/BGM helpers)
│  ├─ ai-contract.mjs         # AI request/response schema normalization & strict validation
│  ├─ ai-planner.mjs          # Preview diffing & safe selective/new-project plan application
│  ├─ google-provider.mjs     # Google Gemini SSE streaming, connection check & redacted diagnostics
│  ├─ api-connection.mjs      # Credential trimming & client error classification
│  ├─ catalog.mjs             # Bilingual film vocabulary, 12 templates, 110 transitions, 25 negatives
│  ├─ model.mjs               # Timeline continuity, state inheritance, checks, prompt engine & import parser
│  ├─ storage.mjs             # IndexedDB (jingxu-studio) + localStorage preferences/deletion guards
│  ├─ video-core.mjs          # Local video plan snapshots & safe external URL preview checks
│  └─ server/index.js         # Self-contained Cloudflare Workers ESM bundle generated by npm run build
├─ worker/                    # Cloudflare Workers request router, rate limiter & dev fallback assets
├─ scripts/build-worker.mjs   # Worker single-file ESM bundler
└─ tests/                     # 10 test files / 93 Node.js unit tests
```

---

## Data Privacy & Scope Boundaries

- **Local Persistence**: All projects remain in your browser's `IndexedDB`. Clearing browser site storage removes drafts, so regular `.jingxu.json` exports are recommended.
- **API Key Isolation**: Personal keys remain strictly in memory (`personalAI.key`) and are cleared on reload or disconnect. Server relay mode transmits the key per request in `x-jingxu-api-key` without logging or following `3xx` redirects.
- **Video Studio Scope**: The Video Studio tab organizes prompt payloads, saves local `"未提交"` (unsubmitted) plan snapshots, manages local reference assets (max `8 MB` preview per file), and safely previews external `https://` video links. Direct third-party video rendering/billing APIs are not connected yet and `/api/video/*` returns HTTP `501` intentionally to prevent accidental charges.

---

## Attributions & References

Methodologies for shot fields, continuity locks, micro-acting, and commercial hooks drew inspiration from the following open-source projects (verified 2026-11-12). All UI, presets, rule checks, and implementation code were written independently without copying finished videos, images, or full prompt outputs:

| Project | Referenced Concepts | License |
|---|---|---|
| [jnMetaCode/ai-shortfilm-prompts](https://github.com/jnMetaCode/ai-shortfilm-prompts) | Theme, subject, visuals & timeline structure | MIT |
| [Krenlis/director-craft-framework](https://github.com/Krenlis/director-craft-framework) | Shot responsibilities, visible acting & motivated lighting | MIT |
| [zenstory-ai/drama-skills](https://github.com/zenstory-ai/drama-skills) | Identity/styling locks, start/end states & continuity | MIT |
| [shyman159/seedance-prompts-skill](https://github.com/shyman159/seedance-prompts-skill) | Audio-visual timing & categorization (`mantoufan` notice retained) | MIT |
| [jacobye2017-afk/jacob-ye-seedance-prompt](https://github.com/jacobye2017-afk/jacob-ye-seedance-prompt) | Jacob Ye's asset roles, micro-acting & ending states | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| [UnderleveledBuilder/awesome-short-drama-skills](https://github.com/UnderleveledBuilder/awesome-short-drama-skills) | Reference taxonomy & production stages | CC0 1.0 |

Commercial structure references: `fal-ai-community/skills` (`commercial`), `xianyu110/ecommerce-video-skills` (`hook-3s-script`), and `vargHQ/ecommerce-ai-video-skills`.

---

## License

Released under the **[MIT License](LICENSE)**.  
If **Jingxu Workbench** helps your AI filmmaking or prompt engineering workflow, please consider giving this repo a **Star ⭐**!
