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
    
    // Check that there are 103 tool cards rendered
    const cards = page.locator('.tool-card');
    await expect(cards).toHaveCount(103);

    // Check Search Filtering
    const searchInput = page.locator('#tools-search-input');
    await searchInput.fill('password');
    // It should filter down to relevant tools
    const filteredCount = await cards.count();
    expect(filteredCount).toBeLessThan(103);
    expect(filteredCount).toBeGreaterThan(0);

    // Clear search
    await searchInput.fill('');
    await expect(cards).toHaveCount(103);
  });

  test('Tool 1: Passport Photo Generator view navigation', async ({ page }) => {
    await page.locator('.tool-card[data-id="passport-photo"]').click();
    await expect(page.locator('#passport-view')).toHaveClass(/active/);
    await page.locator('#btn-passport-back').click();
    await expect(page.locator('#home-view')).toHaveClass(/active/);
  });

  test('Tool 1.5: AI Deep Face Swap view navigation', async ({ page }) => {
    await page.locator('.tool-card[data-id="ai-face-swap"]').click();
    await expect(page.locator('#ai-face-swap-view')).toHaveClass(/active/);
    await page.locator('#btn-face-swap-back').click();
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

  test('Tool 17: JSON Diff & Patch Generator functional test', async ({ page }) => {
    await page.locator('.tool-card[data-id="json-diff"]').click();
    await expect(page.locator('#json-diff-view')).toHaveClass(/active/);

    // Click Compare to run the diff with default sample data
    await page.locator('#btn-run-json-diff').click();

    // Check that stats show changes (the default samples differ)
    const stats = page.locator('#json-diff-stats');
    await expect(stats).toBeVisible();

    // Switch to Inline mode and verify output renders
    await page.locator('[data-mode="inline"]').click();
    const inlineOutput = page.locator('#json-diff-output');
    await expect(inlineOutput).toBeVisible();

    // Switch to Patch mode
    await page.locator('[data-mode="patch"]').click();
    const patchOutput = page.locator('.json-patch-output');
    await expect(patchOutput).toBeVisible();
  });

  test('Tool 18: JSON Schema Generator functional test', async ({ page }) => {
    await page.locator('.tool-card[data-id="json-schema-gen"]').click();
    await expect(page.locator('#json-schema-gen-view')).toHaveClass(/active/);

    // Click Generate to create schema from default sample data
    await page.locator('#btn-generate-schema').click();

    // Check that output is rendered
    const output = page.locator('#json-schema-output');
    await expect(output).toBeVisible();

    // Verify schema has draft-07 marker (the generated schema should include $schema)
    await expect(output).toContainText('draft-07');

    // Test copy button exists and is visible
    const copyBtn = page.locator('#btn-copy-schema');
    await expect(copyBtn).toBeVisible();
  });

  test('Tool 19: JSON to TypeScript Generator functional test', async ({ page }) => {
    await page.locator('.tool-card[data-id="json-to-ts"]').click();
    await expect(page.locator('#json-to-ts-view')).toHaveClass(/active/);

    // Click Generate to create TypeScript from default sample data
    await page.locator('#btn-generate-ts').click();

    // Check that output is rendered
    const output = page.locator('#json-to-ts-output');
    await expect(output).toBeVisible();

    // Verify generated code contains interface keyword
    await expect(output).toContainText('interface');

    // Test copy button exists and is visible
    const copyBtn = page.locator('#btn-copy-ts');
    await expect(copyBtn).toBeVisible();
  });

  test('Tool 20: Multi-Hash Calculator functional test', async ({ page }) => {
    await page.locator('.tool-card[data-id="multi-hash-calculator"]').click();
    await expect(page.locator('#multi-hash-view')).toHaveClass(/active/);

    // Click Calculate to compute all hashes with default text
    await page.locator('#btn-calculate-all-hashes').click();

    // Check that output is rendered with hash results
    const output = page.locator('#multi-hash-output');
    await expect(output).toBeVisible();

    // Verify at least one hash algorithm result is shown (SHA-256 should be present)
    await expect(output).toContainText('SHA-256:');

    // Test copy button exists and is visible
    const copyBtn = page.locator('#btn-copy-all-hashes');
    await expect(copyBtn).toBeVisible();
  });

  test('Tool 21: Hash & Checksum Generator functional test', async ({ page }) => {
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

  test('Tool 34.5: AI Image Upscaler view navigation', async ({ page }) => {
    await page.locator('.tool-card[data-id="image-upscaler"]').click();
    await expect(page.locator('#image-upscaler-view')).toHaveClass(/active/);
    // Upload control and run button present; result comparison hidden until a run
    await expect(page.locator('#image-upscaler-upload-container')).toBeVisible();
    await expect(page.locator('#btn-run-image-upscaler')).toBeVisible();
    await expect(page.locator('#image-upscaler-compare')).toBeHidden();
    // Two upscale-factor toggles, with 2x active by default
    await expect(page.locator('.image-upscaler-scale')).toHaveCount(2);
    await expect(page.locator('.image-upscaler-scale[data-scale="2"]')).toHaveClass(/active/);
    // Selecting 4x moves the active state
    await page.locator('.image-upscaler-scale[data-scale="4"]').click();
    await expect(page.locator('.image-upscaler-scale[data-scale="4"]')).toHaveClass(/active/);
    await page.locator('#btn-image-upscaler-back').click();
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

  test('Tool: FIRE Early Retirement Calculator functional test', async ({ page }) => {
    await page.locator('.tool-card[data-id="fire-retirement-calc"]').click();
    await expect(page.locator('#fire-retirement-calc-view')).toHaveClass(/active/);

    // Initial state check
    await expect(page.locator('#fire-target-number')).not.toHaveText('—');
    await expect(page.locator('#fire-years-to-target')).not.toHaveText('—');

    // Trigger calculation
    await page.locator('#btn-fire-calculate').click();
    await expect(page.locator('#fire-line-chart')).toBeVisible();

    // Verify projection table populated
    const rows = page.locator('#fire-table-body tr');
    await expect(rows.first()).toBeVisible();

    // Test back button
    await page.locator('#btn-fire-retirement-calc-back').click();
    await expect(page.locator('#home-view')).toHaveClass(/active/);
  });

  test('New Tools: Navigation and basic rendering tests', async ({ page }) => {
    test.setTimeout(120000);
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
      { id: 'pomodoro-space', view: '#pomodoro-space-view', backBtn: '#btn-pomodoro-space-back' },
      { id: 'morse-code', view: '#morse-code-view', backBtn: '#btn-morse-code-back' },
      { id: 'text-to-speech', view: '#text-to-speech-view', backBtn: '#btn-text-to-speech-back' },
      { id: 'media-recorder', view: '#media-recorder-view', backBtn: '#btn-media-recorder-back' },
      { id: 'keyboard-tester', view: '#keyboard-tester-view', backBtn: '#btn-keyboard-tester-back' },
      { id: 'svg-converter', view: '#svg-converter-view', backBtn: '#btn-svg-converter-back' },
      { id: 'xml-formatter', view: '#xml-formatter-view', backBtn: '#btn-xml-formatter-back' },
      { id: 'base-converter', view: '#base-converter-view', backBtn: '#btn-base-converter-back' },
      { id: 'css-glassmorphism', view: '#css-glassmorphism-view', backBtn: '#btn-css-glassmorphism-back' },
      { id: 'css-box-shadow', view: '#css-box-shadow-view', backBtn: '#btn-css-box-shadow-back' },
      { id: 'case-converter', view: '#case-converter-view', backBtn: '#btn-case-converter-back' },
      { id: 'aspect-ratio-calc', view: '#aspect-ratio-calc-view', backBtn: '#btn-aspect-ratio-calc-back' },
      { id: 'color-blindness', view: '#color-blindness-view', backBtn: '#btn-color-blindness-back' },
      { id: 'tone-generator', view: '#tone-generator-view', backBtn: '#btn-tone-generator-back' },
      { id: 'subnet-calculator', view: '#subnet-calculator-view', backBtn: '#btn-subnet-calculator-back' },
      { id: 'pixel-tester', view: '#pixel-tester-view', backBtn: '#btn-pixel-tester-back' },
      { id: 'sketchpad', view: '#sketchpad-view', backBtn: '#btn-sketchpad-back' },
      { id: 'hex-viewer', view: '#hex-viewer-view', backBtn: '#btn-hex-viewer-back' },
      { id: 'tip-calculator', view: '#tip-calculator-view', backBtn: '#btn-tip-calculator-back' },
      { id: 'life-progress', view: '#life-progress-view', backBtn: '#btn-life-progress-back' },
      { id: 'graphing-calc', view: '#graphing-calc-view', backBtn: '#btn-graphing-calc-back' },
      { id: 'password-analyzer', view: '#password-analyzer-view', backBtn: '#btn-password-analyzer-back' },
      { id: 'luhn-validator', view: '#luhn-validator-view', backBtn: '#btn-luhn-validator-back' },
      { id: 'binary-translator', view: '#binary-translator-view', backBtn: '#btn-binary-translator-back' },
      { id: 'color-palette-gen', view: '#color-palette-gen-view', backBtn: '#btn-color-palette-gen-back' },
      { id: 'lorem-markdown', view: '#lorem-markdown-view', backBtn: '#btn-lorem-markdown-back' },
      { id: 'user-flowchart', view: '#user-flowchart-view', backBtn: '#btn-user-flowchart-back' },
      { id: 'metronome-tapper', view: '#metronome-tapper-view', backBtn: '#btn-metronome-tapper-back' },
      { id: 'caesar-cipher', view: '#caesar-cipher-view', backBtn: '#btn-caesar-cipher-back' },
      { id: 'timezone-converter', view: '#timezone-converter-view', backBtn: '#btn-timezone-converter-back' },
      { id: 'date-calculator', view: '#date-calculator-view', backBtn: '#btn-date-calculator-back' },
      { id: 'compound-interest', view: '#compound-interest-view', backBtn: '#btn-compound-interest-back' },
      { id: 'tdee-calculator', view: '#tdee-calculator-view', backBtn: '#btn-tdee-calculator-back' },
      { id: 'sort-list', view: '#sort-list-view', backBtn: '#btn-sort-list-back' },
      { id: 'json-yaml-converter', view: '#json-yaml-converter-view', backBtn: '#btn-json-yaml-converter-back' },
      { id: 'device-info', view: '#device-info-view', backBtn: '#btn-device-info-back' },
      { id: 'stopwatch-lap', view: '#stopwatch-lap-view', backBtn: '#btn-stopwatch-lap-back' },
      { id: 'html-wysiwyg', view: '#html-wysiwyg-view', backBtn: '#btn-html-wysiwyg-back' },
      { id: 'css-gradient-mesh', view: '#css-gradient-mesh-view', backBtn: '#btn-css-gradient-mesh-back' },
      { id: 'svg-path-viewer', view: '#svg-path-viewer-view', backBtn: '#btn-svg-path-viewer-back' },
      { id: 'guitar-tuner', view: '#guitar-tuner-view', backBtn: '#btn-guitar-tuner-back' },
      { id: 'speed-reader', view: '#speed-reader-view', backBtn: '#btn-speed-reader-back' },
      { id: 'mime-inspector', view: '#mime-inspector-view', backBtn: '#btn-mime-inspector-back' },
      { id: 'sql-playground', view: '#sql-playground-view', backBtn: '#btn-sql-playground-back' },
      { id: 'hash-verifier', view: '#hash-verifier-view', backBtn: '#btn-hash-verifier-back' },
      { id: 'lorem-pixel', view: '#lorem-pixel-view', backBtn: '#btn-lorem-pixel-back' },
      { id: 'ratio-solver', view: '#ratio-solver-view', backBtn: '#btn-ratio-solver-back' },
      { id: 'fire-retirement-calc', view: '#fire-retirement-calc-view', backBtn: '#btn-fire-retirement-calc-back' },
      { id: 'code-to-image', view: '#code-to-image-view', backBtn: '#btn-code-to-image-back' },
      { id: 'ai-resume-injector', view: '#ai-resume-injector-view', backBtn: '#btn-ai-resume-injector-back' },
      { id: 'code-typing-video', view: '#code-typing-video-view', backBtn: '#btn-code-typing-video-back' },
      { id: 'ai-photo-booth', view: '#ai-photo-booth-view', backBtn: '#btn-ai-photo-booth-back' }
    ];

    for (const tool of newTools) {
      await page.locator(`.tool-card[data-id="${tool.id}"]`).click();
      await expect(page.locator(tool.view)).toHaveClass(/active/);
      await page.locator(tool.backBtn).click();
      await expect(page.locator('#home-view')).toHaveClass(/active/);
    }
  });

  test('Tool: Code Snippet to Image Generator functional test', async ({ page }) => {
    await page.locator('.tool-card[data-id="code-to-image"]').click();
    await expect(page.locator('#code-to-image-view')).toHaveClass(/active/);

    const codeInput = page.locator('#code-to-image-input');
    // Default value is JS snippet
    await expect(codeInput).toHaveValue(/Quick Sort/);

    // Assert preview matches
    const previewBody = page.locator('#code-preview-body');
    await expect(previewBody).toContainText('Quick Sort');

    // Change language and assert it updates automatically
    const langSelect = page.locator('#code-to-image-lang');
    await langSelect.selectOption('python');
    await expect(codeInput).toHaveValue(/def fibonacci/);

    // Edit code input customly
    await codeInput.fill('console.log("Hello Playwright Test");');
    await expect(previewBody).toContainText('Hello Playwright Test');
  });

  test('Tool: AI Resume Prompt Injector functional test', async ({ page }) => {
    await page.locator('.tool-card[data-id="ai-resume-injector"]').click();
    await expect(page.locator('#ai-resume-injector-view')).toHaveClass(/active/);

    // Create a minimal 1-page PDF buffer
    const mockPdfBuffer = Buffer.from(
      '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << >> /MediaBox [0 0 500 500] >>\nendobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\n0000000101 00000 n\ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n178\n%%EOF'
    );

    // Upload the mock PDF
    await page.setInputFiles('#resume-injector-file', {
      name: 'resume.pdf',
      mimeType: 'application/pdf',
      buffer: mockPdfBuffer,
    });

    // Editor section should become visible
    const editorSec = page.locator('#resume-injector-editor-section');
    await expect(editorSec).toBeVisible();

    // Verify selector default templates are correct
    const promptSelect = page.locator('#resume-injector-prompt-select');
    await expect(promptSelect).toBeVisible();

    // Verify the prompt text area changes based on template selection
    const promptText = page.locator('#resume-injector-prompt-text');
    await expect(promptText).toBeVisible();
    await expect(promptText).toHaveValue(/Advisory to AI Parser/);

    await promptSelect.selectOption('endorse');
    await expect(promptText).toHaveValue(/flagged this candidate as a 'Must Hire'/);
  });

  // --- AI Photo Booth Tests ---

  test('Tool: AI Photo Booth — Navigation and basic rendering', async ({ page }) => {
    await page.locator('.tool-card[data-id="ai-photo-booth"]').click();
    await expect(page.locator('#ai-photo-booth-view')).toHaveClass(/active/);

    // Assert key UI elements exist
    await expect(page.locator('#btn-ai-photo-booth-back')).toBeVisible();
    await expect(page.locator('#pb-camera-select')).toBeVisible();
    await expect(page.locator('#pb-mode-pose-mapped')).toBeVisible();
    await expect(page.locator('#pb-mode-free')).toBeVisible();
    await expect(page.locator('#btn-pb-upload')).toBeVisible();
    await expect(page.locator('#btn-pb-capture')).toBeVisible();
    await expect(page.locator('#pb-emoji-grid')).toBeVisible();

    // Assert mode toggle defaults to pose-mapped
    const mappedBtn = page.locator('#pb-mode-pose-mapped');
    await expect(mappedBtn).toHaveClass(/active-mode/);

    // Navigate back
    await page.locator('#btn-ai-photo-booth-back').click();
    await expect(page.locator('#home-view')).toHaveClass(/active/);
  });

  test('Tool: AI Photo Booth — Mode toggle', async ({ page }) => {
    await page.locator('.tool-card[data-id="ai-photo-booth"]').click();

    // Click free mode button
    await page.locator('#pb-mode-free').click();
    const mappedBtn = page.locator('#pb-mode-pose-mapped');
    await expect(mappedBtn).not.toHaveClass(/active-mode/);

    const freeBtn = page.locator('#pb-mode-free');
    await expect(freeBtn).toHaveClass(/active-mode/);

    // Switch back to pose-mapped
    await mappedBtn.click();
    await expect(mappedBtn).toHaveClass(/active-mode/);
  });

  test('Tool: AI Photo Booth — Emoji grid renders presets', async ({ page }) => {
    await page.locator('.tool-card[data-id="ai-photo-booth"]').click();

    // Wait for the tool to initialize (model loading, camera setup)
    await page.waitForTimeout(3000);

    // Check if emoji grid container exists and has content
    const hasEmojiGrid = await page.evaluate(() => {
      const grid = document.getElementById('pb-emoji-grid');
      return !!grid;
    });
    expect(hasEmojiGrid).toBe(true);

    // Should have 10 preset emojis (from PB_EMOJI_PRESETS) - check for any emoji content
    const hasEmojis = await page.evaluate(() => {
      const grid = document.getElementById('pb-emoji-grid');
      if (!grid) return false;
      const buttons = grid.querySelectorAll('button');
      return buttons.length >= 5;
    });
    expect(hasEmojis).toBe(true);
  });

  test('Tool: AI Photo Booth — File upload triggers input', async ({ page }) => {
    await page.locator('.tool-card[data-id="ai-photo-booth"]').click();

    // Wait for initialization
    await page.waitForTimeout(2000);

    const fileInput = page.locator('#pb-upload-input');
    await expect(fileInput).toBeHidden(); // hidden input, button triggers it

    // Click the visible upload button to trigger file dialog
    await page.locator('#btn-pb-upload').click();

    // Verify uploaded list area exists (will be populated after actual upload)
    const uploadedList = page.locator('#pb-uploaded-list');
    await expect(uploadedList).toHaveCount(1); // Just check element exists
  });

  test('Tool: AI Photo Booth — Capture button shows preview', async ({ page }) => {
    await page.locator('.tool-card[data-id="ai-photo-booth"]').click();

    // Wait for initialization
    await page.waitForTimeout(2000);

    const captureBtn = page.locator('#btn-pb-capture');
    await expect(captureBtn).toBeVisible();

    // Click capture (even without pose data, should produce a blank composite)
    await captureBtn.click();

    // Captured preview should appear (may use flex or block display)
    const capturedPreview = page.locator('#pb-captured-preview');
    await expect(capturedPreview).toBeVisible();

    // Download button should be visible in preview
    await expect(page.locator('#btn-pb-download')).toBeVisible();
  });

  test('Tool: AI Photo Booth — Decoration list updates on emoji click', async ({ page }) => {
    await page.locator('.tool-card[data-id="ai-photo-booth"]').click();

    // Wait for initialization
    await page.waitForTimeout(2000);

    // Click a preset emoji to add decoration
    const firstEmoji = page.locator('#pb-emoji-grid button').first();
    await firstEmoji.click();

    // Small delay for UI update
    await page.waitForTimeout(500);

    // Decoration list should show the added item
    const decoList = page.locator('#pb-decoration-list');
    await expect(decoList).toBeVisible();

    // Selected decoration controls should appear (check visibility, not exact style)
    const controlsGroup = page.locator('#pb-deco-controls-group');
    await expect(controlsGroup).toBeVisible();
  });

  test('Tool: Code Typing Animation Video Renderer UI test', async ({ page }) => {
    await page.locator('.tool-card[data-id="code-typing-video"]').click();
    await expect(page.locator('#code-typing-video-view')).toHaveClass(/active/);

    const codeInput = page.locator('#code-typing-video-input');
    await expect(codeInput).toHaveValue(/Quick Sort/);

    // Canvas preview should render something (non-blank) for the default snippet.
    const canvas = page.locator('#code-typing-video-canvas');
    await expect(canvas).toBeVisible();
    const hasContent = await canvas.evaluate((el) => {
      const ctx = el.getContext('2d');
      const data = ctx.getImageData(0, 0, el.width, el.height).data;
      return data.some((v, i) => i % 4 !== 3 && v !== 0);
    });
    expect(hasContent).toBe(true);

    // Switching language swaps the sample code.
    await page.locator('#code-typing-video-lang').selectOption('python');
    await expect(codeInput).toHaveValue(/def fibonacci/);

    // Estimate text should reflect frame/duration math and update live.
    const estimate = page.locator('#code-typing-video-estimate');
    await expect(estimate).toContainText('frames');

    // Backdrop type toggling shows/hides the matching control group.
    await page.locator('#code-typing-video-bg-type').selectOption('solid');
    await expect(page.locator('#group-code-typing-video-solid-bg')).toBeVisible();
    await expect(page.locator('#group-code-typing-video-preset-bg')).toBeHidden();

    await page.locator('#btn-code-typing-video-back').click();
    await expect(page.locator('#home-view')).toHaveClass(/active/);
  });

  test('Tool: Code Typing Animation Video Renderer end-to-end render', async ({ page }) => {
    test.setTimeout(120000);
    await page.locator('.tool-card[data-id="code-typing-video"]').click();
    await expect(page.locator('#code-typing-video-view')).toHaveClass(/active/);

    // Keep this render trivially small (single char, no holds, max typing
    // speed) so the full worker-render + ffmpeg.wasm-encode pipeline runs
    // end-to-end quickly and deterministically in CI.
    await page.locator('#code-typing-video-input').fill('x');
    const setSlider = async (id, value) => {
      await page.locator(`#${id}`).evaluate((el, v) => {
        el.value = v;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }, value);
    };
    await setSlider('slider-code-typing-video-hold-start', '0');
    await setSlider('slider-code-typing-video-hold-end', '0');
    await setSlider('slider-code-typing-video-speed', '60');

    await page.locator('#btn-render-code-typing-video').click();

    const resultVideo = page.locator('#code-typing-video-result');
    await expect(resultVideo).toBeVisible({ timeout: 100000 });
    await expect(resultVideo).toHaveAttribute('src', /^blob:/);
    await expect(page.locator('#btn-download-code-typing-video')).toBeVisible();
  });

  test('Tool: CSS Box Shadow Generator functional test', async ({ page }) => {
    await page.locator('.tool-card[data-id="css-box-shadow"]').click();
    await expect(page.locator('#css-box-shadow-view')).toHaveClass(/active/);

    // Verify initial state has one layer
    const layers = page.locator('[id^="shadow-layer-"]');
    await expect(layers).toHaveCount(1);

    // Test adding a new layer
    const btnAddLayer = page.locator('#btn-add-shadow-layer');
    await btnAddLayer.click();
    await expect(layers).toHaveCount(2);

    // Test adjusting slider values
    const blurSlider = page.locator('#shadow-blur-1');
    await blurSlider.fill('50');
    
    // Verify preview updates (check that the element has box-shadow style)
    const previewCard = page.locator('#shadow-preview-card');
    const boxShadow = await previewCard.evaluate(el => el.style.boxShadow);
    expect(boxShadow).toBeTruthy();

    // Test preset application
    const btnSoftPreset = page.locator('#btn-preset-soft');
    await btnSoftPreset.click();
    await expect(layers).toHaveCount(1);

    // Verify CSS output is populated
    const cssOutput = page.locator('#shadow-css-output');
    const outputValue = await cssOutput.inputValue();
    expect(outputValue).toContain('box-shadow:');

    // Test copy button (verify it doesn't throw)
    const btnCopyCss = page.locator('#btn-copy-css');
    await btnCopyCss.click();

    // Navigate back
    const btnBack = page.locator('#btn-css-box-shadow-back');
    await btnBack.click();
    await expect(page.locator('#home-view')).toHaveClass(/active/);
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
