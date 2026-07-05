# 🚀 ZeroG Toolbox — 20 Tools To Build Next

A research-backed backlog of client-side, serverless, browser-native tools to add to ZeroG Toolbox.
All tools must run **entirely client-side** (no server round-trips), follow the project design system, and
AI-powered tools must carry the `.tool-badge.ai` badge per workspace rules.

**Progress:** 30 / 30 complete

> Agent: check the box `[x]` after each tool is built, tested (Playwright), and merged.
> Avoid duplicating the ~206 tools already shipped (see `src/tools.data.js`).

---

## 🧑‍💻 Developer & Web Platform (1–5)

- [x] 1. **SSH Key Pair Generator** — Generate Ed25519/RSA/ECDSA key pairs via WebCrypto (with a bundled JS fallback for Ed25519 where native support is missing), export OpenSSH-format public + PEM private keys, never leaves the browser
- [x] 2. **X.509 Certificate Decoder & Viewer** — Paste/upload a PEM certificate, parse ASN.1 client-side to show issuer, subject, validity window, SANs, and key usage (with full support for: Subject Alternative Names, Key Usage extensions, Basic Constraints, Extended Key Usage, signature algorithms, and raw DER output)
- [x] 3. **OpenAPI / Swagger Spec Explorer & Validator** — Paste/upload an OpenAPI 3.x YAML or JSON doc, validate structure, render a browsable endpoint tree with a "try it" request builder
- [x] 4. **JSON Schema Validator** — Paste a JSON Schema plus a data instance, validate the instance against the schema and list path-level errors (complements the existing schema-*generator*, which goes data → schema, not data-against-schema)
- [x] 5. **Local Folder Batch Renamer** — Pick a folder via the File System Access API, preview a find/replace or sequential-numbering rename pattern across all files, then rename in place (zip-download fallback on browsers without the picker)

## 🔒 Security & Privacy (6–9)

- [x] 6. **CSP Header Generator & Analyzer** — Build a Content-Security-Policy string from a directive checklist/input UI, or paste an existing CSP to flag `unsafe-inline`/`unsafe-eval`/wildcard risks
- [x] 7. **PGP/GPG Message Encryptor & Decryptor** — Generate PGP key pairs and encrypt/decrypt/sign text messages in-browser via WebCrypto APIs (RSA-OAEP + AES-GCM, distinct from the existing AES file encrypter)
- [x] 8. **Web Push VAPID Key Pair Generator** — Generate a P-256 ECDH key pair via WebCrypto and output URL-safe base64 public/private VAPID keys for Web Push setup
- [x] 9. **Subresource Integrity (SRI) Hash Generator** — Upload or paste a JS/CSS file's contents, compute SHA-384/512, and output a ready-to-paste `<script integrity="...">`/`<link integrity="...">` snippet

## 🎧 Audio & Media (10–13)

- [x] 10. **AI Noise Reducer / Audio Denoiser** — Upload an audio clip, run an on-device RNNoise-style WASM model to strip background hiss/hum, export the cleaned track
- [x] 11. **Silence Remover & Auto-Trim for Podcasts** — Analyze waveform amplitude to detect silent gaps, auto-cut them below a threshold, and stitch/export the shortened audio (distinct from the existing manual waveform trimmer)
- [x] 12. **Video Trimmer & Compressor (WebCodecs)** — Trim a video clip and re-encode at a target bitrate/resolution entirely in-browser via WebCodecs, exporting MP4/WebM (not GIF, unlike the existing GIF converter)
- [x] 13. **MIDI File Player & Piano-Roll Visualizer** — Parse an uploaded `.mid` file, play it back via Web Audio/Web MIDI, and render a scrolling piano-roll visualization of the notes

## 🖼️ Graphics, Vision & Design (14–17)

