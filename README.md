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
- SEO titles and descriptions: `src/data/seo.ts` (product texts are generated from product data)
- Original formatted product descriptions: `src/data/popisy.json`
- PDF data sheets: `public/soubory/`
- Images: `public/img/`

## Design
1:1 rebuild of the original Webflow site: original stylesheet (`src/styles/webflow.css`), original images and icons (`public/assets`, `public/img/orig`) and the original interactions re-implemented without Webflow/jQuery in `src/scripts/webflow-lite.ts`.
Previous own-design version: git tag `v1-vlastni-styl`.

## SEO
`/sitemap.xml` is generated at build time, `robots.txt` is in `public/`. `*.vercel.app` deployments send `X-Robots-Tag: noindex`.

## Tracking
Google Tag Manager `GTM-KPHB2GWX` (same container as the old site; it also loads the CookieYes banner).
It only runs on `*.chemap.cz`, so test deployments don't affect statistics.

## Development
```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # type check + static build to dist/
```
