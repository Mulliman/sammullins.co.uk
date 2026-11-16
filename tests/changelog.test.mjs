// Changelog from PR titles (ticket 807). See scripts/changelog.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { prTitle, render } from '../scripts/changelog.mjs';

test('reads the PR title from merge commits and squash merges', () => {
  assert.deepEqual(
    prTitle({
      subject: 'Merge pull request #21 from Mulliman/703-goatcounter',
      body: '\nfeat(analytics): self-hosted GoatCounter\n',
    }),
    { title: 'feat(analytics): self-hosted GoatCounter', pr: 21 },
  );
  assert.deepEqual(prTitle({ subject: 'fix(blocks): hero animations run (#32)', body: '' }), {
    title: 'fix(blocks): hero animations run',
    pr: 32,
  });
  assert.equal(prTitle({ subject: 'a direct commit', body: '' }), null);
});

test('groups reader-facing changes and leaves out bookkeeping and dependency bumps', () => {
  const md = render([
    { title: 'feat(blocks): add hero', pr: 1 },
    { title: 'fix: footer cards wrap', pr: 2 },
    { title: 'content: new note on local models', pr: 3 },
    { title: 'chore(deps): update astro', pr: 4 },
    { title: 'fix(deps): update non-major dependencies', pr: 8 },
    { title: 'docs(tasks): close 803', pr: 5 },
    { title: 'test: more schema cases', pr: 6 },
    { title: 'feat!: drop the old URLs', pr: 7 },
  ]);
  assert.match(md, /### Added\n\n- Add hero \(#1\)\.\n- \*\*Breaking:\*\* Drop the old URLs \(#7\)\./);
  assert.match(md, /### Changed\n\n- New note on local models \(#3\)\./);
  assert.match(md, /### Fixed\n\n- Footer cards wrap \(#2\)\.\n$/);
  assert.doesNotMatch(md, /astro|close 803|schema cases|non-major/);
});

test('says so when there is nothing to report', () => {
  assert.equal(render([{ title: 'chore(deps): bump', pr: 9 }]), '_Nothing yet._\n');
});
