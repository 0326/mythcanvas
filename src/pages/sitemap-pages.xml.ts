import type { APIRoute } from 'astro';
import {
  getArtworks,
  getCharacters,
  getMythologies,
  getWorlds,
} from '../lib/content/repositories';
import {
  absoluteUrl,
  buildUrlSetXml,
  escapeXml,
  parseSitemapPage,
  SITEMAP_SHARD_SIZE,
  xmlResponse,
} from '../lib/seo/sitemap';

export const prerender = false;

const urlEntry = (location: string) => `<url><loc>${escapeXml(location)}</loc></url>`;

export const GET: APIRoute = async ({ locals, site, url }) => {
  if (!site) return xmlResponse('<error>Astro.site is required for sitemap generation.</error>', 500);

  const db = locals.runtime.env.DB;
  const part = url.searchParams.get('part') ?? 'entities';

  if (part === 'artworks') {
    const page = parseSitemapPage(url.searchParams.get('page'));
    if (!page) return xmlResponse('<error>Invalid sitemap page.</error>', 404);
    const artworks = await getArtworks(db, {
      limit: SITEMAP_SHARD_SIZE,
      offset: (page - 1) * SITEMAP_SHARD_SIZE,
    });
    if (artworks.length === 0) return xmlResponse('<error>Sitemap page not found.</error>', 404);
    const entries = artworks.map((artwork) => urlEntry(absoluteUrl(`/wallpaper/${artwork.slug}/`, site)));
    return xmlResponse(buildUrlSetXml(entries));
  }

  if (part !== 'entities') return xmlResponse('<error>Unknown sitemap part.</error>', 404);

  const [mythologies, worlds, characters] = await Promise.all([
    getMythologies(db, { limit: SITEMAP_SHARD_SIZE }),
    getWorlds(db, { limit: SITEMAP_SHARD_SIZE }),
    getCharacters(db, { limit: SITEMAP_SHARD_SIZE }),
  ]);

  const paths = [
    '/',
    '/explore/',
    '/mythology/',
    '/world/',
    '/character/',
    '/wallpaper/',
    ...mythologies.map((item) => `/mythology/${item.slug}/`),
    ...worlds.map((item) => `/world/${item.slug}/`),
    ...characters.map((item) => `/character/${item.slug}/`),
  ];

  return xmlResponse(buildUrlSetXml(paths.map((path) => urlEntry(absoluteUrl(path, site)))));
};
