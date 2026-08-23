---
name: mythcanvas-product-ux
description: Use for every MythCanvas UI/UX task, especially screenshot/design reproduction, page creation, visual refactors, theming, responsive behavior, Character/Realm presentation, artwork discovery, and AI Creator UI. For reference-image work, this skill requires a render → screenshot → compare → repair loop instead of one-pass implementation.
---

# MythCanvas Product UX

## 1. Mission

Build MythCanvas as a **premium mythology visual universe**, not a generic gallery, AI SaaS dashboard, game HUD, or wallpaper dump.

Preserve the product loop:

```text
Discover → Enter Character/Realm → Immerse → Download/Favorite → AI Recreate
```

The interface must recede behind mythology imagery. The user should feel they are **entering a mythic world**, not operating a content management tool.

This skill has two operating modes:

1. **Design / Build mode** — create or reshape MythCanvas UI from product requirements.
2. **Visual Reproduction mode** — reproduce a supplied screenshot, mockup, Figma frame, or approved visual reference as faithfully as possible.

When a visual reference exists, **Visual Reproduction mode takes priority**. Do not redesign the reference unless the user explicitly asks for interpretation rather than reproduction.

---

# 2. Source-of-truth priority

When instructions conflict, use this order:

1. Explicit user instruction in the current task.
2. Supplied reference image / Figma frame / approved visual mockup.
3. Existing MythCanvas product requirements and Design Tokens.
4. This skill.
5. Existing implementation details.
6. Generic frontend conventions.

A reference image is not inspiration when the user asks to “还原 / reproduce / match / pixel perfect”. It is an **acceptance target**.

Do not preserve an existing layout merely because it is already coded when the approved reference clearly differs.

---

# 3. Hard rule for visual reproduction

For visual-reference tasks, the following workflow is mandatory:

```text
REFERENCE
   ↓
ANALYZE
   ↓
EXTRACT VISUAL SPEC
   ↓
IMPLEMENT
   ↓
RENDER IN BROWSER
   ↓
CAPTURE SCREENSHOT
   ↓
COMPARE REFERENCE VS ACTUAL
   ↓
IDENTIFY TOP VISUAL DELTAS
   ↓
REPAIR
   ↓
CAPTURE AGAIN
   ↓
VERIFY
```

Never use this workflow:

```text
look at screenshot → write CSS → declare done
```

For a significant page reproduction, perform **at least two rendered visual verification passes** after the initial implementation unless tooling makes screenshot capture impossible.

If screenshot/browser tooling is unavailable, explicitly state the limitation in the task result and compensate by doing a structured manual comparison against the reference. Never silently pretend pixel verification occurred.

---

# 4. Visual reproduction workflow

## Phase A — Inspect before editing

Before changing code:

1. Read the target page/component and relevant shared layout/styles.
2. Locate existing Design Tokens, theme variables, typography, spacing, image assets, icons, and responsive rules.
3. Identify what can be reused without visually compromising the target.
4. Establish an **edit boundary**: modify only files needed to reproduce the target unless a shared primitive is genuinely wrong.
5. Preserve business behavior, routes, SEO semantics, data fetching, accessibility, and API contracts unless the task explicitly changes them.

Do not rewrite business logic to fix a spacing problem.

## Phase B — Decompose the reference

Do not start with CSS guesses. First derive a compact visual specification.

Record the following internally before implementation:

### Canvas

- reference viewport width / height if known
- desktop / tablet / mobile breakpoint
- page max-width
- page horizontal gutters
- header height
- major vertical section boundaries

### Layout

- dominant grid / flex structure
- column ratios
- card width and height relationships
- hero height
- image-to-text ratio
- alignment anchors
- sticky/fixed regions
- major whitespace bands

### Typography

- display vs body roles
- approximate font family category
- font size
- weight
- line-height
- letter spacing
- text width / wrapping behavior
- Chinese / Latin hierarchy

### Surface

- background colors
- borders
- radius
- shadows
- blur / translucency
- overlays
- gradients
- opacity

### Imagery

- exact asset when available
- aspect ratio
- crop
- `object-fit`
- `object-position`
- overlay direction and strength
- foreground/background emphasis

### Details

- icon type and size
- divider positions
- chips / pills
- ornaments
- hover/focus states
- subtle motion

The goal is to turn “looks similar” into measurable implementation decisions.

## Phase C — Match in priority order

