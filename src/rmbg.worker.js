import { AutoModel, AutoProcessor, env, RawImage } from '@huggingface/transformers';

// Disable local models fallback to avoid loading errors in browser
env.allowLocalModels = false;

let model = null;
let processor = null;

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

      // RMBG-1.4 ships a custom IS-Net architecture, so load the raw model and
      // its image processor directly instead of using a high-level pipeline.
      if (!model) {
        model = await AutoModel.from_pretrained('briaai/RMBG-1.4', {
          config: { model_type: 'custom' },
          progress_callback: progressCallback
        });
      }

      if (!processor) {
        processor = await AutoProcessor.from_pretrained('briaai/RMBG-1.4', {
          config: {
            do_normalize: true,
            do_pad: false,
            do_rescale: true,
            do_resize: true,
            image_mean: [0.5, 0.5, 0.5],
            feature_extractor_type: 'ImageFeatureExtractor',
            image_std: [1, 1, 1],
            resample: 2,
            rescale_factor: 0.00392156862745098,
            size: { width: 1024, height: 1024 }
          },
          progress_callback: progressCallback
        });
      }

      self.postMessage({ type: 'status', data: 'ready' });
    } catch (err) {
      console.error('Failed to load RMBG-1.4 model in worker:', err);
      self.postMessage({ type: 'status', data: 'error', error: err.message });
    }
  }

  else if (type === 'remove_bg') {
    if (!model || !processor) {
      self.postMessage({ type: 'error', error: 'Model not initialized' });
      return;
    }

    try {
      const { width, height, rgbaData } = data;

      // rgbaData is a Uint8ClampedArray representing the RGBA image (4 channels)
      const image = new RawImage(rgbaData, width, height, 4);

      // Preprocess -> run model -> single-channel foreground probability map
      const { pixel_values } = await processor(image);
      const { output } = await model({ input: pixel_values });

      // Scale the [0, 1] mask to [0, 255] uint8 and resize back to source dims
      const maskImage = await RawImage.fromTensor(
        output[0].mul(255).to('uint8')
      ).resize(width, height);

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
      console.error('RMBG background removal error:', err);
      self.postMessage({ type: 'error', error: err.message });
    }
  }
};
