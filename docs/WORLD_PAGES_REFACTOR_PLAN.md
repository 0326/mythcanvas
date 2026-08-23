# MythCanvas 世界列表 + 世界详情页重构计划

> 状态：Ready for Implementation  
> 当前公开路径：`/realm/` + `/realm/{slug}/`  
> 目标公开路径：`/world/` + `/world/{slug}/`  
> 内部领域模型：继续使用 `Realm`，本次不做无收益的数据表 / TypeScript 全量重命名。

---

# 0. 重构结论

本次不是单纯优化 `/realm` 页面样式，而是同时解决三个问题：

1. **公开产品命名不统一**：导航已经使用「世界」，URL 却暴露内部领域术语 `/realm/`；
2. **世界页面不像“世界探索”**：当前主要是普通 Hero、Canonical Design 文本、Style 占位卡、角色和壁纸 Grid；
3. **已有 Scene / Character / Artwork 数据没有形成世界探索链**：特别是 `getScenesForRealm()` 已存在，但当前 World Detail 完全没有使用。

本次最终统一为：

```text
神话文明 Mythology
  → 世界 World（内部模型仍为 Realm）
      → 地标 / 场景 Scene
      → 角色 Character
      → 视觉作品 Artwork
      → AI 创作
```

公开产品语言：

> **文明决定世界属于哪里，世界承载空间与故事，场景是世界中的地点，角色生活在世界中，Artwork 是这些对象的视觉演绎。**

---

# 1. 命名与 URL 决策

## 1.1 为什么 `/realm/` 不适合作为公开 URL

`Realm` 作为工程领域模型没有问题，但不是大多数用户自然理解和输入的词。

当前已经出现明显不一致：

```text
Header：世界
Footer：神域
Page Title：神域
URL：/realm/
Domain Model：Realm
```

同一个对象出现「世界 / 神域 / Realm」三种公开表达，增加认知成本，也会让后续 SEO、导航、文案和内容组织持续分裂。

---

## 1.2 最终公开命名

统一：

```text
中文一级导航：世界
英文产品词：World
公开 URL：/world/
详情 URL：/world/{slug}/
```

示例：

```text
/world/olympus/
/world/asgard/
/world/takamagahara/
/world/duat/
/world/heavenly-palace/
```

选择 `/world/` 而不是 `/worlds/`，原因：

- 当前核心实体路由均采用单数：`/character/`、`/mythology/`、`/wallpaper/`；
- `/world/{slug}` 与现有 URL 风格一致；
- 简短、直观、易分享；
- 导航文字「世界」与 URL 语义直接对应。

---

## 1.3 `Realm` 内部模型暂时不改

本次**不要**为了 URL 改名而执行：

```text
Realm -> World
realms table -> worlds table
realm_id -> world_id
getRealms -> getWorlds
```

这些属于内部领域实现，当前没有用户价值，且会引入大量数据库 migration、API、生成链路和历史数据修改成本。

本次采用边界映射：

```text
Public UX / URL       Internal Model
-------------------------------------
世界 / World           Realm
/world/                realms table
/world/{slug}/         getRealmBySlug()
地标 / 场景            Scene
```

以后只有当领域模型本身也需要重新定义时，再单独评估内部改名。

---

# 2. `/realm` → `/world` 迁移要求

这是 P0，必须和页面重构一起完成，不能只新建 `/world` 后留下两套可索引页面。

## 2.1 新路由

新增：

```text
src/pages/world/index.astro
src/pages/world/[slug].astro
```

正式页面只存在于 `/world`。

---

## 2.2 旧路由永久重定向

保留兼容入口：

```text
/realm/        -> /world/
/realm/{slug}/ -> /world/{slug}/
```

使用永久重定向：

```text
301 或 308
```

推荐使用轻量 legacy route 页面完成 redirect，避免在 middleware 中持续堆业务路由逻辑。

要求：

- slug 原样保留；
- query string 尽量保留；
- 不形成 redirect chain；
- `/realm/*` 不再渲染实际内容；
- 不允许 `/realm` 与 `/world` 两份重复内容同时返回 200。

---

## 2.3 更新所有站内链接

至少检查并更新：

```text
src/components/Header.astro
src/components/Footer.astro
src/components/realm/RealmCard.astro
src/pages/index.astro
src/pages/explore/**
src/pages/mythology/**
src/pages/character/**
src/pages/wallpaper/**
src/pages/search/**
src/pages/create/**
docs/PRODUCT.md
README.md
```

原则：

