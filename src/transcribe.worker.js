import { pipeline, env } from '@huggingface/transformers';

// Disable local models fallback
env.allowLocalModels = false;

let transcriber = null;

self.onmessage = async (e) => {
  const { type, data } = e.data;

  if (type === 'init') {
    try {
      self.postMessage({ type: 'status', data: 'loading', progress: 0 });

      // Load Whisper Tiny English model
      transcriber = await pipeline('automatic-speech-recognition', 'onnx-community/whisper-tiny.en', {
        dtype: 'fp32',
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

      self.postMessage({ type: 'status', data: 'ready' });
    } catch (err) {
      console.error('Failed to load Whisper model in worker:', err);
      self.postMessage({ type: 'status', data: 'error', error: err.message });
    }
  }

  else if (type === 'transcribe') {
    if (!transcriber) {
      self.postMessage({ type: 'error', error: 'Transcriber not initialized' });
      return;
    }

    try {
      const { audioData } = data; // Float32Array at 16kHz
      
      // Convert Array back to Float32Array
      const audioFloatArray = new Float32Array(audioData);
      
      console.log('Starting Whisper local transcription...');
      const output = await transcriber(audioFloatArray, {
        chunk_length_s: 30,
        stride_length_s: 5,
        return_timestamps: false
      });

      self.postMessage({ type: 'transcribe_result', data: output.text });
    } catch (err) {
      console.error('Transcription failed:', err);
      self.postMessage({ type: 'error', error: err.message });
    }
  }
};
