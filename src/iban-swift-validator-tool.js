// ZeroG Toolbox — IBAN & SWIFT/BIC Validator Tool
// Validate IBAN mod-97 checksum, decode country/bank/account segments; validate SWIFT/BIC structure

export {}; // Make this a module so Vite includes it

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

let isProcessing = false;

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
/* IBAN Validation                                                     */
/* ------------------------------------------------------------------ */

const IBAN_COUNTRY_LENGTHS = {
  'AL': 28, 'AD': 24, 'AT': 20, 'AZ': 28, 'BH': 22, 'BY': 28, 'BE': 16,
  'BA': 20, 'BR': 29, 'BG': 22, 'CR': 22, 'HR': 21, 'CY': 28, 'CZ': 24,
  'DK': 18, 'DO': 28, 'EE': 20, 'FO': 18, 'FI': 18, 'FR': 27, 'GE': 22,
  'DE': 22, 'GI': 23, 'GR': 27, 'GL': 18, 'GT': 28, 'HU': 28, 'IS': 26,
  'IQ': 23, 'IE': 22, 'IL': 23, 'IT': 27, 'JO': 30, 'KZ': 20, 'XK': 20,
  'KW': 30, 'LV': 21, 'LB': 28, 'LI': 21, 'LT': 20, 'LU': 20, 'MK': 19,
  'MT': 31, 'MR': 27, 'MU': 24, 'MC': 27, 'MD': 24, 'ME': 22, 'NL': 18,
  'NO': 15, 'PK': 24, 'PS': 29, 'PL': 28, 'PT': 25, 'QA': 29, 'RO': 24,
  'LC': 24, 'SM': 27, 'ST': 25, 'SA': 24, 'RS': 22, 'SC': 27, 'SK': 24,
  'SI': 19, 'ES': 24, 'SE': 24, 'CH': 21, 'TL': 23, 'TN': 24, 'TR': 26,
  'UA': 29, 'AE': 23, 'GB': 22, 'VG': 24
};

function validateIBAN(iban) {
  // Remove spaces and convert to uppercase
  const cleanIban = iban.replace(/\s+/g, '').toUpperCase();
  
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(cleanIban)) {
    return { valid: false, error: 'Invalid IBAN format. Must be letters followed by digits and alphanumeric characters.' };
  }

  const countryCode = cleanIban.substring(0, 2);
  const countryLength = IBAN_COUNTRY_LENGTHS[countryCode];
  
  if (!countryLength) {
    return { valid: false, error: `Unknown country code: ${countryCode}` };
  }
  
  if (cleanIban.length !== countryLength) {
    return { 
      valid: false, 
      error: `Invalid IBAN length for ${countryCode}. Expected ${countryLength} characters, got ${cleanIban.length}` 
    };
  }

  // Mod-97 check: rearrange so country code moves to end
  const rearranged = cleanIban.substring(4) + cleanIban.substring(0, 4);
  
  // Convert letters to numbers (A=10, B=11, ..., Z=35)
  let numberString = '';
  for (let i = 0; i < rearranged.length; i++) {
    const charCode = rearranged.charCodeAt(i);
    if (charCode >= 65 && charCode <= 90) { // A-Z
      numberString += (charCode - 55).toString();
    } else {
      numberString += rearranged[i];
    }
  }

  // Calculate mod-97 using BigInt for large numbers
  const bigInt = BigInt(numberString);
  const remainder = Number(bigInt % 97n);
  
  if (remainder !== 1) {
    return { valid: false, error: `Invalid IBAN checksum. Mod-97 check failed (remainder: ${remainder})` };
  }

  // Decode segments
  const bban = cleanIban.substring(4);
  let bankCode = '';
  let accountNumber = '';
  
  switch (countryCode) {
    case 'DE': // Germany
      bankCode = bban.substring(0, 8);
      accountNumber = bban.substring(8);
      break;
    case 'GB': // United Kingdom
      bankCode = bban.substring(0, 4);
      accountNumber = bban.substring(8);
      break;
    case 'FR': // France
      bankCode = bban.substring(0, 5);
      const branchCode = bban.substring(5, 10);
      accountNumber = bban.substring(10);
      break;
    case 'ES': // Spain
      bankCode = bban.substring(0, 4);
      const branchCode = bban.substring(4, 8);
      accountNumber = bban.substring(12);
      break;
    case 'IT': // Italy
      bankCode = bban.substring(0, 1);
      const checkDigit = bban.substring(1, 2);
      const branchCode = bban.substring(2, 7);
      accountNumber = bban.substring(7);
      break;
    case 'NL': // Netherlands
      bankCode = bban.substring(0, 4);
      accountNumber = bban.substring(4);
      break;
    default:
      // Generic decoding for other countries
      bankCode = bban.substring(0, Math.ceil(bban.length / 2));
      accountNumber = bban.substring(Math.ceil(bban.length / 2));
      break;
  }

  return {
    valid: true,
    countryCode: countryCode,
    checkDigits: cleanIban.substring(2, 4),
    bankCode: bankCode,
    branchCode: '', // Country-specific decoding would be needed for full accuracy
    accountNumber: accountNumber,
    iban: cleanIban
  };
}

