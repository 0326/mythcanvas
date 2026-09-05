# MythCanvas 多语言（i18n）架构方案

> Status: Proposed
> Scope: Web 前台、SEO/GEO、内容模型、D1、路由兼容、搜索与缓存
> Target: 在不破坏现有中文 URL / SEO 的前提下，为十大神话逐步支持全球多语言

## 1. 结论

MythCanvas 采用 **服务端语言路由 + 前端 UI 语言包 + 内容源本地化 + 语言无关 Canonical Semantic Model** 的混合架构。

核心原则：

1. **现有中文 URL 永久兼容**：简体中文是默认语言，不增加 `/zh-hans/` 前缀。
2. **其他语言使用独立 URL**：例如 `/en/character/athena`、`/ja/character/athena`。
3. **同一个 URL 永远只对应一种语言**：不根据 IP / `Accept-Language` 在相同 URL 下动态返回不同正文。
4. **locale 属于服务端请求上下文**：SSR 时就确定语言，核心内容不能等浏览器 JS 再翻译。
5. **UI 文案与业务内容分层**：按钮/导航走 typed dictionary；神话/神灵/神域等内容跟随各自内容源保存翻译。
6. **Canonical Design / Visual DNA / Prompt 语义不做多语言副本**：读者文案本地化，机器语义保持单一事实源。
7. **只发布完整的本地化内容页**：缺失正文翻译时不能生成“导航是日语、正文是中文”的可索引页面。

目标 URL：

```text
/character/athena             # zh-Hans，保持现有 URL
/en/character/athena          # English
/ja/character/athena          # 日本語
/es/character/athena          # Español
/fr/character/athena          # Français
/de/character/athena          # Deutsch
/zh-hant/character/athena     # 繁體中文
```

实体 slug **不翻译**，只翻译展示内容。

---

## 2. 目标语言

目标支持 7 个 locale：

| Locale | URL prefix | 阶段 | 说明 |
| --- | --- | --- | --- |
| `zh-Hans` | 无 | P0 | 默认语言，兼容现有 URL |
| `en` | `/en` | P0 | 全球默认国际语言 |
| `ja` | `/ja` | P0 | 日本神话及核心视觉用户 |
| `es` | `/es` | P0 | 西语市场，覆盖玛雅/阿兹特克相关用户 |
| `zh-Hant` | `/zh-hant` | P1 | 港澳台及海外华人 |
| `fr` | `/fr` | P1 | 法语市场 |
| `de` | `/de` | P1 | 德语市场、北欧/日耳曼神话相关用户 |

第一批先跑通 `zh-Hans + en + ja + es`，第二批再增加 `zh-Hant + fr + de`。

内部 locale 使用规范 BCP 47 标签；URL path 统一 lowercase，由 Locale Registry 完成 path 与 BCP 47 的映射。

---

## 3. 当前仓库 Review：主要风险

### 3.1 不能只打开 Astro `prefixDefaultLocale: false`

Astro 内置 i18n 的默认语言无前缀模式确实可以保留 `/character/...`，但其文件路由仍要求非默认语言存在对应 locale 页面目录。

如果直接配置：

```ts
i18n: {
  locales: ['zh-Hans', 'en', 'ja'],
  defaultLocale: 'zh-Hans',
  routing: { prefixDefaultLocale: false },
}
```

并不会自动让现有 `src/pages/character/[slug].astro` 同时响应 `/en/character/[slug]`。

当前仓库页面数量已经较多，不应该复制出：

```text
src/pages/en/...
src/pages/ja/...
src/pages/es/...
```

否则会形成多套路由壳，后续页面新增/重构容易漏语言版本。

**决策：使用 Astro `routing: "manual"` + Middleware 内部 rewrite，复用现有唯一一套路由文件。**

官方参考：

- https://docs.astro.build/en/guides/internationalization/
- https://docs.astro.build/en/guides/middleware/

### 3.2 当前 SEO policy 对 locale prefix 不安全

