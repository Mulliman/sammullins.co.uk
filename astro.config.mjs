// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import siteFiles from './integrations/site-files.mjs';

// Ticket 003: static, URL-identical output (trailing slash, directory format).
export default defineConfig({
  site: 'https://www.sammullins.co.uk',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'never',
  },
  prefetch: false,
  devToolbar: { enabled: false },
  integrations: [
    siteFiles(),
    sitemap({
      // Style guide example pages (ticket 1306) are hidden and noindex; keep them out of the sitemap too.
      filter: (page) =>
        !page.includes('/secret/') && !page.includes('/style-guide/') && !page.includes('/page-structure-example'),
    }),
  ],
  image: {
    // Responsive AVIF/WebP generated at build time from AVIF masters (ticket 402).
    responsiveStyles: true,
  },
  markdown: {
    // Prism (class-based) instead of Shiki: Shiki's inline styles are incompatible with the strict CSP.
    syntaxHighlight: 'prism',
  },
  security: {
    // Ticket 702: Astro emits a CSP <meta> with hashes for every script and style it produces.
    // Headers that cannot live in <meta> (frame-ancestors etc.) are set in netlify.toml.
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self' https://sammullins.goatcounter.com",
        'frame-src https://www.youtube-nocookie.com',
        "base-uri 'none'",
        "form-action 'none'",
        "object-src 'none'",
      ],
    },
  },
});
