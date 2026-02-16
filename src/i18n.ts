import { get } from './object';

export interface Locale {
  [key: string]: string | Locale;
}

export type Locales = Record<string, Locale>;

export function getLocale(locales: Locales, locale_code: string, callback: Locale) {
  const locale = locales[locale_code];

  if (locale) {
    return locale;
  }

  for (const key in locales) {
    if (key.slice(0, 2) === locale_code.slice(0, 2)) {
      return locales[key];
    }
  }

  return callback;
}

export function translate(
  locale: Locale,
  key: string,
  params?: Record<string, string | number>
) {
  if (!locale || typeof key !== 'string') return key;
  const template = get(locale, key, key);
  if (!params) return template;
  return template.replace(
    /\{(\w+)\}/g,
    (_: string, key: string) => String(params[key]) || ''
  );
}
