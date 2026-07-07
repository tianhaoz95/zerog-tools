// ZeroG Toolbox — Google Wallet Membership Card Generator
//
// Builds a real "Add to Google Wallet" save link for a membership/loyalty
// card entirely client-side. Unlike Apple Wallet, Google Wallet passes are
// not a signed file bundle — they're a signed JWT (RS256) that embeds the
// pass class + object JSON directly, handed to Google via a
// https://pay.google.com/gp/v/save/<jwt> link. Signing only needs a
// standard PKCS#8 RSA private key (the one already inside any Google Cloud
// service account JSON key), so this needs nothing beyond the Web Crypto
// API — no PKCS#7/PKCS#12 library required. The service account key is
// parsed and used to sign locally in the browser; it is never uploaded.

export {};

const BARCODE_FORMATS = [
  { value: 'QR_CODE', label: 'QR Code' },
  { value: 'PDF417', label: 'PDF417' },
  { value: 'AZTEC', label: 'Aztec' },
  { value: 'CODE_128', label: 'Code 128' },
];

const DETECTED_FORMAT_MAP = {
  qr_code: 'QR_CODE',
  pdf417: 'PDF417',
  aztec: 'AZTEC',
  code_128: 'CODE_128',
};

const gWalletState = {
  serviceAccount: null, // { client_email, private_key }
  cameraStream: null,
  generatedUrl: '',
};

/* ------------------------------------------------------------------ */
/* DOM helpers                                                         */
/* ------------------------------------------------------------------ */

function $(sel) { return document.querySelector(sel); }

function escHtml(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

function showGWalletStatus(message, type = 'info') {
  const banner = $('#gwallet-status');
  if (!banner) return;
  banner.textContent = message;
  banner.className = `wallet-pass-status wallet-pass-status--${type}`;
  banner.style.display = 'block';
}

/* ------------------------------------------------------------------ */
/* Barcode decoding (camera / uploaded photo) — same approach as the    */
/* Apple Wallet tool, duplicated here to keep this tool self-contained. */
/* ------------------------------------------------------------------ */

function mapDetectedFormat(fmt) {
  return DETECTED_FORMAT_MAP[fmt] || 'CODE_128';
}

async function decodeBarcodeFromCanvas(canvas) {
  if ('BarcodeDetector' in window) {
    try {
      const supported = await window.BarcodeDetector.getSupportedFormats();
      const detector = new window.BarcodeDetector({ formats: supported });
      const results = await detector.detect(canvas);
      if (results && results.length) {
        return { value: results[0].rawValue, format: mapDetectedFormat(results[0].format) };
      }
    } catch (err) {
      console.warn('[Google Wallet Pass] BarcodeDetector failed', err);
    }
  }

  try {
    const jsQRModule = await import('jsqr');
    const jsQR = jsQRModule.default || jsQRModule;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const result = jsQR(imageData.data, imageData.width, imageData.height);
    if (result) return { value: result.data, format: 'QR_CODE' };
  } catch (err) {
    console.warn('[Google Wallet Pass] jsQR failed', err);
  }

  return null;
}

function applyDecodedBarcode(result) {
  const valueInput = $('#gwallet-barcode-value');
  const formatSelect = $('#gwallet-barcode-format');
  if (valueInput) valueInput.value = result.value;
  if (formatSelect) formatSelect.value = result.format;
  renderGWalletPreview();
}

/* ------------------------------------------------------------------ */
/* Camera capture                                                      */
/* ------------------------------------------------------------------ */

async function startGWalletCamera() {
  const wrap = $('#gwallet-camera-wrap');
  const video = $('#gwallet-camera-video');
  if (!wrap || !video) return;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    video.srcObject = stream;
    gWalletState.cameraStream = stream;
    wrap.style.display = 'flex';
    showGWalletStatus('Point the camera at the barcode, then tap Capture.', 'info');
  } catch (err) {
    showGWalletStatus(`Camera access failed: ${err.message}`, 'error');
  }
}

function stopGWalletCamera() {
  if (gWalletState.cameraStream) {
    gWalletState.cameraStream.getTracks().forEach((track) => track.stop());
    gWalletState.cameraStream = null;
  }
  const wrap = $('#gwallet-camera-wrap');
  if (wrap) wrap.style.display = 'none';
}

