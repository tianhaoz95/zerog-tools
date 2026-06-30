import { pipeline, env, RawImage } from '@huggingface/transformers';

// Disable local models fallback to avoid loading errors in browser
env.allowLocalModels = false;

// Swin2SR super-resolution models, keyed by integer upscale factor. Both are
// Xenova ONNX ports runnable client-side via the image-to-image pipeline.
const MODEL_IDS = {
  2: 'Xenova/swin2SR-classical-sr-x2-64',
  4: 'Xenova/swin2SR-compressed-sr-x4-48'
};

// Tile dimensions per scale. Swin2SR is memory-hungry, so we process the image
// in overlapping tiles and stitch the results to keep peak memory bounded and
// the tab responsive. The 4x model gets smaller tiles since its output (and the
// intermediate activations) are 4x larger per side.
const TILE_CONFIG = {
  2: { tile: 256, overlap: 32 },
  4: { tile: 128, overlap: 16 }
};

// Cache one pipeline per scale so switching factors doesn't re-download.
const upscalers = {};

async function getUpscaler(scale, progressCallback) {
  if (upscalers[scale]) return upscalers[scale];
  const modelId = MODEL_IDS[scale];
  if (!modelId) throw new Error(`Unsupported upscale factor: ${scale}x`);
  upscalers[scale] = await pipeline('image-to-image', modelId, {
    progress_callback: progressCallback
  });
  return upscalers[scale];
}

// Compute tile start positions along one axis so every tile is the full tile
// size (except when the whole axis is smaller), with the final tile aligned to
// the far edge. Adjacent tiles overlap by `overlap` pixels.
function tilePositions(total, tile, overlap) {
  if (total <= tile) return [0];
  const step = tile - overlap;
  const positions = [];
  for (let p = 0; p + tile < total; p += step) positions.push(p);
  positions.push(total - tile);
  return positions;
}

// Extract a tw x th RGB tile (3 channels) from a full RGBA buffer.
function extractTileRGB(rgba, fullW, tx, ty, tw, th) {
  const out = new Uint8ClampedArray(tw * th * 3);
  for (let y = 0; y < th; y++) {
    const srcRow = (ty + y) * fullW + tx;
    const dstRow = y * tw;
    for (let x = 0; x < tw; x++) {
      const si = (srcRow + x) * 4;
      const di = (dstRow + x) * 3;
      out[di] = rgba[si];
      out[di + 1] = rgba[si + 1];
      out[di + 2] = rgba[si + 2];
    }
  }
  return out;
}

self.onmessage = async (e) => {
  const { type, data } = e.data;

  const progressCallback = (p) => {
    if (p.status === 'progress') {
      self.postMessage({
        type: 'status',
        data: 'loading',
        progress: p.progress,
        file: p.file
      });
    }
  };

  if (type === 'init') {
    // Warm the default 2x model so the first run only pays inference cost.
    try {
      self.postMessage({ type: 'status', data: 'loading', progress: 0 });
      await getUpscaler(data?.scale || 2, progressCallback);
      self.postMessage({ type: 'status', data: 'ready' });
    } catch (err) {
      console.error('Failed to load Swin2SR model in worker:', err);
      self.postMessage({ type: 'status', data: 'error', error: err.message });
    }
    return;
  }

  if (type === 'upscale') {
    try {
      const { width, height, rgbaData, scale } = data;
      const factor = MODEL_IDS[scale] ? scale : 2;

      // Ensure the right model is loaded (downloads on first use of a factor).
      self.postMessage({ type: 'status', data: 'loading', progress: 0 });
      const upscaler = await getUpscaler(factor, progressCallback);
      self.postMessage({ type: 'status', data: 'ready' });

      const { tile, overlap } = TILE_CONFIG[factor];
      const half = overlap / 2;
      const xs = tilePositions(width, tile, overlap);
      const ys = tilePositions(height, tile, overlap);
      const totalTiles = xs.length * ys.length;

      const outW = width * factor;
      const outH = height * factor;
      const outRGBA = new Uint8ClampedArray(outW * outH * 4);

      let done = 0;
      for (const ty of ys) {
        const th = Math.min(tile, height - ty);
        for (const tx of xs) {
          const tw = Math.min(tile, width - tx);

          const rgbTile = extractTileRGB(rgbaData, width, tx, ty, tw, th);
          const tileImg = new RawImage(rgbTile, tw, th, 3);
          const res = await upscaler(tileImg);

          const otw = tw * factor;
          const oth = th * factor;

          // Crop half the overlap from any edge that borders another tile so
          // the seams fall in the discarded margin, then place the interior.
          const cl = tx > 0 ? half * factor : 0;
          const ct = ty > 0 ? half * factor : 0;
          const cr = tx + tw < width ? half * factor : 0;
          const cb = ty + th < height ? half * factor : 0;

          // Build a standalone RGBA buffer for just the interior region we place,
          // so the main thread can paint this tile into a live preview as it
          // arrives (progressive reveal) without copying the whole output.
          const regionX = tx * factor + cl;
          const regionY = ty * factor + ct;
          const regionW = (otw - cr) - cl;
          const regionH = (oth - cb) - ct;
          const regionRGBA = new Uint8ClampedArray(regionW * regionH * 4);

          for (let y = ct; y < oth - cb; y++) {
            const oy = ty * factor + y;
            const srcRow = y * otw;
            const dstRow = oy * outW;
            const regRow = (y - ct) * regionW;
            for (let x = cl; x < otw - cr; x++) {
              const ox = tx * factor + x;
              const si = (srcRow + x) * 3;
              const di = (dstRow + ox) * 4;
              const ri = (regRow + (x - cl)) * 4;
              const r = res.data[si];
              const g = res.data[si + 1];
              const b = res.data[si + 2];
              outRGBA[di] = r;
              outRGBA[di + 1] = g;
              outRGBA[di + 2] = b;
              outRGBA[di + 3] = 255;
              regionRGBA[ri] = r;
              regionRGBA[ri + 1] = g;
              regionRGBA[ri + 2] = b;
              regionRGBA[ri + 3] = 255;
            }
          }

          done++;
          self.postMessage(
            {
              type: 'progress',
              data: {
                current: done,
                total: totalTiles,
                tile: { x: regionX, y: regionY, w: regionW, h: regionH }
              },
              rgba: regionRGBA
            },
            [regionRGBA.buffer]
          );
        }
      }

      self.postMessage(
        { type: 'upscale_result', data: { width: outW, height: outH, factor }, rgba: outRGBA },
        [outRGBA.buffer]
      );
    } catch (err) {
      console.error('Swin2SR upscale error:', err);
      self.postMessage({ type: 'error', error: err.message });
    }
  }
};
