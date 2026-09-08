import type { Character, CharacterRelation, Scene, SourceRef, TaxonomyTerm, World } from '../../lib/content/types';
import { sourceRef, type NorseSourceKey } from './sources';

const mythologyId = 'myth-norse';
const date = '2026-09-01';
const asgardImage = {
  src: '/media/content/norse/worlds/norse-asgard-final-v1.webp',
  alt: '世界树、巨石与极光构成的北欧神域意象',
  width: 2560,
  height: 1440,
};
const asgardMobile = {
  src: '/media/content/norse/worlds/norse-asgard-mobile-final-v1.webp',
  alt: '竖幅世界树、巨石与极光构成的北欧神域意象',
  width: 1440,
  height: 2560,
};
const asgardDesktopV1 = {
  src: '/media/content/norse/worlds/norse-asgard-final-v1.webp',
  alt: '极光下坐落在峭壁与峡湾之间的阿斯加德，世界树与远处彩虹桥构成北欧神域景象',
  width: 2560,
  height: 1440,
};
const asgardMobileV1 = {
  src: '/media/content/norse/worlds/norse-asgard-mobile-final-v1.webp',
  alt: '竖幅极光下的阿斯加德：世界树、峭壁神域与远处彩虹桥由下至上展开',
  width: 1440,
  height: 2560,
};
const jotunheimDesktopV1 = {
  src: '/media/content/norse/worlds/norse-jotunheim-final-v1.webp',
  alt: '风暴云与雾气笼罩的约顿海姆玄武岩峡谷，粗粝山道通向巨石拱门和边境小屋',
  width: 2560,
  height: 1440,
};
const jotunheimMobileV1 = {
  src: '/media/content/norse/worlds/norse-jotunheim-mobile-final-v1.webp',
  alt: '竖幅约顿海姆峡谷：风暴天空、石桥、深谷与荒野道路形成巨人边境的纵深',
  width: 1440,
  height: 2560,
};
const midgardDesktopV1 = {
  src: '/media/content/norse/worlds/norse-midgard-final-v1.webp',
  alt: '暴风云下米德加尔特的环形海岸聚落，远海隐约可见环世巨蛇般的波浪弧线',
  width: 2560,
  height: 1440,
};
const midgardMobileV1 = {
  src: '/media/content/norse/worlds/norse-midgard-mobile-final-v1.webp',
  alt: '竖幅米德加尔特海岸：山坡上的环形人类聚落、暴风海面与远处蛇形波浪',
  width: 1440,
  height: 2560,
};
const helDesktopV1 = {
  src: '/media/content/norse/worlds/norse-hel-final-v1.webp',
  alt: '冷雾中的赫尔世界洞厅：静默立石、暗河与低矮石桥通向远处的天光裂口',
  width: 2560,
  height: 1440,
};
const helMobileV1 = {
  src: '/media/content/norse/worlds/norse-hel-mobile-final-v1.webp',
  alt: '竖幅赫尔世界：石阶穿过冷雾、立石与暗河，通向洞穴深处的微光',
  width: 1440,
  height: 2560,
};
const muspellDesktopV1 = {
  src: '/media/content/norse/worlds/norse-muspell-final-v1.webp',
  alt: '黑色玄武岩裂隙与熔岩构成的穆斯贝尔海姆火焰边界，远处的火焰之剑立于末日天光中',
  width: 2560,
  height: 1440,
};
const muspellMobileV1 = {
  src: '/media/content/norse/worlds/norse-muspell-mobile-final-v1.webp',
  alt: '竖幅穆斯贝尔海姆火焰边界：黑色玄武岩裂隙、熔岩与远处火焰之剑向上延伸',
  width: 1440,
  height: 2560,
};
const niflheimDesktopV1 = {
  src: '/media/content/norse/worlds/norse-niflheim-final-v1.webp',
  alt: '银蓝雾气笼罩的尼福尔海姆冰河与冰川峡谷，冷寂的原初雾界向远处消失',
  width: 2560,
  height: 1440,
};
const niflheimMobileV1 = {
  src: '/media/content/norse/worlds/norse-niflheim-mobile-final-v1.webp',
  alt: '竖幅尼福尔海姆：暗色冰河从前景穿过狭窄冰谷，银蓝雾气向高处汇聚',
  width: 1440,
  height: 2560,
};
const vanaheimDesktopV1 = {
  src: '/media/content/norse/worlds/norse-vanaheim-final-v1.webp',
  alt: '河口草地、湿润木材与海风中的石台构成华纳海姆的丰饶边界',
  width: 2560,
  height: 1440,
};
const vanaheimMobileV1 = {
  src: '/media/content/norse/worlds/norse-vanaheim-mobile-final-v1.webp',
  alt: '竖幅华纳海姆：前景丰饶草地与湿润木材通向河口石台和灰蓝海面',
  width: 1440,
  height: 2560,
};
const alfheimDesktopV1 = {
  src: '/media/content/norse/worlds/norse-alfheim-final-v1.webp',
  alt: '浅色桦木林与微光水面构成亚尔夫海姆的清晨林地，远处隐约可见浅色木石居所',
  width: 2560,
  height: 1440,
};
const alfheimMobileV1 = {
  src: '/media/content/norse/worlds/norse-alfheim-mobile-final-v1.webp',
  alt: '竖幅亚尔夫海姆：浅色林木与微光水面向上延伸，远处是隐约的木石居所',
  width: 1440,
  height: 2560,
};

