# MythCanvas 美索不达米亚神话完整补全方案

> 状态：V1.1 Review Proposal  
> 版本：V1.1  
> 日期：2026-09-02  
> 适用范围：美索不达米亚神话内容建模、Sumerian / Akkadian / Babylonian / Assyrian 传统分层、Story、Character、Relation / Graph、World / Scene、来源体系、视觉资产、结构化内容流水线与后续 AI 出图。  
> 相关文档：`docs/GREEK_MYTHOLOGY_COMPLETION_PLAN.md`、`docs/NORSE_MYTHOLOGY_COMPLETION_PLAN.md`、`docs/NORSE_CHARACTER_DETAIL_GRAPH_INTEGRATION_PLAN.md`、`docs/JAPANESE_MYTHOLOGY_COMPLETION_PLAN.md`、`docs/EGYPTIAN_MYTHOLOGY_COMPLETION_PLAN.md`、`docs/MAYA_MYTHOLOGY_COMPLETION_PLAN.md`、`docs/CONTENT_POSITIONING.md`、`docs/CHARACTER_ART_SYSTEM.md`、`.agents/skills/mythcanvas-content-model/SKILL.md`

---

# 0. V1.1 Review 结论

V1.0 的核心方向正确，而且对 Mesopotamian 特有风险处理得比传统“神话百科式补全”更合理：

- 不建立跨三千年的虚构统一神系；
- Story First + Tradition First；
- Inanna / Ishtar、Enki / Ea 等稳定双语身份通过 Identity Gate 归一；
- Ninurta / Ningirsu、Nergal / Erra、Marduk / Ashur 等不因后期合流强制 `same-as`；
- Ziusudra / Atrahasis / Utnapishtim 分实体；
- Anunnaki / Igigi 不固定成员名单；
- World 少、Scene / Sacred Place 多；
- Apsu 神格与 Abzu 宇宙空间分离；
- Visual DNA 按时期 / 地区分层；
- 不新增 Mesopotamian-only importer / schema。

这些原则全部保留。

但对照当前 `main` 已实际落地的 Japanese / Egyptian / Maya structured publishing，以及最新 Celtic / Aztec 计划后，V1.0 仍有 **12 个需要修正的执行问题**。

## 0.1 V1.1 十二项修正

### 1. Generic Structured Pipeline 已落地，不再作为待建设前置项

当前主干已经具备：

```text
Greek
Norse
Maya
Japanese
Egyptian
```

五套 structured bundle，并已有：

- `src/content/registry.ts`；
- generic structured validator；
- generic D1 sync；
- static fallback / repository merge；
- Story route / sitemap；
- Character Detail；
- CharacterName / CharacterInterpretation / ContentClaim；
- Graph API；
- provenance / artwork coverage 基础能力。

`sync-structured-content.mjs` 已自动发现：

```text
src/content/<slug>/catalog.ts
src/content/<slug>/stories.ts
```

并可选读取：

```text
identities.ts
```

因此 V1.0 的：

```text
Phase 1 — Generic Infrastructure Parity
```

改为：

> **Structured Bundle Integration + Regression Review**。

本轮只补当前真实缺口，不重复建设 registry / sync / fallback。

### 2. 目录必须对齐当前 Maya 实际结构：补 `sources.ts` + `identities.ts`

V1.0 目标目录过旧：

```text
catalog.ts
stories.ts
assets.ts
visual-tiers.ts
index.md
```

V1.1 改为：

```text
src/content/mesopotamian/
├── catalog.ts
├── sources.ts
├── identities.ts
├── stories.ts
├── assets.ts
├── visual-tiers.ts
├── index.ts
└── index.md
```

其中：

- `sources.ts` 管理 stable source IDs、edition / language / period / helper；
- `identities.ts` 管理 CharacterName / CharacterInterpretation / ContentClaim；
- `catalog.ts` 管稳定 Character / Relation / Concept / Taxonomy / World / Scene；
- 不把所有来源和身份争议继续塞进一个超大 `catalog.ts`。

Mesopotamian 比 Maya 更需要这两层，因为语言对应、地方 manifestation、神格合流和文本版本数量都更多。

### 3. RelationType 必须服从当前 D1 + `relation-semantics.ts`

V1.0 曾建议：

```text
literary-correspondence
kills
appoints
protects
supplants-in-tradition
```

但当前共享 `SUPPORTED_RELATION_TYPES` 并不支持这些字符串，直接实现会被 validator / D1 CHECK 拒绝。

V1.1 规则：

优先复用已支持：

```text
parent
consort
sibling
ally
rival
enemy
serves
rules-over
syncretized-with
associated-with
created
transformed-into
narrative
punishes
orders-creation
defeats
exchanges-with
opposes
captures
aids
rides
companion
encounters
resists
departs-from
```

若确有不可替代的新通用语义：

```text
Generic Relation Semantics Proposal
→ relation-semantics.ts
→ D1 relation_type constraint / migration
→ Graph label / category
→ validator
→ tests
→ content data
```

禁止在 Mesopotamian data 中先写一个未知 relation string 再期待运行时兜底。

### 4. 跨文本“对应”默认进入 ContentClaim，不进入人物 Graph

V1.0 对：

```text
Ziusudra
Atrahasis
Utnapishtim
```

提出 `literary-correspondence` Relation。

V1.1 修正为：

```text
Separate Character
+ source-scoped ContentClaim
```

原因：

- 这是现代编辑 / 文献比较关系，不是故事人物之间发生过的关系；
- Graph 应优先表达 ancient narrative / genealogy / cultic identity relation；
- 否则用户会把“文本比较”误读成“人物认识彼此 / 同一神谱”。

只有 ancient source 本身明确建立的身份合流或神学对应，才考虑：

```text
syncretized-with
associated-with
```

并必须挂 sourceRefs。

### 5. 新增 Textual Witness Policy：作品传统 ≠ 现存泥板年代

Mesopotamian 最大的来源风险之一，是把：

```text
composition / narrative tradition age
```

和：

```text
surviving tablet / manuscript witness period
```

混成一个时间。

V1.1 强制约定：

```text
MythStory.tradition
→ textual lane / recension / tradition

SourceRef.period / MythStorySource.period
→ 当前实际引用 witness / corpus / edition 所属时期

locator
→ tablet / column / line / composition section

note
→ 更早传统、后期抄本、重构关系等说明
```

例如：

```text
Standard Babylonian Gilgamesh
```

不能因为某一 Neo-Assyrian library witness 就写成“这个故事诞生于 Neo-Assyrian 时代”；同样也不能因为人物源自更早材料，就把后期标准版细节回投到早期 Sumerian poems。

### 6. 核心 CharacterName / transliteration 从 P1 提升到 P0

对于普通文明，alias search 可以晚一点；但 Mesopotamian 的身份本身依赖语言和拼写：

```text
Inanna / Ištar / Ishtar
Enki / Ea
Utu / Šamaš / Shamash
Nanna / Suen / Sîn / Sin
Iškur / Adad
Aššur / Ashur
Ereškigal / Ereshkigal
```

因此 P0 必须完成核心 CharacterName closure：

```text
primary display name
Sumerian name
Akkadian name
scholarly Unicode transliteration
ASCII common spelling
common Chinese translation
sourceRefs
```

P1 再做：

- 更长尾 transliteration；
- fuzzy / phonetic search；
- SEO landing 深化。

