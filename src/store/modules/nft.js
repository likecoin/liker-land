/* eslint no-param-reassign: "off" */
import Vue from 'vue';
import * as api from '@/util/api';
import {
  NFT_CLASS_LIST_SORTING,
  NFT_CLASS_LIST_SORTING_ORDER,
  checkIsWritingNFT,
  isValidHttpUrl,
  formatOwnerInfoFromChain,
  getNFTsRespectDualPrefix,
  getNFTClassesRespectDualPrefix,
  formatNFTInfo,
  formatNFTClassInfo,
} from '~/util/nft';
import { catchAxiosError } from '~/util/misc';
import { LIKECOIN_NFT_HIDDEN_ITEMS, NFT_DISPLAY_STATE } from '~/constant';
import * as TYPES from '../mutation-types';

const state = () => ({
  purchaseInfoByClassIdMap: {},
  metadataByClassIdMap: {},
  metadataByNFTClassAndNFTIdMap: {},
  ownerInfoByClassIdMap: {},
  userClassIdListMap: {},
  userNFTClassDisplayStateSetsMap: {},
  userLastCollectedTimestampMap: {},
});

const mutations = {
  [TYPES.NFT_SET_NFT_CLASS_PURCHASE_INFO](state, { classId, info }) {
    Vue.set(state.purchaseInfoByClassIdMap, classId, info);
  },
  [TYPES.NFT_SET_NFT_CLASS_METADATA](state, { classId, metadata }) {
    Vue.set(state.metadataByClassIdMap, classId, metadata);
  },
  [TYPES.NFT_SET_NFT_METADATA](state, { classId, nftId, metadata }) {
    Vue.set(
      state.metadataByNFTClassAndNFTIdMap,
      `${classId}-${nftId}`,
      metadata
    );
  },
  [TYPES.NFT_SET_NFT_CLASS_OWNER_INFO](state, { classId, info }) {
    Vue.set(state.ownerInfoByClassIdMap, classId, info);
  },
  [TYPES.NFT_SET_USER_CLASSID_LIST_MAP](state, { address, nfts }) {
    Vue.set(state.userClassIdListMap, address, nfts);
  },
  [TYPES.NFT_SET_USER_NFT_CLASS_DISPLAY_STATE_SETS_MAP](
    state,
    { address, featuredClassIdSet, hiddenClassIdSet }
  ) {
    Vue.set(state.userNFTClassDisplayStateSetsMap, address, {
      featuredClassIdSet,
      hiddenClassIdSet,
    });
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
    checkIsWritingNFT(aMetadata) &&
    (aPurchaseData?.price || aPurchaseData?.lastSoldPrice) !== undefined;
  const bIsWritingNFT =
    checkIsWritingNFT(bMetadata) &&
    (bPurchaseData?.price || bPurchaseData?.lastSoldPrice) !== undefined;
  if (aIsWritingNFT && !bIsWritingNFT) return -1;
  if (!aIsWritingNFT && bIsWritingNFT) return 1;
  return 0;
}

function compareNFTByFeatured(getters, address, classIdA, classIdB) {
  const featuredSet = getters.getNFTClassFeaturedSetByAddress(address);
  if (!featuredSet) return 0;
  const aIsFeatured = featuredSet.has(classIdA);
  const bIsFeatured = featuredSet.has(classIdB);
  if (aIsFeatured && !bIsFeatured) return -1;
  if (!aIsFeatured && bIsFeatured) return 1;
  return 0;
}

function compareNFTByHidden(getters, address, classIdA, classIdB) {
  const hiddenSet = getters.getNFTClassHiddenSetByAddress(address);
  if (!hiddenSet) return 0;
  const aIsHidden = hiddenSet.has(classIdA);
  const bIsHidden = hiddenSet.has(classIdB);
  if (aIsHidden && !bIsHidden) return 1;
  if (!aIsHidden && bIsHidden) return -1;
  return 0;
}

function compareNFTDisplayState(getters, address, classIdA, classIdB) {
  const result = compareNFTByFeatured(getters, address, classIdA, classIdB);
  return result === 0
    ? compareNFTByHidden(getters, address, classIdA, classIdB)
    : result;
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
    (state.userNFTClassDisplayStateSetsMap[address] || {}).featuredClassIdSet,
  getNFTClassHiddenSetByAddress: state => address =>
    (state.userNFTClassDisplayStateSetsMap[address] || {}).hiddenClassIdSet,
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
  getNFTMetadataByNFTClassAndNFTId: state => (classId, nftId) =>
    state.metadataByNFTClassAndNFTIdMap[`${classId}-${nftId}`],
  getUserLastCollectedTimestampByAddress: state => address =>
    state.userLastCollectedTimestampMap[address],
  filterNFTClassListWithState: state => (nfts, collectorWallet) =>
    nfts.filter(
      ({ classId }) =>
        // eslint-disable-next-line prettier/prettier
        !state.userNFTClassDisplayStateSetsMap[collectorWallet]?.hiddenClassIdSet?.has(classId)
    ),
  getNFTClassIdListSorterForCreated: (_, getters) => ({
    list,
    collectorWallet: collector,
    sorting,
    order = NFT_CLASS_LIST_SORTING_ORDER.DESC,
    shouldApplyDisplayState,
  }) => {
    const filtered = shouldApplyDisplayState
      ? getters.filterNFTClassListWithState(list, collector)
      : [...list];
    const sorted = filtered.sort((nA, nB) => {
      const [{ classId: a }, { classId: b }] = [nA, nB];
      if (
        shouldApplyDisplayState ||
        sorting === NFT_CLASS_LIST_SORTING.DISPLAY_STATE
      ) {
        const isFeaturedCompareResult = compareNFTDisplayState(
          getters,
          collector,
          a,
          b
        );
        if (isFeaturedCompareResult !== 0) return isFeaturedCompareResult;
      }
      const isWritingNFTCompareResult = compareIsWritingNFT(getters, a, b);
      if (isWritingNFTCompareResult !== 0) return isWritingNFTCompareResult;
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
          X = Date.parse(
            getters.getNFTClassMetadataById(a)?.iscn_record_timestamp
          );
          Y = Date.parse(
            getters.getNFTClassMetadataById(b)?.iscn_record_timestamp
          );
          break;
      }
      return compareNumber(X, Y, order);
    });
    return sorted;
  },
  getNFTClassListSorterForCollected: (_, getters) => ({
    list,
    collectorWallet: collector,
    sorting,
    order = NFT_CLASS_LIST_SORTING_ORDER.DESC,
    shouldApplyDisplayState,
  }) => {
    const filtered = shouldApplyDisplayState
      ? getters.filterNFTClassListWithState(list, collector)
      : [...list];
    const sorted = filtered.sort((nA, nB) => {
      const [{ classId: a }, { classId: b }] = [nA, nB];
      if (
        shouldApplyDisplayState ||
        sorting === NFT_CLASS_LIST_SORTING.DISPLAY_STATE
      ) {
        const isFeaturedCompareResult = compareNFTDisplayState(
          getters,
          collector,
          a,
          b
        );
        if (isFeaturedCompareResult !== 0) return isFeaturedCompareResult;
      }
      const isWritingNFTCompareResult = compareIsWritingNFT(getters, a, b);
      if (isWritingNFTCompareResult !== 0) return isWritingNFTCompareResult;
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
  normalizeNFTList: (_, getters) => list =>
    [
      ...new Map(
        list.map(({ classId, nftId, ...data }) => [
          classId,
          { ...data, classId, id: nftId },
        ])
      ).values(),
    ]
      .filter(({ classId }) => !LIKECOIN_NFT_HIDDEN_ITEMS.has(classId))
      .sort((a, b) => {
        const aIsWritingNFT = checkIsWritingNFT(
          getters.getNFTClassMetadataById(a.classId)
        );
        const bIsWritingNFT = checkIsWritingNFT(
          getters.getNFTClassMetadataById(b.classId)
        );
        if (aIsWritingNFT && !bIsWritingNFT) return -1;
        if (!aIsWritingNFT && bIsWritingNFT) return 1;
        return b.timestamp - a.timestamp;
      }),
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
  async fetchNFTClassMetadata({ dispatch }, classId) {
    /* HACK: Use restful API instead of cosmjs to avoid loading libsodium,
      which is huge and affects index page performance */
    // const chainMetadata = await getClassInfo(classId);
    const { class: chainMetadata } = await this.$api.$get(
      api.getChainNFTClassMetadataEndpoint(classId)
    );
    const { data, ...info } = chainMetadata;
    const classData = { ...data, ...info };
    dispatch('parseAndStoreNFTClassMetadata', { classId, classData });
    await dispatch('populateNFTClassMetadataFromURIAndISCN', classId);
  },
  parseAndStoreNFTClassMetadata({ commit }, { classId, classData = {} }) {
    const {
      name,
      description,
      uri,
      parent,
      metadata: classMetadata = {},
    } = classData;
    const formattedMetadata = {
      name,
      description,
      uri,
      ...classMetadata,
      parent,
    };
    commit(TYPES.NFT_SET_NFT_CLASS_METADATA, {
      classId,
      metadata: formattedMetadata,
    });
  },
  async populateNFTClassMetadataFromURIAndISCN(
    { commit, dispatch, getters },
    classId
  ) {
    let metadata = getters.getNFTClassMetadataById(classId);
    const { uri, parent } = metadata;
    if (isValidHttpUrl(uri)) {
      const apiMetadata = await this.$api.$get(uri).catch(err => {
        if (!err.response?.status === 404) {
          // eslint-disable-next-line no-console
          console.error(err);
        }
      });
      if (apiMetadata) metadata = { ...metadata, ...apiMetadata };
    }
    if (!(metadata.iscn_owner || metadata.account_owner)) {
      const iscnId = parent?.iscn_id_prefix;
      if (iscnId) {
        const iscnRecord = await this.$api
          .$get(api.getISCNRecord(iscnId))
          .catch(err => {
            if (!err.response?.status === 404) {
              // eslint-disable-next-line no-console
              console.error(err);
            }
          });
        if (iscnRecord) {
          metadata.iscn_owner = iscnRecord.owner;
          metadata.iscn_record_timestamp =
            iscnRecord?.records?.[0]?.recordTimestamp;
        }
      } else if (parent.account) {
        metadata.account_owner = parent.account;
      }
    }
    if (metadata.iscn_owner) {
      dispatch('lazyGetUserInfoByAddress', metadata.iscn_owner);
    }
    commit(TYPES.NFT_SET_NFT_CLASS_METADATA, { classId, metadata });
  },
  async fetchNFTMetadata({ commit }, { classId, nftId }) {
    let metadata;
    const { nft: chainMetadata } = await this.$api.$get(
      api.getChainNFTMetadataEndpoint(classId, nftId)
    );
    const { uri, data: { metadata: nftMetadata = {} } = {} } =
      chainMetadata || {};
    metadata = {
      uri,
      ...nftMetadata,
    };
    if (isValidHttpUrl(uri)) {
      const apiMetadata = await this.$api.$get(uri).catch(err => {
        if (!err.response?.status === 404) {
          // eslint-disable-next-line no-console
          console.error(err);
        }
      });
      if (apiMetadata) metadata = { ...metadata, ...apiMetadata };
    }
    commit(TYPES.NFT_SET_NFT_METADATA, { classId, nftId, metadata });
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
  async fetchNFTListByAddress({ commit, getters, dispatch }, address) {
    const [collectedNFTs, createdNFTClasses] = await Promise.all([
      getNFTsRespectDualPrefix(this.$api, address),
      getNFTClassesRespectDualPrefix(this.$api, address),
    ]);

    const nftClassIdDataMap = new Map();
    collectedNFTs.forEach(n => nftClassIdDataMap.set(n.class_id, n.class_data));
    createdNFTClasses.forEach(c => nftClassIdDataMap.set(c.id, c));
    nftClassIdDataMap.forEach((classData, classId) => {
      dispatch('parseAndStoreNFTClassMetadata', { classId, classData });
    });

    const formattedCreatedNFTClasses = createdNFTClasses.map(
      formatNFTClassInfo
    );
    const formattedCollectedNFTs = collectedNFTs.map(formatNFTInfo);
    commit(TYPES.NFT_SET_USER_CLASSID_LIST_MAP, {
      address,
      nfts: {
        created: getters.normalizeNFTList(formattedCreatedNFTClasses),
        collected: getters.normalizeNFTList(formattedCollectedNFTs),
      },
    });

    const timestampMap = {};
    formattedCollectedNFTs.forEach(nft => {
      const { classId, timestamp } = nft;
      if (!timestampMap[classId] || timestampMap[classId] < timestamp) {
        timestampMap[classId] = timestamp;
      }
    });
    commit(TYPES.NFT_SET_USER_LAST_COLLECTED_TIMESTAMP_MAP, {
      address,
      timestampMap,
    });

    const nftClassIds = Array.from(nftClassIdDataMap.keys());
    await Promise.all(
      nftClassIds.map(classId => {
        const promises = [
          catchAxiosError(
            dispatch('populateNFTClassMetadataFromURIAndISCN', classId)
          ),
          catchAxiosError(dispatch('fetchNFTOwners', classId)),
        ];
        const classData = nftClassIdDataMap.get(classId);
        if (checkIsWritingNFT(classData.metadata)) {
          promises.push(
            catchAxiosError(dispatch('fetchNFTPurchaseInfo', classId))
          );
        }
        return Promise.all(promises);
      })
    );
  },
  async fetchNFTDisplayStateListByAddress({ commit }, address) {
    const { data } = await this.$api.get(api.getNFTDisplayStateURL(address));
    commit(TYPES.NFT_SET_USER_NFT_CLASS_DISPLAY_STATE_SETS_MAP, {
      address,
      featuredClassIdSet: new Set(data.featured),
      hiddenClassIdSet: new Set(data.hidden),
    });
  },
  async setNFTDisplayState(
    { state, commit },
    { displayState, address, classId }
  ) {
    const {
      featuredClassIdSet,
      hiddenClassIdSet,
    } = state.userNFTClassDisplayStateSetsMap[address];
    switch (displayState) {
      case NFT_DISPLAY_STATE.FEATURED:
        featuredClassIdSet.add(classId);
        hiddenClassIdSet.delete(classId);
        break;
      case NFT_DISPLAY_STATE.HIDDEN:
        featuredClassIdSet.delete(classId);
        hiddenClassIdSet.add(classId);
        break;
      case NFT_DISPLAY_STATE.DEFAULT:
      default:
        featuredClassIdSet.delete(classId);
        hiddenClassIdSet.delete(classId);
        break;
    }
    commit(TYPES.NFT_SET_USER_NFT_CLASS_DISPLAY_STATE_SETS_MAP, {
      address,
      featuredClassIdSet,
      hiddenClassIdSet,
    });
    await this.$api.post(api.getNFTDisplayStateURL(address), {
      classId,
      displayState,
    });
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
