import type { SourceRef, StorySeriesManifest } from '../../lib/content/types';

const mythologyId = 'myth-norse';

const poeticEdda: SourceRef = {
  sourceId: 'source-norse-poetic-edda',
  type: 'primary-text',
  title: 'Poetic Edda',
  period: '中世纪抄本记录',
  language: 'non',
  locator: '《诸神黄昏》相关诗篇与诗节',
  note: '系列叙事以诗体埃达中关于诸神黄昏的材料作为主要来源范围。',
};

const proseEdda: SourceRef = {
  sourceId: 'source-norse-prose-edda',
  type: 'primary-text',
  title: 'Snorri Sturluson, Prose Edda',
  period: '13世纪',
  language: 'non',
  locator: 'Gylfaginning',
};

export const norseStorySeries: readonly StorySeriesManifest[] = [
  {
    id: 'series-norse-ragnarok',
    slug: 'ragnarok',
    mythologyId,
    name: '诸神黄昏',
    nameEn: 'Ragnarök',
    summary: '从芬布尔之冬到世界再生，沿着预言、宿敌与旧秩序的崩解阅读北欧神话的末日篇章。',
    narrativeThesis: '诸神黄昏不是孤立的一场大战，而是天气、誓约、亲缘和预言共同累积后，旧世界被迫让位于新世界的过程。',
    version: '1.0.0',
    scope: ['芬布尔之冬', '诸神黄昏中的核心冲突', '世界毁灭、回归与新生'],
    exclusions: ['沃尔松格英雄传统', '未有明确来源定位的现代改编设定'],
    storyRefs: [
      { storyId: 'story-fimbulwinter', role: 'core', order: 1 },
      { storyId: 'story-odin-and-fenrir', role: 'core', order: 2 },
      { storyId: 'story-thor-and-jormungandr-final-battle', role: 'core', order: 3 },
      { storyId: 'story-freyr-and-surtr', role: 'core', order: 4 },
      { storyId: 'story-heimdall-and-loki', role: 'core', order: 5 },
      { storyId: 'story-ragnarok', role: 'core', order: 6 },
    ],
    characterIds: [
      'character-odin', 'character-fenrir', 'character-vidarr', 'character-thor',
      'character-jormungandr', 'character-freyr', 'character-surtr', 'character-heimdall', 'character-loki',
    ],
    worldIds: ['world-midgard', 'world-asgard', 'world-jotunheim', 'world-muspell'],
    sceneIds: ['scene-fimbulwinter-field', 'scene-midgard-coast', 'scene-muspell-flame-border', 'scene-bifrost'],
    conceptIds: [],
    keyMoments: [
      { id: 'ragnarok-winter', title: '芬布尔之冬', summary: '漫长冬季让末日先以气候和道路的方式进入日常。', storyId: 'story-fimbulwinter', worldId: 'world-midgard', sceneId: 'scene-fimbulwinter-field', status: 'source-backed' },
      { id: 'ragnarok-wolf', title: '芬里尔挣脱束缚', summary: '早先的恐惧与束缚在末日中回到叙事中心。', storyId: 'story-odin-and-fenrir', characterIds: ['character-odin', 'character-fenrir', 'character-vidarr'], status: 'source-backed' },
      { id: 'ragnarok-thor-serpent', title: '雷神与世界蛇', summary: '宿敌完成彼此的最后一次相遇，胜负与代价同时发生。', storyId: 'story-thor-and-jormungandr-final-battle', characterIds: ['character-thor', 'character-jormungandr'], sceneId: 'scene-midgard-coast', status: 'source-backed' },
      { id: 'ragnarok-renewal', title: '火焰之后仍有世界', summary: '毁灭不是唯一终点，幸存者与归来的神祇开启新的时间。', storyId: 'story-ragnarok', worldId: 'world-midgard', status: 'source-backed' },
    ],
    sourceRefs: [poeticEdda, proseEdda],
    traditionLanes: [
      { id: 'poetic-edda-ragnarok', label: '诗体埃达传统', period: '中世纪抄本记录', sourceRefs: [poeticEdda], status: 'supported' },
      { id: 'prose-edda-ragnarok', label: '斯诺里整理传统', period: '13世纪', sourceRefs: [proseEdda], status: 'supported' },
    ],
    visualAnchors: ['世界树与九界的垂直尺度', '极寒、海潮与火焰的三重边界', '预言压力下仍保持身份锚点的神灵'],
    visualAvoid: ['把诸神黄昏处理成无来源的末日科幻', '把北欧神话角色替换为现代影视或游戏改编形象', '用一张泛化战斗海报代替故事顺序'],
    review: {
      reviewer: 'MythCanvas Editorial',
      reviewedAt: '2026-09-01',
      notes: ['V1 先覆盖 6 篇核心 Story；Collection 尚未开放。', '页面入口服务于阅读与世界探索，不承诺实体商品。'],
    },
    status: 'published',
  },
];
