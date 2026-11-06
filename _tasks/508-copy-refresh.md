---
id: "508"
title: "Copy refresh: bio, footer, CV summary, software page"
epic: Migration
status: in-progress
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

- [x] No page says the site is built with xStatic or UmbracoFolio.
- [x] No "10 years" claim remains unless Sam confirms the number. (The CV's "more than 10 years" of JavaScript stays: it has been true since 2010.)
- [ ] Sam approves every rewritten paragraph.

## Draft (6 November 2026)

Drafted on branch `content/508-copy-refresh` and marked `sam-ai`: the home description, hero subtitle and intro; the "What do I do?" footer card; the CV description and subtitle; the Software page's "For Web Developers" section. Facts come only from the CV (Redweb from 2010, LV= 2021 to 2023, Allianz Technology from 2023, Sitecore and Umbraco certified, "over a dozen" sites). One placeholder needs Sam: `[the tools I use]` in the home intro.
