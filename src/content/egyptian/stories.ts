import type { ContentClaim, MythStory, MythStorySource, SourceRef } from '../../lib/content/types';

const mythologyId = 'myth-egyptian';
const editorialDate = '2026-09-02';

const source = (sourceId: string, title: string, locator: string, tradition: string, period: string, note: string): MythStorySource => ({
  sourceId,
  title,
  sourceType: 'primary-text',
  tradition,
  period,
  locator,
  note,
});

const sources = {
  pyramid: source('egypt-pyramid-texts', '《金字塔文》', '相关咒文与奥西里斯段落', '王室葬祭与早期神学传统', '古王国时期', '早期王室葬祭文本；不与后期完整叙事重建混为一谈。'),
  coffin: source('egypt-coffin-texts', '《棺材文》', '相关 Spell 段落', '死者转化与神祇身份传统', '中王国时期', '多组棺材文本并非一部线性神话书，本篇保留其来源范围。'),
  amduat: source('egypt-amduat', '《阿姆杜阿特书》', '十二时段结构与夜航场景', '太阳神与冥界传统', '新王国时期', '以墓室图像和文本描绘太阳神夜间穿越杜阿特。'),
  gates: source('egypt-book-of-gates', '《大门之书》', '门域与夜间旅程段落', '冥界书传统', '新王国时期', '与其他冥界书并列使用，不拼成一张无来源的统一地图。'),
  dead: source('egypt-book-of-dead', '《亡灵书》', '第 30B、125 章', '葬祭与死后审判传统', '新王国至后期', '不同抄本的咒文与图像存在差异，本包使用可定位的章节范围。'),
  heavenlyCow: source('egypt-heavenly-cow', '《天牛之书》', '人类毁灭与太阳眼传统', '太阳神学与王权传统', '新王国时期', '用于太阳秩序与 Sekhmet 传统的来源范围。'),
  shabaka: source('egypt-shabaka-stone', '沙巴卡石碑与孟菲斯神学', '心、言与创造段落', '孟菲斯神学传统', '晚期抄本保存较早神学传统', '以孟菲斯神学的来源范围表达 Ptah 的创造权能。'),
  horusSeth: source('egypt-horus-seth', '《荷鲁斯与赛特的争斗》', 'Papyrus Chester Beatty I', '王位冲突与继承传统', '新王国时期抄本', '用于王位冲突的一个重要叙事见证，不代表所有地方版本。'),
} satisfies Record<string, MythStorySource>;

const imageFor = (slug: string): string => slug.includes('weighing') || slug.includes('anubis') ? 'story-illustration-anubis' : slug.includes('solar') || slug.includes('apep') || slug.includes('ra-') ? 'story-illustration-duat-sun-barge' : 'story-illustration-duat';

type StoryInput = {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  subtitle: string;
  summary: string;
  volumeId: string;
  volumeTitle: string;
  volumeOrder: number;
  displayOrder: number;
  tradition: string;
  source: MythStorySource;
  characters: string[];
  worlds: string[];
  scenes: string[];
  body: string[];
  note: string;
  kind?: MythStory['kind'];
};

const story = (input: StoryInput): MythStory => {
  const sourceRef: SourceRef = {
    sourceId: input.source.sourceId,
    type: 'primary-text',
    title: input.source.title,
    locator: input.source.locator,
    period: input.source.period,
    note: input.source.note,
  };
  const claim: ContentClaim = {
    id: 'claim-' + input.slug,
    subjectType: 'story',
    subjectId: input.id,
    claimType: 'narrative',
    summary: input.summary,
    status: 'supported',
    traditionScope: input.tradition,
    sourceRefs: [sourceRef],
  };
  return {
    id: input.id,
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
    kind: input.kind ?? 'religious-tradition',
    tradition: input.tradition,
    readingMinutes: 4,
    sources: [input.source],
    sourceNotes: [input.note, '本篇按已列出的文本与时期范围组织叙事；不同神学中心或后期见证不被合并成唯一正史。'],
    requiredCharacterIds: input.characters,
    requiredWorldIds: input.worlds,
    requiredSceneIds: input.scenes,
    requiredSourceIds: [input.source.sourceId ?? input.source.title],
    claims: [claim],
    characterIds: input.characters,
    worldIds: input.worlds,
    sceneIds: input.scenes,
    heroAssetId: imageFor(input.slug),
    publishStatus: 'published',
    publishedAt: editorialDate,
    updatedAt: editorialDate,
    blocks: [
      { type: 'paragraph', text: input.body[0] ?? input.summary },
      { type: 'image', assetId: imageFor(input.slug), caption: input.title + '的视觉重点是来源范围、身份关系与空间层次，而不是符号堆叠。', layout: 'wide' },
      ...input.body.slice(1).map((text) => ({ type: 'paragraph' as const, text })),
    ],
  };
};

const c = (slug: string) => 'character-' + slug;
const w = (slug: string) => 'world-' + slug;
const s = (slug: string) => 'scene-' + slug;