Fix visual differences in this order:

1. **Page geometry** — viewport, max-width, section heights, major columns.
2. **Hero / dominant image crop** — often the highest-impact visual difference.
3. **Typography scale and wrapping**.
4. **Spacing and alignment**.
5. **Background / surface / contrast**.
6. **Card dimensions and image ratios**.
7. **Icons, borders, shadows, ornaments**.
8. **Micro-interactions**.

Do not spend time matching a 1px icon stroke while the Hero is 120px too short.

---

# 5. Browser verification contract

When browser automation or Playwright is available:

## Fixed viewport

Capture the implementation at the **same viewport as the reference** whenever dimensions are known.

If unknown, choose the closest canonical viewport and document it:

```text
Desktop: 1440 × 900
Wide desktop: 1536 × 960
Tablet: 768 × 1024
Mobile: 390 × 844
```

Avoid comparing screenshots from different viewport sizes.

## Deterministic state

Before screenshot comparison:

- use the same Light/Dark theme as the reference
- wait for fonts
- wait for critical images
- disable or settle transient animation if it changes geometry
- use deterministic fixture/content when possible
- close debug panels and dev overlays
- keep scroll position identical

## Compare by regions

Inspect at minimum:

1. Header / navigation.
2. Hero.
3. First content section.
4. Repeating card system.
5. Footer or lower CTA if present in reference.

For long pages, capture meaningful sections rather than relying only on a full-page thumbnail.

## Difference classification

Every visual review should classify errors into:

- `GEOMETRY`: size, width, height, grid, position
- `TYPOGRAPHY`: font, size, line-height, wrapping
- `SPACING`: gap, margin, padding
- `COLOR`: background, text, accent, opacity
- `IMAGE`: asset, crop, ratio, object-position
- `SURFACE`: border, radius, shadow, blur
- `DETAIL`: icon, ornament, divider
- `RESPONSIVE`: breakpoint or mobile mismatch

Repair high-impact categories first.

---

# 6. Visual acceptance bar

Do not claim a visual reproduction is complete merely because all components exist.

A page is visually acceptable when:

- dominant blocks occupy approximately the same regions as the reference
- hero crop and focal subject placement match closely
- major text wraps to the same or very similar lines
- section spacing rhythm is visually equivalent
- card ratios and grid density match
- color temperature and contrast match the intended theme
- buttons/icons are the same visual weight and placement
- no obvious generic component styling remains where the reference is bespoke
- desktop and mobile do not introduce accidental layout drift

Useful tolerance targets for screenshot-driven work:

- major layout dimensions: usually within ~2–4%
- repeated spacing: usually within ~4px when directly inferable
- large text size: usually within ~2px when directly inferable
- card radius/border: visually indistinguishable at normal zoom
- image focal point: subject should occupy the same perceptual region

These are guidance, not permission to overfit every pixel with brittle absolute positioning.

---

# 7. Iteration rules

After the first rendered comparison, identify the **3–5 highest-impact visual deltas** only.

Fix them, render again, and repeat.

Prefer a small number of high-value passes over random CSS churn.

Do not repeatedly change unrelated tokens after each screenshot. If a shared token fixes many visible differences consistently, change it; otherwise prefer local corrections.

If an element is visually wrong because of content length, image crop, or font metrics, fix the actual cause instead of masking it with arbitrary offsets.

Avoid absolute positioning for core layout unless the reference genuinely requires layered composition.

---

# 8. MythCanvas visual identity

MythCanvas has one product identity and two presentation themes.

## Light — 天宫鎏金

Mood: **东方仙境、天宫、鎏金、云海、月白、轻盈、梦幻、高级**.

Use:

- moon-white / warm white backgrounds
- translucent jade-white surfaces
- restrained antique / celestial gold accents
- cloud blue and pale jade secondary accents
- bright cloud sea, celestial palaces, morning light, white-gold materials
- airy negative space
- fine lines rather than heavy panels

Avoid:

- heavy imperial red/gold
- antique wooden UI
- generic white SaaS cards
- cheap gold gradients
- dense traditional ornament everywhere
- overly playful “古风” illustration UI

## Dark — 月渺仙阙

Mood: **月夜仙阙、深蓝夜空、云海、星辉、静谧、梦幻**.

Use:

- ink navy / deep blue backgrounds, never pure black
- moon-white text
- restrained antique gold
- moonlight blue focus / hover
- stars, night clouds, illuminated celestial architecture
- soft atmospheric depth rather than horror contrast

