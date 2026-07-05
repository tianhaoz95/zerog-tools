// ZeroG Toolbox — Subresource Integrity (SRI) Hash Generator
// Compute SHA-384/512 hashes for JS/CSS files and output ready-to-paste
// <script integrity="..."> / <link integrity="..."> HTML snippets.

export {}; // Make this a module so Vite includes it

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

let currentMode = 'paste'; // 'paste' | 'upload'

const SRI_ALGORITHMS = [
  { name: 'SHA-384', label: 'sha384', bytesPerLine: 52 },
  { name: 'SHA-512', label: 'sha512', bytesPerLine: 68 }
];

/* ------------------------------------------------------------------ */
/* DOM helpers                                                         */
/* ------------------------------------------------------------------ */

function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

function escHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ------------------------------------------------------------------ */
/* SRI Hash Computation                                                */
/* ------------------------------------------------------------------ */

async function computeSriHashes(data, filename) {
  // Convert text to ArrayBuffer for hashing
  const encoder = new TextEncoder();
  const dataBuffer = typeof data === 'string' ? encoder.encode(data) : await readFileToArrayBuffer(data);

  if (!dataBuffer || dataBuffer.byteLength === 0) {
    return null;
  }

  const results = {};

  for (const algo of SRI_ALGORITHMS) {
    try {
      // Compute hash using WebCrypto Subtle API
      const hashBuffer = await crypto.subtle.digest(algo.name, dataBuffer);

      // Convert ArrayBuffer to base64 string
      const bytes = new Uint8Array(hashBuffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64Hash = btoa(binary);

      // Format with line breaks every N characters for readability
      results[algo.label] = formatBase64WithBreaks(base64Hash, algo.bytesPerLine);
    } catch (err) {
      console.error(`Failed to compute ${algo.name} hash:`, err);
      results[algo.label] = null;
    }
  }

  return results;
}

function readFileToArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(new Uint8Array(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

function formatBase64WithBreaks(base64String, bytesPerLine) {
  // Insert line breaks every N characters for readability
  const lines = [];
  for (let i = 0; i < base64String.length; i += bytesPerLine) {
    lines.push(base64String.slice(i, i + bytesPerLine));
  }
  return lines.join('\n');
}

/* ------------------------------------------------------------------ */
/* UI Rendering                                                        */
/* ------------------------------------------------------------------ */

function renderSnippets(filename, hashes) {
  const outputContainer = document.getElementById('sri-snippet-output');
  if (!outputContainer || !hashes) return;

  let html = '';

  for (const algo of SRI_ALGORITHMS) {
    const hashValue = hashes[algo.label];
    if (!hashValue) continue;

    // Generate script snippet (for JS files)
    const scriptSnippet = `<script src="${escHtml(filename)}" integrity="sha384-${hashes.sha384}" crossorigin="anonymous"></script>\n<script src="${escHtml(filename)}" integrity="sha512-${hashes.sha512}" crossorigin="anonymous"></script>`;

    // Generate link snippet (for CSS files)
    const linkSnippet = `<link rel="stylesheet" href="${escHtml(filename)}" integrity="sha384-${hashes.sha384}" crossorigin="anonymous">\n<link rel="stylesheet" href="${escHtml(filename)}" integrity="sha512-${hashes.sha512}" crossorigin="anonymous">`;

    html += `
      <div class="sri-snippet-section" style="margin-bottom: 1.5rem;">
        <h4 style="color: #3b82f6; margin: 0 0 0.5rem 0;">📦 For JavaScript Files</h4>
        <textarea readonly class="input-custom glass-card sri-snippet-textarea" style="font-family: monospace; font-size: 0.75rem; resize: none;">${escHtml(scriptSnippet)}</textarea>
        <button class="btn btn-ghost btn-sm mt-1 copy-btn" data-copy-id="${algo.label}-script">📋 Copy Script Snippet</button>
      </div>

      <div class="sri-snippet-section" style="margin-bottom: 1.5rem;">
        <h4 style="color: #3b82f6; margin: 0 0 0.5rem 0;">🎨 For CSS Stylesheets</h4>
        <textarea readonly class="input-custom glass-card sri-snippet-textarea" style="font-family: monospace; font-size: 0.75rem; resize: none;">${escHtml(linkSnippet)}</textarea>
        <button class="btn btn-ghost btn-sm mt-1 copy-btn" data-copy-id="${algo.label}-link">📋 Copy Link Snippet</button>
      </div>

      <!-- SHA Details -->
      <div style="background: rgba(59,130,246,.08); padding: 1rem; border-radius: var(--radius-md); font-size: 0.8rem;">
        <h5 style="margin: 0 0 0.5rem 0; color: #3b82f6;">Hash Details</h5>
        <p style="margin: 0;"><strong>${algo.name} Hash:</strong></p>
        <pre class="sri-hash-display" style="font-family: monospace; font-size: 0.7rem; background: rgba(0,0,0,.3); padding: 0.5rem; border-radius: var(--radius-sm); margin-top: 0.3rem;">sha${algo.label}=${hashValue}</pre>
      </div>
    `;
  }

  outputContainer.innerHTML = html || '<p style="color: #ef4444;">Failed to compute hashes. Please try again.</p>';

  // Attach copy event listeners
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => handleCopySnippet(btn.dataset.copyId));
  });
}

