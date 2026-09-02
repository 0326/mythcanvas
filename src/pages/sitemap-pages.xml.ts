import type { APIRoute } from 'astro';
import {
  getPublicArtworks,
  getPublicCharacters,
  getPublicMythologies,
  getPublicWorlds,
} from '../lib/content/public-catalog';
import { getPublicStoryPaths } from '../lib/content/stories';
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

export const GET: APIRoute = async ({ site, url }) => {
  if (!site) return xmlResponse('<error>Astro.site is required for sitemap generation.</error>', 500);

  const part = url.searchParams.get('part') ?? 'entities';

  if (part === 'artworks') {
    const page = parseSitemapPage(url.searchParams.get('page'));
    if (!page) return xmlResponse('<error>Invalid sitemap page.</error>', 404);
    const artworks = getPublicArtworks({
      limit: SITEMAP_SHARD_SIZE,
      offset: (page - 1) * SITEMAP_SHARD_SIZE,
    });
    if (artworks.length === 0) return xmlResponse('<error>Sitemap page not found.</error>', 404);
    const entries = artworks.map((artwork) => urlEntry(absoluteUrl(`/wallpaper/${artwork.slug}/`, site)));
    return xmlResponse(buildUrlSetXml(entries));
  }

  if (part !== 'entities') return xmlResponse('<error>Unknown sitemap part.</error>', 404);

  const [mythologies, worlds, characters] = [
    getPublicMythologies({ limit: SITEMAP_SHARD_SIZE }),
    getPublicWorlds({ limit: SITEMAP_SHARD_SIZE }),
    getPublicCharacters({ limit: SITEMAP_SHARD_SIZE }),
  ];

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
    ...getPublicStoryPaths().flatMap((story) => {
      const mythology = mythologies.find((item) => item.id === story.mythologyId);
      return mythology ? [`/mythology/${mythology.slug}/${story.slug}/`] : [];
    }),
  ];

  return xmlResponse(buildUrlSetXml(paths.map((path) => urlEntry(absoluteUrl(path, site)))));
};
