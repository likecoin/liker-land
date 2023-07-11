/* eslint no-param-reassign: "off" */
import Vue from 'vue';
import { BigNumber } from 'bignumber.js';
import * as api from '@/util/api';
import {
  NFT_CLASS_LIST_SORTING,
  NFT_CLASS_LIST_SORTING_ORDER,
  checkIsWritingNFT,
  isValidHttpUrl,
  formatOwnerInfoFromChain,
  fetchAllNFTFromChain,
  fetchAllNFTClassFromChain,
  getNFTClassCollectionType,
  nftClassCollectionType,
  formatNFTInfo,
  formatNFTClassInfo,
} from '~/util/nft';
import { catchAxiosError } from '~/util/misc';
import {
  loadShoppingCartFromStorage,
  saveShoppingCartToStorage,
} from '~/util/shopping-cart';
import { getGemLevelBySoldCount } from '~/util/writing-nft';
import {
  BATCH_COLLECT_MAX,
  LIKECOIN_NFT_HIDDEN_ITEMS,
  NFT_DISPLAY_STATE,
} from '~/constant';
import * as TYPES from '../mutation-types';

const typeOrder = {
  [nftClassCollectionType.NFTBook]: 2,
  [nftClassCollectionType.WritingNFT]: 1,
  [nftClassCollectionType.Other]: 0,
};

const state = () => ({
  iscnMetadataByIdMap: {},
  fiatPriceInfoByClassIdMap: {},
  purchaseInfoByClassIdMap: {},
  listingInfoByClassIdMap: {},
  metadataByClassIdMap: {},
  metadataByNFTClassAndNFTIdMap: {},
  ownerInfoByClassIdMap: {},
  userClassIdListMap: {},
  userNFTClassDisplayStateSetsMap: {},
  userLastCollectedTimestampMap: {},
  nftBookStorePricesByClassIdMap: {},
  shoppingCartNFTClassByIdMap: {},
});

