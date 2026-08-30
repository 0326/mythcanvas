# MythCanvas Google Images SEO 完整方案

> 文档定位：`docs/SEO_OPTIMIZATION_PLAN.md` 的图片搜索专项方案。  
> 目标：让 MythCanvas 的神话角色、神域与壁纸作品稳定被 Google 发现、理解、索引，并通过 Google Images / 图片型 Web Search / Discover 获得长期自然流量。  
> 基线日期：2026-08-31。

---

## 1. 目标与原则

MythCanvas 是强视觉内容产品，Google Images 不应被视为普通 SEO 的附属渠道，而应作为核心获客入口之一。

核心搜索意图包括：

- `Artemis wallpaper`
- `Artemis anime wallpaper`
- `Greek goddess wallpaper 4K`
- `Odin wallpaper 4K`
- `Anubis phone wallpaper`
- `嫦娥壁纸`
- `希腊神话壁纸`
- `北欧神话 PC 壁纸`

核心关系仍然是：

```text
Mythology ↔ World ↔ Character ↔ Artwork
```

Google Images SEO 遵循四条原则：

1. **图片必须可发现**：公开、可抓取、稳定 URL、真实 `<img>`、进入 image sitemap。
2. **图片必须可理解**：页面实体语义、alt、标题、上下文、结构化数据共同描述图片。
3. **图片必须有高质量 Landing Page**：每张公开 Artwork 都有独立页面，而不是只存在于瀑布流或 JS Lightbox。
4. **不能为了 SEO 制造低价值页面**：不自动索引任意筛选组合，不用生成式 AI 批量制造只有一张图和关键词的薄页面。

Google 官方依据：

- Image SEO Best Practices: https://developers.google.com/search/docs/appearance/google-images
- Image Sitemaps: https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
- Image Metadata / Licensing: https://developers.google.com/search/docs/appearance/structured-data/image-license-metadata
- Robots Meta Tags: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
- Google Discover: https://developers.google.com/search/docs/appearance/google-discover

---

## 2. 当前实现审计

### 2.1 已经具备的基础

截至 2026-08-31，项目已经完成 Google Images 的大部分“可发现性”基础：

| 能力 | 当前状态 | 位置 |
|---|---|---|
| Artwork 独立 Landing Page | ✅ | `src/pages/wallpaper/[slug].astro` |
| 页面 canonical / robots | ✅ | `src/components/BaseHead.astro` + `src/lib/seo/page-policy.ts` |
| `og:image` | ✅ | `src/components/BaseHead.astro` |
| Artwork 主图真实 `<img src>` | ✅ | `src/pages/wallpaper/[slug].astro` |
| 主图 alt / width / height | ✅ | `ImageAsset` + Artwork 页面 |
| 主图 LCP `fetchpriority="high"` | ✅ | Artwork 页面 |
| Artwork `ImageObject` JSON-LD | ✅ 基础版 | Artwork 页面 |
| Breadcrumb JSON-LD | ✅ | Artwork 页面 |
| 动态 image sitemap | ✅ | `src/pages/sitemap-images.xml.ts` |
| Artwork image sitemap 分片 | ✅ | `SITEMAP_SHARD_SIZE` |
| Mythology / World / Character 主图进入 image sitemap | ✅ | `src/pages/sitemap-images.xml.ts` |
| R2 图片公开稳定 URL | ✅ | `/media/[...key]` |
| 图片正确 MIME | ✅ | `src/pages/media/[...key].ts` |
| 长缓存 / immutable | ✅ | `Cache-Control: public, max-age=31536000, immutable` |
| Cloudflare 图片转换工具 | ✅ | `src/lib/media/cloudflare-images.ts` |
| `srcset` 生成能力 | ✅ 工具已有 | `cloudflareImageSrcSet()` |
| 版权内容页 | ✅ 基础版 | `/copyright/` |
| 公版神话 + AI 原创定位 | ✅ | 内容模型与导入脚本 |

因此本方案不重做普通 sitemap、canonical 或 Artwork 路由。

### 2.2 当前主要缺口

真正需要补的是“图片专属信号”和“搜索闭环”：

