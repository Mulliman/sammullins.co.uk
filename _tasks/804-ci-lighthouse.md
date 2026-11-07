---
id: "804"
title: "CI: Lighthouse budgets"
epic: Quality gates
status: done
priority: p1
size: S
owner: agent
depends_on: ["801"]
---

## Why

Performance is part of the craft (decisions: *Repo quality bar*).

## Scope

- Lighthouse CI against a representative set: home, an article, a software doc, a photo album, the 404 page.
- Budgets:
  - Performance ≥ 95, Accessibility = 100, Best Practices ≥ 95, SEO = 100
  - JS ≤ 50 KB/page, CSS ≤ 50 KB/page
  - LCP ≤ 2.0s and CLS ≤ 0.02 (simulated mobile)
- Report uploaded as a CI artifact.

## Acceptance criteria

- [x] Budgets enforced on PRs. ("Lighthouse budgets" added to the `Main` ruleset's required checks by Sam on 7 November 2026, ticket 806.)
- [x] A regression of more than 5 points fails. (The score floors enforce it; see Progress.)

## Progress (6 November 2026)

- `lighthouserc.json` sets the pages (home, an article, a software doc, a photo album, the 404) and the budgets: Performance ≥ 95, Accessibility 100, Best Practices ≥ 95, SEO 100 (not on the 404, which is `noindex` on purpose), JS and CSS ≤ 50 KB each, LCP ≤ 2.0s, CLS ≤ 0.02.
- A new CI job, "Lighthouse budgets", runs `treosh/lighthouse-ci-action` 12.6.2 (pinned to its commit SHA, no new package dependency) on the built `dist/` and uploads the reports as an artifact.
- A local run found two heading-order problems, both fixed: card titles are now `h2` when nothing above the grid is a heading, and four xStatic docs and one album skipped from h1 to h3 or h4.
- Locally every page scores 100 for Accessibility, Best Practices and SEO, LCP is 0.9 to 1.9s, CLS is 0, JS is 2 KB and CSS 11 KB. Performance can't be judged on this Windows machine: a blank HTML page also scores 70 there (about 6s of unattributable main-thread time). The first CI run is the real test.
- "A regression of more than 5 points fails": the score floors enforce this for every category except Performance, where the floor is 95.
- Left: Sam makes "Lighthouse budgets" a required check once it has passed in CI.
- First CI runs (7 November 2026, PRs 6 and 7): the home page missed Performance (0.89 to 0.94) through a 177ms main-thread task; priority images were `decoding="sync"`, so the hero photo and its full-size blurred backdrop decoded on the main thread. Fixed with async decoding and a 160px backdrop (home now 0.97 to 0.99). The album page's LCP then flipped between 1.9s and 2.9s on identical builds, so each page now runs three times and each budget is checked against the best run (`aggregationMethod: optimistic`). A real regression still fails, because it shows up in all three runs.
- 7 November 2026: Sam dropped the album page from the Lighthouse run. Photography pages are image-heavy by design and their performance doesn't matter to him; the other four pages keep their budgets.
