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

/* actual routes logic */
async function getSitemapRoutes() {
  const res = await Promise.all(
    [getLatestNFTClasses, getTopNFTClasses].map(url =>
      axios.get(url).catch(err => {
        console.error(err);
        return {};
      })
    )
  );
  const classes = [].concat(...res.map(r => (r.data || {}).classes || []));
  const ids = classes.map(c => c.id);
  const uniqueIdRoutes = [...new Set(ids)].map(id => `/nft/class/${id}`);
  return uniqueIdRoutes;
}

module.exports = { getSitemapRoutes };
