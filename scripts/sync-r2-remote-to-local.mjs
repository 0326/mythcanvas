#!/usr/bin/env node
/**
 * sync-r2-remote-to-local.mjs
 *
 * 将 Cloudflare 远程 R2 bucket `mythcanvas-artworks` 的所有对象同步到
 * 本地 miniflare 模拟的同名 bucket。这样 `npm run dev:local`（不依赖远程
 * preview session）看到的图就和 mythcanvas.space 一模一样。
 *
 * 用法（在仓库根目录）：
 *   node scripts/sync-r2-remote-to-local.mjs            # 同步所有对象
 *   node scripts/sync-r2-remote-to-local.mjs --dry-run  # 只打印将同步的对象
 *
 * 同步策略：
 *   - 先通过 Cloudflare REST API 拉取远程 bucket 完整对象清单（分页直到穷尽 cursor）。
 *   - 逐个对象：
 *       `wrangler r2 object get <bucket>/<key> --remote --file <tmp>`
 *       `wrangler r2 object put <bucket>/<key> --local  --file <tmp> --content-type <mime> --cache-control "public, max-age=31536000, immutable"`
 *   - Content-Type 优先使用 list 返回的对象 httpMetadata.contentType，缺失时按扩展名推断。
 *
 * 注意：需要本地已经 `wrangler login`（脚本会自动读
 *   ~/Library/Preferences/.wrangler/config/default.toml 的 oauth_token，
 *   或从环境变量 CLOUDFLARE_API_TOKEN / CF_API_TOKEN 取一个 API Token）。
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

// ---- Config --------------------------------------------------------------
const ACCOUNT_ID = '0928e7f3802b02dd2c0d7433715f0d0f';
const BUCKET_NAME = 'mythcanvas-artworks';
const API_BASE = 'https://api.cloudflare.com/client/v4';
const PAGE_SIZE = 1000;
const TMP_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'r2-sync-'));

const DRY_RUN = process.argv.includes('--dry-run');

// ---- Auth ---------------------------------------------------------------
const token = resolveAuthToken();
if (!token) {
  console.error('[ERR] 找不到可用的 Cloudflare 凭证。请先 `npx wrangler login`，或设置 CLOUDFLARE_API_TOKEN。');
  process.exit(1);
}

// ---- Main --------------------------------------------------------------
console.log(`\n🔍 同步 R2 bucket: ${BUCKET_NAME} (remote → local)`);
console.log(`   tmp dir = ${TMP_DIR}`);

// 先尝试走 Cloudflare REST API 拉完整清单；如果 oauth_token 过期/缺少 r2 权限，
// 就降级：从 远程 D1 表（不是本地！因为本地 seed 并没有那些生产导入的新行）
// 收集所有已知 asset_key / portrait / hero_src / home_hero，再逐个 wrangler r2 object get 探测。
const candidates = [];
let fallbackToD1Scan = true;
try {
  const objects = await listAllRemoteObjects();
  if (objects.length > 0) {
    console.log(`   REST API 清单成功：共 ${objects.length} 个对象。`);
    for (const obj of objects) {
      candidates.push({
        key: obj.key,
        contentType: obj.httpMetadata?.contentType ?? undefined,
        sizeBytes: Number(obj.size ?? 0),
        _source: 'api',
      });
    }
    fallbackToD1Scan = false;
  } else {
    console.log('   ℹ  REST API 返回 0 个对象（OAuth token 没有 r2:read 权限常见情况），降级远程 D1 扫描。');
  }
} catch (err) {
  console.log(`   ⚠  REST API 列对象失败（${err?.message ?? err}），改用 远程 D1 + 探测模式。`);
}
if (fallbackToD1Scan) {
  const keys = await collectKeysFromRemoteD1();
  console.log(`   远程 D1 中收集到 ${keys.length} 个候选 key。`);
  for (const k of keys) candidates.push({ key: k, _source: 'remote-d1' });
}

if (!candidates.length) {
  console.log('   没有可同步的候选，直接结束。');
  cleanup();
  process.exit(0);
}

const summary = { ok: 0, skip: 0, fail: 0 };
const total = candidates.length;
let idx = 0;
for (const c of candidates) {
  idx += 1;
  const prefix = `[${String(idx).padStart(String(total).length, ' ')}/${total}]`;
  try {
    const sizeKB = c.sizeBytes ? Math.round(c.sizeBytes / 1024) : '?';
    console.log(`${prefix} ${c.key}  (${sizeKB} KB, ${c.contentType ?? 'detect-by-ext'})`);

    if (DRY_RUN) { summary.skip += 1; continue; }

    const downloaded = await downloadRemote(c.key);
    const contentType = c.contentType ?? mimeForExtension(c.key) ?? downloaded.contentType;
    const cacheControl = 'public, max-age=31536000, immutable';
    uploadLocal(c.key, downloaded.tmp, contentType, cacheControl);
    fs.unlinkSync(downloaded.tmp);
    summary.ok += 1;
  } catch (error) {
    console.error(`${prefix} ✗ 失败: ${error?.message ?? String(error)}`);
    summary.fail += 1;
  }
}

cleanup();
console.log(`\n✅ 同步完成：成功 ${summary.ok}，跳过(DRY_RUN) ${summary.skip}，失败 ${summary.fail}。`);
if (summary.fail) process.exit(2);

// ---- Helpers ------------------------------------------------------------
function resolveAuthToken() {
  if (process.env.CLOUDFLARE_API_TOKEN) return process.env.CLOUDFLARE_API_TOKEN;
  if (process.env.CF_API_TOKEN) return process.env.CF_API_TOKEN;

  const p = path.join(os.homedir(), 'Library/Preferences/.wrangler/config/default.toml');
  if (!fs.existsSync(p)) return undefined;
  const s = fs.readFileSync(p, 'utf8');
  const m = s.match(/oauth_token\s*=\s*"([^"]+)"/);
  return m ? m[1] : undefined;
}

async function listAllRemoteObjects() {
  if (!token) throw new Error('no auth token');
  const results = [];
  let cursor = '';
  let safety = 20;
  while (safety-- > 0) {
    const qs = new URLSearchParams({ per_page: String(PAGE_SIZE) });
    if (cursor) qs.set('cursor', cursor);
    const url = `${API_BASE}/accounts/${ACCOUNT_ID}/r2/buckets/${BUCKET_NAME}/objects?${qs.toString()}`;
    const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const text = await resp.text();
    let data;
    try { data = JSON.parse(text); } catch (e) {
      throw new Error(`listObjects HTTP ${resp.status} invalid JSON: ${text.slice(0, 400)}`);
    }
    if (!data.success) throw new Error(JSON.stringify(data.errors ?? [data.error ?? data]));
    const page = Array.isArray(data.result?.objects) ? data.result.objects : [];
    results.push(...page);
    cursor = data.result?.cursor ?? '';
    if (!cursor || page.length < PAGE_SIZE) break;
  }
  return results;
}

/**
 * 降级方案：因为本地 wrangler oauth_token 的 scope 不一定带 r2 bucket list，
 * 我们直接从本地 D1 中抽取所有可能引用 R2 的 key：
 *   - artworks.asset_key     (总是 /media/<key> 或裸 key)
 *   - characters.portrait_src
 *   - mythologies.hero_src, mythologies.logo_src
 *   - worlds.hero_src
 * 把路径中的 /media/ 前缀剥离，得到 R2 key。
 */
