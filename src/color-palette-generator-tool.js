// Color Palette Generator — client-side tool for extracting color palettes from images
// Uses k-means clustering on pixel data, no server round-trips

const PALETTE_CONFIG = {
  DEFAULT_PALETTE_SIZE: 6,
  MAX_PALETTE_SIZE: 10,
  KMEANS_ITERATIONS: 50,
};

// Simple k-means clustering implementation for color extraction
class ColorKMeans {
  constructor(k, maxIterations) {
    this.k = k;
    this.maxIterations = maxIterations;
    this.centroids = [];
    this.labels = [];
  }

  // Initialize centroids using k-means++ algorithm
  initializeCentroids(pixels) {
    this.centroids = [pixels[Math.floor(Math.random() * pixels.length)].slice()];

    for (let i = 1; i < this.k; i++) {
      const distances = pixels.map(pixel => {
        const minDist = Math.min(...this.centroids.map(centroid => {
          return this.euclideanDistance(pixel, centroid);
        }));
        return minDist * minDist; // Square for k-means++
      });

      const totalDist = distances.reduce((a, b) => a + b, 0);
      if (totalDist === 0) {
        this.centroids.push(pixels[Math.floor(Math.random() * pixels.length)].slice());
        continue;
      }

      // Select next centroid with probability proportional to distance squared
      let random = Math.random() * totalDist;
      for (let j = 0; j < distances.length; j++) {
        random -= distances[j];
        if (random <= 0) {
          this.centroids.push(pixels[j].slice());
          break;
        }
      }

      // Fallback if we didn't select anything
      if (this.centroids.length < i + 1) {
        this.centroids.push(pixels[Math.floor(Math.random() * pixels.length)].slice());
      }
    }
  }

  // Assign each pixel to nearest centroid
  assignLabels(pixels) {
    this.labels = pixels.map(pixel => {
      let minDist = Infinity;
      let label = 0;
      for (let i = 0; i < this.centroids.length; i++) {
        const dist = this.euclideanDistance(pixel, this.centroids[i]);
        if (dist < minDist) {
          minDist = dist;
          label = i;
        }
      }
      return label;
    });
  }

  // Update centroids based on current assignments
  updateCentroids(pixels) {
    const newCentroids = Array.from({ length: this.k }, () => [0, 0, 0]);
    const counts = new Array(this.k).fill(0);

    for (let i = 0; i < pixels.length; i++) {
      const label = this.labels[i];
      if (label >= 0 && label < this.k) {
        newCentroids[label][0] += pixels[i][0];
        newCentroids[label][1] += pixels[i][1];
        newCentroids[label][2] += pixels[i][2];
        counts[label]++;
      }
    }

    for (let i = 0; i < this.k; i++) {
      if (counts[i] > 0) {
        newCentroids[i][0] = Math.round(newCentroids[i][0] / counts[i]);
        newCentroids[i][1] = Math.round(newCentroids[i][1] / counts[i]);
        newCentroids[i][2] = Math.round(newCentroids[i][2] / counts[i]);
      } else {
        // If no pixels assigned, keep old centroid or pick random pixel
        if (this.centroids[i]) {
          newCentroids[i] = this.centroids[i].slice();
        } else {
          const randomPixel = pixels[Math.floor(Math.random() * pixels.length)];
          newCentroids[i] = randomPixel ? randomPixel.slice() : [128, 128, 128];
        }
      }
    }

    this.centroids = newCentroids;
  }

  // Euclidean distance in RGB space
  euclideanDistance(a, b) {
    return Math.sqrt(
      Math.pow(a[0] - b[0], 2) +
      Math.pow(a[1] - b[1], 2) +
      Math.pow(a[2] - b[2], 2)
    );
  }

  // Run k-means clustering on pixels (each pixel is [r, g, b])
  cluster(pixels) {
    this.initializeCentroids(pixels);

    for (let iter = 0; iter < this.maxIterations; iter++) {
      const prevLabels = [...this.labels];
      this.assignLabels(pixels);
      this.updateCentroids(pixels);

      // Check convergence
      if (JSON.stringify(prevLabels) === JSON.stringify(this.labels)) {
        break;
      }
    }

    return this.centroids.map(c => `rgb(${c[0]}, ${c[1]}, ${c[2]})`);
  }
}

// Extract palette from image using k-means clustering
function extractPaletteFromImage(imageData, paletteSize = PALETTE_CONFIG.DEFAULT_PALETTE_SIZE) {
  const pixels = [];
  const data = imageData.data;

  // Sample pixels (skip some for performance)
  const step = Math.max(1, Math.floor(data.length / 4 / 5000)); // Aim for ~5000 samples max
  for (let i = 0; i < data.length; i += 4 * step) {
    if (data[i + 3] > 0) { // Skip transparent pixels
      pixels.push([data[i], data[i + 1], data[i + 2]]);
    }
  }

  if (pixels.length === 0) return [];

  const kMeans = new ColorKMeans(paletteSize, PALETTE_CONFIG.KMEANS_ITERATIONS);
  return kMeans.cluster(pixels);
}

