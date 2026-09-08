# MythCanvas 北欧神话 × 角色详情 × 3D 神谱整合方案

> 状态：Implementation Plan + Execution Reconciliation
> 版本：V1.1
> 日期：2026-09-07
> 关联主计划：`docs/NORSE_MYTHOLOGY_COMPLETION_PLAN.md`  
> Review 范围：最近两次与角色详情 / 神谱直接相关的代码提交：
> - `4a40417379cec7d6cc0163e0f88e3c4064888dc5` — Greek 内容图谱、角色关系 / DNA、Story 页面与验证流水线
> - `617476d156c2c1daa2873c6f35ea5b6ca03e6df1` — Character Hero 3D 神谱

---

# 0. 结论

北欧补全不能只做到：

```text
新增 Character / Story / Relation
→ 导入 D1
→ 页面能查到
```

因为最近两次角色相关提交已经把产品模型推进到：

```text
Character Detail
├── Hero
├── Artwork
├── Interpretation / Variant 上下文
├── Source-scoped Relation
└── 3D Character Graph
```

北欧是第二套完整结构化神话内容。如果继续沿用当前 Greek-only 特例，会出现四类问题：

1. **内容存在但页面不可见**：静态 fallback / validator / importer 多处写死 Greek；
2. **关系事实可存但图谱表达错误**：`parent -> child` 的存储方向与用户视角标签混淆；
3. **异说可存但用户无法真正切换**：非默认 `traditionScope` 当前会被图谱过滤掉；
4. **3D 图可运行但内容可信度回退**：HTML 关系 fallback、来源详情、键盘访问等没有跟上。

因此本轮北欧补全必须把“角色详情 + 图谱可消费性”纳入 P0，而不是内容导入完成后再补 UI。

最终目标：

> **任意一个北欧 P0 Character 在 local static fallback、local D1、production D1 三种运行形态下，都能正确进入角色详情、显示来源化身份与作品，并以不混淆传统版本的方式打开 3D 神谱；图谱不可用时核心关系仍然可读。**

## 0.1 2026-09-07 执行对账

本文件最初是针对 Greek-only 实现的审查与改造计划。经过本轮落地后，文中出现的“当前 Greek-only”“尚未建立 Registry / Norse fallback”等描述属于历史问题背景，不再代表仓库当前状态。

当前已由代码和测试确认的能力：

- `src/content/registry.ts` 已注册 Greek、Norse 及其他结构化内容包；Repository 和静态 public catalog 已走通用入口。
- `src/content.config.ts`、`content:validate`、`content:import` 和部署 workflow 已支持 Norse / all bundles；不再只验证或导入 Greek。
- Character Detail 已有静态 ViewModel，包含 names、interpretations、variants、worlds、stories、direct relations、artworks；相关 CTA 会保留 interpretation / variant / style 上下文。
- 文字关系 fallback 已回到 SSR 页面；Graph DTO 已包含 relation category、neutral label、scope、confidence、sourceRefs，并支持 interpretation 与 tradition scope 过滤。
- Graph 前端已具备 ARIA 初态、`inert` / focus 管理、Escape、AbortController、visibility / viewport 监听、主题重绘和 WebGL 资源清理。
- 北欧内容结构、Story dependency closure、来源定位、静态 Graph 消费、World 最终 OutputSpec 与文件指纹均已通过自动化检查；当前覆盖快照为 74 个 Story、92 个 Character、8 个 World，视觉指纹 108/108 存在。

仍未被自动化“代签”的项目：

- 56 个 P0 Story 的人类来源审阅；8 个 World 与 Story key-moment 的人类视觉审批。
- Phase 6 identity audit、产品签字、独立 Completion Snapshot approval；三者必须绑定同一 Snapshot 版本，且 Snapshot reviewer 与 product signoff reviewer 不同。
- local D1 / remote D1 / production smoke 的真实环境验证，以及完整浏览器 E2E 的人工视觉确认。
- P1 关系 edge inspection、Graph 节点级键盘替代之外的增强交互，除非本轮明确进入产品范围，不作为北欧内容签字前的隐式阻断项。

因此，本文后续的批次清单以“已实现 / 机器验证 / 人工闸门 / 环境待验证”区分；不能把 `npm test` 或静态 fallback 通过误写成生产完成。

---

# 1. 两个提交的有效成果

## 1.1 `4a404...`：内容体系开始真正进入产品层

该提交完成的方向是正确的：

- `CharacterRelation` 正式进入 Repository；
- Greek structured content 与 D1 合并；
- Character DNA / Relation 曾进入详情页；
- Mythology 页面加入 genealogy；
- Story detail route、sitemap、内容 validator 落地；
- CI 加入 structured content validation / provenance audit；
- production deploy 前执行内容同步。

这使 MythCanvas 从“图片站 + 少量角色资料”开始变成：

```text
Mythology Knowledge Graph
        +
Visual Asset System
        +
AI Generation Context
```

北欧应复用这套模型，不新增第二套 schema。

## 1.2 `617476...`：角色关系进入沉浸式交互

该提交把 Character Relations 从普通列表提升为 Hero 内 3D Force Graph：

- 3d-force-graph + Three.js；
- 客户端点击后 lazy import；
- `/api/character-graph`；
- depth 1 / 2；
- node limit；
- tradition scope；
- Concept node；
- directed / symmetric relation；
- sourceRefs 保留在 DTO；
- WebGL 销毁 / ResizeObserver 基础处理；
- graph unit test。

方向同样成立。北欧神话尤其适合这一产品表达，因为其核心认知天然依赖：

```text
Odin 家系
Loki 家系
Aesir / Vanir 联姻与冲突
Thor 与 Giants
Baldr death chain
Ragnarök 对手关系
Volsung hero lineage
```

但当前实现仍属于 **V0 可运行版本**，不能直接按 60+ 北欧实体、复杂异说关系灌数据后视为完成。

---

# 2. 当前端到端数据链路

当前实际链路：

```text
src/content/{greek,norse,...}/*
        ↓
Generic Registry / validator / sync script
        ├──────────────→ Static public catalog
        └──────────────→ D1 compatibility mirror
                               ↓
              Repositories / Character Detail ViewModel
                               ↓
                       CharacterHero
                               ↓ click
                       /api/character-graph
                               ↓
                    scoped neighborhood DTO
                               ↓
                         3d-force-graph
```

北欧目标链路：

