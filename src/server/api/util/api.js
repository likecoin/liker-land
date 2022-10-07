const http = require('http');
const https = require('https');
const Axios = require('axios');
const querystring = require('querystring');
const {
  IS_TESTNET,
  EXTERNAL_URL: CONFIG_EXTERNAL_URL,
  LIKE_CO_CLIENT_ID,
  LIKE_CO_CLIENT_SECRET,
} = require('../../config/config');
const { userCollection } = require('../../modules/firebase');
const { OAUTH_SCOPE_REQUEST } = require('../constant');

const LIKECOIN_API_BASE = IS_TESTNET
  ? 'https://api.rinkeby.like.co'
  : 'https://api.like.co';
const LIKE_CO_URL_BASE = IS_TESTNET
  ? 'https://rinkeby.like.co'
  : 'https://like.co';
const EXTERNAL_URL =
  CONFIG_EXTERNAL_URL ||
  (IS_TESTNET ? 'https://rinkeby.liker.land' : 'https://liker.land');
const OAUTH_REDIRECT_URI = `${EXTERNAL_URL}/oauth/redirect`;

const axios = Axios.create({
  timeout: 60000,
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
});

const apiRefreshAccessToken = async req => {
  try {
    const { user } = req.session;
    const userDoc = await userCollection.doc(user).get();
    if (!userDoc.exists || !userDoc.data().refreshToken) {
      req.session = null;
      return false;
    }
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
const apiFetchUserPreferences = req =>
  sendAuthorizedRequest(req, Authorization =>
    axios.get(`${LIKECOIN_API_BASE}/users/preferences`, {
      headers: { Authorization },
    })
  );
const apiUpdateUserPreferences = (req, params) =>
  sendAuthorizedRequest(req, Authorization =>
    axios.post(`${LIKECOIN_API_BASE}/users/preferences`, params, {
      headers: { Authorization },
    })
  );
const apiFetchUserSuperLikeStatus = (req, tz = 8) =>
  sendAuthorizedRequest(req, Authorization =>
    axios.get(`${LIKECOIN_API_BASE}/like/share/self?tz=${tz}`, {
      headers: { Authorization },
    })
  );
const apiFetchUserSuperlike = (user, { limit, after, before, filter }) =>
  axios.get(`${LIKECOIN_API_BASE}/like/share/user/${user}/latest`, {
    params: {
      limit,
      after,
      before,
      filter,
    },
  });
const apiFetchFollowedUser = req =>
  sendAuthorizedRequest(req, Authorization =>
    axios.get(`${LIKECOIN_API_BASE}/users/follow/users`, {
      headers: { Authorization },
    })
  );
const apiFetchBookmarks = req =>
  sendAuthorizedRequest(req, Authorization =>
    axios.get(`${LIKECOIN_API_BASE}/users/bookmarks`, {
      headers: { Authorization },
    })
  );
const apiPostBookmarks = (url, req) =>
  sendAuthorizedRequest(req, Authorization =>
    axios.post(
      `${LIKECOIN_API_BASE}/users/bookmarks`,
      { url },
      {
        headers: { Authorization },
      }
    )
  );
const apiDeleteBookmarks = (url, req) =>
  sendAuthorizedRequest(req, Authorization =>
    axios.delete(
      `${LIKECOIN_API_BASE}/users/bookmarks/?url=${encodeURIComponent(url)}`,
      {
        headers: { Authorization },
      }
    )
  );
const apiCivicLikerGetStaking = req =>
  sendAuthorizedRequest(req, Authorization =>
    axios.get(
      `${LIKE_CO_URL_BASE}/api/civic/staking?${querystring.stringify(
        req.query
      )}`,
      {
        headers: { Authorization },
      }
    )
  );
const apiCivicLikerGetStakingInfo = () =>
  axios.get(`${LIKE_CO_URL_BASE}/api/civic/staking/info`);
const getOAuthURL = ({
  language,
  state,
  isRegister,
  from,
  referrer,
  utmSource,
}) => {
  const qsPayload = {
    language,
    client_id: LIKE_CO_CLIENT_ID,
    redirect_uri: OAUTH_REDIRECT_URI,
    scope: OAUTH_SCOPE_REQUEST.join(' '),
  };
  if (state) qsPayload.state = state;
  if (from) qsPayload.from = from;
  if (referrer) qsPayload.referrer = referrer;
  if (isRegister) qsPayload.register = '1';
  if (utmSource) qsPayload.utm_source = utmSource;
  return `${LIKE_CO_URL_BASE}/in/oauth?${querystring.stringify(qsPayload)}`;
};

const getOAuthCallbackAPI = authCode => {
  const qsPayload = {
    client_id: LIKE_CO_CLIENT_ID,
    client_secret: LIKE_CO_CLIENT_SECRET,
    grant_type: 'authorization_code',
    redirect_uri: OAUTH_REDIRECT_URI,
    code: authCode,
  };
  return `${LIKECOIN_API_BASE}/oauth/access_token?${querystring.stringify(
    qsPayload
  )}`;
};

module.exports = {
  EXTERNAL_URL,
  apiRefreshAccessToken,
  apiFetchUserProfile,
  apiFetchUserPreferences,
  apiUpdateUserPreferences,
  apiFetchUserSuperLikeStatus,
  apiFetchUserSuperlike,
  apiFetchBookmarks,
  apiPostBookmarks,
  apiDeleteBookmarks,
  apiFetchFollowedUser,
  apiCivicLikerGetStaking,
  apiCivicLikerGetStakingInfo,
  getOAuthURL,
  getOAuthCallbackAPI,
};
