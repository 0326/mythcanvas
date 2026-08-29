# MythCanvas SEO 优化计划

## 目标

让 MythCanvas 的神话、神域、神灵与壁纸实体页能够被搜索引擎稳定发现、抓取、理解和收录，并逐步覆盖中文与英文的神话实体词、壁纸词和视觉创作长尾词。

核心实体关系：

`Mythology ↔ World ↔ Character ↔ Artwork`

SEO 优化以实体页和图片搜索为主，不通过堆砌关键词破坏页面视觉体验。

## 当前基础

截至 2026-08-30，项目已经具备：

- Astro + Cloudflare SSR
- 独立的 Mythology / World / Character / Wallpaper 路由
- 页面级 title / description / canonical / OpenGraph
- WebSite、Person、Place、CollectionPage、ImageObject、BreadcrumbList 等 JSON-LD
- 服务端输出的 H1、实体摘要、关系与相关内容
- 主图 alt、width、height 和部分 fetchpriority
- robots.txt
- 动态 sitemap index、实体 sitemap、Artwork 分片 sitemap
- 独立 image sitemap 分片
- 集中的 canonical / robots 策略
- Wallpaper 服务端分页（每页 24 条）

P0 收录基础设施已经进入“已实现、待线上验证”状态。当前主要工作是用 Search Console 验证抓取与收录闭环，并继续完善响应式图片、实体事实、Landing Page 和多语言边界。

---

## P0：收录基础设施

目标：确保所有高价值公开实体页可以稳定进入搜索引擎抓取队列，同时阻止低价值页面被索引。

### 1. 动态 Sitemap（已实现）

从 D1 中读取已发布内容，动态输出：

- `/`
- `/explore/`
- `/mythology/`
- `/mythology/{slug}/`
- `/world/`
- `/world/{slug}/`
- `/character/`
- `/character/{slug}/`
- `/wallpaper/`
- `/wallpaper/{slug}/`

Style Landing Page 与独立 Myth Story 路由只有在内容足够丰富、路由真实存在且允许索引时才加入 sitemap。

不再依赖构建期 sitemap 去推断 SSR 动态路由。

实现约束：

- 实体 URL 与 Artwork URL 分开输出
- Artwork 每 1000 条一个 sitemap 分片
- sitemap index 只引用真实存在的分片
- 单次 Worker 请求不读取全部 Artwork

### 2. Image Sitemap（已实现）

在 sitemap 中为具备主图的实体加入 `image:image`：

- mythology hero
- world hero
- character portrait（后续 Canonical hero 进入稳定字段后再纳入）
- artwork 原图

优先保证 Wallpaper 和 Character 图片能被 Google Images 等图片搜索发现。

### 3. Noindex 策略（已实现）

以下页面不应进入自然搜索结果：

- `/admin/*` → `noindex,nofollow`
- `/my/*` → `noindex,nofollow`
- `/login/`、`/register/`、`/password/` → `noindex,follow`
- `/search/` → `noindex,follow`
- 带站内搜索参数的薄内容列表页 → `noindex,follow`

Sitemap 排除不能替代 noindex。

### 4. Canonical 收敛（已实现）

- canonical 统一由 BaseHead 输出
- 搜索、筛选、排序 URL 默认 `noindex,follow`，canonical 到无参数主页面
- Wallpaper 分页 `?page=N` 使用独立、自引用 canonical；第一页收敛到无参数 URL
- 无效与越界分页返回 404
- 删除页面中重复 canonical

### 5. OpenGraph 基线修复（已实现）

- 默认 OG 图片必须指向真实存在的资源
- 后续单独制作 1200×630 品牌分享图

---

## P1：抓取效率、图片性能与搜索意图

### 1. 首页与列表页真实链接

所有主要导航实体必须使用可抓取的 `<a href>`，避免核心实体仅通过 button + JavaScript 跳转。

### 2. 壁纸分页

当前已经实现：

- 每页 24 条
- 生成可抓取分页 URL
- 分页之间使用真实链接
- 避免单页 DOM 与 SSR 数据量无限增长
- 分页 URL 自 canonical，筛选 URL 不参与索引

### 3. 响应式图片

