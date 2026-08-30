# MythCanvas 希腊神话完整补全方案

> 状态：Review Proposal  
> 版本：V1.1  
> 日期：2026-08-30  
> 适用范围：希腊神话内容建模、人物扩充、神谱关系、神域/场景、故事、来源体系、视觉资产、页面展示与后续 AI 出图。  
> 相关文档：`docs/CONTENT_POSITIONING.md`、`docs/CHARACTER_ART_SYSTEM.md`、`docs/CHINESE_MYTHOLOGY_CHARACTERS_PLAN.md`、`.agents/skills/mythcanvas-content-model/SKILL.md`

---

## 0. 结论

当前希腊神话已经具备一个可用骨架，但还不是完整的“神话体系”：

- 已有 `myth-greek`；
- 已有 `world-olympus`；
- 已有 12 个高认知人物；
- 12 个角色已有较完整 Canonical Design；
- Artemis 已完成来源、解释层、Variant、World 关联等较完整 Character Production；
- 已有少量 Story、Scene 和 Olympus 视觉资产；
- `character_relations`、`character_interpretations`、`character_names` 等 Schema 已能承载复杂神谱与多版本来源。

当前最大缺口不是页面，而是内容图谱本身。

本轮不定义为“补到固定 48 个角色”，而定义为：

> **先确定完整核心故事主线，再通过 Story Dependency Closure 反推必须存在的 Character / World / Scene / Relation / Source，完成 MythCanvas 第一套来源可信、依赖闭包、可视觉化的完整神话知识图谱。**

希腊体系完成后，应沉淀一份可复用的 `MYTHOLOGY_COMPLETENESS_STANDARD.md`，供北欧、日本、埃及、印度、中国等体系复用。

---

# 1. V1.1 的核心调整

相比 V1.0，本版做 8 个关键修正。

## 1.1 固定 48 Character → Story Dependency Closure

不再先按“原初神 6 + 泰坦 14 + 英雄 6 + 怪物 6”凑数量。

改成：

```text
P0 Story Manifest
      ↓
提取故事核心参与者
      ↓
补神谱祖先 / 父母 / 配偶 / 敌对关系依赖
      ↓
得到 P0 Character Closure
      ↓
补 World / Scene / Relation / Source
```

原则：

- 每个 P0 Character 必须能解释“为什么存在”；
- P0 Story 不允许引用不存在的核心 Character；
- 不为了分类整齐强行把低连接度人物提前塞进 P0；
- Character 总数是结果，不是目标。

预计 P0 Character Closure 最终约 **50–60 个**，以实际故事闭包结果为准。

## 1.2 `character_type` 与神族分类拆开

不再把 `primordial / titan / olympian / deity / hero / monster` 混进一个字段。

稳定实体类型：

```text
character_type
├── deity
├── hero
├── mortal
├── monster
├── creature
└── collective
```

神族 / 世代 / 阵营通过 taxonomy tags 表达：

```text
taxonomy_tags
├── primordial
├── titan
├── olympian
├── chthonic
├── sea-deity
├── nature-deity
├── hero-age
├── argonaut
├── trojan
└── odyssey
```

例如：

```text
Zeus
character_type = deity
taxonomy_tags = [olympian, sky-deity, king-of-gods]

Hades
character_type = deity
taxonomy_tags = [olympian-generation, chthonic, underworld]

Medusa
character_type = monster
taxonomy_tags = [gorgon, perseus-cycle]
```

## 1.3 删除 `Relation >= 150` 数量 KPI

Relation 的目标改为：

> **P0 Genealogy Dependency Coverage = 100%**

数量不再作为验收条件，避免为了凑数存储重复的 parent/child、sibling/sibling 双向数据。

## 1.4 删除 `Heroic Greece` 作为 World

`Heroic Greece` 本质是叙事时代，不是神域。

P0 World 调整为：

```text
Olympus
Underworld
Tartarus
Sea Realm
Mortal World / Greece（是否独立 World 在实施前由现有 World 语义校验决定）
```

英雄时代、特洛伊周期、奥德赛属于 Story Collection / Editorial Taxonomy。

