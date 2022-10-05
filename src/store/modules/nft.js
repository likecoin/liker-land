/* eslint no-param-reassign: "off" */
import Vue from 'vue';
import * as api from '@/util/api';
import {
  NFT_INDEXER_LIMIT_MAX,
  isWritingNFT,
  isValidHttpUrl,
  formatOwnerInfoFromChain,
  formatNFTInfo,
} from '~/util/nft';
import * as TYPES from '../mutation-types';

const state = () => ({
  nftClassPurchaseInfo: {},
  nftClassMetadata: {},
  nftClassOwnerInfo: {},
  userClassIdListMap: {},
});

const mutations = {
  [TYPES.NFT_SET_NFT_CLASS_PURCHASE_INFO](state, { classId, info }) {
    Vue.set(state.nftClassPurchaseInfo, classId, info);
  },
  [TYPES.NFT_SET_NFT_CLASS_METADATA](state, { classId, metadata }) {
    Vue.set(state.nftClassMetadata, classId, metadata);
  },
  [TYPES.NFT_SET_NFT_CLASS_OWNER_INFO](state, { classId, info }) {
    Vue.set(state.nftClassOwnerInfo, classId, info);
  },
  [TYPES.NFT_SET_USER_CLASSID_LIST_MAP](state, { address, nfts }) {
    Vue.set(state.userClassIdListMap, address, nfts);
  },
};

const getters = {
  NFTClassIdList: state => state.userClassIdListMap,
  getNFTClassIdListByAddress: state => address =>
    state.userClassIdListMap[address],
  getNFTClassPurchaseInfoById: state => id => state.nftClassPurchaseInfo[id],
  getNFTClassMetadataById: state => id => state.nftClassMetadata[id],
  getNFTClassOwnerInfoById: state => id => state.nftClassOwnerInfo[id],
  getNFTClassOwnerCount: state => id =>
    Object.keys(state.nftClassOwnerInfo[id] || {}).length,
  getNFTClassMintedCount: state => id =>
    Object.values(state.nftClassOwnerInfo[id] || {}).reduce(
      (acc, val) => acc + val.length,
      0
    ),
  getNFTClassIdSorter: (_, getters) => classIds => {
    const sorted = [...classIds].sort((a, b) => {
      const aIsWritingNFT = isWritingNFT(getters.getNFTClassMetadataById(a));
      const bIsWritingNFT = isWritingNFT(getters.getNFTClassMetadataById(b));
      if (aIsWritingNFT && !bIsWritingNFT) return -1;
      if (!aIsWritingNFT && bIsWritingNFT) return 1;
      const priceA = getters.getNFTClassPurchaseInfoById(a)?.price;
      const priceB = getters.getNFTClassPurchaseInfoById(b)?.price;
      return priceB - priceA;
    });
    return sorted;
  },
};

const actions = {
  async fetchNFTPurchaseInfo({ commit }, classId) {
    const info = await this.$api.$get(api.getNFTPurchaseInfo({ classId }));
    commit(TYPES.NFT_SET_NFT_CLASS_PURCHASE_INFO, { classId, info });
    return info;
  },
  async lazyGetNFTPurchaseInfo({ getters, dispatch }, classId) {
    let info = getters.getNFTClassPurchaseInfoById(classId);
    if (!info) {
      info = await dispatch('fetchNFTPurchaseInfo', classId);
    }
    return info;
  },
  async fetchNFTMetadata({ commit }, classId) {
    let metadata;
    /* HACK: Use restful API instead of cosmjs to avoid loading libsodium,
      which is huge and affects index page performance */
    // const chainMetadata = await getClassInfo(classId);
    const { class: chainMetadata } = await this.$api.$get(
      api.getNFTClassMetadata(classId)
    );
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
    commit(TYPES.NFT_SET_NFT_CLASS_METADATA, { classId, metadata });
    return metadata;
  },
  async fetchNFTOwners({ commit }, classId) {
    const { owners } = await this.$api.$get(api.getNFTOwners(classId));
    const info = formatOwnerInfoFromChain(owners);
    commit(TYPES.NFT_SET_NFT_CLASS_OWNER_INFO, { classId, info });
    return info;
  },
  async lazyGetNFTOwners({ getters, dispatch }, classId) {
    let owners = getters.getNFTClassOwnerInfoById(classId);
    if (!owners) {
      owners = await dispatch('fetchNFTOwners', classId);
    }
    return owners;
  },
  async fetchNFTListByAddress({ commit }, address) {
    const getNFTAll = async owner => {
      let data;
      let nextKey;
      let count;
      const nfts = [];
      do {
        // eslint-disable-next-line no-await-in-loop
        ({ data } = await this.$api.get(
          api.getNFTs({
            owner,
            key: nextKey,
            limit: NFT_INDEXER_LIMIT_MAX,
          })
        ));
        nextKey = data.pagination.next_key;
        ({ count } = data.pagination);
        nfts.push(...data.nfts);
      } while (count === NFT_INDEXER_LIMIT_MAX);
      return nfts.map(formatNFTInfo);
    };

    const [nfts, { list: createdIds }] = await Promise.all([
      getNFTAll(address),
      this.$api.$get(api.getUserSellNFTClasses({ wallet: address })),
    ]);
    const collectedIds = [...new Set(nfts.map(nft => nft.classId))];

    commit(TYPES.NFT_SET_USER_CLASSID_LIST_MAP, {
      address,
      nfts: {
        created: createdIds,
        collected: collectedIds,
      },
    });
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
