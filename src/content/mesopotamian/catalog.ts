import type { Character, CharacterRelation, ContentConcept, Scene, SourceRef, TaxonomyTerm, World } from '../../lib/content/types';
import { sourceRef } from './sources';

const mythologyId = 'myth-mesopotamian';
const prototypeImage = {
  src: '/art/mythology-placeholder.svg',
  alt: '美索不达米亚神话视觉原型占位图；不代表单一古代图像证据',
  width: 1600,
  height: 900,
};

const source = (key: Parameters<typeof sourceRef>[0], locator: string, note?: string): SourceRef => sourceRef(key, locator, note);
const characterId = (slug: string) => `character-${slug}`;

type CharacterSeed = {
  slug: string;
  name: string;
  nameEn: string;
  role: string;
  symbols: readonly string[];
  characterType: NonNullable<Character['characterType']>;
  worldIds?: readonly string[];
  traditionTags: readonly string[];
  source: SourceRef;
  canonicality?: NonNullable<Character['canonicality']>;
  facts?: readonly string[];
};

const makeCharacter = (item: CharacterSeed): Character => ({
  id: characterId(item.slug),
  mythologyId,
  worldIds: item.worldIds ?? [],
  slug: item.slug,
  name: item.name,
  nameEn: item.nameEn,
  role: item.role,
  summary: `${item.name}（${item.nameEn}）是${item.role}。本页将其放回具体语言、文本见证与地方传统中，不把跨时期材料压缩成单一神谱。`,
  symbols: item.symbols,
  characterType: item.characterType,
  traditionTags: item.traditionTags,
  sourcePeriods: [item.source.period ?? '多时期材料'],
  sourceRefs: [item.source],
  canonicality: item.canonicality ?? 'primary',
  canonicalDesign: {
    anchors: [...item.symbols.slice(0, 4), `${item.name}的${item.role}身份`],
    silhouette: `以${item.symbols.slice(0, 2).join('与')}构成来源范围清晰的神话角色轮廓`,
    appearance: { body: ['成人神性或叙事角色比例', '职责驱动的仪式性姿态'] },
    costumeLanguage: ['泥砖、青铜、织物与石材的来源分层', '古代两河服饰语言的原创转译', '不复制现代影视、游戏或漫画设计'],
    paletteCues: ['泥砖赭', '青金石蓝', '河水青', '按时期克制使用古金'],
    temperament: ['庄严', '古老城市文明感', '由文本职责驱动的姿态'],
    mythologicalFacts: item.facts ?? [`${item.name}的公开身份以${item.role}为核心；具体神职随来源与时期变化。`],
    originalDesignChoices: ['以 MythCanvas 原创材质、轮廓与光线建立身份，不把随机楔形文字当作可读铭文。'],
    avoid: ['埃及金字塔、十字生命符号或法老头饰', '希腊罗马柱式的默认化', '中美洲金字塔与羽蛇图像', '古代宇航员、UFO 或现代 occult 神谱', '现代商业作品的特定角色设计'],
    canonicalPrompt: `Depict ${item.nameEn} as an original MythCanvas Mesopotamian mythology figure. Preserve ${item.symbols.slice(0, 3).join(', ')} and the source-scoped role of ${item.role}. Use period-aware mudbrick, baked brick, reed, bronze, lapis and restrained gold; never invent readable cuneiform and avoid modern franchise designs, ancient-astronaut imagery and cross-civilization symbols.`,
  },
});

