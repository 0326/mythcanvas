# MythCanvas Card Artwork 唯一命名规范

> 状态：Normative  
> 版本：V1.0  
> 日期：2026-09-06

---

# 1. 目标

每一张 MythCanvas 卡片视觉资产必须拥有一个可从文件名直接识别以下信息的唯一 ID：

```text
主题命名空间
神话体系
系列 / 第几弹
壁纸风格
卡牌内容编号
```

统一格式：

```text
MC-{MYTHOLOGY}-{SERIES}-{STYLE}-{CARD_NO}
```

示例：

```text
MC-NOR-M01-PS-001
```

---

# 2. 五段定义

```text
MC-NOR-M01-PS-001
│   │   │   │   └─ CARD_NO
│   │   │   └──── STYLE
│   │   └──────── SERIES
│   └──────────── MYTHOLOGY
└──────────────── THEME NAMESPACE
```

| 字段 | 示例 | 定义 | 格式 |
|---|---|---|---|
| Theme Namespace | `MC` | MythCanvas 卡片主题命名空间 | 固定 `MC` |
| Mythology | `NOR` | 神话体系 | 3 位大写英文字母 |
| Series | `M01` | 产品系列 / 第几弹 | 1 位产品线字母 + 2 位数字 |
| Style | `PS` | Artwork / 壁纸风格 | **2 位大写英文字母** |
| Card No. | `001` | 系列内内容卡编号 | 3 位数字 |

完整正则建议：

```regex
^MC-[A-Z]{3}-[A-Z][0-9]{2}-[A-Z]{2}-[0-9]{3}$
```

---

# 3. 内容卡身份与 Artwork 身份分离

同一个内容卡在不同 Style Edition 下仍然是同一张“内容卡”。

因此定义两个 ID：

## Content Card ID

不带 Style：

```text
MC-NOR-M01-001
```

表示：

> 北欧神话 / M01 / 第 001 个固定内容主题。

## Artwork ID

带 Style：

```text
MC-NOR-M01-PS-001
```

表示：

> 第 001 个内容主题，在 PS 风格下的具体视觉资产。

未来换画风：

```text
MC-NOR-M01-PS-001
MC-NOR-M01-XX-001
```

二者内容身份必须相同，只允许 Art Direction / Style Edition 不同。

---

# 4. Style Code 规则

Style 使用两个英文字母组成的稳定缩写：

```text
[A-Z]{2}
```

规则：

1. 必须是两位大写 ASCII 英文字母；
2. Style Code 描述的是**跨系列可复用的视觉风格**，不是角色、故事或卡型；
3. 同一个 Style Code 在 MythCanvas 全项目必须始终代表同一种 Art Direction；
4. Code 一旦进入正式资产，不允许改义或复用；
5. 新 Style 必须先登记，再批量生成；
6. 不允许同一画风因为神话体系不同而分配不同 Code；
7. 不允许用随机两字母临时占位后直接发布。

当前已登记：

| Code | Style | 中文 | 状态 |
|---|---|---|---|
| `PS` | Primordial Saga | 原初史诗 | M01 首发 Style |

其他两字母代码在正式登记前均视为未分配。

---

# 5. Series Code 规则

Series 保留产品线语义：

```text
M01
M02
M03
M04
H01
H02
...
```

当前北欧：

```text
M = MYTHOS / 诸神神话
H = HEROIC SAGAS / 英雄传奇
```

Series Code 只表示商品 / 内容系列，不表示 Style。

因此：

```text
M01 + PS
```

和：

```text
M01 + Future Style
```

仍属于同一个 M01 内容系列。

---

# 6. Mythology Code

统一采用三位大写英文代码。

已使用 / 推荐：

```text
NOR = Norse
```

其他神话体系应在真正开始卡片规划时登记，避免不同团队自行产生重复代码。

---

# 7. Card No. 规则

Card No. 是一个 Series 内稳定的内容身份：

```text
001–999
```

要求：

- 固定三位，不足补 0；
- 不因 Style 改变；
- 不因重新出图改变；
- 不因 Prompt Version 改变；
- approved 后原则上不重排；
- 被淘汰的正式编号需要保留迁移记录，不静默换成另一个内容。

生成尝试次数和图像版本放在 JSON metadata 中，不进入 Artwork ID。

例如同一张卡第 4 次重画仍然是：

```text
MC-NOR-M01-PS-001
```

JSON：

```json
{
  "generation": {
    "attempt": 4
  }
}
```

---

# 8. 文件命名

图片与描述 JSON 必须同名：

```text
MC-NOR-M01-PS-001.png
MC-NOR-M01-PS-001.json
```

推荐目录：

```text
artifacts/cards/{mythology}/{series}/{style}/
```

例：

```text
artifacts/cards/norse/m01/ps/
└── MC-NOR-M01-PS-001/
    ├── MC-NOR-M01-PS-001.png
    └── MC-NOR-M01-PS-001.json
```

---

# 9. 唯一性 Gate

正式资产库必须满足：

```text
Artwork ID 全局唯一
Content Card ID + Style Code 唯一
文件名 == JSON.artworkId
JSON.contentCardId 与 Artwork ID 去除 Style 后一致
JSON.cardNumber 与最后三位一致
JSON.styleCode 与 STYLE 段一致
JSON.seriesId 与 SERIES 段一致
JSON.mythologyCode 与 MYTHOLOGY 段一致
```

任何不符合命名协议的图片 / JSON 不进入 approved 资产库。

---

# 10. M01 示例

当前 M01：

```text
Theme       MC
Mythology   NOR
Series      M01
Style       PS
Card No.    001–050
```

所以完整范围：

```text
MC-NOR-M01-PS-001
...
MC-NOR-M01-PS-050
```

其中 `001–050` 是内容卡位；未来出现其他 Style Edition 时，只替换 `PS` 段。