### 7. Claim / Interpretation 进入核心后，generic validator 需要补强

当前 generic validator 已验证：

- CharacterName endpoint + source locator；
- Relation endpoint / type / source locator；
- Story dependency；
- Character stable type；
- taxonomy；
- World / Scene semantics。

但当前仍应补两个共性门禁：

```text
ContentClaim.subjectId 必须 resolve 到对应 subjectType
CharacterInterpretation.sourceRefs 必须具有 locator / section
```

Mesopotamian 会大量使用 Claim / Interpretation，如果不补这两项，只是把错误从 Relation 搬到了 Claim。

这应修改 generic validator，不创建：

```text
mesopotamian-claim-validator.ts
```

### 8. CharacterName 必须“用户可见”，不能只存在数据库和 JSON-LD

当前 Character Detail ViewModel 已能读取：

```text
names
interpretations
```

但现有页面主要在 `interpretations.length > 0` 时通过 Interpretation selector 展示 names；纯 bilingual identity 若没有 Interpretation，用户可能看不到 CharacterName 的完整语言 / 时期上下文。

Mesopotamian P0 必须增加一个 generic Name Visibility Gate：

```text
names.length > 0
→ Character Detail 有可见“名称与语言 / 时期”区块
```

不能出现：

```text
D1 有 Ea
Search 能搜 Ea
SEO alternateName 有 Ea
用户打开 Enki 页面却看不到 Ea 是什么
```

### 9. Mythology Page P0 用“卷 + tradition badge”先解决认知，不立即造文明专属时间线 UI

当前通用 `MythologyStoryReader` 已支持：

```text
Volume
Story.kind
Story.tradition
Story.sources[].tradition / period
```

因此 P0 直接按 source lane 组织 Volume：

```text
Sumerian Foundations
Inanna / Ishtar
Humanity & Flood
Gilgamesh
Babylon / Marduk
Underworld
Assyrian Bridge
```

并让每篇 Story 显式展示 tradition / source period。

P0 不新建 `MesopotamianTimeline.astro` 特例。

P1 再做 generic：

```text
Tradition filter
Period filter / timeline
Local cult filter
```

### 10. 增加 P0-A 纵向切片，先验证最复杂模型，再大规模录入

V1.0 直接从 Source Registry 进入完整 Sumerian lane，风险仍偏大。

V1.1 增加一个不代表最终内容量的 **P0-A Structural Vertical Slice**：

至少选取能覆盖不同难点的代表单元：

```text
Inanna's Descent
Atrahasis
Gilgamesh / Utnapishtim flood segment
Enuma Elish
Ashur / Assyrian local-cult bridge
```

这组数据必须验证：

```text
bilingual identity
CharacterName
Interpretation / Claim
source witness period
flood hero separation
Apsu Character vs Abzu World
supported relation types
Sumerian / Babylonian / Assyrian tradition scope
static / D1 / Character Detail / Graph
```

通过后再批量扩完整 lane，避免录入几十个实体后才发现 schema / UI 表达不够。

### 11. CI 接入点必须写死到当前真实脚本

V1.0 只写“CI 覆盖”，不够可执行。

当前 `package.json`：

```text
content:validate
```

显式列举每个文明测试文件。

因此 P0 必须明确：

```text
tests/mesopotamian-content.test.ts
```

并加入：

```text
npm run content:validate
```

同时确保：

```text
npm run content:import -- --mythology=mesopotamian
npm run content:import -- --mythology=all
```

均能 dry-run。

### 12. Search 验收按当前架构分层，不假装 static search 已完全等价

当前 D1 Character search 已能 join `character_names`，适合 Mesopotamian bilingual names。

P0 验收：

```text
Local D1 / production D1:
Ištar / Ishtar / 伊什塔尔
Ea / Enki / 恩基 / 埃阿
Shamash / Šamaš / 沙玛什
→ stable Character
```

Static fallback 的核心要求仍是：

```text
Character / Story / Relation / Name semantic data 可读
```

若未来要求无 DB 全站搜索也具备 alias parity，应作为 generic Search Fallback 能力补齐，不在 Mesopotamian data 内写特例。

---

# 1. 当前仓库基线与不可破坏约束

当前稳定入口：

```text
id = myth-mesopotamian
slug = mesopotamian
name = 美索不达米亚神话
nameEn = Mesopotamian Mythology
tagline = 众神与两河
```

入口 Visual DNA：

```text
palette: 泥砖赭 / 古金 / 釉砖蓝 / 河水青
motifs: 阶梯神塔 / 八芒星 / 楔形文字 / 狮子
materials: 泥砖 / 烧制砖 / 青金石 / 黄金
atmosphere: 古老 / 城市文明 / 星辰 / 庄严
```

当前还没有 Mesopotamian structured package，因此没有已公开的 Mesopotamian Character / Story / World structured URL 需要兼容。

## 1.1 Stable ID / URL Policy

必须保留：

```text
myth-mesopotamian
mesopotamian
```

新增实体：

```text
character-<stable-ascii-name>
world-<stable-ascii-name>
scene-<stable-ascii-name>
story-<stable-ascii-name>
concept-<stable-ascii-name>
```

通过 Identity Gate 的稳定 bilingual identity 可使用组合 slug：

```text
character-inanna-ishtar
character-enki-ea
character-utu-shamash
character-nanna-sin
```

发布后不因：

```text
Ištar / Ishtar
Šamaš / Shamash
Sîn / Sin
Aššur / Ashur
```

正字法偏好变化修改 URL。

## 1.2 当前通用能力

主干已经存在：

```text
src/content/registry.ts
src/lib/content/structured-content-validation.ts
src/lib/content/story-validation.ts
src/lib/content/relation-semantics.ts
scripts/sync-structured-content.mjs
```

以及：

- static structured repositories；
- local / remote D1 upsert；
- `ContentClaim`；
- `CharacterName`；
- `CharacterInterpretation`；
- `ContentConcept`；
- Story source display；
- Story tradition badge；
- Character Detail；
- Character Graph；
- Character alias D1 search。

因此本轮是 **内容包接入 + 少量通用门禁增强**，不是再造 content platform。

## 1.3 入口 Visual DNA 不等于 generation DNA

直接规模化现有入口视觉会产生：

- 每张都是蓝色 Ishtar Gate；
- 每个神都站在 ziggurat 前；
- 八芒星贴给所有神；
- 狮子成为所有神的共同坐骑；
- Sumerian / Old Babylonian / Neo-Assyrian / Neo-Babylonian 视觉互相覆盖；
- 楔形文字变成随机“发光魔法咒语”。

P0 必须拆：

```text
Mythology Base DNA
+ Period / Region DNA
+ Character Canonical Design
+ Scene
+ Style
+ OutputSpec
```

---

# 2. “完整”的定义

完整不等于：

- 收录所有 god list 神名；
- 做“美索不达米亚十二主神”；
- 固定七位 Anunnaki；
- 用 `Enuma Elish` 解释全部 Sumerian creation；
- 把 Marduk-centered theology 回填早期 Sumer；
- 把 Ashur-centered state theology 当全 Mesopotamia 永恒共识；
- 把所有 Sumerian / Old Babylonian / Standard Babylonian Gilgamesh 材料拼成一个“原始完整版”。

P0 用户侧完整定义：

