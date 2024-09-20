// eslint-disable-next-line import/no-extraneous-dependencies
import bech32 from 'bech32';
import stringify from 'fast-json-stable-stringify';

import {
  LOGIN_MESSAGE,
  LIKECOIN_CHAIN_ID,
  LIKECOIN_CHAIN_MIN_DENOM,
} from '@/constant/index';

const ALLOWED_ADDRESS_PREFIXES = ['like'];

export function isValidAddress(address) {
  try {
    const { prefix } = bech32.decode(address);
    return ALLOWED_ADDRESS_PREFIXES.includes(prefix);
  } catch (error) {
    return false;
  }
}

export function convertAddressPrefix(address, prefix = 'like') {
  const { words } = bech32.decode(address);
  return bech32.encode(prefix, words);
}

export async function signLoginMessage(signer, address, action, permissions) {
  const chainId = LIKECOIN_CHAIN_ID;
  const payload = [
    `${LOGIN_MESSAGE}:`,
    JSON.stringify({
      ts: Date.now(),
      address,
      action,
      permissions,
      likeWallet: address,
    }),
  ].join(' ');

  if (signer?.signArbitrary) {
    const { signature, pub_key: publicKey } = await signer.signArbitrary(
      chainId,
      address,
      payload
    );
    const signDoc = {
      msgs: [
        {
          type: 'sign/MsgSignData',
          value: {
            signer: address,
            data: window.btoa(payload),
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
      signature,
      signMethod: 'ADR-036',
      publicKey: publicKey.value,
      message: stringify(signDoc),
      wallet: address,
      from: address,
      expiresIn: '7d',
    };
  }

  if (signer?.signAmino) {
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
    const { signed, signature } = await signer.signAmino(
      address,
      signingPayload
    );
    return {
      signature: signature.signature,
      publicKey: signature.pub_key.value,
      message: stringify(signed),
      wallet: address,
      from: address,
      signMethod: 'memo',
      expiresIn: '7d',
    };
  }
  throw new Error('SIGNER_NOT_SUPPORT_AMINO');
}
