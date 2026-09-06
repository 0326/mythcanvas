# MythCanvas 北欧收藏卡总规划

> 状态：Master Planning  
> 版本：V1.0  
> 日期：2026-09-06  
> 适用范围：北欧神话收藏卡系列拆分、逐期 50 张套卡规划、后续 Series Bible / Card Manifest / 视觉 Edition 设计。  
> 上游内容：`src/content/norse/`、`docs/NORSE_STORY_MAP.md`、`docs/NORSE_MYTHOLOGY_COMPLETION_PLAN.md`  
> 相关产品方案：`docs/STORY_SERIES_COLLECTION_PRODUCT_PLAN.md`

---

# 0. 结论

北欧收藏卡不按现有 Story Cycle 一一出套，也不按“一个热门神 = 一套卡”拆分。

最终采用：

```text
完整北欧内容体系
      ↓
Story Cycle / Saga
      ↓
判断独立叙事内核与自然卡牌容量
      ↓
Collection Series
      ↓
每系列约 50 张固定精品套卡
```

每套固定包含五类：

```text
角色卡 Character
场景卡 Scene
故事卡 Story / Key Moment
神物卡 Mythic Object
系列封面 / 群像卡 Hero / Ensemble
```

五类数量不做统一配额，按各系列叙事结构灵活分配；唯一硬要求是：

> **50 张都必须有独立叙事或视觉价值，禁止靠同角色换姿势、换背景、换色凑数。**

基于当前仓库内容与外部北欧神话资料复核，建议第一阶段形成 **6 套 × 50 张 = 300 张**，并预留第二阶段扩展。

---

# 1. 当前内容基线

以当前 `main` 的 North Story Map 为基线：

```text
Source Registry              45
Unique Story Units           74
Static Characters            90
Worlds                        8
Scenes                       15
Mythic Objects               16
Static Stories               73
Story Cycles                  9
Manifest Dependency Gaps      0
```

当前 9 个 Story Cycle：

```text
creation
gods-and-treasures
odin-cycle
thor-cycle
loki-cycle
baldr-ragnarok
volsung-cycle
helgi-cycle
independent-eddic
```

这些 Cycle 是知识 / 内容组织层，不直接等于商品系列。

---

# 2. 产品分层

北欧收藏宇宙建议分成三条产品线。

## 2.1 MYTHOS / 诸神神话

围绕神祇、世界秩序和 Ragnarök 的主神话体系。

```text
M01 世界之初
M02 诸神时代
M03 雷神远征
M04 世界终局
```

四套共同构成一条大的神话历史：

```text
创世
 ↓
诸神秩序建立
 ↓
诸神时代的冒险与冲突
 ↓
Baldr 之死
 ↓
Ragnarök
 ↓
世界再生
```

## 2.2 HEROIC SAGAS / 英雄传奇

围绕人类英雄、家族、诅咒、战争和传奇 Saga。

```text
H01 沃尔松格
H02 提尔锋：赫尔沃尔与诅咒之剑
```

其中 H01 已进入当前内容体系；H02 是外部资料 review 后新增的高价值候选，尚需先完成网站内容补全。

## 2.3 LEGENDS / 北境传奇（后续）

不纳入首期 300 张核心产品。

候选：

```text
H03 Hrólfr Kraki / 赫罗尔夫·克拉基
L01 Ragnar Loðbrók / 拉格纳·洛德布罗克
其他高价值 fornaldarsögur
```

Helgi、Völundr、Svipdagr、Rígr、Grottasöngr 等继续保留在网站完整北欧内容体系中，但暂不为了凑 50 张强行拼成一套实体 Collection。

---

# 3. 第一阶段六套总规划

| 编号 | 系列 | 核心内容 | 角色卡 | 场景卡 | 故事卡 | 神物卡 | 封面/群像 | 总计 |
|---|---|---|---:|---:|---:|---:|---:|---:|
| M01 | 世界之初：尤弥尔、世界树与命运 | Creation | 16 | 12 | 18 | 2 | 2 | 50 |
| M02 | 诸神时代：阿萨、华纳与奥丁 | Gods & Treasures + Odin + Early Loki | 15 | 8 | 16 | 9 | 2 | 50 |
| M03 | 雷神远征：索尔与巨人 | Thor Cycle | 15 | 8 | 20 | 5 | 2 | 50 |
| M04 | 世界终局：巴德尔之死与诸神黄昏 | Baldr + Ragnarök + Late Loki | 17 | 9 | 15 | 7 | 2 | 50 |
| H01 | 沃尔松格：黄金诅咒与屠龙者 | Völsung / Sigurd / Gudrun / Atli | 18 | 8 | 17 | 5 | 2 | 50 |
| H02 | 提尔锋：赫尔沃尔与诅咒之剑 | Hervarar saga / Tyrfing | 16 | 8 | 20 | 4 | 2 | 50 |

