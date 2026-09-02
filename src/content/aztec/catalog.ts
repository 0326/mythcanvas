import type { Character, CharacterRelation, ContentConcept, Scene, TaxonomyTerm, World } from '../../lib/content/types';
import { sourceRef } from './sources';

const mythologyId = 'myth-aztec';
const aztecHero = { src: '/art/aztec-cosmic-cycle.svg', alt: '火山高原、湖城、太阳与羽蛇构成的中央墨西哥神话视觉入口', width: 1600, height: 900 };
const mexica = 'Mexica-Tenochtitlan tradition';
const nahua = 'Central Mexican Nahua tradition';
const ritual = 'Central Mexican ritual codex tradition';

type CharacterSeed = {
  slug: string; name: string; nameEn: string; role: string; symbols: string[]; characterType: Character['characterType'];
  worldIds: string[]; traditionTags: string[]; sourcePeriods: string[]; source: ReturnType<typeof sourceRef>; canonicality?: Character['canonicality'];
};

const character = (seed: CharacterSeed): Character => ({
  id: `character-${seed.slug}`, mythologyId, slug: seed.slug, name: seed.name, nameEn: seed.nameEn,
  role: seed.role, summary: `${seed.name}是${seed.role}。本页按${seed.sourcePeriods.join('、')}的来源范围呈现，不把不同传统压缩成单一正典。`, symbols: seed.symbols, characterType: seed.characterType, worldIds: seed.worldIds,
  traditionTags: seed.traditionTags, sourcePeriods: seed.sourcePeriods, sourceRefs: [seed.source],
  editorialCollections: ['aztec-p0'], canonicality: seed.canonicality ?? 'primary',
  canonicalDesign: {
    anchors: [...seed.symbols.slice(0, 3), `${seed.name}的来源范围`],
    silhouette: `以${seed.symbols.slice(0, 2).join('与')}建立可复用的中央墨西哥身份轮廓`,
    appearance: { body: ['成人或神话角色比例', '身份锚点优先，避免泛中美洲混搭'] },
    costumeLanguage: ['中央墨西哥仪式与礼服语言', '火山岩、玉石、羽饰或纸材按来源范围取舍'],
    paletteCues: ['火山岩黑', '绿松石', '朱红', '太阳金'],
    signatureMaterials: ['火山岩', '黑曜石', '绿松石', '羽毛'],
    temperament: ['庄严', '具有明确叙事功能的姿态'],
    mythologicalFacts: [`${seed.name}按${seed.sourcePeriods.join('、')}的来源范围呈现。`],
    originalDesignChoices: ['采用 MythCanvas 原创轮廓与仪式材质；不复制现代影视、游戏或商业插画设计。'],
    avoid: ['Maya-specific glyph blocks', 'generic tribal costume', 'modern Día de los Muertos Catrina styling', 'fake readable Nahuatl text', 'specific modern franchise likeness'],
    canonicalPrompt: `Depict ${seed.nameEn} as an original MythCanvas Central Mexican interpretation. Preserve ${seed.symbols.slice(0, 3).join(', ')} and the source scope ${seed.sourcePeriods[0]}. Use restrained volcanic stone, turquoise and ceremonial materials; avoid Maya conflation, generic tribal shorthand and modern franchise likeness.`,
  },
});

