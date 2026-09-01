# MythCanvas 玛雅神话完整补全方案

> 状态：Execution Plan — P0 vertical slice landed
> 版本：V1.2
> 日期：2026-09-02  
> 适用范围：玛雅神话内容建模、传统/时期分层、Story、Character、Relation / Graph、World / Scene、来源体系、视觉资产、结构化内容流水线与后续 AI 出图。  
> 相关文档：`docs/GREEK_MYTHOLOGY_COMPLETION_PLAN.md`、`docs/NORSE_MYTHOLOGY_COMPLETION_PLAN.md`、`docs/NORSE_CHARACTER_DETAIL_GRAPH_INTEGRATION_PLAN.md`、`docs/JAPANESE_MYTHOLOGY_COMPLETION_PLAN.md`、`docs/EGYPTIAN_MYTHOLOGY_COMPLETION_PLAN.md`、`docs/CONTENT_POSITIONING.md`、`docs/CHARACTER_ART_SYSTEM.md`、`.agents/skills/mythcanvas-content-model/SKILL.md`

---

# 0. Review 结论

V1.0 的核心方向成立，而且玛雅相比希腊 / 北欧 / 日本 / 埃及，更需要把 **Tradition / Period / Evidence** 放在内容建模前面：

- 不建立一个虚构的 Pan-Maya 统一神系；
- `Popol Vuh` 首先按 K'iche' 传统处理；
- Classic Lowland、Postclassic Codices、Colonial Yucatec 不自动互相回填；
- Seven Macaw、Maize God、Ix Chel、Death God、Feathered Serpent 等高风险身份不强行 `same-as`；
- World 少、Scene 多；
- Visual DNA 按时期 / 地区控制，严格防 Aztec / Mexica 污染；
- 不新增 Maya-only importer。

这些原则全部保留。

但对照已经实施的 Greek V1.1、Norse Completion + Graph Integration，以及最新 Japanese / Egyptian V1.1 后，V1.0 仍有 **10 个必须修正的问题**。

## 0.1 V1.1 的十个修正

### 1. 删除“36 个 unit”硬 KPI

V1.0 同时写了：

```text
Core Narrative / Mythic-Ritual Units >= 36
Core Narrative / Mythic-Ritual Units = 36 / 36
```

这与 Greek / Japanese 最新的 Dependency Closure 原则冲突，也会诱导把 Xibalba 一段连续叙事拆成很多低价值页面。

V1.1 改为：

> **Core Narrative Coverage = 100%，Story 数量是 Narrative Unit Quality Gate Review 后的结果，不是目标。**

`Popol Vuh` 主线仍按 V1.0 的 32 个事件节点作为 dependency manifest 草案，但不要求 32 个节点都成为独立 Story URL。

### 2. P0 内容完整度与 P1 壁纸生产拆开

V1.0 把 Tier S：

```text
portrait 100%
PC wallpaper >= 1
Mobile wallpaper >= 1
```

写进 P0 验收，过重。

V1.1 对齐 Greek / Japanese / Egyptian：

```text
P0 = 来源 + Narrative Coverage + Dependency Closure + Relation + Canonical Design + 最低可用视觉
P1 = Tier S / A 正式 Portrait、PC / Mobile Wallpaper、World / Scene 高质量视觉扩展
```

P0 不再因为几十张图未生产完成而阻塞内容宇宙上线。

### 3. Canonical Design 严格复用当前通用字段

V1.0 提议的：

```text
identityAnchors
traditionScope
periodScope
sacredObjects
sourceScopedFacts
iconographicEvidence
interpretationNotes
```

不属于当前 `CanonicalDesign`。

V1.1 只使用：

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

来源差异进入：

```text
ContentClaim
Character.sourceRefs / sourcePeriods
CharacterInterpretation
CharacterName
CharacterRelation.sourceRefs / traditionScope
```

不为玛雅单独扩一套 Canonical Design Schema。

### 4. 不创建当前 Schema 不支持的 Story kind / Dossier 实体

V1.0 提议：

```text
mythic-dossier
ritual-tradition
astronomical-tradition
```

当前 `MythStoryKind` 只支持：

```text
myth
folk-legend
religious-tradition
literary-fantasy
```

V1.1 规则：

- 连续神话叙事使用 `myth`；
- Codex / ritual / astronomy 中能独立回答用户问题的内容，可使用 `religious-tradition`；
- 纯身份研究不伪装成 Story，优先进入 Character / Interpretation / ContentConcept / ContentClaim；
- 若未来确实需要通用 `Dossier` 页面，必须作为跨文明产品 / Schema 能力单独评审，不在 Maya package 私造类型。

### 5. `periodScope / evidenceLevel` 不作为 Maya-only 字段

当前：

- `Character.sourcePeriods` 已能表达角色来源时期；
- `SourceRef.period` 已能表达证据时期；
- `CharacterRelation.confidence = high | medium | contested` 已能表达对应置信度；
- `ContentClaim.status = supported | contested | editorial-synthesis` 已能表达编辑判断。

因此 V1.1 不要求直接新增：

```text
periodScope
evidenceLevel
```

若后续产品确认需要统一的 period filter / evidence classification，必须提成跨 Greek / Norse / Japanese / Egyptian / Maya 的 Generic Schema Proposal。

### 6. Tradition Membership 不是 Character Relation

V1.0 把：

```text
K'iche' Popol Vuh
Classic Lowland
Postclassic Codical
Colonial Yucatec
```

列为 Graph Relation 一类。

V1.1 修正为：

```text
Character.traditionTags
Character.sourcePeriods
Story.tradition
SourceRef.period
Taxonomy / editorial collection
```

Graph 可以按这些 metadata 筛选，但不要生成“角色 -> K'iche'”这种伪人物关系边。

### 7. Identity Dossier 与 Character 必须分开

V1.0 Tier S 把 Character 和“身份问题”混成 16 个视觉对象，例如：

```text
Goddess O / Chak Chel / Ix Chel scoped identity
Death God / God A / Kisin scoped identity
```

V1.1 先做 Identity Resolution，再决定实体形态：

```text
确定是同一稳定身份
→ 1 Character + CharacterInterpretation / CharacterName

只有学术对应或证据仍有争议
→ 独立 Character / ContentConcept + source-scoped correspondence Relation
```

