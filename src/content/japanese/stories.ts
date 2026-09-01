import type { MythStory, MythStorySource } from '../../lib/content/types';

const date = '2026-09-02';
const mythologyId = 'myth-japanese';
const sources = {
  kojiki: { sourceId: 'source-japanese-kojiki-book-1', title: '《古事记》上卷', sourceType: 'primary-text' as const, tradition: '记纪神代主干', period: '8 世纪', language: 'ja-classical', locator: '按故事主题参见相关段落' },
  nihon: { sourceId: 'source-japanese-nihon-shoki-books-1-2', title: '《日本书纪》卷一至卷二', sourceType: 'primary-text' as const, tradition: '记纪神代主干与一书异传', period: '8 世纪', language: 'ja-classical', locator: '按故事主题参见相关段落' },
  nihonAlt: { sourceId: 'source-japanese-nihon-shoki-alternate', title: '《日本书纪》一书异传', sourceType: 'primary-text' as const, tradition: '日本书纪 alternate tradition', period: '8 世纪', language: 'ja-classical', locator: '按一书异传定位', note: '不把多个异传压缩为一个无范围的版本。' },
  taketori: { sourceId: 'source-japanese-taketori-monogatari', title: '《竹取物语》', sourceType: 'primary-text' as const, tradition: 'classical-tale', period: '10 世纪前后', language: 'ja-classical', locator: '辉夜姬归月相关段落' },
};

type StorySeed = {
  slug: string;
  title: string;
  titleEn: string;
  subtitle: string;
  summary: string;
  volumeId: string;
  volumeTitle: string;
  volumeOrder: number;
  displayOrder: number;
  characters: readonly string[];
  worlds: readonly string[];
  scenes: readonly string[];
  sourceKeys: readonly (keyof typeof sources)[];
  kind?: MythStory['kind'];
  tradition?: string;
  heroAssetId?: string;
  note?: string;
};

const p0World = 'world-ashihara-no-nakatsukuni';
const p0Sky = 'world-takamagahara';
const p0Yomi = 'world-yomi';
const p0Ne = 'world-ne-no-katasukuni';
const p0Sea = 'world-watatsumi-realm';