export const aztecCharacters: readonly Character[] = [
  character({ slug: 'quetzalcoatl', name: '魁札尔科亚特尔', nameEn: 'Quetzalcoatl', role: '羽蛇、风与知识及文明传统中的神祇', symbols: ['羽蛇', '风', '贝壳'], characterType: 'deity', worldIds: ['world-mictlan', 'world-tamoanchan'], traditionTags: ['central-mexican-nahua', 'cosmic-creation'], sourcePeriods: ['Colonial Nahua witness'], source: sourceRef('florentineBook3', 'Book 3, Quetzalcoatl and the origin of humanity') }),
  character({ slug: 'huitzilopochtli', name: '维齐洛波奇特利', nameEn: 'Huitzilopochtli', role: 'Mexica 迁徙与神圣中心传统中的守护神', symbols: ['蜂鸟', '太阳', 'Xiuhcoatl'], characterType: 'deity', worldIds: ['world-coatepec', 'world-tenochtitlan'], traditionTags: ['mexica-tenochtitlan', 'coatepec-cycle'], sourcePeriods: ['Colonial Nahua witness', 'Late Mexica period'], source: sourceRef('florentineBook3', 'Book 3, birth and armed emergence of Huitzilopochtli') }),
  character({ slug: 'tezcatlipoca', name: '特斯卡特利波卡', nameEn: 'Tezcatlipoca', role: '夜、命运、权力与试炼传统中的神祇', symbols: ['烟雾之镜', '美洲豹', '夜色'], characterType: 'deity', worldIds: ['world-cosmic-cycle', 'world-tenochtitlan'], traditionTags: ['central-mexican-nahua', 'cosmic-creation', 'ritual-codex'], sourcePeriods: ['Colonial Nahua witness', 'Central Mexican ritual codex tradition'], source: sourceRef('florentineBook1', 'Book 1, Tezcatlipoca identity and attributes') }),
  character({ slug: 'tlaloc', name: '特拉洛克', nameEn: 'Tlaloc', role: '雨、水、山地与农业秩序中的神祇', symbols: ['雨', '护目镜式眼纹', '水'], characterType: 'deity', worldIds: ['world-tlalocan', 'world-tenochtitlan'], traditionTags: ['central-mexican-nahua', 'rain-renewal', 'ritual-codex'], sourcePeriods: ['Colonial Nahua witness', 'Late Mexica period'], source: sourceRef('florentineBook1', 'Book 1, Tlaloc identity; Book 2, rain ceremony context') }),
  character({ slug: 'coatlicue', name: '科亚特利库埃', nameEn: 'Coatlicue', role: '大地、母性与 Coatepec 诞生叙事中的神祇', symbols: ['蛇裙', '大地', '仪式项链'], characterType: 'deity', worldIds: ['world-coatepec', 'world-tenochtitlan'], traditionTags: ['mexica-tenochtitlan', 'coatepec-cycle'], sourcePeriods: ['Colonial Nahua witness', 'Late Mexica period'], source: sourceRef('florentineBook3', 'Book 3, Coatlicue and Huitzilopochtli birth') }),
  character({ slug: 'xipe-totec', name: '西佩·托特克', nameEn: 'Xipe Totec', role: '植物更新、播种与春季仪式中的神祇', symbols: ['更新', '玉米', '金色仪式层'], characterType: 'deity', worldIds: ['world-tenochtitlan'], traditionTags: ['central-mexican-nahua', 'rain-renewal', 'ritual-codex'], sourcePeriods: ['Colonial Nahua witness', 'Late Mexica period'], source: sourceRef('florentineBook1', 'Book 1, Xipe Totec identity; Book 2, renewal ceremony'), canonicality: 'layered' }),
  character({ slug: 'mictlantecuhtli', name: '米克特兰特库特利', nameEn: 'Mictlantecuhtli', role: 'Mictlan 亡者领域的统治者', symbols: ['骷髅', '猫头鹰', '亡者'], characterType: 'deity', worldIds: ['world-mictlan'], traditionTags: ['central-mexican-nahua', 'death-realms'], sourcePeriods: ['Colonial Nahua witness'], source: sourceRef('florentineBook1', 'Book 1, Mictlantecuhtli identity') }),
  character({ slug: 'mictecacihuatl', name: '米克特卡西瓦特尔', nameEn: 'Mictecacihuatl', role: '与 Mictlan 亡者秩序相关的女性神祇', symbols: ['骨饰', '夜花', '亡者秩序'], characterType: 'deity', worldIds: ['world-mictlan'], traditionTags: ['central-mexican-nahua', 'death-realms'], sourcePeriods: ['Colonial Nahua witness'], source: sourceRef('florentineBook1', 'Book 1, Mictecacihuatl identity') }),
  character({ slug: 'tonatiuh', name: '托纳提乌', nameEn: 'Tonatiuh', role: '第五太阳与太阳运行传统中的太阳身份层', symbols: ['太阳盘', '光芒', '鹰'], characterType: 'deity', worldIds: ['world-cosmic-cycle'], traditionTags: ['central-mexican-nahua', 'cosmic-creation'], sourcePeriods: ['Colonial Nahua witness'], source: sourceRef('leyendaSoles', 'Fifth Sun and present world sequence') }),
  character({ slug: 'coyolxauhqui', name: '科约尔沙乌基', nameEn: 'Coyolxauhqui', role: 'Coatepec 叙事中的月亮与星群身份层', symbols: ['铃饰面颊', '月盘', '星群'], characterType: 'deity', worldIds: ['world-coatepec', 'world-tenochtitlan'], traditionTags: ['mexica-tenochtitlan', 'coatepec-cycle'], sourcePeriods: ['Colonial Nahua witness', 'Late Mexica period'], source: sourceRef('florentineBook3', 'Book 3, Coyolxauhqui and the Huitzilopochtli birth narrative'), canonicality: 'contested' }),
  character({ slug: 'xiuhtecuhtli', name: '休休特库特利', nameEn: 'Xiuhtecuhtli', role: '火、炉火与年周期更新中的神祇', symbols: ['圣火', '绿松石', '火盆'], characterType: 'deity', worldIds: ['world-tenochtitlan'], traditionTags: ['central-mexican-nahua', 'rain-renewal', 'ritual-codex'], sourcePeriods: ['Colonial Nahua witness', 'Late Mexica period'], source: sourceRef('florentineBook1', 'Book 1, Xiuhtecuhtli identity; Book 2, fire ceremony') }),
  character({ slug: 'xochipilli', name: '霍奇皮利', nameEn: 'Xochipilli', role: '花、音乐、舞蹈与艺术传统中的神祇', symbols: ['花', '音乐', '蝴蝶'], characterType: 'deity', worldIds: ['world-tenochtitlan'], traditionTags: ['central-mexican-nahua', 'ritual-codex'], sourcePeriods: ['Colonial Nahua witness'], source: sourceRef('florentineBook1', 'Book 1, Xochipilli identity'), canonicality: 'layered' }),
  character({ slug: 'nanahuatzin', name: '纳纳瓦钦', nameEn: 'Nanahuatzin', role: '特奥蒂瓦坎太阳诞生叙事中投入火中的谦卑者', symbols: ['火堆', '疥疮身体', '太阳诞生'], characterType: 'deity', worldIds: ['world-cosmic-cycle'], traditionTags: ['central-mexican-nahua', 'cosmic-creation'], sourcePeriods: ['Colonial Nahua witness'], source: sourceRef('florentineBook3', 'Book 3, Nanahuatzin and the creation of the Sun'), canonicality: 'primary' }),
  character({ slug: 'tecuciztecatl', name: '特库西斯特卡特尔', nameEn: 'Tecuciztecatl', role: '特奥蒂瓦坎太阳诞生叙事中的月亮转化者', symbols: ['月亮', '贝饰', '火堆'], characterType: 'deity', worldIds: ['world-cosmic-cycle'], traditionTags: ['central-mexican-nahua', 'cosmic-creation'], sourcePeriods: ['Colonial Nahua witness'], source: sourceRef('florentineBook3', 'Book 3, Tecuciztecatl and the creation of the Sun and Moon') }),
  character({ slug: 'centzon-huitznahua', name: '森宗·维茨纳瓦', nameEn: 'Centzon Huitznahua', role: 'Coatepec 叙事中的南方星群集体', symbols: ['星群', '南方', '集体战阵'], characterType: 'collective', worldIds: ['world-coatepec'], traditionTags: ['mexica-tenochtitlan', 'coatepec-cycle'], sourcePeriods: ['Colonial Nahua witness'], source: sourceRef('florentineBook3', 'Book 3, Centzon Huitznahua in the Coatepec narrative'), canonicality: 'layered' }),
  character({ slug: 'tlaltecuhtli', name: '特拉尔特库特利', nameEn: 'Tlaltecuhtli', role: '大地形象与 Mexica 雕塑证据中的解释层', symbols: ['大地', '爪足', '张口姿态'], characterType: 'deity', worldIds: ['world-tenochtitlan'], traditionTags: ['mexica-tenochtitlan', 'central-mexican-nahua'], sourcePeriods: ['Late Mexica period'], source: sourceRef('monolithTlaltecuhtli', 'Monolith object record and iconographic discussion'), canonicality: 'contested' }),
  character({ slug: 'xolotl', name: '索洛特尔', nameEn: 'Xolotl', role: '太阳运动、双生与转化传统中的神祇', symbols: ['犬形', '黄昏', '转化'], characterType: 'deity', worldIds: ['world-cosmic-cycle', 'world-mictlan'], traditionTags: ['central-mexican-nahua', 'cosmic-creation', 'death-realms'], sourcePeriods: ['Colonial Nahua witness'], source: sourceRef('florentineBook1', 'Book 1, Xolotl identity; Book 3, solar creation context'), canonicality: 'layered' }),
  character({ slug: 'chalchiuhtlicue', name: '查尔奇乌特利奎', nameEn: 'Chalchiuhtlicue', role: '水、湖泊与部分太阳时代叙事中的身份层', symbols: ['湖水', '玉石', '流水'], characterType: 'deity', worldIds: ['world-cosmic-cycle', 'world-tlalocan'], traditionTags: ['central-mexican-nahua', 'cosmic-creation', 'rain-renewal'], sourcePeriods: ['Colonial Nahua witness'], source: sourceRef('leyendaSoles', 'Water Sun and world-age destruction; alternate source witness'), canonicality: 'contested' }),
];

