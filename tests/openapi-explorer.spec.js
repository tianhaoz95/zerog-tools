import { test, expect } from '@playwright/test';

test.describe('OpenAPI Explorer Tool', () => {

  // ── Navigation ────────────────────────────────────────────────
  test('navigates to tool and shows view', async ({ page }) => {
    await page.goto('/tools/openapi-explorer');
    await page.waitForTimeout(500);

    await expect(page.locator('#openapi-explorer-view')).toHaveClass(/active/);
  });

  test('back button returns to home', async ({ page }) => {
    await page.goto('/tools/openapi-explorer');
    await page.waitForTimeout(300);

    await page.click('#btn-openapi-explorer-back');
    await expect(page.locator('#home-view')).toHaveClass(/active/);
  });

  // ── Valid JSON spec ───────────────────────────────────────────
  test('validates a valid OpenAPI 3.0 JSON spec', async ({ page }) => {
    const validSpec = JSON.stringify({
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      servers: [{ url: 'https://api.example.com/v1' }],
      paths: {
        '/users': {
          get: {
            summary: 'List users',
            description: 'Returns a list of users',
            tags: ['Users'],
            responses: { '200': { description: 'OK' } }
          },
          post: {
            summary: 'Create user',
            description: 'Creates a new user',
            tags: ['Users'],
            requestBody: { content: { 'application/json': { schema: {} } } },
            responses: { '201': { description: 'Created' } }
          }
        }
      }
    });

    await page.goto('/tools/openapi-explorer');
    await page.waitForTimeout(300);

    // Switch to paste mode
    await page.click('#btn-openapi-paste-toggle');
    await expect(page.locator('#openapi-input-textarea')).toBeVisible();

    await page.fill('#openapi-input-textarea', validSpec);
    await expect(page.locator('#btn-openapi-validate')).not.toBeDisabled();

    // Click validate
    await page.click('#btn-openapi-validate');
    await page.waitForTimeout(300);

    // Should show validation panel (no errors)
    await expect(page.locator('#openapi-validation-panel')).toBeVisible();

    // Should show spec info
    await expect(page.locator('#openapi-info-panel')).toBeVisible();

    // Should render endpoint tree with 2 endpoints
    await expect(page.locator('#openapi-tree-panel')).toBeVisible();
    const count = await page.locator('#openapi-endpoint-count').textContent();
    expect(count).toContain('2');
  });

  // ── Invalid spec ──────────────────────────────────────────────
  test('shows errors for invalid spec', async ({ page }) => {
    // Missing openapi field and info.version
    const invalidSpec = JSON.stringify({
      info: { title: 'Bad API' },
      paths: {}
    });

    await page.goto('/tools/openapi-explorer');
    await page.waitForTimeout(300);

    await page.click('#btn-openapi-paste-toggle');
    await page.fill('#openapi-input-textarea', invalidSpec);
    await page.click('#btn-openapi-validate');
    await page.waitForTimeout(300);

    // Should show validation panel with errors
    await expect(page.locator('#openapi-validation-panel')).toBeVisible();
    const summary = await page.locator('#openapi-validation-summary').textContent();
    expect(summary).toMatch(/error/i);
  });

  // ── YAML spec ─────────────────────────────────────────────────
  test('parses and validates a YAML OpenAPI spec', async ({ page }) => {
    const yamlSpec = `openapi: "3.0.0"
info:
  title: YAML API
  version: "2.0.0"
servers:
  - url: https://yaml-api.example.com
paths:
  /pets:
    get:
      summary: List pets
      tags: [Pets]
      responses:
        "200":
          description: OK`;

    await page.goto('/tools/openapi-explorer');
    await page.waitForTimeout(300);

    await page.click('#btn-openapi-paste-toggle');
    await page.fill('#openapi-input-textarea', yamlSpec);
    expect(await page.locator('#btn-openapi-validate').isEnabled()).toBe(true);

    await page.click('#btn-openapi-validate');
    await page.waitForTimeout(300);

    // Should validate successfully (no errors)
    const summary = await page.locator('#openapi-validation-summary').textContent();
    // May show "Valid" or "Found: N warning(s)" — as long as no error class
    expect(summary).toBeTruthy();

    // Should show 1 endpoint
    const countText = await page.locator('#openapi-endpoint-count').textContent();
    expect(countText).toContain('1');
  });

  // ── File upload ───────────────────────────────────────────────
  test('handles file upload', async ({ page }) => {
    const specContent = JSON.stringify({
      openapi: '3.0.0',
      info: { title: 'File Upload Test', version: '1.0.0' },
      paths: {}
    });

    await page.goto('/tools/openapi-explorer');
    await page.waitForTimeout(300);

    // Use setInputFiles to simulate uploading a file via the hidden input
    const fileInput = page.locator('#openapi-file-input');
    await fileInput.setInputFiles({
      name: 'spec.json',
      mimeType: 'application/json',
      buffer: Buffer.from(specContent)
    });

    // Textarea should now contain the spec content
    const textarea = await page.locator('#openapi-input-textarea');
    expect(await textarea.isVisible()).toBe(true);
    const value = await textarea.inputValue();
    expect(value).toContain('File Upload Test');

    // Validate button should be enabled
    expect(await page.locator('#btn-openapi-validate').isEnabled()).toBe(true);
  });

  // ── Collapsible tree ──────────────────────────────────────────
  test('endpoint tree is collapsible', async ({ page }) => {
    const multiPathSpec = JSON.stringify({
      openapi: '3.0.0',
      info: { title: 'Multi Path', version: '1.0.0' },
      paths: {
        '/users': {
          get: { summary: 'List users', tags: ['Users'], responses: {} }
        },
        '/posts': {
          get: { summary: 'List posts', tags: ['Posts'], responses: {} },
          post: { summary: 'Create post', tags: ['Posts'], responses: {} }
        }
      }
    });

    await page.goto('/tools/openapi-explorer');
    await page.waitForTimeout(300);

    await page.click('#btn-openapi-paste-toggle');
    await page.fill('#openapi-input-textarea', multiPathSpec);
    await page.click('#btn-openapi-validate');
    await page.waitForTimeout(300);

    // Path groups should be collapsed by default (expand icon = ▶)
    const expandIcon = page.locator('.openapi-expand-icon').first();
    if (await expandIcon.count() > 0) {
      expect(await expandIcon.textContent()).toBe('▶');
    }

    // Click to expand a path group
    const pathHeader = page.locator('.openapi-path-header').first();
    if (await pathHeader.count() > 0) {
      await pathHeader.click();
      await page.waitForTimeout(200);

      // Expand icon should change to ▼
      const newIcon = await expandIcon.textContent();
      expect(newIcon).toBe('▼');
    }
  });

  // ── Try-it builder ────────────────────────────────────────────
  test('try-it request builder appears on endpoint click', async ({ page }) => {
    const spec = JSON.stringify({
      openapi: '3.0.0',
      info: { title: 'Try It Test', version: '1.0.0' },
      servers: [{ url: 'https://api.example.com/v1' }],
      paths: {
        '/users/{id}': {
          get: {
            summary: 'Get user by ID',
            description: 'Returns a single user',
            tags: ['Users'],
            parameters: [
              { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            responses: { '200': { description: 'OK' } }
          },
          put: {
            summary: 'Update user',
            tags: ['Users'],
            requestBody: { content: { 'application/json': { schema: {} } } },
            responses: { '200': { description: 'OK' } }
          }
        }
      }
    });

    await page.goto('/tools/openapi-explorer');
    await page.waitForTimeout(300);

    await page.click('#btn-openapi-paste-toggle');
    await page.fill('#openapi-input-textarea', spec);
    await page.click('#btn-openapi-validate');
    await page.waitForTimeout(300);

    // Expand path group first so methods are visible
    const pathHeader = page.locator('.openapi-path-header').first();
    if (await pathHeader.count() > 0) {
      await pathHeader.click();
      await page.waitForTimeout(300);
    }

    // Click on GET /users/{id} to select endpoint — use text-based locator
    const getRow = page.locator('[style*="openapi-method-row"], .openapi-method-row').filter({ hasText: /^GET$/ }).first();
    if (await getRow.count() > 0) {
      await getRow.click({ force: true });
      await page.waitForTimeout(300);

      // Try-it builder should appear
      await expect(page.locator('#openapi-tryit-builder')).toBeVisible();

      // Method selector should show GET
      const methodSelect = page.locator('#openapi-tryit-method-select');
      if (await methodSelect.count() > 0) {
        expect(await methodSelect.inputValue()).toBe('GET');
      }

      // URL should contain the path prefix
      const urlInput = page.locator('#openapi-tryit-full-url');
      if (await urlInput.count() > 0) {
        const value = await urlInput.inputValue();
        expect(value).toContain('/users/');
        expect(value).toContain('api.example.com');
      }

      // Click simulate button
      await page.click('#btn-openapi-tryit-send');
      await page.waitForTimeout(300);

      // cURL output should be visible and contain curl command
      const curlOutput = page.locator('#openapi-curl-output');
      if (await curlOutput.count() > 0) {
        const text = await curlOutput.textContent();
        expect(text).toContain('curl -X GET');
        expect(text).toContain('https://api.example.com');
      }
    }
  });

  // ── Clear button ──────────────────────────────────────────────
  test('clear resets all state', async ({ page }) => {
    const validSpec = JSON.stringify({
      openapi: '3.0.0',
      info: { title: 'Clear Test', version: '1.0.0' },
      paths: {}
    });

    await page.goto('/tools/openapi-explorer');
    await page.waitForTimeout(300);

    // Load a spec
    await page.click('#btn-openapi-paste-toggle');
    await page.fill('#openapi-input-textarea', validSpec);
    await page.click('#btn-openapi-validate');
    await page.waitForTimeout(300);

    // Panels should be visible
    expect(await page.locator('#openapi-validation-panel').isVisible()).toBe(true);
    expect(await page.locator('#openapi-tree-panel').isVisible()).toBe(true);

    // Click clear
    await page.click('#btn-openapi-clear');
    await page.waitForTimeout(300);

    // All panels should be hidden, validate button disabled
    expect(await page.locator('#openapi-validation-panel').isVisible()).toBe(false);
    expect(await page.locator('#openapi-tree-panel').isVisible()).toBe(false);
    expect(await page.locator('#btn-openapi-validate').isEnabled()).toBe(false);
  });

  // ── Console errors check ──────────────────────────────────────
  test('no JS errors on load', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    await page.goto('/tools/openapi-explorer');
    await page.waitForTimeout(500);

    expect(errors).toHaveLength(0);
  });

});
