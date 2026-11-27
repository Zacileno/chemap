import produktyRaw from './produkty.json';

export type KategorieSlug =
  | 'disperze'
  | 'produkty-pro-slevarenstvi'
  | 'produkty-pro-cistirny'
  | 'lepidla-na-drevo'
  | 'organicka-rozpoustedla'
  | 'sorbenty-a-filtrace'
  | 'ostatni-chemie';

export interface Kategorie {
  slug: KategorieSlug;
  nazev: string;
  /** Short text shown in the homepage icon wheel. */
  perex: string;
  /** Class name used by the homepage icon wheel (as on the original site). */
  kolo: string;
  /** Small round category icon (product chips, catalogue cards, category header). */
  ikona: string;
  /** Large wheel icon and its hover variant. */
  ikonaKolo: string;
  ikonaKoloHover: string;
}

export interface Udaj {
  nazev: string;
  hodnota: string;
}

export interface Baleni {
  obal: string;
  objem: string;
  mnozstvi: string;
}

export interface Soubor {
  nazev: string;
  /** Public URL of the PDF. */
  url: string;
}

export interface Produkt {
  slug: string;
  nazev: string;
  /** Main category (decides the product photo). */
  kategorie: KategorieSlug;
  /** All categories the product is listed in, main one first. */
  vsechnyKategorie: KategorieSlug[];
  popis: string[];
  zakladniUdaje: Udaj[];
  baleni: Baleni[];
  soubory: Soubor[];
  /** Product photo as on the original site. */
  foto: string;
  /** Smaller version for product cards. */
  fotoMala: string;
}

/** Category order as in the original menu. */
export const kategorie: readonly Kategorie[] = [
  {
    slug: 'disperze',
    nazev: 'Disperze',
    perex: 'Zabezpečení dodávek vodných disperzí pro výrobu stavebních hmot, barev, lepidel či tmelů.',
    kolo: 'disperze',
    ikona: '/assets/67c57f2a7eceaa3837d78f14_tm-b1.png',
    ikonaKolo: '/assets/67c1d6859f9c85a2d516ce3e_tm-b1.png',
    ikonaKoloHover: '/assets/67c1d6849f9c85a2d516cd5f_tm-bh1.png',
  },
  {
    slug: 'produkty-pro-slevarenstvi',
    nazev: 'Produkty pro slévárenství',
    perex:
      'Nabízíme přípravky pro zlepšení kvality odlitků, včetně žáruvzdorných nátěrů, penetrací, povrchových tvrdidel, ředidel a separátorů.',
    kolo: 'slevar',
    ikona: '/assets/67c57f4382aba6829d0e4cd2_tm-b2.png',
    ikonaKolo: '/assets/67c1d6852127f0a9ce25c105_tm-b2.png',
    ikonaKoloHover: '/assets/67c1d68413ef4fc99d64b0dc_tm-bh2.png',
  },
  {
    slug: 'produkty-pro-cistirny',
    nazev: 'Produkty pro čistírny',
    perex: 'Dodáváme rozpouštědla a dezinfekční prostředky pro chemické čistírny oděvů.',
    kolo: 'cistirny',
    ikona: '/assets/67c57f4f4efdc9a8fc62b06a_tm-b3.png',
    ikonaKolo: '/assets/67c1d685c5e20cdb79c67fc5_tm-b3.png',
    ikonaKoloHover: '/assets/67c1d6841f28bc27d06144e1_tm-bh3.png',
  },
  {
    slug: 'lepidla-na-drevo',
    nazev: 'Lepidla na dřevo',
    perex: 'Poskytujeme širokou škálu lepidel na bázi modifikované polyvinylacetátové disperze.',
    kolo: 'lepidla',
    ikona: '/assets/67c57f593cca29c0562baeb2_tm-b4.png',
    ikonaKolo: '/assets/67c1d68592a78ec9c8ca4552_tm-b4.png',
    ikonaKoloHover: '/assets/67c1d6843d4b48c440be0e16_tm-bh4.png',
  },
  {
    slug: 'organicka-rozpoustedla',
    nazev: 'Organická rozpouštědla',
    perex: 'Zajišťujeme dodávky organických rozpouštědel pro různé průmyslové aplikace.',
    kolo: 'organica',
    ikona: '/assets/67c57f65f020ad398dfafccb_tm-b5.png',
    ikonaKolo: '/assets/67c1d68579b4b0b6a2773007_tm-b5.png',
    ikonaKoloHover: '/assets/67c1d68406e5b0084d97b1ca_tm-bh5.png',
  },
  {
    slug: 'sorbenty-a-filtrace',
    nazev: 'Sorbenty a filtrace',
    perex:
      'Nabízíme řešení pro čištění plynů, kapalin a vysoušení látek, včetně aktivního uhlí a silikagelů.',
    kolo: 'sorbenty',
    ikona: '/assets/67c57f6e51ee6ff31779d8ca_tm-b6.png',
    ikonaKolo: '/assets/67c1d685c8f4c3c139f38b87_tm-b6.png',
    ikonaKoloHover: '/assets/67c1d684937330ff9edd86ac_tm-bh6.png',
  },
  {
    slug: 'ostatni-chemie',
    nazev: 'Ostatní chemie',
    perex: 'Dodáváme anorganické chemikálie pro průmyslové využití.',
    kolo: 'ostatni',
    ikona: '/assets/67c57f7b91066c772a2e6f63_tm-b7.png',
    ikonaKolo: '/assets/67c1d685e0609d9d83546b96_tm-b7.png',
    ikonaKoloHover: '/assets/67c1d6846f47c763d40502c5_tm-bh7.png',
  },
];

