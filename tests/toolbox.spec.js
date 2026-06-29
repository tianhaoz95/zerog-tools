import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5002';

test.describe('ZeroG Toolbox Integration Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to homepage and wait for load
    await page.goto(BASE_URL);
  });

  test('Home Page - Basic rendering, search and filtering', async ({ page }) => {
    // Check title
    await expect(page.locator('.logo-text')).toContainText('ZeroG Toolbox');
    
    // Check that there are 34 tool cards rendered
    const cards = page.locator('.tool-card');
    await expect(cards).toHaveCount(34);
    
    // Check Search Filtering
    const searchInput = page.locator('#tools-search-input');
    await searchInput.fill('password');
    // It should filter down to relevant tools (e.g. password gen, vault/encrypter, hash gen)
    const filteredCount = await cards.count();
    expect(filteredCount).toBeLessThan(34);
    expect(filteredCount).toBeGreaterThan(0);

    // Clear search
    await searchInput.fill('');
    await expect(cards).toHaveCount(34);
  });

  test('Tool 1: Passport Photo Generator view navigation', async ({ page }) => {
    await page.locator('.tool-card[data-id="passport-photo"]').click();
    await expect(page.locator('#passport-view')).toHaveClass(/active/);
    await page.locator('#btn-passport-back').click();
    await expect(page.locator('#home-view')).toHaveClass(/active/);
  });

  test('Tool 2: PNG to SVG Vectorizer view navigation', async ({ page }) => {
    await page.locator('.tool-card[data-id="image-vectorizer"]').click();
    await expect(page.locator('#vectorizer-view')).toHaveClass(/active/);
    await page.locator('#btn-vectorizer-back').click();
    await expect(page.locator('#home-view')).toHaveClass(/active/);
  });

  test('Tool 3: AI Audio Transcriber view navigation', async ({ page }) => {
    await page.locator('.tool-card[data-id="audio-transcriber"]').click();
    await expect(page.locator('#transcriber-view')).toHaveClass(/active/);
  });

  test('Tool 4: File Encrypter view navigation', async ({ page }) => {
    await page.locator('.tool-card[data-id="file-encrypter"]').click();
    await expect(page.locator('#encrypter-view')).toHaveClass(/active/);
  });

  test('Tool 5: AI Document OCR Scanner functional test', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', (err) => {
      pageErrors.push(err);
    });

    await page.locator('.tool-card[data-id="ocr-scanner"]').click();
    await expect(page.locator('#ocr-view')).toHaveClass(/active/);

    // Create a 1x1 transparent mock PNG buffer
    const mockPngBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      'base64'
    );

    await page.setInputFiles('#ocr-file-input', {
      name: 'test-doc.png',
      mimeType: 'image/png',
      buffer: mockPngBuffer,
    });

    await expect(page.locator('#btn-run-ocr')).not.toBeDisabled();
    await page.locator('#btn-run-ocr').click();
    await expect(page.locator('#ocr-loading-overlay')).toHaveClass(/active/);

    // Wait 2s to allow worker instantiation and importScripts to run
    await page.waitForTimeout(2000);

    const importErrors = pageErrors.filter(
      (err) => err.message.includes('NetworkError') || err.message.includes('importScripts')
    );
    expect(importErrors).toHaveLength(0);
  });

  test('Tool 6: Secure Password Generator functional test', async ({ page }) => {
    await page.locator('.tool-card[data-id="password-gen"]').click();
    await expect(page.locator('#password-view')).toHaveClass(/active/);
    
    // Default length is 16. Click generate.
    await page.locator('#btn-generate-password').click();
    const pass = await page.locator('#password-output').innerText();
    expect(pass.length).toBe(16);
    
    // Check stats updated
    await expect(page.locator('#password-entropy-val')).not.toContainText('0 bits');
  });

  test('Tool 7: JSON Formatter & Validator functional test', async ({ page }) => {
    await page.locator('.tool-card[data-id="json-formatter"]').click();
    await expect(page.locator('#json-view')).toHaveClass(/active/);
    
    const input = page.locator('#json-input');
    const output = page.locator('#json-output');
    const status = page.locator('#json-status-banner');
    
    // Test Valid JSON
    await input.fill('{"name":"ZeroG","ver":2}');
    await page.locator('#btn-beautify-json').click();
    await expect(status).toBeVisible();
    await expect(status).toContainText('Valid JSON');
    const formatted = await output.inputValue();
    expect(formatted).toContain('"name": "ZeroG"');
    
    // Test Invalid JSON
    await input.fill('{"name": "ZeroG", invalid}');
    await page.locator('#btn-beautify-json').click();
    await expect(status).toContainText('Invalid JSON');
    // Check error output
    const errText = await output.inputValue();
    expect(errText).toContain('Syntax Error');
  });

  test('Tool 8: QR Code Generator & Scanner functional test', async ({ page }) => {
    await page.locator('.tool-card[data-id="qr-tool"]').click();
    await expect(page.locator('#qr-view')).toHaveClass(/active/);
    
    // Test Generating QR
    await page.locator('#qr-text-input').fill('https://google.com');
    await page.locator('#btn-generate-qr').click();
    // Verify canvas exists
    const canvas = page.locator('#qr-output-canvas');
    await expect(canvas).toBeVisible();
  });

  test('Tool 9: Base64 Encoder & Decoder functional test', async ({ page }) => {
    await page.locator('.tool-card[data-id="base64-tool"]').click();
    await expect(page.locator('#base64-view')).toHaveClass(/active/);
    
    const input = page.locator('#base64-input');
    const output = page.locator('#base64-output');
    
    // Test Encode Text
    await input.fill('ZeroG');
    await page.locator('#btn-encode-base64').click();
    await expect(output).toHaveValue('WmVyb0c=');
    
    // Test Decode Text
    await input.fill('WmVyb0M=');
    await page.locator('#btn-decode-base64').click();
    await expect(output).toHaveValue('ZeroC');
  });

  test('Tool 10: Markdown Live Previewer functional test', async ({ page }) => {
    await page.locator('.tool-card[data-id="markdown-tool"]').click();
    await expect(page.locator('#markdown-view')).toHaveClass(/active/);
    
    const input = page.locator('#markdown-input');
    const preview = page.locator('#markdown-preview-output');
    
    await input.fill('# Test Heading\n**bold content**');
    // Preview updates automatically
    await expect(preview.locator('h1')).toContainText('Test Heading');
    await expect(preview.locator('strong')).toContainText('bold content');
  });

  test('Tool 11: URL Encoder & Decoder functional test', async ({ page }) => {
    await page.locator('.tool-card[data-id="url-tool"]').click();
    await expect(page.locator('#url-view')).toHaveClass(/active/);
    
    const input = page.locator('#url-input');
    const output = page.locator('#url-output');
    
    await input.fill('hello world & co');
    await page.locator('#btn-encode-url').click();
    await expect(output).toHaveValue('hello%20world%20%26%20co');
    
    await input.fill('hello%20world%20%26%20co');
    await page.locator('#btn-decode-url').click();
    await expect(output).toHaveValue('hello world & co');
  });

  test('Tool 12: CSV <-> JSON Converter functional test', async ({ page }) => {
    await page.locator('.tool-card[data-id="csv-json-tool"]').click();
    await expect(page.locator('#csv-json-view')).toHaveClass(/active/);
    
    const input = page.locator('#csv-json-input');
    const output = page.locator('#csv-json-output');
    
    // Test CSV to JSON (Default CSV values should be there)
    await page.locator('#btn-run-csv-json').click();
    const jsonOutputText = await output.inputValue();
    expect(jsonOutputText).toContain('"name": "Alice"');
    
    // Toggle JSON to CSV tab
    await page.locator('#tab-json-to-csv').click();
    await page.locator('#btn-run-csv-json').click();
    const csvOutputText = await output.inputValue();
    expect(csvOutputText).toContain('name,age,city');
    expect(csvOutputText).toContain('Alice,24,New York');
  });

  test('Tool 13: Image Resizer & Format Converter view navigation', async ({ page }) => {
    await page.locator('.tool-card[data-id="image-resizer"]').click();
    await expect(page.locator('#image-resizer-view')).toHaveClass(/active/);
  });

  test('Tool 14: PDF Merger & Splitter view navigation', async ({ page }) => {
    await page.locator('.tool-card[data-id="pdf-tool"]').click();
    await expect(page.locator('#pdf-view')).toHaveClass(/active/);
  });

  test('Tool 15: Regex Tester & Explainer functional test', async ({ page }) => {
    await page.locator('.tool-card[data-id="regex-tester"]').click();
    await expect(page.locator('#regex-view')).toHaveClass(/active/);
    
    const pattern = page.locator('#regex-pattern');
    const testText = page.locator('#regex-test-text');
    const count = page.locator('#val-regex-match-count');
    
    await pattern.fill('\\b[A-Za-z]{4}\\b');
    await testText.fill('This is a test text.');
    await page.locator('#btn-run-regex').click();
    
    await expect(count).toContainText('3 Matches Found'); // 'This', 'test', 'text'
  });

  test('Tool 16: Diff Checker & Text Comparator functional test', async ({ page }) => {
    await page.locator('.tool-card[data-id="diff-checker"]').click();
    await expect(page.locator('#diff-view')).toHaveClass(/active/);
    
    await page.locator('#btn-run-diff').click();
    const diffContainer = page.locator('#diff-result-output');
    // Check that diff row exists
    await expect(diffContainer.locator('.diff-row')).toHaveCount(10);
  });

  test('Tool 17: Hash & Checksum Generator functional test', async ({ page }) => {
    await page.locator('.tool-card[data-id="hash-generator"]').click();
    await expect(page.locator('#hash-view')).toHaveClass(/active/);
    
    await page.locator('#hash-input-text').fill('ZeroG');
    await page.locator('#btn-run-hash').click();
    
    // Check hash is generated
    const sha256 = await page.locator('#hash-val-sha256').innerText();
    expect(sha256.length).toBe(64);
  });

  test('Tool 18: SVG Path Visualizer functional test', async ({ page }) => {
    await page.locator('.tool-card[data-id="svg-editor"]').click();
    await expect(page.locator('#svg-editor-view')).toHaveClass(/active/);
    
    await page.locator('#btn-draw-svg-path').click();
    const canvas = page.locator('#svg-path-canvas');
    await expect(canvas).toBeVisible();
  });

  test('Tool 19: Unit Converter functional test', async ({ page }) => {
    await page.locator('.tool-card[data-id="unit-converter"]').click();
    await expect(page.locator('#unit-view')).toHaveClass(/active/);
    
    await page.locator('#unit-value-input').fill('5');
    await page.locator('#btn-run-unit-convert').click();
    
    await expect(page.locator('#unit-result-display')).toContainText('5 m = 500 cm');
  });

  test('Tool 20: Color Palette & WCAG Checker functional test', async ({ page }) => {
    await page.locator('.tool-card[data-id="color-picker"]').click();
    await expect(page.locator('#color-view')).toHaveClass(/active/);
    
    // Check swatches grid populated
    const swatches = page.locator('#swatches-grid-container .swatch-card');
    await expect(swatches).toHaveCount(5);
    
    // Check contrast tab works
    await page.locator('#tab-color-contrast').click();
    await page.locator('#btn-run-contrast-check').click();
    await expect(page.locator('#contrast-ratio-display')).not.toContainText('0:1');
  });

  test('Tool 31: AI Sentiment & Emotion Analyzer view navigation', async ({ page }) => {
    await page.locator('.tool-card[data-id="ai-sentiment"]').click();
    await expect(page.locator('#sentiment-view')).toHaveClass(/active/);
    await page.locator('#btn-sentiment-back').click();
    await expect(page.locator('#home-view')).toHaveClass(/active/);
  });

  test('Tool 32: AI Language Translator view navigation', async ({ page }) => {
    await page.locator('.tool-card[data-id="ai-translator"]').click();
    await expect(page.locator('#translator-view')).toHaveClass(/active/);
    await page.locator('#btn-translator-back').click();
    await expect(page.locator('#home-view')).toHaveClass(/active/);
  });

  test('Tool 33: AI Object Detector view navigation', async ({ page }) => {
    await page.locator('.tool-card[data-id="ai-detector"]').click();
    await expect(page.locator('#detector-view')).toHaveClass(/active/);
    await page.locator('#btn-detector-back').click();
    await expect(page.locator('#home-view')).toHaveClass(/active/);
  });

  test('Tool 34: AI Background Remover view navigation', async ({ page }) => {
    await page.locator('.tool-card[data-id="bg-remover"]').click();
    await expect(page.locator('#bg-remover-view')).toHaveClass(/active/);
    // Upload control and run button should be present
    await expect(page.locator('#bg-remover-upload-container')).toBeVisible();
    await expect(page.locator('#btn-run-bg-remover')).toBeVisible();
    await page.locator('#btn-bg-remover-back').click();
    await expect(page.locator('#home-view')).toHaveClass(/active/);
  });

});
