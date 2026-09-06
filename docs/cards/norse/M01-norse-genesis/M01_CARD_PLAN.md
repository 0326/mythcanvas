# M01《北欧创世：世界树与命运》详细出卡方案

> 系列编号：M01  
> 产品线：MYTHOS / 诸神神话  
> 英文工作名：**Norse Genesis — Yggdrasil & Fate**  
> 状态：Series Planning / Artwork First  
> 版本：V1.1  
> 日期：2026-09-06  
> 规划规模：**50 个收藏卡内容主题 / 50 组核心视觉资产**  
> 上游：`src/content/norse/`、`docs/NORSE_STORY_MAP.md`  
> 总规划：`docs/cards/norse/NORSE_CARD_COLLECTION_PLAN.md`

---

# 0. 核心原则：先卡图，后制卡

M01 分成两个完全独立的阶段。

```text
Phase A：Artwork Production / 卡图视觉资产

Story / Character / Scene / Mythic Object
                ↓
         Visual Thesis
                ↓
      壁纸级纯画面资产
                ↓
 Character / Scene / Story 一致性 QA


Phase B：Card Production / 实体卡设计

已批准的壁纸 / 主视觉资产
                ↓
     确定实际成品卡尺寸
                ↓
   卡框 / 排版 / 裁切 / 出血
                ↓
   材质 / 工艺 / CMYK / 打样
                ↓
             实体卡
```

当前 **只执行 Phase A**。

Phase A 不考虑：

- 实体卡宽高；
- 54 × 85 mm 等任何暂定尺寸；
- 出血线；
- 安全区；
- 卡框；
- 卡名排版；
- 编号排版；
- 烫金 / 压纹 / UV 等工艺；
- 为未来某一种卡面比例强行裁图。

> **卡牌只是未来使用这些视觉资产的一种载体。当前首先把每一个神话主题本身画好。**

后续实卡尺寸、纸张、版式与供应商确定后，再单独建立 `CARD_PRODUCTION_SPEC.md`，根据卡图进行重构；必要时重新构图，不要求把壁纸机械裁成卡面。

---

# 1. M01 系列定位

M01 是整个 MythCanvas Norse Collection 的第一套正式内容系列，承担三项基础任务：

1. 建立北欧宇宙的原初世界观；
2. 建立 M02～M04 共用的角色、世界和视觉 Canon；
3. 验证“50 个内容主题 → 50 组高质量视觉资产”的生产方法。

系列叙事主轴：

```text
无形鸿沟
↓
冰与火相遇
↓
尤弥尔与奥德胡姆拉出现
↓
布里与神族祖先显现
↓
奥丁、威利、维重塑世界
↓
阿斯克与恩布拉获得生命
↓
世界树与诸井构成宇宙秩序
↓
诺恩确立命运
↓
日月开始运行
↓
追逐与啃噬已经埋下终局伏线
```

系列核心主题：

> **秩序从冲突中诞生，但命运与毁灭也在世界诞生之初同时出现。**

---

# 2. 系列范围

## 2.1 Core Story Units

映射当前 `creation` Cycle：

```text
01 尤弥尔与世界的诞生
02 奥德胡姆拉与布里
03 尤弥尔之躯化为世界
04 阿斯克与恩布拉
05 世界树与三口井
06 诺恩与命运之井
07 日月与追逐者
08 尼德霍格与世界树
```

## 2.2 明确不进入 M01

```text
Odin 献眼 / Mímir 求知        → M02
Æsir–Vanir War                → M02
诸神宝物                      → M02
Thor / Giants                 → M03
Fenrir / Ragnarök             → M04
英雄 Saga                     → H01+
```

避免 M01 变成“北欧百科第一册”。

---

# 3. 50 个内容主题结构

```text
Character / 角色主题              16
Scene / 场景主题                  11
Story / Key Moment / 故事主题      19
Mythic Object / 神物主题            2
Hero / Ensemble / 系列主视觉        2
                                  ──
                                  50
```

这里的“卡”在 Phase A 中只表示 **未来卡槽对应的内容主题**，不代表当前就生成卡面。

每个主题首先产出：

> **一张没有文字、卡框和制卡约束的独立高质量神话主视觉。**

---

# 4. Phase A：壁纸级卡图资产规范

## 4.1 输出不是“卡片图片”

Phase A 的输出定义为：

> **MythCanvas Norse Wallpaper Artwork / 神话壁纸母图**

每张图必须脱离卡框依然成立，可以直接用于：

