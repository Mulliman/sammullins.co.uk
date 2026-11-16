#!/usr/bin/env node
// Merge policy (ticket 807): sorts a change into a risk tier, so only the changes that need Sam wait
// for him. The rules are in _docs/decisions.md (AI authoring workflow) and AGENTS.md rule 1.
//
//   Tier 0  bots and bookkeeping: Renovate non-major updates, tickets and docs. Auto-merge on green.
//   Tier 1  code: the agent that opened it may merge once every required check is green.
//   Tier 2  Sam: content, URLs, hosting and security, CI, dependencies, and the rules agents follow.
//           Passes only once Sam adds the `sam-approved` label after the latest push.
//
// Usage:
//   node scripts/merge-policy.mjs                    # this branch against origin/main (local, no gh)
//   node scripts/merge-policy.mjs --base main        # against another base
//   node scripts/merge-policy.mjs --pr 42            # a PR, through gh (files, labels, author, approval)
//   node scripts/merge-policy.mjs --pr 42 --enforce  # exit 1 if it is tier 2 without approval (CI)
//
// CI runs it from the base branch (pull_request_target), never from the PR, so a PR can't loosen the
// policy that judges it: a change to this file is itself tier 2.

import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const APPROVAL_LABEL = 'sam-approved';
export const MAJOR_LABEL = 'major';
const BOTS = new Set(['renovate[bot]', 'app/renovate', 'renovate']);

