---
id: "805"
title: "CI: HTML validation, header & hygiene checks"
epic: Quality gates
status: review
priority: p0
size: S
owner: agent
depends_on: ["801", "702"]
---

## Why

Valid markup, headers actually present, and no leaked personal data.

## Scope

- HTML validation of `dist/` (`html-validate`, with a config in the repo).
- Header check:
  - the generated `_headers` / `netlify.toml` contains every required header
  - post-deploy, a check against the deploy preview URL asserts that the live response headers match
- Hygiene greps over the repo and `dist/`, each failing the build:
  - no `gmail`
  - no `googletagmanager` or `google-analytics`
  - no `fonts.googleapis`
  - no `set:html` outside an allow-listed sanitised helper
  - no `uk-` classes
  - no image with GPS EXIF

## Acceptance criteria

- [x] Each hygiene rule has a test proving it fails when violated.
- [ ] Preview header assertion passes.

## Progress (6 November 2026)

- `html-validate` 11.17.0 (dev dependency, pinned) runs over `dist/` with `.htmlvalidate.json` (recommended rules; ids may start with a digit, as HTML5 allows; title length and trailing whitespace inside code are off; `role="region"` stays on scrollable code blocks). It found and fixed:
  - two xStatic docs pages where `<Netlify404Action>` and `<add ... />` were raw HTML, which broke each page's structure
  - the lightbox `<img>` had no `src`
  - two unlabelled Series navs on the lists demo page
- The rules moved to `tests/hygiene-rules.mjs`; `tests/hygiene-rules.test.mjs` proves each one fires on a violation and passes clean input, including EXIF and html-validate.
- A new rule fails on EXIF in any image under `src/assets`; it found and stripped a date stamp in `src/assets/demo/logo.jpg`.
- Left: the deploy-preview header assertion, which needs 701.
