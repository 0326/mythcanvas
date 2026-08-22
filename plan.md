# MythCanvas 开发计划

> **绘神宇宙 MythCanvas — 用 AI 重现神话世界**
>
> 本文档用于统一产品、UX、前端、后端、内容与 AI 开发节奏，从当前状态持续推进到 **Website V1 功能完整、可正式运营**。

## 0. 状态说明

- ✅ 已完成：代码已经进入 `main`，具备可运行实现
- 🟡 已具备骨架：核心边界已实现，但仍需接真实数据/服务或补齐体验
- ⬜ 待开发
- 🔒 外部配置：需要 Cloudflare / AI Provider / 域名等账号侧配置

优先级：

- **P0**：上线前必须完成，影响主链路可用性
- **P1**：Website V1 完整产品能力
- **P2**：上线后增强能力，不阻塞 V1

---

# 1. Website V1 产品目标

完整用户闭环：

```text
发现神话视觉
  → 按文明 / 神域 / 角色 / 风格探索
  → 查看 Artwork / 壁纸详情
  → 下载 / 收藏
  → AI「绘神」生成自己的版本
  → 继续微调 / 生成变体
  → 保存到“我的宇宙”
  → 分享 / 回访
```

完整内容闭环：

```text
内容录入 / AI 生成
  → 审核
  → 写入 D1 + R2
  → 发布为 Artwork
  → 进入 Explore / Entity / Search / SEO Sitemap
  → 用户消费与互动
  → 数据反馈推荐
```

Website V1 完成时必须同时满足：

1. 用户主链路可真实运行，不依赖 Mock 数据或 Mock AI；
2. 正式 Artwork 从 D1/R2 读取；
3. AI 生成结果可持久化、审核、收藏、下载；
4. 搜索、推荐、SEO/GEO、登录收藏完整；
5. Light / Dark、桌面 / 移动、可访问性和性能达到正式产品标准；
6. 具备最小内容运营、监控、安全和版权治理能力。

---

# 2. 当前已完成

## 2.1 产品与设计系统 ✅

- ✅ 产品定位：神话视觉探索 + AI 个性化创作
- ✅ 品牌：绘神宇宙 / MythCanvas
- ✅ Slogan：用 AI 重现神话世界
- ✅ 产品模型：`Mythology → Realm → Character → Scene → Artwork`
- ✅ Civilization Visual DNA
- ✅ Character / Realm Canonical Design
- ✅ Style Variant 独立于 Theme
- ✅ 全站统一 MythCanvas 结构
- ✅ Light：**天宫鎏金**
- ✅ Dark：**月渺仙阙**
- ✅ 双主题 Semantic Design Token
- ✅ 首屏 no-flash Theme bootstrap
- ✅ 用户主题偏好持久化
- ✅ UX / 产品规范：`docs/PRODUCT.md`

核心原则：

> **文化决定“是谁”，画风决定“怎么画”，主题决定“怎么展示”。**

## 2.2 Web 前台基础 ✅

- ✅ Astro 5 + TypeScript
- ✅ Cloudflare Workers Runtime
- ✅ BaseLayout / Header / Footer
- ✅ Home
- ✅ Explore
- ✅ Civilization / Type / Style 筛选
- ✅ Mythology 详情路由
- ✅ Realm 详情路由
- ✅ Character 详情路由
- ✅ Wallpaper / Artwork 详情路由
- ✅ Device Preview
- ✅ AI「绘神」Guided Creator UX
- ✅ 桌面 / 移动基础响应式
- ✅ 移除 Astro Starter Blog / About / RSS 示例

## 2.3 领域模型与 Seed ✅

- ✅ `Mythology`
- ✅ `Realm`
- ✅ `Character`
- ✅ `Artwork`
- ✅ `VisualDNA`
- ✅ `CanonicalDesign`
- ✅ `Style`
- ✅ 首发 5 个文明 Seed
  - 中国神话
  - 希腊神话
  - 北欧神话
  - 日本神话
  - 埃及神话

