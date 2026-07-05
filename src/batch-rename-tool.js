// ZeroG Toolbox — Local Folder Batch Renamer
// Pick a folder via File System Access API, preview find/replace or sequential-numbering
// rename patterns across all files, then rename in place (with zip-download fallback).

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

let selectedFiles = []; // [{name, handle}] from directory picker
let currentMode = 'find-replace'; // 'find-replace' | 'sequential'
let previewTableDirty = false;

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
/* Folder picker                                                       */
/* ------------------------------------------------------------------ */

async function pickFolder() {
  if (!window.showDirectoryPicker) {
    showFallbackBanner();
    return;
  }

  try {
    const dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
    selectedFiles = [];
    await readDirectory(dirHandle);
    renderFileList();
    updateStatus(`Found ${selectedFiles.length} file(s) in folder "${dirHandle.name}"`, 'success');
  } catch (err) {
    if (err.name === 'AbortError') return; // user cancelled
    updateStatus(`Failed to pick folder: ${err.message}`, 'error');
  }
}

async function readDirectory(dirHandle, depth = 0) {
  for await (const entry of dirHandle.values()) {
    if (entry.kind === 'file' && depth === 0) {
      const handle = await dirHandle.getFileHandle(entry.name);
      selectedFiles.push({ name: entry.name, handle });
    } else if (entry.kind === 'directory') {
      // Recurse into subdirectories (flat list with full path)
      const subDir = await dirHandle.getDirectoryHandle(entry.name);
      await readSubDirectory(subDir, entry.name);
    }
  }
}

async function readSubDirectory(dirHandle, prefix) {
  for await (const entry of dirHandle.values()) {
    if (entry.kind === 'file') {
      const fullPath = `${prefix}/${entry.name}`;
      const handle = await dirHandle.getFileHandle(entry.name);
      selectedFiles.push({ name: fullPath, handle });
    } else if (entry.kind === 'directory') {
      const subDir = await dirHandle.getDirectoryHandle(entry.name);
      await readSubDirectory(subDir, `${prefix}/${entry.name}`);
    }
  }
}

function showFallbackBanner() {
  updateStatus(
    'Your browser does not support the File System Access API. ' +
    'Select files individually instead (single-file mode).',
    'warning'
  );
}

/* ------------------------------------------------------------------ */
/* Sequential file picker fallback                                     */
/* ------------------------------------------------------------------ */

async function pickFilesFallback() {
  const input = document.createElement('input');
  input.type = 'file';
  input.webkitdirectory = true; // Chrome/Safari: directory picker
  input.directory = true;       // Firefox: directory picker
  input.multiple = true;
  input.accept = '*/*';

  input.addEventListener('change', async () => {
    selectedFiles = [];
    for (const file of input.files) {
      const blob = new Blob([file]);
      // We can't get a writable handle without the API, so mark as fallback mode
      selectedFiles.push({ name: file.name, handle: null, blob, isFallback: true });
    }
    renderFileList();
    updateStatus(`Found ${selectedFiles.length} file(s) (fallback mode — download rename will be available)`, 'warning');
  });

  input.click();
}

/* ------------------------------------------------------------------ */
/* Rename logic                                                        */
/* ------------------------------------------------------------------ */

