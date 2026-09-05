import { DEFAULT_LOCALE, ENABLED_LOCALES, localeRegistry, type Locale } from './config';

export type ParsedLocalizedPath = {
  locale: Locale;
  externalPathname: string;
  basePathname: string;
  hasLocalePrefix: boolean;
  usesDefaultLocaleAlias: boolean;
};

const DEFAULT_LOCALE_ALIAS = 'zh-hans';

function ensureLeadingSlash(pathname: string) {
  if (!pathname) return '/';
  return pathname.startsWith('/') ? pathname : `/${pathname}`;
}

function localeForPathSegment(segment: string): Locale | undefined {
  const normalized = segment.toLowerCase();
  if (normalized === DEFAULT_LOCALE_ALIAS) return DEFAULT_LOCALE;

  return ENABLED_LOCALES.find((locale) => {
    const path = localeRegistry[locale].path;
    return path !== '' && path.toLowerCase() === normalized;
  });
}

export function parseLocalizedPath(pathname: string): ParsedLocalizedPath {
  const externalPathname = ensureLeadingSlash(pathname);
  const [, firstSegment = '', ...rest] = externalPathname.split('/');
  const locale = localeForPathSegment(firstSegment);

  if (!locale) {
    return {
      locale: DEFAULT_LOCALE,
      externalPathname,
      basePathname: externalPathname,
      hasLocalePrefix: false,
      usesDefaultLocaleAlias: false,
    };
  }

  const restPath = rest.join('/');
  const basePathname = restPath ? `/${restPath}` : '/';

  return {
    locale,
    externalPathname,
    basePathname,
    hasLocalePrefix: true,
    usesDefaultLocaleAlias: locale === DEFAULT_LOCALE,
  };
}

export function stripLocalePrefix(pathname: string) {
  return parseLocalizedPath(pathname).basePathname;
}

export function getLocalePrefix(locale: Locale) {
  const path = localeRegistry[locale].path;
  return path ? `/${path}` : '';
}

export function localizedPath(locale: Locale, pathname: string) {
  const basePathname = stripLocalePrefix(ensureLeadingSlash(pathname));
  const prefix = getLocalePrefix(locale);
  if (!prefix) return basePathname;
  if (basePathname === '/') return `${prefix}/`;
  return `${prefix}${basePathname}`;
}

export function switchLocale(url: URL, targetLocale: Locale) {
  return `${localizedPath(targetLocale, url.pathname)}${url.search}${url.hash}`;
}
