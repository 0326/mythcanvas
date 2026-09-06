import { sourceRef } from './sources';

/**
 * Phase-2 register of contested or non-identical traditions. These are not
 * alternative "canon" records: each note tells editorial and product work
 * which distinction must remain source-scoped when prose, relations or visual
 * designs are added in later phases.
 */
export type NorseVariantNote = {
  id: string;
  topic: string;
  priority: 'P0' | 'P1' | 'P2';
  status: 'scoped' | 'needs-research';
  affectedManifestIds: readonly string[];
  sourceRefs: readonly ReturnType<typeof sourceRef>[];
  editorialRule: string;
};

export const norseVariantNotes: readonly NorseVariantNote[] = [
  {
    id: 'norse-variant-garmr-fenrir',
    topic: 'Garmr and Fenrir are not silently merged.',
    priority: 'P0', status: 'scoped',
    affectedManifestIds: ['norse-manifest-tyr-and-garmr', 'norse-manifest-odin-and-fenrir'],
    sourceRefs: [sourceRef('voluspa', 'st. 44–49, 53–54'), sourceRef('proseEddaGylfaginning', 'chs. 34, 51')],
    editorialRule: 'Keep Garmr and Fenrir as separate Characters unless a reader-facing comparison explicitly gives its source scope and uncertainty.',
  },
  {
    id: 'norse-variant-harbard-identity',
    topic: 'Hárbarðr’s identification with Odin is an interpretation, not an unscoped fact.',
    priority: 'P0', status: 'scoped',
    affectedManifestIds: ['norse-manifest-thor-and-harbard'],
    sourceRefs: [sourceRef('harbardsljod', 'st. 1–60')],
    editorialRule: 'Describe the speaker as Hárbarðr first; any Odin identification must be framed as an editorial or scholarly reading.',
  },
  {
    id: 'norse-variant-loki-baldr-agency',
    topic: 'Loki’s agency in Baldr’s death has different textual visibility across witnesses.',
    priority: 'P0', status: 'scoped',
    affectedManifestIds: ['norse-manifest-loki-and-baldr', 'norse-manifest-baldrs-death', 'norse-manifest-baldrs-dreams'],
    sourceRefs: [sourceRef('proseEddaGylfaginning', 'ch. 49'), sourceRef('baldrsDraumar', 'st. 1–14')],
    editorialRule: 'Do not retroactively assign the detailed Gylfaginning plot to Baldrs draumar; identify the witness behind each claim.',
  },
  {
    id: 'norse-variant-ragnarok-survivors',
    topic: 'Ragnarök’s survivors and post-catastrophe ordering are source-scoped.',
    priority: 'P0', status: 'scoped',
    affectedManifestIds: ['norse-manifest-ragnarok-renewal'],
    sourceRefs: [sourceRef('voluspa', 'st. 54–66'), sourceRef('proseEddaGylfaginning', 'ch. 53')],
    editorialRule: 'Present survivor and return lists with their source scope; do not synthesize a single exhaustive post-Ragnarök roster.',
  },
  {
    id: 'norse-variant-sigrdrifa-brynhildr',
    topic: 'Sigrdrífa and Brynhildr are related but not automatically identical across witnesses.',
    priority: 'P0', status: 'scoped',
    affectedManifestIds: ['norse-manifest-sigurd-and-sigrdrifa', 'norse-manifest-sigurd-and-brynhildr'],
    sourceRefs: [sourceRef('sigrdrifumal', 'st. 1–37'), sourceRef('volsungaSaga', 'chs. 20–27')],
    editorialRule: 'Keep source lanes and names explicit; any merged Character treatment requires an editorial note with the relevant witnesses.',
  },
  {
    id: 'norse-variant-freyr-gerdr-coercion',
    topic: 'Skírnismál’s courtship includes coercive speech that must not be softened into generic romance.',
    priority: 'P0', status: 'scoped',
    affectedManifestIds: ['norse-manifest-freyr-and-gerdr'],
    sourceRefs: [sourceRef('skirnismal', 'st. 1–42')],
    editorialRule: 'Retell the negotiation with age-appropriate restraint while preserving the text’s coercive stakes and source scope.',
  },
  {
    id: 'norse-variant-ynglinga-euhemerism',
    topic: 'Ynglinga saga’s euhemeristic framing is not interchangeable with mythological-poetry claims.',
    priority: 'P1', status: 'scoped',
    affectedManifestIds: ['norse-manifest-odin-seidr'],
    sourceRefs: [sourceRef('ynglingaSaga', 'ch. 7')],
    editorialRule: 'Name the euhemeristic frame whenever this witness is used; do not let it silently determine divine biography.',
  },
];
