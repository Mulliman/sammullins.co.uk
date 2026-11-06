# Content model

Field reference for every collection and block. The source of truth is `src/content.config.ts`. If this document and the schema disagree, the schema wins: fix this document. The block table for agents is generated into `.agents/skills/_shared/block-catalogue.md` by `pnpm skills:catalogue`.

## Collections

| Collection | Files | Served at | Notes |
|---|---|---|---|
| `pages` | `src/content/pages/**/*.md` | `/<path>/`, `home` → `/` | Any block composition |
| `articles` | `src/content/articles/**/*.md` | `/articles/<slug>/` | Articles and notes (`kind`) |
| `software` | `src/content/software/**/*.md` | `/software/<path>/` | Products and docs series |
| `albums` | `src/content/albums/**/*.md` | `/photography/photoshare21/<slug>/` | Photo albums, hidden by default |
| `redirects` | `src/data/redirects.json` | none (becomes `_redirects`) | See "Redirects" below |
| `settings` | `src/data/site.yaml`, entry `site` | none | Nav, socials, footer |

Every content collection is a glob over `.md` files. The entry `id` is the file path without `.md`, so the URL follows the path.

## URL mapping

| File | URL |
|---|---|
| `src/content/pages/home.md` | `/` |
| `src/content/pages/cv.md` | `/cv/` |
| `src/content/articles/5-cool-things-i-used-to-build-the-imposter.md` | `/articles/5-cool-things-i-used-to-build-the-imposter/` |
| `src/content/software/xstatic-for-umbraco.md` | `/software/xstatic-for-umbraco/` |
| `src/content/software/xstatic-for-umbraco/deploying-to-netlify.md` | `/software/xstatic-for-umbraco/deploying-to-netlify/` |
| `src/content/albums/<slug>.md` | `/photography/photoshare21/<slug>/` |

Rules:

- URLs always end with a trailing slash.
- Renaming or moving a file changes its URL. Add a redirect (`redirect` skill). Never break a URL.
- `software` docs get prev and next links automatically when they share `series` and have an `order`.

## Front matter: all collections

Shared fields come from one base schema. Each collection adds its own.

| Field | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `title` | string, min 1 char | yes | none | Page title, used in `<title>` and headings |
| `description` | string, 1 to 200 chars | yes | none | SEO description and card text |
| `date` | date | articles: yes. Others: optional | none | Publication date. Write as `"2021-04-07"` (quoted) |
| `updated` | date | no | none | Last substantive update, shown in the colophon |
| `tags` | string list | no | `[]` | Used by `cards` and `listing` queries (`tags`) |
| `cover` | image reference (see below) | no | none | Social and card image |
| `authorship` | `sam` or `sam-ai` | yes | none | Who wrote the words. `sam` only if Sam wrote them verbatim; otherwise `sam-ai` |
| `archived` | boolean | no | `false` | `true` shows the archive banner, lists the page under `/archive/`, and hides it from default queries |
| `hidden` | boolean | no | `false` | `true` is never listed anywhere. Still reachable by URL |
| `noindex` | boolean | no | `false` | `true` adds `noindex` to the page |
| `theme` | `default` or `christmas` | no | `default` | Page theme: colours from `src/styles/themes/<theme>.css`, on top of light and dark mode |
| `blocks` | list of blocks | no | `[]` | The page body, in order. See "Blocks" |

### Collection-specific fields

| Collection | Field | Type | Required | Default | Meaning |
|---|---|---|---|---|---|
| `articles` | `date` | date | yes | none | Required, overrides the shared optional rule |
| `articles` | `kind` | `article` or `note` | no | `article` | Notes appear in the notes feed (`listing` with `variant: notes` or `query.kind: note`) |
| `software` | `status` | `active` or `legacy` | no | `active` | `legacy` marks a product no longer maintained. `query.status` filters on it |
| `software` | `series` | string | no | none | Groups docs into a series, e.g. `xstatic-for-umbraco`. Used for prev and next |
| `software` | `order` | number | no | none | Position inside `series`. Lower comes first |
| `albums` | `date` | date | no | none | Optional for albums |

### Image reference

Used by `cover`, block images, gallery items, card items, logo wall logos (as a bare image, see below) and the video poster.

| Field | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `src` | path | yes | none | Image path, **relative to the .md file**. Must point at a file in `src/assets/` |
| `alt` | string | yes, unless decorative | none | Describes the image for screen readers. Empty only when `decorative: true` |
| `decorative` | boolean | no | `false` | `true` means the image adds no meaning. Then `alt` may be `""` |

