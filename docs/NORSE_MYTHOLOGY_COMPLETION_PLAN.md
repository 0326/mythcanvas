# MythCanvas 北欧神话完整补全方案

> 状态：Review Proposal  
> 版本：V1.0  
> 日期：2026-09-01  
> 适用范围：北欧神话内容建模、人物扩充、神谱关系、World / Scene、故事、来源体系、视觉资产、页面展示、结构化内容流水线与后续 AI 出图。  
> 相关文档：`docs/GREEK_MYTHOLOGY_COMPLETION_PLAN.md`、`docs/CONTENT_POSITIONING.md`、`docs/CHARACTER_ART_SYSTEM.md`、`.agents/skills/mythcanvas-content-model/SKILL.md`

---

## 0. 结论

当前北欧神话已经有一个可用的首发骨架，但距离“完整神话体系”仍有明显差距。

仓库当前已经具备：

- `myth-norse`；
- `world-asgard`；
- 12 个高认知 Character；
- 12 个角色均已有 Generation-grade Canonical Design；
- 3 篇核心 Story：尤弥尔创世、奥丁悬于世界树、诸神黄昏；
- 世界树、符文、乌鸦、长船、冰石与极光等基础 Norse Visual DNA；
- Character Relation、Interpretation、Variant、World、Scene、Story 等通用 Schema；
- 希腊神话已经落地的 Structured Content Pipeline、来源校验、关系图谱、Story 页面与内容验证能力。

但当前北欧内容仍然呈现为：

```text
北欧神话
  → 阿斯加德
  → 12 个代表人物
  → 3 篇故事
  → 少量复用 Scene / Hero
```

完整目标应变成：

```text
北欧神话
  → 创世与宇宙结构
  → 阿萨神族 / 华纳神族 / 约顿诸族
  → 奥丁知识体系
  → 索尔与巨人冲突
  → 洛基与诸神秩序
  → 巴德尔之死
  → 诸神黄昏与再生
  → 沃尔松格英雄传统
  → Story 驱动的 World / Scene / Character 闭包
  → 来源化 Relation / Interpretation
  → 完整视觉资产与 AI 出图能力
```

本轮不应定义为“再加几十个北欧角色”，而应定义为：

> **把北欧神话建设成 MythCanvas 第二套完整神话内容宇宙，同时验证希腊阶段沉淀的内容工程能力可以跨文明复用，而不是继续制造 Greek-only 特例。**

### 本方案的三个核心决策

1. **Story First**：先确定主线 Story Manifest，再由 Story 依赖反推 Character / World / Scene / Relation，不按百科名单批量灌数据。
2. **Source Scoped**：北欧现存资料存在成书晚、版本差异大、诗歌与斯诺里整理互相补充等问题，关键声明必须挂来源范围，不能合成为“唯一正史”。
3. **不硬编码现代“九界地图”**：古代文本提到“九个世界/九界”，但并没有留下一个统一、完整、无争议的固定九界清单与现代地图。产品层只建有明确来源和故事价值的 World，并对 `Niflheim / Niflhel / Hel`、`Niðavellir / Svartálfaheimr` 等问题保留来源差异。

---

# 1. 当前仓库盘点

## 1.1 已有人物：12 个

当前北欧神话已有：

1. Freyja / 芙蕾雅
2. Odin / 奥丁
3. Thor / 索尔
4. Loki / 洛基
5. Frigg / 弗丽嘉
6. Baldr / 巴德尔
7. Heimdall / 海姆达尔
8. Tyr / 提尔
9. Freyr / 弗雷
10. Hel / 海拉
11. Fenrir / 芬里尔
12. Jörmungandr / 耶梦加得

这些 ID / slug 已进入现有内容体系，必须保留，不因本轮补全改变公开 URL。

`migrations/0021_norse_character_canonical_designs.sql` 已为这 12 个角色补齐较完整 Canonical Design，包括：

- 身份锚点；
- silhouette；
- appearance；
- costume language；
- temperament；
- mythological facts；
- original design choices；
- avoid；
- canonical prompt。

因此本轮对这 12 个角色的重点不是“重做角色设计”，而是：

```text
补来源
+ 补 taxonomy
+ 补关系
+ 补 Story linkage
+ 补 World / Scene affinity
+ 补正式视觉资产覆盖
```

## 1.2 已有 Story：3 篇

当前 `src/data/stories.ts` 中已有：

- `story-ymir-creation` / 尤弥尔与世界的诞生；
- `story-odin-world-tree` / 奥丁悬于世界树；
- `story-ragnarok` / 诸神黄昏。

它们已经提供了不错的主线起点，但当前仍存在内容图谱缺口：

- 尤弥尔 Story 没有挂 `Ymir / Odin / Vili / Vé` 等 Character；
- 奥丁世界树 Story 没有挂 Odin；
- Ragnarök Story 没有挂 Odin / Thor / Loki / Fenrir / Jörmungandr / Freyr / Heimdall 等核心参与者；
- 三篇 Story 大量复用 `world-asgard` + `scene-world-tree-roots`，空间语义过于粗糙；
- “尤弥尔创世”的来源目前写成宽泛的《诗体埃达》+《散文埃达》，后续应下沉至具体篇目 / 章节。

这些 Story 保留原 ID / slug，但在 Structured Content 迁移时升级为正式 P0 Story。

## 1.3 已有 World / Scene

当前北欧核心 World 只有：

- `world-asgard` / 阿斯加德。

这会导致当前所有内容视觉上过度集中在：

```text
冰雪
极光
巨石
世界树
彩虹桥
```

而北欧神话真正需要覆盖的空间还包括：

- 人类生活的 Midgard；
- 约顿活动的 Jötunheimr；
- 亡者世界 Hel；
- 火焰边界 Muspell；
- 雾寒空间 Niflheim；
- 华纳神族相关 Vanaheimr；
- 与精灵相关 Álfheimr；
- 海洋、山地、宴会厅、锻造场、井泉、道路、战场等大量 Scene。

## 1.4 当前 Visual DNA 的问题

当前 Norse Visual DNA 作为首发识别足够，但更接近“北欧奇幻封面”的第一层印象：

```text
冰蓝 / 岩灰 / 极光绿
世界树 / 符文 / 乌鸦 / 长船
巨石 / 冰晶 / 铁
苍茫 / 寒冷 / 史诗
```

