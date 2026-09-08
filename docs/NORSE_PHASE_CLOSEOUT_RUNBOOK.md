# Norse Phase Closeout Runbook

> 适用版本：2026-09-07 执行态  
> 目标：把 Phase 0–9 的剩余收口工作变成可复现、可审计、可停止的执行单。  
> 原则：静态内容是 canonical source；D1 是兼容镜像；自动化检查不能替代真人来源、视觉或产品审批。

## 1. 当前状态

机器侧 Phase 0–8 已完成，Phase 9 仍未完成。当前有两条互不替代的通道：

| 通道 | 负责范围 | 当前状态 | 完成凭证 |
|---|---|---|---|
| 内容 / 产品 | Source review、身份审计、World/Story 视觉 QA、P2 决策、产品签字、Snapshot approval | pending | 具名真人记录 + 最终 Snapshot version |
| 工程 / 环境 | Wrangler 认证、remote migration/import、D1/R2/API 对照、production smoke、GPU/硬件差异 | pending | 命令输出、环境 URL、截图/日志、可回滚记录 |

不得用一条通道的结果替代另一条通道。例如 Local D1 通过不代表 Production D1 通过；机器视觉覆盖不代表人工视觉批准。

## 2. 进入条件

在领取任何剩余任务前，先确认：

```bash
npm run content:coverage:norse
npm run content:validate
npm run provenance:audit -- --local --strict
npm test -- --run
npm run check
npx wrangler check startup
```

若内容或静态资产发生变化，必须重新生成 `NORSE_COMPLETION_SNAPSHOT.md`，并从 Source review 重新开始版本锁定；不得沿用旧审批记录。

## 3. 内容 / 产品通道

### 3.1 Source review（P0-8）

输入：

- `docs/NORSE_REVIEW_HANDOFF.md`；
- `docs/NORSE_EDITORIAL_REVIEW_QUEUE.md`；
- `docs/NORSE_SOURCE_PREFLIGHT.md`；
- `src/content/norse/sources.ts`、`stories.ts`、`source-coverage.ts`。

每个 P0 Story 的 reviewer 必须：

1. 按列出的 source locator 阅读对应来源；
2. 决定 `keep / merge / split / rewrite / unpublish`；
3. 检查人物、关系、传统范围、版本差异和正文长度；
4. 在 Story 的 `editorialReview` 写入 `reviewerType: 'human'`、具名 reviewer、有效日期、决定说明和未决问题；
5. 只在没有未决 P0 问题时将 Story 提升到 `source-reviewed`。

停止条件：locator 不够具体、版本冲突未记录、正文仍是模板/占位、或 reviewer 不是本人时，不得提升状态。

通过条件：

```text
P0 source-reviewed = 56 / 56
所有 published P0 Story 通过 Editorial Gate
template / placeholder Story = 0
```

### 3.2 Phase 6 identity / fact audit

输入：`docs/NORSE_REVIEW_HANDOFF.md` 中的 CharacterName、CharacterInterpretation、ContentClaim 队列。

审核范围当前为：7 个 Name、4 个 Interpretation、10 个 Claim。逐项确认：

- 传统范围是否明确；
- primary name 是否唯一；
- alias 是否与其他实体冲突；
- disputed claim 是否标为 `contested`；
- source refs 是否足以支撑说法；
- 不同材料是否错误合并成单一“正典”。

审核证据写回 `src/content/norse/collection-signoff.ts` 的 `norseIdentityAudit`，且必须绑定最终 `snapshotVersion`。自动化只能证明结构合法，不能将状态改为 approved。

### 3.3 Visual QA 与产品签字（P0-9）

World QA：逐个检查 8 个 World 的 desktop/mobile 构图、主体可读性、留白、安全区、文化视觉 DNA、尺寸和 R2 路径。机器报告还会先检查文件存在性、PNG/尺寸、可疑小文件（<100KB）和 SHA-256 重复内容组；这些通过只说明文件完整，不等于视觉批准。

Story QA：逐个检查 74 个 key-moment 插画的主题对应、人物身份、构图、可读性和输出尺寸；不接受“有文件”作为视觉批准。

只有人工确认后，才在视觉资产的 `provenance` 记录写入：

```text
reviewStatus = approved
reviewerType = human
reviewer = 具名 reviewer
reviewedAt = YYYY-MM-DD
reviewNotes = 可追溯决定说明
```

Story 只有在来源审校已通过、并且其 `heroAssetId` 指向上述 human-approved key-moment 资产后，才能将 `editorialStatus` 推进到 `visual-ready`；插画批准不能替代 Story 来源审校。

产品负责人随后检查 Collection Handoff 是否符合产品定位，决定 P2 的 `deferred / excluded`，并将结果写入 `norseProductSignoff`。不得为了凑卡数新增没有来源或没有叙事依赖的实体。

### 3.4 Snapshot 锁定（P0-10）

固定顺序：

```text
完成 Source / identity / visual / P2 决定
  → npm run content:coverage:norse
  → 记录 snapshotVersion A
  → 写入 identity audit + product sign-off
  → npm run content:coverage:norse
  → 若版本变化，按新版本重绑并重复
  → 独立 reviewer 写入 snapshot approval
  → npm run content:certify:norse
```