1. Artwork Detail 主图目前没有 `srcset + sizes`，Cloudflare 响应式能力尚未用于核心 Landing Page。
2. 当前 `ImageObject` 使用 `author`，而 Google 图片许可元数据重点支持的是 `creator / creditText / copyrightNotice / license`。
3. `ImageObject` 没有稳定 `@id`，也没有与 `WebPage.primaryImageOfPage` 建立明确关系。
4. 现有 `license` 是文本，不是 Google Licensable 所要求的许可 URL。
5. Artwork 数据模型对 AI provenance 的表达不完整；数据库实际已有 `source_type='ai'`，TypeScript `LicenseMeta.sourceType` 尚未显式包含 `ai`。
6. 页面 robots 当前未主动声明 `max-image-preview:large`。
7. 图片导入路径虽然有角色 / 画风 / 设备语义，但最终文件名仍类似 `anime_m_01.png`，搜索语义可以继续增强。
8. 目前缺 Search Console 的 Google Images 专项验收和指标基线。
9. 缺针对 Google 图片抓取的自动化回归测试。
10. AI 图片暂未嵌入 IPTC Digital Source Type / C2PA，跨站分发后的来源透明度不足。

---

## 3. 目标架构

```text
Artwork 发布
   │
   ├─ D1 Artwork metadata
   │    ├─ title / slug
   │    ├─ Character / Mythology / World / Style
   │    ├─ width / height / alt
   │    ├─ source type / creator / rights
   │    └─ publish status
   │
   ├─ R2 原图
   │    └─ /media/characters/.../semantic-file.webp
   │
   ├─ Wallpaper Landing Page
   │    ├─ canonical
   │    ├─ title / description / H1
   │    ├─ <img src srcset sizes alt width height>
   │    ├─ surrounding semantic copy
   │    ├─ WebPage.primaryImageOfPage
   │    ├─ ImageObject
   │    ├─ og:image
   │    └─ internal entity links
   │
   ├─ sitemap-pages.xml
   └─ sitemap-images.xml
            │
            ▼
      Googlebot / Googlebot-Image
            │
            ▼
       Google Search Index
            │
      ┌─────┴──────────┐
      ▼                ▼
Google Images       Web / Discover
```

---

# 4. P0：必须完成

P0 目标：确保每张已发布壁纸都拥有完整、统一、可测试的图片搜索信号。

## P0-1. 强化 Artwork `ImageObject`

当前 Artwork 已有 `ImageObject`，应升级为 Google Images 可直接消费的结构。

建议结构：

```json
[
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://mythcanvas.space/wallpaper/artemis-anime-m-01/#webpage",
    "url": "https://mythcanvas.space/wallpaper/artemis-anime-m-01/",
    "name": "阿尔忒弥斯 · Anime · 手机壁纸",
    "primaryImageOfPage": {
      "@id": "https://mythcanvas.space/wallpaper/artemis-anime-m-01/#primaryimage"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "@id": "https://mythcanvas.space/wallpaper/artemis-anime-m-01/#primaryimage",
    "contentUrl": "https://mythcanvas.space/media/characters/artemis/styles/anime/mobile-wallpaper/artemis-anime-mobile-01.webp",
    "name": "阿尔忒弥斯 · Anime · 手机壁纸",
    "description": "阿尔忒弥斯，Anime 风格手机壁纸",
    "width": 1024,
    "height": 1536,
    "creator": {
      "@type": "Organization",
      "name": "MythCanvas"
    },
    "creditText": "MythCanvas",
    "copyrightNotice": "MythCanvas"
  }
]
```

### 实现要求

- 使用 `creator`，不要只依赖当前 `author`。
- 为 `WebPage` 和主图分别建立稳定 `@id`。
- `primaryImageOfPage` 指向原图对应的 `ImageObject`。
- `contentUrl` 必须始终指向实际可访问原图，不指向登录接口、临时 URL、blob URL。
- `name` 与页面主题一致，不做关键词堆砌。
- `description` 可基于现有 `alt`，但不应简单复制一长串 SEO 关键词。

### 涉及文件

- `src/pages/wallpaper/[slug].astro`
- 如需抽象：新增 `src/lib/seo/image-structured-data.ts`

---

## P0-2. 明确图片许可与来源模型

Google Images 支持在图片结果中展示 Creator / Credit / Licensing 信息。

当前 `Artwork.license` 已具备：