Gotchas:

- `alt` is required unless `decorative: true`. A missing or blank `alt` fails the build.
- Image paths are relative to the .md file, not to the repo. From `src/content/articles/x.md` use `../../assets/media/<folder>/<name>.avif`. From `src/content/pages/a/b.md` use `../../../assets/...`.
- Use AVIF masters from `src/assets/media/<folder>/`, added with the `add-images` skill.

### Query (used by `cards` and `listing`)

| Field | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `from` | `articles`, `software` or `albums` | yes | none | Collection to read. Pages cannot be queried |
| `tags` | string list | no | none | Keep items that have any of these tags |
| `kind` | `article` or `note` | no | none | Articles collection only |
| `status` | `active` or `legacy` | no | none | Software collection only |
| `archived` | `exclude`, `include` or `only` | no | `exclude` | Archived items are hidden unless asked for |
| `parent` | string | no | none | Keep ids that start with `<parent>/` (e.g. docs of one product) |
| `topLevelOnly` | boolean | no | `false` | Only ids with no `/` (products, not their docs) |
| `sort` | `date-desc`, `date-asc`, `order` or `title` | no | `date-desc` | `order` uses the software `order` field |
| `limit` | positive integer | no | none | Maximum items |

Hidden items are never listed by a query.

### Redirects

`src/data/redirects.json` is a map from old path to target:

```json
{
  "/articles/old-slug/": {
    "to": "/articles/new-slug/",
    "status": 301,
    "reason": "Renamed (PR #123)"
  }
}
```

| Field | Type | Required | Default | Meaning |
|---|---|---|---|---|
| key | path with trailing slash | yes | none | The old URL |
| `to` | path with trailing slash | yes | none | The final URL. Never another redirect key |
| `status` | `301` or `302` | no | `301` | Use 301 for permanent moves |
| `reason` | string | yes | none | Why, for the next person to read |

The build fails on chains, loops and missing targets. See `integrations/site-files.mjs`.

### Settings

`src/data/site.yaml` has one entry, `site`: `name`, `tagline`, `nav` and `footerLinks` (label and href), `socials` (label, handle and an https href), `footerCards` (title and body), and `features` (`viewTransitions` and `blurToSharpHero`, both default `false`). Edit it to change the site-wide nav or footer, not content pages.

## Blocks

Each page's `blocks` is a list. Each item has a `type` and the fields for that type. Blocks render in order. Seventeen types exist: fifteen leaf blocks, `split` and `section`.

Gotchas that apply to every block:

- **Quote numbers and dates that YAML would turn into numbers.** Write `when: "2021"`, not `when: 2021`. Timeline `when` is coerced to a string, but an unquoted `2015 to 2018` is fine while `2021` is read as a number, so always quote it.
- **Image paths are relative to the .md file.** See above.
- **`alt` is required** unless `decorative: true`. Logo wall logos have no `alt` field; the client `name` is used as the alt text.
- **Strings inside blocks are Markdown** (escaped, not rendered as HTML) for `intro.lead`, `prose.markdown`, `callout.body`, card `text`, timeline `body`. Raw HTML is escaped. No `<script>`, no `style` attributes.
- **The `body` block positions the file's Markdown body.** Put it where the long text should go. If a page has a Markdown body but no `body` block, the body is appended after the blocks. If the body is empty, no body block is needed.
- **Archived pages** show their first `hero` block at the top, above the archive banner.
- **`split` cannot nest `split`.** Its columns hold only leaf blocks.
- **No raw HTML in block Markdown.** It is escaped. Use Markdown links and emphasis.
- **Links are site paths with trailing slashes** (`/cv/`), or full `https://` URLs for external sites.

### `hero`

Big heading at the top of a page.

| Field | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `variant` | `image`, `blurred` or `plain` | no | `blurred` | `blurred` puts a blurred copy behind a framed image. `image` frames the photo with the heading below. `plain` is text only |
| `heading` | string | yes | none | The heading text |
| `subheading` | string | no | none | Text under the heading |
| `image` | image reference | no | none | Required in practice for `image` and `blurred` variants |
| `align` | `center` or `left` | no | `center` | Text alignment |

```yaml
- type: hero
  variant: plain
  heading: "Sam Mullins"
  subheading: "Developer"
```

### `intro`

A short introduction block: an optional heading and lead paragraph. There is no kicker or eyebrow label above the heading, by design (ticket 204).

| Field | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `heading` | string | no | none | Section heading |
| `lead` | Markdown string | no | none | Larger lead paragraph |
| `align` | `center` or `left` | no | `center` | Text alignment |
| `surface` | `default`, `muted` or `inverse` | no | `muted` | Background colour |

