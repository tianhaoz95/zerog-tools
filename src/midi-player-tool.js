// ZeroG Toolbox — MIDI File Player & Piano-Roll Visualizer
// Parse .mid files, play via Web Audio API, render scrolling piano-roll visualization

export {}; // Make this a module so Vite includes it

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

let audioContext = null;
let midiData = null;
let isPlaying = false;
let currentNoteIndex = 0;
let animationFrameId = null;

// Piano roll display settings
const PIANO_ROLL_WIDTH = 800;
const PIANO_ROLL_HEIGHT = 400;
const NOTE_HEIGHT = 10; // pixels per semitone
const PIXELS_PER_SECOND = 50; // horizontal scroll speed

/* ------------------------------------------------------------------ */
/* DOM helpers                                                         */
/* ------------------------------------------------------------------ */

function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

function escHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ------------------------------------------------------------------ */
/* MIDI Parsing                                                        */
/* ------------------------------------------------------------------ */

class MidiParser {
  constructor() {
    this.tracks = [];
    this.ticksPerBeat = 0;
  }

  parse(arrayBuffer) {
    const view = new DataView(arrayBuffer);
    let offset = 0;

    // Read header chunk
    if (view.getString(4, false) !== 'MThd') throw new Error('Not a valid MIDI file');
    const headerLength = view.getUint32(offset + 4, true);
    const format = view.getUint16(offset + 8, true);
    const numTracks = view.getUint16(offset + 10, true);
    this.ticksPerBeat = view.getUint16(offset + 12, true);

    offset += headerLength + 8;

    // Read each track chunk
    for (let i = 0; i < numTracks; i++) {
      const chunkId = view.getString(4, false);
      if (chunkId !== 'MTrk') continue;

      const trackLength = view.getUint32(offset + 4, true);
      const trackData = this.readVariableLength(view, offset + 8);
      const trackOffset = offset + 8 + trackData.offset;

      const events = [];
      let time = 0;

      while (trackOffset < offset + 4 + trackLength) {
        const deltaTime = view.getUint32(trackOffset, true);
        time += deltaTime;
        trackOffset += 4;

        if (trackOffset >= arrayBuffer.byteLength) break;

        const statusByte = view.getUint8(trackOffset);

        if (statusByte === 0xFF) { // Meta event
          const metaType = view.getUint8(trackOffset + 1);
          const length = view.getUint32(trackOffset + 2, true);
          trackOffset += 4;

          if (metaType === 0x51) { // Tempo
            const tempo = (view.getUint8(trackOffset) << 16) |
                         (view.getUint8(trackOffset + 1) << 8) |
                          view.getUint8(trackOffset + 2);
            events.push({ type: 'tempo', time, tempo });
          }

          trackOffset += length;
        } else if (statusByte >= 0x80 && statusByte <= 0xEF) { // Note event
          const noteType = statusByte & 0xF0;
          const channel = statusByte & 0x0F;
          const note = view.getUint8(trackOffset + 1);
          const velocity = view.getUint8(trackOffset + 2);

          if (noteType === 0x90 && velocity > 0) { // Note On
            events.push({ type: 'noteOn', time, channel, note, velocity });
          } else if (noteType === 0x80 || (noteType === 0x90 && velocity === 0)) { // Note Off
            events.push({ type: 'noteOff', time, channel, note });
          }

          trackOffset += 3;
        } else {
          trackOffset++;
        }
      }

      this.tracks.push(events);
      offset = (offset + 4 + trackLength + 7) & ~0x01; // Align to even boundary
    }

    return this.tracks;
  }

  readVariableLength(view, offset) {
    let value = 0;
    let shift = 0;

    while (true) {
      const byte = view.getUint8(offset);
      offset++;
      value |= (byte & 0x7F) << shift;

      if (!(byte & 0x80)) break;
      shift += 7;
    }

    return { value, offset };
  }
}

// Helper to read string from DataView
DataView.prototype.getString = function(offset, littleEndian) {
  const bytes = [];
  while (true) {
    const byte = this.getUint8(offset);
    offset++;
    if (byte === 0) break;
    bytes.push(byte);
  }
  return String.fromCharCode(...bytes);
};

/* ------------------------------------------------------------------ */
/* Audio Playback                                                      */
/* ------------------------------------------------------------------ */

function initAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

function playMidiFile(tracks) {
  const ctx = initAudioContext();

  // Flatten all events and sort by time
  const allEvents = [];
  for (const track of tracks) {
    allEvents.push(...track);
  }
  allEvents.sort((a, b) => a.time - b.time);

  // Calculate total duration
  let maxTime = 0;
  for (const event of allEvents) {
    if (event.time > maxTime) maxTime = event.time;
  }

  // Schedule notes using Web Audio API
  const startTime = ctx.currentTime + 0.1;

  for (let i = 0; i < allEvents.length; i++) {
    const event = allEvents[i];
    const noteTime = startTime + (event.time / this.ticksPerBeat);

    if (event.type === 'noteOn') {
      playNote(ctx, event.note, event.velocity, noteTime);

      // Schedule note off after duration (approximate)
      setTimeout(() => {
        stopNote(ctx, event.note, noteTime + 0.3);
      }, (event.time / this.ticksPerBeat) * 1000);
    } else if (event.type === 'noteOff') {
      // Note off handled above for simplicity
    }
  }

  return maxTime;
}