/**
 * 降级方案：因为 wrangler oauth_token 的 scope 不一定带 r2 bucket list 权限
 * （即使有，REST API r2/objects 有时也会在 OAuth 上被拒），
 * 我们直接从 "远程 D1" 中抽取所有引用 R2 的 URL 路径，然后逐个 `wrangler r2 object get --remote`。
 * 为什么必须读 REMOTE D1？之前实测：本地 D1 artworks=6 行，远程 D1 artworks=16 行
 * （差 Athena 5 风格 × PC/mobile 的 10 条新 key），读本地会漏。
 */
async function collectKeysFromRemoteD1() {
  const queries = [
    { remote: true,  sql: `SELECT asset_key AS k FROM artworks WHERE asset_key IS NOT NULL AND asset_key <> ''` },
    { remote: true,  sql: `SELECT portrait_src AS k FROM characters WHERE portrait_src IS NOT NULL AND portrait_src <> ''` },
    { remote: true,  sql: `SELECT hero_src AS k FROM mythologies WHERE hero_src IS NOT NULL AND hero_src <> ''` },
    { remote: true,  sql: `SELECT home_hero_light_src AS k FROM mythologies WHERE home_hero_light_src IS NOT NULL AND home_hero_light_src <> ''` },
    { remote: true,  sql: `SELECT home_hero_dark_src AS k FROM mythologies WHERE home_hero_dark_src IS NOT NULL AND home_hero_dark_src <> ''` },
    { remote: true,  sql: `SELECT hero_src AS k FROM worlds WHERE hero_src IS NOT NULL AND hero_src <> ''` },
  ];
  const keys = new Set();
  for (const q of queries) {
    const rows = await wranglerD1Json(q.sql, q.remote);
    for (const r of rows) {
      if (!r.k) continue;
      keys.add(normalizeR2Key(String(r.k)));
    }
  }

  // 兜底：public/art/ 老路径对应的 content/* 迁移后对象，即使 D1 里暂时没引用也同步过来。
  const artDir = new URL('../public/art/', import.meta.url);
  for (const name of await fs.promises.readdir(artDir).catch(() => [])) {
    keys.add(`content/${name}`);
  }
  return [...keys].sort();
}