- MythCanvas PC 壁纸；
- MythCanvas 手机壁纸；
- 网站 Hero / Story Illustration；
- 社交传播图；
- 后续实体收藏卡；
- 后续海报、画册或其他衍生物。

## 4.2 壁纸比例

不再使用任何实体卡比例。

默认视觉资产按 MythCanvas 已有壁纸体系生产：

```text
PC / 横版主图：16:9
Mobile / 竖版版本：9:16
```

但不要求所有 50 个主题一开始同时生成两个版本。

推荐流程：

```text
先完成一个方向的 Canonical Artwork
↓
视觉通过
↓
有网站 / 手机需求时，再生成对应横竖版本
```

构图原则：

- 主体不要贴死画面边缘；
- 重要头部、手、神器、世界地标保留完整；
- 背景应有一定可延展空间；
- 不为了未来卡面预留硬编码文字框；
- 后续如果卡面比例不同，优先重新构图，而不是暴力裁切。

## 4.3 纯画面原则

所有 AI 主视觉必须：

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

**图片里不生成任何卡牌元素。**

## 4.4 图片本身优先于“以后怎么印”

视觉 QA 只问：

- 这个角色是否好看、准确、有辨识度；
- 这个场景是否有空间记忆点；
- 这个故事瞬间是否一眼能理解；
- 这个神物是否有独立视觉身份；
- 50 张放在一起是否形成完整的 M01 世界。

当前不问：

- 裁切后会不会压标题；
- 边框宽度多少；
- CMYK 会不会偏色；
- 哪些部位需要烫金；
- 卡背放什么字段。

这些全部属于 Phase B。

---

# 5. 整体视觉风格

## 5.1 首发 Edition

> **原初史诗 / Primordial Saga**

风格定位：

> **北境古典幻想绘画 × 现代高端神话插画 × 克制的北欧物质文化纹理。**

不是：

- 现代游戏 CG；
- Marvel / God of War 式商业角色；
- 纯写实影视剧照；
- 泛二次元立绘；
- 全员厚重维京铠甲；
- 雪山 + 极光万能背景；
- 大量无来源发光符文。

视觉应具有：

```text
手绘质感
宏大尺度
克制细节
自然材料
强光影层次
清晰轮廓
神话感而非游戏 UI 感
```

## 5.2 核心美术关键词

```text
primordial
mythic scale
cold mist
embers
weathered stone
bone / frost / ash
ancient timber
deep ocean slate
muted gold
cosmic tree
fate
Nordic material texture
painterly detail
```

## 5.3 四阶段色彩叙事

### Act I：鸿沟 / 冰火

```text
深黑、冰蓝、灰白
+ 熔火橙、暗红
```

感觉：空无、寒冷、不可测。

### Act II：巨人之躯化世界

```text
岩灰、血铁红、土褐、深海蓝
```

感觉：物质诞生、沉重、巨大。

### Act III：世界树与命运

```text
深林绿、青黑、骨白、旧金
```

感觉：秩序、生命、时间、神秘。

### Act IV：日月与追逐

```text
太阳：旧金、白金、炽橙
月亮：冷银、靛蓝、灰紫
追逐者：黑灰、铁色
```

开始出现 M04 的视觉伏线。

---

# 6. 五类内容主题的卡图设计语言

这里定义的是 **Artwork 语言**，不是卡面版式。

## 6.1 Character / 角色图

目标：

> 不看文字，仅凭 silhouette、脸、服装、象征物和姿态就能识别角色。

画面要求：

- 单主体优先；
- 半身、3/4 身、全身都可，由角色决定；
- 背景来自角色真实故事空间，而非统一摄影棚；
- 姿势体现身份与行为；
- 原初存在不强行人类战士化；
- 同角色跨图保持脸型、体型、发型和核心服装 Canon。

M01 特别规则：

- Ymir：原初世界尺度，不做普通大块头 Boss；
- Búri：从冰 / 盐霜中显现，不做王座神王；
- Odin Creator：是创世时期形态，不抢用后续 M02 的完整王权视觉；
- Norns：三人必须拥有不同 silhouette / prop / posture；
- Sól / Máni：体现天体运行，而不是普通“日神/月神立绘”；
- Sköll / Hati：成对但不能同一狼模型换色；
- Níðhöggr：荒野、树根、啃噬感优先于游戏 Boss 装甲。

## 6.2 Scene / 场景图

目标：

> 建立后续整个 Norse Collection 可复用的空间 Canon。

画面要求：

