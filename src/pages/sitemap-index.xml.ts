import type { APIRoute } from 'astro';
import {
  getArtworks,
  getCharacters,
  getMythologies,
  getWorlds,
} from '../lib/content/repositories';

export const prerender = false;

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const absolute = (path: string, site: URL) => new URL(path, site).toString();

const imageXml = (src: string | undefined, title: string | undefined, site: URL) => {
  if (!src) return '';
  const loc = escapeXml(absolute(src, site));
  const caption = title ? `<image:title>${escapeXml(title)}</image:title>` : '';
  return `<image:image><image:loc>${loc}</image:loc>${caption}</image:image>`;
};

const urlXml = (loc: string, image = '') =>
  `<url><loc>${escapeXml(loc)}</loc>${image}</url>`;

export const GET: APIRoute = async ({ locals, site }) => {
  if (!site) {
    return new Response('Astro.site is required for sitemap generation.', { status: 500 });
  }

  const db = locals.runtime.env.DB;
  const [mythologies, worlds, characters, artworks] = await Promise.all([
    getMythologies(db),
    getWorlds(db),
    getCharacters(db),
    getArtworks(db),
  ]);

  const urls: string[] = [
    '/',
    '/explore/',
    '/mythology/',
    '/world/',
    '/character/',
    '/wallpaper/',
  ].map((path) => urlXml(absolute(path, site)));

  for (const mythology of mythologies) {
    urls.push(
      urlXml(
        absolute(`/mythology/${mythology.slug}/`, site),
        imageXml(mythology.heroImage?.src, `${mythology.name}神话`, site),
      ),
    );
  }

  for (const world of worlds) {
    urls.push(
      urlXml(
        absolute(`/world/${world.slug}/`, site),
        imageXml(world.heroImage?.src, `${world.name} · ${world.nameEn}`, site),
      ),
    );
  }

  for (const character of characters) {
    urls.push(
      urlXml(
        absolute(`/character/${character.slug}/`, site),
        imageXml(character.portrait?.src, `${character.name} · ${character.nameEn}`, site),
      ),
    );
  }

  for (const artwork of artworks) {
    urls.push(
      urlXml(
        absolute(`/wallpaper/${artwork.slug}/`, site),
        imageXml(artwork.image?.src, artwork.title, site),
      ),
    );
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls.join('')}</urlset>`;

  return new Response(body, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=300, s-maxage=3600',
    },
  });
};
