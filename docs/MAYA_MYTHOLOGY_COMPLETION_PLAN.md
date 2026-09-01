# MythCanvas 玛雅神话完整补全方案

> 状态：Review Proposal  
> 版本：V1.0  
> 日期：2026-09-02  
> 适用范围：玛雅神话内容建模、人物扩充、传统/时期分层、Character Relation / Graph、World / Scene、Story、来源体系、视觉资产、结构化内容流水线与后续 AI 出图。  
> 相关文档：`docs/NORSE_MYTHOLOGY_COMPLETION_PLAN.md`、`docs/GREEK_MYTHOLOGY_COMPLETION_PLAN.md`、`docs/NORSE_CHARACTER_DETAIL_GRAPH_INTEGRATION_PLAN.md`、`docs/CONTENT_POSITIONING.md`、`docs/CHARACTER_ART_SYSTEM.md`、`.agents/skills/mythcanvas-content-model/SKILL.md`

---

## 0. 结论

当前玛雅神话在 MythCanvas 中还处于“文明入口”阶段，尚未形成可连续浏览、可追溯来源、可支撑 Character Graph 与视觉生产的内容宇宙。

当前主干已经具备：

- `myth-maya` / 玛雅神话入口；
- 基础 Visual DNA：玉石绿、石灰岩、热带绿、天青、世界树、阶梯神庙、星历、玛雅文字；
- 通用 Character / Relation / Interpretation / Variant / World / Scene / Story Schema；
- 希腊阶段已落地的 Structured Content Pipeline 经验；
- 北欧阶段提出的通用 mythology registry / validator / importer 与来源化 Character Graph 方向。

但在当前主干数据中，玛雅仍基本只有：

```text
Maya Mythology
  → mythology metadata
  → placeholder hero
  → no formal Maya Character closure
  → no formal Maya World closure
  → no formal Maya Story manifest
```

因此本轮不是“补几个玛雅神”，而是建立 MythCanvas 第一套真正需要处理 **跨时期、跨语言群、跨地区传统差异** 的神话内容体系。

### 本方案最重要的判断

玛雅神话不能建模成：

```text
统一玛雅神系
  → 一个最高神
  → 一套固定神谱
  → 一个统一地下世界 Xibalba
  → 一棵固定世界树
  → 一张 13 天界 + 9 冥界地图
```

更接近真实资料结构的方式是：

```text
Maya Mythology
├── K'iche' Highland Tradition
│   └── Popol Vuh narrative spine
├── Classic Lowland Tradition
│   └── inscriptions + painted ceramics + monumental iconography
├── Postclassic Codical Tradition
│   └── Dresden / Madrid / Paris / Mexico codices
└── Colonial Yucatec Tradition
    └── Chilam Balam / Ritual of the Bacabs / contact-period records
```

这些传统之间存在大量连续性、相似意象和可能的神祇对应，但不能默认做 `same-as`。

### 本方案的六个核心决策

1. **Tradition First + Story First**：先把来源传统分层，再建立 Story / mythic-ritual manifest，由依赖闭包反推 Character / World / Scene / Relation。
2. **禁止 Pan-Maya Flattening**：`Popol Vuh` 是基切玛雅（K'iche'）传统的核心文本，不是全体玛雅文明统一“圣经”；Xibalba、Hunahpu、Xbalanque、Q'uq'umatz 等首先属于其明确来源范围。
3. **Identity 必须允许“不确定对应”**：Classic 图像神、Postclassic codex 神与 Colonial 命名之间常只有学术对应，不允许为了产品整齐直接强制合并。
4. **World 少、Scene 多**：玛雅资料中的宇宙空间经常通过洞穴、山、球场、树、天体道路、雨神空间表达，不应为了凑 World 数量制造一张现代奇幻地图。
5. **Visual DNA 按时期/地区拆层**：Classic Lowland、Postclassic Yucatán、K'iche' Highlands 不共享一套“雨林金字塔皮肤”；同时严格防止阿兹特克 / 墨西加视觉污染。
6. **不创建 Maya-only importer**：玛雅应直接进入通用 mythology content registry / validator / sync pipeline，推动 Greek-only 能力真正文明无关化。

---

# 1. 当前仓库盘点

## 1.1 当前 `myth-maya`

`src/data/mythologies.ts` 已有：

```text
id: myth-maya
slug: maya
name: 玛雅神话
nameEn: Maya Mythology
tagline: 世界树与西巴尔巴
```

基础视觉字段包括：

```text
palette: 玉石绿 / 石灰岩灰 / 热带绿 / 天青
motifs: 世界树 / 阶梯神庙 / 星历 / 玛雅文字
materials: 石灰岩 / 玉石 / 木 / 灰泥
atmosphere: 宇宙感 / 热带 / 古老 / 神秘
```

该入口可以保留，但 V2 必须修正两个过度概括：

- “世界树与西巴尔巴”容易把 `Xibalba` 误当作所有玛雅传统的统一地下世界名称；
- “热带雨林 + 阶梯神庙”不足以覆盖高地基切传统、古典低地宫廷、后古典尤卡坦和手抄本视觉。

