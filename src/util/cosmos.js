// eslint-disable-next-line import/no-extraneous-dependencies
import bech32 from 'bech32';
import stringify from 'fast-json-stable-stringify';

import {
  LOGIN_MESSAGE,
  LIKECOIN_CHAIN_ID,
  LIKECOIN_CHAIN_MIN_DENOM,
} from '@/constant/index';

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

async function signLoginMessageMemo(signer, address, payload) {
  const signingPayload = {
    chain_id: LIKECOIN_CHAIN_ID,
    memo: payload,
    msgs: [],
    fee: {
      gas: '0',
      amount: [
        {
          denom: LIKECOIN_CHAIN_MIN_DENOM,
          amount: '0',
        },
      ],
    },
    sequence: '0',
    account_number: '0',
  };
  const { signed, signature } = await signer.signAmino(address, signingPayload);
  return {
    signed: stringify(signed),
    signature,
    signMethod: 'memo',
  };
}

async function signLoginMessageADR036(signer, address, message) {
  if (!signer.signArbitrary) {
    throw new Error('Signer does not support signArbitrary');
  }
  const chainId = LIKECOIN_CHAIN_ID;
  const signature = await signer.signArbitrary(chainId, address, message);
  const signDoc = {
    msgs: [
      {
        type: 'sign/MsgSignData',
        value: {
          signer: address,
          data: window.btoa(message),
        },
      },
    ],
    account_number: '0',
    sequence: '0',
    fee: {
      gas: '0',
      amount: [],
    },
    memo: '',
    chain_id: '',
  };
  return {
    signed: stringify(signDoc),
    signature,
    signMethod: 'ADR-036',
  };
}

export async function signLoginMessage(signer, address) {
  const payload = [
    `${LOGIN_MESSAGE}:`,
    JSON.stringify({
      ts: Date.now(),
      address,
    }),
  ].join(' ');
  const sign = signer.signArbitrary
    ? signLoginMessageADR036
    : signLoginMessageMemo;
  const {
    signed: message,
    signature: { signature, pub_key: publicKey },
    signMethod,
  } = await sign(signer, address, payload);
  const data = {
    signature,
    publicKey: publicKey.value,
    message,
    from: address,
    signMethod,
  };
  return data;
}

export async function signWalletActionMessage(
  signer,
  address,
  action,
  permissions
) {
  const ts = Date.now();
  const payload = JSON.stringify({
    action,
    permissions,
    likeWallet: address,
    ts,
  });
  const sign = signLoginMessageMemo;
  const {
    signed: message,
    signature: { signature, pub_key: publicKey },
    signMethod,
  } = await sign(signer, address, payload);
  const data = {
    signature,
    publicKey: publicKey.value,
    message,
    wallet: address,
    signMethod,
  };
  return data;
}
