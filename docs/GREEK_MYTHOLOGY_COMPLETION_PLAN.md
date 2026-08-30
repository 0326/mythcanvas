# MythCanvas 希腊神话完整补全方案

> 状态：Review Proposal  
> 版本：V1.0  
> 日期：2026-08-30  
> 适用范围：希腊神话内容建模、人物扩充、神谱关系、神域/场景、故事、视觉资产、页面展示与后续 AI 出图。  
> 相关文档：`docs/CONTENT_POSITIONING.md`、`docs/CHARACTER_ART_SYSTEM.md`、`docs/CHINESE_MYTHOLOGY_CHARACTERS_PLAN.md`、`.agents/skills/mythcanvas-content-model/SKILL.md`

---

## 0. 结论

当前希腊神话已经具备一个可用骨架，但还不是完整的“神话体系”：

- 已有 `myth-greek`；
- 已有 `world-olympus`；
- 已有 12 个高认知人物；
- 12 个角色已有较完整 Canonical Design；
- Artemis 已经完成来源、解释层、Variant、World 关联等较完整的 Character Production；
- 已有少量故事、Scene 和 Olympus 视觉资产；
- `character_relations`、`character_interpretations`、`character_names` 等 Schema 已经能承载复杂神谱与多版本来源。

但目前最大缺口不是页面，而是内容图谱本身：

```text
当前：
希腊神话
  → 奥林匹斯
  → 12 个代表人物
  → 3 篇核心故事
  → 1 个主要 Scene

目标：
希腊神话
  → 宇宙起源
  → 原初神
  → 泰坦
  → 奥林匹斯诸神
  → 次级神系
  → 英雄时代
  → 怪物 / 神兽
  → 5 个核心 World
  → 20+ Scene
  → 30+ 核心 Story
  → 150+ 来源化 Character Relation
  → 完整视觉资产与出图能力
```

本次不应定义为“再补几十个希腊角色”，而应定义为：

> **完成 MythCanvas 第一套完整神话知识图谱与视觉宇宙，并把它沉淀成其他神话体系可以复用的完整度标准。**

---

# 1. 当前仓库盘点

## 1.1 已有人物

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

这 12 个已经在 `migrations/0020_greek_character_canonical_designs.sql` 中完成 Generation-grade Canonical Design，原则上保留并继续增强，不重新建模。

注意：这 12 个是“热门代表角色”，并不等于标准意义上的“十二奥林匹斯神”。当前缺少至少：

- Demeter / 得墨忒耳
- Dionysus / 狄俄尼索斯
- Hephaestus / 赫淮斯托斯
- Hestia / 赫斯提亚

其中 Demeter 与现有《珀耳塞福涅与四季》直接相关，应列最高优先级。

## 1.2 已有 World / Scene

当前：

- `world-olympus` / 奥林匹斯
- `scene-temple-of-olympus` / 诸神议庭

这导致希腊内容的空间表达过度集中在：

```text
白色大理石
黄金
高山
云海
神殿
```

无法覆盖冥界、爱琴海、英雄时代、克里特迷宫、特洛伊、德尔斐等重要视觉空间。

## 1.3 已有故事

当前希腊核心 Story 主要为：

- 普罗米修斯盗火
- 雅典娜诞生
- 珀耳塞福涅与四季

故事数据模型已经支持：

- `volume`
- `sources`
- `sourceNotes`
- `characterIds`
- `worldIds`
- `sceneIds`
- `heroAssetId`

所以当前不需要重新设计 Story Schema，重点是内容补全。

## 1.4 已有视觉资产

当前仓库内希腊静态资产主要集中在：

- Greek Olympus Hero
- Olympus Dawn
- Athena

并且 Story Illustration 当前仍统一使用 prototype provenance。

正式补全希腊体系后，必须逐步将 prototype 资产替换为正式 MythCanvas 原创 / AI 生成资产及真实 provenance。

## 1.5 已有关系与来源 Schema

`migrations/0020_character_interpretations.sql` 已经提供：

```text
Character
├── character_names
├── character_interpretations
├── character_relations
├── content_concepts
├── source refs
└── scoped variants / reference assets / generation provenance
```

`character_relations` 已支持：

