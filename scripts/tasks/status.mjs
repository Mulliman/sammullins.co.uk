#!/usr/bin/env node
// Read-only instrument for the PM pass (ticket 1004, skill: .agents/skills/pm-pass).
// Reads every ticket's front matter in _tasks/ and cross-checks it against git and open PRs.
// It never writes anything: the PM proposes, Sam does.
//
// Usage:
//   node scripts/tasks/status.mjs          # Markdown report
//   node scripts/tasks/status.mjs --json   # the same facts as JSON, for agents
//   node scripts/tasks/status.mjs --base origin/main   # compare against another base (default: main)
//   node scripts/tasks/status.mjs --tickets-from style-guide   # read tickets from a branch, not the working tree
//
// Ticket statuses can differ between branches (a PR moves its ticket to done). Read them from the
// branch that carries the newest ticket edits, and say which one you used.
//
// Works offline and without `gh`: PR facts are then reported as unknown, never as "none".

import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const TASKS = join(REPO, '_tasks');
const args = process.argv.slice(2);
const asJson = args.includes('--json');
const baseIdx = args.indexOf('--base');
const BASE = baseIdx >= 0 ? args[baseIdx + 1] : 'main';
const fromIdx = args.indexOf('--tickets-from');
const TICKETS_FROM = fromIdx >= 0 ? args[fromIdx + 1] : null;