async function wranglerD1Json(sql, remote = false) {
  const baseArgs = [
    'd1', 'execute', 'mythcanvas-db',
    '--json',
    remote ? '--remote' : '--local',
    '--command', sql,
  ];
  // 偶发的 "fetch failed" 在 D1 --remote 通过公司代理时随机出现，重试 3 次通常能过。
  let lastErr = null;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const res = runWrangler(baseArgs);
    try {
      const parsed = JSON.parse(res.stdout);
      if (Array.isArray(parsed) && parsed[0]?.success === true) return parsed[0].results ?? [];
      lastErr = new Error(`D1 JSON success=false (attempt=${attempt}) result=${JSON.stringify(parsed?.[0]?.errors ?? parsed?.error ?? '').slice(0, 400)}`);
    } catch (parseErr) {
      lastErr = new Error(`D1 query parse/network failed (remote=${remote} attempt=${attempt} status=${res.status}): stderr=${res.stderr.slice(0, 400)} stdout=${res.stdout.slice(0, 200)}`);
    }
  }
  throw lastErr ?? new Error(`D1 query failed without details`);
}

/**
 * 统一把 URL 路径 (如 /media/content/x.jpg、media/characters/athena/canonical_m_01.png)
 * 变成 R2 bucket 里真正的 key (第一个 media/ 前缀由 [media/[...key]] 路由剥掉)。
 */
function normalizeR2Key(p) {
  let k = String(p).trim();
  if (k.startsWith('/')) k = k.slice(1);
  if (k.startsWith('media/')) k = k.slice('media/'.length);
  return k;
}

