// Ticket 803: github.com links are checked through the API, so the URL handling must be right.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { apiPathFor, findLinks } from '../scripts/links/github-links.mjs';

test('finds github.com links and trims trailing punctuation', () => {
  const md = `See [xStatic](https://github.com/Mulliman/xStatic-for-Umbraco). Also https://github.com/Mulliman/sage-of-empires.
  <https://github.com/libgit2/libgit2sharp> and https://www.github.com/dlemstra/Magick.NET, plus https://example.com/x.`;
  assert.deepEqual(findLinks(md), [
    'https://github.com/Mulliman/xStatic-for-Umbraco',
    'https://github.com/Mulliman/sage-of-empires',
    'https://github.com/libgit2/libgit2sharp',
    'https://www.github.com/dlemstra/Magick.NET',
  ]);
});

test('a profile link checks the user', () => {
  assert.equal(apiPathFor('https://github.com/Mulliman'), '/users/Mulliman');
});

test('a repo link checks the repo, keeping dots in the name', () => {
  assert.equal(apiPathFor('https://github.com/dlemstra/Magick.NET'), '/repos/dlemstra/Magick.NET');
  assert.equal(apiPathFor('https://github.com/a/b.git'), '/repos/a/b');
});

test('a file link checks the file at its ref', () => {
  assert.equal(
    apiPathFor('https://github.com/TimGeyssens/UIOMatic/blob/v3/LICENSE.md'),
    '/repos/TimGeyssens/UIOMatic/contents/LICENSE.md?ref=v3',
  );
  assert.equal(
    apiPathFor('https://github.com/o/r/tree/main/src/My%20Folder'),
    '/repos/o/r/contents/src/My%20Folder?ref=main',
  );
});

test('other repo pages check the repo; GitHub pages are skipped', () => {
  assert.equal(apiPathFor('https://github.com/o/r/issues/12'), '/repos/o/r');
  assert.equal(apiPathFor('https://github.com/o/r/releases'), '/repos/o/r');
  assert.equal(apiPathFor('https://github.com/features/actions'), null);
});
