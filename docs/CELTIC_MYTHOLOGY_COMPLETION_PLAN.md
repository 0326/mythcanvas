# MythCanvas 凯尔特神话补全计划

> 状态：V1.2 Execution Plan / Review Optimized  
> 版本：V1.2  
> 日期：2026-09-02  
> 适用范围：`myth-celtic` 的 Character / Relation / Story / World / Scene / Source / Identity / Visual / D1 / Graph / SEO 补全  
> 相关文档：`docs/GREEK_MYTHOLOGY_COMPLETION_PLAN.md`、`docs/NORSE_MYTHOLOGY_COMPLETION_PLAN.md`、`docs/JAPANESE_MYTHOLOGY_COMPLETION_PLAN.md`、`docs/EGYPTIAN_MYTHOLOGY_COMPLETION_PLAN.md`、`docs/MAYA_MYTHOLOGY_COMPLETION_PLAN.md`、`docs/CONTENT_POSITIONING.md`、`docs/CHARACTER_ART_SYSTEM.md`、`.agents/skills/mythcanvas-content-model/SKILL.md`

---

## 0.0 架构基线（2026-09-02）

本方案遵循 [`docs/STATIC_CONTENT_DYNAMIC_DATA_REFACTOR_PLAN.md`](./STATIC_CONTENT_DYNAMIC_DATA_REFACTOR_PLAN.md)。Celtic structured bundle 发布后，`src/content/celtic/*`、registry 和 `PublicContentCatalog` 是规范内容权威源；公共 Mythology / World / Character / Story 页面、搜索、Graph、生成上下文和 sitemap 不得在请求时读取 D1。

D1 仅承载用户与运营动态数据。内容表可以在过渡期作为兼容镜像，但不能再被称为公共页面的主源或“静态 fallback”的必需后端。镜像操作必须显式执行：

```bash
npm run content:mirror:d1 -- --mythology=celtic                 # dry-run
npm run content:mirror:d1 -- --mythology=celtic --apply --local # 可选审计
npm run content:mirror:d1 -- --mythology=celtic --apply --remote # 单独授权
```

本方案的 P0 parity 指静态目录到公共产品消费链路的语义闭包；D1 mirror SQL compatibility 和 local idempotency 是可选运维审计，不是 P0 公共发布阻断项。

当前同步脚本自动发现 `catalog.ts`、`stories.ts`，并可选读取 `identities.ts`；`sources.ts` 不是独立自动同步入口，必须由包内 `sourceRef` / `storySource` 物化到可消费的实体数据，或先补通用能力。

# 0. Review 结论

凯尔特神话不能照搬希腊、北欧的“统一神谱”方式补全。

当前 MythCanvas 的 `myth-celtic` 同时包含：

- 中世纪爱尔兰神话叙事：The Mórrígan、Lugh、Brigid、The Dagda、Nuada、Manannán mac Lir、Aengus；
- Ulster Cycle：Cú Chulainn、Medb；
- Fenian Cycle：Fionn mac Cumhaill；
- Continental / Gallo-Roman：Cernunnos、Epona。

后续还需要加入 Welsh Four Branches of the Mabinogi。

这些材料来自不同地区、年代、语言、文本层和证据类型，不能被包装成一套历史上存在的“凯尔特十二主神 + 完整家谱”。

本方案的总原则：

1. **`myth-celtic` 是产品聚合入口，不是单一 Canon。**
2. **Story First，但不伪造统一创世主线。**
3. **Source Scoped。** 中世纪文学、铭文/祭坛/考古、古典作者外部记载不能互相无提示补空白。
4. **跨传统相似人物默认不合并。** Lugh ≠ Lugus、Brigid ≠ Brigantia / Saint Brigid、Nuada ≠ Nodens、Manannán ≠ Manawydan。
5. **大陆凯尔特采用 evidence-first。** Cernunnos / Epona 做证据型 Character，而不是虚构连续史诗。
6. **Scene 优先于 World。** 不机械制造“凯尔特九界”或统一彼世。
7. **直接复用当前成熟 structured pipeline。** 不新增 Celtic-only importer / validator / schema。
8. **P0 内容闭包与 P1 正式视觉生产分离。** P0 必须 Generation-ready，但不要求先生产完所有壁纸。

目标是让用户明确知道：

> 我看到的是哪一支凯尔特传统、依据哪份材料、哪些关系是直接文本/铭文证据、哪些只是来源范围内的编辑归纳、哪些跨地区对应仍有争议。

## 0.1 V1.2 相比 V1.1 的核心优化

参考 Greek V1.1、Japanese / Egyptian / Maya V1.2 后，本轮增加 10 个执行级修正。

### 1. 增加明确的 P0 Content Closure Slice

V1.1 的原则正确，但实施边界仍偏宽。

V1.2 把首轮真正可交付定义为：

```text
Celtic structured package
→ existing 12 stable Character migration
→ source / identity / taxonomy closure
→ Irish Mythological core
→ Táin core + Ulster debility prelude
→ Four Branches core
→ Fionn bridge
→ Cernunnos / Epona evidence profile
→ generic validation / optional D1 mirror idempotency
→ runtime / search / sitemap parity
```

不是“一次把所有 Celtic-speaking regions 的传统做完”。

### 2. 增加 P0 Coverage Matrix

P0 不再只按 Story 列表判断完整，而按 5 条内容 lane 验收：

```text
Irish Mythological
Ulster / Táin
Fenian Bridge
Welsh Four Branches
Continental / Gallo-Roman Evidence
```

每条 lane 都必须有明确的 Narrative / Character / Source / Relation / Scene 或 Evidence DoD。

### 3. Story Manifest 增加 Narrative Unit Quality Gate

不为了 Story 数量拆页面。

每个发布 Story 必须同时满足：