```ts
{
  sourceType,
  license,
  creator
}
```

但需要把“展示文本”和“机器可读 URL”分开。

推荐扩展：

```ts
export type LicenseMeta = {
  sourceType: 'prototype' | 'platform' | 'creator' | 'public-domain' | 'ai';
  license: string;
  licenseUrl?: string;
  creator?: string;
  creditText?: string;
  copyrightNotice?: string;
  acquireLicensePage?: string;
};
```

### 规则

- `license`：页面可读文本，例如 `MythCanvas AI-generated original`。
- `licenseUrl`：必须是实际解释许可条件的 URL，而不是随便填 `/copyright/`。
- `acquireLicensePage`：只有真正存在“获取授权 / 使用许可”流程时才填写。
- 若免费壁纸仅允许个人使用，应先在法律页明确规则，再输出对应 structured data。
- 公有领域的“神话角色”不等于 AI 生成图片本身自动属于公有领域；角色素材来源和具体图片权利应分开描述。

### 重要

在具体授权政策未定稿之前：

**可以先输出 `creator / creditText / copyrightNotice`，不要为了获得 Licensable badge 虚构 `license` URL。**

### 涉及文件

- `src/lib/content/types.ts`
- `src/lib/content/repositories/artwork.ts`
- `src/pages/copyright.astro`
- 后续 D1 migration（仅在真正实施时创建）

---

## P0-3. Artwork Detail 使用响应式图片

Google 官方建议响应式图片；同时这是 Core Web Vitals 的直接收益。

当前已经有：

```ts
cloudflareImageSrcSet()
```

Artwork Detail 应从：

```html
<img src="original" ... />
```

升级为：

```html
<img
  src="original"
  srcset="... 640w, ... 960w, ... 1440w, ... 1920w"
  sizes="(max-width: 900px) 100vw, 68vw"
  alt="..."
  width="..."
  height="..."
  fetchpriority="high"
  decoding="async"
/>
```

### 原则

- `src` 仍保持稳定原始内容 URL，确保 Google 可以发现原图。
- `srcset` 使用 Cloudflare Image Transformations。
- 原图页面不要只输出 `/cdn-cgi/image/...` 而彻底丢失稳定 source URL。
- 首屏主图不 lazy-load。
- 设备 Preview、Related Artwork 等 below-fold 图片继续 `loading="lazy"`。
- 维持 width / height，避免 CLS。

### 推荐宽度

PC / 横版：

```text
640 / 960 / 1280 / 1600 / 1920
```

手机 / 竖版：

```text
480 / 720 / 960 / 1280
```

### 涉及文件

- `src/pages/wallpaper/[slug].astro`
- `src/lib/media/cloudflare-images.ts`

---

## P0-4. 对可索引页启用大图预览

Google 支持：

```text
max-image-preview:large
```

建议所有公开可索引实体 / Artwork 页面最终输出：

```html
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="googlebot" content="index,follow,max-image-preview:large">
```

这不仅影响 Google Images，也影响普通 Web Search 和 Discover 的大图展示能力。

### 注意

- `noindex` 页面不要为了统一模板而错误改成 index。
- 推荐在 `page-policy.ts` 中只对允许索引的公开页面追加该 directive。

### 涉及文件

- `src/lib/seo/page-policy.ts`
- `src/components/BaseHead.astro`
- `tests/page-seo-policy.test.ts`

---

## P0-5. 保持并强化 Image Sitemap

当前 `sitemap-images.xml.ts` 的方向已经正确：

```xml
<url>
  <loc>Artwork Landing Page</loc>
  <image:image>
    <image:loc>Actual Image URL</image:loc>
  </image:image>
</url>
```

### 当前方案继续保留

- Artwork 每片 1000 条。
- 只输出 `published + approved` 内容。
- Artwork、Character、World、Mythology 主图分开处理。
- image URL 必须绝对化。

### 不要做

Google 已从 Image Sitemap 文档中移除以下字段：

- `image:caption`
- `image:title`
- `image:license`
- `image:geo_location`

**不要为了“SEO 更完整”重新加这些已废弃标签。**

图片标题、许可等信息应由 Landing Page + structured data 表达。

### 增加测试

至少覆盖：