建议后续 tagline 改为更中性的：

> **玉米 · 星辰 · 地下世界**

或在产品支持 tradition-aware tagline 后按传统动态展示。

## 1.2 当前没有玛雅实体闭包

与希腊、北欧当前状态相比，玛雅尚未形成正式：

- P0 Character 集；
- Maya World；
- Maya Scene network；
- Maya Story；
- Maya source manifest；
- Maya canonical design；
- Maya production artwork。

因此本轮可以从一开始就使用正确的内容工程结构，不需要背负大量 legacy ID。

## 1.3 玛雅比前几套神话更需要来源分层

希腊、北欧已经存在明显文本差异，但玛雅还有额外复杂度：

```text
时间跨度：Preclassic → Classic → Postclassic → Colonial
地区跨度：Highlands → Southern Lowlands → Northern Yucatán
语言跨度：K'iche' / Yucatecan / Ch'olan 等
资料形态：碑铭 / 陶器图像 / 手抄本 / 殖民时期字母文本 / 西班牙记录
```

如果不增加 Tradition / Period Scope，后续最容易出现：

- 把 16 世纪 K'iche' 的 Seven Macaw 直接等同于早两千年出现的 Principal Bird Deity；
- 把 Hun Hunahpu 直接标记为 Classic Maize God；
- 把 Q'uq'umatz、K'uk'ulkan、Quetzalcoatl 做成同一个 Character Variant；
- 把 Ix Chel 统一描述成“年轻月亮女神”；
- 把所有 Death God 都命名为 Ah Puch；
- 把所有玛雅地下空间都叫 Xibalba。

这些都必须在数据模型与 validator 层阻断。

---

# 2. “完整”的定义

玛雅神话的完整不等于收录所有已知神名，也不意味着从不同地区拼出一套不存在的统一神谱。

MythCanvas P0 完整定义是：

> 用户能够清楚理解基切《Popol Vuh》的创世、人类多次创造、Seven Macaw、Hero Twins、Xibalba 与玉米造人主线；同时能够进入古典期低地和后古典尤卡坦的重要神祇/宇宙意象，并明确知道哪些是同一传统、哪些只是可能对应或跨时期连续传统。所有核心 Story / dossier 的实体依赖与来源不存在悬空。

P0 硬目标：

```text
Core Narrative / Mythic-Ritual Units >= 36
P0 Entity Dependency Closure = 100%
P0 Stable Identity Source Coverage = 100%
P0 Critical Relation Source Coverage = 100%
P0 Tradition Scope Coverage = 100%
P0 Period Scope Coverage = 100%
Tier S Canonical Design Coverage = 100%
Conflicting Identity Forced Merge = 0
Orphan Entity Reference = 0
Critical Aztec/Maya Visual Contamination = 0
```

Character / World / Scene / Relation 最终数量由 Story / dossier 依赖闭包产生，不先定“玛雅必须 50 神”。

---

# 3. 来源体系与 Tradition Scope

## 3.1 K'iche' Highland — `Popol Vuh`

P0 最完整的连续叙事主干来自 `Popol Vuh`。

必须明确：

- 它记录的是 K'iche' Maya 传统；
- 现存文本属于殖民初期字母记录传统；
- 它极其重要，但不是所有古代玛雅地区共享的一本统一经典；
- 可以用于建立最完整的 Story spine，但跨到 Classic / Yucatec 时只能建立 source-scoped comparison。

建议 source scope：

```text
kiche-popol-vuh
```

P0 正文引用应尽量记录：

```text
work
+ translation / edition
+ narrative section
+ page / paragraph locator（稳定时）
```

## 3.2 Classic Lowland — 碑铭、陶器与考古图像

古典期大量神话不是以今天熟悉的“故事书”形态保存，而是存在于：

- stelae / lintels / altars；
- painted ceramics；
- funerary / royal contexts；
- glyphic texts；
- iconographic sequences。

核心可以支撑：

- Maize God；
- K'awiil；
- Chaak；
- K'inich Ajaw；
- God L；
- Principal Bird Deity；
- Classic Hero Twins / youthful gods 的学术重建；
- Witz / cave / world tree / watery underworld 等宇宙意象。

规则：

> **图像学重建可以进入 MythCanvas，但必须标 `evidenceType=iconographic-reconstruction`，不能伪装成一篇完整保存的古代文字故事。**

建议 scope：

```text
classic-lowland
classic-lowland-iconography
classic-lowland-inscription
```

## 3.3 Postclassic Codices

四部现存前西班牙征服时期玛雅手抄本是 P0/P1 重要来源：

- Dresden Codex；
- Madrid Codex；
- Paris Codex；
- Maya Codex of Mexico（旧称 Grolier Codex）。

它们特别适合支撑：

- Chaak / rain almanacs；
- God D / old deity；
- Goddess O / aged goddess；
- Death God；
- Venus warfare；
- calendar patrons；
- ritual acts；
- astronomy / divination。

它们不是传统意义上的“神话小说”，因此内容模型需要允许：

```text
kind = ritual-tradition | astronomical-tradition | mythic-dossier
```