async function captureAndDecodeFromCamera() {
  const video = $('#gwallet-camera-video');
  const canvas = $('#gwallet-camera-canvas');
  if (!video || !canvas || !video.videoWidth) return;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);

  showGWalletStatus('Decoding barcode…', 'info');
  const result = await decodeBarcodeFromCanvas(canvas);
  if (result) {
    applyDecodedBarcode(result);
    showGWalletStatus('Barcode captured from camera!', 'success');
    stopGWalletCamera();
  } else {
    showGWalletStatus('No barcode detected — try again, get closer, or enter the value manually.', 'warning');
  }
}

/* ------------------------------------------------------------------ */
/* Photo upload decoding                                                */
/* ------------------------------------------------------------------ */

async function handleBarcodePhotoUpload(file) {
  if (!file) return;
  try {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    canvas.getContext('2d').drawImage(bitmap, 0, 0);

    showGWalletStatus('Decoding barcode from photo…', 'info');
    const result = await decodeBarcodeFromCanvas(canvas);
    if (result) {
      applyDecodedBarcode(result);
      showGWalletStatus('Barcode decoded from photo!', 'success');
    } else {
      showGWalletStatus('No barcode detected in that photo — try another photo or enter the value manually.', 'warning');
    }
  } catch (err) {
    showGWalletStatus(`Could not read that image: ${err.message}`, 'error');
  }
}

/* ------------------------------------------------------------------ */
/* Base64url + JWT helpers (Web Crypto only — no external crypto lib)   */
/* ------------------------------------------------------------------ */

