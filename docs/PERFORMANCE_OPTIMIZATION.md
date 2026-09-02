# MythCanvas 页面性能优化报告

> 更新日期：2026-08-29  
> 审查范围：`0326/mythcanvas` `main` 分支  
> 基准提交：`a3bb424fbaa5d705b0fae39d4519ef79272c0213`  
> 审查方式：代码级静态性能审查。本文中的瓶颈判断来自当前实现，不等同于线上 Lighthouse / RUM 实测结果；实施后应以真实 Core Web Vitals 与 Cloudflare 指标复核。

> 架构更新（2026-09-02）：本文保留为基准提交的历史性能审查。公共内容页的“SSR + D1 查询优化”建议已被 `docs/STATIC_CONTENT_DYNAMIC_DATA_REFACTOR_PLAN.md` 取代；后续默认将规范内容切换为静态目录和预渲染，D1 查询优化仅适用于用户、生成、投稿、审核和社区内容等动态端点。

## 1. 结论

MythCanvas 当前采用 **Astro 5 + Cloudflare Workers + D1 + R2 + Cloudflare Image Transformations**。前端没有引入 React/Vue 等大规模客户端运行时，因此当前性能重点不在 JavaScript 包体，而在以下三条链路：

1. **SSR + D1 数据查询**：部分公共内容页请求需要多次 D1 查询，角色详情页还在首屏关键路径同步写入点击计数。
2. **图片加载与 R2 传输**：部分页面已经使用 Cloudflare 图片变换，但角色作品网格、Hero 等仍可能直接加载原图；`/media/*` 当前会先把 R2 对象完整读入 Worker 内存再返回。
3. **字体与全局 CSS**：两套中文字体通过 jsDelivr CSS `@import` 全局加载，认证页样式也被全站引入，存在可避免的首屏阻塞和无效 CSS。

建议按 **P0 → P1 → P2** 三个阶段推进。当前 P0 优先级更新为公共内容静态化、R2 流式输出和图片尺寸统一；本文原角色页 D1 查询重构仅用于说明旧实现的额度放大原因，不再是目标公共读取路径。

---

## 2. 当前性能架构

当前 `astro.config.mjs` 使用：

```js
output: "server"
```

因此默认页面运行在 Cloudflare Workers SSR 模式。公共页面中的内容数据主要从 D1 查询，作品媒体通过 `/media/*` 从 R2 读取，并在部分页面通过 `/cdn-cgi/image/...` 使用 Cloudflare Image Transformations。

当前主要页面可以粗分为：

| 页面类型 | 典型页面 | 当前特点 |
| --- | --- | --- |
| 公共内容页 | `/`、`/explore/`、`/character/*`、`/mythology/*`、`/world/*`、`/wallpaper/*` | SSR + D1，适合边缘缓存 |
| 私有页面 | `/my/*`、`/admin/*` | 依赖用户态，不应公共缓存 |
| API | `/api/*` | 动态请求，不应页面级缓存 |
| 静态法律页 | `/privacy`、`/terms`、`/copyright`、`/404` | 无必要每次 SSR |

---

## 3. P0：优先处理

### P0-1 角色详情页 D1 查询链路过重（历史诊断，目标为移除公共 D1 读取）

**相关文件：**

- `src/pages/character/[slug].astro`
- `src/lib/content/repositories/character.ts`

角色详情页当前请求链路大致为：

```text
getCharacterBySlug
    ↓
await incrementCharacterView
    ↓
Promise.all
 ├─ getMythologyById
 ├─ getArtworksForCharacter
 ├─ getWorlds
 ├─ getCharacterNames
 ├─ getCharacters
 └─ getMythologies
```

其中存在两个明显问题。

#### 1. 点击计数同步阻塞 SSR

当前页面在返回 HTML 前执行：

```ts
await incrementCharacterView(db, character.id);
```

这意味着一次 D1 `UPDATE` 写操作处在 TTFB 关键路径。点击计数属于分析/热度数据，不应阻塞用户看到页面。

**建议：**

- 优先使用 Cloudflare `waitUntil()` 将计数写入移出响应关键路径；
- 或改为前端 `sendBeacon` / 独立事件接口；
- 热度不要求绝对实时，可进一步批量聚合后写入。

#### 2. Related Characters 依赖全量数据

当前为了计算相关推荐，会读取：

- 所有 worlds；
- 所有 characters；
- 所有 mythologies。

然后在应用层筛选同神域、同神话角色并截取前 6 个。

更合理的方式是直接在 D1 中查询最终需要的数据，例如：

```sql
SELECT ...
FROM characters c
LEFT JOIN character_worlds cw ON cw.character_id = c.id
WHERE c.id != ?
  AND c.publish_status = 'published'
ORDER BY
  CASE WHEN cw.world_id IN (...) THEN 0 ELSE 1 END,
  CASE WHEN c.mythology_id = ? THEN 0 ELSE 1 END,
  c.click_count DESC
LIMIT 6;
```

