---
id: "508"
title: "Copy refresh: bio, footer, CV summary, software page"
epic: Migration
status: todo
priority: p0
size: S
owner: pair
depends_on: []
---

## Why

The home bio, footer cards and CV summary describe Sam as he was around 2016 ("10 years of ASP.Net"), and say nothing about AI or his current role. The Software page says the site is built with xStatic and UmbracoFolio, but it is now built with Astro.

## Scope

- Rewrite the home intro, footer cards and CV summary for Sam's current role, in his voice (`_docs/voice.md`), with `authorship: sam-ai`.
- Remove or correct the false "built with my own projects" line on the Software page.
- Put anything not known in [brackets] for Sam to fill in.

## Acceptance criteria

- [ ] No page says the site is built with xStatic or UmbracoFolio.
- [ ] No "10 years" claim remains unless Sam confirms the number.
- [ ] Sam approves every rewritten paragraph.
