# M01《北欧创世：世界树与命运》详细方案

> 系列编号：M01  
> 产品线：MYTHOS / 诸神神话  
> 英文工作名：**Norse Genesis — Yggdrasil & Fate**  
> 状态：Detailed Planning / No Generation Yet  
> 版本：V1.3  
> 日期：2026-09-06  
> 规模：**50 个内容主题 / 50 组 Artwork Artifact**  
> 上游：`src/content/norse/`、`docs/NORSE_STORY_MAP.md`  
> 总规划：`docs/cards/norse/NORSE_CARD_COLLECTION_PLAN.md`  
> 强制产物规范：`M01_ARTIFACT_SPEC.md`  
> JSON Schema：`artwork.schema.json`

---

# 0. 本阶段目标

当前只做 **Artwork 规划与生产准备**，不生成实体卡面。

M01 的每个主题最终必须交付：

```text
1 张 approved 卡图壁纸
+
1 个同名 JSON 描述文件
```

即：

```text
MC-NOR-M01-001.png
MC-NOR-M01-001.json
```

图片负责视觉结果；JSON 负责内容依据、Canon、构图、完整 Prompt、Reference、版本与 QA，使后续可以稳定重新出图。

> **没有 JSON 的图片不算正式 Artwork；没有 approved 图片的 JSON 也不算完成。**

---

# 1. 两阶段生产模型

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

# 2. 核心构图原则：壁纸完整 + 未来可裁卡

虽然现在不按实卡尺寸设计，但所有 48 张竖图必须天然适合后续裁卡。

统一原则：

> **主体上移，身份信息集中在画面上半部；边缘和底部允许未来裁切或被卡面信息区遮挡。**

## 2.1 竖图安全区域

以画布归一化坐标表示：

### Critical Identity Zone

```text
X：20% ～ 80%
Y：12% ～ 52%
```

脸、身份象征、故事关键动作、神物核心结构、场景第一地标必须尽量在此区域。

### Preferred Subject Zone

```text
X：14% ～ 86%
Y：10% ～ 66%
```

主体主要体量集中在此。

### Bottom Flex Zone

```text
Y：70% ～ 100%
```

未来允许被遮挡或裁切，只放：

- 腿脚；
- 衣摆；
- 地面；
- 水面；
- 根系延展；
- 烟尘；
- 雾；
- 可损失的前景。

禁止让底部 30% 承担：

- 脸；
- 唯一关键道具；
- Story 的主要事件；
- Scene 的唯一识别地标。

### Edge Flex Zone

```text
左右各约 14%
```

只放可损失环境，不放关键手势、脸、神器本体和故事唯一动作对象。

### Top Breathing Zone

```text
Y：0% ～ 8%
```

不让头顶、角、树冠唯一尖端等关键结构贴边。

## 2.2 角色默认锚点

```text
脸中心：Y 约 22% ～ 34%
胸 / 身份象征：Y 约 32% ～ 50%
动作中心：Y 约 28% ～ 55%
```

优先 3/4 身、膝上、动态中景；必须全身时，裁掉膝盖以下仍应成立。

## 2.3 Story 默认锚点

关键事件中心：

```text
Y：20% ～ 55%
```

“发生了什么”不能依赖画面最底部。

## 2.4 Scene 默认锚点

Primary Landmark 尽量位于：

```text
X：18% ～ 82%
Y：12% ～ 60%
```

## 2.5 Mythic Object 默认锚点

物件本体尽量位于：

```text
X：22% ～ 78%
Y：18% ～ 58%
```

---

# 3. 系列定位与故事范围

M01 讲述北欧宇宙第一次成形：

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

视觉重点：

> **宇宙尺度 > 维京文化符号。**

Core Story Units：

1. 尤弥尔与世界的诞生
2. 奥德胡姆拉与布里
3. 尤弥尔之躯化为世界
4. 阿斯克与恩布拉
5. 世界树与三口井
6. 诺恩与命运之井
7. 日月与追逐者
8. 尼德霍格与世界树

