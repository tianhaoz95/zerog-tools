// ZeroG Toolbox — Film Grain & Vintage Photo/Video Effect Generator
// Apply procedural film-grain, halation, and color-cast presets to images on canvas

export {}; // Make this a module so Vite includes it

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

let isProcessing = false;
let currentImage = null;

// Available vintage presets
const PRESETS = [
  { id: '35mm', name: '35mm Film', description: 'Classic 35mm film grain with warm tones' },
  { id: 'vhs', name: 'VHS Tape', description: 'Retro VHS tape effect with scan lines' },
  { id: 'polaroid', name: 'Polaroid', description: 'Vintage Polaroid photo with soft focus' },
  { id: 'sepia', name: 'Sepia Tone', description: 'Classic sepia-toned antique look' },
  { id: 'faded', name: 'Faded Photo', description: 'Worn, faded photograph effect' },
];

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
/* Film Grain & Vintage Effects                                        */
/* ------------------------------------------------------------------ */

async function applyFilmGrain(imageData, presetId) {
  if (!imageData) {
    updateStatus('Please upload an image first.', 'warning');
    return null;
  }

  isProcessing = true;
  updateStatus(`Applying ${presetId} effect...`, 'info');

  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Get original image dimensions
    const width = imageData.width || imageData.videoWidth;
    const height = imageData.height || imageData.videoHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    // Draw original image
    ctx.drawImage(imageData, 0, 0, width, height);
    
    // Apply preset-specific effects
    switch (presetId) {
      case '35mm':
        apply35mmEffect(ctx, width, height);
        break;
      case 'vhs':
        applyVHSEffect(ctx, width, height);
        break;
      case 'polaroid':
        applyPolaroidEffect(ctx, width, height);
        break;
      case 'sepia':
        applySepiaEffect(ctx, width, height);
        break;
      case 'faded':
        applyFadedEffect(ctx, width, height);
        break;
      default:
        console.warn('Unknown preset:', presetId);
    }

    isProcessing = false;
    updateStatus(`Applied ${presetId} effect!`, 'success');

    // Convert canvas to blob URL for display/download
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(URL.createObjectURL(blob));
      }, 'image/png');
    });
  } catch (err) {
    console.error('Film grain effect error:', err);
    isProcessing = false;
    updateStatus(`Error: ${err.message}`, 'error');
    throw err;
  }
}

function apply35mmEffect(ctx, width, height) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Add film grain (random noise)
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 20;
    data[i] = Math.max(0, Math.min(255, data[i] + grain));     // R
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain)); // G
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain)); // B
  }

  // Warm color cast (slight yellow/amber tint)
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, data[i] * 1.05);     // Boost red slightly
    data[i + 1] = Math.min(255, data[i + 1] * 1.02); // Boost green slightly
    data[i + 2] = Math.max(0, data[i + 2] * 0.95);   // Slight blue reduction
  }

  ctx.putImageData(imageData, 0, 0);
}

