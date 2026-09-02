#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const DB_NAME = 'mythcanvas-db';
const R2_BUCKET = 'mythcanvas-artworks';
const IMPORT_ROOT = path.resolve('imports/characters');
const FILE_RE = /^(?<style>[a-z0-9]+(?:-[a-z0-9]+)*)_(?<device>pc|m)_(?<sequence>[0-9]{2})\.(?<ext>png|jpg|jpeg|webp)$/i;
const CHARACTER_SLUG_RE = /^[\p{L}\p{M}\p{N}]+(?:-[\p{L}\p{M}\p{N}]+)*$/u;
const ACTIVE_PRODUCTION_STYLES = new Set(['canonical', 'sacred', 'cinematic', 'anime', 'cyber-myth']);
const GENERATION_PROVIDER = 'OpenAI';
const GENERATION_MODEL = 'gpt-image-2';
const PROMPT_RECIPE_ID = 'mythcanvas.character.v1';

const args = process.argv.slice(2);
const options = parseArgs(args);

if (options.help) {
  printHelp();
  process.exit(0);
}

main().catch((error) => {
  console.error(`\n[artwork:import] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});

async function main() {
  if (!fs.existsSync(IMPORT_ROOT)) {
    throw new Error(`Import root does not exist: ${path.relative(process.cwd(), IMPORT_ROOT)}. Create imports/characters/<character-slug>/ first.`);
  }

  const characterSlugs = resolveCharacterSlugs(options.characterSlugs, options.all);
  if (!characterSlugs.length) {
    throw new Error('No character folders found. Use the character-production skill to import one or more staged character folders.');
  }

  const candidates = [];
  for (const characterSlug of characterSlugs) {
    candidates.push(...scanCharacterFolder(characterSlug));
  }

  if (!candidates.length) throw new Error('No importable images found. Expected names like canonical_m_01.png or anime_pc_01.png.');
  markPrimaryCanonicals(candidates);

  const invalidStyle = candidates.find((item) => !ACTIVE_PRODUCTION_STYLES.has(item.styleId));
  if (invalidStyle) {
    throw new Error(`Unsupported production style in ${invalidStyle.relativeFile}: ${invalidStyle.styleId}. Allowed: ${[...ACTIVE_PRODUCTION_STYLES].join(', ')}`);
  }

  console.log(`\nFound ${candidates.length} image(s) for ${characterSlugs.length} character(s).`);
  for (const item of candidates) {
    console.log(`  ${item.relativeFile} -> ${item.r2Key} (${item.width}x${item.height})${item.isPrimaryCanonical ? ' [primary canonical]' : ''}`);
  }

  if (options.dryRun) {
    console.log('\nDry run complete. No R2/D1 changes were made.');
    return;
  }

  const modeFlag = options.local ? '--local' : '--remote';
  console.log(`\nPreflight D1 validation (${options.local ? 'local' : 'remote'})...`);

  const characterMap = loadCharacters(characterSlugs, modeFlag);
  const styleMap = loadStyles([...new Set(candidates.map((item) => item.styleId))], modeFlag);

  for (const slug of characterSlugs) {
    if (!characterMap.has(slug)) throw new Error(`Character slug not found in D1: ${slug}`);
  }
  for (const styleId of new Set(candidates.map((item) => item.styleId))) {
    if (!styleMap.has(styleId)) throw new Error(`Style not found/active in D1: ${styleId}`);
  }

  console.log('Uploading to R2...');
  for (const item of candidates) {
    await uploadR2(item, modeFlag);
    console.log(`  uploaded ${item.r2Key}`);
  }

  const sql = buildImportSql(candidates, characterMap, styleMap);
  executeSqlFile(sql, modeFlag);

  console.log(`\nImported ${candidates.length} artwork(s) successfully.`);
  console.log('Website records: approved + published.');
  for (const item of candidates.filter((candidate) => candidate.isPrimaryCanonical)) {
    console.log(`${item.characterSlug}/${item.filename} was promoted to character portrait + Canonical Reference Pack.`);
  }
}

function parseArgs(argv) {
  const result = { characterSlugs: [], all: false, dryRun: false, local: false, help: false };
  for (const arg of argv) {
    if (arg === '--all') result.all = true;
    else if (arg === '--dry-run') result.dryRun = true;
    else if (arg === '--local') result.local = true;
    else if (arg === '--remote') result.local = false;
    else if (arg === '--help' || arg === '-h') result.help = true;
    else if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`);
    else result.characterSlugs.push(arg.toLowerCase());
  }
  if (result.all && result.characterSlugs.length) throw new Error('Use either explicit character slugs or --all, not both.');
  return result;
}

