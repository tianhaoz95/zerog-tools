// ZeroG Toolbox — PGP/GPG Message Encryptor & Decryptor
// Client-side PGP encryptor/decryptor/signer using WebCrypto APIs.
// Generates RSA key pairs, encrypts messages with public keys, decrypts with private keys,
// signs/verifies messages using RSA-PSS. All operations happen in-browser.

export {}; // Make this a module so Vite includes it
console.log('[PGP Tool] Module loaded!');

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

let currentMode = 'encrypt'; // 'keygen' | 'encrypt' | 'decrypt' | 'sign' | 'verify'

const KEY_ALGORITHM = { name: 'RSA-OAEP', hash: 'SHA-256' };
const SIGN_ALGORITHM = { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' };

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
/* Crypto utilities                                                    */
/* ------------------------------------------------------------------ */

async function generateKeyPair() {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error('WebCrypto API not available in this browser');
  }

  try {
    updateStatus('Generating RSA key pair (2048-bit)...', 'info');
    const keyPair = await crypto.subtle.generateKey(
      { name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
      true, // extractable: true (needed to export keys)
      ['encrypt', 'decrypt']
    );

    const publicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    const privateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

    return {
      publicKey: arrayBufferToBase64(publicKey),
      privateKey: arrayBufferToBase64(privateKey),
      keyPair
    };
  } catch (err) {
    updateStatus(`Key generation failed: ${err.message}`, 'error');
    throw err;
  }
}

async function importPublicKey(spkiBase64) {
  const spki = base64ToArrayBuffer(spkiBase64);
  return crypto.subtle.importKey(
    'spki',
    spki,
    KEY_ALGORITHM,
    false,
    ['encrypt']
  );
}

async function importPrivateKey(pkcs8Base64) {
  const pkcs8 = base64ToArrayBuffer(pkcs8Base64);
  return crypto.subtle.importKey(
    'pkcs8',
    pkcs8,
    KEY_ALGORITHM,
    false,
    ['decrypt']
  );
}

async function encryptMessage(message, publicKey) {
  // Generate a random AES key for the message
  const aesKey = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  // Wrap the AES key with RSA-OAEP
  const wrappedKey = await crypto.subtle.wrapKey('raw', aesKey, publicKey, KEY_ALGORITHM);

  // Encrypt the message with AES-GCM
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const encryptedData = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    data
  );

  // Return combined format: [wrappedKey][iv][encryptedData]
  return new Uint8Array([
    ...new Uint8Array(wrappedKey),
    ...iv,
    ...new Uint8Array(encryptedData)
  ]);
}

async function decryptMessage(combinedData, privateKey) {
  // Parse the combined data
  const wrappedKeyLen = 256; // RSA-2048 wrapped key size
  const ivLen = 12;

  if (combinedData.length < wrappedKeyLen + ivLen) {
    throw new Error('Invalid encrypted data format');
  }

  const wrappedKey = combinedData.slice(0, wrappedKeyLen);
  const iv = combinedData.slice(wrappedKeyLen, wrappedKeyLen + ivLen);
  const encryptedData = combinedData.slice(wrappedKeyLen + ivLen);

  // Unwrap the AES key with RSA-OAEP
  const aesKey = await crypto.subtle.unwrapKey(
    'raw',
    wrappedKey,
    privateKey,
    KEY_ALGORITHM,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  // Decrypt the message with AES-GCM
  const decryptedData = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    encryptedData
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedData);
}

async function signMessage(message, privateKey) {
  // Hash the message with SHA-256
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hash = await crypto.subtle.digest('SHA-256', data);

  // Sign the hash with RSA-PSS
  const signature = await crypto.subtle.sign(SIGN_ALGORITHM, privateKey, hash);

  return {
    message: arrayBufferToBase64(data),
    signature: arrayBufferToBase64(signature)
  };
}

async function verifyMessage(message, signature, publicKey) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const sig = base64ToArrayBuffer(signature);

    const isValid = await crypto.subtle.verify(SIGN_ALGORITHM, publicKey, sig, hash);
    return isValid;
  } catch (err) {
    console.error('Verification failed:', err);
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Base64 utilities                                                    */
/* ------------------------------------------------------------------ */

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
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
  const banner = document.getElementById('pgp-status');
  if (!banner) return;

  banner.textContent = message;
  banner.style.display = 'block';
  banner.className = `pgp-banner pgp-banner--${type}`;
}

