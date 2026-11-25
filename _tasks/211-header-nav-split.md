---
id: "211"
title: Header shell with the nav split out, an optional sticky bar and a back-to-top arrow
epic: Design system
status: review
priority: p2
size: S
owner: agent
depends_on: ["209"]
---

## Why

The PM desk page (ticket 1004) renders through `BaseLayout`, which hard-wired the full site header with Software, Articles and CV. On a working page that isn't part of the site, the nav makes no sense. The same need will come up for microsites: the masthead and brand, with no nav or with their own. While in the header, Sam also asked (25 November 2026) for the sticky bar to be switchable and for a way back to the top once it is showing.

## Scope

- `Header.astro` is the masthead shell: logos, the masthead-to-bar behaviour and an end area. The default slot takes a nav, the `menu` slot a mobile menu placed after the tools, `themeToggle` (default true) the theme toggle between them, which belongs to the header rather than the nav.
- New `SiteNav.astro` holds the nav markup, styles and the Escape-to-close script, in two variants (`desktop`, `mobile`), with optional `items` so a microsite can pass its own links.
- `BaseLayout` gains `nav`, `themeToggle` and `stickyHeader` props and renders `SiteNav` into `Header`. Every existing page is unchanged.
- `features.stickyHeader` in `site.yaml` (default true) switches the masthead-to-bar behaviour site-wide; false makes the masthead scroll away with the page. A page can override it with `stickyHeader`.
- While the bar is stuck, a back-to-top arrow grows in at the far right. It is a link to `#top` (the body), so it works without JS and moves a keyboard user's focus start to the top; a mouse click scrolls smoothly unless reduced motion is set. On small phones the header controls lose their gap so the arrow fits.
- The desk route passes `nav={false}` and keeps the theme toggle.
- The stuck bar is smaller: `--header-h` goes from 72px to 64px on desktop and from 64px to 56px on a phone.

## Acceptance criteria

- [x] Site pages render the same header as before, plus the arrow when stuck.
- [x] A desk page built with `pnpm pm:desk` has the masthead logo and theme toggle and no nav.
- [x] `stickyHeader: false` removes the sticky behaviour, the sentinel and the arrow.
- [x] The stuck bar is 64px on desktop and 56px on a phone, with everything centred in it.
- [x] No sideways scroll at 375px with the bar stuck.
- [x] `pnpm check`, `pnpm lint`, `pnpm test` and `pnpm build` pass.

## Out of scope

- The footer still carries the site nav and socials on the desk page.
- A blur or shadow on "SAM MULLINS" on hover, which Sam reported. No shadow or filter is set on the logo on any branch, and it didn't reproduce in Chromium at 1x, paused mid-wave; waiting on a screenshot.

## Verification

- `pnpm check`, `pnpm lint`, `pnpm build` (84 pages) and `pnpm test` (108 pass) on this branch.
- Dev server, /articles/ at 1280px: the stuck bar is 64px with the logo, nav, toggle and arrow centred on one line, the arrow sits at the far right level with the toggle, and clicking it scrolls to the top with no hash; the arrow collapses again once unstuck. At 375px the bar is 56px, every control sits between 6px and 50px, and the arrow ends at 356px, inside the 16px gutter.
- Built the 23 November desk: no nav markup; the theme toggle, back-to-top link and their inline scripts are present; styles and fonts inlined (281 KB).