## 2.4 AI 生成后端骨架 ✅

- ✅ `POST /api/generate`
- ✅ `GET /api/generation/[id]`
- ✅ Guided request 类型与校验
- ✅ 根据 Visual DNA 自动补充文明约束
- ✅ 根据 Canonical Design 自动补充角色 / 神域身份锚点
- ✅ Provider-neutral Prompt composer
- ✅ IP guardrail Prompt
- ✅ `mock` Provider
- ✅ `http` Provider Adapter
- ✅ 浏览器不持有模型密钥
- ✅ Creator 已调用真实 Worker API，而非前端假 Loading

## 2.5 Cloudflare 数据边界 ✅ / 🟡

- ✅ D1 Schema Migration
- ✅ D1 Core Seed Migration
- ✅ Generation Repository
- ✅ R2 Generated Artwork Persistence Adapter
- ✅ `/media/*` R2 Delivery Route
- ✅ immutable cache / ETag
- ✅ 无 D1/R2 时可降级运行
- 🟡 当前生产环境尚未绑定真实 D1 / R2
- 🟡 正式 Artwork 前台读取仍主要来自 typed seed

## 2.6 工程体系 ✅

- ✅ `AGENTS.md`
- ✅ `agent.md`
- ✅ MythCanvas repo-local Skills
- ✅ `docs/ARCHITECTURE.md`
- ✅ `docs/CLOUDFLARE_SETUP.md`
- ✅ GitHub Actions CI Build
- ✅ push main 自动部署 Cloudflare Workflow

---

# 3. Milestone 1 — 生产基础设施接通

**优先级：P0**

目标：让现有代码从“可模拟运行”切换为“真实云端运行”。

## 3.1 Cloudflare D1 🔒

- ⬜ 创建 production D1 database
- ⬜ 将 `DB` binding 写入 `wrangler.json`
- ⬜ 执行 `0001_initial.sql`
- ⬜ 执行 `0002_seed_core.sql`
- ⬜ 验证 production / local schema 一致
- ⬜ 增加后续 migration 版本管理规范
- ⬜ CI 增加 migration syntax / dry-run 检查

**DoD**：线上 `/api/generate` 可真实写入 / 查询 generation job。

## 3.2 Cloudflare R2 🔒

- ⬜ 创建 production R2 bucket
- ⬜ 将 `ARTWORK_BUCKET` binding 写入 `wrangler.json`
- ⬜ 验证生成图真实写入 R2
- ⬜ 验证 `/media/*` 正确读取
- ⬜ 设置图片缓存策略
- ⬜ 确定原图 / thumbnail / preview / OG 的 Key 规范
- ⬜ 制定删除与归档策略

推荐 Key：

```text
artworks/original/<yyyy>/<mm>/<artwork-id>.<ext>
artworks/preview/<artwork-id>.<ext>
generated/<yyyy>/<mm>/<generation-id>.<ext>
og/<entity-type>/<entity-id>.<ext>
```

## 3.3 正式图片生成 Provider 🔒

- ⬜ 确定首发正式模型 / 网关
- ⬜ 配置 Provider endpoint
- ⬜ Secret 进入 Cloudflare Secret
- ⬜ 验证 9:16 / 16:9 输出
- ⬜ 验证中文神话 Prompt 效果
- ⬜ 验证人物与场景两类生成稳定性
- ⬜ Provider timeout / retry / error mapping
- ⬜ 成本 metadata 记录
- ⬜ 模型版本记录

**DoD**：线上 Creator 可以生成一张真实图片并持久化至 R2 + D1。

---

# 4. Milestone 2 — 正式内容数据层与 Artwork Pipeline

**优先级：P0**

目标：前台不再依赖 `src/data/seed.ts` 作为正式内容源。