Avoid:

- gothic horror
- blood red
- apocalyptic black-metal styling
- generic black/gold crypto dashboard aesthetics
- simply placing a black overlay over Light art when a proper night asset is available

## Theme invariants

Light and Dark should normally share:

- IA
- DOM structure
- grid
- spacing
- typography metrics
- component dimensions
- CTA locations
- interaction model

Theme may vary:

- semantic color tokens
- hero art
- atmospheric overlays
- shadows / glow
- texture
- background ornaments

If the approved Light/Dark reference pair shows structural parity, preserve it strictly.

---

# 9. Civilization Visual DNA

Civilization is **content identity**, not another application theme.

### Chinese mythology

Cloud sea, celestial palace roofs, jade, moonlight, cranes, mountains, dragon/cloud motifs, white-gold divinity.

### Greek mythology

Marble, restrained gold, Aegean sky/light, columns, laurel, sculpture, monumental geometry.

### Norse mythology

Ice, stone, wood, world tree, runes, fjords, aurora, severe natural scale.

### Japanese mythology

Moon, torii, shrine, forest, mist, paper/wood detail, restrained vermilion.

### Egyptian mythology

Desert, sun disc, sandstone, black stone, lapis, monumental symmetry, hieroglyphic geometry.

Use Visual DNA in:

- artwork
- hero imagery
- entity-specific ornaments
- subtle patterns
- content labels
- custom mythology symbols

Do not recolor the entire website when switching mythology.

> Culture determines **who / where it is**. Style determines **how it is drawn**. Theme determines **how the product UI presents it**.

---

# 10. Canonical Design and Style Variants

## Canonical Design

Core Character and Realm entities need stable visual identity anchors.

A Character variant may change rendering style while preserving recognizable:

- mythology
- role
- signature symbol
- object / weapon
- silhouette or key costume logic
- temperament
- core palette cues when useful

A Realm variant may change style or era while preserving:

- landmark composition
- spatial logic
- signature architecture/material
- mythological symbols
- recognizable environmental hierarchy

## Style Variant

Artwork style is independent from application Theme.

Common styles:

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

Never store or describe artwork style as application `theme`.

---

# 11. Layout principles

## Image-first hierarchy

MythCanvas is visual-first. In major discovery/detail surfaces:

```text
Image / World
   >
Entity identity
   >
Primary action
   >
Metadata
```

Do not let filters, badges, stats, or controls visually compete with artwork.

## Spatial character

Prefer:

- generous cinematic whitespace
- strong image blocks
- asymmetry where it helps immersion
- quiet chrome
- clear content hierarchy
- restrained 8–12px card radius for normal cards

Avoid:

- dashboard grids filled with equal cards
- excessive pills
- large rounded SaaS panels
- glassmorphism everywhere
- tiny images surrounded by UI
- dense metadata walls

## Responsive behavior

Responsive design must preserve hierarchy, not simply stack everything.

Desktop:

- immersive Hero
- wide visual sections
- 3–6 column content grids depending on card type
- right-side sticky panels only when they materially improve workflow

Tablet:

- reduce columns before shrinking cards too aggressively
- preserve image ratios
- allow horizontal filter scrolling

Mobile:

- image remains dominant
- use 2-column visual grids when suitable
- detail pages become single column
- filters use horizontal scroll or bottom sheet
- important actions may use sticky bottom placement
- avoid shrinking desktop typography mechanically; recompose hierarchy

Always test at least one desktop and one mobile viewport for significant UI work.

---

# 12. Page-specific UX rules

## Home

The first screen must communicate within about 5 seconds:

> 绘神宇宙 MythCanvas — 用 AI 重现神话世界

Recommended content order:

1. Hero
2. 今日神境
3. 热门角色 / 诸神有形
4. 探索神话文明
5. 精选神话视觉
6. AI 绘神 CTA

Hero should feel like a **portal into a world**, not a marketing banner.

For current Chinese-baseline visual direction, prefer world-scale imagery such as cloud seas, celestial gates, floating palaces, moon/sun discs, distant divine silhouettes, and monumental architecture.

## Explore

Structured discovery, not an endless random AI feed.

Allow filters for:

- mythology
- entity/content type
- style
- device / ratio where relevant

Keep card metadata restrained.

Default card priority:

