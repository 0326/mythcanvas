import type { APIRoute } from 'astro';
import {
  getArtworks,
  getCharacters,
  getMythologies,
  getWorlds,
} from '../lib/content/repositories';

export const prerender = false;

const PAGE_SIZE = 50;

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const absolute = (path: string, site: URL) => new URL(path, site).toString();

const imageEntry = (pageUrl: string, imageUrl: string) =>
  `<url><loc>${escapeXml(pageUrl)}</loc><image:image><image:loc>${escapeXml(imageUrl)}</image:loc></image:image></url>`;

async function loadAllPaged<T>(fetchPage: (offset: number) => Promise<T[]>): Promise<T[]> {
  const items: T[] = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const page = await fetchPage(offset);
    items.push(...page);
    if (page.length < PAGE_SIZE) return items;
  }
}

export const GET: APIRoute = async ({ locals, site }) => {
  if (!site) {
    return new Response('Astro.site is required for sitemap generation.', { status: 500 });
  }

  const db = locals.runtime.env.DB;
  const [mythologies, worlds, characters, artworks] = await Promise.all([
    getMythologies(db),
    loadAllPaged((offset) => getWorlds(db, { limit: PAGE_SIZE, offset })),
    getCharacters(db),
    loadAllPaged((offset) => getArtworks(db, { limit: PAGE_SIZE, offset })),
  ]);

  const entries: string[] = [];

  for (const mythology of mythologies) {
    if (!mythology.heroImage?.src) continue;
    entries.push(
      imageEntry(
        absolute(`/mythology/${mythology.slug}/`, site),
        absolute(mythology.heroImage.src, site),
      ),
    );
  }

  for (const world of worlds) {
    if (!world.heroImage?.src) continue;
    entries.push(
      imageEntry(
        absolute(`/world/${world.slug}/`, site),
        absolute(world.heroImage.src, site),
      ),
    );
  }

  for (const character of characters) {
    if (!character.portrait?.src) continue;
    entries.push(
      imageEntry(
        absolute(`/character/${character.slug}/`, site),
        absolute(character.portrait.src, site),
      ),
    );
  }

  for (const artwork of artworks) {
    if (!artwork.image?.src) continue;
    entries.push(
      imageEntry(
        absolute(`/wallpaper/${artwork.slug}/`, site),
        absolute(artwork.image.src, site),
      ),
    );
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${entries.join('')}</urlset>`;

  return new Response(body, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=300, s-maxage=3600',
    },
  });
};
