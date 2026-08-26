---
name: mythcanvas-style-system
description: Use when defining, evolving, comparing, or reviewing MythCanvas artwork rendering styles. Owns style visual grammar, prompt fragments, render rules, avoid rules, differentiation gates, and style QA. Must remain orthogonal to character identity, age, costume, form, mythology, and app Light/Dark Theme.
---

# MythCanvas Style System

## Goal

A `Style` answers **how to render** any MythCanvas subject.

It must be reusable across Character, Realm, Scene, Creature, and Architecture content without redefining who/what the subject is.

```text
Subject identity × Variant × Style × Scene × Output spec
```

## Non-negotiable separation

Never collapse these dimensions:

```text
Character        = who
CharacterVariant = persistent age/costume/form state
Mythology        = cultural identity / Visual DNA
Style            = rendering language
Scene            = what is happening and where
Theme            = website Light/Dark presentation
OutputSpec       = device/aspect/resolution composition target
```

A style may influence material treatment, lighting, camera language and surface design, but must not silently replace the character's canonical identity.

## Active production styles

The current validated MythCanvas character portfolio is deliberately small:

- `canonical` — neutral, culturally grounded canonical interpretation
- `sacred` — luminous ceremonial/divine rendering
- `cinematic` — dynamic premium cinematic fantasy realism
- `anime` — premium 2D game key-art / commercial character illustration
- `cyber-myth` — premium stylized 3D anime rendering with bold mythology-first futuristic transformation

### Deprecated: `dark-fantasy`

Do **not** use `dark-fantasy` in the default production matrix.

Athena pilot tests showed that merely darkening the palette, adding ruins, weathering materials and reducing exposure produced images too close to canonical/cinematic fantasy. The style did not earn enough independent visual grammar and therefore fails the differentiation gate.

If an existing database still contains `dark-fantasy`, treat it as legacy/deprecated for production until it is intentionally redesigned and re-approved.

Future styles such as `ink`, `oil-painting`, `statue`, or `surreal` are candidates, not automatically production-ready. Each must pass the differentiation gate below before entering the portfolio.

## Style profile contract

Every production style should define structured fields:

```json
{
  "id": "sacred",
  "name": "Sacred",
  "category": "ceremonial",
  "intent": "Monumental, divine, premium mythology key art",
  "renderRules": [
    "controlled sacred volumetric light",
    "clear focal hierarchy",
    "refined culturally grounded materials"
  ],
  "paletteBehavior": [
    "respect civilization palette first",
    "use highlights rather than recoloring identity"
  ],
  "lighting": ["directional sacred light", "soft atmospheric haze"],
  "camera": ["heroic medium or three-quarter shot"],
  "surface": ["clean material hierarchy", "no plastic AI sheen"],
  "avoid": ["generic game UI", "overdone bloom", "random particles"],
  "promptTemplate": "Render with luminous ceremonial divinity, controlled sacred light, refined materials, calm monumentality, and a strong readable silhouette."
}
```

Prompt templates should be concise natural language, not model-keyword dumps.

## Differentiation gate

A new Style is valid only when it changes **visual grammar**, not merely palette or background.

Before approval, compare it against the closest existing style. It should differ materially in at least three of these dimensions:

1. rendering medium / surface language
2. lighting behavior
3. material treatment
4. camera / composition grammar
5. motion / pose language encouraged by the style
6. environment treatment
7. costume-surface transformation allowed by the style
8. edge/line/render treatment

Changing only these is **not sufficient**:

- darker or brighter exposure
- different color grade
- adding ruins, fog, sparks or particles
- swapping day/night
- increasing detail density

### Quick tests

**Crop test:** crop away most of the background. The style should still be recognizable from the character rendering/material/lighting.

**Grayscale test:** if removing color makes two styles nearly identical, differentiation may be too weak.

**Cross-subject test:** apply the style definition to Athena, Chang'e and Olympus. It should remain meaningful without embedding one subject's identity.

If a style fails these tests, merge it into an existing style or keep it experimental.

## Avoid generic AI detail accumulation

