# MythCanvas 北欧神话体系完整补全计划

> 状态：Canonical Content Completion Plan  
> 版本：V2.1（执行版）
> 日期：2026-09-06  
> 基线：`main@c6a2ca2`；后续实现若改变基线数量，以自动 Coverage Report 为准，不手工维护本文数字。
> 适用范围：北欧神话 Story Map、Character、World / Scene、MythicObject、Relation、Source / Claim、视觉资产、结构化内容流水线，以及后续 Story Series / Collection 的上游内容建设。  
> 相关文档：`docs/CONTENT_POSITIONING.md`、`docs/STORY_SERIES_COLLECTION_PRODUCT_PLAN.md`、`docs/CHARACTER_ART_SYSTEM.md`、`docs/CHARACTER_GRAPH_PLAN.md`、`.agents/skills/mythcanvas-content-model/SKILL.md`

---

# 0. 结论

北欧神话下一阶段的第一目标不是“做第一套收藏卡”，也不是“继续补热门神灵”，而是：

> **先让 MythCanvas 能完整、可信、体系化地讲清北欧神话，再从完整内容体系中自然识别适合商品化的 Story Series。**

统一主链路：

```text
Primary / Core Sources
        ↓
Norse Source Coverage Matrix
        ↓
Norse Story Map
        ↓
Story Cycle
        ↓
MythStory
        ↓
Dependency Closure
 ┌────────┼─────────┬─────────┬────────────┐
Character  World     Scene     MythicObject
 └────────┼─────────┴─────────┴────────────┘
          ↓
Relation + Claim + Source Scope
          ↓
Canonical Design + Visual Evidence
          ↓
Visual Readiness
          ↓
完整北欧神话内容宇宙
          ↓
Story Series Discovery
          ↓
Collection / 收藏卡
```

核心原则：

1. **Source drives Story**：先明确来源覆盖，再决定应该讲哪些故事。
2. **Story drives Entity**：Character / World / Scene / MythicObject 由故事依赖自然产生，不按“神灵排行榜”灌数据。
3. **Evidence drives Canonical Design**：视觉设定必须区分文本事实、物质文化证据和 MythCanvas 原创设计。
4. **Story Cycle drives Collection**：收藏卡系列只能在完整 Story Map 之后产生，不能反过来绑架内容。
5. **Variation is first-class**：北欧神话没有一套跨时代、跨地区完全固定的唯一 Canon；冲突版本要标范围，不强行调和。
6. **Volume ≠ Story Cycle ≠ Collection**：网站阅读卷、故事脉络和未来商品系列是三种不同对象。

## 0.1 当前执行态覆盖说明

本文前半部分保留了 V1 / V2 基线与问题复盘，用来解释为什么需要本计划；其中出现的“36 篇”“12 个 Scene”等数字是历史基线，不是当前完成度。当前执行数字必须以 `npm run content:coverage:norse` 生成的 Snapshot 为准：当前为 45 个来源、74 个 Story Manifest 单元、74 个静态 Story、8 个 World、15 个 Scene、18 个 MythicObject，依赖闭包缺口为 0。

当前并不等于最终完成：74 篇 Story 仍待具名人工来源审校，8 组 World 双端视觉和 74 个 Story key-moment 仍待视觉批准，Collection Discovery 仍保持 blocked。机器侧完成与人工批准必须分开记录。

---

# 1. V1 Review：上一版方案的主要不足

V1 的方向基本正确，但经过当前仓库实现和本轮 Story Series 商业化讨论复盘后，存在以下关键问题。

## 1.1 当前基线已经严重过期

V1 仍以：

```text
12 Characters
1 World
3 Stories
```

作为现状。

历史复盘时 `src/content/norse/` 已经形成结构化内容包，当前实际数量以自动 Snapshot 为准：

```text
92 Characters
8 Worlds
15 Scenes
18 MythicObjects
74 MythStories
58 CharacterRelations + 5 ContentRelations
```

因此 V1 中大量“待建设能力”实际上已经完成，继续照旧方案执行会重复建设。

## 1.2 “Story >= 30” 已经失去完成度意义

当前 Story 已达 36 篇，但仍明显存在：

- 核心诗篇未覆盖；
- 重要故事参与者缺失；
- Heroic Edda 大量缺口；
- 神器 / 宝物无法建模；
- 已有故事存在错误。

因此新版不再用简单 Story 数量定义“完整”。

必须改为：

> **Source Coverage Matrix + Story Dependency Closure + Content Audit。**

## 1.3 来源体系仍偏“埃达故事合集”

V1 已重视《诗体埃达》《散文埃达》，但还不够。

北欧神话现存材料主要经由中世纪冰岛文本保存，传统本身经历从口传到基督教时代书写的过程；研究也强调时间、地域和文本变体不应被消解为固定 Canon。

因此来源体系至少还要明确纳入：

- Skaldic Poetry 的独立证据价值；
- Heroic Eddic Poetry；
- `Völsunga saga`；
- Saxo / Ynglinga 等区域性或后期见证；
- archaeology / runic / iconographic evidence 作为视觉与宗教语境证据；
- modern academic secondary 只用于解释冲突，不反向伪装为古代原典。

## 1.4 缺少“神话文本”与“宗教实践 / 物质文化”的边界

MythCanvas 是视觉产品，只根据晚期文本想象 Viking Age 外观，会快速滑向现代奇幻。

需要明确：

```text
Narrative Evidence  → 故事情节 / 角色关系
Material Evidence   → 服饰 / 饰物 / 武器 / 船 / 建筑 / 符号参考
Editorial Synthesis → MythCanvas 策展解释
Original Design     → MythCanvas 原创视觉设计
```

四层不能混写。

## 1.5 Character 分类模型过于单值化

当前数据中出现：

- Ymir / Surtr 被简化为 `monster`；
- Gerðr 被标为 `mortal`；
- Skaði、Loki 等跨群体身份难以用单一类型表达；
- Æsir / Vanir / Jötunn 被简单作为 `lineage`，容易误导成纯血缘分类。

但北欧神话中的：

```text
社会神群
≠ 血缘
≠ 存在类别
≠ 故事阵营
```

新版必须拆开。

## 1.6 缺少 MythicObject 一等实体

北欧故事高度依赖：

- Mjölnir；
- Gungnir；
- Gleipnir；
- Gjallarhorn；
- Draupnir；
- Brísingamen；
- Skíðblaðnir；
- Gram；
- Andvaranaut；
- Iðunn 的苹果；
- 诗歌蜜酒；
- Hringhorni；
- Naglfar。

这些不是普通 Story 文本中的名词，而是：

> **故事依赖 + 视觉资产 + 未来收藏卡高价值对象。**

现有 Character / World / Scene 无法正确承载，需要新增通用 `MythicObject` 能力。

## 1.7 Heroic Tradition 覆盖明显不足

当前只有 Sigurd / Brynhildr / Fafnir 三个主要英雄角色，以及 4 篇沃尔松格 Story。

但《诗体埃达》本身就有大规模英雄诗部分，至少还包括：

- Völundr；
- Helgi cycle；
- Reginn / Fáfnir / Sigrdrífa；
- Guðrún；
- Niflung / Burgundian；
- Atli；
- Hamðir / Sörli 等。

若目标叫“完整北欧神话体系”，英雄传统不能作为几个附录故事处理。

## 1.8 没有正式 Coverage Matrix 和自动审计产物

“我们觉得差不多补完了”不可验收。

新版必须能生成：

```text
source → story coverage
story → entity dependency coverage
entity → source coverage
relation → source coverage
visual → provenance coverage
known issue → resolution status
```

## 1.9 “已发布”被误当成“已完成”

当前 36 篇 Story 虽然都标记为 `published`，但生成器统一写入：

```text
readingMinutes = 4
1 个短叙事段落
1 个模板说明段落
1 个模板版本提示
```

这只能证明路由、关联与渲染链路已经跑通，不能证明文章达到 4 分钟阅读量，也不能证明内容已经完成来源审校。

因此本文后续统一使用两组数量：

```text
Inventory Count  = 数据库 / 静态包里已有多少条记录
Ready Count      = 通过对应 Gate 的记录数量
```

不得再用 `norseStories.length` 直接宣称“已完成 36 篇北欧故事”。

## 1.10 现有 Dependency Closure 是结构闭包，不是语义闭包

当前 `stories.ts` 中：

```ts
requiredCharacterIds = input.characters
characterIds = input.characters
```

两者来自同一输入，因此校验只能发现“引用了不存在的 ID”，不能发现“故事明明出现了 Þrymr，但编辑时根本没有把 Þrymr 写进数组”。

新版必须把依赖判断拆成两步：

```text
Source review / Story Manifest 决定 expected dependencies
                         ↓
Published Story 声明 reader-facing links
                         ↓
自动校验 expected ⊆ published links，人工复核 expected 是否忠于来源
```

只有这样，Dependency Closure 才能发现遗漏实体，而不是自证闭环。

## 1.11 实施阶段顺序需要调整

V2.0 把 `MythicObject`、taxonomy 与 Story 状态模型放在大量内容补全之后，但前面的 Dependency Closure 又依赖这些能力，形成循环依赖。

V2.1 改为：

```text
热修事实错误
→ 先补最小内容模型
→ 再做 Source Registry / Coverage / Story Manifest
→ 再补 Story 与 Entity
→ 最后做深审、视觉和网站发布
```

## 1.12 Source Registry 不应再造一套北欧专用类型

仓库已有通用 `ContentSource`、`SourceRef`、`MythStorySource`，凯尔特、阿兹特克、美索不达米亚内容包也已经有可复用的 `sources.ts` 模式。

北欧应扩展通用字段并复用同一注册方式，不新增与 `ContentSource` 平行的 `NorseSourceRecord` 真源模型。

## 1.13 缺少文章级编辑完成标准

V2.0 规定了来源、实体和视觉，却没有规定一篇 Story 何时从数据占位符变成可供用户阅读的内容。

V2.1 新增 `Editorial Gate`，覆盖正文完整度、版本说明、引用定位、关联实体、敏感内容、中文命名、插画槽位和人工审校。

## 1.14 缺少兼容与上线策略

当前已有可索引 URL、Story Series 和用户可能保存的页面。补全过程必须：

- 保留已有 `id`；
- 纠正 slug 时提供永久重定向；
- 不让研究中 Story 出现在 sitemap；
- 不把公共内容迁入运行时 D1；
- 允许按 Cycle 分批上线，而不是等待全部 70～90 篇后一次性切换。

## 1.15 缺少工作包和验收责任

“补 Story / 补实体”仍然过粗。执行时必须以一个可审查 PR 工作包为单位，每包只包含：

```text
1 个 source lane 或 2～5 篇强关联 Story
+ 对应依赖实体
+ 对应 claims / relations
+ 测试与 coverage 更新
```

每个工作包至少经过内容审校与工程校验；视觉生产是后续独立 Gate，不与文字 PR 强耦合。