Athens、Thebes、Crete、Troy、Ithaca、Delphi、Colchis 等进入 Scene / Place。

## 1.5 SourceRef 升级为 Claim-level Source Policy

不再以“角色有一个 SourceRef”作为 100% 覆盖。

来源覆盖按声明类型拆分：

```text
Character
├── identity / role source
├── genealogy relation source
├── interpretation source
└── visual anchor provenance

Story
├── primary narrative source
├── alternate tradition note
└── participating entity references
```

## 1.6 收紧 CharacterInterpretation 使用规则

只有当来源差异会实质改变：

- 身份；
- 神职；
- 稳定视觉锚点；
- 创作 Prompt；

才建 `CharacterInterpretation`。

仅谱系不同、故事情节不同，优先放在 Relation / Story 的 source scope 中。

## 1.7 内容生产从手写 Migration 升级为 Structured Content Pipeline

希腊体系规模进入 50+ Character、30+ Story、数十 Scene 和大量 Relation 后，不应继续把 SQL migration 当作内容 CMS。

目标链路：

```text
content/greek/*
      ↓
validator
      ↓
normalized import manifest
      ↓
D1 importer / migration generator
      ↓
D1
```

## 1.8 视觉资产改为 Tier 制

不再要求全部 P0 角色统一 `Portrait + PC + Mobile`。

按重要度分层生产，避免内容建设被 100+ 张图阻塞。

---

# 2. 当前仓库盘点

## 2.1 已有 Character

当前希腊神话已有 12 个高认知 Character：

- Athena / 雅典娜
- Zeus / 宙斯
- Poseidon / 波塞冬
- Hades / 哈迪斯
- Hera / 赫拉
- Aphrodite / 阿佛洛狄忒
- Apollo / 阿波罗
- Artemis / 阿耳忒弥斯
- Ares / 阿瑞斯
- Hermes / 赫尔墨斯
- Heracles / 赫拉克勒斯
- Persephone / 珀耳塞福涅

这 12 个已在 `migrations/0020_greek_character_canonical_designs.sql` 完成 Generation-grade Canonical Design，原则上保留 ID / slug 并继续增强。

它们是“热门代表角色”，不是标准意义上的十二奥林匹斯神。

当前明确缺少：

- Demeter / 得墨忒耳
- Dionysus / 狄俄尼索斯
- Hephaestus / 赫淮斯托斯
- Hestia / 赫斯提亚

其中 Demeter 与现有《珀耳塞福涅与四季》直接相关，属于立即补齐项。

## 2.2 已有 World / Scene

当前主要只有：

- `world-olympus`
- `scene-temple-of-olympus`

空间表达过度集中在：

```text
白色大理石
黄金
高山
云海
神殿
```

无法覆盖冥界、海洋、人间城邦、克里特迷宫、特洛伊、德尔斐等重要场景。

## 2.3 已有 Story

当前核心希腊 Story：

- 普罗米修斯盗火
- 雅典娜诞生
- 珀耳塞福涅与四季

Story 模型已经支持：

- volume
- sources
- sourceNotes
- characterIds
- worldIds
- sceneIds
- heroAssetId

当前不需要重做 Story Schema。

## 2.4 已有关系 / 来源 Schema

`migrations/0020_character_interpretations.sql` 已提供：

```text
Character
├── character_names
├── character_interpretations
├── character_relations
├── content_concepts
├── source refs
└── scoped variants / reference assets / generation provenance
```

因此希腊神谱不另建 family-tree table，直接基于现有关系模型实现，但需要补“Canonical Relation Storage Rule”。

## 2.5 已有视觉资产

当前希腊静态资产主要集中在：

- Greek Olympus Hero
- Olympus Dawn
- Athena

Story Illustration 仍包含 prototype provenance。

正式补全后需要逐步替换为正式 MythCanvas 原创 / AI 资产及真实 provenance。

---

# 3. 完整度定义

“完整”不定义为收录所有河神、宁芙和地方小神，而定义为：

