#!/usr/bin/env node
// Checks every github.com link in src/content through the GitHub API (ticket 803).
// lychee can't check them: GitHub answers anonymous requests for profile and file pages with 504,
// so a moved file looks the same as a working one. The API answers 404 for what's really gone.
//
// Usage: GITHUB_TOKEN=... node scripts/links/github-links.mjs [report.md]
// Writes a Markdown section to the report file (default github-links.md) and, on GitHub Actions,
// `broken=<n>` to $GITHUB_OUTPUT. Exits 0 unless the check itself can't run, like the weekly
// report it belongs to: it never blocks anything.

import { appendFileSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(import.meta.url), '..', '..', '..');
const CONTENT = join(ROOT, 'src', 'content');

// Owners that are GitHub's own pages, not users or organisations.
const RESERVED = new Set([
  'about',
  'apps',
  'features',
  'marketplace',
  'orgs',
  'pricing',
  'settings',
  'sponsors',
  'topics',
]);

/** Every https://github.com/... URL in a Markdown string, with trailing punctuation trimmed. */
export function findLinks(markdown) {
  const found = markdown.match(/https?:\/\/(?:www\.)?github\.com\/[^\s)<>"'\]]+/g) ?? [];
  return found.map((url) => url.replace(/[.,;:!?]+$/, ''));
}

/**
 * What to ask the API about a github.com URL, or null when there's nothing to check.
 * Blob and tree links assume a ref without slashes, which is true of every link on the site.
 */
export function apiPathFor(url) {
  const { pathname } = new URL(url);
  const [owner, repo, kind, ref, ...rest] = pathname
    .split('/')
    .filter(Boolean)
    .map((s) => decodeURIComponent(s));
  if (!owner || RESERVED.has(owner.toLowerCase())) return null;
  if (!repo) return `/users/${owner}`;
  const name = repo.replace(/\.git$/, '');
  if ((kind === 'blob' || kind === 'tree') && ref) {
    const path = rest.map(encodeURIComponent).join('/');
    return `/repos/${owner}/${name}/contents/${path}?ref=${encodeURIComponent(ref)}`;
  }
  // Issues, releases, wikis and the like: check the repo is still there.
  return `/repos/${owner}/${name}`;
}

/** Markdown files under a directory, recursively. */
function markdownFiles(dir) {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith('.md'))
    .map((d) => join(d.parentPath ?? d.path, d.name));
}

async function check(apiPath, token) {
  const res = await fetch(`https://api.github.com${apiPath}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'sammullins.co.uk-link-check',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  return res.status;
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('GITHUB_TOKEN is not set.');
    process.exit(2);
  }
  const reportFile = resolve(process.argv[2] ?? 'github-links.md');

  // url -> files that link to it
  const links = new Map();
  for (const file of markdownFiles(CONTENT)) {
    for (const url of findLinks(readFileSync(file, 'utf8'))) {
      const files = links.get(url) ?? new Set();
      files.add(relative(ROOT, file).replaceAll('\\', '/'));
      links.set(url, files);
    }
  }

  const broken = [];
  let checked = 0;
  for (const [url, files] of links) {
    const apiPath = apiPathFor(url);
    if (!apiPath) continue;
    checked++;
    const status = await check(apiPath, token);
    if (status !== 200) broken.push({ url, status, files: [...files] });
  }

  const lines = ['', '## github.com links (checked through the GitHub API)', ''];
  lines.push(`${checked} checked, ${broken.length} broken.`, '');
  for (const b of broken) lines.push(`* [${b.status}] <${b.url}> in ${b.files.join(', ')}`);
  writeFileSync(reportFile, lines.join('\n') + '\n');
  console.log(lines.join('\n'));

  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `broken=${broken.length}\n`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
