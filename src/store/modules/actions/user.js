import * as types from '@/store/mutation-types';
import * as api from '@/util/api';
import {
  updateSentryUser,
  updateCrispUser,
  setTrackerUser,
} from '@/util/EventLogger';
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
  if (this.$crisp) updateCrispUser(this, user);
  await setTrackerUser(this, user);
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
    if (this.$crisp) updateCrispUser(this, user);
    return user;
  } catch (err) {
    return false;
  }
}

export async function userLogout({ commit }) {
  await this.$api.$post(api.getLogoutAPI());
  commit(types.USER_SET_USER_INFO, {});
  commit(types.READER_CLEAR_FOR_LOGOUT);
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

export async function fetchUserSubscriptionInfo({ commit }) {
  const info = await this.$api.$get(api.getStripePaymentStatusAPI());
  commit(types.USER_SET_SUBSCRIPTION_INFO, info);
  return info;
}

export async function cancelUserSubscription({ dispatch }) {
  await this.$api.$delete(api.getStripePaymentStatusAPI());
  return dispatch('fetchUserSubscriptionInfo');
}

export async function resumeCanceledSubscription({ dispatch }) {
  await this.$api.$delete(api.getStripePaymentStatusAPI({ resume: true }));
  return dispatch('fetchUserSubscriptionInfo');
}

export async function updatePreferences(
  { dispatch },
  { locale, creatorPitch } = { creatorPitch: '' }
) {
  const preferences = {
    creatorPitch,
  };
  if (locale) {
    dispatch('setLocale', locale);
    preferences.locale = normalizeLocaleForLikeCo(locale);
  }
  if (Object.keys(preferences).length) {
    await this.$api.$post(api.userPreferences(), preferences);
  }
}
