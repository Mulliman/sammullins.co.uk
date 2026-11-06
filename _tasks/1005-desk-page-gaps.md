---
id: "1005"
title: "Blocks the PM desk page needed and the site lacks"
epic: Blocks
status: todo
priority: p2
size: M
owner: agent
depends_on: ["1004"]
---

## Why

The PM desk page (ticket 1004) is built only from the site's own blocks, so that anything it can't express shows where the component set is thin. The first build on 6 November found these. Each is a general need (long how-to articles and software docs would use them too), not a desk-page special.

## Scope

Gaps found, in the order they hurt:

1. **Disclosure block.** A `details`/`summary` component that is closed by default, keyboard-accessible, and works without JS. The desk page wants one closed row per item; software docs could use it for FAQs.
2. **Badge or tag.** Small labels for a kind, ticket ids and "phone / PC". Today these are a bold line of prose.
3. **Done state.** A way to mark a component or item as done (struck title, a quiet "Done" label) without Markdown strikethrough plus a separate callout.
4. **Copy button on code.** Commands in `code` blocks and prose fences have to be selected by hand. (Overlaps the code-block headers left over in 313.)
5. **Steps with commands.** A numbered step list whose steps can hold a `code` block. Today steps are a Markdown list with indented fences, which loses the `code` block's filename header.
6. **Compact table on phones.** Wide `.prose` tables scroll sideways; a stacked layout below a breakpoint would read better.

## Acceptance criteria

- [ ] Sam picks which of the six to build (and in what order); the rest are struck from this ticket.
- [ ] Each one built is a block in `src/content.config.ts`, rendered in `Blocks.astro`, shown with its YAML on the style guide's components page, and passes axe.
- [ ] The next desk page uses the new blocks, and this list is updated with anything new the page runs into.

## Notes

Found by building `.desk/desk.json` with `pnpm pm:desk`. Never work around a gap with page-specific CSS: the point is to see it.
