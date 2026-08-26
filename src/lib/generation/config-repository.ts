import { GenerationValidationError } from './validation';
import { getCharacterInterpretationById, getCharacterInterpretations } from '../content/repositories';
import type { CharacterInterpretation, SourceRef } from '../content/types';

export type CharacterInterpretationProfile = {
  id: string;
  characterId: string;
  slug: string;
  name: string;
  role: string;
  summary: string;
  traditionTags: string[];
  sourcePeriods: string[];
  sourceRefs: SourceRef[];
  identityAnchors: string[];
  symbols: string[];
  canonicalDesignOverrides: Record<string, unknown>;
  promptFragment: string;
  confidence: 'high' | 'medium' | 'contested';
};

export type CharacterVariantProfile = {
  id: string;
  characterId: string;
  slug: string;
  interpretationId?: string;
  name: string;
  variantType: 'age' | 'costume' | 'form' | 'composite';
  description: string;
  identityOverrides: string[];
  promptFragment: string;
  referenceAssetIds: string[];
};

export type StyleGenerationProfile = {
  id: string;
  promptTemplate: string;
  renderRules: string[];
  avoid: string[];
};

export type OutputSpecProfile = {
  id: string;
  name: string;
  deviceType: 'desktop' | 'mobile';
  ratio: string;
  width: number;
  height: number;
  draftWidth: number;
  draftHeight: number;
  safeZone: Record<string, unknown>;
  compositionRules: string[];
  quality: 'low' | 'medium' | 'high' | 'auto';
};

const fallbackStyles: Record<string, StyleGenerationProfile> = {
  canonical: {
    id: 'canonical',
    promptTemplate: 'Render as the stable MythCanvas canonical interpretation: culturally grounded, refined, timeless, clear in silhouette, and visually premium without borrowing a modern franchise design.',
    renderRules: ['preserve canonical identity', 'culturally grounded materials', 'clear readable silhouette'],
    avoid: ['generic AI fantasy redesign', 'modern franchise-specific costume', 'unmotivated visual effects'],
  },
  cinematic: {
    id: 'cinematic',
    promptTemplate: 'Render with premium cinematic fantasy realism, atmospheric depth, refined material response, deliberate camera staging, and dramatic but elegant lighting.',
    renderRules: ['cinematic depth', 'realistic material response', 'controlled dramatic light', 'strong focal hierarchy'],
    avoid: ['game UI splash screen', 'excessive bloom', 'random particles', 'plastic AI sheen'],
  },
  sacred: {
    id: 'sacred',
    promptTemplate: 'Render with a luminous ceremonial atmosphere, quiet divine presence, restrained sacred light, elegant composition, and refined mythological materials.',
    renderRules: ['ceremonial composition', 'controlled sacred glow', 'quiet divine presence'],
    avoid: ['overexposed white glow', 'generic angel imagery', 'ornament overload'],
  },
  anime: {
    id: 'anime',
    promptTemplate: 'Render as a refined anime illustration with disciplined line work, a clean readable silhouette, expressive but coherent facial design, restrained gradients, and polished key-visual finishing.',
    renderRules: ['clean line hierarchy', 'readable silhouette', 'expressive coherent face'],
    avoid: ['chibi unless requested', 'generic school-anime costume', 'identity-destroying facial exaggeration'],
  },
  'dark-fantasy': {
    id: 'dark-fantasy',
    promptTemplate: 'Render as solemn dark fantasy with mysterious atmospheric depth, restrained contrast, weathered mythological materials, and monumental presence without horror or gore.',
    renderRules: ['solemn atmosphere', 'weathered materials', 'deep spatial layering'],
    avoid: ['gore', 'horror clichés', 'black-metal gothic styling', 'muddy unreadable silhouette'],
  },
  'cyber-myth': {
    id: 'cyber-myth',
    promptTemplate: 'Render as Cyber Myth: fuse restrained futuristic materials, luminous geometry, and advanced light into the existing mythological design while preserving cultural identity and recognizable silhouette.',
    renderRules: ['mythology-first silhouette', 'restrained luminous geometry', 'premium future materials'],
    avoid: ['generic neon-city cyberpunk', 'random cables', 'full identity redesign'],
  },
};

