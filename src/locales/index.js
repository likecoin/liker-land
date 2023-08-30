import dayjs from 'dayjs';
import dayjsAdvancedFormat from 'dayjs/plugin/advancedFormat';
import dayjsRelativeTime from 'dayjs/plugin/relativeTime';
import _ from 'dayjs/locale/zh-tw';

dayjs.extend(dayjsAdvancedFormat);
dayjs.extend(dayjsRelativeTime);

export const defaultLocale = 'en';
export const availableLocales = [
  // List of available locales
  'en',
  'zh-Hant',
];

export function convertLikeCoLocale(locale) {
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

export function normalizeLocaleForDayjs(locale) {
  switch (locale) {
    case 'zh-Hant':
      return 'zh-tw';
    default:
      return locale;
  }
}
