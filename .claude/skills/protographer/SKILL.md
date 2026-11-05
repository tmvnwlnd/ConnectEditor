---
name: protographer
description: Capture screenshots and videos of this project's running app with protographer — planning the shot set, intent-driven shot kinds (page, screen, overlay, modal, hover, moments, compare; take, cuts, hoverTour, menuTour, scrollThrough), deterministic capture, review, and the client showcase. Use whenever someone asks for screenshots, product shots, a demo video, a showcase, hand-off images, or to re-shoot frames after a design change.
---

# protographer

This project captures its app with **protographer**. The CLI is the source of
truth and teaches itself — start there instead of from memory:

```bash
npx protographer guide            # workflow + rules; then `guide planning`
npx protographer explain kinds    # which shot kind for what
npx protographer explain steps    # the mouse/keyboard vocabulary
```

The loop: **plan the set → inspect screens → write shots → `plan` (get approval)
→ `run --only` one shot → `run` → `review --frames` and LOOK at every frame →
`showcase`.**

Non-negotiables:
- Plan before shooting, and show the plan (`npx protographer plan`) to whoever asked.
- Shots are data: pick a kind, use declarative steps; `{ run }` only as a last resort.
- A passing run is not a right frame. Open the images and check them against their titles.
- While iterating, re-run only what changed (`--only`). A full run for the deliverable — and say so if the set is mixed-build.