// Convert hex color to RGB components
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
}

// Convert RGB to hex color string
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

// Sort colors by brightness for better visual harmony
function sortColorsByBrightness(colors) {
  return [...colors].sort((a, b) => {
    const rgbA = hexToRgb(a);
    const rgbB = hexToRgb(b);
    if (!rgbA || !rgbB) return 0;

    // Simple brightness formula: (R*299 + G*587 + B*114) / 1000
    const brightnessA = (rgbA[0] * 299 + rgbA[1] * 587 + rgbA[2] * 114) / 1000;
    const brightnessB = (rgbB[0] * 299 + rgbB[1] * 587 + rgbB[2] * 114) / 1000;
    return brightnessA - brightnessB;
  });
}

// Generate CSS for palette display
function generatePaletteCSS(colors) {
  return colors.map(color => `background-color: ${color};`).join('\n');
}

// Generate color palette preview HTML
function generatePalettePreviewHTML(colors) {
  let html = '<div style="display: flex; gap: 0.5rem; margin-top: 1rem;">\n';
  colors.forEach(color => {
    html += `  <div class="color-swatch" style="width: 80px; height: 80px; background-color: ${color}; border-radius: 8px; display: flex; align-items: flex-end; justify-content: center;">\n`;
    html += `    <span class="color-hex" style="font-size: 0.7rem; padding: 0.25rem; background: rgba(0,0,0,0.6); color: white; border-radius: 4px;">${color}</span>\n`;
    html += `  </div>\n`;
  });
  html += '</div>';
  return html;
}

// Initialize the Color Palette Generator tool
function initColorPaletteGenerator() {
  const imageInput = document.getElementById('palette-image-input');
  const fileUpload = document.getElementById('palette-file-upload');
  const btnGenerate = document.getElementById('btn-generate-palette');
  const outputArea = document.getElementById('palette-output');

  if (!imageInput || !fileUpload || !btnGenerate || !outputArea) return;

  // File upload handler
  fileUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      imageInput.src = event.target.result;
      showStatus(`Loaded ${file.name}`, 'success');
    };
    reader.onerror = () => {
      showStatus('Error reading file', 'error');
    };
    reader.readAsDataURL(file);
  });

  // Generate palette button handler
  btnGenerate.addEventListener('click', handleGeneratePalette);
}

async function handleGeneratePalette() {
  const imageInput = document.getElementById('palette-image-input');
  const outputArea = document.getElementById('palette-output');

  if (!imageInput || !outputArea) return;

  if (imageInput.src === '' || imageInput.src === window.location.href) {
    showStatus('Please upload an image first.', 'error');
    return;
  }

  try {
    // Create canvas to extract pixel data
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imageInput.naturalWidth || imageInput.width;
    canvas.height = imageInput.naturalHeight || imageInput.height;

    ctx.drawImage(imageInput, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Extract palette (limit to 10 colors max)
    const paletteSize = Math.min(PALETTE_CONFIG.MAX_PALETTE_SIZE, PALETTE_CONFIG.DEFAULT_PALETTE_SIZE + 4);
    let colors = extractPaletteFromImage(imageData, paletteSize);

    if (colors.length === 0) {
      showStatus('Could not extract palette from image.', 'error');
      return;
    }

    // Sort by brightness for better visual harmony
    const sortedColors = sortColorsByBrightness(colors.map(rgbToHex));

    // Generate output
    let outputHTML = generatePalettePreviewHTML(sortedColors);
    outputHTML += '<div style="margin-top: 1rem;">\n';
    outputHTML += '  <h4>CSS Variables:</h4>\n';
    sortedColors.forEach((color, index) => {
      outputHTML += `  :root {\n`;
      outputHTML += `    --palette-color-${index + 1}: ${color};\n`;
      outputHTML += `  }\n\n`;
    });
    outputHTML += '</div>';

    // Display in output area (using innerHTML for HTML content)
    outputArea.innerHTML = outputHTML;
    showStatus('Palette generated successfully!', 'success');

  } catch (err) {
    showStatus(`Generation error: ${err.message}`, 'error');
  }
}

function showStatus(message, type = 'info') {
  const statusEl = document.getElementById('palette-status');
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.className = `glass-card json-formatter-banner ${type}`;
  statusEl.style.display = 'block';
}

// Export for use by main.js navigation handler
if (typeof window !== 'undefined') {
  window.initColorPaletteGenerator = initColorPaletteGenerator;
}
