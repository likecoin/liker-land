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
export const getFetchUserArticlesAPI = user => `/api/reader/user/${user}/works`;
export const getFollowedUserAPI = user => `/api/reader/follow/user/${user}`;
export const getFetchSuggestArticlesApi = () => `/api/reader/suggest/works`;
export const getFetchReaderBookmarkAPI = () => '/api/reader/bookmark';
export const getUpdateReaderBookmarkAPI = url =>
  `/api/reader/bookmark?url=${encodeURIComponent(url)}`;
export const getOAuthLoginAPI = () => '/api/users/login';
export const getOAuthCallbackAPI = () => `/api/users/login`;
export const getPayPalPaymentAPI = () => `/api/civic/payment/paypal`;
export const getLoginStatus = () => `/api/users/self`;

export const getUserMinAPI = likerId =>
  `${LIKECOIN_API_BASE}/users/id/${likerId}/min`;
export const getArticleDetailAPI = url =>
  `${LIKECOIN_API_BASE}/like/info?url=${encodeURIComponent(url)}`;
