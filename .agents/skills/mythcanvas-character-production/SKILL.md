---
name: mythcanvas-character-production
description: Use when producing, curating, reviewing, naming, importing, updating, or publishing MythCanvas character images. Orchestrates Canonical master generation, reference-pack promotion, style derivatives, QA, simple asset naming, natural-language R2/D1 import, and website-ready publication without requiring a production-management UI.
---

# MythCanvas Character Production

## Goal

Turn a mythology character definition into a small, coherent, reusable image asset library.

This skill owns the production lifecycle, not character identity, rendering style, or website UI.

```text
Character Design
→ Canonical Master
→ Canonical Reference Pack
→ Selected Style Derivatives
→ QA
→ Simple Naming
→ Natural-language Import
→ Website presentation
```

The production process is agent/skill-driven. **Do not build an admin/production page unless explicitly requested.** Website pages only read and present approved assets/data.

## User interaction rule

The user should not need to remember or type shell commands.

Natural-language requests are the primary interface, for example:

```text
把雅典娜图片导入项目
先检查雅典娜图片，没问题再导入
把芙蕾雅和阿努比斯的图片一起导入项目
把已经准备好的全部角色图片导入
雅典娜换了新版 canonical_m_02，更新网站主图
只验证雅典娜图片，不写入线上数据
```

Interpret intent as follows:

- `导入 / 发布 / 更新网站图片` → validate first, then execute the remote R2 + D1 import if validation passes
- `检查 / 验证 / 看看有没有问题` → validation only; do not write R2/D1
- `全部角色` → operate on all staged character directories
- named characters → operate only on those character directories
- `本地验证 / 本地导入` → use local Wrangler storage rather than production resources

The implementation may invoke `scripts/import-character-artworks.mjs` internally. **Do not ask the user to run the underlying CLI unless they explicitly request command-line usage.**

For a normal import request, finish once the importer reports successful R2 uploads and D1 publication. Do not download every uploaded object for byte-for-byte comparison unless the user explicitly requests an integrity audit or the upload result is ambiguous.

## Read first

- `.agents/skills/mythcanvas-character-design/SKILL.md`
- `.agents/skills/mythcanvas-character-generation/SKILL.md`
- `.agents/skills/mythcanvas-style-system/SKILL.md`
- `.agents/skills/mythcanvas-content-model/SKILL.md`

## Ownership boundaries

```text
Character        = identity / Canonical Design
CharacterVariant = persistent age/costume/form delta
Style            = rendering language
Scene            = where/what happens
Action/Pose      = moment-specific body language
OutputSpec       = mobile/desktop composition target
Production       = what to generate, approve, name, reference and publish
Website          = read-only presentation of approved assets/data
```

Never move production-state logic into Astro presentation components.

## Existing storage contract

### D1

- `characters` — identity, `canonical_design_json`, website portrait fields
- `character_variants` — persistent age/costume/form variants
- `reference_assets` — approved character/variant/style references
- `generation_jobs` — exact generation recipe/provenance
- `artworks` — durable display/download assets
- `artwork_characters` — artwork ↔ character relationship

### R2

Stores image bytes. D1 stores keys, metadata, relationships, provenance and publication state.

# Standard production workflow

## Phase 0 — Preflight

Before generating:

1. resolve stable `characterId`
2. verify generation-grade Canonical Design + `canonicalPrompt`
3. verify Civilization Visual DNA
4. resolve current active Style portfolio
5. reject modern commercial adaptation copying
6. choose the first output target

If identity is weak, return to Character Design. Do not compensate with a longer scene prompt.

## Phase 1 — Canonical Master

Recommended first pass:

```text
2–3 mobile canonical candidates
→ review identity / props / anatomy
→ select one canonical direction
→ generate desktop canonical from that direction
```

Canonical establishes:

- face language
- silhouette
- canonical costume vocabulary
- primary signature props
- adult/age presentation
- temperament

Do not approve an attractive image if a core mythological prop is wrong.

Athena pilot lesson:

```text
wrong: owl used as the primary shield emblem
approved: physical Gorgoneion / Medusa-head shield; owl remains optional and scene-dependent
```

