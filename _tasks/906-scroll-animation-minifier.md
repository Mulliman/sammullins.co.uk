---
id: "906"
title: Make the hero's scroll-driven animations actually run
epic: Delight
status: review
priority: p1
size: S
owner: agent
depends_on: ["301", "905"]
---

## Why

The blurred hero's scroll-linked drift, and prototype B of ticket 905 (blur-to-sharp), never ran in a production build. The page renders fine without them, so nobody noticed. Two agents found the cause independently during the homepage experiments.

## Scope

- Fix every block whose scroll-driven animation is broken (only `src/blocks/Hero.astro` on `main`).
- A test that fails the build if it happens again.
- A note on the rule, here and on ticket 905.

## Acceptance criteria

- [x] The built CSS for `hero-drift` and `hero-sharpen` has no timeline inside an `animation` shorthand.
- [x] The drift and the blur-to-sharp animation run in Chromium on a production build (frames and progress values in the PR).
- [x] `tests/scroll-animations.test.mjs` fails on built CSS with a timeline inside the `animation` shorthand, and on any source rule that pairs the shorthand with `animation-timeline` or `animation-range`. It fails on `main` and passes here.
- [x] CHANGELOG line.

## Out of scope

- Deciding whether prototype B ships (still ticket 905).

## Notes

Two separate bugs, both silent:

1. **The minifier folds the shorthand.** Vite minifies CSS with Lightning CSS, which merges `animation: hero-drift linear both; animation-timeline: scroll();` into `animation: linear both hero-drift scroll()`. In Chrome `animation-timeline` is reset-only in the shorthand, so the whole declaration is invalid and dropped. **Rule: when a rule sets `animation-timeline` or `animation-range`, use longhands only** (`animation-name`, `animation-timing-function`, `animation-fill-mode`, ...). Leave `animation-duration` out (it defaults to `auto`, which is what a scroll timeline wants). The guard test enforces this.
2. **`overflow: hidden` steals the timeline.** `scroll()` and `view()` look for the nearest scroll container, and `overflow: hidden` makes an element one even though it never scrolls. The hero had `overflow: hidden`, so once the CSS was valid the drift tracked the hero itself and sat at 0% forever. The hero now uses `overflow: clip`, which clips the same way without creating a scroll container. Watch for this on any element that hosts or wraps a scroll-driven animation; the test does not catch it.
