import { LIKECOIN_WALLET_CONNECTOR_CONFIG } from '@/constant/network';
import * as types from '@/store/mutation-types';
import { getAccountBalance } from '~/util/nft';
import { getUserInfoMinByAddress } from '~/util/api';
import { setLoggerUser } from '~/util/EventLogger';

let likecoinWalletLib = null;

export async function getLikeCoinWalletLib() {
  if (!likecoinWalletLib) {
    likecoinWalletLib = await import(/* webpackChunkName: "likecoin_wallet" */ '@likecoin/wallet-connector');
  }
  return likecoinWalletLib;
}

export async function initWallet(
  { commit, dispatch },
  { method, accounts, offlineSigner }
) {
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
}

export async function getConnector({ state, commit }) {
  if (state.connector) {
    return state.connector;
  }
  const lib = await getLikeCoinWalletLib();
  const connector = new lib.LikeCoinWalletConnector({
    ...LIKECOIN_WALLET_CONNECTOR_CONFIG,
  });
  commit(types.WALLET_SET_CONNECTOR, connector);
  return connector;
}

export async function openConnectWalletModal({ dispatch }) {
  const connector = await dispatch('getConnector');
  const connection = await connector.openConnectWalletModal();
  return connection;
}

export function disconnectWallet({ state, commit }) {
  if (state.connector) {
    state.connector.disconnect();
  }
  commit(types.WALLET_SET_ADDRESS, '');
  commit(types.WALLET_SET_SIGNER, null);
  commit(types.WALLET_SET_CONNECTOR, null);
  commit(types.WALLET_SET_LIKERINFO, null);
}

export async function restoreSession({ dispatch }) {
  const connector = await dispatch('getConnector');
  const session = connector.restoreSession();
  if (session) {
    const { accounts, method } = session;
    await dispatch('initWallet', { accounts, method });
  }
}

export async function initIfNecessary({ dispatch }) {
  const connector = await dispatch('getConnector');
  const connection = await connector.initIfNecessary();
  if (connection) {
    const { accounts, offlineSigner, method } = connection;
    await dispatch('initWallet', { accounts, offlineSigner, method });
  }
}

export async function walletFetchLIKEBalance({ commit, state }) {
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
}
