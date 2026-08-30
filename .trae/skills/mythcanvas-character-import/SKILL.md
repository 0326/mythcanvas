---
name: "mythcanvas-character-import"
description: "One-command character artwork import: rename, validate, upload to R2, publish to D1. Invoke when user says '导入/上传/import/upload <character>' for character images."
---

# MythCanvas Character Artwork Import

One-command script that handles the entire import flow: auto-rename → validate → upload R2 → publish D1 → verify.

## When to invoke

Trigger when the user says any of:

- `导入 / 上传 <character>` — import character images
- `import / upload <character>` — same in English
- `把 <character> 图片导入项目` — natural-language variant
- `导入全部角色` — batch import all staged characters

Do NOT invoke for generation, QA review, or website editing tasks.

## How to use

Run ONE command. The script handles everything end-to-end.

### Files already named correctly (`<style>_<m|pc>_<NN>.<ext>`)

```bash
node scripts/import-character.mjs <slug> --remote
```

### Files with non-conforming names (e.g. ChatGPT timestamps)

First, check dimensions and ask the user which styles the images belong to. Then run with `--rename`:

```bash
node scripts/import-character.mjs <slug> --rename "canonical:2,anime:2" --remote
```

Format: `<style>:<image-count>` pairs, comma-separated. Files are sorted by name (timestamp order), grouped by count, then auto-renamed by orientation (portrait→`_m_NN`, landscape→`_pc_NN`).

### Batch import all staged characters

```bash
node scripts/import-character.mjs --all --remote
```

### Local mode (offline development)

```bash
node scripts/import-character.mjs <slug> --local
```

## What the script does

1. **Scan** `imports/characters/<slug>/` for image files
2. **Auto-rename** if `--rename` provided (reads pixel dimensions, classifies portrait/landscape)
3. **Validate** via importer (slug exists in D1, style active, dimensions match device, no duplicates)
4. **Upload to R2** with `public, max-age=31536000, immutable` cache
5. **Write D1** (artworks approved+published, artwork_characters links, portrait promotion, reference_assets)
6. **Verify D1** (artwork count, portrait, reference asset, style breakdown)
7. **Print summary** (style breakdown, primary portrait, reference asset status)

## Decision flow for the agent

```
User says "导入 <character>"
  ↓
Glob imports/characters/<slug>/*.{png,jpg,jpeg,webp}
  ↓
All files match <style>_<m|pc>_<NN>.<ext>?
  ├─ YES → run: node scripts/import-character.mjs <slug> --remote
  └─ NO  → read dimensions with sips, ask user which styles
           then run: node scripts/import-character.mjs <slug> --rename "canonical:N,anime:N" --remote
  ↓
Script outputs complete summary → relay to user
```

## Common issues

| Issue | Fix |
|-------|-----|
| `Character slug not found in D1` | Create character first via migration |
| `Wrangler auth error` | User runs `npx wrangler login`, then retry |
| `--rename counts don't match` | Check actual file count in directory |

## Version rule

Once published, never replace a filename with different pixels. Use next sequence:
```
canonical_m_01.png  ← old (cached, immutable)
canonical_m_02.png  ← new replacement
```
Importer auto-selects highest `canonical_m_NN` as primary portrait.
