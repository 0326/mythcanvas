export type NorseKnownIssueStatus = 'resolved' | 'accepted-for-later-phase';

/** Phase-0 factual and modeling audit. Future regressions are caught by the
 * Story Manifest, structured validators and dedicated tests. */
export type NorseKnownIssue = {
  id: string;
  priority: 'P0' | 'P1';
  status: NorseKnownIssueStatus;
  resolution: string;
  evidence: readonly string[];
};

export const norseKnownIssues: readonly NorseKnownIssue[] = [
  {
    id: 'norse-p0-thrymr-not-thjazi', priority: 'P0', status: 'resolved',
    resolution: 'The Theft of Mjölnir now names Þrymr / 索列姆, cites Þrymskviða, and models the relevant participants, scene and Mjölnir.',
    evidence: ['story-thryms-stolen-hammer', 'character-thrymr', 'scene-thryms-hall', 'object-norse-mjolnir'],
  },
  {
    id: 'norse-p0-hringhorni-not-naglfar', priority: 'P0', status: 'resolved',
    resolution: 'Baldr’s funeral now uses Hringhorni and a funeral-shore Scene; Naglfar remains a Ragnarök object.',
    evidence: ['story-baldrs-funeral', 'object-norse-hringhorni', 'object-norse-naglfar'],
  },
  {
    id: 'norse-p0-thor-not-fenrir-final-enemy', priority: 'P0', status: 'resolved',
    resolution: 'The incorrect Thor → Fenrir enemy assertion was removed; the Story Map retains Odin/Fenrir and Thor/Jörmungandr as distinct endgame relationships.',
    evidence: ['norse-enemy-odin-fenrir', 'norse-enemy-thor-jormungandr', 'norse-manifest-odin-and-fenrir', 'norse-manifest-thor-and-jormungandr-final-battle'],
  },
  {
    id: 'norse-p0-freyr-not-freyja-gerdr-slug', priority: 'P0', status: 'resolved',
    resolution: 'The canonical Story slug is freyr-and-gerdr and the old freyja-and-gerdr URL is retained as a 308 redirect.',
    evidence: ['story-freyr-and-gerdr', 'freyja-and-gerdr', 'freyr-and-gerdr'],
  },
  {
    id: 'norse-p0-being-class-not-lineage', priority: 'P0', status: 'resolved',
    resolution: 'Taxonomy now separates social divine group, being class and family lineage; affected Character types are no longer presented as a single lineage label.',
    evidence: ['taxonomy-norse-aesir', 'taxonomy-norse-vanir', 'taxonomy-norse-jotunn', 'taxonomy-norse-volsung'],
  },
  {
    id: 'norse-p0-source-registry-and-locators', priority: 'P0', status: 'resolved',
    resolution: 'The source registry and frozen Story Manifest now carry stable source IDs and poem/stanza or chapter locators. Existing article bodies remain prototype until Phase 3 rewrites them.',
    evidence: ['src/content/norse/sources.ts', 'src/content/norse/story-manifest.ts'],
  },
  {
    id: 'norse-p0-heroic-story-kind', priority: 'P0', status: 'resolved',
    resolution: 'MythStory supports heroic-legend and the existing Völsung entries use it.',
    evidence: ['story-sigurd-and-regin', 'story-sigurd-kills-fafnir', 'story-sigurd-and-brynhildr', 'story-sigurds-death'],
  },
];
