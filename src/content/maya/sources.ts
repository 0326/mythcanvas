import type { MythStorySource, SourceRef, SourceRefType } from '../../lib/content/types';

export type MayaSource = {
  sourceId: string;
  title: string;
  author?: string;
  type: SourceRefType;
  storyType: MythStorySource['sourceType'];
  tradition: string;
  period: string;
  language?: string;
  edition?: string;
  url?: string;
  note?: string;
};

export const mayaSources = {
  popolVuh: {
    sourceId: 'source-maya-popol-vuh-christenson',
    title: 'Popol Vuh',
    author: 'Allen J. Christenson, translator and editor',
    type: 'primary-text',
    storyType: 'translation',
    tradition: "K'iche' tradition",
    period: 'Colonial K’iche’ record of an older tradition',
    language: 'kic',
    edition: 'Allen J. Christenson, literal K’iche’ translation and commentary',
    url: 'https://www.famsi.org/research/vanstone/2012/PopolVuhBrief.pdf',
    note: 'Used as a source lane for the K’iche’ narrative spine; the page does not present it as a universal Maya canon.',
  },
  popolVuhDigital: {
    sourceId: 'source-maya-popol-vuh-digital',
    title: 'Popol Vuh: A New English Version',
    author: 'Michael Bazzett, translator',
    type: 'primary-text',
    storyType: 'translation',
    tradition: "K'iche' tradition",
    period: 'Colonial K’iche’ record of an older tradition',
    language: 'kic',
    edition: 'Digital translation excerpt',
    url: 'https://journals.upress.ufl.edu/delos/article/view/1005',
    note: 'Secondary translation reference used to cross-check narrative vocabulary, not to silently merge translations.',
  },
  dresden: {
    sourceId: 'source-maya-dresden-codex',
    title: 'Dresden Codex',
    type: 'historical-record',
    storyType: 'scholarly-reference',
    tradition: 'Postclassic Maya codical tradition',
    period: 'Postclassic Maya',
    language: 'myn',
    url: 'https://www.famsi.org/mayawriting/codices/dresden.html',
    note: 'Used for source-scoped rain, calendrical and astronomical context; not treated as a continuous story book.',
  },
  chilamBalam: {
    sourceId: 'source-maya-chilam-balam-chumayel',
    title: 'The Book of Chilam Balam of Chumayel',
    author: 'Ralph L. Roys, translator',
    type: 'historical-record',
    storyType: 'translation',
    tradition: 'Colonial Yucatec Maya tradition',
    period: 'Colonial Yucatec record',
    language: 'yua',
    edition: 'Smithsonian Institution digital record',
    url: 'https://www.si.edu/object/book-chilam-balam-chumayel-translated-ralph-l-roys-introd-j-eric-s-thompson%3Asiris_sil_11756',
    note: 'Used for later Yucatec naming and ritual context, without overwriting Classic Maya identities.',
  },
  ritualBacabs: {
    sourceId: 'source-maya-ritual-of-the-bacabs',
    title: 'Ritual of the Bacabs',
    type: 'historical-record',
    storyType: 'scholarly-reference',
    tradition: 'Colonial Yucatec healing and ritual record',
    period: 'Colonial Yucatec record',
    language: 'yua',
    url: 'https://www.famsi.org/research/loubat/Ritual_of_the_Bacabs.pdf',
    note: 'Reserved for source-scoped healing and directional ritual context.',
  },
  classicBridge: {
    sourceId: 'source-maya-classic-iconography-bridge',
    title: 'Classic Maya monument, vessel and inscription evidence',
    type: 'academic-secondary',
    storyType: 'scholarly-reference',
    tradition: 'Classic Lowland Maya evidence',
    period: 'Classic Maya',
    language: 'myn',
    note: 'A managed editorial source lane for individually catalogued objects; not a claim that one object preserves a complete myth.',
  },
} as const satisfies Record<string, MayaSource>;

export type MayaSourceKey = keyof typeof mayaSources;

export const sourceRef = (key: MayaSourceKey, locator: string, note?: string): SourceRef => {
  const source = mayaSources[key] as MayaSource;
  return {
    sourceId: source.sourceId,
    type: source.type,
    title: source.title,
    author: source.author,
    period: source.period,
    edition: source.edition,
    locator,
    language: source.language,
    url: source.url,
    note: note ?? source.note,
  };
};

export const storySource = (key: MayaSourceKey, locator: string, note?: string): MythStorySource => {
  const source = mayaSources[key] as MayaSource;
  return {
    sourceId: source.sourceId,
    title: source.title,
    sourceType: source.storyType,
    tradition: source.tradition,
    period: source.period,
    locator,
    language: source.language,
    translation: source.edition,
    url: source.url,
    note: note ?? source.note,
  };
};