> 站内任何新链接都不能继续输出 `/realm/`。

`RealmCard.astro` 文件名可以暂时保留，但默认 href 必须改成 `/world/${realm.slug}/`。

---

## 2.4 SEO / Canonical

新页面 canonical 必须是：

```text
https://mythcanvas.space/world/{slug}/
```

同时更新：

- Breadcrumb JSON-LD；
- OG URL；
- Sitemap；
- 所有 Related Entity links；
- 搜索结果链接。

旧 `/realm/*` 仅做 permanent redirect，不生成独立 canonical 页面。

注意当前项目使用 `@astrojs/sitemap` + `output: server`。执行时需要验证动态 World Detail 是否实际进入 sitemap；如果动态 D1 实体没有被枚举，增加运行时 sitemap 能力或显式动态实体 sitemap，不要假设 Astro 集成已经覆盖 D1 动态详情页。

---

# 3. 当前世界列表页问题

当前 `src/pages/realm/index.astro` 基本结构：

```text
Hero
  → H1 进入神域
  → 一段说明

3-column RealmCard Grid
```

主要问题：

1. 仍像一个普通内容分类列表；
2. 世界视觉没有成为主体；
3. 无文明筛选；
4. 无搜索；
5. 无世界层级感；
6. RealmCard 图像占比和信息层级偏普通卡片；
7. 当前只有少量世界时页面显空，未来世界增加后又缺乏浏览组织能力。

世界列表页需要从“Realm collection”升级成：

> **World Atlas / 神话世界入口。**

---

# 4. `/world/` 世界列表页重构

## 4.1 页面目标

用户进入世界页后，需要快速完成：

1. 被世界级场景视觉吸引；
2. 理解这些世界分别属于哪个神话文明；
3. 快速筛选感兴趣的文明；
4. 进入一个世界继续看地标、角色和作品；
5. 明确世界页与 Explore、Mythology、Character 的职责差异。

职责定义：

```text
Explore       = 看作品
Mythology     = 看文明体系
World         = 探索空间世界
Character     = 探索角色资产
Wallpaper     = 消费单张作品
Create        = 创作
```

---

## 4.2 页面 IA

推荐：

```text
Header

World Atlas Hero
  eyebrow: Worlds
  H1: 进入神话世界
  简短说明

World Toolbar
  [全部] [中国] [希腊] [北欧] [日本] [埃及]
  Search World

World Gallery
  大幅横向世界卡

Explore More CTA
```

Hero 不需要占满首屏，真正主视觉是 World Gallery。

---

## 4.3 World Card 重构

世界对象与 Character Card 不同，必须强调横向环境视觉。

推荐比例：

```text
16:10 / 3:2
```

桌面卡片结构：

```text
┌─────────────────────────────────────┐
│                                     │
│            WORLD IMAGE              │
│                                     │
│ 中国神话                             │
│ 三十三重天                           │
│ Celestial Palace                    │
└─────────────────────────────────────┘
```

默认展示：

- Hero Image；
- Mythology 名称；
- World Name；
- English Name；
- 可选一句非常短 Summary。

不要展示：

- Canonical anchors；
- Materials；
- Style 标签堆积；
- 大量数量 badge；
- 技术词 Realm。

Hover / Focus：

- 图片轻微 scale；
- 标题区域提升可读性；
- 出现「进入世界 →」即可。

---

## 4.4 World Grid

建议：

```text
>= 1400px: 3 columns
900-1399: 2 columns
<900: 1 column
```

世界卡不建议做 4～5 列，因为环境图需要足够宽度才能产生空间感。

如果内容数量仍然只有 5 个，可允许第一张 Featured World 跨两列，但不要把布局做成不可扩展的硬编码拼贴。

---

## 4.5 文明筛选

第一版只保留：

```text
全部
中国神话
希腊神话
北欧神话
日本神话
埃及神话
```

URL 状态：

```text
/world/?mythology=chinese
```

与 Character 页面筛选交互保持一致。

---

## 4.6 搜索

搜索字段：

- 中文名；
- 英文名；
- Summary；
- Mythology 名称。

URL：

```text
/world/?q=奥林匹斯
```

支持与 mythology 参数组合。

---

# 5. 当前世界详情页问题

当前 `src/pages/realm/[slug].astro` 已经具备：

- Realm Hero；
- Canonical Design；
- Style Variants；
- Related Characters；
- Wallpapers；
- Recreate CTA。

但存在几个核心产品问题。

## P0-1：世界详情页不够沉浸

当前 Hero 是一个：

