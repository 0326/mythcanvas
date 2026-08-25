# MythCanvas「神话」Tab（Mythology）改造方案 V2

> 状态：UX / Product Design Canonical Revision  
> 目标：把 `/mythology/{slug}/` 从视觉实体聚合页改造成神话体系的图文故事阅读入口。  
> 当前主路由：`/mythology/`

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
/create/               AI 创作
```

V2 不强制新增 `/story/`。

`MythStory` 可以先作为独立领域对象，由 `/mythology/{slug}/` 聚合并直接渲染；未来内容量与分享需求成立时，再增加独立 Story 路由。

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

卷六 · 文学神话
西游
封神
聊斋相关幻想传统
```

注意：这只是内容组织方式，不代表这些故事属于一条连续历史时间线。

---

## 8. Story 内容可信度

每篇 Story 至少保留：

```ts
tradition?: string
sourceNotes: string[]
```

目的：

- 说明主要来源传统；
- 标识版本差异；
- 避免把晚出文学演绎包装成唯一原典；
- 避免 AI 自动把不同体系的设定无说明地拼接。

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
  | { type: 'quote'; text: string; source?: string }
  | {
      type: 'image';
      image: ImageAsset;
      caption?: string;
      layout?: 'wide' | 'portrait' | 'inset';
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

  tradition?: string;
  sourceNotes: string[];

  characterIds: string[];
  worldIds: string[];
  sceneIds: string[];

  blocks: MythStoryBlock[];
  heroImage?: ImageAsset;
  readingMinutes?: number;
  publishStatus: 'draft' | 'published';
};
```

后续如引入 Content Collections / Markdown，可以保持此领域结构，将正文文件映射为同一 `MythStory` 视图模型。

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

### Artwork

不再作为 Mythology 页的大型 Grid。

Artwork 的主要消费位置：

- `/explore/`
- Character detail
- Realm detail
- Wallpaper detail

Story 内可以直接使用 Artwork/ImageAsset 作为叙事插画，但不要把它呈现成下载卡片流。

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

## 12. 桌面宽屏布局

项目已设定 `--site-min-width: 1080px`，Mythology V2 以桌面阅读为主，不要求为了手机端重组信息架构。

推荐：

```text
1360px content shell

┌─────────────┬────────────────────────────────┐
│ 220~260px   │ 760px 主正文                    │
│ Sticky Index│ 插画可扩展到 900~1000px          │
│             │                                │
└─────────────┴────────────────────────────────┘
```

当宽度接近最低阈值时，只做必要的列宽收缩，不把 Story Reader 改成移动卡片流。

---

## 13. SEO / GEO

`/mythology/{slug}/` 必须服务端输出：

- Mythology H1 / summary；
- Story title / summary / body；
- tradition / source notes；
- Character / Realm 内链；
- Image alt / width / height；
- Breadcrumb structured data；
- CollectionPage + CreativeWork / 后续 Article schema。

正文不能依赖客户端请求。

未来单独 Story 路由成立后，再为 Story detail 增加独立 Article schema、canonical 与分享 URL。

---

## 14. P0 实施范围

1. 新增正式 `MythStory` / `MythStoryBlock` 类型；
2. 建立首批 Story 数据；
3. 新增 Story selector / volume grouping；
4. 重构 `/mythology/{slug}/`；
5. 移除详情页 Visual DNA Panel；
6. 移除 Featured Worlds / Characters / Artwork 主 Grid；
7. 增加 Story 内 Character / Realm 关系入口；
8. 增加来源与版本说明；
9. 保持 SSR 和 SEO 结构。

---

## 15. P1 内容扩展

- 中国神话扩充到 20–30 篇核心 Story；
- 其他首发 Mythology 每个至少 12–20 篇；
- 为重点 Story 生成专属横版叙事插画，而不是长期复用 Realm / Character 现有图；
- 增加更完整的 Character / Realm 关系；
- 增加 Story 搜索；
- 根据内容量决定是否建设 `/story/{slug}/`。

---

## 16. 验收标准

1. `/mythology/{slug}/` 第一主体是图文 Story，而不是实体卡片 Grid；
2. 用户进入页面后无需跳转即可真正读到故事正文；
3. Story 按主题卷目组织，不伪造统一时间线；
4. 每篇 Story 有来源 / 版本意识；
5. Character / Realm 是 Story 的上下文延伸；
6. Visual DNA 不以内部字段表出现；
7. Artwork 不重新占据页面主体；
8. Story 正文 SSR；
9. 页面在项目最低桌面宽度下仍保持阅读结构；
10. Light / Dark 共享同一 IA 与排版结构。
