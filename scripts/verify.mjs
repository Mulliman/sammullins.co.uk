#!/usr/bin/env node
// Runs the CI gates locally, in CI's order, and stops at the first failure (ticket 806).
// Run it before you push. If it passes here, the "Check, test and build" and accessibility jobs
// should pass in CI too.
//
// Usage:
//   pnpm verify            # every local gate, including axe (needs: pnpm exec playwright install chromium)
//   pnpm verify --quick    # skip the axe run (about a minute faster)
//
// Not run here, CI only:
// - Internal links (lychee is a separate binary).
// - Lighthouse budgets (a local Windows run can't judge Performance, see ticket 804).
// - CodeQL, and the PR title check. The title has to follow Conventional Commits, e.g.
//   "feat(blocks): add hero" or "content: new note on local models".

import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const quick = process.argv.includes('--quick');

/** Mirrors .github/workflows/ci.yml. Keep the two in step. */
const steps = [
  ['Types and content', 'pnpm', ['check']],
  ['Lint and format', 'pnpm', ['lint']],
  ['Skills catalogue', 'node', ['scripts/skills/block-catalogue.mjs', '--check']],
  ['.claude skills mirror', 'node', ['scripts/skills/sync.mjs', '--check']],
  ['Build', 'pnpm', ['build']],
  ['Tests', 'pnpm', ['test']],
  ['Dependency audit (high and critical)', 'pnpm', ['audit', '--audit-level', 'high']],
  ...(quick ? [] : [['Accessibility (axe, WCAG 2.2 AA)', 'pnpm', ['test:a11y']]]),
];

const started = Date.now();
for (const [i, [name, cmd, args]] of steps.entries()) {
  const t = Date.now();
  console.log(`\n▶ ${i + 1}/${steps.length} ${name}: ${cmd} ${args.join(' ')}`);
  const r = spawnSync(cmd, args, { cwd: REPO, stdio: 'inherit', shell: process.platform === 'win32' });
  const secs = ((Date.now() - t) / 1000).toFixed(0);
  if (r.status !== 0) {
    console.error(`\n✘ ${name} failed after ${secs}s. Fix it before pushing.`);
    process.exit(r.status ?? 1);
  }
  console.log(`✔ ${name} (${secs}s)`);
}
const total = ((Date.now() - started) / 1000).toFixed(0);
console.log(`\n✔ All ${steps.length} local gates passed in ${total}s${quick ? ' (axe skipped: --quick)' : ''}.`);
console.log('  CI also runs internal links, Lighthouse budgets, CodeQL and the PR title check.');
