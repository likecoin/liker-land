import * as TYPES from '@/store/mutation-types';
import * as api from '@/util/api';

const USER_INFO_EXPIRE_TIME = 1000 * 60 * 10; // 10 minutes

export async function fetchUserInfo({ commit, state }, opts) {
  let id;
  let types = [];
  if (typeof opts === 'object') {
    ({ id, types } = opts);
  } else {
    id = opts;
  }
  let promise;
  let user;
  if (state.fetching.user[id]) {
    promise = state.fetching.user[id];
    user = await promise;
  } else {
    promise = this.$api.$get(api.getUserMinAPI(id, { types }));
    commit(TYPES.STATIC_SET_USER_FETCHING, { id, payload: promise });
    user = await promise;
    commit(TYPES.STATIC_SET_USER_INFO, { id, user });
    commit(TYPES.STATIC_SET_USER_FETCHING, { id, payload: null });
  }
  return user;
}

export async function fetchUserInfoByAddress({ commit, state }, address) {
  let userInfo = {
    displayName: address,
    avatar: api.getIdenticonAvatar(address),
  };

  try {
    let promise = state.fetching.userInfo[address];
    if (promise) {
      userInfo = await promise;
      return userInfo;
    }
    promise = this.$api.$get(api.getUserInfoMinByAddress(address));
    commit(TYPES.STATIC_SET_USER_INFO_FETCHING, { address, promise });
    userInfo = await promise;
    commit(TYPES.STATIC_SET_USER_INFO_FETCHING, { address, promise: null });
  } catch (error) {
    // no-op
  }
  commit(TYPES.STATIC_SET_USER_INFO_BY_ADDRESS, { address, userInfo });
  commit(TYPES.STATIC_SET_USER_INFO_LAST_QUERY_TIMESTAMP, {
    address,
    timestamp: Date.now(),
  });
  return userInfo;
}

export async function lazyGetUserInfoByAddress({ state, dispatch }, address) {
  let userInfo = state.userInfoMapByAddress[address];
  const lastQueryTimestamp = state.userInfoLastQueryTimestampMap[address];
  if (!userInfo || Date.now() > lastQueryTimestamp + USER_INFO_EXPIRE_TIME) {
    userInfo = await dispatch('fetchUserInfoByAddress', address);
  }
  return userInfo;
}

export async function fetchArticleInfo({ commit }, referrer) {
  const info = await this.$api.$get(api.getArticleDetailAPI(referrer));
  commit(TYPES.STATIC_SET_ARTICLE_INFO, { referrer, info });
}

export async function fetchLIKEPrice({ commit }) {
  let price = 0;
  try {
    const data = await this.$api.$get(api.getLIKEPrice());
    price = data.likecoin.usd;
    commit(TYPES.STATIC_SET_LIKE_PRICE_IN_USD, price);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('CANNOT_GET_LIKE_PRICE');
  }
  return price;
}

export function lazyFetchLIKEPrice({ state, dispatch }) {
  return state.likePriceInUSD || dispatch('fetchLIKEPrice');
}