> 上表是系列级卡槽预算，不是最终逐卡 Manifest。逐期详细设计允许在五类之间重新调整，但总数固定 50。

---

# 4. M01《世界之初：尤弥尔、世界树与命运》

## 4.1 系列定位

北欧世界观 Genesis Set。

核心主题：

> **世界不是被一次创造完成，而是在冰、火、巨人、神、命运与宇宙树之间逐渐成形。**

## 4.2 内容来源

主要映射当前 `creation` Cycle：

```text
尤弥尔与世界的诞生
奥德胡姆拉与布里
尤弥尔之躯化为世界
阿斯克与恩布拉
世界树与三口井
诺恩与命运之井
日月与追逐者
尼德霍格与世界树
```

## 4.3 卡牌结构建议

```text
角色卡       16
场景卡       12
故事卡       18
神物卡        2
封面群像卡    2
              ──
              50
```

这套刻意提高 Scene / Story 占比，不强行制造大量“神祇肖像”。

重点角色候选：

```text
Ymir
Búri
Odin
Vili
Vé
Mímir
Urðr
Verðandi
Skuld
Sól
Máni
Sköll
Hati
Níðhöggr
Ask
Embla
```

重点视觉空间：

```text
Ginnungagap
Niflheim
Muspell
Yggdrasil
Urðarbrunnr
Mímisbrunnr
Midgard 初成
Asgard 初成
日月天穹
世界树根系
```

## 4.4 产品特点

视觉重点：

> 原初、巨大尺度、冰火、宇宙树、命运、日月。

与后续“维京铠甲 + 神战”视觉彻底拉开差异。

---

# 5. M02《诸神时代：阿萨、华纳与奥丁》

## 5.1 系列定位

讲清楚北欧“诸神文明”如何建立，而不是做 Odin Portrait Set。

核心主题：

> **战争、和解、知识、宝物、契约与牺牲共同构成诸神时代的秩序。**

## 5.2 内容合并规则

合并：

```text
gods-and-treasures
+
odin-cycle
+
early loki stories
```

不单独做 Odin Collection，也不单独做 Loki Collection。

Early Loki 主要归本套：

```text
Iðunn / Þjazi
Asgard Wall / Sleipnir
Sif's Hair / Treasures
```

## 5.3 核心故事

```text
Gullveig 与阿萨—华纳战争
阿萨与华纳和约
Kvasir 与诗歌蜜酒
Odin 夺取诗歌蜜酒
Iðunn 与 Þjazi
Skaði 的赔偿
Njörðr 与 Skaði
阿斯加德城墙与 Sleipnir
Sif 的金发与诸神宝物
Freyr 与 Gerðr
Odin 献眼
Odin 世界树九夜
Odin 与 Vafþrúðnir
Grímnir 的启示
Huginn / Muninn
Valhöll 与 Valkyries
Odin 与 Seiðr
```

## 5.4 卡牌结构建议

```text
角色卡       15
场景卡        8
故事卡       16
神物卡        9
封面群像卡    2
              ──
              50
```

这是六套中 Mythic Object 占比最高的一套。

重点神物：

```text
Gungnir
Draupnir
Skíðblaðnir
Mead of Poetry
Iðunn's Apples
Freyr's Sword
Mjölnir
Brísingamen
其他来源充分的宝物
```

## 5.5 建议补强内容

后续逐期设计时重点检查：

### Heimdall vs Loki / Brísingamen

来自 `Húsdrápa` 的重要视觉神话，可以作为两人在 Ragnarök 最终冲突之前的前置关系。

### Ægir Feast

把：

```text
寻找 Hymir 大锅
→ Ægir Feast
→ Lokasenna
```

串成跨 M02 / M03 的诸神社会场景。

---

# 6. M03《雷神远征：索尔与巨人》

## 6.1 系列定位

Adventure Collection，而不是纯战斗合集。

核心主题：

> **索尔不断跨越边界进入巨人世界，在力量、幻术、海洋、宴席和知识挑战中反复证明守护者身份。**

## 6.2 当前 Story Cycle

映射 `thor-cycle`：

