---
id: "601"
title: Redirect map to Netlify _redirects
epic: URLs & redirects
status: done
priority: p0
size: S
owner: agent
depends_on: ["003"]
---

## Why

Retired or renamed URLs must 301 gracefully and never 404 (decisions: *Legacy content*; audit §4).

## Scope

- `src/data/redirects.json` (schema-validated): `{ from, to, status: 301|302, reason }`. It's the single source of truth that the `redirect` skill (1003) edits.
- A build step generates `dist/_redirects` from:
  - `redirects.json`
  - legacy media (403)
  - the existing behaviour: Netlify already does apex → `www` and adds the trailing slash. Confirm both are preserved in the new site's domain settings.
- Validation:
  - no chains (A→B→C gets collapsed)
  - no loops
  - every `to` exists in `dist/` or is an external URL

## Acceptance criteria

- [x] The build fails on a redirect loop, a chain, or a `to` that doesn't exist.
- [x] The merged duplicate article (503) redirects correctly.

## Verification (6 November 2026)

`integrations/site-files.mjs` throws on chains, loops and missing targets; the duplicate git/ftp article redirects to `xstatic-adds-git-and-ftp-support`.
