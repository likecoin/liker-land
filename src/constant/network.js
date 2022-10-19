import {
  LIKECOIN_CHAIN_ID,
  LIKECOIN_CHAIN_NFT_RPC,
  LIKECOIN_CHAIN_API,
  LIKECOIN_CHAIN_DENOM,
  LIKECOIN_CHAIN_MIN_DENOM,
} from '.';

const { IS_TESTNET } = process.env;

export const LIKECOIN_WALLET_CONNECTOR_CONFIG = {
  chainId: LIKECOIN_CHAIN_ID,
  chainName: IS_TESTNET ? 'LikeCoin public test chain' : 'LikeCoin',
  rpcURL: LIKECOIN_CHAIN_NFT_RPC,
  restURL: LIKECOIN_CHAIN_API,
  coinType: 118,
  coinDenom: LIKECOIN_CHAIN_DENOM,
  coinMinimalDenom: LIKECOIN_CHAIN_MIN_DENOM,
  coinDecimals: 9,
  coinGeckoId: IS_TESTNET ? '' : 'likecoin',
  bech32PrefixAccAddr: 'like',
  bech32PrefixAccPub: 'likepub',
  bech32PrefixValAddr: 'likevaloper',
  bech32PrefixValPub: 'likevaloperpub',
  bech32PrefixConsAddr: 'likevalcons',
  bech32PrefixConsPub: 'likevalconspub',
  availableMethods: [
    'keplr',
    'cosmostation',
    'cosmostation-mobile',
    'liker-id',
  ],
  keplrInstallCTAPreset: 'fancy-banner',
  cosmostationDirectSignEnabled: true,
};

export default LIKECOIN_WALLET_CONNECTOR_CONFIG;
