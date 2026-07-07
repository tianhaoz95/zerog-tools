---
name: add-new-tool
description: Standard operating procedure for adding, debugging, and modifying client-side utility tools in the ZeroG Toolbox.
---

# ZeroG Toolbox — Custom Skill: Add New Tool

This skill acts as a standard guide for Claude Code, Antigravity, and Codex when adding, modifying, or fixing browser-native utility tools inside the ZeroG Toolbox workspace.

---

## 🏗️ Project Architecture & Constraints

1. **Zero-Server Execution**:
   - All tools run 100% locally in the browser.
   - External API calls are forbidden unless explicitly requested.

2. **Web Worker Offloading**:
   - AI model execution (Qwen2.5, Whisper, MODNet) and heavy compute tasks (OCR, tracing) must run in dedicated Web Workers located in `src/`.
   - The main UI thread must remain fully interactive (60fps) during calculations.

3. **Vanilla CSS Design System**:
   - Maintain light-theme harmony.
   - Use CSS custom variables (`--primary`, `--radius-md`, etc.).
   - Card container hovering must use subtle translate (`translateY(-2px)`) and small shadow elevations (`0 4px 12px rgba(0, 0, 0, 0.08)`) to prevent border and boundary clipping.

---

## 🛠️ Step-by-Step Integration Guide

