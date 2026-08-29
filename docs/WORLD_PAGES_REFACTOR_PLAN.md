# MythCanvas 世界列表 + 世界详情页重构计划

> 状态：Ready for Implementation  
> 正式公开路径：`/world/` + `/world/{slug}/`  
> 正式领域模型：`World`  
> 本项目为新系统：**不考虑 `/realm/*` 兼容，不保留 Realm 命名，不做旧数据迁移兼容层。**

---

# 0. 重构结论

本次不是 `/realm` 的局部改版，而是将“世界”正式确立为 MythCanvas 的一级核心对象，并一次性统一产品语言、URL、TypeScript 类型、数据库表、外键、Repository、组件与页面目录。

最终对象链：

```text
神话文明 Mythology
  → 世界 World
      → 地标 / 场景 Scene
      → 角色 Character
      → 视觉作品 Artwork
      → AI 创作
```

核心产品定义：

> **文明决定世界属于哪里，World 承载空间和故事，Scene 是世界中可以被进入的地点，Character 生活在世界中，Artwork 是这些对象的真实视觉演绎。**

公开、代码和数据层不再出现 Realm / 神域 / 世界三套并行词汇。

---

# 1. 命名统一：Realm 全量改为 World

## 1.1 正式命名

```text
中文产品名：世界
英文产品名：World
列表 URL：/world/
详情 URL：/world/{slug}/
```

示例：

```text
/world/heavenly-palace/
/world/olympus/
/world/asgard/
/world/takamagahara/
/world/duat/
```

选择单数 `/world/`，与现有 `/character/`、`/mythology/`、`/wallpaper/` 保持一致。

## 1.2 不做旧地址兼容

这是新系统，直接删除：

```text
src/pages/realm/
```

不实现：

- `/realm/*` redirect；
- legacy route；
- canonical 兼容；
- 旧 Realm 数据转换层；
- Realm/World 双命名 API。

验收标准是：**代码库业务语义中不再存在 Realm。**

允许 migration 文件历史文本中保留已经执行过的旧 SQL 记录，但新 schema、运行时代码、测试、文档不得继续引用 Realm。

---

# 2. 数据模型全量重命名

## 2.1 TypeScript

```text
Realm                     → World
realmId                   → worldId
realmIds                  → worldIds
```

`src/lib/content/types.ts`：

```ts
export type World = {
  id: string;
  mythologyId: string;
  slug: string;
  name: string;
  nameEn: string;
  summary: string;
  canonicalDesign: CanonicalDesign;
  heroImage: ImageAsset;
};
```

同步修改：

```text
Scene.realmId             → Scene.worldId
Artwork.realmId           → Artwork.worldId
Character.realmIds        → Character.worldIds
```

## 2.2 数据表

正式 schema 统一：

```text
realms                    → worlds
realm_id                  → world_id
character_realms          → character_worlds
```

关联关系：

```text
worlds.mythology_id
scenes.world_id
artworks.world_id
character_worlds.character_id
character_worlds.world_id
```

由于是新系统，不为旧表创建兼容 View，不保留双写，不做 runtime fallback。

如果现有开发 D1 数据需要重建，优先直接重置本地/测试数据库并重新 seed，而不是引入长期兼容 migration 负担。

## 2.3 Repository

```text
getRealms                 → getWorlds
getRealmBySlug            → getWorldBySlug
getRealmById              → getWorldById
getRealmsForMythology     → getWorldsForMythology
getScenesForRealm         → getScenesForWorld
getCharactersForRealm     → getCharactersForWorld
getArtworksForRealm       → getArtworksForWorld
```

文件：

```text
src/lib/content/repositories/realm.ts
→ src/lib/content/repositories/world.ts
```

## 2.4 组件与页面

```text
src/pages/realm/                       → DELETE
src/pages/world/                       →正式页面
src/components/realm/RealmCard.astro   → src/components/world/WorldCard.astro
```

新组件目录建议：

```text
src/components/world/
  WorldCard.astro
  WorldHero.astro
  WorldIdentity.astro
  WorldLandmarks.astro
  WorldCharacters.astro
  WorldArtworkGallery.astro
  RelatedWorlds.astro
```

---

# 3. 世界模块产品定位

六个一级对象职责必须清晰：

```text
Explore       = 看视觉作品
Mythology     = 看神话文明体系
World         = 进入并探索空间世界
Character     = 探索角色视觉资产
Wallpaper     = 欣赏 / 下载单张作品
Create        = 创建自己的版本
```

