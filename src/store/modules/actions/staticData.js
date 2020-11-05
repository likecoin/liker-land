import * as types from '@/store/mutation-types';
import * as api from '@/util/api';

export async function fetchUserInfo({ commit, state }, id) {
  let promise;
  let user;
  if (state.fetching.user[id]) {
    promise = state.fetching.user[id];
    user = await promise;
  } else {
    promise = this.$api.$get(api.getUserMinAPI(id));
    commit(types.STATIC_SET_USER_FETCHING, { id, payload: promise });
    user = await promise;
    commit(types.STATIC_SET_USER_INFO, { id, user });
    commit(types.STATIC_SET_USER_FETCHING, { id, payload: null });
  }
  return user;
}
export async function fetchArticleInfo({ commit }, referrer) {
  const info = await this.$api.$get(api.getArticleDetailAPI(referrer));
  commit(types.STATIC_SET_ARTICLE_INFO, { referrer, info });
  return info;
}
