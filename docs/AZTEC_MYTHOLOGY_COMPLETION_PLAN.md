# MythCanvas 阿兹特克 / 墨西加神话完整补全方案

> 状态：Review Proposal  
> 版本：V1.0  
> 日期：2026-09-02  
> 适用范围：Aztec / Mexica / Nahua 内容建模、Story、Character、Relation / Graph、World / Scene、来源体系、视觉资产、结构化内容流水线与后续 AI 出图。  
> 相关文档：`docs/GREEK_MYTHOLOGY_COMPLETION_PLAN.md`、`docs/NORSE_MYTHOLOGY_COMPLETION_PLAN.md`、`docs/NORSE_CHARACTER_DETAIL_GRAPH_INTEGRATION_PLAN.md`、`docs/JAPANESE_MYTHOLOGY_COMPLETION_PLAN.md`、`docs/EGYPTIAN_MYTHOLOGY_COMPLETION_PLAN.md`、`docs/MAYA_MYTHOLOGY_COMPLETION_PLAN.md`、`docs/CONTENT_POSITIONING.md`、`docs/CHARACTER_ART_SYSTEM.md`、`.agents/skills/mythcanvas-content-model/SKILL.md`

---

## 0.0 架构基线（2026-09-02）

本方案必须服从 [`docs/STATIC_CONTENT_DYNAMIC_DATA_REFACTOR_PLAN.md`](./STATIC_CONTENT_DYNAMIC_DATA_REFACTOR_PLAN.md)：已发布的 Mythology / World / Scene / Character / Relation / Story / Source / Claim / Style / OutputSpec 及策展 Artwork 元数据，以 Git 管理的 structured content 和 `PublicContentCatalog` 为权威源。

因此 Aztec 包接入后的公共页面、搜索、关系图、Story / Character SSR、生成上下文和 sitemap 不得依赖运行时 D1。D1 只保留给用户、收藏、生成任务、投稿审核、行为统计等动态数据；现有内容表仅作为过渡兼容镜像，不是公共页面的权威源。

D1 同步只做显式兼容性操作，不能成为公共发布门槛：

```bash
npm run content:mirror:d1 -- --mythology=aztec                 # 只校验并生成同步 SQL
npm run content:mirror:d1 -- --mythology=aztec --apply --local
npm run content:mirror:d1 -- --mythology=aztec --apply --remote # 需单独授权
```

本方案中的 parity 默认指静态目录与公共产品消费链路一致；Local / Production D1 apply 仅属于可选的镜像审计。

# 0. Review 结论

当前仓库已经有 `myth-aztec / aztec` 入口、Civilization Visual DNA、12 个已发布角色，以及对应的 generation-grade Canonical Design；但还没有 Aztec 独立的结构化内容包、Story spine、World / Scene closure、来源清单、关系图闭包和正式视觉资产。

因此本轮不能理解成“再补一批阿兹特克神名”，而应把现有入口补成一个可以连续阅读、可以来源追溯、可以进入角色关系图、可以驱动后续视觉生产的完整内容宇宙。

Aztec 与 Greek / Norse 最大的差异不是资料少，而是：

1. `Aztec` 是现代常用总称，而大量核心 P0 材料其实是 **Mexica / Tenochtitlan** 传统；
2. 中央墨西哥 Nahua 传统、Texcoco / Cuauhtitlan 传统、Mexica 传统之间不能自动互相回填；
3. “五太阳”“羽蛇神”“创世”“冥界层级”等常见现代叙述存在多个来源版本；
4. 征服后的 Nahuatl 文献既保存 Indigenous memory，又处在殖民记录语境，必须显示来源层；
5. Borgia Group 等中部墨西哥仪式文献不能默认贴成“Mexica 专属”；
6. 现代流行文化极易把 Maya、Mexica、Día de Muertos、现代墨西哥国家符号混成一种“中美洲风”。

所以 P0 的核心原则是：

> **Product slug 保持 `aztec`，编辑层必须 source-aware 地标记 Mexica / Nahua / Central Mexican tradition；不制造一套虚构的“Aztec Bible”。**

## 0.1 V1.0 的十二条硬规则

### 1. `Aztec` 是产品入口，不是所有事实的 tradition tag

公开 URL 与导航继续使用：

```text
myth-aztec
slug = aztec
```

但内容层必须区分至少：

```text
mexica-tenochtitlan
nahua-cuauhtitlan
central-mexican-nahua
central-mexican-ritual-codex
colonial-nahua-witness
```

最终 tradition vocabulary 由 source manifest review 收敛，不为营销方便把所有中央墨西哥资料写成 Mexica。

### 2. 不创建单一“标准五太阳版本”

不同文献对太阳时代、顺序、毁灭方式、角色身份存在差异。

P0 允许：

```text
一个 reader-friendly 主线
+ source-scoped alternate claims / alternate Story unit
```

禁止：

```text
把多个文献拼成一个来源不存在的统一宇宙史
```

### 3. P0 内容完整度与 P1 壁纸生产拆开

```text
P0 = Source + Narrative Coverage + Dependency Closure + Relation + Canonical Design + 最低视觉可用性
P1 = Tier S / A 正式 Portrait + PC / Mobile Wallpaper + World / Scene 高质量视觉资产
```

P0 不因为几十张壁纸未完成而阻塞内容宇宙上线。

### 4. Canonical Design 只复用当前通用 Schema

严格使用：

```text
anchors
silhouette
appearance
costumeLanguage
paletteCues
signatureMaterials
temperament
mythologicalFacts
originalDesignChoices
avoid
canonicalPrompt
```

来源、时期、争议身份进入：

```text
ContentClaim
Character.sourceRefs
Character.sourcePeriods
Character.traditionTags
CharacterInterpretation
CharacterName
CharacterRelation
```

不建立 Aztec-only Canonical Design 字段。

### 5. 不新增 Aztec-only Story kind

当前只允许：

```text
myth
folk-legend
religious-tradition
literary-fantasy
```

规则：

- 连续神话叙事使用 `myth`；
- 节庆、仪式、历法、神圣秩序主题在可独立回答用户问题时使用 `religious-tradition`；
- 纯身份争议进入 Character / Interpretation / Claim，不伪装成 Story；
- 不新增 `codex-dossier`、`ritual-dossier`、`cosmology-dossier` 等局部类型。

### 6. Identity Resolution 先于 Character expansion

高风险案例必须先过 Identity Gate：

```text
Quetzalcoatl deity vs Ce Acatl Topiltzin Quetzalcoatl
Quetzalcoatl vs Ehecatl-Quetzalcoatl
Tonatiuh vs Nanahuatzin transformed-sun identity
Ometeotl / Omecihuatl / Tonacatecuhtli / Tonacacihuatl
Coatlicue / Cihuacoatl / Toci / Teteoinnan
Tezcatlipoca directional/color manifestations
```

错误合并比暂时分开更难修复。

### 7. 不把“十三天界 / 九层冥界”做成无来源的固定宇宙地图

如果具体来源支持层级、方向或路径：

```text
→ ContentClaim / ContentConcept / Story source scope
```

而不是直接变成全站唯一宇宙模型。

### 8. Relation 只存 canonical direction

不同时保存：

