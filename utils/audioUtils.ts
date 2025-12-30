// Simple Synthesizer to avoid external assets
let audioCtx: AudioContext | null = null;

const initAudio = (): AudioContext | null => {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        console.warn("AudioContext not supported in this browser");
        return null;
      }
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {
        // Silently handle resume failures (user interaction may be required)
      });
    }
    return audioCtx;
  } catch (error) {
    console.warn("Failed to initialize audio context:", error);
    return null;
  }
};

const playTone = (freq: number, type: OscillatorType, duration: number, vol: number = 0.1) => {
  try {
    const ctx = initAudio();
    if (!ctx) return;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (error) {
    // Silently fail - audio is not critical for gameplay
    console.debug("Audio play failed:", error);
  }
};

export const playSound = {
  move: () => playTone(600, 'sine', 0.05, 0.02), // Very quiet blip
  eat: () => {
    try {
      const ctx = initAudio();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (error) {
      console.debug("Eat sound failed:", error);
    }
  },
  die: () => {
    try {
      const ctx = initAudio();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (error) {
      console.debug("Die sound failed:", error);
    }
  },
  countdown: () => playTone(800, 'square', 0.1, 0.05),
  start: () => playTone(1200, 'square', 0.4, 0.1),
  click: () => playTone(1500, 'sine', 0.05, 0.05),
  levelUp: () => {
    try {
      const ctx = initAudio();
      if (!ctx) return;
      const now = ctx.currentTime;
      // Arpeggio C Major
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.1, now + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.1);
          osc.stop(now + i * 0.1 + 0.3);
      });
    } catch (error) {
      console.debug("Level up sound failed:", error);
    }
  },
  success: () => {
     try {
       const ctx = initAudio();
       if (!ctx) return;
       const osc = ctx.createOscillator();
       const gain = ctx.createGain();
       osc.type = 'sine';
       osc.frequency.setValueAtTime(880, ctx.currentTime);
       osc.frequency.linearRampToValueAtTime(1760, ctx.currentTime + 0.2);
       gain.gain.setValueAtTime(0.1, ctx.currentTime);
       gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
       osc.connect(gain);
       gain.connect(ctx.destination);
       osc.start();
       osc.stop(ctx.currentTime + 0.2);
     } catch (error) {
       console.debug("Success sound failed:", error);
     }
  },
  fanfare: () => {
    try {
      const ctx = initAudio();
      if (!ctx) return;
      const now = ctx.currentTime;
      // Triumphant chord: C4, E4, G4, C5 (Staggered)
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.value = freq;
        
        // Fast attack, sustain, decay
        gain.gain.setValueAtTime(0, now + i * 0.05);
        gain.gain.linearRampToValueAtTime(0.1, now + i * 0.05 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.8);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.8);
      });
    } catch (error) {
      console.debug("Fanfare sound failed:", error);
    }
  }
};