-- M4: 内容审核与发布工作流
-- 依赖: 0005_user_features.sql

-- ============ content_submissions：用户申请公开作品，运营审核后发布进 Explore ============
CREATE TABLE IF NOT EXISTS content_submissions (
  id TEXT PRIMARY KEY,
  generation_id TEXT NOT NULL,
  user_id TEXT,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  alt_text TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  review_note TEXT,
  reviewed_at TEXT,
  artwork_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON content_submissions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON content_submissions(user_id, created_at DESC);