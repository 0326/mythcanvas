export type RobotsDirective = 'index,follow' | 'noindex,follow' | 'noindex,nofollow';

export type PageSeoPolicy = {
  canonicalURL: URL;
  robots: RobotsDirective;
};

const PRIVATE_NOINDEX_ROUTES = ['/admin', '/my'] as const;
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

export function getPageSeoPolicy(url: URL, site: URL): PageSeoPolicy {
  const pathname = normalizedPathname(url.pathname);
  const canonicalURL = new URL(url.pathname, site);

  if (PRIVATE_NOINDEX_ROUTES.some((route) => matchesRoute(pathname, route))) {
    return { canonicalURL, robots: 'noindex,nofollow' };
  }

  if (UTILITY_NOINDEX_ROUTES.some((route) => matchesRoute(pathname, route))) {
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
