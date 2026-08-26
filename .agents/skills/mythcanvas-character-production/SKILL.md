---
name: mythcanvas-character-production
description: Use when producing, curating, reviewing, naming, importing, or publishing MythCanvas character images. Orchestrates Canonical master generation, reference-pack promotion, style derivatives, QA, deterministic asset naming, R2/D1 persistence, and website-ready publication without requiring a production-management UI.
---

# MythCanvas Character Production

## Goal

Turn a mythology character definition into a durable, reusable image asset library.

This skill owns the production lifecycle, not character identity, rendering style, or website UI.

```text
Character Design
→ Canonical Master
→ Canonical Reference Pack
→ Selected Style Derivatives
→ QA
→ Deterministic Naming
→ Approved Artwork
→ Website presentation
```

The production process is agent/skill-driven. **Do not build an admin/production page unless explicitly requested.** Website pages only read and present approved data/assets.

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

Use the existing model instead of inventing a parallel asset system.

### D1

- `characters` — identity, `canonical_design_json`, website portrait fields
- `character_variants` — persistent age/costume/form variants
- `reference_assets` — approved character/variant/style references
- `generation_jobs` — exact generation recipe/provenance
- `artworks` — durable display/download assets
- `artwork_characters` — artwork ↔ character relationship

### R2

Stores image bytes. D1 stores keys, metadata, relationships, provenance and publication state.

## Production states

```text
UNREADY
  Canonical Design incomplete

ANCHORING
  generating/selecting canonical identity candidates

EXPANDING
  approved identity anchor exists; producing selected style/output derivatives

PUBLISHABLE
  approved artwork exists and website-facing asset pointers are valid
```

These are workflow concepts; do not add a database enum solely for them.

# Standard character production workflow

## Phase 0 — preflight

Before generating:

1. resolve stable `characterId`
2. verify generation-grade Canonical Design
3. verify `canonicalPrompt`
4. verify Civilization Visual DNA
5. resolve current active Style portfolio from `mythcanvas-style-system`
6. reject modern commercial adaptation copying
7. identify the first output target

If identity is weak, return to Character Design. Do not compensate by making the prompt longer.

## Phase 1 — Canonical Master

Generate identity-first candidates.

Recommended first pass:

```text
2–3 mobile canonical candidates
→ review identity / props / anatomy
→ select one canonical direction
→ generate desktop canonical from that approved direction
```

For a recurring humanoid character, the Canonical Master should establish:

- face language
- silhouette
- canonical costume vocabulary
- primary signature props
- adult/age presentation
- temperament

Do not approve an attractive image if a core mythological prop is wrong.

Example learned from Athena:

```text
wrong: owl used as the primary shield emblem
approved canonical direction: physical Gorgoneion / Medusa-head shield; owl remains an optional Athena symbol
```

A symbol may be historically associated with a character without belonging on every prop.

## Canonical approval gate

### Identity

- face/silhouette coherent
- role and temperament readable
- culturally grounded costume vocabulary
- primary signature props historically/mythologically coherent
- no recognizable modern franchise leakage

### Technical

- anatomy coherent
- hands actually grip props
- no weapon/body intersections
- no duplicated/missing limbs
- no malformed shield/spear geometry
- no text/watermark/logo/UI
- clean crop and usable resolution

### Reusability

- face and major silhouette visible enough for future references
- not dependent on a one-off VFX gimmick
- not over-stylized as the sole identity anchor

## Phase 2 — Reference Pack

Promote approved R2 assets into `reference_assets`.

Useful types:

```text
portrait-front
portrait-three-quarter
fullbody-front
fullbody-three-quarter
turnaround
expression-sheet
signature-props
```

Start small. One strong 3/4 identity anchor plus one strong full-body anchor is often better than many conflicting references.

Rules:

- character identity refs → `owner_type='character'`
- persistent variant refs → `owner_type='character_variant'`
- rendering-only refs → `owner_type='style'`
- never use a style reference as character identity
- never mix conflicting canonical faces/costumes
- prefer `reference_assets` pointing at an existing approved R2 object; do not duplicate image bytes merely to create a reference copy

# Phase 3 — Style derivative production

## Active default portfolio

Current validated production order:

```text
1. canonical
2. sacred
3. cinematic
4. anime
5. cyber-myth
```

`dark-fantasy` is deprecated and removed from the default derivative matrix because the Athena pilot did not produce enough visual differentiation from canonical/cinematic. See `mythcanvas-style-system`.

Do not generate every possible style/variant combination by default.

## Recommended per-style workflow

When a style direction is not yet proven on a character:

```text
2 mobile candidates
→ choose one direction
→ generate one matched desktop image
→ review pair
```

This is preferred over blindly generating mobile + desktop + several candidates at once.

## Device isolation

