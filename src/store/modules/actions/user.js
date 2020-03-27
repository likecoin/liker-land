import * as types from '@/store/mutation-types';
import * as api from '@/util/api';
import {
  updateSentryUser,
  updateIntercomUser,
  setTrackerUser,
} from '@/util/EventLogger';

export async function postLoginToken(
  { commit, dispatch },
  { authCode, state }
) {
  const user = await this.$axios.$post(api.getOAuthCallbackAPI(), {
    authCode,
    state,
  });
  commit(types.USER_SET_USER_INFO, user);
  if (user && user.locale) {
    dispatch('setLocale', user.locale);
  }
  if (this.$sentry) updateSentryUser(this, user);
  if (this.$intercom) updateIntercomUser(this, user);
  await setTrackerUser(user);
  return user;
}

export async function fetchLoginStatus({ commit, dispatch }) {
  try {
    const user = await this.$axios.$get(api.getLoginStatus());
    commit(types.USER_SET_USER_INFO, user);
    if (user && user.locale) {
      dispatch('setLocale', user.locale);
    }

    if (this.$sentry) updateSentryUser(this, user);
    if (this.$intercom) updateIntercomUser(this, user);
    return user;
  } catch (err) {
    return false;
  }
}

export async function userLogout({ commit }) {
  await this.$axios.$post(api.getLogoutAPI());
  commit(types.USER_SET_USER_INFO, {});
  commit(types.READER_CLEAR_FOR_LOGOUT);
  if (this.$sentry) updateSentryUser(this, { user: null });
  if (this.$intercom && this.$intercom.booted) {
    this.$intercom.shutdown();
    this.$intercom.booted = false;
  }
}

export function setUserCivicLiker({ commit }) {
  commit(types.USER_UPDATE_USER_INFO, { isSubscribedCivicLiker: true });
}

export async function fetchUserSubscriptionInfo({ commit }) {
  const info = await this.$axios.$get(api.getStripePaymentStatusAPI());
  commit(types.USER_SET_SUBSCRIPTION_INFO, info);
  return info;
}

export async function cancelUserSubscription({ dispatch }) {
  await this.$axios.$delete(api.getStripePaymentStatusAPI());
  return dispatch('fetchUserSubscriptionInfo');
}
