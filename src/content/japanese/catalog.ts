import type { Character, CharacterRelation, Scene, SourceRef, TaxonomyTerm, World } from '../../lib/content/types';

const mythologyId = 'myth-japanese';
const desktopImage = {
  src: '/media/content/japanese-takamagahara.jpg',
  alt: '雾、山林与克制朱红构成的日本神代空间意象',
  width: 1280,
  height: 720,
};
const mobileImage = {
  src: '/media/content/art-takamagahara-moon.jpg',
  alt: '月光、雾与山林构成的日本神代竖幅空间意象',
  width: 720,
  height: 1280,
};

const source = (title: string, locator: string, note?: string): SourceRef => ({
  type: 'primary-text',
  title,
  locator,
  language: 'ja-classical',
  period: '8 世纪记载的古代文本传统',
  note,
});

const kojiki = (locator: string, note?: string) => ({ ...source('《古事记》上卷', locator, note), sourceId: 'source-japanese-kojiki-book-1' });
const nihonShoki = (locator: string, note?: string) => ({ ...source('《日本书纪》卷一至卷二', locator, note), sourceId: 'source-japanese-nihon-shoki-books-1-2' });

type CharacterSeed = readonly [
  string,
  string,
  string,
  string,
  readonly string[],
  NonNullable<Character['characterType']>,
  readonly string[],
  readonly string[],
  Character['canonicality']?,
];

const character = ([slug, name, nameEn, role, symbols, characterType, worldIds, traditionTags, canonicality = 'primary']: CharacterSeed): Character => ({
  id: `character-${slug}`,
  mythologyId,
  worldIds,
  slug,
  name,
  nameEn,
  role,
  summary: `${name}是日本神话${role}。本页区分《古事记》《日本书纪》的来源范围，并以 MythCanvas 原创视觉锚点呈现。`,
  symbols,
  characterType,
  traditionTags,
  sourcePeriods: ['《古事记》上卷与《日本书纪》卷一至卷二'],
  sourceRefs: [kojiki('相关神代段落')],
  canonicality,
  canonicalDesign: {
    anchors: [...symbols.slice(0, 3), `${name}的${role}`],
    silhouette: `以${symbols.slice(0, 2).join('与')}建立可复用的神代角色轮廓`,
    appearance: { body: ['成年或不定年龄的神话比例', '由角色权能决定的稳定姿态'] },
    costumeLanguage: ['原始木、纤维、石与青铜的节制性层次', '不把神代人物默认画成武士、现代巫女或平安宫廷人物'],
    paletteCues: ['月白', '深靛青', '克制朱红', '古铜与芦苇金'],
    temperament: ['神圣', '边界意识', '与叙事职责一致的克制姿态'],
    mythologicalFacts: [`${name}的稳定身份以${role}为核心。`],
    originalDesignChoices: ['使用 MythCanvas 原创的日本神代材质、轮廓与符号层级；不复制现代商业改编。'],
    avoid: ['旅游海报式鸟居与樱花模板', '现代神社制服', '战国盔甲', '特定动漫、游戏或影视角色设计'],
    canonicalPrompt: `Depict ${nameEn} as an original MythCanvas Japanese mythology figure. Preserve ${symbols.slice(0, 3).join(', ')} and the role of ${role}. Use primordial timber, stone, bronze, fiber, mist and restrained vermilion; avoid modern franchise-specific designs.`,
  },
});

