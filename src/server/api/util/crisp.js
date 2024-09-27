// eslint-disable-next-line import/no-extraneous-dependencies
const crypto = require('crypto');
const Crisp = require('crisp-api');

const {
  CRISP_USER_HASH_SECRET,
  CRISP_PLUGIN_IDENTIFIER,
  CRISP_PLUGIN_KEY,
  CRISP_WEBSITE_ID,
} = require('../../config/config');

const CrispClient = new Crisp();

const isCrispPluginEnabled =
  CRISP_WEBSITE_ID && CRISP_PLUGIN_IDENTIFIER && CRISP_PLUGIN_KEY;
if (isCrispPluginEnabled) {
  CrispClient.authenticateTier(
    'plugin',
    CRISP_PLUGIN_IDENTIFIER,
    CRISP_PLUGIN_KEY
  );
}

function getCrispUserHash(email) {
  if (!CRISP_USER_HASH_SECRET || !email) return undefined;
  return crypto
    .createHmac('sha256', CRISP_USER_HASH_SECRET)
    .update(email)
    .digest('hex');
}

async function upsertCrispProfile(email, { displayName, wallet, loginMethod }) {
  if (!isCrispPluginEnabled) return;
  let people = null;
  try {
    people = await CrispClient.website.getPeopleProfile(
      CRISP_WEBSITE_ID,
      email
    );
  } catch {
    // do nothing
  }
  if (people) {
    await CrispClient.website.updatePeopleProfile(CRISP_WEBSITE_ID, email, {
      person: {
        nickname: displayName || wallet,
      },
      active: Date.now(),
    });
  } else {
    await CrispClient.website.addNewPeopleProfile(CRISP_WEBSITE_ID, {
      email,
      person: {
        nickname: displayName || wallet || email.split('@')[0],
      },
      active: Date.now(),
    });
  }
  await CrispClient.website.updatePeopleData(CRISP_WEBSITE_ID, email, {
    like_wallet: wallet,
    login_method: loginMethod,
  });
}

module.exports = {
  getCrispUserHash,
  upsertCrispProfile,
};