> 用户可以从宇宙起源开始，连续理解神族更替、奥林匹斯秩序、主要英雄周期、特洛伊战争和奥德修斯归乡；所有关键人物、地点、关系和故事都有可追溯来源，且不存在核心依赖悬空。

## 3.1 P0：主干闭包

P0 硬目标：

```text
Core Story Manifest >= 30
P0 Story Entity Dependency Closure = 100%
P0 Genealogy Dependency Coverage = 100%
P0 Stable Identity Source Coverage = 100%
P0 Core Relation Source Coverage = 100%
P0 Story Primary-source Coverage = 100%
P0 Canonical Design Coverage = 100%
Orphan Entity Reference = 0
```

Character / Scene / Relation 数量均由依赖闭包自然产生，不人为设硬数量。

## 3.2 P1：高质量视觉宇宙

- 扩展非主线高价值神祇、英雄、怪物；
- 重点角色完成多 Interpretation / Variant；
- 核心角色和 World 完成正式视觉资产；
- Story / Character / World / Scene / Artwork 深度互联；
- 完成 Genealogy 产品化；
- 补齐 SEO / GEO。

## 3.3 P2：长尾

- 河神；
- 宁芙；
- 地方神；
- 小型英雄；
- 地方版本；
- 小众怪物；
- 更多希腊化与罗马接收传统。

P2 不阻塞主体系上线。

---

# 4. P0 Story Manifest：先定义主线，再反推实体

P0 Story 是整个补全工程的入口。

## Volume 1：创世与神族更替

1. 混沌与世界诞生
2. 盖亚与乌拉诺斯
3. 克洛诺斯推翻乌拉诺斯
4. 克洛诺斯吞噬子女
5. 宙斯的诞生与成长
6. 泰坦战争 Titanomachy
7. 三兄弟划分世界
8. 宙斯大战堤丰

核心依赖候选：

```text
Chaos
Gaia
Uranus
Tartarus
Nyx
Eros
Cronus
Rhea
Zeus
Hera
Poseidon
Hades
Demeter
Hestia
Typhon
Prometheus
Atlas
```

十二泰坦是否全部进入 P0，不再预设；只有参与核心谱系、Story、Relation Closure 或重要视觉叙事者进入 P0，其余可 P1。

## Volume 2：奥林匹斯秩序

9. 普罗米修斯盗火 ✅
10. 潘多拉
11. 雅典娜诞生 ✅
12. 得墨忒耳与珀耳塞福涅 ✅
13. 阿波罗与德尔斐
14. 赫尔墨斯出生与偷牛
15. 阿佛洛狄忒的诞生
16. 狄俄尼索斯的诞生
17. 赫淮斯托斯与神之锻炉

核心依赖候选：

```text
Prometheus
Pandora
Zeus
Athena
Metis
Demeter
Persephone
Hades
Apollo
Leto
Python
Hermes
Maia
Aphrodite
Dione（若对应谱系版本进入主文）
Dionysus
Semele
Hephaestus
Hera
```

## Volume 3：英雄周期

18. 珀尔修斯与美杜莎
19. 赫拉克勒斯十二伟业
20. 忒修斯与米诺陶洛斯
21. 伊阿宋与金羊毛
22. 俄耳甫斯与欧律狄刻
23. 柏勒洛丰与奇美拉
24. 代达罗斯与伊卡洛斯
25. 阿塔兰忒

核心依赖候选：

```text
Perseus
Medusa
Athena
Hermes
Heracles
Hydra
Cerberus
Theseus
Minotaur
Ariadne
Jason
Medea
Orpheus
Eurydice
Bellerophon
Chimera
Pegasus
Daedalus
Icarus
Atalanta
```

## Volume 4：底比斯与特洛伊

26. 俄狄浦斯与斯芬克斯
27. 帕里斯的裁决
28. 阿喀琉斯之怒
29. 阿喀琉斯与赫克托耳
30. 特洛伊陷落

核心依赖候选：

```text
Oedipus
Sphinx
Paris
Helen
Menelaus
Agamemnon
Achilles
Patroclus
Hector
Priam
Odysseus
Athena
Hera
Aphrodite
```

