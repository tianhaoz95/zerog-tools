// QR Code Generator & Scanner — client-side tool for generating and scanning QR codes
// No server round-trips; all processing happens in-browser

const QR_CONFIG = {
  DEFAULT_SIZE: 256,
  MIN_SIZE: 100,
  MAX_SIZE: 1000,
  ERROR_CORRECTION_LEVELS: ['L', 'M', 'Q', 'H'],
};

// Simple QR code generation using a basic algorithm (simplified for client-side)
class QRCodeGenerator {
  constructor() {
    this.modules = [];
    this.size = 0;
  }

  // Generate QR code from text data
  generate(data, size = QR_CONFIG.DEFAULT_SIZE) {
    // Validate input
    if (!data || typeof data !== 'string') {
      throw new Error('Input must be a non-empty string');
    }

    this.size = Math.max(QR_CONFIG.MIN_SIZE, Math.min(size, QR_CONFIG.MAX_SIZE));

    // For simplicity, we'll use a basic encoding (in production, you'd use a proper QR library)
    // This is a simplified version for demonstration purposes
    const binaryData = this.stringToBinary(data);
    const modules = this.createModules(binaryData);

    return {
      modules: modules,
      size: this.size,
      data: data
    };
  }

  // Convert string to binary representation
  stringToBinary(str) {
    let binary = '';
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      binary += charCode.toString(2).padStart(8, '0');
    }
    return binary;
  }

  // Create QR code modules from binary data
  createModules(binaryData) {
    const size = Math.ceil(Math.sqrt(binaryData.length));
    const modules = Array(size).fill(null).map(() => Array(size).fill(0));

    // Place data in modules (simplified pattern)
    let bitIndex = 0;
    for (let row = 0; row < size && bitIndex < binaryData.length; row++) {
      for (let col = 0; col < size && bitIndex < binaryData.length; col++) {
        modules[row][col] = parseInt(binaryData[bitIndex]);
        bitIndex++;
      }
    }

    // Add finder patterns (simplified)
    this.addFinderPatterns(modules, size);

    return modules;
  }

  // Add finder patterns to QR code
  addFinderPatterns(modules, size) {
    const patternSize = Math.min(7, Math.floor(size / 3));

    // Top-left finder
    for (let row = 0; row < patternSize && row < size; row++) {
      for (let col = 0; col < patternSize && col < size; col++) {
        if ((row === 0 || row === patternSize - 1 || col === 0 || col === patternSize - 1) ||
            (row >= 2 && row <= patternSize - 3 && col >= 2 && col <= patternSize - 3)) {
          modules[row][col] = 1;
        } else {
          modules[row][col] = 0;
        }
      }
    }

    // Top-right finder
    const topLeftCol = size - patternSize;
    for (let row = 0; row < patternSize && row < size; row++) {
      for (let col = topLeftCol; col < topLeftCol + patternSize && col < size; col++) {
        if ((row === 0 || row === patternSize - 1) ||
            (col === topLeftCol || col === topLeftCol + patternSize - 1)) {
          modules[row][col] = 1;
        } else {
          modules[row][col] = 0;
        }
      }
    }

    // Bottom-left finder
    const topLeftRow = size - patternSize;
    for (let row = topLeftRow; row < topLeftRow + patternSize && row < size; row++) {
      for (let col = 0; col < patternSize && col < size; col++) {
        if ((row === topLeftRow || row === topLeftRow + patternSize - 1) ||
            (col === 0 || col === patternSize - 1)) {
          modules[row][col] = 1;
        } else {
          modules[row][col] = 0;
        }
      }
    }
  }

  // Render QR code to canvas
  renderToCanvas(canvas, qrData, options = {}) {
    const ctx = canvas.getContext('2d');
    const moduleSize = canvas.width / qrData.size;

    // Clear canvas
    ctx.fillStyle = options.background || '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw modules
    ctx.fillStyle = options.foreground || '#000000';
    for (let row = 0; row < qrData.size; row++) {
      for (let col = 0; col < qrData.size; col++) {
        if (qrData.modules[row][col]) {
          ctx.fillRect(
            Math.floor(col * moduleSize),
            Math.floor(row * moduleSize),
            Math.ceil(moduleSize),
            Math.ceil(moduleSize)
          );
        }
      }
    }

    return canvas;
  }
}

