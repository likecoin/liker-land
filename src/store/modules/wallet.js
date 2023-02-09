/* eslint no-param-reassign: "off" */
import stringify from 'fast-json-stable-stringify';
import {
  LOGIN_MESSAGE,
  LIKECOIN_CHAIN_ID,
  LIKECOIN_CHAIN_MIN_DENOM,
} from '@/constant/index';
import { LIKECOIN_WALLET_CONNECTOR_CONFIG } from '@/constant/network';

import { getAccountBalance } from '~/util/nft';
import {
  getUserInfoMinByAddress,
  getUserV2Self,
  postUserV2Login,
  postUserV2Logout,
  getUserFollowees,
  postFollowCreator,
  apiUserV2WalletEmail,
} from '~/util/api';
import { setLoggerUser } from '~/util/EventLogger';

import {
  WALLET_SET_IS_DEBUG,
  WALLET_SET_ADDRESS,
  WALLET_SET_SIGNER,
  WALLET_SET_CONNECTOR,
  WALLET_SET_LIKERINFO,
  WALLET_SET_METHOD_TYPE,
  WALLET_SET_LIKE_BALANCE,
  WALLET_SET_LIKE_BALANCE_FETCH_PROMISE,
  WALLET_SET_FOLLOWEES,
  WALLET_SET_FOLLOWEES_FETCHING_STATE,
  WALLET_SET_USER_INFO,
  WALLET_SET_IS_LOGGING_IN,
} from '../mutation-types';

let likecoinWalletLib = null;