需要扩展为更完整的文化视觉语言，否则后续批量出图容易出现：

- 每一张都是雪山 + 极光；
- 每个神都穿重型皮毛铠甲；
- 符文被当成通用发光特效；
- 所有 Jötunn 都变成蓝色冰巨人；
- 所有建筑都变成现代游戏式巨大石堡；
- Thor / Loki / Odin 滑向现代影视或游戏既有设计。

## 1.5 已具备可复用的希腊内容能力

希腊补全阶段已经证明以下结构可工作：

```text
src/content/greek/
├── catalog.ts
├── stories.ts
├── assets.ts
├── visual-tiers.ts
└── index.md

scripts/
└── sync-greek-content.mjs
```

并已接通：

- Story dependency validation；
- source coverage validation；
- taxonomy；
- Character Relation；
- World / Scene；
- Story 详情页；
- Mythology 页面故事卷目；
- Character relation / graph；
- sitemap；
- artwork provenance audit。

北欧不应复制一套完全独立的 `norse-only` 工具链，而应借第二个文明进入 Structured Content 的机会，把 Greek-only 能力提炼为通用 Mythology Content Pipeline。

---

# 2. “完整”的定义

北欧神话的“完整”不意味着收录所有诗歌中出现过一次的名字，也不意味着做一份无限扩张的百科。

本项目中的完整定义是：

> 用户可以从宇宙诞生开始，连续理解世界结构、主要神族、奥丁求知、索尔与巨人的冲突、洛基造成的秩序裂缝、巴德尔之死、诸神黄昏与世界再生，并能够继续进入最重要的沃尔松格英雄传统；所有核心参与者、地点、关系和故事都有来源，不存在关键依赖悬空。

## 2.1 P0：主干闭包

P0 硬目标：

```text
Core Story Manifest >= 30
P0 Story Entity Dependency Closure = 100%
P0 Genealogy Dependency Coverage = 100%
P0 Stable Identity Source Coverage = 100%
P0 Core Relation Source Coverage = 100%
P0 Story Primary-source Coverage = 100%
P0 Canonical Design Coverage = 100%
Conflicting-source Claims Without Scope = 0
Orphan Entity Reference = 0
```

Character / World / Scene / Relation 数量由 Story 与谱系依赖闭包自然产生，不人为锁定“必须 48 个”或“必须 9 个 World”。

## 2.2 P1：高质量内容宇宙

- 扩展非主线但高价值的神祇、Jötunn、矮人、怪物和英雄；
- 高价值角色增加 Interpretation / Variant；
- Tier S / Tier A 角色完成正式视觉覆盖；
- 核心 World 完成 desktop + mobile hero；
- Story / Character / World / Scene / Artwork 深度互联；
- Character Graph 能真实表现北欧神谱与叙事网络；
- SEO / GEO / alias / Old Norse 名称覆盖完善；
- 公共 Artwork provenance 审计为 0 问题。

## 2.3 P2：长尾与接收传统

- 小众神祇；
- 地方传说；
- 更多矮人；
- 更多 Valkyrie 个体；
- 更多 heroic lays；
- 冰岛家族传奇中与神话边界相邻的内容；
- Saxo 等不同地区版本；
- 后世民俗；
- 现代学术争议与 reception layer。

P2 不阻塞北欧主体系上线。

---

# 3. 来源体系与版本策略

北欧神话必须比一般“神话百科”更重视来源层。

原因不是要把产品做成学术数据库，而是北欧神话非常容易被现代流行文化重新塑形。如果来源层不明确，后续 Canonical Design、关系图和 AI Prompt 都会把现代二创反写成古典事实。

## 3.1 一级来源：Eddic Poetry

P0 优先使用具体诗篇，而不是只写“《诗体埃达》”。

核心包括：

- `Völuspá` / 《女巫预言》；
- `Hávamál` / 《高者之歌》；
- `Vafþrúðnismál`；
- `Grímnismál`；
- `Skírnismál`；
- `Hárbarðsljóð`；
- `Hymiskviða`；
- `Lokasenna`；
- `Þrymskviða`；
- `Alvíssmál`；
- `Baldrs draumar`；
- 以及沃尔松格 / Sigurðr 相关英雄诗篇。

SourceRef 尽量记录：

```text
work
+ poem / section
+ stanza / chapter（可稳定定位时）
+ edition / translation note（需要时）
```

## 3.2 二级来源：Prose Edda

重点：

- `Gylfaginning`；
- `Skáldskaparmál`。

斯诺里的整理对现存北欧神话知识极其重要，但不能把它默认视作所有更早口传传统的无损记录。

因此：

- 可以作为 P0 Primary / Core Source；
- 但与 Eddic Poetry 出现差异时需要 source scope；
- 对仅见于 Snorri 的完整叙事，应在 Story / sourceNotes 中明确其文本来源。

## 3.3 三级来源：Skaldic Poetry

高价值来源包括：

- `Haustlöng`；
- `Húsdrápa`；
- `Þórsdrápa`。

它们尤其适合支撑：

- Iðunn 与 Þjazi；
- Baldr 葬礼；
- Thor 与 Geirröðr；
- 早期视觉和叙事意象。

## 3.4 四级来源：后期中世纪与传奇传统

包括但不限于：

- `Völsunga saga`；
- `Ynglinga saga / Heimskringla`；
- Saxo Grammaticus, `Gesta Danorum`；
- `Sörla þáttr` 等。

规则：

> **可以进入 MythCanvas，但必须标注来源层，不得静默覆盖 Eddic tradition。**

例如 Saxo 中 Balder / Høther 的叙事与 Eddic Baldr / Höðr 传统差异明显，应视为独立 tradition / Story scope，而不是简单改写现有巴德尔关系。

## 3.5 辅助资料

现代博物馆、学术词典、研究著作、可靠索引可以用于：

- 找到原文位置；
- 解释 Old Norse 名称；
- 理清文本年代；
- 帮助产品编辑理解争议。

但正式 `source_refs` 应尽量落回具体古代 / 中世纪文本。

## 3.6 九界规则

产品禁止写死：

```text
Norse Mythology = exactly these 9 Worlds in this fixed hierarchy and map
```

正确建模：

```text
Mythology
  → source-grounded World entities
  → each World has source refs / story dependencies
  → ambiguous equivalences remain scoped
```

特别需要避免直接合并：

