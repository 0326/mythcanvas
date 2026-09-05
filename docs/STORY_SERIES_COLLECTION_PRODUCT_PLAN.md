# MythCanvas 故事系列与收藏卡产品方案

> 文档状态：Product Strategy + Implementation Blueprint
> 版本：V1.1
> 日期：2026-09-05
> 适用范围：神话内容建设、故事系列策展、AI 视觉生产、数字典藏包、实体收藏卡
> 上位文档：`docs/PRODUCT.md`、`docs/CONTENT_POSITIONING.md`、`docs/CHARACTER_ART_SYSTEM.md`

---

# 0. 结论

MythCanvas 后续内容与商业化不应从“先生成一批漂亮图片，再把图片印成卡”出发，而应建立一条稳定的 **Story First → Collection Later** 产品链路：

```text
神话体系 Mythology
    ↓
故事系列 Story Series / Story Cycle
    ↓
系列内核 Series Bible
    ↓
单篇故事 MythStory + 神灵 / 神域 / 场景 / 神器 / 神兽
    ↓
系列视觉策展 Series Art Direction
    ↓
画风版本 Style Edition
    ↓
数字典藏包 Digital Collection
    ↓
实体收藏卡 Physical Collection
```

核心原则：

1. **先有完整故事体系，再有收藏卡。** 收藏卡是内容资产的衍生物，不反过来绑架神话内容建设。
2. **系列内核与画风正交。** 同一个故事系列可以有 Cinematic、Anime、Sacred、Ink 等不同视觉版本，但人物关系、故事节点、神域、神器和叙事结构保持一致。
3. **每套卡必须讲完一个明确的叙事范围 / 故事弧。** 不能只是若干“热门角色 + 好看图片”的散卡拼盘，也不能把有限卡组冒充整个 Series 的完整覆盖。
4. **收藏价值首先来自体系、内容和美术质量。** V1 不依赖盲抽、稀有度、交易市场、NFT、数字绑定等复杂机制。
5. **网站内容是收藏卡的源头和长期资产库。** 故事系列先在网站成立，数字典藏与实体卡再从成熟系列中自然产出。
6. **尊重神话来源和版本差异。** 不为了做“宇宙时间线”把不同年代、宗教传统、文学演绎硬拼成唯一 Canon。

MythCanvas 的目标不是成为“AI 图片卡牌厂商”，而是逐步建立：

> **可阅读、可观看、可收藏、可反复视觉化的神话故事系列 IP。**

本方案的实施边界进一步明确为：

1. `Story Series` 是版本化静态内容中的一等对象，不因拥有 URL、SEO 或收藏功能而进入 D1；D1 只保存用户行为、运营状态和兼容镜像。
2. `TaxonomyTerm(kind = story-cycle)` 是分类或来源范围，不自动等于可发布的 Story Series；是否成为 Series 由 `StorySeriesManifest` 的内容、来源和审核门槛决定。
3. 一套 Collection 只承诺讲完一个明确声明的“叙事范围 / 故事弧”，不声称覆盖整个 Series 的全部故事。
4. 先上线一个可阅读的试点 Series，再用真实的阅读、收藏、下载和购买意向决定是否投入 18–24 张实体套卡。
5. 所有状态、关系、来源和卡片约束必须能在构建期自动校验；人工审核负责来源解释、文化边界和最终美术质量。

---

# 1. 背景与问题

## 1.1 当前产品已经具备的基础

MythCanvas 当前已经建立了：

- `Mythology` 神话体系；
- `MythStory` 图文故事；
- `Character` 神灵 / 英雄；
- `World / Scene` 神域与场景；
- `CanonicalDesign` 角色 / 神域稳定设计；
- `Civilization Visual DNA` 文明视觉约束；
- `Style` 画风系统；
- `Artwork` 视觉作品；
- Guided AI Creator；
- 结构化内容包、来源和内容校验机制。

`docs/CONTENT_POSITIONING.md` 已明确：

> 「神话」负责讲述“发生了什么”，Mythology 详情应以 MythStory 图文叙事为主体，而不是另一个 Character / World / Artwork 聚合页。

这个方向应继续深化，而不是绕开故事体系直接做卡牌商品。

## 1.2 当前缺失的关键层

目前 `Mythology → MythStory` 已经能表达“一个神话体系有哪些故事”，但对于后续产品化仍缺少一个更稳定的 **故事系列内核**：

- 哪几篇故事属于同一个可持续经营的主题系列；
- 这个系列的核心冲突、人物关系和世界结构是什么；
- 哪些角色 / 神域 / 神器 / 神兽是系列必需资产；
- 哪些内容是古代来源，哪些是后世文学、民间传说或编辑策展；
- 哪些关键场景最值得视觉化；
- 不同画风下哪些身份锚点必须保持；
- 当系列成熟时，如何自然映射为一套数字 / 实体收藏卡。

如果没有这一层，AI 出图极易出现：

- 单张精美，但整套互相无关；
- 人物、服装、神域风格不一致；
- 为凑卡数塞入与故事无关的角色；
- 一套卡缺少开端、冲突、高潮和结尾；
- 同一角色不同卡面身份漂移；
- 不同系列重复消费同一批“热门神”；
- 神话事实与现代视觉幻想混在一起；
- 第二套画风需要从头重新设计内容。

因此必须先建立 **Series Core / Series Bible**。

---

# 2. 产品目标与非目标

## 2.1 产品目标

### G1：把网站神话内容从“若干故事”升级成“可持续经营的故事系列”

用户不仅知道中国神话里有《盘古开天》《女娲补天》《嫦娥奔月》，还可以明确进入某个完整主题系列持续阅读和探索。

### G2：建立可复用的系列内核

同一 Series Core 可以服务：

```text
网站长阅读
→ 系列专题页
→ 角色 / 神域关系
→ Story 插画
→ 壁纸
→ AI 创作上下文
→ 数字典藏包
→ 实体收藏卡
```

### G3：让不同画风只改变视觉表达，不改变故事内容

```text
Series Core = what / who / where / why
Style       = how it looks
Collection  = how it is curated and packaged
```

### G4：让实体收藏卡真正具有“成套收藏”的理由

一套卡应该让用户感受到：

