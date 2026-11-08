---
id: "310"
title: "Hero: \"live portrait\" variant"
epic: Blocks
status: ready
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
