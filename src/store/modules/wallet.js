/* eslint no-param-reassign: "off" */

import { LIKECOIN_WALLET_CONNECTOR_CONFIG } from '@/constant/network';
import * as types from '@/store/mutation-types';
import { getAccountBalance } from '~/util/nft';
import { getUserInfoMinByAddress } from '~/util/api';
import { setLoggerUser } from '~/util/EventLogger';
import {
  WALLET_SET_IS_DEBUG,
  WALLET_SET_ADDRESS,
  WALLET_SET_SIGNER,
  WALLET_SET_CONNECTOR,
  WALLET_SET_LIKERINFO,
  WALLET_SET_METHOD_TYPE,
  WALLET_LIKE_BALANCE,
} from '../mutation-types';

let likecoinWalletLib = null;

const state = () => ({
  isDebug: false,
  address: '',
  signer: null,
  connector: null,
  likerInfo: null,
  isInited: null,
  methodType: null,
  likeBalance: null,
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
  [WALLET_LIKE_BALANCE](state, likeBalance) {
    state.likeBalance = likeBalance;
  },
};

const getters = {
  getAddress: state => state.address,
  getSigner: state => state.signer,
  getConnector: state => state.connector,
  getLikerInfo: state => state.likerInfo,
  walletMethodType: state => state.methodType,
  walletLIKEBalance: state => state.likeBalance,
};

const actions = {
  async getLikeCoinWalletLib() {
    if (!likecoinWalletLib) {
      likecoinWalletLib = await import(/* webpackChunkName: "likecoin_wallet" */ '@likecoin/wallet-connector');
    }
    return likecoinWalletLib;
  },

  async initWallet({ commit, dispatch }, { method, accounts, offlineSigner }) {
    if (!accounts[0]) return false;
    const connector = await dispatch('getConnector');
    // Listen once per account
    connector.once('account_change', async currentMethod => {
      const connection = await connector.init(currentMethod);
      dispatch('initWallet', connection);
    });
    commit(types.WALLET_SET_METHOD_TYPE, method);
    commit(types.WALLET_SET_LIKERINFO, null);
    const { address, bech32Address } = accounts[0];
    const walletAddress = bech32Address || address;
    commit(types.WALLET_SET_ADDRESS, walletAddress);
    commit(types.WALLET_SET_SIGNER, offlineSigner);
    await setLoggerUser(this, { wallet: walletAddress, method });
    try {
      const userInfo = await this.$api.$get(
        getUserInfoMinByAddress(walletAddress)
      );
      commit(types.WALLET_SET_LIKERINFO, userInfo);
    } catch (err) {
      const msg = (err.response && err.response.data) || err;
      // eslint-disable-next-line no-console
      console.error(msg);
    }
    return true;
  },

  async getConnector({ state, commit, dispatch }) {
    if (state.connector) {
      return state.connector;
    }
    const lib = await dispatch('getLikeCoinWalletLib');
    const connector = new lib.LikeCoinWalletConnector({
      ...LIKECOIN_WALLET_CONNECTOR_CONFIG,
    });
    commit(types.WALLET_SET_CONNECTOR, connector);
    return connector;
  },

  async openConnectWalletModal({ dispatch }) {
    const connector = await dispatch('getConnector');
    const connection = await connector.openConnectWalletModal();
    return connection;
  },

  disconnectWallet({ state, commit }) {
    if (state.connector) {
      state.connector.disconnect();
    }
    commit(types.WALLET_SET_ADDRESS, '');
    commit(types.WALLET_SET_SIGNER, null);
    commit(types.WALLET_SET_CONNECTOR, null);
    commit(types.WALLET_SET_LIKERINFO, null);
  },

  async restoreSession({ dispatch }) {
    const connector = await dispatch('getConnector');
    const session = connector.restoreSession();
    if (session) {
      const { accounts, method } = session;
      await dispatch('initWallet', { accounts, method });
    }
  },

  async initIfNecessary({ dispatch }) {
    const connector = await dispatch('getConnector');
    const connection = await connector.initIfNecessary();
    if (connection) {
      const { accounts, offlineSigner, method } = connection;
      await dispatch('initWallet', { accounts, offlineSigner, method });
    }
  },

  async walletFetchLIKEBalance({ commit, state }) {
    const { address } = state;
    const balance = await getAccountBalance(address);
    commit(types.WALLET_LIKE_BALANCE, balance);
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
