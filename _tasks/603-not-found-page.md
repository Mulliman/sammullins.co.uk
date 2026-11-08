---
id: "603"
title: Helpful 404 page
epic: URLs & redirects
status: done
priority: p1
size: S
owner: agent
depends_on: ["203"]
---

## Why

Any URL we missed should still land gracefully, and the miss should be visible in analytics.

## Scope

- `src/pages/404.astro` in the site style: a friendly message, links to Home, Articles, Software and Archive.
- An optional "did you mean" with no JS required: at build time, embed a small list of URLs and suggest the closest match to the requested path using a tiny inline script. It must be CSP-hashed and must degrade gracefully.
- GoatCounter counts 404s with the requested path (703), so misses can be found.

## Acceptance criteria

- [x] Netlify serves it with status 404.
- [x] Passes axe.

## Verification (6 November 2026)

Left: confirm Netlify serves it with status 404 on a deploy preview (needs 701).

## Verification (7 November 2026, PM pass)

`curl -s -o /dev/null -w "%{http_code}" https://sammullinscouk.netlify.app/no-such-page-xyz/` returns 404 and serves the site's 404 page. axe was already passing. Every criterion is met.
