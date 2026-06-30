# 🚀 ZeroG Toolbox — 100 Tools To Build Next

A research-backed backlog of client-side, serverless, browser-native tools to add to ZeroG Toolbox.
All tools must run **entirely client-side** (no server round-trips), follow the project design system, and
AI-powered tools must carry the `.tool-badge.ai` badge per workspace rules.

**Progress:** 1 / 100 complete

> Agent: check the box `[x]` after each tool is built, tested (Playwright), and merged.
> Avoid duplicating the ~108 tools already shipped (see `src/tools.data.js`).

---

## 🧑‍💻 Developer & Code (1–20)

- [ ] 1. **Code Beautifier & Minifier** — Format/minify JS, CSS, HTML in one tool (Prettier-in-browser)
- [ ] 2. **GraphQL Query Formatter & Validator** — Pretty-print and lint GraphQL documents
- [ ] 3. **TOML ↔ JSON ↔ YAML Converter** — Round-trip config formats with validation
- [ ] 4. **.env File Validator & Formatter** — Lint, sort, and mask dotenv files
- [ ] 5. **Git Diff Viewer (Patch/Unified)** — Paste a diff and view side-by-side rendering
- [ ] 6. **.gitignore Generator** — Templated gitignore by language/framework stack
- [ ] 7. **Dockerfile Linter & Best-Practice Checker** — Flag anti-patterns client-side
- [ ] 8. **Crontab Builder (Visual)** — Build cron expressions with a visual scheduler UI
- [ ] 9. **HTTP Status Code Reference & Tester** — Searchable status code explorer
- [ ] 10. **cURL ↔ Fetch/Axios Converter** — Convert cURL commands to JS request code
- [ ] 11. **JSON Path / JMESPath Query Tester** — Live query JSON with JSONPath/JMESPath
- [ ] 12. **Code Snippet Screenshot Generator** — Carbon-style beautiful code images
- [ ] 13. **Regex Cheatsheet & Library** — Searchable common regex patterns with copy
- [ ] 14. **Semantic Version (SemVer) Calculator** — Compare/bump versions, check ranges
- [ ] 15. **HTAccess / Nginx Redirect Generator** — Build redirect rules visually
- [ ] 16. **API Mock Response Generator** — Generate fake JSON API responses from schema
- [ ] 17. **WebSocket Tester / Echo Client** — Connect and inspect WS messages live
- [ ] 18. **HTML to JSX Converter** — Convert HTML markup to React JSX
- [ ] 19. **CSS to Tailwind Converter** — Map raw CSS to Tailwind utility classes
- [ ] 20. **Code Complexity / LOC Analyzer** — Count lines, functions, cyclomatic estimate

## ✍️ Text & Writing (21–35)

- [ ] 21. **Find & Replace (Regex Bulk Editor)** — Multi-pattern find/replace across text
- [ ] 22. **Text Sorter & Column Splitter** — Sort, reverse, split text by delimiter
- [ ] 23. **Whitespace & Line Break Cleaner** — Trim, collapse, normalize whitespace
- [ ] 24. **Slug / Permalink Generator** — Convert titles to URL-safe slugs
- [ ] 25. **Markdown ↔ HTML Converter** — Two-way conversion with live preview
- [ ] 26. **Markdown Table Generator** — Visual grid editor that outputs MD tables
- [ ] 27. **Text to Handwriting Generator** — Render text as realistic handwriting on paper
- [ ] 28. **Fancy Unicode Text Generator** — Bold/italic/script social-media text styles
- [ ] 29. **Emoji Picker & Searcher** — Searchable emoji directory with copy + shortcodes
- [ ] 30. **Lorem Ipsum (Themed) Generator** — Hipster/corporate/pirate filler text
- [ ] 31. **Text Reverser & Mirror Tool** — Reverse strings, words, and flip text
- [ ] 32. **Duplicate Line Finder & Remover** — Highlight and dedupe repeated lines
- [ ] 33. **Word Frequency & Keyword Density** — SEO keyword density analyzer
- [ ] 34. **ROT / Vigenère / Atbash Cipher Suite** — Classic cipher encoder/decoder set
- [ ] 35. **Citation / BibTeX Formatter** — Format references (APA/MLA/BibTeX)

