// ESLint flat config (ticket 005).
// - eslint-plugin-astro: lints .astro components (frontmatter + template).
// - jsx-a11y via astro's "jsx-a11y-strict" config: static a11y checks in templates; axe (tests/a11y) covers the rendered output.
// - typescript-eslint: parses TS in .ts files and .astro frontmatter.
import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default [
  {
    ignores: ['dist/', '.astro/', 'node_modules/', '.claude/', 'public/', 'scripts/migrate/'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  ...astro.configs['jsx-a11y-strict'],
  {
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      // Horizontally scrolling code (<pre role="region" tabindex="0">) must be keyboard-focusable (WCAG 2.1.1, axe scrollable-region-focusable).
      'astro/jsx-a11y/no-noninteractive-tabindex': ['error', { roles: ['region'], tags: [] }],
    },
  },
];