当前 `src/lib/seo/page-policy.ts` 直接按：

```text
/admin
/my
/login
/register
/password
/search
/character
/explore
/wallpaper
```

匹配 URL。

如果新增 `/en/search`、`/en/my`、`/en/character?...`，现有 noindex / filter policy 会失效。

**决策：所有 SEO route policy 必须先将 external pathname 解析为 `{ locale, basePathname }`，SEO 分类使用 `basePathname`，canonical 使用 external pathname。**

### 3.3 Header 和客户端脚本存在大量硬编码中文/根路径

当前 Header 同时硬编码：

- 首页 / 探索 / 神灵 / 神域 / 神话 / AI 创作
- `/explore/`、`/character/`、`/world/` 等路径
- 搜索、登录、我的宇宙 aria 文案
- 登录后通过 JS 将账号链接改成 `/my/`

不能只翻译 Astro 模板，而忽略 inline script 动态生成的可访问性文案和链接。

**决策：服务端 UI dictionary + locale-aware URL helper 必须同时覆盖静态模板和客户端动态文案。**

### 3.4 `BaseLayout` / `BaseHead` 当前默认中文写死

当前存在：

```html
<html lang="zh-CN">
```

以及 JSON-LD：

```json
"inLanguage": "zh-CN"
```

BaseHead 只有 canonical，没有 hreflang / `og:locale`。

**决策：HTML lang、JSON-LD inLanguage、canonical、hreflang、OG locale 全部统一从 Request Locale Context 生成。**

### 3.5 当前 D1 `name + name_en` 无法扩展

`mythologies / realms / characters / styles` 仍采用：

```text
name
name_en
summary
```

Repository 也直接读取 `name_en`。

7 种语言继续增加列会快速变成：

```text
name_en
name_ja
name_es
name_fr
name_de
...
```

**决策：实体基础表与 Translation Table 分离。**

### 3.6 不能把所有翻译都强行迁进 D1

当前 Architecture 明确允许 MythStory 长正文继续使用 Content / typed editorial files，直到编辑后台需求成立。

因此“业务内容全部进 D1”不是最优方案。

**决策：翻译跟随内容 Source of Truth：**

- UI 固定文案 → source-controlled dictionary
- D1 实体 → D1 translation table
- 静态/编辑型长文 → locale content files
- 用户生成内容 → 保留原文，未来按产品需求增加翻译层

### 3.7 Service Worker 的离线 fallback 会串语言

当前 `public/sw.js` 对所有 navigation 失败都 fallback 到 `/`。

因此用户离线访问：

```text
/en/character/athena
```

可能得到中文首页壳。

**决策：P1 修改为 locale-aware offline shell，或在完成 locale shell 前取消非默认语言 navigation 的中文 fallback。**

### 3.8 字体存在 CJK 地区字形风险

当前 BaseHead 全站加载 Source Han Serif **SC** 和 LXGW WenKai。日语、繁中虽然可能有 glyph fallback，但字形地区规范和排版效果不一定正确。

**决策：CJK heading font 按 locale 做字体策略；不要为了 7 种语言一次加载全部字体。**

### 3.9 Middleware rewrite 不能无脑代理所有 Method

Astro middleware rewrite 对携带 body 的请求需要谨慎处理。多语言公开内容页本质应是 GET / HEAD；写操作应走稳定、不带 locale 前缀的 `/api/*`。

**决策：**

- locale page rewrite 只覆盖 GET / HEAD
- `/api/*`、`/media/*`、静态资源不加 locale prefix
- 表单提交到稳定 API endpoint
- 若未来确实出现 locale-prefixed POST route，单独设计，不复用通用 rewrite

---

## 4. 目标架构

