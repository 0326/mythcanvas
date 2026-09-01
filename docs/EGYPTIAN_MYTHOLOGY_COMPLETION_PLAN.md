# MythCanvas 埃及神话完整补全方案

> 状态：Review Proposal  
> 版本：V1.0  
> 日期：2026-09-01  
> 适用范围：埃及神话内容建模、Story、Character、神祇关系、World / Scene、来源体系、视觉资产、Character Graph、AI 出图与结构化内容流水线。  
> 相关文档：`docs/GREEK_MYTHOLOGY_COMPLETION_PLAN.md`、`docs/NORSE_MYTHOLOGY_COMPLETION_PLAN.md`、`docs/CONTENT_POSITIONING.md`、`docs/CHARACTER_ART_SYSTEM.md`、`docs/CHARACTER_GRAPH_PLAN.md`

---

## 0. 结论

当前埃及神话已经具备一个可浏览的首发骨架，但离“完整神话体系”还很远。

仓库当前已有：

- `myth-egyptian`；
- `world-duat` / 杜阿特；
- `character-anubis` / 阿努比斯；
- 2 个阿努比斯 Variant；
- 3 篇核心 Story：拉神的太阳神舟、奥西里斯之死与复生、心脏称量；
- `scene-river-of-stars` 等基础 Scene；
- 太阳金、砂岩、青金石、黑石、太阳圆盘、圣甲虫等基础 Visual DNA；
- 通用 Character / Relation / Interpretation / Variant / World / Scene / Story Schema；
- 希腊阶段已经落地、北欧阶段正在复用的 Structured Content Pipeline 与 Character Graph 能力。

当前内容实际上仍然是：

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
  → 原初之水与创世
  → 太阳神循环与玛阿特秩序
  → 拉 / 阿图姆 / 普塔等不同创世神学
  → 奥西里斯—伊西斯—荷鲁斯—塞特王权循环
  → 荷鲁斯与塞特的王位争夺
  → 死亡、木乃伊化、审判与永生
  → 杜阿特十二时辰与太阳再生
  → 尼罗河、沼泽、神庙、天空、墓室等多域视觉空间
  → 跨时期、跨城邦、跨神学中心的来源化版本
  → Story 驱动的 Character / World / Scene / Relation 闭包
  → 完整角色视觉系统与 AI 出图能力
```

本轮不应定义为“补几十个埃及神”，而应定义为：

> **把埃及神话建设成一套能够表达三千年历史层叠、地方神学并存、神祇合流和葬祭宇宙观的完整内容宇宙，同时避免把古埃及简化成现代流行文化里的“金字塔 + 沙漠 + 阿努比斯”。**

### 本方案五个核心决策

1. **Story First**：先建立 P0 Story Manifest，再通过 Story Dependency Closure 反推 Character / World / Scene / Relation。
2. **Period + Tradition Scoped**：埃及宗教跨越数千年，不存在一部统一“埃及神话圣经”；关键声明必须挂具体时期、文本与地方神学范围。
3. **不把地方创世传统强行排成互斥正史**：所谓“赫利奥波利斯 / 赫尔摩波利斯 / 孟斐斯创世神学”应作为来源化传统并存，而不是产品层选择唯一版本。
4. **Syncretism First-Class**：`Amun-Ra`、`Ra-Horakhty` 等合流神格不能简单建成“换装 Variant”；需要明确身份合流、时期与来源语义。
5. **反沙漠化 Visual DNA**：尼罗河、纸莎草沼泽、黑土地、星空墓室、彩绘神庙、太阳舟、圣湖与植物生命必须与沙漠共同构成视觉语言。

---

# 1. 当前仓库盘点

## 1.1 当前 Character：只有阿努比斯

现有正式埃及 Character：

- `character-anubis`
- slug：`anubis`
- role：亡者守护神
- 当前 anchors：胡狼头 / 天平 / 黑金 / 安卡

现有 Variant：

- `ceremonial-judge` / 审判礼装
- `duat-guardian` / 冥界守门神相

需要保留现有 ID / slug / URL，不做破坏性迁移。

但当前阿努比斯模型需要在补全时校正：

- 阿努比斯确实参与亡者仪式与心脏称量，但“天平”不应成为其所有场景的唯一主识别物；
- 其核心还包括木乃伊化、墓地守护、亡者引导等职责；
- 黑色具有再生、尼罗河沃土、死亡与复生等宗教象征，不应只解释成“暗黑”；
- 胡狼 / 犬科形态需要支持完整动物形、胡狼头人形等不同古代图像形式，而不是固定现代兽人设计。

## 1.2 当前 Story：3 篇

当前已经有：

1. `story-ra-solar-voyage` / 拉神的太阳神舟；
2. 奥西里斯死亡与复生相关 Story；
3. `story-weighing-heart` / 心脏称量。

这三篇都应该保留公开 ID / slug，并升级为正式埃及 P0 Story。

当前主要缺口：

- 拉神 Story 没有正式 `Ra` Character；
- 奥西里斯 Story 没有 `Osiris / Isis / Horus / Seth / Nephthys` 等参与者；
- 心脏称量只有 Anubis，没有 `Ma'at / Thoth / Ammit / Osiris`；
- 三篇都高度依赖 `world-duat`，World / Scene 空间层过于粗糙；
- 来源已经有意识区分《阿姆杜阿特书》《金字塔文》《棺材文》《亡灵书》，但还没有形成 claim-level source policy。

