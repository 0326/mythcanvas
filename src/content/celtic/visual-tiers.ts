export const celticVisualTiers = {
  S: ['morrigan', 'cu-chulainn', 'lugh', 'medb', 'pwyll', 'rhiannon', 'cernunnos', 'epona'],
  A: ['nuada', 'dagda', 'aengus', 'fionn-mac-cumhaill', 'brân', 'blodeuwedd'],
  B: ['brigid', 'manannan', 'balor', 'bres', 'ogma', 'dian-cecht', 'miach', 'goibniu', 'cian', 'ethniu', 'caer-ibormeith', 'ailill-mac-mata', 'conchobar-mac-nessa', 'fergus-mac-roich', 'fer-diad', 'loeg', 'macha', 'donn-cuailnge', 'findbennach', 'pryderi', 'arawn', 'branwen', 'manawydan', 'efnisien', 'math', 'goewin', 'gwydion', 'arianrhod', 'lleu-law-gyffes'],
} as const;

export type CelticVisualTier = keyof typeof celticVisualTiers;
