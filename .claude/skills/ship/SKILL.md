---
name: ship
description: Verify, document, commit and push the current prototype changes so the live demo redeploys. Use when the user says /ship, "ship it", "push this live" or "update the demo".
---

Ship the current working-tree changes to the live demo. $ARGUMENTS is an optional summary or tag name from the user.

1. Run `git status` and `git diff` and summarize the changes in plain language. If nothing changed, say so and stop.
2. Run `npm --prefix app run build`. If it fails, fix it or report the error and stop.
3. If the preview server is running, reload it and check the console for errors on the changed screens.
4. Add today's entry to `docs/DEVLOG.md` (Done / Decisions / Next), or extend the entry if today's already exists.
5. Commit in logical Conventional Commits chunks (code first, docs last), each ending with the attribution trailer.
6. If $ARGUMENTS names a version such as `v0.2-audio`, create an annotated tag.
7. Run `git push origin main --tags`.
8. Wait for the "Deploy live demo" run to finish. Check it with `curl -s "https://api.github.com/repos/lennynGuyen24/music-discovery-prototype/actions/runs?per_page=1"`, at most once every 30 seconds.
9. Report: the commits made, the deploy result, and the live URL https://lennynguyen24.github.io/music-discovery-prototype/
