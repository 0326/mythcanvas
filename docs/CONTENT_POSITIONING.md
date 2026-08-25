# MythCanvas 内容定位与一级导航规范

> 状态：Product Canonical Addendum  
> 版本：V1.2  
> 日期：2026-08  
> 适用范围：后续产品设计、页面命名、信息架构、内容建模与 AI Coding。

## 1. 结论

MythCanvas 的一级内容导航统一为：

```text
首页｜探索｜神灵｜神域｜神话｜AI 创作
```

五个入口承担不同任务：

| 用户名称 | 核心问题 | 主内容形态 | 主要对象 |
|---|---|---|---|
| 探索 | 现在有什么值得看的视觉作品？ | 视觉发现流 | Artwork |
| 神灵 | 这个神话人物是谁、有哪些形态？ | 强视觉角色资产 | Character |
| 神域 | 这些传说发生在哪里？ | 强视觉空间资产 | World + Scene |
| 神话 | 这些故事如何构成一个神话体系？ | **图文故事 / 长阅读** | Mythology + MythStory |
| AI 创作 | 我如何创造自己的版本？ | Guided Creator | Generation |

产品体验原则：

> **探索负责发现；神灵负责认识“谁”；神域负责进入“哪里”；神话负责讲述“发生了什么”；AI 创作负责重新创造。**

这是后续页面设计的默认职责边界。

---

## 2. 「神话」的新定位：故事是主体，不是附属模块

`/mythology/` 仍然是神话体系列表，`/mythology/{slug}/` 仍然代表一个完整的 Mythology 神话体系。

但神话体系详情页的**主要消费内容改为 MythStory 图文故事**，而不是 Visual DNA、神灵、神域和 Artwork 的卡片聚合。

例如：

```text
中国神话 Mythology
├── 卷一 · 创世与天地
│   ├── 盘古开天 MythStory
│   └── 女娲补天 MythStory
├── 卷二 · 日月与天象
│   └── 嫦娥奔月 MythStory
├── 相关神灵 Character
├── 相关神域 World / Scene
└── Visual DNA（内部视觉约束）
```

因此：

- `Mythology` 仍然是体系实体，不与单篇故事合并；
- `MythStory` 是体系下的独立叙事实体；
- 用户进入某个 Mythology 详情页后，**通过一组被策展、分卷组织的 MythStory 来理解和探索该体系**；
- Character / World / Scene 作为故事中的上下文关系自然出现，并链接到对应的「神灵 / 神域」页面；
- Artwork 不再作为 Mythology 详情页的主要瀑布流，它应留给 Explore、Character、Realm 等视觉消费场景。

> **技术模型保持分离，用户体验以故事串联。**

---

## 3. 为什么不能继续做“视觉聚合页”

旧设计：

```text
Hero
→ Civilization Visual DNA
→ Featured Worlds
→ Featured Characters
→ Featured Artworks
→ 可选 MythStory
```

这个结构的问题：

1. 与「神灵」「神域」「探索」三个入口高度重复；
2. 用户无法真正理解“探索神话”具体探索什么；
3. 页面被数据库对象结构支配，缺少神话本身最重要的叙事；
4. Visual DNA 是创作与设计约束，不是用户主动阅读的核心内容；
5. 单纯增加更多图片只会把 Mythology 变成另一个 Artwork 分类页。

新结构：

```text
Mythology Hero
→ 卷目 / 主题导航
→ Illustrated MythStory × N
→ Story 内关联 Character / Realm
→ 来源、传统与版本说明
→ 轻量 Related Universe
```

页面核心价值变成：

> **用可阅读、可观看、可继续进入实体的图文故事，让用户真正理解一个神话体系。**

---

## 4. Mythology 与 MythStory 的模型边界

用户界面的「神话」仍然对应 `Mythology`；技术上具体故事使用 `MythStory`。

```text
Mythology
  ├── MythStory × N   ← 详情页主体
  ├── Character × N
  ├── World × N
  ├── Scene × N
  └── Artwork × N

MythStory
  ↔ Character × N
  ↔ World × N
  ↔ Scene × N
```

不能把两者合并：

- 中国神话 ≠ 盘古开天；
- 希腊神话 ≠ 普罗米修斯盗火；
- 北欧神话 ≠ 诸神黄昏。

正确关系是：

> 一个 Mythology 通过多篇 MythStory 被讲述。

MythStory 是否未来拥有独立 `/story/{slug}/` 路由属于后续产品决策，不影响当前 `/mythology/{slug}/` 直接承载故事阅读。

---

## 5. 故事组织：按“卷 / 主题”，不要强造统一时间线

不同神话体系通常由不同时代、来源和传统共同形成，尤其不应该为了 UI 好看把所有故事硬排成一条绝对 chronology。

默认组织方式：

```text
卷一 · 创世与天地
卷二 · 日月与天象
卷三 · 神与英雄
卷四 · 神域与异境
卷五 · 民间传说
卷六 · 文学演绎
```

具体卷目按 Mythology 自身调整。

每篇 MythStory 应明确：

- 标题 / 副标题；
- 故事正文；
- 图像段落；
- 来源传统或时代说明；
- 版本差异 / 流变说明；
- 相关 Character / World / Scene；
- 阅读顺序与所属卷。

对于来源性质不同的内容必须明确区分，例如：

```text
古代神话
宗教传统
民间传说
古典文学演绎
后世文化流变
```