---

# 2. 当前仓库基线

当前北欧结构化内容位于：

```text
src/content/norse/
├── assets.ts
├── catalog.ts
├── index.md
├── index.ts
├── stories.ts
└── visual-tiers.ts
```

## 2.1 Character：32 个

已经覆盖主要高认知神祇和部分巨人 / 怪物 / 英雄，包括：

```text
Odin
Thor
Loki
Frigg
Baldr
Heimdall
Tyr
Freyr
Freyja
Hel
Fenrir
Jörmungandr
Ymir
Búri
Borr
Vili
Vé
Mímir
Njörðr
Skaði
Iðunn
Sif
Höðr
Hermóðr
Víðarr
Surtr
Gerðr
Sigyn
Sleipnir
Sigurd
Brynhildr
Fafnir
```

这是很好的骨架，但远不是 Story Dependency 的完整闭包。

## 2.2 World：8 个

当前：

```text
Asgard
Midgard
Jötunheimr
Hel
Muspell
Niflheim
Vanaheimr
Álfheimr
```

正确方向是继续保持：

> **不为凑“九界”而补固定现代地图。**

World 只在具有稳定叙事价值时建立。

## 2.3 Scene：12 个

当前包括：

```text
Ginnungagap
Well of Mímir
Roots of Yggdrasil
Asgard Court
Bifröst
Jötunheim Border
Midgard Coast
Gate of Hel
Muspell Flame Border
Field of Fimbulwinter
Naglfar
Völsung Hall
```

随着 Story 补全，Scene 数量会自然明显增长。

## 2.4 MythStory：数量以 Coverage Snapshot 为准

当前阅读层有 6 个 Volume：

| Volume | Story 数 | 当前定位 |
|---|---:|---|
| 创世与宇宙结构 | 6 | 基础世界观 |
| 神族秩序与知识 | 8 | 多条 Story Cycle 混合 |
| 索尔、洛基与巨人 | 7 | Thor / Loki / Fenrir 内容混放 |
| 巴德尔之死与秩序崩裂 | 5 | Ragnarök 前奏 |
| 诸神黄昏与世界再生 | 6 | 终局主线 |
| 沃尔松格英雄传统 | 4 | 明显未完成 |

这再次说明：

> **Volume 是阅读组织，不应该直接当成 Story Series。**

---

# 3. “完整北欧神话”的定义

MythCanvas 不追求百科式穷举所有古诺尔斯文本中出现一次的名字。

“完整”定义为：

> **主要神话与英雄叙事不存在结构性断层；所有核心 Story 的主要行动者、空间、关键物件、关系和来源形成闭包；版本冲突有范围说明；核心对象具备后续可靠视觉化基础。**

## 3.1 完成度不再以绝对数量为 Gate

数量只作为规模预估：

```text
MythStory          预计 70～90
Core Character     预计 60～85
World              预计 8～12
Scene              预计 30～45
MythicObject       预计 20～30
Core Relation      预计 100+
```

这些不是硬 KPI。

真正硬 Gate 是：

```text
P0 Source Coverage Matrix        = 100% resolved
P0 Story Dependency Closure      = 100%
P0 Story Source Coverage         = 100%
P0 Stable Identity Source        = 100%
P0 Core Relation Source          = 100%
Unscoped Conflicting Claims      = 0
Orphan Required References       = 0
Known P0 Content Errors           = 0
Collection Before Completion     = 0
```

`resolved` 可以是：

```text
covered
partial-with-scope
excluded-with-reason
```

不要求每份古代材料都转成独立 Story，但不允许“完全没盘点”。

---

# 4. 范围边界：必须先定义“北欧神话是什么”

## 4.1 Norse Mythology ≠ 统一 Viking Bible

现存北欧神话主要由中世纪手稿保存，尤其集中在 13 世纪冰岛；它们记录、整理和再表达更早的口传传统。

因此产品不得暗示：

> 所有 Viking Age 斯堪的纳维亚人在同一时间、同一地区都相信同一套固定剧情。

## 4.2 Norse Mythology ≠ 全部 Old Norse Religion

Story 内容重点是 narrative mythology。

宗教实践例如：

- burial；
- cult sites；
- ritual；
- sacrifice；
- amulets；
- place-name evidence；

可以进入文化 / Visual Evidence 层，但没有叙事依据时不能伪造成 MythStory。

## 4.3 Norse ≠ Pan-Germanic 自动合并

例如：

```text
Óðinn / Odin
Wōden
Wotan
```

具有历史语言与宗教关联，但 MythCanvas 北欧包不能简单把不同地区传统全部当同一个 Norse Story。

比较信息进入：

```text
alias / comparative note / reception
```

而不是主 Canon。

## 4.4 不把 Sámi 元素当成“泛北欧魔法素材”

北欧与 Sámi 社会存在复杂接触历史，但二者不是可随意混合的视觉素材库。

没有明确来源时：

- 不给 Odin / seiðr 角色随意套 Sámi ceremonial dress；
- 不把 Sámi 物质文化当“Viking shaman aesthetic”；
- 跨文化关联必须有明确 source / research note。

---

# 5. Source / Evidence Architecture

新版来源体系按“证据角色”而不是简单强弱排序。

## 5.1 A 类：Eddic Mythological Poetry

P0 必须建立 coverage manifest，至少盘点：

```text
Völuspá
Hávamál
Vafþrúðnismál
Grímnismál
Skírnismál
Hárbarðsljóð
Hymiskviða
Lokasenna
Þrymskviða
Alvíssmál
Baldrs draumar
Hyndluljóð
```

扩展层再评估：

```text
Rígsþula
Grottasöngr
Grógaldr / Fjölsvinnsmál / Svipdagsmál
其他 Eddic-style poems
```

每篇必须标：

```text
covered
partial
context-only
excluded-with-reason
```

## 5.2 B 类：Snorra Edda

核心：

```text
Gylfaginning
Skáldskaparmál
```

特别注意：

- `Prologue` 中 euhemeristic / learned material 不作为 pagan mythology 事实直接灌入；
- 不同 Snorra Edda manuscript 的差异需要在高风险 claim 中允许记录；
- Skáldskaparmál 不只是“术语书”，保存了大量对 myth / heroic narrative 的关键说明。

## 5.3 C 类：Skaldic Poetry

必须从“辅助来源”升级为独立 evidence layer。

重点可包括：

```text
Haustlöng
Þórsdrápa
Húsdrápa
Ragnarsdrápa
Eiríksmál
Hákonarmál
以及具体 Story 所需的早期 Skaldic stanza
```

它们的重要性包括：

- 某些材料早于 Snorri；
- 可验证某个 motif 在较早时期已经存在；
- Ragnarök / Valhöll / Þórr / Þjazi 等主题不能只依赖后期 prose summary。

## 5.4 D 类：Heroic Eddic Poetry

不能只用 `Völsunga saga` 替代整个 Heroic Edda。

Coverage 至少要系统盘点：

```text
Völundarkviða
Helgakviða Hjörvarðssonar
Helgakviða Hundingsbana I / II
Grípisspá
Reginsmál
Fáfnismál
Sigrdrífumál
Sigurðr poems
Guðrún poems
Helreið Brynhildar
Oddrúnargrátr
Atlakviða
Atlamál
Guðrúnarhvöt
Hamðismál
```

## 5.5 E 类：Legendary Saga / Regional Witness

重点：

```text
Völsunga saga
Ynglinga saga / Heimskringla（范围化使用）
Saxo Grammaticus, Gesta Danorum
Sörla þáttr 等晚期 / Christian-framed witness
```

用途：

- 补独立版本；
- 补英雄传统；
- 补地域差异；
- 补 reception。

禁止：

> 用一个晚期文本覆盖掉 Eddic / Skaldic 更早或不同版本。

## 5.6 F 类：Material / Archaeological / Runic Evidence

新增 `visual-context` 证据角色。

包括：

- Mjölnir pendants；
- runestones；
- picture stones；
- burial goods；
- jewelry；
- weapons；
- ships；
- textile / metalwork；
- settlement / hall archaeology。

用途仅为：

```text
Visual DNA
material vocabulary
costume / object plausibility
symbol context
```

不能因为发现一件锤形吊坠就反推出完整 Thor Story。

## 5.7 G 类：Academic Secondary

现代研究用于：

- 判断 source chronology；
- 解释文本冲突；
- 判断地域 / 时期差异；
- 防止现代大众误传；
- 明确 disputed interpretation。

不把学者 reconstruction 写成 `primary-text`。

---

# 6. Source Registry 必须独立并复用通用模型

当前 `stories.ts` 内嵌四个宽泛 source constants，locator 仍是“按诗篇与诗节 / 按章节”一类占位文字；随着规模增长既不可维护，也无法支撑 claim-level 审计。

新增：

```text
src/content/norse/sources.ts
```

但不新增北欧专用真源类型。文件应导出通用 `ContentSource[]`，并提供与现有内容包一致的 `sourceRef()` / `storySource()` 适配器：

```ts
export const norseSources = {
  thrymskvida: {
    sourceId: 'norse-src-thrymskvida',
    title: 'Þrymskviða',
    type: 'primary-text',
    storyType: 'translation',
    tradition: 'Eddic mythological poetry',
    period: 'medieval manuscript witness preserving older poetic material',
    language: 'non',
    edition: 'editorially approved edition / translation',
    url: 'approved working source URL',
    note: 'witness and dating caveat',
  },
  // ...
} satisfies Record<string, ContentSource>;

export const sourceRef = (
  key: NorseSourceKey,
  locator: string,
  note?: string,
): SourceRef => { /* registry adapter */ };

export const storySource = (
  key: NorseSourceKey,
  locator: string,
  note?: string,
): MythStorySource => { /* registry adapter */ };
```

Story / Claim 只引用 stable `sourceId` + 精确 locator。`ContentSource` 需要扩展而不是旁路实现的字段包括：

```text
sourceFamily        便于 Coverage 分组
evidenceRoles       narrative / identity / relation / visual-context / reception
manuscriptContext   抄本 / witness 范围
region              地域范围
licenseNote         版本与翻译使用权
```

若暂时不扩展通用类型，上述信息先进入 `note` 也只能是过渡方案，并必须登记技术债；不能长期依赖不可查询的自由文本。

### 6.1 Source 粒度

不能只建一个笼统的 `source-norse-poetic-edda` 再让所有 Story 共用。

推荐粒度：

```text
诗体埃达：每首诗一个 sourceId
散文埃达：按作品建立 sourceId，locator 精确到章节
斯卡尔德诗：每部作品 / 可识别 stanza witness 一个 sourceId
萨迦：每部作品一个 sourceId，locator 精确到章节
考古 / 图像：每件对象或正式 catalogue record 一个 sourceId
学术研究：每本书 / 论文一个 sourceId，locator 精确到页或章节
```

### 6.2 Edition 与翻译策略

每个 P0 文本必须登记：

