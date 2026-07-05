// ZeroG Toolbox — CSP Header Generator & Analyzer
// Build a Content-Security-Policy string from directive checklist/input UI,
// or paste an existing CSP to flag unsafe-inline/unsafe-eval/wildcard risks.

export {}; // Make this a module so Vite includes it
/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

let currentMode = 'builder'; // 'builder' | 'analyzer'

const KNOWN_DIRECTIVES = [
  { key: 'default-src', label: 'Default Source', desc: 'Fallback for all content types' },
  { key: 'script-src', label: 'Scripts', desc: 'JavaScript' },
  { key: 'style-src', label: 'Styles', desc: 'CSS' },
  { key: 'img-src', label: 'Images', desc: 'Image files' },
  { key: 'font-src', label: 'Fonts', desc: 'Font files' },
  { key: 'connect-src', label: 'Connection', desc: 'XHR, WebSocket, etc.' },
  { key: 'media-src', label: 'Media', desc: 'Audio and video' },
  { key: 'object-src', label: 'Plugins', desc: 'Flash, etc. (deprecated)' },
  { key: 'frame-src', label: 'Frames', desc: 'iframe sources' },
  { key: 'child-src', label: 'Children', desc: 'Workers, nested contexts' },
  { key: 'worker-src', label: 'Workers', desc: 'Web Workers' },
  { key: 'frame-ancestors', label: 'Frame Ancestors', desc: 'Embedding contexts' },
  { key: 'base-uri', label: 'Base URI', desc: 'Base URL overrides' },
  { key: 'form-action', label: 'Form Action', desc: 'Form submission targets' },
  { key: 'plugin-types', label: 'Plugin Types', desc: 'Allowed MIME types (deprecated)' },
  { key: 'upgrade-insecure-requests', label: 'Upgrade Insecure', desc: 'Auto-upgrade HTTP to HTTPS' },
  { key: 'block-all-mixed-content', label: 'Block Mixed Content', desc: 'Block HTTP resources on HTTPS pages' },
];

const DANGEROUS_TOKENS = [
  { token: "'unsafe-inline'", severity: 'high', message: 'Allows inline scripts/styles, enabling XSS attacks' },
  { token: "'unsafe-eval'", severity: 'high', message: 'Allows eval() and similar dangerous functions' },
  { token: '*', severity: 'medium', message: 'Wildcard allows all sources (extremely permissive)' },
  { token: "'unsafe-hashes'", severity: 'medium', message: 'Allows specific inline hashes (advanced, use with caution)' },
  { token: "'nonce-*'", severity: 'low', message: 'Replace with actual nonce value' },
];

/* ------------------------------------------------------------------ */
/* DOM helpers                                                         */
/* ------------------------------------------------------------------ */

function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

function show(el)  { el.style.display = 'flex'; }
function hide(el)  { el.style.display = 'none'; }

function escHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ------------------------------------------------------------------ */
/* Builder mode                                                        */
/* ------------------------------------------------------------------ */

function renderBuilderUI() {
  const container = document.getElementById('csp-builder-directives');
  if (!container) return;

  let html = '<div class="csp-directive-list" style="display: flex; flex-direction: column; gap: 0.8rem;">';

  for (const directive of KNOWN_DIRECTIVES) {
    html += `
      <div class="csp-directive-row" data-directive="${directive.key}">
        <div style="flex: 1;">
          <label style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.2rem;">${escHtml(directive.label)}</label>
          <p style="font-size: 0.75rem; color: var(--text-secondary); margin: 0;">${escHtml(directive.desc)}</p>
        </div>
        <input type="text" class="csp-directive-input input-custom glass-card" data-key="${directive.key}" placeholder="'self' https://cdn.example.com" style="flex: 2; font-family: monospace; font-size: 0.8rem;" />
      </div>
    `;
  }

  html += '</div>';
  container.innerHTML = html;
}

function generateCspHeader() {
  const directives = {};
  const inputs = $$('.csp-directive-input');

  for (const input of inputs) {
    const key = input.dataset.key;
    const value = input.value.trim();
    if (value) {
      directives[key] = value.split(/\s+/).filter(v => v);
    }
  }

  // Add special directives without values
  if ($('#csp-upgrade-insecure').checked) {
    directives['upgrade-insecure-requests'] = [];
  }
  if ($('#csp-block-mixed-content').checked) {
    directives['block-all-mixed-content'] = [];
  }

  // Build CSP string
  const parts = [];
  for (const [key, values] of Object.entries(directives)) {
    if (values.length === 0) {
      parts.push(key);
    } else {
      parts.push(`${key} ${values.join(' ')}`);
    }
  }

  return parts.join('; ');
}

