import type { Character, CharacterRelation, Scene, TaxonomyTerm, World } from '../../lib/content/types';

const mythologyId = 'myth-greek';
const olympusImage = {
  src: '/media/content/greek-olympus-v2.webp',
  alt: '晨光下的奥林匹斯白色大理石议庭、山巅与云海',
  width: 1672,
  height: 941,
};

type CharacterSeed = readonly [
  slug: string,
  name: string,
  nameEn: string,
  role: string,
  symbols: readonly string[],
  characterType: NonNullable<Character['characterType']>,
  traditionTags: readonly string[],
];

const identitySource = (slug: string, tags: readonly string[]) => {
  if (slug === 'pandora') return { type: 'primary-text' as const, title: 'Hesiod, Works and Days', locator: '42–105', language: 'grc' };
  if (slug === 'orpheus' || slug === 'eurydice' || slug === 'daedalus' || slug === 'icarus' || slug === 'atalanta') return { type: 'literature' as const, title: 'Ovid, Metamorphoses', locator: '按人物相关卷', language: 'la', note: '采用罗马诗歌中影响深远的叙事层；不将其误写为唯一的早期希腊版本。' };
  if (slug === 'bellerophon' || slug === 'chimera') return { type: 'primary-text' as const, title: 'Homer, Iliad', locator: '6.155–203', language: 'grc' };
  if (tags.includes('odyssey')) return { type: 'primary-text' as const, title: 'Homer, Odyssey', locator: '按人物相关卷', language: 'grc' };
  if (tags.includes('trojan')) return { type: 'primary-text' as const, title: 'Homer, Iliad', locator: '按人物相关卷', language: 'grc' };
  if (tags.includes('argonaut')) return { type: 'primary-text' as const, title: 'Apollonius Rhodius, Argonautica', locator: '按人物相关卷', language: 'grc' };
  if (tags.includes('theban-cycle')) return { type: 'primary-text' as const, title: 'Sophocles, Oedipus Tyrannus', locator: '按人物相关段落', language: 'grc' };
  if (tags.includes('heracles-cycle') || tags.includes('theseus-cycle') || tags.includes('perseus-cycle')) return { type: 'literature' as const, title: 'Pseudo-Apollodorus, Bibliotheca', locator: '按人物相关卷章', language: 'grc', note: '古代神话整理材料；需与更早文本的版本范围区分。' };
  return { type: 'primary-text' as const, title: 'Hesiod, Theogony', locator: '按人物相关诗行', language: 'grc' };
};

const character = ([slug, name, nameEn, role, symbols, characterType, traditionTags]: CharacterSeed): Character => ({
  id: `character-${slug}`,
  mythologyId,
  worldIds: traditionTags.includes('chthonic')
    ? ['world-underworld']
    : traditionTags.includes('sea-deity') || traditionTags.includes('odyssey')
      ? ['world-sea-realm']
      : characterType === 'deity' && (traditionTags.includes('olympian') || traditionTags.includes('olympian-generation'))
        ? ['world-olympus']
        : [],
  slug,
  name,
  nameEn,
  role,
  summary: `${name}是希腊神话主干叙事中的${role}。本页以来源可追溯的身份、关系与 MythCanvas 原创视觉锚点呈现。`,
  symbols,
  characterType,
  traditionTags,
  sourcePeriods: ['古希腊与后世接受传统'],
  sourceRefs: [identitySource(slug, traditionTags)],
  canonicality: 'primary',
  canonicalDesign: {
    anchors: [...symbols.slice(0, 3), `${name}的${role}身份`],
    mythologicalFacts: [`${name}在希腊神话主干叙事中的身份为${role}。`],
    originalDesignChoices: ['采用 MythCanvas 原创、节制的古希腊材质与轮廓语言；不复制现代商业改编设计。'],
    avoid: ['现代商业作品的特定角色设计', '泛中世纪盔甲或不具来源依据的符号堆叠'],
    canonicalPrompt: `Depict ${nameEn} as an original MythCanvas Greek mythology figure. Preserve ${symbols.slice(0, 3).join(', ')} and the stable role of ${role}. Use grounded Greek materials and avoid modern franchise-specific designs.`,
  },
});

