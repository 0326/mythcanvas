---
name: mythcanvas-character-production
description: Use when producing, curating, reviewing, or publishing MythCanvas character images. Orchestrates Canonical master generation, reference-pack promotion, style/variant derivatives, QA, R2/D1 asset persistence, and website-ready publication without requiring a production-management UI.
---

# MythCanvas Character Production

## Goal

Turn a mythology character definition into a durable, reusable image asset library.

This skill owns the **production lifecycle**, not character identity, rendering style, or website UI.

```text
Character Design
→ Canonical Master
→ Canonical Reference Pack
→ Style / Variant Derivatives
→ QA
→ Approved Artwork
→ Website presentation
```

The production process is agent/skill-driven. **Do not build an admin/production page unless explicitly requested.** Website pages only read and present approved data/assets.

## Read first

- `.agents/skills/mythcanvas-character-design/SKILL.md` — who the character is
- `.agents/skills/mythcanvas-character-generation/SKILL.md` — how one image request is composed/executed
- `.agents/skills/mythcanvas-style-system/SKILL.md` — rendering grammar
- `.agents/skills/mythcanvas-content-model/SKILL.md` — content/IP/data rules

## Ownership boundaries

Keep these concerns independent:

```text
Character        = identity / Canonical Design
CharacterVariant = persistent age, costume, or form delta
Style            = rendering language only
Scene            = what/where is happening
OutputSpec       = device ratio, resolution, safe zones
Production       = which images to make, approve, reference, and publish
Website          = read-only presentation of approved assets/data
```

Never move production-state logic into Astro presentation components.

## Existing storage contract

Use the current platform model rather than inventing a parallel asset system.

### D1

- `characters` — identity, symbols, `canonical_design_json`, website portrait fields
- `character_variants` — persistent age/costume/form variants
- `reference_assets` — approved identity/variant/style references; metadata only
- `generation_jobs` — exact generation request/provenance
- `artworks` — durable display/download assets
- `artwork_characters` — artwork ↔ character relationship

### R2

Stores image bytes. D1 stores keys, metadata, relationships, provenance, and publication state.

Do not store large image bytes in D1.

## Production states

Treat character production as four logical stages:

```text
UNREADY
  Canonical Design incomplete

ANCHORING
  Canonical Design ready; generating/selecting master identity images

EXPANDING
  Canonical Reference Pack approved; producing Style / Variant / OutputSpec derivatives

PUBLISHABLE
  At least one approved artwork exists and required website-facing asset pointers are valid
```

These are workflow concepts; do not add a new database enum solely for them unless product code later requires it.

## Standard character production workflow

### Phase 0 — preflight

Before image generation:

1. resolve the character by stable `characterId`
2. verify `canonicalDesign` contains high-signal identity anchors
3. verify `canonicalPrompt` exists for important recurring characters
4. verify mythology Civilization Visual DNA exists
5. reject modern commercial adaptation references
6. identify desired output target(s)

If identity is weak, return to `mythcanvas-character-design`. Do not compensate with a longer scene prompt.

### Phase 1 — Canonical Master

Generate canonical identity candidates first.

Default recipe:

```text
variant: canonical / none
style: canonical
scene: culturally grounded, visually quiet, identity-first
composition: full-body or 3/4-body, readable face + signature props
quality: high for approval candidates
references: none unless an approved MythCanvas reference already exists
```

Recommended candidate set for a new major character:

```text
A. portrait-three-quarter
B. fullbody-front
C. fullbody-three-quarter
```

Generate multiple candidates when necessary, but approve only coherent images that clearly represent the same character identity.

A beautiful image that drifts from Canonical Design must not become the master.

## Canonical Master approval

Evaluate independently:

### Identity

- face/silhouette matches Canonical Design
- body/age presentation is correct
- culturally grounded costume language survives
- signature props/symbols are coherent
- temperament/posture matches the character
- no recognizable modern franchise design leakage

### Technical image quality

