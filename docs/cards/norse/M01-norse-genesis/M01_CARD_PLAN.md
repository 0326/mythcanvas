# M01《北欧创世：世界树与命运》详细方案

> 系列编号：M01  
> 产品线：MYTHOS / 诸神神话  
> 英文工作名：**Norse Genesis — Yggdrasil & Fate**  
> 状态：Detailed Planning / No Generation Yet  
> 版本：V1.4  
> 日期：2026-09-06  
> 规模：**50 个内容主题 / 每个 Style Edition 50 组 Artwork Artifact**  
> 上游：`src/content/norse/`、`docs/NORSE_STORY_MAP.md`  
> 总规划：`docs/cards/norse/NORSE_CARD_COLLECTION_PLAN.md`  
> 强制产物规范：`M01_ARTIFACT_SPEC.md`  
> JSON Schema：`artwork.schema.json`

---

# 0. 本阶段目标

当前只做 **Artwork 规划与生产准备**，不生成实体卡面。

M01 的每个主题在每一种 Style Edition 下，最终必须交付：

```text
1 张 approved 卡图壁纸
+
1 个同名 JSON 描述文件
```

例如当前首发风格 `PS = Primordial Saga / 原初史诗`：

```text
MC-NOR-M01-PS-001.png
MC-NOR-M01-PS-001.json
```

图片负责视觉结果；JSON 负责内容依据、Canon、构图、完整 Prompt、Reference、Style、版本与 QA，使后续可以稳定重新出图。

> **没有 JSON 的图片不算正式 Artwork；没有 approved 图片的 JSON 也不算完成。**

---

# 1. Artwork 唯一命名规则

统一使用五段式 ID：

```text
MC-NOR-M01-PS-001
│   │   │   │   └─ Card No.：卡牌内容编号
│   │   │   └──── Style：两位大写英文字母风格码
│   │   └──────── Series：系列 / 第几弹
│   └──────────── Mythology：神话体系
└──────────────── Theme Namespace：MythCanvas 卡片主题
```

字段定义：

| 段 | 示例 | 含义 | 规则 |
|---|---|---|---|
| Theme | `MC` | MythCanvas 卡片主题命名空间 | 固定 |
| Mythology | `NOR` | Norse / 北欧神话 | 三位大写英文缩写 |
| Series | `M01` | MYTHOS 第 01 弹 | 产品线字母 + 两位数字 |
| Style | `PS` | Primordial Saga / 原初史诗 | **两位大写英文字母**，全项目 Style Registry 唯一且不可复用 |
| Card No. | `001` | 本系列第 001 个内容卡位 | 三位数字，内容身份稳定 |

## 1.1 内容卡编号与 Artwork ID 分离

`001` 是内容身份，不随画风改变。

例如第 001 张永远是 Ymir：

```text
MC-NOR-M01-PS-001   原初史诗版 Ymir
MC-NOR-M01-XX-001   未来另一 Style Edition 的 Ymir
```

因此：

```text
Content Card Key = MC-NOR-M01-001
Artwork ID       = MC-NOR-M01-{STYLE}-001
```

同一 Content Card 可以有多个 Style Artwork，但不同 Artwork ID 不能指向不同内容主题。

## 1.2 当前 Style Edition

M01 首发 Style：

```text
Style Code：PS
Style Name：Primordial Saga / 原初史诗
```

`PS` 一旦发布即冻结。未来新画风必须先登记新的两字母代码，禁止把 `PS` 改指其他画风。

---

# 2. 两阶段生产模型

## Phase A — Artwork Production / 当前阶段

生产纯画面壁纸母图：

### 48 张普通主题

```text
Character / Scene / Story / Mythic Object
方向：竖版手机壁纸
比例：9:16
最低尺寸：1620 × 2880 px
```

### 2 张系列封面

```text
E01 / E02
方向：横版
比例：16:9
最低尺寸：2880 × 1620 px
```

全部纯画面：

```text
no typography
no title
no logo
no card frame
no card UI
no number
no watermark
no pseudo-runes
```

## Phase B — Physical Card Production / 后续

等实体卡实际规格确定后，再单独设计：

```text
卡面尺寸
卡框
裁切 / 扩图 / 重构
出血 / 安全区
正反面排版
字体 / 编号
CMYK
纸张 / PVC / PET
UV / 烫金 / 压纹 / 镭射
包装
```