const storySeeds: readonly StorySeed[] = [
  { slug: 'heaven-and-kotoamatsukami', title: '天地初成与别天津神', titleEn: 'The First Gods and the Birth of Heaven', subtitle: '神世从无形的中轴开始', summary: '天地初分后，别天津神与神世七代构成日本神代的最初秩序。', volumeId: 'japanese-origins', volumeTitle: '天地与神世', volumeOrder: 1, displayOrder: 1, characters: ['character-ameno-minakanushi', 'character-takami-musubi', 'character-kami-musubi'], worlds: [p0Sky], scenes: ['scene-takamagahara-court'], sourceKeys: ['kojiki', 'nihon'] },
  { slug: 'kami-seven-generations', title: '神世七代', titleEn: 'The Seven Generations of the Gods', subtitle: '从抽象神格走向可生国土的神', summary: '神世七代为伊邪那岐与伊邪那美登场、结成和国生提供神谱前史。', volumeId: 'japanese-origins', volumeTitle: '天地与神世', volumeOrder: 1, displayOrder: 2, characters: ['character-izanagi', 'character-izanami'], worlds: [p0Sky], scenes: ['scene-ama-no-ukihashi'], sourceKeys: ['kojiki', 'nihon'] },
  { slug: 'izanagi-izanami', title: '伊邪那岐与伊邪那美', titleEn: 'Izanagi and Izanami', subtitle: '造岛、死亡与黄泉的边界', summary: '两位神创造岛屿与众神，却因火神之诞生走向死亡与黄泉，从此生死世界被划开。', volumeId: 'japanese-origins', volumeTitle: '天地与神世', volumeOrder: 1, displayOrder: 3, characters: ['character-izanagi', 'character-izanami'], worlds: [p0Sky, p0World, p0Yomi], scenes: ['scene-ama-no-ukihashi', 'scene-onogoro', 'scene-yomotsu-hirasaka'], sourceKeys: ['kojiki', 'nihon'], heroAssetId: 'story-illustration-takamagahara', note: '保留公开 Story ID / slug；正文将造岛、神生与黄泉边界串成入口。' },
  { slug: 'kuni-umi', title: '国生与大八洲', titleEn: 'The Birth of the Islands', subtitle: '海面上的盐滴凝成国土', summary: '伊邪那岐与伊邪那美由淤能碁吕岛开始国生，文本中的大八洲成为地上国土叙事的骨架。', volumeId: 'japanese-origins', volumeTitle: '天地与神世', volumeOrder: 1, displayOrder: 4, characters: ['character-izanagi', 'character-izanami'], worlds: [p0World], scenes: ['scene-onogoro'], sourceKeys: ['kojiki', 'nihon'] },
  { slug: 'kami-umi-and-kagutsuchi', title: '神生、迦具土与伊邪那美之死', titleEn: 'Birth of Gods and the Death of Izanami', subtitle: '创造也带来灼热的代价', summary: '众神从国土中诞生，火之迦具土的出生却使伊邪那美走向死亡。', volumeId: 'japanese-origins', volumeTitle: '天地与神世', volumeOrder: 1, displayOrder: 5, characters: ['character-izanagi', 'character-izanami', 'character-kagutsuchi'], worlds: [p0World, p0Yomi], scenes: ['scene-fire-birth-house'], sourceKeys: ['kojiki', 'nihon'] },
  { slug: 'yomi-and-yomotsu-hirasaka', title: '黄泉之国与黄泉比良坂', titleEn: 'Yomi and Yomotsu Hirasaka', subtitle: '死亡不能被带回现世', summary: '伊邪那岐进入黄泉寻找伊邪那美，最终在黄泉比良坂确认生死边界的不可逆。', volumeId: 'japanese-yomi', volumeTitle: '黄泉与禊祓', volumeOrder: 2, displayOrder: 1, characters: ['character-izanagi', 'character-izanami'], worlds: [p0Yomi, p0World], scenes: ['scene-yomotsu-hirasaka'], sourceKeys: ['kojiki', 'nihon'], heroAssetId: 'story-illustration-takamagahara-moon' },
  { slug: 'misogi-and-three-noble-children', title: '伊邪那岐禊祓与三贵子诞生', titleEn: 'Misogi and the Three Noble Children', subtitle: '水中洗去黄泉，太阳、月与风暴出现', summary: '伊邪那岐从黄泉返回后禊祓，天照、月读与须佐之男从洁净仪式中出现。', volumeId: 'japanese-yomi', volumeTitle: '黄泉与禊祓', volumeOrder: 2, displayOrder: 2, characters: ['character-izanagi', 'character-amaterasu', 'character-tsukuyomi', 'character-susanoo'], worlds: [p0World], scenes: ['scene-misogi-shore'], sourceKeys: ['kojiki', 'nihon'] },
  { slug: 'susanoo-exile', title: '须佐之男哭泣与放逐', titleEn: 'Susanoo’s Lament and Exile', subtitle: '风暴神离开高天原', summary: '须佐之男的哭泣与离去扰动三界秩序，也为他进入出云叙事建立动因。', volumeId: 'japanese-takamagahara', volumeTitle: '高天原与天岩户', volumeOrder: 3, displayOrder: 1, characters: ['character-susanoo', 'character-amaterasu'], worlds: [p0Sky, p0World], scenes: ['scene-takamagahara-court'], sourceKeys: ['kojiki', 'nihon'] },
  { slug: 'amaterasu-susanoo-oath', title: '天照与须佐之男誓约', titleEn: 'Amaterasu and Susanoo’s Oath', subtitle: '誓约既是确认，也是冲突的前奏', summary: '天照与须佐之男以互取物件、生成神灵的誓约确认彼此身份，但不同文本的细节不能被压成单一版本。', volumeId: 'japanese-takamagahara', volumeTitle: '高天原与天岩户', volumeOrder: 3, displayOrder: 2, characters: ['character-amaterasu', 'character-susanoo'], worlds: [p0Sky], scenes: ['scene-takamagahara-court'], sourceKeys: ['kojiki', 'nihon', 'nihonAlt'] },
  { slug: 'susanoo-takamagahara-disorder', title: '须佐之男大闹高天原', titleEn: 'Susanoo’s Violence in Takamagahara', subtitle: '秩序在反复越界中失去平衡', summary: '须佐之男在高天原的行为越过共同体边界，最终导致天照退入岩户。', volumeId: 'japanese-takamagahara', volumeTitle: '高天原与天岩户', volumeOrder: 3, displayOrder: 3, characters: ['character-amaterasu', 'character-susanoo'], worlds: [p0Sky], scenes: ['scene-takamagahara-court', 'scene-ama-no-iwato'], sourceKeys: ['kojiki', 'nihon'] },
  { slug: 'amaterasu-cave', title: '天照大神隐入天岩户', titleEn: 'Amaterasu and the Heavenly Rock Cave', subtitle: '世界失去光明之后', summary: '天照退入天岩户，天地陷入黑暗；众神以仪式、镜与欢笑把太阳重新引回世界。', volumeId: 'japanese-takamagahara', volumeTitle: '高天原与天岩户', volumeOrder: 3, displayOrder: 4, characters: ['character-amaterasu', 'character-susanoo', 'character-ame-no-uzume', 'character-omoikane', 'character-ame-no-tajikarao', 'character-ame-no-koyane', 'character-futodama'], worlds: [p0Sky], scenes: ['scene-ama-no-iwato'], sourceKeys: ['kojiki', 'nihon', 'nihonAlt'], heroAssetId: 'story-illustration-takamagahara-moon' },
  { slug: 'susanoo-izumo', title: '须佐之男降临出云', titleEn: 'Susanoo Arrives in Izumo', subtitle: '被放逐的神进入地上国土', summary: '须佐之男离开高天原后抵达出云，风暴神的故事转入八岐大蛇与家族保护循环。', volumeId: 'japanese-izumo', volumeTitle: '出云与大国主', volumeOrder: 4, displayOrder: 1, characters: ['character-susanoo', 'character-ashina-zuchi', 'character-te-na-zuchi', 'character-kushinadahime'], worlds: [p0World], scenes: ['scene-hii-river'], sourceKeys: ['kojiki', 'nihon'] },
  { slug: 'yamata-no-orochi', title: '八岐大蛇与草薙剑', titleEn: 'Yamata no Orochi and the Sword', subtitle: '八首八尾的洪水怪物', summary: '须佐之男以酒与策略击败八岐大蛇，并从蛇尾取得后来成为三神器之一的剑。', volumeId: 'japanese-izumo', volumeTitle: '出云与大国主', volumeOrder: 4, displayOrder: 2, characters: ['character-susanoo', 'character-yamata-no-orochi', 'character-kushinadahime', 'character-ashina-zuchi', 'character-te-na-zuchi'], worlds: [p0World], scenes: ['scene-hii-river'], sourceKeys: ['kojiki', 'nihon'], heroAssetId: 'story-illustration-takamagahara' },
  { slug: 'inaba-white-rabbit', title: '因幡白兔', titleEn: 'The White Hare of Inaba', subtitle: '大国主在成为国土之神前', summary: '因幡白兔故事让大国主以尚未完成神格转变的年轻形态进入出云主线。', volumeId: 'japanese-izumo', volumeTitle: '出云与大国主', volumeOrder: 4, displayOrder: 3, characters: ['character-okuninushi'], worlds: [p0World], scenes: ['scene-inaba-coast'], sourceKeys: ['kojiki'] },
  { slug: 'okuninushi-and-yaso-gami', title: '大国主与八十神', titleEn: 'Ōkuninushi and the Eighty Gods', subtitle: '兄弟冲突与反复重生', summary: '大国主在八十神的竞争与迫害中经历死亡和复生，身份从受害者转向出云主神。', volumeId: 'japanese-izumo', volumeTitle: '出云与大国主', volumeOrder: 4, displayOrder: 4, characters: ['character-okuninushi'], worlds: [p0World], scenes: ['scene-inaba-coast'], sourceKeys: ['kojiki'] },
  { slug: 'okuninushi-ne-trials', title: '大国主进入根之坚州国', titleEn: 'Ōkuninushi in the Land of Roots', subtitle: '试炼、火与须势理毗卖', summary: '大国主进入根之坚州国，在须佐之男设置的试炼中与须势理毗卖共同逃离。', volumeId: 'japanese-izumo', volumeTitle: '出云与大国主', volumeOrder: 4, displayOrder: 5, characters: ['character-okuninushi', 'character-suseribime', 'character-susanoo'], worlds: [p0Ne], scenes: ['scene-ne-trial-hall'], sourceKeys: ['kojiki'] },
  { slug: 'okuninushi-and-sukunahikona', title: '少彦名与大国主共同经营国土', titleEn: 'Ōkuninushi and Sukunahikona', subtitle: '国土需要尺度不同的协作者', summary: '少彦名从海上来访，与大国主共同经营国土、医药和秩序。', volumeId: 'japanese-izumo', volumeTitle: '出云与大国主', volumeOrder: 4, displayOrder: 6, characters: ['character-okuninushi', 'character-sukunahikona'], worlds: [p0World], scenes: ['scene-inaba-coast'], sourceKeys: ['kojiki', 'nihon'] },
  { slug: 'omononushi-completes-land', title: '少彦名离去与大物主显现', titleEn: 'Ōmononushi and the Completion of the Land', subtitle: '国土秩序在神秘显现中完成', summary: '少彦名离去后，大物主显现并与大国主的国土经营形成互补的完成段落。', volumeId: 'japanese-izumo', volumeTitle: '出云与大国主', volumeOrder: 4, displayOrder: 7, characters: ['character-okuninushi', 'character-sukunahikona', 'character-omononushi'], worlds: [p0World], scenes: ['scene-inaba-coast'], sourceKeys: ['kojiki', 'nihon'] },
  { slug: 'kuniyuzuri-mission', title: '高天原决定平定葦原中国', titleEn: 'The Heavenly Mission to Ashihara', subtitle: '天上秩序向地上派出使者', summary: '高天原决定处理葦原中国的归属，天菩比神等使者线开启国让闭包。', volumeId: 'japanese-kuniyuzuri', volumeTitle: '平定与国让', volumeOrder: 5, displayOrder: 1, characters: ['character-takami-musubi', 'character-ame-no-hohi', 'character-okuninushi'], worlds: [p0Sky, p0World], scenes: ['scene-takamagahara-court', 'scene-inasa-beach'], sourceKeys: ['kojiki', 'nihon'] },
  { slug: 'ame-no-wakahiko', title: '天若日子使命失败与返矢', titleEn: 'Ame-no-Wakahiko and the Returning Arrow', subtitle: '使者被地上关系改写', summary: '天若日子未完成使命，返矢将使者线推进到建御雷降临。', volumeId: 'japanese-kuniyuzuri', volumeTitle: '平定与国让', volumeOrder: 5, displayOrder: 2, characters: ['character-ame-no-wakahiko', 'character-ame-no-hohi', 'character-okuninushi'], worlds: [p0World], scenes: ['scene-inasa-beach'], sourceKeys: ['kojiki', 'nihon'] },
  { slug: 'takemikazuchi-inasa', title: '建御雷降临稻佐之滨', titleEn: 'Takemikazuchi at Inasa Beach', subtitle: '剑尖抵达国让谈判现场', summary: '建御雷在稻佐之滨代表高天原展开谈判；《日本书纪》关于经津主等参与者的差异保持 source scope。', volumeId: 'japanese-kuniyuzuri', volumeTitle: '平定与国让', volumeOrder: 5, displayOrder: 3, characters: ['character-takemikazuchi', 'character-futsunushi', 'character-okuninushi'], worlds: [p0Sky, p0World], scenes: ['scene-inasa-beach'], sourceKeys: ['kojiki', 'nihon', 'nihonAlt'] },
  { slug: 'kuni-yuzuri', title: '事代主、建御名方与大国主国让', titleEn: 'Kotoshironushi, Takeminakata and Kuniyuzuri', subtitle: '一国如何交给另一套秩序', summary: '事代主的选择、建御名方的对抗与大国主的决定共同完成国让。', volumeId: 'japanese-kuniyuzuri', volumeTitle: '平定与国让', volumeOrder: 5, displayOrder: 4, characters: ['character-kotoshironushi', 'character-takeminakata', 'character-okuninushi', 'character-takemikazuchi'], worlds: [p0World, p0Sky], scenes: ['scene-inasa-beach'], sourceKeys: ['kojiki', 'nihon', 'nihonAlt'] },
  { slug: 'oshihomimi-and-ninigi', title: '天忍穗耳与邇邇艺', titleEn: 'Oshihomimi and Ninigi', subtitle: '天孙人选与命令', summary: '天忍穗耳与邇邇艺构成从高天原命令到地上降临的系谱桥梁。', volumeId: 'japanese-tenson', volumeTitle: '天孙降临', volumeOrder: 6, displayOrder: 1, characters: ['character-ame-no-oshihomimi', 'character-ninigi', 'character-amaterasu', 'character-takami-musubi'], worlds: [p0Sky, p0World], scenes: ['scene-takamagahara-court'], sourceKeys: ['kojiki', 'nihon'] },
  { slug: 'tenson-korin', title: '邇邇艺降临高千穗', titleEn: 'Ninigi’s Descent to Takachiho', subtitle: '沿云路进入地上山岳', summary: '邇邇艺携带天孙系谱的象征降临高千穗，猿田彦在边界处引路。', volumeId: 'japanese-tenson', volumeTitle: '天孙降临', volumeOrder: 6, displayOrder: 2, characters: ['character-ninigi', 'character-sarutahiko', 'character-ame-no-uzume'], worlds: [p0Sky, p0World], scenes: ['scene-takachiho-peak'], sourceKeys: ['kojiki', 'nihon'] },
  { slug: 'konohanasakuya-and-iwanagahime', title: '木花咲耶姬与石长比卖', titleEn: 'Konohanasakuya-hime and Iwanagahime', subtitle: '短暂花与长久岩石', summary: '邇邇艺面对木花咲耶姬与石长比卖的婚姻选择，故事把繁盛、长久与天孙命运连接起来。', volumeId: 'japanese-tenson', volumeTitle: '天孙降临', volumeOrder: 6, displayOrder: 3, characters: ['character-ninigi', 'character-konohanasakuya-hime', 'character-iwanagahime'], worlds: [p0World], scenes: ['scene-takachiho-peak'], sourceKeys: ['kojiki', 'nihon'] },
  { slug: 'konohanasakuya-fire-birth', title: '木花咲耶姬火中生产', titleEn: 'Konohanasakuya-hime’s Fire Birth', subtitle: '以火证明没有背叛', summary: '木花咲耶姬进入火中的屋舍生产，火既是危险也是确认血统与生命的边界。', volumeId: 'japanese-tenson', volumeTitle: '天孙降临', volumeOrder: 6, displayOrder: 4, characters: ['character-konohanasakuya-hime', 'character-ninigi'], worlds: [p0World], scenes: ['scene-fire-birth-house'], sourceKeys: ['kojiki', 'nihon'] },
  { slug: 'hoderi-and-hoori', title: '火照与火远理：海幸、山幸与失钩', titleEn: 'Hoderi and Hoori', subtitle: '交换工具也交换命运', summary: '火照与火远理交换渔猎工具，失钩事件把兄弟关系推向海神之国。', volumeId: 'japanese-sea-cycle', volumeTitle: '海幸山幸', volumeOrder: 7, displayOrder: 1, characters: ['character-hoderi', 'character-hoori'], worlds: [p0World, p0Sea], scenes: ['scene-watatsumi-palace'], sourceKeys: ['kojiki', 'nihon'] },
  { slug: 'hoori-watatsumi-palace', title: '火远理进入海神之宫', titleEn: 'Hoori in the Palace of Watatsumi', subtitle: '失物沿潮汐进入另一重世界', summary: '火远理追寻失钩进入海神之宫，与丰玉姬相遇并获得潮盈珠、潮干珠。', volumeId: 'japanese-sea-cycle', volumeTitle: '海幸山幸', volumeOrder: 7, displayOrder: 2, characters: ['character-hoori', 'character-toyotama-hime', 'character-watatsumi'], worlds: [p0Sea], scenes: ['scene-watatsumi-palace'], sourceKeys: ['kojiki', 'nihon'], heroAssetId: 'story-illustration-takamagahara' },
  { slug: 'toyotama-birth-and-boundary', title: '丰玉姬生产与海陆边界', titleEn: 'Toyotama-hime’s Birth and the Boundary of Sea and Land', subtitle: '不可直视的生产与离返', summary: '丰玉姬以原形生产，火远理的偷看导致海陆边界被重新划开，神代谱系由此继续。', volumeId: 'japanese-sea-cycle', volumeTitle: '海幸山幸', volumeOrder: 7, displayOrder: 3, characters: ['character-hoori', 'character-toyotama-hime', 'character-watatsumi'], worlds: [p0Sea, p0World], scenes: ['scene-watatsumi-palace'], sourceKeys: ['kojiki', 'nihon'] },
  { slug: 'kaguya-return', title: '辉夜姬归月', titleEn: 'Kaguya-hime Returns to the Moon', subtitle: '竹中降临的人，终究不属于人间', summary: '《竹取物语》把月界、异乡人与人间情感连接成日本最著名的古典幻想故事之一。', volumeId: 'japanese-classical-tales', volumeTitle: '传说与古典幻想', volumeOrder: 8, displayOrder: 1, characters: ['character-kaguya'], worlds: [], scenes: ['scene-bamboo-moon'], sourceKeys: ['taketori'], kind: 'literary-fantasy', tradition: '平安时代《竹取物语》文学传统', heroAssetId: 'story-illustration-kaguya', note: '保留公开 Story ID / slug；辉夜姬不属于高天原神系。' },
];