- parent
- child
- consort
- sibling
- master
- disciple
- ally
- rival
- enemy
- serves
- rules-over
- syncretized-with
- associated-with
- created
- transformed-into

并支持 `source_refs_json`、`confidence` 和 Interpretation scope。

因此希腊神谱不需要另起一套“family tree table”，直接基于现有关系模型实现。

---

# 2. 完整度目标

本轮将希腊神话完整度划分成 P0 / P1 / P2。

## P0：形成完整主干

用户能从创世一路理解到英雄时代和特洛伊战争。

硬目标：

```text
Mythology = 1
Core World = 5
Core Character >= 48
Core Scene >= 20
Core Story >= 30
Character Relation >= 150
P0 SourceRef coverage = 100%
P0 Canonical Design coverage = 100%
```

## P1：形成高质量内容宇宙

- Character 扩至 70–80；
- 热门神祇和英雄拥有多 Interpretation / Variant；
- 核心人物具备正式视觉资产；
- Story 与 Character / World / Scene / Artwork 深度互联；
- 完成神谱产品化 UI；
- 补齐 SEO / GEO 结构化信息。

## P2：长尾扩展

- 河神；
- 宁芙；
- 地方神；
- 较小英雄；
- 地方版本；
- 小众怪物；
- 希腊化及罗马接收传统。

P2 不阻塞主体系上线。

---

# 3. 希腊神话内容主结构

后续人物不再按“热门度想到谁加谁”，统一进入以下分类：

```text
Greek Mythology
│
├── Protogenoi       原初神
├── Titans           泰坦
├── Olympians        奥林匹斯诸神
├── Other Deities    次级神 / 冥界神 / 海神 / 自然神
├── Heroes           英雄
├── Monsters         怪物
└── Creatures        神兽 / 非人格化生物
```

建议新增 / 统一 `character_type` 枚举语义：

```text
primordial
Titan
olympian
deity
hero
monster
creature
collective
mortal
```

数据库具体值建议全部使用小写 kebab-case / snake-free 英文：

```text
primordial
titan
olympian
deity
hero
monster
creature
collective
mortal
```

`olympian` 是编辑分类，不代表其血缘世代。

---

# 4. P0 Character：48 个核心实体

## 4.1 当前已有 12 个

保持现有 ID / slug，不改 URL：

- Athena
- Zeus
- Poseidon
- Hades
- Hera
- Aphrodite
- Apollo
- Artemis
- Ares
- Hermes
- Heracles
- Persephone

## 4.2 原初神：6

P0 必补：

1. Chaos / 卡俄斯
2. Gaia / 盖亚
3. Uranus / 乌拉诺斯
4. Tartarus / 塔耳塔罗斯
5. Nyx / 倪克斯
6. Eros / 厄洛斯

说明：

Eros 必须支持 layered interpretation，避免把赫西俄德原初 Eros 与后期 Aphrodite 身边的爱神形象粗暴合并成唯一版本。

## 4.3 泰坦与关键泰坦后代：14

十二泰坦：

1. Oceanus
2. Coeus
3. Crius
4. Hyperion
5. Iapetus
6. Cronus
7. Theia
8. Rhea
9. Themis
10. Mnemosyne
11. Phoebe
12. Tethys

关键后代：

13. Prometheus
14. Atlas

P0 先完成主干，Epimetheus、Menoetius 等放 P1。

## 4.4 缺失核心奥林匹斯神：4

1. Demeter / 得墨忒耳
2. Dionysus / 狄俄尼索斯
3. Hephaestus / 赫淮斯托斯
4. Hestia / 赫斯提亚

P0 完成后，奥林匹斯核心神系才算基本闭环。

## 4.5 核心英雄：6

1. Perseus / 珀尔修斯
2. Theseus / 忒修斯
3. Achilles / 阿喀琉斯
4. Odysseus / 奥德修斯
5. Jason / 伊阿宋
6. Orpheus / 俄耳甫斯

加上已有 Heracles，形成 7 个 P0 英雄核心。

## 4.6 核心怪物：6

1. Medusa / 美杜莎
2. Cerberus / 刻耳柏洛斯
3. Minotaur / 米诺陶洛斯
4. Hydra / 许德拉
5. Chimera / 奇美拉
6. Typhon / 堤丰