```text
parent + child
defeats + defeated-by
creator + created-by
rules + ruled-by
```

同一事实只保留一个 canonical assertion，UI 从当前人物视角反向展示。

### 9. 人祭 / 剥皮 / 骷髅等内容必须史料化，不猎奇化

允许准确讲述仪式与神话事实；禁止以 gore、body horror、shock value 作为 Aztec 的默认视觉识别。

尤其：

- Xipe Totec 使用象征化 ceremonial layer；
- Coyolxauhqui 不用肢解血腥作为默认角色 portrait；
- Mictlantecuhtli 保留神圣死亡图像，不做 zombie / Grim Reaper；
- Tzompantli 仅在明确的 archaeological / ritual Scene 使用。

### 10. Visual DNA 必须防 Maya / 泛“部落风”污染

P0 Critical contamination = 0：

- 不使用 Maya jungle pyramid 作为 Tenochtitlan 默认建筑；
- 不使用 Maya glyph blocks 伪装 Nahua codex；
- 不使用东亚龙 / 欧洲翼龙替代 Quetzalcoatl；
- 不使用现代 Catrina / Día de Muertos 时尚替代 Mictecacihuatl；
- 不使用“generic tribal tattoos / feathers / skulls”作为视觉捷径。

### 11. 不生成假的“可读 Nahuatl / glyph text”

Codex / glyph 视觉如果不是经过 source review 的真实符号：

> 只能作为抽象装饰纹样，不得声称其具有可读文本含义。

### 12. P0 必须满足静态公共运行时 / Graph / Search / Sitemap / CI parity

最终内容必须同时进入：

- Character Detail；
- SSR Relations；
- Graph API；
- Mythology page；
- Story detail；
- World / Scene；
- search；
- sitemap；
- validator；
- static build / deploy；
- provenance audit。

不能出现“静态目录有内容、公共运行时却仍依赖 D1”或静态目录与 Graph / Search / Sitemap 不一致。D1 镜像兼容性另行审计。

---

# 1. 当前仓库基线与不可破坏约束

## 1.1 已存在 Mythology

当前：

```text
id = myth-aztec
slug = aztec
name = 阿兹特克神话
nameEn = Aztec Mythology
tagline = 太阳与羽蛇
```

Visual DNA：

```text
palette = 火山岩黑 / 绿松石 / 朱红 / 太阳金
motifs = 羽蛇 / 双神庙 / 太阳 / 黑曜石
materials = 火山岩 / 黑曜石 / 绿松石 / 黄金
atmosphere = 强烈 / 庄严 / 太阳崇拜 / 高原
```

建议保留 palette / motifs / materials，P0 Review 时将 `太阳崇拜` 调整为更不还原论的表达，例如：

```text
宇宙循环 / 湖城高原 / 仪式秩序
```

避免把整套 Nahua / Mexica 宗教压缩成“太阳崇拜”。

## 1.2 已存在 12 个 launch Characters

当前 migration 已发布：

1. Quetzalcoatl；
2. Huitzilopochtli；
3. Tezcatlipoca；
4. Tlaloc；
5. Coatlicue；
6. Xipe Totec；
7. Mictlantecuhtli；
8. Mictecacihuatl；
9. Tonatiuh；
10. Coyolxauhqui；
11. Xiuhtecuhtli；
12. Xochipilli。

这些不是“阿兹特克十二主神”，只视作当前产品 launch roster。

## 1.3 已存在 Canonical Design

`migrations/0027_aztec_character_canonical_designs.sql` 已给 12 个角色补齐 generation-grade Canonical Design。

本轮处理方式：

```text
保留现有 stable id / slug
→ source audit
→ identity audit
→ claim / alias / interpretation 补齐
→ 必要时修正文案事实
→ 不无理由重做视觉基线
```

其中已经正确包含的重要 guardrails 应继续保留：

- Quetzalcoatl 避免 Maya Kukulkan / 东亚龙混淆；
- Tlaloc 避免 Maya Chaac 混淆；
- Coatlicue / Xipe Totec / Mictlantecuhtli 避免 gore；
- Mictecacihuatl 避免 Catrina 化；
- Huitzilopochtli 保留 hummingbird / Xiuhcoatl；
- Tezcatlipoca 保留 smoking mirror / jaguar；
- Xiuhtecuhtli 保留 turquoise / brazier。

## 1.4 当前缺失

还没有正式：

```text
src/content/aztec/*
Aztec Story Manifest
Aztec World closure
Aztec Scene network
Aztec source registry / source manifest
Aztec Character dependency closure
Aztec relation graph
Aztec ContentClaims
Aztec production artwork
Aztec content tests
```

## 1.5 Stable ID Policy

现有 12 个 Character ID / slug 不改。

新增统一使用：

```text
character-<stable-ascii-name>
world-<stable-ascii-name>
scene-<stable-ascii-name>
story-<stable-ascii-name>
concept-<stable-ascii-name>
```

Nahuatl 正字法、声门符号、长音标记或后续学术拼写变化只影响 display / alias，不修改公开 URL。

---

# 2. MythCanvas 中“Aztec 完整”的定义

完整不等于：

- 收录所有 Nahua 神祇；
- 做一张无争议的“Aztec pantheon”；
- 把五太阳做成唯一版本；
- 把 13 heavens / 9 underworld levels 做成固定百科图；
- 把所有 Central Mexican codices 都称作 Mexica；
- 把祭祀做成最主要卖点；
- 把现代墨西哥民俗倒灌进前哥伦布时代。

P0 用户侧完整定义：

> 用户能够理解世界时代 / 太阳循环、特奥蒂瓦坎太阳诞生、Quetzalcoatl 取回人类骨骸、Coatepec 与 Huitzilopochtli 诞生、Mexica 迁徙与 Tenochtitlan 神圣中心、Mictlan / Tlalocan 等重要神圣空间，以及雨、火、更新、王权和节庆如何连接神祇与宇宙秩序；同时页面明确告诉用户这些叙事来自哪一条 Nahua / Mexica / Central Mexican 传统，以及哪些现代常见等同关系仍有争议。

## 2.1 P0 Coverage Matrix

### A. Cosmic Cycle / Creation Coverage

必须覆盖：

```text
world-age / sun-cycle variants
→ Teotihuacan sun creation
→ Nanahuatzin / Tecuciztecatl dependency
→ divine sacrifice / sun motion source scope
→ Quetzalcoatl descent to Mictlan
→ bones of previous humanity
→ creation of present humans
```

“Five Suns”不是一条来源无差异的固定流水线；每个关键差异要进入 claims / source notes。

### B. Mexica Patron Myth Coverage

必须覆盖：

```text
Coatepec
→ Coatlicue
→ Coyolxauhqui
→ Centzon Huitznahua
→ birth of Huitzilopochtli
→ Xiuhcoatl
→ defeat / sacred mountain narrative
```

并解释该叙事与 Mexica ritual / Templo Mayor sacred landscape 的关联时，明确这是 source + archaeological interpretation，不写成“建筑就是神话的字面复制品”的绝对事实。

### C. Migration / Foundation Bridge

至少覆盖：

```text
Aztlan memory
Mexica migration
Huitzilopochtli patron guidance
arrival / foundation tradition of Tenochtitlan
Sacred Precinct / Templo Mayor
```

