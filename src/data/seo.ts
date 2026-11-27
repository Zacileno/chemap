/**
 * SEO titles and descriptions.
 * Only facts that are on the site itself are used (product data, claims from the homepage).
 * Targets: title 50–60 characters, description 150–160 characters.
 */
import type { Kategorie, KategorieSlug, Produkt } from './katalog';

const TITLE_MIN = 50;
const TITLE_MAX = 60;
const DESC_MIN = 150;
const DESC_MAX = 160;

const delka = (s: string): number => [...s].length;

/** Picks the first candidate within the range, otherwise the longest one that still fits the maximum. */
function vyber(kandidati: string[], min: number, max: number): string {
  const vRozsahu = kandidati.find((k) => delka(k) >= min && delka(k) <= max);
  if (vRozsahu) return vRozsahu;
  const vejdeSe = kandidati.filter((k) => delka(k) <= max).sort((a, b) => delka(b) - delka(a));
  return vejdeSe[0] ?? kandidati.reduce((a, b) => (delka(a) <= delka(b) ? a : b));
}

/** What the product is, in singular ("Aceton – organické rozpouštědlo"). */
const druh: Record<KategorieSlug, string> = {
  disperze: 'disperze',
  'produkty-pro-slevarenstvi': 'slévárenský přípravek',
  'produkty-pro-cistirny': 'přípravek pro čistírny',
  'lepidla-na-drevo': 'lepidlo na dřevo',
  'organicka-rozpoustedla': 'organické rozpouštědlo',
  'sorbenty-a-filtrace': 'sorbent a filtrace',
  'ostatni-chemie': 'průmyslová chemie',
};

export function titleProduktu(p: Produkt): string {
  const d = druh[p.kategorie];
  return vyber(
    [
      `${p.nazev} – ${d} | CHEMAP Dašice`,
      `${p.nazev} – ${d} | CHEMAP`,
      `${p.nazev} – ${d} | CHEMAP, spol. s r.o.`,
      `${p.nazev} – ${d} od výrobce | CHEMAP Dašice`,
      `${p.nazev} – ${d} od výrobce | CHEMAP, spol. s r.o.`,
      `${p.nazev} | CHEMAP Dašice`,
      `${p.nazev} | CHEMAP`,
    ],
    TITLE_MIN,
    TITLE_MAX,
  );
}

function udaj(p: Produkt, nazev: string): string | undefined {
  return p.zakladniUdaje.find((u) => u.nazev === nazev)?.hodnota;
}

/** Lowercases the first letter unless the first word is an acronym (IBC, PE). */
function malym(text: string): string {
  const prvni = text.split(' ')[0] ?? '';
  return prvni.length > 1 && prvni === prvni.toUpperCase() ? text : text.charAt(0).toLowerCase() + text.slice(1);
}

function seznam(polozky: string[]): string {
  if (polozky.length <= 1) return polozky.join('');
  return `${polozky.slice(0, -1).join(', ')} i ${polozky.at(-1)}`;
}

export function descriptionProduktu(p: Produkt): string {
  const d = druh[p.kategorie];
  const cas = udaj(p, 'CAS');
  const konc = udaj(p, 'Concentrate (%)');
  const castice = udaj(p, 'Velikost částic');
  const fakta = [cas && `CAS ${cas}`, konc && `koncentrace ${konc} %`, castice && `zrnitost ${castice}`].filter(
    (x): x is string => Boolean(x),
  );

  const obaly = p.baleni.map((b) => {
    const objem = b.objem.replace(/^á\s*/, '').trim();
    const obal = b.obal.replace(/\s+á\s+.*$/, '').trim();
    return objem && !obal.includes(objem) ? `${malym(obal)} ${objem}` : malym(obal);
  });
  const unikatniObaly = [...new Set(obaly)];

  const zacatek = fakta.length ? `${p.nazev} (${fakta.join(', ')})` : `${p.nazev} – ${d}`;
  const baleni = unikatniObaly.length ? `Balení: ${seznam(unikatniObaly.slice(0, 4))}.` : '';
  const baleniKratke = unikatniObaly.length ? `Balení: ${seznam(unikatniObaly.slice(0, 2))}.` : '';
  const list = p.soubory.length ? 'Technický list ke stažení.' : '';

  const zavery = [
    'Dodání do druhého dne po celé ČR, technická podpora. CHEMAP Dašice.',
    'Dodání do druhého dne, technická podpora. CHEMAP Dašice.',
    'Dodání do druhého dne. CHEMAP Dašice.',
    'Technická podpora a dodání do druhého dne.',
    'Dodání do druhého dne.',
    'CHEMAP Dašice.',
    '',
  ];
  const stredy = [
    [baleni, list],
    [baleniKratke, list],
    [baleni],
    [baleniKratke],
    [list],
    [],
  ];
  const doplnky = [
    '',
    ' Poradíme s výběrem i použitím, volejte 603 823 916.',
    ' Poradíme s výběrem i použitím, zavolejte nám na 603 823 916.',
    ' Volejte 603 823 916.',
  ];

  const kandidati: string[] = [];
  for (const stred of stredy) {
    for (const zaver of zavery) {
      for (const doplnek of doplnky) {
        kandidati.push(
          [`${zacatek}.`, ...stred, zaver]
            .filter(Boolean)
            .join(' ')
            .concat(doplnek)
            .replace(/\s+/g, ' ')
            .trim(),
        );
      }
    }
  }
  return vyber(kandidati, DESC_MIN, DESC_MAX);
}