Tier S 只列“已通过 Identity Gate 的 Character”，不把研究问题当 Character。

### 8. P0 不应只剩 Popol Vuh + 4 个 Classic 条目

V1.0 的“完整定义”强调用户能进入 Classic 与 Postclassic / Yucatec，但 P0 实际把 Postclassic / Yucatec 全部推到 P0.5，同时 Tier S 又提前包含 Itzamna、Ix Chel、K'uk'ulkan 等角色，内部不一致。

V1.1 改成 **P0 Coverage Matrix**：

1. K'iche' / `Popol Vuh` 主叙事闭包；
2. Classic Lowland 核心 identity / iconography bridge；
3. Postclassic Codex 最低 sacred-order bridge；
4. Colonial Yucatec 只用于名称 / 身份追溯，不强行回填古典期。

P0 不要求四条线等量，但不能让“Maya Mythology”最终等同“Popol Vuh Mythology”。

### 9. Relation Storage 对齐 Greek / Norse / Japanese

不同时存：

```text
parent + child
defeats + defeated-by
creator + created-by
```

同一事实只存一个 canonical direction，通过 UI 从当前人物视角反向展示。

关系唯一性继续使用：

```text
assertionKey + traditionScope
```

对应关系直接复用：

```text
relationType
sourceRefs
confidence
traditionScope
isDefault
```

不新增平行关系系统。

### 10. P0 必须补 static fallback / D1 / Graph / CI parity

Maya 不能只做到：

```text
src/content/maya/*
→ sync D1
```

P0 必须满足：

```text
static fallback
local D1
production D1
```

三种形态内容语义一致，并进入：

- Character Detail；
- SSR Relations；
- Graph API；
- Mythology page；
- Story detail；
- sitemap；
- validator；
- deploy sync；
- provenance audit。

这也是 Norse Integration Review 已明确暴露的 Greek-only 基础设施问题。

---

# 1. 当前仓库基线与不可破坏约束

当前主干已经存在：

```text
myth-maya
slug = maya
```

以及入口级 Visual DNA：

```text
palette: 玉石绿 / 石灰岩灰 / 热带绿 / 天青
motifs: 世界树 / 阶梯神庙 / 星历 / 玛雅文字
materials: 石灰岩 / 玉石 / 木 / 灰泥
atmosphere: 宇宙感 / 热带 / 古老 / 神秘
```

但还没有正式：

- Maya Character closure；
- Maya World closure；
- Maya Scene network；
- Maya Story manifest；
- Maya relation graph；
- Maya source manifest；
- Maya canonical design；
- Maya production artwork。

## 1.1 Stable ID Policy

`myth-maya / maya` 必须保留。

因为当前尚无公开 Maya Character / World / Story URL，本轮可以一次性建立正确 ID 规范：

```text
character-<stable-ascii-name>
world-<stable-ascii-name>
scene-<stable-ascii-name>
story-<stable-ascii-name>
```

发布后不因后续拼写偏好变化修改 URL。

## 1.2 Tagline 纠偏

当前：

> 世界树与西巴尔巴

容易把 Xibalba 表述成整个玛雅文明唯一地下世界专名。

建议改成更中性的：

> **玉米 · 星辰 · 地下世界**

或未来支持 tradition-aware tagline 后动态展示。

---

# 2. “完整”的统一定义

玛雅神话的完整不等于：

- 收录所有已知神名；
- 做一套“玛雅十二主神”；
- 拼出一张统一神谱；
- 用一份后世整理的 13 天界 / 9 冥界图解释所有地区和时期。

MythCanvas P0 的用户侧完整定义是：

> 用户能够连续理解 K'iche'《Popol Vuh》的创世、失败的人类、Seven Macaw、Hero Twins、Xibalba、玉米造人与第一次黎明；同时能够识别 Classic Maya 的玉米、雨、闪电 / 王权、太阳、神山 / 洞穴等核心神圣意象，并能进入 Postclassic Codex / Yucatec 关键身份与仪式传统，且页面明确告诉用户哪些内容属于同一传统、哪些只是跨时期可能对应。

## 2.1 P0 Coverage Matrix

### A. K'iche' Narrative Coverage

必须覆盖：

```text
Creation
→ Animals
→ Failed Humans
→ Seven Macaw cycle
→ First Ballplayers
→ Hero Twins
→ Xibalba
→ Maize Humanity
→ First Dawn
```

### B. Classic Lowland Bridge

至少覆盖：

```text
Maize God
K'awiil
Chaak
Solar deity / K'inich Ajaw
Witz / cave / watery-underworld imagery
```

不要求每项都创建 Story URL。

### C. Postclassic Codex Bridge

至少覆盖：

```text
Chaak / rain almanac tradition
old deity / God D identity evidence
aged female deity / Goddess O identity evidence
death deity tradition
Venus / calendar / ritual evidence as source context
```

### D. Colonial Yucatec Identity Bridge

用于：

```text
Itzamna naming / identity evidence
Ix Chel related naming / identity evidence
Kisin / death-deity naming
Bacabs / directional beings
ritual / healing terminology
```

规则：

