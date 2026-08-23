-- Productized Character variants for the launch Creator experience.
-- Variants change persistent age/costume/form state; rendering Style remains orthogonal.
-- Depends on 0009_character_style_generation.sql.

PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO character_variants (
  id, character_id, slug, name, variant_type, description,
  traits_json, identity_overrides_json, prompt_fragment, reference_pack_json, status
) VALUES
-- Chang'e
(
  'variant-change-young', 'character-change', 'young-moon-maiden', '少女月姬', 'age',
  '更年轻的月宫形态，保留嫦娥的月轮、长飘带与清冷气质。',
  '{"age":"young-adult","costume":"canonical","form":"human-divine"}',
  '["younger facial age while remaining an adult","lighter and more youthful posture"]',
  'Depict Chang''e as a young adult moon maiden. Keep the canonical moon halo, flowing ribbons, jade-white and restrained gold palette, and serene lunar identity.',
  '[]', 'active'
),
(
  'variant-change-ceremonial', 'character-change', 'moon-palace-ceremonial', '月宫礼服', 'costume',
  '用于月宫祭仪与正式场景的层叠礼服形态。',
  '{"age":"canonical","costume":"ceremonial","form":"human-divine"}',
  '["layered ceremonial robes","refined jade and gold hair ornaments","longer controlled ribbon silhouette"]',
  'Dress Chang''e in an original layered Moon Palace ceremonial robe using jade-white silk, restrained gold trim, subtle osmanthus motifs, and elegant lunar ornaments. Preserve her established identity anchors.',
  '[]', 'active'
),
(
  'variant-change-battle', 'character-change', 'lunar-battle-form', '月神战装', 'form',
  '将月宫意象转译为轻量战斗神装，不改变嫦娥的核心身份。',
  '{"age":"canonical","costume":"light-armor","form":"lunar-battle"}',
  '["lightweight lunar armor layered over flowing garments","crescent-shaped protective elements","more decisive posture"]',
  'Use an original lunar battle form: lightweight moon-themed armor integrated with flowing garments, crescent protective motifs, and a decisive divine posture. Keep the moon halo, ribbons, jade-white and restrained gold identity.',
  '[]', 'active'
),

-- Athena
(
  'variant-athena-young', 'character-athena', 'young-strategist', '青年智将', 'age',
  '更年轻但仍具有成年战士身份的雅典娜。',
  '{"age":"young-adult","costume":"canonical-armor","form":"divine-warrior"}',
  '["younger adult facial age","leaner athletic build","alert strategic expression"]',
  'Depict Athena as a young adult strategist-warrior. Preserve spear, Aegis shield, owl motif, bronze-and-ivory materials, and her calm disciplined authority.',
  '[]', 'active'
),
(
  'variant-athena-ceremonial', 'character-athena', 'ceremonial-armor', '神殿礼甲', 'costume',
  '适合奥林匹斯仪典的白金青铜礼甲。',
  '{"age":"canonical","costume":"ceremonial-armor","form":"divine-warrior"}',
  '["ceremonial bronze-and-ivory armor","restrained laurel details","long formal mantle"]',
  'Dress Athena in original ceremonial bronze-and-ivory temple armor with restrained laurel details and a formal mantle. Preserve spear, Aegis shield, owl symbolism, and her disciplined warrior silhouette.',
  '[]', 'active'
),
(
  'variant-athena-war', 'character-athena', 'war-aspect', '战争神相', 'form',
  '强化战场神性与盾矛轮廓，但不改变角色主设。',
  '{"age":"canonical","costume":"battle-armor","form":"war-aspect"}',
  '["heavier battle-ready armor","stronger shield-and-spear silhouette","controlled divine energy"]',
  'Use Athena''s war aspect with heavier original battle-ready armor and a stronger spear-and-Aegis silhouette. Keep her face, owl symbolism, bronze-and-ivory identity, and calm strategic authority recognizable.',
  '[]', 'active'
),

