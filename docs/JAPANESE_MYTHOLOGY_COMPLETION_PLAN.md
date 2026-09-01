# MythCanvas 日本神话完整补全方案

> 状态：Optimized Baseline + Implementation Record
> 版本：V1.2
> 日期：2026-09-02  
> 适用范围：日本神话内容建模、神代人物扩充、神谱关系、World / Scene、Story、来源体系、视觉资产、Character Detail / Graph、结构化内容流水线与后续 AI 出图。  
> 相关文档：`docs/GREEK_MYTHOLOGY_COMPLETION_PLAN.md`、`docs/NORSE_MYTHOLOGY_COMPLETION_PLAN.md`、`docs/NORSE_CHARACTER_DETAIL_GRAPH_INTEGRATION_PLAN.md`、`docs/CONTENT_POSITIONING.md`、`docs/CHARACTER_ART_SYSTEM.md`、`.agents/skills/mythcanvas-content-model/SKILL.md`

---

# 0. Review 结论

V1.0 的大方向正确：Story First、记纪双源、辉夜姬纠偏、World / Scene 分层、Visual DNA 去“旅游日本化”、通用 Pipeline 都应保留。

但对照已经实施的希腊方案与最新北欧方案后，V1.0 仍有 8 个必须修正的问题：

1. **“30 篇”不能成为隐性数量 KPI**：希腊、北欧都已经从固定实体数量转向 Coverage / Dependency Closure；日本 Story 也应按真实叙事单元合并或拆分，数量是结果，不是目标。
2. **必须保留现有 3 个 Story ID / slug**：`story-izanagi-izanami`、`story-amaterasu-cave`、`story-kaguya-return` 已进入公开内容，补全时不能无说明替换成 30 个全新 Story。
3. **Character stable type 必须与希腊 / 北欧统一**：不能新增 `primordial-deity / nature-deity / culture-deity / divine-ancestor / legendary-person` 作为日本专属 stable type；这些应进入 taxonomy / tradition tags。
4. **Relation / Graph 必须服从当前 Schema**：现有 `CharacterRelation.confidence` 是 `high / medium / contested`，不是 V1.0 拟议的 `direct / editorial-normalized / interpretive`；编辑归一化应由 `ContentClaim.status`、`traditionScope`、`sourceRefs` 表达。
5. **Canonical Design 不新增日本专属字段**：V1.0 中的 `sourceScopedFacts / sacredObjects` 当前不属于通用 `CanonicalDesign`；来源差异用 `ContentClaim`，圣物优先落 `Character.symbols / anchors / mythologicalFacts`，除非未来做通用 Schema 扩展。
6. **Watatsumi Palace 不能直接当 World 名称**：宫殿是 Scene 语义；若海神叙事确需独立 World，应先建“海神之国 / 海域”级 World，再挂 `scene-watatsumi-palace`。
7. **必须补齐测试、CI、static fallback / D1 parity**：北欧 Review 已指出 Greek-only Repository / validator / sync 是跨文明 P0 风险，日本不能只写“建 registry”，还要把无 D1 fallback、D1 merge、Graph、sitemap 一起纳入 DoD。
8. **视觉生产不能反向阻塞内容 P0**：Tier S PC / Mobile 壁纸移到 P1；P0 先完成来源、依赖、Canonical Design 和最低可用视觉，延续希腊 / 北欧的内容图谱优先策略。

因此 V1.1 的定义不是“把日本方案写得更长”，而是：

> **让日本神话严格复用希腊已经验证、北欧正在泛化的同一套 Completeness Standard、Schema 和工程流水线，同时保留日本记纪异说、多传统分层和神代视觉的独特性。**

---

# 1. 当前仓库基线与不可破坏约束

当前已经存在：

```text
myth-japanese
world-takamagahara
character-kaguya
story-izanagi-izanami
story-amaterasu-cave
story-kaguya-return
```

以及：

- 通用 `Character / CharacterRelation / CharacterInterpretation / CharacterVariant`；
- `World / Scene / MythStory / ContentClaim / SourceRef / TaxonomyTerm`；
- Character Detail；
- 3D Character Graph；
- Greek Structured Content Pipeline；
- Story dependency validation；
- provenance audit；
- sitemap / Story detail route。

## 1.1 Stable ID / URL Policy

以下 ID / slug 必须保留：

```text
character-kaguya / kaguya
story-izanagi-izanami / izanagi-izanami
story-amaterasu-cave / amaterasu-cave
story-kaguya-return / kaguya-return
world-takamagahara / takamagahara
```

Story 可以重写正文、调整 volume、补依赖与来源，但不删除公开 URL。

## 1.2 辉夜姬必须纠偏，但不破坏历史 URL

当前问题：

```text
character-kaguya
mythologyId = myth-japanese
worldIds = [world-takamagahara]
```

V1.1 规则：

- 保留 `character-kaguya` 与 `slug=kaguya`；
- 保留 `story-kaguya-return`；
- 从 `world-takamagahara` 解绑；
- `canonicality = literary`；
- Story `kind = literary-fantasy`；
- tradition / taxonomy：`classical-tale`、`taketori-monogatari`、`lunar-origin`；
- 不新增日本专属 `legendary-person` stable type；实现时优先复用通用 `hero` 作为文学叙事主角类型，如未来认为通用类型不足，应先做跨文明 Schema Review，而不是只为辉夜姬扩枚举；
- “月宫十二单”“月升神相”等现有 Variant 可以保留，但属于 MythCanvas visual interpretation / original design，不得写回《竹取物语》原典事实。

---

# 2. “完整”的统一定义

日本神话的完整不等于“八百万神大全”，也不等于神社祭神数据库。

P0 的用户侧完整定义：

> 用户可以从天地初成开始，连续理解国生、神生、黄泉、禊祓、三贵子、高天原冲突、天岩户、须佐之男与八岐大蛇、大国主与出云、葦原中国平定、国让、天孙降临、木花咲耶姬、海幸山幸；所有关键人物、地点、关系与版本声明都有可追溯来源，不存在核心依赖悬空。

