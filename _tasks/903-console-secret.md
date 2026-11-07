---
id: "903"
title: Console secret
epic: Delight
status: done
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

- [x] The greeting appears once per page load and doesn't spam.
- [x] Unlocking works and persists for the session.
- [x] Zero console errors.

## Verification (6 November 2026)

`tests/a11y/interactions.test.mjs`: one greeting per page load, no console errors, and `unlock('pelican')` turns terminal mode on and keeps it across pages for the session.
