---
name: mythcanvas-astro-cloudflare
description: Use for MythCanvas Astro architecture, Cloudflare Workers/D1/R2/KV integration, islands decisions, backend APIs, performance, and deployment.
---

# MythCanvas Astro + Cloudflare Skill

## Default architecture

- Astro 5 + TypeScript
- Cloudflare Workers runtime
- Astro SSR/SSG for crawlable pages
- Islands only for real interaction
- Planned D1 metadata, R2 images, KV config/cache

Do not replace Astro with a full React SPA.

## Rendering decision

Use static/server-rendered Astro for:

- Home
- Explore landing
- Mythology pages
- Realm pages
- Character pages
- Artwork pages
- Style landing pages

Use islands for:

- Theme toggle
- Search suggestions
- complex filters
- favorite state
- account menu
- AI Creator
- generation state/history

If a component only needs hover/focus or a simple disclosure, prefer HTML/CSS/minimal JS.

## React

React is optional and justified per island. If introduced, install and configure `@astrojs/react`, `react`, and `react-dom`. Do not hydrate static content grids just to reuse React components.

## Cloudflare boundaries

### D1

Source of truth for relational/dynamic metadata:

- users
- favorites
- generation records
- entity relations when migrated from seed data
- counters that need consistency

### R2

Store:

- original artwork
- generated artwork
- thumbnails/derivatives if produced by pipeline
- OG/share assets

Persist image dimensions, ratio, format, alt/attribution metadata separately.

### KV

Use for:

- config
- feature flags
- precomputed hot lists
- cacheable lookup data

Do not make KV the primary relational database.

## AI generation API

Browser must not call model providers with secrets.

```text
Creator Island
→ Worker endpoint
→ validate + moderate
→ load Character/Realm Canonical Design
→ load Civilization Visual DNA
→ compose provider-neutral request
→ provider adapter
→ persist metadata + asset
→ return normalized result
```

Keep provider-specific code behind adapters.

## Theme boot

Theme preference must be applied before first paint.

Priority:

1. explicit persisted user choice
2. `prefers-color-scheme`
3. product default

Avoid hydration-only theme initialization that causes visible flash.

## Performance

This is image-heavy:

- reserve dimensions to avoid CLS
- use responsive image sources
- lazy-load below fold
- prioritize LCP Hero intentionally
- avoid unnecessary client bundles
- prefer CDN-cached immutable artwork URLs
- separate original from delivery derivative strategy

## Development sequence

When implementing a new feature:

1. identify server-rendered core content
2. isolate only interactive state into an island
3. define typed domain/service boundary
4. keep Cloudflare access in server/lib layer
5. ensure page works meaningfully without client JS where possible
6. run build/check

## Avoid

- direct provider secrets in browser
- giant client-side global state
- full-page hydration
- mixing D1 calls into presentation components
- untyped JSON blobs for core entities
- hard-coded Cloudflare URLs throughout UI