- 古诺尔斯文底本或可信数字版；
- 团队实际使用的工作翻译；
- 中文正文是自译、改写还是引用；
- 版权 / 许可状态；
- locator 如何在版本间保持稳定。

Story 正文默认采用 MythCanvas 自有中文叙述；若使用译文原句，必须检查授权并限制引用长度。不能把“现代英文译本”标成古代原典本身。

---

# 7. Norse Source Coverage Matrix

新增一个可以被程序检查的 Manifest：

```text
src/content/norse/source-coverage.ts
```

概念结构：

```ts
{
  sourceId: 'poetic-edda-thrymskvida',
  priority: 'P0',
  status: 'covered',
  storyIds: ['story-thryms-stolen-hammer'],
  supportingClaimIds: [],
  exclusionReason: undefined,
  reviewKind: 'scope-mapped',
  reviewerType: 'automated',
  reviewer: 'editor-id',
  reviewedAt: 'YYYY-MM-DD',
  note: 'Thor cycle core narrative'
}
```

允许：

```text
covered
partial
context-only
excluded-with-reason
```

禁止空白。

这样“完整北欧”变成可审计结果，而不是主观判断。

## 7.1 优先级定义

```text
P0  不覆盖就会造成主干叙事断裂或事实错误；阻塞体系补全
P1  重要独立传统或显著增强人物 / 关系理解；阻塞“扩展完整”但不阻塞首批 Divine 上线
P2  接受史、区域平行材料、低叙事密度证据；登记但可延后产品化
```

P0 / P1 / P2 是研究优先级，不是来源价值高低。

## 7.2 Coverage 状态定义

| 状态 | 定义 | 是否 resolved |
|---|---|---:|
| `covered` | 已完成范围判断，并映射到 Story Manifest、Story 或 Claim；不等于对应 Story 已通过人工 source review | 是 |
| `partial` | 只覆盖了来源的一部分；必须记录剩余范围和后续任务 | 仅 P1/P2 可暂时是 |
| `context-only` | 仅用于身份、关系、视觉或接受史，不应拆成 Story | 是 |
| `excluded-with-reason` | 明确不进入当前 Norse 边界并写明理由 | 是 |
| `unreviewed` | 尚未完成判断 | 否 |

P0 的最终状态只能是 `covered`、`context-only` 或 `excluded-with-reason`；`partial` 不能伪装成 P0 已完成。

`reviewKind: 'scope-mapped'` 表示 Phase 2 的来源范围登记；只有对应 Story 的 `editorialReview.reviewerType: 'human'`、批准日期和无未决问题，才算 Phase 3～6 的人工来源审校。

## 7.3 初始 P0 Coverage 包

Phase 2 必须至少冻结以下 manifest 组，而不是只列作品名：

| Source lane | P0 最小范围 | 主要输出 |
|---|---|---|
| Eddic mythological poetry | 第 5.1 节列出的 12 首核心诗 | Divine Story / Claim |
| Prose Edda | `Gylfaginning` 核心神话叙事；`Skáldskaparmál` 中 P0 宝物与事件 | Story / Object / Claim |
| Skaldic poetry | `Haustlöng`、`Þórsdrápa`、`Húsdrápa` 及主干所需 stanza | 早期见证 / 版本交叉校验 |
| Heroic Edda | Sigurd–Guðrún–Atli 主干、Helgi、Völundr | Heroic Story / Claim |
| Völsunga saga | 从 Völsung 前史到 Guðrún 后续的主干章节 | Heroic Story / variant scope |
| Regional / late witnesses | 仅纳入 P0 冲突说明所需部分 | Alternate Claim / exclusion |
| Material evidence | 核心 S/A 视觉对象的首批 catalogue 清单 | Visual context，不产 Story |

---

# 8. Story Map：9 条内容主干

以下是内容研究层的 Story Cycle，不直接等于页面 Volume，也不直接等于未来 Collection。

本节是完整范围的“研究母清单”，不是已经冻结的生产数据。Phase 2 必须把它落成 `src/content/norse/story-manifest.ts`；在该文件合并前，任何“70～90 篇”都只是容量估算。

每个 Manifest 项必须具备：

```ts
type NorseStoryManifestItem = {
  id: string;
  proposedSlug: string;
  titleZh: string;
  titleEn: string;
  cycleIds: readonly string[];
  priority: 'P0' | 'P1' | 'P2';
  status:
    | 'proposed'
    | 'researched'
    | 'structured'
    | 'source-reviewed'
    | 'published'
    | 'excluded';
  sourceScopes: readonly {
    sourceId: string;
    locator: string;
    role: 'primary-narrative' | 'parallel' | 'variant' | 'context';
  }[];
  expectedDependencies: {
    characterIds: readonly string[];
    worldIds: readonly string[];
    sceneIds: readonly string[];
    objectIds: readonly string[];
    conceptIds?: readonly string[];
  };
  existingStoryId?: string;
  mergeIntoStoryId?: string;
  exclusionReason?: string;
};
```

`expectedDependencies` 必须由读过对应 locator 的编辑者填写，不能从现有 `characterIds` 自动复制。

## 8.1 Story 拆分规则

一份来源不等于一篇 Story；一个 motif 也不必独立成篇。按以下规则拆分：

- 有独立起因、行动、转折和结果，可形成 4～8 分钟阅读体验时，拆成 Story；
- 只是谱系、称谓、宇宙知识或单个诗节时，进入 Claim / supporting content；
- 同一事件有不同来源版本时，默认一个 Story + 多条 source-scoped Claim，不复制成两篇近似文章；
- 不同版本导致角色动机、结局或伦理含义显著不同，才允许建立 variant Story 或独立 tradition lane；
- 一个 Story 可以属于多个 Cycle，但只有一个主要阅读 Volume；
- 不能为了达到 70～90 的数量范围拆碎叙事。

## 8.2 初始容量与发布批次

| Cycle | 唯一 Story 容量估算 | 首批级别 | 说明 |
|---|---:|---|---|
| 01 创世与宇宙结构 | 8～10 | P0 | 已有 6 条记录，但需重做实体和来源闭包 |
| 02 阿萨、华纳与诸神秩序 | 10～13 | P0 | 宝物、婚姻、宴席与和平机制 |
| 03 奥丁 | 8～10 | P0 | 与 Cycle 02/06 有交叉，不重复建文 |
| 04 索尔与巨人 | 9～12 | P0 | `Þrymskviða`、Hymir、Útgarðr、Geirröðr 为重点 |
| 05 洛基与秩序裂缝 | 9～12 | P0 | 多数条目跨 Cycle 02/04/06 |
| 06 巴德尔与 Ragnarök | 12～16 | P0 | 先完成现有 Series 的内容可信度 |
| 07 Völsung–Guðrún–Atli | 16～22 | P0/P1 | 最大新增工作包 |
| 08 Helgi | 4～7 | P1 | 保持独立英雄传统 |
| 09 独立 Eddic traditions | 5～9 | P1/P2 | Völundr 为 P1，其余按证据与产品价值排序 |

表内相加会因跨 Cycle Story 重复计数而大于最终唯一 Story 数；Coverage Report 必须同时输出“Cycle memberships”和“unique stories”。

---

## Cycle 01：创世与宇宙结构

核心问题：

> 世界如何从原初状态形成？生命、时间、日月和世界树如何进入宇宙？

### 当前已覆盖

- 尤弥尔与世界诞生；
- Auðumbla / Búri；
- Odin / Vili / Vé 造世界；
- Ask / Embla；
- Yggdrasil / wells；
- 日月追逐。

### 必须补强

建议最终覆盖：

```text
Ginnungagap
Niflheim / Muspell 原初边界
Ymir
Auðumbla
Búri → Borr → Odin/Vili/Vé
Ymir 身体化为世界
Ask / Embla
Yggdrasil
Urðarbrunnr / Mímisbrunnr / Hvergelmir（按来源范围）
Norns
Sól / Máni
Sköll / Hati
Níðhöggr 与世界树生命系统
Ragnarök 前的 cosmic foreshadowing
```

### 需要新增的重要实体

候选：

```text
Auðumbla
Urðr
Verðandi
Skuld
Sól
Máni
Sköll
Hati
Níðhöggr
```

是否建 Character / Creature 取决于实际 Story action，不机械建名单。

---

## Cycle 02：阿萨、华纳与诸神秩序

核心问题：

> 神族共同体如何建立，冲突、交换、婚姻、宝物如何维持或改变秩序？

### 当前已有

- Æsir–Vanir war；
- Kvasir / Mead of Poetry；
- Freyr / Gerðr；
- Iðunn / Þjazi；
- Asgard wall / Sleipnir；
- Sif hair / treasures。

### 关键缺口

必须补：

```text
Gullveig / Heiðr 与 Æsir–Vanir conflict
停战与人质交换
Kvasir 更完整的生成 / 死亡 / Mead 链路
Þjazi 的身份
Skaði 为父复仇 / compensation
Skaði 选 Njörðr
Njörðr / Skaði 海与山的婚姻冲突
Freyja 的核心身份与 Fólkvangr
Brísingamen 的 fragmentary traditions（必须范围化）
Heimdall / Loki 与 necklace 的部分传统
Ægir feast 作为诸神社会场景
```

Brísingamen 不得使用后世单一版本重建成“唯一完整剧情”。

---

## Cycle 03：奥丁——知识、魔法、死亡与王权

当前 Odin 内容过度分散在“神族秩序”中，应独立成知识脉络。

核心主题：

> **Odin 的力量几乎总伴随代价、伪装、知识交换和死亡。**

建议 Story Map：

```text
Odin 与 Mímir's Well
一只眼的代价
Odin 悬于 Yggdrasil 九夜
符文知识
Vafþrúðnir 的智慧竞赛
Grímnir / Grímnismál（作为 Odin identity / story，不新建另一个 Character）
Mead of Poetry
Huginn / Muninn
Valhöll
Valkyries 与战死者
Odin 对英雄命运的介入
Odin / seiðr 的来源范围
Odin 与 Ragnarök 的预知
```

### 需要补强

```text
Huginn
Muninn
Vafþrúðnir
Valkyrie taxonomy
Valhöll Scene
Fólkvangr 与 Valhöll 不应合并
```

不要把每个 Odin heiti / alias 建成独立 Character。

---

## Cycle 04：索尔与巨人

当前已经具备主干，但实体缺口最大。

### 当前 Story

- Hrungnir；
- fishing Jörmungandr；
- stolen Mjölnir；
- Útgarðr；
- Geirröðr；
- 部分其他内容。

### 建议完整主干

```text
Thor 与 Hrungnir
Thor 与 Hymir / giant cauldron
Thor fishing Jörmungandr
Þrymr 偷走 Mjölnir
Thor 假扮 Freyja / wedding feast
Þjálfi / Röskva 进入同行关系
Skrymir
Útgarða-Loki challenges
Thor 与 Geirröðr
Gjálp / Greip
Alvíssmál
Hárbarðsljóð
```