Phase B 可以重新构图，不要求机械裁切 Phase A 壁纸。

---

# 3. 核心构图原则：壁纸完整 + 未来可裁卡

虽然现在不按实卡尺寸设计，但所有 48 张竖图必须天然适合后续裁卡。

统一原则：

> **主体上移，身份信息集中在画面上半部；边缘和底部允许未来裁切或被卡面信息区遮挡。**

## 3.1 竖图安全区域

以画布归一化坐标表示：

### Critical Identity Zone

```text
X：20% ～ 80%
Y：12% ～ 52%
```

脸、身份象征、故事关键动作、神物核心结构、场景第一地标必须尽量在此区域。

### Primary Subject Zone

```text
Y：10% ～ 66%
```

主要角色、神物和 Story Action 尽量在这个区域内完成视觉闭环。

### Sacrificial Bottom Zone

```text
Y：70% ～ 100%
```

底部 30% 可用于：

- 地面；
- 水面；
- 根系延伸；
- 衣摆；
- 腿部下段；
- 非关键前景；
- 景深元素。

未来即使底部被卡名 / 描述区遮挡或被裁去，也不得破坏主体身份与故事理解。

### Crop-Tolerant Side Zones

```text
X：0% ～ 14%
X：86% ～ 100%
```

左右边缘只允许放：

- 雾；
- 云；
- 枝叶；
- 地貌延伸；
- 非关键光效；
- 次要背景角色局部。

禁止把脸、手、关键神器、关键动作终点放入边缘区。

## 3.2 各类主题主体位置

### Character

- 脸默认位于 `Y 22%–34%`；
- 胸肩 / 核心 Symbol 位于 `Y 30%–50%`；
- 允许腿部、衣摆进入底部可牺牲区；
- 不能为了全身像把脸压到画布中下部。

### Story

- 主要动作中心位于 `Y 20%–55%`；
- 事件关键双方尽量在中上部建立关系；
- 下方承担地面、海面、碎屑、前景。

### Scene

- 第一地标 / 视觉锚点放在中上区域；
- 底部主要承担“进入场景的前景”；
- 即使裁掉底部，仍能认出这个地方。

### Mythic Object

- 物件核心结构整体位于 `Y 20%–58%`；
- 不允许武器尖端、徽记、关键结构落在未来可能遮挡的底部。

### Ensemble 横版

横版不强制使用竖图坐标，但主要角色群和核心世界地标必须集中在画面中央约 70%，四边保留延展环境，便于网站 Hero 和后续横卡裁切。

---

# 4. 系列定位

M01 完整讲述北欧宇宙第一次成形：

```text
Ginnungagap
↓
冰与火相遇
↓
Ymir / Auðumbla
↓
Búri
↓
Odin / Vili / Vé
↓
Ymir → World
↓
Ask / Embla
↓
Yggdrasil / Wells
↓
Norns
↓
Sól / Máni
↓
Sköll / Hati / Níðhöggr
```

核心主题：

> **秩序从原初冲突中诞生，而命运与毁灭也从世界诞生之初同时存在。**

M01 的视觉重点：

> **宇宙尺度 > 维京文化符号。**

---

# 5. 内容范围

## Core Story Units

1. 尤弥尔与世界的诞生
2. 奥德胡姆拉与布里
3. 尤弥尔之躯化为世界
4. 阿斯克与恩布拉
5. 世界树与三口井
6. 诺恩与命运之井
7. 日月与追逐者
8. 尼德霍格与世界树

## 不进入 M01

```text
Odin 献眼 / Mímir 求知        → M02
Æsir–Vanir War                → M02
诸神宝物                      → M02
Thor / Giants                 → M03
Fenrir / Ragnarök             → M04
英雄 Saga                     → H01+
```

---

# 6. 50 个主题配额

| 类型 | 数量 | 默认方向 | 最低尺寸 |
|---|---:|---|---|
| Character | 16 | 竖版 9:16 | 1620×2880 |
| Scene | 11 | 竖版 9:16 | 1620×2880 |
| Story / Key Moment | 19 | 竖版 9:16 | 1620×2880 |
| Mythic Object | 2 | 竖版 9:16 | 1620×2880 |
| Hero / Ensemble | 2 | 横版 16:9 | 2880×1620 |
| **总计** | **50** | **48 竖 + 2 横** | |

