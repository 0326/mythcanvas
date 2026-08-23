# MythCanvas「神话」Tab（Mythology）改造方案

> 状态：UX / Product Design Canonical Revision
> 目标：把现有「文明图鉴」入口统一为 Mythology 神话体系入口。
> 当前主路由：`/mythology/`

## 1. 核心定位

「神话」指的是一个完整的神话体系，而不是某一篇故事。

```text
神话 = Mythology
故事 / 传说 = MythStory
```

示例：

```text
中国神话 Mythology
├── 神灵：嫦娥、后羿、女娲
├── 神域：月宫、昆仑、天宫
├── Visual DNA：云海、玉石、鎏金、月白
├── Artwork：相关视觉作品
└── MythStory：嫦娥奔月、女娲补天
```

`Mythology` 是一级内容实体；`MythStory` 是其下属的叙事内容实体，不能用 `MythStory` 替代 `/mythology/`。

## 2. 路由与导航

一级导航：

```text
首页｜探索｜神灵｜神域｜神话｜AI 创作
```

路由映射：

```text
/explore/              Artwork 发现流
/character/            Character / 神灵
/world/                World + Scene / 神域
/mythology/            Mythology / 神话体系列表
/mythology/{slug}/     单个神话体系聚合页
/create/               AI 创作
```

当前不新增 `/my/` 作为一级内容 Tab，也不新增与 `/mythology/` 重叠的 `/myth/` 主入口。

如果未来需要故事内容中心，使用明确的用户名称「故事」或「传说」，并选择独立的 `/story/` 路由，避免 `/myth/` 与 `/mythology/` 语义冲突。

## 3. `/mythology/` 神话体系列表

### 用户任务

用户进入页面后应理解：

> 这里可以选择一个神话体系，进入它的神灵、神域和视觉世界。

### 页面结构

```text
Header

神话
进入不同文明的神话体系，认识其中的神灵、神域与视觉规则。

神话体系列表
中国神话   希腊神话   北欧神话   日本神话   埃及神话
```

视觉规则：

- 视觉优先，保留高质量神话体系封面；
- 卡片展示体系名称、简介和 2～3 个 Visual DNA 关键词；
- 不使用“文明图鉴”作为页面标题；
- 不把卡片做成百科字段表；
- 不在这里展示具体故事正文；
- 每张卡片链接到 `/mythology/{slug}/`。

## 4. `/mythology/{slug}/` 神话体系聚合页

### 页面回答的问题

- 这是哪个神话体系？
- 它的视觉 DNA 是什么？
- 里面有哪些神灵？
- 主要神域和场景在哪里？
- 有哪些相关视觉作品？
- 后续有哪些故事 / 传说可以阅读？

### 推荐结构

```text
Breadcrumb
首页 / 神话 / 中国神话

Immersive Mythology Hero
中国神话
Chinese Mythology
体系简介
[探索相关作品]

Civilization Visual DNA
色彩 / 纹样 / 材质 / 气质

代表神域
World / Scene cards

代表神灵
Character cards

视觉作品
Artwork grid

神话故事（有内容时展示）
MythStory rows
```

### 内容比例

建议视觉 65% / 文字 35%。

图片用于建立体系氛围、展示 Visual DNA 和引导探索；文字用于解释体系关系，不承担长篇故事正文。

## 5. Mythology 与 Artwork 的关系

`Artwork` 是跨实体的视觉作品，`Mythology` 是它所属的神话体系上下文。

```text
Mythology
  ├── Character × N
  ├── World × N
  ├── Scene × N
  ├── Artwork × N
  └── MythStory × N

Artwork
  ├── mythologyId
  ├── worldId?
  ├── characterIds?
  ├── sceneId?
  └── styleId
```

因此：

- `/explore/` 是跨 Mythology 的 Artwork 发现流；
- `/mythology/{slug}/` 是某个 Mythology 的内容聚合页；
- Artwork 可以从 Explore 进入，也可以从 Mythology 详情页进入；
- 同一 Artwork 不需要复制到多个页面，只通过关系查询复用。

## 6. MythStory 的位置

第一阶段不强制新增 Story 页面。

当故事内容达到可用规模后，再增加：

```ts
type MythStory = {
  id: string;
  slug: string;
  mythologyId: string;
  title: string;
  summary: string;
  body: string;
  characterIds: string[];
  worldIds: string[];
  artworkIds?: string[];
  tradition?: string;
  sourceNotes?: string[];
  publishStatus: 'draft' | 'published';
};
```

用户侧名称使用：

```text
MythStory → 故事 / 传说
```

不要使用：

```text
MythStory → 神话
```

因为“神话”已经被 `Mythology` 占用。

## 7. 实施优先级

### P0：当前改造

1. Header：角色 → 神灵；文明图鉴 → 神话；神话链接 `/mythology/`；
2. Footer、搜索、Breadcrumb、SEO 文案同步；
3. `/mythology/` 标题和说明改为神话体系入口；
4. `/explore/` 保持 Artwork 发现流，不改为 Mythology 或 Story 页面；
5. `/mythology/{slug}/` 保留神话体系、神域、神灵、Artwork 聚合职责。

### P1：神话体系增强

1. Mythology 页面补充实体数量和关系入口；
2. 增加神话体系下的作品筛选；
3. 在神灵 / 神域详情页增加所属神话体系入口；
4. 增加更清晰的 canonical、Breadcrumb 和 JSON-LD。

### P2：故事扩展

1. 建立 `MythStory` Content Collection；
2. 在 Mythology 详情页增加“故事 / 传说”模块；
3. 内容足够后再考虑 `/story/` 和 `/story/{slug}/`；
4. Story 与 Character、World、Artwork 建立关系图谱。

## 8. 验收标准

1. 主导航“神话”指向 `/mythology/`；
2. 用户可以理解 `/mythology/` 是神话体系入口，而不是普通文明百科；
3. `/explore/` 仍然是 Artwork 发现流；
4. `/mythology/{slug}/` 能进入该体系的神灵、神域和视觉作品；
5. `MythStory` 没有抢占 Mythology 的名称或主路由；
6. Light / Dark 共享相同信息结构；
7. 所有核心内容保持服务端渲染和可抓取；
8. 页面不出现“文明图鉴 / 神话 / MythStory”三套互相冲突的命名。