---

# 5. P1 Character 扩展池

P1 将总量扩到约 70–80。

## 5.1 神祇

优先：

- Helios
- Selene
- Eos
- Hecate
- Pan
- Nike
- Nemesis
- Iris
- Asclepius
- Leto
- Hebe
- Eileithyia

## 5.2 英雄 / 凡人 / 半神

- Bellerophon
- Atalanta
- Oedipus
- Hector
- Helen
- Medea
- Circe
- Ariadne
- Daedalus
- Icarus

## 5.3 怪物 / 神兽

- Pegasus
- Sphinx
- Polyphemus
- Scylla
- Charybdis
- Python

## 5.4 Collective

P1 再考虑：

- Muses
- Moirai
- Erinyes
- Graces
- Horae

初期建议使用 `collective` Character，不要为了数量立刻把九位缪斯全部拆开。

---

# 6. Character Production 标准

Artemis 当前是希腊角色的基准模板。

每个 P0 Character 最低要求：

```text
Character
├── stable identity
├── character_type
├── tradition_tags
├── source_periods
├── source_refs
├── canonicality
├── symbols
├── canonical_design
├── names
├── relations
├── worlds
├── stories
└── generation prompt
```

以下内容按需创建，不强制每个角色都有：

```text
CharacterInterpretation
CharacterVariant
ReferenceAsset
```

## 6.1 哪些角色必须做 Interpretation

至少：

### Artemis

已有：

- classical huntress
- later lunar identification

继续保留。

### Apollo

现有描述中的“太阳神”需要调整。

稳定 Character 核心建议改为：

> 预言、音乐、弓术与疗愈之神。

太阳身份放到后期 / 接收传统 Interpretation，与 Helios 保持区分。

### Eros

至少：

- primordial Eros
- later love-god tradition

### Aphrodite

至少允许：

- Hesiodic sea-foam birth
- Zeus + Dione genealogy tradition

### Hephaestus

出生谱系存在不同传统，不应写成唯一绝对版本。

### Dionysus

不同出生、地方与神秘宗教传统较复杂，至少保留来源边界。

原则：

> 有真实古代来源差异时建 Interpretation；仅画风、服装、年龄变化不要建 Interpretation。

---

# 7. World：从 1 个补到 5 个

P0 World：

## 7.1 Olympus / 奥林匹斯

已有，继续扩充。

内容：

- Olympian gods
- divine council
- Zeus throne
- divine palace / feast
- Hephaestus forge

## 7.2 Underworld / 冥界

核心角色：

- Hades
- Persephone
- Cerberus
- Hecate（P1）

视觉锚点：

- Styx
- dark royal palace
- ashen field
- torchlight
- black stone / bronze
- pomegranate

## 7.3 Tartarus / 塔耳塔罗斯

定位：

- 原初深渊
- 泰坦战争后的囚禁空间
- 与 Underworld 分离建模

禁止把它简单做成“地狱地下第二层”。

## 7.4 Ocean / 海洋神域

核心角色：

- Poseidon
- Oceanus
- Tethys
- 海怪群

视觉语言：

- Aegean blue
- sea green
- limestone
- bronze
- foam
- cliffs

## 7.5 Heroic Greece / 英雄时代的人间

这是聚合型 World，用于承载：

- 城邦
- 宫殿
- 山地
- 爱琴海航行
- 英雄远征
- 特洛伊战争

Athens / Troy / Crete / Ithaca 等具体地点不要都拆成 World，而放 Scene / Landmark。

---

# 8. Scene：P0 至少 20 个

## Olympus

1. Court of the Gods / 诸神议庭
2. Throne of Zeus / 宙斯王座
3. Forge of Hephaestus / 赫淮斯托斯神炉

## Underworld

4. Gate of Hades / 冥界之门
5. River Styx / 冥河
6. Palace of Hades / 哈迪斯王宫
7. Asphodel Fields / 水仙平原
8. Elysium / 至福乐土

## Sacred Places

9. Delphi / 德尔斐
10. Delos / 提洛岛
11. Eleusis / 厄琉西斯
12. Athens Acropolis / 雅典卫城

## Hero Cycles