function applyVHSEffect(ctx, width, height) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Add scan lines (horizontal stripes)
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      
      // Darken every other row slightly
      data[index] = Math.max(0, data[index] * 0.9);     // R
      data[index + 1] = Math.max(0, data[index + 1] * 0.95); // G
      data[index + 2] = Math.max(0, data[index + 2] * 0.9);   // B
      
      // Add noise to scan lines
      const noise = (Math.random() - 0.5) * 15;
      data[index] = Math.max(0, Math.min(255, data[index] + noise));
      data[index + 1] = Math.max(0, Math.min(255, data[index + 1] + noise));
      data[index + 2] = Math.max(0, Math.min(255, data[index + 2] + noise));
    }
  }

  // Add color bleeding (slight RGB channel offset)
  for (let i = 0; i < data.length - 8; i += 4) {
    const bleed = Math.random() > 0.9 ? 2 : 0; // 10% chance of bleeding
    
    if (bleed > 0 && i + bleed * 4 < data.length) {
      data[i] = data[i + bleed * 4];     // Red channel bleeds from G
      data[i + 2] = data[i - bleed * 4 + 2] || data[i + 2]; // Blue channel bleeds from B
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function applyPolaroidEffect(ctx, width, height) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Soft focus effect (slight blur simulation via averaging)
  for (let y = 1; y < height - 1; y += 2) {
    for (let x = 1; x < width - 1; x += 2) {
      const index = (y * width + x) * 4;
      
      // Average with neighbors for soft focus
      const neighborCount = 9;
      let rSum = 0, gSum = 0, bSum = 0;
      
      for (let dy = -1; dy <= 1; dy += 2) {
        for (let dx = -1; dx <= 1; dx += 2) {
          const nIndex = ((y + dy) * width + (x + dx)) * 4;
          rSum += data[nIndex];
          gSum += data[nIndex + 1];
          bSum += data[nIndex + 2];
        }
      }
      
      data[index] = Math.round(rSum / neighborCount);
      data[index + 1] = Math.round(gSum / neighborCount);
      data[index + 2] = Math.round(bSum / neighborCount);
    }
  }

  // Add vignette (darken edges)
  const maxDist = Math.sqrt(width * width + height * height) / 2;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dist = Math.sqrt(Math.pow(x - width/2, 2) + Math.pow(y - height/2, 2));
      const vignetteFactor = 1 - (dist / maxDist) * 0.4; // Darken by up to 40%
      
      const index = (y * width + x) * 4;
      data[index] *= vignetteFactor;
      data[index + 1] *= vignetteFactor;
      data[index + 2] *= vignetteFactor;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function applySepiaEffect(ctx, width, height) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Apply sepia tone filter
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Sepia matrix transformation
    data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));     // R
    data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168)); // G
    data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131)); // B
    
    // Add subtle grain
    const grain = (Math.random() - 0.5) * 10;
    data[i] = Math.max(0, Math.min(255, data[i] + grain));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain));
  }

  ctx.putImageData(imageData, 0, 0);
}

function applyFadedEffect(ctx, width, height) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Fade effect: reduce contrast and add white overlay
  for (let i = 0; i < data.length; i += 4) {
    const fadeAmount = 0.3; // 30% fade
    
    // Blend with white
    data[i] = data[i] * (1 - fadeAmount) + 255 * fadeAmount;     // R
    data[i + 1] = data[i + 1] * (1 - fadeAmount) + 255 * fadeAmount; // G
    data[i + 2] = data[i + 2] * (1 - fadeAmount) + 255 * fadeAmount; // B
    
    // Add subtle noise
    const noise = (Math.random() - 0.5) * 8;
    data[i] = Math.max(0, Math.min(255, data[i] + noise));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
  }

  ctx.putImageData(imageData, 0, 0);
}

/* ------------------------------------------------------------------ */
/* UI Rendering                                                        */
/* ------------------------------------------------------------------ */

function updateStatus(message, type) {
  const banner = document.getElementById('film-grain-status');
  if (!banner) return;

  banner.textContent = message;
  banner.style.display = 'block';
  banner.className = `film-banner film-banner--${type}`;
}

/* ------------------------------------------------------------------ */
/* Event Handlers                                                      */
/* ------------------------------------------------------------------ */

async function handleImageUpload() {
  const fileInput = document.getElementById('film-grain-image-input');
  const imagePreview = $('#film-grain-preview');
  const fileNameDisplay = $('#film-grain-filename-display');

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];

    // Update filename display
    if (fileNameDisplay) {
      fileNameDisplay.textContent = `Selected: ${escHtml(file.name)} (${(file.size / 1024).toFixed(1)} KB)`;
    }

    // Create preview URL and load image for processing
    const url = URL.createObjectURL(file);
    
    if (imagePreview) {
      imagePreview.src = url;
      imagePreview.style.display = 'block';
    }

    updateStatus('Image uploaded. Select a preset and click "Apply Effect".', 'success');
  } else {
    fileNameDisplay.textContent = 'No file selected';
  }
}

