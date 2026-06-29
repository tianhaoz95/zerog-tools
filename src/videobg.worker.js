import { pipeline, env, RawImage } from '@huggingface/transformers';

// Disable local models fallback to avoid loading errors in browser
env.allowLocalModels = false;

// Dedicated MODNet (Xenova/modnet) portrait matting worker used by the
// Video Background Swap tool. Each posted frame returns a single-channel
// alpha matte so the main thread can composite it over a new backdrop.
let segmenter = null;

self.onmessage = async (e) => {
  const { type, data } = e.data;

  if (type === 'init') {
    try {
      self.postMessage({ type: 'status', data: 'loading', progress: 0 });

      const progressCallback = (progressData) => {
        if (progressData.status === 'progress') {
          self.postMessage({
            type: 'status',
            data: 'loading',
            progress: progressData.progress,
            file: progressData.file
          });
        }
      };

      // Prefer the dedicated background-removal task, fall back to the more
      // generic image-segmentation task if the runtime build lacks it.
      try {
        segmenter = await pipeline('background-removal', 'Xenova/modnet', {
          progress_callback: progressCallback
        });
      } catch (err) {
        console.warn('background-removal task failed, trying image-segmentation:', err);
        segmenter = await pipeline('image-segmentation', 'Xenova/modnet', {
          progress_callback: progressCallback
        });
      }

      self.postMessage({ type: 'status', data: 'ready' });
    } catch (err) {
      console.error('Failed to load MODNet model in video worker:', err);
      self.postMessage({ type: 'status', data: 'error', error: err.message });
    }
  }

  else if (type === 'matte_frame') {
    if (!segmenter) {
      self.postMessage({ type: 'error', error: 'Model not initialized' });
      return;
    }

    try {
      const { frameId, width, height, rgbaData } = data;

      // rgbaData is a Uint8ClampedArray representing the RGBA frame (4 channels)
      const rawImage = new RawImage(rgbaData, width, height, 4);

      const output = await segmenter(rawImage);

      // Locate the mask RawImage across the possible output shapes
      let maskImage = null;
      if (output && output.mask instanceof RawImage) {
        maskImage = output.mask;
      } else if (Array.isArray(output) && output[0] && output[0].mask instanceof RawImage) {
        maskImage = output[0].mask;
      } else if (Array.isArray(output) && output[0] instanceof RawImage) {
        maskImage = output[0];
      } else if (output instanceof RawImage) {
        maskImage = output;
      } else if (Array.isArray(output) && output[0]) {
        maskImage = output[0].mask || output[0];
      } else {
        maskImage = output;
      }

      if (!maskImage || !maskImage.data) {
        throw new Error('Could not extract mask from model output.');
      }

      self.postMessage({
        type: 'matte_frame_result',
        data: {
          frameId,
          width: maskImage.width,
          height: maskImage.height,
          channels: maskImage.channels,
          pixelData: Array.from(maskImage.data)
        }
      });
    } catch (err) {
      console.error('Video MODNet matte error:', err);
      self.postMessage({ type: 'error', error: err.message });
    }
  }
};