### 必补 Character / Creature

```text
Hrungnir
Hymir
Þrymr
Þjálfi
Röskva
Skrymir
Útgarða-Loki
Geirröðr
Gjálp
Greip
Alvíss
```

### 必补 Scene

```text
Hymir's coast / hall
Þrymr's hall
Útgarðr hall
Geirröðr's hall
river crossing
```

这一 Cycle 补完前，不启动《Thor Collection》。

---

## Cycle 05：洛基、跨界与秩序裂缝

Loki 不应只作为 Thor 的副手或 Ragnarök 反派出现。

需要建立完整叙事轨迹：

```text
同行者 / problem solver
→ 制造问题
→ 变形与跨界
→ 宝物 / Sleipnir / Iðunn 等事件
→ family / children
→ 与诸神关系恶化
→ Lokasenna
→ Baldr
→ bondage
→ Ragnarök
```

建议覆盖：

```text
Asgard wall / Svaðilfari / Sleipnir
Sif hair / dwarf treasures
Iðunn / Þjazi
Angrboða
Hel
Fenrir
Jörmungandr
Fenrir / Gleipnir / Tyr
Lokasenna
Baldr tradition
Loki captured
Sigyn and venom
release before Ragnarök
```

### 需要新增

```text
Angrboða
Svaðilfari
Þjazi
```

并把 Loki 的：

```text
social affiliation
parentage
Jötunn relations
Æsir companionship
```

分开表达，不能用单一 `lineage` 概括。

---

## Cycle 06：巴德尔、秩序崩裂与 Ragnarök

当前 Volume 4 + 5 已是项目最成熟的连续主线，但仍有重要缺口和错误。

建议完整覆盖：

```text
Baldr's dreams
Odin seeks prophecy
Frigg asks beings not to harm Baldr
mistletoe exception
Loki / Höðr
Baldr's death
Hringhorni funeral
Nanna
Hermóðr rides Sleipnir to Hel
Hel's return condition
Þökk episode（严格按 Snorri 版本范围）
Váli revenge tradition
Loki captured
Sigyn / venom
Fimbulwinter
sun / moon pursuit
Fenrir breaks free
Jörmungandr rises
Naglfar
Gjallarhorn
Odin vs Fenrir
Víðarr revenge
Thor vs Jörmungandr
Freyr vs Surtr
Tyr / Garmr（按来源范围）
Heimdall vs Loki
world burning / sea
renewed earth
Baldr / Höðr return
Víðarr / Váli / Móði / Magni survivors（按来源范围）
Líf / Lífþrasir
```

### 重要新增实体

```text
Nanna
Váli
Garmr
Líf
Lífþrasir
Móði
Magni
```

是否将 Garmr 与 Fenrir 关联、区别或讨论，必须保持 source scope，禁止直接合并。

---

## Cycle 07：Völsung / Sigurd / Niflung / Guðrún / Atli

这是当前最大内容缺口。

不能只做：

```text
Sigurd
→ Fafnir
→ Brynhildr
→ death
```

完整 Story Map 至少分四段。

### A. Völsung 前史

```text
Völsung
Signý
Siggeir
Sigmund
Odin's sword in the tree
Sinfjötli
revenge
```

### B. Sigurd / Dragon Cycle

```text
Sigmund's death
Hjördis
Regin
Hreiðmarr / Ótr / Andvari gold prehistory
Gram
Fafnir
dragon blood / birds
Sigrdrífa / Brynhildr
```

### C. Niflung / Burgundian

```text
Guðrún
Gunnar
Högni
Grimhildr
memory / marriage conflict
Brynhildr conflict
Sigurd's death
Brynhildr's death
```

### D. Atli / Guðrún / final revenge

```text
Atli
Gunnar / Högni
Niflung treasure
Guðrún revenge
Svanhildr
Hamðir / Sörli
Jörmunrekkr tradition
```

### 核心新增人物候选

```text
Völsung
Signý
Siggeir
Sigmund
Sinfjötli
Hjördis
Regin
Hreiðmarr
Ótr
Andvari
Guðrún
Gunnar
Högni
Guttormr
Grimhildr
Atli
Svanhildr
Hamðir
Sörli
```

Entity 创建仍由实际 Story Dependency 决定。

---

## Cycle 08：Helgi 英雄传统

V1 基本漏掉。

《诗体埃达》中 Helgi poems 有明确独立体量，不应被塞进 Sigurd 附录。

至少盘点：

```text
Helgi Hjörvarðsson
Helgi Hundingsbani I
Helgi Hundingsbani II
Sigrún
Sváva
Hunding
Sinfjötli 的交叉关系
死亡 / burial mound / return motifs
```

最终可以作为独立 Heroic Cycle，也可以在网站阅读层与其他英雄诗组合，但不能在 source coverage 中缺席。

---

## Cycle 09：Völundr 与其他独立 Eddic Traditions

用于承载不能自然塞进前八条主线、但具有重要独立故事价值的内容。

### P0 / P1 候选

```text
Völundarkviða
Völundr / Níðuðr / Böðvildr
Svipdagr cycle
Gróa
Menglöð
Rígsþula / Rígr（identity 有争议时范围化）
Hyndluljóð 中高价值 genealogy / Freyja material
Grottasöngr
```

原则：

> 有连续 narrative value → Story；只有谱系 /知识价值 → supporting content / claim，不强拆 Story。

---

# 9. Story Cycle 与 Volume 分离

技术上优先复用现有：

```text
TaxonomyTerm(kind = 'story-cycle')
```

仓库已经存在 `StorySeriesManifest`，并已有 Ragnarök Series。不得再新增第二套系列类型；但也不能把 `StorySeriesManifest` 当 Story Cycle 使用。

职责固定为：

```text
TaxonomyTerm(kind='story-cycle')  = 研究与内容关系标签，可多选
MythStory.volumeId                = 网站阅读编排，单篇一个主要位置
StorySeriesManifest               = 已策展、可版本化、面向用户/商品化的叙事主轴
Collection Manifest              = 未来商品定义，本阶段不存在
```

一个 Story 可以同时属于多个 Cycle，例如：

```text
Fenrir and Gleipnir
→ Loki family
→ Tyr / oath
→ Ragnarök foreshadowing
```

网站 Volume 仍然是 reader-friendly ordering。

未来 Collection 则是：

```text
Collection Manifest
→ 从多个 Story Cycle / Story 中策展
```

三者不能一一绑定。

现有 Ragnarök Series 在北欧内容补全期间保留为可运行样板，但它的 `content-ready / collection-ready` 状态必须由新版 Coverage Gate 重新计算，不能因为页面已存在就视为内容完成。

---

# 10. Character / Being 分类模型修正

## 10.1 不再把 group 当 lineage

建议把 Taxonomy 能力扩展为至少可表达：

```text
family-lineage
social-divine-group
being-class
story-cycle
domain
editorial-collection
```

例如：

```text
Æsir        = social-divine-group
Vanir       = social-divine-group
Jötunn      = being-class
Dwarf       = being-class
Álfr        = being-class
Valkyrie    = being-class / role taxonomy
Völsung     = family-lineage
```

## 10.2 纠正单一 characterType 的误导

至少审计：

```text
Ymir     不应只等于 monster
Surtr    不应只等于 monster
Gerðr    不应标 mortal
Skaði    同时具有 Jötunn 出身与 divine context
Loki     不可用单一 Æsir / Jötunn 标签概括
```

角色的：

```text
stable entity class
social group
family lineage
story role
```

必须分开。

---

# 11. 新增 MythicObject 通用领域模型

建议作为跨文明能力新增：

```ts
type MythicObjectType =
  | 'weapon'
  | 'jewel'
  | 'artifact'
  | 'vehicle'
  | 'vessel'
  | 'food'
  | 'substance'
  | 'symbolic-object';

type MythicObject = {
  id: string;
  mythologyId: string;
  slug: string;
  name: string;
  nameEn: string;
  nativeName?: string;
  aliases?: readonly string[];
  objectType: MythicObjectType;
  summary: string;
  traditionTags?: readonly string[];
  sourceRefs: readonly SourceRef[];
  canonicalDesign: CanonicalDesign;
  heroImage?: ImageAsset;
};
```

首批北欧对象：

```text
Mjölnir
Gungnir
Draupnir
Gleipnir
Gjallarhorn
Brísingamen
Skíðblaðnir
Gram
Andvaranaut
Iðunn's Apples
Mead of Poetry
Hringhorni
Naglfar
Freyr's sword
Megingjörð
Járngreipr
```

Story Dependency 新增：

```text
requiredObjectIds
```

并同步扩展：

```text
StructuredMythologyBundle.objects
publicCatalog.mythicObjects
静态搜索索引
内容校验器
Story reader 关联对象区
sitemap / detail route（若 Phase 8 决定提供独立对象页）
D1 compatibility mirror migration（只做镜像，不改变静态真源）
```

## 11.1 Object Relation 不能塞进 CharacterRelation

`CharacterRelation` 只表达 Character / Concept 图，不足以表示：

```text
Character owns Object
Object forged-by Character
Object used-in Story
Object located-at Scene
Object replaces / conflicts-with Object
```

V2.1 决策：

- Story 与 Object 用 `requiredObjectIds / objectIds` 表达；
- Character 与 Object、Object 与 Scene 的长期关系新增通用 `ContentRelation`，不要把对象伪造成 Character；
- 现有 `CharacterRelation` 保留，避免一次性破坏角色图；
- `ContentRelation` 合入前，可以由 MythicObject 的 source-scoped claims 暂存关系，但不得把无来源的 `ownerCharacterIds` 当事实。

目标结构：

```ts
type ContentEntityType = 'character' | 'world' | 'scene' | 'story' | 'mythic-object' | 'concept';

type ContentRelation = {
  id: string;
  mythologyId: string;
  from: { type: ContentEntityType; id: string };
  to: { type: ContentEntityType; id: string };
  relationType: string;
  traditionScope?: string;
  confidence: CharacterInterpretationConfidence;
  sourceRefs: readonly SourceRef[];
};
```

这是跨文明能力，提交前必须同步更新架构文档、validation 和 compatibility mirror；不允许只在北欧 `catalog.ts` 中临时造对象关系数组。

---

# 12. World / Scene 完整化原则

保持：

```text
World = 稳定的大空间 / mythic domain
Scene = 具体故事空间 / 可复用地标
```

## 12.1 不做固定 Nine Realms checklist

特别关注：

```text
Hel / Niflhel / Niflheim
Niðavellir / Svartálfaheimr
Muspell / Múspellsheimr
```

不同来源不自动同义合并。

## 12.2 需要逐步新增的高价值 Scene

候选：

```text
Valhöll
Fólkvangr / Sessrúmnir
Breiðablik
Nóatún
Þrymheimr
Iðunn's garden
Ægir's hall
Þrymr's hall
Hymir's hall / coast
Útgarðr
Geirröðr's hall
Baldr funeral shore
renewed earth
Fafnir's lair
Brynhildr fire-ring
Andvari / treasure setting
Helgi burial mound
Völundr smithy / island
```

