# MythCanvas Google Images SEO 执行方案

> `docs/SEO_OPTIMIZATION_PLAN.md` 的图片搜索专项方案。基线：2026-08-31。

## 1. 目标

让所有公开壁纸形成稳定闭环：

```text
Artwork 发布
→ Google 发现页面和图片
→ Googlebot-Image 稳定抓图
→ Google 理解图片主题
→ Google Images 获得曝光
→ Search Console / 抓取日志反馈
→ 数据驱动后续 Artwork 生产
```

核心原则：**先保证 URL 稳定、抓得到、页面说得清，再做排名增强。**

官方参考：
- https://developers.google.com/search/docs/appearance/google-images
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
- https://developers.google.com/search/docs/appearance/structured-data/image-license-metadata
- https://developers.google.com/search/docs/appearance/google-discover

---

## 2. 当前基础

MythCanvas 已具备大部分 Google Images 基础能力：

| 能力 | 状态 | 实现 |
|---|---|---|
| Artwork 独立页 | ✅ | `src/pages/wallpaper/[slug].astro` |
| canonical / robots | ✅ | `BaseHead.astro` + `page-policy.ts` |
| 主图真实 `<img src>` | ✅ | Artwork Detail |
| alt / width / height | ✅ | `ImageAsset` |
| `ImageObject` | ✅ 基础版 | Artwork Detail |
| `og:image` | ✅ | `BaseHead.astro` |
| image sitemap | ✅ | `sitemap-images.xml.ts` |
| Artwork sitemap 分片 | ✅ | `sitemap-index.xml.ts` |
| Character / World / Mythology 图片 sitemap | ✅ | `sitemap-images.xml.ts` |
| R2 同域公开 URL | ✅ | `/media/[...key]` |
| 图片 MIME / 长缓存 | ✅ | `/media/[...key].ts` |
| Cloudflare `srcset` helper | ✅ | `cloudflare-images.ts` |

因此**不重做 sitemap、canonical、Artwork 路由**。

当前真正缺口只有四类：
1. 图片 URL 的不可变性没有被发布流程严格保证。
2. 缺 Googlebot-Image 抓取监控。
3. Artwork / Character 的图片搜索语义还可以统一。
4. 缺 Search Console 图片搜索验收闭环。

---

# 3. P0：抓取与索引闭环

P0 是近期唯一必须完成的部分。

## P0-1. 图片 URL 真正 immutable

当前 `/media/...` 返回：

```text
Cache-Control: public, max-age=31536000, immutable
```

但导入脚本允许 `r2 object put --force` 覆盖同一个 key。两者存在冲突：URL 告诉浏览器/CDN“一年不变”，实际内容却可能变化。

### 规则
- draft 阶段可以替换内部资产。
- Artwork 一旦 `published`，当前 `asset_key` 不再覆盖。
- 重做图片时上传新 key，再更新 D1。
- 历史 URL 不为了 SEO 重命名。

新 key 推荐：

```text
characters/{character}/styles/{style}/{outputSpec}/
{character}-{style}-{device}-{sequence}-{shortHash}.webp
```

例如：

```text
characters/artemis/styles/anime/mobile-wallpaper/
artemis-anime-mobile-01-a8f2c1.webp
```

> URL 稳定性比“文件名是否完美 SEO”重要得多。Google 官方只把 filename 视为 very light clue。

涉及：
- `scripts/import-character-artworks.mjs`
- AI 生成作品发布管线

验收：**公开 URL 生命周期内内容不变。**

---

## P0-2. 固化 `/media` 抓取契约

公开图片必须满足：

```text
GET /media/...   -> 200 + image/*
HEAD /media/...  -> 200
不存在           -> 404
认证             -> 无
Cookie 依赖      -> 无
robots           -> 不屏蔽
```

禁止：
- Googlebot-Image 403。
- Referer 防盗链误伤 Google。
- 短期 signed URL 作为 SEO 原图地址。
- 对爬虫返回与用户不同的图片。

当前 route 会将 R2 object 完整读入内存后返回。**暂不作为 P0 重构项**，只监控大图 P95、Worker/R2 压力；真实成为瓶颈后再评估 R2 custom domain、Cache API 或流式 delivery。

新增测试：
- GET 200
- HEAD 200
- 404
- MIME
- Cache-Control

涉及：`src/pages/media/[...key].ts`

---

## P0-3. 保持 Google 可发现主图

Artwork 主图必须一直使用：

```html
<img src="/media/..." alt="..." width="..." height="..." />
```

