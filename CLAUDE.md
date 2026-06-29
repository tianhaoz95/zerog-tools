# ZeroG Toolbox — Project Guide

ZeroG Toolbox is a serverless, browser-native utility kit running entirely client-side. This document outlines project setup, development workflows, coding conventions, and customization symlinks.

---

## 🚀 Commands

### Build & Run
*   **Start Dev Server & Emulator**: `npm start` or `./dev-server.sh`
    *(Cleans up ports, runs Vite compilation in watch mode, starts the Firebase Hosting emulator at `http://127.0.0.1:5002`)*
*   **Compile Production Assets**: `npm run build` or `npx vite build`
    *(Outputs optimized HTML, CSS, JS, Web Workers, and compiled ONNX WebAssembly binaries to `dist/`)*

### Local Testing
*   Test and preview the application by browsing to the local emulated site: **[http://127.0.0.1:5002](http://127.0.0.1:5002)**
*   Open the browser Developer Console to review WebGPU acceleration and Web Worker state.

---

## 🛠️ Code Conventions & Design System

### Directory Structure
```
├── dist/                  # Compiled production build (Vite output)
├── public/                # Static assets (favicons, icon maps)
├── src/
│   ├── assets/            # Project SVGs and assets
│   ├── chat.worker.js     # Qwen2.5 LLM chat generation worker (WebGPU/WASM)
│   ├── bg.worker.js       # MODNet portrait segmentation worker (WASM)
│   ├── transcribe.worker.js # Whisper speech-to-text resampled audio worker (WASM)
│   ├── main.js            # Core JS (UI orchestration, canvas math, Web Crypto)
│   └── style.css          # Vanilla CSS custom variables, layouts, and animations
├── dev-server.sh          # Port-cleaning dev orchestrator shell script
├── firebase.json          # Emulator configuration with COOP/COEP headers
└── .firebaserc            # Preconfigured demo-toolbox project ID
```

### Style & Styling Guidelines
*   **Vanilla CSS**: Strictly use custom variables (`--primary`, `--radius-md`) and flexbox/grid. Avoid CSS utilities or Tailwind unless explicitly requested.
*   **Aesthetics**: Sleek dark mode (`#09090b`), glassmorphism (`backdrop-filter: blur()`), glowing neon states, and interactive hover scales.
*   **Typography**: Headings use `Space Grotesk`, body copy uses `Plus Jakarta Sans`.

### Javascript & Worker Guidelines
*   **Variables/Functions**: Use `camelCase` (e.g., `deriveCryptKey`, `fitImageToCanvas`).
*   **Constants**: Use `SCREAMING_SNAKE_CASE` (e.g., `SYSTEM_PROMPT`, `TOOLS`).
*   **Web Workers**: Run all heavy calculations (AI model inferences) in separate Web Worker threads to keep the main thread fluid.
*   **Audio Resampling**: Always resample audio to a mono **16kHz `Float32Array`** using the browser's `AudioContext` before posting to the Whisper worker.
*   **Cryptography**: Use Web Crypto Subtle API (`AES-256-GCM`, `PBKDF2`, HMAC-SHA256, 100,000 iterations).

---

## 🔗 Customization Symlink Instructions (Codex & Antigravity)

Antigravity and Codex automatically discover custom skills, behavioral instructions, and rules from two customization roots:
1.  **Global Root**: `/Users/tianhaozhou/.gemini/config` (loaded globally by the CLI and IDE).
2.  **Workspace Root**: `.agents` directory relative to the workspace root.

To configure and link these customization folders:

### 1. Link Global Config as Workspace Config
If you want the current workspace to share all rules and settings defined in your global `.gemini` folder, create a symlink:
```bash
ln -s /Users/tianhaozhou/.gemini/config/ .agents
```

### 2. Symlink Specific Global Skills
To link a specific plugin skill (e.g., the `science` plugin or a helper skill) into the project so that your active Codex or Antigravity agents can reference it during pair programming:
```bash
# Create local directory structure if it doesn't exist
mkdir -p .agents/skills/

# Symlink the desired skill folder
ln -s /Users/tianhaozhou/.gemini/config/plugins/science/skills/alphafold_database_fetch_and_analyze/ .agents/skills/alphafold_database_fetch_and_analyze
```

### 3. Creating Project-Scoped Rules
To append workspace-specific style guidelines or rules that only apply when editing *this* repository, create a markdown file at `.agents/AGENTS.md` and document your custom directives.
