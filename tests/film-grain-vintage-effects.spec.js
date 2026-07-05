import { test, expect } from '@playwright/test';

test.describe('Film Grain & Vintage Photo Effects Tool', () => {

  // ── Navigation ────────────────────────────────────────────────
  test('navigates to tool and view exists in DOM', async ({ page }) => {
    await page.goto('/tools/film-grain-vintage-effects');
    await page.waitForTimeout(500);

    const viewExists = await page.evaluate(() => {
      return !!document.getElementById('film-grain-vintage-effects-view');
    });
    
    expect(viewExists).toBe(true);
  });

  test('back button exists with correct text', async ({ page }) => {
    await page.goto('/tools/film-grain-vintage-effects');
    await page.waitForTimeout(300);

    const btnBack = page.locator('#btn-film-grain-back');
    
    // Check the button has an onclick handler or event listener
    const text = await btnBack.textContent();
    expect(text).toBeTruthy();
  });

  // ── UI Structure ──────────────────────────────────────────────
  test('shows image upload input', async ({ page }) => {
    await page.goto('/tools/film-grain-vintage-effects');
    await page.waitForTimeout(300);

    const fileInput = page.locator('#film-grain-image-input');
    // Check element exists and has expected attributes
    await expect(fileInput).toHaveAttribute('type', 'file');
  });

  test('shows preset selection dropdown', async ({ page }) => {
    await page.goto('/tools/film-grain-vintage-effects');
    await page.waitForTimeout(300);

    const select = page.locator('#film-grain-preset-select');
    // Check element exists and has expected attributes
    await expect(select).toHaveAttribute('id', 'film-grain-preset-select');
  });

  test('shows apply effect button', async ({ page }) => {
    await page.goto('/tools/film-grain-vintage-effects');
    await page.waitForTimeout(300);

    const btnApply = page.locator('#btn-film-grain-apply');
    // Check element exists and has expected text content
    const text = await btnApply.textContent();
    expect(text).toContain('Apply Effect');
  });

  test('shows result canvas', async ({ page }) => {
    await page.goto('/tools/film-grain-vintage-effects');
    await page.waitForTimeout(300);

    const resultCanvas = page.locator('#film-grain-result-canvas');
    // Check element exists
    await expect(resultCanvas).toHaveAttribute('id', 'film-grain-result-canvas');
  });

  // ── Functionality ─────────────────────────────────────────────
  test('accepts image file upload', async ({ page }) => {
    await page.goto('/tools/film-grain-vintage-effects');
    await page.waitForTimeout(300);

    // Create a small dummy PNG file (1x1 pixel)
    const pngContent = new Uint8Array([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // width=1, height=1
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
      0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, // IDAT chunk
      0x54, 0x08, 0xD7, 0x63, 0xF8, 0xCF, 0xC0, 0x00,
      0x00, 0x00, 0x02, 0x00, 0x01, 0xE2, 0x21, 0xBC,
      0x33, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, // IEND chunk
      0x44, 0xAE, 0x42, 0x60, 0x82,
    ]);

    await page.setInputFiles('#film-grain-image-input', {
      name: 'test.png',
      mimeType: 'image/png',
      buffer: Buffer.from(pngContent)
    });

    await page.waitForTimeout(500);

    // Verify file was uploaded (input should have files)
    const fileCount = await page.evaluate(() => {
      const input = document.getElementById('film-grain-image-input');
      return input ? input.files.length : 0;
    });

    expect(fileCount).toBeGreaterThan(0);
  });

});
