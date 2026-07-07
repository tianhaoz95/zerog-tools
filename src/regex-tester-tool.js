// Regex Tester with Live Preview — client-side tool for testing regex patterns against text
// No server round-trips; uses native RegExp API for pattern matching

const REGEX_CONFIG = {
  // Default flags for regex testing
  DEFAULT_FLAGS: 'gi',
};

// Initialize the Regex Tester tool
function initRegexTester() {
  const patternInput = document.getElementById('regex-pattern-input');
  const textArea = document.getElementById('regex-text-input');
  const outputArea = document.getElementById('regex-output');

  if (!patternInput || !textArea || !outputArea) return;

  // Live preview - update on input change with debounce
  let timeout;
  patternInput.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => handleLivePreview(), 300);
  });

  textArea.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => handleLivePreview(), 300);
  });

  // Initial preview
  handleLivePreview();
}

async function handleLivePreview() {
  const patternInput = document.getElementById('regex-pattern-input');
  const textArea = document.getElementById('regex-text-input');
  const outputArea = document.getElementById('regex-output');

  if (!patternInput || !textArea || !outputArea) return;

  const patternStr = patternInput.value.trim();
  const text = textArea.value;

  if (!patternStr) {
    showStatus('Please enter a regex pattern to test.', 'error');
    outputArea.innerHTML = '<div class="glass-card" style="padding: 1rem;">Enter a regex pattern and sample text above to see live matches.</div>';
    return;
  }

  try {
    // Create RegExp from pattern with default flags
    const flags = REGEX_CONFIG.DEFAULT_FLAGS;
    let regex;
    try {
      regex = new RegExp(patternStr, flags);
    } catch (err) {
      showStatus(`Invalid regex: ${err.message}`, 'error');
      outputArea.innerHTML = `<div class="glass-card" style="padding: 1rem; color: #ef4444;">Regex error: ${escapeHtml(err.message)}</div>`;
      return;
    }

    // Test against text and get all matches
    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        index: match.index,
        value: match[0],
        captureGroups: match.slice(1),
      });

      // Prevent infinite loop for zero-length matches
      if (match[0].length === 0) {
        regex.lastIndex++;
      }
    }

    // Display results with highlighted text and capture group breakdown
    const outputHTML = formatRegexResults(text, matches, patternStr);
    outputArea.innerHTML = outputHTML;
    showStatus(`Found ${matches.length} match(es)`, 'success');

  } catch (err) {
    showStatus(`Error: ${err.message}`, 'error');
  }
}

function formatRegexResults(text, matches, patternStr) {
  if (!text || text.length === 0) {
    return '<div class="glass-card" style="padding: 1rem;">Enter sample text above to see matches.</div>';
  }

  let html = '';

  // Pattern info
  html += '<div style="margin-bottom: 1rem; padding: 0.8rem; background: rgba(99, 102, 241, 0.1); border-radius: 6px;">';
  html += `<strong>Pattern:</strong> <code>/${escapeHtml(patternStr)}/${REGEX_CONFIG.DEFAULT_FLAGS}</code>`;
  html += ` — Found ${matches.length} match(es)`;
  html += '</div>';

  // Highlighted text with matches
  if (matches.length > 0) {
    let highlightedText = '';
    let lastIndex = 0;

    for (const match of matches) {
      // Add non-matching text before this match
      highlightedText += escapeHtml(text.slice(lastIndex, match.index));

      // Highlight the matched portion
      const bgColor = 'rgba(99, 102, 241, 0.3)';
      highlightedText += `<span style="background: ${bgColor}; padding: 0.2rem 0.3rem; border-radius: 3px;">${escapeHtml(match.value)}</span>`;

      lastIndex = match.index + match.value.length;
    }

    // Add remaining text after last match
    highlightedText += escapeHtml(text.slice(lastIndex));

    html += '<div class="glass-card" style="margin-bottom: 1rem;">';
    html += '<strong>Highlighted Text:</strong>';
    html += `<pre style="margin-top: 0.5rem; padding: 1rem; background: rgba(0, 0, 0, 0.3); border-radius: 6px; overflow-x: auto;">${highlightedText}</pre>`;
    html += '</div>';

    // Capture group breakdown
    if (matches.some(m => m.captureGroups.length > 0)) {
      html += '<h4 style="margin-top: 1.5rem; margin-bottom: 0.8rem;">Capture Groups:</h4>';
      matches.forEach((match, index) => {
        if (match.captureGroups.length > 0) {
          html += `<div class="glass-card" style="margin-bottom: 0.5rem;">`;
          html += `<strong>Match ${index + 1}:</strong>`;
          match.captureGroups.forEach((group, groupIndex) => {
            if (group !== undefined && group !== null) {
              html += `<div style="padding-left: 1rem;"><code>${escapeHtml(String(group))}</code></div>`;
            }
          });
          html += '</div>';
        }
      });
    }

    // Match details table
    if (matches.length > 0 && matches.length <= 20) {
      html += '<h4 style="margin-top: 1.5rem; margin-bottom: 0.8rem;">Match Details:</h4>';
      html += '<div class="glass-card" style="overflow-x: auto;"><table style="width: 100%; border-collapse: collapse;">';
      html += '<tr><th style="padding: 0.5rem; text-align: left; border-bottom: 2px solid rgba(99, 102, 241, 0.3);">Index</th>';
      html += '<th style="padding: 0.5rem; text-align: left; border-bottom: 2px solid rgba(99, 102, 241, 0.3);">Matched Text</th>';

      if (matches[0].captureGroups.length > 0) {
        for (let i = 0; i < matches[0].captureGroups.length; i++) {
          html += `<th style="padding: 0.5rem; text-align: left; border-bottom: 2px solid rgba(99, 102, 241, 0.3);">Group ${i + 1}</th>`;
        }
      }
      html += '</tr>';

      matches.forEach(match => {
        html += '<tr style="border-bottom: 1px solid rgba(99, 102, 241, 0.1);">';
        html += `<td style="padding: 0.5rem;">${match.index}</td>`;
        html += `<td style="padding: 0.5rem;"><code>${escapeHtml(match.value)}</code></td>`;

        if (matches[0].captureGroups.length > 0) {
          match.captureGroups.forEach(group => {
            html += `<td style="padding: 0.5rem;"><code>${escapeHtml(String(group || ''))}</code></td>`;
          });
        }
        html += '</tr>';
      });

      html += '</table></div>';
    }
  } else {
    html += '<div class="glass-card" style="padding: 1rem;">No matches found.</div>';
  }

  return html;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showStatus(message, type = 'info') {
  const statusEl = document.getElementById('regex-status');
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.className = `glass-card json-formatter-banner ${type}`;
  statusEl.style.display = 'block';
}

// Export for use by main.js navigation handler
if (typeof window !== 'undefined') {
  window.initRegexTester = initRegexTester;
}