```text
Thor 与 Hrungnir
Thor 与 Hymir 的大锅
Thor 垂钓 Jörmungandr
Mjölnir 被盗
Thor / Þjálfi / Röskva
Thor 与 Skrymir
Thor 在 Útgarðr
Thor 与 Geirröðr
Thor 与 Alvíss
Thor 与 Hárbarðr
```

## 6.3 卡牌结构建议

```text
角色卡       15
场景卡        8
故事卡       20
神物卡        5
封面群像卡    2
              ──
              50
```

故事卡占比最高，因为每篇冒险都有多个真正独立的视觉 Key Moment。

例如《雷神之锤被盗》可自然拆：

```text
Thor 发现 Mjölnir 消失
Loki 借 Freyja 羽衣
Þrymr 提出婚约条件
Thor 被装扮成新娘
巨人婚宴
Mjölnir 被送上婚礼
Thor 夺回 Mjölnir
```

原则：

> `MythStory ≠ 一张 Story Card`，一篇 Story 应由多个 source-backed Key Moments 产生多张故事卡。

---

# 7. M04《世界终局：巴德尔之死与诸神黄昏》

## 7.1 系列定位

北欧 Mythos 第一优先级实体打样系列。

核心主题：

> **末日不是突然发生的一场大战，而是誓约、亲缘、背叛、预言与旧秩序长期积累后的必然崩塌。**

## 7.2 内容合并规则

```text
baldr-ragnarok
+
late loki stories
```

Late Loki 主要归本套：

```text
Fenrir / Gleipnir
Loki 与 Baldr
Loki Bound
Loki at Ragnarök
```

## 7.3 主要故事弧

```text
Fenrir 被束缚
↓
Baldr 的梦
↓
万物誓约与槲寄生
↓
Baldr 之死
↓
Hringhorni 葬礼
↓
Hermóðr 前往 Hel
↓
Loki 被束缚
↓
Fimbulwinter
↓
世界秩序崩溃
↓
Gjallarhorn
↓
Odin vs Fenrir
↓
Víðarr 复仇
↓
Thor vs Jörmungandr
↓
Týr vs Garmr
↓
Freyr vs Surtr
↓
Heimdall vs Loki
↓
世界焚毁
↓
世界再生
```

## 7.4 卡牌结构建议

```text
角色卡       17
场景卡        9
故事卡       15
神物卡        7
封面群像卡    2
              ──
              50
```

核心神物：

```text
Gleipnir
Hringhorni
Naglfar
Gjallarhorn
Gungnir
Mjölnir
Freyr's Sword
```

## 7.5 建议补强内容

Baldr 葬礼不要只做 1 张卡。

可继续细分：

```text
Baldr 遗体
Hringhorni
Hyrrokkin 推船
诸神 procession
Nanna
Odin 放置 Draupnir
火焰葬船
```

目标是把“Ragnarök 战斗海报”升级成完整的悲剧—末日—新生叙事。

---

# 8. H01《沃尔松格：黄金诅咒与屠龙者》

## 8.1 系列定位

北欧 Heroic Sagas 第一套。

核心主题：

> **一份黄金诅咒如何跨越家族、英雄、爱情与王权，最终摧毁拥有它的人。**

## 8.2 当前内容主干

映射 `volsung-cycle`：

```text
Völsung 与树中神剑
Signý / Siggeir
Sigmund / Sinfjötli
Sigmund 之死 / Hjördis
Andvari 黄金
Sigurd / Regin
Sigurd 杀 Fafnir
Sigurd / Sigrdrífa
Sigurd / Brynhildr
Sigurd 之死
Gudrun / Atli
Svanhildr / Hamðir / Sörli
```

## 8.3 卡牌结构建议

```text
角色卡       18
场景卡        8
故事卡       17
神物卡        5
封面群像卡    2
              ──
              50
```

核心神物：

```text
Gram
Andvaranaut
Andvari Gold / Treasure
相关英雄遗物
其他来源充分的家族 / 战争物件
```

## 8.4 产品特点

与 Mythos 四套明确区分：

```text
神祇 → 人类英雄
宇宙秩序 → 家族命运
神战 → 屠龙 / 婚姻 / 背叛 / 复仇
神器 → 诅咒遗物
```

视觉关键词：

> 长屋、黄金、龙、铁匠、火焰、誓言、婚姻、家族战争、悲剧。

---

# 9. H02《提尔锋：赫尔沃尔与诅咒之剑》

## 9.1 状态

**Collection Candidate / Content Not Yet Complete**

