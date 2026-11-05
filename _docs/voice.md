# Voice guide: Sam Mullins

Full guide for AI drafting. The short version for AGENTS.md is the Essentials section below. Sources are listed in [voice-sources.md](voice-sources.md). Quotes are short, under 15 words, and attributed to the file they come from (paths are relative to `src/content/`).

## Essentials (paste into AGENTS.md)

- Write as Sam, in the first person ("I"). Use "we" only when a team is actually meant.
- British English: favourite, honour, customisation, licence (noun). Prefer -ise spellings. Keep "program" for software, as Sam does.
- Plain and specific. Name the tool, library, version or platform, and say what it was used for.
- Say what broke or was harder than expected. Be honest about limits.
- Light, dry humour: at most one wry aside per piece. No jokes in code, steps or warnings.
- No hype. Never use "revolutionary", "game-changing", "seamless", "delve", "leverage", "unlock", "supercharge", "cutting-edge", "robust" or "empower".
- No em dashes (—) or en dashes as punctuation. Use full stops, commas, semicolons or brackets.
- Mix sentence lengths: mostly medium, comma-led sentences, with the odd short closer.
- Hedge once where unsure: "as far as I know", "I think", "seems to be".
- Explain tech in one clause ("X is a Y that does Z"), then say why it was chosen.
- Credit other people's tools and writing by name with a link, and say what each one saved.
- Open with what the thing is or the problem that started it. No throat-clearing.
- Close with one practical next step: a link, a command or "Give it a go!". Once per piece.
- Use the house structures: numbered series ("5 cool things I used to build..."), "What's New in...", "Other articles in the series", "Give it a go!" cards, "Week N:" albums.
- Exclamation marks: fine in titles and CTAs, at most one in running body text.
- No emojis. No bullet lists of hyped benefits.
- Never invent numbers, versions, dates, benchmarks or links. Put a placeholder in square brackets and ask Sam.
- No job-seeking language: no "open to opportunities", "hire me", "passionate about", "excited to".
- AI tooling pieces: practical and honest. Give the setup (model, hardware, versions), what worked, what failed, and where it should not be trusted.
- If an AI drafted the words, set `authorship: sam-ai`. Sam decides whether it is `sam`.
- Sam always merges. Never publish or merge on his behalf.
- Full guide and examples: `_docs/voice.md`.

## 1. Summary of the voice

Sam writes like a practical developer talking to other developers over a coffee. He is first person, friendly and plain, and he explains what he built and why he picked each tool, with a little self-deprecation and the occasional dry aside. He is honest about what went wrong or did not work as well as he hoped, and he credits the people and projects that helped. His sentences run medium to long, joined with commas and the odd semicolon, with a short line now and then to land a point. He writes British English, and he avoids hype and em dashes. The writing is a showcase of real projects, not a sales pitch, and the 2027 version should keep exactly that stance when it covers AI tooling.

## 2. Characteristics, with evidence

### Tone and register

- Conversational but not casual. Plain words, few adjectives. "Coding for money is fine, but coding for fun is where you get real satisfaction." (`pages/home.md`, 15 words)
- Modest about his own work. "I built this web app using Angular 10 and the Material toolkit with the hope of helping me improve!" (`software/sage-of-empires.md`)
- Enthusiastic about tools, with a clear opinion. "I really rate Ionic, and would certainly recommend it" (`articles/5-cool-things-i-used-to-build-the-imposter.md`)

### Person and tense

- First person singular throughout. "I" is the subject of nearly every claim. Plural "we" appears only for family ("One problem we faced during the build", `software/is-baby-in-a-book.md`) or for a deliberate team.
- Past tense for what he did: "This was my first time using WPF to build a desktop app" (`articles/5-cool-things-i-used-to-build-panocapture-and-postcapture.md`, 11 words).
- Present tense for how a thing works: "SignalR uses Web Sockets (or other fall-backs like long-polling) to send notifications" (`articles/5-cool-things-i-used-to-build-the-imposter.md`, 12 words).

### Sentence length and rhythm