迁徙史属于 myth-history bridge，不要把所有殖民期 pictorial history 都改写成纯 fantasy myth。

### D. Sacred Realm Coverage

至少覆盖：

```text
Mictlan
Tlalocan
Coatepec as sacred Scene
Teotihuacan sun-creation Scene
Tenochtitlan Sacred Precinct / Templo Mayor Scene
```

Tamoanchan / Chicomoztoc / Aztlan 是否进入 `World`，由 Source + Product Semantic Gate 决定，不为凑 World 数量硬建。

### E. Ritual / Sacred Order Bridge

至少覆盖：

```text
Xiuhtecuhtli / fire / year renewal
New Fire cycle
Tlaloc / rain / agricultural ritual
Xipe Totec / renewal ritual
Tezcatlipoca ritual identity bridge
calendar / festival context needed by P0 stories
```

这些不要求全部做成 Story URL。

## 2.2 P0 硬指标

```text
Core Narrative Coverage = 100%
P0 Story Entity Dependency Closure = 100%
P0 Required Narrative Relation Coverage = 100%
P0 Stable Identity Source Coverage = 100%
P0 Core Relation Source Coverage = 100%
P0 Story Primary-source Coverage = 100%
P0 Tradition Scope Coverage = 100%
P0 Source Period Coverage = 100%
P0 Canonical Design Coverage = 100%
P0 Existing 12 Character Source Audit = 100%
Conflicting Identity Forced Merge = 0
Duplicate Canonical Relation = 0
Invalid Relation Target = 0
Orphan Entity Reference = 0
Critical Maya/Aztec Visual Contamination = 0
Modern Catrina Conflation = 0
Fake Readable Glyph/Nahuatl Claim = 0
Graphic Gore Default Artwork = 0
```

明确不设置：

```text
Story = 30
Character >= 50
Relation >= 150
World = 9
```

数量由 Narrative Dependency Closure 决定。

## 2.3 P1

- Tier S / Tier A production portrait；
- Tier S PC + Mobile wallpaper；
- 核心 World / Scene desktop + mobile Hero；
- Story illustration 深化；
- period / tradition graph filter；
- source-scoped alternate narrative UI；
- pronunciation / Nahuatl alias / SEO 深化；
- archaeological object visual-reference pack；
- provenance audit 清零。

## 2.4 P2

- Texcoco / Acolhua traditions；
- Tlaxcalan / Puebla-Tlaxcala regional material；
- Cantares Mexicanos / sacred poetry；
- deeper Borgia Group ritual programs；
- site-specific Tenochtitlan archaeological programs；
- broader Nahua migration traditions；
- colonial transformation of deity identities；
- living Nahua traditions，作为独立 living-tradition layer。

Living tradition 不与前哥伦布材料静默混合。

---

# 3. Terminology / Tradition / Period Policy

## 3.1 Product layer

继续使用：

```text
Aztec Mythology
阿兹特克神话
/ mythology / aztec
```

这是用户认知和 SEO 入口。

## 3.2 Editorial layer

事实尽量使用更精确主体：

```text
Mexica
Nahua
Central Mexican
Tenochtitlan
Cuauhtitlan
Texcoco / Acolhua
```

例如：

```text
Huitzilopochtli = Mexica patron deity
```

比：

```text
Huitzilopochtli = 所有 Aztec/Nahua 的最高神
```

更准确。

## 3.3 Tradition tag 不等于 ethnicity ontology

P0 tradition tag 是编辑 / 来源 scope，不试图建立现代族群本体论。

候选：

```text
mexica-tenochtitlan
nahua-cuauhtitlan
central-mexican-nahua
central-mexican-ritual-codex
colonial-nahua-witness
```

最终必须在 Source Manifest 中记录每个 tag 的定义、适用来源和禁止外推范围。

## 3.4 Period 使用现有字段

直接复用：

```text
Character.sourcePeriods
SourceRef.period
MythStorySource.period
```

P0 不新增：

```text
aztecPeriodScope
evidenceEra
precontactConfidence
```

如所有文明都需要统一 period facet，再做 Generic Schema Proposal。

---

# 4. 来源体系与 Evidence Policy

Aztec P0 的来源不能只写“据阿兹特克神话”。每个核心 Story / Identity / Relation 必须回落到可定位来源。

## 4.1 Tier 1A — Nahuatl / Indigenous-collaborative Colonial Texts

### Florentine Codex

P0 核心入口之一。

重点：

```text
Book 1 — Gods
Book 2 — Calendar and Festivals
Book 3 — Origin of the Gods
Book 7 — sun / moon / natural philosophy related passages
```

规则：

- 明确 16 世纪殖民语境；
- 记录 Nahuatl / Spanish column 与采用译本；
- 不把 Sahagún 的宗教评价语言当成 Indigenous self-description；
- 对 Huitzilopochtli / Coatepec 等内容记录具体 book / folio / chapter locator。

### Primeros Memoriales / related Sahaguntine materials

用于早期采集版本、节庆、神祇图像与术语交叉核对。

同一叙事与 Florentine Codex 有差异时，不静默覆盖。

## 4.2 Tier 1B — Codex Chimalpopoca corpus

重点分开管理：

```text
Annals of Cuauhtitlan
Leyenda de los Soles / Legend of the Suns
```

它们是 P0 “太阳时代 / Quetzalcoatl / 当前人类创造”等主题的重要文本来源。

规则：

- 记录具体 text unit，而不是只写 `Codex Chimalpopoca`；
- 不把 Cuauhtitlan tradition 自动写成 Tenochtitlan / Mexica 版本；
- 不与 Florentine Codex 拼成无 source boundary 的统一创世故事。

## 4.3 Tier 1C — Pictorial / Ritual Codices

候选：

```text
Codex Borbonicus
Borgia Group materials
Codex Tudela / Magliabechiano related traditions
Codex Boturini / Tira de la Peregrinacion
Codex Azcatitlan
Codex Aubin
```

规则：

- source provenance 单独记录；
- Borgia Group 默认按 `Central Mexican ritual` evidence 处理，不直接标 `Mexica`；
- migration codices 可以支持 Aztlan / migration / settlement memory，但不等于现代小说式连续 Story；
- pictorial glyph 不自行“翻译”成来源未给出的长句。

## 4.4 Tier 1D — Archaeological / Iconographic Evidence

P0 必须纳入，而不是只依赖文本：

```text
Templo Mayor / Sacred Precinct
Coyolxauhqui monolith
Coatlicue sculpture
Tlaltecuhtli monolith
Sun Stone
Tlaloc / Huitzilopochtli architecture and offerings
Ehecatl-Quetzalcoatl circular-temple evidence
```

用途：

- stable visual anchors；
- cult / sacred-space context；
- iconographic identity；
- ritual geography；
- architecture；
- visual reference packs。

规则：

> archaeological object 不是“插图版权免费素材”的代名词；每个外部图片仍需独立 provenance / license review。

同时：

- Sun Stone 不称为“阿兹特克神话完整宇宙地图”；
- archaeological interpretation 与 ancient textual claim 分开。

## 4.5 Tier 2 — Colonial External Witness

例如：

- Diego Durán；
- Motolinía；
- Torquemada；
- 其他 Spanish chroniclers。