const characterSeeds: readonly CharacterSeed[] = [
  { slug: 'an-anu', name: '安 / 阿努', nameEn: 'An / Anu', role: '天空与神圣权威的神', symbols: ['天空', '星辰', '王权冠冕'], characterType: 'deity', traditionTags: ['sumerian-foundations', 'divine-order'], source: source('enkiWorldOrder', 'An / Anu authority passages'), facts: ['An 是 Sumerian 语境中的名称，Anu 是 Akkadian 语境中的对应名称；本包以一个稳定 Character 承载双语身份。'] },
  { slug: 'enlil', name: '恩利尔', nameEn: 'Enlil / Ellil', role: '风、权威与神圣秩序中的主神', symbols: ['风', '权杖', 'Nippur'], characterType: 'deity', worldIds: ['world-abzu'], traditionTags: ['sumerian-foundations', 'divine-order', 'nippur-local'], source: source('enkiWorldOrder', 'Enlil and distribution of offices') },
  { slug: 'ninlil', name: '宁利尔', nameEn: 'Ninlil', role: '与 Enlil 相连的女神与 Sumerian 叙事角色', symbols: ['风域', '芦苇', '月神谱系'], characterType: 'deity', traditionTags: ['sumerian-foundations', 'nippur-local'], source: source('enlilNinlil', 'Ninlil and Enlil encounter sequence') },
  { slug: 'enki-ea', name: '恩基 / 埃阿', nameEn: 'Enki / Ea', role: '淡水、智慧、技艺与救助秩序中的神', symbols: ['淡水', '芦苇', '智慧', 'Eridu'], characterType: 'deity', worldIds: ['world-abzu'], traditionTags: ['sumerian-foundations', 'akkadian-bridge', 'eridu-local'], source: source('enkiWorldOrder', 'Enki, Eridu and office-distribution passages'), facts: ['Enki 是 Sumerian 名称，Ea 是 Akkadian 名称；共享稳定身份，但文本中的职责表达保留语言与时期差异。'] },
  { slug: 'inanna-ishtar', name: '伊南娜 / 伊什塔尔', nameEn: 'Inanna / Ištar / Ishtar', role: '爱欲、战争、王权与金星关联中的女神', symbols: ['八芒星', '狮子', '金星', '武器'], characterType: 'deity', worldIds: ['world-mesopotamian-netherworld'], traditionTags: ['sumerian-foundations', 'akkadian-bridge', 'inanna-ishtar', 'uruk-local', 'underworld'], source: source('inannaDescent', 'Inana / Ištar identity and descent opening'), facts: ['Inanna 是 Sumerian 名称，Ištar / Ishtar 是 Akkadian 名称；爱欲、战争与金星维度按来源范围呈现，不压缩成单一“性感女神”。'] },
  { slug: 'utu-shamash', name: '乌图 / 沙玛什', nameEn: 'Utu / Šamaš / Shamash', role: '太阳、正义与道路照明中的神', symbols: ['太阳盘', '光线', '正义'], characterType: 'deity', traditionTags: ['sumerian-foundations', 'akkadian-bridge', 'divine-order'], source: source('enkiWorldOrder', 'Utu / Šamaš office and astral passages'), facts: ['Utu 与 Šamaš / Shamash 是跨 Sumerian 与 Akkadian 的双语名称；具体太阳与裁判意象需要保留文本范围。'] },
  { slug: 'nanna-sin', name: '南纳 / 辛', nameEn: 'Nanna / Suen / Sîn / Sin', role: '月亮、时间与 Ur 地方崇拜中的神', symbols: ['新月', '月舟', 'Ur'], characterType: 'deity', traditionTags: ['sumerian-foundations', 'ur-local', 'divine-order'], source: source('enlilNinlil', 'Nanna / Suen birth and naming sequence'), facts: ['Nanna、Suen 与 Sîn / Sin 是多语名称；本包不因 ASCII 拼写选择而改变 URL。'] },
  { slug: 'ishkur-adad', name: '伊什库尔 / 阿达德', nameEn: 'Iškur / Adad', role: '风暴、雷雨与丰饶力量中的神', symbols: ['雷暴', '公牛', '雨'], characterType: 'deity', traditionTags: ['sumerian-foundations', 'akkadian-bridge'], source: source('enkiWorldOrder', 'storm-god office and weather passages'), facts: ['Iškur 与 Adad 作为 Sumerian / Akkadian 名称相连，但地方崇拜与图像表达不自动统一。'] },
  { slug: 'ereshkigal', name: '埃列什基伽尔', nameEn: 'Ereškigal / Ereshkigal', role: '冥界女王与死者领域的主宰', symbols: ['冥界王座', '七门', '尘土'], characterType: 'deity', worldIds: ['world-mesopotamian-netherworld'], traditionTags: ['underworld', 'sumerian-foundations'], source: source('inannaDescent', 'Ereškigal, seven gates and replacement sequence') },
  { slug: 'nergal', name: '涅伽尔', nameEn: 'Nergal', role: '暴力死亡、战争与冥界权力中的神', symbols: ['炽热', '武器', '冥界王权'], characterType: 'deity', worldIds: ['world-mesopotamian-netherworld'], traditionTags: ['underworld', 'akkadian-bridge'], source: source('nergalEreshkigal', 'Nergal and Ereshkigal relationship and descent'), canonicality: 'layered', facts: ['Nergal 与 Erra 不在本包默认合并；后期神学关系用 source-scoped interpretation 或 claim 表达。'] },
  { slug: 'ninurta', name: '宁乌尔塔', nameEn: 'Ninurta', role: '英雄秩序、战斗与山岳征服传统中的神', symbols: ['锄 / 武器', '山岳', '英雄姿态'], characterType: 'deity', traditionTags: ['sumerian-foundations', 'heroic-order'], source: source('lugalE', 'Ninurta and defeated mountain beings') },
  { slug: 'dumuzi-tammuz', name: '杜穆兹 / 塔木兹', nameEn: 'Dumuzi / Tammuz', role: '牧人、季节哀悼与冥界替代传统中的角色', symbols: ['牧杖', '羊群', '哀歌'], characterType: 'deity', worldIds: ['world-mesopotamian-netherworld'], traditionTags: ['underworld', 'sumerian-foundations'], source: source('dumuziDream', 'Dumuzi dream and pursuit sequence'), canonicality: 'layered', facts: ['Dumuzi / Tammuz 的跨语言延续不抹平早期 Sumerian 叙事与后期哀悼传统的差异。'] },
  { slug: 'marduk', name: '马尔杜克', nameEn: 'Marduk', role: 'Babylon 神学与宇宙秩序提升中的神', symbols: ['权杖', '铲形符号', '龙形 mušhuššu'], characterType: 'deity', worldIds: ['world-abzu'], traditionTags: ['babylonian-theology', 'babylon-local', 'kingship'], source: source('enumaElish', 'Marduk champion, battle and fifty names'), facts: ['Marduk-centered theology is source-scoped to Babylonian composition and is not back-projected as all Sumerian creation theology.'] },
  { slug: 'nabu', name: '纳布', nameEn: 'Nabu', role: '书写、记录与王权继承中的神', symbols: ['芦苇笔', '泥板', '楔形文字'], characterType: 'deity', traditionTags: ['babylonian-theology', 'babylon-local', 'writing'], source: source('anAnum', 'Nabu name and scribal correspondence entries'), facts: ['Nabu 的书写符号仅在有来源的书写语境使用；视觉中的楔形文字默认不可读。'] },
  { slug: 'ashur', name: '阿舒尔', nameEn: 'Aššur / Ashur', role: '亚述国家神学与地方崇拜中的神', symbols: ['神圣圆盘', '城市神庙', '王权仪式'], characterType: 'deity', traditionTags: ['assyrian-bridge', 'kingship', 'assur-local'], source: source('assyrianCult', 'Ashur as Assyrian state and local-cult identity'), canonicality: 'layered', facts: ['Ashur 保持为 Assyrian source-scoped identity，不与 Marduk 强制合并。'] },
  { slug: 'nammu', name: '娜木姆', nameEn: 'Nammu', role: 'Sumerian 原初水与创世前状态中的神格', symbols: ['原初水', '孕育', '深水'], characterType: 'deity', worldIds: ['world-abzu'], traditionTags: ['sumerian-foundations', 'creation', 'eridu-local'], source: source('enkiNinhursaga', 'Nammu and primordial water references'), canonicality: 'layered' },
  { slug: 'ninhursaga', name: '宁胡尔萨格', nameEn: 'Ninhursaga / Ninmah', role: '山地、生命与母神传统中的来源限定身份', symbols: ['山地', '生命', '母神称号'], characterType: 'deity', traditionTags: ['sumerian-foundations', 'creation'], source: source('enkiNinhursaga', 'Ninhursaga, Dilmun and birth sequence'), canonicality: 'layered', facts: ['Ninhursaga、Ninmah、Nintur 等母神名称不被自动制作成一个万能 Mother Goddess。'] },
  { slug: 'apsu-enuma-elish', name: '阿普苏', nameEn: 'Apsû', role: 'Enūma Eliš 中与原初淡水相关的神格', symbols: ['原初淡水', '深渊', '神圣伴侣'], characterType: 'deity', traditionTags: ['babylonian-theology', 'creation'], source: source('enumaElish', 'Tablet I, Apsu and Tiamat opening'), canonicality: 'layered', facts: ['Apsu 是 Enūma Eliš 中的 Character；不要与作为宇宙淡水领域的 Abzu World 混用。'] },
  { slug: 'tiamat', name: '提阿马特', nameEn: 'Tiamat', role: 'Enūma Eliš 中的原初海水神格与 Marduk 的对手', symbols: ['海水', '原初混沌', '风暴战场'], characterType: 'deity', worldIds: ['world-abzu'], traditionTags: ['babylonian-theology', 'creation'], source: source('enumaElish', 'Tablets I–V, Tiamat conflict'), canonicality: 'layered', facts: ['古代文本把 Tiamat 放在 Enūma Eliš 的原初海水与战争叙事中；多头西方龙形是 MythCanvas 的原创选择，不能伪装成唯一古代图像。'] },
  { slug: 'kingu', name: '金古', nameEn: 'Kingu / Qingu', role: 'Tiamat 阵营与命运泥板冲突中的角色', symbols: ['命运泥板', '军阵', '誓约'], characterType: 'deity', traditionTags: ['babylonian-theology', 'creation'], source: source('enumaElish', 'Tablets II–III, Kingu and Tablet of Destinies') },
  { slug: 'anunnaki', name: '阿努纳奇', nameEn: 'Anunnaki / Anunna', role: '多文本传统中的神祇集合称谓', symbols: ['神群', '神庭', '地上与地下秩序'], characterType: 'collective', traditionTags: ['divine-order', 'akkadian-bridge'], source: source('anAnum', 'Anunnaki / Anunna lexical and scholarly entries'), canonicality: 'layered', facts: ['Anunnaki / Anunna 的成员与功能随文本变化；本包不固定为七位成员。'] },
  { slug: 'igigi', name: '伊吉吉', nameEn: 'Igigi', role: '部分 Akkadian 文本中的神祇集合称谓', symbols: ['神群', '天界劳役', '神庭'], characterType: 'collective', traditionTags: ['akkadian-bridge', 'divine-order'], source: source('atrahasis', 'Tablet I, divine labour and Igigi passages'), canonicality: 'layered' },
  { slug: 'gilgamesh', name: '吉尔伽美什', nameEn: 'Gilgamesh', role: 'Uruk 王、英雄与不死追寻叙事的中心人物', symbols: ['Uruk 城墙', '王权', '远行'], characterType: 'hero', worldIds: ['world-mesopotamian-netherworld'], traditionTags: ['standard-gilgamesh', 'uruk-local', 'kingship'], source: source('gilgameshStandard', 'Tablet I, king and Uruk opening'), canonicality: 'literary', facts: ['Gilgamesh 的 Sumerian 诗歌、Old Babylonian 片段与 Standard Babylonian Epic 是不同文本 lane；本包以 hub 关联而非静默互补。'] },
  { slug: 'enkidu', name: '恩奇都', nameEn: 'Enkidu', role: 'Gilgamesh 的伙伴、荒野人物与死亡叙事的核心角色', symbols: ['荒野', '动物', '伙伴关系'], characterType: 'hero', worldIds: ['world-mesopotamian-netherworld'], traditionTags: ['standard-gilgamesh', 'uruk-local'], source: source('gilgameshStandard', 'Tablets I–VIII, Enkidu friendship and death') },
  { slug: 'ninsun', name: '宁松', nameEn: 'Ninsun', role: 'Gilgamesh 的母亲与解释梦境的神圣角色', symbols: ['母亲', '梦兆', '王权谱系'], characterType: 'deity', traditionTags: ['standard-gilgamesh', 'uruk-local'], source: source('gilgameshStandard', 'Tablet II, Ninsun dream interpretation') },
  { slug: 'utnapishtim', name: '乌特纳比什提姆', nameEn: 'Utnapištim / Utnapishtim', role: 'Standard Babylonian 洪水叙事中的幸存者与远居者', symbols: ['船', '洪水', '远方居所'], characterType: 'mortal', worldIds: ['world-mesopotamian-netherworld'], traditionTags: ['standard-gilgamesh', 'flood'], source: source('gilgameshStandard', 'Tablet XI, Utnapishtim flood account'), canonicality: 'literary' },
  { slug: 'ziusudra', name: '齐乌苏德拉', nameEn: 'Ziusudra', role: 'Sumerian 洪水故事中的幸存者与虔敬者', symbols: ['洪水', '船', '幸存'], characterType: 'mortal', traditionTags: ['sumerian-foundations', 'flood'], source: source('sumerianFlood', 'Flood Story, segment A and Ziusudra passages'), canonicality: 'literary' },
  { slug: 'atrahasis', name: '阿特拉哈西斯', nameEn: 'Atraḫasis / Atrahasis', role: 'Akkadian 洪水史诗中的智慧者与幸存者', symbols: ['智慧', '船', '洪水'], characterType: 'mortal', traditionTags: ['akkadian-bridge', 'flood'], source: source('atrahasis', 'Tablets I–III, creation, population and flood'), canonicality: 'literary' },
  { slug: 'adapa', name: '阿达帕', nameEn: 'Adapa', role: 'Akkadian 智者与死亡边界故事中的人物', symbols: ['智慧', '面包与水', 'Eridu'], characterType: 'mortal', traditionTags: ['akkadian-bridge', 'eridu-local'], source: source('adapa', 'Adapa encounter and food-of-life sequence'), canonicality: 'literary' },
  { slug: 'etana', name: '埃塔纳', nameEn: 'Etana', role: '王权继承与鹰之旅传说中的王', symbols: ['鹰', '王权', '高空旅程'], characterType: 'mortal', traditionTags: ['akkadian-bridge', 'kingship'], source: source('etana', 'Etana and the eagle succession quest'), canonicality: 'literary' },
  { slug: 'urshanabi', name: '乌尔珊纳比', nameEn: 'Uršanabi / Urshanabi', role: 'Standard Babylonian 远行与死亡之水渡者', symbols: ['渡船', '死亡之水', '边界'], characterType: 'mortal', worldIds: ['world-mesopotamian-netherworld'], traditionTags: ['standard-gilgamesh'], source: source('gilgameshStandard', 'Tablet X, Urshanabi and Waters of Death'), canonicality: 'literary' },
  { slug: 'siduri', name: '西杜里', nameEn: 'Siduri', role: 'Gilgamesh 远行中的酒馆主人与边界劝告者', symbols: ['酒馆', '海岸', '劝告'], characterType: 'mortal', traditionTags: ['standard-gilgamesh'], source: source('gilgameshStandard', 'Tablet X, Siduri shore encounter'), canonicality: 'literary' },
  { slug: 'humbaba', name: '洪巴巴', nameEn: 'Humbaba / Huwawa', role: '雪松森林守护者与英雄试炼中的敌手', symbols: ['雪松森林', '守护者', '恐怖面容'], characterType: 'monster', traditionTags: ['standard-gilgamesh', 'heroic-order'], source: source('gilgameshStandard', 'Tablet V, Cedar Forest and Humbaba'), canonicality: 'literary' },
  { slug: 'bull-of-heaven', name: '天之公牛', nameEn: 'Bull of Heaven', role: 'Inanna / Ishtar 与 Uruk 冲突叙事中的复合巨物', symbols: ['公牛', '天灾', 'Uruk'], characterType: 'monster', traditionTags: ['standard-gilgamesh', 'uruk-local', 'inanna-ishtar'], source: source('gilgameshStandard', 'Tablet VI, Ishtar and Bull of Heaven'), canonicality: 'literary' },
  { slug: 'anzu', name: '安祖', nameEn: 'Anzu / Imdugud', role: '窃取命运泥板并挑战神权秩序的巨鸟', symbols: ['巨鸟', '命运泥板', '山岳'], characterType: 'monster', traditionTags: ['akkadian-bridge', 'heroic-order'], source: source('anzu', 'Anzu theft of the Tablet of Destinies'), canonicality: 'literary' },
  { slug: 'asag', name: '阿萨格', nameEn: 'Asag', role: 'Lugal-e 中与山岳和疾病力量相连的敌对存在', symbols: ['山岳', '石头', '疾病'], characterType: 'monster', traditionTags: ['sumerian-foundations', 'heroic-order'], source: source('lugalE', 'Asag and Ninurta opening conflict'), canonicality: 'literary' },
  { slug: 'mushussu', name: '穆什胡什', nameEn: 'mušhuššu', role: 'Babylon 神圣建筑与砖饰语境中的复合生物', symbols: ['蛇龙复合形', '釉砖', 'Babylon'], characterType: 'creature', traditionTags: ['babylonian-theology', 'babylon-local'], source: source('iconography', 'Neo-Babylonian glazed-brick mušhuššu identification scope'), canonicality: 'layered' },
  { slug: 'ninshubur', name: '宁舒布尔', nameEn: 'Ninšubur / Ninshubur', role: 'Inanna 的使者与冥界叙事中的求援者', symbols: ['使者', '求援', '门外守候'], characterType: 'deity', traditionTags: ['sumerian-foundations', 'inanna-ishtar', 'underworld'], source: source('inannaDescent', 'Ninshubur waits and seeks aid') },
  { slug: 'geshtinanna', name: '盖什提南娜', nameEn: 'Geštinanna / Geshtinanna', role: 'Dumuzi 叙事中的梦境解释者与亲属', symbols: ['梦境', '葡萄藤', '哀悼'], characterType: 'deity', traditionTags: ['sumerian-foundations', 'underworld'], source: source('dumuziDream', 'Geshtinanna interprets Dumuzi dream') },
  { slug: 'namtar', name: '纳姆塔尔', nameEn: 'Namtar', role: '冥界执行者与命运 / 疾病语境中的神格', symbols: ['命令', '冥界使者', '命运'], characterType: 'deity', worldIds: ['world-mesopotamian-netherworld'], traditionTags: ['underworld'], source: source('inannaDescent', 'Namtar and underworld court passages') },
  { slug: 'aya', name: '阿雅', nameEn: 'Aya', role: 'Šamaš 传统中的配偶与晨光关联角色', symbols: ['晨光', '配偶', '太阳门'], characterType: 'deity', traditionTags: ['akkadian-bridge', 'divine-order'], source: source('anAnum', 'Aya and Šamaš lexical correspondence entries'), canonicality: 'layered' },
  { slug: 'shala', name: '沙拉', nameEn: 'Šala', role: '风暴神传统中的配偶与丰饶关联角色', symbols: ['雨', '谷物', '配偶'], characterType: 'deity', traditionTags: ['akkadian-bridge'], source: source('anAnum', 'Šala and storm-god correspondence entries'), canonicality: 'layered' },
  { slug: 'sarpanitum', name: '萨尔帕尼图姆', nameEn: 'Sarpanitum', role: 'Babylon 神学中的 Marduk 配偶', symbols: ['Babylon', '王权', '配偶'], characterType: 'deity', traditionTags: ['babylonian-theology', 'babylon-local'], source: source('anAnum', 'Sarpanitum and Marduk correspondence entries'), canonicality: 'layered' },
  { slug: 'nusku', name: '努斯库', nameEn: 'Nusku', role: '火、灯与神圣使者传统中的神格', symbols: ['灯火', '使者', '仪式'], characterType: 'deity', traditionTags: ['akkadian-bridge', 'divine-order'], source: source('anAnum', 'Nusku lexical and divine-list entries'), canonicality: 'layered' },
];

