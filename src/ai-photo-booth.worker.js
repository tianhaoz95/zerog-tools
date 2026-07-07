import { AutoModel, AutoImageProcessor, RawImage, env } from '@huggingface/transformers';

// Disable local model fallback to use CDN weights only
env.allowLocalModels = false;

const MODEL_ID = 'onnx-community/vitpose-base-simple';

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
            file: progressData.file,
          });
        }
      };

      processor = await AutoImageProcessor.from_pretrained(MODEL_ID, {
        progress_callback: progressCallback,
      });
      model = await AutoModel.from_pretrained(MODEL_ID, {
        progress_callback: progressCallback,
      });

      self.postMessage({ type: 'status', data: 'ready' });
    } catch (err) {
      console.error('Failed to load VitPose model in photo booth worker:', err);
      self.postMessage({ type: 'status', data: 'error', error: err.message });
    }
  }

  else if (type === 'estimate') {
    if (!model || !processor) {
      self.postMessage({ type: 'error', error: 'Model not initialized' });
      return;
    }

    try {
      const { width, height, rgbaData } = data;

      // Build a RawImage from raw RGBA pixel data
      const rawImage = new RawImage(new Uint8ClampedArray(rgbaData), width, height, 4);

      // Process through the model
      const inputs = await processor(rawImage);
      const { heatmaps } = await model(inputs);

      // Post-process heatmaps → [x, y] keypoints in image-pixel space
      const boxes = [[[0, 0, width, height]]];
      const results = processor.post_process_pose_estimation(heatmaps, boxes, {
        threshold: 0.1,
      });

      const poseResult = results[0]?.[0]; // batch[0], person[0]

      // Build a structured pose payload the main thread will use to map decorations
      const keypoints = poseResult ? poseResult.keypoints : [];
      const scores    = poseResult ? poseResult.scores    : [];

      self.postMessage({
        type: 'pose_result',
        data: {
          keypoints,   // Array of [x, y] in pixel coordinates (0-1 normalized)
          scores,      // Array of floats (confidence per keypoint)
          frameWidth:  width,
          frameHeight: height,
        },
      });
    } catch (err) {
      console.error('VitPose inference error in photo booth:', err);
      self.postMessage({ type: 'error', error: err.message });
    }
  }

  else if (type === 'stop') {
    // No-op cleanup; model stays loaded for reuse within session
    self.postMessage({ type: 'status', data: 'ready' });
  }
};
