<div align="center">

# AI Video Prompt Studio (镜序 · Jingxu)

**A forward-looking AI video prompt generator, storyboard continuity director & short-film prompt workbench — local-first, zero external dependencies**

[🌐 Live Static Demo (GitHub Pages)](https://soulmove.github.io/ai-video-prompt-studio/) · [简体中文](README.md) · [English](README.en.md) · [Configuration Guide (EN)](docs/CONFIGURATION.en.md) · [全配置与使用手册 (中文)](docs/CONFIGURATION.zh-CN.md)

[![Live Demo](https://img.shields.io/badge/Demo-GitHub%20Pages-brightgreen?logo=githubpages)](https://soulmove.github.io/ai-video-prompt-studio/)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-green.svg)](#quick-start)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-blue.svg)](#overview)

<br>

<img src="dist/assets/creative-still.jpg" alt="Jingxu Studio Cinematic Concept Still" width="760" />

<sub>Original AI-generated mood concept image for the creative home page (see <a href="ASSETS.md">ASSETS.md</a>)</sub>

</div>

---

## 🌐 Live Online Experience

Try the full workbench immediately in your browser—no installation, cloning, or backend required:

👉 **Live GitHub Pages Demo**: https://soulmove.github.io/ai-video-prompt-studio/

> **Notes on the Static Online Edition (GitHub Pages)**:
> - **100% Client-Side Ready**: All `12` templates, Quick / Director / Commerce modes, character identity locks, 2D spatial lighting diagrams, multi-shot timeline & transitions (`6` categories / `110` options), `10` prompt output formats with `中 / EN` mapping, browser `IndexedDB` persistence, and `.jingxu.json` export/import run directly in your browser.
> - **Using AI Brief Online**: Open **Service Connection** (`服务连接`), paste your own **Google Gemini API Key**, and use the default **Browser Direct (`浏览器直连`)** transport (keys stay solely in page memory; same-origin `/api/*` server relay requires running `node server.mjs` locally or deploying to Cloudflare Workers).

---

## 🔮 Ahead of Its Time: Key Highlights & 1–2 Year AI Outlook

Most AI video generation tools today still operate like **single-shot slot machines**: once you move from one 5-second clip to a multi-shot narrative, characters drift in facial identity and wardrobe, lighting direction jumps randomly, held props vanish between cuts, and dialogue pacing rarely fits clip runtime.

> **Why Jingxu Looks 1–2 Years Ahead of Current Video AI Models:**  
> **The directorial granularity engineered into this workbench is deliberately ahead of what most current commercial video models can natively obey in one pass. Over the next 1–2 years—as long-context multi-shot video generation, native first/last-frame locking, joint audio-video synthesis, and controllable identity agents mature—AI video models capable of natively digesting every structured contract in this studio will emerge.**

Here are the **five forward-looking bets** already built into **Jingxu Workbench**:

1. **From Loose Text Prompts to Cross-Shot Director Continuity Contracts**
   - Includes per-character locks (facial structure, hairstyle, wardrobe, voice), cross-shot start/end prop state inheritance (e.g., holding an unmarked letter at the end of Shot 1 carries into Shot 2), **Chain Last Frame (`chainLastFrame`)** toggle, and **Cut-Frame Boundary Inspection (`cutFrameCheck`)**.
   - Even before every third-party generator natively enforces multi-shot keyframe memory, Jingxu keeps your continuity ledger coherent—and prepares structured rules ready for next-gen multi-shot models.

2. **Sub-Shot `0.5s` Action Slices + Micro-Acting + Dialogue Lip-Sync Windows**
   - Supports per-shot segmented action beats down to `0.5s`, micro-acting gaze/expression notes, Chinese/spoken-rate lip-sync time-window estimation, timed SFX cues (`soundCues`), and global vs. per-shot BGM ducking/silence flags.
   - As multimodal joint audio-video generators arrive over the next 1–2 years, these structured timing blocks translate straight into native audiovisual timelines.

3. **2D Spatial Blocking Diagram & Automated Cinematography Sanity Checks**
   - Visual top-down blocking editor placing **subject, camera, and key light** on a shared 2D stage, alongside reusable custom camera preset libraries.
   - Live rule checker catches impossible camera combinations (e.g., simultaneous Dolly vs. Zoom conflicts, pan moves on fully locked cameras, or dialogue word counts overflowing shot windows) before spending GPU credits.

4. **Decoupled Generation Budget vs. Cut In/Out Points + 110 Transition Specs**
   - Separates **planned raw generation duration**, **edit in/out trim points**, and a **`6`-category / `110`-option transition library** with overlap budgets and continuity parameters—ready for tomorrow's end-to-end "generate + auto-assemble cut" pipelines.

5. **Model-Agnostic `65K`-Token Thinking AI Planner + Reserved Video API Architecture**
   - Connect your own Gemini API key (`65,536` max output tokens over SSE streaming) to generate unrestricted multi-shot storyboards (or let AI auto-select shot counts and pacing) from a single sentence.
   - An isolated **Video Studio (`Muse / Video API` placeholder)** already tracks frozen prompt snapshots, reference roles (`8 MB` local previews), and external HTTPS video previews—ready to plug into future video generation APIs without rewriting the workbench.

---

## Feature Breakdown (10 Studio Modules)

<details open>
<summary><strong>Click to expand / collapse full module overview</strong></summary>

| Module | Capabilities |
|---|---|
| **1. Creative Home & 4 Entry Paths** | Mood concept hero, instant draft resume, one-sentence AI start, **`12` editable starter templates**, Commerce ad workflow, and an untouched zero-boilerplate blank start. |
| **2. Quick / Director / Commerce Modes** | Lossless switching over the same project schema—hide complexity in Quick Mode, expose full continuity/camera locks in Director Mode, or tailor product hooks & ad beats in Commerce Mode. |
| **3. AI Brief Director (`dist/ai-brief.mjs`)** | **`27` visual style presets** (live-action reality, 90s retro HK cinema, Wong Kar-wai neon night, documentary, theatrical drama, vertical short drama, Republic era, Japanese film, American noir, cyberpunk, Y2K CCD, 2D/3D anime, ink wash, watercolor, clay, pixel, game CG) + **`23` film/sensor textures**; unified or per-character ethnicity/face-tier/skin tuning; unrestricted shot counts or AI-auto pacing. |
| **4. Character Profiles & Locks** | Multi-character cast cards, **16 facial feature combinations**, independent locks on appearance/hair/wardrobe/voice so presets or AI updates never clobber fixed traits, plus reusable character templates. |
| **5. Scenes, Lighting & 2D Blocking** | Location, weather, time-of-day, key/fill lighting direction & quality, plus interactive 2D stage diagram for character, camera, and light positioning. |
| **6. Cinematography & Reusable Presets** | Shot size, camera angle, framing, focal length look, movement type, orbit direction/angle, roll, zoom, focus, stabilization—save custom presets to reuse across projects. |
| **7. Browser-Tab Storyboard & Timeline** | Instant tab switching per shot or full list view, drag/button reordering, dialogue-safe split & merge confirmation previews, ordered vs. free timelines, minimum `0.5s` granularity. |
| **8. Micro-Acting, Dialogue & Audio** | Emotion/delivery presets, spoken language & voice type, word-count duration estimator, timed sound cues, and global/per-shot BGM rules. |
| **9. Reference Assets & Video Plans** | Local image/audio/video attachment previews (up to `8 MB` suggested per file; bytes never sent to AI), explicit role/exclusion tags, unsubmitted video plan snapshots & safe external `https://` playback. |
| **10. 10 Prompt Formats & JSON Backup** | Switch live across Full, Single Shot, Concise, Per-Second Timeline, Sequence, Shot Table (`CSV`), First/Last Frame stills, Asset Mounts, and Generation/Edit Plan; **`中 / EN`** curated term toggle; **`25` negative prompts**; TXT/CSV/JSON export plus **file / drag-and-drop / paste-JSON import**. |

</details>

> **UI Language Note**: The interactive web interface is written in Simplified Chinese, while the Prompt Output panel includes an **`EN`** button that converts curated filmmaking, lighting, lens, movement, acting, and negative-prompt phrases into English while keeping user-entered names and dialogue intact.

---

## Quick Start & Hosting Comparison

> **Prerequisite for self-hosting**: **Node.js `>= 20`** (`npm install` is **not** required—zero third-party npm packages).

### 1. Instant Online Demo
Open **https://soulmove.github.io/ai-video-prompt-studio/** directly in your browser.

### 2. Local CLI (macOS / Linux / Windows)
```bash
git clone https://github.com/Soulmove/ai-video-prompt-studio.git
cd ai-video-prompt-studio
node server.mjs
# or: npm start
```
Then open **`http://127.0.0.1:4173`** (⚠ always access over HTTP rather than `file://`, as ES modules and IndexedDB require HTTP).

### 3. Windows One-Click Launcher
Double-click **`启动镜序工作台.bat`** in the repository root.

### Hosting Modes Compared

| Capability | GitHub Pages (Static) | Local `node server.mjs` | Cloudflare Workers (`dist/server/index.js`) |
|---|---|---|---|
| **Entry** | [Live Demo](https://soulmove.github.io/ai-video-prompt-studio/) | `http://127.0.0.1:4173` | Your Workers domain |
| **Templates / Storyboard / Prompts / JSON Import & Export** | ✅ Full support (`IndexedDB`) | ✅ Full support | ✅ Full support |
| **Personal Google API (Browser Direct)** | ✅ Supported (in-memory only) | ✅ Supported | ✅ Supported |
| **Same-Origin `/api/*` Server Relay & Env Fallback Key** | ❌ Static host has no `/api/*` | ✅ Supported (`local-preview` bridge) | ✅ Supported (rate-limited + 3xx-safe) |

---

## Configuration Summary

For complete documentation on ports, Google API direct vs. relay transport, `GEMINI_API_KEY` / `GEMINI_MODEL` environment variables, IndexedDB schemas, and Cloudflare Workers `wrangler.toml` setup, read:
👉 **[`docs/CONFIGURATION.en.md`](docs/CONFIGURATION.en.md)** · **[`docs/CONFIGURATION.zh-CN.md`](docs/CONFIGURATION.zh-CN.md)**

| Option | How to Set | Notes |
|---|---|---|
| Custom Local Port | `PORT=8080 node server.mjs` | Binds exclusively to `127.0.0.1` (default `4173`) |
| Personal Gemini Key & Model | Workbench → Service Connection | Default `gemini-4-hydrogen`; key lives in tab memory only |
| Optional Server Fallback Env | `GEMINI_API_KEY`, `GEMINI_MODEL` | Read from `process.env`; **`server.mjs` does not auto-load `.env`** |
| Single-File Worker Build | `npm run build` | Compiles `23` assets + API router to `dist/server/index.js` |
| Tests & Syntax Checks | `npm test` / `npm run check` | Runs `93` automated unit tests via Node built-in `node:test` |

---

## Attributions & References

Methodologies for shot fields, continuity locks, micro-acting, and commercial script hooks drew inspiration from the following open-source repositories (verified 2026-11-12). UI, presets, rule checks, and runtime code are implemented independently:

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
If you believe structured director workflows are the missing bridge to next-generation multi-shot video AI, give **Jingxu Workbench** a **Star ⭐** to follow future model integrations!
