// eslint-disable-next-line import/no-extraneous-dependencies
import { BigNumber } from 'bignumber.js';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import * as api from '@/util/api';
import { deriveAllPrefixedAddresses } from './cosmos';
import {
  LIKECOIN_CHAIN_NFT_RPC,
  LIKECOIN_CHAIN_MIN_DENOM,
  LIKECOIN_NFT_API_WALLET,
} from '../constant';

let queryClient = null;
let iscnLib = null;

export const NFT_INDEXER_LIMIT_MAX = 100;

export const NFT_CLASS_LIST_SORTING = {
  PRICE: 'PRICE',
  ISCN_TIMESTAMP: 'ISCN_TIMESTAMP',
  LAST_COLLECTED_NFT: 'LAST_COLLECTED_NFT',
  NFT_OWNED_COUNT: 'NFT_OWNED_COUNT',
};

export const NFT_CLASS_LIST_SORTING_ORDER = {
  ASC: 'ASC',
  DESC: 'DESC',
};

export async function getISCNLib() {
  if (!iscnLib) {
    iscnLib = await import(/* webpackChunkName: "iscn_js" */ '@likecoin/iscn-js');
  }
  return iscnLib;
}

export async function getNFTQueryClient() {
  if (!queryClient) {
    const iscn = await getISCNLib();
    const client = new iscn.ISCNQueryClient();
    await client.connect(LIKECOIN_CHAIN_NFT_RPC);
    queryClient = client;
  }
  return queryClient;
}

export async function createNFTSigningClient(signer) {
  const iscn = await getISCNLib();
  const client = new iscn.ISCNSigningClient();
  await client.connectWithSigner(LIKECOIN_CHAIN_NFT_RPC, signer);
  return client;
}

export async function getClassInfo(classId) {
  const c = await getNFTQueryClient();
  const client = await c.getQueryClient();
  let { class: nftClass } = await client.nft.class(classId);
  const iscn = await getISCNLib();
  if (nftClass) nftClass = iscn.parseNFTClassDataFields(nftClass);
  return nftClass;
}

export async function getNFTCountByClassId(classId, owner) {
  const c = await getNFTQueryClient();
  const client = await c.getQueryClient();
  const { amount = 0 } = await client.nft.balance(classId, owner);
  return { amount };
}

export async function getISCNRecord(iscnId) {
  const client = await getNFTQueryClient();
  const res = await client.queryRecordsById(iscnId);
  return res;
}

export async function signGrant({ senderAddress, amountInLIKE, signer }) {
  const client = await createNFTSigningClient(signer);
  const spendLimit = [
    {
      denom: LIKECOIN_CHAIN_MIN_DENOM,
      amount: new BigNumber(amountInLIKE).shiftedBy(9).toFixed(0),
    },
  ];
  const expirationInMs = Date.now() + 1000 * 90;
  const signData = await client.createSendGrant(
    senderAddress,
    LIKECOIN_NFT_API_WALLET,
    spendLimit,
    expirationInMs,
    { broadcast: false }
  );
  return signData;
}

export async function broadcastTx(signData, signer) {
  const client = await createNFTSigningClient(signer);
  const senderClient = client.getSigningStargateClient();
  const txBytes = TxRaw.encode(signData).finish();
  const { transactionHash } = await senderClient.broadcastTx(txBytes);
  return transactionHash;
}

export async function signTransferNFT({
  fromAddress,
  toAddress,
  classId,
  nftId,
  memo = '',
  signer,
}) {
  const client = await createNFTSigningClient(signer);
  const signData = await client.sendNFTs(
    fromAddress,
    toAddress,
    classId,
    [nftId],
    { broadcast: false, memo }
  );
  return signData;
}

export const LIKE_ADDRESS_REGEX = /^like1[ac-hj-np-z02-9]{38}$/;

export function amountToLIKE(likecoin) {
  if (!likecoin) return -1;
  if (likecoin.denom === LIKECOIN_CHAIN_MIN_DENOM) {
    return new BigNumber(likecoin.amount).dividedBy(1e9).toFixed();
  }
  // eslint-disable-next-line no-console
  console.error(`${likecoin.denom} is not supported denom`);
  return -1;
}

