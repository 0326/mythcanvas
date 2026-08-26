# MythCanvas「神话」Tab（Mythology）改造方案 V2.1

> 状态：UX / Product Design Canonical Revision  
> 目标：把 `/mythology/{slug}/` 从视觉实体聚合页改造成神话体系的图文故事阅读入口。  
> 当前主路由：`/mythology/`

> 本文是 Mythology / MythStory 的产品与交付规范。实施时必须同步 `docs/PRODUCT.md` 的神话页定义与 `docs/ARCHITECTURE.md` 的 MythStory 模型，避免出现多份“Canonical”规范彼此冲突。

## 0. V2.1 决策摘要

- `Mythology` 始终是神话体系容器；`MythStory` 始终是具体叙事，不合并为同一实体。
- `/mythology/{slug}/` 是体系入口和编排页：读者进入后可直接开始阅读，不会退化成实体卡片 Grid。
- 当内容规模尚小，聚合页可完整呈现全部 Story；内容规模增长后，聚合页保留体系语境、卷目和精选全文，单篇 Story 获得稳定的嵌套路由。
- Story 的来源、内容类别、插画资产和关系入口必须结构化，不能只依赖自由文本说明。
- 桌面阅读优先，但不以 `--site-min-width` 为由放弃移动端可读性、键盘访问或性能。

## 1. 核心定位

「神话」仍然指一个完整的 Mythology 神话体系；具体叙事仍然使用独立的 `MythStory` 模型。

```text
神话体系 = Mythology
故事 / 传说 = MythStory
```

但页面职责发生关键变化：

> **Mythology 是容器，MythStory 是用户在 Mythology 详情页消费的核心内容。**

因此 `/mythology/chinese/` 不再主要回答“有哪些神灵 / 神域 / Artwork”，而主要回答：

> 中国神话里有哪些值得阅读的故事？这些故事来自什么传统？故事中的人物与世界如何继续探索？

---

## 2. 路由与一级导航

一级导航保持：

```text
首页｜探索｜神灵｜神域｜神话｜AI 创作
```

路由映射：

```text
/explore/              Artwork 发现流
/character/            Character / 神灵
/world/                World + Scene / 神域
/mythology/            Mythology / 神话体系列表
/mythology/{slug}/     单个神话体系的故事阅读页
/mythology/{mythologySlug}/{storySlug}/  单篇 Story 阅读页（达到启用阈值后）
/create/               AI 创作
```

V2.1 不强制新增全局 `/story/` Hub。跨体系 Story 发现仍可在未来作为独立产品决策；单篇阅读优先采用嵌套路由，以保留 Mythology 语境、避免全局 slug 冲突，并提供稳定分享 URL。

`MythStory` 先由 `/mythology/{slug}/` 聚合并直接渲染。满足任一条件时，必须启用 `/mythology/{mythologySlug}/{storySlug}/`：

- 某 Mythology 已发布 8 篇以上 Story；
- 单篇 Story 已承担外部分享、搜索落地或独立运营；
- 已提供 Story 搜索、收藏或持续更新。

启用后，体系页仍是 Mythology 的 canonical 页面；单篇 Story 使用自己的 canonical、分享图和 Article schema，不与体系页重复输出同一篇完整正文。

---

## 3. `/mythology/` 神话体系列表

列表页仍然负责选择神话体系。

用户任务：

> 选择一个神话体系，进入它的故事、传说与世界。

卡片应继续使用高质量文明封面，但文案从“视觉规则”转向“故事入口”。

建议信息：

```text
中国神话
从创世、日月、洪水到仙山与人间传说
12 卷 · 48 篇故事（有真实数据时再展示）
```

不要在列表页展示 Visual DNA 字段表。

---

## 4. `/mythology/{slug}/` 页面回答的问题

优先级从高到低：

1. 这个神话体系有哪些核心故事？
2. 这些故事应该按什么主题 / 卷目理解？
3. 每个故事来自什么传统、时代或文本？
4. 不同版本之间有哪些重要差异？
5. 故事涉及哪些神灵与神域？
6. 用户如何继续进入 Character / Realm 或 AI 创作？

以下问题不再作为主页面主体：

- Visual DNA 字段是什么？
- 有哪些 Artwork？
- 有哪些等权重 Character Cards？
- 有哪些等权重 World Cards？

这些内容由其他页面承担。

---

## 5. 推荐页面结构