Scene 必须由 Story 依赖驱动，不按旅游地图建模。

---

# 13. Name / Alias / Transliteration 规范

本轮必须增加 Norse Naming Audit。

目标解决：

```text
Þrymr vs Þjazi
Freyr vs Freyja
Hel person vs Hel place
Old Norse diacritics
中文译名不统一
ASCII slug 与 native name
```

建议每个核心实体维护：

```text
canonical Old Norse name
English display name
Chinese display name
aliases / alternate spellings
ASCII-safe slug
source-specific identity notes
```

### URL 兼容

对于当前已有 typo slug，例如：

```text
freyja-and-gerdr
```

若修正为：

```text
freyr-and-gerdr
```

必须保留旧 URL redirect / alias，不制造 SEO 断链。

---

# 14. Claim / Version Conflict 规则

现有 `ContentClaim` 已经有：

```text
supported
contested
editorial-synthesis
```

以及 `traditionScope`，应充分使用，不另造平行系统。

## 冲突内容禁止这样处理

```text
Source A says X
Source B says Y
→ AI 总结成 Z
→ Z 被写成“北欧神话事实”
```

正确处理：

```text
Claim A
  source=A
  scope=A tradition

Claim B
  source=B
  scope=B tradition

Reader-facing summary
  明确说明存在不同版本
```

重点高风险区域：

- Baldr；
- Loki；
- Ragnarök survivors；
- Hel / afterlife；
- Freyja / Brísingamen；
- Valkyrie identities；
- Snorri vs poetic versions；
- Saxo parallels；
- Nine Worlds；
- Heimdall / Rígr。

---

# 15. Visual Evidence 与 Canonical Design

北欧是最容易被商业影视 / 游戏污染的 Mythology 之一。

因此 Canonical Design 必须显式分三层。

## 15.1 Mythological Facts

只记录来源明确的身份事实：

```text
Thor owns Mjölnir
Odin is one-eyed in relevant tradition
Heimdall has Gjallarhorn
Tyr loses a hand in Fenrir binding tradition
```

## 15.2 Material Culture Anchors

用于视觉 plausibility：

```text
Viking Age textiles
metalwork
brooches
weapon construction
ship forms
hall architecture
Mjölnir amulet evidence
runestone / picture-stone visual vocabulary
```

这些是时代物质文化参考，不等于“神本人历史画像”。

## 15.3 MythCanvas Original Design Choices

明确标注：

```text
服装组合
特殊配色
神性光效
原创纹样组合
人物脸型
角色独特 silhouette
```

### 禁止项

- horned Viking helmets 作为默认 Viking fact；
- MCU Thor / Loki；
- God of War Odin / Thor；
- Assassin's Creed 风格复制；
- 所有 Jötunn = 蓝色冰巨人；
- 所有角色 = fur + heavy plate armor；
- 所有 rune = neon magic glyph；
- 所有场景 = snow mountain + aurora。

---

# 16. 当前已知 P0 内容错误 / 风险

在继续扩内容前先建立 Bug List。

## P0-1：Þrymr 与 Þjazi 混淆

当前《雷神之锤被盗》存在把偷锤者写成类似 Þjazi / 夏基的错误。

正确主角应为：

```text
Þrymr
```

且 `Þrymskviða` 来源 / 中文名称需要一起修正。

## P0-2：Hringhorni 与 Naglfar 混淆

Baldr funeral 当前错误关联：

```text
scene-ship-naglfar
```

应新增 / 使用：

```text
Hringhorni
```

Naglfar 留在 Ragnarök。

## P0-3：Thor ↔ Fenrir enemy relation

当前存在 `Thor → Fenrir` 主要 enemy 关系。

Ragnarök 主干应为：

```text
Odin ↔ Fenrir
Thor ↔ Jörmungandr
```

需要重新核验并修正 relation assertion。

## P0-4：Freyr / Freyja slug 混淆

当前：

```text
freyja-and-gerdr
```

实际 Story 主体为：

```text
Freyr and Gerðr
```

修 canonical slug 时保留旧路径兼容。

## P0-5：Being type 语义错误

审计：

```text
Ymir
Surtr
Gerðr
Skaði
Loki
```

避免 `monster / mortal / lineage` 把复杂身份压扁。

## P0-6：Story 来源与正文模板不匹配

当前所有 Story 由四个宽泛 source constant 生成，locator 如“按诗篇与诗节 / 按章节”不够精确；所有 Character 又几乎统一引用 `Gylfaginning 1–54`。这会让 CI 形式通过、内容实际不可追溯。

必须：

- 每首 Eddic poem 独立 sourceId；
- 每篇 Story locator 精确到诗节 / 章节；
- Character 来源按身份事实重新绑定；
- 删除统一模板段落作为正式正文的做法。

## P0-7：英雄 Story 类型错误

当前 `Völsung` Story 全部使用 `kind: 'myth'`。完成通用类型扩展后，应改为：

```text
heroic-legend
```

同时保留它们属于北欧内容体系，但不把英雄文学传统包装成与诸神诗完全相同的证据层。

## P1 审计队列

- `Ask / Embla` 同时核对 `Völuspá` 与 Snorri 叙述，不只保留单一 prose lane；
- `Yggdrasil / wells / Norns` 不用一个 Story summary 合并所有来源差异；
- `Æsir–Vanir war` 补 Gullveig / Heiðr 与来源范围；
- `Kvasir / Mead` 判断拆分边界；
- `Thor in Útgarðr` 补 Þjálfi、Röskva、Skrymir、Útgarða-Loki 等语义依赖；
- `Lokasenna` 场景从泛化 `Asgard Court` 修正为来源支持的宴席空间；
- `Baldr / Höðr` 的 Snorri、poetic、Saxo 版本保持分轨；
- Ragnarök 幸存者、Týr / Garmr、Loki / Heimdall 等终局关系逐项校验；
- `Völsung Hall` 不得被复用为所有 Sigurd、Fafnir、Brynhildr 场景。

---

# 17. Story Dependency Closure

每个 Story Manifest 先声明 source-reviewed 的 `expectedDependencies`；正式 Story 再声明：

```text
requiredCharacterIds
requiredWorldIds
requiredSceneIds
requiredObjectIds
requiredSourceIds
storyCycleIds / taxonomy mapping
```

其中：

```text
expectedDependencies  = 研究层的应有依赖，回答“来源中谁/哪里/什么不可缺”
required*Ids          = 发布层的强依赖，必须存在并显示给读者
*Ids                  = reader-facing 全部关联，可包含非阻塞上下文
```

校验关系：

```text
Manifest expected required dependencies
                 ⊆ Story required*Ids
                 ⊆ Story reader-facing *Ids
                 ⊆ registered static entities
```

Manifest 的正确性必须由来源审校负责；自动化只能验证集合关系，不能代替读懂原文。

示例：

```text
Þrymskviða / Theft of Mjölnir

Characters
├── Thor
├── Loki
├── Freyja
├── Heimdall
└── Þrymr

World
└── Jötunheimr

Scene
└── Þrymr's Hall

Objects
└── Mjölnir

Source
└── Poetic Edda · Þrymskviða
```

任何 required dependency 不存在：

> Story 不允许进入 `dependency-complete`。

任何已知主要行动者在 Manifest 中缺失：

> Story 不允许进入 `source-reviewed`，即使 TypeScript 和现有测试全部通过。

## 17.1 依赖分级

避免把正文里出现一次的每个名字都强制建实体：

```text
required   主要行动者、关键地点、决定情节的物件；必须建模
supporting 对理解有帮助，可链接已有实体；不阻塞单篇发布
mentioned 仅正文提及；保留 Named Entity，不创建空实体
```

## 17.2 当前 36 篇的首轮语义审计

不能沿用当前构造器生成的 closure 结果。每篇必须重新阅读 source locator，并产出：

```text
keep / split / merge / retitle / rewrite / unpublish
expected Character / World / Scene / Object / Concept
source locator
tradition scope
known conflicts
```

审计结束后，`norseStories.length >= 32` 这类测试保留为兼容性检查，但不再作为内容完成度测试。

---

# 18. Content Lifecycle

现有仅有 `draft / published` 不足以支撑大规模研究内容生产。

推荐编辑流程状态：

```text
researching
→ structured
→ dependency-complete
→ source-reviewed
→ visual-ready
→ published
```

若不希望直接改变 public `publishStatus`，可增加内部 `editorialStatus`，保持对外字段兼容。

定义：

### researching

Story 已进入 Source Coverage，但研究尚未完成。

### structured

标题、summary、cycle、source、主要 blocks 已成形。

### dependency-complete

Required entities 全部闭包。

### source-reviewed

Claim / version / source locator 已审计。

### visual-ready

主要实体已具备 Canonical Design + visual evidence boundary。

### published

进入用户侧页面。

## 18.1 状态落地方式

`publishStatus` 继续只负责公开可见性：

```text
draft | published
```

新增独立 `editorialStatus` 表达研究进度，避免把内部流程塞进路由判断。公开查询仍只返回 `publishStatus='published'` 且通过 Gate 的静态内容。

每次状态跃迁必须由显式字段或 review record 驱动，不根据正文长度自动猜测。

## 18.2 Editorial Gate：一篇 Story 何时算内容完成

每篇 P0 Story 达到 `source-reviewed` 至少满足：

- 标题、summary、正文与 source locator 一致；
- 主要来源至少 1 个；关键并行版本需要独立 source scope；
- 正文具备完整叙事，不是模板段落或百科摘要；
- 推荐中文正文 800～1800 字、4～8 分钟，超出范围可有充分叙事理由；长度是 warning，不是事实正确性的替代品；
- 至少 3 个有意义的正文 section 或等价叙事结构；
- 没有统一模板句冒充文章正文；
- 所有关键 claim 能定位到来源，编辑综合明确标记；
- `expectedDependencies` 与正式 Story 关联闭合；
- 中文名、Old Norse 名、英文名和 alias 符合命名规范；
- 暴力、性、胁迫、乱伦等内容按来源与产品年龄定位克制表述，不猎奇化；
- 通过至少一次非作者内容审校，并在 `sourceDecisionNotes` 中记录审校结论；空白或只有空格的备注不算通过。

达到 `visual-ready` 还需：

- hero / key moment 插画槽位定义完成；
- 图像 provenance 完整；
- 每条 `approved` 视觉资产都必须在 `reviewNotes` 中记录检查过的身份、来源边界、构图或原创性结论；
- Character / World / Scene / MythicObject 的 Canonical Design 能支撑出图；
- 视觉不依赖现代商业改编；
- 桌面与移动关键图是独立构图需求，不以裁切替代。

## 18.3 Review Record

推荐通用审校记录：

