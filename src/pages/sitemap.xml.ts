import type { APIRoute } from 'astro';
import { kategorie, produkty } from '../data/katalog';

/** Generated sitemap at the same address as on the old site (/sitemap.xml). */
export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('https://www.chemap.cz');
  const lastmod = new Date().toISOString().slice(0, 10);
  const cesty = [
    '/',
    '/katalog',
    '/kontakty',
    ...kategorie.map((k) => `/kategorie-produktu/${k.slug}`),
    ...produkty.map((p) => `/produkty/${p.slug}`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${cesty
  .map((c) => `  <url><loc>${new URL(c, base).href.replace(/\/$/, c === '/' ? '/' : '')}</loc><lastmod>${lastmod}</lastmod></url>`)
  .join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