function updateCspPreview() {
  const csp = generateCspHeader();
  const previewEl = document.getElementById('csp-preview-output');
  if (previewEl) {
    previewEl.textContent = csp || '// No directives configured';
  }

  // Update copy button state
  const btnCopy = document.getElementById('btn-csp-copy');
  if (btnCopy) {
    btnCopy.disabled = !csp;
  }
}

/* ------------------------------------------------------------------ */
/* Analyzer mode                                                       */
/* ------------------------------------------------------------------ */

function analyzeCsp(cspString) {
  const issues = [];
  const warnings = [];
  const info = [];

  if (!cspString || !cspString.trim()) {
    return { issues: [], warnings: [{ directive: 'General', token: '', severity: 'warning', message: 'No CSP provided' }], info: [] };
  }

  // Parse directives
  const directives = {};
  const parts = cspString.split(';').map(s => s.trim()).filter(s => s);

  for (const part of parts) {
    const spaceIdx = part.indexOf(' ');
    if (spaceIdx === -1) {
      // Directive without value
      directives[part] = [];
    } else {
      const key = part.slice(0, spaceIdx).trim();
      const values = part.slice(spaceIdx + 1).split(/\s+/).filter(v => v);
      directives[key] = values;
    }
  }

  // Check for dangerous tokens in all directives
  for (const directive of KNOWN_DIRECTIVES) {
    const values = directives[directive.key] || [];
    for (const value of values) {
      // Normalize: strip surrounding quotes to get the actual token
      let cleanValue = value;
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        cleanValue = value.slice(1, -1);
      }

      // Check against known dangerous tokens (without quotes)
      if (cleanValue === 'unsafe-inline') {
        issues.push({
          directive: directive.label,
          token: "'unsafe-inline'",
          severity: 'high',
          message: `Allows inline scripts/styles in ${directive.key}, enabling XSS attacks`
        });
      } else if (cleanValue === 'unsafe-eval') {
        issues.push({
          directive: directive.label,
          token: "'unsafe-eval'",
          severity: 'high',
          message: `Allows eval() and similar in ${directive.key}`
        });
      } else if (cleanValue === '*') {
        warnings.push({
          directive: directive.label,
          token: '*',
          severity: 'medium',
          message: `${directive.key} allows all sources (extremely permissive)`
        });
      } else if (/^nonce-/.test(cleanValue)) {
        info.push({
          directive: directive.label,
          token: cleanValue,
          severity: 'low',
          message: `Replace ${cleanValue} with actual nonce value in ${directive.key}`
        });
      }
    }
  }

  // Check for missing critical directives
  if (!directives['default-src']) {
    warnings.push({
      directive: null,
      token: 'default-src',
      severity: 'high',
      message: 'Missing default-src directive (fallback for all content types)'
    });
  }

  if (!directives['script-src'] && !directives['default-src']) {
    warnings.push({
      directive: null,
      token: 'script-src',
      severity: 'high',
      message: 'Missing script-src (scripts will fall back to default-src or be blocked)'
    });
  }

  // Check for report-uri vs report-to
  if (directives['report-uri'] && directives['report-to']) {
    warnings.push({
      directive: null,
      token: 'both',
      severity: 'medium',
      message: 'Both report-uri and report-to specified; report-to takes precedence'
    });
  }

  return { issues, warnings, info };
}