/** Product order exactly as listed in the original catalogue. */
const poradi: readonly string[] = [
  'silikagel-sgr-50', 'silikagel-sgo-50', 'aktivni-uhli-th-90g-700', 'aktivni-uhli-sc-40',
  'aktivni-uhli-s-835', 'aktivni-uhli-k-835', 'aktivni-uhli-k-814', 'aktivni-uhli-cw-20',
  'separo-p', 'separo', 'rustol-komponente-b1', 'rustol-alkydharz-vp-13-new',
  'rustol-alkydharz-medium-new', 'molit-vp', 'molit-tp', 'molit-lp', 'molit-2000-sz',
  'molit-2000-sk', 'molit-2000-sf8', 'molit-2000-sf6', 'molit-2000-sf5', 'molit-2000-sf4',
  'molit-2000-sf2', 'molit-1400-szg3', 'molit-1400-szg2', 'molit-1400-szg', 'licidlo-a',
  'chemsol-emi', 'chemlep', 'atril-spl', 'sul-tabletovana', 'peroxid-vodiku', 'perchloretylen',
  'chlornan-sodny', 'kalafuna-mleta', 'fepren-tp-303', 'destilovana-voda', 'antitox-900',
  'xylen', 'toluen', 'technicky-benzin-80-110-27101125-spd', 'redidlo-s6006', 'redidlo-s6005',
  'redidlo-c6000', 'metyletylketon', 'metylenchlorid', 'metylalkohol',
  'lih-kvasny-obecne-denaturovany-eur', 'lih-kvasny-obecne-denaturovany-95', 'isopropylalkohol',
  'isopar---h', 'etylacetat', 'butylalkohol', 'butylacetat', 'aceton-technicky',
  'woodmax-d4-oc14-50', 'woodmax-d3-wr-13-50m', 'synexil-f5', 'synexil-f11', 'synexil-ath-30',
  'osakryl-osa-h', 'osakryl-osa-319m', 'osakryl-osa-23nm', 'osakryl-osa--1m', 'osakryl-ob',
  'osakryl-ap-40', 'osakryl-ah-035', 'osakryl-ab-20',
];

/** Products listed in more than one category on the original site (besides their main one). */
const dalsiKategorie: Readonly<Record<string, readonly KategorieSlug[]>> = {
  'chemsol-emi': ['organicka-rozpoustedla'],
  perchloretylen: ['organicka-rozpoustedla'],
  'chlornan-sodny': ['ostatni-chemie'],
  'sul-tabletovana': ['produkty-pro-cistirny'],
  'peroxid-vodiku': ['produkty-pro-cistirny'],
};