```text
左侧文字 + 右侧图片
```

的普通 Surface Card。

对于 MythCanvas 核心差异化对象“世界”，这种设计更像详情资料卡，而不是进入一个空间。

世界详情应该是全站最强调环境视觉的页面之一。

---

## P0-2：Scene / Landmark 完全缺席

Repository 已经存在：

```text
getScenesForRealm(db, realmId)
```

但当前世界详情完全没有读取 Scene。

这直接导致：

```text
三十三重天
奥林匹斯
阿斯加德
高天原
杜阿特
```

只是一个名字 + 一张 Hero 图，无法继续“进入”这个世界。

Scene 应该成为 World Detail 的第一核心子实体。

---

## P0-3：Style Variant 使用假视觉占位

当前页面遍历所有 styles，然后用：

```text
圆形渐变 orb + Style Name
```

表达所谓视觉形态。

这不是真实视觉作品，也无法让用户理解同一个世界在不同画风下是什么样。

新规则：

> **只展示真实 Artwork 支撑的视觉演绎。**

没有真实 Style Artwork，就不要制造 Style Preview。

---

## P0-4：公开页面暴露过多生成系统术语

当前文案：

```text
Canonical Design
这个世界必须保留什么
Style Variant 可以改变时代、材质与画法……
```

这些更像内部 Prompt / Design System 说明。

对消费端用户应该翻译成世界叙事语言，例如：

```text
世界印记
世界地标
标志材质
视觉演绎
```

内部仍使用 `canonicalDesign` 数据即可。

---

## P1-1：缺少 Related Worlds

当前用户看完一个世界后，只能继续：

```text
Character / Artwork / Create
```

缺少：

```text
同文明其他世界
```

未来一个 Mythology 下出现多个 Realm 后，Related Worlds 是重要探索路径。

---

## P1-2：Create CTA 没有世界上下文

当前：

```text
<a href="/create/">开始绘神</a>
```

用户从某个 World 进入 Creator 后，不应再次手动找同一个世界。

需要把 World / Realm 上下文自动带入 Creator。

---

# 6. `/world/{slug}/` 最终 IA

推荐最终顺序：

```text
1. Immersive World Hero
2. World Overview / 世界印记
3. Landmarks / Scenes
4. Inhabitants / Characters
5. Visual Interpretations / Real Artworks
6. Wallpapers
7. Related Worlds
8. AI Recreate CTA
```

如果真实 Artwork 数量暂时不够，可以合并 5 + 6；但 Scene / Landmarks 不允许再缺失。

---

# 7. Section 1：Immersive World Hero

## 7.1 目标

第一屏需要让用户感觉：

> **“我正在进入这个世界。”**

而不是：

> “我在看一个世界资料卡。”

---

## 7.2 推荐结构

使用 `fullBleed + immersiveHeader`，与角色页形成对象差异：

```text
┌──────────────────────────────────────────────────┐
│                                                  │
│                                                  │
│                 WORLD LANDSCAPE                  │
│                                                  │
│  中国神话                                        │
│  三十三重天                                      │
│  Celestial Palace                                │
│  云海之上的诸神世界……                            │
│                                                  │
│  [探索地标] [绘制这个世界]                       │
│                                                  │
└──────────────────────────────────────────────────┘
```

World 图像占首屏主体。

文本应位于图片安全区，不使用厚重左右分栏卡。

---

## 7.3 Hero 保留

- Mythology；
- World Name；
- Name EN；
- 一句 Summary；
- CTA：探索地标；
- CTA：绘制这个世界。

Hero 不展示：

- Canonical anchors 列表；
- Style Grid；
- Materials 大段文字；
- 多层 badge。

---

# 8. Section 2：World Overview / 世界印记

内部继续读取：

```text
realm.canonicalDesign
```

公开不再直接叫 Canonical Design。

推荐文案：

```text
World Identity
世界印记
```

展示：

- 核心地标 / anchors；
- 标志材质；
- 可选空间轮廓 silhouette；
- 所属文明；
- 代表氛围可从 Mythology Visual DNA 派生。

示例：

```text
三十三重天

世界印记
- 层叠宫阙
- 云海中轴
- 月轮 / 日轮
- 玉阶天门

标志材质
白玉 · 鎏金 · 云雾
```

设计上应更像世界设定摘要，不要像后台字段面板。

---

# 9. Section 3：Landmarks / Scenes

这是本次世界页最重要的新模块。

数据：

```text
getScenesForRealm(db, realm.id)
```

Section：

