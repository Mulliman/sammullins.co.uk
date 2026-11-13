# Tasks

The whole rebuild of sammullins.co.uk, specified as tickets. Decisions behind them are in [`../_docs/decisions.md`](../_docs/decisions.md) and the audit in [`../_docs/audit-2026-11.md`](../_docs/audit-2026-11.md). If a ticket and the decisions record disagree, the decisions record wins: fix the ticket.

## Conventions

- **One file per ticket:** `NNN-short-slug.md`. Numbers are grouped by epic (`0xx` foundation, `1xx` content model, …) and never reused.
- **Front matter** (see [`_template.md`](_template.md)):
  - `status`: `todo` · `ready` (dependencies done) · `in-progress` · `blocked` · `review` (PR open) · `done`
  - `priority`: `p0` launch blocker · `p1` launch nice-to-have · `p2` post-launch
  - `size`: `S` (< 2h) · `M` (half day) · `L` (a day or more; consider splitting)
  - `depends_on`: ticket ids that must be `done` first
  - `owner`: `agent` · `sam` (needs Sam: accounts, DNS, approvals) · `pair`
- **Workflow:** an agent picks a `ready` ticket, works on a branch named `NNN-short-slug`, opens a PR referencing the ticket, and sets `status: review`. **Only Sam merges** (or explicitly tells a model to merge in that moment). The ticket moves to `done` in the same PR.
- **Acceptance criteria are the definition of done.** Each one must be checkable, ideally by CI.
- Tickets can be split, but not silently widened. New scope gets a new ticket.

## Epics

| Range | Epic | Goal |
|---|---|---|
| 0xx | Foundation | Repo, toolchain, governance, agent instructions |
| 1xx | Content model | Collections, Zod schemas, block renderer, routing |
| 2xx | Design system | Tokens, themes, typography, layout shell |
| 3xx | Blocks | The 15 v1 blocks |
| 4xx | Media | AVIF masters, responsive images, legacy media paths |
| 5xx | Migration | Move all 50 legacy pages into the new content model |
| 6xx | URLs & redirects | Zero broken legacy links, proven in CI |
| 7xx | Hosting & security | Netlify, headers/CSP, analytics, supply chain |
| 8xx | Quality gates | CI: types, lint, a11y, links, performance, HTML |
| 9xx | Delight | Agent view, colophon, console secret, signature, prototypes |
| 10xx | AI authoring | Voice guide and Agent Skills |
| 11xx | Docs | README, architecture, licence notices |
| 12xx | Launch | Content gate, review, cutover, decommission |
| 13xx | Style guide | Unlisted living style guide: foundations, themes, components, elements, page structures |

## Ticket index