export const aztecWorlds: readonly World[] = [
  { id: 'world-cosmic-cycle', mythologyId, slug: 'cosmic-cycle', name: '太阳循环的中央墨西哥宇宙', nameEn: 'Central Mexican Cosmic Cycle', summary: '以来源限定的世界时代、太阳诞生与人类创造叙事组织的宇宙空间；不宣称一张唯一的“五太阳”地图。', canonicalDesign: { anchors: ['太阳循环', '特奥蒂瓦坎火堆', '黑暗与光', '来源层'], signatureMaterials: ['火山岩', '黑曜石', '绿松石', '火焰'], atmosphere: ['高原夜空', '仪式集会', '宇宙转折'] }, heroImage: aztecHero },
  { id: 'world-mictlan', mythologyId, slug: 'mictlan', name: '米克特兰', nameEn: 'Mictlan', summary: '中央墨西哥传统中与亡者及人类骨骸故事相连的神圣空间；具体路径按来源表达，不硬编码唯一九层地图。', canonicalDesign: { anchors: ['亡者之路', '骨骸', '黑暗门槛', 'Mictlantecuhtli'], signatureMaterials: ['黑曜石', '骨白石材', '火山岩', '纸材'], atmosphere: ['庄严', '幽暗', '边界与试炼'] }, heroImage: aztecHero },
  { id: 'world-tlalocan', mythologyId, slug: 'tlalocan', name: '特拉洛坎', nameEn: 'Tlalocan', summary: '与雨、水、山地和特定死后归宿材料相连的神圣领域，不被简化成泛热带天堂。', canonicalDesign: { anchors: ['雨山', '泉水', '玉石绿', '农业更新'], signatureMaterials: ['水', '玉石', '火山岩', '纸材'], atmosphere: ['暴雨前的高原', '湿润山谷', '生长与秩序'] }, heroImage: aztecHero },
  { id: 'world-coatepec', mythologyId, slug: 'coatepec', name: '科阿特佩克神圣山地', nameEn: 'Sacred Mountain of Coatepec', summary: 'Huitzilopochtli 诞生与 Coatepec 冲突叙事的空间层；与 Templo Mayor 的联系作为历史—仪式解释呈现。', canonicalDesign: { anchors: ['蛇山', '山坡冲突', '出生门槛', '星群'], signatureMaterials: ['火山岩', '黑曜石', '羽毛', '朱红土'], atmosphere: ['黎明前', '高原风', '紧张而神圣'] }, heroImage: aztecHero },
  { id: 'world-tenochtitlan', mythologyId, slug: 'tenochtitlan-sacred-center', name: '特诺奇蒂特兰神圣中心', nameEn: 'Sacred Center of Tenochtitlan', summary: '以迁徙记忆、湖城建立与 Sacred Precinct / Templo Mayor 考古证据连接神话—历史的城市空间。', canonicalDesign: { anchors: ['湖城', '神圣区', '双神庙', '堤道'], signatureMaterials: ['火山岩', '石灰岩', '木桩', '绿松石'], atmosphere: ['湖面晨雾', '城市仪式', '高原太阳'] }, heroImage: aztecHero },
  { id: 'world-tamoanchan', mythologyId, slug: 'tamoanchan', name: '塔莫安昌概念空间', nameEn: 'Tamoanchan Concept Space', summary: '作为 Central Mexican 生命、神圣起源与秩序概念的来源限定空间；暂不宣称它是单一固定的神话世界。', canonicalDesign: { anchors: ['生命起源', '树与花', '边界概念'], signatureMaterials: ['树木', '玉石', '花朵', '水'], atmosphere: ['概念性', '生命循环', '来源谨慎'] }, heroImage: aztecHero },
];