```text
Landmarks
探索这个世界
```

示例：

```text
三十三重天
  ├── 云海天门
  ├── 月宫
  ├── 玉阶
  └── 天庭主殿
```

当前数据少时，有几个 Scene 就展示几个，不制造假地点。

---

## 9.1 Scene Card

推荐横向大图：

```text
Image
Scene Name
Name EN
Short Summary
```

如果未来增加 Scene Detail Route，可点击进入。

如果 Scene 暂时没有独立公开详情页：

- 第一阶段可以作为 World 内锚点内容展示；
- 不要为了点击性创建空详情页。

---

## 9.2 世界空间感

第一版不要做复杂地图系统。

优先实现：

```text
大幅 Scene 图 + 有序视觉路径
```

未来内容规模足够后，再评估：

- World Map；
- Landmark spatial graph；
- 可交互路线。

不要为了“像世界”首版引入重型 Canvas / WebGL 地图。

---

# 10. Section 4：Inhabitants / Characters

标题推荐：

```text
Inhabitants
这里的角色
```

数据：

```text
getCharactersForRealm(db, realm.id)
```

复用角色重构后的 image-first `CharacterCard`。

世界详情中角色优先展示：

- Portrait；
- Name；
- Role。

不要重新展示 Character Summary / Canonical Design。

如果角色很多：

```text
首屏显示 4～8 个
查看全部角色 → /character/?world={slug}
```

是否增加 `world` 筛选参数可在执行时根据角色页现有筛选架构决定，不要求首个 commit 必须支持。

---

# 11. Section 5：Visual Interpretations

当前假 Style Orb 全部删除。

新的视觉演绎来源必须是：

```text
getArtworksForRealm(realm.id)
```

然后基于真实 Artwork 的 `styleId` 聚合。

示例：

```text
视觉演绎

[经典神话 · 3]
[电影感 · 2]
[神圣 · 1]
```

每一个 Style Preview 必须使用该 Style 下真实 Artwork cover。

如果某 Style 没有真实作品：

- 不展示伪 Preview；
- 可以在 Create CTA 中允许用户生成；
- 不使用 gradient orb；
- 不使用 CSS filter 模拟画风。

---

# 12. Section 6：World Wallpapers

真实 Artwork 列表继续保留，但与 Visual Interpretations 形成明确关系。

第一版过滤建议：

```text
[全部] [PC] [Mobile]
```

设备类型可以基于现有 Artwork / OutputSpec 数据，如果旧 Artwork 没有 OutputSpec，则暂时按宽高比推断。

禁止：

- 为了填 Grid 复制图片；
- 同一张图片冒充多个设备作品；
- 套 CSS filter 冒充 Style。

无作品时显示真实 Empty State：

```text
这个世界暂时还没有可下载的壁纸。
[绘制第一张]
```

---

# 13. Section 7：Related Worlds

数据：

```text
getRealmsForMythology(db, realm.mythologyId)
  .filter(item => item.id !== realm.id)
```

标题：

```text
More Worlds
继续探索这个文明
```

优先显示同 Mythology 的其他 World。

如果只有一个 Realm，则整个 Section 不展示，不制造空模块。

---

# 14. Section 8：AI Recreate

CTA：

```text
绘制我的 {realm.name}
```

进入 Creator 时自动带上：

```text
realmId
mythologyId
```

如果 Creator URL 当前支持 query state，推荐：

```text
/create/?realm={realm.id}
```

如果 Creator 使用 slug，统一使用：

```text
/create/?world={realm.slug}
```

不要同时支持两种 URL 参数。

Creator 内部仍可以映射回 Realm ID。

目标：

```text
World Detail
  → Create
  → 已自动选中当前世界
  → 用户只需选择 Style / Device / Scene
```

---

# 15. 数据层改造

World Detail 页面加载建议调整为：

```ts
const [
  mythology,
  scenes,
  relatedCharacters,
  relatedArtworks,
  siblingWorlds,
  styles,
] = await Promise.all([
  getMythologyById(db, realm.mythologyId),
  getScenesForRealm(db, realm.id),
  getCharactersForRealm(db, realm.id),
  getArtworksForRealm(db, realm.id),
  getRealmsForMythology(db, realm.mythologyId),
  getStyles(db),
]);
```

注意：

- `styles` 只用于解析真实 Artwork 的 Style 元数据；
- 不再 `styles.map()` 生成所有 Style 占位卡；
- `Scene` 是一等展示对象；
- Related Worlds 排除当前 Realm。

---

