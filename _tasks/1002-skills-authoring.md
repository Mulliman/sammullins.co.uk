---
id: "1002"
title: "Skills: new-article, new-note, new-page"
epic: AI authoring
status: in-progress
priority: p0
size: M
owner: agent
depends_on: ["004", "1001", "102"]
---

## Why

The point of the rebuild: quickly create pages with AI, safely (decisions: *AI authoring workflow*).

## Scope

Agent Skills (`SKILL.md`), in the folder chosen in 004:

- `new-article`: from bullet points, a transcript or a chat-history excerpt, drafts an article in the voice. It picks blocks from the catalogue, sets `authorship: sam-ai` (or `sam` if Sam wrote it), creates a branch, runs `pnpm check && pnpm build`, and opens a PR. It **never merges**.
- `new-note`: the same for `kind: note` (300–800 words, no hero required).
- `new-page`: assembles a page from a brief using blocks only, validates it, and opens a PR.
- Each skill:
  - includes a block-catalogue reference generated from the schema, so it never drifts
  - lists its preconditions and its outputs
  - states the merge rule
- A `scripts/skills/sync` step regenerates the catalogue reference from `content.config.ts`. CI fails if it's stale.

## Acceptance criteria

- [ ] A dry run of each skill in Claude Code produces a valid PR that passes all CI gates.
- [ ] The same skills work from at least one non-Claude agent (e.g. Hermes or Codex), with the result noted in `_docs/agent-tooling.md`.

## Verification (6 November 2026)

Left: a dry run of each skill, and one non-Claude agent (agent, then Sam).

## PM note (12 November 2026)

The skills are on `main` and no PR is open, so `review` read as drift. Status moves to `in-progress`. Left: a dry run of each skill in Claude Code, and one from a non-Claude agent with the result noted in `_docs/agent-tooling.md`.
