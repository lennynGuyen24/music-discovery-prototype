# Music Discovery App: Rapid Prototype

> Feed it a place, a photo or a feeling. Get music back.

**[▶ View live demo](https://YOUR-USERNAME.github.io/YOUR-REPO/)** · [Figma prototype](https://www.figma.com/design/YwpMkcu2rX5vWzcZVbzWOz/Rapid-Prototype) · [Design → Dev process](docs/PROCESS.md)

A coded, real-behavior prototype for a music-discovery app, built for **UXDG 390**. The Figma prototype shows the flow. This version lets people *feel* it: real audio previews, real input, real transitions, and states that change as you use it.

> Product name is still a working title. Candidates: Tessera, Ambi, Lyra, Solaris.

---

## Try it

Open the [live demo](https://YOUR-USERNAME.github.io/YOUR-REPO/). It runs full-screen on a phone and inside a phone frame on desktop.

1. **Welcome → Plug in your music.** Toggle the streaming services you use.
2. **Home → Start a Node.** A *Node* is one "vibe search."
3. **Feed the Node.** Pick Scan, Voice memo, Words or Photos. Try **Words** and type something like *rainy rooftop, missing someone*.
4. **Scanning.** The app reads your input and pulls out mood tags.
5. **Results.** Tap play. Each track plays a 15-second preview generated live in the browser. Save the Node, or drop it in your crew's mailbox.

## What's real vs. faked

| Real behavior | Faked for the prototype |
|---|---|
| Screen navigation with a back stack and directional transitions | Streaming-service connections (toggles only) |
| Text input that turns into the Node's tags and title | Camera, mic and photo analysis (simulated scan) |
| Audio playback with progress, synthesized via the Web Audio API | Song recommendations (fixed list) |
| Toasts, a bottom sheet, disabled/enabled button states, a mailbox counter | Community, Remote and Profile tabs |

The audio is synthesized, so the prototype needs no licensed tracks.

## Design → Dev at a glance

```
Research (FigJam)  →  IA + moodboard  →  Figma tokens & components  →  Figma prototype  →  Coded prototype  →  Live demo
```

- **Research & ideation:** FigJam board with moodboard, feature prioritization and sitemap.
- **Design system:** Figma variables (color, spacing, radius), text styles and a component set. These became CSS custom properties in [`app/src/styles.css`](app/src/styles.css).
- **Figma prototype:** 6 wired screens: Welcome → Connect → Home → Choose input → Scanning → Results.
- **Coded prototype:** each Figma frame was rebuilt as a React screen using the Figma MCP plus Claude Code.

The full write-up, with decisions and lessons, is in **[docs/PROCESS.md](docs/PROCESS.md)**. How I worked with AI is in **[docs/AI-WORKFLOW.md](docs/AI-WORKFLOW.md)**.

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| UI | React 18 | Component model maps 1:1 to Figma components |
| Build | Vite 5 | Fast local dev, static output that hosts anywhere |
| Styling | Plain CSS with design tokens | Tokens come straight from Figma variables, with no framework to learn |
| Type | Unbounded + Lexend (via Fontsource) | Unbounded stands in for Druk Wide (licensed). Lexend is used for body text |
| Audio | Web Audio API | Real playback without audio files or licensing |
| Hosting | GitHub Pages via GitHub Actions | Every push to `main` redeploys the demo |

## Project structure

```
.
├── app/                    # The prototype (React + Vite)
│   ├── src/
│   │   ├── App.jsx         # Navigation stack, transitions, global state
│   │   ├── screens.jsx     # One component per Figma frame
│   │   ├── components.jsx  # Buttons, top bar, nav, song row, toast
│   │   ├── audio.js        # Synthesized 15s track previews
│   │   ├── styles.css      # Design tokens + styles
│   │   └── assets/         # SVGs exported from Figma
│   └── package.json
├── docs/
│   ├── PROCESS.md          # Design → Dev case study
│   ├── AI-WORKFLOW.md      # How the prototype was built with AI
│   └── DEVLOG.md           # Dated log of each working session
└── .github/workflows/
    └── deploy.yml          # Builds app/ and publishes to GitHub Pages
```

## Run it locally

Requires [Node.js](https://nodejs.org) 20 or newer.

```bash
cd app
npm install
npm run dev
```

Then open http://localhost:5173.

## Credits

Design and direction: YOUR NAME. Built with [Claude Code](https://claude.com/claude-code) and the Figma MCP server; see [docs/AI-WORKFLOW.md](docs/AI-WORKFLOW.md).
