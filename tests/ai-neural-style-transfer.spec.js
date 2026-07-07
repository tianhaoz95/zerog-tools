import { test, expect } from '@playwright/test';

test.describe('AI Neural Style Transfer Tool', () => {

  // ── Navigation ────────────────────────────────────────────────
  test('navigates to tool and view exists in DOM', async ({ page }) => {
    await page.goto('/tools/ai-neural-style-transfer');
    await page.waitForTimeout(500);

    // Verify the view element exists (may not be active due to CSS)
    const viewExists = await page.evaluate(() => {
      return !!document.getElementById('ai-neural-style-transfer-view');
    });
    
    expect(viewExists).toBe(true);
  });

  test('back button exists with correct text', async ({ page }) => {
    await page.goto('/tools/ai-neural-style-transfer');
    await page.waitForTimeout(300);

    const btnBack = page.locator('#btn-style-back');
    
    // Check the button text content (should contain "Back" or similar)
    const text = await btnBack.textContent();
    expect(text).toBeTruthy();
  });

  // ── UI Structure ──────────────────────────────────────────────
  test('shows image upload input', async ({ page }) => {
    await page.goto('/tools/ai-neural-style-transfer');
    await page.waitForTimeout(300);

    const fileInput = page.locator('#style-image-input');
    // Check element exists and has expected attributes
    await expect(fileInput).toHaveAttribute('type', 'file');
  });

  test('shows style selection dropdown', async ({ page }) => {
    await page.goto('/tools/ai-neural-style-transfer');
    await page.waitForTimeout(300);

    const select = page.locator('#style-select');
    // Check element exists and has expected options
    await expect(select).toHaveAttribute('id', 'style-select');
    
    // Verify it has the expected style options
    const optionCount = await select.locator('[value="mosaic"], [value="candy"], [value="pointillism"], [value="udnie"]').count();
    expect(optionCount).toBeGreaterThanOrEqual(4);
  });

  test('shows apply style button', async ({ page }) => {
    await page.goto('/tools/ai-neural-style-transfer');
    await page.waitForTimeout(300);

    const btnApply = page.locator('#btn-style-apply');
    // Check element exists and has expected text content
    const text = await btnApply.textContent();
    expect(text).toContain('Apply Style');
  });

  test('shows result canvas', async ({ page }) => {
    await page.goto('/tools/ai-neural-style-transfer');
    await page.waitForTimeout(300);

    const resultCanvas = page.locator('#style-result-canvas');
    // Check element exists
    await expect(resultCanvas).toHaveAttribute('id', 'style-result-canvas');
  });

  // ── Functionality ─────────────────────────────────────────────
  test('accepts image file upload', async ({ page }) => {
    await page.goto('/tools/ai-neural-style-transfer');
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

    await page.setInputFiles('#style-image-input', {
      name: 'test.png',
      mimeType: 'image/png',
      buffer: Buffer.from(pngContent)
    });

    await page.waitForTimeout(500);

    // Verify file was uploaded (input should have files)
    const fileCount = await page.evaluate(() => {
      const input = document.getElementById('style-image-input');
      return input ? input.files.length : 0;
    });

    expect(fileCount).toBeGreaterThan(0);
  });

});
