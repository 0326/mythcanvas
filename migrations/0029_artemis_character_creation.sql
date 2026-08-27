-- 0029_artemis_character_creation.sql
-- Productize Artemis through the Character Creation workflow.
-- Artemis already exists as a launch Character; this migration upgrades the
-- stable identity, separates source-scoped interpretations, adds compatible
-- persistent costume variants, and wires the Character into Olympus.

PRAGMA foreign_keys = ON;

-- Stable Character identity: keep the classical hunt/wilderness identity
-- primary while acknowledging the historically layered lunar identification.
UPDATE characters
SET role = '狩猎、荒野与少女守护女神',
    summary = '奥林匹斯的狩猎与荒野女神，以弓箭、鹿与山林为核心识别；她也守护少女与分娩。月亮身份在后世与塞勒涅、狄安娜的认同中逐渐强化，因此作为独立解释层保留。',
    symbols_json = '["弓箭","鹿","猎犬","新月"]',
    character_type = 'deity',
    tradition_tags_json = '["奥林匹斯","狩猎","荒野","野生动物","少女守护","分娩守护","后期月神化"]',
    source_periods_json = '["荷马史诗传统","古风时期","古典时期","希腊化及罗马时期"]',
    source_refs_json = '[{"type":"primary-text","title":"Homeric Hymn 27 to Artemis","period":"古风至古典时期","section":"Hymn 27","url":"https://www.theoi.com/Text/HomericHymns3.html#27","note":"将阿耳忒弥斯描写为持金弓、驰猎山野、射鹿并与阿波罗为兄妹的女神。"},{"type":"primary-text","title":"Callimachus, Hymn 3 to Artemis","author":"Callimachus","period":"希腊化时期","section":"Hymn 3","url":"https://www.theoi.com/Text/CallimachusHymns1.html#3","note":"强调弓箭、及膝猎装、猎犬、山野与少女侍从等阿耳忒弥斯传统。"},{"type":"primary-text","title":"Cicero, De Natura Deorum","author":"Cicero","period":"罗马共和国晚期","section":"2.68-69","url":"https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Cicero/de_Natura_Deorum/2A*.html","note":"记录狄安娜与月亮认同及分娩关联，用于后期月神化解释层。"}]',
    editorial_collections_json = '["希腊神话 P0","奥林匹斯诸神","荒野与狩猎"]',
    canonicality = 'layered',
    canonical_design_json = json_patch(
      COALESCE(canonical_design_json, '{}'),
      '{"anchors":["弓箭与箭袋形成清晰狩猎轮廓","鹿或猎犬作为荒野关系符号","及膝实用希腊狩猎短衣与轻披肩","成年、冷静、警觉而独立的女神气质"],"silhouette":"lean adult huntress-goddess with a vertical bow-and-quiver profile and a light, movement-ready Greek hunting silhouette","appearance":{"face":["clearly adult focused face with an alert, reserved gaze"],"hair":["practical tied-back or restrained classical hairstyle suited to hunting"],"body":["lean athletic adult build suited to running, archery and mountain movement"]},"costumeLanguage":["practical knee-length Greek hunting chiton","light mantle or shoulder wrap","simple leather belt, sandals or hunting boots","functional quiver and physical bow without fantasy weapon exaggeration"],"paletteCues":["ivory textile","cypress green","weathered bronze","restrained moon-silver only when the selected interpretation calls for it"],"signatureMaterials":["woven linen","soft leather","bronze","wood and horn bow materials"],"temperament":["independent","alert","reserved","protective"],"mythologicalFacts":["goddess of hunting, wilderness and wild animals","protector of girls and associated with childbirth","sister of Apollo","lunar identification becomes stronger in later Greek and Roman reception"],"originalDesignChoices":["Prioritize the wilderness huntress identity in the stable canonical design.","Treat deer, hounds and mountain vegetation as meaningful secondary identity cues rather than decorative clutter.","Reserve a strong crescent or moon halo for the lunar interpretation instead of making it mandatory in every image."],"avoid":["generic medieval elf ranger styling","oversized fantasy armor or weapons","making a crescent crown mandatory in every classical-huntress image","treating a silver bow as an immutable ancient source fact","specific modern franchise likeness","youth-coded sexualization"],"canonicalPrompt":"Depict Artemis as an original MythCanvas adult Greek huntress-goddess. Preserve a physical bow and quiver, deer or hunting-hound wilderness cues, a lean movement-ready silhouette, and a calm alert independent presence. Use a practical knee-length Greek hunting chiton, light mantle, restrained leather gear, and culturally grounded materials. Keep the stable identity focused on hunt and wilderness; use prominent lunar symbolism only when the selected interpretation requires it."}'
    )