```text
Immersive Mythology Hero
中国神话
Chinese Mythology
体系序言
[从故事开始]

卷目预览
创世与天地 / 日月与天象 / 神与英雄 / ...

────────────────────────

Sticky Story Index
│
└── 主阅读区
    ├── 卷一 · 创世与天地
    │   ├── 盘古开天
    │   │   ├── 引子
    │   │   ├── 正文
    │   │   ├── 故事插画
    │   │   ├── 正文
    │   │   ├── 相关神灵 / 神域
    │   │   └── 来源与版本说明
    │   └── 女娲补天
    │
    └── 卷二 · 日月与天象
        └── 嫦娥奔月

Related Universe
轻量进入神灵 / 神域
```

页面必须像一本可以持续阅读的数字神话志，而不是内容管理系统对象列表。

### 阅读规模策略

- **1–7 篇已发布 Story**：体系页可完整服务端渲染全部正文，便于建立首次阅读体验。
- **8 篇以上**：体系页保留 Hero、卷目、至少 1 篇精选 Story 全文与其余 Story 摘要；其余完整正文由嵌套路由承载。
- 这不是把正文改为客户端按需请求。所有可索引的 Story 正文仍必须在对应 URL 的初始 HTML 中服务端输出。

---

## 6. Story 的页面表达

每篇 Story 默认结构：

```text
编号 / 来源传统
标题
英文名（可选）
副标题
摘要
阅读时间

正文段落

关键插画
图片说明

正文段落

引文 / 版本提醒（可选）

相关神灵 / 神域
来源与版本说明
```

### 正文

- 主阅读宽度约 700–800px；
- 使用 `--font-literary`；
- 行高应明显高于普通 UI 文本；
- 不使用密集 metadata；
- 不使用百科式 Facts Table 作为正文主体。

### 插画

允许：

- Wide：突破正文列，制造叙事高潮；
- Portrait：人物 / 神祇纵向画面；
- Inset：局部氛围图。

图片必须服务故事段落，不应把 Story 拆回作品瀑布流。

---

## 7. 卷目而不是统一时间线

Mythology 详情页默认按“卷 / 主题”组织 Story，而不是强行建立绝对 chronology。

中国神话示例：

```text
卷一 · 创世与天地
盘古开天
女娲补天
共工触山

卷二 · 日月与天象
后羿射日
嫦娥奔月
夸父逐日

卷三 · 洪水与英雄
鲧禹治水
精卫填海
刑天

卷四 · 神山与异境
昆仑
蓬莱
瑶池

卷五 · 民间传说
白蛇
妈祖
八仙

卷六 · 文学与神魔小说
《西游记》相关故事
《封神演义》相关故事
志怪与《聊斋》幻想传统
```

注意：这只是内容组织方式，不代表这些故事属于一条连续历史时间线。

卷目也不等于来源分类。古代神话、民间传说、宗教传统与文学幻想可以并列被阅读，但必须保留其不同的形成时间、文本性质与叙事边界，不能统称为同一种“原典神话”。

---

## 8. Story 内容可信度

每篇 Story 至少保留：

```ts
kind: 'myth' | 'folk-legend' | 'religious-tradition' | 'literary-fantasy'
tradition?: string
sources: MythStorySource[]
sourceNotes: string[] // 面向读者的版本提醒，不替代 sources
```

```ts
type MythStorySource = {
  title: string;
  sourceType: 'primary-text' | 'translation' | 'scholarly-reference' | 'oral-tradition';
  tradition?: string;
  period?: string;
  note?: string;
  url?: string;
};
```

目的：

- 说明主要来源传统；
- 标识版本差异；
- 避免把晚出文学演绎包装成唯一原典；
- 避免 AI 自动把不同体系的设定无说明地拼接。

`kind` 必须在正文顶部以轻量、可读的形式表明内容性质。例如“先秦至汉代神话传统”“民间传说”“明代神魔小说”，而不是用内部枚举名作为 UI 标签。

对争议或复杂内容优先使用：

> “本篇采用……常见叙事骨架”

而不是：

> “真实神话设定就是……”

---

## 9. MythStory 领域模型

当前采用结构化 Story Block，便于后续 Editorial Layout 与 SSR：

```ts
type MythStoryBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; id: string; text: string; level: 2 | 3 }
  | { type: 'quote'; text: string; source?: string }
  | {
      type: 'image';
      assetId: string;
      caption?: string;
      layout?: 'wide' | 'portrait' | 'inset';
    };

type StoryIllustrationAsset = {
  id: string;
  image: ImageAsset;
  provenance: {
    sourceType: 'original' | 'ai' | 'public-domain' | 'licensed';
    creator?: string;
    sourceUrl?: string;
    licenseName?: string;
    model?: string;
    promptRecipeId?: string;
  };
  artworkId?: string;
};

type MythStory = {
  id: string;
  slug: string;
  mythologyId: string;
  title: string;
  titleEn?: string;
  subtitle?: string;
  summary: string;

  volumeId: string;
  volumeTitle: string;
  volumeOrder: number;
  displayOrder: number;

  kind: 'myth' | 'folk-legend' | 'religious-tradition' | 'literary-fantasy';
  tradition?: string;
  sources: MythStorySource[];
  sourceNotes: string[];

  characterIds: string[];
  worldIds: string[];
  sceneIds: string[];

  blocks: MythStoryBlock[];
  heroImage?: ImageAsset;
  readingMinutes?: number;
  publishStatus: 'draft' | 'published';
  publishedAt?: string;
  updatedAt?: string;
};
```

