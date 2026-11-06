---
id: "903"
title: Console secret
epic: Delight
status: review
priority: p1
size: S
owner: pair
depends_on: ["702"]
---

## Why

A fun surprise for developers who open DevTools (decisions: *Delight v1*).

## Scope

- **Sam + agent:** decide the secret, i.e. what the code unlocks. Ideas: a hidden theme (e.g. "terminal green"), a hidden page (`/secret/`, noindex), or a thank-you note with a link to the repo.
- On load, a styled `console.log` greeting with ASCII art, a link to the repo and AGENTS.md, and a puzzle or clue.
- Solving it: e.g. `window.unlock('<code>')` (defined only in the console script), or a typed key sequence. The answer is derivable, not brute-forced: for example, hidden in `llms.txt` or the `humans.txt`.
- Tiny (≤ 2 KB), deferred, CSP-compliant (external file, no `eval`).
- Not a security mechanism. Nothing sensitive is behind it.

## Acceptance criteria

- [ ] The greeting appears once per page load and doesn't spam.
- [ ] Unlocking works and persists for the session.
- [ ] Zero console errors.

## Verification (6 November 2026)

Left: a runtime check in the browser (agent).