- 能独立回答一个用户问题；
- 有明确起点 / 冲突或变化 / 结果；
- 有自己的 source locator；
- 有 required entity closure；
- 与相邻 Story 不只是换标题重复同一事件。

### 4. Existing 12 Character 改为三类 Coverage

不是每个现有 Character 都强行塞入 P0 Story。

```text
Narrative Core
Evidence / Identity Core
Bridge Core
```

例如 Brigid、Cernunnos、Epona 可以先以来源和身份闭包为 P0，不为凑 Story 发明剧情。

### 5. Tradition taxonomy 显式对齐当前 `TaxonomyKind`

当前 Schema 只支持：

```text
lineage
domain
story-cycle
editorial-collection
```

V1.2 不新增 `tradition` kind。

### 6. Source Manifest 升级为 Source Registry Contract

直接复用 Maya 已验证的：

```text
source registry
+ sourceRef(key, locator)
+ storySource(key, locator)
```

并新增同 `sourceId` 元数据一致性 Gate，避免 D1 sync 时同 ID 被不同 title / period / edition 静默覆盖。

### 7. Identity Resolution 增加“是否值得建 Character” Gate

不能为了表达“Lugh 不等于 Lugus”就机械新增 Lugus Character。

规则：

```text
有独立 P0 narrative / cult / evidence closure
→ Character

仅作为跨传统比较对象
→ ContentConcept / ContentClaim

确有稳定同一身份的来源层叠
→ CharacterName / CharacterInterpretation
```

### 8. Generic Validator 增加 Celtic 暴露出的共性门禁

当前共享 validator 已检查 Character / Relation / Story 大量闭包，但仍应补：

- Claim subject endpoint 必须存在；
- Story 内 Claim subject 必须落在合法实体；
- Relation interpretation endpoints 必须存在；
- 同 sourceId metadata 不允许冲突；
- closure-managed Story source 必须有 locator；
- published P0 source 应有 tradition / period；
- duplicate CharacterName id 不允许。

这些必须补到共享 validator，不写 `celtic-content-validation.ts`。

### 9. Táin 补“Ulster Debility / Noínden Ulad”前置闭包

V1.1 直接从 Medb 出征进入 Cú Chulainn 独守，会缺失“为什么 Ulster 主力无法参战”的关键解释。

P0 增加：

```text
Noínden Ulad / The Debility of the Ulstermen
```

并把 Macha 身份问题单独进入 Identity Gate；不能因此直接宣布该 Macha = Mórrígan 三相之一。

### 10. `world-annwn` 从“候选”改成 Story Dependency 决定

Pwyll / Arawn Story 若进入 P0，Annwn 作为稳定、可复用的他界空间应进入 P0 World closure。

仍禁止创建：

```text
world-celtic-otherworld
```

---

# 1. 当前仓库基线与不可破坏约束

## 1.1 Stable Mythology

```text
id: myth-celtic
slug: celtic
name: 凯尔特神话
nameEn: Celtic Mythology
tagline: 森林与彼世
```

公开 ID / slug 不迁移。

当前 Hero 仍是 placeholder，正式视觉放 P1。

## 1.2 已有 12 个 Launch Characters

| Character | Stable ID | 主要传统 | V1.2 Coverage |
|---|---|---|---|
| The Mórrígan | `character-morrigan` | Irish / Ulster | Narrative + Identity Core |
| Cú Chulainn | `character-cu-chulainn` | Ulster | Narrative Core |
| Lugh | `character-lugh` | Irish Mythological | Narrative + Identity Core |
| Brigid | `character-brigid` | Irish Mythological | Evidence / Identity Core |
| The Dagda | `character-dagda` | Irish Mythological | Narrative Core |
| Nuada | `character-nuada` | Irish Mythological | Narrative + Identity Core |
| Fionn mac Cumhaill | `character-fionn-mac-cumhaill` | Fenian | Bridge Core |
| Medb | `character-medb` | Ulster | Narrative Core |
| Manannán mac Lir | `character-manannan` | Irish Otherworld | Evidence / Bridge Core |
| Aengus | `character-aengus` | Irish Mythological | Narrative Core |
| Cernunnos | `character-cernunnos` | Continental / Gallo-Roman | Evidence Core |
| Epona | `character-epona` | Continental / Gallo-Roman | Evidence Core |

`0025_celtic_character_canonical_designs.sql` 已为 12 人建立 generation-grade Canonical Design。

本轮：

```text
保留 ID / slug
+ structured ownership
+ sourceRefs
+ sourcePeriods
+ taxonomy
+ identity boundary
+ relations
+ Story / evidence linkage
```

不重复创建第二套 Character。

## 1.3 当前 generic pipeline 已可复用

主干已经有 Greek / Norse / Japanese / Egyptian / Maya structured content，并支持：

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

Generic sync 自动发现 `src/content/<slug>/catalog.ts + stories.ts`，可选读取 `identities.ts`，同步前执行 `content:validate`。

因此 Celtic P0 的工程目标是**接入并补强共享能力**，不是再建设一套 Celtic pipeline。

---

# 2. “完整”的统一定义

凯尔特 P0 的完整不是：

- 所有 Celtic-speaking 地区大全；
- 凯尔特十二主神；
- 统一创世史；
- 统一神族家谱；
- 统一 Otherworld 地图；
- 把所有语言学 cognate 当同一 Character。

P0 用户侧完整定义：

> 用户能够理解爱尔兰 Tuatha Dé Danann 与 Mag Tuired 核心叙事、Táin 的战争逻辑与 Cú Chulainn 主线、Fionn 的起源桥接、Welsh Four Branches 的完整骨架；同时能理解 Cernunnos / Epona 主要来自铭文、图像与崇拜证据，而不是连续史诗，并能看到跨传统身份对应的证据边界。