规则：

- 明确作者、时期、立场；
- 可补节庆、历史、仪式 witness；
- 不单独承担高风险 deity identity merge；
- 殖民作者的基督教比较 / demonization 不进入角色默认自我描述。

## 4.6 Tier 3 — Academic Secondary

用于：

- philology；
- Nahuatl normalization；
- iconography；
- archaeology；
- manuscript provenance；
- identity correspondence；
- ritual reconstruction；
- scholarly disagreement。

现代学术判断进入：

```text
ContentClaim.status = supported | contested | editorial-synthesis
```

不伪装成 pre-contact primary claim。

## 4.7 SourceRef Schema 直接复用

当前字段足够 P0：

```text
type
title
section
author
period
edition
locator
language
translation
url
note
```

例如：

```text
type = primary-text
title = Florentine Codex
section = Book 3, Chapter 1
period = 16th century colonial Nahua / New Spain
locator = folio 1r–3v
language = nah
translation = selected editorial translation
note = Huitzilopochtli birth / Coatepec narrative; colonial compilation context
```

P0 不先扩 Aztec-only `codexId / site / evidenceLevel / objectType`。

如果真实数据证明不够，再提交 Generic SourceRef Review。

---

# 5. Name / Nahuatl / Translation / URL Policy

## 5.1 每个 P0 Character 建 Name Manifest

至少记录：

```text
primary display name
nameEn
Classical Nahuatl form when editorially established
common English spelling
Chinese display name
legacy spelling / translation aliases
source-scoped titles
```

## 5.2 CharacterName 直接复用

```text
primary
alias
title
literary-identity
```

所有非显然 alias 带：

```text
sourceRefs
confidence
interpretationId when needed
```

## 5.3 URL 不跟正字法迭代

例如 URL 一旦发布：

```text
/character/quetzalcoatl
```

后续即使显示层采用不同 Nahuatl orthography，也不修改 slug。

## 5.4 中文名称策略

现有 12 角色 URL 与数据库 ID 保持稳定。

中文 display name 可以在 source review 后统一校对音译，例如：

- Quetzalcoatl；
- Huitzilopochtli；
- Tezcatlipoca；
- Mictlantecuhtli。

不要因为不同中文百科音译而创建多个 Character。

---

# 6. Identity Resolution Policy

这是 Aztec P0 最容易产生永久数据债的部分。

## 6.1 Identity Gate

判断顺序：

```text
A. 是否存在稳定、可来源化的同一身份？
   YES → 同一 Character

B. 是否只是 title / manifestation / cult aspect / iconographic form 差异？
   YES → CharacterName / CharacterInterpretation

C. 是否是传奇历史人物与神祇发生后世叠合？
   → 默认独立 Character / Concept + source-scoped correspondence

D. 是否只是现代百科常见等同？
   → 不合并，先查 source

E. 证据冲突？
   → confidence = contested，默认图隐藏强断言
```

## 6.2 Quetzalcoatl deity vs Ce Acatl Topiltzin Quetzalcoatl

默认：

```text
Quetzalcoatl = deity Character
Ce Acatl Topiltzin Quetzalcoatl = legendary / ruler-priest identity，若进入内容则独立 entity
```

不做无 scope alias。

Tollan / Topiltzin 相关传统如进入 P1，使用：

```text
possible-correspondence / literary-identity / tradition-scoped claim
```

## 6.3 Quetzalcoatl vs Ehecatl-Quetzalcoatl

优先评估为：

```text
1 Character + CharacterInterpretation
```

因为风神形态在 Mexica sacred precinct 具有明确 Ehecatl-Quetzalcoatl cult form。

但实施前仍需：

- source refs；
- cult/iconography review；
- alias / title review。

不要额外建一个仅靠名字重复的 `character-ehecatl`，除非 Story dependency / product UX 证明需要稳定独立实体。

## 6.4 Tonatiuh vs Nanahuatzin

不默认：

```text
Nanahuatzin === Tonatiuh
```

正确表达：

- Nanahuatzin 是 Teotihuacan sun-creation narrative 的参与者；
- 其成为太阳的叙述属于具体来源；
- Tonatiuh 是稳定太阳神 identity；
- 两者关系使用 source-scoped transformation / identity claim，而不是永久 alias。

## 6.5 Ometeotl / Omecihuatl / Ometecuhtli / Tonacatecuhtli / Tonacacihuatl

这是 P0 高风险争议区。

V1.0 不把现代常见的：

> “Ometeotl 是阿兹特克唯一至高双性创世神”

当作无争议 canonical fact。

处理方式：

```text
ContentConcept / ContentClaim first
→ source review
→ contested academic interpretation visible
→ 只有 Identity Gate 通过后再决定 Character form
```

因此 Ometeotl 不作为 P0 Story Dependency 的必备主神。

## 6.6 Coatlicue / Cihuacoatl / Toci / Teteoinnan

不自动：

```text
all same goddess
```

可以记录：

- shared earth / motherhood / ritual motifs；
- source-scoped titles / correspondences；
- archaeological / colonial description差异。

P0 只要求 Coatlicue closure；其他身份按 Story dependency 进入 P1 或 contested relation。

## 6.7 Tlaltecuhtli

如果进入 P0 cosmic / earth dependency：

- 保留其复杂性别 / iconographic presentation；
- 不简单强制翻译为“男土地神”或“女大地母神”；
- summary 与 visual design 使用 source-reviewed language。

## 6.8 Coyolxauhqui

当前 role = “月亮女神”。

P0 Source Audit 必须检查：

- Coatepec narrative 中确定角色事实；
- archaeological identity；
- lunar / celestial interpretation 的来源等级。

如果“月亮女神”属于 editorial / scholarly synthesis，应进入 ContentClaim，而不是把解释写成唯一古代自称。

## 6.9 Mictecacihuatl

保持和现代：

```text
La Catrina
Día de Muertos fashion icon
```

严格分离。

跨时代文化连续性如果未来要做，是 P2 living / colonial transformation 主题，不写进 pre-contact canonical design。

---

# 7. Story Manifest — 以叙事闭包而不是数量为目标

## 7.1 Narrative Unit Quality Gate

一个 P0 Story URL 必须至少满足：

1. 能独立回答一个明确用户问题；
2. 有完整叙事起点 / 转折 / 结果，或完整 religious-tradition subject；
3. 至少一个可定位 primary / near-primary source；
4. 不只是上一 Story 的 1–2 段拆分；
5. 有独立 Character / Scene / Concept 浏览价值；
6. source tradition 可以明确；
7. 不为了凑页面数拆页。

## 7.2 Volume A — Suns, Creation & Present Humanity

Dependency checklist：

```text
world ages / suns
Teotihuacan gathering of gods
Nanahuatzin
Tecuciztecatl
sun / moon emergence
sun motion / divine sacrifice tradition
Quetzalcoatl
Mictlan
Mictlantecuhtli
bones of earlier humanity
creation of present humans
```

建议 Story units：

1. **太阳时代与世界毁灭：版本导读**  
   不是把多个来源熔成一版，而是给用户一个 source-aware 的 world-age framework。

2. **黑暗中的诸神：谁将成为太阳**  
   Teotihuacan assembly + Nanahuatzin / Tecuciztecatl。

