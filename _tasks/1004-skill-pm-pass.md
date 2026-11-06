---
id: "1004"
title: "Skill: pm-pass (what needs Sam, as a desk page)"
epic: AI authoring
status: review
priority: p1
size: M
owner: agent
depends_on: ["004"]
---

## Why

With 80-odd tickets, a dozen branches and work split across agent sessions, the hard part is no longer doing the work but seeing what is waiting on Sam. Surrounded by Stories solved this with a PM pass that ends in a "desk page": one expander per action, steps in order, a recommendation each. This brings the same idea here, sized for a one-person site with no reconciler, launcher or hub.

## Scope

- `scripts/tasks/status.mjs` (`pnpm tasks:status`): a read-only instrument. It reads every ticket's front matter and cross-checks it against git (local and remote branches, merged into `main` or not, commits ahead) and open PRs (`gh`, if available). It reports dependency readiness and drift: a ticket marked `done` with unmerged work, `review` with no PR or branch, `todo` whose branch already merged, branches no ticket claims, and `main` against `origin/main`. Markdown by default, `--json` for agents. It writes nothing.
- `.agents/skills/pm-pass/SKILL.md`: the PM role and the desk page contract, adapted from the Surrounded by Stories PM (`sbs-tasks/PM.md`). Synced to `.claude/skills/` as usual.
- A user-level shim at `~/.claude/skills/site-pm-pass/` (outside the repo) so the skill is found when a session opens in the parent folder rather than the repo.

## Acceptance criteria

- [x] `pnpm tasks:status` runs on a clean clone with no network and no `gh`, and exits 0.
- [x] It flags at least: done-but-unmerged, review-without-PR, todo-but-merged, orphan branches, and tickets whose dependencies are all done but are still `todo`.
- [x] `node scripts/skills/sync.mjs --check` passes with the new skill.
- [ ] Sam runs one pass and confirms the desk page format works for him (or says what to change).

## Out of scope

- Any automatic status writing, merging, branch deletion or PR closing. The PM proposes; Sam does.
- A phone hub (SbS's Mission Control Desk tab). The artifact link is enough for now.

## Notes

The PM may edit ticket front matter (`status`, `depends_on`), `BACKLOG.md` and the ticket index in `README.md`, always on a branch with a PR, because Sam merges.
