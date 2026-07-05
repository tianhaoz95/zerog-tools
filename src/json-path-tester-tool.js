// JSON Path Tester — client-side tool for testing JSONPath queries against JSON data
// No server round-trips; uses jsonpath-plus library loaded from CDN for query execution

const JSONPATH_CONFIG = {
  // Default sample JSON for demonstration
  SAMPLE_JSON: JSON.stringify({
    store: {
      book: [
        { category: 'reference', author: 'Nigel Rees', title: 'Sayings of the Century', price: 8.95 },
        { category: 'fiction', author: 'Evelyn Waugh', title: 'Sword of Honour', price: 12.99 },
        { category: 'fiction', author: 'Herman Melville', title: 'Moby Dick', isbn: '0-553-21311-3', price: 8.99 },
        { category: 'fiction', author: 'J. R. R. Tolkien', title: 'The Lord of the Rings', isbn: '0-395-19395-8', price: 22.99 }
      ],
      bible: { category: 'reference', author: 'Dennis', title: 'The Bible', price: 8.99 }
    }
  }, null, 2),

  // Default JSONPath query for demonstration
  SAMPLE_QUERY: '$..author'
};

// Initialize the JSON Path Tester tool
function initJsonPathTester() {
  const jsonInput = document.getElementById('jsonpath-json-input');
  const queryInput = document.getElementById('jsonpath-query-input');
  const btnTest = document.getElementById('btn-test-JSONPath');
  const outputArea = document.getElementById('jsonpath-output');

  if (!jsonInput || !queryInput || !btnTest || !outputArea) return;

  // Test button handler
  btnTest.addEventListener('click', handleTestJsonPath);

  // Load sample data on initialization (optional, for demo purposes)
  jsonInput.value = JSONPATH_CONFIG.SAMPLE_JSON;
  queryInput.value = JSONPATH_CONFIG.SAMPLE_QUERY;
}

async function handleTestJsonPath() {
  const jsonInput = document.getElementById('jsonpath-json-input');
  const queryInput = document.getElementById('jsonpath-query-input');
  const outputArea = document.getElementById('jsonpath-output');

  if (!jsonInput || !queryInput || !outputArea) return;

  const jsonString = jsonInput.value.trim();
  const query = queryInput.value.trim();

  if (!jsonString) {
    showStatus('Please enter JSON data to test against.', 'error');
    return;
  }

  if (!query) {
    showStatus('Please enter a JSONPath query to test.', 'error');
    return;
  }

  try {
    // Check if jsonpath-plus is loaded
    if (typeof JSONPath === 'undefined') {
      throw new Error('JSONPath library not loaded. Please refresh the page.');
    }

    // Parse JSON data
    let jsonData;
    try {
      jsonData = JSON.parse(jsonString);
    } catch (err) {
      throw new Error(`Invalid JSON: ${err.message}`);
    }

    // Execute JSONPath query
    const results = JSONPath({ path: query, json: jsonData });

    // Display results with path visualization
    let outputHTML = formatJsonPathResults(results, query);
    outputArea.value = outputHTML;
    showStatus(`Found ${results.length} result(s)`, 'success');

  } catch (err) {
    showStatus(`Query error: ${err.message}`, 'error');
  }
}

function formatJsonPathResults(results, query) {
  if (!results || results.length === 0) {
    return '<div class="glass-card" style="padding: 1rem;">No results found for this query.</div>';
  }

  let html = '<div style="margin-bottom: 1rem; padding: 0.8rem; background: rgba(99, 102, 241, 0.1); border-radius: 6px;">';
  html += `<strong>Query:</strong> <code>${query}</code>`;
  html += ` — Found ${results.length} result(s)`;
  html += '</div>';

  results.forEach((result, index) => {
    const formattedResult = typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result);
    html += '<div class="glass-card" style="margin-bottom: 0.5rem;">';
    html += `<strong>Result ${index + 1}:</strong>`;
    html += '<pre style="margin-top: 0.5rem; padding: 0.8rem; background: rgba(0, 0, 0, 0.3); border-radius: 6px; overflow-x: auto;">' + escapeHtml(formattedResult) + '</pre>';
    html += '</div>';
  });

  return html;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showStatus(message, type = 'info') {
  const statusEl = document.getElementById('jsonpath-status');
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.className = `glass-card json-formatter-banner ${type}`;
  statusEl.style.display = 'block';
}

// Export for use by main.js navigation handler
if (typeof window !== 'undefined') {
  window.initJsonPathTester = initJsonPathTester;
}
