# Agent tooling: where each agent looks

Date checked: **2026-11-05**. Ticket 004 (decision: skills location) and ticket 1002/1003 (skills).

This records where four agent tools discover (a) `AGENTS.md` instructions and (b) Agent Skills (`SKILL.md` folders), and the decision that follows. Sources are linked. Where a claim rests on a search snippet or a community page rather than the official page I fetched, it is marked **unverified**.

## Decision

1. **`AGENTS.md`** at the repo root is the canonical instructions file.
2. **`CLAUDE.md`** contains only `@AGENTS.md`, so Claude Code imports the same instructions.
3. **Agent Skills** are canonical in **`.agents/skills/<name>/SKILL.md`**. Codex and Gemini CLI both document `.agents/skills` as a project location, and it is the open-standard path.
4. **Claude Code reads only `.claude/skills/`.** It is given a generated copy: `scripts/skills/sync.mjs` copies `.agents/skills/**` to `.claude/skills/**`. The copy is committed, with a generated-file header, so a fresh clone works without running anything. CI can run `node scripts/skills/sync.mjs --check` to catch drift.
5. Shared reference material (the generated block catalogue) lives in `.agents/skills/_shared/` and is copied with the skills, so the relative links in each `SKILL.md` work in both places.

Why not a symlink: Windows symlinks need developer mode or admin rights and are fragile in Git. A committed copy with a `--check` is explicit and portable.

Why not `.claude/skills/` as canonical: it is the only location Claude Code reads, but it is the one tool-specific path. Putting the canonical copy at the neutral path keeps the skills usable by Codex and Gemini CLI without a copy step.

## Findings per tool

### Claude Code

- **Skills.** Official docs ([code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills), fetched 2026-11-05) list the locations: personal `~/.claude/skills/<name>/SKILL.md`, project `.claude/skills/<name>/SKILL.md` (loaded from the start directory up to the repo root), nested `<subdir>/.claude/skills/`, `--add-dir` directories, plugins, and claude.ai synced skills. The page does not mention `.agents/skills/`. Conclusion: Claude Code needs `.claude/skills/`. It says it follows the Agent Skills open standard, but does not say which directories that covers.
- **AGENTS.md.** The docs refer to `CLAUDE.md` for instructions and do not mention `AGENTS.md`. Conclusion: not read directly. The repo bridges this with `CLAUDE.md` containing `@AGENTS.md`.

### OpenAI Codex CLI

