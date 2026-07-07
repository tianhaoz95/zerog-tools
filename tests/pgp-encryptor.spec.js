import { test, expect } from '@playwright/test';

test.describe('PGP/GPG Message Encryptor & Decryptor Tool', () => {

  // ── Navigation ────────────────────────────────────────────────
  test('navigates to tool and shows view', async ({ page }) => {
    await page.goto('/tools/pgp-encryptor');
    await page.waitForTimeout(500);

    await expect(page.locator('#pgp-view')).toHaveClass(/active/);
  });

  test('back button returns to home', async ({ page }) => {
    await page.goto('/tools/pgp-encryptor');
    await page.waitForTimeout(300);

    await page.click('#btn-pgp-back');
    await expect(page.locator('#home-view')).toHaveClass(/active/);
  });

  // ── Key Generation ────────────────────────────────────────────
  test('shows key generation mode by default', async ({ page }) => {
    await page.goto('/tools/pgp-encryptor');
    await page.waitForTimeout(300);

    const keygenPanel = page.locator('#keygen-panel');
    await expect(keygenPanel).toBeVisible();
  });

  test('generates a key pair', async ({ page }) => {
    await page.goto('/tools/pgp-encryptor');
    await page.waitForTimeout(300);

    // Click generate button
    await page.click('#btn-pgp-keygen');
    await page.waitForTimeout(3000); // Wait for key generation (RSA 2048 takes time)

    // Check that keys were generated (non-empty output)
    const publicKey = await page.locator('#pgp-public-key-output').inputValue();
    const privateKey = await page.locator('#pgp-private-key-output').inputValue();

    expect(publicKey.length).toBeGreaterThan(100);
    expect(privateKey.length).toBeGreaterThan(200);
  });

  // ── Mode Switching ────────────────────────────────────────────
  test('switches to encrypt mode', async ({ page }) => {
    await page.goto('/tools/pgp-encryptor');
    await page.waitForTimeout(300);

    await page.click('.pgp-mode-tab[data-mode="encrypt"]');
    await page.waitForTimeout(200);

    const encryptPanel = page.locator('#encrypt-panel');
    await expect(encryptPanel).toBeVisible();
  });

  test('switches to decrypt mode', async ({ page }) => {
    await page.goto('/tools/pgp-encryptor');
    await page.waitForTimeout(300);

    await page.click('.pgp-mode-tab[data-mode="decrypt"]');
    await page.waitForTimeout(200);

    const decryptPanel = page.locator('#decrypt-panel');
    await expect(decryptPanel).toBeVisible();
  });

  test('switches to sign mode', async ({ page }) => {
    await page.goto('/tools/pgp-encryptor');
    await page.waitForTimeout(300);

    await page.click('.pgp-mode-tab[data-mode="sign"]');
    await page.waitForTimeout(200);

    const signPanel = page.locator('#sign-panel');
    await expect(signPanel).toBeVisible();
  });

  test('switches to verify mode', async ({ page }) => {
    await page.goto('/tools/pgp-encryptor');
    await page.waitForTimeout(300);

    await page.click('.pgp-mode-tab[data-mode="verify"]');
    await page.waitForTimeout(200);

    const verifyPanel = page.locator('#verify-panel');
    await expect(verifyPanel).toBeVisible();
  });

});
