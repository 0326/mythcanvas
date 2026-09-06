import type { MythStory, MythStorySource } from '../../lib/content/types';
import { storySource } from './sources';
import { norseStoryManifest } from './story-manifest';

const mythologyId = 'myth-norse';
const date = '2026-09-01';

const sources = {
  prose: storySource('proseEddaGylfaginning', '按相关章节；Phase 3 逐篇精确化'),
  poetic: storySource('voluspa', '按相关诗篇与诗节；Phase 3 逐篇精确化'),
  skaldic: storySource('haustlong', '按相关 stanza；Phase 3 逐篇精确化'),
  volsung: storySource('volsungaSaga', '按相关章节；Phase 3 逐篇精确化'),
} as const satisfies Record<string, MythStorySource>;

/** Precise source replacements for legacy entries that originally shared a broad placeholder source. */
const preciseLegacySources: Readonly<Record<string, MythStorySource>> = {
  'aesir-vanir-war': storySource('voluspa', 'st. 21–24'),
  'thor-in-utgard': storySource('proseEddaGylfaginning', 'ch. 46–47'),
  'thor-and-geirrod': storySource('thorsdrapa', 'sts. 1–3, 5–23; Geirröðr sequence'),
  'fenrir-and-gleipnir': storySource('proseEddaGylfaginning', 'ch. 34'),
  'lokis-feast': storySource('lokasenna', 'st. 1–65'),
  'loki-bound': storySource('proseEddaGylfaginning', 'ch. 50'),
  'baldrs-dreams': storySource('baldrsDraumar', 'st. 1–14'),
  'baldrs-death': storySource('proseEddaGylfaginning', 'ch. 49'),
  'hermod-rides-to-hel': storySource('proseEddaGylfaginning', 'ch. 49'),
  fimbulwinter: storySource('voluspa', 'st. 41–45'),
  'odin-and-fenrir': storySource('voluspa', 'st. 53–54'),
  'thor-and-jormungandr-final-battle': storySource('voluspa', 'st. 56'),
  'freyr-and-surtr': storySource('proseEddaGylfaginning', 'ch. 51'),
  'heimdall-and-loki': storySource('voluspa', 'st. 46, 51'),
  'sigurd-and-regin': storySource('reginsmal', 'st. 1–40'),
  'sigurd-kills-fafnir': storySource('fafnismal', 'st. 1–44'),
  'sigurd-and-brynhildr': storySource('volsungaSaga', 'chs. 20–27'),
  'sigurds-death': storySource('sigurdarkvida', 'Sigurðarkviða en skamma sts. 22–24, 29–31; compare Brot af Sigurðarkviðu st. 4'),
};

/** Key-moment illustration drafts already generated for the Ragnarök sequence. */
const norseKeyMomentAssetIds: Readonly<Record<string, string>> = {
  'ymir-creation': 'story-illustration-norse-ymir-creation',
  'audhumla-and-buri': 'story-illustration-norse-audhumla-and-buri',
  'odin-creates-world': 'story-illustration-norse-odin-creates-world',
  'ask-and-embla': 'story-illustration-norse-ask-and-embla',
  'thor-and-hrungnir': 'story-illustration-norse-thor-and-hrungnir',
  'freyr-and-gerdr': 'story-illustration-norse-freyr-and-gerdr',
  'idunn-and-thjazi': 'story-illustration-norse-idunn-and-thjazi',
  'kvasir-and-mead': 'story-illustration-norse-kvasir-and-mead',
  'odin-steals-mead': 'story-illustration-norse-odin-steals-mead',
  'thor-fishes-for-serpent': 'story-illustration-norse-thor-fishes-for-serpent',
  'thryms-stolen-hammer': 'story-illustration-norse-thryms-stolen-hammer',
  'odin-and-mimir': 'story-illustration-norse-odin-and-mimir',
  'odin-world-tree': 'story-illustration-norse-odin-world-tree',
  'aesir-vanir-war': 'story-illustration-norse-aesir-vanir-war',
  'fenrir-and-gleipnir': 'story-illustration-norse-fenrir-and-gleipnir',
  'thor-in-utgard': 'story-illustration-norse-thor-in-utgard',
  'thor-and-geirrod': 'story-illustration-norse-thor-and-geirrod',
  'thor-and-hymir': 'story-illustration-norse-thor-and-hymir',
  'loki-and-angrboda': 'story-illustration-norse-loki-and-angrboda',
  'grimnir-revealed': 'story-illustration-norse-grimnir-revealed',
  'valholl-and-valkyries': 'story-illustration-norse-valholl-and-valkyries',
  'andvari-gold': 'story-illustration-norse-andvari-gold',
  'thor-and-skrymir': 'story-illustration-norse-thor-and-skrymir',
  'loki-and-baldr': 'story-illustration-norse-loki-and-baldr',
  'loki-at-ragnarok': 'story-illustration-norse-loki-at-ragnarok',
  'sigmunds-death-and-hjordis': 'story-illustration-norse-sigmunds-death-and-hjordis',
  'sigurd-and-sigrdrifa': 'story-illustration-norse-sigurd-and-sigrdrifa',
  'gudrun-and-atli': 'story-illustration-norse-gudrun-and-atli',
  'helgi-hundingsbani': 'story-illustration-norse-helgi-hundingsbani',
  'volundr-captive-smith': 'story-illustration-norse-volundr-captive-smith',
  'helgi-hjorvardsson-and-svava': 'story-illustration-norse-helgi-hjorvardsson-and-svava',
  'helgi-and-sigrun': 'story-illustration-norse-helgi-and-sigrun',
  'lokis-feast': 'story-illustration-norse-lokis-feast',
  'baldrs-dreams': 'story-illustration-norse-baldrs-dreams',
  'baldrs-death': 'story-illustration-norse-baldrs-death',
  'baldrs-funeral': 'story-illustration-norse-baldrs-funeral',
  'hermod-rides-to-hel': 'story-illustration-norse-hermod-rides-to-hel',
  'loki-bound': 'story-illustration-norse-loki-bound',
  'volsung-and-sword-tree': 'story-illustration-norse-volsung-and-sword-tree',
  'signy-and-siggeir': 'story-illustration-norse-signy-and-siggeir',
  'sigmund-and-sinfjotli': 'story-illustration-norse-sigmund-and-sinfjotli',
  'sigurd-and-regin': 'story-illustration-norse-sigurd-and-regin',
  'sigurd-kills-fafnir': 'story-illustration-norse-sigurd-kills-fafnir',
  'sigurd-and-brynhildr': 'story-illustration-norse-sigurd-and-brynhildr',
  'sigurds-death': 'story-illustration-norse-sigurds-death',
  'odin-and-vafthrudnir': 'story-illustration-norse-odin-and-vafthrudnir',
  'yggdrasil-wells-norns': 'story-illustration-norse-yggdrasil-wells-norns',
  'norns-at-urdarbrunnr': 'story-illustration-norse-norns-at-urdarbrunnr',
  'sun-and-moon-chase': 'story-illustration-norse-sun-and-moon-chase',
  'nidhoggr-and-world-tree': 'story-illustration-norse-nidhoggr-and-world-tree',
  fimbulwinter: 'story-illustration-norse-fimbulwinter',
  'odin-and-fenrir': 'story-illustration-norse-odin-and-fenrir',
  'thor-and-jormungandr-final-battle': 'story-illustration-norse-thor-jormungandr-final-battle',
  'freyr-and-surtr': 'story-illustration-norse-freyr-and-surtr',
  'heimdall-and-loki': 'story-illustration-norse-heimdall-and-loki',
  ragnarok: 'story-illustration-norse-ragnarok',
};

/** Source-scoped identity overrides where a poetic witness names a different triad. */
const sourceScopedCharacterIds: Readonly<Record<string, readonly string[]>> = {
  'ask-and-embla': ['character-odin', 'character-honir', 'character-lodur'],
};

const sourceScopedSummaries: Readonly<Record<string, string>> = {
  'ask-and-embla': '奥丁、海尼尔与洛德尔依《女预言家之歌》的诗歌表述赋予阿斯克与恩布拉生命与感知；威利与维属于平行的散文创世传统。',
};

const paragraphForStory = (input: StoryInput, text: string): string => input.slug === 'ask-and-embla'
  ? text.replace(
    '或以散文传统中的奥丁、威利与维来叙述；本页沿用现有角色导航，但不把其中一种识别当作诗句唯一明说的事实。',
    '散文传统常用奥丁、威利与维解释三兄弟；本页将诗歌中的奥丁、海尼尔与洛德尔作为主导航，并保留两种识别的版本边界。',
  )
  : text;

type StoryInput = {
  slug: string;
  title: string;
  titleEn: string;
  subtitle: string;
  summary: string;
  kind?: MythStory['kind'];
  volumeId: string;
  volumeTitle: string;
  volumeOrder: number;
  displayOrder: number;
  source: MythStorySource;
  tradition: string;
  characters: readonly string[];
  worlds?: readonly string[];
  scenes?: readonly string[];
  objects?: readonly string[];
  legacySlugs?: readonly string[];
  narrative: string;
  /** A structured draft is deliberately distinct from the legacy prototype body. */
  sections?: readonly {
    id: string;
    heading: string;
    paragraphs: readonly string[];
  }[];
  heroAssetId?: string;
  editorialStatus?: MythStory['editorialStatus'];
};

const sourceForStory = (input: Pick<StoryInput, 'slug' | 'source'>): MythStorySource => preciseLegacySources[input.slug] ?? input.source;

type StorySection = NonNullable<StoryInput['sections']>[number];

/**
 * Curated editorial sections for the P0 legacy stories that were previously
 * rendered as short research placeholders. These remain below source review;
 * the sections make the next human review concrete without manufacturing an
 * approval record.
 */
const curatedResearchSections: Readonly<Record<string, readonly StorySection[]>> = {
  'aesir-vanir-war': [
    { id: 'gullveig', heading: '古尔薇格与反复燃烧', paragraphs: ['《女预言家之歌》第二十一节把古尔薇格带入阿萨神族的大厅。诗歌以反复刺杀、焚烧和再次出现的形象描写她，强调的是一个无法被一次惩罚消除的存在，而不是一份完整的生平传记。', '页面将古尔薇格作为这组诗节的叙事起点，保留她与金、欲望或魔法之间的解释空间。后世研究常把她与海恩、芙蕾雅等身份联系起来，但本篇不会把这种解释写成诗句已经明确说出的事实。'] },
    { id: 'war', heading: '阿萨与华纳的裂口', paragraphs: ['诗歌随后说阿萨神族向华纳神族发动战争，城墙被破坏，冲突进入神族共同体内部。这里的战争不是可以按现代国家战争复原的战役记录；诗的节奏通过短句和预言式图像，让裂口显得比具体兵力更重要。', '因此故事会把阿萨与华纳作为两个社会—神族网络来呈现，而不将它们简化为善恶阵营。奥丁、弗雷和芙蕾雅的后续关联需要回到各自来源，不能仅凭这一处诗节补齐全部政治史。'] },
    { id: 'scope', heading: '诗节范围与版本边界', paragraphs: ['本篇只以《女预言家之歌》二十一至二十四节（st. 21–24）为主要叙事范围。它能够支持古尔薇格、第一次冲突和城墙被破坏等核心节点，但不能独立证明后来散文对人质交换、和约或神族迁移的所有细节。', '视觉上可以使用被灼烧的大厅、破损的墙和金色余烬作为原创构图锚点；古尔薇格的服饰、法器和具体容貌仍须标注为 MythCanvas 设计，而不是从诗节中伪造出的考古事实。'] },
  ],
  'thryms-stolen-hammer': [
    { id: 'loss', heading: '妙尔尼尔从索尔身边消失', paragraphs: ['《索列姆之歌》开头先写索尔醒来发现妙尔尼尔不见了。武器的缺席不是普通道具丢失，而是让守护者暂时失去最重要的公开身份；洛基因此被请来协助寻找线索。', '索列姆承认自己藏起了锤子，并要求以芙蕾雅作为交换。芙蕾雅拒绝被当作交易物，这一反应必须保留，因为故事的策略不是诸神可以任意支配女性人物的证明。'] },
    { id: 'disguise', heading: '婚宴伪装与边界交换', paragraphs: ['海姆达尔提出让索尔穿上新娘服饰、戴上首饰并遮住胡须，由洛基作为侍女陪同前往巨人之地。伪装的喜剧张力来自索尔的食量、饮酒和眼神，而不是把婚礼或性别表达当成可嘲笑的对象。', '洛基替索尔解释异常行为，文本让话语和服装共同延长策略。页面会把这段写成一次危险的谈判与表演，并明确指出芙蕾雅只提供了拒绝和边界，不是伪装行动的道具。'] },
    { id: 'recovery', heading: '锤子回到宴席中央', paragraphs: ['索列姆把妙尔尼尔放到新娘膝上，用它完成祝福仪式；索尔随即夺回武器，击倒索列姆及其宾客。恢复武器的瞬间同时结束了伪装和谈判，说明锤子既是武器也是公共秩序的象征。', '本篇依据《索列姆之歌》一至三十二节。视觉可使用婚宴长桌、遮面织物和突然显露的锤光，但服装、厅堂装饰和动作节奏属于原创设计，不能照搬现代影视版本。'] },
  ],
  'thor-in-utgard': [
    { id: 'arrival', heading: '进入巨人大厅', paragraphs: ['《欺骗古鲁菲》第四十六章写索尔、洛基和同行者抵达乌特加德洛基的大厅。大厅以夸张尺度和公开比赛迎接来客，巨人之王先要求他们各自展示能力，故事由此把力量转成一场被主持者控制的表演。', '洛基接受与洛吉比吃，夏尔菲接受赛跑，索尔则被安排连续挑战。页面会保留同行者的不同尺度，避免把全部事件压缩成索尔一人的战斗。'] },
    { id: 'contests', heading: '看似失败的挑战', paragraphs: ['洛基在进食比赛中输给洛吉，夏尔菲在赛跑中输给对手，索尔先饮一只角、举起一只猫，又与老妇人角力。每次挑战都被包装成简单任务，但对手实际连接着火、海、世界蛇和老年等不可被普通力量击败的对象。', '这些失败不是对索尔的道德审判，也不是公平竞技的结果。乌特加德的魔法通过改写参照物来制造胜负，页面必须把“挑战本身”与“挑战被如何呈现”分开。'] },
    { id: 'revelation', heading: '幻象解除后的余震', paragraphs: ['第四十七章中，乌特加德洛基解释了比赛的真实对象：饮角连着海，猫是世界蛇的伪装，老妇人代表老年，索尔的力量已经改变了山和海的形状。解释让先前的失败转为另一种规模的胜利。', '本篇只采用第四十六至四十七章的散文叙事，不把乌特加德大厅当作可以精确绘制的历史建筑。巨人、角杯和被抬起的猫是来源锚点，空间材质与光线为原创视觉层。'] },
  ],
  'thor-and-geirrod': [
    { id: 'journey', heading: '穿过巨人领地的道路', paragraphs: ['关于盖尔罗德的材料在诗歌与散文之间分布不均，本篇以《索尔之歌》选定诗节为主，不把后世整理出的完整冒险路线冒充单一原典。索尔进入巨人势力范围的过程，首先表现为道路、渡水和陌生领地的风险。', '洛基在这条线中承担引路与诱导的作用，索尔则依靠格里德提供的帮助继续前行。人物关系并非简单的“英雄闯入迷宫”，而是信任、欺骗和临时装备共同形成的行程。'] },
    { id: 'tools', heading: '借来的工具与身体边界', paragraphs: ['格里德提供的腰带、铁手套和杖构成索尔进入冲突现场的工具链。它们让身体能够穿过河流、抓住危险物或抵抗巨人的环境；装备不是现代游戏的数值加成，而是诗歌中被明确赋予用途的对象。', '盖尔罗德、吉阿尔普与格蕾普的出现将威胁放进巨人家族与厅堂秩序中。页面会为人物与物件分别建立链接，避免把所有巨人角色混成一个没有差异的敌人。'] },
    { id: 'source-boundary', heading: '保留诗歌的残片性', paragraphs: ['《索尔之歌》的传承与保存状态要求编辑承认其残片性。本篇以第一至第三节及第五至第二十三节的盖尔罗德相关序列为主要诗歌范围；这些材料可以支持人物、道路、工具和冲突节点，却不一定能支持每个动作的连续镜头，不能用现代改编把缺口填成确定事实。', '视觉构图可以突出铁手套、杖、河流和巨人厅堂的压迫尺度。角色服装、建筑结构及战斗编排应标为 MythCanvas 原创设计，并在来源说明中保留诗节范围和残片边界。'] },
  ],
  'fenrir-and-gleipnir': [
    { id: 'fear', heading: '诸神面对被养大的狼', paragraphs: ['《欺骗古鲁菲》第三十四章把芬里尔写成洛基的子女之一，并说明他在诸神之中逐渐长大。诸神一边看见狼的成长，一边听见关于其未来的预言，恐惧由此不是陌生怪物突然出现，而是共同体自己养大的后果。', '页面会保留芬里尔、提尔和奥丁的不同位置。提尔与狼之间的接近既是照料关系，也是后来试探与束缚的前史，不能用“天生邪恶”概括。'] },
    { id: 'binding', heading: '从铁链到格莱普尼尔', paragraphs: ['诸神先用粗重的链条测试芬里尔，狼挣脱后又接受更强的束缚。矮人制造的格莱普尼尔由不能被普通方式取得的材料组成，外表柔软，却比铁链更可靠；这种反差是故事的工艺核心。', '诸神以试验和竞赛的形式邀请芬里尔，但狼察觉其中的欺骗，要求有人把手放入自己的口中作为保证。提尔的手因此成为契约不对称的身体证据。'] },
    { id: 'oath', heading: '被束缚的不信任', paragraphs: ['当芬里尔发现自己无法挣脱时，提尔失去一只手，诸神把狼固定在岩石上。文本中的胜利并不等于秩序恢复：诸神获得了时间，却也证明了芬里尔不再相信他们。', '本篇依据《欺骗古鲁菲》第三十四章。格莱普尼尔的材料、提尔的手和束缚地点是来源锚点；未来涉及诸神黄昏的挣脱与复仇，必须另回到相应诗节，不提前把结局倒灌进本篇。'] },
  ],
  'lokis-feast': [
    { id: 'hall', heading: '宴席被拒绝之后', paragraphs: ['《洛基的争辩》从埃吉尔的宴席展开。洛基要求进入大厅，却被拒绝；奥丁曾有让他与自己共享誓言和席位的约定，洛基以此迫使共同体让他坐下。宴席因此先是一个关于归属的场所，而非单纯的酒宴背景。', '进入大厅后，洛基开始逐一向诸神发言。诗歌的表演性很强，人物的指控、回击和沉默不能被当成一份无争议的神族法庭记录。'] },
    { id: 'flyting', heading: '语言把旧债公开化', paragraphs: ['洛基的攻击涉及欲望、背叛、懦弱、誓言和过去的关系；不同神祇的回答既反驳事实，也维护自己在宴席中的位置。语言让私人债务成为公共事件，神族秩序的裂缝因被说出而无法再隐藏。', '文本中的辱骂不应被产品复制成无上下文的猎奇金句。页面以来源范围、争议主题和关系链接为主，把严重指控标记为诗歌角色的发言，而不是 MythCanvas 对人物的事实判决。'] },
    { id: 'thor-returns', heading: '索尔回到席间', paragraphs: ['当索尔出现，洛基的言语空间被力量和威胁压缩；两人的对话让宴席从言辞比赛转为明确的边界警告。诗歌没有把此前所有指控都用一场战斗裁决，反而保留了共同体在失控边缘的紧张。', '本篇依据《洛基的争辩》一至六十五节，并保留其诗歌体裁与版本范围。场景可使用长桌、火光、空杯与站起的身体表达秩序变化，但不能把现代影视造型当作来源事实。'] },
  ],
  'baldrs-dreams': [
    { id: 'dream', heading: '死亡先以梦出现', paragraphs: ['《巴德尔之梦》开头说巴德尔做了关于生命的梦，阿萨神族因此担忧。诗歌没有展开梦的完整画面，而是用一句预兆改变整个神族的行动方向；危险还未发生，恐惧已经进入日常。', '奥丁随后骑马前往亡者之地，寻找能够回答梦的人。这个行动把知识、死亡和王权连接在一起，也说明预言不是抽象的百科条目，而是迫使角色承担代价的叙事力量。'] },
    { id: 'völva', heading: '对亡者的追问', paragraphs: ['奥丁唤起一位亡者的预言者，双方以问答确认巴德尔即将发生的命运。预言者不主动提供完整故事，奥丁需要持续追问；诗歌由此保留一种被迫揭开的信息结构。', '页面将预言者的身份、亡者空间和奥丁的化名分开标注，不把《巴德尔之梦》与《欺骗古鲁菲》对葬礼、槲寄生或赫尔的全部叙述自动合并。'] },
    { id: 'scope', heading: '预兆不是结局本身', paragraphs: ['本篇依据《巴德尔之梦》一至十四节，核心是梦、骑行、亡者问答和死亡预兆。它不能单独支持巴德尔保护誓言的完整过程，也不应提前把洛基或霍德尔的全部行动写入梦境。', '视觉可采用黑夜道路、墓土、火炬和未显形的梦中光线，表现危险尚未落地的状态。人物服饰与亡者空间的建筑仍属于原创设计，需与巴德尔之死和葬礼的页面保持来源边界。'] },
  ],
  'baldrs-death': [
    { id: 'oaths', heading: '看似无敌的游戏', paragraphs: ['《欺骗古鲁菲》第四十九章说巴德尔做梦后，弗丽嘉要求万物承诺不伤害他。诸神因此把向巴德尔投掷武器和石块变成游戏，安全感由集体誓言支撑，而不是由巴德尔本身获得。', '槲寄生被认为太小，没有被要求发誓。这个例外并非一个宏大阴谋的开端，而是保护制度中的微小遗漏；页面应让读者看见“完整”如何被一个未被询问的对象击穿。'] },
    { id: 'mistletoe', heading: '洛基把例外变成行动', paragraphs: ['洛基向弗丽嘉打听保护的边界，找到槲寄生并交给霍德尔。霍德尔看不见，也没有参加投掷游戏；洛基为他调整方向，让一个没有能力辨认目标的人成为行动的执行者。', '叙事责任因此不能只落在植物或霍德尔身上。页面会分开呈现弗丽嘉的遗漏、洛基的引导和霍德尔的处境，避免用单一反派标签抹平事件的因果链。'] },
    { id: 'death', heading: '共同体从游戏转入哀悼', paragraphs: ['槲寄生击中巴德尔后，他倒下并死亡，诸神从欢笑的游戏瞬间进入无法逆转的哀悼。文本随后转向葬礼与追寻，说明死亡不是一个独立画面，而是改变神族秩序的分水岭。', '本篇以第四十九章为主，葬礼、赫尔莫德前往赫尔和洛基受缚各有独立 Story。视觉上以槲寄生、空出的游戏场和突然静止的人群为锚点，不能使用现代超级英雄式的战斗呈现。'] },
  ],
  'baldrs-funeral': [
    { id: 'ship', heading: '赫林霍尔尼成为葬礼中心', paragraphs: ['巴德尔死后，诸神把他带到海边的赫林霍尔尼葬船。船与海把私人死亡扩大为神族共同体的仪式，但葬礼并没有立即抹平此前的责任与悲伤。', '文本还写到纳娜因悲痛倒下并被放上船，奥丁把德劳普尼尔放在巴德尔身上，其他礼物随葬。这些对象在页面中分别记录，不把葬礼误写成纳格尔法或诸神黄昏的船。'] },
    { id: 'fire', heading: '火焰与无法搬动的船', paragraphs: ['赫林霍尔尼太大，众神无法凭普通力量推动；巨人女性赫洛克金骑狼而来，用蛇作缰绳将船送入水中。索尔在仪式中踢倒矮人利特，火葬由此带着不稳定与暴力的细节，而非平静的纪念典礼。', '葬礼上的人物行动彼此交错：奥丁的哀悼、弗丽嘉的损失、索尔的力量和船的尺度共同构成场景。页面不会将每个细节推广成所有北欧葬仪的普遍规则。'] },
    { id: 'grief', heading: '葬礼没有结束故事', paragraphs: ['火焰将巴德尔送离神域，却没有让诸神放下希望。赫尔莫德随后前往赫尔请求归还巴德尔，洛基的责任和束缚也从这条线继续展开。', '本篇限定《欺骗古鲁菲》第四十九章的葬礼段落；纳格尔法属于另一条末日叙事，不能与赫林霍尔尼混为一物。视觉可使用黑色船身、海雾和葬火表达损失，但建筑与器物细节须标注原创层。'] },
  ],
  'hermod-rides-to-hel': [
    { id: 'ride', heading: '九夜穿过亡者道路', paragraphs: ['《欺骗古鲁菲》第四十九章中，赫尔莫德骑上斯莱普尼尔，前往巴德尔所在的亡者国度。叙事用连续的黑暗、道路与跨越来表现距离，不把这次旅程写成一张可无限扩展的地下世界地图。', '斯莱普尼尔的八足身份和赫尔莫德的使者角色是稳定锚点；其他关于骑行路线的细节若来自后世图像或游戏，应另标为原创想象。'] },
    { id: 'bridge', heading: '桥上的询问', paragraphs: ['赫尔莫德到达加拉尔桥，守桥者莫德古德询问他的姓名与来意，并指出刚才通过的亡者队伍。桥因此成为一个有门槛、有见证者的边界，而不是简单的“通往地狱的入口”。', '页面将赫尔、赫尔莫德和亡者之地作为不同实体处理。人物 Hel 是统治者，Hel 也是世界名称的英文拼写来源，不能因语言相同而合并。'] },
    { id: 'request', heading: '赫尔提出的条件', paragraphs: ['赫尔莫德进入大厅后看见巴德尔和纳娜，请求赫尔让巴德尔回到诸神中。赫尔提出条件：只要万物都为巴德尔哭泣，他就可以返回；唯一不哭的对象会让请求失败。', '本篇在请求和条件处收束，后续寻找哭泣者与洛基的拒绝另由相应 Story 展开。视觉锚点是长途骑行、桥面回声和半明半暗的大厅，不能把赫尔画成现代奇幻中的恶魔王座。'] },
  ],
  'loki-bound': [
    { id: 'capture', heading: '逃亡终止于瀑布', paragraphs: ['巴德尔死后，洛基逃离诸神并藏在瀑布附近，尝试用网捕捉鱼。诸神找到他时，文本把他的机智与逃亡并置；这不是一场开放战斗，而是共同体决定将责任固定到一个身体上的追捕。', '诸神用洛基自己制作的网反过来捕获他，说明工具、记忆和惩罚在故事中形成闭环。页面保留逃亡过程的来源范围，不把洛基的所有恶作都写成这一章的证据。'] },
    { id: 'punishment', heading: '岩石、毒蛇与时间', paragraphs: ['洛基被带到洞穴中，诸神把他绑在三块尖石上，并让毒蛇的毒液滴向他的脸。西格恩拿碗接住毒液，减轻痛苦；当她离开倾倒时，毒液落下，洛基的挣扎被解释为地震。', '处罚场景的核心是持续时间、身体疼痛和陪伴劳动，而不是酷刑奇观。页面会对严重暴力提供提示，不把西格恩的照料写成无条件的浪漫装饰。'] },
    { id: 'scope', heading: '惩罚与末日之间', paragraphs: ['本篇依据《欺骗古鲁菲》第五十章。它可以支持洛基被捕、束缚、毒蛇与西格恩守候等节点；洛基在诸神黄昏中的脱缚和最终战斗属于《女预言家之歌》的另一个来源范围。', '视觉上可使用狭窄岩穴、滴落的毒液和几乎没有出口的光线，但岩石结构、服饰与色彩属于 MythCanvas 原创设计，不能宣称是可考证的宗教仪式复原。'] },
  ],
  fimbulwinter: [
    { id: 'winter', heading: '连续的冬季', paragraphs: ['《女预言家之歌》第四十一至四十五节把末日先写成气候与社会秩序的变化。连续的严冬没有夏季间隔，亲属关系和共同体的信任在漫长寒冷中逐渐崩坏。', '这段诗歌没有提供现代气象意义的时间表，页面会把芬布尔之冬处理为末日过程的叙事阶段，而不是精确年表。冰雪、饥荒和道路中断是感知世界改变的入口。'] },
    { id: 'bonds', heading: '太阳、月亮与束缚的松动', paragraphs: ['末日预兆同时包括天体被追逐、狼逼近以及各种束缚开始松动。诗歌将天空、海洋、地面和神族的防线放在同一组图像里，显示灾难不是一个地点发生的事故。', '页面会把芬里尔、世界蛇和洛基的不同行动分开标记。它们在同一末日序列中相互呼应，却不能因此被画成一场连续无间隙的战斗。'] },
    { id: 'threshold', heading: '从预兆走向集结', paragraphs: ['本篇以第四十一至四十五节为主要范围，收束于束缚崩解和诸神迎向末日的门槛。真正的战斗、奥丁之死、索尔与世界蛇的结局以及世界更新分别由后续 Story 处理。', '视觉可从低角度冬日道路、无光的天空和被拉开的锁链构成气氛，但不能用纯黑末日恐怖替代北欧材料中仍有天空、海和神族秩序残影的复杂尺度。'] },
  ],
  'odin-and-fenrir': [
    { id: 'battle', heading: '奥丁面对预言中的狼', paragraphs: ['《女预言家之歌》第五十三至五十四节把奥丁的末日对手写成芬里尔。此处的关系不能脱离早先的束缚故事理解，但诗节本身聚焦在最终战场与预言兑现，而不是重新讲述格莱普尼尔如何制成。', '奥丁以战神和统治者身份进入战场，芬里尔则代表被长期恐惧与限制的力量。页面会保留两条叙事线的张力，不把狼简化成无思想的怪兽。'] },
    { id: 'devouring', heading: '吞噬与短暂的胜负', paragraphs: ['诗歌写芬里尔张口吞噬奥丁，动作极短却改变神族的中心。奥丁的死亡不是普通决斗中的失败，而是预言对权力秩序的直接切断。', '维达尔随后为父复仇，成为旧秩序崩解后仍能行动的幸存者。复仇不应被写成恢复原状，因为奥丁、诸神和世界的条件已经改变。'] },
    { id: 'scope', heading: '与诸神黄昏整体分开阅读', paragraphs: ['本篇仅依据《女预言家之歌》第五十三至五十四节，重点是奥丁、芬里尔和维达尔的末日节点。芬布尔之冬、船只、海姆达尔和世界重生保留在其他页，以便每个来源范围都能被读者追踪。', '视觉上可以使用失去天光的战场、狼的巨大轮廓和维达尔踏入余烬的动作，但装备、盔甲与战场布置属于原创设计，不是诗节的考古复原。'] },
  ],
  'thor-and-jormungandr-final-battle': [
    { id: 'encounter', heading: '宿敌在末日重逢', paragraphs: ['《女预言家之歌》第五十六节把索尔与世界蛇的关系推向最后一战。世界蛇从海中升起，毒液和海水共同改变战场；这不是早先垂钓故事的重复，而是预言序列中已经无法退出的相遇。', '索尔的守护者身份与巨蛇环绕世界的宇宙尺度在同一画面中相撞。页面将两者作为结构性宿敌呈现，不把世界蛇改成普通海怪。'] },
    { id: 'double-ending', heading: '杀死巨蛇之后的九步', paragraphs: ['诗歌说索尔杀死世界蛇，但只走九步便倒下，原因是巨蛇的毒液。结局同时包含完成任务和付出生命代价两种方向，因此不能用“索尔获胜”一句话结束。', '这九步是叙事中的时间与空间刻度：守护动作已经完成，身体却无法回到安全处。视觉构图应让巨蛇、雷击、毒雾和索尔的短暂站立形成连续的因果。'] },
    { id: 'source-scope', heading: '不把垂钓倒灌成决战', paragraphs: ['本篇依据《女预言家之歌》第五十六节。索尔与世界蛇的早期垂钓见于《海米尔之歌》等另一组材料；页面互链但不把“钓起过巨蛇”写成第五十六节的前置细节。', '人物姿态、海面高度、雷光和毒液的颜色属于 MythCanvas 原创设计。来源事实只负责确认相遇、击杀、九步与死亡的核心锚点。'] },
  ],
  'freyr-and-surtr': [
    { id: 'last-stand', heading: '丰饶神面对火焰', paragraphs: ['《欺骗古鲁菲》第五十一章将弗雷放在诸神黄昏的战场上，苏尔特则带着火焰力量推进。两者的对照不是简单的冰与火公式：弗雷代表的丰饶与秩序，必须在世界末日的军事冲突中承担失去支点的后果。', '文本把弗雷的处境与他早先失去或交出武器的传统联系起来，但不同作品的叙事位置并不完全相同。本篇会把跨文本关联标成解释，而不是把它伪装成同一章的明文。'] },
    { id: 'surtr', heading: '苏尔特与燃烧的边界', paragraphs: ['苏尔特从火焰一侧出现，手中的火焰之剑和最终燃烧构成末日图像的重要节点。页面将苏尔特作为有明确功能的末日力量来处理，不把他泛化为所有巨人或所有火焰生物的统称。', '弗雷与苏尔特的对决是众多末日战斗中的一条支线；海姆达尔、洛基、索尔和奥丁的结局不能全部叠加在这一页。'] },
    { id: 'scope', heading: '保留散文的末日编排', paragraphs: ['本篇以《欺骗古鲁菲》第五十一章为主要来源。它支持弗雷与苏尔特相遇、弗雷战死和火焰吞没世界的散文编排；诗歌中的平行版本与武器来源需通过来源标签区分。', '视觉上可使用火焰边界、失去武器的空手姿态和被照亮的黑色天空，但不要用现代奇幻的恶魔盔甲替代北欧材料中简洁而有威胁的火焰身影。'] },
  ],
  'heimdall-and-loki': [
    { id: 'horn', heading: '号角让末日成为公共事件', paragraphs: ['《女预言家之歌》第四十六节把号角、海姆达尔和神族的集结放进同一组预兆。加拉尔号角的声音不是私人信号，而是让末日从边缘征兆变成所有人都必须面对的公共事件。', '海姆达尔的守望角色应与彩虹桥和远方来者相连，但页面不会凭这一节补出一套完整的守卫制度或桥梁建筑史。'] },
    { id: 'crossing', heading: '洛基从束缚者变成来者', paragraphs: ['诗歌第五十一节把洛基放进随船而来的末日力量中。这里的洛基已不再是第五十章中被固定在岩石上的身体；变化发生在诗歌的末日时间里，具体脱缚过程不能被本节单独证明。', '页面会把洛基的束缚、船只和海姆达尔的号角作为三个相互链接的节点，而不是把“洛基带领所有巨人”扩写成来源没有说出的军事编制。'] },
    { id: 'mutual-death', heading: '守望者与裂缝共同消失', paragraphs: ['诸神黄昏的最终冲突中，海姆达尔与洛基相遇并互相杀死。双方同归于尽让这条关系具有对称的终点：守望者没有保住旧秩序，裂缝也没有独自存活到新世界。', '本篇依据《女预言家之歌》第四十六和五十一节。视觉构图可以用狭窄桥面、号角余音和远处船影建立最后的相遇，但武器与服装属于原创设计。'] },
  ],
  ragnarok: [
    { id: 'destruction', heading: '世界不是在一个瞬间消失', paragraphs: ['《女预言家之歌》第五十四至六十六节把诸神黄昏写成一串连续变化：战斗、火焰、海水和天体的改变共同使旧世界失去形状。页面不会把它压成一个爆炸镜头，而会保留从战争到沉没再到重新出现的时间层。', '奥丁、索尔、弗雷、海姆达尔和洛基的结局分别由各自 Story 连接；本篇承担的是总体编排，不重复替每个角色写一遍完整传记。'] },
    { id: 'renewal', heading: '幸存者与重新出现的土地', paragraphs: ['诗歌随后写土地从海中升起，田野重新生长，幸存者在隐蔽处活下来。太阳的女儿继承光，巴德尔和霍德尔回到更新后的世界，说明“新生”不是把旧世界原样复原。', '页面将利夫与利夫特拉希尔、巴德尔与霍德尔和新土地分层展示。它们是同一更新序列中的节点，但来源中的象征意义不能被简化成现代末日后的城市重建。'] },
    { id: 'scope', heading: '毁灭、回归与未决问题', paragraphs: ['本篇以《女预言家之歌》第五十四至六十六节为主要范围，并对诗节之间的解释差异保留说明。散文《欺骗古鲁菲》对末日有另一种编排，不能在没有标签的情况下混成唯一版本。', '视觉上应同时保留火焰、黑海、升起的绿地和少量光线，避免纯黑恐怖或无条件的乐观童话。所有城市、建筑、服装和镜头语言属于 MythCanvas 原创视觉层。'] },
  ],
  'sigurd-and-regin': [
    { id: 'education', heading: '雷金把家族债务交给西格尔德', paragraphs: ['《雷金之歌》以雷金讲述自己的家族和财富开始。雷金是工匠、养父与叙事讲述者，他把赫瑞德玛尔、法夫纳、奥特和安德瓦里的故事交给年轻的西格尔德，使英雄任务首先以一段旧债进入。', '页面会把雷金的知识和动机分开：他确实提供锻造与家族信息，但他也希望西格尔德替自己完成复仇。教导因此同时包含照料、利用和继承。'] },
    { id: 'sword', heading: '格拉墨从断片中重生', paragraphs: ['西格尔德的父亲西格蒙德曾保存断剑碎片，雷金据此重铸格拉墨。剑的重生连接两代人的命运，却不意味着新英雄自动获得父亲的全部身份；他仍需要作出自己的选择。', '锻造场景中，金属、火和锤击可以成为视觉事实与原创设计的分界。格拉墨是文本中的对象锚点，具体剑身纹样、鞘和工坊外观应标为 MythCanvas 诠释。'] },
    { id: 'dragon-task', heading: '走向法夫纳的巢穴', paragraphs: ['雷金推动西格尔德前往法夫纳所在之处，故事从家族叙事转入屠龙任务。西格尔德选择自己的马和路线，任务不只是被养父安排的机械执行。', '本篇以《雷金之歌》一至四十节为范围。法夫纳的形态、黄金诅咒和杀龙动作在《法夫尼尔之歌》及其他材料中进一步展开；页面将通过来源交叉链接，而不提前把后续细节全部并入。'] },
  ],
  'sigurd-kills-fafnir': [
    { id: 'pit', heading: '从地下等待巨龙', paragraphs: ['《法夫尼尔之歌》以西格尔德在道路旁挖沟伏击法夫纳为核心。杀龙不是正面竞技，而是对地形、时间和巨龙路线的判断；英雄在龙经过时从下方刺入其身体。', '法夫纳临死前并不只是被动怪物，他询问西格尔德的身份、提醒黄金的诅咒并试图改变他的判断。人与龙之间的问答让财富、名誉和死亡同时进入胜利后的时间。'] },
    { id: 'blood', heading: '龙血改变了感官', paragraphs: ['西格尔德接触龙血后获得特殊的感知，随后听见鸟的谈话，察觉雷金准备杀死他。文本把龙血写成叙事转折而不是可复制的魔法药水；它改变了英雄理解周围声音的方式。', '法夫纳留下的教诫涉及财富、亲属和危险，但页面会把这些话标为临死者的判断，不把它们变成无条件适用于现实的道德格言。'] },
    { id: 'regin', heading: '胜利没有切断养父关系', paragraphs: ['西格尔德杀死法夫纳后，雷金要求他取出龙心并烹煮。西格尔德尝到血后听见鸟预告雷金的背叛，最终杀死雷金；屠龙因此同时结束了一个家族债务，也制造了新的孤独。', '本篇以《法夫尼尔之歌》一至四十四节为主要范围。黄金、戒指和格拉墨与其他诗歌的关系通过物件链接呈现，不能把所有沃尔松格版本压成唯一连续剧本。'] },
  ],
  'sigurd-and-brynhildr': [
    { id: 'flames', heading: '穿过火焰的相遇', paragraphs: ['《沃尔松格萨迦》第二十至二十七章写西格尔德与布伦希尔德在火焰包围的住所相遇。火焰既是道路边界，也是对进入者的选择；西格尔德并非随意闯入一座普通住宅。', '萨迦中的人物身份、誓言与往后婚姻纠葛需要结合章节顺序阅读。页面不会把《西格德里法之歌》中的知识传授、萨迦中的布伦希尔德经历和所有诗歌版本无标签地混合。'] },
    { id: 'oath', heading: '誓言与记忆的错位', paragraphs: ['西格尔德与布伦希尔德之间形成承诺，但后续魔法、遗忘和社会安排使承诺无法直接进入婚姻秩序。故事的悲剧不在于一个简单的误会，而在于个人誓言被家族、王权和财富不断重新解释。', '页面会将布伦希尔德作为有判断、有愤怒和有行动的角色呈现，不能把她缩减为英雄获得的奖赏。西格尔德的英雄声望也不等于他能免于承诺造成的责任。'] },
    { id: 'scope', heading: '萨迦章节的边界', paragraphs: ['本篇以《沃尔松格萨迦》第二十至二十七章为主，重点是相遇、火焰、承诺与后续身份错位的前段。死亡、古德伦和尼夫伦格家族的展开另由其他 Story 处理。', '视觉上可使用火焰环、夜色中的道路、戒指与未完成的誓约手势作为锚点；人物服装、火焰色彩和空间结构属于原创设计，不复制现代影视或游戏中的布伦希尔德形象。'] },
  ],
  'sigurds-death': [
    { id: 'fragment', heading: '残篇中的死亡', paragraphs: ['关于西格尔德之死的诗歌材料以残片形式保存，本篇不能假装拥有一份没有缺口的完整剧本。残片显示死亡与婚姻、复仇、布伦希尔德和古德伦的关系相连，但人物动机和事件顺序需要与萨迦进行范围化比较。', '页面会把可直接读出的诗句、编辑重建和后世叙事分别标注。空白处不自动填入电影式对白，也不把不同诗篇中的重复名字当成同一段落的确定连续。'] },
    { id: 'betrayal', heading: '家族关系中的背叛', paragraphs: ['西格尔德的声望、布伦希尔德的誓言以及古德伦所属的家族网络共同推动悲剧。不同版本对杀害地点、执行者和前因有差异，但共同保留了英雄声誉无法保护他免于亲属政治的结构。', '这些差异不是需要被抹平的编辑噪声，而是北欧英雄传统的组成部分。页面使用“诗歌残片与萨迦比较”的明确标签，避免把某一版本的细节伪装成所有材料的共同事实。'] },
    { id: 'scope', heading: '与后续复仇分开', paragraphs: ['本篇以残篇诗歌为核心，并与《沃尔松格萨迦》作限定性对照。古德伦与阿特利、哈姆迪尔与索尔利等后续复仇故事另有来源和时间层，不在这里提前合并。', '视觉上可用断裂的戒指、空置的床榻、血迹被雪覆盖的道路等原创意象表达失去与版本残缺；具体场景不宣称是某一原典明确描述的考古复原。'] },
  ],
};