```text
src/content/norse/*
        │
        ├──────────────┐
        ↓              ↓
Generic Content   Static fallback
Registry/Pipeline      │
        ↓              │
       D1              │
        └──────┬───────┘
               ↓
Generic Repositories
               ↓
Character Detail View Model
               ↓
       ┌───────┴────────┐
       ↓                ↓
SSR Identity       Graph API V2
/Source/Relations       ↓
       │          Scoped neighborhood
       │                ↓
       └──── fallback ← 3D Graph
```

原则：

> 3D Graph 是关系内容的一种高级可视化，不是关系内容唯一存在方式。

---

# 3. Code Review 问题清单

下面问题按北欧补全的阻断程度排序。

---

## P0-R1：Structured Content 仍然 Greek-only（历史问题，已解决）

### 历史问题

以下能力存在显式 Greek 特例：

```text
src/lib/content/repositories/character.ts
  mergeGreekCharacters()
  greekCharacters
  mythologyId === 'myth-greek'

src/lib/content/repositories/character-relation.ts
  greekRelations
  mythologyId === 'myth-greek'

src/content.config.ts
  collections = { greek }

package.json
  content:validate -> tests/greek-content.test.ts
  content:import   -> scripts/sync-greek-content.mjs
  artwork:coverage -> report-greek-artwork-coverage.mjs
```

如果当时只新增：

```text
src/content/norse/catalog.ts
```

但不改上述结构，则：

- `db === undefined` 时新北欧 Character / Relation 不会进入 Repository；
- dev/test fallback 与 production D1 行为不一致；
- CI 不会验证 Norse；
- deploy 不会自动同步 Norse；
- Graph API 在无 D1 环境中无法验证完整 Norse 图谱。

### 已落地方案

新增通用内容注册表：

```text
src/content/registry.ts
```

建议结构：

```ts
type StructuredMythologyBundle = {
  mythologyId: string;
  slug: string;
  characters: readonly Character[];
  relations: readonly CharacterRelation[];
  concepts: readonly ContentConcept[];
  worlds: readonly World[];
  scenes: readonly Scene[];
  stories: readonly MythStory[];
  assets?: readonly unknown[];
};
```

注册：

```text
Greek Bundle
Norse Bundle
```

Repository 不再 import `greekCharacters` / `greekRelations`，统一：

```text
getStructuredBundle(mythologyId)
getStructuredCharacters(mythologyId)
getStructuredRelations(mythologyId)
```

### 不建议

不要立即把 `src/content/greek/` 大搬家。

先：

```text
src/content/registry.ts
src/content/greek/*
src/content/norse/*
```

达到通用注册；目录统一可后续做。

### 当前 DoD

- `DB undefined` 时 Greek / Norse 行为一致；
- D1 数据优先覆盖 static bundle；
- static 与 D1 按 stable id merge；
- repository 内无 `myth-greek` 特判；
- 新文明只需注册 Bundle，不修改 Repository。

上述 DoD 已由当前 Registry、static public catalog、结构化 contract tests 和 `npm run check` 覆盖；local / remote D1 的实际数据导入仍属于环境验收，不在静态测试中虚构通过。

---

## P0-R2：非默认异说当前事实上无法展示

### 当前问题

Graph 已支持：

```text
traditionScope
isDefault
availableScopes
selectedScope
```

但旧逻辑先执行：

```text
if (relation.isDefault === false) return false
```

导致：

```text
availableScopes 中可以出现异说
↓
用户点击异说
↓
该异说 relation 仍被 isDefault=false 过滤
↓
按钮可选，但事实永远看不到
```

这对北欧是 P0 阻断问题。

典型高风险内容：

- Tyr 父系传统；
- Loki 的身份 / 关系范围；
- Frigg / Freyja 后世混同；
- Hel / Niflhel / Niflheim 空间关系；
- 不同文本对 Ragnarök 参与者和幸存者的差异。

### 本 PR 已先修

规则改为：

```text
未选 scope
  → 只展示 neutral/default compact assertions

显式选择 scope
  → 展示该 scope 中所有 active assertions
  → 不再被 isDefault=false 二次杀掉
```

同时新增测试覆盖：

- 多 default scope；
- 显式选择 alternate scope；
- 只有 non-default scope 时必须要求用户显式选择。

### 后续仍需

`isDefault` 只应表达：

> compact/default reading 是否优先展示

不能表达：

> 该事实是否真实存在 / 是否可浏览

---

## P0-R3：关系存储方向与用户视角标签混淆

### Canonical Storage Rule

项目已经约定：

```text
parent -> child
relation_type = parent
```

这是正确的存储规则。

但 UI 不能直接把 `relation_type=parent` 固定翻译为“父母”。

例如：

```text
Odin -> Thor
relation_type = parent
```

从 Odin 页面看：

```text
Thor = 子女
```

从 Thor 页面看：

```text
Odin = 父母
```

Graph 边本身更适合显示中性：

```text
亲子
```

### 本 PR 已先修

- 3D Graph `parent / child` edge label 改为中性“亲子”；
- legacy `CharacterRelations` 按当前 Character 视角显示“父母 / 子女”。

### 后续必须抽象

不要继续让：

```text
CharacterRelations.astro
character-graph.ts
MythologyGenealogy.astro
```

各自维护一份 relation label map。

新增：

```text
src/lib/content/relation-semantics.ts
```

建议：

```ts
type RelationSemantic = {
  type: string;
  category: 'kinship' | 'marriage' | 'authority' | 'alliance' | 'conflict' | 'identity' | 'narrative';
  directional: boolean;
  neutralLabel: string;
  fromPerspectiveLabel: string;
  toPerspectiveLabel: string;
};
```

示例：

```text
parent
  storage: parent -> child
  neutral: 亲子
  from perspective counterpart: 子女
  to perspective counterpart: 父母

master
  storage: master -> disciple
  neutral: 师承
  from: 弟子
  to: 师长

rules-over
  storage: ruler -> subject/domain
  neutral: 统属
  from: 统治
  to: 受其统属
```

### DoD

同一 Relation 在：

- 文字关系列表；
- Mythology genealogy；
- 3D Graph；
- SEO / structured data；

语义一致。

---

## P0-R4：3D Graph 替换文字关系后，SSR fallback 回退了（已补齐）

### 设计文档要求

Character Graph Plan 明确要求：

```text
页面继续 SSR
JS / WebGL 不可用时仍能获取核心关系内容
```

### 历史实际实现

Graph commit 从 Character Detail 页面移除了：

```text
CharacterDNA
CharacterRelations
```

