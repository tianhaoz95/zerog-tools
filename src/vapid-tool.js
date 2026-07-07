export {}; // Make this a module so Vite includes it

// ZeroG Toolbox — Web Push VAPID Key Pair Generator
// Generate P-256 ECDH key pairs via WebCrypto for Web Push setup.
// Outputs URL-safe base64 public/private VAPID keys ready for service worker registration.

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

let currentKeyPair = null; // { publicKey, privateKey } in URL-safe base64

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
/* VAPID Key Generation                                                */
/* ------------------------------------------------------------------ */

async function generateVapidKeys() {
  try {
    updateStatus('Generating P-256 ECDH key pair...', 'info');

    // Generate P-256 ECDH key pair using WebCrypto
    const keyPair = await crypto.subtle.generateKey(
      { name: 'ECDH', namedCurve: 'P-256' },
      true, // extractable
      ['deriveBits']
    );

    // Export keys as raw bytes
    const publicKeyRaw = await crypto.subtle.exportKey('raw', keyPair.publicKey);
    const privateKeyRaw = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

    // Convert to URL-safe base64 (VAPID standard)
    const publicKeyB64 = arrayBufferToUrlSafeBase64(publicKeyRaw);
    const privateKeyB64 = arrayBufferToUrlSafeBase64(privateKeyRaw);

    currentKeyPair = { publicKey: publicKeyB64, privateKey: privateKeyB64 };

    // Display keys
    $('#vapid-public-key-output').value = publicKeyB64;
    $('#vapid-private-key-output').value = privateKeyB64;

    updateStatus('VAPID key pair generated successfully!', 'success');
  } catch (err) {
    updateStatus(`Key generation failed: ${err.message}`, 'error');
  }
}

/* ------------------------------------------------------------------ */
/* Base64 utilities                                                    */
/* ------------------------------------------------------------------ */

function arrayBufferToUrlSafeBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  // Standard base64, then make URL-safe by replacing + with - and / with _
  const standardB64 = btoa(binary);
  return standardB64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function urlSafeBase64ToArrayBuffer(base64) {
  // Restore padding and standard characters
  let standardB64 = base64.replace(/-/g, '+').replace(/_/g, '/');
  const padding = (4 - (standardB64.length % 4)) % 4;
  if (padding) standardB64 += '='.repeat(padding);

  const binary = atob(standardB64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/* ------------------------------------------------------------------ */
/* Status display                                                      */
/* ------------------------------------------------------------------ */

function updateStatus(message, type) {
  const banner = document.getElementById('vapid-status');
  if (!banner) return;

  banner.textContent = message;
  banner.style.display = 'block';
  banner.className = `vapid-banner vapid-banner--${type}`;
}

/* ------------------------------------------------------------------ */
/* Copy functionality                                                  */
/* ------------------------------------------------------------------ */

async function copyToClipboard(text, btnId) {
  try {
    await navigator.clipboard.writeText(text);
    const btn = document.getElementById(btnId);
    if (btn) {
      const original = btn.textContent;
      btn.textContent = '✓ Copied!';
      setTimeout(() => { btn.textContent = original; }, 1500);
    }
  } catch (err) {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    updateStatus('Copied to clipboard!', 'success');
  }
}

/* ------------------------------------------------------------------ */
/* Reset state                                                         */
/* ------------------------------------------------------------------ */

function resetVapidToolState() {
  currentKeyPair = null;

  // Clear outputs
  const publicKeyEl = document.getElementById('vapid-public-key-output');
  const privateKeyEl = document.getElementById('vapid-private-key-output');
  if (publicKeyEl) publicKeyEl.value = '';
  if (privateKeyEl) privateKeyEl.value = '';

  // Clear status banner
  const statusBanner = document.getElementById('vapid-status');
  if (statusBanner) {
    statusBanner.style.display = 'none';
    statusBanner.textContent = '';
  }
}

/* ------------------------------------------------------------------ */
/* Event wiring                                                        */
/* ------------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
  // Generate button
  const btnGenerate = document.getElementById('btn-vapid-generate');
  if (btnGenerate) {
    btnGenerate.addEventListener('click', generateVapidKeys);
  }

  // Copy buttons
  const btnCopyPub = document.getElementById('btn-vapid-copy-pub');
  if (btnCopyPub) {
    btnCopyPub.addEventListener('click', () => {
      const text = $('#vapid-public-key-output').value;
      copyToClipboard(text, 'btn-vapid-copy-pub');
    });
  }

  const btnCopyPriv = document.getElementById('btn-vapid-copy-priv');
  if (btnCopyPriv) {
    btnCopyPriv.addEventListener('click', () => {
      const text = $('#vapid-private-key-output').value;
      copyToClipboard(text, 'btn-vapid-copy-priv');
    });
  }

  // Back button
  const btnBack = document.getElementById('btn-vapid-keygen-back');
  if (btnBack) {
    btnBack.addEventListener('click', () => navigateTo('home'));
  }

  // Initial state
  resetVapidToolState();
});

// Expose for navigation integration
window.resetVapidToolState = resetVapidToolState;
