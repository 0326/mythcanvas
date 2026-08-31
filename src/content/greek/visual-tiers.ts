/**
 * Production visual coverage targets for the Greek mythology catalog.
 *
 * These are editorial targets, deliberately separate from Character type and
 * taxonomy. The coverage reporter uses this manifest to audit approved D1
 * artworks without changing the content graph itself.
 */
export const greekVisualTiers = {
  S: [
    'zeus', 'athena', 'poseidon', 'hades', 'aphrodite', 'apollo',
    'artemis', 'medusa', 'heracles', 'achilles', 'odysseus', 'persephone',
  ],
  A: [
    'demeter', 'dionysus', 'hephaestus', 'hera', 'hermes', 'perseus',
    'theseus', 'jason', 'pandora', 'prometheus', 'medea', 'hector',
    'circe', 'penelope', 'hestia',
  ],
  B: [
    'chaos', 'gaia', 'uranus', 'tartarus', 'nyx', 'eros', 'cronus', 'rhea',
    'typhon', 'atlas', 'metis', 'leto', 'python', 'maia', 'semele',
    'eurydice', 'bellerophon', 'chimera', 'pegasus', 'daedalus', 'icarus',
    'oedipus', 'sphinx', 'paris', 'helen', 'menelaus', 'agamemnon',
    'patroclus', 'priam', 'polyphemus', 'sirens', 'calypso', 'telemachus',
    'ariadne', 'minotaur', 'hydra', 'cerberus',
  ],
} as const;

export type GreekVisualTier = keyof typeof greekVisualTiers;

export const greekVisualTierBySlug = new Map<string, GreekVisualTier>(
  (Object.entries(greekVisualTiers) as [GreekVisualTier, readonly string[]][]).flatMap(([tier, slugs]) =>
    slugs.map((slug) => [slug, tier] as const),
  ),
);