- published artwork 出现在 image sitemap。
- hidden / draft artwork 不出现。
- image URL 正确 XML escape。
- image sitemap 的 `<loc>` 指向 `/wallpaper/{slug}/`。
- `<image:loc>` 对应真实 `/media/...` URL。
- 分片边界正确。

### 涉及文件

- `src/pages/sitemap-images.xml.ts`
- `tests/sitemap.test.ts`

---

## P0-6. 图片抓取 HTTP 契约

`/media/[...key]` 当前实现整体正确，需要将以下行为作为不可回归契约：

```text
GET /media/...      -> 200 + image/*
HEAD /media/...     -> 200
404 object          -> 404
Cache-Control       -> public, max-age=31536000, immutable
Content-Type        -> image/jpeg|png|webp|avif...
```

### 必须保证

- 不要求登录。
- 不依赖 Cookie。
- 不根据 User-Agent 阻止 Googlebot-Image。
- 不做会阻止 Google 图片抓取的 Hotlink 防盗链。
- robots.txt 不阻止 `/media/`。
- 图片 URL 发布后尽量永久稳定。

### 推荐补测试

对 media route / MIME fallback 建立测试，避免以后改 R2 delivery 时导致图片变成 `application/octet-stream` 或 403。

---

## P0-7. 主图语义生成规则

Google 会结合页面上下文、alt、caption、文件名和 title 理解图片。

MythCanvas 需要统一 Artwork 语义生成器，而不是在各导入脚本自由拼字符串。

推荐概念模型：

```text
Entity + Interpretation/Variant + Style + Device/Ratio + Mythology + Wallpaper Intent
```

但不同字段承担不同职责。

### H1 / Artwork title

自然、可读：

```text
阿尔忒弥斯 · 月神演绎 · Anime
```

不要：

```text
Artemis 4K HD AI Anime Greek Goddess Mobile Phone Wallpaper Free Download
```

### Alt

描述图片本身和用途：

```text
阿尔忒弥斯月神演绎，Anime 风格手机壁纸
```

### 页面显式事实块

可补充：

```text
角色：阿尔忒弥斯 / Artemis
神话：希腊神话 / Greek Mythology
画风：Anime
设备：Mobile
尺寸：1024 × 1536
来源：AI-generated original by MythCanvas
```

这样英文实体词不需要全部硬塞进 alt。

### URL / 文件名

现有 R2 路径已经包含：

```text
characters/{character}/styles/{style}/{outputSpec}/...
```

这是好的。

未来新资产建议把文件名也从：

```text
anime_m_01.png
```

逐步升级成：

```text
artemis-anime-mobile-01.webp
```

但**不要为了 SEO 批量重命名已经上线的图片 URL**。稳定 URL 比文件名优化更重要。

---

# 5. P1：提高排名与 CTR

## P1-1. Artwork Landing Page 信息密度

每张 Artwork 页面至少应该具备：

1. H1
2. 高清主图
3. 一段明确、非模板垃圾的描述
4. Character / Mythology / World 关系
5. Style
6. Device / Aspect Ratio
7. Resolution
8. AI / 来源信息
9. 下载行为
10. AI 重绘入口
11. 相关 Artwork
12. 相关 Character / World 内链

当前页面已经有多数信息，下一步重点不是增加大段 SEO 文案，而是让数据更明确、可抽取。

### 推荐增加一个简短语义摘要

例如：

```text
这是一张以希腊神话角色阿尔忒弥斯（Artemis）为主题的 Anime 风格手机壁纸，
采用月神演绎与夜色场景，原图尺寸为 1024×1536。
```

该段应由真实 Artwork metadata 生成，不凭空编造画面内容。

---

## P1-2. Artwork 内链图谱

避免 Artwork 成为孤岛。

推荐：

```text
Mythology
  └─ Character
      ├─ Artwork A
      ├─ Artwork B
      └─ Artwork C

Artwork A
  ├─ Character
  ├─ Mythology
  ├─ World（若有）
  ├─ Same Style
  └─ Related Artwork
```

锚文本应描述实体：

```text
阿尔忒弥斯
希腊神话
奥林匹斯
更多 Anime 风格神话壁纸
```

不要所有链接都写“查看更多”。

---

## P1-3. Google Images 专属高价值 Landing Pages

不要索引所有筛选参数，但可以建立少量真正有内容的长期 Landing Page。

