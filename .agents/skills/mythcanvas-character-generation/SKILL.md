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

# Critical output-isolation rule

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

If the user asks for three candidates:

```text
Call A → candidate 01 only
review/store
Call B → candidate 02 only
review/store
Call C → candidate 03 only
```

Never ask the image model to place multiple requested outputs on one canvas.

## Prompt isolation for multi-candidate requests

A frequent failure mode is describing all requested candidates inside one prompt. That strongly encourages a triptych/contact-sheet result even if the natural-language instruction also says “separate images”.

For each generation call:

- mention only the current candidate
- do not list the other candidate concepts
- do not say “left / middle / right”
- do not describe “three scenes”, “three versions”, “three panels”, or “01 / 02 / 03” together
- do not use words such as `triptych`, `diptych`, `panel`, `contact sheet`, `comparison board`
- do not include labels/captions for candidate names in the artwork
- if the tool supports multiple outputs, still provide one complete standalone prompt per output/job rather than one shared multi-scene prompt

The current prompt should read as if no other candidate exists.

**Batch generation means multiple independent generation jobs, not a composite image.**

### Explicitly forbidden unless user explicitly requests a layout/comparison sheet

- diptych
- triptych
- split screen
- multi-panel layout
- contact sheet
- before/after board
- mobile + PC mockup in one image
- white canvas containing multiple aspect ratios
- captions such as “mobile”, “PC”, `anime_m_01`, or candidate titles inside generated artwork

# Output specifications

## Desktop wallpaper

```text
id: desktop-wallpaper
aspect: 16:9
final: 2560 × 1440
```

## Mobile wallpaper

```text
id: mobile-wallpaper
aspect: 9:16
final: 1440 × 2560
```

Do not stretch/crop one device image into the other. Regenerate/recompose from the same approved identity/style references.

# Device-pair consistency

A mobile/desktop pair should feel like the same character and same style family, but it does **not** need the identical body pose.

Lock:

- face/identity
- canonical signature design language
- persistent variant costume/form if one is selected
- critical prop design
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

## Desktop is a re-composition, not an outpaint by default

For a character wallpaper, do not mechanically widen a selected mobile image.

Use the selected mobile image as **identity/style direction**, then create a new 16:9 composition:

- adjust pose if needed
- move the character off-center when composition benefits
- use the horizontal space for scene depth
- preserve character prominence
- simplify or reposition props that become awkward in landscape framing

Only perform literal outpainting when the user explicitly asks to extend the same image.

# Character prominence and camera distance

MythCanvas character wallpapers are character-first, not environment concept art.

Unless the user asks for an environment-dominant scene:

## Mobile

- default to medium / knee-up / 3Q / full-body framing based on pose
- the face and torso must remain immediately readable
- the character should normally occupy roughly 50–75% of image height
- do not shrink the character merely to show more architecture

## Desktop

- the character should normally occupy at least about one third of the visual composition
- for character-focused desktop wallpapers, target roughly 35–50% of the canvas as the primary character mass
- for “pull the camera closer / character half-frame” requests, target roughly 45–60%
- use negative space and simplified environment rather than filling every horizontal region with architecture

A spectacular city is still background. If the character reads as a small figure inside a panorama, the wallpaper has failed the character-first brief.

# Canonical anchors are prioritized, not mandatory clutter

Canonical Design defines what makes the character recognizable. It does not mean every symbol must appear in every image.

Use context-sensitive selection.

Example for Athena:

```text
Canonical / Sacred portrait → spear + Gorgoneion shield + optional owl
active battlefield action   → spear + Gorgoneion shield; omit owl if it weakens action clarity
strategic Cyber Myth scene  → spear/shield + tactical geometry; owl optional
```

Never add an object only because it appears in the canonical symbol list when the scene logic says it should be absent.

# Prompt philosophy

Use clear natural language. Avoid diffusion keyword soup.

Bad:

```text
masterpiece, 8k, ultra detailed, best quality, anime:1.4, no bad hands
```

Also avoid maximalist phrases that routinely cause “AI-detail overload”:

```text
richly detailed cinematic fantasy, intricate everything, countless ornaments,
endless jewelry, dense particles, elaborate filigree across every surface
```

Good:

```text
Create ONE standalone 16:9 desktop character wallpaper.
Use the approved adult Ishtar identity and Anime style.
Keep the camera close: the character should occupy about half the composition.
Use clean 2D game-key-art rendering, broad readable costume shapes, restrained gold accents,
a simple sunset Mesopotamian skyline, and one clearly readable weapon.
No collage, no text, no excessive particles or micro-ornament.
```

# Prompt Composer order

