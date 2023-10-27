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

export const LIKECOIN_NFT_BOOK_FEATURED_ITEMS = IS_TESTNET
  ? [
      // 勇者的黃昏
      {
        classId: [
          'likenft1atk7c2fc2kzrck2gr4x360u59eshwu6dwtyu8klnvxaqz6svexkqn7gzvz',
          'likenft1w7c375cw49xd36psau32hwxvm7w5sxtntk0530key6a9zqw97jlskeex8m',
          'likenft1rc0ja2eqecd7lp9fqmefsxt7t9fwxn554uhjcpkqs97x4mvazjcqams7ht',
        ],
        date: '2023-10-11T23:12:54',
      },
      {
        classId:
          'likenft1dgvyx97wv5f3kz3ag9uk0u2t4rwd6azth9yxre7ux2pwz6f75ytstfktxm',
        date: '2023-09-26T14:10:25',
      },
      {
        classId:
          'likenft17425skd9dfq8djm9j6c73vv2393ffaq9gpes6ewq77x2mgp4w2xqp7vkla',
        date: '2023-09-26T14:12:35',
      },
      {
        classId:
          'likenft15raex2xg55l0vutfww8faxnsjxxeqead87mtaj7tczzvmpgxmn3s95vnp2',
        date: '2023-09-26T14:13:24',
      },
      {
        classId:
          'likenft1cstgwjga3295rnp7rukqwschu7c9zka99x0lm2xwphx3aksqmp7s38d3v4',
        date: '2023-09-26T14:14:25',
      },
      {
        classId:
          'likenft1h5td83etzwrrqvjnedwh800nkfzcnc3773l3pzupegcvyug749dslxgn5m',
        date: '2023-09-26T14:15:38',
      },
    ]
  : [
      // 棄床記
      {
        classId:
          'likenft1afme4cy9vqzg5sk2lu0wku57vc94laf309msxepu9sr4qkfv2trqwdtm9q',
        date: '2023-10-06T04:06:57',
      },
      // 勇者的黃昏
      {
        classId: [
          'likenft1atk7c2fc2kzrck2gr4x360u59eshwu6dwtyu8klnvxaqz6svexkqn7gzvz',
          'likenft1m27a59y9x5x9fa9sa6ycd8q7vm3drl0qfvrjk2y9zkjqw22wq5vscwldjq',
          'likenft1856v9yywhhrkd89ke0jc80y4czjmkf74t6ea6mmeggp3fdneu96qs0cyuy',
        ],
        date: '2023-10-12T08:29:39',
      },
      // 上行之詩
      {
        classId:
          'likenft1t32cf8pnfqh7rsuz8gqa6y39mzc36yglehskp2t86g8ph07n0r2swezn2m',
        date: '2023-10-13T18:10:01',
      },
      // 庭刊試刊號
      {
        classId:
          'likenft1uqslq83ghnr0nc5e7rq7dkyw5cfxwhnqj2ny8z93l52ap4c2jrqqsh4jng',
        date: '2023-09-24T01:16:43',
      },
      // 天工開物・栩栩如真
      {
        classId:
          'likenft19symzw3xmh42gukzts858wf6rsdkn6e4jtc9wp8jh4kphfmffy5s6acyxg',
        date: '2023-04-22T11:20:35',
      },
      // 試酸號《當不再有愛 友愛就不復存》
      {
        classId:
          'likenft1r5me9g3kln40mfgufmcnkn5hhl8tuucjtkgtf7xfcf57nmd4985q2dau37',
        date: '2023-08-12T07:48:19',
      },
      // 從新浪潮到新本土：48部電影裡的香港城誌
      {
        classId:
          'likenft15ayw5nv7yxrlv6vvrxk0fvwdzsweqqyyw6we50dq2zaq2rk60pcs6ufhd7',
        date: '2023-07-14T13:12:52',
      },
      // 崩潰與重建：ChatGPT衝擊下的人類未來
      {
        classId:
          'likenft1rax0ns09sr80yz8q6x9t8tp7khaedut5j0pnjjzlcjwtl78686cqprmu2x',
        date: '2023-04-21T03:12:16',
      },
      // Craft Your World
      {
        classId:
          'likenft1uxjuhufvem4ccvwmquvt0uecfgcnn7wqpasyctn3glsq3q7kpxusnk7jaf',
        date: '2023-04-14T17:45:17',
      },
      // 所謂「我不投資」，就是 all in 在法定貨幣
      {
        classId:
          'likenft1ku4ra0e7dgknhd0wckrkxspuultynl4mgkxa3j08xeshfr2l0ujqmmvy83',
        date: '2022-12-05T05:00:56',
      },
    ];

