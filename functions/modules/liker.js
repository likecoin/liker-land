const axios = require('axios').default;

const { LIKECOIN_API_BASE } = process.env;

exports.fetchLikerInfoByWallet = async walletAddress => {
  let avatar = `https://avatars.dicebear.com/api/identicon/${walletAddress}.svg?background=%23ffffff`;
  let displayName = walletAddress;
  let isSubscribedCivicLiker = false;
  try {
    const res = await axios.get(
      `${LIKECOIN_API_BASE}/users/addr/${walletAddress}/min`
    );
    ({ avatar, displayName, isSubscribedCivicLiker } = res.data);
  } catch (err) {
    if (!err.response || err.response.status !== 404) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }
  return {
    avatar,
    displayName,
    isSubscribedCivicLiker,
  };
};
