import { get } from './object';

export type Locale = Record<string, Record<string, string>>;

export type Locales = Record<string, Locale>;

export function getLocale(locales: Locales, lang: string, callback?: Locale) {
  lang = lang.slice(0, 2);
  return locales[lang] || callback;
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
