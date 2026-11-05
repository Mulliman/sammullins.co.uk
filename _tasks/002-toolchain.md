---
id: "002"
title: Toolchain: Node, pnpm, Astro 6, TypeScript
epic: Foundation
status: review
priority: p0
size: M
owner: agent
depends_on: ["001"]
---

## Why

Astro 6 is the chosen platform with a hardened, minimal dependency set (decisions: *Framework (final)*).

## Scope

- Pin Node LTS in `.nvmrc` and `package.json#engines`; pin pnpm via `packageManager`.
- Scaffold a minimal Astro 6 project at the repo root (no React, no MDX, no UI framework).
- Direct runtime/build deps limited to: `astro`, `sharp`, `@astrojs/sitemap`. Dev deps kept minimal and justified in the PR.
- `pnpm-workspace.yaml` / `.npmrc`:
  - `minimumReleaseAge` = 7 days (10080 minutes)
  - `onlyBuiltDependencies: [sharp]`, so all other install scripts are blocked
  - `save-exact=true`
  - `strict-peer-dependencies=true`
- `tsconfig.json` extends `astro/tsconfigs/strictest`.
- Scripts: `dev`, `build`, `preview`, `check` (astro check + tsc), `lint`, `format`, `test`.

## Acceptance criteria

- [ ] `pnpm install --frozen-lockfile && pnpm build` succeeds on a clean clone.
- [ ] `package.json` direct dependencies match the allow-list exactly; the PR justifies any dev dependency.
- [ ] Installing a package with a postinstall script (other than sharp) does not run it.
- [ ] The lockfile is committed and versions are exact.

## Notes

Check the current pnpm docs for the exact key names of `minimumReleaseAge` and `onlyBuiltDependencies` (pnpm 10+).