WHERE id = 'character-artemis';

INSERT OR IGNORE INTO character_worlds (character_id, world_id) VALUES
  ('character-artemis', 'world-olympus');

-- Source-scoped interpretations keep the classical huntress and later lunar
-- identification distinct while still resolving to one persistent Character.
INSERT OR IGNORE INTO character_interpretations (
  id, character_id, slug, name, role, summary,
  tradition_tags_json, source_periods_json, source_refs_json,
  identity_anchors_json, symbols_json, canonical_design_overrides_json,
  prompt_fragment, confidence, status
) VALUES
(
  'interpretation-artemis-classical-huntress',
  'character-artemis',
  'classical-huntress',
  '古典荒野猎神',
  '狩猎、荒野、野生动物与少女守护女神',
  '以荷马传统和赞歌中的山野猎神为主：阿耳忒弥斯持弓驰猎，伴随鹿、猎犬与山林意象；月亮不是这一解释层的强制视觉中心。',
  '["荷马传统","古希腊","狩猎","荒野","野生动物","少女守护"]',
  '["荷马史诗传统","古风时期","古典时期"]',
  '[{"type":"primary-text","title":"Homeric Hymn 27 to Artemis","period":"古风至古典时期","section":"Hymn 27","url":"https://www.theoi.com/Text/HomericHymns3.html#27","note":"金弓、射鹿、山峰与狩猎构成这一解释层的核心依据。"},{"type":"primary-text","title":"Homer, Iliad","author":"Homeric tradition","period":"古风时期","section":"21.470, 21.483 ff.","url":"https://www.theoi.com/Olympios/ArtemisGoddess.html","note":"称阿耳忒弥斯为荒野与野兽的女神，并强调山野狩猎。"}]',
  '["实体弓与箭袋","鹿或猎犬","山峰、柏树与荒野路径","及膝猎装形成轻快纵向剪影"]',
  '["弓箭","鹿","猎犬","山林"]',
  '{"paletteCues":["ivory","cypress green","bronze","earth and stone neutrals"],"avoid":["用巨大月轮替代荒野猎神身份","现代精灵游侠服装","无来源的重甲战士化"]}',
  'Use the classical wilderness-huntress interpretation of Artemis: an adult Greek goddess moving through mountain woodland with a physical bow, quiver, deer or hunting-hound cues, practical knee-length hunting chiton, and restrained leather gear. Keep the image grounded in ancient Greek material language. Moon symbolism should remain secondary or absent unless the scene specifically needs it.',
  'high',
  'active'
),
(
  'interpretation-artemis-lunar',
  'character-artemis',
  'later-lunar-identification',
  '后期月神化',
  '与塞勒涅／狄安娜逐渐合流的月亮解释层',
  '古典核心猎神身份继续保留，但在后期希腊与罗马传统中，阿耳忒弥斯／狄安娜与塞勒涅／月亮的认同变得更明确。该层允许新月、冷月光与夜间荒野成为强视觉锚点。',
  '["希腊化时期","罗马时期","月神化","塞勒涅关联","狄安娜关联"]',
  '["古典晚期","希腊化时期","罗马时期"]',
  '[{"type":"primary-text","title":"Strabo, Geography","author":"Strabo","period":"公元前1世纪至公元1世纪","section":"14.1.6","note":"将赫利俄斯／塞勒涅与阿波罗／阿耳忒弥斯联系起来。"},{"type":"primary-text","title":"Cicero, De Natura Deorum","author":"Cicero","period":"罗马共和国晚期","section":"2.68-69","url":"https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Cicero/de_Natura_Deorum/2A*.html","note":"明确记录狄安娜与月亮的认同及其与分娩的联系。"}]',
  '["实体弓箭仍然保留","新月或月轮成为强次级锚点","夜间山林与鹿形成月光剪影","冷静、疏离而警觉的成年女神气质"]',
  '["弓箭","新月","鹿","月光"]',
  '{"paletteCues":["moon silver","deep night blue","ivory","restrained bronze"],"originalDesignChoices":["Use moonlight to amplify the existing huntress silhouette rather than redesigning Artemis as an unrelated celestial sorceress."],"avoid":["去掉弓箭只保留月亮法术","现代魔法少女造型","将后期月神认同回填为所有古典文本的唯一身份"]}',
  'Use the later lunar-identification interpretation of Artemis while preserving the adult Greek huntress identity. Keep a physical bow and quiver, deer or wilderness cues, and practical Greek garment construction; add a clear but restrained crescent or moon disc, cool night illumination, and moonlit mountain atmosphere. Do not turn her into a generic celestial sorceress.',
  'high',
  'active'
);