// This export is intentionally derived once from the stable seed table so IDs and slugs remain diffable.
export const mesopotamianCharacters: readonly Character[] = characterSeeds.map(makeCharacter);

export const mesopotamianWorlds: readonly World[] = [
  { id: 'world-mesopotamian-netherworld', mythologyId, slug: 'mesopotamian-netherworld', name: '两河冥界', nameEn: 'Mesopotamian Netherworld', summary: '一个由 Kur、Great Below、Irkalla 与 land of no return 等来源术语交叠而成的冥界空间层；不把单一词汇当作跨时期唯一地名。', canonicalDesign: { anchors: ['冥界王座', '七门', '尘土之地', '无返回之地'], signatureMaterials: ['深色泥砖', '石材', '铜', '低照度火光'], atmosphere: ['边界', '静默', '尘土', '来源限定的幽暗'] }, heroImage: prototypeImage },
  { id: 'world-abzu', mythologyId, slug: 'abzu', name: '阿布祖', nameEn: 'Abzu / Apsu freshwater domain', summary: '与地下淡水、Eridu 与 Enki / Ea 传统相连的宇宙域；Abzu 是 World，Apsu 则是 Enūma Eliš 中的 Character。', canonicalDesign: { anchors: ['地下淡水', '芦苇与水道', 'Eridu 神庙平台', '深水回响'], signatureMaterials: ['泥砖', '芦苇', '青铜', '河水青'], atmosphere: ['深水', '孕育', '古老城市边界'] }, heroImage: prototypeImage },
];

