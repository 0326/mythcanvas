import type { StoryIllustrationAsset } from '../lib/content/types';

const legacyOriginalProvenance = {
  sourceType: 'original' as const,
  creator: 'MythCanvas',
  licenseName: 'MythCanvas Original — legacy asset reviewed for public use (2026-08-31)',
};

export const storyIllustrations: readonly StoryIllustrationAsset[] = [
  {
    id: 'story-illustration-chinese-celestial',
    image: { src: '/media/content/chinese-celestial.svg', alt: '天地分开后云海与天门的视觉想象', width: 1600, height: 900 },
    provenance: legacyOriginalProvenance,
  },
  {
    id: 'story-illustration-moon-palace',
    image: { src: '/media/content/art-moon-palace.jpg', alt: '月宫清辉中的嫦娥视觉形象', width: 720, height: 1280 },
    provenance: legacyOriginalProvenance,
  },
  {
    id: 'story-illustration-olympus',
    image: { src: '/media/content/greek-olympus-v2.webp', alt: '晨光下的奥林匹斯白色大理石议庭、山巅与云海', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original', model: 'gpt-image-2', promptRecipeId: 'greek-world-olympus-desktop-v1' },
  },
  {
    id: 'story-illustration-olympus-dawn',
    image: { src: '/media/content/greek-olympus-mobile-v1.webp', alt: '竖幅晨光下的奥林匹斯白色大理石议庭、云海与神圣阶梯', width: 941, height: 1672 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original', model: 'gpt-image-2', promptRecipeId: 'greek-world-olympus-mobile-v1' },
  },
  {
    id: 'story-illustration-athena',
    image: { src: '/media/characters/athena/canonical/mobile-wallpaper/canonical_m_01.png', alt: '雅典娜以盾、矛与青铜金色建立神性身份', width: 941, height: 1672 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original', model: 'gpt-image-2', promptRecipeId: 'mythcanvas.character.v1' },
    artworkId: 'art-athena-canonical-m-01',
  },
  {
    id: 'story-illustration-asgard',
    image: { src: '/media/content/norse-asgard.jpg', alt: '冰川、巨石与世界树构成的北欧宇宙意象', width: 1280, height: 720 },
    provenance: legacyOriginalProvenance,
  },
  {
    id: 'story-illustration-asgard-aurora',
    image: { src: '/media/content/art-asgard-aurora.jpg', alt: '极光与世界树构成知识试炼的北境氛围', width: 720, height: 1280 },
    provenance: legacyOriginalProvenance,
    artworkId: 'art-asgard-aurora',
  },
  {
    id: 'story-illustration-takamagahara',
    image: { src: '/media/content/japanese-takamagahara.jpg', alt: '雾、山林与鸟居象征现世与神域之间的边界', width: 1280, height: 720 },
    provenance: legacyOriginalProvenance,
  },
  {
    id: 'story-illustration-takamagahara-moon',
    image: { src: '/media/content/art-takamagahara-moon.jpg', alt: '月下高天原表现太阳隐去后的静谧神域', width: 720, height: 1280 },
    provenance: legacyOriginalProvenance,
    artworkId: 'art-takamagahara-moon',
  },
  {
    id: 'story-illustration-kaguya',
    image: { src: '/media/content/char-kaguya.jpg', alt: '月光与竹影中的辉夜姬', width: 864, height: 1152 },
    provenance: legacyOriginalProvenance,
  },
  {
    id: 'story-illustration-duat-sun-barge',
    image: { src: '/media/content/art-duat-sun-barge.jpg', alt: '太阳神舟在星空之河上航行', width: 720, height: 1280 },
    provenance: legacyOriginalProvenance,
    artworkId: 'art-duat-sun-barge',
  },
  {
    id: 'story-illustration-duat',
    image: { src: '/media/content/egyptian-duat.jpg', alt: '杜阿特中的砂岩巨门与星空穹顶', width: 1280, height: 720 },
    provenance: legacyOriginalProvenance,
  },
  {
    id: 'story-illustration-anubis',
    image: { src: '/media/content/char-anubis.jpg', alt: '阿努比斯与黑金审判意象', width: 864, height: 1152 },
    provenance: legacyOriginalProvenance,
  },
];

const illustrationsById = new Map(storyIllustrations.map((asset) => [asset.id, asset]));

export const getStoryIllustrationById = (id: string): StoryIllustrationAsset | undefined => illustrationsById.get(id);