const scene = (slug: string, name: string, nameEn: string, summary: string, worldId: string, refs: ReturnType<typeof sourceRef>[]): Scene => ({ id: `scene-${slug}`, mythologyId, worldId, slug, name, nameEn, summary, canonicalDesign: { anchors: [name, '中央墨西哥来源范围', '可复用的空间关系'], atmosphere: ['仪式性', '来源限定'] }, heroImage: aztecHero });
export const aztecScenes: readonly Scene[] = [
  scene('teotihuacan-gathering', '特奥蒂瓦坎诸神集会', 'Gathering at Teotihuacan', '诸神聚集、讨论谁成为太阳的来源限定场景。', 'world-cosmic-cycle', [sourceRef('florentineBook3', 'Book 3, gathering of gods at Teotihuacan')]),
  scene('sacrificial-fire-sun', '祭火与太阳显现', 'Sacrificial Fire and Sun Emergence', 'Nanahuatzin 与 Tecuciztecatl 进入火堆、太阳与月亮显现的叙事空间。', 'world-cosmic-cycle', [sourceRef('florentineBook3', 'Book 3, Nanahuatzin and Tecuciztecatl')]),
  scene('mictlan-descent-route', '下入米克特兰的道路', 'Descent Route to Mictlan', 'Quetzalcoatl 为取回前代人类骨骸而进入亡者领域的边界路径。', 'world-mictlan', [sourceRef('florentineBook3', 'Book 3, Quetzalcoatl in Mictlan')]),
  scene('bones-of-humanity-chamber', '人类骨骸之室', 'Chamber of the Bones of Humanity', '骨骸、磨碎与造人成为叙事焦点的来源抽象空间。', 'world-mictlan', [sourceRef('florentineBook3', 'Book 3, bones and creation of humanity')]),
  scene('coatepec-mountain', '科阿特佩克神山', 'Coatepec Sacred Mountain', 'Coatlicue、Coyolxauhqui、星群与 Huitzilopochtli 诞生叙事的山地空间。', 'world-coatepec', [sourceRef('florentineBook3', 'Book 3, Coatepec narrative')]),
  scene('coatlicue-sweeping', '科亚特利库埃扫地处', 'Coatlicue Sweeping Place', '羽束落入衣襟、诞生转折发生的叙事场景。', 'world-coatepec', [sourceRef('florentineBook3', 'Book 3, Coatlicue and the feather bundle')]),
  scene('huitzilopochtli-emergence', '维齐洛波奇特利武装诞生', 'Armed Emergence of Huitzilopochtli', '神祇诞生、Xiuhcoatl 与 Coatepec 冲突交汇的场景。', 'world-coatepec', [sourceRef('florentineBook3', 'Book 3, armed emergence and Xiuhcoatl')]),
  scene('coyolxauhqui-monument', '科约尔沙乌基纪念碑解释场', 'Coyolxauhqui Monument Interpretation', '考古对象与 Coatepec 叙事联系的解释场，不以血腥肢解作为默认视觉。', 'world-tenochtitlan', [sourceRef('monolithCoyolxauhqui', 'Monolith object record'), sourceRef('temploMayor', 'Sacred Precinct and Templo Mayor context')]),
  scene('aztlan-memory', '阿兹特兰起源记忆', 'Aztlan Origin Memory', '迁徙图像与起源记忆的来源限定场景，不是可精确定位的 GPS 路线。', 'world-tenochtitlan', [sourceRef('codexBoturini', 'opening migration scenes')]),
  scene('migration-camp', '墨西加迁徙营地', 'Mexica Migration Camp', '迁徙过程中的营地、神谕与群体移动场景。', 'world-tenochtitlan', [sourceRef('codexAzcatitlan', 'migration sequence'), sourceRef('codexBoturini', 'migration sequence')]),
  scene('lake-foundation', '湖中建城传统', 'Foundation at Lake Texcoco', '湖泊、标志性植物与建城传统发生的神话—历史桥接场景。', 'world-tenochtitlan', [sourceRef('codexAzcatitlan', 'foundation tradition'), sourceRef('temploMayor', 'Tenochtitlan archaeological context')]),
  scene('sacred-precinct', '神圣区与双神庙', 'Sacred Precinct and Dual Temple', 'Tenochtitlan 城市仪式中心的考古与宗教秩序场景。', 'world-tenochtitlan', [sourceRef('temploMayor', 'Sacred Precinct and Templo Mayor archaeological record')]),
  scene('tlalocan-rain-mountain', '特拉洛坎雨山', 'Rain Mountain of Tlalocan', '雨、水与特定归宿材料相连的来源限定神圣空间。', 'world-tlalocan', [sourceRef('florentineBook1', 'Book 1, Tlaloc and rain realm identity')]),
  scene('new-fire-hill', '新火仪式之山', 'Hill of the New Fire', '年周期更新与圣火秩序的仪式场景，避免现代化倒计时隐喻。', 'world-tenochtitlan', [sourceRef('florentineBook2', 'Book 2, New Fire ceremony')]),
  scene('xipe-renewal-rite', '西佩·托特克更新仪式场', 'Xipe Totec Renewal Rite', '以象征化仪式层表达更新与农业周期，不使用 graphic gore。', 'world-tenochtitlan', [sourceRef('florentineBook2', 'Book 2, Tlacaxipehualiztli ceremony')]),
];

