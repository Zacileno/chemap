import { defineMiddleware } from 'astro:middleware';
import { pevneMezery } from './lib/pevneMezery';

/** Runs at build time for every page and adds Czech non-breaking spaces to the HTML. */
export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  if (!response.headers.get('content-type')?.includes('text/html')) return response;

  const html = await response.text();
  return new Response(pevneMezery(html), {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
});
