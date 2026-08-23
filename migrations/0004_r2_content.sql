-- M2d: 正式内容图片切换到 R2 delivery URL（/media/content/...），清理 prototype 占位标记
-- 依赖: 0003_artworks_scenes.sql
-- 前置条件: public/art/* 已上传至 R2 bucket「mythcanvas-artworks」content/ 前缀

-- ============ 1. Mythology Hero 切换 R2 ============
UPDATE mythologies SET hero_src = REPLACE(hero_src, '/art/', '/media/content/') WHERE hero_src LIKE '/art/%';

-- ============ 2. World Hero 切换 R2 ============
UPDATE worlds SET hero_src = REPLACE(hero_src, '/art/', '/media/content/') WHERE hero_src LIKE '/art/%';

-- ============ 3. Character Portrait 切换 R2 ============
UPDATE characters SET portrait_src = REPLACE(portrait_src, '/art/', '/media/content/') WHERE portrait_src LIKE '/art/%';

-- ============ 4. Artwork 主图切换 R2 ============
UPDATE artworks SET asset_key = REPLACE(asset_key, '/art/', '/media/content/') WHERE asset_key LIKE '/art/%';

-- ============ 5. Scene Hero 切换 R2 ============
UPDATE scenes SET hero_src = REPLACE(hero_src, '/art/', '/media/content/') WHERE hero_src LIKE '/art/%';

-- ============ 6. 清理 Artwork prototype 占位标记 ============
UPDATE artworks
SET source_type = 'original', license = 'MythCanvas 原创'
WHERE source_type = 'prototype';
