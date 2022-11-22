/* eslint no-param-reassign: "off" */
import Vue from 'vue';
import * as api from '@/util/api';
import {
  NFT_CLASS_LIST_SORTING,
  NFT_CLASS_LIST_SORTING_ORDER,
  isWritingNFT,
  isValidHttpUrl,
  formatOwnerInfoFromChain,
  getNFTsRespectDualPrefix,
  getNFTClassesRespectDualPrefix,
} from '~/util/nft';
import * as TYPES from '../mutation-types';

const state = () => ({
  purchaseInfoByClassIdMap: {},
  metadataByClassIdMap: {},
  ownerInfoByClassIdMap: {},
  userClassIdListMap: {},
  userNFTClassFeaturedSetMap: {},
  userNFTClassHiddenSetMap: {},
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
  [TYPES.NFT_SET_USER_NFT_CLASS_FEATURED_SET_MAP](
    state,
    { address, classIdSet }
  ) {
    Vue.set(state.userNFTClassFeaturedSetMap, address, classIdSet);
  },
  [TYPES.NFT_SET_USER_NFT_CLASS_HIDDEN_SET_MAP](
    state,
    { address, classIdSet }
  ) {
    Vue.set(state.userNFTClassHiddenSetMap, address, classIdSet);
  },
  [TYPES.NFT_SET_USER_LAST_COLLECTED_TIMESTAMP_MAP](
    state,
    { address, timestampMap }
  ) {
    Vue.set(state.userLastCollectedTimestampMap, address, timestampMap);
  },
};

function compareIsWritingNFT(getters, classIdA, classIdB) {
  const aMetadata = getters.getNFTClassMetadataById(classIdA);
  const bMetadata = getters.getNFTClassMetadataById(classIdB);
  const aPurchaseData = getters.getNFTClassPurchaseInfoById(classIdA);
  const bPurchaseData = getters.getNFTClassPurchaseInfoById(classIdB);
  const aIsWritingNFT =
    isWritingNFT(aMetadata) &&
    (aPurchaseData?.price || aPurchaseData?.lastSoldPrice) !== undefined;
  const bIsWritingNFT =
    isWritingNFT(bMetadata) &&
    (bPurchaseData?.price || bPurchaseData?.lastSoldPrice) !== undefined;
  if (aIsWritingNFT && !bIsWritingNFT) return -1;
  if (!aIsWritingNFT && bIsWritingNFT) return 1;
  return 0;
}

function compareIsFeatured(getters, address, classIdA, classIdB) {
  const featuredSet = getters.getNFTClassFeaturedSetByAddress(address);
  if (!featuredSet) return 0;
  const aIsFeatured = featuredSet.has(classIdA);
  const bIsFeatured = featuredSet.has(classIdB);
  if (aIsFeatured && !bIsFeatured) return -1;
  if (!aIsFeatured && bIsFeatured) return 1;
  return 0;
}

function compareNumber(X, Y, order) {
  if (Y === undefined) return -1; // keep X in front of Y
  if (X === undefined) return 1; // move Y in front of X
  switch (order) {
    case NFT_CLASS_LIST_SORTING_ORDER.ASC:
      return X - Y;
    case NFT_CLASS_LIST_SORTING_ORDER.DESC:
    default:
      return Y - X;
  }
}

const getters = {
  NFTClassIdList: state => state.userClassIdListMap,
  getNFTListMapByAddress: state => address => state.userClassIdListMap[address],
  getNFTClassFeaturedSetByAddress: state => address =>
    state.userNFTClassFeaturedSetMap[address],
  getNFTClassHiddenSetByAddress: state => address =>
    state.userNFTClassHiddenSetMap[address],
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
  getNFTClassIdListSorterForCreated: (state, getters) => ({
    list,
    collectorWallet: collector,
    sorting,
    order = NFT_CLASS_LIST_SORTING_ORDER.DESC,
    enableFeaturedAndHidden,
  }) => {
    const filtered = enableFeaturedAndHidden
      ? list.filter(
          ({ classId }) =>
            !state.userNFTClassHiddenSetMap[collector]?.has(classId)
        )
      : [...list];
    const sorted = filtered.sort((nA, nB) => {
      const [{ classId: a }, { classId: b }] = [nA, nB];
      const isWritingNFTCompareResult = compareIsWritingNFT(getters, a, b);
      if (isWritingNFTCompareResult !== 0) return isWritingNFTCompareResult;
      if (enableFeaturedAndHidden) {
        const isFeaturedCompareResult = compareIsFeatured(
          getters,
          collector,
          a,
          b
        );
        if (isFeaturedCompareResult !== 0) return isFeaturedCompareResult;
      }
      let X;
      let Y;
      switch (sorting) {
        case NFT_CLASS_LIST_SORTING.PRICE:
          X = getters.getNFTClassPurchaseInfoById(a)?.price;
          Y = getters.getNFTClassPurchaseInfoById(b)?.price;
          if (X !== Y) break;
        // eslint-disable-next-line no-fallthrough
        case NFT_CLASS_LIST_SORTING.ISCN_TIMESTAMP:
        default:
          X = getters.getNFTClassMetadataById(a)?.iscn_record_timestamp;
          Y = getters.getNFTClassMetadataById(b)?.iscn_record_timestamp;
          break;
      }
      return compareNumber(X, Y, order);
    });
    return sorted;
  },
  getNFTClassListSorterForCollected: (state, getters) => ({
    list,
    collectorWallet: collector,
    sorting,
    order = NFT_CLASS_LIST_SORTING_ORDER.DESC,
    enableFeaturedAndHidden,
  }) => {
    const filtered = enableFeaturedAndHidden
      ? list.filter(
          nft => !state.userNFTClassHiddenSetMap[collector]?.has(nft.classId)
        )
      : [...list];
    const sorted = filtered.sort((nA, nB) => {
      const [{ classId: a }, { classId: b }] = [nA, nB];
      const isWritingNFTCompareResult = compareIsWritingNFT(getters, a, b);
      if (isWritingNFTCompareResult !== 0) return isWritingNFTCompareResult;
      if (enableFeaturedAndHidden) {
        const isFeaturedCompareResult = compareIsFeatured(
          getters,
          collector,
          a,
          b
        );
        if (isFeaturedCompareResult !== 0) return isFeaturedCompareResult;
      }
      let X;
      let Y;
      switch (sorting) {
        case NFT_CLASS_LIST_SORTING.PRICE:
          X = getters.getNFTClassPurchaseInfoById(a)?.price;
          Y = getters.getNFTClassPurchaseInfoById(b)?.price;
          if (X !== Y) break;
        // eslint-disable-next-line no-fallthrough
        case NFT_CLASS_LIST_SORTING.NFT_OWNED_COUNT:
          X = getters.getNFTClassOwnerInfoById(a)?.[collector]?.length;
          Y = getters.getNFTClassOwnerInfoById(b)?.[collector]?.length;
          if (X !== Y) break;
        // eslint-disable-next-line no-fallthrough
        case NFT_CLASS_LIST_SORTING.LAST_COLLECTED_NFT:
        default:
          X = getters.getUserLastCollectedTimestampByAddress(collector)[a];
          Y = getters.getUserLastCollectedTimestampByAddress(collector)[b];
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
    const [nfts, createdNFTs] = await Promise.all([
      getNFTsRespectDualPrefix(this.$api, address),
      getNFTClassesRespectDualPrefix(this.$api, address),
    ]);
    const timestampMap = {};
    nfts.forEach(nft => {
      const { classId, timestamp } = nft;
      if (!timestampMap[classId] || timestampMap[classId] < timestamp) {
        timestampMap[classId] = timestamp;
      }
    });
    const collected = [
      ...new Map(
        [...nfts]
          .sort((a, b) => b.timestamp - a.timestamp)
          .map(({ classId, nftId }) => [classId, { classId, id: nftId }])
      ).values(),
    ];
    const created = [
      ...new Map(
        [...createdNFTs].map(({ classId }) => [classId, { classId }])
      ).values(),
    ];

    commit(TYPES.NFT_SET_USER_CLASSID_LIST_MAP, {
      address,
      nfts: {
        created,
        collected,
      },
    });
    commit(TYPES.NFT_SET_USER_LAST_COLLECTED_TIMESTAMP_MAP, {
      address,
      timestampMap,
    });
  },
  async fetchNFTListFeaturedByAddress({ commit }, address) {
    const { data } = await this.$api.get(api.formatFeaturedNFTUrl(address));
    commit(TYPES.NFT_SET_USER_NFT_CLASS_FEATURED_SET_MAP, {
      address,
      classIdSet: new Set(data.featured),
    });
  },
  async fetchNFTListHiddenByAddress({ commit }, address) {
    const { data } = await this.$api.get(api.formatHiddenNFTUrl(address));
    commit(TYPES.NFT_SET_USER_NFT_CLASS_HIDDEN_SET_MAP, {
      address,
      classIdSet: new Set(data.hidden),
    });
  },
  async addNFTFeatured({ state, commit }, { address, classId }) {
    const classIdSet = state.userNFTClassFeaturedSetMap[address];
    classIdSet.add(classId);
    commit(TYPES.NFT_SET_USER_NFT_CLASS_FEATURED_SET_MAP, {
      address,
      classIdSet: new Set(classIdSet), // clone to trigger reactivity
    });
    await this.$api.post(api.formatFeaturedNFTUrl(address), { classId });
  },
  async addNFTHidden({ state, commit }, { address, classId }) {
    const classIdSet = state.userNFTClassHiddenSetMap[address];
    classIdSet.add(classId);
    commit(TYPES.NFT_SET_USER_NFT_CLASS_HIDDEN_SET_MAP, {
      address,
      classIdSet: new Set(classIdSet), // clone to trigger reactivity
    });
    await this.$api.post(api.formatHiddenNFTUrl(address), { classId });
  },
  async removeNFTFeatured({ state, commit }, { address, classId }) {
    const classIdSet = state.userNFTClassFeaturedSetMap[address];
    classIdSet.delete(classId);
    commit(TYPES.NFT_SET_USER_NFT_CLASS_FEATURED_SET_MAP, {
      address,
      classIdSet: new Set(classIdSet), // clone to trigger reactivity
    });
    await this.$api.delete(`${api.formatFeaturedNFTUrl(address)}/${classId}`);
  },
  async removeNFTHidden({ state, commit }, { address, classId }) {
    const classIdSet = state.userNFTClassHiddenSetMap[address];
    classIdSet.delete(classId);
    commit(TYPES.NFT_SET_USER_NFT_CLASS_HIDDEN_SET_MAP, {
      address,
      classIdSet: new Set(classIdSet), // clone to trigger reactivity
    });
    await this.$api.delete(`${api.formatHiddenNFTUrl(address)}/${classId}`);
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
