-- A pilot source-scoped Character package for 二郎神 / Erlang Shen.
-- It intentionally keeps local cult, Journey to the West, and Investiture of
-- the Gods material distinct. “杨戬” is a scoped literary identity, not a
-- second Character or an unconditional alias of every 二郎神 tradition.

INSERT OR IGNORE INTO characters (
  id, mythology_id, slug, name, name_en, role, summary,
  symbols_json, canonical_design_json,
  character_type, tradition_tags_json, source_periods_json, source_refs_json,
  editorial_collections_json, canonicality, publish_status
) VALUES (
  'character-erlang-shen',
  'myth-chinese',
  'erlang-shen',
  '二郎神',
  'Erlang Shen',
  '多源地方守护神与后世神魔文学中的神将形象',
  '二郎神由巴蜀治水信仰、宗教与后世神魔小说等多重传统交织而成；MythCanvas 以解释层保留这些差异，不把它们回填为单一历史事实。',
  '["长柄神兵","山川与江水","猎犬意象"]',
  '{"anchors":["成年守护神将的挺拔轮廓","山川与水势的守望关系","长柄神兵形成清晰纵向剪影","克制、警觉而非暴烈的神将气质"],"silhouette":"以挺拔神将与长柄兵器构成清晰纵向轮廓；具体冠服、兵器和随侍只在所选解释层中确定。","signatureMaterials":["玉石","鎏金","云雾","山石与水光"]}',
  'deity',
  '["地方信仰","道教神祇","明清文学"]',
  '["唐宋至近世","明代"]',
  '[{"type":"academic-secondary","title":"二郎神信仰的通时性·共时性变异及其背景","url":"https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002376597","note":"讨论李二郎、赵二郎、杨二郎等多源传统及其后世融合。"},{"type":"primary-text","title":"西游记·第六回：观音赴会问原因，小圣施威降大圣","period":"明代","url":"https://zh.wikisource.org/zh-hans/%E8%A5%BF%E9%81%8A%E8%A8%98/%E7%AC%AC006%E5%9B%9E"},{"type":"primary-text","title":"封神演义·第四十回：四天王遇丙灵公","period":"明代","url":"https://zh.wikisource.org/zh-hans/%E5%B0%81%E7%A5%9E%E6%BC%94%E7%BE%A9/%E5%8D%B7040"}]',
  '["中国神话 P0","多源人物试点"]',
  'layered',
  'published'
);

INSERT OR IGNORE INTO character_worlds (character_id, world_id) VALUES
  ('character-erlang-shen', 'world-heavenly-palace');

