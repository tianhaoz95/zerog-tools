import { test, expect } from '@playwright/test';

test.describe('JSON Schema Validator Tool', () => {

  // ── Navigation ────────────────────────────────────────────────
  test('navigates to tool and shows view', async ({ page }) => {
    await page.goto('/tools/json-schema-validator');
    await page.waitForTimeout(500);

    await expect(page.locator('#json-schema-validator-view')).toHaveClass(/active/);
  });

  test('back button returns to home', async ({ page }) => {
    await page.goto('/tools/json-schema-validator');
    await page.waitForTimeout(300);

    await page.click('#btn-json-schema-validator-back');
    await expect(page.locator('#home-view')).toHaveClass(/active/);
  });

  // ── Valid Schema Validation ───────────────────────────────────
  test('validates valid data against schema', async ({ page }) => {
    const schema = JSON.stringify({
      type: 'object',
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' }
      },
      required: ['id', 'name']
    });

    const data = JSON.stringify({
      id: 1,
      name: 'Alice'
    });

    await page.goto('/tools/json-schema-validator');
    await page.waitForTimeout(300);

    await page.fill('#json-schema-validator-schema', schema);
    await page.fill('#json-schema-validator-data', data);

    await page.click('#btn-validate-schema');
    await page.waitForTimeout(500);

    // Should show success status banner
    const statusBanner = page.locator('#json-schema-validator-status-banner');
    await expect(statusBanner).toBeVisible();
    const statusText = await statusBanner.textContent();
    expect(statusText.toLowerCase()).toContain('passed');
  });

  // ── Invalid Schema Validation ─────────────────────────────────
  test('shows path-level errors for invalid data', async ({ page }) => {
    const schema = JSON.stringify({
      type: 'object',
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' }
      },
      required: ['id', 'name']
    });

    // Invalid data: id is string (not integer), missing name
    const data = JSON.stringify({
      id: 'not-an-integer',
      email: 'alice@example.com'
    });

    await page.goto('/tools/json-schema-validator');
    await page.waitForTimeout(300);

    await page.fill('#json-schema-validator-schema', schema);
    await page.fill('#json-schema-validator-data', data);

    await page.click('#btn-validate-schema');
    await page.waitForTimeout(500);

    // Should show error status
    const statusBanner = page.locator('#json-schema-validator-status-banner');
    await expect(statusBanner).toBeVisible();
    const statusText = await statusBanner.textContent();
    expect(statusText.toLowerCase()).toMatch(/error|failed/i);

    // Should show validation result with errors
    const codeDisplay = page.locator('#json-schema-validator-code-display');
    const displayText = await codeDisplay.textContent();
    expect(displayText).toContain('Validation Failed');
    // Check for path-level error references
    expect(displayText).toContain('/id');
  });

  // ── Invalid JSON Input ────────────────────────────────────────
  test('handles invalid JSON schema input', async ({ page }) => {
    const badSchema = 'not valid json {{{';
    const data = '{"id": 1, "name": "Alice"}';

    await page.goto('/tools/json-schema-validator');
    await page.waitForTimeout(300);

    await page.fill('#json-schema-validator-schema', badSchema);
    await page.fill('#json-schema-validator-data', data);

    await page.click('#btn-validate-schema');
    await page.waitForTimeout(500);

    // Should show error status
    const statusBanner = page.locator('#json-schema-validator-status-banner');
    await expect(statusBanner).toBeVisible();
    const statusText = await statusBanner.textContent();
    expect(statusText.toLowerCase()).toContain('invalid json');
  });

  test('handles invalid JSON data input', async ({ page }) => {
    const schema = JSON.stringify({
      type: 'object',
      properties: { id: { type: 'integer' } }
    });
    const badData = '{bad json';

    await page.goto('/tools/json-schema-validator');
    await page.waitForTimeout(300);

    await page.fill('#json-schema-validator-schema', schema);
    await page.fill('#json-schema-validator-data', badData);

    await page.click('#btn-validate-schema');
    await page.waitForTimeout(500);

    // Should show error status for invalid data
    const statusBanner = page.locator('#json-schema-validator-status-banner');
    await expect(statusBanner).toBeVisible();
    const statusText = await statusBanner.textContent();
    expect(statusText.toLowerCase()).toContain('invalid json');
  });

  // ── Empty Input Handling ──────────────────────────────────────
  test('shows warning for empty schema', async ({ page }) => {
    const data = '{"id": 1, "name": "Alice"}';

    await page.goto('/tools/json-schema-validator');
    await page.waitForTimeout(300);

    await page.fill('#json-schema-validator-data', data);

    await page.click('#btn-validate-schema');
    await page.waitForTimeout(500);

    const statusBanner = page.locator('#json-schema-validator-status-banner');
    await expect(statusBanner).toBeVisible();
    const statusText = await statusBanner.textContent();
    expect(statusText.toLowerCase()).toMatch(/schema|paste/i);
  });

  test('shows warning for empty data', async ({ page }) => {
    const schema = JSON.stringify({
      type: 'object',
      properties: { id: { type: 'integer' } }
    });

    await page.goto('/tools/json-schema-validator');
    await page.waitForTimeout(300);

    await page.fill('#json-schema-validator-schema', schema);

    await page.click('#btn-validate-schema');
    await page.waitForTimeout(500);

    const statusBanner = page.locator('#json-schema-validator-status-banner');
    await expect(statusBanner).toBeVisible();
    const statusText = await statusBanner.textContent();
    expect(statusText.toLowerCase()).toMatch(/data|paste/i);
  });

  // ── Quick Templates ───────────────────────────────────────────
  test('loads quick template into textareas', async ({ page }) => {
    await page.goto('/tools/json-schema-validator');
    await page.waitForTimeout(300);

    // Click user template button
    await page.click('[data-template="user"]');
    await page.waitForTimeout(300);

    // Check if schema and data fields are populated
    const schemaValue = await page.locator('#json-schema-validator-schema').inputValue();
    const dataValue = await page.locator('#json-schema-validator-data').inputValue();

    expect(schemaValue).toContain('type');
    expect(schemaValue).toContain('object');
    expect(dataValue).toContain('id');
    expect(dataValue).toContain('Alice');
  });

  // ── Copy Functionality ────────────────────────────────────────
  test('copies validation result', async ({ page }) => {
    const schema = JSON.stringify({
      type: 'object',
      properties: { id: { type: 'integer' } },
      required: ['id']
    });

    const data = JSON.stringify({ id: 1 });

    await page.goto('/tools/json-schema-validator');
    await page.waitForTimeout(300);

    await page.fill('#json-schema-validator-schema', schema);
    await page.fill('#json-schema-validator-data', data);

    await page.click('#btn-validate-schema');
    await page.waitForTimeout(500);

    // Copy button should be enabled after validation
    const copyBtn = page.locator('#btn-copy-validator');
    await expect(copyBtn).not.toBeDisabled();

    // Click copy — verify it doesn't throw (clipboard API may not work in headless)
    await page.click('#btn-copy-validator', { timeout: 3000 });
  });

  // ── Clear Functionality ───────────────────────────────────────
  test('clear resets all state', async ({ page }) => {
    const schema = JSON.stringify({ type: 'object' });
    const data = '{"id": 1}';

    await page.goto('/tools/json-schema-validator');
    await page.waitForTimeout(300);

    await page.fill('#json-schema-validator-schema', schema);
    await page.fill('#json-schema-validator-data', data);
    await page.click('#btn-validate-schema');
    await page.waitForTimeout(500);

    // Panels should show results
    expect(await page.locator('#json-schema-validator-status-banner').isVisible()).toBe(true);

    // Click clear
    await page.click('#btn-clear-validator');
    await page.waitForTimeout(300);

    // All panels should be reset
    const schemaVal = await page.locator('#json-schema-validator-schema').inputValue();
    const dataVal = await page.locator('#json-schema-validator-data').inputValue();
    expect(schemaVal).toBe('');
    expect(dataVal).toBe('');
    expect(await page.locator('#btn-copy-validator').isEnabled()).toBe(false);
  });

  // ── Console Errors Check ──────────────────────────────────────
  test('no JS errors on load', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    await page.goto('/tools/json-schema-validator');
    await page.waitForTimeout(500);

    expect(errors).toHaveLength(0);
  });

});