> 我收藏的是一个完整的神话故事世界，而不是 24 张 AI 美图。

## 2.2 V1 非目标

V1 明确不做：

- TCG 对战规则；
- 卡牌数值和平衡；
- 盲抽 / Booster Pack；
- N / R / SR / SSR / UR 复杂稀有度体系；
- 二级交易市场；
- NFT / 区块链；
- 实体卡扫码绑定、链上确权；
- 复杂限量编号经济；
- 创作者分账市场；
- 大规模库存和渠道铺货。

这些都不是验证“故事系列收藏价值”的必要条件。

---

# 3. 核心领域模型

## 3.1 产品层级

推荐统一为：

```text
Mythology
└── Story Series × N
    ├── MythStory × N
    ├── Character × N
    ├── World（用户界面称“神域”）× N
    ├── Scene × N
    ├── Artifact / Creature（V1 可为结构化概念）× N
    └── Collection × N
        └── Style Edition × N
```

注意：这里的 `Story Series` 是产品概念，不等于强制创建一个新的数据库实体。

## 3.2 Volume、Story Series、Collection 必须分开

这是本方案最重要的模型边界之一。

### Volume：阅读编排

当前 `MythStory.volumeId / volumeTitle` 继续承担：

> **一个 Mythology 页面里如何把故事分卷、排序和阅读。**

例如：

```text
中国神话
├── 卷一 · 创世与天地
├── 卷二 · 日月与天象
├── 卷三 · 神与英雄
└── 卷四 · 神域与异境
```

Volume 是 Editorial Navigation，不必天然成为商业系列。

### Story Series：内容内核

Story Series 回答：

> **哪些故事、人物、空间和事件共同构成一个有明确主题、可以持续视觉化和收藏的故事单元？**

例如概念上可以有：

- 月宫与月神故事系列；
- 奥林匹斯诸神系列；
- 英雄与怪物系列；
- 世界树九界系列；
- 诸神黄昏系列；
- 高天原神代系列；
- 杜阿特冥界旅程系列。

Story Series 不要求绝对时间线，也不要求每篇 Story 只能属于一个 Series。技术上，Series Manifest 持有 Story 引用，并在构建期生成 Story → Series 反向索引；不在 `MythStory` 中加入单一 `seriesId`。

### Collection：商品 / 视觉策展结果

Collection 回答：

> **基于某个已经成熟的 Story Series，这一次我们选择哪些内容，以什么画风和视觉规范组成一套收藏品？**

因此：

```text
Story Series 1
├── Cinematic Collection
├── Anime Collection
├── Sacred Collection
└── Ink Collection
```

Collection 不能反向修改 Series Core 的神话事实。

---

# 4. Story Series 技术落地策略

## 4.1 不立即重复造一个与现有 Volume 重叠的模型

当前类型系统已经存在：

```ts
TaxonomyKind =
  | 'lineage'
  | 'domain'
  | 'story-cycle'
  | 'editorial-collection'
```

因此 P0 推荐先利用：

```text
TaxonomyTerm(kind = story-cycle)
+
Series Manifest / Series Bible
+
MythStory / Entity relations
```

来验证系列化内容生产。

这里需要明确两个边界：

- `TaxonomyTerm(kind = story-cycle)` 是分类、来源范围或浏览入口，不自动拥有 Series 的叙事主轴、依赖闭包和商品化资格；
- `StorySeriesManifest` 是经过策展和审核的静态内容对象，负责关系、叙事顺序、来源策略、视觉锚点和发布状态。

避免一开始增加 `StorySeries` 数据表，却只重复存 `volumeTitle / summary / order`。V1 直接使用版本化的静态 Manifest；必要时再把它同步为 D1 兼容镜像。

## 4.2 什么时候升级为第一类 StorySeries 内容对象

当系列需要以下任意 2～3 项能力时，将其从临时分类提升为版本化静态内容中的第一类对象：

- 系列拥有独立稳定 URL；
- 一个系列关联 5+ MythStory；
- 需要多语言系列内容；
- 系列拥有独立 Hero / SEO / OG；
- 系列拥有多个 Collection Edition；
- 用户可以收藏 / 关注整个系列；
- 系列需要独立发布状态和版本控制；
- 后台需要针对系列进行运营和统计。

这不是“迁移到 D1”的触发条件。公共 Series 页面、搜索、关系图、生成上下文和 sitemap 仍必须在没有 D1 时正常工作；D1 仅可作为后台运营或过渡期镜像。

建议目标模型：

```ts
StorySeries {
  id
  mythologyId
  slug
  name
  nameEn
  summary
  narrativeThesis
  heroArtworkId?
  storyIds[]
  characterIds[]
  worldIds[]
  sceneIds[]
  conceptIds[]
  sourceRefs[]
  traditionLanes
  seriesBible
  version
  status
}
```

拥有稳定 URL 的 Series 默认进入静态内容目录，并不需要等待 5 篇 Story 或多个 Edition 才发布；是否展示 Collection 由 Collection 自身状态决定。

---

# 5. Series Bible：每个系列必须先完成的“内核”

任何 Story Series 在进入“系列出图 / 收藏卡生产”之前，必须有一份完整 Series Bible。

## 5.1 基本身份

必须包含：

- `seriesId`；
- 中文名 / 英文名；
- 所属 Mythology；
- 系列一句话定义；
- 系列主题；
- 情绪基调；
- 推荐阅读对象；
- 系列范围；
- 明确不包含的内容。

示例：

```text
系列：诸神黄昏
主题：秩序终结、命运、毁灭与新生
范围：预兆 → 阵营 → 关键冲突 → 世界毁灭 → 新生
非目标：把全部北欧神话都塞进这一系列
```

## 5.2 叙事主轴 Narrative Spine

一个可收藏系列不能只是实体清单，必须有可概括的叙事主轴：

```text
起点
→ 秩序 / 世界状态
→ 触发事件
→ 核心人物进入
→ 冲突升级
→ 标志性事件
→ 高潮
→ 结果 / 余韵
```

不是所有神话都适合现代三幕剧，不要求强行重写原典；这里的目标是明确“用户沿着什么叙事路径理解这一组内容”。

## 5.3 Story Map

