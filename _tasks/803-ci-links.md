---
id: "803"
title: "CI: internal & external link check"
epic: Quality gates
status: todo
priority: p0
size: S
owner: agent
depends_on: ["801"]
---

## Why

The old content links out heavily (GitHub, our.umbraco.com, NuGet, npm, CaptureOne…). Dead links erode the showcase.

## Scope

- Internal links and anchors are checked on every PR, offline against `dist/`, and are **blocking**.
- External links are checked weekly on a schedule plus on demand, and are **non-blocking**. The job opens or updates a single tracking issue listing dead links. It never commits fixes itself.
- Use `lychee` (a single binary via a pinned action SHA) to avoid npm dependencies.
- Exclusions list (rate-limiting sites such as LinkedIn and X) kept in `lychee.toml`.

## Acceptance criteria

- [ ] A broken internal link fails the PR.
- [ ] The scheduled external report runs and produces an issue.