## Volume 5：奥德修斯归乡

31. 独眼巨人波吕斐摩斯
32. 喀耳刻
33. 塞壬
34. 卡吕普索
35. 重返伊萨卡

核心依赖候选：

```text
Odysseus
Polyphemus
Poseidon
Circe
Sirens（collective）
Calypso
Penelope
Telemachus
Athena
```

## 4.1 Story Dependency Closure 规则

每个 Story 在进入 `published` 前必须满足：

```text
requiredCharacterIds ⊆ Character dataset
requiredWorldIds     ⊆ World dataset
requiredSceneIds     ⊆ Scene dataset
requiredSources      != empty
```

“核心参与人物”必须建 Character；只在一句背景中出现且不参与产品浏览的长尾角色可保留为 Story text，不强制实体化。

最终 P0 Character 清单由上述 Manifest 自动生成后再人工 Review，不在方案阶段硬锁 48。

---

# 5. Character Taxonomy

## 5.1 Stable Entity Type

建议 `character_type` 只描述实体本体：

```text
deity
hero
mortal
monster
creature
collective
```

若当前数据库不限制枚举，可先通过 validation 层约束，不急于重建表 CHECK。

## 5.2 Editorial Taxonomy

通过 `tradition_tags_json` 或后续独立 taxonomy 能力表达：

```text
primordial
titan
olympian
olympian-generation
chthonic
sea-deity
nature-deity
hero-age
argonaut
trojan
odyssey
perseus-cycle
heracles-cycle
theseus-cycle
```

原则：

> `character_type` 解决“它是什么”，taxonomy 解决“它属于哪组 / 哪个时代 / 哪条故事线”。

---

# 6. Character Production 标准

Artemis 继续作为希腊 Character Production 基准。

每个 P0 Character 最低要求：

```text
Character
├── stable identity
├── character_type
├── taxonomy / tradition tags
├── source periods
├── identity source refs
├── canonicality
├── symbols
├── canonical design
├── names / aliases
├── core relations
├── world / scene affinity
├── story linkage
└── generation prompt
```

以下按需创建：

```text
CharacterInterpretation
CharacterVariant
ReferenceAsset
```

## 6.1 Interpretation 创建规则

仅当来源差异会改变以下至少一项时创建：

- 角色稳定身份理解；
- 神职 / 权能；
- 明显视觉锚点；
- 生成 Prompt；
- 用户需要显式切换的传统版本。

### 必须 / 高价值 Interpretation

#### Artemis

已有：

- classical huntress
- later lunar identification

保留。

#### Apollo

稳定身份建议：

> 预言、音乐、弓术与疗愈之神。

后期太阳化作为独立 interpretation / reception layer，与 Helios 区分。

#### Eros

至少：

- primordial cosmic Eros
- later youthful love-god tradition

### 默认不因为谱系冲突建 Interpretation

例如 Aphrodite：

```text
Hesiodic birth tradition
Homeric parentage tradition
```

优先由 Story / Relation source scope 表达。

Hephaestus 出生谱系差异同理。

原则：

> **relation difference != interpretation difference**

---

# 7. Claim-level Source Policy

希腊体系作为第一套标准样板，来源必须从“角色有来源”升级到“关键声明有来源”。

## 7.1 Character

每个 P0 Character 至少覆盖：

### Stable Identity Source

证明其核心身份 / 神职 / 角色定位。

### Genealogy Source

父母、子女、配偶等核心关系不从简介继承，直接挂在 relation source 上。

### Interpretation Source

每个 active Interpretation 至少一个能支撑该解释差异的来源。

### Visual Anchor Provenance

Canonical Design 中：

```text
mythologicalFacts
historically grounded anchors
originalDesignChoices
```

三类必须区分。

不把现代流行设计反写成古典事实。

## 7.2 Story

每篇 P0 Story 至少：

```text
primary source >= 1
alternate tradition note（存在明显版本差异时）
characterIds / worldIds / sceneIds valid
```

## 7.3 Source Hierarchy

优先级：

### 一级：古希腊核心文本

