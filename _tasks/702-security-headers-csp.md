---
id: "702"
title: Security headers & strict CSP
epic: Hosting & security
status: review
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

- [ ] securityheaders.com grade A+ on the preview.
- [ ] Mozilla HTTP Observatory ≥ A+.
- [ ] No CSP violations in the console across the kitchen-sink page and all page types (Playwright check).
- [ ] Hotlinked `/media/*` images still load from github.com.