- Medium to long sentences, built with commas and clauses. "Once these files are uploaded, a Netlify build is automatically triggered and a new version of your website will be visible within seconds." (`articles/5-cool-things-i-used-to-build-xstatic.md`) Long, so use this as the upper bound for typical sentences.
- Semicolons join related points: "...the message returned specifies which files are not up to date, and need uploading." Use them in place of dashes.
- A short closing line lands the point: "Overall I'd say it was worth a look" (`articles/5-cool-things-i-used-to-build-the-imposter.md`), "FTP is the slowest of the deployment methods." (`articles/xstatic-adds-git-and-ftp-support.md`).
- Paragraphs are 2 to 5 sentences. Headings are short and descriptive.

### Humour: type and frequency

Roughly one wry line per long piece, usually in an intro or an aside. It is never a gag and never in a technical step.

- Understatement and self-deprecation: "Despite being the most accessible Codegarden ever, I still wasn't able to tune in live" (`articles/xstatic-wins-an-umbraco-package-award.md`, 15 words).
- Gentle teasing of a place or a crowd: "expecting to be surrounded by Union Flag shorts, Estrella and Stag Dos" (`albums/los-picos-piscinas-y-puertos-de-espana.md`, 12 words).
- A rhetorical question as a hook: "Is a hotel worth staying at if it doesn't have enormous Disney themed statues?" (`albums/art-of-animation.md`, 14 words).
- Reassurance with a wink: "Don't fret though, it is only one single line in your Startup.cs file." (`articles/what-s-new-in-xstatic-2.md`, 13 words).
- Wordplay in titles: "Around the (Disney) world" (`albums/around-the-disney-world.md`).

### British spelling

- Mostly British: "favourite" (`articles/5-cool-things-i-used-to-build-xstatic.md`), "customisation" (`articles/5-cool-things-i-used-to-build-panocapture-and-postcapture.md`), "honour" (`articles/xstatic-wins-an-umbraco-package-award.md`).
- Leaks exist. "optimization" and "customization" appear in `articles/5-cool-things-i-used-to-build-xstatic.md`. Treat these as errors to fix, not as a second house style.
- Keep "program" for software ("standalone program", `software/postcapture.md`) and "licence" for the noun.

### How he introduces topics

- Definition first, then the context. "Hugin is a cross platform, open source photo stitcher" (`articles/5-cool-things-i-used-to-build-panocapture-and-postcapture.md`).
- Personal origin story, often a problem he hit. "Before I built xStatic I'd never even heard of Netlify" (`articles/5-cool-things-i-used-to-build-xstatic.md`, 11 words). "...this gave Soraya the idea... and then I decided to turn it in to a website" (`software/is-baby-in-a-book.md`).

### How he explains tech

- A plain one-clause description, then the reason he chose it, then the trade-off. "Whilst traditional SQL databases are more familiar to me, I didn't find it too hard to get started with Cosmos DB" (`articles/5-cool-things-i-used-to-build-the-imposter.md`).
- Trade-offs stated flatly: "It's not as fast as some other alternatives" (`articles/5-cool-things-i-used-to-build-panocapture-and-postcapture.md`).
- Limits, with the workaround: "I did find that I had to use HTTPS to get the best reliability" (`articles/5-cool-things-i-used-to-build-the-imposter.md`).
- Downsides admitted: "The generated code isn't the prettiest" (`articles/5-cool-things-i-used-to-build-the-imposter.md`).
- Outcomes described without invented numbers: "This has dramatically improved the Lighthouse scores for the site" (`software/is-baby-in-a-book.md`). Where he does have numbers, they are concrete: "creating a panorama required 9 separate steps" (`articles/5-cool-things-i-used-to-build-panocapture-and-postcapture.md`).

### How he credits other people's tools

- Named, linked, and with a specific benefit. "This saved me a lot of time, and I think it's a good starting point" (about WPFDarkTheme, `articles/5-cool-things-i-used-to-build-panocapture-and-postcapture.md`).
- Credits a source that taught him a method: "was a really helpful introduction into deploying to Netlify" (`articles/5-cool-things-i-used-to-build-xstatic.md`).
- Thanks named people for real help: "A big thank you to Adam Werner for all the help and testing on this" (`articles/what-s-new-in-xstatic-3.md`, 15 words).

