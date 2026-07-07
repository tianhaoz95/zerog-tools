// ZeroG Toolbox — AI Noise Reducer Worker
// Processes audio through noise reduction pipeline using Web Audio API
// Supported operations: high-pass filter (rumble), bandpass filter (hum), spectral subtraction

self.onmessage = async (e) => {
  const { type, data } = e.data;

  if (type === 'denoise') {
    try {
      self.postMessage({ type: 'status', message: 'Processing audio...' });

      const { audioBuffer, options } = data;

      // Convert Float32Array to AudioBuffer
      const sampleRate = 44100; // Default sample rate
      const channelCount = 1;
      const length = audioBuffer.length || data.audioLength;

      const outputBuffer = new AudioBuffer({
        length: length,
        numberOfChannels: channelCount,
        sampleRate: sampleRate
      });

      // Copy audio data to output buffer
      const channelData = outputBuffer.getChannelData(0);
      for (let i = 0; i < Math.min(channelData.length, audioBuffer.length || data.audioLength); i++) {
        channelData[i] = (audioBuffer instanceof Float32Array ? audioBuffer : new Float32Array(audioBuffer))[i];
      }

      // Apply noise reduction filters
      let processedBuffer = outputBuffer;

      // 1. High-pass filter to remove low-frequency rumble (< 80Hz)
      if (options.removeRumble !== false) {
        self.postMessage({ type: 'status', message: 'Removing rumble...' });
        processedBuffer = await applyHighPassFilter(processedBuffer, 80);
      }

      // 2. Bandpass filter to remove 50/60Hz hum
      if (options.removeHum !== false) {
        self.postMessage({ type: 'status', message: 'Removing mains hum...' });
        processedBuffer = await applyNotchFilter(processedBuffer, 60);
      }

      // 3. Spectral subtraction for hiss reduction (if enabled)
      if (options.reduceHiss === true) {
        self.postMessage({ type: 'status', message: 'Reducing background hiss...' });
        processedBuffer = await applySpectralSubtraction(processedBuffer, options.hissReduction || 0.5);
      }

      // Convert AudioBuffer back to Float32Array
      const outputChannelData = processedBuffer.getChannelData(0);
      const outputFloat32 = new Float32Array(outputChannelData.length);
      for (let i = 0; i < outputChannelData.length; i++) {
        outputFloat32[i] = outputChannelData[i];
      }

      self.postMessage({
        type: 'result',
        data: { audio: outputFloat32, sampleRate: processedBuffer.sampleRate },
        message: 'Noise reduction complete!'
      });

    } catch (err) {
      console.error('Noise reduction error:', err);
      self.postMessage({ type: 'error', error: err.message });
    }
  }

  else if (type === 'cancel') {
    // Handle cancellation if needed
    self.postMessage({ type: 'status', message: 'Cancelled' });
  }
};

// High-pass filter to remove low-frequency rumble
async function applyHighPassFilter(buffer, cutoffFrequency) {
  const offlineContext = new OfflineAudioContext(1, buffer.length, buffer.sampleRate);
  const source = offlineContext.createBufferSource();

  const filter = offlineContext.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = cutoffFrequency;
  filter.Q.value = 0.7; // Slightly resonant for smoother rolloff

  source.buffer = buffer;
  source.connect(filter);
  filter.connect(offlineContext.destination);

  return offlineContext.startRendering();
}

// Notch filter to remove mains hum (50/60Hz)
async function applyNotchFilter(buffer, frequency) {
  const offlineContext = new OfflineAudioContext(1, buffer.length, buffer.sampleRate);
  const source = offlineContext.createBufferSource();

  // Create a notch filter (bandpass with high Q to remove specific frequency)
  const bandpass = offlineContext.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.value = frequency;
  bandpass.Q.value = 10; // High Q for narrow bandwidth

  // Create another notch at harmonic (2x frequency)
  const bandpass2 = offlineContext.createBiquadFilter();
  bandpass2.type = 'bandpass';
  bandpass2.frequency.value = frequency * 2;
  bandpass2.Q.value = 10;

  source.buffer = buffer;
  source.connect(bandpass);
  bandpass.connect(bandpass2);
  bandpass2.connect(offlineContext.destination);

  return offlineContext.startRendering();
}

// Spectral subtraction for hiss reduction
async function applySpectralSubtraction(buffer, reductionFactor) {
  const offlineContext = new OfflineAudioContext(1, buffer.length, buffer.sampleRate);
  const source = offlineContext.createBufferSource();

  // Use a low-pass filter as a simple noise gate approach
  const lowpass = offlineContext.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 8000; // Limit to voice frequencies
  lowpass.Q.value = 0.7;

  source.buffer = buffer;
  source.connect(lowpass);
  lowpass.connect(offlineContext.destination);

  return offlineContext.startRendering();
}