const seeds: readonly CharacterSeed[] = [
  ['chaos', '卡俄斯', 'Chaos', '原初的混沌与开端', ['深渊', '无形空间', '原初黑暗'], 'deity', ['primordial']],
  ['gaia', '盖亚', 'Gaia', '大地母神', ['大地', '岩层', '丰饶植被'], 'deity', ['primordial', 'earth-deity']],
  ['uranus', '乌拉诺斯', 'Uranus', '天空之神', ['星空', '穹顶', '镰刀伤痕'], 'deity', ['primordial', 'sky-deity']],
  ['tartarus', '塔耳塔罗斯', 'Tartarus', '原初深渊与囚禁之地的神格', ['深渊', '黑石', '锁链'], 'deity', ['primordial', 'chthonic']],
  ['nyx', '倪克斯', 'Nyx', '夜之女神', ['夜幕', '星群', '黑色帷幕'], 'deity', ['primordial', 'night-deity']],
  ['eros', '厄洛斯', 'Eros', '爱欲的原初力量与后世爱神', ['翅翼', '弓箭', '花冠'], 'deity', ['primordial', 'olympian-generation']],
  ['cronus', '克洛诺斯', 'Cronus', '泰坦之王', ['收割镰', '石座', '时间的阴影'], 'deity', ['titan']],
  ['rhea', '瑞亚', 'Rhea', '泰坦母神', ['王冠', '山狮', '鼓'], 'deity', ['titan']],
  ['typhon', '堤丰', 'Typhon', '挑战宙斯秩序的怪物', ['风暴', '蛇形肢体', '火山烟云'], 'monster', ['chthonic']],
  ['prometheus', '普罗米修斯', 'Prometheus', '带给人类火种的泰坦', ['火种', '岩石', '鹰'], 'deity', ['titan', 'gods-and-mortals']],
  ['atlas', '阿特拉斯', 'Atlas', '承担天穹的泰坦', ['天穹', '巨岩', '星图'], 'deity', ['titan']],
  ['pandora', '潘多拉', 'Pandora', '与匣和人间苦难叙事相连的女性', ['封口匣', '陶罐', '希望'], 'mortal', ['gods-and-mortals']],
  ['metis', '墨提斯', 'Metis', '智慧与谋略的女神', ['水纹', '猫头鹰纹样', '智慧之光'], 'deity', ['titan', 'wisdom']],
  ['zeus', '宙斯', 'Zeus', '众神之王与天空雷霆之神', ['雷霆', '鹰', '权杖'], 'deity', ['olympian', 'sky-deity']],
  ['hera', '赫拉', 'Hera', '婚姻与王权女神', ['孔雀', '王冠', '权杖'], 'deity', ['olympian']],
  ['poseidon', '波塞冬', 'Poseidon', '海洋与地震之神', ['三叉戟', '海浪', '马'], 'deity', ['olympian', 'sea-deity']],
  ['hades', '哈迪斯', 'Hades', '冥界之王', ['双叉杖', '冥界王冠', '刻耳柏洛斯'], 'deity', ['olympian-generation', 'chthonic']],
  ['demeter', '得墨忒耳', 'Demeter', '谷物与丰饶女神', ['麦穗', '火炬', '石榴'], 'deity', ['olympian', 'earth-deity']],
  ['hestia', '赫斯提亚', 'Hestia', '炉火与家宅女神', ['炉火', '圆形祭坛', '面纱'], 'deity', ['olympian']],
  ['athena', '雅典娜', 'Athena', '智慧、城邦与战略战争女神', ['长矛', '埃癸斯盾', '猫头鹰'], 'deity', ['olympian', 'wisdom']],
  ['apollo', '阿波罗', 'Apollo', '预言、音乐、弓术与疗愈之神', ['里拉琴', '月桂', '金弓'], 'deity', ['olympian', 'delphi']],
  ['artemis', '阿耳忒弥斯', 'Artemis', '狩猎、荒野与野生动物女神', ['弓箭', '鹿', '猎犬'], 'deity', ['olympian', 'nature-deity']],
  ['aphrodite', '阿佛洛狄忒', 'Aphrodite', '爱与美之女神', ['海沫', '海贝', '鸽子'], 'deity', ['olympian']],
  ['ares', '阿瑞斯', 'Ares', '战场冲突之神', ['长矛', '头盔', '战盾'], 'deity', ['olympian']],
  ['hermes', '赫尔墨斯', 'Hermes', '神使、旅行与边界之神', ['双蛇杖', '旅行杖', '翼鞋'], 'deity', ['olympian']],
  ['dionysus', '狄俄尼索斯', 'Dionysus', '酒、戏剧与仪式狂喜之神', ['葡萄藤', '酒杯', '杖'], 'deity', ['olympian-generation']],
  ['hephaestus', '赫淮斯托斯', 'Hephaestus', '锻炉与技艺之神', ['铁砧', '锤', '炉火'], 'deity', ['olympian']],
  ['heracles', '赫拉克勒斯', 'Heracles', '以十二伟业闻名的英雄', ['狮皮', '木棒', '弓'], 'hero', ['heracles-cycle', 'hero-age']],
  ['leto', '勒托', 'Leto', '阿波罗与阿耳忒弥斯之母', ['棕榈', '面纱', '双生象征'], 'deity', ['titan']],
  ['python', '皮同', 'Python', '德尔斐的蛇形守护怪物', ['巨蛇', '裂岩', '神谕泉'], 'monster', ['delphi']],
  ['maia', '迈亚', 'Maia', '赫尔墨斯之母', ['山洞', '北斗', '婴儿襁褓'], 'deity', ['titan']],
  ['semele', '塞墨勒', 'Semele', '狄俄尼索斯之母', ['雷光', '葡萄藤', '王冠'], 'mortal', ['theban-cycle']],
  ['persephone', '珀耳塞福涅', 'Persephone', '冥界王后与得墨忒耳之女', ['石榴', '火炬', '春芽'], 'deity', ['chthonic', 'olympian-generation']],
  ['perseus', '珀尔修斯', 'Perseus', '斩杀美杜莎的英雄', ['弯刀', '镜盾', '飞翼凉鞋'], 'hero', ['perseus-cycle']],
  ['medusa', '美杜莎', 'Medusa', '戈耳工之一', ['蛇发', '石化凝视', '青铜盾面'], 'monster', ['gorgon', 'perseus-cycle']],
  ['hydra', '许德拉', 'Hydra', '勒拿水蛇怪', ['多首蛇躯', '沼泽', '火焰'], 'monster', ['heracles-cycle']],
  ['cerberus', '刻耳柏洛斯', 'Cerberus', '冥界之门的守卫犬', ['多首猎犬', '锁链', '冥界门'], 'creature', ['chthonic', 'heracles-cycle']],
  ['theseus', '忒修斯', 'Theseus', '克里特迷宫中的英雄', ['线团', '短剑', '船帆'], 'hero', ['theseus-cycle']],
  ['minotaur', '米诺陶洛斯', 'Minotaur', '克里特迷宫中的牛首怪物', ['牛角', '迷宫', '石门'], 'monster', ['theseus-cycle']],
  ['ariadne', '阿里阿德涅', 'Ariadne', '引导忒修斯走出迷宫的克里特公主', ['线团', '冠冕', '迷宫门'], 'mortal', ['theseus-cycle']],
  ['jason', '伊阿宋', 'Jason', '寻找金羊毛的阿尔戈英雄', ['金羊毛', '长船', '长矛'], 'hero', ['argonaut']],
  ['medea', '美狄亚', 'Medea', '与金羊毛叙事相连的科尔喀斯公主', ['药草', '火炬', '金羊毛'], 'mortal', ['argonaut']],
  ['orpheus', '俄耳甫斯', 'Orpheus', '进入冥界寻回欧律狄刻的诗人与乐师', ['七弦琴', '冥河', '回望'], 'hero', ['hero-age']],
  ['eurydice', '欧律狄刻', 'Eurydice', '俄耳甫斯所寻回的亡者', ['冥河薄雾', '白花', '回望'], 'mortal', ['hero-age']],
  ['bellerophon', '柏勒洛丰', 'Bellerophon', '驾驭珀伽索斯挑战奇美拉的英雄', ['长矛', '飞马', '山崖'], 'hero', ['hero-age']],
  ['chimera', '奇美拉', 'Chimera', '狮、羊与蛇混合的喷火怪物', ['狮首', '羊身', '火焰'], 'monster', ['hero-age']],
  ['pegasus', '珀伽索斯', 'Pegasus', '有翼天马', ['羽翼', '白马', '山泉'], 'creature', ['perseus-cycle', 'hero-age']],
  ['daedalus', '代达罗斯', 'Daedalus', '迷宫与飞行装置的工匠', ['蜡翼', '木工工具', '迷宫图'], 'mortal', ['theseus-cycle']],
  ['icarus', '伊卡洛斯', 'Icarus', '因飞近太阳坠海的少年', ['蜡翼', '太阳', '海面'], 'mortal', ['hero-age']],
  ['atalanta', '阿塔兰忒', 'Atalanta', '以奔跑与狩猎闻名的英雄女性', ['弓箭', '金苹果', '野猪'], 'hero', ['hero-age']],
  ['oedipus', '俄狄浦斯', 'Oedipus', '底比斯命运叙事中的王', ['十字路口', '王冠', '谜题'], 'mortal', ['theban-cycle']],
  ['sphinx', '斯芬克斯', 'Sphinx', '以谜语封锁底比斯的怪物', ['狮身', '翼', '石阶'], 'monster', ['theban-cycle']],
  ['paris', '帕里斯', 'Paris', '作出三女神裁决的特洛伊王子', ['金苹果', '牧杖', '山谷'], 'mortal', ['trojan']],
  ['helen', '海伦', 'Helen', '特洛伊战争核心人物之一', ['天鹅', '面纱', '斯巴达王冠'], 'mortal', ['trojan']],
  ['menelaus', '墨涅拉俄斯', 'Menelaus', '斯巴达王与希腊联军成员', ['船舰', '王冠', '长矛'], 'mortal', ['trojan']],
  ['agamemnon', '阿伽门农', 'Agamemnon', '希腊联军统帅', ['权杖', '战船', '王冠'], 'mortal', ['trojan']],
  ['achilles', '阿喀琉斯', 'Achilles', '《伊利亚特》的核心英雄', ['长矛', '盾牌', '战车'], 'hero', ['trojan']],
  ['patroclus', '帕特罗克洛斯', 'Patroclus', '阿喀琉斯的亲密战友', ['盔甲', '战车', '长矛'], 'hero', ['trojan']],
  ['hector', '赫克托耳', 'Hector', '特洛伊守城英雄', ['城墙', '头盔', '长矛'], 'hero', ['trojan']],
  ['priam', '普里阿摩斯', 'Priam', '特洛伊王', ['王冠', '城门', '赎礼'], 'mortal', ['trojan']],
  ['odysseus', '奥德修斯', 'Odysseus', '以谋略和归乡闻名的英雄', ['船帆', '弓', '橄榄木床'], 'hero', ['trojan', 'odyssey']],
  ['polyphemus', '波吕斐摩斯', 'Polyphemus', '独眼巨人', ['独眼', '洞穴', '巨石'], 'monster', ['odyssey', 'sea-deity']],
  ['circe', '喀耳刻', 'Circe', '使旅行者变形的女巫', ['药草', '杯盏', '狮兽'], 'deity', ['odyssey']],
  ['sirens', '塞壬', 'Sirens', '以歌声引诱航海者的群体', ['歌声', '海崖', '船桅'], 'collective', ['odyssey', 'sea-deity']],
  ['calypso', '卡吕普索', 'Calypso', '留住奥德修斯的海岛女神', ['海岛洞穴', '织机', '柏树'], 'deity', ['odyssey', 'sea-deity']],
  ['penelope', '佩涅洛佩', 'Penelope', '伊萨卡王后', ['织机', '弓', '宫殿灯火'], 'mortal', ['odyssey']],
  ['telemachus', '忒勒马科斯', 'Telemachus', '奥德修斯之子', ['船帆', '长矛', '伊萨卡宫门'], 'mortal', ['odyssey']],
];

