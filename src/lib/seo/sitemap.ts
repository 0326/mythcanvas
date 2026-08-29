export const SITEMAP_SHARD_SIZE = 1000;

export function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function absoluteUrl(path: string, site: URL): string {
  return new URL(path, site).toString();
}

export function sitemapShardCount(itemCount: number, shardSize = SITEMAP_SHARD_SIZE): number {
  if (!Number.isFinite(itemCount) || itemCount <= 0) return 0;
  return Math.ceil(itemCount / shardSize);
}

export function parseSitemapPage(value: string | null): number | undefined {
  if (!value || !/^[1-9]\d*$/.test(value)) return undefined;
  const page = Number(value);
  return Number.isSafeInteger(page) ? page : undefined;
}

export function buildUrlSetXml(entries: readonly string[], image = false): string {
  const namespace = image ? ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"' : '';
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${namespace}>${entries.join('')}</urlset>`;
}

export function buildSitemapIndexXml(locations: readonly string[]): string {
  const entries = locations.map((location) => `<sitemap><loc>${escapeXml(location)}</loc></sitemap>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join('')}</sitemapindex>`;
}

export function xmlResponse(body: string, status = 200): Response {
  return new Response(body, {
    status,
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': status === 200
        ? 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400'
        : 'no-store',
      'x-content-type-options': 'nosniff',
    },
  });
}