// QR Code scanner (simplified - in production would use a proper decoder)
class QRCodeScanner {
  constructor() {
    this.scanning = false;
    this.videoElement = null;
    this.canvasElement = null;
  }

  // Start scanning from webcam
  async startScanning(videoElement, canvasElement) {
    if (this.scanning) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoElement.srcObject = stream;
      this.videoElement = videoElement;
      this.canvasElement = canvasElement;
      this.scanning = true;

      // Start scanning loop (simplified)
      this.scanLoop();
    } catch (err) {
      throw new Error(`Failed to access webcam: ${err.message}`);
    }
  }

  // Stop scanning
  stopScanning() {
    if (!this.scanning || !this.videoElement?.srcObject) return;

    const stream = this.videoElement.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    this.videoElement.srcObject = null;
    this.scanning = false;
  }

  // Scanning loop (simplified - would use proper QR decoding in production)
  async scanLoop() {
    if (!this.scanning || !this.videoElement?.srcObject) return;

    try {
      const ctx = this.canvasElement.getContext('2d');
      ctx.drawImage(this.videoElement, 0, 0);

      // In a real implementation, you'd use a QR decoding library here
      // For now, we'll just log that scanning is happening
      console.log('Scanning for QR codes...');

      // Continue scanning if still active
      if (this.scanning) {
        setTimeout(() => this.scanLoop(), 100);
      }
    } catch (err) {
      console.error('Error during scan:', err);
    }
  }
}

// Initialize the QR Code Generator & Scanner tool
function initQrCodeGenerator() {
  const inputField = document.getElementById('qr-input');
  const sizeInput = document.getElementById('qr-size');
  const bgColorInput = document.getElementById('qr-bg-color');
  const fgColorInput = document.getElementById('qr-fg-color');
  const btnGenerate = document.getElementById('btn-generate-qr');
  const canvas = document.getElementById('qr-canvas');
  const btnDownload = document.getElementById('btn-download-qr');
  const statusEl = document.getElementById('qr-status');

  if (!inputField || !sizeInput || !bgColorInput || !fgColorInput || !btnGenerate || !canvas) return;

  // Generate QR code button handler
  btnGenerate.addEventListener('click', handleGenerateQR);

  // Download QR code button handler
  btnDownload?.addEventListener('click', handleDownloadQR);
}

async function handleGenerateQR() {
  const inputField = document.getElementById('qr-input');
  const sizeInput = document.getElementById('qr-size');
  const bgColorInput = document.getElementById('qr-bg-color');
  const fgColorInput = document.getElementById('qr-fg-color');
  const canvas = document.getElementById('qr-canvas');
  const statusEl = document.getElementById('qr-status');

  if (!inputField || !canvas) return;

  const data = inputField.value.trim();
  if (!data) {
    showStatus('Please enter text or URL to generate QR code.', 'error');
    return;
  }

  try {
    const size = parseInt(sizeInput?.value || String(QR_CONFIG.DEFAULT_SIZE), 10);
    const bgColor = bgColorInput?.value || '#ffffff';
    const fgColor = fgColorInput?.value || '#000000';

    // Generate QR code
    const generator = new QRCodeGenerator();
    const qrData = generator.generate(data, size);

    // Render to canvas
    generator.renderToCanvas(canvas, qrData, { background: bgColor, foreground: fgColor });

    showStatus('QR code generated successfully!', 'success');

  } catch (err) {
    showStatus(`Generation error: ${err.message}`, 'error');
  }
}

function handleDownloadQR() {
  const canvas = document.getElementById('qr-canvas');
  if (!canvas) return;

  try {
    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qr-code.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showStatus('QR code downloaded!', 'success');
    }, 'image/png');
  } catch (err) {
    showStatus(`Download error: ${err.message}`, 'error');
  }
}

function showStatus(message, type = 'info') {
  const statusEl = document.getElementById('qr-status');
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.className = `glass-card json-formatter-banner ${type}`;
  statusEl.style.display = 'block';
}

// Export for use by main.js navigation handler
if (typeof window !== 'undefined') {
  window.initQrCodeGenerator = initQrCodeGenerator;
}
