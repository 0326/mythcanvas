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
const urlXml = (loc: string) => `<url><loc>${escapeXml(loc)}</loc></url>`;

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

  const urls = [
    '/',
    '/explore/',
    '/mythology/',
    '/world/',
    '/character/',
    '/wallpaper/',
    ...mythologies.map((item) => `/mythology/${item.slug}/`),
    ...worlds.map((item) => `/world/${item.slug}/`),
    ...characters.map((item) => `/character/${item.slug}/`),
    ...artworks.map((item) => `/wallpaper/${item.slug}/`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((path) => urlXml(absolute(path, site))).join('')}</urlset>`;

  return new Response(body, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=300, s-maxage=3600',
    },
  });
};
