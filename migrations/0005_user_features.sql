-- M3/M4/M6/M7: 用户、收藏、下载统计、生成变体、内容审核与发布扩展
-- 依赖: 0004_r2_content.sql

-- ============ 1. users：游客身份 + 简单昵称登录 ============
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  nickname TEXT NOT NULL,
  is_guest INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- ============ 2. favorites：收藏（Artwork / Character / Realm） ============
CREATE TABLE IF NOT EXISTS favorites (
  user_id TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('artwork','character','realm','style')),
  target_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, target_type, target_id)
);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id, created_at DESC);

-- ============ 3. download_events：下载统计 ============
CREATE TABLE IF NOT EXISTS download_events (
  id TEXT PRIMARY KEY,
  artwork_id TEXT NOT NULL,
  user_id TEXT,
  variant TEXT NOT NULL DEFAULT 'original',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_downloads_artwork ON download_events(artwork_id);
CREATE INDEX IF NOT EXISTS idx_downloads_created ON download_events(created_at DESC);

-- ============ 4. generation_jobs：变体 + 发布扩展 ============
ALTER TABLE generation_jobs ADD COLUMN source_generation_id TEXT;
ALTER TABLE generation_jobs ADD COLUMN is_public INTEGER NOT NULL DEFAULT 0;
ALTER TABLE generation_jobs ADD COLUMN published_at TEXT;
CREATE INDEX IF NOT EXISTS idx_generation_jobs_user ON generation_jobs(entity_id);

-- ============ 5. artworks：发布/推荐/模型元数据扩展 ============
ALTER TABLE artworks ADD COLUMN featured INTEGER NOT NULL DEFAULT 0;
ALTER TABLE artworks ADD COLUMN published_at TEXT;
ALTER TABLE artworks ADD COLUMN ai_model TEXT;
ALTER TABLE artworks ADD COLUMN download_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE artworks ADD COLUMN favorite_count INTEGER NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_artworks_featured ON artworks(featured, created_at DESC);