```yaml
- type: intro
  heading: "Other articles in the series"
  surface: muted
  align: center
```

### `prose`

Formatted Markdown at a readable width.

| Field | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `markdown` | Markdown string | yes | none | The content. Headings get anchor links |
| `align` | `center` or `left` | no | `left` | Text alignment |

```yaml
- type: prose
  markdown: |
    ## Why I built it

    A short paragraph with a [link](https://example.com/).
```

### `body`

Places the file's Markdown body (below the front matter) at this position. Long-form text, with code highlighting.

| Field | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `surface` | `default`, `muted` or `inverse` | no | `default` | Background colour of the section |

```yaml
- type: body
  surface: default
```

### `callout`

A note, tip, warning or legacy notice. The label and icon say the tone, not only the colour.

| Field | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `tone` | `note`, `tip`, `warning` or `legacy` | no | `note` | Which kind of notice |
| `title` | string | no | none | Bold label |
| `body` | Markdown string | yes | none | The text |

```yaml
- type: callout
  tone: legacy
  title: "From the archive"
  body: "This page is from an earlier chapter of my work and may be out of date."
```

### `image`

One image, with an optional caption.

| Field | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `image` | image reference | yes | none | The picture. Alt text rules apply |
| `caption` | Markdown string | no | none | Shown under the image |
| `width` | `content`, `wide` or `full` | no | `content` | `full` breaks out of the container (not inside `split`) |

```yaml
- type: image
  image:
    src: ../../assets/media/abc123/photo.avif
    alt: "A portrait on a beach at dusk"
  caption: "Taken on the Dorset coast."
  width: content
```

### `gallery`

A grid of images that open in a dialog lightbox.

| Field | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `heading` | string | no | none | Section heading |
| `images` | list, at least 1 | yes | none | Each item is an image reference plus `caption` (optional) |

```yaml
- type: gallery
  heading: "Gallery"
  images:
    - src: ../../assets/media/abc123/one.avif
      alt: "The first photo"
      caption: "First."
    - src: ../../assets/media/abc123/two.avif
      alt: "The second photo"
```

### `cards`

Links to other pages or to external sites, from a manual list or a query.

| Field | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `heading` | string | no | none | Section heading |
| `variant` | `full`, `image` or `text` | no | `full` | `full` shows image, title and text. `image` shows image and title. `text` shows text only |
| `columns` | integer 1 to 4 | no | `3` | Columns on wide screens (fewer on narrow screens) |
| `surface` | `default`, `muted` or `inverse` | no | `default` | Background colour |
| `items` | list of card items | no | none | Manual cards (see below) |
| `query` | query | no | none | Cards generated from a collection |

Card item:

| Field | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `title` | string | yes | none | Card title |
| `text` | Markdown string | no | none | Card text |
| `image` | image reference | no | none | Card image. Use `decorative: true` if it repeats the title |
| `href` | path or URL | no | none | Makes the card a link. No `href` shows the title only |

Use either `items` or `query`. Both are optional in the schema, so the build will not stop you from giving both; the output will be unclear.

```yaml
- type: cards
  heading: "Related"
  variant: text
  columns: 2
  items:
    - title: "The Imposter"
      text: "A free party game built with Angular and SignalR."
      href: /software/the-imposter/
```

```yaml
- type: cards
  heading: "From a query"
  query:
    from: articles
    limit: 3
```

### `listing`

A full list or grid of items from a query. Use it for feeds and archives.

| Field | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `heading` | string | no | none | Section heading |
| `variant` | `grid`, `list` or `notes` | no | `grid` | Layout. `notes` is a compact feed for notes |
| `query` | query | yes | none | Which items to list |

```yaml
- type: listing
  heading: "Notes"
  variant: notes
  query:
    from: articles
    kind: note
```

### `logoWall`

Client or partner logos in a row, grey until hover.

| Field | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `heading` | string | no | none | Section heading |
| `logos` | list, at least 1 | yes | none | Each item below |

Logo item:

| Field | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `name` | string, min 1 char | yes | none | Client name. Used as the alt text |
| `logo` | image path | yes | none | An image path. Not an image reference: there is no `alt` or `decorative` field |
| `href` | URL | no | none | Link to the client's site (must be a full `https://` URL) |

```yaml
- type: logoWall
  heading: "People I have worked with"
  logos:
    - name: "Client One"
      logo: ../../assets/media/abc123/client-one.avif
      href: https://example.com/
```

