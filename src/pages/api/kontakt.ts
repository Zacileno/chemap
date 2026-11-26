import type { APIRoute } from 'astro';
import { escapeHtml, odeslatEmail, prilisMnohoPokusu } from '../../lib/mail';

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const json = (status: number, data: Record<string, unknown>): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

const text = (v: FormDataEntryValue | null): string => (typeof v === 'string' ? v.trim() : '');

export const POST: APIRoute = async ({ request, clientAddress, url }) => {
  // Accept submissions only from this website.
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== url.host) {
    return json(403, { ok: false, chyba: 'Nepovolený původ požadavku.' });
  }

  if (prilisMnohoPokusu(clientAddress ?? 'neznama')) {
    return json(429, { ok: false, chyba: 'Příliš mnoho pokusů, zkuste to prosím později.' });
  }

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return json(400, { ok: false, chyba: 'Neplatná data formuláře.' });
  }

  // Honeypot field: real visitors leave it empty, bots fill it in.
  if (text(data.get('web')) !== '') {
    return json(200, { ok: true });
  }

  const jmeno = text(data.get('jmeno'));
  const telefon = text(data.get('telefon'));
  const email = text(data.get('email'));
  const zprava = text(data.get('zprava'));
  const souhlas = data.get('gdpr');

  const chyby: string[] = [];
  if (!jmeno || jmeno.length > 256) chyby.push('jmeno');
  if (!EMAIL_RE.test(email) || email.length > 256) chyby.push('email');
  if (telefon.length > 256 || (telefon && !/^[+\d\s()/-]{6,}$/.test(telefon))) chyby.push('telefon');
  if (!zprava || zprava.length > 5000) chyby.push('zprava');
  if (!souhlas) chyby.push('gdpr');
  if (chyby.length > 0) {
    return json(400, { ok: false, chyba: 'Formulář není správně vyplněný.', pole: chyby });
  }

  const radky: [string, string][] = [
    ['Jméno', jmeno],
    ['E-mail', email],
    ['Telefon', telefon || '–'],
  ];

  const html = `<h2 style="font-family:sans-serif">Nová zpráva z webu chemap.cz</h2>
<table style="font-family:sans-serif;border-collapse:collapse">
${radky.map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0"><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`).join('\n')}
</table>
<p style="font-family:sans-serif;white-space:pre-wrap;margin-top:16px">${escapeHtml(zprava)}</p>
<p style="font-family:sans-serif;color:#777;font-size:12px">Odesláno z kontaktního formuláře na ${escapeHtml(url.host)}. Odesílatel souhlasil se zpracováním osobních údajů.</p>`;

  const prostyText = `Nová zpráva z webu chemap.cz\n\n${radky.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${zprava}\n`;

  const vysledek = await odeslatEmail({
    predmet: `Zpráva z webu: ${jmeno}`,
    html,
    text: prostyText,
    odpovedetNa: email,
  });

  if (vysledek === 'odeslano') return json(200, { ok: true });
  return json(503, { ok: false, chyba: 'Zprávu se nepodařilo odeslat.' });
};