## 2.1 P0 硬指标

延续 Greek / Norse Completeness Standard：

```text
Core Narrative Coverage = 100%
P0 Story Entity Dependency Closure = 100%
P0 Genealogy Dependency Coverage = 100%
P0 Required Narrative Relation Coverage = 100%
P0 Stable Identity Source Coverage = 100%
P0 Core Relation Source Coverage = 100%
P0 Story Primary-source Coverage = 100%
P0 Canonical Design Coverage = 100%
Conflicting-source Claims Without Scope = 0
Duplicate Canonical Relation = 0
Invalid Relation Target = 0
Orphan Entity Reference = 0
Kaguya Takamagahara Misclassification = 0
```

**不设**：

```text
Character >= 50
Relation >= 150
World = 5
Story 必须 = 30
```

Story / Character / World / Scene / Relation 数量都由 Narrative Coverage 与 Dependency Closure 决定。

## 2.2 P1

- Tier S / A 正式视觉资产；
- 核心 World desktop + mobile hero；
- 更多《日本书纪》异传；
- 《风土记》地方传统；
- 月读 / 保食神独立循环；
- 古典物语卷；
- SEO / alias / romanization 深化；
- Graph / Character Detail 高级交互。

## 2.3 P2

- 更多风土记地方神；
- 中世神佛习合；
- 本地垂迹；
- 民间传说；
- 江户妖怪图谱；
- 现代 reception / scholarship layer。

P2 不阻塞神代主干上线。

---

# 3. 来源体系与 Tradition Scope

日本神话的核心风险不是“资料太少”，而是把不同时代、不同文本、不同异说压成一个貌似确定的答案。

## 3.1 P0 Source Tier

### Tier 1A：Kojiki / 《古事记》上卷

P0 主来源之一：

- 天地初成；
- 别天津神 / 神世七代；
- 伊邪那岐 / 伊邪那美；
- 国生 / 神生；
- 黄泉；
- 禊祓；
- 三贵子；
- 天照 / 须佐之男；
- 天岩户；
- 八岐大蛇；
- 大国主；
- 国让；
- 天孙降临；
- 木花咲耶姬；
- 海幸山幸。

### Tier 1B：Nihon Shoki / 《日本书纪》卷第一、卷第二

与《古事记》并列作为 P0 主来源，但必须区分：

```text
main text
一书异传 A
一书异传 B
...
```

不得把多个“一书”合成一个 global `nihon-shoki-alt-1`。scope 必须能定位到具体 Story / passage，例如：

```text
nihon-shoki-book1-main
nihon-shoki-book1-amaterasu-alt-01
nihon-shoki-book1-kuniyuzuri-alt-02
nihon-shoki-book2-tenson-main
```

精确章节 / 段落位置继续放 `SourceRef.locator`。

### Tier 2：Fudoki / 《风土记》

重点《出云国风土记》。用于：

- 地方版本；
- 国引；
- 出云地方神；
- 与记纪不同的地域谱系。

默认 P1；若某 P0 Story 明确依赖则可局部升为 P0 Source。

### Tier 3：古代补充文本 / 仪式与祭祀材料

例如：

- 《古语拾遗》；
- 《延喜式》祝词 / 相关祭祀材料；
- 其他可明确定位的古代材料。

主要用于 source enrichment、cult / ritual reception，不自动取代记纪叙事。

### Tier 4：Academic Secondary

用于：

- 异文整理；
- 名称辨析；
- 语义争议；
- 现代学术讨论。

不把现代研究结论伪装成古代 primary claim。

## 3.2 Tradition Layer

```text
classical-myth         记纪神代主干
regional-fudoki        风土记地方传统
classical-tale         古典物语，如《竹取物语》
medieval-syncretic     中世神佛习合 / 本地垂迹
folklore               民间传说 / 地方信仰
edo-yokai              江户以后妖怪图谱传统
modern-reception       现代文学、动漫、游戏、影视再解释
```

P0 建设 `classical-myth`；已有辉夜姬作为 legacy `classical-tale` 保留。

## 3.3 Claim-level Source Policy

来源不能只挂在“角色简介”上。

### Character

至少区分：

```text
stable identity source
name / alias source
domain / role source
```

### Relation

父母、子女、配偶、谱系、盟友 / 对手直接挂 `CharacterRelation.sourceRefs`。

### Story

每篇 published P0 Story：

```text
sources.length >= 1
requiredSourceIds satisfied
requiredCharacterIds valid
requiredWorldIds valid
requiredSceneIds valid
```

### Conflicting Claim

使用现有：

```text
ContentClaim.status = supported | contested | editorial-synthesis
ContentClaim.traditionScope
ContentClaim.sourceRefs
```

不要新增 Japanese-only “editorial confidence” 字段。

---

# 4. P0 Story Manifest — Narrative Coverage First

V1.0 的 30 篇列表覆盖面基本正确，但存在两类问题：

1. 为凑 30 条把同一叙事过度拆分，例如黄泉、天岩户；
2. 反而把 `天若日子失败`、`大物主显现` 等主线依赖放在 P0.5。

V1.1 改为：

> **先固定 Narrative Units；实施时允许按篇幅与来源边界合并 / 拆分。当前 Manifest 约 30 个 Story unit，但数量不是验收 KPI。**

## Volume 1：天地初成、国生与黄泉

1. 天地初成与别天津神
2. 神世七代
3. 伊邪那岐与伊邪那美：天之浮桥、淤能碁吕岛与结缘  
   - 保留 legacy：`story-izanagi-izanami`
4. 国生与大八洲
5. 神生、迦具土与伊邪那美之死
6. 黄泉之国与黄泉比良坂
7. 伊邪那岐禊祓与三贵子诞生

说明：