而不是强行改写成虚构剧情。

建议 scope：

```text
postclassic-codex-dresden
postclassic-codex-madrid
postclassic-codex-paris
postclassic-codex-mexico
```

## 3.4 Colonial Yucatec

重要来源包括：

- Books of Chilam Balam；
- Ritual of the Bacabs；
- contact-period Yucatec records。

这些材料对：

- deity names；
- healing；
- cosmology；
- ritual language；
- Bacabs / directional beings；
- Ix Chel / related goddess traditions

非常重要，但必须标 Colonial scope，不能自动回填到 Classic period。

建议 scope：

```text
colonial-yucatec
colonial-yucatec-chilam-balam
colonial-yucatec-ritual-bacabs
```

## 3.5 Diego de Landa 等西班牙记录

`Relación de las Cosas de Yucatán` 等接触期记录具有很高资料价值，但属于殖民观察者文本。

规则：

- 可作为重要 historical witness；
- 不与 indigenous text 设为完全相同证据等级；
- 对 deity identity、ritual practice 等 claim 必须显示观察者来源。

## 3.6 现代学术资料

博物馆、碑铭数据库、Maya epigraphy / iconography 研究用于：

- 解读 glyph；
- 识别 deity attributes；
- 判断可能对应；
- 建立 period / region context；
- 追溯原始对象。

但 SourceRef 应尽量回落到：

```text
specific monument / vessel / codex page / colonial manuscript section
```

---

# 4. Identity / Equivalence Policy — 本轮最关键的数据规则

## 4.1 不允许只有 `same-as`

玛雅跨时期神祇关系至少需要支持：

```text
same-identity
possible-equivalence
scholarly-equivalence
later-cognate
motif-continuity
iconographic-analogue
name-continuity
uncertain
```

并挂：

```text
traditionScope
periodScope
sourceRefs
evidenceLevel
note
```

## 4.2 Seven Macaw ≠ Principal Bird Deity（默认）

产品规则：

```text
Vucub Caquix / Seven Macaw
  = K'iche' Popol Vuh Character

Principal Bird Deity
  = Preclassic / Classic iconographic entity

relation
  = possible / scholarly analogue
  != same-identity by default
```

两者跨越极长时间，不能因为视觉和故事相似直接合并。

## 4.3 Hun Hunahpu ≠ Classic Maize God（默认）

可以建立：

```text
mythic / iconographic correspondence
```

但不能把 Classic Maize God 的所有图像属性自动写进 Hun Hunahpu Canonical Design。

## 4.4 Q'uq'umatz ≠ K'uk'ulkan ≠ Quetzalcoatl（默认）

三者都属于 Mesoamerican feathered-serpent complex，但产品必须保留独立文化语境：

- Q'uq'umatz：K'iche' / Popol Vuh；
- K'uk'ulkan：Yucatec Maya；
- Quetzalcoatl：Central Mexican traditions。

MythCanvas 中可以 cross-link，但不做同一 Character 的三个 alias。

## 4.5 Ix Chel 身份政策

禁止默认文案：

> “Ix Chel = 年轻、美丽、温柔的玛雅月亮女神。”

原因：Postclassic / Colonial goddess identities 与现代大众“月亮女神 Ixchel”形象之间存在明显重建和混合。

P0 建模建议：

- `Chak Chel / Goddess O`：老年女神、治愈/分娩/洪水等 source-backed attributes；
- `Goddess I / youthful female deity`：保持独立 iconographic identity；
- `Ix Chel` 名称通过 Colonial / Postclassic evidence 建立 source-scoped mapping；
- “young moon goddess Ix Chel”只能进入 modern interpretation / reception，不做 canonical merge。

## 4.6 Itzamna / God D

可以保留传统学术对应，但必须允许后续研究修正：

```text
God D
↔ Itzamna
relationType = scholarly-equivalence / high-confidence if sources support
```

不要让旧的 Schellhas letter labels 消失；它们对图像资料检索仍有价值。

## 4.7 Death God 命名

不要把所有 Death God 固定叫 `Ah Puch`。

P0 建议：

```text
God A / skeletal death deity
Kisin / Yum Kimil 等名称
```

按 source scope 建 alias / correspondence。

## 4.8 Xibalba 不是全体玛雅统一地下世界专名

`Xibalba` 建成正式 World 时必须：

```text
traditionScope = kiche-popol-vuh
```

Classic Maya underworld scenes、caves、watery realms 不应默认绑定 `world-xibalba`。

---

# 5. P0 Content Manifest — 36 个 Narrative / Mythic-Ritual Units

玛雅不应该伪造一条跨两千年的统一时间线。

产品上应拆为三条可并行浏览的卷轴：

```text
A. Popol Vuh Narrative
B. Classic Maya Mythic Images
C. Postclassic / Yucatec Sacred Order
```

## Volume A：天地创造与失败的人类 — K'iche' / Popol Vuh

### 1. 原初寂静：Heart of Sky 与 Plumed Serpent

依赖候选：

- Heart of Sky / Huracán complex；
- Q'uq'umatz / Sovereign Plumed Serpent；
- creator figures，按具体译本拆分。