3. **新太阳为何开始运行**  
   只按 selected source 讲 divine sacrifice / motion，不把所有文本版本混合。

4. **Quetzalcoatl 下入 Mictlan 取回人类骨骸**。

5. **第五世界中的人类如何诞生**  
   与上一单元是否合并，由 Quality Gate 决定。

6. **玉米 / 食物获得传统**  
   只有在 source manifest 完成且能独立成篇时进入 P0；否则 P0.5。

### Alternate-source 规则

Five Suns 差异优先采用：

```text
main Story
+ claims
+ sourceNotes
+ alternate source card / paragraph
```

只有差异大到形成独立阅读价值时才拆第二 Story。

## 7.3 Volume B — Coatepec & Birth of Huitzilopochtli

Dependency checklist：

```text
Coatepec
Coatlicue
Coyolxauhqui
Centzon Huitznahua
Huitzilopochtli
Xiuhcoatl
```

建议 Story units：

1. Coatlicue 在 Coatepec 的怀孕；
2. Coyolxauhqui 与 Centzon Huitznahua 的冲突；
3. Huitzilopochtli 的武装诞生与 Xiuhcoatl；
4. Coatepec narrative 与 Mexica sacred ritual landscape。

前三项可能最终合成 1–2 个 Story；第 4 项更适合 `religious-tradition` 或 Scene explanatory content。

不要为“每个战斗动作”拆 Story。

## 7.4 Volume C — Migration, Patron God & Tenochtitlan

Dependency checklist：

```text
Aztlan
migration route tradition
Mexica
Huitzilopochtli patron guidance
selected migration stops
foundation tradition
Tenochtitlan
Sacred Precinct
Templo Mayor
```

建议 Story units：

1. **从 Aztlan 出发：Mexica 迁徙记忆**；
2. **Huitzilopochtli 与迁徙中的守护神身份**；
3. **Tenochtitlan 建城传统**；
4. **Templo Mayor：城市中心如何成为神圣宇宙轴**（`religious-tradition`）。

规则：

- 明确这是 myth-history bridge；
- 区分 Codex Azcatitlan / Boturini / other witnesses；
- 不用现代墨西哥国旗图形倒推出单一 pre-contact narrative；
- 不把 migration route 不确定节点伪装成 GPS 历史路线。

## 7.5 Volume D — Death, Rain & Sacred Realms

候选 Story / religious-tradition units：

1. **Mictlan 与亡者之路**；
2. **Quetzalcoatl 在 Mictlan 的挑战**（如 Volume A 已完整覆盖则不重复）；
3. **Mictlantecuhtli / Mictecacihuatl 的冥界王权**；
4. **Tlaloc、雨与 Tlalocan**；
5. **谁去往哪些死后空间**：只有 source review 足够时进入。

“九层 Mictlan”不得以现代 infographic 为 primary source。

## 7.6 Volume E — Fire, Renewal & Ritual Order

P0 / P0.5 候选：

1. Xiuhtecuhtli 与 sacred fire；
2. New Fire ceremony / 52-year renewal；
3. Xipe Totec 与农业更新；
4. Tlaloc festivals / rain cycle；
5. Tezcatlipoca / Toxcatl tradition；
6. Xochipilli / flower-art-festival tradition。

其中只有满足独立用户问题 + primary source locator 的主题才建立 Story URL。

## 7.7 Tezcatlipoca / Quetzalcoatl cosmic cycles

现代百科经常写成一条非常整齐的“兄弟轮流毁灭世界”。

P0 不直接采用这种总述。

实施方式：

```text
source manifest
→ identify source-specific conflict / creation episodes
→ ContentClaim
→ Story only when narrative unit is source-complete
```

---

# 8. Character Dependency Closure

## 8.1 Stable Character Type

复用当前通用值：

```text
deity
hero
mortal
monster
creature
collective
```

不新增：

```text
sun-god
ritual-god
mexica-patron
underworld-king
codex-deity
```

这些进入 role / tags / collection / claim。

## 8.2 现有 12 个角色是 baseline，不是 closure

P0 新增角色完全由 Story dependency 产生。

高概率新增：

### Cosmic / Creation

- Nanahuatzin；
- Tecuciztecatl；
- Tlaltecuhtli，若 selected creation cycle 需要；
- Chalchiuhtlicue，若 Five Suns selected source 需要；
- Xolotl，若太阳 / Mictlan dependency 需要；
- Mixcoatl，若 selected genealogy / Quetzalcoatl narrative 需要。

### Coatepec

- Centzon Huitznahua：优先 `collective`；
- 不创建“400 个南方兄弟”单体 Character。

### Migration / Foundation

只实体化：

- 在多个 Story 复用；
- 有稳定关系；
- 有独立 Character Detail / SEO 价值；

的命名人物。

迁徙地点、族群、神谕不要伪装成 Character。

## 8.3 P1 高价值候选

- Chalchiuhtlicue；
- Xochiquetzal；
- Tlazolteotl；
- Mayahuel；
- Cihuacoatl；
- Toci / Teteoinnan，Identity Gate 后；
- Xolotl；
- Mixcoatl；
- Ehecatl，若最终判定需要独立 entity。

P1 仍不设硬数量。

## 8.4 Collective Policy

以下更适合 collective / concept：

```text
Centzon Huitznahua
star groups
certain directional deity groups
migration groups
```

只有个体具有独立叙事 / relation / visual value 时才拆分。

---

# 9. Character Relation / Graph

## 9.1 直接复用当前 Schema

```text
assertionKey?: string
traditionScope?: string
isDefault?: boolean
sourceRefs: SourceRef[]
confidence: high | medium | contested
fromInterpretationId?: string
toInterpretationId?: string
```

## 9.2 P0 Relation Groups

### Genealogy

- Coatlicue → Huitzilopochtli；
- Coatlicue → Coyolxauhqui；
- Coatlicue → Centzon Huitznahua，source-scoped；
- 其他 genealogy 只有 selected source 支持时加入。

### Narrative Conflict

- Huitzilopochtli → defeats → Coyolxauhqui；
- Huitzilopochtli → defeats → Centzon Huitznahua；
- Quetzalcoatl ↔ Mictlantecuhtli 的 Mictlan narrative 使用精确 narrative relation，不用模糊 `enemy`。

### Creation / Transformation

- Nanahuatzin → becomes / produces sun，必须 source-scoped；
- Tecuciztecatl → moon transformation，按 selected source；
- Quetzalcoatl → creates / restores humanity，按 selected text；
- divine sacrifice / sun motion 不把“所有 gods”强制展开为大量 relation edge。

### Sacred Domain

`rules / associated-with / patron-of` 必须区分：

- CharacterRelation 只表达角色之间的关系；
- 神祇与 World / Scene / festival 的关系优先由 entity linkage / claims 表达；
- 不为了画 Graph 把 Tenochtitlan、rain、fire 伪装成 Character。

## 9.3 Canonical Direction

例如：

```text
parent: Coatlicue -> Huitzilopochtli
```

不再存：

```text
Huitzilopochtli -> child-of -> Coatlicue
```

UI 做 inverse label。

## 9.4 Identity / Correspondence Relation

高风险 correspondence：