Google 当前明确通过 `<img src>` 发现图片，不索引 CSS background image。

规则：
- Artwork primary image 不得改成纯 CSS background。
- 未来使用 `<picture>` / `srcset` 时仍保留真实 `img src` fallback。
- 首屏主图不 lazy-load。

当前已经满足，主要增加回归测试。

---

## P0-4. Image Sitemap 不重做，只补测试

当前 sitemap 结构正确：

```xml
<url>
  <loc>https://mythcanvas.space/wallpaper/{slug}/</loc>
  <image:image>
    <image:loc>https://mythcanvas.space/media/...</image:loc>
  </image:image>
</url>
```

补测试：
- published + approved Artwork 必须出现。
- draft / hidden 不出现。
- `<loc>` 指向 `/wallpaper/{slug}/`。
- `<image:loc>` 指向真实图片 URL。
- XML escape 正确。
- Artwork 分片边界正确。
- sitemap index 引用所有 image sitemap 分片。

不要重新加入 Google 已废弃的 `image:caption / title / license / geo_location`。

涉及：
- `src/pages/sitemap-images.xml.ts`
- `src/pages/sitemap-index.xml.ts`
- `tests/sitemap.test.ts`

---

## P0-5. 统一图片语义

Google 主要综合页面正文、alt、页面 title 等信息理解图片；filename 只是轻微信号。

### Artwork title / H1

自然可读：

```text
阿尔忒弥斯 · Anime · 手机壁纸
奥丁 · Cinematic · PC 壁纸
```

不要：

```text
Artemis 4K HD AI Anime Greek Goddess Free Wallpaper Download
```

### Alt

描述图片本身：

```text
阿尔忒弥斯，Anime 风格手机壁纸
```

只使用真实 metadata；没有结构化画面信息时，不自动编造“独眼、月光、神殿”等视觉细节。

### Artwork 事实块

页面明确提供：

```text
角色：阿尔忒弥斯 / Artemis
神话：希腊神话 / Greek Mythology
画风：Anime
设备：Mobile
尺寸：1024 × 1536
来源：AI-generated original
```

英文实体名放事实块，不全部塞进 alt。

涉及：
- `scripts/import-character-artworks.mjs`
- `src/pages/wallpaper/[slug].astro`

---

## P0-6. Structured Data 只做最小增强

当前已有 `ImageObject`。P0 只补 Google 当前明确支持的 preferred image 信号：`primaryImageOfPage`。

推荐：

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
    "creator": { "@type": "Organization", "name": "MythCanvas" }
  }
}
```

原则：
- `contentUrl` 必须是真实公开图片。
- 不把复杂 `@id` graph 当成上线前置条件。
- `og:image` 继续保留。
- 不为获得 Licensable 展示虚构 `license` URL。

涉及：`src/pages/wallpaper/[slug].astro`

---

## P0-7. Character 页面兼任 Wallpaper Hub

避免未来出现：

```text
/character/artemis/
/artemis-wallpapers/
```

两个页面共同竞争 `Artemis wallpaper`。

V1 规则：**`/character/{slug}/` 同时承担角色实体页和角色壁纸 Hub。**

Character 页建议结构：

```text
H1：阿尔忒弥斯 · Artemis
身份摘要 / 神话事实
角色壁纸
  ├─ Canonical
  ├─ Sacred
  ├─ Cinematic
  ├─ Anime
  └─ Cyber Myth
