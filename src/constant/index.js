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

export const LIKECOIN_NFT_MARKETPLACE_BASE = IS_TESTNET
  ? 'https://likecoin-nft-marketplace-testnet.netlify.app'
  : 'https://likecoin.github.io/likecoin-nft-marketplace';

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
  : 'https://ping.pub/likecoin/tx';

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

export const LIKECOIN_NFT_CLASS_FREE_MINT = IS_TESTNET
  ? 'likenft1t2a7n9px9y5mhayjpk4s7m40zwjr3wvyg4ucg32w77jxmsw7889qg6ky8d'
  : 'likenft1hjm2gspl8gzwrcrfme6qmgge3n2sefs7kdwgd82egkrnvg74pc8s6u9g4t';

export const LIKECOIN_NFT_BOOK_INDEX_FEATURED_ITEMS = IS_TESTNET
  ? [
      'likenft17425skd9dfq8djm9j6c73vv2393ffaq9gpes6ewq77x2mgp4w2xqp7vkla',
      'likenft15raex2xg55l0vutfww8faxnsjxxeqead87mtaj7tczzvmpgxmn3s95vnp2',
      'likenft1cstgwjga3295rnp7rukqwschu7c9zka99x0lm2xwphx3aksqmp7s38d3v4',
    ]
  : [
      // 天工開物・栩栩如真
      'likenft19symzw3xmh42gukzts858wf6rsdkn6e4jtc9wp8jh4kphfmffy5s6acyxg',
      // 棄床記
      'likenft1afme4cy9vqzg5sk2lu0wku57vc94laf309msxepu9sr4qkfv2trqwdtm9q',
      // 從新浪潮到新本土：48部電影裡的香港城誌
      'likenft15ayw5nv7yxrlv6vvrxk0fvwdzsweqqyyw6we50dq2zaq2rk60pcs6ufhd7',
    ];

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
      'likenft1a0ucg0k69l0d69d7nx3y4mhme9fc5j9pvwy742s6nsuuc25u9edq352e78',
      'likenft1mpy6vvkpc6xtnqdke8g2whtz0kztxcgqcs7ymw9mt8xqwragh86qg3zyxc',
      'likenft1rud7q0jjrwhljyxquxj50tl2tzwarxlhc054yxzjskws9kvxq6eq7akfyy',
      'likenft126qja5m48w4gtz0e84w4fpsew3z0dfpqkncxc6we5x7qk2jgcuxsrz2mtk',
      'likenft1xevqc4p2qkm62mrpwukr68ggz0f73neu5dawzwhytuvnx340z68sm08qqs',
      'likenft1qq6t20rszq2rcxhrjsuz7cnu4vg7ch2mcpscheddtaj8hpnm654sms9gup',
      'likenft15j8ux87hqsmug0958rx64fkkzs6ugkkdhxpzu58yxpvqpx4tr8dqjh8s8p',
      'likenft1x7t6efwe4g5mnjzqjrrpy9yg8wqk9ktsytuyuy0u0dze09dc6gls7yuh22',
      'likenft1m990psscyulzgjyxk0k55yp07zt67lf68gdxxd3c2evdt4ujhr4qssv3ux',
      'likenft1jmtawpc0lqyy3zalec2p4wa9jyrjjvctdcla82zl0xlc5qfe300qkuuj3k',
      'likenft1xmcmnq3j5v342ua2uply7xmvppwgy9z6s9kdlgw4e4rx0mxh9a3qcwy25r',
      'likenft18azk489gkvhevdgwxuxjp4879zdjenmwlrrwnagr8vxk86zcjx4sex9myr',
      'likenft1ghwaeqyz8kwxyvkcafkfy900q8m7dj2tk8kz7u0p6f0cpum740gqka5ewr',
      'likenft1957qy6zk8yd3653qxxtkfusvflxlc846jpnagu46kk37phznncrss2pdd7',
      'likenft1z2274swtcheax9acjuzfhlncgqk8e6pfwc4pt00m8v2yk8zwpz8qf7dn7j',
      'likenft1plaq9s4pkrrsumm87whg0hv03gy982xpdct0apg5c4v8w94w6w2s4gvjhv',
      'likenft1l6875l0mdvz4u9060t5nacd4xcx5ge5wlef2tj2jff2wkna93d2sfezzp9',
      'likenft1faqzun5eucvh07j0fnrk7wehs966y32wujxrfuvlkzwdyfg03h6qnrscau',
      'likenft1w8p8uwkj909ts6v78n0cn9czfrnz5g43e3w06xtgc2q4z26u2yaslvrmvs',
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