export const LIKECOIN_NFT_BOOK_ITEMS = IS_TESTNET
  ? [
      {
        classId:
          'likenft10rur203yk5mc7ufx0r56ssj5q7656upwfp56sccxm7hut0nft2gq9k70wv',
        date: '2023-09-26T06:40:40',
      },
      {
        classId:
          'likenft1yuqkfvv9zsju94paak03sqn28rn5vrnfad3kuercenpuh3eax06qcug578',
        date: '2023-09-26T06:50:45',
      },
      {
        classId:
          'likenft1pvzffhcdk5yn6sh4hju7h0k56mrd30j8nd39pemw0u4qnxzg3ynsfkhg0d',
        date: '2023-09-26T14:07:34',
      },
      {
        classId:
          'likenft1kramesxthl5f09pf5elrejvml9zufmtn9cuf74r5zmwhlf866udq5d5x25',
        date: '2023-09-26T14:09:24',
      },
    ]
  : [
      // 天工開物（明朝版）
      {
        classId:
          'likenft1s0kl0jyj2pqru7js2p0qxjztpcl2nlaxpt25jqpt29q56n4hqkgs46ft72',
        date: '2023-10-06T08:14:01',
      },
      // Frankenstein
      {
        classId:
          'likenft1hk54hskjr0hn4lqjsexuj8gd7w9m6pvpzn0yyrqlhrvstj07d97qyesck4',
        date: '2023-10-06T10:48:40',
      },
      // 孽海花
      {
        classId:
          'likenft1catx9y82l7ml3zf3lszag0ps3xumqpncg9w7xm04hy0gkz2k32ystllusj',
        date: '2023-10-06T07:03:22',
      },
      // White Fang
      {
        classId:
          'likenft199wngygyv2nj7yv8264kxrzqstvptv35awn20c64djz9y4c00xmsvz08yy',
        date: '2023-10-06T05:25:18',
      },
      // 啼笑因緣
      {
        classId:
          'likenft12ukk5nakcfxzh58vtdx7e2keun050247n8pnsfqsypgdhkq94dpste7uqw',
        date: '2023-09-27T17:13:34',
      },
      // 沉淪
      {
        classId:
          'likenft1cjf56z3dju27dv77hqxdpm3e034gluq3etmagxygssexr86sem6sk3szyq',
        date: '2023-09-24T13:31:01',
      },
      // 呼蘭河傳
      {
        classId:
          'likenft1hfx5j4utxp9mpdzf5g5r7w9gve4lw9q2a402k00t45ruf8pca2eqndap32',
        date: '2023-09-24T13:32:48',
      },
      // Brave New World
      {
        classId:
          'likenft16744dyfn96vswqsy6286hzatnymzg0vwnr6aqrpwm9d7hpfnh7rqmktxua',
        date: '2023-09-24T13:34:05',
      },
      // 吶喊
      {
        classId:
          'likenft1v0y53j55l96ye4dzm00gqfhkazzy6mrytlav4cy35stthvflk9ls7fpqhs',
        date: '2023-09-24T13:37:51',
      },
      // Animal Farm
      {
        classId:
          'likenft14tuskytm0ewn4aadxrmlfgszexppk0f5xef2xu7zhjltdz3eud9s743mrj',
        date: '2023-09-24T13:37:03',
      },
      // Oliver Twist
      {
        classId:
          'likenft1yulzjeeuz4fdj754tugqw6342dyfd5wtkfyraly45ea79h9qnjxs8cqxfe',
        date: '2023-09-24T13:38:32',
      },
      // The Count of Monte Christo
      {
        classId:
          'likenft1f7nfpgsaen3uwkhp6a3trl6u59qaapd597lnwplh75m3fer8ls2q2rmv5g',
        date: '2023-09-24T13:39:27',
      },
      // The Call of the Wild
      {
        classId:
          'likenft1yxedh53ay49u8xu6aqg6aa0gr6jj9svy40q3wjv266v6pvrzyj4s6hszzj',
        date: '2023-09-25T19:41:12',
      },
      // 死水微瀾
      {
        classId:
          'likenft1tjyaqr0e3pfv9squz0grs95sdnfjgr6kd59e2aen3krmdge28cesnjt8de',
        date: '2023-09-28T11:20:45',
      },
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
export const NFT_BATCH_COLLECT_MESSSAGE = '(multiple purchases)';
