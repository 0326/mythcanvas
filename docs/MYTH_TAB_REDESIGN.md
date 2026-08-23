# MythCanvas「神话」Tab 重构方案

> 状态：UX / Product Design Proposal  
> 依赖：`docs/CONTENT_POSITIONING.md`  
> 目标：把现有偏「文明图鉴」的页面重构为真正的神话故事与世界观阅读入口。

## 1. 页面定位

新的「神话」不是文明卡片列表，也不是视觉图库，而是 MythCanvas 的 **叙事内容中心**。

核心任务：

> 让用户通过故事理解神灵、神域和视觉作品背后的关系与意义。

与另外两个一级内容页形成明确差异：

| 页面 | 用户意图 | 主要内容 | 主体验 |
|---|---|---|---|
| 神灵 | 找人物、看人物 | Character | 看 |
| 神域 | 找世界、看场景 | Realm / Scene | 看 |
| 神话 | 读故事、理解世界观 | MythStory | 读 |

因此神话页面是全站 **Text-first 的例外页面**，但仍需要保持 MythCanvas 的视觉品质。

---

## 2. 页面不应该是什么

重构后避免：

- 华夏 / 希腊 / 北欧五张大卡片排成一屏；
- 神话百科式词条目录；
- 图片瀑布流；
- 大量短文案卡片堆叠；
- 把故事标题和人物、场景混在同一种卡片里；
- 用过度古风的卷轴、竹简、羊皮纸 UI；
- 用大量装饰元素掩盖正文；
- AI 自动生成、没有来源层次的百科式事实断言。

MythCanvas 的神话阅读体验应更接近 **高品质文化杂志 / Editorial Story Hub**，而不是百科或古风游戏界面。

---

## 3. 页面核心结构

推荐页面结构：

```text
Header

神话
诸神的诞生、战争、爱情与毁灭
[搜索故事]

文明：全部 / 华夏 / 希腊 / 北欧 / 日本 / 埃及
主题：创世 / 诸神 / 英雄 / 爱情 / 战争 / 冥界 / 异兽

────────────────────────────────

今日神话 / Featured Story
┌────────────────────────────────────┐
│ 大幅编辑插图                       │
│                                    │
│ 嫦娥奔月                           │
│ 一颗不死药如何改变了后羿、嫦娥与月宫 │
│ 8 min read        阅读故事 →       │
└────────────────────────────────────┘

热门传说
女娲补天       普罗米修斯盗火
诸神黄昏       伊邪那岐与伊邪那美
奥西里斯之死   美杜莎的诅咒

────────────────────────────────

按文明阅读
华夏神话      12 篇故事 →
希腊神话      18 篇故事 →
北欧神话      10 篇故事 →
日本神话       9 篇故事 →
埃及神话      11 篇故事 →

────────────────────────────────

神话专题
创世神话 / 冥界之旅 / 月亮传说 / 众神之战 ...

────────────────────────────────

更多故事
Editorial List / 轻量卡片
```

关键点：

- 首屏只保留一个明确主故事；
- 文明是筛选和阅读入口，不是页面主体；
- 视觉卡片数量控制，避免再变回 Explore；
- 故事标题与摘要必须能直接建立阅读兴趣。

---

## 4. Hero 设计

### 目标

用户 3 秒内理解：

> 这里是读神话故事的地方，不是另一个图片列表。

### 文案建议

H1：**神话**

副标题：

> 诸神的诞生、战争、爱情与毁灭。

也可使用：

> 阅读传说，理解神灵与神域背后的世界。

### 视觉

Hero 不需要占据整屏。

建议：

- 高度 220～320px；
- 左侧标题与简介；
- 右侧用低对比度文明纹样 / 星图 / 云海作为背景；
- 不使用大型人物 Hero 抢正文注意力；
- 搜索框可放右侧或标题下方。

---

## 5. Featured Story

首页最重要的内容模块。

### 版式

Desktop 推荐 60 / 40：

```text
┌────────────────────────┬──────────────────┐
│                        │ 今日神话         │
│    Editorial Image     │ 嫦娥奔月         │
│                        │                  │
│                        │ 摘要 2～3 行      │
│                        │                  │
│                        │ 月宫 · 嫦娥      │
│                        │ 8 min read       │
│                        │ 阅读完整故事 →   │
└────────────────────────┴──────────────────┘
```

不建议文字直接全部叠在图片上，因为神话页面需要把「阅读」和「看图」的体验拉开。

### 选题规则

Featured Story 优先：

1. 大众认知高；
2. 人物关系明确；
3. 能关联现有高质量神灵 / 神域 Artwork；
4. 有明显故事冲突；
5. 适合继续进入 AI 创作。

例如：

- 嫦娥奔月
- 女娲补天
- 普罗米修斯盗火
- 诸神黄昏
- 伊邪那岐与伊邪那美
- 奥西里斯之死

---

## 6. 故事列表设计

故事列表不做统一大卡片瀑布流。

推荐两种视觉层级：

### A. Featured Card

只用于 1～3 个重点内容，带较大插图。

### B. Editorial Row

用于大多数故事：