**Mobile and desktop are always separate deliverables and separate generation jobs.**

Never request both inside one model canvas.

Forbidden unless explicitly asked for a design board:

- mobile/PC side-by-side
- split image
- diptych
- contact sheet
- comparison poster
- aspect-ratio mockup board

“Batch generate mobile + PC” means execute two standalone generations, not create a combined image.

# Lessons from Athena pilot

The Athena pilot is the reference implementation for failure handling, not a character-specific exception.

## Lesson 1 — Canonical consistency is not pose duplication

Lock identity, not the whole screenshot.

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

This creates “same image, different background” content and defeats Style expansion.

Production rule:

> Each Style should have a role-appropriate pose vocabulary. A war deity should actually fight or command in Cinematic; Sacred may be ceremonial; Cyber Myth may be tactical/strategic.

## Lesson 2 — Canonical symbol lists are not mandatory checklists

Do not force every symbol into every scene.

For Athena:

- owl works in canonical/sacred quiet scenes
- owl should usually disappear in active close combat
- Gorgoneion shield and spear remain much higher-priority combat anchors

Use scene logic over mechanical checklist completion.

## Lesson 3 — Style must alter visual grammar, not color grading

A darker palette, ruined temple, smoke and weathering did not make Athena meaningfully Dark Fantasy.

Before producing a style pair, verify the style differs from the nearest existing style in at least three meaningful dimensions such as:

- rendering medium/surface
- material treatment
- lighting behavior
- camera grammar
- pose/motion language
- environment treatment
- costume-surface transformation

If the result is only “Canonical but darker/brighter/more neon”, reject the Style recipe before publishing.

## Lesson 4 — “High-end” is not “maximum detail”

Several Anime attempts accumulated too many chains, gems, filigree and fabric intersections. This created obvious AI-generated texture noise and also made anatomy harder to inspect.

Production target:

```text
large forms first
→ medium costume/material layers
→ limited selected micro-detail
```

Reject images where every surface competes for attention.

## Lesson 5 — Anime and Cyber Myth must not collapse together

Current approved distinction:

```text
Anime
= premium 2D commercial game key art
= material layers + character-selling illustration + commercial lighting

Cyber Myth
= premium stylized 3D anime / 3D game-cinematic rendering
= bold future-Olympus transformation + dimensional material response
```

Cyber Myth cannot be just Anime with blue/purple holograms.

## Lesson 6 — Anatomy must be traced, not glanced at

High visual quality can hide structural mistakes.

Before approval, mentally trace:

```text
pelvis → thigh → knee → shin → foot
shoulder → elbow → wrist → hand
weapon shaft → grip → full trajectory
shield → forearm/hand relationship
```

Reject ambiguous anatomy caused by garment slits, overlapping ribbons, armor or perspective.

Known pilot failures included:

- leg region appearing displaced under layered garment openings
- spear shaft visually passing through an arm
- weapon perspective becoming malformed

Do not fix these by hiding the area with VFX. Change pose/angle or regenerate locally.

## Lesson 7 — Full body is optional

Do not force a full-body composition if it increases anatomy/crop risk without adding value.

Valid choices:

- portrait
- medium shot
- 3/4 body
- knee-up
- full body

Choose based on the style's selling point and OutputSpec.

Sacred in particular often benefits from medium/3/4 framing rather than repetitive full-body standing poses.

## Lesson 8 — Candidate-first beats broad batch generation

When defining a new style direction for a character:

```text
produce 2 mobile candidates
select direction
then generate PC
```

Advantages:

- cheaper iteration
- clearer style decisions
- less mobile/desktop drift
- fewer bad assets
- easier reference selection

## Lesson 9 — Correct one dimension at a time

When a result is close, use targeted correction.

Examples:

```text
shield symbol wrong → keep face/costume/scene; correct shield only
spear intersects arm → keep style/scene; change grip and spear angle
Cyber looks too 2D → keep design; change rendering language to stylized 3D
pose too repetitive → keep identity/style; change action and expression
AI detail overload → keep large design; simplify ornament/VFX
```

Do not regenerate the entire art direction unless the Style itself failed.

# Per-style production intent

## Canonical

Purpose: stable identity anchor.

- clean mythology-first design
- readable signature props
- restrained effects
- identity over spectacle

## Sacred

Purpose: ceremonial/divine presentation.

- luminous sacred environment
- composed or dignified expression
- ceremonial posture
- medium/3Q framing allowed
- may include quiet companion symbols when scene-appropriate

Do not make it merely canonical with stronger bloom.

## Cinematic

Purpose: action and narrative spectacle.

For war/strategy characters, vary action meaningfully:

- thrust
- shield impact
- advancing defense
- battlefield command

Avoid repeated idle standing and avoid forcing companion symbols into active combat.

## Anime

Purpose: premium 2D commercial game key art.

