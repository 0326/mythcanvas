import type { ContentSource, MythStorySource, SourceRef } from '../../lib/content/types';

/**
 * Canonical source registry for the Norse package. Source metadata is static
 * content; Story/Claim records cite a sourceId plus a stable poem/stanza or
 * chapter locator instead of inventing per-story bibliography fragments.
 */
const source = (
  sourceId: string,
  title: string,
  sourceFamily: NonNullable<ContentSource['sourceFamily']>,
  tradition: string,
  period: string,
  note: string,
  options: Partial<Pick<ContentSource, 'author' | 'url' | 'edition' | 'language' | 'manuscriptContext' | 'region' | 'evidenceRoles' | 'licenseNote'>> = {},
): ContentSource => ({
  sourceId,
  title,
  type: sourceFamily === 'material-culture' ? 'historical-record' : sourceFamily === 'academic-secondary' ? 'academic-secondary' : 'primary-text',
  storyType: sourceFamily === 'material-culture' || sourceFamily === 'academic-secondary' ? 'scholarly-reference' : 'translation',
  tradition,
  period,
  language: options.language ?? (sourceFamily === 'material-culture' || sourceFamily === 'academic-secondary' ? undefined : 'non'),
  sourceFamily,
  evidenceRoles: options.evidenceRoles ?? (sourceFamily === 'material-culture' ? ['visual-context'] : ['narrative', 'identity', 'relation']),
  note,
  edition: options.edition ?? 'Editorially approved text / translation; cite stable poem, stanza, or chapter locators.',
  url: options.url,
  manuscriptContext: options.manuscriptContext,
  region: options.region,
  author: options.author,
  licenseNote: options.licenseNote ?? 'Use MythCanvas original Chinese prose. Verify quotation and translation rights before publishing excerpts.',
});

/**
 * Direct working-text entry points make the review queue actionable. The
 * registry still keeps the edition-level landing page semantics, but a
 * reviewer should not have to search a contents page for every poem.
 */
const poeticSourcePages: Readonly<Record<string, string>> = {
  voluspa: 'https://sacred-texts.com/neu/poe/poe03.htm',
  havamal: 'https://sacred-texts.com/neu/poe/poe04.htm',
  vafthrudnismal: 'https://sacred-texts.com/neu/poe/poe05.htm',
  grimnismal: 'https://sacred-texts.com/neu/poe/poe06.htm',
  skirnismal: 'https://sacred-texts.com/neu/poe/poe07.htm',
  harbardsljod: 'https://sacred-texts.com/neu/poe/poe08.htm',
  hymiskvida: 'https://sacred-texts.com/neu/poe/poe09.htm',
  lokasenna: 'https://sacred-texts.com/neu/poe/poe10.htm',
  thrymskvida: 'https://sacred-texts.com/neu/poe/poe11.htm',
  alvissmal: 'https://sacred-texts.com/neu/poe/poe12.htm',
  'baldrs-draumar': 'https://sacred-texts.com/neu/poe/poe13.htm',
  hyndluljod: 'https://sacred-texts.com/neu/poe/poe15.htm',
  rigsthula: 'https://sacred-texts.com/neu/poe/poe14.htm',
  svipdagsmal: 'https://sacred-texts.com/neu/poe/poe16.htm',
};

const heroicSourcePages: Readonly<Record<string, string>> = {
  volundarkvida: 'https://sacred-texts.com/neu/poe/poe17.htm',
  'helgakvida-hjorvardssonar': 'https://sacred-texts.com/neu/poe/poe18.htm',
  'helgakvida-hundingsbana-1': 'https://sacred-texts.com/neu/poe/poe19.htm',
  'helgakvida-hundingsbana-2': 'https://sacred-texts.com/neu/poe/poe20.htm',
  gripisspa: 'https://sacred-texts.com/neu/poe/poe22.htm',
  reginsmal: 'https://sacred-texts.com/neu/poe/poe23.htm',
  fafnismal: 'https://sacred-texts.com/neu/poe/poe24.htm',
  sigrdrifumal: 'https://sacred-texts.com/neu/poe/poe25.htm',
  sigurdarkvida: 'https://sacred-texts.com/neu/poe/poe28.htm',
  'gudrunarkvida-1': 'https://sacred-texts.com/neu/poe/poe27.htm',
  'gudrunarkvida-2': 'https://sacred-texts.com/neu/poe/poe31.htm',
  'gudrunarkvida-3': 'https://sacred-texts.com/neu/poe/poe32.htm',
  'helreid-brynhildar': 'https://sacred-texts.com/neu/poe/poe29.htm',
  oddrunargratr: 'https://sacred-texts.com/neu/poe/poe33.htm',
  atlakvida: 'https://sacred-texts.com/neu/poe/poe34.htm',
  atlamal: 'https://sacred-texts.com/neu/poe/poe35.htm',
  gudrunarhvot: 'https://sacred-texts.com/neu/poe/poe36.htm',
  hamdismal: 'https://sacred-texts.com/neu/poe/poe37.htm',
};