```text
Browser
   │
   │ /ja/character/athena
   ▼
Locale Middleware
   │
   ├─ externalPathname = /ja/character/athena
   ├─ locale           = ja
   ├─ basePathname     = /character/athena
   └─ internal rewrite → existing Astro route
                           │
                           ▼
                    Character Page SSR
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
         UI i18n      Content Repo      SEO i18n
        dictionary      + locale      canonical /
                                      hreflang /
                                      JSON-LD
             │             │             │
             └─────────────┴─────────────┘
                           │
                           ▼
                    Japanese HTML
```

四层职责：

```text
1. Locale / Routing
   URL、Request Locale Context、语言切换、兼容旧路由

2. UI Translation
   导航、按钮、表单、状态、ARIA、错误提示

3. Content Translation
   Mythology / Character / World / Scene / Story 等读者内容

4. Canonical Semantic Model
   Visual DNA / Canonical Design / source facts / generation semantics
```

---

## 5. Locale Registry：唯一语言配置源

新增：

```text
src/lib/i18n/
├── config.ts
├── locale.ts
├── url.ts
├── seo.ts
└── ui/
    ├── zh-Hans.ts
    ├── zh-Hant.ts
    ├── en.ts
    ├── ja.ts
    ├── es.ts
    ├── fr.ts
    └── de.ts
```

示意：

```ts
export const localeRegistry = {
  'zh-Hans': {
    path: '',
    htmlLang: 'zh-Hans',
    label: '简体中文',
    direction: 'ltr',
  },
  en: {
    path: 'en',
    htmlLang: 'en',
    label: 'English',
    direction: 'ltr',
  },
  ja: {
    path: 'ja',
    htmlLang: 'ja',
    label: '日本語',
    direction: 'ltr',
  },
  // ...
} as const;
```

禁止在 Header、Footer、页面、Repository、SEO 工具中各维护一份 locale list。

Locale Registry 同时负责：

- URL path ↔ locale
- HTML `lang`
- 语言展示名称
- fallback locale
- Intl format locale
- 是否发布
- 默认语言判断

---

## 6. 路由方案：旧 URL 保持不变

### 6.1 URL Contract

默认简中：

```text
/
/explore/
/character/
/character/athena/
/world/olympus/
/mythology/greek/
```

其他语言：

```text
/en/
/en/explore/
/en/character/
/en/character/athena/
/en/world/olympus/
/en/mythology/greek/
```

原有中文 URL 不 301、不改 canonical、不产生 `/zh-hans/...` 镜像页。

### 6.2 保留 slug，不翻译路由结构

推荐：

```text
/ja/character/athena
/es/mythology/aztec
```

不做：

```text
/ja/神灵/アテナ
/es/personaje/atenea
```

原因：

- entity identity 稳定
- 分享链接稳定
- D1 查询简单
- 内部链接统一
- 缓存键稳定
- Analytics 跨语言聚合简单
- 避免同一实体维护多个 slug alias

### 6.3 Middleware 内部 rewrite

Astro 配置使用 manual i18n routing，页面仍保留现有唯一一套路由树。

伪代码：

```ts
export const onRequest = defineMiddleware(async (context, next) => {
  const parsed = parseLocalizedPath(context.url.pathname);

  context.locals.locale = parsed.locale;
  context.locals.externalPathname = context.url.pathname;
  context.locals.basePathname = parsed.basePathname;

  if (!parsed.hasLocalePrefix) {
    return next();
  }

  if (!['GET', 'HEAD'].includes(context.request.method)) {
    return next();
  }

  return next(parsed.basePathname);
});
```

实现时必须加 rewrite-loop 防护与 route allowlist。

### 6.4 不参与 locale rewrite 的路径

至少包括：

```text
/api/*
/media/*
/_astro/*
/favicon.*
/manifest.webmanifest
/sw.js
/robots.txt
/sitemap*.xml
```

`/admin` 第一阶段保持后台单语言，也不进入公开多语言 URL。

### 6.5 保留 query/hash

语言切换：

```text
/character/?mythology=greek#athena
      ↓ English
/en/character/?mythology=greek#athena
```

URL helper 必须保留允许的 query/hash。

