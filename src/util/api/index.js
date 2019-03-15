export const getFetchLikedUserApi = () => `/api/reader/index`;
export const getFetchUserArticlesAPI = user => `/api/reader/user/${user}`;
export const getFetchSuggestArticlesApi = () => `/api/reader/suggest`;
export const getOAuthLoginAPI = () => '/api/users/login';
export const getOAuthCallbackAPI = () => `/api/users/login`;
export const getPayPalPaymentAPI = () => `/api/civic/payment/paypal`;
export const getLoginStatus = () => `/api/users/self`;
