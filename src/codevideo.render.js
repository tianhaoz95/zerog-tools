import { CODE_HIGHLIGHT_PATTERNS } from './code-highlight.data.js';

// Plain-color (non-CSS) version of the code-to-image theme palette so the
// same color set can drive both DOM/CSS rendering and Canvas2D fillStyle calls.
export const CODE_VIDEO_THEMES = {
  onedark: {
    bg: '#282c34', fg: '#abb2bf', header: 'rgba(255,255,255,0.4)', border: 'rgba(255,255,255,0.06)',
    lineNumber: 'rgba(255,255,255,0.2)',
    comment: '#5c6370', string: '#98c379', number: '#d19a66', keyword: '#c678dd',
    builtin: '#e5c07b', function: '#61afef', operator: '#56b6c2'
  },
  vscode: {
    bg: '#1e1e1e', fg: '#d4d4d4', header: 'rgba(255,255,255,0.4)', border: 'rgba(255,255,255,0.06)',
    lineNumber: 'rgba(255,255,255,0.2)',
    comment: '#6a9955', string: '#ce9178', number: '#b5cea8', keyword: '#569cd6',
    builtin: '#4ec9b0', function: '#dcdcaa', operator: '#d4d4d4'
  },
  monokai: {
    bg: '#272822', fg: '#f8f8f2', header: 'rgba(255,255,255,0.4)', border: 'rgba(255,255,255,0.06)',
    lineNumber: 'rgba(255,255,255,0.2)',
    comment: '#75715e', string: '#e6db74', number: '#ae81ff', keyword: '#f92672',
    builtin: '#66d9ef', function: '#a6e22e', operator: '#f8f8f2'
  },
  dracula: {
    bg: '#282a36', fg: '#f8f8f2', header: 'rgba(255,255,255,0.4)', border: 'rgba(255,255,255,0.06)',
    lineNumber: 'rgba(255,255,255,0.2)',
    comment: '#6272a4', string: '#f1fa8c', number: '#bd93f9', keyword: '#ff79c6',
    builtin: '#8be9fd', function: '#50fa7b', operator: '#f8f8f2'
  },
  cyberpunk: {
    bg: '#000b19', fg: '#00f0ff', header: 'rgba(0,240,255,0.5)', border: 'rgba(0,240,255,0.3)',
    lineNumber: 'rgba(0,240,255,0.3)',
    comment: '#718096', string: '#39ff14', number: '#ffff00', keyword: '#ff0055',
    builtin: '#00f0ff', function: '#ff00ff', operator: '#00f0ff'
  },
  'github-light': {
    bg: '#ffffff', fg: '#24292e', header: 'rgba(0,0,0,0.4)', border: 'rgba(0,0,0,0.12)',
    lineNumber: 'rgba(0,0,0,0.3)',
    comment: '#6a737d', string: '#032f62', number: '#005cc5', keyword: '#d73a49',
    builtin: '#e36209', function: '#6f42c1', operator: '#24292e'
  },
  'solarized-light': {
    bg: '#fdf6e3', fg: '#657b83', header: 'rgba(101,123,131,0.5)', border: 'rgba(0,0,0,0.1)',
    lineNumber: 'rgba(101,123,131,0.3)',
    comment: '#93a1a1', string: '#2aa198', number: '#d33682', keyword: '#859900',
    builtin: '#b58900', function: '#268bd2', operator: '#657b83'
  }
};

export const CODE_VIDEO_BG_PRESETS = {
  sunset: ['#f02fc2', '#6094ea'],
  ocean: ['#2af598', '#009efd'],
  emerald: ['#11998e', '#38ef7d'],
  lemon: ['#f6d365', '#fda085'],
  twilight: ['#ff9a9e', '#fecfef'],
  cyber: ['#f9d423', '#ff4e50']
};

// Tokenizes `code` into {text, type} runs covering the whole string, reusing
// the same regex rules the code-to-image tool uses for HTML highlighting.
export function tokenizeCode(code, lang) {
  const rules = CODE_HIGHLIGHT_PATTERNS[lang] || CODE_HIGHLIGHT_PATTERNS.javascript;
  const parts = [];
  const groupNames = [];
  for (const rule of rules) {
    parts.push(`(${rule.regex.source})`);
    groupNames.push(rule.name);
  }
  const flags = lang === 'sql' ? 'gi' : 'g';
  const masterRegex = new RegExp(parts.join('|'), flags);

  const tokens = [];
  let lastIndex = 0;
  code.replace(masterRegex, (match, ...args) => {
    const offset = args[args.length - 2];
    if (offset > lastIndex) {
      tokens.push({ text: code.slice(lastIndex, offset), type: 'text' });
    }
    let matchedName = 'text';
    for (let i = 0; i < groupNames.length; i++) {
      if (args[i] !== undefined) { matchedName = groupNames[i]; break; }
    }
    tokens.push({ text: match, type: matchedName });
    lastIndex = offset + match.length;
    return match;
  });
  if (lastIndex < code.length) {
    tokens.push({ text: code.slice(lastIndex), type: 'text' });
  }
  return tokens;
}

