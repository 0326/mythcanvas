# Aztec Mythology Completion Plan — V1.1 Review Delta

> 状态：Review Delta / Implementation Corrections  
> 日期：2026-09-02  
> 目标：对 `docs/AZTEC_MYTHOLOGY_COMPLETION_PLAN.md` V1.0 做跨 Greek / Norse / Japanese / Egyptian / Maya 的实现级 Review。  
> 本文不是第二套 Aztec 方案，而是 V1.0 在实施前必须吸收的修正项；完成后以 V1.0 + 本 Delta 共同作为 Aztec P0 执行基线。

---

# 0. Review 结论

Aztec V1.0 的历史 / 内容方向基本正确，尤其以下原则应保留：

- `aztec` 作为稳定产品入口，但内容层区分 Mexica / Nahua / Central Mexican scope；
- Five Suns 不合成一部不存在的统一 Canon；
- Quetzalcoatl / Topiltzin、Tonatiuh / Nanahuatzin、Ometeotl 等先做 Identity Gate；
- World 少、Scene 多，不硬编码 13 heavens / 9 underworlds；
- 人祭、剥皮、骷髅等内容史料化而不是猎奇化；
- 防 Maya、Catrina、generic tribal、fake glyph 污染；
- P0 内容闭包与 P1 大规模壁纸生产拆开。

但 V1.0 是基于较早仓库状态写的。当前主干已经完成了 Japanese / Maya / Egyptian 的 structured package 接入，Generic Registry、Generic Validator 与 Generic D1 Sync 已经真实存在，因此 V1.0 有部分“未来要做的架构工作”已经过时。

V1.1 应做 **12 个修正**。

---

# 1. 修正一：Aztec 不再负责“泛化 Pipeline”，而是成为第六个正式 Bundle

当前主干 `src/content/registry.ts` 已注册：

```text
Greek
Norse
Maya
Japanese
Egyptian
```

并且 `StructuredMythologyBundle` 已支持：

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

因此 V1.0 中类似：

```text
如果通用 registry pattern 确认
未来 generic sync
扩展 Greek-only repository
```

全部改为确定性要求：

> **Aztec 必须直接成为第六个 registered structured mythology bundle。**

目标包：

```text
src/content/aztec/
├── catalog.ts
├── stories.ts
├── sources.ts
├── identities.ts
├── assets.ts
├── visual-tiers.ts
├── index.ts
└── index.md
```

DoD：

```text
新增 Aztec 后，不新增 Aztec-only Repository
不新增 Aztec-only importer
不新增 Aztec-only sitemap
不新增 Aztec-only Graph loader
不新增 Aztec-only search path
```

如果实现 Aztec 必须修改通用层，应证明是 Generic capability gap，并让修改同时适用于其他文明。

---

# 2. 修正二：`sources.ts` 与 `identities.ts` 从“可选”升级为 P0 必备

Maya 已经验证：复杂身份文明把所有内容塞进 `catalog.ts` 会快速失控。

Aztec 的高风险区域更多：

```text
Quetzalcoatl / Topiltzin
Ehecatl-Quetzalcoatl
Tonatiuh / Nanahuatzin
Ometeotl cluster
Coatlicue / Cihuacoatl / Toci / Teteoinnan
Coyolxauhqui lunar interpretation
Tlaltecuhtli representation
```

因此明确：

## `sources.ts`

维护稳定 source registry / reusable source objects：

```text
sourceId
source title
text / codex unit
period
tradition
language
edition / translation
stable locator convention
```

避免每个 Story / Relation 手写一份略有差异的 Florentine Codex metadata。

## `identities.ts`

集中维护：

```text
CharacterName[]
CharacterInterpretation[]
ContentClaim[]
```

高风险 identity 不要分散在 Character summary、Story prose、relation note 与 Canonical Design 中分别表达。

---

# 3. 修正三：Source Coverage 从“有 source”升级为 Stable Source ID + Locator Closure

当前 generic sync 会从 Story / Character / Concept / Relation / Name / Interpretation / Claim 中收集 `sourceId`，并写入统一 `content_sources`。

因此 Aztec P0 不应满足于：

```text
sourceRefs.length > 0
```

而应要求核心来源全部具有稳定 `sourceId`，例如：

```text
aztec-florentine-book1
aztec-florentine-book2
aztec-florentine-book3
aztec-legend-of-the-suns
aztec-annals-cuauhtitlan
aztec-codex-borbonicus
aztec-codex-boturini
...
```

具体 passage 使用：

```text
section
locator
```

P0 Source DoD：

```text
requiredSourceIds resolvable = 100%
core relation located source = 100%
core identity located source = 100%
contested claim located source = 100%
sourceId metadata conflict = 0
```

同一个 `sourceId` 不允许在不同文件里出现互相冲突的 period / tradition / title 定义。

