---
id: "509"
title: "Home page story: from the 2011 question to a Sam of all trades"
epic: Migration
status: in-progress
priority: p0
size: M
owner: pair
depends_on: ["210"]
---

## Why

Sam (26 November 2026): build on the ticket 210 home page, and make it tell one story using existing blocks first. Making it "snazzy" is a later pass. The `lab/home-*` experiments (12 to 13 November) got the content direction closer, but Sam rejected all of their designs, and their set-piece ideas (the scroll-patched headline, the T diagram, the honest-limit callout) are dropped.

## The story (Sam's outline)

1. Fifteen years ago my website asked "What is wrong with being a jack of all trades?"
2. Web development was becoming more and more specialised.
3. Liking web design, front-end and back-end work didn't make me a jack of all trades. I just had some tech skills.
4. Over the years I became a back-end technical expert in web content management and C#.
5. I worked directly with lots of different clients.
6. I got involved with JS, TS and React, at work and outside it.
7. Work became more about DevOps and infrastructure: AKS on Sitecore Managed Cloud, and Azure DevOps.
8. I became a team lead of up to 7 developers, and one of the main points between business and technical staff.
9. Award-winning open source (xStatic), and other things made outside work over the years.
10. The move into AI: transformation at work, experimentation outside it. Claude Certified Architect.
11. Specialism is the past, generalism is the future, and I plan on being a Sam of all trades.

## Page plan (existing blocks only)

| # | Beat | Block | Surface |
|---|---|---|---|
| 1 | The question (1) | `hero` (plain, left, mark): the question is the `h1`; the subheading names Sam and promises an answer | dark hero |
| 2 | 2011 (2, 3) | `intro` (left) | default |
| 3 | The trades, one at a time (4 to 8, 10) | `timeline`: back-end specialist, clients, front end again, DevOps, team lead, AI | muted |
| 4 | Clients (5) | `section` with `intro` and `logoWall` (white logo tiles, so it stays on the default surface) | default |
| 5 | Made outside work (9) | `section`: `intro`, xStatic as a lone feature card, then a row of four (The Imposter, XPEDITE, PanoCapture, PostCapture), "See all my software" | muted |
| 6 | Where AI fits (10) | `section`: `intro` and one `prose` with "At work" and "Outside work" subheadings (a `split` cannot sit inside a `section` yet, a gap for the polish pass) | default |
| 7 | The answer (11) | `section` with `intro` and a CV link | inverse |

## Acceptance criteria

- [ ] Sam approves the story order and the wording, on the deploy preview.
- [x] Every placeholder is filled by Sam (none may be guessed). Filled 26 November 2026: front end from 2021, DevOps from 2023 (put under Allianz Technology), AI engineering from 2025 ("simmering for years, but truly one year of proper AI engineering"). The "At work" paragraph was filled on the same day from Sam's notes (coder-first to AI-first with human oversight, driven by Sam and the tech lead, a shared Claude skill library, the CCA-F certification).
- [ ] Only existing blocks; no new components or CSS (visual polish is a follow-up ticket).
- [ ] Voice rules from `AGENTS.md`: first person, British English, no em or en dashes as punctuation, no hype words, sentence-case headings. `authorship: "sam-ai"`.
- [ ] `pnpm verify` passes.

## Notes

- Stacked on `210-design-2026` (PR #66). Merge that first.
- One exception to "only existing blocks", at Sam's request (26 November 2026): the hero heading now supports `~~words~~` for struck-through text, so the question reads "What is wrong with being a ~~jack of all trades~~ Sam of several skills?" (poking fun at the 2011 claim). Screen readers hear "crossed out" before the struck words. The page still closes on "a Sam of all trades", the payoff for earning the trades since.
- It replaces the home intro that draft PR #25 (ticket 508) also rewrites, including its `[the tools I use]` placeholder. Once this lands, #25 only needs its bio, footer and CV changes.
- Facts beyond Sam's outline come from the home lab brief's fact list (Redweb 2010 to 2021, LV= ElectriX on Sitecore and React, Sitecore 10.2 on Docker and Managed Cloud, Allianz Technology from 2023, certified in Sitecore and Umbraco, mentoring up to three developers).
