import { useCallback, useEffect, useRef, useState } from 'react';
import { HomeIndicator, StatusBar, Toast } from './components.jsx';
import { ChooseInput, ConnectApps, Home, Results, Scanning, Welcome } from './screens.jsx';

const SCREENS = {
  welcome: Welcome,
  connect: ConnectApps,
  home: Home,
  input: ChooseInput,
  scanning: Scanning,
  results: Results,
};

export default function App() {
  const [stack, setStack] = useState(['welcome']);
  const [direction, setDirection] = useState('forward');
  const [connected, setConnected] = useState(['Spotify']);
  const [node, setNode] = useState(null);
  const [mailbox, setMailbox] = useState(2);
  const [toastMsg, setToastMsg] = useState('');
  const toastTimer = useRef(null);

  const screen = stack[stack.length - 1];
  const scale = useFitScale();

  const go = useCallback((id) => {
    setDirection('forward');
    // Scanning is a transient step: Results' back button returns to the input picker.
    setStack((s) => [...s.filter((x) => x !== 'scanning'), id]);
  }, []);
  const back = useCallback(() => {
    setDirection('back');
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }, []);
  const home = useCallback(() => {
    setDirection('back');
    setStack((s) => s.slice(0, s.indexOf('home') + 1));
  }, []);
  const toast = useCallback((msg) => {
    clearTimeout(toastTimer.current);
    setToastMsg(msg);
    toastTimer.current = setTimeout(() => setToastMsg(''), 2600);
  }, []);

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
            toast={toast}
            connected={connected}
            setConnected={setConnected}
            node={node}
            startNode={setNode}
            mailbox={mailbox}
            dropInMailbox={() => setMailbox((m) => m + 1)}
          />
          {screen !== 'home' && <HomeIndicator />}
        </div>
        <Toast message={toastMsg} />
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
