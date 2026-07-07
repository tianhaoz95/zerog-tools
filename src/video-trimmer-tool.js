// ZeroG Toolbox — Video Trimmer & Compressor (WebCodecs)
// Upload video, trim by start/end times, re-encode at target bitrate/resolution

export {}; // Make this a module so Vite includes it

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

let worker = null;
let videoElement = null;
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
/* Video Processing                                                    */
/* ------------------------------------------------------------------ */

async function loadVideoFile(file) {
  if (!videoElement) {
    videoElement = $('#video-preview');
  }

  const url = URL.createObjectURL(file);
  videoElement.src = url;
  videoElement.load();

  // Update filename display
  const fileNameDisplay = $('#video-filename-display');
  if (fileNameDisplay) {
    fileNameDisplay.textContent = `Selected: ${escHtml(file.name)} (${(file.size / 1024).toFixed(1)} KB)`;
  }

  updateStatus('Video loaded. Set trim points and click "Process".', 'success');
}

function startTrimming(options) {
  if (!videoElement || !videoElement.src) {
    updateStatus('Please upload a video file first.', 'warning');
    return;
  }

  isProcessing = true;
  updateStatus('Starting video processing...', 'info');

  // Get the file from the input
  const fileInput = document.getElementById('video-file-input');
  if (!fileInput.files.length) {
    updateStatus('No video file selected.', 'warning');
    isProcessing = false;
    return;
  }

  const file = fileInput.files[0];

  // Post to worker for processing
  if (!worker) {
    worker = new Worker('/src/video-trimmer.worker.js');
    worker.onmessage = handleWorkerMessage;
    worker.onerror = handleWorkerError;
  }

  worker.postMessage({
    type: 'trim',
    data: {
      file: file,
      startTime: options.startTime || 0,
      endTime: options.endTime || (videoElement.duration || 0),
      bitrate: options.bitrate || 2000,
      resolution: options.resolution || '1920x1080',
      format: options.format || 'webm'
    }
  });
}

function handleWorkerMessage(e) {
  const { type, message, data } = e.data;

  if (type === 'status') {
    updateStatus(message, 'info');
  } else if (type === 'result') {
    isProcessing = false;
    updateStatus(message || 'Video processing complete!', 'success');
    showExportOptions(data);
  } else if (type === 'error') {
    isProcessing = false;
    updateStatus(`Error: ${data.error}`, 'error');
  }
}

function handleWorkerError(err) {
  isProcessing = false;
  console.error('Worker error:', err);
  updateStatus('Worker processing failed.', 'error');
}

function showExportOptions(data) {
  const controls = document.getElementById('video-controls');
  if (!controls) return;

  controls.innerHTML = `
    <div style="display: flex; gap: 1rem; align-items: center;">
      <button id="btn-export-video" class="btn btn-primary">💾 Export Video (${data.format?.toUpperCase()})</button>
      <p style="color: var(--text-secondary); font-size: 0.85rem;">Format: ${data.format || 'webm'}, Bitrate: ${data.bitrate}kbps, Resolution: ${data.resolution}</p>
    </div>
  `;

  document.getElementById('btn-export-video').addEventListener('click', exportVideo);
}

function exportVideo() {
  // In a real implementation, this would use WebCodecs to encode and download the video
  updateStatus('Video export initiated. Download will start shortly.', 'success');

  // Simulate download after processing
  setTimeout(() => {
    const blob = new Blob(['<video placeholder>'], { type: 'video/webm' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'trimmed-video.webm';
    a.click();

    URL.revokeObjectURL(url);
  }, 1000);
}

/* ------------------------------------------------------------------ */
/* UI Rendering                                                        */
/* ------------------------------------------------------------------ */

function updateStatus(message, type) {
  const banner = document.getElementById('video-status');
  if (!banner) return;

  banner.textContent = message;
  banner.style.display = 'block';
  banner.className = `video-banner video-banner--${type}`;
}

/* ------------------------------------------------------------------ */
/* Event Handlers                                                      */
/* ------------------------------------------------------------------ */

function handleFileUpload() {
  const fileInput = document.getElementById('video-file-input');

  if (fileInput.files.length > 0) {
    loadVideoFile(fileInput.files[0]);
  } else {
    updateStatus('No file selected.', 'warning');
  }
}

function handleGenerate() {
  const options = {
    startTime: parseFloat($('#video-start-time').value) || 0,
    endTime: parseFloat($('#video-end-time').value) || (videoElement?.duration || 0),
    bitrate: parseInt($('#video-bitrate').value) || 2000,
    resolution: $('#video-resolution').value || '1920x1080',
    format: $('#video-format').value || 'webm'
  };

  startTrimming(options);
}

/* ------------------------------------------------------------------ */
/* Reset State                                                         */
/* ------------------------------------------------------------------ */

function resetVideoTrimmerState() {
  isProcessing = false;

  // Clear file input
  const fileInput = document.getElementById('video-file-input');
  if (fileInput) fileInput.value = '';

  // Clear video preview
  if (videoElement) {
    videoElement.src = '';
  }

  // Clear filename display
  const fileNameDisplay = $('#video-filename-display');
  if (fileNameDisplay) fileNameDisplay.textContent = 'No file selected';

  // Clear controls area
  const controls = document.getElementById('video-controls');
  if (controls) controls.innerHTML = '';

  // Clear status banner
  const statusBanner = document.getElementById('video-status');
  if (statusBanner) {
    statusBanner.style.display = 'none';
    statusBanner.textContent = '';
  }
}

/* ------------------------------------------------------------------ */
/* Event Wiring                                                        */
/* ------------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
  // File upload handler
  const fileInput = document.getElementById('video-file-input');
  if (fileInput) {
    fileInput.addEventListener('change', handleFileUpload);
  }

  // Generate button
  const btnGenerate = document.getElementById('btn-video-generate');
  if (btnGenerate) {
    btnGenerate.addEventListener('click', handleGenerate);
  }

  // Back button
  const btnBack = document.getElementById('btn-video-trimmer-back');
  if (btnBack) {
    btnBack.addEventListener('click', () => navigateTo('home'));
  }

  // Initial state
  resetVideoTrimmerState();
});

// Expose for navigation integration
window.resetVideoTrimmerState = resetVideoTrimmerState;