/* ------------------------------------------------------------------ */
/* SWIFT/BIC Validation                                                */
/* ------------------------------------------------------------------ */

function validateSWIFTBIC(swift) {
  const cleanSwift = swift.replace(/\s+/g, '').toUpperCase();
  
  if (!/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(cleanSwift)) {
    return { valid: false, error: 'Invalid SWIFT/BIC format. Must be 8 or 11 characters: AAAACCLLBBB' };
  }

  if (cleanSwift.length !== 8 && cleanSwift.length !== 11) {
    return { valid: false, error: `Invalid SWIFT/BIC length. Expected 8 or 11 characters, got ${cleanSwift.length}` };
  }

  const bankCode = cleanSwift.substring(0, 4);
  const countryCode = cleanSwift.substring(4, 6);
  const locationCode = cleanSwift.substring(6, 8);
  const branchCode = cleanSwift.length === 11 ? cleanSwift.substring(8) : '';

  // Basic validation: bank code should be letters only
  if (!/^[A-Z]{4}$/.test(bankCode)) {
    return { valid: false, error: 'Invalid SWIFT/BIC format. Bank code must contain only letters.' };
  }

  // Country code should be ISO 3166-1 alpha-2 (basic check)
  if (!/^[A-Z]{2}$/.test(countryCode)) {
    return { valid: false, error: 'Invalid SWIFT/BIC format. Country code must contain only letters.' };
  }

  // Location code should be alphanumeric
  if (!/^[A-Z0-9]{2}$/.test(locationCode)) {
    return { valid: false, error: 'Invalid SWIFT/BIC format. Location code must contain only alphanumeric characters.' };
  }

  // Branch code (if present) should be alphanumeric
  if (branchCode && !/^[A-Z0-9]{3}$/.test(branchCode)) {
    return { valid: false, error: 'Invalid SWIFT/BIC format. Branch code must contain only alphanumeric characters.' };
  }

  return {
    valid: true,
    bankCode: bankCode,
    countryCode: countryCode,
    locationCode: locationCode,
    branchCode: branchCode || '',
    swift: cleanSwift
  };
}

/* ------------------------------------------------------------------ */
/* UI Rendering                                                        */
/* ------------------------------------------------------------------ */

function updateStatus(message, type) {
  const banner = document.getElementById('iban-swift-status');
  if (!banner) return;

  banner.textContent = message;
  banner.style.display = 'block';
  banner.className = `iban-banner iban-banner--${type}`;
}

/* ------------------------------------------------------------------ */
/* Event Handlers                                                      */
/* ------------------------------------------------------------------ */

async function handleIBANValidate() {
  const ibanInput = document.getElementById('iban-input');
  
  if (!ibanInput || !ibanInput.value.trim()) {
    updateStatus('Please enter an IBAN to validate.', 'warning');
    return;
  }

  isProcessing = true;
  updateStatus('Validating IBAN...', 'info');

  try {
    const result = await new Promise(resolve => setTimeout(() => resolve(validateIBAN(ibanInput.value.trim())), 10));
    
    if (result.valid) {
      displayIBANResult(result);
      updateStatus(`Valid IBAN for ${result.countryCode}!`, 'success');
    } else {
      displayIBANError(result.error);
      updateStatus('Invalid IBAN.', 'error');
    }
  } catch (err) {
    console.error('IBAN validation error:', err);
    isProcessing = false;
    updateStatus(`Error: ${err.message}`, 'error');
  } finally {
    isProcessing = false;
  }
}

function displayIBANResult(result) {
  const outputContainer = $('#iban-output-container');
  if (!outputContainer) return;

  let html = '<div class="glass-card" style="padding: 1.5rem;">';
  html += '<h4 style="margin: 0 0 1rem 0; color: #22c55e;">✓ Valid IBAN</h4>';
  html += `<p><strong>Country:</strong> ${escHtml(result.countryCode)}</p>`;
  html += `<p><strong>Check Digits:</strong> ${escHtml(result.checkDigits)}</p>`;
  html += `<p><strong>Bank Code:</strong> ${escHtml(result.bankCode)}</p>`;
  if (result.accountNumber) {
    html += `<p><strong>Account Number:</strong> ${escHtml(result.accountNumber)}</p>`;
  }
  html += '</div>';

  outputContainer.innerHTML = html;
}