# 16. 组件拆分建议

不要继续让 `[slug].astro` 单文件承担全部 World UI。

建议新增 / 重构：

```text
src/components/world/
  WorldCard.astro
  WorldHero.astro
  WorldIdentity.astro
  WorldLandmarks.astro
  WorldArtworkGallery.astro
  RelatedWorlds.astro
```

兼容策略：

- 可以把现有 `components/realm/RealmCard.astro` 移动为 `world/WorldCard.astro`；
- 如果改动面过大，也可以第一阶段保留文件名，仅更新公开 UI / href；
- 不强制内部组件命名和数据类型在同一 PR 全面迁移。

优先保证 Public API / URL 正确。

---

# 17. 文案体系统一

公开页面避免以下词直接作为主标题：

```text
Realm
Canonical Design
Style Variant
```

推荐映射：

```text
Realm             -> World / 世界
Canonical Design  -> World Identity / 世界印记
Scene             -> Landmark / 地标 / 场景
Characters        -> Inhabitants / 这里的角色
Style Variants    -> Visual Interpretations / 视觉演绎
```

「神域」可以作为具体内容描述使用，例如：

```text
奥林匹斯是希腊诸神居住的神域。
```

但不再作为一级 IA 的统一产品名。

---

# 18. 响应式要求

World Page 必须验证：

```text
320px
375px
430px
768px
1024px
1440px
1920px
```

## Mobile

页面顺序不改变：

```text
Hero
→ World Identity
→ Landmarks
→ Characters
→ Artworks
→ Related Worlds
→ Create
```

Mobile Hero：

- 不做左右分栏；
- 保证世界视觉仍占足够高度；
- 文案控制在安全区；
- CTA 可上下排列。

Scene / World Card：

- 单列优先；
- 不压缩成过小的双列缩略图。

---

# 19. 无障碍

要求：

- Hero / Scene / Artwork 使用真实 `<img>`；
- alt 描述真实视觉内容；
- 卡片整体有明确可访问名称；
- Filter 使用可读 active state；
- 键盘可操作；
- focus visible；
- 状态不能只靠颜色；
- 不依赖 hover 才能发现核心功能；
- reduced-motion 下关闭不必要的图片 zoom / transition。

---

# 20. SEO / GEO

World Detail 是重要实体页，需要保留机器可读信息。

## 页面必须明确

- World 中文名；
- World 英文名；
- Mythology；
- Summary；
- Landmarks / Scenes；
- Characters；
- Related Worlds；
- Real Artworks。

## Structured Data

现有 `Place` 可以暂时继续使用，但 Breadcrumb 必须改为：

```text
首页
→ 世界 /world/
→ {World Name}
```

同时必须保证：

```text
canonical = /world/{slug}/
```

旧 `/realm/{slug}/` 只 redirect。

---

# 21. 埋点建议

至少预留：

```text
world_impression
world_click
world_filter_change
world_search
world_landmark_click
world_character_click
world_artwork_click
world_related_click
world_create_entry
```

核心观察：

```text
World → Scene CTR
World → Character CTR
World → Artwork CTR
World → Create CTR
Average World Depth
```

用于验证世界是否真的成为探索中枢，而不是孤立详情页。

---

# 22. 不在本次做的事情

明确不做：

- `realms` 数据表整体重命名；
- `Realm` TypeScript 类型全量重命名；
- 世界 3D 地图；
- WebGL 场景浏览；
- 虚构大量没有真实内容的数据；
- 用生成色块代替真实视觉；
- World / Scene 两级复杂编辑后台重写；
- 因路径迁移破坏旧链接。

---

# 23. 实施 Phase

## Phase 1 — URL / Naming Migration（P0）

完成：

- 新增 `/world/`；
- 新增 `/world/{slug}/`；
- `/realm/*` permanent redirect；
- Header「世界」指向 `/world/`；
- Footer 统一「世界」；
- RealmCard 默认链接改 `/world/`；
- Breadcrumb / canonical / internal links 更新；
- 更新 PRODUCT / README 中公开 URL 表述。

验收：

```text
/world/ -> 200
/world/olympus/ -> 200
/realm/ -> permanent redirect /world/
/realm/olympus/ -> permanent redirect /world/olympus/
站内 UI 不再产生新的 /realm/ href
```

---

## Phase 2 — World Index（P0）

完成：

- World Atlas Hero；
- WorldCard image-first 重构；
- Mythology filter；
- Search；
- 3 / 2 / 1 column responsive gallery；
- Empty State；
- URL filter state。

