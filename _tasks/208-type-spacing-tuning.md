---
id: "208"
title: Tune type and spacing so pages read evenly
epic: Design system
status: done
priority: p0
size: M
owner: agent
depends_on: ["204", "205"]
---

## Why

On 7 November 2026 Sam found the desk artifact "all over the place": small text, tight line heights, big gaps between sections. The audit in [`_docs/type-spacing-audit-2026-11.md`](../_docs/type-spacing-audit-2026-11.md) traced it to a cascade fault in hosted pages, spacing tiers that overlap, colliding type roles and ad hoc line heights.

## Scope

- Body type declared once outside the cascade layers, so host wrappers cannot reset it.
- `--space-section` (56 to 96px) for section padding; intro to content uses `--space-m-l`, never the section gap.
- Leading tokens per role (`--leading-display`, `-title`, `-heading`, `-lead`, `-body`, `-small`, `-code`); no literals in components.
- Base `h1` at `--step-6`; prose `h3` at `--step-2` and `h4` at `--step-1`; lead in `--color-text-muted`.
- `--step--1` floors at 14px; unused `--step--2` removed.
- Code shrinks once (`0.875em`), not twice.
- `text-box: trim-both cap alphabetic` on `h1` and `h2` (the big titles); hero subtitle gaps up one step to suit.
- A hygiene test against literal font sizes and line heights in blocks, components, layouts and pages.

## Acceptance criteria

- [x] Under an unlayered `body { font: 14px system-ui }` host reset, running text renders at `--step-0` in Mona Sans with 1.6 leading (checked on the desk page at 375px and 1440px).
- [x] At 375px and 1440px, section padding is at least twice the intro-to-content gap.
- [x] Prose `h3` is larger than the lead at every width.
- [x] No reading text under 14px; code blocks 14 to 16px.
- [x] `pnpm test` fails on a literal `font-size` (px or rem) or `line-height` in `src/{blocks,components,layouts,pages}`.
- [x] `pnpm build`, `pnpm test` and `pnpm lint` pass.

## Out of scope

- Changing the type scale ratio or the body size.
- Hero padding (it keeps `--space-l-xl` plus its inner padding).
- `font-size-adjust`: the audit suggested it for code, but `ex-height from-font` only normalises fallbacks to the first mono font, not to Mona Sans, so it would not do what the audit claimed.

## Notes

Branched from `205-spacing-rhythm` because it builds on 205's fluid space tokens. Merge 205 first.
