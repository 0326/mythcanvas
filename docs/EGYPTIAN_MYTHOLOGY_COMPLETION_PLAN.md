# MythCanvas 埃及神话完整补全方案

> 状态：V1.2 Implementation Plan
> 版本：V1.2
> 日期：2026-09-02  
> 适用范围：埃及神话内容建模、Story、Character、关系、World / Scene、来源体系、Character Graph、视觉资产、AI 出图与结构化内容流水线。  
> 相关文档：`docs/GREEK_MYTHOLOGY_COMPLETION_PLAN.md`、`docs/NORSE_MYTHOLOGY_COMPLETION_PLAN.md`、`docs/NORSE_CHARACTER_DETAIL_GRAPH_INTEGRATION_PLAN.md`、`docs/CONTENT_POSITIONING.md`、`docs/CHARACTER_ART_SYSTEM.md`、`docs/CHARACTER_GRAPH_PLAN.md`、`.agents/skills/mythcanvas-content-model/SKILL.md`

---

# 0. 结论

当前埃及神话已经有一个可浏览的首发骨架，但距离 MythCanvas 所定义的“完整神话体系”仍然很远。

仓库当前已有：

- `myth-egyptian`；
- `world-duat` / 杜阿特；
- `character-anubis` / 阿努比斯；
- 2 个 Anubis Variant；
- 3 篇核心 Story：拉神太阳神舟、奥西里斯死亡与复生、心脏称量；
- `scene-river-of-stars` 等基础 Scene；
- 太阳金、砂岩、青金石、黑石、太阳圆盘、圣甲虫等第一版 Visual DNA；
- 通用 Character / Relation / Interpretation / Variant / World / Scene / Story Schema；
- 希腊已经验证的 Structured Content、来源、Story 页面、关系图与内容验证能力；
- 北欧方案正在推动的 mythology-agnostic registry / validator / sync / Character Detail / Graph 通用化方向。

当前内容实际上仍接近：

```text
埃及神话
  → 杜阿特
  → 阿努比斯
  → 拉神夜航 / 奥西里斯 / 心脏称量
  → 沙漠、黑金、太阳、冥界
```

完整目标应变成：

```text
埃及神话
  → 原初状态与多个创世框架
  → 太阳循环与 Ma'at 秩序
  → Osiris–Isis–Horus–Seth 王权循环
  → 死亡、木乃伊化、审判与有效亡者的永生
  → Duat 夜航与太阳每日更新
  → Story 驱动的 Character / Relation / World / Scene 闭包
  → 跨时期、跨文本、跨地方神学中心的来源范围
  → 神祇合流与身份层叠
  → Nile / Temple / Royal / Solar / Funerary / Cosmic / Duat 多视觉域
  → 可追溯 Character Graph 与可控 AI 出图
```

本轮不定义为“再补几十个埃及神”，而定义为：

> **把埃及神话建设成一套能够表达三千年历史层叠、地方神学并存、神祇合流、王权与葬祭宇宙观的完整内容宇宙，并验证 MythCanvas 的通用内容工程可以处理比希腊 / 北欧更复杂的身份与来源问题，而不是制造 Egyptian-only 特例。**

## 0.1 V1.1 相比 V1.0 的核心修正

本次 Review 参考希腊 V1.1 与北欧方案，重点修正 8 个问题：

1. **统一 Stable Character Type**：不再为埃及单独引入 `primordial-being / personified-principle / divine-animal` 等 type；继续使用通用 stable type，埃及差异进入 taxonomy / identity attributes。
2. **固定 Canonical Relation Storage Rule**：继承希腊 / 北欧单边存储规则，不同时存 parent + child，不让埃及图谱形成重复边。
3. **Syncretism 从“实现时再决定”升级为确定性 Identity Resolution Matrix**：Alias、Iconographic Form、Interpretation、独立 Syncretic Character 四层明确分界。
4. **Horus 身份边界具体化**：P0 `Horus` 默认承载 Osirian kingship cycle；Horus the Elder、Harpocrates、Ra-Horakhty 不再含糊塞进年龄 Variant。
5. **World 语义收紧**：默认 P0 World 只建立真正稳定、复用的宇宙空间；Nun、First Mound、Aaru 等优先作为 Concept / Scene / Region，而不是为了“丰富地图”机械升级 World。
6. **P0 内容完整度与 P1 视觉生产拆开**：所有 P0 Character 必须有 Generation-grade Canonical Design；Tier S 18 是视觉生产优先级，不再把 18 个正式 Portrait / Wallpaper 当 P0 内容上线门槛。
7. **Structured Content Package 对齐 Greek / Norse**：不在 `src/content/egyptian/` 内创建 Egyptian-only validator / importer；validator、normalizer、D1 sync、coverage reporter 必须通用。
8. **新增 Narrative Unit Quality Gate**：Story Manifest 不允许为了凑 28 篇把一次仪式拆成若干重复页面；每个 Story / religious-tradition unit 必须能独立回答一个用户问题并具备独立来源价值。

## 0.2 V1.2 Review 结论与本轮落地边界

对照当前仓库实现后，V1.1 还需要一个更可执行的切片边界。当前代码已经具备：

- Greek / Norse 共用的 structured bundle registry、validator、D1 sync 与 Story detail route；
- `SourceRef.locator`、`MythStorySource.tradition / period / locator`、`required*Ids` 等闭包基础字段；
- 现有 Egyptian `myth-egyptian`、`world-duat`、`character-anubis`、3 个 legacy Story 与 legacy artwork ID；
- Repository 层将 structured content 合并到 D1 查询结果的能力。

当前真正阻塞 Egyptian 上线的不是页面骨架，而是：

1. Egyptian 尚未注册为 structured bundle，因此通用验证、同步和 Story 路径不会发现它；
2. local seed 读取路径未合并 structured Egyptian 数据，离线浏览与 D1 读取的内容集合不一致；
3. 现有 3 个 Egyptian Story 仍缺少完整的 Story dependency closure，Ra / Osiris / Isis 等核心实体没有进入同一内容包；
4. sync 脚本仍用 Greek/Norse 白名单，新增文明会被脚本拒绝，违反“generic pipeline”目标；
5. 现有 validator 能检查端点和 locator，但尚未把 Story claim 的 subject、source scope 和 relation canonical key 全部变成通用硬检查。

因此本轮 V1.2 的可交付定义为 **P0 Content Closure Slice**：

```text
Egyptian structured package
→ registry discovery
→ generic validation
→ local seed / repository consumption
→ generic D1 dry-run SQL
→ 28 Story manifest units
→ required entity / relation / source closure tests
```

