---
id: "005"
title: Lint, format, editorconfig, PR-title check
epic: Foundation
status: review
priority: p0
size: S
owner: agent
depends_on: ["002"]
---

## Why

Top-notch repo quality (decisions: *Repo quality bar*).

## Scope

- `.editorconfig`, `.gitattributes` (LF, binary for image types).
- Prettier, with `prettier-plugin-astro` (justify in the PR), and ESLint flat config with `eslint-plugin-astro` and an a11y plugin (justify in the PR).
- Conventional Commits: enforced on the **PR title** (squash-merge makes it the commit message) via a tiny CI step or script. Avoid heavyweight commitlint/husky dependency trees.
- No pre-commit hooks that install dependencies; an optional documented `pnpm lint` is enough.

## Acceptance criteria

- [x] `pnpm lint` (ESLint + Prettier) and `pnpm format:check` pass.
- [x] A PR titled `update stuff` fails the title check; `feat(blocks): add hero` passes.
