# M01 Artwork 产物与可重放出图规范

> 系列：M01《北欧创世：世界树与命运》  
> 状态：Normative / Phase A  
> 版本：V1.0  
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

# 1. 双文件产物契约

每个 ID 使用同名文件：

```text
MC-NOR-M01-001.png
MC-NOR-M01-001.json

MC-NOR-M01-002.png
MC-NOR-M01-002.json
...
```

推荐归档结构：

```text
artifacts/cards/norse/m01/
├── MC-NOR-M01-001/
│   ├── MC-NOR-M01-001.png
│   └── MC-NOR-M01-001.json
├── MC-NOR-M01-002/
│   ├── MC-NOR-M01-002.png
│   └── MC-NOR-M01-002.json
└── ...
```

实际发布到网站时可以复制 / 构建到 `public/`，但原始生产资产应保持图片与 JSON 成对存在。

## 1.1 完整性 Gate

一个 Artwork 只有同时满足以下条件才算 `ready`：

```text
image exists
JSON exists
JSON validates against artwork.schema.json
JSON.artworkId == 文件名
JSON.output.width / height 与实际图片一致
JSON.prompt.final 非空
JSON.composition.cropSafe 非空
JSON.sourceRefs / storyRefs 已完成内容审查
QA.status == approved
```

只有图片没有 JSON：**不允许进入正式资产库。**

只有 JSON 没有批准图片：状态只能是 `planned` / `generating` / `rejected`。

---

# 2. 当前输出尺寸

## 2.1 普通 48 张

Character / Scene / Story / Mythic Object：

```text
orientation: portrait
aspectRatio: 9:16
minimum: 1620 × 2880 px
```

默认优先直接生成 / 保存不低于：

> **1620 × 2880**

如果模型原生输出更高，可以保留更高分辨率母图，只要比例为 9:16 且不低于最低要求。

## 2.2 系列封面 2 张

E01 / E02：

```text
orientation: landscape
aspectRatio: 16:9
minimum: 2880 × 1620 px
```

两张横版主要承担系列封面、网站 Hero 与横版传播用途。

---

# 3. 竖版 Artwork 的“未来可裁卡”构图规则

虽然 Phase A 不按某一种实体卡尺寸设计，但必须为后续卡面裁切预留充分自由度。

核心原则：

> **主体上移，身份信息集中在画面上半部；边缘和底部属于可牺牲区域。**

换句话说：

```text
壁纸本身完整成立
+
未来裁掉四边一部分仍成立
+
未来卡面底部放名称 / 信息条后仍成立
```

## 3.1 9:16 标准区域

以画布左上角为 `(0, 0)`：

### A. Critical Identity Zone / 核心身份区

```text
X：20% ～ 80%
Y：12% ～ 52%
```

必须尽量包含：

- 角色脸 / 头部；
- 最重要的身份象征；
- Story 的关键动作中心；
- Mythic Object 的核心结构；
- Scene 的第一视觉地标。

未来无论左右裁边或底部遮挡，这个区域都应保持完整。

### B. Preferred Subject Zone / 主体主要占位区

```text
X：14% ～ 86%
Y：10% ～ 66%
```

角色躯干、主要动作、主地标应主要落在这里。

### C. Edge Flex Zone / 边缘弹性区

```text
左侧：0% ～ 14%
右侧：86% ～ 100%
```

只放：

- 环境延伸；
- 雾、火、云、水、树枝；
- 次要衣摆；
- 非核心群体；
- 可以损失的前景。

禁止把以下内容放在边缘弹性区：

- 脸；
- 手持神器主体；
- 关键手势；
- 故事唯一动作对象；
- 场景唯一识别地标。

### D. Bottom Flex Zone / 底部弹性区

```text
Y：70% ～ 100%
```

这是未来最可能被实体卡信息区遮挡、裁掉或重构的区域。

允许放：

- 腿 / 脚；
- 地面；
- 水面；
- 根系延展；
- 烟尘；
- 前景石块；
- 可丢失的环境纹理。

禁止让底部 30% 承担：

- 角色脸；
- 唯一关键道具；
- Story 的主要事件；
- Scene 的核心地标；
- 必须阅读才能理解画面的第二角色。

> 全身角色仍然可以画到脚，但“看懂这是谁 / 发生什么”不能依赖腿脚部分。

### E. Top Breathing Zone / 顶部呼吸区