export async function getAccountBalance(address) {
  const c = await getNFTQueryClient();
  const client = await c.getQueryClient();
  return amountToLIKE(
    await client.bank.balance(address, LIKECOIN_CHAIN_MIN_DENOM)
  );
}

export function isValidHttpUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    // no op
  }
  return false;
}

export const nftClassCollectionType = {
  WritingNFT: 'writing-nft',
  BookNFT: 'book-nft',
};

export function getNFTClassCollectionType(classMetadata) {
  switch (classMetadata?.nft_meta_collection_id) {
    case 'likerland_writing_nft':
      return nftClassCollectionType.WritingNFT;

    case 'nft_book':
    case 'ckxpress_book_nft':
      return nftClassCollectionType.BookNFT;

    default:
      return '';
  }
}

export function isWritingNFT(classMetadata) {
  return (
    getNFTClassCollectionType(classMetadata) ===
    nftClassCollectionType.WritingNFT
  );
}

export function formatNFTInfo(nftInfo) {
  const {
    class_id: classId,
    nft_id: nftId,
    timestamp: timestampStr,
    uri,
  } = nftInfo;
  const timestamp = Date.parse(timestampStr);
  return { classId, nftId, timestamp, uri };
}

function formatNFTEvent(event) {
  const {
    class_id: classId,
    nft_id: nftId,
    sender: fromWallet,
    receiver: toWallet,
    tx_hash: txHash,
    timestamp,
    memo,
  } = event;
  let eventName;
  switch (event.action) {
    case '/cosmos.nft.v1beta1.MsgSend':
      eventName =
        fromWallet === LIKECOIN_NFT_API_WALLET ? 'purchase' : 'transfer';
      break;
    case 'new_class':
    case 'mint_nft':
    default:
      eventName = event.action;
      break;
  }
  return {
    event: eventName,
    classId,
    nftId,
    fromWallet,
    toWallet,
    txHash,
    memo,
    timestamp: Date.parse(timestamp),
  };
}

const queryAllDataFromChain = async (axios, api, field, input = {}) => {
  let data;
  let nextKey;
  let count;
  const result = [];
  do {
    // eslint-disable-next-line no-await-in-loop
    ({ data } = await axios.get(
      api({
        ...input,
        key: nextKey,
        limit: NFT_INDEXER_LIMIT_MAX,
      })
    ));
    nextKey = data.pagination.next_key;
    ({ count } = data.pagination);
    result.push(...data[field]);
  } while (count === NFT_INDEXER_LIMIT_MAX);
  return result;
};

const fetchAllNFTFromChain = async (axios, owner) => {
  const nfts = await queryAllDataFromChain(axios, api.getNFTsPartial, 'nfts', {
    owner,
  });
  // sort by last colleted by default
  return nfts.map(formatNFTInfo);
};
export const getNFTsRespectDualPrefix = async (axios, owner) => {
  const allowAddresses = deriveAllPrefixedAddresses(owner);
  const arraysOfNFTs = await Promise.all(
    allowAddresses.map(a => fetchAllNFTFromChain(axios, a))
  );
  return arraysOfNFTs.flat();
};

const fetchAllNFTClassFromChain = async (axios, owner) => {
  const classes = await queryAllDataFromChain(
    axios,
    api.getNFTClassesPartial,
    'classes',
    { owner }
  );
  // TODO: getNFTClasses API already contains chain metadata
  // should reuse them instead of dropping
  return classes.map(c => ({ classId: c.id }));
};

export const getNFTClassesRespectDualPrefix = async (axios, owner) => {
  const allowAddresses = deriveAllPrefixedAddresses(owner);
  const arraysOfNFTClasses = await Promise.all(
    allowAddresses.map(a => fetchAllNFTClassFromChain(axios, a))
  );
  return arraysOfNFTClasses.flat();
};

export function formatNFTEventsToHistory(events) {
  const history = events.map(e => formatNFTEvent(e)).reverse();
  return history;
}

export function formatOwnerInfoFromChain(owners) {
  const ownerInfo = {};
  owners.forEach(o => {
    const { owner, nfts } = o;
    if (owner !== LIKECOIN_NFT_API_WALLET) {
      ownerInfo[owner] = nfts;
    }
  });
  return ownerInfo;
}