const characterSeeds: readonly CharacterSeed[] = [
  ['ameno-minakanushi', '天之御中主神', 'Ame-no-Minakanushi', '最初出现的中轴神格', ['中轴', '天之中心', '无形开端'], 'deity', [], ['kotoamatsukami', 'origins', 'classical-myth']],
  ['takami-musubi', '高御产巢日神', 'Takami-musubi', '高天原的生成与命令神格', ['生成', '高天原', '命令'], 'deity', ['world-takamagahara'], ['kotoamatsukami', 'amatsukami', 'takamagahara']],
  ['kami-musubi', '神产巢日神', 'Kami-musubi', '与生成和出云系谱相连的神格', ['生成', '出云', '生命气息'], 'deity', ['world-takamagahara', 'world-ashihara-no-nakatsukuni'], ['kotoamatsukami', 'kunitsukami', 'izumo-cycle']],
  ['izanagi', '伊邪那岐', 'Izanagi', '参与国生、神生并穿越黄泉边界的神', ['天沼矛', '禊祓', '黄泉比良坂'], 'deity', ['world-takamagahara', 'world-yomi'], ['izanagi-izanami-line', 'origins', 'yomi-misogi']],
  ['izanami', '伊邪那美', 'Izanami', '参与国生、神生并成为黄泉之神的神', ['国生', '火神', '黄泉'], 'deity', ['world-takamagahara', 'world-yomi'], ['izanagi-izanami-line', 'origins', 'yomi-misogi']],
  ['kagutsuchi', '火之迦具土神', 'Kagutsuchi', '在神生中导致伊邪那美死亡的火神', ['火焰', '锻造', '灼热出生'], 'deity', ['world-ashihara-no-nakatsukuni', 'world-yomi'], ['fire', 'origins', 'yomi-misogi']],
  ['amaterasu', '天照大御神', 'Amaterasu', '太阳与高天原秩序的神', ['太阳', '镜', '天岩户'], 'deity', ['world-takamagahara'], ['amatsukami', 'solar', 'takamagahara', 'classical-myth']],
  ['tsukuyomi', '月读命', 'Tsukuyomi', '与月和夜间秩序相连的神', ['月', '夜', '边界'], 'deity', ['world-takamagahara'], ['amatsukami', 'boundary', 'classical-myth']],
  ['susanoo', '须佐之男命', 'Susanoo', '风暴、放逐与出云循环中的神', ['风暴', '剑', '海岸'], 'deity', ['world-takamagahara', 'world-ashihara-no-nakatsukuni'], ['amatsukami', 'storm', 'susanoo-izumo-line', 'izumo-cycle']],
  ['ame-no-uzume', '天宇受卖命', 'Ame-no-Uzume', '以舞蹈和仪式参与迎回天照的神', ['舞蹈', '神乐', '笑声'], 'deity', ['world-takamagahara'], ['amatsukami', 'takamagahara', 'classical-myth']],
  ['omoikane', '思兼神', 'Omoikane', '在天岩户危机中提出策略的智慧神', ['谋略', '会议', '仪式设计'], 'deity', ['world-takamagahara'], ['amatsukami', 'wisdom', 'takamagahara']],
  ['ame-no-tajikarao', '天手力男神', 'Ame-no-Tajikarao', '在天岩户开启时发挥力量的神', ['岩户', '力量', '开门'], 'deity', ['world-takamagahara'], ['amatsukami', 'boundary', 'takamagahara']],
  ['ame-no-koyane', '天儿屋命', 'Ame-no-Koyane', '参与天岩户仪式与天孙系谱的神', ['祝词', '祭仪', '言语'], 'deity', ['world-takamagahara'], ['amatsukami', 'takamagahara']],
  ['futodama', '布刀玉命', 'Futodama', '参与天岩户祭仪的神', ['祭具', '勾玉', '仪式'], 'deity', ['world-takamagahara'], ['amatsukami', 'takamagahara']],
  ['kushinadahime', '栉名田比卖', 'Kushinadahime', '与八岐大蛇叙事相连的出云人物', ['栉', '稻田', '家族'], 'mortal', ['world-ashihara-no-nakatsukuni'], ['susanoo-izumo-line', 'agriculture', 'izumo-cycle']],
  ['ashina-zuchi', '足名椎', 'Ashinazuchi', '栉名田比卖之父与出云家族长者', ['稻田', '家族', '出云'], 'mortal', ['world-ashihara-no-nakatsukuni'], ['susanoo-izumo-line', 'agriculture']],
  ['te-na-zuchi', '手名椎', 'Tenazuchi', '栉名田比卖之母与出云家族长者', ['稻田', '家族', '水'], 'mortal', ['world-ashihara-no-nakatsukuni'], ['susanoo-izumo-line', 'agriculture']],
  ['yamata-no-orochi', '八岐大蛇', 'Yamata no Orochi', '须佐之男在出云斩杀的八首八尾怪物', ['八首八尾', '剑', '肥河'], 'monster', ['world-ashihara-no-nakatsukuni'], ['storm', 'izumo-cycle', 'classical-myth']],
  ['okuninushi', '大国主神', 'Ōkuninushi', '出云、国土经营与国让循环的神', ['袋', '葦原', '国土经营'], 'deity', ['world-ashihara-no-nakatsukuni', 'world-ne-no-katasukuni'], ['kunitsukami', 'agriculture', 'izumo-cycle', 'kuniyuzuri']],
  ['suseribime', '须势理毗卖', 'Suseribime', '根之坚州国试炼中的神女', ['火鼠衣意象', '试炼', '出云'], 'deity', ['world-ne-no-katasukuni'], ['kunitsukami', 'boundary', 'izumo-cycle']],
  ['sukunahikona', '少彦名神', 'Sukunahikona', '与大国主共同经营国土的神', ['小神', '药', '海上来访'], 'deity', ['world-ashihara-no-nakatsukuni'], ['kunitsukami', 'agriculture', 'izumo-cycle']],
  ['omononushi', '大物主神', 'Ōmononushi', '在国土完成叙事中显现的神格', ['蛇形神意象', '三轮山', '国土秩序'], 'deity', ['world-ashihara-no-nakatsukuni'], ['kunitsukami', 'mountain', 'izumo-cycle']],
  ['ame-no-hohi', '天菩比神', 'Ame-no-Hohi', '奉命前往葦原中国的使者', ['使者', '天与地', '使命'], 'deity', ['world-takamagahara', 'world-ashihara-no-nakatsukuni'], ['amatsukami', 'kuniyuzuri']],
  ['ame-no-wakahiko', '天若日子', 'Ame-no-Wakahiko', '在国让使者线中失去使命的神', ['弓箭', '使者', '返矢'], 'deity', ['world-ashihara-no-nakatsukuni'], ['amatsukami', 'kuniyuzuri']],
  ['takemikazuchi', '建御雷神', 'Takemikazuchi', '降临稻佐之滨参与国让的武神', ['雷霆', '剑', '稻佐之滨'], 'deity', ['world-takamagahara', 'world-ashihara-no-nakatsukuni'], ['amatsukami', 'kuniyuzuri', 'storm']],
  ['futsunushi', '经津主神', 'Futsunushi', '《日本书纪》国让异传中的重要武神', ['神剑', '使者', '异传'], 'deity', ['world-takamagahara', 'world-ashihara-no-nakatsukuni'], ['amatsukami', 'kuniyuzuri']],
  ['kotoshironushi', '事代主神', 'Kotoshironushi', '大国主之子与国让选择相连的神', ['海边钓竿', '选择', '国让'], 'deity', ['world-ashihara-no-nakatsukuni'], ['kunitsukami', 'kuniyuzuri', 'sea']],
  ['takeminakata', '建御名方神', 'Takeminakata', '大国主之子与国让对抗相连的神', ['力量', '诹访', '对抗'], 'deity', ['world-ashihara-no-nakatsukuni'], ['kunitsukami', 'kuniyuzuri', 'mountain']],
  ['ame-no-oshihomimi', '天忍穗耳命', 'Ame-no-Oshihomimi', '天孙降临前的天神系谱节点', ['稻穗', '天孙', '继承'], 'deity', ['world-takamagahara'], ['amatsukami', 'tenson-line', 'tenson-korin']],
  ['ninigi', '邇邇艺命', 'Ninigi', '从高天原降临高千穗的天孙', ['稻穗', '镜', '山道'], 'deity', ['world-takamagahara', 'world-ashihara-no-nakatsukuni'], ['amatsukami', 'tenson-line', 'tenson-korin']],
  ['sarutahiko', '猿田彦神', 'Sarutahiko', '在天孙降临途中引路的神', ['道路', '岔路', '长鼻意象'], 'deity', ['world-ashihara-no-nakatsukuni'], ['kunitsukami', 'boundary', 'tenson-korin']],
  ['konohanasakuya-hime', '木花咲耶姬', 'Konohanasakuya-hime', '与天孙婚姻和火中生产相连的神女', ['樱花意象', '火屋', '短暂繁盛'], 'deity', ['world-ashihara-no-nakatsukuni'], ['kunitsukami', 'mountain', 'tenson-korin']],
  ['iwanagahime', '石长比卖', 'Iwanagahime', '与木花咲耶姬并列的山地神女', ['岩石', '长久', '山'], 'deity', ['world-ashihara-no-nakatsukuni'], ['kunitsukami', 'mountain', 'tenson-korin']],
  ['hoderi', '火照命', 'Hoderi', '海幸山幸循环中的海幸', ['海钓', '失钩', '兄弟争执'], 'hero', ['world-ashihara-no-nakatsukuni', 'world-watatsumi-realm'], ['sea-line', 'sea-cycle', 'tenson-line']],
  ['hoori', '火远理命', 'Hoori', '海幸山幸循环中的山幸与神代谱系节点', ['山幸', '失钩', '潮汐'], 'hero', ['world-ashihara-no-nakatsukuni', 'world-watatsumi-realm'], ['sea-line', 'sea-cycle', 'tenson-line']],
  ['toyotama-hime', '丰玉姬', 'Toyotama-hime', '在海神之宫与生产叙事中出现的神女', ['潮汐', '海宫', '边界'], 'deity', ['world-watatsumi-realm'], ['sea-line', 'sea-cycle']],
  ['watatsumi', '海神', 'Watatsumi', '海神之国的统治神格', ['海潮', '海宫', '珠'], 'deity', ['world-watatsumi-realm'], ['sea-line', 'sea-cycle']],
  ['kaguya', '辉夜姬', 'Kaguya-hime', '《竹取物语》中的月界来客与文学主角', ['月', '竹', '羽衣'], 'hero', [], ['classical-tale', 'lunar-origin'], 'literary'],
];

