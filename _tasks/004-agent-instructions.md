---
id: "004"
title: AGENTS.md and Agent Skills scaffold
epic: Foundation
status: done
priority: p0
size: M
owner: agent
depends_on: ["002"]
---

## Why

Use vendor-neutral agent standards wherever possible (decisions: *Agent standards*). The repo's agent harness is part of the showcase.

## Scope

- `AGENTS.md` (canonical): project purpose, commands, repo map, content model summary, block catalogue pointer, URL rules (trailing slash, never rename a slug without a redirect), image rules, `authorship` field, **merge rule (Sam merges; nothing automatic)**, ticket workflow (`_tasks/README.md`).
- `CLAUDE.md`: a one-line import of AGENTS.md (`@AGENTS.md`), nothing else.
- **Verify** where Agent Skills (`SKILL.md` format) should live so that Claude Code *and* other agents (Hermes, Codex, Gemini CLI) discover them. Pick one canonical folder. If a tool needs a second path, use a documented sync script rather than a duplicated copy. Record the finding in `_docs/agent-tooling.md`.
- Create an empty skills folder with a README describing the skill conventions (skills themselves are 1002/1003).
- The voice section is a placeholder filled by 1001.

## Acceptance criteria

- [x] AGENTS.md is under ~300 lines and links out for detail.
- [x] CLAUDE.md contains only the import.
- [x] `_docs/agent-tooling.md` records the skill-location decision with sources and the date checked.
- [x] A fresh Claude Code session in the repo picks up AGENTS.md rules (spot check: it knows the merge rule).

## Out of scope

Skill contents (1002, 1003). Voice guide (1001).

## Verification (6 November 2026)

AGENTS.md is 107 lines; CLAUDE.md is `@AGENTS.md`; `_docs/agent-tooling.md` is dated 2026-11-05 with sources; this Claude Code session loaded AGENTS.md and followed the merge rule.
