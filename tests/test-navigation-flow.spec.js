import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5002';

test.describe('Test Navigation Flow Between Tools', () => {
  const toolsToTest = [
    'sleep-cycle-calc',
    'luhn-validator',
    'json-formatter',
    'qr-tool',
    'password-gen',
  ];

  test('Navigate between multiple tools without issues', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => {
      errors.push(err.message);
    });

    // Start at home
    await page.goto(BASE_URL);
    await page.waitForTimeout(500);

    let activeViewId = 'home-view';
    console.log('\n=== Navigation Test ===');
    console.log(`Start: ${activeViewId}`);

    // Navigate to each tool in sequence
    for (const toolId of toolsToTest) {
      await page.click(`.tool-card[data-id="${toolId}"]`);
      await page.waitForTimeout(500);

      const el = await page.$('.view.active');
      activeViewId = el ? await page.evaluate(e => e.id, el) : 'none';

      console.log(`→ ${toolId}: active=${activeViewId}`);

      // Check if the correct view is active
      const expectedView = `${toolId}-view`;
      expect(activeViewId).toBe(expectedView);
    }

    // Navigate back to home
    await page.click('#btn-header-logo');
    await page.waitForTimeout(500);

    const homeEl = await page.$('.view.active');
    const homeViewId = homeEl ? await page.evaluate(e => e.id, homeEl) : 'none';
    console.log(`← Home: active=${homeViewId}`);
    expect(homeViewId).toBe('home-view');

    // Check for errors
    if (errors.length > 0) {
      console.log('\n⚠ Console errors during navigation:');
      errors.forEach(e => console.log(`  - ${e}`));
    }

    expect(errors).toHaveLength(0);
  });
});
