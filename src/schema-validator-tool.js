// ZeroG Toolbox — JSON Schema Validator
// Validates data instances against JSON Schemas using Ajv.

import Ajv from 'ajv';

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

const ajv = new Ajv({ allErrors: true, verbose: false });
let lastResultText = '';

/* ------------------------------------------------------------------ */
/* DOM References                                                      */
/* ------------------------------------------------------------------ */

const schemaInput = document.getElementById('json-schema-validator-schema');
const dataInput = document.getElementById('json-schema-validator-data');
const btnValidate = document.getElementById('btn-validate-schema');
const btnClear = document.getElementById('btn-clear-validator');
const statusBanner = document.getElementById('json-schema-validator-status-banner');
const errorDisplay = document.getElementById('json-schema-validator-error-display');
const codeDisplay = document.getElementById('json-schema-validator-code-display');
const btnCopy = document.getElementById('btn-copy-validator');

/* ------------------------------------------------------------------ */
/* Quick Templates                                                     */
/* ------------------------------------------------------------------ */

const TEMPLATES = {
  user: {
    schema: JSON.stringify({
      type: 'object',
      properties: {
        id: { type: 'integer', minimum: 1 },
        name: { type: 'string', minLength: 2 },
        email: { type: 'string', format: 'email' },
        age: { type: 'number', minimum: 0, maximum: 150 },
        active: { type: 'boolean' }
      },
      required: ['id', 'name', 'email'],
      additionalProperties: false
    }, null, 2),
    data: JSON.stringify({
      id: 1,
      name: 'Alice Smith',
      email: 'alice@example.com',
      age: 30,
      active: true
    }, null, 2)
  },

  array: {
    schema: JSON.stringify({
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          title: { type: 'string', minLength: 1 },
          completed: { type: 'boolean' }
        },
        required: ['id', 'title'],
        additionalProperties: false
      },
      minItems: 1
    }, null, 2),
    data: JSON.stringify([
      { id: 1, title: 'First task', completed: false },
      { id: 2, title: 'Second task', completed: true }
    ], null, 2)
  },

  nested: {
    schema: JSON.stringify({
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            profile: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                age: { type: 'integer', minimum: 0 },
                address: {
                  type: 'object',
                  properties: {
                    city: { type: 'string' },
                    country: { type: 'string' }
                  },
                  required: ['city']
                }
              },
              required: ['name']
            }
          },
          required: ['id', 'profile']
        }
      },
      required: ['user'],
      additionalProperties: false
    }, null, 2),
    data: JSON.stringify({
      user: {
        id: 1,
        profile: {
          name: 'Alice',
          age: 30,
          address: { city: 'NYC', country: 'US' }
        }
      }
    }, null, 2)
  }
};

/* ------------------------------------------------------------------ */
/* Core Validation                                                     */
/* ------------------------------------------------------------------ */

function validate() {
  const schemaStr = (schemaInput?.value || '').trim();
  const dataStr = (dataInput?.value || '').trim();

  // Clear previous results
  hideStatus();
  hideErrorDisplay();
  codeDisplay.textContent = 'Validating…';
  btnCopy.disabled = true;
  lastResultText = '';

  if (!schemaStr) {
    showStatus('⚠️ Please paste a JSON Schema', 'warning');
    return;
  }

  if (!dataStr) {
    showStatus('⚠️ Please paste a data instance', 'warning');
    return;
  }

  // Parse schema
  let schema;
  try {
    schema = JSON.parse(schemaStr);
  } catch (e) {
    showErrorDisplay(`Invalid JSON Schema: ${e.message}`);
    showStatus('❌ Invalid JSON', 'error');
    return;
  }

  // Parse data instance
  let data;
  try {
    data = JSON.parse(dataStr);
  } catch (e) {
    showErrorDisplay(`Invalid Data Instance: ${e.message}`);
    showStatus('❌ Invalid JSON', 'error');
    return;
  }

  // Compile schema and validate
  let validate;
  try {
    validate = ajv.compile(schema);
  } catch (e) {
    showErrorDisplay(`Schema compilation failed: ${e.message}`);
    showStatus('❌ Schema Error', 'error');
    return;
  }

  const valid = validate(data);

  if (valid) {
    lastResultText = `✅ Validation Passed\n\nThe data instance is valid according to the provided JSON Schema.\n\nSchema: ${JSON.stringify(schema, null, 2).slice(0, 100)}…\nData:   ${JSON.stringify(data, null, 2).slice(0, 100)}…`;
    codeDisplay.textContent = `✅ Validation Passed

The data instance is valid according to the provided JSON Schema.

✓ All required fields present
✓ Types match schema definitions
✓ No additional properties (if constrained)
✓ Format constraints satisfied`;
    btnCopy.disabled = false;
    showStatus('✅ Validation passed!', 'success');
  } else {
    const errors = formatErrors(validate.errors);
    lastResultText = `❌ Validation Failed — ${validate.errors.length} error(s)\n\n${errors}`;

    codeDisplay.textContent = `❌ Validation Failed — ${validate.errors.length} error(s)

${errors}`;
    btnCopy.disabled = false;
    showStatus(`❌ Found ${validate.errors.length} error(s)`, 'error');
  }
}

