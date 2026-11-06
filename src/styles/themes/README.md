# Themes

Every colour on the site lives in this folder. Components, layouts and `global.css` only use tokens
(`var(--color-…)`). `tests/hygiene.test.mjs` fails the build if a colour literal (hex, `rgb()`, `hsl()`,
named colours such as `white`) appears anywhere else in `src/`.

| File            | What it is                                                                       |
| --------------- | -------------------------------------------------------------------------------- |
| `default.css`   | The site theme: every token, light and dark, plus the inverse-surface remapping. |
| `christmas.css` | A page theme for the advent calendar.                                            |
| `terminal.css`  | The hidden "terminal green" theme from the console secret (ticket 903).          |
| `meta.ts`       | The one colour CSS can't supply: `<meta name="theme-color">`.                    |
| `index.ts`      | The list of page themes; the content schema reads it.                            |

## Using a page theme

Set it in the page's front matter. Light and dark mode still work on top of it.

```yaml
theme: christmas
```

## Adding a theme (a campaign, a season)

1. Copy `christmas.css` to `<name>.css` and change the values. Scope everything to
   `:root[data-page-theme='<name>']`.
2. Set every token you change in light **and** in both dark blocks, or the light value leaks into dark mode.
3. Add `<name>` to `pageThemes` in `index.ts`. `BaseLayout.astro` loads every `.css` file in this folder, so there is nothing to import.
4. Check contrast: `pnpm test:a11y` runs axe on every page in both themes.
5. Check it in the style guide at /style-guide/themes/: the theme gets a switcher button, a token diff against default, and a contrast table, with failures flagged.

## Adding a colour to a component

Don't write the colour in the component. Add a semantic token to `default.css` (for example
`--color-callout-new`), give it light and dark values, and use `var(--color-callout-new)`.