const edda = (locator: string, note?: string): SourceRef => sourceRef('proseEddaGylfaginning', locator, note);
const poeticSourceKeys = {
  'Baldrs draumar': 'baldrsDraumar',
  'Fáfnismál': 'fafnismal',
  'Hymiskviða': 'hymiskvida',
  'Lokasenna': 'lokasenna',
  'Sigrdrífumál': 'sigrdrifumal',
  'Skírnismál': 'skirnismal',
  'Vafþrúðnismál': 'vafthrudnismal',
  'Völuspá': 'voluspa',
} as const satisfies Record<string, NorseSourceKey>;
const poetic = (title: keyof typeof poeticSourceKeys, locator: string, note?: string): SourceRef => sourceRef(poeticSourceKeys[title], locator, note);

type CharacterSeed = readonly [
  string,
  string,
  string,
  string,
  readonly string[],
  string,
  readonly string[],
  readonly string[],
  NorseSourceKey?,
  string?,
];

const character = ([slug, name, nameEn, role, symbols, characterType, worlds, tags, sourceKey, sourceLocator]: CharacterSeed): Character => {
  if (sourceKey && !sourceLocator?.trim()) {
    throw new Error(`Norse Character ${slug} must declare a precise source locator when sourceKey is provided`);
  }
  return {
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
  sourceRefs: [sourceKey ? sourceRef(sourceKey, sourceLocator!) : edda('Gylfaginning 1–54')],
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
  };
};

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
  ['ymir', '尤弥尔', 'Ymir', '冰与火之间诞生的原初巨人', ['冰霜', '巨人之躯', '创世材料'], 'mythic-being', ['world-jotunheim', 'world-niflheim'], ['primordial', 'jotunn']],
  ['buri', '布里', 'Búri', '从冰中显现的神族祖先', ['冰中身影', '祖先', '盐霜'], 'deity', ['world-niflheim'], ['primordial', 'aesir']],
  ['bor', '博尔', 'Borr', '布里之子与奥丁的父亲', ['祖先', '寒地', '神族家系'], 'deity', ['world-asgard'], ['aesir', 'family']],
  ['vili', '威利', 'Vili', '参与创造世界的兄弟神', ['意志', '长矛', '创世'], 'deity', ['world-asgard'], ['aesir', 'creation']],
  ['ve', '维', 'Vé', '参与创造世界与人类的兄弟神', ['神圣空间', '海岸', '创世'], 'deity', ['world-asgard'], ['aesir', 'creation']],
  ['honir', '海尼尔', 'Hœnir', '《女预言家之歌》中与奥丁、洛德尔共同赋予人类感知的神祇', ['感知', '人类起源', '使者'], 'mythic-being', ['world-asgard'], ['aesir', 'creation'], 'voluspa', 'sts. 17–18'],
  ['lodur', '洛德尔', 'Lóðurr', '《女预言家之歌》中与奥丁、海尼尔共同赋予人类生命与色彩的神祇', ['生命之热', '人类起源', '身份争议'], 'mythic-being', ['world-asgard'], ['aesir', 'creation', 'identity-variant'], 'voluspa', 'sts. 17–18'],
  ['mimir', '密米尔', 'Mímir', '守护智慧之井的知识者', ['智慧之井', '头颅', '井水'], 'deity', ['world-asgard'], ['wisdom']],
  ['njordr', '尼约德', 'Njörðr', '海风、航海与财富之神', ['海风', '长船', '财富'], 'deity', ['world-vanaheim'], ['vanir', 'sea']],
  ['skadi', '斯卡蒂', 'Skaði', '山地、冬季与狩猎女神', ['滑雪', '弓', '山地'], 'deity', ['world-jotunheim', 'world-asgard'], ['jotunn', 'vanir']],
  ['idunn', '伊登', 'Iðunn', '守护青春苹果的女神', ['苹果', '木匣', '青春'], 'deity', ['world-asgard'], ['aesir', 'gods-and-treasures']],
  ['sif', '西芙', 'Sif', '拥有金色头发的女神', ['金发', '麦穗', '土地'], 'deity', ['world-asgard'], ['aesir', 'thor-cycle']],
  ['thrymr', '索列姆', 'Þrymr', '夺走妙尔尼尔并要求以婚姻交换的巨人', ['妙尔尼尔', '婚宴', '巨人王座'], 'monster', ['world-jotunheim'], ['jotunn', 'thor-cycle']],
  ['hodr', '霍德尔', 'Höðr', '与巴德尔之死相连的盲神', ['黑暗', '槲寄生', '弓'], 'deity', ['world-asgard', 'world-hel'], ['aesir', 'baldr-cycle']],
  ['hermod', '赫尔莫德', 'Hermóðr', '前往赫尔国度的使者', ['骑行', '道路', '使者'], 'deity', ['world-asgard', 'world-hel'], ['aesir', 'baldr-cycle']],
  ['vidarr', '维达尔', 'Víðarr', '在诸神黄昏后存续的神', ['厚靴', '沉默', '复仇'], 'deity', ['world-asgard'], ['aesir', 'ragnarok']],
  ['surtr', '苏尔特', 'Surtr', '来自火焰边界的巨人', ['火焰之剑', '熔岩', '毁灭'], 'mythic-being', ['world-muspell'], ['jotunn', 'ragnarok']],
  ['gerdr', '葛德', 'Gerðr', '弗雷爱慕的巨人女子', ['金色庭院', '山地', '丰饶'], 'mythic-being', ['world-jotunheim'], ['jotunn', 'vanir']],
  ['sigyn', '西格恩', 'Sigyn', '洛基受缚时陪伴他的妻子', ['碗', '毒液', '坚忍'], 'deity', ['world-asgard'], ['aesir', 'loki-family']],
  ['nanna', '南娜', 'Nanna', '与巴德尔葬礼相关的神祇', ['葬礼火焰', '赫林霍尔尼', '哀悼'], 'deity', ['world-asgard', 'world-hel'], ['aesir', 'baldr-cycle']],
  ['sleipnir', '斯莱普尼尔', 'Sleipnir', '奥丁的八足坐骑', ['八足', '风', '跨界道路'], 'creature', ['world-asgard'], ['aesir', 'loki-family']],
  ['sigurd', '西格尔德', 'Sigurd', '沃尔松格英雄传统中的屠龙者', ['格拉墨', '龙血', '宝藏'], 'hero', ['world-midgard'], ['volsung', 'hero']],
  ['brynhildr', '布伦希尔德', 'Brynhildr', '沃尔松格英雄传统中的女武神与英雄', ['火焰圈', '盾牌', '誓言'], 'hero', ['world-midgard'], ['volsung', 'hero']],
  ['fafnir', '法夫纳', 'Fafnir', '被贪欲转化的龙', ['龙鳞', '金环', '洞穴'], 'monster', ['world-midgard'], ['volsung', 'monster']],
  ['urd', '乌尔德', 'Urðr', '与命运之井相关的诺恩', ['命运之井', '刻痕', '时间'], 'mythic-being', ['world-asgard'], ['creation', 'wisdom'], 'voluspa', 'st. 20'],
  ['verdandi', '薇尔丹蒂', 'Verðandi', '与生成和命运相关的诺恩', ['命运之井', '纺线', '时间'], 'mythic-being', ['world-asgard'], ['creation', 'wisdom'], 'voluspa', 'st. 20'],
  ['skuld', '斯库尔德', 'Skuld', '与命运之井相关的诺恩', ['命运之井', '书写板', '时间'], 'mythic-being', ['world-asgard'], ['creation', 'wisdom'], 'voluspa', 'st. 20'],
  ['sol', '索尔', 'Sól', '在天空中运行的太阳人格', ['太阳车', '光轮', '天空道路'], 'deity', ['world-midgard'], ['creation', 'ragnarok'], 'voluspa', 'st. 5, 40–41'],
  ['mani', '马尼', 'Máni', '在天空中运行的月亮人格', ['月车', '月相', '天空道路'], 'deity', ['world-midgard'], ['creation', 'ragnarok'], 'voluspa', 'st. 5, 40–41'],
  ['skoll', '斯库尔', 'Sköll', '追逐太阳的狼', ['狼影', '太阳车', '铁森林'], 'creature', ['world-midgard'], ['creation', 'ragnarok'], 'proseEddaGylfaginning', 'ch. 12'],
  ['hati', '哈提', 'Hati', '追逐月亮的狼', ['狼影', '月车', '铁森林'], 'creature', ['world-midgard'], ['creation', 'ragnarok'], 'proseEddaGylfaginning', 'ch. 12'],
  ['gullveig', '古尔薇格', 'Gullveig', '被刺穿和焚烧后仍复起的神秘人物', ['长矛', '火焰', '金色'], 'mythic-being', ['world-asgard'], ['vanir', 'gods-and-treasures'], 'voluspa', 'sts. 21–24'],
  ['kvasir', '克瓦希尔', 'Kvasir', '与神族和约和诗歌蜜酒相关的智者', ['蜜酒', '诗歌', '调和之杯'], 'mythic-being', ['world-asgard'], ['aesir', 'vanir', 'wisdom'], 'proseEddaSkaldskaparmal', 'ch. 1'],
  ['thjazi', '夏基', 'Þjazi', '与伊登和青春苹果故事相关的巨人', ['鹰形', '山岩', '苹果'], 'mythic-being', ['world-jotunheim'], ['jotunn', 'gods-and-treasures'], 'haustlong', 'sts. 1–13'],
  ['skirnir', '斯基尔尼尔', 'Skírnir', '代表弗雷前往约顿海姆求婚的使者', ['金角', '火焰边界', '弗雷之剑'], 'mythic-being', ['world-vanaheim', 'world-jotunheim'], ['vanir', 'gods-and-treasures'], 'skirnismal', 'sts. 1–42'],
  ['vafthrudnir', '瓦夫苏鲁德尼尔', 'Vafþrúðnir', '与奥丁进行宇宙知识竞赛的巨人', ['问答', '智慧厅堂', '末日知识'], 'mythic-being', ['world-jotunheim'], ['jotunn', 'wisdom'], 'vafthrudnismal', 'sts. 1–55'],
  ['hrungnir', '赫朗格尼尔', 'Hrungnir', '与索尔决斗的巨人', ['磨刀石心脏', '石盾', '决斗'], 'mythic-being', ['world-jotunheim'], ['jotunn', 'thor-cycle'], 'haustlong', 'sts. 14–20'],
  ['hymir', '海米尔', 'Hymir', '与索尔的大锅和垂钓故事相关的巨人', ['巨锅', '鲸钩', '寒海'], 'mythic-being', ['world-jotunheim'], ['jotunn', 'thor-cycle'], 'hymiskvida', 'sts. 1–39'],
  ['skrymir', '斯克里米尔', 'Skrýmir', '在索尔赴乌特加德途中相遇的巨人', ['行囊', '森林', '幻象前奏'], 'mythic-being', ['world-jotunheim'], ['jotunn', 'thor-cycle'], 'proseEddaGylfaginning', 'ch. 45'],
  ['utgarda-loki', '乌特加达-洛基', 'Útgarða-Loki', '以幻象试炼索尔一行的巨人统治者', ['巨人大厅', '幻象', '挑战'], 'mythic-being', ['world-jotunheim'], ['jotunn', 'thor-cycle'], 'proseEddaGylfaginning', 'chs. 46–47'],
  ['geirrod', '盖尔罗德', 'Geirröðr', '索尔远征故事中的巨人对手', ['铁柱', '火焰', '巨人厅堂'], 'mythic-being', ['world-jotunheim'], ['jotunn', 'thor-cycle'], 'proseEddaSkaldskaparmal', 'ch. 18'],
  ['gjalp', '加尔普', 'Gjálp', '盖尔罗德故事中与索尔冲突的巨人女子', ['急流', '山谷', '巨人亲族'], 'mythic-being', ['world-jotunheim'], ['jotunn', 'thor-cycle'], 'proseEddaSkaldskaparmal', 'ch. 18'],
  ['greip', '格雷普', 'Greip', '盖尔罗德故事中与索尔冲突的巨人女子', ['巨力', '山石', '巨人亲族'], 'mythic-being', ['world-jotunheim'], ['jotunn', 'thor-cycle'], 'proseEddaSkaldskaparmal', 'ch. 18'],
  ['angrboda', '安格尔伯达', 'Angrboða', '洛基子女谱系中被称为女巨人的人物', ['铁森林', '巨狼', '蛇'], 'mythic-being', ['world-jotunheim'], ['jotunn', 'loki-family'], 'proseEddaGylfaginning', 'ch. 34'],
  ['garmr', '加姆', 'Garmr', '与诸神黄昏和海尔入口相关的犬形存在', ['犬形守卫', '赫尔入口', '末日'], 'creature', ['world-hel'], ['chthonic', 'ragnarok'], 'proseEddaGylfaginning', 'ch. 51'],
  ['volsung', '沃尔松格', 'Völsung', '沃尔松格英雄家系的祖先人物', ['剑树', '长屋', '家系'], 'hero', ['world-midgard'], ['volsung', 'hero'], 'volsungaSaga', 'chs. 2–3'],
  ['sigmund', '西格蒙德', 'Sigmund', '沃尔松格家系中的英雄与西格尔德之父', ['树中神剑', '断剑', '家系'], 'hero', ['world-midgard'], ['volsung', 'hero'], 'volsungaSaga', 'chs. 3–12'],
  ['signy', '西格妮', 'Signý', '西格蒙德之妹、与西格盖尔冲突相关的英雄人物', ['长屋', '复仇', '家系'], 'hero', ['world-midgard'], ['volsung', 'hero'], 'volsungaSaga', 'chs. 3–8'],
  ['siggeir', '西格盖尔', 'Siggeir', '西格妮婚姻与沃尔松格家系冲突中的国王', ['王座', '背叛', '长屋'], 'hero', ['world-midgard'], ['volsung', 'hero'], 'volsungaSaga', 'chs. 3–8'],
  ['sinfjotli', '辛菲奥特利', 'Sinfjötli', '西格蒙德的同伴与沃尔松格复仇故事人物', ['森林', '狼皮', '复仇'], 'hero', ['world-midgard'], ['volsung', 'hero'], 'volsungaSaga', 'chs. 7–10'],
  ['hjordis', '希奥尔迪斯', 'Hjördis', '西格蒙德之死与西格尔德出生故事中的人物', ['断剑', '遗腹子', '王室'], 'hero', ['world-midgard'], ['volsung', 'hero'], 'volsungaSaga', 'chs. 11–12'],
  ['andvari', '安德瓦里', 'Andvari', '与被诅咒黄金相关的侏儒人物', ['金环', '河流', '诅咒'], 'mythic-being', ['world-midgard'], ['volsung', 'wisdom'], 'reginsmal', 'sts. 1–26'],
  ['ottr', '奥特', 'Ótr', '被杀后引出赎金与诅咒黄金的角色', ['水獭形态', '黄金', '赎金'], 'mythic-being', ['world-midgard'], ['volsung', 'hero'], 'reginsmal', 'sts. 1–26'],
  ['hreidmar', '赫雷德马尔', 'Hreiðmarr', '法夫纳与雷金之父、赎金冲突中的人物', ['赎金', '黄金', '家族'], 'hero', ['world-midgard'], ['volsung', 'hero'], 'reginsmal', 'sts. 1–26'],
  ['regin', '雷金', 'Regin', '锻剑并引导西格尔德进入屠龙故事的工匠', ['铁砧', '格拉墨', '教导'], 'hero', ['world-midgard'], ['volsung', 'hero'], 'reginsmal', 'sts. 1–40'],
  ['gudrun', '古德伦', 'Guðrún', '西格尔德之死和阿特利循环中的核心英雄人物', ['哀歌', '婚姻', '复仇'], 'hero', ['world-midgard'], ['volsung', 'hero'], 'gudrunarkvida1', 'sts. 1–27'],
  ['gunnar', '贡纳尔', 'Gunnar', '古德伦兄长、阿特利故事中的英雄人物', ['竖琴', '蛇坑', '宝藏'], 'hero', ['world-midgard'], ['volsung', 'hero'], 'atlakvida', 'sts. 1–46'],
  ['hogni', '霍格尼', 'Högni', '贡纳尔之弟、阿特利故事中的英雄人物', ['心脏', '誓言', '宝藏'], 'hero', ['world-midgard'], ['volsung', 'hero'], 'atlakvida', 'sts. 1–46'],
  ['atli', '阿特利', 'Atli', '古德伦、贡纳尔和霍格尼故事中的国王', ['宴席', '黄金', '宫殿'], 'hero', ['world-midgard'], ['volsung', 'hero'], 'atlakvida', 'sts. 1–46'],
  ['svanhildr', '斯万希尔德', 'Svanhildr', '古德伦后代复仇循环中的人物', ['马蹄', '复仇', '王室'], 'hero', ['world-midgard'], ['volsung', 'hero'], 'hamdismal', 'sts. 1–30'],
  ['hamdir', '哈姆迪尔', 'Hamðir', '为斯万希尔德复仇的兄弟之一', ['剑', '石刑', '复仇'], 'hero', ['world-midgard'], ['volsung', 'hero'], 'hamdismal', 'sts. 1–30'],
  ['sorli', '索尔利', 'Sörli', '为斯万希尔德复仇的兄弟之一', ['剑', '石刑', '复仇'], 'hero', ['world-midgard'], ['volsung', 'hero'], 'hamdismal', 'sts. 1–30'],
  ['helgi-hjorvardsson', '赫尔吉·希奥尔瓦尔松', 'Helgi Hjörvarðsson', '与斯瓦瓦相关的英雄诗歌主角', ['剑', '女武神', '战场'], 'hero', ['world-midgard'], ['helgi-cycle', 'hero'], 'helgakvidaHjorvardssonar', 'sts. 1–51'],
  ['svava', '斯瓦瓦', 'Sváfa', '赫尔吉·希奥尔瓦尔松故事中的女武神人物', ['女武神', '剑名', '誓言'], 'mythic-being', ['world-midgard'], ['helgi-cycle', 'hero'], 'helgakvidaHjorvardssonar', 'sts. 1–51'],
  ['helgi-hundingsbani', '赫尔吉·洪丁斯巴尼', 'Helgi Hundingsbani', '与西格伦相关的英雄诗歌主角', ['战船', '长矛', '葬丘'], 'hero', ['world-midgard'], ['helgi-cycle', 'hero'], 'helgakvidaHundingsbana1', 'sts. 1–57'],
  ['sigrun', '西格伦', 'Sigrún', '赫尔吉·洪丁斯巴尼故事中的女武神人物', ['女武神', '战场', '哀悼'], 'mythic-being', ['world-midgard'], ['helgi-cycle', 'hero'], 'helgakvidaHundingsbana2', 'sts. 1–51'],
  ['volundr', '沃伦德', 'Völundr', '被囚后逃离的铁匠英雄', ['铁砧', '翅膀', '戒指'], 'hero', ['world-midgard'], ['independent-eddic', 'hero'], 'volundarkvida', 'sts. 1–41'],
  ['nidudr', '尼杜德', 'Niðuðr', '囚禁沃伦德的国王', ['王座', '戒指', '铁匠铺'], 'hero', ['world-midgard'], ['independent-eddic', 'hero'], 'volundarkvida', 'sts. 1–41'],
  ['bodvildr', '伯德维尔德', 'Böðvildr', '沃伦德故事中与戒指和逃离情节相关的人物', ['戒指', '铁匠铺', '王室'], 'hero', ['world-midgard'], ['independent-eddic', 'hero'], 'volundarkvida', 'sts. 20–41'],
  ['svipdagr', '斯维普达格', 'Svipdagr', '寻访孟格洛德的英雄人物', ['旅杖', '门槛', '寻访'], 'hero', ['world-midgard'], ['independent-eddic', 'hero'], 'svipdagsmal', 'Grógaldr and Fjölsvinnsmál'],
  ['groa', '格罗阿', 'Gróa', '斯维普达格故事中给予咒歌保护的母亲', ['咒歌', '坟丘', '母亲'], 'mythic-being', ['world-midgard'], ['independent-eddic', 'wisdom'], 'svipdagsmal', 'Grógaldr'],
  ['mengloth', '孟格洛德', 'Menglöð', '斯维普达格寻访故事中的人物', ['高座', '门槛', '疗愈'], 'mythic-being', ['world-midgard'], ['independent-eddic', 'wisdom'], 'svipdagsmal', 'Fjölsvinnsmál'],
  ['rigr', '里格', 'Rígr', '与社会等级叙事相关的神秘行旅者', ['旅杖', '家屋', '社会秩序'], 'mythic-being', ['world-midgard'], ['independent-eddic'], 'rigsthula', 'sts. 1–49'],
  ['alviss', '阿尔维斯', 'Alvíss', '与索尔进行知识竞赛的侏儒', ['问答', '石化黎明', '婚约'], 'mythic-being', ['world-asgard'], ['thor-cycle', 'wisdom'], 'alvissmal', 'sts. 1–35'],
  ['huginn', '胡金', 'Huginn', '奥丁的渡鸦之一', ['渡鸦', '思维', '远行'], 'creature', ['world-asgard'], ['odin-cycle', 'wisdom'], 'grimnismal', 'st. 20'],
  ['muninn', '穆宁', 'Muninn', '奥丁的渡鸦之一', ['渡鸦', '记忆', '远行'], 'creature', ['world-asgard'], ['odin-cycle', 'wisdom'], 'grimnismal', 'st. 20'],
  ['nidhoggr', '尼德霍格', 'Níðhöggr', '啃噬世界树根部的蛇形存在', ['树根', '蛇形', '亡者'], 'creature', ['world-hel'], ['creation', 'ragnarok'], 'grimnismal', 'sts. 32–35'],
  ['thjalfi', '夏尔菲', 'Þjálfi', '跟随索尔旅行的人类少年', ['奔跑', '旅程', '索尔随从'], 'hero', ['world-midgard', 'world-asgard'], ['thor-cycle', 'hero'], 'proseEddaGylfaginning', 'ch. 44'],
  ['roskva', '罗丝克瓦', 'Röskva', '与夏尔菲一同进入索尔旅程的人类少女', ['旅程', '雷神随从', '人间'], 'hero', ['world-midgard', 'world-asgard'], ['thor-cycle', 'hero'], 'proseEddaGylfaginning', 'ch. 44'],
  ['vali', '瓦利', 'Váli', '与巴德尔复仇相关的神祇', ['弓箭', '复仇', '快速成长'], 'deity', ['world-asgard'], ['aesir', 'baldr-cycle'], 'voluspa', 'sts. 32–33'],
];

