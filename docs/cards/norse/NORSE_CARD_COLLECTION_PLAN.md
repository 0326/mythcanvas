# MythCanvas 北欧收藏卡总规划

> 状态：Master Planning  
> 版本：V1.2  
> 日期：2026-09-06  
> 适用范围：北欧神话收藏卡系列拆分、逐期 50 张套卡规划、Series Bible / Card Manifest / Artwork / 后续实体制卡。  
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
Collection Series
      ↓
50 个内容主题
      ↓
Phase A：壁纸级纯画面 Artwork
      ↓
Phase B：实体卡版式 / 印刷适配
```

每套固定包含五类内容主题：

```text
Character       角色
Scene           场景
Story           故事 / Key Moment
Mythic Object   神物
Hero / Ensemble 系列封面 / 群像
```

五类数量按系列内容灵活分配。唯一硬要求：

> **50 个主题都必须有独立叙事或视觉价值，禁止靠同角色换姿势、换背景、换色凑数。**

第一阶段规划 **6 套 × 50 = 300 个核心内容主题**。

---

# 1. Artwork First：卡图与实体制卡分离

所有系列统一采用两阶段生产。

## Phase A：Artwork Production

当前阶段只生产高质量纯画面资产。

### 默认规格

除每套的 2 张系列封面 / 群像外，其他全部默认：

```text
方向：竖版手机壁纸
比例：9:16
最低输出尺寸：1620 × 2880 px
```

每套 2 张 Hero / Ensemble：

```text
方向：横版系列封面
比例：16:9
最低输出尺寸：2880 × 1620 px
```

即一套标准 50 主题默认为：

```text
48 × 1620 × 2880 竖版
2  × 2880 × 1620 横版
```

### Phase A 不考虑

- 实体卡成品比例；
- 卡框；
- 出血 / 安全区；
- 卡名 / 编号排版；
- CMYK；
- 纸张 / PVC / PET；
- 烫金 / UV / 压纹 / 镭射等工艺。

图片必须是纯 Artwork：

```text
no typography
no logo
no card frame
no number
no watermark
no pseudo-runes
```

## Phase B：Card Production

等供应商、实际成品尺寸、材质和工艺确定后，再从 Approved Artwork 进入：

```text
卡面重构 / 扩图 / 裁切
→ 卡框
→ 信息排版
→ 卡背
→ 色彩管理
→ 工艺
→ 打样
```

壁纸母图不为了未知的实卡尺寸提前牺牲构图；必要时应为实体卡重新构图。

---

# 2. 命名规则

统一采用：

> **大众认知主标题 + 准确叙事副标题**

主标题负责让用户一眼理解；副标题负责说明系列具体范围。

避免：

- 生僻古诺尔斯词作为唯一主标题；
- 跨文明都可套用的泛标题；
- 为认知度混入其他传统；
- 过度文学化而看不懂内容。

---

# 3. 产品分层

## 3.1 MYTHOS / 诸神神话

```text
M01 北欧创世：世界树与命运
M02 奥丁与诸神：阿萨与华纳的时代
M03 雷神索尔：巨人国远征
M04 诸神黄昏：巴德尔之死与世界终局
```

叙事顺序：

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

## 3.2 HEROIC SAGAS / 英雄传奇

```text
H01 屠龙者西格尔德：黄金诅咒
H02 诅咒之剑提尔锋：赫尔沃尔传奇
```

H01 已进入当前内容体系。H02 正式出图前必须先补完对应网站 Story / Character / Scene / MythicObject。

## 3.3 LEGENDS / 北境传奇（后续）

```text
H03 赫罗尔夫·克拉基：最后的王与狂战士
L01 拉格纳·洛德布罗克：蛇坑与诸子传奇
其他高价值 fornaldarsögur
```

Helgi、Völundr、Svipdagr、Rígr、Grottasöngr 等继续保留在网站内容体系中，不为满足 50 张体量强行拼成实体系列。

---

# 4. 第一阶段六套总规划

| 编号 | 正式系列名 | 内容内核 | 角色 | 场景 | 故事 | 神物 | 封面 | 总计 |
|---|---|---|---:|---:|---:|---:|---:|---:|
| M01 | **北欧创世：世界树与命运** | Creation / Yggdrasil / Fate | 16 | 11 | 19 | 2 | 2 | **50** |
| M02 | **奥丁与诸神：阿萨与华纳的时代** | Gods & Treasures + Odin + Early Loki | 15 | 8 | 16 | 9 | 2 | **50** |
| M03 | **雷神索尔：巨人国远征** | Thor Cycle | 15 | 8 | 20 | 5 | 2 | **50** |
| M04 | **诸神黄昏：巴德尔之死与世界终局** | Baldr + Ragnarök + Late Loki | 17 | 9 | 15 | 7 | 2 | **50** |
| H01 | **屠龙者西格尔德：黄金诅咒** | Völsung / Sigurd / Guðrún / Atli | 18 | 8 | 17 | 5 | 2 | **50** |
| H02 | **诅咒之剑提尔锋：赫尔沃尔传奇** | Hervarar saga / Tyrfing | 16 | 8 | 20 | 4 | 2 | **50** |

> 卡型数量是系列内容预算，不是 Phase A 的“卡面设计”。Phase A 每个槽位先对应一张独立壁纸级 Artwork。

---

# 5. Story Cycle → Collection

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

Hervarar saga / Tyrfing（待补）
    → H02 诅咒之剑提尔锋
```

