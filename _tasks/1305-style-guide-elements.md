---
id: "1305"
title: "Style guide: generic styles and HTML elements"
epic: Style guide
status: todo
priority: p1
size: S
owner: agent
depends_on: ["1301"]
---

## Why

Markdown bodies render plain HTML styled by `global.css` (`.prose`), not by blocks. Those generic styles are where regressions hide: a heading margin, a table border, a code token colour.

## Scope

- An elements page showing:
  - h1 to h6
  - paragraphs at the measure
  - links (default, hover, visited, on inverse)
  - emphasis, strong, small
  - lists, nested lists and ordered lists
  - blockquote
  - tables
  - inline code and fenced code in each Prism-highlighted language the site uses
  - heading anchors
  - images with captions
  - horizontal rules
- The same content rendered through the real Markdown pipeline (not hand-written HTML), so it matches article bodies exactly.
- Interaction states: focus rings, `::selection`, buttons (`.button`, and on inverse), the theme toggle, skip link.
- Utility classes in use (`.visually-hidden`, `.text-center`, `.js-only`), with a note on each.

## Acceptance criteria

- [ ] The page's Markdown goes through the same renderer as articles (shared helper, not a copy).
- [ ] Every Prism token class used on the site appears in a code sample.
- [ ] Focus states are visible in the guide, for example with a "show focus" demo.
