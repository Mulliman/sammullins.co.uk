---
id: "1307"
title: "Visual regression in CI: revisit once the redesign settles"
epic: Style guide
status: todo
priority: p2
size: M
owner: agent
depends_on: ["205", "206", "310", "312", "314"]
---

## Why

A first attempt (6 November 2026) screenshotted every guide page in every mode, page theme and width and compared them in CI. Sam decided to drop it for now:

- The redesign tickets (205, 206, 310, 312, 314) change how things look on purpose, so baselines would need updating on almost every PR.
- Full-page baselines were 26 MB, and the 58,000px components page drifted by 1 to 2px in height between runs.
- Windows and the Linux CI runner render fonts differently, so each needs its own baseline set.
- For a one-person site, the style guide is already the place to check by eye.

## What was kept

- `tests/a11y/page-themes.test.mjs`: axe on every guide page in every page theme, light and dark. It found real low-contrast inline code on dark surfaces, now fixed with a token (`--color-code-bg` on `.surface-inverse` in `themes/default.css`).
- `pnpm compare:base` and `pnpm compare` (`scripts/compare/compare.mjs`): an on-demand before/after comparison of the guide and key pages, in light and dark. Nothing is committed (`.compare/` is gitignored) and it never fails a build. Use it for changes meant to look identical, or to see what a change touched. It loads every image eagerly and pins sticky elements so repeat runs match; the tall components page can still drift by a pixel, which the report labels.

## When to revisit

After the redesign tickets merge. Then consider per-component screenshots (one small image per guide example, photos masked) with Linux baselines generated in CI, rather than full pages.

## Acceptance criteria (for the revisit)

- [ ] A one-token colour change fails a visual test naming the affected components.
- [ ] Baselines update only through an explicit command, and total at most a few MB.
- [ ] Ten consecutive CI runs on an unchanged commit pass (no flakiness).
