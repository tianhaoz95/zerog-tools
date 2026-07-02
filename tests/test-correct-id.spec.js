import { test } from '@playwright/test';

const BASE_URL = 'http://localhost:5002';

test('Test timezone-converter with correct ID', async ({ page }) => {
  const errors = [];
  page.on('console', msg => {
    if (msg.text().includes('Error') || msg.text().includes('error')) {
      errors.push(msg.text());
    }
  });

  await page.goto(`${BASE_URL}/tools/timezone-converter`);
  await page.waitForTimeout(1000);

  console.log('\n=== timezone-converter (correct ID) ===');
  if (errors.length > 0) {
    console.log(`Errors (${errors.length}):`);
    errors.forEach(e => console.log(`  - ${e}`));
  }

  const activeEl = await page.$('.view.active');
  const activeViewId = activeEl ? await page.evaluate(el => el.id, activeEl) : 'none';
  console.log(`Active view: ${activeViewId}`);
  
  if (activeViewId === 'timezone-converter-view') {
    console.log('✓ PASS: View activated correctly');
  } else {
    console.log(`✗ FAIL: Expected timezone-converter-view, got ${activeViewId}`);
  }
});
