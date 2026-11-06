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
  // Each scrollable region needs a unique name (html-validate unique-landmark), so name it after its
  // first line as well as its language or filename.
  const first = code.trim().split('\n')[0]!.trim();
  const gist = first.length > 48 ? `${first.slice(0, 47)}…` : first;
  const label = `${filename ? `Code: ${filename}` : `Code (${safeLang})`}${gist ? `, ${gist}` : ''}`;
  return (
    `<figure class="code" data-code>` +
    (filename ? `<figcaption class="code__filename">${escapeHtml(filename)}</figcaption>` : '') +
    `<div class="code__bar"><span class="code__lang">${safeLang}</span>` +
    `<button type="button" class="code__copy js-only" data-copy>Copy</button></div>` +
    `<pre class="${cls}" tabindex="0" role="region" aria-label="${escapeHtml(label)}"><code class="${cls}">${escapeHtml(code)}</code></pre>` +
    `<p class="visually-hidden" aria-live="polite" data-copy-status></p>` +
    `</figure>`
  );
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