推荐优先级：

### Character × Wallpaper

```text
/artemis-wallpapers/          （未来可考虑；当前也可由 Character 页面承担）
/character/artemis/
```

目标词：

```text
Artemis wallpaper
Artemis 4K wallpaper
阿尔忒弥斯壁纸
```

### Mythology × Wallpaper

```text
Greek mythology wallpapers
Norse mythology wallpapers
Chinese mythology wallpapers
```

### Device

仅当页面拥有足够作品、介绍和真实长期价值时：

```text
Mobile mythology wallpapers
Desktop mythology wallpapers
```

### 不建议

自动制造：

```text
?style=anime&device=mobile&mood=night&sort=popular
```

并让其进入索引。

这些仍应 `noindex,follow` + canonical 收敛。

---

## P1-4. `og:image` / Preferred Image

Artwork 页面现在已经把作品原图传给 `BaseHead`，这是正确方向。

推荐：

- Artwork 页：`og:image` 默认使用作品图，而非品牌通用图。
- Character / World / Mythology：使用各自 Hero。
- 加上 `og:image:width / og:image:height / og:image:alt`，提高社交平台一致性。
- Google 主要选择仍是自动的；`primaryImageOfPage` + `og:image` 是明确提示，不是排名保证。

### 竖版图片与 Discover

Google Discover 更偏好高质量大图，并建议至少 1200px 宽的大图预览。

对于 9:16 手机壁纸：

- Google Images 仍应使用原始竖图。
- 不要为了 Discover 强行把源壁纸裁成 16:9。
- 如果后续需要专门做 Discover，可单独产生社会化 16:9 Preview，但不要替代 Artwork 的 primary image。

---

## P1-5. 图片质量与格式

原则：

- 原图保留足够分辨率。
- 页面展示使用响应式衍生图。
- Cloudflare `format=auto` 继续使用 AVIF/WebP 等现代格式。
- 不为搜索爬虫特殊返回与用户不同的图片。
- 不在主图上叠加大面积 SEO 文案、水印或下载按钮。

### 质量建议

- Listing：72–82 quality。
- Detail 主图：82–90 quality，具体以视觉回归与体积为准。
- 原始下载文件不经过过度压缩。

---

# 6. P2：AI 图片来源透明度与跨站传播

## P2-1. IPTC Digital Source Type

Google 支持读取 IPTC 的 AI / 数字来源信息，包括：

```text
trainedAlgorithmicMedia
compositeSynthetic
algorithmicMedia
compositeWithTrainedAlgorithmicMedia
```

MythCanvas 的纯 AI 生成作品可以评估使用：

```text
trainedAlgorithmicMedia
```

### 为什么放 P2

对于 Google Images，structured data 已足以提供主要 metadata；IPTC 更大的价值在于：

- 用户下载后 metadata 仍随文件传播。
- 图片被转载到 Pinterest / Zedge / 其他网站时仍保留来源信息。
- 为未来 AI transparency 做准备。

### 注意

Cloudflare / 图片处理流程可能剥离 metadata，因此：

- Google 页面端仍以 JSON-LD 为权威来源。
- 下载原图可保留 IPTC。
- 需要实测 R2 原图、Cloudflare transformed variant 对 metadata 的保留行为。

---

## P2-2. C2PA / Content Credentials

Google 的 “About this image” 可以利用符合要求的 C2PA metadata 展示图片来源或 AI 编辑信息。

长期可以评估：

```text
生成完成
  ↓
写入 C2PA manifest
  ↓
签名
  ↓
R2 original
```

但这不是当前 Google Images 收录的前置条件，不放入 P0。

---

# 7. 多语言与国际 Google Images 流量

当前 SEO 总体策略仍然正确：**没有完整英文内容前，不建立半成品英文重复页。**

但 Google Images 国际流量对 MythCanvas 很重要。

V1 建议：

- 中文页面保留角色英文正式名，例如 `阿尔忒弥斯 · Artemis`。
- Artwork facts 中展示英文实体名。
- slug 使用稳定英文 / 拉丁转写。
- structured data 的实体关系保持稳定。
- alt 以当前页面主要语言为主，不进行中英关键词堆砌。

V2 只有当以下内容都能完整翻译后再上线 `/en/`：