function playNote(ctx, noteNumber, velocity, time) {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  // Convert MIDI note number to frequency (A4 = 440Hz)
  const frequency = 440 * Math.pow(2, (noteNumber - 69) / 12);

  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';

  // Velocity controls volume (0-127 mapped to 0-1)
  const gain = velocity / 127 * 0.3;
  gainNode.gain.setValueAtTime(0, time);
  gainNode.gain.linearRampToValueAtTime(gain, time + 0.01);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(time);
}

function stopNote(ctx, noteNumber, time) {
  // In a real implementation, we'd track active oscillators and fade them out
  // For now, this is a simplified version
}

/* ------------------------------------------------------------------ */
/* Piano Roll Visualization                                            */
/* ------------------------------------------------------------------ */

function renderPianoRoll(canvasId, tracks, currentTime = 0) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !tracks.length) return;

  const ctx = canvas.getContext('2d');

  // Clear canvas
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, PIANO_ROLL_WIDTH, PIANO_ROLL_HEIGHT);

  // Flatten all events and sort by time
  const allEvents = [];
  for (const track of tracks) {
    allEvents.push(...track.filter(e => e.type === 'noteOn' || e.type === 'noteOff'));
  }
  allEvents.sort((a, b) => a.time - b.time);

  // Calculate time range to display
  const visibleSeconds = PIANO_ROLL_WIDTH / PIXELS_PER_SECOND;
  const startTime = Math.max(0, currentTime - visibleSeconds / 2);
  const endTime = startTime + visibleSeconds;

  // Draw grid lines (time markers)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;

  for (let t = Math.floor(startTime); t <= endTime; t++) {
    const x = ((t - startTime) / visibleSeconds) * PIANO_ROLL_WIDTH;

    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, PIANO_ROLL_HEIGHT);
    ctx.stroke();

    // Time label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '10px monospace';
    ctx.fillText(`${t}s`, x + 2, PIANO_ROLL_HEIGHT - 5);
  }

  // Draw note rectangles
  for (const event of allEvents) {
    if (event.type !== 'noteOn') continue;

    const y = PIANO_ROLL_HEIGHT - ((event.note % 12) * NOTE_HEIGHT) - 50;
    const x = ((event.time / 1000 - startTime) / visibleSeconds) * PIANO_ROLL_WIDTH;

    // Color based on channel (pitch class)
    const hue = (event.channel * 30) % 360;
    ctx.fillStyle = `hsla(${hue}, 70%, 60%, 0.8)`;

    ctx.fillRect(x, y, PIXELS_PER_SECOND / 4, NOTE_HEIGHT - 1);

    // Note label for visible notes
    if (x > 10 && x < PIANO_ROLL_WIDTH - 30) {
      const noteName = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][event.note % 12];
      ctx.fillStyle = '#fff';
      ctx.font = '9px sans-serif';
      ctx.fillText(`${noteName}${Math.floor(event.note / 12)}`, x + 2, y - 2);
    }
  }

  // Draw current time indicator
  const currentTimeX = ((currentTime - startTime) / visibleSeconds) * PIANO_ROLL_WIDTH;
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(currentTimeX, 0);
  ctx.lineTo(currentTimeX, PIANO_ROLL_HEIGHT);
  ctx.stroke();

  // Draw piano keyboard on left side
  drawPianoKeyboard(ctx, tracks);
}

function drawPianoKeyboard(ctx, tracks) {
  const allNotes = new Set();
  for (const track of tracks) {
    for (const event of track) {
      if (event.type === 'noteOn') {
        allNotes.add(event.note);
      }
    }
  }

  const sortedNotes = Array.from(allNotes).sort((a, b) => a - b);
  const minNote = Math.max(0, sortedNotes[0] || 60);
  const maxNote = Math.min(127, (sortedNotes[sortedNotes.length - 1] || 84));

  for (let note = minNote; note <= maxNote; note++) {
    const y = PIANO_ROLL_HEIGHT - ((note % 12) * NOTE_HEIGHT) - 50;

    // White key background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, y, 40, NOTE_HEIGHT);

    // Black key for sharps/flats
    const isBlackKey = [1, 3, 6, 8, 10].includes(note % 12);
    if (isBlackKey) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(5, y, 30, NOTE_HEIGHT);
    }

    // Note label
    const noteName = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][note % 12];
    ctx.fillStyle = isBlackKey ? '#ffffff' : '#000000';
    ctx.font = '9px sans-serif';
    ctx.fillText(`${noteName}${Math.floor(note / 12)}`, 42, y + NOTE_HEIGHT - 3);
  }
}

