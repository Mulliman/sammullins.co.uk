---
id: "1001"
title: Voice guide from articles + YouTube
epic: AI authoring
status: in-progress
priority: p0
size: M
owner: agent
depends_on: ["503"]
---

## Why

AI-drafted content should still sound like Sam (decisions: *Voice*).

## Scope

- Analyse the 9 legacy articles (post-migration Markdown) and transcripts from the **@sam_mullins** YouTube channel. Use auto-captions and fetch only public videos. Store transcripts outside the repo or in a git-ignored folder; quote sparingly.
- Produce `_docs/voice.md`:
  - tone, sentence length, humour, British spelling, recurring structures (e.g. "5 cool things…")
  - words and phrases Sam uses and avoids
  - 3 short before/after examples
- Adapt it for the 2027 AI focus without losing recognisability.
- Summarise the essentials (≤ 40 lines) into the AGENTS.md voice section and link to the full guide.

## Acceptance criteria

- [ ] Sam reads it and confirms it sounds like him.
- [ ] A blind test: an AI-drafted paragraph using the guide, which Sam judges "close enough to edit, not rewrite".

## Blind test (8 November 2026)

The blind test paragraph is the second paragraph of the home intro on branch `content/launch-copy` (it starts "This year my team went from using GitHub Copilot..."). An agent drafted it from this guide and the grilling answers, with no edits from Sam. Sam judges it on the PR: close enough to edit, or a rewrite.