---

# 7. 整体 Art Direction

## 7.1 Edition

> **原初史诗 / Primordial Saga**

Style Code：`PS`

设计语言：

> **北境古典幻想绘画 × 高端神话概念艺术 × 克制的北欧物质文化纹理。**

避免：

- 游戏登录页式过度炫光；
- Marvel / God of War 等已有商业角色语言；
- 写实影视剧照感；
- 泛二次元角色立绘；
- 全员维京盔甲；
- 所有场景都是雪山 + 极光；
- 无来源的发光卢恩；
- 赛博 / 科幻宇宙 UI。

## 7.2 材质语言

```text
霜
冰
水
雾
灰岩
黑石
风化木
骨质感
泥土
深海
灰烬
旧金属
低饱和织物
```

## 7.3 四幕色彩结构

### Act I — Primordial Void

深黑 / 冰蓝 / 灰白 / 熔火橙 / 暗红。

### Act II — World Making

岩灰 / 土褐 / 血铁红 / 深海蓝 / 阴天灰白。

### Act III — Yggdrasil & Fate

深林绿 / 青黑 / 骨白 / 旧金 / 深泉蓝绿。

### Act IV — Celestial Order

Sól：旧金 / 白金 / 炽橙。  
Máni：冷银 / 靛蓝 / 灰紫。  
Predators：黑灰 / 铁色。

---

# 8. 五类 Artwork 设计语言

## Character

- 单角色优先；
- 背景属于真实故事语境；
- Pose 体现身份，不站桩；
- Character Canon 比华丽特效重要；
- 主体身份必须在上半部成立。

## Scene

- 地点本身是主角；
- 人物只做尺度参照；
- 每个 Scene 必须有唯一结构；
- 核心地标必须在裁掉底部后仍清楚。

## Story / Key Moment

- 一张只讲一个主要动作；
- 不做漫画分镜；
- 不拼时间线；
- 动作高潮尽量位于中上部。

## Mythic Object

- 物件是主角；
- 不做游戏装备栏；
- 核心物件完整结构必须位于安全区。

## Hero / Ensemble

- 系列海报级；
- 横版 16:9；
- 多元素处于一个统一世界状态；
- 禁止人物立绘拼贴。

---

# 9. M01 50 张 Content Manifest

本节的 `001–050` 是 **Content Card No.**，不包含 Style。

实际首发 `PS` 文件名统一写为：

```text
001 → MC-NOR-M01-PS-001
002 → MC-NOR-M01-PS-002
...
050 → MC-NOR-M01-PS-050
```

## 9.1 Character — 16

| No. | 主题 | 构图 / 景别 | 主视觉与背景 | Crop Anchor | 避免 |
|---:|---|---|---|---|---|
| 001 | **尤弥尔 Ymir** | 低机位全身 | 冰火交界中的原初巨人，身体像未成形世界 | 脸与上胸 Y 18–45% | 肌肉 Boss、重甲、蓝皮模板 |
| 002 | **奥德胡姆拉 Auðumbla** | 中大全景侧面 | 原初母牛、霜与乳流 | 头与肩背 Y 22–48% | 普通牧场奶牛、卡通神兽 |
| 003 | **布里 Búri** | 中近景 | 从盐霜冰层中逐渐显现 | 脸与上身 Y 20–48% | 王冠王座、完整神王套装 |
| 004 | **奥丁 Odin · Creator** | 3/4 身略低机位 | 创世阶段 Odin，朴素且功能性 | 脸 Y 22–32%；肩胸至 50% | 后期王者套装、Marvel 语言 |
| 005 | **威利 Vili** | 全身动态 | 在未完成世界中参与塑造 | 头胸和手部动作 Y 18–52% | Odin 换脸、同姿势三兄弟 |
| 006 | **维 Vé** | 全身偏静态 | 建立神圣空间与秩序 | 脸和双手 Y 20–52% | 教士袍、现代魔法师 |
| 007 | **阿斯克 Ask** | 3/4 身 | 新生海岸上的第一人 | 脸胸 Y 22–50% | 树人、维京战士 |
| 008 | **恩布拉 Embla** | 3/4 身反向构图 | 第一次感知新世界 | 脸胸 Y 22–50% | Ask 女性换脸、性感化 |
| 009 | **乌尔德 Urðr** | 中景 | 刻痕与“已发生” | 脸、手、刻痕 Y 20–52% | 老巫婆模板 |
| 010 | **薇尔丹蒂 Verðandi** | 中景动态 | 正在延伸的线 / 枝 / 水纹 | 脸手和线核心 Y 20–54% | 抽象魔法光线 |
| 011 | **斯库尔德 Skuld** | 中景偏正面 | 未完成标记与未知空间 | 脸手 Y 20–52% | 水晶球、科幻预言 UI |
| 012 | **索尔 Sól** | 全身 / 大中景 | 人格与太阳运行体系同框 | 脸 + 日轮关系 Y 16–48% | 普通太阳女神模板 |
| 013 | **马尼 Máni** | 全身 | 月光路径与深蓝天穹 | 脸 + 月体关系 Y 18–48% | 魔法师拿月亮 |
| 014 | **斯库尔 Sköll** | 奔跑全身 | 追逐太阳的逆光巨狼 | 头与前躯 Y 24–50% | 普通狼、Fenrir 复制 |
| 015 | **哈提 Hati** | 斜向追逐 | 追逐月亮，与 Sköll 镜像 | 头与前躯 Y 22–50% | Sköll 换色 |
| 016 | **尼德霍格 Níðhöggr** | 纵向近大全景 | 深层根系中的啃噬者 | 头部与根系咬合 Y 24–54% | 喷火龙 Boss |

