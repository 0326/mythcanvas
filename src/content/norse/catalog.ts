import type { Character, CharacterRelation, Scene, SourceRef, TaxonomyTerm, World } from '../../lib/content/types';

const mythologyId = 'myth-norse';
const date = '2026-09-01';
const asgardImage = {
  src: '/art/norse-asgard.jpg',
  alt: '世界树、巨石与极光构成的北欧神域意象',
  width: 1280,
  height: 720,
};
const asgardMobile = {
  src: '/art/art-asgard-aurora.jpg',
  alt: '竖幅世界树、巨石与极光构成的北欧神域意象',
  width: 720,
  height: 1280,
};

const source = (title: string, locator: string, note?: string): SourceRef => ({
  type: 'primary-text', title, locator, language: 'non', period: '中世纪记录', note,
});

const edda = (locator: string, note?: string) => source('《散文埃达》·《欺骗古鲁菲》', locator, note);
const poetic = (title: string, locator: string, note?: string) => source(`《诗体埃达》·${title}`, locator, note);

type CharacterSeed = readonly [
  string,
  string,
  string,
  string,
  readonly string[],
  string,
  readonly string[],
  readonly string[],
];

const character = ([slug, name, nameEn, role, symbols, characterType, worlds, tags]: CharacterSeed): Character => ({
  id: `character-${slug}`,
  mythologyId,
  worldIds: worlds,
  slug,
  name,
  nameEn,
  role,
  summary: `${name}是北欧神话主干叙事中的${role}。本页以来源范围、神话关系与 MythCanvas 原创视觉锚点呈现。`,
  symbols,
  characterType,
  traditionTags: tags,
  sourcePeriods: ['《诗体埃达》与《散文埃达》的中世纪记录传统'],
  sourceRefs: [edda('Gylfaginning 1–54')],
  canonicality: 'primary',
  canonicalDesign: {
    anchors: [...symbols.slice(0, 3), `${name}的${role}身份`],
    silhouette: `以${symbols.slice(0, 2).join('与')}形成清晰、可复用的角色轮廓`,
    appearance: { body: ['成人比例', '符合角色职责的稳定姿态'] },
    costumeLanguage: ['北欧纺织物', '铁与青铜的节制性结构', '不复制现代影视或游戏设计'],
    paletteCues: ['岩灰', '铁黑', '冰蓝或火焰橙的情境化点缀'],
    temperament: ['庄严', '命运意识', '叙事角色驱动的姿态'],
    mythologicalFacts: [`${name}的公开身份以${role}为核心。`],
    originalDesignChoices: ['使用 MythCanvas 原创的北境材质、服装轮廓与符号层级；不复制现代商业改编。'],
    avoid: ['现代超级英雄制服', '特定影视或游戏角色的武器、盔甲、发型与轮廓'],
    canonicalPrompt: `Depict ${nameEn} as an original MythCanvas Norse mythology figure. Preserve ${symbols.slice(0, 3).join(', ')} and the role of ${role}. Use grounded Nordic textile, iron, bronze, stone and weather; avoid modern franchise-specific designs.`,
  },
});