### 2. 大地从水与黑暗中被唤出

Scene：primordial water / emerging earth。

### 3. 动物被创造，却不能正确赞颂创造者

不把动物失败简单写成人类式“惩罚故事”，按原文叙事表达。

### 4. 泥土人创造失败

### 5. 木头人创造与毁灭

需要严格来源化洪水、器物反叛、动物攻击等细节，不跨译本拼接。

### 6. Seven Macaw 宣称自己是太阳与月亮般的光辉

Character：Vucub Caquix / Seven Macaw。

### 7. Hunahpu 与 Xbalanque 击败 Seven Macaw

### 8. Zipacna 与四百少年

### 9. Hero Twins 击败 Zipacna

### 10. Hero Twins 击败 Cabrakan

---

## Volume B：第一代球员与 Xibalba

### 11. Hun Hunahpu 与 Vucub Hunahpu 的球赛

### 12. Xibalba Lords 发出邀请

核心 antagonists 按 Popol Vuh 具体命名建 Character / group，不先用“12 Death Gods”现代简化。

### 13. 第一代球员在 Xibalba 被欺骗与杀死

### 14. Hun Hunahpu 的头进入葫芦树

Scene：calabash tree。

### 15. Xquic / Blood Moon 的受孕

避免现代“virgin goddess”固定标签，按文本身份和翻译记录。

### 16. Hunahpu 与 Xbalanque 出生

### 17. Hun Batz / Hun Chouen 与 Hero Twins

猴变叙事独立 Story，连接艺术 / music / artisan reception 时放 P1 enrichment。

### 18. 第二代 Hero Twins 收到 Xibalba 召唤

### 19. 通往 Xibalba 的道路与识破诸王

Scene：crossroads / council of Xibalba。

### 20. Xibalba 的试炼之屋

优先做一个 Story + 多 Scene：

- Dark House；
- Cold House；
- Jaguar House；
- Razor House；
- Fire House；
- Bat House。

具体 house 名称和顺序按选定版本校准。

### 21. Bat House 与 Hunahpu 被斩首

### 22. 球场上的头颅与恢复

### 23. Twins 主动赴死与复生

### 24. Twins 以表演者身份重返 Xibalba

### 25. Xibalba Lords 被击败

### 26. Hero Twins 升天与宇宙秩序恢复

不要默认正文写成“二人明确变成太阳与月亮”，除非所采用原文 / 译本足够支撑具体表述；可在 Interpretation 中说明后世常见解释。

---

## Volume C：玉米造人与 K'iche' 黎明

### 27. 白玉米与黄玉米创造真正的人类

### 28. 第一批人拥有过于完美的视野

### 29. 造物者限制人类视野

### 30. 第一批人的伴侣与人类繁衍

### 31. Tohil、Awilix、Jacawitz 与火

该段开始进入 K'iche' ethnogonic / lineage tradition，Story UI 必须明确不是“全玛雅共同神谱”。

### 32. 第一次黎明：太阳、月亮与星辰出现

可作为 Popol Vuh P0 主线收束。

K'iche' 迁徙、族群谱系、统治者历史进入 P0.5，不阻塞神话主干。

---

## Volume D：Classic Maya Mythic Image Dossiers

以下不是假装有完整“古典期神话小说”，而是基于图像 / 碑铭建立可浏览 mythic dossier。

### 33. Maize God 的死亡、地下与再生图像传统

- tonsured Maize God；
- emergence / rebirth imagery；
- watery / earth-monster / turtle imagery，按具体器物证据记录。

禁止自动写：`Maize God = Hun Hunahpu`。

### 34. K'awiil：闪电、丰饶与王权

重点：

- serpent leg / smoking element 等 iconographic anchors；
- royal legitimacy；
- abundance / lightning complex。

### 35. Chaak：雨、雷与劈开山石

建立 Classic + Codex source packages，不把所有长鼻 deity 都当 Chaak。

### 36. K'inich Ajaw 与太阳运行

P0 到此满足 36 unit 目标。

P0.5 紧接着补：

- Principal Bird Deity；
- God L；
- Classic Moon Goddess；
- Witz / cave / watery underworld；
- Classic Hero Twins / youthful deities 的学术重建。

---

# 6. Postclassic / Yucatec P0.5 Dossiers

这些不阻塞第一轮 36 units 上线，但应与视觉生产并行准备。

1. God D / Itzamna dossier；
2. Goddess O / Chak Chel / Ix Chel identity dossier；
3. Goddess I / youthful female deity dossier；
4. Death God / God A / Kisin dossier；
5. K'uk'ulkan / Feathered Serpent of Yucatán；
6. Dresden Venus Tables；
7. Chaak rain almanacs；
8. New Year / directional ritual；
9. Bacabs / Pauahtun identity problem；
10. Dresden flood / water-pouring imagery，避免包装成“玛雅世界末日唯一版本”。

---

# 7. Character Dependency Closure 与视觉分级

不先锁总人数。

## Tier S — 首批生产角色

建议首批 16 个高价值 Character / identity dossier：