验收：

- 页面第一视觉是世界图而非 UI；
- 5 个现有世界均可访问；
- 筛选 / 搜索可组合；
- 手机无横向滚动。

---

## Phase 3 — World Detail Core（P0）

完成：

- Immersive Hero；
- World Identity；
- 接入 `getScenesForRealm()`；
- Landmarks / Scenes；
- Characters；
- 删除 fake Style Variant orb；
- Visual Interpretations 仅使用真实 Artwork。

验收：

用户进入世界后能清楚看到：

```text
这是哪里
属于什么文明
有哪些地标
有哪些角色
有哪些真实作品
```

---

## Phase 4 — Artwork / Related / Create（P1）

完成：

- Wallpaper device filter；
- Related Worlds；
- Context-aware Create CTA；
- 真实 Empty State；
- Related exploration links。

---

## Phase 5 — SEO / Quality（P1）

完成：

- canonical 回归；
- breadcrumb；
- sitemap 验证；
- redirect tests；
- mobile visual regression；
- a11y；
- route/link regression；
- 埋点。

---

# 24. 推荐文件改造清单

核心：

```text
src/pages/world/index.astro                         NEW
src/pages/world/[slug].astro                       NEW
src/pages/realm/index.astro                        LEGACY REDIRECT
src/pages/realm/[slug].astro                       LEGACY REDIRECT
src/components/Header.astro
src/components/Footer.astro
src/components/realm/RealmCard.astro               UPDATE or MOVE
src/lib/content/repositories/scene.ts               REUSE
src/lib/content/repositories/realm.ts               REUSE
src/lib/content/repositories/artwork.ts             REUSE
src/lib/content/repositories/character.ts           REUSE
```

建议新增：

```text
src/components/world/WorldCard.astro
src/components/world/WorldHero.astro
src/components/world/WorldIdentity.astro
src/components/world/WorldLandmarks.astro
src/components/world/WorldArtworkGallery.astro
src/components/world/RelatedWorlds.astro
```

全站引用检查：

```text
src/pages/index.astro
src/pages/explore/**
src/pages/mythology/**
src/pages/character/**
src/pages/wallpaper/**
src/pages/search/**
src/pages/create/**
docs/PRODUCT.md
README.md
```

---

# 25. Definition of Done

本次重构只有同时满足以下条件才算完成：

## URL / Naming

- [ ] 一级导航统一使用「世界」；
- [ ] 正式 URL 为 `/world/`；
- [ ] Detail 为 `/world/{slug}/`；
- [ ] `/realm/*` 永久跳转；
- [ ] 站内不再生成新的 `/realm/*` 链接；
- [ ] 内部 Realm model 保持兼容。

## World Index

- [ ] 世界卡以环境视觉为主体；
- [ ] 支持 Mythology Filter；
- [ ] 支持 Search；
- [ ] PC / Tablet / Mobile 正常；
- [ ] 空状态真实。

## World Detail

- [ ] Hero 是沉浸式世界视觉；
- [ ] 不再使用普通左右 Surface Hero；
- [ ] 展示 World Identity；
- [ ] Scene / Landmark 成为核心 Section；
- [ ] Characters 可继续探索；
- [ ] Style Preview 只来自真实 Artwork；
- [ ] 删除 gradient orb 假视觉；
- [ ] Wallpapers 只展示真实 Artwork；
- [ ] Related Worlds 有数据才展示；
- [ ] Create 自动继承当前 World。

## Quality

- [ ] canonical 全部指向 `/world/*`；
- [ ] Breadcrumb 使用「世界」；
- [ ] Sitemap 可发现 World Detail；
- [ ] old route redirect tests 通过；
- [ ] 320 / 375 / 430 / 768 / 1024 / 1440 / 1920 验证；
- [ ] 无新增横向滚动；
- [ ] 键盘 / focus / reduced-motion 正常；
- [ ] build / typecheck / tests 全部通过。

---

# 26. 最终产品判断

世界页面不能只是：

```text
世界名
+ 一张图
+ Canonical Design
+ Style 列表
+ 壁纸
```

它应该成为 MythCanvas 的空间探索中枢：

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

因此本次最核心的三个动作是：

1. **公开 `/realm` 正式迁移为 `/world`；**
2. **把 Scene / Landmark 提升为世界详情核心内容；**
3. **彻底删除没有真实 Artwork 支撑的假 Style 视觉。**

完成这三点后，「世界」才会真正成为区别于普通壁纸站和普通 AI 生图站的核心产品对象。
