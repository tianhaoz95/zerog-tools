// ZeroG Toolbox — Silence Remover Worker
// Detects silent gaps in audio and removes them automatically

self.onmessage = async (e) => {
  const { type, data } = e.data;

  if (type === 'process') {
    try {
      self.postMessage({ type: 'status', message: 'Analyzing audio...' });

      const { audioBuffer, options } = data;

      // Convert Float32Array to AudioBuffer for processing
      const sampleRate = options.sampleRate || 44100;
      const length = audioBuffer.length || (options.audioLength || 0);

      const inputBuffer = new OfflineAudioContext(1, length, sampleRate);
      const channelData = inputBuffer.getChannelData(0);

      // Copy audio data
      for (let i = 0; i < Math.min(channelData.length, audioBuffer.length || options.audioLength); i++) {
        channelData[i] = (audioBuffer instanceof Float32Array ? audioBuffer : new Float32Array(audioBuffer))[i];
      }

      // Detect silence regions
      self.postMessage({ type: 'status', message: 'Detecting silent gaps...' });
      const silenceRegions = detectSilence(channelData, sampleRate, options.silenceThreshold || -40, options.minSilenceDuration || 0.5);

      self.postMessage({
        type: 'progress',
        data: { totalRegions: silenceRegions.length, message: `Found ${silenceRegions.length} silent regions` }
      });

      // Remove detected silence
      self.postMessage({ type: 'status', message: 'Removing silence...' });
      const cleanedAudio = removeSilence(channelData, sampleRate, silenceRegions);

      self.postMessage({
        type: 'result',
        data: { audio: cleanedAudio, sampleRate: sampleRate },
        message: `Removed ${silenceRegions.length} silent regions. Audio shortened from ${(length / sampleRate).toFixed(1)}s to ${((cleanedAudio.length / sampleRate)).toFixed(1)}s`
      });

    } catch (err) {
      console.error('Silence remover error:', err);
      self.postMessage({ type: 'error', error: err.message });
    }
  }

  else if (type === 'cancel') {
    self.postMessage({ type: 'status', message: 'Cancelled' });
  }
};

// Detect silent regions in audio buffer
function detectSilence(buffer, sampleRate, thresholddB, minDuration) {
  const silenceRegions = [];
  let inSilence = false;
  let silenceStart = 0;

  // Convert dB threshold to linear scale
  const thresholdLinear = Math.pow(10, thresholddB / 20);
  const samplesPerSecond = sampleRate;
  const minSamples = Math.floor(minDuration * samplesPerSecond);

  for (let i = 0; i < buffer.length; i++) {
    const amplitude = Math.abs(buffer[i]);

    if (amplitude < thresholdLinear) {
      // Below threshold - could be silence
      if (!inSilence) {
        inSilence = true;
        silenceStart = i;
      }
    } else {
      // Above threshold - sound detected
      if (inSilence) {
        const silenceDuration = (i - silenceStart) / sampleRate;

        // Only count as silence region if it meets minimum duration
        if (silenceDuration >= minDuration) {
          silenceRegions.push({
            start: silenceStart,
            end: i,
            duration: silenceDuration
          });
        }

        inSilence = false;
      }
    }
  }

  // Handle trailing silence
  if (inSilence && buffer.length > 0) {
    const silenceDuration = (buffer.length - silenceStart) / sampleRate;
    if (silenceDuration >= minDuration) {
      silenceRegions.push({
        start: silenceStart,
        end: buffer.length,
        duration: silenceDuration
      });
    }
  }

  return silenceRegions;
}

// Remove silent regions from audio buffer
function removeSilence(buffer, sampleRate, silenceRegions) {
  if (silenceRegions.length === 0) {
    // No silence to remove, return original buffer
    return new Float32Array(buffer);
  }

  // Calculate total silence duration and create output array
  let totalSilenceSamples = 0;
  for (const region of silenceRegions) {
    totalSilenceSamples += (region.end - region.start);
  }

  const outputLength = buffer.length - totalSilenceSamples;
  const outputBuffer = new Float32Array(outputLength);

  let writePos = 0;
  let readPos = 0;

  // Copy non-silent regions
  for (let i = 0; i < silenceRegions.length && writePos < outputLength; i++) {
    const region = silenceRegions[i];

    // Copy audio before this silence region
    if (readPos < region.start) {
      const copyLength = Math.min(region.start - readPos, outputLength - writePos);
      for (let j = 0; j < copyLength; j++) {
        outputBuffer[writePos + j] = buffer[readPos + j];
      }
      writePos += copyLength;
    }

    // Skip silence region
    readPos = region.end;
  }

  // Copy remaining audio after last silence region
  if (readPos < buffer.length && writePos < outputLength) {
    const copyLength = Math.min(buffer.length - readPos, outputLength - writePos);
    for (let j = 0; j < copyLength; j++) {
      outputBuffer[writePos + j] = buffer[readPos + j];
    }
  }

  return outputBuffer;
}