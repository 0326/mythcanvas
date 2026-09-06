# M01 Artwork 产物与可重放出图规范

> 系列：M01《北欧创世：世界树与命运》  
> 状态：Normative / Phase A  
> 版本：V2.0  
> 日期：2026-09-06  
> 关联：`M01_CARD_PLAN.md`  
> 全局卡号：`../../CARD_ARTWORK_ID_SPEC.md`  
> Schema：`artwork.schema.json`

---

# 0. 目的

M01 当前阶段产出的不是实体卡面，而是未来可以同时用于壁纸、网站和实体卡的 **原始 Artwork 资产**。

每一个 Card ID 必须同时交付：

```text
1 张成品图片
+
1 个同名 JSON 描述文件
```

JSON 必须足以回答：

- 这张图为什么存在；
- 对应哪个内容卡位；
- 属于哪个类别 / 神话体系 / 系列 / Style；
- 对应哪些角色 / 场景 / 故事 / 神物；
- 依据哪些 Story / Source；
- Character / World Canon 是什么；
- 实际使用了什么 Prompt；
- 哪些内容绝对不能生成；
- 主体放在哪里；
- 哪些边缘允许未来卡面裁切或遮挡；
- 使用了哪些 Reference；
- 当前是第几次生成，为什么通过或被淘汰。

> **图片负责视觉结果，JSON 负责可复现、可维护和可重新生成。两者缺一不可。**

---

# 1. M01 10 位数字卡号

全局格式：

```text
CC MM SS TT NN
```

M01 当前代码：

```text
Category   00 = 收藏卡
Mythology  03 = 北欧神话
Series     01 = M01
Style      00 = 当前默认风格 / Primordial Saga
Card No.   01–50
```

因此：

```text
第 01 张：0003010001
第 02 张：0003010002
...
第 50 张：0003010050
```

必须作为字符串存储。

## 1.1 Content Key

具体 Style 卡号：

```text
cardId = 0003010001
```

跨 Style 稳定的内容身份：

```text
contentKey = 00030101
```

结构：

```text
Content Key = Category + Mythology + Series + Card No.
Card ID     = Category + Mythology + Series + Style + Card No.
```

未来第 01 张换 Style `01`：

```text
contentKey = 00030101
cardId     = 0003010101
```

内容仍是同一张卡。

---

# 2. 双文件产物契约

每个 Card ID 使用同名文件：

```text
0003010001.png
0003010001.json

0003010002.png
0003010002.json
...
```

推荐归档：

```text
artifacts/cards/norse/m01/style-00/
├── 0003010001/
│   ├── 0003010001.png
│   └── 0003010001.json
├── 0003010002/
│   ├── 0003010002.png
│   └── 0003010002.json
└── ...
```

## 2.1 完整性 Gate

一个 Artwork 只有同时满足以下条件才算 `ready`：

```text
image exists
JSON exists
JSON validates against artwork.schema.json
JSON.cardId == 文件名
JSON.contentKey == category + mythology + series + cardNumber
JSON.cardId == category + mythology + series + style + cardNumber
JSON.output.width / height 与实际图片一致
JSON.prompt.final 非空
JSON.composition.cropSafe 非空
JSON.content.sourceRefs 已审查
JSON.qa.status == approved
```

只有图片没有 JSON：不允许进入正式资产库。

只有 JSON 没有批准图片：状态只能是 `planned` / `prompt-ready` / `generating` / `review` / `rejected`。

---

# 3. 当前输出尺寸

## 3.1 普通 48 张

```text
Character / Scene / Story / Mythic Object
orientation: portrait
aspectRatio: 9:16
minimum: 1620 × 2880 px
```

## 3.2 系列封面 2 张

```text
E01 / E02
orientation: landscape
aspectRatio: 16:9
minimum: 2880 × 1620 px
```

---

# 4. 构图与未来裁卡安全

当前不按实卡尺寸设计，但所有 Phase A Artwork 必须预留未来裁切能力。

核心原则：

> **主体上移，关键身份信息在上半部完成；底部和左右边缘承担可牺牲内容。**

## 4.1 竖图区域

### Critical Identity Zone

```text
X: 20%–80%
Y: 12%–52%
```

优先放：

- 角色脸；
- 核心身份 Symbol；
- Story Action 高潮；
- 神物关键结构；
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

禁止把脸、关键手部、关键神物、故事核心动作放到底部 30%。

### Crop-Tolerant Sides

```text
X: 0%–14%
X: 86%–100%
```

只放可延展 / 可裁元素。

## 4.2 各卡型默认锚点

Character：

```text
脸 Y 22%–34%
胸肩 / Symbol Y 30%–50%
```

Story：

```text
主要动作中心 Y 20%–55%
```

Scene：

```text
第一地标放中上区域
底部作为进入场景的前景
```

