---
id: "702"
title: Security headers & strict CSP
epic: Hosting & security
status: done
priority: p0
size: M
owner: agent
depends_on: ["701"]
---

## Why

The live site sends only HSTS today (audit §1). Target: A+ on securityheaders.com and nothing third party.

## Scope

- Headers in `netlify.toml` or a generated `_headers`:
  - `Content-Security-Policy`:
    - `default-src 'self'`; `script-src 'self'` plus build-time hashes (use Astro's CSP support if available, otherwise generate hashes in a post-build step)
    - `style-src 'self'` (plus hashes if needed)
    - `img-src 'self' data:`; `font-src 'self'`
    - `connect-src 'self' https://<code>.goatcounter.com`
    - `frame-src https://www.youtube-nocookie.com` (only if 309 ships)
    - `frame-ancestors 'none'`; `base-uri 'none'`; `form-action 'none'`; `object-src 'none'`
    - `upgrade-insecure-requests`
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (consider preload submission afterwards)
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy`: deny camera, microphone, geolocation, interest-cohort/browsing-topics and payment
  - `Cross-Origin-Opener-Policy: same-origin`; `Cross-Origin-Resource-Policy: same-site`. Check that CORP doesn't break third-party image hotlinks (403); use a per-path override for `/media/*` if needed.
- Long-cache immutable headers for `/_astro/*`; short cache for HTML.
- Report-only first on the deploy preview, then enforce.

## Acceptance criteria

- [x] securityheaders.com grade A+ on the preview.
- [x] Mozilla HTTP Observatory ≥ A+.
- [x] No CSP violations in the console across the kitchen-sink page and all page types (Playwright check).
- [x] Hotlinked `/media/*` images still load from github.com.

## Verification (6 November 2026)

CSP: the axe test fails on any CSP console message on every page in both themes. Left: the header grades and hotlinked media need a Netlify deploy preview (701).

## Verification (7 November 2026, PM pass)

Checked against `https://sammullinscouk.netlify.app` (production build of `main`, 6bd5e8c):

- securityheaders.com: **A+**.
- Mozilla HTTP Observatory API: **A+**, score 145, 12 of 12 tests passed.
- Hotlinks: `/media/03taqad3/xstatic-packages--1200x0.png` (from `_docs/legacy/media-referenced.txt`) returns 301 to `/media/03taqad3/xstatic-packages.avif`, which returns 200 `image/avif`, both with `Cross-Origin-Resource-Policy: cross-origin`. GitHub serves README images through its camo proxy, so CORP is the only header that could block them, and it doesn't. This was checked from the headers, not by viewing a GitHub README.
- `/_astro/*` sends `public,max-age=31536000,immutable`; HTML sends `max-age=0,must-revalidate`.
- The CSP's `default-src` and `script-src` hashes are in a `<meta>` tag (Astro's CSP support). The header carries only the directives a meta tag can't (`frame-ancestors` and so on).
- One difference from the scope: HSTS is `max-age=31536000` (1 year), not the 2 years the scope asks for. One year is enough for preload, so it was left alone. Raise it in `netlify.toml` if Sam wants the scope exactly.
