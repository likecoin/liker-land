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

const { LIKECOIN_API_BASE } = process.env;

exports.fetchLikerInfoByWallet = async walletAddress => {
  let likerId = walletAddress;
  let avatar = `https://avatars.dicebear.com/api/identicon/${walletAddress}.svg?background=%23ffffff`;
  let displayName = walletAddress;
  let isSubscribedCivicLiker = false;
  try {
    const res = await axios.get(
      `${LIKECOIN_API_BASE}/users/addr/${walletAddress}/min`
    );
    ({ user: likerId, avatar, displayName, isSubscribedCivicLiker } = res.data);
  } catch (err) {
    if (!err.response || err.response.status !== 404) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }
  return {
    likerId,
    avatar,
    displayName,
    isSubscribedCivicLiker,
  };
};
