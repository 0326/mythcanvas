#!/usr/bin/env node

/**
 * Read-only readiness audit for the Norse structured-content mirror.
 *
 * This command deliberately never applies migrations or writes to D1. By
 * default it compares the remote schema/data counts; --local runs the same
 * read-only contract against the local D1 mirror.
 *
 * Examples:
 *   npm run content:remote:audit
 *   npm run content:remote:audit -- --schema-only --strict
 *   npm run content:remote:audit -- --strict --write reports/norse-remote-d1-audit.json
 *   npm run content:remote:audit -- --local --strict
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const ROOT = process.cwd();
const DB_NAME = 'mythcanvas-db';
const MYTHOLOGY_ID = 'myth-norse';
const strict = process.argv.includes('--strict');
const schemaOnly = process.argv.includes('--schema-only');
const local = process.argv.includes('--local');
const targetFlag = local ? '--local' : '--remote';
const targetName = local ? 'local' : 'remote';
const writeIndex = process.argv.indexOf('--write');
const writePath = writeIndex >= 0 ? process.argv[writeIndex + 1] : undefined;

if (writeIndex >= 0 && !writePath) fail('--write needs a destination path.');

const moduleCache = new Map();
const staticPackage = loadStaticPackage();
const tables = new Set((query("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name") ?? []).map((row) => String(row.name)));
const appliedMigrations = query('SELECT id, name, applied_at FROM d1_migrations ORDER BY id, name') ?? [];
const requiredMigrations = [
  '0039_structured_content_objects_and_sources.sql',
  '0040_taxonomy_semantic_kind.sql',
  '0041_character_relation_pursues_type.sql',
];

const requiredTables = ['mythic_objects', 'content_relations'];
const requiredColumns = {
  content_sources: ['source_family', 'evidence_roles_json', 'manuscript_context', 'region'],
  taxonomy_terms: ['semantic_kind'],
};
const schema = Object.fromEntries(Object.entries(requiredColumns).map(([table, columns]) => [
  table,
  {
    exists: tables.has(table),
    columns: tables.has(table) ? new Set((query(`PRAGMA table_info(${table})`) ?? []).map((row) => String(row.name))) : new Set(),
    required: columns,
  },
]));

const relationTypes = tables.has('character_relations')
  ? new Set((query('SELECT DISTINCT relation_type FROM character_relations ORDER BY relation_type') ?? []).map((row) => String(row.relation_type)))
  : new Set();

const expectedCounts = {
  characters: staticPackage.characters.length,
  worlds: staticPackage.worlds.length,
  scenes: staticPackage.scenes.length,
  mythicObjects: staticPackage.objects.length,
  contentRelations: staticPackage.contentRelations.length,
  sources: staticPackage.sources.length,
  concepts: staticPackage.concepts.length,
  characterNames: staticPackage.names.length,
  characterInterpretations: staticPackage.interpretations.length,
  contentClaims: uniqueRecords([...staticPackage.claims, ...staticPackage.stories.flatMap((story) => story.claims ?? [])]).length,
  characterRelations: staticPackage.relations.length,
};

// A schema-only preflight must remain useful before structured content is
// imported. Do not query entity tables in that mode: a missing/empty content
// table is a data-stage issue, not a migration-stage failure.
const remoteCounts = schemaOnly ? null : {
  characters: countIfTable('characters', "SELECT COUNT(*) AS count FROM characters WHERE mythology_id = 'myth-norse'"),
  worlds: countIfTable('worlds', "SELECT COUNT(*) AS count FROM worlds WHERE mythology_id = 'myth-norse'"),
  scenes: countIfTable('scenes', "SELECT COUNT(*) AS count FROM scenes WHERE mythology_id = 'myth-norse'"),
  mythicObjects: countIfTable('mythic_objects', "SELECT COUNT(*) AS count FROM mythic_objects WHERE mythology_id = 'myth-norse'"),
  contentRelations: countIfTable('content_relations', "SELECT COUNT(*) AS count FROM content_relations WHERE mythology_id = 'myth-norse'"),
  sources: countIfTable('content_sources', "SELECT COUNT(*) AS count FROM content_sources WHERE mythology_id = 'myth-norse'"),
  concepts: countIfTable('content_concepts', "SELECT COUNT(*) AS count FROM content_concepts WHERE mythology_id = 'myth-norse'"),
  characterNames: countIfTables(['character_names', 'characters'], "SELECT COUNT(*) AS count FROM character_names WHERE character_id IN (SELECT id FROM characters WHERE mythology_id = 'myth-norse')"),
  characterInterpretations: countIfTables(['character_interpretations', 'characters'], "SELECT COUNT(*) AS count FROM character_interpretations WHERE character_id IN (SELECT id FROM characters WHERE mythology_id = 'myth-norse')"),
  contentClaims: countIfTable('content_claims', "SELECT COUNT(*) AS count FROM content_claims WHERE mythology_id = 'myth-norse'"),
  characterRelations: countIfTables(['character_relations', 'characters'], "SELECT COUNT(*) AS count FROM character_relations WHERE from_character_id IN (SELECT id FROM characters WHERE mythology_id = 'myth-norse')"),
};

const expectedIds = {
  characters: new Set(staticPackage.characters.map((item) => item.id)),
  worlds: new Set(staticPackage.worlds.map((item) => item.id)),
  scenes: new Set(staticPackage.scenes.map((item) => item.id)),
  mythicObjects: new Set(staticPackage.objects.map((item) => item.id)),
  contentRelations: new Set(staticPackage.contentRelations.map((item) => item.id)),
  sources: new Set(staticPackage.sources.map((item) => item.sourceId)),
  concepts: new Set(staticPackage.concepts.map((item) => item.id)),
  characterNames: new Set(staticPackage.names.map((item) => item.id)),
  characterInterpretations: new Set(staticPackage.interpretations.map((item) => item.id)),
  contentClaims: new Set(uniqueRecords([...staticPackage.claims, ...staticPackage.stories.flatMap((story) => story.claims ?? [])]).map((item) => item.id)),
  characterRelations: new Set(staticPackage.relations.map((item) => item.id)),
};

const remoteIds = schemaOnly ? null : {
  characters: idsIfTable('characters', "SELECT id FROM characters WHERE mythology_id = 'myth-norse'"),
  worlds: idsIfTable('worlds', "SELECT id FROM worlds WHERE mythology_id = 'myth-norse'"),
  scenes: idsIfTable('scenes', "SELECT id FROM scenes WHERE mythology_id = 'myth-norse'"),
  mythicObjects: idsIfTable('mythic_objects', "SELECT id FROM mythic_objects WHERE mythology_id = 'myth-norse'"),
  contentRelations: idsIfTable('content_relations', "SELECT id FROM content_relations WHERE mythology_id = 'myth-norse'"),
  sources: idsIfTable('content_sources', "SELECT id FROM content_sources WHERE mythology_id = 'myth-norse'"),
  concepts: idsIfTable('content_concepts', "SELECT id FROM content_concepts WHERE mythology_id = 'myth-norse'"),
  characterNames: idsIfTables(['character_names', 'characters'], "SELECT names.id FROM character_names AS names JOIN characters AS c ON c.id = names.character_id WHERE c.mythology_id = 'myth-norse'"),
  characterInterpretations: idsIfTables(['character_interpretations', 'characters'], "SELECT interpretations.id FROM character_interpretations AS interpretations JOIN characters AS c ON c.id = interpretations.character_id WHERE c.mythology_id = 'myth-norse'"),
  contentClaims: idsIfTable('content_claims', "SELECT id FROM content_claims WHERE mythology_id = 'myth-norse'"),
  characterRelations: idsIfTables(['character_relations', 'characters'], "SELECT relation.id FROM character_relations AS relation WHERE relation.from_character_id IN (SELECT id FROM characters WHERE mythology_id = 'myth-norse')"),
};

const remoteCharacterIds = remoteIds?.characters ?? new Set();
const remoteConceptIds = remoteIds?.concepts ?? new Set();
const remoteInterpretationIds = remoteIds?.characterInterpretations ?? new Set();
const characterRelationEndpointIssues = !schemaOnly && tables.has('character_relations')
  ? query("SELECT id, from_character_id, to_character_id, to_concept_id, from_interpretation_id, to_interpretation_id FROM character_relations WHERE from_character_id IN (SELECT id FROM characters WHERE mythology_id = 'myth-norse')")
    .flatMap((row) => {
      const issuesForRow = [];
      if (!remoteCharacterIds.has(String(row.from_character_id))) issuesForRow.push({ id: String(row.id), field: 'from_character_id', value: String(row.from_character_id) });
      if (row.to_character_id && !remoteCharacterIds.has(String(row.to_character_id))) issuesForRow.push({ id: String(row.id), field: 'to_character_id', value: String(row.to_character_id) });
      if (row.to_concept_id && !remoteConceptIds.has(String(row.to_concept_id))) issuesForRow.push({ id: String(row.id), field: 'to_concept_id', value: String(row.to_concept_id) });
      if (row.from_interpretation_id && !remoteInterpretationIds.has(String(row.from_interpretation_id))) issuesForRow.push({ id: String(row.id), field: 'from_interpretation_id', value: String(row.from_interpretation_id) });
      if (row.to_interpretation_id && !remoteInterpretationIds.has(String(row.to_interpretation_id))) issuesForRow.push({ id: String(row.id), field: 'to_interpretation_id', value: String(row.to_interpretation_id) });
      return issuesForRow;
    })
  : null;

const staticEndpointIds = {
  character: expectedIds.characters,
  world: expectedIds.worlds,
  scene: expectedIds.scenes,
  story: new Set(staticPackage.stories.map((item) => item.id)),
  'mythic-object': expectedIds.mythicObjects,
  concept: expectedIds.concepts,
};
const contentRelationEndpointIssues = !schemaOnly && tables.has('content_relations')
  ? query("SELECT id, from_type, from_id, to_type, to_id FROM content_relations WHERE mythology_id = 'myth-norse'")
    .flatMap((row) => {
      const issuesForRow = [];
      const fromSet = staticEndpointIds[String(row.from_type)];
      const toSet = staticEndpointIds[String(row.to_type)];
      if (!fromSet?.has(String(row.from_id))) issuesForRow.push({ id: String(row.id), field: 'from_id', type: String(row.from_type), value: String(row.from_id) });
      if (!toSet?.has(String(row.to_id))) issuesForRow.push({ id: String(row.id), field: 'to_id', type: String(row.to_type), value: String(row.to_id) });
      return issuesForRow;
    })
  : null;

const schemaIssues = [];
const appliedNames = new Set(appliedMigrations.map((row) => String(row.name)));
for (const migration of requiredMigrations) {
  if (!appliedNames.has(migration)) schemaIssues.push(`pending migration: ${migration}`);
}
for (const table of requiredTables) {
  if (!tables.has(table)) schemaIssues.push(`missing table: ${table}`);
}
for (const [table, details] of Object.entries(schema)) {
  if (!details.exists) {
    schemaIssues.push(`missing table: ${table}`);
    continue;
  }
  for (const column of details.required) if (!details.columns.has(column)) schemaIssues.push(`missing column: ${table}.${column}`);
}
if (!relationTypes.has('pursues')) schemaIssues.push('missing relation type: character_relations.pursues');

const countIssues = [];
if (remoteCounts) {
  for (const [key, expected] of Object.entries(expectedCounts)) {
    const actual = remoteCounts[key];
    if (actual === null) {
      countIssues.push(`unreadable remote entity: ${key}`);
    } else if (actual !== expected) {
      countIssues.push(`count mismatch: ${key} remote=${actual} expected=${expected}`);
    }
  }
}
const idDiffs = remoteIds
  ? Object.fromEntries(Object.entries(expectedIds).map(([key, expected]) => {
    const actual = remoteIds[key];
    if (actual === null) return [key, null];
    const missing = [...expected].filter((id) => !actual.has(id)).toSorted();
    const extra = [...actual].filter((id) => !expected.has(id)).toSorted();
    return [key, { missing, extra, missingCount: missing.length, extraCount: extra.length }];
  }))
  : null;
const idDiffIssues = idDiffs
  ? Object.entries(idDiffs).flatMap(([key, diff]) => diff === null
    ? [`unreadable remote ids: ${key}`]
    : [
      ...(diff.missing.length ? [`missing remote ids: ${key} (${diff.missing.length})`] : []),
      ...(diff.extra.length ? [`unexpected remote ids: ${key} (${diff.extra.length})`] : []),
    ])
  : [];
const endpointIssues = [
  ...(characterRelationEndpointIssues ?? []).map((item) => `invalid character relation endpoint: ${item.id}.${item.field}=${item.value}`),
  ...(contentRelationEndpointIssues ?? []).map((item) => `invalid content relation endpoint: ${item.id}.${item.field}=${item.type}:${item.value}`),
];
const issues = schemaOnly ? schemaIssues : [...schemaIssues, ...countIssues, ...idDiffIssues, ...endpointIssues];

const report = {
  generatedAt: new Date().toISOString(),
  mode: schemaOnly ? 'schema-only' : 'full',
  target: targetName,
  database: DB_NAME,
  mythologyId: MYTHOLOGY_ID,
  appliedMigrations: appliedMigrations.map((row) => ({ id: Number(row.id), name: String(row.name), appliedAt: row.applied_at ?? null })),
  pendingMigrations: requiredMigrations.filter((migration) => !appliedNames.has(migration)),
  schema: {
    requiredTables: Object.fromEntries(requiredTables.map((table) => [table, tables.has(table)])),
    requiredColumns: Object.fromEntries(Object.entries(schema).map(([table, details]) => [table, {
      exists: details.exists,
      missing: details.required.filter((column) => !details.columns.has(column)),
    }])),
    hasPursuesRelationType: relationTypes.has('pursues'),
  },
  counts: {
    remote: remoteCounts,
    expected: expectedCounts,
  },
  idDiffs,
  relationEndpointIssues: {
    characterRelations: characterRelationEndpointIssues,
    contentRelations: contentRelationEndpointIssues,
  },
  schemaIssues,
  countIssues,
  issues,
  ready: issues.length === 0,
};

if (writePath) {
  const destination = path.resolve(ROOT, writePath);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.error(`Wrote ${path.relative(ROOT, destination)}.`);
}
console.log(JSON.stringify(report, null, 2));

if (strict && issues.length) process.exit(2);

function count(sql) {
  return Number(query(sql)?.[0]?.count ?? 0);
}

function countIfTable(table, sql) {
  return tables.has(table) ? count(sql) : null;
}

function countIfTables(requiredTables, sql) {
  return requiredTables.every((table) => tables.has(table)) ? count(sql) : null;
}

function ids(sql) {
  return new Set(query(sql).map((row) => String(row.id)));
}

function idsIfTable(table, sql) {
  return tables.has(table) ? ids(sql) : null;
}

function idsIfTables(requiredTables, sql) {
  return requiredTables.every((table) => tables.has(table)) ? ids(sql) : null;
}

function uniqueRecords(records) {
  return [...new Map(records.map((record) => [record.id, record])).values()];
}

function query(sql) {
  const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  let stdout = '';
  try {
    stdout = execFileSync(npx, ['wrangler', 'd1', 'execute', DB_NAME, targetFlag, '--command', sql, '--json'], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (error) {
    const details = [error?.stderr, error?.stdout, error?.message].filter(Boolean).join('\n');
    fail(`${targetName} D1 query failed: ${details.slice(0, 800)}`);
  }
  let payload;
  try {
    payload = JSON.parse(stdout);
  } catch (error) {
    fail(`${targetName} D1 returned invalid JSON: ${error.message}`);
  }
  const result = payload.find((item) => item?.success === true);
  if (!result) fail(`${targetName} D1 query was not successful: ${stdout.slice(0, 800)}`);
  return Array.isArray(result.results) ? result.results : [];
}

function loadStaticPackage() {
  const catalog = loadTsModule('src/content/norse/catalog.ts');
  const objects = loadTsModule('src/content/norse/objects.ts');
  const sources = loadTsModule('src/content/norse/sources.ts');
  const identities = loadTsModule('src/content/norse/identities.ts');
  const stories = loadTsModule('src/content/norse/stories.ts');
  return {
    characters: catalog.norseCharacters ?? [],
    worlds: catalog.norseWorlds ?? [],
    scenes: catalog.norseScenes ?? [],
    relations: catalog.norseRelations ?? [],
    concepts: catalog.norseConcepts ?? [],
    objects: objects.norseMythicObjects ?? [],
    contentRelations: objects.norseContentRelations ?? [],
    sources: sources.norseSources ?? [],
    names: identities.norseNames ?? [],
    interpretations: identities.norseInterpretations ?? [],
    claims: identities.norseClaims ?? [],
    stories: stories.norseStories ?? [],
  };
}

function loadTsModule(relativePath) {
  const absolutePath = path.resolve(ROOT, relativePath);
  if (moduleCache.has(absolutePath)) return moduleCache.get(absolutePath);
  const source = fs.readFileSync(absolutePath, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    fileName: absolutePath,
  }).outputText;
  const module = { exports: {} };
  moduleCache.set(absolutePath, module.exports);
  const require = (specifier) => {
    if (!specifier.startsWith('.')) throw new Error(`Static package ${relativePath} may only use relative runtime imports; found ${specifier}.`);
    const imported = path.resolve(path.dirname(absolutePath), `${specifier}.ts`);
    return loadTsModule(path.relative(ROOT, imported));
  };
  new Function('exports', 'module', 'require', '__filename', '__dirname', output)(module.exports, module, require, absolutePath, path.dirname(absolutePath));
  return module.exports;
}

function fail(message) {
  const cleanMessage = String(message)
    .replace(/\u001b\[[0-?]*[ -/]*[@-~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 1200);
  console.error(`[norse-remote-audit] ${cleanMessage}`);
  if (writePath) {
    const destination = path.resolve(ROOT, writePath);
    const unavailable = {
      generatedAt: new Date().toISOString(),
      mode: schemaOnly ? 'schema-only' : 'full',
      target: targetName,
      database: DB_NAME,
      mythologyId: MYTHOLOGY_ID,
      status: 'unavailable',
      ready: false,
      issues: [cleanMessage],
    };
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, `${JSON.stringify(unavailable, null, 2)}\n`, 'utf8');
    console.error(`Wrote unavailable audit report ${path.relative(ROOT, destination)}.`);
  }
  process.exit(1);
}
