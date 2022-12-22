export const { IS_TESTNET } = process.env;

export const TEST_MODE =
  process.env.NODE_ENV !== 'production' || process.env.CI;

export const ONE_HOUR_IN_MS = 3600000;

export const EXTERNAL_HOST = IS_TESTNET
  ? 'https://rinkeby.liker.land'
  : 'https://liker.land';

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

export const LIKE_CO_THUMBNAIL_FN_BASE = 'https://static.like.co';

export const LIKECOIN_LOGOUT_POPUP_URL = IS_TESTNET
  ? 'https://rinkeby.like.co/in/logout?is_popup=1'
  : 'https://like.co/in/logout?is_popup=1';

export const AUTH_COOKIE_NAME = '__session';

export const CIVIC_LIKER_CLASSIC_LIKER_ID = 'civic-liker';

export const MAX_USER_ID_LENGTH = 20;

export const DEFAULT_AVATAR = 'https://static.like.co/likecoin_de-portrait.jpg';

export const LIKECOIN_CHAIN_MIN_DENOM = IS_TESTNET ? 'nanoekil' : 'nanolike';

export const LIKECOIN_CHAIN_DENOM = IS_TESTNET ? 'EKIL' : 'LIKE';

export const CIVIC_LIKER_V3_STAKING_ENDPOINT = IS_TESTNET
  ? 'https://likecoin-public-testnet-5.netlify.app/validators'
  : 'https://dao.like.co/validators';

export const LIKECOIN_CHAIN_VIEW_TX = IS_TESTNET
  ? 'https://node.testnet.like.co/cosmos/tx/v1beta1/txs'
  : 'https://mintscan.io/likecoin/txs';

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
      'likenft1qehd8pcp33ds3myxpmpanag2aqz4ygzmrukgtn8a69qyhswa5uqs952yjn',
      'likenft1xqnk77p73fg5yzvkdus089f2a5m0j0m2a7d9505zjp6p04y9sg9sp56c92',
      'likenft1ma7zjcmw0wdyzcjv4gqc04ww2470xtdy6wsuj9nx3jxm9k50zznq0v23tr',
      'likenft1p404aquvagp06aamry48kkzt6xhqkacupsdktdeallza2k4czp9q33v77r',
      'likenft10f06wfaql5fxf3g4sy8v57p98lzp7ad92cu34f9aeyhyeklchznsav5npg',
      'likenft1pwutfz4m6ez0qevzc3re9dsd4e7l4x39nsvud7kmrj5p70tg0nmqlz0wyk',
      'likenft1hajavhgv0zn7fe6j6f6ax82w9ry9jatv4q5jfudn0ws7hfylnv3qj8x70d',
    ]
  : [
      'likenft1jmtawpc0lqyy3zalec2p4wa9jyrjjvctdcla82zl0xlc5qfe300qkuuj3k',
      'likenft1xmcmnq3j5v342ua2uply7xmvppwgy9z6s9kdlgw4e4rx0mxh9a3qcwy25r',
      'likenft18azk489gkvhevdgwxuxjp4879zdjenmwlrrwnagr8vxk86zcjx4sex9myr',
      'likenft1ghwaeqyz8kwxyvkcafkfy900q8m7dj2tk8kz7u0p6f0cpum740gqka5ewr',
      'likenft1957qy6zk8yd3653qxxtkfusvflxlc846jpnagu46kk37phznncrss2pdd7',
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

// Note: Please remove this when hide NFT feature is released.
export const LIKECOIN_NFT_HIDDEN_ITEMS = new Set(
  IS_TESTNET
    ? []
    : [
        // 豆泥
        'likenft1lzyg3vs502fj9p2pq62wzap7y7l0sd33d5t3twqd8a9ckphl029qdgga54',
        'likenft10sjyapy7d3ypsj96nlmf95m8elhuhjq38028hua5qfz6f4zxeu4sjqgcpv',
      ]
);

// Leave it empty to allow all creators
export const LIKECOIN_NFT_COLLECT_WITHOUT_WALLET_ITEMS_BY_CREATORS = IS_TESTNET
  ? [
      // Wallet address
      'like1qv66yzpgg9f8w46zj7gkuk9wd2nrpqmca3huxf', // Aurora
    ]
  : [];

export const TX_STATUS = {
  SIGN: 'sign',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  INSUFFICIENT: 'insufficient',
  FAILED: 'failed',
};

export const NFT_GEM_NAME = [
  'Dust',
  'Stone',
  'Rock',
  'Boulder',
  'Moonstone',
  'Pearl',
  'Jade',
  'Emerald',
  'Sapphire',
  'Alexandrite',
  'Amethyst',
  'Kunzite',
  'Citrine',
  'Topaz',
  'Ruby',
  'Diamond',
];

export const ROUGH_LIKE_TO_USD_PRICE = 0.01;

export const LOGIN_MESSAGE = 'Login';

export const NFT_DISPLAY_STATE = {
  FEATURED: 'featured',
  HIDDEN: 'hidden',
  DEFAULT: 'default',
};

export const EMAIL_REGEX_STRING =
  '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';
