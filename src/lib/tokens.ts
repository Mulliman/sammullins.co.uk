/**
 * Build-time readers for the design tokens (ticket 1302).
 *
 * The foundations page reads src/styles/themes/default.css and src/styles/global.css here, so a
 * token added to the theme appears in the guide with no other change. Nothing in the guide copies
 * a value by hand. The generated tokens.css endpoint uses the same readers, so the swatch classes
 * always match the tokens on the page.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const THEME_FILE = 'src/styles/themes/default.css';
const GLOBAL_FILE = 'src/styles/global.css';

/** Root font size used to show rem values in px (the browser default). */
const ROOT_PX = 16;

/** WCAG AA minimum for text. Anything below this is flagged on the page. */
export const TEXT_CONTRAST_MIN = 4.5;

export interface ColourToken {
  name: string;
  slug: string;
  light: string;
  dark: string;
  /** True when the dark block does not set the token, so the light value applies in dark mode too. */
  sameInDark: boolean;
  note: string;
}

export interface ColourGroup {
  title: string;
  slug: string;
  tokens: ColourToken[];
}

export interface ScaleToken {
  name: string;
  slug: string;
  value: string;
  note: string;
}

export type ScaleCategory =
  | 'font'
  | 'step'
  | 'weight'
  | 'leading'
  | 'tracking'
  | 'space'
  | 'radius'
  | 'measure'
  | 'container'
  | 'duration'
  | 'ease';

export interface Contrast {
  /** The token the text sits on, e.g. --color-bg. */
  background: string;
  light: number;
  dark: number;
}

interface Declaration {
  kind: 'decl';
  name: string;
  value: string;
  note: string;
}
interface GroupMarker {
  kind: 'group';
  title: string;
}

function read(file: string): string {
  return readFileSync(join(process.cwd(), file), 'utf8');
}

/** The bodies of every block whose opening matches `open`, with braces matched (so nesting is safe). */
function blocks(css: string, open: RegExp): string[] {
  const bodies: string[] = [];
  const re = new RegExp(open.source, 'g');
  for (let m = re.exec(css); m; m = re.exec(css)) {
    let depth = 1;
    let i = m.index + m[0].length;
    const start = i;
    for (; i < css.length && depth > 0; i++) {
      if (css[i] === '{') depth++;
      else if (css[i] === '}') depth--;
    }
    bodies.push(css.slice(start, i - 1));
  }
  return bodies;
}

/** The first block whose opening matches `open`, or an empty string. */
function firstBlock(css: string, open: RegExp): string {
  return blocks(css, open)[0] ?? '';
}

/** A regex capture group as a string ('' when the group did not match). */
const cap = (m: RegExpExecArray, i: number): string => m[i] ?? '';

/** The lines of a block, in order: `/* Comment *\/` lines become group markers, `--name: value; /* note *\/` lines declarations. */
function items(body: string): (Declaration | GroupMarker)[] {
  const out: (Declaration | GroupMarker)[] = [];
  for (const raw of body.split('\n')) {
    const line = raw.trim();
    const group = /^\/\*\s*(.+?)\s*\*\/$/.exec(line);
    if (group) {
      out.push({ kind: 'group', title: cap(group, 1) });
      continue;
    }
    const decl = /^(--[\w-]+)\s*:\s*(.+?);\s*(?:\/\*\s*(.*?)\s*\*\/)?$/.exec(line);
    if (decl) out.push({ kind: 'decl', name: cap(decl, 1), value: cap(decl, 2), note: cap(decl, 3) });
  }
  return out;
}

const declarations = (body: string): Declaration[] => items(body).filter((i): i is Declaration => i.kind === 'decl');

const slugOf = (name: string): string => name.replace(/^--/, '');

const titleSlug = (title: string): string =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const isShadow = (name: string): boolean => /^--(text-)?shadow/.test(name);

