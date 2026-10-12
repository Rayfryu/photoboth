/**
 * Web Audio API synthesizer for photobooth sound effects
 * Zero external audio assets required; reliable & low-latency.
 */

class SoundEffects {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Short countdown tick beep (ping sound)
   */
  playCountdownTick(isFinal: boolean = false) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = isFinal ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(isFinal ? 880 : 520, ctx.currentTime); // A5 or C5

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (isFinal ? 0.25 : 0.12));

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + (isFinal ? 0.25 : 0.12));
    } catch {
      // Audio autoplay policy may block until user interaction
    }
  }

  /**
   * Realistic mechanical shutter click + flash pop sound
   */
  playShutterSound() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // 1. Click transient (burst of filtered noise)
      const bufferSize = ctx.sampleRate * 0.05;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, now);
      filter.Q.setValueAtTime(3, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.3, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start(now);

      // 2. Secondary mechanical latch click (slightly delayed)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, now + 0.06);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);

      oscGain.gain.setValueAtTime(0.2, now + 0.06);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      osc.start(now + 0.06);
      osc.stop(now + 0.15);
    } catch {
      // Ignore audio failure
    }
  }

  /**
   * Pleasant celebration chime upon completing or downloading photo strip
   */
  playCelebrationChime() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    } catch {
      // Ignore
    }
  }
}

export const soundEffects = new SoundEffects();
