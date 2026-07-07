import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';

const BASE_URL = 'http://localhost:5002';

// Read all tool IDs from tools.data.js (hardcoded path for ES modules)
const toolsDataPath = '/Users/tianhaozhou/experimental/toolbox/src/tools.data.js';
const toolsContent = readFileSync(toolsDataPath, 'utf-8');
const idMatches = toolsContent.match(/id:\s*'([^']+)'/g) || [];
const allToolIds = idMatches.map(m => m.replace("id: '", '').replace("'", ''));

test.describe('Comprehensive Tool Rendering Test', () => {

  test('Test all tools render correctly', async ({ page }) => {
    console.log(`\n=== Testing ${allToolIds.length} tools ===\n`);

    let passed = 0;
    let failed = 0;
    const failures = [];

    for (let i = 0; i < allToolIds.length; i++) {
      const toolId = allToolIds[i];
      const expectedViewId = `${toolId}-view`;

      try {
        // Navigate to the tool URL
        await page.goto(`${BASE_URL}/tools/${toolId}`);

        // Wait for navigation and any initialization
        await page.waitForTimeout(500);

        // Check 1: Is a view active?
        const activeEl = await page.$('.view.active');
        if (!activeEl) {
          failed++;
          failures.push({ toolId, error: 'No view is active' });
          console.log(`✗ [${i+1}/${allToolIds.length}] ${toolId}: No view active`);
          continue;
        }

        const activeViewId = await page.evaluate(el => el.id, activeEl);

        // Check 2: Is it the correct view?
        if (activeViewId !== expectedViewId && activeViewId !== toolId) {
          failed++;
          failures.push({ toolId, error: `Wrong view active: ${activeViewId}`, expected: expectedViewId });
          console.log(`✗ [${i+1}/${allToolIds.length}] ${toolId}: Wrong view (${activeViewId})`);
          continue;
        }

        // Check 3: Does the view have visible content?
        const viewContent = await page.evaluate(el => {
          // Get all visible text content from the view
          const walker = document.createTreeWalker(el, NodeFilter.SHOW_ELEMENT, {
            acceptNode: node => node.offsetParent !== null ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
          });

          let text = '';
          let node;
          while (node = walker.nextNode()) {
            if (node.children.length === 0) { // Leaf element
              text += node.textContent || '';
            }
          }
          return text.trim().length > 0;
        }, activeEl);

        if (!viewContent) {
          failed++;
          failures.push({ toolId, error: 'View has no visible content' });
          console.log(`✗ [${i+1}/${allToolIds.length}] ${toolId}: No visible content`);
          continue;
        }

        // All checks passed
        passed++;
        process.stdout.write(`✓ [${i+1}/${allToolIds.length}] ${toolId}\r`);
      } catch (err) {
        failed++;
        failures.push({ toolId, error: err.message });
        console.log(`✗ [${i+1}/${allToolIds.length}] ${toolId}: Error - ${err.message}`);
      }
    }

    console.log(`\n\n=== FINAL RESULTS ===`);
    console.log(`✓ Passed: ${passed}/${allToolIds.length} (${Math.round(passed/allToolIds.length*100)}%)`);
    console.log(`✗ Failed: ${failed}/${allToolIds.length}`);

    if (failures.length > 0) {
      console.log(`\n=== FAILURE DETAILS ===`);
      for (const f of failures) {
        console.log(`${f.toolId}: ${f.error}${f.expected ? ` (expected: ${f.expected})` : ''}`);
      }

      // Group failures by error type
      const errorsByType = {};
      for (const f of failures) {
        const key = f.error;
        if (!errorsByType[key]) errorsByType[key] = [];
        errorsByType[key].push(f.toolId);
      }

      console.log(`\n=== FAILURES BY TYPE ===`);
      for (const [error, tools] of Object.entries(errorsByType)) {
        console.log(`\n${error}:`);
        console.log(`  Tools: ${tools.join(', ')}`);
      }
    }

    // Fail the test if there are any failures
    expect(failures).toHaveLength(0);
  });
});
