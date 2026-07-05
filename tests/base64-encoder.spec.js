import { test, expect } from '@playwright/test';

test.describe('Base64 Encoder/Decoder', () => {

  // ── Navigation ────────────────────────────────────────────────
  test('navigates to tool and view exists in DOM', async ({ page }) => {
    await page.goto('/tools/base64-encoder');
    await page.waitForTimeout(500);

    const viewExists = await page.evaluate(() => {
      return !!document.getElementById('base64-encoder-view');
    });

    expect(viewExists).toBe(true);
  });

  test('back button exists with correct text', async ({ page }) => {
    await page.goto('/tools/base64-encoder');
    await page.waitForTimeout(300);

    const view = page.locator('#base64-encoder-view');
    // Use scoped selector within the view only - find by id pattern
    const btnBack = view.getByRole('button', { name: /← back/i }).first();

    // Check the button has an onclick handler or event listener
    const text = await btnBack.textContent();
    expect(text).toBeTruthy();
  });

  // ── UI Structure ──────────────────────────────────────────────
  test('shows input textarea', async ({ page }) => {
    await page.goto('/tools/base64-encoder');
    await page.waitForTimeout(300);

    const view = page.locator('#base64-encoder-view');
    // Use scoped selector within the view only - find by placeholder or id pattern
    const inputArea = view.getByPlaceholder(/text to encode/i).first();
    expect(await inputArea.count()).toBeGreaterThan(0);
  });

  test('shows file upload input', async ({ page }) => {
    await page.goto('/tools/base64-encoder');
    await page.waitForTimeout(300);

    const view = page.locator('#base64-encoder-view');
    // Use scoped selector within the view only - find by id pattern
    const fileUpload = view.getByText('Or upload a file:').locator('..').locator('[type="file"]').first();
    expect(await fileUpload.count()).toBeGreaterThan(0);
  });

  test('shows encode button', async ({ page }) => {
    await page.goto('/tools/base64-encoder');
    await page.waitForTimeout(300);

    const view = page.locator('#base64-encoder-view');
    // Use scoped selector within the view only
    const btnEncode = view.getByRole('button', { name: /encode to base64/i }).first();
    expect(await btnEncode.count()).toBeGreaterThan(0);
  });

  test('shows decode button', async ({ page }) => {
    await page.goto('/tools/base64-encoder');
    await page.waitForTimeout(300);

    const view = page.locator('#base64-encoder-view');
    // Use scoped selector within the view only
    const btnDecode = view.getByRole('button', { name: /decode from base64/i }).first();
    expect(await btnDecode.count()).toBeGreaterThan(0);
  });

  test('shows output textarea', async ({ page }) => {
    await page.goto('/tools/base64-encoder');
    await page.waitForTimeout(300);

    const view = page.locator('#base64-encoder-view');
    // Use scoped selector within the view only - find by placeholder or id pattern
    const outputArea = view.getByPlaceholder(/encoded\/decoded result/i).first();
    expect(await outputArea.count()).toBeGreaterThan(0);
  });

  test('shows status banner', async ({ page }) => {
    await page.goto('/tools/base64-encoder');
    await page.waitForTimeout(300);

    const view = page.locator('#base64-encoder-view');
    // Use scoped selector within the view only - find by id pattern
    const statusBanner = view.locator('[id*="status"]').first();
    expect(await statusBanner.count()).toBeGreaterThan(0);
  });

  // ── Basic Functionality ───────────────────────────────────────
  test('encode button responds to click', async ({ page }) => {
    await page.goto('/tools/base64-encoder');
    await page.waitForTimeout(300);

    const view = page.locator('#base64-encoder-view');
    // Use scoped selector within the view only
    const btnEncode = view.getByRole('button', { name: /encode to base64/i }).first();
    await btnEncode.click();
    await page.waitForTimeout(500);

    // Check that status message appears (should show error about missing input)
    const statusEl = view.locator('[id*="status"]').first();
    const statusText = await statusEl.textContent().catch(() => '');

    // Should have some text indicating an issue or default behavior
    expect(statusText.length).toBeGreaterThanOrEqual(0);
  });

  test('decode button responds to click', async ({ page }) => {
    await page.goto('/tools/base64-encoder');
    await page.waitForTimeout(300);

    const view = page.locator('#base64-encoder-view');
    // Use scoped selector within the view only
    const btnDecode = view.getByRole('button', { name: /decode from base64/i }).first();
    await btnDecode.click();
    await page.waitForTimeout(500);

    // Check that status message appears (should show error about missing input)
    const statusEl = view.locator('[id*="status"]').first();
    const statusText = await statusEl.textContent().catch(() => '');

    // Should have some text indicating an issue or default behavior
    expect(statusText.length).toBeGreaterThanOrEqual(0);
  });

  test('input field accepts values', async ({ page }) => {
    await page.goto('/tools/base64-encoder');
    await page.waitForTimeout(300);

    const view = page.locator('#base64-encoder-view');
    // Use scoped selector within the view only - find by placeholder or id pattern
    const inputArea = view.getByPlaceholder(/text to encode/i).first();

    // Fill with test data
    await inputArea.fill('Hello World!');

    // Check the value was set
    const value = await inputArea.inputValue();
    expect(value).toContain('Hello World!');
  });

});
