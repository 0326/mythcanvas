# MythCanvas 角色视觉生成体系

> 目标：让大量神话角色在不同年龄、服装、形态、画风、场景与设备尺寸下持续生成，同时保持角色身份稳定、画风可复用、提示词可追踪、结果可审核。

## 1. 核心原则

MythCanvas 不把角色出图做成“角色名 + 一段 Prompt”。生产模型拆成独立维度：

```text
Character（画谁）
+ CharacterInterpretation（选择哪个有来源的历史、宗教、民间或文学版本）
+ CharacterVariant（该版本下角色处于什么年龄/服装/形态）
+ Mythology Visual DNA（文化身份）
+ Style（怎么画）
+ Scene / Composition（在哪里、怎么构图）
+ OutputSpec（给什么设备和尺寸）
= Generation Recipe
```

### 正交关系

- Character 不包含画风。
- CharacterInterpretation 只承载有来源的身份、称谓、关系与图像学差异；它不是第二个 Character，也不是 Variant。
- Style 不包含角色、年龄、服装、文明、设备尺寸。
- CharacterVariant 只描述持久角色状态，不描述 Cinematic / Anime 等渲染方式。
- Theme 只表示网站 Light / Dark，不进入作品 Style。
- OutputSpec 只负责设备、比例、尺寸、安全区与构图约束。

这使得：

```text
Athena × canonical × Anime × mobile
Athena × mature-ceremonial × Anime × mobile
Athena × mature-ceremonial × Cyber Myth × desktop
Chang'e × canonical × Cyber Myth × desktop
```

都可以用同一套编排器生成。

---

## 2. Character 数据模型

现有 `characters.canonical_design_json` 继续作为 Canonical Design 的主入口。

建议内容包含：

```json
{
  "anchors": [
    "稳定的角色轮廓",
    "核心神话符号",
    "核心道具/武器",
    "角色气质与姿态"
  ],
  "appearance": {
    "face": [],
    "hair": [],
    "body": []
  },
  "costumeLanguage": [],
  "paletteCues": [],
  "temperament": [],
  "avoid": []
}
```

角色身份锚点优先表达**可视觉验证的事实**，避免只写“漂亮、神圣、霸气”等抽象词。

---

## 3. CharacterInterpretation

`character_interpretations` 承载同一 Character 在不同来源层的、不能简单视作换装的身份差异；`character_names` 允许称谓限定在一个 Interpretation 中。

```text
二郎神（一个 Character）
└── 明清文学解释层（一个 CharacterInterpretation）
    └── 杨戬（该解释层的 literary-identity 名称）
```

因此，`杨戬`不会作为第二个角色或全局别名污染其他二郎神传统。解释层的 `source_refs_json`、置信度和可视身份锚点必须一起保存。

## 4. CharacterVariant

新增 `character_variants`。

### variant_type

```text
age
costume
form
composite
```

示例：

```text
Athena（Character）
├── canonical（characters 主记录，不需要 variant 行）
├── young-adult            [age]
├── mature-adult           [age]
├── ceremonial-armor       [costume]
├── battle-armor           [costume]
├── awakened-divine        [form]
└── mature-ceremonial      [composite]
```

`identity_overrides_json` 只能描述允许发生的身份层变化；没有声明变化的 Canonical Anchors 默认继续保留。

不要为了不同 Style 创建 CharacterVariant。

---

## 5. Style 数据模型

`styles` 从简单的 `prompt_hint` 升级成独立生产配置：

```text
category
prompt_template
render_rules_json
avoid_json
status
```

### Style 负责

- 线条/笔触
- 材质表达
- 光影方式
- 镜头语言
- 空间/景深
- 色彩处理方式
- 画面完成度

### Style 不负责

- 角色是谁
- 年龄
- 服装形态
- 神话文明
- 场景
- 设备尺寸

判断一个 Style 是否正交的简单方法：把它同时应用到 Athena、嫦娥、Olympus，如果定义仍然成立，则大概率是正确的 Style。

---

## 6. Reference Pack

大量持续生成时，仅依赖文本 Canonical Anchors 会逐渐产生角色漂移。

重要角色需要 Canonical Reference Pack：

```text
portrait-front
portrait-three-quarter
fullbody-front
fullbody-three-quarter
turnaround
expression-sheet
signature-props
```

角色 Interpretation 与 Variant 可以有自己的补充 Reference Assets，例如文学版本的专属图像锚点、新的礼服或觉醒形态。

### 存储

```text
D1 reference_assets
        ↓ asset_key
R2 characters/<character>/<variant>/<asset>
```

D1 保存所有权、类型、尺寸、来源、License 和生成元信息；R2 保存图片字节。

### GPT Image 2 reference workflow

GPT Image 2 支持高保真图像输入。后续角色一致性生产应优先：

```text
Canonical Reference 1–2 张
+ Interpretation Reference 0–1 张
+ Variant Reference 0–1 张
+ Style Reference 0–1 张（可选）
```

而不是一次塞大量互相冲突的参考图。

角色参考图和 Style 参考图必须标明不同职责。

---

## 7. OutputSpec

首发只定义两套主规格，避免无限尺寸组合。

### PC 壁纸

```text
id: desktop-wallpaper
ratio: 16:9
final: 2560 × 1440
draft: 1280 × 720
```

### 手机壁纸