## 1.3 当前 World：只有杜阿特

`world-duat` 是正确且重要的核心 World，但不能承载全部埃及神话。

当前“所有埃及故事 → Duat”的结果会造成：

- 创世故事被错误塞进冥界；
- 荷鲁斯与塞特的王权故事缺少人间 / 神庭 / 尼罗河空间；
- 拉神白昼航行与夜间航行没有空间差异；
- 芦苇之野、墓室、神庙、沼泽、原初之水全部被压扁；
- 视觉上每张图都是黑金墓室和星河。

## 1.4 当前 Visual DNA 过于单一

现有识别：

```text
太阳金 / 砂岩 / 青金石 / 黑石
太阳圆盘 / 圣甲虫 / 鹰 / 象形几何
炽热 / 永恒 / 神秘
```

适合作为入口，但不足以支持规模化出图。

若不扩展，容易产生：

- 每张图都有金字塔；
- 每个神都黑金重甲；
- 神庙建筑变成现代奇幻宫殿；
- 象形文字被当成随机发光符文；
- 动物头神全部变成欧美游戏兽人；
- 女性神祇全部使用同一“埃及艳后”模板；
- 新王国冥界文本、古王国金字塔文本、晚期神庙图像被混成同一视觉时代。

---

# 2. 内容边界：什么算 MythCanvas 的“埃及神话”

P0 应覆盖：

- 古埃及创世与宇宙秩序；
- 太阳神传统；
- 奥西里斯—伊西斯—荷鲁斯—塞特主循环；
- 王权神学；
- 死亡、木乃伊化、审判与再生；
- 杜阿特太阳夜航；
- 与核心故事直接相关的重要神祇、怪物、空间与仪式。

P0 不应混入：

- 希腊罗马时代把埃及神祇重新解释后的全部后期秘教；
- 现代神秘学、塔罗、炼金术、New Age “埃及秘法”；
- 《木乃伊》等现代影视设定；
- 把 Cleopatra 当神话 Character；
- 泛“法老诅咒”；
- 现代阴谋论式金字塔神秘学。

P1 / Later 可独立扩展：

- Ptolemaic / Greco-Egyptian syncretism；
- Serapis 等后期复合神；
- 地方神庙神学与节庆；
- 历史法老的神格化传统；
- 更多魔法 / 治愈文本；
- 神庙赞歌与地方传说。

---

# 3. 来源体系：埃及补全的核心基础设施

## 3.1 不存在“一本埃及神话大全”

埃及神话与希腊不同，大量内容来自：

- 葬祭文本；
- 金字塔铭文；
- 棺材铭文；
- 墓室壁画；
- 神庙铭文；
- 魔法 / 医疗文本；
- 赞歌；
- 王权文本；
- 后期希腊作者记录。

