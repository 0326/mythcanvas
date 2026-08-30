---
name: "mythcanvas-character-import"
description: "One-command character artwork import: rename, validate, upload to R2, publish to D1. Invoke when user says '导入/上传/import/upload <character>' for character images."
---

# MythCanvas Character Artwork Import

One-command workflow to import staged character images into R2 + D1. This skill automates the repetitive import cycle so the user only needs to say "导入 <character>" or "upload <character>".

## When to invoke

Trigger when the user says any of:

- `导入 / 上传 <character>` — import character images
- `import / upload <character>` — same in English
- `把 <character> 图片导入项目` — natural-language variant
- `导入全部角色` — batch import all staged characters

Do NOT invoke for generation, QA review, or website editing tasks. Those belong to `mythcanvas-character-production`, `mythcanvas-character-generation`, or `mythcanvas-product-ux`.

## Prerequisites

This skill is a fast-path wrapper around the existing `mythcanvas-character-production` skill and `scripts/import-character-artworks.mjs`. Before using, ensure:

1. Images are staged under `imports/characters/<character-slug>/`
2. Filenames follow `<style>_<device>_<NN>.<ext>` convention
3. The character slug exists in D1 (`characters` table)
4. The style is in the active production portfolio: `canonical`, `sacred`, `cinematic`, `anime`, `cyber-myth`
5. Wrangler is logged in to Cloudflare for remote imports

## Standard workflow

### Step 1 — Discover & analyze images

```
Glob: imports/characters/<character-slug>/*.{png,jpg,jpeg,webp}
```

For each image, read pixel dimensions using `sips -g pixelWidth -g pixelHeight`.

Classification rules:
- Portrait (height > width) → device `m` (mobile-wallpaper)
- Landscape (width > height) → device `pc` (desktop-wallpaper)

### Step 2 — Rename if needed

If filenames do not match `<style>_<device>_<NN>.<ext>`, ask the user which style each image pair belongs to, then rename.

Filename grammar:
```
^(?<style>[a-z0-9]+(?:-[a-z0-9]+)*)_(?<device>pc|m)_(?<sequence>[0-9]{2})\.(?<ext>png|jpg|jpeg|webp)$
```

If filenames already conform, skip to Step 3.

### Step 3 — Dry-run validation

```bash
node scripts/import-character-artworks.mjs <character-slug> --dry-run --local
```

This validates:
- Character slug resolves in D1
- Style is in active production portfolio
- Image orientation matches device (`m` = portrait, `pc` = landscape)
- No duplicate style/device/sequence
- Image bytes are parseable

If dry-run fails, fix the issue and re-run. Do NOT proceed to upload.

### Step 4 — Confirm import environment

Ask the user: local (`--local`) or remote (`--remote`)?

- **local**: writes to local Wrangler D1/R2 state for offline dev
- **remote**: uploads to Cloudflare production R2 + D1

Default recommendation: `--remote` for production publishing.

If remote fails with auth error, ask user to run `npx wrangler login` first, then retry.

### Step 5 — Execute import

```bash
node scripts/import-character-artworks.mjs <character-slug> --remote
```

The importer automatically:
1. Uploads each image to R2 with `public, max-age=31536000, immutable` cache
2. Creates `artworks` records (approved + published)
3. Creates `artwork_characters` links
4. Promotes highest-sequence `canonical_m_NN` to character portrait
5. Creates/updates `reference_assets` (portrait-three-quarter, active)

### Step 6 — Verify D1 results

Query remote D1 to confirm:

```sql
-- Artwork count
SELECT COUNT(*) FROM artworks WHERE id LIKE 'art-<slug>%';

-- Character portrait updated
SELECT name, portrait_src, portrait_width, portrait_height FROM characters WHERE slug='<slug>';

-- Reference asset created
SELECT id, asset_type, asset_key, status FROM reference_assets WHERE owner_id='character-<slug>';
```

### Step 7 — Summary

Report to the user:
- Number of images imported
- Style breakdown (canonical X, anime Y, ...)
- Primary portrait filename promoted
- R2 paths and website URLs
- Confirmation that website auto-updates without code changes

## Batch import

For `导入全部角色`:

```bash
node scripts/import-character-artworks.mjs --all --remote
```

Process all character folders under `imports/characters/`. Use the same verify step for each.

## Common issues

| Issue | Fix |
|-------|-----|
| `Character slug not found in D1` | Character doesn't exist; create it first via migration |
| `Style not found/active in D1` | Style not in portfolio; check `styles` table |
| `named mobile but is not portrait` | Image dimensions don't match filename device; rename or regenerate |
| `Wrangler auth error` | Run `npx wrangler login`, then retry |
| `Cloudflare Error 1031` | Remote preview config issue; use `--local` as fallback |

## Version rule

Once a filename is published, never replace it with different pixels. Use the next sequence number:

```
canonical_m_01.png  ← old published image (cached, immutable)
canonical_m_02.png  ← new replacement image
```

The importer auto-selects the highest `canonical_m_NN` sequence as primary portrait.

## File structure reference

```
imports/characters/<character-slug>/
├── canonical_m_01.png   ← mobile portrait
├── canonical_m_02.png   ← newer version (becomes primary)
├── canonical_pc_01.png  ← desktop wallpaper
├── anime_m_01.png       ← style derivative mobile
├── anime_pc_01.png      ← style derivative desktop
└── ...
```

R2 path derivation:
- Canonical: `characters/<slug>/canonical/{mobile,desktop}-wallpaper/<filename>`
- Style: `characters/<slug>/styles/<style>/{mobile,desktop}-wallpaper/<filename>`

Website URL: `/media/<r2-key>`
