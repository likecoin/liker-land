import {
  IS_TESTNET,
  LIKECOIN_API_BASE,
  LIKE_CO_CLOUD_FN_BASE,
} from '@/constant';

export const getPaypalPaymentPageURL = (likerId, custom) => {
  let baseURL = IS_TESTNET
    ? `https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=LFJTWE4PM4VGQ&on0=LikerID&os0=${likerId}`
    : `https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=65HMAZFASPMJQ&on0=LikerID&os0=${likerId}`;
  if (custom) {
    baseURL += `&custom=${encodeURIComponent(JSON.stringify(custom))}`;
  }
  return baseURL;
};
export const getFetchLikedUserApi = () => `/api/reader/index`;
export const getFetchUserArticlesAPI = user => `/api/reader/user/${user}/works`;
export const getFollowedUserAPI = user => `/api/reader/follow/user/${user}`;
export const getFetchReaderBookmarkAPI = () => '/api/reader/bookmark';
export const getUpdateReaderBookmarkAPI = url =>
  `/api/reader/bookmark?url=${encodeURIComponent(url)}`;
export const getFetchSuggestArticlesApi = () => `/api/reader/works/suggest`;
export const getFetchFollowedArticlesApi = () => `/api/reader/works/followed`;
export const getOAuthRegisterAPI = () => '/api/users/register';
export const getOAuthLoginAPI = () => '/api/users/login';
export const getOAuthCallbackAPI = () => `/api/users/login`;
export const getLoginStatus = () => `/api/users/self`;
export const getLogoutAPI = () => `/api/users/logout`;
export const getPayPalPaymentAPI = () => `/api/civic/payment/paypal`;
export const getStripePaymentAPI = ({ from = '', referrer = '' } = {}) =>
  `/api/civic/payment/stripe/payment?from=${encodeURIComponent(
    from
  )}&referrer=${encodeURIComponent(referrer)}`;
export const getStripePaymentStatusAPI = () => '/api/civic/payment/stripe';
export const getCivicCSOnlineAPI = () => `/api/civic/csonline`;
export const getCivicLikerTrialEventByIdAPI = id =>
  `/api/civic/trial/events/${id}`;
export const getCivicLikerJoinTrialEventByIdAPI = id =>
  `/api/civic/trial/events/${id}/join`;

export const getImageResizeAPI = (url, { width } = {}) =>
  `${LIKE_CO_CLOUD_FN_BASE}/thumbnail/?url=${encodeURIComponent(url)}${
    width ? `&width=${width}` : ''
  }`;
export const getUserMinAPI = likerId =>
  `${LIKECOIN_API_BASE}/users/id/${likerId}/min`;
export const getArticleDetailAPI = url =>
  `${LIKECOIN_API_BASE}/like/info?url=${encodeURIComponent(url)}`;