const seeds: readonly CharacterSeed[] = [
  ['odin', '奥丁', 'Odin', '众神之王、智慧与战争之神', ['冈格尼尔', '独眼', '乌鸦'], 'deity', ['world-asgard'], ['aesir', 'wisdom', 'ragnarok']],
  ['thor', '索尔', 'Thor', '雷霆与守护之神', ['妙尔尼尔', '雷霆', '力量腰带'], 'deity', ['world-asgard', 'world-midgard'], ['aesir', 'thor-cycle']],
  ['loki', '洛基', 'Loki', '诡计、变形与秩序裂缝的神祇', ['变形', '火焰', '束缚'], 'deity', ['world-asgard', 'world-jotunheim'], ['aesir', 'jotunn', 'ragnarok']],
  ['frigg', '弗丽嘉', 'Frigg', '婚姻、母性与预知女神', ['纺轮', '王后礼服', '预知'], 'deity', ['world-asgard'], ['aesir', 'family']],
  ['baldr', '巴德尔', 'Baldr', '光明与纯洁之神', ['白光', '槲寄生', '葬船'], 'deity', ['world-asgard', 'world-hel'], ['aesir', 'baldr-cycle']],
  ['heimdall', '海姆达尔', 'Heimdall', '守望彩虹桥的神', ['加拉尔号角', '彩虹桥', '敏锐感官'], 'deity', ['world-asgard'], ['aesir', 'ragnarok']],
  ['tyr', '提尔', 'Tyr', '战争、勇气与誓约之神', ['失去的手', '剑', '誓约'], 'deity', ['world-asgard'], ['aesir', 'oath']],
  ['freyr', '弗雷', 'Freyr', '丰饶、和平与阳光之神', ['金色野猪', '折叠之船', '丰饶'], 'deity', ['world-vanaheim', 'world-asgard'], ['vanir', 'fertility']],
  ['freyja', '芙蕾雅', 'Freyja', '爱、美、战争与魔法女神', ['布里辛嘉曼', '猎鹰羽衣', '猫'], 'deity', ['world-vanaheim', 'world-asgard'], ['vanir', 'seidr']],
  ['hel', '海拉', 'Hel', '亡者国度的统治者', ['半明半暗面容', '王座', '亡者之门'], 'deity', ['world-hel'], ['chthonic', 'loki-family']],
  ['fenrir', '芬里尔', 'Fenrir', '挣脱束缚的巨狼', ['巨狼', '格莱普尼尔', '诸神黄昏'], 'monster', ['world-jotunheim'], ['jotunn', 'loki-family', 'ragnarok']],
  ['jormungandr', '耶梦加得', 'Jörmungandr', '环绕米德加尔特的尘世巨蛇', ['环世巨蛇', '海洋', '雷神宿敌'], 'monster', ['world-midgard', 'world-jotunheim'], ['jotunn', 'loki-family', 'thor-cycle']],
  ['ymir', '尤弥尔', 'Ymir', '冰与火之间诞生的原初巨人', ['冰霜', '巨人之躯', '创世材料'], 'jotunn', ['world-jotunheim', 'world-niflheim'], ['primordial', 'jotunn']],
  ['buri', '布里', 'Búri', '从冰中显现的神族祖先', ['冰中身影', '祖先', '盐霜'], 'deity', ['world-niflheim'], ['primordial', 'aesir']],
  ['bor', '博尔', 'Borr', '布里之子与奥丁的父亲', ['祖先', '寒地', '神族家系'], 'deity', ['world-asgard'], ['aesir', 'family']],
  ['vili', '威利', 'Vili', '参与创造世界的兄弟神', ['意志', '长矛', '创世'], 'deity', ['world-asgard'], ['aesir', 'creation']],
  ['ve', '维', 'Vé', '参与创造世界与人类的兄弟神', ['神圣空间', '海岸', '创世'], 'deity', ['world-asgard'], ['aesir', 'creation']],
  ['mimir', '密米尔', 'Mímir', '守护智慧之井的知识者', ['智慧之井', '头颅', '井水'], 'deity', ['world-asgard'], ['wisdom']],
  ['njordr', '尼约德', 'Njörðr', '海风、航海与财富之神', ['海风', '长船', '财富'], 'deity', ['world-vanaheim'], ['vanir', 'sea']],
  ['skadi', '斯卡蒂', 'Skaði', '山地、冬季与狩猎女神', ['滑雪', '弓', '山地'], 'deity', ['world-jotunheim', 'world-asgard'], ['jotunn', 'vanir']],
  ['idunn', '伊登', 'Iðunn', '守护青春苹果的女神', ['苹果', '木匣', '青春'], 'deity', ['world-asgard'], ['aesir', 'gods-and-treasures']],
  ['sif', '西芙', 'Sif', '拥有金色头发的女神', ['金发', '麦穗', '土地'], 'deity', ['world-asgard'], ['aesir', 'thor-cycle']],
  ['hodr', '霍德尔', 'Höðr', '与巴德尔之死相连的盲神', ['黑暗', '槲寄生', '弓'], 'deity', ['world-asgard', 'world-hel'], ['aesir', 'baldr-cycle']],
  ['hermod', '赫尔莫德', 'Hermóðr', '前往赫尔国度的使者', ['骑行', '道路', '使者'], 'deity', ['world-asgard', 'world-hel'], ['aesir', 'baldr-cycle']],
  ['vidarr', '维达尔', 'Víðarr', '在诸神黄昏后存续的神', ['厚靴', '沉默', '复仇'], 'deity', ['world-asgard'], ['aesir', 'ragnarok']],
  ['surtr', '苏尔特', 'Surtr', '来自火焰边界的巨人', ['火焰之剑', '熔岩', '毁灭'], 'jotunn', ['world-muspell'], ['jotunn', 'ragnarok']],
  ['gerdr', '葛德', 'Gerðr', '弗雷爱慕的巨人女子', ['金色庭院', '山地', '丰饶'], 'jotunn', ['world-jotunheim'], ['jotunn', 'vanir']],
  ['sigyn', '西格恩', 'Sigyn', '洛基受缚时陪伴他的妻子', ['碗', '毒液', '坚忍'], 'deity', ['world-asgard'], ['aesir', 'loki-family']],
  ['sleipnir', '斯莱普尼尔', 'Sleipnir', '奥丁的八足坐骑', ['八足', '风', '跨界道路'], 'creature', ['world-asgard'], ['aesir', 'loki-family']],
  ['sigurd', '西格尔德', 'Sigurd', '沃尔松格英雄传统中的屠龙者', ['格拉墨', '龙血', '宝藏'], 'hero', ['world-midgard'], ['volsung', 'hero']],
  ['brynhildr', '布伦希尔德', 'Brynhildr', '沃尔松格英雄传统中的女武神与英雄', ['火焰圈', '盾牌', '誓言'], 'hero', ['world-midgard'], ['volsung', 'hero']],
  ['fafnir', '法夫纳', 'Fafnir', '被贪欲转化的龙', ['龙鳞', '金环', '洞穴'], 'monster', ['world-midgard'], ['volsung', 'monster']],
];