PC / Mobile
相关神域
相关神灵
```

Artwork 页负责更细的长尾，例如：
- `Artemis anime wallpaper`
- `Artemis mobile wallpaper`

只有 Search Console 证明“角色知识”和“角色壁纸”两个意图都足够大、内容可以明显区分时，再考虑拆独立 Wallpaper Landing Page。

涉及：`src/pages/character/[slug].astro`

---

# 4. P0 观测与验收

Google Images 没有完整的“所有图片 Index Coverage”，因此必须看三层。

## Layer 1：站内库存

```text
Published Artwork 数
Image Sitemap Artwork 数
```

目标：

```text
Image Sitemap / Published ≈ 100%
```

## Layer 2：Googlebot-Image 抓取

通过 Cloudflare 请求日志/分析能力统计 `/media/*`：
- Googlebot-Image 请求数
- unique image URL
- 200 / 403 / 404 / 5xx
- P50 / P95 响应时间

重点告警：

```text
Googlebot-Image 403 > 0
持续 5xx
published sitemap 图片大量 404
```

这一层可以区分“没抓到”和“抓到了但没曝光”。

## Layer 3：Search Console

使用：

```text
Performance → Search type = Image
```

关注：
- impressions
- clicks
- CTR
- average position
- top queries
- top pages
- country / device

核心派生指标：

```text
有 Image impression 的 Artwork 数 / Published Artwork 数
```

## 首轮人工抽样

URL Inspection 抽 10–20 个 Artwork，覆盖 PC / Mobile、多个神话体系和 Style：
- URL 可索引
- canonical 正确
- rendered HTML 有主 `<img>`
- image URL 200
- structured data 无关键错误
- image sitemap 已包含

---

# 5. P1：排名、CTR 与性能

P0 稳定后再做。

## P1-1. `srcset + sizes`

项目已有 `cloudflareImageSrcSet()`，Artwork Detail 可接入响应式派生图。

目的主要是 LCP、移动端体验和传输体积，不是图片是否能被收录的前置条件。

规则：
- `src` 保留稳定 fallback。
- 首屏不 lazy-load。
- below-fold lazy-load。
- width / height 防 CLS。

涉及：
- `src/pages/wallpaper/[slug].astro`
- `src/lib/media/cloudflare-images.ts`

## P1-2. `max-image-preview:large`

公开 indexable 页面可增加：

```text
index,follow,max-image-preview:large
```

它影响 Google 可以展示的预览尺寸，不是图片索引开关，所以归 P1。

涉及：
- `src/lib/seo/page-policy.ts`
- `tests/page-seo-policy.test.ts`

## P1-3. OG 图片 metadata

补：

```text
og:image:width
og:image:height
og:image:alt
```

涉及：`src/components/BaseHead.astro`

## P1-4. Artwork 短摘要

从真实 metadata 生成一句话即可：

```text
这是一张以希腊神话角色阿尔忒弥斯（Artemis）为主题的 Anime 风格手机壁纸，原图尺寸 1024 × 1536。
```

不生成大段模板 SEO 文案。

## P1-5. 内链

保持：

```text
Mythology ↔ World ↔ Character ↔ Artwork
```

Artwork 至少链接 Character、Mythology、World（若有）、Related Artwork；Character 链接其高质量 Artwork。

---

# 6. P2：英文 Google Images 流量

潜在核心词：
- `Artemis wallpaper`
- `Odin wallpaper`
- `Anubis wallpaper`
- `Greek mythology wallpaper`
- `Norse mythology wallpaper`

V1：中文页面保留可靠英文实体名、稳定英文 slug，不建立半成品 `/en/`。

V2：只有 navigation、title、description、H1、实体摘要、Artwork summary、facts、内链和 rights 文案都完整英文后，再上线 `/en/`，并同时实现：

```text
self canonical
hreflang zh-CN
hreflang en
x-default（如需要）
sitemap language alternates
```

是否启动 V2 由 Search Console 英文 query 数据决定。

---

# 7. P3：License / AI Provenance

这些有品牌与可信度价值，但**不是 Google Images 收录前置条件**。

## License

先明确产品政策：个人使用、转载、商业使用、二创、用户生成作品的权利，再输出 `license / acquireLicensePage / copyrightNotice`。

不要先为了 SEO 编造机器可读许可。

## IPTC

可用于让下载后的图片继续携带 AI 来源信息，适合 Pinterest / Zedge 等跨站传播场景；不是排名必要条件。

## C2PA

长期评估 Content Credentials：

```text
AI Generate → C2PA manifest → 签名 → R2 original
```

不进入近期 SEO Roadmap。

---

# 8. SafeSearch

公共 Google Images 获客库不收 explicit 成人内容。

如果未来存在成人内容区：
- 独立页面范围
- 按 Google SafeSearch 指南标识
- 不与普通神话壁纸聚合页混排

参考：
https://developers.google.com/search/docs/appearance/google-images#optimize-for-safesearch

---

# 9. Discover 单独处理

Discover 不作为 Google Images P0/P1 验收标准。

未来如果专门优化 Discover，可考虑：
- `max-image-preview:large`
- 高质量大图
- 必要时生成单独 Social / Discover Preview

但**Google Images primary image 仍使用原 Artwork**；不要为了 Discover 把 9:16 手机壁纸强裁成 16:9。

---

# 10. 页面关键词职责

| 页面 | 主要意图 |
|---|---|
| `/character/artemis/` | Artemis / Artemis wallpaper / 阿尔忒弥斯壁纸 |
| `/wallpaper/artemis-anime-m-01/` | Artemis anime/mobile wallpaper 长尾 |
| `/mythology/greek/` | Greek mythology / Greek mythology wallpapers |
| 筛选 URL | `noindex,follow`，不制造薄页 |

V1 不增加 `/artemis-wallpapers/` 这类重复 Hub。

---

# 11. 实施顺序

## Phase A — P0 Crawl & Index

1. 发布图片 key immutable。
2. 禁止覆盖已公开 R2 key。
3. `/media` 抓取契约测试。
4. Image Sitemap 回归测试。
5. 统一 Artwork title / alt / facts。
6. 增加 `primaryImageOfPage`。
7. Character 页面承担 Wallpaper Hub。
8. Search Console Domain Property + sitemap index。
9. Googlebot-Image `/media/*` 监控。
10. URL Inspection 抽样。

### Phase A 验收

- [ ] Published image URL immutable
- [ ] GET / HEAD 200，MIME 正确
- [ ] robots 不屏蔽 `/media`
- [ ] 每个 Artwork 有真实 `<img src>` + alt + width + height
- [ ] Published Artwork 全部进入 image sitemap
- [ ] draft / hidden 不进入 sitemap
- [ ] Artwork 有 `primaryImageOfPage`
- [ ] Character 没有重复 Wallpaper Hub URL
- [ ] 可观察 Googlebot-Image 200/403/404/5xx
- [ ] Search Console 完成首轮抽样

## Phase B — P1 Ranking & UX

11. Artwork `srcset + sizes`
12. `max-image-preview:large`
13. OG width / height / alt
14. Artwork short semantic summary
15. 内链优化
16. 根据 CWV/日志优化图片 delivery

## Phase C — International

17. 分析英文 Image queries
18. 完整英文内容
19. `/en/` + hreflang

## Phase D — Provenance

20. 定义图片许可
21. License structured data
22. IPTC
23. C2PA 可行性评估

---

# 12. 代码映射

| 目标 | 文件 |
|---|---|
| immutable R2 key | `scripts/import-character-artworks.mjs` + 发布管线 |
| Media contract | `src/pages/media/[...key].ts` |
| Artwork 主图 / structured data | `src/pages/wallpaper/[slug].astro` |
| Responsive image | `src/pages/wallpaper/[slug].astro` + `src/lib/media/cloudflare-images.ts` |
| robots preview | `src/lib/seo/page-policy.ts` |
| OG image metadata | `src/components/BaseHead.astro` |
| Character Wallpaper Hub | `src/pages/character/[slug].astro` |
| Image Sitemap | `src/pages/sitemap-images.xml.ts` |
| Sitemap index | `src/pages/sitemap-index.xml.ts` |
| License policy | `src/pages/copyright.astro` |
| Tests | `tests/sitemap.test.ts`、`tests/page-seo-policy.test.ts`、建议新增 `tests/google-images-seo.test.ts` |

---

# 13. 28 / 90 天规则

## 0–28 天：验证抓取

看：
- Googlebot-Image 是否持续抓 `/media`
- 403 / 404 / 5xx
- Image Sitemap 是否稳定
- 有 Image impression 的 Artwork 比例
- canonical / image fetch 是否异常

期间不要频繁换 URL、title、页面结构。

## 29–90 天：用真实数据扩内容

高曝光低 CTR：优化 title、preferred image、描述、视觉质量。

某 Character 搜索增长：增加该角色 Style、PC/Mobile Artwork，不立即新建第二个 Wallpaper Hub。

某 Mythology 搜索增长：强化 Mythology 页的 Character / World / Artwork 内容。

英文 query 持续增长：再启动 `/en/`。

---

# 14. 明确不做

- 不为筛选组合生成索引页。
- 不创建与 Character 页抢词的 `{character}-wallpapers` 页面。
- 不在 alt 中堆关键词。
- 不批量修改历史图片 URL。
- 不为了 Discover 改 Google Images 主图比例。
- 不把 License / IPTC / C2PA 当收录前置条件。
- 不为了 schema 完整度过度设计复杂 JSON-LD graph。
- 不提前重构整套 R2/CDN，先看真实抓取和性能数据。
- 不批量生成“一张图 + 模板 SEO 文案”的薄页面。

---

## 最终原则

> **Google Images SEO 对 MythCanvas 的第一优先级不是增加更多 SEO 标签，而是建立“稳定图片 URL → Googlebot-Image 抓取 → 高质量 Artwork/Character Landing Page → Search Console 反馈”的闭环。**
