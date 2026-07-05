import { test, expect } from '@playwright/test';

test.describe('Web Push VAPID Key Pair Generator Tool', () => {

  // ── Navigation ────────────────────────────────────────────────
  test('navigates to tool and shows view', async ({ page }) => {
    await page.goto('/tools/vapid-keygen');
    await page.waitForTimeout(500);

    await expect(page.locator('#vapid-keygen-view')).toHaveClass(/active/);
  });

  test('back button returns to home', async ({ page }) => {
    await page.goto('/tools/vapid-keygen');
    await page.waitForTimeout(300);

    await page.click('#btn-vapid-keygen-back');
    await expect(page.locator('#home-view')).toHaveClass(/active/);
  });

  // ── UI Structure ──────────────────────────────────────────────
  test('shows generate button', async ({ page }) => {
    await page.goto('/tools/vapid-keygen');
    await page.waitForTimeout(300);

    const btn = page.locator('#btn-vapid-generate');
    await expect(btn).toBeVisible();
    await expect(btn).toContainText('Generate VAPID Key Pair');
  });

  test('shows public key output area', async ({ page }) => {
    await page.goto('/tools/vapid-keygen');
    await page.waitForTimeout(300);

    const pubOutput = page.locator('#vapid-public-key-output');
    await expect(pubOutput).toBeVisible();
  });

  test('shows private key output area', async ({ page }) => {
    await page.goto('/tools/vapid-keygen');
    await page.waitForTimeout(300);

    const privOutput = page.locator('#vapid-private-key-output');
    await expect(privOutput).toBeVisible();
  });

  test('shows copy buttons', async ({ page }) => {
    await page.goto('/tools/vapid-keygen');
    await page.waitForTimeout(300);

    const btnCopyPub = page.locator('#btn-vapid-copy-pub');
    const btnCopyPriv = page.locator('#btn-vapid-copy-priv');
    await expect(btnCopyPub).toBeVisible();
    await expect(btnCopyPriv).toBeVisible();
  });

  // ── Key Generation ────────────────────────────────────────────
  test('generates a key pair on button click', async ({ page }) => {
    await page.goto('/tools/vapid-keygen');
    await page.waitForTimeout(300);

    // Click generate button
    await page.click('#btn-vapid-generate');
    await page.waitForTimeout(1500); // Wait for key generation (EC P-256 is fast)

    // Check that keys were generated (non-empty output)
    const publicKey = await page.locator('#vapid-public-key-output').inputValue();
    const privateKey = await page.locator('#vapid-private-key-output').inputValue();

    expect(publicKey.length).toBeGreaterThan(50);
    expect(privateKey.length).toBeGreaterThan(100);
  });

  test('generated keys are URL-safe base64', async ({ page }) => {
    await page.goto('/tools/vapid-keygen');
    await page.waitForTimeout(300);

    // Click generate button
    await page.click('#btn-vapid-generate');
    await page.waitForTimeout(1500);

    const publicKey = await page.locator('#vapid-public-key-output').inputValue();
    const privateKey = await page.locator('#vapid-private-key-output').inputValue();

    // URL-safe base64 should NOT contain +, /, or = (padding stripped)
    expect(publicKey).not.toContain('+');
    expect(publicKey).not.toContain('/');
    expect(privateKey).not.toContain('+');
    expect(privateKey).not.toContain('/');

    // Should only contain URL-safe characters: A-Z, a-z, 0-9, -, _
    const urlSafeRegex = /^[A-Za-z0-9_-]+$/;
    expect(publicKey).toMatch(urlSafeRegex);
    expect(privateKey).toMatch(urlSafeRegex);
  });

  test('status banner shows success after generation', async ({ page }) => {
    await page.goto('/tools/vapid-keygen');
    await page.waitForTimeout(300);

    // Click generate button
    await page.click('#btn-vapid-generate');
    await page.waitForTimeout(1500);

    const statusBanner = page.locator('#vapid-status');
    await expect(statusBanner).toBeVisible();
    const text = await statusBanner.textContent();
    expect(text.toLowerCase()).toContain('success');
  });

});
