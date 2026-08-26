---
name: mythcanvas-character-generation
description: Use when generating MythCanvas character wallpapers or implementing the generation pipeline. Composes Character/Variant + Civilization Visual DNA + Style + Scene + OutputSpec into GPT Image prompts, executes one deliverable per generation call, records provenance, and runs identity/style/anatomy/output QA.
---

# MythCanvas Character Generation

## Goal

Generate reusable, traceable MythCanvas character artwork without coupling Character identity to rendering Style.

This skill is an orchestrator. It does not redefine characters or styles.

Read first:

- `.agents/skills/mythcanvas-character-design/SKILL.md`
- `.agents/skills/mythcanvas-style-system/SKILL.md`
- `.agents/skills/mythcanvas-content-model/SKILL.md`
- `.agents/skills/mythcanvas-character-production/SKILL.md`

## Input model

A generation request resolves independent dimensions:

```text
Character
+ optional CharacterVariant
+ Mythology / Civilization Visual DNA
+ Style
+ Scene
+ Action / Pose
+ Composition / Camera
+ OutputSpec
+ optional user refinement
```

Use stable IDs, not free-text replacements for known entities.

## Critical output-isolation rule

**One generation call produces one deliverable image for one OutputSpec.**

This is non-negotiable.

If the user asks for:

```text
mobile + desktop
```

execute:

```text
Call A → mobile only, 9:16
Call B → desktop only, 16:9
```

If the user asks for two candidates:

```text
Candidate A → independent image
Candidate B → independent image
```

Never ask the image model to place multiple requested outputs on one canvas.

### Explicitly forbidden unless user requests a layout/comparison sheet

- diptych
- split screen
- two-panel layout
- contact sheet
- before/after board
- mobile + PC mockup in one image
- white canvas containing multiple aspect ratios
- captions such as “mobile” / “PC” inside generated artwork

Do not describe several deliverables in one image prompt even when calling a tool that supports multiple outputs. Each output gets its own complete generation instruction.

**Batch generation means multiple independent generation jobs, not a composite image.**

## Output specifications

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

Do not stretch/crop one device image into the other. Regenerate/recompose from the same approved identity/style references.

## Device-pair consistency

A mobile/desktop pair should feel like the same character and same style family, but it does **not** need the identical body pose.

Lock:

- face/identity
- canonical signature design language
- persistent variant costume/form if one is selected
- critical prop design such as Athena's approved Gorgoneion shield
- style rendering grammar
- scene family when the pair is intended as a matched set

Allow to change:

- camera distance
- body pose
- prop placement
- crop
- environment coverage
- direction of movement

Do not preserve a bad or boring pose merely for consistency.

## Canonical anchors are prioritized, not mandatory clutter

Canonical Design defines what makes the character recognizable. It does not mean every symbol must appear in every image.

Use context-sensitive selection.

Example for Athena:

```text
Canonical / Sacred portrait → spear + Gorgoneion shield + optional owl
active battlefield action   → spear + Gorgoneion shield; omit owl if it weakens action clarity
strategic Cyber Myth scene  → spear/shield + tactical geometry; owl optional
```

Never add an object only because it appears in the canonical symbol list when the scene logic says it should be absent.

## Prompt philosophy

Use clear natural language. Avoid diffusion keyword soup.

Bad:

```text
masterpiece, 8k, ultra detailed, best quality, anime:1.4, no bad hands
```

Good:

```text
Create one premium 9:16 mobile wallpaper. Use the approved Athena identity and Gorgoneion shield. Render as stylized 3D anime Cyber Myth with physically readable bronze, obsidian and textile materials. Show a low, confident tactical stance inside a future Olympus sanctuary. No text or interface labels.
```

## Prompt Composer order

```text
1. Purpose + exactly one target image
2. Subject identity / Canonical Design
3. Character Variant delta
4. Civilization Visual DNA
5. Style visual grammar
6. Scene
7. Action / pose / expression
8. Camera / composition
9. OutputSpec
10. User refinement
11. Guardrails / exclusions
```

The first line should make singular output intent explicit:

```text
Create ONE standalone 9:16 mobile wallpaper. Do not make a collage, split layout, comparison board or multi-panel image.
```

For desktop:

```text
Create ONE standalone 16:9 desktop wallpaper filling the entire canvas. No vertical panel, no white margins, no secondary image.
```

## Action and pose design

Do not reuse one hero stance across every style.

Before generating a derivative, classify the requested image as one of:

```text
identity / portrait
ceremonial
combat
command / strategy
travel / movement
ritual
quiet narrative
```

Then choose a pose that belongs to that role.

Examples:

- Sacred → calm ceremonial authority, medium/three-quarter framing
- Cinematic war deity → thrust, shield impact, active command, advancing defense
- Anime commercial key art → character-selling pose with clear silhouette and controlled fabric motion
- Cyber Myth strategy → tactical activation / command posture rather than another spear thrust

The same character can and should express different postures and facial states while preserving identity.

## Expression control

Avoid defaulting to the same neutral side-glance.

Use expressions tied to scene intent:

```text
canonical → calm, rational, authoritative
sacred → serene, composed, quietly divine
cinematic combat → focused, fierce, controlled
anime key art → confident, charismatic, character-selling
cyber myth → analytical, commanding, slightly glamorous when appropriate
```

For clearly adult characters, tasteful attractiveness can be expressed through posture, confidence, fitted costume sections, shoulder/leg exposure and facial attitude. Keep anatomy believable and avoid extreme exposure or fetishized framing.

## Detail hierarchy

Do not treat “high-end” as “add more tiny details everywhere”.

Prompt for:

- strong large-form silhouette
- readable medium costume/material layers
- limited high-value micro-detail
- quiet surfaces between accents

