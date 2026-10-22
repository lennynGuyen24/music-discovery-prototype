import { useCallback, useEffect, useRef, useState } from 'react';
import { BottomNav, HomeIndicator, StatusBar, Toast } from './components.jsx';
import { MiniPlayer, PlayerProvider } from './player.jsx';
import { Community, ConnectApps, Home, PickVibes, Profile, Remote, Results, Scanning, Welcome } from './screens.jsx';
import { INITIAL_MAILBOX } from './data.js';

const SCREENS = {
  welcome: Welcome,
  connect: ConnectApps,
  vibes: PickVibes,
  home: Home,
  community: Community,
  remote: Remote,
  profile: Profile,
  scanning: Scanning,
  results: Results,
};

// Bottom-nav destinations. Switching tabs starts a fresh stack instead of pushing.
const TABS = ['home', 'community', 'remote', 'profile'];

export default function App() {
  return <PlayerProvider><Shell /></PlayerProvider>;
}

// No mini-player during onboarding, while the Node scans, or on the Remote (it is the full player).
const NO_MINI = ['welcome', 'connect', 'vibes', 'scanning', 'remote'];

function Shell() {
  const [stack, setStack] = useState(['welcome']);
  const [direction, setDirection] = useState('forward');
  const [connected, setConnected] = useState(['Spotify']);
  const [vibes, setVibes] = useState([]);
  const [node, setNode] = useState(null);
  const [mailbox, setMailbox] = useState(INITIAL_MAILBOX);
  const [toastMsg, setToastMsg] = useState(null); // { message, action? }
  const toastTimer = useRef(null);

  const screen = stack[stack.length - 1];
  // Set when an onboarding screen is reopened from a tab (Profile → Connect apps / Your vibes), so it returns there.
  const returnTo = ['connect', 'vibes'].includes(screen) && TABS.includes(stack[stack.length - 2]) ? stack[stack.length - 2] : null;
  const scale = useFitScale();

  const go = useCallback((id) => {
    setDirection('forward');
    // Scanning is a transient step: Results' back button returns to where the Node started.
    // Starting a new scan (e.g. "Edit input") replaces the old results instead of stacking them.
    setStack((s) => [...s.filter((x) => x !== 'scanning' && !(id === 'scanning' && x === 'results')), id]);
  }, []);
  const back = useCallback(() => {
    setDirection('back');
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }, []);
  const home = useCallback(() => {
    setDirection('back');
    setStack((s) => s.slice(0, s.indexOf('home') + 1));
  }, []);
  // toast('Saved', { label: 'Undo', onClick }) adds an action button; toasts with actions stay longer.
  const toast = useCallback((message, action) => {
    clearTimeout(toastTimer.current);
    setToastMsg({ message, action });
    toastTimer.current = setTimeout(() => setToastMsg(null), action ? 5000 : 2600);
  }, []);
  const runToastAction = () => {
    toastMsg?.action?.onClick();
    clearTimeout(toastTimer.current);
    setToastMsg(null);
  };

  // Mailbox: your own drops are kept (as "Sent") but never count as new.
  const newInMailbox = mailbox.filter((m) => !m.mine && !m.read).length;
  const drop = useCallback((title, track, crews) => {
    const items = crews.map((crew) => ({ id: `${Date.now()}-${crew}`, from: 'You', crew, title, track, mine: true, read: true }));
    setMailbox((m) => [...items, ...m]);
    return items.map((i) => i.id);
  }, []);
  const undrop = useCallback((ids) => setMailbox((m) => m.filter((i) => !ids.includes(i.id))), []);
  const markRead = useCallback((id) => setMailbox((m) => m.map((i) => (i.id === id ? { ...i, read: true } : i))), []);
  const tab = useCallback((id) => {
    if (id === screen) return;
    if (!SCREENS[id]) return toast(`${id[0].toUpperCase() + id.slice(1)} isn’t in this prototype yet.`);
    setDirection('tab');
    setStack([id]);
  }, [screen, toast]);

  const Screen = SCREENS[screen];

  return (
    <div className="stage">
      <main className="device" style={scale < 1 ? { zoom: scale } : undefined}>
        <div key={stack.length + screen} className={`screen ${screen === 'scanning' ? 'scanning ' : ''}enter-${direction}`}>
          <StatusBar />
          <Screen
            go={go}
            back={back}
            home={home}
            tab={tab}
            returnTo={returnTo}
            toast={toast}
            connected={connected}
            setConnected={setConnected}
            vibes={vibes}
            setVibes={setVibes}
            node={node}
            startNode={setNode}
            mailbox={mailbox}
            newInMailbox={newInMailbox}
            drop={drop}
            undrop={undrop}
            markRead={markRead}
          />
          {!NO_MINI.includes(screen) && <MiniPlayer onOpen={() => tab('remote')} />}
          {TABS.includes(screen) ? <BottomNav active={screen} onSelect={tab} /> : <HomeIndicator />}
        </div>
        <Toast message={toastMsg?.message} action={toastMsg?.action} onAction={runToastAction} />
      </main>
    </div>
  );
}

// Shrinks the phone frame to fit short desktop windows (phones get the full-screen layout instead).
function useFitScale() {
  const calc = () => (window.innerWidth <= 500 ? 1 : Math.min(1, (window.innerHeight - 48) / 894, (window.innerWidth - 48) / 422));
  const [scale, setScale] = useState(calc);
  useEffect(() => {
    const onResize = () => setScale(calc());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return scale;
}