- Hesiod, `Theogony`
- Hesiod, `Works and Days`
- Homer, `Iliad`
- Homer, `Odyssey`
- Homeric Hymns

### 二级：古希腊文学

- Aeschylus
- Sophocles
- Euripides
- Pindar
- Apollonius Rhodius, `Argonautica`

### 三级：古代整理 / 地理材料

- Pseudo-Apollodorus, `Bibliotheca`
- Pausanias

### 罗马接收传统

- Ovid
- Virgil
- Hyginus

必须明确 Roman reception，不作为“希腊唯一原典”。

### 辅助索引

Perseus / Theoi 可用于资料定位，但正式 source refs 应尽量落到具体古代文本 / 章节 / 版本说明。

---

# 8. Character Relation Storage Rule

当前 `character_relations` Schema 可以继续使用，但必须先统一写入规则。

## 8.1 Canonical Storage

### parent

只存：

```text
parent -> child
relation_type = parent
```

UI 反向查询得到 children。

不要同时存 child 反向重复数据。

### consort

对称关系，只存一次。

ID / 排序按稳定规则决定 from / to，例如按 character_id lexical order，避免双写。

### sibling

对称关系，只存一次。

### ally / rival / enemy

默认视为对称关系，只存一次；如果未来需要表达明确方向性，再扩 relation semantics。

### rules-over / serves / created / transformed-into / associated-with / syncretized-with

按语义保持单向。

## 8.2 Source Conflict

不同古代传统存在冲突时，不覆盖：

```text
relation A
source = source A
confidence = high

relation B
source = source B
confidence = high
```

必要时挂 interpretation scope，但不默认创建 Interpretation。

## 8.3 Relation 验收

不再要求“150+”。

改为：

```text
P0 required genealogy edges covered = 100%
P0 relation source coverage = 100%
invalid target = 0
duplicate canonical relation = 0
conflicting relation without source distinction = 0
```

---

# 9. World 与 Scene

## 9.1 World 语义

World 只表达神话宇宙中的稳定空间层，不表达时代 / 故事周期。

### P0 确定

#### Olympus / 奥林匹斯

已有，继续扩充。

#### Underworld / 冥界

核心：

- Hades
- Persephone
- Cerberus
- Styx
- Elysium / Asphodel 等区域

#### Tartarus / 塔耳塔罗斯

作为原初深渊与囚禁空间。

实施前需验证当前 World 产品语义是否允许“世界中的深层区域”独立成 World；如果不允许，则降级为 Underworld 下特殊 Scene Group。

#### Sea Realm / 海洋神域

承载 Poseidon、Oceanus、海怪及海洋神话空间。

### 待决策

#### Mortal World / Greece

若 World 需要承载“人间层”，则使用中性 `Mortal World / Greece`。

若 World 仅用于超自然神域，则人间完全由 Scene / Place 承载，不创建该 World。

**明确不再使用 `Heroic Greece` 作为 World。**

## 9.2 Scene / Place

P0 Scene 不设固定 20 条 KPI，由 Story Manifest 反推。

优先候选：

### Olympus

- Court of the Gods
- Throne of Zeus
- Forge of Hephaestus

### Underworld

- Gate of Hades
- River Styx
- Palace of Hades
- Asphodel Fields
- Elysium

### Sacred Places

- Delphi
- Delos
- Eleusis
- Athens Acropolis

### Hero / Trojan / Odyssey

- Cretan Labyrinth
- Nemea
- Thebes
- Troy
- Ithaca
- Colchis
- Mount Ida
- Prometheus' Rock
- Cave of Polyphemus

是否建实体的判断：

> 被至少一个 P0 Story 直接依赖，或具备高复用视觉价值。

Scene 必须承担：

```text
Story ↔ Scene ↔ World ↔ Character ↔ Artwork
```

连接作用，而不是地点百科数量扩张。

---

# 10. Greek Visual DNA

当前 Greek Visual DNA 更接近 Olympus，需要拆成 Mythology Base + World DNA。

## 10.1 Mythology Base

