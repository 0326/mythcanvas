# MythCanvas 北欧收藏卡总规划

> 状态：Master Planning  
> 版本：V1.1  
> 日期：2026-09-06  
> 适用范围：北欧神话收藏卡系列拆分、逐期 50 张套卡规划、后续 Series Bible / Card Manifest / Art Bible / QA。  
> 上游内容：`src/content/norse/`、`docs/NORSE_STORY_MAP.md`、`docs/NORSE_MYTHOLOGY_COMPLETION_PLAN.md`  
> 相关产品方案：`docs/STORY_SERIES_COLLECTION_PRODUCT_PLAN.md`

---

# 0. 结论

北欧收藏卡不按现有 Story Cycle 一一出套，也不按“一个热门神 = 一套卡”拆分。

统一链路：

```text
完整北欧内容体系
      ↓
Story Cycle / Saga
      ↓
判断独立叙事内核与自然卡牌容量
      ↓
Collection Series
      ↓
每系列 50 张固定精品套卡
```

每套固定包含五类：

```text
角色卡 Character
场景卡 Scene
故事卡 Story / Key Moment
神物卡 Mythic Object
系列封面 / 群像卡 Hero / Ensemble
```

五类数量按系列内容灵活分配，不做统一配额。硬要求只有一条：

> **50 张都必须有独立叙事或视觉价值，禁止靠同角色换姿势、换背景、换色凑数。**

第一阶段规划 **6 套 × 50 张 = 300 张**。

---

# 1. 命名规则

所有系列统一采用：

> **大众认知主标题 + 准确叙事副标题**

主标题负责让用户一眼知道“这是什么”；副标题负责说明“这一套具体讲什么”。

避免：

- 用生僻古诺尔斯词作为唯一主标题；
- 用“世界之初 / 诸神时代”这类跨文明都能套用的泛标题；
- 为了知名度混入其他传统，例如用“尼伯龙根”替代 Old Norse 的 Völsung / Sigurd 传统；
- 过度文学化，导致用户看完标题仍不知道内容。

---

# 2. 产品分层

## 2.1 MYTHOS / 诸神神话

围绕宇宙创生、神族秩序、诸神冒险与 Ragnarök。

```text
M01 北欧创世：世界树与命运
M02 奥丁与诸神：阿萨与华纳的时代
M03 雷神索尔：巨人国远征
M04 诸神黄昏：巴德尔之死与世界终局
```

四套形成连续的大叙事：

```text
世界诞生
↓
诸神建立秩序
↓
诸神时代的冒险与冲突
↓
巴德尔之死
↓
诸神黄昏
↓
世界再生
```

## 2.2 HEROIC SAGAS / 英雄传奇

围绕人类英雄、家族、诅咒、战争与传奇 Saga。

```text
H01 屠龙者西格尔德：黄金诅咒
H02 诅咒之剑提尔锋：赫尔沃尔传奇
```

H01 已进入当前内容体系。H02 为外部资料复核后新增的高价值系列，正式出卡前必须先补完对应网站 Story / Character / Scene / MythicObject。

## 2.3 LEGENDS / 北境传奇（后续）

暂不纳入第一阶段 300 张：

```text
H03 赫罗尔夫·克拉基：最后的王与狂战士
L01 拉格纳·洛德布罗克：蛇坑与诸子传奇
其他高价值 fornaldarsögur
```

Helgi、Völundr、Svipdagr、Rígr、Grottasöngr 等继续保留在网站完整内容体系中，不为了满足 50 张体量强行拼成实体套卡。

---

# 3. 第一阶段六套总规划

| 编号 | 正式系列名 | 内容内核 | 角色卡 | 场景卡 | 故事卡 | 神物卡 | 封面/群像 | 总计 |
|---|---|---|---:|---:|---:|---:|---:|---:|
| M01 | **北欧创世：世界树与命运** | Creation / Yggdrasil / Fate | 16 | 12 | 18 | 2 | 2 | **50** |
| M02 | **奥丁与诸神：阿萨与华纳的时代** | Gods & Treasures + Odin + Early Loki | 15 | 8 | 16 | 9 | 2 | **50** |
| M03 | **雷神索尔：巨人国远征** | Thor Cycle | 15 | 8 | 20 | 5 | 2 | **50** |
| M04 | **诸神黄昏：巴德尔之死与世界终局** | Baldr + Ragnarök + Late Loki | 17 | 9 | 15 | 7 | 2 | **50** |
| H01 | **屠龙者西格尔德：黄金诅咒** | Völsung / Sigurd / Guðrún / Atli | 18 | 8 | 17 | 5 | 2 | **50** |
| H02 | **诅咒之剑提尔锋：赫尔沃尔传奇** | Hervarar saga / Tyrfing | 16 | 8 | 20 | 4 | 2 | **50** |