```text
Quetzalcoatl deity <-> Topiltzin Quetzalcoatl
Quetzalcoatl <-> Ehecatl form
Nanahuatzin <-> Tonatiuh
Coatlicue <-> broader mother-goddess identities
Ometeotl-related identities
```

必须：

```text
sourceRefs != empty
confidence explicit
traditionScope explicit when needed
assertionKey explicit for alternatives
```

contested edge 默认不进入 compact genealogy。

## 9.5 Graph SSR fallback

Character Detail SSR 至少展示：

```text
角色身份
tradition / period
父母 / 子女 / siblings
关键冲突
创造 / transformation relation
可能身份对应
来源 / 争议说明
```

3D / interactive Graph 不是唯一信息入口。

---

# 10. World / Scene Semantics

延续现有产品定义：

> World / Realm = 稳定神话空间层；Scene = 可复用的具体地点、建筑、边界或事件空间。

## 10.1 P0 World 候选

### Mictlan

```text
world-mictlan
```

P0 稳定 World。

注意：具体“九层”路径作为 source-scoped claims / scenes，而不是 World schema 的硬编码层级。

### Tlalocan

```text
world-tlalocan
```

P0 候选，前提是：

- source identity review；
- Tlaloc / rain / afterlife relation closure；
- visual design 不做 generic tropical paradise。

### Tamoanchan

重要但语义复杂。

P0 默认：

```text
ContentConcept / Scene candidate
```

只有来源闭包与 World semantic review 通过后才提升为 World。

## 10.2 P0 Scene 候选

### Cosmic / Creation

- Teotihuacan gathering place；
- sacrificial fire / sun emergence scene；
- Quetzalcoatl descent route to Mictlan；
- bones-of-humanity chamber / source-reviewed location abstraction。

### Coatepec

- sacred mountain Coatepec；
- Coatlicue sweeping / conception scene；
- Huitzilopochtli birth confrontation；
- Coyolxauhqui fall / monumental interpretation scene，避免 gore。

### Mexica / Tenochtitlan

- Aztlan origin-memory scene；
- migration camp / selected source scenes；
- Lake Texcoco / Tenochtitlan foundation；
- Sacred Precinct；
- Templo Mayor dual temple；
- Ehecatl-Quetzalcoatl circular temple，若进入 P0。

### Ritual

- New Fire hill / ceremony scene，按 source review；
- rain-festival ritual space；
- Xipe Totec renewal ritual scene，非 graphic。

## 10.3 Tenochtitlan / Templo Mayor 不强行作为 mythic World

它们首先是历史城市 / sacred architecture。

当前 Domain 没有独立 `HistoricalPlace`，P0 优先：

```text
Scene
+ ContentClaim
+ Story linkage
```

不要为了当前只有 World / Scene 就把整个 Tenochtitlan 变成“神域”。

## 10.4 不硬编码统一宇宙楼层图

P0 禁止：

```text
13 heavens = exactly one universal Aztec cosmology
9 underworld levels = exact universal map
Tlalocan / Mictlan / solar afterlife = one simple good-vs-bad heaven/hell system
```

具体内容必须 source-scoped。

---

# 11. Canonical Design & Civilization Visual DNA

## 11.1 Aztec / Mexica Visual DNA

入口级 Visual DNA 建议深化为：

### Palette

- volcanic / basalt black；
- tezontle red；
- turquoise blue-green；
- feather green；
- solar / ritual gold；
- lake blue / highland sky，按 Scene 使用。

### Materials

- basalt / volcanic stone；
- tezontle；
- obsidian；
- turquoise mosaic；
- shell；
- featherwork；
- paper / textile ritual materials；
- wood；
- gold only where source / elite context supports。

### Motifs

- feathered serpent；
- smoking obsidian mirror；
- hummingbird / eagle / jaguar；
- Xiuhcoatl；
- rain-goggle / fang iconography；
- turquoise fire-serpent motifs；
- twin sanctuary / stepped sacred architecture；
- codex profile / flat-color visual grammar as one style reference，不能成为所有画风强制形式。

### Environment

- Basin of Mexico / highland light；
- Lake Texcoco；
- causeways / chinampas；
- volcanic horizon；
- urban Tenochtitlan sacred precinct。

这与 Maya 默认雨林 / 石灰岩神庙视觉必须明显区分。

## 11.2 Critical Visual Contamination

以下属于 P0 blocker：

```text
Maya stepped jungle pyramid used as Templo Mayor
Maya glyph blocks used as Nahua writing
Quetzalcoatl rendered as Chinese dragon
Quetzalcoatl rendered as European winged dragon
Tlaloc rendered as Chaac-like long-nosed Maya deity
Mictecacihuatl rendered as modern Catrina
Mictlantecuhtli rendered as hooded European Grim Reaper
Xipe Totec rendered as graphic body horror
random skull/tattoo/tribal costume replacing documented Mexica regalia
Spanish-colonial costume in pre-contact canonical portraits
modern Mexican flag symbolism inserted as default pre-contact iconography
```

## 11.3 Existing 12 Canonical Design Audit

P0 对 0027 migration 中每位角色检查：

```text
anchors have sources
mythologicalFacts are supportable
avoid list covers major cross-culture confusion
canonicalPrompt preserves identity
age / gender / body representation does not overstate contested evidence
violent iconography is non-graphic by default
```

若事实层需要修正，用新的 migration / structured content update，不重写 migration history。

## 11.4 New Character Canonical Design Gate

新增 P0 Character 必须先完成：

1. identity source pack；
2. stable anchors；
3. non-negotiable silhouette；
4. costume / material evidence；
5. disputed iconography notes；
6. cross-culture avoid list；
7. canonicalPrompt；
8. mobile / desktop safe composition considerations。

之后才能进入正式 production art。

---

# 12. Artwork / Visual Production Policy

## 12.1 P0 最低视觉

P0 允许：

- symbol fallback；
- provenance-clear placeholder；
- limited approved source-grounded prototype art；
- core mythology hero placeholder until P1。

不能：

- 盗用博物馆图片；
- 无 license 外链热链；
- 把 archaeological photo 当默认 AI portrait；
- 视觉错误却因为“好看”批准上线。

## 12.2 P1 Character Production Tier

### Tier S 建议

- Quetzalcoatl；
- Huitzilopochtli；
- Tezcatlipoca；
- Tlaloc；
- Coatlicue；
- Mictlantecuhtli；
- Tonatiuh；
- Coyolxauhqui。

### Tier A 建议

- Xipe Totec；
- Mictecacihuatl；
- Xiuhtecuhtli；
- Xochipilli；
- Nanahuatzin；
- Tecuciztecatl；
- Tlaltecuhtli / Chalchiuhtlicue 等 P0 dependency characters。

最终 Tier 依据页面热度 / Narrative centrality 调整。

## 12.3 OutputSpec

继续遵守项目规范：

```text
desktop-wallpaper = 2560 x 1440
mobile-wallpaper = 1440 x 2560
```

PC / Mobile 必须独立构图，不能一张图裁两版。

## 12.4 Story Illustration

Story art 应优先表现：

- mythic event；
- environment；
- sacred architecture；
- symbolic ritual moment；

而不是每篇都变成角色站姿海报。

## 12.5 Sensitive Ritual Visual Rule

