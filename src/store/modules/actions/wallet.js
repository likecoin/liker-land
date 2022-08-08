import { LikeCoinWalletConnector } from '@likecoin/likecoin-wallet-connector';

import { LIKECOIN_WALLET_CONNECTOR_CONFIG } from '@/constant/network';
import { getAddressLikerIdMinApi } from '~/util/api';
import * as types from '@/store/mutation-types';

const KEY_WALLET_CONNECTOR = 'KEY_WALLET_CONNECTOR';

export function connectWallet({ commit }, { onInit } = {}) {
  const connector = new LikeCoinWalletConnector({
    ...LIKECOIN_WALLET_CONNECTOR_CONFIG,
    onInit: async ({ accounts, offlineSigner }) => {
      if (!accounts[0]) return;
      const { address } = accounts[0];
      commit(types.WALLET_SET_ADDRESS, address);
      commit(types.WALLET_SET_SIGNER, offlineSigner);
      try {
        const userInfo = await this.$api.$get(getAddressLikerIdMinApi(address));
        commit(types.WALLET_SET_LIKERINFO, userInfo);
      } catch (err) {
        const msg = (err.response && err.response.data) || err;
        // eslint-disable-next-line no-console
        console.error(msg);
      }
      if (onInit) {
        onInit();
      }
    },
  });
  commit(types.WALLET_SET_CONNECTOR, connector);
  connector.openConnectWalletModal();
  connector.initKeplr(3).then(() => {
    // eslint-disable-next-line no-unused-expressions
    window.localStorage?.setItem(KEY_WALLET_CONNECTOR, 'keplr');
  });
}

export function disconnectWallet({ commit }) {
  commit(types.WALLET_SET_ADDRESS, '');
  commit(types.WALLET_SET_SIGNER, null);
  commit(types.WALLET_SET_CONNECTOR, null);
  commit(types.WALLET_SET_LIKERINFO, null);
  // eslint-disable-next-line no-unused-expressions
  window.localStorage?.removeItem(KEY_WALLET_CONNECTOR);
}

export function initIfNecessary({ commit }) {
  const connectedWalletType = window.localStorage?.getItem(
    KEY_WALLET_CONNECTOR
  );
  if (connectedWalletType) {
    const connector = new LikeCoinWalletConnector({
      ...LIKECOIN_WALLET_CONNECTOR_CONFIG,
    });
    connector.initKeplr(3).then(async ({ accounts, offlineSigner }) => {
      if (!accounts[0]) return;
      const { address } = accounts[0];
      commit(types.WALLET_SET_ADDRESS, address);
      commit(types.WALLET_SET_SIGNER, offlineSigner);
      try {
        const userInfo = await this.$api.$get(getAddressLikerIdMinApi(address));
        commit(types.WALLET_SET_LIKERINFO, userInfo);
      } catch (err) {
        const msg = (err.response && err.response.data) || err;
        // eslint-disable-next-line no-console
        console.error(msg);
      }
    });
    return true;
  }
  return false;
}
