---
id: "705"
title: Supply chain hardening
epic: Hosting & security
status: in-progress
priority: p0
size: M
owner: agent
depends_on: ["002", "801"]
---

## Why

The npm dependency tree is the main remaining attack vector, and it exists at build time only (decisions: *Framework (final)*, *Repo quality bar*).

## Scope

- Renovate (preferred) or Dependabot:
  - grouped updates, `minimumReleaseAge` / cooldown of 7 days
  - lockfile maintenance weekly
  - **no automerge**
  - GitHub Actions digests pinned and updated too
- Every GitHub Action pinned to a full commit SHA, with a version comment.
- Workflow `permissions:` default `contents: read`; elevated only per job where needed.
- `harden-runner`, or an equivalent egress audit, on CI jobs (optional; justify).
- CodeQL (JavaScript/TypeScript) and OpenSSF Scorecard workflows, with the Scorecard badge in the README.
- `pnpm audit` (or `osv-scanner`) in CI, failing on high or critical.
- SBOM generated on release (optional, p2).

## Acceptance criteria

- [x] No workflow uses a tag-only action reference.
- [ ] OpenSSF Scorecard ≥ 8.
- [ ] A Renovate PR waits ≥ 7 days after an upstream release.
- [x] Nothing ever auto-merges.

## Verification (7 November 2026, PM pass)

- Actions: every `uses:` in `.github/workflows/` on `main` is pinned to a 40-character SHA. Met.
- Auto-merge: `renovate.json` sets `automerge: false` and `platformAutomerge: false`, and `gh pr merge` is on the agent `ask` list (806). Met.
- Scorecard: **6.7** (api.securityscorecards.dev, 7 November 22:19 UTC). The checks at 0 are Maintained (the repo is under 90 days old), Code-Review (a solo repo has no approvals), Contributors, CII-Best-Practices and Fuzzing; Branch-Protection is 3. Most of these can't move for a one-person repo, so 8 looks out of reach. The target needs Sam's decision.
- Renovate: no Renovate PR has ever been opened, not even the onboarding one, so the Renovate GitHub app is probably not installed on the repo. That's Sam's to install.

## Renovate installed (8 November 2026)

Sam installed the Renovate app (Mend) on the repo, in "Scan and Alert" mode. "Scan Only", Mend's default, sets Renovate to silent, so it would never open a PR and the 7-day criterion could never be met. `renovate.json` still decides what the PRs look like: grouped, 7 days' minimum release age, no automerge. Left: the first Renovate PR, checked against an upstream release date, and the Scorecard target decision.

## Renovate's first PR (8 November 2026)

Renovate's first PR (#18, "pin dependencies") would have pinned `.nvmrc` to `v24.22.2` and replaced the `engines` minimum `>=24.16.0` with `v26.13.0`, a different major. That comes from `rangeStrategy: "pin"` applied to Node. `renovate.json` now leaves Node alone: it stays on the 24 line, set by hand in `.nvmrc`, `netlify.toml` and `engines`, and "24" picks up patch releases on every CI run and Netlify build. Renovate closes #18 itself once this is on `main`. Moving to a new Node major is a ticket, not a Renovate PR.