- strong character-selling silhouette
- readable costume layers/materials
- commercial lighting
- controlled detail density
- anatomically clear garment openings

Do not equate “二游高完成度” with infinite filigree/chains/gems.

## Cyber Myth

Purpose: bold future mythology reinterpretation while retaining identity.

- stylized 3D anime / 3D game-cinematic rendering
- stronger material transformation than Anime
- physically dimensional skin/metal/textile
- Greek/future-Olympus architecture rather than generic neon city
- restrained but confident adult glamour is acceptable when character is clearly adult
- no extreme exposure

# Character artwork filename convention

Every saved generation that may be reviewed, imported, referenced, or published must be renamed immediately. Never keep provider defaults such as `imagegen.png`, Chinese free-form filenames, `final.png`, or `new-2.png` as durable asset names.

## Canonical grammar

```text
<character>__<style>__<device>__<variant>__<concept>__vNN.<ext>
```

Example:

```text
athena__canonical__mobile__base__olympus-dawn__v01.png
athena__canonical__desktop__base__olympus-dawn__v01.png
athena__sacred__mobile__base__temple-rite__v01.png
athena__cinematic__desktop__base__battle-thrust__v02.png
athena__anime__mobile__base__battle-command__v01.png
athena__cyber-myth__desktop__base__tactical-guard__v01.png
```

The double underscore `__` is the field separator. Individual field values use lowercase kebab-case.

## Field rules

### `character`

Use the canonical `characters.slug` exactly.

```text
athena
anubis
freyja
amaterasu
```

Character slugs are already globally unique; do not duplicate mythology in the filename.

### `style`

Use the actual stable Style ID/slug, never an ad-hoc visual description.

Current active examples:

```text
canonical
sacred
cinematic
anime
cyber-myth
```

### `device`

Only:

```text
mobile   → outputSpecId: mobile-wallpaper
desktop  → outputSpecId: desktop-wallpaper
```

Do not use `pc`, `phone`, `vertical`, `horizontal`, `9x16`, or resolution numbers as aliases.

### `variant`

Use:

```text
base
```

when there is no persistent CharacterVariant.

Otherwise use the stable variant slug, for example:

```text
ceremonial
battle-armor
mature
```

A temporary pose, lighting change, scene, or expression is not a variant.

### `concept`

Use a short 1–4 word kebab-case concept slug representing the scene/action idea.

Good:

```text
olympus-dawn
temple-rite
battle-thrust
battle-command
tactical-guard
moonlit-court
```

Bad:

```text
beautiful-image
final-approved
very-cool-athena
cyber-purple-version
```

Do not repeat metadata already encoded by other fields.

### `vNN`

Two-digit immutable generation/revision sequence for the same first five fields:

```text
v01
v02
v03
```

If visual pixels change through regeneration or edit, create the next version. Preserve `source_generation_id`/provenance in metadata.

Do not overwrite `v01` with a different image.

## Character set and separators

Durable filenames must use:

```text
ASCII lowercase letters
numbers when required
hyphen inside fields
exactly two underscores between fields
lowercase file extension
```

Do not use:

- Chinese/Japanese/Korean characters
- spaces
- parentheses
- timestamps
- random UUIDs as the human-facing filename
- `final`, `final2`, `new`, `ok`, `selected`, `approved`
- model/provider names such as `gpt-image-2`

## Metadata intentionally excluded from filenames

Do not encode these because they are mutable, redundant, or belong in D1/manifest metadata:

- approval/review status
- publish status
- prompt text
- model/provider
- generation ID
- exact width/height
- file size
- creation date
- alt text
- reference-pack role

The filename is a durable human/machine index, not the database.

## Candidate and approved naming

Candidate status is **not** part of the filename.

For example, if two mobile Anime candidates are generated from the same concept:

```text
athena__anime__mobile__base__battle-command__v01.png
athena__anime__mobile__base__battle-command__v02.png
```

If `v02` is approved, keep that filename. Do not rename it to `approved` or `final`.

## Local import staging

Preferred local staging layout:

```text
imports/characters/<character-slug>/
├── manifest.json
├── <character>__<style>__<device>__<variant>__<concept>__vNN.png
└── ...
```

Example:

```text
imports/characters/athena/
├── manifest.json
├── athena__canonical__mobile__base__olympus-dawn__v01.png
├── athena__canonical__desktop__base__olympus-dawn__v01.png
├── athena__sacred__mobile__base__temple-rite__v01.png
├── athena__sacred__desktop__base__temple-rite__v01.png
├── athena__cinematic__mobile__base__battle-thrust__v01.png
├── athena__cinematic__desktop__base__battle-thrust__v01.png
├── athena__anime__mobile__base__battle-command__v01.png
├── athena__anime__desktop__base__battle-command__v01.png
├── athena__cyber-myth__mobile__base__tactical-guard__v01.png
└── athena__cyber-myth__desktop__base__tactical-guard__v01.png
```

