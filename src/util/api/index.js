import { IS_TESTNET, LIKECOIN_API_BASE } from '@/constant';

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
export const getFetchUserArticlesAPI = user => `/api/reader/user/${user}`;
export const getSubscribeUserAPI = user => `/api/reader/subscribe/user/${user}`;
export const getFetchSuggestArticlesApi = () => `/api/reader/suggest`;
export const getOAuthLoginAPI = () => '/api/users/login';
export const getOAuthCallbackAPI = () => `/api/users/login`;
export const getLoginStatus = () => `/api/users/self`;
export const getPayPalPaymentAPI = () => `/api/civic/payment/paypal`;
export const getCivicCSOnlineAPI = () => `/api/civic/csonline`;
export const getCivicLikerTrialEventByIdAPI = id =>
  `/api/civic/trial/events/${id}`;
export const getCivicLikerJoinTrialEventByIdAPI = id =>
  `/api/civic/trial/events/${id}/join`;

export const getUserMinAPI = likerId =>
  `${LIKECOIN_API_BASE}/users/id/${likerId}/min`;

export const getLikeButtonTotalLikeCountAPI = (likerId, referrerURL) =>
  `${LIKECOIN_API_BASE}/like/likebutton/${likerId}/total?referrer=${encodeURIComponent(
    referrerURL
  )}`;
