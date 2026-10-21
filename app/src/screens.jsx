import { useEffect, useRef, useState } from 'react';
import { Button, Chip, Glow, Icon, SongRow, TopBar, BottomNav } from './components.jsx';
import { playPreview, PREVIEW_SECONDS } from './audio.js';

import glowWelcome1 from './assets/glow-welcome-1.svg';
import glowWelcome2 from './assets/glow-welcome-2.svg';
import glowWelcome3 from './assets/glow-welcome-3.svg';
import glowConnect1 from './assets/glow-connect-1.svg';
import glowConnect2 from './assets/glow-connect-2.svg';
import serviceDot from './assets/service-dot.svg';
import glowHome1 from './assets/glow-home-1.svg';
import glowHome2 from './assets/glow-home-2.svg';
import recordImg from './assets/record.svg';
import glowInput1 from './assets/glow-input-1.svg';
import glowInput2 from './assets/glow-input-2.svg';
import iconCamera from './assets/icon-camera.svg';
import iconMic from './assets/icon-mic.svg';
import iconType from './assets/icon-type.svg';
import iconImage from './assets/icon-image.svg';
import glowScan1 from './assets/glow-scan-1.svg';
import glowScan2 from './assets/glow-scan-2.svg';
import viewfinderImg from './assets/viewfinder.svg';
import glowResults1 from './assets/glow-results-1.svg';
import glowResults2 from './assets/glow-results-2.svg';
import glowResults3 from './assets/glow-results-3.svg';

/* ---------- 01 Welcome ---------- */
export function Welcome({ go }) {
  return (
    <>
      <Glow src={glowWelcome1} left={-160} top={380} size={700} />
      <Glow src={glowWelcome2} left={140} top={560} size={420} />
      <Glow src={glowWelcome3} left={140} top={700} size={260} />
      <div className="content gap-16">
        <p className="t-caption muted">App name</p>
        <div className="spacer" />
        <h1 className="t-display-xl full" style={{ margin: 0 }}>Find the thread to your taste</h1>
        <p className="t-body muted full">Turn a place, a photo, a feeling or a few words into music you haven’t heard yet.</p>
        <Button onClick={() => go('connect')}>Get started</Button>
      </div>
    </>
  );
}

/* ---------- 02 Connect apps ---------- */
const SERVICES = ['Spotify', 'Apple Music', 'YouTube Music', 'SoundCloud'];

export function ConnectApps({ go, connected, setConnected }) {
  const [loading, setLoading] = useState(null);

  const toggle = (name) => {
    if (loading) return;
    if (connected.includes(name)) {
      setConnected(connected.filter((n) => n !== name));
      return;
    }
    setLoading(name);
    setTimeout(() => { // simulated OAuth hand-off
      setConnected((c) => [...c, name]);
      setLoading(null);
    }, 1100);
  };

  return (
    <>
      <Glow src={glowConnect1} left={120} top={-200} size={520} />
      <Glow src={glowConnect2} left={-200} top={-120} size={520} />
      <div className="content gap-16">
        <p className="t-caption muted">Step 1 of 1</p>
        <h1 className="t-display-l full" style={{ margin: 0 }}>Plug in your music</h1>
        <p className="t-body muted full">We read your library so the Node knows what you already love — and what you haven’t found yet.</p>
        <div className="full" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {SERVICES.map((name) => {
            const isOn = connected.includes(name);
            const isLoading = loading === name;
            return (
              <button key={name} type="button" className="card service" onClick={() => toggle(name)}
                aria-pressed={isOn}>
                <img src={serviceDot} alt="" width="32" height="32" />
                <span className="name t-body-strong">{name}</span>
                <span className={`state-pill t-caption${isOn ? ' connected' : ''}${isLoading ? ' loading' : ''}`}>
                  {isOn ? '✓ Connected' : isLoading ? 'Connecting…' : 'Connect'}
                </span>
              </button>
            );
          })}
        </div>
        <div className="spacer" />
        <Button onClick={() => go('home')} disabled={connected.length === 0}>
          {connected.length === 0 ? 'Connect at least one app' : 'Continue'}
        </Button>
      </div>
    </>
  );
}

