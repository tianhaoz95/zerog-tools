// CSV to JSON Converter — client-side tool for converting CSV data to JSON format
// No server round-trips; all processing happens in-browser

const CSV_CONFIG = {
  MAX_ROWS: 1000,
  DEFAULT_DELIMITER: ',',
};

// Parse CSV string into array of arrays
function parseCSV(csvText, delimiter) {
  const lines = csvText.trim().split(/\r\n|\n/);
  if (lines.length === 0) return [];

  const result = [];
  for (const line of lines) {
    // Simple CSV parsing - handles quoted fields with commas inside
    const row = [];
    let inQuotes = false;
    let currentField = '';

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
          // Escaped quote
          currentField += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        row.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }

    // Add last field
    row.push(currentField.trim());
    result.push(row);
  }

  return result;
}

// Infer type of a value
function inferType(value) {
  if (value === '' || value === undefined || value === null) {
    return null; // Empty/null
  }

  // Try boolean
  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;

  // Try number
  const num = Number(value);
  if (!isNaN(num) && value !== '' && !isNaN(Number(value))) {
    return num;
  }

  // Return as string
  return value;
}

// Convert CSV to JSON with header detection and type inference
function csvToJson(csvText, hasHeaders = true, delimiter = ',') {
  const rows = parseCSV(csvText, delimiter);
  if (rows.length === 0) return [];

  let headers;
  let dataRows;

  if (hasHeaders && rows.length > 1) {
    headers = rows[0];
    dataRows = rows.slice(1);
  } else {
    // Auto-generate column names
    const maxCols = Math.max(...rows.map(r => r.length));
    headers = Array.from({ length: maxCols }, (_, i) => `column_${i + 1}`);
    dataRows = rows;
  }

  if (dataRows.length === 0) return [];

  // Convert to array of objects
  const result = [];
  for (const row of dataRows) {
    const obj = {};
    for (let i = 0; i < headers.length; i++) {
      const value = row[i] || '';
      obj[headers[i]] = inferType(value);
    }
    result.push(obj);
  }

  return result;
}

// Validate JSON syntax
function validateJSON(jsonStr) {
  try {
    JSON.parse(jsonStr);
    return { valid: true, error: null };
  } catch (err) {
    return { valid: false, error: err.message };
  }
}

// Initialize the CSV to JSON converter tool
function initCsvToJsonConverter() {
  const csvInput = document.getElementById('csv-input');
  const fileUpload = document.getElementById('csv-file-upload');
  const btnConvert = document.getElementById('btn-convert-csv');
  const outputArea = document.getElementById('json-output');

  if (!csvInput || !fileUpload || !btnConvert || !outputArea) return;

  // File upload handler
  fileUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      csvInput.value = event.target.result;
      showStatus(`Loaded ${file.name}`, 'success');
    };
    reader.onerror = () => {
      showStatus('Error reading file', 'error');
    };
    reader.readAsText(file);
  });

  // Convert button handler
  btnConvert.addEventListener('click', handleCsvConversion);
}

async function handleCsvConversion() {
  const csvInput = document.getElementById('csv-input');
  const outputArea = document.getElementById('json-output');
  const hasHeadersCheckbox = document.getElementById('has-headers');
  const delimiterSelect = document.getElementById('delimiter-select');

  if (!csvInput || !outputArea) return;

  const csvText = csvInput.value.trim();
  if (!csvText) {
    showStatus('Please enter CSV data or upload a file.', 'error');
    return;
  }

  try {
    // Parse and convert
    const hasHeaders = hasHeadersCheckbox?.checked ?? true;
    const delimiter = delimiterSelect?.value || ',';

    const jsonData = csvToJson(csvText, hasHeaders, delimiter);

    if (jsonData.length === 0) {
      showStatus('No data to convert. Please check your CSV input.', 'error');
      return;
    }

    // Format JSON with indentation
    const jsonStr = JSON.stringify(jsonData, null, 2);

    // Validate before displaying
    const validation = validateJSON(jsonStr);
    if (!validation.valid) {
      showStatus(`Invalid JSON: ${validation.error}`, 'error');
      return;
    }

    // Display output
    outputArea.value = jsonStr;
    showStatus(`Converted ${jsonData.length} rows successfully!`, 'success');

  } catch (err) {
    showStatus(`Conversion error: ${err.message}`, 'error');
  }
}

function showStatus(message, type = 'info') {
  const statusEl = document.getElementById('csv-status');
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.className = `glass-card csv-converter-banner ${type}`;
  statusEl.style.display = 'block';
}

// Export for use by main.js navigation handler
if (typeof window !== 'undefined') {
  window.initCsvToJsonConverter = initCsvToJsonConverter;
}