### Popol Vuh 核心

1. Hunahpu
2. Xbalanque
3. Xquic / Blood Moon
4. Hun Hunahpu
5. Seven Macaw / Vucub Caquix
6. Q'uq'umatz
7. Huracán / Heart of Sky complex（先明确是否拆实体）
8. Xmucane

### Classic / Yucatec 核心

9. Maize God
10. Chaak
11. K'awiil
12. K'inich Ajaw
13. God D / Itzamna
14. Goddess O / Chak Chel / Ix Chel scoped identity
15. K'uk'ulkan
16. Death God / God A / Kisin scoped identity

Tier S 的目的不是“最流行 16 神”，而是覆盖：

```text
Creation
Hero cycle
Underworld
Maize
Rain
Sun
Lightning / kingship
Feathered serpent
Female deity tradition
Death
```

## Tier A

Story Dependency Closure 很可能继续反推出：

- Vucub Hunahpu；
- Zipacna；
- Cabrakan；
- Hun Batz；
- Hun Chouen；
- One Death / Seven Death 与其他 Xibalba Lords；
- Xpiyacoc；
- Tohil；
- Awilix；
- Jacawitz；
- first maize humans；
- Principal Bird Deity；
- God L；
- Goddess I；
- Bacabs / Pauahtun 等。

只有真正进入 Story / relation / visual experience 的实体才升级为正式 Character。

---

# 8. Relation / Character Graph 策略

玛雅 Character Graph 必须避免给用户制造“一个统一神族家谱”的错觉。

## 8.1 Relation 分三类

### A. Narrative Relation

例如：

```text
parent / child
sibling
enemy
ally
creator / created-by
ruler / subject
defeats / defeated-by
```

主要用于 Popol Vuh。

### B. Identity Correspondence

例如：

```text
possible-equivalence
scholarly-equivalence
later-cognate
iconographic-analogue
motif-continuity
```

必须弱化视觉，不与亲缘关系使用同一种边。

### C. Tradition Membership

```text
K'iche' Popol Vuh
Classic Lowland
Postclassic Codical
Colonial Yucatec
```

Graph UI 应允许筛 tradition，而不是默认把所有神全连到一个球体。

## 8.2 SSR 文本回退必须显示 scope

例如 Character Detail 不只显示：

> “与 Ix Chel 相关”

而应显示：

> “部分研究将 Postclassic Goddess O / Chak Chel 与殖民文献中的 Ix Chel 联系；现代常见的年轻月亮女神形象并不等同于这一对应。”

Graph 的简化边永远不能替代正文解释。

---

# 9. World / Scene 策略 — 玛雅必须 Scene-heavy

## 9.1 P0 不设固定 World 数量

明确可建的第一个 World：

```text
world-xibalba
traditionScope = kiche-popol-vuh
```

只有当后续来源足够明确时再建立其他 narrative world。

禁止为了“看起来像完整宇宙”直接创建：

```text
13 Heavens
9 Underworlds
Maya Heaven
Universal Maya Underworld
```

作为固定 World hierarchy。

## 9.2 P0 Scene 候选

### Popol Vuh

- primordial-dark-water；
- emerging-earth；
- seven-macaw-tree；
- hero-twins-ballcourt；
- calabash-tree；
- road-to-xibalba；
- xibalba-council；
- dark-house；
- bat-house；
- other trial houses；
- maize-creation-place；
- first-dawn-highlands。

### Classic

- witz-sacred-mountain；
- cave-mouth / earth-monster portal；
- watery-underworld；
- maize-rebirth-scene；
- royal-kawiil-vision；
- chaak-rain-storm；
- solar-path；
- cosmic-tree。

### Postclassic / Yucatán

- codex-ritual-space；
- cenote / cave ritual；
- rain almanac scene；
- venus-warrior sky；
- directional new-year rite。

---

# 10. Visual DNA V2

## 10.1 不再使用单一“玛雅雨林皮肤”

### K'iche' Highland

视觉关键词：

- volcanic highlands；
- cloud forest；
- maize fields；
- quetzal feathers；
- mountain dawn；
- dark caves / ballcourt；
- woven-material inspiration 需谨慎，不直接复制现代具体社区纹样。

Atmosphere：

```text
高地 / 黎明 / 玉米 / 山雾 / 仪式 / 英雄叙事
```

### Classic Lowland

视觉关键词：

- limestone palace / temple；
- stucco façade；
- roof comb；
- stela；
- polychrome ceramic；
- jade / shell / obsidian；
- cacao / maize / quetzal；
- courtly regalia。

Atmosphere：

```text
宫廷 / 仪式 / 湿热低地 / 玉石 / 彩绘 / 王权
```

### Postclassic Yucatán / Codical

视觉关键词：

- bark-paper codex palette；
- black / red linework；
- Maya blue；
- cenote；
- dry tropical Yucatán；
- Mayapan / Tulum / northern Yucatán reference when period matches；
- astronomical / calendrical composition。

## 10.2 强制 anti-contamination

所有玛雅 Prompt / Canonical Design 默认禁止：