## 4.1 完善 D1 内容 Schema

- ⬜ Mythology 表补齐 SEO / publish 字段
- ⬜ Realm 表补齐 Canonical Design / Hero / publish 字段
- ⬜ Character 表补齐 Canonical Design / relations / publish 字段
- ⬜ Scene 实体正式建模
- ⬜ Style 表正式建模
- ⬜ Artwork 表补齐：
  - title / slug
  - content type
  - mythology / realm / character relations
  - style / mood
  - image metadata
  - width / height / ratio / format / size
  - source / creator
  - license
  - AI model
  - prompt metadata
  - review status
  - publish status
  - created / updated / published time
- ⬜ Artwork 多角色关系表
- ⬜ Artwork Tag / Mood 关系
- ⬜ Entity relation 查询索引

## 4.2 Repository / Service Layer

- ⬜ `MythologyRepository`
- ⬜ `RealmRepository`
- ⬜ `CharacterRepository`
- ⬜ `ArtworkRepository`
- ⬜ `SceneRepository`
- ⬜ `StyleRepository`
- ⬜ 列表分页
- ⬜ relation 查询
- ⬜ published-only 查询
- ⬜ Seed fallback 仅保留 dev/test

原则：页面组件不直接写 D1 SQL。

## 4.3 前台迁移到 D1/R2

- ⬜ Home 数据从 Repository 读取
- ⬜ Explore 从 D1 读取
- ⬜ Mythology Detail 从 D1 读取
- ⬜ Realm Detail 从 D1 读取
- ⬜ Character Detail 从 D1 读取
- ⬜ Artwork Detail 从 D1 读取
- ⬜ Related Artwork 从 relation query 读取
- ⬜ 所有正式图片切换 R2 / delivery URL
- ⬜ 移除 production placeholder

## 4.4 正式视觉资产导入

首发最低内容量目标：

- ⬜ 5 个 Mythology
- ⬜ 15～20 个 Realm / Scene
- ⬜ 30～40 个 Character
- ⬜ 300～500 个正式 Artwork

推荐比例：

- 40% 场景
- 30% 角色
- 15% 神兽 / 巨物
- 15% 建筑 / 遗迹

**DoD**：生产站所有主页面均来自 D1/R2，无 Astro Starter / placeholder 资产。

---

# 5. Milestone 3 — AI「绘神」生产级闭环

**优先级：P0**

## 5.1 Generation 状态机

- ⬜ `queued`
- ⬜ `generating`
- ⬜ `succeeded`
- ⬜ `failed`
- ⬜ `moderated`
- ⬜ `published`
- ⬜ 生成状态轮询 / 查询
- ⬜ 超时状态
- ⬜ 可重试错误与不可重试错误区分

## 5.2 输入审核与安全

- ⬜ 用户自由描述 moderation
- ⬜ 禁止复刻现代影视 / 动漫 / 游戏具体商业 IP 设计
- ⬜ NSFW / 暴力 / 非法内容规则
- ⬜ Provider moderation error 标准化
- ⬜ 审核失败 UX
- ⬜ 审核日志

## 5.3 配额与 Rate Limit

- ⬜ 匿名用户限额
- ⬜ 登录用户每日额度
- ⬜ IP / session rate limit
- ⬜ 防刷 / 防重复提交
- ⬜ Provider 成本保护
- ⬜ 429 UX

## 5.4 Creator 完整交互

- ✅ Character / Realm 起点
- ✅ Style
- ✅ Scene
- ✅ Composition
- ✅ Optional description
- ⬜ 更多视觉参数：
  - 时间 / 天气
  - 光线
  - 色调
  - 镜头距离
  - 角色气质
  - 服装方向
- ⬜ Advanced 设置折叠面板
- ⬜ 生成进度真实状态
- ⬜ 失败重试
- ⬜ 再绘一次
- ⬜ 创建变体
- ⬜ 快捷微调：
  - 更史诗
  - 更梦幻
  - 更写实
  - 更明亮
  - 拉远镜头
  - 强化神光
