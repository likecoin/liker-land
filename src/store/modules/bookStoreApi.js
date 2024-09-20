/* eslint no-param-reassign: "off" */

import { postAuthenticate } from '~/util/api';
import {
  saveAuthSession,
  clearAuthSession,
  loadAuthSession,
} from '~/util/auth';
import {
  BOOKSTORE_API_SET_TOKEN,
  BOOKSTORE_API_SET_SESSION_WALLET,
  BOOKSTORE_API_SET_IS_LOADING,
} from '../mutation-types';

const initialState = () => ({
  token: '',
  sessionWallet: '',
  isRestoringSession: false,
});

const mutations = {
  [BOOKSTORE_API_SET_TOKEN](state, token) {
    state.token = token;
  },
  [BOOKSTORE_API_SET_SESSION_WALLET](state, wallet) {
    state.sessionWallet = wallet;
  },
  [BOOKSTORE_API_SET_IS_LOADING](state, isLoading) {
    state.isRestoringSession = isLoading;
  },
};

const actions = {
  async authenticate({ commit }, { inputWallet = '', signature = {} }) {
    try {
      const { token } = await this.$api.$post(postAuthenticate(), signature);
      if (!token) {
        throw new Error('INVALID_SIGNATURE');
      }
      commit(BOOKSTORE_API_SET_TOKEN, token);
      commit(BOOKSTORE_API_SET_SESSION_WALLET, inputWallet);
      saveAuthSession({ wallet: inputWallet, token });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      throw new Error('AUTHENTICATION_FAILED');
    }
  },

  clearSession({ commit }) {
    commit(BOOKSTORE_API_SET_TOKEN, '');
    commit(BOOKSTORE_API_SET_SESSION_WALLET, '');
    clearAuthSession();
  },

  async restoreAuthSession({ commit, dispatch }) {
    try {
      commit(BOOKSTORE_API_SET_IS_LOADING, true);
      const session = loadAuthSession();
      if (session) {
        commit(BOOKSTORE_API_SET_TOKEN, session.token);
        commit(BOOKSTORE_API_SET_SESSION_WALLET, session.wallet);
        if (session.wallet) {
          await dispatch('restoreSession');
        }
      }
    } finally {
      commit(BOOKSTORE_API_SET_IS_LOADING, false);
    }
  },
};

const getters = {
  getToken: state => state.token,
  getSessionWallet: state => state.sessionWallet,
  getIsRestoringSession: state => state.isRestoringSession,
};

export default {
  actions,
  getters,
  state: initialState,
  mutations,
};