-- Persistent costume variants remain orthogonal to rendering Style. Each is
-- scoped to the interpretation whose identity it extends.
INSERT OR IGNORE INTO character_variants (
  id, character_id, character_interpretation_id, slug, name, variant_type,
  description, traits_json, identity_overrides_json, prompt_fragment,
  reference_pack_json, status
) VALUES
(
  'variant-artemis-sanctuary-ceremonial',
  'character-artemis',
  'interpretation-artemis-classical-huntress',
  'sanctuary-ceremonial',
  '神殿礼装',
  'costume',
  '用于祭仪与神殿场景的原创希腊礼装；保留弓箭和荒野猎神身份，但将狩猎装备转为更正式的织物层次。',
  '{"age":"adult","costume":"sanctuary-ceremonial","form":"divine-huntress"}',
  '["longer layered Greek chiton or peplos construction","restrained cypress and deer-border motifs","ceremonial bow carried as a physical sacred object","lighter leather gear than the canonical hunting outfit"]',
  'Dress Artemis in an original sanctuary ceremonial costume built from layered Greek chiton or peplos textiles with restrained cypress and deer-border motifs. Keep her adult huntress silhouette, physical bow and quiver, and Greek material identity. The costume should feel sacred and functional, not like medieval fantasy court dress.',
  '[]',
  'active'
),
(
  'variant-artemis-lunar-ceremonial',
  'character-artemis',
  'interpretation-artemis-lunar',
  'lunar-ceremonial',
  '月辉礼装',
  'costume',
  '后期月神化解释层的原创礼装，以月银、象牙白和克制青铜强化夜间神性，同时保持阿耳忒弥斯的实体弓箭与猎神轮廓。',
  '{"age":"adult","costume":"lunar-ceremonial","form":"divine-huntress"}',
  '["layered ivory and moon-silver Greek textiles","restrained crescent diadem or clasp","physical bow and quiver remain visible","night-ready mantle with clean movement"]',
  'Dress the lunar interpretation of Artemis in an original layered Greek ceremonial costume using ivory, restrained moon-silver and bronze. A subtle crescent diadem or clasp may be used, but preserve the physical bow, quiver, adult huntress anatomy and Greek garment construction. Avoid generic magical-girl or celestial-princess styling.',
  '[]',
  'active'
);

-- Search/SEO name coverage without collapsing the Roman Diana into the same
-- unconditional Character name.
INSERT OR IGNORE INTO character_names (
  id, character_id, interpretation_id, name, name_en, name_kind,
  is_primary_for_scope, source_refs_json, confidence, status
) VALUES
(
  'name-artemis-primary',
  'character-artemis',
  NULL,
  '阿耳忒弥斯',
  'Artemis',
  'primary',
  1,
  '[{"type":"primary-text","title":"Homeric Hymn 27 to Artemis","period":"古风至古典时期","section":"Hymn 27","url":"https://www.theoi.com/Text/HomericHymns3.html#27"}]',
  'high',
  'active'
),
(
  'name-artemis-cn-alt',
  'character-artemis',
  NULL,
  '阿尔忒弥斯',
  'Artemis',
  'alias',
  0,
  '[]',
  'high',
  'active'
);

-- Homeric Hymn 27 explicitly presents Artemis as Apollo's sister.
INSERT OR IGNORE INTO character_relations (
  id, from_character_id, to_character_id, relation_type,
  source_refs_json, confidence, status
) VALUES (
  'relation-artemis-apollo-sibling',
  'character-artemis',
  'character-apollo',
  'sibling',
  '[{"type":"primary-text","title":"Homeric Hymn 27 to Artemis","period":"古风至古典时期","section":"Hymn 27","url":"https://www.theoi.com/Text/HomericHymns3.html#27","note":"赞歌直接称阿耳忒弥斯为阿波罗的姐妹。"}]',
  'high',
  'active'
);