/* ------------------------------------------------------------------ */
/* Mode switching                                                      */
/* ------------------------------------------------------------------ */

function setMode(mode) {
  currentMode = mode;
  document.querySelectorAll('.pgp-mode-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.mode === mode);
  });

  const panels = ['keygen-panel', 'encrypt-panel', 'decrypt-panel', 'sign-panel', 'verify-panel'];
  for (const panel of panels) {
    const el = document.getElementById(panel);
    if (el) {
      el.style.display = mode === panel.replace('-panel', '') ? 'flex' : 'none';
    }
  }
}

/* ------------------------------------------------------------------ */
/* Key generation UI                                                   */
/* ------------------------------------------------------------------ */

async function handleKeyGen() {
  console.log('[PGP Tool] handleKeyGen called');
  try {
    const result = await generateKeyPair();
    console.log('[PGP Tool] Key pair generated, updating outputs');
    $('#pgp-public-key-output').value = result.publicKey;
    $('#pgp-private-key-output').value = result.privateKey;
    updateStatus('Key pair generated successfully!', 'success');
  } catch (err) {
    console.error('[PGP Tool] handleKeyGen error:', err);
    // Error already shown in generateKeyPair
  }
}

/* ------------------------------------------------------------------ */
/* Encryption UI                                                       */
/* ------------------------------------------------------------------ */

async function handleEncrypt() {
  try {
    const publicKeyB64 = $('#pgp-encrypt-public-key').value.trim();
    const message = $('#pgp-encrypt-message').value;

    if (!publicKeyB64 || !message) {
      updateStatus('Please provide both public key and message', 'warning');
      return;
    }

    const publicKey = await importPublicKey(publicKeyB64);
    const encrypted = await encryptMessage(message, publicKey);

    // Convert to base64 for display
    const encryptedBase64 = arrayBufferToBase64(encrypted.buffer);
    $('#pgp-encrypt-output').value = encryptedBase64;
    updateStatus('Message encrypted successfully!', 'success');
  } catch (err) {
    updateStatus(`Encryption failed: ${err.message}`, 'error');
  }
}

/* ------------------------------------------------------------------ */
/* Decryption UI                                                       */
/* ------------------------------------------------------------------ */

async function handleDecrypt() {
  try {
    const privateKeyB64 = $('#pgp-decrypt-private-key').value.trim();
    const encryptedBase64 = $('#pgp-decrypt-input').value.trim();

    if (!privateKeyB64 || !encryptedBase64) {
      updateStatus('Please provide both private key and encrypted message', 'warning');
      return;
    }

    const privateKey = await importPrivateKey(privateKeyB64);
    const encryptedData = base64ToArrayBuffer(encryptedBase64);
    const decrypted = await decryptMessage(encryptedData, privateKey);

    $('#pgp-decrypt-output').value = decrypted;
    updateStatus('Message decrypted successfully!', 'success');
  } catch (err) {
    updateStatus(`Decryption failed: ${err.message}`, 'error');
  }
}

/* ------------------------------------------------------------------ */
/* Signing UI                                                          */
/* ------------------------------------------------------------------ */

async function handleSign() {
  try {
    const privateKeyB64 = $('#pgp-sign-private-key').value.trim();
    const message = $('#pgp-sign-message').value;

    if (!privateKeyB64 || !message) {
      updateStatus('Please provide both private key and message', 'warning');
      return;
    }

    const privateKey = await importPrivateKey(privateKeyB64);
    const result = await signMessage(message, privateKey);

    $('#pgp-sign-message-output').value = result.message;
    $('#pgp-sign-signature-output').value = result.signature;
    updateStatus('Message signed successfully!', 'success');
  } catch (err) {
    updateStatus(`Signing failed: ${err.message}`, 'error');
  }
}

/* ------------------------------------------------------------------ */
/* Verification UI                                                     */
/* ------------------------------------------------------------------ */