该系列来自对北欧传奇传统的外部 review，目前不属于现有 9 个主要 Story Cycle 的完整实现范围。

在启动卡牌详细设计前，必须先将对应内容补入网站 Story / Character / Scene / MythicObject 体系。

## 9.2 为什么替代原“埃达英雄诗篇合集”

原候选：

```text
Helgi
Völundr
Svipdagr
Rígr
Grottasöngr
```

虽然都属于 Eddic / Eddic-like corpus，但并不形成统一 Story World。

原则：

> **同属一本诗歌集，不等于适合成为同一实体收藏系列。**

因此它们继续作为网站内容存在，但不强行拼成 50 张商品。

## 9.3 H02 核心内核

以 `Hervarar saga ok Heiðreks` / Tyrfing tradition 为主：

```text
诅咒之剑 Tyrfingr
↓
Angantýr
↓
死亡与墓丘
↓
Hervör 唤醒亡父
↓
取得 Tyrfingr
↓
诅咒继续传承
↓
Heiðrekr
↓
王权、谜语与谋杀
↓
后代继承
↓
Goths vs Huns
↓
诅咒完成
```

## 9.4 卡牌结构建议

```text
角色卡       16
场景卡        8
故事卡       20
神物卡        4
封面群像卡    2
              ──
              50
```

最大的视觉中心：

> **Tyrfingr 本身必须像一个“贯穿几代人的角色”一样存在。**

视觉关键词：

> 墓丘、亡灵、女战士、诅咒剑、王权、继承、谜语、北境大战。

---

# 10. 第二阶段候选

## H03《赫罗尔夫·克拉基：最后的王与狂战士》

候选原因：

- 独立 Saga 内核强；
- Hrólfr、Bǫðvarr Bjarki 等角色辨识度高；
- 熊之诅咒、英雄入廷、怪物、战士群体、最终覆灭等足够支撑 50 张；
- 与 Völsung / Tyrfing 的故事气质不同。

## L01《拉格纳·洛德布罗克》

有极强市场认知度和丰富传奇事件，但历史 / 传奇边界复杂。

建议未来单开：

```text
LEGENDS / 北境传奇
```

而不是直接归入 MYTHOS。

---

# 11. 暂不商品化为 50 张大套卡的内容

当前仍应保留在 MythCanvas 北欧完整内容体系，但暂不强行形成 Collection：

```text
Helgi Cycle
Völundr
Svipdagr / Menglöð
Rígr
Grottasöngr
```

未来处理方式：

1. 继续作为 Story / Character / Artwork 内容；
2. 可做小型数字专题；
3. 可在找到更完整的相邻 Saga 后重新组合；
4. 不为了“商品套数”破坏真实叙事边界。

---

# 12. 卡牌五类定义

## 12.1 角色卡 Character Card

目标：展示一个具有稳定 Canonical Design 的独立人物 / 神祇 / 英雄 / 重要神话存在。

要求：

- 不同角色才算不同卡；
- 同角色普通 Pose A / Pose B 不算新增内容价值；
- 同角色只有在不同神话阶段确实有叙事身份变化时，才能考虑多张角色卡。

例如：

```text
Loki · Companion
Loki · Bound
```

必须证明它们代表不同叙事阶段，而不是换衣服。

## 12.2 场景卡 Scene Card

表现有独立空间意义的：

```text
World
Realm
Hall
Coast
Battlefield
Bridge
Well
Burial Mound
Underworld Road
```

场景必须能脱离具体角色依然成立。

## 12.3 故事卡 Story Card

实际应理解为：

> **Key Moment Card**

数据逻辑：

```text
MythStory
    ↓
Source-backed Key Moments
    ↓
Story Cards
```

一篇 Story 可以拆 1～7 张，取决于真实叙事密度。

## 12.4 神物卡 Mythic Object Card

产品展示可以使用中文“神器 / 神物卡”，底层统一使用 `MythicObject`。

覆盖：

```text
Weapon
Artifact
Jewel
Vehicle
Vessel
Food
Substance
Symbolic Object
```

避免“创世篇没有神器所以硬塞武器”的问题。

## 12.5 系列封面 / 群像卡 Hero / Ensemble

每套建议固定 2 张：

```text
01 Series Hero / 封面主视觉
02 Ensemble / 核心群像
```

可以承担实体包装和数字典藏封面的视觉锚点。

---

# 13. 逐期详细设计的标准模板

后续每进入一期，不直接出图，先创建：

