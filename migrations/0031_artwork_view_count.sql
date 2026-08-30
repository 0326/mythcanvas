-- 0031_artwork_view_count.sql
-- 探索页排序：热门按访问量，推荐按下载量。
PRAGMA foreign_keys = ON;

ALTER TABLE artworks ADD COLUMN view_count INTEGER NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_artworks_view_count ON artworks(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_artworks_download_count ON artworks(download_count DESC);

-- 尽可能用现有探索点击埋点回填历史访问量，避免上线后热门榜全部从 0 开始。
UPDATE artworks
SET view_count = COALESCE((
  SELECT COUNT(*)
  FROM analytics_events e
  WHERE e.event_name = 'artwork_click'
    AND e.target_id = artworks.id
), 0);