World 不是“分类标签页”，也不是“神话百科地点词条”。

用户进入 World 后应该产生：

> **“我进入了一个地方，这个地方还有其他地点、角色和视觉形态可以继续探索。”**

---

# 4. `/world/` 世界列表 UX

## 4.1 目标

列表页定位为 **World Atlas / 神话世界入口**。

页面优先级：

1. 环境视觉；
2. 世界名称；
3. 所属文明；
4. 快速进入；
5. 筛选搜索。

不是资料卡列表。

## 4.2 IA

```text
Header

World Atlas Intro
  WORLDS
  进入神话世界
  一句说明

World Toolbar
  [全部] [中国] [希腊] [北欧] [日本] [埃及]
  Search World

Editorial World Mosaic

Explore CTA
```

## 4.3 文本效果稿

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ 绘神宇宙     首页  探索  角色  世界  AI 创作  文明图鉴          ◯  登录      │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  WORLDS                                                                     │
│  进入神话世界                                                               │
│  从云海天宫到奥林匹斯，每个世界都有自己的空间、角色与视觉规则。              │
│                                                                              │
│  [ 全部 ]  [ 中国 ]  [ 希腊 ]  [ 北欧 ]  [ 日本 ]  [ 埃及 ]        搜索 ⌕  │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ ┌─────────────────────────────────────┐ ┌─────────────────────────────────┐  │
│ │                                     │ │                                 │  │
│ │              三十三重天             │ │             奥林匹斯            │  │
│ │                                     │ │                                 │  │
│ │       云海 / 天门 / 宫阙 / 月华     │ │    神殿 / 云海 / 黄金 / 山巅    │  │
│ │                                     │ │                                 │  │
│ │  中国神话 · Celestial Palace   →    │ │  希腊神话 · Olympus        →    │  │
│ └─────────────────────────────────────┘ └─────────────────────────────────┘  │
│                                                                              │
│ ┌───────────────────────┐ ┌───────────────────────┐ ┌────────────────────┐   │
│ │       阿斯加德        │ │        高天原         │ │       杜阿特       │   │
│ │ 世界树 / 极光 / 巨石  │ │ 月 / 鸟居 / 雾林     │ │ 太阳 / 黑金 / 神舟 │   │
│ │ 北欧神话           →  │ │ 日本神话          →  │ │ 埃及神话        → │   │
│ └───────────────────────┘ └───────────────────────┘ └────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 4.4 World Gallery

不要普通固定三列卡片墙，采用可扩展的 Editorial Mosaic：

```text
第一行：2 张大型世界封面
第二行：3 张中型世界封面
第三行：继续 2 / 3 节奏
```

布局可以用 CSS Grid `span` 根据索引形成稳定节奏，但不能绑定具体 World slug。

世界封面推荐：

```text
16:9 / 3:2
```

Card 信息控制在：

- Mythology；
- World Name；
- English Name；
- 3～4 个世界关键词；
- 进入世界箭头。

禁止放 Canonical anchors、材料字段、大段 Summary、Style badge 堆叠。

---

# 5. `/world/{slug}/` 世界详情最终 IA

```text
01 Immersive World Hero
02 World Identity / 世界印记
03 Landmarks / Scenes
04 Inhabitants / Characters
05 Visual Interpretations / Real Artworks
06 Wallpapers
07 Related Worlds
08 AI Create CTA
```

设计原则：

> **Character 是“看一个人”，World 是“进入一个地方”。**

因此 World Detail 要比 Character Detail 更横向、更沉浸、更少 Surface Card 感。

---

# 6. Section 01 — Immersive World Hero

使用 full bleed 世界场景，不再使用“左文字 + 右图片”的普通详情卡。

## 文本效果稿

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ 绘神宇宙      首页  探索  角色  世界  AI 创作  文明图鉴                      │
│                                                                              │
│                          巨 幅 世 界 场 景                                   │
│                                                                              │
│             云海                    天门                  远方宫阙             │
│                                                                              │
│  中国神话                                                                    │
│  三 十 三 重 天                                                              │
│  Celestial Palace                                                            │
│                                                                              │
│  层叠宫阙悬于云海之上，玉阶、金阙与天门连接不同天境。                       │
│  云海 · 天门 · 宫阙 · 月华                                                   │
│                                                                              │
│  [ 开始探索 ↓ ]                                [ 绘制这个世界 ]              │
└──────────────────────────────────────────────────────────────────────────────┘
```

Hero 只保留：

- Mythology；
- World Name / Name EN；
- 一句 Summary；
- 3～4 个视觉关键词；
- 探索 CTA；
- AI Create CTA。

不在首屏展示字段面板和 Style 选择器。

---

# 7. Section 02 — World Identity / 世界印记

内部仍可使用 `canonicalDesign` 字段名，但公开 UI 不出现 Canonical Design。

```text
WORLD IDENTITY
世界印记