const state = () => ({
  isDebug: false,
  address: '',
  signer: null,
  connector: null,
  likerInfo: null,
  followees: [],
  isFetchingFollowees: false,
  isInited: null,
  methodType: null,
  likeBalance: null,
  likeBalanceFetchPromise: null,

  // Note: Suggest to rename to sessionAddress
  loginAddress: '',
  email: '',
  emailUnverified: '',
  isLoggingIn: false,
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
  [WALLET_SET_IS_LOGGING_IN](state, isLoggingIn) {
    state.isLoggingIn = isLoggingIn;
  },
  [WALLET_SET_USER_INFO](state, userInfo) {
    if (userInfo) {
      const { user, email, emailUnconfirmed, followees } = userInfo;
      if (user !== undefined) {
        state.loginAddress = user;
      }
      if (email !== undefined) {
        state.email = email;
      }
      if (emailUnconfirmed !== undefined) {
        state.emailUnverified = emailUnconfirmed;
      }
      if (Array.isArray(followees)) {
        state.followees = followees;
      }
    } else {
      state.loginAddress = '';
      state.email = '';
      state.emailUnverified = '';
      state.followees = [];
    }
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
  [WALLET_SET_LIKE_BALANCE_FETCH_PROMISE](state, promise) {
    state.likeBalanceFetchPromise = promise;
  },
  [WALLET_SET_FOLLOWEES](state, followees) {
    state.followees = followees;
  },
  [WALLET_SET_FOLLOWEES_FETCHING_STATE](state, isFetching) {
    state.isFetchingFollowees = isFetching;
  },
};

const getters = {
  getAddress: state => state.address,
  getSigner: state => state.signer,
  loginAddress: state => state.loginAddress,
  walletHasLoggedIn: state => !!state.loginAddress,
  walletIsMatchedSession: (state, getters) =>
    getters.walletHasLoggedIn && state.address === state.loginAddress,
  getConnector: state => state.connector,
  getLikerInfo: state => state.likerInfo,
  walletFollowees: state => state.followees,
  walletIsFetchingFollowees: state => state.isFetchingFollowees,
  walletMethodType: state => state.methodType,
  walletEmail: state => state.email,
  walletEmailUnverified: state => state.emailUnverified,
  walletHasVerifiedEmail: state => !!state.email,
  walletIsLoggingIn: state => state.isLoggingIn,
  walletLIKEBalance: state => state.likeBalance,
  walletLIKEBalanceFetchPromise: state => state.likeBalanceFetchPromise,
};

const actions = {
  async getLikeCoinWalletLib() {
    if (!likecoinWalletLib) {
      likecoinWalletLib = await import(/* webpackChunkName: "likecoin_wallet" */ '@likecoin/wallet-connector');
    }
    return likecoinWalletLib;
  },

  async initWallet(
    { commit, dispatch, getters, state },
    { method, accounts, offlineSigner }
  ) {
    if (!accounts[0]) return false;
    const connector = await dispatch('getConnector');
    // Listen once per account
    connector.once('account_change', async currentMethod => {
      const connection = await connector.init(currentMethod);
      dispatch('walletLogout');
      await dispatch('initWallet', connection);
    });
    commit(WALLET_SET_METHOD_TYPE, method);
    commit(WALLET_SET_LIKERINFO, null);
    const { address, bech32Address } = accounts[0];
    const walletAddress = bech32Address || address;
    commit(WALLET_SET_ADDRESS, walletAddress);
    commit(WALLET_SET_SIGNER, offlineSigner);
    await setLoggerUser(this, { wallet: walletAddress, method });
    try {
      const userInfo = await this.$api.$get(
        getUserInfoMinByAddress(walletAddress)
      );
      commit(WALLET_SET_LIKERINFO, userInfo);
      if (state.signer && !getters.walletIsMatchedSession) {
        await dispatch('signLogin');
      }
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
    commit(WALLET_SET_CONNECTOR, connector);
    return connector;
  },

  async openConnectWalletModal({ dispatch }, { language } = {}) {
    const connector = await dispatch('getConnector');
    const connection = await connector.openConnectionMethodSelectionDialog({
      language,
    });
    return connection;
  },

  async disconnectWallet({ state, commit, dispatch }) {
    if (state.connector) {
      state.connector.disconnect();
    }
    commit(WALLET_SET_ADDRESS, '');
    commit(WALLET_SET_SIGNER, null);
    commit(WALLET_SET_CONNECTOR, null);
    commit(WALLET_SET_LIKERINFO, null);
    await dispatch('walletLogout');
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
    try {
      let balanceFetch;
      if (state.likeBalanceFetchPromise) {
        balanceFetch = state.likeBalanceFetchPromise;
      } else {
        balanceFetch = getAccountBalance(address);
        commit(WALLET_SET_LIKE_BALANCE_FETCH_PROMISE, balanceFetch);
      }
      const balance = await balanceFetch;
      commit(WALLET_SET_LIKE_BALANCE, balance);
      return balance;
    } catch (error) {
      throw error;
    } finally {
      commit(WALLET_SET_LIKE_BALANCE_FETCH_PROMISE, undefined);
    }
  },
  async walletFetchSessionUserInfo({ commit }, address) {
    try {
      commit(WALLET_SET_FOLLOWEES_FETCHING_STATE, true);
      const userInfo = await this.$api.$get(getUserV2Self());
      commit(WALLET_SET_USER_INFO, userInfo || { user: address });
      return userInfo;
    } catch (error) {
      throw error;
    } finally {
      commit(WALLET_SET_FOLLOWEES_FETCHING_STATE, false);
    }
  },
  async signLogin({ state, commit, dispatch }) {
    if (!state.signer) {
      await dispatch('initIfNecessary');
    }
    const { address } = state;
    const memo = [
      `${LOGIN_MESSAGE}:`,
      JSON.stringify({
        ts: Date.now(),
        address,
      }),
    ].join(' ');
    const payload = {
      chain_id: LIKECOIN_CHAIN_ID,
      memo,
      msgs: [],
      fee: {
        gas: '0',
        amount: [{ denom: LIKECOIN_CHAIN_MIN_DENOM, amount: '0' }],
      },
      sequence: '0',
      account_number: '0',
    };
    try {
      commit(WALLET_SET_IS_LOGGING_IN, true);
      const {
        signed: message,
        signature: { signature, pub_key: publicKey },
      } = await state.signer.sign(address, payload);
      const data = {
        signature,
        publicKey: publicKey.value,
        message: stringify(message),
        from: address,
      };
      await this.$api.post(postUserV2Login(), data);
      await dispatch('walletFetchSessionUserInfo', address);
    } catch (error) {
      commit(WALLET_SET_USER_INFO, null);
      if (error.message === 'Request rejected') {
        // User rejected login request
      } else {
        // eslint-disable-next-line no-console
        console.error(error);
        throw error;
      }
    } finally {
      commit(WALLET_SET_IS_LOGGING_IN, false);
    }
  },

  async walletLogout({ commit }) {
    try {
      commit(WALLET_SET_USER_INFO, null);
      commit(WALLET_SET_FOLLOWEES, []);
      await this.$api.post(postUserV2Logout());
    } catch (error) {
      throw error;
    }
  },
  async walletUpdateEmail({ state, commit }, email) {
    try {
      await this.$api.$post(
        apiUserV2WalletEmail({ wallet: state.loginAddress, email })
      );
      commit(WALLET_SET_USER_INFO, { emailUnconfirmed: email });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      throw error;
    }
  },
  async walletVerifyEmail({ state, commit }, token) {
    try {
      await this.$api.$put(
        apiUserV2WalletEmail({ wallet: state.loginAddress, token })
      );
      commit(WALLET_SET_USER_INFO, {
        email: state.emailUnverified,
        emailUnconfirmed: '',
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      throw error;
    }
  },
  // Since we can get followees from user info, we don't need to fetch followees separately
  async walletFetchFollowees({ state, commit, dispatch }, address) {
    try {
      if (state.isFetchingFollowees) return;
      commit(WALLET_SET_FOLLOWEES_FETCHING_STATE, true);
      const { followees } = await this.$axios.$get(getUserFollowees(address));
      commit(WALLET_SET_FOLLOWEES, followees);
      if (followees.length) {
        dispatch('lazyGetUserInfoByAddresses', followees);
      }
    } catch (error) {
      throw error;
    } finally {
      commit(WALLET_SET_FOLLOWEES_FETCHING_STATE, false);
    }
  },
  async walletFollowCreator({ state, commit }, creator) {
    const prevFollowees = state.followees;
    try {
      commit(WALLET_SET_FOLLOWEES, [...state.followees, creator].sort());
      await this.$api.$post(
        postFollowCreator({ wallet: state.loginAddress, creator })
      );
    } catch (error) {
      commit(WALLET_SET_FOLLOWEES, prevFollowees);
      throw error;
    }
  },
  async walletUnfollowCreator({ state, commit }, creator) {
    const prevFollowees = state.followees;
    try {
      await this.$api.$delete(
        postFollowCreator({ wallet: state.loginAddress, creator })
      );
      commit(
        WALLET_SET_FOLLOWEES,
        [...state.followees].filter(followee => followee !== creator)
      );
    } catch (error) {
      commit(WALLET_SET_FOLLOWEES, prevFollowees);
      throw error;
    }
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
