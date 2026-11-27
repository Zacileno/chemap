/**
 * Czech typography: inserts non-breaking spaces so that lines never end with
 * a one-letter preposition/conjunction and numbers stay together with their units.
 * Applied to the text of every rendered page (see src/middleware.ts).
 */

const NBSP = ' ';

/** Tags whose content must not be touched. */
const PRESKOCIT = new Set(['script', 'style', 'textarea', 'pre', 'code']);

function upravText(text: string): string {
  let t = text;
  let predchozi: string;
  do {
    predchozi = t;
    // One-letter words: k, s, v, z, o, u, a, i (e.g. "v Dašicích", "a přípravků", "spol. s r.o.")
    t = t.replace(/(^|[\s(„"'“])([ksvzouaiKSVZOUAI])[ \t\n\r]+/gu, `$1$2${NBSP}`);
  } while (t !== predchozi);

  return (
    t
      // Digit groups: "603 823 916", "1 000 l", "+420 605"
      .replace(/(\d)[ \t]+(?=\d{3}(?!\d))/g, `$1${NBSP}`)
      // Postal code: "533 03"
      .replace(/(\d{3})[ \t]+(?=\d{2}(?!\d))/g, `$1${NBSP}`)
      // Multi-part abbreviations: "EN ISO", "spol. s r.o."
      .replace(/\bEN[ \t]+ISO\b/g, `EN${NBSP}ISO`)
      .replace(/\bspol\.[ \t]+s/g, `spol.${NBSP}s`)
      // Number + unit: "200 l", "140 kg", "> 99 %", "30 let"
      .replace(/(\d)[ \t]+(?=(?:kg|l|g|t|ks|Kč|let|mm|µm|m)(?![\p{L}\d])|%|°)/gu, `$1${NBSP}`)
      // Ranges: "5 000 – 24 000 kg" keeps the dash on the first line
      .replace(/(\d)[ \t]+–/g, `$1${NBSP}–`)
      // Abbreviation + number: "ISO 9001", "UN 1090", "K 814", "AB 20"
      .replace(/(^|[^\p{L}])(\p{Lu}{1,4})[ \t]+(?=\d)/gu, `$1$2${NBSP}`)
      // "> 99", "< 5"
      .replace(/(&gt;|&lt;|[<>≥≤])[ \t]+(?=\d)/g, `$1${NBSP}`)
  );
}

/** Applies the rules to text between tags only (never to attributes, scripts or styles). */
export function pevneMezery(html: string): string {
  let vynechat: string | null = null;
  return html.replace(/(<[^>]+>)|([^<]+)/g, (_m, tag: string | undefined, text: string | undefined) => {
    if (tag) {
      const otevreni = /^<([a-z0-9]+)/i.exec(tag);
      const zavreni = /^<\/([a-z0-9]+)/i.exec(tag);
      if (!vynechat && otevreni?.[1] && PRESKOCIT.has(otevreni[1].toLowerCase()) && !tag.endsWith('/>')) {
        vynechat = otevreni[1].toLowerCase();
      } else if (vynechat && zavreni?.[1]?.toLowerCase() === vynechat) {
        vynechat = null;
      }
      return tag;
    }
    return vynechat || !text ? (text ?? '') : upravText(text);
  });
}
