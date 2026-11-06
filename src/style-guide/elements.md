Headings are sentence case. This sample is rendered by Astro's own Markdown pipeline, the same one that renders article bodies, so the Prism highlighting and heading ids match what ships.

# Heading level 1

Body text sits at the measure, which is about 68 characters of Mona Sans. Lines this long are easy to follow without losing your place, and the rest of the page is built around that width. Paragraphs have a little space between them and no indent.

## Heading level 2

A second paragraph, with a [link to the articles](/articles/) that goes to a real page on this site, and an [external link to the Prism project](https://prismjs.com/) that highlights the code in the Code section. Links are underlined and change colour on hover. Visited links keep the same colour, so use the link text to say where it goes.

_Emphasis_ is italic, and **strong** text is heavier. Use `inline code` for names, commands and values that appear in the text, such as `pnpm build` or `--frozen-lockfile`. <small>Small text is for side notes and small print, and it shrinks with the scale.</small>

### Heading level 3

Lists are for things that really are a list. Unordered lists use disc bullets, and each item sits on its own line.

- Unordered item one
- Unordered item two, which is long enough to wrap onto a second line so the hanging indent can be checked
  - A nested item, indented one level
  - Another nested item
    - A third level, rarely needed
- Unordered item three

Ordered lists count up from one. Numbers are right-aligned in the margin.

1. Install the dependencies with `pnpm install --frozen-lockfile`.
2. Run the checks.
3. Build the site and look at the output in `dist/`.

#### Heading level 4

A blockquote is for a quotation or a note from someone else. It gets an orange rule down the left side.

> The best thing about a style guide is that it tells you when a change has gone wrong, before anyone else notices.

##### Heading level 5

Tables get a border on every cell and a little padding. On narrow screens they scroll sideways inside the table, not the page.

| Element      | Used for                         | Where it is styled |
| ------------ | -------------------------------- | ------------------ |
| `h1` to `h6` | Sections and sub-sections        | `global.css`       |
| `blockquote` | Quotations and asides            | `.prose`           |
| `table`      | Data that has rows and columns   | `.prose`           |
| `code`       | Names, commands and short values | `:not(pre) > code` |

###### Heading level 6

Heading level 6 is the smallest heading. It is the same size as body text, bolder, and used sparingly.

A horizontal rule separates two parts of a page that are related but not the same.

---

Images sit centred, with rounded corners and alt text on every meaningful image. Markdown has no caption element, so the caption is a short paragraph straight after the image.

![XStatic packages, a sample image from an article](../assets/media/03taqad3/xstatic-packages.avif)

_Figure: the image above, with the caption as the paragraph beneath it._