## 2.1 P0 硬指标

```text
P0 Coverage Matrix = 100%
P0 Story Entity Dependency Closure = 100%
P0 Existing 12 Character Source Closure = 100%
P0 New Required Character Source Closure = 100%
P0 Required Narrative Relation Coverage = 100%
P0 Story Source Coverage = 100%
P0 Canonical Design Coverage = 100%
P0 Tradition Scope Coverage = 100%
P0 Evidence Core Claim Coverage = 100%
Forced Cross-Tradition Merge = 0
Unsupported Pan-Celtic Genealogy Claim = 0
Conflicting-source Claim Without Scope = 0
Duplicate Canonical Relation = 0
SourceId Metadata Conflict = 0
Invalid Claim Subject = 0
Invalid Relation Target = 0
Orphan Entity Reference = 0
Static Public Runtime Semantic Drift = 0
D1 Mirror Semantic Drift = 0（仅在执行镜像审计时适用）
```

Story / Character / World / Relation 数量不是 KPI。

## 2.2 P0 Coverage Matrix

| Lane | P0 必须完成 | 不要求 P0 完成 |
|---|---|---|
| Irish Mythological | Mag Tuired 主线、Aengus/Caer、核心 Tuatha Character / Relation / Source closure | 全部 Irish mythological cycle |
| Ulster / Táin | Ulster debility 前置、Medb 出征、Cú Chulainn 独守、Fer Diad、结局 | 所有 remscéla / Ulster Tales |
| Fenian | Fionn aliases / source + Salmon of Knowledge | 完整 Fianna / Oisín / Diarmuid / Gráinne |
| Welsh Four Branches | Four Branches narrative closure + Annwn + required Characters | 全 Mabinogion / Arthurian Welsh material |
| Continental / Gallo-Roman | Cernunnos / Epona evidence profiles | 伪造连续“大陆凯尔特史诗” |

---

# 3. Taxonomy / Tradition 模型

复用：

- `TaxonomyTerm`；
- `Character.traditionTags`；
- `Character.sourcePeriods`；
- `ContentClaim.traditionScope`；
- `MythStory.tradition`；
- `CharacterInterpretation`。

## 3.1 P0 Taxonomy

使用现有 `TaxonomyKind`：

### `story-cycle`

```text
celtic-irish-mythological
celtic-irish-ulster
celtic-irish-fenian
celtic-welsh-four-branches
```

### `editorial-collection`

```text
celtic-irish-otherworld
celtic-continental-gaulish
celtic-gallo-roman
```

如后续要表达 deity domain，可另用 `domain`，例如：

```text
sovereignty
warfare
poetry
healing
smithcraft
horse-cult
otherworld
```

不新增：

```text
kind = tradition
```

## 3.2 `celtic` 不是万能 scope

Bad：

```ts
{
  summary: 'Lugh 是全凯尔特共同的太阳神',
  traditionScope: 'celtic'
}
```

Preferred：

```ts
{
  summary: 'Lugh 在中世纪爱尔兰叙事中是多艺的 Tuatha Dé Danann 领袖。',
  traditionScope: 'celtic-irish-mythological',
  sourceRefs: [...]
}
```

跨地区对应另建 contested / editorial-synthesis Claim。

---

# 4. Source Registry Contract

建议建立：

```text
src/content/celtic/sources.ts
```

直接对齐 Maya 当前已验证模式：

```ts
celticSources
sourceRef(key, locator, note?)
storySource(key, locator, note?)
```

## 4.1 Source 元数据最低要求

每个 P0 managed source 至少明确：

```text
sourceId
title
type
storyType
tradition
period
language（可得时）
edition / translator（使用现代版本时）
url（有稳定学术 / 馆藏入口时）
note
```

所有 Claim / Relation / CharacterName / CharacterInterpretation 必须使用 locator / section。

Closure-managed Story 的 `sources[]` 也必须有 locator。

## 4.2 SourceRefType 映射

不要发明 Celtic-only type。

建议：

```text
中世纪爱尔兰 / 威尔士叙事文本
→ primary-text（同时在 period / note 明确其保存年代和文本层）

古代铭文 / 祭坛 / 地方崇拜记录
→ local-cult-record / historical-record

Caesar / Lucan 等古典外部记载
→ historical-record

现代 identity / iconography 学术讨论
→ academic-secondary
```

## 4.3 Irish P0 Sources

至少纳入：

```text
celtic-src-cath-maige-tuired
celtic-src-tain-r1
celtic-src-tain-r2
celtic-src-noinden-ulad
celtic-src-aislinge-oenguso
celtic-src-macgnimartha-find
celtic-src-lebor-gabala
```

P1：

```text
celtic-src-acallam-na-senorach
celtic-src-tochmarc-etaine
```

规则：

- Táin Recension I / II 不压成一个“唯一原文”；
- `Noínden Ulad` 用于解释 Ulster debility，不把 Macha 身份争议自动写成 Mórrígan genealogy；
- `Lebor Gabála Érenn` 是 mythographic framework，不当作“凯尔特圣经”；
- 中世纪抄本保存的叙事不直接写成铁器时代宗教逐字记录。

## 4.4 Welsh P0 Sources

Source registry 至少覆盖：

```text
White Book of Rhydderch witness / scholarly edition lane
Red Book of Hergest witness / scholarly edition lane
Pwyll Pendefig Dyfed
Branwen ferch Llŷr
Manawydan fab Llŷr
Math fab Mathonwy
```

产品可使用“Mabinogi / Mabinogion”，但 Claim / Story source metadata 必须落到具体 branch / witness / edition。

## 4.5 Continental / Gallo-Roman Evidence

### Cernunnos

P0 稳定锚点：

