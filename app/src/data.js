// Mock Node results. The Node matches keywords in the input to one of these
// sets, so different inputs give visibly different tracks, tags and colors.

export const TAG_OPTIONS = {
  tempo: ['72 BPM', '90 BPM', '108 BPM', '124 BPM'],
  mood: ['Moody', 'Dreamy', 'Calm', 'Bright', 'Hype'],
  era: ['1970s', '1990s', '2010s', 'Now'],
};

// sound = index into TRACK_SOUNDS in audio.js
const t = (title, artist, note, bpm, mood, era, sound) => ({ id: `${title}|${artist}`, title, artist, note, bpm, mood, era, sound });

export const RESULT_SETS = [
  {
    id: 'moody', name: 'Rain on glass', accents: ['blue', 'magenta'],
    tags: { tempo: '72 BPM', mood: 'Moody', era: '2010s' },
    keywords: ['rain', 'storm', 'night', 'midnight', 'late', 'miss', 'alone', 'lonely', 'fog', 'grey', 'gray', 'sad', 'moon', 'cold', 'tears', 'rooftop', 'blue'],
    why: 'Slow tempos and minor keys for heavy, late-night feelings.',
    tracks: [
      t('Glass Avenue', 'Mira Vale', 'Rainy synths', 72, 'Moody', '2010s', 4),
      t('Afterglow Exit', 'The Lanterns', 'Late-night tempo', 76, 'Moody', '2010s', 1),
      t('Paper Moons', 'Koi Static', 'New to you', 70, 'Dreamy', 'Now', 4),
      t('Static Hearts', 'Juno Park', 'Samples you love', 84, 'Moody', '1990s', 1),
      t('Wet Asphalt', 'Noor & the Hours', 'Slow-burn soul', 68, 'Moody', '1970s', 4),
      t('Sodium Lights', 'Hollow Coast', 'Rooftop ambience', 74, 'Calm', 'Now', 3),
    ],
  },
  {
    id: 'upbeat', name: 'Windows down', accents: ['sun', 'magenta'],
    tags: { tempo: '108 BPM', mood: 'Bright', era: '1990s' },
    keywords: ['sun', 'summer', 'drive', 'driving', 'road', 'trip', 'beach', 'window', 'golden', 'bright', 'happy', 'morning', 'highway', 'car', 'warm'],
    why: 'Bright major chords at a steady cruising tempo.',
    tracks: [
      t('Coastline Radio', 'Sol Mendes', 'Open-road groove', 108, 'Bright', '1990s', 5),
      t('Lemon Days', 'Pacific Club', 'Feel-good hooks', 112, 'Bright', '2010s', 2),
      t('Mile Marker', 'The Dashboards', 'Driving bass', 104, 'Bright', '1990s', 5),
      t('Golden Hour Hum', 'Ana Riva', 'Warm guitars', 98, 'Dreamy', '1970s', 2),
      t('Overpass', 'Kite Theory', 'New to you', 110, 'Hype', 'Now', 5),
      t('Sunroof', 'Twin Palms', 'Summer staples', 106, 'Bright', '2010s', 2),
    ],
  },
  {
    id: 'energy', name: 'Strobe heart', accents: ['magenta', 'magenta'],
    tags: { tempo: '124 BPM', mood: 'Hype', era: 'Now' },
    keywords: ['club', 'danc', 'party', 'rave', 'gym', 'run', 'workout', 'friday', 'lights', 'crowd', 'loud', 'hype', 'energy', 'sweat', 'festival'],
    why: 'Four-on-the-floor tempos built for moving.',
    tracks: [
      t('Pulse Theory', 'DJ Halcyon', 'Peak-time energy', 124, 'Hype', 'Now', 6),
      t('Neon Sprint', 'Volta Kids', 'Big drops', 128, 'Hype', '2010s', 6),
      t('Afterhours', 'Mx. Lumen', 'Warehouse classic', 122, 'Moody', '1990s', 7),
      t('Bodywork', 'Saint Ivory', 'New to you', 126, 'Hype', 'Now', 6),
      t('Mirrorball Run', 'Disco Vapor', 'Disco revival', 118, 'Bright', '1970s', 7),
      t('Glowstick', 'Haru & Fen', 'Crowd favourite', 124, 'Hype', '2010s', 6),
    ],
  },
  {
    id: 'calm', name: 'Soft focus', accents: ['blue', 'sun'],
    tags: { tempo: '72 BPM', mood: 'Calm', era: 'Now' },
    keywords: ['study', 'focus', 'calm', 'quiet', 'coffee', 'read', 'sleep', 'soft', 'garden', 'slow', 'breath', 'sunday', 'tea', 'chill', 'home', 'hush'],
    why: 'Gentle textures at a resting heart rate.',
    tracks: [
      t('Linen', 'Ada Moss', 'Soft piano', 80, 'Calm', 'Now', 3),
      t('Window Seat', 'Fern Cottage', 'Coffee-shop folk', 84, 'Calm', '2010s', 0),
      t('Tea for Two Rooms', 'Okapi', 'Lo-fi loops', 78, 'Calm', '2010s', 3),
      t('Paper Garden', 'Hana Ito', 'New to you', 72, 'Dreamy', 'Now', 0),
      t('Morning Static', 'Blue Lamp', 'Tape hiss', 82, 'Calm', '1990s', 3),
      t('Sunday Drift', 'Leon Arc', 'Ambient guitar', 76, 'Dreamy', '1970s', 0),
    ],
  },
];

