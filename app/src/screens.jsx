import { useEffect, useRef, useState } from 'react';
import { Blob, BottomNav, Button, Chip, Glow, Icon, ListRow, Progress, SongRow, TopBar, usePreview } from './components.jsx';
import { playPreview, PREVIEW_SECONDS } from './audio.js';

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

/* ---------- Onboarding (curated frames 01a–01c) ---------- */
function OnboardingBackdrop() {
  return (
    <>
      <Blob color="magenta" left={-59} top={-90} size={520} opacity={0.6} blur={140} />
      <Blob color="blue" left={21} top={-20} size={360} opacity={0.7} blur={100} />
      <div className="horizon" aria-hidden="true" />
    </>
  );
}

export function Welcome({ go, toast }) {
  return (
    <>
      <OnboardingBackdrop />
      <div className="content gap-16">
        <div className="spacer" />
        <Progress step={1} total={3} />
        <p className="t-caption muted">Step 1 of 3 · Welcome</p>
        <h1 className="t-display-xl full" style={{ margin: 0 }}>Find the thread to your taste</h1>
        <p className="t-body muted full">Turn a place, a photo, a feeling or a few words into music you haven’t heard yet.</p>
        <div className="full" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Button onClick={() => go('connect')}>Get started</Button>
          <Button variant="secondary" onClick={() => toast('Sign-in isn’t in this prototype yet.')}>I already have an account</Button>
        </div>
      </div>
    </>
  );
}

const SERVICES = [
  { name: 'Spotify', dot: 'blue' },
  { name: 'Apple Music', dot: 'magenta' },
  { name: 'SoundCloud', dot: 'sun' },
];

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
      <OnboardingBackdrop />
      <div className="content gap-16">
        <div className="spacer" />
        <Progress step={2} total={3} />
        <p className="t-caption muted">Step 2 of 3 · Onboarding</p>
        <h1 className="t-display-xl full" style={{ margin: 0 }}>Plug in your sound</h1>
        <p className="t-body muted full">Connect the apps you already listen on. The Node learns your taste from them — nothing gets posted without asking.</p>
        <div className="full" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SERVICES.map(({ name, dot }) => {
            const isOn = connected.includes(name);
            return (
              <ListRow key={name} title={name} dot={dot} aria-pressed={isOn} metaOn={isOn}
                meta={isOn ? '✓ Connected' : loading === name ? 'Connecting…' : 'Connect'}
                onClick={() => toggle(name)} />
            );
          })}
        </div>
        <div className="full" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Button onClick={() => go('vibes')} disabled={connected.length === 0}>
            {connected.length === 0 ? 'Connect at least one app' : 'Continue'}
          </Button>
          <Button variant="secondary" onClick={() => go('vibes')}>Skip for now</Button>
        </div>
      </div>
    </>
  );
}

const VIBES = ['Late night', 'Jazz samples', 'Driving', 'Bedroom pop', 'Rainy days', 'Club', 'Soul', 'Ambient', 'Hyperpop', 'Lo-fi', 'Afrobeats', 'City pop'];
const MIN_VIBES = 3;

export function PickVibes({ tab, vibes, setVibes }) {
  const toggle = (v) => setVibes((vs) => (vs.includes(v) ? vs.filter((x) => x !== v) : [...vs, v]));
  const ready = vibes.length >= MIN_VIBES;
  return (
    <>
      <OnboardingBackdrop />
      <div className="content gap-16">
        <div className="spacer" />
        <Progress step={3} total={3} />
        <p className="t-caption muted">Step 3 of 3 · Onboarding</p>
        <h1 className="t-display-xl full" style={{ margin: 0 }}>Pick your vibes</h1>
        <p className="t-body muted full">Choose a few. The Node uses them for your first daily prompt — change them any time in Profile.</p>
        <div className="vibes full">
          {VIBES.map((v) => <Chip key={v} filled={vibes.includes(v)} onClick={() => toggle(v)}>{v}</Chip>)}
        </div>
        <div className="full" style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <Button onClick={() => tab('home')} disabled={!ready}>Start listening</Button>
          <p className="t-caption muted">
            {vibes.length} picked{ready ? '' : ` · pick at least ${MIN_VIBES}`}
          </p>
        </div>
      </div>
    </>
  );
}

