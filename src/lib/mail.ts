import { getSecret } from 'astro:env/server';
import { Resend } from 'resend';

/*
 * The one place where the site sends e-mail (contact form).
 * Environment variables (Vercel → Settings → Environment Variables, never in code):
 *   RESEND_API_KEY  API key of the sending service (Resend, team Zacíleno)
 *   CONTACT_FROM    sender, e.g. "Web CHEMAP <web@chemap.cz>" (domain must be verified in Resend)
 *   CONTACT_TO      optional, recipients separated by commas (default chemap@chemap.cz)
 */

const VYCHOZI_PRIJEMCE = 'chemap@chemap.cz';

export type VysledekOdeslani = 'odeslano' | 'nenastaveno' | 'chyba';

export const escapeHtml = (v: string): string =>
  v.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);

export async function odeslatEmail(opts: {
  predmet: string;
  html: string;
  text: string;
  odpovedetNa?: string;
}): Promise<VysledekOdeslani> {
  const apiKey = getSecret('RESEND_API_KEY');
  const from = getSecret('CONTACT_FROM');
  const to = (getSecret('CONTACT_TO') ?? VYCHOZI_PRIJEMCE)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (!apiKey || !from) {
    console.error('E-mail is not configured (RESEND_API_KEY / CONTACT_FROM).');
    return 'nenastaveno';
  }

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to,
      subject: opts.predmet,
      html: opts.html,
      text: opts.text,
      ...(opts.odpovedetNa ? { replyTo: opts.odpovedetNa } : {}),
    });
    if (error) {
      console.error('Mail error:', error);
      return 'chyba';
    }
    return 'odeslano';
  } catch (e: unknown) {
    console.error('Mail exception:', e);
    return 'chyba';
  }
}

/** Simple per-instance rate limit: max 5 submissions per IP in 15 minutes. */
const OKNO_MS = 15 * 60 * 1000;
const pokusy = new Map<string, number[]>();

export function prilisMnohoPokusu(ip: string): boolean {
  const ted = Date.now();
  const seznam = (pokusy.get(ip) ?? []).filter((t) => ted - t < OKNO_MS);
  seznam.push(ted);
  pokusy.set(ip, seznam);
  if (pokusy.size > 5000) pokusy.clear();
  return seznam.length > 5;
}