function printHelp() {
  console.log(`MythCanvas character artwork importer\n\nThis is an implementation detail of the mythcanvas-character-production skill.\nPrefer invoking the skill in natural language rather than asking users to remember CLI syntax.\n\nExpected layout:\n  imports/characters/athena/canonical_m_01.png\n  imports/characters/athena/canonical_pc_01.png\n  imports/characters/athena/anime_m_01.png\n  imports/characters/athena/anime_pc_01.png\n\nFilename grammar:\n  <style>_<m|pc>_<NN>.<png|jpg|jpeg|webp>\n`);
}

function resolveCharacterSlugs(explicit, all) {
  if (explicit.length) return [...new Set(explicit)];
  if (!all) return [];
  return fs.readdirSync(IMPORT_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => entry.name.toLowerCase())
    .sort();
}

function scanCharacterFolder(characterSlug) {
  if (!CHARACTER_SLUG_RE.test(characterSlug)) {
    throw new Error(`Invalid character directory slug: ${characterSlug}`);
  }

  const dir = path.join(IMPORT_ROOT, characterSlug);
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    throw new Error(`Character import directory not found: ${path.relative(process.cwd(), dir)}`);
  }

  const seen = new Set();
  const items = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isFile() || entry.name.startsWith('.')) continue;
    const match = FILE_RE.exec(entry.name);
    if (!match?.groups) {
      if (/\.(png|jpe?g|webp)$/i.test(entry.name)) {
        throw new Error(`Invalid artwork filename: ${characterSlug}/${entry.name}. Expected <style>_<m|pc>_<NN>.<ext>.`);
      }
      continue;
    }

    const styleId = match.groups.style.toLowerCase();
    const device = match.groups.device.toLowerCase();
    const sequence = Number(match.groups.sequence);
    const ext = match.groups.ext.toLowerCase();
    const identity = `${styleId}:${device}:${sequence}`;
    if (seen.has(identity)) throw new Error(`Duplicate style/device/sequence in ${characterSlug}: ${entry.name}`);
    seen.add(identity);

    const absoluteFile = path.join(dir, entry.name);
    const { width, height } = readImageSize(absoluteFile, ext);
    if (device === 'm' && height <= width) throw new Error(`${characterSlug}/${entry.name} is named mobile but is not portrait (${width}x${height}).`);
    if (device === 'pc' && width <= height) throw new Error(`${characterSlug}/${entry.name} is named PC but is not landscape (${width}x${height}).`);

    const outputSpecId = device === 'm' ? 'mobile-wallpaper' : 'desktop-wallpaper';
    const r2Key = styleId === 'canonical'
      ? `characters/${characterSlug}/canonical/${outputSpecId}/${entry.name}`
      : `characters/${characterSlug}/styles/${styleId}/${outputSpecId}/${entry.name}`;

    items.push({
      characterSlug,
      styleId,
      device,
      sequence,
      ext,
      outputSpecId,
      filename: entry.name,
      absoluteFile,
      relativeFile: path.relative(process.cwd(), absoluteFile),
      width,
      height,
      mimeType: mimeForExtension(ext),
      r2Key,
      publicUrl: `/media/${r2Key}`,
      isPrimaryCanonical: false,
    });
  }

  return items.sort((a, b) => a.filename.localeCompare(b.filename));
}

function markPrimaryCanonicals(candidates) {
  const latestByCharacter = new Map();
  for (const item of candidates) {
    if (item.styleId !== 'canonical' || item.device !== 'm') continue;
    const current = latestByCharacter.get(item.characterSlug);
    if (!current || item.sequence > current.sequence) latestByCharacter.set(item.characterSlug, item);
  }
  for (const item of latestByCharacter.values()) item.isPrimaryCanonical = true;
}

