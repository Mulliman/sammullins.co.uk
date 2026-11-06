# Overnight build report (5–6 Nov 2026)

All work is on the local branch **`overnight/2026-11-05`**. `main` is untouched, nothing is pushed, and no GitHub repo or Netlify site was created. Review it like a PR, then merge if you're happy.

## State at hand-back

| Check | Result |
|---|---|
| `pnpm check` (astro check, TS) | 0 errors, 0 warnings |
| `pnpm build` | 54 pages + 54 Markdown twins + `llms.txt`; `_redirects` 1,020 lines; 205 legacy media copies |
| `pnpm test` | 12/12: all **50 legacy URLs** and **306 legacy media paths** resolve; hygiene (no gmail, GA, Google Fonts, UIkit or inline styles; CSP meta on every page; alt on every image) |
| `pnpm test:a11y` | 3/3: axe WCAG 2.2 AA with **0 violations on every page in light and dark**; no horizontal scroll at 320px |
| `pnpm lint` | Prettier clean |

Tickets: 42 in `review`, 6 in `in-progress`, 9 `todo` (mostly yours: accounts, DNS, launch).

## What was built

- **Platform:** Astro 7.4.4 (static), Zod content model with 16 block types, block renderer, `EntryPage` (archive banner, auto series nav, colophon, agent view). Tickets 002–003, 101–103.
- **Design:** an evolution of the 2021 look:
  - tokens with light/dark themes and a toggle
  - self-hosted Lato and Pacifico
  - thin uppercase display headings kept, stepped up to 300 below ~32px
  - the brand orange is darkened for text contrast
  - a JS-free mobile nav

  Tickets 201–203.
- **Blocks:** hero (blurred/image/plain), intro, prose, body, callout, image, gallery (native `<dialog>` lightbox), cards, listing, logoWall, quote, code, nextPrev, timeline, embed (click-to-load nocookie facade), split. Tickets 301–309.
- **Media:**
  - **Masters:** 204 AVIF masters (~35 MB, from 368 MB).
  - **Serving:** responsive AVIF + WebP.
  - **Legacy URLs:** old `/media/...` URLs are 301'd to stable copies, so hotlinks survive.

  Tickets 401–403.