const taxonomy = (slug: string, name: string, kind: TaxonomyTerm['kind'], displayOrder: number, summary: string): TaxonomyTerm => ({ id: `taxonomy-aztec-${slug}`, mythologyId, slug, kind, name, nameEn: name, summary, displayOrder });
export const aztecTaxonomy: readonly TaxonomyTerm[] = [
  taxonomy('mexica-tenochtitlan', '墨西加—特诺奇蒂特兰传统', 'lineage', 10, '围绕 Mexica-Tenochtitlan 语境的编辑范围，不代表所有 Nahua 材料。'),
  taxonomy('nahua-cuauhtitlan', '纳瓦 Cuauhtitlan 传统', 'lineage', 20, '以 Cuauhtitlan 文本见证为范围的 Central Mexican Nahua 传统。'),
  taxonomy('central-mexican-nahua', '中央墨西哥 Nahua 传统', 'lineage', 30, '跨具体城市但仍需来源限定的中央墨西哥 Nahua 范围。'),
  taxonomy('central-mexican-ritual-codex', '中央墨西哥仪式 Codex 传统', 'lineage', 40, 'Borgia Group 等仪式文献的来源范围，不默认等同 Mexica。'),
  taxonomy('colonial-nahua-witness', '殖民时期 Nahua 见证', 'lineage', 50, '殖民记录语境中的 Nahuatl / Indigenous-collaborative witness。'),
  taxonomy('cosmic-creation', '宇宙循环与创世', 'story-cycle', 60, '太阳时代、太阳诞生与人类创造叙事分组。'),
  taxonomy('coatepec-cycle', 'Coatepec 诞生循环', 'story-cycle', 70, 'Coatlicue、Coyolxauhqui、星群与 Huitzilopochtli 的叙事闭包。'),
  taxonomy('migration-foundation', '迁徙与建城桥接', 'story-cycle', 80, 'Aztlan、迁徙记忆与 Tenochtitlan 神圣中心。'),
  taxonomy('death-realms', '亡者与神圣领域', 'domain', 90, 'Mictlan、Tlalocan 与死后空间的来源限定表达。'),
  taxonomy('rain-renewal', '雨与更新', 'domain', 100, '雨、农业、植物更新与周期秩序。'),
  taxonomy('ritual-codex', '仪式与历法材料', 'editorial-collection', 110, '仪式 Codex、节庆与 New Fire 等编辑主题。'),
];

