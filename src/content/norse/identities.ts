import type { CharacterInterpretation, CharacterName, ContentClaim } from '../../lib/content/types';
import { sourceRef } from './sources';

/**
 * Norse names are searchable, source-scoped records. A byname or editorial
 * label is not promoted to a second Character unless the evidence and product
 * scope explicitly require it.
 */
export const norseNames: readonly CharacterName[] = [
  { id: 'name-norse-odin-odinn', characterId: 'character-odin', name: 'Óðinn', nameEn: 'Óðinn', nameKind: 'primary', isPrimaryForScope: true, sourceRefs: [sourceRef('voluspa', 'st. 1–5')], confidence: 'high' },
  { id: 'name-norse-odin-grimnir', characterId: 'character-odin', name: 'Grímnir', nameEn: 'Grímnir', nameKind: 'title', isPrimaryForScope: false, sourceRefs: [sourceRef('grimnismal', 'st. 1–54')], confidence: 'high' },
  { id: 'name-norse-thor-thorr', characterId: 'character-thor', name: 'Þórr', nameEn: 'Þórr', nameKind: 'primary', isPrimaryForScope: true, sourceRefs: [sourceRef('hymiskvida', 'st. 1–39')], confidence: 'high' },
  { id: 'name-norse-brynhildr-sigrdrifa', characterId: 'character-brynhildr', interpretationId: 'interpretation-norse-brynhildr-sigrdrifa', name: 'Sigrdrífa', nameEn: 'Sigrdrífa', nameKind: 'literary-identity', isPrimaryForScope: true, sourceRefs: [sourceRef('sigrdrifumal', 'st. 1–4')], confidence: 'contested' },
  { id: 'name-norse-gullveig-heidr', characterId: 'character-gullveig', interpretationId: 'interpretation-norse-gullveig-heidr', name: 'Heiðr', nameEn: 'Heiðr', nameKind: 'literary-identity', isPrimaryForScope: true, sourceRefs: [sourceRef('voluspa', 'st. 21–22')], confidence: 'contested' },
  { id: 'name-norse-jormungandr-midgardsormr', characterId: 'character-jormungandr', name: 'Miðgarðsormr', nameEn: 'Midgard Serpent', nameKind: 'title', isPrimaryForScope: true, sourceRefs: [sourceRef('proseEddaGylfaginning', 'ch. 34')], confidence: 'high' },
  { id: 'name-norse-fenrir-fenrisulfr', characterId: 'character-fenrir', name: 'Fenrisúlfr', nameEn: 'Fenris-Wolf', nameKind: 'title', isPrimaryForScope: true, sourceRefs: [sourceRef('proseEddaGylfaginning', 'chs. 34, 51')], confidence: 'high' },
];

