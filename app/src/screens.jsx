import { useEffect, useRef, useState } from 'react';
import { Artwork, Blob, Button, Chip, Glow, Icon, InboxIcon, Knob, ListRow, Progress, Segmented, Sheet, Soon, SongRow, TopBar, WordsSheet } from './components.jsx';
import { CREWS, DECK, detectedWords, inputLabels, matchSet, rankTracks, resultTitle, SHELF, SNIPPETS, STATIONS, TAG_OPTIONS, whyLine } from './data.js';
import { usePlayer, useProgress } from './player.jsx';

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
          <Button variant="secondary" soon onClick={() => toast('Sign-in isn’t in this prototype yet.')}>I already have an account</Button>
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
      <TopBar title={returnTo ? 'Profile' : 'Welcome'} onBack={back} />
      <div className="content gap-16">
        <div className="spacer" />
        {returnTo ? <p className="t-caption muted">Profile · Music apps</p> : (
          <>
            <Progress step={2} total={3} />
            <p className="t-caption muted">Step 2 of 3 · Onboarding</p>
          </>
        )}
        <h1 className="t-display-xl full" style={{ margin: 0 }}>Plug in your sound</h1>
        <p className="t-body muted full">Connect the apps you already listen on. <strong className="t-body-strong" style={{ color: 'var(--color-text-primary)' }}>The Node</strong> — the part of the app that turns a place, a sound, a photo or a feeling into music — learns your taste from them. Nothing gets posted without asking.</p>
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
          <Button onClick={() => (returnTo ? back() : go('vibes'))} disabled={connected.length === 0 || !!loading}>
            {loading ? `Connecting ${loading}…` : connected.length === 0 ? 'Connect at least one app' : returnTo ? 'Done' : 'Continue'}
          </Button>
          {!returnTo && <Button variant="secondary" onClick={() => go('vibes')} disabled={!!loading}>Skip for now</Button>}
        </div>
      </div>
    </>
  );
}

const VIBES = {
  Moods: ['Late night', 'Rainy days', 'Driving', 'Club', 'Sunday morning'],
  Genres: ['Soul', 'Afrobeats', 'City pop', 'Jazz samples', 'Bedroom pop', 'Ambient', 'Hyperpop', 'Lo-fi'],
};
const MIN_VIBES = 3;

