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
const getCreatorsFromAPIWallet = `${LIKECOIN_CHAIN_API}/likechain/likenft/v1/creator?collector=${LIKECOIN_NFT_API_WALLET}`;

/* actual routes logic */
async function getSitemapRoutes() {
  const [newClassRes, topClassRes, creatorRes] = await Promise.all(
    [getLatestNFTClasses, getTopNFTClasses, getCreatorsFromAPIWallet].map(url =>
      axios.get(url).catch(err => {
        console.error(err);
        return {};
      })
    )
  );
  const classes = [].concat(
    ...[newClassRes, topClassRes].map(r => (r.data || {}).classes || [])
  );
  const classIds = classes.map(c => c.id);
  const uniqueClassIdRoutes = [...new Set(classIds)].map(
    id => `/nft/class/${id}`
  );
  const users = ((creatorRes.data || {}).creators || []).map(c => c.account);
  const userIdRoutes = users.map(id => `/${id}`);
  return uniqueClassIdRoutes.concat(userIdRoutes);
}

module.exports = { getSitemapRoutes };
