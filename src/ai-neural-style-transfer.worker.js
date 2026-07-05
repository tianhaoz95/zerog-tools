// ZeroG Toolbox — AI Neural Style Transfer Worker
// Processes style transfer using ONNX Runtime Web with WebGPU support

export {}; // Make this a module so Vite includes it

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

let session = null;
let isModelLoaded = false;

// Model configuration for style transfer
const MODEL_CONFIG = {
  inputSize: 256,
  outputChannels: 3,
  modelUrl: 'https://huggingface.co/onnx-community/fast-neural-style/resolve/main/model.onnx',
};

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
    // Dynamic import for ONNX Runtime Web
    const ort = await import('onnxruntime-web');
    
    // Configure session options for WebGPU if available
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

async functionloadModel() {
  if (isModelLoaded && session) return session;

  updateStatus('Loading style transfer model...', 'info');

  try {
    const ort = await loadONNXRuntime();
    
    // Load the ONNX model from HuggingFace Hub
    session = await ort.InferenceSession.create(MODEL_CONFIG.modelUrl, {
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

async function applyStyleTransfer(imageData, styleId) {
  if (!session) {
    await loadModel();
  }

  if (!imageData) {
    updateStatus('Please upload an image first.', 'warning');
    return null;
  }

  isProcessing = true;
  updateStatus(`Applying style: ${styleId}...`, 'info');

  try {
    // Preprocess image: resize to input size, normalize to [-1, 1]
    const processedTensor = await preprocessImage(imageData);
    
    // Run inference
    const feeds = {};
    for (const name of session.inputs) {
      if (name.name === 'input') {
        feeds[name.name] = processedTensor;
      }
    }

    const results = await session.run(feeds);
    
    isProcessing = false;

    // Postprocess output tensor to image
    const outputImage = await postprocessOutput(results['output']);
    
    updateStatus(`Style applied: ${styleId}`, 'success');
    
    return outputImage;
  } catch (err) {
    console.error('Style transfer error:', err);
    isProcessing = false;
    updateStatus(`Error: ${err.message}`, 'error');
    throw err;
  }
}

async function preprocessImage(imageData) {
  const ort = await import('onnxruntime-web');
  
  // Create canvas to resize image
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = MODEL_CONFIG.inputSize;
  canvas.height = MODEL_CONFIG.inputSize;
  
  ctx.drawImage(imageData, 0, 0, MODEL_CONFIG.inputSize, MODEL_CONFIG.inputSize);
  
  // Get pixel data and normalize to [-1, 1]
  const imageDataObj = ctx.getImageData(0, 0, MODEL_CONFIG.inputSize, MODEL_CONFIG.inputSize);
  const pixels = imageDataObj.data;
  
  // Create tensor: [1, 3, 256, 256] (batch, channels, height, width)
  const floatArray = new Float32Array(1 * 3 * MODEL_CONFIG.inputSize * MODEL_CONFIG.inputSize);
  
  for (let i = 0; i < pixels.length; i += 4) {
    const pixelIndex = i / 4;
    const channel = i % 4; // R, G, B, A
    
    if (channel < 3) { // RGB only
      // Normalize from [0, 255] to [-1, 1]
      floatArray[pixelIndex * 3 + channel] = (pixels[i] / 127.5) - 1;
    }
  }
  
  return new ort.Tensor('float32', floatArray, [1, 3, MODEL_CONFIG.inputSize, MODEL_CONFIG.inputSize]);
}

async function postprocessOutput(tensor) {
  const data = tensor.data; // Float32Array
  const size = MODEL_CONFIG.inputSize;
  
  // Create output canvas
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(size, size);
  
  // Denormalize from [-1, 1] to [0, 255] and convert NHWC format
  for (let i = 0; i < data.length; i += 3) {
    const pixelIndex = Math.floor(i / 3);
    
    // Convert from NCHW to NHWC layout
    const channel = i % 3;
    const y = Math.floor(pixelIndex / size);
    const x = pixelIndex % size;
    
    // Denormalize: multiply by 127.5 and add 127.5
    const value = Math.max(0, Math.min(255, Math.round(data[i] * 127.5 + 127.5)));
    
    imageData.data[(y * size + x) * 4 + channel] = value;
    imageData.data[(y * size + x) * 4 + 3] = 255; // Alpha
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  // Convert to blob URL for display
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(URL.createObjectURL(blob));
    }, 'image/png');
  });
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

  // Load original image data for processing
  const img = new Image();
  img.onload = async () => {
    await applyStyleTransfer(img, document.getElementById('style-select').value);
    
    // Display result on canvas
    if (resultCanvas) {
      resultCanvas.src = '';
      URL.revokeObjectURL(resultCanvas.src);
      
      // Get the processed image URL from applyStyleTransfer
      const resultUrl = await applyStyleTransfer(img, document.getElementById('style-select').value);
      if (resultUrl) {
        resultCanvas.src = resultUrl;
      }
    }
  };
  
  img.src = imagePreview.src;
}

/* ------------------------------------------------------------------ */
/* Reset State                                                         */
/* ------------------------------------------------------------------ */

function resetStyleTransferState() {
  isProcessing = false;

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
  // Image upload handler
  const fileInput = document.getElementById('style-image-input');
  if (fileInput) {
    fileInput.addEventListener('change', handleImageUpload);
  }

  // Style selection handler
  const styleSelect = document.getElementById('style-select');
  if (styleSelect) {
    styleSelect.addEventListener('change', handleStyleSelection);
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
