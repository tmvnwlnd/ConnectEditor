<!-- protographer:start -->
## Screenshots & videos of this app — protographer

This project captures stills and videos of the running app with **protographer**
(config: `protographer.config.mjs`, shots: `capture/shots/`). The tool teaches
itself — use it rather than hand-writing Playwright screenshot code:

1. `npx protographer guide` — the workflow and rules (read `guide planning` before writing shots)
2. `npx protographer explain kinds` / `explain steps` — the shot vocabulary
3. `npx protographer inspect --path /x` — what's on a screen before you write shots for it
4. `npx protographer plan` — validate shots; show the plan to the person who asked BEFORE capturing
5. `npx protographer run [--only ids]` → `npx protographer review --frames` — then LOOK at every frame
6. `npx protographer showcase` — the client deliverable

Every command ends with "Next:" and every error names its fix; add `--json` for
machine-readable output. Shots are data (`shot.page`, `shot.hover`, `video.take`, …
with declarative steps) — don't add code where a kind or step exists.
<!-- protographer:end -->