/** Paths that always need Sam. Each entry: [pattern, reason]. */
export const SAM_PATHS = [
  // The style guide's examples are component demos, not Sam's words.
  [/^src\/content\/(?!style-guide\/)/, 'site content (Sam’s words and name)'],
  [/^src\/data\//, 'nav, socials or redirects (URLs must never break)'],
  [/^(netlify\.toml$|netlify\/)/, 'hosting, headers or CSP'],
  [/^integrations\//, 'build hooks (redirects, noindex until live)'],
  [/^public\/(_headers|_redirects|robots\.txt|\.well-known\/)/, 'headers, redirects or robots'],
  [/^\.github\/(workflows|actions)\//, 'CI or its gates'],
  [/^(package\.json|pnpm-lock\.yaml|pnpm-workspace\.yaml|\.npmrc|\.nvmrc)$/, 'dependencies or toolchain'],
  [/^renovate\.json$/, 'dependency automation'],
  [/^(AGENTS|CLAUDE)\.md$/, 'the rules agents follow'],
  [/^\.claude\/settings(\.local)?\.json$/, 'agent permissions'],
  [/^_docs\/(decisions|voice)\.md$/, 'the decisions record or voice guide'],
  [/^(scripts\/merge-policy\.mjs|tests\/merge-policy\.test\.mjs)$/, 'the merge policy itself'],
  [/^(LICENSE[^/]*|SECURITY\.md)$/, 'licence or security policy'],
];

/** Bookkeeping that can't change the site. Mirrors the docs-only fast path in ci.yml. */
const DOCS =
  /^([^/]+\.md|LICENSE[^/]*|_tasks\/.+|_docs\/.+|\.github\/ISSUE_TEMPLATE\/.+|\.github\/PULL_REQUEST_TEMPLATE\.md)$/;

/**
 * @param {{ files: string[], author?: string, labels?: string[] }} change
 * @returns {{ tier: 0 | 1 | 2, reasons: string[] }}
 */
export function classify({ files, author = '', labels = [] }) {
  if (BOTS.has(author)) {
    return labels.includes(MAJOR_LABEL)
      ? { tier: 2, reasons: ['Renovate major update'] }
      : { tier: 0, reasons: ['Renovate non-major update (7-day release cooldown, full CI)'] };
  }
  const reasons = [];
  for (const f of files) {
    const hit = SAM_PATHS.find(([re]) => re.test(f));
    if (hit) reasons.push(`${f}: ${hit[1]}`);
  }
  if (reasons.length) return { tier: 2, reasons };
  if (files.length && files.every((f) => DOCS.test(f) && !f.startsWith('_docs/legacy/')))
    return { tier: 0, reasons: ['tickets and docs only'] };
  return { tier: 1, reasons: ['code and tooling; required checks are the review'] };
}

/**
 * Sam's approval counts only if it came after the latest push, so a later commit needs a fresh look.
 * @param {{ labeledBy?: string, labeledAt?: string, headPushedAt?: string, approvers: string[] }} a
 */
export function approved({ labeledBy, labeledAt, headPushedAt, approvers }) {
  if (!labeledBy || !approvers.includes(labeledBy)) return false;
  if (!labeledAt || !headPushedAt) return false;
  return new Date(labeledAt) >= new Date(headPushedAt);
}

// --- CLI -----------------------------------------------------------------------------------------

function run(cmd, args) {
  return execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}
const ghJson = (path) => JSON.parse(run('gh', ['api', '--paginate', '--slurp', path])).flat();

function fromPr(pr) {
  const repo =
    process.env.GITHUB_REPOSITORY ?? run('gh', ['repo', 'view', '--json', 'nameWithOwner', '-q', '.nameWithOwner']);
  const meta = JSON.parse(run('gh', ['api', `repos/${repo}/pulls/${pr}`]));
  const files = ghJson(`repos/${repo}/pulls/${pr}/files?per_page=100`).map((f) => f.filename);
  const labels = meta.labels.map((l) => l.name);
  const events = ghJson(`repos/${repo}/issues/${pr}/events?per_page=100`);
  const lastLabel = events.filter((e) => e.event === 'labeled' && e.label?.name === APPROVAL_LABEL).at(-1);
  // The head commit's committer date can predate the push (rebases keep it), so take the later of the
  // committer date and the PR's last "head_ref_force_pushed" / "committed" timeline entry.
  const head = JSON.parse(run('gh', ['api', `repos/${repo}/commits/${meta.head.sha}`]));
  const pushes = events.filter((e) => e.event === 'head_ref_force_pushed').map((e) => e.created_at);
  const headPushedAt = [head.commit.committer.date, ...pushes].sort().at(-1);
  return {
    files,
    author: meta.user.login,
    labels,
    approval: {
      present: labels.includes(APPROVAL_LABEL),
      labeledBy: lastLabel?.actor?.login,
      labeledAt: lastLabel?.created_at,
      headPushedAt,
    },
  };
}

function fromGit(base) {
  const files = run('git', ['diff', '--name-only', `${base}...HEAD`])
    .split('\n')
    .filter(Boolean);
  return { files, author: '', labels: [], approval: null };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const args = process.argv.slice(2);
  const opt = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
  const pr = opt('--pr');
  const enforce = args.includes('--enforce');
  const approvers = (process.env.MERGE_APPROVERS || 'Mulliman').split(',').map((s) => s.trim());

  const change = pr ? fromPr(pr) : fromGit(opt('--base') ?? 'origin/main');
  const { tier, reasons } = classify(change);
  const ok = tier < 2 || Boolean(change.approval?.present && approved({ ...change.approval, approvers }));

  const what = ['Tier 0: auto-merge on green', 'Tier 1: the agent may merge on green', 'Tier 2: Sam merges'][tier];
  const lines = [
    `## Merge policy: ${what}`,
    '',
    ...reasons.slice(0, 30).map((r) => `- ${r}`),
    ...(reasons.length > 30 ? [`- …and ${reasons.length - 30} more`] : []),
    '',
    tier < 2
      ? 'Passes. Merge with `gh pr merge --auto --squash` once the required checks are green.'
      : ok
        ? `Passes: \`${APPROVAL_LABEL}\` was added by ${change.approval.labeledBy} after the latest push.`
        : `Waiting for Sam: he adds the \`${APPROVAL_LABEL}\` label (after the latest push) and merges.`,
  ];
  console.log(lines.join('\n'));
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join('\n') + '\n');
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `tier=${tier}\n`);
  if (enforce && !ok) process.exit(1);
}
