# MythCanvas Google Images SEO 执行方案

> 文档定位：`docs/SEO_OPTIMIZATION_PLAN.md` 的 Google Images 专项执行方案。  
> 目标：以最小必要改造，让 MythCanvas 的公开壁纸稳定被 Google 发现、抓取、理解和索引，并通过 Google Images 获得持续自然流量。  
> 基线日期：2026-08-31。

---

## 1. 结论先行

MythCanvas 当前已经具备 Google Images SEO 的主要基础，不需要重做普通 SEO 基建。

已经存在：

- 独立 `/wallpaper/{slug}/` Landing Page
- 服务端输出的真实 `<img src>`
- 主图 `alt / width / height`
- 页面 canonical / robots
- Artwork `ImageObject`
- `og:image`
- 动态 image sitemap
- Artwork sitemap 分片
- Mythology / World / Character 主图 image sitemap
- R2 图片公开访问路径 `/media/...`
- Cloudflare Image Transformations 工具

因此实施重点不是“继续堆 SEO 标签”，而是补齐下面四个闭环：

```text
稳定图片 URL
  ↓
Googlebot-Image 可稳定抓取
  ↓
Landing Page 提供明确图片语义
  ↓
Search Console + 抓取日志验证效果
```

本方案将工作拆成：

- **P0：抓取与索引闭环** —— 近期必须做
- **P1：排名、CTR、性能** —— P0 稳定后做
- **P2：国际 Google Images 流量** —— 有数据后做
- **P3：版权增强与 AI provenance** —— 非 SEO 前置条件

Google Discover 独立放在附录，不与 Google Images 主线混在一起。

---

## 2. Google Images 的核心判断标准

Google 当前图片搜索指南可以归纳为两件事：

1. **Help Google discover and index images**
2. **Optimize the image landing pages**

对 MythCanvas 而言，对应为：

### 可发现、可抓取

- 使用标准 HTML `<img src>`
- 图片 URL 无登录、Cookie、临时签名依赖
- robots 不阻止图片
- image sitemap 能发现图片
- 图片返回正确 HTTP 状态与 MIME
- 同一图片尽量长期使用同一 URL

### 可理解、有价值

- Artwork 有独立页面
- 页面 title / H1 / description 与图片主题一致
- alt 准确描述图片
- 图片附近有角色、神话体系、画风、设备等上下文
- 页面有真实下载、相关作品、角色关系，而不是纯 SEO 薄页

官方参考：

- https://developers.google.com/search/docs/appearance/google-images
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
- https://developers.google.com/search/docs/appearance/structured-data/image-license-metadata

---

# 3. 当前实现审计

## 3.1 已完成能力

| 能力 | 状态 | 当前实现 |
|---|---|---|
| Artwork 独立页 | ✅ | `src/pages/wallpaper/[slug].astro` |
| canonical | ✅ | `BaseHead.astro` + `page-policy.ts` |
| robots | ✅ | `BaseHead.astro` + `page-policy.ts` |
| Artwork 主图真实 `<img src>` | ✅ | `wallpaper/[slug].astro` |
| alt / width / height | ✅ | Artwork `ImageAsset` |
| 主图首屏优先级 | ✅ | `fetchpriority="high"` |
| 基础 `ImageObject` | ✅ | Artwork 页面 |
| `og:image` | ✅ | `BaseHead.astro` |
| image sitemap | ✅ | `sitemap-images.xml.ts` |
| Artwork sitemap 分片 | ✅ | `sitemap-index.xml.ts` |
| Character / World / Mythology 图片 sitemap | ✅ | `sitemap-images.xml.ts` |
| 同域 R2 图片访问路径 | ✅ | `/media/[...key]` |
| 正确图片 MIME fallback | ✅ | `/media/[...key].ts` |
| Cloudflare 响应式图片 helper | ✅ | `cloudflareImageSrcSet()` |
| 搜索/筛选页 noindex 策略 | ✅ | `page-policy.ts` |

### 结论

项目已经越过“Google 能不能发现图片”的第一阶段。

下一步最重要的是确认这些能力在线上形成稳定闭环，而不是继续增加大量 schema 字段。

---

## 3.2 当前真正的风险

### 风险 A：图片 URL 与 `immutable` 缓存语义可能冲突

当前 `/media/...` 返回：