```text
Artwork
Title / Entity
Realm or Mythology
Optional style cue
```

Avoid prominent likes, dates, author names, and tag clouds unless the product requirement changes.

## Mythology

Use:

- civilization Hero
- representative Realms
- representative Characters
- representative Scenes / Artworks
- concise mythology context
- internal exploration paths

Do not turn the page into a dense encyclopedia article.

## Realm

Realm is a key MythCanvas differentiator.

The user should feel they are **entering a world**, not browsing a tag archive.

Include as appropriate:

- immersive Hero
- concise world overview
- landmarks
- characters
- visual variants
- artworks
- related mythology
- “重新绘制 [Realm]” CTA

## Character

Include as appropriate:

- strong Hero
- name / English name / divine role
- lightweight facts
- Canonical Design cues
- Style Variants
- wallpapers / artworks
- related Realm
- related Characters
- “绘制我的 [Character]” CTA

Character identity should remain recognizable across style variants.

## Artwork / Wallpaper

Primary flow:

```text
Appreciate → Preview → Download/Favorite → Explore Entity → AI Recreate
```

On desktop, large artwork should normally dominate the page. Secondary controls can live in a restrained side panel.

Download decisions may include:

- Phone / Desktop
- Ratio
- HD / 2K / 4K where supported

Do not make the user configure unnecessary device-model details.

## AI Creator / 绘神

Use a guided builder. A blank Prompt field must not dominate the experience.

Creation model:

```text
Entity Type
→ Character / Realm
→ Style
→ Scene
→ Composition / Device
→ Optional Advanced Description
→ Generate
```

The UI should make the user feel they are configuring a mythic interpretation, not engineering a prompt.

Generation state should use meaningful progress language rather than fake precise percentages.

Examples:

- 正在构筑云海
- 正在唤醒神祇
- 正在点亮神殿
- 正在完成最后的神迹

Result state should emphasize one primary generated work with clear actions:

- 下载
- 收藏
- 再绘一次
- 快捷微调
- 创建变体

---

# 13. Typography

Typography is part of MythCanvas identity, not neutral scaffolding.

Use:

- major Chinese headings: modern Song / high-quality serif when available
- Latin mythic titles: restrained serif can be used
- body / buttons / forms: highly readable sans-serif
- clear size hierarchy
- intentional line length

Avoid:

- calligraphy fonts across the interface
- overly thin body text
- tiny metadata used to fake “premium” aesthetics
- arbitrary letter spacing on Chinese body text

Light/Dark themes must preserve typography metrics to avoid layout shift.

When reproducing a design, matching **line breaks and text block width** is as important as matching nominal font size.

---

# 14. Icon system

Use **Lucide Astro** as the functional UI icon system.

- import semantic icons from `@lucide/astro`
- no emoji / Unicode glyphs as functional icons
- typical UI size: 16–20px
- keep stroke weight visually consistent
- icon-only controls require `aria-label`
- decorative icons use `aria-hidden="true"`
- prefer text + icon for primary actions

Custom SVG is reserved for:

- MythCanvas brand marks
- civilization motifs
- mythology-specific visual symbols

Do not mix multiple general-purpose icon libraries.

In screenshot reproduction, choose the Lucide icon whose silhouette most closely matches the reference unless the reference clearly uses a bespoke cultural motif.

---

# 15. Imagery rules

MythCanvas quality is strongly determined by image selection and crop.

## Prefer

- world-scale scenes
- divine architecture
- cloud seas
- celestial phenomena
- monumental silhouettes
- culturally coherent material/architecture
- strong focal hierarchy

## Content mix

Do not let the site become an “AI美女瀑布流”. A healthy visual mix should include:

- worlds / scenes
- characters
- architecture / ruins
- beasts / colossi

## Crop fidelity

When reproducing a reference, always check:

- `aspect-ratio`
- container size
- `object-fit`
- `object-position`
- focal point
- overlay opacity
- gradient direction

Many failed visual reproductions are image-crop failures, not CSS component failures.

---

# 16. Motion

Motion is atmospheric and slow.

Allowed examples:

- fade
- subtle blur reveal
- cloud drift
- low-amplitude parallax
- slow Hero zoom
- restrained light sweep

Avoid:

- bounce-heavy interactions
- gaming particle explosions
- gratuitous card rotation
- constant motion on every section

Support `prefers-reduced-motion`.