function formatErrors(errors) {
  if (!errors || errors.length === 0) return '(no error details)';

  return errors.map((err, i) => {
    const path = err.instancePath || '/(root)';
    const keyword = err.keyword;
    const message = err.message;
    return `${i + 1}. ${path}\n   → ${message} [${keyword}]`;
  }).join('\n\n');
}

/* ------------------------------------------------------------------ */
/* Display Helpers                                                     */
/* ------------------------------------------------------------------ */

function showStatus(message, type) {
  if (!statusBanner) return;
  statusBanner.style.display = 'block';
  statusBanner.textContent = message;

  const styles = {
    success: { bg: 'rgba(34,197,94,.12)', border: '1px solid #22c55e', color: '#22c55e' },
    error:   { bg: 'rgba(239,68,68,.12)',  border: '1px solid #ef4444', color: '#ef4444' },
    warning: { bg: 'rgba(245,158,11,.12)',  border: '1px solid #f59e0b', color: '#f59e0b' }
  };

  const s = styles[type] || styles.warning;
  statusBanner.style.background = s.bg;
  statusBanner.style.border = s.border;
  statusBanner.style.color = s.color;
}

function hideStatus() {
  if (!statusBanner) return;
  statusBanner.style.display = 'none';
  statusBanner.textContent = '';
}

function showErrorDisplay(message) {
  if (!errorDisplay) return;
  errorDisplay.style.display = 'block';
  errorDisplay.innerHTML = `<div style="padding: 0.75rem 1rem; border-radius: var(--radius-sm); background: rgba(239,68,68,.1); border: 1px solid #ef4444; color: #ef4444; font-size: 0.85rem;">
    <strong>❌ Error:</strong><br/>${message}
  </div>`;
}

function hideErrorDisplay() {
  if (!errorDisplay) return;
  errorDisplay.style.display = 'none';
  errorDisplay.innerHTML = '';
}

/* ------------------------------------------------------------------ */
/* Copy                                                                */
/* ------------------------------------------------------------------ */

function copyResult() {
  if (!lastResultText) return;

  navigator.clipboard.writeText(lastResultText).then(() => {
    btnCopy.textContent = '✓ Copied!';
    setTimeout(() => { btnCopy.textContent = '📋 Copy Result'; }, 2000);
  }).catch(() => {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = lastResultText;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    alert('Copied to clipboard!');
  });
}

/* ------------------------------------------------------------------ */
/* Reset State                                                         */
/* ------------------------------------------------------------------ */

function resetSchemaValidatorState() {
  if (schemaInput) schemaInput.value = '';
  if (dataInput) dataInput.value = '';
  hideStatus();
  hideErrorDisplay();
  codeDisplay.textContent = 'Paste schema and data, then click "Validate"';
  btnCopy.disabled = true;
  lastResultText = '';
}

/* ------------------------------------------------------------------ */
/* Event Wiring                                                        */
/* ------------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
  // Validate button
  if (btnValidate) {
    btnValidate.addEventListener('click', validate);
  }

  // Clear button
  if (btnClear) {
    btnClear.addEventListener('click', resetSchemaValidatorState);
  }

  // Copy button
  if (btnCopy) {
    btnCopy.addEventListener('click', copyResult);
  }

  // Quick templates
  document.querySelectorAll('.schema-template-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const template = TEMPLATES[btn.dataset.template];
      if (!template) return;

      if (schemaInput) schemaInput.value = template.schema;
      if (dataInput) dataInput.value = template.data;
      hideStatus();
      hideErrorDisplay();
      codeDisplay.textContent = 'Template loaded. Click "Validate" to test.';
      btnCopy.disabled = true;
      lastResultText = '';

      // Scroll schema into view
      if (schemaInput) {
        schemaInput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  // Initial state
  resetSchemaValidatorState();
});

// Expose for navigation integration
window.resetSchemaValidatorState = resetSchemaValidatorState;