```text
materials:
- marble
- limestone
- bronze
- terracotta
- linen / woven textile

landscape:
- Aegean coast
- dry Mediterranean hills
- olive groves
- rocky mountains

avoid:
- generic medieval Europe
- Roman imperial visual language used without scope
- modern franchise-specific costume
```

## 10.2 Olympus

```text
palette: marble white / antique gold / Aegean blue
architecture: temple / colonnade / open divine court
atmosphere: bright / sacred / elevated / ordered
```

## 10.3 Underworld

```text
palette: charcoal / deep purple / aged bronze / ash
materials: black stone / bronze / volcanic rock
motifs: Styx / torch / pomegranate / cypress
atmosphere: solemn / still / subterranean / royal
```

禁止：

- skull-covered necromancer cliché
- generic Christian hell
- lava dungeon everywhere

## 10.4 Sea Realm

```text
palette: Aegean blue / sea green / foam white / bronze
materials: limestone / bronze / wet stone
motifs: trident / waves / cliffs / horses / sea foam
atmosphere: elemental / bright / violent / vast
```

## 10.5 Mortal Greece

```text
palette: limestone / olive green / terracotta / bronze
landscape: coast / citadel / olive grove / dry hills
architecture: Mycenaean walls / palace / shrine / harbor
atmosphere: mortal / heroic / sunlit / tragic
```

Prompt 编排继续保持：

```text
Mythology Base DNA
+ World DNA
+ Character Canonical Design
+ Interpretation
+ Variant
+ Style
+ Scene
+ OutputSpec
```

各层正交。

---

# 11. Structured Content Pipeline

这是本轮应同步沉淀的长期能力。

## 11.1 目标目录

建议：

```text
content/greek/
├── mythology.json
├── characters/
│   ├── zeus.json
│   ├── athena.json
│   ├── cronus.json
│   └── ...
├── relations.json
├── worlds.json
├── scenes.json
├── stories/
│   ├── creation-chaos.json
│   ├── titanomachy.json
│   └── ...
└── manifests/
    └── p0.json
```

具体 JSON / YAML / TypeScript 由实现阶段选择，核心要求是：

- 可 diff；
- 可 review；
- 可 validation；
- 不依赖手写 SQL；
- 可生成 D1 import 数据。

## 11.2 Pipeline

```text
structured source
      ↓
content schema validation
      ↓
dependency validation
      ↓
source coverage validation
      ↓
normalized manifest
      ↓
D1 importer / generated migration
```

## 11.3 Migration 定位

Migration 继续负责：

- Schema 演进；
- 必须版本化的系统数据变更；
- production rollout。

但不再作为长期人工编辑 50+ Character / 30+ Story 的主要入口。

## 11.4 Validator 必须检查

```text
stable id / slug uniqueness
mythology foreign keys
story dependency closure
relation target validity
canonical relation duplicates
source coverage
interpretation ownership
primary name uniqueness
world / scene validity
asset provenance completeness
```

---

# 12. 视觉资产生产：Tier 制

P0 聚焦内容图谱，视觉资产按 Tier 推进。

## Tier S：约 12 个最高价值角色

例如：

```text
Zeus
Athena
Poseidon
Hades
Aphrodite
Apollo
Artemis
Medusa
Heracles
Achilles
Odysseus
Persephone
```

最低：

```text
Canonical Portrait
PC Wallpaper
Mobile Wallpaper
```

热门角色再扩多 Style。

## Tier A：核心故事角色

约 15–25 个：

```text
Canonical Portrait
+ PC / Mobile 至少一种 Wallpaper
```

## Tier B：依赖闭包长尾

例如只为神谱 / 故事完整性存在的角色：

```text
Canonical Portrait 或高质量 Symbol Fallback
```

不阻塞 P0。

## World

每个正式 P0 World：

```text
1 Hero
至少 1 PC
至少 1 Mobile
```

## Story

优先复用 Artwork / Character Artwork / World Artwork / Scene Artwork，不建立脱离 Artwork 系统的第二套图片库。

## Prototype 清理

P1 完成前：

- prototype provenance 全部替换；
- source_type / license / creator 完整；
- width / height / alt 完整；
- public asset review 完成。