```ts
type EditorialReview = {
  status: 'needs-review' | 'approved' | 'changes-requested';
  reviewerType: 'human' | 'ai' | 'automated';
  reviewer: string;
  reviewedAt: string;
  sourceDecisionNotes: readonly string[];
  unresolvedIssueIds: readonly string[];
};
```

机器生成的“已引用来源”不能自动变成 `approved`。

---

# 19. 自动验证与 Coverage Report

北欧补全不能继续只靠人工 review。

建议把现有 mythology validation 抽成通用能力，并输出：

```text
reports/norse-content-coverage.json
```

至少包含：

```text
baselineInventory
sourceCoverage
storyManifestCoverage
storyReadinessByStatus
storyDependencyCoverage
characterSourceCoverage
worldSourceCoverage
objectSourceCoverage
relationSourceCoverage
aliasCollisions
missingReferences
orphanEntities
unscopedContestedClaims
placeholderContent
readingTimeMismatch
reviewStatus
visualReadiness
knownIssueStatus
```

## CI Gate

P0 完成阶段加入：

```text
required dependency missing            → fail
manifest expected dependency missing   → fail
required source missing                → fail
duplicate id / slug                    → fail
alias collision unresolved             → fail
P0 source matrix blank                 → fail
unscoped conflicting core claim        → fail
known P0 factual issue unresolved      → fail
published Story still uses template body → fail after migration window
published Story lacks approved review  → fail after migration window
```

图片未全部完成可以 warning，不应该阻塞早期 Story research branch。

迁移窗口内，旧 36 篇的 `placeholderContent / reviewStatus` 先以 warning 呈现；对应 Cycle 宣布完成后升级为 fail，避免一次模型合并就令主分支永久红灯。

新增命令：

```text
npm run content:coverage:norse
npm run content:validate
```

Coverage 命令生成 JSON 供 CI 使用，并输出人类可读 Markdown 摘要；生成报告不作为 canonical content 提交，除非产品决定保留审计快照。

---

# 20. 实施阶段

阶段顺序是依赖关系，不允许把后置阶段作为前置阶段的完成证据。估算统一使用“工作包”而不是虚构人日：一个工作包为 1 个 source lane 或 2～5 篇强关联 Story 及其依赖。

## Phase 0：事实热修 + 可信基线

目标：先停止继续传播已知错误，再获得真实完成度快照。

交付：

- 立即修复第 16 节中可在现有模型内处理的 P0 事实与关联错误（P0-1～P0-4）；
- 把依赖新模型的 P0-5～P0-7 登记为阻塞任务，并在 Phase 1 / 3 完成；
- 为 `freyja-and-gerdr` 增加兼容重定向后修正 canonical slug；
- 重新统计 inventory 与 readiness；
- 给现有 36 篇标记“prototype / needs-review”迁移状态；
- 建立 `known-issues.ts` 或等价可校验清单；
- 生成首份 `norse-content-coverage.json`。

验收：

```text
Known factual P0 issues = 0
Broken current references = 0
Existing public URLs preserved = 100%
36 篇均有明确迁移状态
```

预计：2～3 个工程 / 编辑工作包。

---

## Phase 1：通用内容模型前置

目标：先具备后续补全真正需要的模型与校验能力。

交付：

```text
ContentSource 扩展（sourceFamily / evidenceRoles / witness / license）
TaxonomyKind 扩展（family-lineage / social-divine-group / being-class）
MythStoryKind += heroic-legend
MythStory.editorialStatus + review
MythicObject + bundle.objects
MythStory.objectIds / requiredObjectIds
NorseStoryManifestItem.expectedDependencies
ContentRelation 或批准的过渡实现
```

同步更新：

- `docs/ARCHITECTURE.md`；
- 静态 registry / public catalog / search；
- validation；
- 兼容镜像脚本与必要 D1 migration；
- Story / Entity 测试夹具。

验收：

```text
npm run content:validate 通过
旧内容包无需一次性重写也能兼容
新增模型不引入公共页面运行时 D1 依赖
```

预计：3～5 个工程工作包。

---

## Phase 2：Source Registry + Coverage Matrix + Story Manifest Freeze

目标：回答“要补什么”，暂不批量写文章或出图。

本计划把“来源完成”拆成两个不能互换的状态：`scope-mapped / machine-ready` 只表示来源、版本、授权和定位已登记，且机器校验通过；`human-audited / source-reviewed` 才表示具名人工按来源阅读并批准。Coverage Matrix 的 100% 不能替代 Story 级人工审校，报告中的“机器来源登记与已知问题完整性”也不能被当作发布许可。

新增：

```text
src/content/norse/sources.ts
src/content/norse/source-coverage.ts
src/content/norse/story-manifest.ts
scripts/report-norse-content-coverage.mjs
docs/NORSE_STORY_MAP.md（由 manifest / coverage 生成的人类可读快照）
```

执行顺序：

1. 登记 P0/P1 source、edition、license 和 locator 规则；
2. 填满 Source Coverage Matrix；
3. 把第 8 节转成唯一 Story Manifest；
4. 对现有 36 篇逐项做 keep / split / merge / rewrite / unpublish 判断；
5. 由来源审校填写 `expectedDependencies`；
6. 自动生成 Character / World / Scene / Object / Concept Gap List。

验收：

```text
P0 source rows resolved = 100%
P0 Story Manifest source scope = 100%
P0 expectedDependencies reviewed = 100%
Unreviewed P0 manifest item = 0
每个现有 Story 都有迁移决策
```

当前执行态：45 / 45 个 Coverage Row 已完成 `scope-mapped`，74 / 74 个 Story 已达到机器预审条件；P0 Story 的人工 `source-reviewed` 仍为 0 / 56，具体以 `docs/NORSE_REVIEW_HANDOFF.md` 和认证命令为准。

预计：8～12 个研究 / 编辑工作包，是本计划最关键的冻结点。

---

## Phase 3：现有在线 Story 改造（数量以 Coverage Snapshot 为准）

目标：先把已经在线的内容从原型条目升级为可信文章，避免一边新增、一边保留旧错误与模板正文。

按 Cycle 01～06 分批处理：

- 精确 source locator；
- 重写完整正文；
- 建立 Story claims；
- 补齐 expected / required / reader-facing dependencies；
- 修 Volume 与 Cycle 归属；
- 补命名、alias 与 redirect；
- 通过 Editorial Gate。

每个 Cycle 可以独立上线。一个 Cycle 完成后，其 placeholder warning 升级为 CI error。

验收：

```text
现有在线 Story：迁移决策执行率 = 100%
保留发布的 Story：source-reviewed = 100%
保留发布的 Story：template body = 0
readingMinutes 与正文量明显不符 = 0
```

预计：8～12 个编辑 / 工程工作包。

---

## Phase 4：Divine Mythology Completion

目标：补齐 Cycle 01～06 尚缺的 P0 Story 与实体依赖。

每个工作包顺序固定：

```text
source locator
→ Story draft
→ expected dependency review
→ Character / World / Scene / Object / Concept
→ claims / relations
→ Editorial Gate
→ publish
```

优先批次：

1. Origins / cosmic structure；
2. Æsir–Vanir / divine order；
3. Odin；
4. Thor；
5. Loki；
6. Baldr / Ragnarök。

验收：

```text
Divine P0 source coverage resolved = 100%
Divine P0 Story dependency closure = 100%
Divine P0 source-reviewed Story = 100%
```

预计：10～16 个工作包。

---

## Phase 5：Heroic Tradition Completion

目标：完成 Cycle 07～09，且在产品上与 divine mythology 明确分层。

执行批次：

1. Völsung 前史；
2. Sigurd / Regin / Fafnir；
3. Brynhildr / Niflung / Guðrún；
4. Atli / Svanhildr / Hamðir；
5. Helgi cycle；
6. Völundr；
7. 其余 P1 independent traditions。

验收：

```text
Heroic P0 source coverage resolved = 100%
Cycle 07 主干无叙事断层
Helgi / Völundr 不再从 Coverage 消失
heroic-legend 分类正确
```

预计：10～16 个工作包。

---

## Phase 6：全量 Source / Claim / Relation Deep Audit

目标：从“单包已审”升级为“整个北欧体系互相不冲突”。

审计：

- source metadata / locator / edition；
- CharacterName / CharacterInterpretation / ContentClaim 的端点、来源定位与 tradition scope；
- manuscript / region / tradition scope；
- Snorri-only reconstruction；
- Eddic / skaldic / saga 平行版本；
- relation direction 与语义；
- alias / duplicate identity；
- World / Scene / Character / Object 分类；
- modern popular contamination；
- 敏感内容与编辑语气；
- Story 间重复和断层。

执行记录：每次 `npm run content:coverage:norse` 都会生成 `docs/NORSE_EDITORIAL_REVIEW_QUEUE.md`。它按实际已发布 Story 列出 source locator、P0/P1 优先级、编辑状态与人工审校状态；`docs/NORSE_REVIEW_HANDOFF.md` 另有独立的 Phase 6 identity audit queue，列出 CharacterName、CharacterInterpretation 和 ContentClaim 的实体端点、来源与争议范围。上述队列是 Phase 3、4、5 的逐篇人工审校输入，也是 Phase 6 对“非作者审校覆盖”的可追溯证据，不能由脚本自动清零。

验收：

```text
Core source coverage = 100%
Unscoped conflicting core claims = 0
Orphan required references = 0
Duplicate canonical identity = 0
Known P0 issue = 0
```

北欧包的身份审计落在 `src/content/norse/identities.ts`，而不是继续把别名、异文和产品解释埋在 Story 正文中。当前基线包含 7 条名称记录、4 条来源解释层和 10 条 ContentClaim；其中争议项必须有 `traditionScope`，名称可挂到 Interpretation，但不能因此生成重复 Character。报告会检查这些记录是否引用已注册实体和可定位 Source。

预计：4～6 个交叉审计工作包。

---

## Phase 7：Visual Readiness

内容稳定后，按：

```text
Mythological Facts
+ Material Culture Evidence
+ MythCanvas Original Design
```

补：

- Tier S / A Character Canonical Design；
- World / Scene；
- MythicObject；
- Story key moments；
- PC / mobile 独立构图；
- provenance 与 identity/style/output QA。

本轮 World 视觉草稿已补齐最终 OutputSpec 的交付尺寸：桌面 `2560×1440`、移动 `1440×2560`。原始 `1672×941` / `941×1672` 图仍保留为 `sourceAssetPath`，最终文件只作为可追溯的 `resize-only` delivery derivative；报告同时将原稿、交付图和 Story 插图的 SHA-256 纳入 Snapshot 指纹，并执行缺失、PNG/尺寸、可疑小文件（<100KB）和重复内容组预检，再写入视觉审查队列，确保人工决定绑定到具体文件版本。这解决文件级完整性与证据锁定契约，不替代人工的清晰度、构图、安全区、身份和原创性 QA。Story key-moment 当前属于编辑型宽幅插图，不自动宣称为壁纸 OutputSpec，也不把 World 图当作其视觉证据。正式 Smoke 默认验证未审校 Story 为 `noindex,follow`；最终认证后使用 `--expect-indexable` 验证其切换为 `index,follow`。