```text
Y：0% ～ 8%
```

避免把头顶、角、王冠、树冠唯一尖端等关键结构贴边，防止壁纸 UI 与后续裁切压住主体。

## 3.2 角色卡图的主体位置

默认：

```text
脸中心：Y 约 22% ～ 34%
胸 / 身份道具：Y 约 32% ～ 50%
主要动作中心：Y 约 28% ～ 55%
```

建议 3/4 身或膝上构图优先于“人物很小的完整全身”。

当必须全身时：

- 上半身必须仍是第一视觉中心；
- 腿脚允许落入 Bottom Flex Zone；
- 裁掉膝盖以下仍应像一张完整角色主视觉。

## 3.3 Story 卡图的主体位置

Story 的关键事件中心默认位于：

```text
Y：20% ～ 55%
```

例如：

- “布里从冰中显现”：脸 + 破冰位置必须在上半部；
- “头骨撑起天空”：三兄弟 + 头骨动作位于中上，地面可裁；
- “诺恩定命”：三位 Norn 和关键动作在中上，泉水可向下延伸；
- “日月开始运行”：日月与人格主体位于上 2/3，低处云层可牺牲。

## 3.4 Scene 卡图的主体位置

Scene 虽然是大景，但也必须明确一个 **Primary Landmark**。

Primary Landmark 必须尽量进入：

```text
X：18% ～ 82%
Y：12% ～ 60%
```

例如：

- Yggdrasil：主干与树冠核心；
- Urðarbrunnr：泉 + 根部交界；
- Ginnungagap：冰火边界交汇中心；
- Celestial Path：日月轨迹的主视觉转折。

不要把“真正重要的景”全部放在最底部做漂亮前景。

## 3.5 Mythic Object 的主体位置

核心物件整体尽量位于：

```text
X：22% ～ 78%
Y：18% ～ 58%
```

物件可以有尾迹 / 光 / 绳索 / 马匹 / 环境向下延伸，但物件本体不能落入 Bottom Flex Zone。

---

# 4. 横版系列封面的安全构图

E01 / E02 不使用“主体必须上半部”规则，而使用横版中心安全区：

```text
Critical Zone
X：15% ～ 85%
Y：12% ～ 82%
```

主群像 / 世界树 / Ymir 等核心结构必须在中央安全区成立。

横版四周仍要留可延展环境，方便：

- 网站不同 Hero 比例；
- 社媒横图；
- 后续包装；
- 如果未来需要特殊横卡，可再次重构。

---

# 5. 每张 JSON 必须保存的信息

每张 Artwork JSON 至少包含以下层级：