13. Cretan Labyrinth / 克里特迷宫
14. Nemea / 涅墨亚
15. Thebes / 底比斯
16. Troy / 特洛伊
17. Ithaca / 伊萨卡
18. Colchis / 科尔喀斯
19. Mount Ida / 伊达山
20. Prometheus' Rock / 普罗米修斯受缚之山
21. Cave of Polyphemus / 独眼巨人洞穴

P0 至少完成前 20 个。

Scene 必须承担：

```text
Story ↔ Scene ↔ World ↔ Character ↔ Artwork
```

连接作用，而不是只做一个地点百科页。

---

# 9. Character Relation：建立真正的来源化神谱

这是本轮最重要的数据工程之一。

## 9.1 P0 目标

至少完成 150 条 active relation。

关系来源不得只写“网络常识”。

每条重要谱系关系至少包含：

```text
from_character_id
to_character_id
relation_type
source_refs_json
confidence
status
```

存在版本差异时：

```text
from_interpretation_id / to_interpretation_id
```

## 9.2 第一条主干必须完整

```text
Chaos
│
├── Nyx
└── ...

Gaia + Uranus
│
└── Twelve Titans
      │
      └── Cronus + Rhea
            │
            ├── Hestia
            ├── Demeter
            ├── Hera
            ├── Hades
            ├── Poseidon
            └── Zeus
```

继续连接：

```text
Zeus
├── Athena
├── Apollo
├── Artemis
├── Ares
├── Hermes
├── Dionysus
└── ...

Demeter
└── Persephone

Hades --consort--> Persephone
Apollo --sibling--> Artemis
```

## 9.3 不创建伪统一神谱

希腊神谱在 Hesiod、Homeric tradition、后世悲剧、Hellenistic / Roman material 中可能存在差异。

原则：

```text
不要：
UPDATE genealogy = one final truth

应该：
relation A
  source = Hesiod

relation B
  source = another ancient tradition
```

产品侧再负责表达“常见版本 / 其他版本”。

---

# 10. Story：从 3 篇扩到至少 30 篇

建议按五卷组织。

## Volume 1：创世与神族更替

- [ ] 混沌与世界诞生
- [ ] 盖亚与乌拉诺斯
- [ ] 克洛诺斯推翻乌拉诺斯
- [ ] 克洛诺斯吞噬子女
- [ ] 宙斯的诞生与成长
- [ ] 泰坦战争 Titanomachy
- [ ] 三兄弟划分世界
- [ ] 宙斯大战堤丰

## Volume 2：奥林匹斯诸神

- [x] 普罗米修斯盗火
- [ ] 潘多拉
- [x] 雅典娜诞生
- [x] 得墨忒耳与珀耳塞福涅
- [ ] 阿波罗与德尔斐
- [ ] 赫尔墨斯出生与偷牛
- [ ] 阿佛洛狄忒的诞生
- [ ] 狄俄尼索斯的诞生
- [ ] 赫淮斯托斯与神之锻炉

## Volume 3：英雄时代

- [ ] 珀尔修斯与美杜莎
- [ ] 赫拉克勒斯十二伟业
- [ ] 忒修斯与米诺陶洛斯
- [ ] 伊阿宋与金羊毛
- [ ] 俄耳甫斯与欧律狄刻
- [ ] 柏勒洛丰与奇美拉
- [ ] 代达罗斯与伊卡洛斯
- [ ] 阿塔兰忒

## Volume 4：底比斯与特洛伊

- [ ] 俄狄浦斯
- [ ] 帕里斯的裁决
- [ ] 阿喀琉斯之怒
- [ ] 阿喀琉斯与赫克托耳
- [ ] 特洛伊陷落

## Volume 5：奥德修斯归乡

- [ ] 独眼巨人
- [ ] 喀耳刻
- [ ] 塞壬
- [ ] 卡吕普索
- [ ] 重返伊萨卡

P0 至少完成 30 篇；剩余可以作为 P1 扩展。

---

# 11. Source Strategy

希腊体系非常适合作为 MythCanvas 来源规范的标准模板。

## 11.1 核心一级来源

### 宇宙 / 神谱

- Hesiod, `Theogony`
- Hesiod, `Works and Days`