/** Light and dark values of every colour token, grouped as the comments in default.css group them. */
let colourCache: ColourGroup[] | undefined;
function readColours(): ColourGroup[] {
  if (colourCache) return colourCache;
  const css = read(THEME_FILE);
  const root = firstBlock(css, /:root\s*\{/);
  // The dark block that sets --color-bg (the other dark block only sets color-scheme).
  const dark = blocks(css, /:root\[data-theme='dark'\]\s*\{/).find((b) => /--color-bg\s*:/.test(b)) ?? '';
  const darkValues = new Map(declarations(dark).map((d) => [d.name, d.value]));

  const groups: ColourGroup[] = [];
  let current: ColourGroup | undefined;
  for (const item of items(root)) {
    if (item.kind === 'group') {
      current = { title: item.title, slug: titleSlug(item.title), tokens: [] };
      groups.push(current);
      continue;
    }
    if (isShadow(item.name)) continue;
    if (!current) {
      current = { title: 'Tokens', slug: 'tokens', tokens: [] };
      groups.push(current);
    }
    const darkValue = darkValues.get(item.name);
    current.tokens.push({
      name: item.name,
      slug: slugOf(item.name),
      light: item.value,
      dark: darkValue ?? item.value,
      sameInDark: darkValue === undefined,
      note: item.note,
    });
  }
  colourCache = groups.filter((g) => g.tokens.length > 0);
  return colourCache;
}

/** Colour groups in file order (no shadows). */
export function colourGroups(): ColourGroup[] {
  return readColours();
}

/** Every colour token, in file order. */
export function allColourTokens(): ColourToken[] {
  return readColours().flatMap((g) => g.tokens);
}

/** Box and text shadow tokens from default.css. */
export function shadowTokens(): ScaleToken[] {
  const root = firstBlock(read(THEME_FILE), /:root\s*\{/);
  return declarations(root)
    .filter((d) => isShadow(d.name))
    .map((d) => ({ name: d.name, slug: slugOf(d.name), value: d.value, note: d.note }));
}

const CATEGORIES: [RegExp, ScaleCategory][] = [
  [/^--font-/, 'font'],
  [/^--step-/, 'step'],
  [/^--weight-/, 'weight'],
  [/^--leading-/, 'leading'],
  [/^--tracking-/, 'tracking'],
  [/^--space-/, 'space'],
  [/^--radius$/, 'radius'],
  [/^--measure$/, 'measure'],
  [/^--container(-|$)/, 'container'],
  [/^--dur(-|$)/, 'duration'],
  [/^--ease$/, 'ease'],
];

let scaleCache: (ScaleToken & { category: ScaleCategory })[] | undefined;
function readScale(): (ScaleToken & { category: ScaleCategory })[] {
  if (scaleCache) return scaleCache;
  const root = firstBlock(read(GLOBAL_FILE), /:root\s*\{/);
  scaleCache = declarations(root).flatMap((d) => {
    const hit = CATEGORIES.find(([re]) => re.test(d.name));
    return hit ? [{ name: d.name, slug: slugOf(d.name), value: d.value, note: d.note, category: hit[1] }] : [];
  });
  return scaleCache;
}

/** The scale tokens of one category from global.css, in file order. */
export function scale(category: ScaleCategory): ScaleToken[] {
  return readScale()
    .filter((t) => t.category === category)
    .map(({ category: _category, ...token }) => token);
}

/** A px value from a rem or px token value, or undefined for anything else. */
export function toPx(value: string): number | undefined {
  const rem = /^([\d.]+)rem$/.exec(value.trim());
  if (rem) return Number(rem[1]) * ROOT_PX;
  const px = /^([\d.]+)px$/.exec(value.trim());
  if (px) return Number(px[1]);
  return undefined;
}

/** The min and max px of a `clamp(min, preferred, max)` token value. */
export function clampRange(value: string): { min: number; max: number } | undefined {
  const m = /^clamp\((.+)\)$/.exec(value.trim());
  if (!m) return undefined;
  const parts = cap(m, 1).split(',');
  if (parts.length !== 3) return undefined;
  const min = toPx(parts[0] ?? '');
  const max = toPx(parts[2] ?? '');
  return min === undefined || max === undefined ? undefined : { min, max };
}

/** WCAG relative luminance of a #rgb or #rrggbb value. */
export function relativeLuminance(value: string): number | undefined {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value.trim());
  if (!m) return undefined;
  const digits = cap(m, 1);
  const hex = digits.length === 3 ? [...digits].map((c) => c + c).join('') : digits;
  const channel = (i: number): number => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
}

/** WCAG contrast ratio between two hex colours, or undefined if either is not hex. */
export function contrastRatio(a: string, b: string): number | undefined {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  if (la === undefined || lb === undefined) return undefined;
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Foreground colour tokens that are used as text, so they get a contrast figure. */
const TEXT_LIKE = /^--color-(text|heading|nav|link|note|tip|warning)(-|$)/;

/**
 * Contrast of a text-like token against the background it is meant for: --color-bg-inverse for
 * the inverse tokens, otherwise --color-bg. Returns undefined for tokens that are not text.
 */
export function textContrast(token: ColourToken): Contrast | undefined {
  if (!TEXT_LIKE.test(token.name)) return undefined;
  const backgroundName = token.name.includes('inverse') ? '--color-bg-inverse' : '--color-bg';
  const bg = allColourTokens().find((t) => t.name === backgroundName);
  if (!bg) return undefined;
  const light = contrastRatio(token.light, bg.light);
  const dark = contrastRatio(token.dark, bg.dark);
  if (light === undefined || dark === undefined) return undefined;
  return { background: backgroundName, light, dark };
}

/**
 * The stylesheet behind the guide's swatches and samples: one class per token, using var() so the
 * values stay the theme's own. Served at /style-guide/foundations/tokens.css.
 */
export function tokenCss(): string {
  const rules: string[] = [];
  for (const t of allColourTokens()) rules.push(`.sw-${t.slug} { background-color: var(${t.name}); }`);
  for (const t of shadowTokens()) {
    if (!t.name.startsWith('--text-')) rules.push(`.sh-${t.slug} { box-shadow: var(${t.name}); }`);
  }
  const props: [ScaleCategory, string, string][] = [
    ['font', 'ff', 'font-family'],
    ['step', 'fs', 'font-size'],
    ['weight', 'fw', 'font-weight'],
    ['leading', 'lh', 'line-height'],
    ['tracking', 'ls', 'letter-spacing'],
    ['space', 'bar', 'inline-size'],
    ['radius', 'rd', 'border-radius'],
  ];
  for (const [category, prefix, prop] of props) {
    for (const t of scale(category)) rules.push(`.${prefix}-${t.slug} { ${prop}: var(${t.name}); }`);
  }
  return `/* Generated at build time from src/styles/themes/default.css and src/styles/global.css (ticket 1302). */\n${rules.join('\n')}\n`;
}