- `story-izanagi-izanami` 不删除；正文可从当前“造岛、死亡与黄泉”宽泛故事收紧为伊邪那岐 / 伊邪那美主入口，并通过 related Story 串联后续黄泉篇。
- “日本列岛诞生”文案避免直接套现代国家疆域概念，优先使用文本中的国生 / 大八洲叙事语境。

## Volume 2：高天原、誓约与天岩户

8. 须佐之男哭泣与放逐命令
9. 天照与须佐之男誓约
10. 须佐之男大闹高天原
11. 天照隐入天岩户、众神迎回太阳  
    - 保留 legacy：`story-amaterasu-cave`

说明：

天宇受卖、思兼、天手力男等依赖从 Story closure 进入 Character；不再把“隐入”和“迎回”强拆成两个 Story 只为增加数量。

## Volume 3：须佐之男与出云、大国主循环

12. 须佐之男降临出云
13. 八岐大蛇与草薙剑
14. 因幡白兔
15. 大国主与八十神
16. 大国主进入根之坚州国、须势理毗卖与试炼
17. 少彦名与大国主共同经营国土
18. 少彦名离去、大物主显现与国土完成

V1.1 将“大物主显现”从 P0.5 升入 P0，因为它直接承接大国主经营国土的主线闭包。

## Volume 4：葦原中国平定与国让

19. 高天原决定平定葦原中国、天菩比神使者线
20. 天若日子使命失败与返矢
21. 建御雷降临稻佐之滨  
    - 《日本书纪》中经津主等参与差异必须 source scoped
22. 事代主、建御名方与大国主国让

V1.1 将天若日子从 P0.5 升入 P0，否则“使者失败 → 武神降临”的因果链会悬空。

## Volume 5：天孙降临

23. 天忍穗耳与邇邇艺：天孙人选与命令
24. 邇邇艺降临高千穗、猿田彦引路、天宇受卖
25. 木花咲耶姬与石长比卖
26. 木花咲耶姬火中生产

## Volume 6：海幸山幸与神代收束

27. 火照与火远理：海幸、山幸与失钩
28. 火远理进入海神之宫、丰玉姬与潮盈珠 / 潮干珠
29. 丰玉姬生产、海陆边界与神代谱系过渡

## P0.5 / P1 候选

- 月读与保食神：《日本书纪》重要独立传统；
- 国引神话：《出云国风土记》；
- 大国主与沼河比卖；
- 更多国让异说；
- 常世国相关传统；
- 鹈葺草葺不合命至神武的更完整过渡；
- 辉夜姬归月：保留 `story-kaguya-return`，归 `classical-tale`，不进入神代主线 volume。

## 4.1 Story Dependency Contract

每个 P0 Story 进入 `published` 前必须满足当前 `MythStory` 已支持的字段：

```text
requiredCharacterIds ⊆ Character dataset
requiredWorldIds     ⊆ World dataset
requiredSceneIds     ⊆ Scene dataset
requiredSourceIds    satisfied
sources              != empty
```

规则：

- 核心参与者必须实体化；
- 只在背景一句出现、且无浏览 / Graph / Artwork 复用价值的名字不强制 Character 化；
- 任何 alternate version 只有在产品上需要浏览、Graph 或 Story 比较时才强制实体化其专属参与者；
- 最终 Character / Scene / Relation 数量由 validator 输出后人工 Review。

---

# 5. Character Taxonomy 与 Dependency Closure

## 5.1 Stable Entity Type：完全复用 Greek / Norse

```text
deity
hero
mortal
monster
creature
collective
```

禁止新建：

```text
primordial-deity
nature-deity
culture-deity
divine-ancestor
amatsukami
kunitsukami
legendary-person
```

作为 stable type。

这些通过 `traditionTags / TaxonomyTerm` 表达。

## 5.2 Japanese Taxonomy

### lineage

```text
kotoamatsukami
amatsukami
kunitsukami
izanagi-izanami-line
susanoo-izumo-line
tenson-line
sea-line
```

### domain

```text
solar
storm
sea
wisdom
agriculture
boundary
mountain
fire
```

### story-cycle

```text
origins
yomi-misogi
takamagahara
izumo-cycle
kuniyuzuri
tenson-korin
sea-cycle
```

### editorial-collection

```text
classical-myth
regional-fudoki
classical-tale
medieval-syncretic
folklore
edo-yokai
```

原则：

> `characterType` 回答“它是什么”；taxonomy 回答“它属于哪一神系、领域、故事循环或编辑传统”。

## 5.3 Tier S — 品牌级核心角色

1. 伊邪那岐 / Izanagi
2. 伊邪那美 / Izanami
3. 天照大神 / Amaterasu
4. 须佐之男 / Susanoo
5. 月读 / Tsukuyomi
6. 大国主 / Ōkuninushi
7. 建御雷 / Takemikazuchi
8. 邇邇艺 / Ninigi
9. 木花咲耶姬 / Konohanasakuya-hime
10. 天宇受卖 / Ame-no-Uzume
11. 猿田彦 / Sarutahiko
12. 八岐大蛇 / Yamata no Orochi

Tier S 是视觉优先级，不是 P0 Character 总名单。

## 5.4 P0 Tier A / Closure 候选

Story closure 大概率自然引入：

- 天之御中主 / Ame-no-Minakanushi；
- 高御产巢日 / Takamimusubi；
- 神产巢日 / Kamimusubi；
- 迦具土 / Kagutsuchi；
- 思兼 / Omoikane；
- 天手力男 / Ame-no-Tajikarao；
- 天儿屋命 / Ame-no-Koyane；
- 布刀玉命 / Futodama；
- 栉名田比卖 / Kushinadahime；
- 足名椎 / Ashinazuchi；
- 手名椎 / Tenazuchi；
- 须势理毗卖 / Suseribime；
- 少彦名 / Sukunahikona；
- 大物主 / Ōmononushi；
- 天菩比神 / Ame-no-Hohi；
- 天若日子 / Ame-no-Wakahiko；
- 事代主 / Kotoshironushi；
- 建御名方 / Takeminakata；
- 经津主 / Futsunushi（《日本书纪》国让相关重要异说依赖）；
- 天忍穗耳 / Amenooshihomimi；
- 石长比卖 / Iwanagahime；
- 火照 / Hoderi；
- 火远理 / Hoori；
- 丰玉姬 / Toyotama-hime；
- 海神 / Watatsumi。

