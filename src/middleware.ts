import { defineMiddleware } from 'astro:middleware';
import { DEFAULT_LOCALE } from './lib/i18n/config';
import { parseLocalizedPath } from './lib/i18n/url';

/**
 * MythCanvas request middleware.
 *
 * Responsibilities:
 * - resolve locale from the external URL;
 * - keep the default zh-Hans routes unchanged;
 * - internally rewrite locale-prefixed public pages;
 * - route production English core content to dedicated internal SSR pages;
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

const ENGLISH_CORE_ROUTE = /^\/(?:character|world|mythology)(?:\/[^/]+)?\/?$/;

function isLocalizablePagePath(pathname: string) {
  if (pathname === '/') return true;
  const firstSegment = pathname.split('/').filter(Boolean)[0];
  return firstSegment ? LOCALIZABLE_ROUTE_ROOTS.has(firstSegment) : false;
}

function englishInternalPath(pathname: string) {
  return ENGLISH_CORE_ROUTE.test(pathname) ? `/_localized/en${pathname}` : undefined;
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
    && parsed.locale !== DEFAULT_LOCALE
    && canRewrite
    && isLocalizablePagePath(parsed.basePathname)
  ) {
    const rewritten = new URL(context.url);
    rewritten.pathname = parsed.locale === 'en'
      ? englishInternalPath(parsed.basePathname) ?? parsed.basePathname
      : parsed.basePathname;
    response = await next(rewritten);
  } else {
    response = await next();
  }

  return withSecurityHeaders(response);
});