---

# 13. 页面产品化

## 13.1 Mythology Page

目标信息架构：

```text
希腊神话
├── 故事 Stories
├── 神谱 Genealogy
├── 神灵 Gods
├── 英雄 Heroes
├── 怪物 Monsters
└── 神域 Worlds
```

Genealogy 建议作为希腊详情页一级能力，因为它是理解本体系主干的关键入口。

## 13.2 Genealogy

新增：

```text
character-relations repository
        ↓
CharacterRelations component
        ↓
MythologyGenealogy component
```

默认简洁视图：

```text
Creation
  ↓
Primordial
  ↓
Titans
  ↓
Olympian Order
  ↓
Hero Age
```

Character 展开：

```text
父母
兄弟姐妹
配偶
子女
敌对 / 关联
相关故事
来源
```

不同来源冲突不 merge 成唯一事实。

## 13.3 Character Page

目标：

```text
Identity
Source / Tradition
Canonical DNA
Interpretation（按需）
Variant
Genealogy / Relations
Stories
World / Scenes
Artwork
Creation
```

## 13.4 World Page

目标：

```text
World Identity
Scenes / Landmarks
Characters
Stories
Visual Interpretations
Wallpapers
Related Worlds
```

---

# 14. 实施顺序

## P0-0：先补规范，不先批量灌数据

- [ ] 拆分 `character_type` 与 taxonomy 语义
- [ ] 定义 Canonical Relation Storage Rule
- [ ] 定义 Claim-level Source Policy
- [ ] 收紧 Interpretation 使用规范
- [ ] 修 `.agents/skills/mythcanvas-content-model/SKILL.md` 中 Realm → World 旧术语

## P0-1：建立 Story Manifest

- [ ] 固定 30–35 篇 P0 主线 Story
- [ ] 为每篇列 requiredCharacterIds / requiredSceneIds / requiredSources
- [ ] 建 dependency validator

## P0-2：计算 Character Dependency Closure

- [ ] 从 Story 反推核心参与者
- [ ] 补必要神谱父母 / 配偶 / 敌对依赖
- [ ] 人工 Review 最终 P0 Character 清单
- [ ] 不人为锁 48

## P0-3：建立 Structured Content Pipeline

- [ ] `content/greek/` 源目录
- [ ] schema validator
- [ ] dependency validator
- [ ] source coverage validator
- [ ] normalized import
- [ ] D1 importer / migration generator

## P0-4：补 Character / Relation

- [ ] 修正现有 12 Character source metadata
- [ ] Apollo 等事实边界修正
- [ ] 新增闭包 Character
- [ ] 新增 scoped names
- [ ] 新增必要 Interpretation
- [ ] 完成 required genealogy edges

## P0-5：补 World / Scene

World / Scene 从 Story 和 Character 真实依赖出发建立，不按数量凑齐。

## P0-6：补 Story 正文

- [ ] Story 3 → 30+
- [ ] 每篇 primary source 完整
- [ ] alternate tradition note 按需
- [ ] entity refs 全部闭包

## P0-7：UI 产品化

- [ ] CharacterRelations
- [ ] MythologyGenealogy
- [ ] Gods / Heroes / Monsters taxonomy browse
- [ ] Source / alternate tradition 展示

## P1：视觉资产

- [ ] Tier S
- [ ] Tier A
- [ ] Tier B portrait / fallback
- [ ] World 正式资产
- [ ] prototype provenance 清理

## P2：长尾扩展

进入次级神、地方神、更多英雄、河神、宁芙及更多地方版本。

---

# 15. 验收标准

## 15.1 Narrative Coverage

用户可以连续理解：

```text
宇宙起源
→ 神族更替
→ 泰坦战争
→ 奥林匹斯秩序
→ 主要英雄周期
→ 特洛伊战争
→ 奥德修斯归乡
```

## 15.2 Entity Dependency Closure

```text
P0 Story core Character dependency closure = 100%
P0 Story World dependency closure = 100%
P0 Story Scene dependency closure = 100%
orphan ref = 0
```