因此 Story 的来源不应该被写成一个笼统的 `Egyptian mythology tradition`。

## 3.2 P0 Source Scope

### A. 古王国 / 王权与早期死后传统

- Pyramid Texts / 《金字塔文》

用途：

- 王权升天；
- 奥西里斯早期传统；
- 神谱声明；
- 死后世界；
- 太阳 / 星空关联。

### B. 中王国扩展

- Coffin Texts / 《棺材文》

用途：

- 更广泛的死后文本；
- 创世材料；
- Shu / Tefnut / Ogdoad 等宇宙论线索；
- 死者转化与冥界通行。

### C. 新王国冥界文本

- Amduat / 《阿姆杜阿特书》
- Book of Gates / 《门之书》
- Book of Caverns / 后续 P1
- Book of the Heavenly Cow / 《天牛之书》

用途：

- 太阳夜航；
- 杜阿特十二时辰；
- Ra 与 Osiris 的夜间结合 / 再生；
- Apophis / Apep；
- 毁灭人类 / Eye of Ra 传统。

### D. Book of the Dead

- Book of Coming Forth by Day / 《亡灵书》

其中 P0 重点：

- Spell 125 / 心脏称量；
- 亡者声明；
- 通往永生的图像与咒文系统；
- Aaru / Field of Reeds 等死后目标空间。

注意：`Book of the Dead` 不是线性叙事故事书，而是不同咒文与图像组成的集合，不能直接当作“埃及神话小说”。

### E. 创世 / 神学文本

- Shabaka Stone / 孟斐斯神学文本；
- Heliopolitan creation references；
- Hermopolitan / Ogdoad related texts。

要求：

- 不把现代 Egyptology 方便使用的 “Heliopolitan Theology / Hermopolitan Theology” 标签误写成古埃及自身统一教义名称；
- 标记具体文本和时期；
- 不把不同创世框架互相覆盖。

### F. 荷鲁斯与塞特

- The Contendings of Horus and Seth / 《荷鲁斯与塞特之争》Papyrus Chester Beatty I

这是 P0 王权主线的重要文本来源，应直接进入 Story Manifest。

### G. 后期外部来源

- Plutarch, *De Iside et Osiride*

仅作为：

- later Greco-Roman witness；
- 对奥西里斯故事较完整后期版本的辅助材料。

不能反向把其全部细节当作古王国 / 中王国时期已经存在的统一原典。

## 3.3 Claim-level Source Policy

每一个重要声明需要允许：

```ts
{
  sourceId,
  textScope,
  periodScope,
  traditionScope,
  claimType,
  confidence,
  note
}
```

重点挂来源的内容：

- parent / child；
- spouse / consort；
- creator identity；
- deity fusion；
- deity role；
- Horus identity；
- Seth genealogy；
- Osiris murder details；
- Ra / Atum / Amun / Ptah relationship；
- underworld geography；
- iconographic attributes；
- Story event ordering。

---

# 4. P0 Story Manifest

P0 建议先以 **28 篇核心 Story / Religious Narrative 单元**作为骨架。

数量不是最终 KPI；最终人物和空间数量仍由 Dependency Closure 决定。

## Volume A — 创世与第一次秩序

1. 原初之水 Nun 与第一次陆地
2. Atum 的自我生成
3. Shu 与 Tefnut 的出现
4. Geb 与 Nut 被分离
5. Ennead 神谱与宇宙世代
6. Ptah 以心与言创造世界（孟斐斯传统）
7. Ogdoad 与创世前状态（来源范围化）

## Volume B — 太阳与玛阿特

8. 拉神的白昼太阳航行
9. 拉神进入杜阿特
10. Apep 对太阳神舟的袭击
11. Ra 与 Osiris 在夜间结合与更新
12. Khepri 与黎明再生
13. Eye of Ra 离去与归来
14. Sekhmet 与“毁灭人类”传统

## Volume C — 奥西里斯家族与王权

15. Osiris 的王权与死亡
16. Isis 寻找并恢复 Osiris
17. Horus 的出生与隐藏
18. Isis 在纸莎草沼泽保护幼年 Horus
19. Horus 与 Seth 开始王位争夺
20. 《荷鲁斯与塞特之争》主要竞赛
21. 神庭裁决与 Horus 继承王权
22. Osiris 成为冥界之王