- ⬜ 用户生成历史
- ⬜ 生成结果下载
- ⬜ 生成结果收藏
- ⬜ 生成结果申请公开 / 发布

## 5.5 Prompt / 模型治理

- ⬜ Prompt template version
- ⬜ Visual DNA version
- ⬜ Canonical Design version
- ⬜ Provider / model version
- ⬜ generation lineage
- ⬜ Prompt 实验可回溯
- ⬜ Character consistency 基础评估样例
- ⬜ Realm consistency 基础评估样例

**DoD**：用户可稳定完成“选对象 → 生成 → 微调 → 下载 / 收藏”的真实闭环。

---

# 6. Milestone 4 — 内容审核与发布工作流

**优先级：P0 / P1**

目标：让 AI 生成内容真正进入公开内容池，同时保证质量和版权边界。

## 6.1 Artwork 状态

- ⬜ draft
- ⬜ pending_review
- ⬜ approved
- ⬜ published
- ⬜ rejected
- ⬜ hidden
- ⬜ archived

## 6.2 最小运营后台

P0 可先做内部受保护页面，不追求复杂 CMS。

- ⬜ Artwork 列表
- ⬜ Generation 列表
- ⬜ 预览
- ⬜ 审核通过 / 拒绝
- ⬜ 编辑 Title / Alt / Entity relations
- ⬜ 修改 Style / Mood
- ⬜ License / Source 校验
- ⬜ Publish / Unpublish
- ⬜ Featured 标记
- ⬜ Homepage 推荐排序
- ⬜ 删除 / 隐藏异常内容

## 6.3 内容质量检查

- ⬜ 图片分辨率检查
- ⬜ Ratio 检查
- ⬜ Artifact / 崩脸 / 多肢基础人工检查流程
- ⬜ Mythology / Character identity 检查
- ⬜ 现代商业 IP 相似设计检查
- ⬜ Alt / SEO Metadata 完整性检查

**DoD**：生成作品可以经过审核后自动进入公开 Explore / Entity 页面。

---

# 7. Milestone 5 — Search / Discover / Recommendation

**优先级：P1**

## 7.1 Search

- ⬜ 全站 Search 页面
- ⬜ Search Suggestion
- ⬜ Character Search
- ⬜ Realm Search
- ⬜ Mythology Search
- ⬜ Artwork Search
- ⬜ 中英文名称匹配
- ⬜ Alias / alternate name
- ⬜ 空结果页
- ⬜ Trending / Hot Search（后续）

MVP 可优先 D1 FTS / prefix 查询，避免过早引入外部搜索系统。

## 7.2 Explore 完善

- ✅ Civilization Filter
- ✅ Content Type Filter
- ✅ Style Filter
- ⬜ Device Filter
- ⬜ Mood Filter
- ⬜ Latest / Popular / Recommended 排序
- ⬜ URL 可分享筛选参数
- ⬜ Pagination / Load More
- ⬜ 移动端 Bottom Sheet Filter

## 7.3 Related Content

- ⬜ Same Character
- ⬜ Same Realm
- ⬜ Same Mythology
- ⬜ Same Style
- ⬜ Similar Mood

## 7.4 Recommendation V1

不先做复杂 ML。

基于：

```text
收藏
+ 下载
+ 浏览
+ Character
+ Realm
+ Mythology
+ Style
+ Mood
```

- ⬜ 匿名 session preference
- ⬜ 登录用户 preference profile
- ⬜ Home personalized feed
- ⬜ Related recommendation scoring

**DoD**：用户可以通过 Search / Filter / Related / Recommend 四条路径持续发现内容。

---

# 8. Milestone 6 — Auth / 收藏 / 我的宇宙

**优先级：P1**

## 8.1 Auth

