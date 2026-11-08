# Backlog, in order (7 November 2026)

What's left between today and launch, in the order to do it. It replaces the "Suggested order" in [README.md](README.md) now that the build is merged and the design audit (`design-audit-2026-11/`, outside the repo) is done.

**Who:** *agent* means an agent can do it alone and open a PR. *pair* means an agent does the work, but Sam makes a decision or supplies something. *Sam* means only Sam can do it (accounts, DNS, approvals, real-world content).

## Where things stand

**8 November 2026.** Sam signed off 904 (the signature feel), 505 (the drafted alts, guesses included, no corrections) and 1306 (the page structures), so all three are `done`.

**7 November 2026, evening (PM pass).** PRs #1 to #13 are merged and none are open; every branch is on `main`. The Netlify site exists (`sammullinscouk.netlify.app`, noindexed until cutover), so the checks that waited on a deploy preview could finally be run:

- **Closed:** 603 (the 404 page serves status 404) and 702 (A+ on securityheaders.com and the Mozilla Observatory, and hotlinked `/media` sends `CORP: cross-origin`).
- **Ticked, with what's left:** 701 (previews work; Sam checks the Netlify UI), 806 (the Playwright cache hits; the Netlify cache log needs Sam's login), 904 (CLS 0; Sam approves the feel) and 705 (actions SHA-pinned, nothing auto-merges; Scorecard is 6.7 against a target of 8, and Renovate has never opened a PR).
- **Now agent work:** 805 (the post-deploy header check is unblocked, so it moves to `ready`), plus 310, 311 and 315, whose dependencies are done.
- **Bug found:** the weekly external link report (803) labels its issue `link-check`, which doesn't exist, so its first run (Monday 9 November) would fail.
- 1101: the community-profile criterion no longer applies (CONTRIBUTING and CODE_OF_CONDUCT were dropped on purpose). The MIT detection still needs a decision.
- The 508 copy is on `main` and live on the preview, including the `[the tools I use]` placeholder in the home intro.

The notes below are from earlier on 7 November and are kept for the record.

- The whole rebuild (tickets 002 to 1101) is merged into `main`, and so is the typography refresh (204).
- On 6 November every merged ticket was checked against its acceptance criteria. 31 are now `done`, each with a "Verification" note giving the evidence. The 12 still in `review` say what's left, which falls into three kinds:
  - **Agent work:** community profile files (1101) and skill dry runs (1002, 1003).
  - **Needs a deploy preview (701):** 603, 702, 803 and 904.
  - **Sam decides:** site-wide scripts against "zero JS" (003), an image spot check (401), generic photo alt text (505), and archived docs listed under their product (507).
- Repo governance (001) is closed. Sam dropped the auto-merge, squash-only, signed-commit and gmail-in-history criteria; the PR requirement and secret scanning are on. Design tokens (201) is closed: every criterion was already met.
- **Merged on 7 November.** PR #6 brought the style guide (1301 to 1307), colour tokens (207), the article template (313), CI checks (804, 805), the copy draft (508), the PM pass and its blocks (1004, 1005) and the spacing scale (205) into `main`; PR #7 added the type and spacing tuning (208). The header and footer (206) and the code of conduct and templates (1101) follow in their own PRs.

## 1. Now (agents can do these without waiting)

| # | Ticket | Who | Status (7 Nov, morning) |
|---|---|---|---|
| 1 | **Agent leftovers** from the verification above (1101, 1002, 1003) | agent | **1101 done on its branch** (community files). The skill dry runs (1002, 1003) are not started. |
| 2 | [508](508-copy-refresh.md) Copy refresh: remove the false "built with xStatic" line; draft the bio, footer and CV summary with [placeholders] | pair | **Drafted.** Sam reviews the wording and fills `[the tools I use]`. |
| 3 | [805](805-ci-html-headers.md) Finish HTML validation and the hygiene tests | agent | **In review.** html-validate, rule self-tests and an EXIF check are in; the preview header check waits for 701. |
| 4 | [804](804-ci-lighthouse.md) Lighthouse budgets in CI | agent | **In review.** The CI job and budgets are in; the first CI run confirms the Performance score. |
| 5 | [313](313-article-template.md) Article template | agent | **In review.** Header, contents list, series parts and code-block headers are in. Left: whether to highlight the current section (needs a small script; Sam decides). |

## 2. Design (each starts with one decision from Sam)