> Colonial witness 可以帮助理解后期名称和传统，但不得静默覆盖 Classic Maya 身份。

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
Conflicting Identity Forced Merge = 0
Duplicate Canonical Relation = 0
Invalid Relation Target = 0
Orphan Entity Reference = 0
Critical Aztec/Maya Visual Contamination = 0
Fake Readable Glyph Claim = 0
```

明确不设：

```text
Story = 36
Character >= 50
Relation >= 150
World = N
```

## 2.3 P1

- Tier S / Tier A 正式 production portrait；
- Tier S PC + Mobile wallpaper；
- 核心 World / Scene desktop + mobile Hero；
- Story illustration 深化；
- Character Graph 高级 period / tradition filter；
- Identity correspondence 高级 UI；
- SEO / alias / transliteration 深化；
- provenance audit 清零。

## 2.4 P2

- 更多 Classic identity reconstruction；
- site-specific mythic programs；
- K'iche' migration / lineage history；
- Chilam Balam creation cycles；
- Ritual of the Bacabs healing cosmology；
- Bacabs / directional cosmology 深化；
- regional Maya traditions；
- living Maya traditions，作为独立 living-tradition layer。

Living tradition 不与古代材料静默混合，也不把现代社区当成“古文明残片”展示。

---

# 3. 来源体系与 Evidence Policy

玛雅资料与希腊 / 北欧最大的差异，是大量核心内容并不来自一部连续叙事文本。

资料横跨：

```text
Preclassic
Classic
Postclassic
Colonial
Modern scholarship
```

以及：

```text
K'iche' Highlands
Southern / Central Lowlands
Northern Yucatán
其他地区与语言群
```

因此必须区分“来源是什么”和“编辑如何解释来源”。

## 3.1 Tier 1A — K'iche' `Popol Vuh`

P0 最完整的连续 Story spine。

规则：

- 明确 K'iche' tradition；
- 现存文本属于殖民初期字母记录传统；
- 不包装成全体 Maya 的统一 Canon；
- 每篇 Story 记录具体 edition / translation / locator；
- 不跨多个译本静默拼接专名与细节。

建议 tradition tag：

```text
kiche-popol-vuh
```

## 3.2 Tier 1B — Classic Maya 直接证据

优先回落到具体：

```text
monument
stela
lintel
altar
painted vessel
mural
architectural program
glyphic inscription
funerary / royal context
```

这些证据可以支持：

- deity identity；
- iconographic anchor；
- ritual action；
- royal legitimacy；
- cosmological imagery；
- 可能的 mythic sequence。

但不要把图像学重建伪装成“失传神话全文”。

## 3.3 Tier 1C — Postclassic Codices

核心包括：

- Dresden Codex；
- Madrid Codex；
- Paris Codex；
- Maya Codex of Mexico。

重点用于：

- rain / Chaak almanacs；
- deity iconography；
- ritual cycles；
- calendar patrons；
- astronomy / Venus；
- directional / New Year material。

它们不是现代意义的“故事书”。只有能够形成独立用户问题与独立来源价值的内容才创建 `MythStory(kind='religious-tradition')`。

## 3.4 Tier 1D — Indigenous Colonial Texts

包括：

- Books of Chilam Balam；
- Ritual of the Bacabs；
- 其他可明确定位的 Yucatec / Maya language records。

用途：

- deity names；
- ritual language；
- healing；
- directional cosmology；
- identity continuity / discontinuity evidence。

## 3.5 Tier 2 — Colonial External Witness

例如 Diego de Landa 等接触期西班牙记录。

规则：

- 作为 historical witness；
- 明确观察者身份与时期；
- 不与 indigenous text / pre-contact object 自动设为同等级身份事实；
- 不能单独承担高风险跨时期 `same identity` 结论。

## 3.6 Tier 3 — Academic Secondary

用于：

- epigraphy；
- iconography；
- object identification；
- language normalization；
- identity correspondence；
- period / site context；
- scholarly dispute。

现代研究结论进入：

```text
ContentClaim.status = supported | contested | editorial-synthesis
```

不伪装成 ancient primary claim。

## 3.7 SourceRef 直接复用当前 Schema

优先使用当前：

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

例如一个 Classic vessel 可以写成：

```text
title = 具体器物 / catalog identity
section = iconographic scene / glyph block
period = Classic Maya
locator = museum / corpus locator
url = stable object page
note = object context
```

V1.1 不先扩 `objectId / site / evidenceLevel / periodScope` 等 Maya-only 字段。

若真实数据证明通用 `SourceRef` 不够，再提交 Generic SourceRef Schema Review。

---

# 4. Name / Translation / URL Policy

玛雅补全必须提前解决专名不稳定问题，否则 Character ID、SEO 与来源对照会在第二轮全部返工。

## 4.1 Primary Display Name

每个 Character / Story 在 Source Manifest 中确定：

```text
primary display name
nameEn
source-language form
legacy scholarly spelling
common English spelling
Chinese display name
```

例如同一名字在不同译本中出现拼写差异时，不通过改 URL 解决。

## 4.2 CharacterName

复用当前：

```text
primary
alias
title
literary-identity
```

所有 alias 必须带 `sourceRefs` 与 `confidence`。

## 4.3 URL

URL 使用稳定 ASCII slug，避免：

- K'iche' glottal mark；
- Unicode apostrophe；
- 后续正字法变化；
- 不同译本拼法

导致公开 URL 改动。

显示名称可以进化，slug 不变。

---

# 5. Identity Resolution Policy

这是 Maya V1.1 最关键的数据治理规则。

## 5.1 先决定“一个 Character 还是两个 Character”

判断顺序：

```text
A. 是否存在稳定、可来源化的同一身份？
   YES → 同一 Character

B. 来源差异是否只是名称 / 视觉表现 / 某时期神职差异？
   YES → CharacterName / CharacterInterpretation

C. 是否只是学术可能对应、图像类似或后世 cognate？
   YES → 独立 Character / ContentConcept + correspondence Relation

D. 证据不足？
   → 不合并，保持 contested
