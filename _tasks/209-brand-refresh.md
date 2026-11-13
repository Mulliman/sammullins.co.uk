---
id: "209"
title: Roll out the new logo, the masthead header and Figtree with Atkinson Hyperlegible Next
epic: Design system
status: review
priority: p1
size: M
owner: agent
depends_on: ["204", "206", "207"]
---

## Why

Sam redrew the logo (November 2026): the same mark rebuilt on its grid, a Figtree wordmark and two flat colours instead of gradients. The brand kit (`scripts/brand/kit.mjs`) builds every lockup from one master, including interactive SVGs with a hook on every bar and letter. Sam also missed the big centred logo that ticket 206 removed, and picked new type after comparing a prototype (`Brand/prototypes/header-and-type.html`): Figtree for headings, Atkinson Hyperlegible Next for body text. Decision recorded in `_docs/decisions.md`.

## Scope

- Commit the brand kit script and `pnpm brand:kit`. `--site` now also copies the interactive logos into `src/assets/brand/`; fix pnpm's `--` separator breaking the flags.
- A `Logo` component that inlines a lockup (stacked, horizontal or mark) with no ids, coloured by `--logo-primary` and `--logo-secondary` (themes), replacing the gradient logo and its `--logo-stop-*` tokens.
- Header: a 100px masthead (80px on a phone) with the stacked logo centred and the nav and toggles on the right. It sticks at a negative top, so once scrolled only `--header-h` stays: the stacked logo gives way to the horizontal one on the left and the nav doesn't move. One copy of every control.
- Signature (904) reworked on the new hooks: S bars build, then M bars, then the name; hover or focus ripples the bars. Reduced motion still skips it.
- Footer uses the new stacked logo.
- Agent view moves out of the header to the footer, beside the colophon (Sam, 13 November 2026).
- Favicons, app icons and the web manifest from the kit; link the apple touch icon and manifest.
- Self-host Figtree and Atkinson Hyperlegible Next (OFL, variable, Latin subset, normal and italic) with metric-matched local fallbacks; remove Mona Sans. Headings, nav and UI titles use `--font-display` (Figtree); running text uses `--font-sans` (Atkinson).
- Update the style guide, colophon, design tokens doc and decisions.

## Acceptance criteria

- [x] The header is 100px at the top of a desktop page and 80px on a phone; once scrolled, the visible bar is `--header-h` (72px / 64px) and anchors still land below it.
- [x] Only one logo link is visible and focusable at a time.
- [x] No colour literals outside `src/styles/themes/`; the logo follows light, dark and inverse surfaces.
- [x] Without JS the header isn't sticky and shows the masthead; the mobile menu still works.
- [x] `pnpm verify` passes.

## Out of scope

- Section colours for the logo (parked by Sam, 13 November 2026).
- Scroll-driven CSS instead of the IntersectionObserver.