> 用户能够理解“美索不达米亚神话”是多个城市、语言、时期与文本传统的产品聚合入口；可以从 Sumerian 神圣秩序、Inanna / Ishtar、Atrahasis / 人类与洪水、Gilgamesh、Babylon / Marduk、冥界与 Assyrian 后期神学连续浏览；同神异名、文本 witness、地方 manifestation、神格合流、洪水英雄和神权中心迁移都明确标注来源范围，不存在核心依赖悬空、跨文本强制合并或现代伪考古污染。

## 2.1 P0 Coverage Matrix

### A. Sumerian Foundation Lane

至少覆盖：

```text
An / Enlil / Enki sacred order
Nippur / Eridu / Uruk cult context
Enki and Ninhursaga / Dilmun
Enki and the World Order
Enlil and Ninlil
Inanna and Enki / me
Inanna's Descent
Dumuzi death / substitution
Ziusudra flood witness
Ninurta / heroic-order tradition
```

### B. Akkadian / Old Babylonian Bridge

至少覆盖：

```text
Atrahasis: divine labour + human creation + population + flood
Adapa
Etana
Anzu / Tablet of Destinies
Akkadian Descent of Ishtar as separate textual witness
Old Babylonian / Akkadian Gilgamesh evidence where useful
```

### C. Babylonian Narrative Lane

至少覆盖：

```text
Standard Babylonian Gilgamesh
Gilgamesh + Enkidu
Cedar Forest / Humbaba
Ishtar + Bull of Heaven
Enkidu's death
immortality quest
Utnapishtim flood account
return to Uruk

Enuma Elish
Apsu / Tiamat conflict
Marduk elevation
Tiamat battle
cosmic ordering
Babylon / Esagil theological context
```

### D. Underworld / Death Lane

至少覆盖：

```text
Inanna / Ishtar descent textual lanes
Ereshkigal
Nergal and Ereshkigal
Dumuzi / Tammuz
netherworld gate / dust / no-return imagery
```

### E. Assyrian Bridge

至少让用户理解：

```text
Ashur != Marduk
Assyrian theology can reuse / adapt inherited Mesopotamian language
Ishtar of Nineveh / Arbela requires local-cult scope
Nabu / Shamash / Sin / Adad continue in Assyrian religious life
Babylonian literary texts may survive in Assyrian scholarly collections
```

Assyrian P0 主要通过：

- Character / Interpretation；
- ContentClaim；
- source-scoped `religious-tradition`；
- Scene / Visual DNA；
- Graph relation where ancient relationship is real。

不为了数量强造 Assyrian Story。

## 2.2 P0 硬指标

```text
Core Narrative Coverage = 100%
P0 Story Entity Dependency Closure = 100%
P0 Required Narrative Relation Coverage = 100%
P0 Stable Identity Source Coverage = 100%
P0 Core Name / Alias Source Coverage = 100%
P0 Core Relation Source Coverage = 100%
P0 Story Primary/Core-source Coverage = 100%
P0 Tradition Scope Coverage = 100%
P0 Source Witness Period Coverage = 100%
P0 Canonical Design Coverage = 100%
P0 High-risk Identity Review = 100%
P0 Claim Subject Integrity = 100%
Static / Local D1 / Production D1 Entity Semantic Parity = 100%
Forced Historical Identity Merge = 0
Duplicate Canonical Relation = 0
Unsupported Relation Type = 0
Invalid Relation Target = 0
Orphan Entity / Claim Reference = 0
Modern Anunnaki Alien Contamination = 0
Critical Cross-civilization Visual Contamination = 0
Fake Readable Cuneiform Claim = 0
```

不设：

```text
Story >= 40
Character >= 60
Gods = 12 / 50 / 3600
World = 7
Relation >= 200
```

数量由 Narrative Unit Quality Gate + Dependency Closure 决定。

## 2.3 P1

- Tier S / A 正式视觉资产；
- Netherworld / Abzu / Uruk / Babylon / Assyrian 高质量空间视觉；
- 更多 Ninurta / Dumuzi / Nergal / Ishtar 文本支线；
- generic Mythology tradition / period filter；
- Graph period / local-cult filter；
- advanced transliteration / fuzzy search；
- SEO subtopic landing；
- provenance audit 清零。

## 2.4 P2

- Lagash / Girsu；
- Isin healing tradition；
- Kish / Zababa；
- Harran Sin tradition；
- Erra Epic；
- Lamashtu / Pazuzu / anti-demonic traditions；
- omen / divination / astrology knowledge layer；
- temple liturgy / lamentation corpora；
- Seleucid / Parthian learned tradition；
- Bible / Classical / modern comparative reception 独立层。

比较宗教学和现代 reception 不反写 ancient primary layer。

---

# 3. Tradition / Taxonomy

P0 建议少量稳定 editorial scope：

```text
meso-sumerian-literary
meso-sumerian-cultic
meso-akkadian-old-babylonian
meso-babylonian-standard
meso-babylonian-first-millennium
meso-assyrian
meso-uruk-local
meso-nippur-local
meso-eridu-local
meso-ur-local
meso-babylon-local
meso-nineveh-local
meso-arbela-local
```

规则：

- taxonomy / tradition 是 metadata，不是 CharacterRelation；
- 城市归属不生成“神 → Uruk”伪人物边；
- local cult 进入 tags / Interpretation / Claim / Scene linkage；
- Graph 只在 relation 本身有关系事实时显示边；
- 不把 modern Iraq / Syria 等现代国别标签反投射为 ancient tradition。

Mythology 页面 Volume 可以使用更友好的中文标题，但底层 story.tradition 使用稳定 scope。

---

# 4. Source Registry 与 Textual Witness Policy

建议新增：

```text
src/content/mesopotamian/sources.ts
```

模式对齐现有 Maya：

```ts
mesopotamianSources
sourceRef(key, locator, note?)
storySource(key, locator, note?)
```

每个 P0 source 至少：

```text
sourceId
title
type
storyType
tradition
period
language
edition / translation
url（有可靠数字版时）
note
```

## 4.1 Source ID Policy

source ID 必须稳定、可 diff，不用“source-1 / source-2”。

示例模式：

```text
source-meso-inanna-descent-<edition>
source-meso-sumerian-flood-<edition>
source-meso-atrahasis-<edition>
source-meso-adapa-<edition>
source-meso-etana-<edition>
source-meso-anzu-<edition>
source-meso-gilgamesh-standard-<edition>
source-meso-enuma-elish-<edition>
source-meso-nergal-ereshkigal-<edition>
source-meso-an-anum-<edition>
source-meso-assyrian-ishtar-<corpus>
```

`<edition>` 在实施 Research Manifest 阶段冻结，不能先写假 edition。

## 4.2 Sumerian Literary Sources

P0 优先：

- `Enki and Ninhursaga`；
- `Enki and the World Order`；
- `Inanna and Enki`；
- `Inanna's Descent to the Netherworld`；
- `Dumuzi's Dream`；
- `Enlil and Ninlil`；
- Sumerian Flood Story / Ziusudra；
- `Lugal-e` / Ninurta tradition；
- relevant Sumerian Gilgamesh poems。

正式引用必须落：

```text
composition
+ line / section
+ witness / edition context
```

不能只写：

```text
Sumerian literature
```

## 4.3 Akkadian / Babylonian Literary Sources

P0：

