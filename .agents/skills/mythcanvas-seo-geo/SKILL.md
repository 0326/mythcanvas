---
name: mythcanvas-seo-geo
description: Use for MythCanvas SEO/GEO, entity pages, metadata, structured data, internal linking, sitemap/image sitemap, multilingual slugs, and AI-search discoverability.
---

# MythCanvas SEO / GEO Skill

## Goal

MythCanvas content should be discoverable through both search engines and AI answer engines.

The site is not optimized only for brand search. It should capture entity and intent queries such as:

- Athena wallpaper 4K
- 雅典娜壁纸
- Olympus wallpaper
- Greek mythology anime art
- 天空神殿壁纸
- 九尾狐 AMOLED wallpaper

## Server-rendered core content

Never make the following client-only:

- entity name
- summary
- mythology/world relationship
- artwork title and metadata
- related entity links
- primary image semantics

Core SEO/GEO content must exist in initial HTML.

## Page metadata

Every indexable page needs:

- unique title
- unique meta description
- canonical URL
- OpenGraph metadata
- social preview image when available
- semantic H1

Avoid templated keyword stuffing in visible UI.

Preferred visible title:

> Athena · Goddess of Wisdom

Not:

> Athena 4K HD AI Anime Phone Wallpaper Free Download

Put intent keywords into metadata and surrounding structured copy, not spammy UI labels.

## Entity page structure

### Character

Recommended order:

1. H1 + English/Chinese name
2. concise identity summary
3. Mythology + Realm + Symbols
4. canonical visual interpretation
5. Style Variants / artworks
6. related Realm
7. related Characters
8. brief factual context

### Realm

1. H1
2. mythology relation
3. concise description
4. landmarks
5. key Characters
6. Style Variants / artworks
7. related Realms/Mythology

### Artwork

1. artwork title
2. primary image with correct semantics
3. Character / Realm relations
4. dimensions / aspect / style where useful
5. download/preview actions
6. same Character / Realm / Style recommendations

## Images

Image SEO is critical.

Every important image should have:

- meaningful `alt`
- width + height
- responsive variants
- stable URL
- image context in HTML

Generate an image sitemap when the content volume warrants it.

Do not hide primary images only as CSS backgrounds.

## Internal linking

Treat the domain graph as SEO architecture:

```text
Mythology ↔ Realm ↔ Character ↔ Artwork
```

Every entity page should link to related entities with descriptive anchor text.

Avoid orphan artwork pages.

## Structured data

Use JSON-LD when it accurately represents content. Prefer truthful generic web/image/article/breadcrumb structures over inventing unsupported schema types.

Breadcrumb structure should mirror entity hierarchy where appropriate.

## GEO / AI-answer discoverability

Entity summaries should be concise and explicit enough for an LLM to extract:

- what the entity is
- which mythology it belongs to
- related place/world
- primary symbols/role
- what the MythCanvas page contains

Use consistent naming and stable entity URLs.

Avoid vague poetic prose as the only description. Pair visual copy with explicit factual fields.

## Sitemap strategy

Include high-value public routes:

- mythology
- world
- character
- artwork/wallpaper
- style landing pages with substantive content

Do not index thin filter combinations automatically.

If filters become URLs, define canonical/index rules deliberately.

## Multilingual

Do not create duplicate Chinese/English pages without hreflang/canonical strategy.

Prefer stable language-aware routing only when real localized content exists.

## Performance relevance

SEO work must protect Core Web Vitals:

- LCP Hero is prioritized intentionally
- image dimensions avoid CLS
- unnecessary client JS is avoided
- below-fold images lazy-load

## Delivery checklist

- [ ] unique title/description
- [ ] canonical
- [ ] H1 and explicit entity identity
- [ ] server-rendered core facts
- [ ] primary image has alt + dimensions
- [ ] related internal links
- [ ] OG image/meta
- [ ] sitemap inclusion decision
- [ ] structured data decision
- [ ] filter pages do not create uncontrolled thin-content indexation
- [ ] mobile performance remains acceptable
