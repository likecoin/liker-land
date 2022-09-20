export const { IS_TESTNET } = process.env;

export const TEST_MODE =
  process.env.NODE_ENV !== 'production' || process.env.CI;

export const ONE_HOUR_IN_MS = 3600000;

export const LIKECOIN_API_BASE = IS_TESTNET
  ? 'https://api.rinkeby.like.co'
  : 'https://api.like.co';

export const LIKE_CO_URL_BASE = IS_TESTNET
  ? 'https://rinkeby.like.co'
  : 'https://like.co';

export const APP_LIKE_CO_URL_BASE = IS_TESTNET
  ? 'https://app.rinkeby.like.co'
  : 'https://app.like.co';

export const LIKECOIN_BUTTON_BASE = IS_TESTNET
  ? 'https://button.rinkeby.like.co'
  : 'https://button.like.co';

export const SUPERLIKE_BASE = IS_TESTNET
  ? 'https://s.rinkeby.like.co'
  : 'https://s.like.co';

export const LIKE_CO_THUMBNAIL_FN_BASE = 'https://static.like.co';

export const LIKECOIN_LOGOUT_POPUP_URL = IS_TESTNET
  ? 'https://rinkeby.like.co/in/logout?is_popup=1'
  : 'https://like.co/in/logout?is_popup=1';

export const AUTH_COOKIE_NAME = '__session';

export const CIVIC_LIKER_CLASSIC_LIKER_ID = 'civic-liker';

export const DEFAULT_AVATAR = 'https://static.like.co/likecoin_de-portrait.jpg';

export const LIKECOIN_CHAIN_MIN_DENOM = IS_TESTNET ? 'nanoekil' : 'nanolike';

export const LIKECOIN_CHAIN_DENOM = IS_TESTNET ? 'EKIL' : 'LIKE';

export const CIVIC_LIKER_V3_STAKING_ENDPOINT = IS_TESTNET
  ? 'https://likecoin-public-testnet-5.netlify.app/validators'
  : 'https://dao.like.co/validators';

export const LIKECOIN_CHAIN_API = IS_TESTNET
  ? 'https://node.testnet.like.co'
  : 'https://mainnet-node.like.co';

export const LIKECOIN_CHAIN_NFT_RPC = IS_TESTNET
  ? 'https://node.testnet.like.co/rpc/'
  : 'https://mainnet-node.like.co/rpc/';

export const APP_LIKE_CO_VIEW = IS_TESTNET
  ? 'https://app.rinkeby.like.co/view'
  : 'https://app.like.co/view';

export const ARWEAVE_ENDPOINT = 'https://arweave.net';
export const IPFS_VIEW_GATEWAY_URL = 'https://ipfs.io/ipfs';

export const LIKECOIN_CHAIN_ID = IS_TESTNET
  ? 'likecoin-public-testnet-5'
  : 'likecoin-mainnet-2';

export const LIKECOIN_NFT_API_WALLET = IS_TESTNET
  ? 'like1yney2cqn5qdrlc50yr5l53898ufdhxafqz9gxp'
  : 'like17m4vwrnhjmd20uu7tst7nv0kap6ee7js69jfrs';

export const LIKECOIN_NFT_CAMPAIGN_ITEMS = IS_TESTNET
  ? [
      'likenft10f06wfaql5fxf3g4sy8v57p98lzp7ad92cu34f9aeyhyeklchznsav5npg',
      'likenft1pwutfz4m6ez0qevzc3re9dsd4e7l4x39nsvud7kmrj5p70tg0nmqlz0wyk',
      'likenft1hajavhgv0zn7fe6j6f6ax82w9ry9jatv4q5jfudn0ws7hfylnv3qj8x70d',
    ]
  : [
      'likenft1z2274swtcheax9acjuzfhlncgqk8e6pfwc4pt00m8v2yk8zwpz8qf7dn7j',
      'likenft1plaq9s4pkrrsumm87whg0hv03gy982xpdct0apg5c4v8w94w6w2s4gvjhv',
      'likenft1l6875l0mdvz4u9060t5nacd4xcx5ge5wlef2tj2jff2wkna93d2sfezzp9',
      'likenft1faqzun5eucvh07j0fnrk7wehs966y32wujxrfuvlkzwdyfg03h6qnrscau',
      'likenft1s7xk7wt5q03lsa2a87fnqfc0uny28f46s4gtnakc08qdguxlua4qxrxk7m',
      'likenft1t5ftaxzyrnafewsav8qxvvsafs59a8xe2wnrl594yag04u9zwsjqrq0vgt',
      'likenft1f9dlnexdt6l4d8u2hh9ccm5g52q46sw2hllk4ntdhf7n6resg00s5hseuj',
      'likenft1yhsps5l8tmeuy9y7k0rjpx97cl67cjkjnzkycecw5xrvjjp6c5yqz0ttmc',
    ];

export const LIKECOIN_NFT_ABOUT_ITEMS = IS_TESTNET
  ? [
      'likenft10f06wfaql5fxf3g4sy8v57p98lzp7ad92cu34f9aeyhyeklchznsav5npg',
      'likenft1pwutfz4m6ez0qevzc3re9dsd4e7l4x39nsvud7kmrj5p70tg0nmqlz0wyk',
    ]
  : [
      'likenft1f9dlnexdt6l4d8u2hh9ccm5g52q46sw2hllk4ntdhf7n6resg00s5hseuj',
      'likenft1yhsps5l8tmeuy9y7k0rjpx97cl67cjkjnzkycecw5xrvjjp6c5yqz0ttmc',
    ];

export const TX_STATUS = {
  SIGN: 'sign',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  INSUFFICIENT: 'insufficient',
  FAILED: 'failed',
};

export const ROUGH_LIKE_TO_USD_PRICE = 0.01;
