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
- Categories, product order, product photos: `src/data/katalog.ts`
- PDF data sheets: `public/soubory/`
- Images: `public/img/`

## Photos still to be supplied by the client
Yellow/grey panels with a category icon (`FotoMisto` component) mark where client photos go:
homepage (4 category blocks + "O nás") and product photos.

## Tracking
Google Tag Manager `GTM-KPHB2GWX` (same container as the old site; it also loads the CookieYes banner).
It only runs on `*.chemap.cz`, so test deployments don't affect statistics.

## Development
```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # type check + static build to dist/
```