或者拆成“同神域 → 同神话 → fallback”三组有限查询。

#### 3. `getCharacters()` DB 分支没有真正分页

`pageClause()` 虽然定义了 `limit/offset`，但当前 `getCharacters()` 的 D1 SQL 没有使用 `LIMIT/OFFSET`，会读取全部角色，之后再批量加载所有 `character_worlds`。

随着角色数量增加，这会成为线性增长瓶颈。

以下 SQL 优化只适用于尚未切换的兼容路径。最终目标以静态目录方案为准：角色详情、关系和推荐全部来自构建期索引，每个公共请求的 D1 读取数为 0。

**兼容期目标：**

- 通用 `getCharacters()` 在 SQL 层真正分页；
- 页面只查询需要的数据；
- 角色详情页首屏 D1 请求数量控制在约 3～4 组有限查询内；
- 点击计数不再影响 TTFB。

---

### P0-2 `/media/*` 改为 R2 流式输出

**相关文件：** `src/pages/media/[...key].ts`

当前实现：

```ts
const bytes = new Uint8Array(await object.arrayBuffer());
return new Response(bytes, { status: 200, headers });
```

这会在响应前将整个 R2 对象读取到 Worker 内存。对壁纸站来说，图片可能达到数 MB，未命中边缘缓存时会造成：

- 首字节响应延后；
- Worker 内存占用随图片大小增加；
- Cloudflare Image Transformations 回源 `/media/*` 时也会经过这条链路。

**建议：**

生产环境直接流式透传 R2 Body：

```ts
return new Response(object.body, { status: 200, headers });
```

如果本地 Miniflare 对 R2 Stream 兼容性仍有问题，可保留：

```text
dev/local   → arrayBuffer fallback
production  → streaming
```

同时保留当前：

```http
Cache-Control: public, max-age=31536000, immutable
ETag: ...
```

**验收：**

- 大图片请求不再完整缓冲后返回；
- Worker 内存峰值明显下降；
- `/media/*` TTFB 在未命中缓存场景降低。

---

### P0-3 角色作品 Grid 不应直接加载原图

**相关文件：**

- `src/components/character/CharacterArtworkGrid.astro`
- `src/lib/media/cloudflare-images.ts`

Explore 已经使用 Cloudflare Image Transformations，根据卡片类型生成 720 / 960 / 1440 等不同尺寸，方向是正确的。

但角色作品 Grid 当前仍使用：

```astro
<img src={card.image.src} ... loading="lazy" />
```

`loading="lazy"` 只解决加载时机，不解决下载尺寸。如果原图是 2K/4K 壁纸，用户滚动到卡片时仍会下载大图。

**建议建立统一图片规格：**

| 场景 | 建议输出宽度 |
| --- | ---: |
| 小型推荐卡 | 480～640 px |
| Explore Tile | 640～720 px |
| Character Grid | 640～960 px |
| Featured Side | 960 px |
| Desktop Hero | 1600～1920 px |
| Mobile Hero | 828～1080 px |
| Lightbox | 1600～2560 px |
| Download | 原图 |

所有非原图下载场景统一走 `cloudflareImageUrl()`。

进一步增加响应式图片：

```html
srcset="... 640w, ... 960w, ... 1440w"
sizes="..."
```

**验收：**

- 列表和卡片不请求原始 2K/4K 壁纸；
- 页面总图片传输量显著下降；
- 桌面和手机根据 viewport 获取不同尺寸。

---

### P0-4 首页 Light / Dark Hero 避免双下载

**相关文件：** `src/pages/index.astro`

首页当前同时渲染两张 Hero：

```astro
<img data-hero-light src="..." />
<img data-hero-dark src="..." />
```

主题只通过 CSS `opacity` 切换。浏览器不会因为 `opacity: 0` 自动放弃网络请求，因此 Light / Dark 两张大图都有进入加载队列的可能。

**建议：**

- SSR 只给当前主题 Hero 设置真实 `src`；
- 另一个主题图片只保存到 `data-src`；
- 用户切换主题时再设置 `src`；
- 当前主题首屏图片使用 `fetchpriority="high"`；
- Hero 同样使用 Cloudflare Image Transformations 输出 viewport 需要的尺寸。

如果服务端无法可靠知道 localStorage 主题，可优先使用 `prefers-color-scheme` + `<picture media>` 让浏览器选择资源，而不是两个 `<img>` 同时带 `src`。

---

## 4. P1：高收益优化

### P1-1 Explore 查询去除 waterfall

**相关文件：** `src/pages/explore/index.astro`

当前：

```ts
const [mythologies, styles, worlds, characters] = await Promise.all([...]);
const approvedArtworks = await getArtworks(...);
```

