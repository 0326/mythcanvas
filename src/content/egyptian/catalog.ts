import type { Character, CharacterRelation, Scene, SourceRef, TaxonomyTerm, World } from '../../lib/content/types';

const mythologyId = 'myth-egyptian';
const duatImage = {
  src: '/media/content/egyptian-duat.jpg',
  alt: '星空之下的砂岩巨门与太阳神舟构成的古埃及神话空间',
  width: 1280,
  height: 720,
};
const duatPortrait = {
  src: '/media/content/char-anubis.jpg',
  alt: '黑石与金色光线中的古埃及亡者守护神意象',
  width: 864,
  height: 1152,
};

const source = (sourceId: string, title: string, locator: string, period: string, note?: string): SourceRef => ({
  sourceId,
  type: 'primary-text',
  title,
  locator,
  period,
  note,
});

const pyramidTexts = source('egypt-pyramid-texts', '《金字塔文》', '相关咒文与奥西里斯段落', '古王国时期', '早期王室葬祭文本；不与后期完整叙事重建混为一谈。');
const coffinTexts = source('egypt-coffin-texts', '《棺材文》', '相关 Spell 段落', '中王国时期', '保存死者转化、神祇身份与冥界传统的多层材料。');
const amduat = source('egypt-amduat', '《阿姆杜阿特书》', '十二时段结构与夜航场景', '新王国时期', '以墓室图像和文本描绘太阳神夜间穿越杜阿特。');
const gates = source('egypt-book-of-gates', '《大门之书》', '门域与夜间旅程段落', '新王国时期', '与其他冥界书并列使用；不拼成一张无来源的统一地图。');
const bookDead = source('egypt-book-of-dead', '《亡灵书》', '第 30B、125 章', '新王国至后期', '不同抄本的咒文与图像存在差异，本包使用可定位的章节范围。');
const heavenlyCow = source('egypt-heavenly-cow', '《天牛之书》', '人类毁灭与太阳眼传统', '新王国时期', '用于太阳秩序与 Sekhmet 传统的来源范围。');
const shabaka = source('egypt-shabaka-stone', '沙巴卡石碑与孟菲斯神学', '心、言与创造段落', '晚期抄本保存较早神学传统', '以孟菲斯神学的来源范围表达 Ptah 的创造权能。');
const horusSeth = source('egypt-horus-seth', '《荷鲁斯与赛特的争斗》', 'Papyrus Chester Beatty I', '新王国时期抄本', '用于王位冲突的一个重要叙事见证，不代表所有地方版本。');

type CharacterSeed = readonly [
  string,
  string,
  string,
  string,
  readonly string[],
  NonNullable<Character['characterType']>,
  readonly string[],
  readonly string[],
  SourceRef,
];

const character = ([slug, name, nameEn, role, symbols, characterType, worldIds, traditionTags, identitySource]: CharacterSeed): Character => ({
  id: 'character-' + slug,
  mythologyId,
  worldIds,
  slug,
  name,
  nameEn,
  role,
  summary: name + '是埃及神话' + role + '。本页将其放回具体文本、时期与神学传统中，并以 MythCanvas 原创视觉锚点呈现。',
  symbols,
  characterType,
  traditionTags,
  sourcePeriods: [identitySource.period ?? '古埃及多时期材料'],
  sourceRefs: [identitySource],
  canonicality: 'primary',
  portrait: slug === 'anubis' ? duatPortrait : undefined,
  canonicalDesign: {
    anchors: [...symbols.slice(0, 3), name + '的' + role + '身份'],
    silhouette: '以' + symbols.slice(0, 2).join('与') + '形成可复用的古埃及神话轮廓',
    appearance: { body: ['稳定的成人神性比例', '符合职责的正面或仪式性姿态'] },
    costumeLanguage: ['古埃及仪式性层叠织物', '宽领饰与克制金属细节', '不复制现代影视或游戏设计'],
    paletteCues: ['砂岩暖金', '青金石蓝', '黑石与尼罗河绿的情境化点缀'],
    temperament: ['庄严', '清晰', '由职责驱动的神性姿态'],
    mythologicalFacts: [name + '的公开身份以' + role + '为核心；具体神职随来源与时期变化。'],
    originalDesignChoices: ['以正面秩序、材质层级和可辨识符号建立原创 MythCanvas 视觉；不把埃及神话压缩为黑金墓室。'],
    avoid: ['泛埃及风金字塔背景', '现代游戏式重甲 Boss 轮廓', '随机发光象形文字', '现代商业作品的特定角色设计'],
    canonicalPrompt: 'Depict ' + nameEn + ' as an original MythCanvas Egyptian mythology figure. Preserve ' + symbols.slice(0, 3).join(', ') + ' and the stable role of ' + role + '. Use source-aware ancient Egyptian visual language, restrained stone, linen, gold and lapis materials; avoid modern franchise-specific designs and generic pyramid wallpaper.',
  },
});

