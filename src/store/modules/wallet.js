/* eslint no-param-reassign: "off" */

import {
  WALLET_SET_IS_DEBUG,
  WALLET_SET_ADDRESS,
  WALLET_SET_SIGNER,
  WALLET_SET_CONNECTOR,
  WALLET_SET_LIKERINFO,
  WALLET_SET_METHOD_TYPE,
  WALLET_SET_LIKE_BALANCE,
  WALLET_SET_LIKE_BALANCE_FETCH,
} from '../mutation-types';

import * as getters from './getters/wallet';
import * as actions from './actions/wallet';

const state = () => ({
  isDebug: false,
  address: '',
  signer: null,
  connector: null,
  likerInfo: null,
  isInited: null,
  methodType: null,
  likeBalance: null,
  likeBalanceFetch: false,
});

const mutations = {
  [WALLET_SET_IS_DEBUG](state, isDebug) {
    state.isDebug = isDebug;
  },
  [WALLET_SET_ADDRESS](state, address) {
    state.address = address;
  },
  [WALLET_SET_SIGNER](state, signer) {
    state.signer = signer;
  },
  [WALLET_SET_METHOD_TYPE](state, method) {
    state.methodType = method;
  },
  [WALLET_SET_CONNECTOR](state, connector) {
    state.connector = connector;
  },
  [WALLET_SET_LIKERINFO](state, likerInfo) {
    state.likerInfo = likerInfo;
  },
  [WALLET_SET_LIKE_BALANCE](state, likeBalance) {
    state.likeBalance = likeBalance;
  },
  [WALLET_SET_LIKE_BALANCE_FETCH](state, promise) {
    state.likeBalanceFetch = promise;
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
