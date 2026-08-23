# MythCanvas Creator Productization

This document describes the product-facing character generation workflow implemented on top of the structured Character / Style / OutputSpec system.

## 1. Product model

The Creator must preserve four independent dimensions:

```text
Character identity
× Character Variant
× Rendering Style
× Wallpaper OutputSpec
```

They must not be collapsed into one prompt preset.

- **Character / Canonical Design** answers: who is this?
- **CharacterVariant** answers: which persistent age / costume / form is this?
- **Style** answers: how is the subject rendered?
- **OutputSpec** answers: what device and composition is the image built for?
- **Scene / composition / user refinement** are per-generation directions and do not mutate persistent character identity.

## 2. `/create` product flow

Character generation uses:

1. Choose Character or Realm.
2. Character-only: choose Base / age / costume / form Variant.
3. Choose an independent Style.
4. Choose scene and camera/composition.
5. Choose a production wallpaper target.
6. Generate and keep the structured recipe in history/provenance.

Realm generation skips the Character Variant step.

The V1 wallpaper outputs are intentionally narrow:

| OutputSpec | Device | Ratio | Size |
| --- | --- | --- | --- |
| `mobile-wallpaper` | mobile | 9:16 | 1440×2560 |
| `desktop-wallpaper` | desktop | 16:9 | 2560×1440 |

Mobile composition reserves a quiet lock-screen zone near the top. Desktop composition emphasizes horizontal environmental storytelling and crop-safe edges.

## 3. Launch Character Variants

Migration `0010_character_variants_seed.sql` provides initial product choices for Chang'e, Athena, Freyja, Kaguya-hime, and Anubis.

Each Variant stores:

- `variant_type`: `age | costume | form | composite`
- human-readable description
- structured traits
- explicit identity overrides
- prompt fragment
- Reference Pack IDs

A Variant is a persistent design state. Creating `Athena × Cyber Myth` must not turn `Cyber Myth` into an Athena costume definition; Style remains orthogonal.

## 4. Character Studio

`/admin/characters` is the minimum operations surface for character production.

It supports:

- inspect Canonical Design anchors and symbols
- select a Character
- create age / costume / form / composite Variants
- select Canonical or Variant Reference Pack scope
- upload reference images
- archive reference assets
- archive Variants

The page is protected by the same `ADMIN_TOKEN` pattern used by the content review console.

### Reference asset types

Production Character Reference Packs use these slots:

1. `portrait-front`
2. `portrait-three-quarter`
3. `fullbody-front`
4. `fullbody-three-quarter`
5. `signature-props`
6. `turnaround`
7. `expression-sheet`

PNG, JPEG and WebP are accepted, up to 12 MB per file.

Reference bytes live in R2 under:

```text
references/<character-id>/<canonical-or-variant-id>/<asset-type>-<reference-id>.<ext>
```

D1 stores ownership, slot, provenance and active/archive state.

## 5. Reference resolution

For Character generation, MythCanvas resolves references by slot:

```text
Canonical Reference Pack
        +
Variant Reference Pack
        ↓
Variant slot overrides matching Canonical slot
        ↓
Canonical fills remaining identity slots
        ↓
maximum useful reference set
```

A missing Reference Pack is not a hard failure. The generation pipeline falls back to the structured Canonical Design + Variant prompt layers so development, previews and newly introduced characters remain usable.

Only successfully loaded R2 references are written into `generation_jobs.reference_asset_ids_json`; provenance therefore describes images actually sent to the provider rather than merely intended references.

## 6. GPT Image 2 routing

The OpenAI provider has two paths.

### No Reference Pack

```text
POST /v1/images/generations
```

Used for Realm generation or Character generation before approved reference images exist.

### Reference Pack available

```text
POST /v1/images/edits
```

MythCanvas sends the structured final prompt and the resolved reference images as multipart `image[]` inputs. This makes the Reference Pack operational rather than documentation-only and improves recurring Character identity consistency across Style / scene / device combinations.

The business layer remains provider-neutral: other provider adapters receive equivalent reference data through `ProviderGenerationRequest.references`.

## 7. Prompt precedence

Prompt composition remains deterministic:

```text
purpose
→ Canonical identity
→ Variant delta
→ Civilization Visual DNA
→ Style grammar
→ scene / camera
→ OutputSpec
→ user refinement
→ IP and generation guardrails
```

Reference images supplement this contract; they do not replace it. The prompt explicitly instructs the image model to preserve the approved recurring identity while applying only the requested Variant / Style / scene / output changes.

## 8. Generation provenance

Each generated result keeps the recipe required for reproducibility and review:

- Character / Realm ID
- CharacterVariant ID
- Mythology ID
- Style ID
- OutputSpec ID
- scene / composition
- final prompt
- prompt layers
- provider / model / quality
- actual Reference Asset IDs used
- source generation ID for revisions
- generated image metadata

This enables future identity QA, style QA, regeneration, batch production and model migrations without guessing how an asset was produced.

## 9. Operations workflow

Recommended character onboarding:

```text
Research mythology source
→ define Canonical Design
→ create Canonical Reference Pack
→ review identity
→ create persistent Variants
→ add Variant references only where visual delta needs them
→ combine with independent Styles
→ generate mobile/desktop artwork
→ review/publish
```

Do not create a separate reference pack for every Style. Reference Packs describe identity and persistent Variant changes; Style is deliberately reusable across characters.

## 10. Next production upgrades

The next useful upgrades after this foundation are:

- paired mobile + desktop batch generation from one recipe
- reference image metadata extraction (dimensions/checksum) during upload
- automatic Character identity QA against the approved Reference Pack
- Style QA / drift checks
- Style administration UI for editing production render rules
- Reference Pack completeness score and warnings
- admin generation preview before activating a new Variant
- queue-based bulk production for launch content