export const norseCharacters: readonly Character[] = seeds.map(character);

export const norseWorlds: readonly World[] = [
  { id: 'world-asgard', mythologyId, slug: 'asgard', name: '阿斯加德', nameEn: 'Asgard', summary: '阿萨神族的神域，彩虹桥、宫殿与世界树共同构成其空间意象。', canonicalDesign: { anchors: ['世界树', '彩虹桥', '北境宫殿'], signatureMaterials: ['巨石', '铁', '木材'], atmosphere: ['极光', '寒冷夜空', '守望感'] }, heroImage: asgardImage, heroImageMobile: asgardMobile },
  { id: 'world-midgard', mythologyId, slug: 'midgard', name: '米德加尔特', nameEn: 'Miðgarðr', summary: '人类居住的中庭，被海洋与尘世巨蛇环绕，是神与巨人行动的交界。', canonicalDesign: { anchors: ['海岸聚落', '木制长屋', '环世海洋'], signatureMaterials: ['木材', '湿岩', '铁'], atmosphere: ['海风', '长夜', '人间火光'] }, heroImage: asgardImage, heroImageMobile: asgardMobile },
  { id: 'world-jotunheim', mythologyId, slug: 'jotunheim', name: '约顿海姆', nameEn: 'Jötunheimr', summary: '约顿诸族活动的边境空间，不应被简化为单一的冰雪巨人之地。', canonicalDesign: { anchors: ['峡谷', '原始山地', '边境道路'], signatureMaterials: ['风化岩', '骨木', '粗纺织物'], atmosphere: ['旷野', '风暴', '不确定边界'] }, heroImage: asgardImage, heroImageMobile: asgardMobile },
  { id: 'world-hel', mythologyId, slug: 'hel', name: '赫尔', nameEn: 'Hel', summary: '由海拉统治的亡者空间；人物 Hel 与空间 Hel 在产品中始终分开建模。', canonicalDesign: { anchors: ['亡者之门', '半明半暗边界', '静默道路'], signatureMaterials: ['黑石', '灰土', '旧木'], atmosphere: ['冷雾', '无风静默', '边界感'] }, heroImage: asgardImage, heroImageMobile: asgardMobile },
  { id: 'world-muspell', mythologyId, slug: 'muspell', name: '穆斯贝尔海姆', nameEn: 'Múspellsheimr', summary: '火焰与毁灭力量所在的边界空间，服务于创世与诸神黄昏叙事。', canonicalDesign: { anchors: ['火焰边界', '熔岩裂隙', '火焰之剑'], signatureMaterials: ['熔岩', '黑铁', '炽热玻璃'], atmosphere: ['热浪', '红黑烟尘', '末日光'] }, heroImage: asgardImage, heroImageMobile: asgardMobile },
  { id: 'world-niflheim', mythologyId, slug: 'niflheim', name: '尼福尔海姆', nameEn: 'Niflheimr', summary: '雾与寒冷的原初空间，与创世水汽和世界边界相关。', canonicalDesign: { anchors: ['雾气', '冰河', '寒冷深谷'], signatureMaterials: ['冰', '雾', '蓝灰岩'], atmosphere: ['低能见度', '冷寂', '原初寒气'] }, heroImage: asgardImage, heroImageMobile: asgardMobile },
  { id: 'world-vanaheim', mythologyId, slug: 'vanaheim', name: '华纳海姆', nameEn: 'Vanaheimr', summary: '华纳神族相关的丰饶与海风空间，保留来源有限时的原创设计边界。', canonicalDesign: { anchors: ['河口草地', '丰饶庭院', '海风祭台'], signatureMaterials: ['木材', '琥珀', '湿润土壤'], atmosphere: ['丰饶', '海风', '低矮日光'] }, heroImage: asgardImage, heroImageMobile: asgardMobile },
  { id: 'world-alfheim', mythologyId, slug: 'alfheim', name: '亚尔夫海姆', nameEn: 'Álfheimr', summary: '与精灵相关的光明空间，仅按明确叙事依赖建模，不硬编码为固定九界地图。', canonicalDesign: { anchors: ['浅色林地', '微光水面', '精灵居所'], signatureMaterials: ['白木', '薄纱', '浅色石'], atmosphere: ['微光', '林间风', '清晨'] }, heroImage: asgardImage, heroImageMobile: asgardMobile },
];

