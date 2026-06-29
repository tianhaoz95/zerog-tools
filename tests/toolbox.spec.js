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
    
    // Check that there are 46 tool cards rendered
    const cards = page.locator('.tool-card');
    await expect(cards).toHaveCount(46);

    // Check Search Filtering
    const searchInput = page.locator('#tools-search-input');
    await searchInput.fill('password');
    // It should filter down to relevant tools (e.g. password gen, vault/encrypter, hash gen)
    const filteredCount = await cards.count();
    expect(filteredCount).toBeLessThan(45);
    expect(filteredCount).toBeGreaterThan(0);

    // Clear search
    await searchInput.fill('');
    await expect(cards).toHaveCount(46);
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

  test('Tool 35: AI Video Background Swap view navigation', async ({ page }) => {
    await page.locator('.tool-card[data-id="video-bg-swap"]').click();
    await expect(page.locator('#video-bg-view')).toHaveClass(/active/);
    // Upload control is visible; the run button is wired up but stays hidden
    // until a clip is loaded (it lives in the options group)
    await expect(page.locator('#video-bg-upload-container')).toBeVisible();
    await expect(page.locator('#btn-run-video-bg')).toBeAttached();
    await expect(page.locator('#video-bg-options-group')).toBeHidden();
    // Background swatches belong to this tool
    await expect(page.locator('.video-bg-swatch')).toHaveCount(4);
    await page.locator('#btn-video-bg-back').click();
    await expect(page.locator('#home-view')).toHaveClass(/active/);
  });

  test('Tool 36: EV vs Gas Car Cost Calculator functional test', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', (err) => {
      pageErrors.push(err);
    });

    await page.locator('.tool-card[data-id="ev-gas-calculator"]').click();
    await expect(page.locator('#ev-gas-view')).toHaveClass(/active/);

    // Defaults are computed on open: results should be populated, not placeholders
    await expect(page.locator('#ev-total-cost')).not.toHaveText('—');
    await expect(page.locator('#gas-total-cost')).not.toHaveText('—');
    await expect(page.locator('#ev-gas-bars')).toBeVisible();
    await expect(page.locator('#ev-gas-breakdown')).toBeVisible();

    // With default numbers, electric beats gas: verdict should carry the 'ev' class
    await expect(page.locator('#ev-gas-verdict')).toHaveClass(/ev/);
    await expect(page.locator('#ev-gas-verdict')).toContainText('electric car saves');

    // Drive gas prices through the roof -> EV should still win and savings grow
    await page.locator('#gas-fuel-price').fill('12');
    await page.locator('#btn-run-ev-gas').click();
    await expect(page.locator('#ev-gas-verdict')).toContainText('electric car saves');

    // Make the EV absurdly expensive and inefficient -> gas should win
    await page.locator('#ev-price').fill('120000');
    await page.locator('#gas-fuel-price').fill('3.50');
    await page.locator('#btn-run-ev-gas').click();
    await expect(page.locator('#ev-gas-verdict')).toHaveClass(/gas/);
    await expect(page.locator('#ev-gas-verdict')).toContainText('gas car saves');

    await page.locator('#btn-ev-gas-back').click();
    await expect(page.locator('#home-view')).toHaveClass(/active/);

    expect(pageErrors).toHaveLength(0);
  });

  test('New Tools: Navigation and basic rendering tests', async ({ page }) => {
    const newTools = [
      { id: 'ai-summarizer', view: '#ai-summarizer-view', backBtn: '#btn-ai-summarizer-back' },
      { id: 'ai-semantic-search', view: '#ai-semantic-search-view', backBtn: '#btn-ai-semantic-search-back' },
      { id: 'audio-trimmer', view: '#audio-trimmer-view', backBtn: '#btn-audio-trimmer-back' },
      { id: 'pdf-signer', view: '#pdf-signer-view', backBtn: '#btn-pdf-signer-back' },
      { id: 'exif-stripper', view: '#exif-stripper-view', backBtn: '#btn-exif-stripper-back' },
      { id: 'css-layout-builder', view: '#css-layout-builder-view', backBtn: '#btn-css-layout-builder-back' },
      { id: 'api-client', view: '#api-client-view', backBtn: '#btn-api-client-back' },
      { id: 'pdf-image-converter', view: '#pdf-image-converter-view', backBtn: '#btn-pdf-image-converter-back' },
      { id: 'mortgage-calculator', view: '#mortgage-calculator-view', backBtn: '#btn-mortgage-calculator-back' },
      { id: 'pomodoro-space', view: '#pomodoro-space-view', backBtn: '#btn-pomodoro-space-back' }
    ];

    for (const tool of newTools) {
      await page.locator(`.tool-card[data-id="${tool.id}"]`).click();
      await expect(page.locator(tool.view)).toHaveClass(/active/);
      await page.locator(tool.backBtn).click();
      await expect(page.locator('#home-view')).toHaveClass(/active/);
    }
  });

  test('Routing: deep link, URL sync, and back navigation', async ({ page }) => {
    // Deep link straight to a tool URL opens that tool's view.
    await page.goto(`${BASE_URL}/tools/json-formatter`);
    await expect(page.locator('#json-view')).toHaveClass(/active/);

    // Pre-rendered page serves tool-specific metadata for crawlers.
    await expect(page).toHaveTitle(/JSON Formatter/);

    // Clicking a card from home updates the URL to /tools/<id>.
    await page.goto(BASE_URL);
    await page.locator('.tool-card[data-id="qr-tool"]').click();
    await expect(page.locator('#qr-view')).toHaveClass(/active/);
    await expect(page).toHaveURL(/\/tools\/qr-tool$/);

    // Browser Back returns to the home view at root.
    await page.goBack();
    await expect(page.locator('#home-view')).toHaveClass(/active/);
    await expect(page).toHaveURL(`${BASE_URL}/`);
  });

});
