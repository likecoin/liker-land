/* eslint no-param-reassign: "off" */
import Vue from 'vue';
import { BigNumber } from 'bignumber.js';
import * as api from '@/util/api';
import {
  NFT_CLASS_LIST_SORTING,
  NFT_CLASS_LIST_SORTING_ORDER,
  isValidHttpUrl,
  formatOwnerInfoFromChain,
  fetchAllNFTClassFromChain,
  getNFTClassCollectionType,
  nftClassCollectionType,
  formatNFTClassInfo,
} from '~/util/nft';
import {
  NFT_CLASS_LATEST_DISPLAY_COUNT,
  NFT_CLASS_TRENDING_LIMIT_PER_OWNER,
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
  paymentPriceByClassIdMap: {},
  purchaseInfoByClassIdMap: {},
  metadataByClassIdMap: {},
  metadataByNFTClassAndNFTIdMap: {},
  ownerInfoByClassIdMap: {},
  collectedNFTClassesByAddressMap: {},
  createdNFTClassesByAddressMap: {},
  userNFTClassDisplayStateSetsMap: {},
  nftBookStoreInfoByClassIdMap: {},
  nftCollectionInfoByCollectionIdMap: {},
  latestNFTClassIdList: [],
  freeNFTClassIdList: [],
  trendingNFTClassIdList: [],
  bookstoreLatestItems: [],
  bookstoreCMSProductsByTagIdMap: {},
  bookstoreCMSProductsPaginationOffsetByTagIdMap: {},
  bookstoreCMSProductsByTagIdIsFetchingMap: {},
  bookstoreCMSProductsByTagIdIsFetchingMoreMap: {},
});