const poetic = (id: string, title: string, note: string) => source(
  `norse-src-${id}`,
  title,
  'eddic-mythological',
  'Eddic mythological poetry',
  'Medieval Icelandic manuscript witnesses preserving older poetic material',
  note,
  {
    url: poeticSourcePages[id] ?? 'https://sacred-texts.com/neu/poe/index.htm',
    edition: 'Henry Adams Bellows, The Poetic Edda (1936), English working translation; use poem and stanza locators rather than page-only citations.',
    manuscriptContext: 'Codex Regius and related manuscript witnesses; not a single Viking-Age canon.',
    region: 'Icelandic manuscript record',
    licenseNote: 'The Sacred Texts copy identifies this Bellows edition as public domain in the United States. MythCanvas publishes original Chinese prose; do not reproduce modern translations without a separate rights check.',
  },
);

const heroic = (id: string, title: string, note: string) => source(
  `norse-src-${id}`,
  title,
  'eddic-heroic',
  'Eddic heroic poetry',
  'Medieval Icelandic manuscript witnesses preserving layered heroic traditions',
  note,
  {
    url: heroicSourcePages[id] ?? 'https://sacred-texts.com/neu/poe/index.htm',
    edition: 'Henry Adams Bellows, The Poetic Edda (1936), English working translation; use poem and stanza locators rather than page-only citations.',
    manuscriptContext: 'Heroic poems are not collapsed into the Prose Edda or Völsunga saga.',
    region: 'Icelandic manuscript record',
    licenseNote: 'The Sacred Texts copy identifies this Bellows edition as public domain in the United States. MythCanvas publishes original Chinese prose; do not reproduce modern translations without a separate rights check.',
  },
);

