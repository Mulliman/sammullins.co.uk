// Merge policy tiers (ticket 807). See scripts/merge-policy.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classify, approved } from '../scripts/merge-policy.mjs';

const tier = (files, extra = {}) => classify({ files, ...extra }).tier;

test('tickets and docs are tier 0', () => {
  assert.equal(tier(['_tasks/807-merge-tiers.md', '_docs/media.md', 'README.md']), 0);
  assert.equal(tier(['.github/PULL_REQUEST_TEMPLATE.md']), 0);
});

test('legacy docs, the decisions record and the voice guide are not bookkeeping', () => {
  assert.equal(tier(['_docs/legacy/old.md']), 1);
  assert.equal(tier(['_docs/decisions.md']), 2);
  assert.equal(tier(['_docs/voice.md']), 2);
});

test('code is tier 1', () => {
  assert.equal(tier(['src/blocks/Hero.astro', 'src/styles/global.css', 'tests/schema.test.mjs']), 1);
  assert.equal(tier(['scripts/tasks/status.mjs', '.agents/skills/pm-pass/SKILL.md']), 1);
  assert.equal(tier(['src/content/style-guide/components.yaml']), 1);
});

test('content, URLs, hosting, CI, dependencies and agent rules are tier 2', () => {
  for (const f of [
    'src/content/articles/x.md',
    'src/data/redirects.json',
    'src/data/site.yaml',
    'netlify.toml',
    'netlify/plugins/astro-image-cache/index.js',
    'integrations/noindex-until-live.mjs',
    '.github/workflows/ci.yml',
    '.github/actions/setup-lychee/action.yml',
    'package.json',
    'pnpm-lock.yaml',
    'pnpm-workspace.yaml',
    'renovate.json',
    'AGENTS.md',
    'CLAUDE.md',
    '.claude/settings.json',
    'scripts/merge-policy.mjs',
    'tests/merge-policy.test.mjs',
    'SECURITY.md',
  ]) {
    assert.equal(tier([f]), 2, f);
  }
});

test('one tier 2 file makes the whole change tier 2, with a reason per file', () => {
  const r = classify({ files: ['src/blocks/Hero.astro', 'src/content/pages/index.md', 'netlify.toml'] });
  assert.equal(r.tier, 2);
  assert.equal(r.reasons.length, 2);
});

test('Renovate: non-major is tier 0, major is tier 2', () => {
  const files = ['package.json', 'pnpm-lock.yaml'];
  assert.equal(tier(files, { author: 'renovate[bot]' }), 0);
  assert.equal(tier(files, { author: 'renovate[bot]', labels: ['dependencies', 'major'] }), 2);
  assert.equal(tier(files, { author: 'Mulliman' }), 2);
});

test('an empty change is tier 1, never auto-merged as docs', () => {
  assert.equal(tier([]), 1);
});

test('approval: the right person, after the latest push', () => {
  const base = { approvers: ['Mulliman'], headPushedAt: '2026-11-16T10:00:00Z' };
  assert.equal(approved({ ...base, labeledBy: 'Mulliman', labeledAt: '2026-11-16T10:05:00Z' }), true);
  assert.equal(approved({ ...base, labeledBy: 'Mulliman', labeledAt: '2026-11-16T09:59:00Z' }), false);
  assert.equal(approved({ ...base, labeledBy: 'some-bot', labeledAt: '2026-11-16T10:05:00Z' }), false);
  assert.equal(approved({ ...base, labeledBy: undefined, labeledAt: undefined }), false);
});
