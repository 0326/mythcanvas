import type { MythStorySource, SourceRef, SourceRefType } from '../../lib/content/types';

export type AztecSource = {
  sourceId: string;
  title: string;
  type: SourceRefType;
  storyType: MythStorySource['sourceType'];
  tradition: string;
  period: string;
  language?: string;
  edition?: string;
  url?: string;
  note: string;
};

/** Stable source registry. Locators are editorially stable topic/section keys,
 * not invented page numbers that would change with every translation. */
export const aztecSources = {
  florentineBook1: {
    sourceId: 'aztec-florentine-book1',
    title: 'Florentine Codex, Book 1: The Gods',
    type: 'primary-text', storyType: 'translation',
    tradition: 'Colonial Nahua witness with Indigenous collaborators',
    period: '16th-century colonial record of Nahua traditions', language: 'nah',
    edition: 'Bernardino de Sahagún; General History of the Things of New Spain, Book 1',
    url: 'https://www.wdl.org/en/item/10096/',
    note: 'A colonial Nahuatl/Spanish witness; not a transparent transcript of one pre-contact canon.',
  },
  florentineBook2: {
    sourceId: 'aztec-florentine-book2',
    title: 'Florentine Codex, Book 2: Ceremonies',
    type: 'primary-text', storyType: 'translation',
    tradition: 'Colonial Nahua witness with Indigenous collaborators',
    period: '16th-century colonial record of Nahua ritual practice', language: 'nah',
    edition: 'Bernardino de Sahagún; General History of the Things of New Spain, Book 2',
    url: 'https://www.wdl.org/en/item/10096/',
    note: 'Used for ceremony and festival context; ritual description is not treated as a spectacle prompt.',
  },
  florentineBook3: {
    sourceId: 'aztec-florentine-book3',
    title: 'Florentine Codex, Book 3: The Origin of the Gods',
    type: 'primary-text', storyType: 'translation',
    tradition: 'Colonial Nahua witness with Indigenous collaborators',
    period: '16th-century colonial record of Nahua traditions', language: 'nah',
    edition: 'Bernardino de Sahagún; General History of the Things of New Spain, Book 3',
    url: 'https://www.wdl.org/en/item/10096/',
    note: 'Core source lane for the birth of Huitzilopochtli and related origin material.',
  },
  leyendaSoles: {
    sourceId: 'aztec-legend-of-the-suns',
    title: 'Leyenda de los Soles',
    type: 'primary-text', storyType: 'translation',
    tradition: 'Central Mexican Nahua textual tradition',
    period: '1558 colonial Nahuatl manuscript witness', language: 'nah',
    edition: 'Codex Chimalpopoca corpus; modern translated editions vary',
    note: 'One source lane for world-age sequence and creation; it must not be silently merged with every Five Suns account.',
  },
  annalsCuauhtitlan: {
    sourceId: 'aztec-annals-cuauhtitlan',
    title: 'Anales de Cuauhtitlan',
    type: 'primary-text', storyType: 'translation',
    tradition: 'Nahua Cuauhtitlan tradition',
    period: '16th-century colonial record of earlier Nahua traditions', language: 'nah',
    edition: 'Codex Chimalpopoca corpus; translated editions vary',
    note: 'Used as a distinct Cuauhtitlan source scope, especially for Topiltzin and Central Mexican narrative bridges.',
  },
  codexChimalpopoca: {
    sourceId: 'aztec-codex-chimalpopoca',
    title: 'Codex Chimalpopoca corpus',
    type: 'historical-record', storyType: 'scholarly-reference',
    tradition: 'Central Mexican Nahua colonial manuscript corpus',
    period: '16th-century colonial manuscript record', language: 'nah',
    note: 'A managed corpus label; individual works inside it retain their own source identity and locator.',
  },
  codexBorbonicus: {
    sourceId: 'aztec-codex-borbonicus',
    title: 'Codex Borbonicus',
    type: 'historical-record', storyType: 'scholarly-reference',
    tradition: 'Central Mexican ritual codex tradition',
    period: 'Early colonial period; pre-contact or early colonial dating debated', language: 'nah',
    note: 'Ritual/calendar imagery is source-scoped and is not labeled Mexica-only by default.',
  },
  codexBoturini: {
    sourceId: 'aztec-codex-boturini',
    title: 'Codex Boturini / Tira de la Peregrinación',
    type: 'historical-record', storyType: 'scholarly-reference',
    tradition: 'Mexica migration pictorial tradition',
    period: '16th-century colonial pictorial record', language: 'nah',
    note: 'Used for migration and foundation memory with explicit uncertainty around route interpretation.',
  },
  codexAzcatitlan: {
    sourceId: 'aztec-codex-azcatitlan',
    title: 'Codex Azcatitlan',
    type: 'historical-record', storyType: 'scholarly-reference',
    tradition: 'Central Mexican pictorial historical tradition',
    period: '16th-century colonial pictorial record', language: 'nah',
    note: 'Used as a separate historical witness for migration and Mexica history, not as a pure mythic script.',
  },
  codexBorgia: {
    sourceId: 'aztec-codex-borgia',
    title: 'Codex Borgia Group',
    type: 'historical-record', storyType: 'scholarly-reference',
    tradition: 'Central Mexican ritual codex group',
    period: 'Late pre-contact / early colonial dating debated', language: 'nah',
    note: 'The Borgia Group is not automatically assigned to the Mexica or Tenochtitlan tradition.',
  },
  temploMayor: {
    sourceId: 'aztec-templo-mayor-archaeology',
    title: 'Templo Mayor and Sacred Precinct archaeological record',
    type: 'academic-secondary', storyType: 'scholarly-reference',
    tradition: 'Mexica-Tenochtitlan archaeological context',
    period: '14th–16th-century Mexica city; modern archaeological record',
    edition: 'INAH archaeological publications and museum catalogues',
    url: 'https://www.templomayor.inah.gob.mx/',
    note: 'Archaeological evidence and modern interpretation; not a literal transcription of a myth episode.',
  },
  monolithCoyolxauhqui: {
    sourceId: 'aztec-coyolxauhqui-monolith',
    title: 'Coyolxauhqui Monolith',
    type: 'academic-secondary', storyType: 'scholarly-reference',
    tradition: 'Mexica-Tenochtitlan archaeological context',
    period: 'Late 15th-century Mexica monument',
    edition: 'Museo del Templo Mayor object documentation',
    url: 'https://www.templomayor.inah.gob.mx/',
    note: 'Object evidence for an archaeological scene; the image should not default to graphic dismemberment.',
  },
  sculptureCoatlicue: {
    sourceId: 'aztec-coatlicue-sculpture',
    title: 'Coatlicue sculpture object record',
    type: 'academic-secondary', storyType: 'scholarly-reference',
    tradition: 'Mexica sculptural context',
    period: 'Late Mexica period; conventional dating varies by catalogue',
    edition: 'Museo Nacional de Antropología object documentation',
    note: 'Object evidence for iconographic discussion, distinct from a story text.',
  },
  monolithTlaltecuhtli: {
    sourceId: 'aztec-tlaltecuhtli-monolith',
    title: 'Tlaltecuhtli Monolith',
    type: 'academic-secondary', storyType: 'scholarly-reference',
    tradition: 'Mexica-Tenochtitlan archaeological context',
    period: 'Late 15th-century Mexica monument',
    edition: 'Museo del Templo Mayor object documentation',
    note: 'The title preserves the object identity; gendered interpretations remain explicit rather than silently fixed.',
  },
  codexTelleriano: {
    sourceId: 'aztec-codex-telleriano-remensis',
    title: 'Codex Telleriano-Remensis',
    type: 'historical-record', storyType: 'scholarly-reference',
    tradition: 'Central Mexican colonial pictorial and calendrical record',
    period: '16th-century colonial manuscript', language: 'nah',
    note: 'Used for calendar and festival context with colonial mediation acknowledged.',
  },
} as const satisfies Record<string, AztecSource>;

export type AztecSourceKey = keyof typeof aztecSources;

export const sourceRef = (key: AztecSourceKey, locator: string, note?: string): SourceRef => {
  const source = aztecSources[key] as AztecSource;
  return { sourceId: source.sourceId, type: source.type, title: source.title, period: source.period, edition: source.edition, language: source.language, url: source.url, locator, note: note ?? source.note };
};

export const storySource = (key: AztecSourceKey, locator: string, note?: string): MythStorySource => {
  const source = aztecSources[key] as AztecSource;
  return { sourceId: source.sourceId, title: source.title, sourceType: source.storyType, tradition: source.tradition, period: source.period, locator, language: source.language, translation: source.edition, url: source.url, note: note ?? source.note };
};