const scene = (slug: string, name: string, nameEn: string, summary: string, worldId?: string): Scene => ({
  id: `scene-${slug}`, mythologyId, worldId, slug, name, nameEn, summary,
  canonicalDesign: { anchors: [name, '来源范围明确的北欧空间', '可复用叙事地标'] }, heroImage: { ...asgardImage, alt: `${name}的 MythCanvas 北欧神话场景` },
});

export const norseScenes: readonly Scene[] = [
  scene('ginnungagap', '金伦加鸿沟', 'Ginnungagap', '冰与火相遇的原初空隙。'),
  scene('well-of-mimir', '密米尔之井', 'Well of Mímir', '知识与代价交汇的井泉。', 'world-asgard'),
  scene('world-tree-roots', '世界树之根', 'Roots of Yggdrasil', '树根、井泉与跨界道路相连的宇宙轴心。', 'world-asgard'),
  scene('asgard-court', '阿斯加德神庭', 'Asgard Court', '诸神议事、宴饮与秩序协商的空间。', 'world-asgard'),
  scene('bifrost', '彩虹桥', 'Bifröst', '连接神域与其他空间的桥梁。', 'world-asgard'),
  scene('jotunheim-border', '约顿海姆边境', 'Jötunheim Border', '神族与约顿往来的山地边界。', 'world-jotunheim'),
  scene('midgard-coast', '米德加尔特海岸', 'Midgard Coast', '人类聚落与环世海洋相遇的海岸。', 'world-midgard'),
  scene('hall-of-hel', '赫尔之门', 'Gate of Hel', '亡者道路与统治者王庭的入口。', 'world-hel'),
  scene('muspell-flame-border', '穆斯贝尔火焰边界', 'Muspell Flame Border', '火焰力量在世界边界聚集的场所。', 'world-muspell'),
  scene('fimbulwinter-field', '芬布尔之冬原野', 'Field of Fimbulwinter', '漫长寒冬与秩序崩裂的荒原。', 'world-midgard'),
  scene('ship-naglfar', '纳吉尔法战船', 'Naglfar', '诸神黄昏中驶向战场的死亡之船。', 'world-hel'),
  scene('volsung-hall', '沃尔松格大厅', 'Volsung Hall', '英雄家族、誓言与背叛发生的中庭。', 'world-midgard'),
];