### 1. Register the Tool
Define the tool metadata in the `TOOLS` array inside [src/tools.data.js](file:///Users/tianhaozhou/experimental/toolbox/src/tools.data.js) — the single source of truth imported by both the runtime app and the static-page build:
```javascript
{
  id: 'my-new-tool',
  title: 'My New Tool Name', // prefix "AI " for AI-powered tools → auto "AI Powered" badge
  description: 'Clean, descriptive one-liner summarizing the client-side capability.',
  keywords: ['keyword1', 'keyword2'],
  tags: ['Image', 'Converter'], // chips drawn from TAG_VOCABULARY (same file)
  category: 'Graphics', // REQUIRED — must be a key in AD_TOPICS_BY_CATEGORY (see below)
  icon: '⚙️',
  uiClass: 'ready', // or 'beta' / 'experimental'
  // adTopics: ['photo printing services', 'design courses'] // OPTIONAL override
}
```

**Ad relevance (important):** every tool view auto-renders one contextual ad
(see `mountToolAd` in `src/main.js`). Its targeting comes from the tool's
metadata, so:
* `category` **must** match a key in `AD_TOPICS_BY_CATEGORY` (bottom of
  `tools.data.js`): `Graphics`, `Audio`, `Text`, `Developer`, `Security`,
  `Calculators`. Introducing a *new* category requires adding a matching entry
  to `AD_TOPICS_BY_CATEGORY` (a `label` + `topics[]`) or the ad falls back to
  generic topics.
* Add the optional `adTopics` array only when the tool warrants more specific,
  higher-value ad topics than its category default.

### 2. Create the HTML View Container
In [index.html](file:///Users/tianhaozhou/experimental/toolbox/index.html), add a `<main>` container with `id="[id]-view"` and class `view`.

**⚠️ Placement is load-bearing:** the view MUST be a **direct child of `<div id="app">`**, next to the other `<main class="view">` siblings and *before* the `</div>` that closes `#app` (the modals and `<script>` tags at the bottom of the file are outside it). `.view` is positioned with `grid-area: content`, which only applies to direct grid children — a view pasted after `#app`'s closing `</div>` silently renders *below* the 100vh app shell, so the tool opens to a blank black viewport. This exact bug once broke 32 tools at once. After editing, verify the balance:
```bash
# every <main id="...-view"> must appear BEFORE the </div> closing #app
npx playwright test tests/all-tools-sweep.spec.js tests/deep-link-sweep.spec.js
```

**⚠️ Only use CSS classes that exist in `src/style.css`.** Views authored against invented class names render as raw unstyled HTML (58 views once shipped this way). Two sanctioned vocabularies:
* **Classic skeleton**: `.tool-view-header` + `.btn-back` + `.tool-view-title`, body in `.tool-workspace` (`.panel-controls` / `.panel-workspace`), controls in `.control-group` with `.input-custom` / `.select-custom`, buttons `.btn-primary` / `.btn-secondary`.
* **Shared tool-view kit** (see the "Shared tool-view kit" section at the end of `style.css`): `.glass-card`, `.tool-body-split` split layout, `.controls-panel` / `.output-panel`, `.form-group` / `.form-row` / `.form-row-2`, `.btn` with `.btn-ghost` / `.btn-sm` / `.btn-block`, result tiles `.summary-card` (`.summary-label` / `.summary-value` / `.summary-profit`) in a `.salary-breakdown-grid`, and `.empty-state-text`.

Before using any other class, confirm it is defined: `grep -c '\.my-class' src/style.css` — if it returns 0, don't use it.

**Every tool view must follow this standard skeleton** — a `.tool-view-header` followed by the tool body. The contextual ad is injected automatically at runtime immediately after `.tool-view-header`, so do **not** add an ad element by hand:
```html
<main id="my-new-tool-view" class="view">
  <div class="tool-view-header">
    <button class="btn-back" id="btn-my-new-tool-back">← Back to Tools</button>
    <div class="tool-view-title">
      <h2>My New Tool Title</h2>
      <p>Extended subtitle instructions.</p>
    </div>
  </div>
  <!-- 📢 contextual ad (.tool-ad) is auto-inserted here by mountToolAd() -->

  <div class="tool-card-main">
    <!-- Main interface components here -->
  </div>
</main>
```
The `.tool-view-header` is mandatory: it is the anchor `mountToolAd()` inserts
the ad after. A view without it still works but the ad lands at the very top of
the panel.

### 3. Bind navigation and Event Handlers
In [src/main.js](file:///Users/tianhaozhou/experimental/toolbox/src/main.js):
- Navigation is handled by `navigateTo(viewId)`. If the view container id follows the `{tool-id}-view` convention, the generic fallback at the end of `navigateTo`'s if/else chain activates it automatically — add an explicit `else if` branch only when the tool needs an init/reset call on open. **Call any `init*()` AFTER adding the `active` class** (or make it throw-proof): an exception thrown before `.active` is applied leaves every view hidden → blank screen.
- Bind the back button to return home:
  ```javascript
  document.getElementById('btn-my-new-tool-back').addEventListener('click', () => navigateTo('home'));
  ```
- Implement the core business logic in a dedicated section of the file.

### 4. Create Integration Tests
Add a dedicated test block inside [tests/toolbox.spec.js](file:///Users/tianhaozhou/experimental/toolbox/tests/toolbox.spec.js) to automate regression testing. Tool cards carry `data-id` (not `data-tool-id`):
```javascript
test('Tool: My New Tool functional test', async ({ page }) => {
  await page.click('.tool-card[data-id="my-new-tool"]');
  await expect(page.locator('#my-new-tool-view')).toBeVisible();
  // Simulate inputs and assert correct outputs
});
```

**Always finish by running the two sweep suites** — they visit every registered tool (in-app click and `/tools/<id>` deep link) and assert the view activates, sits inside the viewport (top < 300px), has content, and throws no uncaught errors:
```bash
npx playwright test tests/all-tools-sweep.spec.js tests/deep-link-sweep.spec.js
```
A new tool is automatically covered — no per-tool wiring needed.

---

## 🛡️ Common Pitfalls & Debugging Checklist

* **Blank Screen on a Tool Route** — check these three causes in order:
  1. *View outside the `#app` grid*: the `<main class="view">` was inserted after the `</div>` closing `#app`, so it renders below the 100vh shell. Fix the placement (see Step 2).
  2. *Init throws before `.active` is applied*: an `else if` branch in `navigateTo` calls a broken `init*()` first, aborting the whole function with every view hidden. Check the browser console for the uncaught error.
  3. *Stale/half-built `dist/`*: `scripts/postbuild.js` runs via the `zerog-postbuild` Vite plugin on every build (including `vite build --watch` rebuilds); if `dist/tools/` is missing or asset hashes mismatch, restart `npm start` — its startup kills stray duplicate watchers that race on `dist/`.
* **Undefined CSS Classes**: markup written against class names that don't exist in `src/style.css` renders as raw unstyled HTML on the dark background — visually indistinguishable from "broken". Verify with `grep -c '\.my-class' src/style.css` before using a class (see Step 2 for the sanctioned vocabularies).
* **Parent-Level Overflow Clipping**: Never use negative margins on scrollable viewports (`.tools-grid`) without keeping parent `overflow` bounds in mind. Rely on inner padding matching outer container element margins (`1.25rem`) to keep shadows pristine.
* **Layout Track Stretching**: Ensure all main grid elements and active `.view` panels specify `min-height: 0;` to prevent flexbox or CSS Grid child items from stretching the viewport row tracks and pushing headers off-screen.
* **Quantization Errors**: Avoid loading models with mismatched weight scaling coefficients in Whisper/ONNX sessions. Verify inference workers initialize correctly.
* **Ad Slot Shows Placeholder / Wrong Topics**: When AdSense has no inventory, is blocked, or `ADSENSE_SLOT` is still the placeholder id, the slot renders a pretty contextual placeholder (`.tool-ad-fallback`) instead of a real ad — this is expected, not a bug. The real ad swaps in automatically (`.tool-ad.is-filled`) once AdSense reports `data-ad-status="filled"`. If the topics look generic, confirm the tool's `category` is a key in `AD_TOPICS_BY_CATEGORY` (or set a per-tool `adTopics`). Set `ADSENSE_SLOT` in `src/main.js` to a real ad-unit id for live ads to fill.