- `Hel` 与 `Niflhel`；
- `Niflheim` 与 `Hel`；
- `Niðavellir` 与 `Svartálfaheimr`；
- “九界”现代固定空间布局。

---

# 4. P0 Story Manifest：先故事，后实体

以下 Story Manifest 是北欧补全工程的入口。

现有 3 篇 Story 保留 ID / slug，并在迁移时增强依赖和来源。

## Volume 1：创世与宇宙结构

### 1. 金伦加鸿沟与尤弥尔 ✅

现有：`story-ymir-creation`

核心：

- Ginnungagap；
- Nifl / cold side；
- Muspell / fire side；
- Ymir；
- Auðhumla。

来源优先：`Vafþrúðnismál`、`Grímnismál`、`Gylfaginning`，按具体 claim 分开挂载。

### 2. 奥德胡姆拉与布里的出现

依赖：

```text
Auðhumla
Búri
Ymir
```

### 3. 奥丁兄弟以尤弥尔之躯创造世界

依赖：

```text
Ymir
Odin
Vili
Vé
```

注意：不要把与“巨神尸体化生宇宙”的跨文化相似性写成历史联系。

### 4. 阿斯克与恩布拉：人类诞生

依赖：

```text
Ask
Embla
Odin
Hœnir / Lóðurr 或 Vili / Vé（按具体来源分层）
```

不同文本中的赐予者组合存在差异，Story 必须 source scoped。

### 5. 世界树、三口井与诺恩

核心：

- Yggdrasil；
- Urðarbrunnr；
- Mímisbrunnr；
- Hvergelmir；
- Norns。

Yggdrasil 建议作为 cosmology concept + Scene network，不建成 World。

### 6. 日月运行与追逐者

候选依赖：

```text
Sól
Máni
Sköll
Hati
```

不要默认所有后世“太阳狼 / 月狼”细节来自同一文本。

---

## Volume 2：神族秩序、知识与宝物

### 7. 阿萨神族与华纳神族的冲突与和解

来源需要并列处理：

- `Völuspá`；
- Snorri / later traditions；
- `Ynglinga saga` 若用于更完整叙事必须标 later / euhemerized scope。

依赖由最终 Story 文本反推，不提前把所有 Vanir 成员实体化。

### 8. 克瓦希尔与诗歌蜜酒

依赖候选：

```text
Kvasir
Odin
Suttungr
Gunnlöð
```

主要基于 `Skáldskaparmál`。

### 9. 奥丁以一只眼换取密米尔之井的智慧

依赖：

```text
Odin
Mímir
```

### 10. 奥丁悬于世界树九夜 ✅

现有：`story-odin-world-tree`

必须补：

```text
characterIds = ['character-odin']
```

来源核心：`Hávamál`。

### 11. 弗雷与葛德

依赖：

```text
Freyr
Gerðr
Skírnir
```

来源核心：`Skírnismál`。

### 12. 伊登被夏基掳走

依赖：

```text
Iðunn
Loki
Þjazi
```

后续可自然连接 Skaði。

来源：`Haustlöng` + `Skáldskaparmál`。

### 13. 阿斯加德城墙、斯瓦迪尔法利与斯莱普尼尔

依赖候选：

```text
Loki
Svaðilfari
Sleipnir
```

完整故事主要见 `Gylfaginning`，应明确来源层。

### 14. 西芙的头发与诸神宝物的锻造

依赖候选：

```text
Loki
Sif
Thor
Odin
Freyr
Brokkr
Sindri / Eitri（名称版本需 alias / source scope）
```

Story 可承载 Mjölnir、Gungnir、Gullinbursti 等器物来源。

---

## Volume 3：索尔、洛基与巨人冲突

### 15. 索尔与赫朗格尼尔

来源：`Haustlöng` / `Skáldskaparmál`。

候选：

```text
Thor
Hrungnir
Þjálfi
```

### 16. 索尔垂钓世界蛇

来源：`Hymiskviða` + `Gylfaginning`。

依赖：

```text
Thor
Hymir
Jörmungandr
```

### 17. 雷神之锤被盗

来源核心：`Þrymskviða`。

依赖：

```text
Thor
Loki
Þrymr
Freyja
```

### 18. 索尔在乌特加德

主要来自 `Gylfaginning`。

依赖候选：

```text
Thor
Loki
Útgarða-Loki
Þjálfi
Röskva
```

Story 页面必须说明其主要来源于 Snorri 的完整叙述。

### 19. 索尔与盖尔罗德

来源：`Þórsdrápa` + `Skáldskaparmál`。

依赖：

```text
Thor
Loki
Geirröðr
```

### 20. 芬里尔与格莱普尼尔

依赖：

```text
Fenrir
Tyr
Odin / gods collective（按最终叙事）
```

重点关系：

```text
Loki -> Fenrir = parent
Fenrir ↔ Tyr = narrative binding conflict
```

### 21. 洛基的宴席争辩

来源：`Lokasenna`。

该 Story 的价值主要是：

- 建立诸神之间大量 narrative relation；
- 展示神话人物并非单一“职业标签”；
- 暴露角色关系、指控与版本差异。

不要因为宴席中出现很多名字就强制全部进入 P0 Character；只实体化主线和高复用角色。

---

## Volume 4：巴德尔之死与秩序崩裂

### 22. 巴德尔的梦

来源：`Baldrs draumar`。

依赖：

```text
Baldr
Odin
```

### 23. 巴德尔之死

依赖：

```text
Baldr
Frigg
Loki
Höðr
```

需要和 Saxo tradition 分开。

### 24. 巴德尔的葬礼

来源可结合：

- `Húsdrápa`；
- `Gylfaginning`。

依赖候选：

```text
Baldr
Nanna
Thor
Odin
```

Scene 候选：`Hringhorni funeral shore`。

### 25. 赫尔莫德前往赫尔

依赖：

```text
Hermóðr
Hel
Baldr
Sleipnir
```

这里必须明确：

```text
Hel (Character) != Hel (World)
```

### 26. 洛基被捕与束缚

依赖：

```text
Loki
Sigyn
Narfi / Nari（版本需 source scope）
```

避免把后世艺术中极端刑罚细节做成无来源的固定视觉设定。

---

## Volume 5：诸神黄昏与世界再生

### 27. 芬布尔之冬与束缚崩解

以 `Völuspá`、`Vafþrúðnismál`、`Gylfaginning` 分 claim 支撑。

### 28. 奥丁与芬里尔