function computeNewName(oldName, mode, options) {
  if (mode === 'find-replace') {
    const find = options.find || '';
    const replace = options.replace || '';
    return oldName.split('.').reduce((acc, part, i, arr) => {
      const isLast = i === arr.length - 1;
      const result = acc + (isLast ? '' : '.') + part.replace(new RegExp(escapeRegex(find), 'g'), replace);
      return result;
    }, '');
  }

  if (mode === 'sequential') {
    const prefix = options.prefix || '';
    const suffix = options.suffix || '';
    const startAt = options.startAt || 1;
    const padWidth = options.padWidth || 3;
    return `${prefix}${String(startAt).padStart(padWidth, '0')}${suffix}`;
  }

  return oldName;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* ------------------------------------------------------------------ */
/* Preview rendering                                                   */
/* ------------------------------------------------------------------ */

function renderFileList() {
  const container = document.getElementById('batch-rename-preview-table');
  if (!container) return;

  if (selectedFiles.length === 0) {
    container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 1rem;">No files selected. Pick a folder to get started.</p>';
    return;
  }

  const options = getOptions();
  let html = `<table class="batch-rename-table" style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">`;
  html += `<thead><tr style="border-bottom: 2px solid var(--border, #2a2a2e);">
    <th style="text-align: left; padding: 0.5rem; color: var(--text-secondary); font-weight: 600;">File</th>
    <th style="text-align: left; padding: 0.5rem; color: var(--text-secondary); font-weight: 600;">→ New Name</th>
  </tr></thead><tbody>`;

  for (let i = 0; i < selectedFiles.length; i++) {
    const file = selectedFiles[i];
    const newName = computeNewName(file.name, currentMode, options);
    if (newName === file.name) continue; // skip unchanged for brevity

    html += `<tr style="border-bottom: 1px solid rgba(255,255,255,.05);">
      <td style="padding: 0.4rem 0.5rem;">${escHtml(file.name)}</td>
      <td style="padding: 0.4rem 0.5rem; color: #8b5cf6; font-weight: 500;">→ ${escHtml(newName)}</td>
    </tr>`;
  }

  html += '</tbody></table>';
  container.innerHTML = html;
}

function getOptions() {
  if (currentMode === 'find-replace') {
    return {
      find: $('#batch-rename-find').value || '',
      replace: $('#batch-rename-replace').value || ''
    };
  }
  return {
    prefix: $('#batch-rename-prefix').value || '',
    suffix: $('#batch-rename-suffix').value || '',
    startAt: parseInt($('#batch-rename-start-at').value) || 1,
    padWidth: parseInt($('#batch-rename-pad-width').value) || 3
  };
}

/* ------------------------------------------------------------------ */
/* Execute renames                                                     */
/* ------------------------------------------------------------------ */

async function executeRename() {
  if (selectedFiles.length === 0) {
    updateStatus('No files to rename.', 'warning');
    return;
  }

  const options = getOptions();
  let successCount = 0;
  let failCount = 0;

  for (const file of selectedFiles) {
    try {
      if (!file.handle || !window.moveDestination) {
        // Fallback: mark as failed (will offer zip download)
        failCount++;
        continue;
      }

      const newName = computeNewName(file.name, currentMode, options);
      if (newName === file.name) continue;

      await file.handle.move(newName);
      successCount++;
    } catch (err) {
      console.warn('Rename failed for', file.name, err);
      failCount++;
    }
  }

  updateStatus(
    `Renamed ${successCount} file(s). ${failCount > 0 ? `${failCount} file(s) could not be renamed in place (try zip download fallback).` : ''}`,
    'success'
  );
}

/* ------------------------------------------------------------------ */
/* Zip download fallback                                                 */
/* ------------------------------------------------------------------ */

async function downloadZipFallback() {
  const fallbackFiles = selectedFiles.filter(f => f.isFallback || !f.handle);
  if (fallbackFiles.length === 0) {
    updateStatus('All files were renamed in place — no zip needed.', 'info');
    return;
  }

  // Simple approach: download each file individually with new name as a link
  const container = document.getElementById('batch-rename-zip-fallback');
  if (!container) return;

  let html = '<div style="display: flex; flex-direction: column; gap: 0.4rem;">';
  for (const file of fallbackFiles) {
    const newName = computeNewName(file.name, currentMode, getOptions());
    if (newName === file.name) continue;

    const url = URL.createObjectURL(file.blob);
    html += `<a href="${url}" download="${escHtml(newName)}" style="color: var(--primary); text-decoration: none; padding: 0.3rem 0;">⬇ ${escHtml(file.name)} → ${escHtml(newName)}</a>`;
  }
  html += '</div>';

  container.innerHTML = html;
  show(container);
}

/* ------------------------------------------------------------------ */
/* Status display                                                      */
/* ------------------------------------------------------------------ */

function updateStatus(message, type) {
  const banner = document.getElementById('batch-rename-status');
  if (!banner) return;

  banner.textContent = message;
  banner.style.display = 'block';
  banner.className = `batch-rename-banner batch-rename-banner--${type}`;
}

/* ------------------------------------------------------------------ */
/* Mode switching                                                      */
/* ------------------------------------------------------------------ */

function setMode(mode) {
  currentMode = mode;
  document.querySelectorAll('.mode-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.mode === mode);
  });

  const findReplacePanel = document.getElementById('batch-rename-find-replace-options');
  const sequentialPanel = document.getElementById('batch-rename-sequential-options');

  if (findReplacePanel) findReplacePanel.style.display = mode === 'find-replace' ? 'block' : 'none';
  if (sequentialPanel) sequentialPanel.style.display = mode === 'sequential' ? 'block' : 'none';

  renderFileList();
}

