---
id: "801"
title: "CI core: check, lint, build"
epic: Quality gates
status: done
priority: p0
size: S
owner: agent
depends_on: ["005"]
---

## Why

Nothing merges to `main` without passing gates (decisions: *Repo quality bar*).

## Scope

- `.github/workflows/ci.yml` on `pull_request` and `push: main`:
  - install with `--frozen-lockfile`
  - `pnpm check`, `pnpm lint`, `pnpm format --check`, `pnpm test` (schema tests), `pnpm build`
- Upload `dist/` as an artifact for the downstream jobs (802–805, 602).
- Concurrency: cancel superseded runs.
- Register the jobs as required status checks on `main` (update 001's ruleset).

## Acceptance criteria

- [x] A PR with a schema error fails CI with a readable message.
- [x] A typical run takes ≤ 5 minutes.

## Verification (6 November 2026)

`astro check` and Zod name the file and field on schema errors; the CI job takes about 40s before the a11y job.
