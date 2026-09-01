import type { MythStory, MythStorySource } from '../../lib/content/types';

const mythologyId = 'myth-norse';
const date = '2026-09-01';

const sources = {
  prose: { sourceId: 'source-norse-prose-edda', title: 'Snorri Sturluson, Prose Edda', sourceType: 'primary-text', tradition: '斯诺里整理传统', period: '13世纪', language: 'non', locator: 'Gylfaginning' },
  poetic: { sourceId: 'source-norse-poetic-edda', title: 'Poetic Edda', sourceType: 'primary-text', tradition: '诗体埃达传统', period: '中世纪抄本记录', language: 'non', locator: '按诗篇与诗节' },
  skaldic: { sourceId: 'source-norse-skaldic-poetry', title: 'Skaldic poetry', sourceType: 'primary-text', tradition: '斯卡尔德诗歌传统', period: '中世纪记录', language: 'non', locator: '按诗篇与段落' },
  volsung: { sourceId: 'source-norse-volsunga-saga', title: 'Völsunga saga', sourceType: 'primary-text', tradition: '沃尔松格英雄传统', period: '13世纪', language: 'non', locator: '按章节' },
} as const satisfies Record<string, MythStorySource>;

type StoryInput = {
  slug: string;
  title: string;
  titleEn: string;
  subtitle: string;
  summary: string;
  volumeId: string;
  volumeTitle: string;
  volumeOrder: number;
  displayOrder: number;
  source: MythStorySource;
  tradition: string;
  characters: readonly string[];
  worlds?: readonly string[];
  scenes?: readonly string[];
  narrative: string;
};

const story = (input: StoryInput): MythStory => ({
  id: `story-${input.slug}`,
  slug: input.slug,
  mythologyId,
  title: input.title,
  titleEn: input.titleEn,
  subtitle: input.subtitle,
  summary: input.summary,
  volumeId: input.volumeId,
  volumeTitle: input.volumeTitle,
  volumeOrder: input.volumeOrder,
  displayOrder: input.displayOrder,
  kind: 'myth',
  tradition: input.tradition,
  readingMinutes: 4,
  sources: [input.source],
  sourceNotes: [
    `本篇以 ${input.source.title} 为主要叙事依据；现存北欧材料多为中世纪记录，版本范围不被压缩为唯一正史。`,
    '故事、关系和视觉设计分别保留其来源范围；来源未统一的空间与身份不自动合并。',
  ],
  requiredCharacterIds: input.characters,
  requiredWorldIds: input.worlds ?? [],
  requiredSceneIds: input.scenes ?? [],
  requiredSourceIds: [input.source.sourceId ?? input.source.title],
  characterIds: input.characters,
  worldIds: input.worlds ?? [],
  sceneIds: input.scenes ?? [],
  claims: [{
    id: `claim-${input.slug}-narrative`,
    subjectType: 'story',
    subjectId: `story-${input.slug}`,
    claimType: 'narrative',
    summary: input.summary,
    status: 'supported',
    traditionScope: input.tradition,
    sourceRefs: [{ type: 'primary-text', title: input.source.title, locator: input.source.locator ?? '按章节', language: input.source.language }],
  }],
  blocks: [
    { type: 'paragraph', text: input.narrative },
    { type: 'paragraph', text: 'MythCanvas 将本篇作为可追溯的神话叙事入口，并把人物、世界、关系与来源继续开放给探索。' },
    { type: 'quote', text: '版本差异保留在来源范围内，不以单一现代改编替代古典材料。', source: '版本说明' },
  ],
  publishStatus: 'published',
  publishedAt: date,
  updatedAt: date,
});

const c = (...ids: string[]) => ids.map((id) => `character-${id}`);
const w = (...ids: string[]) => ids.map((id) => `world-${id}`);
const s = (...ids: string[]) => ids.map((id) => `scene-${id}`);

