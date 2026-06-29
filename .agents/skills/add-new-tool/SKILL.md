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
Define the tool metadata in the `TOOLS` array inside [src/main.js](file:///Users/tianhaozhou/experimental/toolbox/src/main.js):
```javascript
{
  id: 'my-new-tool',
  title: 'My New Tool Name',
  description: 'Clean, descriptive one-liner summarizing the client-side capability.',
  keywords: ['keyword1', 'keyword2'],
  category: 'CategoryName', // e.g., Graphics, Text, Developer, Security
  icon: '⚙️',
  uiClass: 'ready' // or 'beta' / 'experimental'
}
```

### 2. Create the HTML View Container
In [index.html](file:///Users/tianhaozhou/experimental/toolbox/index.html), add a `<main>` container with `id="[id]-view"` and class `view`:
```html
<main id="my-new-tool-view" class="view">
  <div class="tool-view-header">
    <button class="btn-back" id="btn-my-new-tool-back">← Back to Tools</button>
    <div class="tool-view-title">
      <h2>My New Tool Title</h2>
      <p>Extended subtitle instructions.</p>
    </div>
  </div>
  
  <div class="tool-card-main">
    <!-- Main interface components here -->
  </div>
</main>
```

### 3. Bind navigation and Event Handlers
In [src/main.js](file:///Users/tianhaozhou/experimental/toolbox/src/main.js):
- Add selectors for the back button and elements.
- Bind navigation click events to transition back to home:
  ```javascript
  document.getElementById('btn-my-new-tool-back').addEventListener('click', () => showView('home'));
  ```
- Implement the core business logic in a dedicated section of the file.

### 4. Create Integration Tests
Add a dedicated test block inside [tests/toolbox.spec.js](file:///Users/tianhaozhou/experimental/toolbox/tests/toolbox.spec.js) to automate regression testing:
```javascript
test('Tool: My New Tool functional test', async ({ page }) => {
  await page.click('[data-tool-id="my-new-tool"]');
  await expect(page.locator('#my-new-tool-view')).toBeVisible();
  // Simulate inputs and assert correct outputs
});
```

---

## 🛡️ Common Pitfalls & Debugging Checklist

* **Parent-Level Overflow Clipping**: Never use negative margins on scrollable viewports (`.tools-grid`) without keeping parent `overflow` bounds in mind. Rely on inner padding matching outer container element margins (`1.25rem`) to keep shadows pristine.
* **Layout Track Stretching**: Ensure all main grid elements and active `.view` panels specify `min-height: 0;` to prevent flexbox or CSS Grid child items from stretching the viewport row tracks and pushing headers off-screen.
* **Quantization Errors**: Avoid loading models with mismatched weight scaling coefficients in Whisper/ONNX sessions. Verify inference workers initialize correctly.