不要把后世文学版本包装成唯一原典。

---

## 6. 图文故事 UX 原则

Mythology 详情页不是百科长文，也不是普通博客。

定位：

> **Editorial Long-form + Illustrated Storytelling / 图文神话志**

默认阅读节奏：

```text
Story Title
→ 极短引子
→ 正文
→ 关键插画
→ 正文
→ 引文 / 版本说明
→ Story 中的神灵 / 神域关系
→ 来源说明
```

设计要求：

- 正文是主线，图片服务叙事；
- 插画可全宽、内嵌、纵向穿插，形成长阅读节奏；
- 不使用等尺寸 Card Grid 作为故事主体；
- 大标题使用 Display Serif；
- 神话叙事正文优先使用 `--font-literary`；
- UI、元数据、导航保持中性 Sans；
- Story 来源说明应克制、可折叠，但不能完全缺失；
- 核心正文必须 SSR，可被搜索引擎与 GEO 抓取。

---

## 7. Visual DNA 的正确位置

Civilization Visual DNA 仍然重要，但它主要服务：

- AI 生图 Prompt 约束；
- Mythology Hero 与故事插画的视觉一致性；
- 文化符号、材质、纹样和环境的 Art Direction；
- Character / Realm Canonical Design 的文化上下文。

它**不再作为 Mythology 详情页的字段面板**展示：

```text
色彩 / 纹样 / 材质 / 气质
```

用户应该从图像、排版与内容中感知 Visual DNA，而不是阅读设计系统字段。

---

## 8. 神灵、神域与神话如何互相连接

### 神灵 Character

定位：**人物视觉资产页**。

视觉约 75%，文字约 25%。

承载：Canonical Design、身份、神职、符号、变体、相关神域、Artwork、AI 创作。

### 神域 World / Scene

定位：**神话空间视觉资产页**。

视觉约 75%，文字约 25%。

承载：Immersive Hero、空间概览、地标、视觉变体、相关神灵、Artwork、AI 创作。

### 神话 Mythology

定位：**神话体系的故事阅读入口**。

建议内容权重：

```text
叙事 / 文字 55~65%
故事插画     30~40%
导航 / 关系   5~10%
```

这不是要求页面“少图”，而是要求图片始终服务 Story，而不是重新变成 Artwork Feed。

典型链路：

```text
中国神话
→ 阅读「嫦娥奔月」
→ 故事中点击「嫦娥」
→ 神灵页查看主形象 / Visual Forms / 壁纸
→ 点击「神域」继续进入月宫 / 天宫
→ AI 创作自己的版本
```

---

## 9. 桌面端页面约束

项目已明确最低站点宽度，Mythology 阅读体验优先针对桌面宽屏设计，不因手机端进行结构妥协。

推荐宽屏阅读布局：

```text
┌──────────┬─────────────────────────────┐
│ Sticky   │                             │
│ 卷目目录  │       图文故事正文             │
│ 220~260  │       700~800 主阅读宽度       │
│          │       插画可突破正文宽度         │
└──────────┴─────────────────────────────┘
```

关键原则：

- 正文保持可读行长；
- 插画可以突破正文列形成电影化节奏；
- 卷目导航可 Sticky；
- 不为了响应式把页面退化成卡片堆叠。

---

## 10. 一级导航职责

### 首页

品牌感知 + 精选入口。

### 探索

Artwork 视觉内容发现 Feed。

### 神灵

Character 视觉资产库。

### 神域

World + Scene 视觉世界入口。

### 神话

Mythology 列表 + Mythology 详情中的 MythStory 图文叙事。

回答：

> 这个神话体系讲了哪些故事？这些故事中的神、英雄与世界如何彼此连接？

### AI 创作

把神灵、神域、画风和输出规格组合为新的视觉作品。

---

## 11. 命名规范

用户界面统一使用：

```text
Character → 神灵
World / Scene → 神域
Mythology → 神话 / 神话体系
MythStory → 故事 / 传说
Artwork → 作品
Create → AI 创作
```

技术文档中：

- `Mythology` 始终表示完整神话体系；
- `MythStory` 始终表示体系中的具体故事；
- `/mythology/{slug}/` 可以聚合并直接呈现多篇 MythStory；
- 不因为用户在同一个页面阅读故事就把两个领域对象合并。

---

## 12. 验收问题

后续任何 Mythology 页面设计必须回答：

1. 用户进入后是否能立刻开始阅读真正的神话故事？
2. 页面主体是否仍然被 World / Character / Artwork 卡片网格占据？如果是，默认判定失败。
3. 每篇故事是否有来源传统或版本说明？
4. 是否避免强造统一时间线和唯一 Canon？
5. Character / Realm 是否从故事上下文自然进入，而不是抢占主页面？
6. 图像是否服务叙事，而不是把页面重新变成图库？
7. 核心故事正文是否服务端渲染、可索引？

---

## 13. 与既有文档的关系

本文件是 `docs/PRODUCT.md` 的产品定位修订，也是 `docs/MYTH_TAB_REDESIGN.md` 的上位原则。

若旧文档仍写有：

```text
Mythology = Visual DNA + Worlds + Characters + Artwork 聚合页
MythStory = 未来可选模块
```

以本 V1.2 结论为准：

> **Mythology 技术上仍是体系实体；但 `/mythology/{slug}/` 的用户体验以 MythStory 图文故事为主体。神灵与神域承担视觉资产，探索承担 Artwork 发现。**
