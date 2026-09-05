import { describe, expect, it } from 'vitest';
import { DEFAULT_LOCALE } from '../src/lib/i18n/config';
import { localizedPath, parseLocalizedPath, switchLocale } from '../src/lib/i18n/url';
import { getPageSeoPolicy } from '../src/lib/seo/page-policy';

const site = new URL('https://mythcanvas.space');

describe('i18n URL contract', () => {
  it('keeps legacy/default Chinese URLs unprefixed', () => {
    expect(localizedPath(DEFAULT_LOCALE, '/character/athena/')).toBe('/character/athena/');
    expect(parseLocalizedPath('/character/athena/')).toMatchObject({
      locale: 'zh-Hans',
      basePathname: '/character/athena/',
      hasLocalePrefix: false,
    });
  });

  it('maps enabled locale prefixes to the shared base route', () => {
    expect(parseLocalizedPath('/en/character/athena/')).toMatchObject({
      locale: 'en',
      basePathname: '/character/athena/',
      hasLocalePrefix: true,
    });
    expect(localizedPath('ja', '/character/athena/')).toBe('/ja/character/athena/');
    expect(localizedPath('es', '/en/character/athena/')).toBe('/es/character/athena/');
  });

  it('recognizes the default-locale alias so middleware can redirect it', () => {
    expect(parseLocalizedPath('/zh-hans/world/olympus/')).toMatchObject({
      locale: 'zh-Hans',
      basePathname: '/world/olympus/',
      hasLocalePrefix: true,
      usesDefaultLocaleAlias: true,
    });
  });

  it('preserves query and hash while switching locale', () => {
    const url = new URL('https://mythcanvas.space/character/?mythology=greek#athena');
    expect(switchLocale(url, 'en')).toBe('/en/character/?mythology=greek#athena');
  });
});

describe('locale-aware SEO policy', () => {
  it('keeps the canonical URL on the external localized path', () => {
    const policy = getPageSeoPolicy(new URL('https://mythcanvas.space/en/character/athena/'), site);
    expect(policy.canonicalURL.toString()).toBe('https://mythcanvas.space/en/character/athena/');
    expect(policy.robots).toBe('noindex,follow');
  });

  it('applies private-route policy after stripping the locale prefix', () => {
    const policy = getPageSeoPolicy(new URL('https://mythcanvas.space/en/my/'), site);
    expect(policy.robots).toBe('noindex,nofollow');
  });

  it('preserves existing default-locale filter policy', () => {
    const policy = getPageSeoPolicy(new URL('https://mythcanvas.space/character/?mythology=greek'), site);
    expect(policy.robots).toBe('noindex,follow');
  });
});
