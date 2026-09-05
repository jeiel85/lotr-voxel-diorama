/**
 * Middle-earth Procedural Audio Synthesizer (Web Audio API)
 * Generates thematic atmospheric music and soundscapes dynamically with zero external asset dependencies.
 */
export class AudioManager {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.currentScene = 'shire';
    this.masterGain = null;
    this.timer = null;
    this.droneNodes = [];
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  toggle() {
    if (!this.ctx) this.init();

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = !this.isPlaying;

    if (this.isPlaying) {
      this.masterGain.gain.exponentialRampToValueAtTime(0.35, this.ctx.currentTime + 1.5);
      this.startTheme(this.currentScene);
    } else {
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.0);
      setTimeout(() => this.stopAllNodes(), 1100);
    }

    return this.isPlaying;
  }

  setScene(sceneName) {
    this.currentScene = sceneName;
    if (this.isPlaying) {
      // Fade out old, start new
      this.stopAllNodes();
      this.startTheme(sceneName);
    }
  }

  stopAllNodes() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.droneNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch (e) {}
    });
    this.droneNodes = [];
  }

  startTheme(scene) {
    if (!this.ctx || !this.isPlaying) return;

    if (scene === 'shire') {
      this.playShireAtmosphere();
    } else if (scene === 'mordor') {
      this.playMordorAtmosphere();
    } else if (scene === 'argonath') {
      this.playArgonathAtmosphere();
    }
  }

  // --- 1. THE SHIRE (Peaceful flute melody, harp chords, gentle breeze) ---
  playShireAtmosphere() {
    // Gentle warm acoustic drone chord (D major / G major)
    const freqs = [146.83, 220.0, 293.66]; // D3, A3, D4
    freqs.forEach(f => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      this.droneNodes.push(osc, gain);
    });

    // Procedural Shire Celtic Flute / Harp melody generator
    // Pentatonic notes: D4, E4, F#4, A4, B4, D5, E5
    const melodyScale = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33, 659.25];
    let noteIndex = 0;

    this.timer = setInterval(() => {
      if (!this.isPlaying || !this.ctx) return;

      const now = this.ctx.currentTime;
      const noteFreq = melodyScale[Math.floor(Math.random() * melodyScale.length)];

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();
      const vibrato = this.ctx.createOscillator();
      const vibGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(noteFreq, now);

      // Flute vibrato
      vibrato.frequency.setValueAtTime(5.5, now);
      vibGain.gain.setValueAtTime(3.5, now);
      vibrato.connect(osc.frequency);

      // Soft envelope
      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.linearRampToValueAtTime(0.07, now + 0.3);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      osc.connect(noteGain);
      noteGain.connect(this.masterGain);

      vibrato.start(now);
      osc.start(now);
      osc.stop(now + 2.0);
      vibrato.stop(now + 2.0);
    }, 2200);
  }

  // --- 2. MORDOR (Menacing dark sub drone, rumbling lava bubbles) ---
  playMordorAtmosphere() {
    // Low sinister detuned drone (C2 & C#2 for dark tension)
    [65.41, 69.30, 98.00].forEach(f => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(160, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      this.droneNodes.push(osc, gain);
    });

    // Volcanic lava bubbling pops & rumbling fire
    this.timer = setInterval(() => {
      if (!this.isPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Pitch drop representing bubble bursting
      osc.frequency.setValueAtTime(180 + Math.random() * 80, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.4);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.45);
    }, 600);
  }

  // --- 3. ARGONATH (Majestic royal horn brass chords, flowing river rush) ---
  playArgonathAtmosphere() {
    // Reverberant Horn Pad (E minor / G major royal chord)
    [164.81, 196.00, 246.94, 329.63].forEach(f => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.035, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      this.droneNodes.push(osc, gain);
    });

    // River rushing water noise
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const waterFilter = this.ctx.createBiquadFilter();
    waterFilter.type = 'bandpass';
    waterFilter.frequency.setValueAtTime(320, this.ctx.currentTime);
    waterFilter.Q.setValueAtTime(0.8, this.ctx.currentTime);

    const waterGain = this.ctx.createGain();
    waterGain.gain.setValueAtTime(0.05, this.ctx.currentTime);

    whiteNoise.connect(waterFilter);
    waterFilter.connect(waterGain);
    waterGain.connect(this.masterGain);

    whiteNoise.start();
    this.droneNodes.push(whiteNoise, waterGain);
  }
}
