/**
 * The style guide's token stylesheet (ticket 1302). Generated at build time from the theme and
 * global CSS, so every swatch and sample class matches a real token. Linked from the foundations
 * page. A stylesheet file, not inline styles, so the strict CSP (style-src 'self') allows it.
 */
import { tokenCss } from '../../../lib/tokens';

export const prerender = true;

export function GET() {
  return new Response(tokenCss(), {
    headers: { 'Content-Type': 'text/css; charset=utf-8' },
  });
}