认证相关 query（token、code 等）禁止被通用语言切换器盲目搬运。

---

## 7. URL Helper：禁止手拼路径

新增统一 helper：

```ts
localizedPath(locale, '/character/athena/')
```

输出：

```text
zh-Hans → /character/athena/
en      → /en/character/athena/
ja      → /ja/character/athena/
```

并提供：

```ts
parseLocalizedPath(pathname)
switchLocale(url, targetLocale)
stripLocalePrefix(pathname)
getLocalePrefix(locale)
```

页面/components 禁止继续散落：

```ts
href={`/character/${slug}`}
href={`/${locale}/character/${slug}`}
```

Header、Footer、Card、Breadcrumb、Related Entity、Login redirect、JS 动态链接都必须使用同一 URL contract。

---

## 8. Locale 选择策略

语言优先级：

```text
URL locale
  > 用户主动选择记录
  > 默认 zh-Hans
```

`Accept-Language` 只可用于：

- 首次访问时提供语言建议
- language switcher 默认高亮建议

**不得用于同 URL 返回不同正文。**

不要根据 IP / Geo 自动切内容或自动 301。

例如用户访问：

```text
/en/character/athena
```

即使浏览器首选中文，也必须返回英文。

用户主动切换语言后可以设置：

```text
mythcanvas-locale=en; Path=/; SameSite=Lax
```

Cookie 只记录偏好，不改变显式 locale URL 的语义。

因为语言由 URL 决定，正常页面响应 **不需要 `Vary: Accept-Language`**，避免 CDN cache fragmentation。

---

## 9. UI Translation：前端/源码语言包

适用内容：

- Header / Footer
- 导航
- 按钮
- 表单 label / placeholder
- 空状态 / loading / error
- Toast
- Dialog
- ARIA label
- 客户端动态状态文案

不进 D1。

示意：

```ts
export default {
  nav: {
    home: 'Home',
    explore: 'Explore',
    characters: 'Deities',
    realms: 'Realms',
    mythology: 'Mythology',
    create: 'Create',
  },
  action: {
    download: 'Download',
    favorite: 'Favorite',
  },
};
```

使用 typed key，CI 校验所有发布 locale key 完整。

推荐 API：

```ts
const t = getUiTranslator(locale);
t('nav.explore');
```

客户端 inline script 需要的动态字符串优先由 SSR 写入 `data-*` / JSON data island，避免在 JS 里再维护第二套字典。

---

## 10. Content Translation：跟随 Source of Truth

### 10.1 D1 实体：Base Table + Translation Table

不要继续扩展：

```text
name_en
name_ja
name_es
...
```

示例：

```sql
CREATE TABLE character_translations (
  character_id TEXT NOT NULL,
  locale TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  summary TEXT NOT NULL,
  seo_title TEXT,
  seo_description TEXT,
  image_alt TEXT,
  translation_status TEXT NOT NULL DEFAULT 'draft',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (character_id, locale),
  FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
);

CREATE INDEX idx_character_translations_locale
  ON character_translations(locale, translation_status);
```

同类表：

```text
mythology_translations
world_translations
scene_translations
character_translations
style_translations
```

不要使用通用 EAV：

```text
entity_translation(entity_type, entity_id, locale, field, value)
```

否则类型校验、完整性约束、查询和迁移都会变差。

### 10.2 Repository locale-aware

当前：

```ts
getMythologyBySlug(db, slug)
```

目标：

```ts
getMythologyBySlug(db, slug, locale)
```

页面拿到的是当前语言的 resolved entity：

```ts
{
  id,
  slug,
  name,
  summary,
  visualDna,
  heroImage,
}
```

页面不应该拿到：

```ts
{
  nameEn,
  nameJa,
  nameEs,
  ...
}
```

一次 SSR 请求只解析当前 locale。

### 10.3 Story 长文不要被迫进 D1

如果 MythStory 当前仍由 source-controlled content 管理，建议：

