export const DEFAULT_LOCALE = 'zh-Hans' as const;

export const localeRegistry = {
  'zh-Hans': {
    path: '',
    htmlLang: 'zh-Hans',
    intlLocale: 'zh-CN',
    ogLocale: 'zh_CN',
    label: '简体中文',
    direction: 'ltr',
    enabled: true,
  },
  en: {
    path: 'en',
    htmlLang: 'en',
    intlLocale: 'en-US',
    ogLocale: 'en_US',
    label: 'English',
    direction: 'ltr',
    enabled: true,
  },
  ja: {
    path: 'ja',
    htmlLang: 'ja',
    intlLocale: 'ja-JP',
    ogLocale: 'ja_JP',
    label: '日本語',
    direction: 'ltr',
    enabled: true,
  },
  es: {
    path: 'es',
    htmlLang: 'es',
    intlLocale: 'es-ES',
    ogLocale: 'es_ES',
    label: 'Español',
    direction: 'ltr',
    enabled: true,
  },
  'zh-Hant': {
    path: 'zh-hant',
    htmlLang: 'zh-Hant',
    intlLocale: 'zh-TW',
    ogLocale: 'zh_TW',
    label: '繁體中文',
    direction: 'ltr',
    enabled: false,
  },
  fr: {
    path: 'fr',
    htmlLang: 'fr',
    intlLocale: 'fr-FR',
    ogLocale: 'fr_FR',
    label: 'Français',
    direction: 'ltr',
    enabled: false,
  },
  de: {
    path: 'de',
    htmlLang: 'de',
    intlLocale: 'de-DE',
    ogLocale: 'de_DE',
    label: 'Deutsch',
    direction: 'ltr',
    enabled: false,
  },
} as const;

export type Locale = keyof typeof localeRegistry;
export type LocaleConfig = (typeof localeRegistry)[Locale];

export const ALL_LOCALES = Object.keys(localeRegistry) as Locale[];
export const ENABLED_LOCALES = ALL_LOCALES.filter((locale) => localeRegistry[locale].enabled);

/**
 * Locale routes that have a complete reader-facing implementation today.
 * Other locales can keep their registry entry while their content is being
 * prepared, but must not appear as links that lead to mixed-language pages.
 */
export const PUBLIC_LOCALES = ['zh-Hans', 'en'] as const satisfies readonly Locale[];

export function isLocale(value: string): value is Locale {
  return Object.prototype.hasOwnProperty.call(localeRegistry, value);
}

export function getLocaleConfig(locale: Locale) {
  return localeRegistry[locale];
}
