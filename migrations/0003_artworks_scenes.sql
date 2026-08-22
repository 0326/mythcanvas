-- M2: 完善内容 Schema(hero/portrait/publish 字段)+ 导入正式内容数据(artwork/scene)
-- 依赖:0001_initial.sql, 0002_seed_core.sql

-- ============ 1. Mythology 增加 Hero 与发布字段 ============
ALTER TABLE mythologies ADD COLUMN hero_src TEXT;
ALTER TABLE mythologies ADD COLUMN hero_alt TEXT;
ALTER TABLE mythologies ADD COLUMN hero_width INTEGER;
ALTER TABLE mythologies ADD COLUMN hero_height INTEGER;
ALTER TABLE mythologies ADD COLUMN publish_status TEXT NOT NULL DEFAULT 'published';

-- ============ 2. Realm 增加 Hero 与发布字段 ============
ALTER TABLE realms ADD COLUMN hero_src TEXT;
ALTER TABLE realms ADD COLUMN hero_alt TEXT;
ALTER TABLE realms ADD COLUMN hero_width INTEGER;
ALTER TABLE realms ADD COLUMN hero_height INTEGER;
ALTER TABLE realms ADD COLUMN publish_status TEXT NOT NULL DEFAULT 'published';

-- ============ 3. Character 增加 Portrait 与发布字段 ============
ALTER TABLE characters ADD COLUMN portrait_src TEXT;
ALTER TABLE characters ADD COLUMN portrait_alt TEXT;
ALTER TABLE characters ADD COLUMN portrait_width INTEGER;
ALTER TABLE characters ADD COLUMN portrait_height INTEGER;
ALTER TABLE characters ADD COLUMN publish_status TEXT NOT NULL DEFAULT 'published';

-- ============ 4. Artwork 增加发布字段 ============
ALTER TABLE artworks ADD COLUMN publish_status TEXT NOT NULL DEFAULT 'published';

-- ============ 5. Scene 实体正式建模 ============
CREATE TABLE IF NOT EXISTS scenes (
  id TEXT PRIMARY KEY,
  mythology_id TEXT NOT NULL,
  realm_id TEXT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  summary TEXT NOT NULL,
  canonical_design_json TEXT NOT NULL,
  hero_src TEXT,
  hero_alt TEXT,
  hero_width INTEGER,
  hero_height INTEGER,
  publish_status TEXT NOT NULL DEFAULT 'published',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mythology_id) REFERENCES mythologies(id),
  FOREIGN KEY (realm_id) REFERENCES realms(id)
);
CREATE INDEX IF NOT EXISTS idx_scenes_mythology ON scenes(mythology_id);

-- ============ 6. 回填 Mythology Hero 数据 ============
UPDATE mythologies SET hero_src='/art/chinese-celestial.svg', hero_alt='云海之上的东方天宫', hero_width=1600, hero_height=900 WHERE id='myth-chinese';
UPDATE mythologies SET hero_src='/art/greek-olympus.jpg', hero_alt='奥林匹斯:云海之上的白色大理石神殿', hero_width=1280, hero_height=720 WHERE id='myth-greek';
UPDATE mythologies SET hero_src='/art/norse-asgard.jpg', hero_alt='阿斯加德:极光之下的世界树与巨石堡垒', hero_width=1280, hero_height=720 WHERE id='myth-norse';
UPDATE mythologies SET hero_src='/art/japanese-takamagahara.jpg', hero_alt='高天原:月下鸟居与雾中神社', hero_width=1280, hero_height=720 WHERE id='myth-japanese';
UPDATE mythologies SET hero_src='/art/egyptian-duat.jpg', hero_alt='杜阿特:星空之下的砂岩巨门与太阳神舟', hero_width=1280, hero_height=720 WHERE id='myth-egyptian';

-- ============ 7. 回填 Realm Hero 数据 ============
UPDATE realms SET hero_src='/art/chinese-celestial.svg', hero_alt='三十三重天的云海宫阙', hero_width=1600, hero_height=900 WHERE id='realm-heavenly-palace';
UPDATE realms SET hero_src='/art/greek-olympus.jpg', hero_alt='奥林匹斯:高峰云层之上的诸神居所', hero_width=1280, hero_height=720 WHERE id='realm-olympus';
UPDATE realms SET hero_src='/art/norse-asgard.jpg', hero_alt='阿斯加德:巨石、金属与彩虹桥连接的北境神域', hero_width=1280, hero_height=720 WHERE id='realm-asgard';
UPDATE realms SET hero_src='/art/japanese-takamagahara.jpg', hero_alt='高天原:月色与云层之间的鸟居与神社', hero_width=1280, hero_height=720 WHERE id='realm-takamagahara';
UPDATE realms SET hero_src='/art/egyptian-duat.jpg', hero_alt='杜阿特:太阳神舟穿越的冥界神域', hero_width=1280, hero_height=720 WHERE id='realm-duat';

