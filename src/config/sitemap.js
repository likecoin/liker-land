const axios = require('axios');

/* Copied from constant due to nuxt.config.js is not es6 import syntax */
const { IS_TESTNET } = process.env;
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

/* actual routes logic */
async function getSitemapRoutes() {
  const [
    newClassRes,
    topClassRes,
    creatorRes,
    collectorRes,
  ] = await Promise.all(
    [
      getLatestNFTClasses,
      getTopNFTClasses,
      getTopCreators,
      getTopCollectors,
    ].map(url =>
      axios.get(url).catch(err => {
        // eslint-disable-next-line no-console
        console.error(err);
        return {};
      })
    )
  );
  const classes = [].concat(
    ...[newClassRes, topClassRes].map(r => (r.data || {}).classes || [])
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
  return nftDetailsPageRoutes.concat(portfolioPageRoutes);
}

module.exports = { getSitemapRoutes };