```

原则：

> **错误地多建两个实体，比错误地把两个历史身份永久合并成一个实体更容易修正。**

## 5.2 Seven Macaw / Principal Bird Deity

默认：

```text
Seven Macaw = K'iche' Popol Vuh Character
Principal Bird Deity = Classic Maya identity
```

不默认同一 Character。

如建立 correspondence：

```text
relationType = iconographic-analogue / possible-equivalence
confidence = contested | medium
traditionScope = explicit
sourceRefs != empty
```

具体 relationType 最终从通用关系 vocabulary Review 中选择，不为了一个 case 新增专属枚举。

## 5.3 Hun Hunahpu / Classic Maize God

默认独立。

可以：

- 在 Character Detail 解释学术比较；
- 建 source-scoped correspondence；
- 在 Story / visual explanation 中提示连续母题。

不能：

```text
Hun Hunahpu.variant = Classic Maize God
```

## 5.4 Q'uq'umatz / K'uk'ulkan / Quetzalcoatl

至少区分：

```text
Q'uq'umatz -> K'iche' tradition
K'uk'ulkan -> Yucatec Maya tradition
Quetzalcoatl -> Central Mexican tradition
```

不做 alias。

跨文明 relation 可以在 P1 单独做 Mesoamerican correspondence，不阻塞 Maya P0。

## 5.5 Goddess O / Chak Chel / Ix Chel / Goddess I

V1.1 不提前承诺：

```text
Goddess O = Chak Chel = Ix Chel
```

也不把 youthful Goddess I 自动并入 Ix Chel。

实施前必须完成 Identity Gate：

1. Codex evidence；
2. Colonial naming evidence；
3. academic correspondence；
4. stable visual anchors；
5. 现代流行形象污染检查。

若不能稳定合并，保持多个实体 / Interpretation，并让用户看到 contested scope。

## 5.6 Death God / God A / Kisin / Yum Kimil

不使用一个无 scope 的 `Ah Puch` 统包所有死亡神。

同样走 Identity Gate：

```text
stable iconographic identity
+ scoped names
+ source periods
+ aliases
```

## 5.7 God D / Itzamna

不因为现代百科常见写法就无条件把所有 Old God D 图像与殖民时期 Itzamna 描述合并成一套稳定视觉。

先 source review，再决定：

```text
1 Character + Interpretations
or
separate identities + correspondence
```

---

# 6. Story Manifest — 从“事件清单”改为“可独立阅读的叙事单元”

V1.0 的 32 个 `Popol Vuh` 节点保留为 dependency checklist，但 V1.1 不要求每个节点成为 Story。

## 6.1 Narrative Unit Quality Gate

一个 P0 Story URL 必须同时满足：

1. 能独立回答一个明确用户问题；
2. 有独立的叙事起点 / 冲突 / 结果，或明确 ritual / religious subject；
3. 至少一个可定位 primary source；
4. 不只是上一 Story 的 1–2 个段落；
5. 有独立 Character / Scene / Concept 浏览价值；
6. 不为了凑数量拆页。

因此最终 Story 数量允许：

```text
18
21
24
...
```

只要 Core Narrative Coverage = 100%。

## 6.2 Volume A — Creation & False Radiance

建议 Story units：

1. 原初寂静与创造者；
2. 大地与动物的创造；
3. 泥土人的失败；
4. 木头人的失败与毁灭；
5. Seven Macaw 的虚假光辉；
6. Hero Twins 击败 Seven Macaw；
7. Zipacna 与四百少年；
8. Zipacna / Cabrakan cycle，按实际 source review 决定合并或拆分。

依赖节点仍完整记录：

- primordial water；
- emerging earth；
- animals；
- mud people；
- wood people；
- Seven Macaw；
- Zipacna；
- Cabrakan。

## 6.3 Volume B — Ballgame & Xibalba

建议 Story units：

1. 第一代球员与 Xibalba 的召唤；
2. 第一代球员之死与葫芦树；
3. Xquic 的受孕与逃离；
4. Hunahpu / Xbalanque 的出生与成长；
5. Monkey Brothers cycle；
6. Hero Twins 再赴 Xibalba；
7. 道路、假诸王与试炼之屋；
8. Bat House 与球赛反转；
9. Twins 的死亡、复生与表演；
10. Xibalba Lords 的失败与 Hero Twins 主线收束。

Trial Houses 优先建一个 Story + 多 Scene，不一屋一 Story。

## 6.4 Volume C — Maize Humanity & Dawn

建议 Story units：

1. 白玉米与黄玉米创造真正的人类；
2. 第一批人的完美视野与限制；
3. 第一批人的伴侣与繁衍；
4. Tohil / Awilix / Jacawitz 与火；
5. 第一次黎明。

K'iche' migration / lineage history 默认 P1 / P2，不阻塞神话主干。

## 6.5 Classic / Codex 内容不伪造成“连续古典故事”

以下优先作为：

```text
Character
ContentConcept
ContentClaim
CharacterInterpretation
religious-tradition Story（仅当可独立回答用户问题）
```

候选主题：

- Maize God death / emergence imagery；
- K'awiil 与王权；
- Chaak 与雨 / 雷；
- solar deity / K'inich Ajaw；
- Witz / cave / watery-underworld；
- Chaak rain almanacs；
- Venus / calendrical sacred order。

不要创建当前 Schema 不支持的 `mythic-dossier`。

---

# 7. Character Dependency Closure 与 Stable Type

## 7.1 统一 Stable Character Type

严格复用 Greek / Norse：

```text
deity
hero
mortal
monster
creature
collective
```

不新增 Maya-only：

```text
creator-god
codex-god
underworld-lord
ancestral-being
calendar-deity
```

这些进入：

```text
traditionTags
editorialCollections
role
ContentClaim
```

## 7.2 P0 Character Closure

最终 Character 数量由 Story / identity dependency report 生成。

高概率核心包括：

### K'iche' Narrative

- Hunahpu；
- Xbalanque；
- Xquic / source-reviewed primary name；
- Hun Hunahpu；
- Vucub Hunahpu；
- Seven Macaw；
- Zipacna；
- Cabrakan；
- Hun Batz；
- Hun Chouen；
- Xmucane；
- Xpiyacoc；
- creator figures，按选定 edition；
- Xibalba Lords，按 dependency 决定 individual / collective；
- Tohil；
- Awilix；
- Jacawitz。

### Classic / Postclassic Bridge

- Maize God；
- K'awiil；
- Chaak；
- solar deity / K'inich Ajaw；
- God D / Itzamna identity，Identity Gate 后决定；
- Goddess O / Chak Chel / Ix Chel identity，Identity Gate 后决定；
- Death deity identity，Identity Gate 后决定；
- K'uk'ulkan，若进入 P0 bridge dependency。

## 7.3 Collective 使用规则

不要因为 Xibalba Lords 名称多就全部强制建 Character。

如果一个个体：

- 在多个 Story 复用；
- 有独立关系；
- 有独立视觉 / SEO / Character Detail 价值；

则实体化。

否则允许：

```text
characterType = collective
```

以群体角色承载。

---

# 8. Character Relation / Graph

## 8.1 直接复用当前 Schema

```text
assertionKey?: string
traditionScope?: string
isDefault?: boolean
sourceRefs: SourceRef[]
confidence: high | medium | contested
fromInterpretationId?: string
toInterpretationId?: string
```

不新增 `evidenceLevel`。

## 8.2 Canonical Relation Storage

### parent

只存：

```text
parent -> child
```

UI 从当前人物视角显示“父母 / 子女”。

### symmetric relations

例如：

```text
sibling
ally
rival
```

只存一次。

### directional narrative relations

例如：

```text
defeats
creates
rules
serves
```

只存 canonical direction，不同时存 inverse。

## 8.3 Correspondence Relation

当两个实体没有足够证据合成一个 Character 时，允许 source-scoped correspondence：

```text
possible-equivalence
iconographic-analogue
later-cognate
motif-continuity
```

但具体 vocabulary 必须进入 Generic Relation Vocabulary Review。

规则：

```text
sourceRefs != empty
confidence != implicit
traditionScope != empty when needed
assertionKey != empty for contested alternatives
```

## 8.4 Tradition Membership 不建边

使用：

```text
Character.traditionTags
Character.sourcePeriods
Story.tradition
Taxonomy
```

Graph filter 读取 metadata。

## 8.5 Default / Alternate Graph

默认图只展示：

- stable narrative relations；
- neutral relations；
- source-reviewed default identity correspondence。

contested correspondence：

- 默认不伪装成确定关系；
- 用户展开详情后显示；
- 必须有来源和 confidence。

## 8.6 SSR 文本回退

3D Graph 不得成为唯一关系入口。

Character Detail SSR 至少显示：

```text
身份
传统 / 时期
父母 / 子女 / 兄弟
盟友 / 对手
关键叙事关系
可能身份对应
来源 / 争议说明
```

---

# 9. World / Scene Semantics

延续 Greek / Norse / Japanese：

> World = 稳定神话空间层；Scene = 可复用的具体地点、建筑、边界或事件空间。

## 9.1 Xibalba

`world-xibalba` 是 P0 World 候选。

但当前 `World` Schema 没有 `traditionScope` 字段，因此不能直接写：

```text
world.traditionScope = kiche-popol-vuh
```

V1.1 使用：

```text
World identity ContentClaim
+ traditionScope = kiche-popol-vuh
+ sourceRefs
+ K'iche' Story linkage
```

同时在 summary / source UI 明确：

> Xibalba 是 `Popol Vuh` / K'iche' 传统中的地下世界名称，不作为所有 Maya underworld imagery 的统一专名。

如果未来所有 World 都需要来源时期 / tradition metadata，再做 Generic World Schema Review。

## 9.2 不创建统一宇宙地图

P0 禁止直接硬编码：

```text
13 heavens
9 underworlds
one universal world tree
one universal Maya heaven
one universal Maya underworld
```

具体数字 / 方向 / cosmological scheme 可以作为 source-scoped ContentConcept / Story / Claim。

## 9.3 P0 Scene 候选

### Popol Vuh

- primordial dark water；
- emerging earth；
- Seven Macaw tree；
- ballcourt；
- calabash tree；
- road to Xibalba；
- Xibalba council；
- trial houses；
- Bat House；
- maize creation place；
- first dawn highlands。

### Classic

- Witz sacred mountain；
- cave / earth-monster portal；
- watery-underworld imagery；
- maize emergence；
- K'awiil royal vision；
- Chaak rain / mountain opening；
- solar path；
- cosmic tree imagery。

### Postclassic / Yucatán

- codex ritual space；
- cenote / cave ritual；
- rain almanac context；
- Venus / sky ritual imagery；
- directional / New Year context。

实体化标准：

> 至少被一个 P0 Story / Character Detail / Artwork 强依赖，或具有高复用视觉价值。

---

# 10. Maya Visual DNA V2

## 10.1 Base Visual DNA

当前 `VisualDNA` 只有：

```text
palette
motifs
materials
atmosphere
```

P0 先升级 base：

```text
palette:
- jade green
- limestone white / grey
- Maya blue
- cacao / earth brown
- restrained red
- obsidian black

