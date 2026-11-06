---
id: "1305"
title: "Style guide: generic styles and HTML elements"
epic: Style guide
status: review
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

- [x] The page's Markdown goes through the same renderer as articles. Met through the pipeline rather than a helper: the guide imports `.md` files, and Astro renders those with the same `markdown` config in `astro.config.mjs` (Prism, no extra plugins) as content entries. A shared helper would add nothing (reviewed 6 November 2026).
- [x] Every Prism token class used on the site appears in a code sample. Enforced by `tests/style-guide-elements.test.mjs`. `symbol` is the exception: no grammar the site uses emits it.
- [x] Focus states are visible in the guide, for example with a "show focus" demo.

## Progress

- Added `src/style-guide/elements.md` (text) and `src/style-guide/elements-code.md` (code), imported by `src/pages/style-guide/elements/index.astro`. They sit outside `src/pages` so Astro does not route them.
- The elements page has Text, Code, Interaction states and Utilities sections.
- Code samples cover C#, Bash, PowerShell, JavaScript and HTML (the languages the articles use), plus CSS and diff, which were needed for the token classes the stylesheet styles. The CSS and diff samples are not site languages.
- Heading anchors are shown with the `prose` block, which is where the site adds them.
- Set `ready: true` for Elements in `src/lib/style-guide.ts`.
- Added `tests/style-guide-elements.test.mjs` (Prism spans, each language, every styled token class).

## Not covered

- Links on an inverse surface (only buttons are shown on one).
- Visited link colour is described, not demonstrated.
- The skip link and theme toggle are described on the page, not demonstrated (they are in the layout on every page).
- Images with captions: Markdown has no caption element, so the caption is a plain italic paragraph.

## Found while building

- A plain `<button>` with no class fails dark-mode contrast: the reset in `global.css` makes buttons inherit text colour but leaves the browser's default button background. No page uses one today; worth a base style for `button` in a later ticket.
