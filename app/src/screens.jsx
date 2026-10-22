import { useEffect, useRef, useState } from 'react';
import { Blob, BottomNav, Button, Chip, Glow, Icon, Knob, ListRow, Progress, SongRow, TopBar, usePreview, WordsSheet } from './components.jsx';
import { playPreview, PREVIEW_SECONDS } from './audio.js';
import { detectedWords, inputLabels, matchSet, rankTracks, resultTitle, TAG_OPTIONS, whyLine } from './data.js';

import iconCamera from './assets/icon-camera.svg';
import iconMic from './assets/icon-mic.svg';
import iconType from './assets/icon-type.svg';
import iconImage from './assets/icon-image.svg';
import glowScan1 from './assets/glow-scan-1.svg';
import glowScan2 from './assets/glow-scan-2.svg';
import viewfinderImg from './assets/viewfinder.svg';

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

// From Profile (returnTo === 'profile') this edits connections and returns instead of continuing onboarding.
export function ConnectApps({ go, back, returnTo, connected, setConnected }) {
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
      {returnTo && <TopBar title="Profile" onBack={back} />}
      <div className="content gap-16">
        <div className="spacer" />
        {returnTo ? <p className="t-caption muted">Profile · Music apps</p> : (
          <>
            <Progress step={2} total={3} />
            <p className="t-caption muted">Step 2 of 3 · Onboarding</p>
          </>
        )}
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
          <Button onClick={() => (returnTo ? back() : go('vibes'))} disabled={connected.length === 0}>
            {connected.length === 0 ? 'Connect at least one app' : returnTo ? 'Done' : 'Continue'}
          </Button>
          {!returnTo && <Button variant="secondary" onClick={() => go('vibes')}>Skip for now</Button>}
        </div>
      </div>
    </>
  );
}

const VIBES = ['Late night', 'Jazz samples', 'Driving', 'Bedroom pop', 'Rainy days', 'Club', 'Soul', 'Ambient', 'Hyperpop', 'Lo-fi', 'Afrobeats', 'City pop'];
const MIN_VIBES = 3;

