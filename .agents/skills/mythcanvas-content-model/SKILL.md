---
name: mythcanvas-content-model
description: Use for MythCanvas domain schemas, mythology/world/character/artwork relationships, Canonical Design, Civilization Visual DNA, Style Variants, seed data, and content/IP metadata.
---

# MythCanvas Content Model Skill

## Core graph

Model MythCanvas as entities and relationships, not as a flat wallpaper list.

```text
Mythology
  → Realm
  → Character
  → Scene
  → Artwork
```

Artwork can relate to multiple entities; do not force every artwork into one character.

## Required vocabulary

- `Mythology`: mythology/civilization system
- `Realm`: named mythic world/domain
- `Character`: named god/hero/spirit/figure
- `Scene`: reusable visual place/event concept
- `Artwork`: visual work plus metadata
- `Style`: artwork rendering style
- `VisualDNA`: civilization identity constraints
- `CanonicalDesign`: stable identity anchors for Character/Realm
- `Theme`: application Light/Dark only

## Never collapse these fields

Bad:

```ts
theme: 'greek-dark-anime'
```

Preferred:

```ts
mythologyId: 'greek'
styleId: 'anime'
moodIds: ['dark']
```

Application theme belongs to user/UI state, not artwork metadata.

## Canonical Design

For important Character entities store identity anchors such as:

- symbols
- signature objects/weapons
- key silhouette/clothing cues
- divine role/power cues
- temperament/visual posture
- prohibited confusion notes where useful

For Realm entities store:

- landmarks
- spatial composition
- signature architecture/materials
- atmosphere/lighting motifs
- civilization symbols

These fields should be available to AI prompt orchestration later.

## Civilization Visual DNA

A mythology should contain structured cultural cues, for example:

```ts
type VisualDNA = {
  motifs: string[];
  materials: string[];
  architecture: string[];
  landscape: string[];
  paletteHints: string[];
  atmosphere: string[];
  avoid?: string[];
};
```

Visual DNA is guidance for artwork/content presentation. It is not a full-site CSS theme.

## Artwork metadata

At minimum support:

```ts
type Artwork = {
  id: string;
  slug: string;
  type: 'character' | 'world' | 'scene' | 'creature' | 'architecture';
  mythologyId: string;
  worldId?: string;
  characterIds?: string[];
  sceneId?: string;
  styleId: string;
  moodIds: string[];
  image: {
    src: string;
    width: number;
    height: number;
    alt: string;
  };
  license: {
    sourceType: 'original' | 'ai' | 'public-domain' | 'licensed' | 'ugc';
    creator?: string;
    sourceUrl?: string;
    licenseName?: string;
  };
  promptMeta?: Record<string, unknown>;
  reviewStatus: 'draft' | 'approved' | 'hidden';
};
```

## Content quality

Avoid filler encyclopedic copy. Entity summaries should be concise, visual and factual enough to help SEO/GEO and users understand relationships.

A Character page should answer:

- who is this?
- which mythology?
- which Realm?
- symbols / role?
- what makes the MythCanvas interpretation identifiable?

A Realm page should answer:

- what world is this?
- which mythology?
- important landmarks?
- important Characters?
- what visual identity is stable?

## IP/content boundary

Use mythology, folklore and public-domain literary archetypes as source material where appropriate. Do not copy specific protected designs from modern anime, games, films or commercial illustrations.

Do not seed data with:

- screenshots
- official game card art
- copyrighted anime character sheets
- unverified wallpaper reposts

Prefer original/AI-generated MythCanvas visual assets, public-domain sources with metadata, or explicit licenses.

## Seed data phase

For MVP, typed TypeScript/JSON or Content Collections are acceptable. Keep IDs/slugs stable so migration to D1 does not require URL changes.

## Validation

Before adding content:

- [ ] slug is stable and human-readable
- [ ] mythology relationship exists
- [ ] Realm/Character links are valid
- [ ] Visual DNA / Canonical Design is separated from Style
- [ ] image width/height/alt are present
- [ ] license/source metadata is present
- [ ] modern IP-specific design was not copied
