# Changelog

Notable changes to the site and this repo, newest first. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). The site isn't versioned, so entries are grouped by the date they merged. Add a line under **Unreleased** in the same PR as the change.

## Unreleased

### Fixed

- The blurred hero's scroll-linked drift, and the blur-to-sharp prototype, now run. The CSS minifier had folded them into a declaration Chrome drops, and the hero's `overflow: hidden` pinned the timeline to the hero. A test now fails the build if a scroll timeline ends up inside the `animation` shorthand (ticket 906).

### Added

- `pnpm verify` runs every local CI gate in CI's order and stops at the first failure (ticket 806).
- A changelog (this file).
- A Netlify build plugin that keeps generated images between deploys, so a deploy isn't a cold 15-minute image build (ticket 806).
- Branch and PR rules for agents in `AGENTS.md`: one ticket per PR cut from `main`, draft PRs early, rebase instead of merge-forward, Conventional Commits titles (ticket 806).
- Netlify builds that aren't production on `www.sammullins.co.uk` (the `*.netlify.app` site before cutover, deploy previews, branch deploys) send `X-Robots-Tag: noindex, nofollow` on every path, so search engines stay off them (ticket 701).

- A glossary of tools and terms at the end of the README.
- GoatCounter analytics: a self-hosted, checksum-pinned `count.js` that counts only on www.sammullins.co.uk, skips Do Not Track and Global Privacy Control, sets no cookies, and records missed paths on the 404 page (ticket 703).

### Changed

- Renovate leaves Node alone: it stays on the 24 line, set by hand, instead of being pinned (ticket 705).
- The weekly external link report checks only outside links, skips sites that refuse automated checkers (LinkedIn, X, npm), checks github.com links through the GitHub API instead, retries timeouts, and closes its issue when every link passes (ticket 803).
- Both link jobs install lychee from a cache, fetched through the GitHub API and checked against its SHA-256, instead of downloading it on every run (ticket 803).
- Docs-only PRs (root Markdown, `_tasks/`, `_docs/` outside `_docs/legacy/`, issue and PR templates) skip the build, accessibility, link and Lighthouse jobs; only Prettier runs.
- CI caches Playwright's Chromium for the accessibility job (ticket 806).
- Netlify unshallows the clone before building, so "last changed" dates are right (ticket 806).

### Removed

- `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md`.

## 7 November 2026

- Code of conduct, issue and PR templates (#9, ticket 1101).
- Compact sticky header with the agent view and an icon theme toggle; one-line footer (#8, ticket 206).
- Even type and spacing across pages; body type survives host resets (#7, ticket 208).
- Fluid spacing scale and section rhythm (#6, ticket 205). The same PR brought in colour tokens and page themes (207), the article template (313), Lighthouse budgets (804), HTML validation (805), the copy refresh (508), the style guide (1301 to 1306), the pm-pass skill (1004) and the desk-page blocks (1005).

## 6 November 2026

- The archive lists entries as thin rows (#5).
- Footer cards go 4, then 2 by 2, then 1, never 3 and 1 (#4).
- Typography refresh with Mona Sans and a fluid scale; no eyebrow labels (#3, ticket 204).
- Code scanning alerts cleared (#2).
- CI caches generated images and allows time for a cold build (#1).
