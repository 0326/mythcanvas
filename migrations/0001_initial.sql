PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS mythologies (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  summary TEXT NOT NULL,
  visual_dna_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS realms (
  id TEXT PRIMARY KEY,
  mythology_id TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  summary TEXT NOT NULL,
  canonical_design_json TEXT NOT NULL,
  hero_asset_key TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mythology_id) REFERENCES mythologies(id)
);

CREATE TABLE IF NOT EXISTS characters (
  id TEXT PRIMARY KEY,
  mythology_id TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  role TEXT NOT NULL,
  summary TEXT NOT NULL,
  symbols_json TEXT NOT NULL,
  canonical_design_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mythology_id) REFERENCES mythologies(id)
);

CREATE TABLE IF NOT EXISTS character_realms (
  character_id TEXT NOT NULL,
  realm_id TEXT NOT NULL,
  PRIMARY KEY (character_id, realm_id),
  FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
  FOREIGN KEY (realm_id) REFERENCES realms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS styles (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  prompt_hint TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS artworks (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('character','realm','scene','creature','architecture')),
  mythology_id TEXT NOT NULL,
  realm_id TEXT,
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
  FOREIGN KEY (mythology_id) REFERENCES mythologies(id),
  FOREIGN KEY (realm_id) REFERENCES realms(id),
  FOREIGN KEY (style_id) REFERENCES styles(id)
);

CREATE TABLE IF NOT EXISTS artwork_characters (
  artwork_id TEXT NOT NULL,
  character_id TEXT NOT NULL,
  PRIMARY KEY (artwork_id, character_id),
  FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE,
  FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS generation_jobs (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('queued','generating','succeeded','failed','moderated')),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('character','realm')),
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
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_realms_mythology ON realms(mythology_id);
CREATE INDEX IF NOT EXISTS idx_characters_mythology ON characters(mythology_id);
CREATE INDEX IF NOT EXISTS idx_artworks_mythology ON artworks(mythology_id);
CREATE INDEX IF NOT EXISTS idx_artworks_realm ON artworks(realm_id);
CREATE INDEX IF NOT EXISTS idx_artworks_style ON artworks(style_id);
CREATE INDEX IF NOT EXISTS idx_artworks_review_status ON artworks(review_status);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_created_at ON generation_jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_status ON generation_jobs(status);