export const greekCharacters = seeds.map(character);

export const greekWorlds: readonly World[] = [
  {
    id: 'world-olympus', mythologyId, slug: 'olympus', name: '奥林匹斯', nameEn: 'Olympus',
    summary: '诸神在高山、云层与开放议庭之间维持秩序的神域。',
    canonicalDesign: { anchors: ['白色柱廊', '高山云层', '开放神圣议庭'], signatureMaterials: ['大理石', '青铜', '亚麻织物'] }, heroImage: olympusImage,
    heroImageMobile: { src: '/media/content/greek-olympus-mobile-v1.webp', alt: '竖幅晨光下的奥林匹斯白色大理石议庭、云海与神圣阶梯', width: 941, height: 1672 },
  },
  {
    id: 'world-underworld', mythologyId, slug: 'underworld', name: '冥界', nameEn: 'Underworld',
    summary: '亡者渡河、王权与静默并存的地下神域；它不是通俗的火焰地狱。',
    canonicalDesign: { anchors: ['冥河', '黑石宫门', '柏树与火炬'], signatureMaterials: ['黑石', '陈年青铜', '火山岩'] }, heroImage: { src: '/media/content/greek-underworld-v1.webp', alt: '月光下的冥河、黑石宫门与柏树构成的希腊冥界神域', width: 1672, height: 941 }, heroImageMobile: { src: '/media/content/greek-underworld-mobile-v1.webp', alt: '冥河通向黑石宫门、柏树与月色构成的竖幅希腊冥界神域', width: 941, height: 1672 },
  },
  {
    id: 'world-tartarus', mythologyId, slug: 'tartarus', name: '塔耳塔罗斯', nameEn: 'Tartarus',
    summary: '作为原初深渊和囚禁之地的独立空间层，不与冥界一般亡者区域混为一谈。',
    canonicalDesign: { anchors: ['无底深渊', '巨型锁链', '黑色岩层'], signatureMaterials: ['玄武岩', '铁', '灰烬'] }, heroImage: { src: '/media/content/greek-tartarus-v1.webp', alt: '无底黑岩深渊、远处门廊与巨型锁链构成的塔耳塔罗斯', width: 1672, height: 941 }, heroImageMobile: { src: '/media/content/greek-tartarus-mobile-v1.webp', alt: '竖幅玄武岩深渊、巨型锁链与封闭石门构成的塔耳塔罗斯', width: 941, height: 1672 },
  },
  {
    id: 'world-sea-realm', mythologyId, slug: 'sea-realm', name: '海洋神域', nameEn: 'Sea Realm',
    summary: '从爱琴海悬崖、海底宫殿到远航海域的广阔元素空间。',
    canonicalDesign: { anchors: ['爱琴海浪潮', '海蚀石灰岩', '三叉戟与马'], signatureMaterials: ['湿石', '青铜', '海沫'] }, heroImage: { src: '/media/content/greek-sea-realm-v1.webp', alt: '爱琴海浪潮、石灰岩悬崖与海岸神庙构成的古希腊海洋神域', width: 1672, height: 941 }, heroImageMobile: { src: '/media/content/greek-sea-realm-mobile-v1.webp', alt: '竖幅爱琴海石灰岩悬崖、海岸神庙与三叉戟石刻构成的海洋神域', width: 941, height: 1672 },
  },
];

