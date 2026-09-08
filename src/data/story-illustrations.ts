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
    image: { src: '/media/content/norse/worlds/norse-asgard-final-v1.webp', alt: '冰川、巨石与世界树构成的北欧宇宙意象', width: 2560, height: 1440 },
    provenance: legacyOriginalProvenance,
  },
  {
    id: 'story-illustration-asgard-aurora',
    image: { src: '/media/content/norse/worlds/norse-asgard-mobile-final-v1.webp', alt: '极光与世界树构成知识试炼的北境氛围', width: 1440, height: 2560 },
    provenance: legacyOriginalProvenance,
    artworkId: 'art-asgard-aurora',
  },
  {
    id: 'story-illustration-norse-fimbulwinter',
    image: { src: '/media/content/norse/stories/norse-story-fimbulwinter-v1.webp', alt: '芬布尔之冬降临中米德加尔特的冰雪海岸与荒废长屋', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-fimbulwinter-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-ymir-creation',
    image: { src: '/media/content/norse/stories/norse-story-ymir-creation-v1.webp', alt: '金伦加鸿沟中尤弥尔在冰霜与热雾交汇处出现', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-ymir-creation-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-audhumla-and-buri',
    image: { src: '/media/content/norse/stories/norse-story-audhumla-and-buri-v1.webp', alt: '奥德胡姆拉在冰霜边缘舔食盐霜、布里从冰壁中显现', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-audhumla-and-buri-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-odin-creates-world',
    image: { src: '/media/content/norse/stories/norse-story-odin-creates-world-v1.webp', alt: '奥丁、威利与维在新生海岸以尤弥尔之躯塑造世界', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-odin-creates-world-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-ask-and-embla',
    image: { src: '/media/content/norse/stories/norse-story-ask-and-embla-v1.webp', alt: '阿斯克与恩布拉在米德加尔特海岸从漂木中获得生命', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-ask-and-embla-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-yggdrasil-wells-norns',
    image: { src: '/media/content/norse/stories/norse-story-yggdrasil-wells-norns-v1.webp', alt: '世界树根部的三口井与守护命运的诺恩', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-yggdrasil-wells-norns-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-norns-at-urdarbrunnr',
    image: { src: '/media/content/norse/stories/norse-story-norns-at-urdarbrunnr-v1.webp', alt: '诺恩在乌尔达之井旁照料世界树根部', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-norns-at-urdarbrunnr-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-sun-and-moon-chase',
    image: { src: '/media/content/norse/stories/norse-story-sun-and-moon-chase-v1.webp', alt: '日与月穿越北方天空、被斯库尔与哈提追逐', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-sun-and-moon-chase-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-nidhoggr-and-world-tree',
    image: { src: '/media/content/norse/stories/norse-story-nidhoggr-and-world-tree-v1.webp', alt: '尼德霍格在世界树根部的幽暗岩地中啃噬树根', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-nidhoggr-and-world-tree-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-odin-and-fenrir',
    image: { src: '/media/content/norse/stories/norse-story-odin-and-fenrir-v1.webp', alt: '诸神黄昏中奥丁与芬里尔在风暴和灰烬中对峙', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-odin-and-fenrir-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-thor-jormungandr-final-battle',
    image: { src: '/media/content/norse/stories/norse-story-thor-jormungandr-final-battle-v1.webp', alt: '雷神索尔与耶梦加得在暴风海岸的最终对峙', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-thor-jormungandr-final-battle-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-freyr-and-surtr',
    image: { src: '/media/content/norse/stories/norse-story-freyr-and-surtr-v1.webp', alt: '弗雷在穆斯贝尔边界面对手持燃烧之剑的苏尔特尔', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-freyr-and-surtr-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-heimdall-and-loki',
    image: { src: '/media/content/norse/stories/norse-story-heimdall-and-loki-v1.webp', alt: '海姆达尔与洛基在断裂彩虹桥上的末日对峙', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-heimdall-and-loki-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-ragnarok',
    image: { src: '/media/content/norse/stories/norse-story-ragnarok-v1.webp', alt: '诸神黄昏之后新生大地、海岸与初生桦树的宁静景象', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-ragnarok-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-thor-and-hrungnir',
    image: { src: '/media/content/norse/stories/norse-story-thor-and-hrungnir-v1.webp', alt: '索尔与赫朗格尼尔在石界前对峙、准备进行决斗', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-thor-and-hrungnir-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-freyr-and-gerdr',
    image: { src: '/media/content/norse/stories/norse-story-freyr-and-gerdr-v1.webp', alt: '弗雷与葛德隔着约顿海姆边界对望、斯基尔尼尔传递求婚讯息', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-freyr-and-gerdr-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-idunn-and-thjazi',
    image: { src: '/media/content/norse/stories/norse-story-idunn-and-thjazi-v1.webp', alt: '伊登与金苹果被鹰形的夏基带离阿斯加德', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-idunn-and-thjazi-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-kvasir-and-mead',
    image: { src: '/media/content/norse/stories/norse-story-kvasir-and-mead-v1.webp', alt: '克瓦希尔的智慧与诗歌蜜酒在岩窟酿造场景中被并置呈现', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-kvasir-and-mead-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-odin-steals-mead',
    image: { src: '/media/content/norse/stories/norse-story-odin-steals-mead-v1.webp', alt: '奥丁以鹰形从山岩洞窟携带诗歌蜜酒飞出、巨人堡垒隐于远方', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-odin-steals-mead-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-thor-fishes-for-serpent',
    image: { src: '/media/content/norse/stories/norse-story-thor-fishes-for-serpent-v1.webp', alt: '索尔在风暴海面垂钓、耶梦加得从深海升起', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-thor-fishes-for-serpent-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-thryms-stolen-hammer',
    image: { src: '/media/content/norse/stories/norse-story-thryms-stolen-hammer-v1.webp', alt: '霜巨人的大厅中、被夺走的雷神之锤置于石台上', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-thryms-stolen-hammer-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-odin-and-mimir',
    image: { src: '/media/content/norse/stories/norse-story-odin-and-mimir-v1.webp', alt: '奥丁在世界树根部的密米尔之井旁寻求智慧', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-odin-and-mimir-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-odin-world-tree',
    image: { src: '/media/content/norse/stories/norse-story-odin-world-tree-v1.webp', alt: '奥丁悬于世界树的巨大树干与根系之间经历九夜试炼', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-odin-world-tree-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-aesir-vanir-war',
    image: { src: '/media/content/norse/stories/norse-story-aesir-vanir-war-v1.webp', alt: '古尔薇格与阿萨、华纳两组神族隔着燃烧与破损的大厅对峙', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-aesir-vanir-war-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-fenrir-and-gleipnir',
    image: { src: '/media/content/norse/stories/norse-story-fenrir-and-gleipnir-v1.webp', alt: '芬里尔在阿斯加德岩岸被格莱普尼尔束缚，提尔伸手承担契约代价', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-fenrir-and-gleipnir-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-thor-in-utgard',
    image: { src: '/media/content/norse/stories/norse-story-thor-in-utgard-v1.webp', alt: '乌特加德洛基的巨大大厅中、索尔面对伪装成挑战的幻象', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-thor-in-utgard-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-thor-and-geirrod',
    image: { src: '/media/content/norse/stories/norse-story-thor-and-geirrod-v1.webp', alt: '索尔穿过寒冷河流进入盖尔罗德的巨人厅堂，手持借来的杖与腰带', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-thor-and-geirrod-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-lokis-feast',
    image: { src: '/media/content/norse/stories/norse-story-lokis-feast-v1.webp', alt: '洛基站在火光宴席边缘、空席与沉默的诸神构成言辞冲突', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-lokis-feast-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-baldrs-dreams',
    image: { src: '/media/content/norse/stories/norse-story-baldrs-dreams-v1.webp', alt: '奥丁骑马穿过夜路前往亡者之地、追寻巴德尔的梦兆', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-baldrs-dreams-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-baldrs-death',
    image: { src: '/media/content/norse/stories/norse-story-baldrs-death-v1.webp', alt: '阿斯加德庭院中、槲寄生飞过后欢乐游戏突然归于沉默', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-baldrs-death-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-baldrs-funeral',
    image: { src: '/media/content/norse/stories/norse-story-baldrs-funeral-v1.webp', alt: '北方海岸的赫林霍尔尼葬船在黄昏与初起的火焰中承载神族哀悼', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-baldrs-funeral-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-hermod-rides-to-hel',
    image: { src: '/media/content/norse/stories/norse-story-hermod-rides-to-hel-v1.webp', alt: '赫尔莫德骑着斯莱普尼尔越过通往赫尔境域的桥，前方是雾中的门', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-hermod-rides-to-hel-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-loki-bound',
    image: { src: '/media/content/norse/stories/norse-story-loki-bound-v1.webp', alt: '洛基在幽暗洞窟中被束缚，身旁人物以器皿承接蛇液', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-loki-bound-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-volsung-and-sword-tree',
    image: { src: '/media/content/norse/stories/norse-story-volsung-and-sword-tree-v1.webp', alt: '冬日宴厅中、树干里的神剑在沃尔松格家族与宾客之间闪耀', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-volsung-and-sword-tree-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-signy-and-siggeir',
    image: { src: '/media/content/norse/stories/norse-story-signy-and-siggeir-v1.webp', alt: '冬日婚宴中西格妮回望沃尔松格家族，西格盖尔的使团隐在厅堂阴影里', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-signy-and-siggeir-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-sigmund-and-sinfjotli',
    image: { src: '/media/content/norse/stories/norse-story-sigmund-and-sinfjotli-v1.webp', alt: '森林锻炉旁西格蒙德与成年儿子辛菲奥特利准备共同踏上危险旅程', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-sigmund-and-sinfjotli-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-sigurd-and-regin',
    image: { src: '/media/content/norse/stories/norse-story-sigurd-and-regin-v1.webp', alt: '西格尔德与雷金在锻炉旁共同注视重铸的格拉墨之剑', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-sigurd-and-regin-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-sigurd-kills-fafnir',
    image: { src: '/media/content/norse/stories/norse-story-sigurd-kills-fafnir-v1.webp', alt: '西格尔德藏在道路下的沟中，以格拉墨刺向经过的法夫纳', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-sigurd-kills-fafnir-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-sigurd-and-brynhildr',
    image: { src: '/media/content/norse/stories/norse-story-sigurd-and-brynhildr-v1.webp', alt: '西格尔德骑马穿过蓝金火焰，走向火焰环绕的布伦希尔德居所', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-sigurd-and-brynhildr-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-sigurds-death',
    image: { src: '/media/content/norse/stories/norse-story-sigurds-death-v1.webp', alt: '北方厅堂中、空置床榻与坠落的剑见证西格尔德之死后的家族裂痕', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-sigurds-death-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-odin-and-vafthrudnir',
    image: { src: '/media/content/norse/stories/norse-story-odin-and-vafthrudnir-v1.webp', alt: '奥丁与瓦夫苏鲁德尼尔在星空厅堂中隔着火焰进行知识问答', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-odin-and-vafthrudnir-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-thor-and-hymir',
    image: { src: '/media/content/norse/stories/norse-story-thor-and-hymir-v1.webp', alt: '索尔与海米尔在巨人厅堂中面对巨大的大锅与风暴海岸', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-thor-and-hymir-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-loki-and-angrboda',
    image: { src: '/media/content/norse/stories/norse-story-loki-and-angrboda-v1.webp', alt: '洛基与安格尔博达站在巨人世界的冷色山谷中，远处浮现三种命运的象征', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-loki-and-angrboda-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-grimnir-revealed',
    image: { src: '/media/content/norse/stories/norse-story-grimnir-revealed-v1.webp', alt: '被误认并受缚的奥丁在王厅中以格里姆尼尔之名显露神性，年轻王子为他送水', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-grimnir-revealed-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-valholl-and-valkyries',
    image: { src: '/media/content/norse/stories/norse-story-valholl-and-valkyries-v1.webp', alt: '晨光中的英灵殿迎来女武神与受选战士，木厅、旗帜与乌鸦构成战后荣光的门槛', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-valholl-and-valkyries-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-andvari-gold',
    image: { src: '/media/content/norse/stories/norse-story-andvari-gold-v1.webp', alt: '安德瓦里在地下溪流旁交出戒指与被诅咒的黄金，暗影与矿石蓝光围绕着他', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-andvari-gold-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-thor-and-skrymir',
    image: { src: '/media/content/norse/stories/norse-story-thor-and-skrymir-v1.webp', alt: '斯克里米尔在巨人世界的岩石庇护下沉睡，索尔与微小营火站在路旁形成尺度对比', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-thor-and-skrymir-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-loki-and-baldr',
    image: { src: '/media/content/norse/stories/norse-story-loki-and-baldr-v1.webp', alt: '阿斯加德厅堂中，盲目的霍德射出槲寄生，巴德尔在冷色光线中迎来悲剧', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-loki-and-baldr-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-loki-at-ragnarok',
    image: { src: '/media/content/norse/stories/norse-story-loki-at-ragnarok-v1.webp', alt: '诸神黄昏时洛基与海姆达尔在破碎的彩虹桥上隔着风暴与余烬对峙', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-loki-at-ragnarok-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-sigmunds-death-and-hjordis',
    image: { src: '/media/content/norse/stories/norse-story-sigmunds-death-and-hjordis-v1.webp', alt: '西格蒙德在森林战场折断长剑，希奥尔迪斯在远处山脊见证沃尔松格家族的转折', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-sigmunds-death-and-hjordis-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-sigurd-and-sigrdrifa',
    image: { src: '/media/content/norse/stories/norse-story-sigurd-and-sigrdrifa-v1.webp', alt: '西格尔德骑马发现沉睡在火焰环中的西格德里法，雪山夜色与火光形成命运门槛', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-sigurd-and-sigrdrifa-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-gudrun-and-atli',
    image: { src: '/media/content/norse/stories/norse-story-gudrun-and-atli-v1.webp', alt: '阿特利厅堂的悲剧宴席后，古德伦在破碎酒器与冷色火光中保持克制而坚定', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-gudrun-and-atli-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-helgi-hundingsbani',
    image: { src: '/media/content/norse/stories/norse-story-helgi-hundingsbani-v1.webp', alt: '赫尔吉·洪丁斯巴尼站在黎明雾气中的战场旗帜旁，西格伦与沃尔松格战士从远处走来', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-helgi-hundingsbani-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-volundr-captive-smith',
    image: { src: '/media/content/norse/stories/norse-story-volundr-captive-smith-v1.webp', alt: '沃伦德被囚在地下铁匠作坊中，铁砧、锁链与未完成的羽翼工艺映在炉火里', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-volundr-captive-smith-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-helgi-hjorvardsson-and-svava',
    image: { src: '/media/content/norse/stories/norse-story-helgi-hjorvardsson-and-svava-v1.webp', alt: '赫尔吉与斯瓦瓦在北方山脊相遇，极光、战马与远海构成誓约和命运的门槛', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-helgi-hjorvardsson-and-svava-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-helgi-and-sigrun',
    image: { src: '/media/content/norse/stories/norse-story-helgi-and-sigrun-v1.webp', alt: '赫尔吉与西格伦在月下雾中的战场重逢，战马与银色山丘承载着英雄史诗的重量', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-helgi-and-sigrun-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-aesir-vanir-truce',
    image: { src: '/media/content/norse/stories/norse-story-aesir-vanir-truce-v1.webp', alt: '阿萨与华纳在冲突后围坐长桌交换和约器物，放下的长矛与厅堂雾光象征共同体重建', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-aesir-vanir-truce-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-skadi-compensation',
    image: { src: '/media/content/norse/stories/norse-story-skadi-compensation-v1.webp', alt: '斯卡蒂身着冬日猎装进入诸神厅堂，要求为父亲赔偿，雪山与长弓强化她的尊严', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-skadi-compensation-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-njordr-and-skadi',
    image: { src: '/media/content/norse/stories/norse-story-njordr-and-skadi-v1.webp', alt: '尼约德与斯卡蒂站在海岸和雪山的分界线上，各自望向偏爱的居所，显出婚姻中的距离', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-njordr-and-skadi-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-asgard-wall-and-sleipnir',
    image: { src: '/media/content/norse/stories/norse-story-asgard-wall-and-sleipnir-v1.webp', alt: '阿斯加德城墙将竣之际，斯瓦迪尔法利拖运巨石，未完的城门与暮色中的神族构成紧张节点', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-asgard-wall-and-sleipnir-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-sifs-hair-and-treasures',
    image: { src: '/media/content/norse/stories/norse-story-sifs-hair-and-treasures-v1.webp', alt: '地下神话工坊中，旅者将编成金色的修复礼物交给女神，雷锤、戒指与折叠的魔船分别陈列', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-sifs-hair-and-treasures-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-helgi-burial-mound',
    image: { src: '/media/content/norse/stories/norse-story-helgi-burial-mound-v1.webp', alt: '月光下赫尔吉的葬丘打开，死者与西格伦在雾气和悲伤中短暂重逢', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-helgi-burial-mound-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-volundr-escape',
    image: { src: '/media/content/norse/stories/norse-story-volundr-escape-v1.webp', alt: '沃伦德以自制羽翼从岛上铁匠作坊飞向黎明峡湾，回望囚禁他的工坊', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-volundr-escape-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-odin-ravens',
    image: { src: '/media/content/norse/stories/norse-story-odin-ravens-v1.webp', alt: '胡金与穆宁在黄昏越过阿斯加德屋顶，飞向等待消息的独眼神祇', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-odin-ravens-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-odin-seidr',
    image: { src: '/media/content/norse/stories/norse-story-odin-seidr-v1.webp', alt: '奥丁在弗蕾雅身旁学习塞德魔法，织线、法杖与命运幻象构成暮色仪式空间', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-odin-seidr-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-thor-and-thjalfi-roskva',
    image: { src: '/media/content/norse/stories/norse-story-thor-and-thjalfi-roskva-v1.webp', alt: '索尔、夏尔菲与罗丝克瓦在黎明离开农舍踏上北方道路，山羊车辙通向远方', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-thor-and-thjalfi-roskva-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-thor-and-alviss',
    image: { src: '/media/content/norse/stories/norse-story-thor-and-alviss-v1.webp', alt: '索尔在月光门槛上以问答拖延阿尔维斯直到黎明，雷锤保持低垂，时间成为较量', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-thor-and-alviss-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-thor-and-harbard',
    image: { src: '/media/content/norse/stories/norse-story-thor-and-harbard-v1.webp', alt: '索尔在雾河一岸与哈巴德隔水相对，破旧渡船与夕照把争执变成距离和姿态', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-thor-and-harbard-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-vali-avenges-baldr',
    image: { src: '/media/content/norse/stories/norse-story-vali-avenges-baldr-v1.webp', alt: '瓦利站在冬日森林中完成复仇后面对悲伤与命运，远处的冬日太阳照亮空旷林间', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-vali-avenges-baldr-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-tyr-and-garmr',
    image: { src: '/media/content/norse/stories/norse-story-tyr-and-garmr-v1.webp', alt: '提尔站在赫尔之门前与守门巨犬加姆相对，黑石、苍白光线与门槛构成未来誓约', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-tyr-and-garmr-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-gudrun-svanhild-hamdir-sorli',
    image: { src: '/media/content/norse/stories/norse-story-gudrun-svanhild-hamdir-sorli-v1.webp', alt: '古德伦在寒冷门槛前面对斯万希尔德的命运，哈姆迪尔与索尔利准备走入昏暗王厅', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-gudrun-svanhild-hamdir-sorli-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-svipdagr-and-mengloth',
    image: { src: '/media/content/norse/stories/norse-story-svipdagr-and-mengloth-v1.webp', alt: '斯维普达格抵达孟格洛德山厅的火焰之门，旅人与守门者在诗歌谜语的门槛上相遇', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-svipdagr-and-mengloth-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-rig-and-social-orders',
    image: { src: '/media/content/norse/stories/norse-story-rig-and-social-orders-v1.webp', alt: '里格作为旅者穿过三个农庄，炉火、家庭与代际生活在北方黎明中串成社会秩序的叙事', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-rig-and-social-orders-v1', reviewStatus: 'draft' },
  },
  {
    id: 'story-illustration-norse-grottasongr',
    image: { src: '/media/content/norse/stories/norse-story-grottasongr-v1.webp', alt: '芬雅与梅尼在海岸大厅推动巨大的格罗蒂磨盘，劳动、财富与王的贪欲在风暴前交叠', width: 1672, height: 941 },
    provenance: { sourceType: 'ai', creator: 'MythCanvas', licenseName: 'MythCanvas AI-generated original — Norse Story key moment draft', model: 'gpt-image-2', promptRecipeId: 'norse-story-grottasongr-v1', reviewStatus: 'draft' },
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
  {
    id: 'story-illustration-aztec-cosmic',
    image: { src: '/art/aztec-cosmic-cycle.svg', alt: '火山高原、湖城、太阳与羽蛇构成的阿兹特克神话视觉场景', width: 1600, height: 900 },
    provenance: { sourceType: 'original', creator: 'MythCanvas', licenseName: 'MythCanvas Original — source-aware Aztec P0 asset (2026-09-02)' },
  },
];

const illustrationsById = new Map(storyIllustrations.map((asset) => [asset.id, asset]));

export const getStoryIllustrationById = (id: string): StoryIllustrationAsset | undefined => illustrationsById.get(id);