```text
docs/cards/norse/<series-id>/
├── SERIES_BIBLE.md
├── CARD_MANIFEST.md
├── ART_BIBLE.md
└── QA_CHECKLIST.md
```

建议系列 ID：

```text
M01-creation
M02-age-of-gods
M03-thor
M04-ragnarok
H01-volsung
H02-tyrfing
```

## 13.1 SERIES_BIBLE.md

至少定义：

```text
系列主题
叙事起点 / 终点
核心 Story
角色依赖
空间地图
神物依赖
版本差异
不纳入范围
视觉母题
```

## 13.2 CARD_MANIFEST.md

逐张定义 50 张：

```text
cardId
type
nameZh
nameEn
sourceStory / sourceEntity
narrativePurpose
visualSubject
mustHave
avoid
duplicateRisk
```

要求：

> 每张卡都必须回答“为什么它值得占用 50 个槽位中的一个”。

## 13.3 ART_BIBLE.md

Series Core 与 Style Edition 分离。

```text
Series Core
    ↓
Edition A · Sacred / Cinematic / Anime / ...
Edition B · ...
```

不同 Edition 可以重新生成全套 50 张，但不能修改人物关系、故事事实和叙事顺序。

## 13.4 QA_CHECKLIST.md

检查：

```text
神话事实准确
来源范围正确
角色 Canonical Design 一致
场景连续性
神器正确
无商业 IP 视觉污染
无同质化 Pose
无 AI 手指 / 文字 / 解剖错误
整套色彩与构图有统一语言
50 张放在 Contact Sheet 上仍像同一个 Series
```

---

# 14. Series Ready Gate

一个系列只有同时满足以下条件，才能进入真正的 50 张详细设计。

```text
1. Narrative Closure
   有明确故事内核、起点、发展和终点。

2. Content Closure
   主要 Story / Character / Scene / MythicObject 已进入内容体系。

3. Source Closure
   核心 Story 均有明确来源范围；重大版本差异已标记。

4. Natural Card Capacity
   不重复立绘、不换色凑数时，自然容量 >= 50。

5. Visual Diversity
   至少有角色、空间、事件、物件四种视觉层次。

6. Series Identity
   与其他北欧系列有明显不同的叙事主题和视觉母题。
```

任何一项不满足：

> **继续补内容，不进入出图。**

---

# 15. 推荐开发 / 产品顺序

系列编号代表世界观阅读顺序，不代表实际生产顺序。

建议实际打样顺序：

```text
M04 世界终局
↓
M03 雷神远征
↓
H01 沃尔松格
↓
M02 诸神时代
↓
M01 世界之初
↓
H02 提尔锋
```

理由：

- M04：人物、故事、神器、场景最齐，商业视觉最强；
- M03：最容易验证“多 Key Moment 的冒险型卡组”；
- H01：验证神祇之外的 Heroic Saga 产品线；
- M02：验证高 Mythic Object 占比套卡；
- M01：验证低人物、高世界观套卡；
- H02：先完成网站上游内容后再商品化。

如果前三套都能稳定做到 50 张“不水”，基本可以证明整个 North Collection 模型成立。

---

# 16. 总体产品结构

```text
MYTHCANVAS · NORSE COLLECTION

MYTHOS / 诸神神话
├── M01 世界之初
├── M02 诸神时代
├── M03 雷神远征
└── M04 世界终局

HEROIC SAGAS / 英雄传奇
├── H01 沃尔松格
└── H02 提尔锋

SECOND WAVE
├── H03 赫罗尔夫·克拉基
└── L01 拉格纳·洛德布罗克
```

第一阶段：

```text
6 Series × 50 Cards = 300 Cards
```

这 300 张不是 300 幅独立 AI 插图合集，而应共同构成：

> **一套可以从世界诞生一直收藏到诸神覆灭，再进入北境英雄传奇的完整北欧视觉叙事宇宙。**

---

# 17. 最终原则

北欧卡牌长期遵循：

```text
Source drives Story
Story drives Entity
Story Cycle / Saga drives Collection
Series Bible drives Card Manifest
Card Manifest drives Art
Style creates Edition, not Canon
```

产品上永远避免：

```text
先定 50 张
→ 不够
→ 重复角色
→ 换姿势
→ 换颜色
→ 制造假稀有度
```

正确流程是：

```text
完整内容体系
→ 找到自然容量 >= 50 的独立故事世界
→ 冻结 Series Bible
→ 逐张证明 Card Slot 的价值
→ 才进入视觉生产
```
