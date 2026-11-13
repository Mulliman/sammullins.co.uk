---
id: "508"
title: "Copy refresh: bio, footer, CV summary, software page"
epic: Migration
status: review
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

## Second draft (8 November 2026)

Sam answered a grilling on his tools and roles (`../grilling/tools-skills-and-voice.md`, outside the repo), and branch `content/launch-copy` redrafts the copy from it, still `sam-ai`:

- Home intro: `[the tools I use]` is now Claude Code, Antigravity and OpenCode. The paragraph covers work (Copilot to agent-first Claude in 2026) and home. The employer is TCS, on the same LV= websites since 2021.
- Footer "What do I do?": TCS and the agent-first move.
- CV: summary updated, employment grouped by place (LV= then Redweb, newest first), the TCS role, and a Certifications section (CCAF, linking to the Credly badge).
- Software page: grouped by audience with xStatic first; the new projects added, unfinished ones as "(beta)" until ticket 316 adds the status.
- The hero subtitle is unchanged. Its wording waits for the header rebuild (310).

Left: Sam approves every rewritten paragraph (the last criterion).
