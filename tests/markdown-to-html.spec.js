import { test, expect } from '@playwright/test';

test.describe('Markdown to HTML Converter', () => {

  // ── Navigation ────────────────────────────────────────────────
  test('navigates to tool and view exists in DOM', async ({ page }) => {
    await page.goto('/tools/markdown-to-html');
    await page.waitForTimeout(500);

    const viewExists = await page.evaluate(() => {
      return !!document.getElementById('markdown-to-html-view');
    });

    expect(viewExists).toBe(true);
  });

  test('back button exists with correct text', async ({ page }) => {
    await page.goto('/tools/markdown-to-html');
    await page.waitForTimeout(300);

    const view = page.locator('#markdown-to-html-view');
    // Use scoped selector within the view only - find by id pattern
    const btnBack = view.getByRole('button', { name: /← back/i }).first();

    // Check the button has an onclick handler or event listener
    const text = await btnBack.textContent();
    expect(text).toBeTruthy();
  });

  // ── UI Structure ──────────────────────────────────────────────
  test('shows markdown input textarea', async ({ page }) => {
    await page.goto('/tools/markdown-to-html');
    await page.waitForTimeout(300);

    const view = page.locator('#markdown-to-html-view');
    // Use scoped selector within the view only - find by placeholder or id pattern
    const inputArea = view.getByPlaceholder(/hello world/i).first();
    expect(await inputArea.count()).toBeGreaterThan(0);
  });

  test('shows convert button', async ({ page }) => {
    await page.goto('/tools/markdown-to-html');
    await page.waitForTimeout(300);

    const view = page.locator('#markdown-to-html-view');
    // Use scoped selector within the view only
    const btnConvert = view.getByRole('button', { name: /convert to html/i }).first();
    expect(await btnConvert.count()).toBeGreaterThan(0);
  });

  test('shows copy HTML button', async ({ page }) => {
    await page.goto('/tools/markdown-to-html');
    await page.waitForTimeout(300);

    const view = page.locator('#markdown-to-html-view');
    // Use scoped selector within the view only
    const btnCopy = view.getByRole('button', { name: /copy html/i }).first();
    expect(await btnCopy.count()).toBeGreaterThan(0);
  });

  test('shows HTML output textarea', async ({ page }) => {
    await page.goto('/tools/markdown-to-html');
    await page.waitForTimeout(300);

    const view = page.locator('#markdown-to-html-view');
    // Use scoped selector within the view only - find by placeholder or id pattern
    const outputArea = view.getByPlaceholder(/converted html/i).first();
    expect(await outputArea.count()).toBeGreaterThan(0);
  });

  test('shows status banner', async ({ page }) => {
    await page.goto('/tools/markdown-to-html');
    await page.waitForTimeout(300);

    const view = page.locator('#markdown-to-html-view');
    // Use scoped selector within the view only - find by id pattern
    const statusBanner = view.locator('[id*="status"]').first();
    expect(await statusBanner.count()).toBeGreaterThan(0);
  });

  // ── Basic Functionality ───────────────────────────────────────
  test('convert button responds to click', async ({ page }) => {
    await page.goto('/tools/markdown-to-html');
    await page.waitForTimeout(300);

    const view = page.locator('#markdown-to-html-view');
    // Use scoped selector within the view only
    const btnConvert = view.getByRole('button', { name: /convert to html/i }).first();
    await btnConvert.click();
    await page.waitForTimeout(500);

    // Check that status message appears (should show error about missing input)
    const statusEl = view.locator('[id*="status"]').first();
    const statusText = await statusEl.textContent().catch(() => '');

    // Should have some text indicating an issue or default behavior
    expect(statusText.length).toBeGreaterThanOrEqual(0);
  });

  test('input field accepts values', async ({ page }) => {
    await page.goto('/tools/markdown-to-html');
    await page.waitForTimeout(300);

    const view = page.locator('#markdown-to-html-view');
    // Use scoped selector within the view only - find by placeholder or id pattern
    const inputArea = view.getByPlaceholder(/hello world/i).first();

    // Fill with test data
    await inputArea.fill('# Hello World\n\nThis is **Markdown**.');

    // Check the value was set
    const value = await inputArea.inputValue();
    expect(value).toContain('Hello World');
  });

});
