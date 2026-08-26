---
name: mythcanvas-character-production
description: Use when producing, curating, reviewing, naming, importing, or publishing MythCanvas character images. Orchestrates Canonical master generation, reference-pack promotion, style derivatives, QA, simple asset naming, zero-config R2/D1 import, and website-ready publication without requiring a production-management UI.
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
→ One-command Import
→ Website presentation
```

The production process is agent/skill-driven. **Do not build an admin/production page unless explicitly requested.** Website pages only read and present approved assets/data.

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
- reference records should point to the same approved R2 object; do not duplicate image bytes

The zero-config importer automatically promotes `canonical_m_01` to:

```text
characters.portrait_*
reference_assets(asset_type='portrait-three-quarter')
```

Other images are not automatically promoted to Character references.

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

Failure pattern:

```text
canonical standing pose
→ sacred standing pose
→ cinematic standing pose
```

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

# Zero-config import contract

**There is no `manifest.json`.**

The local staging directory contains image files only:

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

Therefore the importer defaults every staged image to:

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

Cyber Myth:

```text
imports/characters/athena/cyber-myth_m_01.png
→ characters/athena/styles/cyber-myth/mobile-wallpaper/cyber-myth_m_01.png
```

Website URL is always:

```text
/media/<R2-key>
```

## Automatic canonical behavior

`canonical_m_01` has special production meaning:

1. imported as an approved/published Artwork
2. linked through `artwork_characters`
3. set as `characters.portrait_*`
4. registered as the active `portrait-three-quarter` Character reference using the same R2 object

`canonical_pc_01` remains a normal approved canonical Artwork; it is not automatically added to Reference Pack because framing cannot be inferred safely from a filename.

## Import command

Single character:

```bash
npm run artwork:import -- athena
```

Multiple characters:

```bash
npm run artwork:import -- athena freyja
```

All staged character folders:

```bash
npm run artwork:import -- --all
```

Validate local files without modifying Cloudflare:

```bash
npm run artwork:import -- athena --dry-run
```

Use local Wrangler storage:

```bash
npm run artwork:import -- athena --local
```

Remote Cloudflare is the default.

The importer must fail closed when:

- character folder slug does not resolve in D1
- style is not in the active production portfolio
- style does not resolve to an active D1 Style
- image filename is malformed
- duplicate style/device/sequence exists
- `m` image is not portrait
- `pc` image is not landscape
- image bytes cannot be parsed
- Wrangler R2/D1 operations fail

R2 uploads happen before the transactional D1 write. Re-running is idempotent: the same R2 keys are overwritten and deterministic D1 IDs are upserted.

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
5. Promote canonical_m_01 through importer/reference rule
6. Select useful active styles only
7. For each new style: mobile candidates → select → desktop
8. Run identity/style/anatomy/prop/output QA
9. Put only approved images under imports/characters/<character-slug>/
10. Rename each image to <style>_<pc|m>_<NN>.<ext>
11. Run npm run artwork:import -- <character-slug>
12. Verify website presentation
```

Do not optimize for image count. Optimize for a small coherent asset library.

# Completion checklist

- [ ] Canonical Design is generation-grade
- [ ] canonical identity and primary props are coherent
- [ ] mobile/desktop are separate generation jobs
- [ ] no composite/contact-sheet output was accepted
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
- [ ] canonical_m_01 promotes portrait + Character reference
- [ ] public assets are linked in `artworks` + `artwork_characters`
- [ ] website only reads/presents approved published assets
- [ ] no production-management UI was introduced without explicit need
