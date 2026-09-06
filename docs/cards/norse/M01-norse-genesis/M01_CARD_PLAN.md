# M01《北欧创世：世界树与命运》详细方案

> 系列标签：M01  
> Category Code：`10`（收藏卡）  
> Mythology Code：`03`（北欧）  
> Series Code：`01`  
> 默认 Style Code：`00`  
> 状态：Detailed Planning / JSON Ready / Artwork Pending  
> 版本：V2.1  
> 日期：2026-09-07  
> 规模：**50 张 / 48 张竖版 + 2 张横版封面**  
> 全局卡号规范：`docs/cards/CARD_ARTWORK_ID_SPEC.md`  
> 产物规范：`M01_ARTIFACT_SPEC.md`  
> 单卡 Schema：`artwork.schema.json`  
> **50 条规划 JSON 数据真源：`M01_CARD_DATA.json`**

---

# 0. 核心结论

M01 当前不做实体卡面，而是先完成一套可用于壁纸、网站、后续印卡的 Artwork 母资产。

正式生成后，每张卡的标准产物：

```text
1003010001.png
1003010001.json
```

规划阶段先在 `M01_CARD_DATA.json` 中维护 50 条独立 Card JSON 数据；正式生成某张卡时，再把该记录与共用 Artifact Spec 合并，物化为同名独立 JSON，并写入实际 `prompt.final / model / attempt / QA`。

因此数据分两层：

```text
M01_CARD_DATA.json
  └─ 50 条单卡规划 JSON 数据
        ↓
生成某张 Artwork
        ↓
1003010001.json + 1003010001.png
```

图片是视觉结果；JSON 是卡片真源。

---

# 1. 10 位 Card ID

```text
CC MM SS TT NN
10 03 01 00 01
```

第 1 张：

```text
1003010001
```

当前范围：

```text
1003010001–1003010050
```

系统只维护一个 `cardId`，不维护 Content Key。

---

# 2. 系列完整故事

M01 讲述北欧世界第一次成形：

```text
金伦加鸿沟
↓
寒冷与火焰相遇
↓
尤弥尔 / 奥德胡姆拉
↓
布里与神族祖先
↓
奥丁 / 威利 / 维
↓
尤弥尔之躯化为世界
↓
阿斯克 / 恩布拉
↓
世界树与三口井
↓
诺恩与命运
↓
日月运行
↓
追逐者与尼德霍格
```

系列总结：

> M01 从金伦加鸿沟中寒冷与火焰的相遇讲起，经过尤弥尔与奥德胡姆拉、神族祖先布里、奥丁兄弟重塑世界、人类阿斯克与恩布拉诞生、世界树与三口井建立宇宙结构、诺恩确立命运，最终以日月运行、追逐者与尼德霍格的毁灭伏线收束。

---

# 3. 50 张类型配额

| 类型 | 数量 | 输出 |
|---|---:|---|
| Character | 16 | 竖版 9:16，≥1620×2880 |
| Scene | 11 | 竖版 9:16，≥1620×2880 |
| Story | 19 | 竖版 9:16，≥1620×2880 |
| Mythic Object | 2 | 竖版 9:16，≥1620×2880 |
| Hero / Ensemble | 2 | 横版 16:9，≥2880×1620 |
| **总计** | **50** | **48 竖 + 2 横** |

---

# 4. Story 卡 = Key Moment + 连续正文

Story 卡不能只有一句 Key Moment。

28–46 共 19 张 Story，每条 JSON 都保存：

```text
seriesSummary
chapter
chapterTitle
sequence
keyMoment
narrative
previousCardId
nextCardId
```

其中：

- `keyMoment`：负责图片要抓住哪个瞬间；
- `narrative`：负责这一张在完整故事中讲什么；
- `seriesSummary`：负责让单张 Story 也知道整个 M01 在讲什么；
- 19 张按 `sequence` 连起来必须能完整读懂 M01。

正文**不画到图片上**，只存在 JSON，可用于网站详情、收藏册、卡背、电子说明书、多语言和后续 AI 重新出图。

## 4.1 Story 阅读链

| Seq | Card ID | Chapter | Key Moment |
|---:|---:|---|---|
| 01 | `1003010028` | 鸿沟与寒流 | 雾冰流入鸿沟 |
| 02 | `1003010029` | 鸿沟与寒流 | 火星越过边界 |
| 03 | `1003010030` | 鸿沟与寒流 | 尤弥尔苏醒 |
| 04 | `1003010031` | 原初生命与祖先 | 奥德胡姆拉出现 |
| 05 | `1003010032` | 原初生命与祖先 | 四道乳流 |
| 06 | `1003010033` | 原初生命与祖先 | 冰中显现的布里 |
| 07 | `1003010034` | 旧世界的终结 | 三兄弟面对尤弥尔 |
| 08 | `1003010035` | 旧世界的终结 | 尤弥尔倒下 |
| 09 | `1003010036` | 旧世界的终结 | 大地由血肉形成 |
| 10 | `1003010037` | 旧世界的终结 | 海洋由血液形成 |
| 11 | `1003010038` | 旧世界的终结 | 骨化群山 |
| 12 | `1003010039` | 旧世界的终结 | 头骨撑起天空 |
| 13 | `1003010040` | 人类进入世界 | 海岸上的两段木材 |
| 14 | `1003010041` | 人类进入世界 | 第一口生命 |
| 15 | `1003010042` | 世界树与命运 | 世界树贯穿诸界 |
| 16 | `1003010043` | 世界树与命运 | 三根通向三泉 |
| 17 | `1003010044` | 世界树与命运 | 诺恩在泉边定命 |
| 18 | `1003010045` | 天空开始运行 | 日月开始运行 |
| 19 | `1003010046` | 天空开始运行 | 追逐与啃噬 |