// Used when nothing in the input matches.
export const FALLBACK_SET = {
  id: 'dreamy', name: 'Neon after rain', accents: ['magenta', 'blue'],
  tags: { tempo: '90 BPM', mood: 'Dreamy', era: '2010s' },
  keywords: [],
  why: 'A dreamy middle ground while the Node learns more about you.',
  tracks: [
    t('Velvet Transit', 'Isle of Ra', 'Hazy pop', 92, 'Dreamy', '2010s', 0),
    t('Holograms', 'Pale Season', 'Shimmering guitars', 88, 'Dreamy', 'Now', 1),
    t('Night Bloom', 'Coral Fax', 'New to you', 94, 'Dreamy', '2010s', 2),
    t('Slow Motion City', 'Remi Sol', 'Neo-soul keys', 86, 'Moody', '1990s', 3),
    t('Cloud Atlas Hotel', 'Tide Pool', 'Bedroom pop', 96, 'Bright', 'Now', 0),
    t('Long Exposure', 'Vela', 'Analog warmth', 90, 'Dreamy', '1970s', 1),
  ],
};

const ALL_SETS = [...RESULT_SETS, FALLBACK_SET];
export const setById = (id) => ALL_SETS.find((s) => s.id === id) ?? FALLBACK_SET;

// Inputs without words still land on a distinct set.
const MODE_DEFAULT = { mic: 'calm', camera: 'dreamy', media: 'upbeat' };