Story 正文可以先于全部插画进入 `source-reviewed`，但不能在缺少所需视觉锚点时进入 `visual-ready`。

验收：所有未来可能进入 Series / Collection 的核心对象均为 `visual-ready`。

---

## Phase 8：网站分批上线与 SEO 验收

目标：把已通过 Gate 的静态内容交付给用户，而不是等待全体系一次发布。

确保：

- Mythology 页面按 Volume 提供清晰入口；
- Cycle 与 Story Series 在 UI 上不混淆；
- Character / World / Scene / MythicObject / Story 互链；
- source notes 清晰但不过度学术化；
- Story detail route、canonical、OG、sitemap 正常；
- 核心内容 SSR，不依赖 D1 或客户端 fetch；
- draft / researching 内容不进入 sitemap；
- 未完成具名人工来源审校的 Story 即使保留读者路由，也必须输出 `noindex,follow`；只有同一份真人审批证据通过后才允许进入 sitemap / index；
- 旧 slug 301 到新 canonical URL；
- 中英文名称与 alias 可搜索；完整英文长文不作为本轮默认 DoD。

每个上线批次执行：

```text
npm run content:coverage:norse
npm run content:validate
npm run check
```

并抽查桌面 / 移动、Light / Dark、无 JavaScript 阅读和结构化数据。

---

## Phase 9：Completion Certification + Collection Handoff

目标：只有在第 21 节 DoD 全部满足后，生成一份版本化 completion snapshot。

交付：

```text
Norse completion version
source coverage summary
unique Story / cycle membership summary
entity and relation closure summary
visual readiness summary
known exclusions and deferred P2 list
Collection discovery input
```

这份 snapshot 是启动 Collection Discovery 的唯一入口；“页面看起来很多”或“Story 数到 80”都不能替代它。

实施约束：`npm run content:coverage:norse` 会生成 `docs/NORSE_COMPLETION_SNAPSHOT.md` 作为持续更新的证据草稿，汇总来源、依赖、编辑和双端视觉状态。它在所有 P0 Gate 为绿、人工审校/视觉/产品批准及独立 Snapshot approval 已留痕前，必须显示为 `in-progress`；不得用自动化脚本改写为完成认证。

### 9.1 Snapshot 锁定与签核顺序

Snapshot version 是证据包的内容指纹，不是手工填写的版本号。身份审计与产品签字会被纳入指纹；因此不能先签字、再把旧版本当作最终版本提交。实际执行采用两轮锁定：

1. 先完成 P0 来源审校、视觉 QA、Phase 6 身份审计和 P2 `deferred / excluded` 决策；运行 `npm run content:coverage:norse`，记下输出的当前 `snapshotVersion`。
2. 将这个版本写入 `src/content/norse/collection-signoff.ts` 的 identity audit 与 product sign-off 记录；不要修改 Snapshot 文档来伪造状态。
3. 再运行 `npm run content:coverage:norse`。如果版本变化，以新版本为准，重新核对并更新 identity audit / product sign-off；重复本步骤直到版本稳定。
4. 只有版本稳定后，产品负责人和独立 Snapshot reviewer 才能分别签核；Snapshot reviewer 不得与产品签字人相同。两条记录都必须写入同一个最终 `snapshotVersion`，`reviewerType` 必须为 `human`，并保留日期、决定说明和空的未决项。
5. 运行 `npm run content:certify:norse`。命令成功且 `reports/norse-collection-discovery.json` 为 `ready-for-discovery` 后，才允许进入 Collection Discovery；任何内容或审批证据再变化都必须回到第 1 步。

这套流程允许审批记录改变指纹，但不允许旧审批记录“继承”到新 Snapshot。认证命令是唯一完成判定，不以 Markdown 中的手工文字为准。

---

# 21. Definition of Done

北欧神话只有同时满足以下条件，才能宣布“体系补全”。

## Source

- P0 mythological Eddic corpus：100% resolved；
- P0 Heroic Edda：100% resolved；
- Prose Edda 核心 narrative coverage：100% resolved；
- 必要 Skaldic evidence 已纳入；
- late / regional witness 有明确 scope。

## Story

- 9 条主干均有明确 Story Map；
- 主要叙事不存在明显断层；
- Story Cycle 与 Volume 分离；
- 主要 heroic tradition 不再只有 Sigurd 4 篇；
- 现有 Story 的 keep / split / merge / rewrite / unpublish 决策全部执行；
- 所有 published P0 Story 均通过 Editorial Gate；
- template / placeholder Story = 0；
- `readingMinutes` 与实际正文量一致。

## Entity

- required Character closure = 100%；
- required World / Scene closure = 100%；
- required MythicObject closure = 100%；
- 不存在为了名单完整而创建的大量空实体。

## Relation

- 核心 family / ally / enemy / spouse / narrative relation 有来源；
- social group / being class / lineage 不混用；
- disputed relation 有 scope。

## Quality

- known P0 factual error = 0；
- orphan references = 0；
- duplicate canonical identity = 0；
- alias collision unresolved = 0；
- modern franchise contamination = 0；
- P0 Story 非作者审校覆盖 = 100%；
- P0 source / edition / translation license 状态已登记；
- 任何 disputed core claim 均有 `traditionScope`。

## Visual

- Tier S / A 核心对象拥有稳定 Canonical Design；
- material culture 与 mythology fact 分离；
- PC / mobile 仍保持独立 composition 原则。
- 任何 `approved` 视觉资产都必须带 `reviewerType: human`、具名 reviewer 与有效 reviewedAt；Story 进入 `visual-ready` 前必须绑定该批准记录。

## Delivery

- canonical content 仍来自 `src/content/`；
- 公共内容运行时 D1 读取 = 0；
- draft / researching 内容进入 sitemap = 0；
- 已变更 slug 均有永久重定向；
- `npm run content:coverage:norse`、`npm run content:validate`、`npm run check` 通过；
- Completion Snapshot 已生成并人工批准，且批准记录绑定当前 Snapshot version；内容或审批证据变化后必须重新批准。
- Collection Discovery gate 不仅检查枚举状态，还检查来源审校、World 双端视觉和 Story key-moment 的人工证据字段。
- Phase 6 的 CharacterName / CharacterInterpretation / ContentClaim 审计必须有独立真人批准记录，并绑定当前 Snapshot version；不能只生成审计队列。
- `collectionDisposition: deferred/excluded` 的 P2 Story 不进入候选 Discovery 的完整性计算，但必须保留在 exclusions；不得用暂缓项掩盖 P0 缺口。

## 21.1 完成度计算

总完成度不能按实体数简单平均，统一输出六个维度：

```text
Source Resolution
Story Editorial Readiness
Semantic Dependency Closure
Entity / Relation Quality
Visual Readiness
Delivery Readiness
```

任何一个 P0 维度未达 100%，整体状态都只能是 `in-progress`。P1/P2 延后项必须进入 Completion Snapshot 的 exclusions / deferred 清单，不能静默消失。

## 21.2 对产品功能的影响

Phase 0～2 主要改内容内核、校验和编辑流程，用户侧功能变化较小：

- 错误内容立即纠正；
- 个别 Story canonical URL 修正并保留重定向；
- 页面可能新增更准确的来源 / 版本标签；
- 不增加卡牌、交易、付费或 Collection 功能。

Phase 3～8 会逐步产生可见变化：

- 北欧神话页从原型短条目升级为可连续阅读的完整图文体系；
- Story、Character、World、Scene 和 MythicObject 的互链更完整；
- Heroic tradition 与诸神主线分层展示；
- 来源冲突不再被压成单一“正史”；
- 搜索、SEO、GEO 和后续 AI Creator 能获得更可靠的静态上下文；
- Ragnarök 等 Story Series 的 `content-ready` 状态变得可计算。

不在本计划内：

- 新的站点主题或文明专属 UI；
- 把 Astro 改成 SPA；
- 公共 canonical content 改读 D1；
- 卡牌稀有度、套数、定价、供应链；
- 为了视觉量先批量生成未经内容审校的图片；
- 完整英文长文翻译。英文名称、alias 与 URL 兼容属于本轮，英文正文另立本地化计划。

---

# 22. Collection Handoff Gate

在上述 Content DoD 达成前：

```text
不确定最终 Collection 数量
不确定每套 Card Count
不锁定第一套画风
不为了“凑卡”增加 Story / Character
```

内容完成之后，再对每个 Story Cycle 自动计算：

```text
Story Count
Core Character Count
Scene Count
MythicObject Count
Narrative Continuity
Visual Diversity
Natural Card Capacity
Cross-cycle Dependency
```

再决定：

```text
哪些独立成系列
哪些应该合并
哪些更适合 Art Collection
哪些不适合商品化
```

Collection 必须是内容体系的结果，而不是前置约束。

---

# 23. 当前执行优先级（2026-09-07 执行态）

Phase 0～8 的机器侧交付已经落地；当前不再重复补数据或批量生成图片，进入“人工 Gate 收口”阶段。当前基线、差异和批次入口以以下自动产物为准：

- `docs/NORSE_COMPLETION_SNAPSHOT.md`：整体 Gate 快照；
- `docs/NORSE_EDITORIAL_REVIEW_QUEUE.md`：逐篇来源审校队列；
- `docs/NORSE_REVIEW_HANDOFF.md`：按 Cycle 拆分的人工交接单；
- `docs/NORSE_VISUAL_REVIEW_QUEUE.md`：World 双端视觉 QA；
- `docs/NORSE_STORY_VISUAL_REVIEW_QUEUE.md`：Story key-moment 视觉 QA；
- `docs/NORSE_COLLECTION_HANDOFF.md`：Collection Discovery 的阻塞状态。
- `docs/NORSE_REMOTE_D1_AUDIT.md`：远端 D1 只读 schema / 数据镜像审计；
- `docs/NORSE_PHASE_CLOSEOUT_RUNBOOK.md`：剩余内容/产品与工程/环境 Gate 的逐步执行单；
- `scripts/smoke-norse-production.mjs`：指定正式域名后执行只读页面、Graph API、sitemap 与 R2 HEAD smoke；
- `src/content/norse/collection-signoff.ts`：Phase 6 identity audit、产品负责人签字与 Completion Snapshot 独立批准记录的唯一回写位置；三者的审批证据必须绑定报告生成的 `snapshotVersion`，默认必须保持 `pending`。

最终认证命令为 `npm run content:certify:norse`；普通 `npm run content:coverage:norse` 只生成证据快照，不代表所有人工 Gate 已通过。认证命令失败时必须按输出逐项处理，不能以报告文件中的文字状态代替。

当前执行顺序：

