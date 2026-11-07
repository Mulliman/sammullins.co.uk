---
id: "206"
title: Header, nav and footer refresh
epic: Design system
status: done
priority: p1
size: M
owner: agent
depends_on: ["205"]
---

## Why

The header centres a large logo between a "Dark mode" text button and the nav, which takes 100px at the top of every page. The footer repeats the bio in three dark cards.

## Scope

- A compact sticky header: logo on the left; nav, an icon theme toggle and the agent view toggle on the right.
- Footer: one short sign-off line, the nav, socials and the colophon. Drop the three cards (their copy moves to 508).
- Keep the JS-free mobile nav.

## Acceptance criteria

- [x] The header is at most 72px tall on desktop and 64px on mobile. Measured: 72px at 1280px, 64px at 375px and 320px.
- [x] The keyboard, screen reader and 320px checks still pass (axe in both themes, the guide pages, the interaction tests, and no horizontal scroll at 320px: 12 of 12).
- [x] Nothing shifts when the theme toggle script runs. Measured with JS on and off: the header is the same height either way at every width.

## Verification (6 November 2026, overnight)

- **Header.** A sticky bar with a hairline under it: the logo on the left (52px tall, 44px on small phones), then the nav, the agent view toggle and an icon-only theme toggle (its label and `aria-pressed` stay for screen readers). Its height is a token, `--header-h`, which anchor links (`scroll-padding-top`), the article contents column and the style guide's side nav now offset by, so nothing lands under the bar. On phones the menu is still a `<details>`, and on small phones the agent view button shows only its ⌘ icon so the bar fits at 320px.
- **Agent view.** Moved from the top of the footer to the header, through a new `header-actions` slot in `BaseLayout` that entry pages fill. Without JS it is a short "Markdown" link (with a full accessible name) to the page's Markdown twin.
- **Footer.** The small logo, one sign-off line (the site name and tagline from `site.yaml`, so no new copy), the nav, socials in one row, the colophon and the copyright. The bio cards are gone. Their data (`footerCards` in `site.yaml`) is kept, unrendered, because the "What do I do?" text is 508's draft that Sam hasn't reviewed yet; delete it and its schema field after that.
- **Screenshots.** In `.compare/` in this worktree (not committed): `206-hdr2.png` (header, desktop and phone) and `206-sheet.png` (footer). The header shots taken straight after load show the logo mid-way through its first-visit animation (904), which is expected.

Sam to judge: the sign-off line ("Sam Mullins · Developer") is a placeholder made from existing settings. If you want a real sign-off sentence, it's one field to add.
