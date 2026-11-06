/**
 * Page themes (ticket 207). A page picks one with `theme:` in its front matter; `default` adds nothing.
 * To add a theme: create `<name>.css` in this folder (copy christmas.css), import it in
 * src/layouts/BaseLayout.astro, and add the name here. The schema reads this list.
 */
export const pageThemes = ['default', 'christmas'] as const;
export type PageTheme = (typeof pageThemes)[number];