- 大景别优先；
- 人物若出现只是尺度参照；
- 每个地点必须有唯一地标；
- 强调环境结构而不是“漂亮背景”；
- 世界尺度应超越普通自然风景。

特别注意：

- Yggdrasil 不是森林中的一棵大树；
- Ginnungagap 不是普通峡谷；
- Niflheim 不是简单雪地；
- Muspell 不是普通火山；
- Urðarbrunnr / Mímisbrunnr / Hvergelmir 要有明确区别。

## 6.3 Story / Key Moment / 故事图

目标：

> 一张图只讲一个“看到画面就能复述”的事件瞬间。

要求：

- 一个主要动作；
- 一个主要叙事中心；
- 人物与环境共同服务事件；
- 允许电影式大构图；
- 可以有多人，但必须属于同一时刻和空间。

禁止：

- 多格漫画；
- 时间线拼贴；
- 一张塞完整故事；
- 多张卡面拼成一张图；
- 用普通角色肖像冒充 Story Artwork。

## 6.4 Mythic Object / 神物图

目标：

> 给真正具有独立身份的神话物件做“英雄级静物肖像”。

要求：

- 物件自身必须是主角；
- 强调材质、使用痕迹和神话功能；
- 环境只用于说明来源语境；
- 不做游戏装备栏 UI；
- 不做现代奢侈品产品摄影。

M01 不借用 M02/M03 的 Mjölnir / Gungnir 等神物。

## 6.5 Hero / Ensemble / 系列主视觉

目标：

> 海报级系列记忆点。

要求：

- 多角色可以出现，但必须处于统一空间；
- 不把多个独立人物立绘拼成 collage；
- 必须表达一个明确的世界状态；
- E01 表达“世界尚未形成”；
- E02 表达“世界与命运秩序已经形成”。

---

# 7. M01 精确 50 个视觉主题 Manifest

编号用于内部生产追踪，不要求出现在图片中。

```text
MC-NOR-M01-001 ~ MC-NOR-M01-050
```

## 7.1 Character — 16

| # | ID | 主题 | 核心视觉命题 | 状态 |
|---:|---|---|---|---|
| 001 | C01 | 尤弥尔 Ymir | 冰与火之间诞生的原初巨人，身体像未成形世界 | Ready |
| 002 | C02 | 奥德胡姆拉 Auðumbla | 原初母牛、霜与乳流，不做普通家畜照 | 需补实体 |
| 003 | C03 | 布里 Búri | 从盐霜 / 冰中逐渐显现的神族祖先 | Ready |
| 004 | C04 | 奥丁 Odin · Creator | 创世阶段形态，不用后期王者全套装备 | Ready |
| 005 | C05 | 威利 Vili | 创世行动、意志与力量 | Ready |
| 006 | C06 | 维 Vé | 神圣空间与秩序 | Ready |
| 007 | C07 | 阿斯克 Ask | 海岸木材获得生命后的第一人 | 需补实体 |
| 008 | C08 | 恩布拉 Embla | 与 Ask 同源但构图独立 | 需补实体 |
| 009 | C09 | 乌尔德 Urðr | 已发生之事、刻痕、沉稳 | Ready |
| 010 | C10 | 薇尔丹蒂 Verðandi | 正在生成、线与连续时间 | Ready |
| 011 | C11 | 斯库尔德 Skuld | 将来 / 应然、未完成空间 | Ready |
| 012 | C12 | 索尔 Sól | 太阳人格与天体运行 | Ready |
| 013 | C13 | 马尼 Máni | 月亮人格与周期运行 | Ready |
| 014 | C14 | 斯库尔 Sköll | 追逐太阳、速度、天穹尺度 | Ready |
| 015 | C15 | 哈提 Hati | 追逐月亮，与 Sköll 形成对卡 | Ready |
| 016 | C16 | 尼德霍格 Níðhöggr | 世界树根部啃噬者，终局伏线 | Ready |

## 7.2 Scene — 11