motifs:
- maize
- quetzal
- ballgame
- cave / mountain portal
- celestial bands
- jade regalia
- source-reviewed glyph motifs

materials:
- limestone
- stucco
- jade
- shell
- obsidian
- wood
- bark paper

atmosphere:
- sacred
- astronomical
- humid-lowland / highland where scoped
- courtly
- liminal
- ancient
```

## 10.2 Tradition-specific Visual Guides

不直接给 `Mythology.visualDna` 私加 nested schema。

优先通过：

```text
Character.traditionTags
Character.sourcePeriods
Scene / Character CanonicalDesign
prompt context
src/content/maya visual guide data
```

约束三大视觉域。

### K'iche' Highlands

- volcanic highlands；
- cloud forest；
- maize fields；
- mountain dawn；
- dark cave / ballcourt；
- quetzal feather as scoped motif；
- 不复制现代具体社区服饰纹样当“古代统一服装”。

### Classic Lowlands

- limestone palace / temple；
- stucco façade；
- roof comb；
- stela；
- polychrome ceramic；
- jade / shell / obsidian；
- courtly regalia；
- cacao / maize / quetzal。

### Postclassic Yucatán / Codical

- bark-paper palette；
- black / red linework；
- Maya blue；
- cenote；
- dry tropical Yucatán；
- astronomical / calendrical composition；
- site architecture only when period / region matches。

如果后续多个文明都需要 `TraditionVisualProfile`，再把它提升为 Generic Schema。

## 10.3 Anti-contamination

所有 Maya generation 默认禁止：

- Aztec Sun Stone / Calendar Stone；
- Templo Mayor；
- Huitzilopochtli / Coatlicue 专属造型；
- Mexica eagle-serpent national iconography；
- 把 Teotihuacan 当作“Maya capital”；
- 所有角色统一巨大羽毛冠；
- 所有建筑统一 Chichén Itzá；
- generic jungle pyramid fantasy；
- modern New Age “Mayan astrology” 反写古代事实；
- modern franchise-specific silhouette。

## 10.4 Glyph Policy

```text
装饰视觉：可使用 non-semantic glyph-like texture，但不得宣称可读
教育 / Story 关键图：使用经过核对的具体 glyph，或不出现文字
UI：不使用 AI 生成 glyph 代替真实 Maya script
```

验收：

```text
Fake Readable Glyph Claim = 0
```

---

# 11. Canonical Design

每个 P0 Character 至少使用当前字段：

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

## 11.1 来源事实不塞进新字段

例如：

```text
某 visual anchor 只见于 Classic vessel
某 identity mapping 仅是 contested scholarship
某名字只见于 Colonial source
```

进入：

```text
ContentClaim
SourceRef
CharacterInterpretation
CharacterName
```

而不是新造：

```text
sourceScopedFacts
iconographicEvidence
interpretationNotes
```

## 11.2 Hero Twins

稳定锚点优先来自所选 `Popol Vuh` edition / narrative：

- blowgun / hunting；
- ballgame；
- Xibalba trials；
- paired but distinguishable protagonists。

避免：

- 直接复制现代游戏 / 动画；
- 把某一组 Classic youthful deity imagery 宣称为唯一正典 Hero Twins 外观；
- 两人完全镜像导致身份不可辨。

## 11.3 Chaak

优先来源化：

- rain / storm；
- axe / lightning association；
- period-specific facial traits；
- Classic / Codex visual evidence。

避免：

- 画成 Aztec Tlaloc；
- 所有 long-nosed deity = Chaak；
- generic blue thunder god。

## 11.4 Maize God

强制区分：

```text
Classic Maize God iconography
vs
Popol Vuh Hun Hunahpu
```

不能互相自动继承 hairstyle / costume / death-rebirth event。

## 11.5 Ix Chel related identity

在 Identity Gate 完成前，不先生产一个“年轻性感月亮女神”作为唯一 canonical portrait。

先解决：

- stable identity；
- source period；
- Goddess O / Goddess I 边界；
- Colonial name evidence；
- modern-popular interpretation。

---

# 12. Structured Content Pipeline

目标内容包：

```text
src/content/maya/
├── catalog.ts
├── stories.ts
├── sources.ts
├── names.ts
├── identities.ts
├── claims.ts
├── assets.ts
├── visual-tiers.ts
└── index.md
```

不要求每个文件都一定存在；以通用 registry 能注册为准。

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

禁止：

```text
scripts/sync-maya-content.mjs
repository if mythologyId === 'myth-maya'
Maya-only graph API
Maya-only source parser
```

## 12.1 Validator

必须覆盖：

```text
Story required dependency closure
Story primary source coverage
Character stable identity source coverage
CharacterName source coverage
Relation source coverage
assertionKey + traditionScope uniqueness
invalid inverse duplicate relation
Character / World / Scene dangling ids
invalid source ids
alias collision
stable slug
CanonicalDesign required fields
wrong mythology linkage
production artwork provenance
```

Maya 额外规则应尽量配置化，而不是 `if (maya)`：

```text
required tradition tag policy
source period coverage policy
identity correspondence confidence policy
wrong-tradition World / Story linkage policy
```

## 12.2 Static / D1 Parity

P0 必须验证：

```text
static fallback
local D1
production D1
```

以下查询结果核心语义一致：

- mythology characters；
- character detail；
- relations；
- content concepts；
- Story dependencies；
- World / Scene；
- Graph neighborhood。

## 12.3 CI / Deploy

CI 至少包含：

```text
content:validate maya
unit tests
Astro build / typecheck
local D1 migration / sync test
Graph relation tests
sitemap route test
provenance audit
```

production deploy 前使用同一 generic sync pipeline。

---

# 13. Character Detail / Graph 产品集成

## 13.1 P0 Character Detail

每个 P0 Character 至少可读：

```text
Identity
Tradition tags
Source periods
Aliases / names
Canonical facts
Symbols
Story appearances
World / Scene affinity
Relations
Interpretations
Source-scoped correspondence
Canonical Design
Sources
```

## 13.2 Identity Boundary 是内容能力，不先变成新实体类型

对以下高风险对象必须在详情页显式解释边界：

- Seven Macaw / Principal Bird Deity；
- Hun Hunahpu / Maize God；
- Q'uq'umatz / K'uk'ulkan；
- God D / Itzamna；
- Goddess O / Chak Chel / Ix Chel / Goddess I；
- Death God / Kisin related names。

P0 可以先用：

```text
SSR section
ContentClaim
Interpretation
Relation source detail
```

实现。

不要求先新增一个 Maya-only `IdentityCard` entity。

## 13.3 Graph

P0 要求：

- source-scoped relation 不丢失；
- contested correspondence 不伪装成确定 family edge；
- tradition filter 能读取 metadata；
- 图谱不可用时 SSR relation fallback 完整。

高级 period filter / correspondence visualization 可进入 P1，但数据模型 P0 必须准备好。

---

# 14. Visual Production — P1，不阻塞内容 P0

## 14.1 P0 最低视觉

P0 只要求：

- `myth-maya` 非空白 hero；
- P0 Character 有可用 symbol / portrait fallback；
- P0 Story 有不错误复用传统的 Hero Asset；
- `world-xibalba` 若上线，有最低可用 Hero；
- provenance metadata 完整。

## 14.2 P1 Tier S

Identity Gate 完成后确定 Tier S。

建议优先候选：

### K'iche'

- Hunahpu；
- Xbalanque；
- Xquic；
- Seven Macaw；
- Q'uq'umatz；
- Huracán / Heart of Sky，Identity Review 后；
- Xmucane。

### Classic / Postclassic

- Maize God；
- Chaak；
- K'awiil；
- solar deity / K'inich Ajaw；
- God D / Itzamna，Identity Gate 后；
- Goddess O / Chak Chel / Ix Chel，Identity Gate 后；
- K'uk'ulkan；
- Death deity，Identity Gate 后。

最终名单不是固定 16 人，而由：

```text
P0 dependency importance
+ user recognition
+ visual distinctiveness
+ identity confidence
```

共同决定。

Tier S P1：

```text
production portrait = 100%
PC wallpaper >= 1
Mobile wallpaper >= 1
canonical source / period QA = 100%
```

## 14.3 World / Scene P1

- Xibalba desktop + mobile；
- Hero Twins ballcourt；
- road to Xibalba；
- Bat House；
- maize creation；
- first dawn；
- Classic maize emergence；
- Chaak storm；
- Witz / cave portal。

---

# 15. 实施批次

## Batch 0 — Generic Pipeline / Schema Alignment

1. 落地 generic mythology registry；
2. 落地 generic validator / sync；
3. 清理 Greek-only repository fallback；
4. 确认 Character / Relation / ContentClaim / Interpretation 足够承载 Maya；
5. 不直接新增 Maya-only `periodScope / evidenceLevel / dossier kind`；
6. 建 `src/content/maya/` 注册入口。

**DoD**：Maya 内容可以在 static fallback / local D1 / production D1 使用同一数据语义。

## Batch 1 — Source / Name Manifest

1. 建 `Popol Vuh` edition / translation policy；
2. 建 Classic object / inscription source registry；
3. 建 Codex source registry；
4. 建 Colonial Yucatec source registry；
5. 定 Character primary name / alias / slug policy；
6. 输出 high-risk identity checklist。

**DoD**：所有 P0 计划实体都有明确 source lane，不使用“玛雅神话资料”这种无法定位的来源。

## Batch 2 — Story Manifest + Quality Gate

1. 将 V1.0 32 个 Popol Vuh 节点转成 dependency checklist；
2. 按 Narrative Unit Quality Gate 合并成真正 Story Manifest；
3. 每篇 Story 声明 requiredCharacterIds / requiredWorldIds / requiredSceneIds / requiredSourceIds；
4. 每篇绑定至少一个 primary source；
5. 输出 Core Narrative Coverage report。

**DoD**：Story 数量可以变化，但 K'iche' 主线 Coverage = 100%。

## Batch 3 — Character / Relation Closure

1. 创建所有 P0 Story required Character；
2. 使用通用 stable character type；
3. Xibalba Lords 按 dependency 决定 individual / collective；
4. 创建 source-scoped relations；
5. 建 assertion uniqueness；
6. inverse duplicate relation = 0。

**DoD**：P0 Story Character dangling = 0；Graph 不需要借 Classic identity 给 Popol Vuh 补洞。

## Batch 4 — World / Scene Closure

1. Review `world-xibalba` World semantics；
2. 用 ContentClaim 明确 K'iche' scope；
3. 建 Popol Vuh Scene network；
4. 建 Classic Witz / cave / watery-underworld Scene；
5. 禁止 universal 13+9 map。

**DoD**：Story 空间语义清晰，不把所有 underworld scene 绑定 Xibalba。

## Batch 5 — Classic / Postclassic / Yucatec Bridge

1. Maize God identity；
2. K'awiil；
3. Chaak；
4. solar deity；
5. Witz / cave concepts；
6. God D / Itzamna Identity Gate；
7. Goddess O / Ix Chel Identity Gate；
8. Death deity Identity Gate；
9. Codex rain / Venus / ritual source context；
10. Colonial aliases / identity evidence。

**DoD**：Maya landing 不等于 Popol Vuh landing；跨时期 identity 无 forced merge。

## Batch 6 — Canonical Design / Visual DNA V2

1. Base Visual DNA；
2. K'iche' visual guide；
3. Classic visual guide；
4. Postclassic / Yucatán visual guide；
5. P0 Character Canonical Design；
6. anti-Aztec rules；
7. glyph rules；
8. prompt context 接 traditionTags / sourcePeriods。

**DoD**：CanonicalDesign 使用通用字段；随机 prompt 不稳定产出泛 Aztec / jungle-pyramid imagery。

## Batch 7 — Product Integration

1. Mythology landing tradition lanes；
2. Story volumes；
3. Character Detail source section；
4. SSR relation fallback；
5. Character Graph scoped relation；
6. static fallback / D1 parity；
7. sitemap；
8. SEO aliases；
9. accessibility / mobile / performance baseline。

**DoD**：P0 Character / Story / Relation 在 static、local D1、production D1 三种形态均可正确消费。

## Batch 8 — P0 QA / Release

1. Core Narrative Coverage report；
2. dependency closure；
3. source coverage；
4. identity forced-merge audit；
5. relation duplicate audit；
6. Aztec contamination audit；
7. fake readable glyph audit；
8. broken media；
9. provenance；
10. CI / deploy sync。

## Batch 9 — P1 Visual Production

1. Tier S portraits；
2. Tier S PC / Mobile wallpaper；
3. Xibalba dual hero；
4. Tier-S Scene visuals；
5. key Story illustrations；
6. R2 / D1 sync；
7. artwork provenance audit。

---

# 16. P0 验收指标

```text
Core Narrative Coverage = 100%
Story Entity Dependency Closure = 100%
Required Narrative Relation Coverage = 100%
Stable Identity Source Coverage = 100%
Story Primary-source Coverage = 100%
Critical Relation Source Coverage = 100%
Tradition Scope Coverage = 100%
Source Period Coverage = 100%
P0 Canonical Design Coverage = 100%
Static / Local D1 / Production D1 Semantic Parity = 100%
Conflicting Identity Forced Merge = 0
Duplicate Canonical Relation = 0
Invalid Relation Target = 0
Dangling Entity = 0
Wrong-tradition World / Story Linkage = 0
Critical Aztec/Maya Visual Contamination = 0
Fake Readable Glyph Claim = 0
Broken P0 Media = 0
```

P0 **不验收**：

```text
Story 必须 36
Character 必须 N
Tier S 必须 16
PC wallpaper 必须 16
Mobile wallpaper 必须 16
World 必须 N
```

---

# 17. 明确不做的错误方案

## 不做 1：先列“玛雅十二主神 / 五十神”再灌数据

会得到现代百科名单，不会得到来源可信的 Maya 内容宇宙。

## 不做 2：把 `Popol Vuh` 当作全 Maya 统一 Canon

它是核心来源，但首先属于 K'iche' tradition。

## 不做 3：把所有 Feathered Serpent 合成一个 Character

Q'uq'umatz、K'uk'ulkan、Quetzalcoatl 不做 alias。

## 不做 4：把 Seven Macaw = Principal Bird Deity 写成确定事实

只允许 source-scoped correspondence。

## 不做 5：Hun Hunahpu = Classic Maize God

不做自动 identity merge。

## 不做 6：Ix Chel = 所有 Maya 月亮女神 / 年轻女神

先做 Identity Gate。

## 不做 7：所有 Death God 都叫 Ah Puch

名称和 identity 按具体 source scope。

## 不做 8：所有地下空间都叫 Xibalba

Xibalba 默认按 K'iche' / Popol Vuh scope 解释。

## 不做 9：固定 13 层天界 + 9 层冥界 + 世界树统一地图

具体宇宙数字进入 source-scoped claim，不做现代统一地图。

## 不做 10：Classic iconography 被改写成一篇“古典期神话小说”

图像 / inscription reconstruction 必须明确证据性质。

## 不做 11：新增 Maya-only Story kind / CanonicalDesign / SourceRef 字段

确有缺口先做 Generic Schema Review。

## 不做 12：玛雅视觉 = jungle pyramid + giant feather crown + Aztec Sun Stone

按 period / region / source visual guide。

## 不做 13：AI 乱码冒充可读 Maya glyph

教育内容必须 fail closed。

## 不做 14：新建 Maya-only importer / repository / graph API

Maya 是通用内容工程能力的验证集，不是第五套特例。

---

# 18. 推荐最终信息架构

```text
Maya Mythology
├── K'iche' / Popol Vuh
│   ├── Creation
│   ├── Failed Humanity
│   ├── Seven Macaw Cycle
│   ├── First Ballplayers
│   ├── Hero Twins
│   ├── Xibalba
│   └── Maize Humanity & Dawn
│
├── Classic Maya
│   ├── Maize God
│   ├── K'awiil
│   ├── Chaak
│   ├── Solar Deity
│   ├── Witz / Cave
│   └── Underworld / Cosmic Imagery
│
├── Postclassic Codices
│   ├── Rain / Chaak Almanacs
│   ├── Old Deity Tradition
│   ├── Female Deity Traditions
│   ├── Death Deity
│   ├── Venus
│   └── Calendar / Directional Ritual
│
└── Colonial Yucatec Sources
    ├── Itzamna Naming / Identity Evidence
    ├── Ix Chel Related Traditions
    ├── Kisin / Death Naming
    ├── Bacabs
    └── Healing / Ritual / Directional Cosmology