const scene = (slug: string, name: string, nameEn: string, summary: string, worldId?: string): Scene => ({ id: `scene-${slug}`, mythologyId, worldId, slug, name, nameEn, summary, canonicalDesign: { anchors: [name, '来源范围明确的两河空间', '不使用随机可读楔形文字'], atmosphere: ['泥砖赭', '河水青', '仪式性光线'] }, heroImage: { ...prototypeImage, alt: `${name}的美索不达米亚神话空间原型占位图` } });

export const mesopotamianScenes: readonly Scene[] = [
  scene('uruk-eanna', '乌鲁克与埃安娜', 'Uruk and Eanna', 'Inanna / Ishtar 的 Uruk 城市与神庙语境。', undefined),
  scene('eridu-e-abzu', '埃利都与埃阿布祖', 'Eridu and E-abzu', 'Enki / Ea、淡水与神庙城市的来源限定空间。', 'world-abzu'),
  scene('nippur-ekur', '尼普尔与埃库尔', 'Nippur and Ekur', 'Enlil 与 Nippur 神圣秩序的城市场景。', undefined),
  scene('ur-nanna-sanctuary', '乌尔的南纳圣所', 'Nanna Sanctuary at Ur', 'Nanna / Sin 地方崇拜与月神圣所语境。', undefined),
  scene('dilmun-sacred-landscape', '迪尔蒙圣地景观', 'Dilmun Sacred Landscape', 'Enki and Ninhursaga 中的清洁、无病与生命秩序景观。', undefined),
  scene('uruk-walls', '乌鲁克城墙', 'Walls of Uruk', 'Gilgamesh 叙事中的城市墙与王权可见性。', undefined),
  scene('cedar-forest', '雪松森林', 'Cedar Forest', 'Gilgamesh 与 Enkidu 远行及 Humbaba 守护的森林边界。', undefined),
  scene('humbaba-encounter', '洪巴巴相遇地', 'Humbaba Encounter', '英雄与森林守护者相遇的叙事战场。', undefined),
  scene('bull-of-heaven-uruk', '天之公牛袭击乌鲁克', 'Bull of Heaven at Uruk', 'Ishtar / Gilgamesh 叙事中的城市灾难场景。', undefined),
  scene('mount-mashu', '玛舒山', 'Mount Mashu', '太阳出入与英雄远行边界相连的山门空间。', undefined),
  scene('siduri-shore', '西杜里海岸', 'Siduri Shore', 'Gilgamesh 在远行中遇见 Siduri 的边界海岸。', undefined),
  scene('waters-of-death', '死亡之水', 'Waters of Death', '通往 Utnapishtim 远居之地的不可触碰水域。', 'world-mesopotamian-netherworld'),
  scene('utnapishtim-dwelling', '乌特纳比什提姆远居处', 'Utnapishtim’s Remote Dwelling', '洪水幸存者在远方生活的叙事终点。', undefined),
  scene('anzu-mountain', '安祖山域', 'Anzu Mountain', '巨鸟、命运泥板与神权争夺的山岳场景。', undefined),
  scene('babylon-sacred-precinct', '巴比伦神圣区', 'Babylon Sacred Precinct', 'Marduk 神学、城市王权与仪式中心的复合空间。', undefined),
  scene('esagil', '埃萨吉拉', 'Esagil', 'Babylon 神学中的 Marduk 神庙语境。', undefined),
  scene('etemenanki', '埃特曼南基', 'Etemenanki', '以建筑遗迹与城市神学为范围的 Babylon 场景，不作为所有两河神塔的模板。', undefined),
  scene('akitu-procession', '阿基图 procession 场景', 'Akitu Processional Context', '新年仪式、城市秩序与王权再确认的来源限定场景。', undefined),
  scene('tiamat-battlefield', '提阿马特战场', 'Tiamat Battlefield', 'Enūma Eliš 中 Marduk 与 Tiamat 决战的叙事空间。', 'world-abzu'),
  scene('seven-gates', '冥界七门', 'Seven Gates', 'Inanna / Ishtar 下行时逐门失去装饰与权力标记的边界。', 'world-mesopotamian-netherworld'),
  scene('ereshkigal-throne', '埃列什基伽尔王座厅', 'Ereshkigal’s Throne Hall', '冥界女王与法庭秩序的来源限定空间。', 'world-mesopotamian-netherworld'),
  scene('land-of-dust', '尘土之地', 'Land of Dust', '死者饮尘、失去地上身份的冥界意象。', 'world-mesopotamian-netherworld'),
  scene('dumuzi-seizure', '杜穆兹被带走', 'Dumuzi Seizure', 'Dumuzi 梦境、追捕与替代关系的哀悼场景。', 'world-mesopotamian-netherworld'),
  scene('assur-sacred-context', '阿舒尔神圣区', 'Assur Sacred Context', 'Assyrian state theology 与地方神庙语境。', undefined),
  scene('nineveh-ishtar-cult', '尼尼微伊什塔尔地方崇拜', 'Ishtar Cult at Nineveh', 'Ishtar of Nineveh 的 local-cult 解释空间。', undefined),
  scene('arbela-ishtar-cult', '阿尔贝拉伊什塔尔地方崇拜', 'Ishtar Cult at Arbela', 'Ishtar of Arbela 的 local-cult 解释空间。', undefined),
  scene('neo-assyrian-palace', '新亚述宫殿浮雕域', 'Neo-Assyrian Palace Relief Domain', '以物件、宫殿与浮雕识别范围为限的视觉领域。', undefined),
];