const sources = {
  voluspa: poetic('voluspa', 'Völuspá', 'Primary P0 source for creation, cosmic structure and Ragnarök; preserve its poem-specific scope.'),
  havamal: poetic('havamal', 'Hávamál', 'Primary P0 source for Odin’s self-sacrifice and wisdom material; do not turn every maxim into biography.'),
  vafthrudnismal: poetic('vafthrudnismal', 'Vafþrúðnismál', 'Primary P0 source for cosmic knowledge contest and Ragnarök foreknowledge.'),
  grimnismal: poetic('grimnismal', 'Grímnismál', 'Primary P0 source for Odin’s disguised knowledge and named cosmological material.'),
  skirnismal: poetic('skirnismal', 'Skírnismál', 'Primary P0 source for Freyr, Gerðr and Skírnir; coercive language requires contextual editorial treatment.'),
  harbardsljod: poetic('harbardsljod', 'Hárbarðsljóð', 'Primary P0 source for the Thor / Hárbarðr contest; identity readings remain source-scoped.'),
  hymiskvida: poetic('hymiskvida', 'Hymiskviða', 'Primary P0 source for Thor’s fishing expedition and the giant cauldron.'),
  lokasenna: poetic('lokasenna', 'Lokasenna', 'Primary P0 source for the flyting; accusations are speech acts, not automatically settled facts.'),
  thrymskvida: poetic('thrymskvida', 'Þrymskviða', 'Primary P0 source for Þrymr’s theft of Mjölnir and Thor’s disguise.'),
  alvissmal: poetic('alvissmal', 'Alvíssmál', 'Primary P0 source for Thor and Alvíss; the poem’s knowledge contest is not a generic dwarf taxonomy.'),
  baldrsDraumar: poetic('baldrs-draumar', 'Baldrs draumar', 'Primary P0 source for Baldr’s dreams and Odin’s journey; keep distinct from Snorri’s death narrative.'),
  hyndluljod: poetic('hyndluljod', 'Hyndluljóð', 'P0 genealogy and Freyja context; use as Claim support unless a discrete narrative warrants a Story.'),
  rigsthula: poetic('rigsthula', 'Rígsþula', 'P1 social-order poem; Rígr identity is disputed and must be source-scoped.'),
  grottasongr: source(
    'norse-src-grottasongr',
    'Grottasöngr',
    'eddic-mythological',
    'Eddic poetry preserved with Snorra Edda material',
    'Medieval manuscript preservation of a related Eddic poem',
    'P2 poem for independent tradition / social context; it is preserved with Snorra Edda material rather than treated as a Codex Regius main-cycle poem.',
    {
      url: 'https://www.voluspa.org/grottasongr.htm',
      edition: 'Benjamin Thorpe, Edda Sæmundar hinns fróða, Part II (1866), English working translation; verify against a critical edition before publication.',
      manuscriptContext: 'Preserved in manuscripts of Snorra Edda / Skáldskaparmál; transmission and dating remain distinct from the Codex Regius core.',
      region: 'Icelandic manuscript record',
      licenseNote: 'Use the public-domain working translation only for research and locator alignment; verify the hosting site and any modern editorial material before redistribution.',
    },
  ),
  svipdagsmal: poetic('svipdagsmal', 'Grógaldr / Fjölsvinnsmál', 'P1 source for the Svipdagr cycle; record textual scope and editorial split decision.'),

  proseEddaGylfaginning: source('norse-src-prose-edda-gylfaginning', 'Snorri Sturluson, Gylfaginning', 'prose-edda', 'Snorri’s Edda / Gylfaginning', '13th-century Icelandic prose witness', 'A learned medieval retelling that preserves and organizes mythic material; do not present as a single pagan scripture.', { url: 'https://sacred-texts.com/neu/pre/pre04.htm', edition: 'Arthur Gilchrist Brodeur, The Prose Edda (1916), English working translation; cite Gylfaginning chapter locators.', manuscriptContext: 'Snorra Edda manuscript tradition', region: 'Iceland', licenseNote: 'Use the public-domain working edition only for research and locator alignment. MythCanvas publishes original Chinese prose; quotation rights for any other edition must be checked separately.' }),
  proseEddaSkaldskaparmal: source('norse-src-prose-edda-skaldskaparmal', 'Snorri Sturluson, Skáldskaparmál', 'prose-edda', 'Snorri’s Edda / Skáldskaparmál', '13th-century Icelandic prose witness', 'A poetics text that preserves narrative material and kennings; cite the relevant chapter, not only the book title.', { url: 'https://sacred-texts.com/neu/pre/pre05.htm', edition: 'Arthur Gilchrist Brodeur, The Prose Edda (1916), English working translation; cite Skáldskaparmál chapter locators.', manuscriptContext: 'Snorra Edda manuscript tradition', region: 'Iceland', licenseNote: 'Use the public-domain working edition only for research and locator alignment. MythCanvas publishes original Chinese prose; quotation rights for any other edition must be checked separately.' }),

  haustlong: source('norse-src-haustlong', 'Þjóðólfr of Hvinir, Haustlöng', 'skaldic', 'Skaldic mythological poetry', 'Medieval manuscript preservation of early skaldic verse', 'Key source lane for Þjazi / Iðunn and Hrungnir traditions.', { url: 'https://skaldic.org/', edition: 'Skaldic Poetry of the Scandinavian Middle Ages electronic / print edition; record poem and stanza plus the consulted edition before reader-facing quotation.', evidenceRoles: ['narrative', 'identity', 'relation'], region: 'Scandinavia / Icelandic manuscript record', licenseNote: 'The Skaldic Project and linked database material may be copyright restricted. Use for research and citation; obtain permission before reproducing translation or database text.' }),
  thorsdrapa: source('norse-src-thorsdrapa', 'Eilífr Goðrúnarson, Þórsdrápa', 'skaldic', 'Skaldic mythological poetry', 'Medieval manuscript preservation of skaldic verse', 'Key source lane for Thor’s Geirröðr expedition.', { url: 'https://skaldic.org/', edition: 'Skaldic Poetry of the Scandinavian Middle Ages electronic / print edition; record poem and stanza plus the consulted edition before reader-facing quotation.', evidenceRoles: ['narrative', 'identity', 'relation'], region: 'Scandinavia / Icelandic manuscript record', licenseNote: 'The Skaldic Project and linked database material may be copyright restricted. Use for research and citation; obtain permission before reproducing translation or database text.' }),
  husdrapa: source('norse-src-husdrapa', 'Úlfr Uggason, Húsdrápa', 'skaldic', 'Skaldic mythological poetry', 'Medieval manuscript preservation of skaldic verse', 'Key source lane for Baldr’s funeral imagery and mythic scenes.', { url: 'https://skaldic.org/', edition: 'Skaldic Poetry of the Scandinavian Middle Ages electronic / print edition; record poem and stanza plus the consulted edition before reader-facing quotation.', evidenceRoles: ['narrative', 'visual-context'], region: 'Icelandic manuscript record', licenseNote: 'The Skaldic Project and linked database material may be copyright restricted. Use for research and citation; obtain permission before reproducing translation or database text.' }),
  ragnarsdrapa: source('norse-src-ragnarsdrapa', 'Bragi Boddason, Ragnarsdrápa', 'skaldic', 'Skaldic mythological poetry', 'Medieval manuscript preservation of early skaldic verse', 'Parallel source lane for Thor’s fishing and selected mythic scenes.', { url: 'https://skaldic.org/', edition: 'Skaldic Poetry of the Scandinavian Middle Ages electronic / print edition; record poem and stanza plus the consulted edition before reader-facing quotation.', evidenceRoles: ['narrative', 'visual-context'], region: 'Scandinavia / Icelandic manuscript record', licenseNote: 'The Skaldic Project and linked database material may be copyright restricted. Use for research and citation; obtain permission before reproducing translation or database text.' }),

  volundarkvida: heroic('volundarkvida', 'Völundarkviða', 'P1 source for Völundr; preserve the poem’s severe violence and agency without sensationalism.'),
  helgakvidaHjorvardssonar: heroic('helgakvida-hjorvardssonar', 'Helgakviða Hjörvarðssonar', 'P1 source for Helgi Hjörvarðsson and Sváfa.'),
  helgakvidaHundingsbana1: heroic('helgakvida-hundingsbana-1', 'Helgakviða Hundingsbana I', 'P1 source for Helgi Hundingsbani and Sigrún.'),
  helgakvidaHundingsbana2: heroic('helgakvida-hundingsbana-2', 'Helgakviða Hundingsbana II', 'P1 source for Helgi, Sigrún and return motifs.'),
  gripisspa: heroic('gripisspa', 'Grípisspá', 'P0 source for Sigurd’s future; distinguish prophecy from later saga ordering.'),
  reginsmal: heroic('reginsmal', 'Reginsmál', 'P0 source for Regin, Hreiðmarr, Ótr and the cursed treasure.'),
  fafnismal: heroic('fafnismal', 'Fáfnismál', 'P0 source for Fafnir, Sigurd and dragon-blood knowledge.'),
  sigrdrifumal: heroic('sigrdrifumal', 'Sigrdrífumál', 'P0 source for Sigrdrífa material; do not silently collapse identities with every Brynhildr witness.'),
  sigurdarkvida: heroic('sigurdarkvida', 'Sigurðarkviða in skamma / fragmentary Sigurd poems', 'P0 source lane for the fragmented Sigurd death tradition.'),
  gudrunarkvida1: heroic('gudrunarkvida-1', 'Guðrúnarkviða I', 'P0 source for Guðrún after Sigurd’s death.'),
  gudrunarkvida2: heroic('gudrunarkvida-2', 'Guðrúnarkviða II', 'P0 source for Guðrún’s memory and marriage tradition.'),
  gudrunarkvida3: heroic('gudrunarkvida-3', 'Guðrúnarkviða III', 'P1 source for later Guðrún material.'),
  helreidBrynhildar: heroic('helreid-brynhildar', 'Helreið Brynhildar', 'P0 source for Brynhildr’s death-ride and alternate interpretive material.'),
  oddrunargratr: heroic('oddrunargratr', 'Oddrúnargrátr', 'P1 source for the Atli / Gunnar tradition.'),
  atlakvida: heroic('atlakvida', 'Atlakviða', 'P0 source for Atli, Gunnar, Högni and Guðrún’s revenge cycle.'),
  atlamal: heroic('atlamal', 'Atlamál in grœnlenzku', 'P1 parallel Atli tradition; do not merge its details silently.'),
  gudrunarhvot: heroic('gudrunarhvot', 'Guðrúnarhvöt', 'P1 source for Guðrún, Svanhildr and the later revenge cycle.'),
  hamdismal: heroic('hamdismal', 'Hamdismál', 'P1 source for Hamðir / Sörli and Jörmunrekkr tradition.'),

  volsungaSaga: source('norse-src-volsunga-saga', 'Völsunga saga', 'legendary-saga', 'Völsung legendary saga tradition', '13th-century Icelandic saga witness', 'A prose synthesis of heroic material; use alongside, not instead of, Eddic heroic poems.', { url: 'https://sacred-texts.com/neu/vlsng/index.htm', edition: 'Eiríkr Magnússon and William Morris, Völsunga Saga: The Story of the Volsungs and Niblungs (1870), English working translation; cite saga chapter locators.', manuscriptContext: 'Icelandic saga witness', region: 'Iceland', licenseNote: 'This nineteenth-century working translation is public-domain research material. MythCanvas publishes original Chinese prose; do not reproduce later translations without a rights check.' }),
  gestaDanorum: source('norse-src-gesta-danorum', 'Saxo Grammaticus, Gesta Danorum', 'regional-medieval', 'Danish Latin medieval witness', 'Late 12th–early 13th-century Latin composition', 'Use for scoped parallels and reception, not as a universal replacement for Eddic traditions.', { region: 'Denmark', language: 'la' }),
  ynglingaSaga: source('norse-src-ynglinga-saga', 'Ynglinga saga / Heimskringla', 'regional-medieval', 'Icelandic royal-saga witness', '13th-century Icelandic prose witness', 'Use only with its euhemeristic and historical framing made explicit.', { url: 'https://sacred-texts.com/neu/heim/02ynglga.htm', edition: 'Samuel Laing, Heimskringla: The Chronicle of the Kings of Norway (1844), English working translation; cite the Ynglinga saga chapter locator.', manuscriptContext: 'Heimskringla manuscript tradition; Snorri’s euhemeristic framing is not a direct transcript of pre-Christian belief.', region: 'Iceland', licenseNote: 'Use the public-domain working translation only for research and locator alignment. MythCanvas publishes original Chinese prose and must not imply that the medieval saga is an unmediated pagan canon.' }),

  mjolnirPendants: source('norse-src-mjolnir-pendants', 'Viking-Age Mjölnir pendants and museum catalogue records', 'material-culture', 'Scandinavian material culture', 'Viking-Age archaeological objects; individual catalogues vary', 'Visual-context evidence for Thor-associated iconography; it does not narrate Þrymskviða.', { url: 'https://historiska.se/', evidenceRoles: ['visual-context'], region: 'Scandinavia', licenseNote: 'Use object catalogues and images only under their stated rights.' }),
  gotlandPictureStones: source('norse-src-gotland-picture-stones', 'Gotland picture stones and museum catalogue records', 'material-culture', 'Gotlandic visual culture', 'Viking-Age / medieval material record', 'Visual-context evidence for imagery and scene comparison; identifications remain interpretive.', { url: 'https://historiska.se/', evidenceRoles: ['visual-context'], region: 'Gotland / Scandinavia', licenseNote: 'Use object catalogues and images only under their stated rights.' }),
  norseMythologyAcademic: source('norse-src-academic-norse-mythology', 'Academic Norse mythology and Old Norse religion research', 'academic-secondary', 'Modern scholarship', 'Modern scholarly editions and studies', 'Use to explain witness history, chronology and conflict; never label it primary text.', { evidenceRoles: ['reception', 'visual-context'], licenseNote: 'Record the specific book or paper and locator before citing in reader-facing content.' }),
} as const satisfies Record<string, ContentSource>;

export type NorseSourceKey = keyof typeof sources;

export const norseSources: readonly ContentSource[] = Object.values(sources);

const getSource = (key: NorseSourceKey): ContentSource => sources[key];

export const sourceRef = (key: NorseSourceKey, locator: string, note?: string): SourceRef => {
  const item = getSource(key);
  return {
    sourceId: item.sourceId,
    type: item.type,
    title: item.title,
    author: item.author,
    period: item.period,
    edition: item.edition,
    language: item.language,
    url: item.url,
    locator,
    note: note ?? item.note,
  };
};

export const storySource = (key: NorseSourceKey, locator: string, note?: string): MythStorySource => {
  const item = getSource(key);
  return {
    sourceId: item.sourceId,
    title: item.title,
    sourceType: item.storyType,
    tradition: item.tradition,
    period: item.period,
    language: item.language,
    translation: item.edition,
    url: item.url,
    locator,
    note: note ?? item.note,
  };
};
