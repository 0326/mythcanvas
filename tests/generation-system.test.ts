import { describe, expect, it } from 'vitest';
import { getOutputSpecProfile } from '../src/lib/generation/config-repository';
import { composeGenerationPrompt, composeGenerationPromptLayers } from '../src/lib/generation/prompt';
import { createImageGenerationProvider, ImageProviderError } from '../src/lib/generation/provider';
import type { ResolvedGenerationContext } from '../src/lib/generation/types';

describe('structured generation system', () => {
  it('maps mobile wallpaper to 1440x2560', async () => {
    const spec = await getOutputSpecProfile(undefined, undefined, '9:16');
    expect(spec.id).toBe('mobile-wallpaper');
    expect(spec.width).toBe(1440);
    expect(spec.height).toBe(2560);
    expect(spec.ratio).toBe('9:16');
  });

  it('maps desktop wallpaper to 2560x1440', async () => {
    const spec = await getOutputSpecProfile(undefined, undefined, '16:9');
    expect(spec.id).toBe('desktop-wallpaper');
    expect(spec.width).toBe(2560);
    expect(spec.height).toBe(1440);
    expect(spec.ratio).toBe('16:9');
  });

  it('keeps Character, Variant, Style and OutputSpec in separate prompt layers', () => {
    const context: ResolvedGenerationContext = {
      entityType: 'character',
      entityId: 'character-athena',
      entityName: '雅典娜',
      mythologyId: 'myth-greek',
      mythologyName: '希腊神话',
      visualDna: {
        palette: ['ivory', 'bronze'],
        motifs: ['laurel', 'columns'],
        materials: ['marble', 'bronze'],
        atmosphere: ['high-altitude sacred light'],
      },
      canonicalAnchors: ['poised warrior-goddess silhouette', 'Aegis shield'],
      symbols: ['spear', 'owl'],
      variant: {
        id: 'athena-mature-ceremonial',
        name: '成熟礼仪战甲',
        variantType: 'composite',
        description: 'mature adult presentation with ceremonial armor',
        identityOverrides: ['ceremonial armor layers'],
        promptFragment: 'more formal mantle and armor detailing',
        referenceAssetIds: ['ref-athena-ceremonial'],
      },
      styleId: 'cyber-myth',
      styleName: 'Cyber Myth',
      styleProfile: {
        promptTemplate: 'Fuse restrained futuristic materials into the mythological design.',
        renderRules: ['preserve mythology-first silhouette'],
        avoid: ['generic neon-city cyberpunk'],
      },
      scene: 'Olympus at night',
      composition: 'heroic full-body three-quarter view',
      ratio: '9:16',
      outputSpec: {
        id: 'mobile-wallpaper',
        name: '手机壁纸',
        deviceType: 'mobile',
        ratio: '9:16',
        safeZone: { topReservedPct: 14 },
        compositionRules: ['use a clear vertical subject silhouette'],
        quality: 'high',
      },
      description: 'subtle electric-blue divine circuitry',
      dimensions: { width: 1440, height: 2560 },
    };

    const layers = composeGenerationPromptLayers(context);
    expect(layers.identity).toContain('Aegis shield');
    expect(layers.variant).toContain('成熟礼仪战甲');
    expect(layers.style).toContain('Cyber Myth');
    expect(layers.output).toContain('1440×2560');
    expect(layers.refinement).toContain('electric-blue');

    const prompt = composeGenerationPrompt(context);
    expect(prompt.indexOf('established MythCanvas identity')).toBeLessThan(prompt.indexOf('Additional user direction'));
    expect(prompt).toContain('Do not imitate');
  });

  it('fails closed when OpenAI mode has no secret', () => {
    expect(() => createImageGenerationProvider({ AI_GENERATION_MODE: 'openai' }))
      .toThrow(ImageProviderError);
  });
});