依赖：

```text
Odin
Fenrir
Víðarr
```

### 29. 索尔与世界蛇的最后一战

依赖：

```text
Thor
Jörmungandr
```

### 30. 弗雷与苏尔特

依赖：

```text
Freyr
Surtr
```

并可与“弗雷失去剑”的前置 Story 产生因果连接。

### 31. 海姆达尔、洛基与加拉尔号角

依赖：

```text
Heimdall
Loki
```

对 Heimdall / Loki 最终互杀等细节按具体来源支撑，不从现代简化叙述继承。

### 32. 世界毁灭、回归与新生 ✅

现有 `story-ragnarok` 升级为 Volume 终章。

依赖至少：

```text
Odin
Thor
Loki
Fenrir
Jörmungandr
Freyr
Heimdall
Surtr
Víðarr
```

按 Story 实际正文再决定是否纳入：

```text
Váli
Baldr
Höðr
Magni
Móði
Líf
Lífþrasir
```

---

## Volume 6：沃尔松格英雄传统（P0.5）

神祇主线 P0 完成后，紧接补齐北欧最具代表性的英雄叙事。

### 33. 西格尔德与雷金
### 34. 西格尔德斩杀法夫纳
### 35. 西格尔德与布伦希尔德
### 36. 西格尔德之死
### 37. 古德伦与勃艮第余波

主要来源：

- 《诗体埃达》英雄诗；
- `Völsunga saga` 作为后期叙事整合来源。

规则：

> 英雄诗传统与诸神神谱同属 MythCanvas 北欧宇宙，但页面上应通过 volume / taxonomy 明确区分 `mythic deity cycle` 与 `legendary heroic cycle`。

如果工程排期必须压缩，Volume 6 可以在 P0 神祇主线闭包后作为 P0.5 单独上线，不阻塞前 32 篇主线发布。

---

# 5. Story Dependency Closure 规则

每篇 P0 Story 进入 `published` 前必须满足：

```text
requiredCharacterIds ⊆ Character dataset
requiredWorldIds     ⊆ World dataset
requiredSceneIds     ⊆ Scene dataset
requiredSources      != empty
```

并增加北欧专属检查：

```text
sourceTraditionScope != empty when conflicting versions exist
late-source-only claims must declare source tier
modern-pop-culture claim leakage = 0
```

核心参与人物必须实体化；只在一句背景中出现、对页面浏览与关系网络没有价值的名字不强制建 Character。

最终 P0 Character 数量由 Manifest dependency closure 自动算出后人工 Review，不在计划阶段硬锁数量。

---

# 6. Character Taxonomy

## 6.1 Stable Entity Type

延续希腊阶段通用规则，`character_type` 只描述“它是什么”：

```text
deity
hero
mortal
monster
creature
collective
```

不要新增：

```text
aesir
vanir
jotunn
dwarf
valkyrie
```

作为 stable type。

这些更适合作为 taxonomy / tradition tag。

## 6.2 Norse Editorial Taxonomy

建议：

```text
aesir
vanir
jotunn
cosmogony
odin-cycle
thor-cycle
loki-cycle
baldr-cycle
ragnarok
underworld
world-tree
dwarf
norn
valkyrie
legendary-hero
volsung-cycle
```

其中 `jotunn` 不能简单翻译为产品语义上的 `monster`。

规则：

> **Jötunn 是神话族群 / 关系分类，不等于“冰巨人”，也不自动等于怪物。**

例如 Gerðr、Skaði 等角色应根据实体本体与页面需要选择 `deity` 等 stable type，同时以 `jotunn` taxonomy 表达来源身份。

## 6.3 P0 Character Closure 候选池

现有 12 个之外，Story closure 大概率会自然引入：

### 创世 / 宇宙

- Ymir
- Auðhumla
- Búri
- Borr
- Bestla
- Vili
- Vé
- Ask
- Embla
- Norns（collective，必要时再拆 Urðr / Verðandi / Skuld）
- Sól
- Máni
- Sköll
- Hati

### 阿萨 / 华纳 / 知识与宝物

- Njörðr
- Mímir
- Kvasir
- Gerðr
- Skírnir
- Iðunn
- Þjazi
- Skaði
- Sif
- Sleipnir
- Brokkr
- Sindri / Eitri alias scope

### 索尔 / 洛基周期

- Hymir
- Þrymr
- Útgarða-Loki
- Hrungnir
- Geirröðr
- Þjálfi
- Röskva

### 巴德尔 / Ragnarök

- Höðr
- Hermóðr
- Nanna
- Sigyn
- Surtr
- Víðarr
- Váli
- Magni
- Móði
- Líf
- Lífþrasir

### 沃尔松格

- Sigurðr / Sigurd
- Regin
- Fáfnir
- Brynhildr
- Guðrún
- Gunnar
- Högni

这只是 dependency review 起点，不是强制完整名单。

---

# 7. Character Production 与 Interpretation 规则

每个 P0 Character 最低要求：

```text
Character
├── stable identity
├── character_type
├── taxonomy / tradition tags
├── names / aliases
├── source periods
├── identity source refs
├── canonicality
├── symbols
├── canonical design
├── core relations
├── world / scene affinity
├── story linkage
└── generation prompt
```

以下仅按需创建：

```text
CharacterInterpretation
CharacterVariant
ReferenceAsset
```

## 7.1 Interpretation 仅在真正改变角色理解时创建

只有来源差异会改变以下至少一项时创建 Interpretation：

- 稳定身份；
- 神职 / 权能；
- 明显视觉锚点；
- Generation Prompt；
- 用户需要主动切换的传统版本。

单纯谱系不同：

```text
relation difference != interpretation difference
```

优先用 source-scoped relation 表达。

## 7.2 Loki

稳定身份应避免现代流行文化简化：

```text
trickster / shape-shifter / complex divine-jotunn kinship
```

不要把：

```text
Loki = fire god
```

作为无条件 Stable Identity。

现代影视中的固定绿金服装、头盔轮廓、反英雄人格不得进入 mythologicalFacts。

## 7.3 Freyja 与 Frigg

保持两个独立 Character。

即使现代研究中存在关于早期传统关系的讨论，也不应默认：

```text
Freyja == Frigg
```

除非未来做 scholarship / reception layer，否则只在 source note 中说明相关学术讨论，不建立硬 identity merge。

## 7.4 Hel：角色与空间重名

