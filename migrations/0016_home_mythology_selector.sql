-- Homepage mythology selector metadata and ten-system seed.
-- Final Light/Dark hero images are intentionally left NULL until approved assets are supplied.

ALTER TABLE mythologies ADD COLUMN tagline TEXT NOT NULL DEFAULT '';
ALTER TABLE mythologies ADD COLUMN display_order INTEGER NOT NULL DEFAULT 999;
ALTER TABLE mythologies ADD COLUMN home_hero_light_src TEXT;
ALTER TABLE mythologies ADD COLUMN home_hero_dark_src TEXT;

UPDATE mythologies
SET name = '中国神话',
    name_en = 'Chinese Mythology',
    tagline = '天宫 · 昆仑 · 山海',
    summary = '云海、天宫、昆仑与山海异兽，共同构成中国神话辽阔而瑰丽的天地想象。',
    visual_dna_json = '{"palette":["玉白","鎏金","云青","月白"],"motifs":["祥云","宫阙","昆仑","龙凤"],"materials":["玉石","鎏金","木构","云雾"],"atmosphere":["空灵","神圣","辽阔","东方"]}',
    display_order = 10,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'myth-chinese';

UPDATE mythologies
SET tagline = '奥林匹斯诸神',
    summary = '大理石神殿、爱琴海天光与奥林匹斯诸神，构成明亮、庄严而充满英雄气质的神域。',
    visual_dna_json = '{"palette":["大理石白","古金","爱琴海蓝"],"motifs":["古希腊柱式","月桂","猫头鹰","雷霆"],"materials":["大理石","青铜","黄金"],"atmosphere":["庄严","明亮","英雄感"]}',
    display_order = 20,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'myth-greek';

UPDATE mythologies
SET tagline = '世界树与九界',
    summary = '世界树贯穿九界，冰川、巨石、极光与阿斯加德共同组成苍茫而壮阔的北境宇宙。',
    visual_dna_json = '{"palette":["冰蓝","岩灰","极光绿"],"motifs":["世界树","符文","乌鸦","彩虹桥"],"materials":["巨石","木","铁","冰晶"],"atmosphere":["苍茫","寒冷","史诗"]}',
    display_order = 30,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'myth-norse';

UPDATE mythologies
SET tagline = '太阳 · 冥界',
    summary = '太阳神昼夜巡行，砂岩神殿、尼罗河与杜阿特共同塑造古埃及永恒而神圣的宇宙秩序。',
    visual_dna_json = '{"palette":["太阳金","砂岩","青金石","黑石"],"motifs":["太阳圆盘","太阳神舟","圣甲虫","象形几何"],"materials":["砂岩","黄金","青金石"],"atmosphere":["永恒","庄严","神秘"]}',
    display_order = 40,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'myth-egyptian';

UPDATE mythologies
SET tagline = '高天原与诸神',
    summary = '高天原、神社、鸟居与幽静山林构成克制而神秘的日本神话神域。',
    visual_dna_json = '{"palette":["月白","墨青","克制朱红"],"motifs":["鸟居","神社","注连绳","月"],"materials":["木","和纸","石"],"atmosphere":["幽玄","静谧","灵性"]}',
    display_order = 60,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'myth-japanese';

INSERT OR IGNORE INTO mythologies (
  id, slug, name, name_en, summary, visual_dna_json,
  hero_src, hero_alt, hero_width, hero_height, publish_status,
  tagline, display_order, home_hero_light_src, home_hero_dark_src
) VALUES
(
  'myth-indian','indian','印度神话','Indian Mythology',
  '神山、圣河、莲花与宏伟神庙承载着诸神、创世与宇宙循环的壮阔叙事。',
  '{"palette":["孔雀蓝","暖金","朱砂","莲花粉"],"motifs":["神山","莲花","圣河","神庙塔"],"materials":["砂岩","花岗岩","黄金","木"],"atmosphere":["神圣","繁盛","宇宙感"]}',
  '/art/mythology-placeholder.svg','印度神话视觉占位图',1600,900,'published',
  '诸神与宇宙',50,NULL,NULL
),
(
  'myth-celtic','celtic','凯尔特神话','Celtic Mythology',
  '古老圣林、圣丘、巨石与彼世传说，共同形成自然即神域的凯尔特神话想象。',
  '{"palette":["森林绿","雾白","橡木棕","古金"],"motifs":["橡树","圣丘","立石","黄金颈环"],"materials":["巨石","木","青铜","黄金"],"atmosphere":["古老","自然","神秘","幽静"]}',
  '/art/mythology-placeholder.svg','凯尔特神话视觉占位图',1600,900,'published',
  '森林与彼世',70,NULL,NULL
),
(
  'myth-maya','maya','玛雅神话','Maya Mythology',
  '世界树连接天空、大地与地下世界，玉石、星历与雨林神庙构筑玛雅宇宙。',
  '{"palette":["玉石绿","石灰岩灰","热带绿","天青"],"motifs":["世界树","阶梯神庙","星历","玛雅文字"],"materials":["石灰岩","玉石","木","灰泥"],"atmosphere":["宇宙感","热带","古老","神秘"]}',
  '/art/mythology-placeholder.svg','玛雅神话视觉占位图',1600,900,'published',
  '世界树与西巴尔巴',80,NULL,NULL
),
(
  'myth-aztec','aztec','阿兹特克神话','Aztec Mythology',
  '太阳周期、羽蛇神、双神庙与高原湖城，共同构成强烈而庄严的墨西加神圣宇宙。',
  '{"palette":["火山岩黑","绿松石","朱红","太阳金"],"motifs":["羽蛇","双神庙","太阳","黑曜石"],"materials":["火山岩","黑曜石","绿松石","黄金"],"atmosphere":["强烈","庄严","太阳崇拜","高原"]}',
  '/art/mythology-placeholder.svg','阿兹特克神话视觉占位图',1600,900,'published',
  '太阳与羽蛇',90,NULL,NULL
),
(
  'myth-mesopotamian','mesopotamian','美索不达米亚神话','Mesopotamian Mythology',
  '阶梯神塔、两河古城、楔形文字与星辰，共同展开人类最古老神话传统之一。',
  '{"palette":["泥砖赭","古金","釉砖蓝","河水青"],"motifs":["阶梯神塔","八芒星","楔形文字","狮子"],"materials":["泥砖","烧制砖","青金石","黄金"],"atmosphere":["古老","城市文明","星辰","庄严"]}',
  '/art/mythology-placeholder.svg','美索不达米亚神话视觉占位图',1600,900,'published',
  '众神与两河',100,NULL,NULL
);

CREATE INDEX IF NOT EXISTS idx_mythologies_display_order ON mythologies(display_order);