## 9.2 Scene — 11

| No. | 场景 | 核心设计 | Crop Anchor |
|---:|---|---|---|
| 017 | **金伦加鸿沟 Ginnungagap** | 冰火之间尚未成形的空无 | 冰火交界主结构 Y 15–58% |
| 018 | **尼福尔海姆 Niflheimr** | 雾、寒泉、冰流 | 寒泉 / 冰谷地标 Y 20–56% |
| 019 | **穆斯贝尔 Múspell** | 火焰世界边界 | 火焰裂层主结构 Y 16–58% |
| 020 | **世界树 Yggdrasil** | 宇宙轴，贯穿上下层 | 主干和核心分叉 X 30–70%，Y 8–66% |
| 021 | **世界树之根** | 多层根系、泉域与洞隙 | 关键根结 / 水域 Y 20–58% |
| 022 | **乌尔德之泉 Urðarbrunnr** | 命运井泉与世界树根 | 泉与根交点 Y 28–58% |
| 023 | **密米尔之井 Mímisbrunnr** | 更深、更静、更知识性 | 井泉视觉中心 Y 26–56% |
| 024 | **赫瓦格密尔 Hvergelmir** | 原初寒泉 / 水脉源头 | 水源核心 Y 20–56% |
| 025 | **初生的米德加尔特** | 新形成海陆与山体 | 海陆主轮廓 Y 20–60% |
| 026 | **天穹之路 Celestial Path** | 日月运行的天空秩序 | 光路 / 天体关系 Y 12–58% |
| 027 | **铁森林 Járnviðr** | 暗黑森林与天体追逐伏线 | 特征树冠 / 天光 Y 18–58% |

## 9.3 Story / Key Moment — 19

