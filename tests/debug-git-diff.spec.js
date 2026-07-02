import { test, expect } from '@playwright/test';

test('debug git diff viewer', async ({ page }) => {
  const logs = [];
  page.on('console', msg => logs.push({ type: msg.type(), text: msg.text() }));

  // Navigate directly to the tool URL
  await page.goto('http://localhost:5002/tools/git-diff-viewer');
  await page.waitForTimeout(1000);

  // Check for console errors
  const errorLogs = logs.filter(l => l.type === 'error');
  if (errorLogs.length > 0) {
    console.log('ERRORS FOUND:');
    errorLogs.forEach(e => console.log(`  ${e.text.substring(0, 200)}`));
  }

  // Check current URL
  const url = page.url();
  console.log('Current URL:', url);

  // Check view class
  const viewClass = await page.locator('#git-diff-viewer-view').getAttribute('class');
  console.log('View class:', viewClass);

  // Try to manually trigger navigation by evaluating JavaScript
  const navResult = await page.evaluate(() => {
    // Check if navigateTo function exists
    if (typeof navigateTo === 'function') {
      try {
        navigateTo('git-diff-viewer');
        return 'navigateTo called successfully';
      } catch (e) {
        return `Error: ${e.message}`;
      }
    }
    return 'navigateTo not found';
  });
  console.log('Navigation result:', navResult);

  await page.waitForTimeout(500);

  // Check view class again after navigation
  const newViewClass = await page.locator('#git-diff-viewer-view').getAttribute('class');
  console.log('New view class:', newViewClass);

  await expect(page.locator('#git-diff-viewer-view')).toHaveClass(/active/);

  const sampleDiff = `diff --git a/test.js b/test.js
index 1234567..abcdefg 100644
--- a/test.js
+++ b/test.js
@@ -1,5 +1,6 @@
 function hello() {
+  console.log('world');
   return true;
 }`;

  await page.fill('#git-diff-input', sampleDiff);

  console.log('Input filled, length:', sampleDiff.length);

  // Check if the git-diff-viewer view exists and is active
  const gitViewClass = await page.locator('#git-diff-viewer-view').getAttribute('class');
  console.log('Git diff viewer view class:', gitViewClass);

  // Try to click the process button directly by ID
  try {
    const processBtn = page.locator('#btn-process-git-diff');
    const btnExists = await processBtn.count();
    console.log('Process button exists:', btnExists > 0);

    if (btnExists > 0) {
      await processBtn.click();
      console.log('Clicked process button');
    } else {
      console.log('Process button NOT found, listing all page buttons...');
      const allButtons = await page.locator('button').all();
      for (let i = 0; i < Math.min(allButtons.length, 30); i++) {
        const btn = allButtons[i];
        const id = await btn.getAttribute('id');
        if (id && id.includes('git-diff')) {
          console.log(`  Global Button ${i}: id="${id}"`);
        }
      }
    }
  } catch (err) {
    console.log('Error clicking process button:', err.message);
  }

  // Wait a bit for processing
  await page.waitForTimeout(1000);

  // Check what's in the output
  const unifiedContent = await page.locator('#git-diff-unified-content').innerHTML();
  console.log('Unified content length:', unifiedContent.length);
  if (unifiedContent.length > 0) {
    console.log('Unified content preview:', unifiedContent.substring(0, 200));
  }

  // Check stats
  const fileCount = await page.locator('#git-diff-file-count').textContent();
  console.log('File count:', fileCount);

  const addCount = await page.locator('#git-diff-add-count').textContent();
  console.log('Add count:', addCount);

  // Check status banner
  const statusBanner = await page.evaluate(() => {
    const banner = document.getElementById('git-diff-status-banner');
    return {
      display: window.getComputedStyle(banner).display,
      text: banner.textContent.trim()
    };
  });
  console.log('Status banner:', statusBanner);

  // Check error display
  const errDisplay = await page.evaluate(() => {
    const err = document.getElementById('git-diff-error-display');
    return {
      display: window.getComputedStyle(err).display,
      text: err.textContent.trim() || '(empty)'
    };
  });
  console.log('Error display:', errDisplay);

  // Check for errors in logs
  const errors = logs.filter(l => l.type === 'error');
  if (errors.length > 0) {
    console.log('ERRORS:');
    errors.forEach(e => console.log(`  ${e.text.substring(0, 200)}`));
  }
});