产品负责人和 Snapshot reviewer 必须是不同的真人。`content:certify:norse` 成功且 `reports/norse-collection-discovery.json` 为 `ready-for-discovery` 之前，不得进入 Collection Discovery、卡面生产或商品化。

## 4. 工程 / 环境通道

### 4.0 CI/CD 保护门禁

`.github/workflows/deploy-cloudflare.yml` 已把 Phase 9 的关键顺序固化为：

```text
content:certify:norse
  → D1 schema-only preflight
  → remote migration / structured import
  → strict remote D1 mirror audit
  → provenance audit
  → Worker deploy
  → production smoke（expect-indexable）
```

部署 workflow 还会上传 preflight、D1 对照、production smoke 和 Snapshot 证据。运行前必须在 GitHub Actions Secrets 配置 `MYTHCANVAS_PRODUCTION_URL`，且它必须是已确认的正式域名；未配置或认证失败时流程应在远端写入前停止。这样可以避免“Worker 部署成功但 Norse 内容认证、D1 镜像或公开路由未验收”的假绿状态。

### 4.1 认证与 schema-only preflight

```bash
npx wrangler login
npx wrangler whoami
npm run content:remote:audit -- --schema-only --strict
```

`whoami` 返回 `9109` 或审计返回 `10000` 时停止，不执行 migration/import。认证失败报告必须保留为 `status: unavailable`，不能解释成 readiness 通过。

### 4.2 Remote migration 与 structured import

这一步会写入远端，必须先确认维护窗口、备份/回滚方案和明确授权。确认后按顺序执行：

```bash
npx wrangler d1 migrations apply mythcanvas-db --remote
npm run content:remote:audit -- --schema-only --strict
npm run content:import -- --mythology norse --apply --remote
npm run provenance:audit -- --remote --strict
npm run content:remote:audit -- --strict --write reports/norse-remote-d1-audit.json
```

若需要同步全部已注册文明，才使用 `--all`；只做本次北欧收口时优先使用 `--mythology norse`，避免扩大远端写入范围。

任一步骤失败都停止后续步骤。禁止手工删除远端行、跳过 migration、把 remote 数据反写到 `src/content/`，或用旧计数覆盖新审计报告。

### 4.3 Remote API / R2 / production smoke

完成 full audit 后，才执行：

先把正式环境 URL 明确传给只读 smoke 脚本；脚本不会猜测目标，也不会部署或写入远端：

```bash
npm run content:smoke:norse -- --base-url https://<已确认的正式域名> --write reports/norse-production-smoke.json
```

在人工来源审校与 Completion Snapshot 尚未批准时，Smoke 默认要求代表性 Story 返回 `noindex,follow`；只有 `npm run content:certify:norse` 通过、最终 Snapshot 已批准后，才追加 `--expect-indexable` 验证 `index,follow`：

```bash
npm run content:smoke:norse -- --base-url https://<已确认的正式域名> --expect-indexable --write reports/norse-production-smoke.json
```

```text
静态页面：/character/odin、/mythology/norse、代表性 Story、/world/asgard
Graph API：默认 scope、指定 tradition、invalid scope、unknown character、depth/node limit
R2：Tier S desktop/mobile、World desktop/mobile、Story key-moment representative HEAD
SEO：HTML 核心内容、canonical、sitemap、no-JS fallback
浏览器：Desktop Light/Dark、Mobile 390×844、API 失败降级、Graph close/reopen
```

每项记录 URL、时间、HTTP 状态、关键响应/截图和失败时的回滚动作。Production smoke 失败时不宣布 Phase 9 完成。

### 4.4 GPU / native WebGL 差异

本地已验证 Canvas 回收、listener 生命周期、renderer resource profile，以及 loopback-only 的 WebGL 初始化失败和探测失败降级；尚未验证 GPU 显存字节级趋势及真实硬件禁用 WebGL 差异。

`npx wrangler check startup` 已在本地通过，并生成 `worker-startup.cpuprofile`；该 profile 只用于分析 Worker 启动热点，不等同于 Cloudflare 生产 CPU 指标。CI 会保留它作为构建证据。

在带 DevTools GPU telemetry 的桌面环境执行至少 10 次 open/close，记录纹理、材质、renderer memory 和 GPU process 指标；在至少一个真实 WebGL 不可用或被禁用环境确认文字关系降级。无法读取 GPU 指标时，必须标记为 `not measured`，不能写成通过。

## 5. 最终验收表

只有以下全部为绿才可以宣布体系补全：

```text
[ ] content:certify:norse 成功
[ ] P0 Source review 56 / 56
[ ] Phase 6 identity audit approved
[ ] World visual approval 8 / 8
[ ] Story key-moment visual approval 74 / 74
[ ] product sign-off approved
[ ] independent Snapshot approval approved
[ ] remote schema 与仓库一致
[ ] remote structured content 对齐
[ ] remote API / R2 / production smoke 通过
[ ] GPU telemetry / native WebGL 差异有证据，或明确记录豁免
```

当前这些条件尚未全部满足；执行状态以 `NORSE_COMPLETION_SNAPSHOT.md`、`NORSE_REMOTE_D1_AUDIT.md` 和本 Runbook 为准。