Mythic Object：

```text
核心结构 Y 20%–58%
```

Ensemble 横版：

```text
核心群像 / 地标集中中央约 70%
四边保留延展环境
```

---

# 5. JSON 结构

每张 JSON 至少保存：

```text
schemaVersion
cardId
contentKey
categoryCode
mythologyCode
seriesCode
seriesLabel
styleCode
styleName
cardNumber
type
slug
titleZh / titleEn
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

## 5.1 示例

```json
{
  "schemaVersion": "2.0",
  "cardId": "0003010001",
  "contentKey": "00030101",
  "categoryCode": "00",
  "mythologyCode": "03",
  "seriesCode": "01",
  "seriesLabel": "M01",
  "styleCode": "00",
  "styleName": "Primordial Saga",
  "cardNumber": "01",
  "type": "character",
  "slug": "ymir",
  "titleZh": "尤弥尔",
  "titleEn": "Ymir",
  "content": {
    "storyIds": ["story-ymir-creation"],
    "characterIds": ["character-ymir"],
    "worldIds": ["world-niflheim"],
    "sceneIds": ["scene-ginnungagap"],
    "objectIds": [],
    "sourceRefs": [
      {
        "sourceId": "norse-src-prose-edda-gylfaginning",
        "locator": "chs. 4–8"
      }
    ]
  },
  "canon": {
    "identityAnchors": ["原初巨人", "冰与火之间诞生", "创世材料"],
    "mustKeep": ["巨大世界尺度", "霜岩湿气材质"],
    "mustAvoid": ["现代游戏 Boss", "重甲", "蓝皮冰巨人模板"]
  },
  "visual": {
    "visualThesis": "冰火交界中诞生、身体本身像未成形世界的原初巨人",
    "mood": ["primordial", "vast", "cold"],
    "palette": ["ice blue", "ash gray", "ember orange"],
    "materials": ["frost", "stone", "mist", "water"]
  },
  "composition": {
    "orientation": "portrait",
    "camera": "low-angle",
    "shot": "full-body",
    "subjectAnchor": { "x": 0.5, "y": 0.32 },
    "criticalIdentityZone": {
      "xMin": 0.2,
      "xMax": 0.8,
      "yMin": 0.12,
      "yMax": 0.52
    },
    "cropSafe": {
      "sacrificialBottomStart": 0.7,
      "sideCropTolerance": 0.14,
      "mustRemainVisible": ["face", "upper torso", "primordial scale"]
    }
  },
  "prompt": {
    "templateVersion": "m01-v1",
    "components": [],
    "final": "FINAL PROMPT USED FOR GENERATION",
    "negative": ["typography", "logo", "card frame", "watermark"]
  },
  "references": {
    "cardIds": [],
    "characterCanonIds": [],
    "notes": ""
  },
  "output": {
    "fileName": "0003010001.png",
    "width": 1620,
    "height": 2880,
    "format": "png"
  },
  "generation": {
    "model": "",
    "attempt": 0,
    "generatedAt": null,
    "notes": ""
  },
  "qa": {
    "status": "planned",
    "reviewNotes": []
  }
}
```

---

# 6. Prompt 可重放要求

`prompt.final` 必须保存 **实际发送给图片模型的完整 Prompt**，不能只保存摘要。

必须可独立重放：

```text
Content facts
+ Character / Scene Canon
+ Style / Art Direction
+ Composition
+ Crop-safe constraints
+ Output orientation
+ Avoid / negative constraints
```

如果重画只修改 Prompt：

- `cardId` 不变；
- `generation.attempt + 1`；
- 更新 `prompt.final`；
- 在 `generation.notes` 记录修改原因。

---

# 7. Reference 规则

Story / Ensemble 出图如果使用已批准角色图作为参考，JSON 必须记录其 10 位 Card ID：

```json
{
  "references": {
    "cardIds": ["0003010004", "0003010005"],
    "characterCanonIds": ["character-odin", "character-vili"],
    "notes": "lock creator-era faces and costume silhouettes"
  }
}
```

引用的是逻辑资产 ID，不依赖临时图片文件路径。

---

# 8. QA Gate

## Naming

- `cardId` 必须为 10 位数字字符串；
- M01 当前范围为 `0003010001–0003010050`；
- 文件名与 `cardId` 一致；
- `contentKey` 与 cardId 去掉 Style 段后的业务身份一致。

## Content

- Source / Story / Entity 引用存在；
- 不越界到 M02–M04；
- disputed material 有 source scope。

## Visual

- 主体上移；
- 底部 30% 可牺牲；
- 边缘裁切不损伤身份；
- Character Canon 一致；
- 无乱码、Logo、卡框、UI。

## Replayability

- Prompt 完整；
- Reference 完整；
- Generation attempt 可追踪；
- rejected / superseded 有原因记录。
