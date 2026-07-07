import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5002';

// Tools that use non-standard view naming (toolId -> actualViewId)
const NON_STANDARD_VIEWS = {
  'passport-photo': 'passport-view',
  'image-vectorizer': 'vectorizer-view',
  'audio-transcriber': 'transcriber-view',
  'file-encrypter': 'encrypter-view',
  'ocr-scanner': 'ocr-view',
  'password-gen': 'password-view',
  'json-formatter': 'json-view',
  'qr-tool': 'qr-view',
  'base64-tool': 'base64-view',
  'markdown-tool': 'markdown-view',
  'url-tool': 'url-view',
  'csv-json-tool': 'csv-json-view',
  'pdf-tool': 'pdf-view',
  'regex-tester': 'regex-view',
  'diff-checker': 'diff-view',
  'hash-generator': 'hash-view',
  'svg-editor': 'svg-editor-view',
  'unit-converter': 'unit-view',
  'color-picker': 'color-view',
  'epoch-converter': 'epoch-view',
  'jwt-decoder': 'jwt-view',
  'uuid-generator': 'uuid-view',
  'lorem-generator': 'lorem-view',
  'sql-formatter': 'sql-view',
  'cron-descriptor': 'cron-view',
  'html-encoder': 'html-ent-view',
  'ascii-generator': 'ascii-view',
  'ua-parser': 'ua-view',
  'text-analyzer': 'text-an-view',
};

test.describe('Verify Tool View Activation', () => {
  test('Check tools with non-standard view names', async ({ page }) => {
    console.log('\n=== Testing Non-Standard View Names ===\n');

    let passed = 0;
    let failed = 0;
    const failures = [];

    for (const [toolId, expectedViewId] of Object.entries(NON_STANDARD_VIEWS)) {
      try {
        await page.goto(`${BASE_URL}/tools/${toolId}`);
        await page.waitForTimeout(300);

        const activeEl = await page.$('.view.active');
        if (!activeEl) {
          failed++;
          failures.push({ toolId, error: 'No view active' });
          console.log(`✗ ${toolId}: No view active`);
          continue;
        }

        const activeViewId = await page.evaluate(el => el.id, activeEl);

        if (activeViewId === expectedViewId) {
          passed++;
          console.log(`✓ ${toolId} → ${expectedViewId}`);
        } else {
          failed++;
          failures.push({ toolId, error: `Wrong view`, got: activeViewId, expected: expectedViewId });
          console.log(`✗ ${toolId}: Got ${activeViewId}, expected ${expectedViewId}`);
        }
      } catch (err) {
        failed++;
        failures.push({ toolId, error: err.message });
        console.log(`✗ ${toolId}: Error - ${err.message}`);
      }
    }

    console.log(`\n=== RESULTS ===`);
    console.log(`✓ Passed: ${passed}/${Object.keys(NON_STANDARD_VIEWS).length}`);
    console.log(`✗ Failed: ${failed}/${Object.keys(NON_STANDARD_VIEWS).length}`);

    if (failures.length > 0) {
      console.log('\n=== FAILURES ===');
      for (const f of failures) {
        console.log(`${f.toolId}: ${f.error}${f.got ? ` (got: ${f.got}, expected: ${f.expected})` : ''}`);
      }
    }

    expect(failures).toHaveLength(0);
  });
});