---

# 4. 修正四：把 P0 拆成 “Content Closure” 与 “Public Release” 两个 Gate

V1.0 正确地避免让壁纸阻塞内容，但当前写法容易产生另一个极端：

> structured data 已闭包，就直接把大量 Symbol Fallback 页面公开上线。

参考 Japanese / Egyptian 最新方案，改为两级：

## P0-A — Content Closure Gate

必须完成：

```text
Source Manifest
Identity Gate
Story dependency closure
Character / Relation / World / Scene closure
Canonical Design
Registry integration
Generic validation
Static repository consumption
D1 dry-run SQL
Search / sitemap discovery contract
```

此阶段允许 placeholder / symbol fallback。

## P0-B — Public Release Gate

在真正公开发布前：

```text
Tier S 至少拥有 production portrait / reference
正式发布 World 至少拥有可接受 Hero
published Story 必须拥有 narrative-fit 且 provenance 完整的 Hero Asset
public prototype provenance = 0
关键页面 browser smoke 通过
```

PC / Mobile wallpaper 仍属于 P1，不回流阻塞 P0-A。

这样同时避免：

- “为了图拖死内容”；
- “为了赶内容上线大量低质占位”。

---

# 5. 修正五：先做 Aztec Content Closure Slice，再批量写 Story 正文

Egyptian V1.2 已证明更稳妥的顺序是：

```text
package skeleton
→ registry discovery
→ generic validator
→ local seed / repository consumption
→ D1 dry-run SQL
→ contract tests
→ 再扩大 Story / Character 内容量
```

Aztec 应复制这个顺序。

Phase 1 的 DoD 不应只是“创建目录”，而应是：

```text
getStructuredMythologyBundle('myth-aztec') != undefined
getStructuredCharacters('myth-aztec') 可读取
getStoriesForMythology('myth-aztec') 可读取
content:validate 能发现 Aztec
sync-structured-content --mythology=aztec dry-run 成功
D1 SQL 可生成但默认不 apply
static fallback 能浏览至少 1 个 smoke Story + 1 个 Character + 1 个 World
```

然后才进入 Five Suns / Coatepec / Migration 等批量内容闭包。

---

# 6. 修正六：现有 12 个 Character 必须做“Structured Authority Migration”测试

现有 12 个 Aztec 角色来自 migration seed，后续 `src/content/aztec/catalog.ts` 会成为 authoritative content source。

需要明确迁移规则：

```text
stable id / slug 完全保留
structured bundle 覆盖旧 summary / source / canonical metadata
不得产生第二个同名 Character
character_worlds 使用 structured package 的当前真值重建
旧 migration history 不回改
```

必须测试这 12 个 ID：

```text
character-quetzalcoatl
character-huitzilopochtli
character-tezcatlipoca
character-tlaloc
character-coatlicue
character-xipe-totec
character-mictlantecuhtli
character-mictecacihuatl
character-tonatiuh
character-coyolxauhqui
character-xiuhtecuhtli
character-xochipilli
```

验收：

```text
legacy stable id drift = 0
legacy slug drift = 0
duplicate character after D1 merge = 0
static / D1 canonical identity mismatch = 0
```

---

# 7. 修正七：Identity Gate 必须闭环到 Character Detail、Graph 与 Creator

V1.0 已经正确提出 `CharacterInterpretation`，但还偏数据层。

Aztec 的 Interpretation 一旦存在，就必须被产品真实消费：

```text
Stable Character
→ selected Interpretation
→ selected Variant
→ Style
→ OutputSpec
```

Character Detail 至少消费：

```text
Character
CharacterName[]
CharacterInterpretation[]
CharacterVariant[]
ContentClaim[]
Direct Relations
Stories
World / Scene
Artwork
```

关键测试：

- 切换 `?interpretation=` 后，角色身份说明同步变化；
- Interpretation 专属 Relation 不泄漏到其他 interpretation；
- 从 Detail 进入 Creator 时 interpretation context 不丢失；
- 切 Style / Device 后 interpretation 仍保留；
- Variant / Style 不改变神谱事实。

Quetzalcoatl / Ehecatl 是首个必须跑通的 smoke case。

---

# 8. 修正八：Graph DoD 不能只写“有 SSR fallback”

参考 Norse Graph Integration 与 Japanese tests，Aztec P0 Graph 必须包含四层：

## 8.1 Alternate scope 可达

```text
未选择 scope
→ compact neutral/default assertions

显式选择 scope
→ 对应 scope 的 isDefault=false assertion 也必须可见
```

不能出现“异说按钮可选，但 relation 永远被过滤”的假功能。

## 8.2 Interpretation endpoint scope

如果 Relation 使用：

```text
fromInterpretationId
toInterpretationId
```

Graph 必须根据当前 selected Interpretation 过滤兼容边。

## 8.3 HTML Fact Panel