Use `.agents/skills/mythcanvas-character-production/references/asset-manifest.example.json` as the manifest template.

## Manifest contract

The importer/agent must validate that filename fields agree with manifest metadata:

```text
character ↔ characterSlug / characterId
style ↔ styleId
device ↔ outputSpecId
variant ↔ variantId
concept ↔ concept
vNN ↔ version
```

The manifest remains authoritative for data that does not belong in the filename:

```text
alt
role
reviewStatus
publishStatus
promoteToReference
referenceType
setAsPortrait
```

Fail closed on mismatch. Do not silently import a file under conflicting metadata.

# Asset lifecycle

## Generation candidate

Every provider call creates/updates a `generation_jobs` record containing:

```text
character/entity id
variant id
mythology id
style id
scene/action/composition
output spec
final prompt + prompt layers
provider/model/quality
reference ids
R2 asset key
source generation id when edited
```

A successful generation is a candidate, not automatically website content.

After the image is retained for review, assign its deterministic filename before moving it into the import staging directory.

## Approved artwork

When an image passes Character QA + Style QA + Anatomy/Prop QA + Output QA:

- keep bytes in R2
- insert/update `artworks`
- set `type='character'`
- link through `artwork_characters`
- preserve style/output dimensions and provenance
- set `review_status='approved'`
- set `publish_status='published'` only when public

## Canonical portrait

When one approved asset becomes the website portrait:

- update `characters.portrait_src/alt/width/height`
- keep the canonical source/provenance in R2 + artwork/reference records
- do not duplicate image bytes solely for the portrait field

# R2 convention

Use the deterministic filename unchanged as the R2 leaf name.

Canonical base assets:

```text
characters/<character-slug>/canonical/<output-spec-id>/<filename>
```

Style derivatives:

```text
characters/<character-slug>/styles/<style-id>/<output-spec-id>/<filename>
```

Persistent variants:

```text
characters/<character-slug>/variants/<variant-slug>/<style-id>/<output-spec-id>/<filename>
```

Examples:

```text
characters/athena/canonical/mobile-wallpaper/athena__canonical__mobile__base__olympus-dawn__v01.png
characters/athena/styles/anime/desktop-wallpaper/athena__anime__desktop__base__battle-command__v01.png
characters/athena/variants/battle-armor/sacred/mobile-wallpaper/athena__sacred__mobile__battle-armor__temple-rite__v01.png
```

Reference Pack records should normally point to the same approved R2 object instead of duplicating bytes into a separate `references/` folder.

If a production-only reference sheet is itself a distinct image asset, use:

```text
references/<character-slug>/<reference-type>/<character-slug>__ref-<reference-type>__vNN.<ext>
```

Such production-only reference sheets are not normal website artworks.

# Website presentation contract

Website code only consumes approved published assets.

Typical read path:

```text
characters
→ portrait
→ artwork_characters
→ artworks(review_status='approved', publish_status='published')
→ style/output metadata as needed
```

Website components must not:

- decide canonical selection
- mutate review state
- create reference packs
- run generation
- reconstruct production provenance from filenames

# Batch onboarding

After the pilot pattern is stable, each major character follows:

```text
1. Validate Canonical Design
2. Generate canonical mobile candidates
3. Approve canonical direction
4. Generate canonical desktop
5. Promote reference pack
6. Select useful active styles only
7. For each new style: mobile candidates → select → desktop
8. Run identity/style/anatomy/prop/output QA
9. Rename retained files using the deterministic filename grammar
10. Build/validate manifest
11. Promote approved images to R2 + artworks
12. Update website portrait if appropriate
```

Do not optimize for image count. Optimize for a small coherent asset library.

# Completion checklist

- [ ] Canonical Design is generation-grade
- [ ] canonical identity and primary props are historically/mythologically coherent
- [ ] mobile/desktop are separate generation jobs
- [ ] no composite/contact-sheet output was accepted accidentally
- [ ] canonical reference pack contains coherent high-signal assets
- [ ] active Style comes from current validated portfolio
- [ ] derivative pose/expression is meaningfully style/scene-specific
- [ ] optional symbols were selected contextually
- [ ] Style differentiation gate passed
- [ ] detail hierarchy avoids generic AI ornament overload
- [ ] anatomy continuity passed
- [ ] weapon/hand/shield intersections passed
- [ ] retained image filenames follow the deterministic grammar
- [ ] filename metadata agrees with manifest metadata
- [ ] approved assets retain prompt/model/reference provenance
- [ ] public assets are linked in `artworks` + `artwork_characters`
- [ ] website only reads/presents approved published assets
- [ ] no production-management UI was introduced without explicit need
