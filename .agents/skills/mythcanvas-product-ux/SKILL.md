---
name: mythcanvas-product-ux
description: Use for MythCanvas page UX, visual design, theming, responsive behavior, Character/Realm presentation, artwork cards, and AI Creator UI.
---

# MythCanvas Product UX Skill

## Goal

Implement MythCanvas as a **mythology visual universe**, not a generic gallery or AI SaaS dashboard.

Always preserve the product loop:

```text
Discover → Explore Character/Realm → Download/Favorite → AI Recreate
```

## Theme model

There is one application structure and two presentation themes:

### Light — 天宫鎏金

Mood: light, celestial, elegant, dreamy, premium.

Use:

- moon-white / warm white backgrounds
- translucent jade-white surfaces
- restrained gold accents
- cloud blue and jade secondary accents
- cloud sea, celestial palaces, morning light, white-gold materials

Avoid:

- heavy imperial red/gold
- antique wooden UI
- generic white SaaS cards
- excessive traditional ornaments

### Dark — 月渺仙阙

Mood: moonlit celestial palace, quiet, deep, elegant.

Use:

- ink navy / deep blue backgrounds, never pure black
- moon-white text
- restrained antique gold
- moonlight blue focus/hover
- stars, night clouds, illuminated celestial architecture

Avoid:

- gothic horror
- blood red
- apocalyptic black-metal styling
- generic black/gold crypto dashboard aesthetics

## Theme invariants

Light and Dark must share:

- DOM structure
- IA
- grid
- spacing
- typography metrics
- component dimensions
- CTA positions

Only semantic tokens, shadows, glows, textures, overlays and selected Hero art direction vary.

## Civilization Visual DNA

Civilization is content-level identity, not a separate app theme.

- Chinese: cloud sea, palace roofs, jade, moonlight, cranes, dragon/cloud motifs
- Greek: marble, gold, Aegean light, columns, laurel, sculpture
- Norse: ice, stone, world tree, runes, aurora
- Japanese: moon, torii, shrine, forest, restrained vermilion
- Egyptian: desert, sun, sandstone, black stone, lapis, hieroglyphic geometry

Use these in imagery, small ornaments, icon motifs and entity presentation. Do not recolor the whole application by civilization.

## Canonical Design

Core Character and Realm entities should have stable identity anchors.

A Character variant may change style but should retain recognizable symbols, signature object/weapon, role, key silhouette/details and temperament.

A Realm variant may change era/style but should retain landmark composition, spatial logic, signature materials and mythological symbols.

## Style Variant

Treat artwork style independently from application theme:

- Canonical
- Cinematic
- Anime
- Sacred
- Dark Fantasy
- Cyber Myth
- Ink
- Oil Painting
- Statue
- Surreal

Never use `theme` to store artwork style.

## Page rules

### Home

Hero must communicate in 5 seconds:

> 绘神宇宙 MythCanvas — 用 AI 重现神话世界

Recommended order:

1. Hero
2. 今日神境
3. 热门角色
4. 探索神话
5. 精选壁纸
6. AI 绘神 CTA

### Explore

Image-first grid. Keep metadata minimal. Filters may cover mythology, type, style and device.

### Realm

User should feel they are entering a world, not browsing a tag page.

Include Hero, overview, landmarks, characters, variants, artworks and recreate CTA.

### Character

Include Hero, lightweight facts, Canonical Design identity, Style Variants, wallpapers, related Realm/Characters and create CTA.

### Artwork

Primary flow: appreciate → preview → download/favorite → related entity → recreate.

### AI Creator

Use guided controls. Do not make a blank prompt field the dominant UI.

Base creation on:

- entity type
- Character/Realm
- Style
- Scene
- Composition
- optional advanced free text

## Icon system

MythCanvas uses **Lucide** as the functional UI icon system.

- Import icons from `@lucide/astro` by semantic name.
- Do not use emoji / Unicode glyphs for functional UI.
- Typical UI size: 16–20px; keep stroke weight visually consistent.
- Icon-only actions require `aria-label`; decorative icons use `aria-hidden="true"`.
- Custom SVG is reserved for MythCanvas brand marks and Civilization Visual DNA motifs that generic UI libraries should not represent.
- Do not mix multiple general-purpose icon libraries.
- Prefer text + icon for primary actions; use icon-only controls only when the meaning is conventional and accessible.

## Typography

- major headings: modern Song/serif is allowed
- body/buttons/forms: readable sans-serif
- do not use calligraphy fonts across the interface
- keep font metrics identical in Light/Dark

## Motion

Atmospheric and slow:

- fade
- blur reveal
- subtle cloud movement
- low-amplitude parallax
- slow zoom

Support `prefers-reduced-motion`.

## Completion checklist

- [ ] Light and Dark implemented together
- [ ] Civilization identity is content-level
- [ ] Image is more visually dominant than chrome
- [ ] Mobile and desktop both designed
- [ ] No game HUD / SaaS dashboard drift
- [ ] Canonical Design identity is visible
- [ ] Style Variant is separate from Theme
- [ ] Focus/contrast/accessibility pass