本轮明确不把以下工作伪装成已完成：

- P1 Tier S / Tier A 正式肖像、桌面与移动壁纸生产；
- Amun-Ra、Ra-Horakhty、Horus the Elder、Harpocrates 等需要独立 Identity Resolution 的后期扩展；
- 生产环境 D1 写入、部署 smoke 与真实浏览器视觉对比；这些需要发布权限或远程运行环境，不属于本地代码落地的默认授权。

V1.2 的验收顺序改为：先通过内容包与通用流水线的自动化闭包，再逐项打开 P1 视觉和后期身份扩展。这样“28 个 Story”是经过 validator 证明可发布的 structured data，而不是只写在规划文档中的数量承诺。

## 0.3 本轮执行记录（2026-09-02）

已完成：

- 新增 src/content/egyptian/ structured package：25 Character、2 World、17 Scene、23 taxonomy term、24 relation、28 Story；
- 保留 character-anubis、world-duat、scene-river-of-stars、story-ra-solar-voyage、story-osiris-isis、story-weighing-heart 的既有 ID / slug；
- 将 Egyptian 注册到通用 registry，并合并进 local seed / Story / D1 dry-run 路径；
- 为每个 P0 Character 提供 sourceRefs、period、Canonical Design、originalDesignChoices 与 generation prompt；
- 用通用 content:validate 和 Egyptian 专项契约测试验证依赖闭包、来源 locator、canonical relation、World / Scene 边界和视觉 Tier。

未在本轮伪造完成：

- 真实生产环境 D1 写入与部署 smoke；
- P1 正式角色 / World / Story 图像资产；
- Egyptian alias / transliteration、Interpretation、Amun-Ra / Ra-Horakhty 等复合身份产品化；
- Source Registry 的 attestationType 与 claim-level 跨实体审计。当前包用已有 locator / tradition / period 字段保持兼容，下一阶段应先通用化再扩展。

---

# 1. 当前仓库盘点

## 1.1 当前 Character：只有 Anubis

现有正式埃及 Character：

```text
id: character-anubis
slug: anubis
role: 亡者守护神
```

现有 Variant：

- `ceremonial-judge` / 审判礼装；
- `duat-guardian` / 冥界守门神相。

现有 ID / slug / URL 必须稳定保留。

但现有 Canonical Design 需要升级：

- “天平”不能成为 Anubis 所有场景的唯一锚点；
- 补木乃伊化、墓地 / necropolis 守护、亡者引导等核心职责；
- 黑色的意义应区分再生、沃土、死亡 / 复生等宗教语境，而不是等同 dark fantasy；
- 支持完整犬科动物形与犬科头人形等古代图像形式；
- 禁止狼人化、重甲 Boss 化。

## 1.2 当前 Story：3 篇

现有埃及 Story：

1. `story-ra-solar-voyage` / 拉神的太阳神舟；
2. 奥西里斯死亡与复生相关 Story；
3. `story-weighing-heart` / 心脏称量。

三篇均保留既有 ID / slug，并迁入结构化埃及内容包。

当前主要缺口：

- Ra 尚无正式 Character；
- Osiris Story 缺 Osiris / Isis / Horus / Seth / Nephthys 等核心参与者；
- 心脏称量仅有 Anubis，没有 Ma'at / Thoth / Ammit / Osiris；
- Story 大量复用 `world-duat`；
- 已开始区分《阿姆杜阿特书》《金字塔文》《棺材文》《亡灵书》，但尚未形成 Claim-level Source Coverage；
- Story、Character、Relation 和 iconography 之间尚未形成来源闭包。

## 1.3 当前 World：只有 Duat

`world-duat` 是正确的核心 World，但不能承载所有埃及故事。

当前单 World 会导致：

- 创世被错误塞进冥界；
- 白昼太阳航行与夜航没有空间差异；
- Horus / Seth 王权故事缺乏人间、沼泽、神庭等具体 Scene；
- Aaru、墓室、神庙、原初状态被压扁；
- 视觉上所有内容趋同为黑金墓室 + 星河。

## 1.4 当前 Visual DNA 只是入口层

现有：

```text
太阳金 / 砂岩 / 青金石 / 黑石
太阳圆盘 / 圣甲虫 / 鹰 / 象形几何
炽热 / 永恒 / 神秘
```

如果直接规模化，会产生：

- 每张图都有金字塔；
- 每个角色都穿黑金重甲；
- 神庙变成现代 fantasy palace；
- 随机发光象形文字；
- 动物头神兽人化；
- 女性神祇统一 Cleopatra / Nefertiti 模板；
- 不同时期图像语言被混成同一“埃及风”。

---

# 2. “完整”的定义与 P0 / P1 / P2 边界

埃及神话的“完整”不等于收录所有地方神、所有神名或所有墓葬咒文。

MythCanvas 的完整定义是：

> 用户可以连续理解创世框架、太阳与 Ma'at、Osirian 王权循环、Horus / Seth 王位冲突、死亡与审判、Duat 夜航与永生；所有核心参与者、空间、关系、关键身份和视觉事实都有来源范围，且不存在关键依赖悬空或不加说明的历史层叠。

## 2.1 P0：内容主干闭包

P0 硬目标：

```text
Core Story / Religious Narrative Manifest = 28 reviewed units
P0 Story Entity Dependency Closure = 100%
P0 Stable Identity Source Coverage = 100%
P0 Required Genealogy / Narrative Relation Coverage = 100%
P0 Core Relation Source Coverage = 100%
P0 Story Source Coverage = 100%
P0 Canonical Design Coverage = 100%
Conflicting-source Claims Without Scope = 0
Orphan Entity Reference = 0
Duplicate Canonical Relation = 0
Critical Historical / Cultural Error = 0
```

Character / World / Scene / Relation 最终数量由 Story Dependency Closure 决定，不设百科式硬数量。

## 2.2 P1：高质量视觉宇宙

- Tier S / Tier A 正式视觉资产；
- 核心 World desktop + mobile hero；
- Story hero / illustration 原创化；
- Character Graph / syncretism 视觉产品化；
- SEO / GEO / alias / transliteration 完善；
- provenance audit 清零；
- 热门角色多 Style / Variant。

## 2.3 P2：长尾与接收传统

- 更多地方神与神庙神学；
- Ptolemaic / Greco-Egyptian syncretism；
- Serapis 等后期复合神；
- 历史法老神格化；
- 更多魔法 / 医疗 / 节庆文本；
- 后期 Isis reception；
- 现代 Egyptology scholarship / reception layer。

P2 不阻塞埃及 P0 主体系上线。

---

# 3. 内容边界

## 3.1 P0 应覆盖