/* ---------- 03 Home ---------- */
export function Home({ go, mailbox, toast }) {
  const now = new Date();
  const day = now.toLocaleDateString('en-US', { weekday: 'long' });
  const h = now.getHours();
  const greeting = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <>
      <Glow src={glowHome1} left={-180} top={-160} size={560} />
      <Glow src={glowHome2} left={200} top={-60} size={360} />
      <div className="content gap-20" style={{ paddingBottom: 24 }}>
        <div className="full" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p className="t-caption muted">{day} · {greeting}, Lan</p>
          <h1 className="t-display-l" style={{ margin: 0 }}>What’s your vibe?</h1>
        </div>
        <div className="node-card full">
          <p className="t-caption">The Node</p>
          <p className="t-title">Feed it a place, a photo or a feeling. Get music back.</p>
          <Button onClick={() => go('input')}>Start a Node</Button>
        </div>
        <button type="button" className="card prompt-card"
          onClick={() => toast('Community prompts aren’t in this prototype yet.')}>
          <p className="t-caption muted">Today’s prompt · Studio Crew</p>
          <p className="t-body-strong">“A song for a 2AM drive with the windows down”</p>
          <p className="t-body muted">6 of 9 friends answered →</p>
        </button>
        <button type="button" className="card mailbox"
          onClick={() => toast(`${mailbox} records waiting — the mailbox opens in a later version.`)}>
          <img src={recordImg} alt="" />
          <span className="t-body-strong" style={{ flex: '1 0 0' }}>
            {mailbox} records dropped in your mailbox
          </span>
        </button>
      </div>
      <BottomNav active="home" onSelect={(id) => id !== 'home' && toast(`${id[0].toUpperCase() + id.slice(1)} isn’t in this prototype yet.`)} />
    </>
  );
}

/* ---------- 04 Node · Choose input ---------- */
const OPTIONS = [
  { id: 'camera', title: 'Scan', desc: 'Point your camera at a place, a landmark or your wall', icon: iconCamera, left: 2, top: 2 },
  { id: 'mic', title: 'Voice memo', desc: 'Hum it, describe it, or record the room', icon: iconMic, left: 4, top: 1 },
  { id: 'words', title: 'Words', desc: 'Type a feeling: “rainy rooftop, missing someone”', icon: iconType, left: 3, top: 4 },
  { id: 'media', title: 'Photos & videos', desc: 'Pull from your camera roll', icon: iconImage, left: 2, top: 2 },
];

export function ChooseInput({ go, back, startNode }) {
  const [sheet, setSheet] = useState(false);
  const [words, setWords] = useState('');
  const fileRef = useRef(null);

  const pick = (id) => {
    if (id === 'words') return setSheet(true);
    if (id === 'media') return fileRef.current.click();
    startNode({ mode: id });
    go('scanning');
  };

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    startNode({ mode: 'media', url: URL.createObjectURL(file), isVideo: file.type.startsWith('video') });
    go('scanning');
  };

  const submitWords = () => {
    if (!words.trim()) return;
    startNode({ mode: 'words', text: words.trim() });
    go('scanning');
  };

  return (
    <>
      <Glow src={glowInput1} left={140} top={-180} size={480} />
      <Glow src={glowInput2} left={-220} top={-100} size={500} />
      <TopBar title="Node" onBack={back} />
      <div className="content gap-12">
        <h1 className="t-display-l full" style={{ margin: 0 }}>Feed the Node</h1>
        <p className="t-body muted full">Pick how you want to describe your vibe.</p>
        {OPTIONS.map((o) => (
          <button key={o.id} type="button" className="card input-option" onClick={() => pick(o.id)}>
            <span className="icon"><span><Icon src={o.icon} left={o.left} top={o.top} /></span></span>
            <span className="text">
              <span className="t-title" style={{ whiteSpace: 'nowrap' }}>{o.title}</span>
              <span className="t-body muted">{o.desc}</span>
            </span>
          </button>
        ))}
        <input ref={fileRef} type="file" accept="image/*,video/*" hidden onChange={onFile} />
      </div>
      {sheet && (
        <div className="scrim" onClick={() => setSheet(false)}>
          <div className="sheet" role="dialog" aria-label="Describe your vibe" onClick={(e) => e.stopPropagation()}>
            <p className="t-caption muted">Words</p>
            <p className="t-title">Describe the feeling</p>
            <textarea autoFocus value={words} onChange={(e) => setWords(e.target.value)}
              placeholder="rainy rooftop, missing someone"
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitWords(); } }} />
            <Button onClick={submitWords} disabled={!words.trim()}>Feed the Node</Button>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- 05 Node · Scanning ---------- */
