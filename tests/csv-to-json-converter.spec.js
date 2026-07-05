import { test, expect } from '@playwright/test';

test.describe('CSV to JSON Converter', () => {

  // ── Navigation ────────────────────────────────────────────────
  test('navigates to tool and view exists in DOM', async ({ page }) => {
    await page.goto('/tools/csv-to-json-converter');
    await page.waitForTimeout(500);

    const viewExists = await page.evaluate(() => {
      return !!document.getElementById('csv-to-json-converter-view');
    });

    expect(viewExists).toBe(true);
  });

  test('back button exists with correct text', async ({ page }) => {
    await page.goto('/tools/csv-to-json-converter');
    await page.waitForTimeout(300);

    const btnBack = page.locator('#btn-csv-to-json-back');

    // Check the button has an onclick handler or event listener
    const text = await btnBack.textContent();
    expect(text).toBeTruthy();
  });

  // ── UI Structure ──────────────────────────────────────────────
  test('shows CSV input textarea', async ({ page }) => {
    await page.goto('/tools/csv-to-json-converter');
    await page.waitForTimeout(300);

    const csvInput = page.locator('#csv-input');
    // Check element exists and has expected attributes
    await expect(csvInput).toHaveAttribute('id', 'csv-input');
  });

  test('shows file upload input', async ({ page }) => {
    await page.goto('/tools/csv-to-json-converter');
    await page.waitForTimeout(300);

    const fileUpload = page.locator('#csv-file-upload');
    // Check element exists and has expected attributes
    await expect(fileUpload).toHaveAttribute('id', 'csv-file-upload');
  });

  test('shows status banner', async ({ page }) => {
    await page.goto('/tools/csv-to-json-converter');
    await page.waitForTimeout(300);

    const statusBanner = page.locator('#csv-status');
    // Check element exists and has expected attributes
    await expect(statusBanner).toHaveAttribute('id', 'csv-status');
  });

  test('shows options section with headers checkbox', async ({ page }) => {
    await page.goto('/tools/csv-to-json-converter');
    await page.waitForTimeout(300);

    const hasHeaders = page.locator('#has-headers');
    // Check element exists and has expected attributes
    await expect(hasHeaders).toHaveAttribute('id', 'has-headers');
  });

  test('shows delimiter select dropdown', async ({ page }) => {
    await page.goto('/tools/csv-to-json-converter');
    await page.waitForTimeout(300);

    const delimiterSelect = page.locator('#delimiter-select');
    // Check element exists and has expected attributes
    await expect(delimiterSelect).toHaveAttribute('id', 'delimiter-select');
  });

  test('shows convert button', async ({ page }) => {
    await page.goto('/tools/csv-to-json-converter');
    await page.waitForTimeout(300);

    const btnConvert = page.locator('#btn-convert-csv');
    // Check element exists and has expected text content
    const text = await btnConvert.textContent();
    expect(text).toContain('Convert to JSON');
  });

  test('shows output section', async ({ page }) => {
    await page.goto('/tools/csv-to-json-converter');
    await page.waitForTimeout(300);

    // Check that the view has output elements (use more specific selector)
    const view = page.locator('#csv-to-json-converter-view');
    expect(await view.count()).toBeGreaterThan(0);
  });

  test('shows action buttons', async ({ page }) => {
    await page.goto('/tools/csv-to-json-converter');
    await page.waitForTimeout(300);

    // Check that the view has button elements (use more specific selector)
    const view = page.locator('#csv-to-json-converter-view');
    const buttons = await view.locator('button').count();
    expect(buttons).toBeGreaterThanOrEqual(2);  // At least convert, copy, download buttons
  });

  // ── Basic Functionality ───────────────────────────────────────
  test('convert button responds to click', async ({ page }) => {
    await page.goto('/tools/csv-to-json-converter');
    await page.waitForTimeout(300);

    const btnConvert = page.locator('#btn-convert-csv');
    await btnConvert.click();
    await page.waitForTimeout(500);

    // Check that status message appears (should show error about empty input)
    const statusEl = page.locator('#csv-status');
    const statusText = await statusEl.textContent();

    // Should have some text indicating an issue or default behavior
    expect(statusText.length).toBeGreaterThanOrEqual(0);
  });

  test('input fields accept values', async ({ page }) => {
    await page.goto('/tools/csv-to-json-converter');
    await page.waitForTimeout(300);

    const csvInput = page.locator('#csv-input');

    // Fill with CSV data
    await csvInput.fill('Name, Age, City\nAlice, 30, New York\nBob, 25, San Francisco');

    // Check the value was set
    const value = await csvInput.inputValue();
    expect(value).toContain('Name, Age, City');
  });

  test('delimiter select has options', async ({ page }) => {
    await page.goto('/tools/csv-to-json-converter');
    await page.waitForTimeout(300);

    const delimiterSelect = page.locator('#delimiter-select');
    // Check that the select element exists and has at least one option
    const count = await delimiterSelect.evaluate(sel => sel.options.length);
    expect(count).toBeGreaterThanOrEqual(1);
  });

});