列出：

- 核心 Story：缺失则系列不能发布；
- 支撑 Story：补充关系或背景；
- 可选 Story：扩展阅读；
- 跨系列 Story：允许被其他系列再次引用。

推荐标记：

```text
CORE
SUPPORTING
OPTIONAL
CROSS_SERIES
```

## 5.4 Character Cast

每个核心角色记录：

- 系列中的身份；
- 与主轴的关系；
- 阵营 / 关系；
- 必须出现在哪些 Story；
- CanonicalDesign 是否已经完成；
- 视觉身份锚点；
- 容易误画 / 混淆的点；
- 是否具备收藏卡候选价值。

不要按“角色热度”决定是否加入一个系列，而要按故事必要性。

## 5.5 World / Scene Map

定义：

- 核心神域；
- 场景发生地点；
- 空间之间的关系；
- 每个空间的稳定视觉锚点；
- 哪些 Scene 属于叙事事件，哪些属于纯环境设定。

## 5.6 Artifact / Creature Map

收藏卡非常适合神器和神兽，但必须先证明它们属于故事，而不是为凑卡种硬加。

每个对象记录：

- 来源；
- 所属角色 / 场景；
- 叙事功能；
- 稳定识别元素；
- 是否值得独立视觉化。

P0 如果 `Artifact / Creature` 尚未成为第一类实体，可以先作为 Series Manifest 中的结构化对象维护，不要求立即扩数据库。

V1 的 Artifact 不应被伪装成当前领域模型中已经存在的独立实体。若它尚未拥有独立来源、稳定身份锚点、多个故事引用或独立页面，就使用 `ContentConcept` 或 Manifest 内部对象；只有满足这些条件后，才单独扩展实体和关系类型。Creature 若需要视觉化，可继续使用现有 `Artwork.type = 'creature'`，不要因此把 Artwork 与叙事实体混为一谈。

## 5.7 Source & Canon Policy

这是系列质量的底线。

每个系列必须明确：

- 主要来源；
- 不同来源年代；
- 古代神话 / 宗教传统 / 民间传说 / 古典文学 / 后世流变；
- 冲突版本；
- MythCanvas 当前采用的讲述范围；
- 哪些是 `supported`；
- 哪些是 `contested`；
- 哪些是 `editorial-synthesis`。

实施时不要只维护一组自由文本 `sourcePolicy`。Series 必须引用现有的 `SourceRef` / `ContentClaim` 体系，并为每条关键叙事主张保留来源定位、传统范围和审核状态。建议增加：

```ts
sourceRefs: readonly SourceRef[];
traditionLanes: readonly {
  id: string;
  label: string;
  period?: string;
  sourceRefs: readonly SourceRef[];
  status: 'supported' | 'contested' | 'editorial-synthesis';
}[];
review: {
  reviewer: string;
  reviewedAt: string;
  notes?: readonly string[];
};
```

Series 的 `review` 是编辑责任记录，不代表来源本身已经形成学术共识。不同传统发生冲突时，应在页面和卡背中保持范围说明，而不是用一个全局 Canon 字段覆盖差异。

禁止：

- 为了系列完整强造不存在的统一古代时间线；
- 把晚出的文学角色关系写成远古唯一原典；
- 把不同宗教体系中同名概念直接等同；
- 为卡面需求发明“神器”“神兽”并伪装成传统神话事实。

## 5.8 Series Visual Anchors

Series Bible 只定义跨画风稳定的 **内容视觉锚点**，不指定具体 rendering style。

例如：

- 必须出现的文化符号；
- 关键角色身份符号；
- 神域建筑逻辑；
- 重要神器形态约束；
- 典型天气 / 时间 / 自然元素；
- 禁止出现的现代 IP 视觉借用；
- 文化误用风险。

## 5.9 Key Moments / Mother Scenes

每个系列建议预先定义 6～12 个“母场景”。

母场景是后续 Story 插画、壁纸、收藏卡都可以复用的高价值视觉节点，例如：

- 世界第一次出现；
- 主角首次登场；
- 神器被获得；
- 阵营对峙；
- 仪式 / 宴会；
- 战争前夜；
- 标志性神迹；
- 高潮事件；
- 结局后的世界。

这是“故事 → 视觉资产”的关键桥梁。

母场景必须区分：

- `source-backed`：可以在故事或来源中定位；
- `editorial-synthesis`：为了阅读或视觉连贯而做的编辑性组合。

后者可以用于 Artwork，但不得在卡背中写成原典明确记载的单一事件。

---

# 6. 系列内核与画风必须正交

## 6.1 四层视觉约束

后续 Collection 出图遵循：

```text
Civilization Visual DNA
        ↓
Series Core Visual Anchors
        ↓
Character / World Canonical Design
        ↓
Style Edition Art Direction
```

其中：

### Civilization Visual DNA

回答：

> 这是哪个文明？

### Series Core

回答：

> 这是哪个故事世界、哪个时期 / 主题、哪些视觉母题？

### Canonical Design

回答：

> 这个人 / 神域到底是谁？

### Style Edition

回答：

> 这次用什么美术语言表现？

## 6.2 Style Edition 可以改变

允许改变：

- 渲染媒介；
- 笔触；
- 真实度；
- 色彩表达；
- 镜头语言；
- 纹理；
- 动画 / 漫画 / 电影感；
- 卡面装饰语言。

## 6.3 Style Edition 不可以改变

不得为了画风改变：

- 神话角色身份；
- 角色核心符号；
- 核心人物关系；
- 事件事实；
- 神域空间身份；
- 神器归属；
- Series Narrative Spine。

因此同一个 Series 可以安全衍生多套视觉 Collection，而不需要重新编故事。

---

# 7. 网站产品形态

## 7.1 Mythology 页面仍然以 Story 为主体

保持 `docs/CONTENT_POSITIONING.md` 原则：

```text
Mythology Hero
→ 卷目 / 主题阅读
→ MythStory
→ Character / World 上下文
→ 来源与版本说明
```

不把 Mythology 页面重新做成 Collection 商店。

## 7.2 增加“故事系列”策展入口

当某 Mythology 至少有 1 个 `published` Series 时，即可在 Mythology 页面增加轻量的系列入口；只有 2 个以上时才展开为系列列表：