export const japaneseCharacters: readonly Character[] = characterSeeds.map(character);

export const japaneseWorlds: readonly World[] = [
  { id: 'world-takamagahara', mythologyId, slug: 'takamagahara', name: '高天原', nameEn: 'Takamagahara', summary: '高天原是天神与秩序命令展开的开放神域，不等同于成熟的神社景区。', canonicalDesign: { anchors: ['开放云野', '原始木构', '镜与勾玉', '天上边界'], signatureMaterials: ['未上漆木材', '植物纤维', '古铜', '雾与云'], atmosphere: ['初生', '明亮', '神圣而空旷'] }, heroImage: desktopImage, heroImageMobile: mobileImage },
  { id: 'world-ashihara-no-nakatsukuni', mythologyId, slug: 'ashihara-no-nakatsukuni', name: '葦原中国', nameEn: 'Ashihara no Nakatsukuni', summary: '芦苇原与河流、森林、海岸相连的地上国土，承载出云循环与国让。', canonicalDesign: { anchors: ['芦苇原', '河流与海岸', '出云木构', '地上国土'], signatureMaterials: ['芦苇', '湿木', '河石', '青铜'], atmosphere: ['风与水', '生长', '尚未定型的秩序'] }, heroImage: desktopImage, heroImageMobile: mobileImage },
  { id: 'world-yomi', mythologyId, slug: 'yomi', name: '黄泉国', nameEn: 'Yomi', summary: '与死亡、腐朽和生者边界相连的黄泉空间；不使用佛教地狱的火焰审判视觉。', canonicalDesign: { anchors: ['暗岩', '腐朽与湿气', '黄泉比良坂', '边界石'], signatureMaterials: ['黑色岩层', '湿土', '枯木', '冷雾'], atmosphere: ['阴冷', '衰败', '不可逆的边界'] }, heroImage: desktopImage, heroImageMobile: mobileImage },
  { id: 'world-ne-no-katasukuni', mythologyId, slug: 'ne-no-katasukuni', name: '根之坚州国', nameEn: 'Ne no Katasukuni', summary: '大国主进入并接受试炼的地下或根之国空间，保持其与黄泉国的语义差异。', canonicalDesign: { anchors: ['根系与暗火', '试炼通道', '地下王庭'], signatureMaterials: ['根木', '暗石', '火种', '粗纤维'], atmosphere: ['幽暗', '试炼', '深层秩序'] }, heroImage: desktopImage, heroImageMobile: mobileImage },
  { id: 'world-watatsumi-realm', mythologyId, slug: 'watatsumi-realm', name: '海神之国', nameEn: 'Watatsumi Realm', summary: '海幸山幸叙事中的超自然海域。海神之宫作为具体建筑另建 Scene，不把宫殿冒充 World。', canonicalDesign: { anchors: ['潮汐轴线', '深海玉色', '海域边界', '珠的光'], signatureMaterials: ['海水', '贝壳', '珍珠光', '湿润木材'], atmosphere: ['深邃', '流动', '异界边缘'] }, heroImage: desktopImage, heroImageMobile: mobileImage },
];