- 创世与宇宙秩序；
- Heliopolitan / Memphite / Hermopolitan 等来源范围化的创世框架；
- 太阳循环与 Ma'at；
- Osiris–Isis–Horus–Seth 主循环；
- 王权神学；
- 木乃伊化、死亡、审判与永生；
- Duat 夜航；
- 与上述 Story 直接相关的重要 deity / monster / creature / collective / space / ritual。

## 3.2 P0 不混入

- 现代神秘学 / New Age；
- “法老诅咒”流行文化；
- 影视游戏原创设定；
- Cleopatra 作为神话 Character；
- 泛金字塔阴谋论；
- 不加 period scope 的希腊罗马时期重解释。

---

# 4. 来源体系与 Claim-level Source Policy

埃及比希腊、北欧更需要把“故事事实”和“后世重建”分开。

大量内容来自：

- Pyramid Texts；
- Coffin Texts；
- Book of the Dead；
- Amduat；
- Book of Gates；
- Book of the Heavenly Cow；
- temple inscriptions / hymns；
- royal / theological texts；
- magical / healing texts；
- later Greco-Roman witnesses。

不存在一部可直接当作统一“埃及神话圣经”的单一文本。

## 4.1 Source Tier

### Tier 1 — 古埃及直接文本 / 图像证据

P0 优先：

- Pyramid Texts；
- Coffin Texts；
- Amduat；
- Book of Gates；
- Book of the Dead；
- Book of the Heavenly Cow；
- Shabaka Stone / Memphite Theology；
- The Contendings of Horus and Seth / Papyrus Chester Beatty I；
- relevant temple / funerary / magical texts。

### Tier 2 — 古代后期 / 外部见证

例如：

- Plutarch, *De Iside et Osiride*。

允许用于：

- later witness；
- 保存较完整晚期版本；
- 与更早材料对照。

禁止把其全部细节反投射成古王国 / 中王国唯一版本。

### Tier 3 — 现代学术与博物馆资料

用途：

- 定位原始材料；
- 解释时期 / cult center / iconography；
- 区分现代术语与古代术语；
- 提供编辑背景。

正式关键 claim 尽量落回 Tier 1 / 2 的可定位来源。

## 4.2 SourceRef 最低字段

关键来源记录应至少支持：

```ts
{
  sourceId,
  work,
  locator,            // spell / utterance / chapter / column / scene / inscription 等
  periodScope,
  traditionScope,
  cultCenter?,
  claimType,
  attestationType,    // direct | reconstruction | later-witness | scholarly-note
  confidence,
  note
}
```

`locator` 不能长期停留在“《亡灵书》”这种宽泛粒度；可稳定定位时应落到 Spell / Chapter / Utterance / text section。

## 4.3 Claim-level Coverage

以下必须来源化：

```text
Character stable identity
role / domain
parent / child / consort
creator identity
syncretic identity
Horus identity
Seth genealogy
Osiris death / restoration detail
Ra / Atum / Amun / Ptah relationship
underworld geography
iconographic attribute
Story event ordering
active Interpretation
```

不同来源冲突：

```text
claim A + source scope A
claim B + source scope B
```

禁止：

```text
AI merge → 一个貌似无争议的“标准答案”
```

---

# 5. P0 Story Manifest：28 个可独立阅读的核心单元

Story First 仍是补全入口。

这里的 `Story` 包括：

- narrative myth；
- religious narrative；
- independently meaningful theological / afterlife reading unit。

它不是要求所有条目都像希腊英雄故事一样具有单线戏剧结构。

## 5.1 Narrative Unit Quality Gate

每个单元进入 Manifest 前必须满足：

1. 能独立回答一个用户问题；
2. 至少一个核心来源或明确 reconstruction source set；
3. 与相邻 Story 不只是同一仪式的一句拆分；
4. 有独立 Character / Scene / Concept 依赖价值，或承担必要叙事桥梁；
5. 页面正文可以写成 3–6 分钟阅读，而不是百科条目拼接。

如果不能满足，应合并为同一 Story 的 section，而不是为了凑数量拆页。

## Volume A — 创世与宇宙结构

1. **Nun 与第一次陆地**：原初状态、第一丘 / first emergence。
2. **Atum 与 Shu / Tefnut 的出现**：Heliopolitan creation claims，按具体材料范围化。
3. **Geb 与 Nut 的分离**：天空、大地、空气形成有序结构。
4. **Heliopolitan Ennead 的世代秩序**：作为神谱 / cosmic succession reading unit，不冒充单一叙事原典。
5. **Ptah 以心与言创造世界**：Memphite / Shabaka Stone 范围。
6. **Ogdoad 与创世前状态**：Hermopolitan material，避免现代“八神统一创世故事”过度整理。
7. **Nut、天空与太阳每日循环**：天空身体 / horizon / 日夜运行的宇宙图景，按来源限定。

## Volume B — 太阳与 Ma'at

8. **Ra 的白昼太阳航行**：天空、日舟与维持宇宙秩序。
9. **Ra 进入 Duat**：日落不是终点，而是夜间更新开始。
10. **Apep 对太阳神舟的袭击**：chaos 与每日秩序维持。
11. **Ra 与 Osiris 的夜间结合 / 更新**：仅按明确新王国冥界文本范围表达。
12. **Khepri 与黎明再生**：不把 scarab 变成泛用“复活符号”。
13. **Isis 获取 Ra 的秘密名字**：魔法、神名与权能边界；按具体文本范围化。
14. **毁灭人类与 Eye of Ra / Sekhmet 传统**：以《天牛之书》等材料为核心，不把所有 Eye of Ra 女神关系硬合并。

## Volume C — Osirian 王权循环

15. **Osiris 的王权与死亡**：明确早期材料与后期完整叙事重建之间的区别。
16. **Isis 寻找 Osiris**：Story 文本必须说明哪些细节来自晚期见证。
17. **Osiris 的恢复与 Horus 的受孕**：避免把“复生”写成 Osiris 回到人间继续统治。
18. **Horus 的出生与隐藏**：Osirian kingship 主线。
19. **Isis 在纸莎草沼泽保护幼年 Horus**：若采用魔法 / 治愈文本，明确 source tier 与时期。
20. **Horus 与 Seth 提出王位主张**：建立冲突、继承与神庭网络。
21. **Horus 与 Seth 的主要竞赛**：以 Chester Beatty I 等材料为中心，不混入所有地方版本。
22. **神庭裁决**：独立承担 tribunal / succession relation closure。
23. **Horus 继承王权**：连接神话王权与现世王权象征。
24. **Osiris 成为亡者世界之王**：强调“死亡后获得新的王权”而非简单复活。

