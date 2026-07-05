// ZeroG Toolbox — OpenAPI / Swagger Spec Explorer & Validator
// Client-side only: parses, validates, and explores OpenAPI 3.x specs.

import { parse } from 'yaml';

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

let currentSpec = null; // parsed spec object
let currentEndpoint = null; // currently selected endpoint info

const VALID_HTTP_METHODS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];

const METHOD_COLORS = {
  get:    { bg: 'rgba(34,197,94,.15)', color: '#22c55e' },
  post:   { bg: 'rgba(59,130,246,.15)', color: '#3b82f6' },
  put:    { bg: 'rgba(245,158,11,.15)', color: '#f59e0b' },
  patch:  { bg: 'rgba(168,85,247,.15)', color: '#a855f7' },
  delete: { bg: 'rgba(239,68,68,.15)',  color: '#ef4444' },
  options:{ bg: 'rgba(107,114,128,.15)', color: '#6b7280' },
  head:   { bg: 'rgba(107,114,128,.15)', color: '#6b7280' },
  trace:  { bg: 'rgba(107,114,128,.15)', color: '#6b7280' },
};

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
/* Parser                                                              */
/* ------------------------------------------------------------------ */

function parseSpec(raw) {
  raw = raw.trim();
  if (!raw) throw new Error('Input is empty.');

  let parsed;

  // Try JSON first (OpenAPI specs are often JSON)
  try {
    if (raw.startsWith('{') || raw.startsWith('[')) {
      parsed = JSON.parse(raw);
    } else {
      parsed = parse(raw);
    }
  } catch (jsonErr) {
    // If JSON fails, try YAML
    try {
      parsed = parse(raw);
    } catch (yamlErr) {
      throw new Error(
        `Failed to parse: ${jsonErr.message}. Also tried YAML: ${yamlErr.message}`
      );
    }
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Spec must be a JSON/YAML object.');
  }

  return parsed;
}

/* ------------------------------------------------------------------ */
/* Validator                                                           */
/* ------------------------------------------------------------------ */

function validateOpenApi(spec) {
  const errors = [];
  const warnings = [];

  // ── Required top-level fields ────────────────────────────────────
  if (!spec.openapi) {
    errors.push('Missing required <code>openapi</code> version field (e.g. "3.0.0" or "3.1.0")');
  } else if (!/^3\.\d+\.\d+$/.test(String(spec.openapi))) {
    warnings.push(`Unusual openapi version "${escHtml(String(spec.openapi))}" — expected 3.x.x format`);
  }

  if (!spec.info) {
    errors.push('Missing required <code>info</code> object');
  } else {
    if (typeof spec.info !== 'object') {
      errors.push('<code>info</code> must be an object');
    } else {
      if (!spec.info.title || !String(spec.info.title).trim()) {
        errors.push('<code>info.title</code> is required');
      }
      if (!spec.info.version || !String(spec.info.version).trim()) {
        errors.push('<code>info.version</code> is required');
      }
    }
  }

  // ── Paths (optional but expected) ────────────────────────────────
  const paths = spec.paths;
  if (paths === undefined || paths === null) {
    warnings.push('No <code>paths</code> object found — valid but no endpoints.');
  } else if (typeof paths !== 'object' || Array.isArray(paths)) {
    errors.push('<code>paths</code> must be an object');
  }

  // ── Per-path validation ──────────────────────────────────────────
  const pathEntries = paths ? Object.entries(paths) : [];
  for (const [path, pathItem] of pathEntries) {
    if (!String(path).startsWith('/')) {
      warnings.push(`Path "<code>${escHtml(path)}</code>" should start with "/"`);
    }

    if (!pathItem || typeof pathItem !== 'object') continue;

    for (const [method, operation] of Object.entries(pathItem)) {
      const m = method.toLowerCase();

      // Skip non-operation fields (like $ref, parameters at path level)
      if (m.startsWith('$')) continue;

      if (!VALID_HTTP_METHODS.includes(m)) {
        warnings.push(
          `Unknown key "<code>${escHtml(method)}</code>" in <code>${escHtml(path)}</code> — not a valid HTTP method`
        );
        continue;
      }

      if (operation && typeof operation === 'object') {
        const ctx = `${m.toUpperCase()} ${path}`;

        // Summary / description
        if (!operation.summary && !operation.description) {
          warnings.push(`Operation <code>${escHtml(ctx)}</code> missing both summary and description`);
        }

        // Parameters
        validateParameters(operation.parameters || [], ctx, errors, warnings);

        // Request body (only for methods that support it)
        if (['post', 'put', 'patch'].includes(m) && operation.requestBody) {
          validateRequestBody(operation.requestBody, ctx, errors, warnings);
        }

        // Responses
        if (!operation.responses || typeof operation.responses !== 'object') {
          errors.push(`Operation <code>${escHtml(ctx)}</code> missing <code>responses</code> object`);
        } else {
          for (const [code] of Object.entries(operation.responses)) {
            const resp = operation.responses[code];
            if (resp && typeof resp === 'object' && !resp.description) {
              warnings.push(`Response "<code>${escHtml(code)}</code>" in <code>${escHtml(ctx)}</code> missing description`);
            }
          }
        }

        // Tags (informational only — not required by OpenAPI spec)
      }
    }

    // Path-level parameters
    if (Array.isArray(pathItem.parameters)) {
      validateParameters(pathItem.parameters, `PATH ${path}`, errors, warnings);
    }
  }

  // ── Servers ──────────────────────────────────────────────────────
  if (!spec.servers || spec.servers.length === 0) {
    warnings.push('No <code>servers</code> defined — URLs may be relative or absolute.');
  } else {
    for (let i = 0; i < spec.servers.length; i++) {
      const server = spec.servers[i];
      if (!server.url || !String(server.url).trim()) {
        errors.push(`Server entry #${i + 1} missing required <code>url</code>`);
      }
    }
  }

  // ── Components / Schemas (informational) ─────────────────────────
  if (!spec.components && pathEntries.length > 0) {
    warnings.push('No <code>components</code> section — consider defining reusable schemas.');
  }

  return { errors, warnings };
}