// Expands {text, type} runs into one token-type entry per character, so a
// partially-typed token (e.g. half a string literal) still resolves a color.
export function charTypesForCode(code, lang) {
  const tokens = tokenizeCode(code, lang);
  const types = new Array(code.length);
  let i = 0;
  for (const tok of tokens) {
    for (let j = 0; j < tok.text.length; j++) {
      types[i++] = tok.type;
    }
  }
  return types;
}

function cssAngleToGradientCoords(angleDeg, w, h) {
  const rad = (angleDeg * Math.PI) / 180;
  const dx = Math.sin(rad);
  const dy = -Math.cos(rad);
  const length = Math.abs(w * dx) + Math.abs(h * dy);
  const cx = w / 2, cy = h / 2;
  return [cx - (dx * length) / 2, cy - (dy * length) / 2, cx + (dx * length) / 2, cy + (dy * length) / 2];
}

function paintBackdrop(ctx, width, height, backdrop) {
  if (backdrop.type === 'solid') {
    ctx.fillStyle = backdrop.solid;
    ctx.fillRect(0, 0, width, height);
    return;
  }
  let color1 = backdrop.color1;
  let color2 = backdrop.color2;
  let angle = backdrop.angle ?? 135;
  if (backdrop.type === 'preset') {
    const preset = CODE_VIDEO_BG_PRESETS[backdrop.preset] || CODE_VIDEO_BG_PRESETS.sunset;
    [color1, color2] = preset;
    angle = 135;
  }
  const [x0, y0, x1, y1] = cssAngleToGradientCoords(angle, width, height);
  const grad = ctx.createLinearGradient(x0, y0, x1, y1);
  grad.addColorStop(0, color1);
  grad.addColorStop(1, color2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
}

function roundRectPath(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

// Splits revealed text into display lines (wrapped at maxChars, char-based —
// matching the code-to-image preview's `word-break: break-all`), tagging
// each char with its source line number (1-based) for the gutter.
function buildDisplayLines(revealedText, charTypes, maxCharsPerLine) {
  const sourceLines = revealedText.split('\n');
  const displayLines = [];
  sourceLines.forEach((srcLine, srcIdx) => {
    const lineNo = srcIdx + 1;
    if (srcLine.length === 0) {
      displayLines.push({ lineNo, chars: [], isFirstSegment: true });
      return;
    }
    let offset = 0;
    let first = true;
    while (offset < srcLine.length) {
      const chunk = srcLine.slice(offset, offset + maxCharsPerLine);
      displayLines.push({ lineNo, chars: chunk.split(''), isFirstSegment: first, startOffset: offset });
      offset += maxCharsPerLine;
      first = false;
    }
  });
  return displayLines;
}

/**
 * Draws one frame of the typing animation onto a Canvas2D context (works for
 * both HTMLCanvasElement and OffscreenCanvas 2D contexts).
 */
export function renderCodeFrame(ctx, opts) {
  const {
    width, height,
    code, lang,
    theme, font, fontSize,
    showLineNumbers, showControls, title,
    backdrop,
    outerPadding, radius, shadow,
    charsVisible,
    cursorOn
  } = opts;

  const colors = CODE_VIDEO_THEMES[theme] || CODE_VIDEO_THEMES.onedark;
  const fullCharTypes = charTypesForCode(code, lang);

  ctx.clearRect(0, 0, width, height);
  paintBackdrop(ctx, width, height, backdrop);

  const cardX = outerPadding;
  const cardY = outerPadding;
  const cardW = width - outerPadding * 2;
  const cardH = height - outerPadding * 2;
  if (cardW <= 0 || cardH <= 0) return;

  if (shadow > 0) {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = shadow;
    ctx.shadowOffsetY = shadow / 2;
    ctx.fillStyle = colors.bg;
    roundRectPath(ctx, cardX, cardY, cardW, cardH, radius);
    ctx.fill();
    ctx.restore();
  }

  roundRectPath(ctx, cardX, cardY, cardW, cardH, radius);
  ctx.save();
  ctx.clip();
  ctx.fillStyle = colors.bg;
  ctx.fillRect(cardX, cardY, cardW, cardH);

  const headerH = (showControls || title) ? Math.max(34, fontSize * 2.2) : 0;
  if (headerH > 0) {
    ctx.fillStyle = colors.border;
    ctx.fillRect(cardX, cardY + headerH - 1, cardW, 1);

    if (showControls) {
      const dotR = 6, dotGap = 18, dotsY = cardY + headerH / 2;
      const dotColors = ['#ff5f56', '#ffbd2e', '#27c93f'];
      dotColors.forEach((c, i) => {
        ctx.beginPath();
        ctx.fillStyle = c;
        ctx.arc(cardX + 20 + i * dotGap, dotsY, dotR, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    if (title) {
      ctx.fillStyle = colors.header;
      ctx.font = `500 ${Math.max(12, fontSize * 0.85)}px ${font}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(title, cardX + cardW / 2, cardY + headerH / 2);
      ctx.textAlign = 'left';
    }
  }

  const bodyPad = Math.max(12, fontSize);
  const bodyX = cardX + bodyPad;
  const bodyY = cardY + headerH + bodyPad * 0.6;
  const bodyW = cardW - bodyPad * 2;
  const bodyH = cardY + cardH - bodyPad * 0.6 - bodyY;
  if (bodyW <= 0 || bodyH <= 0) { ctx.restore(); return; }

  ctx.font = `${fontSize}px ${font}`;
  ctx.textBaseline = 'alphabetic';
  const charWidth = ctx.measureText('M').width || fontSize * 0.6;
  const lineHeight = fontSize * 1.5;

  const gutterDigits = Math.max(2, String(code.split('\n').length).length);
  const gutterW = showLineNumbers ? (gutterDigits * charWidth + bodyPad) : 0;
  const codeAreaX = bodyX + gutterW;
  const codeAreaW = bodyW - gutterW;
  const maxCharsPerLine = Math.max(4, Math.floor(codeAreaW / charWidth));

  const revealed = code.slice(0, charsVisible);
  const revealedTypes = fullCharTypes.slice(0, charsVisible);
  const displayLines = buildDisplayLines(revealed, revealedTypes, maxCharsPerLine);

  const visibleLineCount = Math.max(1, Math.floor(bodyH / lineHeight));
  const scrollLines = Math.max(0, displayLines.length - visibleLineCount);
  const linesToDraw = displayLines.slice(scrollLines);

  ctx.save();
  roundRectPath(ctx, bodyX, bodyY, bodyW, bodyH, 0);
  ctx.clip();

  // Per-display-line starting offsets into `revealedTypes` for color lookup.
  // Newlines between source lines consume one extra char in the flat reveal index.
  let flatOffset = 0;
  const flatOffsets = [];
  let prevLineNo = null;
  displayLines.forEach((dl) => {
    if (prevLineNo !== null && dl.isFirstSegment && dl.lineNo !== prevLineNo) flatOffset += 1; // '\n'
    flatOffsets.push(flatOffset);
    flatOffset += dl.chars.length;
    prevLineNo = dl.lineNo;
  });

  linesToDraw.forEach((dl, i) => {
    const y = bodyY + i * lineHeight + lineHeight * 0.72;
    const idx = scrollLines + i;
    const startFlat = flatOffsets[idx];

    if (showLineNumbers && dl.isFirstSegment) {
      ctx.fillStyle = colors.lineNumber;
      ctx.textAlign = 'right';
      ctx.fillText(String(dl.lineNo), bodyX + gutterW - bodyPad * 0.5, y);
      ctx.textAlign = 'left';
    }

    let col = 0;
    let runStart = 0;
    let runType = dl.chars.length ? revealedTypes[startFlat] : null;
    const flushRun = (endCol) => {
      if (endCol <= runStart) return;
      const text = dl.chars.slice(runStart, endCol).join('');
      ctx.fillStyle = colors[runType] || colors.fg;
      ctx.fillText(text, codeAreaX + runStart * charWidth, y);
    };
    for (col = 0; col < dl.chars.length; col++) {
      const t = revealedTypes[startFlat + col];
      if (t !== runType) {
        flushRun(col);
        runStart = col;
        runType = t;
      }
    }
    flushRun(dl.chars.length);
  });

  if (cursorOn && linesToDraw.length > 0) {
    const lastDl = linesToDraw[linesToDraw.length - 1];
    const lastIdx = linesToDraw.length - 1;
    const cy = bodyY + lastIdx * lineHeight + lineHeight * 0.15;
    const cx = codeAreaX + lastDl.chars.length * charWidth;
    ctx.fillStyle = colors.fg;
    ctx.fillRect(cx, cy, Math.max(2, fontSize * 0.08), fontSize * 1.1);
  }

  ctx.restore(); // body clip
  ctx.restore(); // card clip
}

export function totalFramesForTyping({ codeLength, fps, charsPerSecond, holdStartSec, holdEndSec }) {
  const typingSeconds = charsPerSecond > 0 ? codeLength / charsPerSecond : 0;
  const totalSeconds = holdStartSec + typingSeconds + holdEndSec;
  return Math.max(1, Math.ceil(totalSeconds * fps));
}

export function charsVisibleAtFrame({ frameIndex, fps, codeLength, charsPerSecond, holdStartFrames }) {
  const elapsedFrames = frameIndex - holdStartFrames;
  if (elapsedFrames <= 0) return 0;
  const elapsedSeconds = elapsedFrames / fps;
  const chars = Math.floor(elapsedSeconds * charsPerSecond);
  return Math.min(codeLength, Math.max(0, chars));
}