### 英雄史诗

- Homer, `Iliad`
- Homer, `Odyssey`

### 单神专题

- `Homeric Hymns`

## 11.2 二级古典文学来源

按故事需要使用：

- Aeschylus
- Sophocles
- Euripides
- Pindar
- Apollonius Rhodius, `Argonautica`

## 11.3 古代整理与地理材料

- Pseudo-Apollodorus, `Bibliotheca`
- Pausanias

## 11.4 罗马接收传统

例如：

- Ovid
- Virgil
- Hyginus

可以使用，但必须在：

```text
tradition_tags
source_periods
source refs
interpretation
```

中标注 Roman reception，不作为“希腊唯一原典”。

## 11.5 辅助索引

可以使用 Perseus / Theoi 做资料定位，但正式 Character / Relation / Story 的 `source_refs` 应尽量指向具体古代文本、章节和版本说明。

---

# 12. Greek Visual DNA 扩充

当前 Greek Visual DNA 更接近“奥林匹斯 Visual DNA”，不足以代表整个希腊体系。

建议将其扩展为四组语汇。

## Olympus

```text
palette: marble white / antique gold / Aegean blue
materials: marble / bronze / gold / linen
architecture: Greek temple / colonnade / open court
atmosphere: bright / sacred / elevated / ordered
```

## Underworld

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

## Sea

```text
palette: Aegean blue / sea green / foam white / bronze
materials: limestone / bronze / wet stone
motifs: trident / waves / cliffs / horses / sea foam
atmosphere: elemental / bright / violent / vast
```

## Heroic Greece

```text
palette: limestone / olive green / terracotta / bronze
materials: stone / wood / bronze / woven textile
landscape: dry Mediterranean hills / olive groves / coast / citadel
architecture: Mycenaean walls / palace / shrine / harbor
atmosphere: mortal / heroic / sunlit / tragic
```

最终 Visual DNA 应用于：

```text
Mythology base DNA
  + World DNA
  + Character Canonical Design
  + Interpretation
  + Variant
  + Style
  + Scene
  + OutputSpec
```

不要把这些层重新揉成一个大 Prompt 字段。

---

# 13. 视觉资产生产计划

## 13.1 Character P0

48 个 P0 Character 最低标准：

```text
1 x Canonical Portrait
1 x PC Wallpaper
1 x Mobile Wallpaper
```

理论核心资产量约：

```text
48 x 3 = 144
```

但执行顺序不要一次性批量出 144 张。

推荐：

```text
先完成 Character 数据
→ Canonical Portrait
→ 人工 review 身份一致性
→ 再生产 PC / Mobile
```

热门角色再扩：

- Anime
- Cinematic
- Sacred
- Dark Fantasy
- Cyber Myth

Style 与 Character 必须保持正交。

## 13.2 World

每个 P0 World 最低：

```text
1 x Hero
2 x PC Wallpaper
2 x Mobile Wallpaper
```

## 13.3 Scene

Scene 不要求全部单独做 Hero。

优先：

- 作为 Story 插图；
- 作为 World Wallpaper 子场景；
- 被多个 Story 复用。

## 13.4 Story

Story 视觉优先复用：

```text
Artwork
Character Artwork
World Artwork
Scene Artwork
```

避免形成一套与 Artwork 系统完全脱离的 Story 图片库。

## 13.5 Prototype 清理

希腊 P1 完成前：

- [ ] prototype provenance 全部替换；
- [ ] source_type / license / creator 完整；
- [ ] width / height / alt 完整；
- [ ] 公开资产全部经过 review。

---

# 14. 页面产品化

## 14.1 Mythology Page

当前页面主要：

```text
Hero
Stories
Related Characters
Related Worlds
```

希腊补全后目标：

```text
希腊神话
│
├── 故事 Stories
├── 神谱 Genealogy
├── 神灵 Gods
├── 英雄 Heroes
├── 怪物 Monsters
└── 神域 Worlds
```

不要求一次把页面改成超级门户；可以先通过章节 / tab / anchor 完成。

## 14.2 Genealogy

需要新增：

```text
character-relations repository
        ↓
CharacterRelations component
        ↓
MythologyGenealogy component
```

### 默认简洁视图

