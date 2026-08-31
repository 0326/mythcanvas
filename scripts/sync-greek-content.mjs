#!/usr/bin/env node

/**
 * Structured Greek content importer.
 *
 * The authored TypeScript modules are the source of truth for editorial Story
 * bodies. This script transpiles their type-only imports, validates the graph,
 * emits an idempotent D1 manifest, and optionally applies it to a chosen D1
 * environment. It never publishes an asset or changes review status.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const ROOT = process.cwd();
const DB_NAME = 'mythcanvas-db';
const args = new Set(process.argv.slice(2));
const local = args.has('--local');
const remote = args.has('--remote');
const apply = args.has('--apply');
const writeIndex = process.argv.indexOf('--write');
const writePath = writeIndex >= 0 ? process.argv[writeIndex + 1] : undefined;

if (local && remote) fail('Use only one of --local or --remote.');
if (writeIndex >= 0 && !writePath) fail('--write needs a destination path.');

const catalog = loadTsModule('src/content/greek/catalog.ts');
const storiesModule = loadTsModule('src/content/greek/stories.ts');
const mythologies = loadTsModule('src/data/mythologies.ts').mythologies;
const illustrations = loadTsModule('src/data/story-illustrations.ts').storyIllustrations;
const mythology = mythologies.find((item) => item.id === 'myth-greek');
if (!mythology) fail('myth-greek is missing from src/data/mythologies.ts.');

// Vitest resolves the typed validation module exactly as CI does. Keeping the
// importer and validator separate prevents a custom script loader from becoming
// a second implementation of the content rules.
execFileSync('npm', ['run', 'content:validate'], { cwd: ROOT, stdio: 'inherit' });

const sql = buildSql({ ...catalog, stories: storiesModule.greekStories, mythology });
if (writePath) {
  const destination = path.resolve(ROOT, writePath);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, sql, 'utf8');
  console.log(`Wrote ${path.relative(ROOT, destination)}.`);
}

if (!apply) {
  console.log(`Validated Greek P0 graph: ${catalog.greekCharacters.length} Characters, ${catalog.greekWorlds.length} Worlds, ${catalog.greekScenes.length} Scenes, ${storiesModule.greekStories.length} Stories, ${catalog.greekRelations.length} Relations.`);
  console.log('Dry run only. Pass --apply with --local or --remote to synchronize D1.');
  process.exit(0);
}

const target = remote ? '--remote' : '--local';
const tempDir = path.resolve(ROOT, '.wrangler');
const tempFile = path.join(tempDir, `greek-content-${Date.now()}.sql`);
fs.mkdirSync(tempDir, { recursive: true });
fs.writeFileSync(tempFile, sql, 'utf8');
try {
  execFileSync('npx', ['wrangler', 'd1', 'execute', DB_NAME, target, '--file', tempFile], { cwd: ROOT, stdio: 'inherit' });
  console.log(`Greek P0 content synchronized to ${remote ? 'remote' : 'local'} D1.`);
} finally {
  fs.rmSync(tempFile, { force: true });
}

function loadTsModule(relativePath) {
  const absolutePath = path.resolve(ROOT, relativePath);
  const source = fs.readFileSync(absolutePath, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    fileName: absolutePath,
  }).outputText;
  const module = { exports: {} };
  const require = (specifier) => {
    throw new Error(`Structured source ${relativePath} may only use type-only imports; found runtime import ${specifier}.`);
  };
  new Function('exports', 'module', 'require', '__filename', '__dirname', output)(module.exports, module, require, absolutePath, path.dirname(absolutePath));
  return module.exports;
}

function buildSql({ greekCharacters, greekWorlds, greekScenes, greekRelations, greekTaxonomy, stories, mythology }) {
  const statements = ['PRAGMA foreign_keys = ON;'];

  statements.push(`
UPDATE mythologies
SET hero_src=${q(mythology.heroImage.src)}, hero_alt=${q(mythology.heroImage.alt)}, hero_width=${mythology.heroImage.width}, hero_height=${mythology.heroImage.height}, updated_at=CURRENT_TIMESTAMP
WHERE id=${q(mythology.id)};`);

  for (const item of greekWorlds) {
    statements.push(`
INSERT INTO worlds (id, mythology_id, slug, name, name_en, summary, canonical_design_json, hero_src, hero_alt, hero_width, hero_height, publish_status)
VALUES (${q(item.id)}, ${q(item.mythologyId)}, ${q(item.slug)}, ${q(item.name)}, ${q(item.nameEn)}, ${q(item.summary)}, ${json(item.canonicalDesign)}, ${q(item.heroImage.src)}, ${q(item.heroImage.alt)}, ${item.heroImage.width}, ${item.heroImage.height}, 'published')
ON CONFLICT(id) DO UPDATE SET mythology_id=excluded.mythology_id, slug=excluded.slug, name=excluded.name, name_en=excluded.name_en, summary=excluded.summary, canonical_design_json=excluded.canonical_design_json, hero_src=excluded.hero_src, hero_alt=excluded.hero_alt, hero_width=excluded.hero_width, hero_height=excluded.hero_height, publish_status='published', updated_at=CURRENT_TIMESTAMP;`);
  }

  for (const item of greekCharacters) {
    statements.push(`
INSERT INTO characters (id, mythology_id, slug, name, name_en, role, summary, symbols_json, canonical_design_json, character_type, tradition_tags_json, source_periods_json, source_refs_json, editorial_collections_json, canonicality, publish_status)
VALUES (${q(item.id)}, ${q(item.mythologyId)}, ${q(item.slug)}, ${q(item.name)}, ${q(item.nameEn)}, ${q(item.role)}, ${q(item.summary)}, ${json(item.symbols)}, ${json(item.canonicalDesign)}, ${q(item.characterType)}, ${json(item.traditionTags)}, ${json(item.sourcePeriods)}, ${json(item.sourceRefs)}, ${json(item.editorialCollections ?? [])}, ${q(item.canonicality ?? 'primary')}, 'published')
ON CONFLICT(id) DO UPDATE SET mythology_id=excluded.mythology_id, slug=excluded.slug, name=excluded.name, name_en=excluded.name_en, role=excluded.role, summary=excluded.summary, symbols_json=excluded.symbols_json, canonical_design_json=excluded.canonical_design_json, character_type=excluded.character_type, tradition_tags_json=excluded.tradition_tags_json, source_periods_json=excluded.source_periods_json, source_refs_json=excluded.source_refs_json, editorial_collections_json=excluded.editorial_collections_json, canonicality=excluded.canonicality, publish_status='published', updated_at=CURRENT_TIMESTAMP;`);
    for (const worldId of item.worldIds) statements.push(`INSERT OR IGNORE INTO character_worlds (character_id, world_id) VALUES (${q(item.id)}, ${q(worldId)});`);
  }

  for (const item of greekScenes) {
    statements.push(`
INSERT INTO scenes (id, mythology_id, world_id, slug, name, name_en, summary, canonical_design_json, hero_src, hero_alt, hero_width, hero_height, publish_status)
VALUES (${q(item.id)}, ${q(item.mythologyId)}, ${nullable(item.worldId)}, ${q(item.slug)}, ${q(item.name)}, ${q(item.nameEn)}, ${q(item.summary)}, ${json(item.canonicalDesign)}, ${q(item.heroImage?.src ?? '')}, ${q(item.heroImage?.alt ?? '')}, ${item.heroImage?.width ?? 1600}, ${item.heroImage?.height ?? 900}, 'published')
ON CONFLICT(id) DO UPDATE SET mythology_id=excluded.mythology_id, world_id=excluded.world_id, slug=excluded.slug, name=excluded.name, name_en=excluded.name_en, summary=excluded.summary, canonical_design_json=excluded.canonical_design_json, hero_src=excluded.hero_src, hero_alt=excluded.hero_alt, hero_width=excluded.hero_width, hero_height=excluded.hero_height, publish_status='published', updated_at=CURRENT_TIMESTAMP;`);
  }

  for (const item of greekTaxonomy) {
    statements.push(`
INSERT INTO taxonomy_terms (id, mythology_id, slug, kind, name, name_en, summary, display_order, status)
VALUES (${q(item.id)}, ${q(item.mythologyId)}, ${q(item.slug)}, ${q(item.kind)}, ${q(item.name)}, ${nullable(item.nameEn)}, ${q(item.summary)}, ${item.displayOrder}, 'active')
ON CONFLICT(id) DO UPDATE SET slug=excluded.slug, kind=excluded.kind, name=excluded.name, name_en=excluded.name_en, summary=excluded.summary, display_order=excluded.display_order, status='active';`);
  }
  const taxonomyBySlug = new Map(greekTaxonomy.map((item) => [item.slug, item.id]));
  for (const character of greekCharacters) for (const tag of character.traditionTags ?? []) {
    const termId = taxonomyBySlug.get(tag);
    if (termId) statements.push(`INSERT OR IGNORE INTO character_taxonomy_terms (character_id, taxonomy_term_id) VALUES (${q(character.id)}, ${q(termId)});`);
  }

  const sourceById = new Map();
  for (const story of stories) for (const source of story.sources) if (source.sourceId) sourceById.set(source.sourceId, source);
  for (const [id, source] of sourceById) {
    statements.push(`
INSERT INTO content_sources (id, mythology_id, title, author, source_type, tradition, period, language, edition, url, license_note, status)
VALUES (${q(id)}, 'myth-greek', ${q(source.title)}, ${nullable(undefined)}, ${q(source.sourceType)}, ${nullable(source.tradition)}, ${nullable(source.period)}, ${nullable(source.language)}, ${nullable(source.translation)}, ${nullable(source.url)}, '', 'active')
ON CONFLICT(id) DO UPDATE SET title=excluded.title, source_type=excluded.source_type, tradition=excluded.tradition, period=excluded.period, language=excluded.language, edition=excluded.edition, url=excluded.url, status='active', updated_at=CURRENT_TIMESTAMP;`);
  }
  for (const story of stories) for (const claim of story.claims ?? []) {
    statements.push(`
INSERT INTO content_claims (id, mythology_id, subject_type, subject_id, claim_type, summary, claim_status, tradition_scope, publish_status)
VALUES (${q(claim.id)}, 'myth-greek', ${q(claim.subjectType)}, ${q(claim.subjectId)}, ${q(claim.claimType)}, ${q(claim.summary)}, ${q(claim.status)}, ${q(claim.traditionScope ?? '')}, 'published')
ON CONFLICT(id) DO UPDATE SET summary=excluded.summary, claim_status=excluded.claim_status, tradition_scope=excluded.tradition_scope, publish_status='published', updated_at=CURRENT_TIMESTAMP;`);
    const storySource = story.sources[0];
    if (storySource?.sourceId) statements.push(`INSERT OR IGNORE INTO content_claim_sources (claim_id, source_id, locator, note) VALUES (${q(claim.id)}, ${q(storySource.sourceId)}, ${q(storySource.locator ?? '全文')}, ${q(storySource.note ?? '')});`);
  }

  for (const relation of greekRelations) {
    statements.push(`
INSERT INTO character_relations (id, from_character_id, to_character_id, to_concept_id, from_interpretation_id, to_interpretation_id, relation_type, assertion_key, tradition_scope, is_default, source_refs_json, confidence, status)
VALUES (${q(relation.id)}, ${q(relation.fromCharacterId)}, ${nullable(relation.toCharacterId)}, NULL, ${nullable(relation.fromInterpretationId)}, ${nullable(relation.toInterpretationId)}, ${q(relation.relationType)}, ${q(relation.assertionKey ?? relation.id)}, ${q(relation.traditionScope ?? '')}, ${relation.isDefault === false ? 0 : 1}, ${json(relation.sourceRefs)}, ${q(relation.confidence)}, 'active')
ON CONFLICT(id) DO UPDATE SET from_character_id=excluded.from_character_id, to_character_id=excluded.to_character_id, relation_type=excluded.relation_type, assertion_key=excluded.assertion_key, tradition_scope=excluded.tradition_scope, is_default=excluded.is_default, source_refs_json=excluded.source_refs_json, confidence=excluded.confidence, status='active', updated_at=CURRENT_TIMESTAMP;`);
  }
  return `${statements.join('\n')}\n`;
}

function q(value) { return `'${String(value).replaceAll("'", "''")}'`; }
function nullable(value) { return value == null ? 'NULL' : q(value); }
function json(value) { return q(JSON.stringify(value)); }
function fail(message) { console.error(`[greek-content] ${message}`); process.exit(1); }
