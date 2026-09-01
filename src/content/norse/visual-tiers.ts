export const norseVisualTiers = {
  S: ['odin', 'thor', 'loki', 'freyja', 'frigg', 'baldr', 'heimdall', 'tyr', 'freyr', 'hel', 'fenrir', 'jormungandr'],
  A: ['ymir', 'njordr', 'skadi', 'idunn', 'sif', 'hodr', 'hermod', 'vidarr', 'surtr', 'gerdr', 'sigyn', 'mimir', 'sleipnir', 'sigurd', 'brynhildr', 'fafnir'],
  B: ['buri', 'vili', 've'],
} as const;
export type NorseVisualTier = keyof typeof norseVisualTiers;
