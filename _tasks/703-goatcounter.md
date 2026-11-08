---
id: "703"
title: GoatCounter analytics (self-hosted script)
epic: Hosting & security
status: todo
priority: p1
size: S
owner: pair
depends_on: ["702"]
---

## Why

Free, cookieless analytics with no banner (decisions: *Analytics*). The old UA tag is removed.

## Scope

- **Sam:** create a GoatCounter account and site code. It's free and needs no card.
- Vendor `count.js` into `public/` at a pinned version, recording the version and SHA-256 in `_docs/analytics.md`, with a script to update it.
- Load it with `data-goatcounter="https://<code>.goatcounter.com/count"`.
- Respect Do Not Track / Global Privacy Control (skip counting when set).
- Count the 404 path (603). Count outbound clicks to GitHub and socials as events (optional).
- Don't count deploy previews or localhost.

## Acceptance criteria

- [ ] Page views appear in the dashboard from production only.
- [ ] Zero cookies set.
- [ ] CSP needs only the `connect-src` entry.
