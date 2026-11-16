#!/usr/bin/env node
// Changelog from PR titles (ticket 807). PR titles are Conventional Commits (CI enforces it), so the
// Unreleased section of CHANGELOG.md is generated from what merged to main instead of written by hand.
//
//   pnpm changelog            # print the generated Unreleased section
//   pnpm changelog --write    # replace the generated block in CHANGELOG.md
//   pnpm changelog --base main
//
// The block sits between <!-- changelog:start since=SHA --> and <!-- changelog:end -->. Only merges
// after SHA are read; everything older is the hand-written history below the block.
// Dependency bumps, ticket bookkeeping, docs and tests are left out: they aren't news to a reader.

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const GROUPS = [
  ['Added', ['feat']],
  ['Changed', ['perf', 'refactor', 'style', 'content', 'build', 'ci']],
  ['Fixed', ['fix']],
  ['Removed', ['revert']],
];
const TITLE = /^(\w+)(?:\(([^)]+)\))?(!)?: (.+)$/;

/**
 * One merge on main → its PR title and number. Handles squash merges ("title (#12)") and GitHub merge
 * commits ("Merge pull request #12 from …" with the title as the first body line).
 * @param {{ subject: string, body: string }} c
 */
export function prTitle({ subject, body }) {
  const merge = subject.match(/^Merge pull request #(\d+) from /);
  if (merge) {
    const title = body
      .split('\n')
      .map((l) => l.trim())
      .find(Boolean);
    return title ? { title, pr: Number(merge[1]) } : null;
  }
  const squash = subject.match(/^(.*) \(#(\d+)\)$/);
  return squash ? { title: squash[1], pr: Number(squash[2]) } : null;
}

/** @param {{ title: string, pr: number }[]} entries */
export function render(entries) {
  const out = [];
  for (const [heading, types] of GROUPS) {
    const lines = entries
      .map((e) => ({ ...e, m: e.title.match(TITLE) }))
      // Renovate titles its bumps fix(deps) or chore(deps): never news.
      .filter(({ m }) => m && types.includes(m[1]) && m[2] !== 'deps')
      .map(({ m, pr }) => {
        const text = m[4].charAt(0).toUpperCase() + m[4].slice(1).replace(/\.$/, '');
        return `- ${m[3] ? '**Breaking:** ' : ''}${text} (#${pr}).`;
      });
    if (lines.length) out.push(`### ${heading}`, '', ...lines, '');
  }
  return out.length ? out.join('\n') : '_Nothing yet._\n';
}

const START = /<!-- changelog:start since=([0-9a-f]+) -->[\s\S]*?<!-- changelog:end -->/;

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const FILE = join(REPO, 'CHANGELOG.md');
  const args = process.argv.slice(2);
  const base = args.includes('--base') ? args[args.indexOf('--base') + 1] : 'origin/main';
  const text = readFileSync(FILE, 'utf8');
  const block = text.match(START);
  if (!block) {
    console.error('CHANGELOG.md has no <!-- changelog:start since=SHA --> … <!-- changelog:end --> block.');
    process.exit(1);
  }
  const since = block[1];
  const SEP = '\u001e';
  const log = execFileSync('git', ['log', '--first-parent', `--format=%s%x1f%b${SEP}`, `${since}..${base}`], {
    cwd: REPO,
    encoding: 'utf8',
  });
  const entries = log
    .split(SEP)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const [subject, body = ''] = s.split('\u001f');
      return prTitle({ subject, body });
    })
    .filter(Boolean)
    .reverse();
  const generated = `<!-- changelog:start since=${since} -->\n\n${render(entries)}\n<!-- changelog:end -->`;
  if (args.includes('--write')) {
    writeFileSync(FILE, text.replace(START, generated));
    console.log(`CHANGELOG.md: ${entries.length} merges read since ${since.slice(0, 7)}.`);
  } else {
    console.log(generated);
  }
}
