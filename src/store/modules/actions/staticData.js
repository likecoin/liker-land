import * as TYPES from '@/store/mutation-types';
import * as api from '@/util/api';

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

export async function fetchArticleInfo({ commit }, referrer) {
  const info = await this.$api.$get(api.getArticleDetailAPI(referrer));
  commit(TYPES.STATIC_SET_ARTICLE_INFO, { referrer, info });
}

export async function fetchNFTPurchaseInfo({ commit }, classId) {
  const info = await this.$api.$get(api.getNFTPurchaseInfo({ classId }));
  commit(TYPES.STATIC_SET_NFT_CLASS_PURCHASE_INFO, { classId, info });
  return info;
}

export async function fetchNFTMetadata({ commit }, classId) {
  const metadata = await this.$api.$get(api.getNFTMetadata({ classId }));
  commit(TYPES.STATIC_SET_NFT_CLASS_METADATA, { classId, metadata });
  return metadata;
}

export async function fetchNFTOwners({ commit }, classId) {
  const info = await this.$api.$get(api.getNFTOwners({ classId }));
  commit(TYPES.STATIC_SET_NFT_CLASS_OWNER_INFO, { classId, info });
  return info;
}