- Pilier des Nautes / Pillar of the Boatmen 的名称与浮雕证据；
- antlers / torc 等 iconography；
- Gundestrup antlered figure 只作为 comparison evidence，不自动 `same-as Cernunnos`。

### Epona

P0：

- inscriptions；
- horse-associated iconography；
- cult / votive context；
- geographic distribution 只能按来源说明，不造 Irish genealogy。

### Classical External Records

Caesar、Lucan 等必须显示为外部观察者视角。

不能把 interpretatio romana 直接变成：

```text
local deity === Mercury / Jupiter / Mars
```

## 4.6 SourceId Consistency Gate

共享 validator 应保证：

> 同一个 `sourceId` 在 Character / Relation / Story / Claim / Name / Interpretation 中出现时，其 title / type / tradition / period / language / edition 不得互相冲突。

避免 generic sync 的 source collection 在不同调用点静默覆盖元数据。

---

# 5. Identity Resolution

建立：

```text
src/content/celtic/identities.ts
```

导出：

```text
celticNames
celticInterpretations
celticClaims
```

## 5.1 Identity Decision Gate

```text
同一稳定身份，仅拼写 / 称号不同
→ CharacterName

同一 Character 在不同来源层身份、职责或图像显著变化
→ CharacterInterpretation

跨地区可能相关，但同一性未解决
→ ContentClaim / ContentConcept

有独立叙事或独立 cult/evidence closure
→ 独立 Character
```

禁止为了表达“不是同一人”批量创建没有任何页面价值的 negative Character。

## 5.2 高风险组合

| A | B | P0 策略 |
|---|---|---|
| Lugh | Lugus | Lugh Character；Lugus 默认 comparison Concept / Claim，除非独立 evidence closure 要求 Character |
| Brigid | Brigantia | Brigid Character；Brigantia P1 / evidence gate |
| Brigid | Saint Brigid | mythic Brigid 保持独立；圣徒层只做 later interpretation / comparison，不注入 canonical prompt |
| Nuada | Nodens | Nuada Character；Nodens P1 / evidence gate |
| Manannán mac Lir | Manawydan fab Llŷr | 两者均有独立 P0 narrative value → 两个 Character |
| Aengus / Óengus | Maponos / Mabon | 默认不合并 |
| The Mórrígan | Badb / Macha / Nemain | source-scoped；禁止固定“三相女神”模型 |
| Cernunnos | Gundestrup antlered figure | comparison Claim only |

## 5.3 Mórrígan / Macha 特殊 Gate

P0 需要同时处理：

1. Mórrígan 在 Mag Tuired / Táin 中的来源范围；
2. `Noínden Ulad` 中 Macha 与 Ulster debility；
3. Macha 与 Mórrígan / Badb / Nemain 的身份关系。

规则：

- Táin 前置故事需要的 Macha 可以成为独立 Character 或 scoped Interpretation，必须先做 source review；
- 不允许为了产品整齐直接把她设成 `character-morrigan` 的固定三位一体子身份；
- 任何合并都必须有 source-scoped Claim，而不是只凭现代百科常见说法。

## 5.4 Brigid

Canonical Character 明确为 mythic Brigid。

禁止把 Saint Brigid 的：

```text
修女服
十字架
教堂
圣徒传剧情
```

注入 mythic canonical prompt。

## 5.5 Evidence Core Character

Cernunnos / Epona Character Detail 优先回答：

1. 名称如何被证实；
2. 主要 iconographic anchors；
3. 证据地点 / 年代；
4. supported claim；
5. contested interpretation。

不新建 `EvidenceProfile` schema。

---

# 6. P0 Story Manifest

Story 数量不是 KPI；以下是 V1.2 推荐的可执行 Narrative Manifest。

## 6.1 Volume A — Tuatha Dé Danann / Cath Maige Tuired

推荐 6 个 unit：

1. **Nuada、失去手臂与王权危机**；
2. **Bres 的统治与 Tuatha 的困境**；
3. **Lugh 来到 Tara：Samildánach / 多艺者试炼**；
4. **诸神备战：Dagda、Ogma、工匠与战争准备**；
5. **Mórrígan / Dagda 战前相遇与战争预兆**；
6. **Second Battle of Mag Tuired：Nuada、Balor、Lugh 与战争结局**。

如果 source / narrative review 证明第 6 篇过长，可把 `Lugh vs Balor` 拆成独立 Story；不能为了数量提前硬拆。

## 6.2 Volume B — Aengus / Irish Otherworld

P0 1 个 unit：

- **Aengus 的梦与寻找 Caer Ibormeith**。

P1 再扩：

- *Tochmarc Étaíne*；
- Midir / Étaín；
- 更多 síd / Otherworld narrative。

## 6.3 Volume C — Ulster / Táin Bó Cúailnge

推荐 8 个 unit：

0. **Macha 与 Ulster 的失能 / Noínden Ulad**；
1. **Medb / Ailill 与出征动机**；
2. **Donn Cúailnge 与 Cooley raid**；
3. **Cú Chulainn 为什么独守 Ulster**；
4. **Mórrígan 与 Cú Chulainn：冲突、援助与预兆的来源差异**；
5. **Cú Chulainn 与 Fer Diad**；
6. **Ulster 军势恢复与战争转折**；
7. **两头公牛的最终冲突与结局**。

所有 recension-sensitive 细节必须用：

```text
Story.sources[]
Story.sourceNotes[]
ContentClaim.traditionScope
ContentClaim.sourceRefs[]
```

明确来源版本。

## 6.4 Volume D — Fionn Origin Bridge

P0 1 个 unit：

- **Fionn 与智慧鲑鱼 / Salmon of Knowledge**。

P1 再扩完整 Fenian Cycle。

## 6.5 Volume E — Four Branches of the Mabinogi

V1.2 不再保留“4 篇或 8–12 篇都行”的过宽实现空间，推荐先冻结 9 个 narrative unit：

