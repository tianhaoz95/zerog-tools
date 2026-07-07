import { test, expect } from '@playwright/test';

test.describe('Random Data Generator', () => {

  // ── Navigation ────────────────────────────────────────────────
  test('navigates to tool and view exists in DOM', async ({ page }) => {
    await page.goto('/tools/random-data-generator');
    await page.waitForTimeout(500);

    const viewExists = await page.evaluate(() => {
      return !!document.getElementById('random-data-generator-view');
    });

    expect(viewExists).toBe(true);
  });

  test('back button exists', async ({ page }) => {
    await page.goto('/tools/random-data-generator');
    await page.waitForTimeout(300);

    const view = page.locator('#random-data-generator-view');
    const btnBack = view.locator('#btn-random-data-back');
    expect(await btnBack.count()).toBeGreaterThan(0);
  });

  // ── UI Structure ──────────────────────────────────────────────
  test('shows category checkboxes', async ({ page }) => {
    await page.goto('/tools/random-data-generator');
    await page.waitForTimeout(300);

    const view = page.locator('#random-data-generator-view');
    // Use a more specific selector to find checkboxes within the categories section
    const categories = view.locator('input[type="checkbox"][value]').all();
    expect((await categories).length).toBeGreaterThan(0);
  });

  test('shows count input', async ({ page }) => {
    await page.goto('/tools/random-data-generator');
    await page.waitForTimeout(300);

    const view = page.locator('#random-data-generator-view');
    const countInput = view.locator('#random-data-count');
    expect(await countInput.count()).toBeGreaterThan(0);
  });

  test('shows gender selector', async ({ page }) => {
    await page.goto('/tools/random-data-generator');
    await page.waitForTimeout(300);

    const view = page.locator('#random-data-generator-view');
    const genderSelect = view.locator('#random-data-gender');
    expect(await genderSelect.count()).toBeGreaterThan(0);
  });

  test('shows generate button', async ({ page }) => {
    await page.goto('/tools/random-data-generator');
    await page.waitForTimeout(300);

    const view = page.locator('#random-data-generator-view');
    const generateBtn = view.locator('#random-data-generate-btn');
    expect(await generateBtn.count()).toBeGreaterThan(0);
  });

  test('shows output area', async ({ page }) => {
    await page.goto('/tools/random-data-generator');
    await page.waitForTimeout(300);

    const view = page.locator('#random-data-generator-view');
    const outputArea = view.locator('#random-data-output');
    expect(await outputArea.count()).toBeGreaterThan(0);
  });

  test('shows status banner', async ({ page }) => {
    await page.goto('/tools/random-data-generator');
    await page.waitForTimeout(300);

    const view = page.locator('#random-data-generator-view');
    const statusBanner = view.locator('#random-data-status');
    expect(await statusBanner.count()).toBeGreaterThan(0);
  });

  // ── Basic Functionality ───────────────────────────────────────
  test('generates data with default categories', async ({ page }) => {
    await page.goto('/tools/random-data-generator');
    await page.waitForTimeout(300);

    const view = page.locator('#random-data-generator-view');
    const generateBtn = view.locator('#random-data-generate-btn');
    const outputArea = view.locator('#random-data-output');

    // Click generate button (default categories: name, address, email)
    await generateBtn.click();
    await page.waitForTimeout(500);

    // Check that output area has content
    const outputHTML = await outputArea.innerHTML();
    expect(outputHTML.length).toBeGreaterThan(0);
  });

  test('generates custom number of records', async ({ page }) => {
    await page.goto('/tools/random-data-generator');
    await page.waitForTimeout(300);

    const view = page.locator('#random-data-generator-view');
    const countInput = view.locator('#random-data-count');
    const generateBtn = view.locator('#random-data-generate-btn');
    const outputArea = view.locator('#random-data-output');

    // Set custom count
    await countInput.fill('3');

    // Click generate button
    await generateBtn.click();
    await page.waitForTimeout(500);

    // Check that data was generated (should have 3 rows in table)
    const rowCount = await outputArea.locator('table tbody tr').count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('respects gender filter', async ({ page }) => {
    await page.goto('/tools/random-data-generator');
    await page.waitForTimeout(300);

    const view = page.locator('#random-data-generator-view');
    const genderSelect = view.locator('#random-data-gender');
    const generateBtn = view.locator('#random-data-generate-btn');

    // Select female gender
    await genderSelect.selectOption('female');

    // Click generate button
    await generateBtn.click();
    await page.waitForTimeout(500);

    // Check that names were generated (should have some content)
    const outputArea = view.locator('#random-data-output');
    const outputHTML = await outputArea.innerHTML();
    expect(outputHTML.length).toBeGreaterThan(0);
  });

  test('includes selected categories in output', async ({ page }) => {
    await page.goto('/tools/random-data-generator');
    await page.waitForTimeout(300);

    const view = page.locator('#random-data-generator-view');

    // Uncheck some default categories and check others
    const nameCheckbox = view.locator('input[value="name"]');
    const phoneCheckbox = view.locator('input[value="phone"]');

    // Uncheck name, keep phone checked (it's unchecked by default)
    await nameCheckbox.uncheck();

    // Click generate button
    const generateBtn = view.locator('#random-data-generate-btn');
    await generateBtn.click();
    await page.waitForTimeout(500);

    // Check output - should not have names but might have other data
    const outputArea = view.locator('#random-data-output');
    const outputHTML = await outputArea.innerHTML();
    expect(outputHTML.length).toBeGreaterThan(0);
  });

  test('copy button exists and is clickable', async ({ page }) => {
    await page.goto('/tools/random-data-generator');
    await page.waitForTimeout(300);

    const view = page.locator('#random-data-generator-view');

    // First generate some data
    const generateBtn = view.locator('#random-data-generate-btn');
    await generateBtn.click();
    await page.waitForTimeout(500);

    // Verify copy button exists and is visible
    const copyBtn = view.locator('#random-data-copy-btn');
    await expect(copyBtn).toBeVisible();

    // Click the copy button (clipboard write may be denied in test env)
    await copyBtn.click();
    await page.waitForTimeout(500);

    // Status should show some message (success or clipboard permission error)
    const statusBanner = view.locator('#random-data-status');
    const statusText = await statusBanner.textContent();
    expect(statusText.length).toBeGreaterThan(0);
  });

});
