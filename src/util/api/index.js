export const getFetchLikedUserApi = () => `/api/reader/index`;
export const getFetchUserArticlesAPI = user => `/api/reader/user/${user}`;
export const getOAuthLoginAPI = () => '/api/users/login';
export const getOAuthCallbackAPI = () => `/api/users/login`;
export const getLoginStatus = () => `/api/users/self`;