```text
故事系列
├── Series A
├── Series B
└── Series C
```

但系列入口服务的是 **阅读和世界探索**，不是先卖卡。`draft` 和 `content-ready` Series 不进入公共页面。

## 7.3 Series Page

当系列状态为 `published` 且拥有稳定的 Series Manifest 后，使用稳定路由：

```text
/mythology/{mythologySlug}/series/{seriesSlug}/
```

页面目标：

> 让用户在 3～5 分钟内理解这个系列讲什么、有哪些关键人物和事件，并继续深入 Story。

推荐结构：

```text
Series Hero
→ 一句话主轴
→ Story Journey / 故事阅读顺序
→ 核心角色
→ 核心神域
→ Key Moments
→ 推荐 Artwork
→ Related Series
→ Collection（仅成熟后出现）
```

注意：Series Page 是策展入口，不替代完整 MythStory 阅读。

Collection 成熟后使用独立路由，不在 Series Page 中直接承担购买流程：

```text
/mythology/{mythologySlug}/series/{seriesSlug}/collection/{collectionSlug}/
```

页面最小闭环为：

```text
Series Page
→ Collection Preview
→ Collection Page
→ Card 翻看 / 故事跳转
→ 下载、收藏、分享
→ 实体收藏意向 / 预售入口
```

V1 的实体销售可以先接候补名单或预售表单，不应在没有成本、售价、库存和履约方案前直接承诺完整电商能力。

## 7.4 Story Detail

继续沿用现有 Story 独立 URL 门槛和 SSR 原则。

Story 应增加可选系列上下文：

```text
属于：诸神黄昏系列
上一篇 / 下一篇（按 Series 阅读顺序）
系列进度
```

但一个 Story 可以属于多个 Series，不能用单一 `seriesId` 锁死。

---

# 8. 从 Story Series 到 Collection

## 8.1 Collection 的定义

Collection 是：

> **对一个成熟 Story Series 的明确叙事范围，在某一种 Style Edition 下进行的有限视觉策展。**

唯一性建议由以下三者决定：

```text
Collection = Series + Style + Edition
```

实际唯一性还必须包含版本快照：

```text
Collection = Series Version + Style Version + Edition
```

一旦进入公开展示或印刷，Collection Manifest 应冻结；Series 或 Style 的后续修改只能产生新版本，不能静默改变已发布卡面。

例如：

```text
Series: Olympus Gods
Style: Sacred Illustration
Edition: Collection 01
```

以后可以再出：

```text
Olympus Gods × Anime
Olympus Gods × Cinematic
Olympus Gods × Marble Engraving
```

故事不变，视觉 Edition 改变。

## 8.2 数字典藏包与实体套卡使用同一 Manifest

不要维护两个不同 Card List。

```text
Collection Manifest
├── Card 01
├── Card 02
├── ...
└── Card 24
        ↓
Digital Package
        ↓
Physical Print Layout
```

数字和实体使用同一核心内容：

- cardId；
- 标题；
- subject；
- story relation；
- artwork；
- 卡背文案；
- 来源 / 版权元数据。

数字和实体不必共享全部表现字段。实体化在同一核心 Manifest 上增加：

- bleed；
- safe area；
- CMYK / print profile；
- foil / UV mask；
- packaging metadata。

数字版可以增加更长的故事说明、高清原图、交互翻卡和多语言内容；实体版必须增加裁切、色彩、法律文案和包装信息。两者通过同一 `cardId` 和 `artworkId` 保持可追溯关系。

---

# 9. Collection Card List 设计原则

## 9.1 卡牌不是按“对象类型平均分配”

不要机械规定所有系列必须：

```text
8 Character + 4 World + 4 Scene + 4 Concept / Artifact + 4 Creature
```

不同神话系列结构不同。

正确原则是：

> **卡组结构服务故事覆盖，而不是故事迁就固定卡组。**

例如诸神黄昏天然适合事件 / 对峙卡更多；月宫系列可能角色较少、意象 / 场景更多。

## 9.2 V1 推荐规模

实体试点建议：

**18～24 张 / 套。**

原因：

- 足够形成完整收藏体验；
- 又不会为了凑 50 张卡稀释质量；
- 打样、审核、统一调色和印刷成本可控；
- 适合做固定套装而非盲抽。

规模是推荐值，不是神话内容硬约束。

## 9.3 每套卡必须覆盖的叙事角色

无论具体卡种如何，一套 Collection 的已声明叙事范围至少回答：

1. **世界从哪里开始？**
2. **主要人物是谁？**
3. **他们在哪里？**
4. **什么事件推动故事？**
5. **最重要的象征物是什么？**
6. **核心冲突 / 神迹是什么？**
7. **高潮是什么？**
8. **故事留下了什么？**

推荐的卡片 Narrative Role：

```text
OPENING
WORLD
CHARACTER
RELATION
ARTIFACT
OMEN
CONFLICT
KEY_MOMENT
CLIMAX
AFTERMATH
EPILOGUE
COLLECTION_COVER
```

一张卡可以同时属于 `CHARACTER + KEY_MOMENT`，不需要把类型做成僵硬枚举。

---

# 10. 卡牌内容规范

## 10.1 正面

收藏卡正面优先展示视觉作品：

- Artwork 为绝对主体；
- 卡框克制；
- 标题和系列编号不遮挡主视觉；
- 不在生成图片内部让模型绘制文字；
- Logo、编号、卡名全部由排版层生成；
- AI 只负责无文字原始 Artwork。

建议显示：

```text
MythCanvas
Card Title
Series Code / Card No.
```

## 10.2 背面

卡背承担轻量知识与收藏上下文，不写成百科页面。

建议：

```text
中文名 / English Name
系列
卡号 07 / 24
Narrative Role
一句故事说明
相关角色 / 神域
来源性质
MythCanvas Collection
```

一句故事说明建议 40～100 字。

## 10.3 编号

推荐稳定、非稀有度导向：

```text
MC-{MYTHOLOGY}-{SERIES}-{CARD}
```

例如：

```text
MC-CN-MOON-01
MC-GR-OLYM-07
MC-NO-RAGN-18
```

