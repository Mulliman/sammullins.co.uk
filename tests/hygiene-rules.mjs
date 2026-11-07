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
  /set:html=\{(md\(|mdInline\(|codeFigure\(|logo\}|logoSvg\}|footerLogo\}|JSON\.stringify\(|html\}|bodyHtml|leadHtml|textHtml|quoteHtml|captionHtml)/;

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

/* ------------------------------------------------------------------ */
/* Colours (ticket 207): literals only in src/styles/themes/           */
/* ------------------------------------------------------------------ */

/** Files allowed to contain colour literals: the theme folder. */
export const COLOUR_ALLOWED = /^src\/styles\/themes\//;

const NAMED =
  'white|black|red|green|blue|yellow|orange|purple|pink|gr[ae]y|silver|navy|maroon|teal|olive|lime|aqua|fuchsia|gold|brown|beige|ivory|crimson|coral|salmon|tomato|indigo|violet|cyan|magenta|turquoise|khaki|lavender';
const COLOUR_PATTERNS = [
  // #rgb, #rgba, #rrggbb, #rrggbbaa (not URL fragments such as href="#top" or url(#gradient))
  /(?<![\w&/#-]|href="|url\()#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})(?![\w-])/i,
  // colour functions
  /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/i,
  // named colours in a CSS declaration or an SVG/HTML attribute
  new RegExp(
    String.raw`(?:color|background(?:-color)?|border(?:-[a-z]+)*|outline(?:-color)?|fill|stroke|box-shadow|text-shadow|accent-color|caret-color)\s*[:=]\s*["']?[^;{}"'\n]*\b(?:${NAMED})\b`,
    'i',
  ),
];

/** Lines of `source` that contain a colour literal. */
export const colourLiterals = (source) =>
  source
    .split('\n')
    .map((line, i) => ({ line: i + 1, text: line.trim() }))
    // Custom property names ("--brand-orange") aren't colours; fallbacks such as var(--x, #fff) still are.
    .filter(({ text }) => COLOUR_PATTERNS.some((re) => re.test(text.replace(/--[\w-]+/g, ''))));

/**
 * Fixed px spacing (ticket 205): padding, margin, gap or an offset of 3px or more. Spacing uses the
 * fluid --space-* tokens in global.css. 1px and 2px are hairline geometry (borders, nudges), not spacing.
 */
const FIXED_SPACING =
  /^\s*(?:padding|margin|gap|row-gap|column-gap|inset|top|bottom|left|right|--gap|padding-[a-z-]+|margin-[a-z-]+|inset-[a-z-]+)\s*:[^;]*?(?<![\w.-])(?:[3-9]|[1-9]\d+)(?:\.\d+)?px/;

/** Lines of `source` that set spacing in fixed px. */
export const fixedSpacing = (source) =>
  source
    .split('\n')
    .map((text, i) => ({ line: i + 1, text }))
    .filter(({ text }) => FIXED_SPACING.test(text));

/**
 * Literal type (ticket 208): a font-size in px or rem, or a line-height as a number, px or rem. Sizes use
 * the --step-* scale and leading the --leading-* roles in global.css. Relative font sizes (em, %) are fine.
 */
const TYPE_LITERAL =
  /^\s*(?:font-size\s*:\s*[^;]*?(?<![\w.-])\d*\.?\d+(?:px|rem)\b|line-height\s*:\s*(?:\d*\.?\d+(?:px|rem)?)\s*(?:!important)?\s*;)/;

/** Lines of `source` that set a font size or line height with a literal value. */
export const typeLiterals = (source) =>
  source
    .split('\n')
    .map((text, i) => ({ line: i + 1, text }))
    .filter(({ text }) => TYPE_LITERAL.test(text));
