// Regression sweep for direct deep links: loading /tools/<id> as the initial
// URL (the pre-rendered static page path) must show the tool's view, not a
// blank screen. Complements all-tools-sweep.spec.js, which covers in-app
// navigation from the home grid.
import { test, expect } from '@playwright/test';
import { TOOLS } from '../src/tools.data.js';

const READY_TOOLS = TOOLS.filter(t => t.uiClass === 'ready');

test('sweep: every /tools/<id> deep link renders a visible tool view', async ({ page }) => {
  test.setTimeout(600_000);

  const errors = [];
  let currentTool = '(initial load)';
  page.on('pageerror', err => errors.push({ tool: currentTool, message: err.message }));
  page.on('dialog', d => d.dismiss().catch(() => {}));

  const broken = [];
  for (const tool of READY_TOOLS) {
    currentTool = tool.id;
    const errorsBefore = errors.length;

    await page.goto(`/tools/${tool.id}`, { waitUntil: 'domcontentloaded' });

    const state = await page.evaluate(() => {
      const active = document.querySelector('.view.active');
      if (!active) return { activeId: null, top: -1, height: 0, textLen: 0 };
      const rect = active.getBoundingClientRect();
      return {
        activeId: active.id,
        top: Math.round(rect.top),
        height: Math.round(rect.height),
        textLen: active.innerText.trim().length,
      };
    });

    const newErrors = errors.slice(errorsBefore).map(e => e.message);
    // top < 300 guards the "view rendered outside the #app grid" regression:
    // such views land below the 100vh app shell, so the viewport looks blank.
    const ok = state.activeId
      && state.activeId !== 'home-view'
      && state.height > 0
      && state.top >= 0 && state.top < 300
      && state.textLen > 0
      && newErrors.length === 0;

    if (!ok) broken.push({ id: tool.id, ...state, errors: newErrors });
  }

  expect(broken, `Broken deep links:\n${JSON.stringify(broken, null, 2)}`).toEqual([]);
});
