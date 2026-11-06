---
id: "204"
title: Typography refresh (one variable sans, fluid scale, no eyebrows)
epic: Design system
status: review
priority: p0
size: M
owner: agent
depends_on: ["202"]
---

## Why

After the November 2026 design audit, Sam rejected thin Lato 100 display headings and the Pacifico script, and asked for typography that is modern, flexible and follows current practice. Labels stacked above titles (kickers, eyebrows) read as AI-generated and are dropped. Supersedes the heading rules in 202.

## Scope

- Replace Lato and Pacifico with **Mona Sans** (OFL), self-hosted as two variable WOFF2 files (normal and italic, weight 200 to 900, Latin subset). Preload the normal face only.
- A metric-matched local fallback (`size-adjust`, `ascent-override`, `descent-override`) so the font swap doesn't shift the layout.
- A fluid modular scale, `--step--2` to `--step-6`: 16px body at a 360px viewport (ratio 1.2) to 18px at 1280px (ratio 1.25).
- Weight, leading and tracking tokens. Headings are sentence case, weight 600 to 650, with negative tracking that grows with size, plus `text-wrap: balance`. Paragraphs use `text-wrap: pretty`.
- Headings are left-aligned by default. Blocks centre them only in symmetrical sections.
- Prose is capped at `--measure` (68ch, about 75 characters).
- No uppercase text anywhere: navigation, buttons, labels, footer and the 404 page.
- Remove the `intro.kicker` field. Callouts put the tone label and title on one line ("Tip: Title"). Card dates move below the title.

## Acceptance criteria

- [x] No requests to third-party font hosts. `font-src 'self'` is unchanged.
- [x] Font payload is at most 120 KB: about 40 KB normal, plus 42 KB italic only when italics are used.
- [x] No `text-transform: uppercase` and no `--font-script` left in `src/`.
- [x] `pnpm check`, `pnpm lint` and `pnpm test` pass.
- [ ] Sam approves the before and after screenshots in the PR.