| # | ID | 主题 | 核心视觉命题 | 状态 |
|---:|---|---|---|---|
| 017 | S01 | 金伦加鸿沟 Ginnungagap | 冰火世界之间尚未成形的原初空隙 | Ready |
| 018 | S02 | 尼福尔海姆 Niflheimr | 雾、寒泉、冰流的原初寒冷空间 | World 已有 |
| 019 | S03 | 穆斯贝尔 Múspell | 火焰边界，不提前使用末日战争语言 | World 已有 |
| 020 | S04 | 世界树 Yggdrasil | 全局宇宙轴，不是普通森林巨树 | 需新增 Scene / Concept |
| 021 | S05 | 世界树之根 | 根系、深层空间与井泉交织 | Ready |
| 022 | S06 | 乌尔德之泉 Urðarbrunnr | 诺恩、井水与宇宙秩序 | 需新增 Scene |
| 023 | S07 | 密米尔之井 Mímisbrunnr | 知识之井，不提前表现 Odin 献眼 | 可复用 |
| 024 | S08 | 赫瓦格密尔 Hvergelmir | 原初寒泉与深层水源 | 需新增 Scene |
| 025 | S09 | 初生的米德加尔特 | 海、陆、山仍保留创世尺度 | 需新增 Scene / Variant |
| 026 | S10 | 天穹之路 Celestial Path | 日月开始运行的天空秩序 | 需新增 Scene |
| 027 | S11 | 铁森林 Járnviðr | 追逐者的暗黑空间伏线 | 需新增 Scene / Source Scope |

## 7.3 Story / Key Moment — 19

| # | ID | 主题 | Key Moment |
|---:|---|---|---|
| 028 | T01 | 雾冰流入鸿沟 | Niflheim 的寒流进入 Ginnungagap |
| 029 | T02 | 火星越过边界 | Muspell 的热与火星逼近冰霜 |
| 030 | T03 | 尤弥尔苏醒 | 冰火交汇后原初存在显现 |
| 031 | T04 | 奥德胡姆拉出现 | 原初母牛出现 |
| 032 | T05 | 四道乳流 | Auðumbla 维持 Ymir 的生命 |
| 033 | T06 | 冰中显现的布里 | 舔舐盐霜，Búri 从冰中显现 |
| 034 | T07 | 三兄弟面对尤弥尔 | Odin / Vili / Vé 与原初巨人对峙 |
| 035 | T08 | 尤弥尔倒下 | 世界旧形态终结 |
| 036 | T09 | 大地由血肉形成 | 肉身转化为土地，避免猎奇 |
| 037 | T10 | 海洋由血液形成 | 深海包围新土地 |
| 038 | T11 | 骨化群山 | 骨与牙转化为山脉和岩石 |
| 039 | T12 | 头骨撑起天空 | 三兄弟建立天穹 |
| 040 | T13 | 海岸上的两段木材 | Ask / Embla 获得生命前一刻 |
| 041 | T14 | 第一口生命 | 两者获得生命、感知与人形秩序 |
| 042 | T15 | 世界树贯穿诸界 | Yggdrasil 成为宇宙轴 |
| 043 | T16 | 三根通向三泉 | 根系与井泉构成宇宙结构 |
| 044 | T17 | 诺恩在泉边定命 | 三位 Norn 建立命运秩序 |
| 045 | T18 | 日月开始运行 | Sól / Máni 进入天穹秩序 |
| 046 | T19 | 追逐与啃噬 | 狼群追逐与树根啃噬构成世界初生时的毁灭伏线 |

T19 如果单图叙事过载，优先拆成两个独立画面，同时删除一个弱 Scene Slot，保持 50 个主题总量不变。

## 7.4 Mythic Object — 2

| # | ID | 主题 | 核心视觉命题 | 状态 |
|---:|---|---|---|---|
| 047 | O01 | 太阳之车 Chariot of the Sun | Sól、Árvakr / Alsviðr 与太阳运行系统 | 需新增 MythicObject |
| 048 | O02 | 斯瓦林之盾 Svalinn | 位于太阳之前、隔绝炽热的盾 | 需新增 MythicObject |

如果后续 source / model review 认为太阳之车不适合作为 persistent MythicObject，则第二个槽位改为 Story / Scene，不拿 M02 神物补位。

## 7.5 Hero / Ensemble — 2

| # | ID | 主题 | 核心构图 |
|---:|---|---|---|
| 049 | E01 | 北欧创世 / Norse Genesis | Ginnungagap 中冰火两极汇聚，Ymir 作为原初尺度参照 |
| 050 | E02 | 世界树与命运 / Yggdrasil & Fate | Yggdrasil 纵向主轴，创世神、人类、Norns 与日月处于同一宏大宇宙场景 |

---

# 8. 一致性规则

## 8.1 同角色跨图一致

同一角色在 Character / Story / Ensemble Artwork 中必须保持：

```text
脸型
发色 / 发型
眼部特征
体型
核心服装轮廓
材质语言
身份象征
```

允许变化：

- 动作；
- 镜头；
- 表情；
- 光线；
- 剧情状态。

## 8.2 Norns 三人必须区分