```text
src/content/story/
├── zh-Hans/
│   └── greek/...
├── en/
│   └── greek/...
├── ja/
│   └── japanese/...
└── es/
    └── aztec/...
```

共享：

- story id
- slug
- mythologyId
- relation ids
- source registry ids

本地化：

- title
- subtitle
- summary
- blocks prose
- reader-facing source notes

等未来有 Story CMS / Admin 再迁 D1，不为 i18n 提前制造 CMS 需求。

### 10.4 SourceRef 不做“伪翻译”

原典名称、版本、原始语言需要保留 provenance。

如果存在正式译本，继续通过现有 `language / translation / edition` 等字段明确记录，不要把现代译文包装成原典文本。

---

## 11. Canonical Semantic Model：保持语言无关

以下内容不是普通 UI 翻译对象：

```text
VisualDNA
CanonicalDesign
identity anchors
mythologicalFacts
sourceRefs
prompt layers
reference provenance
```

禁止形成：

```text
canonicalPromptZh
canonicalPromptEn
canonicalPromptJa
```

否则不同语言版本会逐渐产生角色身份漂移。

长期方向应从自然语言数组逐步升级为稳定 semantic ids，例如：

```ts
motifIds: ['auspicious-cloud', 'jade-palace', 'crane', 'dragon-pattern']
```

读者看到的标签再通过 locale translation 映射。

在迁移完成前，不要求一次性重写现有 Canonical Design；只要求 **新增多语言时不要复制机器语义层**。

---

## 12. Translation 状态与 fallback

建议状态：

```text
draft
machine-translated
reviewed
published
```

### UI dictionary fallback

允许：

```text
ja → en → zh-Hans
```

但 CI 应尽量保证正式发布 locale 的核心 UI 无 fallback。

### 内容页 fallback

**可索引内容页不允许正文跨语言 fallback。**

例如没有 Athena 日语正文时：

```text
/ja/character/athena
```

不应该渲染：

```text
日语 Header + 中文 Character summary
```

正式策略：

- translation = `published` → 200 + index
- translation 不存在 / 未发布 → 404（或产品明确设计的 unavailable page + noindex）
- language switcher 只展示当前实体已有 published translation 的语言

QA 环境允许用 feature flag 查看 draft / machine translation，但不得进入 sitemap / hreflang。

---

## 13. SEO / GEO

### 13.1 每个语言页 self-canonical

中文：

```html
<link rel="canonical" href="https://mythcanvas.space/character/athena/">
```

英文：

```html
<link rel="canonical" href="https://mythcanvas.space/en/character/athena/">
```

英文页不能 canonical 回中文页。

### 13.2 hreflang 只输出真实已发布翻译

```html
<link rel="alternate" hreflang="zh-Hans" href="https://mythcanvas.space/character/athena/">
<link rel="alternate" hreflang="en" href="https://mythcanvas.space/en/character/athena/">
<link rel="alternate" hreflang="ja" href="https://mythcanvas.space/ja/character/athena/">
<link rel="alternate" hreflang="x-default" href="https://mythcanvas.space/character/athena/">
```

所有 locale page 输出同一组 alternate 集合，并包含自身。

Google 官方参考：

- https://developers.google.com/search/docs/specialty/international/localized-versions
- https://developers.google.com/search/docs/crawling-indexing/canonicalization

### 13.3 动态 HTML / JSON-LD

统一从 locale context 输出：

```html
<html lang="ja">
```

JSON-LD：

```json
{
  "inLanguage": "ja"
}
```

同时补充：

```text
og:locale
og:locale:alternate
Content-Language（可选但建议）
```

### 13.4 Sitemap

普通 sitemap 只包含：

- 默认语言原 URL
- translation status = published 的 locale URL

不能因为某实体存在中文页，就自动枚举 7 个 locale URL。

Image sitemap 的图片资产可以共享；若后续加入 localized image caption / landing context，再评估是否需要为每个 locale 重复 image-page 关联，避免无意义膨胀。