For screenshot verification, pause/settle motion when needed so comparisons are deterministic.

---

# 17. Accessibility and semantics

Visual fidelity does not justify breaking semantics.

Maintain:

- one meaningful page H1
- semantic navigation
- meaningful links/buttons
- keyboard focus
- accessible contrast
- image alt text where image conveys content
- `aria-label` for icon-only controls
- reduced-motion support
- ESC / keyboard behavior for dialogs where relevant

Do not flatten the entire design into positioned `<div>` elements to chase pixels.

---

# 18. Performance rules

Do not solve visual fidelity by making the site unnecessarily heavy.

Prefer:

- HTML/CSS first
- Astro server/static rendering for content
- JS only for real interaction
- correctly sized responsive images
- lazy loading below the fold
- explicit image width / height
- optimized R2/Cloudflare image delivery where available

Avoid:

- JS layout when CSS can reproduce it
- giant background images without responsive strategy
- loading multiple unused visual libraries

---

# 19. Anti-patterns for AI coding

Do not introduce these unless the reference explicitly contains them:

- generic SaaS gradient Hero
- huge rounded white cards
- excessive glass panels
- random `01 / 02 / 03` decoration when content is not sequential
- meaningless badges
- excessive chips
- neon-purple AI branding
- black + gold crypto styling
- one generic component repeated everywhere
- arbitrary hardcoded pixel offsets created without a visual reason
- placeholder gradient blocks when real reference assets exist
- replacing the approved composition with a “cleaner” personal interpretation

Do not describe a UI as “pixel perfect” unless it was actually rendered and compared.

---

# 20. Implementation strategy in an existing codebase

For screenshot-to-existing-page work:

1. Preserve route/data/API behavior.
2. Reuse existing semantic components where their geometry can match.
3. Modify shared tokens only when the target consistently demonstrates a shared design-system change.
4. Keep page-specific corrections local when they are page-specific.
5. Do not create a new design system parallel to the existing one.
6. Avoid broad refactors during visual reproduction unless required for fidelity.
7. Keep Light/Dark parity when touching shared components.
8. Check whether the change affects other core pages before finishing.

A visual reproduction task is not permission to rewrite architecture.

---

# 21. Completion checklist — design/build tasks

Before considering a normal MythCanvas UX task complete:

- [ ] Product loop remains clear
- [ ] Light and Dark both considered
- [ ] Civilization identity remains content-level
- [ ] Style Variant remains separate from Theme
- [ ] Image is visually more dominant than chrome where appropriate
- [ ] No generic SaaS / game HUD drift
- [ ] Canonical Design identity is preserved
- [ ] Desktop and mobile checked
- [ ] Lucide used for functional icons
- [ ] Focus / contrast / keyboard accessibility checked
- [ ] Responsive images and layout do not create obvious performance regressions

---

# 22. Completion checklist — visual reproduction tasks

A reference-driven UI task is not complete until:

- [ ] Reference was decomposed before implementation
- [ ] Target viewport was identified or explicitly chosen
- [ ] Major geometry matches the reference
- [ ] Hero/image crop was verified
- [ ] Typography wrapping was compared
- [ ] Grid density/card ratios were compared
- [ ] Theme/color temperature matches
- [ ] First browser screenshot was captured
- [ ] Top visual deltas were identified and repaired
- [ ] Second browser screenshot was captured
- [ ] Desktop verified
- [ ] Mobile verified when a mobile reference exists or the page is materially changed
- [ ] No business/API/SEO behavior was accidentally broken
- [ ] Result was not called “pixel perfect” without actual visual verification

If browser screenshot tooling is unavailable, mark the screenshot checklist items as blocked rather than pretending they passed.

---

# 23. Task result format for Codex / coding agents

For a significant visual reproduction, report concisely:

```text
Implemented:
- ...

Visual verification:
- Reference viewport: ...
- Pass 1 deltas: ...
- Pass 2 fixes: ...
- Remaining known visual differences: ...

Behavior preserved:
- ...
```

Do not flood the user with CSS implementation details. Report what changed, what was visually verified, and what remains different.

---

# 24. Core principle

For MythCanvas, good UI implementation is not:

> “The page has the same components.”

It is:

> **“At the target viewport, the user perceives essentially the same composition, atmosphere, hierarchy, and visual identity as the approved design — while the implementation remains responsive, semantic, maintainable, and true to the MythCanvas product system.”**