const scene = (slug: string, name: string, nameEn: string, summary: string, worldId?: string): Scene => ({
  id: `scene-${slug}`, mythologyId, worldId, slug, name, nameEn, summary,
  canonicalDesign: { anchors: [name, '古希腊空间结构', '故事可复用视觉地标'] },
  heroImage: { ...olympusImage, alt: `${name}的 MythCanvas 希腊神话场景` },
});

export const greekScenes: readonly Scene[] = [
  scene('court-of-gods', '诸神议庭', 'Court of the Gods', '诸神在开放柱廊与天光之间议事的奥林匹斯核心场景。', 'world-olympus'),
  scene('throne-of-zeus', '宙斯王座', 'Throne of Zeus', '雷云与权杖环绕的神王秩序中心。', 'world-olympus'),
  scene('forge-of-hephaestus', '赫淮斯托斯神炉', 'Forge of Hephaestus', '青铜、火焰与锻造技艺交汇的神圣工坊。', 'world-olympus'),
  scene('gate-of-hades', '冥界之门', 'Gate of Hades', '亡者进入冥界前经过的黑石门与火炬通道。', 'world-underworld'),
  scene('river-styx', '冥河斯堤克斯', 'River Styx', '连接生者与亡者世界的黑水河流。', 'world-underworld'),
  scene('palace-of-hades', '冥王宫', 'Palace of Hades', '哈迪斯与珀耳塞福涅统治的地下王庭。', 'world-underworld'),
  scene('asphodel-fields', '幽魂原野', 'Asphodel Fields', '冥界中供普通亡者停留的辽阔灰白原野。', 'world-underworld'),
  scene('elysium', '极乐原', 'Elysium', '与英雄和福者相关的宁静冥界区域。', 'world-underworld'),
  scene('delphi', '德尔斐', 'Delphi', '山坡、神谕泉与阿波罗圣所构成的神圣地点。'),
  scene('delos', '提洛岛', 'Delos', '阿波罗与阿耳忒弥斯出生传统关联的海岛。', 'world-sea-realm'),
  scene('eleusis', '厄琉息斯', 'Eleusis', '得墨忒耳与珀耳塞福涅传统的重要祭仪地点。'),
  scene('athens-acropolis', '雅典卫城', 'Athens Acropolis', '城邦、雅典娜守护与石砌高地相连的地标。'),
  scene('cretan-labyrinth', '克里特迷宫', 'Cretan Labyrinth', '米诺陶洛斯被囚禁、线团引路的地下迷宫。'),
  scene('nemea', '涅墨亚', 'Nemea', '赫拉克勒斯面对狮子的山谷。'),
  scene('thebes', '底比斯', 'Thebes', '俄狄浦斯与斯芬克斯谜题发生的城邦。'),
  scene('troy', '特洛伊', 'Troy', '城墙、海岸与长期围城构成的战争核心地点。'),
  scene('ithaca', '伊萨卡', 'Ithaca', '奥德修斯归乡、家宅与王权恢复的岛屿。', 'world-sea-realm'),
  scene('colchis', '科尔喀斯', 'Colchis', '金羊毛与远方航海叙事关联的边境王国。'),
  scene('mount-ida', '伊达山', 'Mount Ida', '帕里斯裁决与特洛伊前史关联的山地。'),
  scene('prometheus-rock', '普罗米修斯之岩', 'Prometheus Rock', '火种故事中惩罚与坚忍的高山场景。'),
  scene('cave-of-polyphemus', '波吕斐摩斯洞穴', 'Cave of Polyphemus', '独眼巨人、巨石门与海岛囚困感并存的洞穴。', 'world-sea-realm'),
];