function validateParameters(params, context, errors, warnings) {
  for (const param of params) {
    if (!param.name || !String(param.name).trim()) {
      errors.push(`${context}: parameter missing <code>name</code>`);
    } else if (!param.in) {
      // Only warn if path doesn't have path params to infer from
      warnings.push(
        `${context} parameter "<code>${escHtml(param.name)}</code>" missing <code>in</code> field`
      );
    }

    if (param.schema && typeof param.schema === 'object' && !param.schema.type) {
      warnings.push(
        `Parameter "<code>${escHtml(param.name)}</code>" schema missing <code>type</code>`
      );
    }
  }
}

function validateRequestBody(body, context, errors, warnings) {
  if (typeof body !== 'object' || Array.isArray(body)) {
    errors.push(`${context}: requestBody must be an object`);
    return;
  }

  if (body.content && typeof body.content === 'object') {
    const mediaTypes = Object.keys(body.content);
    if (mediaTypes.length === 0) {
      warnings.push(`${context}: requestBody.content is empty`);
    } else {
      for (const [mediaType, mediaObj] of Object.entries(body.content)) {
        if (!mediaObj || typeof mediaObj !== 'object') continue;
        if (!mediaObj.schema) {
          warnings.push(
            `Media type "<code>${escHtml(mediaType)}</code>" in ${context} missing <code>schema</code>`
          );
        } else if (typeof mediaObj.schema === 'object' && !mediaObj.schema.type) {
          // Schema-less references are fine, skip warning for $ref
          if (!mediaObj.schema.$ref) {
            warnings.push(
              `Schema in "<code>${escHtml(mediaType)}</code>" of ${context} missing <code>type</code>`
            );
          }
        }
      }
    }

    // Check for unsupported media types
    const unsupported = Object.keys(body.content).filter(
      (mt) => !['application/json', 'application/xml', 'multipart/form-data', 'application/x-www-form-urlencoded'].includes(mt)
    );
    if (unsupported.length > 0) {
      warnings.push(`${context}: requestBody uses non-standard media types: ${unsupported.map((m) => `<code>${escHtml(m)}</code>`).join(', ')}`);
    }
  } else if (!body.$ref && !body.description) {
    warnings.push(`${context}: requestBody should have <code>content</code>, <code>$ref</code>, or <code>description</code>`);
  }
}

/* ------------------------------------------------------------------ */
/* Endpoint tree renderer                                              */
/* ------------------------------------------------------------------ */

