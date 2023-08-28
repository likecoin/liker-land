/* eslint no-param-reassign: "off" */
import Vue from 'vue';
import BigNumber from 'bignumber.js';
import jwt from 'jsonwebtoken';
import {
  LIKECOIN_CHAIN_MIN_DENOM,
  LIKECOIN_NFT_API_WALLET,
} from '@/constant/index';
import { LIKECOIN_WALLET_CONNECTOR_CONFIG } from '@/constant/network';
import { catchAxiosError } from '~/util/misc';
import { amountToLIKE, getNFTHistoryDataMap } from '~/util/nft';
import { signLoginMessage, signWalletActionMessage } from '~/util/cosmos';
import {
  getUserInfoMinByAddress,
  getUserV2Self,
  postUserV2Login,
  postUserV2Logout,
  getUserV2Followees,
  postUserV2Followees,
  deleteUserV2Followees,
  getUserV2Followers,
  postUserV2WalletEmail,
  putUserV2WalletEmail,
  getUserNotificationSettingsUrl,
  getNFTEvents,
  getNFTClassesPartial,
  getTotalSalesByAddress,
  getTotalRoyaltyByAddress,
  getTotalResalesByAddress,
  getAccountBalance,
  getWalletAuthorizeAPI,
  nftGetUserActiveSubscription,
} from '~/util/api';
import { checkIsLikeCoinAppInAppBrowser } from '~/util/client';
import { setLoggerUser } from '~/util/EventLogger';

import {
  WALLET_SET_IS_DEBUG,
  WALLET_SET_ADDRESS,
  WALLET_SET_SIGNER,
  WALLET_SET_CONNECTOR,
  WALLET_SET_LIKERINFO,
  WALLET_SET_METHOD_TYPE,
  WALLET_SET_EVENTS,
  WALLET_UPDATE_EVENT,
  WALLET_SET_EVENT_LAST_SEEN_TS,
  WALLET_SET_LIKE_BALANCE,
  WALLET_SET_LIKE_BALANCE_FETCH_PROMISE,
  WALLET_SET_FOLLOWEES,
  WALLET_SET_FOLLOWEES_FETCHING_STATE,
  WALLET_SET_FOLLOWEE_EVENTS,
  WALLET_SET_FOLLOWEE_EVENT_FETCHING,
  WALLET_SET_FEED_EVENT_MEMO,
  WALLET_SET_FOLLOWERS,
  WALLET_SET_FOLLOWERS_FETCHING_STATE,
  WALLET_SET_USER_INFO,
  WALLET_SET_IS_LOGGING_IN,
  WALLET_SET_IS_CONNECTING_WALLET,
  WALLET_SET_EVENT_FETCHING,
  WALLET_SET_PAST_FOLLOWEES,
  WALLET_SET_NOTIFICATION_SETTINGS,
  WALLET_SET_TOTAL_SALES,
  WALLET_SET_TOTAL_ROYALTY,
  WALLET_SET_SALES_DETAILS,
  WALLET_SET_ROYALTY_DETAILS,
  WALLET_SET_TOTAL_RESALES,
  WALLET_SET_RESALE_DETAILS,
  WALLET_SET_LIKECOIN_API_ACCESS_TOKEN,
  WALLET_SET_SUBSCRIPTION_STATUS,
} from '../mutation-types';

const WALLET_EVENT_LIMIT = 100;

let likecoinWalletLib = null;