function loadCharacters(slugs, modeFlag) {
  const sql = `SELECT id, slug, name, mythology_id FROM characters WHERE slug IN (${slugs.map(sqlQuote).join(',')});`;
  const rows = d1Query(sql, modeFlag);
  return new Map(rows.map((row) => [String(row.slug), {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    mythologyId: String(row.mythology_id),
  }]));
}

function loadStyles(styleIds, modeFlag) {
  const sql = `SELECT id, slug, name, status FROM styles WHERE (id IN (${styleIds.map(sqlQuote).join(',')}) OR slug IN (${styleIds.map(sqlQuote).join(',')})) AND status = 'active';`;
  const rows = d1Query(sql, modeFlag);
  const map = new Map();
  for (const row of rows) {
    const value = { id: String(row.id), slug: String(row.slug), name: String(row.name) };
    map.set(value.id, value);
    map.set(value.slug, value);
  }
  return map;
}

function d1Query(command, modeFlag) {
  const result = runWrangler(['d1', 'execute', DB_NAME, modeFlag, '--command', command, '--json']);
  const parsed = parseWranglerJson(result.stdout);
  if (!Array.isArray(parsed)) throw new Error('Unexpected Wrangler D1 JSON response.');
  const rows = [];
  for (const item of parsed) {
    if (item && Array.isArray(item.results)) rows.push(...item.results);
  }
  return rows;
}

async function uploadR2(item, modeFlag) {
  const maxAttempts = 4;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      runWrangler([
        'r2', 'object', 'put', `${R2_BUCKET}/${item.r2Key}`,
        '--file', item.absoluteFile,
        '--content-type', item.mimeType,
        '--cache-control', 'public, max-age=31536000, immutable',
        modeFlag,
        '--force',
      ]);
      return;
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      const waitMs = attempt * 2000;
      console.warn(`  upload retry ${attempt}/${maxAttempts - 1} for ${item.filename} after ${waitMs}ms`);
      await delay(waitMs);
    }
  }
}