## Canonical approval gate

### Identity

- face/silhouette coherent
- role and temperament readable
- culturally grounded costume vocabulary
- core props mythologically coherent
- no modern franchise leakage

### Technical

- anatomy coherent
- hands actually grip props
- no weapon/body intersections
- no duplicated/missing limbs
- no malformed shield/spear geometry
- no text/watermark/logo/UI
- clean crop and usable resolution

### Reusability

- face and silhouette visible enough for future reference use
- not dependent on one-off VFX
- not over-stylized as the sole identity anchor

## Phase 2 — Reference Pack

Start small. One strong canonical 3/4 identity anchor is enough to begin; add another reference only when it improves consistency.

Rules:

- character identity refs → `owner_type='character'`
- persistent variant refs → `owner_type='character_variant'`
- rendering-only refs → `owner_type='style'`
- never use a Style image as Character identity
- never mix conflicting canonical faces/costumes
- reference records point to the same approved R2 object; do not duplicate image bytes

The importer automatically selects the **highest-sequence canonical mobile image** as the current primary Canonical asset:

```text
canonical_m_01.png
canonical_m_02.png  ← current primary because 02 is newer
```

The current primary is promoted to:

```text
characters.portrait_*
reference_assets(asset_type='portrait-three-quarter')
```

Superseded `portrait-three-quarter` references are archived, not silently reused.

# Phase 3 — Style derivatives

## Active default portfolio

```text
1. canonical
2. sacred
3. cinematic
4. anime
5. cyber-myth
```

`dark-fantasy` is deprecated and excluded from the default derivative matrix because the Athena pilot did not produce enough visual differentiation from canonical/cinematic.

## Per-style candidate workflow

For an unproven style direction:

```text
2 mobile candidates
→ select one direction
→ generate one matched desktop image
→ review the pair
```

Do not generate every Cartesian combination by default.

## Device isolation

**Mobile and desktop are always separate deliverables and separate generation jobs.**

Forbidden unless explicitly asked for a design board:

- mobile/PC side-by-side
- split image
- diptych
- contact sheet
- comparison poster
- aspect-ratio mockup board

“Batch generate mobile + PC” means two standalone images, not one combined canvas.

This generation rule does not prohibit importing an intentionally prepared design board, contact sheet, comparison board, or other composite artwork. Import policy is defined separately below.

# Lessons from Athena pilot

## 1. Canonical consistency is not pose duplication

Keep stable:

- face
- canonical design vocabulary
- persistent costume/form
- critical prop design

Allow derivatives to change:

- expression
- body pose
- crop
- camera
- action
- environmental coverage
- contextually optional symbols

Each Style should have a role-appropriate pose vocabulary.

## 2. Symbol lists are not mandatory checklists

Use scene logic. For Athena:

- owl works in quiet canonical/sacred scenes
- owl usually disappears in close combat
- spear + Gorgoneion shield are stronger combat anchors

## 3. Style must change visual grammar, not color grading

A style should differ from the nearest existing style across at least three meaningful dimensions:

- rendering medium/surface
- material treatment
- lighting behavior
- camera grammar
- pose/motion language
- environment treatment
- costume-surface transformation

“Canonical but darker/brighter/more neon” is not a sufficient new style.

## 4. High-end is not maximum detail

Use detail hierarchy:

```text
large forms first
→ medium costume/material layers
→ limited selected micro-detail
```

Reject AI ornament overload: endless chains, gems, filigree, floating shards and unrelated micro-texture.

## 5. Anime and Cyber Myth must remain distinct

```text
Anime
= premium 2D commercial game key art
= strong character-selling illustration + material layers + commercial lighting

Cyber Myth
= premium stylized 3D anime / 3D game-cinematic rendering
= bold future-myth transformation + dimensional material response
```

Cyber Myth cannot be Anime plus purple/blue holograms.

## 6. Anatomy must be traced, not glanced at

Before approval, mentally trace:

```text
pelvis → thigh → knee → shin → foot
shoulder → elbow → wrist → hand
weapon shaft → grip → full trajectory
shield → forearm/hand relationship
```

Known failures:

