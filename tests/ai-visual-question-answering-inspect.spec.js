import { test, expect } from '@playwright/test';

test.describe('AI Visual Question Answering Tool - Inspect', () => {

  test('inspect tool card structure in grid', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Get all tool cards and their attributes
    const cardsInfo = await page.evaluate(() => {
      const cards = document.querySelectorAll('[class*="tool"], [class*="card"]');
      const result = [];
      
      for (let i = 0; i < Math.min(cards.length, 50); i++) { // Check first 50 cards
        const card = cards[i];
        if (card.textContent?.includes('Visual Question Answering')) {
          result.push({
            tag: card.tagName,
            className: card.className,
            id: card.id,
            dataAttrs: Object.fromEntries(Array.from(card.attributes || []).filter(a => a.name.startsWith('data-')).map(a => [a.name, a.value])),
            hasClickHandler: !!card.onclick || !!card.getAttribute('onclick'),
          });
        }
      }
      
      return result;
    });

    console.log('Tool cards with VQA text:', JSON.stringify(cardsInfo, null, 2));

    // Also check for any element that might be the navigation trigger
    const navElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('a, button');
      const result = [];
      
      for (let i = 0; i < Math.min(elements.length, 100); i++) { // Check first 100 elements
        const el = elements[i];
        if (el.textContent?.includes('Visual Question Answering') || 
            el.getAttribute('href')?.includes('ai-visual-question')) {
          result.push({
            tag: el.tagName,
            href: el.getAttribute('href'),
            id: el.id,
            className: el.className,
          });
        }
      }
      
      return result;
    });

    console.log('Navigation elements for VQA:', JSON.stringify(navElements, null, 2));

    // Just show us some sample cards to understand the structure
    const sampleCards = await page.evaluate(() => {
      const cards = document.querySelectorAll('[class*="tool"], [class*="card"]');
      const result = [];
      
      for (let i = 0; i < Math.min(cards.length, 10); i++) {
        result.push({
          tag: cards[i].tagName,
          className: cards[i].className?.substring(0, 50),
          textContent: cards[i].textContent?.substring(0, 30),
        });
      }
      
      return result;
    });

    console.log('Sample cards structure:', JSON.stringify(sampleCards, null, 2));
  });

});