type TaxonomySeed = readonly [string, string, string, TaxonomyTerm['kind'], number];

const taxonomySeeds: readonly TaxonomySeed[] = [
  ['primordial', '原初神', 'Primordial', 'lineage', 10], ['titan', '泰坦神族', 'Titans', 'lineage', 20], ['olympian', '奥林匹斯诸神', 'Olympians', 'lineage', 30],
  ['chthonic', '冥界与地下', 'Chthonic', 'domain', 40], ['sea-deity', '海洋与航海', 'Sea and voyage', 'domain', 50], ['hero-age', '英雄时代', 'Heroic age', 'editorial-collection', 60],
  ['perseus-cycle', '珀尔修斯周期', 'Perseus cycle', 'story-cycle', 70], ['heracles-cycle', '赫拉克勒斯周期', 'Heracles cycle', 'story-cycle', 80],
  ['theseus-cycle', '忒修斯周期', 'Theseus cycle', 'story-cycle', 90], ['argonaut', '阿尔戈英雄', 'Argonauts', 'story-cycle', 100],
  ['theban-cycle', '底比斯周期', 'Theban cycle', 'story-cycle', 110], ['trojan', '特洛伊周期', 'Trojan cycle', 'story-cycle', 120], ['odyssey', '奥德赛', 'Odyssey', 'story-cycle', 130],
  ['earth-deity', '大地神祇', 'Earth deities', 'domain', 140], ['sky-deity', '天空神祇', 'Sky deities', 'domain', 150], ['night-deity', '夜与黑暗', 'Night deities', 'domain', 160],
  ['olympian-generation', '奥林匹斯后代', 'Olympian generation', 'lineage', 170], ['gods-and-mortals', '诸神与凡人', 'Gods and mortals', 'editorial-collection', 180],
  ['wisdom', '智慧与谋略', 'Wisdom', 'domain', 190], ['delphi', '德尔斐传统', 'Delphi tradition', 'story-cycle', 200], ['nature-deity', '荒野与自然', 'Nature deities', 'domain', 210], ['gorgon', '戈耳工传统', 'Gorgon tradition', 'story-cycle', 220],
];

