import { LIKECOIN_CHAIN_ID } from '../constant';

export async function initKeplr() {
  if (!window.keplr) {
    throw new Error('KEPLR_NOT_FOUND');
  } else {
    await window.keplr.enable(LIKECOIN_CHAIN_ID);

    const offlineSigner = window.keplr.getOfflineSigner(LIKECOIN_CHAIN_ID);
    const accounts = await offlineSigner.getAccounts();
    return accounts;
  }
}

export async function getKeplrAccounts() {
  if (!window.keplr) {
    throw new Error('KEPLR_NOT_FOUND');
  }
  const offlineSigner = window.keplr.getOfflineSigner(LIKECOIN_CHAIN_ID);
  const accounts = await offlineSigner.getAccounts();
  return accounts;
}