- Aztec Sun Stone / Calendar Stone；
- Templo Mayor；
- Huitzilopochtli / Coatlicue 的专属造型；
- Mexica eagle-serpent national iconography；
- 把 Teotihuacan 当成“玛雅首都”；
- 所有角色统一巨大羽毛冠；
- 所有建筑统一 Chichén Itzá 金字塔；
- 随机生成看似可读的玛雅象形文字；
- 现代 New Age “Mayan astrology” 符号反写成古典事实。

## 10.3 Glyph 规则

AI 出图最容易生成伪文字。

产品规则：

```text
装饰场景：可以使用非语义化 glyph-like texture，但不得宣称可读
教育 / Story / Character 关键图：使用经过核对的具体 glyph 或完全不出现文字
UI 标题：不使用 AI 生成 glyph 代替真实 Maya script
```

---

# 11. Canonical Design 策略

Tier S Character 至少具备：

```text
identityAnchors
traditionScope
periodScope
silhouette
appearance
costumeLanguage
symbols
sacredObjects
mythologicalFacts
sourceScopedFacts
iconographicEvidence
interpretationNotes
originalDesignChoices
avoid
canonicalPrompt
```

## 11.1 Hero Twins

稳定锚点来自 Popol Vuh 叙事：

- blowgun / hunting；
- ballgame；
- Xibalba trials；
- paired but distinguishable protagonists。

避免：

- 直接复制某一现代游戏 / 动画 Hero Twins；
- 固定成 Classic ceramic 上某一组“孪生青年神”造型并宣称唯一正典；
- 两人做成完全镜像导致无法辨认。

## 11.2 Chaak

需要从 Classic / Codex source 提取：

- rain / storm identity；
- axe / lightning associations；
- diagnostic facial / nose traits 需要尊重具体时期图像。

避免：

- 直接画成 Aztec Tlaloc；
- 把所有长鼻 deity 等同 Chaak；
- 现代“蓝色雷神”模板。

## 11.3 Maize God

Canonical Design 必须区分：

```text
Classic Maize God iconography
vs
Popol Vuh Hun Hunahpu interpretation
```

不能互相自动继承 hairstyle / costume / death-rebirth scene。

## 11.4 Ix Chel / Chak Chel

P0 首先做身份研究卡，而不是先出“性感月亮女神”壁纸。

视觉资产在 identity scope 定稿前只允许：

- source-backed Goddess O / Chak Chel production；
- source-backed Colonial Ix Chel interpretation；
- youthful moon-goddess 作为明确 modern / artistic interpretation。

---

# 12. Structured Content Pipeline

目标结构：

```text
src/content/
├── greek/
├── norse/
└── maya/
    ├── catalog.ts
    ├── stories.ts
    ├── dossiers.ts
    ├── sources.ts
    ├── identities.ts
    ├── assets.ts
    ├── visual-tiers.ts
    └── index.md
```

通用入口：

```text
src/content/registry.ts
scripts/validate-mythology-content.mjs
scripts/sync-mythology-content.mjs
```

CLI：

```bash
pnpm content:validate maya
pnpm content:sync maya
```

不要创建：

```text
scripts/sync-maya-content.mjs
```

## 12.1 Validator 新增玛雅通用能力

这些规则应设计为 schema-level，而不是 hardcode `if maya`：

- Story dependency closure；
- source coverage；
- traditionScope 必填；
- periodScope 必填；
- identity correspondence 必须带 evidenceLevel；
- `same-identity` 跨时期使用时必须有显式 source；
- mutually-exclusive identity mapping 检查；
- World scope 与 Story scope 兼容；
- no dangling Character / World / Scene；
- alias collision；
- Canonical Design required fields；
- production artwork provenance；
- glyph / image QA metadata。

## 12.2 建议补充 SourceRef 字段

若现有 SourceRef 不足，优先泛化为：

```text
sourceType
work
objectId
site
period
language
traditionScope
locator
edition
translation
url
note
```

例如 Classic vase 不应该被硬塞成 `work='Maya Mythology'`。

---

# 13. Character Detail / Graph 集成

## 13.1 Character Detail ViewModel

玛雅角色详情至少显示：

```text
Identity
Tradition / Period
Aliases
Canonical Facts
Iconographic Evidence
Story / Dossier appearances
World / Scene affinity
Relations
Identity Correspondences
Interpretations
Variants
Canonical Design
Artwork
Sources
```

## 13.2 Identity Card 是玛雅的 P0 UI 能力

对以下角色必须显式显示“身份边界”：

- Ix Chel / Chak Chel / Goddess O；
- God D / Itzamna；
- Death God / God A / Kisin；
- Principal Bird Deity / Seven Macaw；
- Maize God / Hun Hunahpu；
- Q'uq'umatz / K'uk'ulkan。

用户应能一眼区分：

```text
确定身份
高置信学术对应
可能对应
相似母题
现代流行解释
```

---

# 14. 视觉资产生产分层

## Tier S Character

16 个 Tier S：

- production portrait 100%；
- Character Hero 100%；
- PC wallpaper >= 1；
- Mobile wallpaper >= 1；
- canonical source / period QA 100%。