无论如何重新演绎，这些空间锚点始终存在。

01 层叠宫阙     02 云海中轴     03 玉阶天门     04 日月轮
─────────────────────────────────────────────────────────
标志材质  白玉 · 鎏金 · 云雾
空间轮廓  宫殿群围绕中央天门逐层向高空延伸
```

设计成“世界设定页”，使用大字号编号、留白和细分隔线，不做后台配置 Card。

---

# 8. Section 03 — Landmarks / Scenes

这是世界详情最重要的子模块，必须接入：

```text
getScenesForWorld(db, world.id)
```

世界不能只是一张 Hero 图。

## 文本效果稿

```text
LANDMARKS
探索世界

三十三重天不是一张图，而是由多个可以进入的地点组成。

┌────────────────────────────────────────────┐
│                 云 海 天 门                │         01
│                                  进入 →    │
└────────────────────────────────────────────┘

                         02      ┌──────────────────────────────┐
                                 │            月 宫             │
                                 │                     进入 →   │
                                 └──────────────────────────────┘

┌────────────────────────────────────────────┐
│                 凌 霄 宝 殿                │         03
└────────────────────────────────────────────┘
```

采用交替左右的大图章节，形成“逐步深入世界”的滚动节奏。

第一版不做 WebGL / 3D 地图。内容规模足够后再评估 World Map。

---

# 9. Section 04 — Inhabitants / Characters

标题：

```text
INHABITANTS
谁生活在这里
```

数据：

```text
getCharactersForWorld(db, world.id)
```

复用角色重构后的 image-first CharacterCard，但在 World Detail 使用更紧凑规格。

只展示：

- Portrait；
- Name；
- Role。

不要在这里重复 Character Summary / Character DNA。

---

# 10. Section 05 — Visual Interpretations

删除现在所有：

```text
Gradient Orb + Style Name
CSS Filter Style Preview
```

视觉演绎只能来自真实：

```text
getArtworksForWorld(world.id)
```

按真实 `styleId` 聚合。

```text
VISUAL INTERPRETATIONS
同一个世界，不同演绎

[经典神话] [电影感] [神圣] [动漫] [暗黑幻想] [赛博神话]

┌─────────────────────────────┐ ┌─────────────────────────────┐
│         真实作品 A          │ │         真实作品 B          │
└─────────────────────────────┘ └─────────────────────────────┘

没有真实作品的 Style 不制造假图。
```

---

# 11. Section 06 — Wallpapers

与 Visual Interpretations 的职责：

```text
Visual Interpretations = 展示世界视觉可能性
Wallpapers             = 可消费 / 下载的设备适配作品
```

筛选第一版只需要：

```text
[全部] [PC] [Mobile]
```

只展示真实 Artwork / OutputSpec。

禁止复制图片填 Grid，禁止同图套滤镜冒充不同作品。

---

# 12. Section 07 — Related Worlds

数据：

```text
getWorldsForMythology(db, world.mythologyId)
  .filter(item => item.id !== world.id)
