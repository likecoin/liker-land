export const { IS_TESTNET } = process.env;

export const { AD_CONVERSION_ID } = process.env;

export const { FACEBOOK_PIXEL_ID } = process.env;

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

export const BOOK_PRESS_BASE = IS_TESTNET
  ? 'https://likecoin-nft-book-press-testnet.netlify.app'
  : 'https://publish.liker.land';

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

export const ARWEAVE_ENDPOINT = 'https://gateway.irys.xyz';
export const IPFS_VIEW_GATEWAY_URL = 'https://w3s.link/ipfs';

export const LIKECOIN_CHAIN_ID = IS_TESTNET
  ? 'likecoin-public-testnet-5'
  : 'likecoin-mainnet-2';

export const LIKECOIN_NFT_API_WALLET = IS_TESTNET
  ? 'like1yney2cqn5qdrlc50yr5l53898ufdhxafqz9gxp'
  : 'like17m4vwrnhjmd20uu7tst7nv0kap6ee7js69jfrs';

export const LIKECOIN_NFT_CLASS_FREE_MINT = IS_TESTNET
  ? 'likenft1t2a7n9px9y5mhayjpk4s7m40zwjr3wvyg4ucg32w77jxmsw7889qg6ky8d'
  : 'likenft14jz77ywl6hmfxlus6qrat36c2y7l5xkxhlzp76tdvk06mw69pjzsy5zu9l';