对于：

```text
human sacrifice
flaying symbolism
dismemberment
skull racks
blood offerings
```

默认 production direction：

```text
archaeological / symbolic / ceremonial / non-graphic
```

只有明确的历史教育场景需要时才展示更直接信息，也不得把血腥度作为审美卖点。

---

# 13. Structured Content Package

目标结构对齐 Greek / Norse：

```text
src/content/aztec/
  index.md
  index.ts
  catalog.ts
  stories.ts
  assets.ts
  visual-tiers.ts
  sources.ts          # source registry / sourceRef helpers
```

不创建 Aztec-only importer。

## 13.1 `catalog.ts`

承载：

- aztecCharacters；
- aztecWorlds；
- aztecScenes；
- ContentConcept / claims 如现有 registry pattern支持；
- stable ids。

## 13.2 `stories.ts`

每个 Story 必须包含：

```text
tradition
sources
sourceNotes
requiredCharacterIds
requiredWorldIds
requiredSceneIds
requiredSourceIds
claims
characterIds
worldIds
sceneIds
publishStatus
```

## 13.3 `assets.ts`

只登记：

- 已批准 production / prototype asset；
- 正确尺寸；
- alt；
- provenance 对应资产。

不让 content module 直接散落不可追踪图片 URL。

## 13.4 `visual-tiers.ts`

只管视觉生产优先级，不承担角色 canonicality。

避免：

```text
Tier S == 历史上“最高神”
```

Tier 表示 MythCanvas production priority。

---

# 14. 静态公共运行时与可选 D1 镜像兼容性

## 14.1 Static public catalog

`src/content/aztec/*` 必须在无 D1 的本地 / build / Worker 预览场景可读取，并经 `PublicContentCatalog` 被公共产品消费。

至少支持：

- Mythology page；
- Story list / detail；
- Character dependency；
- World / Scene；
- relation SSR fallback。

## 14.2 Optional D1 mirror sync

使用通用：

```text
scripts/sync-structured-content.mjs
```

或其后续 Generic 同步入口。

禁止：

```text
scripts/sync-aztec-only.mjs
```

除非明确证明通用同步无法扩展且经架构 Review。

## 14.3 Migration Policy

现有：

```text
0019_popular_mythology_characters.sql
0027_aztec_character_canonical_designs.sql
```

不可回改历史 migration。

新增 D1 内容使用新的 migration number / generic sync。

## 14.4 Public Runtime Parity Matrix

P0 逐项验证静态公共运行时；D1 apply 不再是发布前置条件：

| Capability | Static catalog / Worker runtime |
|---|---:|
| Mythology overview | ✅ |
| Character detail | ✅ |
| Character relations SSR | ✅ |
| Graph API | ✅ |
| Story list / detail | ✅ |
| World / Scene linkage | ✅ |
| Search | ✅ |
| Sitemap | ✅ |
| Source / claim display | ✅ |

静态公共运行时任一项缺失都不算 P0 完成。若执行 D1 镜像审计，另加 SQL dry-run、schema compatibility 和可选 local idempotency 检查；不得把 remote apply 写进默认发布流程。

---

# 15. Source / Claim UI Requirements

Aztec 比 Greek 更需要在用户侧看见“版本来自哪里”。

P0 不要求做复杂学术数据库 UI，但至少：

## 15.1 Story Detail

显示：

```text
主要来源
tradition
period
translation / edition when available
版本差异说明
editorial synthesis label
```

## 15.2 Character Detail

显示：

```text
稳定身份
常见名称 / alias
source period
tradition tags
核心神话关系
身份争议 / alternate interpretation
```

## 15.3 Contested Claim

不能隐藏成普通正文事实。

UI 至少有文本语义：

```text
存在不同传统 / 版本
学术对应仍有争议
MythCanvas 采用某一版本作为阅读主线
```

不要求堆满 warning badge。

---

# 16. Validation & CI

## 16.1 新增测试

建议：

```text
tests/aztec-content.test.ts
```

覆盖：

### Story closure

- 所有 requiredCharacterIds 存在；
- requiredWorldIds 存在；
- requiredSceneIds 存在；
- requiredSourceIds 可解析；
- published Story 至少一个 primary / near-primary source；
- tradition 非空。

### Character closure

- 所有 P0 characters 有 source refs；
- 所有 P0 characters 有 Canonical Design；
- 现有 12 个 stable id 未漂移；
- alias 不生成 duplicate Character。

### Relation closure

- target 有效；
- relation sourceRefs 非空；
- duplicate `assertionKey + traditionScope` = 0；
- inverse duplicate = 0；
- contested identity 不误设 default。

### Visual validation

可以对 metadata / prompt guardrail 做静态检查：

- Tlaloc avoid 包含 Maya / Chaac confusion；
- Quetzalcoatl avoid 包含 East Asian / European dragon；
- Mictecacihuatl avoid 包含 Catrina；
- Xipe Totec / Mictlantecuhtli 默认 avoid gore；
- production asset provenance 非空。

## 16.2 通用 validator

优先扩：

```text
structured-content-validation
story-validation
character graph validation
```

不要复制一份只有 Aztec 使用的 validator。

## 16.3 CI Gate

P0 merge 前：

```text
npm test
npm run build
structured content validation
D1 migration compatibility
sitemap test
Aztec content tests
provenance report
```

如果 CI 当前没有某条命令，按现有 package script 实际能力落地，不在文档里制造不存在的 command。

---

# 17. SEO / Search / Alias

## 17.1 核心关键词入口

用户常见搜索：

```text
Aztec mythology
Mexica mythology
Quetzalcoatl
Huitzilopochtli
Tezcatlipoca
Tlaloc
Five Suns
Mictlan
Aztec creation myth
Aztec gods
阿兹特克神话
羽蛇神
五太阳
```

页面可以命中这些词，但正文必须保持 scope 精确。

## 17.2 Search alias

Search 需要能找到：

- 英文常用拼写；
- 中文常用音译；
- source-reviewed Nahuatl spellings；
- legacy spellings。

Alias 进入 CharacterName / search index，不创建 duplicate Character。

## 17.3 `Aztec` 与 `Mexica`

建议 SEO 文案模式：

> 阿兹特克神话（本页核心材料主要聚焦 Mexica / 中央墨西哥 Nahua 传统）

而不是把用户入口名改成学术门槛很高的单一术语。

## 17.4 Sitemap

P0 所有：

- published Story；
- P0 Character；
- P0 World；

必须进入 sitemap，并通过 existing page SEO policy。

---

# 18. 实施阶段

## Phase 0 — Source & Identity Manifest

产出：

```text
Aztec source registry
tradition vocabulary
period vocabulary
existing 12 character source audit
identity-gate decisions
Story dependency manifest
name / alias manifest
```

优先解决：

- Quetzalcoatl / Topiltzin；
- Ehecatl form；
- Tonatiuh / Nanahuatzin；
- Coyolxauhqui lunar claim；
- Ometeotl controversy；
- Tlaltecuhtli representation；
- Mictecacihuatl / Catrina separation。

**Phase 0 不完成，不开始大规模加 Character。**

## Phase 1 — Structured Content Skeleton

创建：

```text
src/content/aztec/
```

完成：

