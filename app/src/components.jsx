import { useEffect, useRef, useState } from 'react';
import { playPreview } from './audio.js';
import backIcon from './assets/back.svg';
import playIcon from './assets/play.svg';
import navHome from './assets/nav-home.svg';
import navCommunity from './assets/nav-community.svg';
import navRemote from './assets/nav-remote.svg';
import navProfile from './assets/nav-profile.svg';

// Each icon SVG keeps its native width/height; left/top place it in its frame exactly as in Figma.
export function Icon({ src, left, top }) {
  return <img src={src} alt="" style={{ left, top }} />;
}

export function Glow({ src, left, top, size }) {
  return (
    <div className="glow" style={{ left, top, width: size, height: size }} aria-hidden="true">
      <img src={src} alt="" />
    </div>
  );
}

// A blurred circle in a token color; `blur` is the Figma layer-blur radius (CSS uses half).
export function Blob({ color, left, top, size, opacity = 0.5, blur = 120 }) {
  return (
    <div className="blob" aria-hidden="true"
      style={{ left, top, width: size, height: size, opacity, background: `var(--color-accent-${color})`, filter: `blur(${blur / 2}px)` }} />
  );
}

export function StatusBar() {
  return (
    <div className="status-bar" aria-hidden="true">
      <span>9:41</span>
      <span className="status-icons">
        <svg width="19" height="12" viewBox="0 0 19 12" fill="#fff">
          <rect x="0" y="8" width="3.2" height="4" rx="1" />
          <rect x="5" y="5.5" width="3.2" height="6.5" rx="1" />
          <rect x="10" y="3" width="3.2" height="9" rx="1" />
          <rect x="15" y="0" width="3.2" height="12" rx="1" />
        </svg>
        <svg width="17" height="12" viewBox="0 0 17 12" fill="#fff">
          <path d="M8.5 2.4c2.3 0 4.4.9 6 2.4l1.2-1.2A10.2 10.2 0 0 0 8.5.7 10.2 10.2 0 0 0 1.3 3.6l1.2 1.2a8.5 8.5 0 0 1 6-2.4Z" />
          <path d="M8.5 5.8c1.4 0 2.6.5 3.6 1.4l1.2-1.2a6.8 6.8 0 0 0-9.6 0l1.2 1.2c1-.9 2.2-1.4 3.6-1.4Z" />
          <path d="M8.5 9.1c.5 0 .9.2 1.2.5L8.5 11 7.3 9.6c.3-.3.7-.5 1.2-.5Z" />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.8" stroke="#fff" opacity="0.4" />
          <rect x="2" y="2" width="20" height="9" rx="2.5" fill="#fff" />
          <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="#fff" opacity="0.5" />
        </svg>
      </span>
    </div>
  );
}

// Figma "List Row": leading dot, title, trailing meta. A button when it has onClick.
export function ListRow({ title, meta, dot = 'magenta', metaOn, onClick, ...props }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag type={onClick ? 'button' : undefined} className="list-row" onClick={onClick} {...props}>
      <span className="dot" style={{ background: dot === 'subtle' ? 'var(--color-border-subtle)' : `var(--color-accent-${dot})` }} />
      <span className="title t-body-strong">{title}</span>
      {meta && <span className={`t-caption${metaOn ? '' : ' muted'}`}>{meta}</span>}
    </Tag>
  );
}