export const TX_STATUS = {
  SIGN: 'sign',
  PROCESSING: 'processing',
  PROCESSING_NON_BLOCKING: 'processing_non_blocking',
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

export const NFT_BOOK = 'NFT_BOOK';

export const NFT_GEM_NAME_BOOK = 'NFT-Book';

export const ROUGH_LIKE_TO_USD_PRICE = 0.01;
export const USD_TO_HKD_RATIO = 7.8;

export const LOGIN_MESSAGE = 'Login';

export const NFT_DISPLAY_STATE = {
  FEATURED: 'featured',
  HIDDEN: 'hidden',
  DEFAULT: 'default',
};

export const NFT_CLASS_LATEST_DISPLAY_COUNT = 10;
export const NFT_CLASS_TRENDING_LIMIT_PER_OWNER = 2;

// NOTE: Limitation of LikeCoin API for batch collect
export const BATCH_COLLECT_MAX = 100;

export const EMAIL_REGEX_STRING =
  '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';

export const NFT_BOOK_PLATFORM_LIKER_LAND = 'liker_land';

export const NFT_LEGACY_DEFAULT_MESSSAGE = 'like.co NFT API';
export const NFT_AUTO_DELIVER_DEFAULT_MESSAGE =
  'Commission Liker Land to help issue this NFT ebook';
export const NFT_BATCH_COLLECT_MESSSAGE = '(multiple purchases)';

export const GUTENBERG_ISCN_VIDEO_LINK =
  'https://youtu.be/85DOlacoy5Q?feature=shared';

export const GUTENBERG_FREE_DOWNLOAD_LIST = [
  {
    title: "Dorothy Dale's Great Secret",
    author: 'Penrose, Margaret',
    classId:
      'likenft1y4c54rtr0gjs24fvyd6n93ydwycr06trg5kxamfvqf9qq2t729jqsf9vc0',
    imgSrc:
      'https://static.like.co/thumbnail/?url=https%3A%2F%2Fwww.gutenberg.org%2Fcache%2Fepub%2F41558%2Fpg41558.cover.medium.jpg&width=300',
  },
  {
    title: 'Camp and Trail: A Story of the Maine Woods',
    author: 'Hornibrook, Isabel, 1859-1952',
    classId:
      'likenft1vzzsj7956qpdzdmkaskml3c8mt8xam5eetv3hr8w0605s68dcetqhmr4qv',
    imgSrc:
      'https://www.gutenberg.org/cache/epub/13946/pg13946.cover.medium.jpg',
  },
  {
    title: 'césar ó nada english by pío baroja',
    author: 'Marks, Jeannette Augustus, 1875-1964',
    classId:
      'likenft12tzpq3ccvlgc3uu25hg5663vwg3k3ld2uv85p8knmdymj5kc3hzsa89ncv',
    imgSrc:
      'https://static.like.co/thumbnail/?url=https%3A%2F%2Fwww.gutenberg.org%2Fcache%2Fepub%2F53723%2Fpg53723.cover.medium.jpg&width=300',
  },
];

export const W3C_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const DEFAULT_RECOMMENDATIONS_LIST = IS_TESTNET
  ? {
      WNFT: [...LIKECOIN_NFT_CAMPAIGN_ITEMS],
      BOOK: [
        ...LIKECOIN_NFT_BOOK_INDEX_FEATURED_ITEMS,
        // 疫
        'likenft1rhzat6y53ge79mgp28avxyrk6n4990l76uz9t45le4dx2krkgdzstqa875',
        // The Count of Monte Christo
        'likenft1qufacdmg36dn0vqllrgk2tvk53xykkjfgepfavnpgnkpx730d2cqfx3gkw',
      ],
    }
  : {
      WNFT: [...LIKECOIN_NFT_CAMPAIGN_ITEMS],
      BOOK: [
        ...LIKECOIN_NFT_BOOK_INDEX_FEATURED_ITEMS,
        // 疫
        'likenft10w7w9gn8g5cy47wmwjzpl8nf4tnfe5rjxqyg5am5m6zpfufwuszqdjympl',
        // 轉世
        'likenft1ku0gmdq6pm8vgq68fvnr7dl0vxs4j2yv0c0qlvadj5k39fdfzgsqycdllx',
      ],
    };