| No. | Key Moment | 主要动作 | Crop Anchor |
|---:|---|---|---|
| 028 | **雾冰流入鸿沟** | 寒流进入 Ginnungagap | 冰流与空无交界 Y 18–58% |
| 029 | **火星越过边界** | Muspell 火热侵入寒域 | 热 / 冷交锋 Y 20–56% |
| 030 | **尤弥尔苏醒** | 原初生命第一次抬头 | Ymir 脸与上身 Y 20–52% |
| 031 | **奥德胡姆拉出现** | 母牛从霜雾显现 | 头背 Y 24–50% |
| 032 | **四道乳流** | 乳流维持 Ymir | Auðumbla + 乳流起点 Y 22–56% |
| 033 | **冰中显现的布里** | 舔开盐霜，Búri 显现 | Auðumbla 头 + Búri 上身 Y 20–56% |
| 034 | **三兄弟面对尤弥尔** | Odin / Vili / Vé 与 Ymir 对峙 | 三兄弟上身 + Ymir 头肩 Y 18–55% |
| 035 | **尤弥尔倒下** | 世界旧形态终结 | Ymir 头胸 / 三兄弟 Y 18–54% |
| 036 | **大地由血肉形成** | 肉身转化为地貌 | 转化核心 Y 20–58% |
| 037 | **海洋由血液形成** | 深海包围新土地 | 海陆交界 Y 20–58% |
| 038 | **骨化群山** | 骨牙化成山岩 | 转化主结构 Y 20–58% |
| 039 | **头骨撑起天空** | 三兄弟建立天穹 | 三兄弟 + 天穹核心 Y 16–55% |
| 040 | **海岸上的两段木材** | Ask / Embla 获得生命前 | 两段木材 Y 24–55% |
| 041 | **第一口生命** | 两人获得生命与感知 | 两张脸 + 赋予动作 Y 20–52% |
| 042 | **世界树贯穿诸界** | Yggdrasil 成为宇宙轴 | 主干 Y 8–64% |
| 043 | **三根通向三泉** | 根系建立宇宙结构 | 三根分化起点 Y 18–56% |
| 044 | **诺恩在泉边定命** | 三位 Norn 建立命运秩序 | 三人脸手 + 泉 Y 20–55% |
| 045 | **日月开始运行** | Sól / Máni 进入天穹秩序 | 日月 + 人格主体 Y 15–55% |
| 046 | **追逐与啃噬** | 世界初生即出现毁灭伏线 | 主要叙事中心 Y 18–55%；如过载则拆卡 |

## 9.4 Mythic Object — 2

| No. | 神物 | 设计 | Crop Anchor |
|---:|---|---|---|
| 047 | **太阳之车 Chariot of the Sun** | Sól、Árvakr / Alsviðr 与太阳运行系统 | 战车核心 / 日轮 Y 18–56% |
| 048 | **斯瓦林之盾 Svalinn** | 位于太阳之前、隔绝炽热 | 盾完整轮廓 Y 22–56% |

## 9.5 Hero / Ensemble — 2

| No. | 封面 | 构图 |
|---:|---|---|
| 049 | **北欧创世 / Norse Genesis** | 横版；冰火两极形成视觉对角，Ymir 位于中部，四边留环境延展 |
| 050 | **世界树与命运 / Yggdrasil & Fate** | 横版；Yggdrasil 居中，Norns / 创世神 / 日月形成同一世界层级，核心群像集中中央 70% |

---

# 10. 双文件 Artifact Contract

当前 `PS` Style 下，每一张输出：

```text
MC-NOR-M01-PS-001.png
MC-NOR-M01-PS-001.json
```

JSON 至少保存：

```text
artworkId           MC-NOR-M01-PS-001
contentCardId       MC-NOR-M01-001
cardNumber          001
styleCode           PS
styleName           Primordial Saga
seriesId            M01
mythologyCode        NOR
类型 / 标题
Story / Source / Entity IDs
Canon
Visual Thesis
Composition
Crop Safe Zones
Prompt.final
Prompt.negative / avoid
References
Output
Generation Version
QA
```

详细规范见 `M01_ARTIFACT_SPEC.md`，结构校验见 `artwork.schema.json`。

---

# 11. 出图前 Gate

在任何图片生成前必须满足：

### Naming Gate

- 50 个 Content Card No. 固定为 `001–050`；
- 当前 Style Code 固定为 `PS`；
- 50 个 Artwork ID 固定为 `MC-NOR-M01-PS-001` ～ `050`；
- 不允许不同内容共享同一 Artwork ID。

### Content Gate

- 50 个主题锁定；
- P0 Source Scope 锁定；
- 缺失 Character / Scene / Object 补齐或明确替换。

### Composition Gate

- 每张竖图定义 `criticalIdentityZone`；
- 每张定义 `cropSafe`；
- 核心主体上移；
- 底部 30% 被遮挡时仍能看懂；
- 左右边缘裁切时不损失关键身份。

### Artifact Gate

- 每张 planned JSON 先建档；
- JSON 通过 Schema；
- Prompt / Canon / Composition 完整后才允许调用图片模型。

---

# 12. 当前下一步

```text
1. 冻结 Style Code = PS
2. 生成 50 个 planned JSON（只建描述，不出图）
3. 关闭 M01 P0 内容缺口
4. Review 50 个 JSON 的 Canon / Prompt / Crop Safe
5. 选择少量 Style Test
6. 用户批准风格后才正式进入图片生成
```

当前仍是：

> **Detailed Planning / No Generation Yet**