async function handlePresetSelection() {
  const select = document.getElementById('film-grain-preset-select');
  if (!select) return;
  
  const presetId = select.value;
  updateStatus(`Selected preset: ${escHtml(select.options[select.selectedIndex].text)}`, 'info');
}

async function handleApplyEffect() {
  const fileInput = document.getElementById('film-grain-image-input');
  const imagePreview = $('#film-grain-preview');
  const resultCanvas = $('#film-grain-result-canvas');
  
  if (fileInput.files.length === 0) {
    updateStatus('Please upload an image first.', 'warning');
    return;
  }

  if (!imagePreview.src || imagePreview.style.display === 'none') {
    updateStatus('Image preview not available. Please re-upload the image.', 'warning');
    return;
  }

  const presetSelect = document.getElementById('film-grain-preset-select');
  const selectedPresetId = presetSelect.value;

  // Load original image for processing
  const img = new Image();
  img.onload = async () => {
    try {
      const resultUrl = await applyFilmGrain(img, selectedPresetId);
      
      // Display result on canvas
      if (resultCanvas) {
        URL.revokeObjectURL(resultCanvas.src);
        resultCanvas.src = resultUrl;
      }
    } catch (err) {
      console.error('Apply effect error:', err);
    }
  };
  
  img.src = imagePreview.src;
}

/* ------------------------------------------------------------------ */
/* Reset State                                                         */
/* ------------------------------------------------------------------ */

function resetFilmGrainState() {
  isProcessing = false;
  currentImage = null;

  // Clear file input
  const fileInput = document.getElementById('film-grain-image-input');
  if (fileInput) fileInput.value = '';

  // Clear image preview
  const imagePreview = $('#film-grain-preview');
  if (imagePreview) {
    imagePreview.src = '';
    imagePreview.style.display = 'none';
  }

  // Clear filename display
  const fileNameDisplay = $('#film-grain-filename-display');
  if (fileNameDisplay) fileNameDisplay.textContent = 'No file selected';

  // Clear result canvas
  const resultCanvas = $('#film-grain-result-canvas');
  if (resultCanvas) {
    URL.revokeObjectURL(resultCanvas.src);
    resultCanvas.src = '';
  }

  // Reset status banner
  const statusBanner = document.getElementById('film-grain-status');
  if (statusBanner) {
    statusBanner.style.display = 'none';
    statusBanner.textContent = '';
  }

  // Reset preset selector to first option
  const presetSelect = document.getElementById('film-grain-preset-select');
  if (presetSelect && presetSelect.options.length > 0) {
    presetSelect.selectedIndex = 0;
  }
}

/* ------------------------------------------------------------------ */
/* Event Wiring                                                        */
/* ------------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
  // Populate preset options
  const presetSelect = document.getElementById('film-grain-preset-select');
  if (presetSelect) {
    PRESETS.forEach(preset => {
      const option = document.createElement('option');
      option.value = preset.id;
      option.textContent = `${preset.name} — ${preset.description}`;
      presetSelect.appendChild(option);
    });
  }

  // Image upload handler
  const fileInput = document.getElementById('film-grain-image-input');
  if (fileInput) {
    fileInput.addEventListener('change', handleImageUpload);
  }

  // Preset selection handler
  const presetSelectEl = document.getElementById('film-grain-preset-select');
  if (presetSelectEl) {
    presetSelectEl.addEventListener('change', handlePresetSelection);
  }

  // Apply Effect button
  const btnApply = document.getElementById('btn-film-grain-apply');
  if (btnApply) {
    btnApply.addEventListener('click', handleApplyEffect);
  }

  // Back button
  const btnBack = document.getElementById('btn-film-grain-back');
  if (btnBack) {
    btnBack.addEventListener('click', () => navigateTo('home'));
  }

  // Initial state
  resetFilmGrainState();
});

// Expose for navigation integration
window.resetFilmGrainState = resetFilmGrainState;