/* ---------- 02 Home (curated) ---------- */
const NODE_INPUTS = [
  { id: 'camera', label: 'Scan', icon: iconCamera, left: 2, top: 2 },
  { id: 'mic', label: 'Voice', icon: iconMic, left: 4, top: 1 },
  { id: 'media', label: 'Media', icon: iconImage, left: 2, top: 2 },
  { id: 'words', label: 'Words', icon: iconType, left: 3, top: 4 },
];

const SNIPPETS = [
  { title: 'Night Swim', artist: 'Ravyn Lenae', from: 'blue', to: 'magenta' },
  { title: 'Glass Hour', artist: 'Mk.gee', from: 'magenta', to: 'sun' },
  { title: 'Low Sun', artist: 'Bonobo', from: 'navy', to: 'blue' },
  { title: 'Overcast', artist: 'Tirzah', from: 'sun', to: 'blue' },
];
const tokenColor = (name) => (name === 'navy' ? 'var(--color-bg-navy)' : `var(--color-accent-${name})`);

export function Home({ go, tab, mailbox, toast, startNode }) {
  const now = new Date();
  const day = now.toLocaleDateString('en-US', { weekday: 'long' });
  const h = now.getHours();
  const greeting = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  const preview = usePreview();
  const [sheet, setSheet] = useState(false);
  const [words, setWords] = useState('');
  const fileRef = useRef(null);

  // Each Node tile goes straight into its input: camera/mic scan, media opens the picker, words opens a sheet.
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
      <Blob color="magenta" left={140} top={-120} size={420} opacity={0.4} blur={140} />
      <Blob color="blue" left={-160} top={120} size={380} opacity={0.45} blur={140} />
      <div className="content gap-16" style={{ paddingBottom: 24 }}>
        <div className="full" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p className="t-caption muted">{day} · {greeting}, Lan</p>
          <h1 className="t-display-l" style={{ margin: 0 }}>What’s your vibe?</h1>
        </div>
        <button type="button" className="card prompt-card"
          onClick={() => toast('Answering prompts isn’t in this prototype yet.')}>
          <p className="t-caption" style={{ color: 'var(--color-accent-magenta)' }}>Today’s prompt · Studio Crew</p>
          <p className="t-title">“A song for a 2AM drive with the windows down”</p>
          <span className="answers">
            <span className="faces" aria-hidden="true"><i /><i /><i /></span>
            <span className="t-caption muted">6 of 9 answered · Add yours →</span>
          </span>
        </button>
        <div className="node-card full">
          <p className="t-caption">The Node</p>
          <p className="t-title">Feed it a place, a sound, a photo or a feeling.</p>
          <div className="node-inputs">
            {NODE_INPUTS.map((o) => (
              <button key={o.id} type="button" className="node-input" onClick={() => pick(o.id)}>
                <span className="icon"><Icon src={o.icon} left={o.left} top={o.top} /></span>
                <span className="t-caption">{o.label}</span>
              </button>
            ))}
          </div>
          <input ref={fileRef} type="file" accept="image/*,video/*" hidden onChange={onFile} />
        </div>
        <div className="section-head full">
          <p className="t-caption muted">Catalogue · Snippets</p>
          <button type="button" className="t-caption" onClick={() => toast('The full catalogue opens in a later version.')}>See all</button>
        </div>
        <div className="shelf">
          {SNIPPETS.map((sn, i) => (
            <button key={sn.title} type="button" className="snippet" aria-pressed={preview.playing === sn.title}
              aria-label={`${preview.playing === sn.title ? 'Stop' : 'Play'} ${sn.title} by ${sn.artist}`}
              onClick={() => preview.toggle(sn.title, i)}>
              <span className="cover" style={{ backgroundImage: `linear-gradient(135deg, ${tokenColor(sn.from)}, ${tokenColor(sn.to)})` }}>
                {preview.playing === sn.title && <span className="eq"><i /><i /><i /></span>}
              </span>
              <span className="t-body-strong">{sn.title}</span>
              <span className="t-caption muted">{sn.artist}</span>
            </button>
          ))}
        </div>
        <ListRow title={`${mailbox} records in your mailbox`} meta="New" metaOn
          onClick={() => toast(`${mailbox} records waiting — the mailbox opens in a later version.`)} />
      </div>
      <BottomNav active="home" onSelect={tab} />
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
