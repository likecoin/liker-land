/* eslint no-param-reassign: "off" */
import Vue from 'vue';
import * as api from '@/util/api';
import {
  NFT_INDEXER_LIMIT_MAX,
  ORDER_CREATED_CLASS_ID_BY,
  ORDER_COLLECTED_CLASS_ID_BY,
  ORDER,
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
  userLastCollectedTimestampMap: {},
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
  [TYPES.NFT_SET_USER_LAST_COLLECTED_TIMESTAMP_MAP](
    state,
    { address, timestampMap }
  ) {
    Vue.set(state.userLastCollectedTimestampMap, address, timestampMap);
  },
};

function compareIsWritingNFT(getters, classIdA, classIdB) {
  const aIsWritingNFT = isWritingNFT(getters.getNFTClassMetadataById(classIdA));
  const bIsWritingNFT = isWritingNFT(getters.getNFTClassMetadataById(classIdB));
  if (aIsWritingNFT && !bIsWritingNFT) return -1;
  if (!aIsWritingNFT && bIsWritingNFT) return 1;
  return 0;
}

const getters = {
  NFTClassIdList: state => state.userClassIdListMap,
  getNFTClassIdListByAddress: state => address =>
    state.userClassIdListMap[address],
  getNFTClassPurchaseInfoById: state => id => state.nftClassPurchaseInfo[id],
  getNFTClassMetadataById: state => id => state.nftClassMetadata[id],
  getNFTClassOwnerInfoById: state => id => state.nftClassOwnerInfo[id] || {},
  getNFTClassOwnerOwnedNFTIds: (_, getters) => (id, address) =>
    getters.getNFTClassOwnerInfoById(id)[address] || [],
  getNFTClassOwnerOwnedNFTCount: (_, getters) => (id, address) =>
    getters.getNFTClassOwnerOwnedNFTIds(id, address).length,
  getNFTClassOwnerCount: state => id =>
    Object.keys(state.nftClassOwnerInfo[id] || {}).length,
  getNFTClassMintedCount: state => id =>
    Object.values(state.nftClassOwnerInfo[id] || {}).reduce(
      (acc, val) => acc + val.length,
      0
    ),
  getUserLastCollectedTimestampByAddress: state => address =>
    state.userLastCollectedTimestampMap[address],
  getCreatedClassSorter: (_, getters) => (
    classIds,
    orderBy,
    order = ORDER.DESC
  ) => {
    const sorted = [...classIds].sort((a, b) => {
      const isWritingNFTCompareResult = compareIsWritingNFT(getters, a, b);
      if (isWritingNFTCompareResult) return isWritingNFTCompareResult;
      let A = null;
      let B = null;
      switch (orderBy) {
        case ORDER_CREATED_CLASS_ID_BY.PRICE:
          A = getters.getNFTClassPurchaseInfoById(a)?.price;
          B = getters.getNFTClassPurchaseInfoById(b)?.price;
          break;
        case ORDER_CREATED_CLASS_ID_BY.ISCN_TIMESTAMP:
        default:
          A = getters.getNFTClassMetadataById(a)?.iscn_record_timestamp;
          B = getters.getNFTClassMetadataById(b)?.iscn_record_timestamp;
          break;
      }
      if (A === null) return 1;
      if (B === null) return -1;
      switch (order) {
        case ORDER.ASC:
          return A - B;
        case ORDER.DESC:
        default:
          return B - A;
      }
    });
    return sorted;
  },

  getCollectedClassSorter: (_, getters) => (
    classIds,
    address,
    orderBy,
    order = ORDER.DESC
  ) => {
    const sorted = [...classIds].sort((a, b) => {
      const isWritingNFTCompareResult = compareIsWritingNFT(getters, a, b);
      if (isWritingNFTCompareResult) return isWritingNFTCompareResult;
      let A = null;
      let B = null;
      switch (orderBy) {
        case ORDER_COLLECTED_CLASS_ID_BY.PRICE:
          A = getters.getNFTClassPurchaseInfoById(a)?.price;
          B = getters.getNFTClassPurchaseInfoById(b)?.price;
          break;
        case ORDER_COLLECTED_CLASS_ID_BY.NFT_OWNED_COUNT:
          A = getters.getNFTClassOwnerOwnedNFTCount(a, address);
          B = getters.getNFTClassOwnerOwnedNFTCount(b, address);
          break;
        case ORDER_COLLECTED_CLASS_ID_BY.LAST_COLLECTED_NFT:
        default:
          A = getters.getUserLastCollectedTimestampByAddress(address)[a];
          B = getters.getUserLastCollectedTimestampByAddress(address)[b];
          break;
      }
      if (A === null) return 1;
      if (B === null) return -1;
      switch (order) {
        case ORDER.ASC:
          return A - B;
        case ORDER.DESC:
        default:
          return B - A;
      }
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
      const iscnRecordTimestamp = iscnRecord?.records?.[0]?.recordTimestamp;
      if (iscnOwner)
        metadata = {
          ...metadata,
          iscn_owner: iscnOwner,
          iscn_record_timestamp: iscnRecordTimestamp,
        };
    }
    if (metadata.iscn_record_timestamp)
      metadata.iscn_record_timestamp = Date.parse(
        metadata.iscn_record_timestamp
      );
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
      // sort by last colleted by default
      return nfts.map(formatNFTInfo).sort((a, b) => b.timestamp - a.timestamp);
    };

    const [nfts, { list: createdIds }] = await Promise.all([
      getNFTAll(address),
      this.$api.$get(api.getUserSellNFTClasses({ wallet: address })),
    ]);
    const timestampMap = {};
    nfts.forEach(nft => {
      const { classId, timestamp } = nft;
      if (!timestampMap[classId] || timestampMap[classId] < timestamp) {
        timestampMap[classId] = timestamp;
      }
    });
    const collectedIds = [...new Set(nfts.map(nft => nft.classId))];

    commit(TYPES.NFT_SET_USER_CLASSID_LIST_MAP, {
      address,
      nfts: {
        created: createdIds,
        collected: collectedIds,
      },
    });
    commit(TYPES.NFT_SET_USER_LAST_COLLECTED_TIMESTAMP_MAP, {
      address,
      timestampMap,
    });
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
