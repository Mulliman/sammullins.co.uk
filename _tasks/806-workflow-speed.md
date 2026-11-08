---
id: "806"
title: "Faster review loop: local verify, PR rules, Playwright cache, changelog"
epic: Quality gates
status: done
priority: p1
size: S
owner: agent
depends_on: ["801"]
---

## Why

An audit of CI and the agent workflow on 7 November 2026 found that CI is quick (about 3 to 4 minutes a PR) but the loop around it is slow:

- PRs 6 and 7 failed CI four times in about 45 minutes, all on Lighthouse, which wasn't a required check, so it couldn't block a merge but still cost rounds of fixes.
- Work built up on local stacked branches. PR 6 carried 33 commits across about 15 tickets, which caused merge-forward commits and CI re-runs on both PRs.
- 25 tickets said `review` after their PRs had merged, so the queue looked blocked on Sam when it wasn't.
- The PR title check failed twice because AGENTS.md never stated the Conventional Commits rule.
- There was no single local command matching CI, and the changelog in the quality bar (decisions: *Repo quality bar*) didn't exist.

## Scope

- `pnpm verify`: CI's local gates in CI's order, stopping at the first failure (`--quick` skips axe).
- AGENTS.md: branch and PR rules (one ticket per PR from `origin/main`, draft early, rebase not merge-forward, worktrees, PR titles, verify before push, Lighthouse is required, tickets to `done` on merge, changelog line).
- CI: cache Playwright's Chromium per Playwright version.
- Netlify: a local build plugin that saves and restores `node_modules/.astro`, and an unshallow step so git dates are right. No new dependency.
- `CHANGELOG.md`, seeded from PRs 1 to 9.
- Flip tickets that merged with every criterion ticked to `done`.
- Make "Lighthouse budgets" a required status check (closes the last criterion of 804).

## Acceptance criteria

- [x] `pnpm verify` passes on this branch and fails at the first failing gate.
- [x] AGENTS.md states the PR title format and the branch rules.
- [x] The accessibility job restores Chromium from the cache on a second run. (Saved as `playwright-Linux-1.64.1` on 7 November; the first hit comes on the next run.)
- [x] The first Netlify deploy logs "Saved node_modules/.astro", and the second logs "Restored". (Needs 701.)
- [x] `CHANGELOG.md` exists and AGENTS.md points to it.
- [x] Merged tickets with no open criteria are `done`; the rest say what is left.
- [x] "Lighthouse budgets" is a required check in the `Main` ruleset (Sam, 7 November 2026).

## Done by Sam (7 November 2026)

- **Permission allowlist:** `.claude/settings.json` lets Claude Code run read-only `pnpm`, `git` and `gh` commands without asking. `gh pr merge` is on the `ask` list (Sam wants merging possible, but only with his say-so each time), and pushing to `main` is denied. Committed in this PR so worktrees and clones get it.
- **Lighthouse required:** "Lighthouse budgets" is in the `Main` ruleset's required checks, so ticket 804 is done.

## Verification (7 November 2026, PM pass)

- Playwright cache: CI run 42420018679 (the merge of PR #13) logs "Cache restored from key: playwright-Linux-1.64.1". Met.
- Left: the Netlify build cache ("Saved" then "Restored" `node_modules/.astro`). Netlify's deploy logs need Sam's login, so this pass couldn't read them. The log for PR #13 is at https://app.netlify.com/projects/sammullinscouk/deploys/6aefa030256c5f690249e86d.

## Verification (8 November 2026)

Sam read a Netlify deploy log: "10:03:39 PM: Restored node_modules/.astro from the build cache." A restore means an earlier deploy saved it, so the criterion is met. Every criterion is ticked; done.
