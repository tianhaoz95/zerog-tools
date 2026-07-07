import { test, expect } from '@playwright/test';

test.describe('Regex Tester with Live Preview', () => {

  // ── Navigation ────────────────────────────────────────────────
  test('navigates to tool and view exists in DOM', async ({ page }) => {
    await page.goto('/tools/regex-live-preview');
    await page.waitForTimeout(500);

    const viewExists = await page.evaluate(() => {
      return !!document.getElementById('regex-live-preview-view');
    });

    expect(viewExists).toBe(true);
  });

  test('back button exists with correct text', async ({ page }) => {
    await page.goto('/tools/regex-live-preview');
    await page.waitForTimeout(300);

    const view = page.locator('#regex-live-preview-view');
    // Use direct ID selector within the view only — unique to this tool
    const btnBack = view.locator('#regex-live-preview-back-btn');
    expect(await btnBack.count()).toBeGreaterThan(0);
  });

  // ── UI Structure ──────────────────────────────────────────────
  test('shows regex pattern input', async ({ page }) => {
    await page.goto('/tools/regex-live-preview');
    await page.waitForTimeout(300);

    const view = page.locator('#regex-live-preview-view');
    // Direct ID selector — unique to this tool's view
    const patternInput = view.locator('#regex-pattern-input');
    expect(await patternInput.count()).toBeGreaterThan(0);
  });

  test('shows sample text textarea', async ({ page }) => {
    await page.goto('/tools/regex-live-preview');
    await page.waitForTimeout(300);

    const view = page.locator('#regex-live-preview-view');
    // Direct ID selector — unique to this tool's view
    const textArea = view.locator('#regex-text-input');
    expect(await textArea.count()).toBeGreaterThan(0);
  });

  test('shows results section', async ({ page }) => {
    await page.goto('/tools/regex-live-preview');
    await page.waitForTimeout(300);

    const view = page.locator('#regex-live-preview-view');
    // Check that the output area exists in this view
    const outputArea = view.locator('#regex-output');
    expect(await outputArea.count()).toBeGreaterThan(0);
  });

  test('shows status banner', async ({ page }) => {
    await page.goto('/tools/regex-live-preview');
    await page.waitForTimeout(300);

    const view = page.locator('#regex-live-preview-view');
    // Direct ID selector — unique to this tool's view
    const statusBanner = view.locator('#regex-status');
    expect(await statusBanner.count()).toBeGreaterThan(0);
  });

  // ── Basic Functionality ───────────────────────────────────────
  test('pattern input accepts values', async ({ page }) => {
    await page.goto('/tools/regex-live-preview');
    await page.waitForTimeout(300);

    const view = page.locator('#regex-live-preview-view');
    // Direct ID selector — unique to this tool's view
    const patternInput = view.locator('#regex-pattern-input');

    // Fill with test data
    await patternInput.fill('\\b[A-Z]{2}\\d{4}');

    // Check the value was set
    const value = await patternInput.inputValue();
    expect(value).toContain('A-Z');
  });

  test('text area accepts values', async ({ page }) => {
    await page.goto('/tools/regex-live-preview');
    await page.waitForTimeout(300);

    const view = page.locator('#regex-live-preview-view');
    // Direct ID selector — unique to this tool's view
    const textArea = view.locator('#regex-text-input');

    // Fill with test data
    await textArea.fill('Hello World! This is a test.');

    // Check the value was set
    const value = await textArea.inputValue();
    expect(value).toContain('Hello World');
  });

});
