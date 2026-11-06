// Ticket 805: the hygiene rules, as pure functions so each one can be tested against a violation.
// hygiene.test.mjs runs them over the repo and dist/; hygiene-rules.test.mjs proves each one fires.

/** A personal gmail address. */
export const GMAIL = /@gmail\.com/i;

/** Google Analytics, Tag Manager or Google Fonts. */
export const GOOGLE_TRACKING_OR_FONTS = /googletagmanager|google-analytics|gtag\(|fonts\.googleapis|fonts\.gstatic/i;

/** A legacy UIkit class in rendered HTML. */
export const UIKIT_CLASS = /class="[^"]*\buk-[a-z]/;

/** An inline style attribute on an HTML element (SVG presentation markup is exempt). */
export const INLINE_STYLE = /<(?!svg|path|g|stop|linearGradient)[a-z][\w-]*\s[^>]*\sstyle="/i;

/** `set:html` is allowed only with sanitising helpers or trusted build-time assets. */
export const SET_HTML_ALLOWED =
  /set:html=\{(md\(|mdInline\(|logo\}|logoSvg\}|footerLogo\}|JSON\.stringify\(|html\}|bodyHtml|leadHtml|textHtml|quoteHtml|captionHtml)/;

/** Lines in an .astro file that use set:html without an allowed helper. */
export const unsafeSetHtml = (source) =>
  source.split('\n').filter((line) => line.includes('set:html') && !SET_HTML_ALLOWED.test(line));

/** `<img>` tags with no alt attribute (a bare `alt` counts as alt=""). */
export const imgsWithoutAlt = (html) =>
  [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]).filter((tag) => !/\salt(=|\s|>)/.test(tag));

/** Links that open a new tab without rel="noopener". */
export const unsafeBlankTargets = (html) =>
  [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)]
    .map((m) => m[0])
    .filter((tag) => !/rel="[^"]*noopener/.test(tag));

/** A page without a CSP meta tag. */
export const hasCspMeta = (html) => /http-equiv="content-security-policy"/i.test(html);

/** sharp metadata → does the image carry EXIF (which may include GPS)? */
export const hasExif = (metadata) => Boolean(metadata.exif && metadata.exif.length > 0);
