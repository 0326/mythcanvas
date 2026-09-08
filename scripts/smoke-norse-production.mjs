#!/usr/bin/env node

/**
 * Read-only HTTP smoke for the deployed Norse public surface.
 *
 * The base URL must be supplied explicitly so this command never guesses a
 * production target or accidentally probes a different environment.
 *
 * Examples:
 *   MYTHCANVAS_SMOKE_BASE_URL=https://example.workers.dev npm run content:smoke:norse
 *   npm run content:smoke:norse -- --base-url https://example.workers.dev --write reports/norse-production-smoke.json
 *   npm run content:smoke:norse -- --base-url https://example.workers.dev --expect-indexable
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const baseUrl = readOption('--base-url') ?? process.env.MYTHCANVAS_SMOKE_BASE_URL;
const writePath = readOption('--write');
const expectIndexable = process.argv.includes('--expect-indexable');
const timeoutMs = Math.max(1000, Number(process.env.MYTHCANVAS_SMOKE_TIMEOUT_MS ?? 15000));
const expectedStoryRobots = expectIndexable ? 'index,follow' : 'noindex,follow';

if (!baseUrl) fail('A target is required. Use --base-url <https-url> or MYTHCANVAS_SMOKE_BASE_URL.');

let target;
try {
  target = new URL(baseUrl);
  if (!['http:', 'https:'].includes(target.protocol)) throw new Error('target must use http or https');
  target.pathname = target.pathname.replace(/\/+$/, '');
} catch (error) {
  fail(`Invalid smoke target: ${error.message}`);
}

const checks = [
  {
    name: 'character page',
    path: '/character/odin/',
    method: 'GET',
    expectedStatus: 200,
    includes: ['<h1', '奥丁', 'rel="canonical"', 'name="description"'],
  },
  {
    name: 'Norse mythology page',
    path: '/mythology/norse/',
    method: 'GET',
    expectedStatus: 200,
    includes: ['<h1', '北欧', 'rel="canonical"', 'name="description"'],
  },
  {
    name: 'representative Story page',
    path: '/mythology/norse/ymir-creation/',
    method: 'GET',
    expectedStatus: 200,
    includes: ['<h1', '尤弥尔', 'rel="canonical"', 'name="description"', `name="robots" content="${expectedStoryRobots}"`],
  },
  {
    name: 'World page',
    path: '/world/asgard/',
    method: 'GET',
    expectedStatus: 200,
    includes: ['<h1', '阿斯加德', 'rel="canonical"', 'name="description"'],
  },
  {
    name: 'Graph API default scope',
    path: '/api/character-graph?character=odin',
    method: 'GET',
    expectedStatus: 200,
    json: (body) => body?.requiresScopeSelection === true,
    jsonFailure: 'default Odin graph must require scope selection when multiple traditions are present',
  },
  {
    name: 'Graph API specified scope',
    path: '/api/character-graph?character=odin&scope=Eddic%20and%20Prose%20Edda%20tradition&depth=1&limit=80',
    method: 'GET',
    expectedStatus: 200,
    json: (body) => Array.isArray(body?.nodes) && body.nodes.length > 0 && Array.isArray(body?.links),
    jsonFailure: 'specified Odin graph must return nodes and links',
  },
  {
    name: 'Graph API unknown character',
    path: '/api/character-graph?character=not-a-norse-character',
    method: 'GET',
    expectedStatus: 404,
    json: (body) => body?.error?.code === 'NOT_FOUND',
    jsonFailure: 'unknown character must return the NOT_FOUND contract',
  },
  {
    name: 'entity sitemap',
    path: '/sitemap-pages.xml?part=entities',
    method: 'GET',
    expectedStatus: 200,
    includes: ['<urlset', 'xmlns', ...(expectIndexable ? ['/mythology/norse/ymir-creation/'] : [])],
    notIncludes: expectIndexable ? [] : ['/mythology/norse/ymir-creation/'],
    contentType: 'application/xml',
  },
  {
    name: 'R2 desktop canonical asset',
    path: '/media/characters/odin/canonical/desktop-wallpaper/canonical_pc_01.png',
    method: 'HEAD',
    expectedStatus: 200,
    contentType: 'image/png',
    cacheControl: 'immutable',
  },
  {
    name: 'R2 mobile canonical asset',
    path: '/media/characters/odin/canonical/mobile-wallpaper/canonical_m_01.png',
    method: 'HEAD',
    expectedStatus: 200,
    contentType: 'image/png',
    cacheControl: 'immutable',
  },
  {
    name: 'Norse World desktop WebP asset',
    path: '/media/content/norse/worlds/norse-asgard-final-v1.webp',
    method: 'HEAD',
    expectedStatus: 200,
    contentType: 'image/webp',
    cacheControl: 'immutable',
  },
  {
    name: 'Norse World mobile WebP asset',
    path: '/media/content/norse/worlds/norse-asgard-mobile-final-v1.webp',
    method: 'HEAD',
    expectedStatus: 200,
    contentType: 'image/webp',
    cacheControl: 'immutable',
  },
  {
    name: 'Norse Story WebP asset',
    path: '/media/content/norse/stories/norse-story-ymir-creation-v1.webp',
    method: 'HEAD',
    expectedStatus: 200,
    contentType: 'image/webp',
    cacheControl: 'immutable',
  },
];

const results = [];
for (const check of checks) results.push(await runCheck(check));

const failed = results.filter((result) => !result.ok);
const report = {
  generatedAt: new Date().toISOString(),
  target: target.toString(),
  status: failed.length ? 'failed' : 'passed',
  timeoutMs,
  expectIndexable,
  expectedStoryRobots,
  checks: results,
  failures: failed.map(({ name, url, error }) => ({ name, url, error })),
};

if (writePath) {
  const destination = path.resolve(root, writePath);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.error(`Wrote ${path.relative(root, destination)}.`);
}

for (const result of results) {
  console.log(`${result.ok ? 'PASS' : 'FAIL'} ${result.name} · ${result.status ?? 'error'} · ${result.url}`);
  if (!result.ok && result.error) console.error(`  ${result.error}`);
}
if (failed.length) process.exitCode = 1;

async function runCheck(check) {
  const url = new URL(check.path, target);
  const startedAt = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { method: check.method, redirect: 'manual', signal: controller.signal });
    const contentType = response.headers.get('content-type') ?? '';
    const cacheControl = response.headers.get('cache-control') ?? '';
    const body = check.method === 'HEAD' ? '' : await response.text();
    let parsed;
    const errors = [];

    if (response.status !== check.expectedStatus) errors.push(`expected HTTP ${check.expectedStatus}, got ${response.status}`);
    for (const expected of check.includes ?? []) if (!body.includes(expected)) errors.push(`response does not contain ${JSON.stringify(expected)}`);
    for (const unexpected of check.notIncludes ?? []) if (body.includes(unexpected)) errors.push(`response unexpectedly contains ${JSON.stringify(unexpected)}`);
    if (check.contentType && !contentType.toLowerCase().startsWith(check.contentType.toLowerCase())) {
      errors.push(`expected content-type ${check.contentType}, got ${contentType || 'missing'}`);
    }
    if (check.cacheControl && !cacheControl.toLowerCase().includes(check.cacheControl.toLowerCase())) {
      errors.push(`cache-control does not contain ${JSON.stringify(check.cacheControl)}`);
    }
    if (check.json) {
      try {
        parsed = JSON.parse(body);
      } catch (error) {
        errors.push(`response is not valid JSON: ${error.message}`);
      }
      if (parsed !== undefined && !check.json(parsed)) errors.push(check.jsonFailure ?? 'JSON contract failed');
    }

    return {
      name: check.name,
      url: url.toString(),
      method: check.method,
      status: response.status,
      ok: errors.length === 0,
      elapsedMs: Date.now() - startedAt,
      contentType,
      cacheControl,
      error: errors.length ? errors.join('; ') : null,
    };
  } catch (error) {
    return {
      name: check.name,
      url: url.toString(),
      method: check.method,
      ok: false,
      elapsedMs: Date.now() - startedAt,
      error: error.name === 'AbortError' ? `request timed out after ${timeoutMs}ms` : error.message,
    };
  } finally {
    clearTimeout(timer);
  }
}

function readOption(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function fail(message) {
  console.error(`[norse-production-smoke] ${message}`);
  process.exit(2);
}
