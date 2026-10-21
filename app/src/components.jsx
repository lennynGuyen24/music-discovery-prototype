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

export function Chip({ children, filled, pop, style }) {
  return (
    <span className={`chip t-caption${filled ? ' filled' : ''}${pop ? ' pop' : ''}`} style={style}>
      {children}
    </span>
  );
}

export function SongRow({ title, artist, playing, progress, onToggle }) {
  return (
    <button type="button" className="song-row" onClick={onToggle} aria-pressed={playing}
      aria-label={`${playing ? 'Pause' : 'Play'} ${title} by ${artist.split(' · ')[0]}`}>
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
  );
}

const NAV = [
  { id: 'home', label: 'Home', src: navHome, left: 1.75, top: 1.75 },
  { id: 'community', label: 'Community', src: navCommunity, left: 0.833, top: 2.667 },
  { id: 'remote', label: 'Remote', src: navRemote, left: 2.667, top: 2.667 },
  { id: 'profile', label: 'Profile', src: navProfile, left: 2.667, top: 2.667 },
];

export function BottomNav({ active, onSelect }) {
  return (
    <nav className="bottom-nav">
      {NAV.map((item) => (
        <button key={item.id} type="button"
          className={`nav-item${active === item.id ? ' active' : ''}`}
          aria-current={active === item.id ? 'page' : undefined}
          onClick={() => onSelect(item.id)}>
          <span className="icon"><Icon src={item.src} left={item.left} top={item.top} /></span>
          <span className="t-caption">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

export function Toast({ message }) {
  if (!message) return null;
  return <div className="toast" role="status">{message}</div>;
}
