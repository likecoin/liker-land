import * as types from '@/store/mutation-types';
import * as api from '@/util/api';

function updateSentryUser($sentry, { user, displayName }) {
  const opt = {
    id: user,
    username: displayName || user,
  };
  $sentry.configureScope(scope => {
    scope.setUser(opt);
  });
}

function updateIntercomUser(
  $intercom,
  { user, intercomToken, displayName, email }
) {
  if ($intercom.booted) {
    const opt = {
      user_id: user,
      user_hash: intercomToken,
      name: displayName || user,
      email,
    };
    $intercom.update(opt);
  }
}

export async function postLoginToken({ commit }, { authCode, state }) {
  const user = await this.$axios.$post(api.getOAuthCallbackAPI(), {
    authCode,
    state,
  });
  commit(types.USER_SET_USER_INFO, user);
  if (this.$sentry) updateSentryUser(this.$sentry, user);
  if (this.$intercom) updateIntercomUser(this.$intercom, user);
  return user;
}

export async function fetchLoginStatus({ commit }) {
  try {
    const user = await this.$axios.$get(api.getLoginStatus());
    commit(types.USER_SET_USER_INFO, user);
    if (this.$sentry) updateSentryUser(this.$sentry, user);
    if (this.$intercom) updateIntercomUser(this.$intercom, user);
    return user;
  } catch (err) {
    return false;
  }
}

export async function userLogout({ commit }) {
  await this.$axios.$post(api.getLogoutAPI());
  commit(types.USER_SET_USER_INFO, {});
  commit(types.READER_CLEAR_FOR_LOGOUT);
  if (this.$sentry) updateSentryUser(this.$sentry, { user: null });
  if (this.$intercom && this.$intercom.booted) {
    this.$intercom.shutdown();
    this.$intercom.booted = false;
  }
}

export function setUserCivicLiker({ commit }) {
  commit(types.USER_UPDATE_USER_INFO, { isSubscribedCivicLiker: true });
}
