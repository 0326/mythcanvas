#!/usr/bin/env node

/** Audit approved/published Character artwork coverage for a registered mythology. */
import { spawnSync } from 'node:child_process';

const mode = process.argv.includes('--local') ? '--local' : '--remote';
const strict = process.argv.includes('--strict');
const argIndex = process.argv.findIndex((arg) => arg === '--mythology');
const flag = process.argv.find((arg) => arg.startsWith('--mythology='))?.split('=').slice(1).join('=');
const slug = flag ?? (argIndex >= 0 ? process.argv[argIndex + 1] : 'norse');
const tiers = {
  greek: {
    S: ['zeus', 'athena', 'poseidon', 'hades', 'aphrodite', 'apollo', 'artemis', 'medusa', 'heracles', 'achilles', 'odysseus', 'persephone'],
    A: ['demeter', 'dionysus', 'hephaestus', 'hera', 'hermes', 'perseus', 'theseus', 'jason', 'pandora', 'prometheus', 'medea', 'hector', 'circe', 'penelope', 'hestia'],
  },
  norse: {
    S: ['odin', 'thor', 'loki', 'freyja', 'frigg', 'baldr', 'heimdall', 'tyr', 'freyr', 'hel', 'fenrir', 'jormungandr'],
    A: ['ymir', 'njordr', 'skadi', 'idunn', 'sif', 'hodr', 'hermod', 'vidarr', 'surtr', 'gerdr', 'sigyn', 'mimir', 'sleipnir', 'sigurd', 'brynhildr', 'fafnir'],
  },
};
if (!tiers[slug]) fail(`Unknown mythology: ${slug}`);

const query = `SELECT c.slug, c.name, SUM(CASE WHEN a.id IS NOT NULL THEN 1 ELSE 0 END) AS artwork_count, MAX(CASE WHEN a.width > a.height THEN 1 ELSE 0 END) AS has_desktop, MAX(CASE WHEN a.height > a.width THEN 1 ELSE 0 END) AS has_mobile FROM characters c LEFT JOIN artwork_characters ac ON ac.character_id = c.id LEFT JOIN artworks a ON a.id = ac.artwork_id AND a.review_status IN ('approved', 'published') AND a.publish_status = 'published' WHERE c.mythology_id = 'myth-${slug}' GROUP BY c.id, c.slug, c.name ORDER BY c.slug;`;
const result = spawnSync('npx', ['wrangler', 'd1', 'execute', 'mythcanvas-db', mode, '--command', query, '--json'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
if (result.status !== 0) fail(result.stderr || result.stdout || 'Wrangler D1 query failed.');
const payload = JSON.parse(result.stdout);
const rows = payload.flatMap((item) => Array.isArray(item?.results) ? item.results : []);
const bySlug = new Map(rows.map((row) => [String(row.slug), row]));
const missingS = tiers[slug].S.filter((item) => Number(bySlug.get(item)?.has_desktop) !== 1 || Number(bySlug.get(item)?.has_mobile) !== 1);
const missingA = tiers[slug].A.filter((item) => Number(bySlug.get(item)?.artwork_count) < 1);
console.log(`${slug} artwork coverage (${mode === '--local' ? 'local' : 'remote'} D1)`);
console.log(`Tier S: ${tiers[slug].S.length - missingS.length}/${tiers[slug].S.length} with desktop + mobile`);
console.log(`Tier A: ${tiers[slug].A.length - missingA.length}/${tiers[slug].A.length} with at least one approved artwork`);
if (missingS.length) console.log(`Missing Tier S double-end coverage: ${missingS.join(', ')}`);
if (missingA.length) console.log(`Missing Tier A artwork: ${missingA.join(', ')}`);
if (strict && (missingS.length || missingA.length)) process.exit(2);

function fail(message) { console.error(`[mythology-artwork-coverage] ${message}`); process.exit(1); }