function renderEndpointTree(spec, container) {
  const paths = spec.paths || {};
  container.innerHTML = '';
  let count = 0;

  for (const [path, pathItem] of Object.entries(paths)) {
    if (!pathItem || typeof pathItem !== 'object') continue;

    // Collect methods for this path
    const methods = VALID_HTTP_METHODS.filter((m) => pathItem[m]);

    if (methods.length === 0) continue;
    count += methods.length;

    // Path group wrapper
    const group = document.createElement('div');
    group.className = 'openapi-path-group';
    group.style.cssText = 'margin-bottom: 0.5rem; border-bottom: 1px solid var(--border, #2a2a2e); padding-bottom: 0.4rem;';

    // Path header (collapsible)
    const header = document.createElement('div');
    header.className = 'openapi-path-header';
    header.style.cssText = 'display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.6rem; background: rgba(255,255,255,.03); border-radius: var(--radius-sm); cursor: pointer; user-select: none; transition: background .15s;';
    header.innerHTML = `
      <span class="openapi-expand-icon" style="font-size: 0.7rem; transition: transform .2s;">▶</span>
      <code style="color: var(--primary, #8b5cf6); font-size: 0.85rem; flex: 1;">${escHtml(path)}</code>
      <span class="openapi-method-count" style="font-size: 0.7rem; color: var(--text-secondary);">${methods.length} method${methods.length > 1 ? 's' : ''}</span>
    `;

    const content = document.createElement('div');
    content.className = 'openapi-path-content';
    content.style.cssText = 'display: none; margin-left: 1.2rem; padding-top: 0.35rem; flex-direction: column; gap: 0.2rem;';

    let expanded = false;
    header.addEventListener('click', () => {
      expanded = !expanded;
      content.style.display = expanded ? 'flex' : 'none';
      const icon = header.querySelector('.openapi-expand-icon');
      if (icon) icon.textContent = expanded ? '▼' : '▶';
    });

    // Method rows
    for (const method of methods) {
      const op = pathItem[method];
      const colors = METHOD_COLORS[method] || METHOD_COLORS.options;
      const summary = op?.summary || op?.description?.split('\n')[0]?.slice(0, 80) || 'No description';

      const row = document.createElement('div');
      row.className = 'openapi-method-row';
      row.style.cssText = `display: flex; align-items: center; gap: 0.5rem; padding: 0.4rem 0.6rem; border-radius: var(--radius-sm); cursor: pointer; transition: background .15s; font-size: 0.82rem;`;

      const badge = document.createElement('span');
      badge.className = 'openapi-method-badge';
      badge.style.cssText = `background: ${colors.bg}; color: ${colors.color}; font-weight: 600; padding: 0.15rem 0.45rem; border-radius: 3px; font-size: 0.7rem; min-width: 52px; text-align: center;`;
      badge.textContent = method.toUpperCase();

      const desc = document.createElement('span');
      desc.style.cssText = 'color: var(--text-secondary); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';
      desc.textContent = summary;

      row.appendChild(badge);
      row.appendChild(desc);

      // Click to select endpoint
      row.addEventListener('click', (e) => {
        e.stopPropagation();
        selectEndpoint(path, method, op);
      });

      content.appendChild(row);
    }

    group.appendChild(header);
    group.appendChild(content);
    container.appendChild(group);
  }

  if (count === 0) {
    container.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.85rem; text-align: center; padding: 1rem;">No endpoints found in spec.</p>';
  }

  // Update count display
  const countEl = document.getElementById('openapi-endpoint-count');
  if (countEl) countEl.textContent = String(count);
}

/* ------------------------------------------------------------------ */
/* Try-It builder                                                      */
/* ------------------------------------------------------------------ */