Avoid random chains, gemstones, filigree, sparks, glowing glyphs and loose fabric all competing at equal intensity.

## Style-specific generation notes

### Anime

Use the approved MythCanvas definition: premium **2D game key art / commercial character illustration**.

Emphasize:

- 2D illustration language
- material clarity
- layered costume design
- strong commercial lighting
- controlled high completion
- clean anatomy under garment openings

Do not drift into generic hyper-detailed AI illustration.

### Cyber Myth

Use the approved MythCanvas definition: premium **stylized 3D anime / high-end 3D game-cinematic rendering**.

Emphasize:

- dimensional skin/material shading
- bold but mythology-grounded future transformation
- physical Gorgoneion shield, not a generic hologram replacement
- Greek architecture transformed into future Olympus
- controlled blue/violet energy accents

It must remain clearly distinguishable from 2D Anime even if the palette is similar.

### Dark Fantasy

Deprecated from the active production portfolio. Do not generate by default. See `mythcanvas-style-system`.

## Reference strategy

For recurring characters:

```text
Canonical Reference Pack
→ select 1–3 high-signal references
→ reference/edit workflow
→ preserve identity
→ apply Style + Scene + Action + OutputSpec
```

State each reference role explicitly:

```text
Reference A = identity/face/canonical costume language
Reference B = approved persistent variant, if any
Reference C = style-only reference, if needed
```

Do not mix conflicting reference faces/costumes.

A style reference controls rendering qualities, not the depicted reference character's identity or franchise design.

## Anatomy and physical-intersection QA

This is a hard approval gate.

### Human anatomy

Check:

- both arms originate and bend plausibly
- hands connect naturally to wrists and actually grip props
- pelvis → thigh → knee → shin → foot continuity is understandable
- garment slits do not imply duplicate/displaced legs
- no missing or fused fingers in focal areas
- no impossible shoulder/torso twist

When anatomy is difficult to read because of fabric/armor overlap, simplify the costume intersection or change camera angle. Do not approve ambiguity merely because the image is visually impressive.

### Weapons / props

Trace the full prop geometry through the image.

Check:

- spear shaft does not pass through arm, chest, shield or cloth impossibly
- hand position matches shaft direction
- shield hand/forearm relationship is plausible
- weapon perspective is not distorted into a malformed object
- no duplicate spearheads/shields unless scene intentionally contains them

If a spear creates a collision, change the holding angle rather than trying to hide the defect with particles or crop.

## Wallpaper QA

### Mobile

- one complete 9:16 image only
- face below extreme top safe zone
- major prop readable without consuming the whole frame
- avoid unnecessarily forcing full body; three-quarter/medium shots are valid
- no important content trapped at bottom gesture area

### Desktop

- one complete 16:9 image only
- entire horizontal canvas filled
- no embedded vertical sub-image or white margin
- use width for environmental storytelling
- subject placement may shift from mobile to improve composition

## Style differentiation QA

Before approving a derivative, ask:

1. If I crop away the background, can I still tell this style from Canonical?
2. Is the difference more than darker/brighter color grading?
3. Did rendering/material/camera/pose grammar actually change?
4. Does the image look intentionally art-directed rather than generic AI fantasy?

If not, reject and redesign the generation recipe.

## Targeted iteration

When a candidate fails, identify the smallest failing dimension.

Examples:

```text
weapon intersects arm → keep identity/style/scene; change spear angle and hand placement
leg anatomy ambiguous → simplify garment opening and use clearer hip/knee line
style too close       → change rendering grammar/material/camera, not merely palette
Cyber too Anime       → enforce stylized 3D material/skin rendering and stronger tech transformation
AI detail overload    → reduce micro-decoration and particles; strengthen large/medium forms
boring repeated pose  → keep identity; change action/expression/camera
```

Do not rewrite Canonical Design to justify a failed image.

## Batch generation workflow

For N images:

```text
for each recipe:
  resolve exactly one OutputSpec
  compose one standalone-image prompt
  execute one independent generation call
  QA that image
  store that generation job independently
```

For a mobile + desktop pair:

```text
Job 1 = mobile
review
Job 2 = desktop using approved identity/style direction
review
```

When a style is still being explored, prefer candidate-first workflow:

```text
2 mobile candidates
→ select one art direction
→ generate desktop from the selected direction
```

This reduces wasted desktop generations and prevents style drift.

## Generation metadata

Every generated asset should retain:

```text
character_id
character_variant_id
mythology_id
style_id
scene/action
output_spec_id
composition
final_prompt
prompt_layers_json
provider/model/quality
reference_asset_ids
source_generation_id
review status
created_at
```

## Failure handling

- composite/multi-panel output when standalone requested → reject; regenerate as one isolated deliverable
- wrong aspect/orientation → reject; regenerate for exact OutputSpec
- anatomy/prop collision → targeted pose/angle correction
- identity drift → strengthen/select better identity reference
- style drift → change Style layer and differentiation dimensions
- AI-detail overload → simplify ornament/VFX hierarchy
- missing Character/Style/OutputSpec → fail closed; do not invent replacements

## Completion checklist

- [ ] exactly one standalone deliverable per generation call
- [ ] Character and Style are independent inputs
- [ ] OutputSpec is explicit
- [ ] mobile/desktop are generated independently
- [ ] action/pose is scene-appropriate rather than mechanically reused
- [ ] contextually unnecessary symbols are omitted
- [ ] detail hierarchy is controlled
- [ ] identity anchors precede refinements
- [ ] anatomy continuity passed
- [ ] hand/weapon/shield intersections passed
- [ ] Style differentiation passed
- [ ] wallpaper orientation/crop passed
- [ ] prompt/model/reference provenance is stored
