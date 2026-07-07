// ZeroG Toolbox — AI Neural Style Transfer Tool
// Upload a photo, select an artistic style, apply ONNX-based style transfer on-device

export {}; // Make this a module so Vite includes it

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

let session = null;
let isModelLoaded = false;
let currentImage = null;
let isProcessing = false;

// Available styles for transfer
const STYLES = [
  { id: 'mosaic', name: 'Mosaic', modelUrl: 'https://huggingface.co/onnx-community/fast-neural-style/resolve/main/mosaic.onnx' },
  { id: 'candy', name: 'Candy', modelUrl: 'https://huggingface.co/onnx-community/fast-neural-style/resolve/main/candy.onnx' },
  { id: 'pointillism', name: 'Pointillism', modelUrl: 'https://huggingface.co/onnx-community/fast-neural-style/resolve/main/pointillism.onnx' },
  { id: 'udnie', name: ' Udnie (Picasso)', modelUrl: 'https://huggingface.co/onnx-community/fast-neural-style/resolve/main/udnie.onnx' },
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
/* ONNX Runtime Setup                                                  */
/* ------------------------------------------------------------------ */

async function loadONNXRuntime() {
  try {
    const ort = await import('onnxruntime-web');
    
    const providers = [];
    if (navigator.gpu) {
      providers.push('webgpu');
    }
    providers.push('cpu');
    
    return ort;
  } catch (err) {
    console.error('Failed to load ONNX Runtime:', err);
    throw new Error('ONNX Runtime Web not available. Please use a modern browser with WebGPU support.');
  }
}

async function loadModel(modelUrl) {
  if (isModelLoaded && session) return session;

  updateStatus('Loading style transfer model...', 'info');

  try {
    const ort = await loadONNXRuntime();
    
    session = await ort.InferenceSession.create(modelUrl, {
      executionProviders: ['webgpu', 'cpu'],
      graphOptimizationLevel: 'all',
    });

    isModelLoaded = true;
    updateStatus('Style transfer model loaded!', 'success');
    return session;
  } catch (err) {
    console.error('Failed to load style transfer model:', err);
    updateStatus(`Failed to load model: ${err.message}`, 'error');
    throw err;
  }
}

/* ------------------------------------------------------------------ */
/* Style Transfer Processing                                           */
/* ------------------------------------------------------------------ */

async function applyStyleTransfer(imageData, modelUrl) {
  if (!session || isModelLoaded === false) {
    await loadModel(modelUrl);
  }

  if (!imageData) {
    updateStatus('Please upload an image first.', 'warning');
    return null;
  }

  isProcessing = true;
  updateStatus('Applying style transfer...', 'info');

  try {
    const ort = await import('onnxruntime-web');
    
    // Preprocess: resize to 256x256, normalize to [-1, 1]
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const inputSize = 256;
    canvas.width = inputSize;
    canvas.height = inputSize;
    
    ctx.drawImage(imageData, 0, 0, inputSize, inputSize);
    
    const imageDataObj = ctx.getImageData(0, 0, inputSize, inputSize);
    const pixels = imageDataObj.data;
    
    // Create tensor: [1, 3, 256, 256]
    const floatArray = new Float32Array(1 * 3 * inputSize * inputSize);
    
    for (let i = 0; i < pixels.length; i += 4) {
      const pixelIndex = i / 4;
      
      // Normalize RGB channels from [0, 255] to [-1, 1]
      floatArray[pixelIndex * 3 + 0] = (pixels[i] / 127.5) - 1;     // R
      floatArray[pixelIndex * 3 + 1] = (pixels[i + 1] / 127.5) - 1;  // G
      floatArray[pixelIndex * 3 + 2] = (pixels[i + 2] / 127.5) - 1;  // B
    }
    
    const inputTensor = new ort.Tensor('float32', floatArray, [1, 3, inputSize, inputSize]);
    
    // Run inference
    const feeds = { 'input': inputTensor };
    const results = await session.run(feeds);
    
    isProcessing = false;

    // Postprocess: denormalize and convert to image
    const outputData = results['output'].data;
    
    const resultCanvas = document.createElement('canvas');
    resultCanvas.width = inputSize;
    resultCanvas.height = inputSize;
    
    const resultCtx = resultCanvas.getContext('2d');
    const resultImageData = resultCtx.createImageData(inputSize, inputSize);
    
    for (let i = 0; i < outputData.length; i += 3) {
      const pixelIndex = Math.floor(i / 3);
      
      // Denormalize from [-1, 1] to [0, 255]
      const r = Math.max(0, Math.min(255, Math.round(outputData[i] * 127.5 + 127.5)));
      const g = Math.max(0, Math.min(255, Math.round(outputData[i + 1] * 127.5 + 127.5)));
      const b = Math.max(0, Math.min(255, Math.round(outputData[i + 2] * 127.5 + 127.5)));
      
      resultImageData.data[pixelIndex * 4 + 0] = r;
      resultImageData.data[pixelIndex * 4 + 1] = g;
      resultImageData.data[pixelIndex * 4 + 2] = b;
      resultImageData.data[pixelIndex * 4 + 3] = 255; // Alpha
    }
    
    resultCtx.putImageData(resultImageData, 0, 0);
    
    updateStatus('Style transfer complete!', 'success');
    
    return new Promise((resolve) => {
      resultCanvas.toBlob((blob) => {
        resolve(URL.createObjectURL(blob));
      }, 'image/png');
    });
  } catch (err) {
    console.error('Style transfer error:', err);
    isProcessing = false;
    updateStatus(`Error: ${err.message}`, 'error');
    throw err;
  }
}

/* ------------------------------------------------------------------ */
/* UI Rendering                                                        */
/* ------------------------------------------------------------------ */

function updateStatus(message, type) {
  const banner = document.getElementById('style-transfer-status');
  if (!banner) return;

  banner.textContent = message;
  banner.style.display = 'block';
  banner.className = `style-banner style-banner--${type}`;
}

/* ------------------------------------------------------------------ */
/* Event Handlers                                                      */
/* ------------------------------------------------------------------ */

async function handleImageUpload() {
  const fileInput = document.getElementById('style-image-input');
  const imagePreview = $('#style-image-preview');
  const fileNameDisplay = $('#style-filename-display');

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];

    // Update filename display
    if (fileNameDisplay) {
      fileNameDisplay.textContent = `Selected: ${escHtml(file.name)} (${(file.size / 1024).toFixed(1)} KB)`;
    }

    // Create preview URL and store image data
    const url = URL.createObjectURL(file);
    
    if (imagePreview) {
      imagePreview.src = url;
      imagePreview.style.display = 'block';
    }

    updateStatus('Image uploaded. Select a style and click "Apply Style".', 'success');
  } else {
    fileNameDisplay.textContent = 'No file selected';
  }
}