const taxonomy = (slug: string, name: string, nameEn: string, kind: TaxonomyTerm['kind'], displayOrder: number): TaxonomyTerm => ({ id: `taxonomy-mesopotamian-${slug}`, mythologyId, slug, kind, name, nameEn, summary: `${name}相关的美索不达米亚内容分组；具体叙事仍以 Story 与 sourceRef 为准。`, displayOrder });
export const mesopotamianTaxonomy: readonly TaxonomyTerm[] = [
  taxonomy('sumerian-foundations', 'Sumerian 基础', 'Sumerian Foundations', 'editorial-collection', 10),
  taxonomy('akkadian-bridge', 'Akkadian / Old Babylonian 桥接', 'Akkadian / Old Babylonian Bridge', 'editorial-collection', 20),
  taxonomy('babylonian-theology', 'Babylon 神学', 'Babylonian Theology', 'editorial-collection', 30),
  taxonomy('assyrian-bridge', 'Assyrian 桥接', 'Assyrian Bridge', 'editorial-collection', 40),
  taxonomy('inanna-ishtar', 'Inanna / Ishtar', 'Inanna / Ishtar', 'story-cycle', 50),
  taxonomy('flood', '人类与洪水', 'Humanity and Flood', 'story-cycle', 60),
  taxonomy('standard-gilgamesh', 'Standard Babylonian Gilgamesh', 'Standard Babylonian Gilgamesh', 'story-cycle', 70),
  taxonomy('underworld', '冥界与死亡秩序', 'Underworld and Death', 'story-cycle', 80),
  taxonomy('heroic-order', '英雄与秩序', 'Heroic Order', 'story-cycle', 90),
  taxonomy('creation', '创世与原初水', 'Creation and Primordial Waters', 'story-cycle', 100),
  taxonomy('divine-order', '神圣秩序', 'Divine Order', 'domain', 110),
  taxonomy('kingship', '王权神学', 'Kingship', 'domain', 120),
  taxonomy('writing', '书写与学术传统', 'Writing and Scribal Learning', 'domain', 130),
  taxonomy('uruk-local', 'Uruk 地方范围', 'Uruk Local Scope', 'lineage', 140),
  taxonomy('eridu-local', 'Eridu 地方范围', 'Eridu Local Scope', 'lineage', 150),
  taxonomy('nippur-local', 'Nippur 地方范围', 'Nippur Local Scope', 'lineage', 160),
  taxonomy('ur-local', 'Ur 地方范围', 'Ur Local Scope', 'lineage', 170),
  taxonomy('babylon-local', 'Babylon 地方范围', 'Babylon Local Scope', 'lineage', 180),
  taxonomy('assur-local', 'Assur 地方范围', 'Assur Local Scope', 'lineage', 190),
];