- `Atrahasis`；
- `Adapa`；
- `Etana`；
- `Anzu`；
- Akkadian `Descent of Ishtar`；
- `Nergal and Ereshkigal`；
- Standard Babylonian `Epic of Gilgamesh`；
- `Enuma Elish`。

必须尽量记录：

```text
work
+ recension
+ tablet
+ column / line
+ witness period
+ edition / translation
```

### Gilgamesh 特别规则

以下是三个不同 source lane：

```text
Sumerian Gilgamesh poems
Old Babylonian Gilgamesh fragments
Standard Babylonian Epic
```

产品可以有一个 Gilgamesh hub，但 claim / Story 不静默互补。

## 4.4 God Lists / Lexical / Ancient Scholarly Lists

例如：

```text
AN = Anum
lexical correspondences
learned theological lists
```

用途：

- name correspondence；
- genealogy variant；
- divine title；
- learned syncretism。

默认不生成 narrative Story。

## 4.5 Cult / Royal / Ritual Sources

包括：

- royal inscriptions；
- temple inscriptions；
- hymns / prayers；
- local cult records；
- oath / treaty invocation；
- kudurru divine-symbol evidence；
- ritual / exorcistic text when directly relevant。

重点支持：

```text
city patronage
political theology
local manifestation
symbol / iconography
royal legitimacy
```

Royal propaganda 不自动等于全 Mesopotamian 共识。

## 4.6 Archaeological / Iconographic Evidence

重要对象：

- cylinder seal；
- relief；
- statue；
- stela；
- glazed brick；
- kudurru；
- temple deposit；
- physical tablet。

规则：

> 一件文物能证明“某时期 / 地点出现过此表现”，不能证明“该神在全部时期永远如此”。

视觉 anchor 必须记录 object / collection / dating / identification scope。

## 4.7 Modern Academic Secondary

用于：

- philology；
- identity disputes；
- syncretism；
- local cult reconstruction；
- historical chronology；
- iconographic identification；
- fragment reconstruction。

现代结论进入：

```text
ContentClaim.status = supported | contested | editorial-synthesis
```

不伪装 ancient primary claim。

## 4.8 Composition vs Witness 强规则

Bad：

```text
period = Neo-Assyrian
summary = Gilgamesh epic was created in the Neo-Assyrian period
```

Preferred：

```text
tradition = standard-babylonian-gilgamesh
period = 当前引用 witness / corpus 年代
note = 此 witness 保存的是更早形成并持续流传的作品传统；具体成书历史按 edition 说明
```

如果 composition dating 本身有学术争议：

```text
ContentClaim(status = contested / editorial-synthesis)
```

而不是把一个日期写进实体 summary 当确定事实。

---

# 5. Identity Resolution Matrix

建议新增：

```text
src/content/mesopotamian/identities.ts
```

导出：

```ts
mesopotamianNames
mesopotamianInterpretations
mesopotamianClaims
```

## 5.1 Stable bilingual identity：默认 1 Character

### An / Anu

```text
character-an-anu
```

Names：An / Anu。

### Enki / Ea

```text
character-enki-ea
```

核心 freshwater / wisdom / ritual identity 可共享；不同文本功能变化进入 Interpretation / source-scope。

### Enlil / Ellil

```text
character-enlil
```

拼写 / language variant 不拆实体。

### Inanna / Ishtar

```text
character-inanna-ishtar
```

但必须进一步审核：

```text
Ishtar of Uruk
Ishtar of Nineveh
Ishtar of Arbela
```

决定是：

```text
CharacterInterpretation
or
independent Character
```

不能只当字符串 alias。

### Utu / Shamash

```text
character-utu-shamash
```

### Nanna / Suen / Sin

```text
character-nanna-sin
```

### Ishkur / Adad

```text
character-ishkur-adad
```

### Dumuzi / Tammuz

```text
character-dumuzi-tammuz
```

后期 reception 不反写早期 Sumerian Story。

## 5.2 Alias / title，不拆 Character

### Marduk / Bel

只有明确 source scope 指向 Marduk 的 `Bel` 才进入：

```text
CharacterName(kind = title)
```

通用 `bēlu = lord` 不自动 resolve 到 Marduk。

## 5.3 Separate Character + source-scoped syncretism / Claim

默认不合并：

```text
Ninurta != Ningirsu
Nergal != Erra
Marduk != Ashur
Marduk != Enlil
Nammu != Tiamat
```

若 ancient / scholarly evidence 足以表达神格合流：

```text
syncretized-with
```

否则优先：

```text
ContentClaim
```

而不是为了 Graph 强建关系。

## 5.4 Mother Goddess Cluster

高风险：

```text
Ninhursaga
Ninmah
Nintur / Nintud
Mami / Mammi
Belet-ili
Aruru
```

规则：

1. Story 需要哪个 source identity，就先建哪个；
2. ancient list / text 明确 name equivalence 才做 CharacterName；
3. source 支持神格合流才 `syncretized-with`；
4. 只是功能相似则 ContentClaim；
5. 不创建万能 `Mother Goddess` Character。

## 5.5 Tiamat / Nammu

必须分开。

Tiamat：`Enuma Elish` lane。

Nammu：Sumerian source-scoped identity。

视觉不能因为“原初海水”相似合并。

## 5.6 Apsu deity / Abzu World

必须：

```text
character-apsu-enuma-elish
world-abzu
```

不同 entity type + stable ID。

若需要解释联系，使用 Story / Claim，不建立 Character→World 的伪 CharacterRelation。

## 5.7 Flood Heroes

必须：

```text
character-ziusudra
character-atrahasis
character-utnapishtim
```

比较关系：

```text
ContentClaim
```

不是 alias，不是 Graph genealogy，不新增 `literary-correspondence` relation type。

## 5.8 Anunnaki / Igigi

默认：

```text
collective Character
or
ContentConcept
```

取决于 Story 是否真的需要作为人物集合被链接。

禁止：

- 固定“七位 Anunnaki”；
- 把不同文本成员名单合成唯一名单；
- ancient astronaut / alien interpretation 进入 ancient layer。

## 5.9 Ishtar != Ix Chel

P0 ancient graph 中完全分离。

禁止：

```text
same-as
influenced-by
linguistic-derivation
```

除非未来存在独立 comparative-research layer 且有可靠学术证据。

---

# 6. P0 Story Dependency Manifest

以下是 Narrative Unit 草案，**不是 Story URL 数量 KPI**。

每个单元发布前必须通过：

```text
能独立回答一个用户问题
+ 有独立来源价值
+ 与相邻单元不重复
+ required entities 可闭包
+ tradition / witness scope 清晰
```

## Volume 1 — Sumerian 神圣秩序

候选单元：

1. `Enki and Ninhursaga`：Dilmun、生命水与神圣生育；
2. `Enki and the World Order`：神圣职责 / 秩序分配；
3. `Enlil and Ninlil`：Nanna / Sin 谱系与 source-specific journey；
4. An / Enlil / Enki authority bridge：若不是独立 narrative，则 `religious-tradition` / Concept。

## Volume 2 — Inanna / Ishtar

5. `Inanna and Enki`：`me` 的转移；
6. `Inanna's Descent`：Ereshkigal、Ninshubur、七门、替代；
7. Dumuzi / `Dumuzi's Dream`：死亡、替代、哀歌解释来源化；
8. Akkadian `Descent of Ishtar`：作为独立 textual witness / comparison unit，不静默拼入 Sumerian Story。