const STOP_WORDS = new Set(['a', 'an', 'the', 'and', 'or', 'of', 'in', 'on', 'at', 'to', 'with', 'for', 'my', 'i', 'is', 'it', 'like', 'feel', 'feeling', 'some', 'someone', 'so', 'very']);

export function detectTags(node) {
  if (node?.mode === 'words') {
    const tags = node.text.toLowerCase().split(/[^a-z0-9']+/).filter((w) => w.length > 2 && !STOP_WORDS.has(w));
    if (tags.length) return tags.slice(0, 3).map((t) => t.toUpperCase());
  }
  if (node?.mode === 'mic') return ['HUSHED', 'WARM', 'LATE'];
  return ['NEON', 'RAIN', 'NIGHT'];
}

const SCAN_MS = 4200;

export function Scanning({ go, back, node }) {
  const videoRef = useRef(null);
  const [level, setLevel] = useState(Array(9).fill(4));
  const [revealed, setRevealed] = useState(0);
  const [note, setNote] = useState('');
  const tags = detectTags(node);
  const listening = node?.mode === 'mic';

  // Real camera / microphone input
  useEffect(() => {
    let stream, raf, audioCtx, cancelled = false;
    (async () => {
      try {
        if (node?.mode === 'camera') {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          if (cancelled) return;
          videoRef.current.srcObject = stream;
        } else if (node?.mode === 'mic') {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          if (cancelled) return;
          audioCtx = new AudioContext();
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          audioCtx.createMediaStreamSource(stream).connect(analyser);
          const data = new Uint8Array(analyser.frequencyBinCount);
          const tick = () => {
            analyser.getByteFrequencyData(data);
            setLevel(Array.from({ length: 9 }, (_, i) => 4 + (data[i + 1] / 255) * 24));
            raf = requestAnimationFrame(tick);
          };
          tick();
        }
      } catch {
        setNote(node?.mode === 'camera' ? 'Camera blocked — simulating the scan' : 'Mic blocked — simulating the recording');
      }
    })();
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
      audioCtx?.close();
    };
  }, [node]);

  // Reveal detected tags one by one, then move to results
  useEffect(() => {
    const timers = tags.map((_, i) => setTimeout(() => setRevealed(i + 1), 1300 + i * 700));
    timers.push(setTimeout(() => go('results'), SCAN_MS));
    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Glow src={glowScan1} left={-40} top={300} size={480} />
      <Glow src={glowScan2} left={120} top={380} size={240} />
      <TopBar title={listening ? 'Listening' : 'Scanning'} onBack={back} />
      <div className="content gap-16" style={{ alignItems: 'center' }}>
        <div className="spacer" />
        {node?.mode === 'words' && (
          <p className="t-body muted" style={{ textAlign: 'center', maxWidth: 300 }}>“{node.text}”</p>
        )}
        <div className="viewfinder">
          <div className="media">
            {node?.mode === 'camera' && <video ref={videoRef} autoPlay playsInline muted />}
            {node?.mode === 'media' && (node.isVideo
              ? <video src={node.url} autoPlay loop muted playsInline />
              : <img src={node.url} alt="Your selected photo" />)}
          </div>
          <span className="pulse-ring" /><span className="pulse-ring r2" />
          {(node?.mode === 'camera' || node?.mode === 'media') && <span className="scanline" />}
          <img src={viewfinderImg} alt="" />
        </div>
        <p className="t-title" aria-live="polite">{revealed < tags.length && listening ? 'Listening…' : 'Reading the vibe…'}</p>
        {listening && (
          <div className="level-meter" aria-hidden="true">
            {level.map((h, i) => <span key={i} style={{ height: h }} />)}
          </div>
        )}
        <div className="chip-row" style={{ minHeight: 32, justifyContent: 'center' }}>
          {tags.slice(0, revealed).map((t) => <Chip key={t} pop>{t}</Chip>)}
        </div>
        {note && <p className="t-body muted">{note}</p>}
        <div className="spacer" />
      </div>
    </>
  );
}

/* ---------- 06 Node · Results ---------- */
const TRACKS = [
  { title: 'Glass Avenue', artist: 'Mira Vale · rainy synths' },
  { title: 'Afterglow Exit', artist: 'The Lanterns · late-night tempo' },
  { title: 'Paper Moons', artist: 'Koi Static · new to you' },
  { title: 'Static Hearts', artist: 'Juno Park · samples you love' },
];

export function Results({ back, node, toast, dropInMailbox, home }) {
  const [playing, setPlaying] = useState(null);
  const [progress, setProgress] = useState(0);
  const [saved, setSaved] = useState(false);
  const stopRef = useRef(null);
  const tags = detectTags(node);
  const title = node?.mode === 'words' ? tags.join(' ').toLowerCase() : node?.mode === 'mic' ? 'Hushed and warm' : 'Neon after rain';

  useEffect(() => () => stopRef.current?.(), []);

  useEffect(() => {
    if (playing === null) return;
    const started = performance.now();
    let raf;
    const tick = () => {
      setProgress(Math.min(1, (performance.now() - started) / (PREVIEW_SECONDS * 1000)));
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const toggle = (i) => {
    stopRef.current?.();
    stopRef.current = null;
    if (playing === i) return setPlaying(null);
    stopRef.current = playPreview(i, () => setPlaying(null));
    setProgress(0);
    setPlaying(i);
  };

  const leave = (fn) => { stopRef.current?.(); fn(); };

  return (
    <>
      <Glow src={glowResults1} left={-200} top={-200} size={560} />
      <Glow src={glowResults2} left={160} top={-120} size={420} />
      <Glow src={glowResults3} left={180} top={40} size={160} />
      <TopBar title="Your Node" onBack={() => leave(back)} />
      <div className="content gap-16">
        <p className="t-caption muted">Your vibe sounds like</p>
        <h1 className="t-display-xl full" style={{ margin: 0 }}>{title}</h1>
        <div className="chip-row">
          <Chip filled>92 BPM</Chip>
          <Chip>Dreamy</Chip>
          <Chip>2010s</Chip>
        </div>
        <div className="tracks">
          {TRACKS.map((t, i) => (
            <SongRow key={t.title} {...t} playing={playing === i} progress={progress} onToggle={() => toggle(i)} />
          ))}
        </div>
        <div className="spacer" />
        <Button onClick={() => { setSaved(true); toast(`Saved “${title}” to your library.`); }} disabled={saved}>
          {saved ? 'Saved ✓' : 'Save as playlist'}
        </Button>
        <Button variant="secondary" onClick={() => leave(() => { dropInMailbox(); home(); toast('Dropped in the Studio Crew mailbox.'); })}>
          Drop in the group mailbox
        </Button>
      </div>
    </>
  );
}
