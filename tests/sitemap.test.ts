import { describe, expect, it } from 'vitest';
import {
  buildSitemapIndexXml,
  buildUrlSetXml,
  escapeXml,
  parseSitemapPage,
  sitemapShardCount,
} from '../src/lib/seo/sitemap';

describe('sitemap helpers', () => {
  it('escapes URLs and query separators for valid XML', () => {
    expect(escapeXml('https://example.com/?part=a&page=2')).toBe('https://example.com/?part=a&amp;page=2');
    expect(buildSitemapIndexXml(['https://example.com/?part=a&page=2']))
      .toContain('<loc>https://example.com/?part=a&amp;page=2</loc>');
  });

  it('keeps each sitemap shard bounded', () => {
    expect(sitemapShardCount(0)).toBe(0);
    expect(sitemapShardCount(1)).toBe(1);
    expect(sitemapShardCount(1000)).toBe(1);
    expect(sitemapShardCount(1001)).toBe(2);
  });

  it('accepts only positive safe sitemap page numbers', () => {
    expect(parseSitemapPage('1')).toBe(1);
    expect(parseSitemapPage('42')).toBe(42);
    expect(parseSitemapPage('0')).toBeUndefined();
    expect(parseSitemapPage('-1')).toBeUndefined();
    expect(parseSitemapPage('invalid')).toBeUndefined();
  });

  it('adds the image namespace only for image sitemaps', () => {
    expect(buildUrlSetXml([], false)).not.toContain('xmlns:image');
    expect(buildUrlSetXml([], true)).toContain('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"');
  });
});
