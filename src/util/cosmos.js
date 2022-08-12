// eslint-disable-next-line import/no-extraneous-dependencies
import bech32 from 'bech32';

export function isValidAddress(address) {
  try {
    bech32.decode(address);
    return true;
  } catch (error) {
    return false;
  }
}

export function convertAddressPrefix(address, prefix = 'like') {
  const { words } = bech32.decode(address);
  return bech32.encode(prefix, words);
}