const egyptianCharacterSeeds: readonly CharacterSeed[] = [
  ['nun', '努恩', 'Nun', '原初之水与创世前状态', ['原初之水', '无边黑暗', '第一丘'], 'deity', [], ['primordial', 'cosmology'], coffinTexts],
  ['atum', '阿图姆', 'Atum', '赫利奥波利斯创世传统中的自生神', ['太阳', '第一丘', '创世自生'], 'deity', ['world-celestial-sky'], ['heliopolitan', 'cosmology'], pyramidTexts],
  ['shu', '舒', 'Shu', '空气、光与天地分隔之神', ['羽毛', '空气', '天地方向'], 'deity', ['world-celestial-sky'], ['heliopolitan', 'cosmology'], pyramidTexts],
  ['tefnut', '泰芙努特', 'Tefnut', '湿气与秩序性水分之神', ['狮首', '湿气', '露水'], 'deity', ['world-celestial-sky'], ['heliopolitan', 'cosmology'], pyramidTexts],
  ['geb', '盖布', 'Geb', '大地之神', ['大地', '蛇', '谷物'], 'deity', ['world-celestial-sky'], ['heliopolitan', 'cosmology', 'osirian-cycle'], coffinTexts],
  ['nut', '努特', 'Nut', '天空女神与太阳循环的穹顶', ['星辰', '天空穹顶', '太阳诞生'], 'deity', ['world-celestial-sky'], ['heliopolitan', 'cosmology', 'solar-cycle'], coffinTexts],
  ['ptah', '卜塔', 'Ptah', '以心与言创造的孟菲斯神学核心神', ['心', '言语', '工匠技艺'], 'deity', [], ['memphite', 'cosmology', 'creation'], shabaka],
  ['ra', '拉', 'Ra', '太阳航行与每日秩序更新的神', ['太阳圆盘', '太阳神舟', '鹰隼'], 'deity', ['world-celestial-sky', 'world-duat'], ['solar-cycle', 'kingship'], amduat],
  ['apep', '阿佩普', 'Apep / Apophis', '太阳夜航中与秩序相对的混沌巨蛇', ['巨蛇', '黑暗', '夜航阻力'], 'monster', ['world-duat'], ['solar-cycle', 'duat', 'chaos-being'], amduat],
  ['khepri', '凯布利', 'Khepri', '黎明再生与太阳更新的神格', ['圣甲虫', '黎明', '太阳再生'], 'deity', ['world-celestial-sky', 'world-duat'], ['solar-cycle', 'afterlife'], gates],
  ['osiris', '奥西里斯', 'Osiris', '死亡之后获得新王权的亡者之王', ['白冠', '权杖与连枷', '绿色肌肤'], 'deity', ['world-duat'], ['osirian-cycle', 'kingship', 'afterlife'], pyramidTexts],
  ['isis', '伊西斯', 'Isis', '魔法、守护与王权延续的女神', ['王座冠', '羽翼', '安卡'], 'deity', ['world-duat'], ['osirian-cycle', 'magic', 'kingship'], coffinTexts],
  ['set', '赛特', 'Seth / Set', '沙漠、风暴与王位冲突中的神', ['赛特兽', '沙暴', '权杖'], 'deity', ['world-celestial-sky', 'world-duat'], ['osirian-cycle', 'kingship', 'chaos-being'], horusSeth],
  ['horus', '荷鲁斯', 'Horus', '奥西里斯王权循环中的继承者与鹰神', ['鹰隼', '荷鲁斯之眼', '双冠'], 'deity', ['world-celestial-sky', 'world-duat'], ['osirian-cycle', 'kingship', 'solar-cycle'], horusSeth],
  ['nephthys', '奈芙蒂斯', 'Nephthys', '奥西里斯葬祭与守护传统中的女神', ['展开的羽翼', '哀悼姿态', '葬祭守护'], 'deity', ['world-duat'], ['osirian-cycle', 'funerary'], pyramidTexts],
  ['anubis', '阿努比斯', 'Anubis', '木乃伊化、墓地守护与亡者引导之神', ['胡狼', '天平', '安卡'], 'deity', ['world-duat'], ['duat', 'afterlife', 'embalming'], bookDead],
  ['maat', '玛阿特', "Ma'at", '真理、正义与宇宙秩序的女神 / 原则', ['鸵鸟羽毛', '天平', '安卡'], 'deity', ['world-duat', 'world-celestial-sky'], ['maat', 'cosmic-order', 'afterlife'], bookDead],
  ['thoth', '托特', 'Thoth', '文字、知识与审判记录之神', ['朱鹮', '书写板', '月轮'], 'deity', ['world-duat', 'world-celestial-sky'], ['writing', 'afterlife', 'maat'], bookDead],
  ['ammit', '阿米特', 'Ammit', '心脏称量失败后吞噬亡者心脏的复合生物', ['鳄鱼首', '狮身', '河马后躯'], 'monster', ['world-duat'], ['afterlife', 'judgement', 'animal-iconography'], bookDead],
  ['sekhmet', '塞赫麦特', 'Sekhmet', '太阳之眼传统中的狮首战争与疗愈女神', ['狮首', '太阳圆盘', '火焰'], 'deity', ['world-celestial-sky'], ['solar-cycle', 'eye-of-ra', 'healing'], heavenlyCow],
  ['hathor', '哈索尔', 'Hathor', '天空、音乐、欢庆与迎接亡者的女神', ['牛角日盘', '叉铃', '母牛'], 'deity', ['world-celestial-sky', 'world-duat'], ['solar-cycle', 'afterlife', 'protection'], coffinTexts],
  ['sobek', '索贝克', 'Sobek', '鳄鱼、尼罗河力量与王权相关的神', ['鳄鱼', '尼罗河', '鳄鱼冠'], 'deity', [], ['nile', 'kingship', 'animal-iconography'], coffinTexts],
  ['bastet', '巴斯特', 'Bastet', '猫科形象、家庭与守护相关的女神', ['猫', '叉铃', '香膏'], 'deity', [], ['protection', 'animal-iconography'], coffinTexts],
  ['wepwawet', '乌普奥特', 'Wepwawet', '为神与亡者开路的豺狼形神', ['豺狼', '开路旗帜', '战车'], 'deity', ['world-duat'], ['duat', 'funerary', 'animal-iconography'], gates],
  ['heka', '赫卡', 'Heka', '使神名、咒语与仪式获得效力的魔法力量', ['咒语', '双手', '护符'], 'deity', ['world-duat'], ['magic', 'afterlife'], coffinTexts],
];