export function PickVibes({ tab, back, returnTo, vibes, setVibes }) {
  const toggle = (v) => setVibes((vs) => (vs.includes(v) ? vs.filter((x) => x !== v) : [...vs, v]));
  const ready = vibes.length >= MIN_VIBES;
  return (
    <>
      <OnboardingBackdrop />
      <TopBar title={returnTo ? 'Profile' : 'Music apps'} onBack={back} />
      <div className="content gap-16">
        <div className="spacer" />
        {returnTo ? <p className="t-caption muted">Profile · Your vibes</p> : (
          <>
            <Progress step={3} total={3} />
            <p className="t-caption muted">Step 3 of 3 · Onboarding</p>
          </>
        )}
        <h1 className="t-display-xl full" style={{ margin: 0 }}>Pick your vibes</h1>
        <p className="t-body muted full">Pick at least {MIN_VIBES}. The Node uses them for your first daily prompt — change them any time in Profile.</p>
        {Object.entries(VIBES).map(([group, list]) => (
          <div key={group} className="full" role="group" aria-labelledby={`vibes-${group}`} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p id={`vibes-${group}`} className="t-caption muted">{group}</p>
            <div className="vibes">
              {list.map((v) => <Chip key={v} filled={vibes.includes(v)} onClick={() => toggle(v)}>{v}</Chip>)}
            </div>
          </div>
        ))}
        <div className="full" style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <Button onClick={() => (returnTo ? back() : tab('home'))} disabled={!ready}>{returnTo ? 'Save' : 'Start listening'}</Button>
          <p className="t-caption muted">
            {vibes.length} picked{ready ? ' ✓' : ` · ${MIN_VIBES - vibes.length} more to go`}
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

// Records friends dropped (and the ones you sent). Tapping one plays it and marks it read.
function MailboxSheet({ mailbox, markRead, onClose }) {
  const player = usePlayer();
  const tracks = mailbox.map((m) => m.track);
  return (
    <Sheet label="Group mailbox" onClose={onClose}>
      <p className="t-caption muted">Group mailbox</p>
      <p className="t-title">Records from your crews</p>
      <div className="mail-list">
        {mailbox.map((m) => (
          <button key={m.id} type="button" className={`mail-item${!m.mine && !m.read ? ' unread' : ''}`}
            onClick={() => { markRead(m.id); player.play(m.track, tracks, `Mailbox · ${m.crew}`); }}>
            <Artwork track={m.track} size={44} />
            <span className="mail-text">
              <span className="t-body-strong">“{m.title}”</span>
              <span className="t-body muted">{m.mine ? `You → ${m.crew}` : `${m.from} · ${m.crew}`} · {m.track.title}</span>
            </span>
            <span className="t-caption muted">{m.mine ? 'Sent' : m.read ? '' : 'New'}</span>
          </button>
        ))}
      </div>
      <Button variant="secondary" onClick={onClose}>Close</Button>
    </Sheet>
  );
}

export function Home({ go, mailbox, newInMailbox, markRead, toast, startNode }) {
  const now = new Date();
  const day = now.toLocaleDateString('en-US', { weekday: 'long' });
  const h = now.getHours();
  const greeting = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  const player = usePlayer();
  const [sheet, setSheet] = useState(false);
  const [inbox, setInbox] = useState(false);
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
        <div className="home-head full">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <p className="t-caption muted">{day} · {greeting}, Lan</p>
            <h1 className="t-display-l" style={{ margin: 0 }}>What’s your vibe?</h1>
          </div>
          <button type="button" className="inbox-btn" onClick={() => setInbox(true)}
            aria-label={`Group mailbox${newInMailbox ? `, ${newInMailbox} new` : ''}`}>
            <InboxIcon />
            {newInMailbox > 0 && <span className="badge" aria-hidden="true">{newInMailbox}</span>}
          </button>
        </div>
        <div className="node-card full">
          <p className="t-caption">The Node</p>
          <p className="t-title">Feed it a place, a sound, a photo or a feeling.</p>
          <p className="t-body node-explain">It turns what you give it into a playlist you haven’t heard yet.</p>
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
        <button type="button" className="card prompt-card soon"
          onClick={() => toast('Answering prompts isn’t in this prototype yet.')}>
          <span className="card-head">
            <span className="t-caption" style={{ color: 'var(--color-accent-magenta)' }}>Today’s prompt · Studio Crew</span>
            <Soon />
          </span>
          <p className="t-body-strong">“A song for a 2AM drive with the windows down”</p>
          <span className="answers">
            <span className="faces" aria-hidden="true"><i /><i /><i /></span>
            <span className="t-caption muted">6 of 9 answered · Add yours →</span>
          </span>
        </button>
        <div className="section-head full">
          <p className="t-caption muted">Picked for you</p>
          <button type="button" className="t-caption link soon" onClick={() => toast('The full catalogue opens in a later version.')}>See all<span className="sr-only"> (coming soon)</span></button>
        </div>
        <div className="shelf">
          {SNIPPETS.map((sn) => (
            <button key={sn.id} type="button" className="snippet" aria-pressed={player.isPlaying(sn.id)}
              aria-label={`${player.isPlaying(sn.id) ? 'Pause' : 'Play'} ${sn.title} by ${sn.artist}`}
              onClick={() => player.play(sn, SNIPPETS, 'Picked for you')}>
              <Artwork track={sn} size={124} className="cover">
                {player.isPlaying(sn.id) && <span className="eq"><i /><i /><i /></span>}
              </Artwork>
              <span className="t-body-strong">{sn.title}</span>
              <span className="t-caption muted">{sn.artist}</span>
            </button>
          ))}
        </div>
        <ListRow title={newInMailbox ? `${newInMailbox} new records in your mailbox` : 'Your group mailbox'}
          meta={newInMailbox ? 'New' : 'Open'} metaOn={newInMailbox > 0} onClick={() => setInbox(true)} />
      </div>
      {sheet && <WordsSheet onSubmit={submitWords} onClose={() => setSheet(false)} />}
      {inbox && <MailboxSheet mailbox={mailbox} markRead={markRead} onClose={() => setInbox(false)} />}
    </>
  );
}

/* ---------- 03 Community (curated) ---------- */
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

export function Community({ toast }) {
  const player = usePlayer();
  const [station, setStation] = useState(() => STATIONS.find((st) => player.track?.id === st.track.id) ?? STATIONS[0]);
  const tuned = player.isPlaying(station.track.id);

  const tuneIn = (st) => {
    setStation(st);
    player.play(st.track, [st.track], `Global radio · ${st.city}`);
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
            {tuned ? `Tuned in to ${station.city} · ${station.track.artist}` : `${station.city} · Someone’s spinning ${station.track.artist} — tune in`}
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
            <Chip soon onClick={() => toast('Messaging isn’t in this prototype yet.')}>Say hi</Chip>
            <Chip soon onClick={() => toast('Record swaps open in a later version.')}>Swap a record</Chip>
          </div>
        </section>
        <ListRow title="Touch tips" sub="Tap your RFID phone charm to a friend’s phone to swap a song." dot="sun" soon
          onClick={() => toast('Touch tips need the RFID phone charm — coming with the hardware.')} />
        <div className="full" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p className="t-caption muted">Q&amp;A</p>
          {[['Rainy-commute albums?', '18'], ['Underrated samples?', '42']].map(([q, n]) => (
            <ListRow key={q} title={q} sub={`${n} replies`} dot="blue" soon onClick={() => toast('Q&A threads aren’t in this prototype yet.')} />
          ))}
        </div>
      </div>
    </>
  );
}

/* ---------- 04 Remote Control (curated) ---------- */
// The Remote is the full player: it always shows what's actually playing.
export function Remote({ toast }) {
  const player = usePlayer();
  const progress = useProgress();
  const [labels, setLabels] = useState(['Late night']);
  useEffect(() => { if (!player.track) player.load(DECK.All, 'Remote · All'); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const track = player.track ?? DECK.All[0];
  const filter = Object.keys(DECK).find((f) => player.source === `Remote · ${f}`);
  const choose = (f) => player.load(DECK[f], `Remote · ${f}`, player.playing);
  const toggleLabel = (l) => setLabels((ls) => (ls.includes(l) ? ls.filter((x) => x !== l) : [...ls, l]));
  const TONE = [['energy', 'Energy'], ['mood', 'Mood'], ['tempo', 'Tempo']];

  return (
    <>
      <Blob color="magenta" left={0} top={140} size={400} opacity={0.45} blur={140} />
      <Blob color="blue" left={120} top={40} size={300} opacity={0.5} blur={120} />
      <div className="content gap-16" style={{ paddingBottom: 24 }}>
        <div className="full" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p className="t-caption muted">Remote · Living room speaker</p>
          <h1 className="t-display-l" style={{ margin: 0 }}>Now playing</h1>
        </div>
        <Segmented label="Filter the deck" options={Object.keys(DECK)} value={filter} onChange={choose} />
        <div className="now-playing full">
          <button type="button" className={`record${player.playing ? ' spinning' : ''}`} onClick={player.toggle}
            aria-label={`${player.playing ? 'Pause' : 'Play'} ${track.title}`} aria-pressed={player.playing}>
            <span className="sticker" aria-hidden="true" />
          </button>
          <div className="deck-meta">
            <p className="t-caption muted">{player.source || 'Queue'} · {player.index + 1} of {player.queue.length || 1}</p>
            <p className="t-title">{track.title}</p>
            <p className="t-body muted">{track.artist}</p>
            <span className="played"><i style={{ width: `${progress * 100}%` }} /></span>
          </div>
        </div>
        <div className="transport full" role="group" aria-label="Playback">
          <button type="button" className="tr-btn" onClick={player.prev} aria-label="Previous track"><span className="tri prev" /></button>
          <button type="button" className="tr-btn main" onClick={player.toggle} aria-label={player.playing ? 'Pause' : 'Play'}>
            {player.playing ? <span className="pause-icon"><i /><i /></span> : <span className="play-tri" />}
          </button>
          <button type="button" className="tr-btn" onClick={player.next} aria-label="Next track"
            disabled={player.index >= player.queue.length - 1}><span className="tri next" /></button>
        </div>
        <div className="card panel mix-panel">
          <div className="mix">
            {TONE.map(([k, label]) => (
              <Knob key={k} label={label} value={player.tone[k]} onChange={(v) => player.setTone(k, v)} />
            ))}
          </div>
          <p className="t-body muted">Energy brightens the sound, Mood shifts the key, Tempo changes the speed.</p>
        </div>
        <div className="full" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p className="t-caption muted">Label this track</p>
          <div className="chip-row">
            {['Late night', 'Driving'].map((l) => (
              <Chip key={l} variant="tag" filled={labels.includes(l)} onClick={() => toggleLabel(l)}>{labels.includes(l) ? `✓ ${l}` : l}</Chip>
            ))}
            <Chip variant="tag" soon onClick={() => toast('Custom labels arrive in a later version.')}>+ Add</Chip>
          </div>
        </div>
        <div className="tools full">
          <button type="button" className="card panel navy tool" style={{ borderColor: 'color-mix(in srgb, var(--color-accent-magenta) 60%, transparent)' }}
            onClick={() => toast('Sample finder is coming — it will show what this track is built on.')}>
            <span className="card-head"><span className="t-body-strong">Sample finder</span><Soon /></span>
            <span className="t-body muted">Hear what this track is built on →</span>
          </button>
          <button type="button" className="card panel navy tool" style={{ borderColor: 'color-mix(in srgb, var(--color-accent-sun) 60%, transparent)' }}
            onClick={() => toast('Friends’ stickers open in a later version.')}>
            <span className="card-head"><span className="t-body-strong">Stickers</span><Soon /></span>
            <span className="t-body muted">3 left on this record by friends →</span>
          </button>
        </div>
      </div>
    </>
  );
}

/* ---------- 05 Profile (curated) ---------- */
const SPINES = ['magenta', 'blue', 'sun', 'card', 'magenta', 'subtle', 'blue', 'sun', 'magenta', 'card', 'blue', 'sun', 'subtle', 'magenta', 'blue', 'sun'];
const spineColor = (c) => (c === 'card' ? 'var(--color-surface-card)' : c === 'subtle' ? 'var(--color-border-subtle)' : `var(--color-accent-${c})`);

export function Profile({ go, toast, connected, vibes }) {
  const player = usePlayer();
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
            <button type="button" className="t-caption link soon" onClick={() => toast('Arranging your room arrives with the 3D room in a later version.')}>Edit<span className="sr-only"> (coming soon)</span></button>
          </div>
          <div className="room-shelf">
            {SHELF.map((tr, i) => (
              <button key={tr.id} type="button" className={`spine${player.isPlaying(tr.id) ? ' out' : ''}`}
                aria-label={`${player.isPlaying(tr.id) ? 'Pause' : 'Play'} ${tr.title} by ${tr.artist}`}
                style={{ width: i % 3 === 0 ? 12 : 8, height: 46 + ((i * 7) % 14), background: spineColor(SPINES[i % SPINES.length]) }}
                onClick={() => player.play(tr, SHELF, 'Listening room')} />
            ))}
          </div>
          <p className="t-caption muted">The record on the table plays whatever you’re on right now.</p>
        </section>
        <div className="full" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <ListRow title="Connect music apps" meta={`${connected.length} linked`} dot="blue" onClick={() => go('connect')} />
          <ListRow title="Your vibes" meta={`${vibes.length} picked`} dot="magenta" onClick={() => go('vibes')} />
          <ListRow title="Settings" dot="subtle" soon onClick={() => toast('Settings aren’t in this prototype yet.')} />
        </div>
      </div>
    </>
  );
}

/* ---------- 05 Node · Scanning ---------- */
const SCAN_MS = 4200;

// Shown before the browser's own mic/camera prompt, so people know why it's asked.
const DEVICE_ASK = {
  mic: {
    icon: iconMic, left: 4, top: 1, title: 'Let the Node listen?', allow: 'Allow microphone',
    body: 'It listens for a few seconds — to you humming, describing a vibe, or the room around you. Nothing is recorded or saved.',
  },
  camera: {
    icon: iconCamera, left: 2, top: 2, title: 'Let the Node look around?', allow: 'Allow camera',
    body: 'It looks through your camera for a few seconds to read the place you’re in. No photos are saved.',
  },
};

export function Scanning({ go, back, node, permissions, allowDevice }) {
  const ask = DEVICE_ASK[node?.mode];
  // 'ask' → explainer; 'device' → real mic/camera; 'simulate' → no device ("Not now")
  const [stage, setStage] = useState(ask && !permissions[node.mode] ? 'ask' : ask ? 'device' : 'simulate');
  const videoRef = useRef(null);
  const [level, setLevel] = useState(Array(9).fill(4));
  const [revealed, setRevealed] = useState(0);
  const [note, setNote] = useState('');
  const tags = detectedWords(node);
  const labels = inputLabels(node);
  const listening = node?.mode === 'mic';
  const { pause } = usePlayer();
  useEffect(() => { if (listening) pause(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Real camera / microphone input (only after the explainer said yes)
  useEffect(() => {
    if (stage !== 'device') return;
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
  }, [node, stage]);

  // Reveal detected tags one by one, then move to results
  useEffect(() => {
    if (stage === 'ask') return;
    const timers = tags.map((_, i) => setTimeout(() => setRevealed(i + 1), 1300 + i * 700));
    timers.push(setTimeout(() => go('results'), SCAN_MS));
    return () => timers.forEach(clearTimeout);
  }, [stage]); // eslint-disable-line react-hooks/exhaustive-deps

  if (stage === 'ask') {
    return (
      <>
        <Glow src={glowScan1} left={-40} top={300} size={480} />
        <TopBar title={labels.bar} onBack={back} />
        <div className="content gap-16 permission">
          <div className="spacer" />
          <span className="permission-icon"><Icon src={ask.icon} left={ask.left} top={ask.top} /></span>
          <h1 className="t-title" style={{ margin: 0 }}>{ask.title}</h1>
          <p className="t-body muted">{ask.body}</p>
          <p className="t-body muted">Your browser will ask next. You can turn it off any time in its settings.</p>
          <div className="spacer" />
          <Button onClick={() => { allowDevice(node.mode); setStage('device'); }}>{ask.allow}</Button>
          <Button variant="secondary" onClick={() => { setNote(`Not using the ${node.mode === 'mic' ? 'mic' : 'camera'} — simulating it`); setStage('simulate'); }}>Not now</Button>
        </div>
      </>
    );
  }

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

// Pick which crews get the Node. Nothing is sent until you confirm.
function DropSheet({ title, onConfirm, onClose }) {
  const [crews, setCrews] = useState([CREWS[0].name]);
  const toggle = (n) => setCrews((cs) => (cs.includes(n) ? cs.filter((x) => x !== n) : [...cs, n]));
  return (
    <Sheet label="Drop in the group mailbox" onClose={onClose}>
      <p className="t-caption muted">Group mailbox</p>
      <p className="t-title">Drop “{title}” in…</p>
      <div className="crew-list" role="group" aria-label="Crews">
        {CREWS.map((c) => (
          <label key={c.id} className="crew">
            <input type="checkbox" checked={crews.includes(c.name)} onChange={() => toggle(c.name)} />
            <span className="t-body-strong">{c.name}</span>
            <span className="t-caption muted">{c.members} people</span>
          </label>
        ))}
      </div>
      <Button onClick={() => onConfirm(crews)} disabled={!crews.length}>
        {crews.length ? `Drop in ${crews.length === 1 ? crews[0] : `${crews.length} crews`}` : 'Pick a crew'}
      </Button>
      <Button variant="secondary" onClick={onClose}>Cancel</Button>
    </Sheet>
  );
}

export function Results({ go, back, tab, node, startNode, toast, drop, undrop }) {
  const set = matchSet(node);
  const title = resultTitle(node);
  const [tags, setTags] = useState(set.tags);
  const [liked, setLiked] = useState([]);
  const [hidden, setHidden] = useState([]);
  const [seed, setSeed] = useState(0);
  const [editing, setEditing] = useState(false);
  const tracks = rankTracks(set, tags, { liked, hidden, seed });
  const likedTitles = tracks.filter((t) => liked.includes(t.id)).map((t) => t.title);

  const player = usePlayer();
  const progress = useProgress();
  const [saved, setSaved] = useState(false);
  const [dropping, setDropping] = useState(false);
  const [dropped, setDropped] = useState(null); // ids, so Undo can take them back
  const toggle = (track) => player.play(track, tracks, `Your Node · ${title}`);
  const confirmDrop = (crews) => {
    const ids = drop(title, tracks[0], crews);
    setDropping(false);
    setDropped(ids);
    toast(`Dropped in ${crews.join(' + ')}.`, { label: 'Undo', onClick: () => { undrop(ids); setDropped(null); } });
  };

  const swapTag = (kind) => setTags((tg) => {
    const opts = TAG_OPTIONS[kind];
    return { ...tg, [kind]: opts[(opts.indexOf(tg[kind]) + 1) % opts.length] };
  });
  const setTag = (kind, value) => setTags((tg) => ({ ...tg, [kind]: value }));
  const moreLike = (t) => { setLiked((l) => [...l.filter((x) => x !== t.id), t.id]); toast(`More like “${t.title}” coming up.`); };
  const lessLike = (t) => {
    if (player.isPlaying(t.id)) player.pause();
    setHidden((h) => [...h, t.id]);
    toast(`Got it — less like “${t.title}”.`);
  };
  const editInput = (text) => {
    setEditing(false);
    startNode({ mode: 'words', text });
    go('scanning');
  };

  const [a1, a2] = set.accents;

  return (
    <>
      <Blob color={a1} left={-200} top={-200} size={560} opacity={0.5} blur={160} />
      <Blob color={a2} left={160} top={-120} size={420} opacity={0.45} blur={140} />
      <TopBar title="Your Node" onBack={back} />
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
            <SongRow key={t.id} track={t} title={t.title} artist={`${t.artist} · ${t.note.toLowerCase()}`}
              playing={player.isPlaying(t.id)} progress={player.track?.id === t.id ? progress : 0} onToggle={() => toggle(t)}
              menu={[{ label: 'More like this', onSelect: () => moreLike(t) }, { label: 'Less like this', onSelect: () => lessLike(t) }]} />
          ))}
        </div>
        <p className="t-body muted full why"><span className="t-body-strong">Why these picks · </span>{whyLine(set, tags, likedTitles)}</p>
        <div className="refine full">
          <Button variant="secondary" onClick={() => setSeed((n) => n + 1)}>↻ Regenerate</Button>
          <Button variant="secondary" onClick={() => setEditing(true)}>✎ Edit input</Button>
        </div>
        <div className="spacer" />
        <Button onClick={() => {
          setSaved(true);
          // "View" opens the saved playlist on the Remote, already playing.
          toast(`Saved “${title}” ✓`, { label: 'View', onClick: () => { player.load(tracks, `Playlist · ${title}`, true); tab('remote'); } });
        }} disabled={saved}>
          {saved ? 'Saved ✓' : 'Save as playlist'}
        </Button>
        <Button variant="secondary" onClick={() => setDropping(true)} disabled={!!dropped}>
          {dropped ? 'Dropped ✓' : 'Drop in the group mailbox'}
        </Button>
      </div>
      {dropping && <DropSheet title={title} onConfirm={confirmDrop} onClose={() => setDropping(false)} />}
      {editing && <WordsSheet initial={node?.mode === 'words' ? node.text : ''} onSubmit={editInput} onClose={() => setEditing(false)} />}
    </>
  );
}