export const norseStories: readonly MythStory[] = [
  story({ slug: 'ymir-creation', title: '尤弥尔与世界的诞生', titleEn: 'Ymir and the Making of the World', subtitle: '冰与火之间诞生的巨人', summary: '寒冷与火焰在金伦加鸿沟相遇，尤弥尔出现，北欧宇宙的材料由此展开。', volumeId: 'norse-origins', volumeTitle: '创世与宇宙结构', volumeOrder: 1, displayOrder: 1, source: sources.prose, tradition: '北欧创世传统', characters: c('ymir'), worlds: w('jotunheim', 'niflheim'), scenes: s('ginnungagap'), narrative: '金伦加鸿沟不是一座已经画好边界的地图，而是寒冷与热力相遇的原初间隙。尤弥尔的出现把巨人、冰霜和生成放进同一条宇宙叙事。' }),
  story({ slug: 'audhumla-and-buri', title: '奥德胡姆拉与布里的出现', titleEn: 'Auðumbla and the Emergence of Búri', subtitle: '冰霜中显现的祖先', summary: '原初的牛奥德胡姆拉舔开咸冰，使布里从冰中显现。', volumeId: 'norse-origins', volumeTitle: '创世与宇宙结构', volumeOrder: 1, displayOrder: 2, source: sources.prose, tradition: '斯诺里创世整理传统', characters: c('buri', 'ymir'), worlds: w('niflheim'), scenes: s('ginnungagap'), narrative: '奥德胡姆拉以冰与盐为食，舔开冰层后显现出布里。这个片段将神族祖先放在寒冷物质与原初生命的交界上。' }),
  story({ slug: 'odin-creates-world', title: '奥丁兄弟以尤弥尔之躯创造世界', titleEn: 'Odin and His Brothers Shape the World', subtitle: '巨人的身体成为宇宙材料', summary: '奥丁、威利与维以尤弥尔之躯塑造大地、海洋与天空。', volumeId: 'norse-origins', volumeTitle: '创世与宇宙结构', volumeOrder: 1, displayOrder: 3, source: sources.prose, tradition: '斯诺里创世整理传统', characters: c('odin', 'vili', 've', 'ymir'), worlds: w('midgard', 'asgard'), scenes: s('ginnungagap'), narrative: '尤弥尔的身体被重新组织为山、海、天空与边界。创世在这里不是凭空制造，而是把原初巨人的材料转化为可以居住和穿行的世界。' }),
  story({ slug: 'ask-and-embla', title: '阿斯克与恩布拉', titleEn: 'Ask and Embla', subtitle: '人类获得呼吸与意识', summary: '奥丁、威利与维赋予树木形体以生命，使人类进入世界。', volumeId: 'norse-origins', volumeTitle: '创世与宇宙结构', volumeOrder: 1, displayOrder: 4, source: sources.prose, tradition: '北欧人类起源传统', characters: c('odin', 'vili', 've'), worlds: w('midgard'), scenes: s('midgard-coast'), narrative: '阿斯克与恩布拉的故事把人类放在木材、呼吸和意识的交界。人类不是宇宙之外的旁观者，而是被置于米德加尔特的有限空间中。' }),
  story({ slug: 'yggdrasil-wells-norns', title: '世界树、三口井与诺恩', titleEn: 'Yggdrasil, the Wells and the Norns', subtitle: '命运在树根之间流动', summary: '世界树连接不同空间，井泉与诺恩使宇宙获得时间与命运的纵深。', volumeId: 'norse-origins', volumeTitle: '创世与宇宙结构', volumeOrder: 1, displayOrder: 5, source: sources.prose, tradition: '宇宙树与命运传统', characters: c('odin', 'mimir'), worlds: w('asgard', 'niflheim'), scenes: s('world-tree-roots', 'well-of-mimir'), narrative: '世界树不是一张固定九界地图，而是一条把井泉、根系、道路与命运连接起来的宇宙轴。它允许同一世界被不同故事从不同方向进入。' }),
  story({ slug: 'sun-and-moon-chase', title: '日月运行与追逐者', titleEn: 'The Sun, the Moon and Their Pursuers', subtitle: '天体在追逐中运行', summary: '日月的运行被写成持续的追逐，预示秩序终将面临断裂。', volumeId: 'norse-origins', volumeTitle: '创世与宇宙结构', volumeOrder: 1, displayOrder: 6, source: sources.prose, tradition: '北欧天象传统', characters: c('odin'), worlds: w('midgard'), scenes: s('world-tree-roots'), narrative: '日月并非静止悬挂在天空，而在追逐与被追逐的节奏中运行。天象因此成为命运压力的可见形式。' }),
  story({ slug: 'aesir-vanir-war', title: '阿萨神族与华纳神族的冲突与和解', titleEn: 'The War and Truce of Aesir and Vanir', subtitle: '两个神族重新安排秩序', summary: '阿萨与华纳之间的冲突最终通过交换与共同居住得到缓和。', volumeId: 'norse-order', volumeTitle: '神族秩序与知识', volumeOrder: 2, displayOrder: 1, source: sources.poetic, tradition: '阿萨—华纳传统', characters: c('odin', 'freyja', 'freyr', 'njordr'), worlds: w('asgard', 'vanaheim'), scenes: s('asgard-court'), narrative: '阿萨与华纳的冲突并不只是阵营战斗，它也关乎不同神圣能力如何进入同一秩序。交换人质与共同生活让两个传统彼此改写。' }),
  story({ slug: 'kvasir-and-mead', title: '克瓦希尔与诗歌蜜酒', titleEn: 'Kvasir and the Mead of Poetry', subtitle: '知识被酿成可以争夺的液体', summary: '克瓦希尔的智慧与诗歌蜜酒把知识、语言和盗取联系在一起。', volumeId: 'norse-order', volumeTitle: '神族秩序与知识', volumeOrder: 2, displayOrder: 2, source: sources.prose, tradition: '诗歌蜜酒传统', characters: c('odin'), worlds: w('asgard'), scenes: s('asgard-court'), narrative: '诗歌蜜酒把智慧变成需要寻找、守护和夺取的资源。奥丁的知识追求因此带有代价与伪装，而不是抽象的全知。' }),
  story({ slug: 'odin-and-mimir', title: '奥丁以一只眼换取智慧', titleEn: 'Odin and Mímir’s Well', subtitle: '知识总有可见的代价', summary: '奥丁在密米尔之井前付出一只眼，以换取洞察力。', volumeId: 'norse-order', volumeTitle: '神族秩序与知识', volumeOrder: 2, displayOrder: 3, source: sources.poetic, tradition: '奥丁求知传统', characters: c('odin', 'mimir'), worlds: w('asgard'), scenes: s('well-of-mimir'), narrative: '奥丁的智慧不是无条件赠礼。他在井边留下身体的一部分，显示知识、牺牲与王权之间的紧张关系。' }),
  story({ slug: 'odin-world-tree', title: '奥丁悬于世界树九夜', titleEn: 'Odin on the World Tree', subtitle: '以牺牲换取符文知识', summary: '奥丁自我悬挂于世界树，在痛苦与等待中获得符文知识。', volumeId: 'norse-order', volumeTitle: '神族秩序与知识', volumeOrder: 2, displayOrder: 4, source: sources.poetic, tradition: '《高者之歌》传统', characters: c('odin'), worlds: w('asgard'), scenes: s('world-tree-roots'), narrative: '奥丁把自己悬在世界树上，既是求知者，也是知识仪式的参与者。符文在这里不是装饰性的发光字样，而是经过代价获得的能力。' }),
  story({ slug: 'freyja-and-gerdr', title: '弗雷与葛德', titleEn: 'Frey and Gerðr', subtitle: '丰饶神对巨人庭院的凝望', summary: '弗雷爱上葛德，并派遣斯基尔尼尔穿过边界寻求她的同意。', volumeId: 'norse-order', volumeTitle: '神族秩序与知识', volumeOrder: 2, displayOrder: 5, source: sources.poetic, tradition: '华纳神族与巨人传统', characters: c('freyr', 'gerdr'), worlds: w('vanaheim', 'jotunheim'), scenes: s('jotunheim-border'), narrative: '弗雷与葛德的故事把爱慕、交换、威胁和跨越边界放在同一个谈判过程中。约顿并非单一敌对种族，而是拥有自身空间与主体性。' }),
  story({ slug: 'idunn-and-thjazi', title: '伊登被夏基掳走', titleEn: 'Iðunn and Þjazi', subtitle: '青春苹果离开神域', summary: '伊登与青春苹果被带离阿斯加德，诸神的衰老暴露了宝物的秩序作用。', volumeId: 'norse-order', volumeTitle: '神族秩序与知识', volumeOrder: 2, displayOrder: 6, source: sources.skaldic, tradition: '神祇与宝物传统', characters: c('idunn', 'loki'), worlds: w('asgard', 'jotunheim'), scenes: s('asgard-court', 'jotunheim-border'), narrative: '青春苹果不是普通道具。伊登离开后，诸神的身体和秩序开始衰老，迫使洛基承担把她带回来的责任。' }),
  story({ slug: 'asgard-wall-and-sleipnir', title: '阿斯加德城墙与斯莱普尼尔', titleEn: 'The Wall of Asgard and Sleipnir', subtitle: '一座城墙换来一匹跨界坐骑', summary: '城墙建造者、斯瓦迪尔法利与洛基的变形共同改变阿斯加德的防御。', volumeId: 'norse-order', volumeTitle: '神族秩序与知识', volumeOrder: 2, displayOrder: 7, source: sources.prose, tradition: '阿斯加德城墙传统', characters: c('loki', 'sleipnir'), worlds: w('asgard', 'jotunheim'), scenes: s('asgard-court'), narrative: '阿斯加德城墙的建造暴露了神族对契约、时间和外部力量的依赖。洛基的变形最终带来斯莱普尼尔，也让边界不再只是石头。' }),
  story({ slug: 'sifs-hair-and-treasures', title: '西芙的头发与诸神宝物', titleEn: 'Sif’s Hair and the Gods’ Treasures', subtitle: '失去的金色被重新锻造', summary: '洛基剪去西芙的头发，矮人锻造出新的金发与多件神圣宝物。', volumeId: 'norse-order', volumeTitle: '神族秩序与知识', volumeOrder: 2, displayOrder: 8, source: sources.prose, tradition: '神祇宝物锻造传统', characters: c('sif', 'loki', 'odin', 'freyr', 'thor'), worlds: w('asgard'), scenes: s('asgard-court'), narrative: '西芙的金发与宝物锻造把身体、赔偿、工艺和神权连在一起。宝物不是凭空出现，而是在冲突之后被工匠与契约制造出来。' }),
  story({ slug: 'thor-and-hrungnir', title: '索尔与赫朗格尼尔', titleEn: 'Thor and Hrungnir', subtitle: '神与巨人的决斗', summary: '索尔与赫朗格尼尔的冲突把力量、边界和巨人威胁集中在一场决斗中。', volumeId: 'norse-thor', volumeTitle: '索尔、洛基与巨人', volumeOrder: 3, displayOrder: 1, source: sources.skaldic, tradition: '索尔与巨人传统', characters: c('thor'), worlds: w('jotunheim', 'asgard'), scenes: s('jotunheim-border'), narrative: '赫朗格尼尔代表约顿世界中不可被简单归类为冰雪怪物的力量。索尔的胜利依赖锤、身体和边界空间的共同作用。' }),
  story({ slug: 'thor-fishes-for-serpent', title: '索尔垂钓世界蛇', titleEn: 'Thor Fishes for the World Serpent', subtitle: '海面下的宿敌', summary: '索尔试图钓起环绕米德加尔特的尘世巨蛇，二者的冲突延续到末日。', volumeId: 'norse-thor', volumeTitle: '索尔、洛基与巨人', volumeOrder: 3, displayOrder: 2, source: sources.poetic, tradition: '索尔与尘世巨蛇传统', characters: c('thor', 'jormungandr'), worlds: w('midgard', 'jotunheim'), scenes: s('midgard-coast'), narrative: '索尔垂钓世界蛇的场景让海洋成为宿命关系的舞台。巨蛇不是一个普通怪兽，而是包围人类世界、与雷神形成结构性对抗的存在。' }),
  story({ slug: 'thryms-stolen-hammer', title: '雷神之锤被盗', titleEn: 'The Theft of Mjölnir', subtitle: '神锤与伪装的新娘', summary: '索尔的锤子被夏基之名的巨人夺走，洛基设计让索尔伪装成新娘取回武器。', volumeId: 'norse-thor', volumeTitle: '索尔、洛基与巨人', volumeOrder: 3, displayOrder: 3, source: sources.poetic, tradition: '《鹰羽之歌》传统', characters: c('thor', 'loki'), worlds: w('jotunheim', 'asgard'), scenes: s('jotunheim-border'), narrative: '失去妙尔尼尔后，索尔的守护身份暂时失去支点。故事以婚宴、服装和洛基的策略把武器归还变成一场公开的表演。' }),
  story({ slug: 'thor-in-utgard', title: '索尔在乌特加德', titleEn: 'Thor in Útgarða-Loki’s Hall', subtitle: '力量被幻象重新定义', summary: '索尔在巨人大厅中接受看似简单却被魔法改写的挑战。', volumeId: 'norse-thor', volumeTitle: '索尔、洛基与巨人', volumeOrder: 3, displayOrder: 4, source: sources.prose, tradition: '乌特加德传统', characters: c('thor', 'loki'), worlds: w('jotunheim'), scenes: s('jotunheim-border'), narrative: '乌特加德的挑战不是公平竞技，而是把海洋、老年和世界本身伪装成对手。索尔即使失败，也因此显露出力量的尺度。' }),
  story({ slug: 'thor-and-geirrod', title: '索尔与盖尔罗德', titleEn: 'Thor and Geirröðr', subtitle: '穿越巨人领地的危险旅程', summary: '索尔在洛基协助与意外装备下进入盖尔罗德的领地。', volumeId: 'norse-thor', volumeTitle: '索尔、洛基与巨人', volumeOrder: 3, displayOrder: 5, source: sources.skaldic, tradition: '索尔与巨人传统', characters: c('thor', 'loki'), worlds: w('jotunheim'), scenes: s('jotunheim-border'), narrative: '这段旅程把渡河、伪装、巨人厅堂和武器交给一个连续空间。索尔的力量始终需要通过道路与工具才能抵达冲突现场。' }),
  story({ slug: 'fenrir-and-gleipnir', title: '芬里尔与格莱普尼尔', titleEn: 'Fenrir and Gleipnir', subtitle: '一条看不见的束缚', summary: '诸神用格莱普尼尔束缚芬里尔，并由提尔付出一只手作为代价。', volumeId: 'norse-thor', volumeTitle: '索尔、洛基与巨人', volumeOrder: 3, displayOrder: 6, source: sources.prose, tradition: '芬里尔束缚传统', characters: c('fenrir', 'tyr', 'odin'), worlds: w('asgard', 'jotunheim'), scenes: s('asgard-court'), narrative: '格莱普尼尔由看似不可能的材料制成，芬里尔最终接受试探却不再相信诸神。提尔把手放入狼口，使契约的代价留在身体上。' }),
  story({ slug: 'lokis-feast', title: '洛基的宴席争辩', titleEn: 'Loki’s Flyting', subtitle: '宴席成为秩序的审判场', summary: '洛基在宴席中揭露诸神的秘密，语言冲突使共同体的裂缝公开化。', volumeId: 'norse-thor', volumeTitle: '索尔、洛基与巨人', volumeOrder: 3, displayOrder: 7, source: sources.poetic, tradition: '《洛基的争辩》传统', characters: c('loki', 'odin', 'thor', 'freyja', 'tyr'), worlds: w('asgard'), scenes: s('asgard-court'), narrative: '洛基的攻击不是普通吵架，而是把神族内部的债务、欲望和不体面历史重新带到公共宴席。秩序正是在被说出之后开始崩裂。' }),
  story({ slug: 'baldrs-dreams', title: '巴德尔的梦', titleEn: 'Baldr’s Dreams', subtitle: '死亡先以梦的形式到来', summary: '巴德尔反复梦见危险，诸神开始寻找梦境背后的死亡预兆。', volumeId: 'norse-baldr', volumeTitle: '巴德尔之死与秩序崩裂', volumeOrder: 4, displayOrder: 1, source: sources.poetic, tradition: '巴德尔循环', characters: c('baldr', 'odin', 'frigg'), worlds: w('asgard'), scenes: s('asgard-court'), narrative: '巴德尔的梦把末日提前写进神域日常。奥丁前往亡者道路寻找答案，预言由此成为无法轻易解除的压力。' }),
  story({ slug: 'baldrs-death', title: '巴德尔之死', titleEn: 'The Death of Baldr', subtitle: '一枝槲寄生穿过保护', summary: '弗丽嘉让万物保证不伤害巴德尔，却遗漏了槲寄生；洛基借霍德尔之手完成致命一击。', volumeId: 'norse-baldr', volumeTitle: '巴德尔之死与秩序崩裂', volumeOrder: 4, displayOrder: 2, source: sources.prose, tradition: '巴德尔之死传统', characters: c('baldr', 'frigg', 'loki', 'hodr'), worlds: w('asgard'), scenes: s('asgard-court'), narrative: '保护巴德尔的誓言制造出一种看似绝对的安全，却留下一个微小而致命的例外。洛基、霍德尔与槲寄生让神域的游戏转为真正的哀悼。' }),
  story({ slug: 'baldrs-funeral', title: '巴德尔的葬礼', titleEn: 'Baldr’s Funeral', subtitle: '葬船驶入无法挽回的悲剧', summary: '巴德尔被送上葬船，诸神的秩序在仪式与哀悼中暴露出裂痕。', volumeId: 'norse-baldr', volumeTitle: '巴德尔之死与秩序崩裂', volumeOrder: 4, displayOrder: 3, source: sources.prose, tradition: '巴德尔葬礼传统', characters: c('baldr', 'odin', 'frigg', 'thor', 'loki'), worlds: w('asgard', 'hel'), scenes: s('asgard-court', 'ship-naglfar'), narrative: '葬礼把巴德尔的死亡从个人事件变成整个神族共同体的损失。船、火焰与哭泣并没有自动带来复原，反而使之后的追寻更加迫切。' }),
  story({ slug: 'hermod-rides-to-hel', title: '赫尔莫德前往赫尔', titleEn: 'Hermóðr Rides to Hel', subtitle: '穿过亡者道路的请求', summary: '赫尔莫德骑行前往海拉的国度，请求让巴德尔返回神域。', volumeId: 'norse-baldr', volumeTitle: '巴德尔之死与秩序崩裂', volumeOrder: 4, displayOrder: 4, source: sources.prose, tradition: '亡者道路传统', characters: c('hermod', 'baldr', 'hel'), worlds: w('asgard', 'hel'), scenes: s('hall-of-hel'), narrative: '赫尔莫德的旅程把 Hel 作为一个有道路、有统治者、有条件的空间，而不是把人物 Hel 与地点混为同一项。' }),
  story({ slug: 'loki-bound', title: '洛基被捕与束缚', titleEn: 'Loki Bound', subtitle: '毒液滴落在秩序裂缝上', summary: '洛基因巴德尔之死被捕并束缚，西格恩试图接住滴落的毒液。', volumeId: 'norse-baldr', volumeTitle: '巴德尔之死与秩序崩裂', volumeOrder: 4, displayOrder: 5, source: sources.prose, tradition: '洛基受缚传统', characters: c('loki', 'sigyn'), worlds: w('asgard'), scenes: s('world-tree-roots'), narrative: '洛基的束缚是惩罚，也是诸神试图把裂缝固定在一个身体上的行为。西格恩的碗让陪伴、疼痛与持续时间成为场景核心。' }),
  story({ slug: 'fimbulwinter', title: '芬布尔之冬与束缚崩解', titleEn: 'Fimbulwinter and the Breaking of Bonds', subtitle: '漫长冬季先于世界毁灭', summary: '芬布尔之冬、狼吞日月与束缚崩解共同预示诸神黄昏。', volumeId: 'norse-ragnarok', volumeTitle: '诸神黄昏与世界再生', volumeOrder: 5, displayOrder: 1, source: sources.poetic, tradition: '诸神黄昏传统', characters: c('fenrir', 'jormungandr', 'loki', 'odin'), worlds: w('midgard', 'jotunheim'), scenes: s('fimbulwinter-field'), narrative: '末日不是突然降临的一次爆炸，而是冬季、饥荒、冲突和束缚崩解逐步积累的过程。世界的尺度因此先通过天气和道路被感知。' }),
  story({ slug: 'odin-and-fenrir', title: '奥丁与芬里尔', titleEn: 'Odin and Fenrir', subtitle: '预言中的吞噬', summary: '诸神黄昏中芬里尔挣脱束缚并吞噬奥丁，复仇由维达尔完成。', volumeId: 'norse-ragnarok', volumeTitle: '诸神黄昏与世界再生', volumeOrder: 5, displayOrder: 2, source: sources.poetic, tradition: '诸神黄昏传统', characters: c('odin', 'fenrir', 'vidarr'), worlds: w('midgard', 'asgard'), scenes: s('fimbulwinter-field'), narrative: '奥丁与芬里尔的关系把早先的束缚、恐惧和预言推向结局。维达尔的存续并不是简单的胜利，而是旧秩序崩解后仍保留的反击能力。' }),
  story({ slug: 'thor-and-jormungandr-final-battle', title: '索尔与世界蛇的最后一战', titleEn: 'Thor and Jörmungandr at Ragnarök', subtitle: '宿敌在海与雷之间相遇', summary: '索尔击杀世界蛇，却在九步之后倒下，宿命关系以双重胜负结束。', volumeId: 'norse-ragnarok', volumeTitle: '诸神黄昏与世界再生', volumeOrder: 5, displayOrder: 3, source: sources.poetic, tradition: '诸神黄昏传统', characters: c('thor', 'jormungandr'), worlds: w('midgard'), scenes: s('midgard-coast'), narrative: '索尔与世界蛇的结局不适合用单纯胜负概括。雷神完成守护者的动作，却也承受巨蛇毒液，二者的故事在同一瞬间完成。' }),
  story({ slug: 'freyr-and-surtr', title: '弗雷与苏尔特', titleEn: 'Freyr and Surtr', subtitle: '丰饶神面对火焰边界', summary: '弗雷在诸神黄昏中面对苏尔特，失去武器的代价最终显现。', volumeId: 'norse-ragnarok', volumeTitle: '诸神黄昏与世界再生', volumeOrder: 5, displayOrder: 4, source: sources.poetic, tradition: '诸神黄昏传统', characters: c('freyr', 'surtr'), worlds: w('muspell', 'asgard'), scenes: s('muspell-flame-border'), narrative: '弗雷与苏尔特把丰饶、武器和火焰末日放进同一个对照。穆斯贝尔不是普通的红色背景，而是旧世界终结的力量边界。' }),
  story({ slug: 'heimdall-and-loki', title: '海姆达尔、洛基与加拉尔号角', titleEn: 'Heimdall, Loki and Gjallarhorn', subtitle: '号角吹响最后的警报', summary: '海姆达尔吹响号角，最终与洛基相遇并在战斗中同归于尽。', volumeId: 'norse-ragnarok', volumeTitle: '诸神黄昏与世界再生', volumeOrder: 5, displayOrder: 5, source: sources.poetic, tradition: '诸神黄昏传统', characters: c('heimdall', 'loki'), worlds: w('asgard'), scenes: s('bifrost'), narrative: '海姆达尔的号角把末日从隐约预兆转为公共事件。彩虹桥成为守望、通行和最后冲突同时发生的窄地。' }),
  story({ slug: 'ragnarok', title: '世界毁灭、回归与新生', titleEn: 'Destruction, Return and Renewal', subtitle: '火焰之后仍有世界', summary: '世界被火与海重塑，幸存者与归来的神祇重新开始生活。', volumeId: 'norse-ragnarok', volumeTitle: '诸神黄昏与世界再生', volumeOrder: 5, displayOrder: 6, source: sources.poetic, tradition: '诸神黄昏与再生传统', characters: c('vidarr', 'baldr', 'hodr', 'freyr'), worlds: w('midgard', 'asgard'), scenes: s('fimbulwinter-field'), narrative: '毁灭并不是北欧宇宙的唯一终点。火焰退去、土地重新显现，幸存者和归来的神祇让“再生”保留了损失之后的重量。' }),
  story({ slug: 'sigurd-and-regin', title: '西格尔德与雷金', titleEn: 'Sigurd and Regin', subtitle: '英雄被锻造成命运的刀锋', summary: '西格尔德在雷金的引导下获得格拉墨，走进沃尔松格英雄传统。', volumeId: 'norse-volsung', volumeTitle: '沃尔松格英雄传统', volumeOrder: 6, displayOrder: 1, source: sources.volsung, tradition: '沃尔松格英雄传统', characters: c('sigurd'), worlds: w('midgard'), scenes: s('volsung-hall'), narrative: '沃尔松格故事把神话宇宙的英雄传统带入家族、锻造和复仇。西格尔德的身份由武器、师承和家族债务共同塑造。' }),
  story({ slug: 'sigurd-kills-fafnir', title: '西格尔德斩杀法夫纳', titleEn: 'Sigurd Slays Fafnir', subtitle: '龙血与宝藏的危险知识', summary: '西格尔德在洞穴外设伏杀死法夫纳，获得宝藏却也继承诅咒。', volumeId: 'norse-volsung', volumeTitle: '沃尔松格英雄传统', volumeOrder: 6, displayOrder: 2, source: sources.volsung, tradition: '沃尔松格英雄传统', characters: c('sigurd', 'fafnir'), worlds: w('midgard'), scenes: s('volsung-hall'), narrative: '法夫纳不是天生的抽象恶龙，而是被贪欲转化的角色。西格尔德的胜利因此同时是屠龙、夺宝和进入诅咒网络。' }),
  story({ slug: 'sigurd-and-brynhildr', title: '西格尔德与布伦希尔德', titleEn: 'Sigurd and Brynhildr', subtitle: '誓言穿过火焰边界', summary: '西格尔德与布伦希尔德的相遇和誓言为英雄传统埋下后续冲突。', volumeId: 'norse-volsung', volumeTitle: '沃尔松格英雄传统', volumeOrder: 6, displayOrder: 3, source: sources.volsung, tradition: '沃尔松格英雄传统', characters: c('sigurd', 'brynhildr'), worlds: w('midgard'), scenes: s('volsung-hall'), narrative: '布伦希尔德与西格尔德的关系以火焰、誓言和记忆为核心。它不是一个脱离传统的浪漫支线，而是家族政治与英雄声誉的关键节点。' }),
  story({ slug: 'sigurds-death', title: '西格尔德之死', titleEn: 'The Death of Sigurd', subtitle: '英雄声名无法阻止背叛', summary: '西格尔德的死亡使誓言、婚姻与宝藏的冲突进入不可逆的结局。', volumeId: 'norse-volsung', volumeTitle: '沃尔松格英雄传统', volumeOrder: 6, displayOrder: 4, source: sources.volsung, tradition: '沃尔松格英雄传统', characters: c('sigurd', 'brynhildr'), worlds: w('midgard'), scenes: s('volsung-hall'), narrative: '西格尔德之死让英雄传统脱离单纯的胜利叙事。身份、误认、誓言和宝藏彼此交错，最终把声名转成哀悼。' }),
];