function selectEndpoint(path, method, operation) {
  currentEndpoint = { path, method, operation };

  const baseServer = getBaseServer();
  const fullUrl = `${baseServer}${path}`;

  // Populate fields
  document.getElementById('openapi-tryit-method-select').value = method.toUpperCase();
  document.getElementById('openapi-tryit-full-url').value = fullUrl;
  document.getElementById('openapi-endpoint-desc').textContent = operation.description || 'No description';

  // Gather parameters
  const allParams = [...(operation.parameters || [])];
  const pathParams = allParams.filter((p) => p.in === 'path');
  const queryParams = allParams.filter((p) => p.in === 'query');
  const headerParams = allParams.filter((p) => p.in === 'header');

  // Path parameters
  if (pathParams.length > 0) {
    show(document.getElementById('openapi-path-params-section'));
    renderParamInputs(pathParams, 'path');
  } else {
    hide(document.getElementById('openapi-path-params-section'));
  }

  // Query parameters — pre-fill with examples/defaults
  if (queryParams.length > 0) {
    show(document.getElementById('openapi-query-params-section'));
    const queryObj = {};
    queryParams.forEach((p) => {
      queryObj[p.name] = p.example ?? p.default ?? '';
    });
    document.getElementById('openapi-query-params').value = JSON.stringify(queryObj, null, 2);
  } else {
    hide(document.getElementById('openapi-query-params-section'));
  }

  // Headers — merge operation-level headers with global defaults
  const defaultHeaders = {};
  headerParams.forEach((p) => {
    if (p.example || p.default) defaultHeaders[p.name] = p.example ?? p.default;
  });
  document.getElementById('openapi-tryit-headers').value = JSON.stringify(defaultHeaders, null, 2);

  // Request body — only for methods that support it
  const bodyMethods = ['post', 'put', 'patch'];
  if (bodyMethods.includes(method) && operation.requestBody?.content) {
    show(document.getElementById('openapi-tryit-body-wrapper'));
    let schemaJson = '';
    for (const [mediaType, mediaObj] of Object.entries(operation.requestBody.content)) {
      if (mediaObj.schema) {
        schemaJson = JSON.stringify(mediaObj.schema, null, 2);
        break;
      }
    }
    document.getElementById('openapi-tryit-body').value = schemaJson || '// No request body schema defined';
  } else {
    hide(document.getElementById('openapi-tryit-body-wrapper'));
  }

  // Show try-it builder, hide tree display
  show(document.getElementById('openapi-tryit-builder'));
  hide(document.getElementById('openapi-main-output'));
}

function getBaseServer() {
  const override = document.getElementById('openapi-server-url').value.trim();
  if (override) return override.replace(/\/+$/, '');
  const servers = currentSpec?.servers || [];
  if (servers.length > 0 && servers[0]?.url) {
    return servers[0].url.replace(/\/+$/, '');
  }
  return '';
}

function renderParamInputs(params, type) {
  const containerId = 'openapi-path-params-list';
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  for (const param of params) {
    const row = document.createElement('div');
    row.style.cssText = 'display: grid; grid-template-columns: 100px 1fr auto; gap: 0.4rem; align-items: center;';

    const label = document.createElement('span');
    label.style.cssText = 'font-size: 0.8rem; color: var(--text-secondary); font-weight: 500;';
    label.textContent = `{${param.name}}`;

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'input-custom glass-card';
    input.placeholder = param.description || `Value for ${param.name}`;
    input.dataset.paramName = param.name;
    if (param.example) input.value = param.example;

    const badge = document.createElement('span');
    badge.style.cssText = 'font-size: 0.65rem; padding: 0.1rem 0.3rem; background: rgba(239,68,68,.1); color: #ef4444; border-radius: 3px; text-align: center;';
    badge.textContent = 'required';

    row.appendChild(label);
    row.appendChild(input);
    row.appendChild(badge);
    container.appendChild(row);
  }
}

function generateCurlCommand() {
  if (!currentEndpoint) return '';
  const { path, method } = currentEndpoint;
  const baseServer = getBaseServer();
  let url = `${baseServer}${path}`;

  // Fill in path parameters
  const pathParamsSection = document.getElementById('openapi-path-params-section');
  if (pathParamsSection.style.display !== 'none') {
    const inputs = pathParamsSection.querySelectorAll('input[data-param-name]');
    for (const input of inputs) {
      const name = input.dataset.paramName;
      url = url.replace(`{${name}}`, encodeURIComponent(input.value || ''));
    }
  }

  // Add query parameters
  try {
    const queryParams = JSON.parse(document.getElementById('openapi-query-params').value || '{}');
    if (Object.keys(queryParams).length > 0) {
      const sp = new URLSearchParams();
      for (const [k, v] of Object.entries(queryParams)) {
        if (v !== '' && v != null) sp.append(k, String(v));
      }
      url += `?${sp.toString()}`;
    }
  } catch {}

  // Build headers
  const headers = {};
  try {
    Object.assign(headers, JSON.parse(document.getElementById('openapi-tryit-headers').value || '{}'));
  } catch {}

  let curlCmd = `curl -X ${method.toUpperCase()} '${url}'`;
  for (const [key, value] of Object.entries(headers)) {
    if (value) curlCmd += `\n  -H '${key}: ${value}'`;
  }

  // Add body
  const bodySection = document.getElementById('openapi-tryit-body-wrapper');
  if (bodySection.style.display !== 'none') {
    const body = document.getElementById('openapi-tryit-body').value.trim();
    if (body && body !== '// No request body schema defined') {
      curlCmd += `\n  -d '${body.replace(/'/g, "'\\''")}'`;
    }
  }

  return curlCmd;
}