Loki 不单独做 50 张套卡：早期进入 M02，后期进入 M04。

---

# 6. 六套系列定位

## M01《北欧创世：世界树与命运》

核心：Ymir、Auðumbla、Búri、Odin / Vili / Vé、Ask / Embla、Yggdrasil、Norns、Sól / Máni、Sköll / Hati、Níðhöggr。

关键词：原初、冰火、创世、宇宙尺度、世界树、命运、日月。

详细方案：`docs/cards/norse/M01-norse-genesis/M01_CARD_PLAN.md`

## M02《奥丁与诸神：阿萨与华纳的时代》

核心：Æsir–Vanir War、Kvasir、Mead of Poetry、Iðunn / Þjazi、Skaði / Njörðr、Asgard Wall、Gods' Treasures、Freyr / Gerðr、Odin 求知、Valhöll / Valkyries。

关键词：奥丁、神族、战争与和解、知识、牺牲、神器、秩序。

## M03《雷神索尔：巨人国远征》

核心：Hrungnir、Hymir、Jörmungandr、Þrymr、Skrymir、Útgarða-Loki、Geirröðr、Alvíss、Hárbarðr。

关键词：雷神、远征、巨人国、海洋、力量、幻术、宴会、挑战。

## M04《诸神黄昏：巴德尔之死与世界终局》

核心：Fenrir / Gleipnir、Baldr、Hringhorni、Hermóðr / Hel、Loki Bound、Fimbulwinter、Gjallarhorn、终局宿敌、世界毁灭与再生。

关键词：预言、死亡、背叛、束缚、末日、宿敌、毁灭、新生。

## H01《屠龙者西格尔德：黄金诅咒》

核心：Völsung、Sigmund、Signý、Regin、Andvari、Fafnir、Sigurd、Brynhildr / Sigrdrífa、Guðrún、Gunnar、Högni、Atli。

关键词：屠龙、黄金、诅咒、家族、誓约、背叛、复仇。

## H02《诅咒之剑提尔锋：赫尔沃尔传奇》

核心：Tyrfingr、Angantýr、Hervör、墓丘取剑、Heiðrekr、谜语、继承、家族战争、Goths / Huns。

关键词：诅咒之剑、女战士、亡灵墓丘、继承、王权、战争。

---

# 7. 五类内容主题统一定义

## Character
稳定角色身份。单主体优先；跨系列保持 Canonical Design。

## Scene
独立 World / Scene。人物不是主体；必须有地点唯一性和空间尺度。

## Story
`MythStory → Key Moment → Artwork`。一个画面只表现一个主要事件瞬间。

## Mythic Object
真正具有持续身份和神话功能的物件；不为了配额造伪神器。

## Hero / Ensemble
系列级海报主视觉。每套固定 2 张，默认横版 2880 × 1620。

---

# 8. Story Artwork 原则

**Story ≠ 一篇文章一张图。**

```text
MythStory
  ↓
3～7 个视觉 Key Moments（按实际价值）
  ↓
挑选真正独立且不重复的 Artwork Slot
```

每个 Key Moment 至少记录：

```text
storyId
sourceRefs
characters
scene / world
object
visualThesis
avoid
```

不能通过“同一个角色换姿势”扩卡。

---

# 9. Series Ready Gate

某一系列进入 Phase A 批量出图前必须满足：

## Narrative
- 核心故事线完整；
- 有明确起点、发展和终点；
- Key Moments 足以形成 50 个不同视觉主题。

## Entity
- 角色依赖闭包；
- 场景依赖闭包；
- 神物依赖闭包；
- 主要关系明确。

## Source
- 每个核心 Story 有来源；
- 高风险版本差异已 scope；
- 不将后期改编作为古典事实。

## Visual
- 核心 Character 有 Canonical Design；
- 核心 Scene 有视觉锚点；
- 风格不依赖现代影视 / 游戏 IP；
- 50 个主题没有明显重复。

## Artwork Spec
- 48 张普通主题：9:16，最低 1620 × 2880；
- 2 张系列封面：16:9，最低 2880 × 1620；
- 全部纯画面，无文字、无卡框、无 Logo。

---

# 10. 正式生产顺序

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

如果需要测试印刷工艺，可以从任意系列抽 Approved Artwork 做技术样卡，但不改变正式内容生产顺序。

---

# 11. 每期目录模板

```text
docs/cards/norse/
├── NORSE_CARD_COLLECTION_PLAN.md
├── M01-norse-genesis/
│   ├── M01_CARD_PLAN.md
│   └── CARD_PRODUCTION_SPEC.md     # Phase B，暂不创建
├── M02-odin-and-gods/
├── M03-thor-expeditions/
├── M04-ragnarok/
├── H01-sigurd/
└── H02-tyrfing/
```

逐期先锁内容与 Artwork，再考虑实体制卡。
