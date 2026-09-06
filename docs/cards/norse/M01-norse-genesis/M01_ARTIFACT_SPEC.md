# M01 Artwork 产物与可重放出图规范

> 系列：M01《北欧创世：世界树与命运》  
> 状态：Normative / Phase A  
> 版本：V3.0  
> 日期：2026-09-07  
> 关联：`M01_CARD_PLAN.md`  
> 全局卡号：`../../CARD_ARTWORK_ID_SPEC.md`  
> Schema：`artwork.schema.json`

---

# 0. 每张卡的标准产物

每个 Card ID 最终必须成对交付：

```text
1003010001.png
1003010001.json
```

图片只负责纯视觉结果；JSON 保存这张卡的**全部业务数据、内容数据、来源、故事描述、视觉规范、Prompt、Reference、生成版本与 QA**。

没有 JSON 的图片不进入正式资产库。

---

# 1. M01 Card ID

```text
Category   10 = 收藏卡
Mythology  03 = 北欧
Series     01 = M01
Style      00 = 当前默认风格
Card No.   01–50
```

范围：

```text
1003010001–1003010050
```

`cardId` 与各分段字段在 JSON 中均使用 **number**；不再维护 `contentKey`。

---

# 2. 输出尺寸

普通 48 张：

```text
portrait 9:16
minimum 1620 × 2880
```

系列封面 2 张：

```text
landscape 16:9
minimum 2880 × 1620
```

---

# 3. 未来裁卡安全

所有竖图遵循：

```text
Critical Identity Zone
X 20%–80%
Y 12%–52%

Primary Subject Zone
Y 10%–66%

Sacrificial Bottom Zone
Y 70%–100%

Side Crop Tolerance
左右各 14%
```

角色脸、身份符号、Story 核心动作、神物关键结构、Scene 第一地标必须在中上部成立。

底部 30% 即使被裁切或被未来卡牌信息区遮挡，也不能破坏理解。

---

# 4. 去 AI 味 Art Direction

M01 默认风格不是“越精致越好”，而是：

> **主体明确、背景克制、绘画感强、局部有细节、整体有留白与层次。**

## 4.1 Detail Hierarchy

每张图必须只有一个主要视觉中心：

```text
一级细节：脸 / 手 / 核心神物 / Story Action
二级细节：主体服装、近身材质、必要环境
三级细节：背景，只保留大形、空气透视和少量地标
```

禁止所有区域同等锐利、同等复杂。

## 4.2 Subject / Background Separation

必须至少通过两项形成主体与背景区分：

- 明度差；
- 色温差；
- 边缘清晰度差；
- 景深；
- 雾化 / 空气透视；
- 局部光线。

主体应明显比背景更清晰、更有对比度。

## 4.3 禁止常见 AI 堆砌

```text
no hyper-detailed everything
no excessive particles
no endless floating debris
no random glowing runes
no galaxy / nebula unless source-relevant
no crystal-covered-everything
no glossy game-CG finish
no excessive volumetric light
no blue-orange blockbuster grading by default
no ornamental micro-detail on every surface
```

一张图最多允许 **1 个主要环境奇观 + 1 个次级环境元素**。

例如 Ymir：主体是 Ymir；环境只需要“冰火交界 + 原初雾”，不再叠银河、浮石、极光、无数冰晶、火星、雷电。

---

# 5. JSON 必须保存的卡片数据

每张 JSON 至少包含：

```text
schemaVersion
cardId
categoryCode
mythologyCode
seriesCode
seriesLabel
styleCode
styleName
cardNumber
type
slug
titleZh
titleEn
cardDescription
content
seriesNarrative（Story 卡必填，其他类型可 null）
canon
visual
composition
prompt
references
output
generation
qa
```

## cardDescription

卡片自身的数据说明，不显示在 Artwork 图片中：

```text
short: 一句话识别
full: 完整内容介绍
roleInSeries: 为什么这张卡属于 M01
```

---

# 6. Story 卡必须形成完整可读故事

19 张 Story 卡不仅是 Key Moment 图，还承担 M01 的**连续故事阅读层**。

每张 Story JSON 必须有：

```json
"seriesNarrative": {
  "seriesTitle": "北欧创世：世界树与命运",
  "seriesSummary": "M01 从金伦加鸿沟的冰火相遇讲起，经过原初生命、神族祖先、尤弥尔之躯化为世界、人类诞生、世界树与命运秩序，最后以日月运行和毁灭伏线收束。",
  "chapter": 1,
  "chapterTitle": "冰与火之前",
  "sequence": 1,
  "keyMoment": "雾冰流入鸿沟",
  "narrative": "本卡对应的完整故事段落。",
  "previousCardId": null,
  "nextCardId": 1003010029
}
```

要求：

1. `seriesSummary` 让单张 Story JSON 也知道整套在讲什么；
2. `narrative` 不是图片提示词，而是面向读者的故事正文；
3. 19 段按 `sequence` 连接后，可以从头读懂 M01；
4. Key Moment 只是这一段故事的视觉抓手，不等于全部文本；
5. 来源差异必须留在 `content.sourceRefs` / `cardDescription.full` 中，不虚构补齐古代文本沉默。

Story Narrative 不画到卡图上，后续可以用于：

- 网站卡片详情；
- 收藏册；
- 实体卡背；
- 系列电子说明书；
- 多语言内容；
- AI 重新生成时理解剧情上下文。

---

# 7. Prompt 可重放

`prompt.final` 保存**实际发送给图片模型的完整 Prompt**。

生成前可以处于 `planned` 状态并保存 `prompt.draft`；一旦生成，必须把实际 Prompt 写入 `prompt.final`。

Prompt 必须覆盖：

```text
事实与 Story Context
+ Canon
+ 主体
+ 姿态 / 动作
+ Background
+ Art Direction
+ Detail Hierarchy
+ Subject Separation
+ Crop Safe
+ Orientation
+ Avoid
```

重画时 Card ID 不变，只更新：

```text
generation.attempt
prompt.final
generation.notes
qa
```

---

# 8. Reference

Story / Ensemble 使用已批准角色图时，必须记录其 Card ID：

```json
"references": {
  "cardIds": [1003010004, 1003010005],
  "characterCanonIds": ["character-odin", "character-vili"]
}
```

---

# 9. QA

## Data

- JSON 与图片同名；
- cardId 可按 10 位规则解析；
- 所有卡片业务数据都存在 JSON；
- Story 19 张 narrative 顺序完整，无断链。

## Content

- Source / Story / Entity 引用存在；
- 不越界到 M02–M04；
- disputed material 标明来源范围；
- Mythic Object 必须对应正式 `objects.ts` 实体。

## Visual

- 第一眼先看到主体，而不是背景；
- 背景复杂度明显低于主体；
- 不出现“全画面每厘米都很精致”的 AI 堆料；
- 保留自然的大形和绘画边缘；
- 底部 30% 可牺牲；
- 无文字、Logo、卡框或乱码。
