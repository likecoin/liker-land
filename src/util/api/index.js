import querystring from 'querystring';
import {
  IS_TESTNET,
  LIKECOIN_API_BASE,
  LIKE_CO_THUMBNAIL_FN_BASE,
  SUPERLIKE_BASE,
} from '@/constant';
import { normalizeLocaleForLikeCo } from '@/locales';

export const getAppURL = ({
  referrer,
  utmCampaign,
  utmSource = 'likerland',
  utmMedium,
} = {}) => {
  if (referrer) {
    const queryObject = {
      event: 'app_referral',
      referrer,
      '~campaign': utmCampaign,
      '~channel': utmSource,
      '~feature': utmMedium,
    };
    return `https://likerland.app.link/?${querystring.stringify(queryObject)}`;
  }
  const queryObject = {
    utm_campaign: utmCampaign,
    utm_source: utmSource,
    utm_medium: utmMedium,
  };
  return `https://likecoin.page.link/likerland?${querystring.stringify(
    queryObject
  )}`;
};

export const getPaypalPaymentPageURL = (likerId, custom) => {
  let baseURL = IS_TESTNET
    ? `https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4FL73FNJBUXFA&on0=LikerID&os0=${likerId}`
    : `https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=WW2TNJJXZ3MDY&on0=LikerID&os0=${likerId}`;
  if (custom) {
    baseURL += `&custom=${encodeURIComponent(JSON.stringify(custom))}`;
  }
  return baseURL;
};

export const getPaypalUnsubscribeURL = () =>
  `https://www.${
    IS_TESTNET ? 'sandbox.' : ''
  }paypal.com/hk/customerprofileweb?cmd=_manage-paylist`;
export const getOiceSettingsURL = () => 'https://oice.com/profile';

export const getSuperLikeRedirectLink = superLikeID =>
  `${SUPERLIKE_BASE}/${superLikeID}`;

export const getFetchLikedUserApi = () => `/api/reader/index`;
export const getFetchUserSuperLikeAPI = user =>
  `/api/reader/users/${user}/superlike`;
export const getFollowedUserAPI = user => `/api/reader/follow/user/${user}`;
export const getFetchReaderBookmarkAPI = () => '/api/reader/bookmark';
export const getUpdateReaderBookmarkAPI = url =>
  `/api/reader/bookmark?url=${encodeURIComponent(url)}`;
export const getFetchSuggestArticlesApi = () => `/api/reader/works/suggest`;
export const getFetchPersonalSuggestArticlesApi = () =>
  `/api/reader/works/suggest/personal`;
export const getFetchFollowedSuperLikeApi = () =>
  `/api/reader/superlike/followed`;
export const getOAuthRegisterAPI = ({
  language = 'zh',
  from = '',
  referrer = '',
  utmSource = '',
} = {}) =>
  `/api/users/register?${querystring.stringify({
    language: normalizeLocaleForLikeCo(language),
    from,
    referrer,
    utm_source: utmSource,
  })}`;
export const getOAuthLoginAPI = ({ language = 'zh', utmSource } = {}) =>
  `/api/users/login?${querystring.stringify({
    language: normalizeLocaleForLikeCo(language),
    utm_source: utmSource,
  })}`;
export const getOAuthCallbackAPI = () => `/api/users/login`;
export const getLoginStatus = () => `/api/users/self`;
export const getLogoutAPI = () => `/api/users/logout`;
export const getLikePayPageURL = (from = '') =>
  `/api/civic/payment/likepay/payment?from=${from}`;
export const getLikePayPaymentAPI = () => `/api/civic/payment/likepay`;
export const getPayPalPaymentAPI = () => `/api/civic/payment/paypal`;
export const getStripePaymentAPI = ({
  from = '',
  referrer = '',
  utmSource = '',
  utmMedium = '',
  civicLikerVersion = 1,
  quantity = 1,
} = {}) =>
  `/api/civic/payment/stripe/payment?from=${encodeURIComponent(
    from
  )}&referrer=${encodeURIComponent(
    referrer
  )}&civic_liker_version=${civicLikerVersion}&quantity=${quantity}&utm_source=${encodeURIComponent(
    utmSource
  )}&utm_medium=${encodeURIComponent(utmMedium)}`;
export const getStripeEditPaymentAPI = () =>
  '/api/civic/payment/stripe/payment?edit=1';
export const getStripeBillingPortalAPI = () =>
  '/api/civic/payment/stripe/billing';
export const getStripePaymentStatusAPI = ({ resume = false } = {}) =>
  `/api/civic/payment/stripe?${resume ? 'resume=1' : ''}`;
export const getCivicCSOnlineAPI = () => `/api/civic/csonline`;
export const getCivicLikerTrialEventByIdAPI = id =>
  `/api/civic/trial/events/${id}`;
export const getCivicLikerJoinTrialEventByIdAPI = id =>
  `/api/civic/trial/events/${id}/join`;
export const getCivicSupportingUserListAPI = () => '/api/civic/support/users';
export const getCivicSupportingUserAPI = id => `/api/civic/support/users/${id}`;
export const getMySupportersAPI = () => '/api/civic/support/self';

export const getImageResizeAPI = (url, { width } = {}) =>
  `${LIKE_CO_THUMBNAIL_FN_BASE}/thumbnail/?url=${encodeURIComponent(url)}${
    width ? `&width=${width}` : ''
  }`;
export const getUserMinAPI = (id, { types = [] } = {}) =>
  `${LIKECOIN_API_BASE}/users/id/${id}/min?${querystring.stringify({
    type: types.join(','),
  })}`;
export const getArticleDetailAPI = url =>
  `${LIKECOIN_API_BASE}/like/info?url=${encodeURIComponent(url)}`;

export const updateProfile = () => `/api/users/self/update`;
export const userPreferences = () => `/api/users/preferences`;

export const getOgImage = id => `https://static.like.co/liker-og-image/${id}`;
