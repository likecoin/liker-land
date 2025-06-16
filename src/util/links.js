import { LIKE_CO_URL_BASE, BOOK_COM_DOMAIN } from '~/constant';

export const getLikeCoURL = (path = '') => `${LIKE_CO_URL_BASE}${path}`;

export const getExportSeedWordWidgetURL = ({ language = 'en' }) =>
  `${LIKE_CO_URL_BASE}/in/widget/authcore/seedwords?language=${language}`;

export const getLikerIdSettingsURL = ({
  wallet = '',
  language = 'en',
  legacy = '',
} = {}) =>
  getLikeCoURL(
    `/in/settings?popup=1&user_wallet=${wallet}&language=${language}&legacy=${legacy}`
  );

export function getBookComURLWithUTM({
  source = 'likerland',
  medium = 'popup',
  campaign = 'migration',
} = {}) {
  const url = new URL(`https://${BOOK_COM_DOMAIN}`);
  url.searchParams.set('utm_source', source);
  url.searchParams.set('utm_medium', medium);
  url.searchParams.set('utm_campaign', campaign);
  return url.toString();
}
