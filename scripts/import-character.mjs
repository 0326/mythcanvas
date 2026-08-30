#!/usr/bin/env node

/**
 * MythCanvas Character Artwork One-Command Import
 *
 * Combines: auto-rename → validate → upload R2 → publish D1 → verify
 *
 * Usage:
 *   node scripts/import-character.mjs <slug> [--remote|--local]
 *   node scripts/import-character.mjs <slug> --rename "canonical:2,anime:2" [--remote|--local]
 *   node scripts/import-character.mjs --all [--remote|--local]
 *
 * --rename "<style>:<count>,<style>:<count>,..."
 *   Auto-renames non-conforming files. Files are sorted by name (timestamp order),
 *   grouped by count, then renamed by orientation: portrait→m_NN, landscape→pc_NN.
 *
 * Default mode is --remote. Use --local for offline development.
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const IMPORTER = path.resolve('scripts/import-character-artworks.mjs');
const IMPORT_ROOT = path.resolve('imports/characters');
const FILE_RE = /^(?<style>[a-z0-9]+(?:-[a-z0-9]+)*)_(?<device>pc|m)_(?<sequence>[0-9]{2})\.(?<ext>png|jpg|jpeg|webp)$/i;
const IMAGE_RE = /\.(png|jpe?g|webp)$/i;
const DB_NAME = 'mythcanvas-db';

// ─── Parse args ────────────────────────────────────────────
const args = process.argv.slice(2);
const options = { slugs: [], all: false, remote: true, rename: null };

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--all') options.all = true;
  else if (arg === '--local') options.remote = false;
  else if (arg === '--remote') options.remote = true;
  else if (arg === '--rename') options.rename = args[++i];
  else if (arg === '--help' || arg === '-h') { printHelp(); process.exit(0); }
  else if (!arg.startsWith('-')) options.slugs.push(arg.toLowerCase());
}

if (options.all && options.slugs.length) {
  console.error('Use either explicit slugs or --all, not both.');
  process.exit(1);
}

const modeFlag = options.remote ? '--remote' : '--local';
const modeLabel = options.remote ? 'remote' : 'local';

// ─── Main ──────────────────────────────────────────────────
main().catch((err) => {
  console.error(`\n✘ ${err.message}`);
  process.exit(1);
});

async function main() {
  const slugs = resolveSlugs();
  if (!slugs.length) {
    console.error('No character folders found under imports/characters/');
    process.exit(1);
  }

  let totalImported = 0;
  let totalRenamed = 0;

  for (const slug of slugs) {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`  Character: ${slug}  [${modeLabel}]`);
    console.log(`${'═'.repeat(60)}`);

    // Step 1: Check & rename files
    const renameResult = checkAndRename(slug);
    if (renameResult.needsAttention) {
      console.log(`\n⚠  Non-conforming image files found in imports/characters/${slug}/:`);
      for (const f of renameResult.nonConforming) {
        console.log(`   ${f.name}  (${f.width}x${f.height} → ${f.orientation})`);
      }
      if (!options.rename) {
        console.log(`\n   Options:`);
        console.log(`   1. Rename manually to <style>_<m|pc>_<NN>.<ext>`);
        console.log(`   2. Re-run with --rename "canonical:2,anime:2"`);
        console.log(`      (format: <style>:<image-count> for each style group)`);
        continue;
      }
    }

    if (renameResult.renamed > 0) {
      totalRenamed += renameResult.renamed;
    }

    // Step 2: Import (validates → uploads R2 → writes D1)
    console.log(`\n── Import ──`);
    const importResult = runImporter(slug);
    if (!importResult.success) {
      console.error(`\n✘ Import failed for ${slug}: ${importResult.error}`);
      continue;
    }
    console.log(importResult.stdout.trim());

    // Step 3: Verify D1
    console.log(`\n── D1 Verification ──`);
    const verify = verifyD1(slug);

    // Step 4: Summary
    printSummary(slug, verify);
    totalImported += verify.artworkCount;
  }

  // Final summary
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  Done: ${totalImported} artwork(s) imported across ${slugs.length} character(s)`);
  if (totalRenamed > 0) console.log(`  ${totalRenamed} file(s) auto-renamed`);
  console.log(`${'═'.repeat(60)}`);
}

// ─── Step 1: Check & rename ────────────────────────────────
function checkAndRename(slug) {
  const dir = path.join(IMPORT_ROOT, slug);
  if (!fs.existsSync(dir)) {
    throw new Error(`Directory not found: imports/characters/${slug}/`);
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile() && !e.name.startsWith('.') && IMAGE_RE.test(e.name));

  const conforming = [];
  const nonConforming = [];

  for (const entry of entries) {
    if (FILE_RE.test(entry.name)) {
      conforming.push(entry.name);
    } else {
      const file = path.join(dir, entry.name);
      const ext = entry.name.split('.').pop().toLowerCase();
      const { width, height } = readImageSize(file, ext);
      nonConforming.push({
        name: entry.name,
        width,
        height,
        orientation: height > width ? 'portrait (m)' : 'landscape (pc)',
        ext,
      });
    }
  }

  if (nonConforming.length === 0) {
    return { needsAttention: false, nonConforming: [], renamed: 0 };
  }

  // Sort by name (preserves timestamp order from ChatGPT exports)
  nonConforming.sort((a, b) => a.name.localeCompare(b.name));

  if (!options.rename) {
    return { needsAttention: true, nonConforming, renamed: 0 };
  }

  // Parse rename mapping: "canonical:2,anime:2"
  const groups = options.rename.split(',').map((g) => {
    const [style, count] = g.trim().split(':');
    return { style: style.trim().toLowerCase(), count: Number(count) };
  });

  const totalCount = groups.reduce((sum, g) => sum + g.count, 0);
  if (totalCount !== nonConforming.length) {
    throw new Error(`--rename counts (${totalCount}) don't match non-conforming files (${nonConforming.length}). Files: ${nonConforming.map((f) => f.name).join(', ')}`);
  }

  let idx = 0;
  let renamed = 0;
  for (const group of groups) {
    const seqCounters = {};
    for (let i = 0; i < group.count; i++) {
      const file = nonConforming[idx++];
      const device = file.height > file.width ? 'm' : 'pc';
      const key = `${group.style}_${device}`;
      seqCounters[key] = (seqCounters[key] || 0) + 1;
      const seq = String(seqCounters[key]).padStart(2, '0');
      const newName = `${group.style}_${device}_${seq}.${file.ext}`;

      const oldPath = path.join(dir, file.name);
      const newPath = path.join(dir, newName);
      fs.renameSync(oldPath, newPath);
      console.log(`  ✓ ${file.name} → ${newName}  (${file.width}x${file.height})`);
      renamed++;
    }
  }

  return { needsAttention: false, nonConforming: [], renamed };
}

// ─── Step 2: Run importer ──────────────────────────────────
function runImporter(slug) {
  const importArgs = [IMPORTER, slug, modeFlag];
  const result = spawnSync('node', importArgs, {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (result.status !== 0) {
    const err = [result.stderr, result.stdout].filter(Boolean).join('\n').trim();
    return { success: false, error: err.slice(0, 500) };
  }

  return { success: true, stdout: result.stdout };
}

// ─── Step 3: Verify D1 ─────────────────────────────────────
function verifyD1(slug) {
  const characterId = `character-${slug}`;
  const artPrefix = `art-${slug}-%`;

  const sql = [
    `SELECT COUNT(*) as cnt FROM artworks WHERE id LIKE '${artPrefix}';`,
    `SELECT name, portrait_src, portrait_width, portrait_height FROM characters WHERE slug='${slug}';`,
    `SELECT id, asset_type, asset_key, status FROM reference_assets WHERE owner_id='${characterId}';`,
    `SELECT style_id, COUNT(*) as cnt FROM artworks WHERE id LIKE '${artPrefix}' GROUP BY style_id ORDER BY style_id;`,
  ].join('');

  const result = spawnSync('npx', ['wrangler', 'd1', 'execute', DB_NAME, modeFlag, '--command', sql, '--json'], {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (result.status !== 0) {
    return { error: 'D1 verification failed', artworkCount: 0 };
  }

  const parsed = parseJson(result.stdout);
  const artworkCount = parsed[0]?.results?.[0]?.cnt ?? 0;
  const character = parsed[1]?.results?.[0] ?? {};
  const references = parsed[2]?.results ?? [];
  const styleBreakdown = parsed[3]?.results ?? [];

  return { artworkCount, character, references, styleBreakdown };
}

// ─── Step 4: Summary ───────────────────────────────────────
function printSummary(slug, verify) {
  console.log(`\n── Summary: ${slug} ──`);

  if (verify.error) {
    console.log(`  ⚠ ${verify.error}`);
    return;
  }

  console.log(`  Artworks: ${verify.artworkCount}`);
  console.log(`  Portrait: ${verify.character.portrait_src || '(none)'}`);
  console.log(`  Portrait dimensions: ${verify.character.portrait_width}x${verify.character.portrait_height}`);

  if (verify.references.length) {
    const ref = verify.references[0];
    console.log(`  Reference: ${ref.id} (${ref.asset_type}, ${ref.status})`);
  }

  if (verify.styleBreakdown.length) {
    console.log(`  Style breakdown:`);
    for (const s of verify.styleBreakdown) {
      console.log(`    ${s.style_id}: ${s.cnt} image(s)`);
    }
  }

  console.log(`  ✓ Website auto-updates (listing card, Hero, gallery)`);
}

// ─── Helpers ───────────────────────────────────────────────
function resolveSlugs() {
  if (options.slugs.length) return [...new Set(options.slugs)];
  if (!options.all) return [];
  return fs.readdirSync(IMPORT_ROOT, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
    .map((e) => e.name.toLowerCase())
    .sort();
}

function readImageSize(file, ext) {
  const buffer = fs.readFileSync(file);
  if (ext === 'png') return pngSize(buffer);
  if (ext === 'jpg' || ext === 'jpeg') return jpegSize(buffer);
  if (ext === 'webp') return webpSize(buffer);
  throw new Error(`Unsupported extension: ${ext}`);
}

function pngSize(buf) {
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function jpegSize(buf) {
  const sof = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  let off = 2;
  while (off + 8 < buf.length) {
    if (buf[off] !== 0xff) { off++; continue; }
    while (buf[off] === 0xff) off++;
    const marker = buf[off++];
    if (marker === 0xd9 || marker === 0xda) break;
    if (marker >= 0xd0 && marker <= 0xd7) continue;
    if (off + 2 > buf.length) break;
    const len = buf.readUInt16BE(off);
    if (len < 2 || off + len > buf.length) break;
    if (sof.has(marker)) return { height: buf.readUInt16BE(off + 3), width: buf.readUInt16BE(off + 5) };
    off += len;
  }
  throw new Error('Could not read JPEG dimensions');
}

function webpSize(buf) {
  const chunk = buf.toString('ascii', 12, 16);
  if (chunk === 'VP8X') return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
  if (chunk === 'VP8L') {
    const [b1, b2, b3, b4] = [buf[21], buf[22], buf[23], buf[24]];
    return { width: 1 + b1 + ((b2 & 0x3f) << 8), height: 1 + ((b2 & 0xc0) >> 6) + (b3 << 2) + ((b4 & 0x0f) << 10) };
  }
  if (chunk === 'VP8 ') {
    for (let i = 20; i + 9 < buf.length && i < 40; i++) {
      if (buf[i] === 0x9d && buf[i + 1] === 0x01 && buf[i + 2] === 0x2a) {
        return { width: buf.readUInt16LE(i + 3) & 0x3fff, height: buf.readUInt16LE(i + 5) & 0x3fff };
      }
    }
  }
  throw new Error('Could not read WebP dimensions');
}

function parseJson(stdout) {
  const text = stdout.trim();
  try { return JSON.parse(text); } catch {
    const s = text.indexOf('[');
    const e = text.lastIndexOf(']');
    if (s >= 0 && e > s) return JSON.parse(text.slice(s, e + 1));
    throw new Error(`Could not parse JSON: ${text.slice(0, 200)}`);
  }
}

function printHelp() {
  console.log(`MythCanvas Character Artwork One-Command Import

Usage:
  node scripts/import-character.mjs <slug> [--remote|--local]
  node scripts/import-character.mjs <slug> --rename "canonical:2,anime:2" [--remote|--local]
  node scripts/import-character.mjs --all [--remote|--local]

Options:
  <slug>          Character slug (e.g. brahma, odin, anubis)
  --all           Import all staged character folders
  --remote        Upload to Cloudflare production R2 + D1 (default)
  --local         Use local Wrangler D1/R2 state
  --rename <map>  Auto-rename non-conforming files
                  Format: "canonical:2,anime:2" (style:image-count pairs)
                  Files sorted by name, grouped by count, renamed by orientation
  --help, -h      Show this help

Workflow:
  1. Scan imports/characters/<slug>/ for images
  2. Auto-rename if --rename provided (portrait→m, landscape→pc)
  3. Validate (dimensions, slug, style, duplicates)
  4. Upload to R2 (immutable 1-year cache)
  5. Write D1 (artworks, artwork_characters, portrait, reference_assets)
  6. Verify D1 results
  7. Print summary

Examples:
  # Files already named correctly:
  node scripts/import-character.mjs odin --remote

  # Files with ChatGPT timestamp names, 4 files (2 canonical + 2 anime):
  node scripts/import-character.mjs brahma --rename "canonical:2,anime:2" --remote

  # Batch import all staged characters:
  node scripts/import-character.mjs --all --remote
`);
}