## Volume D — 死亡、审判与有效亡者

25. **Anubis 与木乃伊化 / 亡者准备**：embalming、necropolis、ritual preparation。
26. **亡者进入 Duat 与通过门域**：不同 funerary corpus 的地理不能无来源拼成一张统一地图。
27. **心脏称量**：一个 Story 内完整覆盖 Anubis、Ma'at、Thoth、Ammit、Osiris，不再拆出“Thoth 记录”“Ammit 风险”重复页面。
28. **Aaru / Field of Reeds 与理想永生**：说明它是死后目标 / region 概念，而不是默认独立“天堂世界”。

## 5.2 Story Dependency Closure Rule

每个 P0 Story 进入 `published` 前：

```text
requiredCharacterIds ⊆ Character dataset
requiredWorldIds     ⊆ World dataset
requiredSceneIds     ⊆ Scene dataset
requiredSources      != empty
```

埃及附加检查：

```text
periodScope required when historically material
traditionScope required when alternatives conflict
attestationType required for reconstruction / later witness
critical identity claims have source refs
modern-pop-culture leakage = 0
```

核心参与者必须实体化；只在正文一句带过、无浏览 / 关系 / 创作价值的名字可留在文本中，不强制建 Character。

最终 P0 Character 数量由 28 Story 依赖闭包计算后人工 Review。

---

# 6. Character Stable Type 与 Taxonomy

## 6.1 Stable Character Type：与 Greek / Norse 完全一致

禁止为埃及再建一套独有的 stable type。

继续使用：

```text
character_type
├── deity
├── hero
├── mortal
├── monster
├── creature
└── collective
```

例如：

```text
Ma'at
character_type = deity
taxonomy = [personified-principle, cosmic-order, maat]

Nun
character_type = deity
taxonomy = [primordial, primeval-water, cosmogony]

Apep
character_type = monster
taxonomy = [chaos-being, solar-cycle, duat]
```

不要新增：

```text
primordial-being
personified-principle
divine-animal
chaos-being
```

作为 stable `character_type`。

这些属于 taxonomy / identity attributes。

## 6.2 Editorial / Functional Taxonomy

建议：

```text
primordial
heliopolitan
memphite
hermopolitan
ennead
ogdoad
solar-cycle
osirian-cycle
kingship
duat
afterlife
embalming
writing
magic
maat
cosmic-order
sky
sun
fertility
protection
chaos-being
syncretic-deity
animal-iconography
```

原则：

> `character_type` 解决“它是什么”；taxonomy 解决“它属于哪个神学 / 故事 / 功能 / 视觉分类”。

---

# 7. P0 Character Production 标准

每个 P0 Character，无论是否 Tier S，最低都必须具备：

```text
Character
├── stable identity
├── character_type
├── taxonomy / tradition tags
├── names / aliases
├── period scope
├── identity source refs
├── canonicality
├── symbols
├── canonical design
├── iconographic forms（需要时）
├── core relations
├── world / scene affinity
├── story linkage
├── syncretism notes（需要时）
└── generation prompt
```

以下仅按需创建：

```text
CharacterInterpretation
CharacterVariant
ReferenceAsset
```

**P0 Canonical Design Coverage = 100%。**

这和视觉图片是否已生产是两件事。

## 7.1 视觉 Tier 不是 Character 完整度 Tier

V1.0 的“18 个 Tier S 全部完成”容易被误解为：只需要 18 个角色有完整 Canonical Design。

V1.1 明确：

```text
所有 P0 Character → structured canonical design
Tier S / A / B       → 只决定正式图片生产优先级
```

---

# 8. Identity Resolution Matrix：Epithet / Form / Interpretation / Syncretism

埃及补全最大的模型风险是“什么都做成 Variant”或“什么都拆成 Character”。

V1.1 固定如下规则。

## 8.1 Alias / Epithet

如果只是：

- 名称拼写差异；
- 常见希腊化 / English form；
- 称号；
- 文本中的修饰性 epithets；

使用：

```text
character_names / aliases
```

不创建 Character / Variant。

## 8.2 Iconographic Form

如果是同一神祇的标准图像形式，例如：

```text
human
falcon-headed human
full falcon
recumbent canid
scarab
```

使用：

```text
Canonical Design.iconographicForms
```

不是 Character Variant。

Variant 只描述 MythCanvas 创作层允许切换的年龄 / 服装 /神相 /造型等，不承担古代神学身份问题。

## 8.3 CharacterInterpretation

仅当来源差异实质改变：

- 稳定身份理解；
- 神职 / 权能；
- 关键视觉锚点；
- Generation Prompt；
- 用户确实需要主动切换传统；

才建立 Interpretation。

仍坚持：

```text
relation difference != interpretation difference
```

## 8.4 Syncretic Character

当复合神格同时满足以下多个条件：

- 有稳定独立名称；
- 有明确 period / cult / textual identity；
- 有独立搜索 / 页面价值；
- 有独立 Story / relation / iconographic value；

则建立独立 Character，例如未来可能的：

```text
Amun-Ra
Ra-Horakhty
```

并使用通用 `character_relations` 表达组成关系：

```text
base deity -> syncretic deity
relation_type = syncretic-component
```

例如：

```text
Amun -> Amun-Ra
Ra   -> Amun-Ra
```

每条 edge 必须 source scoped。

`sync / validator / graph` 不应为埃及单独造另一套 Identity Graph。

若现有 relation enum 尚无 `syncretic-component`，只在 Graph /产品确实需要时增加这一条**通用关系语义**，不得创建 Egyptian-only relation table。

## 8.5 明确禁止

```text
Amun-Ra = Ra costume Variant
Ra-Horakhty = Ra costume Variant
Horus the Child = Horus age Variant（默认）
```

---

# 9. Horus Identity Policy

“Horus”不能被压缩成一个跨三千年完全稳定的“鹰头儿子”。

V1.1 采用确定性默认策略。

## 9.1 P0 主入口

`character-horus` 默认服务 P0 Osirian kingship cycle：

```text
Horus son of Isis / Osiris
+ kingship claimant / successor
+ falcon / royal sky associations
```

其父母、继承、与 Seth 冲突必须全部 source scoped。

## 9.2 Horus the Elder

不默认塞进 `character-horus` 的一段简介。

规则：

- 如果后续 Story Dependency Closure 需要独立身份 / relation / page → 独立 Character；
- 如果只是解释性对照 → Interpretation / source note；
- 不使用 age Variant。

## 9.3 Harpocrates / Horus the Child

默认 P1 / later tradition。

若进入产品：

