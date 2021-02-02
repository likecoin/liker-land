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
const { userCollection } = require('../util/firebase');
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
const LIKEPAY_REDIRECT_URI = `${EXTERNAL_URL}/civic/payment/likepay/redirect`;

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
const apiFetchUserPublicProfile = user =>
  axios.get(`${LIKECOIN_API_BASE}/users/id/${user}/min`);
const apiFetchLatestSuperLike = ({ limit, after, before }) =>
  axios.get(`${LIKECOIN_API_BASE}/like/share/latest`, {
    params: {
      limit,
      after,
      before,
    },
  });
const apiFetchFollowedSuperLikes = (users, { limit, after, before }) =>
  axios.post(
    `${LIKECOIN_API_BASE}/like/share/users/latest`,
    { users },
    {
      params: {
        limit,
        after,
        before,
      },
    }
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
const apiFetchSuggestedArticles = () =>
  axios.get(`${LIKECOIN_API_BASE}/like/suggest/all`);
const apiPostArticleForInfo = (url, req) =>
  sendAuthorizedRequest(req, Authorization =>
    axios.post(
      `${LIKECOIN_API_BASE}/like/info`,
      { url },
      { headers: { Authorization } }
    )
  );
const apiFetchArticleDetail = url =>
  axios.get(`${LIKECOIN_API_BASE}/like/info?url=${encodeURIComponent(url)}`);
const apiFetchFollowedUser = req =>
  sendAuthorizedRequest(req, Authorization =>
    axios.get(`${LIKECOIN_API_BASE}/users/follow/users`, {
      headers: { Authorization },
    })
  );
const apiPostFollowedUser = (userId, req) =>
  sendAuthorizedRequest(req, Authorization =>
    axios.post(
      `${LIKECOIN_API_BASE}/users/follow/users/${userId}`,
      {},
      {
        headers: { Authorization },
      }
    )
  );
const apiDeleteFollowedUser = (userId, req) =>
  sendAuthorizedRequest(req, Authorization =>
    axios.delete(`${LIKECOIN_API_BASE}/users/follow/users/${userId}`, {
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
const apiCivicLikerListSupportingUser = req =>
  sendAuthorizedRequest(req, Authorization =>
    axios.get(`${LIKE_CO_URL_BASE}/api/civic/support/users`, {
      headers: { Authorization },
    })
  );
const apiCivicLikerGetSupportingUser = (id, req) =>
  sendAuthorizedRequest(req, Authorization =>
    axios.get(`${LIKE_CO_URL_BASE}/api/civic/support/users/${id}`, {
      headers: { Authorization },
    })
  );
const apiCivicLikerSupportUser = (id, quantity, req) =>
  sendAuthorizedRequest(req, Authorization =>
    axios.post(
      `${LIKE_CO_URL_BASE}/api/civic/support/users/${id}`,
      { quantity },
      {
        headers: { Authorization },
      }
    )
  );
const apiCivicLikerDeleteSuppoUser = (id, req) =>
  sendAuthorizedRequest(req, Authorization =>
    axios.delete(`${LIKE_CO_URL_BASE}/api/civic/support/users/${id}`, {
      headers: { Authorization },
    })
  );
const apiCivicLikerGetMetadata = req =>
  sendAuthorizedRequest(req, Authorization =>
    axios.get(`${LIKE_CO_URL_BASE}/api/civic/metadata`, {
      headers: { Authorization },
    })
  );
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

const getLikePayURL = ({ amount, state, remarks, via, to, fee }) => {
  const qsPayload = {
    amount,
    to,
    redirect_uri: LIKEPAY_REDIRECT_URI,
  };
  if (state) qsPayload.state = state;
  if (remarks) qsPayload.remarks = remarks;
  if (via) qsPayload.via = via;
  if (fee) qsPayload.fee = fee;
  return `${LIKE_CO_URL_BASE}/in/widget/pay?${querystring.stringify(
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
  apiFetchUserPublicProfile,
  apiFetchLatestSuperLike,
  apiFetchFollowedSuperLikes,
  apiFetchUserSuperlike,
  apiFetchSuggestedArticles,
  apiPostArticleForInfo,
  apiFetchArticleDetail,
  apiFetchBookmarks,
  apiPostBookmarks,
  apiDeleteBookmarks,
  apiFetchFollowedUser,
  apiPostFollowedUser,
  apiDeleteFollowedUser,
  apiCivicLikerTrialEventById,
  apiCivicLikerJoinTrialEventById,
  apiCivicLikerListSupportingUser,
  apiCivicLikerGetSupportingUser,
  apiCivicLikerSupportUser,
  apiCivicLikerDeleteSuppoUser,
  apiCivicLikerGetMetadata,
  getOAuthURL,
  getOAuthCallbackAPI,
  getLikePayURL,
};
