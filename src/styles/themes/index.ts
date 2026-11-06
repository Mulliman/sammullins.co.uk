/**
 * Page themes (ticket 207). A page picks one with `theme:` in its front matter; `default` adds nothing.
 * To add a theme: create `<name>.css` in this folder (copy christmas.css) and add the name here. BaseLayout
 * loads every .css file in this folder, and the schema and the style guide's themes page read this list.
 */
export const pageThemes = ['default', 'christmas'] as const;
export type PageTheme = (typeof pageThemes)[number];