-- Freyja
(
  'variant-freyja-ceremonial', 'character-freyja', 'brisingamen-ceremonial', '金饰礼装', 'costume',
  '突出布里辛嘉曼与北境金属工艺的正式礼装。',
  '{"age":"canonical","costume":"ceremonial","form":"goddess"}',
  '["ceremonial northern layers","prominent Brisingamen necklace","restrained falcon-feather ornament"]',
  'Dress Freyja in original northern ceremonial layers centered on the Brisingamen necklace, refined metalwork, and restrained falcon-feather ornament. Preserve her established goddess identity.',
  '[]', 'active'
),
(
  'variant-freyja-war', 'character-freyja', 'falcon-war-aspect', '猎鹰战相', 'form',
  '战斗形态，强化猎鹰与战争女神的一面。',
  '{"age":"canonical","costume":"battle","form":"falcon-war"}',
  '["battle-ready northern armor","falcon-feather mantle","controlled warrior posture"]',
  'Use Freyja''s falcon war aspect with original battle-ready northern armor and a falcon-feather mantle. Keep Brisingamen, warm gold accents, and her recognizable divine presence.',
  '[]', 'active'
),

-- Kaguya-hime
(
  'variant-kaguya-young', 'character-kaguya', 'young-princess', '少女辉夜', 'age',
  '年轻成年形态，强调竹影与月光中的疏离感。',
  '{"age":"young-adult","costume":"canonical","form":"lunar-princess"}',
  '["younger adult facial age","lighter layered court robes","delicate reserved posture"]',
  'Depict Kaguya-hime as a young adult lunar princess. Preserve the full moon, bamboo silhouette, layered court clothing, moonlit palette, and quiet distant presence.',
  '[]', 'active'
),
(
  'variant-kaguya-court', 'character-kaguya', 'moon-court-robe', '月宫十二单', 'costume',
  '以原创月宫配色重构十二单礼服。',
  '{"age":"canonical","costume":"layered-court-robe","form":"lunar-princess"}',
  '["more elaborate layered court robe","moon-white and ink-blue textile hierarchy","restrained silver accents"]',
  'Dress Kaguya-hime in an original moon-court layered robe inspired by historical court layering without copying a modern adaptation. Use moon-white, ink-blue, and restrained silver; keep bamboo and lunar identity anchors.',
  '[]', 'active'
),
(
  'variant-kaguya-ascension', 'character-kaguya', 'lunar-ascension', '月升神相', 'form',
  '回归月界时的神性形态。',
  '{"age":"canonical","costume":"ethereal-court","form":"lunar-ascension"}',
  '["ethereal layered silhouette","subtle lunar halo geometry","weightless ascending posture"]',
  'Use Kaguya-hime''s lunar ascension form with an ethereal layered silhouette, subtle moon-halo geometry, and weightless upward motion. Preserve her face, bamboo/lunar symbolism, and restrained elegance.',
  '[]', 'active'
),

-- Anubis
(
  'variant-anubis-judge', 'character-anubis', 'ceremonial-judge', '审判礼装', 'costume',
  '用于亡者审判仪式的黑金礼装。',
  '{"age":"ageless","costume":"ceremonial-judge","form":"jackal-headed-deity"}',
  '["formal black-and-gold ceremonial layers","prominent balance and ankh","lapis accents"]',
  'Dress Anubis in original black-and-gold ceremonial judge regalia with restrained lapis accents. Preserve the jackal head, balance, ankh, and solemn Duat identity.',
  '[]', 'active'
),
(
  'variant-anubis-guardian', 'character-anubis', 'duat-guardian', '冥界守门神相', 'form',
  '强化守门与护卫属性的神性战斗形态。',
  '{"age":"ageless","costume":"guardian-armor","form":"duat-guardian"}',
  '["structured guardian armor","taller monumental silhouette","controlled solar-and-lapis accents"]',
  'Use Anubis''s Duat guardian aspect with original structured black-stone and gold armor, monumental posture, and restrained solar/lapis accents. Preserve the jackal-headed silhouette, ankh, and funerary guardian identity.',
  '[]', 'active'
);