## Volume D — 死亡、审判与永生

23. Anubis 与木乃伊化 / 亡者准备
24. 亡者进入杜阿特与通过门域
25. 心脏称量
26. Thoth 记录审判结果
27. Ammit 与第二次死亡风险
28. Aaru / Field of Reeds 与理想永生

### P0.5 候选

- Isis 获取 Ra 的秘密名字；
- Thoth 与月亮 / 时间；
- Khnum 在陶轮塑造生命；
- Hathor 的不同神话角色；
- Neith 创世传统；
- Khonsu；
- Sobek；
- Bastet；
- Min；
- Montu；
-更多地方神庙叙事。

---

# 5. Character 规划

## 5.1 Tier S：首批正式视觉角色

建议首批 **18 个 Tier-S Character**：

1. Ra / Re / 拉
2. Atum / 阿图姆
3. Osiris / 奥西里斯
4. Isis / 伊西斯
5. Horus / 荷鲁斯
6. Seth / Set / 塞特
7. Anubis / 阿努比斯（保留现有）
8. Thoth / 托特
9. Ma'at / 玛阿特
10. Hathor / 哈索尔
11. Sekhmet / 塞赫麦特
12. Ptah / 普塔
13. Nut / 努特
14. Geb / 盖布
15. Nephthys / 奈芙蒂斯
16. Khepri / 凯布利
17. Apep / Apophis / 阿佩普
18. Ammit / 阿米特

Tier S 必须具备：

- canonical design；
- identity anchors；
- mythological facts；
- iconographic forms；
- period / source notes；
- avoid rules；
- production prompt；
- mobile portrait；
- graph portrait；
-至少一个 Story linkage。

## 5.2 Dependency Closure 必然补充池

Story 闭包大概率会引入：

- Nun；
- Shu；
- Tefnut；
- Wepwawet；
- Neith；
- Sia；
- Heka；
- Hu；
- Mehen；
- Serqet；
- Four Sons of Horus；
- Ogdoad 成员；
- tribunal / Ennead 相关神祇。

不预设最终数量，只要求：

> **P0 Story Dependency Coverage = 100%**

## 5.3 Taxonomy 不要混维度

建议至少拆开：

```text
characterType:
  deity
  primordial-being
  demon/chaos-being
  divine-animal
  monster
  personified-principle

culticGroup / theologicalGroup:
  Ennead
  Ogdoad
  Osirian-cycle
  solar-cycle
  ...

functionalDomains:
  kingship
  sun
  sky
  death
  embalming
  writing
  maat/order
  fertility
  protection
  magic
  ...
```

不要把 `deity / solar / ennead / female` 塞进同一个 type 字段。

---

# 6. 埃及神祇身份模型：必须解决 Syncretism

这是埃及神话相对希腊、北欧最重要的模型差异之一。

常见情况：

- Ra / Atum-Ra；
- Amun / Amun-Ra；
- Ra-Horakhty；
- Horus 的不同地方 / 年龄 / 神学形态；
- Hathor 与 Eye of Ra；
- Sekhmet / Hathor 在部分叙事中的角色转换；
- Anubis 与 Osiris 在不同时期死者神职上的重心变化。

### 不允许的处理

```text
Amun-Ra = Ra 换了一套衣服
Ra-Horakhty = Ra 的 Variant
Horus the Elder = Horus the Child 的年龄 Variant
```

这会把神学身份问题错误降级为视觉换装。

### 建议建模规则

#### A. Epithet

若只是称号 / 神名修饰：

- 作为 alias / epithet；
- 不创建独立 Character。

#### B. Iconographic Form

若是同一神祇的标准图像形态：

- human；
- falcon-headed human；
- full falcon；
- scarab；

使用 `iconographicForms` / Canonical Design，不等同 Character Variant。

#### C. Syncretic Identity

若形成具有明确历史、神学和崇拜语义的复合身份：