## Tier A Character

- portrait 100%；
- Character Hero asset >= 1；
- wallpaper 可在 P0.5 补。

## World / Scene

P0 不要求“5 个 World”。

要求：

- `world-xibalba` Hero desktop + mobile；
- Story dependency 中所有 Tier-S Scene 至少有 production visual；
- Classic / K'iche' / Yucatec 三种视觉域可明显区分。

## Story

36 个 unit 不要求 36 张完全独立图片，但必须：

```text
Hero Asset Coverage = 100%
Narrative Fit = 100%
Wrong Tradition Visual Reuse = 0
```

优先独立 illustration：

- primordial creation；
- wood people destruction；
- Seven Macaw；
- calabash tree；
- road to Xibalba；
- Bat House；
- Twins resurrection / performance；
- maize human creation；
- first dawn；
- Maize God rebirth；
- Chaak storm。

---

# 15. 实施批次

## Batch 0 — 通用 Pipeline 与 Scope Model

1. 落地 generic mythology registry；
2. 落地 generic validator / importer；
3. 为 source / relation 增加 traditionScope / periodScope / evidenceLevel；
4. 支持 identity correspondence relation types；
5. 新建 `src/content/maya/`；
6. 建 Maya source manifest。

**DoD**：玛雅内容不需要任何 Maya-only 读取/同步路径。

## Batch 1 — Popol Vuh Story Manifest

1. 落 Volume A-C 32 个 K'iche' units；
2. 每个 unit 绑定具体 Popol Vuh section；
3. dependency closure 反推 Character / Scene；
4. 建 Xibalba World；
5. 建 K'iche' source / translation policy。

**DoD**：从创世到第一次黎明可以连续浏览，Character / Scene dangling = 0。

## Batch 2 — Popol Vuh Character / Relation Closure

1. Hero Twins；
2. Xquic；
3. Hun Hunahpu / Vucub Hunahpu；
4. Seven Macaw family；
5. creator figures；
6. Xibalba Lords；
7. first humans / Tohil group，按依赖决定实体化；
8. narrative relations 全部来源化。

**DoD**：Popol Vuh Graph 在 `kiche-popol-vuh` scope 下完整，不借 Classic 对应补洞。

## Batch 3 — Classic Maya Dossiers

1. Maize God；
2. K'awiil；
3. Chaak；
4. K'inich Ajaw；
5. Principal Bird Deity；
6. God L；
7. Classic underworld / Witz / cave scenes；
8. 每个 dossier 回链具体 monument / vessel / glyph evidence。

**DoD**：Classic 内容不存在“来源 = Popol Vuh”这种跨时期偷懒。

## Batch 4 — Postclassic / Yucatec Identity Dossiers

1. God D / Itzamna；
2. Goddess O / Chak Chel / Ix Chel；
3. Goddess I；
4. Death God；
5. K'uk'ulkan；
6. Chaak almanacs；
7. Venus tables；
8. Bacabs / Pauahtun。

**DoD**：所有跨传统 correspondence 都能在 UI / Graph 显示 certainty 与 source scope。

## Batch 5 — Visual DNA V2 + Canonical Design

1. Mythology Visual DNA V2；
2. K'iche' Highland Visual DNA；
3. Classic Lowland Visual DNA；
4. Postclassic Yucatán / Codex Visual DNA；
5. Tier S Canonical Design；
6. anti-Aztec contamination rules；
7. glyph QA rules；
8. prompt composer 接 tradition / period constraints。

**DoD**：随机抽取 Tier S Prompt，不再稳定产出“阿兹特克日历 + 雨林金字塔 + 巨型羽毛冠”的泛中美洲画面。

## Batch 6 — Character Detail / Graph / Story UX

1. Character identity card；
2. tradition filter；
3. period filter；
4. correspondence edge detail；
5. SSR relation fallback；
6. Story volumes；
7. Dossier 页面 / Story kind 兼容；
8. Maya mythology landing 按三条 tradition lane 展示。

**DoD**：用户不会把 Popol Vuh、Classic ceramic 和 Dresden Codex 内容误解成同一时代的一套神谱。

## Batch 7 — Visual Production

1. Tier S portraits；
2. Tier S PC / Mobile；
3. Xibalba World Hero；
4. Tier-S Scenes；
5. key Story illustrations；
6. provenance / license；
7. R2 / D1 sync。

## Batch 8 — QA / SEO / Release

1. alias / K'iche' / Yucatec spellings；
2. apostrophe / glottal notation URL strategy；
3. English / Chinese naming；
4. sitemap；
5. structured data；
6. source attribution；
7. artwork provenance；
8. broken media；
9. visual period review；
10. Aztec contamination audit；
11. identity forced-merge audit；
12. mobile Graph / accessibility / performance。

---

# 16. 验收指标

P0 不用角色总数作为成功指标。

