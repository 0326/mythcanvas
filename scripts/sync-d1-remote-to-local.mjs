#!/usr/bin/env node
/**
 * sync-d1-remote-to-local.mjs
 *
 * 把远程 D1 (mythcanvas-db) 里会影响 UI 的几张表，以「远程数据为准、覆盖写入本地」的方式同步过来。
 * 目前覆盖：artworks / artwork_characters / artwork_worlds / artwork_mythologies / artwork_styles / styles / characters(portrait 字段)。
 * 不动：characters 基础元数据（name/description/slug/canonical_design 等）、mythologies、worlds、users、AI 生成会话表。
 *
 * 用法：
 *   node scripts/sync-d1-remote-to-local.mjs            # 真正同步
 *   node scripts/sync-d1-remote-to-local.mjs --dry-run  # 只打印 SQL，不写入
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const DRY_RUN = process.argv.includes('--dry-run');

function runWrangler(wranglerArgs) {
  const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const result = spawnSync(npx, ['wrangler', ...wranglerArgs], {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 5 * 60 * 1000,
  });
  if (result.error) throw result.error;
  return { status: result.status ?? -1, stdout: result.stdout ?? '', stderr: (result.stderr ?? '').trim() };
}

/** 执行 wrangler d1 execute <db> --remote/--local --json --command 并拿到 results[] */
function d1(sql, remote) {
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const res = runWrangler([
      'd1', 'execute', 'mythcanvas-db',
      '--json',
      remote ? '--remote' : '--local',
      '--command', sql,
    ]);
    try {
      const parsed = JSON.parse(res.stdout);
      if (Array.isArray(parsed) && parsed[0]?.success === true) return parsed[0].results ?? [];
    } catch { /* ignore */ }
    if (attempt === 5) throw new Error(`D1 query failed remote=${remote} status=${res.status}: ${res.stderr.slice(0, 300)} stdout=${res.stdout.slice(0, 400)}`);
    // 偶发 API "fetch failed"：sleep 1.5s 再试
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1500);
  }
  return [];
}

/** 用 sqlite 的 UPSERT 语义写本地：INSERT ... ON CONFLICT(id) DO UPDATE SET col=excluded.col */
function buildUpsert(table, rows, pk = 'id') {
  if (!rows.length) return '';
  const cols = Object.keys(rows[0]);
  const valuesSql = rows.map(r => `(${cols.map(c => sqlLiteral(r[c])).join(', ')})`).join(',\n    ');
  const setCols = cols.filter(c => c !== pk);
  const setSql = setCols.map(c => `${c}=excluded.${c}`).join(', ');
  return `INSERT INTO ${table} (${cols.join(', ')}) VALUES
    ${valuesSql}
  ON CONFLICT (${pk}) DO UPDATE SET ${setSql};`;
}

function sqlLiteral(v) {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'boolean') return v ? '1' : '0';
  if (typeof v === 'number') return String(v);
  // 字符串/日期：简单转义
  const s = String(v).replace(/'/g, "''");
  return `'${s}'`;
}

