# Grilling: sammullins.co.uk rebuild

Started: 2026-11-05
Status: complete (2026-11-05)
Context: see ./audit-2026-11.md

## Summary

Rebuild sammullins.co.uk as a **fresh, public, top-quality Astro 6 repo**. SamMullins2026 is reference only. The site is aimed at developers and AI enthusiasts as a demonstration of skills, not a hosted CV, and keeps today's structure: the home page signposts builds and clients, with Articles (plus short notes) and Software. Pages are YAML **block lists** validated by Zod (15 blocks). Every one of the 50 legacy URLs and 306 media paths keeps working or gets a 301; dated material moves into an **Archive** grouping at unchanged URLs, and photography is kept but hidden. The design **evolves the current look**: thin Lato headings stay, light/dark themes, WCAG 2.2 AA. It's static-only on Netlify with a strict CSP, no third-party scripts and a minimal hardened dependency set; analytics are GoatCounter plus Search Console. Delight comes from the agent view, the authorship colophon, a console secret and the signature animation; View Transitions and the blur hero get prototyped first. Agent tooling follows the AGENTS.md / Agent Skills standards. Sam always merges. Code is MIT, content is all rights reserved. **Launch target: November 2026, together with the new content series**, which is a separate workstream.

## Resolved

- **Framework basis**: start a fresh repo, with SamMullins2026 kept as reference only. *The 2026 project is a UIkit 1:1 port, ~10% done, and its build is broken.*

- **Audience & purpose**: primarily for other developers and AI enthusiasts. It's a demonstration of thinking and skills, not a job-begging hosted CV. Hiring managers and clients should still come away seeing competence, but implicitly. *The site is a showcase/publication first, with the CV a secondary page.*