原则：**先获得价值，再要求登录。**

匿名允许：

- 浏览
- 搜索
- 下载公开 Artwork

登录触发：

- 收藏
- AI 持久化生成
- 历史记录
- “我的宇宙”

开发项：

- ⬜ 确定 Auth Provider
- ⬜ User Schema
- ⬜ Session
- ⬜ 登录 / 登出
- ⬜ User Menu
- ⬜ 登录回跳
- ⬜ Auth 错误状态

## 8.2 Favorites

支持收藏对象：

- ⬜ Artwork
- ⬜ Character
- ⬜ Realm
- ⬜ Style（可 P2）

能力：

- ⬜ Favorite API
- ⬜ 乐观更新
- ⬜ 未登录引导
- ⬜ 收藏列表
- ⬜ 删除收藏

## 8.3 我的宇宙

页面：`/my`

- ⬜ 我的壁纸
- ⬜ 我的角色
- ⬜ 我的神域
- ⬜ 我的绘神
- ⬜ 生成历史
- ⬜ Empty State
- ⬜ 用户偏好概览

## 8.4 History

- ⬜ 最近浏览
- ⬜ 最近下载
- ⬜ 最近生成
- ⬜ 清理历史

**DoD**：用户有明确的长期个人资产沉淀空间。

---

# 9. Milestone 7 — 壁纸下载与设备体验

**优先级：P1**

## 9.1 Download UX

- ⬜ HD
- ⬜ 2K
- ⬜ 4K
- ⬜ Original
- ⬜ 9:16
- ⬜ 19.5:9
- ⬜ 16:9
- ⬜ 下载统计

## 9.2 图片派生策略

优先评估 Cloudflare Images；若不采用则自建 Worker/R2 derivative pipeline。

- ⬜ Thumbnail
- ⬜ Card preview
- ⬜ Hero
- ⬜ OG
- ⬜ Download variant
- ⬜ AVIF / WebP
- ⬜ DPR / `srcset`
- ⬜ image dimension reservation

## 9.3 Device Preview

- ✅ 基础预览原型
- ⬜ 手机锁屏 Preview
- ⬜ 手机桌面 Preview
- ⬜ Desktop Preview
- ⬜ 时间 / 图标 Overlay
- ⬜ Preview 开关

**DoD**：用户能够清楚知道壁纸在设备上的效果，并下载正确规格。

---

# 10. Milestone 8 — SEO / GEO / 内容发现

**优先级：P1**

## 10.1 基础 SEO

- ✅ Astro sitemap integration 基础
- ✅ Canonical 基础
- ✅ OpenGraph 基础
- ⬜ 正式域名替换 `example.com`
- ⬜ 每个 Entity 唯一 title / description
- ⬜ Artwork metadata
- ⬜ Breadcrumb
- ⬜ robots.txt
- ⬜ 404
- ⬜ canonical audit
- ⬜ redirect strategy

## 10.2 Structured Data

- ⬜ `WebSite`
- ⬜ `Organization`
- ⬜ `BreadcrumbList`
- ⬜ `ImageObject`
- ⬜ Character / mythology 页面适合的 Schema.org 类型评估
- ⬜ FAQ（只在真实有价值页面使用）

## 10.3 Image SEO

- ⬜ Image Sitemap
- ⬜ meaningful filename / URL
- ⬜ alt
- ⬜ width / height
- ⬜ image caption / context
- ⬜ R2 / image delivery crawlability

## 10.4 GEO

实体页必须提供可被 AI Search 理解的结构化内容：

- ⬜ Entity Summary
- ⬜ Mythology
- ⬜ Realm
- ⬜ Symbols
- ⬜ Relationships
- ⬜ Canonical Design 描述
- ⬜ 内链 Entity Graph
- ⬜ 来源 / 内容边界说明

## 10.5 Programmatic SEO

