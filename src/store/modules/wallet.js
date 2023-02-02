/* eslint no-param-reassign: "off" */
import stringify from 'fast-json-stable-stringify';
import {
  LOGIN_MESSAGE,
  LIKECOIN_CHAIN_ID,
  LIKECOIN_CHAIN_MIN_DENOM,
  LIKECOIN_NFT_API_WALLET,
} from '@/constant/index';
import { LIKECOIN_WALLET_CONNECTOR_CONFIG } from '@/constant/network';
import * as types from '@/store/mutation-types';
import { getAccountBalance, getNFTHistoryDataMap } from '~/util/nft';
import {
  getUserInfoMinByAddress,
  postUserV2Login,
  getNFTEvents,
} from '~/util/api';
import { setLoggerUser } from '~/util/EventLogger';
import {
  WALLET_SET_IS_DEBUG,
  WALLET_SET_ADDRESS,
  WALLET_SET_SIGNER,
  WALLET_SET_CONNECTOR,
  WALLET_SET_LIKERINFO,
  WALLET_SET_METHOD_TYPE,
  WALLET_SET_EVENTS,
  WALLET_SET_EVENT_LAST_SEEN_TS,
  WALLET_SET_LIKE_BALANCE,
  WALLET_SET_LIKE_BALANCE_FETCH_PROMISE,
} from '../mutation-types';

const WALLET_EVENT_LIMIT = 100;

let likecoinWalletLib = null;

const state = () => ({
  isDebug: false,
  address: '',
  signer: null,
  loginAddress: '',
  connector: null,
  likerInfo: null,
  eventLastSeenTs: 0,
  events: [],
  isInited: null,
  methodType: null,
  likeBalance: null,
  likeBalanceFetchPromise: null,
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
  [types.WALLET_SET_LOGIN_ADDRESS](state, loginAddress) {
    state.loginAddress = loginAddress;
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
  [WALLET_SET_EVENTS](state, events) {
    state.events = events;
  },
  [WALLET_SET_EVENT_LAST_SEEN_TS](state, eventLastSeenTs) {
    state.eventLastSeenTs = eventLastSeenTs;
  },
  [WALLET_SET_LIKE_BALANCE](state, likeBalance) {
    state.likeBalance = likeBalance;
  },
  [WALLET_SET_LIKE_BALANCE_FETCH_PROMISE](state, promise) {
    state.likeBalanceFetchPromise = promise;
  },
};

const getters = {
  getAddress: state => state.address,
  getSigner: state => state.signer,
  loginAddress: state => state.loginAddress,
  walletHasLoggedIn: state => state.address === state.loginAddress,
  getConnector: state => state.connector,
  getLikerInfo: state => state.likerInfo,
  getEvents: state => state.events.slice(0, WALLET_EVENT_LIMIT),
  getLatestEventTimestamp: state =>
    state.events[0]?.timestamp &&
    new Date(state.events[0]?.timestamp).getTime(),
  getHasUnseenEvents: state =>
    state.eventLastSeenTs &&
    state.events[0]?.timestamp &&
    state.eventLastSeenTs < new Date(state.events[0]?.timestamp).getTime(),
  walletMethodType: state => state.methodType,
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
    dispatch('fetchWalletEvents');
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

  async openConnectWalletModal({ dispatch }, { language } = {}) {
    const connector = await dispatch('getConnector');
    const connection = await connector.openConnectionMethodSelectionDialog({
      language,
    });
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
    commit(types.WALLET_SET_LOGIN_ADDRESS, '');
    commit(types.WALLET_SET_EVENTS, []);
    commit(types.WALLET_SET_EVENT_LAST_SEEN_TS, 0);
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

  async fetchWalletEvents({ state, commit, dispatch }) {
    const { address } = state;
    const [senderRes, receiverRes, purchaseRes] = await Promise.all([
      this.$api.$get(
        getNFTEvents({
          sender: address,
          limit: WALLET_EVENT_LIMIT,
          actionType: '/cosmos.nft.v1beta1.MsgSend',
          ignoreToList: LIKECOIN_NFT_API_WALLET,
          reverse: true,
        })
      ),
      this.$api.$get(
        getNFTEvents({
          receiver: address,
          actionType: '/cosmos.nft.v1beta1.MsgSend',
          limit: WALLET_EVENT_LIMIT,
          reverse: true,
        })
      ),
      // purchase events are sent by LIKECOIN_NFT_API_WALLET
      this.$api.$get(
        getNFTEvents({
          creator: address,
          sender: LIKECOIN_NFT_API_WALLET,
          actionType: '/cosmos.nft.v1beta1.MsgSend',
          limit: WALLET_EVENT_LIMIT,
          reverse: true,
        })
      ),
    ]);
    const events = senderRes.events
      .concat(receiverRes.events)
      .concat(purchaseRes.events);
    const classIds = Array.from(new Set(events.map(e => e.class_id)));

    const addresses = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const list of events) {
      addresses.push(list.sender, list.receiver);
    }
    [...new Set(addresses)]
      .filter(a => !!a)
      .map(a => dispatch('lazyGetUserInfoByAddress', a));

    const promises = events.map(e => {
      if (
        e.action === '/cosmos.nft.v1beta1.MsgSend' &&
        e.sender === LIKECOIN_NFT_API_WALLET
      ) {
        return getNFTHistoryDataMap({
          axios: this.$api,
          classId: e.class_id,
          txHash: e.tx_hash,
        });
      }
      return new Map();
    });

    const historyDatas = await Promise.all(promises);
    historyDatas.forEach((m, index) => {
      if (m) {
        // m is a Map
        m.forEach(data => {
          const { granterMemo, price } = data;
          events[index].price = price;
          events[index].granterMemo = granterMemo;
        });
      }
    });

    commit(
      WALLET_SET_EVENTS,
      events
        .map(e => {
          e.timestamp = new Date(e.timestamp);
          return e;
        })
        .sort((a, b) => b.timestamp - a.timestamp)
    );
    classIds.map(id => dispatch('lazyGetNFTClassMetadata', id));
  },

  async updateEventLastSeenTs({ commit }) {
    await this.$api.$post(updateEventLastSeen());
    commit(WALLET_SET_EVENT_LAST_SEEN_TS, Date.now());
  },

  async walletFetchLIKEBalance({ commit, state }) {
    const { address } = state;
    try {
      let balanceFetch;
      if (state.likeBalanceFetchPromise) {
        balanceFetch = state.likeBalanceFetchPromise;
      } else {
        balanceFetch = getAccountBalance(address);
        commit(types.WALLET_SET_LIKE_BALANCE_FETCH_PROMISE, balanceFetch);
      }
      const balance = await balanceFetch;
      commit(types.WALLET_SET_LIKE_BALANCE, balance);
      return balance;
    } catch (error) {
      throw error;
    } finally {
      commit(types.WALLET_SET_LIKE_BALANCE_FETCH_PROMISE, undefined);
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
      commit(types.WALLET_SET_LOGIN_ADDRESS, address);
      const { user, eventLastSeenTs } = await this.$api.$get(
        api.getUserV2Self()
      );
      commit(types.WALLET_SET_LOGIN_ADDRESS, user);
      if (eventLastSeenTs) {
        commit(types.WALLET_SET_EVENT_LAST_SEEN_TS, eventLastSeenTs);
      }
    } catch (error) {
      commit(types.WALLET_SET_LOGIN_ADDRESS, null);
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
