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
import { deriveAllPrefixedAddresses } from '~/util/cosmos';
import * as TYPES from '../mutation-types';

const state = () => ({
  purchaseInfoByClassIdMap: {},
  metadataByClassIdMap: {},
  ownerInfoByClassIdMap: {},
  userClassIdListMap: {},
  userLastCollectedTimestampMap: {},
});

const mutations = {
  [TYPES.NFT_SET_NFT_CLASS_PURCHASE_INFO](state, { classId, info }) {
    Vue.set(state.purchaseInfoByClassIdMap, classId, info);
  },
  [TYPES.NFT_SET_NFT_CLASS_METADATA](state, { classId, metadata }) {
    Vue.set(state.metadataByClassIdMap, classId, metadata);
  },
  [TYPES.NFT_SET_NFT_CLASS_OWNER_INFO](state, { classId, info }) {
    Vue.set(state.ownerInfoByClassIdMap, classId, info);
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

function compareNumber(X, Y, order) {
  if (Y === undefined) return -1; // keep X in front of Y
  if (X === undefined) return 1; // move Y in front of X
  switch (order) {
    case ORDER.ASC:
      return X - Y;
    case ORDER.DESC:
    default:
      return Y - X;
  }
}

const getters = {
  NFTClassIdList: state => state.userClassIdListMap,
  getNFTClassIdListByAddress: state => address =>
    state.userClassIdListMap[address],
  getNFTClassPurchaseInfoById: state => id =>
    state.purchaseInfoByClassIdMap[id],
  getNFTClassMetadataById: state => id => state.metadataByClassIdMap[id],
  getNFTClassOwnerInfoById: state => id => state.ownerInfoByClassIdMap[id],
  getNFTClassOwnerCount: state => id =>
    Object.keys(state.ownerInfoByClassIdMap[id] || {}).length,
  getNFTClassCollectedCount: state => id =>
    Object.values(state.ownerInfoByClassIdMap[id] || {}).reduce(
      (acc, val) => acc + val.length,
      0
    ),
  getUserLastCollectedTimestampByAddress: state => address =>
    state.userLastCollectedTimestampMap[address],
  getCreatedClassIdSorter: (_, getters) => ({
    classIds,
    orderBy,
    order = ORDER.DESC,
  }) => {
    const sorted = [...classIds].sort((a, b) => {
      const isWritingNFTCompareResult = compareIsWritingNFT(getters, a, b);
      if (isWritingNFTCompareResult !== 0) return isWritingNFTCompareResult;
      let X;
      let Y;
      switch (orderBy) {
        case ORDER_CREATED_CLASS_ID_BY.PRICE:
          X = getters.getNFTClassPurchaseInfoById(a)?.price;
          Y = getters.getNFTClassPurchaseInfoById(b)?.price;
          if (X !== Y) break;
        // eslint-disable-next-line no-fallthrough
        case ORDER_CREATED_CLASS_ID_BY.ISCN_TIMESTAMP:
        default:
          X = getters.getNFTClassMetadataById(a)?.iscn_record_timestamp;
          Y = getters.getNFTClassMetadataById(b)?.iscn_record_timestamp;
          break;
      }
      return compareNumber(X, Y, order);
    });
    return sorted;
  },

  getCollectedClassIdSorter: (_, getters) => ({
    classIds,
    nftOwner,
    orderBy,
    order = ORDER.DESC,
  }) => {
    const sorted = [...classIds].sort((a, b) => {
      const isWritingNFTCompareResult = compareIsWritingNFT(getters, a, b);
      if (isWritingNFTCompareResult !== 0) return isWritingNFTCompareResult;
      let X;
      let Y;
      switch (orderBy) {
        case ORDER_COLLECTED_CLASS_ID_BY.PRICE:
          X = getters.getNFTClassPurchaseInfoById(a)?.price;
          Y = getters.getNFTClassPurchaseInfoById(b)?.price;
          if (X !== Y) break;
        // eslint-disable-next-line no-fallthrough
        case ORDER_COLLECTED_CLASS_ID_BY.NFT_OWNED_COUNT:
          X = getters.getNFTClassOwnerInfoById(a)?.[nftOwner]?.length;
          Y = getters.getNFTClassOwnerInfoById(b)?.[nftOwner]?.length;
          if (X !== Y) break;
        // eslint-disable-next-line no-fallthrough
        case ORDER_COLLECTED_CLASS_ID_BY.LAST_COLLECTED_NFT:
        default:
          X = getters.getUserLastCollectedTimestampByAddress(nftOwner)[a];
          Y = getters.getUserLastCollectedTimestampByAddress(nftOwner)[b];
          break;
      }
      return compareNumber(X, Y, order);
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
    const iscnId = parent?.iscn_id_prefix;
    metadata = {
      name,
      description,
      ...classMetadata,
      parent,
      iscn_id: iscnId,
    };
    if (isValidHttpUrl(uri)) {
      const apiMetadata = await this.$api
        .$get(uri)
        // eslint-disable-next-line no-console
        .catch(err => console.error(err));
      if (apiMetadata) metadata = { ...metadata, ...apiMetadata };
    }
    if (!(metadata.iscn_owner || metadata.account_owner)) {
      if (iscnId) {
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
      } else if (parent.account) {
        metadata = {
          ...metadata,
          account_owner: parent.account,
        };
      }
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
    const getNFTsAll = async owner => {
      let data;
      let nextKey;
      let count;
      const nfts = [];
      do {
        // eslint-disable-next-line no-await-in-loop
        ({ data } = await this.$api.get(
          api.getNFTsPartial({
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
      return nfts.map(formatNFTInfo);
    };

    const getNFTsRespectDualPrefix = async owner => {
      const allowAddresses = deriveAllPrefixedAddresses(owner);
      const arraysOfNFTs = await Promise.all(allowAddresses.map(getNFTsAll));
      return arraysOfNFTs.flat();
    };

    const [nfts, { list: createdIds }] = await Promise.all([
      getNFTsRespectDualPrefix(address),
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