- 建议独立 identity node 或 CharacterInterpretation；
- 带 `periodScope` / `cultCenter` / `sourceScope`；
- 可关联多个 base deity。

例如：

```text
Amun-Ra
  composedOf: Amun + Ra
  periodScope: New Kingdom+
  identityType: syncretic-deity
```

是否升级成独立 Character，按以下标准决定：

- 是否有独立故事依赖；
- 是否有独立页面搜索价值；
- 是否有稳定视觉识别；
- 是否有独立关系或崇拜历史；
- 是否仅仅是某段文本中的称号。

---

# 7. Horus 必须专项处理

“Horus”不能默认视为一个在三千年历史里完全稳定的单一角色。

至少要在来源层区分：

- Horus as king / sky god；
- Horus son of Isis / Osiris；
- Horus the Child / Harpocrates（后期）；
- Horus the Elder；
- Ra-Horakhty 等太阳合流身份。

P0 产品层可以仍然保持一个主入口 `Horus`，但必须通过：

- Interpretation；
- identity note；
- source scope；
- period scope；
- iconographic forms；

避免将所有传统合并成一句“荷鲁斯是奥西里斯和伊西斯的鹰头儿子”。

---

# 8. World / Scene 设计

## 8.1 World 原则

World 继续保持“神话空间 / 宇宙域”语义，不把所有历史城市直接建 World。

建议 P0 World 候选：

### 1. Duat / 杜阿特

保留现有：

- 夜间太阳航行；
- 冥界诸门；
- Osiris；
- 死亡与再生。

### 2. Celestial Sky / 天空神域

用于：

- Nut；
- 日舟白昼航行；
- 星辰；
- horizon / akhet。

### 3. Primeval Waters / 原初之水

用于：

- Nun；
- 第一次陆地；
- Atum / creation。

是否最终建成 World，取决于 Story Scene 复用程度；若仅出现于 1–2 篇 Story，可降为 Scene。

### 4. Aaru / Field of Reeds / 芦苇之野

用于：

- 审判之后的理想永生；
- 农田、水道、芦苇与重生。

### 5. Divine Egypt / Sacred Nile Realm

谨慎评估。

不建议简单创建 `world-egypt`；现实埃及不是神域。

如果王权、幼年 Horus、尼罗河沼泽相关 Story 需要统一空间，可建立更抽象的叙事域，但必须避免把现实地理伪装成超自然 World。

## 8.2 Scene 应比 World 丰富

建议 P0 Scene：

- Primeval Mound / 第一丘；
- Solar Barque at Dawn；
- Solar Barque at Night；
- Gates of Duat；
- Hall of Two Truths / 双真理厅；
- Weighing Hall；
- Throne of Osiris；
- Papyrus Marsh of Isis and Horus；
- Nile Floodplain；
- Temple Hypostyle Hall；
- Star-painted Tomb Chamber；
- Field of Reeds；
- Horizon / Akhet；
- Divine Tribunal；
- Desert Necropolis；
- Sacred Lake；
- Celestial Body of Nut。

---

# 9. Character Relation / Graph

P0 Graph 必须支持来源冲突与身份层叠。

关系类型至少覆盖：

```text
parent
child
sibling
consort
rival
successor
protector-of
attendant-of
creator-of
manifestation-of
syncretized-with
associated-with
opposes
```

但 `associated-with` 只能作为弱关系补充，不能成为把所有神连成一团的万能边。

### 核心关系闭包

至少应完整表达：

```text
Geb + Nut
  → Osiris / Isis / Seth / Nephthys

Osiris + Isis
  → Horus

Osiris ↔ Seth
  → kingship / death conflict

Horus ↔ Seth
  → throne contest

Isis → Horus
  → mother / protector

Anubis → deceased / embalming
Thoth → judgement / recording
Ma'at → cosmic order / weighing principle
Apep ↔ Ra
  → nightly chaos conflict
```

注意：谱系关系需要 `traditionScope`，不能假设所有文本完全一致。

---

# 10. Visual DNA V2

## 10.1 视觉核心不再是“沙漠”

建议扩展为 8 个视觉域。

### A. Solar