export const egyptianStories: readonly MythStory[] = [
  story({ id: 'story-egyptian-nun-first-mound', slug: 'nun-first-mound', title: '努恩与第一次陆地', titleEn: 'Nun and the First Mound', subtitle: '从尚未分化的水面显现秩序', summary: '原初之水、第一次陆地与创世前状态构成古埃及多个创世框架的共同入口，但不应被写成一部统一的创世圣典。', volumeId: 'egypt-creation-cosmology', volumeTitle: '创世与宇宙结构', volumeOrder: 1, displayOrder: 1, tradition: '创世前状态与原初水传统', source: sources.coffin, characters: [c('nun')], worlds: [], scenes: [s('primeval-waters'), s('first-mound')], body: ['在许多古埃及创世想象中，世界开始于尚未分化的水与黑暗。努恩不是一个后来意义上坐在王座上的“水神角色”，更接近创世发生之前的原初状态。', '当第一丘从水面显现，方向、光线与可以承载生命的地面才获得可能。不同神学中心对最初显现者和创世方式有不同表达，MythCanvas 将这些差异保留在来源层。'], note: '本单元只建立创世入口与空间概念，不把努恩升级为一个需要完整神谱的独立世界。'}),
  story({ id: 'story-atum-creation', slug: 'atum-shu-tefnut', title: '阿图姆与舒、泰芙努特的出现', titleEn: 'Atum, Shu, and Tefnut', subtitle: '赫利奥波利斯传统中的世代开始', summary: '阿图姆在赫利奥波利斯创世框架中成为自生神，舒与泰芙努特由此进入有序神谱。', volumeId: 'egypt-creation-cosmology', volumeTitle: '创世与宇宙结构', volumeOrder: 1, displayOrder: 2, tradition: '赫利奥波利斯创世传统', source: sources.pyramid, characters: [c('atum'), c('shu'), c('tefnut')], worlds: [w('celestial-sky')], scenes: [s('heliopolitan-creation')], body: ['阿图姆的创世不是现代意义上的一次工程施工，而是从独自存在到世代关系逐渐展开的神学表达。舒与泰芙努特分别关联空气与湿气，使世界开始获得可区分的条件。', '这些神名后来会进入更长的神谱，但神谱并不等于一条所有时期都一致的家族年表。页面因此把赫利奥波利斯作为明确传统范围，而不是把所有创世说法压成单一版本。'], note: '故事中的“出现”是对赫利奥波利斯材料的编辑性叙述，关系与来源仍以具体传统为准。'}),
  story({ id: 'story-geb-nut-separation', slug: 'geb-nut-separation', title: '盖布与努特的分离', titleEn: 'The Separation of Geb and Nut', subtitle: '天空与大地之间留下可供世界运行的空间', summary: '舒将盖布与努特分开，天空、大地与空气形成可以容纳太阳循环的宇宙结构。', volumeId: 'egypt-creation-cosmology', volumeTitle: '创世与宇宙结构', volumeOrder: 1, displayOrder: 3, tradition: '赫利奥波利斯 Ennead 传统', source: sources.pyramid, characters: [c('shu'), c('geb'), c('nut')], worlds: [w('celestial-sky')], scenes: [s('nut-sky-arch')], body: ['盖布作为大地，努特作为天空，二者原本紧密相连。舒将他们分开，这个动作不是家庭戏剧的装饰，而是让光、风、星辰与太阳拥有运行空间的宇宙结构事件。', '努特的身体后来成为星辰与太阳循环的视觉穹顶，盖布则把土地、谷物和生者脚下的世界固定下来。不同文本对神谱细节的侧重点不同，本篇只保留这一结构性核心。'], note: '“分离”是来源中的宇宙结构表达，不应被渲染成一次现代物理爆炸。'}),
  story({ id: 'story-heliopolitan-ennead', slug: 'heliopolitan-ennead-order', title: '赫利奥波利斯神谱的世代秩序', titleEn: 'The Heliopolitan Ennead', subtitle: '神谱不是一条脱离时期的百科家谱', summary: '从阿图姆到奥西里斯一系，赫利奥波利斯神谱为创世、天空、大地与王权提供了关系框架。', volumeId: 'egypt-creation-cosmology', volumeTitle: '创世与宇宙结构', volumeOrder: 1, displayOrder: 4, tradition: '赫利奥波利斯 Ennead 传统', source: sources.pyramid, characters: [c('atum'), c('shu'), c('tefnut'), c('geb'), c('nut'), c('osiris'), c('isis'), c('set'), c('nephthys')], worlds: [w('celestial-sky')], scenes: [s('heliopolitan-creation')], body: ['赫利奥波利斯神谱把创世表达为一组逐层展开的关系：自生神、空气与湿气、天空与大地，再到奥西里斯、伊西斯、赛特和奈芙蒂斯。它为后来的王权与死亡叙事提供了可连接的亲缘框架。', '然而，“九柱神”是一个神学中心和文本传统中的组织方式，不代表古埃及每一时期、每一地方神庙都只承认这一套排序。故事页需要同时展示关系与范围。'], note: '本单元是神谱 / 宇宙秩序阅读单元，不把重建后的完整神谱冒充一篇单线原典。'}),
  story({ id: 'story-ptah-heart-and-word', slug: 'ptah-heart-and-word', title: '卜塔以心与言创造', titleEn: 'Ptah Creates Through Heart and Word', subtitle: '思想、命名与使世界成形的力量', summary: '孟菲斯神学以心与言说明卜塔如何使神意、名称与秩序进入世界。', volumeId: 'egypt-creation-cosmology', volumeTitle: '创世与宇宙结构', volumeOrder: 1, displayOrder: 5, tradition: '孟菲斯神学与沙巴卡石碑传统', source: sources.shabaka, characters: [c('ptah')], worlds: [], scenes: [s('memphite-creation')], body: ['在孟菲斯神学的表达中，创造不仅是从水里长出一座丘或由太阳神生出后代，也可以通过心中构思、以言语命名而使秩序成形。卜塔因此与工匠、神意和创造性言语相连。', '这一传统与赫利奥波利斯创世框架并存。它不是对前者的“升级版本”，而是另一种神学中心对世界如何获得形式的说明。'], note: '沙巴卡石碑是晚期保存的孟菲斯神学见证，不能不加说明地倒推为所有时期唯一的创世观。'}),
  story({ id: 'story-ogdoad-primeval-state', slug: 'ogdoad-primeval-state', title: 'Ogdoad 与创世前状态', titleEn: 'The Ogdoad and the Primeval State', subtitle: '八位原初力量不等于一套现代化角色队伍', summary: '赫尔莫波利斯传统以 Ogdoad 表达创世前的黑暗、无限、水与隐匿等原初条件。', volumeId: 'egypt-creation-cosmology', volumeTitle: '创世与宇宙结构', volumeOrder: 1, displayOrder: 6, tradition: '赫尔莫波利斯 Ogdoad 传统', source: sources.coffin, characters: [c('nun')], worlds: [], scenes: [s('primeval-waters')], body: ['赫尔莫波利斯的 Ogdoad 不是一支可以直接套用现代超级英雄叙事的八人小队。它们首先表达创世前状态的成对力量：黑暗、无限、原初水与隐匿等。', '材料、时期和图像会改变这些力量的呈现方式。MythCanvas 将这一单元作为原初宇宙的概念入口，并把具体神名与视觉形式留给后续有独立来源价值的实体。'], note: '本篇保留 Ogdoad 作为神学框架，避免为了补齐名单机械创建八个新 Character。'}),
  story({ id: 'story-nut-solar-cycle', slug: 'nut-sky-solar-cycle', title: '努特、天空与太阳的每日循环', titleEn: 'Nut, Sky, and the Daily Solar Cycle', subtitle: '天空是太阳运行的身体与边界', summary: '努特的星辰穹顶与太阳出入地平线的图景，把天空、太阳和更新连接起来。', volumeId: 'egypt-creation-cosmology', volumeTitle: '创世与宇宙结构', volumeOrder: 1, displayOrder: 7, tradition: '天空女神与太阳循环传统', source: sources.coffin, characters: [c('nut'), c('ra')], worlds: [w('celestial-sky')], scenes: [s('nut-sky-arch'), s('akhet-horizon')], body: ['在古埃及宇宙图景中，天空并非一张空白背景。努特的身体承载星辰，太阳从她所形成的天空边界中运行，日出与日落因此带有神圣的进出与更新意味。', '这一图景为白昼太阳神舟、夜间杜阿特和黎明再生提供了共同空间，但不能据此把所有太阳神名和后期合流身份都合并。'], note: '本单元连接宇宙结构与太阳循环，具体夜航细节留给冥界文献单元。'}),
  story({ id: 'story-ra-solar-voyage', slug: 'ra-solar-voyage', title: '拉神的太阳神舟', titleEn: 'Ra and the Solar Barque', subtitle: '每天穿越天空，也每夜穿越冥界', summary: '太阳的运行被想象为一场永不停息的航行：白昼横渡天空，夜晚进入杜阿特并对抗混沌。', volumeId: 'egypt-solar-maat', volumeTitle: '太阳与玛阿特', volumeOrder: 2, displayOrder: 1, tradition: '古埃及太阳神传统与冥界文献', source: sources.amduat, characters: [c('ra')], worlds: [w('celestial-sky'), w('duat')], scenes: [s('solar-barge-day'), s('solar-barge-night')], body: ['太阳每天升起，并不意味着秩序理所当然会继续。古埃及神话把日出理解为一次又一次成功完成的宇宙循环：拉神乘太阳神舟横越天空，而在太阳落山后，神舟进入杜阿特。', '夜间航行不是休息，而是一场危险的再生过程。太阳神需要穿越冥界不同区域，并面对象征混沌与毁灭的阿佩普。只有当这一夜的秩序再次获胜，太阳才会在东方重新出现。'], note: '《阿姆杜阿特书》等新王国时期冥界文献细致描绘太阳神夜间穿越冥界的过程；拉与阿蒙-拉等身份的历史变化另行处理。'}),
  story({ id: 'story-ra-enters-duat', slug: 'ra-enters-duat', title: '拉神进入杜阿特', titleEn: 'Ra Enters the Duat', subtitle: '日落是夜间更新的入口', summary: '拉神进入杜阿特后，太阳运行从天空层转入门域、河流与夜间时段的复杂空间。', volumeId: 'egypt-solar-maat', volumeTitle: '太阳与玛阿特', volumeOrder: 2, displayOrder: 2, tradition: '新王国冥界书传统', source: sources.gates, characters: [c('ra')], worlds: [w('duat')], scenes: [s('solar-barge-night'), s('gates-of-duat')], body: ['杜阿特不是一个简单的“地狱地图”。在冥界书传统中，太阳夜航要经过不同的区域、门和守卫；旅程的秩序来自正确的名字、行动和仪式知识。', '不同文本各自组织空间与时段。本篇将门域作为可复用场景，而不会把《阿姆杜阿特书》《大门之书》和其他葬祭材料无缝拼成唯一地图。'], note: '空间依赖已从现有单一“星空之河”扩展为白昼、夜航和门域三个可复用 Scene。'}),
  story({ id: 'story-apep-solar-attack', slug: 'apep-attacks-solar-barge', title: '阿佩普袭击太阳神舟', titleEn: 'Apep Attacks the Solar Barque', subtitle: '混沌每天都必须被重新抵抗', summary: '阿佩普作为太阳夜航中的混沌巨蛇，使秩序不被理解为一次性完成的创世结果。', volumeId: 'egypt-solar-maat', volumeTitle: '太阳与玛阿特', volumeOrder: 2, displayOrder: 3, tradition: '太阳夜航与混沌抵抗传统', source: sources.amduat, characters: [c('ra'), c('apep')], worlds: [w('duat')], scenes: [s('solar-barge-night'), s('gates-of-duat')], body: ['阿佩普不是一个可以用“最终 Boss”概括的现代幻想反派。它代表太阳航行中反复出现的阻力：黑暗、混沌与让宇宙循环无法继续的力量。', '太阳神舟每晚通过守护、咒语和神祇协作完成旅程，第二天的日出才具有“再次胜过混沌”的意义。视觉上应突出航行和秩序协作，而非单纯怪兽战斗。'], note: '本单元采用《阿姆杜阿特书》与相关冥界文本的夜航范围，不把后世流行文化的“末日蛇王”形象投射回全部时期。'}),
  story({ id: 'story-ra-osiris-renewal', slug: 'ra-osiris-night-renewal', title: '拉神与奥西里斯的夜间更新', titleEn: 'Ra and Osiris in Nightly Renewal', subtitle: '太阳与亡者之王在夜间发生关联', summary: '新王国冥界文本将太阳与奥西里斯的更新关联起来，形成昼夜与死后王权的复合图景。', volumeId: 'egypt-solar-maat', volumeTitle: '太阳与玛阿特', volumeOrder: 2, displayOrder: 4, tradition: '新王国太阳—奥西里斯冥界传统', source: sources.amduat, characters: [c('ra'), c('osiris')], worlds: [w('duat')], scenes: [s('midnight-renewal'), s('solar-barge-night')], body: ['在部分新王国冥界书中，太阳神的夜间旅程与奥西里斯的亡者王权发生关联。太阳经过夜间世界并获得更新，奥西里斯则代表死亡之后仍然有效的王权。', '这不是说两个名字在所有时期都等同，也不是把奥西里斯写成“太阳神的换装”。它是一种特定文本传统中的神学关联，必须保留时期与来源范围。'], note: '本单元明确展示合流 / 关联的来源边界，不创建后期复合 Character。'}),
  story({ id: 'story-khepri-dawn-rebirth', slug: 'khepri-dawn-rebirth', title: '凯布利与黎明再生', titleEn: 'Khepri and Dawn Rebirth', subtitle: '圣甲虫是特定太阳更新语境中的神格', summary: '凯布利关联黎明、生成与太阳更新；圣甲虫符号不应被泛化为所有“复活”主题。', volumeId: 'egypt-solar-maat', volumeTitle: '太阳与玛阿特', volumeOrder: 2, displayOrder: 5, tradition: '太阳更新与凯布利传统', source: sources.gates, characters: [c('khepri'), c('ra')], worlds: [w('celestial-sky'), w('duat')], scenes: [s('akhet-horizon'), s('solar-barge-night')], body: ['凯布利的圣甲虫形象与太阳每日重新显现的观念相连。它强调的是生成、推动和清晨更新，而不是一个脱离语境、可以贴在任何亡者故事上的“复活图标”。', '当太阳从地平线出现，夜航的危险并没有被抹去，反而说明更新是循环中必须完成的结果。凯布利因此与拉发生太阳循环关联，但不自动成为另一个换装版本。'], note: '视觉生产应以黎明地平线与推动太阳的动态关系为锚点，而不是只放大圣甲虫。'}),
  story({ id: 'story-isis-secret-name', slug: 'isis-secret-name-of-ra', title: '伊西斯与拉的秘密名字', titleEn: 'Isis and the Secret Name of Ra', subtitle: '神名、知识与权能的边界', summary: '伊西斯获取拉秘密名字的故事，把魔法、命名和神祇权能连接起来。', volumeId: 'egypt-solar-maat', volumeTitle: '太阳与玛阿特', volumeOrder: 2, displayOrder: 6, tradition: '伊西斯魔法与神名传统', source: sources.coffin, characters: [c('isis'), c('ra'), c('heka')], worlds: [], scenes: [s('memphite-creation')], body: ['在神名传统中，知道一个神的真实名字并不只是掌握一个标签，而可能意味着接近其权能的边界。伊西斯以智慧与魔法取得拉的秘密名字，故事因此围绕知识、治疗和权力展开。', '这个故事不应被改写成现代“窃取密码”的奇观。它保留的是古埃及关于名字具有有效力量的观念，并且要按具体文本范围说明伊西斯与拉之间的关系。'], note: '本单元将魔法作为独立依赖保留；不把 Heka 处理成一个重复的“法师角色”。'}),
  story({ id: 'story-sekhmet-eye-of-ra', slug: 'eye-of-ra-sekhmet', title: '毁灭人类与拉之眼', titleEn: 'The Destruction of Humanity and the Eye of Ra', subtitle: '烈焰、惩罚与恢复秩序', summary: '《天牛之书》传统讲述拉之眼与塞赫麦特的毁灭力量，也展示失控力量如何被重新安置。', volumeId: 'egypt-solar-maat', volumeTitle: '太阳与玛阿特', volumeOrder: 2, displayOrder: 7, tradition: '《天牛之书》与拉之眼传统', source: sources.heavenlyCow, characters: [c('ra'), c('sekhmet'), c('hathor')], worlds: [w('celestial-sky')], scenes: [s('solar-barge-day')], body: ['当人类不再服从拉的秩序，拉之眼的惩罚被叙述为具有毁灭性的太阳力量。塞赫麦特的狮首形象由此与烈焰、战争和危险的保护力量相连。', '后续的恢复不是简单地把女神变“温柔”，而是通过酒液、颜色和仪式把毁灭性的力量重新纳入可持续的秩序。Hathor、Sekhmet 与拉之眼之间的关系需要按传统区分，不能全部硬合并。'], note: '本单元仅使用《天牛之书》的来源范围，不把所有拉之眼女神直接视为一个稳定 Character。'}),
  story({ id: 'story-osiris-isis', slug: 'osiris-isis', title: '奥西里斯与伊西斯', titleEn: 'Osiris and Isis', subtitle: '死亡之后，王权以另一种方式延续', summary: '奥西里斯被杀后，伊西斯寻找并重组他的身体；死亡、复生与荷鲁斯继承由此连成核心循环。', volumeId: 'egypt-osirian-kingship', volumeTitle: '奥西里斯王权循环', volumeOrder: 3, displayOrder: 1, tradition: '金字塔文、棺材文及后期奥西里斯神话传统', source: sources.pyramid, characters: [c('osiris'), c('isis'), c('set'), c('horus'), c('nephthys')], worlds: [w('duat')], scenes: [s('throne-of-osiris'), s('papyrus-marsh')], body: ['奥西里斯的故事把王权、死亡和再生绑定在一起。他被赛特杀死之后，伊西斯不断寻找失落的身体，使其重新完整，并由此孕育荷鲁斯。', '奥西里斯没有简单回到人间继续统治，而是成为冥界之王。荷鲁斯则在现世继承王权，与赛特的冲突构成另一条漫长叙事。于是父与子、死者与生者、冥界与王国形成互相映照的秩序。'], note: '奥西里斯神话没有一部单一古埃及“圣典”保存完整故事，后期较完整版本必须与早期材料区分。'}),
  story({ id: 'story-isis-searches-osiris', slug: 'isis-searches-osiris', title: '伊西斯寻找奥西里斯', titleEn: 'Isis Searches for Osiris', subtitle: '寻找身体，也寻找王权能够延续的形式', summary: '伊西斯的寻找与哀悼把身体、记忆、葬祭和王权的连续性连接起来。', volumeId: 'egypt-osirian-kingship', volumeTitle: '奥西里斯王权循环', volumeOrder: 3, displayOrder: 2, tradition: '奥西里斯哀悼与恢复传统', source: sources.coffin, characters: [c('isis'), c('osiris'), c('nephthys'), c('set')], worlds: [w('duat')], scenes: [s('desert-necropolis'), s('throne-of-osiris')], body: ['伊西斯寻找奥西里斯的叙事，不应只被理解为一段英雄救援。身体的寻找、哀悼的表达和葬祭的恢复，共同说明一个已死的王如何仍能在宇宙秩序中发挥作用。', '后世的完整叙述常加入更多旅程、地点和物件，但不同细节的来源层次并不相同。故事页需要让读者看到“早期葬祭证据”和“后期完整见证”的区别。'], note: '本单元只把后期版本中稳定且有独立阅读价值的寻找主题展开，不将后期细节倒灌为古王国唯一叙事。'}),
  story({ id: 'story-osiris-restoration', slug: 'osiris-restoration-horus-conception', title: '奥西里斯的恢复与荷鲁斯的受孕', titleEn: 'Osiris Restored and Horus Conceived', subtitle: '恢复不等于回到生前王座', summary: '伊西斯使奥西里斯重新完整，并在死者之王的新位置上延续王权；荷鲁斯成为现世继承线索。', volumeId: 'egypt-osirian-kingship', volumeTitle: '奥西里斯王权循环', volumeOrder: 3, displayOrder: 3, tradition: '奥西里斯恢复与荷鲁斯继承传统', source: sources.pyramid, characters: [c('osiris'), c('isis'), c('horus'), c('nephthys')], worlds: [w('duat')], scenes: [s('throne-of-osiris'), s('papyrus-marsh')], body: ['奥西里斯的恢复首先是葬祭意义上的完整与有效，而不是现代叙事里“死而复生，重新回到原王国”。他在杜阿特成为亡者之王，死亡改变了他的王权位置。', '荷鲁斯的诞生与成长把这份王权带回生者一侧。父亲的死、母亲的保护和儿子的继承，构成奥西里斯循环最重要的跨世界关系。'], note: '“复生”在本单元中按来源与葬祭语境表达，避免把它简化为现代奇幻复活。'}),
  story({ id: 'story-horus-hidden-birth', slug: 'horus-birth-and-hidden', title: '荷鲁斯的出生与隐藏', titleEn: 'Horus Is Born and Hidden', subtitle: '继承者在沼泽与危险中长大', summary: '伊西斯保护幼年荷鲁斯，使奥西里斯的继承线在赛特威胁下得以延续。', volumeId: 'egypt-osirian-kingship', volumeTitle: '奥西里斯王权循环', volumeOrder: 3, displayOrder: 4, tradition: '奥西里斯王权循环与保护传统', source: sources.coffin, characters: [c('isis'), c('horus'), c('set')], worlds: [w('duat')], scenes: [s('papyrus-marsh')], body: ['幼年荷鲁斯并不是一个可以直接套进成年鹰神肖像的小号版本。他在纸莎草沼泽中被保护、隐藏并逐渐成长，身份核心是奥西里斯与伊西斯王权循环中的继承者。', '保护、魔法和湿地空间共同承担叙事功能：这里不是一个浪漫化的自然背景，而是远离神庭、让继承线得以存续的边界场所。'], note: '本包不创建“Horus the Child”年龄 Variant；若未来形成独立身份页面，应按 Identity Resolution Policy 另行评审。'}),
  story({ id: 'story-isis-protects-horus', slug: 'isis-protects-horus-in-marsh', title: '伊西斯在纸莎草沼泽保护荷鲁斯', titleEn: 'Isis Protects Horus in the Papyrus Marsh', subtitle: '魔法、母亲与隐蔽空间', summary: '伊西斯借助魔法与沼泽环境保护幼年荷鲁斯，形成王权循环中的生存段落。', volumeId: 'egypt-osirian-kingship', volumeTitle: '奥西里斯王权循环', volumeOrder: 3, displayOrder: 5, tradition: '魔法与治愈文本中的伊西斯—荷鲁斯传统', source: sources.coffin, characters: [c('isis'), c('horus'), c('heka')], worlds: [], scenes: [s('papyrus-marsh')], body: ['纸莎草沼泽把伊西斯与荷鲁斯安置在神庭之外：湿地既提供遮蔽，也让毒害、疾病和野生力量进入故事。伊西斯的保护不是抽象母爱，而是由咒语、知识和持续照护完成的行动。', '这一段与后来的王位裁决相连，却不等于裁决已经发生。把它单独保留，可以让读者理解荷鲁斯身份如何在尚未登上王座之前形成。'], note: '魔法 / 治愈材料的时期与文本范围需要在后续 source registry 中继续细化；本轮先用结构化 source id 保持可追踪。'}),
  story({ id: 'story-horus-set-claim', slug: 'horus-set-claim-throne', title: '荷鲁斯与赛特提出王位主张', titleEn: 'Horus and Seth Claim the Throne', subtitle: '王位冲突从家族悲剧转成公共裁决', summary: '荷鲁斯与赛特的冲突围绕奥西里斯之后谁有资格继承王位展开。', volumeId: 'egypt-osirian-kingship', volumeTitle: '奥西里斯王权循环', volumeOrder: 3, displayOrder: 6, tradition: '荷鲁斯与赛特王位争端传统', source: sources.horusSeth, characters: [c('horus'), c('set'), c('osiris'), c('isis')], worlds: [w('duat')], scenes: [s('divine-tribunal')], body: ['荷鲁斯主张自己是奥西里斯的继承者，赛特则以力量、年长或自身的神性位置提出竞争。故事的关键不只是两位神的个人敌对，而是“谁能代表王权秩序”的公共问题。', '神庭、证言和漫长争论把家庭关系转成政治神学。荷鲁斯的鹰与王冠必须服务于这一继承身份，而不应把他泛化成一个脱离 Osirian cycle 的固定鸟首战士。'], note: '本单元采用 Papyrus Chester Beatty I 的叙事见证，明确其为一个重要版本而非全部地方传统。'}),
  story({ id: 'story-horus-set-contests', slug: 'horus-set-contests', title: '荷鲁斯与赛特的主要竞赛', titleEn: 'The Contests of Horus and Seth', subtitle: '竞赛、羞辱与神庭秩序', summary: '荷鲁斯与赛特通过一系列竞赛争夺继承资格，叙事同时暴露神庭裁决的复杂与延宕。', volumeId: 'egypt-osirian-kingship', volumeTitle: '奥西里斯王权循环', volumeOrder: 3, displayOrder: 7, tradition: 'Papyrus Chester Beatty I 争斗传统', source: sources.horusSeth, characters: [c('horus'), c('set'), c('isis'), c('thoth')], worlds: [w('duat')], scenes: [s('divine-tribunal')], body: ['竞赛把荷鲁斯与赛特之间的敌对关系具体化：速度、力量、变形、航行和欺骗都可能成为争端的一部分。它们不是一套“技能展示”，而是在神庭规则尚未稳定时对秩序本身的试探。', '伊西斯的介入和托特的记录让故事不止于两位对手的决斗。神话由此展现：继承需要证据、见证与裁决，也可能经历长久的拖延。'], note: '不同版本的竞赛清单不完全相同，本篇不把所有后世流行桥段都视为同一原典。'}),
  story({ id: 'story-divine-tribunal', slug: 'divine-tribunal', title: '神庭裁决', titleEn: 'The Divine Tribunal', subtitle: '谁有权宣布王权的连续性', summary: '神庭在荷鲁斯与赛特的争端中承担见证、讨论和裁决功能，连接家族、王权与宇宙秩序。', volumeId: 'egypt-osirian-kingship', volumeTitle: '奥西里斯王权循环', volumeOrder: 3, displayOrder: 8, tradition: '王位继承神庭传统', source: sources.horusSeth, characters: [c('horus'), c('set'), c('osiris'), c('isis'), c('thoth')], worlds: [w('duat')], scenes: [s('divine-tribunal'), s('throne-of-osiris')], body: ['神庭裁决把“奥西里斯之子”这个身份转成一个需要被认可的王权主张。众神的立场并不总是立即一致，裁决因此成为一场关于长幼、力量、血缘和秩序的协商。', '奥西里斯在亡者世界的意见与生者神庭的争端相互照应：父亲已不在现世，却仍能通过死后王权参与继承结构。'], note: '本单元承担 tribunal 的独立叙事桥梁，避免把它拆成若干重复的“某神发表意见”页面。'}),
  story({ id: 'story-horus-inherits-kingship', slug: 'horus-inherits-kingship', title: '荷鲁斯继承王权', titleEn: 'Horus Inherits Kingship', subtitle: '神话中的继承成为现世王权的镜像', summary: '荷鲁斯最终继承现世王权，奥西里斯则在杜阿特维持亡者世界的王权。', volumeId: 'egypt-osirian-kingship', volumeTitle: '奥西里斯王权循环', volumeOrder: 3, displayOrder: 9, tradition: '荷鲁斯继承与法老王权传统', source: sources.horusSeth, characters: [c('horus'), c('osiris'), c('set')], worlds: [w('celestial-sky'), w('duat')], scenes: [s('divine-tribunal'), s('throne-of-osiris')], body: ['荷鲁斯继承王权后，故事并没有让奥西里斯失去意义。现世王权与亡者王权被分成两个互补位置：一个维持生者土地，一个主持死者的延续。', '这也是为什么荷鲁斯不能只用“天空之神”概括。对 P0 主入口而言，他首先是 Osirian kingship cycle 中的继承者；鹰与王冠是身份锚点的一部分，而不是全部。'], note: '页面与 Graph 默认展示 Osirian kingship scope；其他 Horus 身份不在本单元静默合并。'}),
  story({ id: 'story-osiris-king-of-dead', slug: 'osiris-king-of-the-dead', title: '奥西里斯成为亡者之王', titleEn: 'Osiris Becomes King of the Dead', subtitle: '死亡并没有抹去王权，而是改变它的空间', summary: '奥西里斯在死亡之后成为亡者之王，形成现世继承与死后秩序之间的双重王权结构。', volumeId: 'egypt-osirian-kingship', volumeTitle: '奥西里斯王权循环', volumeOrder: 3, displayOrder: 10, tradition: '奥西里斯亡者王权传统', source: sources.pyramid, characters: [c('osiris'), c('anubis'), c('maat')], worlds: [w('duat')], scenes: [s('throne-of-osiris')], body: ['奥西里斯成为亡者之王，是“复生”在古埃及语境中的重要转向：他不再回到生者社会继续做原来的王，而是在杜阿特获得新的、持续有效的王权。', '这一位置使他的故事与每一位亡者的希望相连，也使墓葬、供奉、审判与神话王权共享一套视觉和宗教语言。'], note: '本篇把亡者王权单独建模，为后续心脏称量与 Aaru 场景提供稳定依赖。'}),
  story({ id: 'story-anubis-mummification', slug: 'anubis-mummification', title: '阿努比斯与木乃伊化', titleEn: 'Anubis and Mummification', subtitle: '亡者准备不是天平画面的附属情节', summary: '阿努比斯关联木乃伊化、墓地守护和亡者引导，身份不应被单一心脏称量场景垄断。', volumeId: 'egypt-death-afterlife', volumeTitle: '死亡、审判与有效亡者', volumeOrder: 4, displayOrder: 1, tradition: '葬祭、木乃伊化与墓地守护传统', source: sources.dead, characters: [c('anubis'), c('osiris'), c('isis'), c('nephthys')], worlds: [w('duat')], scenes: [s('desert-necropolis'), s('throne-of-osiris')], body: ['阿努比斯最重要的视觉锚点不只是天平。他还与木乃伊化、墓地边界和亡者从身体状态进入有效死后身份的过程相连。黑色可以指向沃土、再生与死亡语境，不能自动等同暗黑幻想。', '在奥西里斯传统中，葬祭准备使身体能够继续承载名字、供奉与生命力量。阿努比斯因此处于仪式准备、守护和引导的交界，而不是一个只负责宣布结果的法官。'], note: '保留既有 character-anubis 与两个 Variant 的 ID；本单元完成其 Canonical Design 的职责扩展。'}),
  story({ id: 'story-dead-enter-duat', slug: 'dead-enter-duat-gates', title: '亡者进入杜阿特并通过门域', titleEn: 'The Dead Enter the Duat', subtitle: '进入不是终点，名字与知识仍然有效', summary: '亡者在不同葬祭文本所描绘的杜阿特中前行，通过门域、守卫与转化获得继续存在的可能。', volumeId: 'egypt-death-afterlife', volumeTitle: '死亡、审判与有效亡者', volumeOrder: 4, displayOrder: 2, tradition: '《大门之书》与葬祭旅程传统', source: sources.gates, characters: [c('anubis'), c('heka'), c('osiris')], worlds: [w('duat')], scenes: [s('gates-of-duat'), s('solar-barge-night')], body: ['进入杜阿特不是一次穿过黑门就结束的冒险。不同葬祭文本把它描绘成由门、守卫、河流、时段和咒语组成的复杂旅程，亡者需要知道如何让自己的身份继续有效。', '这些地图之间存在差异，正是它们的历史价值所在。产品用“门域”和“夜间航行”作为共享 Scene，而把每部冥界书的具体地理保留在来源说明里。'], note: '不把杜阿特渲染成现代火焰地狱，也不把所有冥界书拼成固定单一地图。'}),
  story({ id: 'story-weighing-heart', slug: 'weighing-heart', title: '心脏称量', titleEn: 'The Weighing of the Heart', subtitle: '亡者如何在玛阿特面前证明自己仍然有效', summary: '亡者之心与玛阿特之羽在天平上比较，阿努比斯主持称量，托特记录结果，奥西里斯主持死后秩序。', volumeId: 'egypt-death-afterlife', volumeTitle: '死亡、审判与有效亡者', volumeOrder: 4, displayOrder: 3, tradition: '《亡灵书》等新王国及后续葬祭文本传统', source: sources.dead, characters: [c('anubis'), c('maat'), c('thoth'), c('ammit'), c('osiris')], worlds: [w('duat')], scenes: [s('hall-of-two-truths'), s('throne-of-osiris')], body: ['古埃及死后世界并不只是“进入冥界”。亡者需要通过一套复杂的判断与转化，其中最著名的场面，是把心脏放到天平一端，与象征玛阿特——真理、正义与宇宙秩序——的羽毛进行称量。', '阿努比斯负责天平与亡者仪式，托特记录结果，奥西里斯主持死后王权；如果心脏失去平衡，阿米特作为复合生物等待吞噬它。这里不是一个神任意决定善恶的法庭，而是亡者能否与玛阿特秩序保持一致的问题。'], note: '这一单元集中承载 Anubis、Ma’at、Thoth、Ammit 与 Osiris，避免把一次仪式拆成重复 Story。'}),
  story({ id: 'story-aaru-field-of-reeds', slug: 'aaru-field-of-reeds', title: '芦苇原与有效永生', titleEn: 'Aaru and the Field of Reeds', subtitle: '死后目标不是简单的天堂标签', summary: 'Aaru / Field of Reeds 以有序、可持续的理想生活表达死后目标，应作为杜阿特关联区域理解。', volumeId: 'egypt-death-afterlife', volumeTitle: '死亡、审判与有效亡者', volumeOrder: 4, displayOrder: 4, tradition: '死后理想区域与葬祭传统', source: sources.dead, characters: [c('osiris'), c('maat'), c('anubis')], worlds: [w('duat')], scenes: [s('field-of-reeds'), s('throne-of-osiris')], body: ['芦苇原常被现代简介直接译成“天堂”，但这样的翻译会抹平它与土地、劳作、供奉和有效死后身份之间的联系。它更像一个可以继续生活、耕作、接受供给并保持秩序的理想区域。', '在产品空间语义中，Aaru 先作为杜阿特关联的 Region / Scene，而不是默认独立一级 World。这样既保留它的视觉价值，也避免为了补齐地图把不同葬祭传统合并成一张超自然地理图。'], note: 'Aaru 的独立 World 资格留给未来依赖与复用验证；本轮严格执行 World / Scene 语义。'}),
];
