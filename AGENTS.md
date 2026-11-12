# AGENTS.md

Instructions for AI coding agents (Claude Code, Hermes, Codex, Gemini CLI…) working in this repo. Humans: see [README.md](README.md).

## What this is

The source of [www.sammullins.co.uk](https://www.sammullins.co.uk/): a static Astro 7 site. Every page is a **typed list of blocks** in Markdown front matter, validated by Zod at build time. It's hosted on Netlify as plain files plus security headers.

## Golden rules

1. **Sam merges. Nothing is automatic.** Work on a branch, open a PR, and stop. Never merge, push to `main`, enable auto-merge or schedule publishing, unless Sam explicitly tells you to in the moment. In Claude Code, `.claude/settings.json` backs this up: `gh pr merge` is on the `ask` list, so every merge needs Sam's approval when it runs, and pushing to `main` is denied.
2. **Never break a URL.** URLs come from file paths. To rename or remove a page, add a redirect in `src/data/redirects.json` (use the `redirect` skill). `pnpm build` fails on broken or chained redirects.
3. **Content is not code.** Pages live in `src/content/**` as `.md` files. Don't hand-write `.astro` pages for content; compose blocks.
4. **Authorship is honest.** Every entry has `authorship: sam` (Sam wrote the words) or `sam-ai` (Sam + AI). If you drafted the words, it's `sam-ai`. Sam changes it if he rewrites.
5. **Accessibility and security are not optional.** Alt text on every meaningful image. No inline `style=""` attributes or inline scripts in components (strict CSP). No third-party scripts, fonts or embeds that load before user action.
6. **No new dependencies without a reason** stated in the PR. Direct deps are deliberately tiny (supply-chain hardening; see `pnpm-workspace.yaml`).
7. **No hard-coded colours.** Every colour value lives in `src/styles/themes/`; everything else uses tokens (`var(--color-…)`). A test fails the build on a colour literal anywhere else. For a campaign or season, add a page theme there and set `theme:` in the page's front matter (see `src/styles/themes/README.md`).

## Commands

| Command                                 | What                                                                                                           |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `pnpm install --frozen-lockfile`        | Install (new package versions must be ≥ 7 days old)                                                            |
| `pnpm dev`                              | Dev server on http://localhost:4321                                                                            |
| `pnpm build`                            | Static build to `dist/`: validates content, writes `_redirects`                                                |
| `pnpm check`                            | Type and content check (`astro check`)                                                                         |
| `pnpm test`                             | Unit tests, legacy URL test, hygiene checks                                                                    |
| `pnpm lint`                             | ESLint (Astro, jsx-a11y, TypeScript) and Prettier; `pnpm lint:fix` fixes what it can                           |
| `pnpm verify` (or `--quick`)            | Every local CI gate in CI's order, stopping at the first failure. Run it before every push                     |
| `pnpm tasks:status`                     | Tickets checked against git and open PRs; lists drift (e.g. "in review" but already merged)                    |
| `pnpm compare:base` then `pnpm compare` | Before/after screenshots of the style guide and key pages; reports what changed (on demand, nothing committed) |

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
title: 'Page title'
description: 'One or two sentences, ≤ 200 chars (used for SEO and cards)'
date: 2027-01-15 # required for articles
authorship: sam-ai # sam | sam-ai
kind: note # articles only: article | note
archived: false # true = dated; shows the archive banner, listed on /archive/
hidden: false # true = never listed anywhere (still reachable by URL)
theme: default # page theme from src/styles/themes/ (default | christmas)
cover: { src: ../../assets/media/x/y.avif, alt: 'Describe the image' }
blocks:
  - type: hero
    variant: plain # blurred | image | plain | about (home: statement, buttons and clickable facets)
    heading: 'Big thin heading'
  - type: body # the Markdown below the front matter goes here
  - type: cards
    query: { from: articles, limit: 3 }
---
Markdown body (long-form text, code blocks get Prism highlighting).
```

Block types: `hero`, `intro`, `prose`, `body`, `callout`, `image`, `gallery`, `cards`, `listing`, `logoWall`, `quote`, `code`, `nextPrev`, `timeline`, `embed`, `steps`, `split`, `disclosure`, `section`. Use `steps` for numbered instructions with commands (each gets a Copy button) and `disclosure` for rows that open on click. Use a `section` to put a heading and its content in one band (background and spacing), as the original site did. Full field reference with an example of each: [`_docs/content-model.md`](_docs/content-model.md). Live examples: the unlisted [components page](/style-guide/components/), with examples in `src/content/style-guide/components.yaml`.

Where things go:

- An article lives at `src/content/articles/<slug>.md` and is served at `/articles/<slug>/`.
- A note is the same, with `kind: note`.
- A software page or docs lives at `src/content/software/<product>[/<doc>].md`. Docs set `series` and `order` to get prev/next automatically.
- Images: put masters in `src/assets/media/<folder>/` (use the `add-images` skill) and reference them **relative to the .md file**.

## Voice

- Write as Sam, in the first person ("I"). Use "we" only when a team is actually meant.
- British English: favourite, honour, customisation, licence (noun). Prefer -ise spellings. Keep "program" for software, as Sam does.
- Plain and specific. Name the tool, library, version or platform, and say what it was used for.
- Say what broke or was harder than expected. Be honest about limits.
- Light, dry humour: at most one wry aside per piece. No jokes in code, steps or warnings.
- No hype. Never use "revolutionary", "game-changing", "seamless", "delve", "leverage", "unlock", "supercharge", "cutting-edge", "robust" or "empower".
- No em dashes (—) or en dashes as punctuation. Use full stops, commas, semicolons or brackets.
- Mix sentence lengths: mostly medium, comma-led sentences, with the odd short closer.
- Hedge once where unsure: "as far as I know", "I think", "seems to be".
- Explain tech in one clause ("X is a Y that does Z"), then say why it was chosen.
- Credit other people's tools and writing by name with a link, and say what each one saved.
- Open with what the thing is or the problem that started it. No throat-clearing.
- Close with one practical next step: a link, a command or "Give it a go!". Once per piece.
- Use the house structures: numbered series ("5 cool things I used to build..."), "What's New in...", "Other articles in the series", "Give it a go!" cards, "Week N:" albums.
- Exclamation marks: fine in titles and CTAs, at most one in running body text.
- No emojis. No bullet lists of hyped benefits.
- Never invent numbers, versions, dates, benchmarks or links. Put a placeholder in square brackets and ask Sam.
- No job-seeking language: no "open to opportunities", "hire me", "passionate about", "excited to".
- AI tooling pieces: practical and honest. Give the setup (model, hardware, versions), what worked, what failed, and where it should not be trusted.
- If an AI drafted the words, set `authorship: sam-ai`. Sam decides whether it is `sam`.
- Sam always merges. Never publish or merge on his behalf.
- Full guide and examples: `_docs/voice.md`.

## Skills

Agent Skills (`SKILL.md` format) live in `.agents/skills/` (see `_docs/agent-tooling.md` for how each tool discovers them): `new-article`, `new-note`, `new-page`, `add-images`, `redirect`, and `pm-pass` (what needs Sam, as a desk page; backed by `pnpm tasks:status`).

## Tickets

Work is tracked in `_tasks/` as Markdown tickets. Pick a `ready` ticket, branch as `NNN-short-slug`, meet every acceptance criterion, set `status: review` and open a PR. Don't silently widen scope; propose a new ticket instead. `_docs/decisions.md` beats a ticket if they disagree.

## Branches and PRs

Small PRs that Sam can review in one sitting merge fastest. A 33-commit stack does not.

- **One ticket, one branch, one PR, cut from `origin/main`.** Don't build on another unmerged branch. If you truly must, open the lower PR first and say so at the top of the upper one.
- **Open the PR as a draft as soon as the branch has a first commit**, then mark it ready. Don't keep finished work on a local branch overnight; push it as you go.
- **Keep a stacked branch current by rebasing** onto `origin/main` (`git rebase origin/main`, then `git push --force-with-lease` to your own branch only). Don't merge one feature branch into another.
- **Work in a git worktree**, not in the main checkout, when another agent might be running. Remove the worktree once its PR merges.
- **PR titles follow Conventional Commits**: `type(scope): summary`, where type is one of `feat fix docs style refactor perf test build ci chore content revert`. CI fails anything else. Examples: `feat(blocks): add hero`, `content: new note on local models`, `ci: cache Playwright browsers`.
- **Run `pnpm verify` before every push.** CI is the confirmation, not the place to find out.
- **Lighthouse budgets are a required check.** If one fails, read the report artifact and fix the page. Don't loosen a budget or drop a page without Sam saying so.
- **When a PR merges, its ticket goes to `done`** in the next PR or PM pass, once every acceptance criterion is ticked. `pnpm tasks:status` lists the ones that drifted.
- **Add a line to `CHANGELOG.md`** under _Unreleased_ for anything a visitor or contributor would notice.
