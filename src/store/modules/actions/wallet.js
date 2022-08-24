import { LikeCoinWalletConnector } from '@likecoin/wallet-connector';

import { LIKECOIN_WALLET_CONNECTOR_CONFIG } from '@/constant/network';
import { getAddressLikerIdMinApi } from '~/util/api';
import * as types from '@/store/mutation-types';

export async function initWallet(
  { commit },
  { method, accounts, offlineSigner }
) {
  if (!accounts[0]) return false;
  commit(types.WALLET_SET_METHOD_TYPE, method);
  commit(types.WALLET_SET_LIKERINFO, null);
  const { address, bech32Address } = accounts[0];
  const walletAddress = bech32Address || address;
  commit(types.WALLET_SET_ADDRESS, walletAddress);
  commit(types.WALLET_SET_SIGNER, offlineSigner);
  try {
    const userInfo = await this.$api.$get(
      getAddressLikerIdMinApi(walletAddress)
    );
    commit(types.WALLET_SET_LIKERINFO, userInfo);
  } catch (err) {
    const msg = (err.response && err.response.data) || err;
    // eslint-disable-next-line no-console
    console.error(msg);
  }
  return true;
}

export function initConnector({ state, commit }) {
  if (state.connector) {
    return state.connector;
  }
  const connector = new LikeCoinWalletConnector({
    ...LIKECOIN_WALLET_CONNECTOR_CONFIG,
  });
  commit(types.WALLET_SET_CONNECTOR, connector);
  return connector;
}

export async function connectWallet({ dispatch }) {
  const connector = await dispatch('initConnector');
  const wallet = await connector.openConnectWalletModal();
  if (!wallet) return false;
  return dispatch('initWallet', wallet);
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
  const connector = await dispatch('initConnector');
  const session = connector.restoreSession();
  if (session) {
    const { accounts, method } = session;
    await dispatch('initWallet', { accounts, method });
  }
}

export async function initIfNecessary({ dispatch }) {
  const connector = await dispatch('initConnector');
  const connection = await connector.initIfNecessary();
  if (connection) {
    const { accounts, offlineSigner, method } = connection;
    await dispatch('initWallet', { accounts, offlineSigner, method });
  }
}