必须固定命名边界：

```text
character-hel = Loki 之女、Hel 的统治者
world-hel     = 亡者空间
```

前端 breadcrumb、搜索和关系图必须区分类型，避免出现“海拉属于海拉”的文案。

## 7.5 Baldr / Höðr：Eddic 与 Saxo

Eddic tradition 与 Saxo 的 Danish tradition 差异足够大时，可采用：

- 独立 Story tradition；
- source-scoped relation；
- 必要时 Character Interpretation。

禁止把两个版本拼成一个貌似无冲突的“标准剧情”。

## 7.6 Gullveig / Heiðr

若进入 P1：

- 不直接硬 merge；
- 使用 alias / interpretation / source note 表达可能关系；
- 只有在产品明确选择某一种学术解释时才生成 scoped identity link。

## 7.7 Dwarf 名称差异

Brokkr、Sindri、Eitri 等名称在文本 / 手稿 / 后世整理中存在使用差异。

处理方式：

```text
stable Character
+ character_names aliases
+ source scoped display / notes
```

不要复制出多个实为同一文本问题的重复 Character。

---

# 8. Claim-level Source Policy

## 8.1 Character

每个 P0 Character 至少覆盖：

### Stable Identity Source

证明角色最核心身份。

### Genealogy Source

父母、子女、配偶等直接挂 relation source，不从简介文本自动推导。

### Interpretation Source

每个 active Interpretation 至少一个直接支撑该差异的来源。

### Visual Anchor Provenance

Canonical Design 必须区分：

```text
mythologicalFacts
historically / textually grounded anchors
originalDesignChoices
```

例如：

```text
Odin one eye = source-grounded identity
specific cloak cut = MythCanvas original design choice
blue glowing runes = 不能自动视为古典事实
```

## 8.2 Story

每篇 P0 Story：

```text
primary / core medieval source >= 1
alternate tradition note when material
characterIds / worldIds / sceneIds valid
source tier identifiable
```

不要只写：

```text
《诗体埃达》
```

而应尽量写成：

```text
Hávamál
Völuspá
Hymiskviða
Þrymskviða
Gylfaginning chapter ...
```

## 8.3 来源冲突

不同来源冲突时：

```text
claim A + source A
claim B + source B
```

而不是：

```text
claim = AI 自动融合后的单一答案
```

---

# 9. Character Relation Storage Rule

复用希腊阶段已经确定的通用规则。

## 9.1 parent

只存：

```text
parent -> child
relation_type = parent
```

UI 反向查询 children，不双写 child。

例如：

```text
Loki -> Fenrir
Loki -> Jörmungandr
Loki -> Hel
```

均存 `parent` edge，并分别挂来源。

## 9.2 对称关系

`consort / sibling / ally / rival / enemy` 默认只存一次，按稳定排序决定 from / to。

## 9.3 单向关系

`rules-over / serves / created / transformed-into / associated-with` 等保持方向性。

## 9.4 叙事关系

如果现有 generic relation 已能表达，就不为了北欧新增几十种 relation type。

像：

- Tyr 与 Fenrir 的束缚；
- Thor 与 Jörmungandr 的宿敌；
- Loki 导致 Baldr 死亡；

优先通过现有 narrative relation + Story linkage 表达。

只有 Character Graph / UI 明确需要新的稳定语义时，再扩枚举。

## 9.5 Relation 验收

不设“必须 150 条”数字 KPI。

改为：

```text
P0 required genealogy edges covered = 100%
P0 required narrative edges covered = 100%
P0 relation source coverage = 100%
invalid target = 0
duplicate canonical relation = 0
conflicting relation without source scope = 0
```

---

# 10. World 与 Scene

## 10.1 World 的语义

World = 神话宇宙中的稳定空间层。

Scene = 一个可复用的具体地点、空间片段或事件视觉场景。

禁止为了满足“九界”数字而机械创建 World。

### P0 World 候选

#### Asgard / 阿斯加德

已有，继续增强。

主要承载：

- Odin；
- Frigg；
- Thor；
- Baldr；
- Heimdall；
- gods assembly；
- Valhalla 等 Scene。

#### Midgard / 米德加尔特

承载：

- 人类世界；
- 海岸、聚落、农场、长屋；
- Thor 的大量旅程入口；
- heroic cycle 的部分人间故事。

#### Jötunheimr / 约顿海姆

承载：

- 巨人 / Jötunn 相关故事；
- 山林、荒野、边界空间；
- Thor cycle。

视觉上不能固定为“冰世界”。

#### Hel / 赫尔

承载：

- Hel；
- Baldr death cycle；
- Hermóðr journey。

禁止表现成基督教地狱或火焰炼狱。

#### Muspell / Muspelheim

用于：

- 创世火焰侧；
- Surtr；
- Ragnarök。

只在故事有明确需要时进入 P0 World。

#### Niflheim

用于：

- 创世雾寒侧；
- Hvergelmir 等相关 cosmology。

必须和 Hel / Niflhel 保持来源说明，不静默合并。

#### Vanaheimr

如果 Æsir–Vanir Story 与 Freyr / Freyja / Njörðr 页面需要明确空间承载，则进入 P0 / P1。

#### Álfheimr

文本中视觉细节非常有限。

如果建 World：

- source facts 与 MythCanvas original world design 明确分层；
- 不套用现代“精灵王国”范式冒充古典设定。

#### Dwarf Realm：延后决策

`Niðavellir` 与 `Svartálfaheimr` 的对应关系不应在方案阶段强制统一。

先由锻造 Story / source review 决定：

- 建一个 source-scoped World；
- 建 Scene；
- 或保持不同文本层的两个概念。

## 10.2 Yggdrasil 不建成 World

Yggdrasil 更适合：

```text
Cosmology concept
+ Scene network
+ Story anchor
```

因为它横跨、连接多个空间，本身不是“九界中的一个世界”。

## 10.3 P0 Scene 候选

按 Story 依赖决定是否实体化。

### 创世 / 宇宙

- Ginnungagap；
- Yggdrasil roots；
- Urðarbrunnr；
- Mímisbrunnr；
- Hvergelmir。

### Asgard

- Bifröst；
- Valhalla；
- Asgard wall；
- Odin hall / high seat（若高复用）；
- gods feast hall。

### Vanir / Jötunn / journey

- Ægir's Hall；
- Þrymheimr；
- Jötunheim wilderness；
- Útgarðr；
- Thor fishing sea。