const curatedResearchTail: Readonly<Record<string, readonly StorySection[]>> = {
  'aesir-vanir-war': [
    { id: 'evidence-links', heading: '证据层与交叉阅读', paragraphs: ['古尔薇格、华纳神族与阿萨神族的页面链接应分别回到角色和神族关系，而不是用一条“战争阵营”标签替代所有身份。后续关于尼约德、弗雷和芙蕾雅进入阿萨体系的材料，需要以《诗语法》等来源单独标明。', '本篇的视觉构图只承诺一场神族共同体内部的裂变与余烬。城墙材质、仪式器物和人物服装属于原创设计；若加入金色、火焰或魔法效果，必须在 provenance 中说明它们不是诗节的直接描写。'] },
  ],
  'thryms-stolen-hammer': [
    { id: 'evidence-links', heading: '物件与人物的审校边界', paragraphs: ['妙尔尼尔是本篇的核心 MythicObject，芙蕾雅、索尔、洛基、海姆达尔和索列姆则承担不同的行动职责。页面不能把“女性婚礼服饰”作为对芙蕾雅身份的替代，也不能把洛基的协助改写成他独自解决了失锤问题。', '《索列姆之歌》提供的是一则具有喜剧节奏的取回故事，不是完整的古诺尔斯婚礼制度记录。任何宴席器具、织物纹样和巨人厅堂结构，都应放在 MythCanvas 原创设计层，并保留对来源范围的说明。'] },
  ],
  'thor-in-utgard': [
    { id: 'evidence-links', heading: '幻象、尺度与来源范围', paragraphs: ['乌特加德故事适合与斯克里米尔的旅程相邻阅读，但两篇不能因此合并成一篇“索尔闯巨人城”的单一事件。每个挑战的真实对象必须保留在本页的 Claim 与 dependency 中，尤其是海、世界蛇、老年和火焰的隐喻关系。', '视觉生产应优先表现大厅中的尺度差、视线和被重新命名的对象，而不是增加无来源的怪物种类。若使用世界蛇或远海意象，应通过关系链接回到它的独立故事，避免让幻象解释变成实体事实。'] },
  ],
  'thor-and-geirrod': [
    { id: 'evidence-links', heading: '残片材料的编辑纪律', paragraphs: ['本篇的依赖关系已经包含盖尔罗德、吉阿尔普、格蕾普、梅金吉奥德和铁手套等对象，但它们的出现仍需由人工逐项对照《索尔之歌》的选定诗节。数据上的闭包通过，不等于每个出场顺序都已完成校勘。', '产品页面应把“选定诗节”“后续散文比较”和“原创视觉补足”分成不同层级。这样既能保留索尔穿越巨人领地的阅读路径，也不会把一则残存材料包装成细节完整的动作冒险。'] },
  ],
  'fenrir-and-gleipnir': [
    { id: 'evidence-links', heading: '束缚、契约与后续结局', paragraphs: ['格莱普尼尔、提尔和芬里尔构成本篇最小的对象—人物闭环。奥丁在这里代表预见与决策，提尔代表承担风险，芬里尔代表被恐惧塑造的对手；三者的关系比简单的敌我标签更能解释故事。', '诸神黄昏中的挣脱和奥丁之死必须在独立 Story 中呈现。视觉可以让链条和狼口成为身份锚点，但不能直接把最终战场、火焰或维达尔的武器带入本篇，除非明确标为跨 Story 预示。'] },
  ],
  'lokis-feast': [
    { id: 'evidence-links', heading: '争辩文本的阅读方式', paragraphs: ['本篇的每一条指控都属于诗中角色的发言，不能自动升级为 MythCanvas 的事实 Claim。来源审校需要逐段区分叙述者、洛基、被指控者和后来注释者的声音，并记录无法由文本单独确认的身份或行为。', '宴席场景适合连接奥丁、索尔、芙蕾雅和提尔的关系页，但不应把所有争辩内容做成角色卡上的永久标签。视觉上可突出座次、空位和语言造成的距离，避免把伤害性言辞做成可消费的笑点。'] },
  ],
  'baldrs-dreams': [
    { id: 'evidence-links', heading: '梦、预言与后续故事', paragraphs: ['本篇的主要证据是一组短诗节，因此每一个扩展解释都必须有“诗节明说”“平行来源”或“编辑推断”的标记。奥丁前往亡者之地的行动可以支持知识追寻，但不能据此补写梦中人物的完整心理。', '它应作为巴德尔循环的入口，链接到巴德尔之死、葬礼和赫尔莫德的旅程，而不是提前泄露所有后续情节。视觉可以保持梦的未完成感，让空旷道路和未显形的死亡预兆承担叙事，而不是用明确怪物制造答案。'] },
  ],
  'baldrs-death': [
    { id: 'evidence-links', heading: '因果链与角色责任', paragraphs: ['本篇的审校重点是把弗丽嘉的誓言请求、槲寄生的遗漏、洛基的引导、霍德尔的行动和巴德尔的死亡按原文顺序排列。任何一环被省略，页面就会把复杂悲剧错误地压缩成“弱点被发现”。', '巴德尔死亡后进入葬礼和追寻，说明这个 Story 既是独立事件，也是巴德尔循环的转折。视觉设计可保留游戏场的公共性和槲寄生的微小尺度，以避免把来源中的因果关系改成一场现代战斗。'] },
  ],
  'baldrs-funeral': [
    { id: 'evidence-links', heading: '船名与葬礼对象', paragraphs: ['赫林霍尔尼、德劳普尼尔、纳娜和赫洛克金属于不同种类的依赖：船是场景中的物件，指环是赠礼，人物行动则构成仪式的社会关系。审校时必须确认每一项来源范围，尤其不能把赫林霍尔尼与纳格尔法混成同一艘船。', '本篇与赫尔莫德前往赫尔相邻，却不替后者完成谈判内容。图像应先表现神族失去成员后的共同仪式，再处理火焰、海岸和巨人力量，避免把悲伤简化成壮观爆炸。'] },
  ],
  'hermod-rides-to-hel': [
    { id: 'evidence-links', heading: '亡者空间的实体边界', paragraphs: ['赫尔莫德的请求建立了巴德尔循环中最清晰的条件结构：旅程、桥、守门者、统治者和返回条件层层递进。它们应该成为 World、Scene、Character 和 Claim 的可点击关系，而不是一张泛化的“地府地图”。', '本篇不直接宣布巴德尔可以返回，也不把赫尔描写成单纯阻止复活的反派。赫尔提出的是一个条件，条件失败的责任和后续拒绝需要在其他来源中继续审校。'] },
  ],
  'loki-bound': [
    { id: 'evidence-links', heading: '惩罚叙事的敏感处理', paragraphs: ['洛基受缚涉及严重身体伤害，页面需要在进入正文前提供内容提示，并避免用“惩罚很爽”或“恶有恶报”替代文本中的疼痛、时间和西格恩的劳动。编辑语气应描述事件，而不是替读者做道德快感判断。', '本篇还连接巴德尔之死与诸神黄昏，但不能把未来结局作为受缚的唯一意义。岩穴、毒蛇、碗和地震是来源锚点，颜色、岩层和镜头距离属于原创设计，需由视觉审校单独批准。'] },
  ],
  fimbulwinter: [
    { id: 'evidence-links', heading: '把灾变拆成可读节点', paragraphs: ['芬布尔之冬适合作为诸神黄昏 Volume 的环境入口：它先让读者感到时间、天气和亲属关系失效，再进入狼、海蛇和束缚崩解的更大尺度。页面不应把所有末日关键词挤在首屏，免得失去过程感。', '来源层只承诺诗节中的严冬、冲突和预兆；现代气候隐喻、灾难色彩和城市废墟是原创策展选择。若插画出现天体或狼，应说明它们来自相邻诗节的交叉阅读，而不是本页单一段落的全部内容。'] },
  ],
  'odin-and-fenrir': [
    { id: 'evidence-links', heading: '预言兑现而非简单决斗', paragraphs: ['奥丁与芬里尔的页面应回链到早先的束缚 Story，使读者看到“恐惧—控制—挣脱—吞噬”的连续关系。这里的胜负判断必须同时包含奥丁死亡、芬里尔被维达尔复仇和旧秩序无法恢复三个层次。', '维达尔的出场是结果的一部分，但不能让他覆盖奥丁与芬里尔的主体关系。视觉上应把吞噬动作控制在叙事关键瞬间，保留火焰和烟尘之外的宇宙尺度，避免纯粹怪兽海报。'] },
  ],
  'thor-and-jormungandr-final-battle': [
    { id: 'evidence-links', heading: '同一宿敌的两次相遇', paragraphs: ['本篇必须与索尔垂钓世界蛇的 Story 明确区分：前者是海上尝试和被割断的钓线，后者是诸神黄昏中已经无法回避的结局。两页可以共享 Character、World 和 Object 关系，但不能共享一张被裁切的战斗图。', '九步和毒液是本篇最重要的结束锚点。页面应把“击杀成功”和“守护者倒下”并置展示，避免用单一胜者标签破坏北欧材料中常见的双重代价结构。'] },
  ],
  'freyr-and-surtr': [
    { id: 'evidence-links', heading: '武器损失与来源分层', paragraphs: ['弗雷的剑、苏尔特和火焰边界构成本篇的核心依赖，但弗雷为何缺少武器，需要由《诗体埃达》或其他相关材料补充说明。审校记录应把“本章发生的战斗”和“跨文本解释”分成两列。', '本篇可以作为 Ragnarök 中丰饶与毁灭的对照，却不应把丰饶神塑造成现代自然精灵，也不应把苏尔特做成跨所有故事的终极反派。素材审批需要检查火焰、金属和人物轮廓是否仍然原创。'] },
  ],
  'heimdall-and-loki': [
    { id: 'evidence-links', heading: '号角、桥与最终冲突', paragraphs: ['加拉尔号角是可独立追踪的 MythicObject，海姆达尔是持有与吹响它的 Character，彩虹桥是承载守望和通行的 Scene。三者不能在数据上合并成一个“末日地点”，否则后续 AI Creator 会失去可控上下文。', '洛基与海姆达尔的共同死亡属于诗歌末日段落的强锚点；具体武器、动作和桥上空间不应伪装成原文逐帧描述。视觉审校重点是边界、声音和相遇的紧迫感，而不是堆叠更多角色。'] },
  ],
  ragnarok: [
    { id: 'evidence-links', heading: '全局 Story 与局部 Story 的关系', paragraphs: ['诸神黄昏总篇负责提供时间顺序和世界更新的总览，局部篇负责奥丁、索尔、弗雷、洛基、海姆达尔等人物的具体结局。两种页面都必须存在，否则总篇会过度拥挤，局部篇也会失去共同背景。', '审校时要逐节记录火焰、海水、幸存者、太阳和巴德尔回归的证据。后世散文、现代末日叙事和原创世界观可以作为对照或视觉灵感，但不能无标签地替代《女预言家之歌》的版本。'] },
  ],
  'sigurd-and-regin': [
    { id: 'evidence-links', heading: '养父、剑与任务的三角', paragraphs: ['雷金、格拉墨和法夫纳之间形成一条清楚的 dependency chain：人物提供知识与动机，物件提供行动能力，龙提供任务目标。页面应让读者看到这条链条，而不是把格拉墨单独展示成没有来历的“神剑”。', '本篇结束在走向法夫纳的任务门槛，屠龙过程使用《法夫尼尔之歌》的独立来源。这样做能保留诗歌之间的差异，也让未来 Story Series 在章节拆分时拥有真实的叙事容量。'] },
  ],
  'sigurd-kills-fafnir': [
    { id: 'evidence-links', heading: '龙、黄金与听见鸟声', paragraphs: ['法夫纳、格拉墨、安德瓦里之戒和龙心之间不是一组可自由替换的奇幻道具。每件物件都需要独立来源与 owner 关系，尤其要避免把戒指诅咒、龙血能力和剑的来历合成一个无差别“装备系统”。', '本篇的结尾进入雷金背叛，但西格尔德与西格德里法、布伦希尔德的关系仍在其他诗篇和萨迦中展开。视觉可以表现沟壕、龙血和山地道路，同时避免复制现代屠龙作品的盔甲或龙形。'] },
  ],
  'sigurd-and-brynhildr': [
    { id: 'evidence-links', heading: '萨迦与诗歌的交叉边界', paragraphs: ['布伦希尔德的身份在不同材料中与西格德里法、女武神和萨迦人物形成复杂对应。页面必须让读者看见当前采用的是《沃尔松格萨迦》第二十至二十七章，而不是把所有同名或相似事件压成一份统一传记。', '火焰、戒指、誓约和遗忘可以成为未来系列的视觉锚点，但每一项都要注明是文本事实、跨文本解释还是原创设计。这样才能在英雄传统与神族传统之间建立互链，而不造成身份污染。'] },
  ],
  'sigurds-death': [
    { id: 'evidence-links', heading: '残缺材料的诚实呈现', paragraphs: ['本篇的质量标准不是补齐所有空白，而是清楚地告诉读者哪些内容来自残片，哪些来自《沃尔松格萨迦》的比较，哪些仍待编辑决定。对英雄死亡的情绪强度不能成为伪造确定细节的理由。', '后续古德伦、阿特利、斯万希尔德和哈姆迪尔的页面应通过关系图继续展开，但每个页面保留自己的 source scope。视觉可表现断裂、空缺和家族网络，而不是用一张血腥插图覆盖所有版本差异。'] },
  ],
};