```text
Cache-Control: public, max-age=31536000, immutable
```

但导入脚本允许对相同 R2 key 使用 `--force` 覆盖。

这两种行为不能同时长期存在：

```text
同 URL 内容可被覆盖
+
客户端/CDN 被告知一年内永不变化
=
缓存内容可能长期与 R2 实际内容不一致
```

Google 官方也建议：同一图片尽量持续使用相同 URL，以便缓存和复用。

所以 MythCanvas 必须明确：

> **公开后的图片 URL 真正 immutable。内容变化时生成新 key / 新 URL。**

这是 P0 中优先级最高的架构约束。

---

### 风险 B：缺少 Googlebot-Image 抓取层观测

现在可以看到：

- sitemap 是否生成
- Search Console 是否有 impression

但中间缺：

```text
Googlebot-Image 有没有请求 /media/*
请求是不是 200
是否出现 403 / 404 / 5xx
图片响应速度是否异常
```

如果没有这层，就无法区分：

- Google 根本没抓图
- 抓图失败
- 抓到了但没曝光
- 已曝光但 CTR 低

因此抓取日志必须进入 P0 验收。

---

### 风险 C：Character 页与未来 Wallpaper Landing Page 可能关键词内耗

当前已有：

```text
/character/artemis/
```

如果未来再增加：

```text
/artemis-wallpapers/
```

两个页面都优化 `Artemis wallpaper`，很容易发生 cannibalization。

V1 明确策略：

> **Character 页面同时承担 Character Entity Hub + Character Wallpaper Hub。**

暂不创建独立 `{character}-wallpapers` 页面。

只有 Search Console 数据证明：

- `Artemis mythology`
- `Artemis wallpaper`

两类搜索意图都足够大，且两个页面可以提供明显不同内容时，才拆分 URL。

---

# 4. P0：抓取与索引闭环

P0 的目标不是“让 schema 最完整”，而是确保：

> 每一张 published Artwork 都能被 Googlebot-Image 稳定发现、抓取、理解和追踪。

---

## P0-1. 建立真正 immutable 的图片 URL 策略

### 目标

发布到公开站点后的图片 URL 内容不可原地替换。

### 规则

新图片 key 推荐继续保留业务语义：

```text
characters/{character}/styles/{style}/{outputSpec}/{filename}
```

但 `filename` 必须具备版本唯一性。

例如：

```text
artemis-anime-mobile-01-v1.webp
artemis-anime-mobile-01-20260831.webp
artemis-anime-mobile-01-{contentHash}.webp
```

推荐优先：

```text
语义前缀 + 短 content hash
```

例如：

```text
artemis-anime-mobile-01-a8f2c1.webp
```

### 发布规则

- draft 阶段允许替换内部资产。
- 一旦 Artwork `published`，当前 `asset_key` 视为 immutable。
- 作品重做时：上传新 key → 更新 D1 → 新 URL 生效。
- 不原地覆盖已公开一年缓存的 key。

### 涉及文件

- `scripts/import-character-artworks.mjs`
- 未来生成作品发布管线
- `src/pages/media/[...key].ts`

### 验收

- 同一公开 URL 在生命周期内内容不变。
- 新版本作品使用新 URL。
- `immutable` 与真实发布行为一致。

---

## P0-2. 固化 `/media` Googlebot-Image 抓取契约

当前 route 方向正确，P0 不要求重构成复杂 CDN 架构，先把行为固定下来。

### HTTP 契约

```text
GET /media/...    -> 200 + image/*
HEAD /media/...   -> 200
不存在            -> 404
Content-Type       -> image/jpeg|png|webp|avif...
Cache-Control      -> public, max-age=31536000, immutable
认证               -> 无
Cookie 依赖        -> 无
```

### 禁止

- 不针对 Googlebot-Image 返回特殊内容。
- 不基于 Referer 阻止 Google 抓取。
- 不开启会导致 Googlebot 403 的防盗链。
- robots.txt 不屏蔽 `/media/`。
- 不将公开图片改成短期 signed URL。

### 性能注意

当前 route 会把 R2 object 完整读入内存再返回。

这不是当前 SEO 阻塞项，但随着高清壁纸量增长，需要观察：

- 大图 P95 响应时间
- Worker CPU / memory
- R2 请求量
- Googlebot-Image 请求量

