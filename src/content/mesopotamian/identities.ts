import type { CharacterInterpretation, CharacterName, ContentClaim } from '../../lib/content/types';
import { sourceRef } from './sources';

const name = (id: string, characterId: string, displayName: string, nameEn: string, nameKind: CharacterName['nameKind'], sourceKey: Parameters<typeof sourceRef>[0], locator: string, isPrimaryForScope = false): CharacterName => ({
  id,
  characterId,
  name: displayName,
  nameEn,
  nameKind,
  isPrimaryForScope,
  sourceRefs: [sourceRef(sourceKey, locator)],
  confidence: 'high',
});

export const mesopotamianNames: readonly CharacterName[] = [
  name('name-meso-an', 'character-an-anu', 'An', 'An', 'primary', 'enkiWorldOrder', 'An authority passages', true),
  name('name-meso-anu', 'character-an-anu', 'Anu', 'Anu', 'alias', 'anAnum', 'An / Anu lexical correspondence entry'),
  name('name-meso-ellil', 'character-enlil', 'Ellil', 'Ellil', 'alias', 'anAnum', 'Enlil / Ellil lexical correspondence entry'),
  name('name-meso-enki', 'character-enki-ea', 'Enki', 'Enki', 'primary', 'enkiWorldOrder', 'Enki and Eridu passages', true),
  name('name-meso-ea', 'character-enki-ea', 'Ea', 'Ea', 'alias', 'anAnum', 'Enki / Ea lexical correspondence entry'),
  name('name-meso-inanna', 'character-inanna-ishtar', 'Inanna', 'Inanna', 'primary', 'inannaDescent', 'Sumerian Inanna descent opening', true),
  name('name-meso-istar', 'character-inanna-ishtar', 'Ištar', 'Ištar', 'alias', 'anAnum', 'Ištar lexical correspondence entry'),
  name('name-meso-ishtar-ascii', 'character-inanna-ishtar', 'Ishtar', 'Ishtar', 'alias', 'ishtarDescent', 'Akkadian Descent of Ishtar title and opening'),
  name('name-meso-utu', 'character-utu-shamash', 'Utu', 'Utu', 'primary', 'enkiWorldOrder', 'Utu office passages', true),
  name('name-meso-shamash', 'character-utu-shamash', 'Šamaš', 'Šamaš', 'alias', 'anAnum', 'Utu / Šamaš lexical correspondence entry'),
  name('name-meso-shamash-ascii', 'character-utu-shamash', 'Shamash', 'Shamash', 'alias', 'anAnum', 'ASCII transliteration used in modern catalogues'),
  name('name-meso-nanna', 'character-nanna-sin', 'Nanna', 'Nanna', 'primary', 'enlilNinlil', 'Nanna birth and naming sequence', true),
  name('name-meso-suen', 'character-nanna-sin', 'Suen', 'Suen', 'alias', 'anAnum', 'Nanna / Suen lexical correspondence entry'),
  name('name-meso-sin', 'character-nanna-sin', 'Sîn', 'Sîn', 'alias', 'anAnum', 'Nanna / Sîn lexical correspondence entry'),
  name('name-meso-sin-ascii', 'character-nanna-sin', 'Sin', 'Sin', 'alias', 'anAnum', 'ASCII transliteration used in modern catalogues'),
  name('name-meso-ishkur', 'character-ishkur-adad', 'Iškur', 'Iškur', 'primary', 'enkiWorldOrder', 'storm-god passages', true),
  name('name-meso-adad', 'character-ishkur-adad', 'Adad', 'Adad', 'alias', 'anAnum', 'Iškur / Adad lexical correspondence entry'),
  name('name-meso-ereshkigal', 'character-ereshkigal', 'Ereškigal', 'Ereškigal', 'primary', 'inannaDescent', 'Ereškigal and seven gates', true),
  name('name-meso-ereshkigal-ascii', 'character-ereshkigal', 'Ereshkigal', 'Ereshkigal', 'alias', 'nergalEreshkigal', 'Ereshkigal in Akkadian source presentation'),
  name('name-meso-dumuzi', 'character-dumuzi-tammuz', 'Dumuzi', 'Dumuzi', 'primary', 'dumuziDream', 'Dumuzi dream', true),
  name('name-meso-tammuz', 'character-dumuzi-tammuz', 'Tammuz', 'Tammuz', 'alias', 'anAnum', 'Dumuzi / Tammuz lexical correspondence entry'),
  name('name-meso-ashur', 'character-ashur', 'Aššur', 'Aššur', 'primary', 'assyrianCult', 'Assur / Ashur local-cult evidence', true),
  name('name-meso-ashur-ascii', 'character-ashur', 'Ashur', 'Ashur', 'alias', 'assyrianCult', 'ASCII transliteration used in modern catalogues'),
  name('name-meso-marduk-bel', 'character-marduk', 'Bel', 'Bēl', 'title', 'anAnum', 'Marduk-specific Bel title entry; generic bēlu is excluded'),
  name('name-meso-apsu', 'character-apsu-enuma-elish', 'Apsû', 'Apsû', 'primary', 'enumaElish', 'Tablet I, Apsû opening', true),
  name('name-meso-abzu-world', 'character-enki-ea', 'Abzu', 'Abzu', 'literary-identity', 'enkiWorldOrder', 'freshwater domain terminology; not an Apsu Character alias'),
  name('name-meso-ziusudra', 'character-ziusudra', 'Ziusudra', 'Ziusudra', 'primary', 'sumerianFlood', 'Flood Story, Ziusudra passages', true),
  name('name-meso-atrahasis', 'character-atrahasis', 'Atraḫasis', 'Atraḫasis', 'primary', 'atrahasis', 'Tablets I–III, Atraḫasis name', true),
  name('name-meso-atrahasis-ascii', 'character-atrahasis', 'Atrahasis', 'Atrahasis', 'alias', 'atrahasis', 'ASCII transliteration used in modern catalogues'),
  name('name-meso-utnapishtim', 'character-utnapishtim', 'Utnapištim', 'Utnapištim', 'primary', 'gilgameshStandard', 'Tablet XI, Utnapištim name', true),
  name('name-meso-utnapishtim-ascii', 'character-utnapishtim', 'Utnapishtim', 'Utnapishtim', 'alias', 'gilgameshStandard', 'ASCII transliteration used in modern catalogues'),
  name('name-meso-humbaba-huwawa', 'character-humbaba', 'Huwawa', 'Huwawa', 'alias', 'gilgameshSumerian', 'Sumerian Gilgamesh / Huwawa textual lane'),
  name('name-meso-anzu-imdugud', 'character-anzu', 'Imdugud', 'Imdugud', 'alias', 'anzu', 'Anzu / Imdugud identity scope'),
];