- **Site structure**: keep it similar to today. The home page signposts things I've built and people I've worked with (client logos). Notes live in Articles, or in an optional smaller micro-feed. *It's familiar and it already works as a showcase.*
- **Legacy content**: keep all old articles and the Umbraco/xStatic/XPEDITE docs, presented in an **Archive** section. Pages keep their current URLs and get `archived: true` in front matter, which shows a "dated" banner and lists them on an `/archive/` index rather than the main listings. The duplicate git/ftp article is merged with a 301. *Nothing breaks, search ranking is kept, and the main sections stay current.*
- **Photography**: keep it, but hidden. It comes out of the main nav, keeps its current URLs, gets a link in the Archive and a small footer link, and moves to the new lightweight gallery block. *No redirects needed and no broken image hotlinks; low effort, and it can be deleted later.*
- **Framework (final)**: Astro 6, hardened. Direct dependencies are astro, sharp and @astrojs/sitemap only. pnpm with `minimumReleaseAge` set to 7 days, postinstall scripts allowed only for sharp, exact lockfile, Renovate/Dependabot with a cooldown. *Zod schemas catch bad AI edits; the supply-chain risk is limited to build time and mitigated.*
- **Repo visibility**: public, open source, and it must be **top-notch quality**. The repo is itself part of the showcase. *The harness (schema, AGENTS.md, skills) is the most interesting thing to show.*
- **Image storage & formats**: masters are committed to plain git (no LFS) as high-quality **AVIF** (about 2400px max on the long edge, visually lossless), converted once from the 208 originals. The build outputs responsive AVIF with WebP fallback via `<picture>`; no JPEG fallback. Old `/media/...` URLs get a 301 to the new optimised files. JPEG XL is not used until it has universal browser support. *Roughly 142 MB becomes an estimated 20–40 MB in the repo, and smaller downloads.*
- **Repo quality bar**: accepted as proposed in Q7. CI gates on astro check, lint/format, the legacy-URL test, axe WCAG 2.2 AA on every page, link checking, Lighthouse budgets, HTML validation and security-header checks. Also CodeQL, OpenSSF Scorecard, SHA-pinned actions, least-privilege tokens, secret scanning, protected main with signed commits and linear history, conventional commits and a changelog. Docs: README, ARCHITECTURE.md, SECURITY.md, CONTRIBUTING.md (no content PRs).
- **Agent standards**: use vendor-neutral standards wherever possible. **AGENTS.md** is the canonical agent instructions file; CLAUDE.md is at most a one-line import/pointer to it. Skills are written in the open **Agent Skills** (SKILL.md) format, placed wherever both Claude Code and other agents can discover them (location to be verified at implementation time). No Claude-only config unless there's no neutral equivalent. *Portable across Claude Code, Hermes, Codex etc.*
- **Licensing**: code (components, schema, scripts, config) is **MIT**. **All content is all rights reserved © Sam Mullins**: writing, photos, CV and images. LICENSE and README state the split explicitly, and content folders carry their own notice.
- **Analytics**: **GoatCounter** (free, cookieless, no banner) plus **Google Search Console** (verified via DNS). `count.js` is self-hosted (pinned and integrity-checked); CSP gains only `connect-src https://<code>.goatcounter.com`. Data is viewed in the GoatCounter dashboard (private by default). The old UA tag and Google Fonts are removed. *Free, privacy-respecting, nearly zero attack surface; GA4 would need a consent banner and is blocked by much of a developer audience.*
- **Contact**: the gmail address is **removed everywhere** (site, repo, history). No contact form. Social profiles are linked with `rel="me"` for verification. Feeds are low priority: no RSS/Atom required for v1, can be added later cheaply. *No forms means no attack surface; a domain email outlives any provider.*
- **Email (v1)**: **no email address on the site at launch**; contact is via social profiles only. Domain email (`hello@`) is deferred. DNS is Netlify DNS (NS1) with no MX; forwarding needs either a move to Cloudflare DNS or ImprovMX. Future option, not in scope.
- **Social profiles**: GitHub (`Mulliman`), LinkedIn (`sam-mullins-31471425`, assumed kept), X (`_SamMullins_`, kept and live), Bluesky (handle TBC). They live in the footer with text labels plus `rel="me"`. *Profiles that are actually used.*
- **Block catalogue v1**: `hero` (image/blurred/plain, CSS parallax, respects reduced motion), `intro`, `prose`, `image` (alt required), `gallery` (`<dialog>` lightbox), `cards` (full/image/text; manual or collection query), `logoWall`, `listing` (grid/list, filters), `quote`, `code` (Shiki at build, copy button), `callout` (incl. the legacy banner), `nextPrev` (automatic for series), `split` (nested blocks), `timeline` (CV), `embed` (click-to-load youtube-nocookie facade). Each is a Zod discriminated-union member. *It consolidates the 23 old partials into 15 typed blocks.*
- **Micro-feed**: notes are an Articles subtype (`kind: note`) at `/articles/<slug>/`, with a lighter listing variant on the home page. *One collection is simpler for AI and URLs.*
- **Visual direction**: evolve, don't replace. Keep the dark/light section rhythm, photo-led heroes, card grids, logo wall, **Lato** (self-hosted WOFF2, only the weights used) and Pacifico for the logo. **Thin uppercase headings stay as a signature**: Lato 100 for large display headings (≥ ~32px) with full-strength colour (≥ 7:1 contrast) and slight letter-spacing; smaller headings step up to 300 so they stay legible. **Centred text is allowed in symmetrical, centred sections** (hero, intro, short card copy); long-form prose is left-aligned. Light and dark themes follow the system with a manual toggle. *Keeps the identity while fixing the real legibility problems.*
- **Accessibility target**: WCAG 2.2 AA enforced by axe in CI; AAA contrast on body text where cheap. Visible focus, skip link, landmarks, reduced-motion support, a nav that works without JS.
- **Delight v1**:
  - **Agent view (yes)**: every page also builds as clean Markdown (`/…/index.md`) plus `/llms.txt`, with an on-page toggle to show what an agent sees.
  - **Colophon (yes, minimal)**: last-changed date (from git) plus a small authorship icon, **Sam** or **Sam + AI**, set per content item in front matter (`authorship: sam | sam-ai`). The label describes the *writing*, not how the page was built.
  - **Console secret (yes)**: a fun DevTools greeting containing a secret code/puzzle that unlocks something small (e.g. a hidden theme or page). Details at build time.
  - **Signature (yes)**: the Pacifico logo draws itself once per visit, plus a hover animation.
  - **View Transitions (open)**: CSS cross-page transitions, card image to hero; prototype it.
  - **Blur-to-sharp hero (open, must see it)**: prototype alongside the existing parallax style before committing.
  - **Rejected**: hidden terminal, Konami/`sudo` easter egg.
- **AI authoring workflow**: AGENTS.md holds the house rules (voice, block catalogue with examples, image/URL/authorship rules). Skills: `new-article`, `new-note`, `new-page`, `add-images`, `redirect`. AI always works on a branch and opens a PR; CI gates plus the Netlify deploy preview are the review. **Sam always merges**, or explicitly tells a model to merge in that moment. **Nothing is automatic on the site**: no auto-merge, scheduled publishing or bot commits to main. Branch protection enforces it.
- **Voice**: a style guide extracted from the 9 existing articles plus transcripts from the @sam_mullins YouTube channel, written into AGENTS.md. It's adapted for the 2027 AI focus, but stays recognisably Sam.
- **Old SamMullins2026/agents.md**: superseded. The new repo's AGENTS.md is written from scratch; the UIkit-preservation rules are explicitly dropped.
- **New 2027 content**: **out of scope for the site build**. It becomes a separate content series later, sourced from Sam's Claude and Gemini history from this year plus his own ideas. The build delivers the platform, the migrated content and the authoring skills ready for that series.