`assetId` 指向具有来源与许可信息的 `StoryIllustrationAsset`；已有 Artwork 可以通过 `artworkId` 复用。Story Reader 只负责叙事呈现，不应把插画变成下载卡片流。

后续如引入 Content Collections / Markdown，可以保持此领域结构，将正文文件映射为同一 `MythStory` 视图模型。Block 中的 `heading.id` 必须稳定，以支持目录、深链接和后续文章页的段落引用。

P0 的正文优先使用类型安全的 seed data 或 Astro Content Collections / Markdown/MDX 管理；不要为了首批编辑内容先引入 D1 写入后台。Story 的稳定 ID、slug 与关系字段必须在迁移到 D1 前后保持不变。

---

## 10. Character / Realm / Artwork 的位置

### Character

由 Story 内文关系自然进入。

示例：

```text
嫦娥奔月
→ 嫦娥
→ 查看神灵
```

### Realm

由故事发生空间自然进入。

```text
太阳神舟
→ 杜阿特
→ 进入神域
```

本文中的 Realm 指用户可见的“神域”概念；当前技术模型中的 `World + Scene` 与 `worldIds` 继续沿用，不在 V2.1 新增并行的 `Realm` 实体或 `realmIds` 字段。

### Artwork

不再作为 Mythology 页的大型 Grid。

Artwork 的主要消费位置：

- `/explore/`
- Character detail
- Realm detail
- Wallpaper detail

Story 内可以复用 Artwork 或具备完整 provenance 的编辑插画资产，但不要把它呈现成下载卡片流。所有叙事插画都必须具有稳定 `assetId`、alt、尺寸和许可/模型/创作者来源；不能只存一个裸 `ImageAsset` URL。

---

## 11. Visual DNA 的位置

Civilization Visual DNA 仍由 `Mythology` 持有，但从用户页面的字段模块退到视觉系统内部。

使用位置：

```text
Mythology Hero Art Direction
Story Illustration Art Direction
Character / Realm generation context
AI prompt composition
局部文明纹样 / 材质 / 符号
```

不要继续显示：

```text
Civilization Visual DNA
色彩
纹样
材质
气质
```

这样的产品内部字段面板。

---

## 12. 阅读布局、索引与响应式

`--site-min-width: 1080px` 是当前桌面阅读基线，不是放弃移动端体验的理由。Mythology V2.1 以桌面阅读优先，但每个公开阅读页仍必须在手机上可读、可导航、无横向溢出。

推荐：

```text
1360px content shell

┌─────────────┬────────────────────────────────┐
│ 220~260px   │ 760px 主正文                    │
│ Sticky Index│ 插画可扩展到 900~1000px          │
│             │                                │
└─────────────┴────────────────────────────────┘
```

桌面/宽屏规则：

- Sticky Story Index 使用 `max-height: calc(100svh - header - spacing)` 与独立滚动，避免 20 篇以上 Story 使目录超出视口；
- 目录链接必须保留键盘焦点、正确的 `scroll-margin-top`，并在可行时标示当前卷目/Story；
- 主正文维持 700–800px，Wide 插画可扩展，但不突破容器和视口安全边距；
- 任何目录、正文、插画与关系入口均不能依赖 JavaScript 才能阅读。

窄屏规则：

- 低于双栏可读宽度时，Story Index 变为正文前的可展开目录或紧凑锚点栏，不继续占用固定侧栏；
- 正文为单列，Portrait / Inset / Wide 插画依旧保留叙事层级但不产生横向滚动；
- 关系入口采用可点按的单列或横向轻量列表，不退化为密集卡片墙；
- 至少验证 `1360×900`、`1080px` 宽桌面和 `390×844` 手机视口，以及 Light / Dark 两种主题。

---

## 13. SEO / GEO

`/mythology/{slug}/` 必须服务端输出：

- Mythology H1 / summary；
- 卷目、Story title / summary，以及阅读规模策略要求的精选 Story body；
- tradition / source notes；
- Character / Realm 内链；
- Image alt / width / height；
- Breadcrumb structured data；
- 唯一 title、description、canonical、OpenGraph image；
- `CollectionPage` 与已发布 Story 的简要 `CreativeWork` 列表。