```text
原初神
  ↓
泰坦
  ↓
奥林匹斯
  ↓
英雄时代
```

### Character 展开视图

以 Zeus 为例：

```text
父母
兄弟姐妹
配偶
子女
敌对关系
统治领域
相关故事
来源
```

不同来源存在冲突时必须显示为多个来源版本，不在后端硬 merge 成唯一答案。

## 14.3 Character Page

目标模块：

```text
Identity
Source / Tradition
Canonical DNA
Interpretation
Variant
Genealogy / Relations
Stories
World / Scenes
Artwork
Creation
```

## 14.4 World Page

目标模块：

```text
World Identity
Landmarks / Scenes
Characters
Stories
Visual Interpretations
Wallpapers
Related Worlds
```

---

# 15. 工程任务

## 15.1 内容层

- [ ] 新增 Greek P0 Character Migration
- [ ] 补全已有 12 个 Character source metadata
- [ ] 修正 Apollo 稳定身份描述
- [ ] 新增必要 CharacterInterpretation
- [ ] 新增 Character Names / aliases
- [ ] 新增 5 World 数据
- [ ] 新增 20+ Scene 数据
- [ ] 新增 150+ Character Relation
- [ ] 新增 30+ Story
- [ ] 新增 / 替换正式 Artwork provenance

## 15.2 Repository 层

- [ ] 增加 Character Relation repository
- [ ] 支持 mythology-scoped relation graph 查询
- [ ] 支持 character-scoped relation 查询
- [ ] 支持 relation source metadata 映射
- [ ] 支持 relation interpretation scope

## 15.3 UI 层

- [ ] CharacterRelations
- [ ] MythologyGenealogy
- [ ] Mythology Character taxonomy browse
- [ ] Gods / Heroes / Monsters 分类展示
- [ ] Source / alternate tradition 展示

## 15.4 Search / SEO / GEO

- [ ] aliases 进入搜索
- [ ] Roman / Greek alternate names 正确 scoped
- [ ] Character / World / Story 均进入 sitemap
- [ ] Mythology page 输出完整 hasPart / related entity schema
- [ ] 重要 Character 补充结构化 description
- [ ] 不在 SEO 文案中把多版本争议写成唯一事实

## 15.5 Validation

新增自动化测试：

- [ ] P0 Character count
- [ ] P0 source ref coverage
- [ ] relation target 不悬空
- [ ] story characterIds 不悬空
- [ ] story worldIds 不悬空
- [ ] story sceneIds 不悬空
- [ ] character worldIds 不悬空
- [ ] primary name uniqueness
- [ ] relation interpretation ownership
- [ ] public asset provenance completeness

---

# 16. Skill / 内部规范同步

当前 `.agents/skills/mythcanvas-content-model/SKILL.md` 中仍有：

```text
Mythology
  → Realm
  → Character
  → Scene
  → Artwork
```

但项目 Schema 已经完成 Realm → World 迁移。

本轮建议同步修正为：

```text
Mythology
  ↓
World
  ↓
Scene
  ↕
Character
  ↕
Story
  ↓
Artwork
```

同时明确：

```text
Character
  → Interpretation
  → Variant
  → Style
  → OutputSpec
```

各层正交。

避免后续 Agent 再生成 `realmId` / `realm_id`。

---

# 17. 推荐实施顺序

## P0-1：修当前内容

- Apollo 等角色事实边界修正；
- 12 个现有 Character source metadata 完善；
- taxonomy 建立；
- Skill World 术语同步。

## P0-2：补 World / Scene

先把空间骨架做完整：

```text
Olympus
Underworld
Tartarus
Ocean
Heroic Greece
```

以及 20+ Scene。

原因：后续 Character、Story、Artwork 都需要挂载这些空间。

## P0-3：扩 Character 12 → 48

完成：

- 原初神；
- 泰坦；
- 缺失 Olympians；
- 核心 Heroes；
- 核心 Monsters。

此阶段先数据完整，不要求同时完成所有壁纸。

## P0-4：补关系图谱

完成 150+ sourced relations。

优先主干：

```text
Creation
→ Titans
→ Cronus / Rhea
→ Olympians
→ Olympian families
→ Hero parentage / enemies
```

