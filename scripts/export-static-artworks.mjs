#!/usr/bin/env node
/**
 * Export the published artwork catalog from a D1 snapshot into versioned
 * source content. Public routes consume the generated file and never need a
 * D1 read for canonical artwork metadata.
 *
 * Default is local D1 to make quota incidents safe. Use --remote only after
 * confirming the remote database is readable and the snapshot is current.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const remote = process.argv.includes('--remote');
const stagedJapanese = process.argv.includes('--staged-japanese');
const database = 'mythcanvas-db';
const outputPath = path.resolve('src/data/published-artworks.ts');

function runD1(sql) {
  const executable = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const result = spawnSync(executable, [
    'wrangler', 'd1', 'execute', database,
    remote ? '--remote' : '--local',
    '--json', '--command', sql,
  ], { cwd: process.cwd(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 5 * 60 * 1000 });
  if (result.error) throw result.error;
  let parsed;
  try {
    parsed = JSON.parse(result.stdout);
  } catch {
    throw new Error(`D1 returned invalid JSON: ${result.stderr || result.stdout}`);
  }
  if (!Array.isArray(parsed) || parsed[0]?.success !== true) {
    throw new Error(`D1 export failed: ${result.stderr || result.stdout}`);
  }
  return parsed[0].results ?? [];
}

function assetUrl(assetKey) {
  if (!assetKey) return '';
  if (assetKey.startsWith('data:') || assetKey.startsWith('/media/')) return assetKey;
  if (assetKey.startsWith('media/')) return `/${assetKey}`;
  return `/media/${assetKey}`;
}

function parseArray(value) {
  if (value == null) return [];
  try {
    const parsed = JSON.parse(String(value));
    return Array.isArray(parsed) ? parsed.filter((item) => item != null).map(String) : [];
  } catch {
    return [];
  }
}

const rows = stagedJapanese ? [] : runD1(`
  SELECT
    a.id, a.slug, a.title, a.type, a.mythology_id, a.world_id, a.style_id,
    a.mood_ids_json, a.asset_key, a.asset_mime, a.width, a.height, a.alt_text,
    a.source_type, a.license, a.creator, a.review_status,
    json_group_array(ac.character_id) AS character_ids
  FROM artworks a
  LEFT JOIN artwork_characters ac ON ac.artwork_id = a.id
  WHERE a.publish_status = 'published' AND a.review_status = 'approved'
  GROUP BY a.id
  ORDER BY COALESCE(a.published_at, a.created_at) DESC, a.id
`);

const artworksFromD1 = rows.map((row) => ({
  id: String(row.id),
  slug: String(row.slug),
  title: String(row.title),
  type: String(row.type),
  mythologyId: String(row.mythology_id),
  ...(row.world_id ? { worldId: String(row.world_id) } : {}),
  ...(row.character_ids ? { characterIds: parseArray(row.character_ids).filter(Boolean) } : {}),
  styleId: String(row.style_id),
  moodIds: parseArray(row.mood_ids_json),
  image: {
    src: assetUrl(String(row.asset_key ?? '')),
    alt: String(row.alt_text ?? ''),
    width: Number(row.width),
    height: Number(row.height),
  },
  license: {
    sourceType: String(row.source_type),
    license: String(row.license),
    ...(row.creator ? { creator: String(row.creator) } : {}),
  },
  reviewStatus: String(row.review_status),
}));

function readGeneratedArtworks() {
  const source = fs.readFileSync(outputPath, 'utf8');
  const start = source.indexOf('= ');
  const end = source.lastIndexOf(';');
  if (start < 0 || end <= start) throw new Error(`Cannot parse existing generated artwork catalog: ${outputPath}`);
  const value = JSON.parse(source.slice(start + 2, end));
  if (!Array.isArray(value)) throw new Error(`Existing generated artwork catalog is not an array: ${outputPath}`);
  return value;
}

function readHeadGeneratedArtworks() {
  const result = spawnSync('git', ['show', `HEAD:${path.relative(process.cwd(), outputPath)}`], {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (result.status !== 0) return [];
  const source = result.stdout;
  const start = source.indexOf('= ');
  const end = source.lastIndexOf(';');
  if (start < 0 || end <= start) return [];
  const value = JSON.parse(source.slice(start + 2, end));
  return Array.isArray(value) ? value : [];
}

function loadStagedJapaneseArtworks() {
  const importRoot = path.resolve('imports/characters');
  const catalogFile = path.resolve('src/content/japanese/catalog.ts');
  const catalogSource = fs.readFileSync(catalogFile, 'utf8');
  const seedStart = catalogSource.indexOf('const characterSeeds');
  const seedEnd = catalogSource.indexOf('];', seedStart);
  if (seedStart < 0 || seedEnd < 0) throw new Error(`Japanese character catalog is not parseable: ${catalogFile}`);

  const namesBySlug = new Map();
  for (const match of catalogSource.slice(seedStart, seedEnd).matchAll(/^\s*\['([^']+)',\s*'([^']+)'/gm)) {
    namesBySlug.set(match[1], match[2]);
  }

  const result = [];
  for (const entry of fs.readdirSync(importRoot, { withFileTypes: true })) {
    if (!entry.isDirectory() || !namesBySlug.has(entry.name)) continue;
    const slug = entry.name;
    const name = namesBySlug.get(slug);
    for (const file of fs.readdirSync(path.join(importRoot, slug))) {
      const match = /^(canonical)_(pc|m)_(\d{2})\.(png|jpe?g|webp)$/i.exec(file);
      if (!match) continue;
      const [, style, device, sequence, extension] = match;
      const isMobile = device.toLowerCase() === 'm';
      const outputSpec = isMobile ? 'mobile-wallpaper' : 'desktop-wallpaper';
      const width = isMobile ? 941 : 1672;
      const height = isMobile ? 1672 : 941;
      const deviceLabel = isMobile ? '手机壁纸' : 'PC 壁纸';
      const id = `art-${slug}-${style}-${device.toLowerCase()}-${sequence}`;
      result.push({
        id,
        slug: `${slug}-${style}-${device.toLowerCase()}-${sequence}`,
        title: `${name} · 经典神话 · ${deviceLabel}`,
        type: 'character',
        mythologyId: 'myth-japanese',
        characterIds: [`character-${slug}`],
        styleId: 'canonical',
        moodIds: [],
        image: {
          src: `/media/characters/${slug}/canonical/${outputSpec}/${file}`,
          alt: `${name}，经典神话风格${deviceLabel}`,
          width,
          height,
        },
        license: {
          sourceType: 'ai',
          license: 'MythCanvas AI-generated original',
          creator: 'MythCanvas',
        },
        reviewStatus: 'approved',
      });
    }
  }
  return result;
}

const artworks = stagedJapanese
  ? mergeArtworks(mergeArtworks(readHeadGeneratedArtworks(), readGeneratedArtworks()), loadStagedJapaneseArtworks())
  : artworksFromD1;

function mergeArtworks(base, additions) {
  const byId = new Map(base.map((artwork) => [artwork.id, artwork]));
  additions.forEach((artwork) => byId.set(artwork.id, artwork));
  return [...byId.values()];
}

const sourceDescription = stagedJapanese
  ? 'a D1 publication snapshot plus the approved Japanese canonical promotion manifest'
  : 'a D1 publication snapshot';
const content = `// Generated by scripts/export-static-artworks.mjs from ${sourceDescription}.\n// Do not edit by hand; re-export after editorial artwork changes.\nimport type { Artwork } from '../lib/content/types';\n\nexport const publishedArtworks: readonly Artwork[] = ${JSON.stringify(artworks, null, 2)};\n`;
fs.writeFileSync(outputPath, content, 'utf8');
console.log(`Exported ${artworks.length} published artworks to ${path.relative(process.cwd(), outputPath)} (${stagedJapanese ? 'staged Japanese manifest' : `${remote ? 'remote' : 'local'} D1`}).`);