完整逐段正文已经写入 `M01_CARD_DATA.json`。

---

# 5. Mythic Object：M01 正式有 2 张

之前的问题是：方案里有候选，但上游 `objects.ts` 没实体。现在已补齐。

## 47 · 太阳之车 Chariot of the Sun

```text
Card ID: 1003010047
Object ID: object-norse-sun-chariot
Source: Gylfaginning ch. 11
```

索尔驾驭，由阿尔瓦克与阿尔斯维德牵引，属于天体运行秩序。

视觉上：

- 车是主体；
- 太阳只作为功能关系；
- 不做豪华战车、游戏载具、满屏火焰。

## 48 · 斯瓦林之盾 Svalinn

```text
Card ID: 1003010048
Object ID: object-norse-svalinn
Source: Grímnismál st. 38
```

位于太阳之前，阻隔炽热。

视觉上：

- 盾是唯一主体；
- 太阳只做柔化背光；
- 不堆卢恩；
- 不做普通战斗盾牌英雄 Pose。

两件已进入 `src/content/norse/objects.ts`。

---

# 6. 默认 Style 00：去 AI 味

第一版 Ymir 暴露的问题：

```text
背景比主体还抢
所有区域同等精细
星云 / 冰山 / 雾 / 浮石 / 光效同时存在
“AI fantasy wallpaper / game key art”感明显
主体和背景没有细节层级
```

新的 Style 00 改为：

> **主体优先、背景克制、绘画感强、局部精细、整体简洁。**

## 6.1 三级细节

```text
一级：脸 / 手 / 核心神物 / Key Moment
      → 最高细节、最高对比

二级：身体 / 服装 / 近身材质
      → 中等细节

三级：背景
      → 大形、柔边、低对比、低纹理密度
```

禁止全图每一个地方都精致。

## 6.2 主体与背景必须分离

至少通过两项：

- 明度差；
- 冷暖差；
- 主体硬边 / 背景软边；
- 景深；
- 空气透视；
- 局部光线。

第一眼必须先看到角色 / 神物 / Key Moment，而不是先看背景奇观。

## 6.3 背景减法

每张最多：

```text
1 个主要环境元素
+
1 个次级环境元素
```

例如 Ymir：

```text
主体：Ymir
环境 1：冰火交界
环境 2：原初雾
```

不再同时加入银河、巨大月亮、浮石、极光、闪电、粒子雨、几十层冰山、发光符文、晶体皮肤。

## 6.4 推荐质感

```text
painterly
matte
broad readable shapes
restrained brush detail
natural imperfect edges
soft atmospheric background
limited focal sharpness
```

避免：

```text
hyper-detailed everything
glossy 3D
game key art
cinematic VFX overload
random glowing runes
excessive particles
galaxy / nebula as default
over-sharpened micro texture
```

---

# 7. 壁纸与未来裁卡

普通 48 张：

```text
9:16
最低 1620×2880
```

两张系列封面：

```text
16:9
最低 2880×1620
```

竖图统一：

```text
Critical Identity Zone
X 20%–80%
Y 12%–52%

Sacrificial Bottom
Y 70%–100%

Side Crop
左右约 14%
```

脸、身份 Symbol、核心 Story Action、神物关键结构必须在上半部成立。

---

# 8. 50 张 Manifest

```text
01–16 Character
17–27 Scene
28–46 Story
47–48 Mythic Object
49–50 Hero / Ensemble
```

完整 50 条 Card 数据已经进入：

```text
M01_CARD_DATA.json
```

它包含每张卡：

```text
cardId
cardNumber
type
slug
titleZh / titleEn
description
roleInSeries
storyIds
sourceRefs
seriesNarrative（Story）
visualThesis
promptSubject
```

并引用统一 `artworkDefaults`：尺寸、裁切区、细节层级、主体背景区分、Style Prompt 与 Negative Prompt。

---

# 9. 单卡正式 JSON 物化

规划真源：

```text
M01_CARD_DATA.json
```

生成 `1003010001` 时，读取对应记录 + `M01_ARTIFACT_SPEC.md`，形成：

```text
1003010001.json
```

然后补充：

```text
prompt.final       实际发送给模型的完整 Prompt
model              实际模型
generation.attempt
reference card IDs
generatedAt
QA result
```

最终与：

```text
1003010001.png
```

成对归档。

---

# 10. Gate

### Data Gate

- `M01_CARD_DATA.json` 有且仅有 50 条；
- Card ID = `1003010001–1003010050`；
- 不存在 Content Key；
- 每张有描述、来源、视觉命题和 Prompt 信息。

### Story Gate

- 19/19 Story 有连续 narrative；
- sequence 1–19 无断点；
- 看完全部 narrative 能理解 M01；
- Key Moment 与故事正文职责分离。

### Object Gate

- `object-norse-sun-chariot` 存在；
- `object-norse-svalinn` 存在；
- Mythic Object 不再引用规划占位。

### Visual Gate

- 主体第一眼明确；
- 背景细节密度明显低于主体；
- 不做“越精致越高级”；
- 主体上移；
- 底部 30% 可牺牲；
- 无文字、Logo、卡框、乱码。
