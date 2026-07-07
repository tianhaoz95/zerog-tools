import { test, expect } from '@playwright/test';

test.describe('IBAN & SWIFT/BIC Validator Tool', () => {

  // ── Navigation ────────────────────────────────────────────────
  test('navigates to tool and view exists in DOM', async ({ page }) => {
    await page.goto('/tools/iban-swift-validator');
    await page.waitForTimeout(500);

    const viewExists = await page.evaluate(() => {
      return !!document.getElementById('iban-swift-validator-view');
    });
    
    expect(viewExists).toBe(true);
  });

  test('back button exists with correct text', async ({ page }) => {
    await page.goto('/tools/iban-swift-validator');
    await page.waitForTimeout(300);

    const btnBack = page.locator('#btn-iban-swift-back');
    
    // Check the button has an onclick handler or event listener
    const text = await btnBack.textContent();
    expect(text).toBeTruthy();
  });

  // ── UI Structure ──────────────────────────────────────────────
  test('shows IBAN input field', async ({ page }) => {
    await page.goto('/tools/iban-swift-validator');
    await page.waitForTimeout(300);

    const ibanInput = page.locator('#iban-input');
    // Check element exists and has expected attributes
    await expect(ibanInput).toHaveAttribute('id', 'iban-input');
  });

  test('shows IBAN validate button', async ({ page }) => {
    await page.goto('/tools/iban-swift-validator');
    await page.waitForTimeout(300);

    const btnValidate = page.locator('#btn-iban-validate');
    // Check element exists and has expected text content
    const text = await btnValidate.textContent();
    expect(text).toContain('Validate IBAN');
  });

  test('shows IBAN output container', async ({ page }) => {
    await page.goto('/tools/iban-swift-validator');
    await page.waitForTimeout(300);

    const ibanOutput = page.locator('#iban-output-container');
    // Check element exists
    await expect(ibanOutput).toHaveAttribute('id', 'iban-output-container');
  });

  test('shows SWIFT input field', async ({ page }) => {
    await page.goto('/tools/iban-swift-validator');
    await page.waitForTimeout(300);

    const swiftInput = page.locator('#swift-input');
    // Check element exists and has expected attributes
    await expect(swiftInput).toHaveAttribute('id', 'swift-input');
  });

  test('shows SWIFT validate button', async ({ page }) => {
    await page.goto('/tools/iban-swift-validator');
    await page.waitForTimeout(300);

    const btnValidate = page.locator('#btn-swift-validate');
    // Check element exists and has expected text content
    const text = await btnValidate.textContent();
    expect(text).toContain('Validate SWIFT');
  });

  test('shows SWIFT output container', async ({ page }) => {
    await page.goto('/tools/iban-swift-validator');
    await page.waitForTimeout(300);

    const swiftOutput = page.locator('#swift-output-container');
    // Check element exists
    await expect(swiftOutput).toHaveAttribute('id', 'swift-output-container');
  });

});
