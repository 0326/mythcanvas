# M01 Artwork 产物与可重放出图规范

> 系列：M01《北欧创世：世界树与命运》  
> 状态：Normative / Phase A  
> 版本：V1.1  
> 日期：2026-09-06  
> 关联：`M01_CARD_PLAN.md`  
> Schema：`artwork.schema.json`

---

# 0. 目的

M01 当前阶段产出的不是“卡面”，而是未来可以同时用于壁纸、网站和实体卡的 **原始 Artwork 资产**。

每一个 Artwork ID 必须同时交付：

```text
1 张成品图片
+
1 个同名 JSON 描述文件
```

JSON 必须足以回答：

- 这张图为什么存在；
- 对应哪个内容卡位；
- 属于哪个神话体系 / 系列 / Style Edition；
- 对应哪个角色 / 场景 / 故事 / 神物；
- 依据哪些 Story / Source；
- 角色和世界 Canon 是什么；
- 当时实际使用了什么 Prompt；
- 哪些内容绝对不能生成；
- 主体放在哪里；
- 哪些边缘未来允许被卡面裁切或遮挡；
- 使用了哪些角色 Reference / 已批准 Artwork；
- 当前是第几版，为什么通过或被淘汰。

> **图片负责视觉结果，JSON 负责可复现、可维护和可重新生成。两者缺一不可。**

---

# 1. 唯一命名规则

统一 Artwork ID：

```text
MC-NOR-M01-PS-001
│   │   │   │   └─ Card No.
│   │   │   └──── Style Code
│   │   └──────── Series
│   └──────────── Mythology
└──────────────── Theme Namespace
```

字段：

```text
MC    = MythCanvas 卡片主题命名空间
NOR   = Norse mythology
M01   = MYTHOS series 01
PS    = Primordial Saga（两位大写英文字母）
001   = series content card number
```

格式：

```text
MC-{MYTHOLOGY}-{SERIES}-{STYLE}-{CARD_NO}
```

规则：

- `MYTHOLOGY`：三位大写英文代码；
- `SERIES`：产品线字母 + 两位数字；
- `STYLE`：**严格两位 A–Z 大写字母**；
- `CARD_NO`：三位数字；
- Style Code 必须登记后使用，全 MythCanvas Style Registry 不得复用同一码表示不同画风；
- ID 一旦进入 approved / published，不再修改。

## 1.1 Content Card 与 Style Artwork

内容身份不包含 Style：

```text
contentCardId = MC-NOR-M01-001
```

具体视觉资产包含 Style：

```text
artworkId = MC-NOR-M01-PS-001
```

因此未来同一内容卡可有多个画风：

```text
MC-NOR-M01-PS-001   Primordial Saga
MC-NOR-M01-XX-001   Future Style Edition
```

但二者必须都表示 M01 的第 001 张内容卡，不得因换 Style 改变主题身份。

## 1.2 当前 Style

```text
styleCode: PS
styleName: Primordial Saga
styleNameZh: 原初史诗
```

---

# 2. 双文件产物契约

每个 Artwork ID 使用同名文件：

```text
MC-NOR-M01-PS-001.png
MC-NOR-M01-PS-001.json

MC-NOR-M01-PS-002.png
MC-NOR-M01-PS-002.json
...
```

推荐归档结构：

```text
artifacts/cards/norse/m01/ps/
├── MC-NOR-M01-PS-001/
│   ├── MC-NOR-M01-PS-001.png
│   └── MC-NOR-M01-PS-001.json
├── MC-NOR-M01-PS-002/
│   ├── MC-NOR-M01-PS-002.png
│   └── MC-NOR-M01-PS-002.json
└── ...
```

未来不同 Style 分开归档：

```text
artifacts/cards/norse/m01/ps/
artifacts/cards/norse/m01/{style-code}/
```

## 2.1 完整性 Gate

一个 Artwork 只有同时满足以下条件才算 `ready`：

```text
image exists
JSON exists
JSON validates against artwork.schema.json
JSON.artworkId == 文件名
JSON.contentCardId == 去掉 Style 段后的内容卡 ID
JSON.styleCode == Artwork ID 中 Style 段
JSON.cardNumber == Artwork ID 最后一段
JSON.output.width / height 与实际图片一致
JSON.prompt.final 非空
JSON.composition.cropSafe 非空
JSON.sourceRefs / storyRefs 已完成内容审查
QA.status == approved
```

只有图片没有 JSON：**不允许进入正式资产库。**

