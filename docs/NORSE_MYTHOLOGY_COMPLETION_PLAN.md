# MythCanvas 北欧神话体系完整补全计划

> 状态：Canonical Content Completion Plan  
> 版本：V2.0  
> 日期：2026-09-06  
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

当前 `src/content/norse/` 已经形成结构化内容包，实际至少已有：

```text
32 Characters
8 Worlds
12 Scenes
36 MythStories
6 Story Volumes
36 条左右已建关系断言
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

## 2.4 MythStory：36 篇

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

# 6. Source Registry 必须独立

当前 `stories.ts` 内嵌 source constants，随着规模增长会不可维护。

建议新增：

```text
src/content/norse/sources.ts
```

统一维护：

```ts
type NorseSourceRecord = {
  id: string;
  title: string;
  sourceFamily:
    | 'eddic-mythological'
    | 'eddic-heroic'
    | 'prose-edda'
    | 'skaldic'
    | 'legendary-saga'
    | 'regional-medieval'
    | 'material-culture'
    | 'academic-secondary';
  period?: string;
  manuscriptContext?: string;
  language?: string;
  region?: string;
  evidenceRoles: readonly (
    | 'narrative'
    | 'identity'
    | 'relation'
    | 'visual-context'
    | 'reception'
  )[];
  note?: string;
};
```

Story / Claim 只引用 stable `sourceId` + locator。

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

---

# 8. Story Map：9 条内容主干

以下是内容研究层的 Story Cycle，不直接等于页面 Volume，也不直接等于未来 Collection。

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

不要立刻新增第二套重复的 `StorySeries` domain entity。

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
  objectType: MythicObjectType;
  summary: string;
  ownerCharacterIds?: readonly string[];
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

---

# 17. Story Dependency Closure

每个 Story 必须声明：

```text
requiredCharacterIds
requiredWorldIds
requiredSceneIds
requiredObjectIds
requiredSourceIds
storyCycleIds / taxonomy mapping
```

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

---

# 19. 自动验证与 Coverage Report

北欧补全不能继续只靠人工 review。

建议把现有 mythology validation 抽成通用能力，并输出：

```text
reports/norse-content-coverage.json
```

至少包含：

```text
sourceCoverage
storyCoverage
storyDependencyCoverage
characterSourceCoverage
worldSourceCoverage
objectSourceCoverage
relationSourceCoverage
aliasCollisions
missingReferences
orphanEntities
unscopedContestedClaims
visualReadiness
knownIssueStatus
```

## CI Gate

P0 完成阶段加入：

```text
required dependency missing            → fail
required source missing                → fail
duplicate id / slug                    → fail
alias collision unresolved             → fail
P0 source matrix blank                 → fail
unscoped conflicting core claim        → fail
known P0 factual issue unresolved      → fail
```

图片未全部完成可以 warning，不应该阻塞早期 Story research branch。

---

# 20. 实施阶段

## Phase 0：Baseline Audit + 已知错误修复

先把现状变成可信基线。

交付：

- 修正 P0 已知错误；
- 重新统计 Character / World / Scene / Story；
- 生成 current coverage snapshot；
- 不新增大量内容。

### Done

```text
Known factual P0 issues = 0
Current entity references valid = 100%
```

---

## Phase 1：Source Registry + Coverage Matrix

新增：

```text
src/content/norse/sources.ts
src/content/norse/source-coverage.ts
```

完成：

- Eddic Mythological coverage；
- Prose Edda coverage；
- Skaldic coverage；
- Heroic Edda coverage；
- Saga / regional witness inventory；
- Material evidence registry strategy。

### Done

P0 Source Matrix：

```text
100% = covered / partial / excluded-with-reason
0 blank
```

---

## Phase 2：Story Map Freeze

先确定最终 Story Map，再加实体。

输出：

```text
9 Story Cycles
每个 Cycle 的 Story Manifest
每篇 Story source scope
每篇 Story dependency draft
```

推荐把 70～90 作为容量预估，不作为硬数。

### Done

所有 P0 source 都能定位到：

```text
Story
或 supporting claim
或 explicit exclusion reason
```

---

## Phase 3：Divine Mythology Dependency Closure

优先补：

```text
Cycle 01 Origins
Cycle 02 Divine Order
Cycle 03 Odin
Cycle 04 Thor
Cycle 05 Loki
Cycle 06 Baldr / Ragnarök
```

按 Story 顺序补：

```text
Character
World
Scene
MythicObject
Relation
```

而不是一次性先灌 Character。

### Done

Divine P0 Story dependency closure = 100%。

---

## Phase 4：Heroic Tradition Completion

再补：

```text
Cycle 07 Völsung / Sigurd / Guðrún / Atli
Cycle 08 Helgi
Cycle 09 Völundr / independent Eddic traditions
```

并给 `MythStoryKind` 增加更准确的：

```text
heroic-legend
```

不要把全部英雄诗标为普通 `myth`。

### Done

Heroic P0 source coverage resolved = 100%。

---

## Phase 5：Entity Taxonomy + MythicObject + Relations

完成跨内容模型升级：

- group / being-class / lineage 分离；
- MythicObject；
- Story object dependencies；
- relation semantics；
- alias / native name；
- World / Scene granularity review。

### Done

核心实体无悬空、无错误类别。

---

## Phase 6：Source / Claim Deep Audit

逐 Story / Relation 审计：

- source locator；
- manuscript / tradition scope；
- conflicting claims；
- Snorri-only reconstruction；
- late regional versions；
- Christian learned framing；
- modern popular contamination。

### Done

```text
Core source coverage = 100%
Unscoped conflicting core claims = 0
```

---

## Phase 7：Visual Readiness

内容稳定后再系统补图。

按：

```text
Mythological Facts
+ Material Culture Evidence
+ MythCanvas Original Design
```

补：

- Tier S / A Character Canonical Design；
- World / Scene；
- MythicObject；
- PC / mobile compositions；
- Story mother scenes。

### Done

所有未来可能进入 Collection 的核心对象 = `visual-ready`。

---

## Phase 8：网站内容上线

确保：

- Mythology 页面能完整阅读；
- Character / World / Story 互链；
- source notes 清晰但不过度学术化；
- Story detail route / SEO / sitemap 正常；
- 核心内容 SSR；
- 中英文 alias 为后续 i18n 做准备。

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
- 主要 heroic tradition 不再只有 Sigurd 4 篇。

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
- modern franchise contamination = 0。

## Visual

- Tier S / A 核心对象拥有稳定 Canonical Design；
- material culture 与 mythology fact 分离；
- PC / mobile 仍保持独立 composition 原则。

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

# 23. 当前执行优先级

下一步只做：

```text
P0-1 修现有北欧事实错误
    ↓
P0-2 Source Registry
    ↓
P0-3 Source Coverage Matrix
    ↓
P0-4 冻结 9 条 Story Cycle 的完整 Story Manifest
    ↓
P0-5 Dependency Gap Analysis
```

得到明确 Gap List 以后，才进入：

```text
新增 Character / World / Scene / MythicObject
```

暂不进入：

```text
Collection
Card Manifest
实体卡
盲抽
稀有度
卡面设计
供应链
```

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