```text
[120 × 84 Thumbnail]  女娲补天
                     天地崩裂之后，女娲如何重建世界秩序
                     华夏神话 · 创世 · 6 min read
```

优点：

- 页面更像内容产品；
- 文字密度高但不乱；
- 同屏能展示更多故事；
- 和 Explore 的视觉卡片形成明显区分。

---

## 7. 文明筛选设计

文明仍然非常重要，但从「内容对象」降级为「上下文和分类轴」。

筛选：

```text
全部   华夏   希腊   北欧   日本   埃及
```

不建议做五张大图片卡。

点击文明后：

```text
/myth/?mythology=chinese
```

页面变为：

```text
华夏神话故事
从创世、仙界到山海异兽的东方传说

精选故事
...

全部故事
...
```

同时保留 `/mythology/chinese/` 作为 **文明聚合页**，它负责汇总该文明的神灵、神域、故事和 Visual DNA。

因此两者职责不同：

- `/myth/?mythology=chinese`：我要读华夏故事；
- `/mythology/chinese/`：我要了解华夏神话体系整体。

---

## 8. 故事主题体系

除了文明，还应增加真正适合阅读发现的 Story Topic：

```text
创世
诸神
英雄
爱情
战争
冥界
灾难
异兽
月亮
太阳
命运
复仇
```

主题不是 Style，不参与视觉生成的 Style 体系。

推荐 URL：

```text
/myth/?topic=creation
/myth/?topic=underworld
```

后期可独立 SEO Landing：

```text
/myth/topic/creation/
```

---

## 9. MythStory 内容模型

现有 `Mythology` 不应该直接承载故事正文。

建议新增独立叙事实体：

```ts
type MythStory = {
  id: string;
  slug: string;
  mythologyId: string;

  title: string;
  subtitle?: string;
  summary: string;
  body: string;

  topicIds: string[];
  characterIds: string[];
  realmIds: string[];
  sceneIds?: string[];
  artworkIds?: string[];

  readingMinutes?: number;
  tradition?: string;
  sourceNotes?: string[];

  heroImage?: ImageAsset;
  publishStatus: 'draft' | 'published';
  publishedAt?: string;
  updatedAt: string;
};
```

### 为什么必须独立建模

Story 与 Mythology 的关系是：

```text
Mythology（文明体系）
     ├── Character
     ├── Realm
     ├── Scene
     └── MythStory × N
```

一个文明对应很多故事；一个故事又可以关联多个神灵和神域。

不能继续把 `Mythology.summary` 当神话正文使用。

---

## 10. 史料与版本差异

神话不是单一 Canon。

同一个故事可能存在：

- 地域版本；
- 时代版本；
- 不同典籍版本；
- 后世文学改写；
- 民间传说差异。

因此内容设计必须避免写成「唯一正确答案」。

推荐故事详情页增加轻量说明：

```text
传说版本
本篇主要依据《淮南子》与后世嫦娥奔月传说整理，不同文献存在差异。
```

第一阶段不要求学术论文式引用，但应至少支持：

- `tradition`；
- `sourceNotes`；
- 「其他版本」关联。

这对内容可信度、SEO、GEO 和未来 AI 内容生产都很重要。

---

## 11. 神话故事详情页

建议路由：

```text
/myth/{slug}/
```

例如：

```text
/myth/change-flies-to-the-moon/
/myth/ragnarok/
/myth/prometheus-steals-fire/
```

### 页面结构

```text
Breadcrumb
华夏神话 / 月亮传说

嫦娥奔月
一颗不死药如何改变了后羿、嫦娥与月宫

[Hero Illustration]

导读
120～180 字

正文
--------------------------------
故事起源
不死药
奔月
月宫
后世演变
--------------------------------

故事中的神灵
[嫦娥] [后羿] [西王母]

故事中的神域
[月宫] [昆仑]

相关视觉作品
3～6 张

继续阅读
女娲补天 / 吴刚伐桂 / 玉兔捣药
```

### 正文字数

首发建议：

- 普通故事：800～1500 中文字；
- 核心故事：1500～3000 中文字；
- 不为了 SEO 人为扩成长文章。

---

## 12. Typography

神话页是现有字体规范最适合发挥的页面。

推荐：

- H1 / Story Title：Source Han Serif；
- 正文：UI Sans 为默认；
- 导读 / 引文 / 典籍摘意：LXGW WenKai；
- Metadata / Filter / Breadcrumb：UI Sans。

不要整篇正文使用文楷，避免阅读效率下降。

正文建议：

```text
Desktop: 17～18px / line-height 1.8
Content width: 680～760px
Mobile: 16px / line-height 1.75
```

长文最重要的是行宽和留白，而不是装饰。

---

## 13. 图像策略

神话页不是放弃视觉，而是改变视觉职责。

### 图片负责

- 建立氛围；
- 解释人物和地点；
- 分隔长文；
- 提供视觉记忆；
- 引导到 Artwork / 神灵 / 神域。

### 图片不负责

- 占满整个信息流；
- 替代正文；
- 每个段落都配一张图；
- 强迫用户进入壁纸浏览模式。

一个普通 Story Detail 建议：