function handleCopySnippet(copyId) {
  const textarea = $(`.sri-snippet-textarea[data-copy-id="${copyId}"]`);
  if (!textarea) return;

  // Select the text and copy to clipboard
  navigator.clipboard.writeText(textarea.value).then(() => {
    // Show feedback
    const btn = document.querySelector(`.copy-btn[data-copy-id="${copyId}"]`);
    if (btn) {
      const originalText = btn.textContent;
      btn.textContent = '✓ Copied!';
      setTimeout(() => { btn.textContent = originalText; }, 1500);
    }
  }).catch(err => {
    console.error('Copy failed:', err);
    // Fallback: select text manually
    textarea.select();
    document.execCommand('copy');
  });
}

/* ------------------------------------------------------------------ */
/* Mode Switching                                                      */
/* ------------------------------------------------------------------ */

function setMode(mode) {
  currentMode = mode;
  document.querySelectorAll('.sri-mode-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.mode === mode);
  });

  const pastePanel = document.getElementById('sri-paste-panel');
  const uploadPanel = document.getElementById('sri-upload-panel');

  if (pastePanel) pastePanel.style.display = mode === 'paste' ? 'block' : 'none';
  if (uploadPanel) uploadPanel.style.display = mode === 'upload' ? 'flex' : 'none';
  
  // Debug logging
  console.log('[SRI Tool] setMode called with:', mode);
  console.log('[SRI Tool] Upload panel display:', uploadPanel?.style.display);
}

/* ------------------------------------------------------------------ */
/* Event Handlers                                                      */
/* ------------------------------------------------------------------ */

async function handleGenerateHash() {
  try {
    updateStatus('Computing hashes...', 'info');

    let data;
    if (currentMode === 'paste') {
      const text = $('#sri-paste-input').value;
      if (!text.trim()) {
        updateStatus('Please paste some content first.', 'warning');
        return;
      }
      data = text;
    } else {
      const fileInput = document.getElementById('sri-file-upload');
      const file = fileInput.files[0];
      if (!file) {
        updateStatus('Please select a file to upload.', 'warning');
        return;
      }
      data = file;
    }

    // Compute hashes
    const filename = currentMode === 'paste' ? 'file.js' : $('#sri-filename-input').value || 'file.js';
    const hashes = await computeSriHashes(data, filename);

    if (!hashes) {
      updateStatus('Failed to compute hashes. Please try again.', 'error');
      return;
    }

    // Render snippets
    renderSnippets(filename, hashes);
    updateStatus('Hashes computed successfully!', 'success');
  } catch (err) {
    console.error('Error computing SRI hashes:', err);
    updateStatus(`Error: ${err.message}`, 'error');
  }
}

function handleFileUpload() {
  const fileInput = document.getElementById('sri-file-upload');
  const fileNameDisplay = $('#sri-filename-display');

  if (fileInput.files.length > 0) {
    const filename = fileInput.files[0].name;
    fileNameDisplay.textContent = `Selected: ${escHtml(filename)}`;
  } else {
    fileNameDisplay.textContent = 'No file selected';
  }
}

/* ------------------------------------------------------------------ */
/* Status Display                                                      */
/* ------------------------------------------------------------------ */

function updateStatus(message, type) {
  const banner = document.getElementById('sri-status');
  if (!banner) return;

  banner.textContent = message;
  banner.style.display = 'block';
  banner.className = `sri-banner sri-banner--${type}`;
}

/* ------------------------------------------------------------------ */
/* Reset State                                                         */
/* ------------------------------------------------------------------ */

function resetSriToolState() {
  currentMode = 'paste';

  // Clear paste input
  const pasteInput = document.getElementById('sri-paste-input');
  if (pasteInput) pasteInput.value = '';

  // Clear file upload
  const fileInput = document.getElementById('sri-file-upload');
  if (fileInput) fileInput.value = '';

  // Clear filename input
  const filenameInput = document.getElementById('sri-filename-input');
  if (filenameInput) filenameInput.value = 'file.js';

  // Clear snippet output
  const outputContainer = document.getElementById('sri-snippet-output');
  if (outputContainer) outputContainer.innerHTML = '';

  // Clear status banner
  const statusBanner = document.getElementById('sri-status');
  if (statusBanner) {
    statusBanner.style.display = 'none';
    statusBanner.textContent = '';
  }

  setMode('paste');
}

/* ------------------------------------------------------------------ */
/* Event Wiring                                                        */
/* ------------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
  // Mode tabs
  document.querySelectorAll('.sri-mode-tab').forEach(tab => {
    tab.addEventListener('click', () => setMode(tab.dataset.mode));
  });

  // Generate button
  const btnGenerate = document.getElementById('btn-sri-generate');
  if (btnGenerate) {
    btnGenerate.addEventListener('click', handleGenerateHash);
  }

  // File upload handler
  const fileInput = document.getElementById('sri-file-upload');
  if (fileInput) {
    fileInput.addEventListener('change', handleFileUpload);
  }

  // Back button
  const btnBack = document.getElementById('btn-sri-hash-generator-back');
  if (btnBack) {
    btnBack.addEventListener('click', () => navigateTo('home'));
  }

  // Initial state
  resetSriToolState();
});

// Expose for navigation integration
window.resetSriToolState = resetSriToolState;
