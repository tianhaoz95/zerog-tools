import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5002';

test.describe('Tool Navigation Debug Tests', () => {
  // Test a sample of unmapped tools to see if they work via fallback
  const unmappedToolsToTest = [
    'luhn-validator',
    'binary-translator',
    'color-palette-gen',
    'time-zone-converter',
    'date-calculator',
    'compound-interest',
    'tdee-calculator',
    'sort-list',
    'json-yaml-converter',
    'device-info',
  ];

  for (const toolId of unmappedToolsToTest) {
    test(`Tool navigation: ${toolId}`, async ({ page }) => {
      // Navigate directly to the tool URL
      await page.goto(`${BASE_URL}/tools/${toolId}`);

      // Wait a bit for any JS to execute
      await page.waitForTimeout(500);

      // Check which view is active
      const activeView = await page.locator('.view.active').first();
      const activeViewId = await activeView.getAttribute('id');

      console.log(`Tool ${toolId}: active view id = ${activeViewId}`);

      // The expected view ID follows the pattern ${toolId}-view
      const expectedViewId = `${toolId}-view`;

      if (activeViewId === expectedViewId) {
        console.log(`  ✓ PASS: View activated correctly`);
      } else if (activeViewId === 'home-view') {
        console.log(`  ✗ FAIL: Still showing home view (navigation failed)`);
      } else {
        console.log(`  ✗ FAIL: Wrong view active: ${activeViewId}`);
      }

      // Take a screenshot to see what's shown
      await page.screenshot({ path: `/tmp/tool-${toolId}.png` });
    });
  }
});