```

页面必须让用户理解：

> **Maya Mythology 是跨时期、跨地区、跨语言群、跨文本与图像证据构成的传统网络，而不是一张现代人拼出来的统一众神谱。**

---

# 19. 最终优先级

```text
P0
1. Generic registry / validator / repository parity
2. Source + Name Manifest
3. Popol Vuh Narrative Coverage
4. Character / Relation Dependency Closure
5. Xibalba + Scene Network
6. Classic / Postclassic / Yucatec Identity Bridge
7. Identity Gate + ContentClaim
8. Canonical Design + Visual DNA V2
9. Character Detail / SSR / Graph integration
10. QA / CI / deploy sync

P1
11. Tier S visual production
12. World / Scene dual-device Hero
13. Story illustration expansion
14. Advanced period / tradition Graph UX
15. SEO / alias / transliteration expansion

P2
16. Site-specific Classic programs
17. More Codex / Yucatec cycles
18. K'iche' lineage / migration tradition
19. Regional Maya traditions
20. Living Maya traditions as a separate respectful layer
```

V1.1 的目标不是把 V1.0 写得更保守，而是让玛雅方案真正与 Greek / Norse / Japanese / Egyptian 共用一套 Completeness Standard：

> **文明差异进入内容、来源与解释；工程模型尽量保持通用。**

---

# 20. V1.2 执行记录与优化后的交付边界

本次 Review 后，方案的执行单位从“补齐一套玛雅百科”收敛为一个可验证的 P0 内容闭环：先让用户可以从玛雅入口进入 K’iche’ 主线、继续探索 Xibalba 与角色关系，再通过古典期 / Codex bridge 理解证据边界。Story 数量不再是 KPI，正式壁纸生产也不阻塞 P0 上线。

## 20.1 已落地

- `src/content/maya/` 已注册为共享 `StructuredMythologyBundle`，未新增 Maya-only repository、importer 或 Graph API。
- 已落地 19 个 P0 Character、3 个 World、12 个 Scene、16 个可独立阅读 Story、3 个 ContentConcept、17 条单向 canonical Relation。
- Story 依赖字段、来源 locator、传统 / 时期范围、Xibalba scope、Classic Maize God boundary、Codex rain bridge 已进入验证与静态回退。
- `CharacterName`、`CharacterInterpretation`、`ContentClaim` 已通过通用 bundle 入口支持静态回退，并由通用同步脚本写入 D1。
- 同步脚本已支持按目录发现结构化文明包，并同步 concepts、claims、names、interpretations 与来源引用；Maya 使用同一条 pipeline。
- `myth-maya` 已改为“玉米 · 星辰 · 地下世界”定位，并使用原创 SVG Hero；没有将 Aztec Sun Stone、Templo Mayor 或不可读 glyph 当作 Maya 资产。
- `npm run content:validate` 已纳入 Maya contract test；`npm run typecheck` 已通过。
- 本地 D1 回读确认了 19 个托管 P0 Character、3 个 World、12 个 Scene、3 个 Concept、17 条 Relation 与 4 条 Claim；数据库中另外保留 5 条既有 Maya legacy Character 行。同步采用 additive/upsert 策略，本轮不做破坏性清理，避免把历史数据误当作待删除内容。

## 20.2 本轮明确不宣称完成

- Tier S / A 正式 portrait、PC wallpaper、mobile wallpaper 与 R2 生产资产；这些继续属于 P1。
- God D / Itzamna、Goddess O / Ix Chel、Death God / Kisin 等高风险身份的确定性合并；当前保持 source-scoped interpretation / concept 边界。
- 生产环境 D1 写入与 Cloudflare deploy；本地 D1 sync 可验证，生产发布仍需按发布流程执行。

## 20.3 可重复验收命令

```bash
npm run content:validate
npm run typecheck
npm run content:import -- --mythology=maya --write .wrangler/maya-content.sql
npm run migration:check
npm run content:import -- --mythology=maya --apply --local
```

P0 的下一步不是继续扩充神名数量，而是以 `Core Narrative Coverage`、`Dependency Closure`、`source coverage`、`identity forced-merge audit` 和“托管 ID 的 Static / Local D1 / Production D1 Semantic Parity”作为发布门槛；legacy 行的归档 / 合并另开迁移审计，再进入 P1 视觉生产。