只有 JSON 没有批准图片：状态只能是 `planned` / `generating` / `rejected`。

---

# 3. 当前输出尺寸

## 3.1 普通 48 张

Character / Scene / Story / Mythic Object：

```text
orientation: portrait
aspectRatio: 9:16
minimum: 1620 × 2880 px
```

## 3.2 系列封面 2 张

E01 / E02：

```text
orientation: landscape
aspectRatio: 16:9
minimum: 2880 × 1620 px
```

---

# 4. 构图与未来裁卡安全

当前不按实卡尺寸设计，但所有 Phase A Artwork 必须预留未来裁切能力。

## 4.1 竖图核心原则

> **主体上移，关键身份信息在上半部完成；底部和左右边缘承担可牺牲内容。**

### Critical Identity Zone

```text
X: 20%–80%
Y: 12%–52%
```

必须优先放：

- 角色脸；
- 核心身份 Symbol；
- 神器关键结构；
- Story Action 高潮；
- Scene 第一地标。

### Primary Subject Zone

```text
Y: 10%–66%
```

### Sacrificial Bottom Zone

```text
Y: 70%–100%
```

允许放：

- 地面；
- 腿部下段；
- 衣摆；
- 水面；
- 根系末端；
- 前景石块；
- 雾 / 火花 / 碎屑；
- 非关键环境。

**禁止**把人物脸、关键手部、关键神物、故事核心动作放到底部 30%。

### Crop-Tolerant Sides

```text
X: 0%–14%
X: 86%–100%
```

只放可延展 / 可裁元素。

## 4.2 JSON 必须记录裁切信息

每张 JSON 的 `composition` 必须明确：

```json
{
  "subjectAnchor": { "x": 0.50, "y": 0.32 },
  "criticalIdentityZone": { "xMin": 0.20, "xMax": 0.80, "yMin": 0.12, "yMax": 0.52 },
  "cropSafe": {
    "sacrificialBottomStart": 0.70,
    "sideCropTolerance": 0.14,
    "mustRemainVisible": ["face", "identity symbol", "primary action"]
  }
}
```

值可以按每张具体构图微调，但不得违反上面的总体原则。

---

# 5. JSON 核心字段

每个 JSON 至少包含：

```text
schemaVersion
artworkId
contentCardId
mythologyCode
seriesId
styleCode
styleName
cardNumber
type
slug
titleZh
titleEn
content
canon
visual
composition
prompt
references
output
generation
qa
```

## 5.1 Prompt 可重放要求

`prompt.final` 必须保存**实际发送给图片模型的完整 Prompt**。

不能只保存：

```text
Ymir, epic, ice, fire
```

而应保存：

- subject；
- scene；
- pose / action；
- camera；
- composition；
- safe-zone；
- palette；
- material；
- lighting；
- Style Edition；
- Canon constraints；
- avoid / negative；
- no text / no card UI；
- output orientation。

如果最终 Prompt 是由多个模板拼接而成，同时保存：

```text
prompt.templateVersion
prompt.components
prompt.final
```

`final` 是真正可重放的最终真源。

---

# 6. Reference 与版本

同一角色后续 Artwork 应引用已批准 Canon 图：

```json
"references": {
  "artworkIds": ["MC-NOR-M01-PS-004"],
  "characterCanonIds": ["character-odin"],
  "notes": "Reuse approved Creator-era Odin identity."
}
```

重新出图不创建新的 Content Card No.。

同 Style 内重试使用：

```text
generation.attempt: 1 / 2 / 3...
```

只有正式改变 Style Edition 时才变化 Style Code。

---

# 7. QA 与状态

建议状态：

```text
planned
prompt-ready
generating
review
approved
rejected
superseded
```

approved 必须满足：

- 内容正确；
- Style Code 与画风一致；
- 主体安全区正确；
- 下方被遮挡 30% 后仍能理解主视觉；
- 左右裁切约 14% 不损失身份；
- 无文字 / Logo / 卡框；
- Character identity consistency 通过；
- 图片与 JSON 文件名完全一致；
- JSON 能重放实际 Prompt。

---

# 8. 当前 M01 编号范围

当前首发 Style：`PS`。

```text
MC-NOR-M01-PS-001
...
MC-NOR-M01-PS-050
```

其中：

```text
001–016 Character
017–027 Scene
028–046 Story / Key Moment
047–048 Mythic Object
049–050 Hero / Ensemble
```

内容卡号 `001–050` 永久稳定；后续 Style Edition 只替换 `STYLE` 段。