### Baldr cycle

- Baldr funeral shore / Hringhorni；
- road to Hel；
- Gjallarbrú（若 source / reuse 足够）。

### Ragnarök

- Vígríðr battlefield；
- burning world horizon；
- renewed earth。

### Heroic cycle

- Gnitaheiðr / Fafnir's heath；
- Brynhildr's fire-ring / sleep site（按来源）；
- Volsung hall / Rhine-Burgundian spaces（按 Story 决定）。

是否建实体的判断：

> 被至少一个 P0 Story 直接依赖，或具有高复用视觉价值。

---

# 11. Norse Visual DNA

## 11.1 Mythology Base DNA

建议升级为：

```text
materials:
- timber
- stone
- iron
- bronze / silver
- wool / linen
- functional leather
- carved wood
- amber / restrained precious metal

landscape:
- fjords and coast
- open sea
- forests
- mountains
- farms / cultivated land
- mist / cold air where appropriate
- volcanic / fire landscape only where story requires

motifs:
- raven
- spear
- hammer
- ship
- world tree
- wells / roots
- restrained interlace
- historically plausible rune inscription

atmosphere:
- fated
- austere
- monumental
- intimate hall warmth when appropriate
- elemental rather than universally icy
```

### Base Avoid

```text
- horned Viking helmets as default
- late medieval plate armor
- fur bikini fantasy
- modern superhero costume geometry
- specific film/game franchise silhouettes
- neon glowing-rune overload
- every scene = snow + aurora
- all Jötunn = blue ice giants
- generic Celtic knotwork pasted everywhere
- Christian hell imagery for Hel
```

## 11.2 Asgard DNA

```text
palette:
- weathered silver
- warm gold
- timber brown
- cold sky blue

materials:
- carved timber
- stone foundations
- iron / bronze / silver fittings

architecture:
- monumental northern hall language
- vertical roof rhythm
- bridge / high-seat / assembly motifs

atmosphere:
- royal
- elevated
- ordered but fate-shadowed
```

不要做成纯石质“中世纪天堂城堡”。

## 11.3 Midgard DNA

```text
palette:
- earth brown
- moss green
- sea grey-blue
- firelight amber

visual identity:
- longhouse
- cultivated field
- coast
- ship
- forest edge
- lived-in human scale
```

Midgard 是让北欧宇宙摆脱“所有画面都是神殿”的关键空间。

## 11.4 Jötunheimr DNA

```text
landscape:
- mountains
- wild forest
- rock
- river
- remote wilderness

atmosphere:
- untamed
- ancient
- boundary-breaking
```

禁止：

```text
Jötunheimr = only snow biome
Jötunn = always giant blue humanoid
```

## 11.5 Hel DNA

```text
palette:
- ash grey
- frost blue
- muted black
- bone-pale textile

atmosphere:
- still
- distant
- cold
- sovereign
- inevitable
```

禁止：

- lava everywhere；
- Christian demons；
- skull dungeon cliché；
- zombie gore。

## 11.6 Muspell DNA

```text
materials:
- dark basalt
- ember
- smoke
- incandescent fracture

atmosphere:
- primordial fire
- advancing destruction
```

只用于 source-grounded fire realm / Ragnarök，不扩散到整个北欧神话。

## 11.7 Niflheim DNA

```text
motifs:
- mist
- cold water
- spring / source
- ice only where appropriate

atmosphere:
- primordial cold
- obscure depth
```

## 11.8 Vanaheimr / Álfheimr 的原创边界

现存文本没有提供足够完整的建筑和服装“设定集”。

因此后续视觉设计必须拆成：

```text
source-grounded facts
+ MythCanvas original design choices
```

不把原创宫殿、颜色、族群服装包装成古典文本事实。

## 11.9 Prompt 编排

继续保持正交：

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

---

# 12. Structured Content Pipeline：第二文明必须完成通用化

这是本轮最重要的工程性产出之一。

## 12.1 Norse 目标目录

```text
src/content/norse/
├── catalog.ts
├── stories.ts
├── assets.ts
├── visual-tiers.ts
└── index.md
```

含义与 Greek 保持一致：

- `catalog.ts`：Character / World / Scene / taxonomy / relation manifest；
- `stories.ts`：Story 正文与依赖声明；
- `assets.ts`：公开 World / Story / Character 资产 provenance；
- `visual-tiers.ts`：视觉生产优先级；
- `index.md`：Astro content registration marker。

## 12.2 不复制 `sync-norse-content.mjs` 大量重复代码

当前已有：

```text
scripts/sync-greek-content.mjs
```

北欧进入后建议重构为：

```text
scripts/sync-mythology-content.mjs
```

调用：

```bash
npm run content:import -- --mythology=greek
npm run content:import -- --mythology=norse
```

或由 registry 自动发现全部结构化文明。

目标不是命令格式本身，而是：

> **Schema、validator、normalizer、D1 importer 必须文明无关；文明差异只存在于 data package。**

## 12.3 Validation 通用化

现有 `npm run content:validate` 应最终覆盖所有注册的 structured mythology package：

```text
greek
norse
future egyptian
future japanese
...
```

验证层至少包括：

```text
schema validation
id / slug uniqueness
story dependency validation
source coverage validation
relation target validation
canonical relation duplicate validation
world / scene relation validation
visual asset provenance validation
```

## 12.4 Legacy stories 迁移

`src/data/stories.ts` 当前已经：

```ts
import { greekStories } from '../content/greek/stories';
```

北欧完成后改成同样模式：

```ts
import { norseStories } from '../content/norse/stories';
```

并删除原文件中的 3 个 Norse inline drafts，避免双份来源。

## 12.5 Coverage Reporter 通用化

现有：

```text
report-greek-artwork-coverage.mjs
```

建议升级为：

```text
report-mythology-artwork-coverage.mjs --mythology=norse
```

避免每补一个文明就复制一个脚本。

---

# 13. Visual Asset 分层

内容闭包先于大规模出图。

## 13.1 Tier S：品牌级角色

建议北欧 Tier S 直接覆盖当前 12 个 launch character：

- Odin
- Thor
- Loki
- Freyja
- Frigg
- Baldr
- Heimdall
- Tyr
- Freyr
- Hel
- Fenrir
- Jörmungandr

最低目标：

