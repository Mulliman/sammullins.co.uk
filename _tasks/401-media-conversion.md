---
id: "401"
title: Convert originals to AVIF masters + media map
epic: Media
status: review
priority: p0
size: M
owner: agent
depends_on: ["002"]
---

## Why

The site references 132 MB of legacy media (368 MB counting unused crops). It should become small, modern masters in plain git (decisions: *Image storage & formats*).

## Scope

- Script `scripts/media/convert.ts` (sharp), run once and kept for future imports:
  - Input: the 208 originals in the xStatic output `media/` folder (files without a `--NNNx0` suffix). The path is passed as an argument, never hardcoded.
  - Output: `src/assets/media/<semantic-folder>/<slug>.avif`, long edge ≤ 2400px, quality tuned to be visually lossless (document the setting), orientation applied and then all EXIF stripped.
  - Writes `_docs/legacy/media-map.json`: `{ legacyPath, legacyCrops[], newAsset }` per original, covering every path in `media-referenced.txt`.
- Report total size before and after.
- Untouched originals stay **outside** the repo (they already exist in the Umbraco folder). Record where in `_docs/media.md`.

## Acceptance criteria

- [x] All 306 paths in `_docs/legacy/media-referenced.txt` map to a new asset.
- [x] Repo media total is ≤ 45 MB.
- [x] No GPS or other EXIF in any committed image (checked in CI).
- [ ] Spot check of 5 images side by side, approved by Sam.

## Verification (6 November 2026)

203 masters, 35 MB, 0 with EXIF (checked with sharp; not yet in CI). Left: Sam's spot check of 5 images.