用户看到编号即可知道它属于哪个系列以及是否集齐；如果该套只覆盖 Series 的一个故事弧，应在 Collection 页面明确显示覆盖范围，不把“集齐卡”暗示为“读完整个系列”。

---

# 11. Collection Art Bible

Series Bible 解决“讲什么”；Collection Art Bible 解决“这一套怎么看起来是一套”。

每个 Style Edition 必须独立建立 Collection Art Bible。

## 11.1 必备字段

### Rendering Style

- Cinematic / Anime / Sacred / Ink / 其他；
- 真实度；
- 媒介语言；
- 纹理；
- 细节密度。

### Palette

定义：

- 主色；
- 辅色；
- Accent；
- 禁止色；
- 不同叙事阶段允许的色温变化。

### Lighting

例如：

- divine backlight；
- moonlit diffuse light；
- ritual fire；
- storm contrast。

同一套不能每张使用完全不相关的摄影光线。

### Composition Grammar

按内容角色定义：

```text
Character：稳定主角构图语言
World：史诗尺度 / 环境优先
Artifact：仪式感静物
Conflict：双主体 / 群像 / 对峙
Key Moment：叙事性镜头
Epilogue：环境与余韵
```

### Frame / Typography

卡框、Logo、卡名、序号属于设计系统，不进入 AI Prompt。

### Print Treatment

V1 建议最多一种统一基础工艺 + 一种局部工艺，例如：

```text
高克重纸卡
+ 哑膜
+ 局部烫金 或 局部 UV
```

先保证高级感和稳定性，不做复杂平行版本。

---

# 12. AI 出图生产链路

收藏卡不能用“一次 Prompt 批量生成 24 张”的方式完成。

推荐生产链：

```text
Series Bible 已通过
        ↓
Collection Manifest 锁定
        ↓
Collection Art Bible 锁定
        ↓
逐卡生成 Prompt Spec
        ↓
单卡独立生成
        ↓
Identity QA
        ↓
Mythology / Story QA
        ↓
Visual QA
        ↓
全套 Contact Sheet QA
        ↓
不合格卡重绘
        ↓
统一调色 / 后期
        ↓
卡面排版
        ↓
Digital Master
        ↓
Print Master
```

## 12.1 Prompt Composition

继续遵守项目既有图像生成架构，并增加 Series / Collection 两层：

```text
MythCanvas purpose
→ Character / World Canonical identity
→ Civilization Visual DNA
→ Series Core anchors
→ Collection Art Direction
→ Card narrative role / mother scene
→ camera / composition
→ OutputSpec
→ guardrails
```

Style 不能覆盖 Canonical identity；Series 也不能把不属于角色的属性硬塞给角色。

每张卡必须保存可审计的 Prompt Spec，而不是只保存最终拼接文本：

```ts
promptMeta: {
  seriesId: string;
  seriesVersion: string;
  collectionId: string;
  styleId: string;
  styleVersion: string;
  cardId: string;
  storyId?: string;
  keyMomentId?: string;
  characterIds?: readonly string[];
  worldId?: string;
  referenceAssetIds?: readonly string[];
  layers: readonly {
    name: 'purpose' | 'identity' | 'visual-dna' | 'series' | 'style' | 'scene' | 'output' | 'guardrail';
    text: string;
  }[];
  model?: string;
  generatedAt: string;
}
```

其中 Character / Variant、Visual DNA、Style 和 OutputSpec 必须继续分开；Collection 不得把年龄、服装或形态写回 CharacterVariant，也不得把网站 Light / Dark Theme 写入 Artwork 或 Style。

## 12.2 一张卡一张图

必须：

- 每次生成单张最终候选；
- 禁止让模型把多张卡拼在一张大图里；
- 不生成卡框和卡面文字；
- 保存原始大图；
- 印刷排版使用非破坏式裁切。

Artwork 通过 `artworkId` 进入 Collection；卡面排版文件、数字派生图和 Print Master 是下游产物，不覆盖原始 Artwork。所有候选、审核、退回和最终版本都应保留来源与版本关系，便于重绘、回滚和审计。

---

# 13. 全套视觉 QA

单卡漂亮不等于套卡成立。

Collection 必须经过两级 QA。

## 13.1 单卡 QA

检查：

- 角色身份正确；
- Canonical anchors 完整；
- 神话关键元素没有明显错误；
- 手、脸、人体、武器结构正确；
- 不出现水印 / 乱码文字；
- 不复刻现代商业 IP 视觉设计；
- 构图符合卡面安全区；
- 原图分辨率满足印刷。

## 13.2 Contact Sheet QA

把整套 18～24 张同时铺开审核。

检查：

### Coherence

- 是否一眼看起来来自同一个系列；
- 是否出现几张完全像另一个项目的卡；
- 色温、光影和材质是否协调。

### Narrative Coverage

- 故事是否有头有尾；
- 是否只有角色肖像，没有事件；
- 是否缺高潮；
- 是否有明显冗余卡。

### Visual Rhythm

不能 24 张全是：

> 正面站立人物 + 居中构图。

应有：

- 人像；
- 全景；
- 群像；
- 静物；
- 战斗；
- 环境；
- 安静余韵。

### Character Balance

热门角色可以多次出现，但不能挤掉系列必要人物。

### Cultural Integrity

整套不得因为某个 Style Edition 抹掉文明识别度。

---

# 14. Series Ready Gate：什么情况下允许做收藏卡

一个系列必须通过以下 Gate 才能进入 Collection 阶段。

## 14.1 内容完整度

- [ ] Series Bible 已完成；
- [ ] Narrative Spine 明确；
- [ ] 核心 Story 已发布；
- [ ] 核心 Story 有来源和版本说明；
- [ ] 关键 Character 已建立；
- [ ] 关键 World / Scene 已建立；
- [ ] 核心 Story 的 dependency closure 已闭合；
- [ ] 不存在明显为了收藏卡临时捏造的神话事实。

## 14.2 视觉资产成熟度

- [ ] 核心 Character 具备 CanonicalDesign；
- [ ] 核心 World 具备 CanonicalDesign；
- [ ] Series Visual Anchors 已定义；
- [ ] 至少 6 个 Key Moments / Mother Scenes；
- [ ] 不同内容对象具备足够视觉差异。

