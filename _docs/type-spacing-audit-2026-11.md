# Typography and spacing audit, 7 November 2026

Audited from the site desk artifact (claude.ai/artifact/3MYW1vWER89Ae36cY4jipK), which is built from the real site blocks on the `205-spacing-rhythm` line of work, and from `src/` on `style-guide`. Measurements are computed styles at 1440px and 375px viewports.

## Summary

The token system is sound (Utopia fluid type 1.2 to 1.25, 16 to 18px body, fluid space pairs, 68ch measure). What looks "all over the place" comes from four faults on top of it:

1. **The base text never loads in the artifact.** Every paragraph, list, table and disclosure renders at 14px system font with `line-height: normal`, while headings render at full Mona Sans size. A 44px heading over 14px text is a 3.1x jump, so the gaps tuned for 18px text look huge.
2. **Spacing breaks the proximity rule.** The gap between a section intro and its own content is as big as (desktop) or bigger than (mobile) the padding between sections, so content floats free of its heading.
3. **Role collisions in the scale.** The lead paragraph and prose `h3` are the same size at every viewport; there are two different `h2` sizes on one page.
4. **Ad hoc values.** Twelve hard-coded line heights, compounding code sizes (13px code on phones) and leftover UIkit pixel spacing.

## Findings

### P0. Body type is overridden in hosted pages

| Measured on the artifact | Intended |
| --- | --- |
| body 14px, `-apple-system`, `line-height: normal` | `--step-0` (16 to 18px), Mona Sans, 1.6 |
| inline code 12.6px, code blocks 11.3px | about 15 to 16px |

Cause: the artifact host wraps the page in its own skeleton with an unlayered `body { font: 14px -apple-system, ... }`. The site sets body type inside `@layer base`, and unlayered author styles beat every cascade layer regardless of specificity. Headings survive because blocks set their own size and family on the element.

Injecting one unlayered rule restored 18px / 28.8px Mona Sans throughout (verified in the browser). The same failure will hit any wrapper that injects an unlayered reset (feed readers, preview tools, embeds).

**Fix:** declare body type once outside the layers in `global.css`:

```css
/* Unlayered on purpose: host wrappers (artifacts, readers) inject unlayered body resets. */
body {
  font: var(--weight-body) var(--step-0) / var(--leading-body) var(--font-sans);
}
```

### P1. Intra-section gaps rival section padding

| Gap | 1440px | 375px |
| --- | --- | --- |
| Intro heading to lead | 18px | 18px |
| Intro lead to first component (`--space-xl`) | **72px** | **64px** |
| Component to component (`--space-m`) | 27px | 24px |
| Section padding, each side (`--space-l-xl`) | 72px | **40px** |

Gestalt proximity: things that belong together must be measurably closer than things that do not. Here the intro is as far from its own cards as the section edge is (desktop), and on phones it is further from its content than the content is from the next section. Every well-made system keeps internal gaps at half or less of the section break (GOV.UK: 20px paragraph and component margins against 40 to 60px section breaks; Tailwind Typography: 24px paragraph rhythm against 48 to 64px heading breaks).

**Fix:** three tiers, each at most half the next:

| Tier | Token | 375 to 1440 |
| --- | --- | --- |
| Inside a component (label to text, heading to lead) | `--space-2xs` to `--space-s` | 8 to 18px |
| Between components in a section, and intro to content | `--space-m-l` | 24 to 45px |
| Section padding | new `--space-section: clamp(3.5rem, 2.6rem + 4vw, 6rem)` | 56 to 96px |

Drop the `:has(.intro__lead) + .nested-block { margin-top: var(--space-xl) }` special case; intro to content should use the middle tier like everything else.

### P1. Scale roles collide

| Role | 375px | 1440px |
| --- | --- | --- |
| Hero `h1` (`--step-6`) | 48px | 69px |
| Section `h2` (`--step-4`) | 33px | 44px |
| Prose `h2` (`--step-3`) | 28px | 35px |
| Lead (`--step-1`) | 19px | 22.5px |
| Prose `h3` (`--step-1`) | **19px** | **22.5px** |
| Body (`--step-0`) | 16px | 18px |

The prose `h3` and the lead are identical in size, so a subheading reads as a stray lead paragraph (and vice versa). Base `h1` is `--step-5` but every hero uses `--step-6`, so the base rule is dead weight.

**Fix:** name roles rather than tags (display, title, heading, subheading, lead, body, small) and give each one step. Move prose `h3` to `--step-2` (23 to 28px). Keep the lead at `--step-1` but weight 400 and `--color-text-muted`, so weight and colour separate it from headings as well as size. Set base `h1` to `--step-6` to match reality.