### Pwyll

1. **Pwyll 与 Arawn 交换身份**；
2. **Rhiannon、婚姻与 Pryderi 的失踪 / 归来**。

### Branwen

3. **Branwen 的婚姻、侮辱与政治裂痕**；
4. **Brân 渡海、战争与 Brân 之首**。

### Manawydan

5. **Dyfed 荒废与幸存者的生活**；
6. **Pryderi / Rhiannon 消失、Manawydan 破除魔法**。

### Math

7. **Math、Goewin、Gwydion 与 Pryderi 冲突**；
8. **Arianrhod 与 Lleu 的身份 / 命名 / 武装**；
9. **Blodeuwedd 的创造、背叛与结局**。

实现前可在 Narrative Unit Review 合并 1–2 个 unit，但不得把 Four Branches 压成一篇超长摘要。

## 6.6 Narrative Unit Quality Gate

每个 Story publish 前必须通过：

```text
独立用户问题 = yes
独立 source locator = yes
requiredCharacterIds closure = 100%
requiredWorldIds closure = 100%（如适用）
requiredSceneIds closure = 100%
requiredSourceIds closure = 100%
sourceNotes = non-empty
重复剧情占比低
```

## 6.7 禁止伪造的 Story

P0 不创建：

- 凯尔特世界的诞生；
- 凯尔特诸神统一起源；
- 所有凯尔特神都居住的统一 Otherworld；
- 凯尔特统一末日；
- Cernunnos / Epona 连续虚构史诗。

需要解释宇宙观时用 `ContentConcept` / editorial explanatory content。

---

# 7. Character Dependency Closure

## 7.1 Irish Mythological

由 Volume A/B 反推，优先候选：

```text
Balor
Bres
Ogma
Dian Cécht
Miach
Goibniu
Cian
Ethniu / Eithne
Caer Ibormeith
```

Boann / Midir / Étaín 等由 P1 Story closure 决定。

## 7.2 Ulster

优先：

```text
Ailill mac Máta
Conchobar mac Nessa
Fergus mac Róich
Fer Diad
Lóeg
Macha（Identity Gate 后）
Donn Cúailnge
Findbennach
```

Emer / Feidelm 等是否进入 P0，由最终 Narrative Manifest required IDs 决定。

两头公牛当前可先用 `characterType = creature`，不新增 Creature schema。

## 7.3 Welsh Four Branches

P0 最小核心集：

```text
Pwyll
Rhiannon
Pryderi
Arawn
Branwen
Bendigeidfran / Brân
Manawydan
Efnisien
Math fab Mathonwy
Goewin
Gwydion
Arianrhod
Lleu Llaw Gyffes
Blodeuwedd
```

Cigfa / Gwawl / Gronw Pebr 等由最终 required IDs 决定。

## 7.4 Existing 12 不强制 Story Linkage

Coverage 规则：

```text
Narrative Core
→ 至少 1 个 P0 Story linkage

Bridge Core
→ 至少 1 个 P0 Story 或明确 P0 bridge article / source linkage

Evidence / Identity Core
→ source + claim + canonical design closure 即可
```

因此不为了 Brigid / Cernunnos / Epona 凑 Story。

---

# 8. World / Scene 规则

## 8.1 World Gate

只有满足以下条件才建 World：

```text
稳定命名空间
+ 多 Story 可复用
+ 不是单一建筑 / 单次事件
+ source identity 清晰
```

### P0 Required World

如果 Pwyll / Arawn Story 发布：

```text
world-annwn
```

进入 P0 closure。

### 不创建统一 Irish / Celtic Otherworld

```text
world-celtic-otherworld   # forbidden
```

Tír na nÓg、Mag Mell、Emain Ablach、Tech Duinn 等以后按具体文本逐一判断。

## 8.2 P0 Scene

### Irish Mythological

```text
scene-tara-hall
scene-mag-tuired-battlefield
scene-nuada-silver-arm
scene-dagda-morrigan-river-meeting
scene-aengus-dream
```

### Ulster

```text
scene-emain-macha
scene-cruachan-court
scene-cooley-cattle-raid
scene-cu-chulainn-ford
scene-fer-diad-duel
scene-bulls-final-duel
```

### Welsh

```text
scene-pwyll-annwn-exchange
scene-arberth-mound
scene-branwen-harlech-court
scene-bran-crosses-sea
scene-empty-dyfed
scene-math-court
scene-blodeuwedd-creation
```

现实/传说地点默认 Scene，不因为页面数量升级为 World。

---

# 9. Relation / Claim 规则

## 9.1 Canonical Relation Direction

继续使用共享语义：

- genealogy 只存 parent → child；
- consort / sibling 等对称关系只存一个 canonical pair；
- defeats 不同时再存 defeated-by；
- UI 从当前人物视角生成反向文案。

## 9.2 只使用当前支持的 relationType

P0 优先复用：

```text
parent
consort
sibling
ally
enemy
rival
rules-over
defeats
opposes
captures
aids
companion
encounters
resists
exchanges-with
narrative
associated-with
syncretized-with（仅真正需要时）
```

如果 Celtic Story 需要 `curses / fosters / geis` 等新语义：

> 先评估能否用现有关系 + ContentClaim 表达；确实有跨文明价值时再扩共享 relation semantics + D1 migration。

禁止直接在 Celtic package 发明未注册 relationType。

## 9.3 Comparison 不是 CharacterRelation 默认边

Lugh / Lugus、Nuada / Nodens、Mórrígan / triad 等比较问题优先：

```text
ContentClaim
ContentConcept
CharacterInterpretation
```

只有来源明确支持 syncretism / correspondence 且产品需要 Graph 展示时，再使用 scoped identity relation。

---

# 10. Visual DNA Review