type TaxonomySeed = readonly [string, string, string, TaxonomyTerm['kind'], number];
const taxonomySeeds: readonly TaxonomySeed[] = [
  ['primordial', '创世与原初', 'Primordial', 'lineage', 10],
  ['aesir', '阿萨神族', 'Aesir', 'lineage', 20],
  ['vanir', '华纳神族', 'Vanir', 'lineage', 30],
  ['jotunn', '约顿诸族', 'Jötnar', 'lineage', 40],
  ['chthonic', '亡者与地下', 'Chthonic', 'domain', 50],
  ['wisdom', '知识与预言', 'Wisdom', 'domain', 60],
  ['thor-cycle', '索尔与巨人', 'Thor cycle', 'story-cycle', 70],
  ['loki-family', '洛基家系', 'Loki family', 'story-cycle', 80],
  ['baldr-cycle', '巴德尔循环', 'Baldr cycle', 'story-cycle', 90],
  ['ragnarok', '诸神黄昏', 'Ragnarök', 'story-cycle', 100],
  ['gods-and-treasures', '神祇与宝物', 'Gods and treasures', 'story-cycle', 110],
  ['volsung', '沃尔松格传统', 'Volsung cycle', 'story-cycle', 120],
  ['hero', '英雄传统', 'Heroic tradition', 'editorial-collection', 130],
  ['family', '神族家系', 'Divine families', 'domain', 140],
  ['oath', '誓约与勇气', 'Oath and courage', 'domain', 150],
  ['fertility', '丰饶与和平', 'Fertility and peace', 'domain', 160],
  ['seidr', '魔法与预言', 'Seiðr', 'domain', 170],
  ['creation', '创世行动', 'Creation', 'story-cycle', 180],
  ['sea', '海洋与航海', 'Sea and voyage', 'domain', 190],
  ['monster', '怪物与变形', 'Monsters and transformation', 'domain', 200],
];
export const norseTaxonomy: readonly TaxonomyTerm[] = taxonomySeeds.map(([slug, name, nameEn, kind, displayOrder]) => ({ id: `taxonomy-norse-${slug}`, mythologyId, slug, name, nameEn, kind, summary: `${name}相关的北欧神话内容分组。`, displayOrder }));

const relation = (id: string, fromCharacterId: string, toCharacterId: string, relationType: string, ref: SourceRef, traditionScope = 'Eddic and Prose Edda tradition', isDefault = true): CharacterRelation => ({
  id, fromCharacterId, toCharacterId, relationType, assertionKey: `${fromCharacterId}|${toCharacterId}|${relationType}`, traditionScope, isDefault, sourceRefs: [ref], confidence: 'high',
});