export const egyptianCharacters: readonly Character[] = egyptianCharacterSeeds.map(character);

export const egyptianWorlds: readonly World[] = [
  {
    id: 'world-duat',
    mythologyId,
    slug: 'duat',
    name: '杜阿特',
    nameEn: 'Duat',
    summary: '太阳夜航、亡者转化与奥西里斯新王权相交汇的冥界空间层；不同冥界文献的地图不被强行合并。',
    canonicalDesign: { anchors: ['夜间太阳神舟', '门域', '星空穹顶', '亡者道路'], signatureMaterials: ['砂岩', '黑石', '青金石'], atmosphere: ['深夜蓝', '金色更新', '仪式性静默'] },
    heroImage: duatImage,
    heroImageMobile: duatPortrait,
  },
  {
    id: 'world-celestial-sky',
    mythologyId,
    slug: 'celestial-sky',
    name: '天空与太阳之域',
    nameEn: 'Celestial Sky',
    summary: 'Nut 的天空穹顶、白昼太阳航行与地平线更新共享的空间层，服务于多个太阳与宇宙秩序故事。',
    canonicalDesign: { anchors: ['Nut 的星辰穹顶', '白昼太阳神舟', '东方地平线', '太阳圆盘'], signatureMaterials: ['深蓝颜料', '黄金', '亚麻', '石灰岩'], atmosphere: ['晨光', '星辰', '开阔秩序'] },
    heroImage: { ...duatImage, alt: '太阳神舟从星空与地平线之间升起的古埃及天空意象' },
    heroImageMobile: { ...duatPortrait, alt: '竖幅太阳圆盘穿越古埃及星空穹顶的天空意象' },
  },
];

