---
id: "509"
title: "Home page story: from the 2011 question to a Sam of several software skills"
epic: Migration
status: in-progress
priority: p0
size: M
owner: pair
depends_on: ["210"]
---

## Why

Sam (26 November 2026): build on the ticket 210 home page, and make it tell one story. Structure first; making it "dynamic and beautiful" is a later pass. The `lab/home-*` experiments (12 to 13 November) got the content direction closer, but Sam rejected all of their designs.

Sam then sketched the page (`_sketches/Homepage.excalidraw` in the parent folder, outside the repo). The page follows that sketch. Sam's sketch text is rough notes, apart from the last three lines, which are close to final and kept almost word for word.

## Page plan (following the sketch)

| # | Band | Blocks | Surface |
|---|---|---|---|
| 1 | ~~Jack of all trades?~~ Sam of several software skills, and the 2011 question | `hero` (plain, left, mark) | dark hero |
| 2 | First, a C# specialist (Redweb, Sitecore and Umbraco) | `section` > `split` 2:1: `intro`, `logoWall` badges (generic Sitecore and Umbraco logos, as the certs are old) | muted |
| 3 | Working with clients (agency team and onsite consultant) | `section`: `intro`, `logoWall` | default |
| 4 | Then into enterprise (LV= 1.5k, Allianz 150k, TCS 500k colleagues) | `section`: `intro`, `cards` text, 3 columns | muted |
| 5 | Where my skills kept broadening (front end, DevOps, infrastructure) | `section`: `intro`, `cards` text, 3 columns | default |
| 6 | And then a team lead | `section`: `intro`, `prose` list | muted |
| 7 | But it was never just a job (xStatic award, side projects) | `section`: `split` 2:1 (`intro`, award `image`), `cards` (xStatic feature, then four), `intro` CTA | default |
| 8 | Getting ready for the agentic era (local AI, coding agents, AI-first team, CCA-F) | `section` > `split` 2:1: `intro`, `logoWall` badges (CCA-F, linked to Credly) | muted |
| 9 | So, fifteen years later: Sam's three closing lines, CV link | `section`: `intro` | default (not dark: the footer already is) |

## Component changes (small, needed by the sketch)

- `hero`: `~~words~~` in the heading are struck through on their own smaller line; screen readers hear "crossed out" first.
- `split` can sit inside a `section` (it shares the band and centres its columns), closing the earlier gap.
- `logoWall` has `variant: badges`: certificates and awards in colour, no tile, fixed size. New badge masters are in `src/assets/media/badges/` (Sitecore and Umbraco from Simple Icons in brand colours, CCA-F from Credly).
- Style guide examples for both.

## Acceptance criteria

- [ ] Sam approves the structure and wording on the deploy preview.
- [x] The page follows Sam's sketch, band for band.
- [ ] Facts to confirm: TCS (role and since when), the colleague counts, and "each organisation since has been bigger than the last".
- [ ] Voice rules from `AGENTS.md`: first person, British English, no em or en dashes as punctuation, no hype words, sentence-case headings. `authorship: "sam-ai"`.
- [ ] `pnpm verify` passes.

## Notes

- Stacked on `210-design-2026` (PR #66). Merge that first.
- It replaces the home intro that draft PR #25 (ticket 508) also rewrites, including its `[the tools I use]` placeholder (now filled from the sketch). Once this lands, #25 only needs its bio, footer and CV changes.
- The earlier draft's timeline is gone: the sketch gives each stage its own band instead.
- Second pass (26 November 2026), from the Opus and Neon reviews and Sam's answers:
  - TCS is now explained: Sam's role moved to TCS under TUPE in 2025, still on the Allianz account.
  - The award is now mentioned once in the text, beside the badge image.
  - Tighter wording, "Capture One" spelt as two words, and "Action on Hearing Loss (now RNID)".
  - The closing band now argues the payoff: agents do the narrow work, so breadth is what's scarce.
  - The page ends with a LinkedIn button, the CV as a second button (the new `intro.secondaryCta`), and "What I've been up to recently", showing the three newest articles. Archived articles are included, because every article is archived until the launch articles land.
- Later: a subtle monochrome photo of Sam as a background (Sam, 26 November 2026), in the visual pass.
- Open: whether to merge the enterprise and skills bands (Sam to decide from the screenshots).