不进入 M01：

```text
Odin 献眼 / Mímir 求知        → M02
Æsir–Vanir War                → M02
诸神宝物                      → M02
Thor / Giants                 → M03
Fenrir / Ragnarök             → M04
英雄 Saga                     → H01+
```

---

# 4. 50 个主题配额

| 类型 | 数量 | 输出 |
|---|---:|---|
| Character | 16 | 竖版 1620×2880+ |
| Scene | 11 | 竖版 1620×2880+ |
| Story / Key Moment | 19 | 竖版 1620×2880+ |
| Mythic Object | 2 | 竖版 1620×2880+ |
| Hero / Ensemble | 2 | 横版 2880×1620+ |
| **合计** | **50** | **48 竖 + 2 横** |

---

# 5. Art Direction

## 5.1 Edition

> **原初史诗 / Primordial Saga**

设计语言：

> **北境古典幻想绘画 × 高端神话概念艺术 × 克制的北欧物质文化纹理。**

避免：

- Marvel / God of War 等现代商业角色语言；
- 游戏登录页式炫光；
- 影视剧照；
- 泛二次元立绘；
- 全员维京盔甲；
- 所有场景都是雪山 + 极光；
- 无来源发光卢恩；
- 赛博 / 科幻宇宙 UI。

## 5.2 材质语言

```text
霜 / 冰 / 水 / 雾
灰岩 / 黑石 / 风化木
骨质感 / 泥土 / 深海
灰烬 / 旧金属 / 低饱和织物
```

## 5.3 四幕色彩

### Act I — Primordial Void

深黑、冰蓝、灰白、熔火橙、暗红。

### Act II — World Making

岩灰、土褐、血铁红、深海蓝、阴天灰白。

### Act III — Yggdrasil & Fate

深林绿、青黑、骨白、旧金、深泉蓝绿。

### Act IV — Celestial Order

Sól：旧金 / 白金 / 炽橙；Máni：冷银 / 靛蓝 / 灰紫；Predators：黑灰 / 铁色。

---

# 6. 五类 Artwork 设计语言

## Character

- 单角色优先；
- 主体在上半部建立第一视觉；
- 背景属于真实故事语境；
- Pose 体现身份，不站桩；
- Character Canon 优先于特效；
- 腿脚可进入 Bottom Flex Zone。

## Scene

- 地点本身是主角；
- Primary Landmark 位于中上安全区；
- 人物只是尺度参照；
- 下方前景允许未来裁切。

## Story / Key Moment

- 一张只讲一个动作；
- 核心事件位于中上；
- 不做漫画分镜或时间线拼贴；
- 关键人物脸、手势、道具不能落底部。

## Mythic Object

- 物件本体居中偏上；
- 不做游戏装备栏；
- 环境向四边与下方延伸；
- M01 不借用后续系列神器。

## Hero / Ensemble

- 2 张横版系列海报；
- 使用横版中央安全区；
- 多元素属于一个世界状态；
- 禁止人物立绘拼贴。

---

# 7. M01 50 张详细 Artwork Manifest

下面“主体位置”描述的是关键视觉中心，不限制环境延伸。

## 7.1 Character — 16

