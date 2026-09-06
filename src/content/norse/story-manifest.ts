import type { ContentEntityType } from '../../lib/content/types';
import { sourceRef, type NorseSourceKey } from './sources';

export type NorseManifestStatus = 'proposed' | 'researched' | 'structured' | 'source-reviewed' | 'published' | 'excluded';
export type NorsePriority = 'P0' | 'P1' | 'P2';

export type NorseStoryManifestItem = {
  id: string;
  proposedSlug: string;
  titleZh: string;
  titleEn: string;
  cycleIds: readonly string[];
  priority: NorsePriority;
  status: NorseManifestStatus;
  sourceScopes: readonly { sourceId: string; locator: string; role: 'primary-narrative' | 'parallel' | 'variant' | 'context' }[];
  expectedDependencies: Record<Extract<ContentEntityType, 'character' | 'world' | 'scene' | 'mythic-object' | 'concept'>, readonly string[]>;
  existingStoryId?: string;
  migrationDecision?: 'keep' | 'split' | 'merge' | 'rewrite' | 'retitle' | 'unpublish';
};

type Seed = {
  slug: string;
  zh: string;
  en: string;
  cycle: string | readonly string[];
  priority: NorsePriority;
  source: NorseSourceKey;
  locator: string;
  characters?: readonly string[];
  objects?: readonly string[];
  existingStoryId?: string;
  migrationDecision?: NorseStoryManifestItem['migrationDecision'];
};

const item = (seed: Seed): NorseStoryManifestItem => {
  const ref = sourceRef(seed.source, seed.locator);
  return {
    id: `norse-manifest-${seed.slug}`,
    proposedSlug: seed.slug,
    titleZh: seed.zh,
    titleEn: seed.en,
    cycleIds: typeof seed.cycle === 'string' ? [seed.cycle] : seed.cycle,
    priority: seed.priority,
    status: seed.existingStoryId ? 'published' : 'source-reviewed',
    sourceScopes: [{ sourceId: ref.sourceId!, locator: seed.locator, role: 'primary-narrative' }],
    expectedDependencies: {
      character: seed.characters ?? [],
      world: [],
      scene: [],
      'mythic-object': seed.objects ?? [],
      concept: [],
    },
    existingStoryId: seed.existingStoryId,
    migrationDecision: seed.migrationDecision,
  };
};

/**
 * Phase-2 research baseline. These are story units, not automatically
 * published pages; an item may belong to multiple Cycles and must gain full
 * World/Scene dependencies before entering dependency-complete.
 */