- ⬜ Character × Wallpaper
- ⬜ Realm × Wallpaper
- ⬜ Mythology × Style
- ⬜ Character × Style
- ⬜ Device landing pages（仅有真实内容时）

原则：禁止生成低价值薄页面。

**DoD**：核心 Entity / Artwork 可被搜索引擎稳定抓取、理解、索引与引用。

---

# 11. Milestone 9 — 国际化

**优先级：P1 / P2**

品牌英文已确定为 MythCanvas，Web 长期必须支持国际流量。

## 11.1 i18n Foundation

- ⬜ 中文 `zh-CN`
- ⬜ 英文 `en`
- ⬜ URL 策略确定
- ⬜ Language switch
- ⬜ `hreflang`
- ⬜ Localized metadata

## 11.2 Entity Translation

- ⬜ Mythology 双语
- ⬜ Realm 双语
- ⬜ Character 双语
- ⬜ Artwork Title / Alt 双语
- ⬜ Alias / Transliteration

## 11.3 SEO

- ⬜ 中英文独立关键词策略
- ⬜ 英文 Mythology / Wallpaper landing pages

**DoD**：英文页面不是中文机器翻译壳，而是具备可搜索的正式内容结构。

---

# 12. Milestone 10 — 性能 / Accessibility / PWA

**优先级：P1**

## 12.1 Performance

- ⬜ LCP Hero 优化
- ⬜ Artwork lazy-load
- ⬜ responsive images
- ⬜ 控制 JS hydration
- ⬜ Cloudflare Cache
- ⬜ Cache-Control audit
- ⬜ CLS < 0.1
- ⬜ Lighthouse Performance 目标 ≥ 90
- ⬜ Core Web Vitals 监控

## 12.2 Accessibility

- ⬜ Keyboard navigation
- ⬜ Focus state
- ⬜ Light / Dark contrast audit
- ⬜ Semantic button / link
- ⬜ Alt
- ⬜ Form label
- ⬜ Async generation live status
- ⬜ Dialog focus restore
- ⬜ `prefers-reduced-motion`

## 12.3 PWA

非首发阻塞，但适合壁纸产品：

- ⬜ Manifest
- ⬜ Installable Web App
- ⬜ Icons
- ⬜ Offline shell
- ⬜ 最近浏览缓存（P2）

---

# 13. Milestone 11 — 数据分析与 Observability

**优先级：P1**

## 13.1 产品埋点

### Explore

- ⬜ artwork_impression
- ⬜ artwork_click
- ⬜ filter_change
- ⬜ search

### Artwork

- ⬜ preview
- ⬜ favorite
- ⬜ download
- ⬜ related_click
- ⬜ character_click
- ⬜ realm_click

### Create

- ⬜ create_entry
- ⬜ base_select
- ⬜ style_select
- ⬜ generate
- ⬜ generate_success
- ⬜ generate_fail
- ⬜ regenerate
- ⬜ refine
- ⬜ download_generation

### Retention

- ⬜ return_visit
- ⬜ favorite_revisit
- ⬜ character_revisit
- ⬜ realm_revisit

## 13.2 后端 Observability

- ✅ Cloudflare observability 基础开启
- ⬜ Generate latency
- ⬜ Provider latency
- ⬜ Provider error rate
- ⬜ R2 error
- ⬜ D1 error / slow query
- ⬜ Generation success rate
- ⬜ Cost per generation
- ⬜ Moderation rejection rate

## 13.3 Alert

- ⬜ API error rate alert
- ⬜ Provider failure alert
- ⬜ 超预算 alert
- ⬜ Deployment failure alert

---

# 14. Milestone 12 — 安全、隐私与版权治理

**优先级：P0 / P1**

## 14.1 Security

- ⬜ Secret 全部 Server-side
- ⬜ API request size limit
- ⬜ Rate limit
- ⬜ CSRF / session strategy review
- ⬜ XSS / user text escaping
- ⬜ Upload validation（未来开放上传时）
- ⬜ Security headers
- ⬜ dependency audit

