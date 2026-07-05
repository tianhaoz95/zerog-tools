// ZeroG Toolbox — Grainy Gradient / Noise Texture Generator Worker
// Generates layered noise-over-gradient backgrounds with exportable CSS/SVG/PNG

export {}; // Make this a module so Vite includes it

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

let isProcessing = false;

// Available gradient presets for the grainy gradient trend
const GRADIENT_PRESETS = [
  { id: 'sunset', name: 'Sunset Glow', colors: ['#ff6b6b', '#feca57', '#48dbfb'] },
  { id: 'ocean', name: 'Ocean Breeze', colors: ['#0abde3', '#48dbfb', '#a29bfe'] },
  { id: 'purple', name: 'Purple Haze', colors: ['#6c5ce7', '#a29bfe', '#fd79a8'] },
  { id: 'forest', name: 'Forest Mist', colors: ['#00b894', '#55efc4', '#81ecec'] },
  { id: 'rose', name: 'Rose Gold', colors: ['#fd79a8', '#fab1a0', '#ffeaa7'] },
  { id: 'midnight', name: 'Midnight Blue', colors: ['#2d3436', '#636e72', '#b2bec3'] },
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
/* Noise Generation                                                    */
/* ------------------------------------------------------------------ */

function generateNoise(width, height, opacity = 0.3) {
  // Create canvas for noise texture
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  
  // Generate random pixel data
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    // Random grayscale value with transparency
    const alpha = Math.random() * opacity * 255;
    
    data[i] = Math.floor(Math.random() * 256);     // R
    data[i + 1] = Math.floor(Math.random() * 256); // G
    data[i + 2] = Math.floor(Math.random() * 256); // B
    data[i + 3] = alpha;                             // A (transparency)
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  return canvas;
}

/* ------------------------------------------------------------------ */
/* Gradient Generation                                                 */
/* ------------------------------------------------------------------ */

function generateGradient(width, height, colors) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  
  // Create linear gradient based on number of colors
  let gradient;
  
  if (colors.length === 2) {
    // Two-color gradient (diagonal)
    gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);
  } else if (colors.length === 3) {
    // Three-color gradient (triangular)
    gradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height) / 1.5
    );
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.5, colors[1]);
    gradient.addColorStop(1, colors[2]);
  } else {
    // Fallback to two-color
    gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[colors.length - 1] || colors[0]);
  }
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas;
}

/* ------------------------------------------------------------------ */
/* Grainy Gradient Composition                                         */
/* ------------------------------------------------------------------ */

async function generateGrainyGradient(presetId, noiseOpacity = 0.3) {
  const preset = GRADIENT_PRESETS.find(p => p.id === presetId);
  
  if (!preset) {
    updateStatus('Invalid gradient preset selected.', 'error');
    return null;
  }

  isProcessing = true;
  updateStatus(`Generating grainy gradient: ${preset.name}...`, 'info');

  try {
    const width = 800; // Standard preview size
    const height = 600;
    
    // Generate base gradient
    const gradientCanvas = generateGradient(width, height, preset.colors);
    
    // Generate noise overlay
    const noiseCanvas = generateNoise(width, height, noiseOpacity);
    
    // Composite: gradient + noise
    const compositeCanvas = document.createElement('canvas');
    compositeCanvas.width = width;
    compositeCanvas.height = height;
    
    const ctx = compositeCanvas.getContext('2d');
    
    // Draw gradient first
    ctx.drawImage(gradientCanvas, 0, 0);
    
    // Draw noise on top with blend mode
    ctx.globalCompositeOperation = 'overlay';
    ctx.drawImage(noiseCanvas, 0, 0);
    
    isProcessing = false;
    updateStatus('Grainy gradient generated!', 'success');

    // Convert to blob URL for display/download
    return new Promise((resolve) => {
      compositeCanvas.toBlob((blob) => {
        resolve(URL.createObjectURL(blob));
      }, 'image/png');
    });
  } catch (err) {
    console.error('Grainy gradient generation error:', err);
    isProcessing = false;
    updateStatus(`Error: ${err.message}`, 'error');
    throw err;
  }
}

/* ------------------------------------------------------------------ */
/* CSS Generation                                                      */
/* ------------------------------------------------------------------ */