## 14.3 产品化成熟度

- [ ] 可以用一句话解释“这套系列讲什么”；
- [ ] 可以列出 18～24 张有意义的候选卡，而不是凑数；
- [ ] 用户无需懂全部神话背景也能理解主线；
- [ ] 系列与其他 Series 边界清晰；
- [ ] 至少存在一种适合整套表达的 Style Edition。

任一核心 Gate 未通过：

> **继续补网站内容，不进入实体卡阶段。**

---

# 15. 第一阶段落地路线

路线按“先建立可读产品，再验证收藏需求，最后投入实体生产”推进。第一轮只选择 **1 个试点 Series**，不要求每个 Mythology 同时建设 1–3 个系列。

## Phase 0：建立内容契约与护栏

交付：

1. Story Series / Story Cycle 命名和边界；
2. 静态 `StorySeriesManifest`、`CollectionManifest`、`CollectionArtBible` Schema；
3. Story / Character / World / Scene / Concept dependency 规则；
4. Series 与 Collection 状态机；
5. 构建期校验和反向索引生成；
6. Series Ready Gate、来源审核记录和 Artwork provenance 规则；
7. 事件埋点字典、指标口径和试点决策阈值。

验收：关闭 D1 或移除 D1 binding 后，Series、Story、关系、来源和 Collection 预览仍能由静态内容正常渲染。

## Phase 1：完成 1 个试点 Series

选择标准：来源范围清晰、叙事弧可解释、已有 Character / World / Scene 资产覆盖足够、视觉差异明显，并能在不捏造神话事实的前提下形成有限 Collection scope。

交付：

- 完整 Series Bible；
- 3–6 篇已发布或明确排期的核心 / 支撑 Story；
- 至少 6 个 Key Moments，其中明确标记来源支持或编辑合成；
- 核心 Character / World / Scene 的 CanonicalDesign；
- 通过 `content-ready` Gate。

这里的数量是试点起点，不是所有 Series 的硬性最低标准；来源和叙事闭合优先于凑篇数。

## Phase 2：上线 Series 阅读体验

交付：

- Mythology 中的 Series 入口；
- SSR Series Page；
- Series Story Journey；
- Story 中的 Series 上下文、上一篇 / 下一篇和进度；
- SEO、JSON-LD、sitemap 和相关系列链接；
- `series_view`、`story_start`、`story_complete` 等事件。

验收：用户无需登录或启用 JavaScript 即可理解系列主轴并进入核心 Story；公共请求不读取 D1。

## Phase 3：数字 Collection 预览与需求验证

仅选择通过 `content-ready` 且完成用户行为观察的一个 Series。

先制作 6–8 张 Digital Preview，验证故事覆盖、视觉统一性、下载 / 收藏 / 分享意愿，再决定是否扩展到 18–24 张完整套卡。

交付：

- Collection Manifest 和 Collection Art Bible；
- Collection Page 与 Card 翻看 / 故事跳转；
- Digital Card Master；
- 下载、收藏、分享和候补名单入口；
- `collection_preview_open`、`card_download`、`collection_share`、`physical_waitlist` 等事件。

## Phase 4：实体打样与小规模商业验证

只有 Digital Preview 的需求信号和完整 Collection Gate 均通过后，才投入 18–24 张实体套卡。

V1 只做一种尺寸、一种基础卡纸、一种覆膜、一种局部工艺、一种包装和固定整套销售。实体销售前必须确定售价、单位成本、最小起订量、履约方式、退换规则和毛利底线；没有这些数据时只做候补名单或小批量预售。

验收：颜色、细节、裁切、卡框、触感、包装和实际收藏意愿均完成记录。

## Phase 5：扩系列 / 扩画风

```text
已验证 Series 的第二 Style Edition
vs
新 Series 的第一 Edition
```

根据阅读深度、Collection 互动、预售 / 候补名单和用户反馈决定，不预先承诺每个 Series 必须同时拥有多种画风。

---

# 16. 首个试点系列选择原则

首个试点不应只看“哪个神最热门”，而应评分：

| 维度 | 权重建议 |
|---|---:|
| 故事完整度 | 25% |
| 来源可靠度 | 15% |
| 角色 / 神域资产成熟度 | 15% |
| 视觉辨识度 | 20% |
| 18～24 张卡的内容丰富度 | 15% |
| 国内外用户认知 | 10% |

候选可以包括：

- 中国神话：日月 / 月宫相关故事系列、天界相关故事系列；
- 希腊神话：奥林匹斯诸神系列；
- 北欧神话：诸神黄昏系列；
- 日本神话：高天原神代系列；
- 埃及神话：杜阿特 / 冥界旅程系列。

**注意：系列名称和范围必须在来源校验后最终确定。** 例如中国神话中“天宫”“三十三重天”等概念涉及不同历史时期、宗教和文学传统，不应因为视觉上适合就直接混成一个“远古中国神话 Canon”。

因此推荐做法不是现在先锁死《天宫纪》24 张，而是：

> 先完成中国神话相应 Story Series Bible，在内容来源和边界稳定后再命名并决定 Card List。

---

# 17. 建议的内容资产目录

不要求一次重构，但长期建议按 Mythology 内容包维护：

```text
src/content/{mythology}/
├── index.md
├── catalog.ts
├── stories.ts
├── series/
│   ├── {series-slug}.ts
│   └── ...
├── assets.ts
└── visual-tiers.ts
```

Series 文件承担 Series Bible / Manifest，不把完整长篇 Story 重复复制进去。

未来 Collection 独立：

```text
src/content/collections/
└── {series-slug}/
    └── {style-edition}/
        ├── collection.ts
        ├── cards.ts
        └── art-direction.ts
```

原则：

```text
Story 是内容事实来源
Series 是策展与关系层
Collection 是视觉 / 商品层
```

不要把商品字段侵入 MythStory。

---

# 18. 建议的数据 Schema

## 18.1 Series Manifest

V1 使用静态、版本化的 Manifest。字段需要能够被构建期校验，并与现有 `MythStory`、`ContentClaim`、`SourceRef`、Character / World / Scene 类型对齐。

