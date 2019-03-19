import { IS_TESTNET } from '@/constant';

export const getPaypalPaymentPageURL = likerId =>
  IS_TESTNET
    ? `https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=LFJTWE4PM4VGQ&on0=LikerID&os0=${likerId}`
    : `https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=65HMAZFASPMJQ&on0=LikerID&os0=${likerId}`;
export const getFetchLikedUserApi = () => `/api/reader/index`;
export const getFetchUserArticlesAPI = user => `/api/reader/user/${user}`;
export const getSubscribeUserAPI = user => `/api/reader/subscribe/user/${user}`;
export const getFetchSuggestArticlesApi = () => `/api/reader/suggest`;
export const getOAuthLoginAPI = () => '/api/users/login';
export const getOAuthCallbackAPI = () => `/api/users/login`;
export const getPayPalPaymentAPI = () => `/api/civic/payment/paypal`;
export const getLoginStatus = () => `/api/users/self`;
