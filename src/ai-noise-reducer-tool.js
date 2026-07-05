// ZeroG Toolbox — AI Noise Reducer / Audio Denoiser
// Upload audio, apply noise reduction filters (rumble, hum, hiss), export cleaned track

export {}; // Make this a module so Vite includes it

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

let worker = null;
let audioContext = null;
let currentAudioBuffer = null;
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
/* Audio Processing                                                    */
/* ------------------------------------------------------------------ */

async function loadAudioFile(file) {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  const arrayBuffer = await file.arrayBuffer();
  currentAudioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  return currentAudioBuffer;
}

function startNoiseReduction(options) {
  if (!currentAudioBuffer) {
    updateStatus('Please upload an audio file first.', 'warning');
    return;
  }

  isProcessing = true;
  updateStatus('Starting noise reduction...', 'info');

  // Convert AudioBuffer to Float32Array for worker
  const channelData = currentAudioBuffer.getChannelData(0);
  const audioFloat32 = new Float32Array(channelData.length);
  for (let i = 0; i < channelData.length; i++) {
    audioFloat32[i] = channelData[i];
  }

  // Post to worker for processing
  if (!worker) {
    worker = new Worker('/src/noise-reduction.worker.js');
    worker.onmessage = handleWorkerMessage;
    worker.onerror = handleWorkerError;
  }

  worker.postMessage({
    type: 'denoise',
    data: {
      audioBuffer: audioFloat32,
      audioLength: currentAudioBuffer.length,
      options: options || {}
    }
  });
}

function handleWorkerMessage(e) {
  const { type, message, data } = e.data;

  if (type === 'status') {
    updateStatus(message, 'info');
  } else if (type === 'result') {
    isProcessing = false;
    renderCleanedAudio(data.audio, data.sampleRate);
    updateStatus('Noise reduction complete!', 'success');
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

function renderCleanedAudio(audioData, sampleRate) {
  // Create a new AudioBuffer from the processed data
  const offlineContext = new OfflineAudioContext(1, audioData.length, sampleRate);
  const channelData = offlineContext.getChannelData(0);

  for (let i = 0; i < audioData.length; i++) {
    channelData[i] = audioData[i];
  }

  // Save the cleaned buffer
  window.cleanedAudioBuffer = offlineContext.decodeAudioData(audioData).then(buffer => {
    return buffer;
  }).catch(err => {
    console.error('Failed to decode cleaned audio:', err);
    updateStatus('Error processing cleaned audio.', 'error');
    return null;
  });

  // Show playback controls
  showPlaybackControls();
}

function showPlaybackControls() {
  const controls = document.getElementById('noise-controls');
  if (!controls) return;

  controls.innerHTML = `
    <div style="display: flex; gap: 1rem; align-items: center;">
      <button id="btn-play-cleaned" class="btn btn-primary">▶ Play Cleaned Audio</button>
      <button id="btn-download-cleaned" class="btn btn-ghost">💾 Download WAV</button>
    </div>
  `;

  // Attach event listeners
  document.getElementById('btn-play-cleaned').addEventListener('click', playCleanedAudio);
  document.getElementById('btn-download-cleaned').addEventListener('click', downloadCleanedWav);
}

async function playCleanedAudio() {
  if (!window.cleanedAudioBuffer) return;

  const source = audioContext.createBufferSource();
  source.buffer = window.cleanedAudioBuffer;
  source.connect(audioContext.destination);
  source.start(0);
}

function downloadCleanedWav() {
  if (!window.cleanedAudioBuffer) return;

  // Convert AudioBuffer to WAV format
  const buffer = window.cleanedAudioBuffer;
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const length = buffer.length;

  // Create WAV file
  const wavBuffer = new ArrayBuffer(44 + length * numChannels * 2);
  const view = new DataView(wavBuffer);

  // Write WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + length * numChannels * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size
  view.setUint16(20, 1, true); // AudioFormat (PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true); // ByteRate
  view.setUint16(32, numChannels * 2, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample

  // Write audio data
  let offset = 36;
  for (let i = 0; i < length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = buffer.getChannelData(ch)[i];
      const intSample = Math.max(-1, Math.min(1, sample));
      view.setInt16(offset, intSample * 0x7FFF, true);
      offset += 2;
    }
  }

  // Create blob and download
  const blob = new Blob([wavBuffer], { type: 'audio/wav' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'cleaned-audio.wav';
  a.click();

  URL.revokeObjectURL(url);
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/* ------------------------------------------------------------------ */
/* UI Rendering                                                        */
/* ------------------------------------------------------------------ */

function updateStatus(message, type) {
  const banner = document.getElementById('noise-status');
  if (!banner) return;

  banner.textContent = message;
  banner.style.display = 'block';
  banner.className = `noise-banner noise-banner--${type}`;
}

/* ------------------------------------------------------------------ */
/* Event Handlers                                                      */
/* ------------------------------------------------------------------ */

function handleFileUpload() {
  const fileInput = document.getElementById('noise-file-input');
  const fileNameDisplay = $('#noise-filename-display');

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    fileNameDisplay.textContent = `Selected: ${escHtml(file.name)} (${(file.size / 1024).toFixed(1)} KB)`;

    // Load audio for preview
    loadAudioFile(file).then(buffer => {
      updateStatus('Audio loaded. Configure filters and click "Process".', 'success');
    }).catch(err => {
      updateStatus(`Failed to load audio: ${err.message}`, 'error');
    });
  } else {
    fileNameDisplay.textContent = 'No file selected';
  }
}

function handleGenerate() {
  const options = {
    removeRumble: $('#noise-remove-rumble').checked,
    removeHum: $('#noise-remove-hum').checked,
    reduceHiss: $('#noise-reduce-hiss').checked,
    hissReduction: parseFloat($('#noise-hiss-level').value) || 0.5
  };

  startNoiseReduction(options);
}

/* ------------------------------------------------------------------ */
/* Reset State                                                         */
/* ------------------------------------------------------------------ */

function resetNoiseToolState() {
  isProcessing = false;
  currentAudioBuffer = null;

  // Clear file input
  const fileInput = document.getElementById('noise-file-input');
  if (fileInput) fileInput.value = '';

  // Clear filename display
  const fileNameDisplay = $('#noise-filename-display');
  if (fileNameDisplay) fileNameDisplay.textContent = 'No file selected';

  // Clear controls area
  const controls = document.getElementById('noise-controls');
  if (controls) controls.innerHTML = '';

  // Clear status banner
  const statusBanner = document.getElementById('noise-status');
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
  const fileInput = document.getElementById('noise-file-input');
  if (fileInput) {
    fileInput.addEventListener('change', handleFileUpload);
  }

  // Generate button
  const btnGenerate = document.getElementById('btn-noise-generate');
  if (btnGenerate) {
    btnGenerate.addEventListener('click', handleGenerate);
  }

  // Back button
  const btnBack = document.getElementById('btn-ai-noise-reducer-back');
  if (btnBack) {
    btnBack.addEventListener('click', () => navigateTo('home'));
  }

  // Initial state
  resetNoiseToolState();
});

// Expose for navigation integration
window.resetNoiseToolState = resetNoiseToolState;