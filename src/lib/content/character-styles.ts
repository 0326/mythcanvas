export type CharacterStyleId =
  | 'canonical'
  | 'cinematic'
  | 'sacred'
  | 'anime'
  | 'dark-fantasy'
  | 'cyber-myth';

export type CharacterStyleDefinition = {
  id: CharacterStyleId;
  name: string;
  nameEn: string;
  description: string;
  legacyIds: readonly string[];
};

/**
 * Character detail pages use the production six rendering styles.
 * Legacy style ids (warrior / dark / cyber) are accepted as aliases so existing artwork continues to render.
 * `warrior` is no longer a rendering concept; it maps to `cinematic`.
 */
export const characterStyles: readonly CharacterStyleDefinition[] = [
  {
    id: 'canonical',
    name: '经典神话',
    nameEn: 'Canonical',
    description: '保留角色最稳定的神话身份与视觉锚点。',
    legacyIds: ['canonical'],
  },
  {
    id: 'cinematic',
    name: '电影感',
    nameEn: 'Cinematic',
    description: '以电影感写实光影与氛围深度强化角色神性与史诗感。',
    legacyIds: ['cinematic', 'warrior'],
  },
  {
    id: 'sacred',
    name: '神圣',
    nameEn: 'Sacred',
    description: '以克制神光、仪式感和空灵氛围强化神性。',
    legacyIds: ['sacred'],
  },
  {
    id: 'anime',
    name: '动漫',
    nameEn: 'Anime',
    description: '以清晰线稿和插画式光影呈现角色。',
    legacyIds: ['anime'],
  },
  {
    id: 'dark-fantasy',
    name: '暗黑幻想',
    nameEn: 'Dark Fantasy',
    description: '使用深色层次和神秘氛围，但不走恐怖化路线。',
    legacyIds: ['dark-fantasy', 'dark'],
  },
  {
    id: 'cyber-myth',
    name: '赛博神话',
    nameEn: 'Cyber Myth',
    description: '融合未来材质与光几何，同时保留文明身份。',
    legacyIds: ['cyber-myth', 'cyber'],
  },
];

const styleIdMap = new Map(
  characterStyles.flatMap((style) => style.legacyIds.map((legacyId) => [legacyId, style.id] as const)),
);

export function normalizeCharacterStyleId(styleId: string | null | undefined): CharacterStyleId | undefined {
  if (!styleId) return undefined;
  const direct = styleIdMap.get(styleId);
  if (direct) return direct;
  return characterStyles.some((style) => style.id === styleId) ? (styleId as CharacterStyleId) : undefined;
}

export function getCharacterStyle(styleId: CharacterStyleId): CharacterStyleDefinition {
  return characterStyles.find((style) => style.id === styleId) ?? characterStyles[0];
}
