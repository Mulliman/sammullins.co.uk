// Docs drift (ticket 807). Agents treat AGENTS.md and the decisions record as true, so the facts they
// state about the code (framework version, block types, direct dependencies, the check command) are
// tested against the code. History in the decisions transcript (## Transcript) is left alone.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './helpers.mjs';

const read = (f) => readFileSync(join(ROOT, f), 'utf8');
const pkg = JSON.parse(read('package.json'));
const astroMajor = pkg.dependencies.astro.match(/\d+/)[0];
const blocks = [...read('src/content.config.ts').matchAll(/^\s+type: z\.literal\('(\w+)'\)/gm)].map((m) => m[1]);
const decisions = read('_docs/decisions.md').split(/^## Transcript/m)[0];
const agents = read('AGENTS.md');

test('Astro version named in the agent docs and the decisions record matches package.json', () => {
  for (const [file, text] of [
    ['AGENTS.md', agents],
    ['ARCHITECTURE.md', read('ARCHITECTURE.md')],
    ['_docs/decisions.md (summary)', decisions.split(/^## Resolved/m)[0]],
  ]) {
    for (const [, n] of text.matchAll(/\bAstro (\d+)\b(?![^(]*since upgraded)/g)) {
      assert.equal(n, astroMajor, `${file} says Astro ${n}; package.json has Astro ${astroMajor}`);
    }
  }
});

test('the block count in the decisions summary matches the schema', () => {
  const m = decisions.match(/validated by Zod \((\d+) blocks\)/);
  assert.ok(m, 'the summary should say "validated by Zod (N blocks)"');
  assert.equal(Number(m[1]), blocks.length, `summary says ${m[1]} blocks; the schema has ${blocks.length}`);
});

test('AGENTS.md lists exactly the block types in the schema', () => {
  const line = agents.match(/^Block types: (.+)$/m);
  assert.ok(line, 'AGENTS.md should have a "Block types:" line');
  // The list is the first sentence; later sentences mention some blocks again.
  const listed = [...line[1].split('. ')[0].matchAll(/`(\w+)`/g)].map((m) => m[1]);
  assert.deepEqual([...listed].sort(), [...blocks].sort());
});

test('the decisions record names every direct dependency', () => {
  const line = decisions.match(/Direct dependencies are (.+?) only\./);
  assert.ok(line, 'the Framework decision should say "Direct dependencies are … only."');
  for (const dep of Object.keys(pkg.dependencies)) {
    assert.ok(line[1].includes(dep), `${dep} is a direct dependency but the decisions record doesn't name it`);
  }
});

test('docs describe pnpm check as the command it runs', () => {
  const runsAstroCheck = /\bastro check\b/.test(pkg.scripts.check);
  for (const f of ['AGENTS.md', 'README.md']) {
    const says = /`pnpm check`[^\n]*`astro check`/.test(read(f));
    assert.equal(says, runsAstroCheck, `${f} describes pnpm check wrongly (it runs: ${pkg.scripts.check})`);
  }
});