> 上表是系列级卡槽预算。逐期详细设计允许在五类间微调，但总数固定 50；如果某类缺少自然内容，应调整结构，不得造伪神物或重复画面凑数量。

---

# 4. Story Cycle → Collection 映射

当前内容层 Story Cycle 是知识图谱组织，不等于商品边界。

```text
creation
    → M01 北欧创世

gods-and-treasures
+ odin-cycle
+ early loki
    → M02 奥丁与诸神

thor-cycle
    → M03 雷神索尔

baldr-ragnarok
+ late loki
    → M04 诸神黄昏

volsung-cycle
    → H01 屠龙者西格尔德

Hervarar saga / Tyrfing（待补内容）
    → H02 诅咒之剑提尔锋
```

Loki 不单独做 50 张套卡：

- 早期 Loki 作为诸神秩序中的问题制造者 / 修复者进入 M02；
- 后期 Loki 从 Baldr 事件到 Ragnarök 进入 M04。

这样避免与 M02 / M04 大量重复。

---

# 5. 六套系列定位

## M01《北欧创世：世界树与命运》

核心：Ymir、Auðumbla、Búri、Odin / Vili / Vé、Ask / Embla、Yggdrasil、Norns、Sól / Máni、Sköll / Hati、Níðhöggr。

关键词：

> 原初、冰火、创世、宇宙尺度、世界树、命运、日月。

重点是 Scene / Story，不把它做成“神祇肖像集”。

详细方案：`docs/cards/norse/M01-norse-genesis/M01_CARD_PLAN.md`

## M02《奥丁与诸神：阿萨与华纳的时代》

核心：Æsir–Vanir War、Kvasir、Mead of Poetry、Iðunn / Þjazi、Skaði / Njörðr、Asgard Wall、Gods' Treasures、Freyr / Gerðr、Odin 求知、Valhöll / Valkyries。

关键词：

> 奥丁、神族、战争与和解、知识、牺牲、神器、秩序。

这是六套中神物卡占比最高的一套。

## M03《雷神索尔：巨人国远征》

核心：Hrungnir、Hymir、Jörmungandr、Þrymr、Skrymir、Útgarða-Loki、Geirröðr、Alvíss、Hárbarðr。

关键词：

> 雷神、远征、巨人国、海洋、力量、幻术、宴会、挑战。

定位是 Adventure Collection，不是纯战斗合集。

## M04《诸神黄昏：巴德尔之死与世界终局》

核心：Fenrir / Gleipnir、Baldr、Hringhorni、Hermóðr / Hel、Loki Bound、Fimbulwinter、Gjallarhorn、终局宿敌、世界焚毁与再生。

关键词：

> 预言、死亡、背叛、束缚、末日、宿敌、毁灭、新生。

商业视觉冲击最强，但正式发行顺序仍排在 M01～M03 之后。

## H01《屠龙者西格尔德：黄金诅咒》

核心：Völsung、Sigmund、Signý、Regin、Andvari、Fafnir、Sigurd、Brynhildr / Sigrdrífa、Guðrún、Gunnar、Högni、Atli。

关键词：

> 屠龙、黄金、诅咒、家族、誓约、背叛、复仇。

“Völsung Saga”保留为学术 / 系列内部英文标签，不作为中文主标题认知门槛。

## H02《诅咒之剑提尔锋：赫尔沃尔传奇》

核心：Tyrfingr、Angantýr、Hervör、墓丘取剑、Heiðrekr、谜语、继承、家族战争、Goths / Huns。

关键词：

> 诅咒之剑、女战士、亡灵墓丘、继承、王权、战争。

