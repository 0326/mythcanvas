import { getCharacterById, getMythologyById, getStyleById, getWorldById } from '../content/repositories';
import {
  getCharacterVariantProfile,
  getOutputSpecProfile,
  getStyleGenerationProfile,
} from './config-repository';
import type { GenerationRequest, PromptLayers, ResolvedGenerationContext } from './types';
import { GenerationValidationError } from './validation';

export async function resolveGenerationContext(
  db: D1Database | undefined,
  request: GenerationRequest,
): Promise<ResolvedGenerationContext> {
  const style = await getStyleById(db, request.styleId);
  if (!style) throw new GenerationValidationError('STYLE_NOT_FOUND', '所选画风不存在。', 404);

  const entity = request.entityType === 'character'
    ? await getCharacterById(db, request.entityId)
    : await getWorldById(db, request.entityId);

  if (!entity) throw new GenerationValidationError('ENTITY_NOT_FOUND', '所选角色或神域不存在。', 404);

  const mythology = await getMythologyById(db, entity.mythologyId);
  if (!mythology) throw new GenerationValidationError('MYTHOLOGY_NOT_FOUND', '对应神话体系不存在。', 404);

  const variant = request.entityType === 'character'
    ? await getCharacterVariantProfile(db, request.variantId, entity.id)
    : undefined;
  const styleProfile = await getStyleGenerationProfile(db, style.id);
  const outputSpec = await getOutputSpecProfile(db, request.outputSpecId, request.ratio);

  if (request.outputSpecId && outputSpec.ratio !== request.ratio) {
    throw new GenerationValidationError(
      'OUTPUT_SPEC_RATIO_MISMATCH',
      `输出规格 ${outputSpec.name} 使用 ${outputSpec.ratio}，与请求比例 ${request.ratio} 不一致。`,
    );
  }

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
    variant,
    styleId: style.id,
    styleName: style.name,
    styleProfile,
    scene: request.scene,
    composition: request.composition,
    ratio: outputSpec.ratio,
    outputSpec: {
      id: outputSpec.id,
      name: outputSpec.name,
      deviceType: outputSpec.deviceType,
      ratio: outputSpec.ratio,
      safeZone: outputSpec.safeZone,
      compositionRules: outputSpec.compositionRules,
      quality: outputSpec.quality,
    },
    description: request.description ?? '',
    dimensions: { width: outputSpec.width, height: outputSpec.height },
  };
}

export function composeGenerationPrompt(context: ResolvedGenerationContext): string {
  return Object.values(composeGenerationPromptLayers(context)).filter(Boolean).join('\n\n');
}

export function composeGenerationPromptLayers(context: ResolvedGenerationContext): PromptLayers {
  const target = context.outputSpec.deviceType === 'mobile' ? 'mobile wallpaper' : 'desktop wallpaper';

  const purpose = [
    `Create one original premium MythCanvas ${target}.`,
    `The subject is ${context.entityName}, a ${context.entityType} from ${context.mythologyName} mythology.`,
    'Make the image feel like intentional mythology key art rather than a generic AI portrait or game UI splash screen.',
  ].join(' ');

  const identity = [
    `Preserve the established MythCanvas identity of ${context.entityName}.`,
    context.canonicalAnchors.length
      ? `Canonical identity anchors: ${context.canonicalAnchors.join('; ')}.`
      : '',
    context.symbols.length ? `Stable symbols and attributes: ${context.symbols.join('; ')}.` : '',
    'These identity anchors take priority over rendering-style variation.',
  ].filter(Boolean).join(' ');

  const variant = context.variant
    ? [
        `Use the approved ${context.variant.variantType} variant “${context.variant.name}”.`,
        context.variant.description ? `${context.variant.description}.` : '',
        context.variant.promptFragment ? `${context.variant.promptFragment}.` : '',
        context.variant.identityOverrides.length
          ? `Only these persistent identity changes are approved for this variant: ${context.variant.identityOverrides.join('; ')}.`
          : '',
        'Preserve every other canonical identity anchor.',
      ].filter(Boolean).join(' ')
    : undefined;

  const civilization = [
    `Ground the image in ${context.mythologyName} Civilization Visual DNA rather than generic fantasy shorthand.`,
    context.visualDna.palette.length ? `Palette cues: ${context.visualDna.palette.join(', ')}.` : '',
    context.visualDna.motifs.length ? `Cultural motifs: ${context.visualDna.motifs.join(', ')}.` : '',
    context.visualDna.materials.length ? `Materials: ${context.visualDna.materials.join(', ')}.` : '',
    context.visualDna.atmosphere.length ? `Atmosphere: ${context.visualDna.atmosphere.join(', ')}.` : '',
  ].filter(Boolean).join(' ');

  const style = [
    `Render in the “${context.styleName}” style.`,
    context.styleProfile.promptTemplate,
    context.styleProfile.renderRules.length
      ? `Apply these rendering rules: ${context.styleProfile.renderRules.join('; ')}.`
      : '',
    context.styleProfile.avoid.length
      ? `Avoid these style failures: ${context.styleProfile.avoid.join('; ')}.`
      : '',
    'The style changes rendering language only; it must not redesign the subject or erase civilization identity.',
  ].filter(Boolean).join(' ');

  const scene = [
    `Scene: ${context.scene}.`,
    `Composition and camera target: ${context.composition}.`,
    'Keep one clear primary focal hierarchy and make the environment support the mythology rather than compete with the subject.',
  ].join(' ');

  const output = [
    `Compose specifically for ${context.outputSpec.name}: ${context.outputSpec.ratio} at ${context.dimensions.width}×${context.dimensions.height}.`,
    ...context.outputSpec.compositionRules.map((rule) => sentence(rule)),
    safeZoneDirection(context.outputSpec.safeZone),
    'Do not rely on stretching or a later crop to make this composition fit another device.',
  ].filter(Boolean).join(' ');

  const refinement = context.description
    ? `Additional user direction, subordinate to the established identity and style constraints: ${context.description}.`
    : undefined;

  const guardrails = [
    'Create an original MythCanvas interpretation from mythological/public-domain source material.',
    'Do not imitate the specific face, costume, logo, card frame, UI, or character design of a modern anime, game, film, or other commercial adaptation.',
    'Do not add text, watermark, signature, interface chrome, or brand logos inside the artwork.',
    'Do not introduce extra duplicate characters, limbs, weapons, or symbols unless the scene explicitly requires them.',
  ].join(' ');

  return {
    purpose,
    identity,
    variant,
    civilization,
    style,
    scene,
    output,
    refinement,
    guardrails,
  };
}

function safeZoneDirection(safeZone: Readonly<Record<string, unknown>>): string {
  const top = finiteNumber(safeZone.topReservedPct);
  const bottom = finiteNumber(safeZone.bottomReservedPct);
  const horizontal = finiteNumber(safeZone.horizontalPaddingPct);
  const edge = finiteNumber(safeZone.edgePaddingPct);
  const details: string[] = [];

  if (top) details.push(`keep approximately the top ${top}% visually quiet enough for lock-screen time/status UI`);
  if (bottom) details.push(`keep important identity details out of the bottom ${bottom}%`);
  if (horizontal) details.push(`preserve about ${horizontal}% horizontal crop-safe breathing room`);
  if (edge) details.push(`keep critical details at least about ${edge}% away from extreme frame edges`);

  return details.length ? `Safe-zone guidance: ${details.join('; ')}.` : '';
}

function sentence(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return /[.!?。！？]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function finiteNumber(value: unknown): number | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return undefined;
  return value;
}
