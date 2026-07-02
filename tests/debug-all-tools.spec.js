import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5002';

test.describe('Comprehensive Tool Navigation Test', () => {
  test('Test all unmapped tools for navigation', async ({ page }) => {
    // Read tool IDs from the actual tools.data.js file
    const fs = require('fs');
    const path = require('path');
    const toolsDataPath = path.join(__dirname, '..', 'src', 'tools.data.js');
    const toolsContent = fs.readFileSync(toolsDataPath, 'utf-8');

    // Extract all tool IDs using regex
    const idMatches = toolsContent.match(/id:\s*'([^']+)'/g) || [];
    const toolIds = idMatches.map(m => m.replace("id: '", '').replace("'", ''));

    console.log(`\nTesting ${toolIds.length} total tools...\n`);

    let passed = 0;
    let failed = 0;
    const failures = [];

    for (const toolId of toolIds) {
      await page.goto(`${BASE_URL}/tools/${toolId}`);
      await page.waitForTimeout(300); // Small delay to ensure navigation completes

      const activeView = await page.locator('.view.active').first();
      const activeViewId = await activeView.getAttribute('id');

      if (activeViewId === `${toolId}-view`) {
        passed++;
      } else {
        failed++;
        failures.push({ toolId, expected: `${toolId}-view`, got: activeViewId });
        console.log(`✗ FAIL: ${toolId} -> got ${activeViewId}`);
      }
    }

    console.log(`\n=== RESULTS ===`);
    console.log(`Passed: ${passed}/${toolIds.length}`);
    console.log(`Failed: ${failed}/${toolIds.length}`);

    if (failures.length > 0) {
      console.log('\n=== FAILURES ===');
      for (const f of failures) {
        console.log(`${f.toolId}: expected ${f.expected}, got ${f.got}`);
      }
    }

    // This will cause the test to fail if there are any failures
    expect(failures).toHaveLength(0);
  });
});