而 Hero 内并没有 SSR relation list。

因此：

```text
No JS
WebGL 不支持
3d-force-graph import fail
API fail
context lost
```

时，只能看到：

```text
神谱暂时无法载入
```

看不到关系事实本身。

这是：

- accessibility regression；
- SEO / GEO regression；
- 内容可信度 regression。

### 已落地方案

不要恢复旧的整块大关系 Section。

Hero 神谱增加一个**轻量文本关系层**：

```text
Graph Detail Panel
├── 当前人物
├── 关系摘要
├── [文字关系]
└── 来源
```

SSR 输出：

```html
<details class="graph-text-relations">
  <summary>文字关系</summary>
  ...direct relations...
</details>
```

JS 开启后仍保留。

Graph fail 时自动展开或切换到 textual mode。

### 必须支持

- Character counterpart；
- ContentConcept counterpart；
- perspective label；
- source title + locator；
- tradition scope；
- confidence（必要时）；
- counterpart Character link。

### 当前 DoD

禁用 JS 后：

```text
/character/odin/
/character/loki/
```

仍能读到 P0 direct relations 与来源。

当前实现已由 CharacterHero 的 SSR `details` 文字关系区承载；仍需在浏览器与正式构建产物中做一次人工 no-JS / WebGL failure smoke，作为验收证据，而不是把自动化静态检查误写成完整浏览器验证。

---

## P0-R5：Graph DTO 带 sourceRefs，但前台没有真正展示关系来源

### 当前

`CharacterGraphLink` 已包含：

```text
relationType
label
traditionScope
confidence
sourceRefs
```

这是很好的 DTO。

但前台 `focusNode()` 只展示：

```text
某角色
已收录 N 条直接关联
```

没有：

- 哪几条关系；
- 指向谁；
- 关系方向；
- tradition；
- source；
- locator。

### 优化

Graph Detail Panel 改为：

```text
奥丁
众神之王、智慧与战争之神

直接关系 12

亲子 · 索尔
《散文埃达》· Gylfaginning ...

配偶 · 弗丽嘉
《诗体埃达》...

[查看更多]
```

点击 edge 时优先显示该 edge：

```text
关系：亲子
Odin → Thor
传统：...
来源：...
```

### 原则

> 3D 是探索入口，HTML Panel 才是事实解释入口。

不要尝试把全部 source 文本直接铺在 WebGL Canvas 上。

---

## P0-R6：Interpretation / Variant 在当前 Detail 仍未形成真正闭环（核心闭环已补齐）

### 历史状态

Character Detail 已经读取 URL：

```text
?interpretation=
?variant=
?style=
?device=
```

当时页面没有完整加载并展示：

```text
getCharacterInterpretations()
getCharacterVariants()
```

因此 Interpretation / Variant 更多是在 URL 和 Creator 上下文中“预留”，不是完整公共浏览能力。当前已通过 Character Detail ViewModel 和页面选择器补齐。

另一个明确风险：

服务端 `buildCreateHref()` 会携带 `interpretation`，但客户端重新生成 Creator URL 的逻辑只处理：

```text
character
variant
style
output
```

用户从带 Interpretation 的 URL 进入后再切 Style / Device，存在 Creator CTA 丢失 interpretation context 的风险。

### 北欧为什么必须处理

北欧不是所有差异都应建 Interpretation，但高价值差异会直接影响：

- identity；
- relation scope；
- generation prompt；
- visual anchor。

例如计划中的 layered / contested Character 一旦建立 Interpretation，Detail 与 Graph 必须消费它，而不是只存数据库。

### 当前实现

Character Detail View Model：

```ts
type CharacterDetailViewModel = {
  character: Character;
  names: CharacterName[];
  interpretations: CharacterInterpretation[];
  variants: CharacterVariant[];
  worlds: World[];
  stories: MythStory[];
  directRelations: CharacterRelation[];
  artworks: Artwork[];
};
```

页面只消费 ViewModel，减少 frontmatter 持续膨胀。

当前页面会消费上述 ViewModel，并将 `interpretation`、`variant`、`style`、`device` 保留在详情与 Creator 链接中；Interpretation 对 Graph 的兼容性过滤已进入 API / graph builder。完整的多 endpoint Interpretation fixture 仍建议作为后续内容扩展测试补充。

### Interpretation 与 Variant 顺序

```text
Stable Character
  ↓
Interpretation（来源/传统身份层）
  ↓
Variant（年龄/服装/形态层）
  ↓
Style
  ↓
OutputSpec
```

不允许：

```text
Variant 反过来决定神谱事实
Style 改变关系
```

---

## P0-R7：Graph API 每次加载整个文明数据，北欧扩充后会浪费（P0 路径已收敛）

### 历史实现

每次请求：

```text
getCharactersForMythology(... limit 1000)
getCharacterRelationsForMythology(... all relations)
getContentConceptsByIds(...)
```

然后在 Worker 内 BFS 截取 24 / 48 个节点。

Greek 67 Character 时暂时可接受。

随着：

```text
Greek 70+
Norse 60+
Chinese 100+
```

以及 Graph 入口使用量上升，不应一直全量读取后再丢掉 90%。

### P0 初期

北欧首次上线可暂时复用，前提：

```text
Norse P0 Character < 100
Relation < 300
```

并做真实 p75/p95 测量。

### 当前实现与后续边界

静态 public catalog 的 Graph API 已使用 focus direct relations 做首跳，再按 mythology 做受控二跳筛选；这满足当前北欧规模和静态 canonical content 规则。后续若生产观测达到预算，再将相同算法下沉为 D1 neighborhood query：

```text
getDirectCharacterRelations(characterId)
getRelationsForCharacterIds(characterIds)
getCharactersByIds(characterIds)
```

Depth 1：

```text
focus
→ direct relations
→ endpoint IDs
→ nodes
```

Depth 2：

```text
focus
→ direct endpoints
→ relations touching endpoint IDs
→ second-hop IDs
→ hard cap
```

无需全量加载整个 Mythology。

### 注意

不要让 recursive SQL 把逻辑变得不可 review。

首版使用 2 次受控批量 query 即可。

---

## P0-R8：Graph 当前没有真正消费 Interpretation endpoint scope（已补齐基础过滤）

`CharacterRelation` 已有：

```text
fromInterpretationId
toInterpretationId
traditionScope
```

当前 `buildCharacterGraph()` 同时按：

```text
traditionScope
isDefault
```

过滤，并消费当前 Character Detail 的：