const curatedStructuredTail: Readonly<Record<string, readonly StorySection[]>> = {
  'ymir-creation': [{ id: 'cosmic-boundary', heading: '从寒冷裂隙到可居世界', paragraphs: ['本篇的创世空间不是一张已经完成的九界地图。冷雾、火焰、霜与空隙先构成环境条件，人物的行动才把这些力量组织为可叙述的世界；页面会保留这种从材料到秩序的过程感。', '创世图像中的尺度、颜色和岩层由 MythCanvas 重新设计，来源事实只负责支撑尤弥尔、冰火环境和世界形成的关系。后续阿斯加德、米德加尔特和世界树 Story 将分别承接不同结果。'] }],
  'audhumla-and-buri': [{ id: 'cosmic-boundary', heading: '舔出形体，形成谱系', paragraphs: ['奥德胡姆拉与布里的出现把创世从抽象环境转为身体、营养和谱系。牛舔冰块的动作与尤弥尔的存在并置，说明世界的开端不是只有一位创造者的单线行为。', '本篇不把奥德胡姆拉写成后世幻想中的普通巨兽，也不把布里自动延伸成完整家谱。冰面、盐味、乳汁与初代身体可作为视觉锚点，具体材质和构图仍须归入原创设计。'] }],
  'odin-creates-world': [{ id: 'cosmic-boundary', heading: '身体成为地理', paragraphs: ['尤弥尔之死在本篇中不是孤立的战斗，而是世界被重新组织的转换点。奥丁、威利与维把巨人的身体分配为土地、海、天空和边界，创世因此同时包含暴力、测量和命名。', '页面不会把“世界由尸体制成”解释成现代地质学，也不会补出原典没有给出的建筑蓝图。山、海、云和围墙的视觉设计需要明确区分文本事实、物质文化参考和 MythCanvas 原创层。'] }],
  'ask-and-embla': [{ id: 'cosmic-boundary', heading: '从木材到有名之人', paragraphs: ['阿斯克与恩布拉的故事关注的是被发现、赋予生命和获得能力的过程。两个木材形体并非已经拥有社会身份的人类，而是在诸神的行动后进入可以呼吸、看见、听见和说话的共同体。', '本篇不把三位神的职责写成固定技术清单，也不把海岸树林直接当作唯一原始地点。木材、风和人类聚落可成为视觉线索，具体脸貌、服饰和建筑属于原创诠释。'] }],
  'yggdrasil-wells-norns': [{ id: 'cosmic-boundary', heading: '世界树不是静态地图', paragraphs: ['世界树、井和根部共同构成一套持续运作的宇宙结构。树需要水、受到啃噬，也连接诸神与不同深度的空间；页面会把它呈现为关系网络，而不是把“九界”画成九个互不相连的旅游景点。', '三口井与诺恩的出场位置需要按诗节范围分层，不能把后世流行的完整九界清单倒灌到《格里姆尼尔之歌》。树皮、根须、湿石和水面的细节属于视觉设计层。'] }],
  'norns-at-urdarbrunnr': [{ id: 'cosmic-boundary', heading: '命运在井边被维护', paragraphs: ['诺恩在乌尔达之井的形象不是简单的三位女神名单，而是与树、井水和命运书写相连的工作关系。她们维护和浇灌世界树的行动，让命运具有持续劳动和环境依赖。', '本篇会把乌尔德、薇尔丹蒂与斯库尔德的名字、诗节范围和后世解释分开标记。水井、白色泥土和树根可以形成原创场景，但不能由视觉反推一套文本没有明说的命运机关。'] }],
  'sun-and-moon-chase': [{ id: 'cosmic-boundary', heading: '天空中的追逐是时间结构', paragraphs: ['日、月与追逐者的故事把天体运行写成不断被威胁的秩序。苏尔和马尼不是现代天文学图表中的拟人标签，斯库尔与哈提也不只是供战斗使用的怪兽；追逐让时间具有紧迫感。', '页面将天体、狼和末日预兆分层处理，早期运行与诸神黄昏中的吞噬不能合并成同一事件。天空弧线、夜色和太阳边缘的缺口属于原创视觉表达。'] }],
  'kvasir-and-mead': [{ id: 'evidence-links', heading: '知识如何进入蜜酒', paragraphs: ['克瓦希尔的知识、他的死亡和诗歌蜜酒的酿成构成一条不能拆散的因果链。蜜酒不是凭空出现的神奇饮料，而是由共同体、谋杀、血液和工艺共同留下的危险遗产。', '本篇会把克瓦希尔、诗歌蜜酒、苏图恩和奥丁的关系分别建模。后续奥丁夺取蜜酒的逃亡属于另一篇 Story；视觉可使用容器、发酵和岩窟，但不能把现代酒类工艺冒充原典细节。'] }],
  'odin-and-mimir': [{ id: 'evidence-links', heading: '知识需要付出身体代价', paragraphs: ['奥丁向密米尔之井求取知识，并以一只眼作为代价。这个动作不是“获得技能”的快捷交易，而是让统治者的身体留下持续可见的缺失；智慧与损失必须在页面中同时出现。', '井、密米尔和奥丁的关系应与世界树、诺恩和奥丁其他求知故事互链。水面、石井和单眼形象属于视觉锚点，井的建筑、光线和仪式动作仍需与来源事实分开。'] }],
  'freyr-and-gerdr': [{ id: 'evidence-links', heading: '欲望、谈判与失去武器', paragraphs: ['弗雷对葛德的凝视、斯基尔尼尔的出使和葛德的拒绝共同推动这条故事线。葛德不是被动地等待被带走的人物，她的回答、恐惧与最后的条件构成谈判的一部分。', '本篇的剑属于弗雷的独立物件依赖，后续在诸神黄昏的失武器问题中需要回链，而不能把《斯基尔尼尔之歌》的求婚直接改写成一套浪漫征服模板。'] }],
  'idunn-and-thjazi': [{ id: 'evidence-links', heading: '苹果、衰老与共同体责任', paragraphs: ['伊登的苹果在本篇中不是可无限补充的生命药水，而是诸神维持年轻与秩序的物件。夏基通过洛基取得机会，伊登被带离阿斯加德后，神族的衰老暴露出共同体对她和苹果的依赖。', '视觉可突出木箱、果实、鹰形和冬季衰败，但不能把伊登简化为“被救出的宝藏看守人”。她、洛基和夏基的行动动机需要在 Claim 与关系图中分别呈现。'] }],
  'skadi-compensation': [{ id: 'evidence-links', heading: '赔偿不是自动的和解', paragraphs: ['斯卡蒂进入阿斯加德是为了追究父亲夏基之死。诸神提出的赔偿包括让她选择丈夫和让她发笑等条件，故事由此同时涉及法律、羞辱、选择权和神族的权力不对等。', '本篇不会把她的笑声写成一场无害的喜剧，也不会把婚姻结果从补偿谈判中剥离。山地、脚部选择和被迫的笑可以进入原创构图，但人物的愤怒与边界必须保留。'] }],
  'thor-fishes-for-serpent': [{ id: 'evidence-links', heading: '海上相遇不是末日结局', paragraphs: ['索尔以牛头作饵、顶住船底并拉起世界蛇，说明这次垂钓依赖身体、船和海的共同尺度。海米尔割断钓线后，巨蛇沉回海中，故事的结果必须停在一次未完成的相遇。', '本篇应与诸神黄昏最后一战形成明确对照：同一对宿敌在不同来源和时间中出现，不能用末日死亡改写《海米尔之歌》的结束。船体、钓线和海面高度属于原创视觉表达。'] }],
  'volsung-and-sword-tree': [{ id: 'evidence-links', heading: '神剑进入家族而非凭空出现', paragraphs: ['沃尔松格大厅中的树与剑把王权、宴席和未来英雄连接起来。奥丁将剑插入树干，只有西格蒙德能够拔出，这个动作改变婚宴秩序，也让武器成为家族命运的可见证据。', '页面会把沃尔松格、奥丁、树中之剑和西格蒙德分别链接。树、木纹、宴席和剑柄的造型属于原创设计，不能直接复制某个现代传奇改编中的神剑轮廓。'] }],
  'signy-and-siggeir': [{ id: 'evidence-links', heading: '婚姻选择与家族复仇', paragraphs: ['西格妮与西格盖尔的婚姻从一开始就与树中之剑、沃尔松格家族的羞辱和后续报复相连。她不是英雄故事里的旁观者，而是在受限选择中不断安排信息、复仇和家族延续的人物。', '这条 Story 的暴力内容应以内容提示和克制语气呈现。森林、伪装、狼皮和大厅可以作为来源导向的视觉锚点，但具体仪式和服装必须避免把残酷复仇浪漫化。'] }],
  'sigmund-and-sinfjotli': [{ id: 'evidence-links', heading: '父子关系与狼形试炼', paragraphs: ['西格蒙德与辛菲奥特利的共同经历把家族复仇、流亡和狼形伪装放在同一条英雄传统中。二人的关系既是训练和合作，也是由过去暴力塑造的亲属关系，不能只用“师徒”概括。', '页面需要明确这组材料来自《沃尔松格萨迦》的章节范围，狼皮、森林和地下藏身处是叙事锚点，不等于可以确认的古诺尔斯变身仪式。视觉生产应避免把它做成现代狼人类型片。'] }],
  'odin-and-vafthrudnir': [{ id: 'evidence-links', heading: '问答中的知识边界', paragraphs: ['奥丁与瓦夫苏鲁德尼尔以赌命问答交换宇宙知识。问题从创世、天体和诸神延伸到末日，回答者的聪明并不只是百科知识，而是判断对方身份和最后一个问题风险的能力。', '本篇应与奥丁、密米尔和格里姆尼尔的求知故事互链，却不能把不同诗歌的宇宙清单合成唯一地图。视觉可突出火旁的问答、长夜和正在消失的安全感。'] }],
  'thor-and-hymir': [{ id: 'evidence-links', heading: '宴饮目标与海上试炼', paragraphs: ['海米尔之歌把大锅的需求、海上垂钓和巨人宅邸串成一条任务线。索尔的力量在此不是为了征服，而是为了让诸神共同体获得能够酿酒的器物；共同体目的使暴力与工具的关系更复杂。', '本篇与世界蛇垂钓 Story 共享部分来源范围，但承担不同结果：本篇继续到取得大锅，另一篇停在钓线被割断。页面必须通过场景和物件链接让读者看到两条线如何交叉。'] }],
  'loki-and-angrboda': [{ id: 'evidence-links', heading: '三个子女不是一种存在', paragraphs: ['洛基与安格尔伯达的 Story 将芬里尔、世界蛇和赫尔并置，却没有把三者变成同一种族或同一种性格。狼、蛇与亡者世界的统治者分别进入不同的后续叙事，依赖关系要保持这种差异。', '安格尔伯达在本章中的信息有限，页面不能从一个亲属节点扩写出没有来源的完整传记。视觉可用三个方向不同的空间线索表达预言分叉，但不能把她设计成某个现代女巫角色的复制品。'] }],
  'grimnir-revealed': [{ id: 'evidence-links', heading: '受刑之身说出宇宙', paragraphs: ['格里姆尼尔的启示把宇宙知识放在两堆火之间，王权的待客失败与奥丁的自我隐藏因此成为知识的条件。诗节中的地名、河流和大厅列表需要按文本范围阅读，而不是被当作完整地理测绘。', '本篇可以连接瓦尔哈拉、世界树和奥丁名字，但不替这些独立 Story 完成来源审校。视觉上应让火焰、束缚和声音占据中心，避免把奥丁塑造成无伤的全知角色。'] }],
  'valholl-and-valkyries': [{ id: 'evidence-links', heading: '大厅、战斗与亡者范围', paragraphs: ['《格里姆尼尔之歌》中的瓦尔哈拉有门、战斗、复生和宴饮，但它不是所有亡者去处的总称。女武神的名字与行动也需要按诗节而不是现代类型片惯例呈现。', '本篇与赫尔、巴德尔和诸神黄昏页面互链时，必须保留奥丁大厅与其他亡者空间的边界。门、屋顶、战斗循环和宴席可以形成视觉设计，但不能宣称它们是考古复原的唯一样式。'] }],
  'andvari-gold': [{ id: 'evidence-links', heading: '赔偿黄金成为连续债务', paragraphs: ['安德瓦里黄金从奥特之死和赫瑞德玛尔的赔偿要求开始，随后经由法夫纳、雷金和西格尔德进入英雄传统。黄金、戒指和诅咒不是三个可独立收集的奇幻物件，而是一条把暴力传递下去的叙事媒介。', '页面会将安德瓦努特、法夫纳和人物关系分别建模，并把《雷金之歌》的诗节与萨迦版本区分。金属色、宝藏洞穴和戒指的形态属于原创视觉层，不复制现代奇幻财宝设计。'] }],
  'thor-and-skrymir': [{ id: 'evidence-links', heading: '尺度错觉与乌特加德入口', paragraphs: ['斯克里米尔的手套、绳结和锤击把日常物件转换为巨人尺度的试验。索尔的力量没有消失，但他无法控制参照物，因此故事先让英雄和读者共同误判，再在乌特加德解释中重新校准。', '本篇与索尔在乌特加德的大厅挑战相邻，却保留第四十五章的旅程边界。手套、山体裂缝和背负行囊是来源锚点，巨人身形、道路和天气属于原创设计。'] }],
  'loki-and-baldr': [{ id: 'evidence-links', heading: '同一事件的因果入口', paragraphs: ['洛基与巴德尔之死是巴德尔循环中的因果入口：它聚焦洛基如何发现槲寄生、如何引导霍德尔以及死亡如何发生。巴德尔之死的独立页面则承担更完整的誓言和共同体背景，两页不能彼此重复又互相矛盾。', '页面将洛基、霍德尔、弗丽嘉、槲寄生与巴德尔的关系分开记录。视觉可突出洛基的观察与霍德尔的盲点，但不能把霍德尔描绘成主动策划者，也不能把槲寄生设计成现代奇幻武器。'] }],
  'sigmunds-death-and-hjordis': [{ id: 'evidence-links', heading: '断剑保存了未出生的未来', paragraphs: ['西格蒙德之死的关键不是一场孤立败战，而是断剑、希奥尔迪斯和腹中的西格尔德共同构成的传递关系。希奥尔迪斯的决定让女性角色成为英雄传统的主动保存者，而不是只被等待的新英雄母亲。', '本篇应与沃尔松格树中神剑和西格尔德与雷金的 Story 互链。独眼战士、断裂的剑和战后帐篷可以成为视觉锚点，但不能把未在章节中说明的战甲和战术当作史实。'] }],
  'loki-at-ragnarok': [{ id: 'evidence-links', heading: '从受缚到末日来者', paragraphs: ['洛基在末日段落中的位置，需要和先前受缚故事以及海姆达尔—洛基最终冲突同时阅读。诗歌只给出船、集结和结局的关键图像，不能用散文的每一个前史细节填满诗节留白。', '本篇的场景依赖彩虹桥和世界末日集结，物件依赖加拉尔号角的跨页链接。视觉应让洛基的到来具有不可逆的方向感，同时保留诗歌对战争规模和细节的省略。'] }],
  'sigurd-and-sigrdrifa': [{ id: 'evidence-links', heading: '知识传授先于浪漫归类', paragraphs: ['西格德里法向西格尔德传授符文与处世劝诫，说明两人的相遇首先是一场知识交换。页面不能只用“睡美人被唤醒”的现代故事模板覆盖她的言说、判断和警告。', '布伦希尔德与西格德里法的身份对应需要在 source scope 中保留解释空间。火焰、盾墙和符文刻痕可以作为视觉锚点，但符号设计不得声称是原诗中完整的视觉谱系。'] }],
  'gudrun-and-atli': [{ id: 'evidence-links', heading: '复仇不等于恢复秩序', paragraphs: ['古德伦对兄弟被杀的复仇把宴席、亲属关系和极端暴力连在一起。页面需要保留她作为行动者的复杂性，同时对杀害儿童和家庭暴力提供明确提示，不将诗歌的残酷场面游戏化。', '本篇与西格尔德之死、斯万希尔德和哈姆迪尔兄弟的 Story 互链，但采用《阿特利之歌》的独立范围。黄金、门厅、火焰和哀歌可进入视觉策展，不能用现代复仇英雄模板简化其伦理断裂。'] }],
};

const curatedStructuredDeepTail: Readonly<Record<string, readonly StorySection[]>> = {
  'odin-and-vafthrudnir': [{ id: 'question-structure', heading: '最后一个问题改变身份', paragraphs: ['问答的悬念不只在答案是否正确，也在于谁能够提出只有亲身经历者才知道的问题。奥丁以伪名进入，却在最后让对方意识到回答者本身就是被询问的对象。', '本篇的火旁空间、杯盏和长夜可以表达知识竞赛的风险，但不能把诗歌中的宇宙知识改造成游戏化技能树。每一条知识 Claim 都应保留对应诗节范围。'] }],
  'thor-and-hymir': [{ id: 'object-consequence', heading: '大锅改变的是共同体能力', paragraphs: ['海米尔的大锅不是一次冒险结束后摆在页面上的战利品，它让诸神能够举行宴饮，也把索尔、提尔和海米尔之间的关系连接到共同体的需要。器物的尺度因此同时是叙事目标和视觉焦点。', '本篇对大锅的来源、垂钓和归途分别标记，避免将不同诗节的紧张感压成单一战斗。未来若制作物件卡，应使用锅的来源与用途，而不是只突出巨大尺寸。'] }],
  'grimnir-revealed': [{ id: 'voice-and-power', heading: '言说也是一次脱困', paragraphs: ['格里姆尼尔在火堆之间说出诸神名字，并不等于他从一开始就可以自由讲述。言说的节奏被八夜囚禁、王子的饮水和国王的误判共同塑造；知识由受限的身体传递。', '故事结尾的身份揭示改变了王权关系，却没有把所有神域知识变成一份可随意复制的地图。页面会为名字、居所和河流保留各自的来源范围。'] }],
  'valholl-and-valkyries': [{ id: 'cyclic-hall', heading: '循环不是永恒军队的说明书', paragraphs: ['战死者白日战斗、夜晚回到大厅的循环，是诗歌描述中的特殊秩序，不应直接扩展为所有北欧亡者的共同命运。女武神的服务与选择也必须依据诗节，而非现代作品的统一职业设定。', '页面将瓦尔哈拉与赫尔、巴德尔葬礼和诸神黄昏中的亡者区分开。大厅的门、屋顶和宴席可做原创空间，但不能让视觉设计消解来源中的限定语气。'] }],
  'andvari-gold': [{ id: 'debt-chain', heading: '戒指把故事交给下一代', paragraphs: ['安德瓦里留下的诅咒并没有在赔偿完成时结束，它沿着赫瑞德玛尔、法夫纳和雷金的家族关系继续传递。黄金的价值越高，人物越难把它从亲属债务和暴力中分离出来。', '本篇结尾应引导读者进入雷金与西格尔德，而不是直接跳到屠龙后的宝藏。这样物件关系既支持阅读连续性，也不会把黄金做成脱离悲剧语境的收藏奖励。'] }],
  'thor-and-skrymir': [{ id: 'scale', heading: '被误认的屋子与山体', paragraphs: ['手套被当作屋子、食物袋无法打开、锤击被解释为山体裂缝，这些细节共同说明巨人的尺度不只是身体大小，而是改变了日常物件的意义。索尔的力量必须在错误的参照系中重新被测量。', '本篇结束于通往乌特加德的门槛，读者可以继续进入大厅挑战，但不应在本页提前合并乌特加德洛基的身份和所有魔法。旅途的未完成感是故事结构的一部分。'] }],
  'loki-and-baldr': [{ id: 'causal-chain', heading: '把引导者与执行者分开', paragraphs: ['洛基发现槲寄生、霍德尔投掷和巴德尔死亡之间存在清楚的行动链。霍德尔的失明和被引导处境不能被省略，否则页面会把一个被操纵的人错误写成全部罪责的唯一承担者。', '这条 Story 与巴德尔之死总篇共享角色和槲寄生对象，但它的重点是洛基的行动位置。未来的插画应保持公共游戏场、盲点和微小植物之间的空间关系。'] }],
  'sigmunds-death-and-hjordis': [{ id: 'inheritance-detail', heading: '母亲保存的不是抽象血统', paragraphs: ['希奥尔迪斯保存剑碎片并生下西格尔德，使英雄继承不只是父系血统自动延续。她在战后对物件、婚姻和孩子的安排，决定了断剑能否回到下一代。', '本篇与格拉墨和西格尔德前史互链时，应保留萨迦章节的时间顺序。视觉可以将碎片、包裹和未出生的孩子并置，但不能凭后世英雄图像补写希奥尔迪斯的服装与宫室。'] }],
  'loki-at-ragnarok': [{ id: 'end-stage', heading: '末日图像保留省略', paragraphs: ['《女预言家之歌》用船、号角、火和冲突的短促图像推进结局，省略了许多现代叙事会要求解释的战术细节。页面应该尊重这种诗歌速度，让读者从关系和象征进入，而不是制造虚假的逐帧确定性。', '洛基与海姆达尔的同死是明确锚点，具体武器与动作则需标为原创。这样本篇可以和完整诸神黄昏总篇互相补充，却不取代诗歌本身的残缺和力量。'] }],
  'sigurd-and-sigrdrifa': [{ id: 'counsel-detail', heading: '劝诫构成另一种英雄性', paragraphs: ['西格德里法传授的内容覆盖饮酒、誓言、符文、语言和行动，说明英雄成长不只由击杀和财宝构成。页面会把这些劝诫按诗节组织，而不是把它们切成可以随意装备的技能。', '火焰与盾墙提供强烈的空间意象，但人物的言说仍是核心。视觉设计应让传授者拥有与西格尔德相等的叙事重量，避免把她只表现为被唤醒后的奖励。'] }],
  'gudrun-and-atli': [{ id: 'grief', heading: '复仇后的空缺仍然存在', paragraphs: ['古德伦的复仇摧毁了宴席和家庭，却没有让她重新获得已经失去的兄弟、儿子或婚姻。故事的力量来自行动和不可逆空缺同时存在，而不是来自一个可以庆祝的胜利结算。复仇完成之后，哀悼并没有被叙事自动取消。', '本篇应以内容提示、克制的图像和明确的来源范围呈现。火、门厅和哀歌可以支持氛围，但不应把儿童死亡和亲属暴力包装成收藏卡上的刺激卖点。'] }],
};

