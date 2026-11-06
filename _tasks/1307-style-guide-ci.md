---
id: "1307"
title: "Style guide in CI: visual regression across themes"
epic: Style guide
status: todo
priority: p1
size: M
owner: agent
depends_on: ["1302", "1303", "1304", "1305"]
---

## Why

Once the guide shows every variant, it is the best regression target on the site. For 207 a before/after pixel comparison was run by hand; it caught one real change. This makes that automatic.

## Scope

- Playwright screenshots of every guide page in light and dark, and in each page theme, at desktop and 390px widths.
- Baselines committed (small, compressed); a PR that changes pixels fails with a diff image uploaded as a CI artifact. Updating baselines is a deliberate command (`pnpm test:visual --update`), never automatic.
- axe already runs on every built page, so guide pages are covered. Add the page-theme dimension: run axe on guide pages with each `data-page-theme`.
- Fonts and animation are locked for stable screenshots: reduced motion, and wait for fonts to load.

## Acceptance criteria

- [ ] A one-token colour change produces a failing visual test naming the affected guide pages.
- [ ] Baselines update only through the explicit command.
- [ ] axe passes on every guide page in every page theme, light and dark.
- [ ] The visual job takes at most 5 minutes in CI.

## Notes

New dev dependencies need a reason in the PR. Prefer Playwright's built-in screenshot comparison (`playwright` is already a dev dependency) over a new diff library.
