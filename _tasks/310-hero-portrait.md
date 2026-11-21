---
id: "310"
title: "Hero: \"live portrait\" variant"
epic: Blocks
status: in-progress
priority: p0
size: M
owner: pair
depends_on: ["205"]
---

## Why

The home hero is an old photo with "Sam Mullins / Developer" in a box over it. The audit recommends option A: a greeting, a clear one-line statement, two calls to action and a short muted loop of Sam in an arched frame.

## Scope

- A new `hero` variant, `portrait`, with a heading, lead, up to two CTAs and an optional "Now:" line. The portrait is either an image or a 6 to 8 second muted, looping, self-hosted video with a poster.
- A visible pause button. With `prefers-reduced-motion` the video doesn't autoplay; only the poster shows.
- No new CSP entries: the video is served from `/` like images.
- On mobile the portrait shows above the text instead of being hidden.

## Acceptance criteria

- [ ] With reduced motion on, no video plays.
- [ ] The video is at most 1.5 MB (an AV1 or H.264 MP4 with a WebM fallback), and the poster image is the LCP element.
- [ ] axe passes, and the pause button has an accessible name and works from the keyboard.

## Notes

Needs a new photo or short video of Sam; the shot list is in the design audit report. Until then the variant works with a still.

## Change of direction (12 November 2026)

Sam decided against the arched "live portrait". He wants the hero to be more interactive and about him in general, and may drop the photo altogether. So the variant is now `about`, with no image or video:

- a one-line statement (the h1), a lead, up to two buttons and a "Now:" line
- 2 to 6 **facets** (Developer, Team lead, Agent-first, Tinkerer, Photographer in the draft), shown as tabs: click one, or use the arrow keys, and its card swaps in. Without JavaScript every facet is listed.
- no eyebrow or greeting above the heading (decisions: *Visual direction*)
- the mockup's code card and "6s loop" badge are dropped

The prototype is a hidden copy of the home page at `/hero-prototype/` (`src/content/pages/hero-prototype.md`, `hidden` and `noindex`), plus a style guide example (`hero-about`). The facet copy is `sam-ai`, drafted only from facts in the 508 launch copy.

The acceptance criteria above were written for the portrait and no longer apply. For `about`:

- [ ] axe passes on the prototype page and the style guide components page.
- [ ] The tabs follow the WAI-ARIA tabs pattern (arrow keys, Home and End), with a visible focus ring.
- [ ] Without JavaScript every facet and its link is readable.
- [ ] Sam approves the look and the facet copy, then the home page switches over and `/hero-prototype/` is deleted.
