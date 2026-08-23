-- 0014_world_semantics.sql
-- Complete the Realm -> World migration started by 0013_worlds.sql.
--
-- 0013 renamed tables and columns, but SQLite keeps the original CHECK
-- expressions. Rebuild the affected tables so the persisted domain values and
-- constraints use `world` consistently. Primary keys, slugs, entity IDs and
-- relationship rows are intentionally preserved.

PRAGMA foreign_keys = ON;
PRAGMA defer_foreign_keys = ON;

-- The artwork_characters table references artworks, so keep its rows in a
-- constraint-free temporary table while the parent table is rebuilt.
CREATE TABLE artwork_characters__worlds_migration (
  artwork_id TEXT NOT NULL,
  character_id TEXT NOT NULL
);

INSERT INTO artwork_characters__worlds_migration (artwork_id, character_id)
SELECT artwork_id, character_id
FROM artwork_characters;

DROP TABLE artwork_characters;

CREATE TABLE artworks__worlds_migration (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('character','world','scene','creature','architecture')),
  mythology_id TEXT NOT NULL,
  world_id TEXT,
  style_id TEXT NOT NULL,
  mood_ids_json TEXT NOT NULL DEFAULT '[]',
  asset_key TEXT NOT NULL,
  asset_mime TEXT NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  alt_text TEXT NOT NULL,
  source_type TEXT NOT NULL,
  license TEXT NOT NULL,
  creator TEXT,
  prompt_meta_json TEXT,
  review_status TEXT NOT NULL DEFAULT 'draft' CHECK (review_status IN ('draft','approved','hidden')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  publish_status TEXT NOT NULL DEFAULT 'published',
  featured INTEGER NOT NULL DEFAULT 0,
  published_at TEXT,
  ai_model TEXT,
  download_count INTEGER NOT NULL DEFAULT 0,
  favorite_count INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (mythology_id) REFERENCES mythologies(id),
  FOREIGN KEY (world_id) REFERENCES worlds(id),
  FOREIGN KEY (style_id) REFERENCES styles(id)
);

INSERT INTO artworks__worlds_migration (
  id, slug, title, type, mythology_id, world_id, style_id, mood_ids_json,
  asset_key, asset_mime, width, height, alt_text, source_type, license,
  creator, prompt_meta_json, review_status, created_at, updated_at,
  publish_status, featured, published_at, ai_model, download_count, favorite_count
)
SELECT
  id, slug, title,
  CASE WHEN type = 'realm' THEN 'world' ELSE type END,
  mythology_id, world_id, style_id, mood_ids_json,
  asset_key, asset_mime, width, height, alt_text, source_type, license,
  creator, prompt_meta_json, review_status, created_at, updated_at,
  publish_status, featured, published_at, ai_model, download_count, favorite_count
FROM artworks;

DROP TABLE artworks;
ALTER TABLE artworks__worlds_migration RENAME TO artworks;

CREATE TABLE artwork_characters (
  artwork_id TEXT NOT NULL,
  character_id TEXT NOT NULL,
  PRIMARY KEY (artwork_id, character_id),
  FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE,
  FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
);

INSERT INTO artwork_characters (artwork_id, character_id)
SELECT artwork_id, character_id
FROM artwork_characters__worlds_migration;

DROP TABLE artwork_characters__worlds_migration;

CREATE INDEX idx_artworks_mythology ON artworks(mythology_id);
CREATE INDEX idx_artworks_world ON artworks(world_id);
CREATE INDEX idx_artworks_style ON artworks(style_id);
CREATE INDEX idx_artworks_review_status ON artworks(review_status);
CREATE INDEX idx_artworks_featured ON artworks(featured, created_at DESC);

-- generation_jobs has no foreign-key children, so its constraint can be
-- replaced directly through a shadow table.
CREATE TABLE generation_jobs__worlds_migration (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('queued','generating','succeeded','failed','moderated')),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('character','world')),
  entity_id TEXT NOT NULL,
  mythology_id TEXT NOT NULL,
  style_id TEXT NOT NULL,
  scene TEXT NOT NULL,
  composition TEXT NOT NULL,
  ratio TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  prompt TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_request_id TEXT,
  asset_key TEXT,
  asset_mime TEXT,
  asset_width INTEGER,
  asset_height INTEGER,
  error_code TEXT,
  error_message TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  source_generation_id TEXT,
  is_public INTEGER NOT NULL DEFAULT 0,
  published_at TEXT,
  user_id TEXT,
  character_variant_id TEXT,
  output_spec_id TEXT,
  prompt_layers_json TEXT NOT NULL DEFAULT '{}',
  generation_model TEXT,
  generation_quality TEXT,
  reference_asset_ids_json TEXT NOT NULL DEFAULT '[]'
);

INSERT INTO generation_jobs__worlds_migration (
  id, status, entity_type, entity_id, mythology_id, style_id, scene,
  composition, ratio, description, prompt, provider, provider_request_id,
  asset_key, asset_mime, asset_width, asset_height, error_code, error_message,
  created_at, updated_at, source_generation_id, is_public, published_at, user_id,
  character_variant_id, output_spec_id, prompt_layers_json, generation_model,
  generation_quality, reference_asset_ids_json
)
SELECT
  id, status,
  CASE WHEN entity_type = 'realm' THEN 'world' ELSE entity_type END,
  entity_id, mythology_id, style_id, scene, composition, ratio, description,
  prompt, provider, provider_request_id, asset_key, asset_mime, asset_width,
  asset_height, error_code, error_message, created_at, updated_at,
  source_generation_id, is_public, published_at, user_id, character_variant_id,
  output_spec_id, prompt_layers_json, generation_model, generation_quality,
  reference_asset_ids_json
FROM generation_jobs;

DROP TABLE generation_jobs;
ALTER TABLE generation_jobs__worlds_migration RENAME TO generation_jobs;

CREATE INDEX idx_generation_jobs_created_at ON generation_jobs(created_at DESC);
CREATE INDEX idx_generation_jobs_status ON generation_jobs(status);
CREATE INDEX idx_generation_jobs_user ON generation_jobs(entity_id);
CREATE INDEX idx_generation_jobs_user_id ON generation_jobs(user_id, created_at DESC);
CREATE INDEX idx_generation_jobs_variant ON generation_jobs(character_variant_id);
CREATE INDEX idx_generation_jobs_output_spec ON generation_jobs(output_spec_id);

CREATE TABLE favorites__worlds_migration (
  user_id TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('artwork','character','world','style')),
  target_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, target_type, target_id)
);

INSERT INTO favorites__worlds_migration (user_id, target_type, target_id, created_at)
SELECT
  user_id,
  CASE WHEN target_type = 'realm' THEN 'world' ELSE target_type END,
  target_id,
  created_at
FROM favorites;

DROP TABLE favorites;
ALTER TABLE favorites__worlds_migration RENAME TO favorites;

CREATE INDEX idx_favorites_user ON favorites(user_id, created_at DESC);

-- 0013 preserved old index names after the table/column rename.
DROP INDEX IF EXISTS idx_realms_mythology;
CREATE INDEX idx_worlds_mythology ON worlds(mythology_id);