```

标题：

```text
MORE WORLDS
继续探索这个文明
```

只有真实 sibling worlds 时展示。

---

# 13. Section 08 — AI Create

CTA：

```text
绘制我的 {world.name}
```

统一 Creator 参数：

```text
/create/?world={world.slug}
```

进入 Creator 后：

- 自动选中当前 World；
- 自动带 Mythology；
- 用户继续选 Scene / Style / Device；
- 不让用户重复寻找刚才的 World。

---

# 14. 响应式

验证：

```text
320 / 375 / 430 / 768 / 1024 / 1440 / 1920
```

Mobile 顺序不变：

```text
Hero
→ World Identity
→ Landmarks
→ Characters
→ Artworks
→ Related Worlds
→ Create
```

要求：

- Hero 不左右分栏；
- Landmark 单列大图；
- 世界环境图不压缩成过小双列卡；
- CTA 可上下排列；
- 无横向滚动。

---

# 15. SEO / GEO

World Detail 必须机器可读地明确：

- World 中文名 / 英文名；
- Mythology；
- Summary；
- Landmarks / Scenes；
- Characters；
- Related Worlds；
- Real Artworks。

Canonical：

```text
https://mythcanvas.space/world/{slug}/
```

Breadcrumb：

```text
首页 → 世界 → {World Name}
```

Structured Data 可以继续使用 `Place`，但代码变量和实体模型必须使用 World。

Sitemap 必须能发现 D1 中动态 World Detail。

---

# 16. 全站引用更新

至少扫描：

```text
src/components/Header.astro
src/components/Footer.astro
src/pages/index.astro
src/pages/explore/**
src/pages/mythology/**
src/pages/character/**
src/pages/wallpaper/**
src/pages/search/**
src/pages/create/**
src/lib/generation/**
src/lib/content/**
src/pages/api/**
tests/**
migrations/**
docs/**
README.md
```

最终业务代码不得再出现：

```text
Realm
realmId
realm_id
realms
character_realms
/realm/
```

对 migration 历史文件是否重写按项目当前初始化策略处理；如果 migration 尚未形成生产历史，建议直接 squash / 重建初始 schema，保持新系统干净。

---

# 17. 实施 Phase

## Phase 1 — Domain Rename（P0）

- `Realm → World`；
- `realms → worlds`；
- `realm_id → world_id`；
- `character_realms → character_worlds`；
- Types / Repository / API / Generation / Tests 全量更新；
- 删除 `src/pages/realm`；
- 新建 `src/pages/world`；
- `RealmCard → WorldCard`。

验收：代码业务层搜索不到 Realm 旧命名。

## Phase 2 — World Index（P0）

- World Atlas Intro；
- Editorial Mosaic；
- Mythology Filter；
- Search；
- Responsive；
- Empty State。

## Phase 3 — World Detail Core（P0）

- Full-bleed Hero；
- World Identity；
- `getScenesForWorld()`；
- Landmark alternating layout；
- Characters；
- 删除假 Style Orb；
- Visual Interpretations 只读真实 Artwork。

## Phase 4 — Artwork / Related / Create（P1）

- Wallpaper device filter；
- Related Worlds；
- Creator world context；
- 真实 Empty State；
- 探索链路完善。

## Phase 5 — SEO / Quality（P1）

- canonical / breadcrumb / sitemap；
- mobile visual regression；
- a11y；
- route / link regression；
- 埋点；
- build / typecheck / tests。

---

# 18. Definition of Done

## Domain

- [ ] 正式领域类型为 `World`；
- [ ] 表为 `worlds`；
- [ ] 外键为 `world_id`；
- [ ] 关联表为 `character_worlds`；
- [ ] Repository 全部使用 World 命名；
- [ ] `/realm` 页面目录不存在；
- [ ] 业务代码无 Realm 双命名兼容层。

## World Index

- [ ] `/world/` 第一视觉是世界环境图；
- [ ] 使用 Editorial Mosaic；
- [ ] 支持文明筛选和搜索；
- [ ] PC / Tablet / Mobile 正常；
- [ ] Empty State 真实。

## World Detail

- [ ] Full-bleed 世界 Hero；
- [ ] World Identity 不是后台字段卡；
- [ ] Scene / Landmark 是核心 Section；
- [ ] Characters 可继续探索；
- [ ] Style Preview 只来自真实 Artwork；
- [ ] 删除 gradient orb / CSS filter 假视觉；
- [ ] Wallpapers 只展示真实作品；
- [ ] Related Worlds 有数据才展示；
- [ ] Create 自动继承当前 World。

## Quality

- [ ] canonical 全部为 `/world/*`；
- [ ] Sitemap 包含 World Detail；
- [ ] 320～1920px 无横向滚动；
- [ ] focus / keyboard / reduced-motion 正常；
- [ ] build / typecheck / tests 全通过。

---

# 19. 最终判断

世界模块必须成为 MythCanvas 的**空间探索中枢**：

```text
文明
 ↓
世界
 ↓
地标 / 场景
 ↓
角色
 ↓
视觉作品
 ↓
重新创造
```

这次重构最重要的不是换一个 URL，而是一次性完成三件事：

1. **Realm 在产品、代码、数据库中彻底统一为 World；**
2. **Scene / Landmark 被提升为 World 的第一核心子实体；**
3. **World 页面只展示真实视觉资产，不制造 Style 假丰富。**

完成后，`World` 才会成为区别于普通壁纸图库和普通 AI 生图站的核心产品对象。