function generateCSS(presetId, noiseOpacity = 0.3) {
  const preset = GRADIENT_PRESETS.find(p => p.id === presetId);
  
  if (!preset) return null;

  // Generate base64 noise texture for CSS background
  const width = 200; // Small tile size for repetition
  const height = 200;
  
  const noiseCanvas = generateNoise(width, height, noiseOpacity);
  
  // Convert to data URL for CSS background-image
  const noiseDataURL = noiseCanvas.toDataURL('image/png');

  // Generate gradient string based on preset
  let gradientString;
  
  if (preset.colors.length === 2) {
    gradientString = `linear-gradient(135deg, ${preset.colors[0]}, ${preset.colors[1]})`;
  } else if (preset.colors.length >= 3) {
    // Use multiple stops for multi-color gradients
    const stopCount = preset.colors.length - 1;
    const stops = preset.colors.map((color, index) => 
      `${color} ${(index / stopCount * 100).toFixed(1)}%`
    ).join(', ');
    gradientString = `linear-gradient(135deg, ${stops})`;
  } else {
    gradientString = preset.colors[0];
  }

  // Construct CSS with noise overlay
  const cssCode = `/* Grainy Gradient Background */
/* Generated by ZeroG Toolbox — Grainy Gradient / Noise Texture Generator */

.grainy-gradient-bg {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.grainy-gradient-bg::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${gradientString};
  z-index: 1;
}

.grainy-gradient-bg::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("${noiseDataURL}");
  background-size: cover;
  opacity: ${noiseOpacity};
  mix-blend-mode: overlay;
  z-index: 2;
  pointer-events: none;
}

/* Usage in HTML: */
/* <div class="grainy-gradient-bg"></div> */`;

  return cssCode;
}

/* ------------------------------------------------------------------ */
/* SVG Generation                                                      */
/* ------------------------------------------------------------------ */

function generateSVG(presetId, noiseOpacity = 0.3) {
  const preset = GRADIENT_PRESETS.find(p => p.id === presetId);
  
  if (!preset) return null;

  // Generate base64 noise texture for SVG filter
  const width = 100;
  const height = 100;
  
  const noiseCanvas = generateNoise(width, height, noiseOpacity * 0.5);
  const noiseDataURL = noiseCanvas.toDataURL('image/png');

  // Build SVG with gradient and noise filter
  let gradientStops = '';
  if (preset.colors.length >= 2) {
    preset.colors.forEach((color, index) => {
      const offset = (index / (preset.colors.length - 1)) * 100;
      gradientStops += `<stop offset="${offset}%" stop-color="${color}" />`;
    });
  }

  const svgCode = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <defs>
    <!-- Grainy Gradient Background -->
    <linearGradient id="grainyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      ${gradientStops}
    </linearGradient>
    
    <!-- Noise Filter for Grain Effect -->
    <filter id="noiseFilter">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="${noiseOpacity}"/>
      </feComponentTransfer>
    </filter>
  </defs>
  
  <!-- Base Gradient -->
  <rect width="100%" height="100%" fill="url(#grainyGrad)"/>
  
  <!-- Noise Overlay -->
  <rect width="100%" height="100%" filter="url(#noiseFilter)" opacity="${noiseOpacity}"/>
</svg>`;

  return svgCode;
}

/* ------------------------------------------------------------------ */
/* UI Rendering                                                        */
/* ------------------------------------------------------------------ */

function updateStatus(message, type) {
  const banner = document.getElementById('grainy-gradient-status');
  if (!banner) return;

  banner.textContent = message;
  banner.style.display = 'block';
  banner.className = `grainy-banner grainy-banner--${type}`;
}

/* ------------------------------------------------------------------ */
/* Event Handlers                                                      */
/* ------------------------------------------------------------------ */

async function handlePresetSelection() {
  const select = document.getElementById('grainy-gradient-preset-select');
  if (!select) return;
  
  const presetId = select.value;
  updateStatus(`Selected gradient: ${escHtml(select.options[select.selectedIndex].text)}`, 'info');
}

async function handleNoiseOpacityChange() {
  const slider = document.getElementById('grainy-gradient-noise-opacity');
  if (!slider) return;
  
  const opacity = parseFloat(slider.value);
  updateStatus(`Noise opacity: ${(opacity * 100).toFixed(0)}%`, 'info');
}

async function handleGeneratePreview() {
  const presetSelect = document.getElementById('grainy-gradient-preset-select');
  const noiseSlider = document.getElementById('grainy-gradient-noise-opacity');
  
  if (!presetSelect || !noiseSlider) return;
  
  const presetId = presetSelect.value;
  const noiseOpacity = parseFloat(noiseSlider.value);

  try {
    const resultUrl = await generateGrainyGradient(presetId, noiseOpacity);
    
    // Display result on preview canvas
    const resultImage = $('#grainy-gradient-result-image');
    if (resultImage) {
      URL.revokeObjectURL(resultImage.src);
      resultImage.src = resultUrl;
    }
  } catch (err) {
    console.error('Generate preview error:', err);
  }
}

async function handleExportCSS() {
  const presetSelect = document.getElementById('grainy-gradient-preset-select');
  const noiseSlider = document.getElementById('grainy-gradient-noise-opacity');
  
  if (!presetSelect || !noiseSlider) return;
  
  const presetId = presetSelect.value;
  const noiseOpacity = parseFloat(noiseSlider.value);

  try {
    const cssCode = generateCSS(presetId, noiseOpacity);
    
    // Display CSS in code output area
    const codeDisplay = $('#grainy-gradient-css-output');
    if (codeDisplay) {
      codeDisplay.textContent = cssCode;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(cssCode);
      updateStatus('CSS copied to clipboard!', 'success');
    }
  } catch (err) {
    console.error('Export CSS error:', err);
    updateStatus(`Error: ${err.message}`, 'error');
  }
}

async function handleDownloadPNG() {
  const presetSelect = document.getElementById('grainy-gradient-preset-select');
  const noiseSlider = document.getElementById('grainy-gradient-noise-opacity');
  
  if (!presetSelect || !noiseSlider) return;
  
  const presetId = presetSelect.value;
  const noiseOpacity = parseFloat(noiseSlider.value);

  try {
    const resultUrl = await generateGrainyGradient(presetId, noiseOpacity);
    
    // Create download link and trigger download
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `grainy-gradient-${presetId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(resultUrl);
    updateStatus('PNG downloaded!', 'success');
  } catch (err) {
    console.error('Download PNG error:', err);
    updateStatus(`Error: ${err.message}`, 'error');
  }
}

