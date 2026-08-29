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

const imageEntry = (pageUrl: string, imageUrl: string) =>
  `<url><loc>${escapeXml(pageUrl)}</loc><image:image><image:loc>${escapeXml(imageUrl)}</image:loc></image:image></url>`;

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
    const entries = artworks
      .filter((artwork) => Boolean(artwork.image?.src))
      .map((artwork) => imageEntry(
        absoluteUrl(`/wallpaper/${artwork.slug}/`, site),
        absoluteUrl(artwork.image.src, site),
      ));
    return xmlResponse(buildUrlSetXml(entries, true));
  }

  if (part !== 'entities') return xmlResponse('<error>Unknown sitemap part.</error>', 404);

  const [mythologies, worlds, characters] = await Promise.all([
    getMythologies(db, { limit: SITEMAP_SHARD_SIZE }),
    getWorlds(db, { limit: SITEMAP_SHARD_SIZE }),
    getCharacters(db, { limit: SITEMAP_SHARD_SIZE }),
  ]);

  const entries = [
    ...mythologies
      .filter((mythology) => Boolean(mythology.heroImage?.src))
      .map((mythology) => imageEntry(
        absoluteUrl(`/mythology/${mythology.slug}/`, site),
        absoluteUrl(mythology.heroImage!.src, site),
      )),
    ...worlds
      .filter((world) => Boolean(world.heroImage?.src))
      .map((world) => imageEntry(
        absoluteUrl(`/world/${world.slug}/`, site),
        absoluteUrl(world.heroImage.src, site),
      )),
    ...characters
      .filter((character) => Boolean(character.portrait?.src))
      .map((character) => imageEntry(
        absoluteUrl(`/character/${character.slug}/`, site),
        absoluteUrl(character.portrait!.src, site),
      )),
  ];

  return xmlResponse(buildUrlSetXml(entries, true));
};