- navigation
- title / description
- H1
- character / mythology facts
- artwork summary
- related links
- license / rights copy

并同时实现：

```text
self canonical
hreflang zh-CN
hreflang en
x-default（如需要）
sitemap language alternates
```

国际化真正上线后，英文 Google Images 长尾会成为明显增量。

---

# 8. SafeSearch 与内容分级

MythCanvas 部分神话艺术未来可能出现性感、成人向或边缘内容，因此必须提前定义图片搜索边界。

原则：

- 公共 Wallpaper SEO 库只收录符合公开站点内容标准的作品。
- 明显成人 / explicit 内容不进入公开 Google Images 获客库。
- 如果未来存在独立成人内容区，应按 Google SafeSearch 指南独立标识页面 / 站点区域，不与普通神话壁纸混排。
- 不要让一个少量成人内容区域导致整个站点被 SafeSearch 误判。

官方参考：

https://developers.google.com/search/docs/appearance/google-images#optimize-for-safesearch

---

# 9. Search Console 上线与验证流程

Google Images 没有“上传图片到 Google”的独立后台。

正确流程：

```text
网站发布
   ↓
Search Console 验证 Domain Property
   ↓
提交 sitemap index
   ↓
URL Inspection 验证 Wallpaper page
   ↓
确认 Googlebot 可见主图
   ↓
等待抓取 / 索引
   ↓
Performance → Search type: Image
```

## 9.1 Search Console 必做

### Property

优先使用 Domain Property：

```text
mythcanvas.space
```

如果未来图片使用独立 CDN 域名，也应验证 CDN domain。

当前 `/media/` 与主站同域，因此无需额外 CDN Property。

### 提交 Sitemap

只需要提交 sitemap index：

```text
https://mythcanvas.space/sitemap-index.xml
```

由 sitemap index 引用 page / image sitemap 分片。

不需要人工逐张提交图片。

### URL Inspection 抽样

首轮选 10–20 个页面：

- 5 个 Character Artwork
- 3 个 World Artwork
- PC / Mobile 都覆盖
- 不同神话体系
- 不同 style

确认：

- URL 可索引。
- canonical 与当前 URL 一致。
- rendered HTML 中存在主 `<img>`。
- image URL 返回 200。
- structured data 无关键错误。

---

# 10. 指标体系

## 10.1 核心指标

Search Console Performance 里使用：

```text
Search type = Image
```

监控：

- Image impressions
- Image clicks
- CTR
- Average position
- Top queries
- Top pages
- Country
- Device

## 10.2 业务指标

Google Images 流量进入 MythCanvas 后继续看：

```text
Image Search session
  ↓
Artwork Detail
  ↓
Download / Favorite / Related Artwork / AI Create
```

建议至少关联：

- Google organic → Artwork page sessions
- Artwork download conversion
- Related artwork CTR
- Character page CTR
- AI 重绘 CTR
- Returning user rate

## 10.3 内容指标

每个 Artifact 维度：

```text
Character
Mythology
Style
Device
Aspect
```

比较：

- impressions / artwork
- clicks / artwork
- CTR
- downloads

用真实 Search Console 数据决定未来优先生产哪些角色和风格，而不是只凭主观判断。

---

# 11. 28 / 90 天验收目标

Google 不保证新图片立即索引，因此不以“发布后一周必须排名”作为验收。

## 上线技术验收

P0 完成后必须满足：

- [ ] 每个公开 Artwork 页面只有一个 canonical。
- [ ] Artwork 主图存在真实 `<img src>`。
- [ ] 主图拥有 `srcset + sizes`。
- [ ] 主图拥有准确 alt / width / height。
- [ ] 主图 `src` 返回 200 + 正确 image MIME。
- [ ] indexable Artwork 输出 `max-image-preview:large`。
- [ ] Artwork JSON-LD 含 `WebPage.primaryImageOfPage`。
- [ ] Artwork `ImageObject` 含稳定 `@id` 和 `contentUrl`。
- [ ] `creator / creditText / copyrightNotice` 至少按真实数据输出。
- [ ] 不输出虚假的 license / acquireLicensePage。
- [ ] 所有 published Artwork 进入 image sitemap。
- [ ] draft / hidden Artwork 不进入 sitemap。
- [ ] robots.txt 不屏蔽 `/media/`。
- [ ] 自动化测试覆盖 image sitemap、primary image、robots directive。

