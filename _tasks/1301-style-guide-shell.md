---
id: "1301"
title: "Style guide: unlisted section, shell and navigation"
epic: Style guide
status: todo
priority: p1
size: M
owner: agent
depends_on: ["207"]
---

## Why

Sam keeps a style guide, component library and example page structures on every project. Surrounded by Stories has one (`code/apps/guide`, a living guide rendered from the real token and UI exports). This site has only three hidden `blocks-demo` pages. The guide should be part of the real site, so it shows exactly what ships, but never signposted.

## Scope

- A section at `/style-guide/`, built with the site, with its own layout: a side nav listing the guide pages (Foundations, Themes, Elements, Components, Page structures), on-page section links, and previous/next between guide pages, as in the SbS guide.
- Unlisted everywhere:
  - `noindex`
  - not in the header, footer, sitemap, `llms.txt`, listings, the archive or search
  - no links from anywhere outside the guide
  - not disallowed in `robots.txt` either, since that would advertise the URL
- The guide pages are `.astro` routes under `src/pages/style-guide/`, an exception to "content is not code": the guide renders code, not prose. Record the exception in `_docs/decisions.md`.
- The guide uses the site's own tokens, components and blocks. Nothing guide-only is styled with values that aren't in the theme.
- The existing `blocks-demo` pages move into the guide (1304); their URLs redirect.

## Acceptance criteria

- [ ] `/style-guide/` and every page under it render with a `noindex` robots meta.
- [ ] No built page outside `/style-guide/` links to it (test).
- [ ] The sitemap and `llms.txt` contain no `/style-guide/` URL (test).
- [ ] The guide passes axe and the 320px check like every other page.

## Out of scope

- A separate app or Storybook. The guide is plain Astro pages in this site.

## Notes

Order: 1301 first, then 1302 to 1306 can go in parallel, then 1307.