- index；
- catalog skeleton；
- stories skeleton；
- source refs；
- registry integration；
- static public catalog consumption。

## Phase 2 — Cosmic Narrative Closure

完成 Volume A：

- suns / world-age source-aware framework；
- Teotihuacan sun birth；
- Nanahuatzin / Tecuciztecatl；
- Quetzalcoatl in Mictlan；
- present humanity creation。

并补齐 required Character / World / Scene / Relation。

## Phase 3 — Coatepec / Mexica Patron Closure

完成：

- Coatlicue；
- Coyolxauhqui；
- Centzon Huitznahua；
- Huitzilopochtli birth；
- Xiuhcoatl；
- Coatepec Scene；
- Templo Mayor archaeological / ritual bridge。

## Phase 4 — Migration / Tenochtitlan Closure

完成：

- Aztlan migration tradition；
- patron-god role；
- Tenochtitlan foundation；
- Sacred Precinct / Templo Mayor Scene；
- source-scoped myth-history notes。

## Phase 5 — Sacred Realms / Ritual Order

完成：

- Mictlan；
- Tlalocan；
- fire / New Fire；
- rain / renewal minimal bridge；
- selected ritual Story / claims。

## Phase 6 — Public Runtime / Graph / Search / Sitemap Parity

完成：

```text
static catalog / Worker runtime
SSR relation
Graph API
search
sitemap
validator
```

三端语义一致。

## Phase 7 — P0 QA

执行：

- source audit；
- dependency audit；
- identity audit；
- visual contamination audit；
- provenance audit；
- CI / build；
- page walkthrough。

## Phase 8 — P1 Visual Production

按 Tier 逐批：

```text
Canonical portrait
→ desktop wallpaper
→ mobile wallpaper
→ World / Scene hero
→ Story illustrations
```

每批先做 identity QA，再扩数量。

---

# 19. P0 验收 Checklist

## Scope / Sources

- [ ] `aztec` 产品入口保持稳定；
- [ ] Mexica / Nahua / Central Mexican scope 已定义；
- [ ] 每个 P0 Story 有 tradition；
- [ ] 每个 P0 Story 有可定位 primary / near-primary source；
- [ ] 每个 P0 core relation 有 sourceRefs；
- [ ] 现有 12 Character 完成 source audit；
- [ ] Five Suns 不伪装成单一无争议版本；
- [ ] Borgia Group 未默认标成 Mexica 专属；
- [ ] colonial witness 与 pre-contact / indigenous claim 有区分。

## Story

- [ ] Cosmic cycle coverage = 100%；
- [ ] Teotihuacan sun creation closure = 100%；
- [ ] Quetzalcoatl / Mictlan humanity creation closure = 100%；
- [ ] Coatepec / Huitzilopochtli closure = 100%；
- [ ] migration / Tenochtitlan bridge 完成；
- [ ] sacred realm bridge 完成；
- [ ] ritual-order minimum bridge 完成；
- [ ] Story 数量由 Quality Gate 决定，无凑数拆页。

## Identity

- [ ] Quetzalcoatl deity / Topiltzin identity 未强合并；
- [ ] Ehecatl form 经过 Identity Gate；
- [ ] Tonatiuh / Nanahuatzin relation source-scoped；
- [ ] Ometeotl 争议未写成唯一 canonical theology；
- [ ] Coyolxauhqui lunar claim source level 明确；
- [ ] Tlaltecuhtli representation source-reviewed；
- [ ] Mictecacihuatl 未 Catrina 化；
- [ ] duplicate Character from spelling variation = 0。

## Character / Relation

- [ ] P0 requiredCharacterIds closure = 100%；
- [ ] Canonical Design coverage = 100%；
- [ ] relation target valid = 100%；
- [ ] duplicate canonical relation = 0；
- [ ] inverse duplicate = 0；
- [ ] contested relation 不误设 default；
- [ ] collective 没有被无意义拆成大量角色。

## World / Scene

- [ ] Mictlan closure；
- [ ] Tlalocan gate 完成；
- [ ] Coatepec Scene；
- [ ] Teotihuacan creation Scene；
- [ ] Tenochtitlan Sacred Precinct / Templo Mayor Scene；
- [ ] 13 heavens / 9 underworld 未无来源硬编码；
- [ ] HistoricalPlace 未被强行伪装成 mythic World。

## Visual

- [ ] Maya / Aztec contamination = 0；
- [ ] generic tribal shorthand = 0；
- [ ] modern Catrina conflation = 0；
- [ ] fake readable glyph text = 0；
- [ ] graphic gore default art = 0；
- [ ] existing 12 canonical prompts source-audited；
- [ ] production assets provenance complete。

## Engineering

- [ ] `src/content/aztec/*` 完成；
- [ ] registry integration；
- [ ] static public catalog；
- [ ] D1 mirror dry-run SQL compatibility；
- [ ] （可选）local D1 mirror idempotency；
- [ ] Character Detail SSR；
- [ ] Graph API；
- [ ] Search；
- [ ] Sitemap；
- [ ] Validators；
- [ ] `tests/aztec-content.test.ts`；
- [ ] build / tests pass；
- [ ] provenance audit pass。

---

# 20. 明确不做

P0 不做：

- “阿兹特克全部神明大全”；
- 固定 12 / 20 / 50 主神排行榜；
- 无来源的 13 天界 + 9 冥界游戏地图；
- 把 Borgia Group 全部标成 Mexica；
- 把 Maya Kukulkan 当 Quetzalcoatl alias；
- 把 Topiltzin Quetzalcoatl 直接覆盖进羽蛇神 Character；
- 把 Ometeotl 当无争议唯一至高神；
- 把 Día de Muertos / Catrina 当 pre-contact canonical art；
- 以人祭 / 骷髅 / 血腥作为文明视觉主题；
- 伪造可读 glyph / Nahuatl 文本；
- Aztec-only schema；
- Aztec-only importer；
- 为凑 KPI 拆 Story；
- 为凑角色数创建无独立价值的神名页面。

---

# 21. 推荐执行顺序

最终推荐顺序：

```text
1. Source Manifest
2. Existing 12 Character Source Audit
3. Identity Gates
4. Narrative Dependency Manifest
5. src/content/aztec skeleton
6. Cosmic / Five Suns source-aware closure
7. Teotihuacan Sun Creation closure
8. Quetzalcoatl / Mictlan Humanity Creation closure
9. Coatepec / Huitzilopochtli closure
10. Migration / Tenochtitlan bridge
11. Mictlan / Tlalocan / Ritual bridge
12. Character dependency expansion
13. Canonical Relation Graph
14. World / Scene closure
15. static public runtime / Graph / Search / Sitemap parity
16. Validation / CI / provenance
17. P0 release
18. P1 character / realm visual production
```

核心判断标准不是“数据库里有多少神”，而是：

> **用户能否从一个可验证的来源出发，连续理解阿兹特克 / Mexica 神话的宇宙循环、太阳、人类创造、Coatepec、迁徙、神圣城市、死亡与仪式秩序，并且每个关键角色、地点、关系和视觉都能追溯其 tradition 与 evidence。**

做到这一点，MythCanvas 的 Aztec 才算从“有入口、有 12 个角色”升级为真正可持续扩展的神话内容宇宙。
