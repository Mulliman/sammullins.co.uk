---
id: "701"
title: Netlify site & config (static only)
epic: Hosting & security
status: todo
priority: p0
size: S
owner: pair
depends_on: ["002"]
---

## Why

Keep Netlify, with the smallest possible surface: static files plus headers (decisions: *Framework (final)*; audit §3).

## Scope

- **Sam:** create a **new** Netlify site linked to the GitHub repo. The old site stays live and untouched until cutover (1204).
- `netlify.toml`:
  - build command and publish `dist`
  - Node version pinned
  - pnpm via corepack
  - `[build.processing]` off (Astro handles it)
- Disable everything unused: Functions, Forms, Identity, Large Media, split testing, analytics injection, snippet injection.
- Deploy previews: PRs only, and **not for PRs from forks**.
- Branch deploys off except `main`.
- Choose a build approach and document it:
  - **(a)** Netlify builds from the repo, or
  - **(b)** GitHub Actions builds and deploys with `netlify deploy`, using a scoped token held in Actions secrets.
  - Default to (a) for simplicity. Revisit if supply-chain posture needs builds isolated to GitHub runners.

## Acceptance criteria

- [ ] A PR produces a deploy preview URL.
- [ ] The Netlify UI shows no functions, forms or identity.
- [ ] `netlify.toml` is the only source of build config (UI fields empty).
