# Media (tickets 401–403)

## Masters

- **Where:** `src/assets/media/<legacyId>/<name>.avif` (plus a few `.svg` copied unchanged). Folder names keep the old Umbraco media ids, so legacy paths map mechanically.
- **Encoding:** AVIF, quality 62, effort 6, long edge ≤ 2400px, EXIF orientation applied then **all metadata stripped** (sharp default). PNG alpha kept.
- **Result:** 204 masters, about 35 MB (from 208 originals, ~142 MB; the legacy folder was 368 MB with crops).
- **Untouched originals** are **not** in the repo. They live in the old Umbraco project: `SamMullinsFolio/Src/SamMullins/SamMullins.Web/App_Data/xStatic/output/1/media/`. Keep a copy before deleting that folder (ticket 1205): it's the source for any future re-encode, since re-encoding AVIF masters loses quality.

## Scripts

```bash
node scripts/media/convert.mjs "<legacy>/media" [--force] [--quality=62]   # re-run conversion
node scripts/media/check-map.mjs                                            # every referenced legacy path is mapped
```

`_docs/legacy/media-map.json` maps every original and its crops to the new master.

## Serving

- Pages use `<Pic>`, which generates responsive AVIF + WebP (no JPEG) at build time.
- Legacy URLs: at build, `integrations/site-files.mjs` copies each master to a **stable** path `/media/<id>/<name>.avif` and adds a 301 from the old original and every crop URL (`--300x0` etc.) to it. External hotlinks (GitHub READMEs, our.umbraco.com, NuGet) keep working. `/media/*` sends `Cross-Origin-Resource-Policy: cross-origin`.
- **Exception:** `/media/nabbcnxd/umbracofolio_0-1-0.zip` (16 MB, the UmbracoFolio package download) is kept byte-for-byte in `public/media/`. *Decision for Sam: keep it, or point the UmbracoFolio page at a GitHub release / our.umbraco.com and redirect.*
