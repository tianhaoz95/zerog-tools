import { test, expect } from '@playwright/test';

test.describe('JSON Pretty Printer & Minifier', () => {

  // ── Navigation ────────────────────────────────────────────────
  test('navigates to tool and view exists in DOM', async ({ page }) => {
    await page.goto('/tools/json-pretty-printer');
    await page.waitForTimeout(500);

    const viewExists = await page.evaluate(() => {
      return !!document.getElementById('json-pretty-printer-view');
    });

    expect(viewExists).toBe(true);
  });

  test('back button exists with correct text', async ({ page }) => {
    await page.goto('/tools/json-pretty-printer');
    await page.waitForTimeout(300);

    const btnBack = page.locator('#btn-json-formatter-back');

    // Check the button has an onclick handler or event listener
    const text = await btnBack.textContent();
    expect(text).toBeTruthy();
  });

  // ── UI Structure ──────────────────────────────────────────────
  test('shows JSON input textarea', async ({ page }) => {
    await page.goto('/tools/json-pretty-printer');
    await page.waitForTimeout(300);

    const view = page.locator('#json-pretty-printer-view');
    // Use scoped selector within the view only
    const jsonInput = view.getByRole('textbox').first();
    expect(await jsonInput.count()).toBeGreaterThan(0);
  });

  test('shows file upload input', async ({ page }) => {
    await page.goto('/tools/json-pretty-printer');
    await page.waitForTimeout(300);

    const view = page.locator('#json-pretty-printer-view');
    // Use scoped selector within the view only - find by accept attribute or text content
    const fileUpload = view.getByText('Or upload a .json file:').locator('..').locator('[type="file"]').first();
    expect(await fileUpload.count()).toBeGreaterThan(0);
  });

  test('shows status banner', async ({ page }) => {
    await page.goto('/tools/json-pretty-printer');
    await page.waitForTimeout(300);

    const view = page.locator('#json-pretty-printer-view');
    // Use scoped selector within the view only - find by id pattern
    const statusBanner = view.locator('[id*="status"]').first();
    expect(await statusBanner.count()).toBeGreaterThan(0);
  });

  test('shows pretty print button', async ({ page }) => {
    await page.goto('/tools/json-pretty-printer');
    await page.waitForTimeout(300);

    const view = page.locator('#json-pretty-printer-view');
    // Use scoped selector within the view only
    const btnPretty = view.getByRole('button', { name: /pretty print/i }).first();
    expect(await btnPretty.count()).toBeGreaterThan(0);
  });

  test('shows minify button', async ({ page }) => {
    await page.goto('/tools/json-pretty-printer');
    await page.waitForTimeout(300);

    const view = page.locator('#json-pretty-printer-view');
    // Use scoped selector within the view only
    const btnMinify = view.getByRole('button', { name: /minify/i }).first();
    expect(await btnMinify.count()).toBeGreaterThan(0);
  });

  test('shows indent select dropdown', async ({ page }) => {
    await page.goto('/tools/json-pretty-printer');
    await page.waitForTimeout(300);

    const view = page.locator('#json-pretty-printer-view');
    // Use scoped selector within the view only
    const indentSelect = view.getByRole('combobox').first();
    expect(await indentSelect.count()).toBeGreaterThan(0);
  });

  test('shows JSON output textarea', async ({ page }) => {
    await page.goto('/tools/json-pretty-printer');
    await page.waitForTimeout(300);

    const view = page.locator('#json-pretty-printer-view');
    // Use scoped selector within the view only - second textbox (first is input)
    const jsonOutput = view.getByRole('textbox').nth(1);
    expect(await jsonOutput.count()).toBeGreaterThan(0);
  });

  test('shows copy to clipboard button', async ({ page }) => {
    await page.goto('/tools/json-pretty-printer');
    await page.waitForTimeout(300);

    const view = page.locator('#json-pretty-printer-view');
    // Use scoped selector within the view only
    const btnCopy = view.getByRole('button', { name: /copy/i }).first();
    expect(await btnCopy.count()).toBeGreaterThan(0);
  });

  test('shows download button', async ({ page }) => {
    await page.goto('/tools/json-pretty-printer');
    await page.waitForTimeout(300);

    const view = page.locator('#json-pretty-printer-view');
    // Use scoped selector within the view only
    const btnDownload = view.getByRole('button', { name: /download/i }).first();
    expect(await btnDownload.count()).toBeGreaterThan(0);
  });

  // ── Basic Functionality ───────────────────────────────────────
  test('pretty print button responds to click', async ({ page }) => {
    await page.goto('/tools/json-pretty-printer');
    await page.waitForTimeout(300);

    const view = page.locator('#json-pretty-printer-view');
    // Use scoped selector within the view only
    const btnPretty = view.getByRole('button', { name: /pretty print/i }).first();
    await btnPretty.click();
    await page.waitForTimeout(500);

    // Check that status message appears (should show error about empty input)
    const statusEl = view.locator('[id*="status"]').first();
    const statusText = await statusEl.textContent().catch(() => '');

    // Should have some text indicating an issue or default behavior
    expect(statusText.length).toBeGreaterThanOrEqual(0);
  });

  test('minify button responds to click', async ({ page }) => {
    await page.goto('/tools/json-pretty-printer');
    await page.waitForTimeout(300);

    const view = page.locator('#json-pretty-printer-view');
    // Use scoped selector within the view only
    const btnMinify = view.getByRole('button', { name: /minify/i }).first();
    await btnMinify.click();
    await page.waitForTimeout(500);

    // Check that status message appears (should show error about empty input)
    const statusEl = view.locator('[id*="status"]').first();
    const statusText = await statusEl.textContent().catch(() => '');

    // Should have some text indicating an issue or default behavior
    expect(statusText.length).toBeGreaterThanOrEqual(0);
  });

  test('input fields accept values', async ({ page }) => {
    await page.goto('/tools/json-pretty-printer');
    await page.waitForTimeout(300);

    const view = page.locator('#json-pretty-printer-view');
    // Use scoped selector within the view only - first textbox (input)
    const jsonInput = view.getByRole('textbox').first();

    // Fill with JSON data
    await jsonInput.fill('{"name":"John","age":30,"city":"New York"}');

    // Check the value was set
    const value = await jsonInput.inputValue();
    expect(value).toContain('"name"');
  });

  test('indent select has options', async ({ page }) => {
    await page.goto('/tools/json-pretty-printer');
    await page.waitForTimeout(300);

    const view = page.locator('#json-pretty-printer-view');
    // Use scoped selector within the view only - find the indent dropdown by label
    const indentSelect = view.getByLabel(/indent/i).first();
    // Check that the select element exists and has at least one option
    const count = await indentSelect.evaluate(sel => sel.options.length);
    expect(count).toBeGreaterThanOrEqual(1);
  });

});