### P1. Line heights are ad hoc

There are twelve distinct literal line heights across blocks and components (1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.5, 1.6, 2.75rem), none tied to size. Headings at similar sizes get different leading in Card (1.2), Listing (1.3), NextPrev (1.25) and Quote (1.35).

**Fix:** one leading token per role, and no literals in components:

| Role | Leading |
| --- | --- |
| Display (hero `h1`) | 1.05 |
| Title (`h2`) | 1.12 |
| Heading and subheading (`h3`, `h4`, card titles) | 1.25 |
| Lead | 1.45 |
| Body and lists | 1.6 |
| Small and meta | 1.5 |
| Code | 1.55 |

### P2. The small end is too small

- `--step--1` bottoms out at 13.3px and carries meta, captions, footer and nav text in about 30 places. GOV.UK's smallest text is 14px on phones and 16px on desktop; WCAG reflow testing and most 2026 systems treat 14px as the floor for anything people read.
- Code blocks compound `0.9em` twice (`pre` in `global.css`, then `.code pre code` in `Code.astro`): 14.6px on desktop, 13px on phones.

**Fix:** raise `--step--1` to `clamp(0.875rem, ..., 0.9375rem)` (14 to 15px). Set code to `0.875em` in one place.

(An earlier draft also suggested `font-size-adjust: ex-height from-font`. That only normalises fallback fonts to the first font in the mono stack, not to Mona Sans, so ticket 208 leaves it out.)

### P2. Legacy pixel spacing on `style-guide` and `main` (already fixed on `205-spacing-rhythm`)

`global.css` still has the UIkit section rhythm (40px and 70px, 15px and 25px). Components carry their own pixels: Cards, Gallery, Listing and LogoWall gaps of 15px, Card and Hero padding of 30px, Intro margin of 20px, and Header padding of 10px. AgentView has rem literals for its type. The 205 branch swaps the section padding for tokens; the component pixels remain.

**Fix:** tokens only in blocks and components. Add a stylelint rule (`declaration-property-value-disallowed-list` for `px` on `padding|margin|gap`) so it stays that way.

## How it compares

| | This site (intended) | This site (artifact) | GOV.UK Design System | Tailwind Typography `prose-lg` | Material 3 |
| --- | --- | --- | --- | --- | --- |
| Body size | 16 to 18px | 14px | 16 to 19px | 18px | 16px |
| Body leading | 1.6 | normal (~1.2) | 1.25 to 1.32 | 1.78 | 1.5 |
| Section heading | 33 to 44px | 33 to 44px | 24 to 36px | 30px | 32px |
| Heading leading | 1.1 to 1.35 (mixed) | same | 1.04 to 1.25 | 1.2 to 1.33 | 1.12 to 1.25 |
| Smallest reading text | 13.3px | 12.6px | 14 to 16px | 16px | 14px (11px UI labels only) |
| Leading system | literals | literals | per-size pairs | per-size pairs | 4px grid tokens |
| Internal vs section gap | 1 : 1 (desktop), 1.6 : 1 (phone) | same | about 1 : 2.5 | about 1 : 2 | n/a |

The site's body size and measure are already in line with the best editorial systems. Its heading sizes run large (closer to marketing scale than reading scale), which is fine for a portfolio as long as the gaps step down cleanly beneath them. The two things the exemplars all do and this site does not: **leading paired to each size**, and **spacing tiers that never overlap**.

## 2026 techniques worth adopting

- `text-box: trim-both cap alphabetic` on headings and leads (Chrome 133+, Safari 18.2+; harmless elsewhere). It removes the half-leading above caps and below baselines, so a 24px gap looks like 24px instead of 24px plus 6 to 10px of invisible line box. This alone fixes much of the "gap above headings looks bigger than set" feeling.
- `lh` and `rlh` units for rhythm, for example `margin-block: 1rlh` between paragraphs so spacing follows the body leading.
- Keep `text-wrap: balance` on headings and `pretty` on body (already done).

## Suggested order

1. P0 unlayered body rule (one rule, fixes every desk page).
2. Spacing tiers and `--space-section`; remove the intro special case.
3. Leading tokens per role; delete literals.
4. Role sizes (prose `h3`, lead colour, base `h1`) and the 14px floor.
5. Code size, `font-size-adjust`, `text-box` trim.
6. Purge component pixels; add the stylelint guard.

Each step should be checked on the style guide's Type and Spacing pages and on a regenerated desk page at 375px and 1440px.