async function main() {
  console.log(`\n🛰  D1 同步：远程 → 本地${DRY_RUN ? '（DRY-RUN：只生成 SQL 不写入）' : ''}`);

  // 1) 先取列名，避免假设 schema — 以后新增列也能自动跟上
  const remoteCols = (table) => d1(`PRAGMA table_info(${table});`, true).map(c => c.name);
  const pick = (row, cols) => Object.fromEntries(cols.map(c => [c, row[c] ?? null]));

  const plan = [
    { table: 'styles',             pk: 'id' },
    { table: 'artworks',           pk: 'id' },
    { table: 'artwork_characters', pk: ['artwork_id', 'character_id'] },
  ];

  const statements = [];
  // 2) characters 表：本地 mythology_id 是 NOT NULL，直接 INSERT … ON CONFLICT DO UPDATE 会因为缺 mythology_id 炸。
  //    SQLite 3.33 才有 UPDATE … FROM，D1 本地兼容层也经常不支持。改为 1 character 1 UPDATE，
  //    只改 portrait_src/portrait_alt/portrait_width/portrait_height 四列。
  {
    const cols = ['id', 'portrait_src', 'portrait_alt', 'portrait_width', 'portrait_height'];
    const rows = d1(`SELECT ${cols.join(',')} FROM characters WHERE portrait_src IS NOT NULL;`, true);
    for (const r of rows) {
      statements.push(`UPDATE characters SET
  portrait_src=${sqlLiteral(r.portrait_src)},
  portrait_alt=${sqlLiteral(r.portrait_alt)},
  portrait_width=CAST(${sqlLiteral(r.portrait_width)} AS INTEGER),
  portrait_height=CAST(${sqlLiteral(r.portrait_height)} AS INTEGER)
WHERE id=${sqlLiteral(r.id)};`);
    }
  }

  for (const item of plan) {
    const cols = remoteCols(item.table);
    const q = item.filter ? `SELECT * FROM ${item.table} WHERE ${item.filter}` : `SELECT * FROM ${item.table}`;
    const rows = d1(q, true).map(r => pick(r, cols));
    console.log(`   · ${item.table}: 远程 ${rows.length} 行`);
    if (!rows.length) continue;

    if (Array.isArray(item.pk)) {
      // 复合主键：远端比本地少列（目前 artwork_characters 就少 relation/created_at），
      // 先把 cols 交集求出来，再做 UPSERT。如果远端有本地没有的列，写之前先 ALTER TABLE ADD COLUMN。
      const localCols = d1(`PRAGMA table_info(${item.table});`, false).map(c => c.name);
      const onlyRemote = cols.filter(c => !localCols.includes(c));
      if (onlyRemote.length) {
        statements.push(`-- 补齐 ${item.table} 远程多出来的列：${onlyRemote.join(', ')}
${onlyRemote.map(c => `ALTER TABLE ${item.table} ADD COLUMN ${c} TEXT;`).join('\n')}`);
        for (const c of onlyRemote) localCols.push(c);
      }
      const shared = localCols;
      const nonPK = shared.filter(c => !item.pk.includes(c));
      const valuesSql = rows.map(r => `(${shared.map(c => sqlLiteral(r[c] ?? null)).join(',')})`).join(',\n    ');
      const setSql = nonPK.length
        ? nonPK.map(c => `${c}=excluded.${c}`).join(', ')
        : `${item.pk[0]}=excluded.${item.pk[0]}`; // 无更新列时做无副作用占位更新
      statements.push(`INSERT INTO ${item.table} (${shared.join(',')}) VALUES
    ${valuesSql}
ON CONFLICT (${item.pk.join(',')}) DO UPDATE SET ${setSql};`);
    } else {
      // 单主键表：先求本地缺的列 ALTER，再 INSERT ON CONFLICT。
      const localCols = d1(`PRAGMA table_info(${item.table});`, false).map(c => c.name);
      const onlyRemote = cols.filter(c => !localCols.includes(c));
      if (onlyRemote.length) {
        statements.push(`-- 补齐 ${item.table} 远程多出来的列：${onlyRemote.join(', ')}
${onlyRemote.map(c => `ALTER TABLE ${item.table} ADD COLUMN ${c} TEXT;`).join('\n')}`);
      }
      const mergedCols = [...localCols, ...onlyRemote];
      statements.push(buildUpsert(item.table, rows.map(r => {
        const out = {};
        for (const c of mergedCols) out[c] = (cols.includes(c) ? r[c] : null) ?? null;
        return out;
      }), item.pk));
    }
  }

  const sql = `PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
${statements.join('\n\n')}
COMMIT;
PRAGMA foreign_keys=ON;
`;
  const sqlPath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'd1-sync-')), 'apply.sql');
  fs.writeFileSync(sqlPath, sql, 'utf8');

  console.log(`\n   生成 SQL: ${sqlPath}
   行数（statements）: ${statements.length}`);
  if (DRY_RUN) {
    console.log('--- SQL preview (last 60 lines) ---');
    console.log(sql.split('\n').slice(-60).join('\n'));
    return;
  }
  const segments = sql
    .split(/;\n/)
    .map(s => s
      .split('\n')
      .filter(line => !/^\s*--/.test(line)) // 移除 SQL 注释行（wrangler d1 execute --command 会把 "-- 中文字符" 当成未知 CLI 参数）
      .join('\n')
      .trim())
    .filter(Boolean)
    .map(s => s.endsWith(';') ? s : s + ';')
    // PRAGMA / BEGIN / COMMIT 对 wrangler d1 execute 来说每次是独立连接，因此它们没实际语义，直接跳过。
    .filter(s => !/^PRAGMA\s/i.test(s))
    .filter(s => !/^BEGIN\s/i.test(s))
    .filter(s => !/^COMMIT\s*;?$/i.test(s));
  let i = 0;
  let passed = 0;
  let failed = 0;
  for (const seg of segments) {
    i += 1;
    if (!seg || /^;$/.test(seg)) continue;
    const res = runWrangler([
      'd1', 'execute', 'mythcanvas-db',
      '--local',
      '--json',
      '--command', seg,
    ]);
    let ok = false;
    try {
      const parsed = JSON.parse(res.stdout);
      ok = Array.isArray(parsed) && parsed[0]?.success === true;
    } catch { /* ignore */ }
    if (!ok) {
      failed += 1;
      console.error(`✗ 段 ${i}/${segments.length} 失败: stderr=${res.stderr.slice(0, 300)}`);
      console.error('  SQL (head):', seg.slice(0, 240).replace(/\s+/g, ' '));
    } else {
      passed += 1;
    }
  }
  console.log(`✅ D1 同步完成：${passed}/${segments.length} 段成功写入本地 D1。失败: ${failed}`);
  if (failed) process.exit(2);

  // 最后做一次关键计数对比
  const finalCount = (table, where = '') => {
    const sql2 = `SELECT COUNT(*) c FROM ${table}${where ? ` WHERE ${where}` : ''}`;
    const r = d1(sql2, false)[0].c;
    return r;
  };
  console.log('\n📊 本地 D1 当前计数：');
  console.log('   characters.portrait 非空 =', finalCount('characters', "portrait_src IS NOT NULL"), '(之前 5)');
  console.log('   artworks 总数 =',          finalCount('artworks'),          '(之前 6)');
  console.log('   artwork_characters =',      finalCount('artwork_characters'), '(之前仅 content/* 的关联)');
}

main().catch(e => { console.error('\n[FATAL]', e?.stack ?? e); process.exit(1); });