- **Migration:** all 50 pages migrated by a script.
  - The duplicate git/ftp article is merged into `xstatic-adds-git-and-ftp-support` (it's the one linked internally) with a 301.
  - Articles and Umbraco packages are marked `archived`; photography is `hidden`.
  - New `/archive/` page; the Articles page now uses listing queries.
  - The CV's education and employment sections became timelines.

  Tickets 501–507.
- **URLs and security:**
  - `src/data/redirects.json`, with build-time validation (no chains, loops or missing targets)
  - `netlify.toml` with HSTS preload, frame-ancestors, nosniff, Permissions-Policy, COOP/CORP and cache rules
  - Astro's per-page hashed CSP

  Tickets 601–603, 701–702.
- **CI:**
  - workflows for check, lint, build, test, axe, lychee, CodeQL, Scorecard, PR title and weekly external links
  - every action pinned to a commit SHA, least-privilege permissions
  - Renovate with a 7-day cooldown and no automerge

  Tickets 705, 801–803, 805.
- **Delight:**
  - agent view (Markdown twins, `llms.txt`, an on-page toggle)
  - colophon (git last-changed date plus a Sam / Sam + AI icon)
  - console secret
  - signature draw and hover
  - a helpful 404 ("Lost in the static", with did-you-mean suggestions)
  - View Transitions and blur-to-sharp hero prototypes, **both behind flags in `src/data/site.yaml`, off by default**

  Tickets 901–905, 603.
- **AI authoring:**
  - `AGENTS.md` (with the voice essentials) and `CLAUDE.md` → `@AGENTS.md`
  - Agent Skills in `.agents/skills/`, mirrored to `.claude/skills/` (Claude Code only reads that folder)
  - a block catalogue generator, `_docs/voice.md` and `_docs/content-model.md`

  Tickets 004, 1001–1003.
- **Docs:** README (architecture diagram, "How AI writes this site"), ARCHITECTURE, SECURITY, CONTRIBUTING, LICENSE (MIT, code) and LICENSE-CONTENT (all rights reserved). Ticket 1101.

**How it was done:** I orchestrated and reviewed. Seven Haiku subagents, each in its own git worktree, built the media conversion, the 3 block groups, the voice guide, the docs and skills, and the 404/console/signature. I merged, fixed and verified each one.

## Assumptions I made (please check)

1. **Astro 7, not 6.** Astro 7 is current; I used 7.4.4, the newest release older than 7 days.
2. **Prism instead of Shiki** for code highlighting: Shiki's inline styles break the strict CSP. The `code` *block* is unhighlighted (body Markdown code is highlighted).
3. **Code blocks wrap instead of scrolling** (simplest way to pass WCAG keyboard-scroll and 320px checks).
4. **ESLint:** added on 6 Nov once Node was upgraded (ESLint 10, eslint-plugin-astro with its jsx-a11y strict preset, typescript-eslint). `jsx-a11y` declares a peer range up to ESLint 9 but works on 10. Engines now require Node >= 24.16.
5. **Lighthouse CI (804) not done**, and **HTML validation (805)** not done; the hygiene and header parts are.
6. **Software index page** kept its curated audience-based layout from the old site (rather than "current vs earlier"), since there's no current AI software entry yet.
7. **Footer copy** ("What do I do?") is still the old Umbraco/Sitecore text; the content series will replace it. The "Free stuff!" card now points to the UmbracoFolio page and GitHub.
8. **Home page:** I changed its title to "Sam Mullins" and the hero alt text to "Photo of Sam Mullins". The photography teaser is still on the home page (small); remove it if you want photography fully hidden.
9. **Client logo names** were guessed from filenames: AHL, RCS, RNLI, WYSO, Mace, **Channel 4** (from `c4`), Clarion, CG, haart, FAB, HS, IV. Fix any that are wrong in `src/content/pages/home.md`.
10. **The UmbracoFolio zip:** ~~kept byte-for-byte~~ **Resolved 6 Nov:** Sam confirmed UmbracoFolio is legacy. The zip is deleted, its URL 301s to the archived `/software/umbracofolio/` page, the download card is gone, the footer "Free stuff!" card now points to GitHub and the archive, and the CV's "For Developers" card points to xStatic.
11. **Photo alt text** comes from the old filenames ("Gecko Profile"). That's acceptable, but real descriptions would be better (ticket 505).
12. **GoatCounter:** CSP already allows `https://sammullins.goatcounter.com` (I guessed your site code). Analytics stay off until you set `analytics.goatcounter` and vendor `public/js/count.js`.
13. **YouTube:** the voice agent couldn't reach the @sam_mullins channel (Google consent wall). The voice guide is from your written content only.
14. **Console secret:** the code is **`pelican`**; the riddle is in `/humans.txt`. Type `unlock('pelican')` in DevTools.
15. **Bluesky:** the link is commented out in `site.yaml` until you give me the handle.

## Needs you

1. **Review the branch:** `git log main..overnight/2026-11-05`, then `pnpm dev` and click around (light and dark, phone width). The visual feel of the hero, signature animation and cards hasn't been approved by a human yet.
2. **Ticket 001:** create `Mulliman/sammullins.co.uk` on GitHub, push, set up branch protection and signing. (Your git email is `git@sammullins.co.uk`, which GitHub can't verify until domain mail exists.)
3. **Ticket 701:** create a *new* Netlify site from the repo. The old site stays live.
4. **Tickets 703/704:** GoatCounter account plus Search Console DNS verification.
5. **Ticket 905:** flip `viewTransitions` and `blurToSharpHero` to `true` in `site.yaml` locally, look, and decide.
6. **Ticket 1201:** the new content series, which is the launch gate.

## Housekeeping

- Agent worktrees remain under `.claude/worktrees/` (git-ignored), with branches `worktree-agent-*`. Everything useful is merged; they can be removed.
- The first build takes about 5 minutes (≈1,500 image variants); later builds are cached (~20s).

## 6 Nov: fidelity pass against the live site

Sam found the build looked different from the live site and partly broken. A side-by-side browser pass fixed:

- **Typography:** the original's thin headings were UIkit's system font stack (Segoe UI / SF) at weight 100, not Lato Hairline. Headings now use that stack, are centred like the original, and sizes match (h1 42px, h2 32px). Section headings use the original regular-weight black "sam-heading" style.
- **Header:** back to the light bar with the logo centred and the nav on the right; the theme toggle sits in the empty left slot.
- **Logo:** "SAM" had no fill at all and the footer copy reused the header's gradient ids, so it was dark on dark. Both fixed; the logo goes light in dark mode.
- **Client logos:** four per row at the original size. In dark mode they render as light versions (inverted, blended onto the page) instead of white boxes.
- **Cards:** original UIkit look (white card, image on top, centred thin title, button), 4/2/1 columns with lone cards centred at half width; plain centred text cards.
- **Lost content restored:** the migration dropped the text of every text-only card (the CV's skills and jobs, xStatic docs index, PhotoShare21 panels). `scripts/migrate/fill-card-text.mjs` refilled it from the legacy HTML, and the CV's education and employment are back to the original cards.
- **Photo albums:** each photo's section type (blurred backdrop, black band or plain) and gallery column counts restored from the legacy HTML by `scripts/migrate/fill-image-sections.mjs`.
- **Articles:** empty "Nothing here yet" sections are hidden; the archive is the original 3-column card grid.
- **Guard:** block Markdown with a relative image now fails the build (one image on /software/ was silently broken).

New block options: `surface` on prose, gallery, logoWall, listing and timeline; `cta` on intro and card items; `columns` on gallery; `frame`, `backdrop` and `surface` on image.