## 🖼️ Image & Media (36–52)

- [ ] 36. **Image Cropper & Rotator** — Crop, rotate, flip with aspect presets
- [ ] 37. **Image Compressor (Lossy/Lossless)** — Client-side JPEG/PNG/WebP compression
- [ ] 38. **WebP / AVIF Converter** — Convert images to/from modern formats
- [ ] 39. **Favicon & App Icon Generator** — Generate full favicon/PWA icon set + manifest
- [ ] 40. **Image Color Picker / Eyedropper** — Pick hex colors from uploaded images
- [ ] 41. **Image to ASCII Art Converter** — Convert photos to ASCII/ANSI art
- [ ] 42. **Meme Generator** — Add top/bottom captions to images
- [ ] 43. **Watermark Adder** — Tile/position text or logo watermarks on images
- [ ] 44. **GIF Maker (Images → GIF)** — Assemble frames into an animated GIF
- [ ] 45. **Video to GIF Converter** — Trim a video clip and export as GIF
- [ ] 46. **Spritesheet Generator & Slicer** — Pack/unpack sprite frames
- [ ] 47. **Image Collage / Grid Maker** — Combine images into grids and collages
- [ ] 48. **Photo Filters & Adjustments** — Brightness/contrast/saturation/blur canvas editor
- [ ] 49. **Pixel Art Editor** — Grid-based pixel drawing with palette + export
- [ ] 50. **Blurhash / ThumbHash Generator** — Generate placeholder image hashes
- [ ] 51. **Image Metadata (EXIF/GPS) Viewer Map** — Plot photo GPS on a map
- [ ] 52. **Animated Favicon / Loading Spinner Maker** — Generate CSS/SVG spinners

## 🎨 Design & CSS (53–66)

- [x] 53. **CSS Box Shadow Generator** — Multi-layer shadow builder with live preview
- [ ] 54. **CSS Animation / Keyframe Builder** — Animista-style animation generator
- [ ] 55. **CSS Cubic-Bezier Easing Editor** — Visual easing curve editor + presets
- [ ] 56. **CSS Clip-Path / Shape Generator** — Visual polygon/clip-path maker
- [ ] 57. **CSS Neumorphism Generator** — Soft UI shadow generator
- [ ] 58. **CSS Border-Radius / Blob Generator** — Organic blob shape generator
- [ ] 59. **CSS Filter Playground** — Live preview of all CSS filter functions
- [ ] 60. **Mesh Gradient Generator** — Liquid-glass / mesh gradient backgrounds (trend 2026)
- [ ] 61. **Tailwind Config / Theme Builder** — Generate a tailwind.config color scale
- [ ] 62. **Color Format Converter** — HEX ↔ RGB ↔ HSL ↔ OKLCH ↔ CMYK
- [ ] 63. **Color Shade / Tint Scale Generator** — Generate 50–900 color scales
- [ ] 64. **Font Pairing Previewer** — Preview Google Font combinations live
- [ ] 65. **Type Scale / Modular Scale Generator** — Build a responsive typographic scale
- [ ] 66. **Favicon-Safe Color Contrast Grid** — Full WCAG contrast matrix for a palette

## 🤖 AI (In-Browser, WebGPU/WASM) (67–80)

