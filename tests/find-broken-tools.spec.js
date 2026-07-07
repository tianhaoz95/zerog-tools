import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5002';

test.describe('Find Broken Tools', () => {
  test('Identify all broken tools', async ({ page }) => {
    // Read tool IDs from the actual tools.data.js file
    const fs = require('fs');
    const path = require('path');
    const toolsDataPath = path.join(__dirname, '..', 'src', 'tools.data.js');
    const toolsContent = fs.readFileSync(toolsDataPath, 'utf-8');

    // Extract all tool IDs using regex
    const idMatches = toolsContent.match(/id:\s*'([^']+)'/g) || [];
    const toolIds = idMatches.map(m => m.replace("id: '", '').replace("'", ''));

    console.log(`\n=== Testing ${toolIds.length} tools ===\n`);

    let passed = 0;
    let failed = 0;
    const failures = [];

    for (const toolId of toolIds) {
      await page.goto(`${BASE_URL}/tools/${toolId}`);
      // Wait for navigation to complete
      await page.waitForTimeout(200);

      // Check which view is active
      const views = page.locator('.view');
      const count = await views.count();
      let activeViewId = null;

      for (let i = 0; i < count; i++) {
        const view = views.nth(i);
        const isActive = await view.isVisible();
        if (isActive) {
          activeViewId = await view.getAttribute('id');
          break;
        }
      }

      // Also check for .active class as fallback
      if (!activeViewId) {
        const activeEl = await page.$('.view.active');
        if (activeEl) {
          activeViewId = await page.evaluate(el => el.id, activeEl);
        }
      }

      // Expected view ID follows the pattern ${toolId}-view
      const expectedViewId = `${toolId}-view`;

      if (activeViewId === expectedViewId || activeViewId === toolId) {
        passed++;
      } else {
        failed++;
        failures.push({ toolId, expected: expectedViewId, got: activeViewId });
        console.log(`✗ FAIL: ${toolId} -> got "${activeViewId}" (expected "${expectedViewId}")`);
      }
    }

    console.log(`\n=== RESULTS ===`);
    console.log(`✓ Passed: ${passed}/${toolIds.length}`);
    console.log(`✗ Failed: ${failed}/${toolIds.length}`);

    if (failures.length > 0) {
      console.log(`\n=== FAILURE DETAILS ===`);
      for (const f of failures) {
        console.log(`${f.toolId}: expected "${f.expected}", got "${f.got}"`);
      }
    }

    // Fail the test if there are any broken tools
    expect(failures).toHaveLength(0);
  });
});
