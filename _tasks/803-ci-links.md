---
id: "803"
title: "CI: internal & external link check"
epic: Quality gates
status: done
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
- [x] The scheduled external report runs and produces an issue.

## Verification (6 November 2026)

Left: wait for the scheduled external link report to run once.

## PM note (7 November 2026)

- `external-links.yml` has never run (`gh run list --workflow external-links.yml` is empty). The first scheduled run is Monday 9 November at 06:17 UTC. It also has `workflow_dispatch`, so it can be run by hand.
- **Bug:** the workflow creates its issue with `--label link-check`, and the repo has no such label (`gh label list --search link-check` is empty). `gh issue create` fails on a missing label, so the first run would fail at the last step. Fix: `gh label create link-check` once, or add `gh label create link-check --force` to the workflow step.

## Verification (8 November 2026)

- Sam created the `link-check` label and ran `external-links.yml` by hand on `main` (run 42465727599). It passed and opened issue #15. That run was started by hand, not by the schedule, but it is the same workflow; the first scheduled run is Monday 9 November.
- That report listed 159 errors, and none were real broken pages: 153 root-relative links (`/software/...`) that lychee can't resolve in raw Markdown, 3 sites that refuse automated checkers (LinkedIn 999, X 403, npm 403) and 3 github.com pages answering 504.
- Fixed on `803-link-check-noise`:
  - The settings are in `.github/lychee-external.toml`, not `lychee.toml`, because lychee loads `lychee.toml` automatically and its settings would switch off the offline internal check. `--root-dir` plus `scheme = ["https", "http"]` drops root-relative links, which the "Internal links" CI job already checks against `dist/`. LinkedIn, X and npm are excluded, as the scope asked. Timeouts get three retries and a 30-second limit.
  - github.com is excluded too. GitHub answers anonymous requests for profile and file pages with 504, even with a browser user agent, so a moved file looks the same as a working one. All 11 github.com links were checked through the GitHub API instead. One was really broken (`GitDeployer.cs` had moved to `Source/XStaticCore/XStatic.Git/`), and it is fixed in `5-cool-things-i-used-to-build-xstatic.md`.
  - The workflow creates the label if it's missing, and closes the open issue when a run is clean.
- Run 42466173576 on the branch: 214 links, 38 passed, 176 excluded, 0 errors. It closed issue #15 with a link to the run. (Its first attempt failed while downloading lychee from github.com, during the same GitHub problems; the rerun passed.)

## GitHub links through the API (8 November 2026, Sam asked for it)

- `scripts/links/github-links.mjs` finds every github.com link in `src/content` and asks the GitHub API about it, with the workflow's own token: a profile checks the user, a `blob` or `tree` link checks the file at its ref, and anything else checks the repo. No new dependencies.
- It runs in the same workflow after lychee. Its findings go into the same issue, and the issue closes only when both checks pass. If the script itself can't run (no token), the job fails visibly rather than closing the issue.
- `tests/github-links.test.mjs` covers the URL handling. Run locally: 11 checked, 0 broken. Against the API, the old `GitDeployer.cs` path and a missing repo both return 404, and the fixed path returns 200.