function displayAnalysisResult(result) {
  const container = document.getElementById('csp-analysis-output');
  if (!container) return;

  let html = '';

  // Issues (red)
  if (result.issues.length > 0) {
    html += `<div style="margin-bottom: 1rem;">`;
    html += `<h4 style="color: #ef4444; margin: 0 0 0.5rem 0;">🚨 Issues (${result.issues.length})</h4>`;
    for (const issue of result.issues) {
      html += `<div style="padding: 0.5rem; background: rgba(239,68,68,.1); border-radius: var(--radius-sm); margin-bottom: 0.3rem;">`;
      html += `<strong>${escHtml(issue.directive || 'General')}</strong>: ${escHtml(issue.message)}`;
      html += `</div>`;
    }
    html += `</div>`;
  }

  // Warnings (yellow)
  if (result.warnings.length > 0) {
    html += `<div style="margin-bottom: 1rem;">`;
    html += `<h4 style="color: #f59e0b; margin: 0 0 0.5rem 0;">⚠️ Warnings (${result.warnings.length})</h4>`;
    for (const warning of result.warnings) {
      html += `<div style="padding: 0.5rem; background: rgba(245,158,11,.1); border-radius: var(--radius-sm); margin-bottom: 0.3rem;">`;
      html += `<strong>${escHtml(warning.directive || 'General')}</strong>: ${escHtml(warning.message)}`;
      html += `</div>`;
    }
    html += `</div>`;
  }

  // Info (blue)
  if (result.info.length > 0) {
    html += `<div style="margin-bottom: 1rem;">`;
    html += `<h4 style="color: #3b82f6; margin: 0 0 0.5rem 0;">ℹ️ Info (${result.info.length})</h4>`;
    for (const item of result.info) {
      html += `<div style="padding: 0.5rem; background: rgba(59,130,246,.1); border-radius: var(--radius-sm); margin-bottom: 0.3rem;">`;
      html += `<strong>${escHtml(item.directive || 'General')}</strong>: ${escHtml(item.message)}`;
      html += `</div>`;
    }
    html += `</div>`;
  }

  if (result.issues.length === 0 && result.warnings.length === 0 && result.info.length === 0) {
    html = `<p style="color: #22c55e;">✅ CSP looks good! No issues found.</p>`;
  }

  container.innerHTML = html;
}

/* ------------------------------------------------------------------ */
/* Mode switching                                                      */
/* ------------------------------------------------------------------ */

function setMode(mode) {
  currentMode = mode;
  document.querySelectorAll('.csp-mode-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.mode === mode);
  });

  const builderPanel = document.getElementById('csp-builder-panel');
  const analyzerPanel = document.getElementById('csp-analyzer-panel');

  if (builderPanel) builderPanel.style.display = mode === 'builder' ? 'block' : 'none';
  if (analyzerPanel) analyzerPanel.style.display = mode === 'analyzer' ? 'block' : 'none';
}

/* ------------------------------------------------------------------ */
/* Reset state                                                         */
/* ------------------------------------------------------------------ */

function resetCspToolState() {
  currentMode = 'builder';

  // Clear builder inputs
  const inputs = $$('.csp-directive-input');
  for (const input of inputs) {
    input.value = '';
  }

  // Clear analyzer textarea
  const textarea = document.getElementById('csp-analyzer-input');
  if (textarea) textarea.value = '';

  // Clear outputs
  const previewEl = document.getElementById('csp-preview-output');
  if (previewEl) previewEl.textContent = '// No directives configured';

  const analysisOutput = document.getElementById('csp-analysis-output');
  if (analysisOutput) analysisOutput.innerHTML = '';

  setMode('builder');
}

/* ------------------------------------------------------------------ */
/* Event wiring                                                        */
/* ------------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
  // Mode tabs
  document.querySelectorAll('.csp-mode-tab').forEach(tab => {
    tab.addEventListener('click', () => setMode(tab.dataset.mode));
  });

  // Builder: generate button
  const btnGenerate = document.getElementById('btn-csp-generate');
  if (btnGenerate) {
    btnGenerate.addEventListener('click', () => {
      updateCspPreview();
    });
  }

  // Builder: live preview on input
  $$('.csp-directive-input').forEach(input => {
    input.addEventListener('input', updateCspPreview);
  });

  // Analyzer: analyze button
  const btnAnalyze = document.getElementById('btn-csp-analyze');
  if (btnAnalyze) {
    btnAnalyze.addEventListener('click', () => {
      const cspString = $('#csp-analyzer-input').value;
      const result = analyzeCsp(cspString);
      displayAnalysisResult(result);
    });
  }

  // Copy button
  const btnCopy = document.getElementById('btn-csp-copy');
  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      const csp = generateCspHeader();
      if (!csp) return;

      navigator.clipboard.writeText(csp).then(() => {
        const original = btnCopy.textContent;
        btnCopy.textContent = '✓ Copied!';
        setTimeout(() => { btnCopy.textContent = original; }, 1500);
      });
    });
  }

  // Back button
  const btnBack = document.getElementById('btn-csp-back');
  if (btnBack) {
    btnBack.addEventListener('click', () => navigateTo('home'));
  }

  // Initial state
  renderBuilderUI();
  resetCspToolState();
});

// Expose for navigation integration
window.resetCspToolState = resetCspToolState;
