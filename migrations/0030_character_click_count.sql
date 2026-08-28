-- 0030_character_click_count.sql
-- 角色列表热度：记录角色入口点击次数。
PRAGMA foreign_keys = ON;

ALTER TABLE characters ADD COLUMN click_count INTEGER NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_characters_click_count ON characters(click_count DESC);