export const aztecConcepts: readonly ContentConcept[] = [
  { id: 'concept-aztec-five-suns', mythologyId, slug: 'five-suns-source-layer', name: '五太阳来源层', summary: '用于并置世界时代、毁灭方式与太阳身份的来源差异，不是唯一标准宇宙模型。', sourceRefs: [sourceRef('leyendaSoles', 'world-age sequence'), sourceRef('florentineBook3', 'creation and sun sequence')] },
  { id: 'concept-aztec-mexica-sacred-center', mythologyId, slug: 'mexica-sacred-center', name: '墨西加神圣中心', summary: '连接迁徙—建城记忆、Sacred Precinct 与 Templo Mayor 考古证据的桥接概念。', sourceRefs: [sourceRef('codexBoturini', 'foundation sequence'), sourceRef('temploMayor', 'Sacred Precinct archaeological record')] },
  { id: 'concept-aztec-mictlan-path', mythologyId, slug: 'mictlan-source-scoped-path', name: '米克特兰来源限定路径', summary: '只在具体来源支持的范围内描述亡者道路，不把九层 infographic 当成普遍固定地图。', sourceRefs: [sourceRef('florentineBook3', 'Quetzalcoatl and the bones of humanity')] },
];

const relation = (id: string, fromCharacterId: string, toCharacterId: string, relationType: string, ref: ReturnType<typeof sourceRef>, traditionScope: string, confidence: CharacterRelation['confidence'] = 'high', extra: Partial<CharacterRelation> = {}): CharacterRelation => ({ id, fromCharacterId, toCharacterId, relationType, assertionKey: `${fromCharacterId}|${toCharacterId}|${relationType}|${id}`, traditionScope, isDefault: true, sourceRefs: [ref], confidence, ...extra });
const conceptRelation = (id: string, fromCharacterId: string, toConceptId: string, relationType: string, ref: ReturnType<typeof sourceRef>, traditionScope: string, confidence: CharacterRelation['confidence'] = 'medium'): CharacterRelation => ({ id, fromCharacterId, toConceptId, relationType, assertionKey: `${fromCharacterId}|${toConceptId}|${relationType}|${id}`, traditionScope, isDefault: false, sourceRefs: [ref], confidence });