const fallbackOutputSpecs: Record<string, OutputSpecProfile> = {
  'desktop-wallpaper': {
    id: 'desktop-wallpaper',
    name: 'PC 壁纸',
    deviceType: 'desktop',
    ratio: '16:9',
    width: 2560,
    height: 1440,
    draftWidth: 1280,
    draftHeight: 720,
    safeZone: { edgePaddingPct: 4, preferredNegativeSpace: 'left-or-right' },
    compositionRules: [
      'preserve wide environmental storytelling',
      'keep the primary subject away from extreme crop edges',
      'maintain a readable focal hierarchy at desktop scale',
    ],
    quality: 'high',
  },
  'mobile-wallpaper': {
    id: 'mobile-wallpaper',
    name: '手机壁纸',
    deviceType: 'mobile',
    ratio: '9:16',
    width: 1440,
    height: 2560,
    draftWidth: 720,
    draftHeight: 1280,
    safeZone: { topReservedPct: 14, bottomReservedPct: 8, horizontalPaddingPct: 6 },
    compositionRules: [
      'keep key facial details below the extreme top edge',
      'preserve breathing room for lock-screen time and status UI',
      'use a clear vertical subject silhouette',
      'keep signature props away from the extreme bottom edge',
    ],
    quality: 'high',
  },
};

export async function getCharacterVariantProfile(
  db: D1Database | undefined,
  variantId: string | undefined,
  characterId: string,
  interpretationId?: string,
): Promise<CharacterVariantProfile | undefined> {
  if (!variantId) return undefined;
  if (!db) throw new GenerationValidationError('VARIANT_NOT_FOUND', '所选角色形态不存在。', 404);

  let row: Record<string, unknown> | null = null;
  try {
    row = await db.prepare(`
      SELECT id, character_id, slug, name, variant_type, description, identity_overrides_json,
             prompt_fragment, reference_pack_json, character_interpretation_id
      FROM character_variants
      WHERE id = ? AND character_id = ? AND status = 'active'
        AND (character_interpretation_id IS NULL OR character_interpretation_id = ?)
    `).bind(variantId, characterId, interpretationId ?? null).first<Record<string, unknown>>();
  } catch {
    throw new GenerationValidationError('VARIANT_NOT_FOUND', '角色形态数据尚未就绪。', 404);
  }

  if (!row) throw new GenerationValidationError('VARIANT_NOT_FOUND', '所选角色形态不存在。', 404);

  return {
    id: String(row.id),
    characterId: String(row.character_id),
    slug: String(row.slug),
    interpretationId: row.character_interpretation_id == null ? undefined : String(row.character_interpretation_id),
    name: String(row.name),
    variantType: String(row.variant_type) as CharacterVariantProfile['variantType'],
    description: String(row.description ?? ''),
    identityOverrides: stringArray(row.identity_overrides_json),
    promptFragment: String(row.prompt_fragment ?? ''),
    referenceAssetIds: stringArray(row.reference_pack_json),
  };
}

export async function getCharacterInterpretationProfile(
  db: D1Database | undefined,
  interpretationId: string | undefined,
  characterId: string,
): Promise<CharacterInterpretationProfile | undefined> {
  if (!interpretationId) return undefined;
  if (!db) throw new GenerationValidationError('INTERPRETATION_NOT_FOUND', '所选传统版本不存在。', 404);

  try {
    const interpretation = await getCharacterInterpretationById(db, interpretationId, characterId);
    if (!interpretation) {
      throw new GenerationValidationError('INTERPRETATION_NOT_FOUND', '所选传统版本不存在。', 404);
    }
    return toCharacterInterpretationProfile(interpretation);
  } catch (error) {
    if (error instanceof GenerationValidationError) throw error;
    throw new GenerationValidationError('INTERPRETATION_NOT_FOUND', '传统版本数据尚未就绪。', 404);
  }
}

/** Lists source-scoped identities for the guided Creator without exposing D1 rows to UI code. */
export async function listCharacterInterpretationProfiles(
  db: D1Database | undefined,
  characterIds: string[],
): Promise<CharacterInterpretationProfile[]> {
  if (!db || characterIds.length === 0) return [];
  try {
    const groups = await Promise.all(characterIds.map((characterId) => getCharacterInterpretations(db, characterId)));
    return groups.flat().map(toCharacterInterpretationProfile);
  } catch {
    // Keep the Creator usable while the additive interpretation migration rolls out.
    return [];
  }
}