```text
selectedInterpretation
```

纳入图谱兼容性判断。完整的多 endpoint Interpretation fixture 仍建议作为后续内容扩展测试补充。

### 风险

如果未来：

```text
Character A interpretation X
Character A interpretation Y
```

拥有不同 relation edge，仅切 `?interpretation=y` 并不能保证图谱不显示 X 专属边。

### Graph API V2

新增：

```text
/api/character-graph
?character=tyr
&interpretation=...
&scope=...
&depth=1
&limit=24
```

过滤顺序：

```text
active relation
→ mythology boundary
→ current interpretation compatibility
→ tradition scope compatibility
→ publish visibility
→ BFS / node cap
```

### Compatibility Rule

若 relation：

```text
fromInterpretationId undefined
```

视为 stable Character-level assertion。

若指定：

```text
fromInterpretationId = X
```

只有当前 endpoint interpretation 为 X 时进入。

不要用 fuzzy tradition tag 猜 Interpretation compatibility。

---

## P0-R9：Related Characters 仍主要按同 World / 同 Mythology 猜，而不是关系图谱（已修正排序）

历史 Character Page RelatedCharacters 排序：

```text
same World
→ same Mythology
→ fallback
```

在内容稀少期可接受。

北欧补全后，已经有真实关系：

```text
Odin → Thor / Baldr / Frigg / Loki...
Loki → Hel / Fenrir / Jörmungandr...
Freyja ↔ Freyr / Njörðr...
```

### 当前排序

```text
1. direct relation counterpart
2. same Story cycle
3. same World
4. same Mythology
```

并排除：

- inactive；
- incompatible tradition-only counterpart；
- hidden Character。

这样详情页与 Graph 的认知一致。

---

## P1-R10：Hero 图选择策略没有 Interpretation / Variant / graph node 视觉语义

当前 Hero 优先级大致：

```text
canonical landscape Artwork
→ any landscape Artwork
→ World hero
→ Mythology hero
→ portrait
→ global fallback
```

问题：

- 新角色只有 portrait 时会被强制 cover 成 16:9；
- World hero 可能让“Character Hero”看不到角色；
- Interpretation / Variant 专属 reference 没有参与；
- Graph node 当前仍主要是球体 / label，没有使用角色 portrait。

### 北欧视觉 Tier 要与 Detail / Graph 联动

#### Tier S

```text
Odin
Thor
Loki
Freyja
Frigg
Baldr
```

最低：

- 1 desktop canonical hero；
- 1 mobile portrait/reference；
- graph portrait crop 可用。

#### Tier A

```text
Tyr
Heimdall
Freyr
Njörðr
Hel
Fenrir
Jörmungandr
Ymir
Surt
Skaði
Idunn
```

最低：

- 1 portrait/reference；
- Symbol fallback 可接受 desktop Hero；
- 高图谱度角色优先补图。

#### Tier B

- Symbol / role fallback；
- 不生成假肖像；
- 不拿其他角色图冒充。

### Graph node DTO V2

可增加：

```ts
portrait?: {
  src: string;
  width: number;
  height: number;
  alt: string;
}
```

客户端使用 Cloudflare 128 / 192 / 256 方形 transform，不直接把 2K/4K 原图上传 GPU。

---

## P1-R11：Graph 实现与自己的技术方案仍有若干缺口

### 缺口 A：Escape

方案要求 Escape 返回角色，当前未实现。

### 缺口 B：inert

方案要求 intro 淡出后不可被键盘聚焦，当前主要依靠：

```text
visibility
pointer-events
```

应明确 `inert` 或等效 focus management。

### 缺口 C：ARIA 初态

Graph trigger 应有：

```text
aria-expanded="false"
aria-controls="..."
```

### 缺口 D：Keyboard alternative

Canvas 目前没有节点级键盘浏览路径。

不要强行给 WebGL 节点造复杂键盘模拟；使用 SSR textual relation list 作为等价访问方式。

### 缺口 E：label measurement

当前 canvas label 在设置目标 font 之前调用 `measureText()`，长中文 / 英文名宽度可能计算偏差。

应：

```text
context.font = ...
→ measureText()
→ set canvas size
→ redraw
```

### 缺口 F：theme switch

Three.js material / light 色值在 graph 创建时读取 CSS token。

图谱打开状态下切 Light / Dark，HTML 控件会变，但已创建的 3D material 不一定同步重建 / recolor。

需要：

```text
theme change event
→ update materials/lights
```

或者简单：

```text
open graph 时锁定本次配色
主题切换后重绘 graph
```

### 缺口 G：visibility / pause

方案要求：

- tab hidden pause；
- hero out-of-view pause；

首版未完整实现。

### 缺口 H：resource disposal

当前调用：

```text
graph?._destructor?.()
```

这是需要版本锁定验证的内部能力。

同时 nodeThreeObject 每次创建：

- CanvasTexture；
- SpriteMaterial；
- SphereGeometry；
- MeshStandardMaterial；
- TorusGeometry；

必须通过多次 open/close memory profile 验证不会持续增长。

---

## P1-R12：Graph 目前没有 relation selection / edge inspection

Node click 目前只：

```text
focus node
显示 direct relation count
```

北欧图谱高价值在“关系是什么”，不是“连了几条线”。

P1 增加：

- edge hover highlight；
- edge click / touch selection；
- relation detail panel；
- source locator；
- counterpart link；
- same pair 多关系分离。

同一对角色可同时：

```text
kinship
alliance
conflict
narrative event
```

不能 merge 成一条线后丢语义。

---

## P1-R13：Graph hardcoded relation type 配色 / label 会不断漂移

当前：

```text
enemy -> error color
parent/child -> thick line
其他 -> default
```

北欧内容补齐后关系会更丰富：

```text
parent
consort
sibling
ally
rival
enemy
created
rules-over
associated-with
punishes
defeats
aids
captures
encounters
...
```

需要关系 Category，而不是每次 if relationType。

推荐视觉分层：

```text
kinship      稳定暖色
marriage     柔和金
alliance     冷亮
conflict     克制红
rule/order   中性强线
identity     虚线 / 低饱和
narrative    细线
```

颜色只是辅助，不能成为唯一语义编码。

---

## P1-R14：测试覆盖仍以 Greek happy path 为主

当前 Graph test 主要覆盖：

- Greek default scope；
- multiple default scope 不混合。

北欧需要新增专门 Contract Test。

### 必测类型

#### 高度节点

```text
Odin
Loki
```