## Volume 3 — 人类、洪水与神的边界

9. Ziusudra flood witness；
10. `Atrahasis`：神的劳役与人类创造；
11. `Atrahasis`：人口、灾难与洪水；能独立回答问题才拆；
12. `Adapa`：智慧与死亡边界；禁止 `Adapa = Adam`；
13. `Etana`：王权、鹰与继承人 quest。

## Volume 4 — Ninurta / Anzu

14. `Anzu` / Tablet of Destinies；
15. `Lugal-e` / Ninurta heroic-order tradition。

## Volume 5 — Gilgamesh

16. Gilgamesh 与 Enkidu 相遇；
17. Cedar Forest / Humbaba；
18. Ishtar 与 Bull of Heaven；
19. Enkidu 之死；
20. Gilgamesh 寻找 Utnapishtim；
21. Utnapishtim flood account；
22. 不死之草与重返 Uruk。

实现可以合并为 5–7 篇高质量 Story，不以 7 为 KPI。

必须明确：

```text
Standard Babylonian lane
```

与 Sumerian poems / Old Babylonian fragments 的差异。

## Volume 6 — Babylon / Marduk / Enuma Elish

23. Apsu / Tiamat 原初冲突；
24. Marduk 被推举为 champion；
25. Marduk 战胜 Tiamat；
26. Cosmic ordering / Marduk fifty names / Babylon theological elevation。

实现可合并 2–4 篇。

必须强调：

> `Enuma Elish` 是 Babylon-centered theological composition，不是全 Mesopotamian universal Genesis。

## Volume 7 — 冥界与死亡秩序

27. `Nergal and Ereshkigal`；
28. Mesopotamian Netherworld religious-tradition unit：术语、门、尘土、Ereshkigal / Namtar 等 source-aware 解释。

## Volume 8 — Assyrian Bridge

29. Ashur / Assyrian state theology；
30. Ishtar of Nineveh / Arbela local-cult identity bridge。

若 29 / 30 无法形成独立 reader question：

```text
CharacterInterpretation / ContentClaim
```

不为了 Coverage Matrix 强造 Story。

---

# 7. Character Dependency Closure

最终 Character 不锁数量，由 `requiredCharacterIds` 反推。

## 7.1 Core Deities

```text
An / Anu
Enlil
Ninlil
Enki / Ea
Inanna / Ishtar
Utu / Shamash
Nanna / Sin
Ishkur / Adad
Ereshkigal
Nergal
Ninurta
Dumuzi / Tammuz
Marduk
Nabu
Ashur
```

## 7.2 Primordial / Cosmic

```text
Nammu — dependency / source review
Ninhursaga / reviewed mother-goddess identity
Apsu — Enuma Elish Character
Tiamat
Kingu
Anunnaki / Anunna — collective or Concept
Igigi — collective or Concept
```

## 7.3 Hero / Mortal

```text
Gilgamesh
Enkidu
Ninsun
Utnapishtim
Ziusudra
Atrahasis
Adapa
Etana
Urshanabi — if required
Siduri — if required
```

## 7.4 Monster / Creature

```text
Humbaba
Bull of Heaven
Anzu
Asag — if Lugal-e P0
mušhuššu — Character-like creature only if product dependency requires
```

## 7.5 Supporting Deities

按 Story dependency：

```text
Ninshubur
Geshtinanna
Namtar
Aya
Shala
Sarpanitum
Nusku
```

## 7.6 Stable Character Type

只使用：

```text
deity
hero
mortal
monster
creature
collective
```

地方神、行星神、国家神等进入 taxonomy / claim，不扩文明专属 type。

## 7.7 每个 P0 Character 最低标准

```text
stable ID / slug
characterType
traditionTags
sourcePeriods
stable identity sourceRefs
canonicality
symbols
Canonical Design
CharacterName closure
core relations / claims
Story linkage
world / scene affinity where applicable
canonicalPrompt
```

按需：

```text
CharacterInterpretation
ContentClaim
CharacterVariant
ContentConcept
```

---

# 8. Relation / Graph Policy

## 8.1 Canonical storage

Parent：

```text
parent -> child
```

不写反向 `child`。

对称：

```text
consort
sibling
ally
rival
enemy
syncretized-with
associated-with
```

只存一条稳定 pair。

方向关系使用当前已支持 relation type，例如：

```text
created
defeats
aids
opposes
serves
rules-over
punishes
orders-creation
captures
encounters
resists
departs-from
```

## 8.2 不支持的 relation type 禁止进入数据

P0 不直接写：

```text
literary-correspondence
kills
appoints
protects
supplants-in-tradition
```

替代：

- literary comparison → ContentClaim；
- kills / defeats → 语义确为战胜时使用 `defeats`；
- protects → 角色领域 / Claim，除非 generic relation proposal；
- historical theological replacement → Claim；若未来确需 Graph 边，走 Generic Relation Proposal。

## 8.3 同神异名不是 Relation

Bad：

```text
Enki -> Ea : same-as
```

Preferred：

```text
1 Character
+ CharacterName
+ Interpretation when needed
```

## 8.4 City Patronage 默认不是 Relation

```text
Inanna — Uruk
Marduk — Babylon
Nanna — Ur
```

P0 进入：

```text
traditionTags
summary / Claim
Scene linkage
sourceRefs
```

当前没有 Generic Place node，不为画边把城市伪装成 Character / Concept。

## 8.5 Source conflict

不同来源互相冲突：

```text
relation A + traditionScope + sourceRefs
relation B + traditionScope + sourceRefs
```

不覆盖，不选“网上最常见版本”。

## 8.6 Graph 信息层级

P0 Graph 优先：

1. genealogy；
2. narrative conflict / aid；
3. authority；
4. ancient syncretism / identity relation。

现代编辑比较默认不进 Graph。

P1 再增加：

- period filter；
- local-cult filter；
- relation category filter。

---

# 9. World / Scene / Sacred Place

## 9.1 World 语义

World 只表达稳定 mythic realm / cosmic domain，不承担古城列表。

## 9.2 P0 World 候选

### Mesopotamian Netherworld

建议：

```text
world-mesopotamian-netherworld
name = 冥界
nameEn = Mesopotamian Netherworld
```

source-scoped terminology：

```text
Kur
Great Below
Irkalla
land of no return
```

不选某一个词当跨时期唯一正式地名。

### Abzu

若被 Enki / Eridu / descent rescue / freshwater cosmology 等多个 P0 unit 复用：

```text
world-abzu
```

语义：地下淡水宇宙域，不是普通海洋，不是 Atlantis。

## 9.3 Scene 优先

以下默认 Scene / visual place：

```text
Uruk
Nippur
Eridu
Ur
Babylon
Borsippa
Assur
Nineveh
Cedar Forest
Dilmun
```

历史城市作为 Scene 的含义是：

> 当前产品用 Scene 承载可复用视觉 / 叙事地点，不声称“历史城市 = mythic World”。

## 9.4 P0 Scene 候选

Sumerian：

```text
Uruk / Eanna context
Eridu / E-abzu
Nippur / Ekur
Ur / Nanna sanctuary
Dilmun sacred landscape
```

Gilgamesh：

