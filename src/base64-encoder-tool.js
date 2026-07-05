// Base64 Encoder/Decoder — client-side tool for encoding/decoding text and files
// No server round-trips; all processing happens in-browser using Web APIs

const BASE64_CONFIG = {
  LINE_LENGTH: 76, // Standard line length for base64 output
};

// Encode string to Base64
function encodeBase64(text) {
  try {
    if (typeof text !== 'string') {
      throw new Error('Input must be a string');
    }
    return btoa(unescape(encodeURIComponent(text)));
  } catch (err) {
    throw new Error(`Encoding error: ${err.message}`);
  }
}

// Decode Base64 to string
function decodeBase64(base64Str) {
  try {
    if (typeof base64Str !== 'string') {
      throw new Error('Input must be a string');
    }

    // Remove whitespace and validate format
    const cleaned = base64Str.replace(/\s+/g, '');
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleaned)) {
      throw new Error('Invalid Base64 format');
    }

    return decodeURIComponent(escape(atob(cleaned)));
  } catch (err) {
    throw new Error(`Decoding error: ${err.message}`);
  }
}

// Encode file to Base64
async function encodeFileToBase64(file, includeType = true) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      let result = e.target.result;

      // Remove data URL prefix if present and optionally add it back
      if (includeType && result.startsWith('data:')) {
        resolve(result); // Keep the full data URL format
      } else {
        const base64 = result.split(',')[1] || result;
        resolve(base64);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

// Decode Base64 and download as file
function decodeBase64ToFile(base64Str, filename = 'decoded-file') {
  try {
    let content;
    let mimeType = '';

    // Check if it's a data URL or plain base64
    if (base64Str.startsWith('data:')) {
      const parts = base64Str.split(',');
      mimeType = parts[0].split(':')[1].split(';')[0];
      content = parts[1] || '';
    } else {
      // Plain base64 - assume UTF-8 text
      mimeType = 'text/plain';
      content = base64Str;
    }

    const byteCharacters = atob(content);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Create blob and download
    const blob = new Blob([byteArray], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return true;
  } catch (err) {
    throw new Error(`File decode error: ${err.message}`);
  }
}

// Format Base64 output with line breaks for readability
function formatBase64Output(base64Str, lineLength = BASE64_CONFIG.LINE_LENGTH) {
  const cleaned = base64Str.replace(/\s+/g, '');
  return cleaned.match(new RegExp(`.{1,${lineLength}}`, 'g')).join('\n');
}

// Initialize the Base64 Encoder/Decoder tool
function initBase64Encoder() {
  const inputField = document.getElementById('b64-input');
  const fileUpload = document.getElementById('b64-file-upload');
  const btnEncode = document.getElementById('btn-encode-base64');
  const btnDecode = document.getElementById('btn-decode-base64');
  const outputArea = document.getElementById('b64-output');

  if (!inputField || !fileUpload || !btnEncode || !btnDecode || !outputArea) return;

  // File upload handler
  fileUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    encodeFileToBase64(file).then(base64Str => {
      inputField.value = base64Str;
      showStatus(`Loaded ${file.name} as Base64`, 'success');
    }).catch(err => {
      showStatus(`Error: ${err.message}`, 'error');
    });
  });

  // Encode button handler
  btnEncode.addEventListener('click', handleEncode);

  // Decode button handler
  btnDecode.addEventListener('click', handleDecode);
}

async function handleEncode() {
  const inputField = document.getElementById('b64-input');
  const outputArea = document.getElementById('b64-output');

  if (!inputField || !outputArea) return;

  const text = inputField.value.trim();
  if (!text) {
    showStatus('Please enter text or upload a file to encode.', 'error');
    return;
  }

  try {
    // Check if it looks like Base64 (already encoded) - just format it
    if (/^[A-Za-z0-9+/=]+$/.test(text.replace(/\s/g, ''))) {
      const formatted = formatBase64Output(text);
      outputArea.value = formatted;
      showStatus('Text is already in Base64 format (formatted for readability)', 'info');
    } else {
      // Encode the text
      const encoded = encodeBase64(text);
      const formatted = formatBase64Output(encoded);
      outputArea.value = formatted;
      showStatus('Encoded successfully!', 'success');
    }

  } catch (err) {
    showStatus(`Encoding error: ${err.message}`, 'error');
  }
}

async function handleDecode() {
  const inputField = document.getElementById('b64-input');
  const outputArea = document.getElementById('b64-output');

  if (!inputField || !outputArea) return;

  const base64Str = inputField.value.trim();
  if (!base64Str) {
    showStatus('Please enter Base64 data to decode.', 'error');
    return;
  }

  try {
    // Check if it's a data URL (file upload result)
    if (base64Str.startsWith('data:')) {
      const decoded = await decodeFileFromBase64(base64Str);
      outputArea.value = decoded;
      showStatus('Decoded from Base64 file!', 'success');
    } else {
      // Decode plain Base64
      const decoded = decodeBase64(base64Str);
      outputArea.value = decoded;
      showStatus('Decoded successfully!', 'success');
    }

  } catch (err) {
    showStatus(`Decoding error: ${err.message}`, 'error');
  }
}

// Helper function to decode Base64 file content
async function decodeFileFromBase64(base64Str) {
  try {
    const parts = base64Str.split(',');
    if (parts.length < 2) throw new Error('Invalid data URL format');

    const byteCharacters = atob(parts[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Convert to text (assuming UTF-8)
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(byteArray);
  } catch (err) {
    throw new Error(`File decode error: ${err.message}`);
  }
}

function showStatus(message, type = 'info') {
  const statusEl = document.getElementById('b64-status');
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.className = `glass-card json-formatter-banner ${type}`;
  statusEl.style.display = 'block';
}

// Export for use by main.js navigation handler
if (typeof window !== 'undefined') {
  window.initBase64Encoder = initBase64Encoder;
}
