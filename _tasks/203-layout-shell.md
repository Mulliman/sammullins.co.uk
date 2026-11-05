---
id: "203"
title: Layout shell: header, nav, footer, landmarks
epic: Design system
status: todo
priority: p0
size: M
owner: agent
depends_on: ["103", "202"]
---

## Why

Accessible, JS-optional chrome that replaces UIkit's header and footer.

## Scope

- Skip link, then `<header>` with logo and `<nav aria-label="Main">`, then `<main id="content">`, then `<footer>`.
- Mobile nav works without JS (`<details>`/`<summary>` or a CSS-only pattern), enhanced with JS (Escape closes, focus is managed).
- Current page marked with `aria-current="page"`.
- Footer: the 4-column card grid from today, social links, and Archive and Photography links. The colophon slot is filled by 902.
- Theme toggle placement.

## Acceptance criteria

- [ ] Fully keyboard-operable.
- [ ] axe passes (802).
- [ ] With JS disabled, the mobile nav still opens and every link is reachable.
- [ ] Landmarks are unique and labelled.