const curatedSupplementaryTail: Readonly<Record<string, readonly StorySection[]>> = {
  'helgi-hundingsbani': [{ id: 'supplementary-context', heading: '英雄名字与女武神的共同叙事', paragraphs: ['赫尔吉的得名、战船和西格伦的出现共同构成英雄身份，不能只提取一场胜利战斗。诗歌让人物的名誉、亲属冲突和女武神的判断互相推进，英雄因此是关系网络中的位置，而不是单独的战士剪影。', '本篇使用《赫尔吉·洪丁斯巴尼之歌 I》一至五十七节，第二首诗中的葬丘和归来另行处理。视觉可以使用船首、风中旗帜和远处女武神的提示，但不得把两首诗或不同赫尔吉传统合成一部无差异传记。', '未来的角色与 Story 页面应保留西格伦的行动和家族关系，并对战争、婚姻和死亡提供克制的内容说明。这样英雄传统才能与诸神主线并列，而不是被重新包装成神祇冒险。'] }],
  'volundr-captive-smith': [{ id: 'supplementary-context', heading: '技艺与囚禁的伦理核心', paragraphs: ['沃伦德被囚禁在岛上后继续锻造，技艺在这里既是能力也是被迫劳动的证据。页面不能只展示铁匠火花和精巧物件，而要让读者看见尼杜德如何控制身体、空间与作品归属。', '《沃伦德之歌》一至十九节包含女伴离去、戒指、岛上工坊和身体伤害等不同层次。逃离篇另有二十至四十一节，页面通过拆分保留时间顺序，不把复仇结果提前压进囚禁段落。', '视觉可使用孤岛、低矮工坊、铁砧和被夺走的戒指，但具体工艺工具、王室服装与建筑形式属于原创设计。严重身体伤害需要内容提示，不能被美化成天才受难的装饰。'] }],
  'helgi-hjorvardsson-and-svava': [{ id: 'supplementary-context', heading: '命名、选择与独立传统', paragraphs: ['斯瓦瓦在赫尔吉获得名字和未来行动中扮演主动角色。她不是把武器交给英雄后退出的神秘配角，而是参与命名、战争和誓言的女武神人物，页面需要保留她的决策位置。', '本篇采用《赫尔吉·希奥尔瓦尔松之歌》一至五十一节。它与洪丁斯巴尼两首诗并列，却不能因为“赫尔吉”同名就自动合并；人物、亲属与前史应按每首诗的传统范围处理。', '视觉上可以把航行、女武神和誓言放在同一条关系线上，但不应借用另一位赫尔吉的角色轮廓。物质细节和服饰仍属于 MythCanvas 原创设计层。'] }],
  'helgi-and-sigrun': [{ id: 'supplementary-context', heading: '选择与家族战争同时发生', paragraphs: ['西格伦的选择并不是脱离家族的浪漫决定。她的婚姻安排、亲属敌对和支持赫尔吉的行动同时存在，诗歌因此把爱与战争放在同一个高压环境中，而不是给出无代价的逃离。', '本篇使用《赫尔吉·洪丁斯巴尼之歌 II》一至五十一节，葬丘和夜间归来另有专门 Story。这样可以把西格伦的主动性、赫尔吉的战事和死亡后的哀悼分别呈现。', '页面对战争和亲属杀戮提供内容提示；视觉可使用营火、战船和传递消息的动作，但不把西格伦设计成现代幻想中的无来源女战士。'] }],
  'helgi-burial-mound': [{ id: 'supplementary-context', heading: '短暂归来不能取消死亡', paragraphs: ['赫尔吉在葬丘中一夜归来，诗歌让相会发生在一个明确的地点与时间边界。黎明到来后他仍需离去，哀悼因此没有被超自然相遇治愈，反而被重新确认。', '本篇使用《赫尔吉·洪丁斯巴尼之歌 II》三十九至五十一节，不把赫尔吉与巴德尔、奥丁或赫尔的其他亡者传统混成同一规则。葬丘是中介空间，不是通往所有死者世界的固定入口。', '视觉构图应把夜色、土丘、短暂的身体存在和黎明后的空位放在一起。光线、石头和服饰属于原创设计，来源事实只支撑相会与离去的关系。'] }],
  'volundr-escape': [{ id: 'supplementary-context', heading: '逃离与报复都留下伤口', paragraphs: ['沃伦德的逃离不能被单独包装成飞行奇观，因为前段包含对尼杜德家族的严重报复和性暴力。页面必须明确内容警示，描述权力不对等和伤害后果，而不是以“复仇成功”替受害者和加害者结算道德。', '《沃伦德之歌》二十至四十一节写出翅膀、岛屿、王室家人和离去的动作。与囚禁篇分开能让读者看见技艺如何在不同阶段成为控制工具、报复工具和逃生工具。', '视觉可以使用高处飞行、海面与空置工坊，但避免蒸汽朋克或现代超级英雄式翅膀。材质、身形和建筑需要经过文化边界审校。'] }],
  'nidhoggr-and-world-tree': [{ id: 'supplementary-context', heading: '树根下的侵蚀不是单一恶兽', paragraphs: ['尼德霍格位于世界树根部的形象，让宇宙树显示出损耗、啃噬与不稳定。它不是一个可以脱离树的“Boss”，而是世界结构中持续发生的破坏力量；页面应把角色和环境同时呈现。', '《格里姆尼尔之歌》三十二至三十五节还提到树上、树下和不同动物的关系。当前故事只承担尼德霍格与根部的范围，不能从短诗节扩写成完整地下王国地理。', '视觉上可使用潮湿根系、暗处的咬痕和上方树冠的微光，但不把黑暗直接等同邪恶。材料、空间和生物轮廓属于原创设计，来源说明要保持精确。'] }],
  'odin-ravens': [{ id: 'supplementary-context', heading: '知识也包含无法控制的返回', paragraphs: ['胡金与穆宁每天飞越世界，为奥丁带来观察与记忆，但诗节同时表达奥丁担心它们不会返回。乌鸦不是没有风险的情报设备，飞行的价值正由可能失去而获得重量。', '本篇以《格里姆尼尔之歌》第二十节为范围，不把后世对两只乌鸦的象征解释写成诗节明说的心理系统。角色、乌鸦和阿斯加德的链接可以保留，具体羽色、栖架和飞行路径属于原创视觉。', '页面可与奥丁求知、瓦尔哈拉和世界树等 Story 互链，但应避免把所有知识故事压缩成“奥丁无所不知”的单一标签。'] }],
  'odin-seidr': [{ id: 'supplementary-context', heading: '魔法与社会评价同时存在', paragraphs: ['《英灵格林伽萨迦》第七章谈塞德时，既描述它能够预知和造成影响，也记录了中世纪文本对施术者社会身份的评价。页面必须区分叙述中的规范性判断和我们对历史实践的推断。', '奥丁与芙蕾雅的关系不应被写成一项无争议的师徒设定。来源支持的是传授与实践的联系，具体仪式、工具和服装仍然属于解释范围，不能用现代女巫或游戏法师模板替代。', '视觉可把预言、纺线、声音和边界空间做成氛围线索，但不要把塞德图像化为固定法阵。敏感内容和性别观念需要在编辑审校中明确标注。'] }],
  'thor-and-thjalfi-roskva': [{ id: 'supplementary-context', heading: '补偿关系中的选择与代价', paragraphs: ['夏尔菲折断山羊腿骨的行为导致索尔的旅伴关系改变，罗丝克瓦也因此一同离开。故事不是一个简单的“收服侍从”起源，而是伤害、补偿和新的依附关系叠加在一起。', '《欺骗古鲁菲》第四十四章中的山羊复活、家庭晚餐与旅程开端应按章节顺序呈现。视觉可以表现羊、火旁的家庭和清晨的道路，但不能把补偿直接改写成现代契约或游戏招募。', '夏尔菲与罗丝克瓦在后续故事中的行动需要继续建立，而不是在本篇被固定为没有成长的附属角色。页面对动物伤害提供克制说明。'] }],
  'thor-and-alviss': [{ id: 'supplementary-context', heading: '问答把语言变成试炼', paragraphs: ['阿尔维斯希望娶索尔的女儿，索尔没有立即战斗，而是用连续问题拖延到日出。不同族类对天空、土地、海和火的称呼构成诗歌的核心，语言知识本身成为力量。', '本篇使用《阿尔维斯之歌》一至三十五节，不把石化写成所有矮人的共同命运，也不把阿尔维斯的婚姻要求当作无争议的社会制度。', '视觉可以突出门口、夜色、问答双方的距离和即将升起的太阳；词语的变化应通过排版和来源说明表达，而不是添加无来源的魔法特效。'] }],
  'thor-and-harbard': [{ id: 'supplementary-context', heading: '渡口上的身份游戏', paragraphs: ['《哈巴德之歌》把索尔困在河的一侧，让他与船夫隔水争辩。哈巴德通常被解释为奥丁的化名，但诗歌的嘲讽、表演和身份游戏要求页面保留“通常被理解为”的编辑语气。', '本篇使用一至六十节，不能把船夫的每一句夸耀都自动当成奥丁的神话事实。渡口、船、雨和两侧的距离可以成为视觉锚点，人物的武器和服装属于原创设计。', '这则故事适合与索尔的其他旅程、奥丁的化名和知识竞争互链，却不应被做成单纯的喜剧对话截图。'] }],
  'vali-avenges-baldr': [{ id: 'supplementary-context', heading: '迅速成长的复仇者', paragraphs: ['《女预言家之歌》用极短篇幅写瓦利一夜成长并杀死霍德尔。短促叙述本身就是来源特征，页面不能补写一个完整的成长蒙太奇，也不能把瓦利的行动扩展为所有复仇法则。', '本篇连接巴德尔循环和诸神黄昏，但核心证据只在第三十二至三十三节。视觉可以表现未完成的童年、突然长大的身体和清晨的复仇动作，具体年龄、盔甲和武器属于原创设计。', '编辑语气需要同时承认诗歌的明确结果与现代读者对暴力复仇的距离，不能把霍德尔简化成没有处境的敌人。'] }],
  'tyr-and-garmr': [{ id: 'supplementary-context', heading: '末日配对不等于身份合并', paragraphs: ['《欺骗古鲁菲》第五十一章把提尔与加姆安排在诸神黄昏的相互毁灭中，但这一配对不能自动证明加姆、芬里尔和其他狼形存在是同一角色。页面必须保留名称与来源的差异。', '提尔早先在芬里尔束缚中失去一只手，本篇的末日战斗可以通过关系链接呈现后果，却不应把两场战斗合并成一张连续插画。', '赫尔世界、末日战场和加姆的门槛位置由来源分别支持；具体犬形、岩石和火焰构图属于原创视觉，不能用现代地狱猎犬形象替代。'] }],
  'gudrun-svanhild-hamdir-sorli': [{ id: 'supplementary-context', heading: '复仇链条中的失败', paragraphs: ['《哈姆迪尔之歌》不是古德伦复仇成功的庆典，而是母亲推动儿子、兄弟走向敌境后仍以失败和哀歌收束。斯万希尔德的死、哈姆迪尔与索尔利的行动和家族关系需要按诗歌顺序呈现。', '本篇使用一至三十节，与《阿特利之歌》和西格尔德死亡的材料互链但不合并。石头、道路和被围攻的空间可以作为视觉锚点，暴力与家族复仇必须提供内容提示。', '古德伦在这里既是推动者也是承受者，不能只用“复仇母亲”一个标签覆盖她的失去。页面应保留版本与解释差异。'] }],
  'svipdagr-and-mengloth': [{ id: 'supplementary-context', heading: '复合传统需要明确标注', paragraphs: ['《格罗娅的咒语》和《菲奥尔斯温之歌》常被编辑合称为斯维普达格传统，但两组材料的组合与故事连续性本身需要审查。页面应把母亲的咒语、旅程和门前问答作为相互连接的段落，而不是无缝的唯一原典。', '斯维普达格、格罗娅和孟格洛德的角色依赖已经建立，后续审校需要确认每个名字与行动属于哪个诗篇。视觉可以使用门、风雪、咒语和等待，但不能把复合传统当成一套固定地图。', '本篇明确列为独立埃达传统，暂不把它并入沃尔松格英雄家系或奥丁主线。编辑说明本身是内容的一部分。'] }],
  'rig-and-social-orders': [{ id: 'supplementary-context', heading: '记录文本中的等级想象', paragraphs: ['《里格之歌》通过陌生人访问三户家庭和谱系结果描述社会等级。页面可以解释文本如何组织身份与劳动，但不能把诗歌中的等级结构包装为 MythCanvas 认可的自然秩序。', '本篇使用选定诗节，来源并不支持一份完整的社会制度百科。房屋、食物、织物和劳动场景可作为物质文化参考，但其具体布置与视觉叙事需要标注时代和地区的不确定性。', 'Rígr 作为角色与“社会秩序”作为主题需要分开建模，避免把一个叙事称号误当成所有北欧神群的通用分类。'] }],
  grottasongr: [{ id: 'supplementary-context', heading: '磨坊与被迫劳动', paragraphs: ['《格罗蒂之歌》中的两位女巨人被迫推动磨坊，财富生产因此与奴役、战争和统治者的贪欲连在一起。页面不能只展示会产出黄金或和平的神奇磨坊，而必须保留劳动者的声音和疲惫。', '本篇使用选定诗节，具体人物姓名、地理和磨坊机制需要逐项确认。磨石、海岸、黑夜和远方军队可以进入原创视觉，但不能借用现代工业奴役图像或把痛苦游戏化。', '这条独立传统适合作为社会与劳动主题的入口，不应被强行并入诸神黄昏或沃尔松格英雄主线。'] }],
};

const curatedSupplementaryDeepTail: Readonly<Record<string, readonly StorySection[]>> = {
  'helgi-hjorvardsson-and-svava': [{ id: 'editorial-followup', heading: '与其他赫尔吉保持距离', paragraphs: ['相同的名字和女武神主题容易诱发跨篇合并，因此页面在继续阅读区域明确列出本篇与洪丁斯巴尼传统的区别。人物的出生、亲属和结局不能只凭名字相似推断。', '这条传统的原创视觉应围绕命名、航海和承诺，而不是借用另一位赫尔吉的盔甲、船队或爱情构图。'] }],
  'helgi-and-sigrun': [{ id: 'editorial-followup', heading: '把主动性留给西格伦', paragraphs: ['西格伦的行动是本篇的重要证据，页面在人物链接和摘要中都不把她降格成赫尔吉的附属关系。未来关系图可以同时呈现她与家族、未婚对象和赫尔吉的冲突。', '这能让英雄诗歌的爱情、战争和亲属责任保持张力，也避免以现代浪漫模板覆盖诗歌的暴力后果。她的选择同时改变了家族关系，并把个人愿望带入公开的亲属冲突。'] }],
  'helgi-burial-mound': [{ id: 'editorial-followup', heading: '夜间相会的时间边界', paragraphs: ['葬丘归来只在夜晚发生，黎明不是装饰性的光线变化，而是故事规则的结束。页面应让读者清楚知道相会不能延长成生者与死者的日常生活。', '这一限制也帮助它与巴德尔葬礼、赫尔莫德旅程和其他亡者叙事区分，避免建立一套跨传统的复活规则。黎明后的空位必须留在画面中，并继续影响西格伦的哀悼与等待，也让夜晚的希望在黎明后再次消失。'] }],
  'volundr-escape': [{ id: 'editorial-followup', heading: '不把飞行变成奖励动画', paragraphs: ['沃伦德的飞行发生在伤害之后，页面先呈现权力关系，再呈现技术结果。翅膀使他离开岛屿，却没有消除已经造成的创伤。', '这条编辑顺序对视觉很重要：高空景象应与空置工坊和受伤身体的记忆并置，而不是用明亮英雄海报抹掉前文。逃离本身不是道德上的洗白，也不是对伤害的自动补偿。'] }],
  'nidhoggr-and-world-tree': [{ id: 'editorial-followup', heading: '环境关系先于怪物标签', paragraphs: ['尼德霍格的身份要通过树根、啃噬和其他生物关系理解。页面不把它单独做成“地下首领”，而把环境侵蚀作为世界内容的一部分。', '后续视觉与 AI Creator 上下文应保留根系的湿度、树的尺度和上方世界的联系，避免用黑色火焰替代来源中的冷暗空间。'] }],
  'odin-ravens': [{ id: 'editorial-followup', heading: '两只乌鸦的功能有限而明确', paragraphs: ['诗节只提供每天飞越世界和奥丁担忧不归的简洁信息。页面不会把它扩写成每一条神话新闻都由乌鸦解释的全知系统。', '这一限制使乌鸦更适合做知识与记忆的视觉锚点，而不是带有现代间谍设备感的道具。它们的风险感不能被后世符号化抹掉，失去返回的可能正是诗节的情绪核心。'] }],
  'odin-seidr': [{ id: 'editorial-followup', heading: '不把中世纪评价当作历史定论', paragraphs: ['关于塞德的性别和社会评价需要注明它们来自中世纪文本的叙述框架。产品不能把作者的道德批评直接翻译成古代社会的唯一事实。', '页面以来源、概念和争议说明为主，视觉只使用纺线、预言和边界等抽象线索，不制作固定的魔法法阵或职业制服。'] }],
  'thor-and-thjalfi-roskva': [{ id: 'editorial-followup', heading: '侍从关系仍需保留人情后果', paragraphs: ['夏尔菲和罗丝克瓦离开家庭并非没有代价，故事的补偿同时改变了他们的生活路径。页面应让这份改变存在，而不是只突出索尔获得了两个助手。', '山羊、晚餐和道路构成从家庭到旅程的过渡，适合做连续阅读节点，也能防止角色被压缩成无名 NPC。'] }],
  'thor-and-alviss': [{ id: 'editorial-followup', heading: '知识对话不是技能表', paragraphs: ['阿尔维斯之歌的重复问答包含不同族类的世界命名方式，编辑时应保留诗歌的节奏和异名，而非把答案整理成现代百科表格。', '日出结束谈判，说明时间限制与语言同样重要。视觉可以使用天空逐渐变亮的过程，而不是增加更多战斗特效。石化结果应保持来源范围，并让读者看到时间如何取代武力完成结局。'] }],
  'thor-and-harbard': [{ id: 'editorial-followup', heading: '把身份的不确定性写出来', paragraphs: ['哈巴德是否就是奥丁是重要的解释问题，页面可以显示常见理解，但不能在没有限定语的情况下把船夫的所有经历写成奥丁自述。', '渡口的隔离让语言冲突比武器冲突更重要，适合用两岸构图、船桨和等待表现关系，而不是把作品改成索尔对战奥丁。争辩本身就是故事结果。'] }],
  'vali-avenges-baldr': [{ id: 'editorial-followup', heading: '短诗节不提供完整成长传记', paragraphs: ['瓦利一夜成长的叙述应保留其突兀和神话性。页面不需要用现实年龄、训练过程或完整家谱把留白填满。', '他的复仇与巴德尔之死、霍德尔和诸神黄昏互链即可；视觉只需确认复仇节点，不添加来源没有的武器谱系。诗歌的简略正是需要保留的特征。'] }],
  'tyr-and-garmr': [{ id: 'editorial-followup', heading: '名称差异必须可见', paragraphs: ['加姆、芬里尔和其他狼形生物在产品中分别拥有来源范围和身份锚点。关系图的末日敌对边不能绕过名称差异直接合并。', '提尔的前史可以作为上下文链接，但本页继续聚焦第五十一章的相互毁灭，不重复芬里尔束缚的完整叙事。相互毁灭的结果需要独立显示。'] }],
  'gudrun-svanhild-hamdir-sorli': [{ id: 'editorial-followup', heading: '失败也是传统的结尾', paragraphs: ['兄弟的行动没有恢复古德伦失去的家庭，诗歌的结束感来自失败、石头和哀歌。页面不能把复仇路线包装成最终胜利。', '视觉可使用荒野道路和石击后的停顿，避免将亲属暴力设计成爽感战斗或商品化的刺激动作。古德伦的哀悼仍然是结尾的一部分，并把这条线留在未能修复的家族关系中。'] }],
  'rig-and-social-orders': [{ id: 'editorial-followup', heading: '描述不等于认可', paragraphs: ['本篇的编辑说明必须明确：记录文本中的社会等级想象，与认可这种等级秩序是两件事。读者应能区分来源叙述、历史解释和 MythCanvas 策展立场。', '房屋、食物与纺织物可作为视觉参考，但不应被呈现成可供现代社会模仿的生活模板。'] }],
  grottasongr: [{ id: 'editorial-followup', heading: '劳动者需要留在画面里', paragraphs: ['磨坊的主人、女巨人和战争结果不能只留下一个会产出财富的器物。人物的声音和强迫劳动是这首诗的叙事中心。', '页面以警示、来源范围和克制视觉呈现，避免把被奴役者的痛苦改造成奇幻工业美学。磨坊的声音和重复劳动应成为阅读节奏的一部分，财富的增长不能遮蔽劳动者付出的代价与战争后果。'] }],
};

const sectionsForStory = (input: StoryInput): readonly StorySection[] | undefined => {
  const baseSections = input.sections ?? (() => {
    const curated = curatedResearchSections[input.slug];
    return curated ? [...curated, ...(curatedResearchTail[input.slug] ?? [])] : undefined;
  })();
  if (!baseSections) return undefined;

  return [
    ...baseSections,
    ...(curatedStructuredTail[input.slug] ?? []),
    ...(curatedStructuredDeepTail[input.slug] ?? []),
    ...(curatedSupplementaryTail[input.slug] ?? []),
    ...(curatedSupplementaryDeepTail[input.slug] ?? []),
    {
      id: 'editorial-scope',
      heading: '来源、依赖与继续阅读',
      paragraphs: [
        `本篇以 ${sourceForStory(input).title}（${sourceForStory(input).locator ?? '待补 locator'}）为主要来源范围，当前摘要只承诺：${input.summary}`,
        `在${input.tradition}的叙事位置中，页面将本篇处理为一条可追踪的阅读入口：${input.narrative}`,
        `本篇当前关联 ${input.characters.length} 位人物、${input.worlds?.length ?? 0} 个世界、${input.scenes?.length ?? 0} 个场景与 ${input.objects?.length ?? 0} 件物件；这些关系需要与正文和 Claim 一起审校，不能单独视为事实证明。`,
        '视觉与生成上下文会继续区分来源事实、物质文化参考和 MythCanvas 原创设计；未被本篇来源支持的服装、建筑、动作与镜头，不会因为页面存在链接就被写成古代原典事实。',
      ],
    },
  ];
};

const storyBlocks = (input: StoryInput): MythStory['blocks'] => {
  const sections = sectionsForStory(input);
  if (sections) {
    return sections.flatMap((section) => [
      { type: 'heading' as const, id: section.id, text: section.heading, level: 2 as const },
      ...section.paragraphs.map((text) => ({ type: 'paragraph' as const, text: paragraphForStory(input, text) })),
    ]);
  }
  return [
      { type: 'heading' as const, id: 'narrative-scope', text: '叙事线索', level: 2 as const },
      { type: 'paragraph' as const, text: input.narrative },
      { type: 'heading' as const, id: 'source-scope', text: '来源范围', level: 2 as const },
      { type: 'paragraph' as const, text: `本研究稿以 ${sourceForStory(input).title}（${sourceForStory(input).locator ?? '待补精确 locator'}）为依据；正文仍须逐项核对其人物、行动与版本差异，不能把后世改编补作来源事实。` },
      { type: 'heading' as const, id: 'reading-path', text: '继续探索', level: 2 as const },
      { type: 'paragraph' as const, text: `本篇已关联 ${input.characters.length} 位人物、${input.worlds?.length ?? 0} 个世界、${input.scenes?.length ?? 0} 个场景与 ${input.objects?.length ?? 0} 件物件；这些链接是下一轮实体和 Claim 审校的工作范围，而非已完成的编辑认证。` },
    ];
};

const story = (input: StoryInput): MythStory => ({
  id: `story-${input.slug}`,
  slug: input.slug,
  mythologyId,
  title: input.title,
  titleEn: input.titleEn,
  subtitle: input.subtitle,
  summary: sourceScopedSummaries[input.slug] ?? input.summary,
  volumeId: input.volumeId,
  volumeTitle: input.volumeTitle,
  volumeOrder: input.volumeOrder,
  displayOrder: input.displayOrder,
  kind: input.kind ?? 'myth',
  legacySlugs: input.legacySlugs,
  tradition: input.tradition,
  readingMinutes: sectionsForStory(input) ? Math.max(3, Math.round(sectionsForStory(input)!.flatMap((section) => section.paragraphs).join('').replace(/\s/g, '').length / 250)) : 4,
  sources: [sourceForStory(input)],
  sourceNotes: [
    `本篇以 ${sourceForStory(input).title} 为主要叙事依据；现存北欧材料多为中世纪记录，版本范围不被压缩为唯一正史。`,
    '故事、关系和视觉设计分别保留其来源范围；来源未统一的空间与身份不自动合并。',
  ],
  requiredCharacterIds: sourceScopedCharacterIds[input.slug] ?? input.characters,
  requiredWorldIds: input.worlds ?? [],
  requiredSceneIds: input.scenes ?? [],
  requiredObjectIds: input.objects ?? [],
  requiredSourceIds: [sourceForStory(input).sourceId ?? sourceForStory(input).title],
  characterIds: sourceScopedCharacterIds[input.slug] ?? input.characters,
  worldIds: input.worlds ?? [],
  sceneIds: input.scenes ?? [],
  objectIds: input.objects ?? [],
  heroAssetId: input.heroAssetId ?? norseKeyMomentAssetIds[input.slug],
  claims: [{
    id: `claim-${input.slug}-narrative`,
    subjectType: 'story',
    subjectId: `story-${input.slug}`,
    claimType: 'narrative',
    summary: sourceScopedSummaries[input.slug] ?? input.summary,
    status: 'supported',
    traditionScope: input.tradition,
    sourceRefs: [{ sourceId: sourceForStory(input).sourceId, type: 'primary-text', title: sourceForStory(input).title, locator: sourceForStory(input).locator ?? '按章节', language: sourceForStory(input).language }],
  }],
  blocks: storyBlocks(input),
  publishStatus: 'published',
  // A curated section set is enough to establish the structured editorial
  // state, but never enough to imply source review. Unsectioned legacy entries
  // remain researching until an editor expands them.
  editorialStatus: input.editorialStatus ?? (sectionsForStory(input) ? 'structured' : 'researching'),
  publishedAt: date,
  updatedAt: date,
});

const c = (...ids: string[]) => ids.map((id) => `character-${id}`);
const w = (...ids: string[]) => ids.map((id) => `world-${id}`);
const s = (...ids: string[]) => ids.map((id) => `scene-${id}`);

type ResearchStoryInput = Omit<StoryInput, 'narrative' | 'sections' | 'editorialStatus'> & { focus: string };

/** A source-scoped editorial draft; it intentionally remains below source-reviewed. */
const researchStory = ({ focus, ...input }: ResearchStoryInput): MythStory => story({
  ...input,
  narrative: focus,
  editorialStatus: 'structured',
  sections: [
    { id: 'source-event', heading: '文本中的事件与人物', paragraphs: [focus] },
    { id: 'reading-scope', heading: '来源范围与后续阅读', paragraphs: [`本篇目前只依据 ${sourceForStory(input).title}（${sourceForStory(input).locator ?? '待补 locator'}）建立阅读入口。平行版本、解释争议和未被该来源支持的视觉细节不能作为既定事实呈现。`, '正文已具备可审阅的结构和来源链接，但仍需具名人工编辑核对人物、关系与叙事细节后，才能进入 source-reviewed。'] },
  ],
});