`getArtworks()` 并不依赖前面四个查询，可以一起并行：

```ts
const [mythologies, styles, worlds, characters, approvedArtworks] = await Promise.all([...]);
```

更进一步，Explore 不应为了作品卡片名称映射而读取全量 characters/worlds。

建议：

1. 先取首屏 artworks；
2. 只批量查询作品实际涉及的 character/world IDs；
3. 或直接在 artwork 查询中 JOIN 出展示所需名称。

---

### P1-2 Explore 首屏由 100 件缩减为 24～36 件

当前 Explore 使用：

```ts
limit: 100
```

这会一次生成大量 HTML 卡片，并在滚动后触发更多图片请求。

**建议：**

- Desktop：首屏 24～30；
- Mobile：首屏 20～24；
- 使用“加载更多”或分页；
- 后续如果需要无限滚动，再增加 IntersectionObserver。

对于搜索引擎需要发现的作品，可继续通过 sitemap / 独立作品 URL 覆盖，不需要在 Explore 第一页一次暴露 100 条。

---

### P1-3 中文字体改为 self-host + subset

**相关文件：**

- `src/styles/fonts.css`
- `src/components/BaseHead.astro`

当前两套字体通过：

```css
@import url("https://cdn.jsdelivr.net/...source-han-serif...");
@import url("https://cdn.jsdelivr.net/...lxgw-wenkai...");
```

加载链路为：

```text
HTML
 → global.css
 → fonts.css
 → jsDelivr font.css
 → font file
```

这是典型的串行字体发现链路。

**建议：**

- 将网站实际使用字体转为本地 WOFF2；
- 中文字体按常用字符 / 页面场景 subset；
- 使用 `font-display: swap`；
- 仅对首屏真正需要的 display font preload；
- 文学正文使用的字体不需要在所有页面 preload。

首页标题字符很少，可以做独立极小 subset。

**注意：** 字体许可证与保留声明需要继续符合 Source Han Serif / LXGW WenKai 原项目要求。

---

### P1-4 `auth-pages.css` 从全局样式中拆出

**相关文件：** `src/styles/global.css`

当前：

```css
@import "./auth-pages.css";
```

因此所有页面都会包含认证页面样式，即使用户访问首页、Explore、角色或神话页面。

**建议：**

- 从 `global.css` 移除；
- 只在 `login.astro`、`register.astro`、`password.astro` 引入。

这是简单、低风险、应顺手处理的优化。

---

### P1-5 公共 SSR 页面增加 Cloudflare Edge Cache

当前 `output: "server"` 并不意味着所有页面都必须每次重新执行 D1 查询。

建议分层：

#### 可直接静态化

```text
/privacy
/terms
/copyright
/404
```

使用 `prerender = true`。

#### 公共内容 SSR + Edge Cache

```text
/
/explore/
/character/*
/mythology/*
/world/*
/wallpaper/*
```

建议使用类似：

```http
Cache-Control: public, s-maxage=300, stale-while-revalidate=86400
```

具体 TTL 可按内容更新频率调整。

#### 不缓存

```text
/my/*
/admin/*
/api/*
认证页面用户态响应
```

内容发布/审核通过时，应 purge 对应 URL 或使用版本化缓存键，避免内容长期陈旧。

---

## 5. P2：持续优化

### P2-1 Mythology 长故事使用 `content-visibility`

**相关文件：** `src/components/mythology/MythologyStoryReader.astro`

神话页会 SSR 全部卷、故事、正文块和来源。图片已有 `loading="lazy"`，但首屏之外的大量 DOM 仍参与样式和布局计算。

适合增加：

```css
.story-entry {
  content-visibility: auto;
  contain-intrinsic-size: 1200px;
}
```

它不会移除 SSR HTML，也不会破坏 SEO 内容本身，但能减少长页面首屏外的 layout/paint 成本。

需要重点回归：

- 锚点跳转；
- sticky 目录；
- 浏览器查找文本；
- 实际 intrinsic size 是否造成明显滚动条跳变。

---

### P2-2 Header `/api/user` 请求按需优化

**相关文件：**

- `src/components/Header.astro`
- `src/pages/api/user.ts`

当前每个页面加载后都会执行：

```js
fetch('/api/user')
```

匿名请求服务端开销不高，但仍是额外 HTTP round trip。

这个问题优先级低于 D1 和图片，不建议先做复杂 SSR 用户态注入，否则可能破坏公共缓存。

后续可考虑：

- 仅存在 session cookie 时请求；
- 用户态入口空闲时请求；
- `requestIdleCallback` / 延迟到首屏稳定后；
- 保持公共页面 HTML 与用户态解耦，以利于 Edge Cache。

---

### P2-3 降低移动端高成本视觉效果

当前站点使用较多：