最终名单必须由 Story dependency report 决定，不按本候选表凑齐。

---

# 6. Character Production 与 Interpretation 边界

每个 P0 Character 最低要求：

```text
Character
├── stable identity
├── characterType
├── traditionTags / taxonomy
├── names / aliases
├── sourcePeriods
├── sourceRefs
├── canonicality
├── symbols
├── canonicalDesign
├── core relations
├── world / scene affinity
├── story linkage
└── generation prompt
```

## 6.1 Canonical Design 必须使用当前通用字段

优先使用：

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

`Character.symbols` 承担稳定符号 / 圣物入口。

存在来源冲突的事实不要新造 `sourceScopedFacts` 字段，而是进入：

```text
ContentClaim
+ traditionScope
+ sourceRefs
```

如果未来确需 `sacredObjects` 等字段，必须作为跨文明 Schema 提案评估，不能只在 Japanese data package 中私自扩语义。

## 6.2 Interpretation 创建规则

延续 Greek / Norse：只有来源差异会实质改变以下至少一项时才建 Interpretation：

- 稳定身份；
- 神职 / 权能；
- 用户真正需要切换的传统角色形态；
- 稳定视觉锚点；
- Generation Prompt。

以下通常**不**单独建 Interpretation：

- 父母 / 子女差异；
- 国让执行者差异；
- 同一 Story 的事件顺序差异；
- 某一文本多一个参与者；
- 月读 / 保食神只出现在某一来源。

这些优先进入 source-scoped Relation / Story / ContentClaim。

原则：

> **relation difference != interpretation difference**

---

# 7. Character Relation Storage Rule 与 Graph

日本神话的 Graph 必须比“漂亮的家谱图”更重视版本选择。

## 7.1 直接复用当前 CharacterRelation 字段

```ts
{
  assertionKey?: string,
  traditionScope?: string,
  isDefault?: boolean,
  sourceRefs: SourceRef[],
  confidence: 'high' | 'medium' | 'contested'
}
```

不要写入当前 Schema 不支持的：

```text
confidence = direct | editorial-normalized | interpretive
```

若需要表达编辑归一化，使用：

```text
ContentClaim.status = editorial-synthesis
```

## 7.2 Canonical Relation Storage

### parent

只存：

```text
parent -> child
relationType = parent
```

UI 从当前人物视角显示“父母 / 子女”，3D 边使用中性“亲子”。

### consort / sibling / ally / rival / enemy

对称关系只存一次，按稳定 ID 排序决定 from / to。

### rules-over / serves / created / associated-with 等

保持方向性。

### narrative relation

优先复用通用 relation type + Story linkage，不因为日本神话增加几十个一次性边类型。

## 7.3 Assertion Uniqueness

建议唯一语义：

```text
assertionKey + traditionScope
```

同一 `assertionKey` 可以在不同 source scope 下存在互斥 relation，但必须：

- 各自有 sourceRefs；
- 非默认异说可被用户主动选择；
- 不得在 compact default view 无说明叠加。

## 7.4 Default / Alternate Graph

默认图谱：

1. neutral / cross-tradition assertions；
2. `isDefault=true` 的明确主读法，并显示来源范围。

用户显式选择 `traditionScope` 后：

- 展示该 scope 下 active assertions；
- `isDefault=false` 不得再被过滤；
- 不把互斥异说同时画成无说明事实。

## 7.5 P0 Graph 关系组

至少覆盖：

- 伊邪那岐 ↔ 伊邪那美；
- 三贵子；
- 天照 / 须佐之男誓约所生神；
- 须佐之男 → 出云主线；
- 大国主与 P0 Story 必需配偶 / 子嗣；
- 天照 / 高御产巢日 → 天忍穗耳 → 邇邇艺的来源化关系；
- 邇邇艺 ↔ 木花咲耶姬 / 石长比卖；
- 火照 / 火远理；
- 火远理 ↔ 丰玉姬。

## 7.6 SSR 文本回退

3D Graph 不是关系唯一出口。

角色页 SSR 必须可读：

```text
父母
配偶
子女
兄弟姊妹
盟友 / 对手
关键叙事关系
来源 / 异说
```

---

# 8. World / Scene Semantics

延续 Greek / Norse：

> World = 神话宇宙中的稳定空间层；Scene = 可复用的具体地点、边界、建筑、事件空间。

不按数量凑 World。

## 8.1 P0 确定 World

### `world-takamagahara` — 高天原

保留 ID / slug，升级：

- summary；
- Canonical Design；
- Visual DNA；
- Hero；
- Character / Story / Scene linkage。

禁止默认设计成成熟神社景区。

### `world-ashihara-no-nakatsukuni` — 葦原中国

承载：

- 地上国土；
- 出云；
- 国让；
- 天孙降临之前的地上秩序。

### `world-yomi` — 黄泉国

与佛教地狱视觉严格区分。

### `world-ne-no-katasukuni` — 根之坚州国

用于大国主试炼。

不能静默等同于黄泉；若后续学术 / source review 认为产品应降级为 Scene / scoped subdomain，再由 World semantic review 决定。

## 8.2 Sea Realm：先解决 Palace / World 混淆

V1.0 的：

```text
world-watatsumi-palace
```

语义不够干净，因为“宫”是具体地点。

V1.1 采用两阶段策略：

```text
候选 World：world-watatsumi-realm / 海神之国（最终 display name 由 source review 决定）
Scene：scene-watatsumi-palace / 海神之宫
```

如果实现前确认文本与产品语义不足以支撑独立 World，则：

