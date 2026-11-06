---
id: "313"
title: "Article template: meta, contents and code blocks"
epic: Content model
status: todo
priority: p0
size: M
owner: agent
depends_on: ["204"]
---

## Why

Articles open with a full-width dark hero, and nothing near the title shows the date, reading time or position in a series. There is no table of contents, so long articles are hard to navigate.

## Scope

- A light article header with the title and description, then a meta row below the title: date, reading time, and "Part 1 of 3" when `series` is set.
- A sticky table of contents built from the h2s on wide screens, collapsed above the article on narrow ones.
- Code blocks get a header with the file name and copy button, shared with the `code` block.
- Series navigation at the end ("Other articles in the series").

## Acceptance criteria

- [ ] Reading time is computed at build time from the body.
- [ ] Table of contents links match the heading anchors, and the current section is highlighted without JS where possible.
- [ ] Article body lines are 60 to 75 characters long at 1280px.
