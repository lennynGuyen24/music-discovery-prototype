# AI-Assisted Workflow ("vibe coding," documented)

This prototype was built by a designer directing an AI coding agent. This page records how, so the process can be reviewed and repeated.

## Tools

| Tool | Role |
|---|---|
| **Figma** | Source of truth for design: variables, components, the wired prototype |
| **Figma MCP server** | Lets the agent read frames, variables and assets straight from the Figma file |
| **Claude Code** | Coding agent: wrote and edited the React code, ran the dev server, checked the result in a browser |
| **Git + GitHub** | Version history; every working step is a commit |
| **GitHub Actions + Pages** | Builds and hosts the live demo automatically |

## My role vs. the AI's role

| I did | The AI did |
|---|---|
| Research, IA, visual direction, all Figma design | Translated Figma frames and tokens into React and CSS |
| Decided scope: what's real, what's faked | Implemented interactions, audio synthesis and transitions |
| Reviewed every screen against Figma and gave precise fixes | Took screenshots in a browser to compare against Figma |
| Approved each change before it was committed | Wrote commits, which are tagged `Co-Authored-By: Claude` |

## The loop

1. **Design in Figma.** Use variables, Auto Layout and named layers so the agent reads clean structure.
2. **Prompt with context.** Give the Figma link, the file to change, and what "done" looks like.
3. **Review in the browser.** Compare against the Figma frame and give exact fixes (*"padding is 12, Figma says 16"*).
4. **Commit.** One working change per commit.
5. **Push.** GitHub Actions redeploys the live demo.

## Prompts that worked

Keep this list growing. These prompts are the most useful evidence of process.

| Goal | Prompt (short) | Result |
|---|---|---|
| Tokens | "Read the Tokens variables in [Figma link] and generate CSS custom properties." | `:root` tokens in `styles.css` |
| Screen | "Implement the Results frame [link] using our components and tokens." | `Results` in `screens.jsx` |
| Real audio | "Make the play buttons play real 15s previews without using licensed tracks." | `audio.js` (Web Audio synthesis) |
| Curated screens | "I updated this page with the sitemap: [link]. Build each section a frame (onboarding, homepage, community, remote control, profile)." | Five curated frames plus Chip / List Row / Knob / Stat components, built from the existing tokens |
| Plan first | "Propose a plan to update the React prototype to match the five new curated Figma screens." | A one-commit-per-screen plan with open questions, answered before any code changed |
| Design audit | "Apply design-audit fixes … Give me a short plan listing the files you'll touch for each phase. Wait for my OK before you write any code." | A phased plan, one commit per audit item, and script-verified contrast, text sizes and hit areas |

## Guardrails

- Figma stays the official design; the code follows it, not the other way around
- No secrets or API keys in the repo
- Faked features are labeled in the UI with a toast, so testers aren't misled
