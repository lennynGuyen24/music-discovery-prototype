# Dev Log

One entry per working session, newest first. Keep each entry short: what changed, why, and what's next.

---

## 2026-10-21: Design-audit fixes (v0.3-audit)

**Done**
- Phase 1, core loop: Node results depend on the input (4 mood sets plus a fallback, readable titles, a loading label for each input type); refine controls (swappable tags, More/Less like this, Regenerate, Edit input, "Why these picks"); one shared player with a mini-player and Remote Prev/Play/Next; a mailbox crew picker with Undo and an inbox badge
- Phase 2, flow details: Home leads with the Node; onboarding back buttons, a connecting guard and grouped vibes; a Remote segmented filter; "Soon" states on unbuilt features; a mic/camera explainer; toasts that sit above the mini-player with View/Undo actions
- Phase 3, human factors: a 12px minimum and sentence case; smaller screen titles; a magenta text token at 4.5:1 or better; 44px hit areas everywhere; filled tab icons; one hero card per screen and varied artwork; the frame scaled as a whole
- Figma: added `color/accent/magenta-text`, set Caption to 12px, added the Meta (13px) and Heading (24px) text styles

**Decisions**
- Kept the 402×874 frame (the Figma size) instead of the audit's 390×844
- The listening-room shelf is one tap target, because the spines are too thin for 44px
- The Remote knobs really shape the sound (filter, key, tempo) instead of only showing a hint
- Every unbuilt feature is marked "Soon", not just the four the audit named

**Next**
- Update the curated Figma frames to the new layout (Home order, the mini-player, segmented filters). This was held back while the "Lan · Mid-fi" pass is being edited on the same page
- Test the real mic and camera on a phone (the browser pane blocks them)
- Push and check the live demo (`/ship`)

---

## 2026-10-21: Mid-fi color pass on Lan's screens (Figma)

**Done**
- Duplicated the "Lan" section on "Claude's food" as **"Lan · Mid-fi"**, placed directly below it. The lo-fi original is untouched
- Re-skinned 01b Plug in, 02 Home, 03 Community, 04 Now Playing and 05 Profile from grey lo-fi to the dark palette. Every flat color is bound to a `Tokens` variable (ink, navy, card, border, text, accent)
- Added mid-fi detail: blue/magenta corner glows, a gradient daily-prompt card and persona recap, Scan as the hero input tile, a colored globe with magenta pins, the match-card deck, colored record spines, gradient snippet covers and avatars, a "Connected ✓" state on Spotify, and the correct active tab in the bottom nav on each screen

**Decisions**
- The two "???" Home tiles became dashed, faded "SOON" tiles, matching the app's "coming soon" treatment
- Gradients use the token hex values (blue `#1f5cff` → magenta `#c42bd6`) because Figma can't bind variables to gradient stops

**Next**
- Review "Lan · Mid-fi" with the team, then port the changes to the app screens
- Tidy the Community match deck (the cards overlap inside a container card)

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