/** Product image as on the original site: id of the image in /img/orig (Xylen has the client's own photo). */
const obrazkyProduktu: Readonly<Record<string, string>> = {
  'aceton-technicky': '685682d3360005d389c92139',
  'aktivni-uhli-cw-20': '686be44cc7ffba771180533f',
  'aktivni-uhli-k-814': '686be44cc7ffba771180533f',
  'aktivni-uhli-k-835': '686be44cc7ffba771180533f',
  'aktivni-uhli-s-835': '686be44cc7ffba771180533f',
  'aktivni-uhli-sc-40': '686be44cc7ffba771180533f',
  'aktivni-uhli-th-90g-700': '686be44cc7ffba771180533f',
  'antitox-900': '6856986d42eec3690b0798b4',
  'atril-spl': '6856a7a0a135f9b5002a5881',
  butylacetat: '685682d3360005d389c92139',
  butylalkohol: '685682d3360005d389c92139',
  chemlep: '6856a7a0a135f9b5002a5881',
  'chemsol-emi': '6856a7a0a135f9b5002a5881',
  'chlornan-sodny': '68569aa219218688babf52a0',
  'destilovana-voda': '6856986d42eec3690b0798b4',
  etylacetat: '685682d3360005d389c92139',
  'fepren-tp-303': '6856986d42eec3690b0798b4',
  'isopar---h': '685682d3360005d389c92139',
  isopropylalkohol: '685682d3360005d389c92139',
  'kalafuna-mleta': '6856986d42eec3690b0798b4',
  'licidlo-a': '6856a7a0a135f9b5002a5881',
  'lih-kvasny-obecne-denaturovany-95': '685682d3360005d389c92139',
  'lih-kvasny-obecne-denaturovany-eur': '685682d3360005d389c92139',
  metylalkohol: '685682d3360005d389c92139',
  metylenchlorid: '685682d3360005d389c92139',
  metyletylketon: '685682d3360005d389c92139',
  'molit-1400-szg': '6856a7a0a135f9b5002a5881',
  'molit-1400-szg2': '6856a7a0a135f9b5002a5881',
  'molit-1400-szg3': '6856a7a0a135f9b5002a5881',
  'molit-2000-sf2': '6856a7a0a135f9b5002a5881',
  'molit-2000-sf4': '6856a7a0a135f9b5002a5881',
  'molit-2000-sf5': '6856a7a0a135f9b5002a5881',
  'molit-2000-sf6': '6856a7a0a135f9b5002a5881',
  'molit-2000-sf8': '6856a7a0a135f9b5002a5881',
  'molit-2000-sk': '6856a7a0a135f9b5002a5881',
  'molit-2000-sz': '6856a7a0a135f9b5002a5881',
  'molit-lp': '6856a7a0a135f9b5002a5881',
  'molit-tp': '6856a7a0a135f9b5002a5881',
  'molit-vp': '6856a7a0a135f9b5002a5881',
  'osakryl-ab-20': '6856801df27d2778d3d63042',
  'osakryl-ah-035': '6856801df27d2778d3d63042',
  'osakryl-ap-40': '6856801df27d2778d3d63042',
  'osakryl-ob': '6856801df27d2778d3d63042',
  'osakryl-osa--1m': '6856801df27d2778d3d63042',
  'osakryl-osa-23nm': '6856801df27d2778d3d63042',
  'osakryl-osa-319m': '6856801df27d2778d3d63042',
  'osakryl-osa-h': '6856801df27d2778d3d63042',
  perchloretylen: '68569aa219218688babf52a0',
  'peroxid-vodiku': '6856986d42eec3690b0798b4',
  'redidlo-c6000': '685682d3360005d389c92139',
  'redidlo-s6005': '685682d3360005d389c92139',
  'redidlo-s6006': '685682d3360005d389c92139',
  'rustol-alkydharz-medium-new': '6856a7a0a135f9b5002a5881',
  'rustol-alkydharz-vp-13-new': '6856a7a0a135f9b5002a5881',
  'rustol-komponente-b1': '6856a7a0a135f9b5002a5881',
  'separo-p': '6856a7a0a135f9b5002a5881',
  separo: '6856a7a0a135f9b5002a5881',
  'silikagel-sgo-50': '686be44cc7ffba771180533f',
  'silikagel-sgr-50': '686be44cc7ffba771180533f',
  'sul-tabletovana': '6856986d42eec3690b0798b4',
  'synexil-ath-30': '6856801df27d2778d3d63042',
  'synexil-f11': '6856801df27d2778d3d63042',
  'synexil-f5': '6856801df27d2778d3d63042',
  'technicky-benzin-80-110-27101125-spd': '685682d3360005d389c92139',
  toluen: '685682d3360005d389c92139',
  'woodmax-d3-wr-13-50m': '6856815f9a98b523cd4c0439',
  'woodmax-d4-oc14-50': '6856815f9a98b523cd4c0439',
  xylen: '6b040608308049345f70dfaa',
};

