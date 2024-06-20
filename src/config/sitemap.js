const Axios = require('axios');
const HttpAgent = require('agentkeepalive');

const { HttpsAgent } = HttpAgent;
const axios = Axios.create({
  timeout: 60000,
  httpAgent: new HttpAgent(),
  httpsAgent: new HttpsAgent(),
  maxRedirects: 10,
  maxContentLength: 50 * 1000 * 1000,
});

const locales = ['zh-Hant', 'en'];
/* Copied from constant due to nuxt.config.js is not es6 import syntax */
const { IS_TESTNET } = process.env;
const EXTERNAL_HOST = IS_TESTNET
  ? 'https://rinkeby.liker.land'
  : 'https://liker.land';
const LIKE_CO_API = IS_TESTNET
  ? 'https://api.rinkeby.like.co'
  : 'https://api.like.co';
const LIKECOIN_CHAIN_API = IS_TESTNET
  ? 'https://node.testnet.like.co'
  : 'https://mainnet-node.like.co';
const LIKECOIN_NFT_API_WALLET = IS_TESTNET
  ? 'like1yney2cqn5qdrlc50yr5l53898ufdhxafqz9gxp'
  : 'like17m4vwrnhjmd20uu7tst7nv0kap6ee7js69jfrs';
const getLatestNFTClasses = `${LIKECOIN_CHAIN_API}/likechain/likenft/v1/class?reverse=true`;
const getTopNFTClasses = `${LIKECOIN_CHAIN_API}/likechain/likenft/v1/ranking?ignore_list=${LIKECOIN_NFT_API_WALLET}`;
const getTopCreators = `${LIKECOIN_CHAIN_API}/likechain/likenft/v1/creator?ignore_list=${LIKECOIN_NFT_API_WALLET}`;
const getTopCollectors = `${LIKECOIN_CHAIN_API}/likechain/likenft/v1/collector?ignore_list=${LIKECOIN_NFT_API_WALLET}`;
const getLatestBooks = `${LIKE_CO_API}/likernft/book/store/list`;
const getBookstoreItemsFromCMS = `${EXTERNAL_HOST}/api/bookstore/lists/all`;

/* actual routes logic */
async function getSitemapRoutes() {
  const [
    newClassRes,
    topClassRes,
    creatorRes,
    collectorRes,
    newBookRes,
    cmsBookRes,
  ] = await Promise.all(
    [
      getLatestNFTClasses,
      getTopNFTClasses,
      getTopCreators,
      getTopCollectors,
      getLatestBooks,
      getBookstoreItemsFromCMS,
    ].map(url =>
      axios.get(url).catch(err => {
        // eslint-disable-next-line no-console
        console.error(err);
        return {};
      })
    )
  );
  const classes = [].concat(
    ...[newClassRes, topClassRes].map(r => (r.data || {}).classes || []),
    ...((newBookRes.data || {}).list || []).map(b => ({ id: b.classId })),
    ...((cmsBookRes.data || {}).records || []).map(b => ({
      id: b.classId,
    }))
  );
  const classIds = classes.map(c => c.id);
  const nftDetailsPageRoutes = [...new Set(classIds)].map(
    id => `/nft/class/${id}`
  );
  const creator = ((creatorRes.data || {}).creators || []).map(c => c.account);
  const collectors = ((collectorRes.data || {}).collectors || []).map(
    c => c.account
  );
  const portfolioPageRoutes = [...new Set(creator.concat(collectors))].map(
    id => `/${id}`
  );
  return nftDetailsPageRoutes.concat(portfolioPageRoutes).map(url => ({
    url: `/${locales[0]}${url}`,
    links: locales.map(lang => ({ lang, url: `/${lang}${url}` })),
  }));
}

module.exports = { getSitemapRoutes };