export const greekTaxonomy: readonly TaxonomyTerm[] = taxonomySeeds.map(([slug, name, nameEn, kind, displayOrder]) => ({
  id: `taxonomy-greek-${slug}`,
  mythologyId,
  slug,
  name,
  nameEn,
  kind,
  summary: `${name}是希腊神话阅读与浏览使用的策展分类，不替代角色实体类型。`,
  displayOrder,
}));

type RelationSource = string | { title: string; locator: string; type?: 'primary-text' | 'literature'; language?: string };
const relation = (id: string, fromCharacterId: string, toCharacterId: string, relationType: string, source: RelationSource, traditionScope = 'Greek classical tradition'): CharacterRelation => ({
  id, fromCharacterId, toCharacterId, relationType, assertionKey: `${relationType}:${[fromCharacterId, toCharacterId].sort().join(':')}`,
  traditionScope, isDefault: true, confidence: 'high',
  sourceRefs: [typeof source === 'string'
    ? { type: 'primary-text', title: 'Hesiod, Theogony', locator: source, language: 'grc' }
    : { type: source.type ?? 'primary-text', title: source.title, locator: source.locator, language: source.language ?? 'grc' }],
});

export const greekRelations: readonly CharacterRelation[] = [
  relation('relation-gaia-uranus-consort', 'character-gaia', 'character-uranus', 'consort', '126–210'),
  relation('relation-uranus-cronus-parent', 'character-uranus', 'character-cronus', 'parent', '133–138'),
  relation('relation-gaia-cronus-parent', 'character-gaia', 'character-cronus', 'parent', '133–138'),
  relation('relation-cronus-zeus-parent', 'character-cronus', 'character-zeus', 'parent', '453–506'),
  relation('relation-rhea-zeus-parent', 'character-rhea', 'character-zeus', 'parent', '453–506'),
  relation('relation-cronus-poseidon-parent', 'character-cronus', 'character-poseidon', 'parent', '453–506'),
  relation('relation-rhea-poseidon-parent', 'character-rhea', 'character-poseidon', 'parent', '453–506'),
  relation('relation-cronus-hades-parent', 'character-cronus', 'character-hades', 'parent', '453–506'),
  relation('relation-rhea-hades-parent', 'character-rhea', 'character-hades', 'parent', '453–506'),
  relation('relation-zeus-athena-parent', 'character-zeus', 'character-athena', 'parent', '886–900'),
  relation('relation-metis-athena-parent', 'character-metis', 'character-athena', 'parent', '886–900'),
  relation('relation-zeus-apollo-parent', 'character-zeus', 'character-apollo', 'parent', '918–920'),
  relation('relation-leto-apollo-parent', 'character-leto', 'character-apollo', 'parent', '918–920'),
  relation('relation-zeus-artemis-parent', 'character-zeus', 'character-artemis', 'parent', '918–920'),
  relation('relation-leto-artemis-parent', 'character-leto', 'character-artemis', 'parent', '918–920'),
  relation('relation-demeter-persephone-parent', 'character-demeter', 'character-persephone', 'parent', '912–914'),
  relation('relation-zeus-persephone-parent', 'character-zeus', 'character-persephone', 'parent', '912–914'),
  relation('relation-hades-persephone-consort', 'character-hades', 'character-persephone', 'consort', { title: 'Homeric Hymn to Demeter', locator: '1–495', language: 'grc' }),
  relation('relation-zeus-hermes-parent', 'character-zeus', 'character-hermes', 'parent', '938–939'),
  relation('relation-maia-hermes-parent', 'character-maia', 'character-hermes', 'parent', '938–939'),
  relation('relation-zeus-dionysus-parent', 'character-zeus', 'character-dionysus', 'parent', '940–942'),
  relation('relation-semele-dionysus-parent', 'character-semele', 'character-dionysus', 'parent', '940–942'),
  relation('relation-uranus-rhea-parent', 'character-uranus', 'character-rhea', 'parent', '133–138'),
  relation('relation-gaia-rhea-parent', 'character-gaia', 'character-rhea', 'parent', '133–138'),
  relation('relation-cronus-rhea-consort', 'character-cronus', 'character-rhea', 'consort', '453–458'),
  relation('relation-cronus-hera-parent', 'character-cronus', 'character-hera', 'parent', '453–506'),
  relation('relation-rhea-hera-parent', 'character-rhea', 'character-hera', 'parent', '453–506'),
  relation('relation-cronus-demeter-parent', 'character-cronus', 'character-demeter', 'parent', '453–506'),
  relation('relation-rhea-demeter-parent', 'character-rhea', 'character-demeter', 'parent', '453–506'),
  relation('relation-cronus-hestia-parent', 'character-cronus', 'character-hestia', 'parent', '453–506'),
  relation('relation-rhea-hestia-parent', 'character-rhea', 'character-hestia', 'parent', '453–506'),
  relation('relation-zeus-hera-consort', 'character-zeus', 'character-hera', 'consort', '886–891'),
  relation('relation-zeus-prometheus-punishes', 'character-zeus', 'character-prometheus', 'punishes', { title: 'Hesiod, Theogony', locator: '521–616', language: 'grc' }),
  relation('relation-zeus-pandora-orders-creation', 'character-zeus', 'character-pandora', 'orders-creation', { title: 'Hesiod, Works and Days', locator: '60–82', language: 'grc' }),
  relation('relation-apollo-python-defeats', 'character-apollo', 'character-python', 'defeats', { title: 'Homeric Hymn to Apollo', locator: '300–374', language: 'grc' }),
  relation('relation-apollo-hermes-exchanges-with', 'character-apollo', 'character-hermes', 'exchanges-with', { title: 'Homeric Hymn to Hermes', locator: '413–495', language: 'grc' }),
  relation('relation-poseidon-polyphemus-parent', 'character-poseidon', 'character-polyphemus', 'parent', { title: 'Homer, Odyssey', locator: '1.68–71', language: 'grc' }),
  relation('relation-poseidon-odysseus-opposes', 'character-poseidon', 'character-odysseus', 'opposes', { title: 'Homer, Odyssey', locator: '1.68–79', language: 'grc' }),
  relation('relation-perseus-medusa-defeats', 'character-perseus', 'character-medusa', 'defeats', { title: 'Pseudo-Apollodorus, Bibliotheca', locator: '2.4.2', type: 'literature', language: 'grc' }),
  relation('relation-heracles-hydra-defeats', 'character-heracles', 'character-hydra', 'defeats', { title: 'Pseudo-Apollodorus, Bibliotheca', locator: '2.5.2', type: 'literature', language: 'grc' }),
  relation('relation-heracles-cerberus-captures', 'character-heracles', 'character-cerberus', 'captures', { title: 'Pseudo-Apollodorus, Bibliotheca', locator: '2.5.12', type: 'literature', language: 'grc' }),
  relation('relation-theseus-minotaur-defeats', 'character-theseus', 'character-minotaur', 'defeats', { title: 'Pseudo-Apollodorus, Epitome', locator: '1.7–9', type: 'literature', language: 'grc' }),
  relation('relation-ariadne-theseus-aids', 'character-ariadne', 'character-theseus', 'aids', { title: 'Pseudo-Apollodorus, Epitome', locator: '1.8–9', type: 'literature', language: 'grc' }),
  relation('relation-jason-medea-consort', 'character-jason', 'character-medea', 'consort', { title: 'Apollonius Rhodius, Argonautica', locator: '4.1–1781', language: 'grc' }),
  relation('relation-orpheus-eurydice-consort', 'character-orpheus', 'character-eurydice', 'consort', { title: 'Ovid, Metamorphoses', locator: '10.1–85', type: 'literature', language: 'la' }, 'Roman poetic reception'),
  relation('relation-bellerophon-chimera-defeats', 'character-bellerophon', 'character-chimera', 'defeats', { title: 'Homer, Iliad', locator: '6.155–203', language: 'grc' }),
  relation('relation-bellerophon-pegasus-rides', 'character-bellerophon', 'character-pegasus', 'rides', { title: 'Pseudo-Apollodorus, Bibliotheca', locator: '2.3.1–2', type: 'literature', language: 'grc' }),
  relation('relation-daedalus-icarus-parent', 'character-daedalus', 'character-icarus', 'parent', { title: 'Ovid, Metamorphoses', locator: '8.183–235', type: 'literature', language: 'la' }, 'Roman poetic reception'),
  relation('relation-oedipus-sphinx-defeats', 'character-oedipus', 'character-sphinx', 'defeats', { title: 'Pseudo-Apollodorus, Bibliotheca', locator: '3.5.8', type: 'literature', language: 'grc' }),
  relation('relation-priam-hector-parent', 'character-priam', 'character-hector', 'parent', { title: 'Homer, Iliad', locator: '6.395–403', language: 'grc' }),
  relation('relation-priam-paris-parent', 'character-priam', 'character-paris', 'parent', { title: 'Homer, Iliad', locator: '3.162–165', language: 'grc' }),
  relation('relation-achilles-patroclus-companion', 'character-achilles', 'character-patroclus', 'companion', { title: 'Homer, Iliad', locator: '16.1–100; 18.1–80', language: 'grc' }),
  relation('relation-achilles-hector-defeats', 'character-achilles', 'character-hector', 'defeats', { title: 'Homer, Iliad', locator: '22.131–404', language: 'grc' }),
  relation('relation-odysseus-penelope-consort', 'character-odysseus', 'character-penelope', 'consort', { title: 'Homer, Odyssey', locator: '19.135–202; 23.163–341', language: 'grc' }),
  relation('relation-odysseus-telemachus-parent', 'character-odysseus', 'character-telemachus', 'parent', { title: 'Homer, Odyssey', locator: '1.1–95', language: 'grc' }),
  relation('relation-penelope-telemachus-parent', 'character-penelope', 'character-telemachus', 'parent', { title: 'Homer, Odyssey', locator: '1.1–95', language: 'grc' }),
  relation('relation-odysseus-circe-encounters', 'character-odysseus', 'character-circe', 'encounters', { title: 'Homer, Odyssey', locator: '10.135–574', language: 'grc' }),
  relation('relation-odysseus-sirens-resists', 'character-odysseus', 'character-sirens', 'resists', { title: 'Homer, Odyssey', locator: '12.39–200', language: 'grc' }),
  relation('relation-odysseus-calypso-departs-from', 'character-odysseus', 'character-calypso', 'departs-from', { title: 'Homer, Odyssey', locator: '5.1–281', language: 'grc' }),
];