复用 Cloudflare Image Transformations：

- 按组件选择 320 / 480 / 720 / 960 / 1920 等实际交付宽度
- `srcset + sizes`
- 首屏 Hero 明确优先级
- below-fold lazy load
- 首页 Hero 通过 Cloudflare Image Transformations 限制交付尺寸并自动选择格式
- 认证页背景使用 WebP，并写入真实 width / height

目标同时提升图片搜索和 Core Web Vitals。

### 4. SEO Title / Description 模板

建立统一规则：

- 页面只传业务主题
- BaseLayout 统一追加品牌
- 避免重复 `MythCanvas`
- description 与当前神话体系数量、内容状态保持一致

示例：

- `雅典娜 · Athena · 绘神宇宙 MythCanvas`
- `奥林匹斯山 · Olympus · 神域 · 绘神宇宙 MythCanvas`
- `月宫壁纸 · 绘神宇宙 MythCanvas`

### 5. 高价值 Landing Page

只有在内容足够丰富时建立独立可索引页，例如：

- 中国神话壁纸
- 希腊神话壁纸
- 雅典娜壁纸
- 奥林匹斯壁纸
- 手机神话壁纸
- PC 神话壁纸

避免直接索引任意筛选参数组合。

---

## P2：实体 SEO / GEO

### 1. 实体事实块

Character / World / Mythology 页面增加可明确抽取的信息：

- 所属神话
- 神职 / 类型
- 象征物
- 相关神域
- 代表故事
- 来源时期 / 参考来源

视觉文案与事实描述并存。

### 2. Structured Data 深化

在真实数据允许的前提下补充：

- ImageObject `creator`
- `creditText`
- `license`
- `acquireLicensePage`
- Character 的可靠 `sameAs`
- 来源 / 引用关系

不虚构 schema 字段。

### 3. GEO / AI Answer Engine

保证每个实体页首屏或主体中存在一段明确摘要，使模型可以直接回答：

- 这个实体是什么
- 属于哪个神话体系
- 与哪些神域 / 神灵相关
- 页面提供哪些图片或壁纸内容

### 4. 中文 / 英文内容边界

V1 使用单一 `zh-CN` URL 和中文主体内容，在实体名中保留可靠英文名；不创建只有导航被翻译的重复英文页面。

只有在实体摘要、事实块、图片语义和导航都具备完整英文内容后，才新增稳定的语言前缀路由，并同时实现：

- 每个语言版本自 canonical
- 中英文页面双向 `hreflang`
- sitemap 中的语言版本对应关系
- 显式语言切换链接，不依据 IP 强制跳转

---

## 验收指标

### P0 验收

- 动态 sitemap 能输出所有已发布实体页
- sitemap index 按分片引用 Artwork 页面与图片 sitemap
- 单个 sitemap 不超过 50,000 URL / 50 MB，当前内部安全阈值为每片 1000 条 Artwork
- sitemap 中包含主要图片
- robots.txt 正确指向 sitemap
- 登录、注册、搜索、个人中心、后台不被索引
- 页面仅保留一个 canonical
- 默认 OG 图片不存在 404
- `?page=2` 自 canonical 且允许索引，筛选参数保持 `noindex,follow`
- 自动化测试覆盖 XML 转义、分片边界、canonical、private/utility noindex

### 后续监控

接入 Google Search Console 后关注：

- Discovered / Crawled / Indexed 页面数
- Sitemap submitted vs indexed
- Character / World / Wallpaper 索引覆盖率
- Google Images impressions / clicks
- 非品牌关键词 impressions
- Core Web Vitals
- 404 / soft 404 / duplicate canonical

建立上线前基线，并以 28 天滚动窗口比较：

- Sitemap submitted 与有效索引 URL 数量差异
- 各实体类型 Indexed / Published 比例
- 非品牌自然搜索曝光与点击趋势
- 图片搜索曝光、点击与主要查询
- Core Web Vitals 的 Good URL 比例

## 实施顺序

1. P0 收录基础设施
2. P1 内链、分页、响应式图片
3. P1 SEO Landing Pages
4. P2 实体事实与 GEO
5. 持续根据 Search Console 数据调整内容和内链
