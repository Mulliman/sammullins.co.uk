---
id: "316"
title: "Software: a beta status with a visible badge"
epic: Content model
status: todo
priority: p0
size: S
owner: agent
depends_on: []
---

## Why

Sam wants every project on the Software page at launch, with unfinished ones marked as beta (grilling, 8 November 2026; ticket 1201). The software `status` field only allows `active` or `legacy` (`src/content.config.ts`), so a beta project can't say so, and the drafts in 508 fall back to "(beta)" in the card title.

## Scope

- Add `beta` to the software `status` enum, and to the `status` filter in the card and listing query.
- Show a "Beta" badge on a beta software page's header and on its cards, using the existing badge (ticket 1005), not new CSS.
- Add an example to the style guide components page.
- Once it's in, give each unfinished project a software page with `status: beta`, and drop "(beta)" from the card titles on the Software page.

## Acceptance criteria

- [ ] A software page with `status: beta` builds and shows a Beta badge in its header and on any card that lists it.
- [ ] `status: active` and `legacy` pages look exactly as before.
- [ ] The style guide shows the beta badge.

## Out of scope

- Writing the pages for the beta projects (Ends In Tiers, Blowhard, ForeSins, the mini apps). That's launch content (1201).
