---
name: pm-pass
description: Run a project-manager pass over the sammullins.co.uk tickets (_tasks/) and hand Sam a desk page, an HTML artifact with one collapsed item per thing only he can do, numbered steps and a recommendation each. Use whenever Sam asks what needs his attention, what to work on next, what is left before launch, to triage or tidy the tickets, or to check the state of tickets, branches and PRs. Also use to mark items done on an earlier desk page. Do NOT use to do the work inside a ticket.
---

# pm-pass

Sam's attention is the bottleneck, not compute. This pass turns ~80 tickets, a dozen branches and several agent sessions into a short page he can work top to bottom. It is adapted from the Surrounded by Stories PM (`C:\Business\SurroundedByStories\sbs-tasks\PM.md`), cut down for a one-person site: there is no reconciler, launcher or phone hub here, so the pass does the cross-checking itself with `scripts/tasks/status.mjs`.

## The one rule

**You touch nothing but tickets and planning files, and you never merge, push to `main`, delete a branch or close a PR.** You may edit ticket front matter, `_tasks/BACKLOG.md` and the index in `_tasks/README.md`, on a branch, with a PR, because Sam merges (AGENTS.md golden rule 1). Anything destructive (deleting branches, closing PRs, reverting a setting) is written up as **one proposal for Sam to approve**, with the tip SHA of every branch named. If he approves, do exactly that batch, not whatever has grown since.

You do not do the work in the tickets. If an item is agent work, say which ticket and that an agent can take it; do not start it.

## Inputs

| File                 | What you take from it                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------ |
| `_docs/decisions.md` | Source of truth. Beats a ticket when they disagree.                                                          |
| `_tasks/BACKLOG.md`  | The current order and "where things stand". Read it, then check it against git: it is a claim, not evidence. |
| `_tasks/README.md`   | Ticket conventions (status, priority, owner, depends_on).                                                    |
| `_tasks/*.md`        | The tickets. Acceptance criteria are the definition of done.                                                 |
| `pnpm tasks:status`  | The instrument: front matter cross-checked against branches, `main` and open PRs.                            |

## Procedure

1. **Find where the newest ticket edits live.** Statuses differ between branches, because a PR moves its own ticket to `done`. Run `git for-each-ref --sort=-committerdate --format='%(committerdate:short) %(refname:short)' refs/heads | head` and pick the branch that contains the others (usually the integration branch Sam is working on, for example `style-guide`). Say which one you used.
2. **Run the instrument** from the repo root, reading tickets from that branch:
   ```bash
   git fetch --prune
   node scripts/tasks/status.mjs --tickets-from <branch>
   ```
   Use `--json` if you want to work with the data. If it reports open PRs as **unknown**, `gh` is unavailable; say so and do not treat PR checks as passed.
3. **Read every finding and confirm it before it reaches the page.** The script reports patterns, not truths:
   - _Review with nothing waiting_ usually means the work merged and the ticket was never closed, or that something is left. Open the ticket and read its "Verification" or notes. Close it only if every acceptance criterion is met with evidence; otherwise name what is left.
   - _Review with an unmerged branch and no PR_ means Sam has work to review that nobody has put in front of him. Check whether the branch is already merged into another branch (`git branch --contains <tip>`), because a stack of branches merged into an integration branch only needs one PR.
   - _Work no ticket claims_ is either a new ticket waiting to be written, an integration branch, or debris. Say which, with `git log --oneline main..<branch>`.
   - _Unblocked but still todo_ is a candidate for `ready`.