- displaced-looking leg under garment openings
- spear shaft passing through arm
- malformed weapon perspective

Do not hide structural errors with VFX. Change pose/angle or regenerate.

## 7. Full body is optional

Valid framing:

- portrait
- medium shot
- 3/4 body
- knee-up
- full body

Choose based on the Style and output composition, not habit.

## 8. Candidate-first beats broad batch generation

```text
2 mobile candidates
→ select direction
→ then PC
```

This reduces drift, bad assets and wasted generations.

## 9. Correct one dimension at a time

```text
shield wrong → keep face/costume/scene; fix shield only
spear intersects arm → keep style/scene; change grip/angle
Cyber too 2D → keep design; switch rendering language to stylized 3D
pose repetitive → keep identity/style; change action/expression
AI detail overload → keep large design; simplify ornament/VFX
```

# Per-style intent

## Canonical

- stable identity anchor
- clean mythology-first design
- readable core props
- restrained effects

## Sacred

- ceremonial/divine presentation
- luminous sacred environment
- dignified expression
- medium/3Q framing is valid
- quiet companion symbols only when scene-appropriate

## Cinematic

- action and narrative spectacle
- war/strategy characters should fight or command
- avoid repetitive idle standing

## Anime

- premium 2D commercial game key art
- strong character-selling silhouette
- readable costume layers/materials
- commercial lighting
- controlled detail density

## Cyber Myth

- stylized 3D anime / 3D game-cinematic rendering
- stronger material transformation than Anime
- dimensional skin/metal/textile
- future-myth architecture, not generic neon city
- restrained adult glamour is allowed when clearly adult; no extreme exposure

# Filename convention

The parent directory supplies the character. The filename supplies only Style, device and sequence.

```text
<style>_<device>_<NN>.<ext>
```

Examples:

```text
canonical_m_01.png
canonical_pc_01.png
sacred_m_01.png
sacred_pc_01.png
cinematic_m_01.png
cinematic_pc_01.png
anime_m_01.png
anime_pc_01.png
cyber-myth_m_01.png
cyber-myth_pc_01.png
```

Accepted parser grammar:

```regex
^(?<style>[a-z0-9]+(?:-[a-z0-9]+)*)_(?<device>pc|m)_(?<sequence>[0-9]{2})\.(?<ext>png|jpg|jpeg|webp)$
```

Parse as:

```text
parent directory → characterSlug
style            → styleId
m                → mobile-wallpaper
pc               → desktop-wallpaper
NN               → sequence
```

Do not put character name, variant, scene, resolution, date, provider, model, prompt or approval state into the filename.

## Published-image version rule

The `/media/` route and R2 objects use long-lived immutable caching. Therefore:

> Once a filename has been published, do not replace it with different pixels under the same filename.

Use the next sequence instead:

```text
canonical_m_01.png  old published image
canonical_m_02.png  new replacement image
```

Because the importer chooses the highest canonical-mobile sequence, importing `canonical_m_02` automatically updates the website portrait/reference without reusing a cached `_01` URL.

# Zero-config import contract

**There is no `manifest.json`.**

The staging directory contains image files only:

```text
imports/characters/<character-slug>/
├── canonical_m_01.png
├── canonical_pc_01.png
├── sacred_m_01.png
├── sacred_pc_01.png
├── cinematic_m_01.png
├── cinematic_pc_01.png
├── anime_m_01.png
├── anime_pc_01.png
├── cyber-myth_m_01.png
└── cyber-myth_pc_01.png
```

The importer derives:

```text
characterSlug / characterId
mythologyId
styleId
outputSpecId
sequence
mime type
real image width/height
R2 key
public /media URL
artwork id/slug/title/alt
review/publish defaults
```

Import-folder rule:

> Only put images that have already passed manual production QA into `imports/characters/<character-slug>/`.

Treat files deliberately staged in this directory as approved import candidates. A design board, contact sheet, comparison board, character sheet, or other multi-panel composition may be uploaded and published when it follows the normal filename and orientation contract. Do not reject or silently exclude a staged file solely because it contains multiple panels, labels, reference views, or a presentation layout.

