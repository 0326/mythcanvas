export const japaneseVisualTiers = {
  S: ['izanagi', 'izanami', 'amaterasu', 'susanoo', 'tsukuyomi', 'okuninushi', 'takemikazuchi', 'ninigi', 'konohanasakuya-hime', 'ame-no-uzume', 'sarutahiko', 'yamata-no-orochi'],
  A: ['takami-musubi', 'kami-musubi', 'kagutsuchi', 'omoikane', 'kushinadahime', 'suseribime', 'sukunahikona', 'omononushi', 'kotoshironushi', 'takeminakata', 'toyotama-hime', 'watatsumi'],
  B: ['ameno-minakanushi', 'ame-no-tajikarao', 'ame-no-koyane', 'futodama', 'ashina-zuchi', 'te-na-zuchi', 'ame-no-hohi', 'ame-no-wakahiko', 'ame-no-oshihomimi', 'hoderi', 'iwanagahime', 'kaguya'],
} as const;

export type JapaneseVisualTier = keyof typeof japaneseVisualTiers;