/* ------------------------------------------------------------------ */
/* Reset state                                                         */
/* ------------------------------------------------------------------ */

function resetBatchRenameState() {
  selectedFiles = [];
  currentMode = 'find-replace';

  // Clear inputs
  const findInput = document.getElementById('batch-rename-find');
  const replaceInput = document.getElementById('batch-rename-replace');
  if (findInput) findInput.value = '';
  if (replaceInput) replaceInput.value = '';

  const prefixInput = document.getElementById('batch-rename-prefix');
  const suffixInput = document.getElementById('batch-rename-suffix');
  const startAtInput = document.getElementById('batch-rename-start-at');
  const padWidthInput = document.getElementById('batch-rename-pad-width');
  if (prefixInput) prefixInput.value = '';
  if (suffixInput) suffixInput.value = '';
  if (startAtInput) startAtInput.value = '1';
  if (padWidthInput) padWidthInput.value = '3';

  // Reset display areas
  const previewTable = document.getElementById('batch-rename-preview-table');
  if (previewTable) {
    previewTable.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 1rem;">No files selected. Pick a folder to get started.</p>';
  }

  const statusBanner = document.getElementById('batch-rename-status');
  if (statusBanner) {
    statusBanner.style.display = 'none';
    statusBanner.textContent = '';
  }

  const zipFallback = document.getElementById('batch-rename-zip-fallback');
  if (zipFallback) hide(zipFallback);

  setMode('find-replace');
}

/* ------------------------------------------------------------------ */
/* Event wiring                                                        */
/* ------------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
  // Pick folder button
  const btnPickFolder = document.getElementById('btn-batch-rename-pick-folder');
  if (btnPickFolder) {
    btnPickFolder.addEventListener('click', pickFolder);
  }

  // Fallback file picker (for browsers without File System Access API)
  const btnFallback = document.getElementById('btn-batch-rename-fallback');
  if (btnFallback) {
    btnFallback.addEventListener('click', pickFilesFallback);
  }

  // Execute rename button
  const btnExecute = document.getElementById('btn-batch-rename-execute');
  if (btnExecute) {
    btnExecute.addEventListener('click', executeRename);
  }

  // Zip download fallback
  const btnZip = document.getElementById('btn-batch-rename-zip');
  if (btnZip) {
    btnZip.addEventListener('click', downloadZipFallback);
  }

  // Mode tabs
  document.querySelectorAll('.mode-tab').forEach(tab => {
    tab.addEventListener('click', () => setMode(tab.dataset.mode));
  });

  // Input listeners → re-render preview
  ['batch-rename-find', 'batch-rename-replace', 'batch-rename-prefix',
   'batch-rename-suffix', 'batch-rename-start-at', 'batch-rename-pad-width'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', renderFileList);
    }
  });

  // Back button
  const btnBack = document.getElementById('btn-batch-rename-back');
  if (btnBack) {
    btnBack.addEventListener('click', () => navigateTo('home'));
  }

  // Initial state
  resetBatchRenameState();
});

// Expose for navigation integration
window.resetBatchRenameState = resetBatchRenameState;
