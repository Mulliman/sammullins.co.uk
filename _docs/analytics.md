# Analytics

GoatCounter, cookieless, with no consent banner (decisions: _Analytics_; ticket 703). The dashboard is at https://sammullins.goatcounter.com and is private to Sam.

## How it loads

- `src/data/site.yaml` sets `analytics.goatcounter: sammullins`. Empty means no analytics at all. The build fails if the code is set and `public/js/count.js` is missing.
- `src/layouts/BaseLayout.astro` adds two deferred, same-origin scripts to every page, in production builds only:
  1. `public/js/count.js`, GoatCounter's own script, vendored unchanged. It's loaded with `no_onload`, so it never counts by itself.
  2. `public/js/analytics.js`, ours. It counts only when the host is `www.sammullins.co.uk`, so deploy previews and `*.netlify.app` are never counted (count.js already skips localhost). It skips visitors who send Do Not Track or Global Privacy Control.
- On the 404 page the path is recorded as `404: /the/missed/path/`, because the page's canonical URL is `/404/`. Filter the dashboard on `404:` to find the misses (cutover, ticket 1204).
- CSP: scripts are same-origin (`script-src 'self'`), and the only addition is `connect-src https://sammullins.goatcounter.com` in `astro.config.mjs`, where the hits go.
- To stop counting your own visits, open `https://www.sammullins.co.uk/#toggle-goatcounter` once in each browser. count.js stores a flag in `localStorage` (not a cookie).

## The vendored file

| File                 | Source                          | Version | SHA-256                                                            |
| -------------------- | ------------------------------- | ------- | ------------------------------------------------------------------ |
| `public/js/count.js` | https://gc.zgo.at/count.v5.js   | v5      | `9e4391f5c18cb24de433b6ef31d8b1f1c85ee41c6f0ad274b28664168063725a` |

GoatCounter's numbered files (`count.v5.js`) are fixed versions; the unnumbered `count.js` changes without notice, so it is never used. `tests/analytics.test.mjs` fails if the file in `public/js/` doesn't match the checksum above.

## Updating it

```bash
node scripts/analytics/vendor-goatcounter.mjs 6
```

The script downloads `count.v<N>.js`, writes `public/js/count.js` and updates the version and checksum in this file. Read the diff before committing: the file runs on every page. Check that the settings `analytics.js` relies on (`no_onload`, `goatcounter.count`) still exist.