export const aztecRelations: readonly CharacterRelation[] = [
  relation('aztec-parent-coatlicue-huitzilopochtli', 'character-coatlicue', 'character-huitzilopochtli', 'parent', sourceRef('florentineBook3', 'Book 3, Coatlicue and Huitzilopochtli birth'), mexica),
  relation('aztec-parent-coatlicue-coyolxauhqui', 'character-coatlicue', 'character-coyolxauhqui', 'parent', sourceRef('florentineBook3', 'Book 3, Coatlicue and Coyolxauhqui'), mexica),
  relation('aztec-parent-coatlicue-centzon', 'character-coatlicue', 'character-centzon-huitznahua', 'parent', sourceRef('florentineBook3', 'Book 3, Coatlicue and Centzon Huitznahua'), mexica),
  relation('aztec-defeats-huitzilopochtli-coyolxauhqui', 'character-huitzilopochtli', 'character-coyolxauhqui', 'defeats', sourceRef('florentineBook3', 'Book 3, Coatepec conflict'), mexica),
  relation('aztec-defeats-huitzilopochtli-centzon', 'character-huitzilopochtli', 'character-centzon-huitznahua', 'defeats', sourceRef('florentineBook3', 'Book 3, Coatepec conflict'), mexica),
  relation('aztec-sibling-coyolxauhqui-centzon', 'character-coyolxauhqui', 'character-centzon-huitznahua', 'sibling', sourceRef('florentineBook3', 'Book 3, Coatepec conflict'), mexica),
  relation('aztec-transforms-nanahuatzin-tonatiuh', 'character-nanahuatzin', 'character-tonatiuh', 'transformed-into', sourceRef('florentineBook3', 'Book 3, Nanahuatzin becomes the Sun'), nahua, 'contested', { isDefault: false, assertionKey: 'nanahuatzin|tonatiuh|solar-identity' }),
  relation('aztec-transforms-tecuciztecatl-moon', 'character-tecuciztecatl', 'character-coyolxauhqui', 'transformed-into', sourceRef('florentineBook3', 'Book 3, Tecuciztecatl becomes the Moon'), nahua, 'contested', { isDefault: false, assertionKey: 'tecuciztecatl|moon-identity' }),
  relation('aztec-creates-quetzalcoatl-humanity', 'character-quetzalcoatl', 'character-xolotl', 'companion', sourceRef('florentineBook3', 'Book 3, Quetzalcoatl and the creation of humanity'), nahua, 'high', { assertionKey: 'quetzalcoatl|xolotl|mictlan-creation-companion' }),
  relation('aztec-rules-mictlantecuhtli-mictlan', 'character-mictlantecuhtli', 'character-mictecacihuatl', 'consort', sourceRef('florentineBook1', 'Book 1, Mictlan rulers'), nahua),
  relation('aztec-associated-tlaloc-chalchiuhtlicue', 'character-tlaloc', 'character-chalchiuhtlicue', 'associated-with', sourceRef('leyendaSoles', 'Water Sun / water divinity context'), nahua, 'contested', { isDefault: false, assertionKey: 'tlaloc|chalchiuhtlicue|water-scope' }),
  relation('aztec-associated-quetzalcoatl-mictlan', 'character-quetzalcoatl', 'character-mictlantecuhtli', 'opposes', sourceRef('florentineBook3', 'Book 3, Quetzalcoatl and Mictlan lord'), nahua, 'high', { assertionKey: 'quetzalcoatl|mictlantecuhtli|bones-narrative' }),
  relation('aztec-associated-xiuhtecuhtli-tezcatlipoca', 'character-xiuhtecuhtli', 'character-tezcatlipoca', 'associated-with', sourceRef('florentineBook2', 'New Fire and ritual order context'), ritual, 'medium', { isDefault: false, assertionKey: 'xiuhtecuhtli|tezcatlipoca|ritual-order' }),
  relation('aztec-associated-xipe-tlaloc', 'character-xipe-totec', 'character-tlaloc', 'associated-with', sourceRef('florentineBook2', 'renewal and rain ceremony context'), ritual, 'medium', { isDefault: false, assertionKey: 'xipe-totec|tlaloc|renewal-rain' }),
  relation('aztec-associated-tonatiuh-tezcatlipoca', 'character-tonatiuh', 'character-tezcatlipoca', 'associated-with', sourceRef('leyendaSoles', 'world-age and solar sequence'), nahua, 'contested', { isDefault: false, assertionKey: 'tonatiuh|tezcatlipoca|sun-cycle' }),
  conceptRelation('aztec-quetzalcoatl-five-suns', 'character-quetzalcoatl', 'concept-aztec-five-suns', 'narrative', sourceRef('leyendaSoles', 'world-age framework'), nahua),
  conceptRelation('aztec-huitzilopochtli-sacred-center', 'character-huitzilopochtli', 'concept-aztec-mexica-sacred-center', 'associated-with', sourceRef('temploMayor', 'Templo Mayor and patron deity interpretation'), mexica),
  conceptRelation('aztec-mictlantecuhtli-path', 'character-mictlantecuhtli', 'concept-aztec-mictlan-path', 'rules-over', sourceRef('florentineBook3', 'Mictlan and bones of humanity'), nahua),
];
