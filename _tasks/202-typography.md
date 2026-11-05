---
id: "202"
title: Self-hosted typography & thin heading rules
epic: Design system
status: todo
priority: p0
size: S
owner: agent
depends_on: ["201"]
---

## Why

Thin uppercase Lato headings are the signature and should stay as close as possible. Google Fonts goes (decisions: *Visual direction*).

## Scope

- Self-host Lato WOFF2: only the weights used (expected 100, 300, 400, 700, plus 400 italic).
- Pacifico, subset to the logo glyphs only (or convert the logo to SVG, see 904).
- `font-display: swap`; preload the one or two critical faces.
- Rules:
  - Display headings (≥ ~32px): Lato 100, uppercase, slight letter-spacing, full-strength colour.
  - Smaller headings: 300.
  - Body: 400.
- **Centred text** via a utility used only in symmetrical sections (hero, intro, short card copy). Long-form prose is left-aligned.
- Check the licences (both OFL) and include the licence files.

## Acceptance criteria

- [ ] No requests to `fonts.googleapis.com` or `fonts.gstatic.com`.
- [ ] Total font payload for a typical page is ≤ 120 KB.
- [ ] A visual side-by-side with the current home hero heading looks recognisably the same, with Sam's approval in the PR.