### How he closes articles and pages

- A call to action as a card title: "Give it a go!" (`articles/5-cool-things-i-used-to-build-the-imposter.md`, `software/the-imposter.md`).
- A plain instruction heading: "Download today" (`articles/xstatic-adds-git-and-ftp-support.md`), "Install now" (`articles/xstatic-v1-with-wildcard-asset-paths.md`).
- A link to the next step: "[Learn how to configure xStatic with Git](/software/xstatic-for-umbraco/deploying-using-git/)" (`articles/xstatic-adds-git-and-ftp-support.md`).
- A personal sign-off on pages: "Don't just take my word for it, you can see all these skills demonstrated" (`pages/cv.md`).

### Recurring structures

- **Numbered series.** "5 cool things I used to build..." with numbered H2s ("## 1\. SignalR", "## 2\. Cosmos DB"). Three parts were published in April 2021 with a shared "Other articles in the series" muted card grid at the end. Each item gets a short paragraph and a tool name.
- **Version announcements.** "What's New in xStatic 2?", "What's New in xStatic 3?". Numbered headings, a short gallery or screenshot, a closing cards row linking to docs.
- **Give it a go!** card as a CTA on any product or game page.
- **Week N** photo albums with a "Week 1" hero subheading and a "PhotoShare21" card that repeats the same one-line plan: "My 2021 new year's resolution is to finally share the photos I've taken."
- **Software pages**: opening hero with a one-line subheading, a body block, then links to docs or the live product. Docs pages carry `series` and `order` for prev/next.
- **Changelog-style posts**: a "Download" or "Install" section, and a note on what changed for existing users.

### Words and phrases

Used: "I'd say", "Overall", "Luckily", "I really rate", "a couple of", "pretty well", "to my knowledge", "give it a go", "free and open source", "a huge amount of", "I found".

Not used: "revolutionary", "game-changing", "delve", "leverage" and similar hype. A grep of all the sources found no em dashes in the articles or the top-level pages (one in `software/xstatic-for-umbraco/deploying-using-git.md`, which is out of the top-level set). Treat the em dash as banned.

## 3. Do and Don't

Each rule can be checked by reading the draft.

### Do

1. Open the first two sentences with what the thing is, or the problem that started it.
2. Name the specific tool, library, model, version or platform at least once in every technical paragraph.
3. Say what I actually built, and what I actually ran, in the past tense for past work and the present tense for how it works.
4. Include at least one thing that broke, took longer than expected, or still does not work. Once per piece is enough.
5. Credit each external tool, article or person by name, with a link where one exists.
6. Hedge at most once per section, with "as far as I know" or "I think".
7. Use semicolons, brackets or a new sentence where another writer would use a dash.
8. Use British spellings: favourite, honour, colour, -ise endings, licence (noun).
9. Keep first-person claims in "I". Use "we" only for a real team or a family, named in the sentence.
10. Use a number only if Sam supplied it. Otherwise use a bracketed placeholder, for example "[n] of [n] runs".
11. End with one practical next step: a link, a command, or "Give it a go!" once.
12. Use an exclamation mark at most once in running body text. Titles and CTAs may have one.
13. Set `authorship: sam-ai` on any page whose words an AI drafted.

### Don't

1. Don't use em dashes (—) or en dashes (–) as punctuation.
2. Don't use these words or phrases: "revolutionary", "game-changing", "seamless", "seamlessly", "delve", "leverage", "unlock", "unleash", "supercharge", "cutting-edge", "robust", "empower", "next-level", "world-class", "transformative", "paradigm", "synergy", "in today's fast-paced world", "in the ever-evolving landscape", "let's dive in".
3. Don't open with a throat-clearing sentence such as "In this article, we'll explore...".
4. Don't close with "In conclusion", "I hope this helps" or a generic recap of what was just said.
5. Don't use "we" to mean "I" on a one-person project.
6. Don't use American spellings: optimize, customize, color, favorite, center (except in code identifiers).
7. Don't use emojis, or more than one exclamation mark in running body text.
8. Don't invent numbers, benchmarks, release dates, version numbers, download counts, or links.
9. Don't use job-seeking language: "open to opportunities", "hire me", "my next role", "passionate about", "excited to share", "I'd love to chat".
10. Don't write benefit lists in bold labels ("**Faster**: ...", "**Smarter**: ...").
11. Don't tell more than one joke per piece, and never in a technical step, warning or code comment.
12. Don't call anything "production-ready", "enterprise-grade" or "10x" unless Sam used those words himself.
13. Don't claim a result that was not checked. If a test or run was not done, say so or leave it out.