async function handleVerify() {
  try {
    const publicKeyB64 = $('#pgp-verify-public-key').value.trim();
    const message = $('#pgp-verify-message').value;
    const signature = $('#pgp-verify-signature').value.trim();

    if (!publicKeyB64 || !message || !signature) {
      updateStatus('Please provide public key, message, and signature', 'warning');
      return;
    }

    const publicKey = await importPublicKey(publicKeyB64);
    const isValid = await verifyMessage(message, signature, publicKey);

    if (isValid) {
      $('#pgp-verify-result').textContent = '✓ Signature is VALID';
      $('#pgp-verify-result').className = 'pgp-banner pgp-banner--success';
    } else {
      $('#pgp-verify-result').textContent = '✕ Signature is INVALID';
      $('#pgp-verify-result').className = 'pgp-banner pgp-banner--error';
    }
    updateStatus('Verification complete', 'info');
  } catch (err) {
    updateStatus(`Verification failed: ${err.message}`, 'error');
  }
}

/* ------------------------------------------------------------------ */
/* Reset state                                                         */
/* ------------------------------------------------------------------ */

function resetPgpToolState() {
  currentMode = 'keygen';

  // Clear all inputs/outputs
  const inputs = [
    'pgp-public-key-output', 'pgp-private-key-output',
    'pgp-encrypt-public-key', 'pgp-encrypt-message', 'pgp-encrypt-output',
    'pgp-decrypt-private-key', 'pgp-decrypt-input', 'pgp-decrypt-output',
    'pgp-sign-private-key', 'pgp-sign-message', 'pgp-sign-message-output', 'pgp-sign-signature-output',
    'pgp-verify-public-key', 'pgp-verify-message', 'pgp-verify-signature'
  ];

  for (const id of inputs) {
    const el = document.getElementById(id);
    if (el) el.value = '';
  }

  // Clear status banner
  const statusBanner = document.getElementById('pgp-status');
  if (statusBanner) {
    statusBanner.style.display = 'none';
    statusBanner.textContent = '';
  }

  // Clear verify result
  const verifyResult = document.getElementById('pgp-verify-result');
  if (verifyResult) {
    verifyResult.textContent = '';
    verifyResult.className = '';
  }

  setMode('keygen');
}

/* ------------------------------------------------------------------ */
/* Event wiring                                                        */
/* ------------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
  console.log('[PGP Tool] DOM loaded, wiring up event listeners');

  // Mode tabs
  document.querySelectorAll('.pgp-mode-tab').forEach(tab => {
    tab.addEventListener('click', () => setMode(tab.dataset.mode));
  });

  // Key generation button
  const btnKeyGen = document.getElementById('btn-pgp-keygen');
  if (btnKeyGen) {
    console.log('[PGP Tool] Found key gen button, attaching listener');
    btnKeyGen.addEventListener('click', handleKeyGen);
  } else {
    console.error('[PGP Tool] btn-pgp-keygen not found!');
  }

  // Encrypt button
  const btnEncrypt = document.getElementById('btn-pgp-encrypt');
  console.log('[PGP Tool] Looking for encrypt button, found:', !!btnEncrypt);
  if (btnEncrypt) {
    console.log('[PGP Tool] Attaching encrypt handler');
    btnEncrypt.addEventListener('click', async (e) => {
      e.preventDefault();
      console.log('[PGP Tool] Encrypt button clicked!');
      await handleEncrypt();
    });
  }

  // Decrypt button
  const btnDecrypt = document.getElementById('btn-pgp-decrypt');
  if (btnDecrypt) {
    btnDecrypt.addEventListener('click', async (e) => {
      e.preventDefault();
      console.log('[PGP Tool] Decrypt button clicked!');
      await handleDecrypt();
    });
  }

  // Sign button
  const btnSign = document.getElementById('btn-pgp-sign');
  if (btnSign) {
    btnSign.addEventListener('click', async (e) => {
      e.preventDefault();
      console.log('[PGP Tool] Sign button clicked!');
      await handleSign();
    });
  }

  // Verify button
  const btnVerify = document.getElementById('btn-pgp-verify');
  if (btnVerify) {
    btnVerify.addEventListener('click', async (e) => {
      e.preventDefault();
      console.log('[PGP Tool] Verify button clicked!');
      await handleVerify();
    });
  }

  // Back button
  const btnBack = document.getElementById('btn-pgp-back');
  if (btnBack) {
    btnBack.addEventListener('click', () => navigateTo('home'));
  }

  // Initial state
  resetPgpToolState();
});

// Expose for navigation integration
window.resetPgpToolState = resetPgpToolState;