function generateFetchCode() {
  if (!currentEndpoint) return '';
  const { method } = currentEndpoint;
  const baseServer = getBaseServer();
  let url = `${baseServer}${currentEndpoint.path}`;

  // Fill path params
  const pathParamsSection = document.getElementById('openapi-path-params-section');
  if (pathParamsSection.style.display !== 'none') {
    const inputs = pathParamsSection.querySelectorAll('input[data-param-name]');
    for (const input of inputs) {
      url = url.replace(`{${input.dataset.paramName}}`, encodeURIComponent(input.value || ''));
    }
  }

  // Query params
  try {
    const queryParams = JSON.parse(document.getElementById('openapi-query-params').value || '{}');
    if (Object.keys(queryParams).length > 0) {
      const sp = new URLSearchParams();
      for (const [k, v] of Object.entries(queryParams)) {
        if (v !== '') sp.append(k, String(v));
      }
      url += `?${sp.toString()}`;
    }
  } catch {}

  // Headers
  const headers = {};
  try {
    Object.assign(headers, JSON.parse(document.getElementById('openapi-tryit-headers').value || '{}'));
  } catch {}

  let fetchCode = `fetch('${url}', {\n`;
  fetchCode += `  method: '${method.toUpperCase()}',\n`;
  if (Object.keys(headers).length > 0) {
    fetchCode += `  headers: ${JSON.stringify(headers, null, 2)},\n`;
  }

  // Body
  const bodySection = document.getElementById('openapi-tryit-body-wrapper');
  if (bodySection.style.display !== 'none') {
    const body = document.getElementById('openapi-tryit-body').value.trim();
    if (body && body !== '// No request body schema defined') {
      fetchCode += `  body: JSON.stringify(${body})\n`;
    }
  }

  fetchCode += `});`;
  return fetchCode;
}

function showResponseSchema() {
  if (!currentEndpoint?.operation?.responses) return false;

  const responses = currentEndpoint.operation.responses;
  let schemaContent = '';

  for (const [code, response] of Object.entries(responses)) {
    if (!response || !response.content) continue;
    for (const [mediaType, mediaObj] of Object.entries(response.content)) {
      if (mediaObj.schema) {
        const desc = response.description ? `// ${response.description}\n` : '';
        schemaContent += `${desc}  "${code}" (${escHtml(mediaType)}):\n  ${JSON.stringify(mediaObj.schema, null, 2).replace(/\n/g, '\n  ')}\n\n`;
      }
    }
  }

  if (schemaContent) {
    document.getElementById('openapi-response-schema-full').textContent = schemaContent.trim();
    show(document.getElementById('openapi-response-section'));
    return true;
  }
  return false;
}

/* ------------------------------------------------------------------ */
/* Validation display                                                  */
/* ------------------------------------------------------------------ */

function displayValidationResult(result) {
  const panel = document.getElementById('openapi-validation-panel');
  const summary = document.getElementById('openapi-validation-summary');
  const list = document.getElementById('openapi-validation-list');

  show(panel);

  if (result.errors.length === 0 && result.warnings.length === 0) {
    summary.innerHTML = '<span style="color: #22c55e;">✅ Valid OpenAPI 3.x spec!</span>';
    summary.style.background = 'rgba(34,197,94,.1)';
    list.innerHTML = '';
    return;
  }

  const parts = [];
  if (result.errors.length > 0) parts.push(`${result.errors.length} error${result.errors.length > 1 ? '' : ''}`);
  if (result.warnings.length > 0) parts.push(`${result.warnings.length} warning${result.warnings.length > 1 ? 's' : ''}`);

  const hasErrors = result.errors.length > 0;
  summary.innerHTML = `Found: ${escHtml(parts.join(', '))}`;
  summary.style.background = hasErrors
    ? 'rgba(239,68,68,.1)'
    : 'rgba(245,158,11,.1)';
  summary.style.color = hasErrors ? '#ef4444' : '#f59e0b';

  // Render errors first, then warnings
  let html = '';
  result.errors.forEach((err) => {
    html += `<div style="color: #ef4444; padding: 0.35rem 0.5rem; background: rgba(239,68,68,.08); border-radius: var(--radius-sm);">✕ ${err}</div>`;
  });
  result.warnings.forEach((warn) => {
    html += `<div style="color: #f59e0b; padding: 0.35rem 0.5rem; background: rgba(245,158,11,.08); border-radius: var(--radius-sm);">⚠ ${warn}</div>`;
  });
  list.innerHTML = html;
}

