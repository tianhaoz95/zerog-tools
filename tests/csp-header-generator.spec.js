import { test, expect } from '@playwright/test';

test.describe('CSP Header Generator & Analyzer Tool', () => {

  // ── Navigation ────────────────────────────────────────────────
  test('navigates to tool and shows view', async ({ page }) => {
    await page.goto('/tools/csp-header-generator');
    await page.waitForTimeout(500);

    await expect(page.locator('#csp-view')).toHaveClass(/active/);
  });

  test('back button returns to home', async ({ page }) => {
    await page.goto('/tools/csp-header-generator');
    await page.waitForTimeout(300);

    await page.click('#btn-csp-back');
    await expect(page.locator('#home-view')).toHaveClass(/active/);
  });

  // ── Builder Mode ──────────────────────────────────────────────
  test('shows builder mode by default', async ({ page }) => {
    await page.goto('/tools/csp-header-generator');
    await page.waitForTimeout(300);

    const builderPanel = page.locator('#csp-builder-panel');
    await expect(builderPanel).toBeVisible();

    const analyzerPanel = page.locator('#csp-analyzer-panel');
    await expect(analyzerPanel).not.toBeVisible();
  });

  test('renders directive inputs', async ({ page }) => {
    await page.goto('/tools/csp-header-generator');
    await page.waitForTimeout(300);

    const directiveInputs = page.locator('.csp-directive-input');
    await expect(directiveInputs.first()).toBeVisible();
  });

  test('generates CSP header from inputs', async ({ page }) => {
    await page.goto('/tools/csp-header-generator');
    await page.waitForTimeout(300);

    // Fill in some directives
    await page.fill('.csp-directive-input[data-key="default-src"]', "'self'");
    await page.fill('.csp-directive-input[data-key="script-src"]', "'self' https://cdn.example.com");
    await page.fill('.csp-directive-input[data-key="style-src"]', "'self'");

    // Click generate
    await page.click('#btn-csp-generate');
    await page.waitForTimeout(200);

    // Check preview output
    const preview = page.locator('#csp-preview-output');
    await expect(preview).toBeVisible();
    const text = await preview.textContent();
    expect(text).toContain("default-src 'self'");
    expect(text).toContain("script-src 'self' https://cdn.example.com");
  });

  test('copy button copies CSP to clipboard', async ({ page }) => {
    await page.goto('/tools/csp-header-generator');
    await page.waitForTimeout(300);

    // Fill in a directive
    await page.fill('.csp-directive-input[data-key="default-src"]', "'self'");
    await page.click('#btn-csp-generate');
    await page.waitForTimeout(200);

    // Enable copy button and click it
    const btnCopy = page.locator('#btn-csp-copy');
    await expect(btnCopy).not.toBeDisabled();

    // Mock clipboard write
    await page.evaluate(() => {
      navigator.clipboard.writeText = async () => {};
    });

    await page.click('#btn-csp-copy');
    await page.waitForTimeout(200);

    // Check button text changed temporarily
    const buttonText = await btnCopy.textContent();
    expect(buttonText).toContain('Copied');
  });

  // ── Analyzer Mode ─────────────────────────────────────────────
  test('switches to analyzer mode', async ({ page }) => {
    await page.goto('/tools/csp-header-generator');
    await page.waitForTimeout(300);

    // Click analyzer tab
    await page.click('.csp-mode-tab[data-mode="analyzer"]');
    await page.waitForTimeout(200);

    const builderPanel = page.locator('#csp-builder-panel');
    await expect(builderPanel).not.toBeVisible();

    const analyzerPanel = page.locator('#csp-analyzer-panel');
    await expect(analyzerPanel).toBeVisible();
  });

  test('analyzes CSP and flags unsafe-inline', async ({ page }) => {
    await page.goto('/tools/csp-header-generator');
    await page.waitForTimeout(300);

    // Switch to analyzer mode
    await page.click('.csp-mode-tab[data-mode="analyzer"]');
    await page.waitForTimeout(200);

    // Paste CSP with unsafe-inline (using single quotes as in real CSP)
    const cspWithUnsafe = "default-src 'self'; script-src 'self' 'unsafe-inline'";
    await page.fill('#csp-analyzer-input', cspWithUnsafe);

    // Click analyze
    await page.click('#btn-csp-analyze');
    await page.waitForTimeout(200);

    // Check analysis output shows issue (contains "inline scripts/styles")
    const analysisOutput = page.locator('#csp-analysis-output');
    await expect(analysisOutput).toBeVisible();
    const text = await analysisOutput.textContent();
    expect(text).toContain('inline scripts/styles');
  });

  test('analyzes CSP and flags wildcards', async ({ page }) => {
    await page.goto('/tools/csp-header-generator');
    await page.waitForTimeout(300);

    // Switch to analyzer mode
    await page.click('.csp-mode-tab[data-mode="analyzer"]');
    await page.waitForTimeout(200);

    // Paste CSP with wildcard
    const cspWithWildcard = 'default-src *; script-src "self"';
    await page.fill('#csp-analyzer-input', cspWithWildcard);

    // Click analyze
    await page.click('#btn-csp-analyze');
    await page.waitForTimeout(200);

    // Check analysis output shows warning about permissive sources
    const analysisOutput = page.locator('#csp-analysis-output');
    await expect(analysisOutput).toBeVisible();
    const text = await analysisOutput.textContent();
    expect(text).toContain('permissive');
  });

  test('analyzes empty CSP and shows no issues', async ({ page }) => {
    await page.goto('/tools/csp-header-generator');
    await page.waitForTimeout(300);

    // Switch to analyzer mode
    await page.click('.csp-mode-tab[data-mode="analyzer"]');
    await page.waitForTimeout(200);

    // Leave textarea empty and click analyze
    await page.fill('#csp-analyzer-input', '');
    await page.click('#btn-csp-analyze');
    await page.waitForTimeout(200);

    // Check analysis output shows warning about no CSP
    const analysisOutput = page.locator('#csp-analysis-output');
    await expect(analysisOutput).toBeVisible();
    const text = await analysisOutput.textContent();
    expect(text).toContain('No CSP provided');
  });

});
