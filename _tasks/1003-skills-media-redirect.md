---
id: "1003"
title: "Skills: add-images, redirect"
epic: AI authoring
status: in-progress
priority: p0
size: S
owner: agent
depends_on: ["004", "401", "601"]
---

## Why

Images and URL changes are where AI edits most often go wrong.

## Scope

- `add-images`:
  - takes local file paths, runs the 401 conversion (AVIF master, ≤ 2400px, EXIF stripped) and places files in the right folder
  - drafts alt text **for Sam's approval**: alt text is listed in the PR description for review
  - inserts `image` or `gallery` blocks
- `redirect`:
  - renames or retires a URL by moving the content file and adding a `redirects.yaml` entry
  - runs the 601 validation and the 602 legacy test
  - refuses to rename without a redirect

## Acceptance criteria

- [ ] Renaming a page via the skill keeps the old URL working (602 passes).
- [ ] An added image has no EXIF, and its alt text appears in the PR body.

## Verification (6 November 2026)

Left: a dry run of each skill (agent).

## PM note (12 November 2026)

The skills are on `main` and no PR is open, so `review` read as drift. Status moves to `in-progress`. Left: a dry run of `redirect` (602 still passes) and of `add-images` (no EXIF, alt text in the PR body).