function base64UrlEncodeBytes(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlEncodeJson(obj) {
  return base64UrlEncodeBytes(new TextEncoder().encode(JSON.stringify(obj)));
}

function pemToDer(pem) {
  const b64 = pem.replace(/-----BEGIN [^-]+-----/, '').replace(/-----END [^-]+-----/, '').replace(/\s+/g, '');
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function importSigningKey(privateKeyPem) {
  const der = pemToDer(privateKeyPem);
  return crypto.subtle.importKey('pkcs8', der, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
}

async function signSaveJwt(serviceAccount, genericClass, genericObject) {
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: serviceAccount.client_email,
    aud: 'google',
    typ: 'savetowallet',
    iat: Math.floor(Date.now() / 1000),
    payload: {
      genericClasses: [genericClass],
      genericObjects: [genericObject],
    },
  };

  const signingInput = `${base64UrlEncodeJson(header)}.${base64UrlEncodeJson(payload)}`;
  const key = await importSigningKey(serviceAccount.private_key);
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(signingInput));
  return `${signingInput}.${base64UrlEncodeBytes(new Uint8Array(signature))}`;
}

/* ------------------------------------------------------------------ */
/* Generic pass class/object builders                                  */
/* ------------------------------------------------------------------ */

function buildGenericClass(fields) {
  return { id: `${fields.issuerId}.${fields.classSuffix}` };
}

function buildGenericObject(fields) {
  const obj = {
    id: `${fields.issuerId}.${fields.objectSuffix}`,
    classId: `${fields.issuerId}.${fields.classSuffix}`,
    genericType: 'GENERIC_TYPE_UNSPECIFIED',
    hexBackgroundColor: fields.backgroundColor,
    cardTitle: { defaultValue: { language: 'en-US', value: fields.organizationName } },
    subheader: { defaultValue: { language: 'en-US', value: fields.cardTitle } },
    header: { defaultValue: { language: 'en-US', value: fields.memberName || fields.cardTitle } },
    barcode: { type: fields.barcodeFormat, value: fields.barcodeValue },
  };

  if (fields.logoUrl) {
    obj.logo = { sourceUri: { uri: fields.logoUrl } };
  }
  if (fields.memberId) {
    obj.textModulesData = [{ id: 'memberId', header: 'MEMBER ID', body: fields.memberId }];
  }
  return obj;
}

/* ------------------------------------------------------------------ */
/* Preview                                                              */
/* ------------------------------------------------------------------ */

function renderGWalletPreview() {
  const card = $('#gwallet-preview-card');
  if (!card) return;

  const orgName = $('#gwallet-org-name')?.value.trim() || 'Organization Name';
  const title = $('#gwallet-title')?.value.trim() || 'Membership Card';
  const memberName = $('#gwallet-member-name')?.value.trim();
  const memberId = $('#gwallet-member-id')?.value.trim();
  const barcodeValue = $('#gwallet-barcode-value')?.value.trim();
  const bg = $('#gwallet-bg-color')?.value || '#1a73e8';
  const logoUrl = $('#gwallet-logo-url')?.value.trim();

  card.style.background = bg;
  card.style.color = '#ffffff';

  card.innerHTML = `
    <div class="wallet-pass-preview-header">
      ${logoUrl
        ? `<img src="${escHtml(logoUrl)}" alt="Logo" class="wallet-pass-preview-logo" onerror="this.style.display='none'" />`
        : `<span class="wallet-pass-preview-org">${escHtml(orgName)}</span>`}
    </div>
    <div class="wallet-pass-preview-title">${escHtml(title)}</div>
    ${memberName ? `<div class="wallet-pass-preview-row"><span>MEMBER</span><strong>${escHtml(memberName)}</strong></div>` : ''}
    ${memberId ? `<div class="wallet-pass-preview-row"><span>MEMBER ID</span><strong>${escHtml(memberId)}</strong></div>` : ''}
    <div class="wallet-pass-preview-barcode">▦▦▦ ${escHtml(barcodeValue || 'Barcode value')} ▦▦▦</div>
  `;
}

/* ------------------------------------------------------------------ */
/* Generate & sign                                                      */
/* ------------------------------------------------------------------ */

function renderGWalletDownloadLink(url) {
  const container = $('#gwallet-download-container');
  if (!container) return;

  gWalletState.generatedUrl = url;
  container.innerHTML = '';

  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.className = 'btn btn-primary btn-block';
  link.textContent = '🔖 Add to Google Wallet';
  container.appendChild(link);

  const hint = document.createElement('p');
  hint.className = 'wallet-pass-download-hint';
  hint.textContent = 'Opening this link (on desktop or Android) takes you to Google Wallet to save the card. Share it to your phone via text/email if you generated it on a computer.';
  container.appendChild(hint);

  container.style.display = 'flex';
}

async function handleGenerateGWalletPass() {
  const organizationName = $('#gwallet-org-name')?.value.trim();
  const cardTitle = $('#gwallet-title')?.value.trim();
  const memberName = $('#gwallet-member-name')?.value.trim();
  const memberId = $('#gwallet-member-id')?.value.trim();
  const backgroundColor = $('#gwallet-bg-color')?.value || '#1a73e8';
  const logoUrl = $('#gwallet-logo-url')?.value.trim();
  const barcodeFormat = $('#gwallet-barcode-format')?.value || 'QR_CODE';
  const barcodeValue = $('#gwallet-barcode-value')?.value.trim();
  const issuerId = $('#gwallet-issuer-id')?.value.trim();
  const classSuffix = $('#gwallet-class-suffix')?.value.trim();
  const objectSuffix = $('#gwallet-object-suffix')?.value.trim();

  if (!organizationName || !cardTitle) {
    showGWalletStatus('Please fill in the organization name and card title.', 'warning');
    return;
  }
  if (!barcodeValue) {
    showGWalletStatus('Please provide a barcode value (scan, upload, or type it in).', 'warning');
    return;
  }
  if (!issuerId || !classSuffix || !objectSuffix) {
    showGWalletStatus('Please fill in the Issuer ID, Class ID Suffix, and Object ID Suffix.', 'warning');
    return;
  }
  if (!gWalletState.serviceAccount) {
    showGWalletStatus('Please upload your Google Cloud service account JSON key.', 'warning');
    return;
  }

  const generateBtn = $('#btn-gwallet-generate');
  if (generateBtn) generateBtn.disabled = true;

  try {
    showGWalletStatus('Building the pass class + object…', 'info');
    const fields = {
      organizationName, cardTitle, memberName, memberId, backgroundColor, logoUrl,
      barcodeFormat, barcodeValue, issuerId, classSuffix, objectSuffix,
    };
    const genericClass = buildGenericClass(fields);
    const genericObject = buildGenericObject(fields);

    showGWalletStatus('Signing the save link with your service account key…', 'info');
    const jwt = await signSaveJwt(gWalletState.serviceAccount, genericClass, genericObject);
    const url = `https://pay.google.com/gp/v/save/${jwt}`;

    renderGWalletDownloadLink(url);
    showGWalletStatus('✅ Pass signed! Use the button below to add it to Google Wallet.', 'success');
  } catch (err) {
    console.error('[Google Wallet Pass] generation failed', err);
    showGWalletStatus(`Failed to generate pass: ${err.message}`, 'error');
  } finally {
    if (generateBtn) generateBtn.disabled = false;
  }
}

/* ------------------------------------------------------------------ */
/* Reset state                                                          */
/* ------------------------------------------------------------------ */

function randomIdSuffix() {
  return `card_${Math.random().toString(36).slice(2, 10)}`;
}

function resetGWalletState() {
  stopGWalletCamera();

  const textInputs = [
    'gwallet-org-name', 'gwallet-title', 'gwallet-member-name', 'gwallet-member-id',
    'gwallet-barcode-value', 'gwallet-logo-url', 'gwallet-issuer-id', 'gwallet-class-suffix',
  ];
  for (const id of textInputs) {
    const el = document.getElementById(id);
    if (el) el.value = '';
  }

  const bgColor = $('#gwallet-bg-color');
  if (bgColor) bgColor.value = '#1a73e8';
  const formatSelect = $('#gwallet-barcode-format');
  if (formatSelect) formatSelect.value = 'QR_CODE';

  const objectSuffix = $('#gwallet-object-suffix');
  if (objectSuffix) objectSuffix.value = randomIdSuffix();

  gWalletState.serviceAccount = null;
  const serviceAccountInput = $('#gwallet-service-account-input');
  if (serviceAccountInput) serviceAccountInput.value = '';
  const serviceAccountName = $('#gwallet-service-account-name');
  if (serviceAccountName) serviceAccountName.textContent = '';

  const downloadContainer = $('#gwallet-download-container');
  if (downloadContainer) { downloadContainer.innerHTML = ''; downloadContainer.style.display = 'none'; }
  gWalletState.generatedUrl = '';

  const banner = $('#gwallet-status');
  if (banner) { banner.style.display = 'none'; banner.textContent = ''; }

  renderGWalletPreview();
}

/* ------------------------------------------------------------------ */
/* Event wiring                                                        */
/* ------------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
  const formatSelect = $('#gwallet-barcode-format');
  if (formatSelect && !formatSelect.options.length) {
    for (const fmt of BARCODE_FORMATS) {
      const opt = document.createElement('option');
      opt.value = fmt.value;
      opt.textContent = fmt.label;
      formatSelect.appendChild(opt);
    }
  }

  for (const id of ['gwallet-org-name', 'gwallet-title', 'gwallet-member-name',
    'gwallet-member-id', 'gwallet-barcode-value', 'gwallet-bg-color', 'gwallet-logo-url']) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', renderGWalletPreview);
  }

  $('#btn-gwallet-scan-camera')?.addEventListener('click', startGWalletCamera);
  $('#btn-gwallet-stop-camera')?.addEventListener('click', stopGWalletCamera);
  $('#btn-gwallet-capture')?.addEventListener('click', captureAndDecodeFromCamera);

  $('#gwallet-photo-input')?.addEventListener('change', (e) => handleBarcodePhotoUpload(e.target.files[0]));
  $('#btn-gwallet-upload-photo')?.addEventListener('click', () => $('#gwallet-photo-input')?.click());

  $('#gwallet-service-account-input')?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    const nameEl = $('#gwallet-service-account-name');
    if (!file) {
      gWalletState.serviceAccount = null;
      if (nameEl) nameEl.textContent = '';
      return;
    }
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      if (!json.client_email || !json.private_key) {
        throw new Error('This JSON file is missing "client_email" or "private_key" — is it a service account key?');
      }
      gWalletState.serviceAccount = { client_email: json.client_email, private_key: json.private_key };
      if (nameEl) nameEl.textContent = file.name;
      showGWalletStatus(`Service account loaded: ${json.client_email}`, 'success');
    } catch (err) {
      gWalletState.serviceAccount = null;
      if (nameEl) nameEl.textContent = '';
      showGWalletStatus(`Could not read service account key: ${err.message}`, 'error');
    }
  });

  $('#btn-gwallet-generate')?.addEventListener('click', handleGenerateGWalletPass);
  $('#btn-gwallet-reset')?.addEventListener('click', resetGWalletState);

  $('#btn-google-wallet-pass-generator-back')?.addEventListener('click', () => navigateTo('home'));

  resetGWalletState();
});

window.resetGWalletState = resetGWalletState;