| # | ID | 主题 | 构图 / 主体位置 | 主视觉 | 避免 |
|---:|---|---|---|---|---|
| 001 | C01 | **尤弥尔 Ymir** | 低机位 3/4～全身；脸 Y≈28%，胸肩 Y≈40% | 冰火交界中的原初巨人，身体像尚未形成的世界 | 肌肉 Boss、重甲、蓝皮冰巨人模板 |
| 002 | C02 | **奥德胡姆拉 Auðumbla** | 中大全景；头部 Y≈30%，身体主体上移 | 霜盐、乳流、原初生命；下方乳流可延展 | 普通牧场奶牛、卡通神兽 |
| 003 | C03 | **布里 Búri** | 中近景；脸 Y≈28%，破冰中心 Y≈45% | 从盐霜冰层中逐渐显露 | 神王王冠、王座 |
| 004 | C04 | **奥丁 Odin · Creator** | 3/4 身；脸 Y≈27%，核心手势 Y≈44% | 创世阶段 Odin，朴素、功能性强、独眼 | 后期完整王权套装、Marvel 式造型 |
| 005 | C05 | **威利 Vili** | 动态 3/4 身；脸 Y≈27%，动作 Y≈45% | 参与塑造新世界，以“行动 / 意志”区分 Odin | Odin 换脸、三兄弟同姿势 |
| 006 | C06 | **维 Vé** | 膝上 / 3/4 身；脸 Y≈28% | 强调神圣空间、边界和秩序 | 教士模板、现代魔法师 |
| 007 | C07 | **阿斯克 Ask** | 膝上；脸 Y≈27%，胸部 Y≈42% | 海岸第一人，带细微木材起源暗示 | 树人、木偶、成熟维京战士 |
| 008 | C08 | **恩布拉 Embla** | 膝上；脸 Y≈27%，镜头方向与 Ask 相反 | 初次感知世界，海风与新生环境 | Ask 女性换脸、性感化 |
| 009 | C09 | **乌尔德 Urðr** | 中景；脸 Y≈28%，手与刻痕 Y≈47% | 已成之事、沉稳、井边刻痕 | 老巫婆模板、三姐妹同脸 |
| 010 | C10 | **薇尔丹蒂 Verðandi** | 中景动态；脸 Y≈27%，动作 Y≈45% | 正在形成的线 / 枝 / 水纹 | 抽象魔法光线、与 Urðr 同姿势 |
| 011 | C11 | **斯库尔德 Skuld** | 中景正面；脸 Y≈26%，未完成标记 Y≈46% | 将来 / 应然、锐利前视、未知空间 | 水晶球、科幻预言 UI |
| 012 | C12 | **索尔 Sól** | 大中景；脸 Y≈28%，太阳体系 Y≈35% | 天体人格与太阳运行体系同框 | 普通日神光环、战车英雄模板 |
| 013 | C13 | **马尼 Máni** | 大中景；脸 Y≈28%，月体 Y≈24% | 冷银月光路径和周期运行 | 拿月亮的法师、性别误识模板 |
| 014 | C14 | **斯库尔 Sköll** | 奔跑大中景；头部 Y≈32%，太阳 Y≈20% | 巨狼追逐太阳，强逆光轮廓 | 普通森林狼、Fenrir 复制 |
| 015 | C15 | **哈提 Hati** | 斜向追逐；头部 Y≈33%，月亮 Y≈20% | 冷色月域，与 Sköll 冷暖镜像 | Sköll 换颜色、复制 Pose |
| 016 | C16 | **尼德霍格 Níðhöggr** | 纵向大中景；头部 Y≈36%，啃噬点 Y≈48% | 深层根系中的蛇形啃噬者 | 西方喷火龙、金属装甲龙 |

## 7.2 Scene — 11