验证：

- node cap；
- depth2；
- hidden count；
- 不爆 API payload。

#### parent perspective

```text
parent -> child
```

验证父页 / 子页 label 不反。

#### alternate traditions

选择具有真实文本差异的 source-scoped fixture，验证：

```text
default scope
alternate scope
neutral relation
```

不会混。

#### monster / creature node

```text
Fenrir
Jörmungandr
```

不能默认套 Person-only UI 语义。

#### concept node

验证：

```text
Character -> ContentConcept
```

不会因 counterpart 不是 Character 被静默丢弃。

#### unpublished endpoint

relation 指向未发布实体时 Graph 不展示。

---

# 4. 北欧 Character Detail 目标模型

每个 P0 Character 不只要“有一行 characters 数据”。

最低产品数据：

```text
Character
├── stable id / slug
├── name / nameEn
├── aliases / CharacterName
├── characterType
├── role
├── summary
├── symbols
├── canonicalDesign
├── canonicality
├── traditionTags
├── sourcePeriods
├── stable identity sourceRefs
├── worldIds
├── storyIds（由 Story dependency 建立）
├── direct relations
├── graph-safe relation scope
└── visual tier
```

按需：

```text
Interpretation
Variant
ReferenceAsset
Artwork
ContentConcept relation
```

---

# 5. Character Detail 页面目标 IA

Graph commit 后，不建议恢复成很长的百科资料页。

推荐：

```text
1. Immersive Hero
   ├── Mythology
   ├── Role
   ├── Name
   ├── aliases（少量）
   ├── symbols
   ├── short summary
   ├── Create
   ├── Artwork
   └── Graph

2. Interpretation / Form Bar（仅有数据时）
   ├── Interpretation
   └── Variant

3. Real Artwork

4. Mythic Context
   ├── Related Stories
   ├── Worlds
   ├── identity source
   └── textual direct relations

5. Related Characters
```

## 不恢复旧 CharacterDNA 大块展示

Canonical Design 主要服务：

- AI generation；
- internal content governance；
- visual consistency。

公开页可只展示：

```text
核心符号
关键身份
来源说明
神话关系
```

不要把内部 prompt engineering 字段全部暴露给用户。

---

# 6. 北欧 Interpretation 策略

不要因为每个文本差异都建 Interpretation。

## 应优先由 Relation / Story source scope 表达

例如：

```text
父母版本冲突
某场战斗细节差异
Ragnarök 顺序差异
```

若不改变角色稳定身份与出图，不建 Interpretation。

## 需要 Interpretation 的判断

差异必须至少影响一项：

- stable identity；
- divine role；
- major visual anchor；
- generation prompt；
- 用户需要主动切换的传统身份。

## Graph 规则

Graph scope 与 Interpretation 都存在时：

```text
Interpretation 是 endpoint identity scope
TraditionScope 是 assertion source scope
```

两者不能合并成一个字段。

---

# 7. 北欧 Graph 内容分层

## 7.1 第一层：Direct Graph

默认 1-hop。

桌面：

```text
<= 24 nodes
```

移动：

```text
建议 <= 16–18 nodes
```

当前客户端写死 24，需要后续按 viewport 调整请求预算。

## 7.2 第二层：Expand

Desktop：

```text
建议 <= 48 nodes
```

绝对硬上限：

```text
80
```

Mobile：

```text
建议 <= 32
```

## 7.3 第三层：Civilization Graph

不是 Character Hero 的责任。

未来独立：

```text
/mythology/norse/graph/
```

可展示：

- Aesir；
- Vanir；
- Jötnar；
- hero cycles；
- relation filter。

不要在 `/character/odin/` 一次拉整个北欧宇宙。

---

# 8. 北欧 Graph 核心验收角色

P0 不需要每个角色手工截图测试，但以下必须成为 fixture / E2E 样例。

## Odin

用途：

- 高 degree；
- parent / consort / sibling / child；
- knowledge / authority relations；
- 二度展开。

## Loki

用途：

- 高 degree；
- parent / offspring；
- ally / conflict；
- monster children；
- tradition sensitivity。

## Thor

用途：

- parent perspective；
- enemy / conflict；
- human-like Character Hero。

## Freyja

用途：

- Vanir；
- kinship；
- source / interpretation boundary；
- female Tier S visual。

## Tyr

用途：

- source-scoped disputed genealogy fixture；
- alternate scope 切换。

## Hel

用途：

- deity / ruler；
- underworld World；
- Loki family relation。

## Fenrir

用途：

- monster Character；
- Tyr / Odin narrative relations；
- no human portrait assumptions。

## Jörmungandr

用途：

- creature / monster；
- Thor conflict；
- non-human graph visual。

---

# 9. Structured Content 通用化详细设计

## 9.1 目录

```text
src/content/
├── registry.ts
├── greek/
│   ├── catalog.ts
│   ├── stories.ts
│   ├── assets.ts
│   └── visual-tiers.ts
└── norse/
    ├── catalog.ts
    ├── stories.ts
    ├── assets.ts
    ├── visual-tiers.ts
    └── index.md
```

## 9.2 Registry

提供：

```text
getStructuredMythologyBundle(mythologyId)
listStructuredMythologyBundles()
```

Registry 是应用层依赖入口。

禁止 Repository 直接 import：

```text
../content/greek/catalog
../content/norse/catalog
```

## 9.3 Validation

把：

```text
tests/greek-content.test.ts
```

拆成：

```text
tests/structured-content-contract.test.ts
  ↑ generic

tests/greek-content.test.ts
  ↑ Greek-specific facts

tests/norse-content.test.ts
  ↑ Norse-specific facts
```

Generic Contract：

- duplicate id = 0；
- duplicate slug = 0；
- missing Character dependency = 0；
- missing World dependency = 0；
- missing Scene dependency = 0；
- missing required source = 0；
- invalid relation endpoint = 0；
- duplicate canonical relation = 0；
- unknown relation type = 0；
- published Story without source = 0；
- P0 Character missing Canonical Design = 0。

## 9.4 Import

替换：

```text
scripts/sync-greek-content.mjs
```

为：

```text
scripts/sync-structured-content.mjs
```

CLI：

```bash
npm run content:import -- --mythology greek --apply --local
npm run content:import -- --mythology norse --apply --local
npm run content:import -- --all --apply --remote
```

部署阶段：

```text
validate all
→ migrate D1
→ import all structured bundles
→ provenance audit
→ deploy
```

不能每新增文明就在 workflow 增加一段：

