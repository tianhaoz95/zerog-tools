import { test, expect } from '@playwright/test';

test.describe('AI Noise Reducer / Audio Denoiser Tool', () => {

  // ── Navigation ────────────────────────────────────────────────
  test('navigates to tool and shows view', async ({ page }) => {
    await page.goto('/tools/ai-noise-reducer');
    await page.waitForTimeout(500);

    await expect(page.locator('#ai-noise-reducer-view')).toHaveClass(/active/);
  });

  test('back button returns to home', async ({ page }) => {
    await page.goto('/tools/ai-noise-reducer');
    await page.waitForTimeout(300);

    await page.click('#btn-ai-noise-reducer-back');
    await expect(page.locator('#home-view')).toHaveClass(/active/);
  });

  // ── UI Structure ──────────────────────────────────────────────
  test('shows file upload input', async ({ page }) => {
    await page.goto('/tools/ai-noise-reducer');
    await page.waitForTimeout(300);

    const fileInput = page.locator('#noise-file-input');
    await expect(fileInput).toBeVisible();
  });

  test('shows filter options', async ({ page }) => {
    await page.goto('/tools/ai-noise-reducer');
    await page.waitForTimeout(300);

    const rumbleCheckbox = page.locator('#noise-remove-rumble');
    const humCheckbox = page.locator('#noise-remove-hum');
    const hissCheckbox = page.locator('#noise-reduce-hiss');

    await expect(rumbleCheckbox).toBeVisible();
    await expect(humCheckbox).toBeVisible();
    await expect(hissCheckbox).toBeVisible();
  });

  test('shows process button', async ({ page }) => {
    await page.goto('/tools/ai-noise-reducer');
    await page.waitForTimeout(300);

    const generateBtn = page.locator('#btn-noise-generate');
    await expect(generateBtn).toBeVisible();
  });

  // ── Functionality ─────────────────────────────────────────────
  test('accepts file upload', async ({ page }) => {
    await page.goto('/tools/ai-noise-reducer');
    await page.waitForTimeout(300);

    // Create a small test audio file (silence)
    const audioContent = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, // RIFF header
      0x24, 0x00, 0x00, 0x00, // File size
      0x57, 0x41, 0x56, 0x45, // WAVE format
      0x66, 0x6D, 0x74, 0x20, // fmt subchunk
      0x10, 0x00, 0x00, 0x00, // Subchunk1Size (16)
      0x01, 0x00,              // AudioFormat (PCM)
      0x01, 0x00,              // NumChannels (1)
      0x44, 0xAC, 0x00, 0x00, // SampleRate (44100)
      0x88, 0x58, 0x01, 0x00, // ByteRate
      0x02, 0x00,              // BlockAlign
      0x10, 0x00,              // BitsPerSample (16)
      0x64, 0x61, 0x74, 0x61, // data subchunk
      0x00, 0x00, 0x00, 0x00, // Subchunk2Size (0 samples)
    ]);

    await page.setInputFiles('#noise-file-input', {
      name: 'test.wav',
      mimeType: 'audio/wav',
      buffer: Buffer.from(audioContent)
    });

    await page.waitForTimeout(500);

    // Verify file was uploaded (input should have files)
    const fileCount = await page.evaluate(() => {
      const input = document.getElementById('noise-file-input');
      return input ? input.files.length : 0;
    });
    
    expect(fileCount).toBeGreaterThan(0);
  });

});
