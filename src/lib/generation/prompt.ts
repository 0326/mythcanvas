import { getCharacterById, getMythologyById, getRealmById, getStyleById } from '../content/repositories';
import type { GenerationRequest, ResolvedGenerationContext } from './types';
import { GenerationValidationError } from './validation';

const stylePromptHints: Record<string, string> = {
  canonical: 'faithful mythological interpretation, timeless and refined, culturally grounded',
  cinematic: 'cinematic concept art, epic scale, atmospheric depth, dramatic but elegant lighting',
  sacred: 'sacred luminous atmosphere, ceremonial composition, quiet divine presence',
  anime: 'refined anime illustration, clean silhouette, expressive but culturally grounded visual design',
  'dark-fantasy': 'dark fantasy atmosphere, mysterious and solemn, no horror, gore, or gothic clichés',
  'cyber-myth': 'restrained futuristic materials and light fused with persistent mythological identity',
};

export async function resolveGenerationContext(
  db: D1Database | undefined,
  request: GenerationRequest,
): Promise<ResolvedGenerationContext> {
  const style = await getStyleById(db, request.styleId);
  if (!style) throw new GenerationValidationError('STYLE_NOT_FOUND', '所选画风不存在。', 404);

  const entity = request.entityType === 'character'
    ? await getCharacterById(db, request.entityId)
    : await getRealmById(db, request.entityId);

  if (!entity) throw new GenerationValidationError('ENTITY_NOT_FOUND', '所选角色或神域不存在。', 404);

  const mythology = await getMythologyById(db, entity.mythologyId);
  if (!mythology) throw new GenerationValidationError('MYTHOLOGY_NOT_FOUND', '对应神话文明不存在。', 404);

  const canonicalAnchors = entity.canonicalDesign.anchors;
  const symbols = request.entityType === 'character' && 'symbols' in entity ? entity.symbols : [];

  return {
    entityType: request.entityType,
    entityId: entity.id,
    entityName: entity.name,
    mythologyId: mythology.id,
    mythologyName: mythology.name,
    visualDna: mythology.visualDna,
    canonicalAnchors,
    symbols,
    styleId: style.id,
    styleName: style.name,
    scene: request.scene,
    composition: request.composition,
    ratio: request.ratio,
    description: request.description ?? '',
    dimensions: dimensionsFor(request.ratio),
  };
}

export function composeGenerationPrompt(context: ResolvedGenerationContext): string {
  const identity = [
    `Subject: ${context.entityName} (${context.entityType}) from ${context.mythologyName}.`,
    `Canonical identity anchors: ${context.canonicalAnchors.join(', ')}.`,
    context.symbols.length ? `Stable symbols: ${context.symbols.join(', ')}.` : '',
  ].filter(Boolean).join(' ');

  const dna = [
    `Civilization visual DNA palette: ${context.visualDna.palette.join(', ')}.`,
    `Motifs: ${context.visualDna.motifs.join(', ')}.`,
    `Materials: ${context.visualDna.materials.join(', ')}.`,
    `Atmosphere: ${context.visualDna.atmosphere.join(', ')}.`,
  ].join(' ');

  const composition = [
    `Visual style: ${context.styleName}; ${stylePromptHints[context.styleId] ?? 'high-quality mythological visual art'}.`,
    `Scene: ${context.scene}.`,
    `Composition target: ${context.composition}, aspect ratio ${context.ratio}.`,
    `Wallpaper-ready composition with deliberate negative space and clear focal hierarchy.`,
  ].join(' ');

  const custom = context.description ? `Additional direction: ${context.description}.` : '';

  const guardrails = [
    'Create an original MythCanvas interpretation based on mythology/public-domain source material.',
    'Do not imitate the specific costume, face, logo, card frame, UI, or character design of modern anime, games, films, or commercial IP adaptations.',
    'Preserve the mythological identity while allowing the selected rendering style to vary.',
    'No text, watermark, signature, or brand logo inside the artwork.',
  ].join(' ');

  return [identity, dna, composition, custom, guardrails].filter(Boolean).join('\n');
}

function dimensionsFor(ratio: string): { width: number; height: number } {
  switch (ratio) {
    case '9:16': return { width: 900, height: 1600 };
    case '16:9': return { width: 1600, height: 900 };
    case '3:4': return { width: 900, height: 1200 };
    case '4:3': return { width: 1200, height: 900 };
    default: return { width: 1024, height: 1024 };
  }
}