## 28 天观察

建立基线：

- Google Images impressions 是否持续产生。
- 有曝光 Artwork 占 published Artwork 的比例。
- Character / Mythology / Device 的曝光差异。
- 是否出现明显 crawl / canonical / image fetch 错误。

## 90 天优化

根据查询数据：

- 增加高曝光低 CTR 页面标题 /描述质量。
- 增加高点击 Character 的 Artwork 供给。
- 为有稳定搜索需求的 Mythology / Device 建高质量 Landing Page。
- 决定是否启动完整英文 `/en/`。
- 决定是否将 IPTC / C2PA 纳入正式生成管线。

---

# 12. 推荐实施顺序

## Phase A — P0 Image Search Contract

1. Artwork structured data 升级。
2. License / provenance 数据模型补齐。
3. Artwork detail `srcset + sizes`。
4. `max-image-preview:large`。
5. Image sitemap 自动化测试。
6. Media route 抓取契约测试。
7. Search Console 提交和抽样验证。

## Phase B — Ranking Quality

8. Artwork semantic summary。
9. Character / Mythology / Style 内链优化。
10. Artwork filename 新资产规范。
11. OG image width / height / alt。
12. 根据 Search Console 建高价值 Wallpaper Landing Pages。

## Phase C — International + AI Provenance

13. 完整英文内容 + hreflang。
14. 下载原图 IPTC AI metadata。
15. C2PA / Content Credentials 可行性评估。
16. Google Images 数据驱动内容生产。

---

# 13. 代码改造映射

| 目标 | 文件 |
|---|---|
| Artwork primary image structured data | `src/pages/wallpaper/[slug].astro` |
| Image structured-data helper | `src/lib/seo/image-structured-data.ts`（建议新增） |
| Robots `max-image-preview:large` | `src/lib/seo/page-policy.ts` |
| OG image metadata | `src/components/BaseHead.astro` |
| Responsive main image | `src/pages/wallpaper/[slug].astro` |
| Responsive URL helper | `src/lib/media/cloudflare-images.ts` |
| Artwork provenance / license typing | `src/lib/content/types.ts` |
| D1 mapping | `src/lib/content/repositories/artwork.ts` |
| Artwork import semantics | `scripts/import-character-artworks.mjs` |
| Image sitemap | `src/pages/sitemap-images.xml.ts` |
| Media delivery | `src/pages/media/[...key].ts` |
| Copyright / license wording | `src/pages/copyright.astro` |
| SEO policy tests | `tests/page-seo-policy.test.ts` |
| Sitemap tests | `tests/sitemap.test.ts` |
| Image SEO contract tests | `tests/google-images-seo.test.ts`（建议新增） |

---

# 14. 不做的事情

为了避免“SEO 优化”反而破坏产品与搜索质量，明确以下非目标：

- 不为每种筛选组合生成索引页。
- 不在 alt 中堆砌几十个英文关键词。
- 不给历史图片批量换 URL 只为了文件名更漂亮。
- 不使用 CSS background 代替 Artwork 主 `<img>`。
- 不给 Googlebot 返回与用户不同的图片。
- 不为了 Licensable badge 虚构版权协议。
- 不把同一张图复制成多个 URL 争取索引数量。
- 不把低质量批量 AI 内容直接全部放入公开 SEO 库。
- 不重新使用已被 Google Image Sitemap 废弃的 `image:title / image:caption / image:license`。

---

# 15. 最终判断

MythCanvas 当前并不是“还没做 Google Images SEO”，而是已经完成了约 **60–70% 的抓取基础设施**：独立 Artwork 页面、主图语义、OG、ImageObject、动态 image sitemap、R2 稳定交付都已经存在。

下一阶段真正有价值的是把它从“搜索引擎能够发现图片”升级成：

> **Google 能明确理解这是哪位神话角色、属于哪套神话体系、是什么画风与设备用途、谁创建了图片、图片如何使用，并把用户落到一个高质量可下载 / 可继续探索 / 可 AI 重绘的 Landing Page。**

完成 P0 后，再通过 Search Console `Search type = Image` 的真实数据决定后续内容生产与国际化优先级，而不是继续盲目增加 SEO 字段。
