import * as TYPES from '@/store/mutation-types';
import * as api from '@/util/api';
import {
  getClassInfo,
  isValidHttpUrl,
  isWritingNFT,
  formatOwnerInfoFromChain,
} from '@/util/nft';

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
  let info;
  if (isWritingNFT(classId)) {
    info = await this.$api.$get(api.getNFTOwners({ classId }));
  } else {
    const { owners } = await this.$api.$get(api.getNFTOwnersFromChain(classId));
    info = formatOwnerInfoFromChain(owners);
  }
  commit(TYPES.STATIC_SET_NFT_CLASS_OWNER_INFO, { classId, info });
  return info;
}
