---
id: "313"
title: "Article template: meta, contents and code blocks"
epic: Content model
status: review
priority: p0
size: M
owner: agent
depends_on: ["204"]
---

## Why

Articles open with a full-width dark hero, and nothing near the title shows the date, reading time or position in a series. There is no table of contents, so long articles are hard to navigate.

## Scope

- A light article header with the title and description, then a meta row below the title: date, reading time, and "Part 1 of 3" when `series` is set.
- A sticky table of contents built from the h2s on wide screens, collapsed above the article on narrow ones.
- Code blocks get a header with the file name and copy button, shared with the `code` block.
- Series navigation at the end ("Other articles in the series").

## Acceptance criteria

- [x] Reading time is computed at build time from the body.
- [ ] Table of contents links match the heading anchors, and the current section is highlighted without JS where possible.
- [x] Article body lines are 60 to 75 characters long at 1280px.

## Progress (6 November 2026)

- `ArticleHeader.astro` replaces a leading text-only hero on articles. It has the title, then the description, then a meta row (date, reading time and "Part N of M") and, for archived articles, the archive note, aligned with the text. Nothing sits above the title.
- Articles with three or more h2 sections get a contents list built from the rendered headings: a sticky column at 1100px and wider, and a collapsed `<details>` above the text on narrow screens. No JS.
- Articles gain optional `series` and `order` fields. The three "5 cool things" articles are `5-cool-things` parts 1 to 3; the order comes from their own descriptions ("As part of", "Continuing", "Finishing").
- Left:
  - Highlighting the current section needs JS (an IntersectionObserver). Not done; Sam to decide whether it's worth the script.
  - ~~Code-block headers (file name and copy button) for Markdown code.~~ **Done 6 November (overnight).** Article code renders as the shared code figure from ticket 1005 (language bar, Copy button, a named scroll region), with Prism's highlighting kept, and article tables stack on a phone. It is a string pass over the rendered body (`BodyHtml.astro`, `enhanceBodyHtml` in `src/lib/markdown.ts`) rather than a rehype step: Astro 7's default Markdown processor (Sätteri) only takes plugins through `@astrojs/markdown-satteri` as a direct dependency, and adding one wasn't worth it for this. Markdown fences have no file name, so body code shows the language only. The article grid now has one shrinkable column on narrow screens, which the 320px check needed once code scrolled instead of wrapping.
  - Series navigation is already in each article's content ("Other articles in the series"), so it isn't generated.