const interpretation = (id: string, characterId: string, slug: string, displayName: string, role: string, summary: string, tags: string[], periods: string[], sourceKey: Parameters<typeof sourceRef>[0], locator: string, anchors: string[], promptFragment: string, confidence: CharacterInterpretation['confidence'] = 'medium'): CharacterInterpretation => ({ id, characterId, slug, name: displayName, role, summary, traditionTags: tags, sourcePeriods: periods, sourceRefs: [sourceRef(sourceKey, locator)], identityAnchors: anchors, symbols: anchors.slice(0, 3), canonicalDesignOverrides: {}, promptFragment, confidence });

export const mesopotamianInterpretations: readonly CharacterInterpretation[] = [
  interpretation('interpretation-meso-inanna-sumerian', 'character-inanna-ishtar', 'sumerian-inanna', 'Sumerian Inanna', 'Uruk / Sumerian 文本与地方崇拜解释层', '以 Inanna 为名称，强调 Uruk、八芒星、爱欲与战争的 Sumerian 文本范围。', ['sumerian-foundations', 'inanna-ishtar', 'uruk-local'], ['Old Babylonian witnesses preserving a Sumerian composition'], 'inannaDescent', 'Sumerian Inanna opening and Uruk context', ['Inanna', 'Uruk', '八芒星'], 'Keep the Sumerian Inanna name and Uruk scope explicit; do not import every later Ishtar manifestation.', 'high'),
  interpretation('interpretation-meso-ishtar-akkadian', 'character-inanna-ishtar', 'akkadian-ishtar', 'Akkadian Ištar / Ishtar', 'Akkadian 语言与后期广泛神学解释层', '以 Ištar / Ishtar 为名称，保留战争、爱欲、王权与金星等跨文本维度，同时不抹平地方表现。', ['akkadian-bridge', 'inanna-ishtar'], ['First-millennium Akkadian witness traditions'], 'ishtarDescent', 'Akkadian Descent of Ishtar opening', ['Ištar', '金星', '战争'], 'Use the Akkadian Ištar scope and distinguish it from the Sumerian composition.', 'high'),
  interpretation('interpretation-meso-ishtar-nineveh', 'character-inanna-ishtar', 'ishtar-nineveh-local', 'Ishtar of Nineveh', 'Nineveh 地方崇拜 manifestation', 'Nineveh 的 Ishtar 作为地方崇拜解释层呈现，不覆盖 Inanna / Ishtar 的全部跨时期身份。', ['assyrian-bridge', 'inanna-ishtar'], ['Neo-Assyrian first millennium BCE'], 'assyrianCult', 'Nineveh Ishtar local-cult evidence', ['Nineveh', '地方神庙', 'Ishtar'], 'Keep Nineveh as a local-cult scope with Assyrian material language; do not universalize the manifestation.', 'medium'),
  interpretation('interpretation-meso-ishtar-arbela', 'character-inanna-ishtar', 'ishtar-arbela-local', 'Ishtar of Arbela', 'Arbela 地方崇拜 manifestation', 'Arbela 的 Ishtar 作为地方崇拜解释层呈现，与 Nineveh 及 Uruk 保持可查询差异。', ['assyrian-bridge', 'inanna-ishtar'], ['Neo-Assyrian first millennium BCE'], 'assyrianCult', 'Arbela Ishtar local-cult evidence', ['Arbela', '地方神庙', 'Ishtar'], 'Keep Arbela as a source-scoped local manifestation, not a replacement for the base Character.', 'medium'),
  interpretation('interpretation-meso-enki-sumerian', 'character-enki-ea', 'sumerian-enki', 'Sumerian Enki', 'Eridu、Abzu 与淡水智慧的 Sumerian 解释层', '以 Enki 为名称，突出 Eridu、地下淡水与技艺 / 智慧，同时将 Abzu 作为 World 语义保留。', ['sumerian-foundations', 'eridu-local'], ['Old Babylonian witnesses preserving a Sumerian composition'], 'enkiNinhursaga', 'Enki, Ninhursaga and Dilmun', ['Enki', 'Eridu', '地下淡水'], 'Keep Enki, Eridu and the freshwater domain distinct from the Apsu deity.', 'high'),
  interpretation('interpretation-meso-enki-ea-akkadian', 'character-enki-ea', 'akkadian-ea', 'Akkadian Ea', 'Akkadian 智慧、救助与深水神学解释层', '以 Ea 为名称，保留 Akkadian 文本中智慧、技艺与救助功能的来源范围。', ['akkadian-bridge'], ['Second-millennium and first-millennium Akkadian witnesses'], 'atrahasis', 'Ea advises the flood survivor and assists in crisis narratives', ['Ea', '智慧', '救助'], 'Use Ea as the Akkadian name while preserving the shared identity gate with Enki.', 'high'),
  interpretation('interpretation-meso-ashur-state', 'character-ashur', 'neo-assyrian-state-theology', 'Neo-Assyrian Ashur', 'Assyrian 国家神学与王权合法性解释层', 'Ashur 的政治神学必须按 Neo-Assyrian 时代与王权材料理解，不反写为全 Mesopotamian 永恒共识。', ['assyrian-bridge', 'kingship', 'assur-local'], ['Neo-Assyrian first millennium BCE'], 'assyrianCult', 'Ashur, royal ideology and local-cult scope', ['Ashur', '神圣圆盘', '王权'], 'Use Neo-Assyrian palace and inscription context only when the source scope calls for it.', 'high'),
];