const norseStoryDrafts: readonly MythStory[] = [
  story({ slug: 'ymir-creation', title: '尤弥尔与世界的诞生', titleEn: 'Ymir and the Making of the World', subtitle: '冰与火之间诞生的巨人', summary: '寒冷与火焰在金伦加鸿沟相遇，尤弥尔出现，北欧宇宙的材料由此展开。', volumeId: 'norse-origins', volumeTitle: '创世与宇宙结构', volumeOrder: 1, displayOrder: 1, source: storySource('proseEddaGylfaginning', 'chs. 4–8'), tradition: '《欺骗古鲁菲》创世叙事范围', characters: c('ymir'), worlds: w('jotunheim', 'niflheim'), scenes: s('ginnungagap'), narrative: '金伦加鸿沟不是一座已经画好边界的地图，而是寒冷与热力相遇的原初间隙。尤弥尔的出现把巨人、冰霜和生成放进同一条宇宙叙事。', editorialStatus: 'structured', sections: [{ id: 'ginnungagap', heading: '鸿沟并非空无', paragraphs: ['《欺骗古鲁菲》把创世开端放在金伦加鸿沟：北方的尼福尔海姆与南方的穆斯贝尔海姆并列，冰霜与热力在中间相遇。它不是后世地图上已被划定的一国，而是世界尚未稳定时的原初间隙。', '当霜气受热融化，叙事让生命从物质变化中显现。这里的“诞生”不等于由一位全能造物者凭空制造；文本更强调冰、热、流动与凝结如何先构成可被讲述的宇宙材料。'] }, { id: 'ymir-appears', heading: '尤弥尔与原初生命', paragraphs: ['尤弥尔在这一叙事中首先是原初巨人，而不是后来故事里某一族群的普通成员。其出现使巨人谱系与宇宙的起始材料相连，也解释了为何后续故事会把巨人放进诸神秩序之外、却又无法与它切断的历史。', '同一章节还让奥德胡姆拉为尤弥尔提供乳汁。两者并置，不应被现代读者简化成“怪物与牲畜”：牛、冰、盐与巨人共同构成世界生成之初的生命图景。'] }, { id: 'reader-note', heading: '阅读这一创世片段', paragraphs: ['本篇只说明《欺骗古鲁菲》组织创世材料的方式，并不把中世纪冰岛散文当作唯一或不变的“北欧圣典”。诗歌与散文中关于起源、神族与世界结构的重点并不总是相同。', '接下来的奥德胡姆拉与布里、以及尤弥尔之躯化为世界，会分别展开祖先谱系和宇宙材料的两个问题。人物、地点与来源链接保留为独立入口，方便读者回到具体证据范围。'] }] }),
  story({ slug: 'audhumla-and-buri', title: '奥德胡姆拉与布里的出现', titleEn: 'Auðumbla and the Emergence of Búri', subtitle: '冰霜中显现的祖先', summary: '原初的牛奥德胡姆拉舔开咸冰，使布里从冰中显现。', volumeId: 'norse-origins', volumeTitle: '创世与宇宙结构', volumeOrder: 1, displayOrder: 2, source: storySource('proseEddaGylfaginning', 'ch. 6'), tradition: '《欺骗古鲁菲》创世叙事范围', characters: c('buri', 'ymir'), worlds: w('niflheim'), scenes: s('ginnungagap'), narrative: '奥德胡姆拉以冰与盐为食，舔开冰层后显现出布里。这个片段将神族祖先放在寒冷物质与原初生命的交界上。', editorialStatus: 'structured', sections: [{ id: 'nourishing-ymir', heading: '原初之牛的乳汁', paragraphs: ['在《欺骗古鲁菲》第六章，奥德胡姆拉从冰块中取食，同时以四条乳流哺养尤弥尔。文本用这种极具体的身体意象，让原初生命并非抽象概念：巨人的存续依赖可被描述的滋养。', '这段材料没有把牛写成后世牧场中的动物，也没有赋予她独立的人格化冒险。她的作用是把冰霜环境、盐分与生命来源连在一起，因此适合作为创世结构中的关键对象，而非普通背景。'] }, { id: 'buri-emerges', heading: '从咸冰中显现的布里', paragraphs: ['奥德胡姆拉舔食带盐的冰块，第一日显出头发，第二日显出头，第三日显出完整男子；这名男子就是布里。叙事的节奏刻意缓慢，祖先不是从无到有地突然出现，而是逐日从冰中显形。', '布里后来成为博尔之父，进而连到奥丁、威利与维的谱系。这里仅记录该散文叙事中的谱系位置；它不要求读者把所有神祇的来源压缩成一张没有版本差异的家谱。'] }, { id: 'source-scope', heading: '来源与后续关系', paragraphs: ['本篇的主要依据限定为《欺骗古鲁菲》第六章。它与尤弥尔的出现同在创世段落中，却服务于不同的叙事问题：前者解释原初巨人的生存，后者引出后来神族祖先。', '布里的视觉或人物设计若进入后续资产制作，应以“冰中显现的祖先”这一来源可支持的锚点为基础，不能据此虚构一套固定盔甲、年龄或现代奇幻阵营设定。'] }] }),
  story({ slug: 'odin-creates-world', title: '奥丁兄弟以尤弥尔之躯创造世界', titleEn: 'Odin and His Brothers Shape the World', subtitle: '巨人的身体成为宇宙材料', summary: '奥丁、威利与维以尤弥尔之躯塑造大地、海洋与天空。', volumeId: 'norse-origins', volumeTitle: '创世与宇宙结构', volumeOrder: 1, displayOrder: 3, source: storySource('proseEddaGylfaginning', 'ch. 8'), tradition: '《欺骗古鲁菲》创世叙事范围', characters: c('odin', 'vili', 've', 'ymir'), worlds: w('midgard', 'asgard'), scenes: s('ginnungagap'), narrative: '尤弥尔的身体被重新组织为山、海、天空与边界。创世在这里不是凭空制造，而是把原初巨人的材料转化为可以居住和穿行的世界。', editorialStatus: 'structured', sections: [{ id: 'slaying-ymir', heading: '杀死原初巨人', paragraphs: ['第八章叙述博尔之子奥丁、威利与维杀死尤弥尔。巨人死后流出的血造成洪水，除贝尔格尔密尔及其妻乘船逃出外，霜巨人几近覆灭；这是一则与巨人谱系有关的散文解释，而不是可任意套用的地质史。', '叙事将暴力置于宇宙秩序形成之前：新世界并不是在无代价的宁静中建立，诸神的可居住空间以原初存在的死亡为条件。读者可在人物关系中继续查看这一冲突的来源范围。'] }, { id: 'body-as-material', heading: '身体成为大地、海与天', paragraphs: ['在这一版本中，尤弥尔的肉成为大地，血成为海与湖，骨头和牙齿成为山石，头盖骨被安置为天空。文本逐项列举材料转化，强调世界由既有身体重新组织，而非一句概括性的“创造”。', '神祇又把火焰的火星安置在天空中，形成日、月与星辰的框架。该段与日月追逐者的诗歌传统有关联，但本篇不把不同文本中的天象细节混作同一直接引文。'] }, { id: 'midgard-boundary', heading: '米德加尔特是一道边界', paragraphs: ['散文还说诸神以尤弥尔的睫毛造出围绕人类居所的防护。米德加尔特因此不仅是“人间”的名称，也包含被围起、可居住、与外部相区隔的空间逻辑。', '阿斯加德、米德加尔特和巨人世界在不同材料中并非总能化成固定坐标。本篇保留《欺骗古鲁菲》第八章的叙事范围；页面中的世界关联是阅读路径，不将它伪装成无争议的古代地图。'] }] }),
  story({ slug: 'ask-and-embla', title: '阿斯克与恩布拉', titleEn: 'Ask and Embla', subtitle: '人类获得呼吸与意识', summary: '奥丁、威利与维赋予树木形体以生命，使人类进入世界。', volumeId: 'norse-origins', volumeTitle: '创世与宇宙结构', volumeOrder: 1, displayOrder: 4, source: storySource('voluspa', 'sts. 17–18'), tradition: '《女预言家之歌》人类起源段落', characters: c('odin', 'vili', 've'), worlds: w('midgard'), scenes: s('midgard-coast'), narrative: '阿斯克与恩布拉的故事把人类放在木材、呼吸和意识的交界。人类不是宇宙之外的旁观者，而是被置于米德加尔特的有限空间中。', editorialStatus: 'structured', sections: [{ id: 'found-without-fate', heading: '发现尚无命运的人', paragraphs: ['《女预言家之歌》第十七节说，三位“强大而仁慈的阿萨神”在陆地上发现阿斯克与恩布拉时，他们仍无命运。这一诗句的重点首先是人类尚未具备完整生命条件，而不是提供一套可以精确复原的现代生物学过程。', '诗中没有在这两节中点明三位神的姓名。后世解释常把他们联系到奥丁、海尼尔与洛德尔，或以散文传统中的奥丁、威利与维来叙述；本页沿用现有角色导航，但不把其中一种识别当作诗句唯一明说的事实。'] }, { id: 'gifts-of-life', heading: '气息、心智与外貌', paragraphs: ['第十八节依次写到三位神所给予的恩赐：气息与生命、心智与行动力、外貌、言语、听觉和色彩。其结构说明“成为人”不是单一瞬间，而是多种能力与感官被赋予。', '中文叙述以“生命、心智与感知”概括这些层次，不替换具体诗节。读者若需追踪翻译差异，可通过来源卡片返回诗节，而不是把页面摘要当作古诺尔斯语文本本身。'] }, { id: 'human-place', heading: '人类在宇宙中的位置', paragraphs: ['阿斯克与恩布拉被赋予生命后，故事把人类纳入已经出现的天地与天体秩序。米德加尔特在本项目中作为他们的阅读关联世界，表示人类居所的叙事位置，而非声明该诗节逐字命名这一地点。', '因此，人物关系、地理图与视觉设计各自有不同证据边界。创作人类起源场景时，应避免把诗歌的简洁叙述强行填成特定的王宫、服装或族群设定。'] }] }),
  story({ slug: 'yggdrasil-wells-norns', title: '世界树、三口井与诺恩', titleEn: 'Yggdrasil, the Wells and the Norns', subtitle: '命运在树根之间流动', summary: '世界树连接不同空间，井泉与诺恩使宇宙获得时间与命运的纵深。', volumeId: 'norse-origins', volumeTitle: '创世与宇宙结构', volumeOrder: 1, displayOrder: 5, source: storySource('grimnismal', 'sts. 29–35'), tradition: '《格里姆尼尔之歌》宇宙树段落', characters: c('odin', 'mimir'), worlds: w('asgard', 'niflheim'), scenes: s('world-tree-roots', 'well-of-mimir'), narrative: '世界树不是一张固定九界地图，而是一条把井泉、根系、道路与命运连接起来的宇宙轴。它允许同一世界被不同故事从不同方向进入。', editorialStatus: 'structured', sections: [{ id: 'tree-under-pressure', heading: '树并非静止的宇宙装饰', paragraphs: ['《格里姆尼尔之歌》第二十九至三十五节描述白蜡树伊格德拉西尔及其根部所承受的压力：鹿啃食枝叶、山羊取食树梢、尼德霍格啃噬根部，树上与树下的生命持续侵蚀它。', '因此，世界树不宜被制作成一棵永远完美无损、只为装点九界地图的巨树。诗歌强调的是负担、损耗与维系，正好为后续场景和关系提供更有张力的阅读入口。'] }, { id: 'wells-and-roots', heading: '井、根与知识', paragraphs: ['诗中一根通向霜巨人处，一根通向人类世界，另一根在海尔之下；密米尔泉与相关根系使世界树、知识与亡者空间相互靠近。不同文本对井与根的说明并不总以同一方式排列。', '本篇把“世界树与井”限定在《格里姆尼尔之歌》的诗歌范围。密米尔与奥丁之眼的故事应由单独页面说明，不能因为共享井名就把所有细节合并为同一次事件。'] }, { id: 'norns-split', heading: '诺恩需要独立阅读', paragraphs: ['诺恩在乌尔德之井旁塑造命运的著名说法主要见于《女预言家之歌》第二十节与散文转述，而非这一组《格里姆尼尔之歌》诗节。原有页面将世界树、井与诺恩合为一篇，适合导航却掩盖了来源边界。', '本阶段将该旧页保留为世界树与井的结构化故事；“诺恩与命运之井”列为独立 Story 待发布。这样既不删除读者已有入口，也不让单一标题承诺超出所列来源的内容。'] }] }),
  story({ slug: 'norns-at-urdarbrunnr', title: '诺恩与命运之井', titleEn: 'The Norns at Urðarbrunnr', subtitle: '三位命运塑造者在井旁出现', summary: '乌尔德、薇尔丹蒂与斯库尔德在世界树旁决定人的命运，使时间与命运成为宇宙秩序的一部分。', volumeId: 'norse-origins', volumeTitle: '创世与宇宙结构', volumeOrder: 1, displayOrder: 6, source: storySource('voluspa', 'st. 20'), tradition: '《女预言家之歌》命运之井段落', characters: c('urd', 'verdandi', 'skuld'), worlds: w('asgard'), scenes: s('world-tree-roots'), narrative: '三位诺恩在世界树旁决定人类的命运。', editorialStatus: 'structured', sections: [{ id: 'three-norns', heading: '三位从水下而来者', paragraphs: ['《女预言家之歌》第二十节说，三位少女从树下的湖泊而来；她们被称为乌尔德、薇尔丹蒂和斯库尔德。诗句把她们放在世界树附近，但没有要求读者将其理解为一套可以机械化计算的命运机关。', '三个名字常被现代读者对应为过去、正在发生与应当发生等时间词。这样的解释有助于入门，却不应遮蔽诗句本身的简洁性；本页以名字和文本中的行动为优先，保留解释的边界。'] }, { id: 'they-shaped-lives', heading: '她们为人塑造生命', paragraphs: ['诗歌接着说，三位诺恩“为人立法、选择生命、宣告命运”。这里的行动同时关乎秩序与个体生命，说明命运不是遥远的抽象背景，而是人类存在被安排进宇宙结构的方式。', '页面将这一点写为叙事概述，不添加诗节没有明确说明的织布工具、服装颜色或预言仪式。未来视觉设计可以使用井、水面与刻痕等原创锚点，但应标明其为 MythCanvas 解释。'] }, { id: 'scope-and-links', heading: '与世界树故事的分界', paragraphs: ['世界树与诺恩经常在现代百科或改编中同框，然而本项目将二者拆成独立 Story：前者主要阅读《格里姆尼尔之歌》的根、井和树；本篇只处理《女预言家之歌》第二十节的三位诺恩。', '这种拆分让来源卡、角色页与未来系列都能保持精确。读者仍可从世界树场景抵达这篇故事，但不会因此误以为所有相关细节都出自同一段古代文本。'] }] }),
  story({ slug: 'sun-and-moon-chase', title: '日月运行与追逐者', titleEn: 'The Sun, the Moon and Their Pursuers', subtitle: '天体在追逐中运行', summary: '日月的运行被写成持续的追逐，预示秩序终将面临断裂。', volumeId: 'norse-origins', volumeTitle: '创世与宇宙结构', volumeOrder: 1, displayOrder: 7, source: storySource('voluspa', 'sts. 5, 40–41'), tradition: '《女预言家之歌》天体与末日预兆段落', characters: c('sol', 'mani', 'skoll', 'hati'), worlds: w('midgard'), scenes: s('world-tree-roots'), narrative: '日月并非静止悬挂在天空，而在追逐与被追逐的节奏中运行。天象因此成为命运压力的可见形式。', editorialStatus: 'structured', sections: [{ id: 'ordered-sky', heading: '天体获得运行秩序', paragraphs: ['《女预言家之歌》第五节将太阳放在南方厅堂，众星知晓自己的位置，新月也知道其力量。诗歌用“知道”来描述天体秩序，使日月星辰不仅是物体，也构成可被预言打破的宇宙节律。', '这并不等于诗歌给出了完整的天文学系统。页面把它作为创世循环中的天象段落，帮助读者理解为何后面“狼吞日月”的意象会被视为秩序的瓦解。'] }, { id: 'pursuers', heading: '追逐者与狼后代', paragraphs: ['第四十至四十一节写到一位女巨人在铁森林中养育狼后代，其中一只将吞食月亮；另有“月之掠夺者”以死者之血染红诸天。翻译与注释中对具体狼名的对应并不总完全一致。', '斯库尔与哈提的具体命名依《欺骗古鲁菲》第十二章另作来源链接；它补充追逐日月的狼名，但不将散文补充伪装成《女预言家之歌》原句。'] }, { id: 'ragnarok-connection', heading: '从日常运行到末日征兆', paragraphs: ['日月的追逐使末日并非只在战场开始。它先在每天可见的天空中持续发生：秩序运行得越稳定，追逐者的存在越像一项被延后的威胁。', '本篇仅处理《女预言家之歌》所给出的预兆与图像。芬布尔之冬、束缚崩解和诸神黄昏的战斗另有独立故事；把它们放在同一时间线中阅读，不等于把所有诗句说成一次连续的散文记录。'] }] }),
  story({ slug: 'aesir-vanir-war', title: '阿萨神族与华纳神族的冲突与和解', titleEn: 'The War and Truce of Aesir and Vanir', subtitle: '两个神族重新安排秩序', summary: '阿萨与华纳之间的冲突最终通过交换与共同居住得到缓和。', volumeId: 'norse-order', volumeTitle: '神族秩序与知识', volumeOrder: 2, displayOrder: 1, source: sources.poetic, tradition: '阿萨—华纳传统', characters: c('odin', 'freyja', 'freyr', 'njordr'), worlds: w('asgard', 'vanaheim'), scenes: s('asgard-court'), narrative: '阿萨与华纳的冲突并不只是阵营战斗，它也关乎不同神圣能力如何进入同一秩序。交换人质与共同生活让两个传统彼此改写。' }),
  story({ slug: 'aesir-vanir-truce', title: '阿萨与华纳的和约', titleEn: 'The Æsir–Vanir Truce', subtitle: '交换、共同生活与新的神族秩序', summary: '散文传统把阿萨与华纳的冲突后果写成交换人质与共同生活，尼约德、弗雷与弗蕾雅进入阿萨神族的秩序。', volumeId: 'norse-order', volumeTitle: '神族秩序与知识', volumeOrder: 2, displayOrder: 2, source: storySource('proseEddaSkaldskaparmal', 'ch. 57'), tradition: '《诗语法》阿萨—华纳和约范围', characters: c('njordr', 'freyr', 'freyja'), worlds: w('asgard', 'vanaheim'), scenes: s('asgard-court'), narrative: '本篇只处理散文传统对战后交换与共同生活的叙述，不把它与《女预言家之歌》的战争诗节合并成一份无版本差异的历史。', editorialStatus: 'structured', sections: [{ id: 'after-conflict', heading: '战争之后的重新安排', paragraphs: ['《诗语法》第五十七章把阿萨与华纳的冲突放入神族谱系与称号的说明中。与《女预言家之歌》二十一至二十四节描写的战争诗节相比，这里更关注冲突后的交换、居住与人物在神族秩序中的位置。', '因此本篇不替诗歌补写一份完整战史，也不把散文的编排当作唯一的古代正史。读者可以从本篇回到古尔薇格与阿萨—华纳战争的诗歌 Story，比较两个来源承担的叙事任务。'] }, { id: 'exchange', heading: '尼约德、弗雷与弗蕾雅', paragraphs: ['尼约德、弗雷与弗蕾雅在散文传统中与阿萨神族共同体相连；他们的名字和身份不是“战败方角色”这一单一标签能够概括的。交换与共同生活同时改变了关系网络，也让华纳神族的能力进入阿萨秩序。', '页面将这三位人物作为本篇的主要依赖，保留他们各自的角色页和来源链接，不把后来关于财富、爱情或魔法的全部叙事倒灌到第五十七章。'] }, { id: 'source-boundary', heading: '和约不是统一正史结局', paragraphs: ['本篇依据《诗语法》第五十七章，主要讲述散文文本如何把阿萨—华纳关系放入神族秩序。战争起因、古尔薇格的反复焚烧与城墙破坏仍属于《女预言家之歌》的独立范围，不能因两篇互相链接就被写成同一段连续叙事。', '视觉上可以使用交换物、两组神族在同一大厅中重新分座等原创构图锚点；具体礼仪、服饰和建筑不应伪装成原文逐项描述。'] }] }),
  story({ slug: 'kvasir-and-mead', title: '克瓦希尔与诗歌蜜酒', titleEn: 'Kvasir and the Mead of Poetry', subtitle: '知识被酿成可以争夺的液体', summary: '克瓦希尔的智慧与诗歌蜜酒把知识、语言和盗取联系在一起。', volumeId: 'norse-order', volumeTitle: '神族秩序与知识', volumeOrder: 2, displayOrder: 2, source: storySource('proseEddaSkaldskaparmal', 'ch. 1'), tradition: '《诗语法》诗歌蜜酒叙事范围', characters: c('kvasir', 'odin'), worlds: w('asgard'), scenes: s('asgard-court'), objects: ['object-norse-mead-of-poetry'], narrative: '诗歌蜜酒把智慧变成需要寻找、守护和夺取的资源。', editorialStatus: 'structured', sections: [{ id: 'truce-and-kvasir', heading: '和约之后的克瓦希尔', paragraphs: ['《诗语法》第一章把克瓦希尔放在阿萨与华纳和解之后：双方把唾液吐入同一器皿，由此形成一位极具智慧的人物。它是斯诺里散文中对和约与知识来源的组织方式，不能替代所有诗歌对两族关系的表述。', '克瓦希尔周游各地回答问题，叙事先建立他的智慧，再让读者看见这种智慧如何被暴力和利益转化。页面以人物和来源卡保留这一顺序，而不是把“蜜酒”直接当作无来由的魔法饮品。'] }, { id: 'blood-and-brew', heading: '血被酿成诗歌蜜酒', paragraphs: ['两名侏儒杀死克瓦希尔，将他的血与蜂蜜混合，酿成使饮者成为诗人或学者的蜜酒。故事并未把知识写成纯洁、无代价的礼物：它能被保存、索取、争夺，也带着死亡与欺骗的痕迹。', '本项目把蜜酒单独建模为物件，使克瓦希尔、奥丁和后续的夺取故事可以各自引用同一来源，而不需要把复杂链条压扁为一张人物关系图。'] }, { id: 'later-odin', heading: '奥丁的盗取属于后续一篇', paragraphs: ['第一章后半段还通向蜜酒被巨人保存、奥丁以伪装取得的故事。但“克瓦希尔被杀、蜜酒被酿成”与“奥丁夺取蜜酒”是不同的叙事阶段，适合分成相邻 Story 阅读。', '本篇不把奥丁表现为克瓦希尔死亡的直接施动者。这样可以让读者先理解蜜酒的来源，再进入伪装、交换和飞行等后续情节。'] }] }),
  story({ slug: 'odin-and-mimir', title: '奥丁以一只眼换取智慧', titleEn: 'Odin and Mímir’s Well', subtitle: '知识总有可见的代价', summary: '奥丁在密米尔之井前付出一只眼，以换取洞察力。', volumeId: 'norse-order', volumeTitle: '神族秩序与知识', volumeOrder: 2, displayOrder: 3, source: storySource('voluspa', 'st. 28'), tradition: '《女预言家之歌》密米尔之井段落', characters: c('odin', 'mimir'), worlds: w('asgard'), scenes: s('well-of-mimir'), narrative: '奥丁的智慧不是无条件赠礼。他在井边留下身体的一部分，显示知识、牺牲与王权之间的紧张关系。', editorialStatus: 'structured', sections: [{ id: 'well-and-hostage', heading: '井边的抵押物', paragraphs: ['《女预言家之歌》第二十八节让预言者看见奥丁的眼睛被藏在密米尔的井中，密米尔每天清晨从那里饮蜜酒。诗句给出的是一幅井、眼睛和饮用的图像，而不是一段完整的交易对白。', '读者常把它概括成“奥丁用一眼换智慧”。这一概括适合作为导航标题，但正文应保留诗歌的表达边界：我们知道眼睛在井中、密米尔从中饮用，却不把未明说的谈判细节写成古代原文。'] }, { id: 'knowledge-with-cost', heading: '知识带有可见的代价', paragraphs: ['眼睛并未简单消失，而是留在知识之井旁。这个意象使奥丁的求知不只是抽象属性，也表现为身体上的缺失、记忆与持续的关联。MythCanvas 的人物设计可用独眼和井水作为来源锚点，但不能由此推断一套固定的现代奇幻装备。', '密米尔在此处是井与知识图像中的关键人物。其他文本中的密米尔头颅、奥丁咨询等材料具有不同来源范围，不应在这篇页面中自动叠加。'] }, { id: 'poetic-scope', heading: '一节诗歌的阅读尺度', paragraphs: ['本篇主要依据一节诗歌，因此不以长篇小说式细节填补沉默。它提供的是理解奥丁知识主题的明确窗口，也提醒读者北欧材料常由简洁诗句和后来的散文解释共同构成。', '世界树、诺恩和奥丁的悬挂自我牺牲各有单独故事与来源。将它们并置探索可以形成“知识与代价”的线索，但不等于它们发生在同一地点或同一次仪式。'] }] }),
  story({ slug: 'odin-world-tree', title: '奥丁悬于世界树九夜', titleEn: 'Odin on the World Tree', subtitle: '以牺牲换取符文知识', summary: '《高者之歌》中的说话者讲述自己被长矛刺伤、悬在树上九夜，终于取到符文。', volumeId: 'norse-order', volumeTitle: '神族秩序与知识', volumeOrder: 2, displayOrder: 4, source: storySource('havamal', 'sts. 138–141'), tradition: '《高者之歌》九夜与符文段落', characters: c('odin'), worlds: w('asgard'), scenes: s('world-tree-roots'), narrative: '奥丁把自己悬在世界树上，既是求知者，也是知识仪式的参与者。符文在这里不是装饰性的发光字样，而是经过代价获得的能力。', editorialStatus: 'structured', sections: [{ id: 'nine-nights', heading: '九夜的自我献祭', paragraphs: ['《高者之歌》138 节以第一人称叙述：说话者被风吹拂的树吊着九个长夜，被长矛刺伤，并且“献给奥丁、我自己献给我自己”。诗句没有在此处替树命名，也没有展开一段完整的树木地理；把它直接等同于《欺骗古鲁菲》中带有根、井与居民的宇宙树，是后续读法而非这几节诗本身的明示。', '这段话把获得知识写成一种自我施加、无人供食饮的极限状态。它并不是关于“奥丁发现了魔法道具”的轻快传说；身体受创、孤悬与等待共同构成知识出现的条件。'] }, { id: 'runes', heading: '符文从何处被取到', paragraphs: ['第 139 节说说话者向下凝望、呼喊，随后“取起符文”，并倒下。诗在这里强调获得的动作和结果，却没有给出一套可据以复原历史字母表或固定仪式流程的说明。页面中的符文只应作为文本中的知识与能力意象，不应被包装成无来源的神秘科技。', '后续诗节把歌咒、知识与人与人之间的交换并列。因而本篇关注的是诗歌中“代价—领悟—言说”的结构；米米尔之井、失去一只眼等另一来源范围内的奥丁知识叙事会保持独立链接。'] }, { id: 'reading-scope', heading: '来源范围与视觉边界', paragraphs: ['本篇依据《高者之歌》138–141 节，采用“传统上与奥丁相连的第一人称说话者”这一谨慎表述。关于说话者是否、以及如何完全等同奥丁，现代释读会讨论；读者页不把解释争议消去，也不将每一条相关叙事拼成单一传记。', '若制作关键场景，稳定锚点是悬挂、长矛、九夜、无食无饮与向下凝望；树的具体形制、服饰和光线属于 MythCanvas 原创设计，必须与来源事实分层记录。'] }] }),
  story({ slug: 'freyr-and-gerdr', legacySlugs: ['freyja-and-gerdr'], title: '弗雷与葛德', titleEn: 'Freyr and Gerðr', subtitle: '丰饶神对巨人庭院的凝望', summary: '弗雷爱上葛德，并派遣斯基尔尼尔穿过边界向她求婚。', volumeId: 'norse-order', volumeTitle: '神族秩序与知识', volumeOrder: 2, displayOrder: 5, source: storySource('skirnismal', 'sts. 1–42'), tradition: '《斯基尔尼尔之歌》传统', characters: c('freyr', 'gerdr', 'skirnir'), worlds: w('vanaheim', 'jotunheim'), scenes: s('jotunheim-border'), objects: ['object-norse-freyrs-sword'], narrative: '弗雷与葛德的故事把爱慕、交换、威胁和跨越边界放在同一个谈判过程中。', editorialStatus: 'structured', sections: [{ id: 'freyrs-silence', heading: '弗雷的沉默与斯基尔尼尔的出发', paragraphs: ['《斯基尔尼尔之歌》开头并不立刻描写求婚，而是让弗雷坐在奥丁的高座上望向约顿海姆，随后因看见葛德而陷入沉默。斯基尔尼尔察觉主人的痛苦，被要求前去询问原因。', '这一设置使故事的行动者不止弗雷与葛德。斯基尔尼尔承担谈判、穿越边界和传递言语的职责；将他删成无名使者，会遮蔽诗歌中的实际叙事结构。'] }, { id: 'gifts-and-threats', heading: '赠礼、拒绝与威胁', paragraphs: ['斯基尔尼尔先提出黄金与其他赠礼，葛德拒绝。随后诗歌转向威胁、诅咒与孤立的言辞，葛德最终答应在巴里林地相会。文本并未把这一过程写成无条件的浪漫互许。', '本页不以“爱情征服”美化强迫性的语言，也不把葛德化作弗雷丰饶属性的附属物。她拥有庭院、家族和拒绝的声音；读者应能看到求婚叙事中权力差异与跨越边界的压力。'] }, { id: 'sword-and-later-cost', heading: '弗雷之剑与后续代价', paragraphs: ['斯基尔尼尔为完成旅程取得弗雷之剑，剑在后来的诸神黄昏叙事中成为弗雷失去的关键物件。这里应将它理解为诗歌中的交换条件与故事连接点，而不应把它演成现代奇幻武器任务。', '《斯基尔尼尔之歌》主要给出求婚与承诺；弗雷在末日与苏尔特的结局来自其他来源范围。页面通过物件链接提示后续阅读，但不把两种材料混写成同一首诗所述的连续结局。'] }] }),
  story({ slug: 'idunn-and-thjazi', title: '伊登被夏基掳走', titleEn: 'Iðunn and Þjazi', subtitle: '青春苹果离开神域', summary: '伊登与青春苹果被带离阿斯加德，诸神的衰老暴露了宝物的秩序作用。', volumeId: 'norse-order', volumeTitle: '神族秩序与知识', volumeOrder: 2, displayOrder: 6, source: storySource('haustlong', 'sts. 1–13'), tradition: '《秋长诗》伊登与夏基叙事范围', characters: c('idunn', 'loki', 'thjazi'), worlds: w('asgard', 'jotunheim'), scenes: s('asgard-court', 'jotunheim-border'), objects: ['object-norse-idunn-apples'], narrative: '青春苹果不是普通道具。伊登离开后，诸神的身体和秩序开始衰老。', editorialStatus: 'structured', sections: [{ id: 'journey-and-eagle', heading: '旅程、饥饿与鹰形巨人', paragraphs: ['《秋长诗》以奥丁、海尼尔与洛基旅行时无法煮熟牛肉开场。巨大的鹰要求分享食物，洛基试图用棍子攻击它，棍子却黏在鹰身上，洛基被拖入空中。', '诗歌随后将鹰表明为夏基。这个开端让伊登被带走并不是孤立绑架事件，而是洛基在旅程中的冲突、承诺和被迫让步所引出的后果。'] }, { id: 'idunn-leaves', heading: '伊登与苹果离开神域', paragraphs: ['为脱身，洛基答应把伊登及其苹果带出阿斯加德。伊登离开后，诸神开始衰老；苹果的叙事作用因此不是“回血道具”，而是维系神族青春与共同体稳定的关键条件。', '本页将苹果作为独立物件链接，避免把伊登的身份缩减为一篮可被转移的物品。她的离开改变的是整个神域的身体状态与秩序，而非只提供一场追逐的理由。'] }, { id: 'return-and-boundary', heading: '归还并不抹去责任', paragraphs: ['诸神迫使洛基前去带回伊登，夏基追至阿斯加德边缘后被杀。不同材料对于变形与追逐的描写层次不同；本篇以《秋长诗》第一至十三节为主，不把后世所有补充当作同一首诗的细节。', '洛基在这里既不是单一的恶人标签，也不能免除他先前承诺的责任。故事通过旅程、胁迫与归还展示神族秩序如何依赖关系网络，而不是由固定阵营自动维持。'] }] }),
  story({ slug: 'odin-steals-mead', title: '奥丁夺取诗歌蜜酒', titleEn: 'Odin Steals the Mead of Poetry', subtitle: '知识通过伪装、交换与飞行易手', summary: '奥丁以伪名进入苏通的山中，饮尽诗歌蜜酒，化作鹰飞回阿斯加德。', volumeId: 'norse-order', volumeTitle: '神族秩序与知识', volumeOrder: 2, displayOrder: 6, source: storySource('proseEddaSkaldskaparmal', 'ch. 1'), tradition: '《诗语法》诗歌蜜酒夺取段落', characters: c('odin'), worlds: w('asgard', 'jotunheim'), scenes: s('jotunheim-border'), objects: ['object-norse-mead-of-poetry'], narrative: '奥丁通过劳动、伪名与变形进入守护蜜酒的山中，将诗歌能力带回诸神之地。', editorialStatus: 'structured', sections: [{ id: 'baugi', heading: '以博尔维尔克之名进入山中', paragraphs: ['《诗语法》第一章把蜜酒的去向接在克瓦希尔死亡之后：侏儒将它交给巨人苏通，苏通把蜜酒藏在山中，由女儿贡勒德看守。奥丁以“博尔维尔克”之名来到苏通之弟鲍吉处，提出替他完成劳作以换取一口蜜酒。', '这不是一条只靠力量夺宝的直线叙事。奥丁先介入农事与兄弟间的利益，又在鲍吉无法兑现承诺时要求进入岩山；伪名、交易和劳动构成进入守卫空间的不同层次。'] }, { id: 'gunnlod', heading: '三夜与三口饮尽', paragraphs: ['奥丁用钻子开出通道，变作蛇进入山中，并与贡勒德相处三夜。作为回报，他每夜获准饮一口蜜酒；叙事说他每口都喝尽一个容器，因而饮完全部蜜酒。此处涉及承诺、诱骗与不对等权力，页面不将其改写为无摩擦的浪漫相遇。', '诗歌蜜酒在这段散文中是可被储藏、分配和盗取的知识性物件。它与克瓦希尔的血有关，但奥丁并非该蜜酒最初被酿造时的直接参与者；两篇 Story 以物件连接，而不混成同一事件。'] }, { id: 'eagle', heading: '飞回阿斯加德的诗', paragraphs: ['奥丁化作鹰飞回阿斯加德，苏通也化作鹰追赶。诸神备好容器，奥丁吐出蜜酒；散文还解释，有一部分在追逐中落到人间，成为“劣诗人的份额”。这是斯诺里关于诗歌来源的叙事性解释，不是对现实文学才能的分类。', '本篇限定在《诗语法》第一章。视觉锚点可采用山中容器、钻孔、鹰形与追逐，但贡勒德、苏通和具体山景的设计须注明来源未规定的原创部分。'] }] }),
  story({ slug: 'skadi-compensation', title: '斯卡蒂的赔偿', titleEn: 'Skaði’s Compensation', subtitle: '巨人的女儿走进诸神的议庭', summary: '夏基被杀后，女儿斯卡蒂来到阿斯加德索取赔偿；诸神以选夫、逗笑和星辰回应。', volumeId: 'norse-order', volumeTitle: '神族秩序与知识', volumeOrder: 2, displayOrder: 9, source: storySource('proseEddaGylfaginning', 'ch. 23'), tradition: '《欺骗古鲁菲》斯卡蒂赔偿段落', characters: c('skadi', 'njordr'), worlds: w('asgard', 'jotunheim'), scenes: s('asgard-court'), narrative: '斯卡蒂为父亲夏基之死而来，诸神的赔偿将复仇、婚姻与难以消除的身份差异并置。', editorialStatus: 'structured', sections: [{ id: 'claim', heading: '带着武器来到阿斯加德', paragraphs: ['《欺骗古鲁菲》第二十三章中，夏基的女儿斯卡蒂披甲持武来到阿斯加德，要求为父亲被杀得到赔偿。她不是偶然进入神域的旁观者，而是以明确的亲属损失和诉求进入谈判。', '诸神提出三项补偿：她可从诸神中选择夫婿，但只能看脚；诸神必须让她发笑；奥丁把夏基的眼睛抛上天成为星辰。文本把这三件事并列，既未抹去杀父的暴力，也没有给出一种完全对等的和解。'] }, { id: 'choice', heading: '只看脚的选择', paragraphs: ['斯卡蒂以为最洁净的一双脚会属于巴德尔，于是选择了尼约德。这个选择由被限制的信息导致，叙事随后才让读者看见她的山地生活与尼约德的海边居所并不相合。', '“只能看脚”是该散文故事的关键条件，不宜把它删成一次自由、全面的爱情选择。它也不能说明斯卡蒂的意志不存在：她先提出赔偿，之后仍会对生活地点表达明确偏好。'] }, { id: 'scope', heading: '赔偿并不等于关系终结', paragraphs: ['洛基把一只山羊系在自己身上，二者的拉扯使斯卡蒂发笑；奥丁将夏基之眼置于天上。此处的滑稽与星辰并不把父亲之死变成轻松插曲，而显示补偿由仪式、戏剧与权力共同完成。', '本篇聚焦第二十三章的赔偿顺序；尼约德与斯卡蒂后来居住安排的冲突分为下一篇。夏基与伊登的故事则应回到《秋长诗》与相应散文材料。'] }] }),
  story({ slug: 'njordr-and-skadi', title: '尼约德与斯卡蒂的婚姻', titleEn: 'Njörðr and Skaði', subtitle: '海岸与山地之间无法折中的居所', summary: '斯卡蒂选择尼约德为夫，但二人对山地与海岸的不同偏好使婚姻未能稳定。', volumeId: 'norse-order', volumeTitle: '神族秩序与知识', volumeOrder: 2, displayOrder: 10, source: storySource('proseEddaGylfaginning', 'ch. 23'), tradition: '《欺骗古鲁菲》尼约德与斯卡蒂段落', characters: c('njordr', 'skadi'), worlds: w('asgard', 'jotunheim'), scenes: s('jotunheim-border'), narrative: '尼约德与斯卡蒂尝试轮流住在海岸与山地，却发现每个人的声音、景观和生活节律都难以互换。', editorialStatus: 'structured', sections: [{ id: 'two-homes', heading: '诺阿通与斯里姆海姆', paragraphs: ['同一章节把尼约德与斯卡蒂的婚后冲突写成居所之争：尼约德来自海岸的诺阿通，斯卡蒂习惯父亲的山中斯里姆海姆。双方约定在对方居所各住九夜，希望用轮换解决差异。', '这里的“海”与“山”首先是叙事中人物生活经验的差异，而不是给两个世界贴上永久阵营标签。页面将诺阿通与斯里姆海姆作为来源中的地名/居所说明，不把它们自动扩写为可精确量化的九界行政区。'] }, { id: 'unhappy-nights', heading: '谁也无法习惯对方的夜晚', paragraphs: ['尼约德住山里后抱怨狼嚎、怀念海鸟；斯卡蒂住海边后抱怨海鸟鸣叫、想念山中。两段诗式引语对照地展示了他们不同的感官与依恋，冲突不靠某次大战爆发，而在日常夜晚逐渐显形。', '轮换没有达成共同生活的方案，散文说二人随后分开。将这段故事写成“异地恋失败”会过度现代化；它的重点是身份、居所与婚姻安排在神话叙事中的不相容。'] }, { id: 'after-marriage', heading: '将婚姻与赔偿分开阅读', paragraphs: ['斯卡蒂最初因索赔而进入阿斯加德，选择尼约德是赔偿的一部分；但婚后的居住试验具有自己的叙事节奏。拆为两篇 Story 后，读者能同时看到公共谈判与私人生活，而不把女性角色压缩为被安排的结局。', '本篇依据《欺骗古鲁菲》第二十三章。后来的谱系、配偶或崇拜信息若来自其他文本，须以独立来源处理；视觉设计也不应把“雪山猎手”或“海神”固化成现代版权作品的服装模板。'] }] }),
  story({ slug: 'asgard-wall-and-sleipnir', title: '阿斯加德城墙与斯莱普尼尔', titleEn: 'The Wall of Asgard and Sleipnir', subtitle: '一座城墙换来一匹跨界坐骑', summary: '一名建造者以太阳、月亮和芙蕾雅为报酬修筑城墙；洛基使其骏马偏离工程，斯莱普尼尔随后出生。', volumeId: 'norse-order', volumeTitle: '神族秩序与知识', volumeOrder: 2, displayOrder: 7, source: storySource('proseEddaGylfaginning', 'ch. 42'), tradition: '《欺骗古鲁菲》阿斯加德城墙叙事', characters: c('loki', 'sleipnir'), worlds: w('asgard', 'jotunheim'), scenes: s('asgard-court'), narrative: '阿斯加德城墙的建造暴露了神族对契约、时间和外部力量的依赖。洛基的变形最终带来斯莱普尼尔，也让边界不再只是石头。', editorialStatus: 'structured', sections: [{ id: 'bargain', heading: '报酬高得近乎不可能', paragraphs: ['《欺骗古鲁菲》第四十二章让一名未具名的建造者提出为诸神修筑堡垒，条件是一个冬季内完工，并以芙蕾雅、太阳和月亮为报酬。诸神在洛基的劝说下接受了条件，却限制建造者只能使用一匹马；这个决定把看似不可能的交易变成日后必须兑现的契约。', '建造者的骏马斯瓦迪尔法利搬运石料极快。工程接近完成时，诸神意识到失去太阳、月亮和芙蕾雅的后果，转而把责任推回提出建议的洛基。文本并不把这种处理描写成无代价的聪明，而明确点出洛基若不能阻止工程将遭到严惩。'] }, { id: 'distraction', heading: '变形改变了工程进度', paragraphs: ['洛基变成一匹母马，把斯瓦迪尔法利引离工地；建造者因此不能按时完成城墙。建造者盛怒，诸神这才认出他是山巨人，并由索尔以妙尔尼尔击杀。这一段的冲突来自交易、时间和边界，并不能被概括为所有巨人都天然欺骗或所有神都始终遵守约定。', '散文随后补述洛基生下一匹灰色八足马，即斯莱普尼尔，并称其为诸马之最、为奥丁所有。斯莱普尼尔的出生是这次干预的后果；他并非城墙本身，也不应在页面中被错误归为建造者的坐骑。'] }, { id: 'source-scope', heading: '同一叙事中的边界与责任', paragraphs: ['本篇只采用《欺骗古鲁菲》第四十二章的叙事次序。它记录的是一则中世纪散文中的城墙建造、变形与马匹来历，并不提供可精确绘制阿斯加德防御工事的建筑史。', '视觉设计可以强调未完石墙、冬日工期与奔离的马，但“八足”“奥丁坐骑”等稳定身份锚点必须来自本篇所述结果；建筑材料、镜头和角色服装则属于原创设计层。'] }] }),
  story({ slug: 'sifs-hair-and-treasures', title: '西芙的头发与诸神宝物', titleEn: 'Sif’s Hair and the Gods’ Treasures', subtitle: '失去的金色被重新锻造', summary: '洛基为被剪去头发的西芙寻求赔偿；两组矮人工匠竞作，产出金发、船、长矛、指环、野猪与妙尔尼尔。', volumeId: 'norse-order', volumeTitle: '神族秩序与知识', volumeOrder: 2, displayOrder: 8, source: storySource('proseEddaSkaldskaparmal', 'ch. 35'), tradition: '《诗语法》宝物锻造叙事', characters: c('sif', 'loki', 'odin', 'freyr', 'thor'), worlds: w('asgard'), scenes: s('asgard-court'), objects: ['object-norse-mjolnir', 'object-norse-skidbladnir', 'object-norse-draupnir'], narrative: '西芙的金发与宝物锻造把身体、赔偿、工艺和神权连在一起。宝物不是凭空出现，而是在冲突之后被工匠与契约制造出来。', editorialStatus: 'structured', sections: [{ id: 'repair', heading: '从剪发到赔偿', paragraphs: ['《诗语法》第三十五章开头说洛基剪去了索尔之妻西芙的头发。索尔威胁要折断洛基的每一根骨头，洛基于是前往黑侏儒处，请伊瓦尔第的儿子们制作能像真发一样生长的金发。这个开端把宝物置于一次明确的伤害与赔偿之后，而不是把它们当作无来由的装备清单。', '同一组工匠又制成斯基德布拉德尼尔船和贡格尼尔长矛。文本赋予它们可收纳、顺风与不落空等特性，但不提供现代游戏式的数值体系；页面将把功能、所属与来源章节分开呈现。'] }, { id: 'wager', heading: '两组工匠的赌赛', paragraphs: ['洛基以自己的头作赌注，向布洛克挑战：其兄辛德里能否作出同样珍贵的东西。洛基化作苍蝇干扰风箱，但辛德里仍完成金鬃野猪古林布尔斯蒂、会自行滴出同重金环的德劳普尼尔，以及锤柄较短的妙尔尼尔。短柄是叙事中与干扰相连的工艺结果，不是现代改编可以随意忽略的细节。', '诸神裁判将金发判给西芙、长矛判给奥丁、船与野猪判给弗雷、指环判给奥丁、妙尔尼尔判给索尔。洛基借“头不含颈”躲过斩首，却被缝住嘴唇；这不是单纯的奖励仪式，而是一次工艺、赌约和语言诡辩相互咬合的故事。'] }, { id: 'object-boundaries', heading: '宝物不是一套无差别神装', paragraphs: ['本篇依《诗语法》第三十五章叙述，将多件宝物置于同一竞作框架。它并不处理《欺骗古鲁菲》或诗歌材料中其他关于锤、船和指环的用法；同一物件在不同文本出现时，需要保留各自的来源范围。', '对视觉生产而言，西芙的可生长金发、可折叠的船、金鬃野猪、滴环和短柄雷锤可作为来源支撑的对象锚点；材质细节、场景和工坊美术则须另外标记为 MythCanvas 原创诠释。'] }] }),
  story({ slug: 'thor-and-hrungnir', title: '索尔与赫朗格尼尔', titleEn: 'Thor and Hrungnir', subtitle: '神与巨人的决斗', summary: '赫朗格尼尔与奥丁赛马后受邀入阿斯加德；醉酒的巨人挑战索尔，二者以锤与燧石搏斗。', volumeId: 'norse-thor', volumeTitle: '索尔、洛基与巨人', volumeOrder: 3, displayOrder: 1, source: storySource('proseEddaSkaldskaparmal', 'ch. 17'), tradition: '《诗语法》索尔与赫朗格尼尔叙事', characters: c('thor', 'hrungnir'), worlds: w('jotunheim', 'asgard'), scenes: s('jotunheim-border'), objects: ['object-norse-mjolnir'], narrative: '赫朗格尼尔代表约顿世界中不可被简单归类为冰雪怪物的力量。索尔的胜利依赖锤、身体和边界空间的共同作用。', editorialStatus: 'structured', sections: [{ id: 'horse-race', heading: '赛马后的不受欢迎客人', paragraphs: ['《诗语法》第十七章先讲奥丁骑斯莱普尼尔进入巨人之地，与赫朗格尼尔赛马。赫朗格尼尔追到阿斯加德门前后才停下，并获邀入厅饮酒；他的到来不是一次战场突袭，而是由竞赛、招待和越界共同推动。', '巨人饮下大量酒后夸口要搬走瓦尔哈拉、把阿斯加德沉进海里、杀死诸神，只留下芙蕾雅和西芙。诸神召来索尔；此时文本的冲突已从宾客礼遇转为威胁与挑战，不能简单归因于某个族群的天性。'] }, { id: 'duel', heading: '燧石、铁盾与妙尔尼尔', paragraphs: ['赫朗格尼尔约定在格里奥图纳石界与索尔决斗。巨人们造出泥人莫克尔卡尔菲相助，赫朗格尼尔自己有石心、石头的头和盾，并以燧石为武器；这是散文叙事对非常规身体与武器的描写，不等于可确证的历史宗教形象。', '索尔与夏尔菲抵达后，妙尔尼尔和燧石在空中相撞。锤击碎了赫朗格尼尔的头，燧石碎片却嵌入索尔头中；倒下的巨人一只脚压住索尔颈部。胜利并非无伤的碾压，索尔仍需要旁人解除身体上的危险。'] }, { id: 'aftermath', heading: '被压住的胜者', paragraphs: ['众神试图搬开巨人的脚都没有成功，年幼的马格尼来到后轻易移开，并说可惜没有早些到，否则能一拳杀死巨人。索尔把名为“金鬃”的马赠给马格尼，这一后果把决斗与亲属、赏赐相连。', '故事还说巫女格罗娅试图取出索尔头中的燧石，索尔用贝尔甘米尔相关往事逗她开心，反而使她忘了咒语。此处仅提示后续关联；赫朗格尼尔之死、碎石解释和格罗娅的叙事位置都应保持同一散文章节的限定。'] }] }),
  story({ slug: 'thor-fishes-for-serpent', title: '索尔垂钓世界蛇', titleEn: 'Thor Fishes for the World Serpent', subtitle: '海面下的宿敌', summary: '索尔与海米尔出海，以牛头为饵钓起世界蛇；海米尔割断钓线，巨蛇沉回海中。', volumeId: 'norse-thor', volumeTitle: '索尔、洛基与巨人', volumeOrder: 3, displayOrder: 2, source: storySource('hymiskvida', 'sts. 17–24'), tradition: '《海米尔之歌》垂钓段落', characters: c('thor', 'jormungandr', 'hymir'), worlds: w('midgard', 'jotunheim'), scenes: s('midgard-coast'), narrative: '索尔垂钓世界蛇的场景让海洋成为宿命关系的舞台。巨蛇不是一个普通怪兽，而是包围人类世界、与雷神形成结构性对抗的存在。', editorialStatus: 'structured', sections: [{ id: 'rowing-out', heading: '越过海米尔习惯的渔场', paragraphs: ['《海米尔之歌》中，索尔要求海米尔带他出海。海米尔担心他体力不支，索尔却先取走一头牛的头作鱼饵；两人划得比海米尔平常钓鱼的地方更远。诗将挑战设置在海的边缘，而不是明确的神界战场。', '牛头沉入深水后，环绕大地的巨蛇咬钩。索尔使双脚顶住船底、拉起鱼线，蛇从海中抬头，毒液与威胁在水面上相对。文本用夸张的身体动作呈现冲突，却没有把这次相遇写成诸神黄昏的最终战。'] }, { id: 'cut-line', heading: '钓线被割断', paragraphs: ['海米尔看见世界蛇后害怕，割断钓线，蛇沉回海中。不同叙事与图像传统会强调索尔是否以锤击中蛇，但《海米尔之歌》这一段的叙事结果是蛇逃回深海；读者不应把后来的结局倒灌成此次垂钓已经杀死了它。', '诗中紧接着索尔把船带回岸边，随后故事转入大锅与巨人宅邸的情节。页面将垂钓、取锅和末日对决作为三个可区分的阅读节点，避免把同一首诗和不同散文版本压成一幅连续战斗图。'] }, { id: 'relation-scope', heading: '一次相遇与末日宿敌', paragraphs: ['本篇以《海米尔之歌》17–24 节为主。世界蛇与索尔在《女预言家之歌》的诸神黄昏段落还会再度相遇，但那是另一处来源与另一种叙事位置。', '视觉锚点可以是狭小船只、牛头鱼饵、拉紧的线和海面上升起的蛇首；不得把“被钓起”直接等同“已被杀死”，也不要用现代海怪设计替代其围绕人类世界的宇宙功能。'] }] }),
  story({ slug: 'thryms-stolen-hammer', title: '雷神之锤被盗', titleEn: 'The Theft of Mjölnir', subtitle: '神锤与伪装的新娘', summary: '巨人索列姆夺走索尔的锤子，洛基协助索尔伪装成新娘，在婚宴中取回武器。', volumeId: 'norse-thor', volumeTitle: '索尔、洛基与巨人', volumeOrder: 3, displayOrder: 3, source: storySource('thrymskvida', 'st. 1–32'), tradition: '《索列姆之歌》传统', characters: c('thor', 'loki', 'freyja', 'heimdall', 'thrymr'), worlds: w('jotunheim', 'asgard'), scenes: s('thryms-hall'), objects: ['object-norse-mjolnir'], narrative: '失去妙尔尼尔后，索尔的守护身份暂时失去支点。索列姆以芙蕾雅为交换条件，洛基则协助索尔伪装赴宴。故事以婚宴、服装与策略把武器归还变成一场公开的表演。' }),
  story({ slug: 'thor-in-utgard', title: '索尔在乌特加德', titleEn: 'Thor in Útgarða-Loki’s Hall', subtitle: '力量被幻象重新定义', summary: '索尔在巨人大厅中接受看似简单却被魔法改写的挑战。', volumeId: 'norse-thor', volumeTitle: '索尔、洛基与巨人', volumeOrder: 3, displayOrder: 4, source: sources.prose, tradition: '乌特加德传统', characters: c('thor', 'loki'), worlds: w('jotunheim'), scenes: s('jotunheim-border'), narrative: '乌特加德的挑战不是公平竞技，而是把海洋、老年和世界本身伪装成对手。索尔即使失败，也因此显露出力量的尺度。' }),
  story({ slug: 'thor-and-geirrod', title: '索尔与盖尔罗德', titleEn: 'Thor and Geirröðr', subtitle: '穿越巨人领地的危险旅程', summary: '索尔在洛基协助与意外装备下进入盖尔罗德的领地。', volumeId: 'norse-thor', volumeTitle: '索尔、洛基与巨人', volumeOrder: 3, displayOrder: 5, source: sources.skaldic, tradition: '索尔与巨人传统', characters: c('thor', 'loki'), worlds: w('jotunheim'), scenes: s('jotunheim-border'), narrative: '这段旅程把渡河、伪装、巨人厅堂和武器交给一个连续空间。索尔的力量始终需要通过道路与工具才能抵达冲突现场。' }),
  story({ slug: 'fenrir-and-gleipnir', title: '芬里尔与格莱普尼尔', titleEn: 'Fenrir and Gleipnir', subtitle: '一条看不见的束缚', summary: '诸神用格莱普尼尔束缚芬里尔，并由提尔付出一只手作为代价。', volumeId: 'norse-thor', volumeTitle: '索尔、洛基与巨人', volumeOrder: 3, displayOrder: 6, source: sources.prose, tradition: '芬里尔束缚传统', characters: c('fenrir', 'tyr', 'odin'), worlds: w('asgard', 'jotunheim'), scenes: s('asgard-court'), narrative: '格莱普尼尔由看似不可能的材料制成，芬里尔最终接受试探却不再相信诸神。提尔把手放入狼口，使契约的代价留在身体上。' }),
  story({ slug: 'lokis-feast', title: '洛基的宴席争辩', titleEn: 'Loki’s Flyting', subtitle: '宴席成为秩序的审判场', summary: '洛基在宴席中揭露诸神的秘密，语言冲突使共同体的裂缝公开化。', volumeId: 'norse-thor', volumeTitle: '索尔、洛基与巨人', volumeOrder: 3, displayOrder: 7, source: sources.poetic, tradition: '《洛基的争辩》传统', characters: c('loki', 'odin', 'thor', 'freyja', 'tyr'), worlds: w('asgard'), scenes: s('asgard-court'), narrative: '洛基的攻击不是普通吵架，而是把神族内部的债务、欲望和不体面历史重新带到公共宴席。秩序正是在被说出之后开始崩裂。' }),
  story({ slug: 'baldrs-dreams', title: '巴德尔的梦', titleEn: 'Baldr’s Dreams', subtitle: '死亡先以梦的形式到来', summary: '巴德尔反复梦见危险，诸神开始寻找梦境背后的死亡预兆。', volumeId: 'norse-baldr', volumeTitle: '巴德尔之死与秩序崩裂', volumeOrder: 4, displayOrder: 1, source: sources.poetic, tradition: '巴德尔循环', characters: c('baldr', 'odin', 'frigg'), worlds: w('asgard'), scenes: s('asgard-court'), narrative: '巴德尔的梦把末日提前写进神域日常。奥丁前往亡者道路寻找答案，预言由此成为无法轻易解除的压力。' }),
  story({ slug: 'baldrs-death', title: '巴德尔之死', titleEn: 'The Death of Baldr', subtitle: '一枝槲寄生穿过保护', summary: '弗丽嘉让万物保证不伤害巴德尔，却遗漏了槲寄生；洛基借霍德尔之手完成致命一击。', volumeId: 'norse-baldr', volumeTitle: '巴德尔之死与秩序崩裂', volumeOrder: 4, displayOrder: 2, source: sources.prose, tradition: '巴德尔之死传统', characters: c('baldr', 'frigg', 'loki', 'hodr'), worlds: w('asgard'), scenes: s('asgard-court'), narrative: '保护巴德尔的誓言制造出一种看似绝对的安全，却留下一个微小而致命的例外。洛基、霍德尔与槲寄生让神域的游戏转为真正的哀悼。' }),
  story({ slug: 'baldrs-funeral', title: '巴德尔的葬礼', titleEn: 'Baldr’s Funeral', subtitle: '葬船驶入无法挽回的悲剧', summary: '巴德尔被送上赫林霍尔尼葬船，诸神的秩序在仪式与哀悼中暴露出裂痕。', volumeId: 'norse-baldr', volumeTitle: '巴德尔之死与秩序崩裂', volumeOrder: 4, displayOrder: 3, source: storySource('proseEddaGylfaginning', 'ch. 49'), tradition: '《欺骗古鲁菲》葬礼传统', characters: c('baldr', 'odin', 'frigg', 'thor', 'nanna'), worlds: w('asgard', 'hel'), scenes: s('baldr-funeral-shore'), objects: ['object-norse-hringhorni'], narrative: '葬礼把巴德尔的死亡从个人事件变成整个神族共同体的损失。赫林霍尔尼、火焰与哭泣并没有自动带来复原，反而使之后的追寻更加迫切。纳吉尔法属于诸神黄昏的另一条末日叙事，不在此处出现。' }),
  story({ slug: 'hermod-rides-to-hel', title: '赫尔莫德前往赫尔', titleEn: 'Hermóðr Rides to Hel', subtitle: '穿过亡者道路的请求', summary: '赫尔莫德骑行前往海拉的国度，请求让巴德尔返回神域。', volumeId: 'norse-baldr', volumeTitle: '巴德尔之死与秩序崩裂', volumeOrder: 4, displayOrder: 4, source: sources.prose, tradition: '亡者道路传统', characters: c('hermod', 'baldr', 'hel'), worlds: w('asgard', 'hel'), scenes: s('hall-of-hel'), narrative: '赫尔莫德的旅程把 Hel 作为一个有道路、有统治者、有条件的空间，而不是把人物 Hel 与地点混为同一项。' }),
  story({ slug: 'loki-bound', title: '洛基被捕与束缚', titleEn: 'Loki Bound', subtitle: '毒液滴落在秩序裂缝上', summary: '洛基因巴德尔之死被捕并束缚，西格恩试图接住滴落的毒液。', volumeId: 'norse-baldr', volumeTitle: '巴德尔之死与秩序崩裂', volumeOrder: 4, displayOrder: 5, source: sources.prose, tradition: '洛基受缚传统', characters: c('loki', 'sigyn'), worlds: w('asgard'), scenes: s('world-tree-roots'), narrative: '洛基的束缚是惩罚，也是诸神试图把裂缝固定在一个身体上的行为。西格恩的碗让陪伴、疼痛与持续时间成为场景核心。' }),
  story({ slug: 'fimbulwinter', title: '芬布尔之冬与束缚崩解', titleEn: 'Fimbulwinter and the Breaking of Bonds', subtitle: '漫长冬季先于世界毁灭', summary: '芬布尔之冬、狼吞日月与束缚崩解共同预示诸神黄昏。', volumeId: 'norse-ragnarok', volumeTitle: '诸神黄昏与世界再生', volumeOrder: 5, displayOrder: 1, source: sources.poetic, tradition: '诸神黄昏传统', characters: c('fenrir', 'jormungandr', 'loki', 'odin'), worlds: w('midgard', 'jotunheim'), scenes: s('fimbulwinter-field'), narrative: '末日不是突然降临的一次爆炸，而是冬季、饥荒、冲突和束缚崩解逐步积累的过程。世界的尺度因此先通过天气和道路被感知。' }),
  story({ slug: 'odin-and-fenrir', title: '奥丁与芬里尔', titleEn: 'Odin and Fenrir', subtitle: '预言中的吞噬', summary: '诸神黄昏中芬里尔挣脱束缚并吞噬奥丁，复仇由维达尔完成。', volumeId: 'norse-ragnarok', volumeTitle: '诸神黄昏与世界再生', volumeOrder: 5, displayOrder: 2, source: sources.poetic, tradition: '诸神黄昏传统', characters: c('odin', 'fenrir', 'vidarr'), worlds: w('midgard', 'asgard'), scenes: s('fimbulwinter-field'), narrative: '奥丁与芬里尔的关系把早先的束缚、恐惧和预言推向结局。维达尔的存续并不是简单的胜利，而是旧秩序崩解后仍保留的反击能力。' }),
  story({ slug: 'thor-and-jormungandr-final-battle', title: '索尔与世界蛇的最后一战', titleEn: 'Thor and Jörmungandr at Ragnarök', subtitle: '宿敌在海与雷之间相遇', summary: '索尔击杀世界蛇，却在九步之后倒下，宿命关系以双重胜负结束。', volumeId: 'norse-ragnarok', volumeTitle: '诸神黄昏与世界再生', volumeOrder: 5, displayOrder: 3, source: sources.poetic, tradition: '诸神黄昏传统', characters: c('thor', 'jormungandr'), worlds: w('midgard'), scenes: s('midgard-coast'), narrative: '索尔与世界蛇的结局不适合用单纯胜负概括。雷神完成守护者的动作，却也承受巨蛇毒液，二者的故事在同一瞬间完成。' }),
  story({ slug: 'freyr-and-surtr', title: '弗雷与苏尔特', titleEn: 'Freyr and Surtr', subtitle: '丰饶神面对火焰边界', summary: '弗雷在诸神黄昏中面对苏尔特，失去武器的代价最终显现。', volumeId: 'norse-ragnarok', volumeTitle: '诸神黄昏与世界再生', volumeOrder: 5, displayOrder: 4, source: sources.poetic, tradition: '诸神黄昏传统', characters: c('freyr', 'surtr'), worlds: w('muspell', 'asgard'), scenes: s('muspell-flame-border'), narrative: '弗雷与苏尔特把丰饶、武器和火焰末日放进同一个对照。穆斯贝尔不是普通的红色背景，而是旧世界终结的力量边界。' }),
  story({ slug: 'heimdall-and-loki', title: '海姆达尔、洛基与加拉尔号角', titleEn: 'Heimdall, Loki and Gjallarhorn', subtitle: '号角吹响最后的警报', summary: '海姆达尔吹响号角，最终与洛基相遇并在战斗中同归于尽。', volumeId: 'norse-ragnarok', volumeTitle: '诸神黄昏与世界再生', volumeOrder: 5, displayOrder: 5, source: sources.poetic, tradition: '诸神黄昏传统', characters: c('heimdall', 'loki'), worlds: w('asgard'), scenes: s('bifrost'), narrative: '海姆达尔的号角把末日从隐约预兆转为公共事件。彩虹桥成为守望、通行和最后冲突同时发生的窄地。' }),
  story({ slug: 'ragnarok', title: '世界毁灭、回归与新生', titleEn: 'Destruction, Return and Renewal', subtitle: '火焰之后仍有世界', summary: '世界被火与海重塑，幸存者与归来的神祇重新开始生活。', volumeId: 'norse-ragnarok', volumeTitle: '诸神黄昏与世界再生', volumeOrder: 5, displayOrder: 6, source: storySource('voluspa', 'st. 54–66'), tradition: '《女预言家之歌》诸神黄昏与再生传统', characters: c('vidarr', 'baldr', 'hodr'), worlds: w('midgard', 'asgard'), scenes: s('renewed-earth'), objects: ['object-norse-naglfar'], narrative: '毁灭并不是北欧宇宙的唯一终点。火焰退去、土地重新显现，幸存者和归来的神祇让“再生”保留了损失之后的重量。弗雷在与苏尔特的冲突中倒下，不列入此处的幸存者。' }),
  story({ slug: 'volsung-and-sword-tree', title: '沃尔松格与树中神剑', titleEn: 'Völsung and the Sword-Tree', subtitle: '宴席上的陌生人留下了一把剑', summary: '西格尔德与西格妮的婚宴上，一名独眼陌生人将剑插入树中；只有西格蒙德能拔出它。', kind: 'heroic-legend', volumeId: 'norse-volsung', volumeTitle: '沃尔松格英雄传统', volumeOrder: 6, displayOrder: 1, source: storySource('volsungaSaga', 'chs. 2–3'), tradition: '《沃尔松格萨迦》沃尔松格家族前史', characters: c('volsung', 'sigmund'), worlds: w('midgard'), scenes: s('volsung-hall'), narrative: '树中之剑让沃尔松格家族的婚姻、待客、竞争与后续复仇从一场宴席开始缠绕。', editorialStatus: 'structured', sections: [{ id: 'feast', heading: '婚宴中的陌生人', paragraphs: ['《沃尔松格萨迦》第二至三章叙述国王沃尔松格的女儿西格妮嫁给西格盖尔。宴席上，一个戴斗篷、独眼的陌生人走入大厅，将一把剑插进厅中的大树，并宣称能拔出者便可拥有它。叙事不需要把陌生人所有身份解释都提前说尽，但这幅形象与后续家族命运紧密相连。', '宾客逐一尝试失败，西格蒙德拔出剑。西格盖尔愿以重金购买，西格蒙德拒绝；剑由此不只是武器，而成为婚姻结盟刚刚建立时就显出的竞争与敌意。'] }, { id: 'betrayal', heading: '礼物转为敌对的预兆', paragraphs: ['西格盖尔带西格妮与沃尔松格诸子回到自己的领地，并准备背叛他们。萨迦将剑、宴席和旅行安排为家庭灾难的前奏，而不是一条可独立收集的“英雄装备”任务。', '本篇只覆盖沃尔松格前史和树中之剑的出现。西格妮如何留在西格盖尔家中、西格蒙德如何幸存、以及复仇的伦理代价，将在后续独立 Story 中展开。'] }, { id: 'scope', heading: '英雄传统的起点', paragraphs: ['沃尔松格传统属于英雄传奇，而非诸神黄昏的直接续篇。人物可与奥丁形象发生叙事关联，但家族、婚姻和复仇的因果必须按《沃尔松格萨迦》的范围阅读。', '视觉锚点是大厅中的大树、插入树干的剑和宾客的失败尝试；任何王国徽章、盔甲体系或确定的时代建筑均属 MythCanvas 的原创诠释。'] }] }),
  story({ slug: 'signy-and-siggeir', title: '西格妮与西格盖尔', titleEn: 'Signý and Siggeir', subtitle: '幸存者与复仇被困在同一座王宫', summary: '西格盖尔背叛沃尔松格家族，西格妮留在仇敌身边，协助西格蒙德完成复仇。', kind: 'heroic-legend', volumeId: 'norse-volsung', volumeTitle: '沃尔松格英雄传统', volumeOrder: 6, displayOrder: 2, source: storySource('volsungaSaga', 'chs. 3–8'), tradition: '《沃尔松格萨迦》西格妮复仇段落', characters: c('signy', 'siggeir', 'sigmund'), worlds: w('midgard'), scenes: s('volsung-hall'), narrative: '西格妮的选择并非被动等待：她在无法离开仇敌王宫的处境中，为幸存的兄弟准备复仇。', editorialStatus: 'structured', sections: [{ id: 'ambush', heading: '婚姻后的背叛', paragraphs: ['西格盖尔将沃尔松格及其儿子引至自己的领地后发动袭击。萨迦写西格妮预感到危险，却不能阻止父亲与兄弟赴约；沃尔松格被杀，西格蒙德等人被囚，后又遭狼袭，只有西格蒙德幸存。', '西格妮选择不与西格蒙德一同逃离，而留在西格盖尔的王宫。她的处境与行动使这条复仇线不只是“男性英雄回归”的故事：信息、藏身处与决断同样来自留在敌方空间的人。'] }, { id: 'revenge', heading: '复仇的代价', paragraphs: ['西格妮秘密协助西格蒙德，并以极端且令人不安的方式确保复仇者的血统和忠诚。两人最终焚毁西格盖尔的厅堂；西格妮选择与丈夫同死，而西格蒙德离开。', '这段材料包含亲属、胁迫、暴力与自我毁灭，不能被改写为浪漫或励志桥段。页面会给出内容提示，并将复仇的伦理张力保留为故事本身的问题，而非替读者做无成本的道德洗白。'] }, { id: 'scope', heading: '复仇不是唯一的英雄价值', paragraphs: ['本篇以《沃尔松格萨迦》第三至八章为范围。西格妮与西格盖尔的婚姻、树中剑和西格蒙德的幸存相互关联，却都不应被压缩成一条简单家谱。', '后续“西格蒙德与辛菲奥特利”会处理幸存者共同生活、狼皮与下一代；本篇停在复仇完成后的断裂，避免把西格妮的叙事能动性从主线中抹去。'] }] }),
  story({ slug: 'sigmund-and-sinfjotli', title: '西格蒙德与辛菲奥特利', titleEn: 'Sigmund and Sinfjötli', subtitle: '幸存者、狼皮与下一代复仇者', summary: '西格蒙德与辛菲奥特利共同生活、穿上狼皮并参与复仇，家族暴力在下一代延续。', kind: 'heroic-legend', volumeId: 'norse-volsung', volumeTitle: '沃尔松格英雄传统', volumeOrder: 6, displayOrder: 3, source: storySource('volsungaSaga', 'chs. 7–10'), tradition: '《沃尔松格萨迦》西格蒙德与辛菲奥特利段落', characters: c('sigmund', 'sinfjotli'), worlds: w('midgard'), scenes: s('volsung-hall'), narrative: '西格蒙德与辛菲奥特利的故事把生存、变形、亲属关系与复仇代际并置。', editorialStatus: 'structured', sections: [{ id: 'forest', heading: '森林中的父子', paragraphs: ['萨迦让西格蒙德与辛菲奥特利在林中共同生活，并取得会使穿戴者化为狼的皮。两人在既定期限内不能轻易脱下狼皮，故事因此把人、动物性和暴力置于一种受限制的变形状态。', '辛菲奥特利的出身与西格妮的复仇计划有关，这一信息不能被写成英雄血统的浪漫来源。它说明家族为了复仇跨越了严重的伦理边界，也使人物命运长期被前一篇故事牵引。'] }, { id: 'conflict', heading: '复仇延续而非修复', paragraphs: ['西格蒙德与辛菲奥特利后来回到社会空间，卷入新的婚姻与敌对冲突。辛菲奥特利杀死西格盖尔之子等事件，使复仇不再只是一次已完成的清算，而成为代际间不断扩散的行为方式。', '文本中的死亡、诱骗和暴力不会被产品叙述淡化为升级打怪。故事的重要性在于它让读者看见：幸存并没有使沃尔松格家族脱离旧债，而是产生了新的亲属与政治后果。'] }, { id: 'scope', heading: '通向西格蒙德晚年的一段路', paragraphs: ['本篇以第七至十章为范围，后面将由“西格蒙德之死与希奥尔迪斯”处理辛菲奥特利之死、再婚和西格尔德的出生背景。', '视觉设计可用森林、狼皮和两人共同穿行的状态传达来源锚点，但不把他们塑造成现代狼人类型的固定设定。'] }] }),
  story({ slug: 'sigurd-and-regin', title: '西格尔德与雷金', titleEn: 'Sigurd and Regin', subtitle: '英雄被锻造成命运的刀锋', summary: '西格尔德在雷金的引导下获得格拉墨，走进沃尔松格英雄传统。', kind: 'heroic-legend', volumeId: 'norse-volsung', volumeTitle: '沃尔松格英雄传统', volumeOrder: 6, displayOrder: 4, source: sources.volsung, tradition: '沃尔松格英雄传统', characters: c('sigurd'), worlds: w('midgard'), scenes: s('volsung-hall'), objects: ['object-norse-gram'], narrative: '沃尔松格故事把神话宇宙的英雄传统带入家族、锻造和复仇。西格尔德的身份由武器、师承和家族债务共同塑造。' }),
  story({ slug: 'sigurd-kills-fafnir', title: '西格尔德斩杀法夫纳', titleEn: 'Sigurd Slays Fafnir', subtitle: '龙血与宝藏的危险知识', summary: '西格尔德在洞穴外设伏杀死法夫纳，获得宝藏却也继承诅咒。', kind: 'heroic-legend', volumeId: 'norse-volsung', volumeTitle: '沃尔松格英雄传统', volumeOrder: 6, displayOrder: 2, source: sources.volsung, tradition: '沃尔松格英雄传统', characters: c('sigurd', 'fafnir'), worlds: w('midgard'), scenes: s('volsung-hall'), objects: ['object-norse-gram', 'object-norse-andvaranaut'], narrative: '法夫纳不是天生的抽象恶龙，而是被贪欲转化的角色。西格尔德的胜利因此同时是屠龙、夺宝和进入诅咒网络。' }),
  story({ slug: 'sigurd-and-brynhildr', title: '西格尔德与布伦希尔德', titleEn: 'Sigurd and Brynhildr', subtitle: '誓言穿过火焰边界', summary: '西格尔德与布伦希尔德的相遇和誓言为英雄传统埋下后续冲突。', kind: 'heroic-legend', volumeId: 'norse-volsung', volumeTitle: '沃尔松格英雄传统', volumeOrder: 6, displayOrder: 3, source: sources.volsung, tradition: '沃尔松格英雄传统', characters: c('sigurd', 'brynhildr'), worlds: w('midgard'), scenes: s('volsung-hall'), narrative: '布伦希尔德与西格尔德的关系以火焰、誓言和记忆为核心。它不是一个脱离传统的浪漫支线，而是家族政治与英雄声誉的关键节点。' }),
  story({ slug: 'sigurds-death', title: '西格尔德之死', titleEn: 'The Death of Sigurd', subtitle: '英雄声名无法阻止背叛', summary: '西格尔德的死亡使誓言、婚姻与宝藏的冲突进入不可逆的结局。', kind: 'heroic-legend', volumeId: 'norse-volsung', volumeTitle: '沃尔松格英雄传统', volumeOrder: 6, displayOrder: 4, source: sources.volsung, tradition: '沃尔松格英雄传统', characters: c('sigurd', 'brynhildr'), worlds: w('midgard'), scenes: s('volsung-hall'), narrative: '西格尔德之死让英雄传统脱离单纯的胜利叙事。身份、误认、誓言和宝藏彼此交错，最终把声名转成哀悼。' }),
  story({ slug: 'odin-and-vafthrudnir', title: '奥丁与瓦夫苏鲁德尼尔', titleEn: 'Odin and Vafþrúðnir', subtitle: '以知识作赌注的问答', summary: '奥丁伪名格里姆尼尔前往瓦夫苏鲁德尼尔处，以宇宙和末日知识进行问答，最终提出只有自己知道的问题。', volumeId: 'norse-order', volumeTitle: '神族秩序与知识', volumeOrder: 2, displayOrder: 11, source: storySource('vafthrudnismal', 'sts. 1–55'), tradition: '《瓦夫苏鲁德尼尔之歌》问答传统', characters: c('odin', 'vafthrudnir'), worlds: w('asgard', 'jotunheim'), scenes: s('jotunheim-border'), narrative: '知识竞赛既展示宇宙起源与末日预言，也暴露提问者如何以身份优势结束赌局。', editorialStatus: 'structured', sections: [{ id: 'contest', heading: '格里姆尼尔进入巨人的厅堂', paragraphs: ['《瓦夫苏鲁德尼尔之歌》让奥丁以格里姆尼尔之名拜访以智慧闻名的巨人。弗丽嘉警告他不要轻率赌上性命；奥丁仍接受问答，这使诗中的知识从一开始就带有风险与竞争。', '双方轮流询问世界最初的状态、天体、神祇与诸神黄昏后的幸存者。诗歌的问答形式不是百科目录，而是把宇宙知识放进两个对手的语言关系中。'] }, { id: 'final-question', heading: '无人能答的问题', paragraphs: ['最后奥丁问：巴德尔被送上火葬船时，他在儿子耳中说了什么。瓦夫苏鲁德尼尔意识到提问者身份，只能承认奥丁最有智慧。这里的胜利并不只是“答对更多题”，而是奥丁掌握了对方不可能拥有的私密知识。', '本篇以全诗一至五十五节为范围。关于巴德尔葬礼的细节应回到《欺骗古鲁菲》及独立 Story；本页不把问答诗和散文叙事混作同一直接见证。'] }] }),
  story({ slug: 'thor-and-hymir', title: '索尔与海米尔的大锅', titleEn: 'Thor and Hymir’s Cauldron', subtitle: '一口足以供诸神酿酒的大锅', summary: '诸神需要大锅酿酒，索尔随提尔前往海米尔处，通过试炼取得巨锅。', volumeId: 'norse-thor', volumeTitle: '索尔、洛基与巨人', volumeOrder: 3, displayOrder: 8, source: storySource('hymiskvida', 'sts. 1–39'), tradition: '《海米尔之歌》取锅叙事', characters: c('thor', 'hymir'), worlds: w('jotunheim'), scenes: s('jotunheim-border'), narrative: '取锅故事将宴饮需要、巨人宅邸、垂钓与力量试炼编织在同一首诗中。', editorialStatus: 'structured', sections: [{ id: 'need', heading: '诸神需要一口大锅', paragraphs: ['《海米尔之歌》以诸神想酿酒却缺少足够大的锅开始。提尔知道巨人海米尔拥有一口适合的巨锅，于是索尔与他一同前往；这让故事的目标首先是共同体的宴饮，而非无端挑战巨人。', '在海米尔宅邸，索尔经历食物、酒杯和力量的多重试炼。诗中不同段落的衔接与人物身份存在研究问题，页面不把每一个注释争议伪装成没有分歧的连续电影情节。'] }, { id: 'cauldron', heading: '带走巨锅', paragraphs: ['垂钓世界蛇之后，故事回到大锅：索尔打碎石柱、搬走巨锅，并在追赶中以力量应对海米尔及其他巨人。大锅是一个可追溯物件，而不是“战利品”式的无来源图标。', '本篇涵盖全诗一至三十九节；垂钓段落已有独立 Story，以便读者区分一次海上相遇和取得大锅的整体任务。视觉设计可借助巨大锅、厅堂与归途，但不能把北欧饮酒器具的现代想象当作文本事实。'] }] }),
  story({ slug: 'loki-and-angrboda', title: '洛基与安格尔伯达', titleEn: 'Loki and Angrboða', subtitle: '三名孩子与诸神的恐惧', summary: '《欺骗古鲁菲》将洛基与巨人安格尔伯达所生的芬里尔、世界蛇和赫尔并置，诸神对预言的回应改变三者命运。', volumeId: 'norse-thor', volumeTitle: '索尔、洛基与巨人', volumeOrder: 3, displayOrder: 9, source: storySource('proseEddaGylfaginning', 'ch. 34'), tradition: '《欺骗古鲁菲》洛基子女叙事', characters: c('loki', 'angrboda', 'fenrir', 'jormungandr', 'hel'), worlds: w('asgard', 'jotunheim', 'midgard', 'hel'), scenes: s('asgard-court'), narrative: '三名子女的命运由他们自身的形象与诸神预言中的恐惧共同塑造。', editorialStatus: 'structured', sections: [{ id: 'children', heading: '三个被并置的子女', paragraphs: ['第四十三章前的叙事脉络中，《欺骗古鲁菲》第三十四章说明洛基与安格尔伯达生下芬里尔、世界蛇和赫尔。文本将三者的未来威胁与诸神的预言相连，却不把安格尔伯达展开为一段完整人物传记。', '因此，本页把她作为这则散文叙事的亲属节点，而不凭空填充外貌、阵营或母职性格。三个子女也并非同一种存在：狼、蛇与赫尔的统治空间各有不同的后续故事。'] }, { id: 'separation', heading: '预言引出的分离', paragraphs: ['诸神将世界蛇投入环绕人类世界的海，将赫尔送往亡者之地，又决定抚养芬里尔直到无法继续控制。这些安排是诸神对未来的应对，不能被改写成三者天然“自愿选择”自己的位置。', '芬里尔的束缚、世界蛇与索尔的冲突、赫尔与巴德尔的谈判都另有来源范围和 Story。拆开阅读能让读者看到同一章中预言如何分叉成多条叙事，而不将所有内容压入洛基一人的单线反派故事。'] }] }),
  story({ slug: 'grimnir-revealed', title: '格里姆尼尔的启示', titleEn: 'Grímnir Revealed', subtitle: '受折磨的陌生人说出诸神世界', summary: '奥丁化名格里姆尼尔受困于盖鲁德王，连续八夜遭受火焰折磨后说出诸神居所，最终显露身份。', volumeId: 'norse-order', volumeTitle: '神族秩序与知识', volumeOrder: 2, displayOrder: 12, source: storySource('grimnismal', 'sts. 1–54'), tradition: '《格里姆尼尔之歌》传统', characters: c('odin'), worlds: w('asgard'), scenes: s('asgard-court'), narrative: '诗歌把宇宙知识置于囚禁、待客失败和王权惩罚的情境之中。', editorialStatus: 'structured', sections: [{ id: 'captivity', heading: '两堆火之间的陌生人', paragraphs: ['《格里姆尼尔之歌》散文序言说，奥丁化名格里姆尼尔来到盖鲁德王处，被夹在两堆火之间八夜。王子阿格纳尔给他饮水，成为这段待客失范中的少数善意。', '格里姆尼尔的启示不是安静讲课：住所、河流、世界树和诸神的名字都在受折磨的言说中被列出，因此每一项都必须按诗节范围而非现代百科地图理解。'] }, { id: 'revelation', heading: '身份显露与王的死亡', paragraphs: ['诗末格里姆尼尔说出自己是奥丁，并列举多个名字。盖鲁德王拔剑欲解除折磨，却自己跌倒在剑上死亡；阿格纳尔继位。', '本篇限于全诗及其散文框架。瓦尔哈拉、世界树和奥丁乌鸦分别有可独立追踪的诗节与 Story，不用一次启示替代所有叙事。'] }] }),
  story({ slug: 'valholl-and-valkyries', title: '瓦尔哈拉与女武神', titleEn: 'Valhöll and the Valkyries', subtitle: '战死者的大厅与日常秩序', summary: '《格里姆尼尔之歌》描述奥丁的瓦尔哈拉、其中的战死者与服务宴饮的女武神。', volumeId: 'norse-order', volumeTitle: '神族秩序与知识', volumeOrder: 2, displayOrder: 13, source: storySource('grimnismal', 'sts. 8–13, 36'), tradition: '《格里姆尼尔之歌》瓦尔哈拉段落', characters: c('odin'), worlds: w('asgard'), scenes: s('asgard-court'), narrative: '瓦尔哈拉是诗歌中的奥丁大厅，而非可任意填充的现代军营。', editorialStatus: 'structured', sections: [{ id: 'hall', heading: '奥丁的大厅', paragraphs: ['诗中说瓦尔哈拉有许多门，战死者每日相互战斗、复生，并在晚间回到大厅进食。描述强调的是循环、集体和宴饮，不等于提供一套完整死后世界制度。', '女武神在诗的不同段落中被命名并与选择战死者、端酒等意象关联。页面避免把她们统一成没有名字和行动的装饰性侍者。'] }, { id: 'scope', heading: '不与所有亡者世界混同', paragraphs: ['瓦尔哈拉属于奥丁的大厅，赫尔则是另一人物与亡者空间；两者不能在产品中混成同义词。诸神黄昏中的死者和军队也需回到其各自诗节。', '本篇仅按第八至十三、三十六节设置来源范围。大厅构图、武器与服装可作原创设计，但“所有北欧亡者都去瓦尔哈拉”不是本页或该诗能够支持的结论。'] }] }),
  story({ slug: 'andvari-gold', title: '安德瓦里与被诅咒的黄金', titleEn: 'Andvari’s Gold', subtitle: '赔偿之金进入沃尔松格悲剧', summary: '洛基以安德瓦里的黄金赔偿赫瑞德玛尔，安德瓦里诅咒戒指，财物随后引发家庭杀戮。', kind: 'heroic-legend', volumeId: 'norse-volsung', volumeTitle: '沃尔松格英雄传统', volumeOrder: 6, displayOrder: 5, source: storySource('reginsmal', 'sts. 1–26'), tradition: '《雷金之歌》安德瓦里黄金段落', characters: c('andvari', 'ottr', 'hreidmar', 'fafnir'), worlds: w('midgard'), scenes: s('volsung-hall'), objects: ['object-norse-andvaranaut'], narrative: '黄金既是补偿，也是把暴力与贪欲传递到英雄家族的媒介。', editorialStatus: 'structured', sections: [{ id: 'ransom', heading: '被杀的奥特与人头金', paragraphs: ['《雷金之歌》开篇中，洛基、奥丁和海尼尔杀死水獭形态的奥特；奥特的父亲赫瑞德玛尔要求用黄金填满皮囊作为赔偿。洛基从矮人安德瓦里处取得黄金和戒指。', '安德瓦里试图保留戒指，仍被夺走，并诅咒财物将给持有者带来死亡。叙事不是“黄金天然邪恶”的抽象寓言，而将杀害、赔偿、夺取和诅咒连在具体人物身上。'] }, { id: 'aftermath', heading: '财物没有终止债务', paragraphs: ['赫瑞德玛尔得到黄金后，法夫纳杀父并占有财物，后成为守护黄金的龙。安德瓦里的诅咒因而成为连接奥特、赫瑞德玛尔、法夫纳、雷金与西格尔德的叙事线索。', '本篇依据一至二十六节；萨迦和其他英雄诗对人物动机、宝物和后果有平行版本。页面保留物件与来源连接，不把戒指直接等同于现代奇幻作品的同名母题。'] }] }),
  story({ slug: 'helgi-hundingsbani', title: '赫尔吉·洪丁斯巴尼', titleEn: 'Helgi Hundingsbani', subtitle: '战船、女武神与英雄诗歌的开端', summary: '赫尔吉在与洪丁家族的冲突中获得名字与英雄身份，西格伦作为女武神进入这条诗歌传统。', kind: 'heroic-legend', volumeId: 'norse-helgi', volumeTitle: '赫尔吉英雄传统', volumeOrder: 7, displayOrder: 1, source: storySource('helgakvidaHundingsbana1', 'sts. 1–57'), tradition: '《赫尔吉·洪丁斯巴尼之歌 I》传统', characters: c('helgi-hundingsbani', 'sigrun', 'sinfjotli'), worlds: w('midgard'), scenes: s('midgard-coast'), narrative: '赫尔吉的英雄身份在战争、航行与女武神的出现中形成。', editorialStatus: 'structured', sections: [{ id: 'name-and-conflict', heading: '名字在冲突中获得', paragraphs: ['《赫尔吉·洪丁斯巴尼之歌 I》以家族冲突、隐匿的幼子和得名的过程开启。赫尔吉的名字与杀死洪丁的行动相连，诗歌由此把个人身份、敌对家系和名誉放进同一个叙事起点。', '这不是一份可以无缝接到诸神家谱上的神祇传记。赫尔吉属于英雄诗歌的传统层，人物的行动、亲属关系和女武神意象要按这组诗歌的范围阅读。'] }, { id: 'sigrun-enters', heading: '西格伦作为女武神出现', paragraphs: ['西格伦在诗中以女武神身份进入赫尔吉的战场世界；她既传递战事信息，也拥有自己的亲属与婚姻冲突。把她写成单纯奖赏或装饰，会抹去诗歌对她行动与选择的呈现。', '本页只使用《赫尔吉·洪丁斯巴尼之歌 I》的范围。赫尔吉与西格伦之后的相遇、死亡和葬丘主题，应由第二首诗和独立 Story 继续展开。'] }, { id: 'heroic-lane', heading: '为何单列英雄传统', paragraphs: ['赫尔吉故事的战船、长矛、婚姻冲突与复归母题，形成不同于奥丁、索尔或诸神黄昏的叙事节奏。页面将它单列为“赫尔吉英雄传统”，避免把所有古诺尔斯材料都压进同一神祇宇宙时间线。', '角色卡与来源卡保留为可追溯入口；任何未来视觉设计都应依据诗歌中的战场、航行和女武神关系，而非借用现代影视或游戏的北欧战士模板。'] }] }),
  story({ slug: 'volundr-captive-smith', title: '沃伦德：被囚的铁匠', titleEn: 'Völundr the Captive Smith', subtitle: '技艺、囚禁与逃离之前的静默', summary: '沃伦德被尼杜德囚禁在岛上铁匠铺，其技艺、戒指与失去自由共同构成独立英雄诗歌的张力。', kind: 'heroic-legend', volumeId: 'norse-independent-eddic', volumeTitle: '独立埃达英雄传统', volumeOrder: 8, displayOrder: 1, source: storySource('volundarkvida', 'sts. 1–19'), tradition: '《沃伦德之歌》囚禁段落', characters: c('volundr', 'nidudr'), worlds: w('midgard'), scenes: s('volsung-hall'), narrative: '沃伦德被囚禁后的铁匠工作，使技艺成为失去自由的见证。', editorialStatus: 'structured', sections: [{ id: 'three-brothers', heading: '离去的女伴与留下的戒指', paragraphs: ['《沃伦德之歌》开篇写沃伦德与两位兄弟同居，三位女伴后来离去。沃伦德仍留在原处，锻造金环，并期待她归来；这段等待让戒指既是物件，也成为失去关系后的叙事线索。', '诗歌的地名和身份称谓并不总能被现代改编整理成稳定王国地图。本页保留“北方英雄诗歌”的来源范围，不把它强行纳入沃尔松格家系或阿斯加德的固定地理。'] }, { id: 'captivity', heading: '囚禁并没有抹去技艺', paragraphs: ['尼杜德得知沃伦德的技艺后，将他囚禁在岛上，割断其腿筋并迫使他为王室制作器物。文本的暴力和权力关系是故事的核心，不能用“天才铁匠的奇幻冒险”轻描淡写。', '沃伦德在囚禁中继续工作，戒指被带入王室，人物关系因此从等待扩展为占有、控制与报复的张力。后半段的逃离与伤害另作独立 Story，避免压缩为一段猎奇情节。'] }, { id: 'independent-poem', heading: '独立诗歌不是边角素材', paragraphs: ['《沃伦德之歌》并非为了给诸神宝物补一条背景，而是一首拥有自身人物、地点和伦理冲突的英雄诗。它与赫尔吉、沃尔松格等传统可在产品中并列探索，却不应被混写成一条唯一正史。', '视觉创作应以铁砧、戒指、岛上工坊和受限的行动为锚点，避免把沃伦德设计成现代超级英雄或无来源的蒸汽朋克发明家。'] }] }),
  story({ slug: 'thor-and-skrymir', title: '索尔与斯克里米尔', titleEn: 'Thor and Skrymir', subtitle: '巨大的手套与无法击穿的头颅', summary: '索尔、洛基和随行者与斯克里米尔同行，索尔三次锤击看似失败，实际触及的是远方山体。', volumeId: 'norse-thor', volumeTitle: '索尔、洛基与巨人', volumeOrder: 3, displayOrder: 10, source: storySource('proseEddaGylfaginning', 'ch. 45'), tradition: '《欺骗古鲁菲》乌特加德前段', characters: c('thor', 'loki', 'skrymir'), worlds: w('jotunheim'), scenes: s('jotunheim-border'), narrative: '通往乌特加德的旅程先用尺度错觉削弱索尔对自身力量的判断。', editorialStatus: 'structured', sections: [{ id: 'journey', heading: '一只手套被误认成屋子', paragraphs: ['第四十五章中，索尔一行遇见斯克里米尔，夜里把他的巨大手套当作屋舍。斯克里米尔替他们背行囊，却用绳结令索尔无法打开食物袋；日常物件在巨人尺度下成为力量与无力的试验。', '索尔趁斯克里米尔睡着三次挥锤，次日巨人只说头部似有树叶或橡子落下。故事先让读者和人物共同误判锤击的效果。'] }, { id: 'revelation', heading: '失败并不等于力量不存在', paragraphs: ['到达乌特加德后，巨人之王解释三次锤击实际上击中了山，并留下深谷。这一揭示属于接下来的大厅故事，但也重置了索尔在旅程中经历的“失败”。', '本篇限定在第四十五章；斯克里米尔与乌特加达洛基的关系不应被简化为无来源的同一身份。'] }] }),
  story({ slug: 'loki-and-baldr', title: '洛基与巴德尔之死', titleEn: 'Loki and Baldr’s Death', subtitle: '被遗漏的槲寄生', summary: '洛基发现槲寄生未被弗丽嘉要求起誓，引导霍德尔投掷它，巴德尔因此死亡。', volumeId: 'norse-baldr', volumeTitle: '巴德尔之死与秩序崩裂', volumeOrder: 4, displayOrder: 7, source: storySource('proseEddaGylfaginning', 'ch. 49'), tradition: '《欺骗古鲁菲》巴德尔之死段落', characters: c('loki', 'baldr', 'hodr', 'frigg'), worlds: w('asgard'), scenes: s('asgard-court'), narrative: '一项看似周全的保护因被忽略的植物而失效，洛基将游戏变成了死亡。', editorialStatus: 'structured', sections: [{ id: 'oaths', heading: '誓言留下的例外', paragraphs: ['散文说巴德尔做不祥之梦后，弗丽嘉让万物承诺不伤害他；诸神便把向他投掷物件当作游戏。槲寄生因被认为太小而未被要求起誓，保护因此并非绝对。', '洛基向弗丽嘉探问后取得槲寄生，并将其交给未参与游戏的霍德尔。文本将死亡置于疏漏、试探与引导的链条中。'] }, { id: 'death', heading: '游戏成为哀悼', paragraphs: ['霍德尔投出槲寄生，巴德尔倒下。诸神震惊却无法立刻报复；这使神域的日常游戏转为不可逆的共同损失。', '本篇仅依第四十九章，不把霍德尔的身份与动机超出该散文范围地补写。葬礼、赫尔莫德之旅和洛基受缚另由独立 Story 处理。'] }] }),
  story({ slug: 'sigmunds-death-and-hjordis', title: '西格蒙德之死与希奥尔迪斯', titleEn: 'Sigmund’s Death and Hjördis', subtitle: '断剑与尚未出生的英雄', summary: '西格蒙德在战场上被独眼战士击断神剑而死；希奥尔迪斯保存剑的碎片，孕育西格尔德。', kind: 'heroic-legend', volumeId: 'norse-volsung', volumeTitle: '沃尔松格英雄传统', volumeOrder: 6, displayOrder: 6, source: storySource('volsungaSaga', 'chs. 11–12'), tradition: '《沃尔松格萨迦》西格尔德前史', characters: c('sigmund', 'hjordis', 'sigurd'), worlds: w('midgard'), scenes: s('volsung-hall'), narrative: '西格蒙德之死没有终结家族叙事：断裂的剑和希奥尔迪斯的行动把它交给未出生的西格尔德。', editorialStatus: 'structured', sections: [{ id: 'battle', heading: '剑在战场断裂', paragraphs: ['萨迦中西格蒙德在战争中遇到一名独眼战士，对方以长矛击碎其剑。西格蒙德拒绝让人医治，认为自己的好运已尽；这不是普通战败，而是家族武器与命运共同断裂。', '希奥尔迪斯在战后找到他，西格蒙德要求她保存剑的碎片给腹中的孩子。她的保存与传递使下一代英雄的条件并非只来自父亲的遗名。'] }, { id: 'inheritance', heading: '从碎片到西格尔德', paragraphs: ['希奥尔迪斯后来与阿尔夫王相遇，生下西格尔德；碎片将被重铸为格拉墨。故事将死亡、再婚和抚养置于英雄出现之前。', '本篇限定第十一至十二章，不把雷金的教育或法夫纳的黄金提前混入；它们属于西格尔德自身的后续 Story。'] }] }),
  story({ slug: 'loki-at-ragnarok', title: '洛基在诸神黄昏', titleEn: 'Loki at Ragnarök', subtitle: '从束缚者到末日战者', summary: '《女预言家之歌》在末日段落中让洛基随舰而来，并与海姆达尔同归于尽。', volumeId: 'norse-ragnarok', volumeTitle: '诸神黄昏与世界再生', volumeOrder: 5, displayOrder: 7, source: storySource('voluspa', 'sts. 46–51'), tradition: '《女预言家之歌》诸神黄昏段落', characters: c('loki', 'heimdall'), worlds: w('asgard', 'midgard'), scenes: s('bifrost'), narrative: '洛基在末日的叙事位置连接先前的束缚与最终的共同毁灭。', editorialStatus: 'structured', sections: [{ id: 'arrival', heading: '末日中的到来', paragraphs: ['《女预言家之歌》以巨人、船只、号角和诸神集结的图像推进末日。洛基在这一段与海姆达尔的结局相连，但诗歌并不提供一部可无缝填满的战场编年史。', '因此页面不将所有散文中洛基的前史都当作这几节诗的明说背景；束缚、航船和末日战争分别保留各自来源范围。'] }, { id: 'mutual-death', heading: '与海姆达尔的同归于尽', paragraphs: ['诗歌传统将洛基与海姆达尔置于最终冲突中，并以双方死亡收束这条对立。它不是奥丁、索尔等主战的附属桥段，而是守望者与秩序裂缝共同消失的结局。', '本篇使用四十六至五十一节；海姆达尔的号角和诸神黄昏整体将以交叉链接呈现，不把争议的细节写成唯一正史。'] }] }),
  story({ slug: 'sigurd-and-sigrdrifa', title: '西格尔德与西格德里法', titleEn: 'Sigurd and Sigrdrífa', subtitle: '火焰之后的知识与劝诫', summary: '西格尔德唤醒沉睡在盾墙中的西格德里法，她向他传授胜利符文与处世劝诫。', kind: 'heroic-legend', volumeId: 'norse-volsung', volumeTitle: '沃尔松格英雄传统', volumeOrder: 6, displayOrder: 7, source: storySource('sigrdrifumal', 'sts. 1–37'), tradition: '《西格德里法之歌》传统', characters: c('sigurd', 'brynhildr'), worlds: w('midgard'), scenes: s('volsung-hall'), narrative: '英雄相遇在诗歌中首先通过苏醒、知识与劝诫展开，而非只是一段浪漫关系。', editorialStatus: 'structured', sections: [{ id: 'awakening', heading: '从盾墙中醒来', paragraphs: ['《西格德里法之歌》开篇让西格尔德看见盾墙中的沉睡女子并使她醒来。人物身份与布伦希尔德的对应在不同传统中需要谨慎处理，页面以诗歌标题人物与来源范围为先。', '她以“胜利符文”等知识回应西格尔德，说明相遇不仅是英雄的行动成果，也包含女性人物的言说与传授。'] }, { id: 'counsel', heading: '劝诫并非战利品', paragraphs: ['后续诗节列出饮酒、誓言、分娩、航行与处世等不同情境的劝诫。它们不应被压缩为一页技能表，而是英雄诗歌把行动与言辞伦理并列的方式。', '本篇限于一至三十七节；西格尔德与布伦希尔德的婚姻、误认和死亡使用萨迦及其他诗歌的独立范围。'] }] }),
  story({ slug: 'gudrun-and-atli', title: '古德伦与阿特利', titleEn: 'Guðrún and Atli', subtitle: '宴席中的复仇与哀歌', summary: '阿特利以黄金为饵引诱古德伦的兄弟，古德伦预警失败后以极端方式复仇。', kind: 'heroic-legend', volumeId: 'norse-volsung', volumeTitle: '沃尔松格英雄传统', volumeOrder: 6, displayOrder: 8, source: storySource('atlakvida', 'sts. 1–46'), tradition: '《阿特利之歌》传统', characters: c('gudrun', 'atli', 'gunnar', 'hogni'), worlds: w('midgard'), scenes: s('volsung-hall'), narrative: '古德伦的哀歌与复仇使沃尔松格传统的家庭、财富和暴力走向更深的断裂。', editorialStatus: 'structured', sections: [{ id: 'warning', heading: '无法阻止的赴宴', paragraphs: ['《阿特利之歌》写阿特利邀请古德伦的兄弟贡纳尔与霍格尼，古德伦送出警告，却未能阻止他们前往。黄金与亲属关系在这里是诱饵和威胁，而非稳定联盟。', '两兄弟被杀的叙事存在诗歌与萨迦版本差异；本页以本诗的措辞和范围呈现，不把各版本细节强行统一。'] }, { id: 'revenge', heading: '复仇没有恢复家庭', paragraphs: ['古德伦杀死阿特利的儿子，以宴席和火焰实施复仇。材料含有严重暴力，不应被游戏化或美化为单纯的胜利。', '本篇使用一至四十六节，重点是古德伦的行动、哀悼与伦理断裂。斯万希尔德和哈姆迪尔兄弟属于另一条后续传统。'] }] }),
  story({ slug: 'helgi-hjorvardsson-and-svava', title: '赫尔吉·希奥尔瓦尔松与斯瓦瓦', titleEn: 'Helgi Hjörvarðsson and Sváfa', subtitle: '名字、誓言与女武神', summary: '赫尔吉在斯瓦瓦引导下取得名字与武器，二人的誓言被战争与继承冲突考验。', kind: 'heroic-legend', volumeId: 'norse-helgi', volumeTitle: '赫尔吉英雄传统', volumeOrder: 7, displayOrder: 2, source: storySource('helgakvidaHjorvardssonar', 'sts. 1–51'), tradition: '《赫尔吉·希奥尔瓦尔松之歌》传统', characters: c('helgi-hjorvardsson', 'svava'), worlds: w('midgard'), scenes: s('midgard-coast'), narrative: '赫尔吉与斯瓦瓦的诗歌将命名、女武神协助和婚姻誓言编入英雄成长。', editorialStatus: 'structured', sections: [{ id: 'name', heading: '由斯瓦瓦命名的英雄', paragraphs: ['诗歌让尚未命名的赫尔吉遇见女武神斯瓦瓦；她与武器、名誉和未来行动相连。斯瓦瓦不是英雄获得装备的无名奖赏，而是向他提出行动条件的人物。', '二人的关系在战事和家族安排中发展，不能直接套入另一位赫尔吉或西格伦的故事。'] }, { id: 'scope', heading: '独立的赫尔吉传统', paragraphs: ['本篇以一至五十一节为范围，呈现赫尔吉·希奥尔瓦尔松与斯瓦瓦的独立诗歌线。它与洪丁斯巴尼传统可并列阅读，不能因名字相同而合并为同一传记。', '视觉锚点是女武神、航行和誓言；具体服饰与城邦属于原创设计层。'] }] }),
  story({ slug: 'helgi-and-sigrun', title: '赫尔吉与西格伦', titleEn: 'Helgi and Sigrún', subtitle: '战场、亲属与婚姻选择', summary: '西格伦拒绝既定婚姻并支持赫尔吉，二人的关系被家族战争持续撕裂。', kind: 'heroic-legend', volumeId: 'norse-helgi', volumeTitle: '赫尔吉英雄传统', volumeOrder: 7, displayOrder: 3, source: storySource('helgakvidaHundingsbana2', 'sts. 1–51'), tradition: '《赫尔吉·洪丁斯巴尼之歌 II》传统', characters: c('helgi-hundingsbani', 'sigrun'), worlds: w('midgard'), scenes: s('midgard-coast'), narrative: '西格伦具有明确的选择与行动，婚姻并不能脱离其家族与战场背景理解。', editorialStatus: 'structured', sections: [{ id: 'choice', heading: '西格伦的选择', paragraphs: ['第二首赫尔吉诗把西格伦置于家族安排的婚姻和她自己支持赫尔吉之间。她传递消息、表达意愿，也承担由此带来的亲属冲突。', '将她写成战士的奖赏会抹去诗歌中的主动性与危险。'] }, { id: 'war', heading: '爱情无法隔绝战争', paragraphs: ['赫尔吉与西格伦的结合伴随复仇、战斗和亲属死亡。诗歌并不把他们的相遇收束为无代价的团圆，而将其留在英雄传统的暴力循环中。', '后续死亡和葬丘归来另由独立 Story 说明。'] }] }),
  story({ slug: 'helgi-burial-mound', title: '赫尔吉的葬丘与归来', titleEn: 'Helgi’s Burial Mound', subtitle: '一夜的相会不能逆转死亡', summary: '赫尔吉死后进入葬丘，西格伦在一夜相会中见到他，黎明后仍被留在生者世界。', kind: 'heroic-legend', volumeId: 'norse-helgi', volumeTitle: '赫尔吉英雄传统', volumeOrder: 7, displayOrder: 4, source: storySource('helgakvidaHundingsbana2', 'sts. 39–51'), tradition: '《赫尔吉·洪丁斯巴尼之歌 II》葬丘段落', characters: c('helgi-hundingsbani', 'sigrun'), worlds: w('midgard'), scenes: s('midgard-coast'), narrative: '葬丘场景让爱情与哀悼短暂相接，却不取消死亡。', editorialStatus: 'structured', sections: [{ id: 'mound', heading: '死者回到葬丘', paragraphs: ['诗末说赫尔吉在葬丘中归来，西格伦前往相会。归来被限定在夜晚与特定地点，而非死者真正恢复日常生活。', '这段相会强调哀悼的强度，也强调其时间边界。'] }, { id: 'dawn', heading: '黎明后的等待', paragraphs: ['黎明迫近时赫尔吉离去，西格伦仍留在生者一侧。诗歌没有以重逢治愈战争和死亡，而让等待继续存在。', '本篇仅使用三十九至五十一节，不把其他亡者传统或赫尔的国度自动拼入葬丘。'] }] }),
  story({ slug: 'volundr-escape', title: '沃伦德的逃离', titleEn: 'Völundr’s Escape', subtitle: '复仇、飞行与无法收回的伤害', summary: '沃伦德在囚禁中报复尼杜德家族，制作翅膀飞离岛上工坊。', kind: 'heroic-legend', volumeId: 'norse-independent-eddic', volumeTitle: '独立埃达英雄传统', volumeOrder: 8, displayOrder: 2, source: storySource('volundarkvida', 'sts. 20–41'), tradition: '《沃伦德之歌》逃离段落', characters: c('volundr', 'bodvildr'), worlds: w('midgard'), scenes: s('volsung-hall'), narrative: '逃离是囚禁故事的后半段，但复仇造成的伤害不能被技术奇观掩盖。', editorialStatus: 'structured', sections: [{ id: 'revenge', heading: '囚禁者的报复', paragraphs: ['《沃伦德之歌》后段写沃伦德对尼杜德之子的杀害，以及与博德维尔德相关的强制和后果。内容涉及严重暴力与性伤害，页面必须提供提示，不能将其包装为痛快复仇。', '沃伦德的技艺在此仍是权力不对等中的工具，并未抵消他先前遭受的囚禁。'] }, { id: 'flight', heading: '飞离工坊', paragraphs: ['沃伦德制作翅膀升空，尼杜德只能在地上询问自己的家人。诗以飞行结束行动，却不为任何一方提供道德上的轻易结算。', '本篇以二十至四十一节为范围，和囚禁篇共同构成独立的沃伦德传统。'] }] }),
  researchStory({ slug: 'nidhoggr-and-world-tree', title: '尼德霍格与世界树', titleEn: 'Níðhöggr and the World Tree', subtitle: '树根下的啃噬者', summary: '尼德霍格在世界树根部啃噬，成为宇宙树持续受损的一部分。', volumeId: 'norse-origins', volumeTitle: '创世与宇宙结构', volumeOrder: 1, displayOrder: 8, source: storySource('grimnismal', 'sts. 32–35'), tradition: '《格里姆尼尔之歌》世界树段落', characters: c('nidhoggr'), worlds: w('niflheim'), scenes: s('world-tree-roots'), focus: '《格里姆尼尔之歌》将尼德霍格置于世界树根部，和啃食枝叶的动物一起说明宇宙树并非无损的装饰，而是持续承受侵蚀的存在。' }),
  researchStory({ slug: 'odin-ravens', title: '胡金与穆宁', titleEn: 'Huginn and Muninn', subtitle: '每天飞越世界的两只乌鸦', summary: '奥丁担心胡金和穆宁飞越世界后不能归来。', volumeId: 'norse-order', volumeTitle: '神族秩序与知识', volumeOrder: 2, displayOrder: 14, source: storySource('grimnismal', 'st. 20'), tradition: '《格里姆尼尔之歌》乌鸦段落', characters: c('odin', 'huginn', 'muninn'), worlds: w('asgard'), scenes: s('asgard-court'), focus: '第二十节说胡金与穆宁每日飞越世界，奥丁更担心“思维”胡金不归，却也忧虑“记忆”穆宁；本页不把这一简短诗节扩写为秘密情报系统。' }),
  researchStory({ slug: 'odin-seidr', title: '奥丁与塞德魔法', titleEn: 'Odin and Seiðr', subtitle: '知识、预言与越界的技艺', summary: '《英灵格林伽萨迦》将塞德魔法与奥丁和弗蕾雅相连，也记述其社会污名。', volumeId: 'norse-order', volumeTitle: '神族秩序与知识', volumeOrder: 2, displayOrder: 15, source: storySource('ynglingaSaga', 'ch. 7'), tradition: '《英灵格林伽萨迦》塞德段落', characters: c('odin', 'freyja'), worlds: w('asgard'), scenes: s('asgard-court'), focus: '第七章将塞德描述为可知未来、造成伤害或不幸的技艺，并称弗蕾雅向阿萨神传授它；对奥丁施行此术的评价反映中世纪文本中的性别与社会观念，不能直接当作古代社会事实。' }),
  researchStory({ slug: 'thor-and-thjalfi-roskva', title: '索尔、夏尔菲与罗丝克瓦', titleEn: 'Thor, Þjálfi and Röskva', subtitle: '一根骨头带来的侍从关系', summary: '夏尔菲折断山羊腿骨后，索尔带走他与罗丝克瓦作为侍从。', volumeId: 'norse-thor', volumeTitle: '索尔、洛基与巨人', volumeOrder: 3, displayOrder: 11, source: storySource('proseEddaGylfaginning', 'ch. 44'), tradition: '《欺骗古鲁菲》索尔旅程段落', characters: c('thor', 'thjalfi', 'roskva'), worlds: w('midgard'), scenes: s('midgard-coast'), focus: '第四十四章中，索尔宰食两只山羊又使其复活，夏尔菲因打断一根腿骨导致山羊跛行；作为补偿，他和妹妹罗丝克瓦随索尔离去。' }),
  researchStory({ slug: 'thor-and-alviss', title: '索尔与阿尔维斯', titleEn: 'Thor and Alvíss', subtitle: '问答拖延到日出', summary: '索尔以连续提问拖住想娶女儿的矮人阿尔维斯，直到阳光使其化为石头。', volumeId: 'norse-thor', volumeTitle: '索尔、洛基与巨人', volumeOrder: 3, displayOrder: 12, source: storySource('alvissmal', 'sts. 1–35'), tradition: '《阿尔维斯之歌》传统', characters: c('thor', 'alviss'), worlds: w('asgard'), scenes: s('asgard-court'), focus: '《阿尔维斯之歌》以索尔和矮人的问答展开，不同族类如何称呼天空、地面与事物是其核心；日出终止谈话，阿尔维斯被石化。' }),
  researchStory({ slug: 'thor-and-harbard', title: '索尔与哈巴德', titleEn: 'Thor and Hárbarðr', subtitle: '渡口上的辱骂与争辩', summary: '索尔无法过河，与船夫哈巴德互相嘲讽并争论功绩。', volumeId: 'norse-thor', volumeTitle: '索尔、洛基与巨人', volumeOrder: 3, displayOrder: 13, source: storySource('harbardsljod', 'sts. 1–60'), tradition: '《哈巴德之歌》传统', characters: c('thor', 'odin'), worlds: w('midgard'), scenes: s('midgard-coast'), focus: '《哈巴德之歌》中，索尔与自称哈巴德的船夫隔河互相侮辱；船夫通常被理解为奥丁，但诗歌本身的表演性和身份游戏应保留为解释范围。' }),
  researchStory({ slug: 'vali-avenges-baldr', title: '瓦利为巴德尔复仇', titleEn: 'Váli Avenges Baldr', subtitle: '新生者迅速完成复仇', summary: '《女预言家之歌》说瓦利一夜成长并杀死霍德尔，为巴德尔复仇。', volumeId: 'norse-ragnarok', volumeTitle: '诸神黄昏与世界再生', volumeOrder: 5, displayOrder: 8, source: storySource('voluspa', 'sts. 32–33'), tradition: '《女预言家之歌》巴德尔段落', characters: c('vali', 'hodr'), worlds: w('asgard'), scenes: s('asgard-court'), focus: '第三十二至三十三节将瓦利写为奥丁之子，他一夜成长、从不洗手梳头，直至杀死巴德尔的杀手；本页不将诗歌简略叙述补写为完整司法程序。' }),
  researchStory({ slug: 'tyr-and-garmr', title: '提尔与加姆', titleEn: 'Týr and Garmr', subtitle: '诸神黄昏中的相互毁灭', summary: '《欺骗古鲁菲》让提尔与加姆在末日相战并同归于尽。', volumeId: 'norse-ragnarok', volumeTitle: '诸神黄昏与世界再生', volumeOrder: 5, displayOrder: 9, source: storySource('proseEddaGylfaginning', 'ch. 51'), tradition: '《欺骗古鲁菲》诸神黄昏段落', characters: c('tyr', 'garmr'), worlds: w('hel'), scenes: s('fimbulwinter-field'), focus: '第五十一章在诸神黄昏的战斗配对中让提尔与加姆相互杀死；它不要求将加姆与其他狼形存在自动视为同一角色。' }),
  researchStory({ slug: 'gudrun-svanhild-hamdir-sorli', title: '古德伦、斯万希尔德与哈姆迪尔兄弟', titleEn: 'Guðrún, Svanhildr, Hamðir and Sörli', subtitle: '母亲催促儿子复仇', summary: '古德伦在斯万希尔德死后催促哈姆迪尔与索尔利复仇，诗歌以失败和哀歌收束。', kind: 'heroic-legend', volumeId: 'norse-volsung', volumeTitle: '沃尔松格英雄传统', volumeOrder: 6, displayOrder: 9, source: storySource('hamdismal', 'sts. 1–30'), tradition: '《哈姆迪尔之歌》传统', characters: c('gudrun', 'svanhildr', 'hamdir', 'sorli'), worlds: w('midgard'), scenes: s('volsung-hall'), focus: '《哈姆迪尔之歌》从古德伦的催促、兄弟旅程和对仇人的袭击展开；它以伤痛、石击和家族复仇的失败感结束。' }),
  researchStory({ slug: 'svipdagr-and-mengloth', title: '斯维普达格与孟格洛德', titleEn: 'Svipdagr and Menglöð', subtitle: '母亲的咒语与门前问答', summary: '斯维普达格先求亡母格罗娅帮助，再在孟格洛德所在之地经历问答。', kind: 'heroic-legend', volumeId: 'norse-independent-eddic', volumeTitle: '独立埃达英雄传统', volumeOrder: 8, displayOrder: 3, source: storySource('svipdagsmal', 'Grógaldr sts. 1–14; Fjölsvinnsmál sts. 1–65; combined reading is provisional'), tradition: '《斯维普达格之歌》复合传统', characters: c('svipdagr', 'groa', 'mengloth'), worlds: w('midgard'), scenes: s('volsung-hall'), focus: '《格罗娅咒语》一至十四节与《菲奥尔斯温之歌》一至六十五节常被并置为斯维普达格传统，但两部分的组合仍须保留为暂定编辑阅读；本页保留母亲咒语、旅程与门前问答的最小来源范围。' }),
  researchStory({ slug: 'rig-and-social-orders', title: '里格与社会秩序', titleEn: 'Rígr and Social Orders', subtitle: '走访三户人家的陌生人', summary: '《里格之歌》以里格走访不同家庭并生下后代的方式解释社会等级。', kind: 'heroic-legend', volumeId: 'norse-independent-eddic', volumeTitle: '独立埃达英雄传统', volumeOrder: 8, displayOrder: 4, source: storySource('rigsthula', 'sts. 1–49'), tradition: '《里格之歌》传统', characters: c('rigr'), worlds: w('midgard'), scenes: s('volsung-hall'), focus: '《里格之歌》一至四十九节把社会身份安排成陌生人造访不同家庭后的谱系结果；它反映文本中的等级想象，不能被产品叙述认可为合理或自然的社会秩序。' }),
  researchStory({ slug: 'grottasongr', title: '格罗蒂之歌', titleEn: 'Grottasöngr', subtitle: '磨坊、奴役与战争', summary: '两位女巨人被迫推磨，磨出的财富最终转为敌军与毁灭。', kind: 'heroic-legend', volumeId: 'norse-independent-eddic', volumeTitle: '独立埃达英雄传统', volumeOrder: 8, displayOrder: 5, source: storySource('grottasongr', 'sts. 1–24'), tradition: '《格罗蒂之歌》传统', characters: [], worlds: w('midgard'), scenes: s('volsung-hall'), focus: '《格罗蒂之歌》一至二十四节以被奴役的女巨人推磨为中心，财富生产在诗中与强迫劳动、战争和统治者的毁灭相连。' }),
];

