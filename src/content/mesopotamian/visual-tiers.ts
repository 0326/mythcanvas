export const mesopotamianVisualTiers = {
  S: ['inanna-ishtar', 'gilgamesh', 'enki-ea', 'marduk', 'ereshkigal', 'tiamat', 'ashur'],
  A: ['enlil', 'utu-shamash', 'nanna-sin', 'dumuzi-tammuz', 'ninurta', 'nergal', 'atrahasis', 'utnapishtim', 'enkidu'],
  B: ['an-anu', 'ninlil', 'ishkur-adad', 'ninhursaga', 'nammu', 'apsu-enuma-elish', 'kingu', 'anzu', 'asag', 'adapa', 'etana', 'humbaba', 'bull-of-heaven', 'nabu', 'mushussu', 'ninshubur', 'geshtinanna', 'namtar', 'aya', 'shala', 'sarpanitum', 'nusku', 'ziusudra', 'ninsun', 'urshanabi', 'siduri', 'anunnaki', 'igigi'],
} as const;

export type MesopotamianVisualTier = keyof typeof mesopotamianVisualTiers;
