/* eslint no-param-reassign: "off" */
import Vue from 'vue';

import { NFT_SET_USER_CLASSID_LIST } from '../mutation-types';

import * as getters from './getters/nft';
import * as actions from './actions/nft';

const state = () => ({
  userClassIdList: {},
});

const mutations = {
  [NFT_SET_USER_CLASSID_LIST](state, { address, nfts }) {
    Vue.set(state.userClassIdList, address, nfts);
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
