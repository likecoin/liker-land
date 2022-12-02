import en from './en.json';
import zhHant from './zh-Hant.json';

export const defaultLocale = 'en';
export const availableLocales = [
  // List of available locales
  'en',
  'zh-Hant',
];

export function convertLikerCoinLocale(locale) {
  switch (locale) {
    case 'zh':
      return 'zh-Hant';
    case 'cn':
      return 'zh-Hant'; // temp, no zh-Hans
    default:
      return locale;
  }
}

/**
 * Normalize liker.land locale for like.co
 * @param {string} locale liker.land locale
 */
export function normalizeLocaleForLikeCo(locale) {
  switch (locale) {
    case 'zh-Hant':
      return 'zh';
    default:
      return locale;
  }
}

export default {
  en,
  'zh-Hant': zhHant,
};
