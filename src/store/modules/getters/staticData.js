import { ROUGH_LIKE_TO_USD_PRICE } from '~/constant';

export const getUserInfoById = state => id => state.userInfos[id];

export const getUserInfoByAddress = state => address =>
  state.userInfoMapByAddress[address];

export const getArticleInfoByReferrer = state => referrer =>
  state.articleInfos[referrer];
export const getArticleInfoByURL = state => url =>
  state.articleInfos.find(i => i.url === url);

export const LIKEPriceInUSD = state =>
  state.LIKEPriceInUSD || ROUGH_LIKE_TO_USD_PRICE;
