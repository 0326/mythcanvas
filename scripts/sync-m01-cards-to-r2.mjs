#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

const BUCKET = 'mythcanvas-artworks';
const ASSET_PREFIX = 'content/cards/norse/m01-norse-genesis/v1';
const CARD_BACK_SHA256 = '10047ab8233bc048c1175d1c54296dcd032546b11f6ff15b9220b82b84f7a4ec';
const SOURCE_DIR = path.resolve('docs/cards/norse/M01-norse-genesis/cards');
const CARD_BACK = path.resolve('docs/cards/norse/M01-norse-genesis/card-back.webp');
const apply = process.argv.includes('--apply');
const remote = process.argv.includes('--remote');

if (apply && !remote) {
  throw new Error('Refusing to upload without both --remote and --apply.');
}

const sha256 = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const records = fs.readdirSync(SOURCE_DIR)
  .filter((name) => /^100301\d{4}\.json$/.test(name))
  .sort()
  .map((name) => JSON.parse(fs.readFileSync(path.join(SOURCE_DIR, name), 'utf8')));

if (records.length !== 50) throw new Error(`Expected 50 M01 card records, found ${records.length}.`);

const items = records.map((record) => {
  const file = path.join(SOURCE_DIR, record.output.fileName);
  if (!fs.existsSync(file)) throw new Error(`Missing delivery asset: ${file}`);
  if (record.output.format !== 'webp') throw new Error(`${record.cardId} is not configured for WebP delivery.`);
  if (record.output.assetKey !== `${ASSET_PREFIX}/${record.output.fileName}`) throw new Error(`${record.cardId} has an unexpected R2 key.`);
  const digest = sha256(file);
  if (digest !== record.output.sha256) throw new Error(`${record.cardId} WebP SHA-256 does not match its metadata.`);
  return { file, key: record.output.assetKey, bytes: fs.statSync(file).size, digest };
});

if (!fs.existsSync(CARD_BACK)) throw new Error(`Missing card back: ${CARD_BACK}`);
const cardBackDigest = sha256(CARD_BACK);
if (cardBackDigest !== CARD_BACK_SHA256) throw new Error('Card-back WebP SHA-256 does not match the published metadata.');
items.push({
  file: CARD_BACK,
  key: `${ASSET_PREFIX}/card-back.webp`,
  bytes: fs.statSync(CARD_BACK).size,
  digest: cardBackDigest,
});

console.log(`M01 R2 manifest: ${items.length} WebP objects / ${items.reduce((sum, item) => sum + item.bytes, 0)} bytes`);
console.log(`Target: ${BUCKET}/${ASSET_PREFIX}/`);

if (!apply) {
  console.log('Dry run complete. No R2 changes were made.');
  process.exit(0);
}

for (const [index, item] of items.entries()) {
  const result = spawnSync('npx', [
    'wrangler', 'r2', 'object', 'put', `${BUCKET}/${item.key}`,
    '--file', item.file,
    '--remote',
    '--content-type', 'image/webp',
    '--cache-control', 'public, max-age=31536000, immutable',
  ], { cwd: process.cwd(), encoding: 'utf8' });

  if (result.status !== 0) {
    process.stderr.write(result.stderr);
    throw new Error(`Upload failed for ${item.key}.`);
  }
  console.log(`[${index + 1}/${items.length}] uploaded ${item.key} (${item.bytes} bytes, ${item.digest})`);
}

console.log('M01 R2 upload complete.');
