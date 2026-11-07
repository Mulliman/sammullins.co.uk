---
id: "505"
title: Migrate photography (hidden), then a site-wide alt text audit
epic: Migration
status: review
priority: p0
size: M
owner: agent
depends_on: ["501", "304"]
---

## Why

Keep photography, but hidden (decisions: *Photography*). Sam, 7 November 2026: widen the alt text work from the albums to the whole site, because the migrated alts everywhere were filenames ("Cars2", "Xstatic Action 1").

## Scope

- `/photography/`, `/photography/photoshare21/` and the 8 albums at the same URLs, using the gallery block.
- Front matter `hidden: true`: excluded from the main nav and the home listings; linked from the Archive and the footer.
- Real alt text for every meaningful image on the site: front matter images (`cover`, `hero`, `gallery`, `image`, `cards`) and inline Markdown images in bodies. Drafted by AI from the actual photos, for Sam's review.
- Images beside a linked title (card thumbnails) stay `alt: ""` with `decorative: true`; the schema already refuses an empty alt without it.

## Acceptance criteria

- [x] All 10 photography URLs build.
- [x] Every image has non-empty, non-generic alt text, or is marked decorative.
- [x] Photography does not appear in the main nav.
- [ ] Sam has skimmed the drafted alts and fixed anything wrong (names, places, who is in a photo).

## Verification (6 November 2026)

Not met: album alt text is generic (titles such as "Cars2"). The "12 empty alts" were card thumbnails already marked `decorative: true`, so they were correct.

## Progress (7 November 2026)

- 182 alts rewritten from the images themselves: 135 in the 8 albums and the home page gallery, 39 covers, banners, screenshots and the home page photo of Sam, and 8 inline Markdown images. Each describes what is in the frame and where ("Big Thunder Mountain's red rock spires…", "The xStatic Actions screen in Umbraco, showing…"). The XPEDITE TDD diagram's alt spells out its six steps.
- Left as they were: "Sam Mullins logo" on the home page (fine as is), the `[Describe…]` placeholders in the `page-structure-example-*` templates (deliberate), and the 68 decorative card thumbnails.
- Sam to check: guesses I couldn't confirm from the photo alone. Mainly the people in the Epcot Morocco shots (alts say "a woman"), the dad and son at the lake in Spain, the Brave dancer (described, not named), and which ride the pirate throne scene is from.
- Not done: page titles and descriptions. If "title text" in Sam's note meant those, that's a separate pass (proposed as a follow-up, not started).