### 13.5 SEO policy locale normalization

`getPageSeoPolicy` 重构为接收：

```ts
{
  externalUrl,
  basePathname,
  locale,
}
```

规则匹配使用 `basePathname`：

```text
/en/search       → /search       → noindex,follow
/en/my           → /my           → noindex,nofollow
/en/character?q= → /character    → thin filter noindex
```

canonical 使用 external localized URL。

---

## 14. 搜索

搜索必须 locale-aware。

至少做到：

1. 当前 locale 优先匹配本语言 `name / alias / summary`。
2. 稳定实体 slug / ids 不随 locale 改变。
3. 可选跨语言 alias 搜索，例如英文用户搜 `Athena`、中文用户搜 `雅典娜` 都命中同一 Character。
4. 搜索结果展示当前 locale translation。
5. 缺少当前 locale translation 的实体默认不混入正式结果，或显式标记 fallback。

不要让 `/en/search` 返回整页中文结果。

---

## 15. Cache / Cloudflare

外部 URL 已天然区分语言：

```text
/character/athena
/en/character/athena
/ja/character/athena
```

但内部 middleware 会 rewrite 到相同 base route，因此任何应用层缓存都必须明确包含 locale：

```text
cacheKey = locale + entityId + contentVersion
```

禁止只按 internal rewritten pathname 做 cache key，否则会发生跨语言缓存污染。

如果未来使用 Cloudflare Cache API / KV 存 SSR 或内容查询结果，同样必须把 locale 纳入 key。

D1 prepared query / repository memoization 也必须 locale-aware。

---

## 16. Auth / Session / 私有页面

Session 本身与语言无关，Cookie `Path=/`。

语言只影响 UI：

```text
/my/                 # zh-Hans
/en/my/              # English（若该页面进入 P1 多语言范围）
```

需要保证：

- login success redirect 保留安全的 locale context
- `returnTo` 仍做 open redirect 校验
- noindex policy 对 localized private routes 同样生效
- API endpoint 不复制 `/en/api/*`

后台 `/admin/*` 第一阶段保持默认中文，不纳入公开 locale switcher。

---

## 17. Service Worker / PWA

当前 navigation offline fallback 固定到 `/`，多语言后会串到中文。

P1 两种可选方案：

### A. locale-aware shell

```text
/      → Chinese shell
/en/   → English shell
/ja/   → Japanese shell
```

根据 request URL locale fallback 到对应 shell。

### B. 取消 localized navigation 的 generic shell fallback

网络失败直接展示浏览器离线错误或专门的 locale-neutral offline page。

在实现完整 localized shell 前，**B 比错误返回中文更安全**。

Manifest 第一阶段可保持 locale-neutral 品牌名；若后续 PWA 成为核心渠道，再提供 locale-specific manifest description / start_url。

---

## 18. Typography / Layout

多语言不是只换字符串。

需要覆盖：

- German / French / Spanish 文案膨胀
- Japanese line breaking
- Traditional Chinese glyph
- heading 字体 fallback
- 按钮最小宽度与不必要固定宽度
- Card title 2–3 行策略
- 移动端语言切换器

字体策略：

- Latin：现有 sans / serif stack
- `zh-Hans`：现有 SC 方案可保留
- `zh-Hant`：使用合适 TC glyph/fallback
- `ja`：使用日文字形优先字体
- 不要一次性加载所有 CJK webfont

建议增加 pseudo-locale / text-expansion 测试，提前发现固定宽度 UI。

---

## 19. Intl 格式化

禁止手写本地化日期/数字：

```ts
new Intl.DateTimeFormat(locale, options)
new Intl.NumberFormat(locale, options)
new Intl.RelativeTimeFormat(locale, options)
```

下载量、发布时间、阅读时长等统一走 i18n formatter。

第一阶段不做货币/地区定价；如果未来出现付费能力，语言 locale 与 billing region 必须是两个概念，不能混用。

---

## 20. 数据迁移策略