```text
Synchronize Greek
Synchronize Norse
Synchronize Egyptian
...
```

---

# 10. Graph API V2 数据契约

建议：

```ts
type CharacterGraphDataV2 = {
  focusId: string;
  mythologyId: string;
  interpretationId?: string;
  selectedScope?: string;
  availableScopes: GraphScopeOption[];
  requiresScopeSelection: boolean;
  nodes: CharacterGraphNode[];
  links: CharacterGraphLink[];
  hiddenNodeCount: number;
  hiddenRelationCount: number;
  canExpand: boolean;
};
```

Scope 不只返回 string：

```ts
type GraphScopeOption = {
  id: string;
  label: string;
  isDefault: boolean;
  sourceRefs?: SourceRef[];
};
```

避免把内部英文 tradition key 原样当 UI 文案。

## Node

```ts
{
  id,
  kind,
  name,
  nameEn,
  role,
  slug,
  symbol,
  portrait?,
  characterType?
}
```

## Link

```ts
{
  id,
  source,
  target,
  relationType,
  category,
  neutralLabel,
  directional,
  traditionScope,
  confidence,
  sourceRefs
}
```

---

# 11. Graph Frontend V2

## 11.1 State machine

明确：

```text
intro
→ loading
→ scope-required | graph | empty
→ focused-node
→ focused-edge
→ error
→ intro
```

当前只隐式维护几个 boolean / variable，随着来源面板与 scope 增加会快速复杂。

建议不引入状态库，但定义单一：

```ts
type GraphUiState = ...
```

## 11.2 Request cancellation

当前通过 `requestVersion` 防旧响应覆盖，这是正确基础。

进一步：

```text
AbortController
```

新 load / close 时 abort 上一个 fetch，减少浪费。

## 11.3 Scope switch

切 scope：

```text
保留 focus Character
→ clear incompatible selection
→ reload relation DTO
→ 尽量保留相机位置
```

不要把不同传统的节点位置直接视为同一事实布局。

## 11.4 Node visual

优先级：

```text
focus portrait
→ direct portrait
→ symbol fallback
→ concept glyph
```

非人形：

```text
Fenrir / Jörmungandr
```

使用其正式 reference / silhouette，不强塞圆形人脸头像。

## 11.5 Label policy

始终显示：

```text
focus
selected
```

优先显示：

```text
1-hop
```

2-hop：

```text
按 camera distance / importance 动态隐藏
```

避免 48 个节点全部挂永久中文标签。

---

# 12. Accessibility DoD

必须满足：

- trigger 有 `aria-expanded` / `aria-controls`；
- open 后 intro 不可 tab 到；
- Escape 可关闭；
- 返回后 focus 回 trigger；
- `prefers-reduced-motion` 无 camera fly animation；
- Graph 不阻止移动页正常滚动；
- 有 textual relations equivalent；
- source detail 可键盘打开；
- scope button 有明确 `aria-pressed`；
- Canvas 不作为唯一事实入口；
- graph error 后仍可访问文字关系。

---

# 13. Performance DoD

## 初始 Character 页面

Three.js / 3d-force-graph 必须继续 lazy load。

Graph 未打开时：

```text
不初始化 WebGL
不请求 graph API
```

## Graph Open

目标预算：

```text
Desktop initial nodes <= 24
Mobile initial nodes <= 18
Desktop expand <= 48
Mobile expand <= 32
Hard cap <= 80
```

## API

P0：

```text
p75 warm < 500ms
p95 warm < 1s
```

具体以 Cloudflare production observability 为准，不把本地结果当生产结论。

## GPU

验证：

```text
open / close x 10
```

后：

- canvas 数量回到 0/1；
- listener 不累积；
- GPU texture / material 不持续上涨；
- ResizeObserver 不累积。

---

# 14. SEO / GEO 约束

3D Graph 本身不是 SEO 内容。

SSR 页面仍应输出：

```text
Character identity
aliases
role
summary
core source references
key direct relations
related Story links
World links
```

JSON-LD 不从 WebGL 数据动态生成。

对于：

```text
Fenrir
Jörmungandr
```

不要无条件把所有 Character 都当“现实 Person”解释；后续单独 review Character JSON-LD 类型映射。

核心原则：

> SEO 读 HTML，用户用 3D 增强探索。

---

# 15. 实施批次

## Batch P0-0：修现有关系语义 bug

已落地并通过单元测试：

- [x] alternate non-default scope 可显式进入；
- [x] only non-default scope 时要求显式选择；
- [x] parent edge 改中性“亲子”；
- [x] legacy textual relation 按父/子视角显示；
- [x] graph scope 新增 unit test。

- [x] Creator client-side URL 保留 interpretation；
- [x] relation semantics 抽通用模块。

## Batch P0-1：通用 Structured Content Registry（已完成）

- [x] `src/content/registry.ts`；
- [x] Greek 注册；
- [x] Norse 注册；
- [x] Character Repository 去 Greek 特判；
- [x] Relation Repository 去 Greek 特判；
- [x] World / Scene / Story fallback 对齐；
- [x] `src/content.config.ts` 支持 Norse；
- [x] generic structured content contract test。

## Batch P0-2：通用 Validate / Import Pipeline（代码与 CI 已完成）

- [x] `sync-structured-content.mjs`；
- [x] `content:validate --all`；
- [x] `content:import --all`；
- [x] CI 不再只跑 Greek test；
- [x] deploy 不再写死 Synchronize Greek；
- [x] artwork coverage 支持 mythology 参数。

生产 D1 的真实 import、R2 provenance audit 和回滚验证仍归 Batch P0-9，不因脚本存在而视为已执行。

Local D1 首次导入曾暴露 `Odin` 的两个稳定主名称同时声明同一 scope，以及旧关系未被清理的问题；已将 `Grímnir` 降为 title、在通用校验中加入 primary-name scope 约束，并让 importer 清理当前 Character 范围内的过期关系。修复后的全量 local import 已成功执行。

## Batch P0-3：北欧 Story / Character Closure（结构闭环已完成，人工来源审阅待完成）

按主计划 Story First：

- [x] P0 Story manifest；
- [x] Character dependency closure；
- [x] World / Scene closure；
- [x] names / aliases；
- [x] stable identity source refs；
- [x] required relation manifest；
- [x] relation source coverage 100%；
- [x] canonical design coverage 100%。

- [ ] 56 个 P0 Story 完成 named human source review，并记录 decision notes / unresolved IDs。