export const mesopotamianConcepts: readonly ContentConcept[] = [
  { id: 'concept-meso-me', mythologyId, slug: 'me', name: 'me：神圣职责与文明秩序', summary: '《Inanna and Enki》范围内与职责、制度和文明秩序相关的力量集合；不是无来源的魔法技能表。', sourceRefs: [source('inannaEnki', 'me list and transfer sequence')] },
  { id: 'concept-meso-netherworld-terms', mythologyId, slug: 'netherworld-terms', name: '冥界多重术语', summary: 'Kur、Great Below、Irkalla 与 land of no return 等术语的 source-scoped 解释概念，不指定跨时期唯一地名。', sourceRefs: [source('inannaDescent', 'netherworld terminology and gate sequence'), source('ishtarDescent', 'Akkadian descent terminology')] },
  { id: 'concept-meso-flood-comparison', mythologyId, slug: 'flood-hero-comparison', name: '洪水英雄文本比较', summary: 'Ziusudra、Atrahasis 与 Utnapishtim 的现代文献比较层；不生成同一人物 alias 或 genealogy edge。', sourceRefs: [source('sumerianFlood', 'Ziusudra flood witness'), source('atrahasis', 'Atrahasis flood'), source('gilgameshStandard', 'Tablet XI Utnapishtim')] },
  { id: 'concept-meso-babylon-elevation', mythologyId, slug: 'babylon-theological-elevation', name: 'Babylon 神学提升', summary: 'Marduk、Babylon、Esagil 与宇宙秩序的 Babylon-centered 叙事关系。', sourceRefs: [source('enumaElish', 'Tablets VI–VII, Marduk names and Babylon theological elevation')] },
  { id: 'concept-meso-local-ishtar', mythologyId, slug: 'local-ishtar-manifestations', name: '地方 Ishtar manifestation', summary: 'Nineveh、Arbela 与 Uruk 的 Ishtar 表现保留地方范围，不把地方崇拜覆盖为单一图像。', sourceRefs: [source('assyrianCult', 'Nineveh and Arbela Ishtar local-cult scope'), source('iconography', 'object-specific Ishtar identification')] },
];

