/**
 * Markdown for short strings inside blocks (intro leads, card text, callouts, prose blocks).
 * Long-form content goes in the file's Markdown body instead (the `body` block), which
 * uses Astro's own pipeline with Prism highlighting.
 *
 * Raw HTML in block strings is escaped, not rendered (ticket 302).
 */
import { Marked } from 'marked';

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const marked = new Marked({
  gfm: true,
  breaks: false,
  renderer: {
    html({ text }) {
      return escapeHtml(text);
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
