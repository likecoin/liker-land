import * as types from '@/store/mutation-types';
import * as api from '@/util/api';
import { updateSentryUser } from '@/util/EventLogger';
import { normalizeLocaleForLikeCo } from '@/locales';

export async function postLoginToken(
  { commit, dispatch },
  { authCode, state }
) {
  const user = await this.$api.$post(api.getOAuthCallbackAPI(), {
    authCode,
    state,
  });
  commit(types.USER_SET_USER_INFO, user);
  if (user && user.locale) {
    dispatch('setLocale', user.locale);
  }
  if (this.$sentry) updateSentryUser(this, user);
  return user;
}

export async function fetchLoginStatus({ commit, dispatch }) {
  try {
    const user = await this.$api.$get(api.getLoginStatus());
    commit(types.USER_SET_USER_INFO, user);
    if (user && user.locale) {
      dispatch('setLocale', user.locale);
    }

    if (this.$sentry) updateSentryUser(this, user);
    return user;
  } catch (err) {
    return false;
  }
}

export async function userLogout({ commit }) {
  await this.$api.$post(api.getLogoutAPI());
  commit(types.USER_SET_USER_INFO, {});
  if (this.$sentry) updateSentryUser(this, { user: null });
  if (this.$crisp) {
    this.$crisp.push(['do', 'session:reset']);
  }
}

export function setUserCivicLiker({ commit }, { civicLikerVersion = 1 } = {}) {
  commit(types.USER_UPDATE_USER_INFO, {
    isSubscribedCivicLiker: true,
    civicLikerVersion,
    subscriptionInfo: {},
  });
}

export async function updatePreferences(
  { dispatch, commit, getters },
  { locale, creatorPitch } = {}
) {
  const preferences = {};
  if (locale) {
    dispatch('setLocale', locale);
    preferences.locale = normalizeLocaleForLikeCo(locale);
  }
  if (creatorPitch !== undefined && typeof creatorPitch === 'string') {
    preferences.creatorPitch = creatorPitch;
    commit(types.USER_UPDATE_USER_INFO, { creatorPitch });
  }
  if (Object.keys(preferences).length) {
    if (getters.getUserId)
      await this.$api.$post(api.userPreferences(), preferences);
  }
}
