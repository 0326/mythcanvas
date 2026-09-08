# Norse Remote D1 Read-only Audit

> 审计时间：2026-09-07（Asia/Shanghai）  
> 目标数据库：`mythcanvas-db`  远端 UUID：`b6e7fe36-755c-4ec7-a768-855af0a583d7`

## 结论

远端 D1 在本次成功审计窗口内已恢复只读可访问，但**不能进入 remote import 或 production deploy**：远端只应用到 `0038_english_core_content.sql`，`0039–0041` 尚未应用；当前北欧数据仍是旧镜像，无法满足本次静态内容包和角色神谱 Graph 的运行契约。随后同一 Wrangler 会话再次执行时出现 `10000 Authentication error` / `9109 Invalid access token`，因此下次执行前还需要重新认证。

这不是静态内容质量失败，而是远端 schema / data mirror 尚未追上仓库版本。当前只执行了 `SELECT`、`PRAGMA` 和 migration listing，没有产生远端写入。

## 可复现命令

首选使用仓库内的只读审计命令；它会自动加载当前 Norse 静态包并以严格退出码检查 schema 与计数：

```bash
npx wrangler whoami
npm run content:remote:audit -- --strict --write reports/norse-remote-d1-audit.json
```

若远端认证或网络不可用，命令以非零码退出，并在指定 `--write` 时写出 `status: unavailable` 的报告；该报告不能被解释成 readiness 通过。

`--schema-only` 只读取 `sqlite_master`、`d1_migrations`、必要表结构和关系类型，不查询 Norse 实体计数、ID 或关系端点；因此可以安全地放在 migration 前后使用。完整 `--strict` 才会继续检查数量、精确 ID 集合和关系端点。

若 `whoami` 或 audit 返回 `9109` / `10000`，先完成 Wrangler 重新登录，再重复只读审计；认证失败不能被解释成远端数据通过或失败。

远端迁移前可只检查 schema，避免把尚未 import 的旧计数误当成迁移失败：

```bash
npm run content:remote:audit -- --schema-only --strict
```

同一套只读审计也支持本地 D1，用于在不接触远端的情况下验证 migration/import 产物：

```bash
npm run content:remote:audit -- --local --schema-only --strict
npm run content:remote:audit -- --local --strict
```

报告中的 `target` 会明确标记为 `local` 或 `remote`，不能把本地通过结果解释成生产通过。

也可以直接执行底层只读查询：

```bash
npx wrangler d1 migrations list mythcanvas-db --remote
npx wrangler d1 execute mythcanvas-db --remote \
  --command "SELECT id, name, applied_at FROM d1_migrations ORDER BY id, name" --json
npx wrangler d1 execute mythcanvas-db --remote \
  --command "SELECT name, sql FROM sqlite_master WHERE type = 'table' ORDER BY name" --json
```

远端 migration 状态：

```text
applied: 0001–0038
pending: 0039_structured_content_objects_and_sources.sql
         0040_taxonomy_semantic_kind.sql
         0041_character_relation_pursues_type.sql
```

## 远端与当前静态包的差异

以下计数来自 `content:remote:audit` 的远端只读查询；静态包计数由同一命令从当前代码加载，因此不会因为手工复制数字而漂移。计数差异用于判断镜像是否可用，不改变“静态内容是 canonical source”的规则。

| 实体 | 远端 D1 | 当前静态 / Local D1 基线 | 判断 |
|---|---:|---:|---|
| Character | 32 | 92 | 旧镜像，缺 60 个实体 |
| World | 8 | 8 | 数量一致，仍需逐行内容/资产对照 |
| Scene | 12 | 15 | 旧镜像，缺 3 个实体 |
| MythicObject | 表不存在 | 18 | 等待 0039 |
| Source | 4 | 45 | 旧镜像，缺 41 个来源 |
| Concept | 0 | 0（当前 Norse 包未声明 Concept） | 非 Norse blocker；通用 structured schema 仍需保持一致 |
| CharacterName | 0 | 7 | 旧镜像未同步 |
| CharacterInterpretation | 0 | 4 | 旧镜像未同步 |
| Character relation（Norse outgoing） | 36 | 58 | 旧镜像，且关系集合不完整 |

远端 `artworks` 查询到 45 行，但该计数不是本次 Norse canonical content readiness 的通过条件；在 migration 和 structured import 完成前，不能把它解释为当前 28 条 Tier S/A Norse 作品覆盖已经进入生产。

## Schema 差异

远端只读 schema 检查确认：

- `mythic_objects` 不存在；
- `content_relations` 不存在，因而不能承载当前通用对象/实体关系镜像；
- `content_sources` 缺少 `source_family`、`evidence_roles_json`、`manuscript_context`、`region`；
- `taxonomy_terms` 缺少 `semantic_kind`；
- `character_relations` 的允许关系类型中没有 `pursues`，因此不能承载当前追逐/天体叙事关系契约。

## 解锁顺序

只有在获得远端写入授权并确认备份/回滚窗口后，才按以下顺序执行：

```text
schema-only preflight
  → remote migration apply
  → schema-only re-check
  → structured content import
  → full Norse count/schema/ID/endpoint contract audit
  → remote API smoke
  → production deploy
  → production browser smoke
```

建议命令入口：

```bash
npx wrangler d1 migrations apply mythcanvas-db --remote
npm run content:import -- --all --apply --remote
npm run provenance:audit -- --remote --strict
```

每一步失败都停止后续步骤；不得通过手工删除远端行、跳过 migration、或把 remote 计数写回静态内容来“修复”差异。完成 import 后必须重新生成 `NORSE_COMPLETION_SNAPSHOT.md`，并把远端证据绑定到新的 `snapshotVersion`。

## 当前 Gate 判定

| Gate | 状态 |
|---|---|
| 远端只读可访问 | 上次审计通过；当前会话需重新认证（9109 / 10000） |
| 远端 migration 与仓库一致 | 未通过（0039–0041 pending） |
| 远端 Norse structured content 对齐 | 未通过 |
| 远端 Graph schema 可用 | 未通过 |
| remote import | 未执行 |
| production deploy / smoke | 未执行 |