```text
identity
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

## 5.1 Identity

```json
{
  "artworkId": "MC-NOR-M01-001",
  "seriesId": "M01",
  "type": "character",
  "slug": "ymir",
  "titleZh": "尤弥尔",
  "titleEn": "Ymir"
}
```

## 5.2 Content

保存这个 Artwork 为什么存在：

```json
{
  "storyIds": ["story-ymir-creation"],
  "characterIds": ["character-ymir"],
  "worldIds": ["world-niflheim", "world-muspell"],
  "sceneIds": ["scene-ginnungagap"],
  "objectIds": [],
  "sourceRefs": [
    {
      "sourceId": "norse-src-prose-edda-gylfaginning",
      "locator": "chs. 4–8"
    }
  ]
}
```

## 5.3 Canon

保存不能因重新出图而漂移的内容：

```json
{
  "identityAnchors": [
    "primordial giant",
    "born where frost and heat meet",
    "body visually foreshadows the material world"
  ],
  "mustKeep": [],
  "mustAvoid": [
    "modern superhero armor",
    "blue ice giant franchise look"
  ]
}
```

## 5.4 Visual Thesis

保存创作意图，而不只是 Prompt：

```json
{
  "visualThesis": "尤弥尔不是普通巨人，而是尚未形成世界本身的尺度参照。",
  "mood": ["primordial", "cold", "vast", "ominous"],
  "palette": ["deep black", "ice blue", "ash white", "ember orange"],
  "materials": ["frost", "wet stone", "mist"]
}
```

## 5.5 Composition

这是后续重出图最重要的结构化字段之一：

```json
{
  "orientation": "portrait",
  "aspectRatio": "9:16",
  "shot": "low-angle full figure",
  "camera": "slightly low angle",
  "primarySubject": "Ymir",
  "subjectAnchor": { "x": 0.50, "y": 0.36 },
  "faceAnchor": { "x": 0.50, "y": 0.27 },
  "actionAnchor": { "x": 0.50, "y": 0.42 },
  "cropSafe": {
    "criticalIdentityZone": { "xMin": 0.20, "xMax": 0.80, "yMin": 0.12, "yMax": 0.52 },
    "preferredSubjectZone": { "xMin": 0.14, "xMax": 0.86, "yMin": 0.10, "yMax": 0.66 },
    "bottomFlexStartsAt": 0.70,
    "edgeFlex": 0.14,
    "notes": "脸、肩部、原初体态必须在安全上半区；腿脚和地面允许未来裁切。"
  }
}
```

坐标统一使用 `0.0 ～ 1.0`，避免与具体像素尺寸绑定。

## 5.6 Prompt

JSON 必须同时保存：

```json
{
  "prompt": {
    "brief": "一句话视觉任务",
    "final": "实际发送给出图模型的完整最终 Prompt，原样保存",
    "avoid": [
      "text",
      "logo",
      "watermark",
      "card frame",
      "critical subject in bottom 30%"
    ]
  }
}
```

`prompt.final` 是**可重放字段**，不能只保存关键词。

如果后续 Prompt 经过人工修改：

- 不覆盖旧版本历史；
- `generation.version` 增加；
- `generation.changeNote` 说明改了什么。

## 5.7 References

保存角色一致性和二次生成依赖：

```json
{
  "referenceArtworkIds": ["MC-NOR-M01-004"],
  "referenceImagePaths": [],
  "styleReferenceIds": ["M01-STYLE-01"],
  "notes": "Story 图中 Odin 必须继承 C04 Creator 版本的脸和服装 Canon。"
}
```

不得只写“参考上一张”，必须写稳定 ID。

## 5.8 Output

```json
{
  "imagePath": "MC-NOR-M01-001.png",
  "format": "png",
  "width": 1620,
  "height": 2880,
  "orientation": "portrait"
}
```

实际尺寸高于 1620 × 2880 时保存真实值。

## 5.9 Generation

建议保存：

```json
{
  "status": "approved",
  "version": 3,
  "model": "actual-model-name",
  "generatedAt": "ISO-8601 timestamp",
  "seed": null,
  "changeNote": "v3 上移主体并修正左手结构"
}
```

如果模型没有 seed，保留 `null`，不要伪造。

## 5.10 QA

```json
{
  "status": "approved",
  "checks": {
    "sourceAccurate": true,
    "identityConsistent": true,
    "anatomyValid": true,
    "cropSafe": true,
    "noText": true,
    "noFranchiseContamination": true
  },
  "notes": []
}
```

---

# 6. 推荐完整 JSON 示例

```json
{
  "schemaVersion": "1.0",
  "artworkId": "MC-NOR-M01-001",
  "seriesId": "M01",
  "type": "character",
  "slug": "ymir",
  "titleZh": "尤弥尔",
  "titleEn": "Ymir",
  "content": {
    "storyIds": ["story-ymir-creation"],
    "characterIds": ["character-ymir"],
    "worldIds": ["world-niflheim", "world-muspell"],
    "sceneIds": ["scene-ginnungagap"],
    "objectIds": [],
    "sourceRefs": [
      { "sourceId": "norse-src-prose-edda-gylfaginning", "locator": "chs. 4–8" }
    ]
  },
  "canon": {
    "identityAnchors": ["primordial giant", "frost-and-heat origin"],
    "mustKeep": ["primordial scale"],
    "mustAvoid": ["modern superhero armor", "blue ice giant franchise look"]
  },
  "visual": {
    "visualThesis": "尤弥尔是未形成世界的尺度参照，而不是普通怪物。",
    "mood": ["primordial", "cold", "vast"],
    "palette": ["deep black", "ice blue", "ash white", "ember orange"],
    "materials": ["frost", "wet stone", "mist"]
  },
  "composition": {
    "orientation": "portrait",
    "aspectRatio": "9:16",
    "shot": "low-angle full figure",
    "camera": "slightly low angle",
    "primarySubject": "Ymir",
    "subjectAnchor": { "x": 0.50, "y": 0.36 },
    "faceAnchor": { "x": 0.50, "y": 0.27 },
    "actionAnchor": { "x": 0.50, "y": 0.42 },
    "cropSafe": {
      "criticalIdentityZone": { "xMin": 0.20, "xMax": 0.80, "yMin": 0.12, "yMax": 0.52 },
      "preferredSubjectZone": { "xMin": 0.14, "xMax": 0.86, "yMin": 0.10, "yMax": 0.66 },
      "bottomFlexStartsAt": 0.70,
      "edgeFlex": 0.14,
      "notes": "核心身份必须在上半部；底部只放可牺牲地面和腿脚。"
    }
  },
  "prompt": {
    "brief": "Ymir awakening between primordial frost and heat",
    "final": "<actual full prompt used for generation>",
    "avoid": ["typography", "logo", "watermark", "card frame", "critical subject in bottom 30%"]
  },
  "references": {
    "referenceArtworkIds": [],
    "referenceImagePaths": [],
    "styleReferenceIds": ["M01-STYLE-01"],
    "notes": ""
  },
  "output": {
    "imagePath": "MC-NOR-M01-001.png",
    "format": "png",
    "width": 1620,
    "height": 2880,
    "orientation": "portrait"
  },
  "generation": {
    "status": "planned",
    "version": 1,
    "model": null,
    "generatedAt": null,
    "seed": null,
    "changeNote": "initial plan"
  },
  "qa": {
    "status": "pending",
    "checks": {
      "sourceAccurate": false,
      "identityConsistent": false,
      "anatomyValid": false,
      "cropSafe": false,
      "noText": false,
      "noFranchiseContamination": false
    },
    "notes": []
  }
}
```

---

# 7. Prompt 编写必须显式包含可裁切要求

所有 48 张竖图的 `prompt.final` 都必须包含等价语义：

```text
vertical 9:16 mobile wallpaper composition;
place the primary subject and all identity-critical features in the upper half of the image;
keep the face, head, hands involved in the key action, signature object, and main story action safely inside the central upper region;
use the outer edges and lower 30% mainly for expendable environment, ground, mist, water, roots, fabric tails or secondary detail;
the image must remain visually complete if part of the outer edges and lower portion are later cropped or covered by a physical card layout;
no typography, no card frame, no logo, no watermark.
```

这不是要求模型生成“卡面”。

它只是要求原始 Artwork 具备 **composition resilience / 构图韧性**。

---

# 8. 不同类型的裁切优先级

| 类型 | 必须保护 | 可牺牲 |
|---|---|---|
| Character | 脸、头发、肩胸、身份象征、关键手势 | 腿脚、衣摆、地面、边缘环境 |
| Scene | Primary Landmark、主要空间关系、核心光源 | 前景石、水、雾、外围景物 |
| Story | 核心动作、核心角色脸、关键道具、动作对象 | 地面、远景群体、烟雾、次要环境 |
| Mythic Object | 物件主体、核心结构、功能性细节 | 尾迹、底座、地面、环境粒子 |
| Ensemble 横版 | 主群像、Yggdrasil / Ymir 等主轴 | 四边延展环境 |

---

# 9. 版本管理

重新出图时，Artwork ID 不变，版本递增：

```text
MC-NOR-M01-001 v1  rejected
MC-NOR-M01-001 v2  rejected
MC-NOR-M01-001 v3  approved
```

正式资产目录只把批准版本作为默认图片，但 JSON 必须记录：

- 当前批准版本；
- 模型；
- Prompt；
- 修改原因；
- Reference；
- QA 结果。

如果需要完整历史，可以扩展：

```text
history/
├── v1.png
├── v1.json
├── v2.png
├── v2.json
├── v3.png
└── v3.json
```

---

# 10. Phase A 最终交付定义

M01 完成不是“生成了 50 张图”。

完成定义：

```text
50 个 Artwork ID
×
(1 张 approved 图片 + 1 个 approved JSON)
=
50 组可追溯、可重放、可继续制卡的视觉资产
```

其中：

```text
48 × portrait ≥ 1620×2880
2  × landscape ≥ 2880×1620
```

并且：

- 所有竖图通过 crop-safe QA；
- 所有 JSON 通过 Schema 校验；
- 所有角色引用稳定 Canon；
- 所有 Story Artwork 能追溯到 Story / Source；
- 所有 `prompt.final` 可以直接用于重新出图；
- 实体卡尺寸与版式仍留到 Phase B 单独设计。
