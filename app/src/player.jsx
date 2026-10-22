import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { playPreview, PREVIEW_SECONDS } from './audio.js';
import { Artwork } from './components.jsx';

// One "now playing" for the whole app: Home, Results, Community, Remote, Profile
// and the mini-player all read and control the same queue.
const PlayerContext = createContext(null);
export const usePlayer = () => useContext(PlayerContext);

export function PlayerProvider({ children }) {
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(-1);
  const [source, setSource] = useState('');
  const [playing, setPlaying] = useState(false);
  const [tone, setToneState] = useState({ energy: 0.35, mood: 0.5, tempo: 0.5 });
  const stopRef = useRef(null);
  const pos = useRef({ startedAt: 0, offset: 0 }); // offset = seconds already played before startedAt
  const live = useRef({});
  live.current = { queue, index, playing, tone };

  const elapsed = useCallback(() => {
    const p = pos.current;
    return Math.min(PREVIEW_SECONDS, live.current.playing ? p.offset + (performance.now() - p.startedAt) / 1000 : p.offset);
  }, []);

  const startAt = useCallback((i, q, offset = 0) => {
    stopRef.current?.();
    const track = q[i];
    stopRef.current = playPreview(track.sound, () => {
      // Auto-advance through the queue; stop at the end.
      if (i + 1 < q.length) startAt(i + 1, q);
      else { stopRef.current = null; pos.current = { startedAt: 0, offset: PREVIEW_SECONDS }; setPlaying(false); }
    }, { offset, tone: live.current.tone });
    pos.current = { startedAt: performance.now(), offset };
    setQueue(q);
    setIndex(i);
    setPlaying(true);
  }, []);

  const pause = useCallback(() => {
    if (!live.current.playing) return;
    pos.current = { startedAt: 0, offset: elapsed() };
    stopRef.current?.();
    stopRef.current = null;
    setPlaying(false);
  }, [elapsed]);

  const resume = useCallback(() => {
    const { queue: q, index: i } = live.current;
    if (i < 0) return;
    const off = pos.current.offset >= PREVIEW_SECONDS - 0.3 ? 0 : pos.current.offset;
    startAt(i, q, off);
  }, [startAt]);

  // Play a track from a list (the list becomes the queue). Tapping the current track pauses/resumes it.
  const play = useCallback((track, list = [track], from = '') => {
    const { queue: q, index: i, playing: on } = live.current;
    if (q[i]?.id === track.id) return on ? pause() : resume();
    setSource(from);
    startAt(Math.max(0, list.findIndex((t) => t.id === track.id)), list);
  }, [pause, resume, startAt]);

  // Load a queue (e.g. a Remote filter), playing it straight away or just cueing the first track.
  const load = useCallback((list, from = '', autoplay = false) => {
    setSource(from);
    if (autoplay) return startAt(0, list);
    stopRef.current?.();
    stopRef.current = null;
    pos.current = { startedAt: 0, offset: 0 };
    setQueue(list); setIndex(0); setPlaying(false);
  }, [startAt]);

  const toggle = useCallback(() => (live.current.playing ? pause() : resume()), [pause, resume]);
  const skip = useCallback((dir) => {
    const { queue: q, index: i, playing: on } = live.current;
    if (!q.length) return;
    // Previous restarts the track if it's more than 3s in, like most players.
    const to = dir < 0 && elapsed() > 3 ? i : Math.min(q.length - 1, Math.max(0, i + dir));
    if (on) startAt(to, q);
    else { pos.current = { startedAt: 0, offset: 0 }; setIndex(to); }
  }, [elapsed, startAt]);

  // Energy changes the sound live; mood and tempo restart the track where it was.
  const restart = useRef(null);
  const setTone = useCallback((key, value) => {
    setToneState((t) => ({ ...t, [key]: value }));
    live.current.tone = { ...live.current.tone, [key]: value };
    if (key === 'energy') return stopRef.current?.setEnergy(value);
    clearTimeout(restart.current);
    restart.current = setTimeout(() => {
      const { queue: q, index: i, playing: on } = live.current;
      if (on) startAt(i, q, elapsed());
    }, 250);
  }, [elapsed, startAt]);

  useEffect(() => () => stopRef.current?.(), []);

  const value = useMemo(() => ({
    track: queue[index] ?? null, queue, index, source, playing, tone,
    isPlaying: (id) => playing && queue[index]?.id === id,
    play, load, pause, resume, toggle, next: () => skip(1), prev: () => skip(-1), setTone, elapsed,
  }), [queue, index, source, playing, tone, play, load, pause, resume, toggle, skip, setTone, elapsed]);

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

// 0–1 progress of the current track, updated every frame while playing.
export function useProgress() {
  const { playing, elapsed, track } = usePlayer();
  const [p, setP] = useState(() => elapsed() / PREVIEW_SECONDS);
  useEffect(() => {
    setP(elapsed() / PREVIEW_SECONDS);
    if (!playing) return;
    let raf;
    const tick = () => { setP(elapsed() / PREVIEW_SECONDS); raf = requestAnimationFrame(tick); };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [playing, track, elapsed]);
  return p;
}

// Persistent bar above the tab bar. Tapping the track opens the Remote.
export function MiniPlayer({ onOpen }) {
  const { track, playing, toggle } = usePlayer();
  const progress = useProgress();
  if (!track) return null;
  return (
    <div className="mini-player">
      <button type="button" className="mini-main" onClick={onOpen} aria-label={`Now playing: ${track.title} by ${track.artist}. Open the remote`}>
        <Artwork track={track} size={40} />
        <span className="mini-text">
          <span className="t-body-strong">{track.title}</span>
          <span className="t-body muted">{track.artist}</span>
        </span>
      </button>
      <button type="button" className="mini-toggle" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
        {playing ? <span className="pause-icon"><i /><i /></span> : <span className="play-tri" />}
      </button>
      <span className="mini-progress" aria-hidden="true"><i style={{ width: `${progress * 100}%` }} /></span>
    </div>
  );
}