const mutations = {
  [TYPES.NFT_SET_ISCN_METADATA](state, { iscnId, data }) {
    Vue.set(state.iscnMetadataByIdMap, iscnId, data);
  },
  [TYPES.NFT_SET_NFT_CLASS_PAYMENT_PRICE_INFO](
    state,
    { collectionId, classId, priceIndex, info }
  ) {
    let key = collectionId || classId;
    if (Number.isInteger(priceIndex)) {
      key = `${classId}_${priceIndex}`;
    }
    if (info) {
      Vue.set(state.paymentPriceByClassIdMap, key, info);
    } else {
      Vue.delete(state.paymentPriceByClassIdMap, key);
    }
  },
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
  [TYPES.NFT_SET_USER_COLLECTED_CLASSES_MAP](
    state,
    { address, classesOrPromise }
  ) {
    Vue.set(state.collectedNFTClassesByAddressMap, address, classesOrPromise);
  },
  [TYPES.NFT_SET_USER_CREATED_CLASSES_MAP](
    state,
    { address, classesOrPromise }
  ) {
    Vue.set(state.createdNFTClassesByAddressMap, address, classesOrPromise);
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
  [TYPES.NFT_BOOK_STORE_INFO_BY_CLASS_ID_MAP_SET](
    state,
    {
      classId,
      prices,
      mustClaimToView,
      hideDownload,
      enableCustomMessagePage,
      enableSignatureImage,
      tableOfContents,
      recommendedClassIds,
    }
  ) {
    Vue.set(state.nftBookStoreInfoByClassIdMap, classId, {
      prices,
      mustClaimToView,
      hideDownload,
      enableCustomMessagePage,
      enableSignatureImage,
      tableOfContents,
      recommendedClassIds,
    });
  },
  [TYPES.NFT_SET_NFT_COLLECTION_INFO](state, { collectionId, data }) {
    const { typePayload, ...otherData } = data;
    Vue.set(state.nftCollectionInfoByCollectionIdMap, collectionId, {
      ...typePayload,
      ...otherData,
    });
  },
  [TYPES.NFT_SET_LATEST_NFT_CLASS_ID_LIST](state, list) {
    state.latestNFTClassIdList = list;
  },
  [TYPES.NFT_SET_FREE_NFT_CLASS_ID_LIST](state, list) {
    state.freeNFTClassIdList = list;
  },
  [TYPES.NFT_SET_TRENDING_NFT_CLASS_ID_LIST](state, list) {
    state.trendingNFTClassIdList = list;
  },
  [TYPES.NFT_SET_BOOKSTORE_LATEST_ITEMS](state, items) {
    state.bookstoreLatestItems = items;
  },
  [TYPES.NFT_SET_BOOKSTORE_CMS_PRODUCTS_BY_TAG_ID](
    state,
    { id, offset, value = [], isAppend = false }
  ) {
    if (isAppend) {
      state.bookstoreCMSProductsByTagIdMap[id].push(...value);
    } else {
      Vue.set(state.bookstoreCMSProductsByTagIdMap, id, value);
    }
    Vue.set(state.bookstoreCMSProductsPaginationOffsetByTagIdMap, id, offset);
  },
  [TYPES.NFT_SET_BOOKSTORE_CMS_PRODUCTS_BY_TAG_ID_IS_FETCHING](
    state,
    { id, value = false }
  ) {
    Vue.set(state.bookstoreCMSProductsByTagIdIsFetchingMap, id, value);
  },
  [TYPES.NFT_SET_BOOKSTORE_CMS_PRODUCTS_BY_TAG_ID_IS_FETCHING_MORE](
    state,
    { id, value = false }
  ) {
    Vue.set(state.bookstoreCMSProductsByTagIdIsFetchingMoreMap, id, value);
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

function limitOwnerForNFTClassList(nftClasses, { limit = 1, max = 10 }) {
  const nftClassList = [];
  const ownerToNFTClassCountMap = {};
  for (let i = 0; i < nftClasses.length; i += 1) {
    const { owner } = nftClasses[i];
    if (!ownerToNFTClassCountMap[owner]) {
      ownerToNFTClassCountMap[owner] = 0;
    }
    if (ownerToNFTClassCountMap[owner] < limit) {
      nftClassList.push(nftClasses[i]);
      ownerToNFTClassCountMap[owner] += 1;
    }
    if (nftClassList.length >= max) break;
  }
  return nftClassList;
}

const getters = {
  getISCNMetadataById: state => iscnId => state.iscnMetadataByIdMap[iscnId],
  getCollectedNFTClassesByAddress: state => address => {
    const classesOrPromise = state.collectedNFTClassesByAddressMap[address];
    return classesOrPromise instanceof Promise ? undefined : classesOrPromise;
  },
  getCreatedNFTClassesByAddress: state => address => {
    const classesOrPromise = state.createdNFTClassesByAddressMap[address];
    return classesOrPromise instanceof Promise ? undefined : classesOrPromise;
  },
  getNFTClassFeaturedSetByAddress: state => address =>
    (state.userNFTClassDisplayStateSetsMap[address] || {}).featuredClassIdSet,
  getNFTClassHiddenSetByAddress: state => address =>
    (state.userNFTClassDisplayStateSetsMap[address] || {}).hiddenClassIdSet,
  getNFTClassPurchaseInfoById: state => id =>
    state.purchaseInfoByClassIdMap[id],
  getNFTClassMetadataById: state => id => state.metadataByClassIdMap[id],
  getNFTClassOwnerInfoById: state => id => state.ownerInfoByClassIdMap[id],
  getNFTClassPaymentPriceById: state => id =>
    state.paymentPriceByClassIdMap[id],
  getNFTIscnRecordsById: state => id =>
    state.metadataByClassIdMap[id]?.iscn_record,
  getNFTClassISCNOwnerByClassId: state => id =>
    state.metadataByClassIdMap[id]?.iscn_owner,
  getNFTClassOwnerCount: (state, getters) => id => {
    const classOwner = getters.getNFTClassISCNOwnerByClassId(id);
    return Object.keys(state.ownerInfoByClassIdMap[id] || {}).filter(
      owner => owner !== classOwner
    ).length;
  },
  getNFTClassCollectedCount: (state, getters) => id => {
    const classOwner = getters.getNFTClassISCNOwnerByClassId(id);
    return Object.entries(state.ownerInfoByClassIdMap[id] || {})
      .filter(([owner]) => owner !== classOwner)
      .reduce((totalCount, [, nftIds]) => totalCount + nftIds.length, 0);
  },
  getNFTMetadataByNFTClassAndNFTId: state => (classId, nftId) =>
    state.metadataByNFTClassAndNFTIdMap[`${classId}-${nftId}`],
  getNFTBookStoreInfoByClassId: state => classId =>
    state.nftBookStoreInfoByClassIdMap[classId],
  getNFTBookStorePricesByClassId: state => classId =>
    state.nftBookStoreInfoByClassIdMap[classId]?.prices || [],
  getNFTBookStorePriceByClassIdAndIndex: state => (classId, index) => {
    const prices = state.nftBookStoreInfoByClassIdMap[classId]?.prices || [];
    return prices.find(p => p.index === index) || prices[index];
  },
  getNFTCollectionInfoByCollectionId: state => collectionId =>
    state.nftCollectionInfoByCollectionIdMap[collectionId],
  getNFTCollectionPriceByCollectionId: state => collectionId => {
    const priceInDecimal =
      state.nftCollectionInfoByCollectionIdMap[collectionId]?.priceInDecimal;
    if (priceInDecimal !== undefined) {
      return priceInDecimal / 100;
    }
    return undefined;
  },
  getNFTCollectionInfoByClassId: state => classId =>
    Object.entries(state.nftCollectionInfoByCollectionIdMap)
      .filter(([_, data]) => data.classIds.includes(classId))
      .map(([id, data]) => ({ id, ...data })),
  getCanViewNFTBookBeforeClaimByClassId: state => classId =>
    !state.nftBookStoreInfoByClassIdMap[classId]?.mustClaimToView,
  getIsHideNFTBookDownload: state => classId =>
    !!state.nftBookStoreInfoByClassIdMap[classId]?.hideDownload,
  filterNFTClassListWithState: state => (nfts, wallet) =>
    nfts.filter(
      ({ classId }) =>
        !state.userNFTClassDisplayStateSetsMap[wallet]?.hiddenClassIdSet?.has(
          classId
        )
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
          X = getters.getNFTClassPurchaseInfoById(a)?.price || nA.price;
          Y = getters.getNFTClassPurchaseInfoById(b)?.price || nB.price;
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
          X = nA.createdAt;
          Y = nB.createdAt;
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
          X = getters.getNFTClassPurchaseInfoById(a)?.price || nA.price;
          Y = getters.getNFTClassPurchaseInfoById(b)?.price || nB.price;
          if (X !== Y) break;
        // eslint-disable-next-line no-fallthrough
        case NFT_CLASS_LIST_SORTING.NFT_OWNED_COUNT:
          X = nA.nftOwnedCount;
          Y = nB.nftOwnedCount;
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
          X = nA.nftLastOwnedAt;
          Y = nB.nftLastOwnedAt;
          break;
      }
      return compareNumber(X, Y, order);
    });
    return sorted;
  },
  nftClassIdListInLatest: state => state.latestNFTClassIdList,
  nftClassIdListInFree: state => state.freeNFTClassIdList,
  nftClassIdListInTrending: state => state.trendingNFTClassIdList,

  nftBookstoreLatestItems: state =>
    state.bookstoreLatestItems.map(item => ({
      ...item,
      // Add minPrice, hasPhysical, hasEbook to each item
      ...item.prices.reduce(
        ({ minPrice, hasPhysical, hasEbook }, item) => ({
          minPrice: Math.min(minPrice, item.price),
          hasPhysical: hasPhysical || item.isPhysicalOnly,
          hasEbook: hasEbook || !item.isPhysicalOnly,
        }),
        {
          minPrice: Infinity,
          hasPhysical: false,
          hasEbook: false,
        }
      ),
    })),
  nftBookstoreCMSProductsForLandingPage: (_, getters) =>
    getters.nftGetBookstoreCMSProductsByTagId('landing'),
  nftGetBookstoreCMSProductsByTagId: state => tagId =>
    state.bookstoreCMSProductsByTagIdMap[tagId]?.map((item, index) => ({
      ...item,
      order: index + 1,
    })) || [],
  nftGetBookstoreCMSProductsPaginationOffsetByTagId: state => tagId =>
    state.bookstoreCMSProductsPaginationOffsetByTagIdMap[tagId],
  nftGetBookstoreCMSProductsHasMoreByTagId: (_, getters) => tagId =>
    !!getters.nftGetBookstoreCMSProductsPaginationOffsetByTagId(tagId),
  nftGetBookstoreCMSProductsByTagIdHasFetched: state => tagId =>
    !!state.bookstoreCMSProductsByTagIdMap[tagId],
  nftGetBookstoreCMSProductsByTagIdIsFetching: state => tagId =>
    !!state.bookstoreCMSProductsByTagIdIsFetchingMap[tagId],
  nftGetBookstoreCMSProductsByTagIdIsFetchingMore: state => tagId =>
    !!state.bookstoreCMSProductsByTagIdIsFetchingMoreMap[tagId],
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
  removeNFTPaymentPriceInfoByClassId({ commit }, classId) {
    commit(TYPES.NFT_SET_NFT_CLASS_PAYMENT_PRICE_INFO, {
      classId,
      info: null,
    });
  },
  async fetchNFTPaymentPriceInfoByClassId({ commit }, classId) {
    if (!classId) return undefined;
    const { fiatPrice, LIKEPrice, LIKEPricePrediscount } = await this.$api.$get(
      api.getPaymentPrice({ classId })
    );
    const info = { fiatPrice, LIKEPrice, LIKEPricePrediscount };
    if (!Array.isArray(classId)) {
      commit(TYPES.NFT_SET_NFT_CLASS_PAYMENT_PRICE_INFO, {
        classId,
        info,
      });
    }
    return info;
  },
  async fetchNFTClassAggregatedInfo(
    { commit, dispatch },
    { classId, excludeOptions = [] }
  ) {
    const {
      classData,
      iscnData,
      ownerInfo,
      purchaseInfo,
      bookstoreInfo,
    } = await this.$api.$get(api.getNFTClassMetadata(classId, excludeOptions));
    const iscnId = classData.parent.iscn_id_prefix;

    const shouldCommit = option => !excludeOptions.includes(option);
    if (shouldCommit('class_chain')) {
      commit(TYPES.NFT_SET_NFT_CLASS_METADATA, {
        classId,
        metadata: classData,
      });
    }
    if (shouldCommit('iscn')) {
      commit(TYPES.NFT_SET_ISCN_METADATA, { iscnId, data: iscnData });
    }
    if (shouldCommit('owner')) {
      commit(TYPES.NFT_SET_NFT_CLASS_OWNER_INFO, { classId, info: ownerInfo });
    }

    // skip for non Writing NFT
    if (shouldCommit('purchase') && purchaseInfo) {
      commit(TYPES.NFT_SET_NFT_CLASS_PURCHASE_INFO, {
        classId,
        info: purchaseInfo,
      });
    }
    if (shouldCommit('bookstore') && bookstoreInfo) {
      const payload = {
        classId,
        prices: bookstoreInfo.prices,
        mustClaimToView: bookstoreInfo.mustClaimToView,
        hideDownload: bookstoreInfo.hideDownload,
        enableCustomMessagePage: bookstoreInfo.enableCustomMessagePage,
        signedMessageText: bookstoreInfo.signedMessageText,
        enableSignatureImage: bookstoreInfo.enableSignatureImage,
        isHidden: bookstoreInfo.isHidden,
        tableOfContents: bookstoreInfo.tableOfContents,
        recommendedClassIds: bookstoreInfo.recommendedClassIds,
      };
      commit(TYPES.NFT_BOOK_STORE_INFO_BY_CLASS_ID_MAP_SET, payload);
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
  async lazyFetchNFTClassAggregatedInfo(
    { getters, dispatch },
    { classId, excludeOptions = [] }
  ) {
    const metadata = getters.getNFTClassMetadataById(classId);
    const fieldsToCheck = [
      metadata,
      getters.getISCNMetadataById(metadata?.parent?.iscn_id_prefix),
      getters.getNFTClassOwnerInfoById(classId),
    ];

    if (fieldsToCheck.some(value => !value)) {
      await dispatch('fetchNFTClassAggregatedInfo', {
        classId,
        excludeOptions,
      });
    }
  },
  async fetchNFTPurchaseInfo({ commit }, classId) {
    const info = await this.$api.$get(api.getNFTPurchaseInfo({ classId }));
    commit(TYPES.NFT_SET_NFT_CLASS_PURCHASE_INFO, { classId, info });
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
  parseAndStoreNFTClassMetadata(
    { commit, getters },
    { classId, classData = {} }
  ) {
    // Do not overwrite aggregated metadata
    if (getters.getNFTClassMetadataById(classId))
      return getters.getNFTClassMetadataById(classId);
    const {
      name,
      description,
      uri,
      parent,
      metadata: classMetadata = {},
      // HACK: owner field only exists in /likechain/likenft/v1/class endpoint,
      // not in /cosmos/nft/v1beta1/classes/:classId endpoint.
      // Should be removed after ISCN data refactor
      // eslint-disable-next-line camelcase
      owner: iscn_owner,
    } = classData;
    const formattedMetadata = {
      name,
      description,
      uri,
      ...classMetadata,
      parent,
      iscn_owner, // overwrite iscn_owner field of classMetadata
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
  async fetchNFTOwners({ commit }, { classId, nocache = false }) {
    const { owners } = await this.$api.$get(api.getNFTOwners(classId, nocache));
    const info = formatOwnerInfoFromChain(owners);
    commit(TYPES.NFT_SET_NFT_CLASS_OWNER_INFO, { classId, info });
    return info;
  },
  async lazyGetNFTOwners({ getters, dispatch }, classId) {
    let owners = getters.getNFTClassOwnerInfoById(classId);
    if (!owners) {
      owners = await dispatch('fetchNFTOwners', { classId });
    }
    return owners;
  },
  async fetchCreatedNFTClassesByAddress({ commit, dispatch }, address) {
    // fetch first page only
    let promise = this.$api.$get(
      api.getNFTClassesPartial({
        classOwner: address,
        reverse: true,
      })
    );
    commit(TYPES.NFT_SET_USER_CREATED_CLASSES_MAP, {
      address,
      classesOrPromise: promise,
    });

    const res = await promise;
    let { classes } = res;
    commit(TYPES.NFT_SET_USER_CREATED_CLASSES_MAP, {
      address,
      classesOrPromise: classes.map(formatNFTClassInfo),
    });

    classes.forEach(c => {
      dispatch('parseAndStoreNFTClassMetadata', {
        classId: c.id,
        classData: c,
      });
    });

    if (res.pagination.next_key) {
      // fetch all pages
      promise = fetchAllNFTClassFromChain(this.$api, {
        classOwner: address,
        key: res.pagination.next_key,
        reverse: true,
      });
      classes = classes.concat(await promise);
      commit(TYPES.NFT_SET_USER_CREATED_CLASSES_MAP, {
        address,
        classesOrPromise: classes.map(formatNFTClassInfo),
      });

      classes.forEach(c => {
        dispatch('parseAndStoreNFTClassMetadata', {
          classId: c.id,
          classData: c,
        });
      });
    }
  },
  async fetchCollectedNFTClassesByAddress(
    { commit, dispatch },
    { address, nocache = false }
  ) {
    // fetch first page only
    let promise = this.$api.$get(
      api.getNFTClassesPartial({
        nftOwner: address,
        nocache,
        reverse: true,
      })
    );
    commit(TYPES.NFT_SET_USER_COLLECTED_CLASSES_MAP, {
      address,
      classesOrPromise: promise,
    });

    const res = await promise;
    let { classes } = res;
    commit(TYPES.NFT_SET_USER_COLLECTED_CLASSES_MAP, {
      address,
      classesOrPromise: classes.map(formatNFTClassInfo),
    });

    classes.forEach(c => {
      dispatch('parseAndStoreNFTClassMetadata', {
        classId: c.id,
        classData: c,
      });
    });

    if (res.pagination.next_key) {
      // fetch all pages
      promise = fetchAllNFTClassFromChain(this.$api, {
        nftOwner: address,
        key: res.pagination.next_key,
        nocache,
        reverse: true,
      });
      classes = classes.concat(await promise);
      commit(TYPES.NFT_SET_USER_COLLECTED_CLASSES_MAP, {
        address,
        classesOrPromise: classes.map(formatNFTClassInfo),
      });

      classes.forEach(c => {
        dispatch('parseAndStoreNFTClassMetadata', {
          classId: c.id,
          classData: c,
        });
      });
    }
  },
  async lazyFetchCreatedNFTClassesByAddress({ state, dispatch }, address) {
    const classesOrPromise = state.createdNFTClassesByAddressMap[address];
    if (classesOrPromise) {
      await classesOrPromise;
    } else {
      await dispatch('fetchCreatedNFTClassesByAddress', address);
    }
  },
  async lazyFetchCollectedNFTClassesByAddress({ state, dispatch }, address) {
    const classesOrPromise = state.collectedNFTClassesByAddressMap[address];
    if (classesOrPromise) {
      await classesOrPromise;
    } else {
      await dispatch('fetchCollectedNFTClassesByAddress', {
        address,
      });
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
  async lazyFetchNFTDisplayStateListByAddress({ state, dispatch }, address) {
    if (!state.userNFTClassDisplayStateSetsMap[address]) {
      await dispatch('fetchNFTDisplayStateListByAddress', address);
    }
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
  async lazyFetchNFTBookInfoByClassId({ dispatch, getters }, classId) {
    let info = getters.getNFTBookStoreInfoByClassId(classId);
    if (!info) {
      info = await dispatch('fetchNFTBookInfoByClassId', classId);
    }
    return info;
  },
  async fetchNFTBookInfoByClassId({ commit }, classId) {
    const { data } = await this.$api.get(
      api.getNFTBookStorePricesByClassId(classId)
    );
    const payload = {
      classId,
      prices: data.prices,
      mustClaimToView: data.mustClaimToView,
      hideDownload: data.hideDownload,
      enableCustomMessagePage: data.enableCustomMessagePage,
      signedMessageText: data.signedMessageText,
      enableSignatureImage: data.enableSignatureImage,
      isHidden: data.isHidden,
      tableOfContents: data.tableOfContents,
      recommendedClassIds: data.recommendedClassIds,
    };
    commit(TYPES.NFT_BOOK_STORE_INFO_BY_CLASS_ID_MAP_SET, payload);
    return payload;
  },
  async fetchNFTCollectionInfoByCollectionId(
    { commit, dispatch },
    { collectionId }
  ) {
    const { data } = await this.$api.get(
      api.getNFTCollectionInfoById({ collectionId })
    );
    commit(TYPES.NFT_SET_NFT_COLLECTION_INFO, {
      collectionId,
      data,
    });
    const { classIds } = data;
    await Promise.all(
      []
        .concat(
          classIds.map(classId => dispatch('lazyGetNFTClassMetadata', classId))
        )
        .concat(
          classIds.map(classId =>
            dispatch('fetchNFTBookInfoByClassId', classId).catch(error => {
              if (error.response?.status !== 404) {
                // eslint-disable-next-line no-console
                console.error(error);
              }
            })
          )
        )
    );
    return data;
  },
  async lazyFetchNFTCollectionInfoByCollectionId(
    { getters, dispatch },
    { collectionId }
  ) {
    let info = getters.getNFTCollectionInfoByCollectionId(collectionId);
    if (!info) {
      info = await dispatch('fetchNFTCollectionInfoByCollectionId', {
        collectionId,
      });
    }
    return info;
  },
  async fetchNFTCollectionInfoByClassId(
    { commit, dispatch },
    { classId, type }
  ) {
    const { data } = await this.$api.get(
      api.getNFTCollectionInfo({ classId, type })
    );
    const { list } = data;
    list.forEach(async ({ id, ...collectionData }) => {
      commit(TYPES.NFT_SET_NFT_COLLECTION_INFO, {
        collectionId: id,
        data: collectionData,
      });
      const { classIds } = collectionData;
      await Promise.all(
        classIds.map(classId => dispatch('lazyGetNFTClassMetadata', classId))
      );
    });
    return list;
  },
  async fetchLatestAndTrendingWNFTClassIdList({ commit }) {
    const trendingDate = new Date();
    trendingDate.setDate(trendingDate.getDate() - 14);
    const trendingDayString = trendingDate.toISOString().split('T')[0];
    const [trendingRes, freeRes, latestRes] = await Promise.all([
      this.$axios.$get(
        api.getTopNFTClasses({
          after: new Date(trendingDayString).getTime() / 1000,
        })
      ),
      this.$axios.$get(api.getFreeNFTClassIds()),
      this.$axios.$get(api.getNFTClassesPartial({ reverse: true })),
    ]);
    const [trendingClasses, latestClasses] = [trendingRes, latestRes].map(res =>
      (res.classes || []).filter(
        c => c.metadata?.nft_meta_collection_id === 'likerland_writing_nft'
      )
    );
    const freeClasses = freeRes.list || [];
    commit(
      TYPES.NFT_SET_LATEST_NFT_CLASS_ID_LIST,
      latestClasses.slice(0, NFT_CLASS_LATEST_DISPLAY_COUNT).map(c => c.id)
    );
    commit(
      TYPES.NFT_SET_FREE_NFT_CLASS_ID_LIST,
      freeClasses.slice(0, NFT_CLASS_LATEST_DISPLAY_COUNT)
    );
    commit(
      TYPES.NFT_SET_TRENDING_NFT_CLASS_ID_LIST,
      limitOwnerForNFTClassList(trendingClasses, {
        limit: NFT_CLASS_TRENDING_LIMIT_PER_OWNER,
        max: NFT_CLASS_LATEST_DISPLAY_COUNT,
      }).map(c => c.id)
    );
  },
  async lazyFetchLatestAndTrendingNFTClassIdList({ getters, dispatch }) {
    if (
      getters.nftClassIdListInLatest.length &&
      getters.nftClassIdListInTrending.length
    ) {
      return;
    }
    await dispatch('fetchLatestAndTrendingWNFTClassIdList');
  },
  async fetchBookstoreCMSProductsForLandingPage({ dispatch }, { t } = {}) {
    await dispatch('lazyFetchBookstoreCMSProductsByTagId', {
      tagId: 'landing',
      t,
    });
  },
  async fetchBookstoreLatestItems({ commit, state }) {
    if (state.bookstoreLatestItems.length) return;
    const { data } = await this.$api.get(api.fetchBookstoreLatestItems());
    commit(
      TYPES.NFT_SET_BOOKSTORE_LATEST_ITEMS,
      data.list.map(({ hideDownload, inLanguage, ...item }) => ({
        ...item,
        locale: inLanguage,
        isDRMFree: !hideDownload,
      }))
    );
  },
  async fetchBookstoreCMSProductsByTagId(
    { commit, getters },
    { tagId, t, limit, offset }
  ) {
    if (
      !tagId ||
      getters.nftGetBookstoreCMSProductsByTagIdIsFetching(tagId) ||
      getters.nftGetBookstoreCMSProductsByTagIdIsFetchingMore(tagId)
    ) {
      return;
    }

    const isFetchingMore = !!offset;
    const fetchingMutation = isFetchingMore
      ? TYPES.NFT_SET_BOOKSTORE_CMS_PRODUCTS_BY_TAG_ID_IS_FETCHING_MORE
      : TYPES.NFT_SET_BOOKSTORE_CMS_PRODUCTS_BY_TAG_ID_IS_FETCHING;
    try {
      commit(fetchingMutation, { id: tagId, value: true });

      const { data } = await this.$api.get(
        api.fetchBookstoreCMSProductsByTagId(tagId, { t, offset, limit })
      );

      commit(TYPES.NFT_SET_BOOKSTORE_CMS_PRODUCTS_BY_TAG_ID, {
        id: tagId,
        value: data.records,
        isAppend: isFetchingMore,
        offset: data.offset,
      });

      if (!data.records?.length) {
        // eslint-disable-next-line no-console
        console.warn(`CMS did not return any products for tag: ${tagId}`);
      }
    } finally {
      commit(fetchingMutation, { id: tagId, value: false });
    }
  },
  async fetchMoreBookstoreCMSProductsByTagId(
    { dispatch, getters },
    { tagId, limit }
  ) {
    const offset = getters.nftGetBookstoreCMSProductsPaginationOffsetByTagId(
      tagId
    );
    if (!offset) return;
    await dispatch('fetchBookstoreCMSProductsByTagId', {
      tagId,
      offset,
      limit,
    });
  },
  async lazyFetchBookstoreCMSProductsByTagId(
    { dispatch, getters },
    { tagId, t, limit }
  ) {
    if (!tagId || getters.nftGetBookstoreCMSProductsByTagIdHasFetched(tagId)) {
      return;
    }

    await dispatch('fetchBookstoreCMSProductsByTagId', { tagId, t, limit });
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
