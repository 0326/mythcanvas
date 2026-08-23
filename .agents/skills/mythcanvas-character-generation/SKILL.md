---
name: mythcanvas-character-generation
description: Use when generating MythCanvas character wallpapers or implementing the generation pipeline. Composes Character/Variant + Civilization Visual DNA + Style + Scene + OutputSpec into GPT Image 2 prompts, executes generation, records provenance, and runs identity/style/output QA.
---

# MythCanvas Character Generation

## Goal

Generate reusable, traceable MythCanvas character artwork without coupling Character identity to rendering Style.

This skill is an **orchestrator**. It does not redefine characters or styles.

Read first:

- `.agents/skills/mythcanvas-character-design/SKILL.md`
- `.agents/skills/mythcanvas-style-system/SKILL.md`
- `.agents/skills/mythcanvas-content-model/SKILL.md`

## Input model

A generation request should resolve these independent dimensions:

```text
Character
+ optional CharacterVariant
+ Mythology / Civilization Visual DNA
+ Style
+ Scene
+ Composition
+ OutputSpec
+ optional user refinement
```

Use stable IDs, not free-text replacements for known entities.

Example:

```json
{
  "characterId": "character-athena",
  "variantId": "athena-mature-ceremonial",
  "styleId": "cyber-myth",
  "scene": "Olympus at night",
  "composition": "heroic full-body with environmental depth",
  "outputSpecId": "mobile-wallpaper",
  "description": "restrained electric-blue divine circuitry"
}
```

## Output specifications

MythCanvas V1 has two primary wallpaper targets.

### Desktop wallpaper

```text
id: desktop-wallpaper
aspect: 16:9
final: 2560 × 1440
```

### Mobile wallpaper

```text
id: mobile-wallpaper
aspect: 9:16
final: 1440 × 2560
```

Both dimensions are multiples of 16 and stay within GPT Image 2's documented size constraints.

For fast drafts, lower-resolution equivalents may be used while preserving the exact ratio:

```text
desktop draft: 1280 × 720
mobile draft: 720 × 1280
```

Do not stretch a generated image into another aspect ratio. Regenerate/recompose for the target device.

## Wallpaper composition rules

### Desktop

- preserve wide environmental storytelling
- keep the primary subject away from extreme left/right crop risk
- allow clean negative space for desktop icons where the composition permits
- avoid making a single portrait fill the entire 16:9 frame unless intentionally requested

### Mobile

- treat lock-screen clock/status areas as a safe-zone concern
- keep key facial details away from the extreme top edge
- prefer a clear vertical silhouette
- avoid important props being clipped by bottom gesture/navigation regions
- use depth vertically: sky/light → subject → foreground/environment

## GPT Image 2 provider contract

Production model: `gpt-image-2`.

Keep the model ID configurable so the production deployment may pin a snapshot after evaluation.

Recommended generation parameters:

```text
model: gpt-image-2
size: exact OutputSpec dimensions
quality: high for publishable assets
background: opaque/auto for wallpapers
```

Use `low` or `medium` only for deliberate draft/iteration workflows.

GPT Image 2 accepts flexible sizes subject to API constraints; do not silently substitute arbitrary unsupported dimensions.

For reference-image/edit workflows, GPT Image 2 processes image inputs at high fidelity automatically. Do not send an `input_fidelity` override.

## Prompt philosophy

GPT Image 2 responds well to clear descriptive natural language. Do not imitate old diffusion-model prompt syntax.

Avoid keyword soup such as:

```text
masterpiece, 8k, best quality, ultra detailed, trending, (character:1.4)
```

Prefer explicit visual instructions and constraints.

Prompt length should be only as long as required to communicate identity, art direction, scene, composition, and output constraints.

## Prompt Composer contract

Compose in a stable priority order:

```text
1. Purpose / global MythCanvas art direction
2. Subject identity / Canonical Design
3. Character Variant delta
4. Civilization Visual DNA
5. Style visual grammar
6. Scene / action / camera
7. OutputSpec / wallpaper composition
8. User refinement
9. Guardrails / explicit exclusions
```

### Layer 1 — purpose

State that the image is one original premium MythCanvas mythology wallpaper and identify the target device.

### Layer 2 — character identity

Include only the highest-signal identity anchors:

- role
- silhouette/face anchors
- core symbols
- signature props
- temperament

Do not dump every database field.

### Layer 3 — variant delta

Describe only what differs from canonical:

```text
Present the same character as a mature adult wearing the approved ceremonial armor variant. Preserve all canonical identity anchors.
```

### Layer 4 — Civilization Visual DNA

Use culturally meaningful motifs/materials/architecture/atmosphere. Do not recolor everything blindly.

### Layer 5 — Style

Insert the selected Style's natural-language prompt template and critical render rules.

Explicitly state that Style changes rendering, not identity.

### Layer 6 — Scene / camera

Be concrete:

