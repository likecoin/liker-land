// eslint-disable-next-line import/no-extraneous-dependencies
import { BigNumber } from 'bignumber.js';
import { getNFTQueryClient } from '~/util/nft';
import { LIKECOIN_CHAIN_MIN_DENOM } from '../constant';

export async function getClient() {
  const c = await getNFTQueryClient();
  const client = await c.getQueryClient();
  return client;
}

export function amountToLIKE(likecoin) {
  if (!likecoin) return -1;
  if (likecoin.denom === LIKECOIN_CHAIN_MIN_DENOM) {
    return new BigNumber(likecoin.amount).dividedBy(1e9).toFixed();
  }
  // eslint-disable-next-line no-console
  console.error(`${likecoin.denom} is not supported denom`);
  return -1;
}

export async function fetchLIKEBalance(address) {
  const client = await getClient();
  const balance = amountToLIKE(
    await client.bank.balance(address, LIKECOIN_CHAIN_MIN_DENOM)
  );
  return balance;
}