High completion does not mean maximum micro-detail.

Prefer a readable hierarchy:

```text
large forms   = silhouette, armor masses, garment masses, environment blocks
medium forms  = garment layers, major ornaments, shield/spear construction
small forms   = selected engravings, seams, jewelry, controlled highlights
```

Rules:

- do not cover every surface with filigree, chains, gemstones, glowing runes or scratches
- do not use micro-detail to compensate for weak art direction
- repeat motifs deliberately; avoid random decorative vocabulary
- preserve quiet material areas so important details have contrast
- commercial polish should come from design hierarchy, material separation and lighting, not ornamental noise

## Canonical style

Intent: define the stable MythCanvas identity without a strong external rendering gimmick.

Use:

- culturally grounded architecture/materials
- clean premium realism
- restrained ornament
- readable signature props
- calm identity-first composition

Avoid:

- generic fantasy redesign
- excessive VFX
- style-specific technology
- dramatic changes to canonical costume structure

## Sacred style

Sacred should differ from canonical primarily through **ceremonial lighting, ritual atmosphere and dignified presentation**, not a new character identity.

Prefer:

- interior temple / sanctuary environments when appropriate
- strong but controlled divine light
- calmer or more ceremonial posture
- medium / three-quarter framing when full body adds no value
- polished rather than battle-worn materials

Avoid:

- standing in the exact canonical pose with only stronger bloom
- overexposed white halos
- generic angel imagery
- unnecessary combat clutter

## Cinematic style

Cinematic should introduce **action, camera storytelling and environmental drama**.

It is not simply canonical with more contrast.

Prefer:

- dynamic action chosen from the character's actual mythology/role
- strong foreground/midground/background depth
- deliberate motion in cloth, dust, debris or weather
- clear weapon trajectories and readable body mechanics
- scene-specific symbol selection: not every canonical symbol must appear in every action shot

For a war deity, battle action may omit a companion animal if it weakens the moment. Canonical identity anchors are a priority system, not a mandatory checklist of visible objects.

Avoid:

- repeated standing poses across all styles
- weapon tips aimed directly at camera unless perspective is controlled
- impossible weapon/body intersections
- action added only through particles while the body remains static

## Anime style — current approved direction

`anime` means **high-end 2D game key art / premium commercial character illustration**, not generic anime and not photoreal CGI.

Target qualities:

- clear 2D illustration / painterly line-and-shape language
- refined facial design with adult proportions
- layered costume construction with readable material separation
- strong character-selling pose and silhouette
- commercial key-art lighting
- high completion with controlled detail density
- appropriate for character splash art, setting sheets and promotional key visuals

The style may increase costume layering and presentation value, but must preserve the character's mythology identity and signature props.

Avoid:

- generic school-anime styling
- chibi or oversized childlike eyes unless explicitly requested
- hyper-dense filigree everywhere
- hundreds of chains/gems/ribbons without hierarchy
- anatomy hidden by excessive cloth intersections
- fake 3D photoreal rendering
- copying a recognizable modern game franchise's exact design language

### Anime anatomy QA

Commercial 2D key art must remain structurally believable:

- trace both legs from pelvis to feet mentally before approval
- verify visible thigh/knee/shin continuity through garment openings
- verify hands actually grip the weapon
- avoid fabric slits that imply duplicated or displaced limbs
- simplify garment crossings when anatomy becomes ambiguous

## Cyber Myth style — current approved direction

`cyber-myth` must be **visually distinct from Anime**.

The current validated direction is:

> premium stylized **3D anime / high-end 3D game cinematic character rendering** fused with bold mythology-first futuristic design.

### Rendering language

- clearly dimensional 3D character and material response
- realistic/stylized skin shading rather than flat 2D anime rendering
- physically legible metal, ceramic, textile and emissive surfaces
- commercial game-cinematic lighting
- controlled depth-of-field and volumetric atmosphere

### Transformation budget

Cyber Myth may transform 25–45% of surface/material language while preserving canonical identity anchors.

Good transformations:

