// Reads the block schema from the SOURCE TEXT of src/content.config.ts. No import, no build.
//
// Shared by scripts/skills/block-catalogue.mjs (the generated catalogue), the style guide's components
// page (src/pages/style-guide/components/index.astro) and its test, so the fields and enum options shown
// on the site come from the same parse as the catalogue.
//
// Best effort: it understands the object-literal shapes used in content.config.ts. If the schema is
// restructured and the output looks wrong, fix the parser here rather than working round it.

const PAIRS = { '(': ')', '[': ']', '{': '}' };

/** Index of the bracket that closes the one opened at `openIdx`. Quoted text is skipped. */
export function matchClose(text, openIdx) {
  const stack = [];
  let quote = null;
  for (let i = openIdx; i < text.length; i++) {
    const c = text[i];
    if (quote) {
      if (c === '\\') i++;
      else if (c === quote) quote = null;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') quote = c;
    else if (PAIRS[c]) stack.push(PAIRS[c]);
    else if (c === stack.at(-1)) {
      stack.pop();
      if (stack.length === 0) return i;
    }
  }
  throw new Error(`unbalanced brackets from offset ${openIdx}`);
}

/**
 * Removes // and block comments and leaves strings alone (a glob such as '**\/*.md' is not a comment).
 * Without this, a doc comment above a field would hide the field from the parser.
 */
export function stripComments(text) {
  let out = '';
  let quote = null;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quote) {
      out += c;
      if (c === '\\') out += text[++i] ?? '';
      else if (c === quote) quote = null;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') {
      quote = c;
      out += c;
    } else if (c === '/' && text[i + 1] === '*') {
      const end = text.indexOf('*/', i + 2);
      i = end === -1 ? text.length : end + 1;
      out += ' ';
    } else if (c === '/' && text[i + 1] === '/') {
      const end = text.indexOf('\n', i);
      i = end === -1 ? text.length : end - 1;
    } else {
      out += c;
    }
  }
  return out;
}

/** Split a string on commas that sit at bracket depth 0 and outside quotes. */
export function splitTopLevel(body) {
  const parts = [];
  let depth = 0;
  let quote = null;
  let start = 0;
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (quote) {
      if (c === '\\') i++;
      else if (c === quote) quote = null;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') quote = c;
    else if ('([{'.includes(c)) depth++;
    else if (')]}'.includes(c)) depth--;
    else if (c === ',' && depth === 0) {
      parts.push(body.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(body.slice(start));
  return parts.map((p) => p.trim()).filter(Boolean);
}

/** The values in a `z.enum([...])` list (the text between the brackets). */
function enumValues(list) {
  return [...list.matchAll(/'([^']*)'/g)].map((m) => m[1]);
}

/** The fields of an object literal that starts at `{`. */
function fieldsOf(objText) {
  const close = matchClose(objText, 0);
  return splitTopLevel(objText.slice(1, close))
    .map((part) => {
      const kv = part.match(/^([A-Za-z_]\w*)\s*:\s*([\s\S]+)$/);
      return kv ? { key: kv[1], expr: kv[2].trim() } : null;
    })
    .filter(Boolean);
}

/**
 * Parses the schema. Returns:
 * - `blocks`: block type name → its fields, in schema order (`type` included)
 * - `shared`: top-level `const x = z.enum(...)` or `const x = z.object(...)` pieces, by name
 */
export function parseSchema(source) {
  const text = stripComments(source);

  const shared = new Map();
  for (const m of text.matchAll(/^const (\w+) = z\.(enum|object)\(/gm)) {
    const [head, name, kind] = m;
    const open = m.index + head.length - 1;
    const inner = text.slice(open + 1, matchClose(text, open)).trim();
    shared.set(
      name,
      kind === 'enum' ? { kind: 'enum', values: enumValues(inner) } : { kind: 'object', fields: fieldsOf(inner) },
    );
  }

  // Every block type is identified by its `type: z.literal('<name>')` line.
  const blocks = new Map();
  for (const m of text.matchAll(/\btype:\s*z\.literal\('([A-Za-z]+)'\)/g)) {
    const name = m[1];
    if (blocks.has(name)) continue;
    // The enclosing object is the nearest `z.object({` before the literal.
    const objStart = text.lastIndexOf('z.object({', m.index);
    if (objStart < 0) throw new Error(`no z.object before literal '${name}'`);
    blocks.set(name, fieldsOf(text.slice(text.indexOf('{', objStart))));
  }
  return { blocks, shared };
}

const tidy = (expr) => expr.replace(/\s+/g, ' ').replace(/\(\s+/g, '(').replace(/\s+\)/g, ')').trim();

/** Turns a zod expression into { type, optional, dflt } for the tables. */
export function describeField(expr, shared = new Map()) {
  let dflt = '';
  const d = expr.match(/\.default\(((?:[^()]|\([^()]*\))*)\)/);
  if (d) dflt = d[1].replace(/\s+/g, ' ').trim();
  const optional = /\.optional\(\)/.test(expr);
  const refined = /\.refine\(/.test(expr);
  const head = expr.match(/^[A-Za-z_]\w*/)?.[0];
  const named = head ? shared.get(head) : undefined;
  if (named?.kind === 'enum') return { type: named.values.join(' | '), optional, dflt };

  let type = tidy(expr)
    .replace(/\.default\(((?:[^()]|\([^()]*\))*)\)/g, '')
    .replace(/\.int\(\)/g, '')
    .replace(/\.max\((\d+)\)/g, ' (max $1)')
    .replace(/\.optional\(\)/g, '')
    .replace(/\.refine\([\s\S]*$/, '')
    .replace(/\s*\.and\(/, ' and (')
    .replace(/\bimg\b/g, 'imageRef')
    .replace(/\bz\.string\(\)/g, 'string')
    .replace(/\bz\.coerce\.string\(\)/g, 'string (coerced)')
    .replace(/\bz\.coerce\.date\(\)/g, 'date')
    .replace(/\bz\.number\(\)/g, 'number')
    .replace(/\bz\.boolean\(\)/g, 'boolean')
    .replace(/\bz\.url\(\)/g, 'url')
    .replace(/\bz\.literal\('([^']+)'\)/g, '"$1"')
    .replace(/z\.enum\(\[([^\]]*)\]\)/g, (_, vals) => enumValues(vals).join(' | '))
    .replace(/z\.array\(([^()]*)\)/g, 'list of $1')
    .replace(/\.min\(1\)/g, ' (min 1)');
  if (refined) type += ' (refined: see notes)';
  return { type, optional, dflt };
}

/**
 * Every enum option in a block's fields, with the key it belongs to (`variant`, `kind`, `from`...).
 * Shared pieces are followed, so `surface` and the collection `query` count too.
 */
export function enumOptions(fields, shared = new Map(), seen = new Set()) {
  const out = [];
  for (const { key, expr } of fields) {
    for (const m of expr.matchAll(/(?:(\w+)\s*:\s*)?z\.enum\(\[([^\]]*)\]\)/g)) {
      out.push({ key: m[1] ?? key, values: enumValues(m[2]) });
    }
    for (const token of expr.match(/\b[A-Za-z_]\w*\b/g) ?? []) {
      const s = shared.get(token);
      if (!s || seen.has(token)) continue;
      if (s.kind === 'enum') out.push({ key, values: s.values });
      else out.push(...enumOptions(s.fields, shared, new Set([...seen, token])));
    }
  }
  return out;
}