const state = () => ({
  isDebug: false,
  address: '',
  isConnectingWallet: false,
  signer: null,
  connector: null,
  likerInfo: null,
  followees: [],
  followers: [],
  pastFollowees: [],
  isFetchingFollowees: false,
  isFetchingFollowers: false,
  eventLastSeenTs: 0,
  events: [],
  followeeEvents: [],
  feedEventMemoByTxMap: {},
  isInited: null,
  methodType: null,
  likeBalance: null,
  likeBalanceFetchPromise: null,
  isFetchingEvent: false,
  isFetchingFolloweeEvent: false,
  notificationSettings: null,

  totalSales: 0,
  totalRoyalty: 0,
  totalResales: 0,
  salesDetails: [],
  royaltyDetails: [],
  resalesDetails: [],

  likecoinApiAccessToken: '',
  subscriptionStatus: {},

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
  [WALLET_SET_IS_CONNECTING_WALLET](state, isConnecting) {
    state.isConnectingWallet = isConnecting;
  },
  [WALLET_SET_IS_LOGGING_IN](state, isLoggingIn) {
    state.isLoggingIn = isLoggingIn;
  },
  [WALLET_SET_USER_INFO](state, userInfo) {
    if (userInfo) {
      const { user, email, emailUnconfirmed, eventLastSeenTs } = userInfo;
      if (user !== undefined) {
        state.loginAddress = user;
      }
      if (email !== undefined) {
        state.email = email;
      }
      if (emailUnconfirmed !== undefined) {
        state.emailUnverified = emailUnconfirmed;
      }
      if (eventLastSeenTs) {
        state.eventLastSeenTs = eventLastSeenTs;
      }
    } else {
      state.loginAddress = '';
      state.email = '';
      state.emailUnverified = '';
      state.eventLastSeenTs = -1;
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
  [WALLET_SET_EVENTS](state, events) {
    state.events = events;
  },
  [WALLET_UPDATE_EVENT](state, { id, event }) {
    const index = state.events.findIndex(e => e.id === id);
    if (index > -1) {
      Vue.set(state.events, index, { ...state.events[index], ...event });
    }
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
  [WALLET_SET_FOLLOWEES](state, followees) {
    state.followees = followees;
  },
  [WALLET_SET_FOLLOWERS](state, followers) {
    state.followers = followers;
  },
  [WALLET_SET_PAST_FOLLOWEES](state, pastFollowees) {
    state.pastFollowees = pastFollowees;
  },
  [WALLET_SET_FOLLOWEES_FETCHING_STATE](state, isFetching) {
    state.isFetchingFollowees = isFetching;
  },
  [WALLET_SET_FOLLOWERS_FETCHING_STATE](state, isFetching) {
    state.isFetchingFollowers = isFetching;
  },
  [WALLET_SET_EVENT_FETCHING](state, isFetching) {
    state.isFetchingEvent = isFetching;
  },
  [WALLET_SET_NOTIFICATION_SETTINGS](state, notificationSettings) {
    state.notificationSettings = notificationSettings;
  },
  [WALLET_SET_TOTAL_SALES](state, totalSales) {
    state.totalSales = totalSales;
  },
  [WALLET_SET_TOTAL_ROYALTY](state, royalty) {
    state.totalRoyalty = royalty;
  },
  [WALLET_SET_TOTAL_RESALES](state, resales) {
    state.totalResales = resales;
  },
  [WALLET_SET_SALES_DETAILS](state, list) {
    state.salesDetails = list;
  },
  [WALLET_SET_ROYALTY_DETAILS](state, list) {
    state.royaltyDetails = list;
  },
  [WALLET_SET_RESALE_DETAILS](state, list) {
    state.resalesDetails = list;
  },
  [WALLET_SET_FOLLOWEE_EVENT_FETCHING](state, isFetching) {
    state.isFetchingFolloweeEvent = isFetching;
  },
  [WALLET_SET_FOLLOWEE_EVENTS](state, events) {
    state.followeeEvents = events;
  },
  [WALLET_SET_FEED_EVENT_MEMO](state, { txHash, event }) {
    Vue.set(state.feedEventMemoByTxMap, txHash, event);
  },
  [WALLET_SET_SUBSCRIPTION_STATUS](state, subscriptionStatus) {
    state.subscriptionStatus = subscriptionStatus;
  },
  [WALLET_SET_LIKECOIN_API_ACCESS_TOKEN](state, likecoinApiAccessToken) {
    state.likecoinApiAccessToken = likecoinApiAccessToken;
  },
};

const getters = {
  getAddress: state => state.address,
  getSigner: state => state.signer,
  loginAddress: state => state.loginAddress,
  walletHasLoggedIn: state => !!state.address && !!state.loginAddress,
  walletIsMatchedSession: (state, getters) =>
    getters.walletHasLoggedIn && state.address === state.loginAddress,
  getConnector: state => state.connector,
  getLikerInfo: state => state.likerInfo,
  walletFollowees: state => state.followees,
  walletFollowers: state => state.followers,
  walletInteractedCreators: state => state.pastFollowees,
  walletIsFetchingFollowees: state => state.isFetchingFollowees,
  walletIsFetchingFollowers: state => state.isFetchingFollowers,
  walletIsFetchingFolloweeEvents: state => state.isFetchingFolloweeEvent,
  getIsFetchingEvent: state => state.isFetchingEvent,
  getEvents: state => state.events.slice(0, WALLET_EVENT_LIMIT),
  getFolloweeEvents: state => state.followeeEvents,
  getLatestEventTimestamp: state =>
    state.events[0]?.timestamp &&
    new Date(state.events[0]?.timestamp).getTime(),
  getEventLastSeenTs: state => state.eventLastSeenTs,
  getHasUnseenEvents: state =>
    state.eventLastSeenTs &&
    state.events[0]?.timestamp &&
    state.eventLastSeenTs < new Date(state.events[0]?.timestamp).getTime(),
  getNotificationCount: (state, getters) => {
    const { getEvents } = getters;
    if (!state.eventLastSeenTs || !getEvents || !getters.loginAddress) {
      return 0;
    }
    return getEvents.reduce((count, e) => {
      if (
        state.eventLastSeenTs < new Date(e.timestamp).getTime() &&
        ['nft_sale', 'receive_nft', 'mint_nft'].includes(e.eventType)
      ) {
        return count + 1;
      }
      return count;
    }, 0);
  },
  getHasFetchMemo: state => tx => tx in state.feedEventMemoByTxMap,
  getFeedEventMemo: state => tx => (state.feedEventMemoByTxMap[tx] || {}).memo,
  getAvailableFeedTxList: state =>
    Object.keys(state.feedEventMemoByTxMap).filter(
      txHash => state.feedEventMemoByTxMap[txHash]?.memo
    ),
  getActiveSubscriptionStatus: state => state.subscriptionStatus,
  getIsSubscribedToCreator: state => creator =>
    !!state.subscriptionStatus[creator],
  walletHasLikeCoinApiAuthorization: state => {
    if (!state.likecoinApiAccessToken) return false;
    const decoded = jwt.decode(state.likecoinApiAccessToken);
    if (!decoded) return false;
    return decoded.exp && decoded.exp > Date.now() / 1000;
  },
  walletLikeCoinApiToken: state => state.likecoinApiAccessToken,
  walletTotalSales: state => state.totalSales,
  walletTotalRoyalty: state => state.totalRoyalty,
  walletTotalResales: state => state.totalResales,
  walletSalesDetails: state => state.salesDetails,
  walletRoyaltyDetails: state => state.royaltyDetails,
  walletResalesDetails: state => state.resalesDetails,
  walletMethodType: state => state.methodType,
  walletEmail: state => state.email,
  walletEmailUnverified: state => state.emailUnverified,
  walletHasVerifiedEmail: state => !!state.email,
  walletIsLoggingIn: state => state.isConnectingWallet || state.isLoggingIn,
  walletLIKEBalance: state => state.likeBalance,
  walletLIKEBalanceFetchPromise: state => state.likeBalanceFetchPromise,
  walletNotificationSettings: state => state.notificationSettings,
};

function formatEventType(e, loginAddress) {
  let eventType;
  if (e.action === 'new_class') {
    eventType = 'mint_nft';
  } else if (e.action === 'buy_nft' || e.action === 'sell_nft') {
    if (e.receiver === loginAddress) {
      eventType = 'purchase_nft';
    } else {
      eventType = 'nft_sale';
    }
  } else if (e.sender === LIKECOIN_NFT_API_WALLET) {
    if (e.receiver === loginAddress) {
      eventType = 'purchase_nft';
    } else {
      eventType = 'nft_sale';
    }
  } else if (e.receiver === loginAddress) {
    eventType = 'receive_nft';
  } else if (e.sender === loginAddress) {
    eventType = 'send_nft';
  } else {
    eventType = 'transfer_nft';
  }
  return eventType;
}

const actions = {
  async getLikeCoinWalletLib() {
    if (!likecoinWalletLib) {
      likecoinWalletLib = await import(/* webpackChunkName: "likecoin_wallet" */ '@likecoin/wallet-connector');
    }
    return likecoinWalletLib;
  },

  async initWallet({ commit, dispatch }, { method, accounts, offlineSigner }) {
    if (!accounts[0]) return false;
    commit(WALLET_SET_IS_CONNECTING_WALLET, true);
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
    commit(WALLET_SET_IS_CONNECTING_WALLET, false);
    await setLoggerUser(this, { wallet: walletAddress, method });
    catchAxiosError(
      this.$api.$get(getUserInfoMinByAddress(walletAddress)).then(userInfo => {
        commit(WALLET_SET_LIKERINFO, userInfo);
      })
    );
    return true;
  },

  async initWalletAndLogin({ dispatch, getters }, connection) {
    const isInited = await dispatch('initWallet', connection);
    if (!isInited) return false;

    try {
      if (getters.walletIsMatchedSession) {
        // Do not await here to prevent blocking
        dispatch('walletFetchSessionUserData', { shouldSkipUserInfo: true });
      } else if (getters.getAddress) {
        // Re-login if the wallet address is different from session
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

  async openConnectWalletModal(
    { commit, dispatch },
    {
      language,
      connectWalletTitle,
      connectWalletMobileWarning,
      shouldRecommendConnectionMethod = false,
      onEvent,
    } = {}
  ) {
    commit(WALLET_SET_IS_CONNECTING_WALLET, true);
    const connector = await dispatch('getConnector');
    if (shouldRecommendConnectionMethod) {
      connector.options.availableMethods = [
        'keplr',
        ['keplr-mobile', { tier: 1, isRecommended: true }],
        'cosmostation',
        'cosmostation-mobile',
        'liker-id',
        'leap',
        'walletconnect-v2',
      ];
    }
    const connection = await connector.openConnectionMethodSelectionDialog({
      language,
      connectWalletTitle,
      connectWalletMobileWarning,
      onEvent,
    });
    commit(WALLET_SET_IS_CONNECTING_WALLET, false);
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
    // HACK: check for localStorage session before init-ing wallet connector lib
    // wallet connector lib is a huge js
    let hasSession = false;
    try {
      if (window.localStorage) {
        hasSession = !!window.localStorage.getItem(
          'likecoin_wallet_connector_session'
        );
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
    if (!hasSession) return;
    const connector = await dispatch('getConnector');
    const session = connector.restoreSession();
    if (session) {
      const { accounts, method } = session;
      await dispatch('initWallet', { accounts, method });
      if (getters.walletIsMatchedSession) {
        dispatch('walletFetchSessionUserData', { shouldSkipUserInfo: true });
      }
    }
  },

  async initIfNecessary({ dispatch }) {
    const connector = await dispatch('getConnector');
    const connection = await connector.initIfNecessary();
    if (connection) {
      const { accounts, offlineSigner, method } = connection;
      await dispatch('initWallet', {
        accounts,
        offlineSigner,
        method,
      });
    }
  },

  fetchFolloweeWalletEvent({ state, dispatch }) {
    const { loginAddress: address, followees } = state;
    if (!followees.length) return;

    // Get gift events
    this.$api
      .$get(
        getNFTEvents({
          receiver: address,
          limit: WALLET_EVENT_LIMIT,
          actionType: ['/cosmos.nft.v1beta1.MsgSend'],
          ignoreFromList: LIKECOIN_NFT_API_WALLET,
          reverse: true,
        })
      )
      .then(res =>
        dispatch('processEvents', {
          events: res.events,
          address,
        })
      )
      .catch(error => {
        console.error(error);
      });

    // Get followees events
    followees.forEach(async followee => {
      try {
        const [followeeSentEvents, followeeReceivedEvents] = await Promise.all([
          this.$api.$get(
            getNFTEvents({
              sender: followee,
              limit: WALLET_EVENT_LIMIT,
              actionType: [
                '/cosmos.nft.v1beta1.MsgSend',
                'buy_nft',
                'new_class',
              ],
              ignoreToList: LIKECOIN_NFT_API_WALLET,
              reverse: true,
            })
          ),
          this.$api.$get(
            getNFTEvents({
              receiver: followee,
              limit: WALLET_EVENT_LIMIT,
              actionType: ['/cosmos.nft.v1beta1.MsgSend', 'buy_nft'],
              reverse: true,
            })
          ),
        ]);
        const followeeEvents = []
          .concat(followeeSentEvents.events)
          .concat(followeeReceivedEvents.events);

        dispatch('processEvents', {
          events: followeeEvents,
          address,
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    });
  },

  processEvents({ state, commit }, { events, address }) {
    events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const categorizeEvent = event => {
      switch (event.action) {
        case '/cosmos.nft.v1beta1.MsgSend':
          event.type =
            event.sender === LIKECOIN_NFT_API_WALLET ? 'collect' : 'send';
          break;
        case 'new_class':
          event.type = 'publish';
          break;
        case 'buy_nft':
          event.type = 'purchase';
          break;
        default:
          break;
      }
      return event;
    };
    const categorizedEvents = events.map(categorizeEvent);

    // filter available events
    const filteredEvents = categorizedEvents.filter(event => {
      if (event.sender === address) {
        return false;
      }
      if (event.type !== 'send' && event.receiver === address) {
        return false;
      }
      if (event.type === 'send') {
        return !!event.memo;
      }
      return true;
    });

    if (filteredEvents?.length) {
      const existingEvents = state.followeeEvents || [];
      const updatedEvents = [...existingEvents, ...filteredEvents];
      commit(WALLET_SET_FOLLOWEE_EVENTS, updatedEvents);
    }
    return filteredEvents;
  },

  async lazyFetchEventsMemo({ commit, dispatch, getters }, categorizedEvent) {
    if (getters.getHasFetchMemo(categorizedEvent.tx_hash))
      return getters.getFeedEventMemo(categorizedEvent.tx_hash);

    const txHash = categorizedEvent.tx_hash;
    const event = { ...categorizedEvent };
    let memo;

    switch (event.type) {
      case 'send':
        memo = event.memo;
        break;

      case 'publish':
        try {
          const metadata = await dispatch(
            'lazyGetNFTClassMetadata',
            event.class_id
          );
          memo = metadata.message;
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
          memo = '';
        }
        break;

      case 'collect':
      case 'purchase':
        try {
          const map = await getNFTHistoryDataMap({
            axios: this.$api,
            classId: event.class_id,
            txHash,
          });
          if (map.size) {
            map.forEach(data => {
              const { granterMemo } = data;
              memo = granterMemo;
            });
          } else {
            memo = '';
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
          memo = '';
        }
        break;

      default:
        memo = '';
        break;
    }

    commit(WALLET_SET_FEED_EVENT_MEMO, {
      txHash,
      event: { memo },
    });
    return memo;
  },

  async fetchWalletEvents(
    { state, commit, dispatch },
    { shouldFetchDetails = true }
  ) {
    const { address, followees } = state;
    if (!address) {
      return;
    }
    commit(WALLET_SET_EVENT_FETCHING, true);
    const getFolloweesNewClassEvents = followees =>
      this.$api
        .$get(
          getNFTClassesPartial({
            iscnOwner: followees,
            reverse: true,
          })
        )
        .then(({ classes }) =>
          classes.map(({ id, created_at: timestamp, owner }) => ({
            // empty strings as placeholders for map key
            action: 'new_class',
            class_id: id,
            nft_id: '',
            sender: owner,
            timestamp,
            tx_hash: '',
          }))
        )
        .catch(() => []);
    const eventPromises = [
      this.$api
        .$get(
          getNFTEvents({
            involver: address,
            limit: WALLET_EVENT_LIMIT,
            actionType: ['/cosmos.nft.v1beta1.MsgSend', 'buy_nft'],
            ignoreToList: LIKECOIN_NFT_API_WALLET,
            reverse: true,
          })
        )
        .then(res => res.events),
    ];
    if (Array.isArray(followees) && followees.length) {
      // NOTE: max URL length is 2000
      const batchSizes = 30;
      for (let i = 0; i < followees.length; i += batchSizes) {
        const followeeBatch = followees.slice(i, i + batchSizes);
        eventPromises.push(getFolloweesNewClassEvents(followeeBatch));
      }
    }
    const responses = await Promise.all(eventPromises);
    let events = responses.flat();
    events = [
      ...new Map(
        events.map(e => {
          const id = [e.tx_hash, e.class_id, e.nft_id, e.eventType].join('-');
          return [id, { ...e, id }];
        })
      ).values(),
    ];

    const addresses = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const list of events) {
      addresses.push(list.sender, list.receiver);
    }
    if (shouldFetchDetails) {
      [...new Set(addresses)]
        .filter(a => !!a)
        .map(a => dispatch('lazyGetUserInfoByAddress', a));
    }

    events.forEach(e => {
      if (e.price) {
        e.price = new BigNumber(e.price).shiftedBy(-9).toNumber();
      }
    });

    if (shouldFetchDetails) {
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
    } else {
      events = events.map(e => {
        if (
          e.action === '/cosmos.nft.v1beta1.MsgSend' &&
          e.sender === LIKECOIN_NFT_API_WALLET
        ) {
          return {
            ...e,
            shouldFetchHistory: true,
          };
        }
        return e;
      });
    }

    commit(
      WALLET_SET_EVENTS,
      events
        .map(e => {
          e.timestamp = new Date(e.timestamp);
          e.eventType = formatEventType(e, address);
          return e;
        })
        .sort((a, b) => b.timestamp - a.timestamp)
    );
    if (shouldFetchDetails) {
      const classIds = Array.from(new Set(events.map(e => e.class_id)));
      classIds.map(id => dispatch('lazyGetNFTClassMetadata', id));
    }
    commit(WALLET_SET_EVENT_FETCHING, false);
  },
  async fetchWalletEventHistory({ state, commit }, { id }) {
    const event = state.events.find(e => e.id === id);
    if (!event) return;
    const map = await getNFTHistoryDataMap({
      axios: this.$api,
      classId: event.class_id,
      txHash: event.tx_hash,
    });
    map.forEach(data => {
      const { granterMemo, price } = data;
      commit(WALLET_UPDATE_EVENT, {
        id,
        event: {
          granterMemo,
          price,
          shouldFetchHistory: false,
        },
      });
    });
  },
  updateEventLastSeenTs({ commit }, timestamp) {
    commit(WALLET_SET_EVENT_LAST_SEEN_TS, timestamp);
  },

  async walletFetchLIKEBalance({ commit, state }) {
    const { address } = state;
    try {
      let balanceFetch;
      if (state.likeBalanceFetchPromise) {
        balanceFetch = state.likeBalanceFetchPromise;
      } else {
        /* HACK: Use restful API instead of cosmjs to avoid loading libsodium,
          which is huge and affects index page performance */
        // balanceFetch = getAccountBalance(address);
        balanceFetch = this.$api
          .$get(getAccountBalance(address, LIKECOIN_CHAIN_MIN_DENOM))
          .then(data => amountToLIKE(data?.balance));
        commit(WALLET_SET_LIKE_BALANCE_FETCH_PROMISE, balanceFetch);
      }
      const balance = await balanceFetch;
      commit(WALLET_SET_LIKE_BALANCE, balance);
      return balance;
    } finally {
      commit(WALLET_SET_LIKE_BALANCE_FETCH_PROMISE, undefined);
    }
  },
  async walletFetchSessionUserInfo({ state, commit, dispatch }) {
    const userInfo = await this.$api.$get(getUserV2Self());
    commit(WALLET_SET_USER_INFO, userInfo || { user: state.address });
    // Let locale follows Liker Land app language setting through path prefix
    if (!checkIsLikeCoinAppInAppBrowser(this.$router.app.$route)) {
      await dispatch('setLocale', userInfo.locale);
    }
    return userInfo;
  },
  async walletFetchSessionUserData(
    { dispatch },
    { shouldSkipUserInfo = false } = {}
  ) {
    const promises = [];
    if (!shouldSkipUserInfo) {
      promises.push(dispatch('walletFetchSessionUserInfo'));
    }
    promises.push(dispatch('walletFetchFollowees'));
    await Promise.all(promises);
    await dispatch('fetchWalletEvents', { shouldFetchDetails: false });
  },
  async signLogin({ state, commit, dispatch }) {
    // Do not trigger login if the window is not focused
    if (document.hidden) return;
    if (!state.signer) {
      await dispatch('initIfNecessary');
    }
    const { address } = state;
    try {
      commit(WALLET_SET_IS_LOGGING_IN, true);
      const { signer } = state;
      const data = await signLoginMessage(signer, address);
      await this.$api.post(postUserV2Login(), data);
      await dispatch('walletFetchSessionUserData');
      await dispatch('updateWalletSubscriptionStatus');
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

  async signLikeCoinApiAuthorize({ state, commit, dispatch }) {
    if (!state.signer) {
      await dispatch('initIfNecessary');
    }
    const { address, signer } = state;
    const signature = await signWalletActionMessage(
      signer,
      address,
      'authorize',
      ['read:nft_reader', 'write:nft_reader']
    );
    const { data } = await this.$api.post(getWalletAuthorizeAPI(), signature);
    commit(WALLET_SET_LIKECOIN_API_ACCESS_TOKEN, data.token);
  },

  async walletLogout({ commit }) {
    commit(WALLET_SET_USER_INFO, null);
    commit(WALLET_SET_FOLLOWEES, []);
    commit(WALLET_SET_FOLLOWERS, []);
    commit(WALLET_SET_PAST_FOLLOWEES, []);
    commit(WALLET_SET_EVENTS, []);
    commit(WALLET_SET_EVENT_LAST_SEEN_TS, 0);
    commit(WALLET_SET_TOTAL_ROYALTY, 0);
    commit(WALLET_SET_ROYALTY_DETAILS, []);
    commit(WALLET_SET_TOTAL_SALES, 0);
    commit(WALLET_SET_SALES_DETAILS, []);
    commit(WALLET_SET_FOLLOWEE_EVENTS, []);
    commit(WALLET_SET_FEED_EVENT_MEMO, {});
    commit(WALLET_SET_LIKECOIN_API_ACCESS_TOKEN, '');
    commit(WALLET_SET_SUBSCRIPTION_STATUS, {});
    await this.$api.post(postUserV2Logout());
  },
  async walletUpdateEmail(
    { commit },
    { email, followee, classId, paymentId, claimingToken }
  ) {
    try {
      await this.$api.$post(
        postUserV2WalletEmail({
          email,
          followee,
          classId,
          paymentId,
          claimingToken,
        })
      );
      commit(WALLET_SET_USER_INFO, { emailUnconfirmed: email });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      throw error;
    }
  },
  async walletVerifyEmail({ commit }, { wallet, token, followee }) {
    try {
      const { email } = await this.$api.$put(
        putUserV2WalletEmail({ wallet, token, followee })
      );
      commit(WALLET_SET_USER_INFO, {
        email,
        emailUnconfirmed: '',
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      throw error;
    }
  },
  async walletFetchFollowees({ state, commit, dispatch }) {
    try {
      if (state.isFetchingFollowees) return;
      commit(WALLET_SET_FOLLOWEES_FETCHING_STATE, true);
      const { followees, pastFollowees } = await this.$axios.$get(
        getUserV2Followees()
      );
      commit(WALLET_SET_FOLLOWEES, followees);
      commit(WALLET_SET_PAST_FOLLOWEES, pastFollowees);

      if (followees.length || pastFollowees.length) {
        dispatch('lazyGetUserInfoByAddresses', [
          ...new Set([...followees, ...pastFollowees]),
        ]);
      }
    } finally {
      commit(WALLET_SET_FOLLOWEES_FETCHING_STATE, false);
    }
  },
  async walletFetchFollowers({ state, commit, dispatch }) {
    if (!state.loginAddress) {
      await dispatch('signLogin');
    }
    try {
      if (state.isFetchingFollowers) return;
      commit(WALLET_SET_FOLLOWERS_FETCHING_STATE, true);
      const { followers } = await this.$axios.$get(getUserV2Followers());
      commit(WALLET_SET_FOLLOWERS, followers);
      if (followers.length) {
        dispatch('lazyGetUserInfoByAddresses', followers);
      }
    } catch (error) {
      commit(WALLET_SET_FOLLOWERS, []);
    } finally {
      commit(WALLET_SET_FOLLOWERS_FETCHING_STATE, false);
    }
  },
  async walletFollowCreator({ state, commit }, creator) {
    const prevFollowees = state.followees;
    try {
      await this.$api.$post(postUserV2Followees(creator));
      commit(WALLET_SET_FOLLOWEES, prevFollowees.concat(creator).sort());
    } catch (error) {
      commit(WALLET_SET_FOLLOWEES, prevFollowees);
      throw error;
    }
  },
  async walletUnfollowCreator({ state, commit }, creator) {
    const prevFollowees = state.followees;
    const prevInteractedCreators = state.pastFollowees;
    try {
      await this.$api.$delete(deleteUserV2Followees(creator));
      commit(
        WALLET_SET_FOLLOWEES,
        [...state.followees].filter(followee => followee !== creator)
      );
      commit(WALLET_SET_PAST_FOLLOWEES, prevInteractedCreators.concat(creator));
    } catch (error) {
      commit(WALLET_SET_FOLLOWEES, prevFollowees);
      commit(WALLET_SET_PAST_FOLLOWEES, prevInteractedCreators);
      throw error;
    }
  },
  async walletFetchNotificationSettings({ commit }) {
    const { notification: notificationSettings } = await this.$api.$get(
      getUserNotificationSettingsUrl()
    );
    commit(WALLET_SET_NOTIFICATION_SETTINGS, notificationSettings);
  },
  async walletUpdateNotificationSettings({ commit }, notificationSettings) {
    await this.$api.$post(
      getUserNotificationSettingsUrl(),
      notificationSettings
    );
    commit(WALLET_SET_NOTIFICATION_SETTINGS, notificationSettings);
  },
  async walletFetchTotalRoyalty({ commit }, address) {
    const {
      total_amount: totalRoyalty,
      class_incomes: list,
    } = await this.$api.$get(getTotalRoyaltyByAddress(address));
    commit(WALLET_SET_TOTAL_ROYALTY, totalRoyalty);
    commit(WALLET_SET_ROYALTY_DETAILS, list);
  },
  async walletFetchTotalSales({ commit }, owner) {
    const {
      total_amount: totalSales,
      class_incomes: list,
    } = await this.$api.$get(getTotalSalesByAddress(owner));
    commit(WALLET_SET_TOTAL_SALES, totalSales);
    commit(WALLET_SET_SALES_DETAILS, list);
  },
  async walletFetchTotalResales({ commit }, address) {
    const {
      total_amount: totalResales,
      class_incomes: list,
    } = await this.$api.$get(getTotalResalesByAddress(address));
    commit(WALLET_SET_TOTAL_RESALES, totalResales);
    commit(WALLET_SET_RESALE_DETAILS, list);
  },
  async updateWalletSubscriptionStatus({ commit, state, dispatch }) {
    if (!state.likecoinApiAccessToken) {
      await dispatch('signLikeCoinApiAuthorize');
    }
    const { data } = await this.$api.get(nftGetUserActiveSubscription(), {
      headers: {
        Authorization: `Bearer ${state.likecoinApiAccessToken}`,
      },
    });
    const plans = data?.plans || {};
    commit(WALLET_SET_SUBSCRIPTION_STATUS, plans);
    Object.entries(plans).forEach(([creatorWallet, { productId }]) => {
      dispatch('fetchSubscriptionPlanData', {
        creatorWallet,
        planId: productId,
      });
    });
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
