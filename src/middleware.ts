import { defineMiddleware } from 'astro:middleware';
import { DEFAULT_LOCALE } from './lib/i18n/config';
import { isEnglishCorePath, localizedPath, parseLocalizedPath } from './lib/i18n/url';

/**
 * MythCanvas request middleware.
 *
 * Responsibilities:
 * - resolve locale from the external URL;
 * - keep the default zh-Hans routes unchanged;
 * - internally rewrite future locale-prefixed public pages onto the default route tree;
 * - keep the published English core content on its real /en route tree;
 * - preserve the original pathname in locals for canonical/SEO generation;
 * - inject security response headers.
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

const LOCALIZABLE_ROUTE_ROOTS = new Set([
  'explore',
  'character',
  'world',
  'mythology',
  'wallpaper',
  'create',
  'search',
  'login',
  'register',
  'password',
  'privacy',
  'terms',
  'copyright',
  'my',
]);

function isLocalizablePagePath(pathname: string) {
  if (pathname === '/') return true;
  const firstSegment = pathname.split('/').filter(Boolean)[0];
  return firstSegment ? LOCALIZABLE_ROUTE_ROOTS.has(firstSegment) : false;
}

function withSecurityHeaders(response: Response) {
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
}

export const onRequest = defineMiddleware(async (context, next) => {
  const parsed = parseLocalizedPath(context.url.pathname);

  context.locals.locale = parsed.locale;
  context.locals.externalPathname = parsed.externalPathname;
  context.locals.basePathname = parsed.basePathname;

  const method = context.request.method.toUpperCase();
  const canRewrite = method === 'GET' || method === 'HEAD';

  // The default locale never gets its own public prefix. Redirect accidental
  // /zh-hans/... requests to the long-lived legacy/default URL.
  if (parsed.usesDefaultLocaleAlias && canRewrite) {
    const target = new URL(context.url);
    target.pathname = parsed.basePathname;
    return withSecurityHeaders(Response.redirect(target, 308));
  }

  let response: Response;

  if (
    parsed.hasLocalePrefix
    && canRewrite
    && isLocalizablePagePath(parsed.basePathname)
  ) {
    if (parsed.locale === 'en' && !isEnglishCorePath(parsed.basePathname)) {
      const fallback = new URL(context.url);
      fallback.pathname = localizedPath('en', '/');
      fallback.search = '';
      fallback.hash = '';
      return withSecurityHeaders(Response.redirect(fallback, 302));
    }

    // English pages are real routes under /en. Other locale prefixes still
    // reuse the default route tree until their content is published.
    if (parsed.locale === 'en') {
      response = await next();
    } else {
      const rewritten = new URL(context.url);
      rewritten.pathname = parsed.basePathname;
      response = await next(rewritten);
    }
  } else {
    response = await next();
  }

  return withSecurityHeaders(response);
});