/* ------------------------------------------------------------------ */
/* UI Rendering                                                        */
/* ------------------------------------------------------------------ */

function updateStatus(message, type) {
  const banner = document.getElementById('midi-status');
  if (!banner) return;

  banner.textContent = message;
  banner.style.display = 'block';
  banner.className = `midi-banner midi-banner--${type}`;
}

/* ------------------------------------------------------------------ */
/* Event Handlers                                                      */
/* ------------------------------------------------------------------ */

async function handleFileUpload() {
  const fileInput = document.getElementById('midi-file-input');
  const fileNameDisplay = $('#midi-filename-display');

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    fileNameDisplay.textContent = `Selected: ${escHtml(file.name)} (${(file.size / 1024).toFixed(1)} KB)`;

    try {
      updateStatus('Parsing MIDI file...', 'info');

      const arrayBuffer = await file.arrayBuffer();
      const parser = new MidiParser();
      midiData = parser.parse(arrayBuffer);

      if (midiData.length === 0) {
        updateStatus('No valid MIDI tracks found in file.', 'error');
        return;
      }

      // Render initial piano roll
      renderPianoRoll('piano-roll-canvas', midiData.tracks, 0);

      updateStatus(`MIDI loaded: ${midiData.tracks.length} track(s), ${parser.ticksPerBeat} ticks/beat`, 'success');
    } catch (err) {
      console.error('MIDI parse error:', err);
      updateStatus(`Failed to parse MIDI file: ${err.message}`, 'error');
    }
  } else {
    fileNameDisplay.textContent = 'No file selected';
  }
}

function handlePlay() {
  if (!midiData || !midiData.tracks.length) {
    updateStatus('Please load a MIDI file first.', 'warning');
    return;
  }

  if (isPlaying) {
    stopPlayback();
    return;
  }

  isPlaying = true;
  const btnPlay = document.getElementById('btn-midi-play');
  if (btnPlay) {
    btnPlay.textContent = '⏹ Stop';
  }

  // Calculate total duration in seconds
  let maxTime = 0;
  for (const track of midiData.tracks) {
    for (const event of track) {
      if (event.time > maxTime) maxTime = event.time;
    }
  }
  const totalDuration = (maxTime / midiData.ticksPerBeat);

  // Start playback and animation
  playMidiFile(midiData.tracks);

  let currentTime = 0;
  function animate() {
    if (!isPlaying) return;

    currentTime += 1/60; // Assume 60fps

    if (currentTime >= totalDuration) {
      stopPlayback();
      return;
    }

    renderPianoRoll('piano-roll-canvas', midiData.tracks, currentTime);

    animationFrameId = requestAnimationFrame(animate);
  }

  animate();
}

function stopPlayback() {
  isPlaying = false;

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  const btnPlay = document.getElementById('btn-midi-play');
  if (btnPlay) {
    btnPlay.textContent = '▶ Play';
  }
}

/* ------------------------------------------------------------------ */
/* Reset State                                                         */
/* ------------------------------------------------------------------ */

function resetMidiPlayerState() {
  isPlaying = false;
  midiData = null;

  // Clear file input
  const fileInput = document.getElementById('midi-file-input');
  if (fileInput) fileInput.value = '';

  // Clear filename display
  const fileNameDisplay = $('#midi-filename-display');
  if (fileNameDisplay) fileNameDisplay.textContent = 'No file selected';

  // Clear piano roll canvas
  const canvas = document.getElementById('piano-roll-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, PIANO_ROLL_WIDTH, PIANO_ROLL_HEIGHT);
  }

  // Clear status banner
  const statusBanner = document.getElementById('midi-status');
  if (statusBanner) {
    statusBanner.style.display = 'none';
    statusBanner.textContent = '';
  }

  // Reset play button
  const btnPlay = document.getElementById('btn-midi-play');
  if (btnPlay) btnPlay.textContent = '▶ Play';
}

/* ------------------------------------------------------------------ */
/* Event Wiring                                                        */
/* ------------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
  // File upload handler
  const fileInput = document.getElementById('midi-file-input');
  if (fileInput) {
    fileInput.addEventListener('change', handleFileUpload);
  }

  // Play/Stop button
  const btnPlay = document.getElementById('btn-midi-play');
  if (btnPlay) {
    btnPlay.addEventListener('click', handlePlay);
  }

  // Back button
  const btnBack = document.getElementById('btn-midi-player-back');
  if (btnBack) {
    btnBack.addEventListener('click', () => navigateTo('home'));
  }

  // Initial state
  resetMidiPlayerState();
});

// Expose for navigation integration
window.resetMidiPlayerState = resetMidiPlayerState;