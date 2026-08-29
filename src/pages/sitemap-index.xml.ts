import type { APIRoute } from 'astro';
import { countPublishedArtworks } from '../lib/content/repositories';
import {
  buildSitemapIndexXml,
  sitemapShardCount,
  xmlResponse,
} from '../lib/seo/sitemap';

export const prerender = false;

function shardUrl(path: string, part: string, page: number | undefined, site: URL): string {
  const url = new URL(path, site);
  url.searchParams.set('part', part);
  if (page !== undefined) url.searchParams.set('page', String(page));
  return url.toString();
}

export const GET: APIRoute = async ({ locals, site }) => {
  if (!site) return xmlResponse('<error>Astro.site is required for sitemap generation.</error>', 500);

  const artworkCount = await countPublishedArtworks(locals.runtime.env.DB);
  const artworkShardCount = sitemapShardCount(artworkCount);
  const locations = [
    shardUrl('/sitemap-pages.xml', 'entities', undefined, site),
    shardUrl('/sitemap-images.xml', 'entities', undefined, site),
  ];

  for (let page = 1; page <= artworkShardCount; page += 1) {
    locations.push(shardUrl('/sitemap-pages.xml', 'artworks', page, site));
    locations.push(shardUrl('/sitemap-images.xml', 'artworks', page, site));
  }

  return xmlResponse(buildSitemapIndexXml(locations));
};