```text
1. Purpose + exactly one target image
2. Subject identity / Canonical Design
3. Character Variant delta
4. Civilization Visual DNA
5. Style visual grammar
6. Scene
7. Action / pose / expression
8. Camera / composition + subject prominence
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

# Action and pose design

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

# Expression control

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

# Detail hierarchy

Do not treat “high-end” as “add more tiny details everywhere”.

Prompt for:

- one strong large-form silhouette
- a small number of readable medium costume/material layers
- 2–3 intentional high-detail focal zones at most
- quiet surfaces between accents
- atmospheric background shapes rather than architecture covered in micro-patterns
- controlled fabric movement rather than many unrelated ribbons

Avoid random chains, gemstones, filigree, sparks, glowing glyphs, tassels and loose fabric all competing at equal intensity.

When a user says an image has “AI味 / AI flavor”, first reduce **detail density and ornamental entropy**, not merely change the color grade.

# Style-specific generation notes

## Anime

Use the approved MythCanvas definition: premium **2D game key art / commercial character illustration**.

Emphasize:

- unmistakable 2D illustration language
- clean large shapes and readable silhouette
- restrained line/detail density
- simple, intentional light-and-shadow grouping
- material clarity without photoreal micro-texture
- layered but readable costume design
- controlled commercial lighting
- a calm/atmospheric background with fewer competing details
- clean anatomy under garment openings

Avoid:

- generic hyper-detailed AI fantasy illustration
- pseudo-3D/CG rendering unless the style is Cyber Myth
- maximalist “everything ornate” costume design
- every surface covered in gold filigree
- excessive chains, gems, stars, floating shards, sparks and ribbons
- overbuilt background architecture that competes with the face
- dramatic VFX used to hide anatomy or prop defects

### Anime character-first recipe

For a standard character wallpaper, prefer:

```text
character silhouette
→ face/expression
→ one signature prop or gesture
→ simplified costume rhythm
→ one civilization-specific background landmark
→ restrained atmosphere
```

Do not invert the priority into:

```text
city spectacle
→ particles
→ jewelry
→ fabric
→ architecture
→ tiny character
```

### Anime prop simplicity

When a pose includes a weapon:

- prefer one major weapon rather than several competing props
- keep its full silhouette easy to trace
- avoid unnecessary spikes/branches near the grip
- ensure the hand/weapon relationship is visible
- simplify weapon ornament before increasing its complexity
- if the weapon becomes malformed, regenerate the prop/hand region or change the pose; do not accept it because the rest of the image looks good

## Cyber Myth

Use the approved MythCanvas definition: premium **stylized 3D anime / high-end 3D game-cinematic rendering**.

Emphasize:

- dimensional skin/material shading
- bold but mythology-grounded future transformation
- physical signature props, not generic hologram replacements
- civilization architecture transformed into the future
- controlled energy accents

It must remain clearly distinguishable from 2D Anime even if the palette is similar.

## Dark Fantasy

Deprecated from the active production portfolio. Do not generate by default. See `mythcanvas-style-system`.

# Reference strategy

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

## Selected-region / accidental-panel recovery

If the user points to one region of an accidental composite and asks to “pull this one out”:

1. treat the selected region as the **only visual reference**
2. ignore the other panels completely
3. preserve the selected pose, costume, face, lighting and scene direction as requested
4. regenerate/outpaint into one standalone target aspect ratio
5. do not mention the discarded panel concepts in the new image prompt
6. remove panel separators, captions, labels and board framing
7. QA the new standalone image as a fresh deliverable

Do not feed the original multi-panel concept list back into the model. Doing so often recreates the composite.

# Anatomy and physical-intersection QA

This is a hard approval gate.

## Human anatomy

Check:

- both arms originate and bend plausibly
- hands connect naturally to wrists
- each clearly visible normal human hand has **exactly five digits total: one thumb + four fingers**
- no extra sixth finger
- no missing, fused, duplicated or forked fingers in focal areas
- fingers wrap around props in a physically understandable grip
- pelvis → thigh → knee → shin → foot continuity is understandable
- garment slits do not imply duplicate/displaced legs
- no duplicate/missing limbs
- no impossible shoulder/torso twist

For a hand that occupies a focal region, explicitly count the digits before approval. If the count is wrong, reject or targeted-regenerate even when the face and costume are excellent.

When anatomy is difficult to read because of fabric/armor overlap, simplify the costume intersection or change camera angle. Do not approve ambiguity merely because the image is visually impressive.

## Weapons / props

Trace the full prop geometry through the image.

Check:

- the weapon has one coherent uninterrupted geometry
- bow limbs/string/arrow align and connect correctly
- blade, guard, grip and pommel form one plausible object
- weapon does not morph into a different prop halfway through
- hand position matches grip direction
- hand does not pass through handle/guard/string
- prop perspective does not collapse into malformed or duplicated geometry
- no duplicate weapon heads/blades unless scene intentionally contains them
- important prop edges are not hidden by excessive ribbons, particles or jewelry

If a prop creates a collision or deformation, first simplify the weapon and grip or change the holding angle. Do not hide the defect with particles or crop.

# Wallpaper QA

## Mobile

- one complete 9:16 image only
- no panels, dividers, labels, captions or embedded comparison layout
- face below extreme top safe zone
- face/torso immediately readable
- major prop readable without consuming the whole frame
- character normally occupies about 50–75% of image height
- avoid unnecessarily forcing full body; three-quarter/medium shots are valid
- no important content trapped at bottom gesture area

## Desktop

- one complete 16:9 image only
- entire horizontal canvas filled
- no embedded vertical sub-image or white margin
- desktop is independently recomposed unless literal extension was requested
- character remains the primary read and normally occupies at least about one third of the composition
- use width for environmental storytelling without turning the result into environment concept art
- subject placement may shift from mobile to improve composition

# Style differentiation QA

Before approving a derivative, ask:

1. If I crop away the background, can I still tell this style from Canonical?
2. Is the difference more than darker/brighter color grading?
3. Did rendering/material/camera/pose grammar actually change?
4. Does the image look intentionally art-directed rather than generic AI fantasy?
5. For Anime specifically: do large shapes read before micro-detail?

If not, reject and redesign the generation recipe.

# Targeted iteration

When a candidate fails, identify the smallest failing dimension.

Examples:

```text
six-finger hand        → keep identity/style/scene; regenerate hand/grip with five-digit anatomy
weapon malformed       → keep identity/style/scene; simplify weapon and regenerate prop/grip
weapon intersects arm  → keep identity/style/scene; change angle and hand placement
leg anatomy ambiguous  → simplify garment opening and use clearer hip/knee line
character too small    → keep scene/style; move camera closer and increase subject occupancy
style too close        → change rendering grammar/material/camera, not merely palette
Cyber too Anime        → enforce stylized 3D material/skin rendering and stronger tech transformation
AI detail overload     → remove micro-ornament/VFX; preserve large silhouette and only a few accents
boring repeated pose   → keep identity; change action/expression/camera
composite output       → discard as deliverable; re-run each candidate as a separate isolated job
```

When the user marks a specific coordinate/region, treat it as a targeted edit request. Preserve unrelated successful areas whenever the tool supports reference/edit workflows.

Do not rewrite Canonical Design to justify a failed image.

# Batch generation workflow

For N images:

```text
for each recipe:
  resolve exactly one OutputSpec
  compose one standalone-image prompt containing only this recipe
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

