import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5002';

test.describe('Check Console Errors During Navigation', () => {
  const toolsToTest = [
    'sleep-cycle-calc',
    'luhn-validator',
    'binary-translator',
    'color-palette-gen',
    'time-zone-converter',
  ];

  for (const toolId of toolsToTest) {
    test(`Check errors when navigating to ${toolId}`, async ({ page }) => {
      const errors = [];
      const warnings = [];

      page.on('console', msg => {
        const text = msg.text();
        if (text.includes('Error') || text.includes('error')) {
          errors.push(text);
        }
        if (text.includes('Warning') || text.includes('warning')) {
          warnings.push(text);
        }
      });

      await page.goto(`${BASE_URL}/tools/${toolId}`);
      await page.waitForTimeout(1000);

      console.log(`\n=== ${toolId} ===`);
      if (errors.length > 0) {
        console.log(`Errors (${errors.length}):`);
        errors.forEach(e => console.log(`  - ${e}`));
      }
      if (warnings.length > 0) {
        console.log(`Warnings (${warnings.length}):`);
        warnings.forEach(w => console.log(`  - ${w}`));
      }

      // Check which view is active
      const activeEl = await page.$('.view.active');
      const activeViewId = activeEl ? await page.evaluate(el => el.id, activeEl) : 'none';
      console.log(`Active view: ${activeViewId}`);

      expect(errors).toHaveLength(0);
    });
  }
});