## P0-5：补 Story 3 → 30+

故事必须关联已有 Character / World / Scene。

## P0-6：神谱产品化

完成：

- Character relations UI；
- Mythology genealogy UI；
- Gods / Heroes / Monsters 分类浏览。

## P1-1：Character Production

对 P0 角色逐步完成：

- Interpretation；
- Variant；
- Canonical Portrait；
- PC / Mobile Wallpaper。

## P1-2：正式资产替换

清理全部 prototype 资产。

## P1-3：扩展 70–80 Character

进入次级神、特洛伊人物、奥德赛人物和更多怪物。

---

# 18. P0 验收标准

## 内容规模

- [ ] Core Character >= 48
- [ ] Core World = 5
- [ ] Core Scene >= 20
- [ ] Core Story >= 30
- [ ] Active Relation >= 150

## 数据质量

- [ ] P0 Character SourceRef coverage = 100%
- [ ] P0 CanonicalDesign coverage = 100%
- [ ] P0 Character taxonomy coverage = 100%
- [ ] orphan relation = 0
- [ ] orphan story character = 0
- [ ] orphan story world = 0
- [ ] orphan story scene = 0
- [ ] duplicate primary scoped name = 0

## 用户认知完整度

用户访问 `/mythology/greek/` 后应该可以回答：

### 世界怎么来的？

Chaos → Gaia / Uranus → Titans。

### 奥林匹斯诸神怎么取得统治？

Cronus → Zeus → Titanomachy → Olympian order。

### 主要神是谁？

核心 Olympians + Hades / Persephone / Titan lineage。

### 神之间是什么关系？

可以通过来源化 Genealogy 查看，而不是只靠角色简介猜。

### 主要英雄是谁？

Heracles、Perseus、Theseus、Achilles、Odysseus、Jason、Orpheus 等。

### 主要怪物是谁？

Medusa、Cerberus、Minotaur、Hydra、Chimera、Typhon 等。

### 故事如何串起来？

从创世、神族更替、奥林匹斯秩序，一直进入英雄周期、特洛伊战争与奥德修斯归乡。

---

# 19. 最终信息架构

```text
Greek Mythology
│
├── COSMOLOGY
│   ├── Chaos
│   ├── Gaia
│   ├── Uranus
│   └── Tartarus
│
├── GENERATIONS
│   ├── Protogenoi
│   ├── Titans
│   └── Olympians
│
├── WORLDS
│   ├── Olympus
│   ├── Underworld
│   ├── Tartarus
│   ├── Ocean
│   └── Heroic Greece
│
├── CHARACTERS
│   ├── Gods
│   ├── Heroes
│   ├── Monsters
│   └── Creatures
│
├── GENEALOGY
│   └── sourced relationship graph
│
├── STORIES
│   ├── Creation
│   ├── Divine Succession
│   ├── Olympian Myths
│   ├── Hero Cycles
│   ├── Trojan Cycle
│   └── Odyssey
│
└── ARTWORKS
    ├── Character
    ├── World
    ├── Scene
    ├── Creature
    └── Architecture
```

---

# 20. Review 决策点

本方案进入实现前，建议 Review 重点确认以下 6 项：

1. **P0 Character 是否锁定 48 个**，还是需要缩到 36 / 扩到 60。
2. **Heroic Greece 是否作为聚合型 World**，还是只保留神性 World、英雄时代完全使用 Scene。
3. **Tartarus 是否独立 World**，还是作为 Underworld 下特殊区域。
4. **Genealogy 是否进入 Mythology 主页面一级能力**。
5. **Story P0 是 30 篇还是先压到 20 篇。**
6. **P0 是否要求角色壁纸全部完成**；本方案建议 P0 先保证内容图谱完整，资产生产放 P1，避免阻塞结构建设。

默认建议：

```text
Character = 48
World = 5
Scene >= 20
Story >= 30
Relation >= 150
P0 聚焦数据 / 内容图谱
P1 再批量完成视觉资产
```

这套标准一旦验证通过，可抽象为后续：

```text
MYTHOLOGY_COMPLETENESS_STANDARD.md
```

再用于北欧、埃及、日本、印度等体系，而不是每个神话重新定义什么叫“补全”。
