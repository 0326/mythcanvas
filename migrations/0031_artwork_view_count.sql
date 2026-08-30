-- 0031_artwork_view_count.sql
-- 探索页排序：热门按访问量，推荐按实际下载量。
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

-- 当前真正可下载的仍是原图；历史规格选择曾被误记为下载，因此按实际原图下载事件重算。
UPDATE artworks
SET download_count = COALESCE((
  SELECT COUNT(*)
  FROM download_events d
  WHERE d.artwork_id = artworks.id
    AND d.variant = 'original'
), 0);
