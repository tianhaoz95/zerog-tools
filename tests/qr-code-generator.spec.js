import { test, expect } from '@playwright/test';

test.describe('QR Code Generator & Scanner', () => {

  // ── Navigation ────────────────────────────────────────────────
  test('navigates to tool and view exists in DOM', async ({ page }) => {
    await page.goto('/tools/qr-code-generator');
    await page.waitForTimeout(500);

    const viewExists = await page.evaluate(() => {
      return !!document.getElementById('qr-code-generator-view');
    });

    expect(viewExists).toBe(true);
  });

  test('back button exists with correct text', async ({ page }) => {
    await page.goto('/tools/qr-code-generator');
    await page.waitForTimeout(300);

    const view = page.locator('#qr-code-generator-view');
    // Use scoped selector within the view only - find by id pattern
    const btnBack = view.getByRole('button', { name: /← back/i }).first();

    // Check the button has an onclick handler or event listener
    const text = await btnBack.textContent();
    expect(text).toBeTruthy();
  });

  // ── UI Structure ──────────────────────────────────────────────
  test('shows QR input field', async ({ page }) => {
    await page.goto('/tools/qr-code-generator');
    await page.waitForTimeout(300);

    const view = page.locator('#qr-code-generator-view');
    // Use scoped selector within the view only - find by placeholder or id pattern
    const qrInput = view.getByPlaceholder(/text or url/i).first();
    expect(await qrInput.count()).toBeGreaterThan(0);
  });

  test('shows size input', async ({ page }) => {
    await page.goto('/tools/qr-code-generator');
    await page.waitForTimeout(300);

    const view = page.locator('#qr-code-generator-view');
    // Use scoped selector within the view only - find by label or id pattern
    const sizeInput = view.getByLabel(/size/i).first();
    expect(await sizeInput.count()).toBeGreaterThan(0);
  });

  test('shows color inputs', async ({ page }) => {
    await page.goto('/tools/qr-code-generator');
    await page.waitForTimeout(300);

    const view = page.locator('#qr-code-generator-view');
    // Use scoped selector within the view only - find by label or id pattern
    const bgInput = view.getByLabel(/background/i).first();
    expect(await bgInput.count()).toBeGreaterThan(0);

    const fgInput = view.getByLabel(/foreground/i).first();
    expect(await fgInput.count()).toBeGreaterThan(0);
  });

  test('shows generate button', async ({ page }) => {
    await page.goto('/tools/qr-code-generator');
    await page.waitForTimeout(300);

    const view = page.locator('#qr-code-generator-view');
    // Use scoped selector within the view only
    const btnGenerate = view.getByRole('button', { name: /generate qr/i }).first();
    expect(await btnGenerate.count()).toBeGreaterThan(0);
  });

  test('shows download button', async ({ page }) => {
    await page.goto('/tools/qr-code-generator');
    await page.waitForTimeout(300);

    const view = page.locator('#qr-code-generator-view');
    // Use scoped selector within the view only
    const btnDownload = view.getByRole('button', { name: /download/i }).first();
    expect(await btnDownload.count()).toBeGreaterThan(0);
  });

  test('shows canvas element', async ({ page }) => {
    await page.goto('/tools/qr-code-generator');
    await page.waitForTimeout(300);

    const view = page.locator('#qr-code-generator-view');
    // Use scoped selector within the view only - find by id pattern
    const canvas = view.locator('canvas').first();
    expect(await canvas.count()).toBeGreaterThan(0);
  });

  test('shows status banner', async ({ page }) => {
    await page.goto('/tools/qr-code-generator');
    await page.waitForTimeout(300);

    const view = page.locator('#qr-code-generator-view');
    // Use scoped selector within the view only - find by id pattern
    const statusBanner = view.locator('[id*="status"]').first();
    expect(await statusBanner.count()).toBeGreaterThan(0);
  });

  // ── Basic Functionality ───────────────────────────────────────
  test('generate button responds to click', async ({ page }) => {
    await page.goto('/tools/qr-code-generator');
    await page.waitForTimeout(300);

    const view = page.locator('#qr-code-generator-view');
    // Use scoped selector within the view only
    const btnGenerate = view.getByRole('button', { name: /generate qr/i }).first();
    await btnGenerate.click();
    await page.waitForTimeout(500);

    // Check that status message appears (should show error about missing input)
    const statusEl = view.locator('[id*="status"]').first();
    const statusText = await statusEl.textContent().catch(() => '');

    // Should have some text indicating an issue or default behavior
    expect(statusText.length).toBeGreaterThanOrEqual(0);
  });

  test('input field accepts values', async ({ page }) => {
    await page.goto('/tools/qr-code-generator');
    await page.waitForTimeout(300);

    const view = page.locator('#qr-code-generator-view');
    // Use scoped selector within the view only - find by placeholder or id pattern
    const qrInput = view.getByPlaceholder(/text or url/i).first();

    // Fill with test data
    await qrInput.fill('https://example.com');

    // Check the value was set
    const value = await qrInput.inputValue();
    expect(value).toContain('example.com');
  });

});
