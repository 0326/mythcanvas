# MythCanvas Card Artwork 10 位数字卡号规范

> 状态：Normative  
> 版本：V3.0  
> 日期：2026-09-07

---

# 1. 唯一卡号

所有卡片视觉资产统一使用 **10 位纯数字 Card ID**：

```text
CC MM SS TT NN
```

每段固定 2 位数字：

| 段 | 含义 | 当前示例 |
|---|---|---:|
| CC | Category / 类别 | `10` 收藏卡 |
| MM | Mythology / 神话体系 | `03` 北欧 |
| SS | Series / 系列 | `01` M01 |
| TT | Style / 风格 | `00` 默认风格 |
| NN | Card No. / 卡号 | `01` 第 1 张 |

因此 M01 第 1 张为：

```text
1003010001
```

M01 当前范围：

```text
1003010001
...
1003010050
```

---

# 2. 只保留一个 ID

系统只维护：

```text
cardId = 1003010001
```

**不再维护 Content Key、Artwork ID、字符串版业务 ID 等第二套身份。**

判断“不同 Style 是否属于同一内容卡”时，直接比较：

```text
Category + Mythology + Series + Card No.
```

即忽略 Style 两位即可。

例如：

```text
1003010001  # M01 / 01 / Style 00
1003010101  # M01 / 01 / Style 01
```

两者都是 M01 第 01 张，只是 Style 不同。

---

# 3. 当前 Registry

## Category

| Code | 类别 |
|---:|---|
| `10` | 收藏卡 Collectible Card |

后续类别从 `11` 起登记，例如扑克牌、塔罗牌等。Code 一旦用于正式资产不得改义。

## Mythology

| Code | 神话体系 |
|---:|---|
| `03` | 北欧神话 Norse Mythology |

## Series — 北欧收藏卡

| Code | 标签 | 名称 |
|---:|---|---|
| `01` | M01 | 北欧创世：世界树与命运 |

## Style

| Code | 名称 |
|---:|---|
| `00` | Default / Canonical Style；M01 当前 Art Direction 名称为 Primordial Saga / 原初史诗 |

---

# 4. 数字存储

10 位 Card ID 第一段从 `10` 开始，因此不存在前导零丢失问题。

推荐：

```text
Database: BIGINT
JSON: number
TypeScript / JavaScript: number
```

10 位 Card ID 远低于 JavaScript `Number.MAX_SAFE_INTEGER`。

禁止使用 32 位 `INT`，因为 10 位卡号可能超过其上限。

分段字段也使用数字：

```json
{
  "cardId": 1003010001,
  "categoryCode": 10,
  "mythologyCode": 3,
  "seriesCode": 1,
  "styleCode": 0,
  "cardNumber": 1
}
```

显示 / 拼接时统一 zero-pad 到两位：

```text
10 + 03 + 01 + 00 + 01 = 1003010001
```

---

# 5. 文件名

文件名直接使用 Card ID：

```text
1003010001.png
1003010001.json
```

目录可使用人类可读路径，但目录不参与唯一性判断：

```text
artifacts/cards/norse/m01/style-00/1003010001/
├── 1003010001.png
└── 1003010001.json
```

---

# 6. 编码规则

- Category / Mythology / Series / Style：`00–99`，实际值由 Registry 管理；
- Card No.：`01–99`；`00` 保留；
- 同一系列换 Style，不改变 Card No.；
- 重画、Prompt 修改、模型升级不改变 Card ID；
- 正式使用后的 Code / Card No. 不静默重分配；
- 生成 attempt / promptVersion / modelVersion 全部写入 JSON metadata，不进入 Card ID。

---

# 7. 解析与组合

数学解析：

```text
category   = floor(cardId / 100000000)
mythology  = floor(cardId / 1000000) % 100
series     = floor(cardId / 10000) % 100
style      = floor(cardId / 100) % 100
cardNo     = cardId % 100
```

组合：

```text
cardId = category * 100000000
       + mythology * 1000000
       + series * 10000
       + style * 100
       + cardNo
```

M01：

```text
10 * 100000000
+ 3 * 1000000
+ 1 * 10000
+ 0 * 100
+ 1
= 1003010001
```