const relation = (id: string, from: string, to: string, relationType: string, ref: SourceRef, traditionScope: string, isDefault = true, confidence: CharacterRelation['confidence'] = 'high'): CharacterRelation => ({ id, fromCharacterId: characterId(from), toCharacterId: characterId(to), relationType, assertionKey: `${characterId(from)}|${characterId(to)}|${relationType}`, traditionScope, isDefault, sourceRefs: [ref], confidence });
const conceptRelation = (id: string, from: string, toConceptId: string, relationType: string, ref: SourceRef, traditionScope: string, confidence: CharacterRelation['confidence'] = 'medium'): CharacterRelation => ({ id, fromCharacterId: characterId(from), toConceptId, relationType, assertionKey: `${characterId(from)}|${toConceptId}|${relationType}`, traditionScope, isDefault: false, sourceRefs: [ref], confidence });

export const mesopotamianRelations: readonly CharacterRelation[] = [
  relation('meso-parent-an-enlil', 'an-anu', 'enlil', 'parent', source('enkiWorldOrder', 'An and Enlil authority sequence'), 'Sumerian divine-order tradition'),
  relation('meso-parent-an-enki', 'an-anu', 'enki-ea', 'parent', source('enkiWorldOrder', 'An and Enki authority sequence'), 'Sumerian divine-order tradition'),
  relation('meso-consort-enlil-ninlil', 'enlil', 'ninlil', 'consort', source('enlilNinlil', 'Enlil and Ninlil relationship'), 'Sumerian Enlil and Ninlil'),
  relation('meso-parent-enlil-nanna', 'enlil', 'nanna-sin', 'parent', source('enlilNinlil', 'Nanna birth and naming sequence'), 'Sumerian Enlil and Ninlil'),
  relation('meso-parent-nanna-utu', 'nanna-sin', 'utu-shamash', 'parent', source('enkiWorldOrder', 'Nanna and Utu office correspondence'), 'Sumerian divine-order tradition'),
  relation('meso-parent-nanna-inanna', 'nanna-sin', 'inanna-ishtar', 'parent', source('enkiWorldOrder', 'Nanna and Inanna office correspondence'), 'Sumerian divine-order tradition', false, 'medium'),
  relation('meso-consort-inanna-dumuzi', 'inanna-ishtar', 'dumuzi-tammuz', 'consort', source('dumuziDream', 'Dumuzi and Inanna relationship'), 'Sumerian Dumuzi tradition'),
  relation('meso-consort-nergal-ereshkigal', 'nergal', 'ereshkigal', 'consort', source('nergalEreshkigal', 'later version marriage resolution'), 'Akkadian underworld tradition', false, 'medium'),
  relation('meso-ally-inanna-ninshubur', 'inanna-ishtar', 'ninshubur', 'ally', source('inannaDescent', 'Ninshubur seeks aid for Inanna'), 'Sumerian Inanna descent'),
  relation('meso-aids-enki-inanna', 'enki-ea', 'inanna-ishtar', 'aids', source('inannaDescent', 'Enki creates rescuers and restores Inanna'), 'Sumerian Inanna descent', false),
  relation('meso-parent-ninsun-gilgamesh', 'ninsun', 'gilgamesh', 'parent', source('gilgameshStandard', 'Tablet I–II, Ninsun and Gilgamesh'), 'Standard Babylonian Gilgamesh'),
  relation('meso-companion-gilgamesh-enkidu', 'gilgamesh', 'enkidu', 'companion', source('gilgameshStandard', 'Tablets I–II, meeting and friendship'), 'Standard Babylonian Gilgamesh'),
  relation('meso-defeats-gilgamesh-humbaba', 'gilgamesh', 'humbaba', 'defeats', source('gilgameshStandard', 'Tablet V, Cedar Forest battle'), 'Standard Babylonian Gilgamesh'),
  relation('meso-defeats-gilgamesh-bull', 'gilgamesh', 'bull-of-heaven', 'defeats', source('gilgameshStandard', 'Tablet VI, Bull of Heaven battle'), 'Standard Babylonian Gilgamesh'),
  relation('meso-defeats-ninurta-asag', 'ninurta', 'asag', 'defeats', source('lugalE', 'Ninurta defeats Asag'), 'Sumerian Lugal-e'),
  relation('meso-defeats-ninurta-anzu', 'ninurta', 'anzu', 'defeats', source('anzu', 'Anzu and champion victory sequence'), 'Akkadian Anzu tradition'),
  relation('meso-enemy-marduk-tiamat', 'marduk', 'tiamat', 'enemy', source('enumaElish', 'Tablets II–IV, Marduk and Tiamat conflict'), 'Babylonian Enūma Eliš'),
  relation('meso-defeats-marduk-tiamat', 'marduk', 'tiamat', 'defeats', source('enumaElish', 'Tablet V, Marduk defeats Tiamat'), 'Babylonian Enūma Eliš', false),
  relation('meso-consort-apsu-tiamat', 'apsu-enuma-elish', 'tiamat', 'consort', source('enumaElish', 'Tablet I, Apsu and Tiamat opening'), 'Babylonian Enūma Eliš'),
  relation('meso-ally-tiamat-kingu', 'tiamat', 'kingu', 'ally', source('enumaElish', 'Tablets II–III, Tiamat and Kingu'), 'Babylonian Enūma Eliš'),
  relation('meso-serves-ninshubur-inanna', 'ninshubur', 'inanna-ishtar', 'serves', source('inannaDescent', 'Ninshubur as Inanna attendant'), 'Sumerian Inanna descent', false, 'medium'),
  relation('meso-associated-dumuzi-geshtinanna', 'dumuzi-tammuz', 'geshtinanna', 'associated-with', source('dumuziDream', 'Dumuzi and Geshtinanna kinship / dream'), 'Sumerian Dumuzi tradition'),
  relation('meso-rules-ereshkigal-netherworld', 'ereshkigal', 'namtar', 'rules-over', source('inannaDescent', 'Ereškigal and Namtar court sequence'), 'Sumerian Inanna descent'),
  relation('meso-associated-marduk-sarpanitum', 'marduk', 'sarpanitum', 'associated-with', source('anAnum', 'Marduk and Sarpanitum correspondence'), 'Babylonian theological list tradition'),
  relation('meso-associated-ashur-marduk', 'ashur', 'marduk', 'associated-with', source('assyrianCult', 'Assyrian reuse and adaptation of Babylonian theological language'), 'Neo-Assyrian theological adaptation', false, 'contested'),
  conceptRelation('meso-concept-enki-abzu', 'enki-ea', 'concept-meso-netherworld-terms', 'associated-with', source('enkiWorldOrder', 'Enki and deep-water terminology'), 'Sumerian / Akkadian freshwater cosmology'),
  conceptRelation('meso-concept-flood-ziusudra', 'ziusudra', 'concept-meso-flood-comparison', 'associated-with', source('sumerianFlood', 'Ziusudra flood witness'), 'Modern editorial comparison layer', 'contested'),
  conceptRelation('meso-concept-flood-atrahasis', 'atrahasis', 'concept-meso-flood-comparison', 'associated-with', source('atrahasis', 'Atrahasis flood witness'), 'Modern editorial comparison layer', 'contested'),
  conceptRelation('meso-concept-flood-utnapishtim', 'utnapishtim', 'concept-meso-flood-comparison', 'associated-with', source('gilgameshStandard', 'Tablet XI Utnapishtim flood witness'), 'Modern editorial comparison layer', 'contested'),
  conceptRelation('meso-concept-marduk-babylon', 'marduk', 'concept-meso-babylon-elevation', 'rules-over', source('enumaElish', 'Tablets VI–VII, Babylon elevation'), 'Babylonian theological composition'),
];