3D Graph 只负责探索；事实解释由 HTML panel 提供：

```text
relation label
counterpart
tradition scope
confidence
source title
locator
```

## 8.4 SSR textual fallback

禁用 JS / WebGL / API fail 时仍能读到 direct P0 relations 与 source。

优先 smoke：

```text
Quetzalcoatl
Huitzilopochtli
Coatlicue
Coyolxauhqui
Tonatiuh
Nanahuatzin
```

---

# 9. 修正九：Relation Vocabulary 必须经过通用语义层，不允许计划文档自由造词

当前 validator 会拒绝不在 `SUPPORTED_RELATION_TYPES` 中的 relationType。

因此 V1.0 中候选：

```text
becomes
produces-sun
possible-correspondence
transformation
patron-of
associated-with
```

不能看到语义合适就直接写进 Aztec data。

实施顺序：

```text
已有通用 relation type 能表达？
YES → 复用

NO
→ Generic Relation Vocabulary Review
→ relation-semantics.ts
→ D1 relation type constraint / migration（如需要）
→ Graph label / direction semantics
→ tests
→ 最后才允许 Aztec 使用
```

尤其 `patron-of / rules-over` 若目标不是 Character，而是 World / Scene / Concept，不要为了 Graph 强行转成 Character-to-Character edge。

---

# 10. 修正十：Taxonomy / Tradition Vocabulary 必须成为注册实体，而不是自由字符串

当前 validator 会检查 Character `traditionTags` 是否对应 bundle taxonomy slug。

所以 V1.0 的：

```text
mexica-tenochtitlan
nahua-cuauhtitlan
central-mexican-nahua
central-mexican-ritual-codex
colonial-nahua-witness
```

不能只存在于文档。

Phase 0 必须定义 taxonomy terms：

```text
id
slug
kind
name
summary
displayOrder
```

同时区分：

- tradition/source scope；
- story cycle；
- domain；
- editorial collection。

不要把 ethnicity ontology 偷渡进 taxonomy。

验收：

```text
unregistered traditionTag = 0
ambiguous taxonomy meaning = 0
Story.tradition vocabulary drift = 0
```

---

# 11. 修正十一：考古 / 图像证据存在 Generic SourceRef Schema Gap，不能 Aztec-only 扩字段

Aztec P0 明显依赖：

```text
Templo Mayor
Coyolxauhqui monolith
Coatlicue sculpture
Tlaltecuhtli monolith
Sun Stone
Ehecatl circular temple
archaeological offerings
```

但当前 `SourceRefType` 主要面向文本 / historical record / local cult record / academic secondary，没有一等 `archaeological-object` 类型。

V1.1 规则：

1. P0 先使用当前通用 SourceRef 能力表达 museum / corpus / excavation catalog 引用；
2. `title / section / locator / url / note` 明确 object identity；
3. 不新增：

```text
aztecObjectId
aztecSite
aztecEvidenceType
```

4. 如果 object-level attestation 在 Aztec / Maya / Egyptian 都反复需要，提交 **Generic Source Evidence Schema Review**，再考虑通用：

```text
evidenceKind
objectId
site
collection
objectDate
```

这应是跨文明能力，不是 Aztec 私有字段。

另外要区分：

```text
ancient object = evidence
museum image = asset/license subject
modern scholarly interpretation = academic claim
```

三者不能共用一个 provenance 概念。

---

# 12. 修正十二：Validator 需要补 Claim Subject Integrity，Aztec 用专项 Contract Test 先兜底

当前 generic validator 已经检查：

- Character production fields；
- generic characterType；
- CharacterName endpoint / source locator；
- Interpretation ownership；
- Claim source locator；
- World / Scene semantics；
- taxonomy；
- Relation endpoint / direction / type / source / duplicate assertion；
- Story dependency validation。

但高风险 Aztec ContentClaim 还需要额外保证：

```text
claim.subjectType 对应 subjectId 真实存在
claim.traditionScope 在需要时非空
contested identity claim 不被 presentation 当 stable fact
Story inline claim 与 bundle-level claim id 不冲突
同一 contested issue 不出现互相矛盾的两个 default synthesis
```

在 generic validator 尚未全部覆盖前，`tests/aztec-content.test.ts` 必须先做专项 contract test。

优先案例：

- Coyolxauhqui lunar interpretation；
- Nanahuatzin -> solar identity；
- Ometeotl；
- Topiltzin correspondence；
- Tlaltecuhtli gender / iconographic description；
- Five Suns alternate order / destruction mode。

若这些规则对 Maya / Egyptian 同样适用，应继续上提到 generic validator，而不是永久留成 Aztec-only tests。

---

# 13. 更新后的实施顺序

## Phase 0 — Freeze Editorial Contracts

产出：