```text
id: mobile-wallpaper
ratio: 9:16
final: 1440 × 2560
draft: 720 × 1280
```

这两套最终尺寸同时满足 GPT Image 2 的尺寸约束：边长不超过 3840、两边均为 16 的倍数、长短边不超过 3:1、总像素处于允许区间。

### 为什么不是 PC 图直接裁成手机图

两种壁纸的构图目标不同：

- PC 强调横向环境叙事和左右负空间。
- Mobile 强调纵向人物轮廓、顶部锁屏安全区、底部手势安全区。

因此同一 Recipe 应分别生成两个 OutputSpec，而不是后处理硬裁切。

---

## 8. GPT Image 2 Prompt Composer

Production 模型目标为 `gpt-image-2`。

提示词不使用旧扩散模型式的关键词堆叠、权重语法和所谓 negative prompt tag。

使用清晰自然语言，并按固定优先级组合：

```text
1. MythCanvas / 作品用途
2. Character Canonical Identity
3. CharacterVariant delta
4. Civilization Visual DNA
5. Style
6. Scene / Camera / Composition
7. OutputSpec
8. 用户补充描述
9. Guardrails
```

### 示例结构

```text
Create one original premium MythCanvas mobile wallpaper featuring Athena...

Preserve her established identity: ...
Use the mature ceremonial variant: ... Preserve all other canonical anchors.

Ground the image in Greek Visual DNA: ...
Render using the Cyber Myth style: ...

Place her ... Camera ... Lighting ...
Compose for a 9:16 mobile wallpaper at 1440×2560. ...

Additional direction: ...
No text, watermark, signature, UI, logo, or imitation of a specific modern commercial Athena design.
```

用户自由输入永远放在系统拥有的 Character / Variant / Style 定义之后，避免自由文本静默覆盖 Canonical Design。

---

## 8. GPT Image 2 API 约束

当前接入建议：

```text
endpoint: POST /v1/images/generations
model: gpt-image-2
size: <OutputSpec width>x<height>
quality: high（正式作品）
```

模型接受满足约束的灵活分辨率，因此 MythCanvas 可以直接请求 2560×1440 与 1440×2560。

正式 Provider 通过环境变量配置：

```text
AI_GENERATION_MODE=openai
OPENAI_API_KEY=<secret>
OPENAI_IMAGE_MODEL=gpt-image-2        # 可选；默认 gpt-image-2
OPENAI_IMAGE_QUALITY=high             # 可选
```

如果后续评测证明某个 snapshot 更稳定，可将 `OPENAI_IMAGE_MODEL` 固定为对应 snapshot，而不修改业务代码。

---

## 9. Generation Recipe / Provenance

每次生成要记录最终“配方”，而不只是保存最终 Prompt：

```text
character_id
character_variant_id
mythology_id
style_id
scene
composition
output_spec_id
prompt
prompt_layers_json
provider
generation_model
generation_quality
reference_asset_ids_json
source_generation_id
created_at
```

这样可以回答：

- 这张图用了谁的 Canonical Design？
- 哪个年龄/服装 Variant？
- 哪个 Style？
- 哪个模型/版本？
- 哪些参考图？
- 哪套设备构图？
- 哪个生成结果是它的父版本？

---

## 10. QA

三个维度独立验收。

### Character QA

- Identity Anchors 是否保留
- 年龄/服装/形态是否正确
- 面部、轮廓、体态是否漂移
- 神话符号是否稳定
- 是否混入现代商业改编设计

### Style QA

- 是否符合 Style visual grammar
- Style 是否覆盖/污染 Civilization Visual DNA
- 光影、材质、线条、镜头是否统一
- 是否有明显“通用 AI 图”质感

### Wallpaper QA

- 比例/尺寸正确
- 手机锁屏安全区合理
- PC 负空间与横向叙事合理
- 主体没有危险裁切
- 无多余文本、水印、UI
- 人体、手、武器、服装结构可接受

任何一个 QA 失败，都应做针对性 revision，不要把所有 Prompt 层重新随机化。

---

## 11. Skill 分工

```text
mythcanvas-character-design
  └─ Character / Variant / Reference Pack / Identity QA

mythcanvas-style-system
  └─ Style grammar / Prompt fragment / Style QA

mythcanvas-character-generation
  └─ Recipe resolve / Prompt compose / GPT Image 2 / OutputSpec / generation QA
```

同时：

- `mythcanvas-content-model` 负责 Mythology / Visual DNA / IP 数据边界。
- `mythcanvas-product-ux` 负责生成资产进入网站后的 UI/视觉呈现。

---

## 12. 实施阶段

### P0 — 本 PR

- Character / Style / Generation 三个 Skill
- CharacterVariant / OutputSpec / ReferenceAsset D1 Schema
- Style production profile Schema
- Generation provenance 字段
- GPT Image 2 Prompt Composer 规范
- 两套壁纸输出规格

### P1

- `/create` 支持 CharacterVariant 和 OutputSpec ID
- 后台角色管理：Canonical Design / Variant / Reference Pack
- Style 管理页
- GPT Image 2 直接 Provider
- Reference-image edit workflow

### P2

- Character identity 自动 QA
- Style QA / similarity eval
- 批量 Recipe 生产队列
- desktop/mobile 成对资产生成
- approved Canonical Reference Pack 自动选择
