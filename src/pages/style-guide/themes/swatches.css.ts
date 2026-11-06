/**
 * The themes page's swatch stylesheet (ticket 1303). Generated at build time from every page theme
 * file, so each swatch matches the value its theme sets. A stylesheet file, not inline styles, so the
 * strict CSP (style-src 'self') allows it.
 */
import { themeSwatchCss } from '../../../lib/tokens';

export const prerender = true;

export function GET() {
  return new Response(themeSwatchCss(), {
    headers: { 'Content-Type': 'text/css; charset=utf-8' },
  });
}