// Onboarding step bar: the current step is the long dash.
export function Progress({ step, total }) {
  return (
    <div className="progress-steps" aria-label={`Step ${step} of ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <i key={i} className={i < step ? 'done' : ''} style={{ width: i === step - 1 ? 32 : 16 }} />
      ))}
    </div>
  );
}

// Figma "Knob": a 270° dial. Drag up/down or use the arrow keys.
const clamp01 = (v) => Math.min(1, Math.max(0, v));
export function Knob({ label, value, onChange }) {
  const drag = useRef(null);
  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { y: e.clientY, v: value };
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    onChange(clamp01(drag.current.v + (drag.current.y - e.clientY) / 150));
  };
  const onKeyDown = (e) => {
    const step = { ArrowUp: 0.05, ArrowRight: 0.05, ArrowDown: -0.05, ArrowLeft: -0.05 }[e.key];
    if (step) { e.preventDefault(); onChange(clamp01(value + step)); }
  };
  return (
    <div className="knob">
      <div className="dial" role="slider" tabIndex={0} aria-label={label}
        aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove}
        onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}
        onKeyDown={onKeyDown}>
        <svg viewBox="0 0 72 72" aria-hidden="true">
          <circle className="track" cx="36" cy="36" r="33" pathLength="360" strokeDasharray="270 90" transform="rotate(135 36 36)" />
          <circle className="level" cx="36" cy="36" r="33" pathLength="360" strokeDasharray={`${270 * value} 360`} transform="rotate(135 36 36)" />
        </svg>
        <i className="pointer" style={{ transform: `rotate(${-135 + 270 * value}deg)` }} />
      </div>
      <span className="t-caption muted">{label}</span>
    </div>
  );
}

export function HomeIndicator() {
  return <div className="home-indicator" aria-hidden="true"><span /></div>;
}

export function Button({ variant = 'primary', children, ...props }) {
  return (
    <button type="button" className={`btn btn-${variant}`} {...props}>
      {children}
    </button>
  );
}

export function TopBar({ title, onBack }) {
  return (
    <div className="top-bar">
      <button type="button" className="back-btn" onClick={onBack} aria-label="Back">
        <img src={backIcon} alt="" />
      </button>
      <p className="t-caption muted">{title}</p>
    </div>
  );
}

// Figma "Chip" (State=Default/Selected). Pass onClick to make it a toggle button.
export function Chip({ children, filled, pop, style, onClick }) {
  const className = `chip t-caption${filled ? ' filled' : ''}${pop ? ' pop' : ''}`;
  if (onClick) {
    return <button type="button" className={className} style={style} aria-pressed={!!filled} onClick={onClick}>{children}</button>;
  }
  return <span className={className} style={style}>{children}</span>;
}

// A track row: the main area plays/pauses; "⋯" (or a long press) opens More/Less like this.
export function SongRow({ title, artist, playing, progress, onToggle, menu }) {
  const [open, setOpen] = useState(false);
  const press = useRef(null);
  const menuRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    menuRef.current?.querySelector('button')?.focus();
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    const onDown = (e) => { if (!menuRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDown); };
  }, [open]);
  const longPress = menu && {
    onPointerDown: () => { press.current = setTimeout(() => { press.current = 'fired'; setOpen(true); }, 500); },
    onPointerUp: () => { if (press.current !== 'fired') clearTimeout(press.current); },
    onPointerLeave: () => { if (press.current !== 'fired') clearTimeout(press.current); },
    onContextMenu: (e) => { e.preventDefault(); setOpen(true); },
  };
  const onMain = () => {
    if (press.current === 'fired') { press.current = null; return; } // the long press opened the menu
    onToggle();
  };
  return (
    <div className="song-row">
      <button type="button" className="song-main" onClick={onMain} aria-pressed={playing}
        aria-label={`${playing ? 'Pause' : 'Play'} ${title} by ${artist.split(' · ')[0]}`} {...longPress}>
        <span className="cover">
          {playing && <span className="eq"><i /><i /><i /></span>}
        </span>
        <span className="text">
          <p className="t-body-strong">{title}</p>
          <p className="t-body muted">{artist}</p>
          {playing && <span className="progress"><i style={{ width: `${progress * 100}%` }} /></span>}
        </span>
        <span className="play-btn">
          {playing
            ? <span className="pause-icon"><i /><i /></span>
            : <img src={playIcon} alt="" />}
        </span>
      </button>
      {menu && (
        <div className="more" ref={menuRef}>
          <button type="button" className="more-btn" aria-label={`More options for ${title}`} aria-expanded={open}
            aria-haspopup="menu" onClick={() => setOpen((o) => !o)}>⋯</button>
          {open && (
            <div className="menu" role="menu">
              {menu.map((item) => (
                <button key={item.label} type="button" role="menuitem" onClick={() => { setOpen(false); item.onSelect(); }}>{item.label}</button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const NAV = [
  { id: 'home', label: 'Home', src: navHome, left: 1.75, top: 1.75, w: 18.5, h: 18.5 },
  { id: 'community', label: 'Community', src: navCommunity, left: 0.833, top: 2.667, w: 20.333, h: 17.583 },
  { id: 'remote', label: 'Remote', src: navRemote, left: 2.667, top: 2.667, w: 16.667, h: 16.667 },
  { id: 'profile', label: 'Profile', src: navProfile, left: 2.667, top: 2.667, w: 16.667, h: 17.583 },
];

// Icons are drawn as masks so they take the label's color (muted, or white when active).
export function BottomNav({ active, onSelect }) {
  return (
    <nav className="bottom-nav">
      {NAV.map((item) => (
        <button key={item.id} type="button"
          className={`nav-item${active === item.id ? ' active' : ''}`}
          aria-current={active === item.id ? 'page' : undefined}
          onClick={() => onSelect(item.id)}>
          <span className="icon">
            <i style={{ left: item.left, top: item.top, width: item.w, height: item.h, WebkitMaskImage: `url(${item.src})`, maskImage: `url(${item.src})` }} />
          </span>
          <span className="t-caption">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

// Bottom sheet dialog: Esc or the scrim closes it, focus moves in and is kept inside, then returns.
export function Sheet({ label, onClose, children }) {
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const prev = document.activeElement;
    const el = ref.current;
    (el.querySelector('textarea, input, button') ?? el).focus();
    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); closeRef.current(); }
      if (e.key !== 'Tab') return;
      const items = [...el.querySelectorAll('button:not([disabled]), textarea, input, [tabindex="0"]')];
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); prev?.focus?.(); };
  }, []);
  return (
    <div className="scrim" onClick={onClose}>
      <div ref={ref} className="sheet" role="dialog" aria-modal="true" aria-label={label} tabIndex={-1} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// The Node's Words input. Also reopened from Results ("Edit input") with the text filled in.
export function WordsSheet({ initial = '', onSubmit, onClose }) {
  const [words, setWords] = useState(initial);
  const submit = () => { if (words.trim()) onSubmit(words.trim()); };
  return (
    <Sheet label="Describe your vibe" onClose={onClose}>
      <p className="t-caption muted">Words</p>
      <p className="t-title">Describe the feeling</p>
      <textarea value={words} onChange={(e) => setWords(e.target.value)} aria-label="Describe the feeling"
        placeholder="rainy rooftop, missing someone"
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }} />
      <Button onClick={submit} disabled={!words.trim()}>Feed the Node</Button>
    </Sheet>
  );
}

export function Toast({ message }) {
  if (!message) return null;
  return <div className="toast" role="status">{message}</div>;
}

// One preview at a time per screen; stops when the screen unmounts.
export function usePreview() {
  const [playing, setPlaying] = useState(null);
  const stopRef = useRef(null);
  useEffect(() => () => stopRef.current?.(), []);
  const toggle = (id, soundIndex) => {
    stopRef.current?.();
    stopRef.current = null;
    if (playing === id) return setPlaying(null);
    setPlaying(id);
    stopRef.current = playPreview(soundIndex, () => setPlaying(null));
  };
  return { playing, toggle };
}