async function downloadRemote(key) {
  const sanitized = key.replaceAll('/', '__').replaceAll(/[^A-Za-z0-9._-]+/g, '_');
  const tmp = path.join(TMP_DIR, `${Date.now()}_${sanitized}`);
  // 注意：Wrangler 4.88 不支持 `r2 object get --force`，--force 是 put 专用的（之前传进去会导致 CLI 参数解析失败、并打印 help）。
  const args = [
    'r2', 'object', 'get', `${BUCKET_NAME}/${key}`,
    '--file', tmp,
    '--remote',
  ];
  // wrangler 4.88 的 r2 get 有时会在下载完成后仍抛 "terminated" ERROR，
  // 实际文件是完好非空的（刚才实测 143759 字节 canonical_pc_01.png）。
  // 所以不能简单用 exit code 判断，只能以 "是否存在+非空" 为成功标准。
  // 最多重试 3 次（偶发网络 "fetch failed" 需要重试）。
  let lastErr = null;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try { fs.unlinkSync(tmp); } catch { /* ignore */ }
    const res = runWrangler(args);
    if (fs.existsSync(tmp)) {
      const stat = fs.statSync(tmp);
      if (stat.size > 0) return { tmp };
      fs.unlinkSync(tmp);
      lastErr = new Error(`下载结果为空文件（尝试 ${attempt}，对象可能不存在？）`);
    } else {
      lastErr = new Error(`未生成文件 (attempt=${attempt}, status=${res.status}) stderr=${res.stderr.slice(0, 300)}`);
    }
  }
  throw lastErr ?? new Error(`下载 ${key} 失败`);
}

function uploadLocal(key, file, contentType, cacheControl) {
  // put 的 --force / -y 是 "Skip data catalog validation prompt"，非破坏性校验，默认就开。
  const args = [
    'r2', 'object', 'put', `${BUCKET_NAME}/${key}`,
    '--file', file,
    '--content-type', contentType,
    '--cache-control', cacheControl,
    '--local',
    '-y',
  ];
  runWrangler(args);
  // 校验：本地刚 put 好的对象再 get 一遍，非空才算成功。
  const check = path.join(TMP_DIR, `check-${Date.now()}`);
  runWrangler([
    'r2', 'object', 'get', `${BUCKET_NAME}/${key}`,
    '--file', check,
    '--local',
  ]);
  if (!fs.existsSync(check) || fs.statSync(check).size === 0) {
    throw new Error(`本地 R2 put 校验失败：get 后文件为空/不存在`);
  }
  try { fs.unlinkSync(check); } catch { /* ignore */ }
}

function runWrangler(wranglerArgs) {
  const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const result = spawnSync(npx, ['wrangler', ...wranglerArgs], {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 5 * 60 * 1000,
  });
  if (result.error) throw result.error;
  const rawStderr = (result.stderr ?? '').trim();
  // Wrangler 会把 "Proxy environment variables detected." 这类 WARNING 写到 stderr，
  // 并不意味着命令失败。这里分离 warning 行与真·错误行。
  const stderrLines = rawStderr.split('\n').map(l => l.replace(/^\s*▲\s*\[WARNING\]\s*/, '').trimEnd());
  const realErrorLines = stderrLines.filter(l => l && !/Proxy environment variables detected\./.test(l));
  return {
    status: result.status ?? -1,
    stdout: result.stdout ?? '',
    stderr: rawStderr,
    realErrorLines,
  };
}

async function d1Query(sql) {
  const res = runWrangler([
    'd1', 'execute', 'mythcanvas-db',
    '--json',
    '--command', sql,
  ]);
  // 如果 stdout 是合法 JSON 且成功标志为 true，就优先当作成功（wrangler 常把 warning 弄到 stderr）
  try {
    const parsed = JSON.parse(res.stdout);
    if (Array.isArray(parsed) && parsed[0]?.success === true) return parsed[0].results ?? [];
  } catch { /* ignore, fallback to status check */ }
  if (res.status !== 0 || res.realErrorLines.length) {
    throw new Error(`D1 query failed (status=${res.status}): ${res.stderr.slice(0, 400)}`);
  }
  const parsed = JSON.parse(res.stdout);
  return parsed?.[0]?.results ?? [];
}

function mimeForExtension(key) {
  const ext = key.split('.').pop()?.toLowerCase();
  const map = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
    webp: 'image/webp', avif: 'image/avif', svg: 'image/svg+xml',
    gif: 'image/gif', webmanifest: 'application/manifest+json',
  };
  return map[ext ?? ''] ?? 'application/octet-stream';
}

function cleanup() {
  try { fs.rmSync(TMP_DIR, { recursive: true, force: true }); } catch { /* ignore */ }
}