export const norseInterpretations: readonly CharacterInterpretation[] = [
  {
    id: 'interpretation-norse-brynhildr-sigrdrifa',
    characterId: 'character-brynhildr',
    slug: 'sigrdrifa-source-layer',
    name: 'Sigrdrífa 诗歌身份层',
    role: '《Sigrdrífumál》残片中的女武神与知识传授者',
    summary: 'Sigrdrífa 作为来源限定的称谓与叙事身份层呈现；本包不把她静默建成独立于 Brynhildr 的第二个 Character，也不把所有布伦希尔德传统强行合并。',
    traditionTags: ['volsung', 'hero', 'identity-variant'],
    sourcePeriods: ['Medieval Icelandic manuscript witnesses preserving layered heroic traditions'],
    sourceRefs: [sourceRef('sigrdrifumal', 'st. 1–4, 20–21'), sourceRef('helreidBrynhildar', 'st. 6–10')],
    identityAnchors: ['火焰围绕的山地', '女武神', '胜利与知识'],
    symbols: ['盾牌', '火焰', '符文'],
    canonicalDesignOverrides: { avoid: ['treating Sigrdrífa as an unrelated generic Valkyrie', 'merging every Brynhildr witness without scope labels'] },
    promptFragment: 'Use Sigrdrífa as a source-scoped Brynhildr interpretation: a battle-maid and teacher of wisdom, not a second unrelated character.',
    confidence: 'contested',
  },
  {
    id: 'interpretation-norse-gullveig-heidr',
    characterId: 'character-gullveig',
    slug: 'gullveig-heidr-source-layer',
    name: '古尔薇格—海恩诗歌身份层',
    role: '《女预言家之歌》中反复焚烧、与魔法关联的来源解释层',
    summary: '古尔薇格与海恩在相邻诗节出现，但诗歌没有提供足够材料让产品把二者或古尔薇格与芙蕾雅无条件合并；页面应保留比较而非硬编码同一身份。',
    traditionTags: ['vanir', 'gods-and-treasures', 'identity-variant'],
    sourcePeriods: ['Medieval Icelandic manuscript witnesses preserving older poetic material'],
    sourceRefs: [sourceRef('voluspa', 'st. 21–24')],
    identityAnchors: ['反复焚烧', '复起', '魔法与金色意象'],
    symbols: ['长矛', '火焰', '金色余烬'],
    canonicalDesignOverrides: { avoid: ['automatic Freyja identification', 'treating the poem as a complete biography'] },
    promptFragment: 'Keep Gullveig and Heiðr source-scoped and visually distinct from an automatic Freyja identification; use fire and recurrence as textual anchors.',
    confidence: 'contested',
  },
  {
    id: 'interpretation-norse-rigr-rigsthula',
    characterId: 'character-rigr',
    slug: 'rigr-rigsthula-source-layer',
    name: 'Rígr 社会秩序诗歌身份层',
    role: '《Rígsþula》中与家屋、继承和社会等级叙事相关的行旅者',
    summary: 'Rígr 只按《Rígsþula》的诗歌范围呈现；与 Heimdallr 或 Óðinn 的对应属于解释问题，不作为默认人物事实。',
    traditionTags: ['independent-eddic', 'identity-variant'],
    sourcePeriods: ['Medieval Icelandic manuscript witnesses preserving older poetic material'],
    sourceRefs: [sourceRef('rigsthula', 'sts. 1–49')],
    identityAnchors: ['行旅者', '家屋门槛', '社会秩序'],
    symbols: ['旅杖', '长屋', '继承线'],
    canonicalDesignOverrides: { avoid: ['unqualified Heimdallr identity', 'unqualified Odin identity'] },
    promptFragment: 'Render Rígr as a source-scoped traveler in a social-order poem; do not resolve the identity dispute through costume alone.',
    confidence: 'contested',
  },
  {
    id: 'interpretation-norse-odin-ynglinga',
    characterId: 'character-odin',
    slug: 'ynglinga-euhemeristic-odin',
    name: '《英灵世系》历史化奥丁解释层',
    role: '《英灵世系》中的历史化、王权谱系与欧赫迈罗斯式叙事层',
    summary: '《英灵世系》中的奥丁服务于中世纪王族谱系与历史化叙述；该解释层不能回填为所有北欧神话传统中的唯一奥丁传记。',
    traditionTags: ['odin-cycle', 'identity-variant'],
    sourcePeriods: ['13th-century Icelandic prose witness'],
    sourceRefs: [sourceRef('ynglingaSaga', 'chs. 2–7')],
    identityAnchors: ['王权谱系', '迁徙叙事', '历史化框架'],
    symbols: ['王杖', '长船', '谱系卷轴'],
    canonicalDesignOverrides: { avoid: ['presenting saga euhemerism as direct pagan theology', 'collapsing saga Odin into every poetic witness'] },
    promptFragment: 'Use a historical-literary Odin interpretation with explicit saga framing; preserve the distinction from Eddic divine portraits.',
    confidence: 'medium',
  },
];