/* ------------------------------------------------------------------ */
/* Spec info display                                                   */
/* ------------------------------------------------------------------ */

function showSpecInfo() {
  if (!currentSpec || !currentSpec.info) return;
  const panel = document.getElementById('openapi-info-panel');
  const container = document.getElementById('openapi-spec-info');

  let html = `<div><strong>Version:</strong> ${escHtml(currentSpec.openapi)}</div>`;
  html += `<div><strong>Title:</strong> ${escHtml(currentSpec.info.title)}</div>`;
  if (currentSpec.info.description) {
    html += `<div><strong>Description:</strong> ${escHtml(currentSpec.info.description)}</div>`;
  }

  const servers = currentSpec.servers || [];
  if (servers.length > 0) {
    html += `<div><strong>Servers:</strong> ${servers.map((s) => escHtml(s.url)).join(', ')}</div>`;
  }

  container.innerHTML = html;
  show(panel);
}

/* ------------------------------------------------------------------ */
/* Reset state                                                         */
/* ------------------------------------------------------------------ */

function resetOpenApiExplorerState() {
  currentSpec = null;
  currentEndpoint = null;

  // Clear inputs
  const fileInput = document.getElementById('openapi-file-input');
  const textarea = document.getElementById('openapi-input-textarea');
  if (fileInput) fileInput.value = '';
  if (textarea) {
    textarea.value = '';
    textarea.style.display = 'none';
  }

  // Disable validate button
  const btnValidate = document.getElementById('btn-openapi-validate');
  if (btnValidate) btnValidate.disabled = true;

  // Hide panels
  hide(document.getElementById('openapi-validation-panel'));
  hide(document.getElementById('openapi-info-panel'));
  hide(document.getElementById('openapi-tree-panel'));
  hide(document.getElementById('openapi-tryit-builder'));

  // Reset display areas
  const treeDisplay = document.getElementById('openapi-tree-display');
  if (treeDisplay) treeDisplay.textContent = 'Load a spec to see endpoints…';

  const endpointTree = document.getElementById('openapi-endpoint-tree');
  if (endpointTree) endpointTree.innerHTML = '';

  // Reset try-it builder fields
  const methodSelect = document.getElementById('openapi-tryit-method-select');
  if (methodSelect) methodSelect.value = 'GET';
  const urlInput = document.getElementById('openapi-tryit-full-url');
  if (urlInput) urlInput.value = '';
  const serverUrl = document.getElementById('openapi-server-url');
  if (serverUrl) serverUrl.value = '';

  // Clear hidden sections in try-it builder
  hide(document.getElementById('openapi-path-params-section'));
  hide(document.getElementById('openapi-query-params-section'));
  hide(document.getElementById('openapi-tryit-body-wrapper'));
  hide(document.getElementById('openapi-sim-result'));
  hide(document.getElementById('openapi-response-section'));
  hide(document.getElementById('openapi-endpoint-details'));

  // Reset drop zone style
  const dropZone = document.getElementById('openapi-drop-zone');
  if (dropZone) dropZone.style.borderColor = '';

  // Show main output, hide try-it builder
  show(document.getElementById('openapi-main-output'));
}

/* ------------------------------------------------------------------ */
/* Event wiring                                                        */
/* ------------------------------------------------------------------ */

function handleFileUpload(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const textarea = document.getElementById('openapi-input-textarea');
    if (textarea) {
      textarea.value = e.target.result;
      textarea.style.display = 'block';
      document.getElementById('btn-openapi-validate').disabled = false;
    }
  };
  reader.onerror = () => {
    alert('Failed to read file. Please try again.');
  };
  reader.readAsText(file);
}

