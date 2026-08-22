import type { APIRoute } from 'astro';
import { readArtworkAsset } from '../../lib/cloudflare/assets';

export const prerender = false;

export const GET: APIRoute = async ({ params, locals, request }) => {
  const key = params.key;
  if (!key) return new Response('Missing asset key', { status: 400 });

  const object = await readArtworkAsset(locals.runtime.env.ARTWORKS, key);
  if (!object) return new Response('Artwork not found', { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('cache-control', headers.get('cache-control') ?? 'public, max-age=31536000, immutable');
  headers.set('x-content-type-options', 'nosniff');

  if (request.method === 'HEAD') return new Response(null, { status: 200, headers });
  return new Response(object.body, { status: 200, headers });
};

export const HEAD = GET;