export const norseClaims: readonly ContentClaim[] = [
  { id: 'claim-norse-ask-embla-triad', subjectType: 'story', subjectId: 'story-ask-and-embla', claimType: 'identity', summary: '《女预言家之歌》以奥丁、海尼尔与洛德尔描述赋予阿斯克与恩布拉生命和感知；散文创世叙事常以奥丁、威利与维组织平行版本。本包保留两种三元组，不把其中一种写成唯一诗句事实。', status: 'contested', traditionScope: 'Völuspá st. 17–18 versus Gylfaginning creation tradition', sourceRefs: [sourceRef('voluspa', 'st. 17–18'), sourceRef('proseEddaGylfaginning', 'chs. 8–9')] },
  { id: 'claim-norse-harbard-identity', subjectType: 'story', subjectId: 'story-thor-and-harbard', claimType: 'identity', summary: '《哈巴德之歌》中的 Hárbarðr 身份必须保持来源限定；本包不把“Hárbarðr 必然等同奥丁”作为无争议人物事实。', status: 'contested', traditionScope: 'Hárbarðsljóð identity reading', sourceRefs: [sourceRef('harbardsljod', 'st. 1–60')] },
  { id: 'claim-norse-sigrdrifa-brynhildr-boundary', subjectType: 'character', subjectId: 'character-brynhildr', claimType: 'identity', summary: 'Sigrdrífa 作为《Sigrdrífumál》中的称谓和身份层进入 Brynhildr 记录；她不应在没有说明来源范围的情况下被建成第二个角色，也不应覆盖全部布伦希尔德传统。', status: 'contested', traditionScope: 'Eddic heroic poetry and Völsung comparison', sourceRefs: [sourceRef('sigrdrifumal', 'st. 1–4, 20–21'), sourceRef('helreidBrynhildar', 'st. 6–10')] },
  { id: 'claim-norse-gullveig-freyja-boundary', subjectType: 'character', subjectId: 'character-gullveig', claimType: 'identity', summary: '古尔薇格与芙蕾雅的对应可以作为比较假说，但不能因《女预言家之歌》的相邻诗节或后世注释而自动建立 alias 或 same-as。', status: 'contested', traditionScope: 'Völuspá st. 21–24', sourceRefs: [sourceRef('voluspa', 'st. 21–24')] },
  { id: 'claim-norse-garmr-fenrir-boundary', subjectType: 'character', subjectId: 'character-garmr', claimType: 'identity', summary: 'Garmr 与 Fenrir 在产品中保持两个 Character；即使《散文埃达》的诸神黄昏叙事把二者并置，也不将犬形守卫和巨狼静默合并。', status: 'supported', traditionScope: 'Gylfaginning Ragnarök sequence', sourceRefs: [sourceRef('proseEddaGylfaginning', 'chs. 34, 51')] },
  { id: 'claim-norse-ynglinga-euhemerism', subjectType: 'character', subjectId: 'character-odin', claimType: 'interpretation', summary: '《英灵世系》对奥丁的历史化与王权谱系叙述属于特定中世纪散文框架，不是对诗体埃达神格身份的无缝替代。', status: 'supported', traditionScope: 'Ynglinga saga / Heimskringla euhemeristic framing', sourceRefs: [sourceRef('ynglingaSaga', 'chs. 2–7'), sourceRef('voluspa', 'st. 1–5')] },
  { id: 'claim-norse-nine-worlds-model-boundary', subjectType: 'world', subjectId: 'world-asgard', claimType: 'interpretation', summary: '本包的八个 World 节点是当前故事依赖闭包与产品导航范围，不宣称已经固定完成一个跨所有来源一致的“九界”名单；未建模空间必须继续以来源为准。', status: 'editorial-synthesis', traditionScope: 'MythCanvas dependency model versus Eddic cosmological lists', sourceRefs: [sourceRef('voluspa', 'st. 2'), sourceRef('proseEddaGylfaginning', 'chs. 8–9')] },
  { id: 'claim-norse-freyr-gerdr-consent-framing', subjectType: 'story', subjectId: 'story-freyr-and-gerdr', claimType: 'interpretation', summary: '《Skírnismál》的求婚、威胁和交换必须按诗歌中的权力关系呈现；页面不能把葛德简化成弗雷获得的奖品，也不能把强制性语言洗成无冲突的浪漫叙事。', status: 'supported', traditionScope: 'Skírnismál courtship tradition', sourceRefs: [sourceRef('skirnismal', 'st. 1–42')] },
  { id: 'claim-norse-lokasenna-speech-acts', subjectType: 'story', subjectId: 'story-lokis-feast', claimType: 'interpretation', summary: '《洛基的争辩》中的辱骂和指控首先是宴席上的言语行动；页面不能把每句指控直接升级为已经核实的神谱或道德事实。', status: 'supported', traditionScope: 'Lokasenna flyting scene', sourceRefs: [sourceRef('lokasenna', 'st. 1–65')] },
  { id: 'claim-norse-ragnarok-survivor-scope', subjectType: 'story', subjectId: 'story-ragnarok', claimType: 'narrative', summary: '诸神黄昏后的幸存者名单必须按具体来源呈现：诗歌、散文与后续重述的幸存者和复归次序不能无标记地拼成唯一版本。', status: 'contested', traditionScope: 'Völuspá final stanzas versus Gylfaginning chapters 52–53', sourceRefs: [sourceRef('voluspa', 'st. 59–66'), sourceRef('proseEddaGylfaginning', 'chs. 52–53')] },
];
