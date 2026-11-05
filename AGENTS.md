# AGENTS.md

Instructions for AI coding agents (Claude Code, Hermes, Codex, Gemini CLI…) working in this repo. Humans: see [README.md](README.md).

## What this is

The source of [www.sammullins.co.uk](https://www.sammullins.co.uk/): a static Astro 7 site. Every page is a **typed list of blocks** in Markdown front matter, validated by Zod at build time. It's hosted on Netlify as plain files plus security headers.

## Golden rules

1. **Sam merges. Nothing is automatic.** Work on a branch, open a PR, and stop. Never merge, push to `main`, enable auto-merge or schedule publishing, unless Sam explicitly tells you to in the moment.
2. **Never break a URL.** URLs come from file paths. To rename or remove a page, add a redirect in `src/data/redirects.json` (use the `redirect` skill). `pnpm build` fails on broken or chained redirects.
3. **Content is not code.** Pages live in `src/content/**` as `.md` files. Don't hand-write `.astro` pages for content; compose blocks.
4. **Authorship is honest.** Every entry has `authorship: sam` (Sam wrote the words) or `sam-ai` (Sam + AI). If you drafted the words, it's `sam-ai`. Sam changes it if he rewrites.
5. **Accessibility and security are not optional.** Alt text on every meaningful image. No inline `style=""` attributes or inline scripts in components (strict CSP). No third-party scripts, fonts or embeds that load before user action.
6. **No new dependencies without a reason** stated in the PR. Direct deps are deliberately tiny (supply-chain hardening; see `pnpm-workspace.yaml`).

## Commands

| Command | What |
|---|---|
| `pnpm install --frozen-lockfile` | Install (new package versions must be ≥ 7 days old) |
| `pnpm dev` | Dev server on http://localhost:4321 |
| `pnpm build` | Static build to `dist/`: validates content, writes `_redirects` |
| `pnpm check` | Type and content check (`astro check`) |
| `pnpm test` | Unit tests, legacy URL test, hygiene checks |

## Repo map

```
src/content/      ← CONTENT. pages/, articles/, software/, albums/ (.md with YAML front matter)
src/content.config.ts ← The schema: every field and block type. Source of truth.
src/blocks/       ← One .astro component per block type
src/components/   ← Layout pieces (header, footer, colophon, agent view, renderer)
src/assets/media/ ← Image masters (AVIF, ≤ 2400px, no EXIF)
src/data/         ← site.yaml (nav, socials, footer) and redirects.json
integrations/     ← Build hooks (_redirects, legacy media copies)
scripts/          ← media conversion, migration (one-shot), checks
_tasks/           ← The rebuild as tickets. Read _tasks/README.md before picking work.
_docs/            ← Decisions (source of truth), audit, content model, voice guide
```

## Content model in one minute

```yaml
---
title: "Page title"
description: "One or two sentences, ≤ 200 chars (used for SEO and cards)"
date: 2027-01-15          # required for articles
authorship: sam-ai        # sam | sam-ai
kind: note                # articles only: article | note
archived: false           # true = dated; shows the archive banner, listed on /archive/
hidden: false             # true = never listed anywhere (still reachable by URL)
cover: { src: ../../assets/media/x/y.avif, alt: "Describe the image" }
blocks:
  - type: hero
    variant: plain        # blurred | image | plain
    heading: "Big thin heading"
  - type: body            # the Markdown below the front matter goes here
  - type: cards
    query: { from: articles, limit: 3 }
---
Markdown body (long-form text, code blocks get Prism highlighting).
```

Block types: `hero`, `intro`, `prose`, `body`, `callout`, `image`, `gallery`, `cards`, `listing`, `logoWall`, `quote`, `code`, `nextPrev`, `timeline`, `embed`, `split`. Full field reference with an example of each: [`_docs/content-model.md`](_docs/content-model.md). Live examples: `src/content/pages/blocks-demo/*.md`.

Where things go:
- An article lives at `src/content/articles/<slug>.md` and is served at `/articles/<slug>/`.
- A note is the same, with `kind: note`.
- A software page or docs lives at `src/content/software/<product>[/<doc>].md`. Docs set `series` and `order` to get prev/next automatically.
- Images: put masters in `src/assets/media/<folder>/` (use the `add-images` skill) and reference them **relative to the .md file**.

## Voice

See [`_docs/voice.md`](_docs/voice.md). Short version: first person, British English, plain and specific, practical over hype, a little dry humour; show what was actually built and what went wrong.

## Skills

Agent Skills (`SKILL.md` format) live in `.agents/skills/` (see `_docs/agent-tooling.md` for how each tool discovers them): `new-article`, `new-note`, `new-page`, `add-images`, `redirect`.

## Tickets

Work is tracked in `_tasks/` as Markdown tickets. Pick a `ready` ticket, branch as `NNN-short-slug`, meet every acceptance criterion, set `status: review` and open a PR. Don't silently widen scope; propose a new ticket instead. `_docs/decisions.md` beats a ticket if they disagree.