# Generation metadata

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

# Failure handling

- composite/multi-panel output when standalone requested → reject; re-run candidates as isolated jobs with only one concept in each prompt
- wrong aspect/orientation → reject; regenerate for exact OutputSpec
- character too small / environment dominates → move camera closer and increase subject prominence
- anatomy/prop collision → targeted pose/angle correction
- extra/missing/fused fingers → targeted hand regeneration; do not approve
- malformed weapon → simplify prop geometry and regenerate grip/weapon region
- identity drift → strengthen/select better identity reference
- style drift → change Style layer and differentiation dimensions
- Anime becomes pseudo-3D/maximalist → return to clean 2D large-shape rendering and lower ornament density
- AI-detail overload → simplify ornament/VFX hierarchy
- missing Character/Style/OutputSpec → fail closed; do not invent replacements

# Completion checklist

- [ ] exactly one standalone deliverable per generation call
- [ ] multi-candidate prompts mention only the current candidate
- [ ] Character and Style are independent inputs
- [ ] OutputSpec is explicit
- [ ] mobile/desktop are generated independently
- [ ] desktop is recomposed rather than mechanically expanded unless explicitly requested
- [ ] character prominence matches the wallpaper brief
- [ ] action/pose is scene-appropriate rather than mechanically reused
- [ ] contextually unnecessary symbols are omitted
- [ ] detail hierarchy is controlled
- [ ] Anime uses clean 2D large-shape language rather than hyper-detailed AI fantasy
- [ ] identity anchors precede refinements
- [ ] anatomy continuity passed
- [ ] every focal visible hand has five digits
- [ ] hand/weapon/shield intersections passed
- [ ] weapon/prop geometry is coherent
- [ ] Style differentiation passed
- [ ] wallpaper orientation/crop passed
- [ ] no text/labels/panel separators unless explicitly requested
- [ ] prompt/model/reference provenance is stored
