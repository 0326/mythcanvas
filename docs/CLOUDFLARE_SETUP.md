# MythCanvas Cloudflare Backend Setup

This document wires the current product prototype to Cloudflare D1, R2 and a real image provider.

The repository intentionally defaults to `AI_GENERATION_MODE=mock`, so the site can build and the end-to-end Creator flow can be tested before any paid/remote services are configured.

## 1. Current runtime contract

The generation flow is:

```text
/create
  → POST /api/generate
  → validate guided request
  → resolve Mythology Visual DNA + Character/Realm Canonical Design
  → compose provider-neutral prompt
  → image provider adapter
  → R2 persist when ARTWORKS is bound
  → D1 generation job persist when DB is bound
  → return normalized image URL/result
```

Bindings used by server code:

- `DB?: D1Database`
- `ARTWORKS?: R2Bucket`
- `AI_GENERATION_MODE?: mock | http`
- `AI_PROVIDER_ENDPOINT?: string`
- `AI_PROVIDER_API_KEY?: secret`

All bindings except `AI_GENERATION_MODE` are optional so a fresh clone still runs.

---

## 2. Create D1

Create a database:

```bash
npx wrangler d1 create mythcanvas-db
```

Wrangler returns a `database_id`. Add the binding to `wrangler.json`:

```json
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "mythcanvas-db",
      "database_id": "<YOUR_DATABASE_ID>",
      "migrations_dir": "migrations"
    }
  ]
}
```

Apply migrations locally first:

```bash
npx wrangler d1 migrations apply mythcanvas-db --local
```

Then remote:

```bash
npx wrangler d1 migrations apply mythcanvas-db --remote
```

Current migrations:

- `0001_initial.sql`: mythology / realm / character / style / artwork / generation tables
- `0002_seed_core.sql`: five launch civilizations + representative realms / characters / styles

D1 is currently used for generation job persistence. Public content pages still use typed seed data until the next migration stage moves read traffic to D1.

---

## 3. Create R2

Create the generated artwork bucket:

```bash
npx wrangler r2 bucket create mythcanvas-artworks
```

Add the binding:

```json
{
  "r2_buckets": [
    {
      "binding": "ARTWORKS",
      "bucket_name": "mythcanvas-artworks"
    }
  ]
}
```

Generated assets are stored under immutable keys:

```text
generated/<year>/<month>/<generation-id>.<ext>
```

The app serves them through:

```text
/media/<r2-key>
```

The media endpoint forwards R2 HTTP metadata, ETag and immutable cache headers.

For production scale, a custom R2 public delivery domain or Cloudflare Images derivative layer can replace this Worker passthrough without changing `Artwork.assetKey` semantics.

---

## 4. Image provider modes

### Mock mode — default

`wrangler.json` currently includes:

```json
{
  "vars": {
    "AI_GENERATION_MODE": "mock"
  }
}
```

Mock mode returns a generated SVG that exercises the same API, persistence and UI path as a real provider.

Use it for:

- UX development
- CI / preview deployments
- testing D1/R2 wiring without model cost

### HTTP provider mode

MythCanvas deliberately uses a provider-neutral adapter rather than calling a model directly from browser code.

Set:

```json
{
  "vars": {
    "AI_GENERATION_MODE": "http",
    "AI_PROVIDER_ENDPOINT": "https://your-image-provider.example/generate"
  }
}
```

Store the API key as a Worker secret, never as a normal variable:

```bash
npx wrangler secret put AI_PROVIDER_API_KEY
```

The HTTP provider receives:

```json
{
  "prompt": "...",
  "width": 900,
  "height": 1600,
  "metadata": {
    "entityType": "character",
    "entityId": "character-change",
    "entityName": "嫦娥",
    "mythologyId": "myth-chinese",
    "mythologyName": "中国神话",
    "styleId": "canonical",
    "styleName": "经典神话",
    "scene": "云海",
    "composition": "手机锁屏",
    "ratio": "9:16"
  }
}
```

Supported provider responses:

1. Direct image response (`Content-Type: image/*`)
2. JSON with `imageBase64`
3. JSON with `imageUrl`

Optional JSON fields:

```json
{
  "requestId": "provider-request-id",
  "imageBase64": "...",
  "imageUrl": "https://...",
  "mimeType": "image/png",
  "width": 900,
  "height": 1600
}
```

This makes it possible to plug in a dedicated model Worker, vendor gateway or internal generation service without changing the Creator UI.

---

## 5. Regenerate Worker types

After changing `wrangler.json` bindings, regenerate types:

```bash
npm run cf-typegen
```

`src/env.d.ts` currently augments optional bindings so CI continues to work before infrastructure is provisioned. Once production bindings are stable, generated Worker types should remain the source of truth.

---

## 6. Local verification

Without D1/R2/provider:

```bash
npm install
npm run dev
```

Open `/create`, select a Character/Realm and click `开始绘神`. Mock mode should return a temporary inline SVG result.

With D1 + R2 configured:

```bash
npm run preview
```

Verify:

1. `/api/generate` returns `status=succeeded`
2. response `persisted=true`
3. image URL begins with `/media/generated/`
4. `generation_jobs` contains the record
5. the R2 bucket contains the generated asset
6. `/api/generation/<id>` returns the persisted job

---

## 7. Production hardening still required

Before real public generation is enabled:

- provider-level safety/moderation
- per-user quotas and abuse/rate limiting
- authentication for private generation history
- request timeout / retry / idempotency strategy
- asynchronous queue for slow providers
- R2 derivative pipeline for thumbnails / phone / desktop variants
- generated Artwork review/publish workflow
- observability for provider latency, failure rate and generation cost
- secrets and environment separation for preview / production

The current implementation establishes the API and storage boundaries so those capabilities can be added without rewriting the product flow.
