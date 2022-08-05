import { LikeCoinWalletConnector } from '@likecoin/likecoin-wallet-connector';

import { LIKECOIN_WALLET_CONNECTOR_CONFIG } from '@/constant/network';
import * as types from '@/store/mutation-types';

export function connectWallet({ commit }, { onInit } = {}) {
  const connector = new LikeCoinWalletConnector({
    ...LIKECOIN_WALLET_CONNECTOR_CONFIG,
    onInit: ({ accounts, offlineSigner }) => {
      commit(types.WALLET_SET_ADDRESS, accounts[0].address);
      commit(types.WALLET_SET_SIGNER, offlineSigner);
      if (onInit) {
        onInit();
      }
    },
  });
  commit(types.WALLET_SET_CONNECTOR, connector);
  connector.openConnectWalletModal();
}

export function disconnectWallet({ commit }) {
  commit(types.WALLET_SET_ADDRESS, '');
  commit(types.WALLET_SET_SIGNER, null);
  commit(types.WALLET_SET_CONNECTOR, null);
}
