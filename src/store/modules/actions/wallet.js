import { LikeCoinWalletConnector } from '@likecoin/wallet-connector';

import { LIKECOIN_WALLET_CONNECTOR_CONFIG } from '@/constant/network';
import * as types from '@/store/mutation-types';
import { getAccountBalance } from '~/util/nft';
import { getUserInfoMinByAddress } from '~/util/api';
import { setLoggerUser } from '~/util/EventLogger';

export function setKeplrInstallCTAPreset({ commit }, preset) {
  commit(types.WALLET_SET_KEPLR_INSTALL_CTA_PRESET, preset);
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
  await setLoggerUser(this, walletAddress);
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

export function getConnector({ state, commit }) {
  if (state.connector) {
    return state.connector;
  }
  const connector = new LikeCoinWalletConnector({
    ...LIKECOIN_WALLET_CONNECTOR_CONFIG,
    keplrInstallCTAPreset: state.keplrInstallCTAPreset,
    cosmostationAppWC2Enabled: state.cosmostationAppWC2Enabled,
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
  const balance = await getAccountBalance(address);
  commit(types.WALLET_LIKE_BALANCE, balance);
}
