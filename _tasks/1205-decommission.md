---
id: "1205"
title: Decommission old site & folders
epic: Launch
status: todo
priority: p2
size: S
owner: sam
depends_on: ["1204"]
---

## Why

Remove the leftover surface and clutter once the new site has proven itself (30 days after cutover).

## Scope

- Delete the old Netlify site (after confirming nothing points to it).
- Archive locally (zip, kept outside the repo):
  - `SamMullinsFolio/` (Umbraco source)
  - `21-02-2026/` (an identical copy of the xStatic output)
  - `SamMullins2026/` (superseded Astro attempt)
- Keep the untouched media originals somewhere safe (they're the source for any future re-encode, see 401).
- Remove the stray root `package.json` / `node_modules` in the parent `sammullins.co.uk/` folder.
- Optionally delete `scripts/migrate/` from the repo (501).

## Acceptance criteria

- [ ] Old Netlify site deleted.
- [ ] The archive zip exists and has been verified to open.
- [ ] Parent folder contains only the new repo (plus the archive, if kept there).