async function handleStyleSelection() {
  const select = document.getElementById('style-select');
  if (!select) return;
  
  const styleId = select.value;
  updateStatus(`Selected style: ${escHtml(select.options[select.selectedIndex].text)}`, 'info');
}

async function handleApplyStyle() {
  const fileInput = document.getElementById('style-image-input');
  const imagePreview = $('#style-image-preview');
  const resultCanvas = $('#style-result-canvas');
  
  if (fileInput.files.length === 0) {
    updateStatus('Please upload an image first.', 'warning');
    return;
  }

  if (!imagePreview.src || imagePreview.style.display === 'none') {
    updateStatus('Image preview not available. Please re-upload the image.', 'warning');
    return;
  }

  const styleSelect = document.getElementById('style-select');
  const selectedStyleId = styleSelect.value;
  
  // Find the model URL for selected style
  const selectedStyle = STYLES.find(s => s.id === selectedStyleId);
  if (!selectedStyle) {
    updateStatus('Invalid style selection.', 'error');
    return;
  }

  // Load original image for processing
  const img = new Image();
  img.onload = async () => {
    currentImage = img;
    
    try {
      const resultUrl = await applyStyleTransfer(img, selectedStyle.modelUrl);
      
      // Display result on canvas
      if (resultCanvas) {
        URL.revokeObjectURL(resultCanvas.src);
        resultCanvas.src = resultUrl;
      }
    } catch (err) {
      console.error('Apply style error:', err);
    }
  };
  
  img.src = imagePreview.src;
}

/* ------------------------------------------------------------------ */
/* Reset State                                                         */
/* ------------------------------------------------------------------ */

function resetStyleTransferState() {
  isProcessing = false;
  currentImage = null;

  // Clear file input
  const fileInput = document.getElementById('style-image-input');
  if (fileInput) fileInput.value = '';

  // Clear image preview
  const imagePreview = $('#style-image-preview');
  if (imagePreview) {
    imagePreview.src = '';
    imagePreview.style.display = 'none';
  }

  // Clear filename display
  const fileNameDisplay = $('#style-filename-display');
  if (fileNameDisplay) fileNameDisplay.textContent = 'No file selected';

  // Clear result canvas
  const resultCanvas = $('#style-result-canvas');
  if (resultCanvas) {
    URL.revokeObjectURL(resultCanvas.src);
    resultCanvas.src = '';
  }

  // Reset status banner
  const statusBanner = document.getElementById('style-transfer-status');
  if (statusBanner) {
    statusBanner.style.display = 'none';
    statusBanner.textContent = '';
  }

  // Reset style selector to first option
  const styleSelect = document.getElementById('style-select');
  if (styleSelect && styleSelect.options.length > 0) {
    styleSelect.selectedIndex = 0;
  }
}

/* ------------------------------------------------------------------ */
/* Event Wiring                                                        */
/* ------------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
  // Populate style options
  const styleSelect = document.getElementById('style-select');
  if (styleSelect) {
    STYLES.forEach(style => {
      const option = document.createElement('option');
      option.value = style.id;
      option.textContent = `${style.name} (${(new URL(style.modelUrl, 'https://huggingface.co/').pathname).split('/').pop()})`;
      styleSelect.appendChild(option);
    });
  }

  // Image upload handler
  const fileInput = document.getElementById('style-image-input');
  if (fileInput) {
    fileInput.addEventListener('change', handleImageUpload);
  }

  // Style selection handler
  const styleSelectEl = document.getElementById('style-select');
  if (styleSelectEl) {
    styleSelectEl.addEventListener('change', handleStyleSelection);
  }

  // Apply Style button
  const btnApply = document.getElementById('btn-style-apply');
  if (btnApply) {
    btnApply.addEventListener('click', handleApplyStyle);
  }

  // Back button
  const btnBack = document.getElementById('btn-style-back');
  if (btnBack) {
    btnBack.addEventListener('click', () => navigateTo('home'));
  }

  // Initial state
  resetStyleTransferState();
});

// Expose for navigation integration
window.resetStyleTransferState = resetStyleTransferState;