| # | ID | 场景 | Primary Landmark 位置 | 空间设计 | 避免 |
|---:|---|---|---|---|---|
| 017 | S01 | **金伦加鸿沟 Ginnungagap** | 冰火交汇中心 Y≈40% | 雾寒与火热之间真正“未成形”的空无 | 现实峡谷、虫洞 |
| 018 | S02 | **尼福尔海姆 Niflheimr** | 寒泉 / 冰流结构 Y≈38% | 冰河、雾、低能见度、无建筑 | 北极旅游照、极光万能背景 |
| 019 | S03 | **穆斯贝尔 Múspell** | 火焰边界裂层 Y≈38% | 世界边界般的热、火、黑色裂层 | 普通火山、提前出现末日军队 |
| 020 | S04 | **世界树 Yggdrasil** | 主干中心 Y≈35%，树冠核心 Y≈18% | 宇宙轴贯穿上下层，根部可延伸入底部 | 普通森林巨树、固定九界标签图 |
| 021 | S05 | **世界树之根** | 主根交汇 Y≈42% | 根系像巨大地貌，底部枝根可裁 | 普通树根特写 |
| 022 | S06 | **乌尔德之泉 Urðarbrunnr** | 泉 + 根交界 Y≈48% | 清冷泉水、根系、仪式性自然空间 | 村井、魔法喷泉 |
| 023 | S07 | **密米尔之井 Mímisbrunnr** | 深井水面 Y≈46% | 更深、更静、更知识性 | Odin 献眼提前出现 |
| 024 | S08 | **赫瓦格密尔 Hvergelmir** | 原初水源 Y≈42% | 多水脉向下和四周发散 | 普通瀑布景区 |
| 025 | S09 | **初生的米德加尔特** | 海陆边界 / 山体 Y≈40% | 新形成海陆，底部前景可裁 | 成熟村庄、城堡 |
| 026 | S10 | **天穹之路 Celestial Path** | 日月路径转折 Y≈35% | 用光、云与空间节奏表现运行 | 星轨摄影、行星轨道 UI |
| 027 | S11 | **铁森林 Járnviðr** | 黑色林冠 / 路径 Y≈38% | 黑铁色树干、湿雾、追逐伏线 | 普通恐怖森林、金属尖刺树 |

## 7.3 Story / Key Moment — 19

| # | ID | Key Moment | 事件中心 | 主要动作 | 避免 |
|---:|---|---|---|---|---|
| 028 | T01 | **雾冰流入鸿沟** | Y≈38% | Niflheim 寒流进入 Ginnungagap | 冰瀑旅游照 |
| 029 | T02 | **火星越过边界** | Y≈38% | Muspell 热流侵入原初寒域 | 普通火山喷发 |
| 030 | T03 | **尤弥尔苏醒** | 脸 Y≈29%，起身动作 Y≈44% | 蒸汽中第一次睁眼 / 抬头 | 完全站立英雄 Pose |
| 031 | T04 | **奥德胡姆拉出现** | 牛头 Y≈31%，Ymir 远景 Y≈42% | 两种原初生命第一次同处一景 | 牧场场景 |
| 032 | T05 | **四道乳流** | Auðumbla 上半身 Y≈32%，乳流起点 Y≈47% | 原初供养关系 | 过度生理特写、猎奇 |
| 033 | T06 | **冰中显现的布里** | Búri 脸 Y≈29%，破冰点 Y≈45% | 舔霜后身体从冰中出现 | 三时刻拼贴 |
| 034 | T07 | **三兄弟面对尤弥尔** | 三兄弟头部 Y≈30%，对峙中心 Y≈44% | 世界更替前的对峙 | 四人排队合照 |
| 035 | T08 | **尤弥尔倒下** | 上身 / 倾倒动作 Y≈40% | 决定性倒下，尺度压迫 | 血腥斩首特写 |
| 036 | T09 | **大地由血肉形成** | 转化中心 Y≈42% | 身体材质转成大地纹理 | Gore、人体解剖图 |
| 037 | T10 | **海洋由血液形成** | 水陆变化 Y≈40% | 深海围绕新土地 | 红色血海猎奇 |
| 038 | T11 | **骨化群山** | 山体形成 Y≈40% | 骨 / 牙转化为山与岩 | 骨头堆特写 |
| 039 | T12 | **头骨撑起天空** | 三兄弟 + 头骨动作 Y≈38% | 共同抬升天空结构 | 底部才看得到人物 |
| 040 | T13 | **海岸上的两段木材** | 木材 Y≈42% | 新生海岸的静止前一刻 | 已成人类提前出现 |
| 041 | T14 | **第一口生命** | Ask / Embla 脸 Y≈29%，赋生命动作 Y≈43% | 从无生命到第一次呼吸 / 感知 | 科幻能量注入 |
| 042 | T15 | **世界树贯穿诸界** | 主干 Y≈35% | 树体第一次成为宇宙轴 | 地图 UI / 九宫格 |
| 043 | T16 | **三根通向三泉** | 根系三向结构 Y≈42% | 根与泉建立宇宙秩序 | 信息图标签 |
| 044 | T17 | **诺恩在泉边定命** | 三人脸 Y≈28–34%，动作 Y≈46% | 同一时刻在泉边建立命运秩序 | 三张立绘拼贴 |
| 045 | T18 | **日月开始运行** | Sól / Máni Y≈28–40% | 天体人格进入运行秩序 | 太阳系 UI |
| 046 | T19 | **追逐与啃噬** | 天上追逐 Y≈30%，根部威胁只作次级提示 | 世界初生就出现毁灭压力 | 两张成品画面硬拼；若过载则拆卡调整槽位 |

