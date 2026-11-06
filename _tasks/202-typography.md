---
id: "202"
title: Self-hosted typography & thin heading rules
epic: Design system
status: done
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

- [x] No requests to `fonts.googleapis.com` or `fonts.gstatic.com`.
- [x] Total font payload for a typical page is ≤ 120 KB.
- [x] A visual side-by-side with the current home hero heading looks recognisably the same, with Sam's approval in the PR.

## Verification (6 November 2026)

Superseded by 204: Mona Sans replaced Lato, so the "recognisably the same" side-by-side no longer applies. No Google font hosts (hygiene test); font payload is 81.6 KB.