INSERT OR IGNORE INTO character_interpretations (
  id, character_id, slug, name, role, summary,
  tradition_tags_json, source_periods_json, source_refs_json,
  identity_anchors_json, symbols_json, canonical_design_overrides_json,
  prompt_fragment, confidence, status
) VALUES
(
  'interpretation-erlang-shen-shu-water',
  'character-erlang-shen',
  'shu-water-god',
  '巴蜀治水与川主信仰',
  '以治水、镇水与地方守护为核心的地方水神传统',
  '巴蜀地区的二郎神信仰与李冰父子、赵昱等治水叙事相连，但原型与发展脉络并非单一结论；本解释层只呈现“治水与地方守护”的共同主题。',
  '["地方信仰","巴蜀","水神","川主"]',
  '["唐宋至近世"]',
  '[{"type":"religious-canon","title":"中国道教协会：二郎神","url":"https://taoist.org.cn/getDjzsById.do?id=141","note":"概述二郎神在蜀地的水神信仰及李冰、李二郎、赵昱等不同说法。"},{"type":"academic-secondary","title":"二郎神信仰的通时性·共时性变异及其背景","url":"https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002376597","note":"讨论多种二郎神原型和信仰流变；不将其中任一说法视为唯一历史结论。"}]',
  '["临江堰口的守望姿态","以水流、堰渠与山石组织环境","地方祠祀感而非天庭军阵"]',
  '["江水","堰渠","镇水石"]',
  '{"avoid":["把李冰之子、赵昱或其他原型断言为唯一历史身份","叠加明清小说中的杨戬道服、七十二变化或天庭军阵"]}',
  'Depict a source-aware local water-guardian tradition: an adult divine protector stationed at an old river weir, with water-control markers, mountain stone, and restrained regional shrine dignity. Do not claim one human prototype as the sole origin.',
  'contested',
  'active'
),
(
  'interpretation-erlang-shen-journey',
  'character-erlang-shen',
  'journey-to-the-west',
  '《西游记》显圣二郎真君',
  '灌江口真君庙中的天庭神将',
  '《西游记》第六回将其写作居于灌江口、受玉帝调遣的显圣二郎真君；文本强调梅山兄弟、草头神、猎犬、弹弓与三尖两刃神锋。',
  '["明代神魔小说","天庭神将","灌江口"]',
  '["明代"]',
  '[{"type":"primary-text","title":"西游记·第六回：观音赴会问原因，小圣施威降大圣","author":"吴承恩（通常署名）","period":"明代","section":"第六回","url":"https://zh.wikisource.org/zh-hans/%E8%A5%BF%E9%81%8A%E8%A8%98/%E7%AC%AC006%E5%9B%9E","note":"文本称“显圣二郎真君”，描写灌江口、梅山兄弟、草头神、弹弓、猎犬与三尖两刃神锋。"}]',
  '["灌江口真君庙与香火场景","三尖两刃神锋和新月形弹弓","猎犬与梅山神将构成随侍关系","清俊、敏锐而能变化的神将姿态"]',
  '["三尖两刃神锋","新月弹弓","猎犬","梅山兄弟与草头神"]',
  '{"avoid":["将《封神演义》的玉鼎真人门下身世当作本解释层的既定事实","现代影视或游戏角色服装"]}',
  'Use the Journey to the West literary interpretation: the lucid, alert True Lord of Guankou, carrying a three-pointed double-edged divine weapon with a crescent bow and a hound companion. Keep the scene rooted in temple, river valley, and clouded mountain space rather than a generic game battlefield.',
  'high',
  'active'
),
(
  'interpretation-erlang-shen-fengshen-yang-jian',
  'character-erlang-shen',
  'fengshen-yang-jian',
  '《封神演义》杨戬',
  '玉泉山金霞洞玉鼎真人门下的杨戬',
  '《封神演义》第四十回明确写出“姓杨，名戬”，并将其置于玉鼎真人门下；文本叙述其变化之术与清源妙道真君封号。',
  '["明代神魔小说","封神演义","阐教门人"]',
  '["明代"]',
  '[{"type":"primary-text","title":"封神演义·第四十回：四天王遇丙灵公","author":"许仲琳（通常署名）","period":"明代","section":"第四十回","url":"https://zh.wikisource.org/zh-hans/%E5%B0%81%E7%A5%9E%E6%BC%94%E7%BE%A9/%E5%8D%B7040","note":"写杨戬自称玉泉山金霞洞玉鼎真人门下，描述扇云冠、水合服、白马、长枪与变化之术。"}]',
  '["扇云冠、水合服与麻鞋的行道者层次","白马与长枪构成行军剪影","变化神通只作为文学解释层的能力线索","成年、沉静、机敏的道门神将"]',
  '["扇云冠","水合服","白马","长枪","变化神通"]',
  '{"avoid":["将该文学身世回填为所有二郎神传统","照搬任何现代影视、动画或游戏中的杨戬造型"]}',
  'Use the Investiture of the Gods literary interpretation of Yang Jian: an adult Daoist-trained divine warrior in fan-shaped cloud crown and layered water-he garment, on a white horse with a long spear. Treat transformation as a subtle narrative capability, not an uncontrolled visual effect; preserve the calm, observant character and avoid modern franchise designs.',
  'high',
  'active'
);

INSERT OR IGNORE INTO character_names (
  id, character_id, interpretation_id, name, name_en, name_kind,
  is_primary_for_scope, source_refs_json, confidence, status
) VALUES
(
  'name-erlang-shen-primary',
  'character-erlang-shen',
  NULL,
  '二郎神',
  'Erlang Shen',
  'primary',
  1,
  '[{"type":"academic-secondary","title":"二郎神信仰的通时性·共时性变异及其背景","url":"https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002376597","note":"用于产品主实体名；具体传统差异见各解释层。"}]',
  'high',
  'active'
),
(
  'name-erlang-shen-chuan-zhu',
  'character-erlang-shen',
  'interpretation-erlang-shen-shu-water',
  '川主',
  'River Lord',
  'title',
  0,
  '[{"type":"religious-canon","title":"中国道教协会：二郎神","url":"https://taoist.org.cn/getDjzsById.do?id=141","note":"用于巴蜀水神／地方守护解释层。"}]',
  'medium',
  'active'
),
(
  'name-erlang-shen-xiansheng',
  'character-erlang-shen',
  'interpretation-erlang-shen-journey',
  '显圣二郎真君',
  'Illustrious Sage True Lord',
  'title',
  1,
  '[{"type":"primary-text","title":"西游记·第六回：观音赴会问原因，小圣施威降大圣","period":"明代","section":"第六回","url":"https://zh.wikisource.org/zh-hans/%E8%A5%BF%E9%81%8A%E8%A8%98/%E7%AC%AC006%E5%9B%9E"}]',
  'high',
  'active'
),
(
  'name-erlang-shen-yang-jian',
  'character-erlang-shen',
  'interpretation-erlang-shen-fengshen-yang-jian',
  '杨戬',
  'Yang Jian',
  'literary-identity',
  1,
  '[{"type":"primary-text","title":"封神演义·第四十回：四天王遇丙灵公","period":"明代","section":"第四十回","url":"https://zh.wikisource.org/zh-hans/%E5%B0%81%E7%A5%9E%E6%BC%94%E7%BE%A9/%E5%8D%B7040","note":"“姓杨，名戬”只在该文学解释层中使用。"}]',
  'high',
  'active'
);
