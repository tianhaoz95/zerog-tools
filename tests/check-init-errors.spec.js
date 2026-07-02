import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5002';

test.describe('Check for JavaScript Errors During Tool Init', () => {
  const toolsToTest = [
    'sleep-cycle-calc',
    'luhn-validator',
    'json-formatter',
    'qr-tool',
    'password-gen',
    'image-resizer',
    'pdf-tool',
    'regex-tester',
    'color-picker',
    'uuid-generator',
  ];

  for (const toolId of toolsToTest) {
    test(`Check ${toolId} for init errors`, async ({ page }) => {
      const errors = [];
      const warnings = [];

      // Capture all console messages
      page.on('console', msg => {
        const text = msg.text();
        if (text.includes('Error') || text.includes('error')) {
          errors.push(text);
        }
        if (msg.type() === 'warning') {
          warnings.push(text);
        }
      });

      // Capture page errors
      page.on('pageerror', err => {
        errors.push(`PAGE: ${err.message}`);
      });

      await page.goto(`${BASE_URL}/tools/${toolId}`);
      await page.waitForTimeout(1000);

      console.log(`\n=== ${toolId} ===`);

      if (errors.length > 0) {
        console.log(`Errors (${errors.length}):`);
        errors.forEach(e => console.log(`  - ${e}`));
      } else {
        console.log('No errors ✓');
      }

      if (warnings.length > 0) {
        console.log(`Warnings (${warnings.length}):`);
        warnings.forEach(w => console.log(`  - ${w}`));
      }

      // Should have no errors
      expect(errors).toHaveLength(0);
    });
  }
});