const scene = (slug: string, name: string, nameEn: string, summary: string, worldId?: string): Scene => ({
  id: 'scene-' + slug,
  mythologyId,
  worldId,
  slug,
  name,
  nameEn,
  summary,
  canonicalDesign: { anchors: [name, '来源范围明确的古埃及空间', '可复用叙事地标'], atmosphere: ['仪式秩序', '材质对比', '不依赖泛金字塔背景'] },
  heroImage: { ...duatImage, alt: name + '的 MythCanvas 古埃及神话场景' },
});

export const egyptianScenes: readonly Scene[] = [
  scene('river-of-stars', '星空之河', 'River of Stars', '太阳神舟沿星河驶向冥界，砂岩巨门立于两岸。', 'world-duat'),
  scene('primeval-waters', '努恩的原初之水', 'Primeval Waters', '创世前的无边水域与尚未分化的状态。'),
  scene('first-mound', '第一次陆地', 'First Mound', '从原初水面显现、使有序世界成为可能的第一丘。'),
  scene('heliopolitan-creation', '赫利奥波利斯创世场', 'Heliopolitan Creation', '阿图姆与世代神谱展开的太阳性创世场景。', 'world-celestial-sky'),
  scene('memphite-creation', '孟菲斯神学之心', 'Memphite Creation', '心与言将神意转化为世界的孟菲斯创世场景。'),
  scene('nut-sky-arch', '努特的星辰穹顶', 'Nut Sky Arch', '天空女神弧身承载星辰与太阳循环的宇宙图景。', 'world-celestial-sky'),
  scene('solar-barge-day', '白昼太阳神舟', 'Solar Barque by Day', '太阳神舟横渡天空、维持白昼与秩序的场景。', 'world-celestial-sky'),
  scene('akhet-horizon', '阿赫特地平线', 'Akhet Horizon', '太阳从东方地平线更新、重新显现的门槛。', 'world-celestial-sky'),
  scene('solar-barge-night', '夜间太阳神舟', 'Solar Barque by Night', '太阳进入杜阿特并开始夜间转化的航行。', 'world-duat'),
  scene('gates-of-duat', '杜阿特门域', 'Gates of the Duat', '门、守卫、咒语与夜间时段构成的冥界旅程场景。', 'world-duat'),
  scene('midnight-renewal', '午夜更新之室', 'Chamber of Midnight Renewal', '太阳与奥西里斯传统发生夜间更新关联的来源化场景。', 'world-duat'),
  scene('papyrus-marsh', '纸莎草沼泽', 'Papyrus Marsh', '伊西斯保护幼年荷鲁斯、远离王位冲突的隐蔽湿地。'),
  scene('divine-tribunal', '神圣裁决庭', 'Divine Tribunal', '围绕王位继承争议展开辩论、证言与裁决的神庭。'),
  scene('throne-of-osiris', '奥西里斯王座', 'Throne of Osiris', '亡者之王接受供奉并主持死后秩序的王庭。', 'world-duat'),
  scene('hall-of-two-truths', '两种真理之厅', 'Hall of Two Truths', '心脏称量、玛阿特之羽与审判者共同出现的葬祭场景。', 'world-duat'),
  scene('field-of-reeds', '芦苇原', 'Field of Reeds / Aaru', '与理想化永生和有序生活相连的死后区域概念。', 'world-duat'),
  scene('desert-necropolis', '沙漠墓地', 'Desert Necropolis', '木乃伊化、墓葬与亡者守护发生的人间边界空间。'),
];