export const norseCharacters: readonly Character[] = seeds.map(character);

export const norseWorlds: readonly World[] = [
  { id: 'world-asgard', mythologyId, slug: 'asgard', name: '阿斯加德', nameEn: 'Asgard', summary: '阿萨神族的神域，彩虹桥、宫殿与世界树共同构成其空间意象。', canonicalDesign: { anchors: ['世界树', '彩虹桥', '北境宫殿'], signatureMaterials: ['巨石', '铁', '木材'], atmosphere: ['极光', '寒冷夜空', '守望感'] }, heroImage: asgardDesktopV1, heroImageMobile: asgardMobileV1 },
  { id: 'world-midgard', mythologyId, slug: 'midgard', name: '米德加尔特', nameEn: 'Miðgarðr', summary: '人类居住的中庭，被海洋与尘世巨蛇环绕，是神与巨人行动的交界。', canonicalDesign: { anchors: ['海岸聚落', '木制长屋', '环世海洋'], signatureMaterials: ['木材', '湿岩', '铁'], atmosphere: ['海风', '长夜', '人间火光'] }, heroImage: midgardDesktopV1, heroImageMobile: midgardMobileV1 },
  { id: 'world-jotunheim', mythologyId, slug: 'jotunheim', name: '约顿海姆', nameEn: 'Jötunheimr', summary: '约顿诸族活动的边境空间，不应被简化为单一的冰雪巨人之地。', canonicalDesign: { anchors: ['峡谷', '原始山地', '边境道路'], signatureMaterials: ['风化岩', '骨木', '粗纺织物'], atmosphere: ['旷野', '风暴', '不确定边界'] }, heroImage: jotunheimDesktopV1, heroImageMobile: jotunheimMobileV1 },
  { id: 'world-hel', mythologyId, slug: 'hel', name: '赫尔', nameEn: 'Hel', summary: '由海拉统治的亡者空间；人物 Hel 与空间 Hel 在产品中始终分开建模。', canonicalDesign: { anchors: ['亡者之门', '半明半暗边界', '静默道路'], signatureMaterials: ['黑石', '灰土', '旧木'], atmosphere: ['冷雾', '无风静默', '边界感'] }, heroImage: helDesktopV1, heroImageMobile: helMobileV1 },
  { id: 'world-muspell', mythologyId, slug: 'muspell', name: '穆斯贝尔海姆', nameEn: 'Múspellsheimr', summary: '火焰与毁灭力量所在的边界空间，服务于创世与诸神黄昏叙事。', canonicalDesign: { anchors: ['火焰边界', '熔岩裂隙', '火焰之剑'], signatureMaterials: ['熔岩', '黑铁', '炽热玻璃'], atmosphere: ['热浪', '红黑烟尘', '末日光'] }, heroImage: muspellDesktopV1, heroImageMobile: muspellMobileV1 },
  { id: 'world-niflheim', mythologyId, slug: 'niflheim', name: '尼福尔海姆', nameEn: 'Niflheimr', summary: '雾与寒冷的原初空间，与创世水汽和世界边界相关。', canonicalDesign: { anchors: ['雾气', '冰河', '寒冷深谷'], signatureMaterials: ['冰', '雾', '蓝灰岩'], atmosphere: ['低能见度', '冷寂', '原初寒气'] }, heroImage: niflheimDesktopV1, heroImageMobile: niflheimMobileV1 },
  { id: 'world-vanaheim', mythologyId, slug: 'vanaheim', name: '华纳海姆', nameEn: 'Vanaheimr', summary: '华纳神族相关的丰饶与海风空间，保留来源有限时的原创设计边界。', canonicalDesign: { anchors: ['河口草地', '丰饶庭院', '海风祭台'], signatureMaterials: ['木材', '琥珀', '湿润土壤'], atmosphere: ['丰饶', '海风', '低矮日光'] }, heroImage: vanaheimDesktopV1, heroImageMobile: vanaheimMobileV1 },
  { id: 'world-alfheim', mythologyId, slug: 'alfheim', name: '亚尔夫海姆', nameEn: 'Álfheimr', summary: '与精灵相关的光明空间，仅按明确叙事依赖建模，不硬编码为固定九界地图。', canonicalDesign: { anchors: ['浅色林地', '微光水面', '精灵居所'], signatureMaterials: ['白木', '薄纱', '浅色石'], atmosphere: ['微光', '林间风', '清晨'] }, heroImage: alfheimDesktopV1, heroImageMobile: alfheimMobileV1 },
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
  scene('thryms-hall', '索列姆的大厅', 'Þrymr’s Hall', '索列姆提出婚姻交换、索尔取回妙尔尼尔的婚宴空间。', 'world-jotunheim'),
  scene('midgard-coast', '米德加尔特海岸', 'Midgard Coast', '人类聚落与环世海洋相遇的海岸。', 'world-midgard'),
  scene('hall-of-hel', '赫尔之门', 'Gate of Hel', '亡者道路与统治者王庭的入口。', 'world-hel'),
  scene('muspell-flame-border', '穆斯贝尔火焰边界', 'Muspell Flame Border', '火焰力量在世界边界聚集的场所。', 'world-muspell'),
  scene('fimbulwinter-field', '芬布尔之冬原野', 'Field of Fimbulwinter', '漫长寒冬与秩序崩裂的荒原。', 'world-midgard'),
  scene('ship-naglfar', '纳吉尔法战船', 'Naglfar', '诸神黄昏中驶向战场的死亡之船。', 'world-hel'),
  scene('baldr-funeral-shore', '巴德尔葬礼海岸', 'Baldr’s Funeral Shore', '赫林霍尔尼停泊、火葬与哀悼发生的仪式空间。', 'world-asgard'),
  scene('renewed-earth', '再生的大地', 'Renewed Earth', '诸神黄昏之后土地重新显现、幸存者重建生活的空间。', 'world-midgard'),
  scene('volsung-hall', '沃尔松格大厅', 'Volsung Hall', '英雄家族、誓言与背叛发生的中庭。', 'world-midgard'),
];

