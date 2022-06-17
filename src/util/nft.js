// eslint-disable-next-line import/no-extraneous-dependencies
import { ISCNQueryClient, ISCNSigningClient } from '@likecoin/iscn-js';
import { PageRequest } from 'cosmjs-types/cosmos/base/query/v1beta1/pagination';
import { LIKECOIN_CHAIN_NFT_RPC } from '../constant';

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
  const res = await client.nft.class(classId);
  return res;
}

export async function getNFTsByClassId(classId, address) {
  const c = await getNFTQueryClient();
  const client = await c.getQueryClient();
  let nfts = [];
  let next = new Uint8Array([0x00]);
  do {
    /* eslint-disable no-await-in-loop */
    const res = await client.nft.NFTs(
      classId,
      address,
      PageRequest.fromPartial({ key: next })
    );
    ({ nextKey: next } = res.pagination);
    nfts = nfts.concat(res.nfts);
  } while (next && next.length);
  return { nfts };
}

export async function getNFTCountByClassId(classId, address) {
  const c = await getNFTQueryClient();
  const client = await c.getQueryClient();
  const { amount = 0 } = await client.nft.balance(classId, address);
  return { amount };
}