- anatomy/face/hands/props are coherent
- no duplicate limbs or unexplained duplicate props
- no text/watermark/logo/UI artifacts
- sufficient resolution and clean crop

### Reusability

- character is readable without relying on a one-off special effect
- face and major silhouette are unobstructed enough to guide future generations
- image is not so stylized that it becomes unusable as an identity reference

## Reference Pack promotion

After master approval, promote selected R2 assets into `reference_assets`.

Use supported asset types:

```text
portrait-front
portrait-three-quarter
fullbody-front
fullbody-three-quarter
turnaround
expression-sheet
signature-props
```

Rules:

- character identity references use `owner_type='character'`
- persistent variant references use `owner_type='character_variant'`
- Style moodboards/references use `owner_type='style'`
- never store a Style image as a Character identity reference
- prefer 1–3 high-signal references per generation request
- archive superseded references instead of silently replacing provenance

The first production pass does **not** require all seven reference types. Start with one strong portrait/3Q and one strong full-body anchor; expand only when consistency needs it.

## Phase 2 — derivative matrix

Once the Canonical Reference Pack is stable, expand orthogonal dimensions deliberately.

Recommended priority:

```text
1. canonical × mobile
2. canonical × desktop
3. sacred × mobile/desktop
4. cinematic × mobile/desktop
5. additional approved styles
6. character variants
7. variant × style combinations
```

Do not generate the full Cartesian product by default. Produce only combinations useful for the site/content plan.

Each derivative must still resolve:

```text
Character
+ optional CharacterVariant
+ Mythology Visual DNA
+ Style
+ Scene
+ Composition
+ OutputSpec
+ selected Reference Pack
```

Use `mythcanvas-character-generation` for exact prompt composition/execution.

## Reference selection policy

For a normal recurring-character derivative:

```text
Reference A = canonical identity anchor
Reference B = selected variant reference, only when needed
Reference C = optional signature-prop or style reference
```

State the role of every reference explicitly in the generation instruction.

Do not mix several conflicting faces/costumes merely because they are all tagged with the same character.

## Prompt ownership

Prompts are not loose files scattered beside images.

Persist responsibility as follows:

- `characters.canonical_design_json.canonicalPrompt` = stable character-owned base direction
- `character_variants.prompt_fragment` = persistent variant delta
- Style profile = rendering language
- generation request = scene/composition/output/user refinement
- `generation_jobs.prompt` + `prompt_layers_json` = immutable snapshot of the actual composed request

Never edit an old generation prompt to describe a newer asset. Create a new generation job.

## Asset lifecycle

### 1. Generation result

Every provider call creates/updates a `generation_jobs` record containing:

```text
character/entity id
variant id when used
mythology id
style id
scene
composition
output spec
final prompt
prompt layers
provider/model/quality
reference asset ids
R2 asset key
source generation id for edits/derivatives
```

### 2. Candidate

A successful generation is a candidate, not automatically website content.

Keep failed/rejected generations out of `artworks` unless there is an explicit audit requirement.

### 3. Approved artwork

When an image passes Character QA + Style QA + Output QA and should become a durable site asset:

- keep bytes in R2
- insert/update an `artworks` record
- set `type='character'`
- link it through `artwork_characters`
- set correct `mythology_id`, `style_id`, dimensions and asset metadata
- preserve prompt/generation provenance in `prompt_meta_json`
- use `review_status='approved'`
- use `publish_status='published'` only when intended for public presentation

### 4. Canonical portrait

When one approved image becomes the character's primary website portrait:

- keep the canonical source in R2 / artworks/reference metadata
- update `characters.portrait_src`, `portrait_alt`, `portrait_width`, `portrait_height`
- do not duplicate image bytes merely to satisfy the portrait field

Changing the website portrait does not change Canonical Design by itself.

## R2 key convention

Prefer deterministic, character-centered keys:

