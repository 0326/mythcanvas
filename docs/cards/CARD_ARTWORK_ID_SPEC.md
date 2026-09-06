# MythCanvas Card Artwork 10 位数字卡号规范

> 状态：Normative  
> 版本：V2.1  
> 日期：2026-09-06

---

# 1. 目标

所有 MythCanvas 卡片视觉资产统一使用 **10 位纯数字 Card ID**：

```text
CC MM SS TT NN
```

实际不加空格：

```text
1003010001
```

每段固定 2 位：

- `CC`：Category / 卡牌类别；
- `MM`：Mythology / 神话体系；
- `SS`：Series / 系列、第几弹；
- `TT`：Style / 壁纸风格；
- `NN`：Card No. / 系列内卡牌编号。

这一个 10 位 Card ID 即为最终唯一资产 ID，不再额外维护 Content Key。

---

# 2. 为什么 Category 从 10 开始

Category 正式业务编号从 `10` 起。

```text
00–09  保留给系统 / 实验 / 未来基础命名空间
10     收藏卡 Collectible Card
11+    后续扑克牌 / 塔罗牌 / 其他卡牌品类按 Registry 分配
```

这样正式 Card ID 的首位不会是 `0`，因此：

- 数据库可以直接使用 `BIGINT`；
- JSON 可以直接使用 number / integer；
- 前端 JavaScript `Number` 可安全表示 10 位整数；
- 无需为了保留前导零强制把完整 Card ID 存成字符串。

> 不使用 32 位 `INT`。10 位 Card ID 可能超过 `2,147,483,647`，数据库统一使用 `BIGINT`。

---

# 3. 五段定义

以北欧 M01 默认风格第 1 张为例：

```text
1003010001
│ │ │ │ └─ 01  Card No.
│ │ │ └─── 00  Style
│ │ └───── 01  Series
│ └─────── 03  Mythology
└───────── 10  Category
```

| 段 | 位数 | 当前示例 | 含义 |
|---|---:|---:|---|
| Category | 2 | `10` | 收藏卡 |
| Mythology | 2 | `03` | 北欧神话 |
| Series | 2 | `01` | M01《北欧创世》 |
| Style | 2 | `00` | 当前默认风格 |
| Card No. | 2 | `01` | 第 1 张 |

Card ID 构造规则：

```text
pad2(category)
+ pad2(mythology)
+ pad2(series)
+ pad2(style)
+ pad2(cardNo)
```

示例：

```text
10 + 03 + 01 + 00 + 01 = 1003010001
```

---

# 4. 当前 Registry

## 4.1 Category Registry

| Code | 类别 | English | 状态 |
|---:|---|---|---|
| `10` | 收藏卡 | Collectible Card | 已登记 |

`00–09` 保留，不分配正式商品类别。

## 4.2 Mythology Registry

| Code | 神话体系 | English | 状态 |
|---:|---|---|---|
| `03` | 北欧神话 | Norse Mythology | 已登记 |

其他神话体系必须登记后使用。

## 4.3 Series Registry — 北欧收藏卡

| Code | 逻辑系列 | 名称 | 状态 |
|---:|---|---|---|
| `01` | M01 | 北欧创世：世界树与命运 | 已登记 |

`M01` 继续作为人类可读标签；Card ID 内只使用数字 `01`。

## 4.4 Style Registry

| Code | 风格 | English | 状态 |
|---:|---|---|---|
| `00` | 当前默认风格 | Default / Canonical Style | 已登记 |

M01 当前 `00` 对应 Art Direction：

> **原初史诗 / Primordial Saga**

风格名称保存在 metadata / JSON 中，Card ID 只保存两位数字 Style Code。

---

# 5. M01 Card ID 范围

```text
Category   = 10
Mythology  = 03
Series     = 01
Style      = 00
Card No.   = 01–50
```

因此：

```text
第 01 张  1003010001
第 02 张  1003010002
...
第 50 张  1003010050
```

同一内容卡换 Style `01`：

```text
默认风格 00：1003010001
新风格   01：1003010101
```

两者内容主题相同，只是 Style 不同。

---

# 6. 不再维护 Content Key

不再保存独立 8 位 Content Key。

同一内容卡跨 Style 的稳定身份直接由以下四个字段决定：

```text
Category + Mythology + Series + Card No.
```

例如：

```text
1003010001
1003010101
1003010201
```

解析后均为：

```text
Category   10
Mythology  03
Series     01
Card No.   01
```

所以它们天然属于同一个内容卡位。

数据库需要查询“同一内容的所有 Style”时，直接使用复合条件 / 复合索引：

```text
(category_code, mythology_code, series_code, card_number)
```

不为此复制一份 Content Key 字段。

---

# 7. 数字存储规则

## 7.1 完整 Card ID

数据库：

```text
BIGINT
```

JSON：

```json
"cardId": 1003010001
```

前端 JS/TS：

```text
number
```

10 位数远低于 JavaScript 安全整数上限 `Number.MAX_SAFE_INTEGER`。

## 7.2 分段字段

分段字段也使用数字：

```json
{
  "categoryCode": 10,
  "mythologyCode": 3,
  "seriesCode": 1,
  "styleCode": 0,
  "cardNumber": 1
}
```

显示或拼接 Card ID 时统一执行 `pad2`：

```text
3  → "03"
1  → "01"
0  → "00"
```

因此“用数字存储”与“两位分段编码”不冲突。

---

# 8. 文件命名

图片和 JSON 文件名直接使用 Card ID：

```text
1003010001.png
1003010001.json
```

推荐目录：

```text
artifacts/cards/norse/m01/style-00/
└── 1003010001/
    ├── 1003010001.png
    └── 1003010001.json
```

文件系统中的文件名当然是文本，但其中的唯一业务标识就是数字 Card ID。

---

# 9. JSON 建议字段

```json
{
  "cardId": 1003010001,
  "categoryCode": 10,
  "mythologyCode": 3,
  "seriesCode": 1,
  "seriesLabel": "M01",
  "styleCode": 0,
  "styleName": "Primordial Saga",
  "cardNumber": 1
}
```

不再存在：

```text
contentKey
```

---

# 10. 唯一性与解析 Gate

正式资产必须满足：

```text
cardId 为 10 位十进制正整数
cardId 全局唯一
文件名数字部分 == JSON.cardId
categoryCode == 前 2 位
mythologyCode == 第 3–4 位
seriesCode == 第 5–6 位
styleCode == 第 7–8 位
cardNumber == 第 9–10 位
```

程序解析时先将 `cardId` 转成 10 位十进制文本，再按 2 位切分。

M01 当前合法范围：

```text
1003010001
...
1003010050
```

---

# 11. 版本与重画

生成尝试次数、Prompt Version、模型版本不进入 Card ID。

同一张卡第 4 次重画仍然是：

```text
1003010001
```

JSON 记录：

```json
{
  "generation": {
    "attempt": 4
  }
}
```

只有 Category / Mythology / Series / Style / Card No. 任一业务身份真正变化，才生成新的 10 位 Card ID。