-- ============ 8. 回填 Character Portrait 数据 ============
UPDATE characters SET portrait_src='/art/char-chang-e.jpg', portrait_alt='嫦娥:圆月背光下的月宫仙子', portrait_width=864, portrait_height=1152 WHERE id='character-change';
UPDATE characters SET portrait_src='/art/char-athena.jpg', portrait_alt='雅典娜:持矛执盾的智慧女神', portrait_width=864, portrait_height=1152 WHERE id='character-athena';
UPDATE characters SET portrait_src='/art/char-freyja.jpg', portrait_alt='芙蕾雅:佩戴布里辛嘉曼项链的北境女神', portrait_width=864, portrait_height=1152 WHERE id='character-freyja';
UPDATE characters SET portrait_src='/art/char-kaguya.jpg', portrait_alt='辉夜姬:竹影月光下的月之公主', portrait_width=864, portrait_height=1152 WHERE id='character-kaguya';
UPDATE characters SET portrait_src='/art/char-anubis.jpg', portrait_alt='阿努比斯:执掌审判天平的亡者守护神', portrait_width=864, portrait_height=1152 WHERE id='character-anubis';

-- ============ 9. 导入 Artwork 数据 ============
INSERT OR IGNORE INTO artworks (
  id, slug, title, type, mythology_id, realm_id, style_id, mood_ids_json,
  asset_key, asset_mime, width, height, alt_text, source_type, license, creator, review_status
) VALUES
('art-celestial-gate','celestial-gate-above-clouds','云上天门','realm','myth-chinese','realm-heavenly-palace','canonical','["sacred","dreamy","epic"]','/art/chinese-celestial.svg','image/svg+xml',1600,900,'云海之上的金色天门和宫阙','prototype','Internal prototype asset — replace before production',NULL,'approved'),
('art-moon-palace','moon-palace-chang-e','月宫清辉','character','myth-chinese','realm-heavenly-palace','sacred','["moonlight","quiet"]','/art/art-moon-palace.jpg','image/jpeg',720,1280,'月宫清辉:圆月与飘带之间的嫦娥','prototype','Internal prototype asset — replace before production',NULL,'approved'),
('art-olympus-dawn','olympus-at-dawn','奥林匹斯晨光','realm','myth-greek','realm-olympus','cinematic','["sacred","bright"]','/art/art-olympus-dawn.jpg','image/jpeg',720,1280,'晨光中的奥林匹斯:金色光线穿过大理石柱廊','prototype','Internal prototype asset — replace before production',NULL,'approved'),
('art-asgard-aurora','asgard-under-aurora','极光阿斯加德','realm','myth-norse','realm-asgard','cinematic','["epic","cold"]','/art/art-asgard-aurora.jpg','image/jpeg',720,1280,'极光下的阿斯加德:雪崖上的金色灯火殿堂','prototype','Internal prototype asset — replace before production',NULL,'approved'),
('art-takamagahara-moon','takamagahara-moon','月下高天原','realm','myth-japanese','realm-takamagahara','sacred','["moonlight","quiet"]','/art/art-takamagahara-moon.jpg','image/jpeg',720,1280,'月下高天原:巨大满月与湖面鸟居','prototype','Internal prototype asset — replace before production',NULL,'approved'),
('art-duat-sun-barge','duat-sun-barge','太阳神舟','realm','myth-egyptian','realm-duat','dark-fantasy','["mysterious","sacred"]','/art/art-duat-sun-barge.jpg','image/jpeg',720,1280,'太阳神舟:星空之河上的拉神金舟','prototype','Internal prototype asset — replace before production',NULL,'approved');

-- ============ 10. Artwork 角色关系 ============
INSERT OR IGNORE INTO artwork_characters (artwork_id, character_id) VALUES
('art-moon-palace','character-change');

-- ============ 11. 导入 Scene 数据 ============
INSERT OR IGNORE INTO scenes (
  id, mythology_id, realm_id, slug, name, name_en, summary, canonical_design_json,
  hero_src, hero_alt, hero_width, hero_height
) VALUES
('scene-sea-of-clouds','myth-chinese','realm-heavenly-palace','sea-of-clouds','云海天门','Sea of Clouds','层叠云海与金色天门构成通往天宫的第一重天境。','{"anchors":["云海","天门","金阙","中轴"]}','/art/chinese-celestial.svg','云海之上的金色天门',1600,900),
('scene-temple-of-olympus','myth-greek','realm-olympus','temple-of-olympus','诸神议庭','Court of the Gods','高山之巅的白色神殿，诸神围绕黄金穹顶议事。','{"anchors":["白色柱廊","黄金穹顶","高山云层"]}','/art/greek-olympus.jpg','云层之上的白色大理石神殿',1280,720),
('scene-world-tree-roots','myth-norse','realm-asgard','world-tree-roots','世界树之根','Roots of the World Tree','巨树根系贯穿九界，极光在北境夜空流动。','{"anchors":["世界树","根系","极光","符文"]}','/art/norse-asgard.jpg','极光之下的世界树与巨石堡垒',1280,720),
('scene-bamboo-moon','myth-japanese','realm-takamagahara','bamboo-moon','月下竹林','Bamboo Moon','竹林深处的神社与巨大满月，月色清冷而幽静。','{"anchors":["竹林","满月","神社","雾"]}','/art/japanese-takamagahara.jpg','月下鸟居与雾中神社',1280,720),
('scene-river-of-stars','myth-egyptian','realm-duat','river-of-stars','星空之河','River of Stars','太阳神舟沿星河驶向冥界，砂岩巨门立于两岸。','{"anchors":["太阳圆盘","神舟","星空","砂岩巨门"]}','/art/egyptian-duat.jpg','星空之下的砂岩巨门与太阳神舟',1280,720);
