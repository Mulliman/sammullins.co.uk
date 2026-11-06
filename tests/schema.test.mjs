// Ticket 101: the content schema rejects bad pages, and the error names the file and the field.
// Each case writes a throwaway page into src/content/pages and runs `astro sync`, which validates
// every entry against src/content.config.ts. The fixture is always removed, and a final clean sync
// leaves the content cache as it was.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './helpers.mjs';

const FIXTURE = join(ROOT, 'src', 'content', 'pages', 'zz-schema-test.md');
const IMAGE = '../../assets/media/03yabpct/xstatic-packages.avif';

const page = ({ authorship = 'authorship: sam', block = "  - type: intro\n    heading: 'Hello'" } = {}) =>
  `---\ntitle: 'Schema test'\ndescription: 'A throwaway page for the schema tests.'\n${authorship}\nblocks:\n${block}\n---\n`;

function sync(content) {
  if (content === undefined) rmSync(FIXTURE, { force: true });
  else writeFileSync(FIXTURE, content);
  const r = spawnSync('pnpm', ['exec', 'astro', 'sync'], { cwd: ROOT, encoding: 'utf8', shell: true });
  return { ok: r.status === 0, out: `${r.stdout}\n${r.stderr}` };
}

after(() => {
  rmSync(FIXTURE, { force: true });
  sync(undefined);
});

test('a valid page passes', () => {
  const r = sync(page());
  assert.ok(r.ok, r.out);
});

test('an unknown block type fails, naming the file', () => {
  const r = sync(page({ block: '  - type: nonsense' }));
  assert.ok(!r.ok, 'expected the sync to fail');
  assert.match(r.out, /zz-schema-test\.md/);
});

test('an image without alt text fails, naming the field', () => {
  const r = sync(page({ block: `  - type: image\n    image:\n      src: '${IMAGE}'\n      alt: ''` }));
  assert.ok(!r.ok, 'expected the sync to fail');
  assert.match(r.out, /zz-schema-test\.md/);
  assert.match(r.out, /blocks\.0\.image\.alt/);
});

test('a page without authorship fails, naming the field', () => {
  const r = sync(page({ authorship: '' }));
  assert.ok(!r.ok, 'expected the sync to fail');
  assert.match(r.out, /zz-schema-test\.md/);
  assert.match(r.out, /authorship/);
});
