---
name: mythcanvas-character-design
description: Use when defining, researching, evolving, or reviewing MythCanvas mythology characters. Owns Canonical Design, identity anchors, age/costume/form variants, reference packs, and character-consistency QA. Does not own rendering style.
---

# MythCanvas Character Design

## Goal

Treat each mythology character as a persistent visual asset, not as a one-off prompt.

This skill answers **who the character is**. It must stay orthogonal to `mythcanvas-style-system`, which answers **how the character is rendered**.

```text
Character identity × Character variant × Style × Scene × Output spec
```

Never encode a rendering style into the character identity.

## Core model

Every important character has:

1. mythology facts and role
2. Canonical Design
3. immutable identity anchors
4. mutable variant dimensions
5. one canonical reference pack
6. optional persistent variants
7. generation/review history

### Immutable identity anchors

Keep these stable unless the character is intentionally redesigned and versioned:

- role and mythological identity
- face/silhouette language when established by MythCanvas
- signature symbols
- signature objects, weapons, or divine attributes
- core temperament / posture language
- culturally grounded clothing vocabulary
- core palette cues where important to recognition
- prohibited-confusion notes

### Mutable variant dimensions

These may vary without creating a new character:

- age presentation
- costume
- persistent form/transformation
- hairstyle details that do not destroy identity
- pose
- expression
- scene
- lighting
- camera
- composition

Rendering style is **not** a character variant. It belongs to `Style`.

## Variant taxonomy

Use explicit variant types:

```text
age
costume
form
composite
```

Examples:

```text
Athena
├── canonical
├── young
├── mature
├── ceremonial-armor
├── battle-armor
└── mature-ceremonial
```

Do not overwrite `canonical` when a persistent visual state changes. Create a new named variant.

## Canonical Design contract

A character definition should be structured enough for prompt composition and QA.

Recommended shape:

```json
{
  "identityAnchors": [
    "tall poised warrior-goddess silhouette",
    "spear and Aegis shield",
    "owl motif",
    "calm strategic expression"
  ],
  "appearance": {
    "face": ["defined profile", "calm direct gaze"],
    "hair": ["long controlled silhouette"],
    "body": ["athletic, elegant, adult proportions"]
  },
  "costumeLanguage": ["classical Greek armor", "ivory textile", "bronze detailing"],
  "paletteCues": ["ivory", "bronze gold", "deep olive"],
  "symbols": ["spear", "Aegis", "owl"],
  "temperament": ["rational", "majestic", "disciplined"],
  "avoid": ["modern franchise-specific costume", "generic fantasy princess silhouette"]
}
```

Prefer concrete visual facts over literary adjectives.

## Reference Pack

Before producing large batches for a major recurring character, establish a Canonical Reference Pack.

Recommended assets:

```text
portrait-front
portrait-three-quarter
fullbody-front
fullbody-three-quarter
turnaround
expression-sheet
signature-props
```

Reference assets belong to the character/variant, never to a style.

A style moodboard belongs to the Style system and must not be stored as character identity.

## Reference image policy

When a generation model accepts reference images, use a small high-signal set rather than many loosely related images.

For a character wallpaper generation, prefer:

1. canonical portrait or full-body anchor
2. selected variant reference, if different from canonical
3. optional signature-prop reference

Do not use modern commercial adaptations as identity references.

## Mythology research rule

When adding a character:

1. establish the public-domain / mythological source identity
2. list historically/mythologically grounded symbols
3. separate source facts from MythCanvas original design choices
4. reject visual cues copied from modern games, anime, films, cards, or licensed illustrations

The Character record should make that boundary auditable.

## Character creation workflow

```text
Research
→ Character Design Brief
→ Canonical Design
→ Canonical Reference Pack
→ Identity QA
→ Approve canonical version
→ Define age/costume/form variants as needed
→ Generate artworks through the generation skill
```

Do not start a large wallpaper batch before the Canonical Design is stable.

## Character QA

Review generated art against the selected character + variant, independently from style quality.

### Identity checks

- Is the character immediately recognizable from MythCanvas anchors?
- Are signature symbols/props present when the composition requires them?
- Did face, hair silhouette, body proportions, or temperament drift?
- Did the model replace culturally grounded clothing language with generic fantasy clothing?
- Did a modern copyrighted adaptation leak into the design?

### Variant checks

- Is the requested age presentation clear but still the same character?
- Is the requested costume/form actually present?
- Does the variant preserve invariant anchors?
- Has a temporary scene effect accidentally become a permanent identity change?

## Age handling

Age is a visual presentation parameter, not permission to change identity arbitrarily.

For named mythology characters, use broad art-direction bands rather than exact biological ages unless product requirements need exactness:

```text
youthful-adult
canonical-adult
mature-adult
ageless-divine
```

Avoid making sexualization depend on youthfulness. Keep all adult-coded romantic/glamorous variants clearly adult.

## Costume handling

Costume variants should describe:

- silhouette
- garment layers
- armor/textile balance
- materials
- ornament density
- exposed/covered areas where relevant to design consistency
- signature symbols that must survive the costume change

Do not encode `anime`, `cinematic`, `cyber`, etc. in costume names.

Good:

```text
ceremonial-robe
battle-armor
moon-palace-formal
winter-travel
```

Bad:

```text
anime-armor
cinematic-dress
```

## Form / transformation handling

Use a new variant for persistent transformations such as:

- divine awakening
- beast/human hybrid state
- battle form
- wounded persistent state
- coronation state

Document both:

- what changes
- what must remain recognizable

## Storage ownership

Structured character data belongs in D1. Reference image bytes belong in R2.

Recommended relationship:

```text
characters
  1 ── * character_variants
  1 ── * reference_assets
character_variants
  1 ── * reference_assets
```

Do not store large image blobs in D1.

## Coordination with other skills

Read/use:

- `mythcanvas-content-model` for domain/IP rules
- `mythcanvas-style-system` for rendering style
- `mythcanvas-character-generation` for prompt composition and GPT Image 2 execution
- `mythcanvas-product-ux` only when the generated asset is being integrated into website UI

## Completion checklist

- [ ] mythology identity is grounded
- [ ] Canonical Design is structured
- [ ] immutable anchors are explicit
- [ ] mutable attributes are separated
- [ ] age/costume/form variants have stable IDs
- [ ] Style is not embedded in character variants
- [ ] reference assets are versioned
- [ ] modern adaptation copying is excluded
- [ ] Character QA criteria are defined