- 不为了“5 个 World”硬建；
- `scene-watatsumi-palace` 作为超自然海域 Scene；
- Story 仍完整工作。

## 8.3 P0 Scene 候选

- 天之浮桥；
- 淤能碁吕岛；
- 黄泉比良坂；
- 禊祓之滨；
- 天安河；
- 天岩户；
- 出云肥河 / 八岐大蛇现场；
- 因幡海岸；
- 根之坚州国试炼空间；
- 稻佐之滨；
- 高千穗峰；
- 木花咲耶姬火中生产之屋；
- 海神之宫。

实体化判断：

> 被至少一个 P0 Story 直接依赖，或具有高复用视觉 / Artwork 价值。

---

# 9. Japanese Visual DNA V2

当前：

```text
月白 / 墨青 / 朱红
鸟居 / 神社 / 注连绳 / 月
木 / 和纸 / 石
幽玄 / 静谧 / 灵性
```

适合“日本氛围”，不足以表达神代宇宙。

## 9.1 Mythology Base DNA

```text
palette:
- cloud white
- pearl grey
- ancient restrained vermilion
- deep indigo
- bronze
- reed gold
- sea jade

materials:
- unfinished timber
- stone
- bronze
- woven plant fiber / textile
- restrained silk-like textile where editorially appropriate
- magatama material
- mist / water

motifs:
- mirror
- magatama
- sword
- sakaki
- sacred rope as story / ritual motif
- reeds
- sacred rock
- cloud / bridge / boundary

atmosphere:
- primordial
- sacred
- liminal
- restrained
- luminous
- uncanny
- natural
```

### Base Avoid

```text
- every scene = red torii + shrine + cherry blossom
- mature modern shrine precinct as primordial default
- every goddess = Heian twelve-layer robe
- every male deity = samurai
- modern miko uniform as ancient default
- Sengoku armor
- franchise-specific anime/game silhouettes
- Chinese celestial-palace language copied wholesale
- Buddhist hell used for Yomi
- tourist-poster Japan
```

## 9.2 Narrative-domain DNA

### Takamagahara

```text
bright cloud / open sacred expanse / primordial timber / mirror / jewel / sakaki
```

### Yomi

```text
dark rock / damp cold / decay / boundary boulder / minimal warm light
```

### Izumo / Ashihara

```text
reeds / forest / river / coast / ancient timber / sword / serpent / water mist
```

### Tenson Kōrin

```text
high mountain / cloud path / rice-gold / sunlight / descent axis
```

### Sea Cycle

```text
deep sea jade / pearl light / tide / shell / liminal marine architecture
```

## 9.3 Text Facts vs Historical Reconstruction vs Original Design

日本神代没有一套可直接照抄的“角色设定集”。视觉必须三层分离：

```text
A. source-grounded mythological facts
B. historically / archaeologically inspired reconstruction
C. MythCanvas original design choices
```

B、C 均不能写入 `mythologicalFacts` 冒充《古事记》《日本书纪》直接记载。

例如：

- 天照的太阳 / 天岩户 / 镜关联可做 source-grounded anchor；
- 某种具体古代服装裁剪属于 historical inspiration / design choice；
- 发光日轮盔甲属于原创视觉，不是古典事实。

## 9.4 角色防错

- 天照不默认十二单；
- 须佐之男不默认现代武士；
- 建御雷不默认战国武将；
- 大国主不默认现代神官服；
- 天宇受卖不默认现代巫女制服；
- 猿田彦不简化为红脸天狗；
- 八岐大蛇保留八首 / 八尾核心身份，不泛化成普通东方龙；
- 辉夜姬的宫廷美学归《竹取物语》层，不反向污染神代 Visual DNA。

Prompt 继续保持正交：

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

# 10. Structured Content Pipeline：第三文明必须真正通用化

日本不允许新增：

```text
sync-japanese-content.mjs
japanese-only repository fallback
japanese-only sitemap
japanese-only graph loader
```

## 10.1 目标 Bundle

```text
src/content/
├── registry.ts
├── greek/
├── norse/
├── maya/
└── japanese/
    ├── catalog.ts
    ├── stories.ts
    ├── assets.ts
    ├── visual-tiers.ts
    └── index.md
```

如通用 Source Registry 实施后证明有必要，可增加：

```text
sources.ts
```

但它必须是所有文明都可选用的能力，而不是 Japanese-only contract。

## 10.2 Generic Registry

目标：

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
}
```

Repository 统一：

```text
getStructuredBundle(mythologyId)
getStructuredCharacters(mythologyId)
getStructuredRelations(mythologyId)
```

不再出现：

```text
mythologyId === 'myth-greek'
mergeGreekCharacters()
```

## 10.3 Pipeline

```text
structured mythology package
        ↓
schema validation
        ↓
dependency validation
        ↓
source / relation validation
        ↓
normalized manifest
        ↓
