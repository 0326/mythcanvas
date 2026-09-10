import fs from 'node:fs';
import path from 'node:path';

const cardId = process.argv[2];
if (!/^100301\d{4}$/.test(cardId ?? '')) {
  throw new Error('Usage: node scripts/compose-norse-card-prompt.mjs <10-digit-card-id>');
}

const cardPath = path.resolve(
  'docs/cards/norse/M01-norse-genesis/cards',
  `${cardId}.json`,
);
const card = JSON.parse(fs.readFileSync(cardPath, 'utf8'));
const continuityPath = path.resolve(
  'docs/cards/norse/M01-norse-genesis/M01_VISUAL_CONTINUITY.json',
);
const continuity = JSON.parse(fs.readFileSync(continuityPath, 'utf8'));
const isLandscape = card.type === 'ensemble';
const orientation = isLandscape ? 'landscape 16:9' : 'portrait 9:16';
const targetSize = isLandscape ? 'at least 2880x1620 pixels' : 'at least 1620x2880 pixels';

const list = (value = []) => value.length ? value.join('；') : '无额外条目';
const continuityEntities = Object.entries(continuity.entities)
  .filter(([, entity]) => entity.appearsOnCardIds.includes(card.cardId))
  .map(([entityId, entity]) => ({ entityId, ...entity }));
const continuityReferenceIds = [...new Set(
  continuityEntities.map((entity) => entity.canonicalCardId),
)];
const continuityLocks = continuityEntities.flatMap((entity) =>
  entity.designLocks.map((lock) => `${entity.entityId}: ${lock}`),
);
const sourceFacts = continuityEntities.flatMap((entity) =>
  (entity.sourceBoundFacts ?? []).map((fact) => `${entity.entityId}: ${fact}`),
);
const common = [
  'Match the established M01 artwork family: painterly mythic realism with matte surfaces, broad readable shapes, controlled cinematic blue-white frost and restrained ember light, atmospheric depth, limited focal sharpness, and restrained brush detail.',
  'Subject or key moment must be sharper and more contrasted than the background.',
  'Use mythology-first visual storytelling rather than generic AI fantasy.',
  'Keep at most one primary environmental motif and one secondary motif; preserve quiet areas and clear visual hierarchy.',
  'Compose for future card crop safety: the face, hands, identity symbol, key object, or story action must work in the upper-middle area; the bottom 30 percent may be sacrificed.',
].join(' ');

const storyContext = card.seriesNarrative
  ? `Story chapter: ${card.seriesNarrative.chapterTitle}. Key moment: ${card.seriesNarrative.keyMoment}. Narrative context: ${card.seriesNarrative.narrative}`
  : '';

const prompt = [
  'Use case: stylized-concept.',
  'Asset type: MythCanvas Norse M01 collectible-card source artwork.',
  `Create ONE standalone ${orientation} pure artwork for card ${cardId}, ${card.titleEn} / ${card.titleZh}, type ${card.type}.`,
  'This is an original mythological interpretation, not a copy of a modern franchise design.',
  'The image must contain no typography, title, logo, card frame, number, watermark, pseudo-runes, UI, collage, split layout, contact sheet, or panels.',
  `Content brief: ${card.prompt.draft}`,
  `Visual thesis: ${card.visualThesis}`,
  storyContext,
  `Visual continuity entities: ${list(continuityEntities.map((entity) => entity.entityId))}.`,
  `Canonical image references required for identity/landmark matching: ${list(continuityReferenceIds.map(String))}. These references control recurring face, age, silhouette, palette, material, and landmark geometry; they do not control camera or pose.`,
  `Source-bound continuity facts: ${list(sourceFacts)}`,
  `MythCanvas locked continuity design: ${list(continuityLocks)}`,
  `Identity anchors: ${list(card.canon?.identityAnchors)}`,
  `Must keep: ${list(card.canon?.mustKeep)}`,
  `Must avoid: ${list(card.canon?.mustAvoid)}`,
  `Composition: camera ${card.composition?.camera ?? 'clear subject-first camera'}; shot ${card.composition?.shot ?? 'single readable composition'}; keep the primary subject/action inside the crop-safe upper-middle area.`,
  common,
  `Series-wide visual grammar: keep ${list(continuity.seriesStyle.keep)}; avoid ${list(continuity.seriesStyle.avoid)}.`,
  `Color and material guidance: palette ${list(card.visual?.palette)}; materials ${list(card.visual?.materials)}; mood ${list(card.visual?.mood)}.`,
  `Related card IDs for narrative continuity only: ${list(card.references?.cardIds ?? [])}. Preserve their mythic relationship without cloning faces, silhouettes, or poses.`,
  `Avoid these failure modes: ${list(card.prompt.negative)}; excessive particles, floating debris overload, glossy game-CG, hyper-detailed-everything, random glowing runes, generic Viking cosplay, modern copyrighted adaptation, malformed anatomy, extra limbs, unreadable hands or props.`,
  `Fill one complete ${orientation} canvas with no margins. Target final canvas ${targetSize}.`,
].filter(Boolean).join('\n\n');

process.stdout.write(prompt);
