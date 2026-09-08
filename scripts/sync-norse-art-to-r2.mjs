#!/usr/bin/env node
/**
 * Build and optionally apply the Norse artwork migration to R2.
 *
 * Safe by default: without --apply this only validates local files and writes
 * a deterministic manifest when --write is supplied. Remote writes require
 * both --remote and --apply. Only delivery files are uploaded by default;
 * source/provenance files are intentionally excluded from the public ARTWORKS
 * bucket unless --include-source is explicitly supplied.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import sharp from 'sharp';

const root = process.cwd();
const artDir = path.resolve(root, 'content-assets/norse');
const reportPath = path.resolve(root, 'reports/norse-art-r2-migration.json');
const bucket = 'mythcanvas-artworks';
const remote = process.argv.includes('--remote');
const apply = process.argv.includes('--apply');
const includeSource = process.argv.includes('--include-source');
const write = process.argv.includes('--write');

const WORLD_SLUGS = ['asgard', 'midgard', 'jotunheim', 'hel', 'muspell', 'niflheim', 'vanaheim', 'alfheim'];

function fail(message) {
  console.error(`\nERROR: ${message}`);
  process.exitCode = 1;
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function pngDimensions(bytes, file) {
  if (bytes.length < 24 || bytes.toString('ascii', 1, 4) !== 'PNG') {
    throw new Error(`${file} is not a readable PNG`);
  }
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

function classify(file) {
  if (/^norse-story-[a-z0-9-]+-v1\.png$/i.test(file)) return 'story-delivery';
  if (new RegExp(`^norse-(${WORLD_SLUGS.join('|')})(?:-mobile)?-final-v1\\.png$`, 'i').test(file)) return 'world-delivery';
  if (new RegExp(`^norse-(${WORLD_SLUGS.join('|')})(?:-mobile)?-v1\\.png$`, 'i').test(file)) return 'world-source';
  return null;
}

function r2KeyFor(file, category) {
  if (category === 'story-delivery') return `content/norse/stories/${file.replace(/\.png$/i, '.webp')}`;
  if (category === 'world-delivery') return `content/norse/worlds/${file.replace(/\.png$/i, '.webp')}`;
  return `source/norse/worlds/${file}`;
}

async function buildManifest() {
  if (!fs.existsSync(artDir)) throw new Error(`Missing artwork directory: ${artDir}`);
  const entries = fs.readdirSync(artDir).filter((file) => classify(file)).sort();
  const stagingDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mythcanvas-norse-r2-'));
  const items = await Promise.all(entries.map(async (file) => {
    const category = classify(file);
    const absolutePath = path.join(artDir, file);
    const sourceBytes = fs.readFileSync(absolutePath);
    const { width, height } = pngDimensions(sourceBytes, file);
    const deliveryBytes = category.endsWith('delivery')
      ? await sharp(sourceBytes).webp({ quality: 82, effort: 6 }).toBuffer()
      : sourceBytes;
    const deliveryFile = category.endsWith('delivery') ? file.replace(/\.png$/i, '.webp') : file;
    const stagingPath = path.join(stagingDir, deliveryFile);
    fs.writeFileSync(stagingPath, deliveryBytes);
    const deliveryMetadata = category.endsWith('delivery') ? await sharp(deliveryBytes).metadata() : { width, height };
    if (deliveryMetadata.width !== width || deliveryMetadata.height !== height) {
      throw new Error(`${file} WebP dimensions changed during conversion`);
    }
    return {
      file,
      localPath: `content-assets/norse/${file}`,
      deliveryFile,
      category,
      upload: category.endsWith('delivery') || includeSource,
      r2Key: r2KeyFor(file, category),
      targetUrl: `/media/${r2KeyFor(file, category)}`,
      mimeType: category.endsWith('delivery') ? 'image/webp' : 'image/png',
      bytes: deliveryBytes.length,
      sha256: sha256(deliveryBytes),
      sourceBytes: sourceBytes.length,
      sourceSha256: sha256(sourceBytes),
      width,
      height,
      stagingPath,
    };
  }));

  const byHash = new Map();
  for (const item of items) {
    const same = byHash.get(item.sha256) ?? [];
    same.push(item.file);
    byHash.set(item.sha256, same);
  }
  const duplicateGroups = [...byHash.values()].filter((files) => files.length > 1);
  const delivery = items.filter((item) => item.upload && item.category.endsWith('delivery'));
  const source = items.filter((item) => item.category === 'world-source');
  const bytes = (list) => list.reduce((total, item) => total + item.bytes, 0);

  return {
    manifestVersion: 'norse-art-r2-v1',
    generatedAt: new Date().toISOString(),
    bucket,
    policy: {
      deliveryPrefix: 'content/norse/',
      sourcePrefix: 'source/norse/',
      sourceUploadDefault: false,
      sourceUploadRequested: includeSource,
      localSourcePathPattern: 'content-assets/norse/<file>',
      targetUrlPattern: '/media/<r2-key>',
    },
    summary: {
      totalNorseFiles: items.length,
      deliveryFiles: delivery.length,
      deliveryBytes: bytes(delivery),
      sourceFiles: source.length,
      sourceBytes: bytes(source),
      duplicateGroups,
    },
    items,
    stagingDir,
  };
}

async function runWrangler(args) {
  const executable = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  let lastError;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    const result = spawnSync(executable, ['wrangler', ...args], {
      cwd: root,
      encoding: 'utf8',
      stdio: 'inherit',
      timeout: 15 * 60 * 1000,
    });
    if (!result.error && result.status === 0) return;
    lastError = result.error ?? new Error(`Wrangler exited with status ${result.status}`);
    if (attempt < 4) {
      const waitMs = attempt * 3000;
      console.log(`  retrying after ${waitMs}ms (attempt ${attempt + 1}/4)`);
      await delay(waitMs);
    }
  }
  throw lastError;
}

async function upload(manifest) {
  const items = manifest.items.filter((item) => item.upload);
  console.log(`\nUploading ${items.length} object(s) to ${bucket} (${remote ? 'remote' : 'local'})...`);
  for (const item of items) {
    await runWrangler([
      'r2', 'object', 'put', `${bucket}/${item.r2Key}`,
      '--file', item.stagingPath,
      remote ? '--remote' : '--local',
      '--content-type', item.mimeType,
      '--cache-control', 'public, max-age=31536000, immutable',
    ]);
    console.log(`  uploaded ${item.r2Key} (${item.bytes} bytes, ${item.sha256})`);
  }
}

async function main() {
  if (apply && !remote) throw new Error('Refusing to write without --remote; use --remote --apply explicitly.');
  const manifest = await buildManifest();
  if (manifest.summary.duplicateGroups.length) {
    throw new Error(`Duplicate content groups found: ${JSON.stringify(manifest.summary.duplicateGroups)}`);
  }

  if (write) {
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    const report = { ...manifest, items: manifest.items.map(({ stagingPath, ...item }) => item) };
    delete report.stagingDir;
    fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  }

  console.log(`Norse R2 migration manifest: ${manifest.manifestVersion}`);
  console.log(`  delivery: ${manifest.summary.deliveryFiles} files / ${manifest.summary.deliveryBytes} bytes`);
  console.log(`  source:   ${manifest.summary.sourceFiles} files / ${manifest.summary.sourceBytes} bytes (not uploaded by default)`);
  console.log(`  target:   ${bucket}`);
  if (write) console.log(`  report:   ${path.relative(root, reportPath)}`);

  try {
    if (apply) await upload(manifest);
    else console.log('\nDry run complete. No R2 changes were made.');
  } finally {
    fs.rmSync(manifest.stagingDir, { recursive: true, force: true });
  }
}

try {
  await main();
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