```text
Canonical mobile portrait/reference
+ desktop hero / wallpaper for highest-value subset
+ identity-safe prompt
+ provenance complete
```

其中 Odin / Thor / Loki / Freyja / Hel / Fenrir / Jörmungandr 优先完成双端主视觉。

## 13.2 Tier A：主线依赖角色

候选：

- Ymir
- Njörðr
- Skaði
- Iðunn
- Sif
- Höðr
- Hermóðr
- Víðarr
- Surtr
- Gerðr
- Sigyn
- Mímir
- Sleipnir
- Sigurd
- Brynhildr
- Fafnir

最低：

```text
Canonical mobile portrait/reference
```

## 13.3 Tier B：长尾

允许使用：

```text
Canonical symbols + role + high-quality Symbol Fallback
```

但禁止把通用 AI 人像冒充角色正式肖像。

## 13.4 World Hero

每个正式 P0 World 至少：

```text
desktop hero
mobile hero
alt
width / height
creator
license
source_type
prompt / generation metadata when AI-generated
```

## 13.5 Provenance

发布门禁：

```bash
npm run provenance:audit -- --strict
```

Production D1 / R2 同样需要通过 remote audit。

---

# 14. 页面产品化

北欧不新造独立页面体系，直接复用希腊已经沉淀的通用页面。

## 14.1 Mythology 首页

`/mythology/norse/`

应展示：

```text
Hero
→ 内容导览
→ Story Volumes
→ Core Characters
→ Character Taxonomy
→ Core Worlds
→ Genealogy / Character Graph entry
→ Sources / editorial note
→ Artwork
```

Story volume 结构至少让用户一眼理解：

```text
创世
→ 神族秩序
→ 索尔 / 洛基
→ 巴德尔
→ Ragnarök
→ 英雄传统
```

## 14.2 Story 页面

继续使用共享路由：

```text
/mythology/norse/[story]/
```

每个 Story 必须具备：

- title / subtitle；
- source context；
- reading blocks；
- related Characters；
- related Worlds / Scenes；
- previous / next story；
- alternate tradition note；
- artwork / illustration。

## 14.3 Character 页面

现有 Character Relation / 3D Character Graph 能力在北欧补全后价值会明显提升。

重点验证：

- Odin family / narrative network；
- Loki → Fenrir / Jörmungandr / Hel；
- Thor ↔ Jörmungandr；
- Baldr death network；
- Ragnarök opponent network。

关系图不能只展示“父子树”，必须支持 narrative relation。

## 14.4 World 页面

World 页面需要增加来源敏感性：

- source-grounded facts；
- associated stories；
- associated characters；
- Canonical World Design；
- 对存在争议的 world equivalence 给出简短说明。

例如 `Hel / Niflheim / Niflhel` 不应由 UI 自动显示为同义词。

## 14.5 Search / Alias

北欧名字需要至少支持：

```text
中文名
常见 English form
Old Norse form where practical
ASCII-friendly alias where useful
```

例如：

```text
Jörmungandr
Jormungandr
Midgard Serpent
耶梦加得
```

Stable slug 保持 ASCII / human-readable，不因增加 Old Norse display name 改 URL。

## 14.6 Sitemap / SEO

只要 Story 数据进入共享 `getPublicStories()` / structured content registry，Norse Story URL 应自动进入 sitemap。

不要新增一个 Norse-only sitemap 逻辑。

---

# 15. 测试与验证

## 15.1 Content Validation

必须覆盖：

```text
Norse story count / manifest integrity
all required sources present
all character refs valid
all world refs valid
all scene refs valid
all required relation refs valid
canonical relation duplicates = 0
source scoped conflict validation
```

## 15.2 Unit / Content Tests

建议新增：

```text
tests/norse-content.test.*
```

覆盖：

- existing 12 IDs 不变；
- 3 legacy Story IDs / slugs 不变；
- Story dependency closure；
- Loki children relations；
- Hel Character / World 不混淆；
- Nine-world policy：无固定 9-world enum / hardcoded count；
- structured stories 能进入 `getStoriesForMythology('myth-norse')`；
- sitemap 能发现 public Norse Story。

## 15.3 CI

最终 CI 继续只需要通用命令：

```bash
npm test
npm run content:validate
npm run provenance:audit -- --strict
npm run check
```

不要新增：

```text
norse:validate
norse:test
norse:deploy
```

这种文明专属工程入口。

---

# 16. 实施顺序

## P0-0：冻结北欧内容规范

- [ ] 确定 Source Tier；
- [ ] 确定“九界不硬编码”规则；
- [ ] 确定 Character stable type / taxonomy；
- [ ] 确定 Hel Character / World 命名规则；
- [ ] 固定 32 篇神祇主线 Story Manifest；
- [ ] 固定 Volume 6 是否作为同步 P0 或 P0.5。

## P0-1：通用化 Greek Structured Content Pipeline

- [ ] 抽离 mythology registry；
- [ ] validator 从 Greek-only 改为 mythology-agnostic；
- [ ] normalizer 通用化；
- [ ] D1 sync 通用化；
- [ ] coverage reporter 通用化；
- [ ] CI 自动验证全部 structured mythology。

此步骤必须在大量新增北欧数据之前完成，避免复制技术债。

## P0-2：建立 `src/content/norse/`

- [ ] `catalog.ts`；
- [ ] `stories.ts`；
- [ ] `assets.ts`；
- [ ] `visual-tiers.ts`；
- [ ] `index.md`；
- [ ] 将 3 篇 legacy Norse Story 迁入并保持 ID / slug。

## P0-3：Story Dependency Closure

推荐分 4 批完成，而不是一次灌完：

### Batch A：创世 + 神族秩序

- Story 1–14；
- 核心 Character closure；
- Asgard / Midgard / cosmology Scene；
- Odin / Vanir relations。

### Batch B：Thor / Loki Cycle

- Story 15–21；
- Thor / Loki / Jötunn dependency closure；
- Jötunheimr；
- Fenrir / Jörmungandr relation network。

### Batch C：Baldr + Ragnarök

- Story 22–32；
- Hel / Muspell / death road / battlefield；
- Baldr / Loki / Ragnarök relation closure。

### Batch D：Volsung Cycle

- Story 33–37；
- Sigurd / Brynhildr / Fafnir 等英雄网络。

## P0-4：Claim-level Source / Relation 补齐