不要一次破坏性删除 `name / name_en`。

建议：

### Phase 1 — Additive migration

新增 `*_translations` 表。

从现有字段 backfill：

```text
name / summary → zh-Hans
name_en        → en
```

英文缺失 summary 时标记 `draft`，不自动视为 `published`。

### Phase 2 — Repository dual read

优先 translation table：

```text
translation table
   ↓ missing during migration only
legacy columns / seed fallback
```

生产 SEO 页面仍遵循 published gate。

### Phase 3 — 全部 caller locale-aware

页面、搜索、SEO、相关实体、Creator reader-facing labels 全部传 locale。

### Phase 4 — Legacy freeze

停止写 `name_en` 等 legacy 字段。

### Phase 5 — Cleanup

稳定运行后再决定是否删除 legacy columns；D1 migration 不为了“表结构漂亮”过早做 destructive change。

---

## 21. Seed / D1 双数据源兼容

当前项目仍存在 typed seed + D1 read fallback。

i18n 迁移期间不能只改 D1，否则 `dev:local` / CI seed 模式会与生产表现分叉。

建议 seed 使用同样的 resolved translation contract，例如：

```text
content/<mythology>/translations/
  zh-Hans.ts
  en.ts
  ja.ts
```

或实体旁维护 typed translation map。

Repository 对上层暴露统一接口，上层不感知数据来自 seed 还是 D1。

CI 必须同时覆盖：

```text
seed/local mode
d1-backed mode（至少 migration/schema contract）
```

---

## 22. Analytics / Observability

页面埋点同时记录：

```text
locale          = ja
routeTemplate   = /character/[slug]
externalPath    = /ja/character/athena
entityId        = character-athena
```

这样既能：

- 按语言看流量/转化
- 跨语言聚合同一 Character
- 判断第二批语言是否值得继续投入

重点指标：

```text
localized page impressions
language switch usage
translation missing rate
locale-specific search CTR
locale-specific download / favorite / create conversion
404 by locale
```

---

## 23. 测试与门禁

### Unit

必须覆盖：

- `parseLocalizedPath`
- `localizedPath`
- `switchLocale`
- invalid locale
- default locale no prefix
- query/hash preservation
- SEO base pathname normalization
- locale cache key
- UI dictionary completeness

### Route integration matrix

至少：

```text
/character/athena        → 200 zh-Hans
/en/character/athena     → 200 en
/ja/character/athena     → 200 ja（翻译 published 时）
/xx/character/athena     → 404
/en/api/user              → 不支持 / 404
/api/user                 → 正常
```

### SEO assertions

每个 published localized entity page：

- `<html lang>` 正确
- self canonical
- hreflang 包含自身
- hreflang 不包含 unpublished translation
- `x-default` 指向默认中文 URL
- JSON-LD `inLanguage` 正确
- sitemap 只含 published locale
- noindex/private/filter 规则在 locale prefix 下不失效

### Legacy regression

上线前抓取现有所有 public route inventory，保证：

- status 不变
- canonical 不变
- slug 不变
- 中文正文不因 i18n 改造缺失
- 站内旧链接继续可访问

### Content gate

CI / content validation 增加：

- published translation 必填字段完整
- 不允许 duplicate `(entity_id, locale)`
- hreflang target 必须实际可访问
- 发布语言 UI key 100% 覆盖核心路径

---

## 24. 实施阶段

### P0-A：i18n Foundation（先不批量翻内容）

1. Locale Registry
2. Astro manual i18n config
3. locale middleware + GET/HEAD rewrite
4. Request Locale Context
5. localized URL helper
6. Header / Footer / BaseLayout locale-aware
7. UI typed dictionaries
8. legacy URL regression tests

验收：中文 URL 0 破坏，英文测试页能复用同一 Astro page route SSR。

### P0-B：SEO Foundation

