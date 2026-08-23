-- M11: 产品埋点事件表
-- 依赖: 0007_user_data.sql

CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY,
  event_name TEXT NOT NULL,
  target_id TEXT,
  user_id TEXT,
  page TEXT,
  extra_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_analytics_name_time ON analytics_events(event_name, created_at DESC);