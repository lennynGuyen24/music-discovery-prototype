# Dev Log

One entry per working session, newest first. Keep each entry short: what changed, why, and what's next.

---

## 2026-10-21: Curated screens from the sitemap (v0.2-curated)

**Done**
- In Figma, on the "Claude's food" page, built one 402×874 screen for each top-level sitemap section: Onboarding, Home, Community, Remote Control, Profile. Each covers that section's sitemap items
- Added a three-step onboarding (Welcome → Connect apps → new **Pick your vibes**) and local components: Chip, List Row, Knob, Stat
- Marked the replaced frames on the Node flow page "(old)"
- Rebuilt the app to match: three-step onboarding, a new Home, and working Community, Remote and Profile tabs (one commit each)

**Decisions**
- Styling comes from the voted moodboard: horizon arc, magenta/blue glows, a stickered record, hardware knobs. It all stays on the existing `Tokens` variables and text styles
- Home's Node tiles open each input directly, so the separate "Choose input" screen is gone
- The tabs reset the stack; onboarding screens reopened from Profile return to Profile
- Glows are now blurred CSS circles in token colors instead of exported SVGs
- Every tap does something: previews play (map pins, snippets, the record, shelf spines), and everything not built yet shows a toast

**Next**
- Review with the team; log feedback in [PROCESS.md § 7](PROCESS.md#7-testing--feedback)
- Add a Bottom Nav "Active" variant in Figma instead of per-instance color overrides
- Push and check the live demo (`/ship`)

---

## 2026-10-21: Coded prototype + live demo setup

**Done**
- Set up Figma foundations: `Tokens` variables, text styles, local components
- Wired 6-screen Node flow in Figma (Welcome → Results)
- Rebuilt the flow in React + Vite with real audio, text input and transitions
- Added the GitHub repo, README, process docs and the GitHub Pages deploy workflow

**Decisions**
- Unbounded stands in for Druk Wide (licensing)
- Audio is synthesized in the browser rather than using licensed clips
- GitHub Pages for hosting: free, in the same place as the code, redeploys on every push

**Next**
- Share the live demo with the team and log feedback in [PROCESS.md § 7](PROCESS.md#7-testing--feedback)
- Add screenshots to `docs/images/`

---

## 2026-10-21: Testing on a real iPhone

**Done**
- Opened the live demo on an iPhone; the GitHub Pages link works
- On phones, the mock iOS status bar and home indicator are hidden and the layout pads for the notch and home bar (`env(safe-area-inset-*)`), so there's no doubled status bar
- Added the Apple web-app meta tags so "Add to Home Screen" opens the prototype full-screen

**Decisions**
- Keep the mock device chrome on desktop (it reads as a phone in reviews) but use the real one on a phone

**Next**
- Test Scan and Voice memo on the iPhone (camera/mic need HTTPS, which Pages provides)
- Add a home-screen icon (`apple-touch-icon`)

---

<!-- Template
## YYYY-MM-DD: Title

**Done**
-

**Decisions**
-

**Next**
-
-->
