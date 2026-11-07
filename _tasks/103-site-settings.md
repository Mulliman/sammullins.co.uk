---
id: "103"
title: Site settings: nav, socials, footer
epic: Content model
status: done
priority: p0
size: S
owner: agent
depends_on: ["101"]
---

## Why

Nav, footer and social links are content, editable by AI in one place (decisions: *Site structure*, *Social profiles*, *Contact*).

## Scope

- `src/content/settings/site.yaml` (singleton, schema-validated):
  - main nav: Articles, Software, CV (photography is **not** in the main nav)
  - footer cards
  - footer links: Archive, Photography
  - socials
- Socials: GitHub `Mulliman`, LinkedIn `sam-mullins-31471425` (confirm with Sam), X `_SamMullins_`, Bluesky (handle TBC from Sam). Each has a visible text label and `rel="me"`.
- **No email address anywhere.**

## Acceptance criteria

- [x] `grep -ri "gmail" src/ dist/` returns nothing (also enforced in CI, see 805).
- [x] All social links have `rel="me"` and an accessible name.

## Verification (6 November 2026)

The hygiene test fails on any gmail address; footer socials render `rel="me noopener"`, and each link is named by its label and handle.