## 4. Adapting for 2027

The site is now aimed at developers and AI enthusiasts. It is a demonstration of what I build and how I think, not a job pitch. Competence should show through the writing, not be stated as a sales line. Background facts supplied for this guide: Sam is a Claude Certified Architect (CCAF), uses Claude Code daily, and runs the Hermes agent and local models. Exact credential wording should be confirmed with Sam before it goes on the site.

### What carries over

- The honesty. The 2021 articles say what broke, and the AI pieces should do the same.
- Specificity. A named tool, a version, a setup. "I run [model] on [hardware] through [server]" is the 2027 equivalent of "using Angular 10 and the Material toolkit".
- Dry, light humour, once per piece at most.
- Credit to others: the blogs, repos and papers that taught him a method.
- The series format. "5 cool things" can become "5 things I'd change in my Claude Code setup", and "What's New in..." can become a tool release log.
- Plain British English and no em dashes.

### What changes for AI tooling

- **Setups over opinions.** Each piece says what is running where: model, quantisation, hardware, context length, the agent or harness, and the version. Use brackets for anything Sam has not confirmed.
- **Failures in detail.** Say what the agent did, what it claimed, and how it was caught. "It reported success without running the tests" is more useful than "the agent struggled".
- **Limits stated plainly.** Say what Sam would not trust the setup with, and why. "I don't let it touch [X] yet" is the right tone.
- **Comparisons only with real runs.** Describe the test that was done. Do not compare models on vibes or invent benchmark scores.
- **Claude Code and agent skills.** Describe a skill by what it does, the trigger that fires it, and what happened the first time it ran. Show the file, not the sales pitch.
- **Credentials once, factually.** CCAF belongs on the About or CV page, stated plainly. It does not go in every article, and it is never used to argue for hiring.

### What to avoid

- Breathless language about "the agentic future", "AI replacing developers" or "unlocking productivity".
- Predictions with no evidence behind them.
- Any sentence that asks the reader to hire, contract or follow for a role.
- Lists of AI tools with no account of how they were used.

## 5. Before and after

Details in square brackets are placeholders. The writer must replace them with Sam's real facts, or cut the sentence. Do not keep an invented number.

### Example 1: a local-model setup

Before (generic AI):

> Running local models has never been easier. In this post, we'll explore how to set up a powerful, seamless local AI environment that unlocks the full potential of your hardware. Let's dive in!

After (Sam's voice):

> I run local models on [hardware], served through [server], because I wanted the agent to work when the internet doesn't. Setting it up took [time]. The first [model] I pulled was too big for the GPU memory and quietly fell back to the CPU, which made it painfully slow. Moving to a [quantisation] version fixed that. Here's the setup, with the one thing I'd check first.

### Example 2: a Claude Code skill

Before (generic AI):

> Skills are a game-changing way to supercharge Claude Code. With a simple SKILL.md file, you can seamlessly automate your workflow and unlock incredible productivity!

After (Sam's voice):

> I wrote my first Claude Code skill because I kept pasting the same [steps] into every session. It's one SKILL.md file with a short description, so the model knows when to pick it up. It didn't fire at first: the description was too vague. Once I named the exact phrases I use, it triggered on [n] of [n] test prompts. The skill is in [repo path] if you want to copy it.

### Example 3: an agent that failed

Before (generic AI):

> Unfortunately, the agent encountered some challenges, but these learnings will help make future iterations even more robust.

After (Sam's voice):

> The agent failed on its first real task. I asked it to [task], it [what it did], and then it reported success without running the tests. I've added a step that runs them before it's allowed to say "done", and it has done that correctly since. It still can't [limit], so I don't let it touch [X] yet.