```text
Core Narrative / Mythic-Ritual Units = 36 / 36
Story / Dossier Dependency Closure = 100%
Tradition Scope Coverage = 100%
Period Scope Coverage = 100%
Critical Identity Source Coverage = 100%
Critical Relation Source Coverage = 100%
Cross-period Forced same-as = 0
Dangling Entity = 0
Tier S Canonical Design = 100%
Tier S Character Detail = 100%
Tier S Production Portrait = 100%
P0 Hero Asset Coverage = 100%
Wrong-tradition Hero Reuse = 0
Critical Aztec/Maya Visual Contamination = 0
Fake Readable Glyph Claim = 0
Broken Production Media = 0
```

P0.5 / P1 再扩：

- K'iche' migration / lineage history；
- more Xibalba Lords；
- Classic Hero Twins reconstruction；
- Moon Goddess traditions；
- God L / merchant traditions；
- Bacabs / directional cosmology；
- Chilam Balam creation cycles；
- Ritual of the Bacabs healing cosmology；
- local cave / cenote traditions；
- site-specific mythic programs：Palenque / Copán / Yaxchilán / Tikal / Chichén Itzá / Mayapán；
- modern Maya living traditions，作为独立 living-tradition layer，禁止与古代材料静默混合。

---

# 17. 明确不做的错误方案

## 不做 1：做“玛雅十二主神”排行榜

玛雅神祇没有一个可跨两千年、跨地区稳定成立的奥林匹斯十二神式名单。

## 不做 2：把 Popol Vuh 当成所有 Maya 的统一 Canon

它是最重要的 Maya 文本之一，但首先是 K'iche' 传统。

## 不做 3：把所有羽蛇神合成一个 Character

Q'uq'umatz、K'uk'ulkan、Quetzalcoatl 建 cross-cultural relation，不做 alias。

## 不做 4：把 Ix Chel 固定成年轻月神

先解决 source identity，再生产 canonical visual。

## 不做 5：把 Hun Hunahpu 直接等于 Classic Maize God

允许 correspondence，不允许无来源 identity merge。

## 不做 6：所有地下场景都叫 Xibalba

Xibalba 默认只属于 K'iche' / Popol Vuh World scope。

## 不做 7：固定“13 层天界 + 9 层冥界 + 世界树”的现代信息图

可以收录具体来源中的 cosmological numbers / directions，但不制造一张全玛雅统一地图。

## 不做 8：玛雅视觉 = 丛林金字塔 + 羽毛头冠 + 阿兹特克太阳石

必须做 period / region visual scope。

## 不做 9：AI 随机生成可读玛雅文字

教育内容不能把模型乱码包装成真实 glyph。

## 不做 10：新建 Maya-only importer

玛雅是验证通用内容工程是否真正跨文明的关键测试集。

---

# 18. 推荐最终信息架构

```text
Maya Mythology
├── K'iche' Popol Vuh
│   ├── Creation
│   │   ├── Primordial World
│   │   ├── Animals
│   │   ├── Mud People
│   │   └── Wood People
│   ├── False Sun Cycle
│   │   ├── Seven Macaw
│   │   ├── Zipacna
│   │   └── Cabrakan
│   ├── Hero Twins
│   │   ├── First Ballplayers
│   │   ├── Xquic
│   │   ├── Hunahpu / Xbalanque
│   │   └── Xibalba
│   └── Maize Humanity & Dawn
│       ├── Maize Creation
│       ├── First People
│       ├── Tohil / Awilix / Jacawitz
│       └── First Dawn
├── Classic Maya
│   ├── Maize God
│   ├── K'awiil
│   ├── Chaak
│   ├── K'inich Ajaw
│   ├── Principal Bird Deity
│   └── Witz / Cave / Underworld Imagery
├── Postclassic Codices
│   ├── Dresden
│   ├── Madrid
│   ├── Paris
│   └── Maya Codex of Mexico
└── Colonial Yucatec
    ├── Itzamna / God D
    ├── Ix Chel / Chak Chel identity traditions
    ├── Death deity traditions
    ├── Bacabs / Pauahtun
    └── Healing / Calendar / Directional cosmology
```

用户进入玛雅神话后，页面必须表达：

> **这是一个跨越两千多年、由多地区和多语言群共同构成的文明传统，而不是一张现代人整理出来的统一“玛雅众神谱”。**

---

# 19. 最终优先级

```text
P0
1. Generic scope-aware content model
2. Popol Vuh 32-unit narrative closure
3. Core Classic dossiers to reach 36 units
4. Character / Relation dependency closure
5. Xibalba + Scene network
6. Tier S identity policy
7. Visual DNA V2 + anti-contamination
8. Character Detail / Graph scope UX
9. Tier S production assets
10. Source / identity / visual QA

P0.5
11. Postclassic codex dossiers
12. Yucatec identity dossiers
13. More Classic mythic imagery
14. Site-specific Scene packages

P1
15. Colonial Yucatec expansion
16. K'iche' lineage / migration tradition
17. Regional Maya traditions
18. Living Maya traditions as a separate, respectful layer
```

这套方案完成后，玛雅神话不会只是“Hero Twins + 金字塔 + Ixchel”的角色集合，而会成为 MythCanvas 中第一套真正具备 **时间维度、地区维度、文本/图像证据维度与身份不确定性表达** 的神话内容体系。