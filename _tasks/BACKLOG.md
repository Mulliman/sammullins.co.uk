# Backlog, in order (6 November 2026)

What's left between today and launch, in the order to do it. It replaces the "Suggested order" in [README.md](README.md) now that the build is merged and the design audit (`design-audit-2026-11/`, outside the repo) is done.

**Who:** *agent* means an agent can do it alone and open a PR. *pair* means an agent does the work, but Sam makes a decision or supplies something. *Sam* means only Sam can do it (accounts, DNS, approvals, real-world content).

## Where things stand

- The whole rebuild (tickets 002 to 1101) is merged into `main`, and so is the typography refresh (204).
- On 6 November every merged ticket was checked against its acceptance criteria. 31 are now `done`, each with a "Verification" note giving the evidence. The 12 still in `review` say what's left, which falls into three kinds:
  - **Agent work:** community profile files (1101) and skill dry runs (1002, 1003).
  - **Needs a deploy preview (701):** 603, 702, 803 and 904.
  - **Sam decides:** site-wide scripts against "zero JS" (003), an image spot check (401), generic photo alt text (505), and archived docs listed under their product (507).
- Auto-merge is now on in the repo settings. Ticket 001 says it should be off, so 001 needs updating (or the setting reverting).

## 1. Now (agents can do these without waiting)

| # | Ticket | Who | Why now |
|---|---|---|---|
| 1 | **Agent leftovers** from the verification above (1101, 1002, 1003) | agent | Small, and closes three tickets. |
| 2 | [508](508-copy-refresh.md) Copy refresh: remove the false "built with xStatic" line; draft the bio, footer and CV summary with [placeholders] | pair | It's the only thing on the site that is wrong rather than dated. The draft needs Sam's facts. |
| 3 | [805](805-ci-html-headers.md) Finish HTML validation and the hygiene tests | agent | A launch gate, with no decisions needed. |
| 4 | [804](804-ci-lighthouse.md) Lighthouse budgets in CI | agent | Locks in the performance before the redesign adds weight. |
| 5 | [313](313-article-template.md) Article template | agent | Builds on the new type. Needs no palette choice, so it can go ahead of 205. |

## 2. Design (each starts with one decision from Sam)

| # | Ticket | Who | Sam decides |
|---|---|---|---|
| 6 | [205](205-colour-surfaces.md) Colour, surfaces and spacing | pair | Which of two or three palettes. |
| 7 | [310](310-hero-portrait.md) Hero: "live portrait" | pair | Approve option A; shoot a new photo or 6 to 8 second clip (shot list in the audit). |
| 8 | [312](312-home-sections.md) Home: builds grid, writing list and photo strip | agent | Which builds to feature. |
| 9 | [311](311-logowall-strip.md) Logo wall strip | agent | Nothing (the full client names are already fixed). |
| 10 | [206](206-header-footer.md) Header and footer | agent | Nothing. |
| 11 | [314](314-cv-template.md) CV: newest first | pair | Approve the wording. |
| 12 | [315](315-index-pages.md) Articles and Software index pages | agent | Nothing. |
| 13 | [905](905-prototypes-motion.md) View Transitions and blur-to-sharp | pair | Ship or drop each. The audit recommends shipping View Transitions and dropping blur-to-sharp, which 310 replaces. |

## 3. Accounts and infrastructure (Sam, any time before step 5)

| # | Ticket | Who | What |
|---|---|---|---|
| 14 | [001](001-repo-governance.md) Repo governance | Sam | Signed commits, secret scanning, the gmail check, and the auto-merge decision. |
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
