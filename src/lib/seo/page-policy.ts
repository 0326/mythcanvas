import { DEFAULT_LOCALE } from '../i18n/config';
import { parseLocalizedPath } from '../i18n/url';

export type RobotsDirective = 'index,follow' | 'noindex,follow' | 'noindex,nofollow';

export type PageSeoPolicy = {
  canonicalURL: URL;
  robots: RobotsDirective;
};

export type PageSeoOptions = {
  /**
   * Localized pages are noindex by default. A page may opt in only after its
   * data loader has proven that the requested locale has published content.
   */
  allowLocalizedIndex?: boolean;
};

const PRIVATE_NOINDEX_ROUTES = ['/admin', '/my', '/_localized'] as const;
const UTILITY_NOINDEX_ROUTES = ['/login', '/register', '/password', '/search'] as const;
const FILTERABLE_ROUTES = ['/character', '/explore', '/wallpaper'] as const;

const normalizedPathname = (pathname: string) => pathname.replace(/\/$/, '') || '/';

const matchesRoute = (pathname: string, route: string) =>
  pathname === route || pathname.startsWith(`${route}/`);

function paginationPage(url: URL, pathname: string): number | undefined {
  if (pathname !== '/wallpaper' || url.searchParams.size !== 1) return undefined;
  const rawPage = url.searchParams.get('page');
  if (!rawPage || !/^[1-9]\d*$/.test(rawPage)) return undefined;
  const page = Number(rawPage);
  return Number.isSafeInteger(page) ? page : undefined;
}

export function getPageSeoPolicy(url: URL, site: URL, options: PageSeoOptions = {}): PageSeoPolicy {
  const parsed = parseLocalizedPath(url.pathname);
  const pathname = normalizedPathname(parsed.basePathname);
  const canonicalURL = new URL(url.pathname, site);

  if (PRIVATE_NOINDEX_ROUTES.some((route) => matchesRoute(pathname, route))) {
    return { canonicalURL, robots: 'noindex,nofollow' };
  }

  if (UTILITY_NOINDEX_ROUTES.some((route) => matchesRoute(pathname, route))) {
    return { canonicalURL, robots: 'noindex,follow' };
  }

  const canIndexLocalized = parsed.locale === 'en' && options.allowLocalizedIndex === true;
  if (parsed.locale !== DEFAULT_LOCALE && !canIndexLocalized) {
    return { canonicalURL, robots: 'noindex,follow' };
  }

  const page = paginationPage(url, pathname);
  if (page !== undefined) {
    if (page > 1) canonicalURL.searchParams.set('page', String(page));
    return { canonicalURL, robots: 'index,follow' };
  }

  const isThinFilterPage = url.searchParams.size > 0
    && FILTERABLE_ROUTES.some((route) => matchesRoute(pathname, route));

  return {
    canonicalURL,
    robots: isThinFilterPage ? 'noindex,follow' : 'index,follow',
  };
}
