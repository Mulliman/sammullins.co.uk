---
id: "1203"
title: Pre-launch review on preview
epic: Launch
status: todo
priority: p0
size: S
owner: sam
depends_on: ["all p0"]
---

## Why

The last human check before the domain switches.

## Scope

On the new Netlify site's production URL (`*.netlify.app`):

- [ ] All CI gates green on `main`: legacy URLs, axe, links, HTML, headers, Lighthouse.
- [ ] securityheaders.com A+, Mozilla Observatory A+.
- [ ] Click-through on desktop and phone (iOS Safari + Android Chrome): home, an article, a doc series, a gallery, the archive, the 404, the theme toggle, the agent view.
- [ ] Keyboard-only pass and a screen-reader spot check (NVDA or VoiceOver) on home and an article.
- [ ] No gmail, GA or Google Fonts anywhere (805 hygiene).
- [ ] Open Graph cards render (check with a card validator).
- [ ] 1201 content gate signed off.
- [ ] Old-site backup confirmed (xStatic output + `21-02-2026/` copy).

## Acceptance criteria

- [ ] Every box ticked, with notes in the PR or issue.