1. BaseHead locale-aware
2. canonical / hreflang / x-default
3. `<html lang>`
4. JSON-LD `inLanguage`
5. `og:locale`
6. SEO policy locale normalization
7. multilingual sitemap contract

验收：`/character/x` 和 `/en/character/x` 能被搜索引擎识别为语言变体而不是同 URL 动态语言。

### P0-C：Content Model

1. 新增 translation tables
2. backfill zh-Hans / en
3. Repository 增加 locale
4. seed translation contract
5. translation status / publish gate
6. Search locale-aware

验收：页面层不再依赖 `nameEn` 等 language-specific property。

### P0-D：首批内容

优先：

```text
zh-Hans
English
Japanese
Spanish
```

按高价值入口顺序翻译：

```text
Home / Navigation
→ Mythology landing
→ Character
→ World / Scene
→ Story
→ Artwork metadata
```

### P1：第二批语言与体验

```text
zh-Hant
French
German
```

同时完成：

- CJK font strategy
- localized SW offline behavior
- Intl formatter
- text expansion QA
- locale analytics dashboard

---

## 25. 明确不做

本阶段不做：

- 将默认中文强制迁到 `/zh-hans/*`
- 批量 301 现有中文 URL
- 根据 IP 自动切语言
- 同 URL 根据 `Accept-Language` 返回不同正文
- locale-prefixed `/api/*`
- 翻译 entity slug
- 为每种语言复制整套 Astro page tree
- `name_en/name_ja/name_es/...` 多列模型
- 通用 EAV translation table
- 一次请求下发所有语言正文到浏览器
- 为每个 locale 创建 `canonicalPrompt*`
- 未完成正文翻译却创建可索引 locale 页面
- 一次加载所有 CJK 字体

---

## 26. Definition of Done

多语言基础设施完成的标准：

- [ ] 所有现有中文 public URL 保持可访问且 canonical 不变
- [ ] 默认 `zh-Hans` URL 无 prefix
- [ ] 非默认 locale 使用稳定 prefix
- [ ] 不复制整套路由文件
- [ ] locale-aware internal link 全面替代手拼 locale path
- [ ] UI 固定文案从 typed dictionary 获取
- [ ] D1 entity translation 与 base entity 分离
- [ ] Story translation 跟随其内容 Source of Truth
- [ ] `nameEn` 类模型完成迁移路径设计并停止扩散
- [ ] `<html lang>` / JSON-LD / OG locale 正确
- [ ] localized page self-canonical
- [ ] hreflang 只指向 published translation
- [ ] sitemap 不产生空翻译 URL
- [ ] private/search/filter SEO policy 在 locale prefix 下仍正确
- [ ] 页面不存在“目标语言 UI + 默认中文正文”的 indexable 混合语言状态
- [ ] Search 返回当前 locale 内容
- [ ] cache key 包含 locale，不会跨语言污染
- [ ] `/api` / `/media` / static assets 不被 locale rewrite
- [ ] invalid locale 正确 404
- [ ] Service Worker 不把非中文页面离线 fallback 到中文首页
- [ ] CI 有 URL、SEO、translation completeness 与 legacy regression 测试

---

## 27. 最终架构决策摘要

```text
默认语言 URL：     保留现有无前缀中文 URL
其他语言 URL：     /{locale}/...
路由实现：         Astro manual i18n + middleware rewrite
页面代码：         一套，不复制 locale route tree
UI 文案：          typed source dictionary
结构化内容：       D1 base table + translation table
Story 长文：       跟随 content source，本地化文件
机器语义：         单一 Canonical Semantic Model，不按语言复制
SEO：              self canonical + hreflang + published gate
Fallback：         UI 可 fallback；可索引正文不可跨语言 fallback
API / media：       无 locale prefix
缓存：              locale 必须进入 cache key
旧链接：            100% 兼容，不批量重定向
```

这套方案允许 MythCanvas 从当前中文站渐进升级为多语言内容产品，同时保持已有 URL、SEO 权重、单一路由代码和 Canonical 神话语义模型稳定。