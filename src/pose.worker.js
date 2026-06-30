import { AutoModel, AutoImageProcessor, RawImage, env } from '@huggingface/transformers';

// Disable local model fallback to use CDN weights only
env.allowLocalModels = false;

const MODEL_ID = 'onnx-community/vitpose-base-simple';

let model = null;
let processor = null;

// COCO-17 skeleton connections for drawing limbs
const SKELETON = [
  [15, 13], [13, 11], [16, 14], [14, 12], // legs lower
  [11, 12],                                 // hips
  [5, 11],  [6, 12],                        // torso sides
  [5, 6],                                   // shoulders
  [5, 7],   [6, 8],                         // upper arms
  [7, 9],   [8, 10],                        // lower arms
  [1, 2],                                   // eyes
  [0, 1],   [0, 2],                         // nose-eyes
  [1, 3],   [2, 4],                         // eyes-ears
  [3, 5],   [4, 6],                         // ears-shoulders
];

// Colors per body part for visual clarity
const KEYPOINT_COLORS = [
  '#FF3366', // 0 nose
  '#FF6633', // 1 left eye
  '#FF9933', // 2 right eye
  '#FFCC33', // 3 left ear
  '#FFFF33', // 4 right ear
  '#33FF66', // 5 left shoulder
  '#33FFCC', // 6 right shoulder
  '#33CCFF', // 7 left elbow
  '#3366FF', // 8 right elbow
  '#6633FF', // 9 left wrist
  '#CC33FF', // 10 right wrist
  '#FF33CC', // 11 left hip
  '#FF3399', // 12 right hip
  '#FF6699', // 13 left knee
  '#FF99CC', // 14 right knee
  '#FFCCFF', // 15 left ankle
  '#FFFFFF', // 16 right ankle
];

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
      console.error('Failed to load VitPose model in worker:', err);
      self.postMessage({ type: 'status', data: 'error', error: err.message });
    }
  }

  else if (type === 'estimate_pose') {
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
      // box = [x_min, y_min, width, height] for the full frame
      const boxes = [[[0, 0, width, height]]];
      const results = processor.post_process_pose_estimation(heatmaps, boxes, {
        threshold: 0.1,
      });

      const poseResult = results[0][0]; // batch[0], person[0]

      // Build a structured pose payload the main thread will use to draw
      const keypoints = poseResult ? poseResult.keypoints : [];
      const scores   = poseResult ? poseResult.scores    : [];

      self.postMessage({
        type: 'pose_result',
        data: {
          keypoints,   // Array of [x, y]
          scores,      // Array of floats
          skeleton: SKELETON,
          colors:   KEYPOINT_COLORS,
          frameWidth:  width,
          frameHeight: height,
        },
      });
    } catch (err) {
      console.error('VitPose inference error:', err);
      self.postMessage({ type: 'error', error: err.message });
    }
  }
};