只有数据证明成为瓶颈后，再评估：

- R2 custom domain
- Cloudflare Cache API
- 更直接的 CDN delivery
- 流式响应

不要在 P0 为未来流量提前过度重构。

### 测试

新增抓取契约测试：

- image 200
- HEAD 200
- 404 正确
- MIME 正确
- Cache-Control 正确

---

## P0-3. 保持图片可发现性

### Artwork 主图

必须继续保持标准：

```html
<img
  src="/media/..."
  alt="..."
  width="..."
  height="..."
/>
```

Google 当前明确通过 `<img src>` 发现图片，不索引 CSS background image。

所以：

- Artwork primary image 永远使用 `<img src>`。
- CSS background 可以用于纯装饰背景，但不能替代 SEO 主图。
- 即使未来使用 `<picture>` / `srcset`，仍保留真实 `img src` fallback。

当前已经满足，主要做回归保护。

---

## P0-4. 保持并测试 Image Sitemap

当前实现已经正确：

```xml
<url>
  <loc>https://mythcanvas.space/wallpaper/{slug}/</loc>
  <image:image>
    <image:loc>https://mythcanvas.space/media/...</image:loc>
  </image:image>
</url>
```

P0 不重写 sitemap。

### 只补自动化测试

至少覆盖：

- published + approved Artwork 出现。
- draft / hidden 不出现。
- Artwork `<loc>` 指向 `/wallpaper/{slug}/`。
- `<image:loc>` 指向当前真实图片 URL。
- URL 正确 XML escape。
- Artwork 分片边界正确。
- sitemap index 能引用所有 image sitemap 分片。

### 不做

不要重新加入 Google 已废弃的 image sitemap 字段：

- `image:caption`
- `image:title`
- `image:license`
- `image:geo_location`

图片语义应该放在 Landing Page 和结构化数据。

---

## P0-5. 统一 Artwork 图片语义

当前问题不是没有 alt，而是不同导入/生成流程未来可能各自拼接文案。

需要建立统一规则。

### 页面 H1 / Artwork title

目标：自然可读。

推荐：

```text
阿尔忒弥斯 · Anime · 手机壁纸
奥丁 · Cinematic · PC 壁纸
嫦娥 · Sacred · 手机壁纸
```

避免：

```text
Artemis 4K HD AI Anime Greek Goddess Free Mobile Wallpaper Download
```

### alt

alt 描述图片本身，而不是把所有搜索词塞进去。

推荐：

```text
阿尔忒弥斯，Anime 风格手机壁纸
奥丁独眼形象，Cinematic 风格 PC 壁纸
```

如果数据库没有“独眼”等真实可验证画面 metadata，就不要自动编造。

### 页面上下文承担额外语义

Artwork Detail 应明确展示：

```text
角色：阿尔忒弥斯 / Artemis
神话体系：希腊神话 / Greek Mythology
画风：Anime
设备：Mobile
尺寸：1024 × 1536
来源：AI-generated original
```

英文实体词放在事实块，不必全部塞进 alt。

### 文件名

Google 官方只把 filename 当作 very light clue。

因此：

- 新资产可以语义化。
- 历史资产绝不为了 SEO 批量换 URL。
- URL 稳定性 > 文件名优化。

---

## P0-6. 最小化增强 Structured Data

当前 Artwork 已经存在 `ImageObject`。

P0 只做一个明确增强：

> 告诉 Google 当前页面的 preferred image 是哪张图。

### 推荐结构

不需要第一版就搭完整复杂 graph。

可以直接：

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "url": "https://mythcanvas.space/wallpaper/artemis-anime-m-01/",
  "primaryImageOfPage": {
    "@type": "ImageObject",
    "contentUrl": "https://mythcanvas.space/media/...",
    "name": "阿尔忒弥斯 · Anime · 手机壁纸",
    "description": "阿尔忒弥斯，Anime 风格手机壁纸",
    "width": 1024,
    "height": 1536,
    "creator": {
      "@type": "Organization",
      "name": "MythCanvas"
    }
  }
}
```

### 原则

- `contentUrl` 指向真实公开图片。
- 使用 `primaryImageOfPage` 即可，不把复杂 `@id` graph 当成 P0 前置条件。
- `og:image` 继续保留。
- Google 对 preferred image 的最终选择仍是自动的，metadata 只是信号。

### License 暂不进入 P0

当前版权政策还不足以支撑完整：

- `license`
- `acquireLicensePage`
- 强版权声明

P0 只输出事实性的 creator / source 信息。

不要为了获得 Licensable 展示虚构许可 URL。

---

## P0-7. Character 页面作为 Wallpaper Hub

Artwork 页负责单图长尾：

```text
Artemis anime mobile wallpaper
Odin cinematic PC wallpaper
```

Character 页负责角色级主词：

```text
Artemis wallpaper
Odin wallpaper
嫦娥壁纸
```

### Character 页推荐结构

```text
H1：阿尔忒弥斯 · Artemis
角色身份摘要
神话体系 / 象征 / 神职