- 按独立身份 / Interpretation 规则评审；
- 必须有 period scope；
- 不因“child”字面意义直接建年龄 Variant。

## 9.4 Ra-Horakhty

按 Syncretic Character Rule 处理，不作为 Horus 或 Ra 的普通 Variant。

---

# 10. Character Relation Canonical Storage Rule

完全复用 Greek / Norse 规则。

## 10.1 parent

只存：

```text
parent -> child
relation_type = parent
```

UI 反向查询得到 children。

**不同时存 `child` 反向边。**

## 10.2 对称关系

```text
consort
sibling
ally
rival
enemy
syncretized-with（若未来保留该弱语义）
```

默认只存一次，以稳定排序决定 from / to。

## 10.3 单向关系

```text
rules-over
serves
created
manifestation-of
protector-of
attendant-of
successor-of
syncretic-component
```

按语义保持方向。

## 10.4 不滥增 relation type

Horus / Seth 的比赛、Isis 的保护、Anubis 的 embalming 等，如果通过：

```text
existing relation
+ Story linkage
+ source scoped note
```

已能表达，就不为了埃及新增几十个关系枚举。

## 10.5 Relation DoD

```text
required genealogy edges covered = 100%
required narrative edges covered = 100%
relation source coverage = 100%
invalid target = 0
duplicate canonical relation = 0
conflicting relation without source scope = 0
```

---

# 11. P0 Character Closure 与视觉 Tier

## 11.1 Tier S：视觉生产优先级，不是 P0 Character 总数

建议 18 个 Tier S：

1. Ra / Re
2. Atum
3. Osiris
4. Isis
5. Horus
6. Seth / Set
7. Anubis
8. Thoth
9. Ma'at
10. Hathor
11. Sekhmet
12. Ptah
13. Nut
14. Geb
15. Nephthys
16. Khepri
17. Apep / Apophis
18. Ammit

这 18 个是：

- 品牌认知；
- Story 连接度；
- 图谱价值；
- 出图价值；

综合后的 P1 视觉优先池。

**不是固定 P0 Character Closure。**

## 11.2 Dependency Closure 预计还会产生

例如：

- Nun；
- Shu；
- Tefnut；
- Wepwawet；
- Sia；
- Hu；
- Heka；
- Mehen；
- relevant Ennead / tribunal members；
- Story 真正依赖的 Ogdoad / protective deity。

最终是否进入 P0 由 Story / Relation 依赖决定，不按百科名单提前灌入。

---

# 12. World / Scene / Concept：严格空间语义

Greek / Norse 已证明，World 不能承担“时代 / 标签 / 任意地点”。埃及更应收紧。

## 12.1 World 定义

> World = 神话宇宙中稳定、可复用、可被多个 Story / Character 感知为同一空间层的神话域。

默认 P0：

### Duat

保留现有 `world-duat`。

承担：

- 太阳夜航；
- Osiris 亡者王权；
- 门域 / 深夜更新；
- afterlife journey 的部分空间。

### Celestial Sky / Solar Sky

只有满足下列条件才升级 P0 World：

- 至少多个 P0 Story 直接依赖；
- Nut / daytime solar barque / horizon 等具有共享空间语义；
- 页面和 Artwork 有复用价值。

否则继续使用 Scene / Concept。

## 12.2 默认不建 World

### Nun / Primeval Waters

优先：

```text
cosmology concept
+ creation Scene
```

不是为了做“埃及四界地图”机械建 World。

### First Mound

Scene / cosmological place。

### Aaru / Field of Reeds

优先建：

```text
Duat / afterlife related region or Scene
```

除非产品 World 语义经过实现 Review 证明其需要独立一级 World。

### Divine Egypt / Sacred Nile Realm

**P0 不创建。**

现实埃及、尼罗河谷、城市、沼泽不是因为进入神话 Story 就自动升级为超自然 World。

## 12.3 Scene / Place 候选

由 Story Closure 决定，优先：

```text
Primeval Waters / First Emergence
First Mound
Solar Barque at Day
Solar Barque at Night
Akhet / Horizon
Gates of Duat
Midnight Renewal Chamber / relevant Duat scene
Hall of Two Truths
Weighing Hall
Throne of Osiris
Papyrus Marsh of Isis and Horus
Nile Floodplain
Divine Tribunal
Temple Hypostyle Hall
Sacred Lake
Star-painted Tomb Chamber
Desert Necropolis
Field of Reeds
Celestial Body of Nut
```

是否实体化：

> 被至少一个 P0 Story 直接依赖，或具有明显高复用视觉 /浏览价值。

## 12.4 Concept 与 Scene 不强行实体化成 Character / World

例如：

```text
Ma'at as cosmic order concept
Akhet as horizon concept
Ennead as theological collective / taxonomy
```

应按现有 content concept / collective / taxonomy 能力选择最贴近产品语义的模型，不为了图谱“全节点化”。

---

# 13. Egyptian Visual DNA V2

当前 Visual DNA 应从单一“沙漠冥界风”拆为 Base + Domain DNA。

## 13.1 Mythology Base

```text
materials:
- sandstone / limestone
- painted plaster
- linen
- wood
- gold where ritually appropriate
- faience
- lapis / blue mineral accents

landscape:
- Nile water
- fertile black soil
- papyrus / lotus marsh
- desert edge
- cultivated floodplain

motifs:
- solar disk
- horizon
- papyrus / lotus
- ritual crowns / regalia
- hieroglyphic relief as real surface language
- divine animal iconography by deity
```

## 13.2 Solar

```text
white-gold sunlight
red / gold solar disk
horizon glow
solar barque
scarab dawn when source-appropriate
ordered monumental symmetry
```

## 13.3 Nile / Black Land

```text
papyrus
lotus
reed marsh
fertile dark soil
water channels
green / blue life palette
```

## 13.4 Temple

```text
sandstone pylons
painted columns
lotus / papyrus capitals
sacred lake
incense haze
carved / painted relief
```

禁止随机 neon hieroglyphs。

## 13.5 Funerary

```text
linen
black resin
gold masks where appropriate
canopic / funerary protection
star ceilings
restrained lamp / torch light
```

## 13.6 Duat

```text
dark blue night field
stars
red solar disk
register-like composition where appropriate
gates / serpents / barques
funerary-painting spatial language
```

## 13.7 Royal

```text
white / red crowns when character-appropriate
uraeus
throne
falcon / royal protection
ceremonial symmetry
```

## 13.8 Primeval / Cosmic

```text
dark water
first mound
sky body
stars
air separation
minimal monumental composition
```

## 13.9 Anti-patterns

硬门禁：