type TaxonomySeed = readonly [string, string, string, TaxonomyTerm['kind'], number];
const taxonomySeeds: readonly TaxonomySeed[] = [
  ['primordial', '原初与创世前状态', 'Primordial', 'lineage', 10],
  ['heliopolitan', '赫利奥波利斯传统', 'Heliopolitan', 'lineage', 20],
  ['memphite', '孟菲斯神学', 'Memphite', 'lineage', 30],
  ['cosmology', '宇宙结构与创世', 'Cosmology', 'story-cycle', 40],
  ['solar-cycle', '太阳循环', 'Solar cycle', 'story-cycle', 50],
  ['osirian-cycle', '奥西里斯王权循环', 'Osirian cycle', 'story-cycle', 60],
  ['kingship', '王权与继承', 'Kingship', 'domain', 70],
  ['duat', '杜阿特与冥界旅程', 'Duat', 'domain', 80],
  ['afterlife', '死亡与有效亡者', 'Afterlife', 'domain', 90],
  ['funerary', '葬祭与木乃伊化', 'Funerary', 'domain', 100],
  ['embalming', '木乃伊化与墓地守护', 'Embalming', 'domain', 110],
  ['maat', '玛阿特与宇宙秩序', "Ma'at", 'domain', 120],
  ['cosmic-order', '宇宙秩序', 'Cosmic order', 'domain', 130],
  ['writing', '文字与记录', 'Writing', 'domain', 140],
  ['magic', '魔法与咒语', 'Magic', 'domain', 150],
  ['chaos-being', '混沌存在', 'Chaos being', 'domain', 160],
  ['eye-of-ra', '拉之眼传统', 'Eye of Ra', 'story-cycle', 170],
  ['nile', '尼罗河与地方神学', 'Nile', 'domain', 180],
  ['protection', '守护与家庭', 'Protection', 'domain', 190],
  ['healing', '毁灭与疗愈', 'Healing', 'domain', 200],
  ['animal-iconography', '动物图像形式', 'Animal iconography', 'editorial-collection', 210],
  ['creation', '创世行动', 'Creation', 'story-cycle', 220],
  ['judgement', '死后审判', 'Judgement', 'story-cycle', 230],
];

export const egyptianTaxonomy: readonly TaxonomyTerm[] = taxonomySeeds.map(([slug, name, nameEn, kind, displayOrder]) => ({
  id: 'taxonomy-egyptian-' + slug,
  mythologyId,
  slug,
  name,
  nameEn,
  kind,
  summary: name + '相关的埃及神话内容分组。',
  displayOrder,
}));

const relation = (id: string, fromCharacterId: string, toCharacterId: string, relationType: string, ref: SourceRef, traditionScope: string, isDefault = true): CharacterRelation => ({
  id,
  fromCharacterId,
  toCharacterId,
  relationType,
  assertionKey: fromCharacterId + '|' + toCharacterId + '|' + relationType + '|' + traditionScope,
  traditionScope,
  isDefault,
  sourceRefs: [ref],
  confidence: 'high',
});

