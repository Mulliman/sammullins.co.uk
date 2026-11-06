/**
 * Markdown for short strings inside blocks (intro leads, card text, callouts, prose blocks).
 * Long-form content goes in the file's Markdown body instead (the `body` block), which
 * uses Astro's own pipeline with Prism highlighting.
 *
 * Raw HTML in block strings is escaped, not rendered (ticket 302).
 */
import { Marked, type Tokens } from 'marked';

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * The code figure (tickets 307, 1005): optional filename, a bar with the language and a Copy button,
 * and the code. The `code` block, `steps` and fenced code in block Markdown all render this one
 * markup; its styles are in global.css and the Copy script is CopyCode.astro, loaded on every page.
 */
export function codeFigure({
  lang = 'text',
  code,
  filename,
}: {
  lang?: string | undefined;
  code: string;
  filename?: string | undefined;
}) {
  const safeLang = lang.replace(/[^a-z0-9-]/gi, '') || 'text';
  const cls = `language-${safeLang}`;
  return figureShell(safeLang, code, filename, `<code class="${cls}">${escapeHtml(code)}</code>`, `class="${cls}"`);
}

/**
 * The figure around a <pre>. `codeHtml` is the pre's inner HTML (escaped text, or Prism's token spans
 * for the page body); `code` is the plain text, used for the region's name.
 */
function figureShell(lang: string, code: string, filename: string | undefined, codeHtml: string, preAttrs: string) {
  // Each scrollable region needs a unique name (html-validate unique-landmark), so name it after its
  // first line as well as its language or filename.
  const first = code.trim().split('\n')[0]!.trim();
  const gist = first.length > 48 ? `${first.slice(0, 47)}…` : first;
  const label = `${filename ? `Code: ${filename}` : `Code (${lang})`}${gist ? `, ${gist}` : ''}`;
  return (
    `<figure class="code" data-code>` +
    (filename ? `<figcaption class="code__filename">${escapeHtml(filename)}</figcaption>` : '') +
    `<div class="code__bar"><span class="code__lang">${lang}</span>` +
    `<button type="button" class="code__copy js-only" data-copy>Copy</button></div>` +
    `<pre ${preAttrs} tabindex="0" role="region" aria-label="${escapeHtml(label)}">${codeHtml}</pre>` +
    `<p class="visually-hidden" aria-live="polite" data-copy-status></p>` +
    `</figure>`
  );
}

const unescapeHtml = (s: string) =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;|&#34;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&amp;/g, '&');
const textOf = (html: string) => unescapeHtml(html.replace(/<[^>]+>/g, ''));

/** Adds the stacking class and each cell's column name to tables in rendered HTML (ticket 1005). */
function stackTables(html: string): string {
  return html.replace(/<table(\s[^>]*)?>([\s\S]*?)<\/table>/g, (whole, attrs = '', inner: string) => {
    if (/table-stack/.test(attrs)) return whole;
    const head = inner.match(/<thead[^>]*>([\s\S]*?)<\/thead>/)?.[1] ?? '';
    const labels = [...head.matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/g)].map((m) => textOf(m[1]!).trim());
    if (!labels.length) return whole;
    const body = inner.replace(/<tr\b[^>]*>[\s\S]*?<\/tr>/g, (row) => {
      if (/<th\b/.test(row)) return row;
      let i = 0;
      return row.replace(/<td\b([^>]*)>/g, (_m, a: string) => {
        const label = labels[i++];
        return label ? `<td${a} data-label="${escapeHtml(label)}">` : `<td${a}>`;
      });
    });
    return `<table class="table-stack"${attrs}>${body}</table>`;
  });
}

/**
 * The page's Markdown body, rendered by Astro (tickets 313, 1005): each Prism-highlighted <pre>
 * becomes the shared code figure (bar, Copy button, named scroll region) with its tokens kept, and
 * tables stack on a phone, the same as code and tables in block Markdown.
 */
export function enhanceBodyHtml(html: string): string {
  const withFigures = html.replace(
    /<pre class="language-([\w-]+)"[^>]*>([\s\S]*?)<\/pre>/g,
    (_m, lang: string, inner: string) => figureShell(lang, textOf(inner), undefined, inner, `class="language-${lang}"`),
  );
  return stackTables(withFigures);
}

/** Plain text of a header cell, for the `data-label` a stacked row shows beside each value. */
const plain = (s: string) => s.replace(/[*_`~]/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');

const marked = new Marked({
  gfm: true,
  breaks: false,
  renderer: {
    html({ text }) {
      return escapeHtml(text);
    },
    code({ text, lang }) {
      return codeFigure({ lang: lang?.split(/\s/)[0] || 'text', code: text });
    },
    // Tables (ticket 1005): each cell carries its column name, so on a phone a row stacks into
    // label and value pairs instead of scrolling sideways. See `.table-stack` in global.css.
    table(token: Tokens.Table) {
      const cell = (c: Tokens.TableCell, tag: 'th' | 'td', label?: string) => {
        const align = c.align ? ` class="align-${c.align}"` : '';
        const data = label ? ` data-label="${escapeHtml(plain(label))}"` : '';
        return `<${tag}${align}${data}>${this.parser.parseInline(c.tokens)}</${tag}>`;
      };
      const head = `<tr>${token.header.map((c) => cell(c, 'th')).join('')}</tr>`;
      const rows = token.rows
        .map((r) => `<tr>${r.map((c, i) => cell(c, 'td', token.header[i]?.text)).join('')}</tr>`)
        .join('');
      return `<table class="table-stack"><thead>${head}</thead><tbody>${rows}</tbody></table>\n`;
    },
  },
});

/** Block Markdown isn't processed by astro:assets, so relative image paths would ship as broken images. */
function assertNoRelativeImages(source: string): void {
  const m = source.match(/!\[[^\]]*\]\((?!https?:|\/)[^)]+\)/);
  if (m) {
    throw new Error(`Relative image in block Markdown: ${m[0]}. Use an \`image\` block (or the page body) instead.`);
  }
}

/** Render a block of Markdown to HTML. */
export function md(source: string | undefined): string {
  if (!source) return '';
  assertNoRelativeImages(source);
  return marked.parse(source, { async: false });
}

/** Render a single line of Markdown (no wrapping <p>). */
export function mdInline(source: string | undefined): string {
  if (!source) return '';
  return marked.parseInline(source, { async: false });
}
