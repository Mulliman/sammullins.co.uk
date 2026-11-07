---
id: "1303"
title: "Style guide: themes, light and dark, page themes"
epic: Style guide
status: review
priority: p1
size: S
owner: agent
depends_on: ["1301", "1302"]
---

## Why

There are now three dimensions to check: light and dark, the page theme (`default`, `christmas`, and future campaigns), and the inverse surfaces. A new campaign theme like the advent calendar needs one place to see every token, block and contrast pair in it before it ships.

## Scope

- A themes page with a switcher for light, dark or system, and for the page theme, so the guide can preview any page theme. A small script sets `data-theme` and `data-page-theme` on `<html>`; the guide's URL keeps the choice, so a view can be shared.
- For each page theme, a token diff against `default`: which tokens it overrides, with light and dark values side by side.
- A contrast table per theme, for light and dark, covering text, links and muted text on every surface. It's computed at build time, and failures are flagged on the page.
- Every other guide page respects the switcher, so all components can be checked in Christmas colours too.

## Acceptance criteria

- [x] Adding a theme to `pageThemes` adds it to the switcher with no other change.
- [x] The token diff for `christmas` lists exactly the tokens `christmas.css` sets.
- [x] Without JS, the page still shows every theme's swatches and contrast table, statically.
- [x] `src/styles/themes/README.md` says "check it in the style guide" as a step for new themes.

## Progress

- Branch `1303-style-guide-themes`, built on the `style-guide` branch.
- `src/lib/tokens.ts` now reads any page theme file: the light and dark overrides, the token diff against default, and a contrast table (text, muted text and links on bg, bg-muted and bg-inverse, light and dark). It also writes the swatch stylesheet for the themes page.
- Themes page at `/style-guide/themes/`: a static diff and contrast table per page theme. Failures are flagged in text.
- The switcher (`StyleGuideThemeSwitcher.astro`) sits in `StyleGuideLayout`, hidden without JS. It keeps mode and page theme in the URL query and carries them across guide links.
- `BaseLayout` loads every theme CSS file in the folder, so a new theme needs only its file and a `pageThemes` entry. Checked with a throwaway theme, since removed.
- The inverse pairs are checked with the inverse text tokens, as `.surface-inverse` uses them.
- Not done: no browser check with JavaScript disabled. The no-JS claim rests on the tables and swatches being static HTML and CSS.