idempotent D1 sync
```

统一命令：

```bash
npm run content:validate
npm run content:import -- --mythology=japanese
```

或由 registry 自动发现全部 bundle。

## 10.4 Static Fallback / D1 Parity

P0 DoD：

- `DB === undefined` 时 Japanese structured Character / Relation / Story 可被 Repository 读取；
- D1 存在时按 stable ID merge / override；
- local static fallback、local D1、production D1 的实体 ID / slug /关系语义一致；
- 新增第四文明时只注册 Bundle，不改 Repository。

## 10.5 Legacy Story Migration

当前 `src/data/stories.ts` 中的 3 个 Japanese Story 迁入 `src/content/japanese/stories.ts`：

```text
story-izanagi-izanami
story-amaterasu-cave
story-kaguya-return
```

迁移后删除 inline duplicate，避免双份 source of truth。

## 10.6 Validator

至少检查：

```text
stable id / slug uniqueness
legacy id / slug preservation
story dependency closure
required source coverage
relation target validity
assertionKey + traditionScope conflicts
canonical relation duplicates
characterType generic vocabulary
world / scene semantics
interpretation ownership
Kaguya world / taxonomy correction
asset provenance completeness
```

---

# 11. 页面、Character Detail 与 Search

日本不新造一套页面体系，直接消费通用内容模型。

## 11.1 `/mythology/japanese/`

应展示：

```text
Hero
→ 神代导览
→ Story Volumes
→ Core Characters
→ Character Taxonomy
→ Core Worlds
→ Genealogy / Character Graph entry
→ Sources / Version Note
→ Artwork
→ Classical Tale 入口（P1）
```

## 11.2 Story Detail

共享：

```text
/mythology/japanese/[story]/
```

每篇包括：

- source context；
- 正文；
- related Characters；
- related Worlds / Scenes；
- previous / next；
- alternate tradition note；
- illustration / Artwork。

## 11.3 Character Detail ViewModel

```text
Identity
Source-scoped Claims
Symbols
Canonical DNA
Interpretation（按需）
Variant
Relations
Stories
World / Scenes
Artwork
Creation
```

## 11.4 Japanese Name / Romanization Policy

每个高价值角色至少支持：

```text
中文常用名
日文表记（汉字 / 假名，适用时）
Hepburn romanization
ASCII alias
常见 English form
```

URL slug：

- ASCII；
- human-readable；
- 不含 macron；
- 一旦发布保持稳定。

例如：

```text
display: Ōkuninushi
slug: okuninushi
aliases: 大国主 / 大国主神 / Okuninushi
```

## 11.5 Sitemap / SEO

只要 Japanese Story 进入共享 `getPublicStories()` / registry：

- 自动进入 sitemap；
- 不增加 Japanese-only sitemap；
- Story / Character / World 的 JSON-LD 使用共享实现；
- alias search 支持中文、日文、Romanization。

---

# 12. Visual Tier：P0 内容闭包，P1 大规模出图

V1.0 把 Tier S PC / Mobile 全部放在主实施批次，容易让图像生产阻塞内容闭包。

V1.1 与 Greek / Norse 对齐。

## 12.1 P0 Content Gate

每个 P0 Character：

```text
Canonical Design = complete
source coverage = complete
story / relation linkage = complete
```

Tier S 在公开发布前至少：

```text
production portrait / reference = 100%
```

若某 Tier A 暂无正式肖像：

- 使用 Canonical symbols + role 的高质量 Symbol Fallback；
- 禁止用通用 AI 人像冒充正式角色肖像。

## 12.2 P1 Tier S

12 个 Tier S：

```text
Canonical mobile portrait/reference
PC wallpaper >= 1
Mobile wallpaper >= 1
高价值角色多 Style
```

## 12.3 P1 Tier A

```text
Canonical portrait/reference
+ PC / Mobile 至少一种 Wallpaper（按价值排序）
```

## 12.4 World

每个正式发布的 P0 World 在 public release 前至少有：

```text
desktop hero
mobile hero（若 World 页面当前产品规范要求双端独立构图）
alt / width / height
creator / license / source_type
AI provenance when applicable
```

## 12.5 Story

不要求“一篇 Story = 一张独立新图”。

每篇 published Story 必须有有效 Hero Asset，可复用：

- Character Artwork；
- World Artwork；
- Scene Artwork；
- 已有 Story Illustration；

前提：narrative fit + provenance 完整。

优先独立制作：

- 黄泉；
- 禊祓；
- 天岩户；
- 八岐大蛇；
- 国让；
- 天孙降临；
- 海神之宫。

---

# 13. 测试与 CI

日本作为第三个 structured mythology package，必须证明系统已经文明无关。

## 13.1 Content Tests

建议：

```text
tests/japanese-content.test.*
```

至少覆盖：

- `character-kaguya` ID / slug 不变；
- 3 个 legacy Story ID / slug 不变；
- Kaguya 不属于 `world-takamagahara`；
- Kaguya Story `kind = literary-fantasy`；
- P0 Story required dependency 全部存在；
- P0 Story required source 全部存在；
- `characterType` 只使用通用 stable vocabulary；
- relation source coverage 100%；
- alternate `traditionScope` 可以被 Graph 主动选择；
- `isDefault=false` 的异说不会永远不可达；
- parent relation 从当前角色视角正确显示父母 / 子女；
- Watatsumi World / Palace Scene 不混淆；
- Japanese structured Story 可以被 `getStoriesForMythology('myth-japanese')` 读取；
- sitemap 可以发现 published Japanese Story。

## 13.2 Static / D1 Integration

必须测：

```text
static fallback
local D1
production-like D1 merge contract
```

至少保证同一 Character / Relation 的 stable ID、scope、默认边语义一致。

## 13.3 CI

最终只使用通用命令：

```bash
npm test
npm run content:validate
npm run provenance:audit -- --strict
npm run check
```

不要新增：

```text
japanese:validate
japanese:test
japanese:deploy
```

---

# 14. 实施顺序

## P0-0：冻结规范

- [ ] Narrative Coverage 与 Story unit 边界；
- [ ] Source Tier / tradition scope；
- [ ] common `characterType` vocabulary；
- [ ] Canonical Relation Storage Rule；
- [ ] Interpretation boundary；
- [ ] Kaguya migration rule；
- [ ] World / Scene semantics；
- [ ] Visual fact / reconstruction / original-design boundary。

## P0-1：通用化 Structured Content Pipeline

- [ ] `src/content/registry.ts`；
- [ ] Repository 去 Greek-only；
- [ ] validator 通用化；
- [ ] D1 sync 通用化；
- [ ] coverage reporter 通用化；
- [ ] CI 自动验证全部 registered mythology；
- [ ] static fallback / D1 parity tests。

**DoD**：新增 mythology package 只需注册 Bundle，不改 Repository / Sitemap / Graph loader。

## P0-2：建立 Japanese Package + Legacy Migration

- [ ] `src/content/japanese/catalog.ts`；
- [ ] `stories.ts`；
- [ ] `assets.ts`；
- [ ] `visual-tiers.ts`；
- [ ] `index.md`；
- [ ] 迁移并保留 3 个 legacy Story ID / slug；
- [ ] Kaguya 从 Takamagahara 解绑并改为 literary layer。

## P0-3：Story Manifest + Dependency Closure

建议按叙事批次：

### Batch A：Origins / Yomi

Story 1–7。

### Batch B：Takamagahara

Story 8–11。

### Batch C：Izumo / Ōkuninushi

Story 12–18。

### Batch D：Kuniyuzuri

Story 19–22。

### Batch E：Tenson / Sea Cycle

Story 23–29。

每批都执行：

```text
Story metadata
→ required dependencies
→ Character closure
→ Relation closure
→ World / Scene closure
→ Source coverage
```

## P0-4：Character / Relation / Claim

- [ ] Stable Identity Source Coverage 100%；
- [ ] Genealogy Coverage 100%；
- [ ] Required Narrative Relation Coverage 100%；
- [ ] conflicting claim without scope = 0；
- [ ] duplicate canonical relation = 0；
- [ ] Graph tradition behavior 验证。

## P0-5：World / Scene + Visual DNA

- [ ] Takamagahara 升级；
- [ ] Ashihara no Nakatsukuni；
- [ ] Yomi；
- [ ] Ne no Katasukuni；
- [ ] Watatsumi realm semantic decision；
- [ ] Story-required Scene；
- [ ] Japanese Base DNA V2；
- [ ] World DNA；
- [ ] anti-anachronism rules。

## P0-6：Story 正文 + 页面集成

- [ ] P0 Story 正文；
- [ ] Mythology Story volumes；
- [ ] Character Detail；
- [ ] SSR relation fallback；
- [ ] Graph tradition switch；
- [ ] World / Scene linkage；
- [ ] source notes；
- [ ] alias search；
- [ ] sitemap。

## P0-7：验证与发布

- [ ] `npm test`；
- [ ] `npm run content:validate`；
- [ ] `npm run check`；
- [ ] provenance static audit；
- [ ] local D1 sync dry-run；
- [ ] local browser smoke；
- [ ] production sync；
- [ ] production provenance audit；
- [ ] deployed route smoke；
- [ ] content accuracy review；
- [ ] visual anachronism review。

## P1：Visual Production + Expansion

- [ ] Tier S PC / Mobile；
- [ ] Tier A portrait / wallpaper；
- [ ] World 正式视觉增强；
- [ ] 高价值 Story 独立插画；
- [ ] 月读 / 保食神；
- [ ] 风土记；
- [ ] 古典物语卷；
- [ ] 更多异说与地方传统。

---

# 15. 验收标准

## 15.1 Narrative Coverage

用户可以连续理解：

```text
天地初成
→ 国生 / 神生
→ 黄泉
→ 禊祓 / 三贵子
→ 高天原与天岩户
→ 须佐之男 / 八岐大蛇
→ 大国主 / 出云
→ 葦原中国平定 / 国让
→ 天孙降临
→ 木花咲耶姬
→ 海幸山幸
```

## 15.2 Entity Dependency Closure

```text
P0 Story Character dependency closure = 100%
P0 Story World dependency closure = 100%
P0 Story Scene dependency closure = 100%
orphan ref = 0
```

## 15.3 Source Coverage

```text
P0 stable identity source coverage = 100%
P0 genealogy source coverage = 100%
P0 required narrative relation source coverage = 100%
P0 active interpretation source coverage = 100%
P0 story primary-source coverage = 100%
conflicting claim without tradition scope = 0
```

## 15.4 Relationship Coverage

```text
required genealogy edge coverage = 100%
required narrative edge coverage = 100%
duplicate canonical relation = 0
invalid relation target = 0
alternate scope unreachable = 0
```

## 15.5 Model Quality

```text
characterType common-vocabulary coverage = 100%
taxonomy coverage = 100%
Interpretation only used for identity-level divergence
World does not contain a building-only Scene semantic
Scene does not duplicate World semantic
Kaguya Takamagahara misclassification = 0
legacy public id / slug breakage = 0
```

## 15.6 Visual / Provenance

P0 不以全部 PC / Mobile 壁纸为阻塞条件。

Public release：

```text
Tier S minimum portrait/reference coverage = 100%
published World hero metadata complete = 100%
published Story hero asset valid = 100%
public prototype provenance = 0
critical cultural anachronism = 0
broken production media = 0
```

P1：

```text
Tier S PC / Mobile wallpaper coverage = 100%
Tier A minimum visual coverage = 100%
```

## 15.7 用户侧认知验收

用户访问 `/mythology/japanese/` 后应该能回答：

1. 日本神代叙事从哪里开始？
2. 伊邪那岐、伊邪那美如何连接国生、神生、死亡与黄泉？
3. 天照、月读、须佐之男如何出现？
4. 天岩户为什么发生，众神如何让太阳重返世界？
5. 须佐之男为何进入出云，八岐大蛇与草薙剑是什么关系？
6. 大国主如何进入出云主线并完成国土经营？
7. 国让之前发生了哪些使者失败与谈判 / 对抗？
8. 天孙降临如何承接国让？
9. 海幸山幸如何收束神代主线？
10. 《古事记》《日本书纪》不同版本冲突时，页面能否明确告诉用户来源？
11. 辉夜姬为什么属于日本文化内容，但不属于高天原神系？

---

# 16. 最终信息架构

```text
Japanese Mythology
│
├── STORY MANIFEST
│   ├── Origins / Kuni-umi / Kami-umi
│   ├── Yomi / Misogi
│   ├── Takamagahara / Ama-no-Iwato
│   ├── Izumo / Ōkuninushi
│   ├── Kuniyuzuri
│   ├── Tenson Kōrin
│   └── Sea Cycle
│
├── CHARACTERS
│   ├── Deities
│   │   ├── Kotoamatsukami [taxonomy]
│   │   ├── Amatsukami [taxonomy]
│   │   ├── Kunitsukami [taxonomy]
│   │   └── Tenson Line [taxonomy]
│   ├── Heroes / Literary Protagonists
│   ├── Monsters
│   ├── Creatures
│   └── Collectives
│
├── WORLDS
│   ├── Takamagahara
│   ├── Ashihara no Nakatsukuni
│   ├── Yomi
│   ├── Ne no Katasukuni
│   └── Watatsumi Realm（source / semantic review 后决定）
│
├── SCENES
│   ├── Ama-no-Ukihashi
│   ├── Onogoro
│   ├── Yomotsu Hirasaka
│   ├── Misogi Shore
│   ├── Ama-no-Iwato
│   ├── Hii River
│   ├── Inasa Beach
│   ├── Takachiho
│   ├── Watatsumi Palace
│   └── ...
│
├── RELATIONS / GRAPH
│   └── source-scoped canonical + alternate assertions
│
├── SOURCES
│   ├── Kojiki
│   ├── Nihon Shoki main text
│   ├── Nihon Shoki alternate writings
│   ├── Fudoki
│   └── later scoped traditions
│
├── CLASSICAL TALES（P1）
│   └── Kaguya-hime / Taketori Monogatari
│
└── ARTWORKS
    ├── Character
    ├── World
    ├── Scene
    ├── Creature
    └── Story-linked Artwork