嵌套路由启用后，`/mythology/{mythologySlug}/{storySlug}/` 必须额外服务端输出：

- 单篇 Story 的 H1、摘要、全文、`kind`、来源与版本说明；
- 指向所属 Mythology、相关 Character / Realm 的描述性内链；
- Story 自身 canonical、OpenGraph image、Breadcrumb 与 `Article` schema；
- sitemap 收录与 `datePublished` / `dateModified`（存在时）。

正文不能依赖客户端请求。体系页与 Story 详情页不能以不同 canonical 重复输出同一篇完整正文，也不自动索引缺乏实质正文的筛选页。

---

## 14. Story 到 AI Creator 的交接

Story 不是未经约束的 Prompt。P0 只提供 Story → Character / Realm / Scene 的关系入口；若尚未存在可用关系，不显示虚假的“基于此故事生成”按钮。

P1 需要由编辑明确建立 `StoryCreationSeed`，再交给 Guided Creator：

```text
Mythology Visual DNA
→ selected Character / Realm / Scene
→ Story 中经过审核的场景摘要
→ Style
→ OutputSpec
→ optional user refinement
```

不得把整篇正文直接拼入用户 Prompt；系统约束、来源边界与角色/神域的 Canonical Design 必须先于用户自由文本。

---

## 15. P0 基线与 V2.1 实施范围

### 当前基线（防回归）

以下能力已作为当前产品基线存在，后续改造不能重新退回实体聚合页：

1. `MythStory` / `MythStoryBlock` 与首批 Story 数据；
2. Story selector 与 volume grouping；
3. `/mythology/{slug}/` 的 Story Reader；
4. Story 内 Character / Realm 关系入口、来源/版本说明；
5. SSR、Mythology Hero 与基础 JSON-LD 结构。

### V2.1 P0

1. 同步 `PRODUCT.md`、`ARCHITECTURE.md` 与本方案，确立同一 MythStory 结构和页面职责；
2. 为 Story 增加 `kind`、结构化 `sources`、发布时间和更新日期，并建立内容校验；
3. 建立具备来源/许可/模型 provenance 的 Story 插画资产引用，不再只存裸图片 URL；
4. 实现阅读规模策略、可滚动的桌面目录和无横向溢出的移动阅读结构；
5. 完善体系页的 canonical、OG、CollectionPage、Breadcrumb 与图片语义；
6. 明确 Story → Creator 仅通过已审核的 Character / Realm / Scene 关系交接；
7. 以已有 15 篇 Story 进行来源、分类、插画和关系完整性审计。

---

## 16. P1 内容扩展

- 先为每个首发 Mythology 完成至少 5 篇通过来源、分类、关系和插画审计的核心 Story，再扩展数量；
- 中国神话扩充至 20–30 篇、其他首发 Mythology 至 12–20 篇时，逐篇满足相同质量门槛；
- 一旦达到路由启用阈值，建设 `/mythology/{mythologySlug}/{storySlug}/`，并将聚合页改为体系入口与精选阅读；
- 为重点 Story 生成专属叙事插画，而不是长期复用 Realm / Character 现有图；
- 增加更完整的 Character / Realm / Scene 关系、`StoryCreationSeed` 与受控 AI 创作入口；
- 在 Story 有稳定 URL 与实质正文后，增加 Story 搜索、Article schema 和 sitemap 条目；
- 只有当跨体系阅读成为明确用户任务时，才评估独立 `/story/` Hub。

---

## 17. 验收标准

1. `/mythology/{slug}/` 第一主体是图文 Story，而不是实体卡片 Grid；
2. 用户进入页面后无需跳转即可真正读到故事正文；
3. Story 按主题卷目组织，不伪造统一时间线；
4. 每篇已发布 Story 都有内容类别、结构化来源与面向读者的版本说明；
5. 民间传说、宗教传统与文学幻想不会被伪装为同一层级的原典神话；
6. Character / Realm / Scene 是 Story 的上下文延伸，AI 交接只使用经过审核的关系；
7. Visual DNA 不以内部字段表出现，Artwork 不重新占据页面主体；
8. Story 正文、来源、关系和主要图片均 SSR，图片具有 alt、尺寸和资产 provenance；
9. 达到 8 篇、独立分享或 Story 搜索任一条件时，Story 详情路由、canonical、Article schema 与 sitemap 同步上线；
10. `1360×900`、`1080px` 宽桌面与 `390×844` 手机均无横向溢出，目录和正文可键盘访问；
11. Light / Dark 共享同一 IA 与排版结构，并尊重 `prefers-reduced-motion`；
12. 体系页只输出与阅读规模相符的完整正文，避免把数十篇长文、插画和关系模块堆入单一页面。
