---
id: "1204"
title: Domain cutover & post-launch monitoring
epic: Launch
status: todo
priority: p0
size: S
owner: pair
depends_on: ["1203"]
---

## Why

Zero-downtime switch with instant rollback (decisions: *Launch & cutover*).

## Scope

1. Lower DNS TTLs a day ahead, if any custom records are involved. Netlify DNS handles its own records.
2. In Netlify: remove `www.sammullins.co.uk` and `sammullins.co.uk` from the **old** site, then add them to the **new** site and set `www` as primary (apex redirects to www, as today).
3. Wait for the certificate to provision; verify HTTPS and HSTS.
3a. **Trigger a fresh production deploy.** Until the build sees `URL=https://www.sammullins.co.uk`, every path sends `X-Robots-Tag: noindex, nofollow` (`integrations/noindex-until-live.mjs`, ticket 701). Confirm it has gone: `curl -sI https://www.sammullins.co.uk/ | grep -i x-robots-tag` prints nothing. **Rollback** needs the same: redeploy after moving the domains back, or the new site stays indexable on `*.netlify.app` (Netlify redirects it to the primary domain only while one is set).
4. Run 602 against **production**: all 50 URLs and 306 media paths.
5. Submit `sitemap-index.xml` in Search Console (704).
6. Watch GoatCounter 404s and the Search Console coverage report daily for a week, then weekly for 3 weeks. Add redirects for any real misses (via the `redirect` skill).

**Rollback:** move the domains back to the old site (a few minutes). Keep the old site for 30 days (1205).

## Acceptance criteria

- [ ] Production legacy test passes.
- [ ] Production sends no `X-Robots-Tag` header.
- [ ] No unexplained 404s after 2 weeks.
- [ ] Post-launch notes recorded in `_docs/launch.md`.