阿尔忒弥斯壁纸
├─ Canonical
├─ Sacred
├─ Cinematic
├─ Anime
└─ Cyber Myth

PC 壁纸 / 手机壁纸
相关神域
相关神灵
```

### V1 禁止

暂不创建：

```text
/artemis-wallpapers/
/odin-wallpapers/
```

避免与 `/character/{slug}/` 竞争相同关键词。

---

# 5. P0 观测与验收

这是上一版方案最欠缺的一层。

Google Images 没有一个完整的“所有图片 Index Coverage”报告，所以必须同时看三层数据。

---

## 5.1 Layer 1：Sitemap / Published Inventory

站内统计：

```text
Published Artwork 数
Image Sitemap Artwork 数
```

目标：

```text
Image Sitemap Artwork 数 / Published Artwork 数 ≈ 100%
```

允许排除明确 noindex / hidden 内容。

---

## 5.2 Layer 2：Googlebot-Image 抓取

通过 Cloudflare 请求日志 / Analytics 能力观察：

```text
User-Agent 包含 Googlebot-Image
+
path /media/*
```

至少统计：

- 请求数
- unique image URL 数
- 200
- 304（如果后续存在）
- 404
- 403
- 5xx
- P50 / P95 响应时间

### 告警原则

重点关注：

```text
Googlebot-Image 403 > 0
Googlebot-Image 5xx 持续出现
已发布 image sitemap URL 出现大量 404
```

---

## 5.3 Layer 3：Search Console Image Performance

Search Console：

```text
Performance
→ Search type = Image
```

监控：

- impressions
- clicks
- CTR
- average position
- top queries
- top pages
- country
- device

### 关键派生指标

```text
有 Image impression 的 Artwork 数 / Published Artwork 数
```

这个指标比单看总 impression 更能说明图片库是否开始被 Google 消化。

---

## 5.4 首次上线抽样验收

Search Console URL Inspection 抽样 10–20 个 Artwork：

覆盖：

- PC / Mobile
- Character / World
- 多个神话体系
- 多种 Style

检查：

- URL 可索引
- Google-selected canonical 正确
- rendered HTML 有 primary `<img>`
- 图片 URL 200
- structured data 无关键错误
- image sitemap 已包含

---

# 6. P1：排名、CTR 与性能

P1 只有在 P0 抓取闭环稳定后推进。

---

## P1-1. Artwork Detail 响应式图片

项目已经有：

```ts
cloudflareImageSrcSet()
```

Artwork Detail 可升级为：

```html
<img
  src="original-stable-url"
  srcset="..."
  sizes="..."
  alt="..."
  width="..."
  height="..."
  fetchpriority="high"
/>
```

### 目的

主要收益：

- 更低图片传输体积
- 更好的 LCP
- 更好的移动端体验

Google 官方支持 responsive images，但这不是“能否收录图片”的前置条件。

因此归 P1，而不是 P0。

### 原则

- `src` 保留稳定 fallback URL。
- 首屏主图不 lazy-load。
- below-fold 图片 lazy-load。
- 不为了搜索爬虫返回不同版本。

---

## P1-2. `max-image-preview:large`

公开可索引页可以输出：

```text
index,follow,max-image-preview:large
```

意义：允许 Google 在支持的搜索界面使用较大的图片预览。

这不是图片收录开关，因此归 P1。

noindex 页面继续保持自身 robots 策略，不被统一模板覆盖。

---

## P1-3. `og:image` 完整 metadata

当前 Artwork 已经使用作品图作为 `og:image`。

可以补：

```text
og:image:width
og:image:height
og:image:alt
```

主要提升社交预览一致性，同时帮助 preferred image 信号更完整。

---

## P1-4. Artwork semantic summary

当前 Artwork 页面已有标题、alt 和 metadata。

可以增加一句短摘要：

```text
这是一张以希腊神话角色阿尔忒弥斯（Artemis）为主题的 Anime 风格手机壁纸，原图尺寸为 1024 × 1536。
```

要求：

- 只从真实 metadata 生成。
- 不根据模型猜测图片里没有结构化记录的视觉细节。
- 不生成大段 SEO 模板文章。

---

## P1-5. 内链图谱

目标：避免 Artwork 成为孤岛。

```text
Mythology ↔ World ↔ Character ↔ Artwork
```

Artwork 页面至少链接：

- Character
- Mythology
- World（如果存在）
- Related Artwork

Character 页面链接全部高质量 Artwork。

锚文本使用实体名，而不是全部使用“查看更多”。

---

## P1-6. 图片质量

- 原图保持足够分辨率。
- 展示图通过 Cloudflare 派生。
- 不给图片叠加大面积 SEO 文案。
- 不为了 Google Images 把手机壁纸强裁成横图。
- 不上传大量视觉重复、仅关键词不同的作品。

---

# 7. P2：国际 Google Images 流量

Google Images 对 MythCanvas 最大的潜在增量来自英文搜索：

```text
Artemis wallpaper
Odin wallpaper
Anubis wallpaper
Greek mythology wallpaper
Norse mythology wallpaper
```

但不建议现在建立只有导航翻译的 `/en/`。

---

## 7.1 V1：单 URL 中保留英文实体语义

当前中文页面可以：

- 角色显示 `阿尔忒弥斯 · Artemis`
- Mythology 显示 `希腊神话 · Greek Mythology`
- slug 继续稳定英文
- facts 中有英文正式名

alt 仍以页面主要语言为主，不进行中英关键词堆砌。

---

## 7.2 V2：完整英文页面

只有以下内容可完整英文后再上线 `/en/`：

- navigation
- title / meta description
- H1
- entity summary
- Artwork summary
- facts
- related link labels
- rights / license text

同时实现：

```text
self canonical
hreflang zh-CN
hreflang en
x-default（如需要）
sitemap language alternates
```

---

# 8. P3：版权增强与 AI Provenance

这部分有长期价值，但不是 Google Images 收录前置条件。

---

## P3-1. License metadata

在 MythCanvas 真正明确图片授权规则后，再考虑：

- `license`
- `acquireLicensePage`
- `creditText`
- `copyrightNotice`

需要先回答产品/法律问题：

- 是否只允许个人壁纸使用？
- 是否允许转载？
- 是否允许商业使用？
- 是否允许二创？
- 用户生成作品的权利如何处理？

先定政策，再输出机器可读 metadata。

---

## P3-2. IPTC AI metadata

可评估给下载原图写入 AI 来源 metadata。

价值主要是：

- 图片被用户下载后来源信息仍保留
- 被 Pinterest / Zedge / 其他站转载后仍可携带 provenance

不是 Google Images 排名必要条件。

---

## P3-3. C2PA / Content Credentials

长期评估：

```text
AI 生成
→ C2PA manifest
→ 签名
→ R2 original
```

属于可信来源能力，不放进近期 SEO Roadmap。

---

# 9. SafeSearch

公共 Google Images 获客库必须保持明确边界。

原则：

- explicit / 成人内容不进入普通公开 Artwork SEO 库。
- 如果未来存在成人内容区，使用独立页面范围并按 Google SafeSearch 指南标识。
- 不让成人内容与普通神话壁纸共用同一聚合页。

官方参考：

https://developers.google.com/search/docs/appearance/google-images#optimize-for-safesearch

---

# 10. Google Discover：独立增强项

Discover 不属于 Google Images 主线，不作为 P0/P1 验收标准。

Google Discover 更关注：

- 高质量大图
- 大图预览权限
- 页面内容价值与用户兴趣

如果未来专门做 Discover，可考虑：

- `max-image-preview:large`
- ≥1200px 的高质量 preferred image
- 必要时生成适合分享/Discover 的 Preview Image

但必须遵守：

> Google Images 的 primary image 仍然是原始 Artwork，不为了 Discover 把 9:16 手机壁纸强行替换为 16:9。

官方参考：

https://developers.google.com/search/docs/appearance/google-discover

---

# 11. 页面架构与关键词策略

## Character Page

承担：

```text
Artemis
Artemis wallpaper
阿尔忒弥斯
阿尔忒弥斯壁纸
```

页面价值：实体知识 + 该角色全部 Artwork。

---

## Artwork Page

承担更细长尾：

```text
Artemis anime wallpaper
Artemis mobile wallpaper
Artemis cinematic wallpaper
```

页面价值：单张高清作品 + 下载 + 设备信息 + 相关作品。

---

## Mythology Page

承担：

```text
Greek mythology
Greek mythology wallpapers
希腊神话壁纸
```

前提：页面拥有足够真实内容和相关 Artwork。

---

## Filter URLs

继续：

```text
noindex,follow
canonical -> 主聚合页
```

不让：

```text
?style=anime&device=mobile&mood=night
```

自动形成大量薄索引页。

---

# 12. 实施顺序

## Phase A — P0 Crawl & Index Contract

1. 明确 published image immutable URL 规则。
2. 修改导入/发布管线，禁止覆盖已公开 key。
3. 为 `/media` 增加抓取契约测试。
4. 为 image sitemap 增加 published / hidden / shard 测试。
5. 统一 Artwork title / alt / facts 生成规则。
6. 最小化增加 `WebPage.primaryImageOfPage`。
7. Character 页面明确承担 Wallpaper Hub。
8. 配置 Search Console Domain Property。
9. 提交 sitemap index。
10. 建 Googlebot-Image `/media/*` 抓取监控。
11. 抽样 10–20 个 Artwork URL Inspection。

### Phase A 完成标准

- [ ] Published Artwork 主图 URL immutable。
- [ ] 主图 GET / HEAD 200。
- [ ] Content-Type 正确。
- [ ] robots 不阻止 `/media/`。
- [ ] 每个 Artwork 有真实 `<img src>`。
- [ ] 每个 Artwork 有准确 alt / width / height。
- [ ] Published Artwork 全部进入 image sitemap。
- [ ] Hidden / draft 不进入 sitemap。
- [ ] Artwork 页面输出 `primaryImageOfPage`。
- [ ] Character 页面没有重复 Character Wallpaper SEO URL。
- [ ] 能看到 Googlebot-Image 的 `/media` 请求状态。
- [ ] Search Console 已有抽样验证记录。

---

## Phase B — P1 Ranking & UX

12. Artwork Detail 接入 `srcset + sizes`。
13. 公开页增加 `max-image-preview:large`。
14. 补 `og:image:width / height / alt`。
15. 增加 Artwork semantic summary。
16. 强化 Character / Mythology / World / Artwork 内链。
17. 根据 Core Web Vitals 优化图片交付。

---

## Phase C — P2 International

18. 用 Search Console 查询判断英文需求。
19. 完成英文内容体系。
20. 上线 `/en/` + hreflang。
21. 根据英文 Image queries 调整 Artwork 供给。

---

## Phase D — P3 Provenance

22. 明确图片许可政策。
23. 补 license structured data。
24. 评估 IPTC AI provenance。
25. 评估 C2PA。

---

# 13. 代码改造映射

| 目标 | 文件 |
|---|---|
| immutable R2 key / 文件命名 | `scripts/import-character-artworks.mjs` |
| 生成作品发布 key 规则 | generation / publish pipeline |
| Media 抓取契约 | `src/pages/media/[...key].ts` |
| Artwork primary image | `src/pages/wallpaper/[slug].astro` |
| Artwork ImageObject / primaryImageOfPage | `src/pages/wallpaper/[slug].astro` |
| Artwork responsive image | `src/pages/wallpaper/[slug].astro` |
| Cloudflare srcset | `src/lib/media/cloudflare-images.ts` |
| robots preview policy | `src/lib/seo/page-policy.ts` |
| OG image metadata | `src/components/BaseHead.astro` |
| Artwork 内容模型 | `src/lib/content/types.ts` |
| Artwork D1 mapping | `src/lib/content/repositories/artwork.ts` |
| Character Wallpaper Hub | `src/pages/character/[slug].astro` |
| Image sitemap | `src/pages/sitemap-images.xml.ts` |
| Sitemap index | `src/pages/sitemap-index.xml.ts` |
| Copyright / license | `src/pages/copyright.astro` |
| Sitemap tests | `tests/sitemap.test.ts` |
| SEO policy tests | `tests/page-seo-policy.test.ts` |
| Google Images contract tests | `tests/google-images-seo.test.ts`（建议新增） |

---

# 14. 自动化测试建议

新增 `tests/google-images-seo.test.ts`，只测试真正容易回归的契约。

## Artwork Page

验证：

- 有 primary `<img src>`。
- 有 alt。
- 有 width / height。
- 有 `ImageObject`。
- 有 `primaryImageOfPage`。
- `contentUrl` 是公开稳定 URL。

## Image Sitemap

验证：

- published Artwork 出现。
- draft / hidden 不出现。
- landing page URL 正确。
- image URL 正确。
- XML escape 正确。

## Media

验证：

- GET 200。
- HEAD 200。
- 404 正确。
- Content-Type 正确。
- Cache-Control 符合 immutable 策略。

## Page Policy

验证：

- public Artwork indexable。
- filter/search/private 页面维持 noindex。
- 后续加 `max-image-preview:large` 时不破坏 noindex 策略。

---

# 15. 数据指标

## 技术指标

```text
Published Artwork
Image Sitemap Artwork
Googlebot-Image requested image URLs
Googlebot-Image 200 / 403 / 404 / 5xx
/media P95
```

## Search Console

```text
Search type = Image
```

跟踪：

- impressions
- clicks
- CTR
- average position
- top queries
- top pages
- country
- device

## 业务指标

Google Image organic session 进入后：

```text
Artwork Detail
  ↓
Download
Favorite
Character
Related Artwork
AI Create
```

关注：

- Artwork download conversion
- Related Artwork CTR
- Character CTR
- AI Create CTR

---

# 16. 28 / 90 天迭代规则

## 0–28 天

目标：验证抓取和曝光是否开始形成。

关注：

- Googlebot-Image 是否持续抓 `/media`。
- image sitemap 是否无异常。
- 有 impression 的 Artwork 比例是否增长。
- 是否出现 403 / 404 / canonical 问题。

这一阶段不要频繁改 URL / title / 页面结构。

---

## 29–90 天

根据真实 Search Console 数据优化：

### 高曝光低 CTR

优化：

- title
- preferred image
- 页面描述
- 图片视觉质量

### 某 Character 搜索明显增长

增加：

- 该 Character 的不同 Style Artwork
- PC / Mobile 覆盖

不立即创建第二个 Character Wallpaper Landing Page。

### 某 Mythology 搜索增长

强化 Mythology 页：

- Character
- World
- Artwork
- 神话事实内容

### 英文查询持续出现

再启动完整 `/en/`。

---

# 17. 明确不做

近期明确不做：

- 不为每个筛选组合创建 SEO URL。
- 不创建 `/artemis-wallpapers/` 与 Character 页抢词。
- 不在 alt 中堆关键词。
- 不批量重命名历史图片 URL。
- 不为了 Discover 修改 Google Images 主图比例。
- 不把 License / C2PA 当 Google Images 收录前置条件。
- 不为了 schema 完整度建立复杂 JSON-LD graph。
- 不提前重构整套 R2/CDN 架构，先看真实抓取与性能数据。
- 不大量生成只有一张图片 + 模板 SEO 文案的薄页面。

---

# 18. 最终目标状态

```text
Artwork Publish
   │
   ├─ immutable R2 image URL
   │
   ├─ /wallpaper/{slug}/
   │    ├─ canonical
   │    ├─ title / H1 / semantic facts
   │    ├─ <img src alt width height>
   │    ├─ primaryImageOfPage
   │    ├─ ImageObject
   │    ├─ og:image
   │    ├─ Character / Mythology / World links
   │    └─ Download / Related / AI Create
   │
   ├─ page sitemap
   └─ image sitemap
          │
          ▼
   Googlebot + Googlebot-Image
          │
     ┌────┴─────────┐
     ▼              ▼
Cloudflare logs   Search Console
crawl health      Image performance
     │              │
     └──────┬───────┘
            ▼
    数据驱动 Artwork 生产
```

核心原则只有一句：

> **先保证图片 URL 稳定、Google 抓得到、页面说得清，再根据真实 Image Search 数据决定做更多 SEO 增强。**
