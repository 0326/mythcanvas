import type { Locale } from '../config';
import en from './en';
import es from './es';
import ja from './ja';
import zhHans from './zh-Hans';
import type { UiMessages } from './types';

const messagesByLocale: Partial<Record<Locale, UiMessages>> = {
  'zh-Hans': zhHans,
  en,
  ja,
  es,
};

export function getUiMessages(locale: Locale): UiMessages {
  return messagesByLocale[locale] ?? zhHans;
}