```text
P0-1 修复现有北欧事实错误并保留 URL 兼容
    ↓
P0-2 生成 inventory / readiness 基线与迁移状态
    ↓
P0-3 前置通用模型：editorial status / taxonomy / MythicObject / manifest dependency
    ↓
P0-4 建立 Source Registry 与 Edition / License 策略
    ↓
P0-5 填满 P0 Source Coverage Matrix
    ↓
P0-6 冻结 9 条 Story Cycle 的唯一 Story Manifest
    ↓
P0-7 生成 Semantic Dependency Gap List
    ↓
P0-8 按 `NORSE_REVIEW_HANDOFF.md` 完成具名来源审校
    ↓
P0-9 完成 World / Story 视觉 QA 与产品签字
    ↓
P0-10 生成 Completion Snapshot，完成独立人工批准，确认 Collection Discovery 是否解锁
```

P0-10 的可执行顺序固定为：

```text
完成内容与视觉决定 → 生成 Snapshot A → 写入身份/产品记录 → 生成 Snapshot B
→ 如 B ≠ A 则按 B 重绑并重跑 → 最终版本稳定 → 独立 Snapshot approval → certify
```

当前人工 Gate 收口必须能直接回答：

```text
保留、合并、拆分、重写、下线哪些现有 Story
缺哪些新 Story
缺哪些 Character / World / Scene / MythicObject / Concept
哪些关系存在冲突版本
哪些来源只做 supporting claim
哪些 P1/P2 明确延期
```

为降低人工审校的领取成本，`docs/NORSE_REVIEW_HANDOFF.md` 会把 Story 来源审校拆成每包最多 4 篇的唯一工作包：同一 Story 即使属于多个 Cycle，也只在一个工作包中分配一次；跨 Cycle 关系仍保留在 Cycle 级表和 Manifest 中。工作包的 `可领取` 只代表机器预审通过，不代表人工批准。

得到这份经审校的 Gap List 以后，才允许解锁 Collection Discovery。Phase 3～8 的内容、依赖、视觉和网站机器侧工作已完成；若人工审校发现事实或依赖缺口，再以修订 PR 回补，不把新的批量扩写当作当前默认任务。

仍暂不进入：

```text
Collection
Card Manifest
实体卡
盲抽
稀有度
卡面设计
供应链
```

## 23.1 机器侧已完成工作包与当前剩余动作

| 顺序 | 工作包 | 主要文件 | 当前结果 |
|---:|---|---|---|
| 1 | P0 事实热修 | `catalog.ts`、`stories.ts`、redirect 配置、测试 | 已完成；P0 已知问题已进入 resolved / scoped 记录 |
| 2 | Completion 基础类型 | `types.ts`、registry、validation、architecture | 已完成；支持 editorial / visual / provenance gate |
| 3 | Norse Source Registry | `sources.ts` | 已完成；45 个来源已注册并映射 |
| 4 | Coverage + Story Manifest | `source-coverage.ts`、`story-manifest.ts` | 已完成；74 个 Story 单元、依赖闭包无缺口 |
| 5 | Coverage Reporter | `scripts/report-norse-content-coverage.mjs`、测试 | 已完成；可区分 inventory / machine-ready / human-approved |
| 6 | World 双端视觉草稿 | `assets.ts`、`public/art/` | 已完成 8 / 8 组；当前仍待人工批准 |
| 7 | Story key-moment 槽位 | `story-illustrations.ts`、`stories.ts`、`public/art/` | 已归属 74 / 74；当前仍待人工批准 |
| 8 | Tier S/A Character 视觉发布覆盖 | `published-artworks.ts`、`visual-tiers.ts`、Norse content test | 机器侧已覆盖 Tier S 12 / 12 双端、Tier A 16 / 16 画像；本地 R2 代表性 HEAD smoke 已通过；不替代人工视觉批准与生产全量对照 |
| 9 | 人工交接包 | `NORSE_REVIEW_HANDOFF.md`、`NORSE_PHASE_CLOSEOUT_RUNBOOK.md`、身份审计队列、审校队列、`collection-signoff.ts` | 已生成；等待具名审校、产品签字与独立 Snapshot approval |
| 10 | Local D1 与本地 HTTP smoke | `migration:check`、`content:import --all --apply --local`、D1 对照查询、local HTTP smoke、Worker preview smoke | 已完成；Norse 92 Character / 58 Relation / 8 World / 15 Scene / 18 Object / 7 Name / 4 Interpretation / 45 Source 与静态包对齐，角色/Story/World/Graph API/概念关系页均返回 200；Worker preview 下同样验证角色/Story/World/Graph API 200，并验证 Odin scope selection 与指定传统 14 节点 / 13 关系；`content:remote:audit` 已加入远端执行前置检查，remote / production 仍待执行 |
| 11 | Local browser 核心矩阵 | `NORSE_CHARACTER_DETAIL_GRAPH_INTEGRATION_PLAN.md`、`CharacterHero.astro` | 已完成；Desktop Light/Dark 的 Odin、Loki、Tyr、Fenrir 与 Mobile 的 Thor、Freyja 均完成图谱打开/范围切换/重置/关闭/重开核心路径，移动端无横向溢出；API 失败降级、loopback-only WebGL/graph-init failure injection、Canvas open/close ×10、监听器与 renderer resource profile、移动端 browser back 已验证；GPU telemetry 与真实硬件 WebGL 差异仍待验收 |
| 12 | Production smoke 执行器 | `scripts/smoke-norse-production.mjs`、`NORSE_PHASE_CLOSEOUT_RUNBOOK.md` | 已完成只读执行器；必须传入已确认的正式 URL，覆盖角色/神话/Story/World 页面、Graph 默认与指定 scope、无效角色、sitemap、Tier S R2 desktop/mobile HEAD；本地 Worker 预览 10 / 10 通过，正式环境仍待 migration/import/deploy 后执行 |

部署保护：`.github/workflows/deploy-cloudflare.yml` 已将 `content:certify:norse`、schema-only preflight、remote strict mirror audit 和正式 smoke 串成不可跳过的顺序，并要求显式配置 `MYTHCANVAS_PRODUCTION_URL`；未通过认证或 D1 对照时不会进入正式部署。该 workflow 变更本身不代表远端已执行，仍需在认证恢复、人工 Gate 完成和维护窗口内运行。

当前剩余动作分为两条并行轨道：

1. **内容与产品 Gate**：按交接单完成 Story 来源审校、Phase 6 身份/事实审计、World / Story 视觉 QA、P2 排除项决策、product sign-off 和独立 Completion Snapshot approval。
2. **工程与环境 Gate**：已完成 loopback-only WebGL/graph-init failure injection、Desktop Light/Dark + Mobile 浏览器核心矩阵、listener 生命周期与 renderer resource profile；远端只读审计已完成但发现仅应用至 0038、0039–0041 pending 且 Norse 镜像过旧。仍需完成 GPU telemetry、真实硬件 WebGL 差异、远端迁移/structured import、remote D1 对照、production deploy 与 production smoke。

本轮已完成的 API 失败降级、Canvas open/close ×10 资源回收与移动端无横向溢出，仅证明可复现的本地 smoke 子集，不能替代上述完整 Gate。任何内容或实现修订都应从具体 reviewer 决定与 evidence 出发。

环境备注：2026-09-07 的成功只读审计确认远端 `d1_migrations` 已应用至 `0038_english_core_content.sql`，`0039_structured_content_objects_and_sources.sql`、`0040_taxonomy_semantic_kind.sql`、`0041_character_relation_pursues_type.sql` 仍 pending；远端 Norse 镜像为 32 Character / 4 Source / 0 Concept / 12 Scene，和当前静态包不一致，且缺少 `mythic_objects`、`content_relations` 等 schema。随后 Wrangler 会话出现 `9109 Invalid access token` / D1 `10000 Authentication error`，因此当前首先需要重新认证并重跑只读审计。详见 `docs/NORSE_REMOTE_D1_AUDIT.md`。在完成远端备份/回滚确认、migration、structured import 和只读对照前，不执行 production deploy；此前记录的 7403 已不再是当前阻塞原因。

### Phase 状态矩阵

| Phase | 当前状态 | 证据 | 未完成项 |
|---|---|---|---|
| 0～2 | 机器侧完成 | `NORSE_STORY_MAP.md`、Coverage Report、Source Preflight | 人工来源审校不由自动化替代 |
| 3～5 | 内容与依赖闭环完成 | 74 / 74 Story、required dependency gap = 0 | P0 具名来源审校 0 / 56 |
| 6 | 自动审计完成 | 45 sources、0 issue、关系/来源/身份层校验通过；7 names / 4 interpretations / 10 claims | 争议项需人工确认 |
| 7 | 视觉机器交付完成 | Tier S/A Character 覆盖 28 / 28；World 8 / 8、Story key-moment 74 / 74；World 已符合最终 OutputSpec 尺寸；本地 R2 代表性 HEAD smoke 通过 | World 批准 0 / 8、Story 批准 0 / 74；最终派生图仍需人工清晰度/构图 QA，生产 R2-D1 全量对照待远端重新认证、migration 与 import |
| 8 | 工程交付验证完成 | sitemap gate、无 JS 静态路径、`npm run check`、`content:coverage:norse`、Local browser 核心矩阵、loopback-only failure injection、listener/renderer resource profile、`wrangler check startup` | GPU telemetry、真实硬件 WebGL 差异与正式上线仍依赖后续 Gate |
| 9 | 进行中 | Snapshot、Collection Handoff、Review Handoff、Remote D1 Audit 已生成；Tier S/A 静态视觉覆盖、Local D1 镜像、本地 HTTP smoke、Worker preview smoke、Local browser 核心矩阵、loopback-only failure injection 与 listener/renderer resource profile 已完成 | P0 来源、身份审计、World/Story 视觉人工批准、产品签字、独立 Snapshot approval、GPU telemetry、真实硬件 WebGL 差异、remote migration/import、production 烟测尚未完成；远端上次成功只读审计时 schema 停留在 0038 且 Norse 镜像过旧，当前 Wrangler 需重新认证 |

## 23.2 PR 规则

- 一次 PR 不横跨两个 Phase，除非只是让前置类型与首个示例一起可编译；
- 内容 PR 必须附 source locator 与 Coverage diff；
- 新增实体必须说明由哪个 Story dependency 驱动；
- 自动生成文本不可直接标 `source-reviewed`；
- 修正已有 canonical slug 时，同 PR 提供 redirect 与测试；
- 大量机械数据变更与模型变更分开提交，便于 review / rollback；
- 每个完成 Cycle 都更新 completion snapshot 草稿，但只有 Phase 9 才发布最终认证。

---

# 24. 最终原则

北欧神话补全采用统一方法：

> **Source drives Story  
> Story drives Entity  
> Evidence drives Visual  
> Story Cycle drives Collection**

而不是：

> Character List drives mythology  
> 或 Collection drives Story。

北欧一旦按本方案跑通，就应成为 MythCanvas 后续日本、希腊、埃及等神话体系“先完整内容内核、再系列化收藏”的标准 Completion Pipeline。