- [ ] 67. **AI Image Captioning** — Generate captions for uploaded images (BLIP/ViT)
- [ ] 68. **AI Depth Map Estimator** — Generate depth maps from a single photo
- [ ] 69. **AI Zero-Shot Image Classifier** — Classify images against custom labels (CLIP)
- [ ] 70. **AI Grammar & Spell Checker** — On-device grammar correction
- [ ] 71. **AI Text Paraphraser / Rewriter** — Reword text in different tones
- [ ] 72. **AI Named Entity Recognizer** — Extract people/places/orgs from text
- [ ] 73. **AI Question Answering (Context)** — Extractive QA over pasted documents
- [ ] 74. **AI Zero-Shot Text Classifier** — Tag text against arbitrary categories
- [ ] 75. **AI Code Comment / Docstring Generator** — Local small-model code docs
- [ ] 76. **AI Speaker Diarization / Voice Activity** — Detect speech segments in audio
- [ ] 77. **AI Image Segmentation (Click to Mask)** — Segment-anything-style masking
- [ ] 78. **AI Handwriting / Sketch Recognition** — Recognize drawn digits/shapes
- [ ] 79. **AI Smart Image Cropper** — Saliency-based auto-crop to focal point
- [ ] 80. **AI Text Embeddings Visualizer** — Embed and 2D-plot text similarity

## 📊 Data & Converters (81–88)

- [ ] 81. **CSV Viewer / Editor & Cleaner** — Spreadsheet-like CSV editing in browser
- [ ] 82. **Excel (XLSX) ↔ CSV/JSON Converter** — Parse and convert spreadsheets locally
- [ ] 83. **JSON to CSV / Excel Flattener** — Flatten nested JSON to tabular export
- [ ] 84. **SQL ↔ JSON / INSERT Generator** — Generate SQL inserts from JSON data
- [ ] 85. **Chart / Graph Maker** — Build bar/line/pie charts from pasted data + export
- [ ] 86. **GeoJSON Viewer & Editor** — Render and edit GeoJSON on a map
- [ ] 87. **Protobuf / MessagePack Decoder** — Decode binary serialization formats
- [ ] 88. **Data URI / Blob Inspector** — Decode and preview data URIs

## 💰 Finance & Calculators (89–94)

- [ ] 89. **Currency Converter (Offline Rates)** — Convert with cached/manual exchange rates
- [ ] 90. **Loan / Auto Payment Calculator** — Amortization for car & personal loans
- [ ] 91. **Salary / Hourly / Take-Home Calculator** — Gross↔net with tax brackets
- [ ] 92. **Crypto Profit / DCA Calculator** — Cost-basis and DCA return calculator
- [ ] 93. **Invoice / Quote Generator (PDF)** — Build and export branded invoices
- [ ] 94. **Percentage & Discount Calculator** — All-in-one percentage math toolkit

## 🩺 Health & Lifestyle (95–96)

- [ ] 95. **Calorie / Macro & Recipe Calculator** — Per-serving nutrition breakdown
- [ ] 96. **Sleep Cycle / Bedtime Calculator** — Optimal wake/sleep time planner

## 🔒 Security, Network & Productivity (97–100)

- [ ] 97. **Diceware / Passphrase Generator** — Memorable wordlist-based passphrases
- [ ] 98. **TOTP / 2FA Code Generator** — Offline authenticator (TOTP from secret)
- [ ] 99. **DNS / Whois / Header Lookup** — Inspect response headers & DNS-over-HTTPS
- [ ] 100. **Kanban / Markdown Note Board (LocalStorage)** — Offline task board with export

---

### 📚 Research Sources
- [Transformers.js (Hugging Face)](https://huggingface.co/docs/transformers.js/index) — in-browser AI modalities (vision/audio/NLP/multimodal)
- [Multimodal Browser AI with Transformers.js](https://machinelearningmastery.com/multimodal-browser-ai-with-transformers-js-for-images-and-speech/) — image captioning, segmentation, speech
- [12 Best CSS Generators to Code Faster (2026)](https://www.netsourcia.com/en/12-best-css-generators-for-rapid-web-design/) — shadow/gradient/animation generators
- [Top 10 CSS Gradient Generators (2026)](https://dopelycolors.com/blog/top-10-css-gradient-generators-2026) — mesh / liquid-glass gradient trend
- [Free OCR & PDF/Image Converters](https://best.free/) — image/pdf/text converter demand
- [Top Web Development Tools 2026](https://www.digisoftsolution.com/blog/top-web-development-tools) — developer utility landscape