export const LIKECOIN_NFT_BOOK_INDEX_FEATURED_ITEMS = IS_TESTNET
  ? [
      'likenft17425skd9dfq8djm9j6c73vv2393ffaq9gpes6ewq77x2mgp4w2xqp7vkla',
      'likenft15raex2xg55l0vutfww8faxnsjxxeqead87mtaj7tczzvmpgxmn3s95vnp2',
      'likenft1cstgwjga3295rnp7rukqwschu7c9zka99x0lm2xwphx3aksqmp7s38d3v4',
    ]
  : [
      // 天工開物・栩栩如真
      'likenft19symzw3xmh42gukzts858wf6rsdkn6e4jtc9wp8jh4kphfmffy5s6acyxg',
      // 人在
      'likenft16cns9jk7cathhpe62v6jpyxam6z8ltdk3jw08xpmkrz53s3cknxqulpd0u',
      // 哲學未來書
      'likenft1qqqezqjuxfkrsykex6r2cdtakpkndg2wnnlsx894gmwq4p84868se52g6z',
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

export const NFT_BOOK = 'NFT_BOOK';

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

export const BOOKSTORE_LIST_EXCLUDED_WALLET = IS_TESTNET
  ? 'like1e25m8qmnuw905dzuv4k6prpu03z4ve6kelfx5n'
  : 'like1zur83433p88clexqwl3yejcyntljtfvsn0kczf';

export const READER_ALLOW_SCRIPTED_CONTENT_OWNER_WALLET_LIST = [
  'like1cfz3cpmnq4tvxqec77mxr3ygqtet3vqtqmejwm',
];

export const CROSS_SELL_PRODUCT_PROBABILITY = 0.3;

export const RECOMMENDATION_GROUPS = IS_TESTNET
  ? [
      [
        'likenft10e4gsezx2xfujwkl89e0vv07j8x3ha4hreulc77p4wm4manag4rqk6zeq8',
        'col_book_37fd9fd7-3323-4b4e-9d94-83566f8fba96',
        'likenft1npx3sthlcff3qqmk9tvv454my7h79z7eehqe6cfqp9ccsrem9kvqv6ymzz',
        'likenft1h2ze9wd80gqkwnt54ueqkruhe2kshed7pjhuwrqjytg5jcy6639sqqmdcv',
      ],
      [
        'likenft1akaqh0pd9wv8lfy3xyd9tnc4mk8vmy7ehzg7ssgczqxcq3hzc2vqugtvty',
        'likenft1npx3sthlcff3qqmk9tvv454my7h79z7eehqe6cfqp9ccsrem9kvqv6ymzz',
        'likenft1h2ze9wd80gqkwnt54ueqkruhe2kshed7pjhuwrqjytg5jcy6639sqqmdcv',
      ],
      [
        'likenft1npx3sthlcff3qqmk9tvv454my7h79z7eehqe6cfqp9ccsrem9kvqv6ymzz',
        'likenft1h2ze9wd80gqkwnt54ueqkruhe2kshed7pjhuwrqjytg5jcy6639sqqmdcv',
        'likenft1qq06n42guzvt087wxunaajvz3alx6wadq6mfz0yz57gffwsrgrasl2m59x',
      ],
      [
        'likenft1vwm4ze65h5vv84uahwd3x52xp8t9q5xqex3d58mvgeurrm0dk0yqcwd6d8',
        'likenft1emvvd04ynymxn7d62mmmqxr7xrye92wqxxgh394r2jnznnl0uneqapg60l',
      ],
    ]
  : [
      // FengHouShanLin
      [
        'likenft1e88egsmedlsjvtp50ngvftf3psn4u4njrlfhkcsmukpuemkwq4tqrqzejk',
        'likenft14lz72a38tk0elxkv5jyp6uepx7jru2zhu0vcpv0sau2k069lnq6sp3hnur',
        'likenft1tz70u4xz3wkcfm2zz55gttj4xsm67waa55rkewv0p69wdcd8t3ysq9gqst',
        'likenft1s9he8030mnuwz53988dk2gf0u4eehmthgg6tsr64gx6kamv2z5wsv80qq4',
        'likenft1lnp07hyzvgekvcchf0vz9xsa30qp00e3fp70z5x7vzz7dvas83as8d9h0n',
        'likenft1ewmnn8fwkd7qk7c7h3me4xgkatjae4yx32nmwp7qkznc9plz8vfqpjvsjv',
      ],
      // Cross Sell
      [
        'likenft1wrskn9a683stkje3wdmcwuvpuqrp5eevjsnn9y4f55wlystzxausuhj3em',
        'col_book_4d7b04b5-da74-48d3-9da7-9ae1e9719bf9',
        'likenft1mgehyarx3lft82g9zwvv9c4g9rgzxfsjda90vzmq5h56vg5u26qsec7rpc',
        'likenft1eawzxut5zf9t9myyd6prquef7c2r7pe0z3rzlreup59wtxe9hplqcd4987',
        'likenft1r8mce5h96nvedtm7rh9va5mda6fgysqfprlxftuef09s8kfjt2jsqeyyjq',
      ],
      [
        'likenft14jz77ywl6hmfxlus6qrat36c2y7l5xkxhlzp76tdvk06mw69pjzsy5zu9l',
        'likenft16jguhkfa6nnu224fwjke2zv5f99n8wl9m097h46zqxnyu33j7rgs7f0xg3',
        'likenft1rfd3pp4q4hvuha8xpl8wzzf7uwannv0wm05s7jz34828e4qjnyzsfd9srz',
        'likenft19symzw3xmh42gukzts858wf6rsdkn6e4jtc9wp8jh4kphfmffy5s6acyxg',
        'likenft139537w38zlyhk9yvha4n3fz386kaakq6t3p62t23z3xs8f3v257q4k6mw4',
      ],
      [
        'likenft1ekvx3en9l0640kv9fd5n5hvltwyfl443ymyu2cnhmalvjfy0cdcqqa3l6h',
        'likenft16cns9jk7cathhpe62v6jpyxam6z8ltdk3jw08xpmkrz53s3cknxqulpd0u',
      ],
      [
        'likenft17zq3r5t2qwfatle04sz680vl3ka0l8wfeu4n5jv26mnvawnfqs4qd773ny',
        'likenft154xhw0qyds5pgvsyc7379lnkyvwqkvv2zvmmh2gn5qrewljeqwys2sju6x',
      ],
      [
        'likenft1l2v3qdv4qj0pyv2tmme42dv0962csaxxhezk04jr9s2rved08s4s4x6633',
        'likenft1434x9tl07ysrjq9lvxv0thgn0zt2fxwhntefd249lawrznw08lrskr3jfp',
      ],
      [
        'likenft1434x9tl07ysrjq9lvxv0thgn0zt2fxwhntefd249lawrznw08lrskr3jfp',
        'likenft1l2v3qdv4qj0pyv2tmme42dv0962csaxxhezk04jr9s2rved08s4s4x6633',
      ],
      [
        'likenft1xl38uu5q7fsxcr02msjtx7jstsfz8lu6ex8nq0pksfgxx3yszkws6ngwr9',
        'likenft19fnr8azkstpn2u8k6qc4hvk6qfhf3dly5d9gqsxrdt0c525w4gask7zmje',
        'likenft1uq0jhw2wng9u0d7fgqdhy6zwwp48ympwfcafcekasyd7aq3j6xpqsch6px',
        'likenft1t32cf8pnfqh7rsuz8gqa6y39mzc36yglehskp2t86g8ph07n0r2swezn2m',
        'likenft1ekvx3en9l0640kv9fd5n5hvltwyfl443ymyu2cnhmalvjfy0cdcqqa3l6h',
        'likenft1e4espt79md5gg2lc0wqfu5zf75jsvce3qjfsxmfctdgyaede7vaq6qh94n',
      ],
      [
        'likenft1dpegnjnklnh5g66nn06gz64wv0ec6k04f4v5lx69qlv6xlh493eqdq454j',
        'likenft15entdx6z5l2r7wqc93fz32g53ve6lfk4tgqqzl8ereg7tvs3t9nq82n5m3',
        'likenft19ul7dkwj2p8fs3m6t4gy77p7mlgnyy3ehcmran2f4us8ctn6yw5sk7fx2z',
      ],
      [
        'likenft1d7m9zdw3zmd6jfvu0l6zgr3f4pz3me49ahzgl20wujwus6jtc2zq7ekm6u',
        'likenft17zq3r5t2qwfatle04sz680vl3ka0l8wfeu4n5jv26mnvawnfqs4qd773ny',
        'likenft154xhw0qyds5pgvsyc7379lnkyvwqkvv2zvmmh2gn5qrewljeqwys2sju6x',
      ],
      [
        'likenft1cyqljw4xk8d2ll7096mxdn33m2f2svxs4vtemkmzznavvyvdflnqeqvpl3',
        'likenft139537w38zlyhk9yvha4n3fz386kaakq6t3p62t23z3xs8f3v257q4k6mw4',
        'likenft1ck8pv864x85ers8vdmuy6ekpd5kw0vhhnuvf8xzus3yarecxm8rs4xdsx6',
      ],
    ];

export const CROSS_SELL_WHITE_LIST = IS_TESTNET
  ? [
      'likenft10e4gsezx2xfujwkl89e0vv07j8x3ha4hreulc77p4wm4manag4rqk6zeq8',
      'likenft1akaqh0pd9wv8lfy3xyd9tnc4mk8vmy7ehzg7ssgczqxcq3hzc2vqugtvty',
      'likenft1npx3sthlcff3qqmk9tvv454my7h79z7eehqe6cfqp9ccsrem9kvqv6ymzz',
      {
        id:
          'likenft1emvvd04ynymxn7d62mmmqxr7xrye92wqxxgh394r2jnznnl0uneqapg60l',
        probability: 1,
      },
      {
        id:
          'likenft1vwm4ze65h5vv84uahwd3x52xp8t9q5xqex3d58mvgeurrm0dk0yqcwd6d8',
        probability: 1,
      },
    ]
  : [
      'likenft1wrskn9a683stkje3wdmcwuvpuqrp5eevjsnn9y4f55wlystzxausuhj3em',
      'likenft14jz77ywl6hmfxlus6qrat36c2y7l5xkxhlzp76tdvk06mw69pjzsy5zu9l',
      'likenft154xhw0qyds5pgvsyc7379lnkyvwqkvv2zvmmh2gn5qrewljeqwys2sju6x',
      'likenft1ekvx3en9l0640kv9fd5n5hvltwyfl443ymyu2cnhmalvjfy0cdcqqa3l6h',
      {
        id:
          'likenft1dpegnjnklnh5g66nn06gz64wv0ec6k04f4v5lx69qlv6xlh493eqdq454j',
        probability: 1,
      },
      {
        id:
          'likenft17zq3r5t2qwfatle04sz680vl3ka0l8wfeu4n5jv26mnvawnfqs4qd773ny',
        probability: 1,
      },
      {
        id:
          'likenft154xhw0qyds5pgvsyc7379lnkyvwqkvv2zvmmh2gn5qrewljeqwys2sju6x',
        probability: 1,
      },
      {
        id:
          'likenft1d7m9zdw3zmd6jfvu0l6zgr3f4pz3me49ahzgl20wujwus6jtc2zq7ekm6u',
        probability: 1,
      },
      {
        id:
          'likenft1cyqljw4xk8d2ll7096mxdn33m2f2svxs4vtemkmzznavvyvdflnqeqvpl3',
        probability: 1,
      },
    ];

export const AFFILIATION_CHANNEL_LEGACY_STRINGS = {
  'Muddy Water': '@muddydirtywater',
  bchai: '@edmondyu',
  boundarybooks: '@boundarybooks',
  ckxpress: '@ckxpress',
  dungfookei: '@nghengsun',
  hkcourtnews: '@hkcourtnews2023',
  hkhouseofliterature: '@hkhouseofliterature',
  hkreaders: '@hkreaders',
  hunter: '@hunterbookstore',
  incommonbreath: '@incommonbreath',
  liberresearch: '@liber-research',
  nowhere: '@nowherebooks',
  punch: '@bookpunch',
  samkee: '@samkeebook',
  stay: '@hansbookstore',
  thewitness: '@thewitness',
  victoriabooklit: '@victoriacitylit',
};

export const NFT_BOOK_WITH_SIGN_IMAGE_SET = new Map(
  IS_TESTNET
    ? [
        [
          'likenft1nekez4y50uk0dmgxuxql7v2vnhy3wqa24ld46hk4frlwcvwpr88selunrr',
          ['陳健民'],
        ],
        [
          'likenft1gp28fe9uzqdadrps67hz20035m0hh9zu9m8kzvz6gdawvms5xtts5m6qds',
          ['賴佩霞'],
        ],
      ]
    : [
        [
          'likenft1ekvx3en9l0640kv9fd5n5hvltwyfl443ymyu2cnhmalvjfy0cdcqqa3l6h',
          ['陳健民'],
        ],
      ]
);

export const NFT_BOOK_WITH_EVENT_BANNER_SET = [];

export const NFT_BOOK_WITH_TOP_BANNER_MESSAGE_MAP = IS_TESTNET
  ? {}
  : {
      likenft1qqqezqjuxfkrsykex6r2cdtakpkndg2wnnlsx894gmwq4p84868se52g6z:
        '出版社已於 2025 年 2 月 13 日關閉了下載功能。在此日期前購買了此書的讀者，如欲獲得書檔，請聯絡客服。',
    };

export const NFT_BOOK_PRODUCT_PAGE_OVERRIDE = IS_TESTNET
  ? {}
  : {
      likenft1d7m9zdw3zmd6jfvu0l6zgr3f4pz3me49ahzgl20wujwus6jtc2zq7ekm6u: {
        authorQuery: '邵家臻',
        isOwnerHidden: true,
        crossSellDialogTitle: '延伸閱讀：家臻的簽名電子書',
        recommendedClassIds: IS_TESTNET
          ? [
              'likenft1emvvd04ynymxn7d62mmmqxr7xrye92wqxxgh394r2jnznnl0uneqapg60l',
            ]
          : [
              'likenft154xhw0qyds5pgvsyc7379lnkyvwqkvv2zvmmh2gn5qrewljeqwys2sju6x',
              'likenft17zq3r5t2qwfatle04sz680vl3ka0l8wfeu4n5jv26mnvawnfqs4qd773ny',
              'likenft1ekvx3en9l0640kv9fd5n5hvltwyfl443ymyu2cnhmalvjfy0cdcqqa3l6h',
              'likenft1mppyvyuvvft62yc66saee28q8nyl6xuh8vg332d8y9fn6gz9qtssj4trzl',
              'likenft19hvxv9vyxwlulqnk54qu3y6nq4nwva0jdgvz8hgvtnfaw7wsnpdqpgxz7v',
              'likenft1j3k6celx0t7dfu0s8e9zlgsrdh4pxtts5qsrrk2fk2c37rqt4wkq0rmush',
              'likenft1aa48m08ep06m2celycx9qdsyl0vaqje2jlzdnufe64czevg2ed3syk9g6v',
              'likenft16cns9jk7cathhpe62v6jpyxam6z8ltdk3jw08xpmkrz53s3cknxqulpd0u',
              'likenft1wrskn9a683stkje3wdmcwuvpuqrp5eevjsnn9y4f55wlystzxausuhj3em',
              'likenft1d3lkwpmqdmdcw4mm7zevprudwrlrny2mxd8xuv7m5z2073leq75qj70hr5',
              'likenft1tlnn2x6864q6l5ag4fd87lc8eel7xafxnahd0836sap9eqshtuesesavum',
            ],
      },
      likenft17sgwqc2t5rwfz70wp0xrh3av7knse7v6qh8ystf324rz3ny4w5hq2u6avh: {
        recommendedClassIds: [
          'likenft1k4tulfcxn2vre3y4crd5hmf7gpf2fwcqrdrx85tcscwvyr6cv9pqt9469l',
          'likenft1dpegnjnklnh5g66nn06gz64wv0ec6k04f4v5lx69qlv6xlh493eqdq454j',
          'likenft1aa48m08ep06m2celycx9qdsyl0vaqje2jlzdnufe64czevg2ed3syk9g6v',
          'likenft1ekvx3en9l0640kv9fd5n5hvltwyfl443ymyu2cnhmalvjfy0cdcqqa3l6h',
          'likenft154xhw0qyds5pgvsyc7379lnkyvwqkvv2zvmmh2gn5qrewljeqwys2sju6x',
          'likenft10w7w9gn8g5cy47wmwjzpl8nf4tnfe5rjxqyg5am5m6zpfufwuszqdjympl',
          'likenft1ku0gmdq6pm8vgq68fvnr7dl0vxs4j2yv0c0qlvadj5k39fdfzgsqycdllx',
        ],
      },
      'col_book_931bb5a0-39e1-472e-963c-d542c9902ab4': {
        recommendedClassIds: [
          'likenft1e4espt79md5gg2lc0wqfu5zf75jsvce3qjfsxmfctdgyaede7vaq6qh94n',
          'likenft1za4e93x4tsn7fw3n8kqnh9kssqgwxd9xk35ysxm623d4zkcm7h4sx5wlsl',
          'likenft16cns9jk7cathhpe62v6jpyxam6z8ltdk3jw08xpmkrz53s3cknxqulpd0u',
          'likenft1fxu3hc4f0sn0kglq2xpdc50aezt4cyl986hlrysfn0r3u0ac3egsj6vcq2',
          'likenft1kmn4qyxus2ghxn3lde6xa2u0qt62vec7g7d5lt5a26l6f8vd9mashnhh6q',
          'likenft1v6tnjf8ml6gly8ugtd79l0dvqu8lnkpxj785srnphxgye95c5g5splaw6c',
          'likenft1p4kl836zwc5h6284hpw5m4w0wwcqdjfxfse2dcf8325fmge8a29sh4hec3',
        ],
      },
      likenft1k4tulfcxn2vre3y4crd5hmf7gpf2fwcqrdrx85tcscwvyr6cv9pqt9469l: {
        recommendedClassIds: [
          'likenft1hesnt4kv7hqjkg8m3tu7vxfxcfkxmwtz49z2s8dtz7389utg70vqp7ac9q',
          'likenft184l7uz0cud540kc7lnghdvan7649marxste4hmruq44f8c8zuw9shuknyk',
          'likenft1fjetqyl3knuaxjsxdf3kjlfejla4evla5gk6h0w6slehf3l2r4uqh43gey',
          'likenft1ck8pv864x85ers8vdmuy6ekpd5kw0vhhnuvf8xzus3yarecxm8rs4xdsx6',
          'likenft150ndt6fffg2c0an7rdds2tfcpq4lqd6m7tr450lml8es57w752as26t75v',
          'likenft16jguhkfa6nnu224fwjke2zv5f99n8wl9m097h46zqxnyu33j7rgs7f0xg3',
          'likenft1rfd3pp4q4hvuha8xpl8wzzf7uwannv0wm05s7jz34828e4qjnyzsfd9srz',
          'likenft1l2v3qdv4qj0pyv2tmme42dv0962csaxxhezk04jr9s2rved08s4s4x6633',
          'likenft139537w38zlyhk9yvha4n3fz386kaakq6t3p62t23z3xs8f3v257q4k6mw4',
          'likenft1ak9e8e08haqst8sc3lqawk30hxeqgfyxrsjy4gygajqmq2hh9xzquge3cg',
        ],
      },
      likenft1hesnt4kv7hqjkg8m3tu7vxfxcfkxmwtz49z2s8dtz7389utg70vqp7ac9q: {
        recommendedClassIds: [
          'likenft1k4tulfcxn2vre3y4crd5hmf7gpf2fwcqrdrx85tcscwvyr6cv9pqt9469l',
          'likenft1fjetqyl3knuaxjsxdf3kjlfejla4evla5gk6h0w6slehf3l2r4uqh43gey',
          'likenft1l2v3qdv4qj0pyv2tmme42dv0962csaxxhezk04jr9s2rved08s4s4x6633',
          'likenft184l7uz0cud540kc7lnghdvan7649marxste4hmruq44f8c8zuw9shuknyk',
          'likenft16jguhkfa6nnu224fwjke2zv5f99n8wl9m097h46zqxnyu33j7rgs7f0xg3',
          'likenft1ck8pv864x85ers8vdmuy6ekpd5kw0vhhnuvf8xzus3yarecxm8rs4xdsx6',
          'likenft150ndt6fffg2c0an7rdds2tfcpq4lqd6m7tr450lml8es57w752as26t75v',
          'likenft1rfd3pp4q4hvuha8xpl8wzzf7uwannv0wm05s7jz34828e4qjnyzsfd9srz',
          'likenft139537w38zlyhk9yvha4n3fz386kaakq6t3p62t23z3xs8f3v257q4k6mw4',
          'likenft1ak9e8e08haqst8sc3lqawk30hxeqgfyxrsjy4gygajqmq2hh9xzquge3cg',
        ],
      },
      likenft1v6tnjf8ml6gly8ugtd79l0dvqu8lnkpxj785srnphxgye95c5g5splaw6c: {
        recommendedClassIds: [
          'likenft1p4kl836zwc5h6284hpw5m4w0wwcqdjfxfse2dcf8325fmge8a29sh4hec3',
          'likenft1yvv59p9szvsdcv4dpyju8nr70jf56tklw4pchuy4pdkep6lvjdgslnqmmn',
          'likenft1e4espt79md5gg2lc0wqfu5zf75jsvce3qjfsxmfctdgyaede7vaq6qh94n',
          'likenft1za4e93x4tsn7fw3n8kqnh9kssqgwxd9xk35ysxm623d4zkcm7h4sx5wlsl',
          'likenft16cns9jk7cathhpe62v6jpyxam6z8ltdk3jw08xpmkrz53s3cknxqulpd0u',
          'likenft1fxu3hc4f0sn0kglq2xpdc50aezt4cyl986hlrysfn0r3u0ac3egsj6vcq2',
          'likenft1kmn4qyxus2ghxn3lde6xa2u0qt62vec7g7d5lt5a26l6f8vd9mashnhh6q',
        ],
      },
      likenft1p4kl836zwc5h6284hpw5m4w0wwcqdjfxfse2dcf8325fmge8a29sh4hec3: {
        recommendedClassIds: [
          'likenft1v6tnjf8ml6gly8ugtd79l0dvqu8lnkpxj785srnphxgye95c5g5splaw6c',
          'likenft1yvv59p9szvsdcv4dpyju8nr70jf56tklw4pchuy4pdkep6lvjdgslnqmmn',
          'likenft1e4espt79md5gg2lc0wqfu5zf75jsvce3qjfsxmfctdgyaede7vaq6qh94n',
          'likenft1za4e93x4tsn7fw3n8kqnh9kssqgwxd9xk35ysxm623d4zkcm7h4sx5wlsl',
          'likenft16cns9jk7cathhpe62v6jpyxam6z8ltdk3jw08xpmkrz53s3cknxqulpd0u',
          'likenft1fxu3hc4f0sn0kglq2xpdc50aezt4cyl986hlrysfn0r3u0ac3egsj6vcq2',
          'likenft1kmn4qyxus2ghxn3lde6xa2u0qt62vec7g7d5lt5a26l6f8vd9mashnhh6q',
        ],
      },
      likenft1qqqezqjuxfkrsykex6r2cdtakpkndg2wnnlsx894gmwq4p84868se52g6z: {
        recommendedClassIds: [
          'likenft178ta7ahnr532dwh0r73m0nrmyka698q6ay674qk2f9xwhwv78yqshry0gu',
          'likenft16eehkqvqq2yur9t0wkhqnrqu4lfkz3rquk0q44eew7zflazxg59qwlpaz8',
          'likenft17p4tzatg3eqkzq74rdx8zuatz2qp6fld6scluf7jvw3pe5gmkhtsxev7v8',
          'likenft1uzqfmsyp4sljmvm05n60gsan5j6s7rwyl9mv7jp9jec2unu7vfdsfq2gn0',
          'likenft1e44ecesxhhedttlt4s692t8l2hws08h67jg2xwwa8vpgg5hzt5rs3jmgtj',
          'likenft184l7uz0cud540kc7lnghdvan7649marxste4hmruq44f8c8zuw9shuknyk',
          'likenft1ekvx3en9l0640kv9fd5n5hvltwyfl443ymyu2cnhmalvjfy0cdcqqa3l6h',
          'likenft13t6k9estnn2cw52l5hzuww4dgehn9qqy5fjek70p0vfayqpxaepsnn377z',
          'likenft1jdrdmdpm3hkwnr42wttvs8e99p6j5n2j7mxfljmh0x2vkp6uhexsj2z83a',
        ],
      },
      likenft1ekvx3en9l0640kv9fd5n5hvltwyfl443ymyu2cnhmalvjfy0cdcqqa3l6h: {
        recommendedClassIds: [
          'likenft1mppyvyuvvft62yc66saee28q8nyl6xuh8vg332d8y9fn6gz9qtssj4trzl',
          'likenft154xhw0qyds5pgvsyc7379lnkyvwqkvv2zvmmh2gn5qrewljeqwys2sju6x',
          'likenft1j3k6celx0t7dfu0s8e9zlgsrdh4pxtts5qsrrk2fk2c37rqt4wkq0rmush',
          'likenft1wrskn9a683stkje3wdmcwuvpuqrp5eevjsnn9y4f55wlystzxausuhj3em',
          'likenft19hvxv9vyxwlulqnk54qu3y6nq4nwva0jdgvz8hgvtnfaw7wsnpdqpgxz7v',
          'likenft1aa48m08ep06m2celycx9qdsyl0vaqje2jlzdnufe64czevg2ed3syk9g6v',
          'likenft16cns9jk7cathhpe62v6jpyxam6z8ltdk3jw08xpmkrz53s3cknxqulpd0u',
          'likenft1d3lkwpmqdmdcw4mm7zevprudwrlrny2mxd8xuv7m5z2073leq75qj70hr5',
          'likenft1tlnn2x6864q6l5ag4fd87lc8eel7xafxnahd0836sap9eqshtuesesavum',
          'likenft17zq3r5t2qwfatle04sz680vl3ka0l8wfeu4n5jv26mnvawnfqs4qd773ny',
        ],
      },
      likenft1wrskn9a683stkje3wdmcwuvpuqrp5eevjsnn9y4f55wlystzxausuhj3em: {
        recommendedClassIds: [
          'likenft1mppyvyuvvft62yc66saee28q8nyl6xuh8vg332d8y9fn6gz9qtssj4trzl',
          'likenft154xhw0qyds5pgvsyc7379lnkyvwqkvv2zvmmh2gn5qrewljeqwys2sju6x',
          'likenft1j3k6celx0t7dfu0s8e9zlgsrdh4pxtts5qsrrk2fk2c37rqt4wkq0rmush',
          'likenft19hvxv9vyxwlulqnk54qu3y6nq4nwva0jdgvz8hgvtnfaw7wsnpdqpgxz7v',
          'likenft1aa48m08ep06m2celycx9qdsyl0vaqje2jlzdnufe64czevg2ed3syk9g6v',
          'likenft16cns9jk7cathhpe62v6jpyxam6z8ltdk3jw08xpmkrz53s3cknxqulpd0u',
          'likenft1d3lkwpmqdmdcw4mm7zevprudwrlrny2mxd8xuv7m5z2073leq75qj70hr5',
          'likenft1tlnn2x6864q6l5ag4fd87lc8eel7xafxnahd0836sap9eqshtuesesavum',
          'likenft17zq3r5t2qwfatle04sz680vl3ka0l8wfeu4n5jv26mnvawnfqs4qd773ny',
        ],
      },
      likenft1cyqljw4xk8d2ll7096mxdn33m2f2svxs4vtemkmzznavvyvdflnqeqvpl3: {
        recommendedClassIds: [
          'likenft15zhxvl0edcf5v9rja78ydydnqktaw4xjnfmmwretkhsnndgxkzpq6sydu8',
          'likenft178ta7ahnr532dwh0r73m0nrmyka698q6ay674qk2f9xwhwv78yqshry0gu',
          'likenft1n7yp5nq7ldfyhwg76r3gqm9nelzrpkmguygjcf3cu86l9asm37kscvlpv9',
          'likenft17sgwqc2t5rwfz70wp0xrh3av7knse7v6qh8ystf324rz3ny4w5hq2u6avh',
          'likenft1lr2rlzu246w289y0dr0973p6cj8daz9nfafr0fqscsyp3ufyp8ts46xqny',
          'likenft10t2eap9w3eu5rlm4jlxp5u7knmvkpnmv6js89uffprfsrcw0vrksxfxfg8',
          'likenft1k4tulfcxn2vre3y4crd5hmf7gpf2fwcqrdrx85tcscwvyr6cv9pqt9469l',
          'likenft1tgwav6zq3ean4ygz58hehlk3q5yghgtel97k260lugxqxszhcuws3pytae',
          'likenft1lawgf68z78wzfgpclusz547fp3urrj0mh2dp0yr4jedpzqjgjlzqyjz44e',
          'likenft1v6tnjf8ml6gly8ugtd79l0dvqu8lnkpxj785srnphxgye95c5g5splaw6c',
          'likenft1eps9f23m0qqc3px0nuw7kvz62ef3653vu4l6935drg4aura8mksqcztyxs',
        ],
      },
      'col_book_015e407c-98f6-4910-b551-430c2d130712': {
        recommendedClassIds: [
          'likenft1qqqezqjuxfkrsykex6r2cdtakpkndg2wnnlsx894gmwq4p84868se52g6z',
          'likenft17p4tzatg3eqkzq74rdx8zuatz2qp6fld6scluf7jvw3pe5gmkhtsxev7v8',
          'likenft1uzqfmsyp4sljmvm05n60gsan5j6s7rwyl9mv7jp9jec2unu7vfdsfq2gn0',
          'likenft1e44ecesxhhedttlt4s692t8l2hws08h67jg2xwwa8vpgg5hzt5rs3jmgtj',
          'likenft184l7uz0cud540kc7lnghdvan7649marxste4hmruq44f8c8zuw9shuknyk',
          'likenft1ekvx3en9l0640kv9fd5n5hvltwyfl443ymyu2cnhmalvjfy0cdcqqa3l6h',
          'likenft13t6k9estnn2cw52l5hzuww4dgehn9qqy5fjek70p0vfayqpxaepsnn377z',
          'likenft1jdrdmdpm3hkwnr42wttvs8e99p6j5n2j7mxfljmh0x2vkp6uhexsj2z83a',
        ],
      },
      likenft19ul7dkwj2p8fs3m6t4gy77p7mlgnyy3ehcmran2f4us8ctn6yw5sk7fx2z: {
        recommendedClassIds: [
          'likenft1dpegnjnklnh5g66nn06gz64wv0ec6k04f4v5lx69qlv6xlh493eqdq454j',
          'likenft1sr49shrvpvtxe2aknx08hlv7gv009ttevzs4yqunqu0xrl6shsmsrgwmuj',
          'likenft15entdx6z5l2r7wqc93fz32g53ve6lfk4tgqqzl8ereg7tvs3t9nq82n5m3',
          'likenft19v34xm3v4lz3kd8smrc8cgs8eq4m56q2h5lyzhma30fac3mncyns73afvl',
          'likenft1qu4n47auq7euecy4wprsauud4uxm28trjnzke5hc3vtfxzcctp3qvzyu87',
          'likenft1cxcpmtg7wz7xu7pnlpmxvfj82c44j3uc8634rgz6zddpew8fkx7smut5cl',
          'likenft1j556epeqvtck0kahas9tw8vp4j5vz832vxnypy949qh749d7ktnsjxhczv',
          'likenft138rp6lqc74clx4zz3l980lzjnusxwjpw2kwkln4t8kh08h2j6t5szwur6v',
          'likenft13mw4f4vy2gvw6t3037h968ay4zw82l9vygpcfmfgm83fmzrm2p9qvg9j9s',
          'likenft1rt0qh7mjxflm6ya500z4eputmw92nes0dn7zgqtw3zv3kdghqeks4mnzs3',
        ],
      },
      likenft15entdx6z5l2r7wqc93fz32g53ve6lfk4tgqqzl8ereg7tvs3t9nq82n5m3: {
        recommendedClassIds: [
          'likenft1dpegnjnklnh5g66nn06gz64wv0ec6k04f4v5lx69qlv6xlh493eqdq454j',
          'likenft19ul7dkwj2p8fs3m6t4gy77p7mlgnyy3ehcmran2f4us8ctn6yw5sk7fx2z',
          'likenft1sr49shrvpvtxe2aknx08hlv7gv009ttevzs4yqunqu0xrl6shsmsrgwmuj',
          'likenft19v34xm3v4lz3kd8smrc8cgs8eq4m56q2h5lyzhma30fac3mncyns73afvl',
          'likenft1qu4n47auq7euecy4wprsauud4uxm28trjnzke5hc3vtfxzcctp3qvzyu87',
          'likenft1cxcpmtg7wz7xu7pnlpmxvfj82c44j3uc8634rgz6zddpew8fkx7smut5cl',
          'likenft1j556epeqvtck0kahas9tw8vp4j5vz832vxnypy949qh749d7ktnsjxhczv',
          'likenft138rp6lqc74clx4zz3l980lzjnusxwjpw2kwkln4t8kh08h2j6t5szwur6v',
          'likenft13mw4f4vy2gvw6t3037h968ay4zw82l9vygpcfmfgm83fmzrm2p9qvg9j9s',
          'likenft1rt0qh7mjxflm6ya500z4eputmw92nes0dn7zgqtw3zv3kdghqeks4mnzs3',
        ],
      },
      likenft1ck8pv864x85ers8vdmuy6ekpd5kw0vhhnuvf8xzus3yarecxm8rs4xdsx6: {
        recommendedClassIds: [
          'likenft15zhxvl0edcf5v9rja78ydydnqktaw4xjnfmmwretkhsnndgxkzpq6sydu8',
          'likenft1k4tulfcxn2vre3y4crd5hmf7gpf2fwcqrdrx85tcscwvyr6cv9pqt9469l',
          'likenft139537w38zlyhk9yvha4n3fz386kaakq6t3p62t23z3xs8f3v257q4k6mw4',
          'likenft1hesnt4kv7hqjkg8m3tu7vxfxcfkxmwtz49z2s8dtz7389utg70vqp7ac9q',
          'likenft184l7uz0cud540kc7lnghdvan7649marxste4hmruq44f8c8zuw9shuknyk',
          'likenft16jguhkfa6nnu224fwjke2zv5f99n8wl9m097h46zqxnyu33j7rgs7f0xg3',
          'likenft1fjetqyl3knuaxjsxdf3kjlfejla4evla5gk6h0w6slehf3l2r4uqh43gey',
          'likenft1rfd3pp4q4hvuha8xpl8wzzf7uwannv0wm05s7jz34828e4qjnyzsfd9srz',
          'likenft150ndt6fffg2c0an7rdds2tfcpq4lqd6m7tr450lml8es57w752as26t75v',
          'likenft1l2v3qdv4qj0pyv2tmme42dv0962csaxxhezk04jr9s2rved08s4s4x6633',
          'likenft1ak9e8e08haqst8sc3lqawk30hxeqgfyxrsjy4gygajqmq2hh9xzquge3cg',
        ],
      },
      likenft15zhxvl0edcf5v9rja78ydydnqktaw4xjnfmmwretkhsnndgxkzpq6sydu8: {
        recommendedClassIds: [
          'likenft1ck8pv864x85ers8vdmuy6ekpd5kw0vhhnuvf8xzus3yarecxm8rs4xdsx6',
          'likenft1k4tulfcxn2vre3y4crd5hmf7gpf2fwcqrdrx85tcscwvyr6cv9pqt9469l',
          'likenft139537w38zlyhk9yvha4n3fz386kaakq6t3p62t23z3xs8f3v257q4k6mw4',
          'likenft1hesnt4kv7hqjkg8m3tu7vxfxcfkxmwtz49z2s8dtz7389utg70vqp7ac9q',
          'likenft184l7uz0cud540kc7lnghdvan7649marxste4hmruq44f8c8zuw9shuknyk',
          'likenft16jguhkfa6nnu224fwjke2zv5f99n8wl9m097h46zqxnyu33j7rgs7f0xg3',
          'likenft1fjetqyl3knuaxjsxdf3kjlfejla4evla5gk6h0w6slehf3l2r4uqh43gey',
          'likenft1rfd3pp4q4hvuha8xpl8wzzf7uwannv0wm05s7jz34828e4qjnyzsfd9srz',
          'likenft150ndt6fffg2c0an7rdds2tfcpq4lqd6m7tr450lml8es57w752as26t75v',
          'likenft1l2v3qdv4qj0pyv2tmme42dv0962csaxxhezk04jr9s2rved08s4s4x6633',
          'likenft1ak9e8e08haqst8sc3lqawk30hxeqgfyxrsjy4gygajqmq2hh9xzquge3cg',
        ],
      },
      likenft154xhw0qyds5pgvsyc7379lnkyvwqkvv2zvmmh2gn5qrewljeqwys2sju6x: {
        recommendedClassIds: [
          'likenft17zq3r5t2qwfatle04sz680vl3ka0l8wfeu4n5jv26mnvawnfqs4qd773ny',
          'likenft1ekvx3en9l0640kv9fd5n5hvltwyfl443ymyu2cnhmalvjfy0cdcqqa3l6h',
          'likenft1mppyvyuvvft62yc66saee28q8nyl6xuh8vg332d8y9fn6gz9qtssj4trzl',
          'likenft19hvxv9vyxwlulqnk54qu3y6nq4nwva0jdgvz8hgvtnfaw7wsnpdqpgxz7v',
          'likenft1j3k6celx0t7dfu0s8e9zlgsrdh4pxtts5qsrrk2fk2c37rqt4wkq0rmush',
          'likenft1aa48m08ep06m2celycx9qdsyl0vaqje2jlzdnufe64czevg2ed3syk9g6v',
          'likenft16cns9jk7cathhpe62v6jpyxam6z8ltdk3jw08xpmkrz53s3cknxqulpd0u',
          'likenft1wrskn9a683stkje3wdmcwuvpuqrp5eevjsnn9y4f55wlystzxausuhj3em',
          'likenft1d3lkwpmqdmdcw4mm7zevprudwrlrny2mxd8xuv7m5z2073leq75qj70hr5',
          'likenft1tlnn2x6864q6l5ag4fd87lc8eel7xafxnahd0836sap9eqshtuesesavum',
        ],
      },
      likenft1dpegnjnklnh5g66nn06gz64wv0ec6k04f4v5lx69qlv6xlh493eqdq454j: {
        recommendedClassIds: [
          'likenft19ul7dkwj2p8fs3m6t4gy77p7mlgnyy3ehcmran2f4us8ctn6yw5sk7fx2z',
          'likenft1sr49shrvpvtxe2aknx08hlv7gv009ttevzs4yqunqu0xrl6shsmsrgwmuj',
          'likenft15entdx6z5l2r7wqc93fz32g53ve6lfk4tgqqzl8ereg7tvs3t9nq82n5m3',
          'likenft19v34xm3v4lz3kd8smrc8cgs8eq4m56q2h5lyzhma30fac3mncyns73afvl',
          'likenft1qu4n47auq7euecy4wprsauud4uxm28trjnzke5hc3vtfxzcctp3qvzyu87',
          'likenft1cxcpmtg7wz7xu7pnlpmxvfj82c44j3uc8634rgz6zddpew8fkx7smut5cl',
          'likenft1j556epeqvtck0kahas9tw8vp4j5vz832vxnypy949qh749d7ktnsjxhczv',
          'likenft138rp6lqc74clx4zz3l980lzjnusxwjpw2kwkln4t8kh08h2j6t5szwur6v',
          'likenft13mw4f4vy2gvw6t3037h968ay4zw82l9vygpcfmfgm83fmzrm2p9qvg9j9s',
          'likenft1rt0qh7mjxflm6ya500z4eputmw92nes0dn7zgqtw3zv3kdghqeks4mnzs3',
        ],
      },
    };

export const SIGN_AUTHORIZATION_PERMISSIONS = [
  'profile',
  'read:nftbook',
  'write:nftbook',
  'read:nftcollection',
  'write:nftcollection',
];

export const SEARCH_SUGGESTIONS = [
  '小說',
  '旅遊',
  '報刊',
  '心靈',
  '運動',
  '董啟章',
  '李立峯',
  '新聞',
  '理財',
  '區塊鏈',
  '繪本',
  '高重建',
  '突破',
  '哲學',
  '法庭',
  '信仰',
  '邵家臻',
];

export const CHRISTMAS_CAMPAIGN_MIN_SPEND = 9;
export const CHRISTMAS_CAMPAIGN_COUPON = 'XMASREAD';

export const BOOKSTORE_CMS_CACHE_RESET_TIMESTAMP = 1739877450;
