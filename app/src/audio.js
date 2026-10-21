// Synthesized 15-second previews so the Results screen really plays sound
// without needing licensed tracks. Each track gets its own key, chords and tempo.

let ctx;
function getCtx() {
  ctx ??= new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

const midi = (n) => 440 * 2 ** ((n - 69) / 12);

export const PREVIEW_SECONDS = 15;

// Chord roots + intervals per track (dreamy minor 7ths / add9s around 92 BPM).
const TRACK_SOUNDS = [
  { bpm: 92, wave: 'triangle', chords: [[57, 60, 64, 67], [53, 57, 60, 64], [48, 52, 55, 59], [55, 59, 62, 66]] },
  { bpm: 86, wave: 'sine', chords: [[52, 55, 59, 62], [48, 52, 55, 62], [45, 48, 52, 55], [47, 50, 54, 57]] },
  { bpm: 98, wave: 'triangle', chords: [[60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 69]] },
  { bpm: 80, wave: 'sine', chords: [[50, 53, 57, 60], [46, 50, 53, 57], [43, 46, 50, 53], [45, 49, 52, 55]] },
];

/** Starts a preview. Returns a stop() function. onEnd fires when it finishes on its own. */
export function playPreview(index, onEnd) {
  const ac = getCtx();
  const sound = TRACK_SOUNDS[index % TRACK_SOUNDS.length];
  const beat = 60 / sound.bpm;
  const bar = beat * 4;
  const start = ac.currentTime + 0.05;
  const end = start + PREVIEW_SECONDS;

  const master = ac.createGain();
  master.gain.setValueAtTime(0, start);
  master.gain.linearRampToValueAtTime(0.22, start + 0.6);
  master.gain.setValueAtTime(0.22, end - 1.2);
  master.gain.linearRampToValueAtTime(0, end);

  const filter = ac.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1800;
  master.connect(filter).connect(ac.destination);

  const nodes = [];
  const note = (freq, t, dur, gain, type) => {
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + Math.min(0.08, dur / 3));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(master);
    osc.start(t);
    osc.stop(t + dur + 0.05);
    nodes.push(osc);
  };

  for (let t = start, i = 0; t < end; t += bar, i++) {
    const chord = sound.chords[i % sound.chords.length];
    chord.forEach((n) => note(midi(n), t, bar * 0.98, 0.09, 'sine')); // pad
    note(midi(chord[0] - 12), t, bar * 0.9, 0.18, 'sine'); // bass
    for (let s = 0; s < 8; s++) { // arpeggio in eighth notes
      const n = chord[[0, 2, 1, 3, 2, 1, 3, 2][s]] + 12;
      note(midi(n), t + s * beat / 2, beat * 0.45, 0.07, sound.wave);
    }
  }

  const timer = setTimeout(() => onEnd?.(), (end - ac.currentTime) * 1000);
  return () => {
    clearTimeout(timer);
    const now = ac.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(0, now + 0.15);
    setTimeout(() => { nodes.forEach((o) => { try { o.stop(); } catch {} }); master.disconnect(); }, 200);
  };
}