- **Launch & cutover**: target **November 2026**, launching *with* the new content (not migration-only). The new repo deploys to a separate Netlify site on `*.netlify.app`; CI proves legacy URLs, media paths and headers; Sam reviews on desktop and phone; then the custom domains move from the old Netlify site to the new one. Rollback means moving the domains back. The old site is kept for about 30 days. Afterwards: submit the sitemap and watch the Search Console and GoatCounter 404s.

## Open branches

None blocking. Items for build time:
- Prototype review: View Transitions + blur-to-sharp hero (show Sam before committing)
- Bluesky handle (optionally `@sammullins.co.uk` via `/.well-known/atproto-did`); GoatCounter site code; confirm LinkedIn stays
- Verify the Agent Skills folder location that both Claude Code and other agents discover
- Pull @sam_mullins YouTube transcripts for the voice guide

## Transcript

### Q: Who is the site for from 2027, and what should they do?
Recommended: clients/hiring managers needing applied AI engineering; CTA "talk to me".
Answer: Overridden. Audience is developers/AI enthusiasts; the site demonstrates thoughts and skills, not a CV. Competence is visible to employers but not pitched.

### Q: What is the primary content and cadence?
Recommended: lab notebook (notes + builds) with /now and /setup pages; CV moved to the footer.
Answer: Keep the structure similar to now. Home signposts builds + clients; notes go in Articles or an even smaller feed.

### Q: What happens to the old Umbraco/xStatic content?
Recommended: keep it all at the same URLs, labelled legacy, lower down the software page; merge the duplicate article.
Answer: Keep the articles, but put the dated ones in an Archive section. (Default: URLs unchanged, archived flag + /archive/ index.)

### Q: Where does photography fit?
Recommended: keep it top-level as character; same URLs, new gallery block.
Answer: It can go, or stay much more hidden. Decided: stays at its URLs, out of the nav, linked from the Archive/footer.

### Q: Astro vs Hugo?
Recommended: Astro with a hardened dependency setup.
Answer: Astro.

### Q: Public or private repo, and where does media live?
Recommended: public repo; 208 originals in plain git; Astro generates sizes; old paths get 301s.
Answer: Public is OK, but repo quality must be top-notch. Use modern formats to save space, so masters are stored as AVIF and the output is AVIF + WebP.

### Q: What does a top-notch repo mean?
Recommended: full CI gate set, security tooling, governance, docs; MIT code + CC BY content.
Answer: Very close. Use AGENTS.md-style neutral standards instead of Claude equivalents wherever possible. All content is mine (all rights reserved), not open source.

### Q: Analytics?
Recommended: Netlify Analytics (server-side). Rejected: must be free.
Then recommended: GoatCounter (self-hosted script) + Search Console. Explained what GA4 loses vs costs.
Answer: Go with GoatCounter (+ Search Console).

### Q: Contact method and profiles?
Recommended: no form; domain email; GitHub/LinkedIn/one social; rel=me; feeds.
Answer: Remove gmail; use hello@sammullins.co.uk via Cloudflare Email Routing or Netlify. Social + rel=me yes. Feeds not a priority.

### Q: Move DNS to Cloudflare for email routing, or Netlify DNS + ImprovMX?
Recommended: move DNS to Cloudflare, keep Netlify hosting.
Answer: Defer email entirely; social links only for now.

### Q: Which profiles in the footer?
Recommended: GitHub, LinkedIn, one active social; drop X if dormant.
Answer: Keep X; also Bluesky and GitHub. (LinkedIn assumed kept.)

### Q: Block catalogue v1 + micro-feed?
Recommended: 15 consolidated blocks; notes as an Articles subtype.
Answer: Accepted.

### Q: Visual direction & accessibility?
Recommended: evolve; heavier sentence-case headings; left-aligned body; self-host fonts; WCAG 2.2 AA.
Answer: Mostly yes, but keep the thin text as close as possible, and allow small amounts of centred text in symmetrical centred sections.

### Q: Which delight ideas for v1?
Recommended: agent view, terminal, colophon, signature draw, view transitions.
Answer: Agent view yes; terminal no; colophon with date + Sam / Sam+AI content-authorship icons; console secret code yes; signature + hover yes; view transitions and blur hero open, need to see; Konami no.

### Q: AI merge rights + voice source?
Recommended: always Sam merges; extract voice from the old articles.
Answer: Sam always merges (or explicitly allows a model in the moment); nothing automatic. Voice comes from the existing articles plus the @sam_mullins YouTube videos.

### Q: Where does the new 2027 content come from?
Recommended: content interview after the skeleton; 3 launch pieces; don't launch with only legacy content.
Answer: Another day. Sam will mine his Claude/Gemini history and add his own ideas; a full content series follows the initial build.

### Q: Launch criteria, cutover and date?
Recommended: launch at migration parity with lightly refreshed copy; separate Netlify site, then a domain swap.
Answer: Launch with new content at some point in November 2026. Cutover plan accepted by default.
