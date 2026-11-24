/**
 * AssoMultiplayer TGS 2026 - Pro Stage Sound Engine (100% Offline WebAudio Synthesis)
 * Rich multi-oscillator, filtered & enveloped game-show sound effects.
 */
class StageSoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.volume = 0.85;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  play(soundId, overrideVolume = null) {
    this.init();
    if (overrideVolume !== null) this.setVolume(overrideVolume);
    const t = this.ctx.currentTime;

    switch (soundId) {
      case 'buzzer': this._buzzer(t); break;
      case 'correct': this._correct(t); break;
      case 'fanfare': this._fanfare(t); break;
      case 'drumroll': this._drumroll(t); break;
      case 'airhorn': this._airhorn(t); break;
      case 'suspense': this._suspense(t); break;
      case 'coin': this._coin(t); break;
      case 'applause': this._applause(t); break;
      case 'tick': this._tick(t, 880, 0.06); break;
      case 'tick_urgent': this._tick(t, 1320, 0.09); break;
    }
  }

  // 1. Heavy TV Game Show Buzzer (Dual detuned sawtooth + lowpass punch)
  _buzzer(t) {
    const freqs = [92, 96.5, 138];
    freqs.forEach(f => {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, t);
      osc.frequency.linearRampToValueAtTime(f * 0.88, t + 0.65);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, t);
      filter.frequency.exponentialRampToValueAtTime(280, t + 0.65);

      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.32, t + 0.02);
      gain.gain.setValueAtTime(0.32, t + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.68);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.7);
    });
  }

  // 2. Sparkling Correct Answer Chime (Harmonic Bell Arpeggio + Shimmer)
  _correct(t) {
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5 E5 G5 C6 E6
    notes.forEach((freq, i) => {
      const start = t + i * 0.065;
      // Fundamental
      const osc1 = this.ctx.createOscillator();
      // Overtone bell
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(freq, start);
      osc2.frequency.setValueAtTime(freq * 2, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.28, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.55);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(start);
      osc2.start(start);
      osc1.stop(start + 0.6);
      osc2.stop(start + 0.6);
    });
  }

  // 3. Epic Brass Victory Fanfare (Ta-da-da-DAAA!)
  _fanfare(t) {
    const sequence = [
      { f: 523.25, s: 0.00, d: 0.14 }, // C5
      { f: 523.25, s: 0.16, d: 0.14 }, // C5
      { f: 523.25, s: 0.32, d: 0.14 }, // C5
      { f: 659.25, s: 0.48, d: 0.22 }, // E5
      { f: 587.33, s: 0.72, d: 0.18 }, // D5
      { f: 659.25, s: 0.92, d: 0.18 }, // E5
      { f: 783.99, s: 1.12, d: 0.85 }  // G5
    ];

    sequence.forEach(n => {
      // Brass stack: sawtooth + square octave lower
      [1, 0.5].forEach((mult, idx) => {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = idx === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(n.f * mult, t + n.s);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, t + n.s);
        filter.frequency.exponentialRampToValueAtTime(2600, t + n.s + 0.06);
        filter.frequency.exponentialRampToValueAtTime(1400, t + n.s + n.d);

        gain.gain.setValueAtTime(0.001, t + n.s);
        gain.gain.linearRampToValueAtTime(idx === 0 ? 0.22 : 0.26, t + n.s + 0.03);
        gain.gain.setValueAtTime(idx === 0 ? 0.20 : 0.24, t + n.s + n.d * 0.75);
        gain.gain.exponentialRampToValueAtTime(0.001, t + n.s + n.d + 0.08);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t + n.s);
        osc.stop(t + n.s + n.d + 0.1);
      });
    });
  }

  // 4. Snare Drumroll + Cymbal Crash (For Raffle / Tirage au sort!)
  _drumroll(t) {
    const duration = 2.4;
    const hits = 36;
    for (let i = 0; i < hits; i++) {
      const progress = i / hits;
      const hitTime = t + Math.pow(progress, 0.85) * (duration - 0.3);
      const vol = 0.08 + progress * 0.25;
      this._snareHit(hitTime, vol);
    }
    // Final crash + bass hit
    this._crash(t + duration - 0.25, 0.45);
  }

  _snareHit(t, vol) {
    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(t);
  }

  _crash(t, vol) {
    const bufferSize = this.ctx.sampleRate * 1.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 3000;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(t);
  }

  // 5. MLG / Hype Airhorn
  _airhorn(t) {
    const bursts = [
      { s: 0.00, d: 0.16 },
      { s: 0.20, d: 0.16 },
      { s: 0.40, d: 0.55 }
    ];
    bursts.forEach(b => {
      [440, 554.37, 659.25].forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq * 0.94, t + b.s);
        osc.frequency.exponentialRampToValueAtTime(freq, t + b.s + 0.04);
        osc.frequency.setValueAtTime(freq, t + b.s + b.d - 0.05);
        osc.frequency.linearRampToValueAtTime(freq * 0.92, t + b.s + b.d);

        gain.gain.setValueAtTime(0.01, t + b.s);
        gain.gain.linearRampToValueAtTime(0.18, t + b.s + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + b.s + b.d);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t + b.s);
        osc.stop(t + b.s + b.d + 0.02);
      });
    });
  }

  // 6. Dramatic Suspense Sting (Dun-dun-DUUUUN)
  _suspense(t) {
    const hits = [
      { f: 146.83, s: 0.0, d: 0.25 }, // D3
      { f: 138.59, s: 0.28, d: 0.25 }, // C#3
      { f: 130.81, s: 0.56, d: 1.2 }  // C3
    ];
    hits.forEach(h => {
      [1, 1.5, 2].forEach(mult => {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(h.f * mult, t + h.s);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(750, t + h.s);
        gain.gain.setValueAtTime(0.01, t + h.s);
        gain.gain.linearRampToValueAtTime(0.22, t + h.s + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, t + h.s + h.d);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t + h.s);
        osc.stop(t + h.s + h.d + 0.05);
      });
    });
  }

  // 7. Retro Arcade Coin / Power-Up
  _coin(t) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(987.77, t); // B5
    osc.frequency.setValueAtTime(1318.51, t + 0.08); // E6
    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.46);
  }

  // 8. Crowd Applause / Cheer burst
  _applause(t) {
    const duration = 2.2;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // Modulated claps texture
      const env = Math.sin((i / bufferSize) * Math.PI);
      const clap = (Math.random() > 0.4 ? 1 : 0.3) * (Math.random() * 2 - 1);
      data[i] = clap * env;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 0.7;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.45, t + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(t);
  }

  _tick(t, freq, dur) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + dur + 0.01);
  }
}

const stageAudio = new StageSoundEngine();