- what is happening
- where
- camera distance/angle
- subject placement
- lighting direction if important

### Layer 7 — output

State exact use and composition:

```text
Compose for a 9:16 mobile wallpaper at 1440×2560. Keep the face and signature symbols clear, preserve breathing room above the head for lock-screen UI, and avoid important details at the extreme bottom edge.
```

### Layer 8 — user refinement

Append only after system-owned identity/style constraints so casual user text cannot silently redefine the character.

### Layer 9 — guardrails

Use plain instructions:

- no text
- no watermark/signature/logo
- no modern franchise-specific costume/design
- no unrequested duplicate limbs/characters
- preserve named identity anchors

Do not rely on pseudo negative-prompt syntax.

## Example composed prompt

```text
Create one original premium MythCanvas mobile wallpaper featuring Athena, the Greek goddess of wisdom and strategic war. Preserve her established MythCanvas identity: poised athletic adult warrior-goddess silhouette, calm strategic gaze, spear, Aegis shield, owl motif, ivory textile and bronze-gold armor language.

Use the mature ceremonial-armor variant: more formal layered armor and mantle, dignified mature-adult presentation, while keeping the same face language, symbols, proportions, and temperament. Ground the environment in Greek Visual DNA with white marble, bronze, laurel geometry, high-altitude Olympus clouds, and restrained sacred gold light.

Render in the Cyber Myth style: refined futuristic materials and luminous geometry fused into the existing mythological design; controlled technology accents, premium material response, clear silhouette, no generic neon-city cyberpunk clichés. Place her on an Olympus terrace at night, heroic full-body three-quarter view, moonlit cloud depth behind her, with subtle electric-blue divine circuitry limited to armor seams and temple inlays.

Compose for a 9:16 mobile wallpaper at 1440×2560. Keep her face and spear readable, preserve breathing room above the head for lock-screen UI, and keep important details away from the extreme bottom edge. No text, watermark, signature, UI, or brand logo. Do not imitate any specific modern game, anime, film, or commercial Athena design.
```

## Character consistency strategy

Text anchors alone are acceptable for early prototyping but are not the final consistency solution for recurring characters.

For approved major characters:

```text
Canonical Reference Pack
→ select 1–3 high-signal references
→ GPT Image 2 reference/edit workflow
→ preserve identity at high fidelity
→ apply Variant + Style + Scene
```

Do not feed many conflicting reference images.

When a style reference and character reference are both used, state their roles explicitly:

```text
Reference A = character identity
Reference B = selected costume/form
Reference C = style/mood only
```

## Generation metadata

Every generated asset should retain enough metadata to reproduce/audit the request:

```text
character_id
character_variant_id
mythology_id
style_id
scene_id / scene text
output_spec_id
composition
final_prompt
prompt_layers_json
provider
generation_model
model_snapshot when pinned
quality
reference_asset_ids
source_generation_id
review status
created_at
```

## QA pipeline

Do not approve solely because the image is attractive.

Run three independent checks.

### A. Character QA

- identity anchors preserved
- selected age/costume/form correct
- face/silhouette not redesigned
- signature symbols coherent
- no modern adaptation leakage

### B. Style QA

- selected visual grammar is visible
- Style did not overwrite cultural identity
- material/line/light/camera behavior is coherent
- result does not look like generic AI art

### C. Wallpaper QA

- exact orientation/aspect is correct
- subject crop is safe
- focal hierarchy is readable at device size
- mobile safe zones / desktop negative space are reasonable
- no text/watermark/UI artifacts
- anatomy and hands/props pass visual inspection

If one category fails, regenerate or edit with a targeted correction; do not rewrite every prompt layer.

## Iteration rule

Prefer narrow revisions:

```text
Keep the same character identity, costume, camera, and scene. Change only the lighting to a brighter moonlit blue and reduce gold bloom.
```

This reduces drift and follows GPT Image 2's strength in precise edits.

## Batch generation

For large character/style matrices, generate from structured recipes rather than free-text loops.

Example:

```text
5 characters × 4 styles × 2 output specs
= 40 explicit generation recipes
```

Record each recipe independently. Never infer that a successful desktop image can simply be cropped into the mobile deliverable.

## Failure handling

- moderation/user-correctable errors: change the request before retrying
- 429/5xx/transient provider failures: bounded retry is acceptable
- identity/style QA failures: targeted prompt/edit iteration
- missing Character/Style/OutputSpec: fail closed; do not invent a replacement silently

## Completion checklist

- [ ] Character and Style are independent inputs
- [ ] Character Variant is explicit when used
- [ ] OutputSpec is explicit or deterministically inferred
- [ ] exact wallpaper dimensions are valid for GPT Image 2
- [ ] prompt uses natural-language instructions
- [ ] identity anchors precede user refinements
- [ ] prompt/model/reference metadata is stored
- [ ] Character QA passed
- [ ] Style QA passed
- [ ] Wallpaper QA passed
