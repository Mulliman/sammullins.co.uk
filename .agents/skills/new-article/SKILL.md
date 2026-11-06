---
name: new-article
description: Draft a new article for sammullins.co.uk from bullet points, a transcript or chat-history excerpts, in Sam's voice, as src/content/articles/<slug>.md, then open a PR. Use when Sam asks for a new article or blog post. Never merges.
---

# new-article

Turns source material into one article file, on its own branch, with a PR for Sam to review and merge. Sam always merges. Never merge, never enable auto-merge.

## Reference

- Schema and every field: `_docs/content-model.md` (source of truth: `src/content.config.ts`).
- Block fields and examples, generated from the schema: `../_shared/block-catalogue.md`.
- Voice: `_docs/voice.md`. If the file is missing, say so in the PR body and draft from the Voice section of `AGENTS.md`.
- Repo rules: `AGENTS.md`.

## Preconditions

1. Working tree is clean (`git status --porcelain` is empty). If not, stop and report.
2. The input is one of: bullet points, a transcript, or chat-history excerpts. Note which one in the PR body.
3. Sam has said what the article is about, or the input makes it clear. If the input has no clear subject, stop and report instead of guessing.
4. `gh auth status` succeeds, so `gh pr create` will work.

## Procedure

1. **Decide the slug.** Lowercase, hyphenated, from the title. It becomes the URL: `/articles/<slug>/`. Check that `src/content/articles/<slug>.md` does not already exist. If it does, stop.
2. **Create the branch.** `git switch -c content/<slug>`.
3. **Read the sources.** Read the voice guide and two or three existing articles in `src/content/articles/` for tone and structure.
4. **Write the front matter.** Required: `title`, `description` (1 to 200 characters), `date` (quoted, `"YYYY-MM-DD"`, today unless Sam gives one), `authorship`. Optional: `tags`, `cover`, `kind` (leave as `article`).
   - `authorship: sam-ai` if you drafted the words. `authorship: sam` only if Sam wrote the words verbatim, which is rare for this skill. When unsure, use `sam-ai`.
   - Set `archived: false` for new work.
5. **Blocks.** Use exactly this shape unless Sam asks otherwise:
   - `hero` with `variant: plain`, `heading` (the title) and `subheading` (the description).
   - `body`, which places the Markdown below the front matter.
   - Optional `cards` block with `items` linking related pages (`href` values are site paths with trailing slashes, for example `/software/the-imposter/`). Only link pages that exist: check the path under `src/content/`.
   - Pick any other block from the catalogue only if the article needs it. Do not invent block types or fields.
6. **Write the Markdown body.** Plain, specific, first person, British English. Show what was built and what went wrong. Use `##` headings. No raw HTML (it is escaped). No inline `style`. Link external sites with full URLs.
7. **Images.** If the article needs images, use the `add-images` skill first, then reference them relative to the .md file (`../../assets/media/<folder>/<name>.avif` from `src/content/articles/`).
8. **Validate locally.** `pnpm check`. Fix any schema error by changing the file, not the schema.
9. **Run the gates.** `pnpm check && pnpm build && pnpm test`. The build takes several minutes. If a gate fails, fix the content and rerun. Do not disable a check.
10. **Commit.** Stage only the files you changed (`git add src/content/articles/<slug>.md` and any new media). Message: `content: add article <slug>`. End the body with a `Co-Authored-By:` trailer naming the agent and model that did the work.
11. **Push and open the PR.** `git push -u origin content/<slug>`, then `gh pr create --title "content: add article <slug>"` with a body containing:
    - the URL the article will have,
    - `authorship` and why,
    - the input type (bullets, transcript, chat),
    - a checklist of the gates you ran and their result,
    - any open questions for Sam,
    - the footer line `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.
      Do not pass `--auto`, do not run `gh pr merge`.
12. **Stop.** Report the PR URL. Sam reviews and merges.

## Outputs

- `src/content/articles/<slug>.md` (new file, plus any media files it references).
- Branch `content/<slug>` pushed to origin.
- An open PR against `main`, not merged.