// Branches that are never debris and never claim a ticket.
const IGNORED = [/^main$/, /^HEAD/, /^backup\//, /^worktree-agent-/, /^dependabot\//, /^renovate\//];

function git(...a) {
  try {
    return execFileSync('git', a, { cwd: REPO, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

// --- Tickets -------------------------------------------------------------------------------------

function parseFrontMatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([a-z_]+):\s*(.*)$/i);
    if (!kv) continue;
    let v = kv[2].trim();
    if (v.startsWith('[')) {
      try {
        v = JSON.parse(v);
      } catch {
        v = v
          .slice(1, -1)
          .split(',')
          .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
          .filter(Boolean);
      }
    } else {
      v = v.replace(/^['"]|['"]$/g, '').replace(/\\"/g, '"');
    }
    fm[kv[1]] = v;
  }
  return fm;
}

function ticketFiles() {
  if (!TICKETS_FROM) {
    return readdirSync(TASKS).map((name) => ({ name, read: () => readFileSync(join(TASKS, name), 'utf8') }));
  }
  const list = git('ls-tree', '--name-only', `${TICKETS_FROM}:_tasks`);
  if (list === null) {
    console.error(`Cannot read _tasks from "${TICKETS_FROM}".`);
    process.exit(2);
  }
  return list.split('\n').map((name) => ({ name, read: () => git('show', `${TICKETS_FROM}:_tasks/${name}`) ?? '' }));
}

const tickets = ticketFiles()
  .filter(({ name }) => /^\d{3,4}-.*\.md$/.test(name))
  .map(({ name: file, read }) => {
    const fm = parseFrontMatter(read()) ?? {};
    const id = file.match(/^(\d+)/)[1];
    return {
      id,
      file: `_tasks/${file}`,
      title: fm.title ?? '(no title)',
      status: fm.status ?? '(none)',
      priority: fm.priority ?? '',
      size: fm.size ?? '',
      owner: fm.owner ?? '',
      depends_on: Array.isArray(fm.depends_on) ? fm.depends_on.map(String) : [],
    };
  })
  .sort((a, b) => Number(a.id) - Number(b.id));

const byId = new Map(tickets.map((t) => [t.id, t]));

// --- Git -----------------------------------------------------------------------------------------

const baseSha = git('rev-parse', '--verify', BASE);
const current = git('rev-parse', '--abbrev-ref', 'HEAD');
const refs = (git('for-each-ref', '--format=%(refname:short)', 'refs/heads', 'refs/remotes') ?? '')
  .split('\n')
  .filter(Boolean)
  .filter((r) => r !== 'origin' && !r.endsWith('/HEAD'));

/** One entry per branch name; local and origin copies are merged. */
const branches = new Map();
for (const ref of refs) {
  const remote = ref.startsWith('origin/');
  const name = remote ? ref.slice('origin/'.length) : ref;
  if (IGNORED.some((re) => re.test(name))) continue;
  const b = branches.get(name) ?? { name, local: false, remote: false, ref };
  if (remote) b.remote = true;
  else {
    b.local = true;
    b.ref = ref; // prefer the local copy for counts
  }
  branches.set(name, b);
}
for (const b of branches.values()) {
  b.ahead = baseSha ? Number(git('rev-list', '--count', `${BASE}..${b.ref}`) ?? 0) : null;
  b.behind = baseSha ? Number(git('rev-list', '--count', `${b.ref}..${BASE}`) ?? 0) : null;
  b.lastCommit = git('log', '-1', '--format=%cs', b.ref);
  const m = b.name.match(/(?:^|\/)(\d{3,4})-/);
  b.ticket = m && byId.has(m[1]) ? m[1] : null;
  b.unknownTicket = m && !byId.has(m[1]) ? m[1] : null;
}
const ignoredCount = refs.filter((r) => IGNORED.some((re) => re.test(r.replace(/^origin\//, '')))).length;

// Ticket ids named in commit subjects on the base ("(ticket 1304)", "ticket 1305").
const baseSubjects = baseSha ? (git('log', BASE, '--format=%s') ?? '') : '';
const namedOnBase = new Set([...baseSubjects.matchAll(/ticket[s]?\s+(\d{3,4})/gi)].map((m) => m[1]));

// Base against origin.
let origin = null;
if (baseSha && git('rev-parse', '--verify', `origin/${BASE.replace(/^origin\//, '')}`)) {
  const o = `origin/${BASE.replace(/^origin\//, '')}`;
  if (o !== BASE) {
    origin = {
      ref: o,
      ahead: Number(git('rev-list', '--count', `${o}..${BASE}`)),
      behind: Number(git('rev-list', '--count', `${BASE}..${o}`)),
    };
  }
}

// --- PRs -----------------------------------------------------------------------------------------

let prs = null; // null = unknown (no gh, offline, not signed in)
try {
  const out = execFileSync(
    'gh',
    ['pr', 'list', '--state', 'open', '--json', 'number,headRefName,title,isDraft,url,reviewDecision'],
    { cwd: REPO, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 20000 },
  );
  prs = JSON.parse(out).map((p) => {
    const m = p.headRefName.match(/(?:^|\/)(\d{3,4})-/) ?? p.title.match(/\b(\d{3,4})\b/);
    return { ...p, ticket: m && byId.has(m[1]) ? m[1] : null };
  });
} catch {
  // gh unavailable, offline or signed out: PR facts stay unknown (null), never "none".
}

// --- Derive --------------------------------------------------------------------------------------

const findings = [];
const add = (kind, ticket, text) => findings.push({ kind, ticket, text });

for (const t of tickets) {
  const own = [...branches.values()].filter((b) => b.ticket === t.id);
  const unmerged = own.filter((b) => b.ahead > 0);
  const openPrs = prs?.filter((p) => p.ticket === t.id) ?? [];
  const numericDeps = t.depends_on.filter((d) => /^\d+$/.test(d));
  const manualDeps = t.depends_on.filter((d) => !/^\d+$/.test(d));
  const unmet = numericDeps.filter((d) => byId.get(d)?.status !== 'done');
  t.branches = own.map((b) => b.name);
  t.openPrs = openPrs.map((p) => p.number);
  t.unmetDeps = unmet;
  t.manualDeps = manualDeps;
  t.depsMet = unmet.length === 0 && manualDeps.length === 0;

  if (t.status === 'done' && unmerged.length) {
    add(
      'drift',
      t.id,
      `marked done, but ${unmerged.map((b) => `\`${b.name}\` (+${b.ahead})`).join(', ')} is not on ${BASE}`,
    );
  }
  if (t.status === 'review') {
    if (prs && !openPrs.length && !unmerged.length)
      add(
        'drift',
        t.id,
        'in review, but nothing is waiting: no open PR, no unmerged branch (done, or name what is left)',
      );
    else if (prs && !openPrs.length)
      add(
        'drift',
        t.id,
        `in review with no open PR; unmerged: ${unmerged.map((b) => `\`${b.name}\` (+${b.ahead})`).join(', ')}`,
      );
  }
  if (['todo', 'ready'].includes(t.status) && namedOnBase.has(t.id)) {
    add('drift', t.id, `status ${t.status}, but commits on ${BASE} name this ticket`);
  }
  if (t.status === 'todo' && t.depsMet && t.depends_on.length)
    add('ready', t.id, 'every dependency is done: could be `ready`');
  if (t.status === 'ready' && unmet.length) add('drift', t.id, `marked ready, but waits on ${unmet.join(', ')}`);
  if (t.status !== 'done' && manualDeps.length)
    add('manual', t.id, `depends on "${manualDeps.join('", "')}" (judge by hand)`);
}

for (const b of branches.values()) {
  if (b.ticket || !(b.ahead > 0)) continue;
  const why = b.unknownTicket
    ? `names ticket ${b.unknownTicket}, which is not in the tickets read (try --tickets-from ${b.name})`
    : 'claims no ticket';
  add('orphan', null, `branch \`${b.name}\` (+${b.ahead}, last commit ${b.lastCommit}) ${why}`);
}
for (const p of prs ?? []) {
  if (!p.ticket) add('orphan', null, `PR #${p.number} "${p.title}" (\`${p.headRefName}\`) claims no ticket`);
}

const notDone = tickets.filter((t) => t.status !== 'done');
const counts = Object.fromEntries(
  [...new Set(tickets.map((t) => t.status))].map((s) => [s, tickets.filter((t) => t.status === s).length]),
);

const report = {
  generatedAt: new Date().toISOString(),
  base: BASE,
  baseFound: Boolean(baseSha),
  currentBranch: current,
  ticketsFrom: TICKETS_FROM ?? 'working tree',
  origin,
  prsKnown: prs !== null,
  counts,
  findings,
  tickets,
  branches: [...branches.values()],
  ignoredBranches: ignoredCount,
  openPrs: prs,
};

if (asJson) {
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  process.exit(0);
}

// --- Markdown ------------------------------------------------------------------------------------

const out = [];
const ln = (s = '') => out.push(s);
const tref = (id) => (id ? `${id} ${byId.get(id).title}` : '');

ln(`# Ticket status (${report.generatedAt.slice(0, 16).replace('T', ' ')} UTC)`);
ln();
ln(
  `- Checked out: \`${current}\`. Tickets read from: ${TICKETS_FROM ? `\`${TICKETS_FROM}\`` : 'the working tree'}. Base: \`${BASE}\`${baseSha ? '' : ' (NOT FOUND: git facts skipped)'}.`,
);
if (origin)
  ln(`- \`${BASE}\` vs \`${origin.ref}\`: ${origin.ahead} ahead, ${origin.behind} behind (as of the last fetch).`);
ln(
  `- Open PRs: ${prs === null ? '**unknown** (gh unavailable or offline; PR checks skipped, not passed)' : prs.length}.`,
);
ln(
  `- Tickets: ${Object.entries(counts)
    .map(([s, n]) => `${n} ${s}`)
    .join(', ')}.`,
);
ln(`- Ignored branches (backup, agent worktrees, bots): ${ignoredCount}.`);
ln();

const sections = [
  ['drift', 'Drift: the ticket says one thing, git says another'],
  ['orphan', 'Work no ticket claims'],
  ['ready', 'Unblocked but still todo'],
  ['manual', 'Dependencies to judge by hand'],
];
for (const [kind, heading] of sections) {
  const list = findings.filter((f) => f.kind === kind);
  ln(`## ${heading} (${list.length})`);
  ln();
  if (!list.length) ln('None found. (This only covers what the checks can see.)');
  for (const f of list) ln(`- ${f.ticket ? `**${tref(f.ticket)}**: ` : ''}${f.text}`);
  ln();
}

ln('## Open tickets');
ln();
ln('| ID | Title | Status | Pri | Owner | Waits on | Branches | PRs |');
ln('|---|---|---|---|---|---|---|---|');
for (const t of notDone.sort((a, b) => a.priority.localeCompare(b.priority) || Number(a.id) - Number(b.id))) {
  const waits = [...t.unmetDeps, ...t.manualDeps].join(', ') || '–';
  const prCell = prs === null ? '?' : t.openPrs.map((n) => `#${n}`).join(' ') || '–';
  ln(
    `| ${t.id} | ${t.title.replace(/\|/g, '/')} | ${t.status} | ${t.priority} | ${t.owner} | ${waits} | ${t.branches.join(' ') || '–'} | ${prCell} |`,
  );
}
ln();
ln('## Branches with work not on base');
ln();
const live = [...branches.values()]
  .filter((b) => b.ahead > 0)
  .sort((a, b) => (b.lastCommit ?? '').localeCompare(a.lastCommit ?? ''));
if (!live.length) ln('None.');
for (const b of live) {
  ln(
    `- \`${b.name}\`: +${b.ahead} / -${b.behind}, last ${b.lastCommit}, ${b.local ? 'local' : ''}${b.local && b.remote ? '+' : ''}${b.remote ? 'origin' : ''}${b.ticket ? `, ticket ${b.ticket}` : ''}`,
  );
}

process.stdout.write(out.join('\n') + '\n');
