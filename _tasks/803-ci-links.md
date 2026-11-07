---
id: "803"
title: "CI: internal & external link check"
epic: Quality gates
status: review
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

- [x] A broken internal link fails the PR.
- [ ] The scheduled external report runs and produces an issue.

## Verification (6 November 2026)

Left: wait for the scheduled external link report to run once.

## PM note (7 November 2026)

- `external-links.yml` has never run (`gh run list --workflow external-links.yml` is empty). The first scheduled run is Monday 9 November at 06:17 UTC. It also has `workflow_dispatch`, so it can be run by hand.
- **Bug:** the workflow creates its issue with `--label link-check`, and the repo has no such label (`gh label list --search link-check` is empty). `gh issue create` fails on a missing label, so the first run would fail at the last step. Fix: `gh label create link-check` once, or add `gh label create link-check --force` to the workflow step.
