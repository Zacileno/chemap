# CHEMAP – www.chemap.cz

Static website for CHEMAP, spol. s r.o. (Dašice). Built with [Astro](https://astro.build), deployed on Vercel.

## Pages
- `/` – homepage
- `/katalog` – all 68 products (16 per page)
- `/kategorie-produktu/<slug>` – 7 categories
- `/produkty/<slug>` – 68 product pages generated from `src/data/produkty.json`
- `/kontakty` – contacts

URLs are identical to the previous Webflow site.

## Editing content
- Products: `src/data/produkty.json` (name, category, description, basic data, packaging, PDF files)
- Categories, product order, product photos, multi-category products: `src/data/katalog.ts`
- SEO titles, descriptions and image alt texts: `src/data/seo.ts` (product texts are generated from product data)
- PDF data sheets: `public/soubory/`
- Images: `public/img/`

## Images
Product and homepage photos are AI-generated illustrations (Gemini); originals are kept outside the repo. The Xylen photo is the client's own.

## SEO
`/sitemap.xml` is generated at build time, `robots.txt` is in `public/`. `*.vercel.app` deployments send `X-Robots-Tag: noindex`.
Czech non-breaking spaces are added to every page by `src/middleware.ts`.

## Tracking
Google Tag Manager `GTM-KPHB2GWX` (same container as the old site; it also loads the CookieYes banner).
It only runs on `*.chemap.cz`, so test deployments don't affect statistics.

## Development
```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # type check + static build to dist/
```
