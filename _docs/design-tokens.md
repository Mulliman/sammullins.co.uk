# Design tokens

Generated from `src/styles/themes/default.css`, the only place colours are defined (ticket 207). Typography, spacing and motion tokens are in `src/styles/global.css`. Page themes such as `christmas.css` override some of these; see `src/styles/themes/README.md`. The style guide shows every token, read from these files at build time: [/style-guide/foundations/](/style-guide/foundations/).

## Brand

| Token | Light | Dark | Note |
|---|---|---|---|
| `--brand-orange` | `#da7d03` | same | original accent, decorative use only |
| `--color-on-brand` | `#000000` | same | text on the orange (selection, pressed toggles) |

## Page and text

| Token | Light | Dark | Note |
|---|---|---|---|
| `--color-bg` | `#ffffff` | `#121212` |  |
| `--color-bg-muted` | `#f2f2f2` | `#1b1b1b` |  |
| `--color-bg-inverse` | `#1c1c1c` | `#000000` |  |
| `--color-surface` | `#ffffff` | `#1f1f1f` |  |
| `--color-surface-inverse` | `#262626` | `#262626` |  |
| `--color-text` | `#4d4d4d` | `#cfcfcf` | body copy, 8.4:1 on bg (the original used #666) |
| `--color-text-muted` | `#595959` | `#b5b5b5` | 7:1 on bg |
| `--color-heading` | `#333333` | `#ededed` |  |
| `--color-text-strong` | `#000000` | `#ffffff` | section headings ("sam-heading") |
| `--color-text-inverse` | `#f5f5f5` | same |  |
| `--color-text-inverse-muted` | `#c8c8c8` | same |  |
| `--color-nav` | `#6b6b6b` | `#b5b5b5` |  |
| `--color-link` | `#9a5200` | `#f2a43c` | 6.0:1 on #fff, 5.5:1 on muted |
| `--color-link-hover` | `#6e3a00` | `#ffc477` |  |
| `--color-link-inverse` | `#f2a43c` | same | 8.4:1 on inverse |
| `--color-border` | `#d6d6d6` | `#333333` |  |
| `--color-focus` | `#0b57d0` | `#8ab4ff` |  |
| `--color-frame` | `#ffffff` | `#f0f0f0` | the thick white photo frame |
| `--color-code-bg` | `#f6f6f6` | `#1a1a1a` |  |

## Inverse surfaces (footer, dark sections)

| Token | Light | Dark | Note |
|---|---|---|---|
| `--color-inverse-heading` | `#ffffff` | same |  |
| `--color-inverse-link-hover` | `#ffc477` | same |  |
| `--color-inverse-border` | `#3a3a3a` | same |  |
| `--color-inverse-rule` | `#333333` | same | the line under the colophon |
| `--color-inverse-focus` | `#8ab4ff` | same |  |
| `--color-button-inverse-bg` | `#ffffff` | same |  |
| `--color-button-inverse-bg-hover` | `#e6e6e6` | same |  |
| `--color-button-inverse-fg` | `#222222` | same |  |

## Callout tones

| Token | Light | Dark | Note |
|---|---|---|---|
| `--color-note` | `#0b57d0` | `#8ab4ff` |  |
| `--color-tip` | `#1f6f3a` | `#8fd6a2` |  |
| `--color-warning` | `#a4262c` | `#ff8a80` |  |

## On photos and video: the same in both themes, because the media is the background

| Token | Light | Dark | Note |
|---|---|---|---|
| `--color-media-bg` | `#000000` | same |  |
| `--color-embed-bg` | `#0d0d0d` | same |  |
| `--color-on-media` | `#ffffff` | same |  |
| `--color-on-media-soft` | `#f5f5f5` | same |  |
| `--color-on-media-muted` | `#c8c8c8` | same |  |
| `--color-media-scrim` | `rgb(0 0 0 / 0.85)` | same | the blurred hero's text panel |
| `--color-media-scrim-soft` | `rgb(0 0 0 / 0.72)` | same | image card caption bar |
| `--color-media-backdrop` | `rgb(0 0 0 / 0.92)` | same | the lightbox |
| `--color-media-control` | `rgb(255 255 255 / 0.1)` | same |  |
| `--color-media-control-hover` | `rgb(255 255 255 / 0.2)` | same |  |
| `--color-media-control-border` | `rgb(255 255 255 / 0.4)` | same |  |
| `--color-media-focus` | `#8ab4ff` | same |  |
| `--color-play` | `rgb(255 255 255 / 0.9)` | same |  |
| `--color-play-hover` | `#ffffff` | same |  |
| `--color-on-play` | `#111111` | same |  |
| `--color-logo-tile` | `#ffffff` | same | client logos are drawn on white |

## Logo gradient stops (the mark in the header and footer)

| Token | Light | Dark | Note |
|---|---|---|---|
| `--logo-primary` | `#000000` | `#ffffff` | The S bars and SAM |
| `--logo-secondary` | `#3d3f43` | `#c2c4c8` | The M bars and MULLINS |

## Shadows

| Token | Light | Dark | Note |
|---|---|---|---|
| `--shadow` | `0 0 20px rgb(0 0 0 / 0.5)` | same |  |
| `--shadow-soft` | `0 14px 25px rgb(0 0 0 / 0.16)` | same | UIkit card hover |
| `--shadow-inset` | `inset 0 0 20px rgb(0 0 0 / 0.5)` | same |  |
| `--text-shadow-media` | `0 0 10px #000000` | same |  |

## Code highlighting (Prism)

| Token | Light | Dark | Note |
|---|---|---|---|
| `--tok-comment` | `#5c6670` | `#9aa4ad` |  |
| `--tok-keyword` | `#a3215f` | `#ff8ac0` |  |
| `--tok-string` | `#1f6f3a` | `#8fd6a2` |  |
| `--tok-number` | `#8a4b00` | `#ffbe6b` |  |
| `--tok-fn` | `#2b4fb3` | `#9db8ff` |  |
| `--tok-punct` | `#444444` | `#c8c8c8` |  |
