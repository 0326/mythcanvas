import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getStaticCharacterDetailViewModel } from '../src/lib/content/character-detail';
import { getPublicCharacterBySlug, getPublicMythologyById, getPublicWorldBySlug, publicCatalog } from '../src/lib/content/public-catalog';
import { resolveGenerationContext } from '../src/lib/generation/prompt';
import { searchAll } from '../src/lib/content/search';
import type { GenerationRequest } from '../src/lib/generation/types';

const unavailableD1 = {
  prepare() {
    throw new Error('D1 should not be read for public canonical content');
  },
} as unknown as D1Database;

describe('static public content catalog', () => {
  it('keeps public canonical routes free of runtime D1 access', () => {
    const publicRoutes = [
      'src/pages/index.astro',
      'src/pages/explore/index.astro',
      'src/pages/mythology/index.astro',
      'src/pages/mythology/[slug].astro',
      'src/pages/mythology/[mythologySlug]/[storySlug].astro',
      'src/pages/character/index.astro',
      'src/pages/character/[slug].astro',
      'src/pages/world/index.astro',
      'src/pages/world/[slug].astro',
      'src/pages/wallpaper/index.astro',
      'src/pages/wallpaper/[slug].astro',
      'src/pages/search/index.astro',
      'src/pages/create/index.astro',
      'src/pages/api/character-graph.ts',
      'src/pages/sitemap-pages.xml.ts',
      'src/pages/sitemap-images.xml.ts',
      'src/pages/sitemap-index.xml.ts',
    ];
    for (const route of publicRoutes) {
      const source = readFileSync(resolve(process.cwd(), route), 'utf8');
      expect(source, route).not.toContain('runtime.env.DB');
      expect(source, route).not.toMatch(/lib\/content\/repositories['"]\s*;/);
    }
  });

  it('contains resolvable canonical entities and relation endpoints', () => {
    expect(publicCatalog.mythologies.length).toBeGreaterThan(0);
    expect(publicCatalog.characters.length).toBeGreaterThan(0);
    expect(publicCatalog.worlds.length).toBeGreaterThan(0);

    const characterIds = new Set(publicCatalog.characters.map((item) => item.id));
    const conceptIds = new Set(publicCatalog.contentConcepts.map((item) => item.id));
    for (const relation of publicCatalog.characterRelations) {
      expect(characterIds.has(relation.fromCharacterId)).toBe(true);
      expect(relation.toCharacterId ? characterIds.has(relation.toCharacterId) : Boolean(relation.toConceptId && conceptIds.has(relation.toConceptId))).toBe(true);
    }
  });

  it('publishes complete Light/Dark homepage hero metadata from the static catalog', () => {
    expect(publicCatalog.mythologies).toHaveLength(10);
    for (const mythology of publicCatalog.mythologies) {
      expect(mythology.homeHero?.lightSrc, mythology.slug).toBe(`/media/mythologies/${mythology.slug}/home/light.webp`);
      expect(mythology.homeHero?.darkSrc, mythology.slug).toBe(`/media/mythologies/${mythology.slug}/home/dark.webp`);
      expect(mythology.homeHero?.focalPoint, mythology.slug).toEqual({ x: 0.5, y: 0.42 });
    }
  });

  it('keeps the published artwork snapshot and derives missing character portraits', () => {
    expect(publicCatalog.curatedArtworks.filter((item) => item.reviewStatus === 'approved').length).toBeGreaterThanOrEqual(180);
    expect(publicCatalog.curatedArtworks.some((item) => item.slug === 'ymir-canonical-m-01')).toBe(true);
    expect(getPublicCharacterBySlug('ymir')?.portrait?.src).toBe('/media/characters/ymir/canonical/mobile-wallpaper/canonical_m_01.png');
  });

  it('serves public entity detail, search and generation context without D1', async () => {
    expect(getPublicCharacterBySlug('athena')?.name).toBe('雅典娜');
    expect(getPublicWorldBySlug('olympus')?.name).toBe('奥林匹斯');
    expect(getPublicMythologyById('myth-greek')?.name).toBe('希腊神话');
    expect(getStaticCharacterDetailViewModel('athena')?.mythology?.id).toBe('myth-greek');
    expect((await searchAll(unavailableD1, '雅典娜'))[0]).toMatchObject({ type: 'character', slug: 'athena' });

    const request: GenerationRequest = {
      entityType: 'character',
      entityId: 'character-athena',
      styleId: 'cinematic',
      scene: '奥林匹斯诸神议庭',
      composition: '人物居中的英雄全身构图',
      ratio: '16:9',
      outputSpecId: 'desktop-wallpaper',
    };
    const context = await resolveGenerationContext(unavailableD1, request);
    expect(context.entityName).toBe('雅典娜');
    expect(context.dimensions).toEqual({ width: 2560, height: 1440 });
  });
});
