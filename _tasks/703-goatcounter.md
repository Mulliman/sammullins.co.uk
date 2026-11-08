---
id: "703"
title: GoatCounter analytics (self-hosted script)
epic: Hosting & security
status: review
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
- [x] Zero cookies set.
- [x] CSP needs only the `connect-src` entry.

## Progress (8 November 2026)

- Sam created the GoatCounter site `sammullins`.
- `public/js/count.js` is GoatCounter's `count.v5.js`, unchanged, with its version and SHA-256 in `_docs/analytics.md`. `tests/analytics.test.mjs` fails if the file doesn't match. `node scripts/analytics/vendor-goatcounter.mjs <version>` updates both.
- count.js loads with `no_onload`. `public/js/analytics.js` starts the count only on `www.sammullins.co.uk` (so not on deploy previews, branch deploys or `*.netlify.app`; count.js already skips localhost) and skips Do Not Track and Global Privacy Control.
- 404s are counted as `404: /missed/path/`, because the 404 page's canonical URL is `/404/`.
- `site.yaml` sets `analytics.goatcounter: sammullins`.
- Checked in a browser against the built site (`pnpm preview`): both scripts load same-origin with no CSP errors and nothing counts on load. With the host check pointed at localhost, one hit goes to `sammullins.goatcounter.com/count` (`404: /` with the 404 flag), none with Global Privacy Control on, and none for any other host.
- Zero cookies: neither script reads or writes `document.cookie`. count.js keeps one opt-out flag in `localStorage` (`#toggle-goatcounter`).
- CSP: no change. `script-src` already allows `'self'`, and `connect-src https://sammullins.goatcounter.com` was already there.
- Not done (optional in the scope): outbound click events. count.js is loaded with `no_events`; turning them on means `data-goatcounter-click` attributes on the links.
- Left: page views in the dashboard from production. That needs the live domain (cutover, 1204), so it's checked then.
