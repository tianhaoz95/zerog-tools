// JSON Pretty Printer & Minifier — client-side tool for formatting and minifying JSON
// No server round-trips; all processing happens in-browser

const JSON_FORMAT_CONFIG = {
  DEFAULT_INDENT: 2,
};

// Validate JSON syntax
function validateJSON(jsonStr) {
  try {
    JSON.parse(jsonStr);
    return { valid: true, error: null };
  } catch (err) {
    return { valid: false, error: err.message };
  }
}

// Pretty print JSON with indentation
function prettyPrintJSON(jsonStr, indent = 2) {
  try {
    const parsed = JSON.parse(jsonStr);
    return JSON.stringify(parsed, null, indent);
  } catch (err) {
    throw new Error(`Invalid JSON: ${err.message}`);
  }
}

// Minify JSON (remove all whitespace)
function minifyJSON(jsonStr) {
  try {
    const parsed = JSON.parse(jsonStr);
    return JSON.stringify(parsed);
  } catch (err) {
    throw new Error(`Invalid JSON: ${err.message}`);
  }
}

// Initialize the JSON Pretty Printer & Minifier tool
function initJsonPrettyPrinter() {
  const jsonInput = document.getElementById('json-input');
  const fileUpload = document.getElementById('json-file-upload');
  const btnPrettyPrint = document.getElementById('btn-pretty-print');
  const btnMinify = document.getElementById('btn-minify');
  const outputArea = document.getElementById('json-output');

  if (!jsonInput || !fileUpload || !btnPrettyPrint || !btnMinify || !outputArea) return;

  // File upload handler
  fileUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      jsonInput.value = event.target.result;
      showStatus(`Loaded ${file.name}`, 'success');
    };
    reader.onerror = () => {
      showStatus('Error reading file', 'error');
    };
    reader.readAsText(file);
  });

  // Pretty Print button handler
  btnPrettyPrint.addEventListener('click', handlePrettyPrint);

  // Minify button handler
  btnMinify.addEventListener('click', handleMinify);
}

async function handlePrettyPrint() {
  const jsonInput = document.getElementById('json-input');
  const outputArea = document.getElementById('json-output');
  const indentSelect = document.getElementById('indent-select');

  if (!jsonInput || !outputArea) return;

  const jsonStr = jsonInput.value.trim();
  if (!jsonStr) {
    showStatus('Please enter JSON data or upload a file.', 'error');
    return;
  }

  try {
    // Validate first
    const validation = validateJSON(jsonStr);
    if (!validation.valid) {
      showStatus(`Invalid JSON: ${validation.error}`, 'error');
      return;
    }

    // Get indent level (default to 2 spaces)
    const indent = parseInt(indentSelect?.value || '2', 10);

    // Pretty print with indentation
    const result = prettyPrintJSON(jsonStr, indent);

    // Display output
    outputArea.value = result;
    showStatus('Formatted successfully!', 'success');

  } catch (err) {
    showStatus(`Formatting error: ${err.message}`, 'error');
  }
}

async function handleMinify() {
  const jsonInput = document.getElementById('json-input');
  const outputArea = document.getElementById('json-output');

  if (!jsonInput || !outputArea) return;

  const jsonStr = jsonInput.value.trim();
  if (!jsonStr) {
    showStatus('Please enter JSON data or upload a file.', 'error');
    return;
  }

  try {
    // Validate first
    const validation = validateJSON(jsonStr);
    if (!validation.valid) {
      showStatus(`Invalid JSON: ${validation.error}`, 'error');
      return;
    }

    // Minify (remove all whitespace)
    const result = minifyJSON(jsonStr);

    // Display output
    outputArea.value = result;
    showStatus('Minified successfully!', 'success');

  } catch (err) {
    showStatus(`Minification error: ${err.message}`, 'error');
  }
}

function showStatus(message, type = 'info') {
  const statusEl = document.getElementById('json-status');
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.className = `glass-card json-formatter-banner ${type}`;
  statusEl.style.display = 'block';
}

// Export for use by main.js navigation handler
if (typeof window !== 'undefined') {
  window.initJsonPrettyPrinter = initJsonPrettyPrinter;
}
