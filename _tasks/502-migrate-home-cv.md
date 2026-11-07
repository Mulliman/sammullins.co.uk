---
id: "502"
title: Migrate home & CV
epic: Migration
status: done
priority: p0
size: M
owner: agent
depends_on: ["501", "305", "306", "308"]
---

## Why

The home page keeps today's structure: signposting builds and the people worked with (decisions: *Site structure*).

## Scope

- Home: hero, intro, "Open source" cards, client logo wall, an optional small photography teaser, footer cards. Built from blocks only; no hand-coded page.
- CV: migrate the current content into `intro` + `timeline` + `prose`, with clearly marked placeholders where the 2027 copy will land (1201).
- Copy stays as it is for now. The new-direction copy belongs to the content series (1201).

## Acceptance criteria

- [x] `/` and `/cv/` render entirely from content files.
- [x] Visual comparison against the live site is approved by Sam.

## Verification (6 November 2026)

`/` and `/cv/` render from content files. Superseded: the visual match with the old site no longer matters now that the redesign (tickets 205 to 314) replaces it.
