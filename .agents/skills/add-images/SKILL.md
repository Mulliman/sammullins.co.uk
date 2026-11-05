---
name: add-images
description: Convert new local images to AVIF masters (at most 2400px, quality 62, metadata stripped) in src/assets/media/<folder>/ using scripts/media/add.mjs, draft alt text for Sam's approval, and list the alt text in the PR body. Use when Sam gives image files to add to a page or article. Never merges.
---

# add-images

Adds images safely: converted, stripped of metadata, placed in a folder, and with alt text that Sam approves before merge. Sam always merges. Never merge, never enable auto-merge.

## Reference

- Image rules: `AGENTS.md` (alt text on every meaningful image, AVIF masters, no EXIF).
- Image and block fields: `_docs/content-model.md` and `../_shared/block-catalogue.md` (`image`, `gallery`, `hero`, `cards`).
- Converter: `scripts/media/add.mjs`. The legacy folder converter is `scripts/media/convert.mjs`; do not use it for new images.

## Preconditions

1. Working tree is clean, or the only changes are the content file the images belong to.
2. Sam has given local file paths and a destination folder name (`<folder>`: lowercase, digits, hyphens). If he has not given a folder, use the page slug and say so in the PR body.
3. Every file is a raster image (JPG, PNG, GIF, WebP, TIFF or AVIF). SVG is refused by the script. Add SVG by hand after review.
4. Sam has said where the images go: which page or article, and which block (`image`, `gallery`, `hero` image, `cards` item, or cover).

## Procedure

1. `git switch -c content/<slug>` (`<slug>` is the page or article slug). If Sam is only adding images to an existing branch, use that branch.
2. Convert:
   `node scripts/media/add.mjs <file...> --to <folder>`
   The script prints one JSON line per file with `file`, `asset`, `width` and `height`. If it reports `already exists`, do not overwrite unless Sam says so (`--force`).
3. Check each output: no EXIF or other metadata (`node -e` with sharp `metadata()` returning no `exif` key is acceptable), long edge at most 2400px, and a viewable result. Look at the image if you can.
4. **Draft alt text for each image.** Describe what is in it and why it is there, in one sentence, without "image of". Mark it `decorative: true` with `alt: ""` only if the image adds nothing to the meaning. Logo wall entries have no `alt` field; the client name is the alt text.
5. Insert the blocks or front matter (`cover`, `image`, `gallery` items, `cards` items). Paths are relative to the .md file. Example from `src/content/articles/`: `../../assets/media/<folder>/<name>.avif`.
6. Run `pnpm check && pnpm build && pnpm test`. Missing alt text fails the build, so the build is the check.
7. Commit the converted masters and the content change: `content: add images for <slug>`, with the trailer `Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>`.
8. `git push -u origin content/<slug>` and `gh pr create`. In the PR body, include a section **Alt text for approval** with one line per image: file name, asset path, and the drafted alt text (or `decorative`). Sam must approve or edit these before merge. End the body with `🤖 Generated with [Claude Code](https://claude.com/claude-code)`. Do not use `--auto`, do not merge.
9. Report the PR URL and stop.

## Outputs

- `src/assets/media/<folder>/<name>.avif` masters (AVIF, at most 2400px, no metadata).
- The content file change that places them.
- An open, unmerged PR with the alt text listed for Sam's approval.