function handleValidate() {
  const textarea = document.getElementById('openapi-input-textarea');
  if (!textarea) return;

  let raw = textarea.value.trim();
  if (!raw) return;

  // Clear previous results
  document.getElementById('openapi-validation-list').innerHTML = '';

  try {
    currentSpec = parseSpec(raw);
    const result = validateOpenApi(currentSpec);

    displayValidationResult(result);
    showSpecInfo();

    // Render endpoint tree
    const treeContainer = document.getElementById('openapi-endpoint-tree');
    if (treeContainer) renderEndpointTree(currentSpec, treeContainer);
    show(document.getElementById('openapi-tree-panel'));

  } catch (e) {
    const panel = document.getElementById('openapi-validation-panel');
    show(panel);
    const summary = document.getElementById('openapi-validation-summary');
    summary.innerHTML = `<span style="color: #ef4444;">❌ Parse Error</span>`;
    summary.style.background = 'rgba(239,68,68,.1)';
    summary.style.color = '#ef4444';
    document.getElementById('openapi-validation-list').innerHTML =
      `<div style="color: #ef4444; padding: 0.5rem;">${escHtml(e.message)}</div>`;
  }
}

function handleSimulate() {
  if (!currentEndpoint) return;

  const curlCmd = generateCurlCommand();
  document.getElementById('openapi-curl-output').textContent = curlCmd;
  show(document.getElementById('openapi-sim-result'));

  // Show response schema if available
  showResponseSchema();
}

function copyToClipboard(text, btnId) {
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById(btnId);
    if (btn) {
      const original = btn.textContent;
      btn.textContent = '✓ Copied!';
      setTimeout(() => { btn.textContent = original; }, 1500);
    }
  }).catch(() => {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    alert('Copied to clipboard!');
  });
}

/* ------------------------------------------------------------------ */
/* Initialize                                                          */
/* ------------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
  // Drop zone click → file input
  const dropZone = document.getElementById('openapi-drop-zone');
  const fileInput = document.getElementById('openapi-file-input');

  if (dropZone && fileInput) {
    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = 'var(--primary, #8b5cf6)';
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.style.borderColor = '';
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = '';
      const file = e.dataTransfer.files[0];
      if (file) handleFileUpload(file);
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files[0]) handleFileUpload(fileInput.files[0]);
    });
  }

  // Paste toggle
  const pasteToggle = document.getElementById('btn-openapi-paste-toggle');
  const textarea = document.getElementById('openapi-input-textarea');
  if (pasteToggle && textarea) {
    pasteToggle.addEventListener('click', () => {
      const isVisible = textarea.style.display !== 'none';
      textarea.style.display = isVisible ? 'none' : 'block';
      if (!isVisible) textarea.focus();
    });
  }

  // Validate button
  const btnValidate = document.getElementById('btn-openapi-validate');
  if (btnValidate) {
    btnValidate.addEventListener('click', handleValidate);
  }

  // Clear button
  const btnClear = document.getElementById('btn-openapi-clear');
  if (btnClear) {
    btnClear.addEventListener('click', resetOpenApiExplorerState);
  }

  // Textarea input → enable/disable validate
  if (textarea) {
    textarea.addEventListener('input', () => {
      btnValidate.disabled = !textarea.value.trim();
    });
  }

  // Simulate request
  const btnSimulate = document.getElementById('btn-openapi-tryit-send');
  if (btnSimulate) {
    btnSimulate.addEventListener('click', handleSimulate);
  }

  // Copy cURL
  const btnCopyCurl = document.getElementById('btn-openapi-copy-curl');
  if (btnCopyCurl) {
    btnCopyCurl.addEventListener('click', () => {
      copyToClipboard(generateCurlCommand(), 'btn-openapi-copy-curl');
    });
  }

  // Copy fetch()
  const btnCopyFetch = document.getElementById('btn-openapi-copy-fetch');
  if (btnCopyFetch) {
    btnCopyFetch.addEventListener('click', () => {
      copyToClipboard(generateFetchCode(), 'btn-openapi-copy-fetch');
    });
  }

  // Server URL change → update try-it URL
  const serverUrl = document.getElementById('openapi-server-url');
  if (serverUrl) {
    serverUrl.addEventListener('input', () => {
      if (currentEndpoint) {
        selectEndpoint(currentEndpoint.path, currentEndpoint.method, currentEndpoint.operation);
      }
    });
  }

  // Initial state
  resetOpenApiExplorerState();
});

// Expose for navigation integration
window.resetOpenApiExplorerState = resetOpenApiExplorerState;
