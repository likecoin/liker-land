/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies

import {
  STATIC_SET_USER_INFO_BY_ID,
  STATIC_SET_USER_INFO_BY_ADDRESS,
  STATIC_SET_USER_INFO_LAST_QUERY_TIMESTAMP,
  STATIC_SET_ARTICLE_INFO,
  STATIC_SET_USER_FETCHING,
  STATIC_SET_NFT_CLASS_PURCHASE_INFO,
  STATIC_SET_NFT_CLASS_METADATA,
  STATIC_SET_NFT_CLASS_OWNER_INFO,
} from '../mutation-types';
import * as getters from './getters/staticData';
import * as actions from './actions/staticData';

const state = () => ({
  userInfosById: {},
  userInfoMapByAddress: {},
  userInfoLastQueryTimestampMap: {},
  articleInfos: {},
  nftClassPurchaseInfo: {},
  nftClassMetadata: {},
  nftClassOwnerInfo: {},
  fetching: {
    user: {},
    article: {},
  },
});

const mutations = {
  [STATIC_SET_USER_INFO_BY_ID](state, { id, userInfo }) {
    Vue.set(state.userInfosById, id, userInfo);
  },
  [STATIC_SET_USER_INFO_BY_ADDRESS](state, { address, userInfo }) {
    Vue.set(state.userInfoMapByAddress, address, userInfo);
  },
  [STATIC_SET_USER_INFO_LAST_QUERY_TIMESTAMP](state, { address, timestamp }) {
    Vue.set(state.userInfoLastQueryTimestampMap, address, timestamp);
  },
  [STATIC_SET_ARTICLE_INFO](state, { referrer, info }) {
    Vue.set(state.articleInfos, referrer, info);
  },
  [STATIC_SET_USER_FETCHING](state, { id, payload }) {
    Vue.set(state.fetching.user, id, payload);
  },
  [STATIC_SET_NFT_CLASS_PURCHASE_INFO](state, { classId, info }) {
    Vue.set(state.nftClassPurchaseInfo, classId, info);
  },
  [STATIC_SET_NFT_CLASS_METADATA](state, { classId, metadata }) {
    Vue.set(state.nftClassMetadata, classId, metadata);
  },
  [STATIC_SET_NFT_CLASS_OWNER_INFO](state, { classId, info }) {
    Vue.set(state.nftClassOwnerInfo, classId, info);
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
