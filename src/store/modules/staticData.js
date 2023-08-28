/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies

import {
  STATIC_SET_USER_INFO,
  STATIC_SET_USER_INFO_FETCHING,
  STATIC_SET_USER_INFO_BY_ADDRESS,
  STATIC_SET_USER_INFO_LAST_QUERY_TIMESTAMP,
  STATIC_SET_ARTICLE_INFO,
  STATIC_SET_USER_FETCHING,
  STATIC_SET_LIKE_PRICE_IN_USD,
  STATIC_SET_SUBSCRIPTION_PLAN_DATA,
} from '../mutation-types';
import * as getters from './getters/staticData';
import * as actions from './actions/staticData';

const state = () => ({
  userInfos: {},
  userInfoMapByAddress: {},
  userInfoLastQueryTimestampMap: {},
  articleInfos: {},
  LIKEPriceInUSD: 0,
  subscriptionPlans: {},
  fetching: {
    user: {},
    userInfo: {},
    article: {},
  },
});

const mutations = {
  [STATIC_SET_USER_INFO](state, { id, user }) {
    Vue.set(state.userInfos, id, user);
  },
  [STATIC_SET_USER_INFO_FETCHING](state, { address, promise }) {
    Vue.set(state.fetching.userInfo, address, promise);
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
  [STATIC_SET_LIKE_PRICE_IN_USD](state, LIKEPriceInUSD) {
    state.LIKEPriceInUSD = LIKEPriceInUSD;
  },
  [STATIC_SET_SUBSCRIPTION_PLAN_DATA](state, { creatorWallet, planId, data }) {
    Vue.set(state.subscriptionPlans, `${creatorWallet}_${planId}`, data);
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