- white-gold sunlight；
- solar disk；
- horizon glow；
- solar barque；
- scarab dawn；
- red / gold / white。

### B. Nile / Black Land

- papyrus；
- lotus；
- reed marsh；
- fertile dark soil；
- irrigation channels；
- green-blue life palette。

### C. Temple

- sandstone pylons；
- painted columns；
- lotus / papyrus capitals；
- sacred lake；
- incense haze；
- carved relief rather than random glowing glyphs。

### D. Funerary

- black resin；
- linen；
- gold masks；
- canopic protection；
- star ceilings；
- restrained torch / oil-lamp lighting。

### E. Duat

- dark blue night field；
- stars；
- red solar disk；
- segmented registers；
- gates / serpents / barques；
- tomb-painting composition language。

### F. Royal

- white / red crowns；
- uraeus；
- throne；
- falcon protection；
- ceremonial symmetry。

### G. Divine Animal Iconography

- falcon；
- ibis；
- jackal / canid；
- cow；
- lioness；
- scarab；
- crocodile。

使用必须按具体 deity source，而不是随机动物拼装。

### H. Primeval / Cosmic

- dark water；
- first mound；
- sky goddess；
- stars；
- air separation；
- minimal monumental composition。

## 10.2 Anti-patterns

硬性禁止：

- 每张图都有金字塔；
- 每个角色都穿金色重甲；
- 把 Egyptian deity 做成 MCU / 游戏 Boss；
- 随机发光象形文字；
- 在角色皮肤上铺满“神秘符文”；
- 全员黑皮 / 全员白皮的现代种族模板化；
- 把象征性古代肤色直接当现代写实肤色编码；
- Cleopatra / Nefertiti 妆容套给所有女性神；
- 所有男性赤膊 + 金领；
- 所有女性只剩性感舞姬造型；
- 用阿拉伯 / 伊斯兰建筑装饰古埃及神庙；
- 混用希腊柱式；
- 把 Anubis 固定为黑色狼人；
- 把 Seth 固定为普通豺狼 / 狗 / 驴；
- 把 Apep 画成泛西方龙。

---

# 11. Character Canonical Design 专项要求

每个 Tier S Character 需要新增或强化：

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
syncretismNotes
avoid
canonicalPrompt
```

### 示例：Anubis

```text
identityAnchors:
- black canid / jackal-associated head
- embalming and necropolis context
- divine kilt / ritual regalia

iconographicForms:
- recumbent black canid
- canid-headed anthropomorphic deity

avoid:
- werewolf anatomy
- generic fantasy armor
- permanently holding scales in every scene
- random glowing hieroglyph tattoos
```

### 示例：Ma'at

核心不是“拿羽毛的女神”这么简单：

- ostrich feather；
- truth / order / justice / cosmic balance；
- relation to kingship and solar order；
- weighing scene uses feather as standard iconographic marker；
- avoid angel / Greek goddess visual drift。

---

# 12. Structured Content 目录

埃及不再继续堆进 `src/data/seed.ts` 与 `src/data/stories.ts`。

目标目录：

```text
src/content/egyptian/
├── index.ts
├── catalog.ts
├── characters.ts
├── relations.ts
├── interpretations.ts
├── worlds.ts
├── scenes.ts
├── stories.ts
├── sources.ts
├── visual-dna.ts
├── aliases.ts
└── validators.ts
```

长期应由通用 registry 注册：

```text
src/content/greek
src/content/norse
src/content/japanese
src/content/egyptian
...
```

而不是出现：

```text
if mythology === greek ...
if mythology === egyptian ...
```

## 12.1 Import Pipeline

```text
structured content
  → schema validation
  → source / claim validation
  → dependency closure validation
  → relation validation
  → image / prompt validation
  → normalized import
  → D1 sync
