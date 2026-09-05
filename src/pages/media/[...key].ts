import type { APIRoute } from 'astro';
import { readArtworkAsset, readArtworkAssetMetadata } from '../../lib/cloudflare/assets';

export const prerender = false;

export const GET: APIRoute = async ({ params, locals, request }) => {
  const key = params.key;
  if (!key) return new Response('Missing asset key', { status: 400 });

  if (request.method === 'HEAD') {
    const object = await readArtworkAssetMetadata(locals.runtime.env.ARTWORKS, key);
    if (!object) return new Response('Artwork not found', { status: 404 });
    return new Response(null, { status: 200, headers: assetHeaders(object, key) });
  }

  const object = await readArtworkAsset(locals.runtime.env.ARTWORKS, key);
  if (!object) return new Response('Artwork not found', { status: 404 });

  return new Response(object.body, { status: 200, headers: assetHeaders(object, key) });
};

function assetHeaders(object: R2Object, key: string): Headers {
  const headers = new Headers();
  headers.set('etag', object.httpEtag ?? '');
  // 优先使用上传时记录的 contentType，缺失时按扩展名推断，避免返回 octet-stream
  headers.set('content-type', object.httpMetadata?.contentType || contentTypeFromKey(key));
  headers.set('cache-control', 'public, max-age=31536000, immutable');
  headers.set('x-content-type-options', 'nosniff');
  return headers;
}

/** 根据对象 key 扩展名推断 MIME，作为 httpMetadata 缺失时的兜底 */
function contentTypeFromKey(key: string): string {
  const ext = key.split('.').pop()?.toLowerCase();
  const map: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    avif: 'image/avif',
    svg: 'image/svg+xml',
    gif: 'image/gif',
  };
  return map[ext ?? ''] ?? 'application/octet-stream';
}

export const HEAD = GET;
