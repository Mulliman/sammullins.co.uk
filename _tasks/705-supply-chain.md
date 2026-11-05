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

- [ ] No workflow uses a tag-only action reference.
- [ ] OpenSSF Scorecard ≥ 8.
- [ ] A Renovate PR waits ≥ 7 days after an upstream release.
- [ ] Nothing ever auto-merges.
