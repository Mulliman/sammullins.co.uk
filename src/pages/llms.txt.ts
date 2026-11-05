/**
 * /llms.txt (ticket 901): a map of the site for language models, linking to the Markdown twins.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { urlFor, type AnyEntry } from '../lib/content';

const SITE = 'https://www.sammullins.co.uk';
const line = (e: AnyEntry) => `- [${e.data.title}](${SITE}${urlFor(e)}index.md): ${e.data.description}`;

export const GET: APIRoute = async () => {
  const pages = (await getCollection('pages')).filter((p) => !p.data.hidden && !p.data.noindex);
  const articles = (await getCollection('articles')).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const software = (await getCollection('software')).filter((s) => !s.id.includes('/'));
  const current = articles.filter((a) => !a.data.archived);
  const archived = articles.filter((a) => a.data.archived);

  const body = `# Sam Mullins

> Personal site of Sam Mullins, a UK software developer moving from CMS web development (Umbraco, Sitecore, .NET) into AI-assisted engineering. Every page here is also available as Markdown: add \`index.md\` to any URL.

Pages are written by Sam, or by Sam with AI help; each page's \`authorship\` field says which. Source code: https://github.com/Mulliman/sammullins.co.uk

## Pages

${pages.map(line).join('\n')}

## Articles

${current.length ? current.map(line).join('\n') : '- (new articles coming soon)'}

## Software

${software.map(line).join('\n')}

## Optional

${archived.map(line).join('\n')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