| # | Ticket | Who | Sam decides |
|---|---|---|---|
| 6 | [207](207-colour-tokens.md) Colours centralised in a theme, literals banned, page themes (christmas) | agent | **In review.** Original colours kept, as decided. |
| 6a | [205](205-colour-surfaces.md) Spacing scale and section rhythm | agent | **In review.** Whether the extra space on wide screens is right (pages are 4% to 11% taller at 1280px). |
| 7 | [310](310-hero-portrait.md) Hero: "live portrait" | pair | Approve option A; shoot a new photo or 6 to 8 second clip (shot list in the audit). |
| 8 | [312](312-home-sections.md) Home: builds grid, writing list and photo strip | agent | Which builds to feature. |
| 9 | [311](311-logowall-strip.md) Logo wall strip | agent | Nothing (the full client names are already fixed). |
| 10 | [206](206-header-footer.md) Header and footer | agent | **In review.** Whether the footer wants a real sign-off sentence (it uses the name and tagline for now). |
| 11 | [314](314-cv-template.md) CV: newest first | pair | Approve the wording. |
| 12 | [315](315-index-pages.md) Articles and Software index pages | agent | Nothing. |
| 13 | [905](905-prototypes-motion.md) View Transitions and blur-to-sharp | pair | Ship or drop each. The audit recommends shipping View Transitions and dropping blur-to-sharp, which 310 replaces. |

## 2b. Style guide (unlisted, agents can do it alone)

A living style guide at `/style-guide/`, never linked from the site, modelled on the Surrounded by Stories guide (`code/apps/guide`). It renders from the real tokens, schema and blocks, so it can't drift, and becomes the regression target for every theme.

| # | Ticket | Who | Notes |
|---|---|---|---|
| 13a | [1301](1301-style-guide-shell.md) Shell, unlisted section, navigation | agent | First. Needs 207. |
| 13b | [1302](1302-style-guide-foundations.md) Foundations from the tokens | agent | 1302 to 1305 can run in parallel. |
| 13c | [1303](1303-style-guide-themes.md) Themes: light, dark and page themes | agent | Check the advent calendar theme here. |
| 13d | [1304](1304-style-guide-components.md) Every block and variant, with YAML | agent | Replaces the `blocks-demo` pages (with redirects). |
| 13e | [1305](1305-style-guide-elements.md) Generic styles and elements | agent | |
| 13f | [1306](1306-style-guide-page-structures.md) Example page structures | pair | **Done** (8 Nov). Sam approved the structures. |
| 13g | [1307](1307-style-guide-ci.md) Visual regression in CI | agent | **Deferred** until the redesign settles. Kept: page-theme axe test and `pnpm compare`. |

## 3. Accounts and infrastructure (Sam, any time before step 5)

| # | Ticket | Who | What |
|---|---|---|---|
| 14 | [001](001-repo-governance.md) Repo governance | Sam | **Done** (6 Nov). Sam dropped signed commits, squash-only, auto-merge off and the gmail history check. |
| 15 | [701](701-netlify-config.md) Netlify site | pair | Create the site so PRs get deploy previews. This unblocks the header checks in 702 and 805. |
| 16 | [703](703-goatcounter.md) GoatCounter | pair | Create the account and code. |
| 17 | [704](704-search-console.md) Search Console | Sam | Verify by DNS; save a baseline export. |
| 18 | [705](705-supply-chain.md) Supply chain | agent | Scorecard ≥ 8 and the Renovate checks, once the repo settings are final. |

## 4. Content (Sam)

| # | Ticket | Who | What |
|---|---|---|---|
| 19 | [1001](1001-voice-guide.md) Voice guide sign-off | Sam | Read `_docs/voice.md`; judge one AI-drafted paragraph. |
| 20 | [1201](1201-launch-content-gate.md) Launch content gate | Sam | The new content series. Without it the site still looks inactive (newest article: December 2022). |

## 5. Launch

| # | Ticket | Who |
|---|---|---|
| 21 | [1203](1203-prelaunch-review.md) Pre-launch review on the preview | Sam |
| 22 | [1204](1204-cutover.md) Domain cutover | pair |
| 23 | [1202](1202-bluesky-domain-handle.md) Bluesky handle (p2) | pair |
| 24 | [1205](1205-decommission.md) Decommission the old site, 30 days after launch (p2) | Sam |

## Critical path

**701** (previews) and **1201** (content) gate launch, and only Sam can unblock them. Everything in sections 1 and 2 can run in parallel with them.