const mutations = {
  [TYPES.NFT_SET_ISCN_METADATA](state, { iscnId, data }) {
    Vue.set(state.iscnMetadataByIdMap, iscnId, data);
  },
  [TYPES.NFT_SET_NFT_CLASS_FIAT_PRICE_INFO](state, { classId, data }) {
    if (data) {
      const { fiatPrice, listingInfo } = data;
      Vue.set(state.fiatPriceInfoByClassIdMap, classId, {
        fiatPrice,
        listingInfo,
      });
    } else {
      Vue.delete(state.fiatPriceInfoByClassIdMap, classId);
    }
  },
  [TYPES.NFT_SET_NFT_CLASS_PURCHASE_INFO](state, { classId, info }) {
    Vue.set(state.purchaseInfoByClassIdMap, classId, info);
  },
  [TYPES.NFT_SET_NFT_CLASS_LISTING_INFO](state, { classId, info }) {
    Vue.set(state.listingInfoByClassIdMap, classId, info);
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
  [TYPES.NFT_BOOK_STORE_PRICES_BY_CLASS_ID_MAP_SET](
    state,
    { classId, prices }
  ) {
    Vue.set(state.nftBookStorePricesByClassIdMap, classId, prices);
  },
  [TYPES.SHOPPING_CART_ADD_NFT_CLASS](state, { classId }) {
    let item = state.shoppingCartNFTClassByIdMap[classId];
    if (!item) {
      item = {
        timestamp: Date.now(),
        quantity: 1,
      };
    } else {
      item = {
        ...item,
        quantity: item.quantity + 1,
      };
    }
    Vue.set(state.shoppingCartNFTClassByIdMap, classId, item);
  },
  [TYPES.SHOPPING_CART_REMOVE_NFT_CLASS](state, { classId }) {
    Vue.delete(state.shoppingCartNFTClassByIdMap, classId);
  },
  [TYPES.SHOPPING_CART_REPLACE_ALL_NFT_CLASS](state, map) {
    state.shoppingCartNFTClassByIdMap = map;
  },
};

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
  getISCNMetadataById: state => iscnId => state.iscnMetadataByIdMap[iscnId],
  getNFTListMapByAddress: state => address => state.userClassIdListMap[address],
  getNFTClassFeaturedSetByAddress: state => address =>
    (state.userNFTClassDisplayStateSetsMap[address] || {}).featuredClassIdSet,
  getNFTClassHiddenSetByAddress: state => address =>
    (state.userNFTClassDisplayStateSetsMap[address] || {}).hiddenClassIdSet,
  getNFTClassPurchaseInfoById: state => id =>
    state.purchaseInfoByClassIdMap[id],
  getNFTClassListingInfoById: state => id => state.listingInfoByClassIdMap[id],
  getNFTClassMetadataById: state => id => state.metadataByClassIdMap[id],
  getNFTClassOwnerInfoById: state => id => state.ownerInfoByClassIdMap[id],
  getNFTClassFiatPriceInfoById: state => id =>
    state.fiatPriceInfoByClassIdMap[id],
  getNFTIscnRecordsById: state => id =>
    state.metadataByClassIdMap[id]?.iscn_record,
  getNFTClassISCNOwnerByClassId: state => id =>
    state.metadataByClassIdMap[id]?.iscn_owner,
  getNFTClassOwnerCount: (state, getters) => id => {
    const iscnOwner = getters.getNFTClassISCNOwnerByClassId(id);
    return Object.keys(state.ownerInfoByClassIdMap[id] || {}).filter(
      owner => owner !== iscnOwner
    ).length;
  },
  getNFTClassCollectedCount: (state, getters) => id => {
    const iscnOwner = getters.getNFTClassISCNOwnerByClassId(id);
    return Object.entries(state.ownerInfoByClassIdMap[id] || {})
      .filter(([owner]) => owner !== iscnOwner)
      .reduce((totalCount, [, nftIds]) => totalCount + nftIds.length, 0);
  },
  getNFTClassGemLevel: state => id =>
    getGemLevelBySoldCount(
      state.purchaseInfoByClassIdMap[id]?.metadata?.soldCount || 0
    ),
  getNFTMetadataByNFTClassAndNFTId: state => (classId, nftId) =>
    state.metadataByNFTClassAndNFTIdMap[`${classId}-${nftId}`],
  getUserLastCollectedTimestampByAddress: state => address =>
    state.userLastCollectedTimestampMap[address],
  getNFTBookStorePricesByClassId: state => classId =>
    state.nftBookStorePricesByClassIdMap[classId],
  filterNFTClassListWithState: state => (nfts, collectorWallet) =>
    nfts.filter(
      ({ classId }) =>
        !state.userNFTClassDisplayStateSetsMap[
          collectorWallet
        ]?.hiddenClassIdSet?.has(classId)
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
      let X;
      let Y;
      switch (sorting) {
        case NFT_CLASS_LIST_SORTING.PRICE:
          X = getters.getNFTClassPurchaseInfoById(a)?.price;
          Y = getters.getNFTClassPurchaseInfoById(b)?.price;
          if (X !== Y) break;
        // eslint-disable-next-line no-fallthrough
        case NFT_CLASS_LIST_SORTING.TYPE: {
          const XMetaData = getters.getNFTClassMetadataById(a);
          const YMetaData = getters.getNFTClassMetadataById(b);
          X = typeOrder[getNFTClassCollectionType(XMetaData)];
          Y = typeOrder[getNFTClassCollectionType(YMetaData)];
          if (X !== Y) break;
        }
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
        case NFT_CLASS_LIST_SORTING.TYPE: {
          const XMetaData = getters.getNFTClassMetadataById(a);
          const YMetaData = getters.getNFTClassMetadataById(b);
          X = typeOrder[getNFTClassCollectionType(XMetaData)];
          Y = typeOrder[getNFTClassCollectionType(YMetaData)];
          if (X !== Y) break;
        }
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
  shoppingCartNFTClassList: state => {
    const list = [...Object.entries(state.shoppingCartNFTClassByIdMap)].map(
      ([classId, data]) => ({ classId, ...data })
    );
    list.sort((a, b) => a.timestamp - b.timestamp);
    return list;
  },
  getShoppingCartNFTClassQuantity: state => classId =>
    state.shoppingCartNFTClassByIdMap[classId]?.quantity || 0,
};

const actions = {
  async fetchISCNMetadataById({ commit }, iscnId) {
    if (!iscnId) return undefined;
    try {
      /* HACK: Use restful API instead of cosmjs to avoid loading libsodium,
        which is huge and affects index page performance */
      // const res = await getISCNRecord(iscnId);
      const req = this.$axios.$get(api.getISCNRecord(iscnId));
      commit(TYPES.NFT_SET_ISCN_METADATA, { iscnId, data: req });
      const res = await req;
      const [{ data } = {}] = res.records || [];
      data.owner = res.owner;
      commit(TYPES.NFT_SET_ISCN_METADATA, { iscnId, data });
      return data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return undefined;
    }
  },
  async lazyGetISCNMetadataById({ getters, dispatch }, iscnId) {
    // HACK: await due to possible pending promise in getter
    let info = await getters.getISCNMetadataById(iscnId);
    if (!info) {
      info = await dispatch('fetchISCNMetadataById', iscnId);
    }
    return info;
  },
  removeNFTFiatPriceInfoByClassId({ commit }, classId) {
    commit(TYPES.NFT_SET_NFT_CLASS_FIAT_PRICE_INFO, {
      classId,
      data: undefined,
    });
  },
  async fetchNFTFiatPriceInfoByClassId({ commit }, classId) {
    if (!classId) return undefined;
    const { fiatPrice, listingInfo } = await this.$api.$get(
      api.getStripeFiatPrice({ classId })
    );
    const data = { fiatPrice, listingInfo };
    commit(TYPES.NFT_SET_NFT_CLASS_FIAT_PRICE_INFO, { classId, data });
    return data;
  },
  async fetchNFTClassAggregatedInfo({ commit, dispatch }, classId) {
    const {
      classData,
      iscnData,
      ownerInfo,
      listings,
      purchaseInfo,
    } = await this.$api.$get(api.getNFTClassMetadata(classId));
    const iscnId = classData.parent.iscn_id_prefix;
    commit(TYPES.NFT_SET_NFT_CLASS_METADATA, { classId, metadata: classData });
    commit(TYPES.NFT_SET_ISCN_METADATA, { iscnId, data: iscnData });
    commit(TYPES.NFT_SET_NFT_CLASS_OWNER_INFO, { classId, info: ownerInfo });
    commit(TYPES.NFT_SET_NFT_CLASS_LISTING_INFO, { classId, info: listings });
    // skip for non Writing NFT
    if (purchaseInfo) {
      commit(TYPES.NFT_SET_NFT_CLASS_PURCHASE_INFO, {
        classId,
        info: purchaseInfo,
      });
    }
    if (classData.iscn_owner) {
      const promise = dispatch(
        'lazyGetUserInfoByAddress',
        classData.iscn_owner
      );
      // Need to await if the action fires in during SSR
      if (!process.client) await promise;
    }
  },
  async fetchNFTPurchaseInfo({ commit }, classId) {
    const info = await this.$api.$get(api.getNFTPurchaseInfo({ classId }));
    commit(TYPES.NFT_SET_NFT_CLASS_PURCHASE_INFO, { classId, info });
    return info;
  },
  async fetchNFTListingInfo({ commit, dispatch }, classId) {
    const [{ listings }, ownerInfo] = await Promise.all([
      this.$api.$get(api.getChainNFTClassListingEndpoint(classId)),
      dispatch('lazyGetNFTOwners', classId),
    ]);
    const info = listings
      .map(l => {
        const {
          class_id: classId,
          nft_id: nftId,
          seller,
          price,
          expiration,
        } = l;
        return {
          classId,
          nftId,
          seller,
          price: new BigNumber(price).shiftedBy(-9).toNumber(),
          expiration: new Date(expiration),
        };
      })
      .filter(l => ownerInfo[l.seller]?.includes(l.nftId)) // guard listing then sent case
      .sort((a, b) => a.price - b.price);
    commit(TYPES.NFT_SET_NFT_CLASS_LISTING_INFO, { classId, info });
    return info;
  },
  async lazyGetNFTPurchaseAndListingInfo({ getters, dispatch }, classId) {
    let info = getters.getNFTClassPurchaseInfoById(classId);
    const listingInfo = getters.getNFTClassListingInfoById(classId);
    if (!listingInfo) dispatch('fetchNFTListingInfo', classId);
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
    const metadata = await dispatch(
      'populateNFTClassMetadataFromURIAndISCN',
      classId
    );
    return metadata;
  },
  async lazyGetNFTClassMetadata({ getters, dispatch }, classId) {
    let info = getters.getNFTClassMetadataById(classId);
    if (!info) {
      info = await dispatch('fetchNFTClassMetadata', classId);
    }
    return info;
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
    return formattedMetadata;
  },
  async populateNFTClassMetadataFromURIAndISCN(
    { commit, dispatch, getters },
    classId
  ) {
    let metadata = getters.getNFTClassMetadataById(classId);
    let iscnRecord;
    const { uri, parent } = metadata;
    if (isValidHttpUrl(uri)) {
      const apiMetadata = await this.$api.$get(uri).catch(err => {
        if (err.response?.status !== 404) {
          // eslint-disable-next-line no-console
          console.error(err);
        }
      });
      if (apiMetadata && typeof apiMetadata === 'object') {
        metadata = { ...metadata, ...apiMetadata };
      }
    }
    const iscnId = parent?.iscn_id_prefix;
    if (iscnId) {
      iscnRecord = await dispatch('lazyGetISCNMetadataById', iscnId);
      if (iscnRecord) {
        metadata.iscn_record = iscnRecord;
      }
    }
    if (!(metadata.iscn_owner || metadata.account_owner)) {
      if (iscnRecord) {
        metadata.iscn_owner = iscnRecord.owner;
        metadata.iscn_record_timestamp =
          iscnRecord?.records?.[0]?.recordTimestamp;
      } else if (parent.account) {
        metadata.account_owner = parent.account;
      }
    }
    if (metadata.iscn_owner) {
      const promise = dispatch('lazyGetUserInfoByAddress', metadata.iscn_owner);
      // Need to await if the action fires in during SSR
      if (!process.client) await promise;
    }
    commit(TYPES.NFT_SET_NFT_CLASS_METADATA, { classId, metadata });
    return metadata;
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
      if (apiMetadata && typeof apiMetadata === 'object') {
        metadata = { ...metadata, ...apiMetadata };
      }
    }
    commit(TYPES.NFT_SET_NFT_METADATA, { classId, nftId, metadata });
    return metadata;
  },
  async lazyGetNFTMetadata({ getters, dispatch }, { classId, nftId }) {
    let info = getters.getNFTMetadataByNFTClassAndNFTId(classId, nftId);
    if (!info) {
      info = await dispatch('fetchNFTMetadata', { classId, nftId });
    }
    return info;
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
  async fetchNFTListByAddress(
    { commit, getters, dispatch },
    { address, shouldFetchDetails = true } = {}
  ) {
    const [collectedNFTs, createdNFTClasses] = await Promise.all([
      fetchAllNFTFromChain(this.$api, address),
      fetchAllNFTClassFromChain(this.$api, address),
    ]);

    const nftClassIdDataMap = new Map();
    collectedNFTs.forEach(n => nftClassIdDataMap.set(n.class_id, n.class_data));
    createdNFTClasses.forEach(c => nftClassIdDataMap.set(c.id, c));
    if (shouldFetchDetails) {
      nftClassIdDataMap.forEach((classData, classId) => {
        dispatch('parseAndStoreNFTClassMetadata', { classId, classData });
      });
    }

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

    if (shouldFetchDetails) {
      const nftClassIds = Array.from(nftClassIdDataMap.keys());
      await Promise.all(
        nftClassIds.map(classId =>
          catchAxiosError(dispatch('fetchNFTClassAggregatedInfo', classId))
        )
      );
    }
  },
  async fetchNFTDisplayStateListByAddress({ commit }, address) {
    const { data } = await this.$api.get(api.getUserV2DisplayState(address));
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
    await this.$api.post(api.postUserV2DisplayState(address), {
      classId,
      displayState,
    });
  },
  async fetchNFTBookPriceByClassId({ commit }, classId) {
    const { data } = await this.$api.get(
      api.getNFTBookStorePricesByClassId(classId)
    );
    commit(TYPES.NFT_BOOK_STORE_PRICES_BY_CLASS_ID_MAP_SET, {
      classId,
      prices: data.prices,
    });
  },
  addNFTClassToShoppingCart({ commit, dispatch, getters }, { classId }) {
    if (getters.shoppingCartNFTClassList.length >= BATCH_COLLECT_MAX) {
      return;
    }
    commit(TYPES.SHOPPING_CART_ADD_NFT_CLASS, { classId });
    dispatch('saveShoppingCart');
  },
  addNFTClassesToShoppingCart({ commit, dispatch }, { classIds }) {
    commit(TYPES.SHOPPING_CART_REPLACE_ALL_NFT_CLASS, {});
    classIds.slice(0, BATCH_COLLECT_MAX).forEach(classId => {
      commit(TYPES.SHOPPING_CART_ADD_NFT_CLASS, { classId });
    });
    dispatch('saveShoppingCart');
  },
  removeNFTClassFromShoppingCart({ commit, dispatch }, { classId }) {
    commit(TYPES.SHOPPING_CART_REMOVE_NFT_CLASS, { classId });
    dispatch('saveShoppingCart');
  },
  clearShoppingCart({ commit, dispatch }) {
    commit(TYPES.SHOPPING_CART_REPLACE_ALL_NFT_CLASS, {});
    dispatch('saveShoppingCart');
  },
  saveShoppingCart({ state }) {
    saveShoppingCartToStorage(state.shoppingCartNFTClassByIdMap);
  },
  loadShoppingCart({ commit }) {
    commit(
      TYPES.SHOPPING_CART_REPLACE_ALL_NFT_CLASS,
      loadShoppingCartFromStorage()
    );
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