export const egyptianRelations: readonly CharacterRelation[] = [
  relation('egypt-parent-atum-shu', 'character-atum', 'character-shu', 'parent', pyramidTexts, 'Heliopolitan creation tradition'),
  relation('egypt-parent-atum-tefnut', 'character-atum', 'character-tefnut', 'parent', pyramidTexts, 'Heliopolitan creation tradition'),
  relation('egypt-parent-shu-geb', 'character-shu', 'character-geb', 'parent', pyramidTexts, 'Heliopolitan creation tradition'),
  relation('egypt-parent-shu-nut', 'character-shu', 'character-nut', 'parent', pyramidTexts, 'Heliopolitan creation tradition'),
  relation('egypt-parent-geb-osiris', 'character-geb', 'character-osiris', 'parent', pyramidTexts, 'Heliopolitan Ennead tradition'),
  relation('egypt-parent-geb-isis', 'character-geb', 'character-isis', 'parent', pyramidTexts, 'Heliopolitan Ennead tradition'),
  relation('egypt-parent-geb-set', 'character-geb', 'character-set', 'parent', pyramidTexts, 'Heliopolitan Ennead tradition'),
  relation('egypt-parent-geb-nephthys', 'character-geb', 'character-nephthys', 'parent', pyramidTexts, 'Heliopolitan Ennead tradition'),
  relation('egypt-parent-osiris-horus', 'character-osiris', 'character-horus', 'parent', horusSeth, 'Osirian kingship tradition'),
  relation('egypt-parent-isis-horus', 'character-isis', 'character-horus', 'parent', horusSeth, 'Osirian kingship tradition'),
  relation('egypt-consort-osiris-isis', 'character-isis', 'character-osiris', 'consort', coffinTexts, 'Osirian tradition'),
  relation('egypt-sibling-isis-set', 'character-isis', 'character-set', 'sibling', pyramidTexts, 'Heliopolitan Ennead tradition'),
  relation('egypt-sibling-isis-nephthys', 'character-isis', 'character-nephthys', 'sibling', pyramidTexts, 'Heliopolitan Ennead tradition'),
  relation('egypt-enemy-osiris-set', 'character-osiris', 'character-set', 'enemy', horusSeth, 'Osirian kingship tradition'),
  relation('egypt-rival-horus-set', 'character-horus', 'character-set', 'rival', horusSeth, 'Horus and Seth succession tradition'),
  relation('egypt-serves-anubis-osiris', 'character-anubis', 'character-osiris', 'serves', bookDead, 'Funerary and Osirian tradition'),
  relation('egypt-serves-thoth-osiris', 'character-thoth', 'character-osiris', 'serves', bookDead, 'Book of the Dead judgement tradition'),
  relation('egypt-associated-maat-osiris', 'character-maat', 'character-osiris', 'associated-with', bookDead, 'Book of the Dead judgement tradition'),
  relation('egypt-enemy-ra-apep', 'character-ra', 'character-apep', 'enemy', amduat, 'New Kingdom solar underworld tradition'),
  relation('egypt-associated-khepri-ra', 'character-khepri', 'character-ra', 'associated-with', gates, 'Solar renewal tradition'),
  relation('egypt-associated-sekhmet-ra', 'character-sekhmet', 'character-ra', 'associated-with', heavenlyCow, 'Eye of Ra tradition'),
  relation('egypt-ally-isis-nephthys', 'character-isis', 'character-nephthys', 'ally', pyramidTexts, 'Osirian funerary tradition'),
  relation('egypt-ally-wepwawet-anubis', 'character-wepwawet', 'character-anubis', 'ally', gates, 'Funerary guardian tradition'),
  relation('egypt-associated-heka-anubis', 'character-heka', 'character-anubis', 'associated-with', coffinTexts, 'Funerary magic tradition'),
];

export const egyptianP0RequiredRelationIds = egyptianRelations.map((item) => item.id);