## Batch P0-4：Character Detail ViewModel（已完成）

- [x] 新建 service / query assembler；
- [x] names；
- [x] interpretations；
- [x] variants；
- [x] worlds；
- [x] stories；
- [x] relations；
- [x] artworks；
- [x] related characters relation-aware ranking；
- [x] Creator URL context 一致。

## Batch P0-5：SSR Relation Fallback（核心降级与浏览器核心矩阵已完成）

- [x] Hero textual relation entry；
- [x] source locator；
- [x] concept counterpart 的同等 HTML 关系呈现；
- [x] tradition label；
- [x] no-JS verified（Astro build 产物包含 Odin 文字关系与 Quetzalcoatl 概念关系）；
- [x] API failure verified：停止本地 Worker 后打开 Odin 图谱，错误提示出现且 SSR 文字关系仍可读；最新构建产物下失败后 Canvas 数量为 0，确认半成品图谱已清理；
- [x] loopback-only WebGL/graph initialization failure injection verified：访问 `?graphFailure=webgl` 后在 Canvas 已创建阶段注入失败，错误降级可见且失败后 Canvas 为 0；该诊断入口不在生产域名启用；

## Batch P0-6：Graph API V2（已完成当前 P0 契约）

- [x] interpretation param；
- [x] scope compatibility；
- [x] relation semantic category；
- [x] portrait metadata；
- [x] hidden node count；
- [x] neighborhood repository query（static public catalog 的受控首跳 / 二跳）；
- [x] cache strategy；
- [x] source detail contract。

若 D1 规模或生产 p95 超过预算，再把同一算法下沉为真正的 SQL neighborhood query；这是可观测性驱动的 P0.5，不阻断当前静态 canonical content 上线。

## Batch P0-7：Graph Frontend Hardening（实现与核心矩阵已完成，GPU 剖面待实测）

- [x] Escape；
- [x] inert / focus；
- [x] ARIA initial state；
- [x] AbortController；
- [x] source / relation detail；
- [x] edge selection；
- [x] label measurement fix；
- [x] theme change；
- [x] visibility pause；
- [x] mobile gesture budget；
- [x] GPU / WebGL resource disposal implementation；
- [x] WebGL capability probe：在加载 3D 引擎前检测 `webgl2` / `webgl`，并记录 WebGL version / max texture size；不可用时直接保留 SSR 文字关系降级；
- [x] loopback-only WebGL probe failure injection：使用 `?graphFailure=webgl-unavailable` 验证“探测失败时不加载 3D 引擎、保留文字关系”的分支；生产域名不启用该入口；
- [x] WebGL context lost / restored listener：上下文中断时暂停动画、显示文字兜底并记录诊断事件；恢复后销毁旧 renderer 并按当前 scope / depth 重载；
- [x] open / close ×10 的 Canvas 清理 smoke：每次打开最多 1 个 Canvas，关闭后回到 0；
- [x] open / close ×10 的 listener 生命周期剖面：启用 `?graphDiagnostics=1` 后，关闭态的基础 `activeListenerCount` 为 6，打开态额外包含 2 个 WebGL context listener（共 8），`activeGraphCount` 每次打开为 1、关闭为 0，`peakGraphCount` 为 1；
- [x] renderer resource profile：10 个周期打开态的 `renderer.info.memory` 均为 `geometries=3 / textures=2`，关闭态均为 `activeGraphCount=0 / canvasCount=0`；证明本次重复循环没有出现 renderer 资源计数增长，但不等同于 GPU 显存字节级测量；
- [ ] GPU texture / material / 显存持续上涨剖面；当前浏览器运行时不提供可读取的 GPU 显存指标，需在带 DevTools GPU telemetry 的环境补测；

## Batch P0-8：Norse Visual Tier（角色 / World 机器交付已完成，人工审批待完成）

- [x] Tier S Character desktop Hero / mobile reference 的静态发布覆盖（12 / 12，机器契约已加入 Norse content test）；
- [x] Tier A Character portrait/reference 的静态发布覆盖（16 / 16，机器契约已加入 Norse content test）；
- [x] Tier B Symbol fallback；
- [x] graph node portrait metadata / texture transform contract；
- [x] static visual provenance audit：文件缺失与尺寸不符为 0；
- [x] local R2-D1 path smoke：Odin / Fenrir / Ymir 代表性 Canonical 资产 HEAD 均 200，返回 `image/png` 与 immutable cache；
- [ ] production R2-D1 paths consistent（远端曾成功只读审计，待重新认证、migration / structured import 后执行全量对照）；
- [ ] 8 个 World 的人类视觉审批；
- [ ] Story key-moment artwork 的人类视觉审批。

## Batch P0-9：生产同步与验收（待实际环境执行）

顺序：

```text
content validate
→ migration check
→ local import
→ unit tests
→ local browser pass
→ remote readiness audit (schema-only)
→ remote migration apply
→ remote readiness audit (schema-only, strict)
→ remote import
→ provenance audit
→ remote readiness audit (full, strict)
→ production deploy
→ production smoke
```

当前已完成代码侧的 validate、migration compatibility、unit tests、static fallback、build、local D1 import / 对照查询，以及本地 HTTP smoke（角色页、Story 页、World 页、Graph API、概念关系页均 200）。2026-09-07 又完成了本地 Worker 预览 smoke：`npm run preview:local -- --ip 127.0.0.1 --port 4323` 下，角色页、Story 页、World 页和 Graph API 均返回 200；Odin 未指定传统时正确要求 scope selection，指定 `Eddic and Prose Edda tradition` 后返回 14 个节点、13 条关系；随后完成 Desktop Light/Dark（Odin、Loki、Tyr、Fenrir）和 Mobile（Thor、Freyja）的核心图谱流程矩阵、loopback-only WebGL/graph-init failure injection、listener 生命周期与 renderer resource profile，以及移动端浏览器返回验证。另在本地浏览器实测正常环境打开 Odin 图谱为 1 个 Canvas 且无文字降级；访问 `?graphFailure=webgl-unavailable` 时 Canvas 为 0、文字关系仍可读。仍未完成的是 GPU telemetry、真实硬件 WebGL 差异、remote migration/import、production deploy、production smoke，因此保持未完成。

正式环境 smoke 已固化为只读命令：`npm run content:smoke:norse -- --base-url https://<已确认的正式域名> --write reports/norse-production-smoke.json`。它覆盖角色/神话/Story/World 页面、Graph 默认与指定 scope、无效角色、sitemap 以及 Odin Tier S 桌面/移动 R2 HEAD；本地 Worker 预览已完成 10 / 10 通过，正式环境仍必须在 remote migration/import 和 deploy 后执行。

