import { test, expect } from '@playwright/test';

test.describe('MIDI File Player & Piano-Roll Visualizer Tool', () => {

  // ── Navigation ────────────────────────────────────────────────
  test('navigates to tool and shows view', async ({ page }) => {
    await page.goto('/tools/midi-player');
    await page.waitForTimeout(500);

    await expect(page.locator('#midi-player-view')).toHaveClass(/active/);
  });

  test('back button returns to home', async ({ page }) => {
    await page.goto('/tools/midi-player');
    await page.waitForTimeout(300);

    await page.click('#btn-midi-player-back');
    await expect(page.locator('#home-view')).toHaveClass(/active/);
  });

  // ── UI Structure ──────────────────────────────────────────────
  test('shows file upload input', async ({ page }) => {
    await page.goto('/tools/midi-player');
    await page.waitForTimeout(300);

    const fileInput = page.locator('#midi-file-input');
    await expect(fileInput).toBeVisible();
  });

  test('shows play button', async ({ page }) => {
    await page.goto('/tools/midi-player');
    await page.waitForTimeout(300);

    const playBtn = page.locator('#btn-midi-play');
    await expect(playBtn).toBeVisible();
  });

  test('shows piano roll canvas', async ({ page }) => {
    await page.goto('/tools/midi-player');
    await page.waitForTimeout(300);

    const canvas = page.locator('#piano-roll-canvas');
    await expect(canvas).toBeVisible();
  });

  // ── Functionality ─────────────────────────────────────────────
  test('accepts file upload', async ({ page }) => {
    await page.goto('/tools/midi-player');
    await page.waitForTimeout(300);

    // Create a minimal valid MIDI file (header only with one empty track)
    const midiContent = new Uint8Array([
      0x4D, 0x54, 0x68, 0x64, // "MThd" header
      0x00, 0x00, 0x00, 0x06, // Header length (6 bytes)
      0x00, 0x01,              // Format 1 (multiple tracks)
      0x00, 0x02,              // 2 tracks
      0x04, 0xE0,              // 768 ticks per beat
      0x4D, 0x54, 0x72, 0x6B, // "MTrk" header
      0x00, 0x00, 0x00, 0x00, // Track length (0 bytes)
    ]);

    await page.setInputFiles('#midi-file-input', {
      name: 'test.mid',
      mimeType: 'audio/midi',
      buffer: Buffer.from(midiContent)
    });

    await page.waitForTimeout(500);

    // Verify file was uploaded (input should have files)
    const fileCount = await page.evaluate(() => {
      const input = document.getElementById('midi-file-input');
      return input ? input.files.length : 0;
    });

    expect(fileCount).toBeGreaterThan(0);
  });

});
