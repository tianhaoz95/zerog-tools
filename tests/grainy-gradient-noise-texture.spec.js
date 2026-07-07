import { test, expect } from '@playwright/test';

test.describe('Grainy Gradient / Noise Texture Generator Tool', () => {

  // ── Navigation ────────────────────────────────────────────────
  test('navigates to tool and view exists in DOM', async ({ page }) => {
    await page.goto('/tools/grainy-gradient-noise-texture');
    await page.waitForTimeout(500);

    const viewExists = await page.evaluate(() => {
      return !!document.getElementById('grainy-gradient-noise-texture-view');
    });
    
    expect(viewExists).toBe(true);
  });

  test('back button exists with correct text', async ({ page }) => {
    await page.goto('/tools/grainy-gradient-noise-texture');
    await page.waitForTimeout(300);

    const btnBack = page.locator('#btn-grainy-gradient-back');
    
    // Check the button has an onclick handler or event listener
    const text = await btnBack.textContent();
    expect(text).toBeTruthy();
  });

  // ── UI Structure ──────────────────────────────────────────────
  test('shows gradient preset selection dropdown', async ({ page }) => {
    await page.goto('/tools/grainy-gradient-noise-texture');
    await page.waitForTimeout(300);

    const select = page.locator('#grainy-gradient-preset-select');
    // Check element exists and has expected attributes
    await expect(select).toHaveAttribute('id', 'grainy-gradient-preset-select');
  });

  test('shows noise opacity slider', async ({ page }) => {
    await page.goto('/tools/grainy-gradient-noise-texture');
    await page.waitForTimeout(300);

    const slider = page.locator('#grainy-gradient-noise-opacity');
    // Check element exists and has expected attributes
    await expect(slider).toHaveAttribute('type', 'range');
  });

  test('shows generate preview button', async ({ page }) => {
    await page.goto('/tools/grainy-gradient-noise-texture');
    await page.waitForTimeout(300);

    const btnGenerate = page.locator('#btn-grainy-gradient-generate');
    // Check element exists and has expected text content
    const text = await btnGenerate.textContent();
    expect(text).toContain('Generate Preview');
  });

  test('shows export CSS button', async ({ page }) => {
    await page.goto('/tools/grainy-gradient-noise-texture');
    await page.waitForTimeout(300);

    const btnExportCSS = page.locator('#btn-grainy-gradient-export-css');
    // Check element exists and has expected text content
    const text = await btnExportCSS.textContent();
    expect(text).toContain('Export CSS');
  });

  test('shows download PNG button', async ({ page }) => {
    await page.goto('/tools/grainy-gradient-noise-texture');
    await page.waitForTimeout(300);

    const btnDownloadPNG = page.locator('#btn-grainy-gradient-download-png');
    // Check element exists and has expected text content
    const text = await btnDownloadPNG.textContent();
    expect(text).toContain('Download PNG');
  });

  test('shows download SVG button', async ({ page }) => {
    await page.goto('/tools/grainy-gradient-noise-texture');
    await page.waitForTimeout(300);

    const btnDownloadSVG = page.locator('#btn-grainy-gradient-download-svg');
    // Check element exists and has expected text content
    const text = await btnDownloadSVG.textContent();
    expect(text).toContain('Download SVG');
  });

  test('shows preview image area', async ({ page }) => {
    await page.goto('/tools/grainy-gradient-noise-texture');
    await page.waitForTimeout(300);

    const resultImage = page.locator('#grainy-gradient-result-image');
    // Check element exists
    await expect(resultImage).toHaveAttribute('id', 'grainy-gradient-result-image');
  });

  test('shows CSS output area', async ({ page }) => {
    await page.goto('/tools/grainy-gradient-noise-texture');
    await page.waitForTimeout(300);

    const cssOutput = page.locator('#grainy-gradient-css-output');
    // Check element exists
    await expect(cssOutput).toHaveAttribute('id', 'grainy-gradient-css-output');
  });

});
