#!/usr/bin/env node

/** Audit the approved/published Greek Character artwork targets in D1. */
import { spawnSync } from 'node:child_process';

const mode = process.argv.includes('--local') ? '--local' : '--remote';
const strict = process.argv.includes('--strict');

const tierS = new Set(['zeus', 'athena', 'poseidon', 'hades', 'aphrodite', 'apollo', 'artemis', 'medusa', 'heracles', 'achilles', 'odysseus', 'persephone']);
const tierA = new Set(['demeter', 'dionysus', 'hephaestus', 'hera', 'hermes', 'perseus', 'theseus', 'jason', 'pandora', 'prometheus', 'medea', 'hector', 'circe', 'penelope', 'hestia']);

const query = `
SELECT c.slug, c.name,
  SUM(CASE WHEN a.id IS NOT NULL THEN 1 ELSE 0 END) AS artwork_count,
  MAX(CASE WHEN a.width > a.height THEN 1 ELSE 0 END) AS has_desktop,
  MAX(CASE WHEN a.height > a.width THEN 1 ELSE 0 END) AS has_mobile
FROM characters c
LEFT JOIN artwork_characters ac ON ac.character_id = c.id
LEFT JOIN artworks a ON a.id = ac.artwork_id
  AND a.review_status IN ('approved', 'published')
  AND a.publish_status = 'published'
WHERE c.mythology_id = 'myth-greek'
GROUP BY c.id, c.slug, c.name
ORDER BY c.slug;`;

const result = spawnSync('npx', ['wrangler', 'd1', 'execute', 'mythcanvas-db', mode, '--command', query, '--json'], {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
});
if (result.status !== 0) {
  console.error(result.stderr || result.stdout || 'Wrangler D1 query failed.');
  process.exit(result.status ?? 1);
}

const payload = JSON.parse(result.stdout);
const rows = payload.flatMap((item) => Array.isArray(item?.results) ? item.results : []);
const bySlug = new Map(rows.map((row) => [String(row.slug), row]));
const missingS = [...tierS].filter((slug) => Number(bySlug.get(slug)?.has_desktop) !== 1 || Number(bySlug.get(slug)?.has_mobile) !== 1);
const missingA = [...tierA].filter((slug) => Number(bySlug.get(slug)?.artwork_count) < 1);

console.log(`Greek artwork coverage (${mode === '--local' ? 'local' : 'remote'} D1)`);
console.log(`Tier S: ${tierS.size - missingS.length}/${tierS.size} with desktop + mobile`);
console.log(`Tier A: ${tierA.size - missingA.length}/${tierA.size} with at least one approved artwork`);
if (missingS.length) console.log(`Missing Tier S double-end coverage: ${missingS.join(', ')}`);
if (missingA.length) console.log(`Missing Tier A artwork: ${missingA.join(', ')}`);

if (strict && (missingS.length || missingA.length)) process.exit(2);
