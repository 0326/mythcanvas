import { describe, expect, it } from 'vitest';
import { getPageSeoPolicy } from '../src/lib/seo/page-policy';

const site = new URL('https://mythcanvas.space');

describe('page SEO policy', () => {
  it('keeps ordinary public pages indexable with a query-free canonical', () => {
    const policy = getPageSeoPolicy(new URL('https://mythcanvas.space/world/olympus/'), site);
    expect(policy.robots).toBe('index,follow');
    expect(policy.canonicalURL.toString()).toBe('https://mythcanvas.space/world/olympus/');
  });

  it('gives each wallpaper pagination page a self-referencing canonical', () => {
    const policy = getPageSeoPolicy(new URL('https://mythcanvas.space/wallpaper/?page=3'), site);
    expect(policy.robots).toBe('index,follow');
    expect(policy.canonicalURL.toString()).toBe('https://mythcanvas.space/wallpaper/?page=3');
  });

  it('canonicalizes the first wallpaper page to the clean collection URL', () => {
    const policy = getPageSeoPolicy(new URL('https://mythcanvas.space/wallpaper/?page=1'), site);
    expect(policy.robots).toBe('index,follow');
    expect(policy.canonicalURL.toString()).toBe('https://mythcanvas.space/wallpaper/');
  });

  it('keeps filter and invalid pagination combinations out of the index', () => {
    for (const path of [
      '/explore/?style=anime',
      '/character/?q=athena',
      '/wallpaper/?page=2&style=anime',
      '/wallpaper/?page=invalid',
    ]) {
      const policy = getPageSeoPolicy(new URL(path, site), site);
      expect(policy.robots).toBe('noindex,follow');
      expect(policy.canonicalURL.search).toBe('');
    }
  });

  it('prevents indexing private and utility routes', () => {
    expect(getPageSeoPolicy(new URL('/my/', site), site).robots).toBe('noindex,nofollow');
    expect(getPageSeoPolicy(new URL('/admin/characters/', site), site).robots).toBe('noindex,nofollow');
    expect(getPageSeoPolicy(new URL('/login/', site), site).robots).toBe('noindex,follow');
    expect(getPageSeoPolicy(new URL('/search/?q=athena', site), site).robots).toBe('noindex,follow');
  });
});
