# MythCanvas Card Artwork 10 位数字卡号规范

> 状态：Normative  
> 版本：V2.0  
> 日期：2026-09-06

---

# 1. 目标

所有 MythCanvas 卡片视觉资产统一使用 **10 位纯数字卡号**，便于：

- 文件查找；
- 排序；
- 数据库索引；
- 批量生成；
- 跨神话 / 系列 / 风格去重；
- 后续实体卡、扑克牌、塔罗牌等不同产品统一管理。

统一结构：

```text
CC MM SS TT NN
```

实际存储时不加空格：

```text
0003010001
```

其中每一段固定 **2 位数字**。

> 卡号必须作为 **10 位字符串** 存储，不能作为整数存储，否则前导 `00` 会丢失。

推荐数据类型：`CHAR(10)` / `VARCHAR(10)` / JSON string。

---

# 2. 五段定义

以 M01 第 1 张、当前默认风格为例：

```text
0003010001
│ │ │ │ └─ 01  Card No. / 卡牌编号
│ │ │ └─── 00  Style / 壁纸风格
│ │ └───── 01  Series / 系列、第几弹
│ └─────── 03  Mythology / 神话体系
└───────── 00  Category / 卡牌类别
```

| 段 | 位数 | 示例 | 含义 |
|---|---:|---:|---|
| Category | 2 | `00` | 卡牌类别：收藏卡 / 扑克牌 / 塔罗牌等 |
| Mythology | 2 | `03` | 神话体系 |
| Series | 2 | `01` | 同一类别 + 神话体系下的系列 / 第几弹 |
| Style | 2 | `00` | 该内容卡的视觉风格 Edition |
| Card No. | 2 | `01` | 系列内卡牌内容编号 |

完整正则：

```regex
^[0-9]{10}$
```

解析正则：

```regex
^([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})$
```

---

# 3. 当前已登记代码

## 3.1 Category Registry

| Code | 类别 | English | 状态 |
|---|---|---|---|
| `00` | 收藏卡 | Collectible Card | 已登记 |

后续扑克牌、塔罗牌等从 `01` 起按 Registry 分配，不允许临时复用。

## 3.2 Mythology Registry

| Code | 神话体系 | English | 状态 |
|---|---|---|---|
| `03` | 北欧神话 | Norse Mythology | 已登记 |

其他神话体系必须登记后使用。

## 3.3 Series Registry — 北欧收藏卡

| Code | 逻辑系列 | 名称 | 状态 |
|---|---|---|---|
| `01` | M01 | 北欧创世：世界树与命运 | 已登记 |

`M01` 继续作为人类可读的产品系列标签；卡号内部只使用数字 `01`。

后续 M02 / M03 / M04 / H01 / H02 等必须在 Registry 中分配稳定的两位数字 Series Code。Series Code 一旦有正式资产不得改义。

## 3.4 Style Registry

| Code | 风格 | English | 状态 |
|---|---|---|---|
| `00` | 当前默认风格 | Default / Canonical Style | 已登记 |

M01 当前默认风格的 Art Direction 名称仍可使用：

> **原初史诗 / Primordial Saga**

但 ID 中只记录风格代码 `00`。

后续其他 Style 使用 `01–99`，必须先登记后使用。

---

# 4. M01 示例

当前定义：

```text
Category   = 00  收藏卡
Mythology  = 03  北欧
Series     = 01  M01
Style      = 00  默认风格 / Primordial Saga
Card No.   = 01  第 1 张
```

最终卡号：

```text
0003010001
```

第 2 张：

```text
0003010002
```

第 50 张：

```text
0003010050
```

同一内容卡未来换 Style `01`：

```text
0003010101
```

这仍然是 M01 的第 01 张内容卡，只是视觉风格不同。

---

# 5. 内容身份与具体 Artwork 身份

最终 **10 位 Card ID** 是具体风格 Artwork 的全局唯一卡号：

```text
0003010001
```

为了识别“不同 Style 下其实是同一个内容卡”，内部额外定义 **8 位 Content Key**：

```text
CC MM SS NN
```

即跳过 Style：

```text
00030101
```

对于第 01 张 Ymir：

```text
Content Key     00030101
Style 00 Card   0003010001
Style 01 Card   0003010101
```

因此：

- `contentKey` 跨 Style 稳定；
- `cardId` / `artworkId` 包含 Style，全球唯一；
- 换 Style 不改变 Card No.；
- 重画 / Prompt Version 不改变 10 位卡号。

---

# 6. 各段分配规则

## Category

```text
00–99
```

由全局 Category Registry 管理。

## Mythology

```text
00–99
```

由全局 Mythology Registry 管理；同一个数字不得对应两个神话体系。

## Series

```text
00–99
```

Series Code 在 `Category + Mythology` 范围内唯一。人类可读标签（如 `M01`、`H01`）保留在 metadata，不进入 10 位数字卡号。

## Style

```text
00–99
```

`00` 保留给当前默认 / Canonical Style。其他 Style 必须登记。

## Card No.

```text
01–99
```

原则上每套控制在 50 张以内，因此两位足够。

规则：

- `01` 起编号；
- 不因 Style 改变；
- 不因重新出图改变；
- 不因 Prompt Version 改变；
- approved 后原则上不重排；
- 被废弃的正式编号保留迁移记录，不静默换给其他内容。

`00` 不分配给实际卡牌内容，保留作为系统 / 系列级特殊槽位的未来扩展空间。

---

# 7. 文件命名

图片和 JSON 直接使用 10 位卡号：

```text
0003010001.png
0003010001.json
```

推荐目录仍使用可读名称，文件名使用数字 ID：

```text
artifacts/cards/norse/m01/style-00/
└── 0003010001/
    ├── 0003010001.png
    └── 0003010001.json
```

目录名不参与唯一性判断，**唯一身份只认 10 位卡号**。

---

# 8. JSON 建议字段

```json
{
  "cardId": "0003010001",
  "contentKey": "00030101",
  "categoryCode": "00",
  "mythologyCode": "03",
  "seriesCode": "01",
  "seriesLabel": "M01",
  "styleCode": "00",
  "styleName": "Primordial Saga",
  "cardNumber": "01"
}
```

所有 code 字段必须是字符串，不得写成数字：

```json
"categoryCode": "00"
```

而不是：

```json
"categoryCode": 0
```

---

# 9. 唯一性 Gate

正式资产必须满足：

```text
cardId 长度 == 10
cardId 仅包含 0–9
cardId 全局唯一
文件名 == JSON.cardId
JSON.contentKey == category + mythology + series + cardNumber
JSON.cardId == category + mythology + series + style + cardNumber
JSON.categoryCode == cardId[0:2]
JSON.mythologyCode == cardId[2:4]
JSON.seriesCode == cardId[4:6]
JSON.styleCode == cardId[6:8]
JSON.cardNumber == cardId[8:10]
```

M01 当前合法范围：

```text
0003010001
...
0003010050
```

---

# 10. 版本与重画

生成尝试次数、Prompt Version、模型版本不进入卡号。

同一张卡第 4 次重画仍然是：

```text
0003010001
```

JSON 记录：

```json
{
  "generation": {
    "attempt": 4
  }
}
```

只有 Category / Mythology / Series / Style / Card No. 任一业务身份真正发生变化，才产生新的 10 位卡号。
