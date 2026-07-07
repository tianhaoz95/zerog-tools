// Markdown to HTML Converter — client-side tool for converting Markdown to HTML
// No server round-trips; uses marked.js library loaded from CDN for parsing

const MARKDOWN_CONFIG = {
  // marked.js options for safe rendering
  MATHJAX: false,
  BREAKS: true,
};

// Initialize the Markdown to HTML Converter tool
function initMarkdownToHtml() {
  const inputField = document.getElementById('md-input');
  const outputArea = document.getElementById('md-output');
  const btnConvert = document.getElementById('btn-convert-md');
  const btnCopy = document.getElementById('btn-copy-html');

  if (!inputField || !outputArea || !btnConvert) return;

  // Convert button handler
  btnConvert.addEventListener('click', handleConvert);

  // Copy HTML button handler (if exists)
  if (btnCopy) {
    btnCopy.addEventListener('click', handleCopyHtml);
  }

  // Live preview - convert on input change with debounce
  let timeout;
  inputField.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => handleConvert(), 300);
  });
}

async function handleConvert() {
  const inputField = document.getElementById('md-input');
  const outputArea = document.getElementById('md-output');

  if (!inputField || !outputArea) return;

  const markdownText = inputField.value.trim();
  if (!markdownText) {
    showStatus('Please enter Markdown text to convert.', 'error');
    return;
  }

  try {
    // Check if marked.js is loaded
    if (typeof marked === 'undefined') {
      throw new Error('Markdown parser library not loaded. Please refresh the page.');
    }

    // Configure marked options
    marked.setOptions({
      breaks: MARKDOWN_CONFIG.BREAKS,
      gfm: true, // GitHub Flavored Markdown
    });

    // Convert Markdown to HTML
    const html = marked.parse(markdownText);

    // Display output
    outputArea.value = html;
    showStatus('Converted successfully!', 'success');

  } catch (err) {
    showStatus(`Conversion error: ${err.message}`, 'error');
  }
}

async function handleCopyHtml() {
  const outputArea = document.getElementById('md-output');
  if (!outputArea || !outputArea.value) return;

  try {
    await navigator.clipboard.writeText(outputArea.value);
    showStatus('HTML copied to clipboard!', 'success');
  } catch (err) {
    // Fallback for older browsers
    outputArea.select();
    document.execCommand('copy');
    showStatus('HTML copied to clipboard!', 'success');
  }
}

function showStatus(message, type = 'info') {
  const statusEl = document.getElementById('md-status');
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.className = `glass-card json-formatter-banner ${type}`;
  statusEl.style.display = 'block';
}

// Export for use by main.js navigation handler
if (typeof window !== 'undefined') {
  window.initMarkdownToHtml = initMarkdownToHtml;
}