function buildImportSql(candidates, characterMap, styleMap) {
  // Wrangler's remote `d1 execute --file` rejects explicit BEGIN/COMMIT
  // statements. Keep the statements idempotent so a retry safely converges
  // after the preceding R2 uploads have completed.
  const statements = ['PRAGMA foreign_keys = ON;'];

  for (const item of candidates) {
    const character = characterMap.get(item.characterSlug);
    const style = styleMap.get(item.styleId);
    if (!character || !style) throw new Error(`Internal preflight mismatch for ${item.relativeFile}`);

    const seq = String(item.sequence).padStart(2, '0');
    const artworkId = `art-${item.characterSlug}-${item.styleId}-${item.device}-${seq}`;
    const artworkSlug = `${item.characterSlug}-${item.styleId}-${item.device}-${seq}`;
    const deviceLabel = item.device === 'm' ? '手机壁纸' : 'PC 壁纸';
    const title = `${character.name} · ${style.name} · ${deviceLabel}`;
    const alt = `${character.name}，${style.name}风格${deviceLabel}`;
    const promptMeta = JSON.stringify({
      importedBy: 'scripts/import-character-artworks.mjs',
      sourceFile: item.filename,
      outputSpecId: item.outputSpecId,
      sequence: item.sequence,
      provider: GENERATION_PROVIDER,
      model: GENERATION_MODEL,
      promptRecipeId: PROMPT_RECIPE_ID,
      promptLayers: {
        mythology: character.mythologyId,
        character: character.slug,
        style: style.slug,
        scene: null,
        outputSpec: item.outputSpecId,
        userRefinement: null,
        guardrails: ['preserve canonical identity', 'avoid copyrighted modern adaptations'],
      },
    });

    statements.push(`
INSERT INTO artworks (
  id, slug, title, type, mythology_id, world_id, style_id, mood_ids_json,
  asset_key, asset_mime, width, height, alt_text, source_type, license, creator,
  prompt_meta_json, ai_model, review_status, publish_status, updated_at
) VALUES (
  ${sqlQuote(artworkId)}, ${sqlQuote(artworkSlug)}, ${sqlQuote(title)}, 'character',
  ${sqlQuote(character.mythologyId)}, NULL, ${sqlQuote(style.id)}, '[]',
  ${sqlQuote(item.publicUrl)}, ${sqlQuote(item.mimeType)}, ${item.width}, ${item.height},
  ${sqlQuote(alt)}, 'ai', 'MythCanvas AI-generated original', 'MythCanvas',
  ${sqlQuote(promptMeta)}, ${sqlQuote(GENERATION_MODEL)}, 'approved', 'published', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  slug=excluded.slug,
  title=excluded.title,
  mythology_id=excluded.mythology_id,
  style_id=excluded.style_id,
  asset_key=excluded.asset_key,
  asset_mime=excluded.asset_mime,
  width=excluded.width,
  height=excluded.height,
  alt_text=excluded.alt_text,
  source_type=excluded.source_type,
  license=excluded.license,
  creator=excluded.creator,
  ai_model=excluded.ai_model,
  prompt_meta_json=excluded.prompt_meta_json,
  review_status='approved',
  publish_status='published',
  updated_at=CURRENT_TIMESTAMP;

INSERT INTO artwork_characters (artwork_id, character_id)
VALUES (${sqlQuote(artworkId)}, ${sqlQuote(character.id)})
ON CONFLICT(artwork_id, character_id) DO NOTHING;
`);

    if (item.isPrimaryCanonical) {
      const refId = `ref-${item.characterSlug}-canonical-primary`;
      const generationMeta = JSON.stringify({
        importedBy: 'scripts/import-character-artworks.mjs',
      sourceArtworkId: artworkId,
      sourceFile: item.filename,
      sequence: item.sequence,
      provider: GENERATION_PROVIDER,
      model: GENERATION_MODEL,
      promptRecipeId: PROMPT_RECIPE_ID,
      });
      statements.push(`
UPDATE characters
SET portrait_src=${sqlQuote(item.publicUrl)},
    portrait_alt=${sqlQuote(alt)},
    portrait_width=${item.width},
    portrait_height=${item.height},
    updated_at=CURRENT_TIMESTAMP
WHERE id=${sqlQuote(character.id)};

UPDATE reference_assets
SET status='archived', updated_at=CURRENT_TIMESTAMP
WHERE owner_type='character'
  AND owner_id=${sqlQuote(character.id)}
  AND asset_type='portrait-three-quarter'
  AND id != ${sqlQuote(refId)};

INSERT INTO reference_assets (
  id, owner_type, owner_id, asset_type, asset_key, asset_mime,
  width, height, alt_text, source_type, license, generation_meta_json, status, updated_at
) VALUES (
  ${sqlQuote(refId)}, 'character', ${sqlQuote(character.id)}, 'portrait-three-quarter',
  ${sqlQuote(item.r2Key)}, ${sqlQuote(item.mimeType)}, ${item.width}, ${item.height},
  ${sqlQuote(alt)}, 'ai', 'MythCanvas AI-generated canonical reference',
  ${sqlQuote(generationMeta)}, 'active', CURRENT_TIMESTAMP
)
ON CONFLICT(id) DO UPDATE SET
  asset_key=excluded.asset_key,
  asset_mime=excluded.asset_mime,
  width=excluded.width,
  height=excluded.height,
  alt_text=excluded.alt_text,
  generation_meta_json=excluded.generation_meta_json,
  status='active',
  updated_at=CURRENT_TIMESTAMP;
`);
    }
  }

  return statements.join('\n');
}

function executeSqlFile(sql, modeFlag) {
  const tempDir = path.resolve('.wrangler');
  fs.mkdirSync(tempDir, { recursive: true });
  const tempFile = path.join(tempDir, `artwork-import-${process.pid}-${Date.now()}.sql`);
  fs.writeFileSync(tempFile, sql, 'utf8');
  try {
    const maxAttempts = 4;
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        runWrangler(['d1', 'execute', DB_NAME, modeFlag, '--file', tempFile, '--yes']);
        return;
      } catch (error) {
        if (attempt === maxAttempts) throw error;
        const waitMs = attempt * 2000;
        console.warn(`  D1 import retry ${attempt}/${maxAttempts - 1} after ${waitMs}ms`);
        // D1 writes are idempotent upserts, so a retry is safe even when the
        // request failed after the remote service accepted the file.
        const wait = new Int32Array(new SharedArrayBuffer(4));
        Atomics.wait(wait, 0, 0, waitMs);
      }
    }
  } finally {
    fs.rmSync(tempFile, { force: true });
  }
}