- [ ] Stable identity source coverage 100%；
- [ ] genealogy source coverage 100%；
- [ ] narrative relation source coverage 100%；
- [ ] Story source coverage 100%；
- [ ] conflicting source without scope = 0；
- [ ] duplicate canonical relation = 0。

## P0-5：World / Scene 与 Visual DNA

- [ ] 所有 P0 Story 的 World dependency 有承载；
- [ ] 所有高复用 Scene 建模；
- [ ] Norse Base DNA 升级；
- [ ] World DNA 建立；
- [ ] sparse-source World 的 original design choice 显式区分。

## P0-6：页面与 SEO 集成

- [ ] `/mythology/norse/` Story volumes；
- [ ] Norse Story detail；
- [ ] Character taxonomy browse；
- [ ] Character relation / graph；
- [ ] World browse；
- [ ] alias search；
- [ ] sitemap；
- [ ] source notes。

## P0-7：验证与上线

- [ ] `npm test`；
- [ ] `npm run content:validate`；
- [ ] `npm run check`；
- [ ] provenance static audit；
- [ ] local D1 sync dry-run；
- [ ] local browser smoke；
- [ ] production D1 sync；
- [ ] production provenance audit；
- [ ] deployed routes smoke test。

## P1：视觉资产

- [ ] Tier S Canonical artwork；
- [ ] Tier A portrait/reference；
- [ ] P0 World desktop hero；
- [ ] P0 World mobile hero；
- [ ] Story hero / illustration 逐步原创化；
- [ ] prototype provenance 清零；
- [ ] Norse artwork coverage report。

## P2：长尾

- [ ] 更多神祇 / Jötunn / dwarfs；
- [ ] Valkyrie expansion；
- [ ] 更多 heroic lays；
- [ ] Saxo / regional traditions；
- [ ] reception / scholarship layer；
- [ ] 更多 Character Interpretation / Variant。

---

# 17. P0 / P1 DoD

## P0 DoD

北欧主干完成必须同时满足：

```text
1. 至少 30 篇神祇主线 Story 已结构化并发布；
2. Story required entity dependency closure = 100%；
3. P0 Stable Identity Source coverage = 100%；
4. P0 Genealogy / Narrative Relation source coverage = 100%；
5. P0 Canonical Design coverage = 100%；
6. orphan Character / World / Scene refs = 0；
7. conflicting claims without source scope = 0；
8. 现有 12 个 launch character ID / slug 不变；
9. 现有 3 篇 Norse Story ID / slug 不变；
10. `src/content/norse/` 已成为权威内容源；
11. Structured Content validator / importer 已文明通用化；
12. Norse Story / Character / World / Relation 可被现有公共页面正常消费；
13. sitemap 能收录已发布 Norse Story；
14. npm test / content:validate / check 全绿。
```

## P1 DoD

```text
1. Tier S 最低 Canonical 视觉覆盖完成；
2. Tier A 最低 portrait/reference 覆盖完成；
3. 所有 P0 World 均有独立 desktop + mobile hero；
4. public prototype provenance = 0；
5. Character Graph 对 Odin / Loki / Baldr / Ragnarök 网络有实际信息价值；
6. Norse Mythology 页面不再呈现“12 人 + 3 故事 + 1 World”的骨架感；
7. Visual DNA 不再退化为“雪山 + 极光 + 发光符文”的单一视觉套路。
```

---

# 18. 风险与明确决策

## R1：现存文本成书时间晚

风险：把中世纪记录当成未经变化的“维京时代原始设定”。

决策：

- source date 与 tradition 分开；
- claim-level source；
- 对明显晚期整理提供 source note。

## R2：现代“九界地图”反向污染

风险：为了页面好看直接复制现代固定九界结构。

决策：

- 不设 `world_count = 9` 验收；
- World 由 Story dependency + source grounding 决定；
- 模糊关系不硬 merge。

## R3：现代影视 / 游戏视觉污染

高风险角色：

- Thor；
- Loki；
- Odin；
- Hel；
- Valkyrie；
- Fenrir。

决策：

- Canonical Design mythologicalFacts / originalDesignChoices 分层；
- modern franchise likeness 放 `avoid`；
- QA 检查服装、武器、头盔、配色、轮廓是否过度接近商业 IP。

## R4：Jötunn 被统一画成“冰巨人”

决策：

- `jotunn` 属 taxonomy；
- individual Character 自己定义 morphology；
- Jötunheimr DNA 不等于 ice biome。

## R5：Hel 重名

决策：

```text
character-hel
world-hel
```

类型始终显式。

## R6：Old Norse 字符导致 slug / search 混乱

决策：

- canonical display 可使用 `Jörmungandr / Þrymr / Iðunn`；
- slug 使用稳定 ASCII form；
- alias 同时覆盖 ASCII / English / Chinese；
- 不因展示名称升级改变 URL。

## R7：复制 Greek-only 工具链

风险：未来每个文明都出现自己的 importer / validator / reporter。

决策：

> 北欧补全开始前先抽通用 Structured Content Pipeline；第二文明必须成为“去 Greek 特化”的触发点。

---

# 19. 本轮建议交付物

完整实施完成后，至少形成：

```text
docs/NORSE_MYTHOLOGY_COMPLETION_PLAN.md

src/content/norse/
├── catalog.ts
├── stories.ts
├── assets.ts
├── visual-tiers.ts
└── index.md

shared mythology content registry / schema / validator
shared D1 content sync
shared artwork coverage reporter
Norse content tests
```

同时保留：

```text
migrations/0019_popular_mythology_characters.sql
migrations/0021_norse_character_canonical_designs.sql
```

作为历史 migration，不回写旧 migration。

---

# 20. 最终执行原则

北欧补全按以下顺序推进：

```text
来源规则
→ Story Manifest
→ Dependency Closure
→ Character / World / Scene
→ Relation + Source
→ Canonical Design
→ Structured Content Import
→ 页面与图谱
→ Validation
→ 正式视觉资产
→ Production Sync
```

不要按以下方式推进：

```text
先列 80 个名字
→ 批量 INSERT SQL
→ 批量生成头像
→ 最后再想这些角色为什么存在、属于哪篇故事、来源是什么
```

最终标准不是“北欧神话有多少条记录”，而是：

> **用户能沿着故事进入世界、人物和关系；AI 能沿着同一套来源化 Canonical Design 稳定出图；工程上不需要为每一种神话文明重新发明一套内容系统。**
