import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5002';

test.describe('Check Tool Content Rendering', () => {
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
    test(`Verify ${toolId} has visible content`, async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/${toolId}`);
      await page.waitForTimeout(500);

      // Get the active view
      const activeEl = await page.$('.view.active');
      expect(activeEl).not.toBeNull();

      // Check if view has visible text content
      const hasContent = await page.evaluate(el => {
        // Get all visible text from the view
        const texts = el.innerText || '';
        return texts.trim().length > 0;
      }, activeEl);

      console.log(`${toolId}: ${hasContent ? 'Has content ✓' : 'NO CONTENT ✗'}`);

      expect(hasContent).toBe(true);
    });
  }
});
