const http = require('http');
const https = require('https');
const Axios = require('axios');
const {
  IS_TESTNET,
  EXTERNAL_URL: CONFIG_EXTERNAL_URL,
  LIKE_CO_CLIENT_ID,
  LIKE_CO_CLIENT_SECRET,
} = require('../../config/config');
const { userCollection } = require('../util/firebase');

const LIKECOIN_API_BASE = IS_TESTNET
  ? 'https://api.rinkeby.like.co'
  : 'https://api.like.co';
const LIKE_CO_URL_BASE = IS_TESTNET
  ? 'https://rinkeby.like.co'
  : 'https://like.co';
const EXTERNAL_URL =
  CONFIG_EXTERNAL_URL ||
  (IS_TESTNET ? 'https://rinkeby.liker.land' : 'https://liker.land');
const OAUTH_REDIRECT_URI = encodeURIComponent(`${EXTERNAL_URL}/oauth/redirect`);

const axios = Axios.create({
  timeout: 60000,
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
});

const apiRefreshAccessToken = async req => {
  const { user } = req.session;
  const userDoc = await userCollection.doc(user).get();
  if (!userDoc.exists || !userDoc.data().refreshToken) {
    req.session = null;
    return false;
  }
  try {
    const { data } = await apiRefreshToken(userDoc.data().refreshToken);
    if (!data.access_token) throw new Error('no access_token in reply');
    req.session.accessToken = data.access_token;
    return true;
  } catch (err) {
    const msg = (err.response && err.response.data) || err.message || err;
    console.error(msg); // eslint-disable-line no-console
    req.session = null;
    return false;
  }
};

async function sendAuthorizedRequest(req, callback) {
  let Authorization = `Bearer ${req.session.accessToken}`;
  try {
    const res = await callback(Authorization);
    return res;
  } catch (err) {
    if (!err.response || err.response.status !== 401) {
      throw err;
    }
    if (await apiRefreshAccessToken(req)) {
      Authorization = `Bearer ${req.session.accessToken}`;
      return callback(Authorization);
    }
    throw err;
  }
}

const apiRefreshToken = refreshToken =>
  axios.post(
    `${LIKECOIN_API_BASE}/oauth/access_token?client_id=${LIKE_CO_CLIENT_ID}&client_secret=${LIKE_CO_CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${refreshToken}`
  );
const apiFetchUserProfile = req =>
  sendAuthorizedRequest(req, Authorization =>
    axios.get(`${LIKECOIN_API_BASE}/users/profile`, {
      headers: { Authorization },
    })
  );
const apiFetchUserPublicProfile = user =>
  axios.get(`${LIKECOIN_API_BASE}/users/id/${user}/min`);
const apiFetchLikedUser = req =>
  sendAuthorizedRequest(req, Authorization =>
    axios.get(`${LIKECOIN_API_BASE}/like/info/liked/list`, {
      headers: { Authorization },
    })
  );
const apiFetchFollowedArticles = (users, { limit, after, before }) =>
  axios.post(
    `${LIKECOIN_API_BASE}/like/info/users/latest`,
    { users },
    {
      params: {
        limit,
        after,
        before,
      },
    }
  );
const apiFetchUserArticles = (user, { limit, after, before }) =>
  axios.get(`${LIKECOIN_API_BASE}/like/info/user/${user}/latest`, {
    params: {
      limit,
      after,
      before,
    },
  });
const apiFetchSuggestedArticles = () =>
  axios.get(`${LIKECOIN_API_BASE}/like/suggest/all`);
const apiFetchArticleDetail = url =>
  axios.get(`${LIKECOIN_API_BASE}/like/info?url=${encodeURIComponent(url)}`);
const apiFetchCivicCSOnline = () =>
  axios.get(`${LIKE_CO_URL_BASE}/api/civic/csonline`);
const apiCivicLikerTrialEventById = id =>
  axios.get(`${LIKE_CO_URL_BASE}/api/civic/trial/events/${id}`);
const apiCivicLikerJoinTrialEventById = (id, req) =>
  sendAuthorizedRequest(req, Authorization =>
    axios.post(
      `${LIKE_CO_URL_BASE}/api/civic/trial/events/${id}/join`,
      {},
      {
        headers: { Authorization },
      }
    )
  );
const getOAuthURL = ({ state, isLogin }) => {
  let oAuthUrl = `${LIKE_CO_URL_BASE}/in/oauth?client_id=${LIKE_CO_CLIENT_ID}&redirect_uri=${OAUTH_REDIRECT_URI}&scope=profile%20email%20read%3Alike.info%20read%3Acivic_liker%20write%3Acivic_liker&state=${state}`;
  if (isLogin) oAuthUrl = `${oAuthUrl}&login=1`;
  return oAuthUrl;
};
const getOAuthCallbackAPI = authCode =>
  `${LIKECOIN_API_BASE}/oauth/access_token?client_id=${LIKE_CO_CLIENT_ID}&client_secret=${LIKE_CO_CLIENT_SECRET}&grant_type=authorization_code&redirect_uri=${OAUTH_REDIRECT_URI}&auth_code=${authCode}`;

module.exports = {
  apiRefreshAccessToken,
  apiFetchUserProfile,
  apiFetchUserPublicProfile,
  apiFetchLikedUser,
  apiFetchFollowedArticles,
  apiFetchUserArticles,
  apiFetchSuggestedArticles,
  apiFetchArticleDetail,
  apiFetchCivicCSOnline,
  apiCivicLikerTrialEventById,
  apiCivicLikerJoinTrialEventById,
  getOAuthURL,
  getOAuthCallbackAPI,
};