const XYLEN_FOTO = '6b040608308049345f70dfaa';

function fotoProduktu(slug: string): readonly [string, string] {
  const id = obrazkyProduktu[slug];
  if (!id) throw new Error(`Produkt ${slug} nemá obrázek`);
  if (id === XYLEN_FOTO) return ['/img/chemap-sudy-160kg.webp', '/img/chemap-sudy-160kg-600.webp'];
  return [`/img/orig/produkt-${id}.webp`, `/img/orig/produkt-${id}-500.webp`];
}

interface RawProdukt {
  slug: string;
  nazev: string;
  kategorie: string;
  popis: string[];
  zakladni_udaje: Udaj[];
  baleni: Baleni[];
  soubory: { nazev: string; soubor: string }[];
}

const kategorieSlugs = new Set<string>(kategorie.map((k) => k.slug));

function isKategorieSlug(value: string): value is KategorieSlug {
  return kategorieSlugs.has(value);
}

/** "6856834edd1f2354ccc6ece0_Aceton_ts (1).pdf" -> "/soubory/Aceton_ts.pdf" */
function souborUrl(soubor: string): string {
  const cisty = soubor.replace(/^[0-9a-f]{24}_/, '').replace(/ \(1\)/g, '');
  return `/soubory/${encodeURIComponent(cisty)}`;
}

function prevest(raw: RawProdukt): Produkt {
  if (!isKategorieSlug(raw.kategorie)) {
    throw new Error(`Neznámá kategorie "${raw.kategorie}" u produktu ${raw.slug}`);
  }
  const [foto, fotoMala] = fotoProduktu(raw.slug);
  return {
    slug: raw.slug,
    nazev: raw.nazev,
    kategorie: raw.kategorie,
    vsechnyKategorie: [raw.kategorie, ...(dalsiKategorie[raw.slug] ?? [])],
    popis: raw.popis.filter((p) => p.trim() !== ''),
    zakladniUdaje: raw.zakladni_udaje.filter((u) => u.hodnota.trim() !== ''),
    baleni: raw.baleni.filter((b) => [b.obal, b.objem, b.mnozstvi].some((v) => v.trim() !== '')),
    soubory: raw.soubory.map((s) => ({ nazev: s.nazev, url: souborUrl(s.soubor) })),
    foto,
    fotoMala,
  };
}

const poradiIndex = new Map(poradi.map((slug, i) => [slug, i]));

export const produkty: readonly Produkt[] = (produktyRaw as RawProdukt[])
  .map(prevest)
  .sort((a, b) => (poradiIndex.get(a.slug) ?? 999) - (poradiIndex.get(b.slug) ?? 999));

export function najdiKategorii(slug: KategorieSlug): Kategorie {
  const k = kategorie.find((x) => x.slug === slug);
  if (!k) throw new Error(`Kategorie ${slug} neexistuje`);
  return k;
}

export function produktyVKategorii(slug: KategorieSlug): Produkt[] {
  return produkty.filter((p) => p.vsechnyKategorie.includes(slug));
}

export const TELEFON = '603 823 916';
export const TELEFON_HREF = 'tel:+420603823916';