```text
Uruk walls
Cedar Forest
Humbaba encounter
Bull of Heaven at Uruk
Mount Mashu
Siduri shore
Waters of Death
Utnapishtim remote dwelling
```

Babylon：

```text
Babylon sacred precinct
Esagil
Etemenanki
Akitu processional context
Tiamat battle scene
```

Underworld：

```text
seven gates
Ereshkigal throne hall
land of dust
Dumuzi seizure / descent
```

Assyrian：

```text
Assur sacred context
Nineveh Ishtar cult context
Arbela Ishtar cult context
Neo-Assyrian palace / relief visual domain
```

实体化标准：

> 被至少一个 P0 Story required，或具备跨 Story / Character 的高复用视觉价值。

---

# 10. Visual DNA V2

## 10.1 Mythology Base

```text
materials:
- sun-dried mudbrick
- baked brick
- bitumen
- reed
- gypsum / limestone
- copper / bronze
- lapis lazuli
- shell
- restrained gold accents

motifs:
- horned divine crown when supported
- cuneiform tablet / seal impression
- temple platform / ziggurat silhouette
- river / canal / reed / date palm
- astral symbol only when source-scoped

atmosphere:
- ancient urban sacredness
- riverine heat
- monumental ritual order
- celestial observation
```

## 10.2 Sumerian / Early Domain

```text
mudbrick ochre
gypsum white
lapis accent
copper / bronze
reed / canal landscape
temple platform / buttressed wall
```

避免：Neo-Babylonian gate / Neo-Assyrian palace language 回填。

## 10.3 Akkadian / Old Babylonian Domain

```text
clay tablet
bitumen
brick
bronze
cylinder-seal composition
sun / moon / storm symbol by character
scribal / ritual urban atmosphere
```

## 10.4 Neo-Assyrian Domain

```text
gypsum / alabaster pale stone
bronze
textile accents
monumental relief rhythm
winged disk when source-scoped
lamassu only guardian / palace context
```

禁止所有 deity 长翅膀、lamassu 当坐骑、royal costume 回填 Sumerian gods。

## 10.5 Neo-Babylonian Domain

```text
glazed brick blue
gold accents
brick red
Ishtar Gate / Processional Way context
mušhuššu
lion
Marduk spade / Nabu wedge when source-scoped
```

不能成为全 Mesopotamian 唯一皮肤。

## 10.6 Character anchor 示例

Inanna / Ishtar：

```text
Venus / eight-pointed star
lion
martial aspect
rosette
```

但按时期 / source scope 使用。

Shamash：

```text
sun disk
rays
rod / ring only supported contexts
horizon emergence iconography where sourced
```

Sin：crescent moon。

Marduk：spade / mušhuššu / Babylonian sacred context。

Nabu：writing / stylus / tablet；Mercury association 只在合适 learned context。

## 10.7 Cuneiform QA

默认：

- decorative cuneiform-like marks 不宣称可读；
- 真正 inscription 必须逐字核对 source text；
- 不让 image model 自造“古巴比伦咒语”；
- alt / caption 不声称不存在的文字内容。

## 10.8 Cross-civilization contamination blacklist

```text
Egyptian pyramid / ankh / pharaoh headdress
Achaemenid Persian motifs as generic Mesopotamia
Greek / Roman temple default
Maya / Aztec stepped-pyramid iconography
modern occult sigil
ancient astronaut / UFO Anunnaki
biblical angel wing convention
modern game / film franchise costume
```

---

# 11. Canonical Design Policy

只复用当前字段：

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

不新增：

```text
cityPatronage
planetAspect
cuneiformTitle
syncretismHistory
```

这些进入 Name / Interpretation / Claim / taxonomy / sources / relation。

## 11.1 Evidence 分层

每个核心角色生成前必须区分：

```text
A. textual fact
B. iconographic / object-grounded anchor
C. editorial synthesis
D. MythCanvas-owned original design choice
```

`canonicalPrompt` 可整合 B + D，但 D 不能回写 `mythologicalFacts`。

## 11.2 Tiamat

若古代 iconography 不足：

```text
mythologicalFacts:
- primordial sea deity in Enuma Elish
- opponent of Marduk

originalDesignChoices:
- MythCanvas selected aquatic / serpentine silhouette
```

禁止默认 western multi-headed dragon。

## 11.3 Inanna / Ishtar

不能只做：

```text
love goddess
```

Canonical Design 应兼容：

```text
sexual love
warfare
Venus
royal / divine power
```

但具体表达按 Interpretation / source scope，避免单一“性感女神”模板。

---

# 12. Structured Content Package

## 12.1 目录

```text
src/content/mesopotamian/
├── catalog.ts
├── sources.ts
├── identities.ts
├── stories.ts
├── assets.ts
├── visual-tiers.ts
├── index.ts
└── index.md
```

### catalog.ts

```text
mesopotamianCharacters
mesopotamianRelations
mesopotamianConcepts
mesopotamianTaxonomy
mesopotamianWorlds
mesopotamianScenes
```

### sources.ts

```text
mesopotamianSources
sourceRef()
storySource()
```

### identities.ts

```text
mesopotamianNames
mesopotamianInterpretations
mesopotamianClaims
```

### stories.ts

```text
mesopotamianStories
Story body
sources
tradition
requiredCharacterIds
requiredWorldIds
requiredSceneIds
requiredSourceIds
claims when story-local
```

### assets.ts / visual-tiers.ts

负责 provenance / production priority，不混来源学术逻辑。

## 12.2 Registry

`src/content/registry.ts` 手工注册 Mesopotamian Bundle：

```text
characters
relations
concepts
claims
names
interpretations
taxonomy
worlds
scenes
stories
assetProvenance
visualTiers
```

注意：

> sync script 会自动发现 package，但 runtime `registry.ts` 当前仍是显式 import / registration；两者都要接入。

## 12.3 D1 Sync

当前 generic sync 已自动发现 package，不新增文明专属脚本。

必须验证：

```text
npm run content:import -- --mythology=mesopotamian
npm run content:import -- --mythology=mesopotamian -- --apply --local
npm run content:import -- --mythology=all
```

local apply 连续两次验证 idempotency。

## 12.4 Generic validator 增强

本轮若发现共性缺口，补：

```text
ContentClaim subject resolution
Interpretation source locator
```

不要新建 civilization-only validator。

---

# 13. Product / UI / Search

## 13.1 Mythology Page

P0 信息架构：

```text
美索不达米亚神话
├── Sumerian Foundations
├── Inanna / Ishtar
├── Humanity & Flood
├── Ninurta / Anzu
├── Gilgamesh
├── Babylon / Marduk
├── Underworld
└── Assyrian Bridge
```

这些首先复用现有 Story Volumes。

每篇 Story 必须显示：

```text
kind
tradition
source title
source period
source note
```

这样 P0 就能让用户感知“不是统一神话圣经”。

P1 再加 generic filter，不做 Mesopotamian-only tab component。

## 13.2 Character Detail

核心页面最低可见：

```text
Primary identity
Names / aliases by language / scope
Role / domains
Source periods
Interpretations / local manifestations
Relations
Stories
World / Scene context where applicable
Visual identity
Sources
```

### Inanna / Ishtar 用户必须能理解

```text
Inanna = Sumerian name / textual-cult context
Ishtar = Akkadian name / later broader context
local Ishtar manifestations may need separate scope
love / war / Venus are major dimensions, not a single flat label
```