```text
no every-scene pyramid
no universal black-gold armor
no random glowing hieroglyphs
no fantasy glyph tattoos
no MCU / game-boss silhouette copying
no Anubis werewolf anatomy
no Seth = ordinary jackal/dog/donkey shortcut
no Apep = generic western dragon
no Cleopatra/Nefertiti template for all goddesses
no universal sexualized dancer costume
no universal male bare-chest + gold collar template
no Islamic / Arabic architectural motifs in pharaonic temple scenes
no Greek/Roman column language without period scope
no single modern race palette applied to all symbolic ancient skin conventions
```

---

# 14. Character Canonical Design：埃及专项字段

所有 P0 Character 的 Canonical Design 在通用字段基础上，按需补：

```text
identityAnchors
iconographicForms
headgear
regalia
animalAssociations
colorSymbolism
periodNotes
culticNotes
mythologicalFacts
historicallyGroundedAnchors
originalDesignChoices
syncretismNotes
avoid
canonicalPrompt
```

必须显式区分：

```text
mythological / textual facts
historically / iconographically grounded anchors
MythCanvas original design choices
```

### Anubis 示例

```text
identityAnchors:
- black canid-associated iconography
- embalming / necropolis context
- ritual regalia

iconographicForms:
- recumbent black canid
- canid-headed anthropomorphic deity

avoid:
- werewolf anatomy
- generic fantasy armor
- permanent scales in every scene
- glowing glyph tattoos
```

### Ma'at 示例

```text
identity:
- truth / order / justice / cosmic balance
- relation to kingship / solar order

iconography:
- ostrich feather as a stable marker

avoid:
- angel visual drift
- generic Greek goddess visual language
```

---

# 15. Names / Alias / Transliteration Policy

埃及名称存在 conventional English / Greek-derived / Egyptological transliteration 等多种形式。

例如：

```text
Ra / Re
Seth / Set
Thoth / Djehuty
Osiris / Egyptian-name transliteration forms
Isis / Egyptian-name transliteration forms
```

规则：

1. Stable slug 保持 ASCII、用户熟悉、URL 稳定；
2. 中文常用名作为主要中文 display；
3. 常见 English conventional name 作为主英文 display；
4. Egyptological / ancient-language transliteration 进入 aliases / scoped names；
5. Greek-derived conventional names必须能在来源说明中与古埃及本名传统区分；
6. 不因为增加更“学术”的拼写改公开 URL。

Search 至少应覆盖中文名 + common English + ASCII alias + 高价值 transliteration。

---

# 16. Structured Content Pipeline：不得出现 Egyptian-only 工具链

V1.0 的目录过度拆分，会诱导创建 `validators.ts / relations.ts / worlds.ts` 等文明专属工程逻辑。

V1.1 与 Greek / Norse 对齐。

## 16.1 推荐目录

```text
src/content/egyptian/
├── catalog.ts
├── stories.ts
├── assets.ts
├── visual-tiers.ts
├── sources.ts        # 可选，仅数据；若通用 catalog 足够则不拆
└── index.md
```

其中：

- `catalog.ts`：Character / World / Scene / taxonomy / relation / interpretations / aliases 等结构化 manifest；
- `stories.ts`：Story 正文、sources、dependencies；
- `assets.ts`：公开资产 provenance；
- `visual-tiers.ts`：P1 视觉优先级；
- `sources.ts`：仅在 source registry 体量明显需要时拆分，仍是 data package，不包含 validator 逻辑。

禁止：

```text
src/content/egyptian/validators.ts
scripts/sync-egyptian-content.mjs
egyptian:validate
egyptian:deploy
```

## 16.2 Generic Registry

目标：

```text
src/content/greek
src/content/norse
src/content/japanese
src/content/egyptian
        ↓
mythology registry
        ↓
generic repository / validator / normalizer / sync
```

若北欧阶段已经完成 generic registry，埃及直接注册，不复制代码。

若尚未完成，则埃及实现前优先完成北欧方案定义的通用化工作。

## 16.3 Generic Pipeline

```text
structured mythology package
  → schema validation
  → dependency validation
  → source / claim coverage validation
  → relation validation
  → world / scene validation
  → asset provenance validation
  → normalized manifest
  → idempotent D1 sync
```

## 16.4 Validator 最低检查

```text
stable id / slug uniqueness
mythology foreign keys
story dependency closure
story narrative-unit integrity manifest
relation target validity
canonical relation duplicates
source coverage
source scope / locator validity
interpretation ownership
syncretic-component target validity
primary name uniqueness
alias collisions
world / scene validity
asset provenance completeness
legacy ID stability
```

## 16.5 CI

仍然只运行通用命令：

```bash
npm test
npm run content:validate
npm run provenance:audit -- --strict
npm run check
```

不要新增文明专属 CI 路径。

---

# 17. Character Detail / Graph 产品集成

埃及不重做 Character Detail / 3D Graph。

优先复用 `NORSE_CHARACTER_DETAIL_GRAPH_INTEGRATION_PLAN.md` 定义的通用 ViewModel / relation fallback / Graph API / performance / accessibility 能力。

埃及只新增必要的通用语义：

- period / tradition source display；
- syncretic-component relation；
- Interpretation source scope；
- iconographic form display；
- Horus identity notes；
- alias / transliteration。

## 17.1 Graph 必须能回答

```text
Geb + Nut → Osiris / Isis / Seth / Nephthys
Osiris + Isis → Horus（按来源范围）
Osiris ↔ Seth → kingship / death conflict
Horus ↔ Seth → succession conflict
Apep ↔ Ra → nightly chaos conflict
Anubis → funerary / embalming network
Ma'at / Thoth / Anubis / Osiris → judgement network
Amun / Ra → Amun-Ra（未来进入时）
```

Graph 不应退化为 family tree，也不能把弱 `associated-with` 边当作主网络。

---

# 18. 实施顺序

## P0-0：冻结内容规范

- [x] Stable Character Type 与 taxonomy 对齐 Greek / Norse；
- [x] Source Tier / locator 规则（`attestationType` 延后到通用 Source Registry 扩展，不在本轮伪造 schema 字段）；
- [x] Canonical Relation Storage Rule；
- [x] Identity Resolution Matrix；
- [x] Horus Identity Policy；
- [x] World / Scene / Concept 语义；
- [x] 28 个 Story Manifest 通过 Narrative Unit Review。

## P0-1：确保 Generic Structured Content Pipeline 可用

复用北欧通用化工作：

- [x] mythology registry；
- [x] generic validator；
- [x] generic normalizer；
- [x] generic D1 sync；
- [x] generic artwork coverage reporter；
- [x] CI 自动验证全部 registered mythology。

