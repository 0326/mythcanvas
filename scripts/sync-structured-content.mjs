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
const contentRoot = path.resolve(ROOT, 'src/content');
const registeredPackages = fs.readdirSync(contentRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(contentRoot, entry.name, 'catalog.ts')) && fs.existsSync(path.join(contentRoot, entry.name, 'stories.ts')))
  .map((entry) => entry.name)
  .sort();
if (requested !== 'all' && !registeredPackages.includes(requested)) fail(`Unknown mythology: ${requested}. Registered packages: ${registeredPackages.join(', ')}.`);

const packagePaths = requested === 'all' ? registeredPackages : [requested];
const moduleCache = new Map();
const mythologies = loadTsModule('src/data/mythologies.ts').mythologies;
const illustrations = loadTsModule('src/data/story-illustrations.ts').storyIllustrations;
const bundles = packagePaths.map((slug) => {
  const catalog = loadTsModule(`src/content/${slug}/catalog.ts`);
  const stories = loadTsModule(`src/content/${slug}/stories.ts`);
  const sources = loadTsModule(`src/content/${slug}/sources.ts`, true);
  const identities = loadTsModule(`src/content/${slug}/identities.ts`, true);
  const mythology = mythologies.find((item) => item.slug === slug);
  if (!mythology) fail(`${slug} is missing from src/data/mythologies.ts.`);
  return { slug, catalog, stories: stories[`${slug}Stories`], mythology, identities, sources };
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

function loadTsModule(relativePath, optional = false) {
  const absolutePath = path.resolve(ROOT, relativePath);
  if (moduleCache.has(absolutePath)) return moduleCache.get(absolutePath);
  if (optional && !fs.existsSync(absolutePath)) return {};
  const source = fs.readFileSync(absolutePath, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    fileName: absolutePath,
  }).outputText;
  const module = { exports: {} };
  const require = (specifier) => {
    if (!specifier.startsWith('.')) throw new Error(`Structured source ${relativePath} may only use relative runtime imports; found ${specifier}.`);
    const imported = path.resolve(path.dirname(absolutePath), `${specifier}.ts`);
    return loadTsModule(path.relative(ROOT, imported));
  };
  moduleCache.set(absolutePath, module.exports);
  new Function('exports', 'module', 'require', '__filename', '__dirname', output)(module.exports, module, require, absolutePath, path.dirname(absolutePath));
  return module.exports;
}

function buildSqlForBundle({ characters, worlds, scenes, relations, taxonomy, stories, mythology, concepts = [], claims = [], names = [], interpretations = [], sources = [] }) {
  const statements = ['PRAGMA foreign_keys = ON;'];
  statements.push(`UPDATE mythologies SET hero_src=${q(mythology.heroImage.src)}, hero_alt=${q(mythology.heroImage.alt)}, hero_width=${mythology.heroImage.width}, hero_height=${mythology.heroImage.height}, updated_at=CURRENT_TIMESTAMP WHERE id=${q(mythology.id)};`);

  for (const item of worlds) statements.push(`INSERT INTO worlds (id, mythology_id, slug, name, name_en, summary, canonical_design_json, hero_src, hero_alt, hero_width, hero_height, publish_status) VALUES (${q(item.id)}, ${q(item.mythologyId)}, ${q(item.slug)}, ${q(item.name)}, ${q(item.nameEn)}, ${q(item.summary)}, ${json(item.canonicalDesign)}, ${q(item.heroImage.src)}, ${q(item.heroImage.alt)}, ${item.heroImage.width}, ${item.heroImage.height}, 'published') ON CONFLICT(id) DO UPDATE SET mythology_id=excluded.mythology_id, slug=excluded.slug, name=excluded.name, name_en=excluded.name_en, summary=excluded.summary, canonical_design_json=excluded.canonical_design_json, hero_src=excluded.hero_src, hero_alt=excluded.hero_alt, hero_width=excluded.hero_width, hero_height=excluded.hero_height, publish_status='published', updated_at=CURRENT_TIMESTAMP;`);
  for (const item of characters) {
    // The structured package is authoritative for a migrated Character. Clear
    // old join rows first so corrections such as Kaguya leaving Takamagahara
    // are idempotent in D1 as well as in the static fallback.
    statements.push(`DELETE FROM character_worlds WHERE character_id=${q(item.id)};`);
    statements.push(`INSERT INTO characters (id, mythology_id, slug, name, name_en, role, summary, symbols_json, canonical_design_json, character_type, tradition_tags_json, source_periods_json, source_refs_json, editorial_collections_json, canonicality, publish_status) VALUES (${q(item.id)}, ${q(item.mythologyId)}, ${q(item.slug)}, ${q(item.name)}, ${q(item.nameEn)}, ${q(item.role)}, ${q(item.summary)}, ${json(item.symbols)}, ${json(item.canonicalDesign)}, ${q(item.characterType)}, ${json(item.traditionTags)}, ${json(item.sourcePeriods)}, ${json(item.sourceRefs)}, ${json(item.editorialCollections ?? [])}, ${q(item.canonicality ?? 'primary')}, 'published') ON CONFLICT(id) DO UPDATE SET mythology_id=excluded.mythology_id, slug=excluded.slug, name=excluded.name, name_en=excluded.name_en, role=excluded.role, summary=excluded.summary, symbols_json=excluded.symbols_json, canonical_design_json=excluded.canonical_design_json, character_type=excluded.character_type, tradition_tags_json=excluded.tradition_tags_json, source_periods_json=excluded.source_periods_json, source_refs_json=excluded.source_refs_json, editorial_collections_json=excluded.editorial_collections_json, canonicality=excluded.canonicality, publish_status='published', updated_at=CURRENT_TIMESTAMP;`);
    for (const worldId of item.worldIds) statements.push(`INSERT OR IGNORE INTO character_worlds (character_id, world_id) VALUES (${q(item.id)}, ${q(worldId)});`);
  }
  for (const item of scenes) statements.push(`INSERT INTO scenes (id, mythology_id, world_id, slug, name, name_en, summary, canonical_design_json, hero_src, hero_alt, hero_width, hero_height, publish_status) VALUES (${q(item.id)}, ${q(item.mythologyId)}, ${nullable(item.worldId)}, ${q(item.slug)}, ${q(item.name)}, ${q(item.nameEn)}, ${q(item.summary)}, ${json(item.canonicalDesign)}, ${q(item.heroImage?.src ?? '')}, ${q(item.heroImage?.alt ?? '')}, ${item.heroImage?.width ?? 1600}, ${item.heroImage?.height ?? 900}, 'published') ON CONFLICT(id) DO UPDATE SET mythology_id=excluded.mythology_id, world_id=excluded.world_id, slug=excluded.slug, name=excluded.name, name_en=excluded.name_en, summary=excluded.summary, canonical_design_json=excluded.canonical_design_json, hero_src=excluded.hero_src, hero_alt=excluded.hero_alt, hero_width=excluded.hero_width, hero_height=excluded.hero_height, publish_status='published', updated_at=CURRENT_TIMESTAMP;`);
  for (const item of concepts) statements.push(`INSERT INTO content_concepts (id, mythology_id, slug, name, summary, source_refs_json, status) VALUES (${q(item.id)}, ${q(item.mythologyId)}, ${q(item.slug)}, ${q(item.name)}, ${q(item.summary)}, ${json(item.sourceRefs)}, 'active') ON CONFLICT(id) DO UPDATE SET mythology_id=excluded.mythology_id, slug=excluded.slug, name=excluded.name, summary=excluded.summary, source_refs_json=excluded.source_refs_json, status='active';`);
  for (const item of taxonomy ?? []) statements.push(`INSERT INTO taxonomy_terms (id, mythology_id, slug, kind, name, name_en, summary, display_order, status) VALUES (${q(item.id)}, ${q(item.mythologyId)}, ${q(item.slug)}, ${q(item.kind)}, ${q(item.name)}, ${nullable(item.nameEn)}, ${q(item.summary)}, ${item.displayOrder}, 'active') ON CONFLICT(id) DO UPDATE SET slug=excluded.slug, kind=excluded.kind, name=excluded.name, name_en=excluded.name_en, summary=excluded.summary, display_order=excluded.display_order, status='active';`);
  const taxonomyBySlug = new Map((taxonomy ?? []).map((item) => [item.slug, item.id]));
  for (const character of characters) for (const tag of character.traditionTags ?? []) if (taxonomyBySlug.has(tag)) statements.push(`INSERT OR IGNORE INTO character_taxonomy_terms (character_id, taxonomy_term_id) VALUES (${q(character.id)}, ${q(taxonomyBySlug.get(tag))});`);

  const sourceById = new Map();
  const collectSource = (item) => {
    if (!item?.sourceId) return;
    const current = sourceById.get(item.sourceId) ?? {};
    sourceById.set(item.sourceId, {
      ...current,
      ...item,
      type: item.type ?? current.type,
      sourceType: item.sourceType ?? current.sourceType,
      tradition: item.tradition ?? current.tradition,
      period: item.period ?? current.period,
      language: item.language ?? current.language,
      edition: item.edition ?? item.translation ?? current.edition ?? current.translation,
      url: item.url ?? current.url,
      author: item.author ?? current.author,
    });
  };
  for (const source of sources) collectSource({ ...source, sourceType: source.storyType });
  for (const story of stories) for (const item of story.sources) collectSource(item);
  for (const character of characters) for (const item of character.sourceRefs ?? []) collectSource(item);
  for (const concept of concepts) for (const item of concept.sourceRefs ?? []) collectSource(item);
  for (const relation of relations) for (const item of relation.sourceRefs ?? []) collectSource(item);
  for (const name of names) for (const item of name.sourceRefs ?? []) collectSource(item);
  for (const interpretation of interpretations) for (const item of interpretation.sourceRefs ?? []) collectSource(item);
  for (const claim of claims) for (const item of claim.sourceRefs ?? []) collectSource(item);
  for (const [id, item] of sourceById) statements.push(`INSERT INTO content_sources (id, mythology_id, title, author, source_type, tradition, period, language, edition, url, license_note, status) VALUES (${q(id)}, ${q(mythology.id)}, ${q(item.title)}, ${nullable(item.author)}, ${q(item.type ?? item.sourceType)}, ${nullable(item.tradition)}, ${nullable(item.period)}, ${nullable(item.language)}, ${nullable(item.edition ?? item.translation)}, ${nullable(item.url)}, '', 'active') ON CONFLICT(id) DO UPDATE SET mythology_id=excluded.mythology_id, title=excluded.title, author=excluded.author, source_type=excluded.source_type, tradition=excluded.tradition, period=excluded.period, language=excluded.language, edition=excluded.edition, url=excluded.url, status='active', updated_at=CURRENT_TIMESTAMP;`);
  for (const claim of [...claims, ...stories.flatMap((story) => story.claims ?? [])]) {
    statements.push(`INSERT INTO content_claims (id, mythology_id, subject_type, subject_id, claim_type, summary, claim_status, tradition_scope, publish_status) VALUES (${q(claim.id)}, ${q(mythology.id)}, ${q(claim.subjectType)}, ${q(claim.subjectId)}, ${q(claim.claimType)}, ${q(claim.summary)}, ${q(claim.status)}, ${q(claim.traditionScope ?? '')}, 'published') ON CONFLICT(id) DO UPDATE SET mythology_id=excluded.mythology_id, summary=excluded.summary, claim_status=excluded.claim_status, tradition_scope=excluded.tradition_scope, publish_status='published', updated_at=CURRENT_TIMESTAMP;`);
    for (const ref of claim.sourceRefs) if (ref.sourceId) statements.push(`INSERT OR IGNORE INTO content_claim_sources (claim_id, source_id, locator, note) VALUES (${q(claim.id)}, ${q(ref.sourceId)}, ${q(ref.locator ?? ref.section ?? '全文')}, ${q(ref.note ?? '')});`);
  }
  for (const interpretation of interpretations) statements.push(`INSERT INTO character_interpretations (id, character_id, slug, name, role, summary, tradition_tags_json, source_periods_json, source_refs_json, identity_anchors_json, symbols_json, canonical_design_overrides_json, prompt_fragment, confidence, status) VALUES (${q(interpretation.id)}, ${q(interpretation.characterId)}, ${q(interpretation.slug)}, ${q(interpretation.name)}, ${q(interpretation.role)}, ${q(interpretation.summary)}, ${json(interpretation.traditionTags)}, ${json(interpretation.sourcePeriods)}, ${json(interpretation.sourceRefs)}, ${json(interpretation.identityAnchors)}, ${json(interpretation.symbols)}, ${json(interpretation.canonicalDesignOverrides)}, ${q(interpretation.promptFragment)}, ${q(interpretation.confidence)}, 'active') ON CONFLICT(id) DO UPDATE SET character_id=excluded.character_id, slug=excluded.slug, name=excluded.name, role=excluded.role, summary=excluded.summary, tradition_tags_json=excluded.tradition_tags_json, source_periods_json=excluded.source_periods_json, source_refs_json=excluded.source_refs_json, identity_anchors_json=excluded.identity_anchors_json, symbols_json=excluded.symbols_json, canonical_design_overrides_json=excluded.canonical_design_overrides_json, prompt_fragment=excluded.prompt_fragment, confidence=excluded.confidence, status='active';`);
  for (const name of names) statements.push(`INSERT INTO character_names (id, character_id, interpretation_id, name, name_en, name_kind, is_primary_for_scope, source_refs_json, confidence, status) VALUES (${q(name.id)}, ${q(name.characterId)}, ${nullable(name.interpretationId)}, ${q(name.name)}, ${nullable(name.nameEn)}, ${q(name.nameKind)}, ${name.isPrimaryForScope ? 1 : 0}, ${json(name.sourceRefs)}, ${q(name.confidence)}, 'active') ON CONFLICT(id) DO UPDATE SET character_id=excluded.character_id, interpretation_id=excluded.interpretation_id, name=excluded.name, name_en=excluded.name_en, name_kind=excluded.name_kind, is_primary_for_scope=excluded.is_primary_for_scope, source_refs_json=excluded.source_refs_json, confidence=excluded.confidence, status='active';`);
  for (const relation of relations) statements.push(`INSERT INTO character_relations (id, from_character_id, to_character_id, to_concept_id, from_interpretation_id, to_interpretation_id, relation_type, assertion_key, tradition_scope, is_default, source_refs_json, confidence, status) VALUES (${q(relation.id)}, ${q(relation.fromCharacterId)}, ${nullable(relation.toCharacterId)}, ${nullable(relation.toConceptId)}, ${nullable(relation.fromInterpretationId)}, ${nullable(relation.toInterpretationId)}, ${q(relation.relationType)}, ${q(relation.assertionKey ?? relation.id)}, ${q(relation.traditionScope ?? '')}, ${relation.isDefault === false ? 0 : 1}, ${json(relation.sourceRefs)}, ${q(relation.confidence)}, 'active') ON CONFLICT(id) DO UPDATE SET from_character_id=excluded.from_character_id, to_character_id=excluded.to_character_id, to_concept_id=excluded.to_concept_id, from_interpretation_id=excluded.from_interpretation_id, to_interpretation_id=excluded.to_interpretation_id, relation_type=excluded.relation_type, assertion_key=excluded.assertion_key, tradition_scope=excluded.tradition_scope, is_default=excluded.is_default, source_refs_json=excluded.source_refs_json, confidence=excluded.confidence, status='active', updated_at=CURRENT_TIMESTAMP;`);
  return `${statements.join('\n')}\n`;
}

function buildSql(bundle) {
  const slug = bundle.slug;
  const registeredSources = bundle.sources?.[`${slug}Sources`];
  return buildSqlForBundle({
    characters: bundle.catalog[`${slug}Characters`],
    worlds: bundle.catalog[`${slug}Worlds`],
    scenes: bundle.catalog[`${slug}Scenes`],
    relations: bundle.catalog[`${slug}Relations`],
    taxonomy: bundle.catalog[`${slug}Taxonomy`],
    stories: bundle.stories,
    concepts: bundle.catalog[`${slug}Concepts`] ?? [],
    claims: bundle.identities?.[`${slug}Claims`] ?? [],
    names: bundle.identities?.[`${slug}Names`] ?? [],
    interpretations: bundle.identities?.[`${slug}Interpretations`] ?? [],
    // Source packages use either a keyed registry object (for helper lookup)
    // or a materialized array (for the runtime bundle). Accept both shapes so
    // every discovered civilization uses the same mirror path.
    sources: Array.isArray(registeredSources)
      ? registeredSources
      : Array.isArray(bundle.sources)
        ? bundle.sources
        : Object.values(registeredSources ?? bundle.sources ?? {}),
    mythology: bundle.mythology,
  });
}

function q(value) { return `'${String(value).replaceAll("'", "''")}'`; }
function nullable(value) { return value == null ? 'NULL' : q(value); }
function json(value) { return q(JSON.stringify(value)); }
function fail(message) { console.error(`[structured-content] ${message}`); process.exit(1); }
