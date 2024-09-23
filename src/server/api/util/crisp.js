// eslint-disable-next-line import/no-extraneous-dependencies
const crypto = require('crypto');

const { CRISP_USER_HASH_SECRET } = require('../../config/config');

function getCrispUserHash(email) {
  if (!CRISP_USER_HASH_SECRET || !email) return undefined;
  return crypto
    .createHmac('sha256', CRISP_USER_HASH_SECRET)
    .update(email)
    .digest('hex');
}

module.exports = {
  getCrispUserHash,
};
