import type { APIRoute } from 'astro';

export const prerender = false;

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    return new Response('Astro.site is required for sitemap generation.', { status: 500 });
  }

  const pages = new URL('/sitemap-pages.xml', site).toString();
  const images = new URL('/sitemap-images.xml', site).toString();
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${escapeXml(pages)}</loc></sitemap><sitemap><loc>${escapeXml(images)}</loc></sitemap></sitemapindex>`;

  return new Response(body, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=300, s-maxage=3600',
    },
  });
};