- Hero 1 张；
- 正文插图 1～3 张；
- Related Artwork 3～6 张。

---

## 14. Search / Discovery

神话页面搜索建议只搜索叙事相关内容：

- Story title；
- Story summary；
- Character names；
- Realm names；
- Topic。

例如搜索：

```text
月亮
```

可以返回：

```text
嫦娥奔月
辉夜姬
阿尔忒弥斯与月神传说
孔苏的太阳与月亮传说
```

全站 Search 仍负责跨 Character / Realm / Story / Artwork 查询。

---

## 15. SEO / GEO

神话是全站最重要的文字内容资产，应承担主要长尾 SEO / GEO 能力。

### Story Detail 必须具备

- 唯一 H1；
- Server-rendered 正文；
- `Article` / `CreativeWork` JSON-LD；
- canonical URL；
- `datePublished` / `dateModified`；
- 作者 / 编辑归属；
- 相关 Character / Realm 内链；
- Civilization 内链；
- Hero image alt；
- source / tradition note；
- FAQ 仅在真实有价值时增加。

### 长尾关键词价值

例如：

```text
嫦娥奔月的故事
诸神黄昏是什么
奥丁为什么失去一只眼睛
普罗米修斯为什么盗火
伊邪那美为什么进入黄泉
阿努比斯是什么神
```

其中人物解释最终可以在神灵页承接，事件 / 故事情节在神话页承接。

---

## 16. 推荐关系

Story 页面推荐优先级：

```text
同一 Story Topic
→ 同一 Mythology
→ 共享 Character
→ 共享 Realm
→ 编辑精选
```

神灵详情页新增：

```text
相关神话
```

神域详情页新增：

```text
发生在这里的神话
```

最终形成内容图谱：

```text
神话 Story
  ↔ 神灵 Character
  ↔ 神域 Realm / Scene
  ↔ Artwork
```

---

## 17. 路由迁移建议

目标路由：

```text
/myth/                 神话故事入口
/myth/{slug}/          故事详情
/mythology/{slug}/     文明 / 神话体系聚合页
```

### 现有 `/mythology/`

当前可以分阶段迁移：

#### Phase 1

- Header 文案先改成「神话」；
- 新建 `/myth/`；
- `/mythology/` 暂时保留文明列表；
- `/mythology/{slug}` 不动。

#### Phase 2

- 首页、神灵、神域的「读故事」入口全部指向 `/myth/`；
- `/mythology/` 不再进入主导航，只作为文明索引 / SEO 辅助页。

#### Phase 3

根据 Search Console 与外链情况决定 `/mythology/` 是否：

- 保留；或
- 301 到 `/myth/`。

不要破坏 `/mythology/{slug}` 已有的文明实体 URL。

---

## 18. MVP 内容计划

第一阶段不需要一次做几十篇。

建议每个文明先做 3～5 个强认知故事：

### 华夏

- 女娲补天
- 嫦娥奔月
- 后羿射日
- 哪吒闹海
- 西王母与昆仑

### 希腊

- 普罗米修斯盗火
- 珀耳塞福涅与冥界
- 美杜莎
- 特洛伊战争的神祇
- 潘多拉魔盒

### 北欧

- 世界树与九界
- 奥丁的智慧之眼
- 洛基与芬里尔
- 巴德尔之死
- 诸神黄昏

### 日本

- 伊邪那岐与伊邪那美
- 天照隐入天岩户
- 须佐之男与八岐大蛇
- 辉夜姬
- 黄泉之国

### 埃及

- 奥西里斯之死与复生
- 伊西斯寻找奥西里斯
- 荷鲁斯与赛特
- 拉神太阳舟
- 阿努比斯与亡者审判

首发 15～25 篇即可形成可用内容中心。

---

## 19. 实施优先级

### P0：产品结构

1. 导航「文明图鉴」→「神话」；
2. 新建 Story / MythStory 数据模型；
3. 新建 `/myth/`；
4. 完成 Featured Story + 文明筛选 + Story List；
5. 完成 `/myth/{slug}/` Story Detail；
6. 神灵 / 神域加入 Story 关系入口。

### P1：内容运营

1. Story Topic；
2. Story source notes；
3. 相关阅读推荐；
4. 内容搜索；
5. SEO / GEO structured data。

### P2：深化

1. 同一神话不同版本；
2. 时间线；
3. 人物关系图；
4. 神话谱系 / Family Tree；
5. AI 辅助讲解与问答。

---

## 20. 验收标准

重构完成后，应满足：

1. 用户无需看导航说明即可理解「神话」是阅读页面；
2. 与 Explore / 神灵 / 神域没有图片流形态重复；
3. 首屏 1 个 Featured Story 明确建立阅读入口；
4. 文明只作为筛选和内容上下文；
5. Story 可以关联神灵、神域和 Artwork；
6. Story Detail 在无 JS 情况下仍可完整阅读；
7. 页面正文阅读宽度、字号、行高达到长文阅读要求；
8. Light / Dark 均保持同一结构；
9. SEO / GEO 所需正文与关系均服务端输出；
10. 神话内容的事实表达允许版本差异，不伪装成唯一 Canon。