const scene = (slug: string, name: string, nameEn: string, summary: string, worldId?: string): Scene => ({
  id: `scene-${slug}`, mythologyId, worldId, slug, name, nameEn, summary,
  canonicalDesign: { anchors: [name, '日本神代来源范围', '可复用叙事空间'], atmosphere: ['雾', '自然光', '边界感'] },
  heroImage: { ...desktopImage, alt: `${name}的 MythCanvas 日本神代场景` },
});

export const japaneseScenes: readonly Scene[] = [
  scene('ama-no-ukihashi', '天之浮桥', 'Ama-no-Ukihashi', '伊邪那岐与伊邪那美俯视未定海面的天上边界。', 'world-takamagahara'),
  scene('onogoro', '淤能碁吕岛', 'Onogoro Island', '国生叙事中由天沼矛凝成的起点岛屿。', 'world-ashihara-no-nakatsukuni'),
  scene('yomotsu-hirasaka', '黄泉比良坂', 'Yomotsu Hirasaka', '生者与黄泉之间不可逆的通道和边界。', 'world-yomi'),
  scene('misogi-shore', '禊祓之滨', 'Misogi Shore', '伊邪那岐从黄泉返回后进行禊祓的水岸。', 'world-ashihara-no-nakatsukuni'),
  scene('ama-no-iwato', '天岩户', 'Ama-no-Iwato', '太阳隐去与众神仪式共同发生的岩洞边界。', 'world-takamagahara'),
  scene('takamagahara-court', '高天原议庭', 'Takamagahara Court', '高天原诸神讨论秩序、使者与仪式的开放空间。', 'world-takamagahara'),
  scene('hii-river', '肥河', 'Hii River', '八岐大蛇与出云家族叙事相连的河流场景。', 'world-ashihara-no-nakatsukuni'),
  scene('inaba-coast', '因幡海岸', 'Inaba Coast', '大国主与因幡白兔故事的海岸入口。', 'world-ashihara-no-nakatsukuni'),
  scene('ne-trial-hall', '根之坚州国试炼场', 'Ne no Katasukuni Trial Hall', '大国主进入根之坚州国后面对火与追逐的试炼空间。', 'world-ne-no-katasukuni'),
  scene('inasa-beach', '稻佐之滨', 'Inasa Beach', '建御雷等神降临并展开国让谈判的海滨。', 'world-ashihara-no-nakatsukuni'),
  scene('takachiho-peak', '高千穗峰', 'Takachiho Peak', '天孙沿云路降临地上的山岳节点。', 'world-ashihara-no-nakatsukuni'),
  scene('fire-birth-house', '火中生产之屋', 'House of Fire Birth', '木花咲耶姬以火证明自身清白并生产的场景。', 'world-ashihara-no-nakatsukuni'),
  scene('watatsumi-palace', '海神之宫', 'Watatsumi Palace', '海神之国中的具体宫殿 Scene，承载潮盈珠与潮干珠叙事。', 'world-watatsumi-realm'),
  scene('bamboo-moon', '竹林与月界边界', 'Bamboo and Moon Boundary', '《竹取物语》文学层的竹林、月光和离返边界。'),
];