## 14.2 Privacy

- ⬜ Privacy Policy
- ⬜ Terms of Service
- ⬜ AI generation data policy
- ⬜ 用户生成历史删除
- ⬜ 账号删除
- ⬜ Cookie / analytics 策略

## 14.3 Copyright / IP

- ✅ 使用神话原型，不复制现代商业 IP 的具体视觉设计
- ✅ Artwork 预留 source / license / model / prompt metadata
- ⬜ 正式 Content Policy 页面
- ⬜ Takedown / 联系入口
- ⬜ 运营审核 Checklist
- ⬜ AI 生成 IP guardrail 服务化
- ⬜ 公版 / 神话来源记录规范

---

# 15. Milestone 13 — 测试与发布质量

**优先级：P0 / P1**

## 15.1 CI

- ✅ Build CI
- ✅ main 自动部署 Cloudflare
- ⬜ TypeScript check 独立步骤
- ⬜ Unit Test
- ⬜ API Test
- ⬜ Migration Test
- ⬜ Broken link check
- ⬜ SEO metadata check

## 15.2 E2E

至少覆盖：

- ⬜ Home → Artwork
- ⬜ Explore Filter
- ⬜ Theme switch
- ⬜ Character → Realm
- ⬜ Artwork → Download
- ⬜ Creator → Generate → Result
- ⬜ Login → Favorite
- ⬜ My Universe

## 15.3 Visual Regression

重点页面 Light / Dark：

- ⬜ Home
- ⬜ Explore
- ⬜ Mythology
- ⬜ Realm
- ⬜ Character
- ⬜ Artwork
- ⬜ Creator
- ⬜ My Universe

## 15.4 Device Matrix

- ⬜ Chrome Desktop
- ⬜ Safari Desktop
- ⬜ Safari iPhone
- ⬜ Chrome Android
- ⬜ 375px / 390px / 430px Mobile
- ⬜ Tablet
- ⬜ 1440px Desktop

---

# 16. Website V1 页面完成清单

## Public

- ✅ `/` Home
- ✅ `/explore`
- ✅ `/mythology/[slug]`
- ✅ `/realm/[slug]`
- ✅ `/character/[slug]`
- ✅ `/wallpaper/[slug]`
- ✅ `/create`
- ⬜ `/search`
- ⬜ `/my`
- ⬜ `/my/favorites`
- ⬜ `/my/creations`
- ⬜ `/style/[slug]`
- ⬜ `/scene/[slug]`（若 Scene 独立公开）
- ⬜ `/about`
- ⬜ `/copyright`
- ⬜ `/privacy`
- ⬜ `/terms`
- ⬜ 404

## API

- ✅ `POST /api/generate`
- ✅ `GET /api/generation/[id]`
- ✅ `/media/*`
- ⬜ Search API
- ⬜ Favorite API
- ⬜ User API
- ⬜ Artwork publish/review API
- ⬜ Download tracking API
- ⬜ Recommendation API / server query

## Internal / Ops

- ⬜ `/admin/artworks`
- ⬜ `/admin/generations`
- ⬜ `/admin/review/[id]`
- ⬜ `/admin/entities`

---

# 17. V1 上线前 Gate

只有以下全部通过，Website V1 才标记为完成：

## Product

- ⬜ 核心 5 个文明均有正式内容
- ⬜ ≥ 30 个正式 Character
- ⬜ ≥ 15 个正式 Realm / Scene
- ⬜ ≥ 300 个正式 Artwork
- ⬜ AI Creator 真实模型可用
- ⬜ 收藏 / 我的宇宙可用
- ⬜ Search 可用
- ⬜ Download 完整

## Technical