const addUnique = (current: readonly string[] | undefined, additions: readonly string[]): readonly string[] => [
  ...new Set([...(current ?? []), ...additions]),
];

/**
 * The Manifest is the research-layer dependency contract. Projecting it into
 * the Story shape keeps expectedDependencies ⊆ required*Ids while retaining
 * the explicit source manifest as the editorial authority.
 */
const manifestDependencyFields = [
  ['character', 'requiredCharacterIds', 'characterIds'],
  ['world', 'requiredWorldIds', 'worldIds'],
  ['scene', 'requiredSceneIds', 'sceneIds'],
  ['mythic-object', 'requiredObjectIds', 'objectIds'],
] as const;

export const norseStories: readonly MythStory[] = norseStoryDrafts.map((story) => {
  const manifestStories = norseStoryManifest.filter((item) => item.existingStoryId === story.id);
  if (!manifestStories.length) return story;

  const next = { ...story } as MythStory;
  for (const [entityType, requiredField, readerField] of manifestDependencyFields) {
    // A legacy Story can intentionally back multiple Manifest units (for
    // example a war and its truce). The Story closure must contain the union
    // of every mapped unit, not only the first matching Manifest row.
    const expectedIds = [...new Set(manifestStories.flatMap((item) => item.expectedDependencies[entityType]))];
    if (!expectedIds.length) continue;
    const requiredIds = addUnique(next[requiredField], expectedIds);
    next[requiredField] = requiredIds;
    next[readerField] = addUnique(next[readerField], expectedIds);
  }
  return next;
});