function displayIBANError(error) {
  const outputContainer = $('#iban-output-container');
  if (!outputContainer) return;

  let html = '<div class="glass-card" style="padding: 1.5rem;">';
  html += '<h4 style="margin: 0 0 1rem 0; color: #ef4444;">✗ Invalid IBAN</h4>';
  html += `<p>${escHtml(error)}</p>`;
  html += '</div>';

  outputContainer.innerHTML = html;
}

async function handleSWIFTValidate() {
  const swiftInput = document.getElementById('swift-input');
  
  if (!swiftInput || !swiftInput.value.trim()) {
    updateStatus('Please enter a SWIFT/BIC code to validate.', 'warning');
    return;
  }

  isProcessing = true;
  updateStatus('Validating SWIFT/BIC...', 'info');

  try {
    const result = await new Promise(resolve => setTimeout(() => resolve(validateSWIFTBIC(swiftInput.value.trim())), 10));
    
    if (result.valid) {
      displaySWIFTResult(result);
      updateStatus(`Valid SWIFT/BIC code!`, 'success');
    } else {
      displaySWIFTErrror(result.error);
      updateStatus('Invalid SWIFT/BIC code.', 'error');
    }
  } catch (err) {
    console.error('SWIFT validation error:', err);
    isProcessing = false;
    updateStatus(`Error: ${err.message}`, 'error');
  } finally {
    isProcessing = false;
  }
}

function displaySWIFTResult(result) {
  const outputContainer = $('#swift-output-container');
  if (!outputContainer) return;

  let html = '<div class="glass-card" style="padding: 1.5rem;">';
  html += '<h4 style="margin: 0 0 1rem 0; color: #22c55e;">✓ Valid SWIFT/BIC</h4>';
  html += `<p><strong>Bank Code:</strong> ${escHtml(result.bankCode)}</p>`;
  html += `<p><strong>Country Code:</strong> ${escHtml(result.countryCode)}</p>`;
  html += `<p><strong>Location Code:</strong> ${escHtml(result.locationCode)}</p>`;
  if (result.branchCode) {
    html += `<p><strong>Branch Code:</strong> ${escHtml(result.branchCode)}</p>`;
  }
  html += '</div>';

  outputContainer.innerHTML = html;
}

function displaySWIFTErrror(error) {
  const outputContainer = $('#swift-output-container');
  if (!outputContainer) return;

  let html = '<div class="glass-card" style="padding: 1.5rem;">';
  html += '<h4 style="margin: 0 0 1rem 0; color: #ef4444;">✗ Invalid SWIFT/BIC</h4>';
  html += `<p>${escHtml(error)}</p>`;
  html += '</div>';

  outputContainer.innerHTML = html;
}

/* ------------------------------------------------------------------ */
/* Reset State                                                         */
/* ------------------------------------------------------------------ */

function resetIbanSwiftState() {
  isProcessing = false;

  // Clear IBAN input
  const ibanInput = document.getElementById('iban-input');
  if (ibanInput) ibanInput.value = '';

  // Clear SWIFT input
  const swiftInput = document.getElementById('swift-input');
  if (swiftInput) swiftInput.value = '';

  // Clear output containers
  const ibanOutput = $('#iban-output-container');
  if (ibanOutput) {
    ibanOutput.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.85rem;">Enter an IBAN and click "Validate" to check it.</p>';
  }

  const swiftOutput = $('#swift-output-container');
  if (swiftOutput) {
    swiftOutput.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.85rem;">Enter a SWIFT/BIC code and click "Validate" to check it.</p>';
  }

  // Clear status banner
  const statusBanner = document.getElementById('iban-swift-status');
  if (statusBanner) {
    statusBanner.style.display = 'none';
    statusBanner.textContent = '';
  }
}

/* ------------------------------------------------------------------ */
/* Event Wiring                                                        */
/* ------------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
  // IBAN validate button
  const btnValidateIBAN = document.getElementById('btn-iban-validate');
  if (btnValidateIBAN) {
    btnValidateIBAN.addEventListener('click', handleIBANValidate);
  }

  // SWIFT validate button
  const btnValidateSWIFT = document.getElementById('btn-swift-validate');
  if (btnValidateSWIFT) {
    btnValidateSWIFT.addEventListener('click', handleSWIFTValidate);
  }

  // Back button
  const btnBack = document.getElementById('btn-iban-swift-back');
  if (btnBack) {
    btnBack.addEventListener('click', () => navigateTo('home'));
  }

  // Initial state
  resetIbanSwiftState();
});

// Expose for navigation integration
window.resetIbanSwiftState = resetIbanSwiftState;