## 7.4 Mythic Object — 2

| # | ID | 神物 | 主体位置 | 视觉方案 | 状态 |
|---:|---|---|---|---|---|
| 047 | O01 | **太阳之车 Chariot of the Sun** | 车体 Y≈34%，核心结构完整位于上 60% | Sól 的太阳运行系统，环境和尾迹向下延伸 | 需新增 MythicObject |
| 048 | O02 | **斯瓦林之盾 Svalinn** | 盾体中心 Y≈36% | 盾位于太阳炽光之前，以宇宙功能而非战斗装备表现 | 需新增 MythicObject |

## 7.5 Hero / Ensemble — 2

| # | ID | 系列主视觉 | 横版构图 |
|---:|---|---|---|
| 049 | E01 | **北欧创世 / Norse Genesis** | 16:9；冰火从左右逼近中央 Ginnungagap，Ymir 为唯一原初尺度主体；中心 70% 保留核心信息 |
| 050 | E02 | **世界树与命运 / Yggdrasil & Fate** | 16:9；Yggdrasil 为中央主轴，Norns / 创世神 / 人类 / 日月自然分布在同一宇宙环境，不做人物拼贴 |

---

# 8. 每张 Artifact 的 JSON 契约

所有 50 个 ID 都必须创建同名 JSON，并通过 `artwork.schema.json`。