### Name Visibility Gate

即使：

```text
interpretations.length = 0
```

只要：

```text
names.length > 0
```

页面也必须有可见 names block。

## 13.3 Graph

P0：

- source-scoped relations；
- non-default tradition scope queryable；
- supported semantic labels；
- relation source detail；
- HTML / SSR fallback；
- identity / narrative / genealogy 分类不混淆。

禁止：

```text
洪水英雄文献比较 = genealogy edge
functional similarity = syncretism edge
same name = same-as edge
```

## 13.4 Search

P0 D1 search：

```text
Inanna / Ištar / Ishtar / 伊什塔尔
Enki / Ea / 恩基 / 埃阿
Utu / Shamash / Šamaš / 沙玛什
Nanna / Sin / Sîn / 南纳 / 辛
```

都应解析到 stable Character。

P1：

- 更长尾 alias；
- fuzzy spelling；
- transliteration normalization；
- mythology-level Sumerian / Babylonian SEO subentry。

---

# 14. 视觉资产 Tier

P0：

```text
Every P0 Character has generation-grade Canonical Design
Every high-value World / Scene has identity-safe placeholder/prototype strategy
No misleading generic portrait presented as ancient canonical iconography
```

P0 不要求全员：

```text
Portrait + PC + Mobile
```

## Tier S 候选

```text
Inanna / Ishtar
Gilgamesh
Enkidu
Enki / Ea
Enlil
Marduk
Ereshkigal
Utu / Shamash
Nanna / Sin
Ninurta
Tiamat
Dumuzi / Tammuz
Ashur
Nergal
```

正式生产：

```text
Canonical Portrait
PC Wallpaper >= 1
Mobile Wallpaper >= 1
```

Tier S 是 production priority，不是 P0 Character count。

Tier A：核心 dependency，Portrait + PC/Mobile 至少一种。

Tier B：Canonical Design + reviewed symbol fallback，不阻塞 P0。

空间视觉 P1 优先：

```text
Mesopotamian Netherworld
Abzu
Uruk
Cedar Forest
Babylon sacred precinct
Sumerian temple-city
Neo-Assyrian sacred context
```

---

# 15. Implementation Phases

## Phase 0 — Research Manifest / Identity Freeze

- [ ] `sources.ts` source registry；
- [ ] tradition taxonomy；
- [ ] textual lane / witness policy；
- [ ] Identity Resolution Matrix；
- [ ] core CharacterName / transliteration table；
- [ ] high-risk Claim list；
- [ ] Story Dependency Manifest；
- [ ] relation types mapped to current supported semantics。

DoD：

```text
每个 P0 candidate 都能回答：
为什么需要？
来自哪个 textual/cult lane？
引用哪个 witness / locator？
是 Character / Name / Interpretation / Claim / Relation / Concept 中哪一种？
```

## Phase 1 — P0-A Structural Vertical Slice

先实现一条小而完整的跨传统切片，代表单元建议：

```text
Inanna's Descent
Atrahasis
Gilgamesh / Utnapishtim flood segment
Enuma Elish
Ashur / Assyrian local-cult bridge
```

至少覆盖：

```text
Inanna / Ishtar
Enki / Ea
Ereshkigal
Atrahasis
Utnapishtim
Gilgamesh
Marduk
Apsu
Tiamat
Ashur
local Ishtar identity case
Netherworld / Abzu semantics
```

同步建立：

```text
catalog.ts
sources.ts
identities.ts
stories.ts
assets.ts
visual-tiers.ts
index.ts / index.md
registry registration
tests/mesopotamian-content.test.ts
```

DoD：

```text
content:validate pass
content:import mesopotamian dry-run pass
local D1 apply twice pass
Character Detail names visible
Graph no unsupported relation
flood hero comparison stays Claim
Apsu Character / Abzu World separate
```

这不是“Mesopotamian P0 已完成”，只是先证明模型和产品链路正确。

## Phase 2 — Sumerian Foundation Closure

完成：

- An / Enlil / Enki / Nanna / Utu；
- Enki & Ninhursaga；
- Enki & World Order；
- Enlil & Ninlil；
- Inanna & Enki；
- Inanna descent / Dumuzi；
- Ziusudra；
- Ninurta source lane；
- Sumerian sacred scenes。

DoD：

```text
Sumerian P0 Narrative Coverage = 100%
Sumerian required dependency closure = 100%
```

## Phase 3 — Akkadian / Old Babylonian Bridge

完成：

- Atrahasis full unit；
- Adapa；
- Etana；
- Anzu；
- Akkadian Descent of Ishtar；
- bilingual name / terminology bridge。

## Phase 4 — Gilgamesh Closure

完成：

- Gilgamesh / Enkidu / Humbaba / Bull of Heaven / Utnapishtim；
- Story spine；
- Uruk / Cedar Forest / quest scenes；
- Standard Babylonian witness scope；
- Sumerian / OB / Standard Babylonian no silent merge。

## Phase 5 — Babylon / Marduk Closure

完成：

- Marduk；
- Tiamat；
- Apsu Character；
- Kingu；
- Nabu；
- Enuma Elish；
- Babylon sacred scenes；
- Neo-Babylonian Visual DNA。

## Phase 6 — Underworld / Assyrian Bridge

完成：

- Ereshkigal / Nergal；
- Nergal & Ereshkigal；
- Netherworld religious-tradition；
- Ashur；
- Nineveh / Arbela Ishtar identity review；
- Assyrian sources / visual domain。

## Phase 7 — Product / Runtime Closure

- [ ] Mythology page volumes / tradition badges；
- [ ] CharacterName visible block；
- [ ] Character Detail interpretations；
- [ ] Relations SSR；
- [ ] Graph source scope；
- [ ] D1 alias search；
- [ ] Story detail；
- [ ] sitemap；
- [ ] generic validator enhancements；
- [ ] `npm run content:validate`；
- [ ] `npm test`；
- [ ] `npm run check`；
- [ ] local D1 idempotent apply；
- [ ] production D1 sync；
- [ ] deployed smoke。

## Phase 8 — P1 Visual Production

按 Tier S / A / spatial priority 推进，不反向阻塞 P0 content closure。

---

# 16. Validation / Tests

新增：

```text
tests/mesopotamian-content.test.ts
```

并显式加入当前：

```text
package.json -> content:validate
```

## 16.1 Generic contract

必须验证：

```text
bundle registered
stable id / slug unique
Character stable type valid
all Character sourceRefs present
all P0 Story required IDs resolve
all World / Scene IDs resolve
all requiredSourceIds resolve
all Relation endpoints resolve
all Relation types supported
all core Relations have located sourceRefs
no child reverse genealogy storage
no duplicate assertionKey + traditionScope
no orphan Claim subject
all Interpretation sources located
```

## 16.2 Identity regression

```text
An / Anu => one Character
Enki / Ea => one Character
Inanna / Ishtar => one Character
Utu / Shamash => one Character
Nanna / Sin => one Character
Ishkur / Adad => one Character
Dumuzi / Tammuz => one Character

Ziusudra != Atrahasis != Utnapishtim
Tiamat != Nammu
Marduk != Ashur
Nergal != Erra by default
Ninurta != Ningirsu by default
Apsu Character ID != Abzu World ID
```

## 16.3 Forbidden merge / claim regression