```text
Urðr       刻痕 / 已成之事 / 更静态
Verðandi   线 / 正在形成 / 连续动态
Skuld      未完成空间 / 应然 / 锐利前视
```

不能“三个同脸女神换颜色”。

## 8.3 Sköll / Hati 必须成对但不复制

排在一起能形成太阳 / 月亮镜像；单独看仍必须拥有不同动物姿态、光源和天体关系。

---

# 9. 出图生产规则

## 9.1 一个主题一次只生成一张图

绝对禁止一次 Prompt 让模型生成：

- 多张壁纸；
- 四格 / 九宫格；
- contact sheet；
- 多个 Card ID；
- 拼接多个独立成品画面。

每个视觉主题独立生产。

## 9.2 先 Canon，再扩图

推荐顺序：

```text
Series Style Tests
↓
Character Canonical Artwork
↓
Scene Canonical Artwork
↓
Story Key Moment Artwork
↓
Mythic Object Artwork
↓
Hero / Ensemble Artwork
↓
Wallpaper 横竖版本扩展
```

这样 Story / Ensemble 中的人物不会漂移。

## 9.3 壁纸可以复用，但卡面以后单独设计

未来 Phase B 原则：

```text
Approved Artwork
↓
选择适合实卡的主题
↓
根据最终卡比例重新裁切 / 扩图 / 重构
↓
再加卡框、文字、编号和工艺
```

禁止现在为了未知卡尺寸牺牲壁纸构图。

---

# 10. 出图前必须关闭的内容缺口

## P0：实体

```text
Auðumbla
Ask
Embla
```

## P0：Scene / Concept

```text
Yggdrasil 全局场景
Urðarbrunnr
Hvergelmir
Newborn Midgard variant
Celestial Path
Járnviðr（明确 source scope）
```

## P0：Mythic Object

```text
Sól's Sun Chariot
Svalinn
```

## P0：Key Moment Manifest

每个 Story Artwork 必须记录：

```text
artworkId
storyId
sourceRefs
characterIds
sceneId / worldId
objectIds
visualThesis
avoid
```

不能只凭标题批量出图。

---

# 11. Phase A QA

## 11.1 Content QA

- 50/50 主题有内容依据；
- Character / Scene / Object 不悬空；
- Story Key Moment 与来源范围一致；
- 不画现代固定“九界地图”作为唯一事实；
- 不提前混入 M02～M04 内容。

## 11.2 Visual QA

- Character Identity Consistency = 100%；
- 不出现多指、多肢、结构错误；
- 同一场景地标保持 Canon；
- Niflheim / Muspell / Yggdrasil / Midgard 一眼可区分；
- 不出现现代 franchise-specific 造型；
- 不出现文字、Logo、乱码或卡牌 UI；
- 重复镜头与重复姿势控制在最低。

## 11.3 Series QA

最终可把 50 张 **已完成壁纸缩略图** 做成 contact sheet，仅用于内部 QA：

```text
检查 Act I → IV 色彩变化
检查角色露脸比例
检查大景 / 中景 / 近景节奏
检查是否重复构图
检查是否有低价值凑数主题
检查 50 张能否完整讲完 M01
```

Contact Sheet 不是生成目标，也不作为单张成品。

---

# 12. Phase B：实体制卡暂缓

实体卡阶段暂不定义任何参数。

等以下信息确定后单独建立制卡规范：

```text
供应商
实际成品尺寸
纸张 / PVC / PET 等材质
圆角
印刷方式
色彩空间
出血
安全区
卡正反版式
字体
编号
烫金 / UV / 压纹 / 镭射等工艺
包装方式
```

到时再创建：

```text
docs/cards/norse/M01-norse-genesis/CARD_PRODUCTION_SPEC.md
```

Phase B 可以复用 Phase A 的视觉资产，但允许为卡面重新构图；**壁纸母图永远不因未知的实卡规格被提前限制。**

---

# 13. 当前下一步

```text
1. Content Lock
2. 补齐 M01 P0 依赖
3. 选 6 个视觉主题做 Style Test
4. 锁定 Primordial Saga 视觉风格
5. 先完成核心 Character Canonical Artwork
6. 再批量进入 Scene / Story / Object / Ensemble
7. 50 张壁纸视觉 QA
8. 实体制卡留到独立 Phase B
```

M01 当前阶段的唯一核心目标：

> **先把 50 个北欧创世视觉主题画成一套高质量、可独立作为壁纸使用、同时能够支持未来制卡的 MythCanvas 原始艺术资产。**