4. **Fix ticket drift you can prove**, on a branch named `pm/<date>` (or the ticket's own branch when it is open): set `status` (`ready`, `blocked`, `done`), add a short `## Verification` note saying what you checked, and update `BACKLOG.md`'s "Where things stand". Never set `done` without evidence. Open a PR and stop.
5. **Sort what is left by who has to act.** `owner: sam` and `pair` tickets, decisions only Sam can make, and reviews and merges are Sam's. `owner: agent` work that is unblocked is not Sam's to do, but "start an agent on it" can be one item that lists the tickets.
6. **Build the desk page** (below) and publish it.
7. **Report in chat** in three or four lines: the link, the one thing to do first, and anything you changed on disk.

## The desk page

The format Sam confirmed on Surrounded by Stories (2026-08-13: "this HTML page worked exactly as I wanted"). Treat it as settled.

1. **One item per thing to do, collapsed if the site has a block for it.** Sam does one thing at a time. (It doesn't yet: see ticket 1005 and "Building it" below.)
2. **Every item assumes total memory loss.** Say what the thing _is_ (the ticket, what it touches, why it exists) before saying what to do.
3. **Steps are numbered, in execution order, with real commands.** Not "review the PR" but `gh pr create --base main --head 207-colour-tokens --fill` or the github.com URL. **Every command names its checkout**: the main checkout is `C:\Development\Websites\sammullins.co.uk\sammullins.co.uk` and there are agent worktrees, so write `git -C <path>` or the full path, never a bare `cd`.
4. **Group items into phases and say why the phases come in that order**, so Sam knows he can stop after phase one. The usual order: _clear the review queue_ (work already done, waiting on him) → _unblock the critical path_ (accounts, DNS, the launch content gate) → _decisions only you can make_ → _housekeeping_ (branch tidy-ups, as a proposal).
5. **Recommend; do not offer a menu.** Give the answer and the reason. He can overrule a recommendation in seconds; he can't re-derive an analysis in seconds.
6. **Corrections get their own prominent block at the top**, never folded quietly into a paragraph: if an earlier page, `BACKLOG.md` or a ticket said something that turned out to be wrong, say so, and say what misled you.
7. **Tag each item** with its kind (review, decision, account, content, housekeeping), its ticket ids, and where it can be done: `phone` (a decision, a GitHub review in the browser), `pc` (commands, a dev server) or `either`.
8. **A footer saying exactly what changed on disk**: branches created, files edited, what is committed, what is uncommitted, what PR is open, and what was deliberately left for Sam.
9. **Update the same page in place** as items get done: mark them done (struck title, a "Done" tag, a one-line note of what happened), never delete them. Republish to the same URL.

Aim for 3 to 8 items. Every item is something only Sam can do; if delegable agent work keeps reaching the page, that is a ranking mistake, not an item.

The SbS version of this contract (`sbs-tasks/PM.md`, job 8) is where it came from; read it for the reasoning behind each rule.

### Building it: dogfood the site, never style it

**The desk page is made only of the site's own blocks and rendered by the site's own build. You write no CSS, no HTML and no `style` attributes for it, ever.** This is how Sam sees where the site has gaps: anything the blocks can't express shows up on the page as a gap rather than being hidden by a one-off style. Hand-writing CSS that copies the token values is a lookalike, not a use of the site, and it drifts the moment a token changes. That mistake was made on the first pass (6 November 2026) and corrected the same night.

1. Write the desk as `.desk/desk.json` (git-ignored: it describes Sam's own to-dos, and the repo is public): `{ id, title, description, blocks }`. `blocks` are ordinary site blocks, validated by the real schema in `src/content.config.ts`, so an invented block or field fails the build. Read `.agents/skills/_shared/block-catalogue.md` and the style guide's components page for what exists. Generate the JSON with a small script in the scratchpad if writing Markdown inside JSON by hand gets awkward.
2. Use the **sections > components** technique, as the site does: every part of the page is a `section` band holding components in order, and surfaces alternate (`default`, `muted`) so the parts separate visually without any styling of your own. The shape that works:
   - a `hero` (`variant: plain`, left-aligned): the page name and the one-line state of things;
   - a `section` with the intro `prose` and one `callout` (`tone: warning`) per correction;
   - one `section` per phase: an `intro` (the phase heading and why it comes in that order), then for each item a `prose` (an `###` heading with the item number, a bold meta line of kind, tickets and where, then what the thing is), a `callout` (`tone: tip`, title "Recommendation"), and a `prose` with the numbered steps and their commands as fenced code;
   - a `section` (`muted`) listing the gaps this page ran into;
   - a `section` (`surface: inverse`) for what changed on disk.
3. Build it: `pnpm pm:desk` (`node scripts/pm/desk.mjs [desk.json] [out.html]`). It runs the real `astro build` with the `pm-desk` route switched on, then folds the result into one file (compiled CSS inlined, fonts as data URIs, site links pointed at the live site). It writes `.desk/desk.html` for publishing and `.desk/desk.preview.html` for a local look.
4. Load the `artifact-design` skill, as the Artifact tool requires, but take only its page contract from it: this page's design is the site's. Publish `.desk/desk.html` with the `Artifact` tool (icon: `checklist`). Republish the same file path to update it in place.

**When a block can't do what the contract above asks** (collapsing an item, a tag, a done state), do the nearest thing the blocks allow, and **add the gap to ticket 1005** (or a new ticket once 1005 is closed). Then list it in the page's gaps section. Never paper over a gap with CSS. Until 1005 lands, items are not collapsible, tags are a bold meta line, and a done item gets a struck `###` heading plus a `tip` callout titled "Done" with what happened.

No eyebrows (labels above titles): Sam has rejected them.

## How to talk to Sam

- **Lead with the finding, not the process.**
- **Quantities beat adjectives**: "12 commits on `207-colour-tokens`, not on `main`, no PR" rather than "some unmerged work".
- **Never present a clean script run as proof of health.** Say what it can't see: work in uncommitted files, agent worktrees (deliberately ignored), PRs if `gh` was unavailable, and acceptance criteria that need a human.
- **Flag your own judgement calls as yours**, and say they can be struck.
- **Say when you were wrong**, in as many words, and what misled you.
- British English, no em dashes, as in `AGENTS.md`.

## Done when

- Every finding on the page was confirmed by hand, not copied from the script.
- No ticket moved to `done` without a Verification note.
- Anything destructive is a proposal, not an action.
- The desk page is published, built by `pnpm pm:desk` from site blocks only, every item has a recommendation, and the footer matches what is on disk.
- Every gap the page ran into is in ticket 1005 (or its successor) and in the page's gaps section.
- Ideas raised along the way that are out of scope are new tickets (or one line each in `BACKLOG.md`), not silent scope creep.
