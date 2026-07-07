// ZeroG Toolbox — Apple Wallet Membership Card Generator
//
// Builds a real, signed Apple Wallet pass (.pkpass) for a membership/loyalty
// card entirely client-side. Wallet refuses any pass that isn't signed with
// an Apple-issued Pass Type ID certificate chained through the Apple WWDR
// intermediate certificate — there is no way around that requirement without
// a server holding Apple credentials, so this tool asks the user to bring
// their own certificate (.p12) + the WWDR cert. Both are parsed and used to
// sign the pass manifest locally via node-forge; nothing is ever uploaded.

export {};

const BARCODE_FORMATS = [
  { value: 'PKBarcodeFormatQR', label: 'QR Code' },
  { value: 'PKBarcodeFormatPDF417', label: 'PDF417' },
  { value: 'PKBarcodeFormatAztec', label: 'Aztec' },
  { value: 'PKBarcodeFormatCode128', label: 'Code 128' },
];

const DETECTED_FORMAT_MAP = {
  qr_code: 'PKBarcodeFormatQR',
  pdf417: 'PKBarcodeFormatPDF417',
  aztec: 'PKBarcodeFormatAztec',
  code_128: 'PKBarcodeFormatCode128',
};

const walletPassState = {
  logoBitmap: null,
  logoDataUrl: '',
  p12File: null,
  wwdrFile: null,
  cameraStream: null,
  generatedBlobUrl: null,
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

function showWalletPassStatus(message, type = 'info') {
  const banner = $('#wallet-pass-status');
  if (!banner) return;
  banner.textContent = message;
  banner.className = `wallet-pass-status wallet-pass-status--${type}`;
  banner.style.display = 'block';
}

/* ------------------------------------------------------------------ */
/* Color helpers                                                       */
/* ------------------------------------------------------------------ */

function hexToRgbParts(hex) {
  const clean = (hex || '#1e1e1e').replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const num = parseInt(full, 16) || 0;
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function hexToRgbString(hex) {
  const { r, g, b } = hexToRgbParts(hex);
  return `rgb(${r},${g},${b})`;
}

function getReadableTextColor(hex) {
  const { r, g, b } = hexToRgbParts(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#111111' : '#ffffff';
}

/* ------------------------------------------------------------------ */
/* Canvas / image helpers                                              */
/* ------------------------------------------------------------------ */

function drawContainFit(source, w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  const sw = source.width;
  const sh = source.height;
  const scale = Math.min(w / sw, h / sh);
  const dw = sw * scale;
  const dh = sh * scale;
  ctx.drawImage(source, (w - dw) / 2, (h - dh) / 2, dw, dh);
  return canvas;
}

function drawIconCanvas(sizePx) {
  const canvas = document.createElement('canvas');
  canvas.width = sizePx;
  canvas.height = sizePx;
  const ctx = canvas.getContext('2d');
  const bg = $('#wallet-pass-bg-color')?.value || '#1e1e1e';

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, sizePx, sizePx);

  if (walletPassState.logoBitmap) {
    const inner = drawContainFit(walletPassState.logoBitmap, Math.round(sizePx * 0.8), Math.round(sizePx * 0.8));
    ctx.drawImage(inner, (sizePx - inner.width) / 2, (sizePx - inner.height) / 2);
  } else {
    const orgName = $('#wallet-pass-org-name')?.value.trim() || '';
    ctx.fillStyle = getReadableTextColor(bg);
    ctx.font = `700 ${Math.floor(sizePx * 0.5)}px "Space Grotesk", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText((orgName.charAt(0) || '?').toUpperCase(), sizePx / 2, sizePx / 2 + sizePx * 0.03);
  }
  return canvas;
}

function canvasToPngBytes(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (!blob) { reject(new Error('PNG encoding failed')); return; }
      resolve(new Uint8Array(await blob.arrayBuffer()));
    }, 'image/png');
  });
}

/* ------------------------------------------------------------------ */
/* Barcode decoding (camera / uploaded photo)                          */
/* ------------------------------------------------------------------ */

function mapDetectedFormat(fmt) {
  return DETECTED_FORMAT_MAP[fmt] || 'PKBarcodeFormatCode128';
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
      console.warn('[Wallet Pass] BarcodeDetector failed', err);
    }
  }

  try {
    const jsQRModule = await import('jsqr');
    const jsQR = jsQRModule.default || jsQRModule;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const result = jsQR(imageData.data, imageData.width, imageData.height);
    if (result) return { value: result.data, format: 'PKBarcodeFormatQR' };
  } catch (err) {
    console.warn('[Wallet Pass] jsQR failed', err);
  }

  return null;
}

function applyDecodedBarcode(result) {
  const valueInput = $('#wallet-pass-barcode-value');
  const formatSelect = $('#wallet-pass-barcode-format');
  if (valueInput) valueInput.value = result.value;
  if (formatSelect) formatSelect.value = result.format;
  renderWalletPassPreview();
}

/* ------------------------------------------------------------------ */
/* Camera capture                                                      */
/* ------------------------------------------------------------------ */

async function startWalletPassCamera() {
  const wrap = $('#wallet-pass-camera-wrap');
  const video = $('#wallet-pass-camera-video');
  if (!wrap || !video) return;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    video.srcObject = stream;
    walletPassState.cameraStream = stream;
    wrap.style.display = 'flex';
    showWalletPassStatus('Point the camera at the barcode, then tap Capture.', 'info');
  } catch (err) {
    showWalletPassStatus(`Camera access failed: ${err.message}`, 'error');
  }
}

function stopWalletPassCamera() {
  if (walletPassState.cameraStream) {
    walletPassState.cameraStream.getTracks().forEach((track) => track.stop());
    walletPassState.cameraStream = null;
  }
  const wrap = $('#wallet-pass-camera-wrap');
  if (wrap) wrap.style.display = 'none';
}

async function captureAndDecodeFromCamera() {
  const video = $('#wallet-pass-camera-video');
  const canvas = $('#wallet-pass-camera-canvas');
  if (!video || !canvas || !video.videoWidth) return;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);

  showWalletPassStatus('Decoding barcode…', 'info');
  const result = await decodeBarcodeFromCanvas(canvas);
  if (result) {
    applyDecodedBarcode(result);
    showWalletPassStatus('Barcode captured from camera!', 'success');
    stopWalletPassCamera();
  } else {
    showWalletPassStatus('No barcode detected — try again, get closer, or enter the value manually.', 'warning');
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

    showWalletPassStatus('Decoding barcode from photo…', 'info');
    const result = await decodeBarcodeFromCanvas(canvas);
    if (result) {
      applyDecodedBarcode(result);
      showWalletPassStatus('Barcode decoded from photo!', 'success');
    } else {
      showWalletPassStatus('No barcode detected in that photo — try another photo or enter the value manually.', 'warning');
    }
  } catch (err) {
    showWalletPassStatus(`Could not read that image: ${err.message}`, 'error');
  }
}

/* ------------------------------------------------------------------ */
/* Logo upload                                                         */
/* ------------------------------------------------------------------ */

async function handleLogoUpload(file) {
  if (!file) return;
  try {
    walletPassState.logoBitmap = await createImageBitmap(file);
    walletPassState.logoDataUrl = URL.createObjectURL(file);
    const preview = $('#wallet-pass-logo-preview');
    if (preview) {
      preview.src = walletPassState.logoDataUrl;
      preview.style.display = 'block';
    }
    renderWalletPassPreview();
  } catch (err) {
    showWalletPassStatus(`Could not read logo image: ${err.message}`, 'error');
  }
}

/* ------------------------------------------------------------------ */
/* Certificate parsing (node-forge, entirely client-side)               */
/* ------------------------------------------------------------------ */

function findCertAttr(cert, oid, shortName) {
  const attrs = cert.subject.attributes || [];
  const found = attrs.find((a) => a.type === oid || (shortName && a.shortName === shortName));
  return found ? found.value : '';
}

async function parseP12Certificate(arrayBuffer, password) {
  const forgeModule = await import('node-forge');
  const forge = forgeModule.default || forgeModule;

  const binaryStr = forge.util.binary.raw.encode(new Uint8Array(arrayBuffer));
  const asn1 = forge.asn1.fromDer(forge.util.createBuffer(binaryStr));

  let p12;
  try {
    p12 = forge.pkcs12.pkcs12FromAsn1(asn1, false, password);
  } catch (err) {
    throw new Error('Could not open the .p12 file — check the certificate password.');
  }

  const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
  const certBag = (certBags[forge.pki.oids.certBag] || [])[0];
  if (!certBag) throw new Error('No certificate found inside the .p12 file.');

  let keyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });
  let keyBag = (keyBags[forge.pki.oids.pkcs8ShroudedKeyBag] || [])[0];
  if (!keyBag) {
    keyBags = p12.getBags({ bagType: forge.pki.oids.keyBag });
    keyBag = (keyBags[forge.pki.oids.keyBag] || [])[0];
  }
  if (!keyBag) throw new Error('No private key found inside the .p12 file.');

  return {
    forge,
    cert: certBag.cert,
    key: keyBag.key,
    passTypeIdentifier: findCertAttr(certBag.cert, '0.9.2342.19200300.100.1.1', 'UID'),
    teamIdentifier: findCertAttr(certBag.cert, '2.5.4.11', 'OU'),
  };
}

async function parseCertificateFile(arrayBuffer) {
  const forgeModule = await import('node-forge');
  const forge = forgeModule.default || forgeModule;

  const bytes = new Uint8Array(arrayBuffer);
  const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
  if (text.includes('-----BEGIN CERTIFICATE-----')) {
    return forge.pki.certificateFromPem(text);
  }
  const binaryStr = forge.util.binary.raw.encode(bytes);
  const asn1 = forge.asn1.fromDer(forge.util.createBuffer(binaryStr));
  return forge.pki.certificateFromAsn1(asn1);
}

async function sha1Hex(bytes) {
  const digest = await crypto.subtle.digest('SHA-1', bytes);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function signManifest(forge, manifestBytes, signerCert, signerKey, wwdrCert) {
  const p7 = forge.pkcs7.createSignedData();
  p7.content = forge.util.createBuffer(forge.util.binary.raw.encode(manifestBytes));
  p7.addCertificate(signerCert);
  p7.addCertificate(wwdrCert);
  p7.addSigner({
    key: signerKey,
    certificate: signerCert,
    digestAlgorithm: forge.pki.oids.sha1,
    authenticatedAttributes: [
      { type: forge.pki.oids.contentType, value: forge.pki.oids.data },
      { type: forge.pki.oids.messageDigest },
      { type: forge.pki.oids.signingTime, value: new Date() },
    ],
  });
  p7.sign({ detached: true });
  const der = forge.asn1.toDer(p7.toAsn1()).getBytes();
  return forge.util.binary.raw.decode(der);
}

/* ------------------------------------------------------------------ */
/* Pass.json + file bundle                                              */
/* ------------------------------------------------------------------ */

function buildPassJson(fields) {
  const primaryFields = [];
  if (fields.memberName) primaryFields.push({ key: 'member', label: 'MEMBER', value: fields.memberName });

  const secondaryFields = [];
  if (fields.memberId) secondaryFields.push({ key: 'memberId', label: 'MEMBER ID', value: fields.memberId });

  const barcodeEntry = {
    format: fields.barcodeFormat,
    message: fields.barcodeValue,
    messageEncoding: 'iso-8859-1',
  };

  return {
    formatVersion: 1,
    passTypeIdentifier: fields.passTypeIdentifier,
    serialNumber: fields.serialNumber,
    teamIdentifier: fields.teamIdentifier,
    organizationName: fields.organizationName,
    description: fields.cardTitle,
    logoText: fields.cardTitle,
    foregroundColor: hexToRgbString(fields.foregroundColor),
    backgroundColor: hexToRgbString(fields.backgroundColor),
    storeCard: {
      primaryFields,
      secondaryFields,
    },
    barcodes: [barcodeEntry],
    barcode: barcodeEntry,
  };
}

async function buildPassFiles(fields) {
  const files = {};
  files['pass.json'] = new TextEncoder().encode(JSON.stringify(buildPassJson(fields)));

  files['icon.png'] = await canvasToPngBytes(drawIconCanvas(29));
  files['icon@2x.png'] = await canvasToPngBytes(drawIconCanvas(58));
  files['icon@3x.png'] = await canvasToPngBytes(drawIconCanvas(87));

  if (walletPassState.logoBitmap) {
    files['logo.png'] = await canvasToPngBytes(drawContainFit(walletPassState.logoBitmap, 160, 50));
    files['logo@2x.png'] = await canvasToPngBytes(drawContainFit(walletPassState.logoBitmap, 320, 100));
  }

  return files;
}

/* ------------------------------------------------------------------ */
/* Preview                                                              */
/* ------------------------------------------------------------------ */

function renderWalletPassPreview() {
  const card = $('#wallet-pass-preview-card');
  if (!card) return;

  const orgName = $('#wallet-pass-org-name')?.value.trim() || 'Organization Name';
  const title = $('#wallet-pass-title')?.value.trim() || 'Membership Card';
  const memberName = $('#wallet-pass-member-name')?.value.trim();
  const memberId = $('#wallet-pass-member-id')?.value.trim();
  const barcodeValue = $('#wallet-pass-barcode-value')?.value.trim();
  const bg = $('#wallet-pass-bg-color')?.value || '#1e1e1e';
  const fg = $('#wallet-pass-fg-color')?.value || '#ffffff';

  card.style.background = bg;
  card.style.color = fg;

  card.innerHTML = `
    <div class="wallet-pass-preview-header">
      ${walletPassState.logoDataUrl
        ? `<img src="${walletPassState.logoDataUrl}" alt="Logo" class="wallet-pass-preview-logo" />`
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

function renderDownloadLink(blob, cardTitle) {
  const container = $('#wallet-pass-download-container');
  if (!container) return;

  if (walletPassState.generatedBlobUrl) {
    URL.revokeObjectURL(walletPassState.generatedBlobUrl);
  }
  const url = URL.createObjectURL(blob);
  walletPassState.generatedBlobUrl = url;

  const safeName = (cardTitle || 'membership-card').toLowerCase().replace(/[^a-z0-9-_]+/g, '-').replace(/^-+|-+$/g, '') || 'membership-card';

  container.innerHTML = '';
  const link = document.createElement('a');
  link.href = url;
  link.download = `${safeName}.pkpass`;
  link.className = 'btn btn-primary btn-block';
  link.textContent = '📲 Add to Apple Wallet (.pkpass)';
  container.appendChild(link);

  const hint = document.createElement('p');
  hint.className = 'wallet-pass-download-hint';
  hint.textContent = 'On iPhone, open this link in Safari to add the card directly to Wallet. On desktop, download it, then AirDrop or email the file to your iPhone and tap it there.';
  container.appendChild(hint);

  container.style.display = 'flex';
}

async function handleGenerateWalletPass() {
  const organizationName = $('#wallet-pass-org-name')?.value.trim();
  const cardTitle = $('#wallet-pass-title')?.value.trim();
  const memberName = $('#wallet-pass-member-name')?.value.trim();
  const memberId = $('#wallet-pass-member-id')?.value.trim();
  const backgroundColor = $('#wallet-pass-bg-color')?.value || '#1e1e1e';
  const foregroundColor = $('#wallet-pass-fg-color')?.value || '#ffffff';
  const barcodeFormat = $('#wallet-pass-barcode-format')?.value || 'PKBarcodeFormatQR';
  const barcodeValue = $('#wallet-pass-barcode-value')?.value.trim();
  const certPassword = $('#wallet-pass-cert-password')?.value || '';
  let passTypeIdentifier = $('#wallet-pass-type-id')?.value.trim();
  let teamIdentifier = $('#wallet-pass-team-id')?.value.trim();
  let serialNumber = $('#wallet-pass-serial')?.value.trim();

  if (!organizationName || !cardTitle) {
    showWalletPassStatus('Please fill in the organization name and card title.', 'warning');
    return;
  }
  if (!barcodeValue) {
    showWalletPassStatus('Please provide a barcode value (scan, upload, or type it in).', 'warning');
    return;
  }
  if (!walletPassState.p12File) {
    showWalletPassStatus('Please upload your Pass Type ID certificate (.p12).', 'warning');
    return;
  }
  if (!walletPassState.wwdrFile) {
    showWalletPassStatus('Please upload the Apple WWDR intermediate certificate.', 'warning');
    return;
  }

  const generateBtn = $('#btn-wallet-pass-generate');
  if (generateBtn) generateBtn.disabled = true;

  try {
    showWalletPassStatus('Reading your Pass Type ID certificate…', 'info');
    const p12Buffer = await walletPassState.p12File.arrayBuffer();
    const { forge, cert, key, passTypeIdentifier: certPassTypeId, teamIdentifier: certTeamId } =
      await parseP12Certificate(p12Buffer, certPassword);

    if (!passTypeIdentifier && certPassTypeId) {
      passTypeIdentifier = certPassTypeId;
      if ($('#wallet-pass-type-id')) $('#wallet-pass-type-id').value = certPassTypeId;
    }
    if (!teamIdentifier && certTeamId) {
      teamIdentifier = certTeamId;
      if ($('#wallet-pass-team-id')) $('#wallet-pass-team-id').value = certTeamId;
    }
    if (!passTypeIdentifier || !teamIdentifier) {
      throw new Error('Could not determine the Pass Type Identifier / Team Identifier from the certificate — enter them manually.');
    }
    if (!serialNumber) {
      serialNumber = crypto.randomUUID();
      if ($('#wallet-pass-serial')) $('#wallet-pass-serial').value = serialNumber;
    }

    showWalletPassStatus('Reading the Apple WWDR certificate…', 'info');
    const wwdrBuffer = await walletPassState.wwdrFile.arrayBuffer();
    const wwdrCert = await parseCertificateFile(wwdrBuffer);

    showWalletPassStatus('Building pass files…', 'info');
    const fields = {
      organizationName, cardTitle, memberName, memberId,
      backgroundColor, foregroundColor, barcodeFormat, barcodeValue,
      passTypeIdentifier, teamIdentifier, serialNumber,
    };
    const files = await buildPassFiles(fields);

    showWalletPassStatus('Hashing manifest…', 'info');
    const manifest = {};
    for (const [name, bytes] of Object.entries(files)) {
      manifest[name] = await sha1Hex(bytes);
    }
    const manifestBytes = new TextEncoder().encode(JSON.stringify(manifest));

    showWalletPassStatus('Signing manifest with your certificate…', 'info');
    const signatureBytes = await signManifest(forge, manifestBytes, cert, key, wwdrCert);

    showWalletPassStatus('Packaging .pkpass…', 'info');
    const JSZipModule = await import('jszip');
    const JSZip = JSZipModule.default || JSZipModule;
    const zip = new JSZip();
    for (const [name, bytes] of Object.entries(files)) zip.file(name, bytes);
    zip.file('manifest.json', manifestBytes);
    zip.file('signature', signatureBytes);

    const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.apple.pkpass' });
    renderDownloadLink(blob, cardTitle);
    showWalletPassStatus('✅ Pass generated and signed! Use the button below to add it to Apple Wallet.', 'success');
  } catch (err) {
    console.error('[Wallet Pass] generation failed', err);
    showWalletPassStatus(`Failed to generate pass: ${err.message}`, 'error');
  } finally {
    if (generateBtn) generateBtn.disabled = false;
  }
}

/* ------------------------------------------------------------------ */
/* Reset state                                                          */
/* ------------------------------------------------------------------ */

function resetWalletPassState() {
  stopWalletPassCamera();

  const textInputs = [
    'wallet-pass-org-name', 'wallet-pass-title', 'wallet-pass-member-name', 'wallet-pass-member-id',
    'wallet-pass-barcode-value', 'wallet-pass-cert-password', 'wallet-pass-type-id', 'wallet-pass-team-id',
  ];
  for (const id of textInputs) {
    const el = document.getElementById(id);
    if (el) el.value = '';
  }

  const bgColor = $('#wallet-pass-bg-color');
  if (bgColor) bgColor.value = '#1e1e1e';
  const fgColor = $('#wallet-pass-fg-color');
  if (fgColor) fgColor.value = '#ffffff';
  const formatSelect = $('#wallet-pass-barcode-format');
  if (formatSelect) formatSelect.value = 'PKBarcodeFormatQR';

  const serial = $('#wallet-pass-serial');
  if (serial) serial.value = crypto.randomUUID();

  walletPassState.logoBitmap = null;
  if (walletPassState.logoDataUrl) URL.revokeObjectURL(walletPassState.logoDataUrl);
  walletPassState.logoDataUrl = '';
  walletPassState.p12File = null;
  walletPassState.wwdrFile = null;

  const logoPreview = $('#wallet-pass-logo-preview');
  if (logoPreview) { logoPreview.src = ''; logoPreview.style.display = 'none'; }
  const p12Input = $('#wallet-pass-p12-input');
  if (p12Input) p12Input.value = '';
  const wwdrInput = $('#wallet-pass-wwdr-input');
  if (wwdrInput) wwdrInput.value = '';
  const p12Name = $('#wallet-pass-p12-name');
  if (p12Name) p12Name.textContent = '';
  const wwdrName = $('#wallet-pass-wwdr-name');
  if (wwdrName) wwdrName.textContent = '';

  const downloadContainer = $('#wallet-pass-download-container');
  if (downloadContainer) { downloadContainer.innerHTML = ''; downloadContainer.style.display = 'none'; }
  if (walletPassState.generatedBlobUrl) {
    URL.revokeObjectURL(walletPassState.generatedBlobUrl);
    walletPassState.generatedBlobUrl = null;
  }

  const banner = $('#wallet-pass-status');
  if (banner) { banner.style.display = 'none'; banner.textContent = ''; }

  renderWalletPassPreview();
}

/* ------------------------------------------------------------------ */
/* Event wiring                                                        */
/* ------------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
  const formatSelect = $('#wallet-pass-barcode-format');
  if (formatSelect && !formatSelect.options.length) {
    for (const fmt of BARCODE_FORMATS) {
      const opt = document.createElement('option');
      opt.value = fmt.value;
      opt.textContent = fmt.label;
      formatSelect.appendChild(opt);
    }
  }

  for (const id of ['wallet-pass-org-name', 'wallet-pass-title', 'wallet-pass-member-name',
    'wallet-pass-member-id', 'wallet-pass-barcode-value', 'wallet-pass-bg-color', 'wallet-pass-fg-color']) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', renderWalletPassPreview);
  }

  $('#wallet-pass-logo-input')?.addEventListener('change', (e) => handleLogoUpload(e.target.files[0]));

  $('#btn-wallet-pass-scan-camera')?.addEventListener('click', startWalletPassCamera);
  $('#btn-wallet-pass-stop-camera')?.addEventListener('click', stopWalletPassCamera);
  $('#btn-wallet-pass-capture')?.addEventListener('click', captureAndDecodeFromCamera);

  $('#wallet-pass-photo-input')?.addEventListener('change', (e) => handleBarcodePhotoUpload(e.target.files[0]));
  $('#btn-wallet-pass-upload-photo')?.addEventListener('click', () => $('#wallet-pass-photo-input')?.click());

  $('#wallet-pass-p12-input')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    walletPassState.p12File = file || null;
    const nameEl = $('#wallet-pass-p12-name');
    if (nameEl) nameEl.textContent = file ? file.name : '';
  });

  $('#wallet-pass-wwdr-input')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    walletPassState.wwdrFile = file || null;
    const nameEl = $('#wallet-pass-wwdr-name');
    if (nameEl) nameEl.textContent = file ? file.name : '';
  });

  $('#btn-wallet-pass-generate')?.addEventListener('click', handleGenerateWalletPass);
  $('#btn-wallet-pass-reset')?.addEventListener('click', resetWalletPassState);

  $('#btn-apple-wallet-pass-generator-back')?.addEventListener('click', () => navigateTo('home'));

  resetWalletPassState();
});

window.resetWalletPassState = resetWalletPassState;
