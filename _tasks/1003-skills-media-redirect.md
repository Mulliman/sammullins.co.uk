---
id: "1003"
title: "Skills: add-images, redirect"
epic: AI authoring
status: review
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
