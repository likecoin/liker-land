// eslint-disable-next-line import/no-extraneous-dependencies
import { BigNumber } from 'bignumber.js';
import { ISCNQueryClient, ISCNSigningClient } from '@likecoin/iscn-js';
import { parseNFTClassDataFields } from '@likecoin/iscn-js/dist/messages/parsing';
import { PageRequest } from 'cosmjs-types/cosmos/base/query/v1beta1/pagination';

import {
  LIKECOIN_CHAIN_NFT_RPC,
  LIKECOIN_CHAIN_MIN_DENOM,
  LIKECOIN_NFT_API_WALLET,
} from '../constant';

let queryClient = null;
export async function getNFTQueryClient() {
  if (!queryClient) {
    const client = new ISCNQueryClient();
    await client.connect(LIKECOIN_CHAIN_NFT_RPC);
    queryClient = client;
  }
  return queryClient;
}

export async function createNFTSigningClient(signer) {
  const client = new ISCNSigningClient();
  await client.connectWithSigner(LIKECOIN_CHAIN_NFT_RPC, signer);
  return client;
}

export async function getClassInfo(classId) {
  const c = await getNFTQueryClient();
  const client = await c.getQueryClient();
  let { class: nftClass } = await client.nft.class(classId);
  if (nftClass) nftClass = parseNFTClassDataFields(nftClass);
  return nftClass;
}

export async function getNFTs({ classId = '', owner = '' }) {
  const c = await getNFTQueryClient();
  const client = await c.getQueryClient();
  let nfts = [];
  let next = new Uint8Array([0x00]);
  do {
    /* eslint-disable no-await-in-loop */
    const res = await client.nft.NFTs(
      classId,
      owner,
      PageRequest.fromPartial({ key: next })
    );
    ({ nextKey: next } = res.pagination);
    nfts = nfts.concat(res.nfts);
  } while (next && next.length);
  return { nfts };
}

export async function getNFTCountByClassId(classId, owner) {
  const c = await getNFTQueryClient();
  const client = await c.getQueryClient();
  const { amount = 0 } = await client.nft.balance(classId, owner);
  return { amount };
}

export async function sendGrant({ senderAddress, amountInLIKE, signer }) {
  const client = await createNFTSigningClient(signer);
  const spendLimit = [
    {
      denom: LIKECOIN_CHAIN_MIN_DENOM,
      amount: new BigNumber(amountInLIKE).shiftedBy(9).toFixed(0),
    },
  ];
  const expirationInMs = Date.now() + 1000 * 90;
  const { transactionHash } = await client.createSendGrant(
    senderAddress,
    LIKECOIN_NFT_API_WALLET,
    spendLimit,
    expirationInMs
  );
  return transactionHash;
}

export async function transferNFT({
  fromAddress,
  toAddress,
  classId,
  nftId,
  signer,
}) {
  const client = await createNFTSigningClient(signer);
  const { transactionHash } = await client.sendNFTs(
    fromAddress,
    toAddress,
    classId,
    [nftId]
  );
  return transactionHash;
}