function toCharacterInterpretationProfile(
  interpretation: CharacterInterpretation,
): CharacterInterpretationProfile {
  return {
    id: interpretation.id,
    characterId: interpretation.characterId,
    slug: interpretation.slug,
    name: interpretation.name,
    role: interpretation.role,
    summary: interpretation.summary,
    traditionTags: [...interpretation.traditionTags],
    sourcePeriods: [...interpretation.sourcePeriods],
    sourceRefs: [...interpretation.sourceRefs],
    identityAnchors: [...interpretation.identityAnchors],
    symbols: [...interpretation.symbols],
    canonicalDesignOverrides: interpretation.canonicalDesignOverrides,
    promptFragment: interpretation.promptFragment,
    confidence: interpretation.confidence,
  };
}

export async function getStyleGenerationProfile(
  db: D1Database | undefined,
  styleId: string,
): Promise<StyleGenerationProfile> {
  if (db) {
    try {
      const row = await db.prepare(`
        SELECT id, prompt_template, render_rules_json, avoid_json
        FROM styles
        WHERE id = ? AND status = 'active'
      `).bind(styleId).first<Record<string, unknown>>();
      if (row) {
        return {
          id: String(row.id),
          promptTemplate: String(row.prompt_template ?? ''),
          renderRules: stringArray(row.render_rules_json),
          avoid: stringArray(row.avoid_json),
        };
      }
    } catch {
      // Production migration may not be applied yet; fall back to code profiles.
    }
  }

  return fallbackStyles[styleId] ?? {
    id: styleId,
    promptTemplate: 'Render as polished, original, culturally grounded mythology artwork with a clear focal hierarchy and refined materials.',
    renderRules: ['preserve subject identity', 'clear focal hierarchy'],
    avoid: ['generic AI-art artifacts'],
  };
}

export async function getOutputSpecProfile(
  db: D1Database | undefined,
  outputSpecId: string | undefined,
  ratio: string,
): Promise<OutputSpecProfile> {
  const inferredId = outputSpecId ?? inferOutputSpecId(ratio);
  if (db) {
    try {
      const row = await db.prepare(`
        SELECT id, name, device_type, aspect_ratio, width, height, draft_width, draft_height,
               safe_zone_json, composition_rules_json, default_quality
        FROM output_specs
        WHERE id = ? AND status = 'active'
      `).bind(inferredId).first<Record<string, unknown>>();
      if (row) {
        return {
          id: String(row.id),
          name: String(row.name),
          deviceType: String(row.device_type) as OutputSpecProfile['deviceType'],
          ratio: String(row.aspect_ratio),
          width: Number(row.width),
          height: Number(row.height),
          draftWidth: Number(row.draft_width),
          draftHeight: Number(row.draft_height),
          safeZone: objectValue(row.safe_zone_json),
          compositionRules: stringArray(row.composition_rules_json),
          quality: String(row.default_quality) as OutputSpecProfile['quality'],
        };
      }
    } catch {
      // Fall back to code defaults while migrations roll out.
    }
  }

  const fallback = fallbackOutputSpecs[inferredId];
  if (fallback) return fallback;
  return genericOutputSpec(ratio);
}

function inferOutputSpecId(ratio: string): string {
  if (ratio === '9:16') return 'mobile-wallpaper';
  if (ratio === '16:9') return 'desktop-wallpaper';
  return `generic-${ratio.replace(':', 'x')}`;
}

function genericOutputSpec(ratio: string): OutputSpecProfile {
  const dimensions: Record<string, [number, number]> = {
    '1:1': [1024, 1024],
    '3:4': [1152, 1536],
    '4:3': [1536, 1152],
  };
  const [width, height] = dimensions[ratio] ?? [1024, 1024];
  return {
    id: inferOutputSpecId(ratio),
    name: ratio,
    deviceType: width >= height ? 'desktop' : 'mobile',
    ratio,
    width,
    height,
    draftWidth: width,
    draftHeight: height,
    safeZone: {},
    compositionRules: ['maintain a clear focal hierarchy and safe crop margins'],
    quality: 'high',
  };
}

function stringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value !== 'string' || !value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function objectValue(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value as Record<string, unknown>;
  if (typeof value !== 'string' || !value) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}