The standalone-image rule governs default generation requests; it is not an import rejection rule. A staged board named `canonical_pc_NN` is a desktop canonical artwork record, but it does not replace the character portrait because portrait promotion only considers `canonical_m_NN`.

Therefore every staged image defaults to:

```text
review_status = approved
publish_status = published
source_type = ai
license = MythCanvas AI-generated original
```

No sidecar metadata file is required.

## R2 path derivation

Canonical:

```text
imports/characters/athena/canonical_m_01.png
→ characters/athena/canonical/mobile-wallpaper/canonical_m_01.png
```

Style derivative:

```text
imports/characters/athena/anime_pc_01.png
→ characters/athena/styles/anime/desktop-wallpaper/anime_pc_01.png
```

Website URL is always:

```text
/media/<R2-key>
```

## Automatic website behavior

After a successful remote import:

1. every staged image becomes an approved/published `artworks` record
2. every artwork is linked to its character through `artwork_characters`
3. the highest-sequence `canonical_m_NN` becomes `characters.portrait_*`
4. that same image becomes the active `portrait-three-quarter` Character reference
5. character listing cards automatically read the new portrait
6. character detail Hero automatically prefers the new portrait
7. the character artwork gallery automatically receives the imported style/device artworks

No Astro page edit is required for normal character-image replacement or gallery expansion.

If a folder contains no `canonical_m_NN`, importing style derivatives updates the gallery but **does not replace the existing character portrait/Hero**.

## Import validation

The importer fails closed when:

- character folder slug does not resolve in D1
- style is not in the active production portfolio
- style does not resolve to an active D1 Style
- image filename is malformed
- duplicate style/device/sequence exists
- `m` image is not portrait
- `pc` image is not landscape
- image bytes cannot be parsed
- Wrangler R2/D1 operations fail

R2 uploads happen before the transactional D1 write. Re-running with the same files is idempotent at the database level.

Successful Wrangler upload output plus successful D1 publication is sufficient completion evidence for an ordinary import. Avoid redundant R2 byte-download verification by default.

# Website presentation contract

Website code only consumes approved published assets.

```text
characters
→ portrait
→ artwork_characters
→ artworks(review_status='approved', publish_status='published')
→ styles/output metadata as needed
```

Website components must not:

- decide canonical selection
- mutate review state
- create reference packs
- run generation
- infer production provenance from filenames

# Batch onboarding

```text
1. Validate Canonical Design
2. Generate canonical mobile candidates
3. Approve canonical direction
4. Generate canonical desktop
5. Stage approved images under imports/characters/<character-slug>/
6. Select useful active styles only
7. For each new style: mobile candidates → select → desktop
8. Run identity/style/anatomy/prop/output QA
9. Rename retained images to <style>_<pc|m>_<NN>.<ext>
10. Ask the character-production skill in natural language to validate/import the character images
11. Verify website presentation after import
```

Do not optimize for image count. Optimize for a small coherent asset library.

# Completion checklist

- [ ] Canonical Design is generation-grade
- [ ] canonical identity and primary props are coherent
- [ ] mobile/desktop are separate generation jobs
- [ ] standalone generation remains the default, while intentionally staged composite/contact-sheet artworks are allowed to import
- [ ] active Style comes from the validated portfolio
- [ ] derivative pose/expression is style/scene-specific
- [ ] Style differentiation gate passed
- [ ] detail hierarchy avoids AI ornament overload
- [ ] anatomy continuity passed
- [ ] weapon/hand/shield intersections passed
- [ ] retained images use `<style>_<pc|m>_<NN>.<ext>`
- [ ] no `manifest.json` or sidecar metadata is required
- [ ] parent directory resolves to valid character slug
- [ ] style resolves to active D1 Style
- [ ] importer derives dimensions/output/R2 paths automatically
- [ ] highest canonical mobile sequence promotes portrait + Character reference
- [ ] published replacement images use a new sequence instead of overwriting cached URLs
- [ ] public assets are linked in `artworks` + `artwork_characters`
- [ ] website only reads/presents approved published assets
- [ ] user can operate the import workflow through natural-language Skill requests
- [ ] no production-management UI was introduced without explicit need
