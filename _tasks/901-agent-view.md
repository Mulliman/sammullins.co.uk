---
id: "901"
title: "Agent view: Markdown twins, llms.txt, toggle"
epic: Delight
status: done
priority: p0
size: M
owner: agent
depends_on: ["102"]
---

## Why

It's the most on-message delight for an AI-focused site: show what an agent sees (decisions: *Delight v1*).

## Scope

- Each page also emits `index.md` next to `index.html`: clean Markdown with front matter (title, description, url, updated, authorship) and blocks rendered to sensible Markdown (images become `![alt](url)`, cards become link lists, galleries become image lists).
- `<link rel="alternate" type="text/markdown" href="./index.md">` in the head.
- `/llms.txt` (spec-style): site summary plus key sections linking to the `.md` twins. Optional `/llms-full.txt`.
- On-page toggle "Agent view" (progressive enhancement):
  - swaps the main content for the rendered Markdown in a styled monospace view, with a copy button
  - without JS it's a plain link to `index.md`
  - remembers nothing, so every visit starts in human view
- Correct `Content-Type: text/markdown; charset=utf-8` header for `.md` files (702).

## Acceptance criteria

- [x] Every built HTML page has a matching `.md` twin (CI check).
- [x] The toggle is keyboard-accessible and announced.
- [x] `llms.txt` validates against the spec's structure.

## Verification (6 November 2026)

The hygiene test checks every page has a Markdown twin; the toggle is a `<button>`; `llms.txt` follows the spec layout (H1, blockquote, H2 link lists).
