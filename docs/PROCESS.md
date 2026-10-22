# Design → Dev Process

How this prototype went from a FigJam board to a live, real-behavior demo. Fill in the `TODO` notes with your own reflections. Those notes are what make a case study read as yours.

---

## 1. Problem & goal

**Problem.** TODO: one or two sentences on the problem. *Example: people know the feeling they want from music but can't put it into a search query.*

**Goal for this phase.** Build a rapid, interactive prototype the team could actually use, not just click through, so feedback is about the experience, not the static layout.

**Success looked like:**
- The core loop (input a vibe → get music → save/share) works end to end
- Real sound and real text input, so testers react to the actual experience
- One link anyone can open on a phone or laptop

## 2. Research & ideation (FigJam)

- Moodboard: navy, blue and magenta gradients; "modern retro"; extremely bold type
- Feature stickies grouped by priority: *must-have / mid / not that important*
- Sitemap and information architecture on the Branding page
- Name exploration: Tessera, Ambi, Lyra, Solaris

TODO: add a screenshot of the board (`docs/images/figjam-ideation.png`) and one sentence on the biggest insight.

## 3. Design system (Figma)

Before drawing screens, I set up the foundations so the code could reuse them directly:

| Figma | Code |
|---|---|
| `Tokens` variable collection: color, space, radius | CSS custom properties in [`styles.css`](../app/src/styles.css) (`--color-accent-magenta`, `--space-16`, `--radius-lg`, …) |
| Text styles: display (Druk Wide → Unbounded) and body (Lexend) | `--font-display`, `--font-body`, and `.t-display-*` / `.t-title` classes |
| Local components: Button, TopBar, BottomNav, SongRow, cards | React components in [`components.jsx`](../app/src/components.jsx) |
| Exported vector glows and icons | SVGs in [`app/src/assets/`](../app/src/assets) |

**Decision:** Druk Wide is a paid font, so Unbounded Black/Bold stands in for it in both Figma and code. That keeps the two versions consistent.

## 4. Figma prototype

Six screens wired as the "Node flow":

| # | Screen | Purpose |
|---|---|---|
| 01 | Welcome | Value prop, "Get started" |
| 02 | Connect apps | Choose streaming services |
| 03 | Home | "What's your vibe?" and start a Node |
| 04 | Choose input | Scan, voice memo, words or photos |
| 05 | Scanning | The app "reads" the input |
| 06 | Results | Playable tracks, save, share to mailbox |

TODO: add the flow screenshot (`docs/images/figma-flow.png`).

**Limitation that led to the next step:** a Figma prototype can't play real audio, take typed input that changes the results, or show how scrolling and transitions really feel. Testers kept asking "what would it sound like?"

## 5. Coded prototype (React + Vite)

I rebuilt each Figma frame as a React screen, pulling exact values from Figma through the Figma MCP server, so the code matches the design file.

**Real behaviors added:**
- **Navigation stack** with forward/back slide transitions, plus a back button that skips the transient Scanning step
- **Words input:** a bottom sheet where typed text becomes the Node's tags and the Results title
- **Audio:** 15-second previews synthesized with the Web Audio API, each track with its own key, chords and tempo. No licensed audio needed
- **Feedback states:** disabled buttons until a service is connected, toasts for features out of scope, a mailbox counter that goes up when you share
- **Responsive frame:** full-screen on phones, a scaled phone frame on desktop

**Intentionally out of scope:** real streaming APIs, camera/mic analysis, accounts, a backend.

### 5b. Curated iteration (v0.2-curated)

After the team voted on a moodboard and I reworked the sitemap, I designed one curated screen per top-level sitemap section. Then I rebuilt the app to match.

| # | Screen | Sitemap items covered |
|---|---|---|
| 01a–c | Onboarding | Welcome, Connect music apps, **Pick your vibes** (new step that seeds the first daily prompt) |
| 02 | Home | Daily prompt, the Node (scan / voice / media / words), catalogue snippets, record drop-off mailbox |
| 03 | Community | Map (global radio), user matching, touch tips (RFID charm), Q&A |
| 04 | Remote Control | Filter, labeling music, sample finder ("advanced shazam"), stickers on records |
| 05 | Profile | Persona recap, stats, listening room, connect apps, settings |

**Design decisions**
- **Moodboard → system, not one-offs.** The horizon arc, glows, stickered record and hardware knobs from the voted images are built on the existing tokens, so the new look still comes from one source of truth.
- **One tap into the Node.** The Node card's four tiles replace the separate "Choose input" screen, which saves a step on the core flow.
- **Onboarding you can come back to.** Connect apps and Pick your vibes double as Profile editors: they return to Profile with "Done"/"Save" instead of continuing onboarding.
- **Nothing is a dead end.** Map pins, snippets, the record and shelf spines play previews. Features that aren't built yet show a toast.

## 6. Shipping the live demo

- Code lives on GitHub; every push to `main` runs [`deploy.yml`](../.github/workflows/deploy.yml), which builds the app and publishes it to GitHub Pages
- The portfolio's **View live demo** button links to the Pages URL
- Milestones are tagged in git (`v0.1-lofi`, `v0.2-…`) so earlier versions stay recoverable

## 7. Testing & feedback

TODO after sharing with the team:

| Feedback | Change made | Commit / version |
|---|---|---|
| | | |

## 8. Reflection

TODO:
- What did coding the prototype reveal that Figma didn't?
- Where did AI speed you up, and where did you have to step in?
- What would you do next (v0.2)?
