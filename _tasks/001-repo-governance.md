---
id: "001"
title: GitHub repo, identity & governance
epic: Foundation
status: todo
priority: p0
size: M
owner: pair
depends_on: []
---

## Why

The repo is public and part of the showcase (decisions: *Repo visibility*, *Repo quality bar*). The gmail address must never appear (decisions: *Contact*), and the global git config currently uses it.

## Scope

- **Sam:** choose a commit identity. Recommended: the GitHub noreply address (`<id>+Mulliman@users.noreply.github.com`), set **repo-locally** (`git config user.email …`).
- **Sam:** enable GitHub "Keep my email addresses private" and "Block command line pushes that expose my email".
- Create the public GitHub repo `Mulliman/sammullins.co.uk`, push `main`.
- Branch protection / ruleset on `main`: PR required, required status checks (filled in by 801+), signed commits, linear history, no force-push, no deletion, applies to admins too.
- Set up commit signing (SSH signing key recommended).
- Enable secret scanning and push protection, Dependabot alerts, private vulnerability reporting.
- Repo settings: squash-merge only, PR title becomes the commit message, auto-delete head branches, **auto-merge disabled**.

## Acceptance criteria

- [ ] `git log --format='%ae' | sort -u` shows no gmail address.
- [ ] A direct push to `main` is rejected.
- [ ] An unsigned commit can't be merged.
- [ ] Auto-merge is off in repo settings.
- [ ] Secret scanning and push protection are on.

## Out of scope

Licence and docs content (1101). CI checks themselves (8xx).

## Notes

Commit the existing `_tasks/` and `_docs/` only after the identity is set. Nothing has been committed yet.
