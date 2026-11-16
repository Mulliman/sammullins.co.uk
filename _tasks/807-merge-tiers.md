---
id: "807"
title: Merge tiers, auto-merge on green, and less bookkeeping
epic: Quality gates
status: in-progress
priority: p1
size: M
owner: pair
depends_on: ["801", "806"]
---

## Why

Every PR waited for Sam, though the ruleset already required no human review: 31 PRs merged at about 8.6 hours each, half of them Renovate bumps, 13 merged in under an hour (a rubber stamp). 21 of 113 commits on `main` in November were ticket bookkeeping. Sam was the slowest gate without making anything safer. Audit, 16 November 2026; decision amended in `_docs/decisions.md` (*AI authoring workflow*).

## Scope

- `scripts/merge-policy.mjs` sorts a PR into tier 0 (Renovate non-major, tickets, docs), 1 (code) or 2 (content, `src/data/`, hosting, build hooks, CI, dependencies, agent rules, the decisions record, the voice guide, the policy itself). The `Merge policy` workflow runs it from the base branch (`pull_request_target`, read-only) and fails tier 2 until Sam's `sam-approved` label is added after the latest push.
- Renovate auto-merges non-major updates and lockfile maintenance; majors get the `major` label (tier 2).
- TypeScript back on `7.1.0-beta` (Sam's decision of 10 November). Renovate had ranked the nightly `-dev` builds above it and opened a PR a day; it now skips `-dev`.
- `@emnapi/runtime` held on 1.x: lockfile maintenance (PR #38) resolved 2.0.0-beta, which crashes `@astrojs/ts-content-mapper` (TS18099).
- Ticket status: the ticket's own PR sets `done`; "in review" is derived from the open PR by `pnpm tasks:status`. `review` is retired.
- `CHANGELOG.md`'s Unreleased section is generated from PR titles (`pnpm changelog --write`).
- PR template keeps only what CI can't check.
- CI: an advisory `Visual changes` job (the ticket 1307 compare, base against PR, report in the job summary, diff images as an artifact) and an advisory AI review (`anthropics/claude-code-action`, skipped without the `ANTHROPIC_API_KEY` secret).
- Docs drift test: the Astro version, block list, direct dependencies and `pnpm check` description in AGENTS.md, ARCHITECTURE.md, README and the decisions record are checked against the code. The stale facts were fixed.

## Acceptance criteria

- [x] `pnpm test` covers the tiers, the approval timing, the changelog and docs drift.
- [x] `pnpm check` passes on TypeScript 7.1 beta with a freshly resolved lockfile.
- [x] PRs #38 (Renovate) and #31, #25 (content) classify as tier 0, 2 and 2.
- [ ] **Sam:** after this merges, add `Merge policy` to the `Main` ruleset's required checks.
- [ ] **Sam:** create the `sam-approved` label (and `major`, which Renovate also creates on first use).
- [ ] **Sam:** add the `ANTHROPIC_API_KEY` repository secret to turn on the AI review.
- [ ] **Sam:** let agents run `gh pr merge` in `.claude/settings.json` (an agent may not change its own permissions).

## Out of scope

- A separate GitHub identity (bot account or App) for agents. Until then agents act as Sam's account, so the `sam-approved` label is a convention backed by agent permissions, not a hard lock. With a bot identity the policy can require Sam's own approval instead.
- Moving the existing `review` tickets: the next PM pass does that.

## Notes

- `pull_request_target` workflows run from the base branch, so the `Merge policy` check first runs on the PR after this one.
- A tier 2 PR that gets a new push needs the label removed and added again: approval only counts after the latest push.
