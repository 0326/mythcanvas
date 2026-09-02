import type { ContentSource, MythStorySource, SourceRef, SourceRefType } from '../../lib/content/types';

export type CelticSource = ContentSource;

const sources = {
  cathMaigeTuired: {
    sourceId: 'celtic-src-cath-maige-tuired', title: 'Cath Maige Tuired', author: 'Medieval Irish narrative tradition',
    type: 'primary-text' as SourceRefType, storyType: 'translation' as MythStorySource['sourceType'], tradition: 'Irish Mythological Cycle / Tuatha Dé Danann', period: 'Medieval manuscript record of older narrative layers', language: 'Middle Irish', edition: 'Whitley Stokes, Revue Celtique 12 (1891)', url: 'https://celt.ucc.ie/', note: 'A medieval literary witness is not treated as a verbatim record of Iron Age religion.',
  },
  tainR1: {
    sourceId: 'celtic-src-tain-r1', title: 'Táin Bó Cúailnge, Recension I', author: 'Medieval Irish narrative tradition',
    type: 'primary-text' as SourceRefType, storyType: 'translation' as MythStorySource['sourceType'], tradition: 'Ulster Cycle', period: 'Medieval manuscript record with multiple textual layers', language: 'Middle Irish', edition: 'Cecile O’Rahilly, Táin Bó Cúalnge Recension I', url: 'https://celt.ucc.ie/', note: 'Recension I is kept separate from Recension II; details are not silently harmonized.',
  },
  tainR2: {
    sourceId: 'celtic-src-tain-r2', title: 'Táin Bó Cúailnge, Recension II', author: 'Medieval Irish narrative tradition',
    type: 'primary-text' as SourceRefType, storyType: 'translation' as MythStorySource['sourceType'], tradition: 'Ulster Cycle', period: 'Medieval manuscript record with multiple textual layers', language: 'Middle Irish', edition: 'Cecile O’Rahilly, Táin Bó Cúalnge Recension II', url: 'https://celt.ucc.ie/', note: 'Recension II is a distinct textual witness and may preserve different episode order or detail.',
  },
  noindenUlad: {
    sourceId: 'celtic-src-noinden-ulad', title: 'Noínden Ulad / The Debility of the Ulstermen', author: 'Medieval Irish narrative tradition',
    type: 'primary-text' as SourceRefType, storyType: 'translation' as MythStorySource['sourceType'], tradition: 'Ulster Cycle prelude', period: 'Medieval manuscript record', language: 'Middle Irish', edition: 'Kuno Meyer, The Death-Tales of the Ulster Heroes', url: 'https://celt.ucc.ie/', note: 'Macha is kept as a source-scoped character; this source does not authorize a fixed Mórrígan triad.',
  },
  aislingeOenguso: {
    sourceId: 'celtic-src-aislinge-oenguso', title: 'Aislinge Óenguso / The Dream of Óengus', author: 'Medieval Irish narrative tradition',
    type: 'primary-text' as SourceRefType, storyType: 'translation' as MythStorySource['sourceType'], tradition: 'Irish Mythological Cycle / Otherworld tale', period: 'Medieval manuscript record', language: 'Middle Irish', edition: 'Whitley Stokes, Revue Celtique 15 (1894)', url: 'https://celt.ucc.ie/',
  },
  macgnimarthaFind: {
    sourceId: 'celtic-src-macgnimartha-find', title: 'Macgnímartha Finn / The Boyhood Deeds of Finn', author: 'Medieval Irish narrative tradition',
    type: 'primary-text' as SourceRefType, storyType: 'translation' as MythStorySource['sourceType'], tradition: 'Fenian Cycle', period: 'Medieval manuscript record', language: 'Middle Irish', edition: 'Kuno Meyer, Macgnímartha Finn', url: 'https://celt.ucc.ie/',
  },
  leborGabala: {
    sourceId: 'celtic-src-lebor-gabala', title: 'Lebor Gabála Érenn / Book of Invasions', author: 'Medieval Irish mythographic tradition',
    type: 'primary-text' as SourceRefType, storyType: 'translation' as MythStorySource['sourceType'], tradition: 'Irish mythographic framework', period: 'Medieval compilation of layered materials', language: 'Middle Irish', edition: 'R. A. S. Macalister, Lebor Gabála Érenn', url: 'https://celt.ucc.ie/', note: 'A mythographic framework, not a single pan-Celtic scripture or archaeological report.',
  },
  whiteBook: {
    sourceId: 'celtic-src-white-book-rhydderch', title: 'White Book of Rhydderch witness', author: 'Welsh manuscript witness',
    type: 'primary-text' as SourceRefType, storyType: 'translation' as MythStorySource['sourceType'], tradition: 'Welsh Four Branches of the Mabinogi', period: '14th-century manuscript witness preserving older literary material', language: 'Middle Welsh', edition: 'The White Book of Rhydderch manuscript tradition', url: 'https://www.library.wales/', note: 'Witness metadata and later literary preservation are kept distinct from an imagined ancient orthodoxy.',
  },
  redBook: {
    sourceId: 'celtic-src-red-book-hergest', title: 'Red Book of Hergest witness', author: 'Welsh manuscript witness',
    type: 'primary-text' as SourceRefType, storyType: 'translation' as MythStorySource['sourceType'], tradition: 'Welsh Four Branches of the Mabinogi', period: 'Late 14th-century manuscript witness preserving older literary material', language: 'Middle Welsh', edition: 'The Red Book of Hergest manuscript tradition', url: 'https://www.library.wales/', note: 'Used as a witness lane alongside the White Book, not collapsed into one unmarked original.',
  },
  pwyll: {
    sourceId: 'celtic-src-pwyll', title: 'Pwyll Pendefig Dyfed', author: 'Middle Welsh narrative tradition',
    type: 'primary-text' as SourceRefType, storyType: 'translation' as MythStorySource['sourceType'], tradition: 'First Branch of the Mabinogi', period: 'Medieval Welsh literary record', language: 'Middle Welsh', edition: 'The Four Branches of the Mabinogi, scholarly translation', url: 'https://www.library.wales/',
  },
  branwen: {
    sourceId: 'celtic-src-branwen', title: 'Branwen ferch Llŷr', author: 'Middle Welsh narrative tradition',
    type: 'primary-text' as SourceRefType, storyType: 'translation' as MythStorySource['sourceType'], tradition: 'Second Branch of the Mabinogi', period: 'Medieval Welsh literary record', language: 'Middle Welsh', edition: 'The Four Branches of the Mabinogi, scholarly translation', url: 'https://www.library.wales/',
  },
  manawydan: {
    sourceId: 'celtic-src-manawydan', title: 'Manawydan fab Llŷr', author: 'Middle Welsh narrative tradition',
    type: 'primary-text' as SourceRefType, storyType: 'translation' as MythStorySource['sourceType'], tradition: 'Third Branch of the Mabinogi', period: 'Medieval Welsh literary record', language: 'Middle Welsh', edition: 'The Four Branches of the Mabinogi, scholarly translation', url: 'https://www.library.wales/',
  },
  math: {
    sourceId: 'celtic-src-math', title: 'Math fab Mathonwy', author: 'Middle Welsh narrative tradition',
    type: 'primary-text' as SourceRefType, storyType: 'translation' as MythStorySource['sourceType'], tradition: 'Fourth Branch of the Mabinogi', period: 'Medieval Welsh literary record', language: 'Middle Welsh', edition: 'The Four Branches of the Mabinogi, scholarly translation', url: 'https://www.library.wales/',
  },
  pillarNautes: {
    sourceId: 'celtic-src-pillar-of-nautes', title: 'Pilier des Nautes / Pillar of the Boatmen', author: 'Gallo-Roman dedicatory monument',
    type: 'local-cult-record' as SourceRefType, storyType: 'scholarly-reference' as MythStorySource['sourceType'], tradition: 'Gallo-Roman / Parisian cult evidence', period: 'Early 1st century CE', language: 'Latin and Gaulish', edition: 'Musée Carnavalet, archaeological catalogue', url: 'https://www.parismuseescollections.paris.fr/', note: 'Inscription and relief evidence; it does not supply a continuous Cernunnos epic.',
  },
  cernunnosEvidence: {
    sourceId: 'celtic-src-cernunnos-evidence', title: 'Cernunnos: epigraphic and iconographic evidence', author: 'Archaeological and religious-studies scholarship',
    type: 'academic-secondary' as SourceRefType, storyType: 'scholarly-reference' as MythStorySource['sourceType'], tradition: 'Continental / Gallo-Roman evidence', period: 'Evidence spanning Iron Age and Roman-period contexts', language: 'multiple', edition: 'Source-scoped museum and epigraphic catalogues', url: 'https://www.musee-archeologienationale.fr/', note: 'Antlered imagery is compared cautiously; the Gundestrup figure is not automatically named Cernunnos.',
  },
  eponaInscriptions: {
    sourceId: 'celtic-src-epona-inscriptions', title: 'Epona inscriptions and votive monuments', author: 'Epigraphic and archaeological record',
    type: 'local-cult-record' as SourceRefType, storyType: 'scholarly-reference' as MythStorySource['sourceType'], tradition: 'Continental / Gallo-Roman horse cult evidence', period: 'Roman-period evidence', language: 'Latin and local languages', edition: 'Epigraphic and museum catalogues', url: 'https://romaninscriptionsofbritain.org/', note: 'Horse-associated cult evidence is presented without inventing an Irish genealogy.',
  },
  caesarGaul: {
    sourceId: 'celtic-src-caesar-gaul', title: 'Julius Caesar, De Bello Gallico', author: 'Julius Caesar',
    type: 'historical-record' as SourceRefType, storyType: 'scholarly-reference' as MythStorySource['sourceType'], tradition: 'Roman external account of Gaul', period: '1st century BCE', language: 'Latin', edition: 'De Bello Gallico, Book 6', url: 'https://www.perseus.tufts.edu/', note: 'An external Roman observer’s account, not a transparent transcript of local theology.',
  },
} satisfies Record<string, CelticSource>;

export const celticSources: readonly CelticSource[] = Object.values(sources);

const byKey = (key: string): CelticSource => {
  const source = sources[key as keyof typeof sources];
  if (!source) throw new Error(`Unknown Celtic source key: ${key}`);
  return source;
};
export const sourceRef = (key: string, locator: string, note?: string): SourceRef => {
  const source = byKey(key);
  return {
    sourceId: source.sourceId, type: source.type, title: source.title, author: source.author,
    period: source.period, edition: source.edition, language: source.language, url: source.url,
    locator, note: note ?? source.note,
  };
};

export const storySource = (key: string, locator: string, note?: string): MythStorySource => {
  const source = byKey(key);
  return {
    sourceId: source.sourceId, title: source.title, sourceType: source.storyType,
    tradition: source.tradition, period: source.period, language: source.language,
    translation: source.edition, locator, note: note ?? source.note, url: source.url,
  };
};
