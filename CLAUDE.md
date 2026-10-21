# Project rules

Music-discovery rapid prototype for UXDG 390. The React + Vite app is in `app/`. Every push to `main` deploys it to GitHub Pages:
https://lennynguyen24.github.io/music-discovery-prototype/

## Source of truth
- Figma file "Rapid Prototype" (`YwpMkcu2rX5vWzcZVbzWOz`) is the official design. Code follows Figma.
- Use the tokens in `app/src/styles.css` (`--color-*`, `--space-*`, `--radius-*`, `--font-*`). Never hard-code colors or spacing.
- Reuse components in `app/src/components.jsx` before making new ones. One screen per Figma frame in `screens.jsx`.
- Features that aren't built show a toast instead of failing silently.
- Ask before adding a dependency.

## Workflow
1. Work on one change at a time. For anything bigger than a single screen, propose a plan first.
2. Verify in the browser preview (`rapid-prototype` in `.claude/launch.json`) at mobile width: no console errors, and the changed flow works.
3. Run `npm --prefix app run build`. It must pass before any commit.
4. Commit with Conventional Commits: `feat:`, `fix:`, `style:`, `docs:`, `refactor:`, `chore:`. One logical change per commit, with a body that says *why*.
5. Push only when the user says to (or runs `/ship`). After pushing, check that the "Deploy live demo" Actions run succeeds and the live URL loads.
6. Experiments go on a branch (`exp/<name>`). Only `main` deploys.

## Documentation (part of the deliverable)
- Add an entry to `docs/DEVLOG.md` for each working session: what was done, what was decided, and what's next.
- Add design decisions to `docs/PROCESS.md`. Add prompts that worked well to the table in `docs/AI-WORKFLOW.md`.
- Tag milestones: `v0.1-lofi`, then `v0.2-<name>`, and so on.
