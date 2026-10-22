import { useEffect, useRef, useState } from 'react';
import backIcon from './assets/back.svg';
import playIcon from './assets/play.svg';

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

// Placeholder cover art: colors and angle derived from the track id, so every track looks different.
const ART_COLORS = ['var(--color-accent-blue)', 'var(--color-accent-magenta)', 'var(--color-accent-sun)', 'var(--color-bg-navy)'];
export function Artwork({ track, size = 52, className = '', children }) {
  let h = 7;
  for (const ch of track.id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const a = h % 4;
  const b = (a + 1 + ((h >> 4) % 3)) % 4;
  return (
    <span className={`art ${className}`} aria-hidden="true"
      style={{ width: size, height: size, backgroundImage: `linear-gradient(${(h >> 8) % 360}deg, ${ART_COLORS[a]}, ${ART_COLORS[b]})` }}>
      {children}
    </span>
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

// Marks a feature that isn't built yet, so it reads as "coming soon" before anyone taps it.
export function Soon() {
  return <span className="soon-badge t-caption">Soon</span>;
}

// Figma "List Row": leading dot, title (+ optional line under it), trailing meta. A button when it has onClick.
export function ListRow({ title, sub, meta, dot = 'magenta', metaOn, soon, onClick, ...props }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag type={onClick ? 'button' : undefined} className={`list-row${soon ? ' soon' : ''}`} onClick={onClick} {...props}>
      <span className="dot" style={{ background: dot === 'subtle' ? 'var(--color-border-subtle)' : `var(--color-accent-${dot})` }} />
      <span className="title">
        <span className="t-body-strong">{title}</span>
        {sub && <span className="t-body muted sub">{sub}</span>}
      </span>
      {soon ? <Soon /> : meta && <span className={`t-caption${metaOn ? '' : ' muted'}`}>{meta}</span>}
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
  const pct = Math.round(value * 100);
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
        aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-valuetext={`${pct}%`}
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
      <span className="t-body-strong knob-value" aria-hidden="true">{pct}</span>
    </div>
  );
}

export function HomeIndicator() {
  return <div className="home-indicator" aria-hidden="true"><span /></div>;
}

export function Button({ variant = 'primary', soon, children, ...props }) {
  return (
    <button type="button" className={`btn btn-${variant}${soon ? ' soon' : ''}`} {...props}>
      {children}{soon && <span className="sr-only"> (coming soon)</span>}
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
// variant="tag" is an outlined label you add to a track (selected shows a check).
export function Chip({ children, filled, pop, style, onClick, variant, soon }) {
  const className = `chip t-caption${variant ? ` ${variant}` : ''}${filled ? ' filled' : ''}${pop ? ' pop' : ''}${soon ? ' soon' : ''}`;
  if (soon) {
    return <button type="button" className={className} style={style} onClick={onClick}>{children}<span className="sr-only"> (coming soon)</span></button>;
  }
  if (onClick) {
    return <button type="button" className={className} style={style} aria-pressed={!!filled} onClick={onClick}>{children}</button>;
  }
  return <span className={className} style={style}>{children}</span>;
}

// A track row: the main area plays/pauses; "⋯" (or a long press) opens More/Less like this.
// Single-choice filter (radio group): arrow keys move between options.
export function Segmented({ label, options, value, onChange }) {
  const onKeyDown = (e) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const i = Math.max(0, options.indexOf(value));
    const next = options[(i + step + options.length) % options.length];
    onChange(next);
    e.currentTarget.querySelector(`[data-value="${next}"]`)?.focus();
  };
  return (
    <div className="segmented" role="radiogroup" aria-label={label} onKeyDown={onKeyDown}>
      {options.map((o) => (
        <button key={o} type="button" role="radio" data-value={o} aria-checked={value === o}
          tabIndex={value === o || (!options.includes(value) && o === options[0]) ? 0 : -1}
          className={`t-caption${value === o ? ' on' : ''}`} onClick={() => onChange(o)}>{o}</button>
      ))}
    </div>
  );
}

export function SongRow({ track, title, artist, playing, progress, onToggle, menu }) {
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
        <Artwork track={track} className="cover">
          {playing && <span className="eq"><i /><i /><i /></span>}
        </Artwork>
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

// Tab icons share the Node tiles' 24px, 2px-stroke, round-cap style. The active tab fills its shape.
const NAV_ICONS = {
  home: (on) => (
    <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" fill={on ? 'currentColor' : 'none'} />
  ),
  community: (on) => (
    <>
      <circle cx="9" cy="7" r="4" fill={on ? 'currentColor' : 'none'} />
      <path d="M2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1z" fill={on ? 'currentColor' : 'none'} />
      <path d="M16 3.13a4 4 0 0 1 0 7.75M22 21v-1a4 4 0 0 0-3-3.85" />
    </>
  ),
  remote: (on) => (
    <>
      <path d="M4 6h16M4 12h16M4 18h16" />
      {[[9, 6], [15, 12], [7, 18]].map(([cx, cy]) => (
        <circle key={cy} cx={cx} cy={cy} r="2.5" fill={on ? 'currentColor' : 'var(--color-bg-ink)'} />
      ))}
    </>
  ),
  profile: (on) => (
    <>
      <circle cx="12" cy="8" r="4" fill={on ? 'currentColor' : 'none'} />
      <path d="M4 21a8 8 0 0 1 16 0z" fill={on ? 'currentColor' : 'none'} />
    </>
  ),
};

const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'community', label: 'Community' },
  { id: 'remote', label: 'Remote' },
  { id: 'profile', label: 'Profile' },
];

// Active tab: filled icon, white label and a sun indicator bar, not just a brighter color.
export function BottomNav({ active, onSelect }) {
  return (
    <nav className="bottom-nav" aria-label="Main">
      {NAV.map((item) => {
        const on = active === item.id;
        return (
          <button key={item.id} type="button" className={`nav-item${on ? ' active' : ''}`}
            aria-current={on ? 'page' : undefined} onClick={() => onSelect(item.id)}>
            <svg className="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {NAV_ICONS[item.id](on)}
            </svg>
            <span className="t-caption">{item.label}</span>
          </button>
        );
      })}
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

export function Toast({ message, action, onAction }) {
  if (!message) return null;
  return (
    <div className="toast" role="status">
      <span>{message}</span>
      {action && <button type="button" className="toast-action" onClick={onAction}>{action.label}</button>}
    </div>
  );
}

export function InboxIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" />
    </svg>
  );
}
