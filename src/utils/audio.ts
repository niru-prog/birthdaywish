/**
 * Web Audio API synthesizer for the birthday tune and playful sound effects.
 * No external audio files are required.
 */

// Shared audio context singleton
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

interface NoteItem {
  freq: number;
  duration: number; // in beats
  bassFreq?: number;
}

// Melody of "Happy Birthday to you" (Key of C)
const MELODY: NoteItem[] = [
  { freq: 392.00, duration: 0.75, bassFreq: 130.81 }, // G4, C3
  { freq: 392.00, duration: 0.25 },                  // G4
  { freq: 440.00, duration: 1.0 },                   // A4
  { freq: 392.00, duration: 1.0 },                   // G4
  { freq: 523.25, duration: 1.0, bassFreq: 196.00 }, // C5, G3
  { freq: 493.88, duration: 2.0 },                   // B4

  { freq: 392.00, duration: 0.75, bassFreq: 196.00 }, // G4, G3
  { freq: 392.00, duration: 0.25 },                  // G4
  { freq: 440.00, duration: 1.0 },                   // A4
  { freq: 392.00, duration: 1.0 },                   // G4
  { freq: 587.33, duration: 1.0, bassFreq: 130.81 }, // D5, C3
  { freq: 523.25, duration: 2.0 },                   // C5

  { freq: 392.00, duration: 0.75, bassFreq: 130.81 }, // G4, C3
  { freq: 392.00, duration: 0.25 },                  // G4
  { freq: 783.99, duration: 1.0, bassFreq: 174.61 }, // G5, F3
  { freq: 659.25, duration: 1.0 },                   // E5
  { freq: 523.25, duration: 1.0, bassFreq: 130.81 }, // C5, C3
  { freq: 493.88, duration: 1.0 },                   // B4
  { freq: 440.00, duration: 2.0, bassFreq: 174.61 }, // A4, F3

  { freq: 698.46, duration: 0.75, bassFreq: 174.61 }, // F5, F3
  { freq: 698.46, duration: 0.25 },                  // F5
  { freq: 659.25, duration: 1.0, bassFreq: 130.81 }, // E5, C3
  { freq: 523.25, duration: 1.0 },                   // C5
  { freq: 587.33, duration: 1.0, bassFreq: 196.00 }, // D5, G3
  { freq: 523.25, duration: 2.5, bassFreq: 130.81 }, // C5, C3
];

let activeMusicStop: (() => void) | null = null;

/**
 * Plays the soft music-box / electric piano style "Happy Birthday" tune on loop.
 * Returns a controller with stop() and isPlaying().
 */
export function playHappyBirthdaySong(onEndCycle?: () => void): { stop: () => void } {
  // If already playing, stop previous instance
  if (activeMusicStop) {
    activeMusicStop();
    activeMusicStop = null;
  }

  const ctx = getAudioContext();
  if (!ctx) return { stop: () => {} };

  let isCancelled = false;
  let scheduledNodes: (OscillatorNode | GainNode)[] = [];
  let loopTimeout: number | null = null;

  const secondsPerBeat = 0.55; // Gentle upbeat tempo (~110 bpm)

  const scheduleRound = () => {
    if (isCancelled) return;

    const startTime = ctx.currentTime + 0.05;
    let currentBeat = 0;

    MELODY.forEach((note) => {
      if (isCancelled) return;

      const noteTime = startTime + currentBeat * secondsPerBeat;
      const noteDuration = note.duration * secondsPerBeat;

      // Primary warm chime oscillator
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc2.type = 'triangle';

      osc.frequency.setValueAtTime(note.freq, noteTime);
      osc2.frequency.setValueAtTime(note.freq * 2, noteTime); // subtle octave harmonic

      // Envelope: snappy attack, soft decay
      gain.gain.setValueAtTime(0.0001, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.22, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + noteDuration + 0.2);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc2.start(noteTime);
      osc.stop(noteTime + noteDuration + 0.25);
      osc2.stop(noteTime + noteDuration + 0.25);

      scheduledNodes.push(osc, osc2, gain);

      // Warm bass support
      if (note.bassFreq) {
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(note.bassFreq, noteTime);

        bassGain.gain.setValueAtTime(0.0001, noteTime);
        bassGain.gain.exponentialRampToValueAtTime(0.12, noteTime + 0.03);
        bassGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + noteDuration * 1.2);

        bassOsc.connect(bassGain);
        bassGain.connect(ctx.destination);

        bassOsc.start(noteTime);
        bassOsc.stop(noteTime + noteDuration * 1.25);
        scheduledNodes.push(bassOsc, bassGain);
      }

      currentBeat += note.duration;
    });

    const totalDurationSeconds = (currentBeat * secondsPerBeat + 1.2) * 1000;

    loopTimeout = window.setTimeout(() => {
      if (!isCancelled) {
        if (onEndCycle) onEndCycle();
        scheduleRound();
      }
    }, totalDurationSeconds);
  };

  scheduleRound();

  const stop = () => {
    isCancelled = true;
    if (loopTimeout !== null) {
      clearTimeout(loopTimeout);
      loopTimeout = null;
    }
    scheduledNodes.forEach((node) => {
      try {
        if ('stop' in node && typeof node.stop === 'function') {
          node.stop();
        }
        node.disconnect();
      } catch {
        // Node might have already finished
      }
    });
    scheduledNodes = [];
    if (activeMusicStop === stop) {
      activeMusicStop = null;
    }
  };

  activeMusicStop = stop;
  return { stop };
}

export function stopHappyBirthdaySong() {
  if (activeMusicStop) {
    activeMusicStop();
    activeMusicStop = null;
  }
}

/**
 * Balloon pop sound: fast frequency chirp + white noise burst
 */
export function playPopSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Pitch sweep pop
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(450, now);
  osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

  oscGain.gain.setValueAtTime(0.4, now);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

  osc.connect(oscGain);
  oscGain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.09);

  // Short noise burst for realistic balloon latex snap
  const bufferSize = ctx.sampleRate * 0.04;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.setValueAtTime(1000, now);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.2, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + 0.05);
}

/**
 * Candle blow-out sound: soft breath / air whoosh
 */
export function playBlowSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const duration = 0.35;
  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.5;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(800, now);
  filter.frequency.exponentialRampToValueAtTime(300, now + duration);
  filter.Q.value = 2.0;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.25, now + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + duration);
}

/**
 * Envelope opening sound: gentle paper slide + magic sparkle
 */
export function playEnvelopeOpenSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + idx * 0.08);

    gain.gain.setValueAtTime(0.001, now + idx * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.08);
    osc.stop(now + idx * 0.08 + 0.38);
  });
}

/**
 * Grand celebration chime when all candles are blown out
 */
export function playCelebrationChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const arpeggio = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51, 1567.98];

  arpeggio.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.09);

    gain.gain.setValueAtTime(0.001, now + idx * 0.09);
    gain.gain.exponentialRampToValueAtTime(0.24, now + idx * 0.09 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.09);
    osc.stop(now + idx * 0.09 + 0.65);
  });
}