/** Explicit P0 relationship closure; validation fails if an expected edge disappears. */
export const greekP0RequiredRelationIds = [
  'relation-gaia-uranus-consort', 'relation-uranus-cronus-parent', 'relation-gaia-cronus-parent', 'relation-cronus-zeus-parent', 'relation-rhea-zeus-parent', 'relation-cronus-poseidon-parent', 'relation-rhea-poseidon-parent', 'relation-cronus-hades-parent', 'relation-rhea-hades-parent', 'relation-zeus-athena-parent', 'relation-metis-athena-parent', 'relation-zeus-apollo-parent', 'relation-leto-apollo-parent', 'relation-zeus-artemis-parent', 'relation-leto-artemis-parent', 'relation-demeter-persephone-parent', 'relation-zeus-persephone-parent', 'relation-hades-persephone-consort', 'relation-zeus-hermes-parent', 'relation-maia-hermes-parent', 'relation-zeus-dionysus-parent', 'relation-semele-dionysus-parent',
  'relation-uranus-rhea-parent', 'relation-gaia-rhea-parent', 'relation-cronus-rhea-consort', 'relation-cronus-hera-parent', 'relation-rhea-hera-parent', 'relation-cronus-demeter-parent', 'relation-rhea-demeter-parent', 'relation-cronus-hestia-parent', 'relation-rhea-hestia-parent', 'relation-zeus-hera-consort', 'relation-zeus-prometheus-punishes', 'relation-zeus-pandora-orders-creation', 'relation-apollo-python-defeats', 'relation-apollo-hermes-exchanges-with', 'relation-poseidon-polyphemus-parent', 'relation-poseidon-odysseus-opposes', 'relation-perseus-medusa-defeats', 'relation-heracles-hydra-defeats', 'relation-heracles-cerberus-captures', 'relation-theseus-minotaur-defeats', 'relation-ariadne-theseus-aids', 'relation-jason-medea-consort', 'relation-orpheus-eurydice-consort', 'relation-bellerophon-chimera-defeats', 'relation-bellerophon-pegasus-rides', 'relation-daedalus-icarus-parent', 'relation-oedipus-sphinx-defeats', 'relation-priam-hector-parent', 'relation-priam-paris-parent', 'relation-achilles-patroclus-companion', 'relation-achilles-hector-defeats', 'relation-odysseus-penelope-consort', 'relation-odysseus-telemachus-parent', 'relation-penelope-telemachus-parent', 'relation-odysseus-circe-encounters', 'relation-odysseus-sirens-resists', 'relation-odysseus-calypso-departs-from',
] as const;
