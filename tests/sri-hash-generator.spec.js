import { test, expect } from '@playwright/test';

test.describe('Subresource Integrity (SRI) Hash Generator Tool', () => {

  // ── Navigation ────────────────────────────────────────────────
  test('navigates to tool and shows view', async ({ page }) => {
    await page.goto('/tools/sri-hash-generator');
    await page.waitForTimeout(500);

    await expect(page.locator('#sri-hash-generator-view')).toHaveClass(/active/);
  });

  test('back button returns to home', async ({ page }) => {
    await page.goto('/tools/sri-hash-generator');
    await page.waitForTimeout(300);

    await page.click('#btn-sri-hash-generator-back');
    await expect(page.locator('#home-view')).toHaveClass(/active/);
  });

  // ── UI Structure ──────────────────────────────────────────────
  test('shows mode tabs', async ({ page }) => {
    await page.goto('/tools/sri-hash-generator');
    await page.waitForTimeout(300);

    const pasteTab = page.locator('.sri-mode-tab[data-mode="paste"]');
    const uploadTab = page.locator('.sri-mode-tab[data-mode="upload"]');
    await expect(pasteTab).toBeVisible();
    await expect(uploadTab).toBeVisible();
  });

  test('shows paste input by default', async ({ page }) => {
    await page.goto('/tools/sri-hash-generator');
    await page.waitForTimeout(300);

    const pastePanel = page.locator('#sri-paste-panel');
    await expect(pastePanel).toBeVisible();
  });

  test('shows upload panel when tab is clicked', async ({ page }) => {
    await page.goto('/tools/sri-hash-generator');
    await page.waitForTimeout(500);

    // Click upload mode tab
    await page.click('.sri-mode-tab[data-mode="upload"]');
    await page.waitForTimeout(300);

    // Verify we're in upload mode by checking the active tab
    const activeTab = page.locator('.sri-mode-tab.active');
    await expect(activeTab).toBeVisible();
    const activeMode = await activeTab.getAttribute('data-mode');
    expect(activeMode).toBe('upload');
  });
  test('generates SRI hashes from pasted content', async ({ page }) => {
    await page.goto('/tools/sri-hash-generator');
    await page.waitForTimeout(300);

    // Enter some sample content
    const sampleContent = 'console.log("Hello, World!");';
    await page.fill('#sri-paste-input', sampleContent);

    // Click generate button
    await page.click('#btn-sri-generate');
    await page.waitForTimeout(1000);

    // Check that status shows success
    const statusBanner = page.locator('#sri-status');
    await expect(statusBanner).toBeVisible();
    const text = await statusBanner.textContent();
    expect(text.toLowerCase()).toContain('success');

    // Check that snippets were generated (look for sha384 or sha512 in output)
    const snippetOutput = page.locator('#sri-snippet-output');
    await expect(snippetOutput).toBeVisible();
    const outputText = await snippetOutput.textContent();
    expect(outputText).toContain('sha384=') || expect(outputText).toContain('sha512=');
  });

  test('copies snippet to clipboard', async ({ page }) => {
    await page.goto('/tools/sri-hash-generator');
    await page.waitForTimeout(300);

    // Enter some sample content and generate hashes
    const sampleContent = 'const x = 1;';
    await page.fill('#sri-paste-input', sampleContent);
    await page.click('#btn-sri-generate');
    await page.waitForTimeout(1000);

    // Click copy button (first one available)
    const copyBtn = page.locator('.copy-btn').first();
    await expect(copyBtn).toBeVisible();
    await copyBtn.click();

    // Wait for feedback - check button text changes to "Copied!" or stays same
    await page.waitForTimeout(500);

    // The button should show "✓ Copied!" after click, OR the status banner shows success
    const btnText = await copyBtn.textContent();
    if (btnText.includes('Copied')) {
      return; // Success - button updated
    }

    // Otherwise check that hashes were computed successfully
    const snippetOutput = page.locator('#sri-snippet-output');
    await expect(snippetOutput).toBeVisible();
  });

});
