export const mayaVisualTiers = {
  S: ['hunahpu', 'xbalanque', 'xquic', 'vucub-caquix', 'chaak', 'maize-god'],
  A: ['camazotz', 'tohil', 'kawiil', 'kinich-ajaw'],
  B: ['hun-hunahpu', 'vucub-hunahpu', 'xmucane', 'xpiyacoc', 'zipacna', 'cabrakan', 'awilix', 'jacawitz', 'huracan'],
} as const;

export type MayaVisualTier = keyof typeof mayaVisualTiers;
