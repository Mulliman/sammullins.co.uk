---
id: "1005"
title: "Blocks the PM desk page needed and the site lacks"
epic: Blocks
status: done
priority: p2
size: M
owner: agent
depends_on: ["1004"]
---

## Why

The PM desk page (ticket 1004) is built only from the site's own blocks, so that anything it can't express shows where the component set is thin. The first build on 6 November found six gaps. Each is a general need (long how-to articles and software docs use them too), not a desk-page special.

## Scope

Sam asked for all six (6 November).

1. **Disclosure block.** `disclosure`: a native `<details>`, closed by default, keyboard-accessible, no JS. Holds the same blocks a section does, and can sit inside a section.
2. **Badge.** A shared `badge` (`label`, `tone`: neutral, note, tip, warning), shown on a disclosure's summary. The tone colours the edge; the label carries the meaning.
3. **Done state.** `disclosure.status: done` strikes the summary and adds a "Done" badge, so the state is in words too.
4. **Copy button on code.** The `code` block already had one. Its markup is now one shared figure (`codeFigure` in `src/lib/markdown.ts`), its styles are in `global.css` and its script is `CopyCode.astro` on every page, so fenced code in block Markdown and in `steps` gets the same figure and Copy button.
5. **Steps with commands.** `steps`: a numbered list whose steps are Markdown with an optional `code` (lang, code, filename).
6. **Tables on phones.** Tables in block Markdown carry each cell's column name (`data-label`); below 40rem each row becomes a card, values under their labels.

## Acceptance criteria

- [x] Sam picks which of the six to build: all six.
- [x] Each is in `src/content.config.ts`, rendered by `Blocks.astro` (or the shared Markdown renderer), shown with its YAML on the style guide's components page, and passes axe (`tests/a11y`, 12 of 12).
- [x] `tests/blocks-1005.test.mjs` checks the rendered behaviour: closed and open disclosures, a worded done state, every badge tone, steps with code and Copy, fenced code as a figure, table labels, unique code-region names.
- [x] The next desk page uses the new blocks, and lists anything new it runs into (none on 6 November).

## Verification (6 November 2026)

70 of 70 tests, 12 of 12 accessibility tests, ESLint, Prettier and `astro check` clean. The desk page was checked at 375px and 1280px with every row open: no horizontal scroll. Checking it found and fixed three layout bugs before release: a long badge widened the page (badges now wrap); a long command widened a step (grid track and auto margins); a stacked table row put labels beside values, leaving the value 161px wide (labels now sit above).

Not covered: body Markdown (articles) still renders fences and tables through Astro's own pipeline, so they don't get the shared figure or the phone table layout. Code-block headers for article bodies are ticket 313's leftover.

## Notes

Found by building `.desk/desk.json` with `pnpm pm:desk`. Never work around a gap with page-specific CSS: the point is to see it.
