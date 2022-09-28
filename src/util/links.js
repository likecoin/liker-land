import { LIKE_CO_URL_BASE } from '~/constant';

export const getLikeCoURL = (path = '') => `${LIKE_CO_URL_BASE}${path}`;

export const getLikerIdSettingsURL = ({ wallet = '' } = {}) =>
  getLikeCoURL(`/in/settings?popup=1&user_wallet=${wallet}`);
