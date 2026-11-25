---
id: "211"
title: Split the site nav out of the header, so a page can have the masthead without it
epic: Design system
status: review
priority: p2
size: S
owner: agent
depends_on: ["209"]
---

## Why

The PM desk page (ticket 1004) renders through `BaseLayout`, which hard-wired the full site header: Software, Articles, CV and a theme toggle. On a working page that isn't part of the site, the nav makes no sense, and the toggle was a dead button because `scripts/pm/desk.mjs` drops the bundled scripts that drive it. The same need will come up for microsites: the masthead and brand, with no nav or with their own.

## Scope

- `Header.astro` is the masthead shell only: logos, sticky masthead-to-bar behaviour and an end area. The default slot takes a nav, the `menu` slot a mobile menu placed after the tools, and `themeToggle` (default true) controls the toggle between them.
- New `SiteNav.astro` holds the nav markup, styles and the Escape-to-close script, in two variants (`desktop`, `mobile`), with optional `items` so a microsite can pass its own links.
- `BaseLayout` gains `nav` and `themeToggle` props (both default true) and renders `SiteNav` into `Header`. Every existing page is unchanged.
- The desk route passes `nav={false} themeToggle={false}`.

## Acceptance criteria

- [x] Site pages render the same header markup and order as before (nav, toggle, mobile menu).
- [x] A desk page built with `pnpm pm:desk` has the masthead logo and no nav or theme toggle.
- [x] `pnpm check`, `pnpm lint`, `pnpm test` and `pnpm build` pass.

## Out of scope

- The footer still carries the site nav and socials on the desk page. Whether the desk (or a microsite) wants a slimmer footer is a separate question.

## Verification

- `pnpm check`, `pnpm lint`, `pnpm build` (84 pages) and `pnpm test` (108 pass) on this branch.
- Built the 23 November desk: no `nav--desktop`, `nav--mobile` or `data-theme-toggle` in the markup, stacked logo present, styles and fonts inlined (279 KB).