```

必须保证：

- idempotent；
- 可回滚；
- 无 dangling relation；
- 无 dangling Story dependencies；
- alias 唯一；
- slug 稳定；
- existing Anubis / Story IDs 不漂移。

---

# 13. P0 实施顺序

## Batch 0 — 模型补洞

1. 确认 generic mythology registry 已可承载 Egyptian；
2. 增加 syncretic identity / interpretation 表达规则；
3. 增加 iconographic forms 数据结构；
4. 补 source period / tradition scope；
5. 确认 Character Graph 支持 source-scoped edge。

## Batch 1 — Story Manifest + Sources

1. 建立 28 篇 Story Manifest；
2. 为每篇建立 source scope；
3. 标记 period；
4. 拆出 direct textual evidence / later reconstruction；
5. 对 Plutarch 等后期来源做显式 later-source 标记。

## Batch 2 — Dependency Closure

自动生成：

```text
Story
  → Character dependencies
  → Relation dependencies
  → World dependencies
  → Scene dependencies
  → required Sources
```

输出缺口报告。

## Batch 3 — Character + Relation

1. 建 Tier S 角色；
2. 补 dependency characters；
3. 补 genealogy；
4. 补 rivalry / succession；
5. 补 syncretism；
6. 补 alias / transliteration。

## Batch 4 — World / Scene

1. 保留 Duat；
2. 引入真正必要的新 World；
3. Scene 承担具体地点 / 仪式空间；
4. 移除所有 Story 对 `world-duat` 的无脑复用。

## Batch 5 — Story 正文

要求每篇：

- 3–6 分钟；
- source notes；
- version note；
- character linkage；
- world / scene linkage；
- 非现代百科式硬拼；
- 明确“文本没有提供的细节”。

## Batch 6 — Character Detail + Graph

- Character Detail ViewModel；
- relation textual fallback；
- source / tradition display；
- syncretism display；
- Horus interpretation switching；
- mobile graph performance。

## Batch 7 — Visual Assets

优先级：

```text
Tier S Character canonical portrait
> Story hero
> World hero
> Scene hero
> wallpaper variants
```

不要让 100+ 壁纸生产阻塞内容 P0。

---

# 14. 视觉资产分层

## Tier S

18 个核心角色：

- canonical mobile portrait；
- canonical PC wallpaper；
- graph portrait；
- prompt-ready identity pack。

## Tier A

Story 高频角色 / World：

- 1 张 canonical portrait 或 hero；
- 不要求全尺寸 wallpaper 套装。

## Tier B

Dependency-only 实体：

- 允许先无正式壁纸；
- 使用结构化 identity / iconography；
- Story 仍可上线。

---

# 15. 关键质量门禁

## 15.1 Narrative Coverage

```text
P0 Story manifest coverage = 100%
```

## 15.2 Dependency Coverage

```text
P0 story dependency closure = 100%
```

无：

- missing character；
- missing world；
- missing scene；
- dangling relation。

## 15.3 Source Coverage

所有 P0 Story：

```text
source coverage = 100%
```

关键 relation / identity claim：

```text
claim-level source coverage = 100%
```

## 15.4 Period / Tradition Coverage

所有存在明显历史层叠的条目必须可回答：

```text
Which period?
Which source?
Which local / theological tradition?
Is this reconstruction or direct attestation?
```

## 15.5 Syncretism Correctness

不得出现：

- Amun-Ra 被当成衣服 Variant；
- Ra-Horakhty 被无来源合并；
- 所有 Horus 传统被压成同一个儿童 / 鹰头角色；
- 后期 Isis 图像反投射为所有时期唯一标准。

## 15.6 Visual Correctness

Tier S：

```text
canonical design coverage = 100%
portrait coverage = 100%
avoid rules coverage = 100%
iconographic form coverage = 100%
```

## 15.7 Cultural / Historical QA

0 个 P0 critical error：

- 伊斯兰 / 阿拉伯建筑误植；
- 希腊罗马造型误植到早期埃及；
- 随机象形文字；
- 神祇动物形态错误；
- 王冠 / 神徽完全错配；
- 现代影视角色设计复刻；
- 明显时期错置。

---

# 16. 测试矩阵

至少新增：

```text
Egyptian content schema tests
Egyptian story dependency tests
Egyptian source scope tests
Egyptian relation graph tests
Egyptian syncretism tests
Egyptian alias / slug tests
Egyptian visual canonical design tests
Egyptian import idempotency tests
Egyptian no-dangling-entity tests
```

专项 fixture：

### Horus

验证不同 identity / interpretation 不被错误合并。

### Amun-Ra

验证 syncretic identity 不会退化为 costume variant。

### Heart Weighing

验证：

- Anubis；
- Ma'at；
- Thoth；
- Ammit；
- Osiris；

关系与 Story linkage 完整。

### Solar Voyage

验证：

- day / night scene 分离；
- Ra；
- Apep；
- Khepri；
- Duat；
- dawn rebirth。

---

# 17. Definition of Done

埃及神话 P0 完成时，应满足：

### 内容

- 28 篇核心 Story 全部上线；
- existing 3 Story 原 slug 保留；
- Story dependency closure 100%；
- Tier S 18 角色全部完成；
- Dependency Character 无遗漏；
- Relation / genealogy 无 dangling edge；
- World / Scene 能覆盖全部 P0 Story。

### 来源

- P0 Story source coverage 100%；
- 关键 claim 有 source scope；
- period / tradition 明确；
- late external source 不冒充 early Egyptian source。

### 模型

- syncretism 有一等表达方式；
- Horus 多身份问题可表达；
- iconographic forms 不再滥用 Character Variant；
- Egyptian 使用 generic content pipeline，不引入 Egyptian-only importer。

### 视觉

- Tier S canonical design 100%；
- Tier S portrait 100%；
- 核心 Story hero 覆盖；
- Visual DNA 不再等于“沙漠 + 金字塔 + 黑金”；
- 0 个 critical anachronism。

### 产品

- Character Detail 可查看来源化关系；
- Character Graph 能表达 genealogy / rivalry / syncretism；
- Story 页面可展示来源与版本说明；
- World / Scene 浏览不再全部落到 Duat；
- Creator 可消费角色 Canonical Design / iconographic forms / style prompt。

---

# 18. 建议最终信息架构

```text
Egyptian Mythology
│
├── Origins & Creation
│   ├── Nun
│   ├── Atum
│   ├── Shu / Tefnut
│   ├── Geb / Nut
│   ├── Ennead
│   ├── Ptah tradition
│   └── Ogdoad tradition
│
├── Sun & Ma'at
│   ├── Ra
│   ├── Solar Barque
│   ├── Apep
│   ├── Khepri
│   ├── Eye of Ra
│   └── Sekhmet
│
├── Osirian Kingship Cycle
│   ├── Osiris
│   ├── Isis
│   ├── Horus
│   ├── Seth
│   ├── Nephthys
│   └── Contendings
│
├── Death & Eternal Life
│   ├── Anubis
│   ├── Duat
│   ├── Weighing of the Heart
│   ├── Ma'at
│   ├── Thoth
│   ├── Ammit
│   └── Field of Reeds
│
└── Source / Tradition Layers
    ├── Pyramid Texts
    ├── Coffin Texts
    ├── Amduat
    ├── Book of Gates
    ├── Book of the Dead
    ├── Temple / Theology texts
    └── Later Greco-Roman witnesses
```

---

# 19. 最终原则

埃及神话补全最危险的做法，是把现代读者熟悉的几个符号拼成一张“埃及风设定集”：

```text
金字塔
+ 木乃伊
+ 阿努比斯
+ 沙漠
+ 法老
+ 发光象形文字
```

MythCanvas 应做的恰恰相反：

> **从具体文本、时期、地方传统和图像证据出发，把太阳循环、王权、死亡、复生、玛阿特秩序、尼罗河生命世界与复杂神祇身份重新连接起来。**

因此执行优先级应始终保持：

```text
Source Policy
→ Story Manifest
→ Dependency Closure
→ Identity / Syncretism Model
→ Character / Relation
→ World / Scene
→ Story Content
→ Character Detail / Graph
→ Visual Assets
→ Wallpaper Scale-up
```

而不是：

```text
先列 100 个神
→ 随机配几张金字塔背景图
→ 再补百科简介
```

这套方案完成后，埃及神话才会从当前的单点“杜阿特 + 阿努比斯”入口，升级成真正可持续扩展、可讲故事、可检索、可出图、可做角色图谱的完整神话内容宇宙。
