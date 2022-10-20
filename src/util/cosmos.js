// eslint-disable-next-line import/no-extraneous-dependencies
import bech32 from 'bech32';

const ALLOWED_ADDRESS_PREFIXES = ['like', 'cosmos'];

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

export function deriveAllPrefixedAddresses(address) {
  if (!isValidAddress(address)) {
    throw new Error('Invalid address');
  }
  return ALLOWED_ADDRESS_PREFIXES.map(prefix =>
    convertAddressPrefix(address, prefix)
  );
}