const words = (text = '') => text.toLowerCase().split(/[^a-z0-9']+/).filter(Boolean);
const hits = (set, ws) => ws.filter((w) => set.keywords.some((k) => w.startsWith(k)));

export function matchSet(node) {
  if (node?.mode !== 'words') return setById(MODE_DEFAULT[node?.mode]);
  const ws = words(node.text);
  let best = FALLBACK_SET, bestScore = 0;
  for (const set of RESULT_SETS) {
    const score = hits(set, ws).length;
    if (score > bestScore) { best = set; bestScore = score; }
  }
  return best;
}

// The words that made the Node pick its set, shown while scanning.
export function detectedWords(node) {
  const set = matchSet(node);
  if (node?.mode === 'words') {
    const found = [...new Set(hits(set, words(node.text)))];
    if (found.length) return found.slice(0, 3);
  }
  return Object.values(set.tags);
}

const TRAILING = new Set(['a', 'an', 'the', 'and', 'or', 'of', 'in', 'on', 'at', 'to', 'with', 'for', 'my', 'your']);

// "rainy rooftop, missing someone" → "Rainy rooftop". Non-word inputs use the set's name.
export function resultTitle(node) {
  if (node?.mode !== 'words' || !node.text?.trim()) return matchSet(node).name;
  let clause = node.text.trim().split(/[,.;:!?\n—–-]/)[0].trim().split(/\s+/).slice(0, 4);
  while (clause.length > 1 && TRAILING.has(clause[clause.length - 1].toLowerCase())) clause.pop();
  const title = clause.join(' ');
  return title[0].toUpperCase() + title.slice(1);
}

// The loading screen says what it's actually doing for each input type.
export function inputLabels(node) {
  switch (node?.mode) {
    case 'words': return { bar: 'Words', doing: 'Reading your words…' };
    case 'mic': return { bar: 'Voice', doing: 'Listening…' };
    case 'media': return { bar: node.isVideo ? 'Video' : 'Photo', doing: node.isVideo ? 'Watching your video…' : 'Looking at your photo…' };
    default: return { bar: 'Scan', doing: 'Scanning…' };
  }
}

// Ranks tracks for the Results screen. Tags pull the list toward a tempo/mood/era,
// "More like this" boosts that track's mood, "Less like this" hides it,
// and Regenerate (seed) reshuffles near-ties. Tracks from other sets can come in
// when the tags move away from the matched set.
const POOL = ALL_SETS.flatMap((s) => s.tracks.map((tr) => ({ ...tr, setId: s.id })));
const jitter = (id, seed) => {
  let h = seed * 7919;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) % 100003;
  return (h % 1000) / 1000;
};

export function rankTracks(set, tags, { liked = [], hidden = [], seed = 0 } = {}) {
  const likedMoods = POOL.filter((tr) => liked.includes(tr.id)).map((tr) => tr.mood);
  const bpm = tags.tempo ? parseInt(tags.tempo, 10) : null;
  const score = (tr) =>
    (tr.setId === set.id ? 1.5 : 0)
    + (bpm ? Math.max(0, 2.5 - Math.abs(tr.bpm - bpm) / 10) : 0)
    + (tags.mood && tr.mood === tags.mood ? 2 : 0)
    + (tags.era && tr.era === tags.era ? 1 : 0)
    + (likedMoods.includes(tr.mood) ? 1.5 : 0)
    + (liked.includes(tr.id) ? 10 : 0)
    + (seed ? jitter(tr.id, seed) * 3 : 0);
  return POOL.filter((tr) => !hidden.includes(tr.id))
    .map((tr) => ({ tr, s: score(tr) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, 4)
    .map(({ tr }) => tr);
}

// One line under the list explaining the picks.
export function whyLine(set, tags, likedTitles) {
  const tuned = Object.entries(tags).filter(([k, v]) => v && v !== set.tags[k]).map(([, v]) => v);
  const parts = [set.why];
  if (tuned.length) parts.push(`Tuned toward ${tuned.join(' · ')}.`);
  if (likedTitles.length) parts.push(`More like ${likedTitles[likedTitles.length - 1]}.`);
  return parts.join(' ');
}

// ---------- Catalog used outside the Node (Home, Community, Remote, Profile) ----------
export const SNIPPETS = [
  t('Night Swim', 'Ravyn Lenae', 'Picked for you', 92, 'Dreamy', 'Now', 0),
  t('Glass Hour', 'Mk.gee', 'Picked for you', 86, 'Moody', 'Now', 1),
  t('Low Sun', 'Bonobo', 'Picked for you', 98, 'Calm', '2010s', 2),
  t('Overcast', 'Tirzah', 'Picked for you', 80, 'Moody', '2010s', 3),
];

const [nightSwim, glassHour, lowSun, overcast] = SNIPPETS;
const byTitle = (title) => POOL.find((tr) => tr.title === title);

// Remote filters each load a short queue onto the deck.
export const DECK = {
  All: SNIPPETS,
  Vinyl: [glassHour, byTitle('Wet Asphalt'), byTitle('Golden Hour Hum')],
  Samples: [lowSun, byTitle('Static Hearts'), byTitle('Afterhours')],
  Live: [overcast, byTitle('Mirrorball Run'), byTitle('Sunday Drift')],
};

export const STATIONS = [
  { city: 'Lisbon', x: 60, y: 30, color: 'magenta', track: t('Lisbon late show', 'Kaytranada', 'Global radio', 104, 'Hype', 'Now', 7) },
  { city: 'Seoul', x: 190, y: 12, color: 'blue', track: t('Seoul after dark', 'Yaeji', 'Global radio', 120, 'Hype', 'Now', 6) },
  { city: 'Lagos', x: 250, y: 60, color: 'sun', track: t('Lagos sunrise set', 'Tems', 'Global radio', 96, 'Bright', 'Now', 5) },
  { city: 'Mexico City', x: 120, y: 76, color: 'blue', track: t('Mexico City nocturne', 'Silvana Estrada', 'Global radio', 74, 'Calm', 'Now', 4) },
];

// The Profile listening room: one record per spine.
export const SHELF = POOL.filter((_, i) => i % 2 === 0).slice(0, 16);