export const norseRelations: readonly CharacterRelation[] = [
  relation('norse-parent-bor-odin', 'character-bor', 'character-odin', 'parent', edda('Gylfaginning 6–9')),
  relation('norse-parent-buri-bor', 'character-buri', 'character-bor', 'parent', edda('Gylfaginning 6–9')),
  relation('norse-parent-odin-baldr', 'character-odin', 'character-baldr', 'parent', edda('Gylfaginning 49–53')),
  relation('norse-parent-frigg-baldr', 'character-frigg', 'character-baldr', 'parent', poetic('Baldrs draumar', '1–14')),
  relation('norse-consort-odin-frigg', 'character-odin', 'character-frigg', 'consort', edda('Gylfaginning 20')),
  relation('norse-sibling-odin-vili', 'character-odin', 'character-vili', 'sibling', edda('Gylfaginning 6–9')),
  relation('norse-sibling-odin-ve', 'character-odin', 'character-ve', 'sibling', edda('Gylfaginning 6–9')),
  relation('norse-parent-loki-hel', 'character-loki', 'character-hel', 'parent', edda('Gylfaginning 34')),
  relation('norse-parent-loki-fenrir', 'character-loki', 'character-fenrir', 'parent', edda('Gylfaginning 34')),
  relation('norse-parent-loki-jormungandr', 'character-loki', 'character-jormungandr', 'parent', edda('Gylfaginning 34')),
  relation('norse-consort-loki-sigyn', 'character-loki', 'character-sigyn', 'consort', edda('Gylfaginning 50')),
  relation('norse-ally-odin-loki', 'character-odin', 'character-loki', 'ally', edda('Gylfaginning 20')),
  relation('norse-parent-thor-odin', 'character-odin', 'character-thor', 'parent', edda('Gylfaginning 9')),
  relation('norse-consort-thor-sif', 'character-thor', 'character-sif', 'consort', edda('Gylfaginning 21')),
  relation('norse-enemy-thor-jormungandr', 'character-thor', 'character-jormungandr', 'enemy', poetic('Hymiskviða', '22–38')),
  relation('norse-parent-freyja-njordr', 'character-njordr', 'character-freyja', 'parent', edda('Gylfaginning 23')),
  relation('norse-parent-freyr-njordr', 'character-njordr', 'character-freyr', 'parent', edda('Gylfaginning 23')),
  relation('norse-sibling-freyja-freyr', 'character-freyja', 'character-freyr', 'sibling', edda('Gylfaginning 23')),
  relation('norse-consort-freyr-gerdr', 'character-freyr', 'character-gerdr', 'consort', poetic('Skírnismál', '1–42')),
  relation('norse-master-odin-mimir', 'character-odin', 'character-mimir', 'master', poetic('Völuspá', '28–29')),
  relation('norse-ally-odin-heimdall', 'character-odin', 'character-heimdall', 'ally', edda('Gylfaginning 27')),
  relation('norse-ally-odin-tyr', 'character-odin', 'character-tyr', 'ally', edda('Gylfaginning 25')),
  relation('norse-ally-freyja-odin', 'character-freyja', 'character-odin', 'ally', edda('Gylfaginning 23')),
  relation('norse-enemy-odin-fenrir', 'character-odin', 'character-fenrir', 'enemy', poetic('Vafþrúðnismál', '52–53')),
  relation('norse-enemy-thor-fenrir', 'character-thor', 'character-fenrir', 'enemy', poetic('Völuspá', '53–55')),
  relation('norse-enemy-heimdall-loki', 'character-heimdall', 'character-loki', 'enemy', poetic('Völuspá', '46–53')),
  relation('norse-enemy-tyr-fenrir', 'character-tyr', 'character-fenrir', 'enemy', edda('Gylfaginning 34')),
  relation('norse-enemy-loki-heimdall', 'character-loki', 'character-heimdall', 'enemy', poetic('Lokasenna', '47–48')),
  relation('norse-narrative-loki-baldr', 'character-loki', 'character-baldr', 'rival', poetic('Völuspá', '31–34')),
  relation('norse-narrative-hermod-hel', 'character-hermod', 'character-hel', 'serves', edda('Gylfaginning 49–51')),
  relation('norse-ally-vidarr-odin', 'character-vidarr', 'character-odin', 'ally', poetic('Völuspá', '53–56')),
  relation('norse-enemy-surtr-freyr', 'character-surtr', 'character-freyr', 'enemy', poetic('Völuspá', '52–53')),
  relation('norse-parent-loki-sleipnir', 'character-loki', 'character-sleipnir', 'parent', edda('Gylfaginning 42')),
  relation('norse-enemy-sigurd-fafnir', 'character-sigurd', 'character-fafnir', 'enemy', poetic('Fáfnismál', '1–44'), 'Volsung heroic tradition'),
  relation('norse-consort-sigurd-brynhildr', 'character-sigurd', 'character-brynhildr', 'consort', poetic('Sigrdrífumál', '1–37'), 'Volsung heroic tradition'),
  relation('norse-interpretation-tyr-fenrir', 'character-tyr', 'character-fenrir', 'narrative', edda('Gylfaginning 34'), 'Prose Edda binding tradition', false),
];

export const norseP0RequiredRelationIds = norseRelations.map((item) => item.id);