- bronze → bronze + obsidian/ceramic composite
- engraved shield → physical Gorgoneion shield with restrained luminous circuitry
- spear → physical spear with integrated energy edge/core
- Greek columns / meander geometry → monumental future-Olympus architecture
- divine strategy → holographic tactical geometry / oracle interfaces

The future layer should be bold enough to read immediately; do not merely add a few neon seams to canonical armor.

### Palette

Prefer:

```text
ivory / warm skin
+ ancient gold / bronze
+ obsidian / dark ceramic
+ controlled electric blue / violet emissive accents
```

### Character appeal

For clearly adult characters, Cyber Myth may use a slightly more glamorous or sensual presentation through:

- confident posture
- stronger waist/shoulder silhouette
- elegant fitted armor sections
- controlled leg/shoulder exposure
- assertive or alluring facial expression

Keep it tasteful and functional. Do not rely on extreme exposure or sexualized anatomy distortion.

### Avoid

- generic neon-city cyberpunk
- 2D anime rendering that makes it indistinguishable from `anime`
- random cables, mechanical wings or guns without mythology logic
- transparent hologram shields replacing the canonical physical shield
- HUD covering the face/body
- excessive floating UI panels
- every surface glowing
- technology replacing Greek cultural motifs

## Civilization compatibility

A Style never replaces Civilization Visual DNA.

Examples:

```text
Chinese × Cyber Myth
Greek × Anime
Egyptian × Sacred
```

Rule:

> Culture determines what the world/character is; Style determines how it is depicted.

## GPT Image guidance

Prefer direct descriptive instructions over diffusion tag syntax.

Good:

```text
Render as premium 2D commercial game key art with clear layered costume materials, disciplined detail hierarchy, adult facial proportions, and strong character-selling lighting. Preserve the supplied character identity and cultural design.
```

Avoid:

```text
masterpiece, best quality, 8k, ultra detailed, anime:1.4, no bad hands
```

State constraints explicitly in normal language.

## Style references

Optional style references/moodboards may be attached to a Style.

They must be:

- original MythCanvas assets, licensed references, or safe abstract studies
- clearly marked as style-only references
- never used to copy a modern copyrighted character identity

A user-provided image may be used to communicate **rendering qualities** such as line language, material hierarchy, lighting, framing and completion level. Extract those properties; do not reproduce the depicted character or franchise-specific design.

Style references belong to `reference_assets(owner_type='style')`.

## Style QA

Review Style independently from Character QA.

Check:

- is the selected rendering grammar obvious without relying only on palette/background?
- is it clearly differentiated from the closest active style?
- did Style preserve Character identity and Civilization Visual DNA?
- are materials, line/edge treatment, lighting and camera coherent?
- is detail density intentional rather than generically "AI ornate"?
- does the result look art-directed rather than prompt-accumulated?
- does it preserve wallpaper readability?

If differentiation fails, do **not** approve because the image is attractive. Redesign the style or use the closest existing style instead.

## Storage

Structured style rules belong in D1.

Recommended fields:

```text
styles
├── id / slug / name
├── category
├── prompt_hint
├── prompt_template
├── render_rules_json
├── avoid_json
└── status
```

Production docs may deprecate a legacy style before the database row is removed. Generation workflows should follow the active production portfolio defined by this Skill.

## Coordination

Use with:

- `mythcanvas-character-design` for Character/Variant identity
- `mythcanvas-character-generation` for final prompt composition and provider execution
- `mythcanvas-character-production` for production sequencing/approval
- `mythcanvas-content-model` for Civilization Visual DNA and IP boundaries

## Completion checklist

- [ ] style has a unique rendering grammar
- [ ] differentiation gate passes against the nearest active style
- [ ] prompt template is concise natural language
- [ ] no character identity is embedded
- [ ] no age/costume/form is embedded
- [ ] no app Light/Dark Theme is embedded
- [ ] civilization remains a separate input
- [ ] detail density has clear hierarchy
- [ ] render/avoid rules are structured
- [ ] cross-subject test passes
- [ ] style QA criteria are explicit