最低结构：

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
    "storyIds": [],
    "characterIds": [],
    "worldIds": [],
    "sceneIds": [],
    "objectIds": [],
    "sourceRefs": []
  },
  "canon": {
    "identityAnchors": [],
    "mustKeep": [],
    "mustAvoid": []
  },
  "visual": {
    "visualThesis": "",
    "mood": [],
    "palette": [],
    "materials": []
  },
  "composition": {
    "orientation": "portrait",
    "aspectRatio": "9:16",
    "shot": "",
    "camera": "",
    "primarySubject": "",
    "subjectAnchor": { "x": 0.5, "y": 0.36 },
    "faceAnchor": null,
    "actionAnchor": null,
    "cropSafe": {
      "criticalIdentityZone": { "xMin": 0.20, "xMax": 0.80, "yMin": 0.12, "yMax": 0.52 },
      "preferredSubjectZone": { "xMin": 0.14, "xMax": 0.86, "yMin": 0.10, "yMax": 0.66 },
      "bottomFlexStartsAt": 0.70,
      "edgeFlex": 0.14,
      "notes": ""
    }
  },
  "prompt": {
    "brief": "",
    "final": "",
    "avoid": []
  },
  "references": {
    "referenceArtworkIds": [],
    "referenceImagePaths": [],
    "styleReferenceIds": [],
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

其中 `prompt.final` 必须保存 **实际发送给出图模型的完整 Prompt 原文**，不能只保存关键词。

详细定义见 `M01_ARTIFACT_SPEC.md`。

---

# 9. Prompt 必须包含的统一裁切约束

所有 48 张竖图的最终 Prompt 都必须包含等价语义：

```text
vertical 9:16 mobile wallpaper composition;
place the primary subject and all identity-critical features in the upper half of the image;
keep the face, head, hands involved in the key action, signature object, and main story action safely inside the central upper region;
use the outer edges and lower 30% mainly for expendable environment, ground, mist, water, roots, fabric tails or secondary detail;
the image must remain visually complete if part of the outer edges and lower portion are later cropped or covered by a physical card layout;
no typography, no card frame, no logo, no watermark.
```

这是 **composition resilience / 构图韧性**，不是要求模型生成卡面。

---

# 10. Reference Lock

正式 Story 图之前先锁 Character Canonical Artwork。

例如 Odin：

```text
C04 approved
↓
JSON 保存 face / costume / identity anchors
↓
T07 / T08 / T12 引用 C04 Artwork ID
↓
E02 再引用已批准版本
```

JSON 中禁止写“参考上一张”，必须记录稳定：

```text
referenceArtworkIds
referenceImagePaths
styleReferenceIds
```

Norns、Sköll / Hati 等成组角色同样执行 Reference Lock。

---

# 11. 生产顺序

```text
0. Content Lock
1. 补 P0 Character / Scene / Object
2. 建立 50 个 planned JSON
3. 6 张 Style Test
4. 锁 M01-STYLE-01
5. Character Canonical Artwork
6. Scene Canonical Artwork
7. Story Artwork
8. Mythic Object Artwork
9. E01 / E02
10. 50 组 image + JSON QA
```

正式批量出图前，不允许跳过第 2 步。

---

# 12. 出图前必须补的内容依赖

## Character / Creature

```text
Auðumbla
Ask
Embla
```

## Scene / Concept

```text
Yggdrasil 全局场景
Urðarbrunnr
Hvergelmir
Newborn Midgard variant
Celestial Path
Járnviðr（明确 source scope）
```

## Mythic Object

```text
Sól's Sun Chariot
Svalinn
```

每个 Story Artwork 还必须补全：

```text
storyId
sourceRefs
characterIds
sceneId / worldId
objectIds
visualThesis
avoid
```

---

# 13. QA Gate

## Content QA

- 50/50 主题有来源 / 内容依据；
- Character / Scene / Object 不悬空；
- Story Key Moment 与来源范围一致；
- 不把固定现代“九界地图”画成唯一事实；
- 不提前混入 M02～M04 内容。

## Visual QA

- Character Identity Consistency = 100%；
- anatomy / 手部 / 肢体结构通过；
- 场景 Canon 稳定；
- 无现代 franchise-specific 造型；
- 无文字 / Logo / 乱码 / 卡 UI；
- 主体明确位于上半部；
- `cropSafe = true`；
- 裁掉左右边缘一部分仍能理解；
- 遮住 / 裁掉底部 30% 仍保留角色身份与故事主要信息。

## Artifact QA

每个 ID 必须：

```text
image exists
JSON exists
Schema valid
Prompt final exists
Source refs resolved
Reference IDs stable
Output dimensions correct
QA approved
```

---

# 14. M01 Definition of Done

M01 Phase A 完成不是“生成 50 张图”，而是：

```text
50 个 Artwork ID
×
(1 张 approved 图片 + 1 个 approved JSON)
=
50 组可追溯、可重放、可继续制卡的视觉资产
```

其中：

```text
48 × portrait ≥ 1620 × 2880
2  × landscape ≥ 2880 × 1620
```

最终要求：

- 50 个 JSON 全部可用于重新出图；
- 所有角色具备稳定 Canon；
- 所有竖图具备上半部主体安全构图；
- 所有图片在未来边缘裁切与底部信息遮挡情况下仍保持核心视觉；
- 实体卡尺寸、边框、排版和印刷工艺继续留到 Phase B。
