---
id: "804"
title: "CI: Lighthouse budgets"
epic: Quality gates
status: todo
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

- [ ] Budgets enforced on PRs.
- [ ] A regression of more than 5 points fails.