**必须在大量新增 Egyptian 数据前完成，避免第三套 importer。**

## P0-2：建立 `src/content/egyptian/`

- [x] `catalog.ts`；
- [x] `stories.ts`；
- [x] `assets.ts`；
- [x] `visual-tiers.ts`；
- [x] optional `sources.ts`（本轮 source registry 规模较小，source data 内聚在 catalog / stories）；
- [x] `index.md`；
- [x] 迁移现有 Anubis 与 3 篇 legacy Story，保持 ID / slug。

## P0-3：Story Dependency Closure

分批推进：

### Batch A — Creation / Cosmology

Story 1–7：

- Nun / Atum / Shu / Tefnut / Geb / Nut / Ptah / relevant Ogdoad closure；
- creation Scene / Concept；
- source tradition scope。

### Batch B — Solar / Ma'at

Story 8–14：

- Ra / Khepri / Apep / Isis / Sekhmet / Eye-of-Ra related closure；
- daytime / nighttime / horizon Scene；
- direct vs reconstruction source notes。

### Batch C — Osirian Kingship

Story 15–24：

- Osiris / Isis / Horus / Seth / Nephthys / tribunal closure；
- genealogy / succession / rivalry edges；
- papyrus marsh / tribunal / throne Scene；
- Horus identity scope。

### Batch D — Afterlife

Story 25–28：

- Anubis / Ma'at / Thoth / Ammit / Osiris closure；
- Duat / gates / weighing / Field of Reeds Scene；
- funerary text source scope。

## P0-4：Character / Relation / Source Closure

- [x] all P0 stable identities sourced；
- [x] all P0 Characters canonical-design complete；
- [x] genealogy source coverage 100%；
- [x] required narrative relation coverage 100%；
- [x] duplicate canonical relation = 0；
- [x] conflicting relation without scope = 0；
- [x] syncretic identity records pass Identity Resolution Matrix（本轮没有引入复合神 Character；相关 policy fixture 留给后续扩展）。

## P0-5：World / Scene / Visual DNA 数据化

- [x] `world-duat` 增强；
- [x] Celestial Sky 是否升级 World 由 closure + reuse 决定；
- [x] Nun / First Mound / Aaru 不被机械 World 化；
- [x] Story 不再无脑挂 Duat；
- [x] Egyptian Base DNA + domain DNA；
- [x] sparse-source visual areas 显式区分 original design choices。

## P0-6：Story 正文

每篇：

```text
3–6 分钟阅读
source context
version / period note
related Characters
related Worlds / Scenes
explicit reconstruction note when needed
no modern encyclopedia mash-up
```

## P0-7：页面 / Graph / Search / SEO

复用共享能力：

- [x] `/mythology/egyptian/` Story volumes；
- [x] Story detail；
- [x] Character taxonomy；
- [x] Character relations / graph；
- [x] source / period / tradition display；
- [ ] syncretism display（本轮没有新增复合神身份，保留为后续通用 identity work）；
- [ ] alias / transliteration search（Character names 已有通用 D1 能力，但 Egyptian aliases 尚未进入 structured package）；
- [x] World / Scene browse；
- [x] sitemap 自动发现 Story；
- [x] Creator 消费 Canonical Design / iconographic forms。

## P0-8：验证与上线

- [x] `npm test`；
- [x] `npm run content:validate`；
- [x] `npm run check`；
- [x] local D1 idempotent sync（连续执行两次，276 条 SQL commands 均成功）；
- [ ] local browser smoke；
- [ ] production D1 sync；
- [ ] deployed routes smoke；
- [x] package-level no orphan / duplicate relation / missing source locator violations；
- [ ] full cross-entity source-scope audit。

补充：本轮已完成本地 SSR route smoke（`/mythology/egyptian/` 与
`/mythology/egyptian/weighing-heart/` 均返回 200）；由于未进行真实浏览器截图，
不将其标记为 browser smoke。

## P1：视觉资产

- [ ] Tier S canonical mobile portrait/reference；
- [ ] 最高价值 Tier S desktop wallpaper；
- [ ] Tier A minimum portrait/reference；
- [ ] Tier B symbol / iconography fallback；
- [ ] P0 World desktop hero；
- [ ] P0 World mobile hero；
- [ ] Story hero / illustration 原创化；
- [ ] provenance static + production audit；
- [ ] artwork coverage report。

## P2：长尾

- [ ] 更多地方神；
- [ ] Amun / Amun-Ra 完整扩展；
- [ ] Horus the Elder / Harpocrates 等 identity 扩展；
- [ ] Serapis / Greco-Egyptian layer；
- [ ] 更多 magical / healing / temple texts；
- [ ] 更多 deity Interpretation / Variant；
- [ ] scholarship / reception layer。

---

# 19. 视觉资产 Tier

P0 不要求 100+ 图片完成。

## Tier S

建议 18 个品牌级角色。

P1 最低目标：

```text
canonical mobile portrait/reference
+ graph portrait where graph uses image
+ identity-safe prompt
+ provenance complete
```

最高价值 subset 再补 desktop wallpaper。

## Tier A

Story 高频依赖角色：

```text
canonical mobile portrait/reference
```

或角色类型不适合人像时提供经过设计的正式 iconographic visual。

## Tier B

Dependency-only：

```text
Canonical symbols / iconographic forms
+ high-quality Symbol Fallback
```

禁止用通用 AI 人像冒充正式角色肖像。

## World

每个最终 P0 World 的 P1 视觉最低：

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

---

# 20. 测试矩阵

至少覆盖：

```text
Egyptian manifest integrity
legacy Anubis ID / slug stability
legacy 3 Story ID / slug stability
Story dependency closure
source scope / locator / attestationType
Stable Character Type whitelist
canonical relation duplicate rule
parent reverse-edge prohibition
Horus identity fixture
syncretic-component fixture
alias / transliteration collisions
World / Scene semantic fixture
no dangling entity / relation
registered content repository discovery
Story sitemap discovery
D1 sync idempotency
```

## 20.1 Horus fixture

验证：

- P0 `Horus` 默认属于 Osirian kingship scope；
- Horus the Elder 不被错误 merge；
- Harpocrates 不退化成 age Variant；
- Ra-Horakhty 按 Syncretism Rule 处理。

## 20.2 Syncretism fixture

以未来 Amun-Ra 或测试数据验证：

```text
base deity Character 存在
syncretic Character 独立
syncretic-component edge source scoped
not a costume Variant
```

## 20.3 Heart Weighing fixture

一个 Story 完整验证：

```text
Anubis
Ma'at
Thoth
Ammit
Osiris
Hall / weighing Scene
Book of the Dead source locator
```