```

---

# 17. V1.1 已固定的 Review 决策

本轮不再留作模糊讨论，默认按以下规则执行：

```text
Story-first
Story count = editorial result, not KPI
Character count = dependency closure result
Stable characterType = common cross-mythology vocabulary
Taxonomy = civilization-specific classification
Source = claim-level
Kojiki / Nihon Shoki conflicts = scoped, never flattened
Interpretation = identity-level divergence only
Relation storage = shared canonical semantics
Graph = alternate traditions explicitly selectable
World = strict spatial semantics
Palace / landmark = Scene, not World
P0 = content graph + minimum production readiness
P1 = large-scale visual production
Pipeline = mythology-agnostic
Legacy IDs / URLs = preserved
```

最终目标不是“日本角色变多”，而是：

> **让 MythCanvas 中的日本神话成为一套从记纪神代主线出发、版本差异可追溯、人物关系可探索、空间语义清晰、视觉不落入泛和风模板，并能与希腊 / 北欧共享同一套内容工程基础设施的完整神话内容系统。**

---

# 18. 资料基线

P0 内容审核至少对照：

- 《古事记》上卷 / Kojiki Book I；
- 《日本书纪》卷第一、卷第二 / Nihon Shoki Books I-II，并保留正文与“一书”异传；
- 國學院大學 Encyclopedia of Shinto，用于名称、神格、来源差异与术语交叉校验；
- 《出云国风土记》等风土记材料，在 Story 明确依赖或进入 P1 时使用；
- 《古语拾遗》等古代补充材料，用于 P1 source enrichment；
- 现代学术研究只用于校勘、版本与语义讨论，不替代 primary source。

所有 MythCanvas 正文应原创转述，不复制现代译本长段落；具体来源差异通过 `SourceRef / ContentClaim / sourceNotes / traditionScope` 表达，而不是伪装成唯一版本。

---

# 19. V1.2 优化后的执行记录与边界

本轮已经按本方案完成一条可运行的 P0 内容工程切片，结果如下：

```text
Japanese Bundle：已注册到 shared registry
Characters：38
Worlds：5
Scenes：14
Stories：30（仅为当前编辑结果，不是数量 KPI）
Relations：30，含可主动选择的 Nihon Shoki alternate scope
Legacy Story ID / slug：3 条全部保留
Kaguya：hero + literary + worldIds=[]，不再归属 Takamagahara
Static fallback：已读取 structured Bundle
D1 importer：支持 --mythology=japanese，并按 content package 自动发现
Local D1 apply：已执行；日本核心包 38 Characters / 5 Worlds / 14 Scenes / 30 Relations 回读成功
```

本轮代码落地范围：

- `src/content/japanese/`：catalog、Story、视觉 tier、asset provenance 与统一导出；
- `src/content/registry.ts`：注册 Japanese Bundle；
- `src/lib/content/structured-content-validation.ts`：通用 Character type、World/Scene 语义与 assertion scope 校验；
- `src/lib/content/stories.ts` 与 Character / World / Scene Repository：structured static fallback 与 legacy merge；
- `scripts/sync-structured-content.mjs`：从 registered package 自动发现可导入文明；
- `tests/japanese-content.test.ts` 与 shared content tests：依赖闭包、legacy、source-scoped relation、fallback 回归；
- `src/data/stories.ts`：删除 Japanese inline duplicate，避免双份 Story source of truth。

验证命令：

```bash
npm test
npm run content:validate
npm run content:import -- --mythology=japanese
npm run typecheck
```

本地 D1 中还保留 4 条历史迁移写入的日本 P1 popular Character（稻荷、八幡、雷神、风神）；本轮不删除历史数据，后续纳入 Japanese P1 package 时再补齐来源与视觉 tier。

尚未在本轮声称完成的事项：

- 尚未执行需要凭据或部署权限的 production D1 apply；local apply 已通过，production 仍需发布窗口与凭据；
- Tier S 正式 PC / Mobile 壁纸仍属于 P1，当前复用已审核的旧有氛围图作为 P0 Story / World fallback；
- 日本角色 alias / Hepburn 名称表、Graph UI 的 tradition switch、专门 Japanese Scene 详情路由仍按共享能力后续接入；
- `Nihon Shoki` 的每一条“一书”仍需内容编辑逐段核对 `SourceRef.locator`，不能以当前包的主题级 locator 代替最终校勘。

因此本轮验收口径是：**工程闭包与可追溯内容骨架已落地；生产视觉、逐段学术校勘和部署同步不被伪装成已完成。**
