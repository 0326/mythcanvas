export type CharacterStyleId = 'canonical' | 'sacred' | 'warrior' | 'dark' | 'cyber' | 'anime';

export type CharacterStyleDefinition = {
  id: CharacterStyleId;
  name: string;
  nameEn: string;
  description: string;
  legacyIds: readonly string[];
};

/**
 * Character detail pages use the product's canonical six visual forms.
 * Legacy database style ids remain accepted so existing artwork continues to render.
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
    id: 'sacred',
    name: '神圣',
    nameEn: 'Sacred',
    description: '以克制神光、仪式感和空灵氛围强化神性。',
    legacyIds: ['sacred'],
  },
  {
    id: 'warrior',
    name: '战神',
    nameEn: 'Warrior',
    description: '将角色身份转译为更有力量感的史诗形态。',
    legacyIds: ['warrior', 'cinematic'],
  },
  {
    id: 'dark',
    name: '暗黑',
    nameEn: 'Dark',
    description: '使用深色层次和神秘氛围，但不走恐怖化路线。',
    legacyIds: ['dark', 'dark-fantasy'],
  },
  {
    id: 'cyber',
    name: '赛博',
    nameEn: 'Cyber',
    description: '融合未来材质与光几何，同时保留文明身份。',
    legacyIds: ['cyber', 'cyber-myth'],
  },
  {
    id: 'anime',
    name: '动漫',
    nameEn: 'Anime',
    description: '以清晰线稿和插画式光影呈现角色。',
    legacyIds: ['anime'],
  },
];

const styleIdMap = new Map(
  characterStyles.flatMap((style) => style.legacyIds.map((legacyId) => [legacyId, style.id] as const)),
);

export function normalizeCharacterStyleId(styleId: string | null | undefined): CharacterStyleId | undefined {
  return styleId ? styleIdMap.get(styleId) : undefined;
}

export function getCharacterStyle(styleId: CharacterStyleId): CharacterStyleDefinition {
  return characterStyles.find((style) => style.id === styleId) ?? characterStyles[0];
}
