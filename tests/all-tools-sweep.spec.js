// Regression sweep: every registered tool must open a visible, non-empty view
// without throwing an uncaught error. Catches the "blank screen" failure mode
// where navigateTo() dies mid-flight (init throws / view id mismatch) and no
// .view ever receives the .active class.
import { test, expect } from '@playwright/test';
import { TOOLS } from '../src/tools.data.js';

const READY_TOOLS = TOOLS.filter(t => t.uiClass === 'ready');

test('sweep: every ready tool opens a visible view without JS errors', async ({ page }) => {
  test.setTimeout(240_000);

  const errors = [];
  let currentTool = '(initial load)';
  page.on('pageerror', err => errors.push({ tool: currentTool, message: err.message }));
  page.on('dialog', d => d.dismiss().catch(() => {}));

  await page.goto('/');
  await page.waitForSelector('.tool-card');

  const broken = [];
  for (const tool of READY_TOOLS) {
    currentTool = tool.id;
    const errorsBefore = errors.length;

    await page.evaluate(id => {
      const card = document.querySelector(`.tool-card[data-id="${id}"]`);
      if (!card) throw new Error(`no tool card rendered for "${id}"`);
      card.click();
    }, tool.id);

    const state = await page.evaluate(() => {
      const active = document.querySelector('.view.active');
      if (!active) return { activeId: null, top: -1, height: 0, textLen: 0, path: location.pathname };
      const rect = active.getBoundingClientRect();
      return {
        activeId: active.id,
        top: Math.round(rect.top),
        height: Math.round(rect.height),
        textLen: active.innerText.trim().length,
        path: location.pathname,
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

    await page.evaluate(() => document.getElementById('btn-header-logo').click());
  }

  expect(broken, `Broken tools:\n${JSON.stringify(broken, null, 2)}`).toEqual([]);
});
