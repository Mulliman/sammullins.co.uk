---
name: new-page
description: Compose a new content page for sammullins.co.uk from a brief, using only the existing block types, as src/content/pages/<path>.md, validate it and open a PR. Use when Sam asks for a new page, a landing page or a section page. Never merges and never writes .astro files.
---

# new-page

A page is a typed list of blocks in front matter, plus an optional Markdown body. You compose blocks; you never hand-write `.astro` files. Sam always merges. Never merge, never enable auto-merge.

## Reference

- Schema and every field: `_docs/content-model.md`.
- Block fields and examples, generated from the schema: `../_shared/block-catalogue.md`.
- Live examples: `src/content/style-guide/components.yaml`, shown on the unlisted `/style-guide/components/` page (do not link to it).
- Example structures for each page type: `/style-guide/page-structures/#<type>` (for example `#cv`, `#index`, `#album`, `#campaign`), with example files `src/content/pages/page-structure-example-*.md`.
- Voice: `_docs/voice.md` (if missing, say so in the PR body).

## Preconditions

1. Working tree is clean.
2. A brief exists: purpose, audience, the sections wanted, and the path. If the path or purpose is missing, stop and report what is missing.
3. Any URL the page will live at is free. A page at `src/content/pages/<path>.md` is served at `/<path>/`. If the path would replace an existing URL, stop: that is a `redirect` job.

## Procedure

1. **Map the brief to blocks.** Use only the 16 types in the catalogue. Typical shape: `hero` (plain or blurred), `intro`, then `prose`, `cards`, `image` or `gallery`, `callout`, `quote`, `timeline`, `nextPrev`. Do not invent block types or fields. If the brief needs something the catalogue cannot express, stop and report that as a proposed ticket.
2. **Path and slug.** Path under `src/content/pages/`. Use `home` only for the home page, which is already taken. Check the file does not exist.
3. **Branch.** `git switch -c content/<slug>`, where `<slug>` is the path with `/` replaced by `-`.
4. **Front matter.** Required: `title`, `description` (1 to 200 characters), `authorship`. Use `sam-ai` if you drafted the words, `sam` only if Sam supplied the words verbatim. Set `hidden: true` if Sam asks for an unlisted page, and `noindex: true` if it should not be indexed.
5. **Every image needs alt text** or `decorative: true`. Missing alt fails the build. Image paths are relative to the .md file, so a page at `src/content/pages/a/b.md` uses `../../../assets/media/<folder>/<name>.avif`. Use the `add-images` skill for new images.
6. **Links.** Internal links are site paths with trailing slashes. Check each target exists under `src/content/` (or is a static route such as `/archive/`).
7. **Gates.** `pnpm check && pnpm build && pnpm test`. Fix content until they pass.
8. **Commit** the page (and any media) with `content: add page <path>` and a `Co-Authored-By:` trailer naming the agent and model that did the work.
9. **Push and PR.** `git push -u origin content/<slug>`, then `gh pr create --title "content: add page <path>"`. The body lists the URL, the block list in order, authorship, gate results, and open questions, then the footer `🤖 Generated with [Claude Code](https://claude.com/claude-code)`. Do not use `--auto`, do not merge.
10. Report the PR URL and stop.

## Outputs

- `src/content/pages/<path>.md` (plus any media it references).
- Branch `content/<slug>` pushed, and an open, unmerged PR.
