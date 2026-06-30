import { pipeline, env, TextStreamer } from '@huggingface/transformers';

// Disable local models fallback
env.allowLocalModels = false;

let generator = null;

self.onmessage = async (e) => {
  const { type, data } = e.data;

  if (type === 'init') {
    try {
      self.postMessage({ type: 'status', data: 'loading', progress: 0 });

      const progress_callback = (progressData) => {
        if (progressData.status === 'progress') {
          self.postMessage({
            type: 'status',
            data: 'loading',
            progress: progressData.progress,
            file: progressData.file
          });
        }
      };

      // Try running with WebGPU first, fallback to CPU (WASM) if it fails
      try {
        console.log('Attempting to load Qwen2.5-0.5B model with WebGPU and q4 precision...');
        generator = await pipeline('text-generation', 'onnx-community/Qwen2.5-0.5B-Instruct', {
          device: 'webgpu',
          dtype: 'q4', // Quantized to 4-bit to prevent memory allocation (std::bad_alloc) errors
          progress_callback
        });
        console.log('Successfully loaded model with WebGPU.');
      } catch (gpuError) {
        console.warn('WebGPU failed or unsupported, falling back to CPU (WASM):', gpuError);
        generator = await pipeline('text-generation', 'onnx-community/Qwen2.5-0.5B-Instruct', {
          device: 'wasm', // Correct device name for CPU inference in transformers.js v3 is 'wasm' (not 'cpu')
          dtype: 'q4', // Quantized to 4-bit for fast CPU execution
          progress_callback
        });
        console.log('Successfully loaded model with CPU (WASM).');
      }

      self.postMessage({ type: 'status', data: 'ready' });
    } catch (err) {
      console.error('Failed to load generator model in worker:', err);
      self.postMessage({ type: 'status', data: 'error', error: err.message });
    }
  }

  else if (type === 'warmup') {
    // Pre-pay the expensive one-time costs (shader/kernel compilation + prefill of
    // the long system prompt) in the background right after load, so the user's
    // FIRST real question streams back quickly instead of stalling. Runs the real
    // system prompt through a 1-token generation; tokens are not streamed to the UI.
    if (!generator) return;
    try {
      await generator(data.messages, { max_new_tokens: 1, do_sample: false });
      self.postMessage({ type: 'warmup-done' });
    } catch (err) {
      // Warm-up is best-effort; a failure here must not break normal chat.
      console.warn('Chat warm-up failed (non-fatal):', err);
    }
  }

  else if (type === 'generate') {
    if (!generator) {
      self.postMessage({ type: 'error', error: 'Model not initialized' });
      return;
    }

    try {
      const { messages, max_new_tokens = 250 } = data;

      // TextStreamer calls callback for each new token
      const streamer = new TextStreamer(generator.tokenizer, {
        callback: (text) => {
          // Send tokens as they generate to allow typing animation in UI
          self.postMessage({ type: 'token', data: text });
        },
        skip_prompt: true,
      });

      // Run generator
      const output = await generator(messages, {
        max_new_tokens,
        temperature: 0.6,
        do_sample: true,
        top_k: 50,
        streamer: streamer
      });

      const responseText = output[0].generated_text;
      
      // Parse output format
      let finalResponse = '';
      if (Array.isArray(responseText)) {
        finalResponse = responseText[responseText.length - 1].content;
      } else if (typeof responseText === 'string') {
        finalResponse = responseText;
      }

      self.postMessage({ type: 'done', data: finalResponse });
    } catch (err) {
      console.error('Generation failed:', err);
      self.postMessage({ type: 'error', error: err.message });
    }
  }
};