- [x] 14. **AI Visual Question Answering** — Upload an image, type a free-form question about it, and get an on-device VQA model's answer (combines vision + language, distinct from the existing captioner and text-only QA tools)
- [x] 15. **AI Neural Style Transfer** — Upload a photo and pick an artistic style (or reference image), apply an on-device style-transfer ONNX model via WebGPU to repaint the photo
- [x] 16. **Film Grain & Vintage Photo/Video Effect Generator** — Apply procedural film-grain, halation, and color-cast presets (35mm, VHS, Polaroid, etc.) to an image or short video clip on canvas
- [x] 17. **Grainy Gradient / Noise Texture Generator** — Build a layered noise-over-gradient CSS/SVG background (the 2026 "grainy gradient" trend), with exportable CSS and PNG texture download

## 💰 Calculators & Finance (18–20)

- [x] 18. **IBAN & SWIFT/BIC Validator** — Validate an IBAN's mod-97 checksum and decode its country/bank/account segments; separately validate SWIFT/BIC code structure
- [x] 19. **Debt Snowball vs. Avalanche Payoff Calculator** — Enter multiple debts (balance, rate, min payment), compare snowball vs. avalanche payoff order, output a month-by-month payoff timeline and total interest saved
- [x] 20. **Rent vs. Buy Home Calculator** — Input rent, home price, down payment, mortgage rate, and holding period to project net cost of renting vs. buying over time, accounting for appreciation, opportunity cost, and closing costs


- [x] 21. **PDF Page Extractor** — Upload a PDF and select which pages to keep, extract specific page ranges into a new standalone PDF file (client-side using pdf.js or similar)
- [x] 22. **CSV to JSON Converter** — Paste or upload CSV data, convert to formatted JSON with headers detection and type inference
- [x] 23. **JSON Pretty Printer & Minifier** — Format minified JSON into readable indented output or compress pretty-printed JSON to one line; supports syntax validation

---

## 💡 Quick Utilities (24–27)

- [x] 24. **Color Palette Generator** — Upload an image and extract a harmonious color palette (5–8 colors) using k-means clustering on pixel data
- [x] 25. **QR Code Generator & Scanner** — Generate QR codes from text/URLs with customizable colors/sizes; also scan QR codes from uploaded images or webcam feed
- [x] 26. **Base64 Encoder/Decoder** — Encode text/files to Base64 or decode Base64 back to original format; supports file upload for binary data
- [x] 27. **Markdown to HTML Converter** — Paste Markdown text and get rendered HTML output with live preview panel

---

## 📊 Data & Analytics (28–30)

- [x] 28. **JSON Path Tester** — Input JSON data and test JSONPath queries against it; shows matched nodes with path visualization
- [x] 29. **Regex Tester with Live Preview** — Paste regex pattern + sample text, see matches highlighted in real-time with capture group breakdown
- [x] 30. **Random Data Generator** — Generate realistic fake data (names, addresses, emails, phone numbers) for testing and development purposes


---

### 📚 Research Sources
- [10015.io](https://10015.io/) — competitor all-in-one online toolbox, category coverage baseline
- [OmniTools (GitHub)](https://github.com/iib0011/omni-tools) — self-hosted client-side tool suite, category gaps (image/video/PDF/data)
- [IT-Tools (GitHub)](https://github.com/corentinth/it-tools) — developer-focused utility collection for feature-gap comparison
- [Transformers.js v3: WebGPU Support, New Models & Tasks](https://huggingface.co/blog/transformersjs-v3) — confirmed in-browser VQA, style-transfer-adjacent vision tasks, WebGPU acceleration
- [Transformers.js docs](https://huggingface.co/docs/transformers.js/en/index) — supported pipeline task list (NLP/vision/audio/multimodal) for AI tool feasibility
- [WebCodecs API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API) — confirmed cross-browser support (2026) for in-browser video trim/compress tool
- [File System Access API — browser support](https://www.testmuai.com/learning-hub/file-system-access-api-browser-support/) — enabled the local folder batch renamer concept
- [Origin Private File System — MDN](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system) — OPFS support matrix informing fallback strategy
- [Glassmorphism 2.0: Modern CSS Techniques (2026)](https://weblogtrips.com/technology/glassmorphism-2-0-css-techniques-2026/) — confirmed grain/noise-texture design trend for 2026
- [ffmpeg.wasm (GitHub)](https://github.com/ffmpegwasm/ffmpeg.wasm) — feasibility reference for WASM-based audio/video processing tools
