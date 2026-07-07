import { test, expect } from '@playwright/test';

test.describe('Local Folder Batch Renamer Tool', () => {

  // ── Navigation ────────────────────────────────────────────────
  test('navigates to tool and shows view', async ({ page }) => {
    await page.goto('/tools/batch-rename');
    await page.waitForTimeout(500);

    await expect(page.locator('#batch-rename-view')).toHaveClass(/active/);
  });

  test('back button returns to home', async ({ page }) => {
    await page.goto('/tools/batch-rename');
    await page.waitForTimeout(300);

    await page.click('#btn-batch-rename-back');
    await expect(page.locator('#home-view')).toHaveClass(/active/);
  });

  // ── UI Structure ──────────────────────────────────────────────
  test('shows find & replace mode by default', async ({ page }) => {
    await page.goto('/tools/batch-rename');
    await page.waitForTimeout(300);

    const findReplacePanel = page.locator('#batch-rename-find-replace-options');
    await expect(findReplacePanel).toBeVisible();

    const sequentialPanel = page.locator('#batch-rename-sequential-options');
    await expect(sequentialPanel).not.toBeVisible();
  });

  test('switches to sequential mode', async ({ page }) => {
    await page.goto('/tools/batch-rename');
    await page.waitForTimeout(300);

    // Click the sequential mode tab
    await page.click('.mode-tab[data-mode="sequential"]');
    await page.waitForTimeout(200);

    const findReplacePanel = page.locator('#batch-rename-find-replace-options');
    await expect(findReplacePanel).not.toBeVisible();

    const sequentialPanel = page.locator('#batch-rename-sequential-options');
    await expect(sequentialPanel).toBeVisible();
  });

  // ── Find & Replace Logic ──────────────────────────────────────
  test('preview table shows placeholder when no files selected', async ({ page }) => {
    await page.goto('/tools/batch-rename');
    await page.waitForTimeout(300);

    const previewTable = page.locator('#batch-rename-preview-table');
    const text = await previewTable.textContent();
    expect(text).toContain('No files selected');
  });

  test('find & replace inputs are present', async ({ page }) => {
    await page.goto('/tools/batch-rename');
    await page.waitForTimeout(300);

    await expect(page.locator('#batch-rename-find')).toBeVisible();
    await expect(page.locator('#batch-rename-replace')).toBeVisible();
  });

  test('sequential inputs are present', async ({ page }) => {
    await page.goto('/tools/batch-rename');
    await page.waitForTimeout(300);

    // Switch to sequential mode first
    await page.click('.mode-tab[data-mode="sequential"]');
    await page.waitForTimeout(200);

    await expect(page.locator('#batch-rename-prefix')).toBeVisible();
    await expect(page.locator('#batch-rename-suffix')).toBeVisible();
    await expect(page.locator('#batch-rename-start-at')).toBeVisible();
    await expect(page.locator('#batch-rename-pad-width')).toBeVisible();
  });

  // ── Action Buttons ────────────────────────────────────────────
  test('execute and zip download buttons are present', async ({ page }) => {
    await page.goto('/tools/batch-rename');
    await page.waitForTimeout(300);

    await expect(page.locator('#btn-batch-rename-execute')).toBeVisible();
    await expect(page.locator('#btn-batch-rename-zip')).toBeVisible();
  });

  test('status banner updates on execute click (no files)', async ({ page }) => {
    await page.goto('/tools/batch-rename');
    await page.waitForTimeout(300);

    // Click execute without selecting files
    await page.click('#btn-batch-rename-execute');
    await page.waitForTimeout(200);

    const statusBanner = page.locator('#batch-rename-status');
    await expect(statusBanner).toBeVisible();
    const text = await statusBanner.textContent();
    expect(text).toContain('No files to rename');
  });

});