type TaxonomySeed = readonly [string, string, string, TaxonomyTerm['kind'], number];
const taxonomySeeds: readonly TaxonomySeed[] = [
  ['kotoamatsukami', '别天津神', 'Kotoamatsukami', 'lineage', 10], ['amatsukami', '天津神', 'Amatsukami', 'lineage', 20], ['kunitsukami', '国津神', 'Kunitsukami', 'lineage', 30],
  ['izanagi-izanami-line', '伊邪那岐与伊邪那美系', 'Izanagi-Izanami line', 'lineage', 40], ['susanoo-izumo-line', '须佐之男与出云系', 'Susanoo-Izumo line', 'lineage', 50], ['tenson-line', '天孙系谱', 'Tenson line', 'lineage', 60], ['sea-line', '海神与海陆系谱', 'Sea line', 'lineage', 70],
  ['solar', '太阳', 'Solar', 'domain', 80], ['storm', '风暴与雷', 'Storm', 'domain', 90], ['sea', '海与潮汐', 'Sea', 'domain', 100], ['wisdom', '智慧与谋略', 'Wisdom', 'domain', 110], ['agriculture', '稻作与国土经营', 'Agriculture', 'domain', 120], ['boundary', '边界与通行', 'Boundary', 'domain', 130], ['mountain', '山岳', 'Mountain', 'domain', 140], ['fire', '火', 'Fire', 'domain', 150],
  ['origins', '天地初成与国生', 'Origins', 'story-cycle', 160], ['yomi-misogi', '黄泉与禊祓', 'Yomi and Misogi', 'story-cycle', 170], ['takamagahara', '高天原循环', 'Takamagahara', 'story-cycle', 180], ['izumo-cycle', '出云循环', 'Izumo cycle', 'story-cycle', 190], ['kuniyuzuri', '葦原中国平定与国让', 'Kuniyuzuri', 'story-cycle', 200], ['tenson-korin', '天孙降临', 'Tenson Kōrin', 'story-cycle', 210], ['sea-cycle', '海幸山幸', 'Sea cycle', 'story-cycle', 220],
  ['classical-myth', '记纪神代主干', 'Classical myth', 'editorial-collection', 230], ['classical-tale', '古典物语', 'Classical tale', 'editorial-collection', 240], ['lunar-origin', '月界来客', 'Lunar origin', 'domain', 250],
];
export const japaneseTaxonomy: readonly TaxonomyTerm[] = taxonomySeeds.map(([slug, name, nameEn, kind, displayOrder]) => ({ id: `taxonomy-japanese-${slug}`, mythologyId, slug, name, nameEn, kind, summary: `${name}是日本神话的阅读与浏览分类，不替代 Character stable type。`, displayOrder }));