async function handleDownloadSVG() {
  const presetSelect = document.getElementById('grainy-gradient-preset-select');
  const noiseSlider = document.getElementById('grainy-gradient-noise-opacity');
  
  if (!presetSelect || !noiseSlider) return;
  
  const presetId = presetSelect.value;
  const noiseOpacity = parseFloat(noiseSlider.value);

  try {
    const svgCode = generateSVG(presetId, noiseOpacity);
    
    // Create blob and download link
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `grainy-gradient-${presetId}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
    updateStatus('SVG downloaded!', 'success');
  } catch (err) {
    console.error('Download SVG error:', err);
    updateStatus(`Error: ${err.message}`, 'error');
  }
}

/* ------------------------------------------------------------------ */
/* Reset State                                                         */
/* ------------------------------------------------------------------ */

function resetGrainyGradientState() {
  isProcessing = false;

  // Clear result image
  const resultImage = $('#grainy-gradient-result-image');
  if (resultImage) {
    URL.revokeObjectURL(resultImage.src);
    resultImage.src = '';
  }

  // Clear CSS output
  const codeDisplay = $('#grainy-gradient-css-output');
  if (codeDisplay) {
    codeDisplay.textContent = 'Click "Export CSS" to generate and copy CSS code.';
  }

  // Reset status banner
  const statusBanner = document.getElementById('grainy-gradient-status');
  if (statusBanner) {
    statusBanner.style.display = 'none';
    statusBanner.textContent = '';
  }

  // Reset preset selector to first option
  const presetSelect = document.getElementById('grainy-gradient-preset-select');
  if (presetSelect && presetSelect.options.length > 0) {
    presetSelect.selectedIndex = 0;
  }

  // Reset noise opacity slider to default
  const noiseSlider = document.getElementById('grainy-gradient-noise-opacity');
  if (noiseSlider) {
    noiseSlider.value = '0.3';
  }
}

/* ------------------------------------------------------------------ */
/* Event Wiring                                                        */
/* ------------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
  // Populate preset options
  const presetSelect = document.getElementById('grainy-gradient-preset-select');
  if (presetSelect) {
    GRADIENT_PRESETS.forEach(preset => {
      const option = document.createElement('option');
      option.value = preset.id;
      option.textContent = `${preset.name} — ${preset.colors.join(', ')}`;
      presetSelect.appendChild(option);
    });
  }

  // Preset selection handler
  const presetSelectEl = document.getElementById('grainy-gradient-preset-select');
  if (presetSelectEl) {
    presetSelectEl.addEventListener('change', handlePresetSelection);
  }

  // Noise opacity slider handler
  const noiseSlider = document.getElementById('grainy-gradient-noise-opacity');
  if (noiseSlider) {
    noiseSlider.addEventListener('input', handleNoiseOpacityChange);
  }

  // Generate Preview button
  const btnGenerate = document.getElementById('btn-grainy-gradient-generate');
  if (btnGenerate) {
    btnGenerate.addEventListener('click', handleGeneratePreview);
  }

  // Export CSS button
  const btnExportCSS = document.getElementById('btn-grainy-gradient-export-css');
  if (btnExportCSS) {
    btnExportCSS.addEventListener('click', handleExportCSS);
  }

  // Download PNG button
  const btnDownloadPNG = document.getElementById('btn-grainy-gradient-download-png');
  if (btnDownloadPNG) {
    btnDownloadPNG.addEventListener('click', handleDownloadPNG);
  }

  // Download SVG button
  const btnDownloadSVG = document.getElementById('btn-grainy-gradient-download-svg');
  if (btnDownloadSVG) {
    btnDownloadSVG.addEventListener('click', handleDownloadSVG);
  }

  // Back button
  const btnBack = document.getElementById('btn-grainy-gradient-back');
  if (btnBack) {
    btnBack.addEventListener('click', () => navigateTo('home'));
  }

  // Initial state
  resetGrainyGradientState();
});

// Expose for navigation integration
window.resetGrainyGradientState = resetGrainyGradientState;
