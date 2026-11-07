---
id: "206"
title: Header, nav and footer refresh
epic: Design system
status: todo
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

- [ ] The header is at most 72px tall on desktop and 64px on mobile.
- [ ] The keyboard, screen reader and 320px checks still pass.
- [ ] Nothing shifts when the theme toggle script runs.