---

# 16. 自动化测试矩阵

## Unit

```text
relation-semantics.test.ts
character-graph.test.ts
structured-content-contract.test.ts
norse-content.test.ts
```

当前仓库验证记录（2026-09-07）：`npm test -- --run` 为 27 个测试文件、141 个测试全部通过；`npm run check` 通过（包含内容验证、Astro build、TypeScript 与 Wrangler dry-run）。这证明机器侧契约，不等于 local / production D1 或浏览器 E2E 已验收。

## Repository

验证目标：

```text
static fallback
local D1
```

当前已验证 static fallback 和 local D1（migration 已是最新、全量 import 成功，并完成 Norse 代表性计数对照）；本地 HTTP smoke 还验证了 scope selection、Graph sourceRefs 和概念关系 HTML；Production D1 仍需执行真实 remote import 后补测。

Remote 只读审计已在成功窗口完成，详见 `docs/NORSE_REMOTE_D1_AUDIT.md`：远端当时可查询，但只应用到 `0038_english_core_content.sql`，`0039–0041` pending；北欧远端镜像为旧数据，且缺少当前 Graph 所需的 structured schema。随后 Wrangler 会话出现 `9109` / `10000` 认证错误，需重新认证后复跑审计；未获得远端写入窗口前不执行 migration、import 或 production deploy。

至少：

- getCharacterBySlug；
- getCharactersForMythology；
- getCharacterRelations；
- graph neighborhood；
- content concepts。

## API

`/api/character-graph`：

- 400 missing character；
- 404 unpublished / unknown；
- invalid scope；
- default scope；
- alternate scope；
- depth 1；
- depth 2；
- node limit；
- interpretation compatibility。

## Browser / E2E

Desktop Light + Dark：

```text
Odin
Loki
Tyr
Fenrir
```

流程：

```text
open page
→ open graph
→ scope switch
→ focus node
→ inspect relation/source
→ expand
→ reset
→ close
→ reopen
```

Mobile：

```text
Thor
Freyja
```

验证：

- 页面可滚；
- graph 可拖；
- browser back 正常；
- Hero 不横向溢出；
- controls 不遮挡节点详情。

2026-09-07 本地 Worker 浏览器 smoke 已完成的核心矩阵：

- Odin 角色页在无图谱初态可见 SSR 文字关系区；打开图谱后可切换 `Eddic and Prose Edda tradition` 与 `Völuspá Æsir–Vanir conflict tradition`，按钮 `aria-pressed` 和关系摘要随范围变化；关闭后焦点回到“查看神谱”触发器。
- 默认 Dark 切换到 Light 后 `data-theme` 与主题按钮标签同步变化。
- Thor 在 `390×844` 视口打开图谱后页面 `scrollWidth === clientWidth`，没有横向溢出，文字关系降级仍存在。
- Desktop Light/Dark 下 Odin、Loki、Tyr、Fenrir 均完成打开图谱、传统范围切换、重置视角、关闭、重开；每次打开 1 个 Canvas，关闭后回到 0，页面无横向溢出。
- Mobile `390×844` 下 Thor、Freyja 均完成打开、传统范围（如有）切换、关闭和 Canvas 回收；页面无横向溢出；Thor 从角色页进入阿斯加德后浏览器返回可回到角色页。
- 停止本地 Worker 模拟 Graph API 失败时，详情区显示“神谱暂时无法载入；下方文字关系仍可阅读”，且文字关系区仍存在；最新构建产物下失败后没有残留 Canvas。
- 在本地回环地址使用 `?graphFailure=webgl` 注入 Canvas 已创建后的图谱初始化失败，详情降级和文字关系保留，Canvas 数量为 0。
- 连续打开/关闭 Odin 图谱 10 次：每次打开最多 1 个 Canvas，关闭后 Canvas 数量均回到 0。

这已覆盖计划中的 Desktop/Mobile 核心路径、可重复的本地故障注入、listener 生命周期与 renderer resource profile；GPU telemetry、真实硬件禁用 WebGL 的环境差异，以及 remote / production 路径仍保持待验收。

---

# 17. 北欧补全完成后的 DoD

## 内容

```text
P0 Story dependency closure = 100%
P0 relation source coverage = 100%
P0 stable identity source coverage = 100%
P0 canonical design coverage = 100%
invalid endpoint = 0
orphan story dependency = 0
```

## Detail

每个 P0 Character：

- 页面可访问；
- Hero 正确；
- aliases 可用；
- World / Story 可达；
- Artwork / empty state 正确；
- Creator context 正确；
- source relation 可读。

## Graph

每个 P0 Character：

- 至少 focus node 可显示；
- 有 relation 时 direct graph 正确；
- parent direction 不反；
- symmetric edge 无伪方向；
- alternate tradition 不混；
- source 可查看；
- node limit 可解释；
- error 有 textual fallback。

## Cross-environment

```text
Static fallback
Local D1
Production D1
```

三者实体 id / slug / relation semantics 一致。

当前状态：Static fallback、Local D1 与本地 HTTP smoke 已有自动化/命令证据；Production D1 以及 production smoke 尚未执行，故本 DoD 仍为待验收。

## Engineering

```text
npm test
npm run content:validate
npm run migration:check
npm run check
provenance audit
```

全部通过。

当前代码侧已通过 `npm test -- --run`、`npm run content:coverage:norse`、`npm run provenance:audit -- --local` 与 `npm run check`；`npm run content:certify:norse` 仍应失败，直到人工来源审校、视觉审批、身份审计、产品签字和独立 Snapshot approval 全部具备。

---

# 18. 最终执行原则

北欧补全不是给现有网站“再灌一批数据”。

正确顺序是：

```text
先修通用内容入口
→ 修关系语义
→ 建 Norse Story / Character closure
→ 导入 D1
→ Character Detail 消费完整上下文
→ Graph 消费 source-scoped relations
→ Visual Tier 补图
→ 性能 / 可访问 / provenance 验收
```

其中最重要的一条规则：

> **神谱可视化不能比底层史料模型更“确定”。来源有异说，图谱就必须允许异说；来源没有统一九界地图，产品也不能因为 3D 图好看就制造一个统一 Canon。**

这会是 MythCanvas 后续埃及、日本、印度、中国等完整内容体系复用的标准。
