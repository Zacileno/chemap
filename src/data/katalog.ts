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
  kategorie: KategorieSlug;
  popis: string[];
  zakladniUdaje: Udaj[];
  baleni: Baleni[];
  soubory: Soubor[];
  /** Client's own product photo, if there is one. */
  foto?: string;
}

/** Category order as in the original menu. */
export const kategorie: readonly Kategorie[] = [
  {
    slug: 'disperze',
    nazev: 'Disperze',
    perex: 'Zabezpečení dodávek vodných disperzí pro výrobu stavebních hmot, barev, lepidel či tmelů.',
  },
  {
    slug: 'produkty-pro-slevarenstvi',
    nazev: 'Produkty pro slévárenství',
    perex:
      'Nabízíme přípravky pro zlepšení kvality odlitků, včetně žáruvzdorných nátěrů, penetrací, povrchových tvrdidel, ředidel a separátorů.',
  },
  {
    slug: 'produkty-pro-cistirny',
    nazev: 'Produkty pro čistírny',
    perex: 'Dodáváme rozpouštědla a dezinfekční prostředky pro chemické čistírny oděvů.',
  },
  {
    slug: 'lepidla-na-drevo',
    nazev: 'Lepidla na dřevo',
    perex: 'Poskytujeme širokou škálu lepidel na bázi modifikované polyvinylacetátové disperze.',
  },
  {
    slug: 'organicka-rozpoustedla',
    nazev: 'Organická rozpouštědla',
    perex: 'Zajišťujeme dodávky organických rozpouštědel pro různé průmyslové aplikace.',
  },
  {
    slug: 'sorbenty-a-filtrace',
    nazev: 'Sorbenty a filtrace',
    perex:
      'Nabízíme řešení pro čištění plynů, kapalin a vysoušení látek, včetně aktivního uhlí a silikagelů.',
  },
  {
    slug: 'ostatni-chemie',
    nazev: 'Ostatní chemie',
    perex: 'Dodáváme anorganické chemikálie pro průmyslové využití.',
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

/** Client's own photos assigned to products. */
const fotky: Readonly<Record<string, string>> = {
  xylen: '/img/chemap-sudy-160kg.jpg',
};

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
  const foto = fotky[raw.slug];
  return {
    slug: raw.slug,
    nazev: raw.nazev,
    kategorie: raw.kategorie,
    popis: raw.popis.filter((p) => p.trim() !== ''),
    zakladniUdaje: raw.zakladni_udaje.filter((u) => u.hodnota.trim() !== ''),
    baleni: raw.baleni.filter((b) => [b.obal, b.objem, b.mnozstvi].some((v) => v.trim() !== '')),
    soubory: raw.soubory.map((s) => ({ nazev: s.nazev, url: souborUrl(s.soubor) })),
    ...(foto ? { foto } : {}),
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
  return produkty.filter((p) => p.kategorie === slug);
}

export const TELEFON = '603 823 916';
export const TELEFON_HREF = 'tel:+420603823916';