```text
characters/<character-slug>/canonical/<asset-id>.<ext>
characters/<character-slug>/styles/<style-id>/<output-spec-id>/<asset-id>.<ext>
characters/<character-slug>/variants/<variant-slug>/<style-id>/<output-spec-id>/<asset-id>.<ext>
characters/<character-slug>/references/<reference-type>/<asset-id>.<ext>
```

Do not organize the primary hierarchy by date. Dates/job IDs may appear in filenames/metadata for provenance.

The path must make character ownership obvious while D1 remains the authoritative relationship model.

## Website presentation contract

Production Skill prepares data; website code only consumes it.

Website character pages may read:

```text
characters
→ portrait
→ artwork_characters
→ artworks(review_status='approved', publish_status='published')
→ styles / output dimensions as needed
```

Website components must not:

- decide whether an image becomes canonical
- generate reference packs
- mutate review states
- run GPT Image generation
- reconstruct production provenance from filenames

If presentation needs a new filter/tag, prefer adding/querying durable content metadata rather than adding production workflow UI.

## Athena pilot recipe

Use Athena as the reference implementation for the workflow, not as a special-case code path.

### Anchor pass

```json
{
  "characterId": "character-athena",
  "styleId": "canonical",
  "scene": "a calm high-altitude Olympus marble terrace at dawn",
  "composition": "identity-first full-body three-quarter portrait, spear and Aegis clearly readable",
  "outputSpecId": "mobile-wallpaper"
}
```

Approve a stable face/silhouette/costume interpretation, then promote the best identity anchors to `reference_assets`.

### Validation derivatives

Produce at minimum:

```text
canonical × desktop
sacred × mobile
cinematic × desktop
```

All must preserve the same Athena identity while clearly changing only Style/scene/composition/output dimensions.

If this pilot fails consistency QA, improve the Canonical Reference Pack before producing more characters.

## Batch character onboarding

Once the pilot is stable, every new character follows the same recipe:

```text
1. Validate Canonical Design
2. Generate canonical candidates
3. Approve master
4. Promote reference pack
5. Generate selected derivative matrix
6. Run three-part QA
7. Promote approved candidates to artworks
8. Set/update primary portrait when appropriate
9. Verify website can read published assets
```

Never skip anchoring for a major recurring humanoid character just to increase image count quickly.

Non-humanoid creatures may use silhouette/body/texture references instead of face-oriented references.

## QA and correction policy

Run three independent checks from `mythcanvas-character-generation`:

```text
Character QA
Style QA
Wallpaper QA
```

When a candidate fails, make the smallest targeted correction possible.

Examples:

```text
identity drift      → strengthen/select better Character reference
costume drift       → fix Variant/costume instruction
style drift         → adjust Style layer only
bad crop            → regenerate for OutputSpec/composition
bad hand/prop       → edit/regenerate the local failure
```

Do not redesign Canonical Design to justify a bad generation.

## Versioning rules

- Canonical Design changes should be intentional and reviewable
- approved reference changes should retain old provenance via archive/status
- every generated image keeps its own prompt/model/reference snapshot
- a new Style does not create a new Character
- a new costume/form/age state becomes a CharacterVariant when persistent
- a temporary pose/scene/lighting change is not a Variant

## Explicit non-goals

This skill does **not** require:

- an admin dashboard
- a character production management page
- a visual workflow editor
- a separate media CMS
- duplicated prompt files per image

Agent workflows, repository migrations/scripts, D1/R2 operations, and existing generation APIs are sufficient until a UI is explicitly justified.

## Completion checklist

- [ ] Canonical Design is generation-grade
- [ ] canonical master candidate set produced
- [ ] master passed identity/reusability QA
- [ ] reference pack contains high-signal approved assets
- [ ] derivative generation uses reference pack where useful
- [ ] every generation retains prompt/model/reference provenance
- [ ] approved public images are promoted into `artworks`
- [ ] `artwork_characters` relationship is present
- [ ] primary `characters.portrait_*` points to an approved asset when selected
- [ ] R2 path follows character-centered convention
- [ ] website only reads/presents approved published assets
- [ ] no production-management UI was introduced without explicit need
