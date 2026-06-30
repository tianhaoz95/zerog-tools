// ZeroG Toolbox — Extra Tools Business Logic
// Implements 25 new client-side utilities

window.addEventListener('DOMContentLoaded', () => {
  // Helpers
  function copyText(val) {
    navigator.clipboard.writeText(val);
    alert('Copied to clipboard!');
  }

  // ============================================================================
  // 1. CREDIT CARD LUHN VALIDATOR
  // ============================================================================
  const luhnInput = document.getElementById('luhn-card-input');
  const btnLuhnValidate = document.getElementById('btn-luhn-validate');
  const luhnBadge = document.getElementById('luhn-badge');
  const luhnNetwork = document.getElementById('luhn-network');
  const luhnChecksum = document.getElementById('luhn-checksum-status');
  const luhnFormat = document.getElementById('luhn-format-status');

  window.resetLuhnValidatorState = function() {
    luhnInput.value = '';
    luhnBadge.textContent = 'Enter a card number to check validity.';
    luhnBadge.style.background = 'var(--border)';
    luhnBadge.style.color = 'var(--text-primary)';
    luhnNetwork.textContent = 'Unknown';
    luhnChecksum.textContent = 'N/A';
    luhnFormat.textContent = 'N/A';
  };

  function validateLuhn() {
    const raw = luhnInput.value.replace(/\s+/g, '');
    if (!/^\d+$/.test(raw)) {
      luhnBadge.textContent = 'Invalid format (digits only)';
      luhnBadge.style.background = 'var(--danger-glow)';
      luhnBadge.style.color = 'var(--danger)';
      luhnFormat.textContent = 'Failed (contains non-digits)';
      return;
    }
    luhnFormat.textContent = 'Pass';

    // Checksum
    let sum = 0;
    let shouldDouble = false;
    for (let i = raw.length - 1; i >= 0; i--) {
      let digit = parseInt(raw.charAt(i));
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    const isValid = (sum % 10 === 0) && raw.length >= 13;
    luhnChecksum.textContent = isValid ? 'Valid Checksum' : 'Invalid Checksum';

    // Network
    let network = 'Unknown';
    if (/^4/.test(raw)) network = 'Visa';
    else if (/^5[1-5]/.test(raw) || /^2[2-7]/.test(raw)) network = 'Mastercard';
    else if (/^3[47]/.test(raw)) network = 'American Express';
    else if (/^6011/.test(raw) || /^65/.test(raw)) network = 'Discover';
    else if (/^35/.test(raw)) network = 'JCB';
    luhnNetwork.textContent = network;

    if (isValid) {
      luhnBadge.textContent = `Valid ${network} Card!`;
      luhnBadge.style.background = 'var(--accent-glow)';
      luhnBadge.style.color = 'var(--accent)';
    } else {
      luhnBadge.textContent = 'Invalid Card Number';
      luhnBadge.style.background = 'var(--danger-glow)';
      luhnBadge.style.color = 'var(--danger)';
    }
  }

  if (btnLuhnValidate) btnLuhnValidate.addEventListener('click', validateLuhn);


  // ============================================================================
  // 2. BINARY TO TEXT TRANSLATOR
  // ============================================================================
  const binTxtInput = document.getElementById('binary-text-input');
  const binBinInput = document.getElementById('binary-bin-input');
  const btnToBin = document.getElementById('btn-binary-to-bin');
  const btnToTxt = document.getElementById('btn-binary-to-txt');
  const btnBinCopy = document.getElementById('btn-binary-copy');

  window.resetBinaryTranslatorState = function() {
    binTxtInput.value = 'Hello World';
    binBinInput.value = '';
  };

  if (btnToBin) {
    btnToBin.addEventListener('click', () => {
      const text = binTxtInput.value;
      const bin = Array.from(text).map(ch => {
        const b = ch.charCodeAt(0).toString(2);
        return '0'.repeat(8 - b.length) + b;
      }).join(' ');
      binBinInput.value = bin;
    });
  }

  if (btnToTxt) {
    btnToTxt.addEventListener('click', () => {
      const bin = binBinInput.value.trim();
      try {
        const text = bin.split(/\s+/).map(b => {
          if (!/^[01]+$/.test(b)) throw new Error('Invalid binary digit');
          return String.fromCharCode(parseInt(b, 2));
        }).join('');
        binTxtInput.value = text;
      } catch (err) {
        alert('Parsing error: Make sure input is space-separated 8-bit binary digits.');
      }
    });
  }

  if (btnBinCopy) btnBinCopy.addEventListener('click', () => copyText(binBinInput.value));


  // ============================================================================
  // 3. COLOR PALETTE GENERATOR
  // ============================================================================
  const palSeed = document.getElementById('palette-seed-color');
  const palHarmony = document.getElementById('palette-harmony');
  const btnPalGen = document.getElementById('btn-palette-generate');
  const palContainer = document.getElementById('palette-colors-container');
  const contrastLightRatio = document.getElementById('contrast-light-ratio');
  const contrastLightPass = document.getElementById('contrast-light-pass');
  const contrastDarkRatio = document.getElementById('contrast-dark-ratio');
  const contrastDarkPass = document.getElementById('contrast-dark-pass');
  const contrastLightCard = document.getElementById('contrast-light-card');
  const contrastDarkCard = document.getElementById('contrast-dark-card');

  window.resetColorPaletteGenState = function() {
    palSeed.value = '#6366f1';
    runPaletteGen();
  };

  // Convert Hex to HSL
  function hexToHsl(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [h * 360, s * 100, l * 100];
  }

  // Convert HSL to Hex
  function hslToHex(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      let p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    const toHex = x => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  // Relative Luminance
  function getLuminance(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    const a = [r, g, b].map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  function getContrastRatio(lum1, lum2) {
    const l1 = Math.max(lum1, lum2);
    const l2 = Math.min(lum1, lum2);
    return (l1 + 0.05) / (l2 + 0.05);
  }

  function runPaletteGen() {
    const hex = palSeed.value;
    const rule = palHarmony.value;
    const [h, s, l] = hexToHsl(hex);
    let colors = [];

    if (rule === 'complementary') {
      colors = [hex, hslToHex((h + 180) % 360, s, l)];
    } else if (rule === 'analogous') {
      colors = [
        hslToHex((h - 30 + 360) % 360, s, l),
        hex,
        hslToHex((h + 30) % 360, s, l)
      ];
    } else if (rule === 'triadic') {
      colors = [
        hex,
        hslToHex((h + 120) % 360, s, l),
        hslToHex((h + 240) % 360, s, l)
      ];
    } else if (rule === 'monochromatic') {
      colors = [
        hslToHex(h, s, Math.max(l - 30, 10)),
        hslToHex(h, s, Math.max(l - 15, 20)),
        hex,
        hslToHex(h, s, Math.min(l + 15, 80)),
        hslToHex(h, s, Math.min(l + 30, 90))
      ];
    } else if (rule === 'split') {
      colors = [
        hex,
        hslToHex((h + 150) % 360, s, l),
        hslToHex((h + 210) % 360, s, l)
      ];
    }

    // Render scheme
    palContainer.innerHTML = '';
    colors.forEach(c => {
      const el = document.createElement('div');
      el.style.flex = '1';
      el.style.minWidth = '70px';
      el.style.height = '120px';
      el.style.background = c;
      el.style.borderRadius = 'var(--radius-sm)';
      el.style.display = 'flex';
      el.style.flexDirection = 'column';
      el.style.justifyContent = 'end';
      el.style.padding = '0.5rem';
      el.style.cursor = 'pointer';
      el.style.border = '1px solid var(--border)';
      
      const contrastLight = getContrastRatio(getLuminance(c), 1.0);
      const textCol = contrastLight > 3.0 ? '#ffffff' : '#000000';

      el.innerHTML = `<span style="font-size: 0.8rem; font-family: monospace; font-weight: bold; color: ${textCol}; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">${c.toUpperCase()}</span>`;
      el.addEventListener('click', () => copyText(c));
      palContainer.appendChild(el);
    });

    // Contrast calculations on Seed
    const seedLum = getLuminance(hex);
    const whiteLum = 1.0;
    const blackLum = 0.0;

    const ratioWhite = getContrastRatio(seedLum, whiteLum);
    const ratioBlack = getContrastRatio(seedLum, blackLum);

    contrastLightRatio.textContent = `${ratioWhite.toFixed(2)}:1`;
    contrastDarkRatio.textContent = `${ratioBlack.toFixed(2)}:1`;

    contrastLightCard.style.background = hex;
    contrastLightCard.style.color = '#ffffff';
    contrastLightPass.textContent = ratioWhite >= 4.5 ? 'Pass (AA)' : 'Fail';

    contrastDarkCard.style.background = hex;
    contrastDarkCard.style.color = '#000000';
    contrastDarkPass.textContent = ratioBlack >= 4.5 ? 'Pass (AA)' : 'Fail';
  }

  if (btnPalGen) btnPalGen.addEventListener('click', runPaletteGen);


  // ============================================================================
  // 4. LOREM IPSUM MARKDOWN GENERATOR
  // ============================================================================
  const mdHeadings = document.getElementById('md-inc-headings');
  const mdLists = document.getElementById('md-inc-lists');
  const mdCode = document.getElementById('md-inc-code');
  const mdTables = document.getElementById('md-inc-tables');
  const mdQuotes = document.getElementById('md-inc-quotes');
  const mdLength = document.getElementById('md-len-select');
  const btnMdGen = document.getElementById('btn-md-generate');
  const mdOutput = document.getElementById('md-generated-output');
  const btnMdCopy = document.getElementById('btn-md-copy');

  window.resetLoremMarkdownState = function() {
    mdOutput.value = '';
    generateLoremMarkdown();
  };

  function generateLoremMarkdown() {
    const len = mdLength.value;
    const loopCount = len === 'short' ? 1 : (len === 'medium' ? 3 : 5);
    let md = '# Mock Documentation Suite\n\nWelcome to the generated sample lorem markdown suite.\n\n';

    for (let i = 1; i <= loopCount; i++) {
      if (mdHeadings.checked) {
        md += `## Section ${i}: Standard Framework Protocols\n\n`;
      }
      md += `This is paragraph ${i} of the mock article structure. Developers can employ this markdown file to verify styling defaults, typography alignments, code rendering pipelines, and dark/light contrast options in various rendering wrappers.\n\n`;
      
      if (mdLists.checked) {
        md += `* List Item ${i}.1: Essential configurations.\n`;
        md += `* List Item ${i}.2: Secondary parameters.\n`;
        md += `* List Item ${i}.3: Optional dependencies.\n\n`;
      }

      if (mdCode.checked) {
        md += `\`\`\`javascript\n// Developer script sample ${i}\nfunction initializeModule(config) {\n  console.log("Loading module ${i}...");\n  return config.active ? true : false;\n}\n\`\`\`\n\n`;
      }

      if (mdQuotes.checked) {
        md += `> "Simplicity is the ultimate sophistication. This blockquote represents paragraph ${i} annotations." — Frame Reference\n\n`;
      }

      if (mdTables.checked && i === 1) {
        md += `| Parameter | Type | Default | Description |\n`;
        md += `| :--- | :--- | :--- | :--- |\n`;
        md += `| \`id\` | String | \`undefined\` | Unique tracker key |\n`;
        md += `| \`active\` | Boolean | \`true\` | Activation flags state |\n\n`;
      }
    }
    mdOutput.value = md;
  }

  if (btnMdGen) btnMdGen.addEventListener('click', generateLoremMarkdown);
  if (btnMdCopy) btnMdCopy.addEventListener('click', () => copyText(mdOutput.value));


  // ============================================================================
  // 5. VISUAL FLOWCHART & DIAGRAM MAKER
  // ============================================================================
  const flowchartRules = document.getElementById('flowchart-rules');
  const flowchartDir = document.getElementById('flowchart-direction');
  const btnFlowchartRender = document.getElementById('btn-flowchart-render');
  const flowchartContainer = document.getElementById('flowchart-svg-container');
  const btnFlowchartCopy = document.getElementById('btn-flowchart-copy');

  window.resetUserFlowchartState = function() {
    flowchartRules.value = 'Start -> Request\nRequest -> Auth\nAuth -> Allow\nAuth -> Deny';
    renderFlowchart();
  };

  function renderFlowchart() {
    const rules = flowchartRules.value.trim();
    if (!rules) return;

    // Simple connection parser
    const connections = [];
    const nodeSet = new Set();

    rules.split('\n').forEach(line => {
      const parts = line.split('->').map(p => p.trim());
      if (parts.length >= 2) {
        const from = parts[0];
        for (let idx = 1; idx < parts.length; idx++) {
          const to = parts[idx];
          connections.push({ from, to });
          nodeSet.add(from);
          nodeSet.add(to);
        }
      }
    });

    const nodes = Array.from(nodeSet);
    if (nodes.length === 0) return;

    // Simple level/depth solver
    const levels = {};
    nodes.forEach(n => levels[n] = 0);

    // Run basic relaxation loops to calculate depth levels
    for (let loop = 0; loop < 5; loop++) {
      connections.forEach(conn => {
        if (levels[conn.to] <= levels[conn.from]) {
          levels[conn.to] = levels[conn.from] + 1;
        }
      });
    }

    // Group nodes by level
    const levelGroups = {};
    nodes.forEach(n => {
      const lvl = levels[n];
      if (!levelGroups[lvl]) levelGroups[lvl] = [];
      levelGroups[lvl].push(n);
    });

    const dir = flowchartDir.value;
    const nodeWidth = 90;
    const nodeHeight = 35;
    const xGap = 130;
    const yGap = 70;

    // Node coordinate mapper
    const coords = {};

    if (dir === 'TB') {
      // Top to bottom
      Object.keys(levelGroups).forEach(lvl => {
        const grp = levelGroups[lvl];
        const y = lvl * yGap + 30;
        grp.forEach((n, idx) => {
          const totalW = (grp.length - 1) * xGap;
          const x = 150 - (totalW / 2) + idx * xGap;
          coords[n] = { x, y };
        });
      });
    } else {
      // Left to right
      Object.keys(levelGroups).forEach(lvl => {
        const grp = levelGroups[lvl];
        const x = lvl * xGap + 30;
        grp.forEach((n, idx) => {
          const totalH = (grp.length - 1) * yGap;
          const y = 120 - (totalH / 2) + idx * yGap;
          coords[n] = { x, y };
        });
      });
    }

    // Calculate dimensions
    const cValues = Object.values(coords);
    const minX = Math.min(...cValues.map(c => c.x)) - 50;
    const maxX = Math.max(...cValues.map(c => c.x)) + nodeWidth + 50;
    const minY = Math.min(...cValues.map(c => c.y)) - 50;
    const maxY = Math.max(...cValues.map(c => c.y)) + nodeHeight + 50;
    const viewWidth = Math.max(maxX - minX, 400);
    const viewHeight = Math.max(maxY - minY, 300);

    // Build SVG
    let svgContent = `<svg width="${viewWidth}" height="${viewHeight}" viewBox="${minX} ${minY} ${viewWidth} ${viewHeight}" xmlns="http://www.w3.org/2000/svg" style="background: transparent;">
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--primary)" />
    </marker>
  </defs>`;

    // Render connection lines
    connections.forEach(conn => {
      const start = coords[conn.from];
      const end = coords[conn.to];
      if (start && end) {
        let x1 = start.x + nodeWidth / 2;
        let y1 = start.y + nodeHeight / 2;
        let x2 = end.x + nodeWidth / 2;
        let y2 = end.y + nodeHeight / 2;

        // Clip vectors to node borders
        if (dir === 'TB') {
          if (y2 > y1) { y1 = start.y + nodeHeight; y2 = end.y; }
        } else {
          if (x2 > x1) { x1 = start.x + nodeWidth; x2 = end.x; }
        }
        svgContent += `\n  <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--primary)" stroke-width="2" marker-end="url(#arrow)" />`;
      }
    });

    // Render Nodes
    nodes.forEach(n => {
      const c = coords[n];
      svgContent += `\n  <g>
    <rect x="${c.x}" y="${c.y}" width="${nodeWidth}" height="${nodeHeight}" rx="4" fill="var(--bg-card)" stroke="var(--border)" stroke-width="1.5" />
    <text x="${c.x + nodeWidth / 2}" y="${c.y + nodeHeight / 2 + 5}" text-anchor="middle" fill="var(--text-primary)" font-size="11" font-family="sans-serif" font-weight="bold">${n}</text>
  </g>`;
    });

    svgContent += `\n</svg>`;
    flowchartContainer.innerHTML = svgContent;
  }

  if (btnFlowchartRender) btnFlowchartRender.addEventListener('click', renderFlowchart);
  if (btnFlowchartCopy) {
    btnFlowchartCopy.addEventListener('click', () => {
      copyText(flowchartContainer.innerHTML);
    });
  }


  // ============================================================================
  // 6. BPM TAPPER & AUDIO METRONOME
  // ============================================================================
  const bpmSlider = document.getElementById('metronome-bpm-slider');
  const bpmLabel = document.getElementById('metronome-bpm-val');
  const metSound = document.getElementById('metronome-sound-select');
  const btnMetToggle = document.getElementById('btn-metronome-toggle');
  const metIndicator = document.getElementById('metronome-visual-indicator');
  const btnBpmTap = document.getElementById('btn-bpm-tap-target');
  const tapCurrentBpm = document.getElementById('tap-current-bpm');
  const btnTapReset = document.getElementById('btn-bpm-tap-reset');

  let audioCtx = null;
  let metronomeInterval = null;
  let isMetronomePlaying = false;
  let tapTimes = [];

  window.resetMetronomeTapperState = function() {
    if (isMetronomePlaying) stopMetronome();
    bpmSlider.value = 120;
    bpmLabel.textContent = '120';
    tapTimes = [];
    tapCurrentBpm.textContent = '--';
  };

  if (bpmSlider) {
    bpmSlider.addEventListener('input', () => {
      bpmLabel.textContent = bpmSlider.value;
      if (isMetronomePlaying) {
        stopMetronome();
        startMetronome();
      }
    });
  }

  function startMetronome() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const bpm = parseInt(bpmSlider.value);
    const intervalMs = 60000 / bpm;
    isMetronomePlaying = true;
    btnMetToggle.textContent = '⏹️ Stop Metronome';
    btnMetToggle.classList.add('active');

    metronomeInterval = setInterval(() => {
      playMetronomeSound();
      // Flash indicator
      metIndicator.style.background = 'var(--accent)';
      setTimeout(() => {
        metIndicator.style.background = 'var(--border)';
      }, 70);
    }, intervalMs);
  }

  function stopMetronome() {
    clearInterval(metronomeInterval);
    isMetronomePlaying = false;
    btnMetToggle.textContent = '🥁 Start Metronome';
    btnMetToggle.classList.remove('active');
  }

  function playMetronomeSound() {
    if (!audioCtx) return;
    const soundType = metSound.value;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (soundType === 'sine') {
      osc.frequency.value = 1000;
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.06);
    } else if (soundType === 'wood') {
      osc.frequency.value = 600;
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.02);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.03);
    } else { // cowbell
      osc.type = 'triangle';
      osc.frequency.value = 1400;
      gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.09);
    }
  }

  if (btnMetToggle) {
    btnMetToggle.addEventListener('click', () => {
      if (isMetronomePlaying) stopMetronome();
      else startMetronome();
    });
  }

  // BPM Tap
  function handleBpmTap(e) {
    e.preventDefault();
    const now = performance.now();
    tapTimes.push(now);
    if (tapTimes.length > 5) tapTimes.shift();

    if (tapTimes.length > 1) {
      const deltas = [];
      for (let i = 1; i < tapTimes.length; i++) {
        deltas.push(tapTimes[i] - tapTimes[i - 1]);
      }
      const avg = deltas.reduce((a, b) => a + b, 0) / deltas.length;
      const bpm = Math.round(60000 / avg);
      tapCurrentBpm.textContent = bpm;
      bpmSlider.value = Math.max(40, Math.min(240, bpm));
      bpmLabel.textContent = bpmSlider.value;
      if (isMetronomePlaying) {
        stopMetronome();
        startMetronome();
      }
    } else {
      tapCurrentBpm.textContent = 'Tapping...';
    }

    // Tap scale visual animation
    btnBpmTap.style.transform = 'scale(0.95)';
    setTimeout(() => {
      btnBpmTap.style.transform = 'scale(1)';
    }, 50);
  }

  if (btnBpmTap) {
    btnBpmTap.addEventListener('mousedown', handleBpmTap);
    btnBpmTap.addEventListener('touchstart', handleBpmTap);
  }

  if (btnTapReset) {
    btnTapReset.addEventListener('click', () => {
      tapTimes = [];
      tapCurrentBpm.textContent = '--';
    });
  }


  // ============================================================================
  // 7. CAESAR & ROT13 CIPHER
  // ============================================================================
  const caesarSlider = document.getElementById('caesar-shift-slider');
  const caesarLabel = document.getElementById('caesar-shift-val');
  const caesarMode = document.getElementById('caesar-mode');
  const btnCaesarRot13 = document.getElementById('btn-caesar-rot13-quick');
  const caesarInput = document.getElementById('caesar-input-txt');
  const caesarOutput = document.getElementById('caesar-output-txt');
  const btnCaesarCopy = document.getElementById('btn-caesar-copy');

  window.resetCaesarCipherState = function() {
    caesarInput.value = 'Secret message';
    caesarSlider.value = 3;
    caesarLabel.textContent = '3';
    runCaesarCipher();
  };

  function runCaesarCipher() {
    const text = caesarInput.value;
    let shift = parseInt(caesarSlider.value);
    if (caesarMode.value === 'decode') {
      shift = (26 - shift) % 26;
    }

    let out = '';
    for (let i = 0; i < text.length; i++) {
      const c = text.charCodeAt(i);
      if (c >= 65 && c <= 90) {
        out += String.fromCharCode(((c - 65 + shift) % 26) + 65);
      } else if (c >= 97 && c <= 122) {
        out += String.fromCharCode(((c - 97 + shift) % 26) + 97);
      } else {
        out += text.charAt(i);
      }
    }
    caesarOutput.value = out;
  }

  if (caesarSlider) {
    caesarSlider.addEventListener('input', () => {
      caesarLabel.textContent = caesarSlider.value;
      runCaesarCipher();
    });
  }

  if (caesarMode) caesarMode.addEventListener('change', runCaesarCipher);
  if (caesarInput) caesarInput.addEventListener('input', runCaesarCipher);
  if (btnCaesarRot13) {
    btnCaesarRot13.addEventListener('click', () => {
      caesarSlider.value = 13;
      caesarLabel.textContent = '13';
      runCaesarCipher();
    });
  }
  if (btnCaesarCopy) btnCaesarCopy.addEventListener('click', () => copyText(caesarOutput.value));


  // ============================================================================
  // 8. GLOBAL TIME ZONE CONVERTER
  // ============================================================================
  const tzSelect = document.getElementById('tz-select-input');
  const btnTzAdd = document.getElementById('btn-tz-add');
  const tzSlider = document.getElementById('tz-hour-slider');
  const tzSliderLabel = document.getElementById('tz-slider-hour-label');
  const tzContainer = document.getElementById('tz-cards-container');
  const btnTzReset = document.getElementById('btn-tz-reset');

  let activeZones = ['UTC', 'America/New_York', 'Asia/Tokyo'];

  window.resetTimezoneConverterState = function() {
    tzSlider.value = 720;
    tzSliderLabel.textContent = '12:00';
    renderTzCards();
  };

  function renderTzCards() {
    tzContainer.innerHTML = '';
    const minutes = parseInt(tzSlider.value);
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    tzSliderLabel.textContent = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

    const baseDate = new Date();
    baseDate.setUTCHours(h, m, 0, 0);

    activeZones.forEach(zone => {
      const card = document.createElement('div');
      card.style.display = 'flex';
      card.style.justifyContent = 'space-between';
      card.style.alignItems = 'center';
      card.style.border = '1px solid var(--border)';
      card.style.borderRadius = 'var(--radius-sm)';
      card.style.padding = '0.75rem 1rem';
      card.style.background = 'var(--bg-preview)';

      let formattedTime = '';
      try {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: zone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        formattedTime = formatter.format(baseDate);
      } catch (err) {
        formattedTime = '--:--';
      }

      card.innerHTML = `
        <div>
          <strong style="display: block; font-size: 0.95rem;">${zone.split('/').pop().replace('_', ' ')}</strong>
          <span style="font-size: 0.75rem; color: var(--text-secondary);">${zone}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span style="font-family: monospace; font-size: 1.25rem; font-weight: bold;">${formattedTime}</span>
          <button class="btn-remove-tz" data-zone="${zone}" style="background: none; border: none; color: var(--danger); cursor: pointer; font-size: 1.1rem; padding: 0.25rem;">✕</button>
        </div>
      `;

      card.querySelector('.btn-remove-tz').addEventListener('click', () => {
        activeZones = activeZones.filter(z => z !== zone);
        renderTzCards();
      });

      tzContainer.appendChild(card);
    });
  }

  if (btnTzAdd) {
    btnTzAdd.addEventListener('click', () => {
      const zone = tzSelect.value;
      if (!activeZones.includes(zone)) {
        activeZones.push(zone);
        renderTzCards();
      }
    });
  }

  if (tzSlider) tzSlider.addEventListener('input', renderTzCards);
  if (btnTzReset) {
    btnTzReset.addEventListener('click', () => {
      const now = new Date();
      tzSlider.value = now.getUTCHours() * 60 + now.getUTCMinutes();
      renderTzCards();
    });
  }


  // ============================================================================
  // 9. DATE DIFFERENCE & ADDITION CALCULATOR
  // ============================================================================
  const dateMode = document.getElementById('date-calc-mode');
  const dateDiffInputs = document.getElementById('date-calc-diff-inputs');
  const dateAddInputs = document.getElementById('date-calc-add-inputs');
  const dateStart = document.getElementById('date-calc-start');
  const dateEnd = document.getElementById('date-calc-end');
  const dateBase = document.getElementById('date-calc-base');
  const dateOffset = document.getElementById('date-calc-offset-val');
  const dateOp = document.getElementById('date-calc-op');
  const btnDateCalc = document.getElementById('btn-date-calculate');
  const dateResult = document.getElementById('date-calc-result-badge');
  const dateSteps = document.getElementById('date-calc-steps');

  window.resetDateCalculatorState = function() {
    const today = new Date().toISOString().slice(0, 10);
    dateStart.value = today;
    dateEnd.value = today;
    dateBase.value = today;
    dateOffset.value = 30;
    dateResult.textContent = 'Calculate to reveal results.';
    dateSteps.textContent = 'No calculation performed.';
  };

  if (dateMode) {
    dateMode.addEventListener('change', () => {
      if (dateMode.value === 'diff') {
        dateDiffInputs.style.display = 'block';
        dateAddInputs.style.display = 'none';
      } else {
        dateDiffInputs.style.display = 'none';
        dateAddInputs.style.display = 'block';
      }
    });
  }

  if (btnDateCalc) {
    btnDateCalc.addEventListener('click', () => {
      if (dateMode.value === 'diff') {
        const d1 = new Date(dateStart.value);
        const d2 = new Date(dateEnd.value);
        if (isNaN(d1) || isNaN(d2)) {
          dateResult.textContent = 'Invalid Date';
          return;
        }
        const diffTime = Math.abs(d2 - d1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        dateResult.textContent = `${diffDays} Days`;
        dateSteps.innerHTML = `Start: ${dateStart.value}<br/>End: ${dateEnd.value}<br/>Formula: (${d2.getTime()} - ${d1.getTime()}) / 86,400,000`;
      } else {
        const base = new Date(dateBase.value);
        const offset = parseInt(dateOffset.value);
        if (isNaN(base) || isNaN(offset)) {
          dateResult.textContent = 'Invalid values';
          return;
        }
        const op = dateOp.value;
        const target = new Date(base.getTime() + (op === 'add' ? 1 : -1) * offset * 24 * 60 * 60 * 1000);
        dateResult.textContent = target.toISOString().slice(0, 10);
        dateSteps.innerHTML = `Base: ${dateBase.value}<br/>Offset: ${op === 'add' ? '+' : '-'}${offset} days`;
      }
    });
  }


  // ============================================================================
  // 10. COMPOUND INTEREST CALCULATOR
  // ============================================================================
  const compPrincipal = document.getElementById('compound-principal');
  const compRate = document.getElementById('compound-rate');
  const compYears = document.getElementById('compound-years');
  const compAddition = document.getElementById('compound-addition');
  const compFreq = document.getElementById('compound-frequency');
  const btnCompCalc = document.getElementById('btn-compound-calculate');
  const compTotalBadge = document.getElementById('compound-total-badge');
  const compCanvas = document.getElementById('compound-chart-canvas');

  window.resetCompoundInterestState = function() {
    compPrincipal.value = 10000;
    compRate.value = 7;
    compYears.value = 10;
    compAddition.value = 200;
    runCompoundCalc();
  };

  function runCompoundCalc() {
    const P = parseFloat(compPrincipal.value) || 0;
    const r = (parseFloat(compRate.value) || 0) / 100;
    const t = parseFloat(compYears.value) || 0;
    const PMT = parseFloat(compAddition.value) || 0;
    const n = parseInt(compFreq.value) || 12;

    if (t <= 0) return;

    const history = [];
    let balance = P;
    let totalContributions = P;

    for (let yr = 1; yr <= t; yr++) {
      for (let m = 0; m < 12; m++) {
        const ratePerMonth = r / 12;
        balance = balance * (1 + ratePerMonth) + PMT;
        totalContributions += PMT;
      }
      history.push({ year: yr, balance, totalContributions });
    }

    compTotalBadge.textContent = `Total: $${balance.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;

    const ctx = compCanvas.getContext('2d');
    ctx.clearRect(0, 0, compCanvas.width, compCanvas.height);

    const margin = 35;
    const chartW = compCanvas.width - margin * 2;
    const chartH = compCanvas.height - margin * 2;

    const maxVal = balance * 1.05;
    const barW = Math.max(4, chartW / t - 6);

    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = margin + chartH * (1 - i / 4);
      ctx.beginPath();
      ctx.moveTo(margin, y);
      ctx.lineTo(compCanvas.width - margin, y);
      ctx.stroke();
    }

    history.forEach((data, i) => {
      const x = margin + i * (chartW / t) + 3;
      const hTotal = (data.balance / maxVal) * chartH;
      const hContrib = (data.totalContributions / maxVal) * chartH;

      ctx.fillStyle = '#6366f1';
      ctx.fillRect(x, compCanvas.height - margin - hContrib, barW, hContrib);

      ctx.fillStyle = '#ec4899';
      ctx.fillRect(x, compCanvas.height - margin - hTotal, barW, hTotal - hContrib);
    });

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '10px monospace';
    ctx.fillText('Yr 1', margin, compCanvas.height - margin + 15);
    ctx.fillText(`Yr ${Math.round(t)}`, compCanvas.width - margin - 30, compCanvas.height - margin + 15);
  }

  if (btnCompCalc) btnCompCalc.addEventListener('click', runCompoundCalc);


  // ============================================================================
  // 11. BMI & TDEE HEALTH CALCULATOR
  // ============================================================================
  const tdeeGender = document.getElementById('tdee-gender');
  const tdeeAge = document.getElementById('tdee-age');
  const tdeeWeight = document.getElementById('tdee-weight');
  const tdeeHeight = document.getElementById('tdee-height');
  const tdeeActivity = document.getElementById('tdee-activity');
  const tdeeGoal = document.getElementById('tdee-goal');
  const btnTdeeCalc = document.getElementById('btn-tdee-calculate');
  const tdeeBmiVal = document.getElementById('tdee-bmi-val');
  const tdeeCaloriesVal = document.getElementById('tdee-calories-val');
  const tdeeMacroProt = document.getElementById('tdee-macro-prot');
  const tdeeMacroCarb = document.getElementById('tdee-macro-carb');
  const tdeeMacroFat = document.getElementById('tdee-macro-fat');

  window.resetTdeeCalculatorState = function() {
    tdeeGender.value = 'male';
    tdeeAge.value = 25;
    tdeeWeight.value = 70;
    tdeeHeight.value = 175;
    tdeeActivity.value = '1.2';
    tdeeGoal.value = '0';
    runTdeeCalc();
  };

  function runTdeeCalc() {
    const w = parseFloat(tdeeWeight.value);
    const h = parseFloat(tdeeHeight.value);
    const a = parseInt(tdeeAge.value);
    const act = parseFloat(tdeeActivity.value);
    const goal = parseInt(tdeeGoal.value);

    if (isNaN(w) || isNaN(h) || isNaN(a)) return;

    const bmi = w / Math.pow(h / 100, 2);
    let bmiCat = 'Normal';
    if (bmi < 18.5) bmiCat = 'Underweight';
    else if (bmi >= 25 && bmi < 30) bmiCat = 'Overweight';
    else if (bmi >= 30) bmiCat = 'Obese';
    tdeeBmiVal.textContent = `${bmi.toFixed(1)} (${bmiCat})`;

    let bmr = 10 * w + 6.25 * h - 5 * a;
    bmr += (tdeeGender.value === 'male' ? 5 : -161);

    const tdee = Math.round(bmr * act) + goal;
    tdeeCaloriesVal.textContent = `${tdee.toLocaleString()} kcal`;

    const protCals = tdee * 0.3;
    const carbCals = tdee * 0.4;
    const fatCals = tdee * 0.3;

    tdeeMacroProt.textContent = `${Math.round(protCals / 4)} g`;
    tdeeMacroCarb.textContent = `${Math.round(carbCals / 4)} g`;
    tdeeMacroFat.textContent = `${Math.round(fatCals / 9)} g`;
  }

  if (btnTdeeCalc) btnTdeeCalc.addEventListener('click', runTdeeCalc);


  // ============================================================================
  // 12. LIST SORTER & DEDUPLICATOR
  // ============================================================================
  const listSelect = document.getElementById('sort-list-select');
  const listDedup = document.getElementById('sort-list-dedup');
  const listTrim = document.getElementById('sort-list-trim');
  const listSkipEmpty = document.getElementById('sort-list-skip-empty');
  const btnListSort = document.getElementById('btn-sort-list-run');
  const listInput = document.getElementById('sort-list-input');
  const listOutput = document.getElementById('sort-list-output');
  const btnListCopy = document.getElementById('btn-sort-list-copy');

  window.resetSortListState = function() {
    listInput.value = 'Banana\nApple\nBanana (Duplicate)\nOrange\nApple';
    runListSorter();
  };

  function runListSorter() {
    let lines = listInput.value.split('\n');

    if (listTrim.checked) lines = lines.map(l => l.trim());
    if (listSkipEmpty.checked) lines = lines.filter(l => l.length > 0);
    if (listDedup.checked) lines = Array.from(new Set(lines));

    const rule = listSelect.value;
    lines.sort((a, b) => {
      if (rule === 'asc') return a.localeCompare(b);
      if (rule === 'desc') return b.localeCompare(a);
      if (rule === 'num-asc') return (parseFloat(a) || 0) - (parseFloat(b) || 0);
      if (rule === 'num-desc') return (parseFloat(b) || 0) - (parseFloat(a) || 0);
      if (rule === 'len-asc') return a.length - b.length;
      if (rule === 'len-desc') return b.length - a.length;
      return 0;
    });

    if (rule === 'shuffle') {
      for (let i = lines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lines[i], lines[j]] = [lines[j], lines[i]];
      }
    }

    listOutput.value = lines.join('\n');
  }

  if (btnListSort) btnListSort.addEventListener('click', runListSorter);
  if (btnListCopy) btnListCopy.addEventListener('click', () => copyText(listOutput.value));


  // ============================================================================
  // 13. JSON, YAML & CSV CONVERTER
  // ============================================================================
  const jsonYamlDirection = document.getElementById('json-yaml-direction');
  const btnJsonYamlConvert = document.getElementById('btn-json-yaml-convert');
  const jsonYamlInput = document.getElementById('json-yaml-input');
  const jsonYamlOutput = document.getElementById('json-yaml-output');
  const btnJsonYamlCopy = document.getElementById('btn-json-yaml-copy');

  window.resetJsonYamlConverterState = function() {
    jsonYamlInput.value = '{\n  "name": "ZeroG",\n  "type": "Toolbox",\n  "items": ["Crypto", "Developer"]\n}';
    runJsonYamlConvert();
  };

  function simpleJsonToYaml(obj, indent = 0) {
    const spacing = ' '.repeat(indent);
    if (obj === null) return 'null';
    if (typeof obj === 'string') return `"${obj.replace(/"/g, '\\"')}"`;
    if (typeof obj !== 'object') return String(obj);
    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';
      return '\n' + obj.map(item => `${spacing}- ${simpleJsonToYaml(item, indent + 2).trim()}`).join('\n');
    }
    return Object.entries(obj).map(([key, val]) => {
      const formattedVal = typeof val === 'object' && val !== null ? simpleJsonToYaml(val, indent + 2) : ' ' + simpleJsonToYaml(val, 0);
      return `${spacing}${key}:${formattedVal}`;
    }).join('\n');
  }

  function simpleYamlToJson(yaml) {
    const lines = yaml.split('\n');
    const result = {};
    lines.forEach(l => {
      const match = l.match(/^(\s*)([^:]+):\s*(.*)$/);
      if (match) {
        const val = match[3].trim();
        const key = match[2].trim();
        if (val.startsWith('"') && val.endsWith('"')) {
          result[key] = val.slice(1, -1);
        } else if (/^\d+$/.test(val)) {
          result[key] = parseInt(val);
        } else if (val === 'true' || val === 'false') {
          result[key] = val === 'true';
        } else {
          result[key] = val;
        }
      }
    });
    return JSON.stringify(result, null, 2);
  }

  function runJsonYamlConvert() {
    const mode = jsonYamlDirection.value;
    const inp = jsonYamlInput.value.trim();
    if (!inp) return;

    try {
      if (mode === 'json2yaml') {
        const obj = JSON.parse(inp);
        jsonYamlOutput.value = simpleJsonToYaml(obj);
      } else if (mode === 'yaml2json') {
        jsonYamlOutput.value = simpleYamlToJson(inp);
      } else if (mode === 'json2csv') {
        const arr = JSON.parse(inp);
        if (!Array.isArray(arr)) {
          jsonYamlOutput.value = 'Error: CSV conversion requires a JSON array of objects';
          return;
        }
        const headers = Object.keys(arr[0] || {});
        const csvLines = [headers.join(',')];
        arr.forEach(row => {
          csvLines.push(headers.map(h => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(','));
        });
        jsonYamlOutput.value = csvLines.join('\n');
      } else if (mode === 'csv2json') {
        const lines = inp.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        const result = [];
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i]) continue;
          const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
          const obj = {};
          headers.forEach((h, idx) => {
            obj[h] = cols[idx];
          });
          result.push(obj);
        }
        jsonYamlOutput.value = JSON.stringify(result, null, 2);
      }
    } catch (err) {
      jsonYamlOutput.value = `Conversion Error: ${err.message}`;
    }
  }

  if (btnJsonYamlConvert) btnJsonYamlConvert.addEventListener('click', runJsonYamlConvert);
  if (btnJsonYamlCopy) btnJsonYamlCopy.addEventListener('click', () => copyText(jsonYamlOutput.value));


  // ============================================================================
  // 14. WEBAPI & DEVICE TESTER
  // ============================================================================
  const btnDeviceInfoRun = document.getElementById('btn-device-info-run');
  const devCores = document.getElementById('dev-cpu-cores');
  const devRam = document.getElementById('dev-ram');
  const devScreen = document.getElementById('dev-screen');
  const devDpr = document.getElementById('dev-dpr');
  const devBattery = document.getElementById('dev-battery');
  const devNetwork = document.getElementById('dev-network');
  const devChecklist = document.getElementById('dev-webapi-checklist');

  window.resetDeviceInfoState = function() {
    runDeviceDiagnostics();
  };

  function runDeviceDiagnostics() {
    devCores.textContent = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Cores` : 'Unsupported';
    devRam.textContent = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'Unsupported';
    devScreen.textContent = `${window.screen.width} x ${window.screen.height}`;
    devDpr.textContent = `${window.devicePixelRatio}`;
    devNetwork.textContent = navigator.onLine ? 'Online' : 'Offline';

    if (navigator.getBattery) {
      navigator.getBattery().then(bat => {
        devBattery.textContent = `${Math.round(bat.level * 100)}% (${bat.charging ? 'Charging' : 'Discharging'})`;
      });
    } else {
      devBattery.textContent = 'Unsupported';
    }

    const APIS = [
      { name: 'Web Bluetooth', key: 'bluetooth' in navigator },
      { name: 'Web USB', key: 'usb' in navigator },
      { name: 'Speech Synthesis', key: 'speechSynthesis' in window },
      { name: 'Web Share API', key: 'share' in navigator },
      { name: 'Gamepad API', key: 'getGamepads' in navigator },
      { name: 'Geolocation', key: 'geolocation' in navigator }
    ];

    devChecklist.innerHTML = '';
    APIS.forEach(api => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.justifyContent = 'space-between';
      row.style.borderBottom = '1px solid var(--border)';
      row.style.paddingBottom = '0.2rem';
      row.innerHTML = `
        <span>${api.name}</span>
        <span style="color: ${api.key ? 'var(--accent)' : 'var(--danger)'}; font-weight: bold;">
          ${api.key ? '✓ Supported' : '✕ Unsupported'}
        </span>
      `;
      devChecklist.appendChild(row);
    });
  }

  if (btnDeviceInfoRun) btnDeviceInfoRun.addEventListener('click', runDeviceDiagnostics);


  // ============================================================================
  // 15. PRECISION STOPWATCH & LAP LOG
  // ============================================================================
  const swReadout = document.getElementById('stopwatch-readout');
  const btnSwStart = document.getElementById('btn-stopwatch-start');
  const btnSwLap = document.getElementById('btn-stopwatch-lap');
  const btnSwReset = document.getElementById('btn-stopwatch-reset');
  const btnSwExport = document.getElementById('btn-stopwatch-export');
  const swTable = document.getElementById('stopwatch-laps-table') ? document.getElementById('stopwatch-laps-table').querySelector('tbody') : null;

  let swStartTime = 0;
  let swElapsed = 0;
  let swIntervalId = null;
  let swIsRunning = false;
  let swLaps = [];

  window.resetStopwatchLapState = function() {
    if (swIsRunning) stopStopwatch();
    swElapsed = 0;
    swLaps = [];
    if (swReadout) swReadout.textContent = '00:00.000';
    if (swTable) swTable.innerHTML = '';
  };

  function updateStopwatch() {
    const totalMs = swElapsed + (performance.now() - swStartTime);
    const ms = Math.floor(totalMs % 1000);
    const secs = Math.floor((totalMs / 1000) % 60);
    const mins = Math.floor(totalMs / 60000);

    if (swReadout) swReadout.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  }

  function startStopwatch() {
    swStartTime = performance.now();
    swIsRunning = true;
    if (btnSwStart) {
      btnSwStart.textContent = '⏹️ Stop';
      btnSwStart.style.background = 'var(--danger)';
    }
    swIntervalId = setInterval(updateStopwatch, 10);
  }

  function stopStopwatch() {
    swElapsed += performance.now() - swStartTime;
    swIsRunning = false;
    if (btnSwStart) {
      btnSwStart.textContent = '⏱️ Start';
      btnSwStart.style.background = 'var(--primary)';
    }
    clearInterval(swIntervalId);
  }

  if (btnSwStart) {
    btnSwStart.addEventListener('click', () => {
      if (swIsRunning) stopStopwatch();
      else startStopwatch();
    });
  }

  if (btnSwLap) {
    btnSwLap.addEventListener('click', () => {
      if (!swIsRunning && swElapsed === 0) return;
      const currentVal = swReadout.textContent;
      swLaps.push(currentVal);

      if (swTable) {
        const row = document.createElement('tr');
        row.style.borderBottom = '1px solid var(--border)';
        row.innerHTML = `
          <td style="padding: 0.5rem;">Lap ${swLaps.length}</td>
          <td style="padding: 0.5rem;">${currentVal}</td>
          <td style="padding: 0.5rem;">${currentVal}</td>
        `;
        swTable.appendChild(row);
      }
    });
  }

  if (btnSwReset) {
    btnSwReset.addEventListener('click', () => {
      window.resetStopwatchLapState();
    });
  }

  if (btnSwExport) {
    btnSwExport.addEventListener('click', () => {
      if (swLaps.length === 0) {
        alert('No laps to export');
        return;
      }
      const csv = 'Lap Number,Time\n' + swLaps.map((t, idx) => `Lap ${idx+1},${t}`).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'stopwatch-laps.csv';
      a.click();
    });
  }


  // ============================================================================
  // 16. VISUAL HTML WYSIWYG EDITOR
  // ============================================================================
  const wysCanvas = document.getElementById('wysiwyg-canvas');
  const wysOutput = document.getElementById('wysiwyg-output');
  const btnWysBold = document.getElementById('btn-wysiwyg-bold');
  const btnWysItalic = document.getElementById('btn-wysiwyg-italic');
  const btnWysUl = document.getElementById('btn-wysiwyg-ul');
  const btnWysLink = document.getElementById('btn-wysiwyg-link');
  const btnWysH1 = document.getElementById('btn-wysiwyg-h1');
  const btnWysExtract = document.getElementById('btn-wysiwyg-extract');
  const btnWysCopy = document.getElementById('btn-wysiwyg-copy');

  window.resetHtmlWysiwygState = function() {
    if (wysCanvas) wysCanvas.innerHTML = 'Start composing rich content here...';
    if (wysOutput) wysOutput.value = '';
  };

  function execFormat(cmd, arg = null) {
    document.execCommand(cmd, false, arg);
    if (wysCanvas) wysCanvas.focus();
  }

  if (btnWysBold) btnWysBold.addEventListener('click', () => execFormat('bold'));
  if (btnWysItalic) btnWysItalic.addEventListener('click', () => execFormat('italic'));
  if (btnWysUl) btnWysUl.addEventListener('click', () => execFormat('insertUnorderedList'));
  if (btnWysLink) {
    btnWysLink.addEventListener('click', () => {
      const url = prompt('Enter link URL:');
      if (url) execFormat('createLink', url);
    });
  }
  if (btnWysH1) btnWysH1.addEventListener('click', () => execFormat('formatBlock', '<h1>'));

  if (btnWysExtract) {
    btnWysExtract.addEventListener('click', () => {
      if (wysCanvas && wysOutput) wysOutput.value = wysCanvas.innerHTML.trim();
    });
  }

  if (btnWysCopy) btnWysCopy.addEventListener('click', () => copyText(wysOutput.value));


  // ============================================================================
  // 17. CSS GRADIENT BUILDER
  // ============================================================================
  const gradAngle = document.getElementById('grad-angle-slider');
  const gradLabel = document.getElementById('grad-angle-label');
  const gradCol1 = document.getElementById('grad-color-1');
  const gradCol2 = document.getElementById('grad-color-2');
  const btnGradInvert = document.getElementById('btn-grad-invert');
  const gradPreview = document.getElementById('grad-preview-box');
  const gradCssOutput = document.getElementById('grad-css-output');
  const btnGradCopy = document.getElementById('btn-grad-copy');

  window.resetCssGradientMeshState = function() {
    if (gradAngle) gradAngle.value = 90;
    if (gradLabel) gradLabel.textContent = '90';
    if (gradCol1) gradCol1.value = '#6366f1';
    if (gradCol2) gradCol2.value = '#ec4899';
    updateGradient();
  };

  function updateGradient() {
    if (!gradAngle || !gradCol1 || !gradCol2) return;
    const angle = gradAngle.value;
    if (gradLabel) gradLabel.textContent = angle;
    const c1 = gradCol1.value;
    const c2 = gradCol2.value;

    const rule = `linear-gradient(${angle}deg, ${c1} 0%, ${c2} 100%)`;
    if (gradPreview) gradPreview.style.background = rule;
    if (gradCssOutput) gradCssOutput.value = `background: ${rule};`;
  }

  if (gradAngle) gradAngle.addEventListener('input', updateGradient);
  if (gradCol1) gradCol1.addEventListener('input', updateGradient);
  if (gradCol2) gradCol2.addEventListener('input', updateGradient);
  if (btnGradInvert) {
    btnGradInvert.addEventListener('click', () => {
      const temp = gradCol1.value;
      gradCol1.value = gradCol2.value;
      gradCol2.value = temp;
      updateGradient();
    });
  }

  if (btnGradCopy) btnGradCopy.addEventListener('click', () => copyText(gradCssOutput.value));


  // ============================================================================
  // 18. SVG PATH VISUALIZER & GRID EDITOR
  // ============================================================================
  const svgPathD = document.getElementById('svg-path-d-input');
  const svgPathStroke = document.getElementById('svg-path-stroke');
  const svgPathFill = document.getElementById('svg-path-fill');
  const btnSvgPathRender = document.getElementById('btn-svg-path-render');
  const svgPathContainer = document.getElementById('svg-path-render-container');
  const btnSvgPathCopy = document.getElementById('btn-svg-path-copy');

  window.resetSvgPathViewerState = function() {
    if (svgPathD) svgPathD.value = 'M10 80 Q 95 10 180 80';
    if (svgPathStroke) svgPathStroke.value = '#6366f1';
    if (svgPathFill) svgPathFill.value = '#000000';
    renderSvgPath();
  };

  function renderSvgPath() {
    if (!svgPathD || !svgPathStroke || !svgPathFill || !svgPathContainer) return;
    const d = svgPathD.value.trim();
    const str = svgPathStroke.value;
    const f = svgPathFill.value;

    const svg = `
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="border: 1px dashed rgba(255,255,255,0.15);">
  <line x1="0" y1="50" x2="200" y2="50" stroke="rgba(255,255,255,0.05)" stroke-dasharray="2" />
  <line x1="0" y1="100" x2="200" y2="100" stroke="rgba(255,255,255,0.05)" stroke-dasharray="2" />
  <line x1="0" y1="150" x2="200" y2="150" stroke="rgba(255,255,255,0.05)" stroke-dasharray="2" />
  <line x1="50" y1="0" x2="50" y2="200" stroke="rgba(255,255,255,0.05)" stroke-dasharray="2" />
  <line x1="100" y1="0" x2="100" y2="200" stroke="rgba(255,255,255,0.05)" stroke-dasharray="2" />
  <line x1="150" y1="0" x2="150" y2="200" stroke="rgba(255,255,255,0.05)" stroke-dasharray="2" />
  <path d="${d}" stroke="${str}" fill="${f}" stroke-width="3" stroke-linecap="round" />
</svg>
    `;
    svgPathContainer.innerHTML = svg;
  }

  if (btnSvgPathRender) btnSvgPathRender.addEventListener('click', renderSvgPath);
  if (btnSvgPathCopy) btnSvgPathCopy.addEventListener('click', () => copyText(svgPathContainer.innerHTML));


  // ============================================================================
  // 19. MICROPHONE GUITAR TUNER
  // ============================================================================
  const btnTunerMic = document.getElementById('btn-tuner-mic-toggle');
  const tunerNote = document.getElementById('tuner-note-box');
  const tunerFreq = document.getElementById('tuner-freq-box');
  const tunerCanvas = document.getElementById('tuner-needle-canvas');

  let tunerAudioCtx = null;
  let tunerAnalyser = null;
  let tunerStream = null;
  let isTuning = false;
  let tunerAnimationId = null;

  window.resetGuitarTunerState = function() {
    if (isTuning) stopTuner();
    if (tunerNote) tunerNote.textContent = '--';
    if (tunerFreq) tunerFreq.textContent = '-- Hz';
    drawTunerNeedle(0);
  };

  const TUNINGS = [
    { note: 'E2', freq: 82.41 },
    { note: 'A2', freq: 110.00 },
    { note: 'D3', freq: 146.83 },
    { note: 'G3', freq: 195.99 },
    { note: 'B3', freq: 246.94 },
    { note: 'E4', freq: 329.63 }
  ];

  function startTuner() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      tunerStream = stream;
      tunerAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = tunerAudioCtx.createMediaStreamSource(stream);
      tunerAnalyser = tunerAudioCtx.createAnalyser();
      tunerAnalyser.fftSize = 2048;
      source.connect(tunerAnalyser);

      isTuning = true;
      if (btnTunerMic) {
        btnTunerMic.textContent = '⏹️ Disable Microphone';
        btnTunerMic.classList.add('active');
      }
      tunerUpdateLoop();
    }).catch(err => {
      alert('Microphone access denied: Tuner requires mic access to calculate frequencies.');
    });
  }

  function stopTuner() {
    isTuning = false;
    if (btnTunerMic) {
      btnTunerMic.textContent = '🎙️ Enable Microphone';
      btnTunerMic.classList.remove('active');
    }
    cancelAnimationFrame(tunerAnimationId);
    if (tunerStream) {
      tunerStream.getTracks().forEach(t => t.stop());
    }
  }

  function tunerUpdateLoop() {
    if (!isTuning) return;
    const buffer = new Float32Array(tunerAnalyser.fftSize);
    tunerAnalyser.getFloatTimeDomainData(buffer);

    const freq = autoCorrelate(buffer, tunerAudioCtx.sampleRate);
    if (freq !== -1 && freq > 50 && freq < 1000) {
      if (tunerFreq) tunerFreq.textContent = `${freq.toFixed(1)} Hz`;

      let closest = TUNINGS[0];
      let minDiff = Math.abs(freq - TUNINGS[0].freq);
      TUNINGS.forEach(t => {
        const diff = Math.abs(freq - t.freq);
        if (diff < minDiff) {
          minDiff = diff;
          closest = t;
        }
      });

      if (tunerNote) tunerNote.textContent = closest.note;
      const cents = 1200 * Math.log2(freq / closest.freq);
      drawTunerNeedle(cents);
    }

    tunerAnimationId = requestAnimationFrame(tunerUpdateLoop);
  }

  function drawTunerNeedle(cents) {
    if (!tunerCanvas) return;
    const ctx = tunerCanvas.getContext('2d');
    ctx.clearRect(0, 0, tunerCanvas.width, tunerCanvas.height);

    const cX = tunerCanvas.width / 2;
    const cY = tunerCanvas.height - 10;
    const radius = 80;

    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cX, cY, radius, Math.PI, 2 * Math.PI);
    ctx.stroke();

    const clampedCents = Math.max(-50, Math.min(50, cents));
    const angle = Math.PI * 1.5 + (clampedCents / 50) * (Math.PI / 4);

    ctx.strokeStyle = Math.abs(cents) < 4 ? 'var(--accent)' : 'var(--primary)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cX, cY);
    ctx.lineTo(cX + radius * Math.cos(angle), cY + radius * Math.sin(angle));
    ctx.stroke();

    ctx.fillStyle = 'var(--text-primary)';
    ctx.beginPath();
    ctx.arc(cX, cY, 6, 0, 2 * Math.PI);
    ctx.fill();
  }

  function autoCorrelate(buffer, sampleRate) {
    let SIZE = buffer.length;
    let r1 = 0, r2 = SIZE - 1;

    for (let i = 0; i < SIZE / 2; i++) {
      if (Math.abs(buffer[i]) < 0.01) r1 = i;
      else break;
    }

    const trimmed = buffer.subarray(r1, r2);
    SIZE = trimmed.length;

    let sumOfSquares = 0;
    for (let i = 0; i < SIZE; i++) sumOfSquares += trimmed[i] * trimmed[i];
    if (Math.sqrt(sumOfSquares / SIZE) < 0.01) return -1;

    let r = new Float32Array(SIZE);
    for (let lag = 0; lag < SIZE; lag++) {
      let sum = 0;
      for (let i = 0; i < SIZE - lag; i++) {
        sum += trimmed[i] * trimmed[i + lag];
      }
      r[lag] = sum;
    }

    let period = -1;
    for (let i = 1; i < SIZE - 1; i++) {
      if (r[i] > r[i - 1] && r[i] > r[i + 1]) {
        if (period === -1 || r[i] > r[period]) {
          period = i;
        }
      }
    }

    if (period !== -1) {
      return sampleRate / period;
    }
    return -1;
  }

  if (btnTunerMic) {
    btnTunerMic.addEventListener('click', () => {
      if (isTuning) stopTuner();
      else startTuner();
    });
  }


  // ============================================================================
  // 20. FOCUS SPEED READER
  // ============================================================================
  const readerWpm = document.getElementById('speed-reader-wpm');
  const btnReaderStart = document.getElementById('btn-speed-reader-start');
  const btnReaderPause = document.getElementById('btn-speed-reader-pause');
  const btnReaderReset = document.getElementById('btn-speed-reader-reset');
  const readerTarget = document.getElementById('speed-reader-target');
  const readerInput = document.getElementById('speed-reader-input');

  let readerWords = [];
  let readerIdx = 0;
  let readerIntervalId = null;
  let readerIsPlaying = false;

  window.resetSpeedReaderState = function() {
    if (readerIsPlaying) pauseReader();
    readerIdx = 0;
    if (readerTarget) readerTarget.textContent = 'Ready to read';
    if (readerInput) readerInput.value = 'Focused reading trains your cognitive baseline by aligning visual elements word-by-word.';
  };

  function startReader() {
    if (!readerInput) return;
    const text = readerInput.value.trim();
    if (!text) return;
    readerWords = text.split(/\s+/);
    if (readerWords.length === 0) return;

    readerIsPlaying = true;
    if (btnReaderStart) {
      btnReaderStart.textContent = '⏹️ Stop';
      btnReaderStart.style.background = 'var(--danger)';
    }

    const wpm = parseInt(readerWpm.value);
    const intervalMs = 60000 / wpm;

    readerIntervalId = setInterval(() => {
      if (readerIdx >= readerWords.length) {
        pauseReader();
        readerIdx = 0;
        if (readerTarget) readerTarget.textContent = 'Finished!';
        return;
      }

      const word = readerWords[readerIdx];
      const p = Math.ceil(word.length / 2) - 1;
      const left = word.substring(0, p);
      const mid = word.charAt(p);
      const right = word.substring(p + 1);

      if (readerTarget) readerTarget.innerHTML = `${left}<span style="color: var(--accent); font-weight: bold;">${mid}</span>${right}`;
      readerIdx++;
    }, intervalMs);
  }

  function pauseReader() {
    readerIsPlaying = false;
    if (btnReaderStart) {
      btnReaderStart.textContent = '⚡ Play';
      btnReaderStart.style.background = 'var(--primary)';
    }
    clearInterval(readerIntervalId);
  }

  if (btnReaderStart) {
    btnReaderStart.addEventListener('click', () => {
      if (readerIsPlaying) pauseReader();
      else startReader();
    });
  }

  if (btnReaderPause) btnReaderPause.addEventListener('click', pauseReader);
  if (btnReaderReset) {
    btnReaderReset.addEventListener('click', () => {
      window.resetSpeedReaderState();
    });
  }


  // ============================================================================
  // 21. FILE MIME MAGIC BYTE INSPECTOR
  // ============================================================================
  const mimeFileInput = document.getElementById('mime-file-input');
  const mimeDropzone = document.getElementById('mime-dropzone');
  const mimeFileName = document.getElementById('mime-file-name');
  const mimeFileExt = document.getElementById('mime-file-ext');
  const mimeMagicHex = document.getElementById('mime-magic-hex');
  const mimeDetectedType = document.getElementById('mime-detected-type');
  const mimeMatchBadge = document.getElementById('mime-match-badge');

  window.resetMimeInspectorState = function() {
    if (mimeFileName) mimeFileName.textContent = '--';
    if (mimeFileExt) mimeFileExt.textContent = '--';
    if (mimeMagicHex) mimeMagicHex.textContent = '--';
    if (mimeDetectedType) mimeDetectedType.textContent = '--';
    if (mimeMatchBadge) {
      mimeMatchBadge.textContent = '--';
      mimeMatchBadge.style.background = 'var(--border)';
      mimeMatchBadge.style.color = 'var(--text-primary)';
    }
  };

  if (mimeDropzone) {
    mimeDropzone.addEventListener('click', () => mimeFileInput.click());
    mimeDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      mimeDropzone.style.borderColor = 'var(--accent)';
    });
    mimeDropzone.addEventListener('dragleave', () => {
      mimeDropzone.style.borderColor = 'var(--border)';
    });
    mimeDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      mimeDropzone.style.borderColor = 'var(--border)';
      if (e.dataTransfer.files.length > 0) {
        handleMimeFile(e.dataTransfer.files[0]);
      }
    });
  }

  if (mimeFileInput) {
    mimeFileInput.addEventListener('change', () => {
      if (mimeFileInput.files.length > 0) {
        handleMimeFile(mimeFileInput.files[0]);
      }
    });
  }

  function handleMimeFile(file) {
    if (mimeFileName) mimeFileName.textContent = file.name;
    const splitExt = file.name.split('.').pop().toLowerCase();
    if (mimeFileExt) mimeFileExt.textContent = `.${splitExt}`;

    const reader = new FileReader();
    reader.onload = function(e) {
      const arr = new Uint8Array(e.target.result);
      const hexArr = Array.from(arr).map(b => b.toString(16).toUpperCase().padStart(2, '0'));
      const hex = hexArr.join(' ');
      if (mimeMagicHex) mimeMagicHex.textContent = hex;

      let detected = 'Unknown Binary';
      let expectedExt = '';

      if (hex.startsWith('89 50 4E 47')) {
        detected = 'image/png';
        expectedExt = 'png';
      } else if (hex.startsWith('FF D8 FF')) {
        detected = 'image/jpeg';
        expectedExt = 'jpg';
      } else if (hex.startsWith('47 49 46 38')) {
        detected = 'image/gif';
        expectedExt = 'gif';
      } else if (hex.startsWith('25 50 44 46')) {
        detected = 'application/pdf';
        expectedExt = 'pdf';
      } else if (hex.startsWith('50 4B 03 04')) {
        detected = 'application/zip';
        expectedExt = 'zip';
      } else if (hex.startsWith('49 44 33') || hex.startsWith('FF FB')) {
        detected = 'audio/mpeg (MP3)';
        expectedExt = 'mp3';
      }

      if (mimeDetectedType) mimeDetectedType.textContent = detected;
      const isMatch = (splitExt === expectedExt) || (splitExt === 'jpeg' && expectedExt === 'jpg');

      if (mimeMatchBadge) {
        if (isMatch) {
          mimeMatchBadge.textContent = '✓ Secure (Match)';
          mimeMatchBadge.style.background = 'var(--accent-glow)';
          mimeMatchBadge.style.color = 'var(--accent)';
        } else {
          mimeMatchBadge.textContent = '⚠ Warning (Mismatch)';
          mimeMatchBadge.style.background = 'var(--danger-glow)';
          mimeMatchBadge.style.color = 'var(--danger)';
        }
      }
    };
    reader.readAsArrayBuffer(file.slice(0, 16));
  }


  // ============================================================================
  // 22. SQL QUERY PLAYGROUND & SANDBOX
  // ============================================================================
  const sqlQueryInput = document.getElementById('sql-query-input');
  const btnSqlQueryRun = document.getElementById('btn-sql-query-run');
  const btnSqlQueryReset = document.getElementById('btn-sql-query-reset');
  const sqlStatus = document.getElementById('sql-status');
  const sqlResultContainer = document.getElementById('sql-result-container');

  let dbTables = {};

  window.resetSqlPlaygroundState = function() {
    if (sqlQueryInput) sqlQueryInput.value = "CREATE TABLE users (id, name, role);\nINSERT INTO users VALUES (1, 'Alice', 'Admin');\nINSERT INTO users VALUES (2, 'Bob', 'Member');\nSELECT * FROM users;";
    dbTables = {};
    if (sqlStatus) sqlStatus.textContent = 'Tables: None';
    if (sqlResultContainer) sqlResultContainer.innerHTML = '<div style="color: var(--text-muted); font-size: 0.85rem; padding: 1rem; text-align: center;">Execute query to run sandbox.</div>';
  };

  function executeSql() {
    if (!sqlQueryInput || !sqlResultContainer) return;
    const queryStr = sqlQueryInput.value.trim();
    if (!queryStr) return;

    sqlResultContainer.innerHTML = '';
    const statements = queryStr.split(';').map(s => s.trim()).filter(s => s.length > 0);

    statements.forEach(stmt => {
      try {
        if (/^CREATE\s+TABLE/i.test(stmt)) {
          const match = stmt.match(/CREATE\s+TABLE\s+(\w+)\s*\(([^)]+)\)/i);
          if (match) {
            const tableName = match[1].toLowerCase();
            const columns = match[2].split(',').map(c => c.trim().toLowerCase());
            dbTables[tableName] = { columns, rows: [] };
            appendSqlStatus(`Table '${tableName}' created.`);
          }
        } else if (/^INSERT\s+INTO/i.test(stmt)) {
          const match = stmt.match(/INSERT\s+INTO\s+(\w+)\s+VALUES\s*\(([^)]+)\)/i);
          if (match) {
            const tableName = match[1].toLowerCase();
            const vals = match[2].split(',').map(v => v.trim().replace(/^'|'$/g, ''));
            if (dbTables[tableName]) {
              dbTables[tableName].rows.push(vals);
              appendSqlStatus(`Row inserted into '${tableName}'.`);
            } else {
              throw new Error(`Table '${tableName}' not found.`);
            }
          }
        } else if (/^SELECT/i.test(stmt)) {
          const match = stmt.match(/SELECT\s+(.+)\s+FROM\s+(\w+)/i);
          if (match) {
            const colsToSelect = match[1].trim();
            const tableName = match[2].toLowerCase();
            if (!dbTables[tableName]) throw new Error(`Table '${tableName}' not found.`);

            const tbl = dbTables[tableName];
            const indices = colsToSelect === '*' ? tbl.columns.map((_, idx) => idx) : colsToSelect.split(',').map(c => tbl.columns.indexOf(c.trim().toLowerCase()));

            const tableEl = document.createElement('table');
            tableEl.style.width = '100%';
            tableEl.style.borderCollapse = 'collapse';
            tableEl.style.fontSize = '0.9rem';
            tableEl.style.marginTop = '0.5rem';

            let headersHtml = '<tr style="border-bottom: 1px solid var(--border); font-weight: bold; background: rgba(255,255,255,0.02);">';
            indices.forEach(idx => {
              headersHtml += `<th style="padding: 0.5rem;">${tbl.columns[idx] || 'unknown'}</th>`;
            });
            headersHtml += '</tr>';

            let rowsHtml = '';
            tbl.rows.forEach(r => {
              rowsHtml += '<tr style="border-bottom: 1px dashed var(--border);">';
              indices.forEach(idx => {
                rowsHtml += `<td style="padding: 0.5rem; font-family: monospace;">${r[idx] || ''}</td>`;
              });
              rowsHtml += '</tr>';
            });

            tableEl.innerHTML = headersHtml + rowsHtml;
            sqlResultContainer.appendChild(tableEl);
          }
        }
      } catch (err) {
        const errorDiv = document.createElement('div');
        errorDiv.style.color = 'var(--danger)';
        errorDiv.style.padding = '0.5rem';
        errorDiv.style.fontWeight = 'bold';
        errorDiv.textContent = `SQL Error: ${err.message}`;
        sqlResultContainer.appendChild(errorDiv);
      }
    });

    if (sqlStatus) sqlStatus.textContent = `Tables: ${Object.keys(dbTables).join(', ') || 'None'}`;
  }

  function appendSqlStatus(txt) {
    if (!sqlResultContainer) return;
    const div = document.createElement('div');
    div.style.color = 'var(--accent)';
    div.style.padding = '0.25rem';
    div.style.fontSize = '0.85rem';
    div.textContent = `✓ ${txt}`;
    sqlResultContainer.appendChild(div);
  }

  if (btnSqlQueryRun) btnSqlQueryRun.addEventListener('click', executeSql);
  if (btnSqlQueryReset) btnSqlQueryReset.addEventListener('click', () => window.resetSqlPlaygroundState());


  // ============================================================================
  // 23. FILE CHECKSUM & HASH VERIFIER
  // ============================================================================
  const hashverFileInput = document.getElementById('hashver-file-input');
  const hashverDropzone = document.getElementById('hashver-dropzone');
  const hashverTarget = document.getElementById('hashver-target-input');
  const hashverSha256 = document.getElementById('hashver-sha256-output');
  const hashverSha1 = document.getElementById('hashver-sha1-output');
  const hashverMatch = document.getElementById('hashver-match-badge');

  window.resetHashVerifierState = function() {
    if (hashverTarget) hashverTarget.value = '';
    if (hashverSha256) hashverSha256.value = '';
    if (hashverSha1) hashverSha1.value = '';
    if (hashverMatch) {
      hashverMatch.textContent = 'Pending file checksum generation.';
      hashverMatch.style.background = 'var(--border)';
      hashverMatch.style.color = 'var(--text-primary)';
    }
  };

  if (hashverDropzone) {
    hashverDropzone.addEventListener('click', () => hashverFileInput.click());
    hashverDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      hashverDropzone.style.borderColor = 'var(--accent)';
    });
    hashverDropzone.addEventListener('dragleave', () => {
      hashverDropzone.style.borderColor = 'var(--border)';
    });
    hashverDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      hashverDropzone.style.borderColor = 'var(--border)';
      if (e.dataTransfer.files.length > 0) {
        handleHashverFile(e.dataTransfer.files[0]);
      }
    });
  }

  if (hashverFileInput) {
    hashverFileInput.addEventListener('change', () => {
      if (hashverFileInput.files.length > 0) {
        handleHashverFile(hashverFileInput.files[0]);
      }
    });
  }

  if (hashverTarget) hashverTarget.addEventListener('input', runHashMatchCheck);

  function handleHashverFile(file) {
    if (hashverMatch) hashverMatch.textContent = 'Computing SHA hashes locally...';
    const reader = new FileReader();
    reader.onload = async function(e) {
      const buffer = e.target.result;
      
      const hashBuffer256 = await crypto.subtle.digest('SHA-256', buffer);
      const sha256 = Array.from(new Uint8Array(hashBuffer256)).map(b => b.toString(16).padStart(2, '0')).join('');
      if (hashverSha256) hashverSha256.value = sha256;

      const hashBuffer1 = await crypto.subtle.digest('SHA-1', buffer);
      const sha1 = Array.from(new Uint8Array(hashBuffer1)).map(b => b.toString(16).padStart(2, '0')).join('');
      if (hashverSha1) hashverSha1.value = sha1;

      runHashMatchCheck();
    };
    reader.readAsArrayBuffer(file);
  }

  function runHashMatchCheck() {
    if (!hashverTarget || !hashverSha256 || !hashverSha1) return;
    const target = hashverTarget.value.trim().toLowerCase();
    const sha256 = hashverSha256.value;
    const sha1 = hashverSha1.value;

    if (!sha256) return;
    if (!target) {
      if (hashverMatch) {
        hashverMatch.textContent = 'Hash generated. Paste target checksum above to verify.';
        hashverMatch.style.background = 'var(--border)';
        hashverMatch.style.color = 'var(--text-primary)';
      }
      return;
    }

    if (hashverMatch) {
      if (target === sha256 || target === sha1) {
        hashverMatch.textContent = '✓ Checksum Verified (Match)';
        hashverMatch.style.background = 'var(--accent-glow)';
        hashverMatch.style.color = 'var(--accent)';
      } else {
        hashverMatch.textContent = '✕ Integrity Mismatch';
        hashverMatch.style.background = 'var(--danger-glow)';
        hashverMatch.style.color = 'var(--danger)';
      }
    }
  }


  // ============================================================================
  // 24. SVG PLACEHOLDER IMAGE GENERATOR
  // ============================================================================
  const pixelW = document.getElementById('pixel-width');
  const pixelH = document.getElementById('pixel-height');
  const pixelLabel = document.getElementById('pixel-label');
  const pixelBg = document.getElementById('pixel-bg-color');
  const pixelTxt = document.getElementById('pixel-txt-color');
  const btnPixelGen = document.getElementById('btn-pixel-generate');
  const pixelPreview = document.getElementById('pixel-preview-container');
  const btnPixelCopy = document.getElementById('btn-pixel-copy');
  const btnPixelPng = document.getElementById('btn-pixel-download-png');

  window.resetLoremPixelState = function() {
    if (pixelW) pixelW.value = 300;
    if (pixelH) pixelH.value = 200;
    if (pixelLabel) pixelLabel.value = '300 x 200';
    if (pixelBg) pixelBg.value = '#27272a';
    if (pixelTxt) pixelTxt.value = '#a1a1aa';
    generatePlaceholder();
  };

  function getPlaceholderSvg() {
    const w = parseInt(pixelW.value) || 300;
    const h = parseInt(pixelH.value) || 200;
    const label = pixelLabel ? pixelLabel.value : '';
    const bg = pixelBg ? pixelBg.value : '#27272a';
    const txt = pixelTxt ? pixelTxt.value : '#a1a1aa';

    return `
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${bg}" />
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${txt}" font-size="14" font-family="sans-serif" font-weight="bold">${label}</text>
</svg>
    `.trim();
  }

  function generatePlaceholder() {
    if (!pixelPreview) return;
    const svg = getPlaceholderSvg();
    pixelPreview.innerHTML = svg;
  }

  if (btnPixelGen) btnPixelGen.addEventListener('click', generatePlaceholder);
  if (btnPixelCopy) btnPixelCopy.addEventListener('click', () => copyText(getPlaceholderSvg()));
  
  if (btnPixelPng) {
    btnPixelPng.addEventListener('click', () => {
      if (!pixelW || !pixelH) return;
      const w = parseInt(pixelW.value) || 300;
      const h = parseInt(pixelH.value) || 200;
      const svg = getPlaceholderSvg();

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');

      const img = new Image();
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
      img.onload = function() {
        ctx.drawImage(img, 0, 0);
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'placeholder.png';
        a.click();
      };
    });
  }


  // ============================================================================
  // 25. RATIO & PROPORTION SOLVER
  // ============================================================================
  const ratioA = document.getElementById('ratio-a');
  const ratioB = document.getElementById('ratio-b');
  const ratioC = document.getElementById('ratio-c');
  const ratioD = document.getElementById('ratio-d');
  const btnRatioSolve = document.getElementById('btn-ratio-solve');
  const ratioResult = document.getElementById('ratio-result-badge');
  const ratioSteps = document.getElementById('ratio-steps');

  window.resetRatioSolverState = function() {
    if (ratioA) ratioA.value = 2;
    if (ratioB) ratioB.value = 3;
    if (ratioC) ratioC.value = 4;
    if (ratioD) ratioD.value = 'X';
    if (ratioResult) ratioResult.textContent = 'X = 6';
    if (ratioSteps) ratioSteps.innerHTML = 'Equation: 2 / 3 = 4 / X<br/>Cross multiply: 2 * X = 3 * 4<br/>X = 12 / 2 = 6';
  };

  if (btnRatioSolve) {
    btnRatioSolve.addEventListener('click', () => {
      if (!ratioA || !ratioB || !ratioC || !ratioD) return;
      const valA = parseFloat(ratioA.value);
      const valB = parseFloat(ratioB.value);
      const valC = parseFloat(ratioC.value);
      const valD = parseFloat(ratioD.value);

      let xVal = 0;
      let steps = '';

      if (isNaN(valA)) {
        xVal = (valC * valB) / valD;
        steps = `Equation: X / ${valB} = ${valC} / ${valD}<br/>Solve: X = (${valC} * ${valB}) / ${valD}<br/>X = ${xVal}`;
        ratioA.value = xVal;
      } else if (isNaN(valB)) {
        xVal = (valA * valD) / valC;
        steps = `Equation: ${valA} / X = ${valC} / ${valD}<br/>Solve: X = (${valA} * ${valD}) / ${valC}<br/>X = ${xVal}`;
        ratioB.value = xVal;
      } else if (isNaN(valC)) {
        xVal = (valA * valD) / valB;
        steps = `Equation: ${valA} / ${valB} = X / ${valD}<br/>Solve: X = (${valA} * ${valD}) / ${valB}<br/>X = ${xVal}`;
        ratioC.value = xVal;
      } else {
        xVal = (valB * valC) / valA;
        steps = `Equation: ${valA} / ${valB} = ${valC} / X<br/>Solve: X = (${valB} * ${valC}) / ${valA}<br/>X = ${xVal}`;
        ratioD.value = xVal;
      }

      if (ratioResult) ratioResult.textContent = `Result = ${xVal}`;
      if (ratioSteps) ratioSteps.innerHTML = steps;
    });
  }
});