| ID | Title | Pri | Size | Owner | Depends on |
|---|---|---|---|---|---|
| [001](001-repo-governance.md) | GitHub repo, identity & governance | p0 | M | pair | – |
| [002](002-toolchain.md) | Toolchain: Node, pnpm, Astro 6, TypeScript | p0 | M | agent | 001 |
| [003](003-astro-config.md) | Astro config for static, URL-identical output | p0 | S | agent | 002 |
| [004](004-agent-instructions.md) | AGENTS.md and Agent Skills scaffold | p0 | M | agent | 002 |
| [005](005-lint-format.md) | Lint, format, editorconfig, PR-title check | p0 | S | agent | 002 |
| [101](101-content-collections.md) | Content collections & Zod schemas | p0 | L | agent | 003 |
| [102](102-block-renderer.md) | Block renderer & page routing | p0 | M | agent | 101 |
| [103](103-site-settings.md) | Site settings: nav, socials, footer | p0 | S | agent | 101 |
| [201](201-design-tokens-themes.md) | Design tokens, light/dark themes & toggle | p0 | M | agent | 003 |
| [202](202-typography.md) | Self-hosted typography & thin heading rules | p0 | S | agent | 201 |
| [203](203-layout-shell.md) | Layout shell: header, nav, footer, landmarks | p0 | M | agent | 103, 202 |
| [204](204-typography-refresh.md) | Typography refresh (Mona Sans, fluid scale, no eyebrows) | p0 | M | agent | 202 |
| [205](205-colour-surfaces.md) | Spacing scale and section rhythm | p0 | M | agent | 207 |
| [206](206-header-footer.md) | Header, nav and footer refresh | p1 | M | agent | 205 |
| [207](207-colour-tokens.md) | Centralise colours in a theme, ban literals, add page themes | p0 | M | agent | 204 |
| [209](209-brand-refresh.md) | New logo, masthead header, Figtree + Atkinson Hyperlegible Next | p1 | M | agent | 204, 206, 207 |
| [301](301-block-hero.md) | Block: hero | p0 | M | agent | 102, 402 |
| [302](302-blocks-text.md) | Blocks: intro, prose, callout | p0 | S | agent | 102 |
| [303](303-block-image.md) | Block: image | p0 | S | agent | 402 |
| [304](304-block-gallery.md) | Block: gallery with dialog lightbox | p0 | M | agent | 303 |
| [305](305-blocks-cards-listing.md) | Blocks: cards, listing, nextPrev | p0 | L | agent | 102, 303 |
| [306](306-block-logowall.md) | Block: logoWall | p0 | S | agent | 303 |
| [307](307-blocks-quote-code.md) | Blocks: quote, code | p0 | S | agent | 102 |
| [308](308-blocks-split-timeline.md) | Blocks: split, timeline | p0 | M | agent | 102 |
| [309](309-block-embed.md) | Block: embed (click-to-load facade) | p1 | S | agent | 303 |
| [310](310-hero-portrait.md) | Hero: "live portrait" variant | p0 | M | pair | 205 |
| [311](311-logowall-strip.md) | Logo wall: compact strip with transparent logos | p1 | S | agent | 205 |
| [312](312-home-sections.md) | Home: builds grid, writing list and photo strip | p0 | L | agent | 205, 310 |
| [313](313-article-template.md) | Article template: meta, contents and code blocks | p0 | M | agent | 204 |
| [314](314-cv-template.md) | CV: newest first, compact timeline | p0 | M | pair | 205 |
| [315](315-index-pages.md) | Articles and Software index pages | p1 | M | agent | 313 |
| [401](401-media-conversion.md) | Convert originals to AVIF masters + media map | p0 | M | agent | 002 |
| [402](402-picture-component.md) | Responsive `<Picture>` component | p0 | S | agent | 401 |
| [403](403-legacy-media-paths.md) | Legacy `/media/…` paths resolve | p0 | S | agent | 401, 601 |
| [501](501-migration-tooling.md) | One-shot migration script (xStatic HTML → content) | p0 | L | agent | 101, 401 |
| [502](502-migrate-home-cv.md) | Migrate home & CV | p0 | M | agent | 501, 305, 306, 308 |
| [503](503-migrate-articles.md) | Migrate articles (+ merge duplicate) | p0 | M | agent | 501 |
| [504](504-migrate-software-docs.md) | Migrate software + xStatic/XPEDITE docs | p0 | L | agent | 501, 305 |
| [505](505-migrate-photography.md) | Migrate photography (hidden) | p0 | M | agent | 501, 304 |
| [506](506-migrate-xstatic14.md) | Migrate /xstatic14/ | p0 | S | agent | 501 |
| [507](507-archive-index.md) | Archive index page | p0 | S | agent | 305, 503, 504 |
| [508](508-copy-refresh.md) | Copy refresh: bio, footer, CV summary, software page | p0 | S | pair | – |
| [601](601-redirect-map.md) | Redirect map → Netlify `_redirects` | p0 | S | agent | 003 |
| [602](602-legacy-url-test.md) | CI test: every legacy URL & media path resolves | p0 | M | agent | 601, 801 |
| [603](603-not-found-page.md) | Helpful 404 page | p1 | S | agent | 203 |
| [701](701-netlify-config.md) | Netlify site & config (static only) | p0 | S | pair | 002 |
| [702](702-security-headers-csp.md) | Security headers & strict CSP | p0 | M | agent | 701 |
| [703](703-goatcounter.md) | GoatCounter analytics (self-hosted script) | p1 | S | pair | 702 |
| [704](704-search-console.md) | Google Search Console via DNS | p1 | S | sam | – |
| [705](705-supply-chain.md) | Supply chain hardening | p0 | M | agent | 002, 801 |
| [801](801-ci-core.md) | CI core: check, lint, build | p0 | S | agent | 005 |
| [802](802-ci-accessibility.md) | CI: axe WCAG 2.2 AA on every page | p0 | M | agent | 801 |
| [803](803-ci-links.md) | CI: internal & external link check | p0 | S | agent | 801 |
| [804](804-ci-lighthouse.md) | CI: Lighthouse budgets | p1 | S | agent | 801 |
| [805](805-ci-html-headers.md) | CI: HTML validation & header checks | p0 | S | agent | 801, 702 |
| [806](806-workflow-speed.md) | Faster review loop: local verify, PR rules, Playwright cache, changelog | p1 | S | agent | 801 |
| [901](901-agent-view.md) | Agent view: Markdown twins, llms.txt, toggle | p0 | M | agent | 102 |
| [902](902-colophon.md) | Colophon: last changed + authorship icon | p0 | S | agent | 101 |
| [903](903-console-secret.md) | Console secret | p1 | S | pair | 702 |
| [904](904-signature-animation.md) | Signature draw + hover animation | p1 | M | agent | 203 |
| [905](905-prototypes-motion.md) | Prototypes: View Transitions & blur-to-sharp hero | p1 | M | pair | 301 |
| [1001](1001-voice-guide.md) | Voice guide from articles + YouTube | p0 | M | agent | 503 |
| [1002](1002-skills-authoring.md) | Skills: new-article, new-note, new-page | p0 | M | agent | 004, 1001, 102 |
| [1003](1003-skills-media-redirect.md) | Skills: add-images, redirect | p0 | S | agent | 004, 401, 601 |
| [1101](1101-docs.md) | README, ARCHITECTURE, SECURITY, CONTRIBUTING, licences | p0 | M | agent | 001 |
| [1004](1004-skill-pm-pass.md) | Skill: pm-pass (what needs Sam, as a desk page) | p1 | M | agent | 004 |
| [1005](1005-desk-page-gaps.md) | Blocks the PM desk page needed and the site lacks | p2 | M | agent | 1004 |
| [1201](1201-launch-content-gate.md) | Launch content gate (new content series) | p0 | – | sam | 1002 |
| [1202](1202-bluesky-domain-handle.md) | Bluesky domain handle | p2 | S | pair | 701 |
| [1203](1203-prelaunch-review.md) | Pre-launch review on preview | p0 | S | sam | all p0 |
| [1204](1204-cutover.md) | Domain cutover & post-launch monitoring | p0 | S | pair | 1203 |
| [1205](1205-decommission.md) | Decommission old site & folders | p2 | S | sam | 1204 + 30 days |
| [1301](1301-style-guide-shell.md) | Style guide: unlisted section, shell and navigation | p1 | M | agent | 207 |
| [1302](1302-style-guide-foundations.md) | Style guide: foundations generated from the tokens | p1 | M | agent | 1301 |
| [1303](1303-style-guide-themes.md) | Style guide: themes, light and dark, page themes | p1 | S | agent | 1301, 1302 |
| [1304](1304-style-guide-components.md) | Style guide: every block and every variant, with its YAML | p1 | L | agent | 1301 |
| [1305](1305-style-guide-elements.md) | Style guide: generic styles and HTML elements | p1 | S | agent | 1301 |
| [1306](1306-style-guide-page-structures.md) | Style guide: example page structures | p1 | M | pair | 1301, 1304 |
| [1307](1307-style-guide-ci.md) | Visual regression in CI: revisit once the redesign settles | p2 | M | agent | 205, 206, 310, 312, 314 |

## Suggested order

> The build is merged. For what is left, and in what order, see **[BACKLOG.md](BACKLOG.md)**. The original order is below for history.

1. **Foundation:** 001 → 002 → 003, 004, 005, 801, 701
2. **Model & shell:** 101 → 102, 103 · 201 → 202 → 203 · 401 → 402 · 601
3. **Blocks:** 301–309 (parallelisable)
4. **Migration:** 501 → 502–507 · 602 · 403
5. **Hardening:** 702, 705, 802–805
6. **Delight & authoring:** 901–905 · 1001–1003 · 1101
7. **Launch:** 1201 → 1203 → 1204 → 1205