```ts
type StorySeriesStatus = 'draft' | 'content-ready' | 'published' | 'collection-ready' | 'archived';
type StorySeriesStoryRole = 'core' | 'supporting' | 'optional' | 'cross-series';

type StorySeriesManifest = {
  id: string;
  slug: string;
  mythologyId: string;
  name: string;
  nameEn?: string;
  summary: string;
  narrativeThesis: string;
  version: string;
  scope: readonly string[];
  exclusions: readonly string[];

  storyRefs: readonly {
    storyId: string;
    role: StorySeriesStoryRole;
    order: number;
  }[];

  characterIds: readonly string[];
  worldIds: readonly string[];
  sceneIds: readonly string[];
  conceptIds: readonly string[];

  keyMoments: readonly {
    id: string;
    title: string;
    summary: string;
    storyId?: string;
    characterIds?: readonly string[];
    worldId?: string;
    sceneId?: string;
    status: 'source-backed' | 'editorial-synthesis';
  }[];

  sourceRefs: readonly SourceRef[];
  traditionLanes: readonly {
    id: string;
    label: string;
    period?: string;
    sourceRefs: readonly SourceRef[];
    status: 'supported' | 'contested' | 'editorial-synthesis';
  }[];
  visualAnchors: readonly string[];
  visualAvoid: readonly string[];

  review?: {
    reviewer: string;
    reviewedAt: string;
    notes?: readonly string[];
  };
  status: StorySeriesStatus;
};
```

构建期必须验证：Manifest 的 `mythologyId`、Story、Character、World、Scene、Concept 均存在且属于正确体系；Story 引用不重复；`core` Story 已发布且依赖闭包完整；Key Moment 引用合法；所有来源有定位；`published` Series 有稳定 slug、摘要、Hero 和审核记录。Series → Story 的反向索引由构建脚本生成，不手工维护两份关系。

## 18.2 Collection Manifest

Collection 是 Series 的版本快照，不是新的神话事实来源。`scope` 必须明确本套卡覆盖哪些 Story / 故事弧。

```ts
type CardNarrativeRole =
  | 'opening' | 'world' | 'character' | 'relation' | 'artifact'
  | 'omen' | 'conflict' | 'key-moment' | 'climax'
  | 'aftermath' | 'epilogue' | 'cover';

type CollectionManifest = {
  id: string;
  seriesId: string;
  seriesVersion: string;
  styleId: string;
  styleVersion: string;
  edition: string;
  name: string;
  targetCardCount: number;
  scope: {
    storyIds: readonly string[];
    keyMomentIds?: readonly string[];
    summary: string;
  };
  status: 'draft' | 'preview' | 'published' | 'retired';

  cards: readonly {
    id: string;
    order: number;
    title: string;
    narrativeRoles: readonly CardNarrativeRole[];
    storyId?: string;
    characterIds?: readonly string[];
    worldId?: string;
    sceneId?: string;
    keyMomentId?: string;
    artworkId?: string;
    backSummary: string;
    sourceRefs: readonly SourceRef[];
  }[];
};
```

Collection 校验必须保证：Series 和 Style 版本存在；覆盖范围属于 Series；卡号和顺序唯一；卡片至少关联 Story、Key Moment、Character、World、Scene 或 Concept 之一；`backSummary`、来源和 Artwork 在发布前完整；`targetCardCount` 与卡片数量一致。这里不把 `rarity` 放进 V1 核心模型。

## 18.3 Collection Art Bible

Art Bible 是 Style Edition 的版本化生产规范，不写入 Character、World、MythStory 或应用 Theme。至少包含：

```ts
type CollectionArtBible = {
  id: string;
  collectionId: string;
  styleId: string;
  styleVersion: string;
  rendering: {
    medium: string;
    realism: string;
    texture: string;
    detailLevel: string;
  };
  palette: {
    primary: string[];
    accent: string[];
    avoid: string[];
    temperatureByRole?: Record<string, string>;
  };
  lighting: string[];
  compositionByRole: Record<CardNarrativeRole, string>;
  printTreatment: {
    paper: string;
    finish: string;
    specialProcess?: string;
  };
  version: string;
  status: 'draft' | 'approved' | 'retired';
};
```

Art Bible 通过 `styleId + styleVersion` 引用既有 Style 体系；它只能规定本套 Collection 的渲染和排版生产规则，不能改变 Series 的故事事实或 Character 的身份锚点。

---

# 19. 内容生产工作流

## 19.1 一个 Series 的标准工作流

```text
选题
↓
来源研究
↓
定义 Series Scope
↓
盘点已有 Story / Entity
↓
Dependency Gap Analysis
↓
补 Story
↓
补 Character / World / Scene
↓
Series Bible Review
↓
Series Ready Gate
↓
网站 Series 上线
↓
观察用户兴趣
↓
决定是否 Collection 化
```

## 19.2 AI 可以做什么

AI 适合：

- 来源初筛；
- 版本差异整理；
- Dependency Gap Analysis；
- Story 初稿；
- 结构化数据生成；
- Series Bible 生成；
- Card Candidate 生成；
- Prompt Spec 生成；
- QA Rule 自动检查。

## 19.3 AI 不应该自动决定什么

需要人工最终验收：

- 哪个版本作为当前读者叙事主线；
- 哪些传统可以放入同一 Series；
- 哪些角色真正属于这个系列；
- 系列是否达到收藏价值；
- 最终 Artwork 美术质量；
- 整套 Contact Sheet 是否具有统一高级感。

---

# 20. 指标与验收

## 20.1 内容指标

### Series Coverage

- 已定义 Series 数；
- `content-ready` Series 数；
- `collection-ready` Series 数。

### Story Completeness

每个核心 Story：

- 来源覆盖率；
- required entity closure；
- published 比例；
- Story Illustration 完成率。

### Entity Completeness

- Core Character CanonicalDesign 覆盖率；
- Core World CanonicalDesign 覆盖率；
- 关键 Scene 覆盖率。

## 20.2 网站产品指标

Series Page 上线后至少观察 2 个完整周，并按新访客 / 回访用户、移动 / 桌面和来源渠道分组：

