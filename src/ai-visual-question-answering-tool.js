// ZeroG Toolbox — AI Visual Question Answering (VQA) Tool
// Upload image, ask questions, get on-device answers using Transformers.js

import { pipeline, env } from '@huggingface/transformers';

export {}; // Make this a module so Vite includes it

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

let vqaPipeline = null;
let currentImage = null;
let isProcessing = false;

// Disable local models fallback for transformers.js
env.allowLocalModels = false;

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
/* VQA Processing                                                      */
/* ------------------------------------------------------------------ */

async function loadVQAModel() {
  if (vqaPipeline) return vqaPipeline;

  updateStatus('Loading VQA model...', 'info');

  try {
    // Load ViLT-based VQA model for visual question answering
    vqaPipeline = await pipeline(
      'visual-question-answering',
      'dandelin/vilt-b32-finetuned-vqa',
      {
        dtype: 'fp16', // Use fp16 if WebGPU is available, otherwise falls back to fp32
        device: navigator.gpu ? 'webgpu' : 'cpu',
        progress_callback: (progressData) => {
          if (progressData.status === 'progress') {
            updateStatus(`Loading model: ${Math.round(progressData.progress * 100)}%`, 'info');
          }
        }
      }
    );

    updateStatus('VQA model loaded!', 'success');
    return vqaPipeline;
  } catch (err) {
    console.error('Failed to load VQA model:', err);
    updateStatus(`Failed to load model: ${err.message}`, 'error');
    throw err;
  }
}

async function askQuestion(question) {
  if (!vqaPipeline) {
    await loadVQAModel();
  }

  if (!currentImage) {
    updateStatus('Please upload an image first.', 'warning');
    return null;
  }

  isProcessing = true;
  updateStatus('Asking question...', 'info');

  try {
    // Convert current image to blob URL for pipeline input
    const imageUrl = typeof currentImage === 'string' ? currentImage : URL.createObjectURL(currentImage);

    const results = await vqaPipeline({
      image: imageUrl,
      question: question
    });

    isProcessing = false;

    // Display results
    displayResults(results);

    updateStatus(`Answered: "${question}"`, 'success');

    return results;
  } catch (err) {
    console.error('VQA error:', err);
    isProcessing = false;
    updateStatus(`Error: ${err.message}`, 'error');
    throw err;
  }
}

function displayResults(results) {
  const outputContainer = $('#vqa-output-container');
  if (!outputContainer || !results.length) return;

  let html = '<div class="glass-card" style="padding: 1.5rem;">';
  html += '<h4 style="margin: 0 0 1rem 0; color: #8b5cf6;">Answer(s)</h4>';

  for (let i = 0; i < results.length && i < 3; i++) {
    const result = results[i];
    html += `
      <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.8rem;">
        <span class="badge" style="background: rgba(139, 92, 246, 0.2); color: #8b5cf6; padding: 0.3rem 0.8rem; border-radius: 999px; font-size: 0.75rem;">#${i + 1}</span>
        <span style="flex: 1; font-size: 1rem;">${escHtml(result.answer)}</span>
        <span class="badge" style="background: rgba(34, 197, 94, 0.2); color: #22c55e; padding: 0.3rem 0.8rem; border-radius: 999px; font-size: 0.75rem;">${Math.round(result.score * 100)}%</span>
      </div>
    `;
  }

  html += '</div>';

  outputContainer.innerHTML = html;
}

/* ------------------------------------------------------------------ */
/* UI Rendering                                                        */
/* ------------------------------------------------------------------ */

function updateStatus(message, type) {
  const banner = document.getElementById('vqa-status');
  if (!banner) return;

  banner.textContent = message;
  banner.style.display = 'block';
  banner.className = `vqa-banner vqa-banner--${type}`;
}

/* ------------------------------------------------------------------ */
/* Event Handlers                                                      */
/* ------------------------------------------------------------------ */

async function handleImageUpload() {
  const fileInput = document.getElementById('vqa-image-input');
  const imagePreview = $('#vqa-image-preview');
  const fileNameDisplay = $('#vqa-filename-display');

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];

    // Update filename display
    if (fileNameDisplay) {
      fileNameDisplay.textContent = `Selected: ${escHtml(file.name)} (${(file.size / 1024).toFixed(1)} KB)`;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    currentImage = file;

    if (imagePreview) {
      imagePreview.src = url;
      imagePreview.style.display = 'block';
    }

    updateStatus('Image uploaded. Type a question and click "Ask".', 'success');
  } else {
    fileNameDisplay.textContent = 'No file selected';
  }
}

async function handleAskQuestion() {
  const questionInput = document.getElementById('vqa-question-input');
  if (!questionInput) return;

  const question = questionInput.value.trim();
  if (!question) {
    updateStatus('Please enter a question.', 'warning');
    return;
  }

  await askQuestion(question);
}

/* ------------------------------------------------------------------ */
/* Reset State                                                         */
/* ------------------------------------------------------------------ */

function resetVqaToolState() {
  isProcessing = false;
  currentImage = null;

  // Clear file input
  const fileInput = document.getElementById('vqa-image-input');
  if (fileInput) fileInput.value = '';

  // Clear image preview
  const imagePreview = $('#vqa-image-preview');
  if (imagePreview) {
    imagePreview.src = '';
    imagePreview.style.display = 'none';
  }

  // Clear filename display
  const fileNameDisplay = $('#vqa-filename-display');
  if (fileNameDisplay) fileNameDisplay.textContent = 'No file selected';

  // Clear output container
  const outputContainer = $('#vqa-output-container');
  if (outputContainer) {
    outputContainer.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.85rem;">Ask a question about the image to see the answer.</p>';
  }

  // Clear status banner
  const statusBanner = document.getElementById('vqa-status');
  if (statusBanner) {
    statusBanner.style.display = 'none';
    statusBanner.textContent = '';
  }

  // Reset question input
  if (questionInput) questionInput.value = '';
}

/* ------------------------------------------------------------------ */
/* Event Wiring                                                        */
/* ------------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
  // Image upload handler
  const fileInput = document.getElementById('vqa-image-input');
  if (fileInput) {
    fileInput.addEventListener('change', handleImageUpload);
  }

  // Ask button
  const btnAsk = document.getElementById('btn-vqa-ask');
  if (btnAsk) {
    btnAsk.addEventListener('click', handleAskQuestion);
  }

  // Question input enter key
  const questionInput = document.getElementById('vqa-question-input');
  if (questionInput) {
    questionInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleAskQuestion();
      }
    });
  }

  // Back button
  const btnBack = document.getElementById('btn-vqa-back');
  if (btnBack) {
    btnBack.addEventListener('click', () => navigateTo('home'));
  }

  // Initial state
  resetVqaToolState();
});

// Expose for navigation integration
window.resetVqaToolState = resetVqaToolState;