不再要求创建“Thoth 记录结果”“Ammit 风险”两个重复 Story。

## 20.4 Solar Voyage fixture

验证：

```text
Ra
Apep
Khepri
Duat
day / night scene separation
dawn rebirth
source-scoped night-hour claims
```

---

# 21. P0 / P1 Definition of Done

## 21.1 P0 DoD

埃及内容主干完成必须同时满足：

```text
1. 28 个 reviewed Story / religious narrative units 已结构化并发布；
2. Narrative Unit duplicate / fragment violation = 0；
3. Story required entity dependency closure = 100%；
4. P0 Stable Identity Source coverage = 100%；
5. P0 required Genealogy / Narrative Relation source coverage = 100%；
6. P0 Canonical Design coverage = 100%；
7. period / tradition / attestation scope violations = 0；
8. orphan refs = 0；
9. duplicate canonical relations = 0；
10. conflicting source claims without scope = 0；
11. stable IDs / slugs preserved；
12. Egyptian package uses generic registry / validator / sync；
13. Character Detail / Graph / Story / sitemap / search use shared product paths；
14. critical cultural / historical errors = 0。
```

P0 **不以 Tier S 全量正式图片完成为阻塞条件**。

## 21.2 P1 DoD

```text
Tier S minimum visual coverage = 100%
Tier A minimum visual coverage = 100%
P0 World dual-end hero coverage = 100%
public prototype provenance = 0
public asset metadata completeness = 100%
critical visual anachronism = 0
```

---

# 22. 用户侧认知验收

用户访问 `/mythology/egyptian/` 后，应能回答：

1. 古埃及为什么不存在一套唯一创世“正史”？
2. Nun、Atum、Ptah、Ogdoad 分别属于什么来源 / 神学框架？
3. Ra 的白昼航行与 Duat 夜航是什么关系？
4. Ma'at 在太阳、王权和死后审判中分别意味着什么？
5. Osiris 为什么没有“复活后重新做人间国王”？
6. Isis、Osiris、Horus、Seth 的王权关系是什么？
7. Horus 为什么不能简单写成一个跨三千年完全固定的角色？
8. Anubis、Ma'at、Thoth、Ammit、Osiris 在心脏称量中分别做什么？
9. Aaru 与 Duat 是什么关系，为什么不应该简单等同“天堂 / 地狱”？
10. Amun-Ra、Ra-Horakhty 等复合身份为什么不是角色换装？
11. 同一关系 / 故事存在不同文本版本时，页面能否看到来源范围？
12. 为什么 MythCanvas 的埃及视觉不应该只剩金字塔、黑金与发光象形文字？

---

# 23. 最终信息架构

```text
Egyptian Mythology
│
├── STORY MANIFEST
│   ├── Creation & Cosmology
│   ├── Solar Cycle & Ma'at
│   ├── Osirian Kingship
│   └── Death & Effective Afterlife
│
├── CHARACTERS
│   ├── Deities
│   ├── Monsters / Creatures
│   └── Collectives
│
├── TAXONOMY
│   ├── Primordial
│   ├── Heliopolitan / Memphite / Hermopolitan
│   ├── Solar Cycle
│   ├── Osirian Cycle
│   ├── Kingship
│   ├── Duat / Afterlife
│   └── Syncretic Identity
│
├── WORLDS
│   ├── Duat
│   └── Celestial Sky（仅在 dependency / reuse 验证后）
│
├── SCENES / CONCEPTS
│   ├── Nun / Primeval State
│   ├── First Mound
│   ├── Solar Barque Day / Night
│   ├── Akhet
│   ├── Papyrus Marsh
│   ├── Divine Tribunal
│   ├── Hall of Two Truths
│   ├── Field of Reeds
│   └── ...
│
├── RELATION / IDENTITY GRAPH
│   ├── Genealogy
│   ├── Succession / Rivalry
│   ├── Narrative Relation
│   └── Syncretic Component
│
├── SOURCE / TRADITION LAYERS
│   ├── Pyramid Texts
│   ├── Coffin Texts
│   ├── Amduat / Book of Gates
│   ├── Book of the Dead
│   ├── Temple / Theological Texts
│   └── Later Witnesses
│
└── ARTWORKS
    ├── Character
    ├── World
    ├── Scene
    └── Story
```

---

# 24. Review 决策点

V1.1 实施前建议固定以下决策，不再在编码阶段临时选择：

1. **接受 Story Dependency Closure 决定 Character / World / Scene / Relation 数量。**
2. **接受 Stable Character Type 与 Greek / Norse 共用同一 whitelist。**
3. **接受 Syncretic Character + `syncretic-component` 作为高价值复合身份默认表达，不建 Egyptian-only identity table。**
4. **接受 P0 `Horus` 默认服务 Osirian kingship scope，其他 Horus identity 按规则拆分。**
5. **接受 Duat 为确定 World；Nun / First Mound / Aaru 默认不升级 World。**
6. **接受所有 P0 Character Canonical Design = 100%，正式视觉图片进入 P1。**
7. **接受 Egyptian 必须等待 / 复用 generic mythology registry / validator / sync，不复制第三套 importer。**
8. **接受 28 个 Story 需通过 Narrative Unit Quality Gate，数量不能成为拆碎页面的理由。**

默认建议全部接受。

---

# 25. 最终原则

埃及神话补全最危险的做法，是把现代读者熟悉的符号拼成一张“埃及风设定集”：

```text
金字塔
+ 木乃伊
+ 阿努比斯
+ 沙漠
+ 法老
+ 发光象形文字
```

MythCanvas 应做的是：

> **从具体文本、时期、神学中心与图像证据出发，把创世、太阳循环、王权、死亡、复生、Ma'at、尼罗河生命世界与复杂神祇身份重新连接起来，同时用统一的内容工程标准表达来源差异，而不是替古埃及制造一套现代“唯一正史”。**

执行顺序固定为：

```text
Content / Source Rules
→ Generic Pipeline
→ Story Manifest
→ Dependency Closure
→ Identity / Syncretism
→ Character / Relation
→ World / Scene / Concept
→ Story Content
→ Shared Character Detail / Graph / Search / SEO
→ P1 Visual Assets
→ Wallpaper Scale-up
```

而不是：

```text
先列 100 个神
→ 每个配一张金字塔背景图
→ 再补百科简介
```

完成这套 V1.1 后，埃及神话才能从当前的“Duat + Anubis”入口，升级为真正可持续扩展、可讲故事、可追溯、可检索、可做关系图、可稳定出图的完整 MythCanvas 内容宇宙。