const story = (seed: StorySeed): MythStory => {
  const storyId = `story-${seed.slug}`;
  const storySources: MythStorySource[] = seed.sourceKeys.map((key) => sources[key]);
  const sourceNames = storySources.map((item) => item.title).join('、');
  return {
    id: storyId,
    slug: seed.slug,
    mythologyId,
    title: seed.title,
    titleEn: seed.titleEn,
    subtitle: seed.subtitle,
    summary: seed.summary,
    volumeId: seed.volumeId,
    volumeTitle: seed.volumeTitle,
    volumeOrder: seed.volumeOrder,
    displayOrder: seed.displayOrder,
    kind: seed.kind ?? 'myth',
    tradition: seed.tradition ?? '《古事记》《日本书纪》神代传统',
    readingMinutes: 4,
    sources: storySources,
    sourceNotes: [
      `本篇以${sourceNames}为来源基础；《日本书纪》正文与一书异传的差异按来源范围保留。`,
      seed.note ?? '正文为 MythCanvas 原创转述，不把后世视觉重构写成古代文本事实。',
    ],
    requiredCharacterIds: seed.characters,
    requiredWorldIds: seed.worlds,
    requiredSceneIds: seed.scenes,
    requiredSourceIds: storySources.map((item) => item.sourceId!),
    characterIds: seed.characters,
    worldIds: seed.worlds,
    sceneIds: seed.scenes,
    heroAssetId: seed.heroAssetId,
    publishStatus: 'published',
    publishedAt: date,
    updatedAt: date,
    blocks: [
      { type: 'paragraph', text: seed.summary },
      { type: 'paragraph', text: `这段叙事连接${seed.characters.length}个核心人物与${seed.scenes.length}个可复用场景；阅读时应先看故事的来源范围，再将人物、神域和场景作为独立实体继续探索。` },
    ],
  };
};

export const japaneseStories: readonly MythStory[] = storySeeds.map(story);
export const japaneseSourceRegistry = sources;