当前“森林与彼世”可作为入口氛围，但不能退化成 generic green druid fantasy。

## 10.1 Shared Celtic Entry Anchors

```text
torc
bronze / iron / wood / stone
mist / hill / river / coast / spring
horse / stag / raven / bull / hound
hillfort / court / mound / ford / road
```

## 10.2 Irish

```text
royal court
chariot
spear
banquet hall
ford
cattle
síd / mound（仅对应 narrative）
```

## 10.3 Welsh

```text
Dyfed court
coast / sea crossing
wooded hills
agricultural landscape
medieval Welsh narrative atmosphere
```

不要强行套 Irish raven / druid visual。

## 10.4 Continental / Gallo-Roman

```text
La Tène metalwork
torc
votive relief / altar / inscription
Gallo-Roman material context
```

不能画成 Irish medieval hero。

## 10.5 Global Avoid

```text
generic green-robed druid
glowing Celtic runes
Norse runes / Viking armor contamination
tartan as universal ancient Celtic clothing
horned helmets
Celtic cross in clearly pre-Christian scenes
Stonehenge as universal Celtic background
leprechaun / shamrock tourism cliché
universal Insular manuscript knotwork
generic elf / woodland fairy
specific modern franchise likeness
```

## 10.6 Existing 12 重点

- Mórrígan：raven / omen 强，gothic witch 弱；
- Cú Chulainn：Ríastrad 是 narrative distortion，不是 superhero mutation；
- Lugh：many-skilled / kingship / spear 高于“太阳神”标签；
- Brigid：poetry / healing / smithcraft，不混 Saint Brigid；
- Dagda：powerful / earthy / kingly，不做 comic obese；
- Nuada：silver arm 是 mythic craft，不做 cyber prosthetic；
- Fionn：hunter / leader / wisdom，不做 medieval knight；
- Medb：political sovereignty / war mobilization 优先于 sexy fantasy queen；
- Manannán：mist / sea / liminality，不做 Poseidon copy；
- Aengus：dream / swan / poetry，明确成年；
- Cernunnos：iconography-led，不做 satanic demon；
- Epona：horse companionship / protection，不 Valkyrie 化。

---

# 11. Structured Content 落地

## 11.1 Package

```text
src/content/celtic/
  catalog.ts
  sources.ts
  identities.ts
  stories.ts
  assets.ts
  visual-tiers.ts
  index.md
```

### `catalog.ts`

```text
celticCharacters
celticRelations
celticConcepts
celticTaxonomy
celticWorlds
celticScenes
```

### `sources.ts`

```text
celticSources
sourceRef()
storySource()
```

### `identities.ts`

```text
celticNames
celticInterpretations
celticClaims
```

### `stories.ts`

```text
celticStories
```

## 11.2 Registry

注册进 `src/content/registry.ts`，不增加 `getCelticXXX()` 页面旁路。

## 11.3 Generic Sync

```bash
npm run content:mirror:d1 -- --mythology=celtic
npm run content:mirror:d1 -- --mythology=celtic --apply --local
```

生产写入最后执行：

```bash
npm run content:mirror:d1 -- --mythology=celtic --apply --remote
```

Remote 不是默认开发动作。

---

# 12. Generic Validation 必须补强

Celtic 不建专属 validator，但本轮应顺手补共享门禁。

## 12.1 Claim Subject Closure

当前 `ContentClaim` 有：

```text
subjectType
subjectId
```

共享 validator 必须根据 subjectType 校验 subjectId：

```text
character → Character exists
world → World exists
scene → Scene exists
story → Story exists
relation → Relation exists
visual-anchor → owning entity / supported subject contract
```

Story 内嵌 claims 同样校验。

## 12.2 Interpretation Endpoint Closure

`CharacterRelation` 的：

```text
fromInterpretationId
toInterpretationId
```

如出现，必须验证 Interpretation 存在且属于对应 Character。

## 12.3 Source Registry Consistency

同一 sourceId：

```text
title
type
period
language
edition
tradition
```

不允许跨引用冲突。

## 12.4 Story Source Locator Gate

Closure-managed published Story：

```text
sources.length > 0
requiredSourceIds.length > 0
source locator / section != empty
sourceNotes.length > 0
```

Táin / Mabinogi 尤其需要 locator，不能只写一个宽泛书名。

## 12.5 CharacterName Gate

检查：

- id unique；
- character endpoint exists；
- interpretation endpoint exists；
- sourceRefs non-empty；
- locator non-empty。

---

# 13. Celtic Contract Tests

新增：

```text
tests/celtic-content.test.ts
```

只声明 Celtic expected facts / forbidden merges，不复制通用 validator。

至少验证：

```text
bundle registered
existing 12 stable IDs preserved
all P0 stories have located sources
all requiredCharacterIds resolve
all requiredWorldIds resolve
all requiredSceneIds resolve
all requiredSourceIds resolve
all P0 relations have located sourceRefs
alternate/scoped assertions have traditionScope
no duplicate assertionKey
no semantic reverse duplicate
no self relation
no orphan claim subject
no sourceId metadata conflict
Cernunnos/Epona are not Irish-only tagged
Manannán and Manawydan are separate IDs
Lugh and Lugus are not silently same entity
Brigid and Saint Brigid are not silently same entity
Macha / Mórrígan are not forced into a fixed triad
Táin recension-sensitive claims are scoped
Ulster debility prelude is present before / linked to Cú Chulainn-alone narrative
world-annwn exists when Pwyll/Arawn Story is published
published story has no missing required entity
```

---

# 14. Product / UX

## 14.1 Mythology Detail IA

1. Hero / Intro；
2. Tradition Navigator；
3. Core Stories；
4. Key Characters；
5. Worlds & Scenes；
6. Relationships / Collections；
7. Sources & Evidence note；
8. Artworks。