- `Series → Story` 进入率；
- `Story` 开始率与完成率；
- 单次 Series 阅读 Story 数；
- 下一篇 / 相关 Character / World 点击率；
- Series 收藏率；
- Artwork 下载率；
- AI Create Entry CTR。

每个指标必须记录事件名、分母、观察周期和目标阈值。没有预先定义阈值时，指标只能用于观察，不能据此决定是否进入 Collection 生产。

## 20.3 Collection 质量指标

内部必须达到：

- Card Content Coverage 100%；
- Source / attribution metadata 100%；
- Character identity QA 100%；
- 无明显文字乱码 / 人体结构错误；
- Contact Sheet Review 通过；
- Print Safe Area 通过；
- 实体打样色差 / 裁切验收通过。

## 20.4 商业验证指标

实体试点优先看“真实行为”而不是泛化的喜欢程度：

1. 数字样张下载 / 收藏 / 分享率；
2. 物理套卡候补名单转化率；
3. 明示售价后的预售转化率；
4. 单套成本、售价、履约成本和毛利；
5. 实体收到后的满意度与退换率；
6. 晒卡 / 分享率；
7. 对同系列第二画风和下一 Series 的实际兴趣。

推荐将“是否进入下一阶段”写成门槛，而不是只列指标：

```text
Digital Preview → Full Collection
需要：核心内容覆盖通过 + Contact Sheet 通过 + 行为需求达到预设阈值

Full Collection → Physical Sample
需要：完整 Artwork 通过 + 版权 / 来源齐全 + 成本模型可接受

Physical Sample → Small-batch Sale
需要：打样 QA 通过 + 明示售价后的有效预售 / 候补信号 + 履约方案成立
```

V1 不以二级市场价格和稀有卡炒作为成功指标。

---

# 21. 风险与原则

## R1：内容为了出卡被过度简化

解决：Story / Source 为上游，Collection 永远不能反写神话事实。

## R2：AI Art 缺乏收藏价值

解决：收藏价值来自 **明确叙事范围 + 高质量 Art Direction + 人工策展 + 实体工艺**，而不是“AI 生成”标签本身。

## R3：多画风导致品牌失焦

解决：同一 Series 首发只选一种最适合的 Style Edition；多画风是后续扩展，不要求同时上线。

## R4：系列越拆越碎

解决：只有具备独立 Narrative Thesis、核心 Story 集和视觉资产空间的主题才可成为 Series；普通标签继续使用 taxonomy，不升级成产品系列。

## R5：系列之间内容重叠

允许 Story / Character 跨 Series 复用，但每个 Series 必须有不同叙事主轴，禁止简单换名字重复卖同一套卡。

## R6：现代 IP 视觉侵权

继续执行 MythCanvas 既有原则：

> 使用神话原型与自有 Canonical Design，不复刻现代影视、动漫、游戏中的具体角色造型。

## R7：神话历史混用

所有 Series 必须标明 tradition / period / source notes；编辑策展必须显式区分于古代来源。

## R8：Series 内容重新依赖 D1

解决：Series Manifest、关系索引、来源和策展 Artwork 元数据进入版本化静态目录；D1 只承载账户、收藏、生成、投稿、审核和运营数据。任何公共页面重新读取 D1 都必须提交架构例外说明。

## R9：尚未验证需求就投入实体生产

解决：先用 Series 阅读数据和 6–8 张 Digital Preview 验证收藏、下载、分享及明示售价后的候补 / 预售意向；未达到预设门槛时只补内容或继续做数字展示，不进入 18–24 张实体生产。

---

# 22. 产品路线图

## P0：Series Core 基础设施

- [ ] 定义 Story Series / Story Cycle 产品规范；
- [ ] 落地 Series Bible 类型或 Manifest；
- [ ] Story ↔ Series 多对多关系；
- [ ] Dependency Gap Analysis；
- [ ] Series Ready Gate；
- [ ] 内容校验规则。

## P0：完成一个试点故事系列

- [ ] 从现有 Mythology 中选择 1 个候选 Series；
- [ ] 完成来源研究；
- [ ] 补齐核心 MythStory；
- [ ] 补齐 Character / World / Scene；
- [ ] 完成 Series Bible；
- [ ] 达到 `content-ready`，并通过公共静态渲染验收。

## P1：网站 Series 产品化

- [ ] Mythology Series 导航；
- [ ] Series Page；
- [ ] Story Series Journey；
- [ ] Story 上下文跳转；
- [ ] SEO / JSON-LD / Sitemap；
- [ ] Series 数据指标。

## P1：Digital Collection 预览与需求验证

- [ ] Collection Manifest；
- [ ] Collection Art Bible；
- [ ] 6–8 张 Digital Preview Artwork；
- [ ] Contact Sheet QA；
- [ ] Digital Card Layout；
- [ ] Collection 展示页；
- [ ] 下载 / 收藏 / 分享 / 候补名单事件；
- [ ] 明示售价后的需求验证。

## P2：第一套实体收藏卡

- [ ] 通过 `collection-ready` Gate；
- [ ] 扩展为 18–24 张完整 Collection；
- [ ] 供应商打样；
- [ ] Print Master；
- [ ] 包装设计；
- [ ] 实体 QA；
- [ ] 小批量销售验证。

## P3：规模化

- [ ] 新 Series；
- [ ] 同 Series 新 Style Edition；
- [ ] 更高级工艺；
- [ ] 限量 Edition；
- [ ] 个人定制等后续商业能力。

---

# 23. 最终产品原则

MythCanvas 的内容资产应遵循：

> **故事先于图片，系列先于套卡，内核先于画风，收藏价值先于抽卡机制。**

最终形成的不是：

```text
AI 生成图片
→ 印成卡
```

而是：

```text
可靠的神话内容
→ 明确叙事范围的故事系列
→ 稳定的人物与世界资产
→ 高水平视觉策展
→ 数字典藏
→ 精美实体收藏卡
```

只要上游 Story Series 的边界、核心故事和依赖闭包足够清晰，同一个系列就可以持续演化出不同画风、壁纸、长图、动态视觉和实体收藏产品，而不需要每次重新发明世界观。

这应成为 MythCanvas 下一阶段内容建设与收藏产品化的统一主线。
