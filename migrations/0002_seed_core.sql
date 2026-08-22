INSERT OR IGNORE INTO mythologies (id, slug, name, name_en, summary, visual_dna_json) VALUES
('myth-chinese','chinese','中国神话','Chinese Mythology','云海、天宫、月宫与山海异兽共同构成东方神话的宏阔想象。','{"palette":["玉白","鎏金","云青","月白"],"motifs":["祥云","宫阙","仙鹤","龙纹"],"materials":["玉石","鎏金","白瓷","云雾"],"atmosphere":["空灵","梦幻","神圣","辽阔"]}'),
('myth-greek','greek','希腊神话','Greek Mythology','大理石神殿、爱琴海光线与奥林匹斯诸神组成明亮而庄严的神域。','{"palette":["大理石白","古金","爱琴海蓝"],"motifs":["柱式","月桂","猫头鹰","雷霆"],"materials":["大理石","青铜","黄金"],"atmosphere":["庄严","明亮","英雄感"]}'),
('myth-norse','norse','北欧神话','Norse Mythology','冰川、巨石、世界树与极光构成严寒而壮阔的北境神话。','{"palette":["冰蓝","岩灰","极光绿"],"motifs":["世界树","符文","乌鸦","长船"],"materials":["巨石","冰晶","铁"],"atmosphere":["苍茫","寒冷","史诗"]}'),
('myth-japanese','japanese','日本神话','Japanese Mythology','月色、鸟居、神社与幽静山林共同形成克制而神秘的高天原想象。','{"palette":["月白","墨青","克制朱红"],"motifs":["鸟居","神乐铃","樱","月"],"materials":["木","和纸","石"],"atmosphere":["幽玄","静谧","灵性"]}'),
('myth-egyptian','egyptian','埃及神话','Egyptian Mythology','太阳、砂岩、黑石与青金石共同塑造古老而永恒的神圣秩序。','{"palette":["太阳金","砂岩","青金石","黑石"],"motifs":["太阳圆盘","圣甲虫","鹰","象形几何"],"materials":["砂岩","黄金","青金石"],"atmosphere":["炽热","永恒","神秘"]}');

INSERT OR IGNORE INTO realms (id, mythology_id, slug, name, name_en, summary, canonical_design_json) VALUES
('realm-heavenly-palace','myth-chinese','heavenly-palace','三十三重天','Celestial Palace','层叠宫阙悬于云海之上，玉阶、金阙与天门连接不同天境。','{"anchors":["层叠宫阙","云海中轴","月轮/日轮","玉阶天门"],"silhouette":"高低错落的东方宫殿群围绕中央天门向上生长","signatureMaterials":["白玉","鎏金","云雾"]}'),
('realm-olympus','myth-greek','olympus','奥林匹斯','Olympus','悬于高峰与云层之上的诸神居所，以白色神殿和黄金光线为核心。','{"anchors":["白色柱廊","高山云层","黄金穹顶","诸神议庭"],"signatureMaterials":["大理石","黄金"]}'),
('realm-asgard','myth-norse','asgard','阿斯加德','Asgard','由巨石、金属与彩虹桥连接的北境神域，远方世界树贯穿天际。','{"anchors":["世界树","彩虹桥","北境宫殿","极光天空"],"signatureMaterials":["巨石","铁","冰晶"]}'),
('realm-takamagahara','myth-japanese','takamagahara','高天原','Takamagahara','月色与云层之间的神圣原野，鸟居和神社隐于幽静雾林。','{"anchors":["月轮","鸟居","神社屋顶","雾林"],"signatureMaterials":["木","石","和纸"]}'),
('realm-duat','myth-egyptian','duat','杜阿特','Duat','太阳神舟穿越的冥界神域，砂岩巨门与星空构成昼夜交界。','{"anchors":["太阳圆盘","神舟","砂岩巨门","星空穹顶"],"signatureMaterials":["砂岩","黑石","青金石"]}');

INSERT OR IGNORE INTO characters (id, mythology_id, slug, name, name_en, role, summary, symbols_json, canonical_design_json) VALUES
('character-change','myth-chinese','chang-e','嫦娥','Chang''e','月宫仙子','以月轮、玉兔与飘带为稳定识别符号，在不同画风中保持清冷而空灵的气质。','["月轮","玉兔","桂花","飘带"]','{"anchors":["圆月背光","长飘带","玉兔","玉白与鎏金"],"silhouette":"轻盈长衣与环月构成纵向流动轮廓"}'),
('character-athena','myth-greek','athena','雅典娜','Athena','智慧与战争女神','以长矛、埃癸斯盾、猫头鹰与克制的战神气质保持角色一致性。','["长矛","盾牌","猫头鹰","月桂"]','{"anchors":["长矛","埃癸斯盾","猫头鹰","青铜与金"],"silhouette":"高挑战士轮廓与大型圆盾形成强识别形态"}'),
('character-freyja','myth-norse','freyja','芙蕾雅','Freyja','爱与战争女神','以布里辛嘉曼项链、猎鹰羽饰与北境金属材质建立稳定身份。','["项链","猎鹰","猫","金色"]','{"anchors":["布里辛嘉曼","猎鹰羽饰","北境金属"]}'),
('character-kaguya','myth-japanese','kaguya','辉夜姬','Kaguya-hime','月之公主','以竹影、月轮和层叠衣装形成安静、疏离、带有月光感的主形象。','["月","竹","十二单","月光"]','{"anchors":["月轮","竹影","层叠衣装"]}'),
('character-anubis','myth-egyptian','anubis','阿努比斯','Anubis','亡者守护神','以胡狼头、黑金材质与冥界审判符号保持清晰而神圣的身份。','["胡狼","天平","黑金","安卡"]','{"anchors":["胡狼头","天平","黑金","安卡"]}');

INSERT OR IGNORE INTO character_realms (character_id, realm_id) VALUES
('character-change','realm-heavenly-palace'),
('character-athena','realm-olympus'),
('character-freyja','realm-asgard'),
('character-kaguya','realm-takamagahara'),
('character-anubis','realm-duat');

INSERT OR IGNORE INTO styles (id, slug, name, name_en, prompt_hint) VALUES
('canonical','canonical','经典神话','Canonical','faithful mythological interpretation, refined and timeless'),
('cinematic','cinematic','电影感','Cinematic','cinematic lighting, epic scale, atmospheric depth'),
('sacred','sacred','神圣','Sacred','sacred luminous atmosphere, ceremonial composition'),
('anime','anime','动漫','Anime','refined anime illustration, clean silhouette, detailed environment'),
('dark-fantasy','dark-fantasy','暗黑幻想','Dark Fantasy','dark fantasy atmosphere without horror or gore, dramatic mythic lighting'),
('cyber-myth','cyber-myth','赛博神话','Cyber Myth','mythological identity fused with restrained futuristic materials and light');