不要把单一 Genealogy 作为 Celtic 页面核心。

## 14.2 Tradition Navigator

```text
爱尔兰诸神
Tuatha Dé Danann、Lugh、Dagda、Nuada、Mórrígan

Ulster 英雄
Cú Chulainn、Medb 与 Táin Bó Cúailnge

Fenian
Fionn 与 Fianna 传统

Welsh Mabinogi
Pwyll、Rhiannon、Branwen、Manawydan、Gwydion、Lleu

大陆凯尔特证据
Cernunnos、Epona 与 inscription / relief / cult material
```

Evidence lane 在 UI 上明确标识为“铭文 / 图像 / 崇拜证据”，不伪装 Story cycle。

## 14.3 Tagline

当前：

> 森林与彼世

P0 后建议评估更中性的：

> **诸神 · 英雄 · 彼世**

无论是否改 tagline，首屏 summary 都必须声明是多传统聚合入口。

---

# 15. SEO / Aliases

P0 aliases：

```text
The Mórrígan / Mórrígan / Morrígan / Morrigan
Cú Chulainn / Cuchulainn / Cuchulain
Fionn mac Cumhaill / Finn mac Cumhaill / Finn MacCool
Aengus / Óengus / Óengus mac ind Óc
Manannán mac Lir / Manannan mac Lir
Medb / Maeve
Brân / Bendigeidfran
Lleu Llaw Gyffes
Blodeuwedd
Rhiannon
```

当前 `CharacterNameKind` 不支持自造 `transliteration` type；拼写 / romanization 统一使用 `alias`，称号使用 `title`。

避免标题：

- 凯尔特十二主神；
- 凯尔特完整神族家谱；
- 凯尔特九界；
- 凯尔特统一创世神谱；
- Cernunnos 最高神。

推荐内容入口：

- 凯尔特神话人物；
- Tuatha Dé Danann；
- Cú Chulainn 与 Táin；
- Four Branches of the Mabinogi；
- Cernunnos iconography；
- Epona horse goddess；
- Celtic Otherworld traditions。

---

# 16. 分阶段执行计划

## Phase 0 — Freeze Scope / Source / Identity

- [ ] 建 P0 Coverage Matrix；
- [ ] 建 `sources.ts` registry；
- [ ] 冻结 taxonomy kinds / slugs；
- [ ] 审核现有 12 Character source / canonicality / sourcePeriods；
- [ ] 完成 identity matrix；
- [ ] 冻结 V1.2 Story Manifest；
- [ ] 补 Noínden Ulad source lane；
- [ ] 从 required IDs 计算缺失 Character / World / Scene；
- [ ] 冻结 aliases。

**DoD**：每个 P0 实体都能回答“为什么存在、属于哪条 lane、来自哪份材料”。

## Phase 1 — Shared Validation + Celtic Bundle Skeleton

- [ ] generic Claim subject validation；
- [ ] generic Story claim subject validation；
- [ ] generic interpretation endpoint validation；
- [ ] generic sourceId consistency validation；
- [ ] generic Story source locator validation；
- [ ] CharacterName duplicate / source gate；
- [ ] `src/content/celtic/catalog.ts`；
- [ ] `sources.ts`；
- [ ] `identities.ts`；
- [ ] `stories.ts` skeleton；
- [ ] `assets.ts`；
- [ ] `visual-tiers.ts`；
- [ ] `index.md`；
- [ ] 迁移 existing 12 stable IDs；
- [ ] registry 注册；
- [ ] `celtic-content.test.ts`；
- [ ] dry-run sync。

**DoD**：12 个现有 Celtic Character 完全由 structured package 驱动；共享 validator 能阻止 orphan Claim / source collision。

## Phase 2 — Irish Mythological Core

- [ ] Balor / Bres / Ogma / Dian Cécht / Miach / Goibniu 等 dependency；
- [ ] Cath Maige Tuired 6-unit volume；
- [ ] Lugh / Nuada / Dagda / Mórrígan relations；
- [ ] Aengus / Caer Story；
- [ ] Tara / Mag Tuired scenes。

**DoD**：Irish Mythological lane = 100%。

## Phase 3 — Ulster / Táin

- [ ] Noínden Ulad / Macha identity gate；
- [ ] Ailill / Conchobar / Fergus / Fer Diad / Lóeg 等 dependency；
- [ ] R1 / R2 source scope；
- [ ] 8-unit Táin volume；
- [ ] Cú Chulainn / Medb / Mórrígan relations；
- [ ] Emain Macha / Cruachan / Cooley / Ford scenes。

**DoD**：Ulster / Táin lane = 100%；用户能解释 Cú Chulainn 为什么独守；无 recension 混写不标注。

## Phase 4 — Welsh Four Branches

- [ ] Pwyll / Rhiannon / Pryderi / Arawn；
- [ ] Branwen / Brân / Manawydan / Efnisien；
- [ ] Math / Goewin / Gwydion / Arianrhod / Lleu / Blodeuwedd；
- [ ] `world-annwn`；
- [ ] 9-unit Four Branches volume；
- [ ] Welsh relation / scene closure。

**DoD**：Four Branches lane = 100%。

## Phase 5 — Fenian Bridge / Continental Evidence

- [ ] Fionn aliases + sourceRefs；
- [ ] Salmon of Knowledge Story；
- [ ] Cernunnos names / claims / evidence refs；
- [ ] Epona names / claims / evidence refs；
- [ ] Gallo-Roman material note；
- [ ] unsupported relation = 0。

**DoD**：Fenian + Continental lanes = 100%；existing 12 Launch Character Source Closure = 100%。

## Phase 6 — Public Runtime / Search / Graph Parity

