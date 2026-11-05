/**
 * Last-changed dates from git (ticket 902). Computed once per build.
 * Falls back gracefully when git history is unavailable (e.g. a shallow clone).
 */
import { execFileSync } from 'node:child_process';

let cache: Map<string, Date> | undefined;

function load(): Map<string, Date> {
  const map = new Map<string, Date>();
  try {
    // One git call for the whole repo: newest commit date per file under src/content.
    const out = execFileSync(
      'git',
      ['log', '--format=@@%cI', '--name-only', '--no-renames', '--', 'src/content'],
      { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
    );
    let current: Date | undefined;
    for (const line of out.split('\n')) {
      if (line.startsWith('@@')) current = new Date(line.slice(2));
      else if (line.trim() && current && !map.has(line.trim())) map.set(line.trim().replace(/\\/g, '/'), current);
    }
  } catch {
    // No git available: colophon falls back to front matter dates.
  }
  return map;
}

export function lastChanged(filePath: string | undefined): Date | undefined {
  if (!filePath) return undefined;
  cache ??= load();
  return cache.get(filePath.replace(/\\/g, '/').replace(/^\.\//, ''));
}