```text
no fixed-seven Anunnaki claim
no Ishtar/Ix Chel identity edge
no Adapa/Adam same-as claim
no Enuma Elish as universal Sumerian creation claim
no local Ishtar manifestation silently overwriting base identity
```

## 16.4 Source / witness regression

```text
all P0 Story has tradition
all P0 Story has source period
all primary/core Story source has locator
Gilgamesh textual lane explicit
Sumerian / Akkadian descent lane explicit
composition age not inferred only from witness period
```

## 16.5 Relation regression

```text
unsupported RelationType = 0
literary-correspondence RelationType absent
flood-hero comparison stored as Claim
source-less core relation = 0
non-default scoped relation queryable
```

## 16.6 Visual regression

```text
no Egyptian pyramid / ankh contamination
no Mesoamerican pyramid contamination
no Achaemenid / Greek-Roman generic overwrite
no ancient-astronaut Anunnaki imagery
no universal Ishtar Gate background
no fake-readable cuneiform claim
no modern franchise copy
```

## 16.7 Runtime / D1

至少：

```text
npm run content:validate
npm run content:import -- --mythology=mesopotamian
npm run content:import -- --mythology=all
npm run content:import -- --mythology=mesopotamian -- --apply --local  # twice
npm test
npm run check
```

上线后：

```text
production sync
Character Detail smoke
Story route smoke
Graph API smoke
alias search smoke
sitemap smoke
```

---

# 17. P0 Definition of Done

## Content

- [ ] Sumerian Foundation closed；
- [ ] Akkadian / Old Babylonian Bridge closed；
- [ ] Gilgamesh narrative spine closed；
- [ ] Enuma Elish / Babylonian lane closed；
- [ ] Underworld lane closed；
- [ ] Assyrian minimum bridge closed；
- [ ] Core Narrative Coverage = 100%；
- [ ] Story Dependency Closure = 100%。

## Identity

- [ ] Stable bilingual identities resolved；
- [ ] Core CharacterName / transliteration source coverage = 100%；
- [ ] Flood heroes remain separate；
- [ ] Mother Goddess cluster reviewed；
- [ ] local Ishtar manifestations reviewed；
- [ ] Apsu Character / Abzu World separated；
- [ ] Forced Historical Identity Merge = 0。

## Source

- [ ] Story Primary/Core-source Coverage = 100%；
- [ ] Stable Identity Source Coverage = 100%；
- [ ] Core Relation Source Coverage = 100%；
- [ ] Source Witness Period Coverage = 100%；
- [ ] located sourceRefs for Names / Relations / Claims / Interpretations；
- [ ] composition / witness confusion = 0。

## Engineering

- [ ] `src/content/mesopotamian` structured package complete；
- [ ] runtime registry registered；
- [ ] generic sync auto-discovers package；
- [ ] `tests/mesopotamian-content.test.ts` in `content:validate`；
- [ ] unsupported relation type = 0；
- [ ] duplicate canonical relation = 0；
- [ ] orphan entity / claim subject = 0；
- [ ] local D1 sync idempotent；
- [ ] Static / Local D1 / Production D1 entity semantic parity；
- [ ] CI pass。

## Product

- [ ] Story cards visibly show tradition / source period；
- [ ] Character Detail visibly shows bilingual / scoped names；
- [ ] Interpretation / local manifestation is understandable；
- [ ] Graph does not confuse comparison with genealogy；
- [ ] SSR relation fallback works；
- [ ] D1 search resolves core bilingual aliases；
- [ ] sitemap covers published Story / Character / World routes。

## Visual

- [ ] P0 Character Canonical Design Coverage = 100%；
- [ ] Sumerian / Babylonian / Assyrian visual domains distinguishable；
- [ ] Tiamat source fact vs original design separated；
- [ ] fake-readable cuneiform claim = 0；
- [ ] ancient-astronaut contamination = 0；
- [ ] critical cross-civilization contamination = 0。

P0 不要求：

```text
50+ portraits
every Character has PC + Mobile wallpaper
every ancient city is a World
every tablet becomes a Story
interactive chronology UI
```

---

# 18. 主要风险

## R1 — 虚构统一 Mesopotamian Pantheon

控制：tradition + period + source first。

## R2 — bilingual identity 过度拆分

典型：Inanna / Ishtar、Enki / Ea。

控制：CharacterName + Identity Gate。

## R3 — syncretism 过度合并

典型：Nergal / Erra、Ninurta / Ningirsu、Marduk / Ashur。

控制：Separate Character + Claim / sourced syncretized-with。

## R4 — 文本比较污染 Graph

典型：Ziusudra / Atrahasis / Utnapishtim。

控制：ContentClaim，不用文学对应 relation edge。

## R5 — composition / witness 年代混淆

控制：Textual Witness Policy + source locator / note + regression test。

## R6 — Enuma Elish 被包装成 universal Genesis

控制：Babylon-centered source lane 明示。

## R7 — 现代 Anunnaki / occult / ancient astronaut SEO 污染

控制：source-required claim + blacklist + ancient/reception layer 分离。

## R8 — 全部视觉变成蓝金 Babylon

控制：period / region Visual DNA。

## R9 — Tiamat 被现代 fantasy 龙形固化

控制：mythologicalFacts / originalDesignChoices 分离。

## R10 — 楔形文字乱码被描述为真铭文

控制：Cuneiform QA + verified inscription workflow。

## R11 — RelationType 文档与运行时不一致

控制：数据只使用 `SUPPORTED_RELATION_TYPES`；新类型必须先 generic proposal。

## R12 — Names 存进数据库但用户看不到

控制：generic CharacterName visible block + UI smoke。

---

# 19. 最终结构

```text
Mesopotamian Mythology (product umbrella)
├── Sumerian Foundations
│   ├── An / Enlil / Enki sacred order
│   ├── Inanna / Dumuzi
│   ├── Ziusudra
│   └── Ninurta
├── Akkadian / Old Babylonian
│   ├── Atrahasis
│   ├── Adapa
│   ├── Etana
│   └── Anzu
├── Gilgamesh
│   ├── Gilgamesh / Enkidu
│   ├── Humbaba / Bull of Heaven
│   ├── Death / immortality quest
│   └── Utnapishtim
├── Babylonian Theology
│   ├── Apsu / Tiamat
│   ├── Marduk
│   ├── Nabu
│   └── Enuma Elish
├── Underworld
│   ├── Ereshkigal
│   ├── Inanna / Ishtar descent
│   └── Nergal
└── Assyrian Bridge
    ├── Ashur
    ├── Ishtar of Nineveh / Arbela review
    └── source-scoped state / local cult theology
```

推荐最终执行顺序：

```text
Source / Witness Policy
→ Identity / Names Freeze
→ Story Dependency Manifest
→ P0-A Structural Vertical Slice
→ Sumerian Closure
→ Akkadian Bridge
→ Gilgamesh Closure
→ Babylon / Marduk Closure
→ Underworld / Assyrian Bridge
→ Product / D1 / Graph Closure
→ Tier S Visual Production
```

最重要的原则：

> **MythCanvas 不应把“美索不达米亚神话”做成现代人整理出的统一神谱，而应做成一个可追踪语言、文本、泥板 witness、城市、时期与神学演变的多层神话宇宙；用户既能看见同一神如何跨语言延续，也能明确哪些“对应关系”只是后期神学合流、地方 manifestation 或现代编辑比较。**