- [ ] `npm run content:validate`；
- [ ] `npm test`；
- [ ] `npm run check`；
- [ ] `npm run content:mirror:d1 -- --mythology=celtic` dry run；
- [ ] （可选）local D1 mirror apply twice，验证 idempotency；
- [ ] Character Detail SSR smoke；
- [ ] Graph API smoke；
- [ ] Mythology page SSR smoke；
- [ ] Story routes SSR smoke；
- [ ] local browser smoke；
- [ ] Search aliases；
- [ ] sitemap；
- [ ] provenance audit；
- [ ] deployed routes smoke；
- [ ] （可选、单独授权）remote D1 mirror apply 与动态数据回归。

**DoD**：Static public runtime 的页面 / Graph / Search / Sitemap 语义一致；若执行 D1 镜像审计，再验证镜像 SQL 与 schema 兼容，不把 D1 作为公共运行时依赖。

Production write / browser visual smoke 在没有真实环境授权时不得标记为完成。

## Phase 7 — P1 Visual Production

优先：

1. Celtic Mythology Hero PC + Mobile；
2. Mag Tuired；
3. Cú Chulainn at the Ford；
4. Mórrígan battlefield omen；
5. Lugh at Tara；
6. Aengus & Caer；
7. Pwyll / Annwn；
8. Rhiannon；
9. Branwen / Brân crossing the sea；
10. Blodeuwedd creation；
11. Cernunnos evidence-led portrait；
12. Epona evidence-led portrait。

每个 asset：

- Canonical Design 合规；
- tradition visual cues 合规；
- PC / Mobile 独立构图；
- provenance 完整；
- 不复制现代商业 IP；
- 不用 generic Celtic fantasy cliché 替代来源特征。

---

# 17. Research Priority / Copyright

## Irish

优先：

- UCC CELT / Irish Sagas；
- DIAS / reliable scholarly editions；
- RIA / Trinity 等 manuscript metadata。

## Welsh

优先：

- National Library of Wales；
- White Book of Rhydderch；
- Red Book of Hergest；
- Four Branches scholarly editions。

## Continental

优先：

- museum archaeological catalogues；
- epigraphic corpora；
- peer-reviewed archaeology / religion scholarship。

## Copyright

- 不大段复制现代译本；
- Story 使用自主中文叙述；
- SourceRef 保存 edition / translator / locator；
- 公版原文 / 图像仍记录 provenance；
- 古代文物本体公版 ≠ 博物馆现代摄影自动公版。

---

# 18. 最终验收

## Content

- [ ] 5 条 P0 Coverage lane 全部完成；
- [ ] Irish Mythological 主线完整；
- [ ] Táin 包含 Ulster debility 前置逻辑；
- [ ] Four Branches 完整；
- [ ] Fionn 不再孤立；
- [ ] Cernunnos / Epona evidence-first；
- [ ] 无伪造 Pan-Celtic creation story。

## Identity

- [ ] existing 12 stable IDs 不变；
- [ ] Story required IDs 100% resolve；
- [ ] Manannán / Manawydan 独立；
- [ ] Mórrígan / Macha 无强制 triad；
- [ ] Lugh / Lugus、Nuada / Nodens 等无强制 same-as；
- [ ] Brigid / Saint Brigid 视觉与来源层不混写。

## Source

- [ ] P0 Character source coverage = 100%；
- [ ] P0 Story located-source coverage = 100%；
- [ ] P0 Relation located-source coverage = 100%；
- [ ] P0 Claim located-source coverage = 100%；
- [ ] SourceId Metadata Conflict = 0；
- [ ] Táin recension scope 显式；
- [ ] Medieval literary layer 与 Iron Age reconstruction 不混写；
- [ ] Continental evidence 与连续 narrative 不混写。

## Engineering

- [ ] `src/content/celtic` 注册；
- [ ] generic Claim subject validation；
- [ ] generic source consistency validation；
- [ ] generic Story source locator validation；
- [ ] static public runtime parity；
- [ ] D1 mirror SQL compatibility；
- [ ] （可选）local D1 mirror idempotency；
- [ ] Graph 正确；
- [ ] duplicate relation = 0；
- [ ] orphan refs = 0；
- [ ] CI pass；
- [ ] sitemap 覆盖 published Story / Character / World。

## Visual

- [ ] Celtic Hero 不再 placeholder；
- [ ] 关键 Scene 有 production art；
- [ ] Celtic ≠ generic green druid；
- [ ] Irish / Welsh / Continental 可视觉区分；
- [ ] Cernunnos / Epona 不被现代 fantasy lore 覆盖；
- [ ] provenance = 100%。

---

# 19. 最终结构

```text
Celtic Mythology (product umbrella)
├── Irish Mythological Tradition
│   ├── Tuatha Dé Danann
│   ├── Cath Maige Tuired
│   ├── Lugh / Nuada / Dagda / Mórrígan / Brigid / Aengus ...
│   └── source-scoped relations
├── Ulster Cycle
│   ├── Noínden Ulad / Macha prelude
│   ├── Táin Bó Cúailnge
│   ├── Cú Chulainn / Medb / Fer Diad / Fergus ...
│   └── recension-aware sources
├── Fenian Bridge
│   └── Fionn / Salmon of Knowledge
├── Welsh Four Branches
│   ├── Pwyll / Rhiannon / Pryderi / Arawn
│   ├── Branwen / Brân / Manawydan
│   ├── Math / Gwydion / Arianrhod / Lleu / Blodeuwedd
│   └── White Book / Red Book source layer
└── Continental Evidence
    ├── Cernunnos
    ├── Epona
    └── inscription / relief / cult evidence
```

**推荐执行顺序：Freeze Scope / Source / Identity → Shared Validation + Celtic Bundle → Irish Mythological → Ulster / Táin → Welsh Four Branches → Fenian + Continental → Public Runtime / Optional D1 Mirror Compatibility → Visual Production。**
