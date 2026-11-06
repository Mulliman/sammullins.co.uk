---
id: "1302"
title: "Style guide: foundations generated from the tokens"
epic: Style guide
status: todo
priority: p1
size: M
owner: agent
depends_on: ["1301"]
---

## Why

The foundations page has to stay true without anyone maintaining it. Since 207, every colour is a token in `src/styles/themes/default.css`, and type, spacing and motion tokens are in `global.css`. The page should read those files at build time, not copy values into the guide.

## Scope

- **Colour:** a swatch for every colour token, grouped as in `default.css` (page and text, inverse surfaces, callout tones, media, logo, code). Each swatch shows the light and dark value, the comment from the CSS, and its contrast ratio against the background it is meant for.
- **Typography:** the fluid scale `--step--2` to `--step-6` set in Mona Sans, with the min and max px values; weights, leading and tracking tokens; the heading levels as they actually render.
- **Space, radius, shadow and motion:** a visual for each token.
- Parse the CSS at build time (a small helper in `src/lib/`), so adding a token to the theme adds it to the guide.

## Acceptance criteria

- [ ] Adding a new `--color-*` token to `default.css` makes it appear on the page with no other change (test).
- [ ] No value on the page is typed by hand: they all come from the parsed CSS.
- [ ] Each text-colour pairing shows its contrast ratio, and anything under 4.5:1 is flagged on the page.
- [ ] `_docs/design-tokens.md` links to the page; the generated Markdown table can stay for agents.
