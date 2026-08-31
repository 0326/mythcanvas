#!/usr/bin/env node

/**
 * Audit the public-facing artwork/story data for prototype provenance.
 *
 * The old prototype label was useful during the MVP, but it must never leak
 * into a published page. This audit is intentionally runnable without a D1
 * connection; pass --local or --remote to include the corresponding D1 check.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const ROOT = process.cwd();
const strict = process.argv.includes('--strict');
const d1Mode = process.argv.includes('--local') ? '--local' : process.argv.includes('--remote') ? '--remote' : undefined;

const runtimeRoots = [path.join(ROOT, 'src', 'data'), path.join(ROOT, 'src', 'content')];
const sourceFiles = walk(runtimeRoots).filter((file) => /\.(?:ts|astro)$/.test(file));
const forbidden = [
  /prototypeProvenance/i,
  /prototypeLicense/i,
  /internal prototype asset/i,
  /sourceType\s*:\s*['"]prototype['"]/i,
  /source_type\s*=\s*['"]prototype['"]/i,
];
const findings = [];

for (const file of sourceFiles) {
  const source = fs.readFileSync(file, 'utf8');
  for (const pattern of forbidden) {
    if (pattern.test(source)) findings.push(`${path.relative(ROOT, file)} matches ${pattern}`);
  }
}

const storyModule = loadStoryIllustrations();
const storyAssets = Array.isArray(storyModule.storyIllustrations) ? storyModule.storyIllustrations : [];
const incompleteStoryAssets = storyAssets
  .filter((asset) => {
    const provenance = asset?.provenance ?? {};
    return !asset?.image?.src || !asset?.image?.alt || !asset?.image?.width || !asset?.image?.height
      || !provenance.sourceType || !provenance.creator || !provenance.licenseName
      || provenance.sourceType === 'prototype';
  })
  .map((asset) => String(asset?.id ?? '<unknown>'));

if (incompleteStoryAssets.length) {
  findings.push(`story illustrations with incomplete/forbidden provenance: ${incompleteStoryAssets.join(', ')}`);
}

console.log('Prototype provenance audit');
console.log(`Static public data: ${findings.length === 0 ? 'clean' : `${findings.length} finding(s)`}`);
console.log(`Story illustrations checked: ${storyAssets.length}`);
if (findings.length) findings.forEach((finding) => console.log(`- ${finding}`));

if (d1Mode) {
  const query = `SELECT
    (SELECT COUNT(*) FROM artworks WHERE source_type = 'prototype') AS prototype_artworks,
    (SELECT COUNT(*) FROM artworks WHERE publish_status = 'published' AND (source_type IS NULL OR license IS NULL OR license = '' OR creator IS NULL OR creator = '')) AS incomplete_public_artworks;`;
  const result = spawnSync('npx', ['wrangler', 'd1', 'execute', 'mythcanvas-db', d1Mode, '--command', query, '--json'], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (result.status !== 0) {
    console.error(result.stderr || result.stdout || 'Wrangler D1 query failed.');
    process.exit(result.status ?? 1);
  }
  const payload = JSON.parse(result.stdout);
  const row = payload.flatMap((item) => Array.isArray(item?.results) ? item.results : [])[0] ?? {};
  const prototypeArtworks = Number(row.prototype_artworks ?? 0);
  const incompletePublicArtworks = Number(row.incomplete_public_artworks ?? 0);
  console.log(`D1 ${d1Mode === '--local' ? 'local' : 'remote'}: ${prototypeArtworks} prototype artwork(s), ${incompletePublicArtworks} incomplete public artwork(s)`);
  if (prototypeArtworks || incompletePublicArtworks) {
    findings.push(`D1 ${d1Mode} has ${prototypeArtworks} prototype and ${incompletePublicArtworks} incomplete public artwork record(s)`);
  }
} else {
  console.log('D1 check skipped (pass --local or --remote when a database audit is needed).');
}

if (strict && findings.length) process.exit(2);

function walk(roots) {
  const files = [];
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
      const target = path.join(root, entry.name);
      if (entry.isDirectory()) files.push(...walk([target]));
      else files.push(target);
    }
  }
  return files;
}

function loadStoryIllustrations() {
  const absolutePath = path.join(ROOT, 'src', 'data', 'story-illustrations.ts');
  const source = fs.readFileSync(absolutePath, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    fileName: absolutePath,
  }).outputText;
  const module = { exports: {} };
  const require = (specifier) => {
    throw new Error(`Story illustration data may only use type-only imports; found runtime import ${specifier}.`);
  };
  new Function('exports', 'module', 'require', '__filename', '__dirname', output)(module.exports, module, require, absolutePath, path.dirname(absolutePath));
  return module.exports;
}
