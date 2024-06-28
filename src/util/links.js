import { LIKE_CO_URL_BASE } from '~/constant';

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