function runWrangler(wranglerArgs) {
  const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const result = spawnSync(npx, ['wrangler', ...wranglerArgs], {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    const details = [result.stdout, result.stderr].filter(Boolean).join('\n').trim();
    throw new Error(`Wrangler command failed: npx wrangler ${wranglerArgs.join(' ')}${details ? `\n${details}` : ''}`);
  }
  return { stdout: result.stdout ?? '', stderr: result.stderr ?? '' };
}

function parseWranglerJson(stdout) {
  const text = stdout.trim();
  try {
    return JSON.parse(text);
  } catch {
    const arrayStart = text.indexOf('[');
    const arrayEnd = text.lastIndexOf(']');
    if (arrayStart >= 0 && arrayEnd > arrayStart) return JSON.parse(text.slice(arrayStart, arrayEnd + 1));
    throw new Error(`Could not parse Wrangler JSON output: ${text.slice(0, 300)}`);
  }
}

function sqlQuote(value) {
  if (value == null) return 'NULL';
  return `'${String(value).replaceAll("'", "''")}'`;
}

function mimeForExtension(ext) {
  if (ext === 'png') return 'image/png';
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'webp') return 'image/webp';
  throw new Error(`Unsupported image extension: ${ext}`);
}

function readImageSize(file, ext) {
  const buffer = fs.readFileSync(file);
  if (ext === 'png') return pngSize(buffer, file);
  if (ext === 'jpg' || ext === 'jpeg') return jpegSize(buffer, file);
  if (ext === 'webp') return webpSize(buffer, file);
  throw new Error(`Unsupported image extension: ${ext}`);
}

function pngSize(buffer, file) {
  const signature = '89504e470d0a1a0a';
  if (buffer.length < 24 || buffer.subarray(0, 8).toString('hex') !== signature) throw new Error(`Invalid PNG: ${file}`);
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function jpegSize(buffer, file) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) throw new Error(`Invalid JPEG: ${file}`);
  const sofMarkers = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  let offset = 2;
  while (offset + 8 < buffer.length) {
    if (buffer[offset] !== 0xff) { offset += 1; continue; }
    while (buffer[offset] === 0xff) offset += 1;
    const marker = buffer[offset++];
    if (marker === 0xd9 || marker === 0xda) break;
    if (marker >= 0xd0 && marker <= 0xd7) continue;
    if (offset + 2 > buffer.length) break;
    const length = buffer.readUInt16BE(offset);
    if (length < 2 || offset + length > buffer.length) break;
    if (sofMarkers.has(marker)) {
      return { height: buffer.readUInt16BE(offset + 3), width: buffer.readUInt16BE(offset + 5) };
    }
    offset += length;
  }
  throw new Error(`Could not read JPEG dimensions: ${file}`);
}

function webpSize(buffer, file) {
  if (buffer.length < 30 || buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP') {
    throw new Error(`Invalid WebP: ${file}`);
  }
  const chunk = buffer.toString('ascii', 12, 16);
  if (chunk === 'VP8X') {
    const width = 1 + buffer.readUIntLE(24, 3);
    const height = 1 + buffer.readUIntLE(27, 3);
    return { width, height };
  }
  if (chunk === 'VP8L') {
    if (buffer[20] !== 0x2f) throw new Error(`Invalid VP8L WebP: ${file}`);
    const b1 = buffer[21], b2 = buffer[22], b3 = buffer[23], b4 = buffer[24];
    return {
      width: 1 + b1 + ((b2 & 0x3f) << 8),
      height: 1 + ((b2 & 0xc0) >> 6) + (b3 << 2) + ((b4 & 0x0f) << 10),
    };
  }
  if (chunk === 'VP8 ') {
    for (let i = 20; i + 9 < buffer.length && i < 40; i += 1) {
      if (buffer[i] === 0x9d && buffer[i + 1] === 0x01 && buffer[i + 2] === 0x2a) {
        return {
          width: buffer.readUInt16LE(i + 3) & 0x3fff,
          height: buffer.readUInt16LE(i + 5) & 0x3fff,
        };
      }
    }
  }
  throw new Error(`Could not read WebP dimensions: ${file}`);
}
