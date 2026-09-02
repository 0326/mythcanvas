/** Production priority is editorial/product priority, not a ranking of gods. */
export const aztecVisualTiers = {
  S: ['quetzalcoatl', 'huitzilopochtli', 'tezcatlipoca', 'tlaloc', 'coatlicue', 'mictlantecuhtli', 'mictecacihuatl', 'tonatiuh', 'coyolxauhqui', 'nanahuatzin'],
  A: ['xipe-totec', 'xiuhtecuhtli', 'xolotl', 'tecuciztecatl', 'tlaltecuhtli'],
  B: ['centzon-huitznahua', 'chalchiuhtlicue', 'xochipilli'],
} as const;

export type AztecVisualTier = keyof typeof aztecVisualTiers;