type TaxonomySeed = readonly [string, string, string, TaxonomyTerm['kind'], number];
const taxonomySeeds: readonly TaxonomySeed[] = [
  ['primordial', '创世与原初', 'Primordial', 'being-class', 10],
  ['aesir', '阿萨神族', 'Aesir', 'social-divine-group', 20],
  ['vanir', '华纳神族', 'Vanir', 'social-divine-group', 30],
  ['jotunn', '约顿诸族', 'Jötnar', 'being-class', 40],
  ['chthonic', '亡者与地下', 'Chthonic', 'domain', 50],
  ['wisdom', '知识与预言', 'Wisdom', 'domain', 60],
  ['thor-cycle', '索尔与巨人', 'Thor cycle', 'story-cycle', 70],
  ['loki-family', '洛基家系', 'Loki family', 'family-lineage', 80],
  ['loki-cycle', '洛基与秩序裂缝', 'Loki cycle', 'story-cycle', 85],
  ['odin-cycle', '奥丁：知识、魔法与王权', 'Odin cycle', 'story-cycle', 88],
  ['baldr-cycle', '巴德尔循环', 'Baldr cycle', 'story-cycle', 89],
  ['baldr-ragnarok', '巴德尔、秩序崩裂与诸神黄昏', 'Baldr and Ragnarök', 'story-cycle', 90],
  ['ragnarok', '诸神黄昏', 'Ragnarök', 'story-cycle', 91],
  ['gods-and-treasures', '神祇与宝物', 'Gods and treasures', 'story-cycle', 110],
  ['volsung', '沃尔松格家系', 'Völsung lineage', 'family-lineage', 120],
  ['volsung-cycle', '沃尔松格英雄传统', 'Völsung cycle', 'story-cycle', 125],
  ['helgi-cycle', '赫尔吉英雄传统', 'Helgi cycle', 'story-cycle', 127],
  ['independent-eddic', '独立埃达传统', 'Independent Eddic traditions', 'story-cycle', 128],
  ['hero', '英雄传统', 'Heroic tradition', 'editorial-collection', 130],
  ['family', '神族家系', 'Divine families', 'domain', 140],
  ['oath', '誓约与勇气', 'Oath and courage', 'domain', 150],
  ['fertility', '丰饶与和平', 'Fertility and peace', 'domain', 160],
  ['seidr', '魔法与预言', 'Seiðr', 'domain', 170],
  ['creation', '创世行动', 'Creation', 'story-cycle', 180],
  ['identity-variant', '身份异文与争议', 'Identity variants and disputes', 'domain', 185],
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
  relation('norse-narrative-urd-verdandi', 'character-urd', 'character-verdandi', 'companion', poetic('Völuspá', '20'), 'Völuspá fate-well tradition'),
  relation('norse-narrative-verdandi-skuld', 'character-verdandi', 'character-skuld', 'companion', poetic('Völuspá', '20'), 'Völuspá fate-well tradition'),
  relation('norse-pursues-skoll-sol', 'character-skoll', 'character-sol', 'pursues', edda('Gylfaginning 12'), 'Prose Edda celestial-pursuit tradition'),
  relation('norse-pursues-hati-mani', 'character-hati', 'character-mani', 'pursues', edda('Gylfaginning 12'), 'Prose Edda celestial-pursuit tradition'),
  relation('norse-narrative-gullveig-odin', 'character-gullveig', 'character-odin', 'narrative', poetic('Völuspá', '21–24'), 'Völuspá Æsir–Vanir conflict tradition', false),
  relation('norse-enemy-thjazi-idunn', 'character-thjazi', 'character-idunn', 'enemy', sourceRef('haustlong', 'sts. 1–13'), 'Haustlöng Iðunn tradition'),
  relation('norse-serves-skirnir-freyr', 'character-skirnir', 'character-freyr', 'serves', poetic('Skírnismál', '1–42'), 'Skírnismál courtship tradition'),
  relation('norse-enemy-odin-vafthrudnir', 'character-odin', 'character-vafthrudnir', 'rival', poetic('Vafþrúðnismál', '1–55'), 'Vafþrúðnismál knowledge-contest tradition'),
  relation('norse-enemy-thor-hrungnir', 'character-thor', 'character-hrungnir', 'enemy', sourceRef('haustlong', 'sts. 14–20'), 'Haustlöng Hrungnir tradition'),
  relation('norse-encounters-thor-hymir', 'character-thor', 'character-hymir', 'encounters', poetic('Hymiskviða', '1–39'), 'Hymiskviða cauldron-and-fishing tradition'),
  relation('norse-encounters-thor-skrymir', 'character-thor', 'character-skrymir', 'encounters', edda('Gylfaginning 45'), 'Prose Edda Utgarðr journey tradition'),
  relation('norse-encounters-thor-utgarda-loki', 'character-thor', 'character-utgarda-loki', 'encounters', edda('Gylfaginning 46–47'), 'Prose Edda Utgarðr trial tradition'),
  relation('norse-enemy-thor-geirrod', 'character-thor', 'character-geirrod', 'enemy', sourceRef('proseEddaSkaldskaparmal', 'ch. 18'), 'Skáldskaparmál Geirröðr tradition'),
  relation('norse-narrative-gjalp-geirrod', 'character-gjalp', 'character-geirrod', 'narrative', sourceRef('proseEddaSkaldskaparmal', 'ch. 18'), 'Skáldskaparmál Geirröðr tradition', false),
  relation('norse-narrative-greip-geirrod', 'character-greip', 'character-geirrod', 'narrative', sourceRef('proseEddaSkaldskaparmal', 'ch. 18'), 'Skáldskaparmál Geirröðr tradition', false),
  relation('norse-consort-loki-angrboda', 'character-loki', 'character-angrboda', 'consort', edda('Gylfaginning 34'), 'Prose Edda Loki-family tradition'),
  relation('norse-encounters-thor-alviss', 'character-thor', 'character-alviss', 'encounters', sourceRef('alvissmal', 'sts. 1–35'), 'Alvíssmál knowledge-contest tradition'),
  relation('norse-companion-odin-huginn', 'character-odin', 'character-huginn', 'companion', sourceRef('grimnismal', 'st. 20'), 'Grímnismál raven tradition'),
  relation('norse-companion-odin-muninn', 'character-odin', 'character-muninn', 'companion', sourceRef('grimnismal', 'st. 20'), 'Grímnismál raven tradition'),
  relation('norse-companion-thjalfi-roskva', 'character-thjalfi', 'character-roskva', 'companion', edda('Gylfaginning 44'), 'Prose Edda Thor-journey tradition'),
  relation('norse-companion-thor-thjalfi', 'character-thor', 'character-thjalfi', 'companion', edda('Gylfaginning 44'), 'Prose Edda Thor-journey tradition'),
  relation('norse-companion-thor-roskva', 'character-thor', 'character-roskva', 'companion', edda('Gylfaginning 44'), 'Prose Edda Thor-journey tradition'),
  relation('norse-enemy-vali-hodr', 'character-vali', 'character-hodr', 'enemy', poetic('Völuspá', '32–33'), 'Völuspá Baldr-revenge tradition'),
];

export const norseP0RequiredRelationIds = norseRelations.map((item) => item.id);