export function PickVibes({ tab, back, returnTo, vibes, setVibes }) {
  const toggle = (v) => setVibes((vs) => (vs.includes(v) ? vs.filter((x) => x !== v) : [...vs, v]));
  const ready = vibes.length >= MIN_VIBES;
  return (
    <>
      <OnboardingBackdrop />
      {returnTo && <TopBar title="Profile" onBack={back} />}
      <div className="content gap-16">
        <div className="spacer" />
        {returnTo ? <p className="t-caption muted">Profile · Your vibes</p> : (
          <>
            <Progress step={3} total={3} />
            <p className="t-caption muted">Step 3 of 3 · Onboarding</p>
          </>
        )}
        <h1 className="t-display-xl full" style={{ margin: 0 }}>Pick your vibes</h1>
        <p className="t-body muted full">Choose a few. The Node uses them for your first daily prompt — change them any time in Profile.</p>
        <div className="vibes full">
          {VIBES.map((v) => <Chip key={v} filled={vibes.includes(v)} onClick={() => toggle(v)}>{v}</Chip>)}
        </div>
        <div className="full" style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <Button onClick={() => (returnTo ? back() : tab('home'))} disabled={!ready}>{returnTo ? 'Save' : 'Start listening'}</Button>
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
  const submitWords = (text) => {
    startNode({ mode: 'words', text });
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
      {sheet && <WordsSheet onSubmit={submitWords} onClose={() => setSheet(false)} />}
    </>
  );
}

/* ---------- 03 Community (curated) ---------- */
const STATIONS = [
  { city: 'Lisbon', x: 60, y: 30, color: 'magenta', spinning: 'Kaytranada' },
  { city: 'Seoul', x: 190, y: 12, color: 'blue', spinning: 'Yaeji' },
  { city: 'Lagos', x: 250, y: 60, color: 'sun', spinning: 'Tems' },
  { city: 'Mexico City', x: 120, y: 76, color: 'blue', spinning: 'Silvana Estrada' },
];

function Globe({ selected, onSelect }) {
  return (
    <div className="globe">
      <svg viewBox="0 0 322 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {[60, 110, 160, 210].map((h) => <ellipse key={h} cx="161" cy="120" rx="160" ry={h / 2} />)}
        {[40, 110, 180, 250, 320].map((w) => <ellipse key={w} cx="161" cy="110" rx={w / 2} ry="150" opacity="0.6" />)}
      </svg>
      {STATIONS.map((s) => (
        <button key={s.city} type="button" className={`pin${selected === s.city ? ' on' : ''}`}
          style={{ left: `${(s.x / 322) * 100}%`, top: s.y, '--pin': `var(--color-accent-${s.color})` }}
          aria-pressed={selected === s.city} aria-label={`Tune in to ${s.city}`} onClick={() => onSelect(s)}>
          <i />
        </button>
      ))}
    </div>
  );
}

export function Community({ tab, toast }) {
  const preview = usePreview();
  const [station, setStation] = useState(STATIONS[0]);
  const tuned = preview.playing === station.city;

  const tuneIn = (s) => {
    setStation(s);
    preview.toggle(s.city, STATIONS.indexOf(s));
  };

  return (
    <>
      <Blob color="blue" left={120} top={-140} size={440} opacity={0.5} blur={140} />
      <Blob color="magenta" left={-180} top={360} size={380} opacity={0.35} blur={140} />
      <div className="content gap-16" style={{ paddingBottom: 24 }}>
        <div className="full" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p className="t-caption muted">1,204 listening right now</p>
          <h1 className="t-display-l" style={{ margin: 0 }}>Find your people</h1>
        </div>
        <section className="card panel navy">
          <div className="section-head">
            <p className="t-title">Global radio</p>
            <span className="live t-caption"><i />Live</span>
          </div>
          <Globe selected={tuned ? station.city : null} onSelect={tuneIn} />
          <p className="t-body muted" aria-live="polite">
            {tuned ? `Tuned in to ${station.city} · ${station.spinning}` : `${station.city} · Someone’s spinning ${station.spinning} — tune in`}
          </p>
        </section>
        <section className="card panel">
          <div className="match">
            <span className="avatars" aria-hidden="true"><i /><i /></span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span className="t-caption" style={{ color: 'var(--color-accent-magenta)' }}>94% taste match</span>
              <span className="t-title">You and Mira</span>
            </span>
          </div>
          <p className="t-body muted">You both loop Jai Paul and late-night jazz after 1AM.</p>
          <div className="chip-row">
            <Chip filled onClick={() => toast('Messaging isn’t in this prototype yet.')}>Say hi</Chip>
            <Chip onClick={() => toast('Record swaps open in a later version.')}>Swap a record</Chip>
          </div>
        </section>
        <ListRow title="Touch tips" meta="Tap a charm" dot="sun"
          onClick={() => toast('Touch tips need the RFID phone charm — coming with the hardware.')} />
        <div className="full" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p className="t-caption muted">Q&amp;A</p>
          {[['Rainy-commute albums?', '18'], ['Underrated samples?', '42']].map(([q, n]) => (
            <ListRow key={q} title={q} meta={n} dot="blue" onClick={() => toast('Q&A threads aren’t in this prototype yet.')} />
          ))}
        </div>
      </div>
      <BottomNav active="community" onSelect={tab} />
    </>
  );
}

/* ---------- 04 Remote Control (curated) ---------- */
// Each filter loads a different record onto the deck.
const DECK = {
  All: { title: 'Night Swim', artist: 'Ravyn Lenae', side: 'Side A · 2 of 6', sound: 0 },
  Vinyl: { title: 'Glass Hour', artist: 'Mk.gee', side: 'Side B · 1 of 5', sound: 1 },
  Samples: { title: 'Low Sun', artist: 'Bonobo', side: 'Sample pack · 4 of 9', sound: 2 },
  Live: { title: 'Overcast', artist: 'Tirzah', side: 'Live set · 3 of 7', sound: 3 },
};

export function Remote({ tab, toast }) {
  const preview = usePreview();
  const [filter, setFilter] = useState('All');
  const [plays, setPlays] = useState(0);
  const [mix, setMix] = useState({ Energy: 0.7, Mood: 0.45, Tempo: 0.6 });
  const [labels, setLabels] = useState(['Late night']);
  const track = DECK[filter];
  const playing = preview.playing === track.title;

  const togglePlay = () => {
    if (!playing) setPlays((n) => n + 1);
    preview.toggle(track.title, track.sound);
  };
  const choose = (f) => {
    if (playing) preview.toggle(track.title, track.sound); // stop the old record
    setFilter(f);
  };
  const toggleLabel = (l) => setLabels((ls) => (ls.includes(l) ? ls.filter((x) => x !== l) : [...ls, l]));

  return (
    <>
      <Blob color="magenta" left={0} top={140} size={400} opacity={0.45} blur={140} />
      <Blob color="blue" left={120} top={40} size={300} opacity={0.5} blur={120} />
      <div className="content gap-16" style={{ paddingBottom: 24 }}>
        <div className="full" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p className="t-caption muted">Remote · Living room speaker</p>
          <h1 className="t-display-l" style={{ margin: 0 }}>Now playing</h1>
        </div>
        <div className="chip-row" role="group" aria-label="Filter">
          {Object.keys(DECK).map((f) => <Chip key={f} filled={filter === f} onClick={() => choose(f)}>{f}</Chip>)}
        </div>
        <div className="now-playing full">
          <button type="button" className={`record${playing ? ' spinning' : ''}`} onClick={togglePlay}
            aria-label={`${playing ? 'Stop' : 'Play'} ${track.title}`} aria-pressed={playing}>
            <span className="sticker" aria-hidden="true" />
          </button>
          <div className="deck-meta">
            <p className="t-caption muted">{track.side}</p>
            <p className="t-title">{track.title}</p>
            <p className="t-body muted">{track.artist}</p>
            <span className="played">
              <i key={`${filter}-${plays}`} className={playing ? 'run' : ''} style={{ '--dur': `${PREVIEW_SECONDS}s` }} />
            </span>
          </div>
        </div>
        <div className="card panel mix">
          {Object.entries(mix).map(([k, v]) => (
            <Knob key={k} label={k} value={v} onChange={(nv) => setMix((m) => ({ ...m, [k]: nv }))} />
          ))}
        </div>
        <div className="full" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p className="t-caption muted">Label this track</p>
          <div className="chip-row">
            {['Late night', 'Driving'].map((l) => <Chip key={l} filled={labels.includes(l)} onClick={() => toggleLabel(l)}>{l}</Chip>)}
            <Chip onClick={() => toast('Custom labels arrive in a later version.')}>+ Add</Chip>
          </div>
        </div>
        <div className="tools full">
          <button type="button" className="card panel navy tool" style={{ borderColor: 'color-mix(in srgb, var(--color-accent-magenta) 60%, transparent)' }}
            onClick={() => toast('Sample finder is coming — it will show what this track is built on.')}>
            <span className="t-body-strong">Sample finder</span>
            <span className="t-caption muted">Hear what this track is built on →</span>
          </button>
          <button type="button" className="card panel navy tool" style={{ borderColor: 'color-mix(in srgb, var(--color-accent-sun) 60%, transparent)' }}
            onClick={() => toast('Friends’ stickers open in a later version.')}>
            <span className="t-body-strong">Stickers</span>
            <span className="t-caption muted">3 left on this record by friends →</span>
          </button>
        </div>
      </div>
      <BottomNav active="remote" onSelect={tab} />
    </>
  );
}

/* ---------- 05 Profile (curated) ---------- */
const SPINES = ['magenta', 'blue', 'sun', 'card', 'magenta', 'subtle', 'blue', 'sun', 'magenta', 'card', 'blue', 'sun', 'subtle', 'magenta', 'blue', 'sun'];
const spineColor = (c) => (c === 'card' ? 'var(--color-surface-card)' : c === 'subtle' ? 'var(--color-border-subtle)' : `var(--color-accent-${c})`);

export function Profile({ go, tab, toast, connected, vibes }) {
  const preview = usePreview();
  return (
    <>
      <Blob color="magenta" left={100} top={-160} size={420} opacity={0.45} blur={140} />
      <Blob color="blue" left={-200} top={300} size={400} opacity={0.4} blur={140} />
      <div className="content gap-16" style={{ paddingBottom: 24 }}>
        <div className="identity full">
          <span className="avatar" aria-hidden="true" />
          <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <h1 className="t-title" style={{ margin: 0 }}>Lan Nguyen</h1>
            <span className="t-caption muted">@lan · Studio crew</span>
          </span>
        </div>
        <section className="card persona">
          <p className="t-caption">Your persona · October recap</p>
          <p className="t-display-l">The night driver</p>
          <p className="t-body">Moody, synth-heavy, mostly after 11PM. Up 40% on jazz samples.</p>
        </section>
        <div className="stats full">
          {[['214', 'Records'], ['38', 'Nodes'], ['12', 'Matches']].map(([v, l]) => (
            <div key={l} className="stat"><span className="t-title">{v}</span><span className="t-caption muted">{l}</span></div>
          ))}
        </div>
        <section className="card panel navy">
          <div className="section-head">
            <p className="t-title">Listening room</p>
            <button type="button" className="t-caption muted" onClick={() => toast('Arranging your room arrives with the 3D room in a later version.')}>Edit</button>
          </div>
          <div className="room-shelf">
            {SPINES.map((c, i) => (
              <button key={i} type="button" className={`spine${preview.playing === i ? ' out' : ''}`}
                aria-label={`${preview.playing === i ? 'Stop' : 'Play'} record ${i + 1} from your shelf`}
                style={{ width: i % 3 === 0 ? 12 : 8, height: 46 + ((i * 7) % 14), background: spineColor(c) }}
                onClick={() => preview.toggle(i, i)} />
            ))}
          </div>
          <p className="t-caption muted">The record on the table plays whatever you’re on right now.</p>
        </section>
        <div className="full" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <ListRow title="Connect music apps" meta={`${connected.length} linked`} dot="blue" onClick={() => go('connect')} />
          <ListRow title="Your vibes" meta={`${vibes.length} picked`} dot="magenta" onClick={() => go('vibes')} />
          <ListRow title="Settings" meta="→" dot="subtle" onClick={() => toast('Settings aren’t in this prototype yet.')} />
        </div>
      </div>
      <BottomNav active="profile" onSelect={tab} />
    </>
  );
}

/* ---------- 05 Node · Scanning ---------- */
const SCAN_MS = 4200;

export function Scanning({ go, back, node }) {
  const videoRef = useRef(null);
  const [level, setLevel] = useState(Array(9).fill(4));
  const [revealed, setRevealed] = useState(0);
  const [note, setNote] = useState('');
  const tags = detectedWords(node);
  const labels = inputLabels(node);
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
      <TopBar title={labels.bar} onBack={back} />
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
        <p className="t-title" aria-live="polite">{revealed < tags.length ? labels.doing : 'Finding your sound…'}</p>
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
const TAG_KINDS = { tempo: 'Tempo', mood: 'Mood', era: 'Era' };

// A result tag: tap the label to swap it for the next option, × to drop it.
function TagChip({ kind, value, onSwap, onRemove, onAdd }) {
  if (!value) {
    return <button type="button" className="tag-chip add t-caption" onClick={onAdd}>+ {TAG_KINDS[kind]}</button>;
  }
  return (
    <span className="tag-chip t-caption">
      <button type="button" onClick={onSwap} aria-label={`${TAG_KINDS[kind]}: ${value}. Tap to change`}>{value}</button>
      <button type="button" className="x" onClick={onRemove} aria-label={`Remove ${value}`}>×</button>
    </span>
  );
}

export function Results({ go, back, node, startNode, toast, dropInMailbox, home }) {
  const set = matchSet(node);
  const title = resultTitle(node);
  const [tags, setTags] = useState(set.tags);
  const [liked, setLiked] = useState([]);
  const [hidden, setHidden] = useState([]);
  const [seed, setSeed] = useState(0);
  const [editing, setEditing] = useState(false);
  const tracks = rankTracks(set, tags, { liked, hidden, seed });
  const likedTitles = tracks.filter((t) => liked.includes(t.id)).map((t) => t.title);

  const [playing, setPlaying] = useState(null);
  const [progress, setProgress] = useState(0);
  const [saved, setSaved] = useState(false);
  const stopRef = useRef(null);

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

  const toggle = (track) => {
    stopRef.current?.();
    stopRef.current = null;
    if (playing === track.id) return setPlaying(null);
    stopRef.current = playPreview(track.sound, () => setPlaying(null));
    setProgress(0);
    setPlaying(track.id);
  };

  const swapTag = (kind) => setTags((tg) => {
    const opts = TAG_OPTIONS[kind];
    return { ...tg, [kind]: opts[(opts.indexOf(tg[kind]) + 1) % opts.length] };
  });
  const setTag = (kind, value) => setTags((tg) => ({ ...tg, [kind]: value }));
  const moreLike = (t) => { setLiked((l) => [...l.filter((x) => x !== t.id), t.id]); toast(`More like “${t.title}” coming up.`); };
  const lessLike = (t) => {
    if (playing === t.id) toggle(t);
    setHidden((h) => [...h, t.id]);
    toast(`Got it — less like “${t.title}”.`);
  };
  const editInput = (text) => {
    stopRef.current?.();
    setEditing(false);
    startNode({ mode: 'words', text });
    go('scanning');
  };

  const leave = (fn) => { stopRef.current?.(); fn(); };
  const [a1, a2] = set.accents;

  return (
    <>
      <Blob color={a1} left={-200} top={-200} size={560} opacity={0.5} blur={160} />
      <Blob color={a2} left={160} top={-120} size={420} opacity={0.45} blur={140} />
      <TopBar title="Your Node" onBack={() => leave(back)} />
      <div className="content gap-16">
        <p className="t-caption muted">Your vibe sounds like</p>
        <h1 className="t-display-xl full" style={{ margin: 0 }}>{title}</h1>
        {node?.mode === 'words' && <p className="t-body muted full">“{node.text}” · {set.name}</p>}
        <div className="chip-row" role="group" aria-label="Tune the results">
          {Object.keys(TAG_KINDS).map((k) => (
            <TagChip key={k} kind={k} value={tags[k]} onSwap={() => swapTag(k)}
              onRemove={() => setTag(k, null)} onAdd={() => setTag(k, set.tags[k])} />
          ))}
        </div>
        <div className="tracks" aria-live="polite">
          {tracks.map((t) => (
            <SongRow key={t.id} title={t.title} artist={`${t.artist} · ${t.note.toLowerCase()}`}
              playing={playing === t.id} progress={progress} onToggle={() => toggle(t)}
              menu={[{ label: 'More like this', onSelect: () => moreLike(t) }, { label: 'Less like this', onSelect: () => lessLike(t) }]} />
          ))}
        </div>
        <p className="t-body muted full why"><span className="t-body-strong">Why these picks · </span>{whyLine(set, tags, likedTitles)}</p>
        <div className="refine full">
          <Button variant="secondary" onClick={() => setSeed((n) => n + 1)}>↻ Regenerate</Button>
          <Button variant="secondary" onClick={() => setEditing(true)}>✎ Edit input</Button>
        </div>
        <div className="spacer" />
        <Button onClick={() => { setSaved(true); toast(`Saved “${title}” to your library.`); }} disabled={saved}>
          {saved ? 'Saved ✓' : 'Save as playlist'}
        </Button>
        <Button variant="secondary" onClick={() => leave(() => { dropInMailbox(); home(); toast('Dropped in the Studio Crew mailbox.'); })}>
          Drop in the group mailbox
        </Button>
      </div>
      {editing && <WordsSheet initial={node?.mode === 'words' ? node.text : ''} onSubmit={editInput} onClose={() => setEditing(false)} />}
    </>
  );
}
