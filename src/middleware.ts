import { defineMiddleware } from 'astro:middleware';

/**
 * MythCanvas 安全响应头（M12）。
 * 注入 CSP 与安全 header。
 */

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
  "img-src 'self' data: blob:",
  "font-src 'self' data: https://cdn.jsdelivr.net",
  "connect-src 'self'",
  "object-src 'none'",
  "worker-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  const headers = new Headers(response.headers);

  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('X-XSS-Protection', '0');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  headers.set('Content-Security-Policy', CSP);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
});