export const norseStoryManifest: readonly NorseStoryManifestItem[] = [
  // Cycle 01 — origins and cosmic structure
  item({ slug: 'ymir-creation', zh: '尤弥尔与世界的诞生', en: 'Ymir and the Making of the World', cycle: 'creation', priority: 'P0', source: 'proseEddaGylfaginning', locator: 'chs. 4–8', characters: ['character-ymir'], existingStoryId: 'story-ymir-creation', migrationDecision: 'rewrite' }),
  item({ slug: 'audhumla-and-buri', zh: '奥德胡姆拉与布里', en: 'Auðumbla and Búri', cycle: 'creation', priority: 'P0', source: 'proseEddaGylfaginning', locator: 'ch. 6', characters: ['character-buri', 'character-ymir'], existingStoryId: 'story-audhumla-and-buri', migrationDecision: 'rewrite' }),
  item({ slug: 'ymir-world-making', zh: '尤弥尔之躯化为世界', en: 'The World Made from Ymir', cycle: 'creation', priority: 'P0', source: 'proseEddaGylfaginning', locator: 'ch. 8', characters: ['character-odin', 'character-vili', 'character-ve', 'character-ymir'], existingStoryId: 'story-odin-creates-world', migrationDecision: 'retitle' }),
  item({ slug: 'ask-and-embla', zh: '阿斯克与恩布拉', en: 'Ask and Embla', cycle: 'creation', priority: 'P0', source: 'voluspa', locator: 'st. 17–18', characters: ['character-odin', 'character-vili', 'character-ve'], existingStoryId: 'story-ask-and-embla', migrationDecision: 'rewrite' }),
  item({ slug: 'yggdrasil-and-wells', zh: '世界树与三口井', en: 'Yggdrasil and the Wells', cycle: 'creation', priority: 'P0', source: 'grimnismal', locator: 'st. 29–35', characters: ['character-mimir'], existingStoryId: 'story-yggdrasil-wells-norns', migrationDecision: 'split' }),
  item({ slug: 'norns-at-urdarbrunnr', zh: '诺恩与命运之井', en: 'The Norns at Urðarbrunnr', cycle: 'creation', priority: 'P0', source: 'voluspa', locator: 'st. 20', characters: ['character-urd', 'character-verdandi', 'character-skuld'], existingStoryId: 'story-norns-at-urdarbrunnr', migrationDecision: 'split' }),
  item({ slug: 'sun-moon-pursuers', zh: '日月与追逐者', en: 'The Sun, Moon and Their Pursuers', cycle: 'creation', priority: 'P0', source: 'voluspa', locator: 'st. 5, 40–41', characters: ['character-sol', 'character-mani', 'character-skoll', 'character-hati'], existingStoryId: 'story-sun-and-moon-chase', migrationDecision: 'rewrite' }),
  item({ slug: 'nidhoggr-and-world-tree', zh: '尼德霍格与世界树', en: 'Níðhöggr and the World Tree', cycle: 'creation', priority: 'P1', source: 'grimnismal', locator: 'st. 32–35', characters: ['character-nidhoggr'], existingStoryId: 'story-nidhoggr-and-world-tree', migrationDecision: 'keep' }),

  // Cycle 02 — divine order
  item({ slug: 'gullveig-and-aesir-vanir-war', zh: '古尔薇格与阿萨—华纳之战', en: 'Gullveig and the Æsir–Vanir War', cycle: 'gods-and-treasures', priority: 'P0', source: 'voluspa', locator: 'st. 21–24', characters: ['character-gullveig', 'character-odin'], existingStoryId: 'story-aesir-vanir-war', migrationDecision: 'split' }),
  item({ slug: 'aesir-vanir-truce', zh: '阿萨与华纳的和约', en: 'The Æsir–Vanir Truce', cycle: 'gods-and-treasures', priority: 'P0', source: 'proseEddaSkaldskaparmal', locator: 'ch. 57', characters: ['character-njordr', 'character-freyr', 'character-freyja'], existingStoryId: 'story-aesir-vanir-war', migrationDecision: 'split' }),
  item({ slug: 'kvasir-and-mead', zh: '克瓦希尔与诗歌蜜酒', en: 'Kvasir and the Mead of Poetry', cycle: ['gods-and-treasures', 'odin-cycle'], priority: 'P0', source: 'proseEddaSkaldskaparmal', locator: 'ch. 1', characters: ['character-kvasir', 'character-odin'], objects: ['object-norse-mead-of-poetry'], existingStoryId: 'story-kvasir-and-mead', migrationDecision: 'split' }),
  item({ slug: 'odin-steals-mead', zh: '奥丁夺取诗歌蜜酒', en: 'Odin Steals the Mead of Poetry', cycle: ['gods-and-treasures', 'odin-cycle'], priority: 'P0', source: 'proseEddaSkaldskaparmal', locator: 'ch. 1', characters: ['character-odin'], objects: ['object-norse-mead-of-poetry'], existingStoryId: 'story-odin-steals-mead', migrationDecision: 'keep' }),
  item({ slug: 'idunn-and-thjazi', zh: '伊登与夏基', en: 'Iðunn and Þjazi', cycle: ['gods-and-treasures', 'loki-cycle'], priority: 'P0', source: 'haustlong', locator: 'st. 1–13', characters: ['character-idunn', 'character-loki', 'character-thjazi'], objects: ['object-norse-idunn-apples'], existingStoryId: 'story-idunn-and-thjazi', migrationDecision: 'rewrite' }),
  item({ slug: 'skadi-compensation', zh: '斯卡蒂的赔偿', en: 'Skaði’s Compensation', cycle: 'gods-and-treasures', priority: 'P0', source: 'proseEddaGylfaginning', locator: 'ch. 23', characters: ['character-skadi', 'character-njordr'], existingStoryId: 'story-skadi-compensation', migrationDecision: 'keep' }),
  item({ slug: 'njordr-and-skadi', zh: '尼约德与斯卡蒂的婚姻', en: 'Njörðr and Skaði', cycle: 'gods-and-treasures', priority: 'P0', source: 'proseEddaGylfaginning', locator: 'ch. 23', characters: ['character-njordr', 'character-skadi'], existingStoryId: 'story-njordr-and-skadi', migrationDecision: 'keep' }),
  item({ slug: 'asgard-wall-and-sleipnir', zh: '阿斯加德城墙与斯莱普尼尔', en: 'The Wall of Asgard and Sleipnir', cycle: ['gods-and-treasures', 'loki-cycle'], priority: 'P0', source: 'proseEddaGylfaginning', locator: 'ch. 42', characters: ['character-loki', 'character-sleipnir'], existingStoryId: 'story-asgard-wall-and-sleipnir', migrationDecision: 'rewrite' }),
  item({ slug: 'sifs-hair-and-treasures', zh: '西芙的头发与诸神宝物', en: 'Sif’s Hair and the Gods’ Treasures', cycle: ['gods-and-treasures', 'loki-cycle'], priority: 'P0', source: 'proseEddaSkaldskaparmal', locator: 'ch. 35', characters: ['character-sif', 'character-loki', 'character-thor', 'character-freyr'], objects: ['object-norse-mjolnir', 'object-norse-skidbladnir', 'object-norse-draupnir'], existingStoryId: 'story-sifs-hair-and-treasures', migrationDecision: 'rewrite' }),
  item({ slug: 'freyr-and-gerdr', zh: '弗雷与葛德', en: 'Freyr and Gerðr', cycle: 'gods-and-treasures', priority: 'P0', source: 'skirnismal', locator: 'st. 1–42', characters: ['character-freyr', 'character-gerdr', 'character-skirnir'], objects: ['object-norse-freyrs-sword'], existingStoryId: 'story-freyr-and-gerdr', migrationDecision: 'retitle' }),

  // Cycle 03 — Odin
  item({ slug: 'odin-and-mimir', zh: '奥丁以一只眼换取智慧', en: 'Odin and Mímir’s Well', cycle: 'odin-cycle', priority: 'P0', source: 'voluspa', locator: 'st. 28', characters: ['character-odin', 'character-mimir'], existingStoryId: 'story-odin-and-mimir', migrationDecision: 'rewrite' }),
  item({ slug: 'odin-on-world-tree', zh: '奥丁悬于世界树九夜', en: 'Odin on the World Tree', cycle: 'odin-cycle', priority: 'P0', source: 'havamal', locator: 'st. 138–141', characters: ['character-odin'], existingStoryId: 'story-odin-world-tree', migrationDecision: 'rewrite' }),
  item({ slug: 'odin-and-vafthrudnir', zh: '奥丁与瓦夫苏鲁德尼尔', en: 'Odin and Vafþrúðnir', cycle: 'odin-cycle', priority: 'P0', source: 'vafthrudnismal', locator: 'st. 1–55', characters: ['character-odin', 'character-vafthrudnir'], existingStoryId: 'story-odin-and-vafthrudnir', migrationDecision: 'keep' }),
  item({ slug: 'grimnir-revealed', zh: '格里姆尼尔的启示', en: 'Grímnir Revealed', cycle: 'odin-cycle', priority: 'P0', source: 'grimnismal', locator: 'st. 1–54', characters: ['character-odin'], existingStoryId: 'story-grimnir-revealed', migrationDecision: 'keep' }),
  item({ slug: 'odin-ravens', zh: '胡金与穆宁', en: 'Huginn and Muninn', cycle: 'odin-cycle', priority: 'P1', source: 'grimnismal', locator: 'st. 20', characters: ['character-odin', 'character-huginn', 'character-muninn'], existingStoryId: 'story-odin-ravens', migrationDecision: 'keep' }),
  item({ slug: 'valholl-and-valkyries', zh: '瓦尔哈拉与女武神', en: 'Valhöll and the Valkyries', cycle: 'odin-cycle', priority: 'P0', source: 'grimnismal', locator: 'st. 8–13, 36', characters: ['character-odin'], existingStoryId: 'story-valholl-and-valkyries', migrationDecision: 'keep' }),
  item({ slug: 'odin-seidr', zh: '奥丁与塞德魔法', en: 'Odin and Seiðr', cycle: 'odin-cycle', priority: 'P1', source: 'ynglingaSaga', locator: 'ch. 7', characters: ['character-odin', 'character-freyja'], existingStoryId: 'story-odin-seidr', migrationDecision: 'keep' }),

  // Cycle 04 — Thor
  item({ slug: 'thor-and-hrungnir', zh: '索尔与赫朗格尼尔', en: 'Thor and Hrungnir', cycle: 'thor-cycle', priority: 'P0', source: 'haustlong', locator: 'st. 14–20', characters: ['character-thor', 'character-hrungnir'], existingStoryId: 'story-thor-and-hrungnir', migrationDecision: 'rewrite' }),
  item({ slug: 'thor-and-hymir', zh: '索尔与海米尔的大锅', en: 'Thor and Hymir’s Cauldron', cycle: 'thor-cycle', priority: 'P0', source: 'hymiskvida', locator: 'st. 1–39', characters: ['character-thor', 'character-hymir'], existingStoryId: 'story-thor-and-hymir', migrationDecision: 'keep' }),
  item({ slug: 'thor-fishes-for-serpent', zh: '索尔垂钓世界蛇', en: 'Thor Fishes for the World Serpent', cycle: 'thor-cycle', priority: 'P0', source: 'hymiskvida', locator: 'st. 17–24', characters: ['character-thor', 'character-jormungandr', 'character-hymir'], existingStoryId: 'story-thor-fishes-for-serpent', migrationDecision: 'rewrite' }),
  item({ slug: 'thryms-stolen-hammer', zh: '雷神之锤被盗', en: 'The Theft of Mjölnir', cycle: 'thor-cycle', priority: 'P0', source: 'thrymskvida', locator: 'st. 1–32', characters: ['character-thor', 'character-loki', 'character-freyja', 'character-heimdall', 'character-thrymr'], objects: ['object-norse-mjolnir'], existingStoryId: 'story-thryms-stolen-hammer', migrationDecision: 'rewrite' }),
  item({ slug: 'thor-and-thjalfi-roskva', zh: '索尔、夏尔菲与罗丝克瓦', en: 'Thor, Þjálfi and Röskva', cycle: 'thor-cycle', priority: 'P1', source: 'proseEddaGylfaginning', locator: 'ch. 44', characters: ['character-thor', 'character-thjalfi', 'character-roskva'], existingStoryId: 'story-thor-and-thjalfi-roskva', migrationDecision: 'keep' }),
  item({ slug: 'thor-and-skrymir', zh: '索尔与斯克里米尔', en: 'Thor and Skrymir', cycle: 'thor-cycle', priority: 'P0', source: 'proseEddaGylfaginning', locator: 'ch. 45', characters: ['character-thor', 'character-loki', 'character-skrymir'], existingStoryId: 'story-thor-and-skrymir', migrationDecision: 'keep' }),
  item({ slug: 'thor-in-utgard', zh: '索尔在乌特加德', en: 'Thor in Útgarða-Loki’s Hall', cycle: 'thor-cycle', priority: 'P0', source: 'proseEddaGylfaginning', locator: 'ch. 46–47', characters: ['character-thor', 'character-loki', 'character-utgarda-loki'], existingStoryId: 'story-thor-in-utgard', migrationDecision: 'rewrite' }),
  item({ slug: 'thor-and-geirrod', zh: '索尔与盖尔罗德', en: 'Thor and Geirröðr', cycle: 'thor-cycle', priority: 'P0', source: 'thorsdrapa', locator: 'selected stanzas', characters: ['character-thor', 'character-geirrod', 'character-gjalp', 'character-greip'], objects: ['object-norse-megingjord', 'object-norse-jarngreipr'], existingStoryId: 'story-thor-and-geirrod', migrationDecision: 'rewrite' }),
  item({ slug: 'thor-and-alviss', zh: '索尔与阿尔维斯', en: 'Thor and Alvíss', cycle: 'thor-cycle', priority: 'P1', source: 'alvissmal', locator: 'st. 1–35', characters: ['character-thor', 'character-alviss'], existingStoryId: 'story-thor-and-alviss', migrationDecision: 'keep' }),
  item({ slug: 'thor-and-harbard', zh: '索尔与哈巴德', en: 'Thor and Hárbarðr', cycle: 'thor-cycle', priority: 'P1', source: 'harbardsljod', locator: 'st. 1–60', characters: ['character-thor', 'character-odin'], existingStoryId: 'story-thor-and-harbard', migrationDecision: 'keep' }),

  // Cycle 05 — Loki
  item({ slug: 'loki-and-angrboda', zh: '洛基与安格尔伯达', en: 'Loki and Angrboða', cycle: 'loki-cycle', priority: 'P0', source: 'proseEddaGylfaginning', locator: 'ch. 34', characters: ['character-loki', 'character-angrboda', 'character-fenrir', 'character-jormungandr', 'character-hel'], existingStoryId: 'story-loki-and-angrboda', migrationDecision: 'keep' }),
  item({ slug: 'fenrir-and-gleipnir', zh: '芬里尔与格莱普尼尔', en: 'Fenrir and Gleipnir', cycle: ['loki-cycle', 'baldr-ragnarok'], priority: 'P0', source: 'proseEddaGylfaginning', locator: 'ch. 34', characters: ['character-fenrir', 'character-tyr'], objects: ['object-norse-gleipnir'], existingStoryId: 'story-fenrir-and-gleipnir', migrationDecision: 'rewrite' }),
  item({ slug: 'lokis-feast', zh: '洛基的宴席争辩', en: 'Loki’s Flyting', cycle: 'loki-cycle', priority: 'P0', source: 'lokasenna', locator: 'st. 1–65', characters: ['character-loki', 'character-odin', 'character-thor', 'character-freyja', 'character-tyr'], existingStoryId: 'story-lokis-feast', migrationDecision: 'rewrite' }),
  item({ slug: 'loki-and-baldr', zh: '洛基与巴德尔之死', en: 'Loki and Baldr’s Death', cycle: ['loki-cycle', 'baldr-ragnarok'], priority: 'P0', source: 'proseEddaGylfaginning', locator: 'ch. 49', characters: ['character-loki', 'character-baldr', 'character-hodr', 'character-frigg'], existingStoryId: 'story-loki-and-baldr', migrationDecision: 'keep' }),
  item({ slug: 'loki-bound', zh: '洛基被捕与束缚', en: 'Loki Bound', cycle: ['loki-cycle', 'baldr-ragnarok'], priority: 'P0', source: 'proseEddaGylfaginning', locator: 'ch. 50', characters: ['character-loki', 'character-sigyn'], existingStoryId: 'story-loki-bound', migrationDecision: 'rewrite' }),
  item({ slug: 'loki-at-ragnarok', zh: '洛基在诸神黄昏', en: 'Loki at Ragnarök', cycle: ['loki-cycle', 'baldr-ragnarok'], priority: 'P0', source: 'voluspa', locator: 'st. 46–51', characters: ['character-loki', 'character-heimdall'], existingStoryId: 'story-loki-at-ragnarok', migrationDecision: 'keep' }),

  // Cycle 06 — Baldr and Ragnarök
  item({ slug: 'baldrs-dreams', zh: '巴德尔的梦', en: 'Baldr’s Dreams', cycle: 'baldr-ragnarok', priority: 'P0', source: 'baldrsDraumar', locator: 'st. 1–14', characters: ['character-baldr', 'character-odin'], existingStoryId: 'story-baldrs-dreams', migrationDecision: 'rewrite' }),
  item({ slug: 'baldrs-death', zh: '巴德尔之死', en: 'Baldr’s Death', cycle: 'baldr-ragnarok', priority: 'P0', source: 'proseEddaGylfaginning', locator: 'ch. 49', characters: ['character-baldr', 'character-hodr', 'character-loki', 'character-frigg'], existingStoryId: 'story-baldrs-death', migrationDecision: 'rewrite' }),
  item({ slug: 'baldrs-funeral', zh: '巴德尔的葬礼', en: 'Baldr’s Funeral', cycle: 'baldr-ragnarok', priority: 'P0', source: 'proseEddaGylfaginning', locator: 'ch. 49', characters: ['character-baldr', 'character-nanna', 'character-thor'], objects: ['object-norse-hringhorni'], existingStoryId: 'story-baldrs-funeral', migrationDecision: 'rewrite' }),
  item({ slug: 'hermod-rides-to-hel', zh: '赫尔莫德前往赫尔', en: 'Hermóðr Rides to Hel', cycle: 'baldr-ragnarok', priority: 'P0', source: 'proseEddaGylfaginning', locator: 'ch. 49', characters: ['character-hermod', 'character-hel', 'character-baldr'], existingStoryId: 'story-hermod-rides-to-hel', migrationDecision: 'rewrite' }),
  item({ slug: 'vali-avenges-baldr', zh: '瓦利为巴德尔复仇', en: 'Váli Avenges Baldr', cycle: 'baldr-ragnarok', priority: 'P1', source: 'voluspa', locator: 'st. 32–33', characters: ['character-vali', 'character-hodr'], existingStoryId: 'story-vali-avenges-baldr', migrationDecision: 'keep' }),
  item({ slug: 'fimbulwinter', zh: '芬布尔之冬', en: 'Fimbulwinter', cycle: 'baldr-ragnarok', priority: 'P0', source: 'voluspa', locator: 'st. 41–45', characters: ['character-fenrir', 'character-jormungandr', 'character-loki'], existingStoryId: 'story-fimbulwinter', migrationDecision: 'rewrite' }),
  item({ slug: 'odin-and-fenrir', zh: '奥丁与芬里尔', en: 'Odin and Fenrir', cycle: 'baldr-ragnarok', priority: 'P0', source: 'voluspa', locator: 'st. 53–54', characters: ['character-odin', 'character-fenrir', 'character-vidarr'], existingStoryId: 'story-odin-and-fenrir', migrationDecision: 'rewrite' }),
  item({ slug: 'thor-and-jormungandr-final-battle', zh: '索尔与世界蛇的最后一战', en: 'Thor and Jörmungandr at Ragnarök', cycle: 'baldr-ragnarok', priority: 'P0', source: 'voluspa', locator: 'st. 56', characters: ['character-thor', 'character-jormungandr'], existingStoryId: 'story-thor-and-jormungandr-final-battle', migrationDecision: 'rewrite' }),
  item({ slug: 'freyr-and-surtr', zh: '弗雷与苏尔特', en: 'Freyr and Surtr', cycle: 'baldr-ragnarok', priority: 'P0', source: 'proseEddaGylfaginning', locator: 'ch. 51', characters: ['character-freyr', 'character-surtr'], objects: ['object-norse-freyrs-sword'], existingStoryId: 'story-freyr-and-surtr', migrationDecision: 'rewrite' }),
  item({ slug: 'tyr-and-garmr', zh: '提尔与加姆', en: 'Týr and Garmr', cycle: 'baldr-ragnarok', priority: 'P1', source: 'proseEddaGylfaginning', locator: 'ch. 51', characters: ['character-tyr', 'character-garmr'], existingStoryId: 'story-tyr-and-garmr', migrationDecision: 'keep' }),
  item({ slug: 'heimdall-and-loki', zh: '海姆达尔与洛基', en: 'Heimdall and Loki', cycle: 'baldr-ragnarok', priority: 'P0', source: 'voluspa', locator: 'st. 46, 51', characters: ['character-heimdall', 'character-loki'], objects: ['object-norse-gjallarhorn'], existingStoryId: 'story-heimdall-and-loki', migrationDecision: 'rewrite' }),
  item({ slug: 'ragnarok-renewal', zh: '世界毁灭、回归与新生', en: 'Destruction, Return and Renewal', cycle: 'baldr-ragnarok', priority: 'P0', source: 'voluspa', locator: 'st. 54–66', characters: ['character-vidarr', 'character-baldr', 'character-hodr'], objects: ['object-norse-naglfar'], existingStoryId: 'story-ragnarok', migrationDecision: 'rewrite' }),

  // Cycle 07 — Völsung / Sigurd / Guðrún / Atli
  item({ slug: 'volsung-and-sword-tree', zh: '沃尔松格与树中神剑', en: 'Völsung and the Sword-Tree', cycle: 'volsung-cycle', priority: 'P0', source: 'volsungaSaga', locator: 'chs. 2–3', characters: ['character-volsung', 'character-sigmund'], existingStoryId: 'story-volsung-and-sword-tree', migrationDecision: 'keep' }),
  item({ slug: 'signy-and-siggeir', zh: '西格妮与西格盖尔', en: 'Signý and Siggeir', cycle: 'volsung-cycle', priority: 'P0', source: 'volsungaSaga', locator: 'chs. 3–8', characters: ['character-signy', 'character-siggeir', 'character-sigmund'], existingStoryId: 'story-signy-and-siggeir', migrationDecision: 'keep' }),
  item({ slug: 'sigmund-and-sinfjotli', zh: '西格蒙德与辛菲奥特利', en: 'Sigmund and Sinfjötli', cycle: 'volsung-cycle', priority: 'P0', source: 'volsungaSaga', locator: 'chs. 7–10', characters: ['character-sigmund', 'character-sinfjotli'], existingStoryId: 'story-sigmund-and-sinfjotli', migrationDecision: 'keep' }),
  item({ slug: 'sigmunds-death-and-hjordis', zh: '西格蒙德之死与希奥尔迪斯', en: 'Sigmund’s Death and Hjördis', cycle: 'volsung-cycle', priority: 'P0', source: 'volsungaSaga', locator: 'chs. 11–12', characters: ['character-sigmund', 'character-hjordis', 'character-sigurd'], existingStoryId: 'story-sigmunds-death-and-hjordis', migrationDecision: 'keep' }),
  item({ slug: 'andvari-gold', zh: '安德瓦里与被诅咒的黄金', en: 'Andvari’s Gold', cycle: 'volsung-cycle', priority: 'P0', source: 'reginsmal', locator: 'st. 1–26', characters: ['character-andvari', 'character-ottr', 'character-hreidmar', 'character-fafnir'], objects: ['object-norse-andvaranaut'], existingStoryId: 'story-andvari-gold', migrationDecision: 'keep' }),
  item({ slug: 'sigurd-and-regin', zh: '西格尔德与雷金', en: 'Sigurd and Regin', cycle: 'volsung-cycle', priority: 'P0', source: 'reginsmal', locator: 'st. 1–40', characters: ['character-sigurd', 'character-regin'], objects: ['object-norse-gram'], existingStoryId: 'story-sigurd-and-regin', migrationDecision: 'rewrite' }),
  item({ slug: 'sigurd-kills-fafnir', zh: '西格尔德斩杀法夫纳', en: 'Sigurd Slays Fafnir', cycle: 'volsung-cycle', priority: 'P0', source: 'fafnismal', locator: 'st. 1–44', characters: ['character-sigurd', 'character-fafnir', 'character-regin'], objects: ['object-norse-gram', 'object-norse-andvaranaut'], existingStoryId: 'story-sigurd-kills-fafnir', migrationDecision: 'rewrite' }),
  item({ slug: 'sigurd-and-sigrdrifa', zh: '西格尔德与西格德里法', en: 'Sigurd and Sigrdrífa', cycle: 'volsung-cycle', priority: 'P0', source: 'sigrdrifumal', locator: 'st. 1–37', characters: ['character-sigurd', 'character-brynhildr'], existingStoryId: 'story-sigurd-and-sigrdrifa', migrationDecision: 'keep' }),
  item({ slug: 'sigurd-and-brynhildr', zh: '西格尔德与布伦希尔德', en: 'Sigurd and Brynhildr', cycle: 'volsung-cycle', priority: 'P0', source: 'volsungaSaga', locator: 'chs. 20–27', characters: ['character-sigurd', 'character-brynhildr'], existingStoryId: 'story-sigurd-and-brynhildr', migrationDecision: 'rewrite' }),
  item({ slug: 'sigurds-death', zh: '西格尔德之死', en: 'The Death of Sigurd', cycle: 'volsung-cycle', priority: 'P0', source: 'sigurdarkvida', locator: 'fragmentary poems; scoped comparison with saga', characters: ['character-sigurd', 'character-brynhildr', 'character-gudrun', 'character-gunnar', 'character-hogni'], existingStoryId: 'story-sigurds-death', migrationDecision: 'rewrite' }),
  item({ slug: 'gudrun-and-atli', zh: '古德伦与阿特利', en: 'Guðrún and Atli', cycle: 'volsung-cycle', priority: 'P0', source: 'atlakvida', locator: 'st. 1–46', characters: ['character-gudrun', 'character-atli', 'character-gunnar', 'character-hogni'], existingStoryId: 'story-gudrun-and-atli', migrationDecision: 'keep' }),
  item({ slug: 'gudrun-svanhild-hamdir-sorli', zh: '古德伦、斯万希尔德与哈姆迪尔兄弟', en: 'Guðrún, Svanhildr, Hamðir and Sörli', cycle: 'volsung-cycle', priority: 'P1', source: 'hamdismal', locator: 'st. 1–30', characters: ['character-gudrun', 'character-svanhildr', 'character-hamdir', 'character-sorli'], existingStoryId: 'story-gudrun-svanhild-hamdir-sorli', migrationDecision: 'keep' }),

  // Cycle 08 — Helgi
  item({ slug: 'helgi-hjorvardsson-and-svava', zh: '赫尔吉·希奥尔瓦尔松与斯瓦瓦', en: 'Helgi Hjörvarðsson and Sváfa', cycle: 'helgi-cycle', priority: 'P1', source: 'helgakvidaHjorvardssonar', locator: 'st. 1–51', characters: ['character-helgi-hjorvardsson', 'character-svava'], existingStoryId: 'story-helgi-hjorvardsson-and-svava', migrationDecision: 'keep' }),
  item({ slug: 'helgi-hundingsbani', zh: '赫尔吉·洪丁斯巴尼', en: 'Helgi Hundingsbani', cycle: 'helgi-cycle', priority: 'P1', source: 'helgakvidaHundingsbana1', locator: 'st. 1–57', characters: ['character-helgi-hundingsbani', 'character-sigrun', 'character-sinfjotli'], existingStoryId: 'story-helgi-hundingsbani', migrationDecision: 'keep' }),
  item({ slug: 'helgi-and-sigrun', zh: '赫尔吉与西格伦', en: 'Helgi and Sigrún', cycle: 'helgi-cycle', priority: 'P1', source: 'helgakvidaHundingsbana2', locator: 'st. 1–51', characters: ['character-helgi-hundingsbani', 'character-sigrun'], existingStoryId: 'story-helgi-and-sigrun', migrationDecision: 'keep' }),
  item({ slug: 'helgi-burial-mound', zh: '赫尔吉的葬丘与归来', en: 'Helgi’s Burial Mound', cycle: 'helgi-cycle', priority: 'P1', source: 'helgakvidaHundingsbana2', locator: 'st. 39–51', characters: ['character-helgi-hundingsbani', 'character-sigrun'], existingStoryId: 'story-helgi-burial-mound', migrationDecision: 'keep' }),

  // Cycle 09 — independent traditions
  item({ slug: 'volundr-captive-smith', zh: '沃伦德：被囚的铁匠', en: 'Völundr the Captive Smith', cycle: 'independent-eddic', priority: 'P1', source: 'volundarkvida', locator: 'st. 1–19', characters: ['character-volundr', 'character-nidudr'], existingStoryId: 'story-volundr-captive-smith', migrationDecision: 'keep' }),
  item({ slug: 'volundr-escape', zh: '沃伦德的逃离', en: 'Völundr’s Escape', cycle: 'independent-eddic', priority: 'P1', source: 'volundarkvida', locator: 'st. 20–41', characters: ['character-volundr', 'character-bodvildr'], existingStoryId: 'story-volundr-escape', migrationDecision: 'keep' }),
  item({ slug: 'svipdagr-and-mengloth', zh: '斯维普达格与孟格洛德', en: 'Svipdagr and Menglöð', cycle: 'independent-eddic', priority: 'P1', source: 'svipdagsmal', locator: 'Grógaldr and Fjölsvinnsmál; editorial split to be reviewed', characters: ['character-svipdagr', 'character-groa', 'character-mengloth'], existingStoryId: 'story-svipdagr-and-mengloth', migrationDecision: 'keep' }),
  item({ slug: 'rig-and-social-orders', zh: '里格与社会秩序', en: 'Rígr and Social Orders', cycle: 'independent-eddic', priority: 'P2', source: 'rigsthula', locator: 'selected stanzas', characters: ['character-rigr'], existingStoryId: 'story-rig-and-social-orders', migrationDecision: 'keep' }),
  item({ slug: 'grottasongr', zh: '格罗蒂之歌', en: 'Grottasöngr', cycle: 'independent-eddic', priority: 'P2', source: 'grottasongr', locator: 'selected stanzas', existingStoryId: 'story-grottasongr', migrationDecision: 'keep' }),
];

export const norseStoryCycles = [
  'creation', 'gods-and-treasures', 'odin-cycle', 'thor-cycle', 'loki-cycle', 'baldr-ragnarok', 'volsung-cycle', 'helgi-cycle', 'independent-eddic',
] as const;
