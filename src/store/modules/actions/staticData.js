import * as TYPES from '@/store/mutation-types';
import * as api from '@/util/api';
import {
  getClassInfo,
  isValidHttpUrl,
  formatOwnerInfoFromChain,
} from '@/util/nft';

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
  let userInfo;
  if (state.fetching.user[id]) {
    promise = state.fetching.user[id];
    userInfo = await promise;
  } else {
    promise = this.$api.$get(api.getUserMinAPI(id, { types }));
    commit(TYPES.STATIC_SET_USER_FETCHING, { id, payload: promise });
    userInfo = await promise;
    commit(TYPES.STATIC_SET_USER_INFO_BY_ID, { id, userInfo });
    commit(TYPES.STATIC_SET_USER_FETCHING, { id, payload: null });
  }
  return userInfo;
}

export async function fetchUserInfoByAddress({ commit }, address) {
  let userInfo = {
    displayName: address,
    avatar: `https://avatars.dicebear.com/api/identicon/${address}.svg`,
  };
  try {
    userInfo = await this.$api.$get(api.getUserInfoMinByAddress(address));
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

export async function lazyGetUserInfoByAddress({ getters, dispatch }, address) {
  let userInfo = getters.getUserInfoByAddress(address);
  const lastQueryTimestamp = getters.getUserInfoLastQueryTimestamp(address);
  if (!userInfo || Date.now() > lastQueryTimestamp + USER_INFO_EXPIRE_TIME) {
    userInfo = await dispatch('fetchUserInfoByAddress', address);
  }
  return userInfo;
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

export async function lazyGetNFTPurchaseInfo({ getters, dispatch }, classId) {
  let info = getters.getNFTClassPurchaseInfoById(classId);
  if (!info) {
    info = await dispatch('fetchNFTPurchaseInfo', classId);
  }
  return info;
}

export async function fetchNFTMetadata({ commit }, classId) {
  let metadata;
  const chainMetadata = await getClassInfo(classId);
  const {
    name,
    description,
    uri,
    data: { parent, metadata: classMetadata = {} } = {},
  } = chainMetadata || {};
  const iscnId = parent?.iscnIdPrefix;
  metadata = {
    name,
    description,
    metadata: classMetadata,
    parent,
    iscn_id: iscnId,
  };
  if (isValidHttpUrl(uri)) {
    const apiMetadata = await this.$api
      .$get(uri)
      // eslint-disable-next-line no-console
      .catch(err => console.error(err));
    if (apiMetadata) metadata = { ...metadata, ...apiMetadata };
  } else if (iscnId) {
    const iscnRecord = await this.$api
      .$get(api.getISCNRecord(iscnId))
      // eslint-disable-next-line no-console
      .catch(err => console.error(err));
    const iscnOwner = iscnRecord?.owner;
    if (iscnOwner) metadata = { ...metadata, iscn_owner: iscnOwner };
  }
  commit(TYPES.STATIC_SET_NFT_CLASS_METADATA, { classId, metadata });
  return metadata;
}

export async function fetchNFTOwners({ commit }, classId) {
  const { owners } = await this.$api.$get(api.getNFTOwners(classId));
  const info = formatOwnerInfoFromChain(owners);
  commit(TYPES.STATIC_SET_NFT_CLASS_OWNER_INFO, { classId, info });
  return info;
}

export async function lazyGetNFTOwners({ getters, dispatch }, classId) {
  let owners = getters.getNFTClassOwnerInfoById(classId);
  if (!owners) {
    owners = await dispatch('fetchNFTOwners', classId);
  }
  return owners;
}
