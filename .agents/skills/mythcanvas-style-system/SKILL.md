---
name: mythcanvas-style-system
description: Use when defining, evolving, comparing, or reviewing MythCanvas artwork rendering styles. Owns style visual grammar, prompt fragments, render rules, avoid rules, and style QA. Must remain orthogonal to character identity, age, costume, form, mythology, and app Light/Dark Theme.
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
Character       = who
CharacterVariant= persistent age/costume/form state
Mythology       = cultural identity / Visual DNA
Style           = how it is rendered
Theme           = website Light/Dark presentation
OutputSpec      = device/aspect/resolution composition target
```

Bad:

```text
athena-cyber-theme
chinese-anime-character
```

Preferred:

```text
characterId: athena
variantId: ceremonial-armor
styleId: cyber-myth
mythologyId: greek
```

## Style profile contract

Every production style should define structured fields:

```json
{
  "id": "sacred-cinematic",
  "name": "Sacred Cinematic",
  "category": "cinematic",
  "intent": "Monumental, divine, premium mythology key art",
  "renderRules": [
    "cinematic depth and realistic material response",
    "controlled divine volumetric light",
    "clear focal hierarchy",
    "large-scale environment readable behind the subject"
  ],
  "paletteBehavior": [
    "respect civilization palette first",
    "use highlights rather than recoloring identity"
  ],
  "lighting": ["directional sacred light", "soft atmospheric haze"],
  "camera": ["heroic medium/full shot", "environmental establishing shot"],
  "surface": ["refined material detail", "no plastic AI sheen"],
  "avoid": ["generic game splash UI", "overdone bloom", "random particles"],
  "promptTemplate": "Render with premium cinematic fantasy realism, controlled sacred light, refined materials, atmospheric depth, and a strong readable silhouette."
}
```

The prompt template should be concise natural language, not a comma dump of model keywords.

## Required style families

Initial MythCanvas system should support at least:

- `canonical` — neutral MythCanvas canonical interpretation
- `cinematic` — premium film/concept-art rendering
- `sacred` — luminous ceremonial/divine rendering
- `anime` — refined anime illustration
- `dark-fantasy` — solemn mysterious fantasy, not horror/gore
- `cyber-myth` — futuristic materials/light while retaining mythology identity
- `ink` — ink/brush interpretation
- `oil-painting` — painterly traditional medium
- `statue` — sculptural/material study
- `surreal` — dreamlike but identity-preserving interpretation

Styles may expand, but each new style must earn a distinct visual grammar.

## Civilization compatibility

A style never replaces Civilization Visual DNA.

Examples:

```text
Chinese × Cyber Myth
Greek × Anime
Norse × Ink
Egyptian × Sacred
```

All are valid if the civilization identity remains intact.

Rule:

> Culture determines what the world/character is; Style determines how it is depicted.

## Style prompt construction

The generation composer should use style data in four layers:

1. intent
2. render rules
3. lighting/material/camera behavior
4. avoid rules

Do not let Style prompt fragments introduce:

- named characters
- character age
- character costume variants
- specific mythologies
- fixed scenes
- output resolution

Those belong to other dimensions.

## GPT Image 2 guidance

For GPT Image 2, prefer direct descriptive instructions over pseudo-negative-prompt syntax or model-specific tag spam.

Good:

```text
Render this as a refined anime illustration with a clean silhouette, disciplined line work, expressive but anatomically coherent facial design, restrained gradients, and a polished key-visual finish. Preserve all supplied character identity anchors and cultural materials.
```

Avoid:

```text
masterpiece, best quality, 8k, trending, ultra detailed, no bad hands, no ugly, anime:1.4
```

State constraints explicitly in normal language.

## Style orthogonality test

Before accepting a Style definition, substitute three unrelated subjects:

```text
Athena
Chang'e
Olympus
```

If the Style definition still makes sense without changing subject identity, it is probably orthogonal.

If it only works because it embeds one character/civilization/costume, split those concerns out.

## Style variants vs style presets

Avoid uncontrolled nested style variants.

Prefer one stable `Style` plus generation-level controls such as:

- mood
- lighting intensity
- color temperature
- detail level

Create a new Style only when visual grammar changes materially.

## Style QA

Review independently from Character QA.

Check:

- Does the rendering clearly match the intended Style?
- Did the Style overwrite Character identity?
- Did it overwrite Civilization Visual DNA?
- Are material, line, light, and camera rules coherent?
- Does it look like a deliberate art direction rather than generic AI art?
- Does it preserve wallpaper readability?

## Style reference assets

Optional reference/moodboard images may be attached to a Style.

They must be:

- original MythCanvas assets, licensed references, or safe abstract studies
- clearly marked as style-only references
- not modern copyrighted character designs used as shortcuts

Style references belong to `reference_assets(owner_type='style')`.

## Storage

Structured style rules belong in D1.

Recommended fields:

```text
styles
├── id / slug / name
├── category
├── prompt_hint              # legacy short hint
├── prompt_template          # production natural-language fragment
├── render_rules_json
├── avoid_json
└── status
```

Do not store style logic only inside TypeScript maps once production content is editable.

## Coordination

Use with:

- `mythcanvas-character-design` for Character/Variant identity
- `mythcanvas-character-generation` for final prompt composition and provider execution
- `mythcanvas-content-model` for Civilization Visual DNA and IP boundaries

## Completion checklist

- [ ] style has a unique rendering grammar
- [ ] prompt template is concise natural language
- [ ] no character identity is embedded
- [ ] no age/costume/form is embedded
- [ ] no app Light/Dark Theme is embedded
- [ ] civilization remains a separate input
- [ ] render rules and avoid rules are structured
- [ ] cross-subject orthogonality test passes
- [ ] style QA criteria are explicit
