/* eslint no-param-reassign: "off" */

import {
  WALLET_SET_ADDRESS,
  WALLET_SET_SIGNER,
  WALLET_SET_CONNECTOR,
} from '../mutation-types';

import * as getters from './getters/wallet';
import * as actions from './actions/wallet';

const state = () => ({
  address: '',
  signer: null,
  connector: null,
});

const mutations = {
  [WALLET_SET_ADDRESS](state, address) {
    state.address = address;
  },
  [WALLET_SET_SIGNER](state, signer) {
    state.signer = signer;
  },
  [WALLET_SET_CONNECTOR](state, connector) {
    state.connector = connector;
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
