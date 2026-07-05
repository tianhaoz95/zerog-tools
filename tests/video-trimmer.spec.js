import { test, expect } from '@playwright/test';

test.describe('Video Trimmer & Compressor (WebCodecs) Tool', () => {

  // ── Navigation ────────────────────────────────────────────────
  test('navigates to tool and shows view', async ({ page }) => {
    await page.goto('/tools/video-trimmer');
    await page.waitForTimeout(500);

    await expect(page.locator('#video-trimmer-view')).toHaveClass(/active/);
  });

  test('back button returns to home', async ({ page }) => {
    await page.goto('/tools/video-trimmer');
    await page.waitForTimeout(300);

    await page.click('#btn-video-trimmer-back');
    await expect(page.locator('#home-view')).toHaveClass(/active/);
  });

  // ── UI Structure ──────────────────────────────────────────────
  test('shows file upload input', async ({ page }) => {
    await page.goto('/tools/video-trimmer');
    await page.waitForTimeout(300);

    const fileInput = page.locator('#video-file-input');
    await expect(fileInput).toBeVisible();
  });

  test('shows video preview element', async ({ page }) => {
    await page.goto('/tools/video-trimmer');
    await page.waitForTimeout(300);

    const videoPreview = page.locator('#video-preview');
    await expect(videoPreview).toBeVisible();
  });

  test('shows trim controls', async ({ page }) => {
    await page.goto('/tools/video-trimmer');
    await page.waitForTimeout(300);

    const startTimeInput = page.locator('#video-start-time');
    const endTimeInput = page.locator('#video-end-time');
    const bitrateSlider = page.locator('#video-bitrate');
    const resolutionSelect = page.locator('#video-resolution');
    const formatSelect = page.locator('#video-format');

    await expect(startTimeInput).toBeVisible();
    await expect(endTimeInput).toBeVisible();
    await expect(bitrateSlider).toBeVisible();
    await expect(resolutionSelect).toBeVisible();
    await expect(formatSelect).toBeVisible();
  });

  test('shows process button', async ({ page }) => {
    await page.goto('/tools/video-trimmer');
    await page.waitForTimeout(300);

    const generateBtn = page.locator('#btn-video-generate');
    await expect(generateBtn).toBeVisible();
  });

  // ── Functionality ─────────────────────────────────────────────
  test('accepts file upload', async ({ page }) => {
    await page.goto('/tools/video-trimmer');
    await page.waitForTimeout(300);

    // Create a small dummy video file (just metadata)
    const videoContent = new Uint8Array([
      0x00, 0x00, 0x00, 0x1c, // Size
      0x66, 0x74, 0x79, 0x70, // ftyp (ftyp)
      0x69, 0x73, 0x6f, 0x6d, // isom
      0x00, 0x00, 0x02, 0x00, // version
      0x00, 0x00, 0x00, 0x00, // flags
    ]);

    await page.setInputFiles('#video-file-input', {
      name: 'test.mp4',
      mimeType: 'video/mp4',
      buffer: Buffer.from(videoContent)
    });

    await page.waitForTimeout(500);

    // Verify file was uploaded (input should have files)
    const fileCount = await page.evaluate(() => {
      const input = document.getElementById('video-file-input');
      return input ? input.files.length : 0;
    });

    expect(fileCount).toBeGreaterThan(0);
  });

});