/** Hand-written texts for the main pages and categories. */
export const seoStranky = {
  uvod: {
    title: 'Výrobce a distributor chemických látek | CHEMAP Dašice',
    description:
      'Jsme přední český výrobce a distributor chemických látek a přípravků. V CHEMAP Dašice nabízíme široký sortiment, technickou podporu a rychlé dodání po celé ČR.',
  },
  katalog: {
    title: 'Katalog chemických produktů – 68 přípravků | CHEMAP',
    description:
      'Katalog 68 chemických produktů CHEMAP Dašice: disperze, slévárenské přípravky, rozpouštědla, lepidla na dřevo, sorbenty a další. Technické listy ke stažení.',
  },
  kontakty: {
    title: 'Kontakty – obchod a technické poradenství | CHEMAP',
    description:
      'Obchod a technické poradenství: +420 603 823 916, chemap@chemap.cz. CHEMAP, spol. s r.o., Dašice 475, 533 03 Dašice. Ozvěte se nám, rádi vám poradíme.',
  },
} as const;

export const seoKategorie: Record<KategorieSlug, { title: string; description: string }> = {
  disperze: {
    title: 'Akrylátové a vinylacetátové disperze | CHEMAP Dašice',
    description:
      'Vodné akrylátové a vinylacetátové disperze pro výrobu barev, lepidel, tmelů a stavebních hmot. Technické listy ke stažení, dodání do druhého dne po celé ČR.',
  },
  'produkty-pro-slevarenstvi': {
    title: 'Slévárenské přípravky a nátěry forem | CHEMAP Dašice',
    description:
      'Slévárenské přípravky: žáruvzdorné nátěry forem a jader, penetrace, povrchová tvrdidla, ředidla a separátory. Technické listy ke stažení a technická podpora.',
  },
  'produkty-pro-cistirny': {
    title: 'Rozpouštědla a přípravky pro čistírny | CHEMAP Dašice',
    description:
      'Rozpouštědla a dezinfekční prostředky pro chemické čistírny oděvů: perchloretylen, chlornan sodný, peroxid vodíku a tabletovaná sůl. Dodání do druhého dne.',
  },
  'lepidla-na-drevo': {
    title: 'Lepidla na dřevo Woodmax D3 a D4 | CHEMAP, spol. s r.o.',
    description:
      'Lepidla na dřevo na bázi modifikované polyvinylacetátové disperze – Woodmax D3 a D4. Balení od kbelíku 5 kg po IBC kontejner 1 000 kg. CHEMAP, Dašice.',
  },
  'organicka-rozpoustedla': {
    title: 'Organická rozpouštědla a ředidla | CHEMAP, spol. s r.o.',
    description:
      'Aceton, toluen, xylen, ředidla, alkoholy a další organická rozpouštědla v sudech, IBC kontejnerech i cisternách. Technické listy ke stažení. CHEMAP Dašice.',
  },
  'sorbenty-a-filtrace': {
    title: 'Sorbenty a filtrace – aktivní uhlí, silikagel | CHEMAP',
    description:
      'Aktivní uhlí a silikagely pro čištění plynů a kapalin a vysoušení látek. Poradíme s výběrem sorbentu pro vaši aplikaci. Dodání do druhého dne po celé ČR.',
  },
  'ostatni-chemie': {
    title: 'Anorganické chemikálie pro průmysl | CHEMAP Dašice',
    description:
      'Anorganické chemikálie pro průmyslové využití: peroxid vodíku, chlornan sodný, destilovaná voda, kalafuna, tabletovaná sůl a další. Dodání do druhého dne.',
  },
};

export function seoKategorieFor(k: Kategorie): { title: string; description: string } {
  return seoKategorie[k.slug];
}