## 15.3 Source Coverage

```text
P0 stable identity source coverage = 100%
P0 core genealogy source coverage = 100%
P0 active interpretation source coverage = 100%
P0 story primary-source coverage = 100%
```

## 15.4 Relationship Coverage

```text
required genealogy edge coverage = 100%
duplicate canonical relation = 0
invalid relation target = 0
conflicting relation without source distinction = 0
```

## 15.5 Model Quality

```text
character_type coverage = 100%
taxonomy coverage = 100%
Interpretation only used for identity-level divergence
World does not contain editorial eras
Scene does not duplicate World semantics
```

## 15.6 Visual Coverage

P0 不以全部壁纸完成为阻塞条件。

P1 验收：

```text
Tier S formal visual coverage = 100%
Tier A minimum visual coverage = 100%
public prototype provenance = 0
public asset metadata completeness = 100%
```

## 15.7 用户侧认知验收

用户访问 `/mythology/greek/` 后应该能回答：

1. 世界从哪里开始？
2. 原初神、泰坦、奥林匹斯是什么关系？
3. 宙斯如何取得统治？
4. 主要神祇分别负责什么？
5. 神之间有哪些主要亲缘 / 配偶 / 对立关系？
6. 主要英雄和怪物是谁？
7. 特洛伊战争如何进入希腊神话主线？
8. 《奥德赛》如何承接英雄时代？
9. 同一人物 / 故事存在不同版本时，来源是什么？

---

# 16. 最终信息架构

```text
Greek Mythology
│
├── STORY MANIFEST
│   ├── Creation
│   ├── Divine Succession
│   ├── Olympian Order
│   ├── Hero Cycles
│   ├── Theban / Trojan Cycle
│   └── Odyssey
│
├── CHARACTERS
│   ├── Deities
│   │   ├── Primordial [taxonomy]
│   │   ├── Titans [taxonomy]
│   │   └── Olympians [taxonomy]
│   ├── Heroes
│   ├── Mortals
│   ├── Monsters
│   ├── Creatures
│   └── Collectives
│
├── WORLDS
│   ├── Olympus
│   ├── Underworld
│   ├── Tartarus / Underworld subdomain (待语义确认)
│   └── Sea Realm
│
├── SCENES / PLACES
│   ├── Delphi
│   ├── Athens
│   ├── Crete
│   ├── Thebes
│   ├── Troy
│   ├── Ithaca
│   └── ...
│
├── GENEALOGY
│   └── sourced canonical relationship graph
│
└── ARTWORKS
    ├── Character
    ├── World
    ├── Scene
    ├── Creature
    └── Architecture
```

---

# 17. Review 决策点

V1.1 进入实现前建议重点确认 6 项：

1. **P0 是否接受“Story Dependency Closure 决定 Character 数量”，不再锁 48。**
2. **World 是否只承载超自然神域；若是，则不创建 Mortal World / Greece。**
3. **Tartarus 独立 World 还是 Underworld 下特殊区域。**
4. **Genealogy 是否作为 `/mythology/greek/` 一级能力。**
5. **Structured Content Pipeline 是否与本次希腊补全同步建设。**
6. **P0 聚焦知识图谱，视觉资产按 Tier 放到 P1 是否接受。**

默认建议：

```text
Story-first
Character count = dependency closure result
World = strict spatial semantics
Relation KPI = coverage, not count
Source = claim-level
Interpretation = identity-level divergence only
P0 = content graph
P1 = visual production
```

---

# 18. 后续标准化

希腊 P0 跑通后，将本方案中的通用部分抽离为：

```text
MYTHOLOGY_COMPLETENESS_STANDARD.md
```

标准不规定每个神话都必须有“原初神 → 泰坦 → 奥林匹斯”这种希腊结构，而只规定：

```text
Narrative Coverage
Entity Dependency Closure
Source Coverage
Relationship Coverage
World / Scene Semantics
Interpretation Boundary
Visual Coverage
Orphan Rate
```

这样北欧、日本、埃及、中国、印度可以保留各自真实结构，同时共享同一套内容质量协议。