- `backdrop-filter: blur(...)`；
- 大面积 radial-gradient；
- `filter: blur(...)`；
- `drop-shadow`；
- 无限 shimmer / breathe animation；
- 大图 transform 动画。

这些效果符合 MythCanvas 视觉定位，不建议完全移除，但可以针对移动设备降低成本：

```css
@media (max-width: 820px) {
  /* 减少 blur 半径、阴影层数和持续动画 */
}
```

当前已有 `prefers-reduced-motion`，应继续保留。

---

## 6. 数据库层补充建议

随着角色、作品数量增长，需要重点关注索引是否覆盖实际查询组合。

建议根据当前 SQL 和 D1 `EXPLAIN QUERY PLAN` 检查：

```text
characters(slug, publish_status)
characters(mythology_id, publish_status, click_count)
character_worlds(world_id, character_id)
character_worlds(character_id, world_id)
artworks(publish_status, review_status, mythology_id)
artworks(publish_status, review_status, style_id)
artworks(published_at)
artwork_characters(character_id, artwork_id)
```

特别注意：

- 联合主键 `(artwork_id, character_id)` 不等价于 `character_id` 开头的索引；
- 联合主键 `(character_id, world_id)` 对反向按 `world_id` 查询帮助有限；
- Explore 的推荐排序表达式 `(favorite_count * 3 + download_count)` 很难直接利用普通索引，数据增长后可考虑预计算 ranking score。

不要仅凭索引数量判断性能，应基于线上实际 SQL 执行计划决定新增索引。

---

## 7. 建议的实施顺序

### 第一批：P0

1. Character 详情页 D1 查询重构；
2. `click_count` 从 SSR 关键路径移除；
3. `/media/*` 生产环境改为 R2 streaming；
4. Character Grid 全面接入 Cloudflare Image Transformations；
5. 首页 Light / Dark Hero 按需加载。

### 第二批：P1

6. Explore 查询并行化；
7. Explore 首屏改为 24～36 件 + Load More；
8. Explore 去掉全量 Characters / Worlds 查询；
9. 字体 self-host + subset；
10. `auth-pages.css` 从 global 拆出；
11. 公共页面 Edge Cache + 静态法律页 prerender。

### 第三批：P2

12. Mythology `content-visibility`；
13. 全站响应式 `srcset/sizes`；
14. 移动端 blur / backdrop-filter / animation 降级；
15. Header `/api/user` 请求按需优化。

---

## 8. 性能目标与验收指标

建议上线前后统一采集以下指标，避免只凭 Lighthouse 单次成绩判断。

### Core Web Vitals

目标按 Google “Good” 标准控制：

| 指标 | 建议目标 |
| --- | ---: |
| LCP | ≤ 2.5s |
| INP | ≤ 200ms |
| CLS | ≤ 0.1 |

重点观察移动端 P75。

### 服务端指标

建议在 Cloudflare Analytics / Workers Analytics 中监控：

| 指标 | 目标方向 |
| --- | --- |
| HTML TTFB P50/P75/P95 | 持续下降 |
| Worker CPU Time | 持续下降 |
| Worker Memory / 大媒体请求内存 | R2 streaming 后明显下降 |
| D1 query count / request | 页面级下降 |
| D1 query duration | 保持稳定，避免随数据规模线性增长 |
| Edge Cache hit ratio | 公共内容页持续提高 |

### 网络指标

重点记录：

- 首页首次加载总传输量；
- 首页 Hero 实际下载图片数量；
- Explore 首屏图片传输量；
- Character 首屏与滚动后图片传输量；
- 字体请求数 / 字体总大小；
- 首屏请求数量。

---

## 9. 推荐增加性能门禁

当前 CI 主要覆盖 build / typecheck / test。建议逐步加入性能回归检查，但不要一开始设置过于严格的绝对 Lighthouse 分数门禁。

可以分两阶段：

### 阶段一：静态预算

例如：

```text
首屏 JS gzip       < 100 KB
关键 CSS gzip      < 50 KB
首屏非 Hero 图片   禁止原图 URL
单张 Grid 图片      <= 960px 输出
字体资源总量        设置明确预算
```

### 阶段二：Lighthouse CI

对以下页面做固定环境测试：

```text
/
/explore/
/character/<固定测试角色>/
/mythology/chinese/
```

重点检查趋势，而不是追求单次 100 分。

---

## 10. 最终建议

如果只做三件事，优先级应是：

1. **角色详情页 D1 查询重构**；
2. **R2 图片流式输出**；
3. **所有卡片/列表图片统一使用 Cloudflare Image Transformations**。

这三项直接优化服务端 TTFB、边缘 Worker 资源和最大网络载荷，是当前 MythCanvas 性能收益最高的架构级改造。

在此基础上，再推进 Edge Cache、字体 self-host、Explore 分页和长页面渲染优化，可以逐步形成适合图片内容站的稳定性能基线。
