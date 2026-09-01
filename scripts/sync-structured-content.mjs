#!/usr/bin/env node

/**
 * Civilization-agnostic structured content importer.
 * Data packages own editorial content; this script owns normalization and D1 upserts.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const ROOT = process.cwd();
const DB_NAME = 'mythcanvas-db';
const args = process.argv.slice(2);
const local = args.includes('--local');
const remote = args.includes('--remote');
const apply = args.includes('--apply');
const mythologyArgIndex = args.findIndex((arg) => arg === '--mythology');
const mythologyFlag = args.find((arg) => arg.startsWith('--mythology='))?.split('=').slice(1).join('=');
const requested = mythologyFlag ?? (mythologyArgIndex >= 0 ? args[mythologyArgIndex + 1] : 'all');
const writeIndex = args.indexOf('--write');
const writePath = writeIndex >= 0 ? args[writeIndex + 1] : undefined;

if (local && remote) fail('Use only one of --local or --remote.');
if (writeIndex >= 0 && !writePath) fail('--write needs a destination path.');
if (!['all', 'greek', 'norse'].includes(requested)) fail(`Unknown mythology: ${requested}. Use greek, norse or all.`);

const packagePaths = requested === 'greek'
  ? ['greek']
  : requested === 'norse'
    ? ['norse']
    : ['greek', 'norse'];
const mythologies = loadTsModule('src/data/mythologies.ts').mythologies;
const illustrations = loadTsModule('src/data/story-illustrations.ts').storyIllustrations;
const bundles = packagePaths.map((slug) => {
  const catalog = loadTsModule(`src/content/${slug}/catalog.ts`);
  const stories = loadTsModule(`src/content/${slug}/stories.ts`);
  const mythology = mythologies.find((item) => item.slug === slug);
  if (!mythology) fail(`${slug} is missing from src/data/mythologies.ts.`);
  return { slug, catalog, stories: stories[`${slug}Stories`], mythology };
});

execFileSync('npm', ['run', 'content:validate'], { cwd: ROOT, stdio: 'inherit' });
const sql = bundles.map((bundle) => buildSql(bundle)).join('\n');

if (writePath) {
  const destination = path.resolve(ROOT, writePath);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, sql, 'utf8');
  console.log(`Wrote ${path.relative(ROOT, destination)}.`);
}

if (!apply) {
  for (const bundle of bundles) {
    console.log(`Validated ${bundle.slug} bundle: ${bundle.catalog[`${bundle.slug}Characters`].length} Characters, ${bundle.catalog[`${bundle.slug}Worlds`].length} Worlds, ${bundle.catalog[`${bundle.slug}Scenes`].length} Scenes, ${bundle.stories.length} Stories, ${bundle.catalog[`${bundle.slug}Relations`].length} Relations.`);
  }
  console.log('Dry run only. Pass --apply with --local or --remote to synchronize D1.');
  process.exit(0);
}

const target = remote ? '--remote' : '--local';
const tempDir = path.resolve(ROOT, '.wrangler');
const tempFile = path.join(tempDir, `structured-content-${Date.now()}.sql`);
fs.mkdirSync(tempDir, { recursive: true });
fs.writeFileSync(tempFile, sql, 'utf8');
try {
  execFileSync('npx', ['wrangler', 'd1', 'execute', DB_NAME, target, '--file', tempFile], { cwd: ROOT, stdio: 'inherit' });
  console.log(`Structured content synchronized (${packagePaths.join(', ')}) to ${remote ? 'remote' : 'local'} D1.`);
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

function buildSqlForBundle({ characters, worlds, scenes, relations, taxonomy, stories, mythology }) {
  const statements = ['PRAGMA foreign_keys = ON;'];
  statements.push(`UPDATE mythologies SET hero_src=${q(mythology.heroImage.src)}, hero_alt=${q(mythology.heroImage.alt)}, hero_width=${mythology.heroImage.width}, hero_height=${mythology.heroImage.height}, updated_at=CURRENT_TIMESTAMP WHERE id=${q(mythology.id)};`);

  for (const item of worlds) statements.push(`INSERT INTO worlds (id, mythology_id, slug, name, name_en, summary, canonical_design_json, hero_src, hero_alt, hero_width, hero_height, publish_status) VALUES (${q(item.id)}, ${q(item.mythologyId)}, ${q(item.slug)}, ${q(item.name)}, ${q(item.nameEn)}, ${q(item.summary)}, ${json(item.canonicalDesign)}, ${q(item.heroImage.src)}, ${q(item.heroImage.alt)}, ${item.heroImage.width}, ${item.heroImage.height}, 'published') ON CONFLICT(id) DO UPDATE SET mythology_id=excluded.mythology_id, slug=excluded.slug, name=excluded.name, name_en=excluded.name_en, summary=excluded.summary, canonical_design_json=excluded.canonical_design_json, hero_src=excluded.hero_src, hero_alt=excluded.hero_alt, hero_width=excluded.hero_width, hero_height=excluded.hero_height, publish_status='published', updated_at=CURRENT_TIMESTAMP;`);
  for (const item of characters) {
    statements.push(`INSERT INTO characters (id, mythology_id, slug, name, name_en, role, summary, symbols_json, canonical_design_json, character_type, tradition_tags_json, source_periods_json, source_refs_json, editorial_collections_json, canonicality, publish_status) VALUES (${q(item.id)}, ${q(item.mythologyId)}, ${q(item.slug)}, ${q(item.name)}, ${q(item.nameEn)}, ${q(item.role)}, ${q(item.summary)}, ${json(item.symbols)}, ${json(item.canonicalDesign)}, ${q(item.characterType)}, ${json(item.traditionTags)}, ${json(item.sourcePeriods)}, ${json(item.sourceRefs)}, ${json(item.editorialCollections ?? [])}, ${q(item.canonicality ?? 'primary')}, 'published') ON CONFLICT(id) DO UPDATE SET mythology_id=excluded.mythology_id, slug=excluded.slug, name=excluded.name, name_en=excluded.name_en, role=excluded.role, summary=excluded.summary, symbols_json=excluded.symbols_json, canonical_design_json=excluded.canonical_design_json, character_type=excluded.character_type, tradition_tags_json=excluded.tradition_tags_json, source_periods_json=excluded.source_periods_json, source_refs_json=excluded.source_refs_json, editorial_collections_json=excluded.editorial_collections_json, canonicality=excluded.canonicality, publish_status='published', updated_at=CURRENT_TIMESTAMP;`);
    for (const worldId of item.worldIds) statements.push(`INSERT OR IGNORE INTO character_worlds (character_id, world_id) VALUES (${q(item.id)}, ${q(worldId)});`);
  }
  for (const item of scenes) statements.push(`INSERT INTO scenes (id, mythology_id, world_id, slug, name, name_en, summary, canonical_design_json, hero_src, hero_alt, hero_width, hero_height, publish_status) VALUES (${q(item.id)}, ${q(item.mythologyId)}, ${nullable(item.worldId)}, ${q(item.slug)}, ${q(item.name)}, ${q(item.nameEn)}, ${q(item.summary)}, ${json(item.canonicalDesign)}, ${q(item.heroImage?.src ?? '')}, ${q(item.heroImage?.alt ?? '')}, ${item.heroImage?.width ?? 1600}, ${item.heroImage?.height ?? 900}, 'published') ON CONFLICT(id) DO UPDATE SET mythology_id=excluded.mythology_id, world_id=excluded.world_id, slug=excluded.slug, name=excluded.name, name_en=excluded.name_en, summary=excluded.summary, canonical_design_json=excluded.canonical_design_json, hero_src=excluded.hero_src, hero_alt=excluded.hero_alt, hero_width=excluded.hero_width, hero_height=excluded.hero_height, publish_status='published', updated_at=CURRENT_TIMESTAMP;`);
  for (const item of taxonomy ?? []) statements.push(`INSERT INTO taxonomy_terms (id, mythology_id, slug, kind, name, name_en, summary, display_order, status) VALUES (${q(item.id)}, ${q(item.mythologyId)}, ${q(item.slug)}, ${q(item.kind)}, ${q(item.name)}, ${nullable(item.nameEn)}, ${q(item.summary)}, ${item.displayOrder}, 'active') ON CONFLICT(id) DO UPDATE SET slug=excluded.slug, kind=excluded.kind, name=excluded.name, name_en=excluded.name_en, summary=excluded.summary, display_order=excluded.display_order, status='active';`);
  const taxonomyBySlug = new Map((taxonomy ?? []).map((item) => [item.slug, item.id]));
  for (const character of characters) for (const tag of character.traditionTags ?? []) if (taxonomyBySlug.has(tag)) statements.push(`INSERT OR IGNORE INTO character_taxonomy_terms (character_id, taxonomy_term_id) VALUES (${q(character.id)}, ${q(taxonomyBySlug.get(tag))});`);

  const sourceById = new Map();
  for (const story of stories) for (const item of story.sources) if (item.sourceId) sourceById.set(item.sourceId, item);
  for (const [id, item] of sourceById) statements.push(`INSERT INTO content_sources (id, mythology_id, title, author, source_type, tradition, period, language, edition, url, license_note, status) VALUES (${q(id)}, ${q(mythology.id)}, ${q(item.title)}, NULL, ${q(item.sourceType)}, ${nullable(item.tradition)}, ${nullable(item.period)}, ${nullable(item.language)}, ${nullable(item.translation)}, ${nullable(item.url)}, '', 'active') ON CONFLICT(id) DO UPDATE SET mythology_id=excluded.mythology_id, title=excluded.title, source_type=excluded.source_type, tradition=excluded.tradition, period=excluded.period, language=excluded.language, edition=excluded.edition, url=excluded.url, status='active', updated_at=CURRENT_TIMESTAMP;`);
  for (const story of stories) for (const claim of story.claims ?? []) {
    statements.push(`INSERT INTO content_claims (id, mythology_id, subject_type, subject_id, claim_type, summary, claim_status, tradition_scope, publish_status) VALUES (${q(claim.id)}, ${q(mythology.id)}, ${q(claim.subjectType)}, ${q(claim.subjectId)}, ${q(claim.claimType)}, ${q(claim.summary)}, ${q(claim.status)}, ${q(claim.traditionScope ?? '')}, 'published') ON CONFLICT(id) DO UPDATE SET mythology_id=excluded.mythology_id, summary=excluded.summary, claim_status=excluded.claim_status, tradition_scope=excluded.tradition_scope, publish_status='published', updated_at=CURRENT_TIMESTAMP;`);
    for (const ref of claim.sourceRefs) if (ref.sourceId) statements.push(`INSERT OR IGNORE INTO content_claim_sources (claim_id, source_id, locator, note) VALUES (${q(claim.id)}, ${q(ref.sourceId)}, ${q(ref.locator ?? ref.section ?? '全文')}, ${q(ref.note ?? '')});`);
  }
  for (const relation of relations) statements.push(`INSERT INTO character_relations (id, from_character_id, to_character_id, to_concept_id, from_interpretation_id, to_interpretation_id, relation_type, assertion_key, tradition_scope, is_default, source_refs_json, confidence, status) VALUES (${q(relation.id)}, ${q(relation.fromCharacterId)}, ${nullable(relation.toCharacterId)}, ${nullable(relation.toConceptId)}, ${nullable(relation.fromInterpretationId)}, ${nullable(relation.toInterpretationId)}, ${q(relation.relationType)}, ${q(relation.assertionKey ?? relation.id)}, ${q(relation.traditionScope ?? '')}, ${relation.isDefault === false ? 0 : 1}, ${json(relation.sourceRefs)}, ${q(relation.confidence)}, 'active') ON CONFLICT(id) DO UPDATE SET from_character_id=excluded.from_character_id, to_character_id=excluded.to_character_id, to_concept_id=excluded.to_concept_id, from_interpretation_id=excluded.from_interpretation_id, to_interpretation_id=excluded.to_interpretation_id, relation_type=excluded.relation_type, assertion_key=excluded.assertion_key, tradition_scope=excluded.tradition_scope, is_default=excluded.is_default, source_refs_json=excluded.source_refs_json, confidence=excluded.confidence, status='active', updated_at=CURRENT_TIMESTAMP;`);
  return `${statements.join('\n')}\n`;
}

function buildSql(bundle) {
  const slug = bundle.slug;
  return buildSqlForBundle({
    characters: bundle.catalog[`${slug}Characters`],
    worlds: bundle.catalog[`${slug}Worlds`],
    scenes: bundle.catalog[`${slug}Scenes`],
    relations: bundle.catalog[`${slug}Relations`],
    taxonomy: bundle.catalog[`${slug}Taxonomy`],
    stories: bundle.stories,
    mythology: bundle.mythology,
  });
}

function q(value) { return `'${String(value).replaceAll("'", "''")}'`; }
function nullable(value) { return value == null ? 'NULL' : q(value); }
function json(value) { return q(JSON.stringify(value)); }
function fail(message) { console.error(`[structured-content] ${message}`); process.exit(1); }