```text
source registry
sourceId convention
tradition taxonomy
period vocabulary
name manifest
identity decision table
relation vocabulary review list
Story narrative dependency manifest
legacy-12 authority migration manifest
```

先解决：

- Quetzalcoatl / Topiltzin；
- Ehecatl；
- Tonatiuh / Nanahuatzin；
- Coyolxauhqui；
- Ometeotl；
- Tlaltecuhtli；
- archaeological evidence mapping。

## Phase 1 — Minimal Structured Bundle Slice

创建：

```text
src/content/aztec/catalog.ts
src/content/aztec/stories.ts
src/content/aztec/sources.ts
src/content/aztec/identities.ts
src/content/aztec/assets.ts
src/content/aztec/visual-tiers.ts
```

只放最小 smoke data，立即完成：

```text
registry registration
content validation
static repository read
D1 dry-run SQL
Story route
Character Detail
Graph smoke
search
sitemap
```

## Phase 2 — Existing 12 Authority Migration

- 迁入 structured catalog；
- source audit；
- identity audit；
- taxonomy；
- Canonical Design fact audit；
- static / D1 parity tests。

## Phase 3 — Cosmic Closure

- Five Suns source-aware framework；
- Teotihuacan sun creation；
- Nanahuatzin；
- Tecuciztecatl；
- Quetzalcoatl / Mictlan；
- current humanity creation。

## Phase 4 — Coatepec Closure

- Coatlicue；
- Coyolxauhqui；
- Centzon Huitznahua；
- Huitzilopochtli；
- Xiuhcoatl；
- Coatepec；
- Templo Mayor bridge。

## Phase 5 — Migration / Tenochtitlan

- Aztlan / migration traditions；
- patron deity role；
- foundation traditions；
- Sacred Precinct / Templo Mayor；
- myth-history source labels。

## Phase 6 — Sacred Realms / Ritual Order

- Mictlan；
- Tlalocan；
- New Fire；
- rain / renewal minimum bridge；
- only source-complete religious-tradition units。

## Phase 7 — Product Consumption Closure

逐项验证：

```text
Character Detail ViewModel
Name / Interpretation selector
SSR relations
Graph scope
Graph source panel
Creator context propagation
World / Scene links
Story previous / next
source notes
alias search
sitemap / JSON-LD
```

## Phase 8 — P0-A Content Closure QA

```text
npm test
npm run content:validate
npm run check / build（按当前 scripts）
D1 dry-run
static provenance audit
source audit
identity audit
visual contamination metadata audit
```

## Phase 9 — P0-B Public Release QA

```text
Tier S minimum portrait/reference
published World hero quality
published Story hero provenance
local browser smoke
production sync
production provenance audit
deployed route smoke
content accuracy review
visual anachronism review
```

## Phase 10 — P1 Visual Production

```text
Tier S desktop wallpaper
Tier S mobile wallpaper
Tier A portrait/reference
World dual-end hero enhancement
Story illustrations
style expansion
```

---

# 14. 新增 P0 验收指标

在 V1.0 Checklist 基础上增加：

```text
Aztec Registered Bundle = yes
Structured Bundle Discovery = 100%
Legacy 12 Stable ID Preservation = 100%
Stable Source ID Coverage = 100%
Required Source ID Resolution = 100%
Taxonomy Tag Resolution = 100%
Claim Subject Integrity = 100%
Interpretation Endpoint Integrity = 100%
Alternate Graph Scope Reachability = 100%
SSR Direct Relation Readability = 100%
Creator Interpretation Context Preservation = 100%
Static / Local-D1 Entity Parity = 100%
D1 Dry-run SQL = pass
Aztec-only Infrastructure Forks = 0
Unsupported Relation Type = 0
Unregistered Tradition Tag = 0
Duplicate Source Identity = 0
```

P0 Public Release 额外：

```text
Tier S minimum portrait/reference coverage = 100%
Published World usable Hero coverage = 100%
Published Story provenance-valid Hero coverage = 100%
Critical visual contamination = 0
Public prototype provenance issue = 0
Deployed core route smoke = pass
```

---

# 15. 最终建议

Aztec V1.0 不需要推翻重写。其内容研究框架已经成立。

V1.1 的真正优化方向是：

> **把它从“正确的神话研究与内容计划”，升级成“完全服从当前 MythCanvas structured-content runtime、能被 Character Detail / Graph / Creator / Search / D1 / CI 真实消费的第六个文明实施计划”。**

优先级最高的不是再追加更多神祇，而是先打通：

```text
sources.ts
+ identities.ts
+ registered bundle
+ legacy 12 structured authority
+ claim / relation / interpretation contracts
+ static / D1 dry-run parity
+ Graph / Detail product closure
```

这些完成后，再扩 Five Suns、Coatepec、Migration、Mictlan / Tlalocan 与 ritual-order 内容，返工成本会明显更低。
