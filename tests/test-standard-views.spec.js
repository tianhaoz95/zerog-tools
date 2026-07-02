import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5002';

test.describe('Test Standard View Naming', () => {
  const toolsToTest = [
    'sleep-cycle-calc',
    'luhn-validator',
    'binary-translator',
    'color-palette-gen',
    'date-calculator',
    'compound-interest',
    'tdee-calculator',
    'sort-list',
    'json-yaml-converter',
    'device-info',
  ];

  for (const toolId of toolsToTest) {
    test(`Verify ${toolId} uses ${toolId}-view`, async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/${toolId}`);
      await page.waitForTimeout(300);

      const activeEl = await page.$('.view.active');
      expect(activeEl).not.toBeNull();

      const activeViewId = await page.evaluate(el => el.id, activeEl);
      const expectedViewId = `${toolId}-view`;

      console.log(`${toolId}: ${activeViewId} ${activeViewId === expectedViewId ? '✓' : '✗'}`);
      expect(activeViewId).toBe(expectedViewId);
    });
  }
});
