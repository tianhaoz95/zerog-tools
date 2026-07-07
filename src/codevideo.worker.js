import { renderCodeFrame, totalFramesForTyping, charsVisibleAtFrame } from './codevideo.render.js';

let cancelRequested = false;

self.onmessage = async (e) => {
  const { type, payload } = e.data;
  if (type === 'render') {
    cancelRequested = false;
    try {
      await renderFrames(payload);
    } catch (err) {
      self.postMessage({ type: 'error', error: (err && err.message) || String(err) });
    }
  } else if (type === 'cancel') {
    cancelRequested = true;
  }
};

async function renderFrames(payload) {
  const {
    code, lang, theme, font, fontSize,
    showLineNumbers, showControls, title,
    backdrop, outerPadding, radius, shadow,
    width, height, fps,
    charsPerSecond, holdStartSec, holdEndSec
  } = payload;

  const holdStartFrames = Math.round(holdStartSec * fps);
  const frameCount = totalFramesForTyping({
    codeLength: code.length, fps, charsPerSecond, holdStartSec, holdEndSec
  });

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('OffscreenCanvas 2D context unavailable in this browser.');

  const frameBytes = width * height * 4;
  const buffer = new Uint8Array(frameBytes * frameCount);
  const cursorBlinkFrames = Math.max(1, Math.round(fps / 2));

  for (let f = 0; f < frameCount; f++) {
    if (cancelRequested) {
      self.postMessage({ type: 'cancelled' });
      return;
    }

    const charsVisible = charsVisibleAtFrame({
      frameIndex: f, fps, codeLength: code.length, charsPerSecond, holdStartFrames
    });
    const cursorOn = Math.floor(f / cursorBlinkFrames) % 2 === 0;

    renderCodeFrame(ctx, {
      width, height, code, lang, theme, font, fontSize,
      showLineNumbers, showControls, title,
      backdrop, outerPadding, radius, shadow,
      charsVisible, cursorOn
    });

    const imageData = ctx.getImageData(0, 0, width, height);
    buffer.set(imageData.data, f * frameBytes);

    if (f % 5 === 0 || f === frameCount - 1) {
      self.postMessage({ type: 'progress', phase: 'rendering', percent: Math.round(((f + 1) / frameCount) * 100) });
      // Yield so a 'cancel' message queued by the main thread gets processed.
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  self.postMessage({
    type: 'frames',
    buffer: buffer.buffer,
    width, height, fps, frameCount
  }, [buffer.buffer]);
}