export const mesopotamianClaims: readonly ContentClaim[] = [
  { id: 'claim-meso-flood-heroes-distinct', subjectType: 'character', subjectId: 'character-ziusudra', claimType: 'identity', summary: 'Ziusudra、Atrahasis 与 Utnapishtim 分属不同语言与文本传统；它们可以在现代编辑比较层关联，但不应作为 alias 或 genealogy 合并。', status: 'supported', traditionScope: 'Sumerian / Akkadian / Standard Babylonian comparison layer', sourceRefs: [sourceRef('sumerianFlood', 'Ziusudra flood witness'), sourceRef('atrahasis', 'Atrahasis flood account'), sourceRef('gilgameshStandard', 'Tablet XI, Utnapištim flood account')] },
  { id: 'claim-meso-enuma-elish-scope', subjectType: 'character', subjectId: 'character-marduk', claimType: 'interpretation', summary: 'Enūma Eliš 是 Babylon-centered theological composition；Marduk 的提升不能被回填为所有 Sumerian 创世传统的通用结论。', status: 'supported', traditionScope: 'Babylonian theological composition', sourceRefs: [sourceRef('enumaElish', 'Tablets VI–VII, Marduk elevation and fifty names')] },
  { id: 'claim-meso-no-fixed-anunnaki-seven', subjectType: 'character', subjectId: 'character-anunnaki', claimType: 'identity', summary: 'Anunnaki / Anunna 的成员与功能随文本和时期变化；本包不固定“七位 Anunnaki”名单。', status: 'supported', traditionScope: 'Mesopotamian lexical and scholarly list tradition', sourceRefs: [sourceRef('anAnum', 'Anunnaki / Anunna list entries')] },
  { id: 'claim-meso-apsu-abzu-boundary', subjectType: 'character', subjectId: 'character-apsu-enuma-elish', claimType: 'identity', summary: 'Apsu 是 Enūma Eliš 中的神格 Character；Abzu 是地下淡水宇宙域 World，二者不可因词形相近而共用实体 ID。', status: 'supported', traditionScope: 'Babylonian Enūma Eliš and Sumerian freshwater cosmology', sourceRefs: [sourceRef('enumaElish', 'Tablet I, Apsû'), sourceRef('enkiWorldOrder', 'Enki and freshwater domain terminology')] },
  { id: 'claim-meso-tiamat-nammu-boundary', subjectType: 'character', subjectId: 'character-tiamat', claimType: 'identity', summary: 'Tiamat 保持在 Enūma Eliš 的 Babylonian lane；Nammu 是 Sumerian source-scoped identity，不因“原初水”功能相似而合并。', status: 'supported', traditionScope: 'Babylonian vs Sumerian source lanes', sourceRefs: [sourceRef('enumaElish', 'Tablets I–V, Tiamat'), sourceRef('enkiNinhursaga', 'Nammu and primordial water references')] },
  { id: 'claim-meso-marduk-ashur-boundary', subjectType: 'character', subjectId: 'character-ashur', claimType: 'identity', summary: 'Ashur 与 Marduk 保持分离；Assyrian theology 可以改写或借用 Babylonian 语言，但这不是默认 same-as。', status: 'supported', traditionScope: 'Neo-Assyrian theological adaptation', sourceRefs: [sourceRef('assyrianCult', 'Ashur and inherited Babylonian theological language'), sourceRef('enumaElish', 'Babylon-centered Marduk elevation')] },
  { id: 'claim-meso-nergal-erra-boundary', subjectType: 'character', subjectId: 'character-nergal', claimType: 'identity', summary: 'Nergal 与 Erra 默认保持分离；功能接近或后期神学关联需另有 source-scoped 证据，不能自动建立 same-as。', status: 'contested', traditionScope: 'Akkadian underworld and later theological comparison', sourceRefs: [sourceRef('nergalEreshkigal', 'Nergal identity and later relationship evidence'), sourceRef('anAnum', 'Nergal / Erra scholarly correspondence scope')] },
  { id: 'claim-meso-ninurta-ningirsu-boundary', subjectType: 'character', subjectId: 'character-ninurta', claimType: 'identity', summary: 'Ninurta 与 Ningirsu 默认保持分离；本包只发布 Ninurta 所需的 Lugal-e / heroic-order source lane。', status: 'supported', traditionScope: 'Sumerian heroic-order source lane', sourceRefs: [sourceRef('lugalE', 'Ninurta identity and heroic-order sequence')] },
  { id: 'claim-meso-adapa-adam-boundary', subjectType: 'character', subjectId: 'character-adapa', claimType: 'identity', summary: 'Adapa 是 Akkadian 智者人物；本包不建立 Adapa = Adam 的 same-as 或语言推导主张。', status: 'supported', traditionScope: 'Akkadian literary tradition', sourceRefs: [sourceRef('adapa', 'Adapa narrative opening and food-of-life sequence')] },
  { id: 'claim-meso-ishtar-local-scope', subjectType: 'character', subjectId: 'character-inanna-ishtar', claimType: 'interpretation', summary: 'Nineveh 与 Arbela 的 Ishtar 作为地方 manifestation 进入 Interpretation，不覆盖 Uruk Inanna 或所有 Ištar 传统。', status: 'supported', traditionScope: 'Neo-Assyrian local-cult scope', sourceRefs: [sourceRef('assyrianCult', 'Nineveh and Arbela local-cult evidence'), sourceRef('iconography', 'object-specific Ishtar identification scope')] },
  { id: 'claim-meso-tiamat-visual-boundary', subjectType: 'character', subjectId: 'character-tiamat', claimType: 'visual-anchor', summary: '多头水生 / 蛇形轮廓属于 MythCanvas 原创设计选项，不被描述成 Enūma Eliš 的唯一古代图像证据。', status: 'editorial-synthesis', traditionScope: 'MythCanvas visual interpretation', sourceRefs: [sourceRef('enumaElish', 'Tiamat textual role in Tablets I–V'), sourceRef('iconography', 'absence / scope of direct Tiamat iconographic identification')] },
  { id: 'claim-meso-no-readable-cuneiform', subjectType: 'visual-anchor', subjectId: 'concept-meso-me', claimType: 'visual-anchor', summary: '除非经过逐字核对，视觉资产中的楔形文字只可作为不可读装饰性符号，不宣称为真实铭文。', status: 'supported', traditionScope: 'MythCanvas visual QA policy', sourceRefs: [sourceRef('iconography', 'cuneiform object and inscription identification policy')] },
];
