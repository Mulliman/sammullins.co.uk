---
id: "805"
title: "CI: HTML validation, header & hygiene checks"
epic: Quality gates
status: in-progress
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

- [ ] Each hygiene rule has a test proving it fails when violated.
- [ ] Preview header assertion passes.