- **AGENTS.md.** Official Codex docs, reached by redirect from `developers.openai.com/codex/guides/agents-md` to [learn.chatgpt.com/docs/agent-configuration/agents-md](https://learn.chatgpt.com/docs/agent-configuration/agents-md) (fetched 2026-11-05). Order: global `~/.codex` (or `CODEX_HOME`) `AGENTS.override.md` then `AGENTS.md`; then from the project root (typically the Git root) down to the working directory, one file per directory (`AGENTS.override.md`, then `AGENTS.md`, then any `project_doc_fallback_filenames`); concatenated root first, nearest directory last. `CLAUDE.md` is not read unless added to `project_doc_fallback_filenames`.
- **Skills.** Codex documents skills at [developers.openai.com/codex/skills](https://developers.openai.com/codex/skills). I saw only search snippets, not the full page. A secondary blog ([codex.danielvaughan.com](https://codex.danielvaughan.com/2026/03/26/skills-ecosystem-deep-dive)) lists `$CWD/.agents/skills`, `$CWD/../.agents/skills`, `$REPO_ROOT/.agents/skills`, `$HOME/.agents/skills`, `/etc/codex/skills`, and built-in skills. **Unverified** against the official page. Conclusion for us: `.agents/skills/` at the repo root is discovered.

### Gemini CLI

- **Skills.** Official docs ([geminicli.com/docs/cli/skills](https://geminicli.com/docs/cli/skills/) and [creating-skills](https://geminicli.com/docs/cli/creating-skills/)). Workspace skills live in `.gemini/skills/` **or** `.agents/skills/`. The `.agents/skills` alias is described as compatible with other tools following the Agent Skills standard. Within one tier `.agents/skills` takes precedence over `.gemini/skills`. Discovery happens at session start; `/skills list` and `/skills reload` check it. Verified from search snippets of the official pages, not a full fetch.
- **AGENTS.md.** **Unverified.** I did not confirm Gemini CLI's AGENTS.md behaviour. Its own memory file is `GEMINI.md`. Check before relying on `AGENTS.md` for Gemini; the repo's `AGENTS.md` is still the neutral source.

### Hermes agent (Nous Research)

- **Skills.** Community sources only ([awesome-hermes-agent](https://github.com/0xNyk/awesome-hermes-agent), a skills catalogue, and a Hermes-generated skill doc). Skills are `SKILL.md` files with YAML front matter in the agentskills.io format. `hermes skills tap add <repo>` adds a GitHub repo as a skill source, and skills can be installed from a raw `SKILL.md` URL. **Unverified:** the directories Hermes scans for skills at startup. The official docs are the place to confirm; I did not fetch them.
- **AGENTS.md.** A Hermes-generated skill doc says an `AGENTS.md` in the Hermes home directory is injected into every session, and workspace `AGENTS.md` files can be imported when migrating from another agent. **Unverified** against the official docs.

## Summary table

| Tool | AGENTS.md | Skills location(s) | Source quality |
|---|---|---|---|
| Claude Code | not read directly (use `CLAUDE.md` with `@AGENTS.md`) | `.claude/skills/`, `~/.claude/skills/` | Official docs, fetched |
| Codex CLI | read: `AGENTS.md` root to cwd, plus `~/.codex` | `.agents/skills/` (cwd up to repo root), `$HOME/.agents/skills/` | Official AGENTS.md fetched; skills from secondary source |
| Gemini CLI | **unverified** | `.agents/skills/` or `.gemini/skills/` | Official docs via search snippets |
| Hermes | injected from Hermes home (community doc) | skills from taps or URLs; scan dirs **unverified** | Community only |

## Consequences for this repo

- `.agents/skills/` is correct for Codex and Gemini CLI. Claude Code needs the generated copy in `.claude/skills/`.
- Hermes and Codex may not read `CLAUDE.md`. Both read `AGENTS.md` (Codex directly; Hermes per the community doc), so the content lives in `AGENTS.md`, not `CLAUDE.md`.
- Acceptance criterion from ticket 1002, "the same skills work from at least one non-Claude agent", is **not yet met**. It needs a dry run in Codex or Hermes, with the result recorded here. Until then, treat that as open.

## Keeping it in sync

- Edit skills under `.agents/skills/` only.
- `pnpm skills:sync` regenerates `.claude/skills/`.
- `pnpm skills:catalogue` regenerates `.agents/skills/_shared/block-catalogue.md` from `src/content.config.ts`.
- Both scripts accept `--check` for CI.

## Sources

- [Claude Code skills docs](https://code.claude.com/docs/en/skills), fetched 2026-11-05
- [Codex AGENTS.md guide](https://learn.chatgpt.com/docs/agent-configuration/agents-md), fetched 2026-11-05 (reached by redirect from developers.openai.com)
- [Codex skills](https://developers.openai.com/codex/skills), search snippet only
- [Codex skills ecosystem (secondary)](https://codex.danielvaughan.com/2026/03/26/skills-ecosystem-deep-dive), search snippet
- [Gemini CLI skills](https://geminicli.com/docs/cli/skills/) and [creating skills](https://geminicli.com/docs/cli/creating-skills/), search snippets
- [awesome-hermes-agent](https://github.com/0xNyk/awesome-hermes-agent), community
- [Agent Skills standard](https://agentskills.io), referenced by Claude Code and Gemini CLI docs