const relation = (id: string, fromCharacterId: string, toCharacterId: string, relationType: string, ref: SourceRef, traditionScope = 'Kojiki main text', isDefault = true, confidence: CharacterRelation['confidence'] = 'high'): CharacterRelation => ({
  id,
  fromCharacterId,
  toCharacterId,
  relationType,
  assertionKey: `${relationType}:${[fromCharacterId, toCharacterId].sort().join(':')}`,
  traditionScope,
  isDefault,
  sourceRefs: [ref],
  confidence,
});

export const japaneseRelations: readonly CharacterRelation[] = [
  relation('japanese-consort-izanagi-izanami', 'character-izanagi', 'character-izanami', 'consort', kojiki('国生与神生段落')),
  relation('japanese-parent-izanami-kagutsuchi', 'character-izanami', 'character-kagutsuchi', 'parent', kojiki('火之迦具土神段落')),
  relation('japanese-parent-izanagi-amaterasu', 'character-izanagi', 'character-amaterasu', 'parent', kojiki('禊祓与三贵子段落')),
  relation('japanese-parent-izanagi-tsukuyomi', 'character-izanagi', 'character-tsukuyomi', 'parent', kojiki('禊祓与三贵子段落')),
  relation('japanese-parent-izanagi-susanoo', 'character-izanagi', 'character-susanoo', 'parent', kojiki('禊祓与三贵子段落')),
  relation('japanese-parent-izanami-amaterasu-alt', 'character-izanami', 'character-amaterasu', 'parent', nihonShoki('卷一·神代上·异传', '《日本书纪》的一书异传与《古事记》主读法不同；只在该 scope 主动选择。'), 'Nihon Shoki alternate 01', false, 'contested'),
  relation('japanese-sibling-amaterasu-tsukuyomi', 'character-amaterasu', 'character-tsukuyomi', 'sibling', kojiki('三贵子段落')),
  relation('japanese-sibling-amaterasu-susanoo', 'character-amaterasu', 'character-susanoo', 'sibling', kojiki('三贵子段落')),
  relation('japanese-rival-amaterasu-susanoo', 'character-amaterasu', 'character-susanoo', 'rival', kojiki('誓约与高天原骚扰段落')),
  relation('japanese-consort-susanoo-kushinadahime', 'character-susanoo', 'character-kushinadahime', 'consort', kojiki('八岐大蛇段落')),
  relation('japanese-defeats-susanoo-orochi', 'character-susanoo', 'character-yamata-no-orochi', 'defeats', kojiki('八岐大蛇段落')),
  relation('japanese-parent-susanoo-okuninushi', 'character-susanoo', 'character-okuninushi', 'parent', kojiki('大国主系谱段落')),
  relation('japanese-consort-okuninushi-suseribime', 'character-okuninushi', 'character-suseribime', 'consort', kojiki('根之坚州国段落')),
  relation('japanese-ally-okuninushi-sukunahikona', 'character-okuninushi', 'character-sukunahikona', 'ally', kojiki('国土经营段落')),
  relation('japanese-associated-okuninushi-omononushi', 'character-okuninushi', 'character-omononushi', 'associated-with', kojiki('国土完成与大物主显现段落')),
  relation('japanese-parent-okuninushi-kotoshironushi', 'character-okuninushi', 'character-kotoshironushi', 'parent', kojiki('国让段落')),
  relation('japanese-parent-okuninushi-takeminakata', 'character-okuninushi', 'character-takeminakata', 'parent', kojiki('国让段落')),
  relation('japanese-opposes-takemikazuchi-okuninushi', 'character-takemikazuchi', 'character-okuninushi', 'opposes', kojiki('稻佐之滨与国让段落')),
  relation('japanese-ally-takemikazuchi-futsunushi', 'character-takemikazuchi', 'character-futsunushi', 'ally', nihonShoki('卷二·神代下·国让异传'), 'Nihon Shoki alternate 02', false, 'contested'),
  relation('japanese-parent-takami-musubi-oshihomimi', 'character-takami-musubi', 'character-ame-no-oshihomimi', 'parent', kojiki('天孙系谱段落')),
  relation('japanese-parent-oshihomimi-ninigi', 'character-ame-no-oshihomimi', 'character-ninigi', 'parent', kojiki('天孙降临段落')),
  relation('japanese-orders-ninigi-amaterasu', 'character-amaterasu', 'character-ninigi', 'orders-creation', kojiki('天孙降临段落')),
  relation('japanese-ally-ninigi-sarutahiko', 'character-ninigi', 'character-sarutahiko', 'ally', kojiki('猿田彦引路段落')),
  relation('japanese-consort-ninigi-konohanasakuya', 'character-ninigi', 'character-konohanasakuya-hime', 'consort', kojiki('木花咲耶姬段落')),
  relation('japanese-consort-ninigi-iwanagahime', 'character-ninigi', 'character-iwanagahime', 'consort', kojiki('木花咲耶姬段落')),
  relation('japanese-sibling-hoderi-hoori', 'character-hoderi', 'character-hoori', 'sibling', kojiki('海幸山幸段落')),
  relation('japanese-rival-hoderi-hoori', 'character-hoderi', 'character-hoori', 'rival', kojiki('海幸山幸段落')),
  relation('japanese-consort-hoori-toyotama', 'character-hoori', 'character-toyotama-hime', 'consort', kojiki('海神之宫与生产段落')),
  relation('japanese-parent-watatsumi-toyotama', 'character-watatsumi', 'character-toyotama-hime', 'parent', kojiki('海神之宫段落')),
  relation('japanese-rules-watatsumi-toyotama', 'character-watatsumi', 'character-toyotama-hime', 'rules-over', kojiki('海神之宫段落')),
];

export const japaneseP0RequiredRelationIds = japaneseRelations.map((item) => item.id);