正式立项前必须先完成网站内容闭包。

---

# 6. 卡片五类统一定义

## 6.1 Character / 角色卡

表现一个角色的稳定身份，不是“角色在某场剧情中的截图”。

要求：

- 单主体为主；
- 明确 silhouette / signature symbol；
- 同一 Character 跨系列需保持 Canonical Design；
- 系列可改变服装状态、年龄阶段或情境，但不能改变核心身份锚点。

## 6.2 Scene / 场景卡

表现有独立空间价值的 World / Scene。

要求：

- 人物不是主体；
- 一眼可区分地点；
- 必须有空间尺度、材质、气候和地标；
- 不用“空旷雪山 + 极光”作为所有北欧场景的万能模板。

## 6.3 Story / 故事卡

表现 MythStory 中 source-backed 的具体 Key Moment。

核心规则：

```text
MythStory
   ↓
Key Moments
   ↓
Story Cards
```

一篇 Story 可以产出多张故事卡；一张故事卡只讲一个关键瞬间。

## 6.4 Mythic Object / 神物卡

产品层统一称“神物卡”，不局限武器。

可以包含：

```text
weapon
artifact
jewel
vehicle
vessel
food
substance
symbolic-object
```

必须是有来源、有稳定身份、有独立视觉价值的对象，禁止为了配额创造不存在的“神器”。

## 6.5 Hero / Ensemble / 系列封面群像卡

每套原则上 2 张：

1. 系列主封面；
2. 系列终章 / 另一极性群像。

必须生成成单一完整构图，禁止把多个独立角色图拼贴成海报。

---

# 7. 正式生产 / 发行顺序

正式系列应按神话叙事顺序推进：

```text
M01 北欧创世
↓
M02 奥丁与诸神
↓
M03 雷神索尔
↓
M04 诸神黄昏
↓
H01 屠龙者西格尔德
↓
H02 诅咒之剑提尔锋
```

原因：

- M01 建立世界观和整套 Norse Collection 的基础视觉语言；
- M02 建立诸神与神器体系；
- M03 在既有世界中展开冒险；
- M04 回收前面所有伏线；
- H01 / H02 再进入 Heroic Sagas 产品线。

若只需要做印刷 / 工艺技术样卡，可以从 M04 抽取 6～10 张高冲击画面测试，但不改变正式发行顺序。

---

# 8. Series Ready Gate

每套进入批量出图前必须同时满足：

### Narrative

- 有完整 Narrative Spine；
- Story / Key Moment 足够自然支撑 50 张；
- 每张 Story Card 能追溯到具体 Story / source scope。

### Entity

- 所有角色、场景、神物依赖已闭包；
- 需要新增的网站实体先补内容，再出卡；
- 不用卡牌设计反向制造伪 Canon。

### Visual

- 核心角色 Canonical Design 稳定；
- 场景具有可区分 Visual Anchor；
- Series Visual DNA 完成；
- 五类卡均有明确构图语法。

### Product

- 精确 Card Manifest = 50；
- 同一张卡只有一个主要视觉命题；
- 无重复肖像 / 换色 / 同构图凑数；
- 印刷安全区、出血、文字层、编号系统已定义。

---

# 9. 逐期详细规划目录规范

```text
docs/cards/norse/
├── NORSE_CARD_COLLECTION_PLAN.md
│
├── M01-norse-genesis/
│   ├── M01_CARD_PLAN.md
│   ├── CARD_MANIFEST.md          # 后续落地时可拆
│   ├── ART_BIBLE.md              # 后续落地时可拆
│   └── QA_CHECKLIST.md           # 后续落地时可拆
│
├── M02-odin-and-gods/
├── M03-thor-jotunheim/
├── M04-ragnarok/
├── H01-sigurd/
└── H02-tyrfing/
```

M01 先用一份完整详细方案验证结构；后续若内容继续膨胀，再将 Card Manifest / Art Bible / QA 拆成独立文档。

---

# 10. 总原则

```text
Source drives Story
Story drives Entity
Entity drives Visual
Story Cycle drives Collection
Series Bible drives 50-card Manifest
Manifest drives Art Production
```

收藏卡是完整神话体系的产品化结果，不反过来修改神话事实。
