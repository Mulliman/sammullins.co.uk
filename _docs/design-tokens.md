# Design tokens

Generated from `src/styles/global.css` (the source of truth) on 6 November 2026. Don't edit by hand; regenerate it when tokens change.


## Brand

| Token | Light / default | Dark | Note |
|---|---|---|---|
| `--brand-orange` | `#da7d03` |  | original accent, decorative use only |

## Colour (light theme by default; dark values alongside)

| Token | Light / default | Dark | Note |
|---|---|---|---|
| `--color-bg` | `#ffffff` | `#121212` |  |
| `--color-bg-muted` | `#f2f2f2` | `#1b1b1b` |  |
| `--color-bg-inverse` | `#1c1c1c` | `#000000` |  |
| `--color-surface` | `#ffffff` | `#1f1f1f` |  |
| `--color-surface-inverse` | `#262626` | `#262626` |  |
| `--color-text` | `#4d4d4d` | `#cfcfcf` | body copy, 8.4:1 on bg (the original used #666) |
| `--color-text-muted` | `#595959` | `#b5b5b5` | 7:1 on bg |
| `--color-heading` | `#333333` | `#ededed` | headings |
| `--color-text-strong` | `#000000` | `#ffffff` | section headings ("sam-heading") |
| `--color-text-inverse` | `#f5f5f5` |  |  |
| `--color-text-inverse-muted` | `#c8c8c8` |  |  |
| `--color-link` | `#9a5200` | `#f2a43c` | 6.0:1 on #fff, 5.5:1 on muted |
| `--color-link-hover` | `#6e3a00` | `#ffc477` |  |
| `--color-link-inverse` | `#f2a43c` |  | 8.4:1 on inverse |
| `--color-border` | `#d6d6d6` | `#333333` |  |
| `--color-focus` | `#0b57d0` | `#8ab4ff` |  |
| `--color-frame` | `#ffffff` | `#f0f0f0` | the thick white photo frame |
| `--color-code-bg` | `#f6f6f6` | `#1a1a1a` |  |

## Type

| Token | Light / default | Dark | Note |
|---|---|---|---|
| `--font-sans` | `'Mona Sans', 'Mona Sans fallback', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif` |  |  |
| `--font-display` | `var(--font-sans)` |  |  |
| `--font-mono` | `ui-monospace, 'Cascadia Code', 'SF Mono', Menlo, Consolas, monospace` |  |  |

## Fluid modular scale: 16px body at 360px wide (ratio 1.2) to 18px at 1280px (ratio 1.25)

| Token | Light / default | Dark | Note |
|---|---|---|---|
| `--step--2` | `clamp(0.6944rem, 0.6844rem + 0.0444vw, 0.72rem)` |  |  |
| `--step--1` | `clamp(0.8333rem, 0.8072rem + 0.1159vw, 0.9rem)` |  |  |
| `--step-0` | `clamp(1rem, 0.9511rem + 0.2174vw, 1.125rem)` |  |  |
| `--step-1` | `clamp(1.2rem, 1.1193rem + 0.3587vw, 1.4063rem)` |  |  |
| `--step-2` | `clamp(1.44rem, 1.3156rem + 0.5527vw, 1.7578rem)` |  |  |
| `--step-3` | `clamp(1.728rem, 1.5444rem + 0.8161vw, 2.1973rem)` |  |  |
| `--step-4` | `clamp(2.0736rem, 1.8103rem + 1.1704vw, 2.7466rem)` |  |  |
| `--step-5` | `clamp(2.4883rem, 2.1186rem + 1.6433vw, 3.4332rem)` |  |  |
| `--step-6` | `clamp(2.986rem, 2.4751rem + 2.2705vw, 4.2915rem)` |  |  |
| `--weight-body` | `400` |  |  |
| `--weight-strong` | `600` |  |  |
| `--weight-heading` | `600` |  |  |
| `--weight-display` | `650` |  |  |
| `--leading-tight` | `1.1` |  |  |
| `--leading-snug` | `1.3` |  |  |
| `--leading-body` | `1.6` |  |  |
| `--tracking-display` | `-0.025em` |  |  |
| `--tracking-heading` | `-0.015em` |  |  |

## Space & shape

| Token | Light / default | Dark | Note |
|---|---|---|---|
| `--space-3xs` | `0.25rem` |  |  |
| `--space-2xs` | `0.5rem` |  |  |
| `--space-xs` | `0.75rem` |  |  |
| `--space-s` | `1rem` |  |  |
| `--space-m` | `1.5rem` |  |  |
| `--space-l` | `2.5rem` |  |  |
| `--space-xl` | `4rem` |  |  |
| `--space-2xl` | `6rem` |  |  |
| `--gutter` | `clamp(1rem, 4vw, 2.5rem)` |  |  |
| `--measure` | `68ch` |  | about 75 characters of Mona Sans |
| `--container` | `1200px` |  |  |
| `--container-narrow` | `800px` |  | the original's 2/3-width text column |
| `--radius` | `4px` |  |  |
| `--shadow` | `0 0 20px rgb(0 0 0 / 0.5)` |  |  |
| `--shadow-soft` | `0 14px 25px rgb(0 0 0 / 0.16)` |  | UIkit card hover |

## Motion

| Token | Light / default | Dark | Note |
|---|---|---|---|
| `--dur-fast` | `150ms` |  |  |
| `--dur` | `300ms` |  |  |
| `--dur-slow` | `1200ms` |  |  |
| `--ease` | `cubic-bezier(0.2, 0.7, 0.2, 1)` |  |  |
