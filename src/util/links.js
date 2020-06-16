import { LIKE_CO_URL_BASE } from '~/constant';

export const getLikeCoURL = (path = '') => `${LIKE_CO_URL_BASE}${path}`;

export const getLikerIdSettingsURL = () => getLikeCoURL('/in/settings');