### `quote`

A pull quote, with an optional attribution and source.

| Field | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `text` | string | yes | none | The quote |
| `attribution` | string | no | none | Who said it |
| `source` | URL | no | none | Where it came from (must be a full URL) |

```yaml
- type: quote
  text: "Good design is as little design as possible."
  attribution: "Dieter Rams"
  source: https://www.vitsoe.com/
```

### `code`

A code sample with syntax highlighting. Long lines scroll inside the block.

| Field | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `lang` | string | no | `text` | Language for highlighting, e.g. `js`, `powershell`, `bash` |
| `code` | string | yes | none | The code, as a literal block |
| `filename` | string | no | none | Shown above the code |

```yaml
- type: code
  lang: bash
  filename: "install.sh"
  code: |
    pnpm install --frozen-lockfile
```

### `nextPrev`

Previous and next links, for docs and series.

| Field | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `prev` | `{ title, href }` | no | none | Previous page |
| `next` | `{ title, href }` | no | none | Next page |

`software` docs in a series get this automatically from `series` and `order`. Add the block by hand only for other pages.

```yaml
- type: nextPrev
  next:
    title: "Deploying using Git"
    href: /software/xstatic-for-umbraco/deploying-using-git/
```

### `timeline`

A dated list: roles, certifications, milestones, education.

| Field | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `heading` | string | no | none | Section heading |
| `items` | list, at least 1 | yes | none | Each item below |

Timeline item:

| Field | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `when` | string | yes | none | Quote it: `"2021"`, `"March 2022"`, `"2019 to present"` |
| `title` | string | yes | none | Role, qualification or milestone |
| `org` | string | no | none | Organisation |
| `kind` | `role`, `cert`, `milestone` or `education` | no | `role` | Affects the label |
| `body` | Markdown string | no | none | Detail |

```yaml
- type: timeline
  heading: "Timeline"
  items:
    - when: "2021"
      title: "Accessibility certification"
      org: "Example Institute"
      kind: cert
      body: "Passed the practitioner exam."
```

### `embed`

A YouTube video behind a click-to-load facade. Nothing loads from YouTube until the reader clicks.

| Field | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `provider` | `youtube` | yes | none | Only YouTube is supported |
| `id` | string, 6 to 20 characters of letters, digits, `_` or `-` | yes | none | The video id from the URL |
| `title` | string, min 1 char | yes | none | Accessible title of the video |
| `poster` | image reference | no | none | Replaces the default thumbnail |

```yaml
- type: embed
  provider: youtube
  id: dQw4w9WgXcQ
  title: "Example video"
```

### `split`

Two columns of blocks side by side. Stacks on narrow screens.

| Field | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `ratio` | `1:1`, `1:2` or `2:1` | no | `1:1` | Column widths |
| `reverseOnMobile` | boolean | no | `false` | Show the second column first on narrow screens |
| `columns` | two lists of blocks | yes | none | `[left, right]`. Each block is any leaf block |

Gotchas: a `split` cannot contain another `split`. Columns hold only leaf blocks. Full-width images are not full width inside a column.

```yaml
- type: split
  ratio: "1:2"
  columns:
    - - type: intro
        heading: "Left"
        lead: "A short lead in the narrow column."
    - - type: prose
        markdown: "The wider column holds the detail."
```

### section

One full-width band (background and spacing) holding blocks in order: a heading and the cards under it, say. This is how the original site was built, and it keeps a heading close to its content. The child blocks render inside the band, so their own `surface` is ignored.

| Field | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `surface` | `default`, `muted` or `inverse` | no | `default` | Background of the band |
| `spacing` | `none`, `small` or `normal` | no | `normal` | Padding above and below (0, 25px or 70px on desktop) |
| `blocks` | list of blocks | yes | none | Any leaf block except `hero` |

Gotchas: no `hero`, `split` or `section` inside a section. An `image` with `backdrop: blurred` is a band of its own, so keep it outside.

```yaml
- type: section
  surface: muted
  blocks:
    - type: intro
      heading: "Soft skills"
    - type: cards
      variant: text
      columns: 3
      items:
        - title: "Public speaking"
          text: "..."
```

## Checking your work

- `pnpm check` validates types and content against the schema.
- `pnpm build` validates everything, writes `_redirects`, and fails on broken images, missing alt, chained or looping redirects, and missing redirect targets.
- The unlisted style guide page `/style-guide/components/` shows every block and variant, with its YAML. Its examples are in `src/content/style-guide/components.yaml`, validated by the block schema at build time. Do not link to it from public pages.
