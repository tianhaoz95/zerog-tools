import { pipeline, env, RawImage } from '@huggingface/transformers';

// Disable local models fallback to avoid loading errors in browser
env.allowLocalModels = false;

let segmenter = null;

self.onmessage = async (e) => {
  const { type, data } = e.data;

  if (type === 'init') {
    try {
      self.postMessage({ type: 'status', data: 'loading', progress: 0 });
      
      // Try background-removal task first, fallback to image-segmentation if needed
      try {
        segmenter = await pipeline('background-removal', 'Xenova/modnet', {
          progress_callback: (progressData) => {
            if (progressData.status === 'progress') {
              self.postMessage({
                type: 'status',
                data: 'loading',
                progress: progressData.progress,
                file: progressData.file
              });
            }
          }
        });
      } catch (err) {
        console.warn('background-removal task failed, trying image-segmentation:', err);
        segmenter = await pipeline('image-segmentation', 'Xenova/modnet', {
          progress_callback: (progressData) => {
            if (progressData.status === 'progress') {
              self.postMessage({
                type: 'status',
                data: 'loading',
                progress: progressData.progress,
                file: progressData.file
              });
            }
          }
        });
      }

      self.postMessage({ type: 'status', data: 'ready' });
    } catch (err) {
      console.error('Failed to load MODNet model in worker:', err);
      self.postMessage({ type: 'status', data: 'error', error: err.message });
    }
  }

  else if (type === 'remove_bg') {
    if (!segmenter) {
      self.postMessage({ type: 'error', error: 'Model not initialized' });
      return;
    }

    try {
      const { width, height, rgbaData } = data;
      
      // rgbaData is a Uint8ClampedArray representing the RGBA image
      // Create RawImage from pixel values (4 channels for RGBA)
      const rawImage = new RawImage(rgbaData, width, height, 4);

      // Perform segmentation
      const output = await segmenter(rawImage);
      
      // Find the mask image from output
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
        // Fallback for objects matching RawImage structure
        maskImage = output[0].mask || output[0];
      } else {
        maskImage = output;
      }

      if (!maskImage || !maskImage.data) {
        throw new Error('Could not extract mask from model output.');
      }

      // Convert Uint8Array to regular array to send across message port (or use Transferable if supported)
      self.postMessage({
        type: 'remove_bg_result',
        data: {
          width: maskImage.width,
          height: maskImage.height,
          channels: maskImage.channels,
          pixelData: Array.from(maskImage.data)
        }
      });
    } catch (err) {
      self.postMessage({ type: 'error', error: err.message });
    }
  }
};
