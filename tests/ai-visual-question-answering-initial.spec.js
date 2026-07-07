import { test, expect } from '@playwright/test';

test.describe('AI Visual Question Answering Tool - Initial Load', () => {

  // This simulates what happens when user directly navigates to a tool URL
  test('handles direct navigation to tool URL', async ({ page }) => {
    // Start fresh - no previous state
    await page.goto('/');
    await page.waitForTimeout(500);
    
    const homeActive = await page.evaluate(() => {
      return document.getElementById('home-view')?.classList.contains('active');
    });
    expect(homeActive).toBe(true);

    // Now navigate to our tool URL - this should trigger the same flow as direct load
    await page.goto('/tools/ai-visual-question-answering');
    
    // Wait for DOMContentLoaded and initial navigation
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const vqaActive = await page.evaluate(() => {
      return document.getElementById('ai-visual-question-answering-view')?.classList.contains('active');
    });
    
    console.log('VQA view active after goto:', vqaActive);
    
    expect(vqaActive).toBe(true);
  });

});