- ⬜ D1 production 已绑定
- ⬜ R2 production 已绑定
- ⬜ AI Provider production 已绑定
- ⬜ 无 placeholder production asset
- ⬜ CI / Deploy 全绿
- ⬜ 关键 E2E 全绿
- ⬜ 无 P0 安全问题

## UX

- ⬜ Light / Dark 完整
- ⬜ Desktop / Mobile 完整
- ⬜ Generation 全状态完整
- ⬜ Empty / Error / Loading 完整
- ⬜ Accessibility baseline 通过

## Performance

- ⬜ Lighthouse Performance ≥ 90（核心页面）
- ⬜ Lighthouse SEO ≥ 95
- ⬜ Lighthouse Accessibility ≥ 90
- ⬜ Core Web Vitals 无明显红项

## SEO / GEO

- ⬜ 正式域名
- ⬜ Sitemap
- ⬜ Image Sitemap
- ⬜ robots.txt
- ⬜ JSON-LD
- ⬜ Canonical
- ⬜ OpenGraph
- ⬜ Entity internal links
- ⬜ Google / Bing webmaster 提交

## Compliance

- ⬜ Privacy
- ⬜ Terms
- ⬜ Copyright / Takedown
- ⬜ AI Content Policy

## Observability

- ⬜ 前端关键埋点
- ⬜ Generation / Provider / D1 / R2 监控
- ⬜ Deployment / Provider error alert

---

# 18. 推荐实际开发顺序

不要按页面平均推进，按依赖链推进：

```text
M1 真实 D1 / R2 / Provider
        ↓
M2 Artwork 正式数据管线
        ↓
M3 AI 生成生产闭环
        ↓
M4 审核发布工作流
        ↓
M5 Search / Related / Recommendation
        ↓
M6 Auth / Favorite / My Universe
        ↓
M7 Download / Image Derivatives
        ↓
M8 SEO / GEO
        ↓
M9 i18n
        ↓
M10 Performance / Accessibility / PWA
        ↓
M11 Analytics / Observability
        ↓
M12 Security / Privacy / Copyright
        ↓
M13 E2E / Release Gate
```

建议下一轮直接从以下 5 项开始：

1. **创建并绑定 production D1 / R2**；
2. **接入正式图片生成 Provider**；
3. **将 Artwork Repository + 公开读取迁移至 D1/R2**；
4. **实现 generation moderation + rate limit + quota**；
5. **实现最小 Artwork Review / Publish 后台**。

完成这 5 项后，MythCanvas 会从“产品原型”正式进入“可持续生产内容的线上产品”阶段。

---

# 19. Website V1 之后的 P2 Roadmap

以下能力不阻塞 Website V1：

- ⬜ 动态壁纸 / Live Wallpaper
- ⬜ 视频神境
- ⬜ AI 故事生成
- ⬜ 神话卡牌
- ⬜ 用户自定义世界
- ⬜ Creator 投稿体系
- ⬜ UGC 社区
- ⬜ Follow / Like / Comment
- ⬜ 分享卡 / 社交传播模板
- ⬜ 神话图鉴与收集系统
- ⬜ 更复杂个性化推荐
- ⬜ 用户审美画像
- ⬜ 微信小程序端
- ⬜ Web / 小程序统一账号与收藏

这些能力必须建立在 Website V1 的 **Entity / Artwork / User / Generation** 基础模型之上，不新建平行体系。

---

# 20. 文档关系

- 产品定义与 UX：[`docs/PRODUCT.md`](./docs/PRODUCT.md)
- 技术架构：[`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)
- Cloudflare 配置：[`docs/CLOUDFLARE_SETUP.md`](./docs/CLOUDFLARE_SETUP.md)
- AI Agent 开发规范：[`AGENTS.md`](./AGENTS.md)
- 项目入口：[`README.md`](./README.md)

`plan.md` 是项目开发进度的唯一 Roadmap 文档。每次完成一个 Milestone 或重要功能后，应同步更新对应 checkbox 与下一阶段优先级。